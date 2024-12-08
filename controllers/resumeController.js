// controllers/resumeController.js

const Resume = require('../models/Resume');
const CustomError = require('../utils/customError');
const path = require('path');
const fs = require('fs');

// 이력서 작성
exports.createResume = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    let filePath = null;

    if (req.file) {
      filePath = `/uploads/resumes/${req.file.filename}`;
    }

    const resume = new Resume({
      user: req.user._id,
      title,
      content,
      file: filePath,
    });

    await resume.save();

    res.status(201).json({ status: 'success', data: resume });
  } catch (err) {
    next(err);
  }
};

// 이력서 수정
exports.updateResume = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      throw new CustomError(404, '이력서를 찾을 수 없습니다.');
    }

    if (title) resume.title = title;
    if (content) resume.content = content;

    if (req.file) {
      // 기존 파일 삭제
      if (resume.file) {
        const existingFilePath = path.join(__dirname, '..', resume.file);
        fs.unlink(existingFilePath, (err) => {
          if (err) {
            console.error('파일 삭제 오류:', err);
          }
        });
      }
      resume.file = `/uploads/resumes/${req.file.filename}`;
    }

    resume.updatedAt = Date.now();
    await resume.save();

    res.json({ status: 'success', data: resume });
  } catch (err) {
    next(err);
  }
};

// 이력서 조회
exports.getResumes = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalItems = await Resume.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = parseInt(page, 10);

    const resumes = await Resume.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: 'success',
      data: resumes,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 이력서 삭제
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      throw new CustomError(404, '이력서를 찾을 수 없습니다.');
    }

    // 파일 삭제
    if (resume.file) {
      const filePath = path.join(__dirname, '..', resume.file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('파일 삭제 오류:', err);
        }
      });
    }

    res.json({ status: 'success', message: '이력서가 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

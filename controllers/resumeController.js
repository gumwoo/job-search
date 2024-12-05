// controllers/resumeController.js

const Resume = require('../models/Resume');
const CustomError = require('../utils/customError');

// 이력서 작성
exports.createResume = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const resume = new Resume({
      user: req.user._id,
      title,
      content,
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

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, updatedAt: Date.now() },
      { new: true },
    );

    if (!resume) {
      throw new CustomError(404, '이력서를 찾을 수 없습니다.');
    }

    res.json({ status: 'success', data: resume });
  } catch (err) {
    next(err);
  }
};

// 이력서 조회
exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ updatedAt: -1 });

    res.json({ status: 'success', data: resumes });
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

    res.json({ status: 'success', message: '이력서가 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

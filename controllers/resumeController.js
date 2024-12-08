// controllers/resumeController.js

const path = require('path');

/**
 * ResumeController 클래스는 이력서와 관련된 모든 비즈니스 로직을 처리합니다.
 */
class ResumeController {
  /**
   * ResumeController 생성자
   * @param {Model} resumeModel - Resume Mongoose 모델
   * @param {CustomError} customError - 커스텀 에러 클래스
   */
  constructor(resumeModel, customError) {
    this.Resume = resumeModel;
    this.CustomError = customError;
  }

  /**
   * 이력서를 작성합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 파일 업로드 오류 또는 데이터베이스 오류 시 발생
   */
  async createResume(req, res, next) {
    try {
      const { title, content } = req.body;
      const userId = req.user._id;

      if (!req.file) {
        throw new this.CustomError(400, '이력서 파일을 업로드해주세요.');
      }

      const resume = new this.Resume({
        user: userId,
        title,
        content,
        file: `/uploads/resumes/${req.file.filename}`,
      });

      await resume.save();

      res.status(201).json({ status: 'success', data: resume });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 이력서 목록을 조회합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 데이터베이스 오류 시 발생
   */
  async getResumes(req, res, next) {
    try {
      const userId = req.user._id;
      const { page = 1 } = req.query;
      const limit = 20;
      const skip = (page - 1) * limit;

      const query = { user: userId };

      const totalItems = await this.Resume.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
      const currentPage = parseInt(page, 10);

      const resumes = await this.Resume.find(query)
        .sort({ createdAt: -1 })
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
  }

  /**
   * 이력서를 수정합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 이력서 미존재 시 발생
   */
  async updateResume(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user._id;

      // 이력서 존재 여부 확인
      const resume = await this.Resume.findOne({ _id: id, user: userId });
      if (!resume) {
        throw new this.CustomError(404, '이력서를 찾을 수 없습니다.');
      }

      // 파일 업로드 시 기존 파일 삭제 로직 필요
      if (req.file) {
        // 기존 파일 삭제 로직을 추가 (예: fs.unlink)
        // 예시:
        // const fs = require('fs');
        // fs.unlink(path.join(__dirname, '..', resume.file), (err) => {
        //   if (err) console.error(err);
        // });
        updateData.file = `/uploads/resumes/${req.file.filename}`;
      }

      const updatedResume = await this.Resume.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      res.json({ status: 'success', data: updatedResume });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 이력서를 삭제합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 이력서 미존재 시 발생
   */
  async deleteResume(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const resume = await this.Resume.findOne({ _id: id, user: userId });
      if (!resume) {
        throw new this.CustomError(404, '이력서를 찾을 수 없습니다.');
      }

      // 파일 삭제 로직 추가 (예: fs.unlink)
      // 예시:
      // const fs = require('fs');
      // fs.unlink(path.join(__dirname, '..', resume.file), (err) => {
      //   if (err) console.error(err);
      // });

      await this.Resume.deleteOne({ _id: id });

      res.json({ status: 'success', message: '이력서가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ResumeController;

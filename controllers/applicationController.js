// controllers/ApplicationController.js

/**
 * ApplicationController 클래스는 지원과 관련된 모든 비즈니스 로직을 처리합니다.
 */
class ApplicationController {
  /**
   * ApplicationController 생성자
   * @param {Model} applicationModel - Application Mongoose 모델
   * @param {Model} jobModel - Job Mongoose 모델
   * @param {Model} resumeModel - Resume Mongoose 모델
   * @param {CustomError} CustomError - 커스텀 에러 클래스
   */
  constructor(applicationModel, jobModel, resumeModel, CustomError) {
    this.Application = applicationModel;
    this.Job = jobModel;
    this.Resume = resumeModel;
    this.CustomError = CustomError;
  }

  /**
   * 사용자가 채용 공고에 지원합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 중복 지원 또는 채용 공고/이력서 미존재 시 발생
   */
  async applyJob(req, res, next) {
    try {
      const { jobId, resumeId } = req.body;

      // 중복 지원 여부 확인
      const existingApplication = await this.Application.findOne({ user: req.user._id, job: jobId });
      if (existingApplication) {
        throw new this.CustomError(400, '이미 지원한 공고입니다.');
      }

      // 채용 공고 존재 여부 확인
      const job = await this.Job.findById(jobId);
      if (!job) {
        throw new this.CustomError(404, '채용 공고를 찾을 수 없습니다.');
      }

      // 이력서 존재 여부 확인 (선택 사항)
      let resume = null;
      if (resumeId) {
        resume = await this.Resume.findOne({ _id: resumeId, user: req.user._id });
        if (!resume) {
          throw new this.CustomError(404, '이력서를 찾을 수 없습니다.');
        }
      }

      const application = new this.Application({
        user: req.user._id,
        job: jobId,
        resume: resumeId || null, // 이력서 첨부 (선택)
        status: 'Pending', // 초기 상태 설정
        appliedAt: Date.now(),
      });

      await application.save();

      res.status(201).json({ status: 'success', data: application });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 지원 내역을 조회합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   */
  async getApplications(req, res, next) {
    try {
      const { page = 1, status, sortBy } = req.query;
      const limit = 20;
      const skip = (page - 1) * limit;

      const query = { user: req.user._id };
      if (status) {
        query.status = status;
      }

      const totalItems = await this.Application.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
      const currentPage = parseInt(page, 10);

      let sortCriteria = { appliedAt: -1 }; // 기본 정렬: 최신순
      if (sortBy === 'date') {
        sortCriteria = { appliedAt: -1 };
      } else if (sortBy === 'status') {
        sortCriteria = { status: 1 };
      }

      const applications = await this.Application.find(query)
        .populate('job')
        .populate('resume') // 이력서 정보 추가
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit);

      res.json({
        status: 'success',
        data: applications,
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
   * 지원을 취소합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 지원 내역 미존재 또는 취소 불가능한 상태일 경우 발생
   */
  async cancelApplication(req, res, next) {
    try {
      const applicationId = req.params.id;
      const application = await this.Application.findOne({ _id: applicationId, user: req.user._id });

      if (!application) {
        throw new this.CustomError(404, '지원 내역을 찾을 수 없습니다.');
      }

      if (application.status !== 'Pending') {
        throw new this.CustomError(400, '취소할 수 없는 지원 상태입니다.');
      }

      application.status = 'Cancelled';
      await application.save();

      res.json({ status: 'success', message: '지원이 취소되었습니다.' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ApplicationController;

// controllers/jobController.js

/**
 * JobController 클래스는 채용 공고와 관련된 모든 비즈니스 로직을 처리합니다.
 */
class JobController {
  /**
   * JobController 생성자
   * @param {Model} jobModel - Job Mongoose 모델
   * @param {Model} companyModel - Company Mongoose 모델
   * @param {CustomError} customError - 커스텀 에러 클래스
   */
  constructor(jobModel, companyModel, customError) {
    this.Job = jobModel;
    this.Company = companyModel;
    this.CustomError = customError;
  }

  /**
   * 채용 공고 목록을 조회합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 데이터베이스 조회 오류 시 발생
   */
  async getJobs(req, res, next) {
    try {
      const { page = 1, sortBy = 'createdAt', order = 'desc', location, experience, salary, skills, keyword, companyName } = req.query;
      const limit = 20;
      const skip = (page - 1) * limit;
  
      const matchStage = {};
  
      // 키워드 검색 (제목, 회사명, sector)
      if (keyword) {
        matchStage.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { sector: { $regex: keyword, $options: 'i' } },
        ];
      }
  
      // 회사명 검색 필터링
      if (companyName) {
        const companies = await this.Company.find({ name: { $regex: companyName, $options: 'i' } }).select('_id');
        const companyIds = companies.map(company => company._id);
        matchStage.company = { $in: companyIds };
      }

  
      // 기타 필터링 조건 추가
      if (location) {
        matchStage.location = location;
      }
      if (experience) {
        matchStage.experience = experience;
      }
      if (salary) {
        matchStage.salary = salary;
      }
      if (skills) {
        matchStage.skills = { $in: skills.split(',').map(skill => skill.trim()) };
      }
  
      // Aggregation Pipeline 구성
      const aggregationPipeline = [
        { $match: matchStage },
        { $sort: { [sortBy]: order === 'desc' ? -1 : 1 } },
        { $skip: skip },
        { $limit: limit },
        { $lookup: { from: 'companies', localField: 'company', foreignField: '_id', as: 'companyDetails' } },
        { $unwind: '$companyDetails' },
      ];
  
      // 총 아이템 수 계산
      const totalItems = await this.Job.countDocuments(matchStage);
      const totalPages = Math.ceil(totalItems / limit);
      const currentPage = parseInt(page, 10);
  
      // 채용 공고 조회
      const jobs = await this.Job.aggregate(aggregationPipeline);
  
      res.json({
        status: 'success',
        data: jobs,
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
   * 새로운 채용 공고를 생성합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 중복 공고 또는 회사 미존재 시 발생
   */
  async createJob(req, res, next) {
    try {
      const { companyId, title, location, experience, education, employmentType, deadline, sector, salary, skills, link } = req.body;

      // 회사 존재 여부 확인
      const company = await this.Company.findById(companyId);
      if (!company) {
        throw new this.CustomError(404, '회사를 찾을 수 없습니다.');
      }

      // 중복 공고 확인
      const existingJob = await this.Job.findOne({ link });
      if (existingJob) {
        throw new this.CustomError(400, '이미 존재하는 채용 공고입니다.');
      }
      // 새로운 채용 공고 생성
      const job = new this.Job({
        company: company._id,
        title,
        link,
        location,
        experience,
        education,
        employmentType,
        deadline,
        sector,
        salary,
        skills
      });

      await job.save();

      res.status(201).json({ status: 'success', data: job });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 채용 공고를 수정합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 입력 데이터 오류, 중복 링크, 또는 채용 공고 미존재 시 발생
   */
  async updateJob(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // 채용 공고 존재 여부 확인
      const job = await this.Job.findById(id);
      if (!job) {
        throw new this.CustomError(404, '채용 공고를 찾을 수 없습니다.');
      }

      // 링크 중복 확인
      if (updateData.link && updateData.link !== job.link) {
        const existingJob = await this.Job.findOne({ link: updateData.link });
        if (existingJob) {
          throw new this.CustomError(400, '이미 존재하는 채용 공고 링크입니다.');
        }
      }

      // 채용 공고 업데이트
      const updatedJob = await this.Job.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      res.json({ status: 'success', data: updatedJob });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 채용 공고를 삭제합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 채용 공고 미존재 시 발생
   */
  async deleteJob(req, res, next) {
    try {
      const { id } = req.params;
      // 채용 공고 존재 여부 확인
      const job = await this.Job.findById(id);
      if (!job) {
        throw new this.CustomError(404, '채용 공고를 찾을 수 없습니다.');
      }
      // 채용 공고 삭제
      await this.Job.deleteOne({ _id: id });

      res.json({ status: 'success', message: '채용 공고가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 기술 스택별 채용 공고 수를 집계합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 데이터베이스 오류 시 발생
   */
  async aggregateSkills(req, res, next) {
    try {
       // 기술 스택별 채용 공고 수 집계
      const aggregation = await this.Job.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      res.json({ status: 'success', data: aggregation });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = JobController;

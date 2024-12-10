// controllers/bookmarkController.js

/**
 * BookmarkController 클래스는 북마크와 관련된 모든 비즈니스 로직을 처리합니다.
 */
class BookmarkController {
  /**
   * BookmarkController 생성자
   * @param {Model} bookmarkModel - Bookmark Mongoose 모델
   * @param {Model} companyModel - Company Mongoose 모델
   * @param {Model} jobModel - Job Mongoose 모델
   * @param {CustomError} customError - 커스텀 에러 클래스
   */
  constructor(bookmarkModel, companyModel, jobModel, customError) {
    this.Bookmark = bookmarkModel;
    this.Company = companyModel;
    this.Job = jobModel;
    this.CustomError = customError;
  }

  /**
   * 북마크 토글 (추가/제거)
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 데이터베이스 오류 시 발생
   */
  async toggleBookmark(req, res, next) {
    try {
      const { jobId } = req.body;
      const userId = req.user._id;
      // 기존 북마크 존재 여부 확인
      const bookmark = await this.Bookmark.findOne({ user: userId, job: jobId });

      if (bookmark) {
        // 북마크가 이미 존재하면 제거
        await this.Bookmark.deleteOne({ _id: bookmark._id });
        return res.status(200).json({ status: 'success', message: '북마크가 제거되었습니다.' });
      }
      // 북마크가 없으면 추가
      const newBookmark = new this.Bookmark({ user: userId, job: jobId });
      await newBookmark.save();
      return res.status(201).json({ status: 'success', message: '북마크가 추가되었습니다.' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 북마크 목록 조회
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 데이터베이스 오류 시 발생
   */
  async getBookmarks(req, res, next) {
    try {
      const userId = req.user._id;
      const { page = 1, location, experience, salary, skills, keyword } = req.query;
      const limit = 20;
      const skip = (page - 1) * limit;

      const query = { user: userId };

      // 추가적인 필터링 조건
      if (location) query.location = location;
      if (experience) query.experience = experience;
      if (salary) query.salary = salary;
      if (skills) query.skills = { $all: skills.split(',').map(skill => skill.trim()) };
      if (companyName) {
        const companies = await this.Company.find({ name: { $regex: companyName, $options: 'i' } }).select('_id');
        const companyIds = companies.map(company => company._id);
        // 먼저 해당 회사에 속한 Job IDs를 찾습니다.
        const jobs = await this.Job.find({ company: { $in: companyIds } }).select('_id');
        const jobIds = jobs.map(job => job._id);
        query.job = { $in: jobIds };
      }
      
      if (keyword) {
        query['job.title'] = { $regex: keyword, $options: 'i' };
      }

      const totalItems = await this.Bookmark.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
      const currentPage = parseInt(page, 10);
      // 북마크 목록 조회
      const bookmarks = await this.Bookmark.find(query)
        .populate({
          path: 'job',
          populate: { path: 'company' }
        })
        .sort({ bookmarkedAt: -1 }) // 최신순
        .skip(skip)
        .limit(limit);

      res.json({
        status: 'success',
        data: bookmarks,
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
   * 북마크 제거
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 북마크 미존재 시 발생
   */
  async removeBookmark(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      // 북마크 존재 여부 확인
      const bookmark = await this.Bookmark.findOne({ _id: id, user: userId });
      if (!bookmark) {
        throw new this.CustomError(404, '북마크를 찾을 수 없습니다.');
      }
      // 북마크 제거
      await this.Bookmark.deleteOne({ _id: id });
      res.json({ status: 'success', message: '북마크가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BookmarkController;

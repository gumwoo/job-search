// controllers/bookmarkController.js

const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');
const CustomError = require('../utils/customError');

// 북마크 토글 (추가/제거)
exports.toggleBookmark = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      throw new CustomError(400, 'jobId가 필요합니다.');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    const existingBookmark = await Bookmark.findOne({ user: req.user._id, job: jobId });

    if (existingBookmark) {
      await Bookmark.findOneAndDelete({ user: req.user._id, job: jobId });
      return res.json({ status: 'success', message: '북마크가 제거되었습니다.' });
    } else {
      const bookmark = new Bookmark({ user: req.user._id, job: jobId });
      await bookmark.save();
      return res.status(201).json({ status: 'success', data: bookmark });
    }
  } catch (err) {
    next(err);
  }
};

// 북마크 목록 조회 with 필터링 및 검색
exports.getBookmarks = async (req, res, next) => {
  try {
    const { page = 1, location, experience, salary, skills, keyword } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    if (location) {
      query['job.location'] = { $regex: location, $options: 'i' };
    }

    if (experience) {
      query['job.experience'] = { $regex: experience, $options: 'i' };
    }

    if (salary) {
      query['job.salary'] = { $regex: salary, $options: 'i' };
    }

    if (skills) {
      query['job.skills'] = { $in: skills.split(',') };
    }

    if (keyword) {
      query['job.title'] = { $regex: keyword, $options: 'i' };
    }

    const totalItems = await Bookmark.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const bookmarks = await Bookmark.find(query)
      .populate({
        path: 'job',
        match: {
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            // 회사명 검색을 위해 회사 모델과 연동 필요
          ]
        }
      })
      .populate('job')
      .sort({ bookmarkedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: 'success',
      data: bookmarks,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems,
      },
    });
  } catch (err) {
    next(err);
  }
};

// controllers/bookmarkController.js

const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');
const CustomError = require('../utils/customError');

// 북마크 추가/제거
exports.toggleBookmark = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    const existingBookmark = await Bookmark.findOne({ user: req.user._id, job: jobId });

    if (existingBookmark) {
      // 이미 북마크된 경우 삭제
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      res.json({ status: 'success', message: '북마크가 제거되었습니다.' });
    } else {
      // 북마크 추가
      const job = await Job.findById(jobId);
      if (!job) {
        throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
      }

      const bookmark = new Bookmark({
        user: req.user._id,
        job: jobId,
      });

      await bookmark.save();

      res.status(201).json({ status: 'success', message: '북마크가 추가되었습니다.' });
    }
  } catch (err) {
    next(err);
  }
};

// 북마크 목록 조회
exports.getBookmarks = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalItems = await Bookmark.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalItems / limit);

    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('job')
      .limit(limit)
      .skip(skip)
      .sort({ bookmarkedAt: -1 });

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

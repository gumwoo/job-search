// controllers/jobController.js

const Job = require('../models/Job');
const CustomError = require('../utils/customError');

// 공고 목록 조회
exports.getJobs = async (req, res, next) => {
  try {
    const { page = 1, location, experience, salary, skills, keyword } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    // 검색 및 필터링 조건
    const query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (experience) {
      query.experience = { $regex: experience, $options: 'i' };
    }

    if (salary) {
      query.salary = { $regex: salary, $options: 'i' };
    }

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    const totalItems = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const jobs = await Job.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: jobs,
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

// 공고 상세 조회
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    // 조회수 증가 로직 (필요한 경우)

    res.json({ status: 'success', data: job });
  } catch (err) {
    next(err);
  }
};

// 채용 공고 등록
exports.createJob = async (req, res, next) => {
  try {
    // 관리자 또는 기업 사용자만 가능하도록 권한 체크 필요
    const job = new Job(req.body);
    await job.save();

    res.status(201).json({ status: 'success', data: job });
  } catch (err) {
    next(err);
  }
};

// 채용 공고 수정
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    res.json({ status: 'success', data: job });
  } catch (err) {
    next(err);
  }
};

// 채용 공고 삭제
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    res.json({ status: 'success', message: '채용 공고가 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

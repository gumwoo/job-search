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

// 공고 상세 조회 및 조회수 증가
exports.getJobById = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    // 조회수 증가
    job.views = (job.views || 0) + 1;
    await job.save();

    // 관련 공고 추천 (예: 같은 sector의 상위 5개 공고)
    const relatedJobs = await Job.find({
      sector: job.sector,
      _id: { $ne: jobId }
    }).limit(5).sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        job,
        relatedJobs
      }
    });
  } catch (err) {
    next(err);
  }
};

// 채용 공고 등록
exports.createJob = async (req, res, next) => {
  try {
    const jobData = req.body;
    const job = new Job(jobData);
    await job.save();

    res.status(201).json({ status: 'success', data: job });
  } catch (err) {
    next(err);
  }
};

// 채용 공고 수정
exports.updateJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const updateData = req.body;

    const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

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
    const jobId = req.params.id;
    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    res.json({ status: 'success', message: '채용 공고가 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// controllers/jobController.js

const Job = require('../models/Job');
const Company = require('../models/Company');
const CustomError = require('../utils/customError');

// 채용 공고 목록 조회
exports.getJobs = async (req, res, next) => {
  try {
    const { page = 1, keyword, location, experience, salary, skills, sortBy, order } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (location) {
      query.location = location;
    }
    if (experience) {
      query.experience = experience;
    }
    if (salary) {
      query.salary = salary;
    }
    if (skills) {
      query.skills = { $all: skills.split(',').map(skill => skill.trim()) };
    }

    const totalItems = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = parseInt(page, 10);

    let sortCriteria = {};
    if (sortBy) {
      sortCriteria[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortCriteria = { createdAt: -1 };
    }

    const jobs = await Job.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .populate('company'); // 회사 정보 포함

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
};

// 채용 공고 등록
exports.createJob = async (req, res, next) => {
  try {
    const { companyId, title, location, experience, education, employmentType, deadline, sector, salary, skills } = req.body;

    // 회사 존재 여부 확인
    const company = await Company.findById(companyId);
    if (!company) {
      throw new CustomError(404, '회사를 찾을 수 없습니다.');
    }

    // 중복 공고 확인
    const existingJob = await Job.findOne({ link: req.body.link });
    if (existingJob) {
      throw new CustomError(400, '이미 존재하는 채용 공고입니다.');
    }

    const job = new Job({
      company: company._id,
      title,
      link: req.body.link,
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
};

// 채용 공고 수정
exports.updateJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;

    // 채용 공고 존재 여부 확인
    const job = await Job.findById(jobId);
    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    // 회사 수정 시 회사 존재 여부 확인
    if (updates.companyId) {
      const company = await Company.findById(updates.companyId);
      if (!company) {
        throw new CustomError(404, '회사를 찾을 수 없습니다.');
      }
      updates.company = updates.companyId;
      delete updates.companyId;
    }

    // 업데이트 적용
    Object.keys(updates).forEach(key => {
      job[key] = updates[key];
    });

    job.updatedAt = Date.now();

    await job.save();

    res.json({ status: 'success', data: job });
  } catch (err) {
    next(err);
  }
};

// 채용 공고 삭제
exports.deleteJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    // 채용 공고 존재 여부 확인
    const job = await Job.findById(jobId);
    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    await Job.findByIdAndDelete(jobId);

    res.json({ status: 'success', message: '채용 공고가 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// 기술 스택별 채용 공고 수 집계
exports.aggregateSkills = async (req, res, next) => {
  try {
    const aggregation = await Job.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ status: 'success', data: aggregation });
  } catch (err) {
    next(err);
  }
};

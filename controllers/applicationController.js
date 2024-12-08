// controllers/applicationController.js

const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume'); // 이력서 모델 추가
const CustomError = require('../utils/customError');

// 지원하기
exports.applyJob = async (req, res, next) => {
  try {
    const { jobId, resumeId } = req.body;

    // 중복 지원 여부 확인
    const existingApplication = await Application.findOne({ user: req.user._id, job: jobId });
    if (existingApplication) {
      throw new CustomError(400, '이미 지원한 공고입니다.');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    // 이력서 존재 여부 확인 (선택 사항)
    let resume = null;
    if (resumeId) {
      resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
      if (!resume) {
        throw new CustomError(404, '이력서를 찾을 수 없습니다.');
      }
    }

    const application = new Application({
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
};

// 지원 내역 조회
exports.getApplications = async (req, res, next) => {
  try {
    const { page = 1, status, sortBy } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const totalItems = await Application.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    let sortCriteria = { appliedAt: -1 }; // 기본 정렬: 최신순
    if (sortBy === 'date') {
      sortCriteria = { appliedAt: -1 };
    } else if (sortBy === 'status') {
      sortCriteria = { status: 1 };
    }

    const applications = await Application.find(query)
      .populate('job')
      .populate('resume') // 이력서 정보 추가
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    res.json({
      status: 'success',
      data: applications,
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

// 지원 취소
exports.cancelApplication = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findOne({ _id: applicationId, user: req.user._id });

    if (!application) {
      throw new CustomError(404, '지원 내역을 찾을 수 없습니다.');
    }

    if (application.status !== 'Pending') {
      throw new CustomError(400, '취소할 수 없는 지원 상태입니다.');
    }

    application.status = 'Cancelled';
    await application.save();

    res.json({ status: 'success', message: '지원이 취소되었습니다.' });
  } catch (err) {
    next(err);
  }
};

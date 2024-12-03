// controllers/applicationController.js

const Application = require('../models/Application');
const Job = require('../models/Job');
const CustomError = require('../utils/customError');

// 지원하기
exports.applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    // 중복 지원 여부 확인
    const existingApplication = await Application.findOne({ user: req.user._id, job: jobId });
    if (existingApplication) {
      throw new CustomError(400, '이미 지원한 공고입니다.');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new CustomError(404, '채용 공고를 찾을 수 없습니다.');
    }

    const application = new Application({
      user: req.user._id,
      job: jobId,
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
    const applications = await Application.find({ user: req.user._id })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json({ status: 'success', data: applications });
  } catch (err) {
    next(err);
  }
};

// 지원 취소
exports.cancelApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!application) {
      throw new CustomError(404, '지원 내역을 찾을 수 없습니다.');
    }

    res.json({ status: 'success', message: '지원이 취소되었습니다.' });
  } catch (err) {
    next(err);
  }
};

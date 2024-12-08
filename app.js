// app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const helmet = require('helmet');
const expressStatusMonitor = require('express-status-monitor');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger/swaggerOptions');
// 라우트 파일들
const resumeRoutes = require('./routes/resumes');
const notificationRoutes = require('./routes/notifications');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const bookmarkRoutes = require('./routes/bookmarks');
const rateLimit = require('express-rate-limit');
const messageRoutes = require('./routes/messages');
// 미들웨어
const errorMiddleware = require('./middlewares/errorMiddleware');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1분
    max: 100, // 분당 최대 100개의 요청
    message: '요청 한도를 초과하였습니다.',
  });

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.log('MongoDB 연결 오류:', err));

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(
  helmet({
    hsts: false, // HSTS 헤더 비활성화
    contentSecurityPolicy: false, // 필요한 경우 CSP 비활성화
  })
);
app.use(expressStatusMonitor());
app.use(limiter);
app.use('/resumes', resumeRoutes);
app.use('/notifications', notificationRoutes);
app.use('/messages', messageRoutes);
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use('/bookmarks', bookmarkRoutes);
// Swagger UI 설정
// 필요 시 옵션 추가
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    swaggerOptions: {
      validatorUrl: null, // Validator를 비활성화하여 HTTPS 관련 이슈 방지
    },
  })
);
// morgan과 winston을 연동하여 요청 로깅
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
}));
// 에러 처리 미들웨어
app.use(errorMiddleware);

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

module.exports = app;

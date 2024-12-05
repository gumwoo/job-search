// app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
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
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.log('MongoDB 연결 오류:', err));

// 미들웨어 설정
app.use('/notifications', notificationRoutes);
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use('/messages', messageRoutes);
app.use(limiter);
app.use('/resumes', resumeRoutes);
// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
// 라우트 설정
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use('/bookmarks', bookmarkRoutes);

// 에러 처리 미들웨어
app.use(errorMiddleware);

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

module.exports = app;

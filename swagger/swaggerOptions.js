// swagger/swaggerOptions.js

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal API',
      version: '1.0.0',
      description: '구인구직 백엔드 API 문서',
  },
  servers: [
    {
      url: 'http://113.198.66.75:17202',
      description: '프로덕션 서버',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // 아래에 각 모델의 스키마를 정의합니다.
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          email: { type: 'string', example: 'user@example.com' },
          name: { type: 'string', example: '홍길동' },
          role: { type: 'string', example: 'user' },
          createdAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
        },
      },
      Company: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
          name: { type: 'string', example: '삼성전자' },
          industry: { type: 'string', example: '전자' },
          size: { type: 'string', example: '1000명 이상' },
          location: { type: 'string', example: '서울' },
          createdAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
        },
      },
      Job: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          company: { type: 'string', example: '60d0fe4f5311236168a109cc' },
          title: { type: 'string', example: '백엔드 개발자' },
          link: { type: 'string', example: 'https://www.saramin.co.kr/job/123456' },
          location: { type: 'string', example: '서울' },
          experience: { type: 'string', example: '3년 이상' },
          education: { type: 'string', example: '학사' },
          employmentType: { type: 'string', example: '정규직' },
          deadline: { type: 'string', example: '2024-12-31' },
          sector: { type: 'string', example: '소프트웨어 개발' },
          salary: { type: 'string', example: '연봉 5000만원 이상' },
          skills: {
            type: 'array',
            items: { type: 'string', example: 'Node.js' },
          },
          views: { type: 'number', example: 150 },
          createdAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
        },
      },
      // 추가 모델 스키마 정의 (예: Application, Bookmark, Message, Notification, Resume)
      Application: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cd' },
          user: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          job: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          resume: { type: 'string', example: '60d0fe4f5311236168a109ce' },
          status: { type: 'string', example: 'Pending' },
          appliedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          createdAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
        },
      },
      Bookmark: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cf' },
          user: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          job: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          bookmarkedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          createdAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
        },
      },
      Message: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109d0' },
          sender: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          receiver: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          content: { type: 'string', example: '안녕하세요!' },
          read: { type: 'boolean', example: false },
          sentAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109d1' },
          user: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          type: { type: 'string', example: 'application' },
          content: { type: 'string', example: '새로운 지원이 접수되었습니다.' },
          read: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
        },
      },
      Resume: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109d2' },
          user: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          title: { type: 'string', example: '경력직 이력서' },
          content: { type: 'string', example: '경력 내용...' },
          file: { type: 'string', example: '/uploads/resumes/60d0fe4f5311236168a109d2.pdf' },
          createdAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:34:56.789Z' },
        },
      },
      // 추가적인 에러 응답 스키마
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: '에러 메시지' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                msg: { type: 'string', example: '유효하지 않은 입력 값' },
                param: { type: 'string', example: 'email' },
                location: { type: 'string', example: 'body' },
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
},
apis: ['./routes/*.js', './models/*.js'], // Swagger 주석이 포함된 파일 경로
};

const swaggerSpecs = swaggerJSDoc(options);

module.exports = swaggerSpecs;

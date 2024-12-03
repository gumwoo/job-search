// swagger/swaggerOptions.js

const swaggerJsDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Job Portal API',
    version: '1.0.0',
    description: '구인구직 백엔드 API 문서',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '개발 서버',
    },
    // 배포 시 실제 서버 주소를 추가합니다.
    // {
    //   url: 'https://your-deployed-server.com',
    //   description: '배포 서버',
    // },
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
      ErrorResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: '에러 메시지',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                msg: { type: 'string' },
                param: { type: 'string' },
                location: { type: 'string' },
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
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './models/*.js'], // 주석이 있는 파일 경로
};

const specs = swaggerJsDoc(options);

module.exports = specs;

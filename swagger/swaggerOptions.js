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
    {
      url: 'http://113.198.66.75:17063',
      description: '배포 서버',
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
                msg: { type: 'string', example: '세부 에러 메시지' },
                param: { type: 'string', example: '필드명' },
                location: { type: 'string', example: '위치' },
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

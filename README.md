# JOB-SEARCH 프로젝트

이 프로젝트는 사람인(Saramin) 웹사이트에서 채용 공고 데이터를 크롤링하고, MongoDB에 저장한 뒤, Node.js(Express.js) 기반의 RESTful API 서버를 구성하는 백엔드 시스템입니다. 

JWT 기반 인증, Swagger를 이용한 API 문서화, 필터링/검색/페이지네이션 등의 기능을 포함하며, JCloud 환경에 배포되어 있습니다.

---

## 주요 기능 요약

### 1. 크롤링 (Crawling)
- Saramin 웹사이트 크롤링
- axios + cheerio 활용
- 최소 100개 이상 공고 수집, 중복 데이터 무시, 재시도 로직 포함
### 2. 데이터베이스 (MongoDB)
- Mongoose ODM 사용
- 회사(Company), 채용 공고(Job), 사용자(User), 지원(Application), 북마크(Bookmark), 이력서(Resume), 메시지(Message), 알림(Notification), 로그인 이력(LoginHistory) 등 총 8개 이상 컬렉션
- 인덱스 및 관계 설정을 통한 효율적인 조회


### 3. REST API 개발
- **회원 관련 기능**:
  - 회원 가입/로그인/토큰 갱신/회원 정보 수정/탈퇴
- **채용 공고**:
  -  CRUD, 검색(키워드/회사명/분야), 필터링(지역/경력/급여/스킬), 정렬, 페이지네이션(20개 단위)
- **지원**:
  - 지원하기, 지원 취소, 지원 내역 조회
- **북마크 (관심공고)**:
  - 추가/제거, 목록 조회
- **기타 기능**:
  - 이력서 업로드/조회/수정/삭제(Resumes), 메시지 전송/조회(Messages), 알림 조회/읽음 처리(Notifications)

### 4. 인증 및 보안
- **JWT 기반 인증**: Access Token, Refresh Token
- **보안**: 
  - 비밀번호 Base64 암호화
  - helmet, express-rate-limit 사용
  - adminMiddleware로 관리자 권한 검증

### 5. Swagger 문서화
- **경로**: `/api-docs`
- **기능**: Swagger UI로 API 동작 확인 및 테스트 가능
- 요청/응답 스키마 정의
### 6. 에러 처리 및 로깅
- 글로벌 에러 핸들러, 커스텀 에러 클래스
- winston + morgan을 통한 요청/에러 로깅
- 일관된 에러 응답 포맷
- express-status-monitor로 서버 상태 모니터링

---

## 기술 스택

- **Backend**: Node.js (Express.js)
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (Access Token, Refresh Token)
- **Documentation**: Swagger (swagger-ui-express, swagger-jsdoc)
- **Crawling**: axios, cheerio
- **Security & Logging**: helmet, express-rate-limit, winston
- **Logging** : morgan, winston
- **Validation**: express-validator

---

## 환경 변수 설정
  - `.env` 파일을 생성하고 다음과 같이 설정합니다:
        ```dotenv
        NODE_ENV=development
        JWT_SECRET=your_jwt_secret_key
        LOG_LEVEL=info
        MONGO_URI=your_mongodb_connection_string
        PORT=443
        ```


## 설치된 주요 패키지

### 1. **Dependencies**
- `axios`: HTTP 요청 처리
- `axios-retry`: 요청 실패 시 재시도 로직 추가
- `bcryptjs`: 비밀번호 암호화
- `cheerio`: HTML 파싱 및 크롤링
- `cors`: CORS 설정
- `dotenv`: 환경 변수 관리
- `express`: 웹 프레임워크
- `express-rate-limit`: 요청 속도 제한
- `express-status-monitor`: 서버 상태 모니터링
- `express-validator`: 요청 데이터 검증
- `helmet`: 보안 설정
- `jsonwebtoken`: JWT 인증
- `mongoose`: MongoDB와 연동
- `morgan`: HTTP 요청 로깅
- `swagger-jsdoc`: Swagger 문서 생성
- `swagger-ui-express`: Swagger UI 제공
- `winston`: 로깅 라이브러리
- `pm2`: Node.js 앱을 데몬 형태로 관리하는 프로세스 매니저
### 1. **Dependencies설치 명령어 제시**
- npm install axios@^1.7.8 axios-retry@^4.5.0 bcryptjs@^2.4.3 cheerio@^1.0.0 cors@^2.8.5 dotenv@^16.4.7 express@^4.21.1 express-rate-limit@^7.4.1 express-status-monitor@^1.3.4 express-validator@^7.2.0 helmet@^8.0.0 jsonwebtoken@^9.0.2 mongoose@^8.8.3 morgan@^1.10.0 multer@^1.4.5-lts.1 swagger-jsdoc@^6.2.8 swagger-ui-express@^5.0.1 winston@^3.17.0 winston-daily-rotate-file@^5.0.0
- sudo npm install -g pm2 (pm2 사용하기)
### 2. **DevDependencies**
- `eslint`: 코드 스타일 검사 도구
- `nodemon`: 서버 코드 변경 시 자동 재시작
### 2. **Dependencies설치 명령어 제시**
- npm install --save-dev eslint@^9.16.0 nodemon@^3.1.7
---

## JCloud 환경 정보

- **서버 내부 포트**: `443`
- **서버 외부 접근 주소**: `http://113.198.66.75:17202`  
  (Postman 또는 클라이언트에서 기본 주소로 사용)

- **MongoDB 내부 포트**: `3000`  
  - MongoDB 기본 포트는 `27017` 대신 `3000`을 사용
  - **MongoDB 외부 포트**: `http://113.198.66.75:13202`

---

## 프로젝트 구조

```plaintext
JOB-SEARCH
├── app.js               # Express 서버 시작점
├── Dockerfile           # Docker 설정 파일
├── package.json         # 프로젝트 종속성 파일
├── .gitignore           # Git 예외 설정
├── .env                 # 환경 변수 파일
├── models/              # Mongoose 스키마 정의 (User, Job, Company 등)
├── controllers/         # 각 엔드포인트 로직 처리
├── routes/              # 라우팅 설정 (auth, jobs, applications 등)
├── middlewares/         # 인증, 에러 핸들러, validation 등 공통 로직
├── utils/               # 토큰 발급, 에러 클래스, 로거 등 유틸 함수
├── swagger/             # Swagger 설정 파일
└── crawler/             # Saramin 크롤링 스크립트 (예: saraminCrawler.js)


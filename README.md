# JOB-SEARCH 프로젝트

이 프로젝트는 사람인(Saramin) 웹사이트에서 채용 공고 데이터를 크롤링하고, MongoDB에 저장한 뒤, Node.js(Express.js) 기반의 RESTful API 서버를 구성하는 백엔드 시스템입니다. 

JWT 기반 인증, Swagger를 이용한 API 문서화, 필터링/검색/페이지네이션 등의 기능을 포함하며, JCloud 환경에 배포되어 있습니다.

---

## 주요 기능 요약

### 1. 크롤링 (Crawling)
- **기능**: Saramin 웹사이트에서 axios와 cheerio를 이용해 채용 공고 데이터(회사명, 공고 제목, 지역, 경력, 기술스택 등) 수집

### 2. 데이터베이스 (MongoDB)
- **기능**: 수집한 데이터를 MongoDB에 저장 (NoSQL)

### 3. REST API 개발
- **회원 관련 기능**:
  - 회원 가입/로그인/토큰 갱신/회원 정보 수정/탈퇴
- **채용 공고**:
  - CRUD, 검색, 필터링(지역, 경력, 급여, 기술스택), 페이지네이션
- **지원**:
  - 지원하기, 지원 취소, 지원 내역 조회
- **북마크 (관심공고)**:
  - 추가/제거, 목록 조회
- **기타 기능**:
  - 메시지 전송/조회, 알림 조회/읽음 처리, 이력서 CRUD

### 4. 인증 및 보안
- **JWT 기반 인증**: Access Token, Refresh Token
- **보안**: 
  - 비밀번호 Base64 암호화
  - helmet, express-rate-limit 사용

### 5. Swagger 문서화
- **경로**: `/api-docs`
- **기능**: Swagger UI로 API 동작 확인 및 테스트 가능

### 6. 에러 처리 및 로깅
- **기능**: 글로벌 에러 핸들러, winston 로깅, 일관된 에러 응답 포맷

---

## 기술 스택

- **Backend**: Node.js (Express.js)
- **Database**: MongoDB
- **Authentication**: JWT (Access Token, Refresh Token)
- **Documentation**: Swagger (swagger-ui-express, swagger-jsdoc)
- **Crawling**: axios, cheerio
- **Security & Logging**: helmet, express-rate-limit, winston

---

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

### 2. **DevDependencies**
- `eslint`: 코드 스타일 검사 도구
- `nodemon`: 서버 코드 변경 시 자동 재시작

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
├── swagger.json         # Swagger 문서화 파일
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


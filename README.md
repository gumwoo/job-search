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
- **기능 설명:** 수집된 채용 공고 데이터를 MongoDB에 저장 및 관리합니다.
- **사용된 기술:** `Mongoose` ODM.
- **Docker 사용:**
  - MongoDB는 Docker 컨테이너를 통해 관리됩니다.
  - Docker Compose를 사용하여 MongoDB 서비스가 자동으로 시작되고 관리됩니다.
- **컬렉션:**
  - `Company`, `Job`, `User`, `Application`, `Bookmark`, `Resume`, `Message`, `Notification`, `LoginHistory`
- **특징:**
  - 인덱스 설정을 통한 빠른 조회.
  - 컬렉션 간 관계 설정.

## **Docker 사용 안내**

### **1. Docker의 역할**
본 프로젝트에서는 **MongoDB**를 Docker 컨테이너로 실행하여 데이터베이스 관리를 효율적으로 수행하고 있습니다. Docker를 사용함으로써 데이터베이스 설정과 관리를 간편하게 할 수 있으며, 다른 개발 환경과의 호환성을 높였습니다.
### **2. Docker 컨테이너 상태 확인**
현재 실행 중인 Docker 컨테이너는 다음과 같습니다:

```bash
sudo docker ps
```

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

## **3. 기능별 상세 설명 추가**

각 주요 기능에 대한 상세한 설명과 함께, **사용 예시**나 **API 엔드포인트**를 추가하면 이해가 더 쉬워집니다.

### 1. 크롤링 (Crawling)
- **기능 설명:** Saramin 웹사이트에서 채용 공고를 크롤링하여 MongoDB에 저장합니다.
- **사용된 기술:** `axios`를 통한 HTTP 요청, `cheerio`를 통한 HTML 파싱.
- **특징:**
  - 최소 100개 이상의 채용 공고 수집.
  - 중복 데이터 무시.
  - 요청 실패 시 재시도 로직 포함.

### 2. 데이터베이스 (MongoDB)
- **기능 설명:** 수집된 채용 공고 데이터를 MongoDB에 저장 및 관리합니다.
- **사용된 기술:** `Mongoose` ODM.
- **컬렉션:**
  - `Company`, `Job`, `User`, `Application`, `Bookmark`, `Resume`, `Message`, `Notification`, `LoginHistory`
- **특징:**
  - 인덱스 설정을 통한 빠른 조회.
  - 컬렉션 간 관계 설정.

### 3. REST API 개발
- **회원 관련 기능:**
  - **가입:** `POST /auth/register`
  - **로그인:** `POST /auth/login`
  - **토큰 갱신:** `POST /auth/refresh`
  - **회원 정보 수정:** `PUT /auth/profile`
  - **탈퇴:** `DELETE /auth/delete`
- **채용 공고:**
  - **목록 조회:** `GET /jobs`
  - **상세 조회:** `GET /jobs/:id`
  - **생성:** `POST /jobs`
  - **수정:** `PUT /jobs/:id`
  - **삭제:** `DELETE /jobs/:id`
  - **검색 및 필터링:** `GET /jobs?keyword=백엔드&location=서울`
- **지원:**
  - **지원하기:** `POST /applications`
  - **지원 취소:** `DELETE /applications/:id`
  - **지원 내역 조회:** `GET /applications`
- **북마크 (관심공고):**
  - **추가:** `POST /bookmarks`
  - **제거:** `DELETE /bookmarks/:id`
  - **목록 조회:** `GET /bookmarks`
- **기타 기능:**
  - **이력서 업로드/조회/수정/삭제:** `Resumes` 관련 엔드포인트
  - **메시지 전송/조회:** `Messages` 관련 엔드포인트
  - **알림 조회/읽음 처리:** `Notifications` 관련 엔드포인트

## 기술 스택

- **Backend**: Node.js (Express.js)
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (Access Token, Refresh Token)
- **Documentation**: Swagger (swagger-ui-express, swagger-jsdoc)
- **Crawling**: axios, cheerio
- **Security & Logging**: helmet, express-rate-limit, morgan,winston
- **Validation**: express-validator

---

## 환경 변수 설정
```bash
- .env 파일을 생성하고 다음과 같이 설정합니다:
| 환경 변수                  | 설명                                      | 예시                              |
|---------------------------|-------------------------------------------|-----------------------------------|
| `NODE_ENV`                | 애플리케이션 실행 환경 (`development`, `production`) | `development`                    |
| `JWT_SECRET`              | JWT 토큰 서명에 사용되는 비밀 키              | `your_jwt_secret_key`             |
| `ACCESS_TOKEN_EXPIRES_IN` | 액세스 토큰의 만료 시간                     | `1h` (1시간)                      |
| `REFRESH_TOKEN_EXPIRES_IN`| 리프레시 토큰의 만료 시간                    | `7d` (7일)                        |
| `LOG_LEVEL`               | 로깅 레벨 (`info`, `debug`, `error` 등)      | `info`                            |
| `MONGO_URI`               | MongoDB 연결 문자열                        | `mongodb://localhost:27017/jobsearch` |
| `PORT`                    | 서버가 리슨할 포트 번호                      | `443`                             |

```


## 설치된 주요 패키지
```
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

### 1. **Dependencies설치 명령어**
- npm install axios@^1.7.8 axios-retry@^4.5.0 bcryptjs@^2.4.3 cheerio@^1.0.0 cors@^2.8.5 dotenv@^16.4.7 express@^4.21.1 express-rate-limit@^7.4.1 express-status-monitor@^1.3.4 express-validator@^7.2.0 helmet@^8.0.0 jsonwebtoken@^9.0.2 mongoose@^8.8.3 morgan@^1.10.0 multer@^1.4.5-lts.1 swagger-jsdoc@^6.2.8 swagger-ui-express@^5.0.1 winston@^3.17.0 winston-daily-rotate-file@^5.0.0
- sudo npm install -g pm2 (pm2 사용하기)
### 2. **DevDependencies**
- `eslint`: 코드 스타일 검사 도구
- `nodemon`: 서버 코드 변경 시 자동 재시작
### 2. **Dependencies설치 명령어**
- npm install --save-dev eslint@^9.16.0 nodemon@^3.1.7
---

## **설치 및 실행 방법**

### **1. 저장소 클론**
프로젝트 저장소를 클론합니다.
```bash
git clone https://github.com/gumwoo/job-search.git
cd job-search
```
### **2. 패키지 설치**
```bash
npm install
npm install axios@^1.7.8 axios-retry@^4.5.0 bcryptjs@^2.4.3 cheerio@^1.0.0 cors@^2.8.5 dotenv@^16.4.7 express@^4.21.1 express-rate-limit@^7.4.1 express-status-monitor@^1.3.4 express-validator@^7.2.0 helmet@^8.0.0 jsonwebtoken@^9.0.2 mongoose@^8.8.3 morgan@^1.10.0 multer@^1.4.5-lts.1 swagger-jsdoc@^6.2.8 swagger-ui-express@^5.0.1 winston@^3.17.0 winston-daily-rotate-file@^5.0.0
npm install --save-dev eslint@^9.16.0 nodemon@^3.1.7
sudo npm install -g pm2
```
### **3. 환경 변수 설정**
```bash
- 프로젝트 루트 디렉토리에 .env 파일을 생성하고, .env.example 파일의 내용을 참고하여 환경 변수를 설정합니다.
- cp .env.example .env
- 그런 다음, .env 파일을 열어 각 환경 변수의 값을 실제 값으로 변경합니다.
```
### **4. 데이터베이스 설정**
- MongoDB를 로컬 또는 클라우드에 설정하고, .env 파일의 MONGO_URI 변수에 MongoDB 연결 문자열을 입력합니다.
### **5. 서버 실행**
- PM2를 사용하여 서버를 시작합니다. 먼저, PM2를 글로벌로 설치합니다.
  - sudo npm install -g pm2
- 그런 다음, PM2를 사용하여 서버를 시작합니다.
  - sudo pm2 start app.js

## JCloud 환경 정보

- **서버 내부 포트**: `443`
- **서버 외부 접근 주소**: `http://113.198.66.75:17202`  
  (Postman 또는 클라이언트에서 기본 주소로 사용)

- **MongoDB 내부 포트**: `3000`  
  - MongoDB 기본 포트는 `27017` 대신 `3000`을 사용
  - **MongoDB 외부 포트**: `http://113.198.66.75:13202`
- **(BUT, 학교 자체내에서 인스턴스를 삭제해서 현재는 접속할수 없음)**
---

## **API 엔드포인트 목록과 간단한 설명**

### 1. 인증 관련 API (/auth)
- POST /auth/register
  - 설명: 새로운 사용자를 등록합니다.
- POST /auth/login
  - 설명: 사용자가 로그인하여 JWT 토큰을 발급받습니다.
- GET /auth/profile
  - 설명: 인증된 사용자의 프로필 정보를 조회합니다.
- POST /auth/refresh
  - 설명: 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
- POST /auth/logout
  - 설명: 사용자의 리프레시 토큰을 무효화하여 로그아웃합니다.

### 2. 채용 공고 관련 API (/jobs)
- GET /jobs
  - 설명: 채용 공고 목록을 조회합니다.
- GET /jobs/{id}
  - 설명: 특정 ID의 채용 공고 상세 정보를 조회합니다.
- POST /jobs (관리자 전용)
  - 설명: 새로운 채용 공고를 생성합니다.
- PUT /jobs/{id} (관리자 전용)
  - 설명: 특정 ID의 채용 공고를 수정합니다.
- DELETE /jobs/{id} (관리자 전용)
  - 설명: 특정 ID의 채용 공고를 삭제합니다.

### 3. 지원 관련 API (/applications)
- POST /applications
  - 설명: 사용자가 특정 채용 공고에 지원합니다.
- GET /applications
  - 설명: 사용자의 모든 지원 내역을 조회합니다.
- DELETE /applications/{id}
  - 설명: 사용자가 특정 지원 내역을 취소합니다.

### 4. 북마크 관련 API (/bookmarks)
- POST /bookmarks
  - 설명: 특정 채용 공고를 북마크에 추가하거나 제거합니다.
- GET /bookmarks
  - 설명: 사용자의 모든 북마크 목록을 조회합니다.
- DELETE /bookmarks/{id}
  - 설명: 특정 북마크를 삭제합니다.

### 5. 메시지 관련 API (/messages)
- POST /messages
  - 설명: 사용자가 다른 사용자에게 메시지를 전송합니다.
- GET /messages
  - 설명: 특정 대화 상대와의 메시지 목록을 조회합니다.
- GET /messages/{id}
  - 설명: 특정 메시지의 상세 정보를 조회합니다.
- PATCH /messages/{id}/read
  - 설명: 특정 메시지를 읽음 상태로 표시합니다.

### 6. 알림 관련 API (/notifications)
- GET /notifications
  - 설명: 사용자의 모든 알림 목록을 조회합니다.
- PUT /notifications/{id}/read
  - 설명: 특정 알림을 읽음 상태로 표시합니다.
- DELETE /notifications/{id}
  - 설명: 특정 알림을 삭제합니다.

### 7. 이력서 관련 API (/resumes)
- POST /resumes
  - 설명: 사용자가 새로운 이력서를 작성하고 업로드합니다.
- GET /resumes
  - 설명: 사용자의 모든 이력서를 조회합니다.
- PUT /resumes/{id}
  - 설명: 특정 ID의 이력서를 수정합니다.
- DELETE /resumes/{id}
  - 설명: 특정 ID의 이력서를 삭제합니다.

## **API 문서화**

- **Swagger UI:** [http://113.198.66.75:17202/api-docs](http://113.198.66.75:17202/api-docs) 에서 모든 API 엔드포인트를 확인하고 테스트할 수 있습니다.

### 크롤러 실행
사람인(Saramin) 사이트에서 데이터를 크롤링하여 DB에 저장하려면 다음 명령어를 실행하세요:
```bash
node crawler/saraminCrawler.js

## 프로젝트 구조

```plaintext
JOB-SEARCH
├── app.js               # Express 서버 시작점
├── Dockerfile           # Docker 설정 파일
├── package.json         # 프로젝트 종속성 파일
├── .gitignore           # Git 예외 설정
├── .env                 # 환경 변수 파일
├── .env.example         # 환경 변수 예시 파일
├── models/              # Mongoose 스키마 정의 (User, Job, Company 등)
├── controllers/         # 각 엔드포인트 로직 처리
├── routes/              # 라우팅 설정 (auth, jobs, applications 등)
├── middlewares/         # 인증, 에러 핸들러, validation 등 공통 로직
├── utils/               # 토큰 발급, 에러 클래스, 로거 등 유틸 함수
├── swagger/             # Swagger 설정 파일
└── crawler/             # Saramin 크롤링 스크립트 (예: saraminCrawler.js)
---


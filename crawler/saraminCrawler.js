// crawler/saraminCrawler.js

require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');
const axiosRetry = require('axios-retry').default;

// axios-retry 설정
axiosRetry(axios, {
  retries: 3, // 최대 재시도 횟수
  retryDelay: (retryCount) => retryCount * 1000, // 재시도 간 딜레이 (밀리초)
  retryCondition: (error) => axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error),
});

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => {
    console.error('MongoDB 연결 오류:', err);
    process.exit(1);
  });

// delay 함수 정의
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function crawlSaramin(keyword, targetCount = 100) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let collectedJobs = 0;
    let page = 1;

    while (collectedJobs < targetCount) {
      const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${encodeURIComponent(keyword)}&recruitPage=${page}`;
      console.log(`크롤링 중: ${url}`);

      const response = await axios.get(url, { headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }});
      const $ = cheerio.load(response.data);

      const jobListings = $('.item_recruit');
      if (jobListings.length === 0) {
        console.log('더 이상 크롤링할 공고가 없습니다.');
        break;
      }

      for (let i = 0; i < jobListings.length && collectedJobs < targetCount; i++) {
        const job = jobListings.eq(i);

        const companyName = job.find('.corp_name a').text().trim();
        const title = job.find('.job_tit a').text().trim();
        const link = 'https://www.saramin.co.kr' + job.find('.job_tit a').attr('href');

        const conditions = job.find('.job_condition span');
        const location = conditions.eq(0).text().trim();
        const experience = conditions.eq(1).text().trim();
        const education = conditions.eq(2).text().trim();
        const employmentType = conditions.eq(3).text().trim();

        const deadline = job.find('.job_date .date').text().trim();
        const sector = job.find('.job_sector').text().trim();

        const salaryBadge = job.find('.area_badge .badge');
        const salary = salaryBadge.text().trim();

        // 기술 스택 추출
        const skills = [];
        job.find('.job_sector a').each((idx, elem) => {
          skills.push($(elem).text().trim());
        });

        // 회사 정보 저장 또는 찾기
        let company = await Company.findOne({ name: companyName }).session(session);
        if (!company) {
          company = new Company({
            name: companyName,
            // 필요한 경우 추가 필드도 설정
          });
          await company.save({ session });
          console.log(`새로운 회사 저장: ${companyName}`);
        }

        // 중복 데이터 검사 (이미 존재하는 경우 저장하지 않음)
        const existingJob = await Job.findOne({ link }).session(session);

        if (!existingJob) {
          const newJob = new Job({
            company: company._id, // ObjectId로 참조
            title,
            link,
            location,
            experience,
            education,
            employmentType,
            deadline,
            sector,
            salary,
            skills
          });

          await newJob.save({ session });
          console.log(`새로운 채용 공고 저장: ${title}`);
          collectedJobs++;
        } else {
          console.log(`이미 존재하는 채용 공고: ${title}`);
        }
      }

      console.log(`${page}페이지 크롤링 완료, 총 수집된 공고 수: ${collectedJobs}`);
      page++;
      await delay(Math.random() * 3000 + 2000); // 2~5초 지연
    }

    await session.commitTransaction();
    console.log(`크롤링 및 저장 완료: 총 ${collectedJobs}건`);

  } catch (err) {
    await session.abortTransaction();
    console.error(`트랜잭션 중 에러 발생: ${err}`);
  } finally {
    session.endSession();
    mongoose.connection.close();
  }
}

// 사용 예시
(async () => {
  await crawlSaramin('개발자', 300); // '개발자' 키워드로 최소 100개 크롤링
})();

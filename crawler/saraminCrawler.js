// crawler/saraminCrawler.js
// 기술 스택 추출 알고리즘:
// 1. job_sector 내의 a 태그 목록을 순회
// 2. 각 a 태그의 텍스트를 trim하여 skills 배열에 삽입
// 3. 결과적으로 skills 배열에는 해당 공고에서 요구하는 모든 기술 스택이 문자열 형태로 저장됨
// 이 알고리즘은 단순한 DOM 탐색이며, 공고별 기술 스택이 a 태그로 감싸여 있다는 구조적 전제에 의존함
require('dotenv').config({ path: 'C:/Users/USER/Downloads/WSD-Assignment-03/.env' });
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Job = require('../models/Job');

// axios-retry 설정
axiosRetry(axios, {
  retries: 3, // 최대 재시도 횟수
  retryDelay: (retryCount) => {
    return retryCount * 1000; // 재시도 간 딜레이 (밀리초)
  },
  retryCondition: (error) => {
    // 재시도 조건 설정 (예: 네트워크 오류 또는 5xx 에러 시 재시도)
    return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
  },
});

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

async function crawlSaramin(keyword, pages = 1) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };

  for (let page = 1; page <= pages; page++) {
    const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${encodeURIComponent(keyword)}&recruitPage=${page}`;

    try {
      const response = await axios.get(url, { headers });
      const $ = cheerio.load(response.data);

      const jobListings = $('.item_recruit');

      for (let i = 0; i < jobListings.length; i++) {
        try {
          const job = jobListings.eq(i);

          const company = job.find('.corp_name a').text().trim();
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
          
        // 기술 스택 추출 (가능한 경우)
          const skills = [];
          job.find('.job_sector a').each((idx, elem) => {
              skills.push($(elem).text().trim());
            });
          // 중복 데이터 검사 (이미 존재하는 경우 저장하지 않음)
          const existingJob = await Job.findOne({ link });

          if (!existingJob) {
            const newJob = new Job({
              company,
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

            await newJob.save();
            console.log(`새로운 채용 공고 저장: ${title}`);
          } else {
            console.log(`이미 존재하는 채용 공고: ${title}`);
          }

        } catch (err) {
          console.error(`항목 파싱 중 에러 발생: ${err}`);
          continue;
        }
      }

      console.log(`${page}페이지 크롤링 완료`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 서버 부하 방지를 위한 딜레이

    } catch (err) {
      console.error(`페이지 요청 중 에러 발생: ${err}`);
      continue;
    }
  }

  // 모든 작업이 끝나면 mongoose 연결 종료
  mongoose.connection.close();
}

// 사용 예시
(async () => {
  await crawlSaramin('개발자', 5); // '개발자' 키워드로 5페이지 크롤링
})();
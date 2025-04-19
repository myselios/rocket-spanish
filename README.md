# 로켓스페인어

스페인어와 한국어 음성 녹음 및 유튜브 업로드 자동화 플랫폼

![로고](https://via.placeholder.com/150)

## 프로젝트 소개

로켓스페인어는 스페인어 학습을 위한 자동화된 플랫폼입니다. 스페인어 문장의 녹음과 한국어 번역을 관리하며, 유튜브 업로드까지 자동화합니다.

## 시작하기

### 개발 환경 설정

개발 환경을 로컬에서 실행하기:

```bash
npm install
npm run dev
```

### Docker를 이용한 실행

이 프로젝트는 Docker를 통해 쉽게 시작할 수 있습니다.

#### Docker로 직접 빌드 및 실행

```bash
# 이미지 빌드
docker build -t rocketspanish .

# 컨테이너 실행
docker run -p 3000:3000 rocketspanish
```

#### Docker Compose를 이용한 실행

```bash
# 서비스 빌드 및 시작
docker-compose up -d

# 서비스 중지
docker-compose down
```

### 개발 환경

이 프로젝트는 다음 기술 스택을 사용합니다:

- Next.js 15
- React 19
- Tailwind CSS
- TypeScript

## 주요 기능

- 스페인어 문장과 한국어 번역 관리
- 음성 파일 업로드 및 처리
- 작업자 상태 모니터링
- 통계 및 보고서 제공

## 디렉토리 구조

```
/
├── public/         # 정적 파일
├── src/
│   ├── app/        # Next.js 앱 라우터
│   │   ├── dashboard/    # 대시보드 페이지
│   │   ├── files/        # 파일 관리 페이지
│   │   ├── statistics/   # 통계 페이지
│   │   ├── workers/      # 작업자 관리 페이지
│   │   └── settings/     # 설정 페이지
│   └── components/ # 재사용 가능한 컴포넌트
├── Dockerfile      # Docker 설정
└── docker-compose.yml # Docker Compose 설정
```

## 라이센스

MIT

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Rocket 프로젝트

## Docker로 실행하기

### 사전 요구사항

- Docker
- Docker Compose

### 빌드 및 실행

```bash
# 이미지 빌드 및 컨테이너 실행
docker-compose up -d --build

# 로그 확인
docker-compose logs -f
```

### 중요 경로

- 웹 애플리케이션: http://localhost:3000
- JSON 서버: http://localhost:3002

### 데이터 디렉토리

- TTS 입력 파일: `./data/tts/input`
- TTS 출력 파일: `./data/tts/output`

### 컨테이너 종료

```bash
docker-compose down
```

## 로컬에서 개발 환경으로 실행하기

### 사전 요구사항

- Node.js (v18 이상)
- npm

### 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행 (Next.js + JSON 서버)
npm run dev
```

### 중요 경로

- 개발 서버: http://localhost:3000
- JSON 서버: http://localhost:3002

# 🌏 GlobalNomad
>__일상을 벗어나, 특별한 체험을 예약하다.__

GlobalNomad는 다양한 문화 체험 상품을 한눈에 확인하고, 

지도 및 달력 SDK를 통해 예약 날짜와 위치를 직관적으로 확인할 수 있는 예약 플랫폼입니다. 

사용자는 판매자이자 체험자로서, 체험 등록부터 예약, 후기, 관리 등의 전 과정을 직접 관리할 수 있습니다.
### Framework & Language
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### Auth
![Kakao OAuth](https://img.shields.io/badge/Kakao_OAuth-FEE500?style=for-the-badge&logo=kakaotalk&logoColor=000000)

### State & Data
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Jotai](https://img.shields.io/badge/Jotai-2B2B2B?style=for-the-badge)

### Styling & Design System
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### 날짜/지도/주소
![Day.js](https://img.shields.io/badge/Day.js-CF2B2B?style=for-the-badge&logo=dayjs&logoColor=white)
![Kakao Maps SDK](https://img.shields.io/badge/Kakao_Maps_SDK-FEE500?style=for-the-badge&logo=kakaotalk&logoColor=000000)

### UI 컴포넌트 & 애니메이션
![Embla Carousel](https://img.shields.io/badge/Embla_Carousel-2B2B2B?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vaul Drawer](https://img.shields.io/badge/Vaul_Drawer-2B2B2B?style=for-the-badge)

### Deploy & Storage
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)

---

## ⏱️ 개발 기간
2025.09.26 ~ 2025.10.29

## 🧑‍💻 개발자 소개
<img width="750" height="345" alt="스크린샷 2025-11-02 오후 6 15 15" src="https://github.com/user-attachments/assets/680d47c5-97d6-4f0a-9af1-3bc900852c6c" />


## 🚀 배포 링크
<https://global-nomad-henna.vercel.app/>

---

## ✨ 주요 기능

- **회원가입 / 로그인**  
  - 이메일·비밀번호 검증 및 에러 메시지 표시  
  - Kakao OAuth를 통한 간편 로그인 지원  

- **마이페이지**  
  - 닉네임, 비밀번호, 프로필 이미지 수정  
  - 이미지 업로드 및 즉시 반영 (React Query 캐시 갱신)  

- **체험 상세**
  - 체험 등록, 수정, 삭제  
  - 제목, 카테고리, 설명, 가격, 주소, 이미지 입력  
  - 등록/수정 시 확인 모달 표시, 중복 시간대 방지
  - 체험 후기 페이지 네이션

- **예약 기능**
  - 예약 신청, 취소, 승인, 거졀, 체험 완료로 분류
  - 캘린더 SDK로 예약 가능한 날짜·시간 표시  
  - Kakao 지도 SDK로 체험 위치 확인 및 선택 가능  

- **후기 작성**  
  - 별점(1~5점) + 텍스트 입력  

- **메인 페이지**  
  - 카테고리 필터, 가격 정렬(낮은순/높은순)
  - 키워드 검색  
  - 인기 체험 무한 스크롤 표시  


## 📂 폴더 구조
```
/src
├─ app
│ ├─ login
│ │ ├─ page.tsx # 로그인 페이지
│ │ └─ components/ # 로그인 전용 폼 컴포넌트
│ ├─ page.tsx # 메인 페이지
│ └─ layout.tsx # 전체 레이아웃 구성
├─ components/ # 재사용 가능한 공통 UI 컴포넌트
├─ lib
│ ├─ api/ # API 요청 관련 로직
│ ├─ hooks/ # 전역 훅 (useAuth, useInfiniteScroll 등)
│ └─ utils/ # 공용 유틸리티 함수
└─ styles
└─ globals.css # 전역 스타일 관리
```

## ⚙️ 개발 워크플로우
![Git Flow](https://img.shields.io/badge/Git_Flow-branching_strategy-blue?style=flat-square&logo=git&logoColor=white)
- `main` : 배포용
- `develop` : 다음 버전 통합용
- `feature/*` : 기능 단위 개발 브랜치 ( develop에서 분기 )

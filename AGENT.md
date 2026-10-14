# 📘 AGENT.md — HanUp (한업 | 韩升) Master Architecture & Specification

## 1. Project Identity & Core Vision
- **Brand Name:** **HanUp (한업 | 중문: 韩升 | 영문: HanUp Korean)**
- **Slogan:** "한국어 실력 향상(Up)과 급수 상승(升)을 하나로 끝내는 AI 통합 교육 플랫폼"
- **Series Naming Architecture:**
  - `한업 토픽 (HanUp TOPIK | 韩升 TOPIK)` — 읽기 / 듣기 / 쓰기 (53·54번 집중)
  - `한업 톡 (HanUp Talk | 韩升口语)` — 왕초보 생존 회화 및 발음·연음 클리닉
  - `한업 한자어 (HanUp Vocab)` — 중국어권 특화 동형이의 한자어 및 고급 어휘
  - `한업 비즈니스/아카데믹 (HanUp Pro)` — 대학원 유학 및 한국 기업 취업 실무
- **4 Core Objectives:**
  1. **EdTech Monetization (B2C):** 무료 진단 및 소량 약점 문제(3제) 제공 → 유료 심화 문제집(120제), PDF 전자책, AI 구독 패스, 라이브 특강 결제 유도.
  2. **Multi-Tenant SaaS (B2B):** 1인 교사(프리랜서 튜터) 및 국내외 어학원이 클래스를 개설하고 학생 진도·과제·AI 첨삭을 관리하는 분양형 플랫폼.
  3. **Authoring & OSMU Automation (CMS):** Lv.4 관리자가 원고 블록을 작성하면 웹북, QR 연동 PDF, AI 음성, 샤오홍슈(小红书)/빌리빌리(Bilibili)/인스타그램 마케팅 소스로 원클릭 변환.
  4. **Academic Research Corpus Logging:** 한국어교육학 연구(AI 피드백 수용 양상, 수사학적 글쓰기 전략, 중간언어 오류 분석)를 위한 종단 데이터 자동 수집 및 CSV/JSON 추출.

---

## 2. Tech Stack & UI/UX Guidelines
- **Framework:** Next.js 14+ (App Router), TypeScript, React 18+
- **Styling & UI:** Tailwind CSS, Lucide React (Icons), Shadcn UI pattern
- **Data Visualization:** Recharts or Chart.js (점수 추이 Line Chart, 6대 영역 약점 Radar Chart)
- **Backend / DB:** Firebase (Firestore, Auth, Storage) or Supabase (PostgreSQL) — *MVP 단계에서는 즉각적인 시연과 상태 변경이 가능하도록 Mock Store(Zustand/Context)와 DB 어댑터 패턴을 병행 구현할 것.*
- **AI Integration:** LLM API (OpenAI / Claude / Gemini API) for 1) TOPIK 53·54 Writing Feedback, 2) Multi-lingual Vocab Tagging (KO/ZH-CN/EN), 3) Distractor Item Generation, 4) Xiaohongshu Card News Copywriting.
- **Audio & TTS:** ElevenLabs API / Web Speech API 연동 구조 (배속 조절 `0.8x` ~ `1.2x` 및 타임스탬프 딕테이션).
- **Internationalization (i18n):** 한국어(KO) UI를 기본으로 하되, 학습자 화면 및 안내 문구는 중국어 간체(ZH-CN) 병기 또는 토글 지원.

---

## 3. 4-Tier Role-Based Access Control (RBAC) & Multi-Tenancy
모든 데이터와 UI는 아래 4단계 권한 계층을 엄격히 따른다. 초기 개발 시 상단 헤더에 **[Role Switcher]**를 두어 4가지 뷰를 즉시 오가며 테스트할 수 있어야 한다.

1. **Lv.4 `super_admin` (플랫폼 오너 & 저자 & 연구 총괄):**
   - **한업 스튜디오 (`/admin/studio`):** 시리즈 및 챕터 생성, 블록 에디터 집필, AI 문항/음원 생성, 인쇄용 QR PDF 조판, 샤오홍슈/인스타 OSMU 데이터 추출.
   - **연구 데이터 센터 (`/admin/research`):** 전체 기관/학생의 익명화된 오류 로그 및 작문 코퍼스(초안-AI피드백-교사피드백-수정본) 필터링 및 CSV 내보내기.
   - **파트너 관리 (`/admin/orgs`):** 가입한 어학원(`orgId`) 및 개인 교사 구독 티어·좌석 수 관리.

2. **Lv.3 `org_admin` (어학원 원장 / 기관 관리자):**
   - 본인 기관(`orgId`)의 화이트라벨링 설정(학원 로고, 브랜드 컬러).
   - 소속 교사(`instructor`) 계정 등록 및 반(`classId`) 개설, 학생 시트(Seat) 할당 및 학원 전체 성적·진도 통계 열람.

3. **Lv.2 `instructor` (개인 과외 교사 / 학원 소속 강사):**
   - 6자리 초대 코드(`inviteCode`, 예: `UP5482`) 및 QR코드로 담당 학생 등록.
   - **Human-in-the-Loop 첨삭 검수 (`/teacher/grading`):** 학생이 제출한 쓰기 답안에 대해 AI가 생성한 1차 첨삭을 검토하고, 체크(승인) 및 교사 2차 코멘트(`teacherComment`)와 최종 점수를 부여하여 전송 (첨삭 시간 90% 단축).
   - **반별 약점 클리닉 배정:** 담당 반 학생들이 가장 많이 틀린 영역의 문제를 일괄 숙제로 발송하고 학부모/학생 상담용 PDF 성적표 출력.

4. **Lv.1 `student` (개인 B2C 독학러 / 학원 소속 학생):**
   - **마이 대시보드 (`/dashboard`):** 목표 급수 디데이, 주차별 예상 점수 상승 그래프, 6대 영역 약점 레이더 차트(어휘·문법·듣기·읽기·쓰기53·쓰기54), 시리즈별 진도율 바.
   - **약점 보완 클리닉 (`/clinic`):** 오답 로그 기반 '오늘의 무료 약점 문제 3제' 풀이 + '맞춤형 심화 120제' 유료 잠금 해제(Freemium Paywall Modal).
   - **스마트 학습 뷰어 (`/study/[seriesId]/[chapterId]`):**
     - `Tab 1 (개념 & 읽기)`: 어휘 클릭 시 한·중·영 뜻과 급수가 뜨는 인터랙티브 웹북.
     - `Tab 2 (듣기 & 딕테이션)`: 배속 플레이어 및 핵심 어휘 빈칸 클릭/타이핑 훈련.
     - `Tab 3 (쓰기 & AI 튜터)`: 200자/700자 원고지 글자 수 카운터, AI 실시간 1차 첨삭 결과(문법 오류, 중국어 번역투 교정, 논증 구조 피드백, 예상 점수) 확인 및 **[고쳐쓰기(Revision) 제출]** 기능.

---

## 4. Core Database Schema (TypeScript Interfaces)
모든 컬렉션은 추후 B2B 확장을 위해 `orgId`(기본값: `"org_hanup_hq"`)를 필수 보유한다.

```typescript
// 1. Organization (기관/어학원 및 직영 본사)
export interface Organization {
  orgId: string; // Default: "org_hanup_hq"
  orgName: string;
  orgType: 'direct_b2c' | 'academy' | 'solo_tutor';
  planTier: 'free_trial' | 'tutor_pro' | 'academy_biz' | 'enterprise';
  maxStudentSeats: number;
  customBranding?: { logoUrl: string; primaryColor: string };
  licensedSeriesIds: string[];
}

// 2. ClassGroup (교사 담당 반 / 과외 그룹)
export interface ClassGroup {
  classId: string;
  orgId: string;
  instructorId: string;
  className: string;
  inviteCode: string; // 6-digit code (e.g., "UP5482")
  assignedSeriesIds: string[];
  studentUids: string[];
}

// 3. UserProfile (4단계 권한 통합 유저 & 연구 배경 변인)
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'super_admin' | 'org_admin' | 'instructor' | 'student';
  orgId: string;
  classIds: string[];
  // 학술 연구용 배경 변인 (Student 전용)
  nativeLanguage: 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'other';
  currentTopikLevel: number; // 0(왕초보) ~ 6
  targetTopikLevel: number;
  learningPurpose: 'grad_school' | 'undergrad' | 'employment' | 'hobby';
  subscriptionTier: 'free' | 'clinic_pack' | 'hanup_pro_pass' | 'vip_coaching';
  researchConsent: boolean;
  // 시각화용 역량 지표 (0~100)
  skillRadar: {
    vocabHanja: number;      // 한자어·어휘
    grammarConnective: number; // 연결어미·문법
    listeningInference: number; // 듣기 추론·연음
    readingSkimming: number;   // 읽기 속독·논리
    writing53Data: number;     // 53번 도표 분석
    writing54Logic: number;    // 54번 논술 구조
  };
  scoreHistory: Array<{ weekLabel: string; totalScore: number; date: string }>;
}

// 4. AuthoringBlock (Lv.4 한업 스튜디오 원고 블록 & OSMU 소스)
export interface AuthoringBlock {
  blockId: string;
  seriesId: string; // e.g., "hanup_topik_writing", "hanup_talk_basic"
  chapterId: string;
  orderIndex: number;
  blockType: 'concept_note' | 'reading_passage' | 'listening_script' | 'writing_prompt';
  title: string;
  koContent: string;
  zhExplanation: string;
  vocabAnnotations: Array<{
    word: string;
    zhMeaning: string;
    enMeaning: string;
    topikLevel: number;
    commonChineseErrorNote?: string; // 중국인이 흔히 착각하는 포인트
  }>;
  audioConfig?: {
    voiceId: string;
    mp3Url: string;
    dictationBlanks: string[];
  };
  writingRubric?: {
    targetChars: [number, number]; // e.g., [600, 700]
    requiredKeywords: string[];
    rhetoricStructureGuide: string;
    modelAnswer: string;
  };
  qrBridgeUrl: string; // PDF 출력 시 상단에 인쇄될 웹앱 딥링크
  osmuExport?: {
    xiaohongshuTitle: string;
    xiaohongshuSlides: string[]; // 3:4 카드뉴스 각 장 텍스트 (Canva CSV 연동용)
    shortFormScript40s: string;  // 빌리빌리/더우인/릴스용 40초 대본
  };
}

// 5. ItemBank (교재 문항 & 약점 보완 클리닉 문제 은행)
export interface ItemBankQuestion {
  itemId: string;
  targetSkill: keyof UserProfile['skillRadar'];
  difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6;
  accessTier: 'free_daily_3' | 'paid_clinic_120';
  questionStem: string;
  passageOrAudioText?: string;
  options: [string, string, string, string];
  correctIndex: number; // 0 ~ 3
  explanationKo: string;
  explanationZh: string;
  liveAnalytics: {
    totalAttempts: number;
    correctRate: number;
    optionSelectionCounts: [number, number, number, number];
  };
}

// 6. WritingSubmission (핵심 학술 연구 코퍼스: 초안 -> AI -> 교사 -> 수정본)
export interface WritingSubmission {
  submissionId: string;
  uid: string;
  orgId: string;
  classId?: string;
  blockId: string;
  initialDraft: string;
  aiFeedback: {
    estimatedScore: number; // 50점 만점 기준
    estimatedLevel: number;
    grammarAndEndingErrors: Array<{ original: string; corrected: string; reasonZh: string }>;
    chineseTranslationToneFixes: Array<{ awkward: string; naturalKo: string; tipZh: string }>;
    rhetoricAndLogicComment: string;
  };
  instructorFeedback?: {
    instructorId: string;
    approvedAiFeedback: boolean;
    teacherComment: string;
    finalScore: number;
    reviewedAt: string;
  };
  revisedDraft?: string; // 학습자가 피드백 수용 후 다시 작성한 글
  submittedAt: string;
}

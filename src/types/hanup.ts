/**
 * 📘 HanUp (한업 | 韩升) Core Data Schema & RBAC Types
 * Single Source of Truth based on AGENT.md
 */

// ==========================================
// 1. Role-Based Access Control (4-Tier RBAC)
// ==========================================
export type UserRole = 'super_admin' | 'org_admin' | 'instructor' | 'student';

export interface RoleMeta {
  role: UserRole;
  level: 1 | 2 | 3 | 4;
  labelKo: string;
  labelZh: string;
  descriptionKo: string;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleMeta> = {
  student: {
    role: 'student',
    level: 1,
    labelKo: '학생 (Lv.1)',
    labelZh: '学员 (Lv.1)',
    descriptionKo: '학습자 대시보드, 약점 클리닉, 스마트 뷰어(개념·듣기·쓰기 53·54)',
  },
  instructor: {
    role: 'instructor',
    level: 2,
    labelKo: '교사 (Lv.2)',
    labelZh: '教师 (Lv.2)',
    descriptionKo: 'Human-in-the-Loop AI 2차 첨삭 검수, 반별 약점 과제 배정 및 성적 관리',
  },
  org_admin: {
    role: 'org_admin',
    level: 3,
    labelKo: '기관/원장 (Lv.3)',
    labelZh: '机构管理员 (Lv.3)',
    descriptionKo: '기관 화이트라벨링, 강사 등록, 클래스 개설, 시트 및 통합 통계 관리',
  },
  super_admin: {
    role: 'super_admin',
    level: 4,
    labelKo: '한업 본사 (Lv.4)',
    labelZh: '平台超管 (Lv.4)',
    descriptionKo: '한업 저작 스튜디오, OSMU 마케팅 엔진, 학술 연구 데이터 센터, B2B 파트너 관리',
  },
};

// ==========================================
// 2. Organization (기관 / 어학원 및 직영 본사)
// ==========================================
export interface Organization {
  orgId: string; // Default: "org_hanup_hq"
  orgName: string;
  orgType: 'direct_b2c' | 'academy' | 'solo_tutor';
  planTier: 'free_trial' | 'tutor_pro' | 'academy_biz' | 'enterprise';
  maxStudentSeats: number;
  usedStudentSeats: number;
  customBranding?: {
    logoUrl: string;
    primaryColor: string;
    subdomain?: string;
  };
  licensedSeriesIds: string[];
  createdAt: string;
}

// ==========================================
// 3. ClassGroup (교사 담당 반 / 과외 그룹)
// ==========================================
export interface ClassGroup {
  classId: string;
  orgId: string;
  instructorId: string;
  className: string;
  inviteCode: string; // 6-digit code (e.g., "UP5482")
  assignedSeriesIds: string[];
  studentUids: string[];
  averageTopikScore?: number;
  createdAt: string;
}

// ==========================================
// 4. UserProfile (4단계 권한 통합 유저 & 연구 배경 변인)
// ==========================================
export interface SkillRadar {
  vocabHanja: number;        // 한자어·고급어휘 (0~100)
  grammarConnective: number; // 연결어미·문법 (0~100)
  listeningInference: number;// 듣기 추론·연음 (0~100)
  readingSkimming: number;   // 읽기 속독·논리 (0~100)
  writing53Data: number;     // 53번 도표·자료 분석 (0~100)
  writing54Logic: number;    // 54번 논술 수사 구조 (0~100)
}

export interface ScoreHistoryEntry {
  weekLabel: string; // e.g. "Week 1", "Week 2"
  totalScore: number; // 예상 점수 (300점 만점 기준)
  listeningScore: number;
  readingScore: number;
  writingScore: number;
  date: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  orgId: string;
  classIds: string[];
  
  // 학술 연구용 7대 배경 변인 (IRB 표준 연구 변인)
  nativeLanguage: 'zh-CN' | 'zh-TW' | 'vi-VN' | 'my-MM' | 'en-US' | 'ja-JP' | 'other';
  studyDuration?: '<6m' | '6m-1y' | '1y-2y' | '2y+';
  studyMethod?: 'self' | 'university_center' | 'private_academy' | 'online_lecture' | 'tutoring';
  visitKoreaExperience?: 'none' | 'short_trip' | 'exchange_program' | 'residing_student';
  currentTopikLevel: number; // 0(왕초보) ~ 6
  targetTopikLevel: number;
  learningPurpose: 'grad_school' | 'undergrad' | 'employment' | 'life_hobby' | 'hobby';
  subscriptionTier: 'free' | 'clinic_pack' | 'hanup_pro_pass' | 'vip_coaching';
  researchConsent: boolean; // 연구 데이터 수집 동의 여부
  isAdultConfirmed?: boolean; // 만 18세 이상 성인 학습자 확인 여부
  isWithdrawn?: boolean; // 연구 참여 동의 철회(Opt-out) 여부
  withdrawnAt?: string;

  // PC + 모바일 최대 2기기 동시 세션 관리 (Companion OCR)
  activeDevices?: {
    deviceType: 'desktop' | 'mobile';
    deviceName: string;
    lastActiveAt: string;
    ipMasked?: string;
  }[];

  // 크로스 혜택 및 숙제 생성 크레딧
  hasSoriTutorSub?: boolean;
  unlockedSeriesIds?: string[];
  homeworkCredits?: number; // 교사(기본 10) 및 기관(기본 50) 숙제 AI 생성 크레딧

  // 시각화용 역량 지표 (0~100)
  skillRadar: SkillRadar;
  scoreHistory: ScoreHistoryEntry[];

  // 일일 AI/OCR 쿼터 사용량 (Free 티어 제한용)
  dailyUsage?: {
    date: string; // YYYY-MM-DD
    aiGradeCount: number;
    ocrCount: number;
  };

  // 시리즈별 진도율 (0~100%)
  seriesProgress: {
    [seriesId: string]: number;
  };
}

// ==========================================
// 5. AuthoringBlock (Lv.4 한업 스튜디오 원고 블록 & OSMU 소스)
// ==========================================
export type BlockType = 'concept_note' | 'reading_passage' | 'listening_script' | 'writing_prompt';

export interface VocabAnnotation {
  word: string;
  zhMeaning: string;
  enMeaning: string;
  jaMeaning?: string; // 일본어
  viMeaning?: string; // 베트남어
  myMeaning?: string; // 미얀마어 (버마어)
  topikLevel: number;
  commonChineseErrorNote?: string;
  l1ContrastiveNotes?: {
    ko?: string;
    zh?: string;
    ja?: string;
    en?: string;
    vi?: string;
    my?: string;
    [key: string]: string | undefined;
  };
}

export interface AudioConfig {
  voiceId: string;
  mp3Url: string;
  dictationBlanks: string[]; // 빈칸 뚫을 단어/어절 리스트
  durationSec?: number;
}

export interface WritingRubric {
  targetChars: [number, number]; // e.g., [200, 300] for #53 or [600, 700] for #54
  requiredKeywords: string[];
  rhetoricStructureGuide: string; // 서론(도입)-본론(현황·원인·대책)-결론(전망) 구조 가이드
  modelAnswer: string;
}

export interface OsmuExport {
  xiaohongshuTitle: string;
  xiaohongshuSlides: string[]; // 3:4 카드뉴스 각 슬라이드 본문 (Canva CSV / 디자인 규격 연동)
  shortFormScript40s: string;  // 빌리빌리/더우인/릴스용 40초 숏폼 스크립트
}

// ==========================================
// 5.1. YouTube & Short-form Lecture Video Studio (Lv.4 OSMU Video Suite)
// ==========================================
export type VideoLectureDuration = 'short_60s' | 'micro_3m' | 'in_depth_8m';
export type VideoLectureTone = 'friendly_tutor' | 'charisma_star' | 'calm_shadowing';

export interface VideoScene {
  sceneId: string;
  sceneIndex: number; // 1, 2, 3...
  sceneRole: string; // e.g., "Scene 1: 오프닝 & 3초 훅(Hook)"
  startTimeSec: number;
  endTimeSec: number;
  timecodeDisplay: string; // e.g., "00:00 - 00:15"
  narrationKo: string; // 친근한 강사 구어체 대본
  subtitleKo: string;  // 화면 표출 자막 텍스트
  bRollType: 'highlighter_3s' | 'template_54' | 'manuscript_grid' | 'book_cover_3d' | 'sori_f0_pitch' | 'rubric_scorecard';
  bRollLabel: string; // e.g., "3초 스키밍 형광펜 그래픽", "54번 서론-본론 템플릿 카드"
  bRollDescription: string; // B-Roll 연출 및 그래픽 시각 지침
  sfxCue: string; // e.g., "띵동(정답음)", "찰칵(캡처)", "경쾌한 Lo-Fi BGM"
  multilingualSubtitles?: {
    ko: string;
    en: string;
    ja: string;
    zh: string;
    vi: string;
    my: string;
  };
}

export interface VideoSeoKit {
  title: string;
  description: string;
  hashtags: string[];
  tags: string[];
}

export interface VideoLectureProject {
  blockId: string;
  durationMode: VideoLectureDuration;
  instructorTone: VideoLectureTone;
  spokenScript: string;
  scenes: VideoScene[];
  seoKits: {
    ko: VideoSeoKit;
    en: VideoSeoKit;
    ja: VideoSeoKit;
    zh: VideoSeoKit;
    vi: VideoSeoKit;
    my: VideoSeoKit;
  };
  updatedAt: string;
}

export interface AuthoringBlock {
  blockId: string;
  seriesId: string; // e.g., "hanup_topik_writing", "hanup_talk_basic", "hanup_vocab_hanja"
  chapterId: string;
  chapterTitle?: string;
  orderIndex: number;
  blockType: BlockType;
  title: string;
  koContent: string;
  zhExplanation: string;
  multilingualExplanations?: {
    ko?: string;
    en?: string;
    ja?: string;
    zh?: string;
    vi?: string;
    my?: string;
    [key: string]: string | undefined;
  };
  vocabAnnotations: VocabAnnotation[];
  audioConfig?: AudioConfig;
  writingRubric?: WritingRubric;
  qrBridgeUrl: string; // PDF 인쇄 시 상단에 배치될 웹앱 딥링크
  osmuExport?: OsmuExport;
  videoLectureProject?: VideoLectureProject;
  updatedAt: string;
}

// ==========================================
// 6. ItemBank (교재 문항 & 약점 보완 클리닉 문제 은행)
// ==========================================
export interface LiveAnalytics {
  totalAttempts: number;
  correctRate: number; // 0 ~ 100 (%)
  optionSelectionCounts: [number, number, number, number]; // 1, 2, 3, 4번 보기 선택 횟수
}

export interface ItemBankQuestion {
  itemId: string;
  seriesId?: string;
  targetSkill: keyof SkillRadar;
  skillNameKo: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6;
  accessTier: 'free_daily_3' | 'paid_clinic_120';
  questionStem: string;
  passageOrAudioText?: string;
  questionNumber?: number;
  directionKo?: string;
  passage?: string;
  explanation?: string;
  options: [string, string, string, string];
  correctIndex: number; // 0 ~ 3
  explanationKo: string;
  explanationZh: string;
  multilingualExplanations?: {
    ko?: string;
    en?: string;
    ja?: string;
    zh?: string;
    vi?: string;
    my?: string;
    [key: string]: string | undefined;
  };
  liveAnalytics: LiveAnalytics;
}

// ==========================================
// 7. WritingSubmission (학술 연구 코퍼스: 초안 -> AI -> 교사 -> 수정본)
// ==========================================
export interface GrammarFixItem {
  original: string;
  corrected: string;
  reasonZh: string;
  reasonEn?: string;
  reasonJa?: string;
  reasonVi?: string;
  reasonMy?: string;
}

export interface TranslationToneFixItem {
  awkward: string;
  naturalKo: string;
  tipZh: string; // 중국어 모국어 간섭(L1 interference) 해설
  tipEn?: string;
  tipJa?: string;
  tipVi?: string;
  tipMy?: string;
}

export interface RubricBreakdown {
  taskPerformance: number; // 내용 및 과제 수행: 53번(7점), 54번(12점)
  textStructure: number;   // 글의 전개 구조: 53번(7점), 54번(12점)
  languageUsage: number;   // 언어 사용(어휘·문법·원고지): 53번(16점), 54번(26점)
  maxScore: 30 | 50;       // 53번: 30점 만점, 54번: 50점 만점
  totalCompositeMaxScore: 80; // TOPIK II 쓰기 총점 80점 만점 기준
}

export interface AiFeedback {
  estimatedScore: number; // 53번 30점 만점 or 54번 50점 만점 기준
  maxScore?: 30 | 50;
  rubricBreakdown?: RubricBreakdown;
  estimatedLevel: number; // 1~6급
  grammarAndEndingErrors: GrammarFixItem[];
  chineseTranslationToneFixes: TranslationToneFixItem[];
  rhetoricAndLogicComment: string;
  analyzedAt: string;
}

export interface InstructorFeedback {
  instructorId: string;
  instructorName?: string;
  approvedAiFeedback: boolean;
  teacherComment: string;
  finalScore?: number;
  maxScore?: 30 | 50;
  rubricBreakdown?: RubricBreakdown;
  audioMemoUrl?: string; // 강사 음성 메모 녹음 첨삭 URL
  audioDurationSec?: number;
  reviewedAt: string;
}

// ==========================================
// 7.1. Academic Research Telemetry & Longitudinal Study Schema
// ==========================================
export type StudyPhase = 'pre_test' | 'regular_task' | 'immediate_revision' | 'delayed_post_test';
export type RevisionMode = 'open_feedback' | 'blind_recall';

export interface WritingSubmissionTelemetry {
  pasteCount: number;
  pastedChars: number;
  pasteRatio: number; // pastedChars / totalChars (0.0 ~ 1.0)
  cpm: number; // characters per minute
  backspaceCount: number;
  activeDurationMs: number;
  isSuspectedExternalAi: boolean; // 외부 AI/번역기 붙여넣기 의심 여부
  allowPasteLocked?: boolean;
}

export interface CompanionOcrBridge {
  bridgeToken: string;
  chapterId: string;
  status: 'waiting' | 'uploaded' | 'completed';
  extractedText?: string;
  confidence?: number;
  imageUrl?: string;
  timestamp: number;
}

export interface WritingSubmission {
  submissionId: string;
  uid: string;
  studentName?: string;
  orgId: string;
  classId?: string;
  blockId: string;
  taskType: 'topik_53_graph' | 'topik_54_essay';
  taskPromptTitle: string;
  initialDraft: string;
  // 학술 연구 변인 (입력 방식 및 손글씨 원본 텍스트)
  inputMethod: 'keyboard_typing' | 'handwriting_ocr';
  rawOcrText?: string;
  researchConsent: boolean; // IRB 동의 여부
  consentedAt?: string;     // IRB 동의 일시
  isAdultConfirmed?: boolean; // 만 18세 이상 성인 학습자 확인
  isWithdrawn?: boolean;     // IRB 동의 철회(Opt-out) 여부
  studyPhase?: StudyPhase;   // 종단 연구 4단계 실험 태그
  revisionMode?: RevisionMode; // 피드백 참조(open_feedback) vs 블라인드 회상(blind_recall)
  telemetry?: WritingSubmissionTelemetry; // 작문 진위 검증 키스트로크 텔레메트리
  aiFeedback: AiFeedback;
  instructorFeedback?: InstructorFeedback;
  revisedDraft?: string; // 학습자가 1, 2차 피드백 수용 후 다시 작성한 글
  submittedAt: string;
  revisedAt?: string;

  // 우리반(UriBan) 통합 메타데이터
  uribanMeta?: {
    assignmentId?: string;
    activeDurationMs?: number;
    totalDurationMs?: number;
    pasteAttempts?: number;
    errorTags?: UriBanErrorTag[];
  };
}

// ==========================================
// 8. Series Architecture Metadata (A: TOPIK 4종, B: 생활한국어 4단계)
// ==========================================
export interface SeriesPrice {
  usd: number;
  krw: number;
  cny: number;
  isFree?: boolean;
  label?: string;
}

export interface BookCoverStyle {
  seriesId: string;
  themeColor: string; // Hex color (e.g. '#10b981', '#2563eb')
  accentColor?: string;
  layoutStyle: 'top' | 'center' | 'left'; // Title alignment & structure
  titleKo: string;
  titleZh?: string;
  subtitleKo: string;
  targetLevelText: string;
  spineText?: string;
  authorText: string;
  publisherText: string;
  isbnCode: string;
  barcodePrice: string;
  finishType: 'matte' | 'glossy' | 'leather';
  showQrCode: boolean;
  updatedAt?: string;
}

export interface HanUpSeries {
  seriesId: string;
  category: 'topik' | 'life';
  code: string;
  stageName: string; // e.g. "준비편 (1~2급)", "도전편 (3~4급)", "완성편 (4~6급)", etc.
  titleKo: string;
  titleZh: string;
  descriptionKo: string;
  descriptionZh: string;
  targetLevelText: string; // "1~2급", "3~4급", "4~6급", "자모/입문"
  durationWeeks: number; // 2, 4, 6, 1
  schedulePace: string; // "주2회 회당 40분", "주3회 회당 60분", etc.
  sessionMinutes: number; // 40, 60, 90, 45
  price: SeriesPrice;
  badgeText: string;
  accentColor: string;
  themeColor: 'mint' | 'blue' | 'indigo' | 'coral';
  iconName: string;
  chaptersCount: number;
  hasCampusTip?: boolean; // 완성편: <쉬어가기: 한국 대학·대학원 학업 & 캠퍼스 TIP>
  surveyTriggerAfterChapters?: number; // 준비편: 2회분 완료 시 설문 팝업
  coverStyle?: BookCoverStyle;
}

// ==========================================
// 8.1. AI Education Needs Analysis & WTP Survey
// ==========================================
export interface AiEducationSurveyResponse {
  responseId: string;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  nativeLanguage: string;
  submittedAt: string;
  aiPreferenceScore: number; // 1~5 Likert
  preferenceReasons: string[]; // 즉각 피드백, 심리적 편안함, 가성비, 모국어 해설 등
  concernFactors: string[]; // 정확도 의심, 획일성, 맥락 부족 등
  preferredInterventionTier: 'tier1_ai_only' | 'tier2_ai_human_review' | 'tier3_ai_group_lecture' | 'tier4_human_1on1';
  wtpTier1AiOnly: string; // "$5 미만", "$5~$10", "$10~$15", "$15 이상"
  wtpTier2AiHumanReview: string; // "$15 미만", "$15~$30", "$30~$50", "$50 이상"
  wtpTier3AiLiveCoaching: string; // "$30 미만", "$30~$60", "$60~$100", "$100 이상"
  openFeedbackText: string; // 토픽 모델링용 자유 서술형
  discountCouponCode?: string; // 20% 할인 쿠폰 (e.g. "HANUP20WTP")
}

// ==========================================
// 8.2. A4 Studio AI Illustration Prompts
// ==========================================
export interface IllustrationPrompt {
  promptKo: string;
  promptEn: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  style: 'modern_vector_illustration' | 'korean_webtoon_clean' | 'academic_flat_art';
  savedAssetPath?: string;
  isSaved?: boolean;
}

// ==========================================
// 8.3. Homework Tasks & Credit Packs (Lv.2/Lv.3)
// ==========================================
export interface HomeworkTask {
  id: string;
  title: string;
  taskType: 'topik_53_graph' | 'topik_54_essay' | 'vocab_clinic' | 'reading_quiz';
  targetLevel: number;
  rubric: string;
  rubricSummary?: string;
  content?: string;
  isOfficialVetted: boolean;
  createdByRole: 'super_admin' | 'instructor';
  assignedClassIds: string[];
  dueDate?: string;
  submissionsCount: number;
  createdAt: string;
}

export interface HomeworkCreditPack {
  id: string;
  packId?: string;
  name: string;
  description?: string;
  targetRole: 'instructor' | 'org_admin';
  credits: number;
  priceUsd: number;
  priceKrw: number;
}

// ==========================================
// 9. Sori Tutor (소리튜터) Phonology Integration
// ==========================================
export type SyllableStatus = 'match' | 'coda_error' | 'vowel_error' | 'mismatch' | 'omitted';

export interface SyllableResult {
  char: string;
  recognizedChar: string;
  status: SyllableStatus;
  tip?: string;
}

export interface SoriEvaluationPayload {
  userId: string;
  targetText: string;
  score: number; // 0 ~ 100
  recognized: string;
  explanation: string;
  advice: string;
  syllableResults: SyllableResult[];
}

export interface SoriEvaluationCompleteEvent {
  type: 'SORI_EVALUATION_COMPLETE';
  payload: SoriEvaluationPayload;
}

export interface PhonologyErrorLog {
  id?: string;
  logId?: string;
  uid?: string;
  userId?: string;
  studentName?: string;
  userName?: string;
  targetSentence?: string;
  targetText?: string;
  recognized?: string;
  recognizedText?: string;
  score: number;
  syllableResults: SyllableResult[];
  codaErrorCount?: number;
  codaErrorsCount?: number;
  vowelErrorCount?: number;
  vowelErrorsCount?: number;
  explanation?: string;
  advice?: string;
  evaluatedAt?: string;
  timestamp?: string;
}

// ==========================================
// 10. UriBan (우리반) Schema Integration
// ==========================================
export type UriBanErrorCategory =
  | '조사 오류'
  | '시제 사용 오류'
  | '어순 오류'
  | '불규칙 활용 오류'
  | '연결어미 오류'
  | '높임법 오류'
  | '어휘 선택 오류'
  | '기타';

export interface UriBanErrorTag {
  category: UriBanErrorCategory;
  severity: 'minor' | 'moderate' | 'major';
  original: string;
  correction: string;
  explanation: string;
}

// ==========================================
// 11. Drip Release & Course Expiration Types
// ==========================================
export interface SeriesEnrollment {
  seriesId: string;
  enrolledAt: string; // ISO date of purchase/enrollment
  expiresAt: string; // ISO date when course closes (Sunset date)
  isExpired?: boolean;
  completedChapterIds: string[];
}

export interface ChapterAccessStatus {
  chapterId: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  lockReason?: 'prerequisite_incomplete' | 'drip_date_not_reached' | 'course_expired' | 'unpurchased';
  unlockDate?: string;
  daysRemainingInCourse?: number;
}

// ==========================================
// 12. Push & Email Notification Settings
// ==========================================
export interface UserNotificationSettings {
  webPushEnabled: boolean;
  emailReminderEnabled: boolean;
  marketingConsent: boolean; // 깜짝 쿠폰 및 프로모션 안내 수신 동의
  studyReminderTime: string; // e.g. "20:00"
  reminderDays: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  lastNotificationSentAt?: string;
}


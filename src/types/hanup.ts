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
  
  // 학술 연구용 배경 변인 (Student 전용)
  nativeLanguage: 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'other';
  currentTopikLevel: number; // 0(왕초보) ~ 6
  targetTopikLevel: number;
  learningPurpose: 'grad_school' | 'undergrad' | 'employment' | 'hobby';
  subscriptionTier: 'free' | 'clinic_pack' | 'hanup_pro_pass' | 'vip_coaching';
  researchConsent: boolean; // 연구 데이터 수집 동의 여부

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

export interface AiFeedback {
  estimatedScore: number; // 50점 만점 기준
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
  reviewedAt: string;
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
// 8. Series Architecture Metadata
// ==========================================
export interface HanUpSeries {
  seriesId: string;
  code: 'hanup_topik' | 'hanup_talk' | 'hanup_vocab' | 'hanup_pro';
  titleKo: string;
  titleZh: string;
  descriptionKo: string;
  descriptionZh: string;
  badgeText: string;
  accentColor: string;
  iconName: string;
  chaptersCount: number;
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

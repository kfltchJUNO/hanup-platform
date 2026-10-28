/**
 * 📘 HanUp Track B: Academic Argumentation Core Types
 * Grounded in Chaïm Perelman's New Rhetoric & Stephen Toulmin's Model of Argument
 */

export type ToulminElement = 'C' | 'D' | 'W' | 'B' | 'Q' | 'R' | 'NONE';

export interface ToulminMeta {
  code: ToulminElement;
  nameKo: string;
  nameEn: string;
  nameZh: string;
  descriptionKo: string;
  perelmanConcept: string; // Perelman's rhetoric connection
  colorClass: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    hover: string;
  };
}

export const TOULMIN_ELEMENT_METAS: Record<ToulminElement, ToulminMeta> = {
  C: {
    code: 'C',
    nameKo: '주장 (Claim)',
    nameEn: 'Claim',
    nameZh: '主张',
    descriptionKo: '논증의 궁극적 결론이자 청중이 수용하기를 요구하는 핵심 명제',
    perelmanConcept: '청중의 동의(Adherence)를 이끌어내려는 최종 목적지',
    colorClass: {
      bg: 'bg-blue-100',
      text: 'text-blue-900',
      border: 'border-blue-500',
      badge: 'bg-blue-600 text-white',
      hover: 'hover:bg-blue-200',
    },
  },
  D: {
    code: 'D',
    nameKo: '자료 (Data / Grounds)',
    nameEn: 'Data',
    nameZh: '事实根据',
    descriptionKo: '주장의 토대가 되는 객관적 사실, 통계, 관찰, 실증적 증거',
    perelmanConcept: '청중이 이미 합의한 출발점(출발 사실·전제)',
    colorClass: {
      bg: 'bg-green-100',
      text: 'text-green-900',
      border: 'border-green-500',
      badge: 'bg-green-600 text-white',
      hover: 'hover:bg-green-200',
    },
  },
  W: {
    code: 'W',
    nameKo: '정당화 (Warrant)',
    nameEn: 'Warrant',
    nameZh: '正当理由 (保证)',
    descriptionKo: '자료(D)로부터 주장(C)으로 나아가는 논리적 다리이자 보편적 원리',
    perelmanConcept: '가치 위계(Hierarchy of Values) 및 연결 연합(Liaison)',
    colorClass: {
      bg: 'bg-amber-100',
      text: 'text-amber-900',
      border: 'border-amber-500',
      badge: 'bg-amber-600 text-white',
      hover: 'hover:bg-amber-200',
    },
  },
  B: {
    code: 'B',
    nameKo: '뒷받침 (Backing)',
    nameEn: 'Backing',
    nameZh: '支援根据',
    descriptionKo: '정당화(W) 자체의 신뢰성을 지탱하는 법적·제도적·이론적 심층 근거',
    perelmanConcept: '보편 청중(Universal Audience)이 인정하는 기본 공리',
    colorClass: {
      bg: 'bg-purple-100',
      text: 'text-purple-900',
      border: 'border-purple-500',
      badge: 'bg-purple-600 text-white',
      hover: 'hover:bg-purple-200',
    },
  },
  Q: {
    code: 'Q',
    nameKo: '조건/한정 (Qualifier)',
    nameEn: 'Qualifier',
    nameZh: '限定修饰',
    descriptionKo: '주장이 적용되는 범위, 확률적 개연성, 예외 전제(예: 특정 조건 하에서만)',
    perelmanConcept: '개념의 해리(Dissociation)를 통한 범위의 정교화',
    colorClass: {
      bg: 'bg-slate-200',
      text: 'text-slate-800',
      border: 'border-slate-500',
      badge: 'bg-slate-700 text-white',
      hover: 'hover:bg-slate-300',
    },
  },
  R: {
    code: 'R',
    nameKo: '반론/예외 (Rebuttal)',
    nameEn: 'Rebuttal',
    nameZh: '反驳与预先回应',
    descriptionKo: '상대방이 제기할 수 있는 반박을 선제적으로 인정하고 허무는 반론 대응',
    perelmanConcept: '적대적 복합 청중과의 수사적 협상 및 양보(Concession)',
    colorClass: {
      bg: 'bg-rose-100',
      text: 'text-rose-900',
      border: 'border-rose-500',
      badge: 'bg-rose-600 text-white',
      hover: 'hover:bg-rose-200',
    },
  },
  NONE: {
    code: 'NONE',
    nameKo: '일반 서술',
    nameEn: 'General',
    nameZh: '一般陈述',
    descriptionKo: '도입, 환기, 단순 연결 등 논증적 요소가 없는 문장',
    perelmanConcept: '주의 환기용 도입 수사',
    colorClass: {
      bg: 'bg-transparent',
      text: 'text-slate-800',
      border: 'border-transparent',
      badge: 'bg-slate-400 text-white',
      hover: 'hover:bg-slate-50',
    },
  },
};

// ==========================================
// 1. Audience Persona (청중 페르소나)
// ==========================================
export interface AudiencePersona {
  id: string;
  role: string;             // e.g. "보수적 재정 관료", "청년 노동자 대표", "친환경 환경운동가"
  coreValue: string;        // e.g. "재정 건전성 및 즉각적 비용 효율성"
  frictionFactor: string;   // e.g. "과도한 국가 부채 증가 및 조세 저항"
  avatarIcon?: string;
  biasTendency: string;     // 수사적 편향 특성
}

// ==========================================
// 2. Dilemma Case & Curriculum Units
// ==========================================
export interface DilemmaCase {
  title: string;
  scenario: string;
  coreConflict: string;
  stakeholders: string[];
  perelmanDilemmaType: 'value_hierarchy' | 'dissociation' | 'pragmatic_argument';
}

export interface DiscourseMarkers {
  claim: string[];
  data: string[];
  warrant: string[];
  backing: string[];
  qualifier: string[];
  rebuttal: string[];
}

export interface TrackBCurriculumUnit {
  id: string;
  step: number;        // 1 ~ 4
  unitNumber: number;  // 1 ~ 16
  stepTitle: string;   // e.g. "1단계: 개념 분리와 청중 설정"
  title: string;       // e.g. "정년 연장 vs 청년 고용: 가치 위계의 충돌"
  toulminFocus: ToulminElement[];
  targetAudiencePool: AudiencePersona[];
  dilemmaCase: DilemmaCase;
  discourseMarkers: DiscourseMarkers;
  recommendedMinutes: number; // Standard: 80
}

// ==========================================
// 3. Toulmin Analysis & Telemetry
// ==========================================
export interface ToulminSentence {
  text: string;
  element: ToulminElement;
  rationale: string;
  startIndex?: number;
  endIndex?: number;
  sfl_modality?: SflModality;
  sfl_engagement?: SflEngagement;
}

export interface ToulminScores {
  claim: number;      // 0~100
  data: number;       // 0~100
  warrant: number;    // 0~100
  backing: number;    // 0~100
  qualifier: number;  // 0~100
  rebuttal: number;   // 0~100
}

export interface ToulminAnalysisResult {
  sentences: ToulminSentence[];
  scores: ToulminScores;
  missing_elements: string[];
  audience_fit_feedback: string;
}

export interface DevilsAdvocateResult {
  rebuttalText: string;          // 200자 내외 날카로운 비판 반론
  criticalQuestion: string;      // 청중 입장의 집요한 공박 질문
  rhetoricalConflict: string;    // 페렐만식 가치 충돌/실현 비용 지점
  suggestedCounterAngles: string[]; // 재반박 제안 전략 2~3가지
}

// Telemetry & Keystroke Logging
export interface TrackBKeystrokeEvent {
  timestamp: number;
  keyType: 'char' | 'backspace' | 'paste' | 'delete';
  charDelta: number;
  textLength: number;
}

export interface TrackBKeystrokeLog {
  totalKeyStrokes: number;
  backspaceCount: number;
  pasteCount: number;
  pastedChars: number;
  activeDurationMs: number;
  cpm: number;
  events: TrackBKeystrokeEvent[];
  isSuspectedExternalAi?: boolean;
}

// ==========================================
// 4. Submissions & 1:1 Coaching
// ==========================================
export interface TrackBSubmission {
  id: string;
  userId: string;
  unitId: string;
  step: number;
  unitNumber: number;
  selectedAudience: AudiencePersona;
  draftText: string;
  toulminAnalysis?: ToulminAnalysisResult;
  keystrokeLog?: TrackBKeystrokeLog;
  revisionCount: number;
  finalText?: string;
  counterRebuttalText?: string; // 4단계 악마의 대변인에 맞선 재반박문
  createdAt: string;
  updatedAt: string;
}

export interface RhetoricalComment {
  id: string;
  sentenceIdx: number;
  sentenceText: string;
  element: ToulminElement;
  comment: string;
  createdAt: string;
}

export interface TrackBCoaching {
  id: string;
  submissionId: string;
  tutorId: string;
  rhetoricalComments: RhetoricalComment[];
  voiceMemoUrl?: string;
  status: 'pending' | 'reviewed';
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. Onboarding Track B Survey
// ==========================================
export interface TrackBOnboardingSurvey {
  trackChoice: 'track_a' | 'track_b';
  toulminFamiliarity: {
    claim: number;     // 1~5 Likert
    data: number;
    warrant: number;
    backing: number;
    qualifier: number;
    rebuttal: number;
  };
  audienceAwarenessLevel: number; // 1~5 Likert (청중에 따른 수사 전략 조절 능력)
  irbConsent: boolean;            // 학술 실증 연구 데이터 수집 및 분석 동의
  academicGoals: string[];
}

// ==========================================
// 6. User Surveys & Trial Logging
// ==========================================
export interface UserSurveyEntry {
  id?: string;
  userId?: string | null;
  sessionId: string;
  surveyType: 'pre_onboarding' | 'post_experience';
  selectedTrack?: 'track_a' | 'track_b' | 'general';
  l1Language: string;
  l1CustomText?: string;
  targetTopikLevel?: string;
  writingBottlenecks: string[];
  writingBottlenecksCustom?: string;
  irbConsent: boolean;
  feedbackScore?: number;
  neededSupports?: string[];
  neededSupportsCustom?: string;
  contactInfo?: string;
  createdAt?: string;
}

// ==========================================
// 7. Genre Bridge & Academic Discourse Modes
// ==========================================
export type GenreBridgeMode = 'essay' | 'thesis_intro' | 'critical_review';

export interface GenreMappingItem {
  element: ToulminElement;
  genreLabel: string;
  genreDescription: string;
  guidingQuestion: string;
  discourseStarters: string[];
}

export interface GenreDefinition {
  mode: GenreBridgeMode;
  nameKo: string;
  badgeKo: string;
  descriptionKo: string;
  targetAudienceType: string;
  mappings: Record<ToulminElement, GenreMappingItem>;
}

// SFL (Systemic Functional Linguistics) Metadatas
export type SflModality = 'HIGH' | 'MEDIAN' | 'LOW';
export type SflEngagement = 'MONOGLOSS' | 'EXPAND' | 'CONTRACT';

export interface SflSentenceAnnotation {
  text: string;
  toulmin_tag: ToulminElement;
  sfl_modality: SflModality;
  sfl_engagement: SflEngagement;
  feedback?: string;
  rationale?: string;
}

export interface AiAuditResult {
  sentences: SflSentenceAnnotation[];
  radar_scores: ToulminScores;
  devils_advocate: {
    counter_argument: string;
    target_element: string;
    suggested_dissociation: string;
  };
}

export interface AiInteractionLog {
  id?: string;
  revisionId?: string;
  userId?: string;
  aiCounterArgument: string;
  suggestedTarget: string;
  userAction: 'ACCEPTED' | 'REJECTED' | 'IGNORED';
  userRevisionNote: string;
  timeSpentSeconds: number;
  createdAt?: string;
}

export interface UserWritingRevision {
  id?: string;
  userId?: string;
  sessionId: number; // 1 to 16
  trackType: 'CORE' | 'ADVANCED';
  draftNumber: 1 | 2;
  content: string;
  wordCount: number;
  toulminScores?: ToulminScores;
  sflMetadata?: {
    modalityDistribution: Record<SflModality, number>;
    engagementDistribution: Record<SflEngagement, number>;
  };
  createdAt?: string;
}



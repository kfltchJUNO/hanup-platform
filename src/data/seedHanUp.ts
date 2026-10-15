// src/data/seedHanUp.ts
// HanUp (한업 | 韩升) Master Seed Data — Unit 01 (환경과 경제) & Special Unit (쓰기 53번 만능 공식)

export interface Organization {
  orgId: string;
  orgName: string;
  orgType: 'direct_b2c' | 'academy' | 'solo_tutor';
  planTier: 'free_trial' | 'tutor_pro' | 'academy_biz' | 'enterprise';
  maxStudentSeats: number;
  customBranding?: { logoUrl: string; primaryColor: string };
  licensedSeriesIds: string[];
}

export interface ClassGroup {
  classId: string;
  orgId: string;
  instructorId: string;
  className: string;
  inviteCode: string;
  assignedSeriesIds: string[];
  studentUids: string[];
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'super_admin' | 'org_admin' | 'instructor' | 'student';
  orgId: string;
  classIds: string[];
  nativeLanguage: 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'other';
  currentTopikLevel: number;
  targetTopikLevel: number;
  learningPurpose: 'grad_school' | 'undergrad' | 'employment' | 'hobby';
  subscriptionTier: 'free' | 'clinic_pack' | 'hanup_pro_pass' | 'vip_coaching';
  researchConsent: boolean;
  skillRadar: {
    vocabHanja: number;
    grammarConnective: number;
    listeningInference: number;
    readingSkimming: number;
    writing53Data: number;
    writing54Logic: number;
  };
  scoreHistory: Array<{ weekLabel: string; totalScore: number; date: string }>;
}

export interface AuthoringBlock {
  blockId: string;
  seriesId: string;
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
    commonChineseErrorNote?: string;
  }>;
  audioConfig?: {
    voiceId: string;
    mp3Url: string;
    dictationBlanks: string[];
  };
  writingRubric?: {
    targetChars: [number, number];
    requiredKeywords: string[];
    rhetoricStructureGuide: string;
    modelAnswer: string;
    beforeBadExample?: string;
  };
  qrBridgeUrl: string;
  osmuExport?: {
    xiaohongshuTitle: string;
    xiaohongshuSlides: string[];
    shortFormScript40s: string;
  };
}

export interface ItemBankQuestion {
  itemId: string;
  targetSkill: keyof UserProfile['skillRadar'];
  difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6;
  accessTier: 'free_daily_3' | 'paid_clinic_120';
  questionStem: string;
  passageOrAudioText?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanationKo: string;
  explanationZh: string;
  liveAnalytics: {
    totalAttempts: number;
    correctRate: number;
    optionSelectionCounts: [number, number, number, number];
  };
}

export interface WritingSubmission {
  submissionId: string;
  uid: string;
  orgId: string;
  classId?: string;
  blockId: string;
  initialDraft: string;
  aiFeedback: {
    estimatedScore: number;
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
  revisedDraft?: string;
  submittedAt: string;
}

// ============================================================================
// 1. ORGANIZATIONS (직영 본사 + 외부 어학원 B2B 샘플)
// ============================================================================
export const SEED_ORGANIZATIONS: Organization[] = [
  {
    orgId: 'org_hanup_hq',
    orgName: '한업(HanUp | 韩升) 직영 온라인 스쿨',
    orgType: 'direct_b2c',
    planTier: 'enterprise',
    maxStudentSeats: 10000,
    customBranding: {
      logoUrl: '/logos/hanup-master.svg',
      primaryColor: '#4F46E5',
    },
    licensedSeriesIds: ['hanup_topik_2', 'hanup_topik_writing53', 'hanup_talk_basic'],
  },
  {
    orgId: 'org_beijing_sejong',
    orgName: '북경 한림 한국어 유학원 (北京翰林韩语)',
    orgType: 'academy',
    planTier: 'academy_biz',
    maxStudentSeats: 150,
    customBranding: {
      logoUrl: '/logos/beijing-academy.svg',
      primaryColor: '#0D9488',
    },
    licensedSeriesIds: ['hanup_topik_2', 'hanup_topik_writing53'],
  },
];

// ============================================================================
// 2. CLASS GROUPS (반별 관리 및 6자리 초대 코드 샘플)
// ============================================================================
export const SEED_CLASSES: ClassGroup[] = [
  {
    classId: 'class_topik2_oct',
    orgId: 'org_hanup_hq',
    instructorId: 'usr_admin_owner',
    className: 'TOPIK II 5·6급 돌파 쓰기·독해 직영반 (1기)',
    inviteCode: 'UP5482',
    assignedSeriesIds: ['hanup_topik_2', 'hanup_topik_writing53'],
    studentUids: ['usr_stu_wang', 'usr_stu_li'],
  },
  {
    classId: 'class_beijing_ weekend',
    orgId: 'org_beijing_sejong',
    instructorId: 'usr_tutor_kim',
    className: '북경 한림 주말 TOPIK 쓰기 집중반',
    inviteCode: 'BJ3099',
    assignedSeriesIds: ['hanup_topik_writing53'],
    studentUids: ['usr_stu_zhang'],
  },
];

// ============================================================================
// 3. USER PROFILES (Lv.4 오너, Lv.2 강사, Lv.1 중국인 학습자 페르소나)
// ============================================================================
export const SEED_USERS: UserProfile[] = [
  {
    uid: 'usr_admin_owner',
    name: '오준호 (한업 총괄 연구자 & 대표 저자)',
    email: 'admin@hanup.app',
    role: 'super_admin',
    orgId: 'org_hanup_hq',
    classIds: ['class_topik2_oct'],
    nativeLanguage: 'other',
    currentTopikLevel: 6,
    targetTopikLevel: 6,
    learningPurpose: 'grad_school',
    subscriptionTier: 'vip_coaching',
    researchConsent: true,
    skillRadar: {
      vocabHanja: 100,
      grammarConnective: 100,
      listeningInference: 100,
      readingSkimming: 100,
      writing53Data: 100,
      writing54Logic: 100,
    },
    scoreHistory: [],
  },
  {
    uid: 'usr_tutor_kim',
    name: '김서연 강사 (파트너 교사)',
    email: 'tutor.kim@hanup.app',
    role: 'instructor',
    orgId: 'org_beijing_sejong',
    classIds: ['class_beijing_weekend'],
    nativeLanguage: 'other',
    currentTopikLevel: 6,
    targetTopikLevel: 6,
    learningPurpose: 'employment',
    subscriptionTier: 'hanup_pro_pass',
    researchConsent: true,
    skillRadar: {
      vocabHanja: 100,
      grammarConnective: 100,
      listeningInference: 100,
      readingSkimming: 100,
      writing53Data: 100,
      writing54Logic: 100,
    },
    scoreHistory: [],
  },
  {
    uid: 'usr_stu_wang',
    name: '왕링링 (王玲玲)',
    email: 'lingling.wang@qq.com',
    role: 'student',
    orgId: 'org_hanup_hq',
    classIds: ['class_topik2_oct'],
    nativeLanguage: 'zh-CN',
    currentTopikLevel: 3,
    targetTopikLevel: 5,
    learningPurpose: 'grad_school',
    subscriptionTier: 'free',
    researchConsent: true,
    skillRadar: {
      vocabHanja: 62,
      grammarConnective: 48, // 연결어미 약점 (-기 때문에 vs -기 위해서)
      listeningInference: 70,
      readingSkimming: 66,
      writing53Data: 58,     // 조사 로/으로 약점
      writing54Logic: 45,    // 54번 논술 구조 및 문어체 약점
    },
    scoreHistory: [
      { weekLabel: '1주차 (진단)', totalScore: 132, date: '2026-09-15' },
      { weekLabel: '2주차', totalScore: 145, date: '2026-09-22' },
      { weekLabel: '3주차', totalScore: 161, date: '2026-09-29' },
      { weekLabel: '4주차 (현재)', totalScore: 178, date: '2026-10-06' },
    ],
  },
  {
    uid: 'usr_stu_li',
    name: '리하오 (李浩)',
    email: 'lihao99@163.com',
    role: 'student',
    orgId: 'org_hanup_hq',
    classIds: ['class_topik2_oct'],
    nativeLanguage: 'zh-CN',
    currentTopikLevel: 4,
    targetTopikLevel: 6,
    learningPurpose: 'employment',
    subscriptionTier: 'hanup_pro_pass',
    researchConsent: true,
    skillRadar: {
      vocabHanja: 78,
      grammarConnective: 72,
      listeningInference: 64,
      readingSkimming: 80,
      writing53Data: 85,
      writing54Logic: 68,
    },
    scoreHistory: [
      { weekLabel: '1주차 (진단)', totalScore: 168, date: '2026-09-15' },
      { weekLabel: '2주차', totalScore: 182, date: '2026-09-22' },
      { weekLabel: '3주차', totalScore: 195, date: '2026-09-29' },
      { weekLabel: '4주차 (현재)', totalScore: 212, date: '2026-10-06' },
    ],
  },
];

// ============================================================================
// 4. AUTHORING BLOCKS (Unit 01 환경과 경제 + Special Unit 53번 도표 만능 공식)
// ============================================================================
export const SEED_AUTHORING_BLOCKS: AuthoringBlock[] = [
  // --------------------------------------------------------------------------
  // [Unit 01. 환경 보호와 경제 발전] — Block A ~ D
  // --------------------------------------------------------------------------
  {
    blockId: 'blk_u01_concept_vocab',
    seriesId: 'hanup_topik_2',
    chapterId: 'unit_01_env_econ',
    orderIndex: 1,
    blockType: 'concept_note',
    title: '[Unit 01 - Block A] 중국인 99% 함정 한자어 & 문어체 핵심 문법',
    koContent: `### 1. 중국어 모어 화자가 직역하기 쉬운 핵심 한자어 5선
1. **양립하다 (5급):** 환경 보호와 경제 발전이 양립하다 / 조화를 이루다.
2. **초래하다 (5급):** 심각한 환경 오염을 초래하다 / 야기하다. (반드시 부정적 결과와 결합)
3. **뒷받침되다 (5급):** 정부의 제도적 장치가 뒷받침되어야 한다.
4. **유보하다 (6급):** 경제 성장을 전면 유보할 수는 없다.
5. **대안을 모색하다 (5급):** 현실적인 대안을 마련하다 / 모색하다.

### 2. 5·6급 필수 문어체 문법 공식
- **-기 마련이다:** 산업화가 급격히 진행되면 자연환경은 훼손되기 마련이다.
- **-(으)ㄹ 뿐만 아니라:** 친환경 기술 개발은 오염을 줄일 뿐만 아니라 새로운 경제적 부가가치를 창출한다.
- **-기 위해서는 -(으)ㄹ 필요가 있다:** 지속 가능한 발전을 이루기 위해서는 장기적인 관점을 가질 필요가 있다.`,
    zhExplanation: `중국어 모어 화자가 가장 자주 범하는 '직역투(中式韩语)' 오류를 교정하는 파트입니다. 특히 '초래하다(招致)'는 긍정적인 결과에 쓰면 감점되며, 목적을 나타낼 때 원인 어미 '-기 때문에' 대신 반드시 '-기 위해서'를 사용해야 합니다.`,
    vocabAnnotations: [
      {
        word: '양립하다',
        zhMeaning: '并存 / 兼顾',
        enMeaning: 'to coexist / be compatible',
        topikLevel: 5,
        commonChineseErrorNote: '중국어 직역으로 "같이 세우다(❌)"라고 쓰지 않도록 주의!',
      },
      {
        word: '초래하다',
        zhMeaning: '招致 / 导致(消极结果)',
        enMeaning: 'to bring about / cause (negative)',
        topikLevel: 5,
        commonChineseErrorNote: '"좋은 결과를 초래했다(❌)" 불가. 오직 부정적 결과에만 결합함.',
      },
      {
        word: '뒷받침되다',
        zhMeaning: '得到支撑 / 配套支持',
        enMeaning: 'to be backed up / supported by',
        topikLevel: 5,
        commonChineseErrorNote: '단순히 "지지되다(△)"보다 학술·논술문에서 훨씬 높은 점수를 받는 6급 연어.',
      },
      {
        word: '유보하다',
        zhMeaning: '搁置 / 暂缓',
        enMeaning: 'to defer / postpone / reserve',
        topikLevel: 6,
        commonChineseErrorNote: '"포기하다" 대신 사용하면 문장의 격식이 급상승함.',
      },
      {
        word: '모색하다',
        zhMeaning: '摸索 / 寻求(对策)',
        enMeaning: 'to seek / grope for (a solution)',
        topikLevel: 5,
        commonChineseErrorNote: '"방법을 찾다" 대신 "대안을 모색하다/강구하다"로 짝지어 암기할 것.',
      },
    ],
    qrBridgeUrl: 'https://hanup.app/study/hanup_topik_2/unit_01_env_econ?tab=concept',
    osmuExport: {
      xiaohongshuTitle: '😭 TOPIK 写作万年3级？这5个高级汉字词替换掉你的“中式韩语”！🔥',
      xiaohongshuSlides: [
        '[표지] TOPIK II 54번 만점 어휘 노트 #01 | 환경과 경제 편 (告别中式韩语)',
        '[슬라이드 2] ❌ 문제를 만들다 (3급 직역) 👉 ⭕ 문제를 초래하다 / 야기하다 (6급 연어)',
        '[슬라이드 3] ❌ 환경과 경제를 같이 세우다 👉 ⭕ 환경 보호와 경제 발전이 양립하다',
        '[슬라이드 4] ❌ 정부의 노력이 지지되다 👉 ⭕ 제도적 장치가 뒷받침되어야 한다',
        '[슬라이드 5] 댓글에 "54"를 남기시면 《한업 토픽 Unit 01 풀버전 PDF + 무료 AI 첨삭권》을 드립니다!',
      ],
      shortFormScript40s:
        '아직도 TOPIK 54번 쓰기에서 "나쁜 문제를 만듭니다"라고 쓰시나요? 중국어의 制造问题를 그대로 직역하면 3급에서 절대 벗어날 수 없습니다. 오늘부터는 "심각한 문제를 초래한다" 또는 "야기한다"로 바꿔보세요!',
    },
  },
  {
    blockId: 'blk_u01_reading_skimming',
    seriesId: 'hanup_topik_2',
    chapterId: 'unit_01_env_econ',
    orderIndex: 2,
    blockType: 'reading_passage',
    title: '[Unit 01 - Block B] 3초 형광펜 스키밍(Skimming) 읽기 지문',
    koContent: `[화제 제시] 과거에는 국가의 경제 성장을 최우선 과제로 삼아 환경 오염 문제를 부차적인 것으로 여기는 경향이 강했다. 공장을 짓고 자원을 개발하는 과정에서 발생하는 자연 훼손을 성장을 위한 불가피한 대가로 인식한 것이다. [역접 전환] 그러나 최근 기후 변화로 인한 자연재해가 빈번해지고 환경 복구 비용이 기하급수적으로 증가하면서 이러한 인식에 근본적인 변화가 일고 있다. 환경을 희생시켜 얻은 단기적인 경제적 이익보다, 사후에 치러야 할 사회적 비용이 훨씬 크다는 사실이 증명되었기 때문이다. [주제문] 따라서 현대 사회에서 환경 보호는 경제 발전을 저해하는 걸림돌이 아니라, ( ㉠ ) 필수적인 조건으로 다루어져야 한다.`,
    zhExplanation: `💡 [한업 3초 스키밍 공식]: 지문을 처음부터 다 해석하지 마세요! ① 첫 문장(과거에는~)으로 화제를 잡고 → ② 역접 접속사(그러나)에 별표 → ③ 결론 접속사(따라서) 뒤의 빈칸 문장만 집중해서 읽으면 30초 만에 정답(지속 가능한 경제 성장을 담보하는)이 보입니다.`,
    vocabAnnotations: [
      {
        word: '부차적인',
        zhMeaning: '次要的 / 附带的',
        enMeaning: 'secondary / subsidiary',
        topikLevel: 5,
      },
      {
        word: '기하급수적으로',
        zhMeaning: '呈几何级数地 / 暴增地',
        enMeaning: 'exponentially',
        topikLevel: 6,
      },
      {
        word: '걸림돌',
        zhMeaning: '绊脚石 / 障碍',
        enMeaning: 'stumbling block / obstacle',
        topikLevel: 4,
      },
      {
        word: '담보하다',
        zhMeaning: '担保 / 保障',
        enMeaning: 'to guarantee / ensure',
        topikLevel: 6,
      },
    ],
    qrBridgeUrl: 'https://hanup.app/study/hanup_topik_2/unit_01_env_econ?tab=reading',
    osmuExport: {
      xiaohongshuTitle: '⏱️ TOPIK 阅读总是做不完？学会韩国老师的“3秒荧光笔跳读法”！',
      xiaohongshuSlides: [
        '[표지] TOPIK 읽기 시간 부족 해결! 3초 형광펜 스키밍 공식',
        '[슬라이드 2] Step 1: 첫 문장 "과거에는~"을 보고 글의 화제(경제 vs 환경)만 파악!',
        '[슬라이드 3] Step 2: 역접 접속사 "그러나" 앞은 과감히 버리고 뒤쪽 원인에 집중!',
        '[슬라이드 4] Step 3: 결론 접속사 "따라서" 뒤 문장 구조(걸림돌이 아니라 ㉠이다)로 정답 1초 컷!',
      ],
      shortFormScript40s:
        'TOPIK 읽기 시험 시간, 항상 마지막 10문제 못 풀고 찍으시죠? 지문을 처음부터 끝까지 다 번역하니까 시간이 부족한 겁니다. 첫 문장, 그러나, 따라서! 이 세 단어에만 형광펜을 칠해보세요.',
    },
  },
  {
    blockId: 'blk_u01_listening_dictation',
    seriesId: 'hanup_topik_2',
    chapterId: 'unit_01_env_econ',
    orderIndex: 3,
    blockType: 'listening_script',
    title: '[Unit 01 - Block C] AI 배속 듣기 & 빈칸 딕테이션 훈련',
    koContent: `여자(사회자): 최근 정부가 일회용품 사용 규제를 대폭 강화하면서 소상공인들의 불만이 커지고 있습니다. 경기가 침체된 상황에서 환경 규제가 경제 활동을 [위축시킨다]는 지적에 대해 어떻게 생각하십니까?
남자(전문가): 당장은 친환경 포장재로 교체하는 비용이 부담스러울 수 있습니다. 하지만 장기적인 관점에서 보면 이야기가 다릅니다. 최근 소비자들은 기업의 친환경 실천 여부를 구매의 중요한 기준으로 삼고 있거든요. 또한 국제 무역에서도 탄소 배출량이 많은 제품에 관세를 부과하는 등 환경 기준이 갈수록 [까다로워지고] 있습니다. 지금 당장 불편하다고 해서 규제를 늦춘다면, 결국 글로벌 시장에서 [경쟁력을 잃게] 될 것입니다. 정부는 규제를 유지하되, 영세 상인들이 초기 전환 비용을 감당할 수 있도록 [보조금을 지원하는] 방향으로 보완책을 찾아야 합니다.`,
    zhExplanation: `듣기 29~32번 대담 유형입니다. 남자의 마지막 문장에 쓰인 '-하되(유지하되 지원책을 찾다)' 문법이 중심 생각을 찾는 결정적 단서입니다.`,
    vocabAnnotations: [
      {
        word: '위축시키다',
        zhMeaning: '使萎缩 / 抑制',
        enMeaning: 'to shrink / dampen / discourage',
        topikLevel: 5,
      },
      {
        word: '까다로워지다',
        zhMeaning: '变得苛刻 / 变得严格',
        enMeaning: 'to become strict / complicated',
        topikLevel: 4,
      },
      {
        word: '보조금',
        zhMeaning: '补贴 / 补助金',
        enMeaning: 'subsidy / grant',
        topikLevel: 5,
      },
    ],
    audioConfig: {
      voiceId: 'eleven_kr_anchor_dialogue_01',
      mp3Url: '/audio/topik2/unit01_dialogue.mp3',
      dictationBlanks: ['위축시킨다', '까다로워지고', '경쟁력을 잃게', '보조금을 지원하는'],
    },
    qrBridgeUrl: 'https://hanup.app/study/hanup_topik_2/unit_01_env_econ?tab=listening',
  },
  {
    blockId: 'blk_u01_writing54_prompt',
    seriesId: 'hanup_topik_2',
    chapterId: 'unit_01_env_econ',
    orderIndex: 4,
    blockType: 'writing_prompt',
    title: '[Unit 01 - Block D] 쓰기 54번 논술 마스터: 환경과 경제의 바람직한 관계',
    koContent: `[문제] 현대 사회에서 경제 발전과 환경 보호는 모두 중요한 가치입니다. 그러나 경제 발전을 우선시하면 환경이 파괴되고, 환경 보호를 우선시하면 경제 성장이 둔화되는 갈등이 발생하기도 합니다. 아래의 내용을 중심으로 '경제 발전과 환경 보호의 바람직한 관계'에 대한 자신의 생각을 600~700자로 쓰십시오.
1. 경제 발전과 환경 보호가 대립하는 원인은 무엇인가?
2. 환경을 무시한 경제 발전이 초래하는 문제점은 무엇인가?
3. 두 가치가 조화를 이루기 위해 정부와 기업은 어떤 노력을 해야 하는가?`,
    zhExplanation: `[수사학적 3단 설계도]
- 서론(120자): 경제 발전의 중요성 인정 + 그러나 무분별한 개발로 환경 파괴 갈등 심화 (문제 제기)
- 본론 1(250자): 대립 원인(단기적 이익 치중) + 환경 경시의 부작용(기후 위기 및 막대한 복구 비용 초래)
- 본론 2(230자): 정부(법적 규제 + 세제 혜택·보조금 뒷받침)와 기업(친환경 R&D를 미래 경쟁력 투자로 인식)의 역할 분리 서술
- 결론(80자): 환경과 경제의 상생 패러다임 전환 제언`,
    vocabAnnotations: [
      {
        word: '훼손되다',
        zhMeaning: '遭到毁损 / 被破坏',
        enMeaning: 'to be damaged / harmed',
        topikLevel: 5,
      },
      {
        word: '가시적인',
        zhMeaning: '可视的 / 眼前的',
        enMeaning: 'visible / tangible',
        topikLevel: 6,
      },
    ],
    writingRubric: {
      targetChars: [600, 700],
      requiredKeywords: ['양립하다', '초래하다', '뒷받침되다', '훼손되다', '지속 가능한'],
      rhetoricStructureGuide:
        '1) 서론 통념 반박 구조, 2) 본론 원인 및 부작용 인과 논증, 3) 정부와 기업 주체별 해결책 이원화, 4) 평서형 해라체(-ㄴ다/는다/다) 어미 통일',
      beforeBadExample: `우리 사회에서 경제 발전과 환경 보호는 아주 중요합니다. 경제 발전과 환경 보호가 싸우는 원인은 사람들이 돈을 많이 벌고 싶기 때문입니다. 만약 환경을 보호하지 않고 경제만 발전하면 많은 나쁜 문제를 만듭니다. 공기가 나빠지고 사람들도 병에 걸려서 병원에 가야 합니다. 그래서 정부와 기업이 같이 노력합시다. 정부는 법을 만들어서 나쁜 공장을 벌주고, 기업은 환경을 보호하기 때문에 좋은 기술을 개발해야 합니다.`,
      modelAnswer: `현대 사회에서 경제 발전은 삶의 질을 높이는 핵심 동력이지만, 그 과정에서 자연환경이 훼손되기 마련이다. 이처럼 경제 성장과 환경 보존이 끊임없이 대립하는 근본적인 원인은 장기적인 지속 가능성보다 당장의 가시적인 경제적 이익을 우선시하는 단기적 관점에 있다.
그러나 환경을 희생시킨 경제 성장은 결국 더 큰 사회적 손실을 초래한다. 무분별한 개발로 인한 기후 변화와 환경 오염은 국민의 건강과 생존을 위협할 뿐만 아니라, 파괴된 생태계를 복원하는 데 천문학적인 비용을 지출하게 만든다. 즉, 환경을 외면한 성장은 장기적으로 국가 경제의 성장 동력마저 약화시키는 결과를 낳는다.
따라서 경제 발전과 환경 보호가 양립하기 위해서는 정부와 기업의 유기적인 노력이 뒷받침되어야 한다. 우선 정부는 탄소 배출 규제와 같은 법적 기준을 강화하는 한편, 친환경 전환을 시도하는 기업에 보조금과 세제 혜택을 제공하는 제도적 기반을 마련해야 한다. 아울러 기업 역시 환경 보호를 단순한 규제나 비용으로 여기는 태도에서 벗어나, 친환경 기술 개발을 통해 새로운 시장을 개척하는 미래 전략으로 삼을 필요가 있다.
결론적으로 환경과 경제는 어느 하나를 위해 다른 하나를 포기해야 하는 관계가 아니다. 지속 가능한 미래를 위해 두 가치가 조화롭게 상생할 수 있는 사회적 합의를 이어 나가야 할 것이다.`,
    },
    qrBridgeUrl: 'https://hanup.app/study/hanup_topik_2/unit_01_env_econ?tab=writing',
    osmuExport: {
      xiaohongshuTitle: '🔥 TOPIK 54号大作文：3级24分 vs 6级48分批改对比（环保与经济篇）',
      xiaohongshuSlides: [
        '[표지] TOPIK 54번 첨삭 노트 | 왜 내 글은 만년 3급일까? 3급 vs 6급 한눈에 비교!',
        '[슬라이드 2] 감점 1순위: 논설문에서 "-ㅂ니다 / -합시다" 사용 금지! 무조건 "-ㄴ다/는다/다" 평서형으로 통일!',
        '[슬라이드 3] 감점 2순위: 목적(为了)을 쓸 때 "보호하기 때문에(❌)" → "보호하기 위해서(⭕)"',
        '[슬라이드 4] 한업 6급 만점 모범답안 4단 구조 (서론-본론1-본론2-결론) 전문 공개',
        '[슬라이드 5] 내 54번 작문, 몇 점인지 궁금하다면? 한업(HanUp) 웹앱에서 3초 만에 AI 첨삭 받아보세요!',
      ],
      shortFormScript40s:
        'TOPIK 54번 마지막 문장에 "우리 모두 환경을 보호합시다!"라고 쓰셨나요? 안타깝지만 채점관이 가장 먼저 감점하는 구어체 청유형입니다. 논설문에서는 반드시 "대안을 모색해야 한다"처럼 평서형 어미로 끝맺어야 합니다.',
    },
  },

  // --------------------------------------------------------------------------
  // [Special Unit. 쓰기 53번 도표·그래프 4대 만능 공식] — Block 1 ~ 2
  // --------------------------------------------------------------------------
  {
    blockId: 'blk_w53_formulas_concept',
    seriesId: 'hanup_topik_writing53',
    chapterId: 'special_unit_w53_master',
    orderIndex: 1,
    blockType: 'concept_note',
    title: '[Special Unit - Part 1&2] 쓰기 53번 감점 방지 규칙 & 4대 유형 만능 공식',
    koContent: `### 1. 중국인 수험생 53번 최다 감점 포인트 (로 vs 으로)
- **받침 없는 단위 뒤에는 '로':** 20%에서 **30%로** (퍼센'트' 받침 없음), **1위로**, **5개로**
- **받침 있는 단위 뒤에는 '으로':** 10만 명에서 **15만 명으로**, **6조 원으로**, **300건으로**
- **원고지 띄어쓰기:** '2026년', '35%'는 붙여 쓰되, 한글 수사 '만, 억, 조' 뒤의 단위 명사는 반드시 띄어 씀 (예: **100만 명**, **6조 원**).

### 2. 숫자만 갈아 끼우는 4대 유형 만능 템플릿
1. **[유형 1: 도입부 공식]**
   - [조사 기관]에서 [조사 대상]을 대상으로 '[그래프 제목]'에 대해 조사한 결과에 따르면,
2. **[유형 2: 증감 추이 공식 (꺾은선/막대)]**
   - [항목]은 [연도1] [수치1]에서 [연도2] [수치2](으)로 꾸준히 증가하였다(감소하였다).
   - 특히 [연도]에는 [수치]에 달하며 약 [N]배 가까이 급증한 것으로 나타났다.
3. **[유형 3: 비율·순위 비교 공식 (원그래프)]**
   - [조사 주제]를 살펴보면, '[1위 항목]'이 [수치1]%로 가장 높은 비중을 차지하였다.
   - 그 다음으로 '[2위 항목]'이 [수치2]%, '[3위 항목]'이 [수치3]%로 뒤를 이었으며, '[최하위 항목]'은 [수치4]%에 그쳤다.
4. **[유형 4: 원인 분석 & 향후 전망 공식]**
   - 이처럼 [현상]이 증가한 것은 [원인1]에 따라 [원인2]기 때문인 것으로 분석된다.
   - 이러한 추세가 지속된다면 [연도]에는 [전망 내용]이 [수치]에 이를 것으로(돌파할 것으로) 전망된다.`,
    zhExplanation: `53번(200~300자)은 창의적인 글쓰기가 아니라 도표의 데이터를 4개의 공식 블록에 정확히 대입하는 '빈칸 채우기' 게임입니다. 특히 '%'는 한국어로 '퍼센트(트: 무받침)'라고 읽으므로 뒤에 반드시 '로(%로)'가 와야 한다는 점을 절대 잊지 마세요!`,
    vocabAnnotations: [
      {
        word: '비중을 차지하다',
        zhMeaning: '占据比重',
        enMeaning: 'to account for a share/proportion',
        topikLevel: 4,
        commonChineseErrorNote: '"1위는 ~이다" 대신 사용하면 원그래프 묘사 점수가 만점으로 직행함.',
      },
      {
        word: '뒤를 잇다',
        zhMeaning: '紧随其后 (排名第2、3位)',
        enMeaning: 'to follow right behind',
        topikLevel: 5,
      },
      {
        word: '그치다',
        zhMeaning: '止步于 / 仅为 (用于最低占比)',
        enMeaning: 'to stop at / be no more than',
        topikLevel: 4,
        commonChineseErrorNote: '최하위 항목 수치 뒤에는 반드시 "-에 그쳤다" 또는 "-에 불과했다"를 씀.',
      },
      {
        word: '전망되다',
        zhMeaning: '预计 / 展望',
        enMeaning: 'to be projected / forecasted',
        topikLevel: 5,
      },
    ],
    qrBridgeUrl: 'https://hanup.app/study/hanup_topik_writing53/special_unit_w53_master?tab=concept',
    osmuExport: {
      xiaohongshuTitle: '🚨 TOPIK 53号小作文别再死背了！4个万能公式直接套，10分钟拿满30分！💯',
      xiaohongshuSlides: [
        '[표지] TOPIK 쓰기 53번 4대 유형 만능 공식 카드 (10분 30점 만점 치트키)',
        '[슬라이드 2] 중국인 수험생 90%가 깎이는 조사 함정: 30%로(⭕) vs 30%으로(❌) / 100만 명으로(⭕)',
        '[슬라이드 3] 증감 추이 & 원그래프 비율 순위 비교 만능 문장 템플릿',
        '[슬라이드 4] 화살표 명사 키워드를 만점 문장으로 바꾸는 원인·전망 공식',
        '[슬라이드 5] 댓글에 "53"을 남기시면 고화질 인쇄용 《53번 만능 공식 PDF》와 AI 첨삭 링크를 보내드립니다!',
      ],
      shortFormScript40s:
        'TOPIK 53번에서 "30%으로 증가했다"라고 쓰면 왜 감점될까요? 퍼센트의 마지막 글자 트에 받침이 없기 때문에 무조건 "30%로"라고 써야 합니다! 10분 만에 30점 만점 받는 4가지 공식, 지금 저장해 두세요!',
    },
  },
  {
    blockId: 'blk_w53_simulation_prompt',
    seriesId: 'hanup_topik_writing53',
    chapterId: 'special_unit_w53_master',
    orderIndex: 2,
    blockType: 'writing_prompt',
    title: '[Special Unit - Part 3] 쓰기 53번 실전 연습: 반려동물 산업 규모 및 양육 이유',
    koContent: `[문제] 다음을 참고하여 '반려동물 관련 산업 규모 및 양육 이유'에 대한 글을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.
- [조사 기관 및 대상]: 한국소비자원 (성인 남녀 1,000명 대상)
- [그래프 1: 반려동물 관련 시장 규모]: 2020년 3조 원 → 2023년 4조 5천억 원 → 2026년 6조 원 (지속 증가)
- [그래프 2: 반려동물을 기르는 이유(%)]: 정서적 안정감(45.2%) > 가족 구성원 감소로 인한 외로움 해소(30.5%) > 자녀 교육에 긍정적 영향(15.0%) > 기타(9.3%)
- [증가 원인]: 1인 가구 급증, 고령화 심화 → 반려동물을 가족처럼 여기는 인식 확산
- [향후 전망]: 2030년 관련 시장 규모 10조 원 돌파 예상`,
    zhExplanation: `Part 2에서 배운 [도입 → 증감 추이 → 비율 비교 → 원인 및 전망] 4대 공식을 순서대로 조립하여 250~290자 사이로 완성해 보세요. '6조 원으로', '45.2%로'의 조사 구분에 특히 유의하세요!`,
    vocabAnnotations: [
      {
        word: '돌파하다',
        zhMeaning: '突破 (数值/规模)',
        enMeaning: 'to exceed / break through',
        topikLevel: 4,
      },
      {
        word: '확산되다',
        zhMeaning: '扩散 / 普及',
        enMeaning: 'to spread / diffuse',
        topikLevel: 5,
      },
    ],
    writingRubric: {
      targetChars: [200, 300],
      requiredKeywords: ['한국소비자원', '6조 원으로', '가장 높은 비중을 차지', '뒤를 이었으며', '전망된다'],
      rhetoricStructureGuide:
        '1) 조사 기관 도입, 2) 2020~2026 시장 규모 증가 추이 서술, 3) 양육 이유 1~4위 비율 순차 비교, 4) 원인 명사구의 문장화 및 2030년 10조 원 전망 마감',
      beforeBadExample: `한국소비자원에서 반려동물 시장을 조사했습니다. 2020년에 3조 원이었는데 2023년에 4조 5천억 원이 되었고 2026년에 6조 원로 증가했습니다. 반려동물을 기르는 이유 1위는 정서적 안정감이 45.2%이고, 2위는 외로움 해소가 30.5%이고, 3위는 자녀 교육이 15.0%이고, 기타가 9.3%입니다. 원인은 1인 가구 급증, 고령화 심화 때문이고, 전망은 2030년에 10조 원 돌파 예상입니다.`,
      modelAnswer: `한국소비자원에서 성인 남녀 1,000명을 대상으로 반려동물 관련 산업 규모 및 양육 이유에 대해 조사한 결과에 따르면, 관련 시장 규모는 2020년 3조 원에서 2023년 4조 5천억 원, 2026년 6조 원으로 꾸준히 증가하였다. 이어서 반려동물을 기르는 이유를 살펴보면, ‘정서적 안정감’이 45.2%로 가장 높은 비중을 차지하였다. 그 다음으로 ‘가족 구성원 감소로 인한 외로움 해소’가 30.5%, ‘자녀 교육에 긍정적 영향’이 15.0%로 뒤를 이었으며, ‘기타’는 9.3%에 그쳤다. 이처럼 반려동물 시장이 성장한 것은 1인 가구 급증과 고령화 심화에 따라 반려동물을 가족처럼 여기는 인식이 확산되었기 때문인 것으로 분석된다. 이러한 추세가 지속된다면 2030년에는 시장 규모가 10조 원을 돌파할 것으로 전망된다.`,
    },
    qrBridgeUrl: 'https://hanup.app/study/hanup_topik_writing53/special_unit_w53_master?tab=writing',
  },
  {
    blockId: 'blk_topik_prep_01',
    seriesId: 'hanup_topik_prep',
    chapterId: 'ch_prep_01',
    orderIndex: 3,
    blockType: 'concept_note',
    title: 'TOPIK I 준비편 1회: 하루 일과와 약속 정하기',
    koContent: `[상황 1: 약속 시간 조정 대화]
민수: 수진 씨, 오늘 저녁 7시에 강남역에서 만나기로 했지요?
수진: 민수 씨, 정말 죄송해요. 회사에 급한 일이 생겨서 제시간에 도착하기 어려울 것 같아요. 혹시 약속을 주말로 미룰 수 있을까요?
민수: 네, 괜찮아요. 그럼 이번 주 토요일 오후 2시에 만나요. 제가 역 앞 카페에서 기다릴게요.

[상황 2: 마중과 장소 안내]
마이클: 수진 씨, 저 서울역에 도착했어요. 지금 어디에 있어요?
수진: 저는 지금 서울역 안 2층 시계탑 앞 커피숍에서 커피를 마시며 기다리고 있어요. 천천히 오세요, 제가 입구로 마중을 나갈게요!

[핵심 문법 클리닉: 장소 조사 '에' vs '에서']
1. '에': 정적 존재(있다/없다) 및 이동의 목적지/착점 (예: 서울역에 도착하다, 집에 있다)
2. '에서': 주어가 구체적인 동적 행위를 수행하는 장소 (예: 카페에서 커피를 마시다, 도서관에서 공부하다)`,
    zhExplanation: '【TOPIK I 准备篇 第1课：日常与约定】掌握推迟约定(약속을 미루다)与突发用语(일이 생기다)，以及场所助词“-에(静态存在/到达目的地)”与“-에서(动作发生场所)”的核心区别。发音要点：“급한 일이 생겨서요”读作 [그판 니리 생겨서요]。',
    vocabAnnotations: [
      {
        word: '약속을 미루다',
        zhMeaning: '推迟约定、改期',
        enMeaning: 'to postpone an appointment',
        topikLevel: 1,
        commonChineseErrorNote: '‘약속을 취소하다’와 구별하세요. 미루다는 연기하는 것입니다.',
      },
      {
        word: '일이 생기다',
        zhMeaning: '有急事、发生事情',
        enMeaning: 'something came up unexpectedly',
        topikLevel: 1,
        commonChineseErrorNote: '돌발 상황에는 ‘일이 있다’보다 ‘일이 생기다’를 자주 씁니다.',
      },
      {
        word: '마중을 나가다',
        zhMeaning: '迎接、去接人',
        enMeaning: 'to go meet / greet someone arriving',
        topikLevel: 2,
        commonChineseErrorNote: '오는 사람을 맞이하는 것은 마중, 떠나는 사람을 보내는 것은 배웅입니다.',
      },
      {
        word: '제시간에 도착하다',
        zhMeaning: '准时到达',
        enMeaning: 'to arrive on time / punctually',
        topikLevel: 1,
        commonChineseErrorNote: '지각하지 않고 정시에 도착함을 의미합니다.',
      },
    ],
    audioConfig: {
      voiceId: 'eleven_ko_pro_kr',
      mp3Url: 'https://cdn.hanup.ai/audio/prep_01_routine.mp3',
      dictationBlanks: ['일이 생겨서', '제시간에', '미룰 수', '마중을'],
    },
    writingRubric: {
      targetChars: [10, 50],
      requiredKeywords: ['만날까요'],
      rhetoricStructureGuide: '청유·제안형 어미 -ㄹ/을까요?를 활용하여 문장을 완성하십시오.',
      modelAnswer: '우리 내일 만날까요?',
    },
    qrBridgeUrl: 'https://hanup.ai/study/hanup_topik_prep/ch_prep_01',
  },
  {
    blockId: 'blk_topik_prep_02',
    seriesId: 'hanup_topik_prep',
    chapterId: 'ch_prep_02',
    orderIndex: 4,
    blockType: 'concept_note',
    title: 'TOPIK I 준비편 2회: 쇼핑·교환과 건강 챙기기',
    koContent: `[상황 1: 백화점 의류 교환 대화]
직원: 손님, 어제 구매하신 바지는 마음에 드십니까?
손님: 디자인은 정말 마음에 드는데, 입어 보니까 길이가 좀 짧아서요. 혹시 한 치수 큰 사이즈로 교환할 수 있을까요?
직원: 네, 손님! 결제하신 영수증을 챙겨 오셨으면 바로 같은 색상 큰 사이즈로 교환해 드리겠습니다.

[상황 2: 건강한 생활 습관 의사 상담]
의사: 잠들기 전 스마트폰 사용을 줄이고 따뜻한 보리차를 한 잔 마시는 좋은 습관을 길러 보세요. 무릎이 약한 분들은 계단을 내려올 때 엘리베이터를 타는 것이 바람직합니다.

[핵심 문법 클리닉: 이유 연결어미 '-아/어서' vs '-(으)니까']
1. '-아/어서' 앞에는 과거시제(-았/었-) 결합 불가 ❌, 뒤에는 명령·청유문 결합 불가 ❌
2. '-(으)니까' 뒤에는 명령문(-으세요) 및 청유문(-ㅂ시다) 결합 권장 ⭕`,
    zhExplanation: '【TOPIK I 准备篇 第2课：购物退换与健康习惯】掌握换货(교환하다) vs 退款(환불하다)以及“-아/어서 vs -(으)니까”在时态与句式上的严格语法制约。发音要点：“짧아서요”读作 [짤바서요]。',
    vocabAnnotations: [
      {
        word: '교환하다 / 환불하다',
        zhMeaning: '换货 / 退款',
        enMeaning: 'to exchange item / to get a refund',
        topikLevel: 2,
      },
      {
        word: '영수증을 챙기다',
        zhMeaning: '收好发票、保留小票',
        enMeaning: 'to keep the receipt',
        topikLevel: 1,
      },
      {
        word: '마음에 들다',
        zhMeaning: '中意、合心意、喜欢',
        enMeaning: 'to be to one’s liking',
        topikLevel: 1,
      },
      {
        word: '습관을 기르다',
        zhMeaning: '养成习惯',
        enMeaning: 'to build a habit',
        topikLevel: 2,
      },
    ],
    audioConfig: {
      voiceId: 'eleven_ko_pro_kr',
      mp3Url: 'https://cdn.hanup.ai/audio/prep_02_shopping.mp3',
      dictationBlanks: ['마음에', '짧아서요', '영수증을', '습관을'],
    },
    writingRubric: {
      targetChars: [15, 60],
      requiredKeywords: ['준비했으니까'],
      rhetoricStructureGuide: '이유 어미 -(으)니까의 과거형을 사용하여 문장을 완성하십시오.',
      modelAnswer: '맛있는 한국 음식을 많이 준비했으니까 꼭 놀러 오세요.',
    },
    qrBridgeUrl: 'https://hanup.ai/study/hanup_topik_prep/ch_prep_02',
  },
];

// ============================================================================
// 5. ITEM BANK QUESTIONS (무료 데일리 3제 + 유료 약점 클리닉 120제 샘플)
// ============================================================================
export const SEED_ITEM_BANK: ItemBankQuestion[] = [
  // [무료 1] 한자어·연어 약점 (Unit 01 연동)
  {
    itemId: 'q_free_01_vocab_chorae',
    targetSkill: 'vocabHanja',
    difficultyLevel: 5,
    accessTier: 'free_daily_3',
    questionStem: '다음 밑줄 친 부분과 의미가 가장 비슷한 것을 고르십시오.',
    passageOrAudioText: '무분별한 자원 개발은 심각한 생태계 파괴를 <u>초래했다</u>.',
    options: ['① 유보했다', '② 불러일으켰다', '③ 뒷받침했다', '④ 완화했다'],
    correctIndex: 1,
    explanationKo: "'초래하다'는 어떤(주로 부정적인) 결과를 가져오게 하다는 뜻이므로 '불러일으키다', '야기하다'와 바꾸어 쓸 수 있습니다.",
    explanationZh: '“초래하다(招致/导致)”表示引起某种（主要是消极的）结果，因此可以替换为“불러일으키다(引起)”。①搁置，③支撑，④缓解。',
    liveAnalytics: {
      totalAttempts: 512,
      correctRate: 0.68,
      optionSelectionCounts: [65, 348, 72, 27],
    },
  },
  // [무료 2] 연결어미 약점 — 중국인 오답률 1위 (Unit 01 연동)
  {
    itemId: 'q_free_02_grammar_because_vs_order',
    targetSkill: 'grammarConnective',
    difficultyLevel: 4,
    accessTier: 'free_daily_3',
    questionStem: '다음 문장의 밑줄 친 틀린 부분을 바르게 고친 것을 고르십시오.',
    passageOrAudioText: '자연환경을 <u>보호하기 때문에</u> 일회용품 사용을 적극적으로 줄여야 한다.',
    options: [
      '① 보호하느라고',
      '② 보호하는 바람에',
      '③ 보호하기 위해서',
      '④ 보호하더라도',
    ],
    correctIndex: 2,
    explanationKo: "뒤절에 당위 표현('-아야 한다')이 오고 앞절이 '목적'을 나타내므로 원인 연결어미 '-기 때문에'가 아니라 목적 연결어미 '-기 위해서'를 써야 합니다.",
    explanationZh: '后句有义务表达“-아야 한다(应该)”，前句表示“目的(为了保护环境)”，因此不能用原因词尾“-기 때문에”，必须用目的词尾“-기 위해서”。',
    liveAnalytics: {
      totalAttempts: 840,
      correctRate: 0.42,
      optionSelectionCounts: [190, 242, 353, 55],
    },
  },
  // [무료 3] 쓰기 53번 조사 결합 약점 (Special Unit 53번 연동)
  {
    itemId: 'q_free_03_w53_particles',
    targetSkill: 'writing53Data',
    difficultyLevel: 4,
    accessTier: 'free_daily_3',
    questionStem: '다음 중 TOPIK 쓰기 53번 도표 설명 문장으로 조사와 띄어쓰기가 모두 올바른 것을 고르십시오.',
    options: [
      '① 시장 규모가 3조 원에서 6조 원로 급증하였다.',
      '② 찬성 비율이 25%에서 48%으로 크게 상승하였다.',
      '③ 이용자 수가 100만 명에서 250만 명으로 늘어났다.',
      '④ 기타 의견은 9.3%에 그쳤습니다.',
    ],
    correctIndex: 2,
    explanationKo: "① '원'은 받침이 있으므로 '6조 원으로', ② '%'는 '퍼센트(받침 없음)'로 읽으므로 '48%로', ④ 53번 문어체에서는 '-습니다' 대신 '그쳤다'를 써야 합니다. 따라서 정답은 ③입니다.",
    explanationZh: '①“원”有收音应接“으로”；②“%”读作“퍼센트(无收音)”应接“로”；④53号作文必须用基本阶“-다(그쳤다)”，不能用“-습니다”。因此完全正确的是③（“만 명”需空格，且“명”有收音接“으로”）。',
    liveAnalytics: {
      totalAttempts: 690,
      correctRate: 0.39,
      optionSelectionCounts: [185, 210, 269, 26],
    },
  },
  // [유료 클리닉 1] 읽기 빈칸 추론 (Unit 01 Block B 연동)
  {
    itemId: 'q_paid_04_reading_inference',
    targetSkill: 'readingSkimming',
    difficultyLevel: 5,
    accessTier: 'paid_clinic_120',
    questionStem: '다음 글을 읽고 ( ㉠ )에 들어갈 가장 알맞은 것을 고르십시오.',
    passageOrAudioText:
      '과거에는 국가의 경제 성장을 최우선 과제로 삼아 환경 오염 문제를 부차적인 것으로 여기는 경향이 강했다. 그러나 최근 환경 복구 비용이 기하급수적으로 증가하면서 이러한 인식에 변화가 일고 있다. 따라서 현대 사회에서 환경 보호는 경제 발전을 저해하는 걸림돌이 아니라, ( ㉠ ) 필수적인 조건으로 다루어져야 한다.',
    options: [
      '① 경제 성장을 일시적으로 유보하는',
      '② 단기적인 이익을 극대화하기 위한',
      '③ 지속 가능한 경제 성장을 담보하는',
      '④ 환경 복구 비용을 후세대에 전가하는',
    ],
    correctIndex: 2,
    explanationKo: "역접 접속사 '그러나'와 결론 접속사 '따라서' 뒤에서 환경 보호가 장기적 경제 성장을 보장(담보)하는 필수 조건임을 강조하고 있으므로 ③이 정답입니다.",
    explanationZh: '看转折词“그러나”和结论词“따라서”后面，作者强调环保不是阻碍经济的绊脚石，而是保障(담보하다)可持续经济增长的必要条件。',
    liveAnalytics: {
      totalAttempts: 310,
      correctRate: 0.58,
      optionSelectionCounts: [45, 52, 180, 33],
    },
  },
  // [유료 클리닉 2] 쓰기 54번 문어체 격식 교정 (Unit 01 Block D 연동)
  {
    itemId: 'q_paid_05_w54_formal_ending',
    targetSkill: 'writing54Logic',
    difficultyLevel: 5,
    accessTier: 'paid_clinic_120',
    questionStem: 'TOPIK 쓰기 54번 논설문의 결론 문장으로 가장 적절하고 격식에 맞는 것을 고르십시오.',
    options: [
      '① 따라서 우리 모두 자연환경을 열심히 보호합시다.',
      '② 따라서 환경을 보호하는 것이 무엇보다 중요해요.',
      '③ 따라서 환경과 경제가 상생할 수 있는 대안을 모색해야 한다.',
      '④ 따라서 왜 환경을 보호해야 하는지 잘 알 수 있습니다.',
    ],
    correctIndex: 2,
    explanationKo: '54번 논설문에서는 청유형(-합시다), 해요체(-해요), 합쇼체(-습니다)를 사용하면 감점됩니다. 반드시 평서형 해라체(-ㄴ다/는다/다)와 고급 연어(대안을 모색하다)를 결합한 ③이 정답입니다.',
    explanationZh: '54号议论文严禁使用共动句(-합시다)或口语敬语(-해요/-습니다)，必须统一使用平叙型基本阶(-ㄴ다/는다/다)。',
    liveAnalytics: {
      totalAttempts: 295,
      correctRate: 0.64,
      optionSelectionCounts: [68, 12, 189, 26],
    },
  },
];

// ============================================================================
// 6. WRITING SUBMISSIONS (학술 연구용 코퍼스: 초안 -> AI 1차 -> 교사 2차 -> 학생 수정본)
// ============================================================================
export const SEED_WRITING_SUBMISSIONS: WritingSubmission[] = [
  // [코퍼스 로그 1] Unit 01 (54번 환경과 경제) — 왕링링 학생의 종단 수정 데이터
  {
    submissionId: 'sub_u01_wang_001',
    uid: 'usr_stu_wang',
    orgId: 'org_hanup_hq',
    classId: 'class_topik2_oct',
    blockId: 'blk_u01_writing54_prompt',
    initialDraft: `우리 사회에서 경제 발전과 환경 보호는 아주 중요합니다. 경제 발전과 환경 보호가 싸우는 원인은 사람들이 돈을 많이 벌고 싶기 때문입니다. 만약 환경을 보호하지 않고 경제만 발전하면 많은 나쁜 문제를 만듭니다. 공기가 나빠지고 사람들도 병에 걸려서 병원에 가야 합니다. 그래서 정부와 기업이 같이 노력합시다. 정부는 법을 만들어서 나쁜 공장을 벌주고, 기업은 환경을 보호하기 때문에 좋은 기술을 개발해야 합니다.`,
    aiFeedback: {
      estimatedScore: 24,
      estimatedLevel: 3,
      grammarAndEndingErrors: [
        {
          original: '중요합니다 / 만듭니다 / 노력합시다',
          corrected: '중요하다 / 초래한다 / 노력해야 한다',
          reasonZh: '54号议论文严禁使用口语敬语(-ㅂ니다)和共动句(-합시다)，必须统一改为平叙型基本阶(-ㄴ다/는다/다)。',
        },
        {
          original: '환경을 보호하기 때문에 좋은 기술을 개발해야',
          corrected: '환경을 보호하기 위해서 친환경 기술을 개발해야',
          reasonZh: '表示“为了保护环境(目的)”时，不能用原因连接词尾“-기 때문에”，必须改为“-기 위해서”。',
        },
      ],
      chineseTranslationToneFixes: [
        {
          awkward: '경제 발전과 환경 보호가 싸우는 원인은',
          naturalKo: '경제 성장과 환경 보존이 대립하는 근본적인 원인은',
          tipZh: '将口语词“싸우다(打架)”替换为高级汉字词“대립하다(对立)”。',
        },
        {
          awkward: '많은 나쁜 문제를 만듭니다',
          naturalKo: '심각한 사회적 손실과 환경 오염을 초래한다',
          tipZh: '摆脱中式直译“制造问题(문제를 만들다)”，使用5~6级固定搭配“문제를 초래하다/야기하다”。',
        },
      ],
      rhetoricAndLogicComment:
        '세 가지 과제(대립 원인, 문제점, 정부·기업의 노력)를 모두 언급했으나 어휘가 3급 일상어에 머물러 있고 문장 간 논리적 연결어미(-(으)ㄹ 뿐만 아니라 등)가 부족합니다. 정부(제도·보조금)와 기업(기술 개발 투자)의 역할을 문단 내에서 명확히 구조화해 보세요.',
    },
    instructorFeedback: {
      instructorId: 'usr_admin_owner',
      approvedAiFeedback: true,
      teacherComment:
        'AI가 짚어준 종결어미(-다) 통일과 "-기 위해서" 교정을 가장 먼저 반영해 보세요! 특히 마지막 문단에 Unit 01에서 배운 "양립하다"와 "뒷받침되다" 두 단어를 넣어 고쳐 쓰면 40점 이상으로 껑충 뛸 수 있습니다.',
      finalScore: 26,
      reviewedAt: '2026-10-14T14:30:00Z',
    },
    revisedDraft: `현대 사회에서 경제 발전과 환경 보호는 모두 중요한 가치이다. 이 두 가치가 대립하는 근본적인 원인은 장기적인 지속 가능성보다 당장의 경제적 이익을 우선시하기 때문이다. 그러나 환경을 무시한 채 경제만 발전시키면 심각한 환경 오염을 초래할 뿐만 아니라 막대한 복구 비용을 지출하게 만든다. 따라서 경제 발전과 환경 보호가 양립하기 위해서는 정부와 기업의 노력이 뒷받침되어야 한다. 우선 정부는 법적 규제를 강화하고 친환경 기업에 보조금을 지원해야 한다. 아울러 기업은 환경을 보호하기 위해서 친환경 기술을 적극적으로 개발할 필요가 있다.`,
    submittedAt: '2026-10-14T13:15:00Z',
  },

  // [코퍼스 로그 2] Special Unit (53번 반려동물 도표) — 리하오 학생의 제출 데이터
  {
    submissionId: 'sub_w53_li_002',
    uid: 'usr_stu_li',
    orgId: 'org_hanup_hq',
    classId: 'class_topik2_oct',
    blockId: 'blk_w53_simulation_prompt',
    initialDraft: `한국소비자원에서 성인 남녀 1,000명을 대상으로 반려동물 관련 산업 규모 및 양육 이유에 대해 조사한 결과에 따르면, 시장 규모는 2020년 3조 원에서 2026년 6조 원로 꾸준히 증가하였다. 반려동물을 기르는 이유를 살펴보면, '정서적 안정감'이 45.2%으로 가장 높은 비중을 차지하였다. 그 다음으로 '외로움 해소'가 30.5%, '자녀 교육'이 15.0%로 뒤를 이었으며, '기타'는 9.3%에 그쳤다. 이러한 변화의 원인은 1인 가구 급증과 고령화 심화 때문이고, 2030년에는 시장 규모가 10조 원을 돌파할 것으로 전망된다.`,
    aiFeedback: {
      estimatedScore: 25,
      estimatedLevel: 5,
      grammarAndEndingErrors: [
        {
          original: '6조 원로 꾸준히 증가하였다',
          corrected: '6조 원으로 꾸준히 증가하였다',
          reasonZh: '单位“원”有收音(ㄴ)，后面必须接助词“으로”。',
        },
        {
          original: '45.2%으로 가장 높은',
          corrected: '45.2%로 가장 높은',
          reasonZh: '符号“%”在韩语中读作“퍼센트”，末字“트”没有收音，后面必须接“로”。',
        },
      ],
      chineseTranslationToneFixes: [
        {
          awkward: '원인은 1인 가구 급증과 고령화 심화 때문이고',
          naturalKo: '이처럼 시장이 성장한 것은 1인 가구 급증과 고령화 심화에 따라 반려동물을 가족처럼 여기는 인식이 확산되었기 때문인 것으로 분석된다',
          tipZh: '图表下方的箭头提示词（반려동물을 가족처럼 여기는 인식 확산）不能遗漏，且需要转化为完整的书面语因果句型。',
        },
      ],
      rhetoricAndLogicComment:
        '4대 만능 공식의 뼈대를 매우 훌륭하게 적용했습니다! 다만 숫자 단위 뒤의 조사(원으로 / %로) 실수 2건과, 원인 분석의 두 번째 화살표 키워드 누락만 보완하면 30점 만점 답안이 됩니다.',
    },
    submittedAt: '2026-10-14T16:40:00Z',
  },
];
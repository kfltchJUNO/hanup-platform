import {
  Organization,
  ClassGroup,
  UserProfile,
  AuthoringBlock,
  ItemBankQuestion,
  WritingSubmission,
  HanUpSeries,
  PhonologyErrorLog,
} from '../types/hanup';

// ==========================================
// 1. Series Master Definitions
// ==========================================
export const MOCK_SERIES: HanUpSeries[] = [
  {
    seriesId: 'hanup_topik',
    code: 'hanup_topik',
    titleKo: '한업 토픽 (HanUp TOPIK)',
    titleZh: '韩升 TOPIK 强化班',
    descriptionKo: '읽기 속독·듣기 딕테이션·쓰기 53·54번 AI 튜터 통합 코스',
    descriptionZh: '阅读速读·听力精听·写作53/54题AI实时批改提分课程',
    badgeText: '급수 퀀텀 점프',
    accentColor: '#2563eb', // blue
    iconName: 'GraduationCap',
    chaptersCount: 24,
  },
  {
    seriesId: 'hanup_talk',
    code: 'hanup_talk',
    titleKo: '한업 톡 (HanUp Talk)',
    titleZh: '韩升 口语即战力',
    descriptionKo: '왕초보 생존 회화부터 연음·받침 발음 실시간 클리닉',
    descriptionZh: '零基础生存口语与连音发音诊断矫正',
    badgeText: '1:1 발음 클리닉',
    accentColor: '#10b981', // emerald
    iconName: 'Mic',
    chaptersCount: 16,
  },
  {
    seriesId: 'hanup_vocab',
    code: 'hanup_vocab',
    titleKo: '한업 한자어 (HanUp Vocab)',
    titleZh: '韩升 汉字词精通',
    descriptionKo: '중국어권 특화 동형이의 한자어 및 고급 학술 어휘 500제',
    descriptionZh: '大中华区定制同形异义汉字词与高频核心词汇',
    badgeText: '중화권 특화',
    accentColor: '#f59e0b', // amber
    iconName: 'BookOpen',
    chaptersCount: 20,
  },
  {
    seriesId: 'hanup_pro',
    code: 'hanup_pro',
    titleKo: '한업 비즈니스/아카데믹 (HanUp Pro)',
    titleZh: '韩升 商务与学术',
    descriptionKo: '대학원 학위논문 계획서 및 한국 대기업 이력서·인터뷰 실전',
    descriptionZh: '硕博研究生论文开题与韩企就职实务文书',
    badgeText: '취업·유학 직결',
    accentColor: '#8b5cf6', // purple
    iconName: 'Briefcase',
    chaptersCount: 12,
  },
];

// ==========================================
// 2. Organizations (B2B Multi-tenancy)
// ==========================================
export const MOCK_ORGS: Organization[] = [
  {
    orgId: 'org_hanup_hq',
    orgName: '한업 직영 글로벌 본사 (HanUp HQ)',
    orgType: 'direct_b2c',
    planTier: 'enterprise',
    maxStudentSeats: 50000,
    usedStudentSeats: 1240,
    customBranding: {
      logoUrl: '/logos/hanup_hq.png',
      primaryColor: '#2563eb',
      subdomain: 'app',
    },
    licensedSeriesIds: ['hanup_topik', 'hanup_talk', 'hanup_vocab', 'hanup_pro'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    orgId: 'org_seoul_global',
    orgName: '서울글로벌한국어학원 (신촌본원)',
    orgType: 'academy',
    planTier: 'academy_biz',
    maxStudentSeats: 200,
    usedStudentSeats: 142,
    customBranding: {
      logoUrl: '/logos/seoul_global.png',
      primaryColor: '#059669',
      subdomain: 'seoul-global',
    },
    licensedSeriesIds: ['hanup_topik', 'hanup_vocab'],
    createdAt: '2024-03-15T09:00:00Z',
  },
  {
    orgId: 'org_minji_tutor',
    orgName: '김민지 한국어 1:1 과외 랩',
    orgType: 'solo_tutor',
    planTier: 'tutor_pro',
    maxStudentSeats: 30,
    usedStudentSeats: 18,
    customBranding: {
      logoUrl: '',
      primaryColor: '#7c3aed',
      subdomain: 'minji-korean',
    },
    licensedSeriesIds: ['hanup_topik'],
    createdAt: '2024-05-10T14:30:00Z',
  },
];

// ==========================================
// 3. Class Groups
// ==========================================
export const MOCK_CLASSES: ClassGroup[] = [
  {
    classId: 'class_topik_56_master',
    orgId: 'org_hanup_hq',
    instructorId: 'usr_instructor_01',
    className: 'TOPIK II 5·6급 달성 스파르타 주말반',
    inviteCode: 'UP5482',
    assignedSeriesIds: ['hanup_topik', 'hanup_vocab'],
    studentUids: ['usr_student_01', 'usr_student_02'],
    averageTopikScore: 194,
    createdAt: '2024-09-01T00:00:00Z',
  },
  {
    classId: 'class_biz_writing',
    orgId: 'org_seoul_global',
    instructorId: 'usr_instructor_02',
    className: '대학원 연구계획서 및 학술 작문반',
    inviteCode: 'SG9921',
    assignedSeriesIds: ['hanup_pro', 'hanup_topik'],
    studentUids: ['usr_student_03'],
    averageTopikScore: 218,
    createdAt: '2024-09-10T00:00:00Z',
  },
];

// ==========================================
// 4. Users (Profiles for 4 Roles)
// ==========================================
export const MOCK_USERS: Record<string, UserProfile> = {
  // Lv.1 Student: Wang Wei (중국인 유학생, 현 3급, 목표 5급)
  student: {
    uid: 'usr_student_01',
    name: '왕웨이 (王伟)',
    email: 'wangwei@hanup.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    role: 'student',
    orgId: 'org_hanup_hq',
    classIds: ['class_topik_56_master'],
    nativeLanguage: 'zh-CN',
    currentTopikLevel: 3,
    targetTopikLevel: 5,
    learningPurpose: 'grad_school',
    subscriptionTier: 'free', // Freemium 상태 (약점 3제 무료, 120제 잠김)
    researchConsent: true,
    dailyUsage: {
      date: new Date().toISOString().split('T')[0],
      aiGradeCount: 1, // 1회 사용함 (1/2 남음)
      ocrCount: 0,      // 0회 사용함 (2/2 남음)
    },
    skillRadar: {
      vocabHanja: 82,       // 한자어는 비교적 능통
      grammarConnective: 54, // 연결어미 약점
      listeningInference: 68,
      readingSkimming: 75,
      writing53Data: 60,     // 53번 그래프 도표 분석 보통
      writing54Logic: 42,    // 54번 논술 수사 구조 취약
    },
    scoreHistory: [
      { weekLabel: '1주차', totalScore: 135, listeningScore: 48, readingScore: 52, writingScore: 35, date: '2024-09-07' },
      { weekLabel: '2주차', totalScore: 148, listeningScore: 54, readingScore: 56, writingScore: 38, date: '2024-09-14' },
      { weekLabel: '3주차', totalScore: 162, listeningScore: 60, readingScore: 62, writingScore: 40, date: '2024-09-21' },
      { weekLabel: '4주차', totalScore: 174, listeningScore: 65, readingScore: 66, writingScore: 43, date: '2024-09-28' },
      { weekLabel: '5주차', totalScore: 186, listeningScore: 68, readingScore: 71, writingScore: 47, date: '2024-10-05' },
    ],
    seriesProgress: {
      hanup_topik: 65,
      hanup_talk: 30,
      hanup_vocab: 85,
      hanup_pro: 15,
    },
  },

  // Lv.2 Instructor: 최민서 강사 (Human-in-the-Loop 첨삭 담당)
  instructor: {
    uid: 'usr_instructor_01',
    name: '최민서 선생님',
    email: 'minseo.choi@hanup.kr',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    role: 'instructor',
    orgId: 'org_hanup_hq',
    classIds: ['class_topik_56_master'],
    nativeLanguage: 'other',
    currentTopikLevel: 6,
    targetTopikLevel: 6,
    learningPurpose: 'employment',
    subscriptionTier: 'hanup_pro_pass',
    researchConsent: true,
    skillRadar: {
      vocabHanja: 98,
      grammarConnective: 99,
      listeningInference: 98,
      readingSkimming: 99,
      writing53Data: 97,
      writing54Logic: 99,
    },
    scoreHistory: [],
    seriesProgress: {},
  },

  // Lv.3 Org Admin: 박세진 원장 (서울글로벌학원 대표)
  org_admin: {
    uid: 'usr_orgadmin_01',
    name: '박세진 원장 (서울글로벌)',
    email: 'director.park@seoulglobal.ac.kr',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
    role: 'org_admin',
    orgId: 'org_seoul_global',
    classIds: ['class_biz_writing'],
    nativeLanguage: 'other',
    currentTopikLevel: 6,
    targetTopikLevel: 6,
    learningPurpose: 'employment',
    subscriptionTier: 'hanup_pro_pass',
    researchConsent: true,
    skillRadar: {
      vocabHanja: 95,
      grammarConnective: 95,
      listeningInference: 95,
      readingSkimming: 95,
      writing53Data: 95,
      writing54Logic: 95,
    },
    scoreHistory: [],
    seriesProgress: {},
  },

  // Lv.4 Super Admin: 한업 총괄 디렉터 & 한국어교육학 연구책임자
  super_admin: {
    uid: 'usr_super_01',
    name: '닥터 한 (한업 총괄 & 연구소장)',
    email: 'dr.han@hanup.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    role: 'super_admin',
    orgId: 'org_hanup_hq',
    classIds: [],
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
    seriesProgress: {},
  },
};

// ==========================================
// 5. Authoring Blocks (Lv.4 Studio CMS Data)
// ==========================================
export const MOCK_AUTHORING_BLOCKS: AuthoringBlock[] = [
  {
    blockId: 'blk_topik_54_ai_ethics',
    seriesId: 'hanup_topik',
    chapterId: 'ch_writing_04',
    chapterTitle: '제4장: 논술 54번 인공지능 발전과 윤리적 과제',
    orderIndex: 1,
    blockType: 'writing_prompt',
    title: '54번 실전: AI 기술의 발전이 인간 사회에 미치는 영향과 윤리적 기준',
    koContent: `현대 사회에서 인공지능(AI) 기술은 산업 전반뿐만 아니라 일상생활에까지 깊숙이 자리 잡았습니다. 이에 따라 생산성이 비약적으로 증가하고 삶의 편의성이 향상된 반면, 일자리 감소와 개인정보 침해, 알고리즘 편향성과 같은 윤리적 문제 또한 끊임없이 제기되고 있습니다.

다음을 참고하여 'AI 기술 발전의 명암과 필요한 사회적 대응'에 대해 600~700자로 글을 쓰십시오.
1. AI 기술 발전이 가져온 긍정적인 변화는 무엇인가?
2. AI 도입으로 인해 발생하는 사회적·윤리적 문제점은 무엇인가?
3. 이러한 부작용을 극복하고 건전하게 공존하기 위해 어떠한 노력이 필요한가?`,
    zhExplanation: '【第54题大作文真题模板解析】此题属于典型的“双刃剑·辩证论述型”题目。写作核心要求：600~700字，段落必须严格按三段式展开：① 引言与积极作用（约150字） ② 伴随的社会/伦理危机（约250字） ③ 制度约束与个人素养对策（约250字）。切记避免口语体与中式思维生搬硬套。',
    multilingualExplanations: {
      ko: '【54번 실전 논술 3단 구성 심층 가이드】 이 문제는 기술의 명암을 변증법적으로 다루는 전형적인 양날의 검 유형입니다. 서론(도입 및 긍정적 효과 150자) -> 본론(일자리 감소, 알고리즘 편향성 등 부작용 250자) -> 결론(제도적 법률과 윤리적 선결 과제 250자) 3단 구성을 엄격히 지켜야 합니다.',
      en: '【TOPIK #54 Real Essay In-Depth Analysis & Writing Guide】 This prompt is a classic dialectical essay topic on "The Double-Edged Sword of AI Technology". Required structure: 600~700 words in 3 paragraphs: ① Introduction & positive impacts (~150 words), ② Negative societal & ethical issues (~250 words), ③ Legal/institutional & personal ethics countermeasures (~250 words). Avoid colloquial speech and English translation calques.',
      ja: '【TOPIK54番 論述課題の徹底解説と日韓対照学習ガイド】 この課題は典型的な「科学技術の両刃の剣・弁証法的論述」テーマです。600〜700字の字数制限で、①導入と技術発展の光（約150字）、②アルゴリズム偏向性や雇用喪失などの倫理的危機（約250字）、③法整備と先決課題（約250字）の3段構成で執筆します。日本語直訳調を避け、格式ある「〜ㄴ/는다」体で記述してください。',
      zh: '【第54题大作文真题模板解析】此题属于典型的“双刃剑·辩证论述型”题目。写作核心要求：600~700字，段落必须严格按三段式展开：① 引言与积极作用（约150字） ② 伴随的社会/伦理危机（约250字） ③ 制度约束与个人素养对策（约250字）。切记避免口语体与中式思维生搬硬套。',
      vi: '【Phân tích đề thi viết TOPIK câu 54 & Hướng dẫn đối chiếu Hàn - Việt】 Đề bài thuộc dạng nghị luận biện chứng về "Tính hai mặt của công nghệ AI". Yêu cầu chuẩn: 600~700 từ, chia 3 đoạn: ① Mở bài & mặt tích cực (khoảng 150 chữ), ② Vấn đề đạo đức và tác động tiêu cực (khoảng 250 chữ), ③ Biện pháp chế tài pháp luật và giải pháp tiên quyết (khoảng 250 chữ). Tránh lối dịch từng chữ (word-by-word) và thói quen ngắt âm tiết rời rạc.',
      my: '【TOPIK အမှတ် ၅၄ စာစီစာကုံး သရုပ်ခွဲလေ့လာချက်နှင့် လမ်းညွှန်】 ဤခေါင်းစဉ်သည် နည်းပညာ၏ ကောင်းကျိုးဆိုးကျိုး နှစ်ဖက်စလုံးကို ယှဉ်တွဲသုံးသပ်ရသော ပုံစံဖြစ်ပါသည်။ စာလုံးရေ ၆၀၀ မှ ၇၀၀ အတွင်း အပိုဒ် ၃ ပိုဒ်ဖြင့် ရေးသားရမည်ဖြစ်သည်- ① နိဒါန်းနှင့် အပြုသဘောဆောင်သော အကျိုးသက်ရောက်မှု (စာလုံးရေ ၁၅၀ ခန့်)၊ ② လူမှုရေးနှင့် ကျင့်ဝတ်ဆိုင်ရာ ပြဿနာများ (စာလုံးရေ ၂၅၀ ခန့်)၊ ③ အစိုးရ၏ ဥပဒေပြုမှုနှင့် ဦးစွာဆောင်ရွက်ရမည့် အစီအမံများ (စာလုံးရေ ၂၅၀ ခန့်)။',
    },
    vocabAnnotations: [
      {
        word: '비약적(飛躍的)',
        zhMeaning: '飞跃性的、突飞猛进的',
        enMeaning: 'rapid, dramatic, phenomenal (leap)',
        jaMeaning: '飛躍的（ひやくてき）- 急速で目覚ましい',
        viMeaning: 'nhảy vọt, vượt bậc, đột phá',
        myMeaning: 'အရှိန်အဟုန်ပြင်းသော၊ ခုန်ပျံကျော်လွှားသော (တိုးတက်မှု)',
        topikLevel: 5,
        commonChineseErrorNote: '“发展飞快”不要直译为‘발전이 빠르다’, 54번 작문에서는 ‘비약적으로 발전하다’를 써야 고급 점수를 받습니다.',
        l1ContrastiveNotes: {
          zh: '“发展飞快”不要直译为‘발전이 빠르다’, 54번 작문에서는 ‘비약적으로 발전하다’를 써야 고급 점수를 받습니다.',
          en: 'Instead of basic "very fast growth", use "비약적으로 발전하다" for formal TOPIK essays.',
          ja: '日本語の「飛躍的」と漢字・意味が同値で使いやすい高級表現です。',
          vi: 'Tránh dịch theo kiểu "phát triển nhanh" (발전이 빠르다), hãy dùng "비약적으로 발전하다" để đạt điểm cao.',
          my: 'သာမန် "အလွန်မြန်သည်" ဟု မသုံးဘဲ "비약적으로 발전하다" ကို သုံးစွဲခြင်းဖြင့် အဆင့်မြင့် အမှတ် ရရှိနိုင်ပါသည်။',
        },
      },
      {
        word: '편향성(偏向性)',
        zhMeaning: '偏向性、偏见倾向',
        enMeaning: 'bias, algorithmic slant, partiality',
        jaMeaning: '偏向性（へんこうせい）- 偏り、バイアス',
        viMeaning: 'tính thiên vị, khuynh hướng phiến diện (của thuật toán)',
        myMeaning: 'ဘက်လိုက်မှု၊ တစ်ဖက်စောင်းနင်းဖြစ်မှု',
        topikLevel: 5,
        commonChineseErrorNote: '‘편견(偏见)’보다 알고리즘이나 통계에는 ‘편향성’이라는 학술 어휘가 적합합니다.',
        l1ContrastiveNotes: {
          zh: '‘편견(偏见)’보다 알고리즘이나 통계에는 ‘편향성’이라는 학술 어휘가 적합합니다.',
          en: 'More precise than "편견 (prejudice)" when discussing algorithms or datasets.',
          ja: 'AIやデータ議論では「편견(偏見)」より「편향성(偏向性)」が学術的語彙として適切です。',
          vi: 'Dùng "편향성" chuẩn xác hơn "편견" khi nói về dữ liệu hoặc thuật toán AI.',
          my: 'ဒေတာနှင့် အယ်လဂိုရီသမ် ဆွေးနွေးရာတွင် "편견" ထက် "편향성" ဟူသော ပညာရပ်ဆိုင်ရာ စကားလုံးကို သုံးပါ။',
        },
      },
      {
        word: '선결 과제(先決課題)',
        zhMeaning: '首要解决的课题、先决任务',
        enMeaning: 'prerequisite task, primary imperative',
        jaMeaning: '先決課題（せんけつかだい）- 最優先課題',
        viMeaning: 'nhiệm vụ tiên quyết, vấn đề cần giải quyết trước mắt',
        myMeaning: 'ဦးစွာဖြေရှင်းရမည့် ကိစ္စရပ် (ကြိုတင်တာဝန်)',
        topikLevel: 6,
        commonChineseErrorNote: '대책을 제시할 때 ‘가장 중요한 일’ 대신 ‘선결 과제로서 ~해야 한다’로 문장을 맺으십시오.',
        l1ContrastiveNotes: {
          zh: '대책을 제시할 때 ‘가장 중요한 일’ 대신 ‘선결 과제로서 ~해야 한다’로 문장을 맺으십시오.',
          en: 'In conclusion paragraphs, replace "the most important thing" with "선결 과제이다".',
          ja: '結論文で「一番重要なこと」の代わりに「선결 과제이다」と結ぶと5・6級水準になります。',
          vi: 'Trong phần kết luận, thay vì viết "việc quan trọng nhất", hãy dùng cụm "선결 과제이다".',
          my: 'နိဂုံးချုပ်တွင် "အရေးအကြီးဆုံးအရာ" ဟု မရေးဘဲ "선결 과제이다" ဟု ရေးသားပါ။',
        },
      },
    ],
    audioConfig: {
      voiceId: 'eleven_ko_pro_kr',
      mp3Url: 'https://cdn.hanup.ai/audio/ch04_prompt.mp3',
      dictationBlanks: ['비약적', '편향성', '선결 과제'],
      durationSec: 42,
    },
    writingRubric: {
      targetChars: [600, 700],
      requiredKeywords: ['비약적 발전', '알고리즘 편향성', '제도적 규제', '선결 과제'],
      rhetoricStructureGuide: '서론(현황 제시 및 논제 제기 15%) -> 본론 1(긍정적 변화 30%) -> 본론 2(윤리적 위협 30%) -> 결론(제도적·인식적 해법 25%)',
      modelAnswer: `오늘날 인공지능(AI) 기술은 인간의 지적 노동을 보조하며 생산성을 비약적으로 향상시키고 있다. 의료, 금융, 예술 등 다양한 분야에서 혁신을 견인하며 인류에게 유례없는 편의를 제공하고 있다는 점은 부인할 수 없다.

그러나 기술의 급속한 확산은 심각한 윤리적 딜레마를 동반한다. 첫째, 데이터의 불완전성으로 인한 알고리즘의 편향성이 사회적 차별을 심화시킬 수 있다. 둘째, 자동화로 인한 대규모 일자리 소멸은 노동 시장의 양극화를 가속화한다. 나아가 인간의 생명이나 권리를 침해할 수 있는 치명적 결정에 대해 책임 소재가 불분명하다는 점도 큰 우려를 낳는다.

이러한 부작용을 최소화하고 AI와 공존하기 위해서는 다각적인 노력이 요구된다. 우선 정부와 국제사회는 투명성과 공정성을 담보하는 법적·제도적 가이드라인을 수립해야 한다. 또한 개발자와 사용자는 기술 만능주의를 경계하고 인간 존엄성을 최우선 가치로 삼는 윤리 의식을 함양해야 할 것이다. 기술의 발전이 진정한 인류의 번영으로 이어지도록 하는 것은 결국 인간의 몫이다.`,
    },
    qrBridgeUrl: 'https://hanup.ai/study/hanup_topik/ch_writing_04?qr=topik54_ai',
    osmuExport: {
      xiaohongshuTitle: '🔥TOPIK 54번 700자 논술 만점 치트키! “AI 윤리” 템플릿 공개',
      xiaohongshuSlides: [
        '【P1 표지】 한국어 5·6급 쓰기에서 40점 이상 받는 고득점 어휘 3대장',
        '【P2 문제분석】 AI 기술 발전 명암과 윤리적 과제: 3단 구성 비밀 공식',
        '【P3 고득점 어휘】 "발전이 빠르다" 쓰지 마세요 ❌ -> "비약적으로 발전하다" ⭕',
        '【P4 번역투 교정】 중국인이 자주 틀리는 “放心/안심” vs “안도/보장” 뉘앙스 차이',
        '【P5 모범답안】 650자 완벽 답안 & QR코드 스캔 시 AI 무료 실시간 첨삭',
      ],
      shortFormScript40s: '“토픽 54번 쓸 때마다 ‘발전이 빠르다’만 반복하시는 분들 주목! 6급 채점관을 사로잡는 마법의 어휘는 바로 ‘비약적’입니다. 지금 화면을 캡처하고 프로필 링크에서 3초 만에 AI 첨삭을 받아보세요!”',
    },
    updatedAt: '2024-10-12T11:20:00Z',
  },
  {
    blockId: 'blk_vocab_01_homonym',
    seriesId: 'hanup_vocab',
    chapterId: 'ch_vocab_01',
    chapterTitle: '제1장: 중국인이 90% 틀리는 동형이의 한자어',
    orderIndex: 2,
    blockType: 'reading_passage',
    title: '방심(放心) vs 안심(安心)의 치명적 뉘앙스 차이',
    koContent: `중국어에서 '放心(fàngxīn)'은 걱정을 덜고 마음을 놓는 긍정적인 의미로 쓰이지만, 한국어 '방심(放心)'은 '주의를 집중하지 않고 마음을 풀어놓아 실수를 저지름'을 뜻하는 부정적 단어입니다. 한국어에서 중국어의 放心에 해당하는 표현은 '안심(安心)' 또는 '마음을 놓다'입니다.`,
    zhExplanation: '在韩语中，“방심(放心)”是贬义词（对应中文的大意、粗心、掉以轻心），如果说“선생님, 방심하세요”会让老师非常震惊！正确的韩语表达必须使用“안심(安心)하세요”。',
    vocabAnnotations: [
      {
        word: '방심하다',
        zhMeaning: '大意、掉以轻心',
        enMeaning: 'to be careless, to let one\'s guard down',
        topikLevel: 4,
        commonChineseErrorNote: '放心(중국어) ≠ 방심(한국어). 한국어에서는 부정적 의미입니다.',
      },
      {
        word: '안심하다',
        zhMeaning: '放心、安心',
        enMeaning: 'to feel relieved, to rest assured',
        topikLevel: 3,
        commonChineseErrorNote: '“请放心”은 한국어로 “안심하십시오”라고 번역해야 합니다.',
      },
    ],
    audioConfig: {
      voiceId: 'eleven_ko_pro_kr',
      mp3Url: 'https://cdn.hanup.ai/audio/vocab_01.mp3',
      dictationBlanks: ['방심', '안심'],
      durationSec: 25,
    },
    qrBridgeUrl: 'https://hanup.ai/study/hanup_vocab/ch_vocab_01?qr=vocab_fangxin',
    updatedAt: '2024-10-10T09:15:00Z',
  },
];

// ==========================================
// 6. Item Bank (Clinic Questions: Free 3 & Paid 120)
// ==========================================
export const MOCK_ITEM_BANK: ItemBankQuestion[] = [
  // Free Daily 3: Question 1 (Target: grammarConnective)
  {
    itemId: 'item_daily_01',
    targetSkill: 'grammarConnective',
    skillNameKo: '연결어미·문법',
    difficultyLevel: 4,
    accessTier: 'free_daily_3',
    questionStem: '다음 밑줄 친 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n"이번 학술제는 <u>비가 오는 바람에</u> 야외 행사가 취소되었다."',
    options: [
      '비가 오는 탓에',
      '비가 오는 김에',
      '비가 오는 셈 치고',
      '비가 오는 한편',
    ],
    correctIndex: 0,
    explanationKo: "'-는 바람에'는 예상치 못한 부정적 원인으로 뒷결과가 발생했음을 나타냅니다. 이와 동의어로 쓰이는 표현은 부정적 결과의 원인을 탓하는 '-는 탓에'입니다.",
    explanationZh: "“-는 바람에”表示因突发的不可抗力导致消极负面后果，与表示归咎于消极原因的“-는 탓에”互为同义替换。而“-는 김에”表示顺便，“-는 셈 치고”表示就当做，“-는 한편”表示一方面另一方面。",
    multilingualExplanations: {
      ko: "'-는 바람에'는 예상치 못한 부정적 원인으로 뒷결과가 발생했음을 나타냅니다. 이와 동의어로 쓰이는 표현은 부정적 결과의 원인을 탓하는 '-는 탓에'입니다.",
      en: "'-는 바람에' expresses an unexpected external cause leading to a negative consequence, which is equivalent to '-는 탓에' (due to/blaming the cause).",
      ja: "「-는 바람에」は予期せぬ不測の原因によって好ましくない結果が起きたことを表します。同じく消極的・否定的理由を表す「-는 탓에」と言い換え可能です。",
      zh: "“-는 바람에”表示因突发的不可抗力导致消极负面后果，与表示归咎于消极原因的“-는 탓에”互为同义替换。而“-는 김에”表示顺便，“-는 셈 치고”表示就当做，“-는 한편”表示一方面另一方面。",
      vi: "'-는 바람에' diễn tả nguyên nhân bất ngờ, bất khả kháng dẫn đến kết quả tiêu cực. Cụm từ đồng nghĩa chỉ nguyên nhân tiêu cực là '-는 탓에'.",
      my: "'-는 바람에' သည် မမျှော်လင့်ထားသော အကြောင်းရင်းကြောင့် မကောင်းသော ရလဒ် ဖြစ်ပေါ်ခြင်းကို ဖော်ပြပြီး အလားတူ အဆိုးဘက် အကြောင်းပြချက် '-는 탓에' ဖြင့် အစားထိုးနိုင်ပါသည်။",
    },
    liveAnalytics: {
      totalAttempts: 1240,
      correctRate: 64.5,
      optionSelectionCounts: [800, 180, 120, 140],
    },
  },
  // Free Daily 3: Question 2 (Target: writing54Logic)
  {
    itemId: 'item_daily_02',
    targetSkill: 'writing54Logic',
    skillNameKo: '54번 논술 수사 구조',
    difficultyLevel: 5,
    accessTier: 'free_daily_3',
    questionStem: '논술문에서 자신의 주장에 대한 해결 방안이나 대책을 제시할 때 가장 격식 있고 자연스러운 종결 표현은?',
    options: [
      '사회적 제도를 마련해야 될 수도 있습니다.',
      '사회적 제도를 마련하는 것이 선결 과제라 할 수 있다.',
      '사회적 제도를 마련해 보면 좋을 것 같습니다.',
      '사회적 제도를 마련하기를 간절히 원합니다.',
    ],
    correctIndex: 1,
    explanationKo: "54번 논술문은 학술적 격식체(해라체)를 사용해야 하며, 추측이나 감정적 호소('-할 것 같다', '-원한다') 대신 '-(으)ㄹ 수 있다', '-선결 과제라 할 수 있다'와 같은 객관적 당위 표현을 써야 합니다.",
    explanationZh: "TOPIK 54题论述文严禁使用해요体或主观情绪化表达（如-원합니다, -좋을 것 같습니다）。必须使用规范的해라체以及客观严谨的学术论据句式（如“-선결 과제라 할 수 있다”）。",
    multilingualExplanations: {
      ko: "54번 논술문은 학술적 격식체(해라체)를 사용해야 하며, 추측이나 감정적 호소('-할 것 같다', '-원한다') 대신 '-(으)ㄹ 수 있다', '-선결 과제라 할 수 있다'와 같은 객관적 당위 표현을 써야 합니다.",
      en: "TOPIK 54 essays require the formal academic plain style (해라체). Instead of subjective desires ('-원한다') or weak hedges ('-할 것 같다'), use objective academic assertions like '-선결 과제라 할 수 있다' (prerequisite task).",
      ja: "54番小論文では客観的なヘラ体を使用し、主観的な感情（-원합니다、-좋을 것 같습니다）を避け、「-선결 과제라 할 수 있다（先決課題と言える）」などの学術的当為表現を用います。",
      zh: "TOPIK 54题论述文严禁使用해요体或主观情绪化表达（如-원합니다, -좋을 것 같습니다）。必须使用规范的해라체以及客观严谨的学术论据句式（如“-선결 과제라 할 수 있다”）。",
      vi: "Bài luận câu 54 yêu cầu dùng đuôi câu học thuật (해라체), tránh các biểu cảm cảm tính ('-원한다', '-좋을 것 같다') và nên dùng các mẫu câu khách quan như '-선결 과제라 할 수 있다'.",
      my: "ပုစ္ဆာ ၅၄ စာစီစာကုံးတွင် ပညာရပ်ဆိုင်ရာ 해라체 ကို သုံးရမည်ဖြစ်ပြီး မိမိဆန္ဒ ('-원한다') မဟုတ်ဘဲ ခိုင်မာသော အဆိုပြုချက် '-선결 과제라 할 수 있다' ကို သုံးရပါမည်။",
    },
    liveAnalytics: {
      totalAttempts: 980,
      correctRate: 72.4,
      optionSelectionCounts: [50, 710, 160, 60],
    },
  },
  // Free Daily 3: Question 3 (Target: vocabHanja)
  {
    itemId: 'item_daily_03',
    targetSkill: 'vocabHanja',
    skillNameKo: '한자어·고급어휘',
    difficultyLevel: 4,
    accessTier: 'free_daily_3',
    questionStem: '문맥상 빈칸에 들어가기에 가장 알맞은 어휘를 고르십시오.\n\n"수술이 성공적으로 끝났다는 의사의 말을 듣고서야 가족들은 비로소 (      )할 수 있었다."',
    options: [
      '방심(放心)',
      '안심(安心)',
      '의심(疑心)',
      '관심(關心)',
    ],
    correctIndex: 1,
    explanationKo: "걱정을 덜고 평온을 찾는 것은 '안심(安心)'입니다. 한국어 '방심(放心)'은 경계를 늦추어 실수를 한다는 뜻이므로 정반대의 오답입니다.",
    explanationZh: "消除担忧、放下心来在韩语中是“안심(安心)”。切勿因中文直译而错选“방심(放心，韩语意为粗心大意)”。",
    multilingualExplanations: {
      ko: "걱정을 덜고 평온을 찾는 것은 '안심(安心)'입니다. 한국어 '방심(放心)'은 경계를 늦추어 실수를 한다는 뜻이므로 정반대의 오답입니다.",
      en: "Relieving anxiety and regaining peace of mind is '안심(安心)'. In Korean, '방심(放心)' means carelessness or dropping one's guard, which has the opposite negative meaning.",
      ja: "不安を取り除き心を落ち着かせるのは「안심（安心）」です。韓国語の「방심（放心）」は油断・不注意を意味するため正反対の誤りです。",
      zh: "消除担忧、放下心来在韩语中是“안심(安心)”。切勿因中文直译而错选“방심(放心，韩语意为粗心大意)”。",
      vi: "Thở phào nhẹ nhõm, bớt lo lắng là '안심(安心)'. Trong tiếng Hàn, '방심(放心)' có nghĩa là lơ là, bất cẩn, mang nghĩa tiêu cực hoàn toàn trái ngược.",
      my: "စိတ်အေးချမ်းသွားခြင်းကို '안심(安心)' ဟု သုံးသည်။ ကိုရီးယားစကားတွင် '방심(放心)' သည် သတိလက်လွတ်ဖြစ်ခြင်းကို ဆိုလိုသဖြင့် ဆန့်ကျင်ဘက် အမှားဖြစ်ပါသည်။",
    },
    liveAnalytics: {
      totalAttempts: 1530,
      correctRate: 58.2,
      optionSelectionCounts: [480, 890, 80, 80], // 방심을 480명이나 선택함 (중국인 취약점)
    },
  },

  // Paid Clinic 120 Items (Locked or Unlocked via pass)
  {
    itemId: 'item_paid_preview_01',
    targetSkill: 'writing53Data',
    skillNameKo: '53번 도표·자료 분석',
    difficultyLevel: 5,
    accessTier: 'paid_clinic_120',
    questionStem: '53번 그래프 도표 서술 시 ‘증가 원인’을 서술하는 표현 중 채점 기준에 가장 적합한 문장은?',
    options: [
      '이러한 증가의 원인은 1인 가구가 많아졌기 때문이다.',
      '이러한 증가의 원인은 1인 가구의 증가에 기인한 것으로 나타났다.',
      '이러한 증가는 1인 가구가 많아져서 그런 것이다.',
      '이러한 원인은 바로 1인 가구의 탓이라고 본다.',
    ],
    correctIndex: 1,
    explanationKo: "53번에서 원인을 분석할 때는 '-에 기인한 것으로 나타났다/조사되었다'와 같은 객관적 분석 어휘를 사용할 때 최고점을 획득합니다.",
    explanationZh: "53题图表描述原因时，使用“-에 기인한 것으로 나타났다（归因于……）”可获得满分档高分表达评分。",
    multilingualExplanations: {
      ko: "53번에서 원인을 분석할 때는 '-에 기인한 것으로 나타났다/조사되었다'와 같은 객관적 분석 어휘를 사용할 때 최고점을 획득합니다.",
      en: "In Q53 data analysis, using '-에 기인한 것으로 나타났다' (is shown to be attributable to) secures the highest score for academic tone.",
      ja: "53番の図表記述では「-에 기인한 것으로 나타났다（～に起因することが明らかになった）」のような客観的語彙を使うことで最高得点区分に入ります。",
      zh: "53题图表描述原因时，使用“-에 기인한 것으로 나타났다（归因于……）”可获得满分档高分表达评分。",
      vi: "Khi miêu tả nguyên nhân ở câu 53, dùng mẫu '-에 기인한 것으로 나타났다' (được cho là bắt nguồn từ...) sẽ đạt điểm tối đa về văn phong học thuật.",
      my: "မေးခွန်း ၅၃ အချက်အလက်ဖော်ပြရာတွင် '-에 기인한 것으로 나타났다' (ဖြစ်ပေါ်လာရခြင်းကြောင့်ဟု ဖော်ပြထားသည်) ဟူသော စကားလုံးကို သုံးခြင်းဖြင့် အမှတ်ပြည့် ရရှိနိုင်ပါသည်။",
    },
    liveAnalytics: {
      totalAttempts: 412,
      correctRate: 81.0,
      optionSelectionCounts: [50, 334, 18, 10],
    },
  },
  {
    itemId: 'item_paid_02',
    targetSkill: 'readingSkimming',
    skillNameKo: '읽기 속독·논리',
    difficultyLevel: 5,
    accessTier: 'paid_clinic_120',
    questionStem: '다음 글의 중심 생각으로 가장 알맞은 것을 고르십시오.\n\n"현대 사회에서 정보의 홍수는 개인에게 비판적 사고력을 요구한다. 단순히 많은 정보를 수용하는 것보다 정보의 진위와 숨은 의도를 분별해 내는 능력이야말로 지식 사회를 살아가는 필수 생존 전략이다."',
    options: [
      '빠른 정보 습득 능력이 가장 중요하다.',
      '정보를 수용할 때 비판적으로 분별하는 태도가 필요하다.',
      '지식 사회에서는 정보의 양을 줄여야 한다.',
      '정보의 홍수는 개인의 사고력을 저하시킨다.',
    ],
    correctIndex: 1,
    explanationKo: "지문 후반부의 '정보의 진위와 숨은 의도를 분별해 내는 능력이야말로 필수 생존 전략이다'가 핵심 주제문입니다.",
    explanationZh: "核心主题句在句尾：“진위와 숨은 의도를 분별해 내는 능력이야말로 필수 생존 전략이다”（辨别真伪和意图的能力才是必备生存策略），故选2。",
    multilingualExplanations: {
      ko: "지문 후반부의 '정보의 진위와 숨은 의도를 분별해 내는 능력이야말로 필수 생존 전략이다'가 핵심 주제문입니다.",
      en: "The sentence at the end, 'the ability to discern the veracity and hidden intentions of information is the essential survival strategy', states the main idea.",
      ja: "本文後半の「真偽と隠された意図を見分ける能力こそが必須の生存戦略である」が中核的主題文です。",
      zh: "核心主题句在句尾：“진위와 숨은 의도를 분별해 내는 능력이야말로 필수 생존 전략이다”（辨别真伪和意图的能力才是必备生存策略），故选2。",
      vi: "Câu chủ đề nằm ở cuối đoạn: 'năng lực phân biệt thật giả và ý đồ ẩn giấu của thông tin chính là chiến lược sinh tồn thiết yếu'.",
      my: "စာပိုဒ်အဆုံးရှိ 'သတင်းအချက်အလက်၏ အမှားအမှန်နှင့် ဖုံးကွယ်ထားသော ရည်ရွယ်ချက်ကို ခွဲခြားနိုင်စွမ်းသည် မရှိမဖြစ် ရှင်သန်ရေး မဟာဗျူဟာဖြစ်သည်' ဟူသော စာကြောင်းမှာ အဓိက အချက်ဖြစ်ပါသည်။",
    },
    liveAnalytics: {
      totalAttempts: 520,
      correctRate: 74.2,
      optionSelectionCounts: [40, 386, 30, 64],
    },
  },
  {
    itemId: 'item_paid_03',
    targetSkill: 'listeningInference',
    skillNameKo: '듣기 추론·연음',
    difficultyLevel: 6,
    accessTier: 'paid_clinic_120',
    questionStem: '[듣기 대화 추론] 남자가 이어서 할 행동으로 가장 알맞은 것은?\n\n(여): "박 대리님, 오늘 3시 이사회 회의록 초안 다 작성하셨나요?"\n(남): "네, 부장님. 방금 1차 출력 마쳤는데, 재무제표 수치만 한 번 더 대조해 본 뒤 결재 올려드리겠습니다."',
    options: [
      '회의록을 파쇄한다.',
      '재무제표 수치를 확인하고 결재를 올린다.',
      '부장님에게 회의 일정을 연기하자고 건의한다.',
      '이사회에 직접 참석하여 발언한다.',
    ],
    correctIndex: 1,
    explanationKo: "남자의 마지막 발언 '재무제표 수치만 한 번 더 대조해 본 뒤 결재 올려드리겠습니다'를 통해 이어질 행동을 직접 유추할 수 있습니다.",
    explanationZh: "男士最后一句话明确表明：“재무제표 수치만 한 번 더 대조해 본 뒤 결재 올려드리겠습니다”（核对完财报数字后提交审批），故选2。",
    multilingualExplanations: {
      ko: "남자의 마지막 발언 '재무제표 수치만 한 번 더 대조해 본 뒤 결재 올려드리겠습니다'를 통해 이어질 행동을 직접 유추할 수 있습니다.",
      en: "The man's closing remark 'I will cross-check the financial figures once more before submitting for approval' directly indicates the next action.",
      ja: "男性の最後のセリフ「財務諸表の数値のみもう一度照合した上で決済を上げます」から次に取る行動が推論できます。",
      zh: "男士最后一句话明确表明：“재무제표 수치만 한 번 더 대조해 본 뒤 결재 올려드리겠습니다”（核对完财报数字后提交审批），故选2。",
      vi: "Câu nói cuối của người nam 'sau khi đối chiếu lại các số liệu trên báo cáo tài chính thì tôi sẽ trình ký' cho biết hành động tiếp theo.",
      my: "အမျိုးသား၏ နောက်ဆုံးစကား 'ဘဏ္ဍာရေးရှင်းတမ်း ကိန်းဂဏန်းများကို နောက်တစ်ကြိမ် တိုက်ဆိုင်စစ်ဆေးပြီးမှ ခွင့်ပြုချက် တင်ပြပါမည်' မှတစ်ဆင့် နောက်ဆက်တွဲ ပြုလုပ်မည့် လုပ်ဆောင်ချက်ကို တိုက်ရိုက် သိရှိနိုင်ပါသည်။",
    },
    liveAnalytics: {
      totalAttempts: 680,
      correctRate: 85.5,
      optionSelectionCounts: [10, 581, 40, 49],
    },
  },
];

// ==========================================
// 7. Writing Submissions (Research Corpus Pipeline)
// ==========================================
export const MOCK_SUBMISSIONS: WritingSubmission[] = [
  {
    submissionId: 'sub_20241012_001',
    uid: 'usr_student_01',
    studentName: '왕웨이 (王伟)',
    orgId: 'org_hanup_hq',
    classId: 'class_topik_56_master',
    blockId: 'blk_topik_54_ai_ethics',
    taskType: 'topik_54_essay',
    taskPromptTitle: '54번 실전: AI 기술의 발전이 인간 사회에 미치는 영향과 윤리적 과제',
    inputMethod: 'keyboard_typing',
    researchConsent: true,
    consentedAt: '2024-10-12T14:30:00Z',
    initialDraft: `요즘 세상에서 인공지능 기술이 발전이 아주 빠릅니다. 그래서 사람들이 생활이 편해지고 생산성이 높아졌습니다. 그렇지만 나쁜 점도 아주 많습니다. 예를 들면 데이터가 편견이 있어서 사람을 차별합니다. 그리고 일자리가 없어져서 노동자들이 걱정합니다. 만약 사고가 나면 누구의 책임인지 모릅니다.
그러므로 우리는 이런 문제를 해결하기 위해서 노력해야 합니다. 정부는 법을 만들어야 하고 사람들은 기술만 믿지 말고 윤리를 생각해야 합니다. 이것이 가장 중요한 일입니다.`,
    aiFeedback: {
      estimatedScore: 34,
      estimatedLevel: 4,
      grammarAndEndingErrors: [
        {
          original: '발전이 아주 빠릅니다',
          corrected: '비약적으로 발전하고 있다',
          reasonZh: '54번 논술문에서는 구어체 부사 ‘아주’ 대신 학술 부사 ‘비약적으로’를 사용하고, 종결어미는 격식 해라체(-ㄴ/는다)로 통일해야 합니다.',
          reasonEn: 'In TOPIK 54 essays, avoid conversational adverbs ("아주") and colloquial endings (-습니다); consistently use the formal academic ending (-ㄴ/는다) with "비약적으로".',
          reasonJa: 'TOPIK54番論述文では、口語的な副詞「아주」の代わりに学術的な「비약적으로」を用い、断定体（〜ㄴ/는다）に統一してください。',
          reasonVi: 'Trong bài viết TOPIK 54, hãy thay phó từ khẩu ngữ "아주" bằng phó từ học thuật "비약적으로" và thống nhất đuôi câu trang trọng (-ㄴ/는다).',
          reasonMy: 'TOPIK 54 စာစီစာကုံးတွင် စကားပြောအသုံး "아주" အစား ပညာရပ်ဆိုင်ရာ "비약적으로" ကို သုံးပြီး တရားဝင် စာပေအဆုံးသတ် (-ㄴ/는다) ဖြင့် ရေးသားပါ။',
        },
        {
          original: '사람들이 생활이 편해지고',
          corrected: '인간의 삶이 윤택해지고',
          reasonZh: '이중 주격 조사(사람들이 생활이)의 중복을 피하고 명사구를 정돈하십시오.',
          reasonEn: 'Avoid double nominative particles ("사람들이 생활이") by using concise compound noun phrases like "인간의 삶이 윤택해지고".',
          reasonJa: '二重主格助詞の重複を避け、「인간의 삶이 윤택해지고(人間の生活が豊かになり)」のように名詞節を整理してください。',
          reasonVi: 'Tránh lặp hai trợ từ chủ ngữ liên tiếp; hãy sử dụng cụm danh từ tự nhiên "인간의 삶이 윤택해지고".',
          reasonMy: 'ကတ္တားဝိဘတ် နှစ်ထပ်ဖြစ်ခြင်းကို ရှောင်ရှားပြီး "인간의 삶이 윤택해지고" ဟု နာမ်တွဲဖြင့် ကျစ်လျစ်စွာ ရေးသားပါ။',
        },
      ],
      chineseTranslationToneFixes: [
        {
          awkward: '이것이 가장 중요한 일입니다',
          naturalKo: '이것이야말로 건전한 상생을 위한 선결 과제라 할 수 있다',
          tipZh: '중국어 “这是最重要的事” 직역 투입니다. 결론부에서는 ‘선결 과제’라는 고급 한자어를 활용해 설득력을 높이세요.',
          tipEn: 'Calque of "This is the most important thing". In conclusion paragraphs, use the formal academic keyword "선결 과제(prerequisite task)".',
          tipJa: '「一番重要なことだ」という直訳調を脱却し、結論部では高級論文語彙である「선결 과제(先決課題)」を活用してください。',
          tipVi: 'Tránh lối dịch từng chữ "đây là việc quan trọng nhất", hãy dùng cụm từ vựng cao cấp "선결 과제" (nhiệm vụ tiên quyết) trong phần kết luận.',
          tipMy: 'နိဂုံးချုပ်တွင် "အရေးအကြီးဆုံးအရာ" ဟု တိုက်ရိုက် မသုံးဘဲ "선결 과제" (ဦးစွာဖြေရှင်းရမည့် ကြိုတင်တာဝန်) ဟူသော စကားလုံးကို သုံးပါ။',
        },
        {
          awkward: '사고가 나면 누구의 책임인지 모릅니다',
          naturalKo: '치명적 사고 발생 시 책임 소재가 불분명하다',
          tipZh: '구어적 의문문 형태 대신 ‘책임 소재의 불명확성’ 등 명사형 학술 문체로 서술해야 5·6급 채점 기준에 부합합니다.',
          tipEn: 'Replace conversational rhetorical questions ("we don\'t know whose fault it is") with objective noun-phrase expressions like "책임 소재가 불분명하다 (liability is ambiguous)".',
          tipJa: '口語的な疑問形（誰の責任か分からない）の代わりに、「책임 소재가 불분명하다(責任の所在が不明確だ)」などの客観的名詞句で記述してください。',
          tipVi: 'Thay vì dùng câu hỏi đàm thoại, hãy diễn đạt bằng cụm danh từ khách quan "책임 소재가 불분명하다" (trách nhiệm pháp lý chưa rõ ràng).',
          tipMy: 'သံသယမေးခွန်းပုံစံအစား "책임 소재가 불분명하다" (တာဝန်ရှိသူ ရှင်းလင်းမှုမရှိခြင်း) ဟူသော ရည်မှန်းချက်ရှိသော ပညာရပ်ဆိုင်ရာ ဝေါဟာရကို အသုံးပြုပါ။',
        },
      ],
      rhetoricAndLogicComment: '서론-본론-결론의 3단 구성 요건은 갖추었으나, 글자 수가 약 280자로 기준(600~700자)에 크게 미달합니다. 각 단락마다 구체적인 사회적 사례(자율주행차 사고, 챗봇의 혐오 발언 등)를 덧붙여 논증을 보강하십시오.',
      analyzedAt: '2024-10-12T14:32:00Z',
    },
    instructorFeedback: {
      instructorId: 'usr_instructor_01',
      instructorName: '최민서 선생님',
      approvedAiFeedback: true,
      teacherComment: '웨이 학생! AI 1차 분석대로 논리 뼈대는 잘 잡았어요. 특히 결론에서 지적된 "선결 과제" 표현을 꼭 적용하고, 2번째 본론에 자율주행 사고 책임 소재 사례를 2문장만 더 늘려서 600자를 채워 다시 제출해 봅시다!',
      finalScore: 36,
      reviewedAt: '2024-10-12T16:10:00Z',
    },
    revisedDraft: `오늘날 인공지능(AI) 기술은 산업 전반에서 비약적으로 발전하고 있다. 그 결과 인간의 삶은 더욱 편리해졌으며 사회적 생산성 또한 괄목할 만하게 향상되었다.

그러나 기술의 급속한 확산은 결코 간과할 수 없는 부작용을 야기한다. 첫째, 알고리즘의 편향성으로 인해 사회적 차별이 심화될 위험이 크다. 둘째, 자동화로 인한 일자리 감소는 노동 시장에 큰 혼란을 초래한다. 특히 자율주행차나 의료 진단 AI에서 사고가 발생할 경우 책임 소재가 불분명하여 법적 분쟁이 일어날 수 있다.

따라서 이러한 문제를 극복하기 위한 다각적인 대책이 요구된다. 정부와 사회는 엄격한 윤리적 법률을 제정해야 하며, 인류는 기술 만능주의를 경계해야 한다. 이것이야말로 인간과 기술이 조화롭게 공존하기 위한 선결 과제라 할 수 있다.`,
    submittedAt: '2024-10-12T14:30:00Z',
    revisedAt: '2024-10-12T19:40:00Z',
    uribanMeta: {
      assignmentId: 'asg_topik54_ai_future',
      activeDurationMs: 1420000,
      totalDurationMs: 1850000,
      pasteAttempts: 2,
      errorTags: [
        {
          category: '어휘 선택 오류',
          severity: 'moderate',
          original: '아주 빨라지고',
          correction: '비약적으로 발전하고',
          explanation: '구어적 부사 "아주" 대신 TOPIK 54 논술용 학술 부사 "비약적으로" 사용',
        },
        {
          category: '조사 오류',
          severity: 'minor',
          original: '사람들이 생활이',
          correction: '인간의 삶이',
          explanation: '이중 주격 조사 중복 회피 및 명사구 정돈',
        },
        {
          category: '기타',
          severity: 'moderate',
          original: '이것이 가장 중요한 일입니다',
          correction: '이것이야말로 건전한 상생을 위한 선결 과제라 할 수 있다',
          explanation: '중국어 번역투 직역 탈피 및 선결 과제 고급 표현 적용',
        },
      ],
    },
  },
  {
    submissionId: 'sub_20241013_002',
    uid: 'usr_student_02',
    studentName: '리하오 (李浩)',
    orgId: 'org_hanup_hq',
    classId: 'class_topik_56_master',
    blockId: 'blk_topik_53_simulation',
    taskType: 'topik_53_graph',
    taskPromptTitle: '53번 도표: 인주시 1인 가구 변화와 증감 원인 분석',
    inputMethod: 'handwriting_ocr',
    rawOcrText: '인주시의 1인가구는 2010년 15%로 나타났으나 2020년에는 35%로 급증했다. 이러한 증가는 독신주의 확산에 기인한 것으로 조사됐다. 반면 주거비용은 6조 원로 증가하여 대책이 필요하다.',
    researchConsent: true,
    consentedAt: '2024-10-13T10:15:00Z',
    initialDraft: '인주시의 1인가구는 2010년 15%로 나타났으나 2020년에는 35%로 급증했다. 이러한 증가는 독신주의 확산에 기인한 것으로 조사됐다. 반면 주거비용은 6조 원로 증가하여 대책이 필요하다.',
    aiFeedback: {
      estimatedScore: 24,
      estimatedLevel: 4,
      grammarAndEndingErrors: [
        {
          original: '6조 원로',
          corrected: '6조 원으로',
          reasonZh: '‘원’은 받침(ㄴ)이 있는 명사이므로 조사 ‘-으로’가 결합해야 합니다. 손글씨 원고지 작성 시 빈출 오류입니다.',
          reasonEn: '"원" has a final consonant (ㄴ), so the instrumental particle "-으로" must be attached instead of "-로". Common handwriting spelling error.',
          reasonJa: '「원」には終声（パッチムㄴ）があるため、助詞「-으로」が接続する必要があります。手書き原稿用紙で頻出する誤りです。',
          reasonVi: '"원" có phụ âm cuối (ㄴ), do đó phải kết hợp với trợ từ "-으로" thay vì "-로". Lỗi thường gặp khi viết tay.',
          reasonMy: '"원" တွင် သတ်ဗျည်း (ㄴ) ပါရှိသောကြောင့် ဝိဘတ် "-으로" နှင့် တွဲရပါမည်။ လက်ရေးဖြင့် ရေးသားရာတွင် အဖြစ်များသော အမှားဖြစ်ပါသည်။',
        },
      ],
      chineseTranslationToneFixes: [],
      rhetoricAndLogicComment: '도표의 수치와 증가율(15% -> 35%)은 적절히 명시했으나, 수기 작성 시 조사 결합(원로 -> 원으로)과 띄어쓰기(1인 가구)를 주의하십시오.',
      analyzedAt: '2024-10-13T10:16:00Z',
    },
    instructorFeedback: {
      instructorId: 'usr_instructor_01',
      instructorName: '최민서 선생님',
      approvedAiFeedback: true,
      teacherComment: '수기 원고지 스캔본을 잘 확인했습니다. 53번은 조사 하나로 2점 감점이 생기니 \'원로\'를 \'원으로\'로 꼭 고쳐 적으세요!',
      finalScore: 26,
      reviewedAt: '2024-10-13T11:00:00Z',
    },
    revisedDraft: '인주시의 1인 가구는 2010년 15%에서 2020년 35%로 크게 증가하였다. 이러한 증가는 독신주의 확산에 기인한 것으로 나타났다. 반면 주거비용은 6조 원으로 급증하여 개선 대책이 요구된다.',
    submittedAt: '2024-10-13T10:15:00Z',
    revisedAt: '2024-10-13T14:20:00Z',
    uribanMeta: {
      assignmentId: 'asg_topik53_single_household',
      activeDurationMs: 780000,
      totalDurationMs: 950000,
      pasteAttempts: 0,
      errorTags: [
        {
          category: '조사 오류',
          severity: 'major',
          original: '6조 원로',
          correction: '6조 원으로',
          explanation: '종성 받침(ㄴ) 명사 뒤 격조사 -으로 결합 오류 (손글씨 작성 오류)',
        },
        {
          category: '기타',
          severity: 'minor',
          original: '1인가구',
          correction: '1인 가구',
          explanation: '수사와 명사 간 띄어쓰기 원고지 규정 미준수',
        },
      ],
    },
  },
];

// ==========================================
// 8. Sori Tutor Phonology Error Logs (Cross-App Multimodal)
// ==========================================
export const MOCK_PHONOLOGY_LOGS: PhonologyErrorLog[] = [
  {
    id: 'sori_log_001',
    userId: 'usr_student_01',
    userName: '왕웨이 (王伟)',
    timestamp: '2024-10-14T11:20:00Z',
    targetSentence: '인간의 삶이 윤택해지고 비약적으로 발전했다.',
    recognizedText: '인가네 살미 윤태캐지고 비야그로 발쩌내따',
    score: 82,
    codaErrorsCount: 2,
    vowelErrorsCount: 1,
    explanation: '연음 규칙은 자연스럽게 구사했으나, "윤택해지고"의 종성(ㄱ) 격음화와 "발전했다"의 종성(ㄴ) 전설모음화에서 일부 음운 탈락이 관찰되었습니다.',
    advice: '중국어 모어 화자 특성상 한국어 불파음 종성(ㄱ, ㄷ, ㅂ)이 모음 앞에서 약화되는 경향이 있습니다. 종성을 끝까지 물고 닫는 연습을 추천합니다.',
    syllableResults: [
      { char: '인', recognizedChar: '인', status: 'match' },
      { char: '간', recognizedChar: '간', status: 'match' },
      { char: '의', recognizedChar: '에', status: 'match', tip: '조사 "의"는 [에]로 발음해도 표준 발음으로 인정됩니다.' },
      { char: '삶', recognizedChar: '살', status: 'coda_error', tip: '겹받침 "ㄹㅁ" 중 "ㅁ" 연음 [살미] 주의' },
      { char: '이', recognizedChar: '미', status: 'match' },
      { char: '윤', recognizedChar: '윤', status: 'match' },
      { char: '택', recognizedChar: '태', status: 'coda_error', tip: '종성 "ㄱ"과 초성 "ㅎ"이 축약되어 [태캐]로 강하게 발음되어야 합니다.' },
      { char: '해', recognizedChar: '캐', status: 'match' },
      { char: '지', recognizedChar: '지', status: 'match' },
      { char: '고', recognizedChar: '고', status: 'match' },
      { char: '비', recognizedChar: '비', status: 'match' },
      { char: '약', recognizedChar: '야', status: 'vowel_error', tip: '이중모음 "ㅑ" 발음 시 입술을 더 크게 벌려주세요.' },
      { char: '적', recognizedChar: '그', status: 'coda_error' },
      { char: '으', recognizedChar: '로', status: 'match' },
      { char: '로', recognizedChar: '로', status: 'match' },
      { char: '발', recognizedChar: '발', status: 'match' },
      { char: '전', recognizedChar: '전', status: 'match' },
      { char: '했', recognizedChar: '해', status: 'coda_error' },
      { char: '다', recognizedChar: '따', status: 'match' },
    ],
  },
  {
    id: 'sori_log_002',
    userId: 'usr_student_02',
    userName: '리하오 (李浩)',
    timestamp: '2024-10-14T14:45:00Z',
    targetSentence: '인주시의 주거비용은 6조 원으로 급증하여 개선 대책이 요구된다.',
    recognizedText: '인주시에 주거비용은 육쪼 워느로 급쯩하여 개선 대채기 요구된다',
    score: 88,
    codaErrorsCount: 1,
    vowelErrorsCount: 0,
    explanation: '"원으로 [워느로]" 연음과 숫자 "6조 [육쪼]" 경음화 발음이 매우 우수합니다. "급증 [급쯩]"에서 종성 비음화 타이밍만 살짝 보완하면 만점입니다.',
    advice: '받침 ㅂ 뒤의 ㅈ이 된소리 [ㅉ]로 바뀌는 사잇소리 현상을 아주 정확히 이해하고 있습니다.',
    syllableResults: [
      { char: '인', recognizedChar: '인', status: 'match' },
      { char: '주', recognizedChar: '주', status: 'match' },
      { char: '시', recognizedChar: '시', status: 'match' },
      { char: '의', recognizedChar: '에', status: 'match' },
      { char: '주', recognizedChar: '주', status: 'match' },
      { char: '거', recognizedChar: '거', status: 'match' },
      { char: '비', recognizedChar: '비', status: 'match' },
      { char: '용', recognizedChar: '용', status: 'match' },
      { char: '은', recognizedChar: '은', status: 'match' },
      { char: '육', recognizedChar: '육', status: 'match' },
      { char: '조', recognizedChar: '쪼', status: 'match' },
      { char: '원', recognizedChar: '워', status: 'match' },
      { char: '으', recognizedChar: '느', status: 'match' },
      { char: '로', recognizedChar: '로', status: 'match' },
      { char: '급', recognizedChar: '급', status: 'match' },
      { char: '증', recognizedChar: '쯩', status: 'match' },
      { char: '하', recognizedChar: '하', status: 'match' },
      { char: '여', recognizedChar: '여', status: 'match' },
      { char: '개', recognizedChar: '개', status: 'match' },
      { char: '선', recognizedChar: '선', status: 'match' },
      { char: '대', recognizedChar: '대', status: 'match' },
      { char: '책', recognizedChar: '채', status: 'coda_error', tip: '종성 "ㄱ" 연음 [대채기] 확인' },
      { char: '이', recognizedChar: '기', status: 'match' },
      { char: '요', recognizedChar: '요', status: 'match' },
      { char: '구', recognizedChar: '구', status: 'match' },
      { char: '된', recognizedChar: '된', status: 'match' },
      { char: '다', recognizedChar: '다', status: 'match' },
    ],
  },
];

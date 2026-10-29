import {
  SoriWordAsset,
  SoriSentenceAsset,
  SoriDiscourseAsset,
} from '../types/soriAsset';

// =========================================================================
// 1. 단어(Word) 에셋 초기 저장소
// =========================================================================
export const SORI_WORD_REGISTRY: Record<string, SoriWordAsset> = {
  word_prep_01_01: {
    id: 'word_prep_01_01',
    text: '급한 일',
    standardPronunciation: '[그판 닐]',
    ipa: '/kɯpʰan il/',
    phonologyRules: ['aspiration', 'n_insertion'],
    targetSyllables: ['급', '한', '일'],
    l1Vulnerabilities: ['three_way_stops', 'coda_unreleased_stops'],
    meaning: {
      ko: '빨리 처리해야 하는 다급한 용무',
      zh: '急事',
      en: 'urgent matter',
      vi: 'việc gấp',
    },
    seriesId: 'hanup_topik_prep',
    chapterId: 'ch_prep_01',
    difficultyLevel: 'A1',
  },
  word_prep_01_02: {
    id: 'word_prep_01_02',
    text: '연락하다',
    standardPronunciation: '[열라카다]',
    ipa: '/jʌllakʰada/',
    phonologyRules: ['lateralization', 'aspiration'],
    targetSyllables: ['연', '락', '하', '다'],
    l1Vulnerabilities: ['liquid_distinction'],
    meaning: {
      ko: '어떤 사실을 알리거나 전하다',
      zh: '联系',
      en: 'to contact',
    },
    seriesId: 'hanup_topik_prep',
    chapterId: 'ch_prep_01',
    difficultyLevel: 'A1',
  },
  word_life2_kiosk_01: {
    id: 'word_life2_kiosk_01',
    text: '포장해',
    standardPronunciation: '[포장해]',
    phonologyRules: ['liaison'],
    targetSyllables: ['포', '장', '해'],
    meaning: {
      ko: '음식을 싸서 가지고 감 (테이크아웃)',
      zh: '打包',
      en: 'takeout / to go',
    },
    seriesId: 'hanup_life_step2',
    chapterId: 'ch_life2_01',
    difficultyLevel: 'A2',
  },
};

// =========================================================================
// 2. 문장(Sentence) 에셋 초기 저장소
// =========================================================================
export const SORI_SENTENCE_REGISTRY: Record<string, SoriSentenceAsset> = {
  sent_prep_01_01: {
    id: 'sent_prep_01_01',
    text: '급한 일이 생겨서요.',
    targetPronunciation: '[그판 니리 생겨서요]',
    intonationType: 'declarative_falling',
    f0ContourGuide: '‘생겨서요’에서 부드럽게 끝음을 내리며 정중하게 말합니다 (↘)',
    speechRate: 'normal',
    keyWordAssetIds: ['word_prep_01_01'],
    phonologyRules: ['aspiration', 'n_insertion', 'liaison'],
    sentenceMeaning: {
      ko: '갑자기 다급한 용무가 생겼음을 완곡하게 설명함',
      zh: '因为突然有急事。',
      en: 'Because an urgent matter came up.',
    },
    seriesId: 'hanup_topik_prep',
    chapterId: 'ch_prep_01',
    category: 'topik',
  },
  sent_prep_02_01: {
    id: 'sent_prep_02_01',
    text: '이것 좀 짧아서요.',
    targetPronunciation: '[이걷 쫌 짤바서요]',
    intonationType: 'declarative_falling',
    f0ContourGuide: '‘짧아서요’의 겹받침 ‘ㄼ’이 뒤의 모음 ‘아’로 연음되어 [짤바]로 실현됩니다.',
    speechRate: 'normal',
    phonologyRules: ['coda_neutralization', 'tensification', 'liaison'],
    sentenceMeaning: {
      ko: '길이나 분량이 부족함을 표현',
      zh: '因为这个有点短。',
      en: 'Because this one is a bit short.',
    },
    seriesId: 'hanup_topik_prep',
    chapterId: 'ch_prep_02',
    category: 'topik',
  },
  sent_life2_01: {
    id: 'sent_life2_01',
    text: '따뜻한 아메리카노 한 잔 포장해 주세요.',
    targetPronunciation: '[따뜨탄 아메리카노 한 잔 포장해 주세요]',
    intonationType: 'sustained_polite',
    f0ContourGuide: '요청형 어조로 ‘주세요’를 상냥하고 정중하게 올렸다가 내립니다 (~)',
    speechRate: 'normal',
    keyWordAssetIds: ['word_life2_kiosk_01'],
    phonologyRules: ['aspiration', 'tensification'],
    sentenceMeaning: {
      ko: '카페에서 테이크아웃 음료를 주문할 때 쓰는 표준 표현',
      zh: '请帮我打包一杯热美式咖啡。',
      en: 'One hot Americano to go, please.',
    },
    seriesId: 'hanup_life_step2',
    chapterId: 'ch_life2_01',
    category: 'life',
  },
};

// =========================================================================
// 3. 담화(Discourse/Dialogue) 에셋 초기 저장소
// =========================================================================
export const SORI_DISCOURSE_REGISTRY: Record<string, SoriDiscourseAsset> = {
  disc_life2_kiosk: {
    id: 'disc_life2_kiosk',
    title: '식당 및 카페 키오스크 주문 & 직원 대화',
    situation: '점심시간 카페에서 포장 여부와 영수증 발급을 확인하는 실전 상황',
    genre: 'service_encounter',
    seriesId: 'hanup_life_step2',
    chapterId: 'ch_life2_01',
    turns: [
      {
        turnIndex: 1,
        speaker: 'A',
        speakerRole: '카페 직원',
        text: '주문 도와드리겠습니다. 드시고 가시나요?',
        targetPronunciation: '[주문 도와드리겓씀니다. 드시고 가시나요?]',
        emotionOrTone: 'polite',
        speechAct: 'greeting',
      },
      {
        turnIndex: 2,
        speaker: 'B',
        speakerRole: '손님 (학습자)',
        text: '아니요, 포장해 갈게요. 아이스 라떼 한 잔 주세요.',
        targetPronunciation: '[아니요, 포장해 갈께요. 아이스 라떼 한 잔 주세요.]',
        emotionOrTone: 'polite',
        speechAct: 'request',
        sentenceAssetRefId: 'sent_life2_01',
      },
      {
        turnIndex: 3,
        speaker: 'A',
        speakerRole: '카페 직원',
        text: '영수증 출력해 드릴까요?',
        targetPronunciation: '[영수증 출려캐 드릴까요?]',
        emotionOrTone: 'polite',
        speechAct: 'inquiry',
      },
      {
        turnIndex: 4,
        speaker: 'B',
        speakerRole: '손님 (학습자)',
        text: '네, 영수증 버려 주세요.',
        targetPronunciation: '[네, 영수증 버려 주세요.]',
        emotionOrTone: 'casual',
        speechAct: 'request',
      },
    ],
  },
};

// =========================================================================
// 4. 소리 에셋 조회 및 헬퍼 서비스 유틸리티
// =========================================================================

/**
 * 챕터 ID로 해당 챕터에 속한 단어 에셋 조회
 */
export function getSoriWordsByChapter(chapterId: string): SoriWordAsset[] {
  return Object.values(SORI_WORD_REGISTRY).filter((w) => w.chapterId === chapterId);
}

/**
 * 챕터 ID로 해당 챕터에 속한 문장 에셋 조회
 */
export function getSoriSentencesByChapter(chapterId: string): SoriSentenceAsset[] {
  return Object.values(SORI_SENTENCE_REGISTRY).filter((s) => s.chapterId === chapterId);
}

/**
 * 챕터 ID로 담화(대화) 에셋 조회
 */
export function getSoriDiscourseByChapter(chapterId: string): SoriDiscourseAsset | undefined {
  return Object.values(SORI_DISCOURSE_REGISTRY).find((d) => d.chapterId === chapterId);
}

/**
 * SoriTutor Iframe 연동 시 전달할 정밀 쿼리 문자열 포맷팅
 */
export function formatSoriTutorUrlParams(
  target: SoriSentenceAsset | SoriWordAsset,
  userId: string,
  userName: string
): string {
  const isSentence = 'targetPronunciation' in target;
  const sentenceText = target.text;
  const targetPronunciation = isSentence ? target.targetPronunciation : target.standardPronunciation;
  const rules = target.phonologyRules.join(',');

  const params = new URLSearchParams({
    sentence: sentenceText,
    pronunciation: targetPronunciation,
    rules: rules,
    userId,
    userName,
    embed: 'true',
  });

  return params.toString();
}

/**
 * SoriTutor (소리튜터) 음운·발음 연동 3계층 에셋 시스템 타입 정의
 * 1. 단어(Word) 레벨: 어휘, 표준 발음, 음운 법칙(비음화, 연음, 겹받침 등), IPA, L1 취약점
 * 2. 문장(Sentence) 레벨: 발음 음절 분절, 억양 곡선(Intonation Contour), 발화 속도
 * 3. 담화(Discourse) 레벨: 화자 교대(Turn-taking) 롤플레이, 상황 맥락(식당, 캠퍼스 등), 화행(Speech Act)
 */

// 음운 변동 규칙 유형 (Phonological Rule Types)
export type PhonologyRuleType =
  | 'liaison'            // 연음 법칙 (예: 옷이 -> [오시])
  | 'nasalization'        // 비음화 (예: 국물 -> [궁물])
  | 'lateralization'      // 유음화 (예: 신라 -> [실라])
  | 'palatalization'      // 구개음화 (예: 같이 -> [가치])
  | 'tensification'       // 경음화 / 된소리되기 (예: 학교 -> [학꾜])
  | 'aspiration'          // 격음화 / 거센소리되기 (예: 축하 -> [추카])
  | 'coda_neutralization' // 음절의 끝소리 규칙 (예: 잎 -> [입])
  | 'cluster_reduction'   // 자음군 단순화 / 겹받침 (예: 닭 -> [닥], 삶 -> [삼])
  | 'h_deletion'          // 'ㅎ' 탈락 (예: 좋아 -> [조아])
  | 'n_insertion';        // 'ㄴ' 첨가 (예: 맨입 -> [맨닙], 급한 일 -> [그판 닐])

// 억양 및 문장 유형 (Intonation Contour)
export type SentenceIntonationType =
  | 'declarative_falling' // 평서문 하강조 (↘)
  | 'question_rising'     // 의문문 상승조 (↗)
  | 'imperative_sharp'    // 명령/권유 단호한 조 (➔↘)
  | 'exclamatory_high'    // 감탄/호격 고음조 (↗↘)
  | 'sustained_polite';   // 정중한 지속조 (~)

// 모국어별 발음 취약 영역 (L1 Phonological Interference)
export type L1VulnerabilityTarget =
  | 'coda_unreleased_stops' // 평폐쇄음 불파음화 미숙 (중국어, 영어권: 받침 파열 오류)
  | 'three_way_stops'       // 평음-경음-격음 3항 대립 (ㄱ-ㄲ-ㅋ, ㅂ-ㅃ-ㅍ)
  | 'liquid_distinction'    // r/l 유음(ㄹ) 음소 구별 (일본어, 중국어권)
  | 'vowel_length_and_height' // ㅓ/ㅗ, ㅡ/ㅓ 모음 변별
  | 'intervocalic_voicing'; // 유성음화 현상

// ==========================================
// 1. 단어(Word Level) 에셋
// ==========================================
export interface SoriWordAsset {
  id: string;                         // e.g. "word_prep_01_01"
  text: string;                       // 표기형 (e.g. "급한 일")
  standardPronunciation: string;      // 표준 발음 (e.g. "[그판 닐]")
  ipa?: string;                       // 국제 음성 기호 (e.g. "/kɯpʰan il/")
  phonologyRules: PhonologyRuleType[]; // 적용된 음운 법칙
  l1Vulnerabilities?: L1VulnerabilityTarget[]; // 취약 모국어 화자 타깃
  targetSyllables: string[];          // 음절별 분절 배열 (e.g. ["급", "한", "일"])
  audioRefUrl?: string;               // 원어민 참조 음성 파일 URL
  meaning: {
    ko: string;
    zh?: string;
    en?: string;
    vi?: string;
  };
  seriesId?: string;                  // 소속 교재 (e.g. "hanup_topik_prep")
  chapterId?: string;                 // 소속 챕터 (e.g. "ch_prep_01")
  difficultyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
}

// ==========================================
// 2. 문장(Sentence Level) 에셋
// ==========================================
export interface SoriSentenceAsset {
  id: string;                         // e.g. "sent_prep_01_01"
  text: string;                       // 정서법 표기 문장
  targetPronunciation: string;        // 실현 발음 표기 (e.g. "[그판 니리 생겨서요]")
  intonationType: SentenceIntonationType;
  f0ContourGuide?: string;            // 피치 궤적 설명 (예: "끝 음절을 완만하게 내립니다 ↘")
  speechRate?: 'slow' | 'normal' | 'fast';
  keyWordAssetIds?: string[];         // 연계된 단어 에셋 ID 배열
  phonologyRules: PhonologyRuleType[];
  audioRefUrl?: string;               // 모범 녹음 음성 URL
  sentenceMeaning?: {
    ko: string;
    zh?: string;
    en?: string;
  };
  seriesId?: string;
  chapterId?: string;
  category: 'topik' | 'life' | 'academic';
}

// ==========================================
// 3. 담화(Discourse/Dialogue Level) 에셋
// ==========================================
export interface SoriDialogueTurn {
  turnIndex: number;
  speaker: 'A' | 'B' | 'C';
  speakerRole: string;                // e.g. "손님", "카페 직원", "교수님", "대학원생"
  text: string;                       // 대화 문장
  targetPronunciation: string;        // 발음 표기
  audioRefUrl?: string;               // 개별 턴 음성
  emotionOrTone: 'polite' | 'formal' | 'casual' | 'urgent' | 'apologetic';
  speechAct: 'request' | 'greeting' | 'inquiry' | 'refusal' | 'clarification' | 'concession';
  sentenceAssetRefId?: string;        // 문장 에셋 참조
}

export interface SoriDiscourseAsset {
  id: string;                         // e.g. "disc_life2_kiosk"
  title: string;                       // e.g. "식당 키오스크 주문 및 직원 응대"
  situation: string;                   // 상황 설명 (e.g. "점심시간 바쁜 카페에서 포장 주문")
  genre: 'casual_dialogue' | 'service_encounter' | 'academic_discussion' | 'presentation';
  turns: SoriDialogueTurn[];
  fullAudioUrl?: string;              // 전체 대화 통음원
  seriesId?: string;
  chapterId?: string;
}

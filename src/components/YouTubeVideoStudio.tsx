'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Sparkles,
  FileText,
  Clock,
  Layers,
  Download,
  Copy,
  Check,
  Globe,
  Film,
  Subtitles,
  Tv,
  CheckCircle2,
  Volume2,
  Share2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Tag,
  ArrowRight,
  Plus,
  Trash2,
  Play,
  FileCode,
  FolderDown,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import {
  AuthoringBlock,
  VideoLectureDuration,
  VideoLectureTone,
  VideoScene,
  VideoSeoKit,
  VideoLectureProject,
} from '../types/hanup';

interface YouTubeVideoStudioProps {
  activeBlock: AuthoringBlock;
  onSaveBlock?: (updated: AuthoringBlock) => void;
}

// 6 Supported Languages
export type SubtitleLang = 'ko' | 'en' | 'ja' | 'zh' | 'vi' | 'my';

const LANG_LABELS: Record<SubtitleLang, { name: string; flag: string; nativeName: string }> = {
  ko: { name: '한국어', flag: '🇰🇷', nativeName: '한국어 (KO)' },
  en: { name: '영어', flag: '🇺🇸', nativeName: 'English (EN)' },
  ja: { name: '일본어', flag: '🇯🇵', nativeName: '日本語 (JA)' },
  zh: { name: '중국어(간체)', flag: '🇨🇳', nativeName: '简体中文 (ZH)' },
  vi: { name: '베트남어', flag: '🇻🇳', nativeName: 'Tiếng Việt (VI)' },
  my: { name: '미얀마어', flag: '🇲🇲', nativeName: 'မြန်မာဘာသာ (MY)' },
};

export const YouTubeVideoStudio: React.FC<YouTubeVideoStudioProps> = ({
  activeBlock,
  onSaveBlock,
}) => {
  // 1. Controls State
  const [durationMode, setDurationMode] = useState<VideoLectureDuration>('micro_3m');
  const [instructorTone, setInstructorTone] = useState<VideoLectureTone>('friendly_tutor');
  const [showLlmPrompt, setShowLlmPrompt] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [activeSeoLang, setActiveSeoLang] = useState<SubtitleLang>('ko');

  // Notice states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Helper to copy text with feedback
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 2. Base Generator Logic for Spoken Script & Storyboard Scenes
  const buildInitialScenes = (
    block: AuthoringBlock,
    duration: VideoLectureDuration,
    tone: VideoLectureTone
  ): VideoScene[] => {
    const isPrep = block.seriesId.includes('prep') || block.blockId.includes('prep');
    const isTopic54 = block.seriesId.includes('writing') || block.title.includes('54') || block.title.includes('사회');

    if (duration === 'short_60s') {
      return [
        {
          sceneId: 'sc_60s_1',
          sceneIndex: 1,
          sceneRole: 'Scene 1: 3초 훅 & 오답 경고 (Opening Hook)',
          startTimeSec: 0,
          endTimeSec: 15,
          timecodeDisplay: '00:00 - 00:15',
          narrationKo:
            tone === 'friendly_tutor'
              ? `안녕하세요 여러분! 한국어 공부할 때 ${isPrep ? "'만나요'만 계속 쓰시나요?" : "'발전이 빠르다'라고 쓰시나요?"} 원어민은 그렇게 말하지 않아요!`
              : `주목! TOPIK 시험에서 ${isPrep ? "'만나요'만 쓰면 기초 탈출 불가!" : "'발전이 빠르다' 쓰면 바로 감점입니다!"} 딱 60초 만에 교정해 드립니다.`,
          subtitleKo: isPrep
            ? '약속 잡을 때 "만나요"만 쓰시나요? ❌ 원어민은 이렇게 말해요!'
            : 'TOPIK 54번 "발전이 빠르다" 쓰면 감점? ❌ 한국인처럼 쓰는 법!',
          bRollType: 'highlighter_3s',
          bRollLabel: '3초 스키밍 형광펜 & 오답 경고 그래픽',
          bRollDescription: '화면 중앙에 붉은색 오답 텍스트 팝업 후 형광펜으로 긋고 ⭕ 정답으로 전환되는 역동적 모션 그래픽',
          sfxCue: '🚨 경고 사이렌 ➔ 띵동 (정답 효과음)',
          multilingualSubtitles: {
            ko: `안녕하세요 여러분! 한국어 공부할 때 아직도 그렇게 쓰시나요? 원어민 표현을 알려드릴게요!`,
            en: `Hello everyone! Are you still using basic expressions? Here is how native Koreans actually say it!`,
            ja: `皆さんこんにちは！まだ教科書通りの表現ばかり使っていませんか？ネイティブの自然な韓国語をお教えします！`,
            zh: `大家好！学韩语的时候你还在生硬直译吗？今天教大家韩国人真正地道的黄金表达！`,
            vi: `Xin chào các bạn! Bạn vẫn đang dùng những biểu hiện tiếng Hàn cơ bản? Hãy học cách người Hàn thực sự nói nhé!`,
            my: `မင်္ဂလာပါ အားလုံးပဲ! ကိုရီးယားစကားပြောတဲ့အခါ အခြေခံစကားလုံးတွေပဲ သုံးနေကြတုန်းလား? အမှန်ကန်ဆုံး အသုံးအနှုန်းကို ပြောပြပေးပါမယ်!`,
          },
        },
        {
          sceneId: 'sc_60s_2',
          sceneIndex: 2,
          sceneRole: 'Scene 2: 핵심 교정 어휘 & 문법 꿀팁 (Core Hack)',
          startTimeSec: 15,
          endTimeSec: 40,
          timecodeDisplay: '00:15 - 00:40',
          narrationKo:
            tone === 'friendly_tutor'
              ? `자, 교재를 볼까요? ${isPrep ? "약속을 미룰 때는 '약속을 미루다' 또는 '급한 일이 생기다'라고 해보세요!" : "'비약적으로 발전하다'라는 고급 어휘를 쓰면 채점관이 깜짝 놀라며 10점을 더 줍니다!"}`
              : `핵심은 이겁니다! ${isPrep ? "약속 변경은 '약속을 미루다', 사유는 '일이 생기다'!" : "'비약적(飛躍的)으로 발전하다'를 서론에 배치하십시오!"} 점수가 수직 상승합니다.`,
          subtitleKo: isPrep
            ? '약속 변경: 약속을 미루다 ⭕ | 사유 설명: 일이 생겨서 ⭕'
            : '핵심 고급 어휘: "비약적으로 발전하다" (飞跃式发展) ⭕',
          bRollType: 'template_54',
          bRollLabel: '54번 서론 템플릿 & 단어 카드 팝업',
          bRollDescription: '3D 양장본 교재에서 튀어나오는 한·중·영 3개 국어 대역 어휘 카드와 템플릿 하이라이트',
          sfxCue: '✨ 반짝이는 매직 효과음 + Lo-Fi 비트',
          multilingualSubtitles: {
            ko: `핵심 어휘를 사용하면 어휘 점수와 표현력이 비약적으로 상승합니다.`,
            en: `Using these advanced academic phrases will instantly boost your TOPIK writing score!`,
            ja: `この重要語彙を使うだけで、表現力と作文の点数が劇的にアップします。`,
            zh: `只要在作文中用上这个高级词汇，你的TOPIK分数就能立刻大幅提升！`,
            vi: `Chỉ cần dùng cụm từ nâng cao này, điểm thi viết TOPIK của bạn sẽ tăng vọt!`,
            my: `ဒီအဆင့်မြင့်စကားလုံးကို သုံးလိုက်တာနဲ့ သင့်ရဲ့ TOPIK အမှတ်တွေ ချက်ချင်းတက်လာမှာပါ!`,
          },
        },
        {
          sceneId: 'sc_60s_3',
          sceneIndex: 3,
          sceneRole: 'Scene 3: 2X 복습 & 소리튜터 아웃트로 (Outro CTA)',
          startTimeSec: 40,
          endTimeSec: 60,
          timecodeDisplay: '00:40 - 01:00',
          narrationKo: `오늘 배운 내용, 한업 앱에서 1:1 AI 첨삭과 소리튜터 발음 진단으로 직접 연습해 보세요. 더보기란 링크를 클릭하세요!`,
          subtitleKo: '한업(HanUp) 앱에서 무료 1:1 AI 첨삭 & 소리튜터 발음 교정받기!',
          bRollType: 'sori_f0_pitch',
          bRollLabel: '소리튜터 F0 피치 곡선 & 앱 다운로드 QR',
          bRollDescription: '원어민 표준 음성과 내 억양이 일치하는 피치 파형 애니메이션과 20% 할인 쿠폰 HANUP20WTP 자막 표출',
          sfxCue: '🎵 경쾌한 아웃트로 시그니처 징글',
          multilingualSubtitles: {
            ko: `한업 앱에서 1:1 AI 첨삭과 소리튜터 발음 진단을 무료로 체험해 보세요!`,
            en: `Try HanUp's 1-on-1 AI essay grading and SoriTutor pronunciation clinic for free!`,
            ja: `HanUpアプリで1対1のAI添削とSoriTutor発音クリニックを無料体験しよう！`,
            zh: `立即前往HanUp平台，免费体验1对1 AI作文精细批改与SoriTutor发音诊断！`,
            vi: `Trải nghiệm sửa bài viết AI 1:1 và luyện phát âm SoriTutor miễn phí trên HanUp ngay!`,
            my: `HanUp အက်ပ်တွင် 1:1 AI စာစီစာကုံးအကဲဖြတ်ခြင်းနှင့် SoriTutor အသံထွက်လေ့ကျင့်ခြင်းကို အခမဲ့ စမ်းသပ်လိုက်ပါ!`,
          },
        },
      ];
    }

    // Standard 3-minute or 8-minute lecture scenes
    return [
      {
        sceneId: 'sc_3m_1',
        sceneIndex: 1,
        sceneRole: 'Scene 1: 오프닝 & 3초 훅 (Opening Hook)',
        startTimeSec: 0,
        endTimeSec: 20,
        timecodeDisplay: '00:00 - 00:20',
        narrationKo:
          tone === 'friendly_tutor'
            ? `안녕하세요 여러분! 한업 한국어의 1:1 스마트 튜터입니다. 오늘은 여러분이 가장 어려워하는 《${block.title}》 핵심을 3분 만에 완전히 정복해 드릴게요!`
            : tone === 'charisma_star'
            ? `주목! TOPIK 시험장에 이것만 알고 들어가도 최소 10점이 올라갑니다! 오늘 주제는 바로 《${block.title}》 만점 공략법입니다.`
            : `차분하게 마주하는 TOPIK 한국어 핵심 강의입니다. 오늘의 단원은 《${block.title}》입니다.`,
        subtitleKo: `[TOPIK 만점 특강] ${block.title} 3분 만에 완벽 정복!`,
        bRollType: 'highlighter_3s',
        bRollLabel: '3초 스키밍 형광펜 & 핵심 질문 그래픽',
        bRollDescription: '교재 타이틀이 3D 공간에서 확대되며, 학습자들이 가장 헷갈려하는 핵심 의문문 텍스트에 형광펜 애니메이션 적용',
        sfxCue: '🔔 밝은 알림음 ➔ 잔잔하고 세련된 Lo-Fi 인트로 BGM',
        multilingualSubtitles: {
          ko: `안녕하세요 여러분! 오늘은 《${block.title}》의 핵심을 가장 쉽고 명쾌하게 정리해 드릴게요.`,
          en: `Hello everyone! Today, we will master the key points of "${block.title}" in the clearest way possible.`,
          ja: `皆さんこんにちは！今日は《${block.title}》の重要ポイントを最も分かりやすく解説します。`,
          zh: `大家好！今天我们将用最清晰生动的方式，带大家彻底搞定《${block.title}》的核心考点。`,
          vi: `Xin chào các bạn! Hôm nay chúng ta sẽ cùng nắm vững trọng tâm bài học "${block.title}" một cách dễ hiểu nhất.`,
          my: `မင်္ဂလာပါ အားလုံးပဲ! ဒီကနေ့မှာတော့ "${block.title}" ရဲ့ အဓိကအချက်တွေကို အလွယ်ကူဆုံး ရှင်းပြပေးပါမယ်။`,
        },
      },
      {
        sceneId: 'sc_3m_2',
        sceneIndex: 2,
        sceneRole: 'Scene 2: 핵심 개념 & 모국어 간섭 주의점 (Core Concept & L1 Interference)',
        startTimeSec: 20,
        endTimeSec: 60,
        timecodeDisplay: '00:20 - 01:00',
        narrationKo:
          tone === 'friendly_tutor'
            ? `교재 본문을 함께 보실까요? 외국인 학습자분들이 모국어 습관 때문에 자주 실수하는 부분이 바로 이 조사와 어휘예요. 직역하지 말고 한국어다운 호응 표현을 써야 합니다.`
            : tone === 'charisma_star'
            ? `채점관은 첫 문장만 봐도 합격인지 압니다. 모국어 직역 표현을 쓰면 바로 감점! 반드시 원어민이 검증한 정격 표현을 사용해야 합니다.`
            : `모국어 간섭으로 인해 발생하는 조사의 오용을 주의 깊게 살피고, 자연스러운 한국어 연어를 익혀야 합니다.`,
        subtitleKo: '모국어 직역 표현 주의! 원어민 채점관이 인정하는 자연스러운 한국어 연어 사용',
        bRollType: 'template_54',
        bRollLabel: '모국어 간섭 vs 정답 표현 대조 카드',
        bRollDescription: '좌측에 어색한 번역투 문장(❌)과 우측에 자연스러운 한국어 정답(⭕)을 좌우 분할 슬라이드로 시각화',
        sfxCue: '❌ 오답 삑 소리 ➔ ✨ 띵동 정답음',
        multilingualSubtitles: {
          ko: `모국어를 그대로 번역하지 말고, 한국어의 자연스러운 문맥에 맞는 연어를 사용해야 합니다.`,
          en: `Avoid literal translations from your native language; always use natural Korean collocations.`,
          ja: `母国語をそのまま直訳せず、韓国語らしい自然なコロケーションを使いましょう。`,
          zh: `千万不要把母语逐字生硬直译，必须使用符合韩语思维的自然搭配与惯用语。`,
          vi: `Đừng dịch từng chữ từ tiếng mẹ đẻ, hãy dùng những kết hợp từ tự nhiên của người Hàn nhé.`,
          my: `မိခင်ဘာသာစကားမှ တိုက်ရိုက်ပြန်ဆိုခြင်းကို ရှောင်ကြဉ်ပြီး သဘာဝကျသော ကိုရီးယားစကားတွဲများကို သုံးပါ။`,
        },
      },
      {
        sceneId: 'sc_3m_3',
        sceneIndex: 3,
        sceneRole: 'Scene 3: 실전 원고지 작성 & 템플릿 적용 (Manuscript Simulation)',
        startTimeSec: 60,
        endTimeSec: 105,
        timecodeDisplay: '01:00 - 01:45',
        narrationKo: `원고지에 실제로 쓸 때는 첫 칸을 반드시 비우고 문단을 시작해야 해요. 문장 끝은 절대로 -습니다 체가 아니라, 논술문 전용 해라체인 -ㄴ/는다로 정확히 닫아주셔야 합니다.`,
        subtitleKo: '원고지 표기법: 문단 첫 칸 비우기 + 문체는 해라체(-ㄴ/는다)로 통일!',
        bRollType: 'manuscript_grid',
        bRollLabel: '20칸 가상 원고지 실시간 작성 애니메이션',
        bRollDescription: '20칸 원고지 격자 위로 만년필이 지나가며 첫 칸 띄어쓰기와 문장부호 올바른 칸 배치를 보여주는 인터랙티브 화면',
        sfxCue: '✍️ 만년필로 원고지 적는 사각사각 ASMR 사운드',
        multilingualSubtitles: {
          ko: `원고지 문단 첫 칸은 비우고, 논술문은 반드시 해라체(-ㄴ/는다)로 일관성 있게 작성하세요.`,
          en: `Leave the first cell blank for new paragraphs, and consistently use the plain form (-ㄴ/는다).`,
          ja: `原稿用紙の段落の最初は1マス空け、文体は必ず「해라体(-ㄴ/는다)」で統一しましょう。`,
          zh: `原稿纸换段时首格必须空出，论述文的文体必须统一使用客观的해라体(-ㄴ/는다)！`,
          vi: `Hãy lùi một ô đầu dòng khi sang đoạn mới và luôn thống nhất đuôi câu trang trọng 해라체(-ㄴ/는다).`,
          my: `စာပိုဒ်အသစ်စတင်ရာတွင် ပထမဆုံးအကွက်ကို ချန်ထားပြီး 해라체(-ㄴ/는다) ဖြင့်သာ အဆုံးသတ်ပါ။`,
        },
      },
      {
        sceneId: 'sc_3m_4',
        sceneIndex: 4,
        sceneRole: 'Scene 4: TOPIK 공인 채점 기준 & 루브릭 감점 방어 (Rubric Score Defense)',
        startTimeSec: 105,
        endTimeSec: 140,
        timecodeDisplay: '01:45 - 02:20',
        narrationKo: `TOPIK 쓰기 시험은 과제 수행, 글의 구조, 그리고 언어 사용 3가지 영역으로 채점됩니다. 철자법과 띄어쓰기 한 번에 1점씩 깎이니, 오늘 배운 어휘 표기를 확실히 기억하세요!`,
        subtitleKo: 'TOPIK II 3대 채점 루브릭: 과제 수행 + 전개 구조 + 언어 사용(어휘·문법 26점 만점)',
        bRollType: 'rubric_scorecard',
        bRollLabel: 'TOPIK II 3영역 공인 채점 기준표 & 배점 게이지',
        bRollDescription: '53번(30점)/54번(50점) 배점 슬라이더와 감점 체크리스트가 화면에 모션 그래픽으로 표출',
        sfxCue: '📊 게이지 상승 효과음 + 찰칵 카메라 셔터음',
        multilingualSubtitles: {
          ko: `TOPIK 쓰기 채점 기준 3영역을 숙지하여 사소한 철자나 띄어쓰기 감점을 완벽히 방어하세요.`,
          en: `Master the 3 official TOPIK writing rubrics to prevent any avoidable point deductions.`,
          ja: `TOPIK作文の3大採点基準を把握し、スペルや分かち書きによる減点を確実に防ぎましょう。`,
          zh: `牢记TOPIK写作的三大官方评分标准，彻底避免错别字与隔写导致的失分！`,
          vi: `Nắm vững 3 tiêu chí chấm điểm TOPIK viết để tránh bị trừ điểm lỗi chính tả và khoảng cách.`,
          my: `TOPIK အရေး အမှတ်ပေးစည်းမျဉ်း ၃ မျိုးကို နားလည်ပြီး သတ်ပုံအမှားကြောင့် အမှတ်လျော့ခြင်းကို ကာကွယ်ပါ။`,
        },
      },
      {
        sceneId: 'sc_3m_5',
        sceneIndex: 5,
        sceneRole: 'Scene 5: 요약 & 2X 복습 보장 / 소리튜터 무료 체험 아웃트로 (Outro CTA)',
        startTimeSec: 140,
        endTimeSec: 175,
        timecodeDisplay: '02:20 - 02:55',
        narrationKo: `오늘 배운 내용을 내 것으로 만드는 법! 한업 플랫폼에서 1:1 맞춤형 AI 첨삭과 소리튜터로 발음까지 완벽하게 교정받아 보세요. 영상 더보기란 링크와 20% 할인 쿠폰을 확인하세요!`,
        subtitleKo: '한업(HanUp) 스마트 러닝 교재 • 2X 복습 보장 & 소리튜터 발음 클리닉 무료 체험!',
        bRollType: 'sori_f0_pitch',
        bRollLabel: '소리튜터 F0 피치 곡선 & 한업 러닝 웹앱 화면',
        bRollDescription: '화면 우측에 실시간 F0 피치 곡선 일치 애니메이션과 함께, 할인 쿠폰 HANUP20WTP 및 QR 코드가 감각적으로 팝업',
        sfxCue: '🎵 경쾌하고 희망찬 Lo-Fi 아웃트로 시그니처 멜로디',
        multilingualSubtitles: {
          ko: `영상 더보기란 링크에서 한업 1:1 AI 첨삭과 소리튜터 발음 진단을 지금 무료로 체험하세요!`,
          en: `Check the link in the description for a free trial of HanUp AI essay grading & SoriTutor!`,
          ja: `概要欄のリンクから、HanUpのAI添削とSoriTutor発音クリニックを今すぐ無料体験！`,
          zh: `点击视频下方简介栏链接，立即免费体验HanUp 1对1 AI作文批改与SoriTutor发音诊断！`,
          vi: `Nhấp vào liên kết dưới phần mô tả để trải nghiệm sửa bài AI 1:1 và luyện phát âm SoriTutor miễn phí!`,
          my: `ဗီဒီယိုအောက်ရှိ လင့်ခ်ကိုနှိပ်၍ HanUp AI အကဲဖြတ်ခြင်းနှင့် SoriTutor ကို အခမဲ့ စမ်းသပ်လိုက်ပါ!`,
        },
      },
    ];
  };

  // Build Multilingual SEO Kits for 6 Languages
  const buildSeoKits = (
    block: AuthoringBlock,
    duration: VideoLectureDuration,
    tone: VideoLectureTone
  ): Record<SubtitleLang, VideoSeoKit> => {
    const isTopic54 = block.seriesId.includes('writing') || block.title.includes('54') || block.title.includes('사회');

    return {
      ko: {
        title: isTopic54
          ? `[TOPIK II 쓰기] 54번 50점 만점 공식! '발전이 빠르다' 쓰면 감점? 한국인처럼 쓰는 비법 | 한업(HanUp)`
          : `[한국어 필수 강의] ${block.title} 3분 만에 끝내는 원어민 실전 회화 & 문법 꿀팁 | 한업(HanUp)`,
        description: `🔥 한국어능력시험(TOPIK) & 실전 한국어 1타 강사의 족집게 강의!\n\n` +
          `본 영상은 도서출판 한업의 《${block.title}》 본문을 바탕으로 제작된 실전 강의입니다.\n` +
          `외국인 유학생이 가장 많이 틀리는 모국어 간섭(L1 interference) 오류를 원천 차단하고,\n` +
          `TOPIK 쓰기 루브릭 만점을 달성하는 구체적인 원고지 작성 비법을 공개합니다!\n\n` +
          `📌 [타임스탬프 챕터 안내]\n` +
          `00:00 3초 만에 끝내는 오프닝 & 훅\n` +
          `00:20 외국인이 가장 많이 틀리는 모국어 직역 표현 교정\n` +
          `01:00 20칸 원고지 첫 칸 비우기 & 해라체(-ㄴ/는다) 서론 템플릿\n` +
          `01:45 TOPIK II 공인 채점 기준 3영역 감점 방어 비법\n` +
          `02:20 한업 2X 복습 보장 & 소리튜터 AI 발음 정밀 클리닉 무료 체험\n\n` +
          `🚀 [한업 1:1 AI 맞춤형 학습 플랫폼 바로가기]\n` +
          `👉 https://hanup.ai/study/${block.seriesId}/${block.chapterId}\n\n` +
          `🎁 [구독자 전용 20% 특별 할인 쿠폰]\n` +
          `결제 시 프로모션 코드 입력: HANUP20WTP\n\n` +
          `🎙️ [원어민 F0 피치 곡선 대조 발음 클리닉: 소리튜터(SoriTutor)]\n` +
          `교재 수강생 전원 해당 단원 발음 교정 무료 무제한 제공!\n\n` +
          `📩 제휴 및 기관 라이선스 문의: ot.helper7@gmail.com\n` +
          `#TOPIK #한국어공부 #TOPIK쓰기 #TOPIK54번 #한업 #HanUp #소리튜터 #LearnKorean`,
        hashtags: ['#TOPIK', '#한국어공부', '#TOPIK쓰기', '#TOPIK54', '#한업', '#HanUp', '#한국어문법'],
        tags: [
          'TOPIK',
          'TOPIK II',
          '한국어능력시험',
          '토픽쓰기',
          '54번작문',
          '한국어공부',
          '외국인을위한한국어',
          '한업',
          'HanUp',
          '소리튜터',
          '한국어과외',
          'Learn Korean',
        ],
      },
      en: {
        title: isTopic54
          ? `[TOPIK II Writing] How to Score 50/50 on Question 54! High-Score Korean Vocab Hacks | HanUp`
          : `[Learn Korean] Master "${block.title}" in 3 Minutes! Real Native Expressions & Grammar | HanUp`,
        description: `🔥 Master Korean with HanUp – The Smart 1-on-1 AI Tutoring Platform!\n\n` +
          `In this video, we cover "${block.title}" and reveal how to stop translating directly from your native language.\n` +
          `Learn the official TOPIK II writing rubric standards and write like an educated native Korean!\n\n` +
          `📌 [Timestamps]\n` +
          `00:00 3-Second Hook & Opening\n` +
          `00:20 Common Mistakes Caused by Literal Translation\n` +
          `01:00 How to Use Korean Manuscript Paper & Plain Form (-ㄴ/는다)\n` +
          `01:45 Defending Your Score: Official TOPIK Rubric Breakdown\n` +
          `02:20 Free AI Essay Grading & SoriTutor Pronunciation Clinic\n\n` +
          `🚀 [Study Online with HanUp AI Tutor]\n` +
          `👉 https://hanup.ai/study/${block.seriesId}/${block.chapterId}\n\n` +
          `🎁 [20% Discount Coupon for Viewers]\n` +
          `Use Promo Code at checkout: HANUP20WTP\n\n` +
          `#LearnKorean #TOPIK #KoreanGrammar #TOPIKWriting #HanUp #KoreanVocabulary`,
        hashtags: ['#LearnKorean', '#TOPIK', '#KoreanGrammar', '#TOPIKWriting', '#HanUp', '#StudyKorean'],
        tags: [
          'Learn Korean',
          'TOPIK II',
          'TOPIK writing',
          'TOPIK 54',
          'Korean grammar',
          'Korean vocabulary',
          'Study in Korea',
          'HanUp',
          'SoriTutor',
          'Korean tutor',
        ],
      },
      ja: {
        title: isTopic54
          ? `[TOPIK II 作文] 54問で50点満点を取る秘訣！減点を防ぐネイティブ表現の法則 | HanUp`
          : `[韓国語レッスン]「${block.title}」を3分で完全攻略！ネイティブが使う自然な表現 | HanUp`,
        description: `🔥 韓国語学習者必見！HanUp 1対1 スマートAIチューター特講！\n\n` +
          `今回は《${block.title}》をテーマに、日本語話者が最も間違えやすい助詞・語彙の落とし穴を徹底解説します。\n` +
          `原稿用紙の正しい書き方と、TOPIK採点官に評価される自然な韓国語論述表現をマスターしましょう！\n\n` +
          `📌 [タイムスタンプ]\n` +
          `00:00 オープニング & 3秒フック\n` +
          `00:20 日本語直訳表現の注意点と自然な連語\n` +
          `01:00 原稿用紙の書き方 & 解という体(-ㄴ/는다)の統一ルール\n` +
          `01:45 TOPIK II 公式採点基準による減点防止テクニック\n` +
          `02:20 HanUp 2倍復習保証 & SoriTutor発音クリニック無料体験\n\n` +
          `🚀 [HanUp AI学習プラットフォーム]\n` +
          `👉 https://hanup.ai/study/${block.seriesId}/${block.chapterId}\n\n` +
          `🎁 [視聴者限定20%割引クーポン]: HANUP20WTP\n\n` +
          `#韓国語勉強 #TOPIK #韓国語能力試験 #TOPIK作文 #HanUp #韓国語文法`,
        hashtags: ['#韓国語勉強', '#TOPIK', '#韓国語能力試験', '#TOPIK作文', '#HanUp', '#韓国語講座'],
        tags: [
          '韓国語勉強',
          'TOPIK II',
          'TOPIK作文',
          '韓国語能力試験',
          '韓国語文法',
          '原稿用紙書き方',
          'HanUp',
          'SoriTutor',
          '韓国語独学',
        ],
      },
      zh: {
        title: isTopic54
          ? `[TOPIK 54题写作] 5分钟拿到50分满分！中国学生最常踩的3大中式表达纠正 | 韩升 HanUp`
          : `[TOPIK核心考点] 3分钟搞定《${block.title}》！韩国人真正地道的黄金表达 | 韩升 HanUp`,
        description: `🔥 韩国名校名师亲授！韩升(HanUp) 1对1 AI智能韩语学习系统！\n\n` +
          `本期视频基于韩升出版教材《${block.title}》深入剖析中国留学生最常见的中式思维直译错误，\n` +
          `带你彻底掌握原稿纸规范书写与TOPIK II大作文50分满分采分点！\n\n` +
          `📌 [时间轴速览]\n` +
          `00:00 3秒吸睛开篇\n` +
          `00:20 中国学生最常错的中式表达与地道韩语替换\n` +
          `01:00 原稿纸首格空行规范与해라체论述文体统一\n` +
          `01:45 官方三大评分标准：任务完成度+结构+词汇语法\n` +
          `02:20 韩升2倍复习保障与SoriTutor发音诊断免费体验\n\n` +
          `🚀 [韩升平台在线学习通道]\n` +
          `👉 https://hanup.ai/study/${block.seriesId}/${block.chapterId}\n\n` +
          `🎁 [视频专属8折优惠码]: HANUP20WTP\n\n` +
          `#TOPIK #韩语学习 #TOPIK写作 #TOPIK54题 #韩升 #HanUp #韩国留学`,
        hashtags: ['#TOPIK', '#韩语学习', '#TOPIK写作', '#TOPIK54题', '#韩升', '#HanUp', '#韩国留学'],
        tags: [
          'TOPIK',
          'TOPIK II',
          '韩语能力考试',
          'TOPIK写作',
          '54题大作文',
          '韩语学习',
          '韩国留学',
          '韩升',
          'HanUp',
          'SoriTutor',
          '韩语语法',
        ],
      },
      vi: {
        title: isTopic54
          ? `[TOPIK II Viết] Bí quyết đạt điểm tuyệt đối 50/50 câu 54! Tránh các lỗi người Việt hay gặp | HanUp`
          : `[Học tiếng Hàn] Chinh phục "${block.title}" chỉ trong 3 phút! Mẹo ngữ pháp & cách dùng từ chuẩn Hàn | HanUp`,
        description: `🔥 Học tiếng Hàn thông minh cùng HanUp – Nền tảng gia sư AI 1:1 hàng đầu!\n\n` +
          `Trong video này, chúng ta sẽ cùng phân tích bài học "${block.title}" và loại bỏ hoàn toàn các lỗi dịch thô theo thói quen tiếng Việt.\n` +
          `Nắm vững quy tắc viết giấy kẻ ô và tiêu chí chấm điểm chính thức của kỳ thi TOPIK II!\n\n` +
          `📌 [Mục lục video]\n` +
          `00:00 Mở đầu hấp dẫn 3 giây\n` +
          `00:20 Sửa lỗi dịch trực tiếp người Việt hay mắc phải\n` +
          `01:00 Quy tắc viết giấy Won-go-ji & đuôi câu 해라체(-ㄴ/는다)\n` +
          `01:45 Bí quyết giữ trọn điểm theo 3 tiêu chí chấm điểm TOPIK\n` +
          `02:20 Trải nghiệm sửa bài viết AI 1:1 & chỉnh phát âm SoriTutor miễn phí\n\n` +
          `🚀 [Truy cập nền tảng học thông minh HanUp]\n` +
          `👉 https://hanup.ai/study/${block.seriesId}/${block.chapterId}\n\n` +
          `🎁 [Mã giảm giá 20% độc quyền]: HANUP20WTP\n\n` +
          `#HocTiengHan #TOPIK #TOPIKViet #HanUp #TiengHanDuHoc`,
        hashtags: ['#HocTiengHan', '#TOPIK', '#TOPIKViet', '#HanUp', '#TiengHanMoiNgay'],
        tags: [
          'Học tiếng Hàn',
          'TOPIK II',
          'TOPIK viết',
          'Câu 54 TOPIK',
          'Ngữ pháp tiếng Hàn',
          'Du học Hàn Quốc',
          'HanUp',
          'SoriTutor',
        ],
      },
      my: {
        title: isTopic54
          ? `[TOPIK II အရေး] မေးခွန်း ၅၄ တွင် အမှတ်ပြည့် ၅၀ ရရှိစေမည့် လျှို့ဝှက်ချက်! | HanUp`
          : `[ကိုရီးယားစာလေ့လာရန်] "${block.title}" ကို ၃ မိနစ်အတွင်း လွယ်ကူစွာ နားလည်နိုင်မည့် လျှို့ဝှက်ချက် | HanUp`,
        description: `🔥 HanUp 1:1 AI စမတ်ပညာရေးပလက်ဖောင်းဖြင့် ကိုရီးယားဘာသာစကားကို အောင်မြင်စွာ လေ့လာလိုက်ပါ!\n\n` +
          `ဒီဗီဒီယိုမှာတော့ "${block.title}" ကို အခြေခံပြီး မြန်မာကျောင်းသားများ အမှားများတတ်သည့် အသုံးအနှုန်းများကို ပြုပြင်ပေးထားပါသည်။\n` +
          `TOPIK II စာစီစာကုံး ရေးသားနည်းနှင့် စာစစ်သူများ သဘောကျမည့် စည်းမျဉ်းများကို လေ့လာလိုက်ကြစို့!\n\n` +
          `📌 [အချိန်ဇယား]\n` +
          `00:00 အဖွင့် ၃ စက္ကန့်\n` +
          `00:20 တိုက်ရိုက်ဘာသာပြန်ခြင်းကြောင့် မှားတတ်သော အသုံးအနှုန်းများ\n` +
          `01:00 원고지 စာရွက်ပေါ်တွင် စနစ်တကျ ရေးသားနည်း\n` +
          `01:45 TOPIK II အမှတ်ပေးစည်းမျဉ်း ၃ မျိုး\n` +
          `02:20 HanUp 2X ပြန်လည်လေ့လာခွင့် & SoriTutor အခမဲ့ စမ်းသပ်ခြင်း\n\n` +
          `🚀 [HanUp AI ပလက်ဖောင်း လင့်ခ်]\n` +
          `👉 https://hanup.ai/study/${block.seriesId}/${block.chapterId}\n\n` +
          `🎁 [၂၀% လျှော့စျေး ပရိုမိုးရှင်းကုဒ်]: HANUP20WTP\n\n` +
          `#ကိုရီးယားစာ #TOPIK #HanUp #KoreanLanguage #SoriTutor`,
        hashtags: ['#ကိုရီးယားစာ', '#TOPIK', '#HanUp', '#LearnKorean'],
        tags: [
          'ကိုရီးယားစာ',
          'TOPIK II',
          'TOPIK အရေး',
          'ကိုရီးယားသဒ္ဒါ',
          'HanUp',
          'SoriTutor',
          'ကိုရီးယားပညာသင်',
        ],
      },
    };
  };

  // 3. Initialize Project State
  const [scenes, setScenes] = useState<VideoScene[]>(() => {
    if (activeBlock.videoLectureProject?.scenes?.length) {
      return activeBlock.videoLectureProject.scenes;
    }
    return buildInitialScenes(activeBlock, durationMode, instructorTone);
  });

  const [spokenScript, setSpokenScript] = useState<string>(() => {
    if (activeBlock.videoLectureProject?.spokenScript) {
      return activeBlock.videoLectureProject.spokenScript;
    }
    return scenes.map((s) => `[${s.sceneRole}]\n${s.narrationKo}`).join('\n\n');
  });

  const [seoKits, setSeoKits] = useState<Record<SubtitleLang, VideoSeoKit>>(() => {
    if (activeBlock.videoLectureProject?.seoKits) {
      return activeBlock.videoLectureProject.seoKits;
    }
    return buildSeoKits(activeBlock, durationMode, instructorTone);
  });

  // Re-sync when activeBlock changes
  useEffect(() => {
    if (activeBlock.videoLectureProject) {
      setDurationMode(activeBlock.videoLectureProject.durationMode);
      setInstructorTone(activeBlock.videoLectureProject.instructorTone);
      setSpokenScript(activeBlock.videoLectureProject.spokenScript);
      setScenes(activeBlock.videoLectureProject.scenes);
      setSeoKits(activeBlock.videoLectureProject.seoKits);
    } else {
      const initScenes = buildInitialScenes(activeBlock, durationMode, instructorTone);
      setScenes(initScenes);
      setSpokenScript(initScenes.map((s) => `[${s.sceneRole}]\n${s.narrationKo}`).join('\n\n'));
      setSeoKits(buildSeoKits(activeBlock, durationMode, instructorTone));
    }
  }, [activeBlock.blockId]);

  // 4. Action: Regenerate Spoken Script & Storyboard Scenes via AI
  const handleRegenerateScriptAndScenes = () => {
    setIsConverting(true);
    setTimeout(() => {
      const newScenes = buildInitialScenes(activeBlock, durationMode, instructorTone);
      const newScript = newScenes.map((s) => `[${s.sceneRole}]\n${s.narrationKo}`).join('\n\n');
      const newSeoKits = buildSeoKits(activeBlock, durationMode, instructorTone);

      setScenes(newScenes);
      setSpokenScript(newScript);
      setSeoKits(newSeoKits);
      setIsConverting(false);

      // Auto update activeBlock
      if (onSaveBlock) {
        onSaveBlock({
          ...activeBlock,
          videoLectureProject: {
            blockId: activeBlock.blockId,
            durationMode,
            instructorTone,
            spokenScript: newScript,
            scenes: newScenes,
            seoKits: newSeoKits,
            updatedAt: new Date().toISOString(),
          },
        });
      }
    }, 700);
  };

  // Helper to format SRT timecode: 00:00:15,000
  const formatSrtTimecode = (totalSec: number): string => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = Math.floor(totalSec % 60);
    const ms = Math.floor((totalSec % 1) * 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  };

  // Helper to format WebVTT timecode: 00:00.000 or 00:00:00.000
  const formatVttTimecode = (totalSec: number): string => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = Math.floor(totalSec % 60);
    const ms = Math.floor((totalSec % 1) * 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  };

  // 5. Generate RFC-standard .srt subtitle file content
  const generateSrtContent = (lang: SubtitleLang): string => {
    return scenes
      .map((scene, idx) => {
        const start = formatSrtTimecode(scene.startTimeSec);
        const end = formatSrtTimecode(scene.endTimeSec);
        const line = scene.multilingualSubtitles?.[lang] || scene.subtitleKo;
        return `${idx + 1}\n${start} --> ${end}\n${line}\n`;
      })
      .join('\n');
  };

  // Generate RFC-standard .vtt subtitle file content
  const generateVttContent = (lang: SubtitleLang): string => {
    const body = scenes
      .map((scene, idx) => {
        const start = formatVttTimecode(scene.startTimeSec);
        const end = formatVttTimecode(scene.endTimeSec);
        const line = scene.multilingualSubtitles?.[lang] || scene.subtitleKo;
        return `${idx + 1}\n${start} --> ${end}\n${line}\n`;
      })
      .join('\n');
    return `WEBVTT - HanUp Lecture Subtitles [${lang.toUpperCase()}]\n\n${body}`;
  };

  // Trigger File Download
  const downloadSubtitleFile = (format: 'srt' | 'vtt', lang: SubtitleLang) => {
    const content = format === 'srt' ? generateSrtContent(lang) : generateVttContent(lang);
    const mime = format === 'srt' ? 'text/plain;charset=utf-8' : 'text/vtt;charset=utf-8';
    const blob = new Blob(['\uFEFF' + content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hanup_lecture_${activeBlock.blockId}_${lang}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadNotice(`${LANG_LABELS[lang].flag} ${LANG_LABELS[lang].name} .${format.toUpperCase()} 자막 파일이 성공적으로 다운로드되었습니다.`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  // Batch download all 6 languages SRT files
  const downloadAllSrtBatch = () => {
    const langs: SubtitleLang[] = ['ko', 'en', 'ja', 'zh', 'vi', 'my'];
    langs.forEach((l, index) => {
      setTimeout(() => {
        downloadSubtitleFile('srt', l);
      }, index * 250);
    });
    setDownloadNotice('📦 6개 국어 전체 SRT 자막 파일이 일괄 다운로드되었습니다.');
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  // Total Lecture Runtime Calculation
  const totalRuntimeSec = scenes.length ? scenes[scenes.length - 1].endTimeSec : 0;
  const runtimeMins = Math.floor(totalRuntimeSec / 60);
  const runtimeRemSec = totalRuntimeSec % 60;
  const scriptCharCount = spokenScript.replace(/\s+/g, '').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-red-950 via-rose-950 to-slate-900 rounded-3xl border border-rose-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-rose-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-rose-200 text-[11px] font-black uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5 text-rose-300" />
              <span>YouTube & Short-form OSMU Video Studio (Lv.4)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>🎥 유튜브/숏폼 강의 비디오 제작소</span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-rose-600 text-white font-bold">
                Chapter: {activeBlock.title}
              </span>
            </h2>
            <p className="text-xs text-rose-100/80 max-w-2xl leading-relaxed">
              교재의 문어체 본문을 <strong>유튜버 1타 강사 구어체 대본</strong>으로 자동 변환하고, 컷(Scene) 분할 스토리보드와 시각 자료(B-Roll) 매핑, <strong>6개 국어 SRT/VTT 자막 &amp; 유튜브 SEO 키트</strong>를 원클릭으로 추출합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isConverting}
              onClick={handleRegenerateScriptAndScenes}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isConverting ? 'AI 대본 & 씬 생성 중...' : '⚡ AI 전체 파이프라인 가동'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill Bar */}
        <div className="mt-4 pt-4 border-t border-rose-500/20 flex flex-wrap items-center gap-4 text-xs text-rose-200">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-300" />
            <span>총 예상 런타임: <strong>{runtimeMins}분 {runtimeRemSec}초</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-300" />
            <span>분할 컷 수: <strong>{scenes.length}개 Scene</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-rose-300" />
            <span>구어체 대본 글자수: <strong>{scriptCharCount}자</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-rose-300" />
            <span>글로벌 자막 지원: <strong>6개 국어 (KO/EN/JA/ZH/VI/MY)</strong></span>
          </div>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadNotice(null)}
            className="text-emerald-500 hover:text-emerald-700 text-xs"
          >
            닫기
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. 강의형 구어체 대본 변환기 (Spoken Script Converter) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-rose-600 uppercase tracking-wider mb-0.5">
              <span>Step 1</span>
              <span>•</span>
              <span>Spoken Lecture Script Converter</span>
            </div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Film className="w-4 h-4 text-rose-600" />
              <span>강의형 구어체 대본 변환기 (유튜버 / 1타 강사 페르소나)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              교재의 딱딱한 문어체 원고를 카메라 앞에서 직접 말하듯 친근하고 흡입력 있는 구어체 대본으로 실시간 변환합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLlmPrompt((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-600" />
              <span>{showLlmPrompt ? 'LLM 프롬프트 접기' : 'LLM 프롬프트 보기'}</span>
              {showLlmPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleCopy(spokenScript, 'spokenScript')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedKey === 'spokenScript' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>대본 전체 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Control Presets: Duration & Instructor Tone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 text-xs">
          {/* Duration Mode */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>영상 포맷 &amp; 목표 재생 길이:</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-center font-bold">
              {[
                { id: 'short_60s', label: '⚡ 60초 숏폼/릴스', desc: '쇼츠·틱톡 최적화' },
                { id: 'micro_3m', label: '⏱️ 3분 핵심 특강', desc: '핵심 개념 1개 완성' },
                { id: 'in_depth_8m', label: '🎬 8분 실전 해설', desc: '심화 첨삭 &amp; 예시' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDurationMode(item.id as any)}
                  className={`py-2 px-1 rounded-lg transition-all ${
                    durationMode === item.id
                      ? 'bg-rose-600 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[11px]">{item.label}</div>
                  <div className={`text-[9px] mt-0.5 ${durationMode === item.id ? 'text-rose-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Instructor Persona Tone */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-700 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-rose-600" />
              <span>강사 페르소나 &amp; 어조(Tone):</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-center font-bold">
              {[
                { id: 'friendly_tutor', label: '😊 친근한 1:1 과외', desc: '"안녕하세요 여러분~"' },
                { id: 'charisma_star', label: '⚡ 카리스마 1타 강사', desc: '"이것만 알면 만점!"' },
                { id: 'calm_shadowing', label: '🎧 차분한 쉐도잉', desc: '정확한 발음 낭독' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setInstructorTone(item.id as any)}
                  className={`py-2 px-1 rounded-lg transition-all ${
                    instructorTone === item.id
                      ? 'bg-slate-900 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[11px]">{item.label}</div>
                  <div className={`text-[9px] mt-0.5 ${instructorTone === item.id ? 'text-slate-300' : 'text-slate-400'}`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible LLM System Prompt Box */}
        {showLlmPrompt && (
          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-purple-900 font-extrabold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>LLM 구어체 대본 변환 시스템 프롬프트 (System Prompt Spec):</span>
              </span>
              <span className="text-[10px] text-purple-600 bg-white px-2 py-0.5 rounded border border-purple-200">
                Temperature: 0.7 • YouTube Pedagogical Persona
              </span>
            </div>
            <pre className="text-[11px] font-mono text-purple-950 bg-white p-3.5 rounded-xl border border-purple-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`[ROLE: 한국어 교육 전문 유튜브 크리에이터 & TOPIK 1타 강사]
당신은 다국적 한국어 학습자(중국, 베트남, 영어권 등)를 대상으로 유튜브 및 숏폼 강의를 진행하는 최고의 한국어 스타 강사입니다.
제공된 교재의 딱딱한 문어체 텍스트(개념, 어휘, 문법, 루브릭)를 바탕으로, 시청자가 마치 1:1 과외를 받듯 몰입할 수 있는 생생한 '강의형 구어체 대본'으로 재창작하십시오.

[필수 요구사항]
1. 인트로 3초 훅: 시청자가 이탈하지 않도록 흔히 저지르는 오답 질문으로 시작할 것 ("혹시 아직도 ~라고 쓰시나요?")
2. 말투와 어조: 지정된 페르소나(${instructorTone})에 맞춰 친근하고 리듬감 있는 대화체 사용 ("여기서 주의할 점은요!", "원어민은 절대로 이렇게 안 씁니다!")
3. 모국어 간섭(L1 interference) 해설: 교재의 중국어/다국어 간섭 노트를 반영하여 직역 실수를 짚어줄 것.
4. 원고지 표기법 및 루브릭 팁: 문단 첫 칸 비우기와 해라체(-ㄴ/는다) 종결법을 시각적 연출과 함께 설명할 것.
5. 아웃트로 CTA: 한업 플랫폼의 2X 복습 보장 및 소리튜터 발음 클리닉 무료 체험 안내를 자연스럽게 유도할 것.`}
            </pre>
          </div>
        )}

        {/* Spoken Script Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-extrabold text-slate-800">
              생성된 강의형 구어체 대본 (실시간 편집 가능):
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              글자 수: <strong>{spokenScript.length}</strong>자 • 예상 낭독 시간: 약 {Math.ceil(spokenScript.length / 5)}초
            </span>
          </div>
          <textarea
            rows={7}
            value={spokenScript}
            onChange={(e) => setSpokenScript(e.target.value)}
            placeholder="AI가 변환한 구어체 대본이 여기에 표출됩니다. 직접 문구를 수정하실 수 있습니다."
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans shadow-inner"
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. 컷(Scene) 분할 및 시각 자료(B-Roll) 매핑 (Storyboard) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 uppercase tracking-wider mb-0.5">
              <span>Step 2</span>
              <span>•</span>
              <span>Scene Breakdown &amp; B-Roll Storyboard</span>
            </div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>컷(Scene) 분할 및 시각 자료(B-Roll) 매핑 스토리보드</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              대본 흐름에 맞춰 영상 편집자가 즉시 제작할 수 있도록 화면 자막, 시각 연출 자료(B-Roll), 오디오 효과음을 Scene 단위로 정렬합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const nextIdx = scenes.length + 1;
              const lastEnd = scenes.length ? scenes[scenes.length - 1].endTimeSec : 0;
              const newScene: VideoScene = {
                sceneId: `sc_custom_${Date.now()}`,
                sceneIndex: nextIdx,
                sceneRole: `Scene ${nextIdx}: 추가 심화 팁 (Extra Tip)`,
                startTimeSec: lastEnd,
                endTimeSec: lastEnd + 25,
                timecodeDisplay: `${formatVttTimecode(lastEnd).slice(3, 8)} - ${formatVttTimecode(lastEnd + 25).slice(3, 8)}`,
                narrationKo: '추가로 알아두면 유용한 실전 팁입니다.',
                subtitleKo: '핵심 실전 팁 요약',
                bRollType: 'template_54',
                bRollLabel: '핵심 요약 카드 팝업',
                bRollDescription: '화면 중앙에 요약 포인트 카드 노출',
                sfxCue: '✨ 띵동 (효과음)',
                multilingualSubtitles: {
                  ko: '추가로 알아두면 유용한 실전 팁입니다.',
                  en: 'Here is an extra practical tip you should know.',
                  ja: 'さらに知っておくと役立つ実戦テクニックです。',
                  zh: '这里还有一个非常实用的进阶备考技巧。',
                  vi: 'Đây là mẹo thực tế cực kỳ hữu ích bạn nên biết.',
                  my: 'ထပ်မံသိရှိထားသင့်သော အသုံးဝင်သည့် လျှို့ဝှက်ချက်ဖြစ်ပါသည်။',
                },
              };
              setScenes([...scenes, newScene]);
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ 컷(Scene) 추가</span>
          </button>
        </div>

        {/* Storyboard Grid Cards */}
        <div className="space-y-4">
          {scenes.map((scene, idx) => (
            <div
              key={scene.sceneId}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs space-y-4"
            >
              {/* Scene Card Top Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {scene.sceneIndex}
                  </span>
                  <div>
                    <span className="text-xs font-black text-slate-900">{scene.sceneRole}</span>
                    <span className="text-[11px] text-blue-600 font-mono font-bold ml-2">
                      ⏱️ {scene.timecodeDisplay} ({scene.endTimeSec - scene.startTimeSec}초)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                    SFX: {scene.sfxCue}
                  </span>
                  <button
                    type="button"
                    onClick={() => setScenes(scenes.filter((s) => s.sceneId !== scene.sceneId))}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="해당 씬 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2-Column Content: Left (Script & Subtitle) vs Right (Visual B-Roll Mockup) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Narration & Subtitle (7 cols) */}
                <div className="lg:col-span-7 space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>강사 음성 대본 (Voiceover / Narration):</span>
                    </label>
                    <textarea
                      rows={3}
                      value={scene.narrationKo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setScenes(
                          scenes.map((s) => (s.sceneId === scene.sceneId ? { ...s, narrationKo: val } : s))
                        );
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Subtitles className="w-3.5 h-3.5 text-blue-600" />
                      <span>화면 하단 표출 자막 (On-Screen Subtitle):</span>
                    </label>
                    <input
                      type="text"
                      value={scene.subtitleKo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setScenes(
                          scenes.map((s) => (s.sceneId === scene.sceneId ? { ...s, subtitleKo: val } : s))
                        );
                      }}
                      className="w-full p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 text-blue-950 font-bold text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>

                {/* Right: Visual B-Roll Mockup & Direction (5 cols) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-slate-100/80 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-indigo-950 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-indigo-600" />
                      <span>시각 자료 (B-Roll) 매핑:</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                      {scene.bRollType}
                    </span>
                  </div>

                  {/* Visual Preview Graphic Box */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>{scene.bRollLabel}</span>
                    </div>

                    {/* Dynamic Graphic Simulation */}
                    {scene.bRollType === 'highlighter_3s' && (
                      <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-center text-xs">
                        <span className="line-through text-slate-400 mr-2">발전이 빠르다 ❌</span>
                        <span className="bg-amber-300 font-black text-slate-900 px-1.5 py-0.5 rounded">
                          비약적으로 발전하다 ⭕
                        </span>
                      </div>
                    )}

                    {scene.bRollType === 'template_54' && (
                      <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold">
                        <div className="p-1 rounded bg-blue-50 border border-blue-200 text-blue-700">[서론] 현황</div>
                        <div className="p-1 rounded bg-purple-50 border border-purple-200 text-purple-700">[본론] 원인</div>
                        <div className="p-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">[결론] 대책</div>
                      </div>
                    )}

                    {scene.bRollType === 'manuscript_grid' && (
                      <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-200 font-mono text-[10px] text-slate-700 tracking-widest text-center">
                        <span className="text-rose-600 font-black">□</span>[현][대][ ][사][회][에][서]...
                      </div>
                    )}

                    {scene.bRollType === 'rubric_scorecard' && (
                      <div className="flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded-lg font-bold">
                        <span className="text-slate-600">언어 사용 루브릭:</span>
                        <span className="text-indigo-700 font-black">26점 / 26점 만점 ⭐</span>
                      </div>
                    )}

                    {scene.bRollType === 'sori_f0_pitch' && (
                      <div className="p-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-800 font-bold">소리튜터 F0 피치 일치율:</span>
                        <span className="font-black text-emerald-700">96% (정확) 📈</span>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-500 leading-normal pt-1 border-t border-slate-100">
                      <strong>연출 지침:</strong> {scene.bRollDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. 유튜브 글로벌 SEO용 다국어 자막(SRT/VTT) 자동 추출 & YouTube Studio 키트 */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-wider mb-0.5">
              <span>Step 3</span>
              <span>•</span>
              <span>Global Multilingual Subtitles (SRT/VTT) &amp; YouTube SEO</span>
            </div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>유튜브 글로벌 SEO용 다국어 자막(SRT/VTT) 추출 &amp; YouTube Studio 키트</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              유튜브 스튜디오에 즉시 업로드 가능한 <strong>6개 국어 자막 파일(.srt / .vtt)</strong>과 클릭률(CTR)을 극대화하는 언어별 <strong>제목·설명란·해시태그 메타데이터</strong>를 원클릭으로 추출합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={downloadAllSrtBatch}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <FolderDown className="w-4 h-4 text-amber-300" />
              <span>📦 6개 국어 전체 SRT 일괄 다운로드</span>
            </button>
          </div>
        </div>

        {/* 6 Languages Switcher Tab Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold">
          {(['ko', 'en', 'ja', 'zh', 'vi', 'my'] as SubtitleLang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActiveSeoLang(l)}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeSeoLang === l
                  ? 'bg-white text-slate-900 shadow-sm font-black ring-2 ring-emerald-500/30'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span className="text-base">{LANG_LABELS[l].flag}</span>
              <span>{LANG_LABELS[l].nativeName}</span>
            </button>
          ))}
        </div>

        {/* Download Buttons for Currently Selected Language */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <span className="text-base">{LANG_LABELS[activeSeoLang].flag}</span>
            <span>현재 선택 언어: <strong>{LANG_LABELS[activeSeoLang].name} ({activeSeoLang.toUpperCase()})</strong> 자막 파일 다운로드</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadSubtitleFile('srt', activeSeoLang)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>.{activeSeoLang.toUpperCase()}.SRT 다운로드</span>
            </button>
            <button
              type="button"
              onClick={() => downloadSubtitleFile('vtt', activeSeoLang)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>.{activeSeoLang.toUpperCase()}.VTT 다운로드</span>
            </button>
          </div>
        </div>

        {/* YouTube Studio SEO Package: Title, Description, Tags */}
        {(() => {
          const currentKit = seoKits[activeSeoLang] || seoKits.ko;
          const fullPackageText = `[TITLE]\n${currentKit.title}\n\n[DESCRIPTION]\n${currentKit.description}\n\n[TAGS]\n${currentKit.tags.join(', ')}\n\n[HASHTAGS]\n${currentKit.hashtags.join(' ')}`;

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Left Column: Subtitle SRT Raw Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Subtitles className="w-4 h-4 text-emerald-600" />
                    <span>.{activeSeoLang.toUpperCase()}.SRT 자막 파일 내용 미리보기</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generateSrtContent(activeSeoLang), `srt_${activeSeoLang}`)}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    {copiedKey === `srt_${activeSeoLang}` ? '복사됨!' : 'SRT 텍스트 복사'}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed h-80 overflow-y-auto border border-slate-800 shadow-inner select-all">
                  {generateSrtContent(activeSeoLang)}
                </pre>
              </div>

              {/* Right Column: YouTube Studio Title, Description & Tags (7 cols) */}
              <div className="lg:col-span-7 space-y-4 text-xs">
                {/* 1. Video Title */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span>📌</span>
                      <span>유튜브 영상 제목 (YouTube Video Title):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentKit.title, 'seo_title')}
                      className="text-blue-600 font-bold hover:underline text-[11px]"
                    >
                      {copiedKey === 'seo_title' ? '제목 복사됨!' : '제목 복사'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={currentKit.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSeoKits({
                        ...seoKits,
                        [activeSeoLang]: { ...currentKit, title: val },
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-extrabold text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs font-sans"
                  />
                </div>

                {/* 2. Video Description with Chapters */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span>📝</span>
                      <span>유튜브 설명란 템플릿 (Description with Timestamps):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentKit.description, 'seo_desc')}
                      className="text-blue-600 font-bold hover:underline text-[11px]"
                    >
                      {copiedKey === 'seo_desc' ? '설명란 복사됨!' : '설명란 복사'}
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={currentKit.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSeoKits({
                        ...seoKits,
                        [activeSeoLang]: { ...currentKit, description: val },
                      });
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[11px] leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs font-sans"
                  />
                </div>

                {/* 3. Tags & Hashtags */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span>🏷️</span>
                      <span>검색 최적화 태그 및 해시태그 (SEO Tags):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentKit.tags.join(', '), 'seo_tags')}
                      className="text-blue-600 font-bold hover:underline text-[11px]"
                    >
                      {copiedKey === 'seo_tags' ? '태그 복사됨!' : '태그 복사'}
                    </button>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 select-all leading-relaxed">
                    {currentKit.tags.join(', ')}
                  </div>
                </div>

                {/* Master One-Click Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(fullPackageText, 'full_package')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {copiedKey === 'full_package' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">
                        {LANG_LABELS[activeSeoLang].name} 유튜브 스튜디오 패키지 전체 복사 완료!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-blue-300" />
                      <span>
                        ✨ {LANG_LABELS[activeSeoLang].name} 유튜브 스튜디오 패키지 원클릭 전체 복사 (제목+설명+태그)
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

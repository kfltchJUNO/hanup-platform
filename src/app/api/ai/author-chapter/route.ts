import { NextRequest, NextResponse } from 'next/server';

export interface AuthorChapterRequest {
  seriesId: string;
  seriesTitle: string;
  chapterId: string;
  chapterTitle: string;
  templateType: 'dialogue_conversation' | 'topik_reading_grammar' | 'academic_essay_writing';
  topicSituation: string;
  grammarPoints: string[];
  vocabPoints: string[];
  soriFocus: string;
  l1Focus: string;
  targetLevel: string;
}

function buildStructuredFallback(req: AuthorChapterRequest) {
  const g1 = req.grammarPoints[0] || '-아/어서';
  const g2 = req.grammarPoints[1] || '-(으)니까';
  const v1 = req.vocabPoints[0] || '핵심 표현 1';
  const v2 = req.vocabPoints[1] || '핵심 표현 2';
  const v3 = req.vocabPoints[2] || '핵심 표현 3';
  const sori = req.soriFocus || `${v1} 표현을 사용하여 자연스럽게 말해 보세요.`;
  const topic = req.topicSituation || req.chapterTitle;

  let koContent = '';
  let structureGuide = '';
  let modelAnswer = '';
  let targetChars: [number, number] = [200, 300];

  if (req.templateType === 'dialogue_conversation') {
    koContent = `【상황 도입: ${topic}】
본 단원에서는 '${topic}' 상황에서 필수적으로 사용되는 목표 문법 [${g1}], [${g2}]와 핵심 어휘(${req.vocabPoints.join(', ')})를 실제 대화 맥락 속에서 익힙니다.

[실전 대화문]
민수: 저기요, 오늘 [${topic}] 관련해서 여쭤볼 게 있는데요.
수진: 네, 어떤 일 때문에 그러시나요? 혹시 ${v1} 문제가 생기셨나요?
민수: 네, 맞아요. 급하게 처리해야 하는데 ${g1} 어떻게 해야 할지 몰라서요.
수진: 아, 그러셨군요! 걱정하지 마세요. 먼저 ${v2} 절차를 확인한 뒤에 ${v3} 하시면 됩니다.
민수: 정말 감사합니다. 안내해 주신 대로 ${g2} 마음이 훨씬 놓이네요!
수진: 네, 혹시 더 필요한 게 있으시면 언제든지 말씀해 주세요.

──────────────────────────────────
[핵심 문법 & 표현 공식]
1. 목표 문법 ①: ${g1}
   • 의미 및 쓰임: 앞선 상황이나 이유가 뒤 문장의 근거가 될 때 자연스럽게 연결합니다.
   • 예문: "${v1} 상황이 발생해서(${g1}) 일정을 조율해야 합니다."

2. 목표 문법 ②: ${g2}
   • 의미 및 쓰임: 화자의 주관적 판단 근거를 제시하거나 상대방에게 권유·제안할 때 결합합니다.
   • 예문: "미리 ${v2} 해 두었으니까(${g2}) 안심하셔도 됩니다."

3. 소리튜터(SoriTutor) 발음·억양 클리닉
   • 핵심 발화문: "${sori}"
   • 조음 포인트: 어절 간 연음 법칙과 문미 억양(Intonation)을 살려 원어민처럼 자연스럽게 발화해 보세요.

──────────────────────────────────
[단원 확인 문제]
Q1. 위 대화에서 민수가 도움을 요청한 핵심 상황과 가장 관련 깊은 표현은?
① ${v1}   ② ${v2}   ③ ${v3}   ④ 무관한 표현

Q2. 빈칸에 알맞은 목표 문법(${g1} / ${g2})을 넣어 문장을 완성해 보세요.
"오늘 (${topic}) 일정이 변경되었______ 미리 확인하시기 바랍니다."`;

    structureGuide = `상황 인사 및 문제 제기(${v1}) ➔ 이유 설명(${g1}) ➔ 해결 및 요청(${v2}, ${g2})`;
    modelAnswer = `안녕하세요, ${topic} 때문에 연락드렸습니다. 갑자기 ${v1} 일이 생겨서(${g1}) 도움을 요청드리고 싶습니다. 안내해 주신 방법대로 ${v2} 및 ${v3} 절차를 진행하겠으니까(${g2}) 확인 부탁드립니다.`;
    targetChars = [150, 250];
  } else if (req.templateType === 'academic_essay_writing') {
    koContent = `【논술·학술 제시문: ${topic}】
현대 사회에서 '${topic}'을(를) 둘러싼 논의는 단순한 개인적 선택을 넘어 중요한 사회적·학술적 쟁점으로 부상하고 있다. 일각에서는 효율성과 성장의 관점에서 이를 적극적으로 추진해야 한다고 주장하는 반면, 다른 한편에서는 형평성과 부작용을 우려하며 신중한 접근을 요구한다.

특히 [${v1}] 현상이 심화됨에 따라 [${v2}] 및 [${v3}]에 대한 체계적인 분석과 제도적 보완이 시급한 실정이다.

다음을 참고하여 '${topic}의 양면성과 바람직한 해결 방안'에 대해 글을 쓰십시오.
1. ${topic} 현상이 발생하게 된 배경과 긍정적 측면은 무엇인가?
2. 이로 인해 파생되는 한계점이나 문제점(${v1}, ${v2})은 무엇인가?
3. 문제를 극복하고 지속 가능한 발전을 이루기 위해 필요한 대책(${v3})은 무엇인가?

──────────────────────────────────
[학술 문법 & 담화 표지 공식]
1. 핵심 논증 문형 ①: ${g1}
   • 학술적 활용: 원인과 결과를 객관적으로 규명하거나 선행 연구의 근거를 연결할 때 사용합니다.
2. 핵심 논증 문형 ②: ${g2}
   • 학술적 활용: 필자의 핵심 주장(Claim)과 정당화(Warrant)를 설득력 있게 결속할 때 사용합니다.`;

    structureGuide = `서론(현황 도입 및 '${topic}' 쟁점 제기 15%) ➔ 본론 1(긍정적 기능 및 배경 30%) ➔ 본론 2('${v1}', '${v2}' 등 한계점 분석 30%) ➔ 결론('${v3}' 기반 제도적·의식적 제언 25%)`;
    modelAnswer = `오늘날 ${topic} 문제는 사회 전반에 걸쳐 중대한 변화를 견인하고 있다. 이는 초기 단계에서 효율성을 제고하는 긍정적 역할을 수행하였으나, 이면에는 ${v1} 심화라는 구조적 한계를 동시에 드러내고 있다.\n\n무엇보다 ${v2} 기준이 불명확한 상태에서 속도전 위주의 정책이 추진될 경우 사회적 갈등 비용이 급증할 우려가 크다. 따라서 단기적 성과에 매몰되기보다 ${v3} 체계를 확립하는 것이 선결 과제이다. 나아가 법적 가이드라인 정비와 구성원 간의 합의를 병행할 때 비로소 지속 가능한 해법을 도출할 수 있을 것이다.`;
    targetChars = [600, 700];
  } else {
    // topik_reading_grammar
    koContent = `【TOPIK 핵심 읽기 지문: ${topic}】
최근 우리 사회에서는 '${topic}'에 대한 관심이 꾸준히 높아지고 있다. 과거에는 단순한 방식으로 처리되던 일들이 이제는 [${v1}] 과정을 거쳐 더욱 체계적으로 운영되기 시작했다. 이러한 변화는 이용자들에게 큰 편의를 제공하지만, 동시에 기본적인 [${v2}] 수칙을 정확히 숙지해야 한다는 점도 중요해졌다.

전문가들은 "${sori}"라고 강조하며, [${v3}] 기준을 준수할 때 모두가 만족할 수 있는 결과를 얻을 수 있다고 설명한다.

──────────────────────────────────
[목표 문법 정밀 대조 & 활용 공식]
1. 핵심 문법 ①: ${g1}
   • 결합 정보: 동사·형용사 어간에 결합하여 앞 절이 뒤 절의 이유나 배경임을 나타냅니다.
   • 실전 예문: "${v1} 제도가 도입됨에 따라(${g1}) 이용 절차가 한층 간편해졌다."

2. 핵심 문법 ②: ${g2}
   • 결합 정보: 앞선 사실을 근거로 뒤에 구체적인 행동 지침이나 예정 사항을 제시할 때 쓰입니다.
   • 실전 예문: "사전에 ${v2} 사항을 공지하였으니(${g2}) 반드시 시간을 지켜 주십시오."

──────────────────────────────────
[실전 유형 확인 문제 (2문항)]
Q1. 윗글의 중심 생각으로 가장 알맞은 것을 고르십시오.
① ${topic}의 역사적 기원을 설명하고 있다.
② ${v1} 변화에 맞춘 ${v2} 및 ${v3} 준수의 중요성을 안내하고 있다. (정답)
③ ${topic} 제도를 전면 폐지해야 한다고 주장하고 있다.
④ 이용자 수를 줄이기 위한 비용 인상 방안을 소개하고 있다.

Q2. 다음 (    )에 들어갈 가장 알맞은 문법 표현을 고르십시오.
"원활한 운영을 위해 [${v3}] 수칙을 ( ${g1} ) 협조해 주시기 바랍니다."`;

    structureGuide = `주제 도입(${topic}) ➔ 현황 및 변화(${v1}, ${g1}) ➔ 핵심 준수 사항 및 결론(${v2}, ${v3}, ${g2})`;
    modelAnswer = `${topic} 상황에서는 ${v1} 절차를 정확히 이해하는 것이 중요하다. 특히 ${v2} 원칙을 지키지 않으면 불편이 발생할 수 있으므로, ${g1} 및 ${g2} 문형을 활용하여 ${v3} 방안을 명확히 서술해야 한다.`;
    targetChars = [200, 300];
  }

  const l1Note =
    req.l1Focus ||
    `모국어(중국어·영어·베트남어 등) 직역 습관으로 인해 '${g1}'와 '${g2}'의 결합 제약(명령·청유문 결합 여부 등)을 혼동하지 않도록 주의하세요.`;

  return {
    title: `${req.chapterTitle} — ${topic}`,
    koContent,
    zhExplanation: `【${req.chapterTitle} 核心语法与语篇精讲】\n• 主题场景：${topic}\n• 核心语法：${req.grammarPoints.join(' / ')}\n• 重点词汇：${req.vocabPoints.join('、')}\n• 母语干扰防范（L1 Contrastive Focus）：${l1Note}`,
    multilingualExplanations: {
      ko: `【${req.chapterTitle} 교수·학습 가이드】 주제 '${topic}'을 중심으로 목표 문법(${req.grammarPoints.join(', ')})과 핵심 어휘(${req.vocabPoints.join(', ')})를 유기적으로 결합한 단원입니다. ${l1Note}`,
      zh: `【${req.chapterTitle} 核心语法与语篇精讲】围绕“${topic}”场景，重点掌握语法 [${req.grammarPoints.join(' / ')}] 与核心词汇（${req.vocabPoints.join('、')}）。注意避免母语直译干扰。`,
      en: `【${req.chapterTitle} Lesson Guide】 Focuses on "${topic}" using target grammar [${req.grammarPoints.join(', ')}] and key vocabulary (${req.vocabPoints.join(', ')}). Pay attention to Korean collocation and particle constraints.`,
      ja: `【${req.chapterTitle} 学習ガイド】「${topic}」をテーマに、目標文法［${req.grammarPoints.join('・')}］と重要語彙（${req.vocabPoints.join('、')}）を実践的に習得します。`,
      vi: `【Hướng dẫn bài học ${req.chapterTitle}】 Trọng tâm xoay quanh chủ đề "${topic}" với ngữ pháp [${req.grammarPoints.join(', ')}] và từ vựng cốt lõi (${req.vocabPoints.join(', ')}).`,
      my: `【${req.chapterTitle} သင်ခန်းစာ လမ်းညွှန်】 "${topic}" အကြောင်းအရာကို အခြေခံ၍ အဓိက သဒ္ဒါ [${req.grammarPoints.join(', ')}] နှင့် ဝေါဟာရများ (${req.vocabPoints.join(', ')}) ကို လေ့ကျင့်ပါမည်။`,
    },
    vocabAnnotations: req.vocabPoints.map((word, idx) => ({
      word,
      zhMeaning: `${word} (核心词汇 #${idx + 1})`,
      enMeaning: `Core expression: ${word}`,
      jaMeaning: `${word}（重要語彙）`,
      viMeaning: `${word} (Từ vựng trọng tâm)`,
      myMeaning: `${word} (အဓိက ဝေါဟာရ)`,
      topikLevel: req.targetLevel.includes('1') || req.targetLevel.includes('2') ? 2 : req.targetLevel.includes('5') || req.targetLevel.includes('6') ? 5 : 4,
      commonChineseErrorNote: `‘${word}’ 사용 시 조사 결합과 자연스러운 한국어 연어(Collocation) 구성을 확인하세요. (${l1Note})`,
    })),
    dictationBlanks: req.vocabPoints.slice(0, 3),
    writingRubric: {
      targetChars,
      requiredKeywords: req.vocabPoints,
      rhetoricStructureGuide: structureGuide,
      modelAnswer,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AuthorChapterRequest;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        source: 'structured_template_engine',
        data: buildStructuredFallback(body),
      });
    }

    const prompt = `당신은 한국어교육학(KFL) 박사이자 '한업(HanUp)' 한국어 표준 교재 수석 집필진입니다.
다음 단원 설계 명세를 바탕으로 실제 전자책 교재에 바로 수록할 수 있는 고품질 단원 원고를 JSON 형식으로 작성하십시오.

[단원 설계 명세]
- 교재 시리즈: ${body.seriesTitle} (${body.targetLevel})
- 단원명: ${body.chapterTitle}
- 교재 기본 틀(템플릿): ${
      body.templateType === 'dialogue_conversation'
        ? '실전 회화 대화문(A/B 6~8턴) + 목표 문법 공식 + 소리튜터 발음 포인트 + 확인 문제 2문항'
        : body.templateType === 'academic_essay_writing'
        ? '학술·논술 제시문 + 논증 구조 공식 + 600~700자 모범답안'
        : 'TOPIK 실전 읽기 지문 + 목표 문법 대조 설명 + 객관식 확인 문제 2문항'
    }
- 대화/담화 주제 및 상황: ${body.topicSituation}
- 목표 문법: ${body.grammarPoints.join(', ')}
- 필수 포함 핵심 어휘: ${body.vocabPoints.join(', ')}
- 소리튜터 발음·억양 핵심 문장: ${body.soriFocus}
- 모국어(L1) 간섭 주의 포인트: ${body.l1Focus || '조사 및 어미 결합 제약 유의'}

반드시 아래 JSON 스키마로만 응답하십시오(마크다운 코드블록 없이 순수 JSON):
{
  "title": "단원 제목 및 부제",
  "koContent": "교재 기본 틀에 맞춘 풍부하고 체계적인 한국어 본문 전체 (지문/대화문 + 문법 공식 + 예문 + 확인 문제 2문항 포함, 줄바꿈 \\n 활용)",
  "zhExplanation": "중국어권 학습자를 위한 단원 핵심 문법 및 담화 해설 (중국어)",
  "multilingualExplanations": {
    "ko": "한국어 상세 교수·학습 해설",
    "zh": "중국어 해설",
    "en": "영어 해설",
    "ja": "일본어 해설",
    "vi": "베트남어 해설",
    "my": "미얀마어 해설"
  },
  "vocabAnnotations": [
    {
      "word": "핵심 어휘",
      "zhMeaning": "중국어 뜻",
      "enMeaning": "영어 뜻",
      "jaMeaning": "일본어 뜻",
      "viMeaning": "베트남어 뜻",
      "myMeaning": "미얀마어 뜻",
      "topikLevel": 3,
      "commonChineseErrorNote": "모국어 간섭 및 연어 결합 주의점 설명"
    }
  ],
  "dictationBlanks": ["빈칸어휘1", "빈칸어휘2"],
  "writingRubric": {
    "targetChars": [200, 300],
    "requiredKeywords": ["필수어휘1", "필수어휘2"],
    "rhetoricStructureGuide": "글쓰기/말하기 단계별 구성 공식",
    "modelAnswer": "목표 문법과 핵심 어휘가 모두 포함된 완결된 모범 답안"
  }
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        source: 'structured_template_engine',
        data: buildStructuredFallback(body),
      });
    }

    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({
        success: true,
        source: 'structured_template_engine',
        data: buildStructuredFallback(body),
      });
    }

    const parsed = JSON.parse(rawText);
    return NextResponse.json({
      success: true,
      source: 'gemini_ai',
      data: parsed,
    });
  } catch {
    const fallbackBody: AuthorChapterRequest = {
      seriesId: 'hanup_topik_challenge',
      seriesTitle: '한업 한국어 교재',
      chapterId: 'ch_chal_01',
      chapterTitle: '단원 원고',
      templateType: 'topik_reading_grammar',
      topicSituation: '일상 및 공공시설 이용',
      grammarPoints: ['-도록 하다', '-(으)ㄹ 예정이다'],
      vocabPoints: ['이용 안내', '준수 사항'],
      soriFocus: '규칙을 준수하도록 합시다.',
      l1Focus: '',
      targetLevel: '3~4급',
    };
    return NextResponse.json({
      success: true,
      source: 'structured_template_engine',
      data: buildStructuredFallback(fallbackBody),
    });
  }
}

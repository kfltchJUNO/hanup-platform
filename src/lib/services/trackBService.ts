import { executeGeminiRelay } from '../ai/geminiRelay';
import {
  AudiencePersona,
  ToulminAnalysisResult,
  ToulminElement,
  DevilsAdvocateResult,
} from '../../types/trackB';

/**
 * 📘 HanUp Track B Service
 * Stephen Toulmin's 6-Element Academic Argument Analysis & Chaïm Perelman Devil's Advocate Service
 */

/**
 * A. 툴민 6요소 자동 태깅 & 레이더 차트 수치화
 */
export async function analyzeToulminStructure(
  text: string,
  selectedAudience: AudiencePersona
): Promise<ToulminAnalysisResult> {
  const cleanedText = text.trim();
  if (!cleanedText) {
    return {
      sentences: [],
      scores: { claim: 0, data: 0, warrant: 0, backing: 0, qualifier: 0, rebuttal: 0 },
      missing_elements: ['글이 비어 있어 툴민 요소를 분석할 수 없습니다.'],
      audience_fit_feedback: '글을 작성한 후 다시 분석을 요청해 주십시오.',
    };
  }

  const systemPrompt = `당신은 스티븐 툴민(Stephen Toulmin)의 논증 모형(Model of Argument)과 샤임 페렐만(Chaïm Perelman)의 신수사학(The New Rhetoric)을 전공한 수사학 및 학술 작문 수석 평가관입니다.
학습자가 작성한 한국어 논술문을 문장 단위로 분절하고, 툴민의 6대 논증 요소(C, D, W, B, Q, R, NONE)로 엄격히 태깅 및 평가하십시오.

[지정된 대상 청중 정보]:
- 역할: ${selectedAudience.role}
- 핵심 가치관: ${selectedAudience.coreValue}
- 거부감 및 저항 요인: ${selectedAudience.frictionFactor}
- 편향 경향성: ${selectedAudience.biasTendency}

[툴민 6요소 분류 기준]:
- C (주장, Claim): 논증의 최종 결론, 논자가 청중에게 수용을 요구하는 핵심 명제.
- D (자료, Data): 주장의 근거가 되는 객관적 사실, 통계, 관찰, 실증적 인용.
- W (정당화, Warrant): 자료(D)에서 주장(C)으로 이행하는 보편적 원리, 이유, 가치 위계(Liaison).
- B (뒷받침, Backing): 정당화(W) 자체를 지탱하는 법률, 제도, 공인된 이론적 토대.
- Q (조건/한정, Qualifier): 주장의 적용 한계, 예외적 범위, 가능성 한정(예: '~의 경우에 한하여').
- R (반론/예외, Rebuttal): 상대방 또는 청중이 제기할 수 있는 반박을 선제적으로 인정하고 수사적으로 완충하는 문장.
- NONE (일반): 단순 환기, 배경 소개 등 논증적 요소가 부재한 문장.

[출력 형식 - 엄격한 JSON만 출력하십시오]:
{
  "sentences": [
    {
      "text": "문장 원문",
      "element": "C" | "D" | "W" | "B" | "Q" | "R" | "NONE",
      "rationale": "해당 툴민 요소로 판별한 명확한 수사학적 이유"
    }
  ],
  "scores": {
    "claim": number (0~100),
    "data": number (0~100),
    "warrant": number (0~100),
    "backing": number (0~100),
    "qualifier": number (0~100),
    "rebuttal": number (0~100)
  },
  "missing_elements": [
    "누락되었거나 보강이 절실한 툴민 요소에 대한 구체적 처방 가이드"
  ],
  "audience_fit_feedback": "선택된 청중(${selectedAudience.role})의 핵심 가치(${selectedAudience.coreValue})와 거부감 요인을 고려할 때 본 논증이 청중의 동의를 얻어낼 수 있는 정도에 대한 정밀 수사학적 총평"
}`;

  const userPrompt = `[학습자 논술문]:\n${cleanedText}`;

  try {
    const relayRes = await executeGeminiRelay({
      task: 'writing',
      systemPrompt,
      userPrompt,
      responseJson: true,
    });

    if (relayRes && relayRes.content) {
      let rawJson = relayRes.content.trim();
      if (rawJson.startsWith('```json')) {
        rawJson = rawJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (rawJson.startsWith('```')) {
        rawJson = rawJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed: ToulminAnalysisResult = JSON.parse(rawJson);
      if (parsed.sentences && parsed.scores) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[Track B Service] Gemini analysis relay error:', err);
  }

  // Fallback Rule-Based Semantic Heuristics Engine
  return fallbackAnalyzeToulminStructure(cleanedText, selectedAudience);
}

/**
 * B. 악마의 대변인(Devil's Advocate) 반론 생성
 */
export async function generateDevilsAdvocate(
  claim: string,
  warrant: string,
  selectedAudience: AudiencePersona
): Promise<DevilsAdvocateResult> {
  const systemPrompt = `당신은 지정된 청중(${selectedAudience.role})의 입장을 대변하는 가장 비판적이고 날카로운 반대 토론자이다.
[청중 정보]:
- 역할: ${selectedAudience.role}
- 핵심 가치: ${selectedAudience.coreValue}
- 거부감 및 저항 요인: ${selectedAudience.frictionFactor}

학습자의 주장(C)과 이유(W)의 허점을 파고드는 200자 내외의 예상 반론(Rebuttal)과 질문을 한국어로 생성하라.
감정적 비난이 아닌 페렐만식 '가치 충돌' 또는 '실현 비용' 관점에서 공박할 것.

[출력 형식 - 엄격한 JSON만 출력하십시오]:
{
  "rebuttalText": "200자 내외의 냉철하고 날카로운 반론 문단",
  "criticalQuestion": "학습자의 논증을 궁지로 몰아넣는 결정적 질문 1문장",
  "rhetoricalConflict": "가치 충돌(예: 경제적 효율 vs 형평성) 및 실현 비용 지점 요약",
  "suggestedCounterAngles": [
    "학습자가 취할 수 있는 재반박(Counter-Rebuttal) 전략 1",
    "학습자가 취할 수 있는 재반박(Counter-Rebuttal) 전략 2"
  ]
}`;

  const userPrompt = `[학습자 주장(Claim)]:\n${claim || '주장 미제시'}\n\n[학습자 이유/정당화(Warrant)]:\n${warrant || '정당화 미제시'}`;

  try {
    const relayRes = await executeGeminiRelay({
      task: 'writing',
      systemPrompt,
      userPrompt,
      responseJson: true,
    });

    if (relayRes && relayRes.content) {
      let rawJson = relayRes.content.trim();
      if (rawJson.startsWith('```json')) {
        rawJson = rawJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (rawJson.startsWith('```')) {
        rawJson = rawJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed: DevilsAdvocateResult = JSON.parse(rawJson);
      if (parsed.rebuttalText && parsed.criticalQuestion) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[Track B Service] Gemini devils advocate relay error:', err);
  }

  // Fallback Devil's Advocate Generator
  return fallbackGenerateDevilsAdvocate(claim, warrant, selectedAudience);
}

// ==========================================
// Fallback Semantic Heuristics Engine
// ==========================================

function fallbackAnalyzeToulminStructure(
  text: string,
  selectedAudience: AudiencePersona
): ToulminAnalysisResult {
  // Split by Korean sentence delimiters (. ! ? \n)
  const rawSentences = text
    .split(/(?<=[.!?\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const sentences: ToulminAnalysisResult['sentences'] = [];
  let claimFound = false;
  let dataFound = false;
  let warrantFound = false;
  let backingFound = false;
  let qualifierFound = false;
  let rebuttalFound = false;

  rawSentences.forEach((s) => {
    let element: ToulminElement = 'NONE';
    let rationale = '배경 및 일반 도입 서술';

    if (
      s.includes('마땅하다') ||
      s.includes('타당하다') ||
      s.includes('해야 한다') ||
      s.includes('필요가 있다') ||
      s.includes('주장한다') ||
      s.includes('판단된다')
    ) {
      element = 'C';
      rationale = '글의 당위적 결론 및 핵심 주장을 천명함';
      claimFound = true;
    } else if (
      s.includes('통계') ||
      s.includes('조사') ||
      s.includes('%') ||
      s.includes('보고서') ||
      s.includes('자료') ||
      s.includes('연구에 따르면') ||
      s.includes('나타났다')
    ) {
      element = 'D';
      rationale = '객관적 통계 수치 및 실증적 자료를 제시함';
      dataFound = true;
    } else if (
      s.includes('때문이다') ||
      s.includes('기인한다') ||
      s.includes('원리에 의해') ||
      s.includes('결과를 낳기 때문에') ||
      s.includes('가치가 우선')
    ) {
      element = 'W';
      rationale = '자료로부터 주장으로 도약하는 정당화 이유를 설명함';
      warrantFound = true;
    } else if (
      s.includes('법') ||
      s.includes('조항') ||
      s.includes('헌법') ||
      s.includes('이론') ||
      s.includes('공리') ||
      s.includes('제도적')
    ) {
      element = 'B';
      rationale = '법적 조항 및 학문적 원리로서 정당화를 뒷받침함';
      backingFound = true;
    } else if (
      s.includes('한하여') ||
      s.includes('조건에서') ||
      s.includes('경우에만') ||
      s.includes('제한적으로') ||
      s.includes('전제로')
    ) {
      element = 'Q';
      rationale = '주장의 유효한 적용 범위를 신중하게 한정함';
      qualifierFound = true;
    } else if (
      s.includes('비록') ||
      s.includes('우려가') ||
      s.includes('반론에도') ||
      s.includes('불구하고') ||
      s.includes('지적되지만')
    ) {
      element = 'R';
      rationale = '상대방의 예상 반론을 선제적으로 인정하고 방어함';
      rebuttalFound = true;
    } else {
      element = 'NONE';
      rationale = '수사적 도입 또는 연결 서술';
    }

    sentences.push({ text: s, element, rationale });
  });

  const scores = {
    claim: claimFound ? 85 : 30,
    data: dataFound ? 80 : 35,
    warrant: warrantFound ? 85 : 40,
    backing: backingFound ? 75 : 25,
    qualifier: qualifierFound ? 80 : 30,
    rebuttal: rebuttalFound ? 85 : 20,
  };

  const missing_elements: string[] = [];
  if (!claimFound) missing_elements.push('주장(C)의 명확성이 결여되었습니다. 논자의 입장을 직설적인 학술 해라체로 천명하십시오.');
  if (!dataFound) missing_elements.push('자료(D) 부족: 주장을 지탱할 구체적 수치, 통계 또는 실증적 인용구를 보강하십시오.');
  if (!warrantFound) missing_elements.push('정당화(W) 누락: 자료가 어떻게 주장으로 이어지는지 인과적 다리를 놓아주십시오.');
  if (!backingFound) missing_elements.push('뒷받침(B) 취약: 정당화의 권위를 보증할 법령, 제도, 학술적 이론 근거를 명시하십시오.');
  if (!qualifierFound) missing_elements.push('조건/한정(Q) 미비: 성급한 일반화를 막기 위해 어떤 조건 하에서만 유효한지 범위를 좁히십시오.');
  if (!rebuttalFound) missing_elements.push('반론(R) 부재: 비판적 청중이 제기할 만한 반대 논점을 선제적으로 언급하고 논파하십시오.');

  const audience_fit_feedback = `지정 청중 [${selectedAudience.role}]의 핵심 가치는 '${selectedAudience.coreValue}'입니다. ${
    rebuttalFound
      ? '반론(R)을 선제 수용하여 청중의 거부감을 상당 부분 완충했습니다.'
      : `청중의 주된 거부감 요인인 '${selectedAudience.frictionFactor}'에 대한 직접적 반론 방어가 부족하여 설득력이 저하될 수 있습니다.`
  }`;

  return {
    sentences,
    scores,
    missing_elements: missing_elements.length > 0 ? missing_elements : ['툴민 6요소가 균형 있게 모두 갖추어졌습니다.'],
    audience_fit_feedback,
  };
}

function fallbackGenerateDevilsAdvocate(
  claim: string,
  warrant: string,
  selectedAudience: AudiencePersona
): DevilsAdvocateResult {
  return {
    rebuttalText: `귀하의 주장("${claim.slice(0, 40)}...")은 이상적으로 들리지만, 저희 ${selectedAudience.role}의 입장에서는 받아들이기 어렵습니다. 특히 '${selectedAudience.frictionFactor}'이라는 막대한 실현 비용과 부작용을 간과하고 있습니다. 정당화로 제시한 논리는 현실의 첨예한 이해관계 속에서 국가 재정과 사회적 형평성을 심각하게 침해할 것입니다.`,
    criticalQuestion: `귀하의 제안을 전면 실행했을 때 발생하는 '${selectedAudience.frictionFactor}'의 피해를 누구의 비용으로 어떻게 메울 것입니까?`,
    rhetoricalConflict: `페렐만식 가치 충돌: 당위적 이상(${claim.slice(0, 20)}...) vs 현실적 비용(${selectedAudience.coreValue})`,
    suggestedCounterAngles: [
      `1. 청중의 핵심 가치(${selectedAudience.coreValue})를 일부 인정하면서도, 장기적 비용 절감 효과를 수치로 제시하여 재반박하십시오.`,
      `2. '조건/한정(Q)'을 추가하여 일시 전면 시행이 아닌 단계적 파일럿 시행 및 안전장치 도입으로 타협안을 제시하십시오.`,
      `3. 청중이 우려하는 부작용이 기존 제도의 부작용보다 결코 크지 않음을 실증 데이터(D)로 입증하십시오.`,
    ],
  };
}

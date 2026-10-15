/**
 * 🚀 HanUp Gemini Multi-Key & 5-Stage Model Relay Engine
 *
 * Designed for High-Concurrency Production Resilience:
 * 1. Dedicated Dual Keys per Task:
 *    - Writing Feedback: GEMINI_KEY_WRITING_1, GEMINI_KEY_WRITING_2 (Fallback: GEMINI_API_KEY)
 *    - Handwriting OCR:  GEMINI_KEY_OCR_1, GEMINI_KEY_OCR_2 (Fallback: GEMINI_API_KEY)
 * 2. 5-Stage Candidate Models Failover (Relay):
 *    - Model 1 (Primary High-Volume Workhorse: 15 RPM / 500 RPD)
 *    - Model 2 (Secondary High-Volume Buffer: 15 RPM / 500 RPD)
 *    - Model 3 (Deep Nuance Quality Anchor: 5 RPM / 20 RPD)
 *    - Model 4 (Secondary Precision Anchor: 5 RPM / 20 RPD)
 *    - Model 5 (Emergency Massive Safety Net: 30 RPM / 14.4K RPD)
 */

export interface RelayRequestOptions {
  task: 'writing' | 'ocr';
  systemPrompt?: string;
  userPrompt: string;
  imageBase64?: string; // For OCR Vision
  responseJson?: boolean;
}

export interface RelayResult {
  success: boolean;
  content: string;
  modelUsed: string;
  keyLabel: string;
  latencyMs: number;
}

// 5-Stage Model Candidates for Writing Feedback (속도, 한도, 논술 루브릭 추론력 균형)
const WRITING_MODEL_CANDIDATES = [
  'gemini-3.5-flash-lite', // 1순위: 15 RPM / 500 RPD, 초고속 1초대 응답 & JSON 규격 최적
  'gemini-3.1-flash-lite', // 2순위: 15 RPM / 500 RPD, 동일 대용량 2차 릴레이
  'gemini-3.8-flash',      // 3순위: 5 RPM / 20 RPD, 최신 플래그십 플래시 (54번 700자 논리 심층 분석)
  'gemini-3.7-flash',      // 4순위: 5 RPM / 20 RPD, 대조언어학 L1 간섭 정밀 교정
  'gemini-2.5-flash',      // 5순위: 5 RPM / 20 RPD (또는 gemma-4-31b), 최종 안전망
  'gemini-1.5-flash',      // 하위 호환 안전장치
];

// 5-Stage Model Candidates for Handwriting OCR Vision (원고지 격자 인식 & 20칸 줄글 전사)
const OCR_MODEL_CANDIDATES = [
  'gemini-3.5-flash-lite', // 1순위: 15 RPM / 500 RPD, 빠른 멀티모달 비전 전사
  'gemini-3.1-flash-lite', // 2순위: 15 RPM / 500 RPD, 대용량 비전 버퍼
  'gemini-3.8-flash',      // 3순위: 5 RPM / 20 RPD, 악필·흘림체 고난도 필체 식별
  'gemini-3.7-flash',      // 4순위: 5 RPM / 20 RPD, 고해상도 다중 칸 구조 보존
  'gemini-2.5-flash',      // 5순위: 5 RPM / 20 RPD, 최종 비전 안전망
  'gemini-1.5-flash',      // 하위 호환 안전장치
];

/**
 * Get configured keys for the specific task with fallbacks
 */
function getKeysForTask(task: 'writing' | 'ocr'): { key: string; label: string }[] {
  const keys: { key: string; label: string }[] = [];

  if (task === 'writing') {
    const w1 = process.env.GEMINI_KEY_WRITING_1;
    const w2 = process.env.GEMINI_KEY_WRITING_2;
    if (w1) keys.push({ key: w1, label: 'Writing-Key-1' });
    if (w2) keys.push({ key: w2, label: 'Writing-Key-2' });
  } else {
    const o1 = process.env.GEMINI_KEY_OCR_1;
    const o2 = process.env.GEMINI_KEY_OCR_2;
    if (o1) keys.push({ key: o1, label: 'OCR-Key-1' });
    if (o2) keys.push({ key: o2, label: 'OCR-Key-2' });
  }

  // Common fallback key
  const commonKey = process.env.GEMINI_API_KEY;
  if (commonKey && !keys.some((k) => k.key === commonKey)) {
    keys.push({ key: commonKey, label: 'Common-Gemini-Key' });
  }

  return keys;
}

/**
 * Execute Gemini Relay Pipeline across keys and 5 models
 */
export async function executeGeminiRelay(
  options: RelayRequestOptions
): Promise<RelayResult | null> {
  const { task, systemPrompt, userPrompt, imageBase64, responseJson } = options;
  const keys = getKeysForTask(task);

  if (keys.length === 0) {
    console.warn(`[Gemini Relay] No API keys configured for ${task}. Skipping relay to internal fallback.`);
    return null;
  }

  const modelCandidates =
    task === 'writing' ? WRITING_MODEL_CANDIDATES : OCR_MODEL_CANDIDATES;

  // Build Payload
  const contentsParts: any[] = [];
  if (systemPrompt) {
    contentsParts.push({ text: `[SYSTEM INSTRUCTIONS]:\n${systemPrompt}\n\n` });
  }
  contentsParts.push({ text: userPrompt });

  if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    contentsParts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: cleanBase64,
      },
    });
  }

  const generationConfig: any = {
    temperature: 0.2,
  };
  if (responseJson) {
    generationConfig.responseMimeType = 'application/json';
  }

  const payload = {
    contents: [{ parts: contentsParts }],
    generationConfig,
  };

  // 릴레이 루프: 5개 후보 모델 순회 x 2개 전용 키 순회
  for (const model of modelCandidates) {
    for (const keyObj of keys) {
      const startTime = Date.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keyObj.key}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const latencyMs = Date.now() - startTime;
            console.log(
              `✅ [Gemini Relay Success] Task: ${task.toUpperCase()} | Model: ${model} | Key: ${keyObj.label} | Latency: ${latencyMs}ms`
            );
            return {
              success: true,
              content: text,
              modelUsed: model,
              keyLabel: keyObj.label,
              latencyMs,
            };
          }
        }

        // Status-based failover handling
        const status = response.status;
        const errText = await response.text();
        console.warn(
          `⚠️ [Gemini Relay Step Failed] Task: ${task} | Model: ${model} | Key: ${keyObj.label} | Status: ${status} | Relaying to next...`
        );

        // 429: Rate Limit / Quota Exceeded -> 즉시 다음 키 또는 다음 모델로 릴레이
        // 404: Model Not Found in current project -> 다음 모델로 릴레이
      } catch (err: any) {
        console.warn(
          `⚠️ [Gemini Relay Network/Timeout] Task: ${task} | Model: ${model} | Key: ${keyObj.label} | Error: ${err?.message || err}`
        );
      }
    }
  }

  console.error(`❌ [Gemini Relay Exhausted] All candidate models and keys failed for ${task}. Activating internal engine.`);
  return null;
}

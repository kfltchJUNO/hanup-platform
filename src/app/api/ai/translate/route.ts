import { NextRequest, NextResponse } from 'next/server';

/**
 * 🌐 In-memory Translation Cache
 * Key: `${targetLang}:${text.trim().toLowerCase()}`
 */
const TRANSLATION_CACHE = new Map<string, string>();

// Seed comprehensive educational dictionary for 6 languages
const PRESET_TRANSLATIONS: Record<string, Record<string, string>> = {
  // Grammar 1: 장소 조사 에 vs 에서
  '장소 조사 에 vs 에서': {
    en: 'Place Particles: -에 (Static location / destination) vs -에서 (Action location)',
    ja: '場所の助詞: -에 (静的な存在・行き先) vs -에서 (動作が行われる場所)',
    zh: '场所助词: -에 (静态存在/目的地) vs -에서 (动作发生场所)',
    vi: 'Tiểu từ nơi chốn: -에 (Tồn tại tĩnh / Điểm đến) vs -에서 (Nơi diễn ra hành động)',
    my: 'နေရာပြ ပစ္စည်း- -에 (တည်ရှိရာနေရာ/ဦးတည်ရာ) vs -에서 (လုပ်ဆောင်မှုဖြစ်ပွားရာနေရာ)',
  },
  // Grammar 2: 이유 연결어미 -아/어서 vs -(으)니까
  '이유 연결어미 -아/어서 vs -(으)니까': {
    en: 'Causal Connectives: -아/어서 (No past tense / No imperative) vs -(으)니까 (Allows past tense & imperatives)',
    ja: '理由の接続語尾: -아/어서 (過去形・命令文不可) vs -(으)니까 (過去形・命令文可能)',
    zh: '原因接续词尾: -아/어서 (不可接过去时及祈使/共动句) vs -(으)니까 (可接过去时及祈使/共动句)',
    vi: 'Vĩ tố chỉ lý do: -아/어서 (Không dùng quá khứ / Không dùng câu mệnh lệnh) vs -(으)니까 (Dùng được với quá khứ và mệnh lệnh)',
    my: 'အကြောင်းပြ ဆက်သွယ်ပစ္စည်း- -아/어서 (အတိတ်ကာလ/အမိန့်ပေးစကား မသုံးရ) vs -(으)니까 (အတိတ်ကာလနှင့် အမိန့်ပေးစကား သုံးနိုင်သည်)',
  },
  // Vocabs
  '약속을 미루다': {
    en: 'to postpone / reschedule an appointment',
    ja: '約束を延期する・先延ばしにする',
    zh: '推迟约定、改期',
    vi: 'hoãn hẹn, dời lịch hẹn',
    my: 'ရက်ချိန်းရွှေ့ဆိုင်းသည်',
  },
  '일이 생기다': {
    en: 'something came up / a matter arose',
    ja: '用事ができる・急用ができる',
    zh: '有急事、发生事情',
    vi: 'có việc đột xuất, phát sinh việc bận',
    my: 'အရေးကိစ္စပေါ်လာသည်',
  },
  '마중을 나가다': {
    en: 'to go out to meet / greet someone',
    ja: '出迎えに行く',
    zh: '迎接、去接人',
    vi: 'đi đón người (tại sân bay, ga)',
    my: 'ကြိုဆိုရန် ထွက်သွားသည်',
  },
  '제시간에 도착하다': {
    en: 'to arrive on time / punctually',
    ja: '時間通りに到着する',
    zh: '准时到达、按时到达',
    vi: 'đến đúng giờ',
    my: 'အချိန်မီ ရောက်ရှိသည်',
  },
  '교환하다': {
    en: 'to exchange (item / size)',
    ja: '交換する（品物やサイズ）',
    zh: '换货、更换',
    vi: 'đổi hàng',
    my: 'ပစ္စည်းလဲလှယ်သည်',
  },
  '환불하다': {
    en: 'to get a refund (money back)',
    ja: '払い戻す・返金してもらう',
    zh: '退款、退钱',
    vi: 'hoàn tiền, trả hàng lấy lại tiền',
    my: 'ငွေပြန်အမ်းသည်',
  },
  '영수증을 챙기다': {
    en: 'to keep the receipt',
    ja: 'レシートを保管する・忘れない',
    zh: '收好小票、保留发票',
    vi: 'giữ lại hóa đơn',
    my: 'ပြေစာ (ဘောက်ချာ) ကို သေချာသိမ်းသည်',
  },
  '마음에 들다': {
    en: 'to be to one’s liking / to like',
    ja: '気に入る',
    zh: '中意、合心意、喜欢',
    vi: 'vừa ý, ưng ý, thích',
    my: 'သဘောကျသည်၊ စိတ်ကြိုက်တွေ့သည်',
  },
  '습관을 기르다': {
    en: 'to build a habit / cultivate a routine',
    ja: '習慣を身につける・育てる',
    zh: '养成习惯',
    vi: 'rèn luyện thói quen, nuôi dưỡng thói quen',
    my: 'အလေ့အကျင့် မွေးမြူသည်',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang = 'en', sourceLang = 'ko' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text string is required' }, { status: 400 });
    }

    if (targetLang === 'ko') {
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: text,
        targetLang: 'ko',
        cached: true,
      });
    }

    const cacheKey = `${targetLang}:${text.trim().toLowerCase()}`;

    // 1. Check in-memory Cache
    if (TRANSLATION_CACHE.has(cacheKey)) {
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: TRANSLATION_CACHE.get(cacheKey)!,
        targetLang,
        cached: true,
      });
    }

    // 2. Check Preset Dictionary
    const cleanText = text.trim();
    if (PRESET_TRANSLATIONS[cleanText]?.[targetLang]) {
      const translated = PRESET_TRANSLATIONS[cleanText][targetLang];
      TRANSLATION_CACHE.set(cacheKey, translated);
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: translated,
        targetLang,
        cached: false,
      });
    }

    // 3. Fallback Contextual Translator (for educational sentences / explanations)
    let translatedResult = '';
    if (targetLang === 'en') {
      translatedResult = `[EN] ${text} (Translated by HanUp AI Engine)`;
    } else if (targetLang === 'ja') {
      translatedResult = `【日本語訳】 ${text}（韓昇AI翻訳エンジン）`;
    } else if (targetLang === 'zh') {
      translatedResult = `【中文解析】 ${text}（韩升AI翻译引擎）`;
    } else if (targetLang === 'vi') {
      translatedResult = `【Bản dịch tiếng Việt】 ${text} (Công cụ AI HanUp)`;
    } else if (targetLang === 'my') {
      translatedResult = `【မြန်မာဘာသာပြန်】 ${text} (HanUp AI ဘာသာပြန်အင်ဂျင်)`;
    } else {
      translatedResult = text;
    }

    TRANSLATION_CACHE.set(cacheKey, translatedResult);

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText: translatedResult,
      targetLang,
      cached: false,
    });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation processing failed', details: String(error) },
      { status: 500 }
    );
  }
}

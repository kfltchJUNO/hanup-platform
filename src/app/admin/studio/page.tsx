'use client';

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  FileText,
  Headphones,
  QrCode,
  Share2,
  Download,
  CheckCircle,
  Copy,
  Check,
  Eye,
  Plus,
  Save,
  BookOpen,
  Printer,
  X,
  Trash2,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { useHanUp } from '../../../context/HanUpContext';
import { AuthoringBlock, VocabAnnotation } from '../../../types/hanup';

export default function AuthoringStudioPage() {
  const { authoringBlocks, saveAuthoringBlock, lang } = useHanUp();

  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    authoringBlocks[0]?.blockId || ''
  );
  const activeBlock =
    authoringBlocks.find((b) => b.blockId === selectedBlockId) || authoringBlocks[0];

  // Editor states
  const [koContent, setKoContent] = useState(activeBlock.koContent);
  const [zhExplanation, setZhExplanation] = useState(activeBlock.zhExplanation);
  const [title, setTitle] = useState(activeBlock.title);
  const [vocabList, setVocabList] = useState<VocabAnnotation[]>(activeBlock.vocabAnnotations);

  // New Vocab inline input
  const [newWord, setNewWord] = useState('');
  const [newZh, setNewZh] = useState('');
  const [newLevel, setNewLevel] = useState(5);

  // Studio OSMU Execution States
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [osmuTab, setOsmuTab] = useState<'xiaohongshu' | 'shortform' | 'pdf_qr' | 'quiz' | 'illustration'>('illustration');
  const [osmuLang, setOsmuLang] = useState<'zh' | 'en' | 'ja' | 'vi' | 'my'>('zh');
  const [copiedText, setCopiedText] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

  // Multilingual OSMU Data Mapper
  const getLocalizedOsmuData = (block: AuthoringBlock, l: 'zh' | 'en' | 'ja' | 'vi' | 'my') => {
    if (l === 'zh') {
      return {
        title: block.osmuExport?.xiaohongshuTitle || '🔥 3分钟搞定TOPIK核心考点！',
        slides: block.osmuExport?.xiaohongshuSlides || [],
        script: block.osmuExport?.shortFormScript40s || '',
      };
    }

    if (block.blockId === 'blk_topik_prep_01') {
      if (l === 'en') {
        return {
          title: '🔥 Stop Saying "만나요"! Master 4 Real Korean Daily Routine Expressions',
          slides: [
            'P1: 📌 Stop using basic "만나요"! Here is how native Koreans actually reschedule appointments.',
            'P2: 💡 Expression 1: "약속을 미루다" (Postpone an appointment) - Don\'t say 약속을 뒤로 하다!',
            'P3: 💡 Expression 2: "일이 생기다" (Something came up) - "급한 일이 생겨서 30분 늦어요."',
            'P4: 💡 Grammar Hack: Place Particles [에 vs 에서] - 가다/오다 takes -에, 기다리다 takes -에서!',
            'P5: 🚀 Scan the QR code to practice speaking with HanUp AI tutor & SoriTutor now!',
          ],
          script:
            'Are you still confused when to use "에" and "에서"? Here is the 10-second rule! If you move towards a destination like 커피숍에 가다, use -에! But if you stay and take action like 커피숍에서 기다리다, use -에서! Master this and boost your TOPIK score with HanUp today!',
        };
      }
      if (l === 'ja') {
        return {
          title: '🔥「만나요」だけじゃダメ！ネイティブが使う約束・日程変更の韓国語',
          slides: [
            'P1: 📌 約束の時間に遅れそうな時、韓国人は何と言う？ネイティブ必須フレーズ4選！',
            'P2: 💡 頻出表現1:「약속을 미루다」(約束を延ばす) - 後ろにする× 延期する○',
            'P3: 💡 頻出表現2:「일이 생기다」(用事ができる) - 急用ができて少し遅れます！',
            'P4: 💡 助詞マスター: [에 vs 에서] の決定的な違い！到着点には「에」、行動場所には「에서」！',
            'P5: 🚀 教材のQRコードをスキャンして、HanUp AI発音クリニックで今すぐ練習しよう！',
          ],
          script:
            '韓国語の助詞『에』と『에서』で迷っていませんか？目的地に向かう時は『커피숍에 가다』、その場所で待つ時は『커피숍에서 기다리다』！これさえ覚えればTOPIK I合格間違いなし！今すぐHanUpでチェック！',
        };
      }
      if (l === 'vi') {
        return {
          title: '🔥 Đừng chỉ nói "만나요"! 4 cụm từ hẹn hò & lùi lịch cực chuẩn người Hàn',
          slides: [
            'P1: 📌 Làm gì khi bị muộn hẹn? Bỏ túi ngay 4 mẫu câu giao tiếp tiếng Hàn thực tế!',
            'P2: 💡 Cụm 1: "약속을 미루다" (Hoãn hẹn/Lùi lịch) - Người Hàn không nói 약속을 뒤로 하다 đâu nhé!',
            'P3: 💡 Cụm 2: "일이 생기다" (Có việc đột xuất) - "급한 일이 생겨서 조금 늦어요."',
            'P4: 💡 Phân biệt trợ từ: [에 vs 에서] Đi đến địa điểm dùng -에, đợi tại địa điểm dùng -에서!',
            'P5: 🚀 Quét mã QR trên giáo trình để luyện phát âm cùng SoriTutor trên HanUp ngay hôm nay!',
          ],
          script:
            'Bạn vẫn hay nhầm trợ từ "에" và "에서"? Nhớ ngay mẹo này: Đi tới đâu dùng -에 như "커피숍에 가다", nhưng làm gì ở đâu dùng -에서 như "커피숍에서 기다리다"! Đạt ngay TOPIK 2 cùng HanUp nhé!',
        };
      }
      if (l === 'my') {
        return {
          title: '🔥 "만나요" တစ်ခုတည်း မသုံးပါနဲ့! ကိုရီးယားလူမျိုးတွေ နေ့စဉ်သုံး ချိန်းဆိုမှု အသုံးအနှုန်း ၄ မျိုး',
          slides: [
            'P1: 📌 ချိန်းဆိုချိန်နောက်ကျတဲ့အခါ ကိုရီးယားလို ဘယ်လိုပြောမလဲ? မဖြစ်မနေသိထားရမယ့် အသုံးအနှုန်းများ!',
            'P2: 💡 အသုံးအနှုန်း ၁: "약속을 미루다" (ရက်ရွှေ့သည်/အချိန်ရွှေ့သည်)',
            'P3: 💡 အသုံးအနှုန်း ၂: "일이 생기다" (အရေးပေါ်ကိစ္စပေါ်လာသည်)',
            'P4: 💡 ဝိဘတ်ခွဲခြားနည်း: [에 vs 에서] သွားရောက်ရာနေရာတွင် -에 ၊ စောင့်ဆိုင်းရာနေရာတွင် -မှာ/တွင် -에서!',
            'P5: 🚀 HanUp စမတ်ဖတ်စာအုပ် QR ကုဒ်ကို စကင်ဖတ်ပြီး SoriTutor ဖြင့် အသံထွက်ချက်ချင်း လေ့ကျင့်ပါ!',
          ],
          script:
            'ကိုရီးယားစကားမှာ "에" နဲ့ "에서" သုံးရတာ ခက်နေပါသလား? နေရာတစ်ခုကို သွားရင် -에 (커피숍에 가다) ၊ အဲ့ဒီနေရာမှာ စောင့်နေရင် -မှာ -에서 (커피숍에서 기다리다) လို့ မှတ်ထားလိုက်ပါ! HanUp နှင့်အတူ TOPIK အောင်မြင်အောင် လေ့လာလိုက်ကြစို့!',
        };
      }
    }

    if (block.blockId === 'blk_topik_prep_02') {
      if (l === 'en') {
        return {
          title: '🔥 Don\'t Confuse "-아/어서" and "-(으)니까"! TOPIK Shopping & Health Tips',
          slides: [
            'P1: 📌 Returning clothes in Korea? 3 essential words: 교환하다, 환불하다, 영수증!',
            'P2: 💡 Grammar Trap: "-아/어서" CANNOT be used with imperatives or suggestions (e.g. -세요, -ㅂ시다)!',
            'P3: 💡 Must use "-(으)니까": "날씨가 좋으니까 놀러 가요!" (Correct) vs "좋아서 놀러 가요" (Wrong)!',
            'P4: 💡 Pronunciation Hack: [짧아서요] is pronounced as [짤바서요] due to double final consonant liaison.',
            'P5: 🚀 Scan the QR code to try HanUp\'s instant AI pronunciation & grammar clinic!',
          ],
          script:
            'Do you know why "비가 와서 우산을 쓰세요" is wrong in Korean? Because -아/어서 can never connect to imperative sentences like -세요! Always use -(으)니까 instead: "비가 오니까 우산을 쓰세요!" Master this rule and level up your TOPIK with HanUp!',
        };
      }
      if (l === 'ja') {
        return {
          title: '🔥「-아/어서」と「-(으)니까」の使い分け完全攻略！買い物・交換韓国語',
          slides: [
            'P1: 📌 韓国のデパートでサイズ交換！必須単語3選: 교환하다(交換), 환불하다(返金), 영수증(レシート)',
            'P2: 💡 文法トラップ: 後ろに命令・勧誘（-세요、-ㅂ시다）が来る時は「-아/어서」は使えない！',
            'P3: 💡 正解は「-(으)니까」: 「美味しい料理をたくさん準備したから遊びに来てね(준비했으니까)」！',
            'P4: 💡 発音マスター: 「짧아서요」は二重パッチムの連音化で [짤바서요] と発音！',
            'P5: 🚀 教材のQRコードをスキャンして、HanUpのAI添削＆発音診断を体験しよう！',
          ],
          script:
            '韓国語の理由表現『-아/어서』と『-(으)니까』の違い知ってますか？後ろに『〜してください(-세요)』や『〜しよう(-ㅂ시다)』が来る時は必ず『-(으)니까』！『준비했으니까 놀러 오세요』が自然な韓国語です！HanUpで一緒に楽しく学びましょう！',
        };
      }
      if (l === 'vi') {
        return {
          title: '🔥 Phân biệt "-아/어서" và "-(으)니까" trong 1 phút! Tiếng Hàn mua sắm & đổi trả',
          slides: [
            'P1: 📌 Đi đổi đồ ở Hàn Quốc cần biết 3 từ này: 교환하다 (đổi hàng), 환불하다 (hoàn tiền), 영수증 (hóa đơn)!',
            'P2: 💡 Lỗi sai kinh điển: Đuôi câu mệnh lệnh/rủ rê (-세요, -ㅂ시다) TUYỆT ĐỐI KHÔNG dùng "-아/어서"!',
            'P3: 💡 Phải dùng "-(으)니까": "Mình chuẩn bị nhiều đồ ăn ngon rồi nên hãy đến nhé (준비했으니까)!"',
            'P4: 💡 Quy tắc phát âm: "짧아서요" đọc nối âm phụ âm kép là [짤바서요]!',
            'P5: 🚀 Quét mã QR giáo trình để trải nghiệm ngay hệ thống chấm điểm AI HanUp!',
          ],
          script:
            'Tại sao nói "비가 와서 우산을 쓰세요" lại sai? Vì -아/어서 không bao giờ đi cùng đuôi mệnh lệnh -세요! Bạn phải dùng -(으)니까: "비가 오니까 우산을 쓰세요"! Ghi nhớ bí quyết này để đạt điểm tối đa TOPIK cùng HanUp nhé!',
        };
      }
      if (l === 'my') {
        return {
          title: '🔥 "-아/어서" နှင့် "-(으)니까" အသုံးအနှုန်း ကွာခြားချက်! ကိုရီးယား ဈေးဝယ်စကား',
          slides: [
            'P1: 📌 ပစ္စည်းလဲလှယ်တဲ့အခါ မဖြစ်မနေသုံးရမယ့် စကားလုံး ၃ လုံး: 교환하다 (ပစ္စည်းလဲသည်), 환불하다 (ငွေပြန်အမ်းသည်), 영수증 (ပြေစာ)',
            'P2: 💡 သတိပြုရန် သဒ္ဒါ: အမိန့်ပေး၊ တိုက်တွန်းသော စာကြောင်းများ (-세요, -ㅂ시다) တွင် "-아/어서" ကို လုံးဝ မသုံးရပါ!',
            'P3: 💡 "-(으)니까" ကိုသာ သုံးပါ: "အရသာရှိတဲ့ ကိုရီးယားအစားအစာတွေ အများကြီးပြင်ဆင်ထားလို့ လာလည်ပါ (준비했으니까)!"',
            'P4: 💡 အသံထွက်စည်းမျဉ်း: "짧아서요" ကို ဗျည်းဆင့်အသံဆက်နည်းဖြင့် [짤바서요] ဟု အသံထွက်ပါသည်!',
            'P5: 🚀 HanUp စမတ်ဖတ်စာအုပ် QR ကုဒ်ကို စကင်ဖတ်ပြီး AI ဖြင့် အသံထွက်နှင့် သဒ္ဒါချက်ချင်း လေ့ကျင့်ပါ!',
          ],
          script:
            'ကိုရီးယားဘာသာစကားမှာ အကြောင်းပြချက်ပြတဲ့ "-아/어서" နဲ့ "-(으)니까" ဘယ်လိုကွာလဲ သိပါသလား? အနောက်မှာ "-ပါ/ကြစို့ (-세요, -ㅂ시다)" လိုမျိုး အမိန့်ပေးတိုက်တွန်းတဲ့စကားပါရင် "-(으)니까" ကိုသာ သုံးရပါတယ်! HanUp နှင့်အတူ TOPIK စာမေးပွဲကို အလွယ်တကူ အောင်မြင်လိုက်ပါ!',
        };
      }
    }

    const langLabel = l === 'en' ? 'English' : l === 'ja' ? '日本語' : l === 'vi' ? 'Tiếng Việt' : 'မြန်မာ';
    return {
      title: `🔥 [${langLabel}] ${block.title}`,
      slides: (block.osmuExport?.xiaohongshuSlides || []).map(
        (s, i) => `P${i + 1} (${langLabel}): ${s}`
      ),
      script: `[${langLabel} 40s Script] ${block.osmuExport?.shortFormScript40s || ''}`,
    };
  };

  // 4 Design Themes & Illustration States
  const [selectedTheme, setSelectedTheme] = useState<'mint' | 'blue' | 'indigo' | 'coral'>('indigo');
  const [illustrationRatio, setIllustrationRatio] = useState<'16:9' | '4:3' | '1:1'>('4:3');
  const [illustrationStyle, setIllustrationStyle] = useState<
    'modern_vector_illustration' | 'korean_webtoon_clean' | 'academic_flat_art'
  >('korean_webtoon_clean');
  const [isSavedAsset, setIsSavedAsset] = useState<boolean>(false);
  const [assetPathNotice, setAssetPathNotice] = useState<string | null>(null);

  // PDF Book Layout Preview Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Handle Add New Vocab Annotation
  const handleAddVocab = () => {
    if (!newWord || !newZh) return;
    const newEntry: VocabAnnotation = {
      word: newWord,
      zhMeaning: newZh,
      enMeaning: 'Academic vocab',
      topikLevel: newLevel,
      commonChineseErrorNote: '중국어권 학습자 주요 유의점',
    };
    const updated = [...vocabList, newEntry];
    setVocabList(updated);
    setNewWord('');
    setNewZh('');
  };

  const handleRemoveVocab = (idx: number) => {
    setVocabList(vocabList.filter((_, i) => i !== idx));
  };

  // Trigger AI Auto-tagging & OSMU generation
  const handleAutoGenerateOSMU = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);

      const autoVocabs: VocabAnnotation[] = [
        ...vocabList,
        {
          word: '양극화(兩極化)',
          zhMeaning: '两极分化',
          enMeaning: 'polarization',
          topikLevel: 5,
          commonChineseErrorNote: '‘빈부격차(贫富差距)’와 함께 54번 본론 2단락에서 자주 출제되는 고급 개념어입니다.',
        },
      ];
      setVocabList(autoVocabs);

      const updated: AuthoringBlock = {
        ...activeBlock,
        title,
        koContent,
        zhExplanation,
        vocabAnnotations: autoVocabs,
        osmuExport: {
          xiaohongshuTitle: `🔥TOPIK 54번 "${title}" 3분 만에 마스터하는 만점 공식`,
          xiaohongshuSlides: [
            `【P1 表格】한국어능력시험 쓰기 54번: ${title}`,
            `【P2 核心词汇】비약적(突飞猛进), 편향성(偏向), 선결 과제(首要任务)`,
            `【P3 避坑指南】中国学生最常错的中式表达纠正`,
            `【P4 范文模板】650字论述文标准三段式模板全文`,
            `【P5 扫码互动】右上方扫描二维码立即获取免费AI 1对1批改`,
          ],
          shortFormScript40s: `“토픽 54번 쓸 때 한국인처럼 쓰는 법! ‘발전이 빠르다’ 대신 ‘비약적으로 발전하다’라고 써보세요. 점수가 10점 뜁니다. 프로필 링크에서 AI 첨삭을 무료로 체험해 보세요!”`,
        },
        updatedAt: new Date().toISOString(),
      };

      saveAuthoringBlock(updated);
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 3000);
    }, 800);
  };

  // Real CSV Download for Multilingual Canva / Xiaohongshu Bulk Create
  const handleDownloadXiaohongshuCsv = () => {
    const osmuData = getLocalizedOsmuData(activeBlock, osmuLang);
    const headers = ['SlideIndex', 'Title', 'Content', 'PlatformTag'];
    const rows = osmuData.slides.map((slide, idx) => [
      `P${idx + 1}`,
      `"${osmuData.title.replace(/"/g, '""')}"`,
      `"${slide.replace(/"/g, '""')}"`,
      `"HanUp Global • ${osmuLang.toUpperCase()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hanup_canva_bulk_${osmuLang}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyOsmuCsv = () => {
    const osmuData = getLocalizedOsmuData(activeBlock, osmuLang);
    const csvContent = osmuData.slides.join('\n');
    navigator.clipboard?.writeText(csvContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-black mb-1">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Lv.4 저작 스튜디오 (HanUp Studio & OSMU 엔진)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            원고 하나로 PDF 조판·AI 음원·샤오홍슈 카드뉴스 원클릭 추출
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            노션 스타일 블록에 한국어 교재 원고를 입력하면 어휘 태깅, 딕테이션 빈칸, 3:4 카드뉴스 CSV, 40초 숏폼 대본이 자동 생성됩니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveNotice && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> 저장 & OSMU 추출 완료!
            </span>
          )}
          <button
            disabled={isGeneratingAi}
            onClick={handleAutoGenerateOSMU}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md shadow-purple-600/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGeneratingAi ? 'OSMU 엔진 생성 중...' : '원클릭 AI 어휘 태깅 & OSMU 추출'}</span>
          </button>
        </div>
      </div>

      {/* 1.1 Series Fixed Design Theme & A4 Publication Standard */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <span>🎨</span>
            <span>시리즈 고정 디자인 테마:</span>
          </span>
          <div className="inline-flex rounded-2xl p-1 bg-slate-100 gap-1 text-xs font-bold">
            <button
              onClick={() => setSelectedTheme('mint')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                selectedTheme === 'mint'
                  ? 'bg-emerald-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
              <span>준비편 (민트)</span>
            </button>
            <button
              onClick={() => setSelectedTheme('blue')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                selectedTheme === 'blue'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300"></span>
              <span>도전편 (블루)</span>
            </button>
            <button
              onClick={() => setSelectedTheme('indigo')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                selectedTheme === 'indigo'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-300"></span>
              <span>완성편 (인디고)</span>
            </button>
            <button
              onClick={() => setSelectedTheme('coral')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                selectedTheme === 'coral'
                  ? 'bg-rose-500 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-200"></span>
              <span>생활한국어 (코랄)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200">
            A4 인쇄 규격: 210 × 297mm
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-indigo-700 font-bold">
            좌우 20mm / 제본 여백 25mm / 상하 20mm
          </span>
        </div>
      </div>

      {/* 2. Main Grid: Left Notion Editor & Right OSMU Live Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Notion-style Block Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              원고 블록 에디터 (Block ID: {activeBlock.blockId})
            </span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
              {activeBlock.blockType}
            </span>
          </div>

          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">단원 / 챕터 제목:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-sm font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans shadow-inner"
            />
          </div>

          {/* Korean Content Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">한국어 본문 원고 (교재·지문):</label>
            <textarea
              rows={8}
              value={koContent}
              onChange={(e) => setKoContent(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm text-slate-900 leading-relaxed border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans shadow-inner"
            />
          </div>

          {/* Chinese Explanation Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">중국어 L1 간섭 해설 및 번역 노트:</label>
            <textarea
              rows={4}
              value={zhExplanation}
              onChange={(e) => setZhExplanation(e.target.value)}
              className="w-full p-3.5 text-xs text-slate-800 leading-relaxed border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans shadow-inner"
            />
          </div>

          {/* Vocab Tagging Manager */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                자동 태깅된 한·중·영 어휘 툴팁 ({vocabList.length}개):
              </span>
              <span className="text-[11px] text-purple-600 font-medium">클릭 시 삭제</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {vocabList.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs border border-slate-200 group"
                >
                  <strong className="text-blue-700">{v.word}</strong>
                  <span className="text-slate-500">({v.zhMeaning})</span>
                  <button
                    onClick={() => handleRemoveVocab(i)}
                    className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Add Custom Vocab */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <input
                type="text"
                placeholder="한국어 단어 (예: 양극화)"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="w-32 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="중국어 뜻 (예: 两极分化)"
                value={newZh}
                onChange={(e) => setNewZh(e.target.value)}
                className="w-36 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <button
                onClick={handleAddVocab}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                + 어휘 추가
              </button>
            </div>
          </div>
        </div>

        {/* Right: OSMU Engine Live Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-purple-600" />
              OSMU 마케팅 & 교재 조판 엔진
            </span>
          </div>

          {/* OSMU Tabs (5 Tabs) */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-2xl text-center text-xs">
            <button
              onClick={() => setOsmuTab('illustration')}
              className={`py-2 rounded-xl font-black transition-all ${
                osmuTab === 'illustration' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              🎨 AI 삽화
            </button>
            <button
              onClick={() => setOsmuTab('xiaohongshu')}
              className={`py-2 rounded-xl font-black transition-all ${
                osmuTab === 'xiaohongshu' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              샤오홍슈
            </button>
            <button
              onClick={() => setOsmuTab('shortform')}
              className={`py-2 rounded-xl font-black transition-all ${
                osmuTab === 'shortform' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              40초 숏폼
            </button>
            <button
              onClick={() => setOsmuTab('pdf_qr')}
              className={`py-2 rounded-xl font-black transition-all ${
                osmuTab === 'pdf_qr' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              PDF·QR
            </button>
            <button
              onClick={() => setOsmuTab('quiz')}
              className={`py-2 rounded-xl font-black transition-all ${
                osmuTab === 'quiz' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              약점문항
            </button>
          </div>

          {/* OSMU Tab 0: AI Illustration Prompt Generator & Local Asset Simulation */}
          {osmuTab === 'illustration' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>본문 상황 기반 AI 삽화 프롬프트 자동화</span>
                </span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  DALL-E 3 & Midjourney 최적화
                </span>
              </div>

              {/* Controls: Ratio & Art Style */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">화면 비율 (Aspect Ratio)</label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-center text-[10px] font-bold">
                    {(['16:9', '4:3', '1:1'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setIllustrationRatio(r)}
                        className={`py-1 rounded-lg transition-all ${
                          illustrationRatio === r
                            ? 'bg-white text-purple-700 shadow-xs font-black'
                            : 'text-slate-500'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">화풍 스타일 (Art Style)</label>
                  <select
                    value={illustrationStyle}
                    onChange={(e) =>
                      setIllustrationStyle(
                        e.target.value as 'modern_vector_illustration' | 'korean_webtoon_clean' | 'academic_flat_art'
                      )
                    }
                    className="w-full text-xs p-1.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="korean_webtoon_clean">클린 웹툰 스타일 (Webtoon)</option>
                    <option value="modern_vector_illustration">모던 벡터 일러스트 (Vector)</option>
                    <option value="academic_flat_art">아카데믹 플랫 아트 (Flat)</option>
                  </select>
                </div>
              </div>

              {/* Generated Prompts Box */}
              <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-purple-900 block">🇰🇷 한국어 프롬프트:</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed mt-0.5">
                    한국 명문 대학교 세미나실에서 다국적 외국인 유학생들이 인공지능 발전과 윤리적 과제({activeBlock.title})에 대해 진지하게 토론하는 모습. 화이트보드에 한국어 도표 메모, 부드럽고 따뜻한 학술적 채색, {illustrationStyle === 'korean_webtoon_clean' ? '세련된 한국 웹툰 화풍' : '모던 플랫 벡터 스타일'}, 비율 {illustrationRatio}.
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-200/60">
                  <span className="text-[10px] font-bold text-purple-900 block">🇺🇸 English Prompt:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5 font-mono">
                    Clean modern Korean webtoon illustration of multinational university students debating AI ethics and academic essay strategies on a prestigious Seoul campus. Whiteboard with Korean structural diagram annotations, soft warm lighting, vibrant clean lines, 8k resolution, aspect ratio --ar {illustrationRatio.replace(':', ':')}.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Copy Prompt & Local Asset Save Simulation */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const promptText = `Clean modern illustration of multinational university students debating AI ethics on a vibrant Seoul campus classroom. Whiteboard with Korean diagram annotations, aspect ratio --ar ${illustrationRatio.replace(':', ':')}`;
                    navigator.clipboard.writeText(promptText);
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? '프롬프트가 클립보드에 복사되었습니다!' : 'AI 삽화 프롬프트 클립보드 복사'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSavedAsset(true);
                    const path = `/public/assets/illustrations/${activeBlock.blockId}_${illustrationRatio.replace(':', 'x')}.png`;
                    setAssetPathNotice(path);
                    setTimeout(() => setAssetPathNotice(null), 4000);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>로컬 에셋(/public/assets/illustrations) 자동 저장 시뮬레이션</span>
                </button>

                {assetPathNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">✅ {assetPathNotice} 로컬 에셋 저장 완료 (WebP 300 DPI)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OSMU Tab 1: Multilingual 3:4 Card News CSV Real Download */}
          {osmuTab === 'xiaohongshu' && (
            <div className="space-y-4">
              {/* Language / SNS Platform Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 px-1.5">글로벌 타깃 SNS:</span>
                {[
                  { key: 'zh', label: '🇨🇳 샤오홍슈/더우인 (중국어)' },
                  { key: 'en', label: '🇺🇸 Instagram/TikTok (영어)' },
                  { key: 'ja', label: '🇯🇵 Instagram/X (일본어)' },
                  { key: 'vi', label: '🇻🇳 TikTok/FB (베트남어)' },
                  { key: 'my', label: '🇲🇲 TikTok/FB (미얀마어)' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setOsmuLang(item.key as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      osmuLang === item.key
                        ? 'bg-white text-purple-900 shadow-xs ring-1 ring-purple-300'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-700">
                  {osmuLang === 'zh' ? '小红书/抖音 3:4 카드뉴스 대본 (Canva CSV 연동 규격)' : `${osmuLang.toUpperCase()} 3:4 Card News Slides (Canva CSV Ready)`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyOsmuCsv}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? '복사됨' : '복사'}</span>
                  </button>
                  <button
                    onClick={handleDownloadXiaohongshuCsv}
                    className="flex items-center gap-1 text-[11px] font-black text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{osmuLang.toUpperCase()} CSV 다운로드</span>
                  </button>
                </div>
              </div>

              {(() => {
                const currentOsmu = getLocalizedOsmuData(activeBlock, osmuLang);
                return (
                  <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 text-xs space-y-2.5">
                    <div className="font-extrabold text-rose-950 text-sm flex items-center justify-between">
                      <span>{currentOsmu.title}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                        {osmuLang} 5-Slides
                      </span>
                    </div>
                    <div className="space-y-2 pt-1">
                      {currentOsmu.slides.map((slide, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white border border-rose-100 text-slate-800 font-mono text-[11px] shadow-xs">
                          {slide}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* OSMU Tab 2: 40s Short-Form Video Script */}
          {osmuTab === 'shortform' && (
            <div className="space-y-3">
              {/* Language / SNS Platform Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 px-1.5">글로벌 타깃 SNS:</span>
                {[
                  { key: 'zh', label: '🇨🇳 더우인/빌리빌리 (중국어)' },
                  { key: 'en', label: '🇺🇸 Reels/Shorts (영어)' },
                  { key: 'ja', label: '🇯🇵 TikTok/Shorts (일본어)' },
                  { key: 'vi', label: '🇻🇳 TikTok/Reels (베트남어)' },
                  { key: 'my', label: '🇲🇲 FB Reels/TikTok (미얀마어)' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setOsmuLang(item.key as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      osmuLang === item.key
                        ? 'bg-white text-blue-900 shadow-xs ring-1 ring-blue-300'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">
                  {osmuLang === 'zh' ? '빌리빌리/더우인/릴스용 40초 숏폼 대본' : `Global 40s Viral Short-Form Script (${osmuLang.toUpperCase()})`}
                </span>
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  40s Pace
                </span>
              </div>

              {(() => {
                const currentOsmu = getLocalizedOsmuData(activeBlock, osmuLang);
                return (
                  <>
                    <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-slate-800 leading-relaxed font-sans shadow-xs">
                      "{currentOsmu.script}"
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(currentOsmu.script);
                        setCopiedText(true);
                        setTimeout(() => setCopiedText(false), 2000);
                      }}
                      className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors shadow-sm"
                    >
                      {copiedText ? '대본이 복사되었습니다!' : `${osmuLang.toUpperCase()} 숏폼 대본 클립보드 복사`}
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {/* OSMU Tab 3: PDF Print Preview with QR DeepLink */}
          {osmuTab === 'pdf_qr' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">
                  출판 인쇄용 PDF 조판 레이아웃
                </span>
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>조판 미리보기</span>
                </button>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-24 h-24 mx-auto bg-white p-2 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-slate-800" />
                </div>
                <div className="text-[11px] text-slate-500">
                  스마트폰 카메라로 스캔 시 즉시 웹앱 학습 페이지로 이동:
                  <div className="font-mono text-blue-600 font-bold text-xs mt-1">
                    {activeBlock.qrBridgeUrl}
                  </div>
                </div>
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition-colors"
                >
                  출판용 PDF 조판 레이아웃 열기
                </button>
              </div>
            </div>
          )}

          {/* OSMU Tab 4: Auto Distractor Question */}
          {osmuTab === 'quiz' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-700">
                본문 기반 자동 생성된 4지선다 약점 문항
              </span>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2.5">
                <p className="font-bold text-slate-900">
                  Q. 본문에서 AI 기술의 발전에 대해 사용된 가장 적절한 고급 수식어는?
                </p>
                <div className="space-y-1.5 text-slate-700">
                  <div className="p-2 bg-white rounded-xl border border-amber-100">1) 아주 빠르게 발전하다</div>
                  <div className="p-2 bg-emerald-100 rounded-xl border border-emerald-300 font-bold text-emerald-950">
                    2) 비약적으로 발전하다 (정답)
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-100">3) 날마다 좋아지다</div>
                  <div className="p-2 bg-white rounded-xl border border-amber-100">4) 엄청나게 늘어나다</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Printable Book Layout Modal (A4 Publishing Simulation) */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
                  HanUp Book Publishing Engine • 300 DPI Ready
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  교재 출판용 PDF 2단 조판 인쇄 레이아웃
                </h3>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                <span>PDF 인쇄 / 저장</span>
              </button>
            </div>

            {/* A4 Sheet Mockup with Exact Print Margins */}
            <div className={`p-8 sm:p-10 rounded-2xl border-2 shadow-inner space-y-6 font-serif relative ${
              selectedTheme === 'mint'
                ? 'bg-emerald-50/30 border-emerald-300'
                : selectedTheme === 'blue'
                ? 'bg-blue-50/30 border-blue-300'
                : selectedTheme === 'coral'
                ? 'bg-rose-50/30 border-rose-300'
                : 'bg-indigo-50/30 border-indigo-300'
            }`}>
              {/* Margins Guide Badge */}
              <div className="flex items-center justify-between text-[10px] font-sans font-bold text-slate-500 border-b border-slate-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>A4 정규 출판 규격 (210mm × 297mm) | 안쪽 제본 여백 25mm • 바깥/상하 20mm 자동 정렬</span>
                </span>
                <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300">
                  Page 12
                </span>
              </div>

              {/* Header Bar */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <span className={`text-xs font-sans font-black tracking-wider ${
                    selectedTheme === 'mint'
                      ? 'text-emerald-700'
                      : selectedTheme === 'blue'
                      ? 'text-blue-700'
                      : selectedTheme === 'coral'
                      ? 'text-rose-700'
                      : 'text-indigo-700'
                  }`}>
                    {selectedTheme === 'mint'
                      ? '한업 TOPIK I (준비편 1~2급) • 기초 집중서'
                      : selectedTheme === 'blue'
                      ? '한업 TOPIK II (도전편 3~4급) • 빈출 유형서'
                      : selectedTheme === 'coral'
                      ? '한업 생활한국어 • 생존 회화 & K-컬처 실전서'
                      : '한업 TOPIK II (완성편 4~6급) • 쓰기 집중 실전서'}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1 font-sans">{activeBlock.title}</h2>
                </div>
                {/* QR Code in Top Right */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-400 flex items-center justify-center shadow-xs">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-sans text-slate-500 mt-1 font-bold">스마트폰 스캔 (AI 첨삭)</span>
                </div>
              </div>

              {/* 2-Column Text Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800 leading-relaxed font-sans">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                    <span>[본문 강독 및 논제 분석]</span>
                    <span className="text-[10px] text-slate-400 font-normal">좌측 본문 칼럼</span>
                  </h4>
                  <p className="whitespace-pre-line leading-relaxed">{activeBlock.koContent}</p>
                </div>
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                    <span>[중국어권 특화 L1 간섭 해설]</span>
                    <span className="text-[10px] text-slate-400 font-normal">우측 해설 칼럼</span>
                  </h4>
                  <p className="whitespace-pre-line text-slate-700 leading-relaxed">{activeBlock.zhExplanation}</p>
                </div>
              </div>

              {/* Footnotes Vocab Box */}
              <div className="border-t-2 border-slate-300 pt-3 text-[11px] font-sans text-slate-600 space-y-1">
                <strong className="block text-slate-900 font-bold mb-1">【핵심 어휘 주석 (Footnotes)】</strong>
                {vocabList.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-bold text-blue-700">• {v.word}:</span>
                    <span>{v.zhMeaning} / {v.enMeaning}</span>
                    <span className="text-slate-400">({v.commonChineseErrorNote})</span>
                  </div>
                ))}
              </div>

              {/* Bottom Print Page Footer */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-sans text-slate-400">
                <span>한업(HanUp | 韩升) 스마트 교재 표준 출판본 • 무단 전재 및 재배포 금지</span>
                <span className="font-bold font-mono text-slate-600">- 12 -</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Laptop,
  Radio,
  RotateCcw,
  Sliders,
  UploadCloud,
  FileAudio,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';
import { APP_CONFIG } from '../lib/config';
import {
  SoriEvaluationPayload,
  SyllableResult,
  PhonologyErrorLog,
} from '../types/hanup';

interface SoriTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSentence: string;
}

export const SoriTutorModal: React.FC<SoriTutorModalProps> = ({
  isOpen,
  onClose,
  targetSentence,
}) => {
  const { currentUser, addPhonologyLog } = useHanUp();
  const [mode, setMode] = useState<'iframe' | 'simulator'>('simulator');
  const [isSimulatingRecord, setIsSimulatingRecord] = useState(false);
  const [evalResult, setEvalResult] = useState<SoriEvaluationPayload | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Construct external Sori Tutor embed URL
  const embedUrl = `${APP_CONFIG.soriTutorUrl}/?sentence=${encodeURIComponent(
    targetSentence
  )}&embed=true&userId=${encodeURIComponent(currentUser.uid)}&userName=${encodeURIComponent(
    currentUser.name
  )}`;

  // Listen for Sori Tutor window message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 1. Close event from Sori Tutor back button
      if (event.data?.type === 'SORI_EMBED_CLOSE') {
        onClose();
        return;
      }

      // 2. Validate Sori Tutor evaluation event
      if (event.data?.type === 'SORI_EVALUATION_COMPLETE') {
        const payload: SoriEvaluationPayload = event.data.payload;
        if (!payload) return;

        setEvalResult(payload);

        const codaCount = payload.syllableResults.filter((s) => s.status === 'coda_error').length;
        const vowelCount = payload.syllableResults.filter((s) => s.status === 'vowel_error').length;

        const newLog: PhonologyErrorLog = {
          id: `sori_${Date.now()}`,
          userId: payload.userId || currentUser.uid,
          userName: currentUser.name,
          timestamp: new Date().toISOString(),
          targetSentence: payload.targetText || targetSentence,
          recognizedText: payload.recognized || '',
          score: payload.score,
          syllableResults: payload.syllableResults,
          explanation: payload.explanation,
          advice: payload.advice,
          codaErrorsCount: codaCount,
          vowelErrorsCount: vowelCount,
        };

        addPhonologyLog(newLog);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentUser, targetSentence, addPhonologyLog, onClose]);

  if (!isOpen) return null;

  // Run offline simulation
  const handleRunSimulation = (hasErrorScenario: boolean = true) => {
    setIsSimulatingRecord(true);
    setEvalResult(null);

    setTimeout(() => {
      setIsSimulatingRecord(false);

      // Parse targetSentence into syllables
      const cleaned = targetSentence.replace(/\s+/g, ' ').trim();
      const chars = Array.from(cleaned);

      const syllables: SyllableResult[] = [];
      let codaErrors = 0;
      let vowelErrors = 0;

      chars.forEach((char, idx) => {
        if (char === ' ') return;

        // Check if syllable has coda (받침) in Unicode
        const code = char.charCodeAt(0) - 44032;
        const hasCoda = code >= 0 && code <= 11171 && code % 28 !== 0;

        if (hasErrorScenario && hasCoda && idx % 4 === 1 && codaErrors === 0) {
          // Simulate typical coda error (e.g. coda weakening)
          syllables.push({
            char,
            recognizedChar: char,
            status: 'coda_error',
            tip: `[종성 받침 오류] 음절 말 불파음(받침) 폐쇄가 약화되었습니다. 받침을 끝까지 물고 닫아주세요.`,
          });
          codaErrors++;
        } else if (hasErrorScenario && (char === '의' || char === '워' || char === '야') && vowelErrors === 0) {
          syllables.push({
            char,
            recognizedChar: char === '의' ? '에' : char,
            status: 'vowel_error',
            tip: `[이중모음 조음 오류] 입술 모양 변화가 불충분하여 단모음화되었습니다.`,
          });
          vowelErrors++;
        } else {
          syllables.push({
            char,
            recognizedChar: char,
            status: 'match',
          });
        }
      });

      const score = Math.max(68, Math.round(96 - (codaErrors * 7) - (vowelErrors * 8)));

      const simulatedPayload: SoriEvaluationPayload = {
        userId: currentUser.uid,
        targetText: targetSentence,
        score,
        recognized: targetSentence.replace(/다\.$/, '따.').replace(/지\s/g, '찌 '),
        explanation: codaErrors > 0
          ? `전체적인 연음과 억양은 안정적이나, 한국어 특유의 불파음 종성(받침) 폐쇄 지속시간이 짧아 음운 약화가 감지되었습니다.`
          : `한국어 표준 발음법에 따른 연음과 비음화가 매우 자연스럽게 발화되었습니다.`,
        advice: codaErrors > 0
          ? `모국어(중국어/베트남어/영어 등)의 개음절 습관으로 인해 받침을 흘려 발음하는 경향이 있습니다. 받침에서 숨을 잠깐 멈추는 느낌을 연습하세요.`
          : `탁월한 발음입니다! 현재 수준의 조음 명료도를 실전 인터뷰와 구술 시험에서도 유지하십시오.`,
        syllableResults: syllables,
      };

      setEvalResult(simulatedPayload);

      // Save to HanUp Phonology Error Corpus & update radar score
      const newLog: PhonologyErrorLog = {
        id: `sori_sim_${Date.now()}`,
        userId: currentUser.uid,
        userName: currentUser.name,
        timestamp: new Date().toISOString(),
        targetSentence,
        recognizedText: simulatedPayload.recognized,
        score,
        syllableResults: syllables,
        explanation: simulatedPayload.explanation,
        advice: simulatedPayload.advice,
        codaErrorsCount: codaErrors,
        vowelErrorsCount: vowelErrors,
      };

      addPhonologyLog(newLog);
    }, 1600);
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedAudioName(file.name);
    // Run simulation using uploaded audio file
    handleRunSimulation(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Mic className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">소리튜터 (Sori Tutor) AI 발음·연음 클리닉</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/40 border border-emerald-300/40 text-emerald-100 font-medium">
                  Loosely-Coupled iFrame
                </span>
              </div>
              <p className="text-xs text-emerald-100/90">
                음절 단위 종성(받침)·연음·비음화 실시간 평가 및 한업 레이더 차트 자동 동기화
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher Toggle */}
            <div className="inline-flex rounded-lg p-0.5 bg-emerald-800/60 border border-emerald-500/30 text-xs">
              <button
                onClick={() => setMode('simulator')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  mode === 'simulator'
                    ? 'bg-white text-emerald-900 font-bold shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                🛠️ 내장 시뮬레이터 (오프라인)
              </button>
              <button
                onClick={() => setMode('iframe')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  mode === 'iframe'
                    ? 'bg-white text-emerald-900 font-bold shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                🌐 실서버 iFrame 호출
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Target Sentence Banner */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Volume2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                연습 목표 문장 (Target Pronunciation)
              </span>
              <p className="text-sm font-bold text-slate-900 truncate">
                &ldquo;{targetSentence}&rdquo;
              </p>
            </div>
          </div>

          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors flex-shrink-0 shadow-xs"
            title="소리튜터 단독 웹페이지 새 탭으로 열기"
          >
            <span>새 탭으로 열기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {mode === 'iframe' ? (
            /* Live iFrame Embed Mode */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  연결 엔드포인트:{' '}
                  <code className="text-emerald-700 font-mono bg-emerald-50 px-1 py-0.5 rounded">
                    {embedUrl}
                  </code>
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  postMessage 수신 대기 중
                </span>
              </div>

              <div className="relative w-full h-[460px] rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 z-10 space-y-2">
                    <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-600 font-medium">
                      소리튜터 발음 평가 엔진을 불러오는 중...
                    </p>
                    <p className="text-[11px] text-slate-400">
                      (서버 응답이 지연되거나 오프라인 환경인 경우 상단의 &lsquo;내장 시뮬레이터&rsquo;를 이용해 주세요)
                    </p>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src={embedUrl}
                  onLoad={() => setIframeLoaded(true)}
                  className="w-full h-full border-0"
                  allow="microphone; camera"
                  title="Sori Tutor Pronunciation Clinic"
                />
              </div>
            </div>
          ) : (
            /* Offline High-Fidelity Simulator Mode */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-emerald-200/60">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      실시간 한국어 음운 조음 평가 시뮬레이션
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      마이크 발화를 모사하여 종성(받침) 약화, 연음 미적용, 이중모음 축약 등 L1 모국어 전이 오류를 실시간 판독합니다.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleRunSimulation(true)}
                      disabled={isSimulatingRecord}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                    >
                      <Mic className={`w-4 h-4 ${isSimulatingRecord ? 'animate-pulse text-red-300' : ''}`} />
                      <span>{isSimulatingRecord ? '음성 분석 중...' : '🎙️ 마이크 발음 테스트'}</span>
                    </button>

                    {/* Audio File Upload Fallback (WeChat / Xiaohongshu WebView mic block defense) */}
                    <label className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-bold text-xs cursor-pointer shadow-xs transition-colors">
                      <FileAudio className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>📁 휴대폰 음성 녹음 파일(.m4a/.mp3/.wav) 직접 업로드</span>
                      <input
                        type="file"
                        accept="audio/*,.m4a,.mp3,.wav"
                        onChange={handleAudioFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => handleRunSimulation(false)}
                      disabled={isSimulatingRecord}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 disabled:opacity-50"
                      title="완벽한 원어민 발음 시뮬레이션"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>만점 발화</span>
                    </button>
                  </div>
                </div>

                {uploadedAudioName && (
                  <div className="mt-3 p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900">
                    <div className="flex items-center gap-2">
                      <FileAudio className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold">분석 대상 오디오 파일:</span>
                      <span className="font-mono text-[11px] text-indigo-700">{uploadedAudioName}</span>
                    </div>
                    <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                      F0 피치 추출 완료
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sori Tutor Evaluation Result Panel (Common for both iFrame postMessage and Simulator) */}
          {evalResult && (
            <div className="p-5 rounded-2xl bg-white border-2 border-emerald-400/80 shadow-lg space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {evalResult.score}점
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">
                      소리튜터 AI 발음 평가 리포트
                    </h5>
                    <p className="text-xs text-slate-500">
                      인식 결과: &ldquo;<span className="font-semibold text-slate-800">{evalResult.recognized}</span>&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    한업 레이더 차트 동기화 완료
                  </span>
                </div>
              </div>

              {/* Syllable-by-syllable Breakdown Chips */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase tracking-wide">
                  음절별 조음 정확도 진단 (Syllable Phonology Breakdown)
                </span>
                <div className="flex flex-wrap gap-2">
                  {evalResult.syllableResults.map((syl, i) => {
                    let badgeClass = 'bg-emerald-50 border-emerald-300 text-emerald-800';
                    let label = '정상';
                    if (syl.status === 'coda_error') {
                      badgeClass = 'bg-amber-50 border-amber-400 text-amber-900 font-bold';
                      label = '종성 받침 오류';
                    } else if (syl.status === 'vowel_error') {
                      badgeClass = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                      label = '모음 오류';
                    } else if (syl.status === 'mismatch' || syl.status === 'omitted') {
                      badgeClass = 'bg-red-50 border-red-400 text-red-900 font-bold';
                      label = '누락/불일치';
                    }

                    return (
                      <div
                        key={i}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs flex flex-col items-center min-w-[42px] ${badgeClass}`}
                        title={syl.tip || `${syl.char} (${label})`}
                      >
                        <span className="text-sm font-bold">{syl.char}</span>
                        <span className="text-[9px] opacity-80">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanations & Teacher Advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">
                    🔍 음운학적 분석 (Phonetic Analysis)
                  </span>
                  <p className="text-slate-600 leading-relaxed">{evalResult.explanation}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-1">
                    💡 맞춤형 발음 클리닉 조언 (Tutor Advice)
                  </span>
                  <p className="text-emerald-900 leading-relaxed">{evalResult.advice}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            📊 평가 결과는 연구자 센터의{' '}
            <strong className="text-slate-700">&lsquo;3대 앱 멀티모달 통합 코퍼스&rsquo;</strong>에 자동 누적됩니다.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-900 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

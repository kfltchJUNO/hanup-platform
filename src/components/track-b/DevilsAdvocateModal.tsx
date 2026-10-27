'use client';

import React, { useState } from 'react';
import {
  AudiencePersona,
  DevilsAdvocateResult,
} from '../../types/trackB';
import {
  Flame,
  AlertOctagon,
  HelpCircle,
  Lightbulb,
  Send,
  X,
  CheckCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface DevilsAdvocateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAudience: AudiencePersona;
  claim: string;
  warrant: string;
  devilsResult: DevilsAdvocateResult | null;
  isLoading: boolean;
  onRegenerate?: () => void;
  onSubmitCounterRebuttal: (counterRebuttalText: string) => void;
}

export const DevilsAdvocateModal: React.FC<DevilsAdvocateModalProps> = ({
  isOpen,
  onClose,
  selectedAudience,
  claim,
  warrant,
  devilsResult,
  isLoading,
  onRegenerate,
  onSubmitCounterRebuttal,
}) => {
  const [counterText, setCounterText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const minChars = 80;
  const currentChars = counterText.trim().length;

  const handleConfirmSubmit = () => {
    if (currentChars < minChars) {
      setErrorMsg(`재반박문은 최소 ${minChars}자 이상 작성해야 합니다. (현재: ${currentChars}자)`);
      return;
    }
    setErrorMsg(null);
    onSubmitCounterRebuttal(counterText.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-400/30">
              <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base">악마의 대변인 (Devil&apos;s Advocate) 반론 공박</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-[10px] font-bold uppercase tracking-wider">
                  Step 4 관문
                </span>
              </div>
              <p className="text-xs text-rose-200/80">
                대상 청중 [{selectedAudience.role}] 입장에서 제기하는 가장 날카로운 수사적 공격
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
              <p className="font-bold text-sm text-slate-800">
                악마의 대변인이 학습자의 주장과 이유를 분석하여 비판적 반론을 생성하고 있습니다...
              </p>
              <p className="text-xs text-slate-500">
                페렐만 신수사학의 가치 위계 충돌 지점을 추론 중입니다.
              </p>
            </div>
          ) : devilsResult ? (
            <>
              {/* 1. Rhetorical Conflict Banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{devilsResult.rhetoricalConflict}</span>
                </div>
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>반론 재생성</span>
                  </button>
                )}
              </div>

              {/* 2. Critical Rebuttal Box */}
              <div className="p-5 bg-rose-50/80 rounded-2xl border-2 border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-rose-600" />
                    청중 [{selectedAudience.role}] 대변인의 공박 문단:
                  </span>
                  <span className="text-[11px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded-lg font-bold">
                    거부 요인: {selectedAudience.frictionFactor}
                  </span>
                </div>
                <p className="text-sm font-sans text-slate-800 leading-relaxed font-medium">
                  {devilsResult.rebuttalText}
                </p>

                {/* Critical Question */}
                <div className="pt-3 border-t border-rose-200 text-xs bg-white/70 p-3 rounded-xl border border-rose-300/50">
                  <div className="flex items-start gap-1.5 text-rose-950 font-black">
                    <HelpCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>결정적 공박 질문:</span>
                  </div>
                  <p className="text-xs text-rose-900 font-semibold mt-1 pl-5">
                    &ldquo;{devilsResult.criticalQuestion}&rdquo;
                  </p>
                </div>
              </div>

              {/* 3. Suggested Counter-Rebuttal Strategies */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  수사학적 재반박(Counter-Rebuttal) 처방 가이드:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {devilsResult.suggestedCounterAngles.map((angle, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{angle}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Mandatory Counter-Rebuttal Input */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    학습자 재반박문 작성 (필수 과제):
                  </label>
                  <span
                    className={`text-xs font-mono font-bold ${
                      currentChars >= minChars ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {currentChars} / {minChars}자
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={counterText}
                  onChange={(e) => {
                    setCounterText(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="위 청중 대변인의 반론과 질문에 대해, 페렐만식 양보(Concession)와 새로운 실증 자료(D) 또는 조건(Q)을 활용하여 재반박(Counter-Rebuttal)을 작성하십시오..."
                  className="w-full p-4 rounded-2xl border border-slate-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-inner font-sans"
                />

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-bold animate-pulse">
                    ⚠️ {errorMsg}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              반론 데이터를 불러올 수 없습니다. 다시 시도해 주십시오.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
          >
            닫기
          </button>

          <button
            onClick={handleConfirmSubmit}
            disabled={isLoading || !devilsResult || currentChars < minChars}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs text-white transition-all shadow-md ${
              currentChars >= minChars && !isLoading
                ? 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 cursor-pointer shadow-rose-500/20'
                : 'bg-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>재반박 확정 및 논증 완료하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

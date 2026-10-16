'use client';

import React, { useState } from 'react';
import {
  X,
  Coffee,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  Award,
  ChevronRight,
  GraduationCap,
  Users,
  Mail,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { REPRESENTATIVE_CAMPUS_TIPS, CampusTipDetail } from '../mock/syllabusData';

interface CampusTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChapter?: number;
}

export function CampusTipModal({
  isOpen,
  onClose,
  initialChapter = 1,
}: CampusTipModalProps) {
  const [selectedTipNumber, setSelectedTipNumber] = useState<number>(initialChapter);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTip: CampusTipDetail =
    REPRESENTATIVE_CAMPUS_TIPS[selectedTipNumber] || REPRESENTATIVE_CAMPUS_TIPS[1];

  const handleCopyText = (key: string, text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedIndex(key);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* 1. Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-50 via-white to-indigo-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  쉬어가기 대학 & 대학원 캠퍼스 학업 TIP
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                  완성편 (4~6급) 전용
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                진도 제외 가이드 • 한국 명문대 학부·대학원 유학생 100인의 생존 노하우
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Episode Switcher Tabs (Episodes 01, 04, 10) */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">대표 에피소드:</span>
          <button
            onClick={() => setSelectedTipNumber(1)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
              selectedTipNumber === 1
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>01강: 교수님 이메일 템플릿</span>
          </button>
          <button
            onClick={() => setSelectedTipNumber(4)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
              selectedTipNumber === 4
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>04강: 조별과제(팀플) 생존법</span>
          </button>
          <button
            onClick={() => setSelectedTipNumber(10)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
              selectedTipNumber === 10
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>10강: 대학원 사전컨택 & 발제문</span>
          </button>
        </div>

        {/* 3. Main Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Hero Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-2xs">
                {currentTip.badge}
              </span>
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                제{currentTip.chapterNumber}강: {currentTip.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {currentTip.intro}
            </p>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {currentTip.sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4"
              >
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
                    <span>{section.heading}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{section.description}</p>
                </div>

                {/* Bullets */}
                {section.bullets && (
                  <ul className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-800">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Templates (With Copy Button) */}
                {section.templates && (
                  <div className="space-y-3">
                    {section.templates.map((tpl, tIdx) => {
                      const copyKey = `tpl_${selectedTipNumber}_${idx}_${tIdx}`;
                      const isCopied = copiedIndex === copyKey;
                      return (
                        <div
                          key={tIdx}
                          className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900">{tpl.label}</span>
                            <button
                              onClick={() => handleCopyText(copyKey, tpl.text)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                                isCopied
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white hover:bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? '복사 완료!' : '템플릿 복사'}</span>
                            </button>
                          </div>
                          <pre className="p-3 bg-white rounded-xl border border-amber-100 text-xs font-sans whitespace-pre-wrap leading-relaxed text-slate-800">
                            {tpl.text}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Caution Alert */}
                {section.caution && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{section.caution}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>※ 본 캠퍼스 팁은 TOPIK 쓰기 평가 진도율 및 테스트 점수에 영향을 주지 않는 자유 열람 콘텐츠입니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shrink-0"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}

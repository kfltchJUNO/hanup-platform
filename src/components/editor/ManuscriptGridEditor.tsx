'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrackBKeystrokeLog, TrackBKeystrokeEvent } from '../../types/trackB';
import { Grid, FileText, ShieldAlert, Clock, Sparkles } from 'lucide-react';

interface ManuscriptGridEditorProps {
  value: string;
  onChange: (text: string) => void;
  onTelemetryChange?: (telemetry: TrackBKeystrokeLog) => void;
  placeholder?: string;
  minChars?: number;
  targetMaxChars?: number;
  blockExternalPasteDefault?: boolean;
  disabled?: boolean;
  showTelemetryBadge?: boolean;
}

export const ManuscriptGridEditor: React.FC<ManuscriptGridEditorProps> = ({
  value,
  onChange,
  onTelemetryChange,
  placeholder = '원고지에 작성할 글을 입력하십시오...',
  minChars = 300,
  targetMaxChars = 800,
  blockExternalPasteDefault = false,
  disabled = false,
  showTelemetryBadge = true,
}) => {
  const [editorMode, setEditorMode] = useState<'normal' | 'grid'>('grid');
  const [blockExternalPaste, setBlockExternalPaste] = useState(blockExternalPasteDefault);

  // Telemetry state
  const [pasteCount, setPasteCount] = useState(0);
  const [pastedChars, setPastedChars] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [totalKeyStrokes, setTotalKeyStrokes] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const eventsBufferRef = useRef<TrackBKeystrokeEvent[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const charCount = value.trim().length;

  // Calculate CPM (Characters Per Minute)
  const activeDurationMs = Math.max(1000, Date.now() - startTimeRef.current);
  const minutes = activeDurationMs / 60000;
  const cpm = minutes > 0 ? Math.round(charCount / minutes) : 0;
  const isSuspectedExternalAi = pasteCount >= 3 || (cpm > 800 && backspaceCount === 0);

  // Debounced telemetry flush (500ms)
  const flushTelemetry = useCallback(() => {
    if (!onTelemetryChange) return;

    const log: TrackBKeystrokeLog = {
      totalKeyStrokes,
      backspaceCount,
      pasteCount,
      pastedChars,
      activeDurationMs: Math.max(1000, Date.now() - startTimeRef.current),
      cpm,
      events: [...eventsBufferRef.current],
      isSuspectedExternalAi,
    };

    onTelemetryChange(log);
  }, [totalKeyStrokes, backspaceCount, pasteCount, pastedChars, cpm, isSuspectedExternalAi, onTelemetryChange]);

  const scheduleTelemetryFlush = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      flushTelemetry();
    }, 500);
  }, [flushTelemetry]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Manuscript 20-cells parser
  const parseManuscriptGrid = (text: string) => {
    const paragraphs = text.split('\n');
    const rawRows: { chars: string[] }[] = [];

    paragraphs.forEach((para) => {
      // Rule: Paragraph begins with 1 blank space indent
      const formatted = ' ' + para;
      for (let i = 0; i < formatted.length; i += 20) {
        const line = formatted.slice(i, i + 20).padEnd(20, ' ');
        rawRows.push({ chars: line.split('') });
      }
    });

    const targetMinRows = Math.max(25, rawRows.length + 3);
    while (rawRows.length < targetMinRows) {
      rawRows.push({ chars: Array(20).fill(' ') });
    }

    return rawRows.map((r, idx) => {
      const charAccum = (idx + 1) * 20;
      let targetLabel: string | undefined = undefined;
      let badgeColor = 'bg-slate-100 text-slate-500';

      if (charAccum === 200) {
        targetLabel = '200자 기준';
        badgeColor = 'bg-amber-100 text-amber-800 font-bold';
      } else if (charAccum === 400) {
        targetLabel = '★ 400자 (핵심 논증선)';
        badgeColor = 'bg-blue-100 text-blue-800 font-bold ring-1 ring-blue-300';
      } else if (charAccum === 600) {
        targetLabel = '★ 600자 (권장 목표선)';
        badgeColor = 'bg-emerald-100 text-emerald-800 font-black ring-1 ring-emerald-400';
      } else if (charAccum === 800) {
        targetLabel = '800자 (상한선)';
        badgeColor = 'bg-rose-100 text-rose-700 font-bold';
      }

      return { ...r, targetLabel, badgeColor, charAccum };
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setTotalKeyStrokes((prev) => prev + 1);

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setBackspaceCount((prev) => prev + 1);
      eventsBufferRef.current.push({
        timestamp: Date.now(),
        keyType: 'backspace',
        charDelta: -1,
        textLength: Math.max(0, value.length - 1),
      });
    } else if (e.key.length === 1) {
      eventsBufferRef.current.push({
        timestamp: Date.now(),
        keyType: 'char',
        charDelta: 1,
        textLength: value.length + 1,
      });
    }

    scheduleTelemetryFlush();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (blockExternalPaste) {
      e.preventDefault();
      alert('⚠️ 외부 복사-붙여넣기가 차단되었습니다. 논증 역량 검증을 위해 직접 타이핑해 주십시오.');
      return;
    }

    const pasted = e.clipboardData.getData('text');
    setPasteCount((prev) => prev + 1);
    setPastedChars((prev) => prev + pasted.length);

    eventsBufferRef.current.push({
      timestamp: Date.now(),
      keyType: 'paste',
      charDelta: pasted.length,
      textLength: value.length + pasted.length,
    });

    scheduleTelemetryFlush();
  };

  return (
    <div className="space-y-3 font-sans">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button
            type="button"
            onClick={() => setEditorMode('normal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              editorMode === 'normal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>일반 에디터</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              editorMode === 'grid'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>20칸 표준 원고지</span>
          </button>
        </div>

        {/* Telemetry & Controls */}
        <div className="flex items-center gap-2">
          {showTelemetryBadge && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-mono">
              <span className="text-slate-600">CPM: <strong>{cpm}</strong></span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">수정: <strong>{backspaceCount}</strong>회</span>
              <span className="text-slate-300">|</span>
              <span className={pasteCount > 0 ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                붙여넣기: <strong>{pasteCount}</strong>회
              </span>
            </div>
          )}

          <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 cursor-pointer bg-white px-2.5 py-1 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={blockExternalPaste}
              onChange={(e) => setBlockExternalPaste(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span>외부 붙여넣기 차단</span>
          </label>

          <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800">
            총 <strong>{charCount}</strong>자
          </span>
        </div>
      </div>

      {/* 2. Editor Container */}
      {editorMode === 'normal' ? (
        <div className="space-y-1">
          <textarea
            rows={12}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              onChange(e.target.value);
              scheduleTelemetryFlush();
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner font-sans"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Virtual Grid Input Sync Box */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="font-bold text-slate-700">단일 버퍼 입력창 (도깨비불 한글 조합 깨짐 방지):</span>
              <span>입력 즉시 아래 20칸 규격 원고지 격자에 실시간 렌더링됩니다.</span>
            </div>
            <textarea
              rows={4}
              value={value}
              disabled={disabled}
              onChange={(e) => {
                onChange(e.target.value);
                scheduleTelemetryFlush();
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder}
              className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner font-sans"
            />
          </div>

          {/* 20-cells per row paper sheet */}
          <div className="border-2 border-amber-300/80 rounded-2xl p-4 bg-[#fcfaf2] overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-300/70 text-xs text-amber-950 font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span>표준 학술 원고지 답안지 (줄당 가로 20칸 규격 • 문단 첫 칸 자동 들여쓰기)</span>
              </div>
              <span className="text-slate-600 font-mono text-xs font-semibold">
                총 {charCount}자 / 권장 {minChars}~{targetMaxChars}자
              </span>
            </div>

            <div className="space-y-1.5 min-w-[620px] pb-2">
              {parseManuscriptGrid(value).map((row, rIdx) => (
                <div key={rIdx} className="flex items-center gap-2">
                  <span className="w-7 text-[10px] text-amber-800/60 font-mono text-right select-none">
                    {rIdx + 1}
                  </span>

                  <div className="flex border border-amber-300/70 bg-white/90 shadow-xs rounded-sm">
                    {row.chars.map((char, cIdx) => (
                      <div
                        key={cIdx}
                        className={`w-6 h-7 sm:w-7 sm:h-8 flex items-center justify-center border-r border-amber-200/60 text-xs sm:text-sm font-sans font-medium ${
                          cIdx === 19 ? 'border-r-0' : ''
                        } ${char !== ' ' ? 'text-slate-900 font-semibold' : 'text-transparent'}`}
                      >
                        {char === ' ' ? '·' : char}
                      </div>
                    ))}
                  </div>

                  {row.targetLabel ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${row.badgeColor}`}>
                      {row.targetLabel}
                    </span>
                  ) : (
                    <span className="w-16 text-[10px] text-slate-400 font-mono select-none">
                      {row.charAccum}자
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

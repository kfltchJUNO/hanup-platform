'use client';

import React, { useState } from 'react';
import {
  X,
  School,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  FileJson,
  Users,
  Clock,
  Tag,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';
import {
  UriBanSyncPackage,
  uribanToHanUp,
  hanUpToUriBan,
  generateSampleUriBanPackage,
} from '../lib/adapters/uribanAdapter';

interface UriBanSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UriBanSyncModal: React.FC<UriBanSyncModalProps> = ({ isOpen, onClose }) => {
  const { classes, submissions, importUriBanPackage } = useHanUp();
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Load sample package for instant one-click testing
  const handleLoadSample = () => {
    const sample = generateSampleUriBanPackage();
    setJsonInput(JSON.stringify(sample, null, 2));
    setParseError(null);
    setSyncSuccessMsg(null);
  };

  // Execute import
  const handleExecuteImport = () => {
    try {
      setParseError(null);
      setSyncSuccessMsg(null);

      if (!jsonInput.trim()) {
        setParseError('우리반 JSON 패키지 데이터를 입력하거나 상단의 샘플을 불러와주세요.');
        return;
      }

      const parsed: UriBanSyncPackage = JSON.parse(jsonInput);
      if (!parsed.submissions || !Array.isArray(parsed.submissions)) {
        throw new Error('유효한 UriBan 패키지 형식이 아닙니다 (submissions 필드 누락).');
      }

      const { classes: newClasses, submissions: newSubs } = uribanToHanUp(parsed);
      const result = importUriBanPackage(newClasses, newSubs);

      setSyncSuccessMsg(
        `✅ 동기화 성공! 우리반 학급 ${result.classesCount}개와 작문 제출물 ${result.submissionsCount}건이 한업 데이터베이스로 무충돌 통합되었습니다.`
      );
    } catch (err: any) {
      setParseError(`JSON 파싱 실패: ${err.message || '데이터 구조를 확인해 주세요.'}`);
    }
  };

  // Prepare export package
  const exportPackage = hanUpToUriBan(classes, submissions);
  const exportJsonStr = JSON.stringify(exportPackage, null, 2);

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportJsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadExport = () => {
    const blob = new Blob([exportJsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uriban_sync_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <School className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">우리반(UriBan) 학급 & 작문 데이터 양방향 동기화</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/40 border border-purple-300/40 text-purple-100 font-medium">
                  Adapter v1.0
                </span>
              </div>
              <p className="text-xs text-purple-100/90">
                학급 명단, 작성 소요시간(activeDurationMs), 복사 시도(pasteAttempts), 8대 오류 태그 무충돌 동기화
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'import'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>우리반 JSON 가져오기 (Import)</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'export'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>우리반 규격으로 내보내기 (Export)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'import' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  우리반(UriBan) LMS에서 내보낸 학급 및 과제 제출물 JSON을 붙여넣으세요.
                </span>
                <button
                  onClick={handleLoadSample}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold border border-purple-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>샘플 패키지 자동 로드</span>
                </button>
              </div>

              <textarea
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{\n  "version": "1.0",\n  "source": "uriban",\n  "schools": [...],\n  "submissions": [...]\n}'
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-900 text-slate-100 resize-none leading-relaxed"
              />

              {parseError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {syncSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{syncSuccessMsg}</span>
                </div>
              )}

              {/* Supported Schema Highlights */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">학급 & 학생 매핑</span>
                    <p className="text-[11px] text-slate-500">SchoolData & AppUser</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">작문 행동 로그</span>
                    <p className="text-[11px] text-slate-500">activeDurationMs, pasteAttempts</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">8대 오류 태그</span>
                    <p className="text-[11px] text-slate-500">조사, 시제, 어휘, 어순 등</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  현재 한업의 학급({classes.length}개) 및 작문 제출물({submissions.length}건)이 우리반 포맷으로 변환되었습니다.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? '복사됨!' : 'JSON 복사'}</span>
                  </button>
                  <button
                    onClick={handleDownloadExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.json 파일 저장</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={11}
                value={exportJsonStr}
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 bg-slate-900 text-slate-100 resize-none leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            우리반 URL:{' '}
            <code className="text-purple-700 font-mono bg-purple-50 px-1 py-0.5 rounded">
              http://localhost:3001
            </code>
          </span>
          <div className="flex items-center gap-2">
            {activeTab === 'import' && (
              <button
                onClick={handleExecuteImport}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-sm transition-all"
              >
                한업으로 동기화 적용
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

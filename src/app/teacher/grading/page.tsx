'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  User,
  Clock,
  ArrowRight,
  Send,
  Check,
  ShieldCheck,
  AlertCircle,
  FileText,
  ThumbsUp,
  MessageSquare,
  Award,
  ChevronRight,
  Split,
  Eye,
  Plus,
  Minus,
  CheckCheck,
  School,
} from 'lucide-react';
import { useHanUp } from '../../../context/HanUpContext';
import { UriBanSyncModal } from '../../../components/UriBanSyncModal';

export default function TeacherGradingQueuePage() {
  const { submissions, updateInstructorReview, currentUser } = useHanUp();
  const [isUriBanModalOpen, setIsUriBanModalOpen] = useState(false);

  // Selected submission in the grading queue
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.submissionId || '');
  const activeSubmission = submissions.find((s) => s.submissionId === selectedSubId) || submissions[0];

  // Review Form State
  const [approvedAi, setApprovedAi] = useState<boolean>(
    activeSubmission?.instructorFeedback?.approvedAiFeedback ?? true
  );
  const [teacherComment, setTeacherComment] = useState<string>(
    activeSubmission?.instructorFeedback?.teacherComment ||
      '웨이 학생! 논리 뼈대는 잘 잡았어요. 결론에서 지적된 "선결 과제" 표현을 적용해 분량을 늘려 다시 제출해 보세요.'
  );
  const [finalScore, setFinalScore] = useState<number>(
    activeSubmission?.instructorFeedback?.finalScore ||
      activeSubmission?.aiFeedback.estimatedScore || 36
  );
  const [isSuccessNotice, setIsSuccessNotice] = useState<boolean>(false);

  // Tab: AI Feedback Review vs Student Revision Comparison
  const [viewTab, setViewTab] = useState<'review' | 'compare'>('review');

  // AI item-level approval toggles
  const [approvedGrammarIndices, setApprovedGrammarIndices] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });
  const [approvedToneIndices, setApprovedToneIndices] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  // Quick Comment Presets
  const quickPresets = [
    { label: '🏆 논리 뼈대 우수', text: '논리적 뼈대와 3단 구성이 매우 훌륭합니다. 결론부 어휘만 고급화하면 6급 수준입니다.' },
    { label: '💡 선결 과제 강조', text: '결론에서 AI가 제안한 "선결 과제" 표현을 반드시 적용하여 대책의 설득력을 높여보세요.' },
    { label: '⚠️ 번역투 교정 필요', text: '중국어 직역 표현이 다소 어색합니다. 피드백에 안내된 자연스러운 학술 어휘로 교정해 보세요.' },
    { label: '📏 분량 600자 보강', text: '현재 분량이 다소 부족합니다. 본론 2단락에 구체적인 기술 부작용 사례를 2문장 추가하세요.' },
  ];

  const handleApplyPreset = (text: string) => {
    setTeacherComment(text);
  };

  const handleConfirmReview = () => {
    if (!activeSubmission) return;
    updateInstructorReview(activeSubmission.submissionId, teacherComment, finalScore, approvedAi);
    setIsSuccessNotice(true);
    setTimeout(() => setIsSuccessNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Human-in-the-Loop AI 2차 검수 데스크</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            학생 작문 AI 1차 첨삭 검토 및 교사 최종 확정
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            담당 교사: <strong>{currentUser.name}</strong> • AI가 3초 만에 생성한 문법·번역투·논증 피드백을 원클릭으로 검수하고 최종 점수를 확정합니다. (첨삭 소요 시간 90% 단축)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUriBanModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-sm transition-all"
            title="우리반(UriBan) 학급 및 작문 데이터 동기화"
          >
            <School className="w-3.5 h-3.5 text-purple-200" />
            <span>🏫 우리반(UriBan) 연동</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">검수 큐 대기:</span>
            <span className="font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              총 {submissions.length}건
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Queue on Left (4 cols), Workspace on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submissions Queue List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              제출 답안 검수 큐 (Queue)
            </h2>
            <span className="text-[11px] text-slate-400">클릭하여 선택</span>
          </div>

          <div className="space-y-2.5">
            {submissions.map((sub) => {
              const isSelected = sub.submissionId === selectedSubId;
              const isReviewed = !!sub.instructorFeedback;
              const hasRevision = !!sub.revisedDraft;

              return (
                <div
                  key={sub.submissionId}
                  onClick={() => {
                    setSelectedSubId(sub.submissionId);
                    setTeacherComment(
                      sub.instructorFeedback?.teacherComment ||
                        '웨이 학생! 논리 뼈대는 잘 잡았어요. 결론에서 지적된 "선결 과제" 표현을 적용해 분량을 늘려 다시 제출해 보세요.'
                    );
                    setFinalScore(sub.instructorFeedback?.finalScore || sub.aiFeedback.estimatedScore || 36);
                    setApprovedAi(sub.instructorFeedback?.approvedAiFeedback ?? true);
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 text-sm">{sub.studentName}</span>
                    <div className="flex items-center gap-1.5">
                      {hasRevision && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800">
                          수정본 제출됨
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          isReviewed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {isReviewed ? '검수 완료' : '1차 AI 첨삭됨'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1">{sub.taskPromptTitle}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                    <span>AI 추정: <strong className="text-slate-700">{sub.aiFeedback.estimatedScore}점</strong></span>
                    {sub.instructorFeedback && (
                      <span className="text-emerald-700 font-bold">교사 확정: {sub.instructorFeedback.finalScore}점</span>
                    )}
                    <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Inspection Workspace */}
        {activeSubmission && (
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
            {/* Header: Student Profile & View Tabs */}
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-600">{activeSubmission.taskPromptTitle}</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {activeSubmission.studentName} 학생 (중국인 유학생 • 현 TOPIK 3급)
                </h3>
              </div>

              {/* View Mode Toggle: 1차 첨삭 검수 vs 초안-수정본 비교 */}
              <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 text-xs">
                <button
                  onClick={() => setViewTab('review')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    viewTab === 'review'
                      ? 'bg-white text-emerald-800 shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AI 1차 첨삭 검수 뷰
                </button>
                <button
                  onClick={() => setViewTab('compare')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    viewTab === 'compare'
                      ? 'bg-white text-blue-700 shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>초안 vs 수정본 Before & After</span>
                </button>
              </div>
            </div>

            {/* TAB A: Review View (Side-by-side Draft and AI Analysis) */}
            {viewTab === 'review' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Draft Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        📄 학생 원문 초안 (280자):
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(activeSubmission.submittedAt).toLocaleTimeString()} 제출
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans bg-white p-3 rounded-xl border border-slate-100">
                      {activeSubmission.initialDraft}
                    </p>
                  </div>

                  {/* AI 1st Feedback Box with Clickable Approval */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        AI 1차 분석 결과 (클릭하여 승인/배제):
                      </span>
                      <span className="text-xs font-black text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                        추정 점수: {activeSubmission.aiFeedback.estimatedScore}점
                      </span>
                    </div>

                    {/* Grammar Errors */}
                    <div className="text-xs space-y-1.5">
                      <span className="text-[11px] font-bold text-rose-700 block">
                        • 문법 & 격식 해라체 종결 교정:
                      </span>
                      {activeSubmission.aiFeedback.grammarAndEndingErrors.map((g, i) => (
                        <div
                          key={i}
                          onClick={() =>
                            setApprovedGrammarIndices((prev) => ({ ...prev, [i]: !prev[i] }))
                          }
                          className={`p-2 rounded-lg border text-[11px] cursor-pointer transition-colors flex items-center justify-between ${
                            approvedGrammarIndices[i] !== false
                              ? 'bg-white border-emerald-300 text-slate-800'
                              : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                          }`}
                        >
                          <div>
                            <span className="text-rose-600">{g.original}</span>
                            <span className="mx-1">→</span>
                            <strong className="text-emerald-700">{g.corrected}</strong>
                          </div>
                          {approvedGrammarIndices[i] !== false ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <span className="text-[10px] text-slate-400">제외됨</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Translation Tone Fixes */}
                    <div className="text-xs space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-800 block">
                        • 모국어 번역투(L1 언어 간섭) 교정:
                      </span>
                      {activeSubmission.aiFeedback.chineseTranslationToneFixes.map((t, i) => (
                        <div
                          key={i}
                          onClick={() =>
                            setApprovedToneIndices((prev) => ({ ...prev, [i]: !prev[i] }))
                          }
                          className={`p-2 rounded-lg border text-[11px] cursor-pointer transition-colors flex items-center justify-between ${
                            approvedToneIndices[i] !== false
                              ? 'bg-white border-amber-300 text-slate-800'
                              : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                          }`}
                        >
                          <div>
                            <span className="text-amber-800">"{t.awkward}"</span>
                            <span className="mx-1">→</span>
                            <strong className="text-blue-700">"{t.naturalKo}"</strong>
                          </div>
                          {approvedToneIndices[i] !== false ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <span className="text-[10px] text-slate-400">제외됨</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Human-in-the-Loop Fast 2nd Review Action Panel */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 border-2 border-emerald-300 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      교사 2차 검수 & 최종 피드백 코멘트 작성
                    </span>
                    {isSuccessNotice && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                        <Check className="w-3.5 h-3.5" /> 학생에게 검수 결과가 발송되었습니다!
                      </span>
                    )}
                  </div>

                  {/* Fast Approve Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-emerald-200">
                    <input
                      type="checkbox"
                      checked={approvedAi}
                      onChange={(e) => setApprovedAi(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span>AI 1차 첨삭 결과의 신뢰도를 교사가 검토 및 승인합니다.</span>
                  </label>

                  {/* Quick Preset Buttons */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      원클릭 자주 쓰는 교사 피드백 템플릿:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyPreset(preset.text)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white hover:bg-emerald-100/70 text-slate-700 border border-slate-200 transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Teacher Feedback Textarea */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      교사 1:1 최종 코멘트 (학생 대시보드 및 학습관에 노출):
                    </label>
                    <textarea
                      rows={3}
                      value={teacherComment}
                      onChange={(e) => setTeacherComment(e.target.value)}
                      placeholder="학생에게 전달할 응원 및 보완 포인트 코멘트를 남겨주세요..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans shadow-inner"
                    />
                  </div>

                  {/* Final Score Stepper & Submit Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700">교사 최종 확정 점수:</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
                        <button
                          onClick={() => setFinalScore(Math.max(0, finalScore - 1))}
                          className="p-1 rounded text-slate-500 hover:bg-slate-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={finalScore}
                          onChange={(e) => setFinalScore(Number(e.target.value))}
                          className="w-12 text-center font-black text-emerald-700 text-sm focus:outline-none"
                        />
                        <button
                          onClick={() => setFinalScore(Math.min(50, finalScore + 1))}
                          className="p-1 rounded text-slate-500 hover:bg-slate-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">/ 50점 만점</span>
                    </div>

                    <button
                      onClick={handleConfirmReview}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                      <span>2차 검수 확정 전송 (Approve & Dispatch)</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB B: Compare View (Initial Draft vs Revised Draft) */}
            {viewTab === 'compare' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                  <span>학습자가 1, 2차 피드백을 반영하여 고쳐 쓴 결과와 초기 초안의 변화를 대조합니다.</span>
                  <span className="font-bold text-blue-700">학술 연구 코퍼스 자동 동기화됨</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before: Initial Draft */}
                  <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-2">
                    <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      초기 작성본 (Initial Draft - 280자):
                    </span>
                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-rose-100">
                      {activeSubmission.initialDraft}
                    </p>
                  </div>

                  {/* After: Revised Draft */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-300 space-y-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      최종 수정본 (Revised Draft - 450자):
                    </span>
                    {activeSubmission.revisedDraft ? (
                      <p className="text-xs text-slate-900 whitespace-pre-line leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-emerald-200">
                        {activeSubmission.revisedDraft}
                      </p>
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                        학생이 아직 고쳐쓰기 수정본을 제출하지 않았습니다.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* UriBan Bi-directional Sync Modal */}
      <UriBanSyncModal
        isOpen={isUriBanModalOpen}
        onClose={() => setIsUriBanModalOpen(false)}
      />
    </div>
  );
}

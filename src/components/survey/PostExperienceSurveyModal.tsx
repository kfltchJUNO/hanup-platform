'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Star,
  Users,
  MessageSquare,
  Mail,
  Send,
  X,
  Sparkles,
  Heart,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { UserSurveyEntry } from '../../types/trackB';

interface PostExperienceSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (survey: Partial<UserSurveyEntry>) => void;
  defaultContact?: string;
}

export const PostExperienceSurveyModal: React.FC<PostExperienceSurveyModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  defaultContact = '',
}) => {
  const [feedbackScore, setFeedbackScore] = useState<number>(5);
  const [neededSupports, setNeededSupports] = useState<string[]>([
    '1:1 박사 튜터 심층 과외',
  ]);
  const [neededSupportsCustom, setNeededSupportsCustom] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>(defaultContact);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleSupport = (item: string) => {
    setNeededSupports((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!neededSupportsCustom.trim()) {
      setValidationError('희망하는 지원 사항이나 체험 소감을 1문장 이상 적어주십시오. (모국어 작성 가능)');
      return;
    }

    setIsSubmitting(true);

    const surveyData: Partial<UserSurveyEntry> = {
      sessionId:
        typeof window !== 'undefined'
          ? localStorage.getItem('hanup_survey_session') || `sess_${Date.now()}`
          : `sess_${Date.now()}`,
      surveyType: 'post_experience',
      feedbackScore,
      neededSupports,
      neededSupportsCustom: neededSupportsCustom.trim(),
      contactInfo: contactInfo.trim(),
    };

    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('hanup_post_survey_done', 'true');
      }
    } catch (err) {
      console.warn('[Post Survey] Fallback save:', err);
    } finally {
      setIsSubmitting(false);
      setIsDone(true);
      setTimeout(() => {
        onComplete(surveyData);
        onClose();
      }, 1500);
    }
  };

  const supportOptions = [
    { id: 'full_16_units', label: '16유닛 전체 아카데믹 커리큘럼 자습' },
    { id: 'tutor_coaching', label: '1:1 박사 튜터 심층 과외 & 음성 피드백' },
    { id: 'topik_54_intensive', label: 'TOPIK II 54번 700자 논술 실전 집중반' },
    { id: 'sori_tutor_cross', label: '소리튜터 AI 발음·피치 교정 무제한 연동' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/30">
              <Heart className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base">무료 체험 사후 피드백 &amp; 학습 지원 안내</h3>
              </div>
              <p className="text-xs text-emerald-200/80">
                체험 소감을 남겨주시면 연구용 추가 첨삭 리포트와 1:1 과외 할인 혜택을 드립니다.
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

        {isDone ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-black text-base text-slate-900">
              소중한 피드백이 등록되었습니다!
            </h4>
            <p className="text-xs text-slate-600">
              작성해주신 의견을 바탕으로 맞춤형 학습 분석 리포트를 구성해 드리겠습니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {/* Question 1: Satisfaction Rating */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                오늘 경험한 AI 툴민 6요소 진단 및 악마의 대변인 반론은 얼마나 유용했습니까?
              </label>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setFeedbackScore(score)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      feedbackScore === score
                        ? 'bg-amber-100 border border-amber-300 text-amber-900 shadow-sm'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        feedbackScore >= score
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                    <span className="text-[10px] font-bold font-mono">{score}점</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Needed Supports */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  향후 실력 향상을 위해 가장 필요하다고 느끼는 지원은 무엇입니까? (복수 선택)
                </span>
                <span className="text-[10px] text-slate-500">객관식 + 주관식 필수</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {supportOptions.map((item) => {
                  const isSelected = neededSupports.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSupport(item.label)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Required Subjective Input */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  [필수] 기타 희망 지원 사항이나 건의를 편하게 적어주십시오:
                </span>
                <textarea
                  rows={3}
                  value={neededSupportsCustom}
                  onChange={(e) => setNeededSupportsCustom(e.target.value)}
                  placeholder="모국어로 편하게 작성하셔도 좋습니다 (中文 / Tiếng Việt / English / 日本語 가능). 예: 툴민 요소별로 자주 쓰이는 학술 연결어미 리스트를 PDF로 받고 싶습니다."
                  className="w-full p-3 rounded-2xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner font-sans"
                />
              </div>
            </div>

            {/* Question 3: Optional Contact Lead */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>연락처 (선택): 위챗(WeChat) ID 또는 이메일</span>
                </label>
                <span className="text-[10px] text-slate-400">1:1 코칭 리포트 발송용</span>
              </div>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="예: wechat_id_123 또는 example@gmail.com"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Footer Submit */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                닫기
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? '등록 중...' : '피드백 제출하기'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

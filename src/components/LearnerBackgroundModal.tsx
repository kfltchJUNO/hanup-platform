'use client';

import React, { useState } from 'react';
import { useHanUp } from '../context/HanUpContext';
import { X, UserCheck, ShieldCheck, Save, Globe, BookOpen, Clock, School, Plane } from 'lucide-react';
import { UserProfile } from '../types/hanup';

export default function LearnerBackgroundModal() {
  const {
    isBackgroundModalOpen,
    closeBackgroundModal,
    currentUser,
    updateBackgroundVariables,
  } = useHanUp();

  const [form, setForm] = useState<Partial<UserProfile>>({
    nativeLanguage: currentUser.nativeLanguage || 'zh-CN',
    studyDuration: currentUser.studyDuration || '1y-2y',
    studyMethod: currentUser.studyMethod || 'university_center',
    visitKoreaExperience: currentUser.visitKoreaExperience || 'residing_student',
    currentTopikLevel: currentUser.currentTopikLevel ?? 3,
    targetTopikLevel: currentUser.targetTopikLevel ?? 5,
    learningPurpose: currentUser.learningPurpose || 'grad_school',
    researchConsent: currentUser.researchConsent ?? true,
  });

  if (!isBackgroundModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBackgroundVariables(form);
    closeBackgroundModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white relative">
          <button
            onClick={closeBackgroundModal}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-100">
            <UserCheck className="w-4 h-4 text-emerald-200" />
            <span>Learner Profile & Academic Background Intake</span>
          </div>
          <h2 className="text-lg font-black mt-1">학습자 7대 연구 배경변인 등록/수정</h2>
          <p className="text-xs text-emerald-50 mt-0.5">
            한국어교육학 학술 연구 표준 변인으로 수집되며, 맞춤형 AI 커리큘럼 추천에 사용됩니다.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* 1. L1 Native Language */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>1. 모국어 (L1 Native Language)</span>
            </label>
            <select
              value={form.nativeLanguage}
              onChange={(e) =>
                setForm({ ...form, nativeLanguage: e.target.value as UserProfile['nativeLanguage'] })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="zh-CN">중국어 간체 (Chinese Simplified / 简体中文)</option>
              <option value="zh-TW">중국어 번체 (Chinese Traditional / 繁體中文)</option>
              <option value="vi-VN">베트남어 (Vietnamese / Tiếng Việt)</option>
              <option value="my-MM">미얀마어 (Burmese / မြန်မာစာ)</option>
              <option value="en-US">영어 (English)</option>
              <option value="ja-JP">일본어 (Japanese / 日本語)</option>
              <option value="other">기타 언어 (Other)</option>
            </select>
          </div>

          {/* 2. Total Study Duration */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>2. 총 한국어 학습 기간</span>
            </label>
            <select
              value={form.studyDuration}
              onChange={(e) =>
                setForm({
                  ...form,
                  studyDuration: e.target.value as UserProfile['studyDuration'],
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="<6m">6개월 미만</option>
              <option value="6m-1y">6개월 ~ 1년</option>
              <option value="1y-2y">1년 ~ 2년</option>
              <option value="2y+">2년 이상 (장기 학습자)</option>
            </select>
          </div>

          {/* 3. Primary Study Method */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-purple-600" />
              <span>3. 주된 학습 방식</span>
            </label>
            <select
              value={form.studyMethod}
              onChange={(e) =>
                setForm({
                  ...form,
                  studyMethod: e.target.value as UserProfile['studyMethod'],
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="university_center">국내/현지 대학교 한국어학당</option>
              <option value="private_academy">사설 한국어 전문 어학원</option>
              <option value="self">교재/독학 위주</option>
              <option value="online_lecture">인터넷 강의 / 유튜브</option>
              <option value="tutoring">1:1 개인 과외</option>
            </select>
          </div>

          {/* 4. Experience Visiting Korea */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-sky-600" />
              <span>4. 방한 및 한국 체류 경험</span>
            </label>
            <select
              value={form.visitKoreaExperience}
              onChange={(e) =>
                setForm({
                  ...form,
                  visitKoreaExperience: e.target.value as UserProfile['visitKoreaExperience'],
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="residing_student">현재 한국 거주 (유학생/직장인)</option>
              <option value="exchange_program">한국 교환학생/어학연수 3개월 이상 체류</option>
              <option value="short_trip">단기 여행 또는 K-POP 공연 방문 (1개월 미만)</option>
              <option value="none">방한 경험 없음 (자국 거주)</option>
            </select>
          </div>

          {/* 5 & 6. Current Level, Target Level & Purpose */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">5. 현재 TOPIK 급수</label>
              <select
                value={form.currentTopikLevel}
                onChange={(e) => setForm({ ...form, currentTopikLevel: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value={0}>0급 (노베이스/입문)</option>
                <option value={1}>1급</option>
                <option value={2}>2급</option>
                <option value={3}>3급</option>
                <option value={4}>4급</option>
                <option value={5}>5급</option>
                <option value={6}>6급 (최고급)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">목표 TOPIK 급수</label>
              <select
                value={form.targetTopikLevel}
                onChange={(e) => setForm({ ...form, targetTopikLevel: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value={2}>2급</option>
                <option value={3}>3급</option>
                <option value={4}>4급</option>
                <option value={5}>5급</option>
                <option value={6}>6급</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>6. 한국어 학습 주 목적</span>
            </label>
            <select
              value={form.learningPurpose}
              onChange={(e) =>
                setForm({
                  ...form,
                  learningPurpose: e.target.value as UserProfile['learningPurpose'],
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="grad_school">한국 명문 대학원(석/박사) 입학 및 학위 취득</option>
              <option value="undergrad">한국 4년제 대학교 학부 입학</option>
              <option value="employment">한국 대기업/공공기관 취업 및 E-7 비자 취득</option>
              <option value="life_hobby">한국 장기 거주 및 일상 소통</option>
              <option value="hobby">K-드라마, 웹툰, 아이돌 팬 활동</option>
            </select>
          </div>

          {/* 7. IRB Consent */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.researchConsent}
                onChange={(e) => setForm({ ...form, researchConsent: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-[11px] text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-0.5">
                  7. 한국어교육학 학술 연구(IRB) 익명 데이터 활용 필수 동의
                </span>
                본 답안과 학습 이력은 개인정보가 완전히 비식별화(SHA-256 해시/마스킹)된 상태로 학술
                연구 및 AI 모델 성능 개선에 활용되는 것에 동의합니다.
              </div>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeBackgroundModal}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>배경변인 저장 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

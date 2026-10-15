'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle2,
  Building2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Award,
  Mic,
  Camera,
  PenTool,
  Stethoscope,
  Globe,
  Clock,
  Zap,
  Tag,
  Check,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';
import { MOCK_SERIES } from '../mock/mockData';
import { UserRole, ROLE_DEFINITIONS } from '../types/hanup';
import { SoriTutorModal } from '../components/SoriTutorModal';

export default function HomePage() {
  const { currentRole, switchRole, lang, openSurveyModal } = useHanUp();
  const [activeSeriesTab, setActiveSeriesTab] = useState<'topik' | 'life'>('topik');
  const [isSoriModalOpen, setIsSoriModalOpen] = useState(false);
  const [soriSampleSentence, setSoriSampleSentence] = useState('급한 일이 생겨서요 [그판 니리 생겨서요]');

  const handleRoleQuickStart = (role: UserRole) => {
    switchRole(role);
  };

  const filteredSeries = MOCK_SERIES.filter((s) => s.category === activeSeriesTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 sm:space-y-14">
      {/* 1. Hero Banner (Clean, Inspiring, Student-First) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>AI 기반 맞춤형 한국어 스마트 러닝 플랫폼 • 한업 (HanUp | 韩升)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            한국어 실력 향상과 TOPIK 합격을<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              AI 1:1 맞춤 튜터
            </span>와 함께 완성하세요
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            원고지 사진 찍어 올리면 <strong className="text-blue-400">3초 만에 AI 정밀 첨삭</strong>, 
            교재 속 문장을 따라 읽는 <strong className="text-emerald-400">소리튜터 실시간 발음 클리닉</strong>, 
            그리고 <strong className="text-amber-400">글로벌 6개 국어 모국어 해설</strong>을 스마트폰과 태블릿에서 언제 어디서나 학습하세요.
          </p>

          {/* Touch-Friendly Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              href="/study/hanup_topik_prep/ch_prep_01"
              onClick={() => switchRole('student')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 text-emerald-100" />
              <span>🚀 1~2급 무료 체험 시작하기</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-white/20 text-white ml-1">
                $0 무료
              </span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => switchRole('student')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700 font-bold text-sm transition-all"
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>나의 학습 대시보드</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/clinic"
              onClick={() => switchRole('student')}
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold text-xs sm:text-sm transition-all"
            >
              <Stethoscope className="w-4 h-4 text-blue-400" />
              <span>오늘의 약점 3제 풀기</span>
            </Link>
          </div>

          {/* Quick Benefit Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>⚡ AI 정밀 첨삭 3초</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>🎙️ 소리튜터 발음 연동</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>🌐 6개 국어 모국어 해설</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>📷 원고지 손글씨 OCR</span>
            </div>
          </div>
        </div>

        {/* Ambient Decorative Glow */}
        <div className="absolute right-[-10%] top-[-20%] w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-[30%] bottom-[-20%] w-[350px] h-[350px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Core Learning Features (3 Clean Mobile/Tablet Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              스마트 학습 핵심 기능
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              독학으로 어려운 쓰기·발음·취약점을 AI 기술로 확실하게 잡아드립니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: AI Writing */}
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                AI 53·54번 원고지 정밀 첨삭
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                손글씨 원고지를 스마트폰 카메라로 찍어 올리면 3초 만에 맞춤법, 띄어쓰기, L1 번역투 간섭 오류를 짚어내고 모국어 해설을 제공합니다.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link
                href="/study/hanup_topik_prep/ch_prep_01"
                onClick={() => switchRole('student')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 group-hover:text-blue-700"
              >
                <span>무료 체험 교재에서 써보기</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Sori Tutor */}
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-lg transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                소리튜터 실시간 발음 클리닉
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                교재 속 어휘와 문장(연음, 겹받침, 비음화)을 원클릭으로 소리튜터와 연결하여 음운 오류와 발음 억양을 실시간 교정받습니다.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setSoriSampleSentence('급한 일이 생겨서요 [그판 니리 생겨서요]');
                  setIsSoriModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                <span>소리튜터 발음 진단 미리보기</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Weakness Clinic */}
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white hover:border-purple-400 hover:shadow-lg transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                약점 레이더 진단 & 맞춤 3제
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                듣기·읽기·쓰기 6대 영역 취약점을 레이더 차트로 정밀 진단하고, 매일 학습자 수준에 꼭 맞춘 3개 문제를 추천 처방합니다.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link
                href="/clinic"
                onClick={() => switchRole('student')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 group-hover:text-purple-700"
              >
                <span>오늘의 약점 3제 풀러 가기</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Curriculum Showcase (Tabbed for Mobile/Tablet) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              한업 교재 시리즈 라인업
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              시험 대비 TOPIK 과정부터 일상 생존 한국어까지 수준별 맞춤 커리큘럼을 선택하세요.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveSeriesTab('topik')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSeriesTab === 'topik'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>한업 TOPIK 시리즈</span>
            </button>
            <button
              onClick={() => setActiveSeriesTab('life')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSeriesTab === 'life'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>생활한국어 시리즈</span>
            </button>
          </div>
        </div>

        {/* Series Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredSeries.map((series) => {
            const isFree = series.price?.isFree || series.price?.usd === 0;
            const startHref =
              series.seriesId === 'hanup_topik_prep'
                ? '/study/hanup_topik_prep/ch_prep_01'
                : `/study/${series.seriesId}/ch_writing_04`;

            return (
              <div
                key={series.seriesId}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold text-white shadow-xs"
                      style={{ backgroundColor: series.accentColor }}
                    >
                      {series.stageName || series.badgeText}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                      총 {series.chaptersCount}강
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                      {series.titleKo}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      {series.titleZh}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                    {series.descriptionKo}
                  </p>

                  {/* Pace and Price Badges */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{series.durationWeeks}주 완성 (복습 2X 보장: {series.durationWeeks * 2}주 제공) • {series.schedulePace}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400 font-medium">단품 정가</span>
                      <span
                        className={`text-xs font-black ${
                          isFree ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {isFree ? '무료 체험 $0' : `$${series.price?.usd} / ₩${series.price?.krw?.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="pt-4 mt-3">
                  <Link
                    href={startHref}
                    onClick={() => switchRole('student')}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:opacity-95 hover:shadow-md"
                    style={{ backgroundColor: series.accentColor }}
                  >
                    <span>{isFree ? '🚀 무료 체험 시작하기' : '교재 뷰어 입장'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Special Event Banner: Free Trial + 20% Discount Coupon */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>무료 체험 특별 혜택 이벤트</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            준비편(1~2급) 2회차 완료 시 20% 할인 쿠폰 증정!
          </h3>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-xl">
            《한업 TOPIK 준비편》 제1회와 제2회를 풀고 AI 교육 요구분석 설문에 참여하시면 
            모든 정규 교재에 적용 가능한 <strong className="text-yellow-300 font-mono">HANUP20WTP</strong> 쿠폰을 즉시 드립니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            onClick={openSurveyModal}
            className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-all text-center shadow-lg"
          >
            🎁 설문 참여하고 쿠폰 받기
          </button>
          <Link
            href="/study/hanup_topik_prep/ch_prep_01"
            onClick={() => switchRole('student')}
            className="px-5 py-3 rounded-2xl bg-black/30 hover:bg-black/40 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all text-center"
          >
            준비편 1회차 풀러 가기
          </Link>
        </div>
      </section>

      {/* 5. Collapsible Admin & Teacher System Showcase (Keeps Student Screen Clean) */}
      <details className="group border border-slate-200 rounded-3xl bg-slate-50/80 p-5 sm:p-7 transition-all cursor-pointer">
        <summary className="list-none flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>교육기관 · 강사 · 연구자용 시스템 관리 모드</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  클릭하여 펼치기
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                4단계 권한 전환(RBAC), Human-in-the-Loop 검수 큐, 기관 분양형 SaaS, 한업 저작 스튜디오 & 연구 코퍼스 DB
              </p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
        </summary>

        <div className="pt-6 mt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 cursor-default">
          {/* Card 1: Lv.1 Student */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              currentRole === 'student'
                ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                Lv.1 학생
              </span>
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">멀티 시리즈 통합 학습</h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              • TOPIK 약점 레이더 & 120제<br />
              • 스마트 뷰어 & AI 실시간 첨삭
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <Link
                href="/dashboard"
                onClick={() => handleRoleQuickStart('student')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-100/60 transition-colors"
              >
                <span>📊 마이 대시보드</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/clinic"
                onClick={() => handleRoleQuickStart('student')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-100/60 transition-colors"
              >
                <span>🎯 약점 진단 3제</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Lv.2 Instructor */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              currentRole === 'instructor'
                ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                Lv.2 교사
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Human-in-the-Loop</h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              • AI 1차 첨삭 결과 원클릭 승인<br />
              • 교사 2차 코멘트 & 반 과제 배정
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <Link
                href="/teacher/grading"
                onClick={() => handleRoleQuickStart('instructor')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-100/60 transition-colors"
              >
                <span>✍️ 2차 첨삭 검수 큐</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/teacher/classes"
                onClick={() => handleRoleQuickStart('instructor')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-100/60 transition-colors"
              >
                <span>👥 반 관리 & 과제 배정</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Lv.3 Org Admin */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              currentRole === 'org_admin'
                ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Lv.3 기관/원장
              </span>
              <Building2 className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">B2B 멀티테넌트 분양</h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              • 학원(orgId) 화이트라벨링 설정<br />
              • 강사/학생 시트(Seats) 할당
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <Link
                href="/admin/orgs"
                onClick={() => handleRoleQuickStart('org_admin')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-800 hover:bg-amber-100/60 transition-colors"
              >
                <span>🏢 학원 시트 & 브랜딩</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Lv.4 Super Admin */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              currentRole === 'super_admin'
                ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                Lv.4 본사
              </span>
              <Layers className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">저작 스튜디오 & 연구</h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              • 원고 블록 에디터 & OSMU 마케팅<br />
              • 작문 종단 코퍼스 필터링/다운로드
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <Link
                href="/admin/studio"
                onClick={() => handleRoleQuickStart('super_admin')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-100/60 transition-colors"
              >
                <span>🎨 저작 스튜디오 (OSMU)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/research"
                onClick={() => handleRoleQuickStart('super_admin')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-100/60 transition-colors"
              >
                <span>🔬 학술 연구 코퍼스 DB</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </details>

      {/* Sori Tutor Pronunciation Test Modal */}
      <SoriTutorModal
        isOpen={isSoriModalOpen}
        onClose={() => setIsSoriModalOpen(false)}
        targetSentence={soriSampleSentence}
      />
    </div>
  );
}

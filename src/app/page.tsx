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
  Star,
  Users,
  ExternalLink,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';
import { MOCK_SERIES } from '../mock/mockData';
import { SoriTutorModal } from '../components/SoriTutorModal';
import { Hangul40BoardModal } from '../components/Hangul40BoardModal';

export default function HomePage() {
  const { switchRole, openSurveyModal } = useHanUp();
  const [activeSeriesTab, setActiveSeriesTab] = useState<'topik' | 'life'>('topik');
  const [isSoriModalOpen, setIsSoriModalOpen] = useState(false);
  const [soriSampleSentence, setSoriSampleSentence] = useState('급한 일이 생겨서요 [그판 니리 생겨서요]');
  const [isHangulBoardOpen, setIsHangulBoardOpen] = useState(false);

  const filteredSeries = MOCK_SERIES.filter((s) => s.category === activeSeriesTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* 1. Hero Banner (Clean, Inspiring, 100% Student-First) */}
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
              href="/join?org=hanup_global"
              onClick={() => switchRole('student')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 text-emerald-100" />
              <span>🚀 본사 직속 무료 체험 시작하기</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-white/20 text-white ml-1">
                $0 무료
              </span>
            </Link>

            <Link
              href="/study/hanup_topik_prep/ch_prep_01"
              onClick={() => switchRole('student')}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700 font-bold text-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>준비편 1강 둘러보기</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/clinic"
              onClick={() => switchRole('student')}
              className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold text-xs sm:text-sm transition-all"
            >
              <Stethoscope className="w-4 h-4 text-blue-400" />
              <span>약점 진단 3제 풀기</span>
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
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>🔤 한글 자모 40자 체계</span>
            </div>
          </div>
        </div>

        {/* Ambient Decorative Glow */}
        <div className="absolute right-[-10%] top-[-20%] w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-[30%] bottom-[-20%] w-[350px] h-[350px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Core Interactive Learning Experiences (4 Student Action Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              스마트 학습 핵심 체험 존
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              독학으로 막막했던 쓰기·발음·자모·취약점을 클릭 한 번으로 체험해 보세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: AI Writing */}
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                AI 53·54번 원고지 첨삭
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

          {/* Card 2: Sori Tutor Modal Trigger */}
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-lg transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                소리튜터 실시간 발음 클리닉
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                교재 속 문장(연음, 겹받침, 비음화)을 원클릭으로 소리튜터와 연결하여 음운 오류와 발음 억양을 실시간 교정받습니다.
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

          {/* Card 3: Hangul 40-Letter Board Modal Trigger */}
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white hover:border-rose-400 hover:shadow-lg transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                한글 자모 40자 체계 정복
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                원어민 표준 음가 듣기, 6개 국어 입모양 꿀팁, 그리고 인쇄해서 직접 쓰는 A4 바둑판 워크북을 인터랙티브하게 체험하세요.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => setIsHangulBoardOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700"
              >
                <span>자모 40자 인터랙티브 보드 열기</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 4: Weakness Clinic */}
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
              한업 교재 시리즈 라인업 (총 8종 84강)
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

      {/* 4. Student Social Proof & Reviews */}
      <section className="bg-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200/80 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>글로벌 수강생 실사용 후기</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            외국인 유학생들이 먼저 인정한 한업(HanUp)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            실제 시험 점수 향상과 자연스러운 한국어 발음 교정 경험을 전해드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Review 1 */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇻🇳</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">응우옌 티 마이 (Nguyen Thi Mai)</h4>
                <p className="text-[11px] text-blue-600 font-semibold">TOPIK 5급 합격 • 베트남 유학생</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;53번 도표 쓰기에서 항상 시간에 쫓겼는데, 한업의 필수 표현 공식과 3초 첨삭 덕분에 쓰기 점수가 15점이나 올랐어요. 베트남어 모국어 해설이 있어서 조사 실수를 정확히 고칠 수 있었습니다!&quot;
            </p>
          </div>

          {/* Review 2 */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇨🇳</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">왕웨이 (Wang Wei)</h4>
                <p className="text-[11px] text-emerald-600 font-semibold">TOPIK 6급 합격 • 서울대 대학원생</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;소리튜터로 겹받침과 연음 발음을 교재 문장마다 즉시 테스트할 수 있어 큰 도움이 되었습니다. 교수님께 보내는 정중한 이메일 템플릿도 대학원 생활에서 바로 써먹었습니다.&quot;
            </p>
          </div>

          {/* Review 3 */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇯🇵</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">사토 유키 (Sato Yuki)</h4>
                <p className="text-[11px] text-purple-600 font-semibold">TOPIK 4급 달성 • 도쿄 IT 직장인</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;직장 다니면서 학원 갈 시간이 없었는데, 출퇴근 전철에서 매일 약점 3문제씩 풀고 주말에는 A4 자모 워크북을 인쇄해서 써봤습니다. 스마트폰 하나로 모든 게 해결돼요!&quot;
            </p>
          </div>
        </div>
      </section>

      {/* 5. Special Event Banner: Free Trial + 20% Discount Coupon */}
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
            className="px-5 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-all text-center shadow-lg"
          >
            🎁 설문 참여하고 쿠폰 받기
          </button>
          <Link
            href="/study/hanup_topik_prep/ch_prep_01"
            onClick={() => switchRole('student')}
            className="px-5 py-3.5 rounded-2xl bg-black/30 hover:bg-black/40 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all text-center"
          >
            준비편 1회차 풀러 가기
          </Link>
        </div>
      </section>

      {/* 6. Discreet B2B Partner Demo Gateway (Keeps Main Flow Clean for Students) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              어학원·대학교·한국어 교육기관 및 강사님이신가요?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              교사 첨삭 큐, 원클릭 학생 QR 등록, 기관 화이트라벨링, 저작 스튜디오 등 B2B 통합 솔루션을 시연해 보세요.
            </p>
          </div>
        </div>

        <Link
          href="/demo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shrink-0 hover:scale-[1.02] shadow-xs"
        >
          <span>🏫 B2B 솔루션 및 Lv.1~4 권한 시연 보기</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>
      </section>

      {/* Sori Tutor Pronunciation Test Modal */}
      <SoriTutorModal
        isOpen={isSoriModalOpen}
        onClose={() => setIsSoriModalOpen(false)}
        targetSentence={soriSampleSentence}
      />

      {/* Hangul 40-Letter Board Modal */}
      <Hangul40BoardModal
        isOpen={isHangulBoardOpen}
        onClose={() => setIsHangulBoardOpen(false)}
        onOpenSoriTutor={(sentence) => {
          setIsHangulBoardOpen(false);
          setSoriSampleSentence(sentence);
          setIsSoriModalOpen(true);
        }}
      />
    </div>
  );
}

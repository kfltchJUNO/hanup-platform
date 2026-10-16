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
  Compass,
  Mail,
  HelpCircle,
  Copy,
  MessageCircle,
  Headphones,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';
import { MOCK_SERIES } from '../mock/mockData';
import { SoriTutorModal } from '../components/SoriTutorModal';
import { Hangul40BoardModal } from '../components/Hangul40BoardModal';
import { BookshelfSelector } from '../components/BookshelfSelector';

export default function HomePage() {
  const { switchRole, openSurveyModal, bookCoverStyles } = useHanUp();
  const [activeSeriesTab, setActiveSeriesTab] = useState<'topik' | 'life'>('topik');
  const [isSoriModalOpen, setIsSoriModalOpen] = useState(false);
  const [soriSampleSentence, setSoriSampleSentence] = useState('급한 일이 생겨서요 [그판 니리 생겨서요]');
  const [isHangulBoardOpen, setIsHangulBoardOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const officialEmail = 'ot.helper7@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(officialEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const filteredSeries = MOCK_SERIES.filter((s) => s.category === activeSeriesTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-14 sm:space-y-20">
      {/* 1. Hero Banner (Clean, Inspiring, 100% Student-First) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>AI 기반 맞춤형 한국어 스마트 러닝 플랫폼 • 한업 (HanUp)</span>
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
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5 text-emerald-100 shrink-0" />
              <span>🚀 본사 직속 무료 체험 시작하기</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-white/20 text-white ml-1 shrink-0">
                $0 무료
              </span>
            </Link>

            <Link
              href="/study/hanup_topik_prep/ch_prep_01"
              onClick={() => switchRole('student')}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700 font-bold text-sm transition-all whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>준비편 1강 둘러보기</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <a
              href="#guide"
              className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>학습 가이드 보기</span>
            </a>
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

      {/* 2. Comprehensive Student Learning Guide (How to Study with HanUp) */}
      <section id="guide" className="space-y-6 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>한업 4단계 스마트 학습 가이드</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            어떻게 공부해야 할지 막막한가요?<br />
            한업 4단계 로드맵을 따라오세요!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            한글 왕초보부터 TOPIK 6급 고득점까지, AI 1:1 튜터와 함께 단계별로 실력을 완성할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* STEP 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-200">
                  STEP 01
                </span>
                <span className="text-xl font-black text-slate-300 group-hover:text-blue-500 transition-colors">01</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                무료 진단 & 기초 다지기
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                비용 부담 없이 《TOPIK 준비편 1~2급》 1강 모의 풀이 또는 《한글 자모 40자 체계 보드》로 내 현재 실력과 기초 음가를 확인합니다.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
              <Link
                href="/study/hanup_topik_prep/ch_prep_01"
                onClick={() => switchRole('student')}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>🚀 준비편 1강 무료 체험</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsHangulBoardOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                🔤 자모 40자 보드 열기
              </button>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  STEP 02
                </span>
                <span className="text-xl font-black text-slate-300 group-hover:text-emerald-500 transition-colors">02</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                소리튜터 실시간 발음 클리닉
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                교재 본문의 어휘와 문장을 스마트폰 마이크로 읽으면, 음운 법칙(연음, 겹받침, 비음화)과 억양을 실시간 AI 음성 분석으로 교정받습니다.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setSoriSampleSentence('급한 일이 생겨서요 [그판 니리 생겨서요]');
                  setIsSoriModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>🎙️ 소리튜터 발음 진단 체험</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                어색한 발음 오류 즉시 교정
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                  STEP 03
                </span>
                <span className="text-xl font-black text-slate-300 group-hover:text-indigo-500 transition-colors">03</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                원고지 촬영 & 3초 AI 첨삭
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                53번 그래프 도표와 54번 논술을 손글씨 원고지에 쓴 후 카메라로 찍어 올리면, 3초 만에 맞춤법, 띄어쓰기, 모국어 번역투 오류를 분석합니다.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
              <Link
                href="/study/hanup_topik_prep/ch_prep_01"
                onClick={() => switchRole('student')}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>✍️ 53·54번 첨삭 둘러보기</span>
              </Link>
              <p className="text-[11px] text-slate-400 text-center">
                모국어 6개 국어 해설 제공
              </p>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-purple-50 text-purple-700 border border-purple-200">
                  STEP 04
                </span>
                <span className="text-xl font-black text-slate-300 group-hover:text-purple-500 transition-colors">04</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                약점 레이더 & 맞춤 3제 처방
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                6대 영역 취약점 분석을 통해 매일 나에게 꼭 필요한 3문제를 처방받고 오답을 반복 정복하여 TOPIK 목표 급수에 단번에 합격합니다.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
              <Link
                href="/clinic"
                onClick={() => switchRole('student')}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>🎯 오늘의 약점 3제 풀기</span>
              </Link>
              <p className="text-[11px] text-slate-400 text-center">
                개인화된 맞춤 문제 매일 갱신
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Interactive Feature Cards */}
      <section id="features" className="space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              스마트 학습 핵심 기능 직접 체험하기
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

      {/* 4. 3D Digital Bookshelf & Chapter Spread Selector */}
      <section id="curriculum" className="scroll-mt-20">
        <BookshelfSelector seriesList={MOCK_SERIES} bookCoverStyles={bookCoverStyles} />
      </section>

      {/* 5. Student Social Proof & Reviews */}
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

      {/* 6. Special Event Banner: Free Trial + 20% Discount Coupon */}
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

      {/* 7. Dedicated Support & Administrator Inquiry Section (Requested by User) */}
      <section id="contact" className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Headphones className="w-3.5 h-3.5 text-blue-400" />
              <span>한업 공식 고객지원 & 1:1 관리자 문의</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              학습 중 궁금한 점이 있거나 도움이 필요하신가요?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              어떤 교재부터 시작해야 할지 고민되거나, 이용 중 문의사항이 있으시면 언제든 관리자에게 직접 메일을 보내주세요. 평일 기준 24시간 이내 성심껏 안내해 드립니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href={`mailto:${officialEmail}?subject=[한업 학생 문의] 학습 및 이용 관련`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>관리자에게 이메일 문의하기</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedEmail ? '이메일 주소 복사됨!' : '이메일 주소 복사'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
            <span className="font-bold text-blue-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>공식 지원 이메일</span>
            </span>
            <div className="font-mono text-white text-sm font-bold">{officialEmail}</div>
            <p className="text-slate-400 text-[11px]">답변 가능 시간: 평일 09:00 ~ 18:00 (KST)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>추천 상담 분야</span>
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              • 내게 맞는 TOPIK 목표 급수별 교재 추천<br />
              • 원고지 첨삭 및 소리튜터 기능 활용법
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
            <span className="font-bold text-purple-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>기관·학원 단체 도입</span>
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              • 학원·대학교 언어교육원 단체 수강권<br />
              • 교사용 첨삭 큐 및 학급 LMS 연동 문의
            </p>
          </div>
        </div>
      </section>

      {/* 8. Discreet B2B Partner Demo Gateway (Keeps Main Flow Clean for Students) */}
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

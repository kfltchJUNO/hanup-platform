'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Mic,
  Check,
  Copy,
  Award,
  Feather,
  Globe,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { SoriTutorModal } from '../components/SoriTutorModal';
import { Hangul40BoardModal } from '../components/Hangul40BoardModal';
import { FannedBookCategoryCard, BookCategoryData } from '../components/home/FannedBookStack';
import { CategoryBookModal } from '../components/home/CategoryBookModal';
import { HOME_BOOK_CATEGORIES } from '../mock/homeCategoryData';
import { APP_CONFIG } from '../lib/config';

export default function HomePage() {
  // Selected Category Modal State
  const [selectedCategory, setSelectedCategory] = useState<BookCategoryData | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);

  // Auxiliary Modals
  const [isSoriModalOpen, setIsSoriModalOpen] = useState(false);
  const [soriSampleSentence, setSoriSampleSentence] = useState('급한 일이 생겨서요 [그판 니리 생겨서요]');
  const [isHangulBoardOpen, setIsHangulBoardOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const officialEmail = 'ot.helper7@gmail.com';

  // Support deep-link query param ?track=topik|academic|life from Researcher QR codes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const trackParam = params.get('track');
      if (trackParam) {
        const matched = HOME_BOOK_CATEGORIES.find((c) => c.key === trackParam);
        if (matched) {
          setSelectedCategory(matched);
          setIsCategoryModalOpen(true);
        }
      }
    }
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(officialEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleOpenCategory = (cat: BookCategoryData) => {
    setSelectedCategory(cat);
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-14 sm:space-y-18 font-sans">
      {/* ========================================================= */}
      {/* 1. 메인 헤더: 커리큘럼(교재) 선택 중심 안내 */}
      {/* ========================================================= */}
      <section className="text-center max-w-3xl mx-auto space-y-3.5 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>한업 (HanUp) 표준 한국어 디지털 교재 & 커리큘럼</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          목표에 맞는 한국어 커리큘럼을 선택하세요
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          <strong>TOPIK 수험</strong>, <strong>학문목적 논증 글쓰기</strong>, <strong>프리토킹(회화)</strong> 중 원하는 과정을 클릭하면<br className="hidden sm:inline" />
          전용 창에서 <strong>기초 레벨 테스트</strong>와 <strong>1차시 무료 회차 체험</strong>을 바로 시작할 수 있습니다.
        </p>
      </section>

      {/* ========================================================= */}
      {/* 2. 3대 핵심 커리큘럼(교재) 부채꼴 선택 카드 */}
      {/* ========================================================= */}
      <section id="curriculum" className="space-y-3 scroll-mt-20">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            1단계: 학습할 커리큘럼(교재 트랙) 선택
          </span>
          <span className="text-xs text-indigo-600 font-bold hidden sm:inline">
            👆 카드를 클릭하면 레벨 테스트 및 1차시 무료 체험 창이 열립니다
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
          {HOME_BOOK_CATEGORIES.map((category) => (
            <FannedBookCategoryCard
              key={category.key}
              category={category}
              onClick={() => handleOpenCategory(category)}
            />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. 커리큘럼별 상세 구성 및 학습 방식 안내 (허구 후기 제외, 교재 설명 중심) */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
              CURRICULUM GUIDE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              커리큘럼별 상세 교재 구성 및 학습 안내
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            각 과정은 진단 테스트 ➔ 1차시 무료 체험 ➔ 정규 교재 학습 순으로 진행됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Curriculum 1: TOPIK */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  커리큘럼 01 • TOPIK (읽기 · 듣기 · 쓰기)
                </span>
                <span className="text-xs font-bold text-slate-500">
                  총 4권 시리즈 (1~2급 준비편 / 3~4급 도전편 / 4~6급 완성편 / 53번 공식집)
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                기초 어휘·문법부터 읽기·듣기 유형 공략, 53·54번 원고지 쓰기까지 한 번에 대비
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                한국어능력시험(TOPIK) 합격을 목표로 하는 학습자를 위한 표준 수험 과정입니다. 영역별 기출 유형 공식과 20칸 원고지 작성법을 전자책 교재로 익히고, 모국어(6개 국어) 해설을 통해 오답 원인을 명확하게 파악합니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>읽기·듣기:</strong> 급수별 핵심 어휘 및 지문 스키밍 공식</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>쓰기 53·54번:</strong> 도표 분석 템플릿 및 700자 논술 구조화</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => handleOpenCategory(HOME_BOOK_CATEGORIES[0])}
                className="w-full lg:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>TOPIK 레벨 테스트 & 1차시 체험</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Curriculum 2: Academic Argument Writing */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-black flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5" />
                  커리큘럼 02 • 논증 글쓰기 (학문목적 학습자)
                </span>
                <span className="text-xs font-bold text-slate-500">
                  4단계 16유닛 (코어 트랙 1~8유닛 / 심화 장르 브리지 9~16유닛)
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                페렐만 신수사학(청중론)과 툴민 6요소(C-D-W-B-Q-R) 기반 대학·대학원 학술 작문
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                한국 대학 학부생 및 석·박사 대학원 유학생이 학술 에세이, 소논문 서론, 비판적 서평을 논리적으로 집필할 수 있도록 설계된 전문 커리큘럼입니다. 예상 반론을 방어하고 학술 담화 표지를 활용해 완결된 논증 텍스트를 완성합니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span><strong>코어 트랙:</strong> 주장·자료·정당화 결속 및 300~500자 블록 완성</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span><strong>심화 트랙:</strong> 소논문 서론(선행연구 공백) 및 비판적 서평 작성</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => handleOpenCategory(HOME_BOOK_CATEGORIES[1])}
                className="w-full lg:w-auto px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>논증 레벨 테스트 & 1차시 체험</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Curriculum 3: Free-Talking & Conversation (SoriTutor Integration) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  커리큘럼 03 • 프리토킹 · 회화 (생활한국어 × 소리튜터)
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-black">
                  프리토킹 심화 추가예정
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                회화 교재는 한업에서 표출하고, 실시간 발음·프리토킹 훈련은 소리튜터(SoriTutor)로 직결
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                한글 자모 40자 기초 음가부터 식당·교통 생존 회화, 캠퍼스 발표·면담까지 한업 디지털 교재로 핵심 표현을 학습한 뒤, 전용 음성 AI 클리닉인 <strong>소리튜터(SoriTutor)</strong>로 유입되어 연음·받침 발음 교정과 실전 프리토킹을 진행합니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>한업 교재 표출:</strong> 상황별 필수 회화 표현 및 조음·음운 가이드</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>소리튜터 유입:</strong> 음절 단위 발음 진단 및 AI 롤플레이 프리토킹</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleOpenCategory(HOME_BOOK_CATEGORIES[2])}
                className="w-full lg:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>회화 레벨 테스트 & 교재 체험</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={APP_CONFIG.soriTutorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-600" />
                <span>소리튜터(SoriTutor) 바로 이동</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. 보조 발음·자모 빠른 학습 도구 바 */}
      {/* ========================================================= */}
      <section className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span className="font-black text-slate-800">
            기초 발음 및 자모 학습 보조 도구:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHangulBoardOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 transition-colors cursor-pointer shadow-2xs"
          >
            <span>🔤 한글 자모 40자 표준 음가 보드</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSoriSampleSentence('급한 일이 생겨서요 [그판 니리 생겨서요]');
              setIsSoriModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer shadow-2xs"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span>🎙️ 소리튜터 발음 시뮬레이터</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. 학생 전용 심플 고객 지원 안내 (비학생 B2B 링크 완전 제거) */}
      {/* ========================================================= */}
      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500">
          교재 선택 및 학습 문의:{' '}
          <button
            onClick={handleCopyEmail}
            className="text-indigo-600 hover:underline font-mono font-bold cursor-pointer"
          >
            {officialEmail}
          </button>
          {copiedEmail && <span className="text-emerald-600 ml-1.5 font-bold">✓ 복사됨</span>}
        </p>
        <p className="text-slate-400 text-[11px]">
          커리큘럼 카드를 선택하면 설문 · 레벨 테스트 · 1차시 무료 체험이 진행됩니다.
        </p>
      </div>

      {/* 커리큘럼 전용 온보딩 · 설문 · 레벨테스트 · 1차시 체험 모달 */}
      <CategoryBookModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={selectedCategory}
        onOpenSoriTutor={(sentence) => {
          setSoriSampleSentence(sentence);
          setIsSoriModalOpen(true);
        }}
      />

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

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Compass,
  Mic,
  Camera,
  Stethoscope,
  Copy,
  Check,
  Building2,
  Mail,
  Headphones,
  GraduationCap,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';
import { SoriTutorModal } from '../components/SoriTutorModal';
import { Hangul40BoardModal } from '../components/Hangul40BoardModal';
import { FannedBookCategoryCard, BookCategoryData } from '../components/home/FannedBookStack';
import { CategoryBookModal } from '../components/home/CategoryBookModal';
import { HOME_BOOK_CATEGORIES } from '../mock/homeCategoryData';

export default function HomePage() {
  const { switchRole } = useHanUp();

  // Selected Category Modal State
  const [selectedCategory, setSelectedCategory] = useState<BookCategoryData | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);

  // Auxiliary Modals
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

  const handleOpenCategory = (cat: BookCategoryData) => {
    setSelectedCategory(cat);
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16 font-sans">
      {/* 1. Clean, Student-Centric Header (No billboard spam) */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>AI 1:1 맞춤형 한국어 스마트 러닝 • 한업 (HanUp)</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          어떤 한국어 공부를 시작하고 싶으신가요?
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-sans">
          아래 세 가지 학습 과정 중 관심 있는 교재를 선택해 보세요.<br className="hidden sm:inline" />
          마우스를 올리면 교재가 펼쳐지고, 클릭하면 바로 원하는 책을 골라 1강을 시작할 수 있습니다.
        </p>

        {/* Quick Diagnostic Pill for First-Time Students */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">어디서부터 시작해야 할지 모르겠다면?</span>
          <Link
            href="/onboarding"
            onClick={() => switchRole('student')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-indigo-600 text-white font-bold transition-all shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>30초 내 수준 맞춤 진단받기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 2. Three Main Category Cards with Fanned Book Stack Effect (부채꼴 연출) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            한업 핵심 교재 컬렉션 (TOPIK • 생활한국어 • 논증텍스트)
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            💡 카드를 클릭하면 상세 교재 선택 창이 열립니다
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {HOME_BOOK_CATEGORIES.map((category) => (
            <FannedBookCategoryCard
              key={category.key}
              category={category}
              onClick={() => handleOpenCategory(category)}
            />
          ))}
        </div>
      </section>

      {/* 3. Simple, Non-Intrusive 3-Step Guide (학생이 해야 할 일) */}
      <section className="bg-slate-50/90 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900">
                처음 오셨나요? 한업 빠른 3단계 학습법
              </h3>
              <p className="text-xs text-slate-500">
                복잡한 설치 없이 브라우저에서 바로 실전 한국어를 훈련합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>로그인 없이 1강 무료 체험 가능</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Step 1 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-black text-[11px]">
                STEP 01
              </span>
              <BookOpen className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">1. 관심 교재 선택</h4>
            <p className="text-slate-600 leading-relaxed">
              위의 세 가지 서가 중 내 목표(TOPIK, 생활회화, 대학원 논증)에 맞는 책을 골라 1강을 펼칩니다.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-black text-[11px]">
                STEP 02
              </span>
              <Mic className="w-4 h-4 text-emerald-500" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">2. 소리튜터로 발음 교정</h4>
            <p className="text-slate-600 leading-relaxed">
              교재 속 문장을 마이크로 직접 소리 내어 읽고, 연음·겹받침·억양 오류를 즉시 피드백받습니다.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-black text-[11px]">
                STEP 03
              </span>
              <Camera className="w-4 h-4 text-purple-500" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">3. 원고지 3초 AI 첨삭</h4>
            <p className="text-slate-600 leading-relaxed">
              작성한 원고지 사진을 찍어 올리거나 에디터에 작성하면 맞춤법과 툴민 6요소를 정밀 분석합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Quick Interactive Tool Shortcuts (Compact Pills) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            한업 인기 무료 도구 바로가기:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSoriSampleSentence('급한 일이 생겨서요 [그판 니리 생겨서요]');
              setIsSoriModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span>🎙️ 소리튜터 발음 진단</span>
          </button>

          <button
            type="button"
            onClick={() => setIsHangulBoardOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 transition-colors cursor-pointer"
          >
            <span>🔤 한글 자모 40자 체계 보드</span>
          </button>

          <Link
            href="/clinic"
            onClick={() => switchRole('student')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold border border-purple-200 transition-colors"
          >
            <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
            <span>🎯 약점 진단 3제 클리닉</span>
          </Link>
        </div>
      </section>

      {/* 5. Minimal Support & Administrator Contact Footer */}
      <footer className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-black text-slate-800">한업 (HanUp) 한국어 스마트 러닝 플랫폼</span>
            <span className="text-slate-300">|</span>
            <span>도서출판 한업</span>
          </div>
          <p className="text-slate-400">
            학습 교재 추천 및 이용 문의:{' '}
            <button
              onClick={handleCopyEmail}
              className="text-indigo-600 hover:underline font-mono font-bold"
            >
              {officialEmail}
            </button>
            {copiedEmail && <span className="text-emerald-600 ml-1 font-bold">✓ 복사됨</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-slate-500 hover:text-slate-800 font-medium underline"
          >
            기관·학원 B2B 시연 ➔
          </Link>
        </div>
      </footer>

      {/* Category Textbook Selection Modal (부채꼴 카드 클릭 시 열림) */}
      <CategoryBookModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={selectedCategory}
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

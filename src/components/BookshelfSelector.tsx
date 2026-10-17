'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Award,
  Globe,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { HanUpSeries, BookCoverStyle } from '../types/hanup';
import { BookCover } from './BookCover';
import { SYLLABUS_SERIES_METADATA, ALL_SYLLABUS_CHAPTERS } from '../mock/syllabusData';
import { useHanUp } from '../context/HanUpContext';

interface BookshelfSelectorProps {
  seriesList: HanUpSeries[];
  bookCoverStyles: Record<string, BookCoverStyle>;
  onOpenSoriTutor?: (sentence: string) => void;
}

export const BookshelfSelector: React.FC<BookshelfSelectorProps> = ({
  seriesList,
  bookCoverStyles,
}) => {
  const { switchRole, checkChapterAccess } = useHanUp();
  const [activeTab, setActiveTab] = useState<'topik' | 'life'>('topik');
  const [selectedSeries, setSelectedSeries] = useState<HanUpSeries | null>(null);
  const [mobileModalTab, setMobileModalTab] = useState<'cover' | 'toc'>('cover');

  const filteredSeries = seriesList.filter((s) => s.category === activeTab);

  // Find syllabus info for the selected series
  const syllabusInfo = selectedSeries
    ? SYLLABUS_SERIES_METADATA.find((s) => s.seriesId === selectedSeries.seriesId)
    : null;

  const syllabusChapters = selectedSeries
    ? ALL_SYLLABUS_CHAPTERS.filter((c) => c.seriesId === selectedSeries.seriesId)
    : [];

  return (
    <div className="space-y-6">
      {/* 1. Header & Shelf Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>한업 스마트 디지털 서가 (Bookshelf)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            내 수준에 맞는 책을 골라 펼쳐보세요 📚
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            표지를 클릭하면 목차와 학습 목표를 확인하고 바로 1강을 펼쳐볼 수 있습니다.
          </p>
        </div>

        {/* Shelf Category Tabs */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setActiveTab('topik')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'topik'
                ? 'bg-white text-blue-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-blue-600" />
            <span>한업 TOPIK 서가 (4종)</span>
          </button>
          <button
            onClick={() => setActiveTab('life')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'life'
                ? 'bg-white text-emerald-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>생활한국어 서가 (4단계)</span>
          </button>
        </div>
      </div>

      {/* 2. Virtual Wooden / Modern Bookshelf Display */}
      <div className="relative pt-6 pb-2 px-4 sm:px-8 bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl border border-slate-200 shadow-inner overflow-hidden">
        {/* Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 justify-items-center relative z-10 pb-6">
          {filteredSeries.map((series) => {
            const coverStyle = bookCoverStyles[series.seriesId] || {
              seriesId: series.seriesId,
              themeColor: series.accentColor,
              layoutStyle: 'center',
              titleKo: series.titleKo,
              titleZh: series.titleZh,
              subtitleKo: series.descriptionKo,
              targetLevelText: series.stageName,
              authorText: '한업 한국어교육연구소',
              publisherText: '도서출판 한업',
              isbnCode: 'ISBN 979-11-98765-01-2',
              barcodePrice: series.price.isFree ? '무료 체험' : `$${series.price.usd}`,
              finishType: 'matte',
              showQrCode: true,
            };

            const isFree = series.price?.isFree || series.price?.usd === 0;

            return (
              <div key={series.seriesId} className="flex flex-col items-center space-y-3 group">
                {/* 3D Realistic Book Cover Component */}
                <BookCover
                  styleData={coverStyle}
                  size="md"
                  interactive={true}
                  onClick={() => setSelectedSeries(series)}
                />

                {/* Shelf Label & Quick Open Button */}
                <div className="text-center space-y-1 w-full max-w-[200px]">
                  <div className="flex items-center justify-center gap-1.5">
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                        isFree
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {isFree ? '🚀 무료 체험 $0' : `단품 $${series.price.usd}`}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      총 {series.chaptersCount}강
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedSeries(series)}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-1 group-hover:border-slate-400"
                  >
                    <span>책 펼쳐보기</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Shelf Ledge (나무/모던 선반 턱) */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 shadow-md border-t border-amber-600/60 z-20">
          <div className="h-1 bg-white/20" />
        </div>
        <div className="absolute bottom-[-8px] left-2 right-2 h-2 bg-black/25 blur-sm z-10" />
      </div>

      {/* 3. Book Inspection & Two-Page Spread Chapter Selector Modal */}
      {selectedSeries && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden relative my-auto max-h-[90vh] flex flex-col">
            {/* Modal Top Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-700">
                  {selectedSeries.stageName}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  《{selectedSeries.titleKo}》 도서 열람 및 목차
                </h3>
              </div>
              <button
                onClick={() => setSelectedSeries(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-2xs border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Tab Switcher (Under 768px: WeChat & Xiaohongshu Viewport Optimization) */}
            <div className="flex md:hidden items-center justify-center p-2.5 bg-slate-100 border-b border-slate-200">
              <div className="grid grid-cols-2 gap-1 w-full max-w-xs bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMobileModalTab('cover')}
                  className={`py-1.5 rounded-lg transition-all ${
                    mobileModalTab === 'cover'
                      ? 'bg-white text-blue-700 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📘 도서 표지 & 스펙
                </button>
                <button
                  type="button"
                  onClick={() => setMobileModalTab('toc')}
                  className={`py-1.5 rounded-lg transition-all ${
                    mobileModalTab === 'toc'
                      ? 'bg-white text-blue-700 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📑 단원 목차 ({syllabusChapters.length}강)
                </button>
              </div>
            </div>

            {/* Modal Two-Page Book Spread Body */}
            <div className="p-4 sm:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-r from-slate-50/50 via-white to-amber-50/20">
              {/* Left Page: 3D Book Cover & Book Introduction */}
              <div className={`md:col-span-5 flex-col items-center space-y-4 border-b md:border-b-0 md:border-r border-slate-200/80 pb-6 md:pb-0 md:pr-6 ${mobileModalTab === 'cover' ? 'flex' : 'hidden md:flex'}`}>
                <BookCover
                  styleData={
                    bookCoverStyles[selectedSeries.seriesId] || {
                      seriesId: selectedSeries.seriesId,
                      themeColor: selectedSeries.accentColor,
                      layoutStyle: 'center',
                      titleKo: selectedSeries.titleKo,
                      titleZh: selectedSeries.titleZh,
                      subtitleKo: selectedSeries.descriptionKo,
                      targetLevelText: selectedSeries.stageName,
                      authorText: '한업 한국어교육연구소',
                      publisherText: '도서출판 한업',
                      isbnCode: 'ISBN 979-11-98765-01-2',
                      barcodePrice: selectedSeries.price.isFree ? '무료 체험' : `$${selectedSeries.price.usd}`,
                      finishType: 'matte',
                      showQrCode: true,
                    }
                  }
                  size="md"
                  interactive={false}
                />

                <div className="w-full space-y-2 text-xs bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-500">학습 코스 시간</span>
                    <span className="font-bold text-slate-900">
                      {syllabusInfo ? syllabusInfo.timeFormula : selectedSeries.schedulePace}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-500">복습 2X 보장</span>
                    <span className="font-bold text-emerald-700">
                      {selectedSeries.durationWeeks * 2}주 열람 권한 제공
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">정가 / 수강료</span>
                    <span className="font-black text-blue-600">
                      {selectedSeries.price.isFree ? '1~2강 무료 체험 ($0)' : `$${selectedSeries.price.usd} / ₩${selectedSeries.price.krw?.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <Link
                  href={
                    selectedSeries.seriesId === 'hanup_topik_prep'
                      ? '/study/hanup_topik_prep/ch_prep_01'
                      : `/study/${selectedSeries.seriesId}/${syllabusChapters[0]?.chapterId || 'ch_writing_04'}`
                  }
                  onClick={() => switchRole('student')}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm text-center shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>📖 이 책 펼쳐서 바로 학습하기</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right Page: Authentic Table of Contents (차례 / 목차) */}
              <div className={`md:col-span-7 space-y-4 ${mobileModalTab === 'toc' ? 'block' : 'hidden md:block'}`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span>차 례 (Table of Contents)</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    총 {syllabusChapters.length || selectedSeries.chaptersCount}개 단원 구성
                  </span>
                </div>

                {/* Chapter List inside Book */}
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {syllabusChapters.length > 0 ? (
                    syllabusChapters.map((ch, idx) => {
                      const isFirst = idx === 0;
                      const access = checkChapterAccess(selectedSeries.seriesId, ch.chapterId, idx);

                      return (
                        <Link
                          key={ch.chapterId}
                          href={`/study/${selectedSeries.seriesId}/${ch.chapterId}`}
                          onClick={() => switchRole('student')}
                          className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all group bg-white shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 font-black text-xs flex items-center justify-center shrink-0 transition-colors">
                              {ch.chapterNumber}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate">
                                {ch.titleKo}
                              </h4>
                              {ch.grammarPoints && ch.grammarPoints.length > 0 && (
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  문법: {ch.grammarPoints.join(', ')}
                                </p>
                              )}
                              {ch.taskType && (
                                <p className="text-[11px] text-indigo-600 truncate mt-0.5">
                                  유형: {ch.taskType}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isFirst ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                무료
                              </span>
                            ) : access.isUnlocked ? (
                              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                                수강 가능
                              </span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      단원 목차를 불러오는 중입니다...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookshelfSelector;

'use client';

import React from 'react';
import { ChevronRight, Award, Globe, Feather, CheckCircle2, Mic } from 'lucide-react';
import { BookCoverStyle } from '../../types/hanup';

export interface CategoryBookItem {
  id: string;
  titleKo: string;
  titleZh?: string;
  subtitleKo: string;
  targetLevelText: string;
  themeColor: string;
  coverStyle: BookCoverStyle;
  link: string;
  actionText: string;
  highlights: string[];
}

export interface BookCategoryData {
  key: 'topik' | 'life' | 'academic';
  badgeKo: string;
  badgeColorClass: string;
  icon: 'award' | 'globe' | 'feather';
  titleKo: string;
  subtitleKo: string;
  descriptionKo: string;
  gradientBg: string;
  accentColor: string;
  curriculumDetails?: {
    targetAudience: string;
    coreComposition: string;
    syllabusSummary: string[];
  };
  books: CategoryBookItem[];
}

interface FannedBookCategoryCardProps {
  category: BookCategoryData;
  onClick: () => void;
}

export const FannedBookCategoryCard: React.FC<FannedBookCategoryCardProps> = ({
  category,
  onClick,
}) => {
  const renderIcon = () => {
    switch (category.icon) {
      case 'award':
        return <Award className="w-5 h-5 text-blue-600" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-emerald-600" />;
      case 'feather':
      default:
        return <Feather className="w-5 h-5 text-purple-600" />;
    }
  };

  // 4 books for fan presentation
  const displayBooks = category.books.slice(0, 4);

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer select-none rounded-3xl bg-white border-2 border-slate-200/90 shadow-md hover:shadow-2xl hover:border-indigo-500 transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 sm:p-7"
    >
      {/* Ambient Top Glow on Hover */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: category.accentColor }}
      />

      {/* 1. Header Information */}
      <div className="space-y-3 z-10 relative">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide border shadow-2xs ${category.badgeColorClass}`}
          >
            {renderIcon()}
            <span>{category.badgeKo}</span>
          </span>

          <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1 font-mono shrink-0">
            교재 {displayBooks.length}종
          </span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-950 transition-colors">
            {category.titleKo}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium">
            {category.subtitleKo}
          </p>
        </div>
      </div>

      {/* 2. Interactive Fanned-Out Books Container (부채꼴 펼침 연출) */}
      <div className="py-5 sm:py-6 my-1 relative z-10 flex items-center justify-center h-60 sm:h-64 overflow-visible">
        <div
          className="relative w-32 h-44 sm:w-36 sm:h-52"
          style={{ perspective: '1000px' }}
        >
          {displayBooks.map((book, idx) => {
            const fanConfigs = [
              {
                idle: 'rotate-[-8deg] -translate-x-7 translate-y-3 scale-95 shadow-lg',
                hover: 'group-hover:rotate-[-24deg] group-hover:-translate-x-20 group-hover:-translate-y-4 group-hover:scale-105 group-hover:shadow-2xl',
                zIndex: 10,
              },
              {
                idle: 'rotate-[-3deg] -translate-x-2 translate-y-1 scale-98 shadow-md',
                hover: 'group-hover:rotate-[-8deg] group-hover:-translate-x-7 group-hover:-translate-y-6 group-hover:scale-108 group-hover:shadow-2xl',
                zIndex: 20,
              },
              {
                idle: 'rotate-[3deg] translate-x-2 translate-y-1 scale-98 shadow-md',
                hover: 'group-hover:rotate-[8deg] group-hover:translate-x-7 group-hover:-translate-y-6 group-hover:scale-108 group-hover:shadow-2xl',
                zIndex: 30,
              },
              {
                idle: 'rotate-[8deg] translate-x-7 translate-y-3 scale-95 shadow-lg',
                hover: 'group-hover:rotate-[24deg] group-hover:translate-x-20 group-hover:-translate-y-4 group-hover:scale-105 group-hover:shadow-2xl',
                zIndex: 40,
              },
            ];

            const cfg = fanConfigs[idx] || fanConfigs[0];

            return (
              <div
                key={book.id}
                className={`absolute inset-0 transition-all duration-500 ease-out origin-bottom ${cfg.idle} ${cfg.hover}`}
                style={{ zIndex: cfg.zIndex }}
              >
                <div
                  className="w-full h-full rounded-r-xl rounded-l-xs overflow-hidden relative border border-white/25 flex flex-col justify-between p-3 text-white shadow-xl"
                  style={{
                    backgroundColor: book.themeColor,
                    backgroundImage: `
                      linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.3) 100%),
                      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)
                    `,
                  }}
                >
                  {/* Left Spine Crease */}
                  <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none z-10" />
                  <div className="absolute top-0 bottom-0 left-2 w-[1px] bg-white/30 pointer-events-none z-10" />

                  {/* Right Page Edge Thickness */}
                  <div className="absolute top-1 bottom-1 -right-1 w-1 bg-gradient-to-r from-slate-200 to-amber-50 rounded-r-2xs pointer-events-none z-0" />

                  {/* Bookmark Ribbon */}
                  <div className="absolute -top-0.5 right-3 w-2 h-5 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-2xs shadow-xs pointer-events-none z-20" />

                  {/* Mini Cover Header */}
                  <div className="relative z-10 space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-black/25 text-white/95 border border-white/10 inline-block truncate max-w-full">
                      {book.targetLevelText}
                    </span>
                    <h4 className="font-black text-[11px] sm:text-xs leading-tight line-clamp-2 drop-shadow-xs">
                      {book.titleKo}
                    </h4>
                  </div>

                  {/* Mini Cover Footer */}
                  <div className="relative z-10 border-t border-white/20 pt-1 flex items-center justify-between text-[8px] text-white/80 font-mono">
                    <span className="truncate">한업 교재</span>
                    <span className="font-bold">Vol. {idx + 1}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Curriculum Summary Box inside Card */}
      {category.curriculumDetails && (
        <div className="z-10 relative bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-1.5 mb-4 text-xs">
          <div className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center justify-between">
            <span>📚 수록 커리큘럼 구성</span>
            {category.key === 'life' && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                <Mic className="w-3 h-3" /> 소리튜터 유입
              </span>
            )}
          </div>
          <ul className="space-y-1 text-[11px] text-slate-600">
            {category.curriculumDetails.syllabusSummary.map((line, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Footer Action Strip */}
      <div className="z-10 relative pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 font-semibold">
          레벨 테스트 & 1차시 무료 체험 포함
        </span>

        <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 group-hover:bg-indigo-600 text-white font-black text-xs transition-all shadow-md group-hover:scale-105 shrink-0">
          <span>이 트랙 선택하기</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

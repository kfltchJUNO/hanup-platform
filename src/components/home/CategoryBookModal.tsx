'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Award,
  Globe,
  Feather,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { BookCategoryData, CategoryBookItem } from './FannedBookStack';
import { BookCover } from '../BookCover';
import { useHanUp } from '../../context/HanUpContext';

interface CategoryBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BookCategoryData | null;
}

export const CategoryBookModal: React.FC<CategoryBookModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const { switchRole } = useHanUp();

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* 1. Modal Header */}
        <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/10 rounded-2xl border border-white/20 text-white">
              {category.icon === 'award' && <Award className="w-5 h-5 text-blue-400" />}
              {category.icon === 'globe' && <Globe className="w-5 h-5 text-emerald-400" />}
              {category.icon === 'feather' && <Feather className="w-5 h-5 text-purple-400" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                  {category.badgeKo}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {category.titleKo} 교재 선택
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                원하는 교재를 선택하면 1강 전자책 뷰어로 바로 이동하여 학습을 시작할 수 있습니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 2. Modal Body: Book Grid */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 bg-slate-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {category.books.map((book, index) => (
              <div
                key={book.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-400 transition-all flex flex-col sm:flex-row gap-5 items-center sm:items-start group"
              >
                {/* 3D Book Cover Miniature */}
                <div className="shrink-0">
                  <BookCover
                    styleData={book.coverStyle}
                    size="sm"
                    interactive={false}
                  />
                </div>

                {/* Book Details & Actions */}
                <div className="flex-1 space-y-3 flex flex-col justify-between h-full w-full">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {book.targetLevelText}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        Book #{index + 1}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {book.titleKo}
                    </h4>
                    {book.titleZh && (
                      <p className="text-xs text-slate-400 font-medium">
                        {book.titleZh}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed font-sans pt-1">
                      {book.subtitleKo}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    {book.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Primary Link CTA */}
                  <div className="pt-2">
                    <Link
                      href={book.link}
                      onClick={() => {
                        switchRole('student');
                        onClose();
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{book.actionText}</span>
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>모든 교재는 스마트 뷰어, 소리튜터 발음 진단, 20칸 원고지 AI 첨삭이 연동됩니다.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

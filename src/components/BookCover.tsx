'use client';

import React from 'react';
import { BookOpen, Sparkles, QrCode, Award, ShieldCheck, Check } from 'lucide-react';
import { BookCoverStyle } from '../types/hanup';

interface BookCoverProps {
  styleData: BookCoverStyle;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  showSpineShadow?: boolean;
}

export const BookCover: React.FC<BookCoverProps> = ({
  styleData,
  size = 'md',
  className = '',
  interactive = true,
  onClick,
  showSpineShadow = true,
}) => {
  // Explicit Tailwind dimensions with strict 3:4 textbook aspect ratio
  const sizeMap = {
    xs: 'w-[104px] h-[144px] sm:w-[120px] sm:h-[164px] text-[9px]',
    sm: 'w-[136px] h-[188px] sm:w-[156px] sm:h-[216px] text-[10px]',
    md: 'w-48 h-64 sm:w-56 sm:h-80 text-xs',
    lg: 'w-60 h-80 sm:w-72 sm:h-96 text-sm',
    xl: 'w-72 h-96 sm:w-80 sm:h-[420px] text-base',
  };

  const isCompact = size === 'xs' || size === 'sm';

  const {
    themeColor = '#10b981',
    layoutStyle = 'center',
    titleKo = '한업 한국어 교재',
    titleZh,
    subtitleKo = '스마트 맞춤형 한국어 스마트 러닝 교재',
    targetLevelText = 'TOPIK 전용',
    spineText,
    authorText = '한업 한국어교육연구소 기획·집필',
    publisherText = '도서출판 한업 (HanUp Publishing)',
    isbnCode = 'ISBN 979-11-98765-01-2',
    barcodePrice = '₩14,000 / $12.00',
    finishType = 'matte',
    showQrCode = true,
  } = styleData;

  const getAlignmentClasses = () => {
    switch (layoutStyle) {
      case 'top':
        return 'justify-start pt-6 sm:pt-8 text-left';
      case 'left':
        return 'justify-center text-left pl-2 sm:pl-3';
      case 'center':
      default:
        return 'justify-center text-center items-center';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative select-none shrink-0 aspect-[3/4] transition-all duration-300 ${
        interactive ? 'cursor-pointer hover:-translate-y-2.5 hover:rotate-1 hover:shadow-2xl group' : ''
      } ${sizeMap[size]} ${className}`}
      style={{ perspective: '1200px' }}
      title={`${titleKo} - 클릭하여 교재 목차 펼치기`}
    >
      {/* 3D Book Object Container */}
      <div
        className={`w-full h-full rounded-r-2xl rounded-l-md overflow-hidden relative shadow-xl shadow-slate-950/25 border border-white/20 flex flex-col justify-between text-white transition-all duration-300 ${
          isCompact ? 'p-3 sm:p-3.5' : 'p-4 sm:p-6'
        }`}
        style={{
          backgroundColor: themeColor,
          backgroundImage: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(0, 0, 0, 0.28) 100%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)
          `,
        }}
      >
        {/* Book Spine Shadow / Crease (Left Edge) */}
        {showSpineShadow && (
          <>
            <div
              className={`absolute top-0 bottom-0 left-0 ${
                isCompact ? 'w-2.5' : 'w-3 sm:w-4'
              } bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none z-20`}
            />
            <div
              className={`absolute top-0 bottom-0 ${
                isCompact ? 'left-2.5' : 'left-3 sm:left-4'
              } w-[1.5px] bg-white/25 pointer-events-none z-20 shadow-xs`}
            />
          </>
        )}

        {/* Paper Edge Layer (Right Edge Thickness Effect) */}
        <div className="absolute top-1 bottom-1 -right-1 w-1.5 bg-gradient-to-r from-slate-200 to-amber-50 rounded-r-xs pointer-events-none shadow-sm z-0" />
        <div className="absolute top-2 bottom-2 -right-2 w-1 bg-gradient-to-r from-slate-300 to-amber-100 rounded-r-xs pointer-events-none shadow-sm z-0" />

        {/* Golden / Silk Ribbon Bookmark hanging from Top Right */}
        <div
          className={`absolute -top-1 ${
            isCompact ? 'right-3 w-2.5 h-6' : 'right-6 sm:right-8 w-3 sm:w-4 h-8 sm:h-10'
          } bg-gradient-to-b from-amber-300 to-amber-500 shadow-md rounded-b-xs pointer-events-none z-30 transform group-hover:translate-y-1 transition-transform`}
        >
          <div className="w-full h-1.5 bg-amber-600/30 absolute bottom-0 clip-path-chevron" />
        </div>

        {/* Glossy / Leather Finish Reflection Overlay */}
        {finishType === 'glossy' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 pointer-events-none z-10" />
        )}

        {/* TOP SECTION: Series Imprint & Target Grade Badge */}
        {isCompact ? (
          <div className="relative z-10 flex items-center justify-between gap-1 border-b border-white/20 pb-1.5 pl-1">
            <span className="px-1.5 py-0.5 rounded-md bg-black/25 backdrop-blur-xs text-[8px] sm:text-[9px] font-black border border-white/20 text-white truncate max-w-[85%]">
              {targetLevelText}
            </span>
          </div>
        ) : (
          <div className="relative z-10 flex items-start justify-between gap-2 border-b border-white/20 pb-2.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-md bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-[10px] shrink-0">
                H
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-[10px] sm:text-xs tracking-wider uppercase block text-white/90 truncate">
                  HanUp Textbook
                </span>
                <span className="text-[8px] sm:text-[9px] text-white/70 block leading-tight font-medium truncate">
                  표준 교육과정 인증 교재
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-[10px] sm:text-xs font-black border border-white/30 text-white shadow-xs shrink-0">
              {targetLevelText}
            </span>
          </div>
        )}

        {/* MIDDLE SECTION: Book Title & Subtitle */}
        <div
          className={`relative z-10 flex flex-col my-auto ${
            isCompact ? 'justify-center text-left pl-1.5' : getAlignmentClasses()
          }`}
        >
          <div className={isCompact ? 'space-y-1' : 'space-y-1.5 sm:space-y-2'}>
            <span
              className={`inline-block rounded-md bg-black/20 text-white/90 font-bold ${
                isCompact ? 'px-1.5 py-0.5 text-[8px]' : 'px-2 py-0.5 text-[9px] sm:text-[11px]'
              }`}
            >
              한업 표준 교재
            </span>

            <h3
              className={`font-black tracking-tight leading-snug text-white drop-shadow-sm break-keep ${
                isCompact
                  ? 'text-xs sm:text-sm line-clamp-3'
                  : 'text-base sm:text-xl lg:text-2xl group-hover:scale-[1.02] transition-transform'
              }`}
            >
              {titleKo}
            </h3>

            {!isCompact && titleZh && (
              <p className="text-[10px] sm:text-xs font-medium text-white/80 line-clamp-1">
                {titleZh}
              </p>
            )}

            {!isCompact && (
              <p className="text-[9px] sm:text-[11px] text-white/90 leading-relaxed font-sans max-w-[95%] line-clamp-2">
                {subtitleKo}
              </p>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: Author, Publisher, Barcode & QR Code */}
        {isCompact ? (
          <div className="relative z-10 pt-1.5 border-t border-white/20 flex items-center justify-between text-[8px] text-white/85 pl-1">
            <span className="font-bold truncate">도서출판 한업</span>
            <BookOpen className="w-3 h-3 text-white/80 shrink-0" />
          </div>
        ) : (
          <div className="relative z-10 pt-2 border-t border-white/20 space-y-2">
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-white/80 gap-2">
              <span className="font-medium truncate max-w-[60%]">{authorText}</span>
              <span className="font-mono font-bold text-white/90 shrink-0">{barcodePrice}</span>
            </div>

            <div className="flex items-end justify-between gap-2 pt-0.5">
              {/* Publisher imprint lockup */}
              <div className="flex items-center gap-1.5 min-w-0">
                <BookOpen className="w-3.5 h-3.5 text-white/80 shrink-0" />
                <div className="min-w-0">
                  <span className="font-black text-[10px] sm:text-[11px] text-white block leading-none truncate">
                    {publisherText}
                  </span>
                  <span className="font-mono text-[8px] text-white/60 block mt-0.5 truncate">
                    {isbnCode}
                  </span>
                </div>
              </div>

              {/* QR Deep-link Stamp */}
              {showQrCode && (
                <div
                  className="bg-white p-1 rounded-md shadow-xs shrink-0 flex items-center justify-center"
                  title="QR 스캔으로 AI 음원 & 첨삭 연동"
                >
                  <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCover;

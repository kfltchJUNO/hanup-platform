'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HanUpLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const HanUpLogo: React.FC<HanUpLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [textIndex, setTextIndex] = useState<0 | 1>(0); // 0: Korean (한업), 1: English (HanUp)

  // Emblem and text dimension map with strictly fixed bounding widths to prevent nav jitter
  const dimensionMap = {
    sm: {
      box: 'w-9 h-9 sm:w-10 sm:h-10',
      px: 40,
      textBox: 'w-16 sm:w-20 h-7',
      textSize: 'text-lg sm:text-xl',
    },
    md: {
      box: 'w-11 h-11 sm:w-12 sm:h-12',
      px: 48,
      textBox: 'w-20 sm:w-24 h-8',
      textSize: 'text-xl sm:text-2xl',
    },
    lg: {
      box: 'w-14 h-14 sm:w-16 sm:h-16',
      px: 64,
      textBox: 'w-24 sm:w-28 h-9',
      textSize: 'text-2xl sm:text-3xl',
    },
  };

  const dim = dimensionMap[size];

  // Automatic smooth text rotation between Korean ('한업') and English ('HanUp')
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const triggerAnimation = () => {
    setIsSpinning(true);
    setTextIndex((prev) => (prev === 0 ? 1 : 0));
    setTimeout(() => {
      setIsSpinning(false);
    }, 1150);
  };

  return (
    <div
      onClick={triggerAnimation}
      className={`hanup-logo-container select-none cursor-pointer group flex items-center shrink-0 ${isSpinning ? 'hanup-spin-active' : ''} ${className}`}
      title="한업 (HanUp) - 클릭하면 로고 회전 및 한글/영문 전환"
    >
      {/* 3D Rotating Emblem Container */}
      <div
        className={`${dim.box} hanup-logo-emblem relative rounded-2xl overflow-hidden shadow-sm shadow-amber-900/10 border-2 border-amber-300/80 bg-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-lg group-hover:border-amber-400 group-hover:scale-105`}
      >
        <Image
          src="/images/hanup-logo-square.jpg"
          alt="한업 HanUp 로고"
          width={dim.px}
          height={dim.px}
          priority
          className="object-cover w-full h-full"
        />

        {/* Diagonal Light Shimmer Sweep Layer */}
        <div className="hanup-logo-shimmer" />
      </div>

      {showText && (
        <div className={`ml-2.5 sm:ml-3 text-left relative ${dim.textBox} shrink-0 overflow-hidden`}>
          {/* Korean Text: 한업 */}
          <div
            className={`absolute inset-0 flex items-center transition-all duration-500 ease-out transform ${
              textIndex === 0
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-3 scale-95 pointer-events-none'
            }`}
          >
            <span
              className={`${dim.textSize} font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap`}
            >
              한업
            </span>
          </div>

          {/* English Text: HanUp */}
          <div
            className={`absolute inset-0 flex items-center transition-all duration-500 ease-out transform ${
              textIndex === 1
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
            }`}
          >
            <span
              className={`${dim.textSize} font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-indigo-500 transition-all font-sans whitespace-nowrap`}
            >
              HanUp
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HanUpLogo;

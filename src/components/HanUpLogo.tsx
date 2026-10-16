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
  const [isFlipping, setIsFlipping] = useState(false);

  // Emblem sizes: noticeably larger and bolder
  const dimensionMap = {
    sm: { box: 'w-9 h-9 sm:w-10 sm:h-10', px: 40 },
    md: { box: 'w-11 h-11 sm:w-12 sm:h-12', px: 48 },
    lg: { box: 'w-14 h-14 sm:w-16 sm:h-16', px: 64 },
  };

  const dim = dimensionMap[size];

  // Automatic smooth text rotation between Korean ('한업') and English ('HanUp')
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setTextIndex((prev) => (prev === 0 ? 1 : 0));
        setIsFlipping(false);
      }, 300); // half transition duration
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const triggerAnimation = () => {
    setIsSpinning(true);
    setIsFlipping(true);
    setTimeout(() => {
      setTextIndex((prev) => (prev === 0 ? 1 : 0));
      setIsFlipping(false);
    }, 250);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1150);
  };

  return (
    <div
      onClick={triggerAnimation}
      className={`hanup-logo-container select-none cursor-pointer group flex items-center ${isSpinning ? 'hanup-spin-active' : ''} ${className}`}
      title="한업 (HanUp) - 클릭하면 로고 회전과 한글/영어 전환 효과가 재생됩니다"
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
        <div className="ml-2.5 sm:ml-3 text-left">
          {/* Animated 3D Rolling Text Container */}
          <div
            className={`transition-all duration-300 ease-out transform ${
              isFlipping
                ? 'opacity-0 -translate-y-2 scale-95'
                : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            {textIndex === 0 ? (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    한업
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700">
                    AI 튜터
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-none mt-0.5 hidden xs:block">
                  스마트 한국어 교육 플랫폼
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-indigo-500 transition-all">
                    HanUp
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                    Smart AI
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-none mt-0.5 hidden xs:block">
                  Korean Learning Platform
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HanUpLogo;

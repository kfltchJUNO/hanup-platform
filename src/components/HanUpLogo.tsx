'use client';

import React, { useState } from 'react';
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

  const dimensionMap = {
    sm: { box: 'w-7 h-7 sm:w-8 sm:h-8', px: 32 },
    md: { box: 'w-8 h-8 sm:w-9 sm:h-9', px: 36 },
    lg: { box: 'w-10 h-10 sm:w-12 sm:h-12', px: 48 },
  };

  const dim = dimensionMap[size];

  const triggerAnimation = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1150);
  };

  return (
    <div
      onClick={triggerAnimation}
      className={`hanup-logo-container select-none cursor-pointer group ${isSpinning ? 'hanup-spin-active' : ''} ${className}`}
      title="한업 (HanUp) - 클릭하면 3D 회전과 반짝임 효과가 재생됩니다"
    >
      {/* 3D Rotating Emblem Container */}
      <div
        className={`${dim.box} hanup-logo-emblem relative rounded-xl overflow-hidden shadow-sm shadow-amber-900/10 border border-amber-200/60 bg-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-md group-hover:border-amber-400/80 group-hover:scale-105`}
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
        <div className="ml-2 sm:ml-2.5 text-left">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              한업
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-blue-600 tracking-wider">
              HanUp
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-400 border-l border-slate-300 pl-1 sm:pl-1.5">
              韩升
            </span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-none hidden xs:block">
            스마트 한국어 교육 플랫폼
          </p>
        </div>
      )}
    </div>
  );
};

export default HanUpLogo;

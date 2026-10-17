'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink, X, Smartphone } from 'lucide-react';

export const InAppBrowserBanner: React.FC = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserType, setBrowserType] = useState<string>('');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const isWeChat = /micromessenger/i.test(ua);
    const isXhs = /xhsbackstage|xiaohongshu/i.test(ua);
    const isLine = /line\//i.test(ua);
    const isKakao = /kakaotalk/i.test(ua);

    if (isWeChat) {
      setIsInAppBrowser(true);
      setBrowserType('위챗 (WeChat / 微信)');
    } else if (isXhs) {
      setIsInAppBrowser(true);
      setBrowserType('샤오홍슈 (Xiaohongshu / 小红书)');
    } else if (isLine || isKakao) {
      setIsInAppBrowser(true);
      setBrowserType('소셜 인앱 브라우저');
    }
  }, []);

  if (!isInAppBrowser || dismissed) return null;

  return (
    <aside aria-label="인앱 브라우저 감지 안내" className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2.5 shadow-md sticky top-0 z-50 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
          </div>
          <div>
            <span className="font-black bg-black/20 px-2 py-0.5 rounded-md mr-1.5">
              {browserType} 감지
            </span>
            <span className="font-semibold">
              인앱 브라우저에서는 <strong>WebRTC 마이크 음성 녹음 및 PDF 다운로드</strong>가 차단될 수 있습니다.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg font-bold text-[11px]">
            <Smartphone className="w-3.5 h-3.5" />
            <span>우측 상단 [···] ➔ &apos;기본 브라우저(Safari/Chrome)로 열기&apos;</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

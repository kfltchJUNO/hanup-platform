'use client';

import React from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';

export function Footer() {
  const { openLegalModal } = useHanUp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Row: Brand Info & Suite Ecosystem */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">
                한업 (HanUp | 韩升)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 font-bold">
                EdTech AI SaaS
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              글로벌 외국인 학습자를 위한 AI 1:1 한국어 작문 첨삭 & TOPIK 스마트 인터랙티브 교육 플랫폼
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-blue-400 border border-slate-700/80 font-bold">
              한업 TOPIK
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-emerald-400 border border-slate-700/80 font-bold">
              생활한국어
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-purple-400 border border-slate-700/80 font-bold">
              소리튜터 (발음)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-amber-400 border border-slate-700/80 font-bold">
              우리반 (Wooriban)
            </span>
          </div>
        </div>

        {/* Middle Row: Legal Policies (Lemon Squeezy Compliance) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Policy Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-semibold">
            <button
              onClick={() => openLegalModal('refund')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 underline underline-offset-4"
              title="7일 이내 미사용 전액 환불 정책 안내"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>환불 정책 (Refund Policy)</span>
            </button>

            <button
              onClick={() => openLegalModal('terms')}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              title="한업 서비스 이용약관"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>이용약관 (Terms of Service)</span>
            </button>

            <button
              onClick={() => openLegalModal('privacy')}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              title="개인정보처리방침"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>개인정보처리방침 (Privacy Policy)</span>
            </button>

            <button
              onClick={() => openLegalModal('support')}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              title="고객 지원 센터 및 문의"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>고객 지원 & 문의 (Support)</span>
            </button>
          </div>

          {/* Contact Support Pill */}
          <div className="flex items-center gap-3">
            <a
              href="mailto:support@hanup.kr"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>support@hanup.kr</span>
            </a>
            <span className="text-[11px] text-slate-500">평일 24h 이내 회신</span>
          </div>
        </div>

        {/* Bottom Row: MoR Notice & Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              글로벌 안전 결제: <strong>Lemon Squeezy</strong> 공인 판매 대행(Merchant of Record)을 통해 안전하게 암호화 결제됩니다.
            </span>
          </div>

          <p>© 2026 HanUp (한업 | 韩升). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

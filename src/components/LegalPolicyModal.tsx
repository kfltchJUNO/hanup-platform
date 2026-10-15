'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  RotateCcw,
  FileText,
  Lock,
  Mail,
  CheckCircle2,
  Globe,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';

export function LegalPolicyModal() {
  const { isLegalModalOpen, legalModalTab, openLegalModal, closeLegalModal } = useHanUp();
  const [langMode, setLangMode] = useState<'ko' | 'en'>('ko');

  if (!isLegalModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {langMode === 'ko' ? '한업(HanUp) 법적 정책 및 고객 지원' : 'HanUp Legal Policies & Customer Support'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                  Verified MoR
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lemon Squeezy & Global Consumer Protection Compliant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher Toggle */}
            <div className="inline-flex rounded-xl p-0.5 bg-slate-800 border border-slate-700 text-xs">
              <button
                onClick={() => setLangMode('ko')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  langMode === 'ko' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                한국어
              </button>
              <button
                onClick={() => setLangMode('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  langMode === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={closeLegalModal}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => openLegalModal('refund')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              legalModalTab === 'refund'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span>{langMode === 'ko' ? '환불 정책 (Refund)' : 'Refund Policy'}</span>
          </button>

          <button
            onClick={() => openLegalModal('terms')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              legalModalTab === 'terms'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>{langMode === 'ko' ? '이용약관 (Terms)' : 'Terms of Service'}</span>
          </button>

          <button
            onClick={() => openLegalModal('privacy')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              legalModalTab === 'privacy'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-600" />
            <span>{langMode === 'ko' ? '개인정보처리방침 (Privacy)' : 'Privacy Policy'}</span>
          </button>

          <button
            onClick={() => openLegalModal('support')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              legalModalTab === 'support'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-purple-600" />
            <span>{langMode === 'ko' ? '고객지원 (Contact)' : 'Customer Support'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          {/* TAB 1: REFUND POLICY */}
          {legalModalTab === 'refund' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-emerald-900 text-sm">
                    {langMode === 'ko'
                      ? '7일 100% 무조건 전액 환불 보장 (7-Day Money-Back Guarantee)'
                      : '7-Day 100% Money-Back Guarantee for Unused Digital Products'}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    {langMode === 'ko'
                      ? '결제 후 7일 이내에 디지털 교재를 열람하지 않았거나 AI 첨삭 기능을 이용하지 않은 경우, 조건 없이 100% 전액 환불해 드립니다.'
                      : 'If you have not accessed paid chapter contents or consumed AI grading credits within 7 days of purchase, you are eligible for a 100% full refund with no questions asked.'}
                  </p>
                </div>
              </div>

              {langMode === 'ko' ? (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-slate-900 mb-1">1. 구독 상품 (Monthly Subscription) 해지 안내</h5>
                    <p className="text-slate-600">
                      • HanUp All-Pass Pro 구독 상품은 마이 대시보드 또는 이메일 요청을 통해 <strong>언제든지 즉시 해지</strong>하실 수 있습니다.<br />
                      • 해지 시 다음 결제 주기의 자동 결제가 영구 중단되며, 이미 결제된 해당 월의 잔여 기간 동안은 정상 이용이 유지됩니다.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 mb-1">2. 단품 교재 및 패스 상품 환불 기준</h5>
                    <p className="text-slate-600">
                      • 디지털 콘텐츠 특성상 유료 챕터 본문을 열람하거나 AI 첨삭을 1회 이상 이용한 이후에는 콘텐츠 가치 훼손으로 환불이 제한될 수 있습니다.<br />
                      • 시스템 오류나 서비스 장애로 인해 정상적인 학습이 불가능했던 경우, 이용 여부와 무관하게 전액 환불 또는 이용 기간 연장 처리를 진행합니다.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 mb-1">3. 환불 신청 및 처리 절차</h5>
                    <p className="text-slate-600">
                      • 고객 지원 이메일(<strong>support@hanup.kr</strong>)로 주문번호(Order ID) 또는 결제 이메일을 보내주시면 <strong>영업일 기준 24시간 이내</strong>에 신속하게 처리해 드립니다.<br />
                      • Lemon Squeezy 결제 시스템을 통해 원래 결제하신 카드/수단으로 안전하게 환불 승인됩니다.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-slate-900 mb-1">1. Subscription Cancellation Policy</h5>
                    <p className="text-slate-600">
                      • You can cancel your HanUp All-Pass monthly subscription at any time via your user dashboard or by contacting support.<br />
                      • Upon cancellation, recurring billing will stop immediately. You will retain full access to all features until the end of your current billing period.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 mb-1">2. Digital Content & One-Time Courses</h5>
                    <p className="text-slate-600">
                      • Due to the nature of digital goods, refunds cannot be granted once paid chapter contents have been accessed or AI grading credits have been actively consumed.<br />
                      • In the event of technical bugs or service downtime preventing normal usage, full refunds or extension passes will be provided immediately.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 mb-1">3. How to Request a Refund</h5>
                    <p className="text-slate-600">
                      • Simply email <strong>support@hanup.kr</strong> with your Order ID and receipt. Requests are reviewed and processed within 24 business hours via Lemon Squeezy Merchant of Record.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {legalModalTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                {langMode === 'ko' ? '서비스 이용약관 (Terms of Service)' : 'Terms of Service'}
              </h4>
              <p className="text-slate-600">
                {langMode === 'ko'
                  ? '본 약관은 한업(HanUp) 플랫폼이 제공하는 모든 스마트 교재, TOPIK 시험 대비 인터랙티브 서비스, AI 작문 첨삭 및 소리튜터 발음 클리닉의 이용 조건과 절차를 규정합니다.'
                  : 'These Terms of Service govern your access to and use of HanUp platform, including interactive smart textbooks, AI essay grading, speech pronunciation clinics, and educational resources.'}
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <h5 className="font-bold text-slate-900">1. 계정 및 라이선스 (Account & Single-User License)</h5>
                  <p className="text-slate-600 text-xs">
                    {langMode === 'ko'
                      ? '모든 유료 교재와 구독 권한은 구매자 본인 1인에게 귀속되며, 계정 공유 또는 무단 전재 및 상업적 재배포는 엄격히 금지됩니다.'
                      : 'All purchases grant a non-transferable, single-user digital license. Account sharing or unauthorized commercial distribution of proprietary textbook materials is strictly prohibited.'}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900">2. AI 피드백 및 보조 도구 고지 (AI Feedback Disclaimer)</h5>
                  <p className="text-slate-600 text-xs">
                    {langMode === 'ko'
                      ? 'AI 첨삭 및 음운 피드백은 한국어 학습 보조 도구로 제공되며, 실제 국립국제교육원 TOPIK 공식 시험의 최종 점수나 합격을 법적으로 보증하지는 않습니다.'
                      : 'AI-assisted grammar and writing feedback serves as an educational aid and does not guarantee specific official exam scores or certificates.'}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900">3. 지불 및 과금 (Merchant of Record Notice)</h5>
                  <p className="text-slate-600 text-xs">
                    {langMode === 'ko'
                      ? '글로벌 온라인 결제는 공인 결제 대행사인 Lemon Squeezy(MoR)를 통해 안전하게 처리되며, 결제 명세서에는 Lemon Squeezy 또는 HanUp으로 표기됩니다.'
                      : 'Our order process is conducted by our online reseller & Merchant of Record, Lemon Squeezy, who also handles order-related inquiries and returns.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {legalModalTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                {langMode === 'ko' ? '개인정보처리방침 (Privacy Policy)' : 'Privacy Policy'}
              </h4>
              <p className="text-slate-600">
                {langMode === 'ko'
                  ? '한업은 학습자의 개인정보를 소중히 보호하며, 관련 법령 및 글로벌 표준(GDPR)을 철저히 준수합니다.'
                  : 'HanUp values your privacy and is committed to protecting your personal information in compliance with global standards, including GDPR.'}
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">
                    {langMode === 'ko' ? '수집하는 항목:' : 'Information Collected:'}
                  </strong>
                  • {langMode === 'ko' ? '기본 식별 정보: 구글 이메일, 이름, 프로필 사진' : 'Basic info: Google Account email, display name'}<br />
                  • {langMode === 'ko' ? '학습 데이터: 작문 제출 답안, AI 첨삭 내역, 발음 채점 로그, 학습 진도율' : 'Learning data: Essay submissions, AI feedback logs, pronunciation scores'}<br />
                  • {langMode === 'ko' ? '선택적 연구 변인: 모국어(L1), 학습 기간 (사전 동의 시 암호화 보관)' : 'Academic background variables (L1, learning duration) collected with explicit consent'}
                </div>

                <p>
                  {langMode === 'ko'
                    ? '수집된 개인정보는 회원 탈퇴 시 지체 없이 파기되며, 제3자에게 마케팅 목적으로 판매하거나 제공하지 않습니다.'
                    : 'Your personal data is never sold to third parties. Academic writing corpora are strictly pseudonymized and stored in encrypted form.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER SUPPORT & CONTACT */}
          {legalModalTab === 'support' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                {langMode === 'ko' ? '고객 지원 및 문의 (Contact & Support)' : 'Customer Support & Contact Information'}
              </h4>
              <p className="text-slate-600">
                {langMode === 'ko'
                  ? '결제, 환불, 학습 기능 오류, B2B 기관 분양 문의는 전담 지원팀에서 신속하게 답변해 드립니다.'
                  : 'Our dedicated customer support team is ready to assist you with order inquiries, refunds, and technical feedback.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                    공식 고객지원 이메일
                  </span>
                  <a
                    href="mailto:support@hanup.kr"
                    className="text-base font-extrabold text-blue-900 hover:underline block"
                  >
                    support@hanup.kr
                  </a>
                  <p className="text-[11px] text-slate-500">
                    평일 24시간 이내 100% 회신 보장
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    운영 시간 (Operating Hours)
                  </span>
                  <div className="text-sm font-bold text-slate-900">
                    월~금 09:00 - 18:00 (KST)
                  </div>
                  <p className="text-[11px] text-slate-500">
                    주말 및 공휴일 접수 시 익영업일 우선 처리
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>공식 배포 웹사이트: <strong>https://hanup-platform.vercel.app</strong></span>
                <span className="text-[11px] text-slate-400">Seoul, Republic of Korea</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            © 2026 HanUp. All rights reserved. • Lemon Squeezy Merchant of Record
          </span>
          <button
            onClick={closeLegalModal}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            {langMode === 'ko' ? '닫기' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

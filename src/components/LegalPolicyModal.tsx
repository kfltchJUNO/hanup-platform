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
  Clock,
  Sparkles,
  CreditCard,
  UserCheck,
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
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {langMode === 'ko' ? '한업(HanUp) 법적 정책 및 고객 지원 센터' : 'HanUp Legal Policies & Customer Support'}
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
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              legalModalTab === 'refund'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span>{langMode === 'ko' ? '환불 정책' : 'Refund Policy'}</span>
          </button>

          <button
            onClick={() => openLegalModal('terms')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              legalModalTab === 'terms'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>{langMode === 'ko' ? '이용약관' : 'Terms of Service'}</span>
          </button>

          <button
            onClick={() => openLegalModal('privacy')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              legalModalTab === 'privacy'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-600" />
            <span>{langMode === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}</span>
          </button>

          <button
            onClick={() => openLegalModal('support')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              legalModalTab === 'support'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-purple-600" />
            <span>{langMode === 'ko' ? '고객지원 & 문의' : 'Customer Support'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          {/* ========================================================================= */}
          {/* TAB 1: REFUND POLICY                                                      */}
          {/* ========================================================================= */}
          {legalModalTab === 'refund' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base">
                    {langMode === 'ko'
                      ? '7일 100% 무조건 전액 환불 보장 (7-Day Money-Back Guarantee)'
                      : '7-Day 100% Money-Back Guarantee for Unused Digital Courses'}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-900 mt-1 leading-relaxed">
                    {langMode === 'ko'
                      ? '결제일로부터 7일 이내에 유료 챕터 본문을 열람하지 않았거나 AI 첨삭 크레딧을 소비하지 않은 경우, 사유를 묻지 않고 100% 전액 환불해 드립니다.'
                      : 'If you have not accessed paid chapter contents or consumed AI grading credits within 7 days of purchase, you are eligible for an unconditional 100% full refund.'}
                  </p>
                </div>
              </div>

              {langMode === 'ko' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>1. 정기 구독 상품 (Monthly All-Pass Pro) 해지 규정</span>
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      • 구독 상품은 마이 대시보드 또는 공식 고객지원 이메일(<strong>ot.helper7@gmail.com</strong>)로 <strong>언제든지 즉시 해지</strong>하실 수 있습니다.<br />
                      • 해지 신청 시 다음 결제 주기의 자동 결제가 영구 차단되며, 이미 결제된 해당 결제월의 잔여 이용 기간 동안은 모든 기능과 교재를 차질 없이 이용하실 수 있습니다.<br />
                      • 결제 당일 착오로 중복 결제된 경우 즉시 취소 및 전액 환불 처리해 드립니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>2. 단품 교재 및 패스(Course Pass) 상품 환불 기준</span>
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      • 전자상거래 등에서의 소비자보호에 관한 법률 및 디지털 콘텐츠 특성상, <strong>유료 챕터 본문을 열람하거나 AI 원고지 첨삭 기능을 1회 이상 이용한 이후</strong>에는 지식 콘텐츠 가치 훼손으로 원칙적으로 환불이 제한될 수 있습니다.<br />
                      • 단, <strong>시스템 장애, 서버 접속 불가, 치명적인 버그</strong>로 인해 정상적인 학습이 불가능했던 경우, 사용 여부와 무관하게 <strong>100% 전액 환불 또는 이용 기간 무상 연장</strong>을 보장합니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-600" />
                      <span>3. 간편 환불 신청 및 처리 절차 (24시간 회신)</span>
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      • 공식 지원 이메일: <a href="mailto:ot.helper7@gmail.com" className="text-blue-600 font-bold underline">ot.helper7@gmail.com</a><br />
                      • 기재 사항: <strong>[주문번호(Order ID)]</strong> 또는 <strong>[결제 시 입력한 이메일 주소]</strong>, 환불 요청 사유<br />
                      • 처리 기한: 접수 확인 후 <strong>영업일 기준 24시간 이내</strong>에 신속 검토 및 승인 처리됩니다.<br />
                      • 환불 대금은 글로벌 결제 대행사(Lemon Squeezy)를 거쳐 원래 결제하셨던 신용카드/결제 수단으로 영업일 기준 3~5일 이내에 원상 복구됩니다.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>1. Subscription Cancellation Policy</span>
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      • You can cancel your HanUp All-Pass monthly subscription at any time via your user dashboard or by emailing <strong>ot.helper7@gmail.com</strong>.<br />
                      • Upon cancellation, recurring billing will stop immediately. You will retain full access to all materials until the end of your current billing period.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>2. Digital Content & One-Time Course Passes</span>
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      • Due to the nature of digital goods, refunds cannot be granted once paid chapter contents have been accessed or AI grading credits have been consumed.<br />
                      • In the event of system outages or technical errors preventing normal usage, full refunds or course extension passes will be provided immediately.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-600" />
                      <span>3. How to Request a Refund (24h Response)</span>
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      • Official support email: <a href="mailto:ot.helper7@gmail.com" className="text-blue-600 font-bold underline">ot.helper7@gmail.com</a><br />
                      • Please include your <strong>Order ID</strong> or <strong>billing email address</strong>.<br />
                      • Requests are reviewed and processed within 24 business hours via Lemon Squeezy (Merchant of Record).
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TERMS OF SERVICE                                                   */}
          {/* ========================================================================= */}
          {legalModalTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {langMode === 'ko' ? '한업(HanUp) 서비스 이용약관' : 'HanUp Terms of Service'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  최종 개정일: 2026년 10월 16일 • 적용 대상: 한업 웹/모바일 플랫폼 전체
                </p>
              </div>

              <div className="space-y-3 pt-1 text-xs sm:text-sm text-slate-600">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">제1조 (목적)</h5>
                  <p>
                    {langMode === 'ko'
                      ? '본 약관은 한업(HanUp | 韩升, 이하 "플랫폼")이 제공하는 스마트 한국어 교재, TOPIK 시험 대비 인터랙티브 학습 시스템, AI 실시간 원고지 작문 첨삭, 소리튜터 발음 클리닉 등 제반 교육 서비스의 이용 조건 및 절차를 규정함을 목적으로 합니다.'
                      : 'These Terms of Service govern your access to and use of the HanUp platform, including smart digital textbooks, TOPIK prep modules, AI essay grading, and pronunciation clinics.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">제2조 (계정 및 1인 라이선스 원칙)</h5>
                  <p>
                    {langMode === 'ko'
                      ? '1. 회원은 구글 계정 또는 이메일 인증을 통해 본인 계정을 개설합니다.\n2. 구매하신 모든 유료 코스 및 구독 라이선스는 구매자 본인 1인에게 한정된 비독점적·양도불가 디지털 사용권입니다.\n3. 타인과의 계정 공유, 아이디 대여, 교재 본문 및 AI 첨삭 알고리즘의 무단 복제·크롤링·상업적 재배포는 엄격히 금지되며 위반 시 이용이 영구 정지될 수 있습니다.'
                      : '1. Users establish accounts via Google OAuth or verified email.\n2. All purchases grant a single-user, non-transferable personal learning license.\n3. Sharing accounts, distributing proprietary materials, or scraping AI content is strictly prohibited.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">제3조 (AI 교육 보조 도구 고지 및 면책)</h5>
                  <p>
                    {langMode === 'ko'
                      ? '플랫폼이 제공하는 AI 작문 첨삭(Gemini 기반) 및 발음 교정 피드백은 한국어 학습자의 실력 향상을 돕는 최첨단 교육 보조 도구입니다. 국립국제교육원이 주관하는 실제 공식 TOPIK 시험의 최종 점수나 특정 급수 취득을 법적으로 보증하는 것은 아닙니다.'
                      : 'AI-generated corrections and phonology feedback serve as supplemental educational aids and do not legally guarantee official TOPIK score results or certificates.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">제4조 (글로벌 결제 및 공인 판매 대행)</h5>
                  <p>
                    {langMode === 'ko'
                      ? '플랫폼의 모든 글로벌 결제, 부가가치세(VAT/Sales Tax) 정산, 카드 청구는 공인 판매 대행사(Merchant of Record)인 Lemon Squeezy를 통해 안전하게 진행되며, 영수증 및 카드 청구서에는 Lemon Squeezy 또는 HanUp으로 표기됩니다.'
                      : 'All global orders and tax compliance are securely managed by our online reseller & Merchant of Record, Lemon Squeezy, which also issues digital invoices.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PRIVACY POLICY                                                     */}
          {/* ========================================================================= */}
          {legalModalTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {langMode === 'ko' ? '한업(HanUp) 개인정보처리방침' : 'HanUp Privacy Policy'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  개인정보보호법 및 글로벌 데이터 표준(GDPR) 준수
                </p>
              </div>

              <div className="space-y-3 pt-1 text-xs sm:text-sm text-slate-600">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>1. 수집하는 개인정보 항목 및 수집 방법</span>
                  </h5>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>계정 식별 정보:</strong> 구글 프로필 이메일, 이름(닉네임), 프로필 사진 URL, 또는 이메일 가입 시 입력한 암호화된 계정 정보.</li>
                    <li><strong>학습 및 활동 데이터:</strong> 작문 제출 답안(초안 및 2차 수정본), AI 첨삭 결과 로그, 발음 채점 점수, 챕터 진도율, 모의고사 응시 결과.</li>
                    <li><strong>학술 연구용 배경 변인 (사전 동의자에 한함):</strong> 모국어(L1), 한국어 학습 기간, 학습 목적(유학/취업/생활). 본 데이터는 IRB 표준에 따라 식별자를 분리하여 엄격히 가명(암호화) 보관됩니다.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>2. 개인정보의 이용 목적 및 제3자 제공 금지 원칙</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed">
                    • 수집된 정보는 1:1 맞춤형 AI 한국어 교육 제공, 학습 취약점 리포트 발급, 고객 지원 응대 목적으로만 사용됩니다.<br />
                    • <strong>한업은 회원의 소중한 개인정보를 어떠한 경우에도 외부 마케팅 대행사나 제3자에게 판매하거나 무단 제공하지 않습니다.</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>3. 개인정보 보유 기간 및 파기 절차</span>
                  </h5>
                  <p className="text-slate-600 leading-relaxed">
                    회원 탈퇴 요청 시 수집된 개인 식별 정보는 지체 없이 영구 파기됩니다. 계정 삭제 또는 데이터 파기 요청은 공식 이메일(<strong>ot.helper7@gmail.com</strong>)로 신청하시면 즉시 처리해 드립니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CUSTOMER SUPPORT & CONTACT                                         */}
          {/* ========================================================================= */}
          {legalModalTab === 'support' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {langMode === 'ko' ? '공식 고객지원 센터 및 문의 안내' : 'Official Customer Support & Contact'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  수강생과 교육기관의 편리한 학습을 위해 전담 지원팀이 상시 운영됩니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-200 space-y-1.5 shadow-xs">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                    공식 고객지원 이메일 (Primary Support)
                  </span>
                  <a
                    href="mailto:ot.helper7@gmail.com"
                    className="text-base sm:text-lg font-black text-blue-900 hover:text-blue-700 underline underline-offset-4 block truncate"
                  >
                    ot.helper7@gmail.com
                  </a>
                  <p className="text-[11px] text-slate-600 font-medium">
                    ⚡ 평일 기준 24시간 이내 100% 회신 보장
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    운영 시간 (Business Hours)
                  </span>
                  <div className="text-sm sm:text-base font-bold text-slate-900">
                    월 ~ 금 09:00 - 18:00 (한국시간 KST)
                  </div>
                  <p className="text-[11px] text-slate-500">
                    주말 및 공휴일 접수 건은 익영업일 오전 우선 처리
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                  📌 무엇이든 편하게 문의해 주세요
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-slate-800 block mb-0.5">💳 결제 및 환불 문의</strong>
                    영수증 재발급, 환불 신청, 구독 해지, 쿠폰 적용
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-slate-800 block mb-0.5">🛠️ 학습 기능 & 기술 오류</strong>
                    AI 첨삭 이상, 뷰어 음원 재생 오류, 원고지 OCR 판독
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-slate-800 block mb-0.5">🏫 B2B 기관 분양 및 단체 도입</strong>
                    어학원/대학 기관 화이트라벨링, 강사용 대량 라이선스
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-slate-800 block mb-0.5">🔒 계정 & 개인정보 관리</strong>
                    구글/이메일 계정 연동, 데이터 삭제 요청, 오류 제보
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <span>공식 배포 웹사이트: <strong>https://hanup-platform.vercel.app</strong></span>
                <span className="text-[11px] text-slate-500">Seoul, Republic of Korea</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            © 2026 HanUp (한업 | 韩升). All rights reserved. • Lemon Squeezy Merchant of Record
          </span>
          <button
            onClick={closeLegalModal}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            {langMode === 'ko' ? '확인 및 닫기' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LegalPolicyModal;

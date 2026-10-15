'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Gift,
  Tag,
  Check,
  Globe,
  Mic,
  Award,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';

export function PaywallModal() {
  const {
    isPaywallModalOpen,
    closePaywallModal,
    unlockProPass,
    currentUser,
    appliedCoupon,
    couponDiscountPercent,
    applyCoupon,
    removeCoupon,
    hasSoriTutorSub,
    verifySoriTutorSubscription,
  } = useHanUp();

  const [paymentMethodTab, setPaymentMethodTab] = useState<'lemon' | 'smartstore' | 'wechat'>('lemon');
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'pro_monthly' | 'pass_60d' | 'super_pass'>('super_pass');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [orderInput, setOrderInput] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [soriVerifiedSuccess, setSoriVerifiedSuccess] = useState(false);

  if (!isPaywallModalOpen) return null;

  // Plans Base Prices
  const plans = [
    {
      id: 'single',
      title: '단품 교재 구매',
      badge: '원하는 강좌만',
      baseUsd: 19.0,
      baseKrw: 25900,
      baseCny: 138,
      sub: 'TOPIK 도전편 or 생활한국어 택1 영구 소장',
      desc: '해당 교재 무제한 AI 첨삭 + 소리튜터 발음 클리닉 무제한',
    },
    {
      id: 'pro_monthly',
      title: '한업 Pro 월구독',
      badge: '월간 구독',
      baseUsd: 14.9,
      baseKrw: 19900,
      baseCny: 108,
      sub: '월 자동 결제 (언제든 해지 가능)',
      desc: '전 교재 AI 첨삭 무제한 + 120제 클리닉 전체 해금',
    },
    {
      id: 'pass_60d',
      title: 'TOPIK 60일 합격 패스',
      badge: '수험생 1위',
      baseUsd: 24.9,
      baseKrw: 33900,
      baseCny: 178,
      sub: '60일 집중 대비 일시납',
      desc: '준비·도전·완성편 + 53번 만능 공식집 전체 개방',
    },
    {
      id: 'super_pass',
      title: '한업 × 소리튜터 슈퍼패스',
      badge: '👑 올인원 추천',
      baseUsd: 19.9,
      baseKrw: 26900,
      baseCny: 142,
      sub: '한업 Pro + 소리튜터 Pro 결합',
      desc: '쓰기 첨삭 무제한 + 1:1 회화 발음 무제한 + 토큰팩 30% 할인 바우처',
    },
  ];

  const currentPlanObj = plans.find((p) => p.id === selectedPlan) || plans[3];
  const discountMultiplier = couponDiscountPercent > 0 ? (100 - couponDiscountPercent) / 100 : 1;
  const finalUsd = (currentPlanObj.baseUsd * discountMultiplier).toFixed(2);
  const finalKrw = Math.round(currentPlanObj.baseKrw * discountMultiplier).toLocaleString();
  const finalCny = Math.round(currentPlanObj.baseCny * discountMultiplier);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    if (res.valid) {
      setCouponMessage({ text: res.message });
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  const handleVerify = () => {
    setIsVerifyingPayment(true);
    setTimeout(() => {
      setIsVerifyingPayment(false);
      setVerifySuccess(true);
      setTimeout(() => {
        unlockProPass();
        setVerifySuccess(false);
        setOrderInput('');
      }, 900);
    }, 700);
  };

  const handleVerifySoriTutor = () => {
    verifySoriTutorSubscription();
    setSoriVerifiedSuccess(true);
    setTimeout(() => setSoriVerifiedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 print:hidden overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden space-y-5 my-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closePaywallModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all z-10"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-500/20 to-blue-500/20 text-blue-900 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Lemon Squeezy Global Checkout & HanUp Cross-Pass</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            한업(HanUp) 정식 플랜 & 글로벌 결제
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            무제한 AI 쓰기 정밀 첨삭, 손글씨 OCR 스캔, 그리고 소리튜터(Sori Tutor) 1:1 발음 교정까지 완벽히 해금하세요.
          </p>
        </div>

        {/* Cross-Benefit Sori Tutor Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-indigo-950 flex items-center gap-1.5">
                <span>소리튜터(Sori Tutor) 구독자이신가요?</span>
                {hasSoriTutorSub && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                    인증됨
                  </span>
                )}
              </span>
              <p className="text-[11px] text-indigo-700">
                소리튜터 유료 구독자($9.9/월)는 한업 준비편·첫걸음편 무료 개방 및 전 교재 20% 자동 감면됩니다.
              </p>
            </div>
          </div>
          {!hasSoriTutorSub ? (
            <button
              onClick={handleVerifySoriTutor}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-xl shrink-0 transition-colors shadow-xs"
            >
              소리튜터 구독 원클릭 인증
            </button>
          ) : (
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 크로스 혜택 적용 중
            </span>
          )}
        </div>

        {soriVerifiedSuccess && (
          <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center animate-fade-in">
            🎉 소리튜터 구독 인증 완료! 한업 준비편·첫걸음편 무료 열람 및 20% 크로스 할인이 연동되었습니다.
          </div>
        )}

        {/* 4 Plans Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {plans.map((p) => {
            const isSelected = selectedPlan === p.id;
            const pDiscountedUsd = (p.baseUsd * discountMultiplier).toFixed(2);
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id as typeof selectedPlan)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                      {p.badge}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">{p.sub}</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mt-1.5">{p.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.desc}</p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-black text-blue-700">${pDiscountedUsd}</span>
                    {couponDiscountPercent > 0 && (
                      <span className="text-[10px] text-slate-400 line-through ml-1.5">
                        ${p.baseUsd}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    ₩{Math.round(p.baseKrw * discountMultiplier).toLocaleString()} / ¥{Math.round(p.baseCny * discountMultiplier)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupon Code Input & Application */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>할인 쿠폰 / 프로모션 코드 (WTP 설문 완료 시 20% 쿠폰: HANUP20WTP)</span>
            </span>
            {appliedCoupon && (
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                {couponDiscountPercent}% 할인 적용 중
              </span>
            )}
          </div>

          <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="예: HANUP20WTP"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              적용
            </button>
            {appliedCoupon && (
              <button
                type="button"
                onClick={removeCoupon}
                className="px-2 py-1.5 text-slate-400 hover:text-rose-600 text-xs font-bold"
              >
                해제
              </button>
            )}
          </form>

          {couponMessage && (
            <p
              className={`text-[11px] font-semibold ${
                couponMessage.isError ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {couponMessage.text}
            </p>
          )}
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setPaymentMethodTab('lemon')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                paymentMethodTab === 'lemon'
                  ? 'bg-white text-blue-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🍋 Lemon Squeezy</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethodTab('smartstore')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                paymentMethodTab === 'smartstore'
                  ? 'bg-white text-emerald-800 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇰🇷 네이버 스마트스토어</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethodTab('wechat')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                paymentMethodTab === 'wechat'
                  ? 'bg-white text-green-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇨🇳 微信 / 支付宝</span>
            </button>
          </div>

          {/* TAB 1: Lemon Squeezy Global Checkout */}
          {paymentMethodTab === 'lemon' && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Lemon Squeezy Global Checkout ({selectedPlan})
                </span>
                <span className="text-[10px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                  Visa · Mastercard · Apple Pay · PayPal
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                해외 결제(USD) 및 글로벌 구독 결제를 안전하게 처리합니다. 결제 완료 시 <strong>한업 라이선스 키</strong>가 이메일로 전송되며 즉시 권한이 승급됩니다.
              </p>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-blue-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">최종 결제 금액</span>
                  <span className="text-lg font-black text-blue-700">${finalUsd} USD</span>
                </div>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerifyingPayment}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isVerifyingPayment ? 'Lemon Squeezy 결제창 로딩...' : `Lemon Squeezy $${finalUsd} 결제`}</span>
                </button>
              </div>

              {/* Cross-Benefit Bonus Notice */}
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  결제 완료 즉시 <strong>소리튜터 1:1 회화 토큰팩 30% 할인 바우처(SORI30OFF)</strong>가 자동 지급됩니다!
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Naver SmartStore */}
          {paymentMethodTab === 'smartstore' && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  네이버 스마트스토어 (₩{finalKrw})
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  신용카드 · 네이버페이
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                안전한 에스크로 결제 후 <strong>주문번호(16자리)</strong>나 <strong>결제 이메일</strong>을 입력하시면 즉시 승급됩니다.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="스마트스토어 주문번호 (예: 20261014-0019284)"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleVerify}
                  disabled={isVerifyingPayment}
                  className="px-4 py-2 whitespace-nowrap rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all"
                >
                  {isVerifyingPayment ? '승인 확인 중...' : '확인 및 승급'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: WeChat Pay */}
          {paymentMethodTab === 'wechat' && (
            <div className="p-4 rounded-2xl bg-green-50/70 border border-green-200 text-xs text-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-green-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  微信收款码 / 支付宝 (¥{finalCny})
                </span>
                <span className="text-[10px] font-bold text-green-800 bg-white px-2 py-0.5 rounded border border-green-200">
                  即时到账
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                송금 메모에 회원 이메일(<strong>{currentUser.email}</strong>)을 기재한 뒤, 아래에 <strong>위챗 닉네임</strong>을 입력해 주세요.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="위챗 닉네임 또는 단호 (微信昵称/单号)"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleVerify}
                  disabled={isVerifyingPayment}
                  className="px-4 py-2 whitespace-nowrap rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs shadow-sm transition-all"
                >
                  {isVerifyingPayment ? '확인 중...' : '위챗 송금 확인'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Verification Success Feedback */}
        {verifySuccess && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>결제 인증이 완료되었습니다! 한업 프로 패스 및 무제한 클리닉이 활성화됩니다.</span>
          </div>
        )}

        {/* Demo Fast Bypass */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>베타 테스터 / 시연 원클릭 해금:</span>
          <button
            onClick={() => {
              unlockProPass();
            }}
            className="text-blue-600 hover:text-blue-800 font-bold underline underline-offset-2"
          >
            [Pro 패스 즉시 활성화하기]
          </button>
        </div>
      </div>
    </div>
  );
}

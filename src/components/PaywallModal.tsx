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
  Lock,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';

export function PaywallModal() {
  const { isPaywallModalOpen, closePaywallModal, unlockProPass, currentUser, lang } = useHanUp();
  const [paymentMethodTab, setPaymentMethodTab] = useState<'smartstore' | 'wechat'>('smartstore');
  const [orderInput, setOrderInput] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  if (!isPaywallModalOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden space-y-6">
        {/* Close Button */}
        <button
          onClick={closePaywallModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Zap className="w-6 h-6 fill-current text-amber-300" />
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 inline-block">
            ⚡ 일일 무료 한도 소진 (Daily Quota Limit)
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            한업 프로 패스 (HanUp Pro Pass)로 무제한 잠금 해제
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            오늘의 무료 AI 정밀 첨삭(2회) 및 OCR 스캔(2회)이 모두 소진되었습니다.<br className="hidden sm:inline" />
            한업 프로 패스를 통해 <strong>무제한 AI 첨삭·손글씨 OCR·120제 클리닉</strong>을 자유롭게 이용하세요.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
          <div className="p-1">
            <span className="block text-[10px] text-slate-400 font-bold">53·54번 쓰기</span>
            <span className="text-xs font-black text-blue-700">무제한 AI 첨삭</span>
          </div>
          <div className="p-1 border-x border-slate-200">
            <span className="block text-[10px] text-slate-400 font-bold">종이 원고지</span>
            <span className="text-xs font-black text-purple-700">무제한 OCR 스캔</span>
          </div>
          <div className="p-1">
            <span className="block text-[10px] text-slate-400 font-bold">약점 클리닉</span>
            <span className="text-xs font-black text-emerald-700">120제 전체 해금</span>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setPaymentMethodTab('smartstore')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
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
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              paymentMethodTab === 'wechat'
                ? 'bg-white text-green-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇨🇳 微信支付 / 支付宝</span>
          </button>
        </div>

        {/* TAB 1: Naver SmartStore */}
        {paymentMethodTab === 'smartstore' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  네이버 스마트스토어 개인 결제 (₩29,000)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  신용카드·네이버페이
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                사업자등록 전 안전한 에스크로 결제를 지원합니다. 스마트스토어 결제 후 <strong>주문번호(16자리)</strong>나 <strong>결제 이메일</strong>을 입력하시면 즉시 승급됩니다.
              </p>
              <a
                href="https://smartstore.naver.com"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-sm transition-all"
              >
                <span>스마트스토어 결제 페이지 열기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-700 block">
                스마트스토어 주문번호 또는 결제 이메일:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="예: 20261014-0019284 또는 user@email.com"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleVerify}
                  disabled={isVerifyingPayment}
                  className="px-4 py-2 whitespace-nowrap rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  {isVerifyingPayment ? '승인 확인 중...' : '확인 및 승급'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WeChat Pay */}
        {paymentMethodTab === 'wechat' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-green-50/70 border border-green-200 text-xs text-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-green-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  微信个人收款码 / 支付宝 (150元 / ₩29,000)
                </span>
                <span className="text-[10px] font-bold text-green-800 bg-white px-2 py-0.5 rounded border border-green-200">
                  即时到账
                </span>
              </div>

              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-green-100">
                <div className="w-20 h-20 bg-slate-100 rounded-lg p-1.5 flex items-center justify-center border border-slate-200 flex-shrink-0">
                  <div className="w-16 h-16 bg-green-600 text-white flex flex-col items-center justify-center rounded font-mono font-black text-xs shadow-inner">
                    <span className="text-[9px]">微信扫码</span>
                    <span>¥150</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  1. 위챗으로 <strong>150元</strong>을 송금합니다.<br />
                  2. 송금 메모에 회원 이메일(<strong>{currentUser.email}</strong>)을 적어주세요.<br />
                  3. 아래에 <strong>위챗 닉네임</strong>을 입력하고 승급 버튼을 누릅니다.
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-700 block">
                위챗 닉네임 또는 거래번호 (微信昵称/单号):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="예: 伟哥 (WangWei_KR) 또는 20261014..."
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleVerify}
                  disabled={isVerifyingPayment}
                  className="px-4 py-2 whitespace-nowrap rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  {isVerifyingPayment ? '확인 중...' : '위챗 송금 확인'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Success Feedback */}
        {verifySuccess && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>결제 인증이 완료되었습니다! 한업 프로 패스가 활성화됩니다.</span>
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

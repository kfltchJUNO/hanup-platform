'use client';

import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Award,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/firebase';
import { HanUpLogo } from './HanUpLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginAsCustomUser, switchRole } = useHanUp();

  const [activeTab, setActiveTab] = useState<'google' | 'login' | 'signup'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [targetLevel, setTargetLevel] = useState<number>(5);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  // 1. Google 1-Click Login
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const result = await signInWithGoogle();
    setIsLoading(false);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.user) {
      setSuccessNotice(`환영합니다, ${result.user.displayName || result.user.email}님!`);
      setTimeout(() => {
        handleClose();
      }, 800);
    }
  };

  // 2. Email Login
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const result = await signInWithEmail(email, password);
    setIsLoading(false);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.user) {
      setSuccessNotice(`로그인 성공! ${result.user.displayName || result.user.email}님 환영합니다.`);
      setTimeout(() => {
        handleClose();
      }, 800);
    }
  };

  // 3. Email Registration (Sign Up)
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !displayName.trim()) {
      setErrorMessage('이름, 이메일, 비밀번호(6자 이상)를 모두 입력해 주세요.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const result = await signUpWithEmail(email, password, displayName);
    setIsLoading(false);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.user) {
      setSuccessNotice(`회원가입이 완료되었습니다! ${displayName}님 환영합니다.`);
      loginAsCustomUser({ email: email.trim(), name: displayName.trim(), targetLevel });
      setTimeout(() => {
        handleClose();
      }, 800);
    }
  };

  // 4. Fallback: Quick Local Session Login (useful if Firebase auth console settings are pending)
  const handleLocalBypassLogin = () => {
    const fallbackEmail = email.trim() || 'test.student@hanup.edu';
    const fallbackName = displayName.trim() || fallbackEmail.split('@')[0];
    loginAsCustomUser({
      email: fallbackEmail,
      name: fallbackName,
      targetLevel,
    });
  };

  // 5. Preset Test Accounts
  const handlePresetLogin = (preset: {
    email: string;
    name: string;
    role: 'student' | 'instructor' | 'org_admin' | 'super_admin';
    targetLevel?: number;
  }) => {
    switchRole(preset.role);
    loginAsCustomUser({
      email: preset.email,
      name: preset.name,
      targetLevel: preset.targetLevel || 5,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 relative animate-in zoom-in-95 duration-200">
        {/* Top Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-red-600" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <HanUpLogo size="sm" showText={false} />
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>한업 (HanUp) 계정 인증</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Firebase
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                AI 1:1 맞춤 한국어 교육 플랫폼
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="px-5 sm:px-6 pt-3 flex items-center gap-1.5 border-b border-slate-100">
          <button
            onClick={() => {
              setActiveTab('google');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'google'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google 로그인</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>이메일 로그인</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>회원가입</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Success Notice */}
          {successNotice && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
              <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
                <span className="text-[11px] text-amber-700">
                  입력하신 이메일로 로컬 테스트하시겠습니까?
                </span>
                <button
                  type="button"
                  onClick={handleLocalBypassLogin}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors"
                >
                  로컬 테스트 즉시 진입
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: Google Sign In */}
          {activeTab === 'google' && (
            <div className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  구글 계정으로 1초 만에 시작하세요
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  별도의 회원가입 없이 구글 계정으로 간편하게 로그인하여 맞춤형 한국어 과외를 이용하실 수 있습니다.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-blue-400 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isLoading ? '구글 인증 처리 중...' : 'Google 계정으로 계속하기'}</span>
              </button>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Firebase 연동 보안 인증</span>
                </div>
                <p>
                  Firebase 프로젝트(<strong className="text-slate-700">wooriban1</strong>)를 통해 안전하게 인증되며, 로그인 즉시 상단과 대시보드에 구글 프로필이 연동됩니다.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Email Login */}
          {activeTab === 'login' && (
            <form onSubmit={handleEmailSignIn} className="space-y-3.5 py-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  이메일 아이디
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="예: student@hanup.edu"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? '인증 확인 중...' : '이메일로 로그인'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: Sign Up */}
          {activeTab === 'signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-3 py-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  학습자 이름 / 닉네임
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="예: 김한별 / Alex / 王伟"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  이메일 아이디
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="예: student@example.com"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  비밀번호 (6자 이상)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6자 이상 비밀번호"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  목표 TOPIK 급수
                </label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                >
                  <option value={1}>TOPIK 1급 (초급 기초)</option>
                  <option value={2}>TOPIK 2급 (초급 완성)</option>
                  <option value={3}>TOPIK 3급 (중급 진입)</option>
                  <option value={4}>TOPIK 4급 (학부 입학 기준)</option>
                  <option value={5}>TOPIK 5급 (대학원/취업 추천)</option>
                  <option value={6}>TOPIK 6급 (최고급 마스터)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
              >
                <span>{isLoading ? '가입 등록 중...' : '새 계정으로 시작하기'}</span>
                <Sparkles className="w-4 h-4 text-emerald-100" />
              </button>
            </form>
          )}

          {/* Preset Test Accounts Section (Direct 1-Click Role Testing) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
              <span>🧪 빠른 테스트 계정 체험 (1클릭)</span>
              <span className="text-[10px] text-slate-400 font-normal">비밀번호 불필요</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handlePresetLogin({
                    email: 'student.kim@hanup.edu',
                    name: '김한별 (학생)',
                    role: 'student',
                    targetLevel: 5,
                  })
                }
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-colors group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-blue-700 truncate">
                  👤 Lv.1 학생
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  김한별
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePresetLogin({
                    email: 'teacher.park@hanup.edu',
                    name: '박지민 (교사)',
                    role: 'instructor',
                  })
                }
                className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-colors group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700 truncate">
                  👩‍🏫 Lv.2 교사
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  박지민
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePresetLogin({
                    email: 'admin@global-korean.org',
                    name: '최민우 (기관/원장)',
                    role: 'org_admin',
                  })
                }
                className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-left transition-colors group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-purple-700 truncate">
                  🏢 Lv.3 기관
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  글로벌어학원
                </div>
              </button>
            </div>

            <div className="mt-2.5 p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-[10px] text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                <strong>Lv.4 본사 마스터:</strong> 공식 관리자 계정(<strong>ot.helper7@gmail.com</strong>)으로 로그인 시 모든 권한이 자동 부여됩니다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

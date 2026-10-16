'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  School,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Award,
  Globe,
  BookOpen,
  ShieldCheck,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useHanUp } from '../../context/HanUpContext';
import { signInWithGoogle, signUpWithEmail } from '../../lib/firebase';
import { HanUpLogo } from '../../components/HanUpLogo';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';

function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginAsCustomUser, switchRole, setLang } = useHanUp();

  // URL Parameters pre-filled by Teacher / Institution
  const paramName = searchParams.get('name') || '';
  const paramEmail = searchParams.get('email') || '';
  const paramClassId = searchParams.get('class') || searchParams.get('classId') || 'cls_topik_01';
  const paramClassName = searchParams.get('className') || 'TOPIK 중급 실전 완성반';
  const paramTeacher = searchParams.get('teacher') || '박지민 선생님';
  const paramOrg = searchParams.get('org') || '서울글로벌어학원';
  const paramLevel = Number(searchParams.get('level')) || 4;
  const paramL1 = searchParams.get('l1') || 'zh-CN';

  // Form States
  const [studentName, setStudentName] = useState(paramName);
  const [studentEmail, setStudentEmail] = useState(paramEmail);
  const [password, setPassword] = useState('');
  const [targetLevel, setTargetLevel] = useState<number>(paramLevel);
  const [selectedL1, setSelectedL1] = useState(paramL1);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync state if query params change
  useEffect(() => {
    if (paramName) setStudentName(paramName);
    if (paramEmail) setStudentEmail(paramEmail);
    if (paramLevel) setTargetLevel(paramLevel);
    if (paramL1) setSelectedL1(paramL1);
  }, [paramName, paramEmail, paramLevel, paramL1]);

  const l1LanguageLabels: Record<string, { label: string; flag: string }> = {
    'zh-CN': { label: '중국어 (简体中文)', flag: '🇨🇳' },
    'en': { label: '영어 (English)', flag: '🇺🇸' },
    'ja': { label: '일본어 (日本語)', flag: '🇯🇵' },
    'vi': { label: '베트남어 (Tiếng Việt)', flag: '🇻🇳' },
    'my': { label: '미얀마어 (မြန်မာဘာသာ)', flag: '🇲🇲' },
  };

  const currentL1Info = l1LanguageLabels[selectedL1] || l1LanguageLabels['zh-CN'];

  const finalizeStudentOnboarding = (emailVal: string, nameVal: string) => {
    switchRole('student');
    // Set UI language to match student L1 if supported
    if (selectedL1 === 'zh-CN') setLang('zh');
    else if (selectedL1 === 'ja') setLang('ja');
    else if (selectedL1 === 'vi') setLang('vi');
    else if (selectedL1 === 'my') setLang('my');
    else if (selectedL1 === 'en') setLang('en');

    loginAsCustomUser({
      email: emailVal,
      name: nameVal,
      targetLevel,
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  // 1. Google 1-Click Join (Best Experience!)
  const handleGoogleJoin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const result = await signInWithGoogle();
    setIsLoading(false);

    if (result.error) {
      // If popup fails or domain not authorized, fallback to instant bypass
      setErrorMsg(result.error);
    } else if (result.user) {
      const finalName = studentName.trim() || result.user.displayName || '한업 수강생';
      const finalEmail = result.user.email || studentEmail || 'student@hanup.edu';
      finalizeStudentOnboarding(finalEmail, finalName);
    }
  };

  // 2. Email & Password Join
  const handleEmailJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) {
      setErrorMsg('이메일 주소를 입력해 주세요.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    const finalName = studentName.trim() || studentEmail.split('@')[0];
    const result = await signUpWithEmail(studentEmail, password, finalName);
    setIsLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      finalizeStudentOnboarding(studentEmail.trim(), finalName);
    }
  };

  // 3. Instant Trial Join (No Password Required)
  const handleInstantJoin = () => {
    const fallbackEmail = studentEmail.trim() || `student_${Date.now().toString().slice(-4)}@hanup.edu`;
    const fallbackName = studentName.trim() || '신규 수강생';
    finalizeStudentOnboarding(fallbackEmail, fallbackName);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Gold-to-Ruby Brand Ribbon */}
        <div className="h-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-red-600" />

        {/* Card Header & Teacher Invitation Greeting */}
        <div className="p-6 sm:p-7 pb-4 text-center border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
          <div className="flex justify-center mb-3">
            <HanUpLogo size="md" showText={false} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold border border-blue-200 shadow-xs mb-2">
            <School className="w-3.5 h-3.5 text-blue-600" />
            <span>{paramOrg} • {paramTeacher}</span>
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            수업 초대장이 도착했습니다! 🎓
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            선생님이 미리 설정해 둔 맞춤 학습 정보로 3초 만에 시작하세요
          </p>

          {/* Pre-configured Class Invitation Box */}
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200/80 text-left space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-700">배정 클래스</span>
              <span className="text-xs font-black text-indigo-900">{paramClassName}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-blue-200/50 text-[11px]">
              <span className="text-slate-500">목표 급수</span>
              <span className="font-extrabold text-amber-600">TOPIK {targetLevel}급</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">모국어 해설</span>
              <span className="font-semibold text-slate-700">
                {currentL1Info.flag} {currentL1Info.label}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body: Quick Onboarding Actions */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-black">수업 등록이 완료되었습니다!</p>
                <p className="text-[11px] text-emerald-700 font-normal">
                  선생님의 반과 연결된 나의 학습 대시보드로 이동합니다...
                </p>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <p className="leading-relaxed">{errorMsg}</p>
              <button
                type="button"
                onClick={handleInstantJoin}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                비밀번호 없이 즉시 수업 입장하기
              </button>
            </div>
          )}

          {!isSuccess && (
            <>
              {/* PRIMARY OPTION: Google 1-Click Auto Join */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleJoin}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-blue-500 font-black text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
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
                  <span>Google 계정으로 3초 만에 시작</span>
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  ⚡ 클릭 한 번으로 선생님이 지정한 반과 연동됩니다
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase">
                  또는 이메일로 가입
                </span>
              </div>

              {/* SECONDARY OPTION: Email & Password */}
              <form onSubmit={handleEmailJoin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    학생 이름
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="이름 입력"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    이메일 주소
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                      placeholder="비밀번호 6자 이상"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>이메일로 가입 완료</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* TERTIARY OPTION: Quick Bypass (No Password) */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleInstantJoin}
                  className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4 font-medium transition-colors"
                >
                  비밀번호 설정 없이 바로 둘러보기 (게스트 체험) →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>한업(HanUp) 스마트 에드테크</span>
          <span>© 2026 HanUp. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">초대 정보 로딩 중...</div>}>
      <JoinContent />
    </Suspense>
  );
}

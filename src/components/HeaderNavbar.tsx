'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  FileText,
  Users,
  Building2,
  Database,
  Languages,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Stethoscope,
  Globe,
  LayoutGrid,
  ExternalLink,
  Mic,
  School,
  Menu,
  X,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useHanUp, isMasterEmail } from '../context/HanUpContext';
import { UserRole, ROLE_DEFINITIONS } from '../types/hanup';
import { SUPPORTED_LANGUAGES, SupportedLanguage, UI_TRANSLATIONS } from '../lib/i18n';
import { APP_CONFIG } from '../lib/config';
import { HanUpLogo } from './HanUpLogo';

export const HeaderNavbar: React.FC = () => {
  const pathname = usePathname();
  const {
    currentRole,
    currentUser,
    switchRole,
    currentOrg,
    lang,
    setLang,
    openBackgroundModal,
    openSurveyModal,
    openAuthModal,
    isLoggedIn,
    handleLogout,
  } = useHanUp();
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Navigation Links filtered by Role with i18n support
  const getNavLinks = () => {
    const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.ko;
    switch (currentRole) {
      case 'student':
        return [
          { href: '/dashboard', label: t.dashboard, icon: GraduationCap },
          { href: '/clinic', label: t.clinic, icon: Stethoscope },
          { href: '/study/hanup_topik_prep/ch_prep_01', label: t.studyViewer, icon: BookOpen },
        ];
      case 'instructor':
        return [
          { href: '/teacher/grading', label: t.teacherGrading, icon: CheckCircle2 },
          { href: '/teacher/classes', label: t.teacherClasses, icon: Users },
          { href: '/dashboard', label: t.studentView, icon: GraduationCap },
        ];
      case 'org_admin':
        return [
          { href: '/admin/orgs', label: t.partnerAdmin, icon: Building2 },
          { href: '/teacher/classes', label: t.teacherClasses, icon: Users },
          { href: '/teacher/grading', label: t.teacherGrading, icon: CheckCircle2 },
        ];
      case 'super_admin':
        return [
          { href: '/admin/studio', label: t.studio, icon: Layers },
          { href: '/admin/research', label: t.research, icon: Database },
          { href: '/admin/orgs', label: t.partnerAdmin, icon: Building2 },
          { href: '/teacher/grading', label: t.teacherGrading, icon: CheckCircle2 },
          { href: '/dashboard', label: t.studentView, icon: GraduationCap },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* 1. Top RBAC Switcher Banner (Multi-tenancy & Testing Hub) - Shown on /demo or for Master Admin */}
      <div className="bg-slate-900 text-slate-200 px-3 sm:px-4 py-1.5 text-xs flex items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {pathname.startsWith('/demo') || isMasterEmail(currentUser.email) ? (
            <>
              <span className="flex items-center gap-1 font-semibold text-blue-400 shrink-0 text-[11px] sm:text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">[RBAC 모드]:</span>
              </span>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-800 border border-slate-700 shrink-0">
                {((isMasterEmail(currentUser.email)
                  ? ['student', 'instructor', 'org_admin', 'super_admin']
                  : ['student', 'instructor', 'org_admin']) as UserRole[]).map((r) => {
                  const isActive = currentRole === r;
                  const shortLabels: Record<UserRole, string> = {
                    student: '학생',
                    instructor: '교사',
                    org_admin: '기관',
                    super_admin: '본사',
                  };
                  return (
                    <button
                      key={r}
                      onClick={() => switchRole(r)}
                      className={`px-2 sm:px-2.5 py-0.5 rounded text-[11px] sm:text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                      title={ROLE_DEFINITIONS[r].labelKo}
                    >
                      <span className="sm:hidden">{shortLabels[r]}</span>
                      <span className="hidden sm:inline">{ROLE_DEFINITIONS[r].labelKo}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <Link
              href="/demo"
              className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-indigo-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>교육기관·강사용 B2B 통합 솔루션 시연 둘러보기 →</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Multi-tenant Org Badge (Hidden on small phones to save space) */}
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            <Building2 className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-[11px] text-slate-400">orgId:</span>
            <span className="text-white font-medium">{currentOrg.orgName}</span>
          </span>

          {/* Multilingual 6-Language Selector (KO, EN, JA, ZH, VI, MY) */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-[11px] sm:text-xs font-medium shadow-xs"
              title="언어 선택 / Select Language / 言語選択 / 语言选择 / Chọn ngôn ngữ / ဘာသာစကားရွေးပါ"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{SUPPORTED_LANGUAGES[lang].flag}</span>
              <span className="font-bold hidden xs:inline">{SUPPORTED_LANGUAGES[lang].code.toUpperCase()}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  모국어 및 UI 언어 선택 (L1)
                </div>
                {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((lKey) => {
                  const meta = SUPPORTED_LANGUAGES[lKey];
                  const isSelected = lang === lKey;
                  return (
                    <button
                      key={lKey}
                      onClick={() => {
                        setLang(lKey);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{meta.flag}</span>
                        <span>{meta.nativeLabel}</span>
                      </div>
                      <span className="text-[10px] opacity-75 font-mono">[{meta.code.toUpperCase()}]</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/" className="flex items-center">
            <HanUpLogo size="md" showText={true} />
          </Link>

          {/* Dynamic Navigation Links (Tablet & Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Quick Actions, Profile & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Student Target Badge (Hidden on mobile) */}
          {currentRole === 'student' && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-medium">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>목표: TOPIK {currentUser.targetTopikLevel}급</span>
              <span className="text-amber-500 font-bold">D-28</span>
            </div>
          )}

          {/* Quick Triggers for Background Intake & WTP Survey (Desktop - Student Only) */}
          {currentRole === 'student' && (
            <>
              <button
                onClick={openBackgroundModal}
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                title="학술 연구용 7대 배경변인 등록/확인"
              >
                <span>📋 연구 배경변인</span>
              </button>

              <button
                onClick={openSurveyModal}
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-colors"
                title="AI 요구분석 설문 & 20% 할인쿠폰 받기"
              >
                <span>🎁 WTP 설문</span>
              </button>
            </>
          )}

          {/* 3-App Suite 9-Dots Launcher (Google/Microsoft Style) */}
          <div className="relative">
            <button
              onClick={() => setIsAppLauncherOpen(!isAppLauncherOpen)}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                isAppLauncherOpen
                  ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="HanUp Suite 9-Dots 앱 런처 (한업 · 소리튜터 · 우리반)"
              aria-label="HanUp Suite Apps"
            >
              <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {isAppLauncherOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                      H
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">HanUp Suite Apps</h4>
                      <p className="text-[10px] text-slate-500">독립 실행형 3대 교육 에코시스템</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Suite v2.5
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* App 1: HanUp */}
                  <Link
                    href="/dashboard"
                    onClick={() => setIsAppLauncherOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                          한업 (HanUp | 韩升)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold">
                          현재 앱
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        스마트 한국어 교재·TOPIK 53·54 AI 실시간 첨삭 허브
                      </p>
                    </div>
                  </Link>

                  {/* App 2: Sori Tutor */}
                  <a
                    href={APP_CONFIG.soriTutorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsAppLauncherOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                          소리튜터 (Sori Tutor)
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        한국어 AI 발음·회화·음운(종성/연음) 실시간 클리닉
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-emerald-700 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="truncate">{APP_CONFIG.soriTutorUrl}</span>
                      </div>
                    </div>
                  </a>

                  {/* App 3: Wooriban */}
                  <a
                    href={APP_CONFIG.wooribanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsAppLauncherOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <School className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                          우리반 (Wooriban | 我们班)
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        학급 LMS & 작문 행동 로그(작성시간·복사시도) 통합 관리
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-purple-700 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="truncate">{APP_CONFIG.wooribanUrl}</span>
                      </div>
                    </div>
                  </a>

                  {/* B2B Solution Demo Link */}
                  <Link
                    href="/demo"
                    onClick={() => setIsAppLauncherOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                          B2B 기관·강사 솔루션 시연
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        4단계 RBAC 권한 전환 & Human-in-the-Loop 검수 큐 체험
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 leading-snug px-1">
                  💡 3대 앱은 100% 독립 실행(Standalone)되며, 학습자 계정 및 연구 코퍼스는 느슨한 결합(Loosely Coupled)으로 자동 연동됩니다.
                </div>
              </div>
            )}
          </div>

          {/* User Auth & Profile Card */}
          <div className="relative pl-2 border-l border-slate-200">
            {isLoggedIn ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                title="계정 정보 및 로그아웃"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-blue-400 object-cover shadow-xs"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-blue-400 shadow-xs">
                    {currentUser.name.slice(0, 1)}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold">
                      로그인됨
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {currentUser.email}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                title="Google 또는 이메일 로그인"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>로그인 / 계정</span>
              </button>
            )}

            {/* Dropdown Menu when Logged In */}
            {isLoggedIn && isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="pb-2.5 mb-2.5 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {currentUser.email}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      {ROLE_DEFINITIONS[currentRole].labelKo}
                    </span>
                    {currentRole === 'student' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                        목표 {currentUser.targetTopikLevel}급
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openAuthModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between"
                  >
                    <span>계정 전환 / 다른 이메일 로그인</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await handleLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-between"
                  >
                    <span>로그아웃</span>
                    <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            aria-label="Toggle Mobile Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Drawer Menu (Visible when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          {/* User Status Bar in Mobile Menu */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full border border-blue-400 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-blue-400">
                    {currentUser.name.slice(0, 1)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    {isLoggedIn && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold">
                        로그인됨
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-medium truncate max-w-[160px]">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {currentOrg.orgName}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <span>{ROLE_DEFINITIONS[currentRole].labelKo}</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-600 font-bold">목표 {currentUser.targetTopikLevel}급</span>
              </div>

              {isLoggedIn ? (
                <button
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await handleLogout();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors"
                >
                  로그아웃
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Lock className="w-3 h-3" />
                  <span>로그인 / 회원가입</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              메뉴 바로가기
            </div>
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Triggers inside Mobile Menu (Student Only) */}
          {currentRole === 'student' && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openBackgroundModal();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
              >
                <span>📋 연구 배경변인</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openSurveyModal();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-colors"
              >
                <span>🎁 WTP 설문 & 쿠폰</span>
              </button>
            </div>
          )}

          {/* SoriTutor & Wooriban External Links in Mobile Menu */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              패밀리 서비스 연동
            </div>
            <a
              href={APP_CONFIG.soriTutorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-semibold transition-colors"
            >
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-600" />
                소리튜터 (발음·음운 클리닉)
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href={APP_CONFIG.wooribanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 border border-slate-200 text-xs font-semibold transition-colors"
            >
              <span className="flex items-center gap-2">
                <School className="w-4 h-4 text-purple-600" />
                우리반 (Wooriban 학급 LMS & 코퍼스)
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

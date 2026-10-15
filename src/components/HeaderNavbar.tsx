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
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';
import { UserRole, ROLE_DEFINITIONS } from '../types/hanup';
import { SUPPORTED_LANGUAGES, SupportedLanguage, UI_TRANSLATIONS } from '../lib/i18n';
import { APP_CONFIG } from '../lib/config';

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
  } = useHanUp();
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = React.useState(false);

  // Navigation Links filtered by Role with i18n support
  const getNavLinks = () => {
    const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.ko;
    switch (currentRole) {
      case 'student':
        return [
          { href: '/dashboard', label: t.dashboard, icon: GraduationCap },
          { href: '/clinic', label: t.clinic, icon: Stethoscope },
          { href: '/study/hanup_topik/ch_writing_04', label: t.studyViewer, icon: BookOpen },
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
      {/* 1. Top RBAC Switcher Banner (Multi-tenancy & Testing Hub) */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            [4-Tier RBAC Switcher]
          </span>
          <span className="text-slate-400 hidden sm:inline">| 실시간 테스트 권한 전환:</span>
          <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
            {(['student', 'instructor', 'org_admin', 'super_admin'] as UserRole[]).map((r) => {
              const isActive = currentRole === r;
              return (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {ROLE_DEFINITIONS[r].labelKo}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Multi-tenant Org Badge */}
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            <Building2 className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-[11px] text-slate-400">orgId:</span>
            <span className="text-white font-medium">{currentOrg.orgName}</span>
          </span>

          {/* Multilingual 6-Language Selector (KO, EN, JA, ZH, VI, MY) */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-xs font-medium shadow-xs"
              title="언어 선택 / Select Language / 言語選択 / 语言选择 / Chọn ngôn ngữ / ဘာသာစကားရွေးပါ"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{SUPPORTED_LANGUAGES[lang].flag}</span>
              <span className="font-bold">{SUPPORTED_LANGUAGES[lang].label}</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-lg tracking-tighter">H</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  한업
                </span>
                <span className="text-sm font-extrabold text-blue-600 tracking-wider">
                  HanUp
                </span>
                <span className="text-xs font-medium text-slate-400 border-l border-slate-300 pl-1.5">
                  韩升
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">
                AI 글로벌 한국어 통합 SaaS
              </p>
            </div>
          </Link>

          {/* Dynamic Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
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

        {/* Right Side: User Profile & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Student Specific Target Level Badge */}
          {currentRole === 'student' && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-medium">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>목표: TOPIK {currentUser.targetTopikLevel}급</span>
              <span className="text-amber-500 font-bold">D-28</span>
            </div>
          )}

          {/* Quick Triggers for Background Intake & WTP Survey */}
          <button
            onClick={openBackgroundModal}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
            title="학술 연구용 7대 배경변인 등록/확인"
          >
            <span>📋 연구 배경변인</span>
          </button>

          <button
            onClick={openSurveyModal}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-colors"
            title="AI 요구분석 설문 & 20% 할인쿠폰 받기"
          >
            <span>🎁 WTP 설문</span>
          </button>

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
              <LayoutGrid className="w-5 h-5" />
            </button>

            {isAppLauncherOpen && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
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

                  {/* App 3: UriBan */}
                  <a
                    href={APP_CONFIG.uribanUrl}
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
                          우리반 (UriBan | 我们班)
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        학급 LMS & 작문 행동 로그(작성시간·복사시도) 통합 관리
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-purple-700 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="truncate">{APP_CONFIG.uribanUrl}</span>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 leading-snug px-1">
                  💡 3대 앱은 100% 독립 실행(Standalone)되며, 학습자 계정 및 연구 코퍼스는 느슨한 결합(Loosely Coupled)으로 자동 연동됩니다.
                </div>
              </div>
            )}
          </div>

          {/* User Mini Card */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-slate-300 object-cover"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{ROLE_DEFINITIONS[currentRole].labelKo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

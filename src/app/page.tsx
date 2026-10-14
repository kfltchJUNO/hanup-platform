'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle2,
  Database,
  Building2,
  Stethoscope,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileCheck,
  QrCode,
  Share2,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';
import { MOCK_SERIES } from '../mock/mockData';
import { UserRole } from '../types/hanup';

export default function HomePage() {
  const { currentRole, switchRole, lang } = useHanUp();

  const handleRoleQuickStart = (role: UserRole, targetPath: string) => {
    switchRole(role);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI 기반 글로벌 한국어 통합 B2B SaaS • 한업 (HanUp | 韩升)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            한국어 실력 향상(Up)과 급수 상승(升)을 하나로 끝내는 에드테크
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            학생에게는 <strong className="text-blue-400">약점 레이더 분석과 AI 실시간 첨삭</strong>을, 
            교사에게는 <strong className="text-emerald-400">Human-in-the-Loop 검수 화면</strong>을, 
            원장에게는 <strong className="text-amber-400">멀티테넌트 분양형 SaaS</strong>를, 
            연구자에게는 <strong className="text-purple-400">종단 작문 코퍼스 파이프라인</strong>을 제공합니다.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/dashboard"
              onClick={() => switchRole('student')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:translate-y-[-1px]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Lv.1 학생 대시보드 바로가기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/studio"
              onClick={() => switchRole('super_admin')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Lv.4 한업 저작 스튜디오 (OSMU)</span>
            </Link>
          </div>
        </div>

        {/* Ambient Decorative Blob */}
        <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 4-Tier Interactive Role Navigator */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              4단계 권한 계층별 핵심 기능 뷰 (AGENT.md Specification)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              상단 바의 스위처나 아래 카드를 클릭하면 해당 권한 모드로 즉시 전환되어 프로토타입을 테스트할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Lv.1 Student */}
          <div className={`p-5 rounded-2xl border transition-all ${
            currentRole === 'student' ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                Lv.1 학생 (Student)
              </span>
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">멀티 시리즈 통합 학습</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              • TOPIK 점수 추이 & 6대 영역 약점 레이더<br/>
              • 오늘의 약점 3제 무료 & 120제 결제 모달<br/>
              • 스마트 뷰어(어휘 툴팁, 딕테이션, 53·54 첨삭)
            </p>
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <Link
                href="/dashboard"
                onClick={() => switchRole('student')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-100/60 transition-colors"
              >
                <span>📊 마이 대시보드</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/clinic"
                onClick={() => switchRole('student')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-100/60 transition-colors"
              >
                <span>🎯 약점 보완 클리닉 (3제)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/study/hanup_topik/ch_writing_04"
                onClick={() => switchRole('student')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-100/60 transition-colors"
              >
                <span>📖 스마트 학습 뷰어 (54번)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Lv.2 Instructor */}
          <div className={`p-5 rounded-2xl border transition-all ${
            currentRole === 'instructor' ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                Lv.2 교사 (Instructor)
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Human-in-the-Loop</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              • AI 1차 첨삭 결과 확인 & 원클릭 승인<br/>
              • 교사 2차 코멘트 및 최종 점수 부여<br/>
              • 반별 약점 과제 일괄 발송 & 초대 코드
            </p>
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <Link
                href="/teacher/grading"
                onClick={() => switchRole('instructor')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-100/60 transition-colors"
              >
                <span>✍️ 2차 첨삭 검수 큐</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/teacher/classes"
                onClick={() => switchRole('instructor')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-100/60 transition-colors"
              >
                <span>👥 반 관리 및 과제 배정</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Lv.3 Org Admin */}
          <div className={`p-5 rounded-2xl border transition-all ${
            currentRole === 'org_admin' ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Lv.3 기관/원장 (Org Admin)
              </span>
              <Building2 className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">B2B 멀티테넌트 분양</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              • 본인 학원(`orgId`) 화이트라벨링 설정<br/>
              • 소속 강사 및 학생 시트(Seats) 할당<br/>
              • 학원 전체 성적 통계 및 라이선스 관리
            </p>
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <Link
                href="/admin/orgs"
                onClick={() => switchRole('org_admin')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 hover:bg-amber-100/60 transition-colors"
              >
                <span>🏢 학원 시트 & 브랜딩 설정</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/teacher/classes"
                onClick={() => switchRole('org_admin')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 hover:bg-amber-100/60 transition-colors"
              >
                <span>👥 소속 강사 & 클래스 현황</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Lv.4 Super Admin */}
          <div className={`p-5 rounded-2xl border transition-all ${
            currentRole === 'super_admin' ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                Lv.4 본사 (Super Admin)
              </span>
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">저작 스튜디오 & 연구 DB</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              • 원고 블록 에디터 & QR PDF 조판<br/>
              • 샤오홍슈 3:4 카드뉴스/숏폼 OSMU 추출<br/>
              • 작문 종단 코퍼스 필터링 및 CSV 내보내기
            </p>
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <Link
                href="/admin/studio"
                onClick={() => switchRole('super_admin')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-100/60 transition-colors"
              >
                <span>🎨 한업 저작 스튜디오</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/research"
                onClick={() => switchRole('super_admin')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-100/60 transition-colors"
              >
                <span>🔬 학술 연구 코퍼스 DB</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Series Showcase */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            한업 4대 핵심 교재 시리즈 (Series Naming Architecture)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            한국어 시험 대비부터 중국어권 특화 어휘, 비즈니스 및 유학 실무까지 하나의 계정으로 학습합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_SERIES.map((series) => (
            <div
              key={series.seriesId}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-bold text-white"
                    style={{ backgroundColor: series.accentColor }}
                  >
                    {series.badgeText}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    총 {series.chaptersCount}강
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{series.titleKo}</h3>
                <p className="text-xs font-medium text-slate-500 mb-2">{series.titleZh}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {series.descriptionKo}
                </p>
              </div>

              <Link
                href={`/study/${series.seriesId}/ch_writing_04`}
                onClick={() => switchRole('student')}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: series.accentColor }}
              >
                <span>교재 뷰어 입장</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

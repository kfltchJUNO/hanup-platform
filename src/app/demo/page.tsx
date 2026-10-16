'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle2,
  Building2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Award,
  Users,
  Database,
  QrCode,
  FileSpreadsheet,
  Check,
  Copy,
  ExternalLink,
  Laptop,
  Mail,
  Lock,
} from 'lucide-react';
import { useHanUp, isMasterEmail } from '../../context/HanUpContext';
import { UserRole, ROLE_DEFINITIONS } from '../../types/hanup';
import { HanUpLogo } from '../../components/HanUpLogo';

export default function DemoPage() {
  const { currentRole, switchRole, currentUser, organizations } = useHanUp();
  const [copiedLink, setCopiedLink] = useState(false);

  const promoLink = 'https://hanup.edu/join?org=hanup_global&source=b2b_demo';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(promoLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>B2B 파트너 & 교육기관 솔루션 시연 센터</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            어학원·대학교·개인 강사를 위한<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              4단계 역할 기반(RBAC)
            </span> 통합 운영 솔루션
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            한업(HanUp)은 학생을 위한 1:1 맞춤 AI 튜터뿐만 아니라, 교육기관의 강사 업무 경감(Human-in-the-Loop), 
            원클릭 QR 학생 간편 등록, 기관별 독립 브랜드 분양(화이트라벨링), 그리고 학술 연구용 코퍼스 DB까지 
            완전한 B2B SaaS 인프라를 제공합니다.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="text-slate-400">현재 체험 중인 권한:</span>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-black flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              {ROLE_DEFINITIONS[currentRole].labelKo} ({ROLE_DEFINITIONS[currentRole].descriptionKo})
            </span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Role Switcher & Feature Showcase */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>체험할 권한(Role)을 선택하세요</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              클릭 시 즉시 권한이 전환됩니다
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            각 역할별로 최적화된 대시보드와 특화 기능을 직접 탐색하실 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Lv.1 Student */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between ${
              currentRole === 'student'
                ? 'border-blue-500 bg-blue-50/50 shadow-lg ring-2 ring-blue-500/30'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-700">
                  Lv.1 학습자
                </span>
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">외국인 학생 화면</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                • 53·54번 손글씨 원고지 3초 AI 첨삭<br />
                • 교재 어휘·문장 소리튜터 실시간 발음 진단<br />
                • 취약 영역 레이더 차트 & 매일 맞춤 3제<br />
                • 6개 국어 모국어 해설 및 한글 40자 체계
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => switchRole('student')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  currentRole === 'student'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{currentRole === 'student' ? '현재 선택됨 ✓' : 'Lv.1 학생 모드로 전환'}</span>
              </button>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                <Link
                  href="/dashboard"
                  onClick={() => switchRole('student')}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-center transition-colors"
                >
                  학습 대시보드
                </Link>
                <Link
                  href="/clinic"
                  onClick={() => switchRole('student')}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-center transition-colors"
                >
                  약점 클리닉
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Lv.2 Teacher */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between ${
              currentRole === 'instructor'
                ? 'border-emerald-500 bg-emerald-50/50 shadow-lg ring-2 ring-emerald-500/30'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                  Lv.2 강사/교사
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">교사 첨삭 & 학급 관리</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                • <strong>Human-in-the-Loop</strong>: AI 첨삭 결과 원클릭 승인 & 2차 첨삭<br />
                • 학생별 개별 초대 링크 및 QR 생성<br />
                • CSV 학생 명단 일괄 등록 & 반 과제 배정<br />
                • 학생/학부모 발송용 성장 상담 리포트 출력
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => switchRole('instructor')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  currentRole === 'instructor'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{currentRole === 'instructor' ? '현재 선택됨 ✓' : 'Lv.2 교사 모드로 전환'}</span>
              </button>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                <Link
                  href="/teacher/grading"
                  onClick={() => switchRole('instructor')}
                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-center transition-colors"
                >
                  첨삭 검수 큐
                </Link>
                <Link
                  href="/teacher/classes"
                  onClick={() => switchRole('instructor')}
                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-center transition-colors"
                >
                  반 관리 & QR
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Lv.3 Org Admin */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between ${
              currentRole === 'org_admin'
                ? 'border-amber-500 bg-amber-50/50 shadow-lg ring-2 ring-amber-500/30'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900">
                  Lv.3 기관/원장
                </span>
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">B2B 기관 멀티테넌트</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                • 학원 고유 로고 & 테마 <strong>화이트라벨링</strong><br />
                • 강사 계정 및 학생 라이선스 시트(Seats) 할당<br />
                • 학원 전용 도메인 및 수강 현황 대시보드<br />
                • 정기 라이선스 결제 및 수강료 통합 정산
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => switchRole('org_admin')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  currentRole === 'org_admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{currentRole === 'org_admin' ? '현재 선택됨 ✓' : 'Lv.3 기관 모드로 전환'}</span>
              </button>
              <div className="grid grid-cols-1 text-[11px] font-bold">
                <Link
                  href="/admin/orgs"
                  onClick={() => switchRole('org_admin')}
                  className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-center transition-colors"
                >
                  기관 시트 & 브랜딩 설정 포털
                </Link>
              </div>
            </div>
          </div>

          {/* Card 4: Lv.4 Super Admin */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between ${
              currentRole === 'super_admin'
                ? 'border-purple-500 bg-purple-50/50 shadow-lg ring-2 ring-purple-500/30'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800">
                  Lv.4 한업 본사 마스터
                </span>
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">저작 스튜디오 & 연구</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                • <strong>OSMU 스튜디오</strong>: 원고 1개로 교재 PDF·음원·카드뉴스 자동 조판<br />
                • <strong>4단계 DRM 보안</strong>: 비가시적 워터마크 & 유출자 추적<br />
                • 종단 연구 작문 코퍼스 DB 필터링 & 익명화 다운로드<br />
                • <strong>대안A 오픈 프로모션</strong> 링크/QR 일괄 발행
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => switchRole('super_admin')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  currentRole === 'super_admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{currentRole === 'super_admin' ? '현재 선택됨 ✓' : 'Lv.4 본사 모드로 전환'}</span>
              </button>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                <Link
                  href="/admin/studio"
                  onClick={() => switchRole('super_admin')}
                  className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-center transition-colors"
                >
                  저작 스튜디오
                </Link>
                <Link
                  href="/admin/research"
                  onClick={() => switchRole('super_admin')}
                  className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-center transition-colors"
                >
                  연구 코퍼스 DB
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Promotion Link & QR Live Demonstration (Proposal A) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              <span>본사 직속 오픈 체험 프로모션 (대안 A) 작동 방식 시연</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              개별 강사나 기관이 없어도, 본사 직속 오픈 링크를 통해 실제 구글 계정으로 즉시 가입하고 학습 데이터를 영구 보존할 수 있습니다.
            </p>
          </div>
          <Link
            href="/join?org=hanup_global"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0 shadow-xs"
          >
            <span>실제 가입 페이지 열기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-blue-700">1. 마케팅 배포 링크</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={promoLink}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-slate-700"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold shrink-0 hover:bg-slate-800 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">인스타그램, 유튜브, 유학원 포스터 QR에 탑재되는 범용 링크입니다.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-emerald-700">2. 1클릭 온보딩 경험</span>
            <p className="text-slate-600 leading-relaxed">
              학생은 신용카드 등록 없이 본인 Google 계정으로 1초 만에 가입하며, 준비편(1~2급) 무료 체험과 약점 3제를 즉시 시작합니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-purple-700">3. 추후 기관/강사 배정 승계</span>
            <p className="text-slate-600 leading-relaxed">
              임시 더미 계정이 아니므로, 학생이 추후 학원에 등록할 때 기존 풀이 내역과 약점 데이터가 손실 없이 그대로 연동됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Enterprise B2B Partnership Inquiries */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>B2B 제휴 및 단체 도입 문의</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black">
            귀 기관에 맞춤화된 한국어 AI 스마트 캠퍼스를 구축해 드립니다.
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            대학 언어교육원 단체 라이선스, 어학원 전용 화이트라벨링 브랜딩, 교재 맞춤형 저작 스튜디오 도입을 원하시면 공식 고객지원 이메일로 문의해 주세요.
          </p>
        </div>

        <div className="shrink-0 text-center space-y-2">
          <a
            href="mailto:ot.helper7@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            <Mail className="w-4 h-4" />
            <span>ot.helper7@gmail.com 문의하기</span>
          </a>
          <p className="text-[11px] text-slate-400">평일 기준 24시간 이내 담당자 회신</p>
        </div>
      </section>
    </div>
  );
}

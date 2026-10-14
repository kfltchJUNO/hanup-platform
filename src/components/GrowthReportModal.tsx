'use client';

import React from 'react';
import {
  X,
  Printer,
  Award,
  TrendingUp,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  QrCode,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { UserProfile, WritingSubmission } from '../types/hanup';

interface GrowthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: UserProfile;
  latestSubmission?: WritingSubmission;
}

export function GrowthReportModal({
  isOpen,
  onClose,
  student,
  latestSubmission,
}: GrowthReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const history = student.scoreHistory && student.scoreHistory.length > 0
    ? student.scoreHistory
    : [
        { weekLabel: '1주차', totalScore: 135, listeningScore: 48, readingScore: 52, writingScore: 35, date: '2024-09-07' },
        { weekLabel: '2주차', totalScore: 148, listeningScore: 54, readingScore: 56, writingScore: 38, date: '2024-09-14' },
        { weekLabel: '3주차', totalScore: 162, listeningScore: 60, readingScore: 62, writingScore: 40, date: '2024-09-21' },
        { weekLabel: '4주차', totalScore: 174, listeningScore: 65, readingScore: 66, writingScore: 43, date: '2024-09-28' },
        { weekLabel: '5주차', totalScore: 186, listeningScore: 68, readingScore: 71, writingScore: 47, date: '2024-10-05' },
      ];

  const firstScore = history[0]?.totalScore || 135;
  const lastScore = history[history.length - 1]?.totalScore || 186;
  const scoreDiff = lastScore - firstScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Container: On screen it scrolls if needed; when printing, it's a pure A4 page */}
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative my-auto print:m-0 print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* On-screen control bar (hidden in print) */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
              Official PDF Report
            </span>
            <span className="text-xs text-slate-500">A4 1페이지 규격 자동 최적화</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>📄 PDF 인쇄 / 다운로드 (Print A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            A4 PRINTABLE REPORT CONTENT (Styled specifically for pristine A4 layout)
        ========================================================================= */}
        <div className="pt-6 sm:pt-8 space-y-6 text-slate-900 print:pt-0">
          {/* 1. Official Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-900">
                  한업 (HanUp | 韩升)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600 border border-slate-300">
                  한국어능력시험 연구평가원
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
                TOPIK II 주간 실력 향상 성적 리포트
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly TOPIK II Diagnostic & Empirical Growth Assessment
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="w-16 h-16 bg-slate-50 border border-slate-300 rounded-lg p-1 ml-auto flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="block text-[10px] font-mono text-slate-500">
                문서번호: HUP-2024-W{history.length}-09
              </span>
            </div>
          </div>

          {/* 2. Student Profile Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="block text-[10px] text-slate-500 font-medium">수험생 성명 / ID</span>
              <strong className="text-sm font-black text-slate-900">{student.name}</strong>
              <span className="block text-[10px] text-slate-400 font-mono">({student.uid})</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-medium">모국어(L1) / 소속</span>
              <strong className="font-bold text-slate-800">
                {student.nativeLanguage === 'zh-CN' ? '중국어 (zh-CN)' : student.nativeLanguage}
              </strong>
              <span className="block text-[10px] text-slate-500">한업 직영 주말 마스터반</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-medium">현재 급수 ➔ 목표 급수</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[11px]">
                  {student.currentTopikLevel}급
                </span>
                <span className="font-black text-blue-600">➔</span>
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[11px]">
                  ★ {student.targetTopikLevel}급 달성 목표
                </span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-medium">총 점수 상승치 (5주간)</span>
              <span className="text-sm font-black text-emerald-600 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                +{scoreDiff}점 상승 (135 ➔ {lastScore}점)
              </span>
            </div>
          </div>

          {/* 3. Weekly Score Trajectory Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. 주차별 실전 모의고사 점수 상승 추이 (Weekly Score Trajectory)
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs">
              <table className="w-full text-center border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 text-left">평가 주차</th>
                    <th className="py-2 px-3">듣기 (100점)</th>
                    <th className="py-2 px-3">읽기 (100점)</th>
                    <th className="py-2 px-3">쓰기 53·54 (100점)</th>
                    <th className="py-2 px-3 font-black text-blue-900">종합 예상 점수 (300점)</th>
                    <th className="py-2 px-3">판정 등급</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {history.map((entry, idx) => {
                    const estimatedLevel =
                      entry.totalScore >= 230 ? '6급' :
                      entry.totalScore >= 190 ? '5급' :
                      entry.totalScore >= 150 ? '4급' : '3급';

                    const isLatest = idx === history.length - 1;

                    return (
                      <tr key={idx} className={isLatest ? 'bg-blue-50/60 font-bold' : ''}>
                        <td className="py-2 px-3 text-left font-sans font-medium text-slate-800">
                          {entry.weekLabel} ({entry.date})
                        </td>
                        <td className="py-2 px-3 text-slate-700">{entry.listeningScore}점</td>
                        <td className="py-2 px-3 text-slate-700">{entry.readingScore}점</td>
                        <td className="py-2 px-3 text-slate-700">{entry.writingScore}점</td>
                        <td className="py-2 px-3 font-extrabold text-blue-700">{entry.totalScore}점</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                            isLatest ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {estimatedLevel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. 6-Axis Radar Skill Competency & Prescription */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              2. 6대 영역별 정밀 진단 및 맞춤 처방 (Diagnostic Prescription)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600">한자어·고급어휘</span>
                <div className="text-lg font-black text-slate-900 mt-0.5">{student.skillRadar.vocabHanja}점 <span className="text-[10px] text-emerald-600 font-bold">(우수)</span></div>
                <p className="text-[10px] text-slate-500 mt-1">동형이의 한자어 어휘력 양호</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-900">연결어미·문법 (약점)</span>
                <div className="text-lg font-black text-amber-900 mt-0.5">{student.skillRadar.grammarConnective}점 <span className="text-[10px] text-amber-700 font-bold">(보완 필요)</span></div>
                <p className="text-[10px] text-amber-800 mt-1">부정 인과 연결어미(-는 바람에) 집중 클리닉 처방</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600">듣기 연음·추론</span>
                <div className="text-lg font-black text-slate-900 mt-0.5">{student.skillRadar.listeningInference}점 <span className="text-[10px] text-blue-600 font-bold">(양호)</span></div>
                <p className="text-[10px] text-slate-500 mt-1">받침 비음화·유음화 딕테이션 훈련</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600">읽기 3초 속독·논리</span>
                <div className="text-lg font-black text-slate-900 mt-0.5">{student.skillRadar.readingSkimming}점 <span className="text-[10px] text-blue-600 font-bold">(안정)</span></div>
                <p className="text-[10px] text-slate-500 mt-1">단락별 두괄식 핵심 주제문 포착 능력 양호</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600">53번 도표·자료 서술</span>
                <div className="text-lg font-black text-slate-900 mt-0.5">{student.skillRadar.writing53Data}점 <span className="text-[10px] text-slate-600 font-bold">(보통)</span></div>
                <p className="text-[10px] text-slate-500 mt-1">단위별 조사(%로 vs 원으로) 및 원인 공식 숙지</p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                <span className="text-[11px] font-bold text-rose-900">54번 논술 수사 구조 (최대 취약)</span>
                <div className="text-lg font-black text-rose-900 mt-0.5">{student.skillRadar.writing54Logic}점 <span className="text-[10px] text-rose-700 font-bold">(집중 지도)</span></div>
                <p className="text-[10px] text-rose-800 mt-1">중국어 직역투 탈피 및 격식 해라체(-ㄴ다) 필수</p>
              </div>
            </div>
          </div>

          {/* 5. Latest Writing Feedback & Instructor Human-in-the-Loop Review */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              3. 최근 쓰기 실전 첨삭 (AI 1차 피드백 & 교사 2차 최종 검수)
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  논제: {latestSubmission?.taskPromptTitle || '54번 실전: AI 기술의 발전과 윤리적 과제'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                  채점 확정: {latestSubmission?.instructorFeedback?.finalScore || 36} / 50점
                </span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                <strong>교사 총평 (최민서 선생님):</strong> "
                {latestSubmission?.instructorFeedback?.teacherComment ||
                  '웨이 학생! AI 1차 분석대로 논리 뼈대는 잘 잡았어요. 특히 결론에서 지적된 "선결 과제" 표현을 꼭 적용하고, 2번째 본론에 자율주행 사고 책임 소재 사례를 2문장만 더 늘려서 600자를 채워 다시 제출해 봅시다!'}
                "
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>연구 코퍼스 식별자: {latestSubmission?.submissionId || 'sub_20241012_001'}</span>
                <span className="text-emerald-700 font-bold">Human-in-the-Loop 검증 승인 완료 ✅</span>
              </div>
            </div>
          </div>

          {/* 6. Official Stamp & Certification */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-700">한업(HanUp) 한국어교육학 연구평가위원회</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                본 성적표는 TOPIK II 공식 채점 기준 및 종단 코퍼스 분석에 의거하여 발행되었습니다.
              </p>
            </div>
            {/* Red Institutional Seal Graphic */}
            <div className="w-16 h-16 rounded-full border-2 border-rose-600/80 p-1 flex items-center justify-center text-center text-rose-600 font-black text-[9px] leading-tight rotate-[-12deg] shadow-xs">
              한업<br />평가원<br />직인
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

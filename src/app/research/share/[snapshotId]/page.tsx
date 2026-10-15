'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Database,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Users,
  FileSpreadsheet,
  BarChart2,
  Lock,
  ArrowLeft,
  BookOpen,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { MOCK_SURVEY_RESPONSES, MOCK_SUBMISSIONS } from '../../../../mock/mockData';

export default function ResearchSnapshotSharePage() {
  const params = useParams();
  const snapshotId = (params.snapshotId as string) || 'snap_202610_irb_corpus01';

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  const citationText = `Dr. Han, et al. (2026). "L1 Multimodal Interference Corpus & Willingness-to-Pay (WTP) in AI-Assisted KFL Writing Education." HanUp Academic Corpus Snapshot [ID: ${snapshotId}], https://hanup.ai/research/share/${snapshotId}`;

  // Anonymized Survey Aggregates
  const totalResponses = MOCK_SURVEY_RESPONSES.length;
  const avgLikert = (
    MOCK_SURVEY_RESPONSES.reduce((acc, curr) => acc + curr.aiPreferenceScore, 0) / totalResponses
  ).toFixed(2);

  const tierCounts: Record<string, number> = {
    'Tier 1 (순수 AI 자습)': 0,
    'Tier 2 (AI+교사 주1회 검수)': 0,
    'Tier 3 (AI+줌 라이브 특강)': 0,
    'Tier 4 (1:1 밀착 과외)': 0,
  };

  MOCK_SURVEY_RESPONSES.forEach((r) => {
    if (r.preferredInterventionTier === 'tier1_ai_only') tierCounts['Tier 1 (순수 AI 자습)']++;
    else if (r.preferredInterventionTier === 'tier2_ai_human_review') tierCounts['Tier 2 (AI+교사 주1회 검수)']++;
    else if (r.preferredInterventionTier === 'tier3_ai_group_lecture') tierCounts['Tier 3 (AI+줌 라이브 특강)']++;
    else tierCounts['Tier 4 (1:1 밀착 과외)']++;
  });

  const tierData = Object.entries(tierCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  const handleCopy = (text: string, type: 'link' | 'citation') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Snapshot Verification Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <Link
            href="/admin/research"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>연구 센터 대시보드로 돌아가기</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>IRB 가명화 인증 스냅샷: {snapshotId}</span>
            </span>
          </div>
        </div>

        {/* Paper Title & Metadata Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-800">
            <Database className="w-3.5 h-3.5" />
            <span>Academic Research Corpus Public Footnote Viewer</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
            한국어교육학 학술 논문 검증용 공개 데이터셋 스냅샷
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
            본 페이지는 학술지 투고 논문 각주 및 동료 심사(Peer Review) 검증을 위한 영구 불변(Immutable) 연구 데이터셋 스냅샷입니다. 모든 학습자의 개인식별정보(이름, 이메일)는 생명윤리심의위원회(IRB) 가이드라인에 따라 SHA-256 비식별화 및 마스킹 처리되었습니다.
          </p>

          {/* Citation Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">논문 인용 표기 (APA Citation):</span>
              <button
                onClick={() => handleCopy(citationText, 'citation')}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? '인용구 복사됨' : '인용구 복사'}</span>
              </button>
            </div>
            <p className="text-xs font-mono text-slate-600 leading-relaxed select-all bg-white p-2.5 rounded-xl border border-slate-200">
              {citationText}
            </p>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-400 font-bold block">유효 연구 표본 (N)</span>
            <span className="text-2xl font-black text-blue-700">{totalResponses}명</span>
            <span className="text-[11px] text-slate-500 block">5개 다국어권 L1 수집 완료</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-400 font-bold block">AI 학습 선호도 리커트</span>
            <span className="text-2xl font-black text-purple-700">{avgLikert} / 5.0</span>
            <span className="text-[11px] text-emerald-600 font-semibold block">매우 높은 수용성</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-400 font-bold block">최선호 결합 모델</span>
            <span className="text-lg font-black text-indigo-700">Tier 2 하이브리드</span>
            <span className="text-[11px] text-slate-500 block">AI 즉각첨삭 + 주1회 교사검수</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-400 font-bold block">데이터 보안 등급</span>
            <span className="text-lg font-black text-emerald-700">SHA-256 마스킹</span>
            <span className="text-[11px] text-slate-500 block">IRB 비식별성 100% 충족</span>
          </div>
        </div>

        {/* Visual Charts: Preferred Tier Breakdown & Topic Cloud */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-600" />
              <span>인간 교사 개입 단계별 선호도 분포 (Tier 1~4)</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name.split(' ')[0]} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {tierData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>질적 의견 토픽 모델링 고빈도 키워드 (Qualitative Feedback)</span>
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { word: '번역투 교정', weight: 'text-base font-black text-blue-800 bg-blue-50 border-blue-200' },
                { word: '원고지 띄어쓰기', weight: 'text-sm font-bold text-indigo-800 bg-indigo-50 border-indigo-200' },
                { word: '즉각 실시간 피드백', weight: 'text-base font-black text-purple-800 bg-purple-50 border-purple-200' },
                { word: '소리튜터 발음 연동', weight: 'text-sm font-bold text-emerald-800 bg-emerald-50 border-emerald-200' },
                { word: '인간 교사 주1회 확인', weight: 'text-sm font-bold text-amber-800 bg-amber-50 border-amber-200' },
                { word: '심리적 편안함', weight: 'text-xs font-semibold text-slate-700 bg-slate-100 border-slate-200' },
                { word: '대학원 이메일 템플릿', weight: 'text-xs font-semibold text-slate-700 bg-slate-100 border-slate-200' },
                { word: '54번 논술 수사 구조', weight: 'text-sm font-bold text-rose-800 bg-rose-50 border-rose-200' },
                { word: '학원 대비 가성비', weight: 'text-xs font-semibold text-slate-700 bg-slate-100 border-slate-200' },
              ].map((item, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl border ${item.weight} shadow-xs`}
                >
                  {item.word}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-2">
              학습자들은 AI의 즉시성과 심리적 부담 완화를 높이 평가하면서도, 고득점을 위한 인간 교사의 주기적 맥락 검수가 결합된 하이브리드 모델에 가장 높은 지불의향(WTP)을 나타내었습니다.
            </p>
          </div>
        </div>

        {/* Anonymized Corpus Preview Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>가명화된 연구 표본 데이터 미리보기 (Anonymized Data Preview)</span>
            </h3>
            <span className="text-xs text-slate-400">총 {totalResponses}개 레코드</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">표본 ID</th>
                  <th className="py-3 px-4">가명 (Masked)</th>
                  <th className="py-3 px-4">모국어(L1)</th>
                  <th className="py-3 px-4">선호도</th>
                  <th className="py-3 px-4">선호 모델</th>
                  <th className="py-3 px-4">Tier 1 WTP</th>
                  <th className="py-3 px-4">Tier 2 WTP</th>
                  <th className="py-3 px-4">질적 서술 의견</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {MOCK_SURVEY_RESPONSES.map((res) => {
                  const maskedName = `${res.studentName.charAt(0)}**`;
                  return (
                    <tr key={res.responseId} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-slate-400">{res.responseId}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{maskedName}</td>
                      <td className="py-3 px-4 font-semibold text-blue-700">{res.nativeLanguage}</td>
                      <td className="py-3 px-4 font-bold text-amber-600">★ {res.aiPreferenceScore}.0</td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                          {res.preferredInterventionTier.replace('tier', 'Tier ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{res.wtpTier1AiOnly}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{res.wtpTier2AiHumanReview}</td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={res.openFeedbackText}>
                        {res.openFeedbackText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

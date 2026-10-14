'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  QrCode,
  Send,
  Plus,
  BookOpen,
  Award,
  CheckCircle,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Printer,
  X,
  TrendingUp,
  BarChart2,
  Calendar,
  Sparkles,
  ExternalLink,
  Upload,
  Download,
  FileSpreadsheet,
  School,
} from 'lucide-react';
import { useHanUp } from '../../../context/HanUpContext';
import { MOCK_USERS } from '../../../mock/mockData';
import { GrowthReportModal } from '../../../components/GrowthReportModal';
import { UriBanSyncModal } from '../../../components/UriBanSyncModal';

export default function TeacherClassesPage() {
  const { classes, currentOrg, currentUser, submissions } = useHanUp();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [assignedNotice, setAssignedNotice] = useState<string | null>(null);

  // UriBan Sync Modal State
  const [isUriBanModalOpen, setIsUriBanModalOpen] = useState(false);

  // Selected Student for PDF Consultation Report Modal
  const [reportStudentProfile, setReportStudentProfile] = useState<any | null>(null);

  // Selected QR Code modal
  const [qrModalClass, setQrModalClass] = useState<any | null>(null);

  // New Class Modal
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // CSV Bulk Import Modal & State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState(
`이름,이메일,모국어,현재급수,목표급수,배정반
리샤오룽(李小龙),xiaolong@hanup.edu,zh-CN,3,5,cls_topik_01
천징(陈静),chenjing@hanup.edu,zh-CN,4,6,cls_topik_01
팜티란(Phạm Thị Lan),lan@hanup.edu,vi-VN,2,4,cls_topik_02
알렉산드르,alex@hanup.edu,ru-RU,3,5,cls_topik_01`
  );
  const [bulkImportSuccessMsg, setBulkImportSuccessMsg] = useState<string | null>(null);

  // Sample enrolled students state
  const [studentsList, setStudentsList] = useState([
    {
      uid: 'usr_student_01',
      name: '왕웨이 (王伟)',
      l1: 'zh-CN (중국)',
      currentLevel: 3,
      targetLevel: 5,
      latestTask: '54번 AI 윤리 논술 (검수 완료)',
      avgScore: 186,
      status: 'active',
    },
    {
      uid: 'usr_student_02',
      name: '장메이 (张美)',
      l1: 'zh-CN (중국)',
      currentLevel: 4,
      targetLevel: 6,
      latestTask: '53번 경제 통계 도표 (제출 완료)',
      avgScore: 204,
      status: 'active',
    },
  ]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDispatchWeaknessAssignment = (className: string) => {
    setAssignedNotice(className);
    setTimeout(() => setAssignedNotice(null), 3000);
  };

  const parseCsvRows = (text: string) => {
    const lines = text.trim().split('\n').filter(Boolean);
    if (lines.length <= 1) return [];
    return lines.slice(1).map((line, idx) => {
      const parts = line.split(',').map((p) => p.trim());
      return {
        uid: `usr_import_${Date.now()}_${idx}`,
        name: parts[0] || `신규학생_${idx + 1}`,
        email: parts[1] || `student${idx + 1}@hanup.edu`,
        l1: parts[2] || 'zh-CN',
        currentLevel: Number(parts[3]) || 3,
        targetLevel: Number(parts[4]) || 5,
        classId: parts[5] || 'cls_topik_01',
        latestTask: '신규 등록 완료 (진단 평가 대기)',
        avgScore: 0,
        status: 'active',
      };
    });
  };

  const handleExecuteBulkImport = () => {
    const parsed = parseCsvRows(csvRawText);
    if (parsed.length === 0) return;

    setStudentsList((prev) => [...prev, ...parsed]);
    setBulkImportSuccessMsg(`${parsed.length}명의 학생이 성공적으로 등록되었습니다!`);
    setTimeout(() => {
      setBulkImportSuccessMsg(null);
      setIsCsvModalOpen(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-black mb-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>B2B Multi-Tenant Class & Student Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            담당 반 개설 및 반별 맞춤 약점 과제 일괄 발송
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            소속 기관: <strong>{currentOrg.orgName}</strong> (orgId: {currentOrg.orgId}) • 6자리 초대 코드로 학생을 등록하고 반 전체 취약점 과제를 원클릭 배정합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsUriBanModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs shadow-md shadow-purple-600/20 transition-all hover:scale-105"
            title="우리반(UriBan) 학급 및 작문 데이터 동기화"
          >
            <School className="w-4 h-4 text-purple-200" />
            <span>🏫 우리반(UriBan) 학급/제출물 연동</span>
          </button>

          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all hover:scale-105"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>학생 대량 일괄 등록 (CSV)</span>
          </button>

          <button
            onClick={() => setIsNewClassModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>신규 클래스 개설</span>
          </button>
        </div>
      </div>

      {/* Assignment Success Alert */}
      {assignedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>[{assignedNotice}] 소속 학생 전원에게 '54번 논술 수사 구조 약점 극복 과제(3제)'가 일괄 발송되었습니다!</span>
          </div>
          <span className="text-emerald-700 font-extrabold text-[11px]">카카오톡/위챗 알림톡 연동됨</span>
        </div>
      )}

      {/* 2. Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.classId}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Class Title & 6-digit Invite Code */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">Class ID: {cls.classId}</span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">{cls.className}</h3>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setQrModalClass(cls)}
                    className="p-1 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    title="초대용 QR코드 보기"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-black text-xs text-blue-700 px-1">{cls.inviteCode}</span>
                  <button
                    onClick={() => handleCopyCode(cls.inviteCode)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
                    title="초대 코드 복사"
                  >
                    {copiedCode === cls.inviteCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Class Summary Stats */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs my-4">
                <div>
                  <span className="text-slate-400 text-[10px] block">소속 학생</span>
                  <span className="text-base font-black text-slate-800">{cls.studentUids.length}명</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">반 평균 점수</span>
                  <span className="text-base font-black text-blue-600">{cls.averageTopikScore || 194}점</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">배정 교재</span>
                  <span className="text-base font-black text-purple-600">{cls.assignedSeriesIds.length}개</span>
                </div>
              </div>

              {/* Weakness Alert & Dispatch Box */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    반 공통 취약점 1위: 54번 논술 수사 구조
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    오답률 58%
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  학생들의 80%가 결론부 '선결 과제' 대책 제시와 중국어 번역투 표현에서 감점되고 있습니다.
                </p>
                <button
                  onClick={() => handleDispatchWeaknessAssignment(cls.className)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md shadow-amber-600/20 transition-all hover:scale-102"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>반별 맞춤 약점 과제 일괄 발송하기 (숙제 배정)</span>
                </button>
              </div>
            </div>

            {/* Enrolled Students Quick Peek Table */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                소속 학생 학습 현황 및 1:1 상담용 성적표:
              </span>
              <div className="space-y-1.5">
                {studentsList.map((st) => (
                  <div
                    key={st.uid}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{st.name}</span>
                        <span className="text-[10px] font-normal text-slate-400">{st.l1}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        목표 {st.targetLevel}급 • 최근: {st.latestTask}
                      </div>
                    </div>
                    <button
                      onClick={() => setReportStudentProfile(MOCK_USERS[st.uid] || MOCK_USERS.student)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-700 font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>📄 주간 성적 향상 리포트 PDF 발급</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Student Growth Report Modal (A4 Offline PDF Print) */}
      {reportStudentProfile && (
        <GrowthReportModal
          isOpen={!!reportStudentProfile}
          onClose={() => setReportStudentProfile(null)}
          student={reportStudentProfile}
          latestSubmission={submissions[0]}
        />
      )}

      {/* 4. QR Code Invitation Modal */}
      {qrModalClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setQrModalClass(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-md">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">{qrModalClass.className}</h3>
              <p className="text-xs text-slate-500 mt-1">
                학생들이 카메라로 스캔하면 즉시 해당 반으로 등록됩니다.
              </p>
            </div>

            {/* QR Mockup */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <div className="w-40 h-40 bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-xs">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="font-mono text-sm font-black text-blue-700 mt-2">
                초대코드: {qrModalClass.inviteCode}
              </div>
            </div>

            <button
              onClick={() => setQrModalClass(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 5. New Class Modal */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsNewClassModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-slate-900">새로운 담당 클래스 개설</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                클래스 생성 즉시 고유한 6자리 초대코드와 QR이 자동 발급됩니다.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">반 명칭:</label>
              <input
                type="text"
                placeholder="예: TOPIK II 6급 심화 합격반"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
            </div>

            <button
              onClick={() => {
                setIsNewClassModalOpen(false);
                setNewClassName('');
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              클래스 개설 완료
            </button>
          </div>
        </div>
      )}

      {/* 6. CSV Bulk Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsCsvModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  학생 명단 CSV 대량 일괄 등록 (Bulk Import)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  다수의 학생을 한 번에 계정 생성하고 반에 배정합니다. 아래 CSV 형식을 편집하거나 붙여넣으세요.
                </p>
              </div>
            </div>

            {/* Success Alert */}
            {bulkImportSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-900 animate-in fade-in duration-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{bulkImportSuccessMsg} 잠시 후 창이 닫힙니다.</span>
              </div>
            )}

            {/* Template Download & Instructions */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">
                표준 컬럼 규격: <code>이름,이메일,모국어,현재급수,목표급수,배정반코드</code>
              </span>
              <button
                onClick={() => {
                  const blob = new Blob([csvRawText], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'hanup_student_import_template.csv';
                  a.click();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-[11px] shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>샘플 CSV 템플릿 다운로드</span>
              </button>
            </div>

            {/* Raw CSV Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">CSV 데이터 입력/수정:</label>
                <span className="text-slate-400 text-[11px]">콤마(,)로 열 구분 • 1줄에 1명</span>
              </div>
              <textarea
                rows={5}
                value={csvRawText}
                onChange={(e) => setCsvRawText(e.target.value)}
                className="w-full p-3 font-mono text-xs border border-slate-200 rounded-2xl bg-slate-50/50 text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
            </div>

            {/* Live Parsed Preview Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  파싱 미리보기 ({parseCsvRows(csvRawText).length}명 감지됨):
                </span>
                <span className="text-[11px] text-emerald-600 font-bold">● 모든 필수 항목 유효</span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto max-h-48">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">이름</th>
                        <th className="py-2 px-3">이메일</th>
                        <th className="py-2 px-3">모국어</th>
                        <th className="py-2 px-3">급수 (현재→목표)</th>
                        <th className="py-2 px-3">배정 반</th>
                        <th className="py-2 px-3 text-center">상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {parseCsvRows(csvRawText).map((st, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold text-slate-900">{st.name}</td>
                          <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{st.email}</td>
                          <td className="py-2 px-3 text-slate-600">
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono font-bold">
                              {st.l1}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-700 font-bold">
                            {st.currentLevel}급 → {st.targetLevel}급
                          </td>
                          <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{st.classId}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              등록 대기
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
              >
                닫기
              </button>
              <button
                onClick={handleExecuteBulkImport}
                disabled={parseCsvRows(csvRawText).length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{parseCsvRows(csvRawText).length}명 일괄 등록 및 계정 생성</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UriBan Bi-directional Sync Modal */}
      <UriBanSyncModal
        isOpen={isUriBanModalOpen}
        onClose={() => setIsUriBanModalOpen(false)}
      />
    </div>
  );
}

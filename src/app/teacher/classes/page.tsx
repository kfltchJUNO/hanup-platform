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
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldCheck,
  Lock,
  PlusCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { useHanUp } from '../../../context/HanUpContext';
import { MOCK_USERS } from '../../../mock/mockData';
import { GrowthReportModal } from '../../../components/GrowthReportModal';
import { UriBanSyncModal } from '../../../components/UriBanSyncModal';

export default function TeacherClassesPage() {
  const {
    classes,
    currentOrg,
    currentUser,
    currentRole,
    submissions,
    vettedTasks,
    homeworkCredits,
    creditPacks,
    createCustomHomeworkTask,
    rechargeHomeworkCredits,
    isUriBanEnabled,
    toggleUriBanEnabled,
  } = useHanUp();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [assignedNotice, setAssignedNotice] = useState<string | null>(null);

  // UriBan On-Demand Collapsible State
  const [isUriBanSectionOpen, setIsUriBanSectionOpen] = useState(false);
  const [isUriBanModalOpen, setIsUriBanModalOpen] = useState(false);

  // Homework Tasks Tab & Creation Form State
  const [homeworkTab, setHomeworkTab] = useState<'vetted' | 'create'>('vetted');
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [customTaskType, setCustomTaskType] = useState<
    'topik_54_essay' | 'topik_53_graph' | 'vocab_clinic' | 'reading_quiz'
  >('topik_54_essay');
  const [customTaskLevel, setCustomTaskLevel] = useState<number>(4);
  const [customTaskContent, setCustomTaskContent] = useState('');
  const [customTaskRubric, setCustomTaskRubric] = useState('수사적 구조(20점), 조사 및 문법 정확성(20점), 어휘 적절성(10점)');
  const [taskCreateMessage, setTaskCreateMessage] = useState<{ success: boolean; text: string } | null>(null);

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

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskTitle.trim() || !customTaskContent.trim()) {
      setTaskCreateMessage({ success: false, text: '숙제 제목과 본문 내용을 입력해 주세요.' });
      return;
    }

    if (currentRole === 'student') {
      setTaskCreateMessage({ success: false, text: '학생(Lv.1) 계정은 숙제를 생성할 권한이 없습니다.' });
      return;
    }

    if (homeworkCredits <= 0) {
      setIsCreditModalOpen(true);
      return;
    }

    const res = createCustomHomeworkTask({
      title: customTaskTitle,
      taskType: customTaskType,
      targetLevel: customTaskLevel,
      rubric: customTaskRubric,
      rubricSummary: customTaskRubric,
      content: customTaskContent,
      isOfficialVetted: false,
      createdByRole: 'instructor',
      assignedClassIds: [classes[0]?.classId || 'cls_topik_01'],
    });

    if (res.success) {
      setTaskCreateMessage({ success: true, text: `${res.message} (1크레딧 차감됨)` });
      setCustomTaskTitle('');
      setCustomTaskContent('');
      setTimeout(() => setTaskCreateMessage(null), 3000);
    } else {
      setTaskCreateMessage({ success: false, text: res.message });
      if (res.message.includes('크레딧')) {
        setIsCreditModalOpen(true);
      }
    }
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

      {/* 1.5 UriBan On-Demand Collapsible Accordion (Prevents Port 3001 Collisions) */}
      <div className="bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-purple-50/70 border border-purple-200/80 rounded-3xl p-5 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm text-slate-900">🏫 우리반(UriBan) 학급 & 작문 온디맨드 연동</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${isUriBanEnabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200/80 text-slate-600'}`}>
                  {isUriBanEnabled ? '● 연동 활성화 (Port 3001)' : '○ 비활성화 대기 중 (포트 충돌 방지)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                기본 화면 복잡도와 로컬 개발 환경 포트(3001) 충돌을 차단하기 위해 필요 시에만 펼쳐서 사용합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleUriBanEnabled}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                isUriBanEnabled
                  ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs'
                  : 'bg-white border border-slate-300 hover:border-purple-300 text-slate-700'
              }`}
            >
              {isUriBanEnabled ? '연동 모듈 끄기' : '온디맨드 연동 켜기'}
            </button>
            <button
              onClick={() => setIsUriBanSectionOpen(!isUriBanSectionOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-100/70 hover:bg-purple-200 text-purple-900 font-bold text-xs transition-colors"
            >
              <span>{isUriBanSectionOpen ? '상세 접기' : '상세 펼치기'}</span>
              {isUriBanSectionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Unfolded Content */}
        {isUriBanSectionOpen && (
          <div className="mt-4 pt-4 border-t border-purple-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-950">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span>우리반 스키마(SchoolData, AppUser, Submission, AIFeedback) 양방향 1:1 자동 매핑 지원</span>
              </div>
              <p className="text-[11px] text-slate-500">
                연동 시 우리반의 한국어 학급 수강생 및 원고지 답안을 한업 연구자 코퍼스 및 B2B 학급 관리로 즉시 가져올 수 있습니다.
              </p>
            </div>
            <button
              onClick={() => setIsUriBanModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 flex-shrink-0"
            >
              <School className="w-4 h-4 text-purple-200" />
              <span>양방향 동기화 콘솔 열기</span>
            </button>
          </div>
        )}
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

      {/* 2.5 맞춤형 숙제 AI 스튜디오 & 연구진 검증 공식 숙제 풀 (Lv.2 교사 / Lv.3 기관 전용) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Lv.2 교사 / Lv.3 기관 맞춤형 숙제 제작소</span>
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-bold">
                권한: {currentRole === 'student' ? 'Lv.1 학생 (숙제 생성 불가)' : (currentRole === 'instructor' ? 'Lv.2 교사 (10회 기본 제공)' : 'Lv.3 기관 관리자')}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              맞춤형 숙제 AI 스튜디오 & 한업 연구진 공식 검증 숙제 풀
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              검증되지 않은 임의 프롬프트로 인한 한국어 문맥·문법 오류를 차단하기 위해 연구진 사전 검수 풀을 제공하며, 신규 숙제 제작 시 건당 1크레딧이 차감됩니다.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-3 shadow-xs">
            <div>
              <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wider">잔여 제작 크레딧</span>
              <div className="flex items-center gap-1 text-base font-black text-amber-900">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>{homeworkCredits}회 남음</span>
              </div>
            </div>
            <button
              onClick={() => setIsCreditModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-transform hover:scale-105"
            >
              + 크레딧 충전
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setHomeworkTab('vetted')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              homeworkTab === 'vetted'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>연구진 사전 검증 공식 풀 ({vettedTasks.length}개)</span>
          </button>
          <button
            onClick={() => setHomeworkTab('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              homeworkTab === 'create'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>신규 숙제 AI 맞춤 생성 (1크레딧 차감)</span>
          </button>
        </div>

        {/* Tab 1: Vetted Tasks Pool */}
        {homeworkTab === 'vetted' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vettedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4.5 space-y-3 hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>오류 0% 검증 완료</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      TOPIK {task.targetLevel}급 목표
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {task.title}
                  </h3>

                  <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-600 line-clamp-3">
                    {task.content}
                  </div>

                  <div className="mt-2 text-[10px] text-slate-500 font-medium">
                    <strong className="text-slate-700">채점 루브릭:</strong> {task.rubricSummary}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    제출 완료: {task.submissionsCount}건
                  </span>
                  <button
                    onClick={() => handleDispatchWeaknessAssignment(classes[0]?.className || '선택된 반')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>반 전체 일괄 배정</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Custom AI Homework Studio */}
        {homeworkTab === 'create' && (
          <div>
            {currentRole === 'student' ? (
              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
                <Lock className="w-8 h-8 text-amber-600 mx-auto" />
                <h4 className="text-sm font-black text-amber-950">
                  학생(Lv.1) 계정은 숙제 생성 권한이 차단되어 있습니다
                </h4>
                <p className="text-xs text-amber-800 max-w-md mx-auto">
                  교사(Lv.2) 또는 기관 관리자(Lv.3) 계정만 AI 기반 맞춤형 과제를 생성하여 반에 배포할 수 있습니다. 상단 역할 전환 스위처를 확인해 주세요.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateCustomTask} className="space-y-4 max-w-3xl">
                {taskCreateMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      taskCreateMessage.success
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {taskCreateMessage.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>{taskCreateMessage.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">과제 제목</label>
                    <input
                      type="text"
                      placeholder="예: 54번 인공지능 윤리와 인간 일자리 찬반 논술"
                      value={customTaskTitle}
                      onChange={(e) => setCustomTaskTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">과제 유형</label>
                    <select
                      value={customTaskType}
                      onChange={(e) => setCustomTaskType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="topik_54_essay">TOPIK 54번 (논술형)</option>
                      <option value="topik_53_graph">TOPIK 53번 (도표 기술형)</option>
                      <option value="vocab_clinic">어휘 클리닉 (L1 모어 간섭 치환)</option>
                      <option value="reading_quiz">독해 속독 퀴즈 (기출 변형)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">목표 TOPIK 급수</label>
                    <select
                      value={customTaskLevel}
                      onChange={(e) => setCustomTaskLevel(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={3}>3급 (중급 도입)</option>
                      <option value={4}>4급 (중급 완성)</option>
                      <option value={5}>5급 (고급 도입)</option>
                      <option value={6}>6급 (고급 심화)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">루브릭 평가 기준 요약</label>
                    <input
                      type="text"
                      value={customTaskRubric}
                      onChange={(e) => setCustomTaskRubric(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">과제 지문 및 문제 지시문 (AI 생성 프롬프트)</label>
                  <textarea
                    rows={4}
                    placeholder="지시문과 세부 작성 조건을 입력하세요. (예: 600~700자로 작성할 것, 본론 1과 2에 각각 찬반 근거를 제시할 것 등)"
                    value={customTaskContent}
                    onChange={(e) => setCustomTaskContent(e.target.value)}
                    className="w-full p-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-400">
                    생성 즉시 1크레딧이 차감되며, 검증 풀에 등재되어 담당 반에 즉시 배포할 수 있습니다.
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>AI 맞춤 숙제 생성 (1크레딧 소진)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
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

      {/* 7. Homework Credit Packs Modal */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCreditModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                <Zap className="w-6 h-6 fill-amber-500 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  숙제 생성 크레딧 충전 (Credit Packs)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  검증된 AI 프롬프트 엔진 및 루브릭 생성 API 호출용 크레딧 충전
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {creditPacks.map((pack) => (
                <div
                  key={pack.id || pack.packId}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/20 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{pack.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px]">
                        +{pack.credits}회
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{pack.description}</p>
                    <div className="text-xs font-mono font-bold text-slate-800">
                      ${pack.priceUsd} USD <span className="text-slate-400 font-normal">({pack.priceKrw})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      rechargeHomeworkCredits(pack.credits);
                      setIsCreditModalOpen(false);
                      setTaskCreateMessage({ success: true, text: `${pack.name} (+${pack.credits}회) 충전이 완료되었습니다!` });
                      setTimeout(() => setTaskCreateMessage(null), 3000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-transform hover:scale-105 flex-shrink-0"
                  >
                    충전하기
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center">
              소속 기관 B2B 세금계산서 발행 및 단체 계약은 <strong className="text-slate-700">billing@hanup.edu</strong>로 문의하세요.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

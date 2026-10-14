/**
 * 🏫 UriBan (우리반) <-> HanUp (한업) Bi-directional Schema Adapter
 * Loosely Coupled Data Exchange & Corpus Synchronization
 */

import {
  ClassGroup,
  WritingSubmission,
  UriBanErrorCategory,
  UriBanErrorTag,
  GrammarFixItem,
} from '../../types/hanup';

// ==========================================
// 1. UriBan Native Schemas
// ==========================================

export interface UriBanClassItem {
  id: string;
  name: string;
  grade?: string;
}

export interface UriBanSchoolData {
  id: string;
  name: string;
  code: string;
  semesters: string[];
  classes: UriBanClassItem[];
}

export interface UriBanAppUser {
  uid: string;
  email: string;
  nameKr: string;
  role: 'student' | 'teacher' | 'admin';
  schoolId: string;
  semester?: string;
  classId?: string;
  researchConsent?: boolean;
  topikEnabled?: boolean;
  ocrEnabled?: boolean;
}

export interface UriBanAIFeedback {
  grammar: string;
  vocabulary: string;
  structure: string;
  positive: string;
  topikScore?: number;
  topikModelEssay?: string;
  errorTags: UriBanErrorTag[];
}

export interface UriBanSubmission {
  id: string;
  assignmentId: string;
  studentUid: string;
  studentName?: string;
  classId: string;
  content: string;
  contentType: 'topik53' | 'topik54' | 'freeWriting';
  charCount: number;
  pasteAttempts: number;
  activeDurationMs: number;
  totalDurationMs: number;
  handwritingImageUrl?: string;
  createdAt: string;
  feedback?: UriBanAIFeedback;
}

export interface UriBanSyncPackage {
  version: '1.0';
  exportedAt: string;
  source: 'uriban' | 'hanup';
  schools?: UriBanSchoolData[];
  users?: UriBanAppUser[];
  submissions: UriBanSubmission[];
}

// ==========================================
// 2. Conversion: UriBan -> HanUp
// ==========================================

export function uribanToHanUp(pkg: UriBanSyncPackage): {
  classes: ClassGroup[];
  submissions: WritingSubmission[];
} {
  const convertedClasses: ClassGroup[] = [];

  // Convert Schools & Classes
  if (pkg.schools) {
    pkg.schools.forEach((school) => {
      school.classes.forEach((cls) => {
        const studentUids = (pkg.users || [])
          .filter((u) => u.classId === cls.id && u.role === 'student')
          .map((u) => u.uid);

        convertedClasses.push({
          classId: `uriban_${cls.id}`,
          orgId: `org_${school.id}`,
          instructorId: 'usr_instructor_01',
          className: `[우리반] ${school.name} - ${cls.name}`,
          inviteCode: `UB${cls.id.slice(-4).toUpperCase() || '7788'}`,
          assignedSeriesIds: ['hanup_topik', 'hanup_vocab'],
          studentUids: studentUids.length > 0 ? studentUids : ['usr_student_01', 'usr_student_02'],
          averageTopikScore: 235,
          createdAt: pkg.exportedAt || new Date().toISOString(),
        });
      });
    });
  }

  // Convert Submissions
  const convertedSubmissions: WritingSubmission[] = pkg.submissions.map((item) => {
    // Map contentType to HanUp taskType
    const taskType: 'topik_53_graph' | 'topik_54_essay' =
      item.contentType === 'topik53' ? 'topik_53_graph' : 'topik_54_essay';

    // Map UriBan 8 error tags to HanUp grammar errors
    const grammarErrors: GrammarFixItem[] = (item.feedback?.errorTags || []).map((err) => ({
      original: err.original,
      corrected: err.correction,
      reasonZh: `[우리반 태그: ${err.category} (${err.severity})] ${err.explanation}`,
      reasonEn: `[UriBan Tag: ${err.category} (${err.severity})] ${err.explanation}`,
    }));

    // Find student info
    const matchedUser = (pkg.users || []).find((u) => u.uid === item.studentUid);
    const studentName = matchedUser?.nameKr || item.studentName || `우리반 학생 (${item.studentUid.slice(0, 6)})`;

    return {
      submissionId: `sub_ub_${item.id}`,
      uid: item.studentUid,
      studentName,
      orgId: 'org_hanup_hq',
      classId: `uriban_${item.classId}`,
      blockId: item.contentType === 'topik53' ? 'blk_topik_53_simulation' : 'blk_topik_54_writing_prompt',
      taskType,
      taskPromptTitle:
        item.contentType === 'topik53'
          ? '53번 도표 분석 (우리반 연동 과제)'
          : '54번 사회적 쟁점 논술 (우리반 연동 과제)',
      inputMethod: item.handwritingImageUrl ? 'handwriting_ocr' : 'keyboard_typing',
      rawOcrText: item.handwritingImageUrl ? item.content : undefined,
      researchConsent: matchedUser?.researchConsent !== false,
      consentedAt: item.createdAt,
      initialDraft: item.content,
      aiFeedback: {
        estimatedScore: item.feedback?.topikScore || Math.min(50, Math.round(item.charCount / 14)),
        estimatedLevel: (item.feedback?.topikScore || 0) >= 40 ? 5 : 4,
        grammarAndEndingErrors: grammarErrors,
        chineseTranslationToneFixes: [],
        rhetoricAndLogicComment:
          item.feedback?.structure ||
          item.feedback?.positive ||
          `우리반(UriBan) AI 분석 완료. 작성 소요시간: ${Math.round(item.activeDurationMs / 60000)}분, 붙여넣기 시도: ${item.pasteAttempts}회`,
        analyzedAt: item.createdAt,
      },
      instructorFeedback: {
        instructorId: 'usr_instructor_01',
        instructorName: '우리반 담임교사',
        approvedAiFeedback: true,
        teacherComment: item.feedback?.positive || '우리반 LMS에서 정밀 평가가 동기화되었습니다.',
        finalScore: item.feedback?.topikScore ?? Math.min(50, Math.round(item.charCount / 14)),
        reviewedAt: item.createdAt,
      },
      submittedAt: item.createdAt,
      uribanMeta: {
        assignmentId: item.assignmentId,
        activeDurationMs: item.activeDurationMs,
        totalDurationMs: item.totalDurationMs,
        pasteAttempts: item.pasteAttempts,
        errorTags: item.feedback?.errorTags || [],
      },
    };
  });

  return { classes: convertedClasses, submissions: convertedSubmissions };
}

// ==========================================
// 3. Conversion: HanUp -> UriBan
// ==========================================

export function hanUpToUriBan(
  classes: ClassGroup[],
  submissions: WritingSubmission[]
): UriBanSyncPackage {
  const uribanClasses: UriBanClassItem[] = classes.map((c) => ({
    id: c.classId.replace(/^uriban_/, ''),
    name: c.className.replace(/^\[우리반\]\s*/, ''),
  }));

  const schools: UriBanSchoolData[] = [
    {
      id: 'sch_hanup_hub',
      name: '한업 어학당 & 제휴 기관',
      code: 'HANUP2024',
      semesters: ['2024-Fall', '2025-Spring'],
      classes: uribanClasses,
    },
  ];

  const uribanSubmissions: UriBanSubmission[] = submissions.map((sub) => {
    const errorTags: UriBanErrorTag[] =
      sub.uribanMeta?.errorTags ||
      (sub.aiFeedback?.grammarAndEndingErrors || []).map((g) => ({
        category: '조사 오류' as UriBanErrorCategory,
        severity: 'moderate',
        original: g.original,
        correction: g.corrected,
        explanation: g.reasonZh || g.reasonEn || '',
      }));

    return {
      id: sub.submissionId.replace(/^sub_ub_/, ''),
      assignmentId: sub.uribanMeta?.assignmentId || 'asg_hanup_topik',
      studentUid: sub.uid,
      studentName: sub.studentName,
      classId: (sub.classId || 'cls_topik_01').replace(/^uriban_/, ''),
      content: sub.revisedDraft || sub.initialDraft,
      contentType: sub.taskType === 'topik_53_graph' ? 'topik53' : 'topik54',
      charCount: (sub.revisedDraft || sub.initialDraft).length,
      pasteAttempts: sub.uribanMeta?.pasteAttempts || 0,
      activeDurationMs: sub.uribanMeta?.activeDurationMs || 1200000,
      totalDurationMs: sub.uribanMeta?.totalDurationMs || 1500000,
      handwritingImageUrl: sub.inputMethod === 'handwriting_ocr' ? 'https://hanup.edu/ocr/scanned.jpg' : undefined,
      createdAt: sub.submittedAt,
      feedback: {
        grammar: `${errorTags.length}건의 문법·조사 교정 사항이 적용되었습니다.`,
        vocabulary: '학술 어휘 및 TOPIK 고급 한자어 적합도 평가 완료.',
        structure: sub.aiFeedback?.rhetoricAndLogicComment || '서론-본론-결론 3단 구조 양호',
        positive: sub.instructorFeedback?.teacherComment || '성실히 작성된 논술입니다.',
        topikScore: sub.instructorFeedback?.finalScore || sub.aiFeedback?.estimatedScore || 35,
        topikModelEssay: '오늘날 인공지능 기술은...',
        errorTags,
      },
    };
  });

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    source: 'hanup',
    schools,
    submissions: uribanSubmissions,
  };
}

// ==========================================
// 4. Sample UriBan Package Generator (One-Click Testing)
// ==========================================

export function generateSampleUriBanPackage(): UriBanSyncPackage {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    source: 'uriban',
    schools: [
      {
        id: 'sch_seoul_uni',
        name: '서울 글로벌 언어교육원',
        code: 'SGU2024',
        semesters: ['2024-2학기'],
        classes: [
          { id: 'cls_topik_adv_A', name: 'TOPIK 최고급 6급 대비반' },
          { id: 'cls_academic_B', name: '대학원 연구계획서 작문반' },
        ],
      },
    ],
    users: [
      {
        uid: 'usr_ub_st_01',
        email: 'chen.ming@uriban.edu',
        nameKr: '천밍 (陈明)',
        role: 'student',
        schoolId: 'sch_seoul_uni',
        classId: 'cls_topik_adv_A',
        researchConsent: true,
        topikEnabled: true,
        ocrEnabled: true,
      },
      {
        uid: 'usr_ub_st_02',
        email: 'pham.van@uriban.edu',
        nameKr: '팜반 (Pham Van)',
        role: 'student',
        schoolId: 'sch_seoul_uni',
        classId: 'cls_topik_adv_A',
        researchConsent: true,
        topikEnabled: true,
        ocrEnabled: true,
      },
    ],
    submissions: [
      {
        id: 'ub_sub_101',
        assignmentId: 'asg_ub_54_climate',
        studentUid: 'usr_ub_st_01',
        studentName: '천밍 (陈明)',
        classId: 'cls_topik_adv_A',
        content:
          '지구 온난화 문제는 전 인류가 직면한 심각한 위기이다. 이를 해결하기 위해 각국 정부는 탄소 배출 규제를 강화하고 친환경 에너지를 개발해야 한다. 무엇보다 개인의 실천이 가장 중요한 일이다.',
        contentType: 'topik54',
        charCount: 135,
        pasteAttempts: 3,
        activeDurationMs: 840000, // 14 mins
        totalDurationMs: 1020000,
        createdAt: '2024-10-14T09:30:00Z',
        feedback: {
          grammar: '조사 결합 및 평서문 종결어미가 대체로 우수합니다.',
          vocabulary: '"가장 중요한 일이다" 대신 "핵심 선결 과제이다"와 같은 고급 어휘를 사용하십시오.',
          structure: '도입과 대책은 잘 제시되었으나 본론의 구체적 사례가 1문장 부족합니다.',
          positive: '주제 적합도가 매우 높으며 문장 간 연결이 자연스럽습니다.',
          topikScore: 38,
          errorTags: [
            {
              category: '어휘 선택 오류',
              severity: 'moderate',
              original: '가장 중요한 일이다',
              correction: '핵심 선결 과제이다',
              explanation: '구어적 표현 "일" 대신 논술문 학술 표현 "선결 과제" 권장',
            },
            {
              category: '조사 오류',
              severity: 'minor',
              original: '인류가 직면한',
              correction: '인류에 직면한 / 인류가 직면한',
              explanation: '목적격 조사 또는 주격 조사 호응 정밀 검토',
            },
          ],
        },
      },
      {
        id: 'ub_sub_102',
        assignmentId: 'asg_ub_53_waste',
        studentUid: 'usr_ub_st_02',
        studentName: '팜반 (Pham Van)',
        classId: 'cls_topik_adv_A',
        content:
          '국내 플라스틱 재활용률은 2015년 40%에서 2023년 68%로 대폭 증가하였다. 이러한 원인은 분리배출 의무화와 친환경 포장재 도입에 기인한다.',
        contentType: 'topik53',
        charCount: 88,
        pasteAttempts: 0,
        activeDurationMs: 510000, // 8.5 mins
        totalDurationMs: 600000,
        createdAt: '2024-10-14T11:00:00Z',
        feedback: {
          grammar: '도표 기술 수식어와 조사 호응이 정확합니다.',
          vocabulary: '"기인한다"는 고급 한자어 표현을 탁월하게 활용했습니다.',
          structure: '증가 추이와 원인이 일목요연하게 2문장으로 정리되었습니다.',
          positive: '53번 도표 서술의 모범적인 간결성을 잘 보여줍니다.',
          topikScore: 28,
          errorTags: [
            {
              category: '조사 오류',
              severity: 'minor',
              original: '이러한 원인은',
              correction: '이러한 증가의 원인은',
              explanation: '선행 명사구 수식 누락 보완',
            },
          ],
        },
      },
    ],
  };
}

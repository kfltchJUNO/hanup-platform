'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Organization,
  AuthoringBlock,
  ItemBankQuestion,
  WritingSubmission,
  ROLE_DEFINITIONS,
  ClassGroup,
  PhonologyErrorLog,
  AiEducationSurveyResponse,
  HomeworkTask,
  HomeworkCreditPack,
  SeriesEnrollment,
  ChapterAccessStatus,
  UserNotificationSettings,
  BookCoverStyle,
} from '../types/hanup';
import {
  MOCK_USERS,
  MOCK_ORGS,
  MOCK_CLASSES,
  MOCK_AUTHORING_BLOCKS,
  MOCK_ITEM_BANK,
  MOCK_SUBMISSIONS,
  MOCK_PHONOLOGY_LOGS,
  MOCK_SURVEY_RESPONSES,
  MOCK_VETTED_TASKS,
  MOCK_CREDIT_PACKS,
} from '../mock/mockData';
import { SupportedLanguage } from '../lib/i18n';
import { getFirebaseAuth, logOut } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface HanUpContextType {
  // Role & Authentication State
  currentRole: UserRole;
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  currentOrg: Organization;
  organizations: Organization[];
  classes: ClassGroup[];

  // Firebase Google & Email Auth State
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  firebaseUser: FirebaseUser | null;
  isLoggedIn: boolean;
  handleLogout: () => Promise<void>;
  loginAsCustomUser: (userData: { email: string; name: string; targetLevel?: number }) => void;

  // 7 Background Variables Onboarding Modal
  isBackgroundModalOpen: boolean;
  openBackgroundModal: () => void;
  closeBackgroundModal: () => void;
  updateBackgroundVariables: (vars: Partial<UserProfile>) => void;

  // AI Education Survey (WTP & Needs Analysis)
  surveyResponses: AiEducationSurveyResponse[];
  submitSurveyResponse: (
    data: Omit<AiEducationSurveyResponse, 'responseId' | 'submittedAt'>
  ) => string;
  isSurveyModalOpen: boolean;
  openSurveyModal: () => void;
  closeSurveyModal: () => void;

  // UriBan & SoriTutor Multimodal Integration
  isUriBanEnabled: boolean;
  toggleUriBanEnabled: () => void;
  phonologyLogs: PhonologyErrorLog[];
  addPhonologyLog: (log: PhonologyErrorLog) => void;
  importUriBanPackage: (
    classes: ClassGroup[],
    submissions: WritingSubmission[]
  ) => { classesCount: number; submissionsCount: number };

  // App i18n
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  toggleLang: () => void;

  // Data Collections
  authoringBlocks: AuthoringBlock[];
  saveAuthoringBlock: (block: AuthoringBlock) => void;
  itemBank: ItemBankQuestion[];
  submissions: WritingSubmission[];
  addSubmission: (submission: WritingSubmission) => void;
  updateInstructorReview: (
    submissionId: string,
    teacherComment: string,
    finalScore: number,
    approvedAi: boolean
  ) => void;
  submitStudentRevision: (submissionId: string, revisedText: string) => void;

  // Homework Tasks & Lv.2/Lv.3 Credit Packs
  vettedTasks: HomeworkTask[];
  homeworkCredits: number;
  creditPacks: HomeworkCreditPack[];
  createCustomHomeworkTask: (
    taskData: Omit<HomeworkTask, 'id' | 'createdAt' | 'submissionsCount'>
  ) => { success: boolean; message: string };
  rechargeHomeworkCredits: (creditsToAdd: number) => void;

  // Paywall & Lemon Squeezy Checkout & Cross Benefits
  isPaywallModalOpen: boolean;
  openPaywallModal: () => void;
  closePaywallModal: () => void;
  unlockFullPack: () => void;
  unlockProPass: () => void;
  unlockSingleSeries: (seriesId: string) => void;
  appliedCoupon: string | null;
  couponDiscountPercent: number;
  applyCoupon: (code: string) => { valid: boolean; discountPercent: number; message: string };
  removeCoupon: () => void;
  hasSoriTutorSub: boolean;
  verifySoriTutorSubscription: () => void;

  // AI & OCR Rate Limiting (Daily Quota)
  getDailyQuotaRemaining: () => {
    remainingAiGrade: number;
    remainingOcr: number;
    isUnlimited: boolean;
  };
  consumeAiGradeQuota: () => boolean;
  consumeOcrQuota: () => boolean;

  // Study Tools: Vocab Bookmark & Solved Items
  savedVocabs: string[];
  toggleSaveVocab: (word: string) => void;
  isVocabSaved: (word: string) => boolean;
  solvedItemIds: string[];
  recordSolvedItem: (itemId: string) => void;

  // Legal Policies Modal (Refund, Terms, Privacy, Support)
  isLegalModalOpen: boolean;
  legalModalTab: 'refund' | 'terms' | 'privacy' | 'support';
  openLegalModal: (tab?: 'refund' | 'terms' | 'privacy' | 'support') => void;
  closeLegalModal: () => void;

  // Drip Release & Course Expiration
  enrollments: Record<string, SeriesEnrollment>;
  checkChapterAccess: (
    seriesId: string,
    chapterId: string,
    chapterIndex: number
  ) => ChapterAccessStatus;
  markChapterCompleted: (seriesId: string, chapterId: string) => void;

  // Push & Email Notifications
  notificationSettings: UserNotificationSettings;
  isNotificationModalOpen: boolean;
  openNotificationModal: () => void;
  closeNotificationModal: () => void;
  updateNotificationSettings: (newSettings: Partial<UserNotificationSettings>) => void;

  // Book Covers & Publishing Style Designer (Lv.4 Studio Integration)
  bookCoverStyles: Record<string, BookCoverStyle>;
  updateBookCoverStyle: (seriesId: string, updates: Partial<BookCoverStyle>) => void;
  getBookCoverStyle: (seriesId: string) => BookCoverStyle;
}

export const INITIAL_BOOK_COVERS: Record<string, BookCoverStyle> = {
  hanup_topik_prep: {
    seriesId: 'hanup_topik_prep',
    themeColor: '#10b981',
    layoutStyle: 'center',
    titleKo: '한업 TOPIK 준비편',
    titleZh: '韩升 TOPIK 准备篇 (1~2级)',
    subtitleKo: '듣기·읽기 기초 집중 훈련 & 기본 어휘 300선',
    targetLevelText: '1~2급 초급',
    spineText: '한업 TOPIK 준비편 (1~2급) • 기초',
    authorText: '한업 한국어교육연구소 기획·집필',
    publisherText: '도서출판 한업 (HanUp Publishing)',
    isbnCode: 'ISBN 979-11-98765-01-2',
    barcodePrice: '₩12,000 / $10.00',
    finishType: 'matte',
    showQrCode: true,
  },
  hanup_topik_challenge: {
    seriesId: 'hanup_topik_challenge',
    themeColor: '#2563eb',
    layoutStyle: 'top',
    titleKo: '한업 TOPIK 도전편',
    titleZh: '韩升 TOPIK 挑战篇 (3~4级)',
    subtitleKo: '빈출 유형 빠른 풀이 비법 & 고빈도 어휘',
    targetLevelText: '3~4급 중급',
    spineText: '한업 TOPIK 도전편 (3~4급) • 유형',
    authorText: '한업 한국어교육연구소 기획·집필',
    publisherText: '도서출판 한업 (HanUp Publishing)',
    isbnCode: 'ISBN 979-11-98765-02-9',
    barcodePrice: '₩18,000 / $16.00',
    finishType: 'glossy',
    showQrCode: true,
  },
  hanup_topik_master: {
    seriesId: 'hanup_topik_master',
    themeColor: '#4f46e5',
    layoutStyle: 'top',
    titleKo: '한업 TOPIK 완성편',
    titleZh: '韩升 TOPIK 强化完成篇 (4~6级)',
    subtitleKo: '쓰기 비중 강화 & 캠퍼스 학업 생존 TIP',
    targetLevelText: '4~6급 고급',
    spineText: '한업 TOPIK 완성편 (4~6급) • 심화',
    authorText: '한업 한국어교육연구소 기획·집필',
    publisherText: '도서출판 한업 (HanUp Publishing)',
    isbnCode: 'ISBN 979-11-98765-03-6',
    barcodePrice: '₩24,000 / $21.00',
    finishType: 'leather',
    showQrCode: true,
  },
  hanup_topik_53_formula: {
    seriesId: 'hanup_topik_53_formula',
    themeColor: '#0284c7',
    layoutStyle: 'left',
    titleKo: '쓰기 53번 만능 공식집',
    titleZh: 'TOPIK 53题万能公式集 & 120题',
    subtitleKo: '도표·자료 분석 300자 원고지 작성 템플릿',
    targetLevelText: '3~6급 공통',
    spineText: '쓰기 53번 만능 공식집 & 120제',
    authorText: '한업 한국어교육연구소 기획·집필',
    publisherText: '도서출판 한업 (HanUp Publishing)',
    isbnCode: 'ISBN 979-11-98765-04-3',
    barcodePrice: '₩11,000 / $9.90',
    finishType: 'matte',
    showQrCode: true,
  },
  hanup_life_step1: {
    seriesId: 'hanup_life_step1',
    themeColor: '#d97706',
    layoutStyle: 'center',
    titleKo: '생활한국어 Step 1: 첫걸음',
    titleZh: '生活韩国语 第一步: 零基础起步',
    subtitleKo: '한글 자모 40자 완전 정복 & 발음 클리닉',
    targetLevelText: '입문/왕초보',
    spineText: '생활한국어 Step 1: 첫걸음 • 자모 40자',
    authorText: '한업 한국어교육연구소 기획·집필',
    publisherText: '도서출판 한업 (HanUp Publishing)',
    isbnCode: 'ISBN 979-11-98765-05-0',
    barcodePrice: '₩10,000 / $8.00',
    finishType: 'matte',
    showQrCode: true,
  },
  hanup_life_step2: {
    seriesId: 'hanup_life_step2',
    themeColor: '#e11d48',
    layoutStyle: 'top',
    titleKo: '생활한국어 Step 2: 동네 한 바퀴',
    titleZh: '生活韩国语 第二步: 街区日常',
    subtitleKo: '카페·식당·교통 생존 생활 회화 12강',
    targetLevelText: '초급 회화',
    spineText: '생활한국어 Step 2: 동네 한 바퀴 • 일상',
    authorText: '한업 한국어교육연구소 기획·집필',
    publisherText: '도서출판 한업 (HanUp Publishing)',
    isbnCode: 'ISBN 979-11-98765-06-7',
    barcodePrice: '₩15,000 / $13.00',
    finishType: 'glossy',
    showQrCode: true,
  },
  hanup_life_step3: {
    seriesId: 'hanup_life_step3',
    themeColor: '#0d9488',
    layoutStyle: 'left',
    titleKo: '생활한국어 Step 3: 단짝 친구',
    titleZh: '生活韩国语 第三步: 知心好友',
    subtitleKo: '감정 표현·취미·자연스러운 스몰토크 12강',
    targetLevelText: '중급 회화',
    spineText: '생활한국어 Step 3: 단짝 친구 • 교우',
    authorText: '한업 한국어교육연구소 기획·집필',
    publisherText: '도서출판 한업 (HanUp Publishing)',
    isbnCode: 'ISBN 979-11-98765-07-4',
    barcodePrice: '₩16,000 / $14.00',
    finishType: 'matte',
    showQrCode: true,
  },
  hanup_life_step4: {
    seriesId: 'hanup_life_step4',
    themeColor: '#334155',
    layoutStyle: 'center',
    titleKo: '생활한국어 Step 4: 프로 한국살이',
    titleZh: '生活韩国语 第四步: 韩国职场生存',
    subtitleKo: '부동산·병원·공공기관 & 직장 비즈니스 18강',
    targetLevelText: '고급 실전',
    spineText: '생활한국어 Step 4: 프로 한국살이 • 비즈니스',
    authorText: '한업 한국어교육연구소 기획·집필',
    publisherText: '도서출판 한업 (HanUp Publishing)',
    isbnCode: 'ISBN 979-11-98765-08-1',
    barcodePrice: '₩20,000 / $17.50',
    finishType: 'leather',
    showQrCode: true,
  },
};

const HanUpContext = createContext<HanUpContextType | undefined>(undefined);

export const isMasterEmail = (email?: string): boolean => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return clean === 'ot.helper7@gmail.com' || clean === 'ot.helper7@gamil.com';
};

export function HanUpProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS.student);
  const [lang, setLang] = useState<SupportedLanguage>('ko');
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'refund' | 'terms' | 'privacy' | 'support'>('refund');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Book Covers & Publishing Style Designer (Lv.4 Studio Integration)
  const [bookCoverStyles, setBookCoverStyles] = useState<Record<string, BookCoverStyle>>(INITIAL_BOOK_COVERS);

  const updateBookCoverStyle = (seriesId: string, updates: Partial<BookCoverStyle>) => {
    setBookCoverStyles((prev) => {
      const current = prev[seriesId] || INITIAL_BOOK_COVERS[seriesId] || {
        seriesId,
        themeColor: '#10b981',
        layoutStyle: 'center' as const,
        titleKo: '한업 한국어',
        subtitleKo: '',
        targetLevelText: '',
        authorText: '한업 한국어교육연구소',
        publisherText: '도서출판 한업',
        isbnCode: 'ISBN 979-11-98765-00-5',
        barcodePrice: '₩14,000',
        finishType: 'matte' as const,
        showQrCode: true,
      };
      return {
        ...prev,
        [seriesId]: {
          ...current,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const getBookCoverStyle = (seriesId: string): BookCoverStyle => {
    return bookCoverStyles[seriesId] || INITIAL_BOOK_COVERS[seriesId] || {
      seriesId,
      themeColor: '#10b981',
      layoutStyle: 'center',
      titleKo: '한업 한국어',
      subtitleKo: '',
      targetLevelText: '',
      authorText: '한업 한국어교육연구소',
      publisherText: '도서출판 한업',
      isbnCode: 'ISBN 979-11-98765-00-5',
      barcodePrice: '₩14,000',
      finishType: 'matte',
      showQrCode: true,
    };
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsLoggedIn(true);
        const isMaster = isMasterEmail(user.email || '');
        setCurrentUser((prev) => ({
          ...prev,
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || (isMaster ? '한업 대표 관리자' : prev.name),
          email: user.email || prev.email,
          avatarUrl: user.photoURL || undefined,
          role: isMaster ? 'super_admin' : (prev.role === 'super_admin' ? 'student' : prev.role),
          homeworkCredits: isMaster ? 9999 : prev.homeworkCredits,
        }));
        if (isMaster) {
          setCurrentRole('super_admin');
        }
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLogout = async () => {
    await logOut();
    setFirebaseUser(null);
    setIsLoggedIn(false);
    setCurrentRole('student');
    setCurrentUser(MOCK_USERS.student);
  };

  const loginAsCustomUser = (userData: { email: string; name: string; targetLevel?: number }) => {
    setIsLoggedIn(true);
    const isMaster = isMasterEmail(userData.email);
    setCurrentUser((prev) => ({
      ...prev,
      uid: `user_${Date.now()}`,
      name: userData.name || (isMaster ? '한업 대표 관리자' : userData.email.split('@')[0]),
      email: userData.email,
      role: isMaster ? 'super_admin' : (prev.role === 'super_admin' ? 'student' : prev.role),
      targetTopikLevel: userData.targetLevel || prev.targetTopikLevel,
      homeworkCredits: isMaster ? 9999 : prev.homeworkCredits,
    }));
    if (isMaster) {
      setCurrentRole('super_admin');
    }
    closeAuthModal();
  };

  const openLegalModal = (tab: 'refund' | 'terms' | 'privacy' | 'support' = 'refund') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };
  const closeLegalModal = () => setIsLegalModalOpen(false);

  // Default Initial Enrollments (2X Duration Guarantee: 2-week course = 28 days valid, 4-week course = 60 days valid)
  const [enrollments, setEnrollments] = useState<Record<string, SeriesEnrollment>>({
    hanup_topik_prep: {
      seriesId: 'hanup_topik_prep',
      enrolledAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 26 * 86400000).toISOString(), // 28 days total (2 weeks * 2), 26 days remaining
      completedChapterIds: ['ch_prep_01'],
    },
    hanup_topik_challenge: {
      seriesId: 'hanup_topik_challenge',
      enrolledAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 55 * 86400000).toISOString(), // 60 days total (4 weeks * 2), 55 days remaining
      completedChapterIds: ['ch_writing_04'],
    },
  });

  // Notification Settings State (Push, Email, Marketing/Surprise Coupon Consent)
  const [notificationSettings, setNotificationSettings] = useState<UserNotificationSettings>({
    webPushEnabled: false,
    emailReminderEnabled: true,
    marketingConsent: true,
    studyReminderTime: '20:00',
    reminderDays: ['mon', 'wed', 'fri'],
  });

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const openNotificationModal = () => setIsNotificationModalOpen(true);
  const closeNotificationModal = () => setIsNotificationModalOpen(false);

  const updateNotificationSettings = (newSettings: Partial<UserNotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const getRequiredDripDay = (seriesId: string, index: number) => {
    if (index === 0) return 1;
    if (seriesId === 'hanup_topik_prep') {
      const schedule = [1, 3, 7, 10];
      return schedule[index] || index * 3 + 1;
    }
    return Math.floor(index * 2.3) + 1;
  };

  const checkChapterAccess = (
    seriesId: string,
    chapterId: string,
    chapterIndex: number
  ): ChapterAccessStatus => {
    if (isMasterEmail(currentUser.email) || currentRole === 'super_admin' || currentRole === 'instructor' || currentRole === 'org_admin') {
      return { chapterId, isUnlocked: true, isCompleted: true, daysRemainingInCourse: 999 };
    }

    const enrollment = enrollments[seriesId];
    if (!enrollment && seriesId !== 'hanup_topik_prep' && seriesId !== 'hanup_life_step1') {
      return { chapterId, isUnlocked: false, isCompleted: false, lockReason: 'unpurchased' };
    }

    const enrolledAt = enrollment ? new Date(enrollment.enrolledAt).getTime() : Date.now();
    // Default 2X validity period: 28 days for 2-week course, 60 days for 4-week course
    const defaultValidityDays = seriesId.includes('challenge') || seriesId.includes('master') ? 60 : 28;
    const expiresAt = enrollment ? new Date(enrollment.expiresAt).getTime() : Date.now() + defaultValidityDays * 86400000;
    const now = Date.now();

    // 1. Check Course Expiration (Sunset Policy)
    if (now > expiresAt) {
      return {
        chapterId,
        isUnlocked: false,
        isCompleted: false,
        lockReason: 'course_expired',
        daysRemainingInCourse: 0,
      };
    }

    const daysRemaining = Math.max(0, Math.ceil((expiresAt - now) / 86400000));
    const completedList = enrollment ? enrollment.completedChapterIds : [];
    const isCompleted = completedList.includes(chapterId);

    // First chapter is always unlocked
    if (chapterIndex === 0) {
      return { chapterId, isUnlocked: true, isCompleted, daysRemainingInCourse: daysRemaining };
    }

    // 2. Condition 1: Prerequisite Chapter Completed
    const hasCompletedPrereq = completedList.length >= chapterIndex;
    if (!hasCompletedPrereq) {
      return {
        chapterId,
        isUnlocked: false,
        isCompleted: false,
        lockReason: 'prerequisite_incomplete',
        daysRemainingInCourse: daysRemaining,
      };
    }

    // 3. Condition 2: Drip Release Date Reached
    const daysPassed = Math.floor((now - enrolledAt) / 86400000) + 1;
    const requiredDay = getRequiredDripDay(seriesId, chapterIndex);
    if (daysPassed < requiredDay) {
      const unlockDate = new Date(enrolledAt + (requiredDay - 1) * 86400000).toLocaleDateString('ko-KR');
      return {
        chapterId,
        isUnlocked: false,
        isCompleted: false,
        lockReason: 'drip_date_not_reached',
        unlockDate,
        daysRemainingInCourse: daysRemaining,
      };
    }

    return {
      chapterId,
      isUnlocked: true,
      isCompleted,
      daysRemainingInCourse: daysRemaining,
    };
  };

  const markChapterCompleted = (seriesId: string, chapterId: string) => {
    const defaultValidityDays = seriesId.includes('challenge') || seriesId.includes('master') ? 60 : 28;
    setEnrollments((prev) => {
      const existing = prev[seriesId] || {
        seriesId,
        enrolledAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + defaultValidityDays * 86400000).toISOString(),
        completedChapterIds: [],
      };
      if (existing.completedChapterIds.includes(chapterId)) return prev;
      return {
        ...prev,
        [seriesId]: {
          ...existing,
          completedChapterIds: [...existing.completedChapterIds, chapterId],
        },
      };
    });
  };

  // In-memory Master Stores
  const [organizations] = useState<Organization[]>(MOCK_ORGS);
  const [classes, setClasses] = useState<ClassGroup[]>(MOCK_CLASSES);
  const [authoringBlocks, setAuthoringBlocks] = useState<AuthoringBlock[]>(MOCK_AUTHORING_BLOCKS);
  const [itemBank] = useState<ItemBankQuestion[]>(MOCK_ITEM_BANK);
  const [submissions, setSubmissions] = useState<WritingSubmission[]>(MOCK_SUBMISSIONS);
  const [phonologyLogs, setPhonologyLogs] = useState<PhonologyErrorLog[]>(MOCK_PHONOLOGY_LOGS);

  // Background Onboarding Modal State
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const openBackgroundModal = () => setIsBackgroundModalOpen(true);
  const closeBackgroundModal = () => setIsBackgroundModalOpen(false);
  const updateBackgroundVariables = (vars: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...vars,
    }));
  };

  // AI Education Survey (WTP & Needs Analysis) State
  const [surveyResponses, setSurveyResponses] = useState<AiEducationSurveyResponse[]>(MOCK_SURVEY_RESPONSES);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const openSurveyModal = () => setIsSurveyModalOpen(true);
  const closeSurveyModal = () => setIsSurveyModalOpen(false);

  const submitSurveyResponse = (
    data: Omit<AiEducationSurveyResponse, 'responseId' | 'submittedAt'>
  ): string => {
    const couponCode = 'HANUP20WTP';
    const newResponse: AiEducationSurveyResponse = {
      ...data,
      responseId: `srv_res_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      discountCouponCode: couponCode,
    };
    setSurveyResponses((prev) => [newResponse, ...prev]);
    // Automatically apply 20% coupon
    setAppliedCoupon(couponCode);
    setCouponDiscountPercent(20);
    return couponCode;
  };

  // UriBan On-Demand Toggle State (default collapsed / false)
  const [isUriBanEnabled, setIsUriBanEnabled] = useState(false);
  const toggleUriBanEnabled = () => setIsUriBanEnabled((prev) => !prev);

  // Homework Tasks & Lv.2/Lv.3 Credit State
  const [vettedTasks, setVettedTasks] = useState<HomeworkTask[]>(MOCK_VETTED_TASKS);
  const [creditPacks] = useState<HomeworkCreditPack[]>(MOCK_CREDIT_PACKS);
  const homeworkCredits = currentUser.homeworkCredits ?? (currentUser.role === 'instructor' ? 10 : currentUser.role === 'org_admin' ? 50 : 0);

  const createCustomHomeworkTask = (
    taskData: Omit<HomeworkTask, 'id' | 'createdAt' | 'submissionsCount'>
  ) => {
    if (currentUser.role === 'student') {
      return { success: false, message: '학생 권한(Lv.1)은 과제를 임의 생성할 수 없습니다. 공식 검증 과제 또는 교사 배정 과제를 선택해 주세요.' };
    }
    if (homeworkCredits <= 0) {
      return { success: false, message: '숙제 AI 생성 크레딧이 부족합니다. 충전팩을 구매해 주세요.' };
    }
    const newTask: HomeworkTask = {
      ...taskData,
      id: `task_custom_${Date.now()}`,
      submissionsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setVettedTasks((prev) => [newTask, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      homeworkCredits: Math.max(0, (prev.homeworkCredits ?? 10) - 1),
    }));
    return { success: true, message: '맞춤형 AI 숙제가 성공적으로 발행되고 1 크레딧이 차감되었습니다.' };
  };

  const rechargeHomeworkCredits = (creditsToAdd: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      homeworkCredits: (prev.homeworkCredits ?? 0) + creditsToAdd,
    }));
  };

  // Lemon Squeezy Coupons & Sori Tutor Cross-Benefits
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const hasSoriTutorSub = Boolean(currentUser.hasSoriTutorSub);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'HANUP20WTP' || cleanCode === 'SORI20' || cleanCode === 'WELCOME20') {
      setAppliedCoupon(cleanCode);
      setCouponDiscountPercent(20);
      return { valid: true, discountPercent: 20, message: '20% 할인 쿠폰이 성공적으로 적용되었습니다!' };
    }
    return { valid: false, discountPercent: 0, message: '유효하지 않거나 만료된 쿠폰 코드입니다.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
  };

  const verifySoriTutorSubscription = () => {
    setCurrentUser((prev) => ({
      ...prev,
      hasSoriTutorSub: true,
      unlockedSeriesIds: Array.from(new Set([...(prev.unlockedSeriesIds || []), 'hanup_topik_prep', 'hanup_life_step1'])),
    }));
  };

  const unlockSingleSeries = (seriesId: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      unlockedSeriesIds: Array.from(new Set([...(prev.unlockedSeriesIds || []), seriesId])),
    }));
    const validDays = seriesId.includes('challenge') || seriesId.includes('master') ? 60 : 28;
    setEnrollments((prev) => ({
      ...prev,
      [seriesId]: {
        seriesId,
        enrolledAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + validDays * 86400000).toISOString(),
        completedChapterIds: [],
      },
    }));
  };

  // Sori Tutor Phonology Log & Radar sync
  const addPhonologyLog = (log: PhonologyErrorLog) => {
    setPhonologyLogs((prev) => [log, ...prev]);
    // Dynamically update current student radar score for listening & pronunciation inference
    setCurrentUser((prev) => {
      if (!prev.skillRadar) return prev;
      const updatedListening = Math.min(
        100,
        Math.max(40, Math.round(prev.skillRadar.listeningInference * 0.6 + log.score * 0.4))
      );
      return {
        ...prev,
        skillRadar: {
          ...prev.skillRadar,
          listeningInference: updatedListening,
        },
      };
    });
  };

  // UriBan Bi-directional Package Import
  const importUriBanPackage = (
    newClasses: ClassGroup[],
    newSubmissions: WritingSubmission[]
  ) => {
    setClasses((prev) => {
      const existingIds = new Set(prev.map((c) => c.classId));
      const toAdd = newClasses.filter((c) => !existingIds.has(c.classId));
      return [...prev, ...toAdd];
    });
    setSubmissions((prev) => {
      const existingIds = new Set(prev.map((s) => s.submissionId));
      const toAdd = newSubmissions.filter((s) => !existingIds.has(s.submissionId));
      return [...toAdd, ...prev];
    });
    return { classesCount: newClasses.length, submissionsCount: newSubmissions.length };
  };

  // Switch role handler (Lv.4 super_admin is strictly reserved for ot.helper7@gmail.com)
  const switchRole = (role: UserRole) => {
    if (role === 'super_admin' && !isMasterEmail(currentUser.email)) {
      alert('Lv.4(한업 본사 마스터)는 공식 관리자 계정(ot.helper7@gmail.com) 전용 권한입니다.');
      return;
    }
    setCurrentRole(role);
    if (MOCK_USERS[role]) {
      const template = MOCK_USERS[role];
      setCurrentUser((prev) => ({
        ...template,
        name: firebaseUser?.displayName || (isLoggedIn ? prev.name : template.name),
        email: firebaseUser?.email || (isLoggedIn ? prev.email : template.email),
        avatarUrl: firebaseUser?.photoURL || (isLoggedIn ? prev.avatarUrl : template.avatarUrl),
      }));
    }
  };

  const toggleLang = () => {
    const list: SupportedLanguage[] = ['ko', 'en', 'ja', 'zh', 'vi', 'my'];
    const nextIdx = (list.indexOf(lang) + 1) % list.length;
    setLang(list[nextIdx]);
  };

  // Find organization of current user
  const currentOrg =
    organizations.find((org) => org.orgId === currentUser.orgId) || organizations[0];

  // Save/Update authoring block (Lv.4 Studio)
  const saveAuthoringBlock = (block: AuthoringBlock) => {
    setAuthoringBlocks((prev) => {
      const existsIndex = prev.findIndex((b) => b.blockId === block.blockId);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = block;
        return updated;
      }
      return [block, ...prev];
    });
  };

  // Add submission (Student Draft)
  const addSubmission = (sub: WritingSubmission) => {
    setSubmissions((prev) => [sub, ...prev]);
  };

  // Instructor 2nd Review (Human-in-the-Loop)
  const updateInstructorReview = (
    submissionId: string,
    teacherComment: string,
    finalScore: number,
    approvedAi: boolean
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.submissionId === submissionId) {
          return {
            ...sub,
            instructorFeedback: {
              instructorId: currentUser.uid,
              instructorName: currentUser.name,
              approvedAiFeedback: approvedAi,
              teacherComment,
              finalScore,
              reviewedAt: new Date().toISOString(),
            },
          };
        }
        return sub;
      })
    );
  };

  // Student Revision Submission (Corpus Final Stage)
  const submitStudentRevision = (submissionId: string, revisedText: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.submissionId === submissionId) {
          return {
            ...sub,
            revisedDraft: revisedText,
            revisedAt: new Date().toISOString(),
          };
        }
        return sub;
      })
    );
  };

  // Paywall unlock mockup
  const openPaywallModal = () => setIsPaywallModalOpen(true);
  const closePaywallModal = () => setIsPaywallModalOpen(false);
  const unlockFullPack = () => {
    setCurrentUser((prev) => ({
      ...prev,
      subscriptionTier: 'clinic_pack',
    }));
    setIsPaywallModalOpen(false);
  };
  const unlockProPass = () => {
    setCurrentUser((prev) => ({
      ...prev,
      subscriptionTier: 'hanup_pro_pass',
    }));
    setIsPaywallModalOpen(false);
  };

  // AI & OCR Rate Limiting (Daily Quota)
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const getDailyQuotaRemaining = () => {
    const isFree = currentUser.subscriptionTier === 'free';
    if (!isFree) {
      return { remainingAiGrade: 999, remainingOcr: 999, isUnlimited: true };
    }
    const today = getTodayString();
    const isToday = currentUser.dailyUsage?.date === today;
    const aiCount = isToday ? currentUser.dailyUsage?.aiGradeCount || 0 : 0;
    const ocrCount = isToday ? currentUser.dailyUsage?.ocrCount || 0 : 0;

    return {
      remainingAiGrade: Math.max(0, 2 - aiCount),
      remainingOcr: Math.max(0, 2 - ocrCount),
      isUnlimited: false,
    };
  };

  const consumeAiGradeQuota = (): boolean => {
    const quota = getDailyQuotaRemaining();
    if (quota.isUnlimited) return true;

    if (quota.remainingAiGrade <= 0) {
      openPaywallModal();
      return false;
    }

    const today = getTodayString();
    setCurrentUser((prev) => {
      const isToday = prev.dailyUsage?.date === today;
      const currentAi = isToday ? prev.dailyUsage?.aiGradeCount || 0 : 0;
      const currentOcr = isToday ? prev.dailyUsage?.ocrCount || 0 : 0;
      return {
        ...prev,
        dailyUsage: {
          date: today,
          aiGradeCount: currentAi + 1,
          ocrCount: currentOcr,
        },
      };
    });
    return true;
  };

  const consumeOcrQuota = (): boolean => {
    const quota = getDailyQuotaRemaining();
    if (quota.isUnlimited) return true;

    if (quota.remainingOcr <= 0) {
      openPaywallModal();
      return false;
    }

    const today = getTodayString();
    setCurrentUser((prev) => {
      const isToday = prev.dailyUsage?.date === today;
      const currentAi = isToday ? prev.dailyUsage?.aiGradeCount || 0 : 0;
      const currentOcr = isToday ? prev.dailyUsage?.ocrCount || 0 : 0;
      return {
        ...prev,
        dailyUsage: {
          date: today,
          aiGradeCount: currentAi,
          ocrCount: currentOcr + 1,
        },
      };
    });
    return true;
  };

  // Vocab Bookmark State
  const [savedVocabs, setSavedVocabs] = useState<string[]>(['비약적(飛躍的)', '선결 과제(先決課題)']);
  const toggleSaveVocab = (word: string) => {
    setSavedVocabs((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };
  const isVocabSaved = (word: string) => savedVocabs.includes(word);

  // Clinic Solved Items
  const [solvedItemIds, setSolvedItemIds] = useState<string[]>([]);
  const recordSolvedItem = (itemId: string) => {
    setSolvedItemIds((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
  };

  return (
    <HanUpContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        currentOrg,
        organizations,
        classes,
        isBackgroundModalOpen,
        openBackgroundModal,
        closeBackgroundModal,
        updateBackgroundVariables,
        surveyResponses,
        submitSurveyResponse,
        isSurveyModalOpen,
        openSurveyModal,
        closeSurveyModal,
        isUriBanEnabled,
        toggleUriBanEnabled,
        phonologyLogs,
        addPhonologyLog,
        importUriBanPackage,
        lang,
        setLang,
        toggleLang,
        authoringBlocks,
        saveAuthoringBlock,
        itemBank,
        submissions,
        addSubmission,
        updateInstructorReview,
        submitStudentRevision,
        vettedTasks,
        homeworkCredits,
        creditPacks,
        createCustomHomeworkTask,
        rechargeHomeworkCredits,
        isPaywallModalOpen,
        openPaywallModal,
        closePaywallModal,
        unlockFullPack,
        unlockProPass,
        unlockSingleSeries,
        appliedCoupon,
        couponDiscountPercent,
        applyCoupon,
        removeCoupon,
        hasSoriTutorSub,
        verifySoriTutorSubscription,
        getDailyQuotaRemaining,
        consumeAiGradeQuota,
        consumeOcrQuota,
        savedVocabs,
        toggleSaveVocab,
        isVocabSaved,
        solvedItemIds,
        recordSolvedItem,
        isLegalModalOpen,
        legalModalTab,
        openLegalModal,
        closeLegalModal,
        enrollments,
        checkChapterAccess,
        markChapterCompleted,
        notificationSettings,
        isNotificationModalOpen,
        openNotificationModal,
        closeNotificationModal,
        updateNotificationSettings,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        firebaseUser,
        isLoggedIn,
        handleLogout,
        loginAsCustomUser,
        bookCoverStyles,
        updateBookCoverStyle,
        getBookCoverStyle,
      }}
    >
      {children}
    </HanUpContext.Provider>
  );
}

export function useHanUp() {
  const context = useContext(HanUpContext);
  if (!context) {
    throw new Error('useHanUp must be used within a HanUpProvider');
  }
  return context;
}

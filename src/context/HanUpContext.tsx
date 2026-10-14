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
} from '../types/hanup';
import {
  MOCK_USERS,
  MOCK_ORGS,
  MOCK_CLASSES,
  MOCK_AUTHORING_BLOCKS,
  MOCK_ITEM_BANK,
  MOCK_SUBMISSIONS,
  MOCK_PHONOLOGY_LOGS,
} from '../mock/mockData';
import { SupportedLanguage } from '../lib/i18n';

interface HanUpContextType {
  // Role & Authentication State
  currentRole: UserRole;
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  currentOrg: Organization;
  organizations: Organization[];
  classes: ClassGroup[];

  // UriBan & SoriTutor Multimodal Integration
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

  // Paywall & Subscription helper
  isPaywallModalOpen: boolean;
  openPaywallModal: () => void;
  closePaywallModal: () => void;
  unlockFullPack: () => void;
  unlockProPass: () => void;

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
}

const HanUpContext = createContext<HanUpContextType | undefined>(undefined);

export function HanUpProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS.student);
  const [lang, setLang] = useState<SupportedLanguage>('ko');
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);

  // In-memory Master Stores
  const [organizations] = useState<Organization[]>(MOCK_ORGS);
  const [classes, setClasses] = useState<ClassGroup[]>(MOCK_CLASSES);
  const [authoringBlocks, setAuthoringBlocks] = useState<AuthoringBlock[]>(MOCK_AUTHORING_BLOCKS);
  const [itemBank] = useState<ItemBankQuestion[]>(MOCK_ITEM_BANK);
  const [submissions, setSubmissions] = useState<WritingSubmission[]>(MOCK_SUBMISSIONS);
  const [phonologyLogs, setPhonologyLogs] = useState<PhonologyErrorLog[]>(MOCK_PHONOLOGY_LOGS);

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

  // Switch role handler
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (MOCK_USERS[role]) {
      setCurrentUser(MOCK_USERS[role]);
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
        isPaywallModalOpen,
        openPaywallModal,
        closePaywallModal,
        unlockFullPack,
        unlockProPass,
        getDailyQuotaRemaining,
        consumeAiGradeQuota,
        consumeOcrQuota,
        savedVocabs,
        toggleSaveVocab,
        isVocabSaved,
        solvedItemIds,
        recordSolvedItem,
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

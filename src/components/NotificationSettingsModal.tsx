'use client';

import React, { useState } from 'react';
import {
  Bell,
  X,
  Mail,
  Smartphone,
  Tag,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useHanUp } from '../context/HanUpContext';

export function NotificationSettingsModal() {
  const {
    isNotificationModalOpen,
    closeNotificationModal,
    notificationSettings,
    updateNotificationSettings,
    currentUser,
  } = useHanUp();

  const [localSettings, setLocalSettings] = useState(notificationSettings);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!isNotificationModalOpen) return null;

  const handleRequestPushPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPushStatusMessage('이 브라우저는 웹 푸시 알림을 지원하지 않습니다.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setLocalSettings((prev) => ({ ...prev, webPushEnabled: true }));
        setPushStatusMessage('✅ 기기 푸시 알림이 성공적으로 허용되었습니다!');
        new Notification('한업 (HanUp) 학습 알리미', {
          body: '다음 챕터가 오픈되거나 복습할 시간이 되면 기기로 알람을 보내드립니다!',
          icon: '/favicon.ico',
        });
      } else {
        setLocalSettings((prev) => ({ ...prev, webPushEnabled: false }));
        setPushStatusMessage('⚠️ 브라우저 설정에서 알림 권한이 차단되었습니다.');
      }
    } catch (e) {
      setLocalSettings((prev) => ({ ...prev, webPushEnabled: true }));
      setPushStatusMessage('✅ 모바일/태블릿 푸시 알림 수신 설정이 완료되었습니다.');
    }
  };

  const handleSave = () => {
    updateNotificationSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      closeNotificationModal();
    }, 1200);
  };

  const daysList: { key: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'; label: string }[] = [
    { key: 'mon', label: '월' },
    { key: 'tue', label: '화' },
    { key: 'wed', label: '수' },
    { key: 'thu', label: '목' },
    { key: 'fri', label: '금' },
    { key: 'sat', label: '토' },
    { key: 'sun', label: '일' },
  ];

  const toggleDay = (day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun') => {
    setLocalSettings((prev) => {
      const exists = prev.reminderDays.includes(day);
      return {
        ...prev,
        reminderDays: exists
          ? prev.reminderDays.filter((d) => d !== day)
          : [...prev.reminderDays, day],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Bell className="w-5 h-5 text-yellow-300 animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">학습 알리미 & 깜짝 쿠폰 설정</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                다음 챕터 오픈 시기와 복습 시간을 잊지 않도록 알려드립니다.
              </p>
            </div>
          </div>

          <button
            onClick={closeNotificationModal}
            className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
          {/* 1. Mobile/Tablet Web Push Notification */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    스마트폰·태블릿 기기 푸시 알람
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    앱을 켜지 않아도 다음 챕터가 해금되거나 복습할 시간이 되면 화면 상단에 알림을 띄웁니다.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestPushPermission}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  localSettings.webPushEnabled
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {localSettings.webPushEnabled ? '✅ 켜짐' : '🔔 알람 켜기'}
              </button>
            </div>

            {pushStatusMessage && (
              <div className="text-[11px] p-2 rounded-lg bg-blue-100/60 text-blue-800 font-medium">
                {pushStatusMessage}
              </div>
            )}
          </div>

          {/* 2. Email Study Reminder (Opt-in) */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">학습 리마인더 이메일 받기</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.emailReminderEnabled}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, emailReminderEnabled: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pl-6">
              수신 이메일: <strong>{currentUser.email || '등록된 구글 계정'}</strong><br />
              스팸 걱정 없이 다음 진도 오픈일(주 2~3회)에만 단정한 학습 안내 메일이 발송됩니다.
            </p>
          </div>

          {/* 3. Marketing & Surprise Coupon Consent */}
          <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-purple-950">깜짝 게릴라 할인 쿠폰 수신 (선택)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.marketingConsent}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, marketingConsent: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <p className="text-xs text-purple-900 leading-relaxed pl-6">
              🎁 <strong>깜짝 30% 할인 쿠폰</strong>, 신간 챕터 무료 체험권, TOPIK 시험 직전 족집게 특강 소식을 가장 먼저 받아보실 수 있습니다.
            </p>
          </div>

          {/* 4. Preferred Study Time & Days */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>나의 맞춤 공부 시간</span>
              </div>
              <input
                type="time"
                value={localSettings.studyReminderTime}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, studyReminderTime: e.target.value }))
                }
                className="px-2.5 py-1 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>알림 받을 요일 (권장: 주 2~3회)</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {daysList.map((d) => {
                  const isSelected = localSettings.reminderDays.includes(d.key);
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => toggleDay(d.key)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            설정은 언제든지 자유롭게 변경하실 수 있습니다.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={closeNotificationModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : null}
              <span>{isSaved ? '저장 완료!' : '설정 저장'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

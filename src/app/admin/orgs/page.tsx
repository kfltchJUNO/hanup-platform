'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  Palette,
  ExternalLink,
  Plus,
  CheckCircle,
  CreditCard,
  Settings,
  X,
  Save,
  Check,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useHanUp } from '../../../context/HanUpContext';
import { Organization } from '../../../types/hanup';

export default function OrganizationsManagementPage() {
  const { organizations, currentOrg } = useHanUp();

  // Local state for interactive editing of orgs
  const [orgList, setOrgList] = useState<Organization[]>(organizations);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  // Form states for modal
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState('#2563eb');
  const [formSubdomain, setFormSubdomain] = useState('');
  const [formSeats, setFormSeats] = useState(200);

  const handleOpenEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormName(org.orgName);
    setFormColor(org.customBranding?.primaryColor || '#2563eb');
    setFormSubdomain(org.customBranding?.subdomain || 'app');
    setFormSeats(org.maxStudentSeats);
  };

  const handleSaveOrg = () => {
    if (!editingOrg) return;
    const updated = orgList.map((o) => {
      if (o.orgId === editingOrg.orgId) {
        return {
          ...o,
          orgName: formName,
          maxStudentSeats: formSeats,
          customBranding: {
            logoUrl: o.customBranding?.logoUrl || '',
            primaryColor: formColor,
            subdomain: formSubdomain,
          },
        };
      }
      return o;
    });

    setOrgList(updated);
    setEditingOrg(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const colorPresets = ['#2563eb', '#059669', '#7c3aed', '#dc2626', '#d97706', '#0f172a'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-black mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Lv.3 Org Admin / B2B Multi-Tenancy Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            어학원 및 파트너 기관 화이트라벨링 & 시트 관리
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            기관별 독립 데이터 격리(orgId)와 브랜드 커스텀 로고, 메인 테마 컬러, 학생 좌석 수(Seats)를 원클릭으로 커스터마이징합니다.
          </p>
        </div>

        <button
          onClick={() => {
            const newId = `org_new_${Date.now()}`;
            const newOrg: Organization = {
              orgId: newId,
              orgName: '신규 제휴 한국어학원',
              orgType: 'academy',
              planTier: 'academy_biz',
              maxStudentSeats: 100,
              usedStudentSeats: 12,
              customBranding: {
                logoUrl: '',
                primaryColor: '#059669',
                subdomain: 'new-academy',
              },
              licensedSeriesIds: ['hanup_topik', 'hanup_vocab'],
              createdAt: new Date().toISOString(),
            };
            setOrgList([...orgList, newOrg]);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>신규 어학원 파트너 등록</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>기관 화이트라벨링 및 시트 설정이 성공적으로 저장 및 적용되었습니다!</span>
        </div>
      )}

      {/* 2. Organizations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orgList.map((org) => {
          const isCurrent = org.orgId === currentOrg.orgId;
          const usagePercent = Math.min(
            100,
            Math.round((org.usedStudentSeats / org.maxStudentSeats) * 100)
          );

          return (
            <div
              key={org.orgId}
              className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between space-y-5 ${
                isCurrent
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                  : 'border-slate-200/90 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                    {org.planTier.replace('_', ' ')}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      현재 접속 기관
                    </span>
                  )}
                </div>

                <h3 className="font-black text-slate-900 text-base">{org.orgName}</h3>
                <p className="font-mono text-slate-400 text-[11px] mt-0.5">orgId: {org.orgId}</p>

                {/* Seat Usage Bar */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">학생 좌석(Seats) 사용률:</span>
                    <span className="font-bold text-slate-900">
                      {org.usedStudentSeats} / {org.maxStudentSeats}석 ({usagePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${usagePercent}%`,
                        backgroundColor: org.customBranding?.primaryColor || '#2563eb',
                      }}
                    />
                  </div>
                </div>

                {/* White-labeling Info */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-slate-400" />
                    <span>브랜드 컬러:</span>
                    <span
                      className="inline-block w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                      style={{ backgroundColor: org.customBranding?.primaryColor || '#2563eb' }}
                    />
                    <span className="font-mono text-slate-800 font-semibold">
                      {org.customBranding?.primaryColor || '#2563eb'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>전용 도메인:</span>
                    <span className="font-mono text-blue-600 font-bold">
                      {org.customBranding?.subdomain ? `${org.customBranding.subdomain}.hanup.ai` : 'app.hanup.ai'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  라이선스: {org.licensedSeriesIds.length}개 시리즈
                </span>
                <button
                  onClick={() => handleOpenEdit(org)}
                  className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>화이트라벨링 설정 →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. White-labeling Configuration Modal */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingOrg(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                White-labeling Customizer
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                [{editingOrg.orgName}] 화이트라벨링 설정
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Org Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">어학원 / 기관 공식 명칭:</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>

              {/* Subdomain */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">전용 분양 서브도메인:</label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden px-3 py-2 bg-slate-50">
                  <input
                    type="text"
                    value={formSubdomain}
                    onChange={(e) => setFormSubdomain(e.target.value)}
                    className="w-full bg-transparent focus:outline-none font-mono text-slate-800 font-bold"
                  />
                  <span className="text-slate-400 font-mono">.hanup.ai</span>
                </div>
              </div>

              {/* Brand Primary Color */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">학원 브랜드 메인 컬러 (Primary):</label>
                <div className="flex items-center gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        formColor === color ? 'scale-110 border-slate-900 ring-2 ring-blue-500/30' : 'border-white'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-24 px-2 py-1 text-center font-mono font-bold text-slate-800 border border-slate-200 rounded-lg ml-2"
                  />
                </div>
              </div>

              {/* Max Student Seats */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">학생 시트(Seats) 할당 한도:</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={formSeats}
                    onChange={(e) => setFormSeats(Number(e.target.value))}
                    className="w-32 px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-500">석 (현재 사용: {editingOrg.usedStudentSeats}석)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingOrg(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveOrg}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
              >
                <Save className="w-3.5 h-3.5" />
                <span>화이트라벨링 설정 저장</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

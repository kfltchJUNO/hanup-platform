'use client';

import React from 'react';
import { AudiencePersona } from '../../types/trackB';
import { Users, ShieldAlert, HeartHandshake, CheckCircle2, Target } from 'lucide-react';

interface AudienceCardSelectorProps {
  audiencePool: AudiencePersona[];
  selectedAudience: AudiencePersona | null;
  onSelectAudience: (audience: AudiencePersona) => void;
  disabled?: boolean;
}

export const AudienceCardSelector: React.FC<AudienceCardSelectorProps> = ({
  audiencePool,
  selectedAudience,
  onSelectAudience,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>페렐만 청중 설정 (Target Audience Persona)</span>
        </div>
        <span className="text-xs text-slate-500">
          논증을 전개할 대상 청중을 선택하십시오 (동의 유도 목표)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {audiencePool.map((aud) => {
          const isSelected = selectedAudience?.id === aud.id;

          return (
            <div
              key={aud.id}
              onClick={() => {
                if (!disabled) onSelectAudience(aud);
              }}
              className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              } ${disabled ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-indigo-600">
                  <CheckCircle2 className="w-5 h-5 fill-indigo-600 text-white" />
                </div>
              )}

              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs">
                    <Target className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{aud.role}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {aud.biasTendency}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-200/60 flex items-start gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-950 block text-[11px]">핵심 가치 (Value):</strong>
                      <span className="text-emerald-800 text-[11px] leading-tight">
                        {aud.coreValue}
                      </span>
                    </div>
                  </div>

                  <div className="bg-rose-50 text-rose-900 p-2 rounded-xl border border-rose-200/60 flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-950 block text-[11px]">거부감·뇌관 요인:</strong>
                      <span className="text-rose-800 text-[11px] leading-tight">
                        {aud.frictionFactor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isSelected ? '선택된 청중' : '청중 선택'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

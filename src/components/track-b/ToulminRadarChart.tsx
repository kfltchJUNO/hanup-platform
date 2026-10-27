'use client';

import React from 'react';
import { ToulminScores, ToulminElement, TOULMIN_ELEMENT_METAS } from '../../types/trackB';
import { Target, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface ToulminRadarChartProps {
  scores: ToulminScores;
  missingElements?: string[];
  audienceFitFeedback?: string;
}

export const ToulminRadarChart: React.FC<ToulminRadarChartProps> = ({
  scores,
  missingElements = [],
  audienceFitFeedback,
}) => {
  const elements: { key: keyof ToulminScores; code: ToulminElement; label: string }[] = [
    { key: 'claim', code: 'C', label: '주장(C)' },
    { key: 'data', code: 'D', label: '자료(D)' },
    { key: 'warrant', code: 'W', label: '정당화(W)' },
    { key: 'backing', code: 'B', label: '뒷받침(B)' },
    { key: 'qualifier', code: 'Q', label: '조건(Q)' },
    { key: 'rebuttal', code: 'R', label: '반론(R)' },
  ];

  const totalScore = Math.round(
    (scores.claim + scores.data + scores.warrant + scores.backing + scores.qualifier + scores.rebuttal) / 6
  );

  // SVG Radar Chart Math
  const size = 240;
  const center = size / 2;
  const radius = 80;
  const angleStep = (Math.PI * 2) / elements.length;

  const points = elements.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const val = (scores[item.key] || 0) / 100;
    const r = radius * val;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  });

  const polygonPath = points.join(' ');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-blue-100 text-blue-700 rounded-xl">
            <Target className="w-4 h-4" />
          </span>
          <h3 className="font-black text-sm text-slate-900">
            툴민 6요소 논증 성숙도 진단 (Radar)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-black">종합 지수: {totalScore}점</span>
        </div>
      </div>

      {/* Visual Canvas: SVG Radar + Horizontal Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SVG Radar */}
        <div className="flex justify-center relative">
          <svg width={size} height={size} className="overflow-visible">
            {/* Background Rings */}
            {[0.25, 0.5, 0.75, 1.0].map((level) => {
              const ringPoints = elements
                .map((_, i) => {
                  const angle = i * angleStep - Math.PI / 2;
                  const r = radius * level;
                  return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={level}
                  points={ringPoints}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={level < 1 ? '2,2' : undefined}
                />
              );
            })}

            {/* Axis Lines */}
            {elements.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x2 = center + radius * Math.cos(angle);
              const y2 = center + radius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x2}
                  y2={y2}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled Score Polygon */}
            <polygon
              points={polygonPath}
              fill="rgba(59, 130, 246, 0.25)"
              stroke="#2563eb"
              strokeWidth="2.5"
            />

            {/* Labels */}
            {elements.map((item, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const labelRadius = radius + 22;
              const lx = center + labelRadius * Math.cos(angle);
              const ly = center + labelRadius * Math.sin(angle);
              const scoreVal = scores[item.key] || 0;

              return (
                <text
                  key={i}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[10px] font-bold fill-slate-700"
                >
                  {item.label} ({scoreVal})
                </text>
              );
            })}
          </svg>
        </div>

        {/* Dimension Bars */}
        <div className="space-y-2">
          {elements.map((item) => {
            const meta = TOULMIN_ELEMENT_METAS[item.code];
            const scoreVal = scores[item.key] || 0;
            return (
              <div key={item.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded text-[9px] font-black flex items-center justify-center ${meta.colorClass.badge}`}>
                      {item.code}
                    </span>
                    <span className="font-bold text-slate-800">{meta.nameKo}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {scoreVal}점
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      scoreVal >= 70
                        ? 'bg-blue-600'
                        : scoreVal >= 40
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${scoreVal}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audience Fit Feedback Box */}
      {audienceFitFeedback && (
        <div className="p-3 bg-indigo-50 border border-indigo-200/80 rounded-2xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>청중 가치관 부합도 (Audience Fit):</span>
          </div>
          <p className="text-indigo-900 leading-relaxed font-sans pl-5">
            {audienceFitFeedback}
          </p>
        </div>
      )}

      {/* Missing Elements Prescriptive Guide */}
      {missingElements && missingElements.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>보완 처방 가이드:</span>
          </div>
          <ul className="space-y-1 pl-5 text-amber-900">
            {missingElements.map((msg, i) => (
              <li key={i} className="list-disc">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

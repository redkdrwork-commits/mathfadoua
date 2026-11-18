import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Film,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { VIDEO_EPISODES } from '../data/curriculumData';
import { ModuleId, VideoEpisode, VideoEpisodeId } from '../types/curriculum';
import { MathExpr } from './MathText';

const SvgFrac: React.FC<{
  x: number;
  y: number;
  num: string;
  den: string;
  width?: number;
  textClass?: string;
  lineColor?: string;
}> = ({
  x,
  y,
  num,
  den,
  width = 24,
  textClass = 'fill-slate-900 text-[10px] font-bold font-math',
  lineColor = '#0f172a',
}) => (
  <g>
    <text x={x} y={y - 4} textAnchor="middle" className={textClass}>
      {num}
    </text>
    <line x1={x - width / 2} y1={y - 1} x2={x + width / 2} y2={y - 1} stroke={lineColor} strokeWidth="1.4" />
    <text x={x} y={y + 10} textAnchor="middle" className={textClass}>
      {den}
    </text>
  </g>
);

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t, 0, 1);

const AnimatedStage: React.FC<{ episodeId: VideoEpisodeId; progress: number }> = ({
  episodeId,
  progress,
}) => {
  if (episodeId === 'thales-shapes') {
    const tInside = clamp((progress - 15) / 30, 0, 1);
    const tMorph = clamp((progress - 50) / 30, 0, 1);
    const k = progress < 50 ? lerp(0.38, 0.65, tInside) : lerp(0.65, -0.58, tMorph);
    const Ax = 210, Ay = 112, Bx = 110, By = 228, Cx = 310, Cy = 228;
    const Mx = Ax + k * (Bx - Ax);
    const My = Ay + k * (By - Ay);
    const Nx = Ax + k * (Cx - Ax);
    const Ny = Ay + k * (Cy - Ay);
    const ratioAbs = Math.abs(k).toFixed(2);
    const isButterfly = k < 0;

    return (
      <svg viewBox="0 0 420 260" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك لحالتي المثلث والفراشة">
        <line x1="70" y1="274" x2="290" y2="19" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="350" y1="274" x2="130" y2="19" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="#e0f2fe" fillOpacity="0.65" stroke="#0f172a" strokeWidth="2.2" />
        <polygon
          points={`${Ax},${Ay} ${Mx},${My} ${Nx},${Ny}`}
          fill={isButterfly ? '#fde68a' : '#bae6fd'}
          fillOpacity="0.72"
          stroke={isButterfly ? '#d97706' : '#0284c7'}
          strokeWidth="2.4"
        />
        <line x1={Mx} y1={My} x2={Nx} y2={Ny} stroke={isButterfly ? '#d97706' : '#0284c7'} strokeWidth="3.4" />
        <line x1={Bx} y1={By} x2={Cx} y2={Cy} stroke="#0f172a" strokeWidth="3" />
        <circle cx={Ax} cy={Ay} r="4.5" fill="#0f172a" />
        <circle cx={Bx} cy={By} r="4" fill="#0f172a" />
        <circle cx={Cx} cy={Cy} r="4" fill="#0f172a" />
        <circle cx={Mx} cy={My} r="5" fill={isButterfly ? '#d97706' : '#0284c7'} />
        <circle cx={Nx} cy={Ny} r="5" fill={isButterfly ? '#d97706' : '#0284c7'} />
        <text x={Ax + 14} y={Ay + 4} className="fill-slate-900 text-[13px] font-bold font-math">A</text>
        <text x={Bx - 16} y={By + 5} className="fill-slate-900 text-[13px] font-bold font-math">B</text>
        <text x={Cx + 10} y={Cy + 5} className="fill-slate-900 text-[13px] font-bold font-math">C</text>
        <text x={Mx - 16} y={My + 4} className={`${isButterfly ? 'fill-amber-800' : 'fill-sky-800'} text-[13px] font-bold font-math`}>M</text>
        <text x={Nx + 10} y={Ny + 4} className={`${isButterfly ? 'fill-amber-800' : 'fill-sky-800'} text-[13px] font-bold font-math`}>N</text>
        <rect x="14" y="14" width="166" height="66" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1.4" />
        <text x="97" y="33" textAnchor="middle" className="fill-slate-800 text-[11px] font-bold">
          {isButterfly ? 'حالة الفراشة' : 'حالة المثلث'}
        </text>
        <SvgFrac x={45} y={56} num="AM" den="AB" width={24} textClass="fill-sky-700 text-[10px] font-bold font-math" lineColor="#0369a1" />
        <text x={68} y={58} textAnchor="middle" className="fill-sky-700 text-[11px] font-bold font-math">=</text>
        <SvgFrac x={91} y={56} num="AN" den="AC" width={24} textClass="fill-sky-700 text-[10px] font-bold font-math" lineColor="#0369a1" />
        <text x={115} y={58} textAnchor="middle" className="fill-sky-700 text-[11px] font-bold font-math">=</text>
        <text x={144} y={58} textAnchor="middle" className="fill-sky-700 text-[11px] font-bold font-math">{ratioAbs}</text>
      </svg>
    );
  }

  if (episodeId === 'thales-converse') {
    const isDeviated = progress >= 60;
    const tDev = clamp((progress - 60) / 20, 0, 1);
    const nyY = isDeviated ? lerp(104, 148, tDev) : 104;
    const nxX = isDeviated ? lerp(255, 281, tDev) : 255;

    return (
      <svg viewBox="0 0 420 260" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك لطالس العكسية ونفي التوازي">
        <polygon points="210,32 100,224 320,224" fill={isDeviated ? '#fef2f2' : '#ecfdf5'} fillOpacity="0.65" stroke="#0f172a" strokeWidth="2.2" />
        <line x1="168" y1="104" x2="255" y2="104" stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="4 4" />
        <line x1="168" y1="104" x2={nxX} y2={nyY} stroke={isDeviated ? '#dc2626' : '#059669'} strokeWidth="3.4" />
        <circle cx="210" cy="32" r="4" fill="#0f172a" />
        <circle cx="100" cy="224" r="4" fill="#0f172a" />
        <circle cx="320" cy="224" r="4" fill="#0f172a" />
        <circle cx="168" cy="104" r="4.8" fill={isDeviated ? '#dc2626' : '#059669'} />
        <circle cx={nxX} cy={nyY} r="4.8" fill={isDeviated ? '#dc2626' : '#059669'} />
        <text x="210" y="20" textAnchor="middle" className="fill-slate-900 text-[13px] font-bold font-math">A</text>
        <text x="86" y="232" className="fill-slate-900 text-[13px] font-bold font-math">B</text>
        <text x="328" y="232" className="fill-slate-900 text-[13px] font-bold font-math">C</text>
        <text x="152" y="106" className="fill-slate-800 text-[13px] font-bold font-math">M</text>
        <text x={nxX + 12} y={nyY + 4} className="fill-slate-800 text-[13px] font-bold font-math">N</text>
        <rect x="14" y="14" width="170" height="66" rx="8" fill="#ffffff" stroke={isDeviated ? '#ef4444' : '#10b981'} strokeWidth="1.6" />
        <text x="99" y="33" textAnchor="middle" className={`${isDeviated ? 'fill-red-700' : 'fill-emerald-700'} text-[11px] font-bold`}>
          {isDeviated ? 'انحراف: غير متوازيين' : 'تساوي: توازي محقق'}
        </text>
        {isDeviated ? (
          <>
            <SvgFrac x={74} y={56} num="2" den="6" width={16} textClass="fill-red-700 text-[10px] font-bold font-math" lineColor="#b91c1c" />
            <text x={99} y={58} textAnchor="middle" className="fill-red-700 text-[11px] font-bold font-math">≠</text>
            <SvgFrac x={124} y={56} num="5" den="11" width={18} textClass="fill-red-700 text-[10px] font-bold font-math" lineColor="#b91c1c" />
          </>
        ) : (
          <>
            <SvgFrac x={54} y={56} num="2" den="6" width={16} textClass="fill-emerald-800 text-[10px] font-bold font-math" lineColor="#065f46" />
            <text x={74} y={58} textAnchor="middle" className="fill-emerald-800 text-[11px] font-bold font-math">=</text>
            <SvgFrac x={94} y={56} num="3" den="9" width={16} textClass="fill-emerald-800 text-[10px] font-bold font-math" lineColor="#065f46" />
            <text x={114} y={58} textAnchor="middle" className="fill-emerald-800 text-[11px] font-bold font-math">=</text>
            <SvgFrac x={134} y={56} num="1" den="3" width={16} textClass="fill-emerald-800 text-[10px] font-bold font-math" lineColor="#065f46" />
          </>
        )}
      </svg>
    );
  }

  if (episodeId === 'thales-shadow') {
    const rayProgress = clamp(progress / 65, 0, 1);
    const poleRayX2 = lerp(128, 74, rayProgress);
    const poleRayY2 = lerp(155, 208, rayProgress);
    const bldgRayX2 = lerp(290, 175, rayProgress);
    const bldgRayY2 = lerp(48, 208, rayProgress);

    return (
      <svg viewBox="0 0 420 250" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك لارتفاع البناية بالظل">
        <circle cx="52" cy="40" r="20" fill="#fde047" stroke="#d97706" strokeWidth="2.2" />
        <line x1="20" y1="208" x2="400" y2="208" stroke="#334155" strokeWidth="2.5" />
        <rect x="290" y="48" width="52" height="160" fill="#e0f2fe" stroke="#0f172a" strokeWidth="2" />
        <line x1="128" y1="155" x2="128" y2="208" stroke="#0284c7" strokeWidth="4.2" />
        <line x1="128" y1="155" x2={poleRayX2} y2={poleRayY2} stroke="#d97706" strokeWidth="2.2" strokeDasharray="5 4" />
        <line x1="290" y1="48" x2={bldgRayX2} y2={bldgRayY2} stroke="#d97706" strokeWidth="2.2" strokeDasharray="5 4" />
        {rayProgress > 0.85 && (
          <>
            <line x1="74" y1="208" x2="128" y2="208" stroke="#0284c7" strokeWidth="5.5" />
            <line x1="175" y1="208" x2="290" y2="208" stroke="#0f172a" strokeWidth="5.5" />
          </>
        )}
        <text x="135" y="185" className="fill-sky-700 text-[12px] font-bold font-math">2 m</text>
        <text x="101" y="226" textAnchor="middle" className="fill-sky-700 text-[11px] font-bold font-math">3 m</text>
        <text x="232" y="226" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold font-math">30 m</text>
        <text x="354" y="130" className="fill-emerald-700 text-[13px] font-bold font-math">
          {progress > 70 ? 'h = 20 m' : 'h = ?'}
        </text>
      </svg>
    );
  }

  if (episodeId === 'thales-division') {
    const tRay = clamp(progress / 33, 0, 1);
    const tPar = clamp((progress - 33) / 35, 0, 1);
    const Ax = 70, Ay = 75, Bx = 340, By = 75;
    const C1x = 125, C1y = 115;
    const C2x = 180, C2y = 155;
    const C3x = 235, C3y = 195;
    const Mx = Ax + (2 / 3) * (Bx - Ax); // 250

    return (
      <svg viewBox="0 0 420 250" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك لتقسيم قطعة مستقيم هندسياً">
        {/* Segment AB */}
        <line x1={Ax} y1={Ay} x2={Bx} y2={By} stroke="#0f172a" strokeWidth="3.2" />
        <circle cx={Ax} cy={Ay} r="4.5" fill="#0f172a" />
        <circle cx={Bx} cy={By} r="4.5" fill="#0f172a" />
        <text x={Ax - 14} y={Ay + 4} className="fill-slate-900 text-[13px] font-bold font-math">A</text>
        <text x={Bx + 10} y={By + 4} className="fill-slate-900 text-[13px] font-bold font-math">B</text>

        {/* Half-line from A */}
        <line
          x1={Ax}
          y1={Ay}
          x2={lerp(Ax, 275, tRay)}
          y2={lerp(Ay, 224, tRay)}
          stroke="#4338ca"
          strokeWidth="2.2"
        />

        {/* Compass Arcs C1, C2, C3 */}
        {progress >= 10 && (
          <>
            <circle cx={C1x} cy={C1y} r="4" fill="#4338ca" />
            <path d={`M ${C1x - 10} ${C1y + 6} A 14 14 0 0 0 ${C1x + 8} ${C1y - 8}`} fill="none" stroke="#6366f1" strokeWidth="1.6" />
            <text x={C1x - 18} y={C1y + 14} className="fill-indigo-800 text-[11px] font-bold font-math">C₁</text>
          </>
        )}
        {progress >= 20 && (
          <>
            <circle cx={C2x} cy={C2y} r="4.5" fill="#0284c7" />
            <path d={`M ${C2x - 10} ${C2y + 6} A 14 14 0 0 0 ${C2x + 8} ${C2y - 8}`} fill="none" stroke="#0284c7" strokeWidth="1.6" />
            <text x={C2x - 18} y={C2y + 14} className="fill-sky-800 text-[11px] font-bold font-math">C₂</text>
          </>
        )}
        {progress >= 30 && (
          <>
            <circle cx={C3x} cy={C3y} r="4" fill="#4338ca" />
            <path d={`M ${C3x - 10} ${C3y + 6} A 14 14 0 0 0 ${C3x + 8} ${C3y - 8}`} fill="none" stroke="#6366f1" strokeWidth="1.6" />
            <text x={C3x - 18} y={C3y + 14} className="fill-indigo-800 text-[11px] font-bold font-math">C₃</text>
          </>
        )}

        {/* Segment C3 -> B */}
        {progress >= 33 && (
          <line
            x1={C3x}
            y1={C3y}
            x2={lerp(C3x, Bx, clamp(tPar * 1.5, 0, 1))}
            y2={lerp(C3y, By, clamp(tPar * 1.5, 0, 1))}
            stroke="#0f172a"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        )}

        {/* Parallel from C2 -> M */}
        {progress >= 55 && (
          <line
            x1={C2x}
            y1={C2y}
            x2={lerp(C2x, Mx, clamp((progress - 55) / 20, 0, 1))}
            y2={lerp(C2y, By, clamp((progress - 55) / 20, 0, 1))}
            stroke="#059669"
            strokeWidth="2.8"
          />
        )}

        {/* Point M */}
        {progress >= 75 && (
          <>
            <circle cx={Mx} cy={By} r="5.5" fill="#059669" />
            <text x={Mx - 24} y={By - 18} textAnchor="end" className="fill-emerald-800 text-[13px] font-bold font-math">
              M =
            </text>
            <SvgFrac x={Mx - 4} y={By - 20} num="2" den="3" width={16} textClass="fill-emerald-800 text-[11px] font-bold font-math" lineColor="#065f46" />
            <text x={Mx + 12} y={By - 18} textAnchor="start" className="fill-emerald-800 text-[13px] font-bold font-math">
              AB
            </text>
          </>
        )}
      </svg>
    );
  }

  if (episodeId === 'pgcd-euclid') {
    const step = progress < 28 ? 1 : progress < 58 ? 2 : 3;
    return (
      <svg viewBox="0 0 420 250" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك لخوارزمية إقليدس">
        <text x="30" y="38" className="fill-slate-900 text-[12px] font-bold font-math">561 = 231 × 2 + 99</text>
        <rect x="30" y="48" width="148" height="24" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
        <rect x="180" y="48" width="148" height="24" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
        <rect x="330" y="48" width="64" height="24" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
        <text x="104" y="64" textAnchor="middle" className="fill-sky-900 text-[11px] font-bold font-math">231</text>
        <text x="254" y="64" textAnchor="middle" className="fill-sky-900 text-[11px] font-bold font-math">231</text>
        <text x="362" y="64" textAnchor="middle" className="fill-amber-900 text-[11px] font-bold font-math">99</text>

        <g opacity={step >= 2 ? 1 : 0.25}>
          <text x="30" y="106" className="fill-slate-900 text-[12px] font-bold font-math">231 = 99 × 2 + 33</text>
          <rect x="30" y="116" width="110" height="24" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
          <rect x="142" y="116" width="110" height="24" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
          <rect x="254" y="116" width="42" height="24" rx="4" fill="#a7f3d0" stroke="#059669" strokeWidth="2.2" />
          <text x="85" y="132" textAnchor="middle" className="fill-amber-900 text-[11px] font-bold font-math">99</text>
          <text x="197" y="132" textAnchor="middle" className="fill-amber-900 text-[11px] font-bold font-math">99</text>
          <text x="275" y="132" textAnchor="middle" className="fill-emerald-900 text-[11px] font-bold font-math">33</text>
        </g>

        <g opacity={step >= 3 ? 1 : 0.25}>
          <text x="30" y="174" className="fill-emerald-800 text-[12px] font-bold font-math">99 = 33 × 3 + 0  ⟹  PGCD = 33</text>
          <rect x="30" y="184" width="60" height="24" rx="4" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" />
          <rect x="92" y="184" width="60" height="24" rx="4" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" />
          <rect x="154" y="184" width="60" height="24" rx="4" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" />
          <SvgFrac x={265} y={196} num="561" den="231" width={28} textClass="fill-indigo-800 text-[12px] font-bold font-math" lineColor="#3730a3" />
          <text x={294} y={198} textAnchor="middle" className="fill-indigo-800 text-[13px] font-bold font-math">=</text>
          <SvgFrac x={320} y={196} num="17" den="7" width={22} textClass="fill-indigo-800 text-[12px] font-bold font-math" lineColor="#3730a3" />
        </g>
      </svg>
    );
  }

  if (episodeId === 'roots-tricks') {
    const phase = progress < 35 ? 1 : progress < 70 ? 2 : 3;
    return (
      <svg viewBox="0 0 420 250" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك لتبسيط الجذور التربيعية">
        <rect x="20" y="20" width="115" height="82" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.6" />
        <text x="77" y="42" textAnchor="middle" className="fill-slate-900 text-[13px] font-bold font-math">√27</text>
        <text x="77" y="64" textAnchor="middle" className="fill-slate-700 text-[11px] font-math">√(9 × 3)</text>
        <text x="77" y="88" textAnchor="middle" className="fill-sky-800 text-[13px] font-bold font-math">{phase >= 2 ? '3√3' : '?'}</text>

        <rect x="152" y="20" width="115" height="82" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.6" />
        <text x="210" y="42" textAnchor="middle" className="fill-slate-900 text-[13px] font-bold font-math">√75</text>
        <text x="210" y="64" textAnchor="middle" className="fill-slate-700 text-[11px] font-math">√(25 × 3)</text>
        <text x="210" y="88" textAnchor="middle" className="fill-sky-800 text-[13px] font-bold font-math">{phase >= 2 ? '5√3' : '?'}</text>

        <rect x="284" y="20" width="115" height="82" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.6" />
        <text x="342" y="42" textAnchor="middle" className="fill-slate-900 text-[13px] font-bold font-math">√147</text>
        <text x="342" y="64" textAnchor="middle" className="fill-slate-700 text-[11px] font-math">√(49 × 3)</text>
        <text x="342" y="88" textAnchor="middle" className="fill-sky-800 text-[13px] font-bold font-math">{phase >= 2 ? '7√3' : '?'}</text>

        <rect
          x="20"
          y="128"
          width="379"
          height="95"
          rx="10"
          fill={phase === 3 ? '#fee2e2' : '#d1fae5'}
          stroke={phase === 3 ? '#dc2626' : '#059669'}
          strokeWidth="1.8"
        />
        {phase === 3 ? (
          <>
            <text x="210" y="156" textAnchor="middle" className="fill-red-800 text-[13px] font-bold">تنبيه: الجذر لا يتوزع على الجمع!</text>
            <text x="210" y="182" textAnchor="middle" className="fill-slate-900 text-[13px] font-bold font-math">
              √(9 + 16) = √25 = 5   ≠   √9 + √16 = 3 + 4 = 7
            </text>
            <text x="210" y="206" textAnchor="middle" className="fill-red-700 text-[11px] font-bold">مسموح فقط في الضرب والقسمة</text>
          </>
        ) : (
          <>
            <text x="210" y="158" textAnchor="middle" className="fill-emerald-950 text-[13px] font-bold">تبسيط العبارة E</text>
            <text x="210" y="186" textAnchor="middle" className="fill-slate-900 text-[13px] font-bold font-math">
              4(3√3) + 2(5√3) - 4(7√3) = -6√3
            </text>
          </>
        )}
      </svg>
    );
  }

  if (episodeId === 'roots-conjugate') {
    const phase = progress < 33 ? 1 : progress < 68 ? 2 : 3;
    return (
      <svg viewBox="0 0 420 250" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك لتنطيق المقام بالمرافق">
        <rect x="24" y="20" width="372" height="66" rx="10" fill="#eef2ff" stroke="#4338ca" strokeWidth="1.6" />
        {phase === 1 ? (
          <>
            <SvgFrac x={125} y={53} num="5" den="2 + √3" width={54} textClass="fill-indigo-950 text-[14px] font-bold font-math" lineColor="#1e1b4b" />
            <text x={182} y={55} textAnchor="middle" className="fill-indigo-950 text-[16px] font-bold font-math">×</text>
            <SvgFrac x={252} y={53} num="2 - √3" den="2 - √3" width={64} textClass="fill-indigo-950 text-[14px] font-bold font-math" lineColor="#1e1b4b" />
          </>
        ) : phase === 2 ? (
          <SvgFrac x={210} y={53} num="5(2 - √3)" den="2² - (√3)²" width={92} textClass="fill-indigo-950 text-[14px] font-bold font-math" lineColor="#1e1b4b" />
        ) : (
          <>
            <SvgFrac x={155} y={53} num="5(2 - √3)" den="4 - 3" width={84} textClass="fill-indigo-950 text-[14px] font-bold font-math" lineColor="#1e1b4b" />
            <text x={258} y={56} textAnchor="middle" className="fill-indigo-950 text-[16px] font-bold font-math">= 10 - 5√3</text>
          </>
        )}

        <rect x="24" y="106" width="176" height="114" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="1.6" />
        <text x="112" y="134" textAnchor="middle" className="fill-emerald-900 text-[12px] font-bold">المقام (فرق مربعين)</text>
        <text x="112" y="166" textAnchor="middle" className="fill-slate-900 text-[13px] font-bold font-math">
          2² - (√3)² = 4 - 3
        </text>
        <text x="112" y="196" textAnchor="middle" className="fill-emerald-700 text-[15px] font-bold font-math">
          {phase >= 2 ? '= 1 (عدد ناطق!)' : '...'}
        </text>

        <rect x="220" y="106" width="176" height="114" rx="10" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.6" />
        <text x="308" y="134" textAnchor="middle" className="fill-sky-900 text-[12px] font-bold">البسط (النشر)</text>
        <text x="308" y="166" textAnchor="middle" className="fill-slate-900 text-[13px] font-bold font-math">
          5 × (2 - √3)
        </text>
        <text x="308" y="196" textAnchor="middle" className="fill-sky-700 text-[15px] font-bold font-math">
          {phase === 3 ? '= 10 - 5√3' : '...'}
        </text>
      </svg>
    );
  }

  if (episodeId === 'pythagoras-squares') {
    const phase = progress < 38 ? 1 : progress < 72 ? 2 : 3;
    const tCombine = clamp((progress - 30) / 30, 0, 1);

    if (phase === 3) {
      return (
        <svg viewBox="0 0 420 260" className="w-full h-full max-h-[300px]" aria-label="الخاصية العكسية لفيثاغورس">
          <rect x="18" y="20" width="182" height="214" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="1.8" />
          <text x="109" y="46" textAnchor="middle" className="fill-emerald-900 text-[12px] font-bold">RST: مثلث قائم في R</text>
          <polygon points="56,162 162,162 56,90" fill="#ffffff" stroke="#059669" strokeWidth="2.4" />
          <polyline points="56,148 70,148 70,162" fill="none" stroke="#059669" strokeWidth="2" />
          <text x="109" y="192" textAnchor="middle" className="fill-emerald-800 text-[11px] font-bold font-math">15² = 225</text>
          <text x="109" y="212" textAnchor="middle" className="fill-emerald-700 text-[11px] font-bold font-math">4.2² + 14.4² = 225 ✓</text>

          <rect x="220" y="20" width="182" height="214" rx="10" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.8" />
          <text x="311" y="46" textAnchor="middle" className="fill-red-900 text-[12px] font-bold">LMN: مثلث غير قائم</text>
          <polygon points="242,162 380,162 284,104" fill="#ffffff" stroke="#dc2626" strokeWidth="2.4" />
          <text x="311" y="192" textAnchor="middle" className="fill-red-800 text-[11px] font-bold font-math">9² = 81</text>
          <text x="311" y="212" textAnchor="middle" className="fill-red-700 text-[11px] font-bold font-math">6² + 4.5² = 56.25 ✗</text>
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 420 260" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك لمبرهنة فيثاغورس والمربعات">
        {/* Square on AB (bottom: side = 80) */}
        <rect x="135" y="160" width="80" height="72" rx="4" fill="#bae6fd" fillOpacity={lerp(0.85, 0.55, tCombine)} stroke="#0284c7" strokeWidth="2" />
        <text x="175" y="196" textAnchor="middle" className="fill-sky-900 text-[12px] font-bold font-math">AB² = 16</text>

        {/* Square on AC (left: side = 60) */}
        <rect x="75" y="100" width="60" height="60" rx="4" fill="#fde68a" fillOpacity={lerp(0.85, 0.55, tCombine)} stroke="#d97706" strokeWidth="2" />
        <text x="105" y="134" textAnchor="middle" className="fill-amber-900 text-[11px] font-bold font-math">AC² = 9</text>

        {/* Square on BC (hypotenuse) */}
        <polygon
          points="135,100 215,160 275,80 195,20"
          fill="#99f6e4"
          fillOpacity={lerp(0.25, 0.85, tCombine)}
          stroke="#0d9488"
          strokeWidth={phase === 2 ? 2.8 : 1.8}
        />
        <text x="206" y="88" textAnchor="middle" className="fill-teal-950 text-[12px] font-bold font-math">
          {phase === 2 ? 'BC² = 9 + 16 = 25' : 'BC² = ?'}
        </text>

        {/* Right Triangle ABC */}
        <polygon points="135,160 215,160 135,100" fill="#ffffff" stroke="#0f172a" strokeWidth="2.6" />
        <polyline points="135,146 149,146 149,160" fill="none" stroke="#0f172a" strokeWidth="2" />
        <text x="123" y="172" className="fill-slate-900 text-[13px] font-bold font-math">A</text>
        <text x="223" y="172" className="fill-sky-800 text-[13px] font-bold font-math">B</text>
        <text x="123" y="96" className="fill-amber-800 text-[13px] font-bold font-math">C</text>

        <rect x="292" y="150" width="114" height="72" rx="8" fill="#ffffff" stroke="#0d9488" strokeWidth="1.6" />
        <text x="349" y="174" textAnchor="middle" className="fill-teal-900 text-[11px] font-bold">خاصية فيثاغورس</text>
        <text x="349" y="196" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold font-math">AB² + AC² = BC²</text>
        <text x="349" y="213" textAnchor="middle" className="fill-teal-700 text-[11px] font-bold font-math">BC = √25 = 5</text>
      </svg>
    );
  }

  if (episodeId === 'algebra-factor') {
    const phase = progress < 35 ? 1 : progress < 70 ? 2 : 3;
    return (
      <svg viewBox="0 0 420 250" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك للتحليل واستخراج العامل المشترك">
        <rect x="22" y="24" width="376" height="60" rx="10" fill="#fff1f2" stroke="#e11d48" strokeWidth="1.6" />
        <text x="210" y="60" textAnchor="middle" className="fill-rose-950 text-[14px] font-bold font-math">
          F = (2x - 1) + (5 - 3x)(2x - 1)
        </text>

        <rect x="22" y="106" width="376" height="112" rx="10" fill="#ffffff" stroke="#0284c7" strokeWidth="1.6" />
        <text x="210" y="136" textAnchor="middle" className="fill-slate-800 text-[12px] font-bold">
          {phase === 1
            ? 'الخطوة 1: إظهار الرقم (1) المضروب في القوس الأول'
            : phase === 2
            ? 'الخطوة 2: استخراج (2x - 1) كعامل مشترك'
            : 'الخطوة 3: التبسيط داخل العاكفتين'}
        </text>
        <text x="210" y="176" textAnchor="middle" className="fill-sky-800 text-[15px] font-bold font-math">
          {phase === 1
            ? 'F = (2x - 1)×1 + (5 - 3x)(2x - 1)'
            : phase === 2
            ? 'F = (2x - 1) [ 1 + (5 - 3x) ]'
            : 'F = (2x - 1)(-3x + 6)'}
        </text>
      </svg>
    );
  }

  // trig-sohcahtoa
  const phase = progress < 33 ? 1 : progress < 68 ? 2 : 3;
  return (
    <svg viewBox="0 0 420 250" className="w-full h-full max-h-[300px]" aria-label="فيديو متحرك للنسب المثلثية">
      <polygon points="80,200 80,52 330,200" fill="#fef3c7" fillOpacity="0.45" stroke="#0f172a" strokeWidth="2.2" />
      <polyline points="80,184 96,184 96,200" fill="none" stroke="#0f172a" strokeWidth="1.8" />
      <line x1="80" y1="52" x2="330" y2="200" stroke={phase === 1 ? '#059669' : '#0f172a'} strokeWidth={phase === 1 ? 4.5 : 2.2} />
      <line x1="80" y1="52" x2="80" y2="200" stroke={phase === 2 ? '#d97706' : '#0f172a'} strokeWidth={phase === 2 ? 4.5 : 2.2} />
      <line x1="80" y1="200" x2="330" y2="200" stroke={phase >= 2 ? '#0284c7' : '#0f172a'} strokeWidth={phase >= 2 ? 4.5 : 2.2} />
      <path d="M286,200 A44,44 0 0,1 293,177" fill="none" stroke="#0284c7" strokeWidth="2.8" />
      <text x="275" y="190" className="fill-sky-700 text-[13px] font-bold font-math">B̂</text>
      <text x="68" y="210" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
      <text x="68" y="48" className="fill-slate-900 text-[12px] font-bold font-math">C</text>
      <text x="342" y="206" className="fill-sky-700 text-[12px] font-bold font-math">B</text>
      <text x="225" y="106" className="fill-emerald-700 text-[12px] font-bold">الوتر (BC)</text>
      <text x="66" y="130" textAnchor="end" className="fill-amber-700 text-[12px] font-bold">المقابل</text>
      <text x="205" y="224" textAnchor="middle" className="fill-sky-700 text-[12px] font-bold">المجاور (AB)</text>
      {phase === 3 ? (
        <text x="308" y="48" textAnchor="middle" className="fill-slate-900 text-[12px] font-bold font-math">
          cos²B̂ + sin²B̂ = 1
        </text>
      ) : (
        <g>
          <text x="208" y="46" textAnchor="end" className="fill-slate-900 text-[11px] font-bold font-math">sin =</text>
          <SvgFrac x={232} y={44} num="مقابل" den="وتر" width={30} textClass="fill-amber-800 text-[10px] font-bold" lineColor="#92400e" />
          <text x="262" y="46" textAnchor="middle" className="fill-slate-400 text-[12px]">|</text>
          <text x="310" y="46" textAnchor="end" className="fill-slate-900 text-[11px] font-bold font-math">cos =</text>
          <SvgFrac x={335} y={44} num="مجاور" den="وتر" width={32} textClass="fill-sky-800 text-[10px] font-bold" lineColor="#075985" />
        </g>
      )}
    </svg>
  );
};

interface MiniVideoPlayerProps {
  initialEpisodeId?: VideoEpisodeId;
  onJumpToLesson?: (moduleId: ModuleId) => void;
}

export const MiniVideoPlayer: React.FC<MiniVideoPlayerProps> = ({
  initialEpisodeId = 'thales-shapes',
  onJumpToLesson,
}) => {
  const [selectedId, setSelectedId] = useState<VideoEpisodeId>(initialEpisodeId);
  const [moduleFilter, setModuleFilter] = useState<'all' | ModuleId>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(14);
  const [speed, setSpeed] = useState<number>(1);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setSelectedId(initialEpisodeId);
    setProgress(5);
    setIsPlaying(true);
  }, [initialEpisodeId]);

  const episode: VideoEpisode =
    VIDEO_EPISODES.find((ep) => ep.id === selectedId) || VIDEO_EPISODES[0];

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    let rafId: number;
    const tick = (now: number) => {
      if (lastTimeRef.current !== null) {
        const dtSec = (now - lastTimeRef.current) / 1000;
        const deltaPct = (dtSec * speed * 100) / episode.durationSec;
        setProgress((prev) => {
          const next = prev + deltaPct;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, speed, episode.durationSec]);

  const currentSceneIndex = Math.max(
    0,
    episode.scenes.findIndex((s) => progress >= s.startPct && progress <= s.endPct)
  );
  const currentScene = episode.scenes[currentSceneIndex] || episode.scenes[0];

  const handleSelectEpisode = (id: VideoEpisodeId) => {
    setSelectedId(id);
    setProgress(0);
    setIsPlaying(true);
  };

  const jumpToScene = (idx: number) => {
    const safeIdx = clamp(idx, 0, episode.scenes.length - 1);
    setProgress(episode.scenes[safeIdx].startPct + 1);
  };

  const filteredEpisodes =
    moduleFilter === 'all'
      ? VIDEO_EPISODES
      : VIDEO_EPISODES.filter((ep) => ep.moduleId === moduleFilter);

  return (
    <section className="py-8 space-y-8">
      {/* Page Header + Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-indigo-700 mb-1">
            استوديو الفيديوهات التعليمية المتحركة
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            شروحات متحركة للحالات والأمثلة والحيل الهندسية والحسابية
          </h2>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'الكل (10)' },
            { id: 'thales', label: 'طالس المباشرة' },
            { id: 'thales-converse', label: 'طالس العكسية' },
            { id: 'pythagoras', label: 'فيثاغورس' },
            { id: 'pgcd', label: 'PGCD' },
            { id: 'roots', label: 'الجذور' },
            { id: 'trigonometry', label: 'المثلثات' },
            { id: 'algebra', label: 'الحساب الحرفي' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setModuleFilter(f.id as 'all' | ModuleId)}
              className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                moduleFilter === f.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Right Sidebar Episode List + Left Active Video Theater */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Column (in RTL): Video Playlist Sidebar */}
        <aside className="lg:col-span-4 space-y-2.5">
          <p className="text-xs font-bold text-slate-500 px-1">
            اختر المقطع التوضيحي ({filteredEpisodes.length})
          </p>
          {filteredEpisodes.map((ep, idx) => {
            const active = ep.id === selectedId;
            return (
              <button
                key={ep.id}
                onClick={() => handleSelectEpisode(ep.id)}
                className={`w-full text-right rounded-xl border p-4 transition-all ${
                  active
                    ? 'bg-indigo-50/80 border-indigo-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs mb-1">
                  <span className={active ? 'font-bold text-indigo-700' : 'font-semibold text-sky-700'}>
                    {String(idx + 1).padStart(2, '0')} · {ep.moduleLabel}
                  </span>
                  <span className="font-math text-slate-500 tabular-nums">{ep.durationSec}s</span>
                </div>
                <p className="text-sm font-bold text-slate-900 leading-snug">{ep.title}</p>
              </button>
            );
          })}
        </aside>

        {/* Left Column (in RTL): Active Animated Video Player */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 md:p-6 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 mb-1">
                <Film className="w-4 h-4 shrink-0" />
                <span>{episode.moduleLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{currentScene.title}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">{episode.title}</h3>
            </div>
            {onJumpToLesson && (
              <button
                onClick={() => onJumpToLesson(episode.moduleId)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                مراجعة الدرس المكتوب
              </button>
            )}
          </div>

          <div className="p-5 md:p-6 space-y-5">
            <div className="drafting-grid rounded-2xl border border-indigo-200/80 p-4 flex items-center justify-center min-h-[290px]">
              <AnimatedStage episodeId={episode.id} progress={progress} />
            </div>

            {/* Subtitle & Formula */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <p className="text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                {currentScene.caption}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                <span dir="ltr" className="font-math text-xs md:text-sm font-bold text-indigo-900 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200 inline-flex flex-wrap items-center">
                  <MathExpr expr={currentScene.formulaHighlight} />
                </span>
                {currentScene.tip && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    {currentScene.tip}
                  </span>
                )}
              </div>
            </div>

            {/* Scrubber & Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-math text-xs font-bold text-slate-500 tabular-nums w-10 text-center">
                  {Math.round(progress)}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={progress}
                  aria-label="شريط تقدم الفيديو"
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="flex-1 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (progress >= 99.5) setProgress(0);
                      setIsPlaying((p) => !p);
                    }}
                    className="min-h-[44px] inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'إيقاف مؤقت' : progress >= 99.5 ? 'إعادة التشغيل' : 'تشغيل الشرح'}
                  </button>
                  <button
                    onClick={() => {
                      setProgress(0);
                      setIsPlaying(true);
                    }}
                    title="من البداية"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 p-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => jumpToScene(currentSceneIndex - 1)}
                    title="المشهد السابق"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 p-2 transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => jumpToScene(currentSceneIndex + 1)}
                    title="المشهد التالي"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 p-2 transition-colors"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {[0.75, 1, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setSpeed(spd)}
                      className={`px-2.5 py-1 text-xs font-math rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        speed === spd
                          ? 'bg-white text-indigo-700 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scene Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
              {episode.scenes.map((scene, idx) => {
                const isCurrent = idx === currentSceneIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => jumpToScene(idx)}
                    className={`text-right rounded-xl border p-3 transition-all ${
                      isCurrent
                        ? 'bg-indigo-50/70 border-indigo-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <p className={`text-xs font-bold mb-0.5 ${isCurrent ? 'text-indigo-800' : 'text-slate-800'}`}>
                      {scene.title}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{scene.caption}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

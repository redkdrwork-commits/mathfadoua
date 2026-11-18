import React from 'react';
import { motion } from 'motion/react';

interface GeometryDiagramProps {
  type?: string;
  className?: string;
}

const SvgFrac: React.FC<{
  x: number;
  y: number;
  num: string;
  den: string;
  width?: number;
  textClass?: string;
  lineColor?: string;
}> = ({ x, y, num, den, width = 22, textClass = 'fill-slate-900 text-[10px] font-bold font-math', lineColor = '#0f172a' }) => (
  <g>
    <text x={x} y={y - 4} textAnchor="middle" className={textClass}>
      {num}
    </text>
    <line x1={x - width / 2} y1={y - 1} x2={x + width / 2} y2={y - 1} stroke={lineColor} strokeWidth="1.3" />
    <text x={x} y={y + 10} textAnchor="middle" className={textClass}>
      {den}
    </text>
  </g>
);

export const GeometryDiagram: React.FC<GeometryDiagramProps> = ({ type, className = '' }) => {
  if (!type) return null;

  switch (type) {
    case 'thales-both-cases':
      return (
        <div className={`drafting-grid rounded-2xl border border-sky-200 bg-white p-4 shadow-xs ${className}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Case 1: Animated Triangle */}
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 260 190" className="w-full max-w-[260px] h-auto" aria-label="حالة المثلث في خاصية طالس">
                <line x1="130" y1="18" x2="36" y2="174" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" />
                <line x1="130" y1="18" x2="224" y2="174" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" />
                <polygon points="130,30 50,158 210,158" fill="#e0f2fe" fillOpacity="0.65" stroke="#0f172a" strokeWidth="2.2" />
                {/* Animated sliding parallel line */}
                <motion.line
                  x1="86"
                  y1="100"
                  x2="174"
                  y2="100"
                  stroke="#0284c7"
                  strokeWidth="3"
                  animate={{
                    y1: [84, 118, 84],
                    y2: [84, 118, 84],
                    x1: [96, 75, 96],
                    x2: [164, 185, 164],
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <path d="M126,154 L133,158 L126,162" fill="none" stroke="#0f172a" strokeWidth="2" />
                <circle cx="130" cy="30" r="4" fill="#0f172a" />
                <motion.circle
                  r="4.2"
                  fill="#0284c7"
                  animate={{ cx: [96, 75, 96], cy: [84, 118, 84] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.circle
                  r="4.2"
                  fill="#0284c7"
                  animate={{ cx: [164, 185, 164], cy: [84, 118, 84] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <circle cx="50" cy="158" r="4" fill="#0f172a" />
                <circle cx="210" cy="158" r="4" fill="#0f172a" />
                <text x="130" y="18" textAnchor="middle" className="fill-slate-900 text-[13px] font-bold font-math">A</text>
                <text x="66" y="102" textAnchor="end" className="fill-sky-700 text-[13px] font-bold font-math">M</text>
                <text x="192" y="102" textAnchor="start" className="fill-sky-700 text-[13px] font-bold font-math">N</text>
                <text x="38" y="172" textAnchor="end" className="fill-slate-900 text-[13px] font-bold font-math">B</text>
                <text x="220" y="172" textAnchor="start" className="fill-slate-900 text-[13px] font-bold font-math">C</text>
              </svg>
              <p className="mt-1 text-xs font-bold text-sky-900">حالة المثلث: <span className="font-math">M ∈ [AB] , N ∈ [AC]</span></p>
            </div>

            {/* Case 2: Animated Butterfly */}
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 260 190" className="w-full max-w-[260px] h-auto" aria-label="حالة الفراشة في خاصية طالس">
                <line x1="72" y1="22" x2="196" y2="170" stroke="#0f172a" strokeWidth="2" />
                <line x1="188" y1="22" x2="64" y2="170" stroke="#0f172a" strokeWidth="2" />
                <motion.polygon
                  points="130,91 83,35 177,35"
                  fill="#fef3c7"
                  animate={{ fillOpacity: [0.45, 0.85, 0.45] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <polygon points="130,91 74,158 186,158" fill="#e0f2fe" fillOpacity="0.65" />
                <line x1="65" y1="35" x2="195" y2="35" stroke="#d97706" strokeWidth="2.8" />
                <line x1="55" y1="158" x2="205" y2="158" stroke="#0284c7" strokeWidth="2.5" />
                <path d="M126,31 L133,35 L126,39" fill="none" stroke="#d97706" strokeWidth="2" />
                <path d="M126,154 L133,158 L126,162" fill="none" stroke="#0284c7" strokeWidth="2" />
                <circle cx="130" cy="91" r="4.5" fill="#d97706" />
                <circle cx="83" cy="35" r="4" fill="#d97706" />
                <circle cx="177" cy="35" r="4" fill="#d97706" />
                <circle cx="74" cy="158" r="3.8" fill="#0f172a" />
                <circle cx="186" cy="158" r="3.8" fill="#0f172a" />
                <text x="144" y="95" className="fill-amber-700 text-[13px] font-bold font-math">A</text>
                <text x="72" y="28" textAnchor="end" className="fill-amber-800 text-[13px] font-bold font-math">M</text>
                <text x="188" y="28" textAnchor="start" className="fill-amber-800 text-[13px] font-bold font-math">N</text>
                <text x="62" y="175" textAnchor="end" className="fill-slate-900 text-[13px] font-bold font-math">C</text>
                <text x="196" y="175" textAnchor="start" className="fill-slate-900 text-[13px] font-bold font-math">B</text>
              </svg>
              <p className="mt-1 text-xs font-bold text-amber-900">حالة الفراشة: <span className="font-math">A</span> بين الطرفين</p>
            </div>
          </div>
        </div>
      );

    case 'thales-butterfly':
      return (
        <div className={`drafting-grid rounded-2xl border border-amber-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 280 190" className="w-full max-w-[280px] h-auto" aria-label="تمرين الفراشة KC و GL">
            <motion.polygon
              points="115,108 70,108 70,152"
              fill="#e0f2fe"
              animate={{ fillOpacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.polygon
              points="115,108 205,108 205,25"
              fill="#fef3c7"
              animate={{ fillOpacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
            />
            <line x1="70" y1="88" x2="70" y2="152" stroke="#0284c7" strokeWidth="2.8" />
            <line x1="205" y1="24" x2="205" y2="108" stroke="#d97706" strokeWidth="2.8" />
            <line x1="55" y1="108" x2="220" y2="108" stroke="#0f172a" strokeWidth="1.8" />
            <line x1="60" y1="162" x2="218" y2="12" stroke="#0f172a" strokeWidth="1.8" />
            <circle cx="115" cy="108" r="4.5" fill="#d97706" />
            <circle cx="70" cy="108" r="3.8" fill="#0284c7" />
            <circle cx="70" cy="152" r="3.8" fill="#0284c7" />
            <circle cx="205" cy="108" r="3.8" fill="#0f172a" />
            <circle cx="205" cy="25" r="3.8" fill="#0f172a" />
            <text x="58" y="102" className="fill-sky-700 text-[13px] font-bold font-math">K</text>
            <text x="56" y="164" className="fill-sky-700 text-[13px] font-bold font-math">C</text>
            <text x="112" y="98" className="fill-amber-700 text-[13px] font-bold font-math">H</text>
            <text x="215" y="114" className="fill-slate-900 text-[13px] font-bold font-math">L</text>
            <text x="214" y="25" className="fill-slate-900 text-[13px] font-bold font-math">G</text>
            <text x="48" y="132" textAnchor="end" className="fill-sky-700 text-[11px] font-bold font-math">1.6</text>
            <text x="155" y="124" textAnchor="middle" className="fill-slate-700 text-[11px] font-bold font-math">HL = 2</text>
            <text x="220" y="68" className="fill-amber-800 text-[11px] font-bold font-math">2.7</text>
            <text x="86" y="142" className="fill-sky-700 text-[11px] font-bold font-math">HC = 2</text>
          </svg>
          <p className="text-xs text-slate-700 font-bold">تطبيق حالة الفراشة: <span className="font-math text-sky-700">(KC) // (GL)</span></p>
        </div>
      );

    case 'thales-converse-compare':
      return (
        <div className={`drafting-grid rounded-2xl border border-slate-200 bg-white p-4 shadow-xs ${className}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 240 160" className="w-full max-w-[230px]" aria-label="توازي محقق">
                <polygon points="120,20 45,140 195,140" fill="#d1fae5" fillOpacity="0.6" stroke="#0f172a" strokeWidth="2" />
                <motion.line
                  x1="95"
                  y1="60"
                  x2="145"
                  y2="60"
                  stroke="#059669"
                  strokeWidth="3"
                  animate={{ strokeOpacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                <circle cx="120" cy="20" r="3.5" fill="#0f172a" />
                <circle cx="95" cy="60" r="4" fill="#059669" />
                <circle cx="145" cy="60" r="4" fill="#059669" />
                <text x="120" y="13" textAnchor="middle" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
                <text x="85" y="59" textAnchor="end" className="fill-emerald-700 text-[12px] font-bold font-math">M</text>
                <text x="155" y="59" textAnchor="start" className="fill-emerald-700 text-[12px] font-bold font-math">N</text>
                <text x="35" y="146" className="fill-slate-900 text-[12px] font-bold font-math">B</text>
                <text x="200" y="146" className="fill-slate-900 text-[12px] font-bold font-math">C</text>
                <SvgFrac x={78} y={108} num="2" den="6" width={16} textClass="fill-emerald-800 text-[10px] font-bold font-math" lineColor="#065f46" />
                <text x={96} y={110} textAnchor="middle" className="fill-emerald-800 text-[11px] font-bold font-math">=</text>
                <SvgFrac x={114} y={108} num="3" den="9" width={16} textClass="fill-emerald-800 text-[10px] font-bold font-math" lineColor="#065f46" />
                <text x={132} y={110} textAnchor="middle" className="fill-emerald-800 text-[11px] font-bold font-math">=</text>
                <SvgFrac x={150} y={108} num="1" den="3" width={16} textClass="fill-emerald-800 text-[10px] font-bold font-math" lineColor="#065f46" />
              </svg>
              <span className="text-xs font-bold text-emerald-700">تساوي النسبتين ⟵ متوازيان</span>
            </div>
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 240 160" className="w-full max-w-[230px]" aria-label="عدم التوازي">
                <polygon points="120,20 45,140 195,140" fill="#fee2e2" fillOpacity="0.6" stroke="#0f172a" strokeWidth="2" />
                <motion.line
                  x1="95"
                  y1="60"
                  x2="155"
                  y2="76"
                  stroke="#dc2626"
                  strokeWidth="3"
                  animate={{ y2: [64, 80, 64] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <circle cx="120" cy="20" r="3.5" fill="#0f172a" />
                <circle cx="95" cy="60" r="4" fill="#dc2626" />
                <motion.circle
                  cx="155"
                  r="4"
                  fill="#dc2626"
                  animate={{ cy: [64, 80, 64] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <text x="120" y="13" textAnchor="middle" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
                <text x="85" y="59" textAnchor="end" className="fill-red-700 text-[12px] font-bold font-math">M</text>
                <text x="164" y="75" textAnchor="start" className="fill-red-700 text-[12px] font-bold font-math">N</text>
                <text x="35" y="146" className="fill-slate-900 text-[12px] font-bold font-math">B</text>
                <text x="200" y="146" className="fill-slate-900 text-[12px] font-bold font-math">C</text>
                <SvgFrac x={96} y={114} num="2" den="6" width={16} textClass="fill-red-700 text-[10px] font-bold font-math" lineColor="#b91c1c" />
                <text x={118} y={116} textAnchor="middle" className="fill-red-700 text-[11px] font-bold font-math">≠</text>
                <SvgFrac x={140} y={114} num="5" den="11" width={18} textClass="fill-red-700 text-[10px] font-bold font-math" lineColor="#b91c1c" />
              </svg>
              <span className="text-xs font-bold text-red-700">اختلاف النسبتين ⟵ غير متوازيين</span>
            </div>
          </div>
        </div>
      );

    case 'thales-shadow-building':
      return (
        <div className={`drafting-grid rounded-2xl border border-amber-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 380 185" className="w-full max-w-[380px] h-auto" aria-label="حساب ارتفاع بناية بالظل">
            <motion.circle
              cx="38"
              cy="34"
              r="16"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <line x1="20" y1="158" x2="360" y2="158" stroke="#334155" strokeWidth="2.2" />
            <rect x="260" y="42" width="44" height="116" fill="#e0f2fe" stroke="#0f172a" strokeWidth="2" />
            <rect x="270" y="54" width="10" height="14" fill="#0284c7" fillOpacity="0.35" />
            <rect x="286" y="54" width="10" height="14" fill="#0284c7" fillOpacity="0.35" />
            <rect x="270" y="80" width="10" height="14" fill="#0284c7" fillOpacity="0.35" />
            <rect x="286" y="80" width="10" height="14" fill="#0284c7" fillOpacity="0.35" />
            <rect x="270" y="106" width="10" height="14" fill="#0284c7" fillOpacity="0.35" />
            <rect x="286" y="106" width="10" height="14" fill="#0284c7" fillOpacity="0.35" />
            <line x1="120" y1="124" x2="120" y2="158" stroke="#0284c7" strokeWidth="3.8" />
            <motion.line
              x1="260"
              y1="42"
              x2="140"
              y2="158"
              stroke="#d97706"
              strokeWidth="2"
              strokeDasharray="5 4"
              animate={{ strokeDashoffset: [0, -18] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <motion.line
              x1="120"
              y1="124"
              x2="85"
              y2="158"
              stroke="#d97706"
              strokeWidth="2"
              strokeDasharray="5 4"
              animate={{ strokeDashoffset: [0, -18] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <line x1="85" y1="158" x2="120" y2="158" stroke="#0284c7" strokeWidth="4.5" />
            <line x1="140" y1="158" x2="260" y2="158" stroke="#0f172a" strokeWidth="4.5" />
            <text x="126" y="143" className="fill-sky-700 text-[12px] font-bold font-math">2 m</text>
            <text x="102" y="174" textAnchor="middle" className="fill-sky-700 text-[11px] font-bold font-math">3 m</text>
            <text x="316" y="104" className="fill-emerald-700 text-[13px] font-bold font-math">h = 20 m</text>
            <text x="200" y="174" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold font-math">ظل البناية = 30 m</text>
          </svg>
        </div>
      );

    case 'thales-triangle':
      return (
        <div className={`drafting-grid rounded-2xl border border-sky-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 260 175" className="w-full max-w-[250px] h-auto" aria-label="مثلث طالس">
            <polygon points="130,22 42,150 218,150" fill="#e0f2fe" fillOpacity="0.65" stroke="#0f172a" strokeWidth="2.2" />
            <line x1="88" y1="84" x2="172" y2="84" stroke="#0284c7" strokeWidth="2.8" />
            <circle cx="130" cy="22" r="3.8" fill="#0f172a" />
            <circle cx="88" cy="84" r="4" fill="#0284c7" />
            <circle cx="172" cy="84" r="4" fill="#0284c7" />
            <circle cx="42" cy="150" r="3.8" fill="#0f172a" />
            <circle cx="218" cy="150" r="3.8" fill="#0f172a" />
            <text x="130" y="14" textAnchor="middle" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
            <text x="76" y="84" textAnchor="end" className="fill-sky-700 text-[12px] font-bold font-math">M</text>
            <text x="184" y="84" textAnchor="start" className="fill-sky-700 text-[12px] font-bold font-math">N</text>
            <text x="30" y="158" className="fill-slate-900 text-[12px] font-bold font-math">B</text>
            <text x="226" y="158" className="fill-slate-900 text-[12px] font-bold font-math">C</text>
          </svg>
        </div>
      );

    case 'bem-2010':
      return (
        <div className={`drafting-grid rounded-2xl border border-slate-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 280 175" className="w-full max-w-[270px] h-auto" aria-label="رسم تمرين شهادة 2010">
            <polygon points="240,140 120,28 38,140" fill="#eef2ff" fillOpacity="0.65" stroke="#0f172a" strokeWidth="2" />
            <line x1="184" y1="88" x2="146" y2="140" stroke="#0284c7" strokeWidth="2.8" />
            <circle cx="240" cy="140" r="3.8" fill="#0f172a" />
            <circle cx="120" cy="28" r="3.8" fill="#0f172a" />
            <circle cx="38" cy="140" r="3.8" fill="#0f172a" />
            <circle cx="184" cy="88" r="4" fill="#0284c7" />
            <circle cx="146" cy="140" r="4" fill="#0284c7" />
            <text x="248" y="145" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
            <text x="120" y="18" textAnchor="middle" className="fill-slate-900 text-[12px] font-bold font-math">B</text>
            <text x="24" y="145" className="fill-slate-900 text-[12px] font-bold font-math">C</text>
            <text x="194" y="82" className="fill-sky-700 text-[12px] font-bold font-math">E</text>
            <text x="146" y="158" textAnchor="middle" className="fill-sky-700 text-[12px] font-bold font-math">F</text>
            <text x="218" y="106" className="fill-slate-700 text-[11px] font-bold font-math">2</text>
            <text x="155" y="54" className="fill-slate-700 text-[11px] font-bold font-math">3</text>
            <text x="64" y="82" className="fill-slate-700 text-[11px] font-bold font-math">7</text>
            <text x="195" y="156" className="fill-slate-700 text-[11px] font-bold font-math">4</text>
          </svg>
        </div>
      );

    case 'bem-2015':
      return (
        <div className={`drafting-grid rounded-2xl border border-slate-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 260 175" className="w-full max-w-[250px] h-auto" aria-label="رباعي أقطاره متعامدة BEM 2015">
            <polygon points="52,40 120,30 212,144 42,126" fill="#f0f9ff" stroke="#0f172a" strokeWidth="2" />
            <line x1="52" y1="40" x2="212" y2="144" stroke="#0284c7" strokeWidth="2" />
            <line x1="120" y1="30" x2="42" y2="126" stroke="#0284c7" strokeWidth="2" />
            <circle cx="91" cy="65" r="4" fill="#d97706" />
            <text x="42" y="36" className="fill-slate-900 text-[12px] font-bold font-math">D</text>
            <text x="128" y="26" className="fill-slate-900 text-[12px] font-bold font-math">C</text>
            <text x="220" y="150" className="fill-slate-900 text-[12px] font-bold font-math">B</text>
            <text x="28" y="132" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
            <text x="98" y="60" className="fill-amber-700 text-[12px] font-bold font-math">O</text>
          </svg>
        </div>
      );

    case 'bem-2017':
      return (
        <div className={`drafting-grid rounded-2xl border border-slate-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 260 175" className="w-full max-w-[250px] h-auto" aria-label="شكل تمرين BEM 2017">
            <line x1="72" y1="30" x2="178" y2="30" stroke="#0f172a" strokeWidth="2.2" />
            <line x1="56" y1="146" x2="200" y2="146" stroke="#0284c7" strokeWidth="2.4" />
            <line x1="72" y1="30" x2="200" y2="146" stroke="#334155" strokeWidth="1.8" />
            <line x1="178" y1="30" x2="56" y2="146" stroke="#334155" strokeWidth="1.8" />
            <path d="M128,80 L137,71 L146,80 L137,89 Z" fill="none" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="128" cy="80" r="3.8" fill="#d97706" />
            <text x="62" y="26" className="fill-slate-900 text-[12px] font-bold font-math">U</text>
            <text x="184" y="26" className="fill-slate-900 text-[12px] font-bold font-math">O</text>
            <text x="108" y="84" className="fill-amber-700 text-[12px] font-bold font-math">M</text>
            <text x="42" y="152" className="fill-sky-700 text-[12px] font-bold font-math">A</text>
            <text x="206" y="152" className="fill-sky-700 text-[12px] font-bold font-math">I</text>
          </svg>
        </div>
      );

    case 'bem-2018':
      return (
        <div className={`drafting-grid rounded-2xl border border-slate-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 280 170" className="w-full max-w-[270px] h-auto" aria-label="مستطيل BEM 2018">
            <rect x="45" y="28" width="190" height="114" fill="#f0f9ff" stroke="#0f172a" strokeWidth="2" />
            <line x1="45" y1="28" x2="235" y2="142" stroke="#0f172a" strokeWidth="1.8" />
            <line x1="187" y1="28" x2="235" y2="57" stroke="#0284c7" strokeWidth="2.8" />
            <text x="36" y="24" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
            <text x="242" y="24" className="fill-slate-900 text-[12px] font-bold font-math">B</text>
            <text x="242" y="150" className="fill-slate-900 text-[12px] font-bold font-math">C</text>
            <text x="36" y="150" className="fill-slate-900 text-[12px] font-bold font-math">D</text>
            <text x="187" y="20" textAnchor="middle" className="fill-sky-700 text-[12px] font-bold font-math">E</text>
            <text x="245" y="60" className="fill-sky-700 text-[12px] font-bold font-math">F</text>
            <text x="210" y="20" className="fill-slate-700 text-[10px] font-bold font-math">2</text>
            <text x="246" y="42" className="fill-slate-700 text-[10px] font-bold font-math">1.5</text>
            <text x="32" y="90" textAnchor="end" className="fill-slate-700 text-[11px] font-bold font-math">6</text>
            <text x="140" y="156" textAnchor="middle" className="fill-slate-700 text-[11px] font-bold font-math">8</text>
          </svg>
        </div>
      );

    case 'situation-well':
      return (
        <div className={`drafting-grid rounded-2xl border border-sky-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 300 185" className="w-full max-w-[290px] h-auto" aria-label="وضعية قياس عمق البئر">
            <line x1="20" y1="76" x2="280" y2="76" stroke="#475569" strokeWidth="2.2" />
            <rect x="65" y="76" width="90" height="86" fill="#bae6fd" stroke="#0f172a" strokeWidth="2" />
            <line x1="65" y1="76" x2="155" y2="76" stroke="#f8fafc" strokeWidth="3" />
            <line x1="210" y1="24" x2="210" y2="76" stroke="#0284c7" strokeWidth="3.8" />
            <circle cx="210" cy="20" r="5" fill="#0284c7" />
            <motion.line
              x1="210"
              y1="24"
              x2="65"
              y2="162"
              stroke="#dc2626"
              strokeWidth="2.2"
              strokeDasharray="5 3"
              animate={{ strokeDashoffset: [0, -16] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <text x="110" y="70" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold font-math">2.4 m</text>
            <text x="182" y="70" textAnchor="middle" className="fill-sky-700 text-[11px] font-bold font-math">1.2 m</text>
            <text x="220" y="54" className="fill-sky-700 text-[11px] font-bold font-math">1.6 m</text>
            <text x="48" y="122" textAnchor="end" className="fill-slate-900 text-[11px] font-bold font-math">p = ?</text>
          </svg>
        </div>
      );

    case 'situation-400':
      return (
        <div className={`drafting-grid rounded-2xl border border-amber-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 300 185" className="w-full max-w-[290px] h-auto" aria-label="وضعية ترميم عمارة حي 400 مسكن">
            <rect x="165" y="24" width="66" height="136" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
            <line x1="35" y1="160" x2="265" y2="160" stroke="#334155" strokeWidth="2.2" />
            <line x1="75" y1="160" x2="165" y2="24" stroke="#0284c7" strokeWidth="3" />
            <line x1="94" y1="131" x2="165" y2="131" stroke="#d97706" strokeWidth="2.6" />
            <text x="160" y="20" textAnchor="end" className="fill-slate-900 text-[12px] font-bold font-math">S</text>
            <text x="72" y="175" textAnchor="middle" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
            <text x="165" y="175" textAnchor="middle" className="fill-slate-900 text-[12px] font-bold font-math">B</text>
            <text x="82" y="128" className="fill-amber-700 text-[12px] font-bold font-math">M</text>
            <text x="172" y="134" className="fill-amber-700 text-[12px] font-bold font-math">N</text>
            <text x="120" y="175" textAnchor="middle" className="fill-slate-700 text-[11px] font-bold font-math">4.5 m</text>
            <text x="158" y="88" textAnchor="end" className="fill-slate-800 text-[11px] font-bold font-math">15 m</text>
          </svg>
        </div>
      );

    case 'situation-eclipse':
      return (
        <div className={`drafting-grid rounded-2xl border border-amber-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 340 165" className="w-full max-w-[330px] h-auto" aria-label="وضعية الكسوف الكلي">
            <motion.circle
              cx="52"
              cy="82"
              r="36"
              fill="#fde047"
              stroke="#ca8a04"
              strokeWidth="2"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <circle cx="170" cy="82" r="11" fill="#64748b" stroke="#0f172a" strokeWidth="1.8" />
            <circle cx="295" cy="82" r="18" fill="#7dd3fc" stroke="#0284c7" strokeWidth="2" />
            <line x1="52" y1="82" x2="295" y2="82" stroke="#334155" strokeWidth="1.4" strokeDasharray="4 3" />
            <line x1="52" y1="46" x2="295" y2="82" stroke="#d97706" strokeWidth="1.8" />
            <line x1="52" y1="118" x2="295" y2="82" stroke="#d97706" strokeWidth="1.8" />
            <line x1="52" y1="82" x2="52" y2="46" stroke="#0f172a" strokeWidth="2" />
            <line x1="170" y1="82" x2="170" y2="71" stroke="#0f172a" strokeWidth="2" />
            <text x="52" y="38" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold font-math">A</text>
            <text x="42" y="94" className="fill-slate-900 text-[11px] font-bold font-math">S</text>
            <text x="170" y="64" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold font-math">B</text>
            <text x="170" y="106" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold font-math">L</text>
            <text x="295" y="114" textAnchor="middle" className="fill-sky-800 text-[11px] font-bold font-math">T (الأرض)</text>
          </svg>
        </div>
      );

    case 'trig-right-triangle':
      return (
        <div className={`drafting-grid rounded-2xl border border-amber-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 280 175" className="w-full max-w-[270px] h-auto" aria-label="مثلث قائم والنسب المثلثية">
            <polygon points="55,145 55,35 235,145" fill="#fef3c7" fillOpacity="0.45" stroke="#0f172a" strokeWidth="2.2" />
            <polyline points="55,131 69,131 69,145" fill="none" stroke="#0f172a" strokeWidth="1.8" />
            <motion.path
              d="M198,145 A37,37 0 0,1 204,126"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.6"
              animate={{ strokeOpacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="42" y="152" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
            <text x="44" y="28" className="fill-slate-900 text-[12px] font-bold font-math">C</text>
            <text x="244" y="152" className="fill-sky-700 text-[12px] font-bold font-math">B</text>
            <text x="155" y="78" className="fill-emerald-700 text-[12px] font-bold">الوتر (BC)</text>
            <text x="145" y="162" textAnchor="middle" className="fill-sky-700 text-[12px] font-bold">المجاور لـ B̂ (AB)</text>
            <text x="48" y="92" textAnchor="end" className="fill-amber-700 text-[12px] font-bold">المقابل</text>
          </svg>
        </div>
      );

    case 'pgcd-mindmap':
      return (
        <div className={`drafting-grid rounded-2xl border border-indigo-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 360 155" className="w-full max-w-[350px] h-auto" aria-label="خريطة ذهنية للقاسم المشترك الأكبر">
            <rect x="130" y="10" width="100" height="30" rx="6" fill="#e0e7ff" stroke="#4338ca" strokeWidth="1.8" />
            <text x="180" y="30" textAnchor="middle" className="fill-indigo-900 text-[12px] font-bold font-math">PGCD(a; b)</text>
            <line x1="150" y1="40" x2="80" y2="68" stroke="#4338ca" strokeWidth="1.6" />
            <line x1="210" y1="40" x2="280" y2="68" stroke="#4338ca" strokeWidth="1.6" />
            <rect x="20" y="68" width="125" height="32" rx="6" fill="#d1fae5" stroke="#059669" strokeWidth="1.8" />
            <text x="82" y="88" textAnchor="middle" className="fill-emerald-900 text-[11px] font-bold">يساوي 1 : أوليان</text>
            <rect x="215" y="68" width="125" height="32" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
            <text x="277" y="88" textAnchor="middle" className="fill-amber-900 text-[11px] font-bold">لا يساوي 1 : قابل للاختزال</text>
            <text x="82" y="122" textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">الكسر غير قابل للاختزال</text>
            <text x="277" y="122" textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">نقسم البسط والمقام على PGCD</text>
          </svg>
        </div>
      );

    case 'roots-mindmap':
      return (
        <div className={`drafting-grid rounded-2xl border border-emerald-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 360 130" className="w-full max-w-[350px] h-auto" aria-label="ملخص الجذور التربيعية">
            <rect x="115" y="8" width="130" height="30" rx="6" fill="#d1fae5" stroke="#059669" strokeWidth="1.8" />
            <text x="180" y="28" textAnchor="middle" className="fill-emerald-950 text-[12px] font-bold">الجذور التربيعية</text>
            <line x1="145" y1="38" x2="85" y2="66" stroke="#059669" strokeWidth="1.6" />
            <line x1="215" y1="38" x2="275" y2="66" stroke="#059669" strokeWidth="1.6" />
            <rect x="18" y="66" width="134" height="44" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <text x="85" y="85" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold">التبسيط a√b</text>
            <text x="85" y="102" textAnchor="middle" className="fill-emerald-800 text-[11px] font-bold font-math">√(a²×b) = a√b</text>
            <rect x="208" y="66" width="134" height="52" rx="6" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" />
            <text x="275" y="82" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold">جعل المقام ناطقاً</text>
            <SvgFrac x={242} y={102} num="a" den="√b" width={20} textClass="fill-sky-800 text-[10px] font-bold font-math" lineColor="#075985" />
            <text x={265} y={104} textAnchor="middle" className="fill-sky-800 text-[11px] font-bold font-math">=</text>
            <SvgFrac x={298} y={102} num="a√b" den="b" width={28} textClass="fill-sky-800 text-[10px] font-bold font-math" lineColor="#075985" />
          </svg>
        </div>
      );

    case 'pythagoras-squares':
      return (
        <div className={`drafting-grid rounded-2xl border border-teal-200 bg-white p-4 flex flex-col items-center shadow-xs ${className}`}>
          <svg viewBox="0 0 320 215" className="w-full max-w-[310px] h-auto" aria-label="رسم خاصية فيثاغورس والمربعات الثلاثة">
            {/* Square on AB (bottom, side = 80) */}
            <motion.rect
              x="105"
              y="128"
              width="80"
              height="68"
              fill="#bae6fd"
              stroke="#0284c7"
              strokeWidth="2"
              animate={{ fillOpacity: [0.45, 0.78, 0.45] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <text x="145" y="166" textAnchor="middle" className="fill-sky-900 text-[12px] font-bold font-math">AB²</text>

            {/* Square on AC (left, side = 60) */}
            <motion.rect
              x="45"
              y="68"
              width="60"
              height="60"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="2"
              animate={{ fillOpacity: [0.45, 0.78, 0.45] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <text x="75" y="102" textAnchor="middle" className="fill-amber-900 text-[12px] font-bold font-math">AC²</text>

            {/* Square on Hypotenuse BC (tilted) */}
            <motion.polygon
              points="105,68 185,128 245,48 165,-12"
              transform="translate(0,22)"
              fill="#99f6e4"
              stroke="#0d9488"
              strokeWidth="2"
              animate={{ fillOpacity: [0.4, 0.75, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />

            {/* Right Triangle ABC */}
            <polygon points="105,128 185,128 105,68" fill="#ffffff" stroke="#0f172a" strokeWidth="2.4" />
            <polyline points="105,115 118,115 118,128" fill="none" stroke="#0f172a" strokeWidth="2" />

            <text x="95" y="140" className="fill-slate-900 text-[12px] font-bold font-math">A</text>
            <text x="192" y="140" className="fill-sky-700 text-[12px] font-bold font-math">B</text>
            <text x="95" y="62" className="fill-amber-700 text-[12px] font-bold font-math">C</text>
            <text x="200" y="72" textAnchor="middle" className="fill-teal-900 text-[13px] font-bold font-math">BC² = AB² + AC²</text>
          </svg>
          <p className="mt-1 text-xs font-bold text-teal-900">
            مربع الوتر يساوي مجموع مربعي الضلعين القائمين
          </p>
        </div>
      );

    case 'pythagoras-converse-check':
      return (
        <div className={`drafting-grid rounded-2xl border border-teal-200 bg-white p-4 shadow-xs ${className}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 220 150" className="w-full max-w-[210px] h-auto" aria-label="مثلث قائم بالخاصية العكسية">
                <polygon points="48,120 175,120 48,35" fill="#d1fae5" fillOpacity="0.65" stroke="#059669" strokeWidth="2.2" />
                <motion.polyline
                  points="48,104 64,104 64,120"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.2"
                  animate={{ strokeOpacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text x="36" y="128" className="fill-slate-900 text-[12px] font-bold font-math">R</text>
                <text x="180" y="128" className="fill-slate-900 text-[12px] font-bold font-math">T</text>
                <text x="38" y="32" className="fill-slate-900 text-[12px] font-bold font-math">S</text>
                <text x="112" y="138" textAnchor="middle" className="fill-emerald-800 text-[11px] font-bold font-math">14.4</text>
                <text x="36" y="78" textAnchor="end" className="fill-emerald-800 text-[11px] font-bold font-math">4.2</text>
                <text x="128" y="68" className="fill-emerald-900 text-[11px] font-bold font-math">15</text>
              </svg>
              <span className="text-xs font-bold text-emerald-700 font-math">225 = 225 ⟵ قائم في R</span>
            </div>

            <div className="flex flex-col items-center">
              <svg viewBox="0 0 220 150" className="w-full max-w-[210px] h-auto" aria-label="مثلث غير قائم">
                <polygon points="35,120 185,120 75,55" fill="#fee2e2" fillOpacity="0.6" stroke="#dc2626" strokeWidth="2.2" />
                <text x="24" y="128" className="fill-slate-900 text-[12px] font-bold font-math">M</text>
                <text x="190" y="128" className="fill-slate-900 text-[12px] font-bold font-math">N</text>
                <text x="72" y="46" className="fill-slate-900 text-[12px] font-bold font-math">L</text>
                <text x="110" y="138" textAnchor="middle" className="fill-red-700 text-[11px] font-bold font-math">9</text>
                <text x="48" y="82" textAnchor="end" className="fill-red-700 text-[11px] font-bold font-math">6</text>
                <text x="142" y="80" className="fill-red-700 text-[11px] font-bold font-math">4.5</text>
              </svg>
              <span className="text-xs font-bold text-red-700 font-math">81 ≠ 56.25 ⟵ غير قائم</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

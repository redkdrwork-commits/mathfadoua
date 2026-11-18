import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { MathExpr, VerticalFraction } from './MathText';

type LabTab = 'thales' | 'pythagoras' | 'pgcd' | 'trig' | 'roots';

export const InteractiveLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTab>('thales');

  // --- Tab 1: Thales State ---
  const [shapeMode, setShapeMode] = useState<'triangle' | 'butterfly'>('triangle');
  const [isParallelLocked, setIsParallelLocked] = useState(true);
  const [ratioM, setRatioM] = useState(0.45); // AM / AB
  const [ratioN, setRatioN] = useState(0.45); // AN / AC (when unlocked)

  const effectiveRatioN = isParallelLocked ? ratioM : ratioN;
  const isParallelNow = Math.abs(ratioM - effectiveRatioN) < 0.015;

  // Triangle coordinates in SVG 440x280
  const baseAB = 12; // cm
  const baseAC = 15; // cm
  const baseBC = 18; // cm
  const Ax = 220;
  const Ay = shapeMode === 'triangle' ? 32 : 132;
  const Bx = 95;
  const By = 242;
  const Cx = 345;
  const Cy = 242;

  const sign = shapeMode === 'triangle' ? 1 : -1;
  const kM = sign * ratioM;
  const kN = sign * effectiveRatioN;

  const Mx = Ax + kM * (Bx - Ax);
  const My = Ay + kM * (By - Ay);
  const Nx = Ax + kN * (Cx - Ax);
  const Ny = Ay + kN * (Cy - Ay);

  const lenAM = (ratioM * baseAB).toFixed(2);
  const lenAN = (effectiveRatioN * baseAC).toFixed(2);
  const lenMN = isParallelNow ? (ratioM * baseBC).toFixed(2) : '—';

  // --- Tab 2: PGCD State ---
  const [pgcdA, setPgcdA] = useState(561);
  const [pgcdB, setPgcdB] = useState(231);

  const computeEuclid = (a0: number, b0: number) => {
    const a = Math.max(1, Math.min(99999, Math.floor(Math.abs(a0)) || 1));
    const b = Math.max(1, Math.min(99999, Math.floor(Math.abs(b0)) || 1));
    let x = Math.max(a, b);
    let y = Math.min(a, b);
    const steps: { dividend: number; divisor: number; quotient: number; remainder: number }[] = [];
    let guard = 0;
    while (y > 0 && guard < 30) {
      const q = Math.floor(x / y);
      const r = x % y;
      steps.push({ dividend: x, divisor: y, quotient: q, remainder: r });
      x = y;
      y = r;
      guard++;
    }
    const gcd = x;
    return { a, b, steps, gcd };
  };

  const euclidResult = computeEuclid(pgcdA, pgcdB);

  // --- Tab 3: Trig State ---
  const [angleDeg, setAngleDeg] = useState(37);
  const [hypotenuse, setHypotenuse] = useState(10);
  const rad = (angleDeg * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);
  const tanVal = Math.tan(rad);
  const adjAB = hypotenuse * cosVal;
  const oppAC = hypotenuse * sinVal;

  // Dynamic SVG coords for right triangle
  const svgScale = 11;
  const triWidth = Math.min(260, Math.max(70, adjAB * svgScale));
  const triHeight = Math.min(180, Math.max(45, oppAC * svgScale));
  const rxA = 80;
  const ryA = 225;
  const rxB = rxA + triWidth;
  const ryB = ryA;
  const rxC = rxA;
  const ryC = ryA - triHeight;

  // --- Tab 4: Roots Simplifier State ---
  const [rootInput, setRootInput] = useState(147);
  const simplifyRoot = (val: number) => {
    const n = Math.max(1, Math.min(10000, Math.floor(Math.abs(val)) || 1));
    let outside = 1;
    let inside = n;
    for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
      if (n % (k * k) === 0) {
        outside = k;
        inside = n / (k * k);
        break;
      }
    }
    return { n, outside, inside, squareFactor: outside * outside };
  };
  const rootRes = simplifyRoot(rootInput);

  // --- Tab 5: Pythagoras & Converse State ---
  const [pythA, setPythA] = useState(6);
  const [pythB, setPythB] = useState(8);
  const [pythLockedRight, setPythLockedRight] = useState(true);
  const [pythCustomC, setPythCustomC] = useState(11);

  const exactHyp = Number(Math.sqrt(pythA * pythA + pythB * pythB).toFixed(2));
  const pythC = pythLockedRight ? exactHyp : pythCustomC;
  const sumSquaresAB = Number((pythA * pythA + pythB * pythB).toFixed(2));
  const squareC = Number((pythC * pythC).toFixed(2));
  const isRightTri = Math.abs(squareC - sumSquaresAB) < 0.25;
  const maxPythSide = Math.max(pythA, pythB, pythC);
  const isValidTri = pythA + pythB > pythC && pythA + pythC > pythB && pythB + pythC > pythA;

  // Dynamic geometry for triangle ABC with vertex A at bottom-left, B along x, C tilted according to c
  const pScale = 14;
  const pAx = 110;
  const pAy = 220;
  const pBx = pAx + pythA * pScale;
  const pBy = pAy;
  // Law of cosines for angle at A: cos(A) = (a^2 + b^2 - c^2)/(2ab)
  const rawCosA = isValidTri ? (pythA * pythA + pythB * pythB - pythC * pythC) / (2 * pythA * pythB) : 0;
  const clampedCosA = Math.max(-0.92, Math.min(0.92, rawCosA));
  const angleARad = Math.acos(clampedCosA);
  const pCx = pAx + pythB * pScale * Math.cos(angleARad);
  const pCy = pAy - pythB * pScale * Math.sin(angleARad);

  return (
    <section id="lab" className="py-6 md:py-8">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-sky-700 mb-1">المختبر التفاعلي للرياضيات</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
            جرّب القواعد بنفسك وحرّك الأشكال مباشرة
          </h2>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
          {[
            { id: 'thales', label: 'مختبر طالس' },
            { id: 'pythagoras', label: 'مختبر فيثاغورس' },
            { id: 'pgcd', label: 'حاسبة PGCD' },
            { id: 'trig', label: 'المثلثات' },
            { id: 'roots', label: 'مبسّط الجذور' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as LabTab)}
              className={`min-h-[42px] px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: THALES INTERACTIVE LAB */}
      {activeTab === 'thales' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          {/* Interactive Visual Stage (7 cols) */}
          <div className="lg:col-span-7 p-5 md:p-6 border-b lg:border-b-0 lg:border-l border-slate-200 bg-slate-50/40 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-700">
                منصة الرسم الهندسي — {shapeMode === 'triangle' ? 'حالة المثلث' : 'حالة الفراشة'}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                  isParallelNow ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {isParallelNow ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    متوازيان: (MN) // (BC)
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    غير متوازيين: النسبتان مختلفتان
                  </>
                )}
              </span>
            </div>

            <div className="drafting-grid rounded-xl border border-slate-200 p-3 flex items-center justify-center min-h-[290px]">
              <svg viewBox="0 0 440 280" className="w-full max-w-[440px] h-auto" aria-label="مختبر خاصية طالس التفاعلي">
                {/* Extended secant lines */}
                <line x1="65" y1="268" x2="315" y2="12" stroke="#cbd5e1" strokeWidth="1.4" strokeDasharray="4 4" />
                <line x1="375" y1="268" x2="125" y2="12" stroke="#cbd5e1" strokeWidth="1.4" strokeDasharray="4 4" />
                {/* Triangle ABC */}
                <polygon
                  points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
                  fill="#f8fafc"
                  fillOpacity="0.85"
                  stroke="#0f172a"
                  strokeWidth="2.2"
                />
                {/* Triangle AMN */}
                <polygon
                  points={`${Ax},${Ay} ${Mx},${My} ${Nx},${Ny}`}
                  fill={isParallelNow ? '#ecfdf5' : '#fef2f2'}
                  fillOpacity="0.65"
                  stroke={isParallelNow ? '#059669' : '#dc2626'}
                  strokeWidth="2"
                />
                {/* Line MN */}
                <line
                  x1={Mx}
                  y1={My}
                  x2={Nx}
                  y2={Ny}
                  stroke={isParallelNow ? '#059669' : '#dc2626'}
                  strokeWidth="3.2"
                />
                {/* Base BC */}
                <line x1={Bx} y1={By} x2={Cx} y2={Cy} stroke="#0f172a" strokeWidth="3" />
                {/* Vertices */}
                <circle cx={Ax} cy={Ay} r="4.5" fill="#0f172a" />
                <circle cx={Bx} cy={By} r="4" fill="#0f172a" />
                <circle cx={Cx} cy={Cy} r="4" fill="#0f172a" />
                <circle cx={Mx} cy={My} r="5" fill={isParallelNow ? '#059669' : '#dc2626'} />
                <circle cx={Nx} cy={Ny} r="5" fill={isParallelNow ? '#059669' : '#dc2626'} />

                <text x={Ax + 12} y={Ay - 4} className="fill-slate-900 text-[13px] font-bold font-math">A</text>
                <text x={Bx - 16} y={By + 5} className="fill-slate-900 text-[13px] font-bold font-math">B</text>
                <text x={Cx + 10} y={Cy + 5} className="fill-slate-900 text-[13px] font-bold font-math">C</text>
                <text x={Mx - 18} y={My + 4} className={`${isParallelNow ? 'fill-emerald-700' : 'fill-red-700'} text-[13px] font-bold font-math`}>M</text>
                <text x={Nx + 10} y={Ny + 4} className={`${isParallelNow ? 'fill-emerald-700' : 'fill-red-700'} text-[13px] font-bold font-math`}>N</text>
              </svg>
            </div>

            {/* Live Ratio Comparison Bar */}
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1">
                <div className="text-[11px] font-bold text-slate-500 font-math">
                  <VerticalFraction numerator="AM" denominator="AB" />
                </div>
                <div dir="ltr" className="text-sm sm:text-base font-bold text-slate-900 font-math tabular-nums flex items-center justify-center gap-1">
                  <VerticalFraction numerator={lenAM} denominator={baseAB} />
                  <span>= {ratioM.toFixed(2)}</span>
                </div>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1">
                <div className="text-[11px] font-bold text-slate-500 font-math">
                  <VerticalFraction numerator="AN" denominator="AC" />
                </div>
                <div
                  dir="ltr"
                  className={`text-sm sm:text-base font-bold font-math tabular-nums flex items-center justify-center gap-1 ${
                    isParallelNow ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  <VerticalFraction numerator={lenAN} denominator={baseAC} />
                  <span>= {effectiveRatioN.toFixed(2)}</span>
                </div>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1">
                <div className="text-[11px] font-bold text-slate-500 font-math">
                  <VerticalFraction numerator="MN" denominator="BC" />
                </div>
                <div dir="ltr" className="text-sm sm:text-base font-bold text-sky-700 font-math tabular-nums flex items-center justify-center">
                  <VerticalFraction numerator={lenMN} denominator={baseBC} />
                </div>
              </div>
            </div>
          </div>

          {/* Control & Concept Deck (5 cols) */}
          <div className="lg:col-span-5 p-5 md:p-6 flex flex-col justify-between gap-5">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2">1. اختر الوضعية الهندسية</p>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setShapeMode('triangle')}
                    className={`py-2 px-3 text-xs font-bold rounded-md transition-colors ${
                      shapeMode === 'triangle' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    حالة المثلث
                  </button>
                  <button
                    onClick={() => setShapeMode('butterfly')}
                    className={`py-2 px-3 text-xs font-bold rounded-md transition-colors ${
                      shapeMode === 'butterfly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    حالة الفراشة
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 mb-2">2. حالة التوازي (للتجربة)</p>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setIsParallelLocked(true)}
                    className={`py-2 px-3 text-xs font-bold rounded-md transition-colors ${
                      isParallelLocked ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    تثبيت التوازي (طالس)
                  </button>
                  <button
                    onClick={() => {
                      setIsParallelLocked(false);
                      setRatioN(Math.min(0.85, ratioM + 0.22));
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-md transition-colors ${
                      !isParallelLocked ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    تحريك N (نفي التوازي)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>نسبة النقطة M على الضلع (AB):</span>
                  <span className="font-math text-sky-700 tabular-nums">
                    AM / AB = {ratioM.toFixed(2)} ({lenAM} cm)
                  </span>
                </div>
                <input
                  type="range"
                  min={0.25}
                  max={0.85}
                  step={0.05}
                  value={ratioM}
                  onChange={(e) => setRatioM(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              {!isParallelLocked && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>نسبة النقطة N على الضلع (AC):</span>
                    <span className="font-math text-amber-700 tabular-nums">
                      AN / AC = {ratioN.toFixed(2)} ({lenAN} cm)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.25}
                    max={0.85}
                    step={0.05}
                    value={ratioN}
                    onChange={(e) => setRatioN(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900 mb-1">الاستنتاج الفوري:</p>
              {isParallelNow ? (
                <p>
                  بما أن <MathExpr expr={`AM/AB = AN/AC = ${ratioM.toFixed(2)}`} className="font-bold text-slate-900 mx-1" /> والنقط بنفس الترتيب، فإن المستقيمين متوازيان ويمكننا حساب <span className="font-math font-bold">MN = {lenMN} cm</span>.
                </p>
              ) : (
                <p>
                  بما أن <span className="font-math font-bold text-red-700">{ratioM.toFixed(2)} ≠ {effectiveRatioN.toFixed(2)}</span>، فإن النسبتين غير متساويتين ومنه المستقيمان <span className="font-math">(MN)</span> و <span className="font-math">(BC)</span> غير متوازيين!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1B: PYTHAGORAS & CONVERSE LAB */}
      {activeTab === 'pythagoras' && (
        <div className="bg-white border border-teal-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-4 sm:p-5 md:p-6 border-b lg:border-b-0 lg:border-l border-slate-200 bg-teal-50/25 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-700">
                منصة التحقق من فيثاغورس والعكسية
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                  !isValidTri
                    ? 'text-red-700'
                    : isRightTri
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {!isValidTri ? (
                  <>
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    الأطوال لا تشكل مثلثاً (متباينة المثلث)
                  </>
                ) : isRightTri ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    مثلث قائم في A (BC² = AB² + AC²)
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    مثلث غير قائم (BC² ≠ AB² + AC²)
                  </>
                )}
              </span>
            </div>

            <div className="drafting-grid rounded-xl border border-teal-200 p-3 flex items-center justify-center min-h-[270px]">
              <svg viewBox="0 0 420 265" className="w-full max-w-[400px] h-auto" aria-label="مختبر خاصية فيثاغورس والعكسية">
                {isValidTri ? (
                  <>
                    <polygon
                      points={`${pAx},${pAy} ${pBx},${pBy} ${pCx},${pCy}`}
                      fill={isRightTri ? '#ccfbf1' : '#fef3c7'}
                      fillOpacity="0.65"
                      stroke={isRightTri ? '#0d9488' : '#d97706'}
                      strokeWidth="2.6"
                    />
                    {isRightTri && (
                      <polyline
                        points={`${pAx},${pAy - 15} ${pAx + 15},${pAy - 15} ${pAx + 15},${pAy}`}
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="2.2"
                      />
                    )}
                    <circle cx={pAx} cy={pAy} r="4.5" fill="#0f172a" />
                    <circle cx={pBx} cy={pBy} r="4.5" fill="#0284c7" />
                    <circle cx={pCx} cy={pCy} r="4.5" fill="#d97706" />
                    <text x={pAx - 14} y={pAy + 10} className="fill-slate-900 text-[13px] font-bold font-math">A</text>
                    <text x={pBx + 10} y={pBy + 10} className="fill-sky-700 text-[13px] font-bold font-math">B</text>
                    <text x={pCx - 12} y={pCy - 10} className="fill-amber-700 text-[13px] font-bold font-math">C</text>

                    <text x={(pAx + pBx) / 2} y={pAy + 22} textAnchor="middle" className="fill-sky-800 text-[12px] font-bold font-math">
                      AB = {pythA}
                    </text>
                    <text x={(pAx + pCx) / 2 - 14} y={(pAy + pCy) / 2} textAnchor="end" className="fill-amber-800 text-[12px] font-bold font-math">
                      AC = {pythB}
                    </text>
                    <text x={(pBx + pCx) / 2 + 16} y={(pBy + pCy) / 2 - 6} className="fill-teal-900 text-[12px] font-bold font-math">
                      BC = {pythC}
                    </text>
                  </>
                ) : (
                  <text x="210" y="135" textAnchor="middle" className="fill-red-700 text-[13px] font-bold">
                    مجموع ضلعين أصغر من الضلع الثالث! عدّل الطول BC
                  </text>
                )}
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
              <div className="rounded-xl bg-sky-50 border border-sky-200 p-3">
                <p className="text-[11px] font-bold text-sky-800 mb-1 font-math">AB²</p>
                <p className="text-base font-bold text-sky-950 font-math tabular-nums">{pythA * pythA}</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-[11px] font-bold text-amber-800 mb-1 font-math">AC²</p>
                <p className="text-base font-bold text-amber-950 font-math tabular-nums">{pythB * pythB}</p>
              </div>
              <div
                className={`rounded-xl border p-3 ${
                  isRightTri ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
                }`}
              >
                <p className="text-[11px] font-bold text-slate-700 mb-1 font-math">BC² مقابل المجموع</p>
                <p className={`text-sm sm:text-base font-bold font-math tabular-nums ${isRightTri ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {squareC} {isRightTri ? '=' : '≠'} {sumSquaresAB}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-4 sm:p-5 md:p-6 flex flex-col justify-between gap-5">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2">1. اختر وضع التجربة</p>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setPythLockedRight(true)}
                    className={`min-h-[42px] py-2 px-3 text-xs font-bold rounded-md transition-colors ${
                      pythLockedRight ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    فيثاغورس المباشرة (قائم)
                  </button>
                  <button
                    onClick={() => {
                      setPythLockedRight(false);
                      setPythCustomC(Math.round(exactHyp) + 1);
                    }}
                    className={`min-h-[42px] py-2 px-3 text-xs font-bold rounded-md transition-colors ${
                      !pythLockedRight ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    اختبار العكسية (تغيير BC)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>الضلع AB:</span>
                  <span className="font-math text-sky-700 tabular-nums">{pythA} cm</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={1}
                  value={pythA}
                  onChange={(e) => setPythA(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>الضلع AC:</span>
                  <span className="font-math text-amber-700 tabular-nums">{pythB} cm</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={1}
                  value={pythB}
                  onChange={(e) => setPythB(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              {!pythLockedRight && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>الضلع الثالث BC:</span>
                    <span className="font-math text-teal-800 tabular-nums">{pythCustomC} cm</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={18}
                    step={0.5}
                    value={pythCustomC}
                    onChange={(e) => setPythCustomC(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {[
                  { a: 3, b: 4, c: 5, label: 'ثلاثية (3-4-5)' },
                  { a: 6, b: 8, c: 10, label: 'ثلاثية (6-8-10)' },
                  { a: 5, b: 12, c: 13, label: 'ثلاثية (5-12-13)' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setPythA(preset.a);
                      setPythB(preset.b);
                      setPythCustomC(preset.c);
                    }}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-xs font-bold text-teal-900 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900 mb-1">القراءة المنهجية:</p>
              {!isValidTri ? (
                <p className="text-red-700 font-semibold">
                  مجموع طولي ضلعين يجب أن يكون أكبر تماماً من الضلع الثالث ({maxPythSide}).
                </p>
              ) : isRightTri ? (
                <p>
                  بما أن <span className="font-math font-bold text-emerald-700">BC² = AB² + AC² = {sumSquaresAB}</span>، فحسب الخاصية العكسية لفيثاغورس المثلث <span className="font-math font-bold">ABC</span> قائم في <span className="font-math font-bold">A</span>.
                </p>
              ) : (
                <p>
                  نحسب مربع الأطول ومجموع مربعي الآخرين فنجد <span className="font-math font-bold text-rose-700">{squareC} ≠ {sumSquaresAB}</span>، إذن المثلث غير قائم.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PGCD SOLVER */}
      {activeTab === 'pgcd' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">أدخل عددين طبيعيين لحساب PGCD</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">العدد الأول (a)</label>
                <input
                  type="number"
                  min={1}
                  max={99999}
                  value={pgcdA}
                  onChange={(e) => setPgcdA(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-math font-bold text-slate-900 focus:outline-none focus:border-sky-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">العدد الثاني (b)</label>
                <input
                  type="number"
                  min={1}
                  max={99999}
                  value={pgcdB}
                  onChange={(e) => setPgcdB(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-math font-bold text-slate-900 focus:outline-none focus:border-sky-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                [561, 231],
                [1078, 322],
                [146, 125],
                [714, 612],
              ].map(([x, y]) => (
                <button
                  key={`${x}-${y}`}
                  onClick={() => {
                    setPgcdA(x);
                    setPgcdB(y);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 text-xs font-math font-semibold text-slate-700 transition-colors"
                >
                  ({x}; {y})
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">القاسم المشترك الأكبر:</span>
                <span className="font-math text-lg font-bold text-sky-700 tabular-nums">
                  PGCD({euclidResult.a}; {euclidResult.b}) = {euclidResult.gcd}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <span className="text-xs font-semibold text-slate-600">أوليان فيما بينهما؟</span>
                <span
                  className={`text-xs font-bold ${
                    euclidResult.gcd === 1 ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {euclidResult.gcd === 1 ? 'نعم (لأن PGCD = 1)' : 'لا (لأن PGCD ≠ 1)'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <span className="text-xs font-semibold text-slate-600">اختزال الكسر:</span>
                <span dir="ltr" className="font-math text-sm font-bold text-slate-900 tabular-nums inline-flex items-center gap-1.5">
                  <VerticalFraction numerator={euclidResult.a} denominator={euclidResult.b} />
                  <span>=</span>
                  <VerticalFraction
                    numerator={euclidResult.a / euclidResult.gcd}
                    denominator={euclidResult.b / euclidResult.gcd}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
            <p className="text-xs font-bold text-slate-600 mb-3">خطوات خوارزمية إقليدس (القسمات المتتابعة):</p>
            <div className="space-y-2">
              {euclidResult.steps.map((s, idx) => {
                const isLastNonZero =
                  s.remainder !== 0 &&
                  euclidResult.steps[idx + 1] &&
                  euclidResult.steps[idx + 1].remainder === 0;
                const isZero = s.remainder === 0;
                const highlightGcd =
                  isLastNonZero || (euclidResult.steps.length === 1 && isZero);
                return (
                  <div
                    key={idx}
                    dir="ltr"
                    className={`flex items-center justify-between rounded-lg border px-4 py-2.5 font-math text-sm tabular-nums ${
                      highlightGcd
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>
                      {s.dividend} = {s.divisor} × {s.quotient} +{' '}
                      <span className={highlightGcd ? 'underline decoration-2' : ''}>{s.remainder}</span>
                    </span>
                    <span className="text-xs font-sans">
                      {isZero
                        ? 'توقف (الباقي 0)'
                        : isLastNonZero
                        ? 'آخر باقٍ غير معدوم'
                        : `خطوة ${idx + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRIGONOMETRY SIMULATOR */}
      {activeTab === 'trig' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-5 md:p-6 border-b lg:border-b-0 lg:border-l border-slate-200 bg-slate-50/40 flex flex-col justify-between">
            <div className="drafting-grid rounded-xl border border-slate-200 p-4 flex items-center justify-center min-h-[260px]">
              <svg viewBox="0 0 400 260" className="w-full max-w-[390px] h-auto" aria-label="مثلث قائم تفاعلي للنسب المثلثية">
                <polygon
                  points={`${rxA},${ryA} ${rxB},${ryB} ${rxC},${ryC}`}
                  fill="#f0f9ff"
                  fillOpacity="0.7"
                  stroke="#0f172a"
                  strokeWidth="2.2"
                />
                <polyline points={`${rxA},${ryA - 14} ${rxA + 14},${ryA - 14} ${rxA + 14},${ryA}`} fill="none" stroke="#0f172a" strokeWidth="1.8" />
                <text x={rxA - 14} y={ryA + 8} className="fill-slate-900 text-[13px] font-bold font-math">A</text>
                <text x={rxB + 10} y={ryB + 8} className="fill-sky-700 text-[13px] font-bold font-math">B ({angleDeg}°)</text>
                <text x={rxA - 14} y={ryC + 4} className="fill-slate-900 text-[13px] font-bold font-math">C</text>

                <text x={(rxA + rxB) / 2} y={ryA + 20} textAnchor="middle" className="fill-sky-700 text-[12px] font-bold font-math">
                  AB = {adjAB.toFixed(2)} cm
                </text>
                <text x={rxA - 10} y={(ryA + ryC) / 2} textAnchor="end" className="fill-amber-700 text-[12px] font-bold font-math">
                  AC = {oppAC.toFixed(2)}
                </text>
                <text x={(rxB + rxC) / 2 + 18} y={(ryB + ryC) / 2 - 8} className="fill-emerald-700 text-[12px] font-bold font-math">
                  BC = {hypotenuse} cm
                </text>
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1">
                <div className="text-[11px] text-slate-600 font-bold font-math">
                  <MathExpr expr="cos(B̂) = AB/BC" />
                </div>
                <p className="text-base font-bold text-sky-700 font-math tabular-nums">{cosVal.toFixed(3)}</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1">
                <div className="text-[11px] text-slate-600 font-bold font-math">
                  <MathExpr expr="sin(B̂) = AC/BC" />
                </div>
                <p className="text-base font-bold text-amber-700 font-math tabular-nums">{sinVal.toFixed(3)}</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1">
                <div className="text-[11px] text-slate-600 font-bold font-math">
                  <MathExpr expr="tan(B̂) = AC/AB" />
                </div>
                <p className="text-base font-bold text-emerald-700 font-math tabular-nums">{tanVal.toFixed(3)}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 md:p-6 flex flex-col justify-between gap-5">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>قيس الزاوية الحادة B̂:</span>
                  <span className="font-math text-sky-700 tabular-nums">{angleDeg}°</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={75}
                  step={1}
                  value={angleDeg}
                  onChange={(e) => setAngleDeg(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>طول الوتر BC:</span>
                  <span className="font-math text-emerald-700 tabular-nums">{hypotenuse} cm</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={1}
                  value={hypotenuse}
                  onChange={(e) => setHypotenuse(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
              <p className="font-bold text-slate-900">التحقق من العلاقتين المثلثيتين وفيثاغورس:</p>
              <p dir="ltr" className="font-math text-slate-700 tabular-nums">
                cos²({angleDeg}°) + sin²({angleDeg}°) = {(cosVal ** 2 + sinVal ** 2).toFixed(4)} = 1
              </p>
              <p dir="ltr" className="font-math text-slate-700 tabular-nums">
                AB² + AC² = {(adjAB ** 2 + oppAC ** 2).toFixed(1)} = BC² ({hypotenuse ** 2})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROOTS SIMPLIFIER */}
      {activeTab === 'roots' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">تبسيط جذر تربيعي إلى الشكل a√b</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">أدخل عدداً طبيعياً موجباً (n)</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={rootInput}
                onChange={(e) => setRootInput(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-math font-bold text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[27, 45, 75, 147, 180, 468].map((val) => (
                <button
                  key={val}
                  onClick={() => setRootInput(val)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 text-xs font-math font-semibold text-slate-700 transition-colors"
                >
                  √{val}
                </button>
              ))}
              <button
                onClick={() => setRootInput(75)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col justify-center gap-4">
            <p className="text-xs font-bold text-slate-600">التفكيك خطوة بخطوة:</p>
            <div dir="ltr" className="font-math text-lg md:text-xl font-bold text-slate-900 flex flex-wrap items-center gap-3">
              <span>√{rootRes.n}</span>
              {rootRes.outside > 1 ? (
                <>
                  <span>=</span>
                  <span className="text-slate-600">
                    √({rootRes.squareFactor} × {rootRes.inside})
                  </span>
                  <span>=</span>
                  <span className="text-slate-600">
                    √({rootRes.outside}² × {rootRes.inside})
                  </span>
                  <span>=</span>
                  <span className="rounded-lg bg-sky-50 border border-sky-300 px-3 py-1 text-sky-800">
                    {rootRes.inside === 1 ? rootRes.outside : `${rootRes.outside}√${rootRes.inside}`}
                  </span>
                </>
              ) : (
                <>
                  <span>=</span>
                  <span className="rounded-lg bg-slate-100 border border-slate-300 px-3 py-1 text-slate-800">
                    √{rootRes.n} (مبسط بالفعل)
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-600">
              {rootRes.inside === 1
                ? `العدد ${rootRes.n} مربع تام، جذره عدد طبيعي يساوي ${rootRes.outside}.`
                : rootRes.outside > 1
                ? `استخرجنا أكبر مربع تام قاسم للعدد وهو ${rootRes.squareFactor} = ${rootRes.outside}².`
                : `لا يوجد مربع تام أكبر من 1 يقسم ${rootRes.n}.`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { EXERCISES_LIST } from '../data/exercisesData';
import { ExerciseCategory } from '../types/curriculum';
import { MathText } from './MathText';
import { GeometryDiagram } from './GeometryDiagrams';

interface SolutionsSectionProps {
  focusedExerciseId: string | null;
  onBackToExercises: () => void;
}

const CATEGORIES: { id: ExerciseCategory; label: string }[] = [
  { id: 'all', label: 'كل الحلول' },
  { id: 'thales', label: 'طالس والعكسية' },
  { id: 'trigonometry', label: 'فيثاغورس والمثلثات' },
  { id: 'bem', label: 'مواضيع ووضعيات BEM' },
  { id: 'pgcd', label: 'PGCD والأعداد' },
  { id: 'roots', label: 'الجذور التربيعية' },
];

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  focusedExerciseId,
  onBackToExercises,
}) => {
  const [filter, setFilter] = useState<ExerciseCategory>('all');
  const [selectedId, setSelectedId] = useState<string>(
    focusedExerciseId || EXERCISES_LIST[0].id
  );

  const activeList =
    filter === 'all'
      ? EXERCISES_LIST
      : EXERCISES_LIST.filter((ex) => ex.category === filter);

  const currentExercise =
    EXERCISES_LIST.find((ex) => ex.id === selectedId) || activeList[0] || EXERCISES_LIST[0];

  return (
    <section className="py-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-emerald-700 mb-1">
            صفحة التصحيح والحلول النموذجية المفصلة
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            الإجابات المنهجية الكاملة خطوة بخطوة
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 max-w-full">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilter(cat.id);
                  const next =
                    cat.id === 'all'
                      ? EXERCISES_LIST[0]
                      : EXERCISES_LIST.find((e) => e.category === cat.id);
                  if (next) setSelectedId(next.id);
                }}
                className={`min-h-[42px] px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  filter === cat.id
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={onBackToExercises}
            className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            العودة للتمارين
          </button>
        </div>
      </div>

      {/* 2-Column Split: Right Sidebar list of Exercises + Left Detailed Model Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Column (in RTL): Solution Selector Sidebar */}
        <aside className="lg:col-span-4 space-y-2.5">
          <p className="text-xs font-bold text-slate-500 px-1">
            اختر التمرين لعرض حله ({activeList.length})
          </p>
          {activeList.map((ex) => {
            const active = ex.id === currentExercise.id;
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedId(ex.id)}
                className={`w-full text-right rounded-xl border p-3.5 transition-all ${
                  active
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <span className={`text-[11px] font-bold block mb-1 ${active ? 'text-emerald-800' : 'text-sky-700'}`}>
                  {ex.sourceLabel}
                </span>
                <p className="text-sm font-bold text-slate-900 leading-snug">{ex.title}</p>
              </button>
            );
          })}
        </aside>

        {/* Left Column (in RTL): Detailed Model Solution */}
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="lg:col-span-8 rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-sm"
        >
          <div className="p-5 md:p-6 border-b border-emerald-200 bg-emerald-50/50">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>التصحيح النموذجي · {currentExercise.sourceLabel}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{currentExercise.title}</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Reminder of Statement + Diagram */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500">تذكير بنص التمرين:</p>
              <div className={`grid grid-cols-1 ${currentExercise.diagramType ? 'md:grid-cols-12' : ''} gap-4 items-center`}>
                <div className={currentExercise.diagramType ? 'md:col-span-7 space-y-1.5' : 'space-y-1.5'}>
                  {currentExercise.statement.map((line, i) => (
                    <p key={i} className="text-sm text-slate-700 leading-relaxed">
                      <MathText text={line} />
                    </p>
                  ))}
                </div>
                {currentExercise.diagramType && (
                  <div className="md:col-span-5">
                    <GeometryDiagram type={currentExercise.diagramType} />
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-Step Solution */}
            <div className="space-y-5">
              {currentExercise.solutionSteps.map((step, sIdx) => (
                <div key={sIdx} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                  <h4 className="text-sm font-bold text-emerald-800">{step.heading}</h4>
                  <div className="space-y-1.5">
                    {step.lines.map((line, lIdx) => (
                      <p key={lIdx} className="text-sm md:text-base text-slate-800 leading-relaxed">
                        <MathText text={line} />
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Answer */}
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-bold text-emerald-900">النتيجة النهائية المعتمدة:</span>
              <span dir="ltr" className="font-math text-base font-bold text-emerald-950 bg-white border border-emerald-300 px-4 py-2 rounded-lg inline-flex flex-wrap items-center">
                <MathText text={currentExercise.finalAnswer} />
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

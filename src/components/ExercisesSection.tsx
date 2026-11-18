import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { EXERCISES_LIST } from '../data/exercisesData';
import { ExerciseCategory, ExerciseItem } from '../types/curriculum';
import { MathText } from './MathText';
import { GeometryDiagram } from './GeometryDiagrams';

interface ExercisesSectionProps {
  solvedIds: string[];
  onMarkSolved: (id: string) => void;
  onOpenSolution: (exerciseId: string) => void;
}

const CATEGORIES: { id: ExerciseCategory; label: string }[] = [
  { id: 'all', label: 'جميع التمارين' },
  { id: 'thales', label: 'طالس والعكسية' },
  { id: 'trigonometry', label: 'فيثاغورس والمثلثات' },
  { id: 'bem', label: 'مواضيع ووضعيات BEM' },
  { id: 'pgcd', label: 'PGCD والأعداد' },
  { id: 'roots', label: 'الجذور التربيعية' },
];

const ExerciseCard: React.FC<{
  item: ExerciseItem;
  isSolved: boolean;
  onMarkSolved: (id: string) => void;
  onOpenSolution: (exerciseId: string) => void;
}> = ({ item, isSolved, onMarkSolved, onOpenSolution }) => {
  const [showHint, setShowHint] = useState(false);
  const [numericInput, setNumericInput] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleCheck = () => {
    const q = item.checkQuestion;
    if (q.choices && q.correctChoiceIndex !== undefined) {
      if (selectedChoice === null) return;
      if (selectedChoice === q.correctChoiceIndex) {
        setFeedback('correct');
        onMarkSolved(item.id);
      } else {
        setFeedback('wrong');
      }
      return;
    }

    if (q.expectedValue !== undefined) {
      const normalized = parseFloat(numericInput.replace(',', '.').trim());
      if (Number.isNaN(normalized)) return;
      const tol = q.tolerance ?? 0.05;
      if (Math.abs(normalized - q.expectedValue) <= tol) {
        setFeedback('correct');
        onMarkSolved(item.id);
      } else {
        setFeedback('wrong');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
    >
      <div className="p-5 md:p-6 border-b border-slate-200 bg-sky-50/40 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-1">
            <span className="font-bold text-sky-700">{item.sourceLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{item.difficulty}</span>
            {isSolved && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تم الحل
                </span>
              </>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
        </div>

        <button
          onClick={() => onOpenSolution(item.id)}
          className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 text-xs font-bold text-emerald-800 transition-colors whitespace-nowrap shrink-0"
        >
          عرض التصحيح في صفحة الحلول
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-5 md:p-6 space-y-5">
        <div className={`grid grid-cols-1 ${item.diagramType ? 'lg:grid-cols-12' : ''} gap-6 items-start`}>
          <div className={item.diagramType ? 'lg:col-span-7 space-y-3' : 'space-y-3'}>
            {item.statement.map((line, i) => (
              <p key={i} className="text-sm md:text-base text-slate-800 leading-relaxed">
                <MathText text={line} />
              </p>
            ))}
          </div>
          {item.diagramType && (
            <div className="lg:col-span-5">
              <GeometryDiagram type={item.diagramType} />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs md:text-sm font-bold text-slate-900">
              اختبر نتيجتك: <MathText text={item.checkQuestion.prompt} />
            </p>
            <button
              onClick={() => setShowHint((h) => !h)}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'إخفاء التلميح' : 'تلميح للمساعدة'}
            </button>
          </div>

          {showHint && (
            <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <MathText text={item.checkQuestion.hint} />
            </p>
          )}

          {item.checkQuestion.choices ? (
            <div className="space-y-2">
              {item.checkQuestion.choices.map((choice, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm cursor-pointer transition-colors ${
                    selectedChoice === idx
                      ? 'bg-sky-50 border-sky-400 text-slate-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`choice-${item.id}`}
                    checked={selectedChoice === idx}
                    onChange={() => {
                      setSelectedChoice(idx);
                      setFeedback(null);
                    }}
                    className="accent-sky-600"
                  />
                  <span>
                    <MathText text={choice} />
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                dir="ltr"
                placeholder="أدخل النتيجة الرقمية..."
                value={numericInput}
                onChange={(e) => {
                  setNumericInput(e.target.value);
                  setFeedback(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-math font-bold text-slate-900 focus:outline-none focus:border-sky-600"
              />
              {item.checkQuestion.unit && (
                <span className="text-xs font-math font-bold text-slate-600">
                  {item.checkQuestion.unit}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleCheck}
              className="min-h-[44px] rounded-lg bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0"
            >
              تحقق من الإجابة
            </button>

            {feedback === 'correct' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                أحسنت! إجابة صحيحة
              </span>
            )}
            {feedback === 'wrong' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700">
                <XCircle className="w-4 h-4 shrink-0" />
                حاول مجدداً أو راجع التصحيح في صفحة الحلول
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({
  solvedIds,
  onMarkSolved,
  onOpenSolution,
}) => {
  const [filter, setFilter] = useState<ExerciseCategory>('all');

  const filtered =
    filter === 'all'
      ? EXERCISES_LIST
      : EXERCISES_LIST.filter((ex) => ex.category === filter);

  return (
    <section className="py-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-sky-700 mb-1">
            صفحة التمارين التطبيقية ومواضيع شهادة التعليم المتوسط
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            تدرّب أولاً ثم انتقل إلى صفحة التصحيح لمقارنة خطواتك
          </h2>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`min-h-[42px] px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === cat.id
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((item) => (
          <ExerciseCard
            key={item.id}
            item={item}
            isSolved={solvedIds.includes(item.id)}
            onMarkSolved={onMarkSolved}
            onOpenSolution={onOpenSolution}
          />
        ))}
      </div>
    </section>
  );
};

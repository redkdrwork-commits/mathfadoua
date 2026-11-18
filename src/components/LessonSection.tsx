import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  AlertCircle,
  BookOpen,
  Film,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { LESSON_MODULES } from '../data/curriculumData';
import { LessonModule, ModuleId, VideoEpisodeId } from '../types/curriculum';
import { MathExpr, MathText } from './MathText';
import { GeometryDiagram } from './GeometryDiagrams';

interface LessonSectionProps {
  activeModuleId: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  onWatchVideo: (videoId: VideoEpisodeId) => void;
  onGoToExercises: () => void;
}

type AccentTheme = {
  badge: string;
  border: string;
  bgSoft: string;
  bannerBg: string;
  topBar: string;
  btn: string;
  chipActive: string;
  stepBg: string;
  stepBorder: string;
  stepCircle: string;
  stepHeading: string;
};

const ACCENT_STYLES: Record<LessonModule['accentColor'], AccentTheme> = {
  sky: {
    badge: 'text-sky-700',
    border: 'border-sky-300',
    bgSoft: 'bg-sky-50/80',
    bannerBg: 'bg-gradient-to-l from-sky-100/80 via-sky-50/70 to-white',
    topBar: 'bg-sky-600',
    btn: 'bg-sky-600 hover:bg-sky-700',
    chipActive: 'bg-sky-600 text-white border-sky-600',
    stepBg: 'bg-sky-50/60',
    stepBorder: 'border-sky-200',
    stepCircle: 'bg-sky-600 text-white',
    stepHeading: 'text-sky-950',
  },
  violet: {
    badge: 'text-violet-700',
    border: 'border-violet-300',
    bgSoft: 'bg-violet-50/80',
    bannerBg: 'bg-gradient-to-l from-violet-100/80 via-violet-50/70 to-white',
    topBar: 'bg-violet-600',
    btn: 'bg-violet-600 hover:bg-violet-700',
    chipActive: 'bg-violet-600 text-white border-violet-600',
    stepBg: 'bg-violet-50/60',
    stepBorder: 'border-violet-200',
    stepCircle: 'bg-violet-600 text-white',
    stepHeading: 'text-violet-950',
  },
  teal: {
    badge: 'text-teal-700',
    border: 'border-teal-300',
    bgSoft: 'bg-teal-50/80',
    bannerBg: 'bg-gradient-to-l from-teal-100/80 via-teal-50/70 to-white',
    topBar: 'bg-teal-600',
    btn: 'bg-teal-600 hover:bg-teal-700',
    chipActive: 'bg-teal-600 text-white border-teal-600',
    stepBg: 'bg-teal-50/60',
    stepBorder: 'border-teal-200',
    stepCircle: 'bg-teal-600 text-white',
    stepHeading: 'text-teal-950',
  },
  indigo: {
    badge: 'text-indigo-700',
    border: 'border-indigo-300',
    bgSoft: 'bg-indigo-50/80',
    bannerBg: 'bg-gradient-to-l from-indigo-100/80 via-indigo-50/70 to-white',
    topBar: 'bg-indigo-600',
    btn: 'bg-indigo-600 hover:bg-indigo-700',
    chipActive: 'bg-indigo-600 text-white border-indigo-600',
    stepBg: 'bg-indigo-50/60',
    stepBorder: 'border-indigo-200',
    stepCircle: 'bg-indigo-600 text-white',
    stepHeading: 'text-indigo-950',
  },
  emerald: {
    badge: 'text-emerald-700',
    border: 'border-emerald-300',
    bgSoft: 'bg-emerald-50/80',
    bannerBg: 'bg-gradient-to-l from-emerald-100/80 via-emerald-50/70 to-white',
    topBar: 'bg-emerald-600',
    btn: 'bg-emerald-600 hover:bg-emerald-700',
    chipActive: 'bg-emerald-600 text-white border-emerald-600',
    stepBg: 'bg-emerald-50/60',
    stepBorder: 'border-emerald-200',
    stepCircle: 'bg-emerald-600 text-white',
    stepHeading: 'text-emerald-950',
  },
  amber: {
    badge: 'text-amber-700',
    border: 'border-amber-300',
    bgSoft: 'bg-amber-50/80',
    bannerBg: 'bg-gradient-to-l from-amber-100/80 via-amber-50/70 to-white',
    topBar: 'bg-amber-600',
    btn: 'bg-amber-600 hover:bg-amber-700',
    chipActive: 'bg-amber-600 text-white border-amber-600',
    stepBg: 'bg-amber-50/60',
    stepBorder: 'border-amber-200',
    stepCircle: 'bg-amber-600 text-white',
    stepHeading: 'text-amber-950',
  },
  rose: {
    badge: 'text-rose-700',
    border: 'border-rose-300',
    bgSoft: 'bg-rose-50/80',
    bannerBg: 'bg-gradient-to-l from-rose-100/80 via-rose-50/70 to-white',
    topBar: 'bg-rose-600',
    btn: 'bg-rose-600 hover:bg-rose-700',
    chipActive: 'bg-rose-600 text-white border-rose-600',
    stepBg: 'bg-rose-50/60',
    stepBorder: 'border-rose-200',
    stepCircle: 'bg-rose-600 text-white',
    stepHeading: 'text-rose-950',
  },
};

const RULE_PALETTES = [
  {
    card: 'border-sky-200 bg-sky-50/70',
    label: 'text-sky-900',
    num: 'bg-sky-600 text-white',
    expr: 'border-sky-300 bg-white text-sky-950',
  },
  {
    card: 'border-violet-200 bg-violet-50/70',
    label: 'text-violet-900',
    num: 'bg-violet-600 text-white',
    expr: 'border-violet-300 bg-white text-violet-950',
  },
  {
    card: 'border-teal-200 bg-teal-50/70',
    label: 'text-teal-900',
    num: 'bg-teal-600 text-white',
    expr: 'border-teal-300 bg-white text-teal-950',
  },
  {
    card: 'border-amber-200 bg-amber-50/70',
    label: 'text-amber-900',
    num: 'bg-amber-600 text-white',
    expr: 'border-amber-300 bg-white text-amber-950',
  },
];

export const LessonSection: React.FC<LessonSectionProps> = ({
  activeModuleId,
  onSelectModule,
  onWatchVideo,
  onGoToExercises,
}) => {
  const activeModule =
    LESSON_MODULES.find((m) => m.id === activeModuleId) || LESSON_MODULES[0];

  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    activeModule.blocks[0].id
  );
  const [showTipsView, setShowTipsView] = useState<boolean>(false);
  const [exampleOpen, setExampleOpen] = useState<boolean>(true);

  useEffect(() => {
    const existsInModule = activeModule.blocks.some((b) => b.id === selectedBlockId);
    if (!existsInModule) {
      setSelectedBlockId(activeModule.blocks[0].id);
      setShowTipsView(false);
    }
  }, [activeModule, selectedBlockId]);

  const handleChooseModule = (modId: ModuleId, firstBlockId?: string) => {
    onSelectModule(modId);
    const mod = LESSON_MODULES.find((m) => m.id === modId) || LESSON_MODULES[0];
    setSelectedBlockId(firstBlockId || mod.blocks[0].id);
    setShowTipsView(false);
    setExampleOpen(true);
  };

  const handleChooseBlock = (modId: ModuleId, blockId: string) => {
    if (modId !== activeModuleId) onSelectModule(modId);
    setSelectedBlockId(blockId);
    setShowTipsView(false);
    setExampleOpen(true);
  };

  const currentBlockIndex = Math.max(
    0,
    activeModule.blocks.findIndex((b) => b.id === selectedBlockId)
  );
  const currentBlock = activeModule.blocks[currentBlockIndex] || activeModule.blocks[0];
  const accent = ACCENT_STYLES[activeModule.accentColor];

  const hasPrevBlock = showTipsView || currentBlockIndex > 0;
  const hasNextBlock = !showTipsView;

  const goPrev = () => {
    if (showTipsView) {
      setShowTipsView(false);
      setSelectedBlockId(activeModule.blocks[activeModule.blocks.length - 1].id);
    } else if (currentBlockIndex > 0) {
      setSelectedBlockId(activeModule.blocks[currentBlockIndex - 1].id);
    }
  };

  const goNext = () => {
    if (!showTipsView && currentBlockIndex < activeModule.blocks.length - 1) {
      setSelectedBlockId(activeModule.blocks[currentBlockIndex + 1].id);
    } else if (!showTipsView) {
      setShowTipsView(true);
    }
  };

  return (
    <section className="py-5 md:py-8">
      {/* MOBILE COURSE & LESSON PICKER (< lg): Swipeable & Touch-Friendly */}
      <div className="lg:hidden mb-5 space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800">
              اختر المحور الدراسي ({LESSON_MODULES.length} محاور)
            </span>
            <span className={`font-math text-xs font-bold ${accent.badge}`}>
              المحور {activeModule.number}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {LESSON_MODULES.map((mod) => {
              const isModActive = mod.id === activeModule.id;
              const modAccent = ACCENT_STYLES[mod.accentColor];
              return (
                <button
                  key={mod.id}
                  onClick={() => handleChooseModule(mod.id)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    isModActive
                      ? modAccent.chipActive
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-math ml-1.5 opacity-80">{mod.number}</span>
                  {mod.shortTitle}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-0.5">
            {activeModule.blocks.map((blk, i) => {
              const isBlkActive = !showTipsView && blk.id === currentBlock.id;
              return (
                <button
                  key={blk.id}
                  onClick={() => handleChooseBlock(activeModule.id, blk.id)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    isBlkActive
                      ? `${accent.border} ${accent.bgSoft} text-slate-900`
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  الدرس {i + 1}
                </button>
              );
            })}
            <button
              onClick={() => setShowTipsView(true)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                showTipsView
                  ? `${accent.border} ${accent.bgSoft} text-slate-900`
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              الخلاصة والنصائح
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP 2-COLUMN LAYOUT: Right Column = Course Picker Sidebar (first in RTL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* RIGHT SIDEBAR COLUMN (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <p className="text-xs font-bold text-sky-700 mb-0.5">فهرس الدروس</p>
              <h2 className="text-base font-bold text-slate-900">
                اختر المحور والدرس
              </h2>
            </div>

            <nav className="space-y-2.5" aria-label="قائمة المحاور والدروس">
              {LESSON_MODULES.map((mod) => {
                const isModActive = mod.id === activeModule.id;
                const modAccent = ACCENT_STYLES[mod.accentColor];
                return (
                  <div
                    key={mod.id}
                    className={`rounded-xl border transition-colors ${
                      isModActive
                        ? `${modAccent.border} ${modAccent.bgSoft}`
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <button
                      onClick={() => handleChooseModule(mod.id)}
                      className="w-full text-right p-3 flex items-center justify-between gap-2 min-h-[44px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold font-math shrink-0 ${
                            isModActive ? modAccent.topBar + ' text-white' : 'bg-white border border-slate-200 ' + modAccent.badge
                          }`}
                        >
                          {mod.number}
                        </span>
                        <span className="text-sm font-bold text-slate-900 leading-snug">
                          {mod.shortTitle}
                        </span>
                      </div>
                      <span className="text-[11px] font-math text-slate-500 tabular-nums shrink-0">
                        {mod.blocks.length} دروس
                      </span>
                    </button>

                    {isModActive && (
                      <div className="px-2.5 pb-2.5 space-y-1 border-t border-slate-200/70 pt-2">
                        {mod.blocks.map((blk) => {
                          const isBlkActive = !showTipsView && blk.id === currentBlock.id;
                          return (
                            <button
                              key={blk.id}
                              onClick={() => handleChooseBlock(mod.id, blk.id)}
                              className={`w-full text-right rounded-lg px-2.5 py-2 text-xs transition-colors min-h-[38px] ${
                                isBlkActive
                                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                                  : 'text-slate-700 hover:bg-white/80 font-medium'
                              }`}
                            >
                              {blk.title}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setShowTipsView(true)}
                          className={`w-full text-right rounded-lg px-2.5 py-2 text-xs transition-colors min-h-[38px] ${
                            showTipsView
                              ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                              : 'text-slate-700 hover:bg-white/80 font-medium'
                          }`}
                        >
                          الخلاصة، النصائح والأخطاء الشائعة
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={onGoToExercises}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                الانتقال إلى صفحة التمارين
              </button>
            </div>
          </div>
        </aside>

        {/* LEFT MAIN STAGE: Vivid, Colorful Single-Lesson View */}
        <div className="lg:col-span-8 xl:col-span-9 min-w-0">
          {/* Colorful Module Banner */}
          <div className={`rounded-2xl border ${accent.border} ${accent.bannerBg} p-4 sm:p-6 mb-5 md:mb-6 overflow-hidden relative`}>
            <div className={`h-1.5 w-full absolute top-0 right-0 left-0 ${accent.topBar}`} />
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <BookOpen className={`w-4 h-4 ${accent.badge}`} />
                <span className={accent.badge}>المحور {activeModule.number}</span>
                <span aria-hidden="true">·</span>
                <span>السنة الرابعة متوسط — الجيل الثاني</span>
              </div>
              {!showTipsView && currentBlock.relatedVideoId && (
                <button
                  onClick={() => onWatchVideo(currentBlock.relatedVideoId!)}
                  className="min-h-[40px] inline-flex items-center gap-1.5 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
                >
                  <Film className="w-3.5 h-3.5 shrink-0" />
                  شاهد الفيديو المتحرك لهذا الدرس
                </button>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              {activeModule.title}
            </h2>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-3xl">
              {activeModule.summary}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showTipsView ? (
              <motion.article
                key={currentBlock.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-xs space-y-7 md:space-y-8"
              >
                {/* Lesson Title & Rich Highlighted Explanation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Sparkles className={`w-4 h-4 shrink-0 ${accent.badge}`} />
                    <span className={accent.badge}>{currentBlock.subtitle}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                    {currentBlock.title}
                  </h3>
                  <div className={`rounded-xl border ${accent.border} ${accent.bgSoft} p-4 sm:p-5`}>
                    <p className="text-sm sm:text-base text-slate-800 leading-loose max-w-4xl">
                      <MathText text={currentBlock.explanation} />
                    </p>
                  </div>
                </div>

                {/* Color-Coded Key Rules & Visual Diagram */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  <div
                    className={
                      currentBlock.diagramType
                        ? 'xl:col-span-6 space-y-3'
                        : 'xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4'
                    }
                  >
                    {currentBlock.keyRules.map((rule, idx) => {
                      const pal = RULE_PALETTES[idx % RULE_PALETTES.length];
                      return (
                        <div
                          key={idx}
                          className={`rounded-xl border ${pal.card} p-4 space-y-2.5`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-bold font-math shrink-0 ${pal.num}`}
                            >
                              {idx + 1}
                            </span>
                            <span className={`text-xs sm:text-sm font-bold ${pal.label}`}>
                              {rule.label}
                            </span>
                          </div>
                          <div
                            dir="ltr"
                            className={`font-math text-sm md:text-base font-bold ${pal.expr} border rounded-lg px-3 py-3 text-center shadow-2xs overflow-x-auto`}
                          >
                            <MathExpr expr={rule.expression} />
                          </div>
                          {rule.note && (
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                              <MathText text={rule.note} />
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {currentBlock.diagramType && (
                    <div className="xl:col-span-6">
                      <GeometryDiagram type={currentBlock.diagramType} />
                    </div>
                  )}
                </div>

                {/* Colorful Method Steps */}
                {currentBlock.stepsList && (
                  <div className={`rounded-xl border ${accent.stepBorder} ${accent.stepBg} p-4 sm:p-5 md:p-6`}>
                    <h4 className={`text-sm sm:text-base font-bold ${accent.stepHeading} mb-4`}>
                      {currentBlock.stepsList.title}
                    </h4>
                    <ol className="space-y-3">
                      {currentBlock.stepsList.items.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 bg-white/80 rounded-xl p-3 border border-white shadow-2xs">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold font-math shrink-0 mt-0.5 ${accent.stepCircle}`}
                          >
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">
                            <MathText text={step} />
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Vibrant Worked Example */}
                {currentBlock.workedExample && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/35 overflow-hidden">
                    <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-l from-emerald-100/75 via-teal-50/70 to-white border-b border-emerald-200">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 block mb-0.5">
                          مثال تطبيقي محلول خطوة بخطوة
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {currentBlock.workedExample.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => setExampleOpen((o) => !o)}
                        className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-xs font-bold text-emerald-900 transition-colors"
                      >
                        {exampleOpen ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            إخفاء الحل
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            إظهار الحل
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 sm:p-5 space-y-4">
                      <p className="text-sm md:text-base font-semibold text-slate-900 leading-relaxed bg-white rounded-xl border border-emerald-100 p-3.5">
                        <MathText text={currentBlock.workedExample.statement} />
                      </p>

                      {exampleOpen && (
                        <div className="pt-2 space-y-2.5">
                          {currentBlock.workedExample.steps.map((line, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-start gap-2.5 text-sm text-slate-800 leading-relaxed bg-white/90 rounded-lg border border-slate-200/80 p-3"
                            >
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-600 text-white font-math text-[11px] font-bold mt-0.5 shrink-0">
                                {sIdx + 1}
                              </span>
                              <span>
                                <MathText text={line} />
                              </span>
                            </div>
                          ))}
                          <div className="mt-3 p-3.5 rounded-xl bg-emerald-600 text-white flex flex-wrap items-center justify-between gap-2 shadow-xs">
                            <span className="text-xs font-bold">النتيجة النهائية:</span>
                            <span
                              dir="ltr"
                              className="font-math text-sm font-bold text-emerald-950 bg-white px-3 py-1.5 rounded-lg inline-flex flex-wrap items-center"
                            >
                              <MathText text={currentBlock.workedExample.finalResult} />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Lesson Footer Navigation */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={goPrev}
                    disabled={!hasPrevBlock}
                    className={`min-h-[44px] inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold transition-colors ${
                      hasPrevBlock
                        ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                        : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                    الدرس السابق
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!hasNextBlock}
                    className={`min-h-[44px] inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-colors ${accent.btn}`}
                  >
                    {currentBlockIndex === activeModule.blocks.length - 1
                      ? 'الخلاصة والنصائح الذهبية'
                      : 'الدرس التالي'}
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ) : (
              <motion.div
                key={`${activeModule.id}-summary`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-xs space-y-7 md:space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    خلاصة المحور: {activeModule.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    أهم القواعد التي يجب تذكرها مع الأخطاء الشائعة في الامتحان.
                  </p>
                </div>

                {activeModule.comparisonTable && (
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-3">
                      جدول المقارنة السريع
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-right border-collapse min-w-[460px]">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-800">
                            {activeModule.comparisonTable.headers.map((head, i) => (
                              <th key={i} className="px-4 py-3">
                                {head}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-sm">
                          {activeModule.comparisonTable.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/70">
                              <td className="px-4 py-3 font-bold text-slate-900">{row.property}</td>
                              <td className="px-4 py-3 text-slate-700">
                                <MathText text={row.given} />
                              </td>
                              <td className={`px-4 py-3 font-semibold ${accent.badge}`}>
                                <MathText text={row.result} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 mb-3">
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>نصائح ذهبية للامتحان</span>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-800">
                      {activeModule.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <span className="font-math text-xs font-bold text-emerald-700 mt-1">•</span>
                          <span>
                            <MathText text={tip} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-red-900 mb-3">
                      <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                      <span>أخطاء شائعة تجنبها</span>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-800">
                      {activeModule.commonMistakes.map((err, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <span className="font-math text-xs font-bold text-red-700 mt-1">×</span>
                          <span>
                            <MathText text={err} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={goPrev}
                    className="min-h-[44px] inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 text-xs font-bold transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    العودة للدرس الأخير
                  </button>
                  <button
                    onClick={onGoToExercises}
                    className={`min-h-[44px] inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold text-white transition-colors ${accent.btn}`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    انتقل لحل تمارين هذا المحور
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

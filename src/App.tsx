import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Compass, CheckSquare, FileCheck2 } from 'lucide-react';
import { EXERCISES_LIST } from './data/exercisesData';
import { ModuleId, PageView, VideoEpisodeId } from './types/curriculum';
import { LessonSection } from './components/LessonSection';
import { MiniVideoPlayer } from './components/MiniVideoPlayer';
import { InteractiveLab } from './components/InteractiveLab';
import { ExercisesSection } from './components/ExercisesSection';
import { SolutionsSection } from './components/SolutionsSection';

const STORAGE_KEY = 'zibani_fadoua_4am_solved_v1';

const NAV_ITEMS: { id: PageView; label: string }[] = [
  { id: 'lessons', label: 'الدروس' },
  { id: 'videos', label: 'الفيديوهات المتحركة' },
  { id: 'lab', label: 'المختبر التفاعلي' },
  { id: 'exercises', label: 'التمارين' },
  { id: 'solutions', label: 'الحلول النموذجية' },
];

export default function App() {
  const [activePage, setActivePage] = useState<PageView>('lessons');
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('thales');
  const [activeVideoId, setActiveVideoId] = useState<VideoEpisodeId>('thales-shapes');
  const [focusedExerciseId, setFocusedExerciseId] = useState<string | null>(null);

  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(solvedIds));
    } catch {
      // ignore storage quota errors
    }
  }, [solvedIds]);

  const navigateTo = (page: PageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkSolved = (id: string) => {
    setSolvedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleWatchVideo = (videoId: VideoEpisodeId) => {
    setActiveVideoId(videoId);
    navigateTo('videos');
  };

  const handleJumpToLesson = (moduleId: ModuleId) => {
    setActiveModuleId(moduleId);
    navigateTo('lessons');
  };

  const handleOpenSolution = (exerciseId: string) => {
    setFocusedExerciseId(exerciseId);
    navigateTo('solutions');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col overflow-x-hidden">
      {/* Top Bar Contract: Strictly 1 row sticky on all viewports (3 zones separated by gap-4/8) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Title */}
          <button
            onClick={() => navigateTo('lessons')}
            className="min-h-[44px] flex items-center text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-sky-700 transition-colors"
          >
            رياضيات 4 متوسط
          </button>

          {/* Zone 2: 5 clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
            {NAV_ITEMS.map((item) => {
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    active
                      ? 'text-sky-700 border-sky-600'
                      : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => navigateTo('exercises')}
              className="min-h-[42px] px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              تدرّب الآن
            </button>
          </div>
        </div>
      </header>

      {/* Non-sticky Mobile Navigation Bar (scrolls naturally, keeps sticky header < 10% viewport height) */}
      <nav
        aria-label="التنقل على الهاتف"
        className="md:hidden border-b border-slate-200 bg-white px-3 py-2 flex items-center gap-1.5 overflow-x-auto"
      >
        {NAV_ITEMS.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`min-h-[42px] px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-12">
        {/* Welcome Hero Banner on Lessons Page */}
        {activePage === 'lessons' && (
          <section className="pt-8 pb-4">
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-l from-sky-50 via-white to-indigo-50/70 p-6 md:p-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <p className="text-sm font-bold text-sky-700">
                    الفضاء التعليمي لـ زيباني فدوى (Zibani Fadoua) · السنة الرابعة متوسط — الجيل الثاني
                  </p>
                  <h1
                    style={{ textWrap: 'balance' }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-snug"
                  >
                    منهجية منظمة لدروس الرياضيات — الفصل الأول مع فيديوهات متحركة وتمارين مفصولة عن الحلول
                  </h1>
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-2xl">
                    استخدم العمود الأيمن لاختيار أي درس تقرؤه بأريحية دون تكديس، وتنقل بحرية إلى صفحة الفيديوهات التوضيحية، المختبر الهندسي، صفحة التمارين، وصفحة الحلول النموذجية المستقلة.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      onClick={() => navigateTo('videos')}
                      className="min-h-[44px] inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                    >
                      <Film className="w-4 h-4" />
                      صفحة الفيديوهات (10 مقاطع)
                    </button>
                    <button
                      onClick={() => navigateTo('lab')}
                      className="min-h-[44px] inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white hover:bg-sky-50 text-sky-800 px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                    >
                      <Compass className="w-4 h-4" />
                      المختبر الهندسي
                    </button>
                    <button
                      onClick={() => navigateTo('exercises')}
                      className="min-h-[44px] inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                    >
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                      صفحة التمارين
                    </button>
                    <button
                      onClick={() => navigateTo('solutions')}
                      className="min-h-[44px] inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      صفحة التصحيح والحلول
                    </button>
                  </div>
                </div>

                {/* Animated Geometric Preview */}
                <div className="lg:col-span-4">
                  <div className="drafting-grid rounded-xl border border-sky-200 bg-white p-4 flex flex-col items-center">
                    <svg viewBox="0 0 260 170" className="w-full max-w-[240px] h-auto" aria-label="رسم متحرك لخاصية طالس">
                      <polygon points="130,18 42,148 218,148" fill="#e0f2fe" fillOpacity="0.65" stroke="#0f172a" strokeWidth="2" />
                      <motion.line
                        x1="82"
                        y1="88"
                        x2="178"
                        y2="88"
                        stroke="#0284c7"
                        strokeWidth="3"
                        animate={{
                          y1: [68, 114, 68],
                          y2: [68, 114, 68],
                          x1: [96, 66, 96],
                          x2: [164, 194, 164],
                        }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <circle cx="130" cy="18" r="4" fill="#0f172a" />
                      <circle cx="42" cy="148" r="4" fill="#0f172a" />
                      <circle cx="218" cy="148" r="4" fill="#0f172a" />
                      <text x="130" y="13" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold font-math">A</text>
                      <text x="30" y="152" className="fill-slate-900 text-[11px] font-bold font-math">B</text>
                      <text x="224" y="152" className="fill-slate-900 text-[11px] font-bold font-math">C</text>
                      <g>
                        <text x="106" y="128" textAnchor="middle" className="fill-sky-800 text-[10px] font-bold font-math">AM</text>
                        <line x1="94" y1="131" x2="118" y2="131" stroke="#075985" strokeWidth="1.4" />
                        <text x="106" y="142" textAnchor="middle" className="fill-sky-800 text-[10px] font-bold font-math">AB</text>
                        <text x="130" y="135" textAnchor="middle" className="fill-sky-800 text-[11px] font-bold font-math">=</text>
                        <text x="154" y="128" textAnchor="middle" className="fill-sky-800 text-[10px] font-bold font-math">AN</text>
                        <line x1="142" y1="131" x2="166" y2="131" stroke="#075985" strokeWidth="1.4" />
                        <text x="154" y="142" textAnchor="middle" className="fill-sky-800 text-[10px] font-bold font-math">AC</text>
                      </g>
                    </svg>
                    <div className="mt-2 pt-2 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-600">
                      <span>التمارين المنجزة:</span>
                      <span className="font-math font-bold text-emerald-700 tabular-nums">
                        {solvedIds.length} / {EXERCISES_LIST.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Active Page View with Smooth Motion Transition */}
        <AnimatePresence mode="wait">
          {activePage === 'lessons' && (
            <motion.div
              key="page-lessons"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <LessonSection
                activeModuleId={activeModuleId}
                onSelectModule={setActiveModuleId}
                onWatchVideo={handleWatchVideo}
                onGoToExercises={() => navigateTo('exercises')}
              />
            </motion.div>
          )}

          {activePage === 'videos' && (
            <motion.div
              key="page-videos"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MiniVideoPlayer
                initialEpisodeId={activeVideoId}
                onJumpToLesson={handleJumpToLesson}
              />
            </motion.div>
          )}

          {activePage === 'lab' && (
            <motion.div
              key="page-lab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <InteractiveLab />
            </motion.div>
          )}

          {activePage === 'exercises' && (
            <motion.div
              key="page-exercises"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ExercisesSection
                solvedIds={solvedIds}
                onMarkSolved={handleMarkSolved}
                onOpenSolution={handleOpenSolution}
              />
            </motion.div>
          )}

          {activePage === 'solutions' && (
            <motion.div
              key="page-solutions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SolutionsSection
                focusedExerciseId={focusedExerciseId}
                onBackToExercises={() => navigateTo('exercises')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="text-center sm:text-right">
            <p className="font-bold text-slate-900 mb-0.5">
              زيباني فدوى (Zibani Fadoua) — بوابة رياضيات السنة الرابعة متوسط
            </p>
            <p>منهاج الجيل الثاني · الفصل الأول · دروس مفصلة، فيديوهات متحركة، وتمارين مستقلة عن صفحة الحلول</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-bold">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className="hover:text-sky-700 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

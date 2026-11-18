export type ModuleId =
  | 'thales'
  | 'thales-converse'
  | 'pythagoras'
  | 'pgcd'
  | 'roots'
  | 'trigonometry'
  | 'algebra';

export type PageView = 'lessons' | 'videos' | 'lab' | 'exercises' | 'solutions';

export interface FormulaItem {
  label: string;
  expression: string;
  note?: string;
}

export interface ComparisonRow {
  property: string;
  given: string;
  result: string;
}

export interface WorkedExample {
  title: string;
  statement: string;
  steps: string[];
  finalResult: string;
  diagramType?: string;
}

export interface LessonBlock {
  id: string;
  title: string;
  subtitle: string;
  explanation: string;
  keyRules: FormulaItem[];
  diagramType?: string;
  relatedVideoId?: VideoEpisodeId;
  workedExample?: WorkedExample;
  stepsList?: {
    title: string;
    items: string[];
  };
}

export interface LessonModule {
  id: ModuleId;
  number: string;
  title: string;
  shortTitle: string;
  accentColor: 'sky' | 'violet' | 'teal' | 'indigo' | 'emerald' | 'amber' | 'rose';
  summary: string;
  blocks: LessonBlock[];
  comparisonTable?: {
    headers: [string, string, string];
    rows: ComparisonRow[];
  };
  tips: string[];
  commonMistakes: string[];
}

export type ExerciseCategory = 'all' | 'thales' | 'pgcd' | 'roots' | 'trigonometry' | 'bem';

export interface ExerciseCheckQuestion {
  prompt: string;
  expectedValue?: number;
  tolerance?: number;
  unit?: string;
  choices?: string[];
  correctChoiceIndex?: number;
  hint: string;
}

export interface ExerciseItem {
  id: string;
  category: Exclude<ExerciseCategory, 'all'>;
  sourceLabel: string;
  title: string;
  difficulty: 'تطبيق مباشر' | 'مستوى متوسط' | 'وضعية إدماجية';
  statement: string[];
  diagramType?: string;
  checkQuestion: ExerciseCheckQuestion;
  solutionSteps: {
    heading: string;
    lines: string[];
  }[];
  finalAnswer: string;
}

export type VideoEpisodeId =
  | 'thales-shapes'
  | 'thales-converse'
  | 'thales-shadow'
  | 'thales-division'
  | 'pythagoras-squares'
  | 'pgcd-euclid'
  | 'roots-tricks'
  | 'roots-conjugate'
  | 'trig-sohcahtoa'
  | 'algebra-factor';

export interface VideoScene {
  startPct: number;
  endPct: number;
  title: string;
  caption: string;
  formulaHighlight: string;
  tip?: string;
}

export interface VideoEpisode {
  id: VideoEpisodeId;
  moduleId: ModuleId;
  moduleLabel: string;
  title: string;
  durationSec: number;
  summary: string;
  scenes: VideoScene[];
}

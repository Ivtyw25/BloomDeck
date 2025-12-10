import { HeroFlashcardData} from '@/types/types';
// for sidebar
import { Home, FileText, Library, Trash2, Undo2, Edit3 } from 'lucide-react';

// for hero section displaying only
export const HERO_FLASHCARDS: HeroFlashcardData[] = [
  {
    id: '1',
    type: 'TEXT',
    question: 'What is the powerhouse of the cell?',
    answer: 'Mitochondria',
    difficulty: 'Easy',
  },
  {
    id: '2',
    type: 'MULTIPLE_CHOICE',
    question: 'Which planet is known as the Red Planet?',
    answer: 'Mars',
    difficulty: 'Easy'
  },
  {
    id: '3',
    type: 'TRUE_FALSE',
    question: 'The Great Wall of China is visible from space with the naked eye.',
    answer: 'False',
    difficulty: 'Medium',
  },
  {
    id: '4',
    type: 'CODE_SNIPPET',
    question: 'React Hook for side effects?',
    answer: 'useEffect()',
    difficulty: 'Medium'
  }
];

// for nav bar
export const NAV_SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'library', label: 'Library' },

] as const;

// for sidebar
export const SIDEBAR_ITEMS = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Source',
    url: '/source',
    icon: FileText,
  },
  {
    title: 'Materials',
    url: '/materials',
    icon: Library,
  },
  {
    title: 'Trash',
    url: '/trash',
    icon: Trash2,
  },
];

// Helper to get a date relative to now for the mock
const getTimeAgo = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};

export const FILTER_OPTIONS = ['ALL', 'PDF', 'DOCX', 'PPT', 'YOUTUBE'];

export const TRASH_FILTER_OPTIONS = ['ALL', 'PDF', 'DOCX', 'PPT', 'YOUTUBE'];

export const MATERIAL_FILTER_OPTIONS = ['ALL', 'FLASHCARDS', 'NOTES'];

export const SOURCE_CARD_ACTIONS = [
  {
    label: 'Trash',
    icon: Trash2,
    action: 'trash',
    variant: 'destructive',
  },
];

export const TRASH_CARD_ACTIONS = [
  {
    label: "Restore",
    icon: Undo2,
    action: "restore",
    variant: 'default',
  },
  {
    label: "Delete",
    icon: Trash2,
    action: "delete",
    variant: 'destructive',
  }
]

// implement later
export const FLASHCARD_DECK_ACTIONS = [
  {
    label: "Edit Set",
    icon: Edit3,
    action: "edit",
    variant: 'default',
  },
  {
    label: "Delete Set",
    icon: Trash2,
    action: "delete",
    variant: 'destructive',
  }
];

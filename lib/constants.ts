import { FlashcardData, FlashcardType } from '@/types/types';
import { SourceDocument } from '@/types/types';

export const HERO_FLASHCARDS: FlashcardData[] = [
  {
    id: '1',
    type: FlashcardType.TEXT,
    question: 'What is the powerhouse of the cell?',
    answer: 'Mitochondria',
    difficulty: 'Easy',
  },
  {
    id: '2',
    type: FlashcardType.MULTIPLE_CHOICE,
    question: 'Which planet is known as the Red Planet?',
    answer: 'Mars',
    difficulty: 'Easy'
  },
  {
    id: '3',
    type: FlashcardType.TRUE_FALSE,
    question: 'The Great Wall of China is visible from space with the naked eye.',
    answer: 'False',
    difficulty: 'Medium',
  },
  {
    id: '4',
    type: FlashcardType.CODE_SNIPPET,
    question: 'React Hook for side effects?',
    answer: 'useEffect()',
    difficulty: 'Medium'
  }
];

export const NAV_SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'library', label: 'Library' },

] as const;

import { Home, FileText, Library, Trash2 } from 'lucide-react';

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

export const MOCK_SOURCES: SourceDocument[] = [
  {
    id: '1',
    title: 'Intro to Cellular Biology',
    type: 'PDF',
    dateAdded: getTimeAgo(50), // 50 mins ago
    size: '2.4 MB'
  },
  {
    id: '2',
    title: 'History & Geography Prep',
    type: 'MIXED',
    containedTypes: ['PPT', 'DOCX'],
    dateAdded: getTimeAgo(120), // 2 hours ago
    size: '15.5 MB'
  },
  {
    id: '3',
    title: 'React Hooks Deep Dive',
    type: 'YOUTUBE',
    dateAdded: getTimeAgo(5), // 5 mins ago
  },
  {
    id: '4',
    title: 'Organic Chemistry Notes',
    type: 'DOCX',
    dateAdded: getTimeAgo(2880), // 2 days ago
    size: '500 KB'
  }
];

export const FILTER_OPTIONS = ['ALL', 'PDF', 'DOCX', 'PPT', 'YOUTUBE'];

export const SOURCE_CARD_ACTIONS = [
  {
    label: 'Trash',
    icon: Trash2,
    action: 'trash',
    variant: 'destructive',
  },
];

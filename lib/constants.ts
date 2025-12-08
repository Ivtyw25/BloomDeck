import { FlashcardData, FlashcardType, MaterialItem } from '@/types/types';
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

import { Home, FileText, Library, Trash2, Undo2 } from 'lucide-react';

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

export const MOCK_TRASH: SourceDocument[] = [
  {
    id: '5',
    title: 'Intro to Physics',
    type: 'PDF',
    dateAdded: getTimeAgo(50), // 50 mins ago
    size: '2.3 MB'
  },
  {
    id: '6',
    title: 'Physics Notes',
    type: 'MIXED',
    containedTypes: ['PPT', 'PDF'],
    dateAdded: getTimeAgo(120), // 2 hours ago
    size: '15.5 MB'
  },
];

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

export const MOCK_MATERIALS: MaterialItem[] = [
  {
    id: '1',
    title: 'Cellular Biology Deck',
    type: 'FLASHCARD',
    sourceName: 'Intro to Cellular Biology',
    dateCreated: getTimeAgo(45),
    cardCount: 24
  },
  {
    id: '2',
    title: 'React Hooks Summary',
    type: 'NOTE',
    sourceName: 'React Hooks Deep Dive',
    dateCreated: getTimeAgo(2),
    preview: 'React Hooks are functions that let you use state and other React features without writing a class. The main hooks are useState, useEffect, and useContext'
  },
  {
    id: '3',
    title: 'Organic Chem Formulas',
    type: 'FLASHCARD',
    sourceName: 'Organic Chemistry Notes',
    dateCreated: getTimeAgo(2800),
    cardCount: 50
  },
  {
    id: '4',
    title: 'World War II Timeline',
    type: 'NOTE',
    sourceName: 'History & Geography Prep',
    dateCreated: getTimeAgo(100),
    preview: '1939: Invasion of Poland. 1941: Pearl Harbor attack. 1944: D-Day landings. 1945: End of war in Europe and Asia'
  }
];

export const MOCK_TRASH_MATERIALS: MaterialItem[] = [
  {
    id: '99',
    title: 'Old Biology Notes',
    type: 'NOTE',
    sourceName: 'Biology 101',
    dateCreated: getTimeAgo(500),
    preview: 'Mitochondria is the powerhouse of the cell...'
  },
  {
    id: '100',
    title: 'Deprecated Flashcards',
    type: 'FLASHCARD',
    sourceName: 'Legacy Source',
    dateCreated: getTimeAgo(1000),
    cardCount: 15
  }
];
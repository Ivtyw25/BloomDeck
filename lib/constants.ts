import { FlashcardData, FlashcardType } from '@/types/types';

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

// for hero section flashcards view
export type FlashcardType = 'TEXT' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'CODE_SNIPPET';

export interface HeroFlashcardData {
  id: string;
  type: FlashcardType;
  question: string;
  answer: string | string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  isStarred: boolean;
  materialsFk: string;
}

// Alias for backwards compatibility if needed, or just replace usages
export type FlashcardData = Flashcard;

// type of file supported
export type FileType = 'PDF' | 'DOCX' | 'PPT' | 'YOUTUBE' | 'MIXED';

export interface SourceDocument {
  id: string;
  title: string;
  type: FileType;
  containedTypes?: FileType[];
  dateAdded: string; // ISO String for sorting
  size?: string; // Optional for YouTube
  trashDate?: string; // Optional for Trash items
}

export type MaterialType = 'FLASHCARD' | 'NOTE';

export interface MaterialItem {
  id: string;
  title: string;
  type: MaterialType;
  cardCount?: number;
  inTrash: boolean;
  trashedAt?: string | null;
  createdAt: string;
  content?: string;
}
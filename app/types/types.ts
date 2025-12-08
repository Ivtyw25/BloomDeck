// for hero section flashcards view
export enum FlashcardType {
  TEXT = 'TEXT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  CODE_SNIPPET = 'CODE_SNIPPET'
}

export interface HeroFlashcardData {
  id: string;
  type: FlashcardType;
  question: string;
  answer: string | string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface FlashcardData {
  id: string;
  term: string;
  definition: string;
  isStarred?: boolean;
}

// type of file supported
export type FileType = 'PDF' | 'DOCX' | 'PPT' | 'YOUTUBE' | 'MIXED';

export interface SourceDocument {
  id: string;
  title: string;
  type: FileType;
  containedTypes?: FileType[];
  dateAdded: string; // ISO String for sorting
  size?: string; // Optional for YouTube
}

export type MaterialType = 'FLASHCARD' | 'NOTE';

export interface MaterialItem {
  id: string;
  title: string;
  type: MaterialType;
  sourceName: string;
  dateCreated: string;
  cardCount?: number; // Specific to Flashcards
  preview?: string;   // Specific to Notes
}
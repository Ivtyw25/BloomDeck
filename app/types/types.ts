// for hero section flashcards view
// Alias for backwards compatibility if needed, or just replace usages
export type FlashcardData = Flashcard;
export type RoleType = 'model' | 'user'
export type FlashcardType = 'TEXT' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'CODE_SNIPPET';

export interface SourceChat {
  id: string,
  role: RoleType,
  content: string,
}

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
  url?: string | string[];
  fileSearchStoreID?: string;
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
  preview?: string
}
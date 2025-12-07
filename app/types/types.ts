export enum FlashcardType {
  TEXT = 'TEXT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  CODE_SNIPPET = 'CODE_SNIPPET'
}

export interface FlashcardData {
  id: string;
  type: FlashcardType;
  question: string;
  answer: string | string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}
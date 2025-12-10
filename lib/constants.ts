import { HeroFlashcardData, FlashcardData, FlashcardType, MaterialItem } from '@/types/types';
import { SourceDocument } from '@/types/types';
// for sidebar
import { Home, FileText, Library, Trash2, Undo2, Edit3 } from 'lucide-react';

// for hero section displaying only
export const HERO_FLASHCARDS: HeroFlashcardData[] = [
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

export const FLASHCARDS: FlashcardData[] = [
  {
    id: '1',
    term: 'Mitochondria',
    definition: 'The powerhouse of the cell, responsible for generating most of the cell\'s supply of adenosine triphosphate (ATP).',
    isStarred: false
  },
  {
    id: '2',
    term: 'Photosynthesis',
    definition: 'The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.',
    isStarred: true
  },
  {
    id: '3',
    term: 'Polymorphism',
    definition: 'The ability of an object to take on many forms. In OOP, it allows a child class to provide a specific implementation of a method already provided by its parent.',
    isStarred: false
  },
  {
    id: '4',
    term: 'API',
    definition: 'Application Programming Interface. A set of rules that allows one software application to talk to another.',
    isStarred: false
  },
  {
    id: '5',
    term: 'Newton\'s First Law',
    definition: 'An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.',
    isStarred: false
  },
  {
    id: '6',
    term: 'DOM',
    definition: 'Document Object Model. A programming interface for web documents that represents the page so that programs can change the document structure, style, and content.',
    isStarred: true
  },
  {
    id: '7',
    term: 'Big O Notation',
    definition: 'A mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity, often used to classify algorithms by runtime.',
    isStarred: false
  },
  {
    id: '8',
    term: 'Oxidation',
    definition: 'A chemical reaction that takes place when a substance comes into contact with oxygen or another oxidizing substance.',
    isStarred: false
  },
  {
    id: '9',
    term: 'HTTP',
    definition: 'Hypertext Transfer Protocol. An application layer protocol for transmitting hypermedia documents, such as HTML.',
    isStarred: false
  },
  {
    id: '10',
    term: 'Recursion',
    definition: 'The process of defining a problem (or the solution to a problem) in terms of (a simpler version of) itself.',
    isStarred: true
  },
  {
    id: '11',
    term: 'Recursion',
    definition: 'The process of defining a problem (or the solution to a problem) in terms of (a simpler version of) itself.',
    isStarred: true
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

export const MOCK_STUDY_CARDS: FlashcardData[] = [
  {
    id: '1',
    term: 'Mitochondria',
    definition: 'Double-membrane-bound organelle found in most eukaryotic organisms. Generates most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.',
    isStarred: true
  },
  {
    id: '2',
    term: 'Nucleus',
    definition: 'The large, membrane-bounded organelle that contains the genetic material relative to the cell in the form of multiple linear DNA molecules organized into structures called chromosomes.',
    isStarred: false
  },
  {
    id: '3',
    term: 'Ribosome',
    definition: 'Macromolecular machines, found within all living cells, that perform biological protein synthesis (mRNA translation).',
    isStarred: false
  }
];
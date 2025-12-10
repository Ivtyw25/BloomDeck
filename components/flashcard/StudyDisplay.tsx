import { Minimize, Maximize } from 'lucide-react';
import Flashcard from '@/components/ui/flashcard';
import { FlashcardData } from '@/types/types';
import { motion, AnimatePresence } from 'motion/react';

interface StudyDisplayProps {
    deckTitle: string;
    currentIndex: number;
    totalCards: number;
    currentCard: FlashcardData | undefined;
    isTermMode: boolean;
    isFlipped: boolean;
    isFullScreen: boolean;
    onFlip: () => void;
    onToggleFullScreen: (isFull: boolean) => void;
    onNext: () => void;
    onPrev: () => void;
    children?: React.ReactNode;
}

export default function StudyDisplay({
    deckTitle,
    currentIndex,
    totalCards,
    currentCard,
    isTermMode,
    isFlipped,
    isFullScreen,
    onFlip,
    onToggleFullScreen,
    onNext,
    onPrev,
    children
}: StudyDisplayProps) {
    if (!currentCard) return null;

    const displayCardData: FlashcardData = isTermMode ? currentCard : {
        ...currentCard,
        term: currentCard.definition,
        definition: currentCard.term
    };

    return (
        <motion.div
            layout
            className={`flex-1 flex flex-col items-center w-full relative transition-colors duration-300 ${isFullScreen ? 'bg-gray-100 p-4 sm:p-6 h-full' : 'justify-center'}`}
        >

            {/* Full Screen Header */}
            <AnimatePresence>
                {isFullScreen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full flex justify-between items-center z-20 mb-4 shrink-0"
                    >
                        <div className="flex flex-col min-w-0 pr-4">
                            <div className="text-lg sm:text-xl font-bold font-heading text-text-main truncate">{deckTitle}</div>
                            <div className="text-xs sm:text-sm text-text-muted font-medium">{currentIndex + 1} / {totalCards}</div>
                        </div>
                        <button
                            onClick={() => onToggleFullScreen(false)}
                            className="cursor-pointer p-2 sm:p-3 bg-white rounded-full shadow-md text-text-main hover:bg-gray-50 shrink-0"
                        >
                            <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Card Interaction Area */}
            <motion.div
                layout
                className={`w-full relative 
                    ${isFullScreen
                        ? 'flex-1 min-h-0 flex flex-col justify-center mb-4'
                        : 'max-w-2xl aspect-3/2 mb-8'
                    }`}
                onClick={onFlip}
            >
                {/* Full Screen Toggle (Normal Mode) */}
                <AnimatePresence>
                    {!isFullScreen && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={(e) => { e.stopPropagation(); onToggleFullScreen(true); }}
                            className="cursor-pointer absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-sm rounded-full text-text-muted hover:bg-white hover:text-gray-900 shadow-sm transition-colors"
                            title="Full Screen"
                        >
                            <Maximize className="w-5 h-5" />
                        </motion.button>
                    )}
                </AnimatePresence>

                <motion.div
                    layout
                    className={`w-full h-full ${isFullScreen ? 'max-w-5xl mx-auto' : ''}`}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset }) => {
                        const swipeConfidenceThreshold = 100;


                        if (offset.x < -swipeConfidenceThreshold) {
                            onNext();
                        } else if (offset.x > swipeConfidenceThreshold) {
                            onPrev();
                        }
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCard.id}
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full sm:cursor-grab sm:active:cursor-grabbing"
                        >
                            <Flashcard
                                data={displayCardData}
                                isFlipped={isFlipped}
                            />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </motion.div>

            {/* Controls */}
            {children}
        </motion.div>
    );
}

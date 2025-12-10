import { Star, Shuffle, ArrowLeft, ArrowRight, Filter, Repeat } from 'lucide-react';
import { FlashcardData } from '@/types/types';
import {
    Tooltip,
    TooltipTrigger,
    TooltipPanel,
} from '@/components/animate-ui/components/base/tooltip';

interface StudyControlsProps {
    currentCard: FlashcardData;
    currentIndex: number;
    totalCards: number;
    isFullScreen: boolean;
    showStarredOnly: boolean;
    isTermMode: boolean;
    onToggleStar: () => void;
    onShuffle: () => void;
    onPrev: () => void;
    onNext: () => void;
    onToggleStarredOnly: () => void;
    onToggleMode: () => void;
}

export default function StudyControls({
    currentCard,
    currentIndex,
    totalCards,
    isFullScreen,
    showStarredOnly,
    isTermMode,
    onToggleStar,
    onShuffle,
    onPrev,
    onNext,
    onToggleStarredOnly,
    onToggleMode
}: StudyControlsProps) {
    if (!currentCard) return null;

    return (
        <div className="flex items-center justify-between w-full max-w-2xl bg-white p-2 sm:p-3 rounded-2xl shadow-sm border border-gray-200 relative z-10 gap-2 sm:gap-3">

            {/* Left Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
                <Tooltip>
                    <TooltipTrigger render={
                        <button
                            onClick={onToggleStar}
                            className={`cursor-pointer p-2 sm:p-3 transition-all hover:scale-110 active:scale-90 relative group ${currentCard.isStarred ? 'text-yellow-400' : 'text-gray-400'}`}
                        >
                            <Star strokeWidth={3} className={`w-4 h-4 sm:w-5 sm:h-5 ${currentCard.isStarred ? 'fill-current' : ''}`} />
                        </button>
                    } />
                    <TooltipPanel>
                        <p>{currentCard.isStarred ? 'Unstar Card' : 'Star Card'}</p>
                    </TooltipPanel>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger render={
                        <button
                            onClick={onShuffle}
                            className="p-2 sm:p-3 active:scale-90 hover:scale-110 cursor-pointer text-text-muted hover:text-primary transition-all"
                        >
                            <Shuffle strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    } />
                    <TooltipPanel>
                        <p>Shuffle Deck (R)</p>
                    </TooltipPanel>
                </Tooltip>
            </div>

            <div className="w-px h-8 bg-gray-200 sm:block" />

            {/* Navigation */}
            <div className="flex items-center gap-2 sm:gap-6">
                <button
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="p-3 sm:p-4 cursor-pointer active:scale-90 hover:scale-110 text-gray-900 hover:text-primary-hover hover:-translate-x-2 transition-all disabled:opacity-30 disabled:hover:bg-secondary/30 disabled:hover:text-gray-900"
                >
                    <ArrowLeft strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {isFullScreen && (
                    <span className="hidden sm:inline-block text-sm font-semibold text-text-muted select-none">Swipe or Press Space</span>
                )}

                <button
                    onClick={onNext}
                    disabled={currentIndex === totalCards - 1}
                    className="p-3 sm:p-4 cursor-pointer active:scale-90 hover:translate-x-2 hover:scale-110 text-gray-900 hover:text-primary-hover transition-all disabled:opacity-30 disabled:hover:bg-secondary/30 disabled:hover:text-gray-900"
                >
                    <ArrowRight strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>

            <div className="w-px h-8 bg-gray-200 sm:block" />

            {/* Right Actions (Settings) */}
            <div className="flex items-center gap-1 sm:gap-2">
                <Tooltip>
                    <TooltipTrigger render={
                        <button
                            onClick={onToggleStarredOnly}
                            className={`p-2 sm:p-3 cursor-pointer active:scale-90 hover:scale-110 transition-all hover:text-primary-hover ${showStarredOnly ? 'text-primary-hover' : 'text-text-muted'}`}
                        >
                            <Filter strokeWidth={3} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    } />
                    <TooltipPanel>
                        <p>Study Starred Only</p>
                    </TooltipPanel>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger render={
                        <button
                            onClick={onToggleMode}
                            className={`p-2 sm:p-3 cursor-pointer active:scale-90 hover:scale-110 transition-all hover:text-primary-hover ${isTermMode ? 'text-primary-hover' : 'text-text-muted'}`}
                        >
                            <Repeat strokeWidth={3} className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${!isTermMode ? 'rotate-180' : ''}`} />
                        </button>
                    } />
                    <TooltipPanel>
                        <p>Flip Term & Definitions (T)</p>
                    </TooltipPanel>
                </Tooltip>
            </div>
        </div>
    );
}

import { FlashcardData } from '@/types/types';

interface FlashcardProps {
  data: FlashcardData;
  isFlipped?: boolean; // Optional prop for controlled state
}

export default function Flashcard({ data, isFlipped }: FlashcardProps) {

  /* ... */
  const renderFrontContent = () => {
    return (
      <div className="h-full w-full overflow-y-auto p-6 sm:p-8 no-scrollbar">
        <div className="min-h-full flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <h3 className="text-lg font-heading sm:text-xl md:text-2xl font-bold text-text-main leading-snug select-none break-words max-w-full">
            {data.term}
          </h3>
          {/* <p className="text-xs sm:text-sm text-text-muted uppercase tracking-widest font-semibold opacity-60">Term</p> */}
        </div>
      </div>
    );
  };

  const renderBackContent = () => {
    return (
      <div className="h-full w-full overflow-y-auto p-6 sm:p-8 bg-gray-900 text-white rounded-2xl no-scrollbar">
        <div className="min-h-full flex flex-col items-center justify-center">
          <div className="text-sm font-heading sm:text-md md:text-lg font-medium leading-relaxed select-none break-words max-w-full">
            {data.definition}
          </div>
          {/* <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-300 uppercase tracking-widest font-semibold">Definition</p> */}
        </div>
      </div>
    );
  };

  // Determine rotation logic:
  // If isFlipped is defined (controlled), use it.
  // Otherwise, use group-hover (uncontrolled/demo mode).
  const rotationClass = isFlipped !== undefined
    ? (isFlipped ? '[transform:rotateY(180deg)]' : '')
    : 'group-hover:[transform:rotateY(180deg)]';
  /* ... */
  return (
    <div className={`group w-full h-full [perspective:1000px] cursor-pointer`}>
      <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${rotationClass} shadow-xl rounded-2xl`}>

        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white border border-primary/20 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
          {/* Top decorative stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
          {renderFrontContent()}
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-sm">
          {renderBackContent()}
        </div>
      </div>
    </div>
  );
};


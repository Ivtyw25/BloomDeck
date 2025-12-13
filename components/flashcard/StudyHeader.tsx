import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Progress, ProgressLabel, ProgressTrack } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/animate-ui/components/radix/popover';
import { FLASHCARD_DECK_ACTIONS } from '@/lib/constants';

interface StudyHeaderProps {
    title: string;
    totalTerms: number;
    currentIndex: number;
    totalActive: number;
    onBack: () => void;
    onDeleteSet: () => void; // Added prop
    disabled?: boolean;
}

export default function StudyHeader({ title, totalTerms, currentIndex, totalActive, onBack, onDeleteSet, disabled }: StudyHeaderProps) {
    return (
        <div className="mb-6 sm:mb-8">
            <button
                onClick={onBack}
                disabled={disabled}
                className={`cursor-pointer mb-6 sm:mb-8 flex items-center gap-2 transition-colors text-sm font-medium group ${disabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                <ArrowLeft className={`w-4 h-4 transition-transform ${!disabled && 'group-hover:-translate-x-1'}`} />
                Back
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl mb-2 sm:mb-3 tracking-tight font-heading font-bold text-text-main leading-tight">{title}</h1>
                    <p className="text-text-muted font-medium mt-1 text-sm">{totalTerms} terms</p>
                </div>

                {/* Progress & Menu */}
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto justify-between md:justify-start">
                    <Progress value={((currentIndex + 1) / totalActive) * 100} className="w-full md:min-w-[140px] md:w-[140px] xl:min-w-[200px] xl:w-[200px] gap-1">
                        <div className="flex justify-between text-xs font-semibold text-text-muted">
                            <ProgressLabel className="text-[10px] xl:text-sm">Progress</ProgressLabel>
                            <span className="text-[10px] xl:text-sm">{currentIndex + 1} / {totalActive}</span>
                        </div>
                        <ProgressTrack />
                    </Progress>

                    <div className="h-8 w-px bg-gray-200 shrink-0"></div>

                    {/* Set Menu */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className="cursor-pointer text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors shrink-0 -mr-1 outline-none"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="bg-white rounded-xl shadow-lg border border-gray-100 p-1 z-50 focus:outline-none w-32">
                            {FLASHCARD_DECK_ACTIONS.map((action) => (
                                <button
                                    key={action.action}
                                    className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg w-full text-left transition-colors ${action.variant === 'destructive'
                                        ? 'text-red-500 hover:bg-red-50'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => {
                                        if (action.action === 'edit') {
                                            console.log('Edit set clicked');
                                        } else if (action.action === 'delete') {
                                            onDeleteSet();
                                        }
                                    }}
                                >
                                    <action.icon className="w-3.5 h-3.5" /> {action.label}
                                </button>
                            ))}
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}

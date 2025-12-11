import { Layers, Lightbulb, FileText, Loader2, CheckCircle } from 'lucide-react';

export type GenerationType = 'flashcards' | 'summary' | 'notes';

interface GenerationCardProps {
    type: GenerationType;
    title: string;
    description: string;
    icon: 'flashcards' | 'summary' | 'notes';
    isGenerating: boolean;
    isSuccess: boolean;
    onGenerate: () => void;
    disabled?: boolean;
}

export function GenerationCard({
    type,
    title,
    description,
    icon,
    isGenerating,
    isSuccess,
    onGenerate,
    disabled = false
}: GenerationCardProps) {
    const iconConfig = {
        flashcards: { Icon: Layers, bgColor: 'bg-secondary/50', textColor: 'text-secondary-foreground', buttonBg: 'bg-primary', buttonText: 'text-white', buttonHover: 'hover:bg-primary-hover' },
        summary: { Icon: Lightbulb, bgColor: 'bg-yellow-50', textColor: 'text-yellow-600', buttonBg: 'bg-yellow-100', buttonText: 'text-yellow-700', buttonHover: 'hover:bg-yellow-200' },
        notes: { Icon: FileText, bgColor: 'bg-blue-50', textColor: 'text-blue-600', buttonBg: 'bg-blue-100', buttonText: 'text-blue-700', buttonHover: 'hover:bg-blue-200' },
    };

    const config = iconConfig[icon];
    const Icon = config.Icon;

    const getButtonContent = () => {
        if (isGenerating) {
            return (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {type === 'flashcards' && 'Generating...'}
                    {type === 'summary' && 'Analyzing...'}
                    {type === 'notes' && 'Writing...'}
                </>
            );
        }

        if (isSuccess) {
            return (
                <>
                    <CheckCircle className="w-4 h-4" />
                    {type === 'flashcards' && 'Created!'}
                    {type === 'summary' && 'Summarized!'}
                    {type === 'notes' && 'Saved!'}
                </>
            );
        }

        return type === 'flashcards' ? 'Generate Deck' : type === 'summary' ? 'Summarize' : 'Create Notes';
    };

    return (
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col">
            <div className={`w-12 h-12 ${config.bgColor} ${config.textColor} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold font-heading text-text-main">{title}</h3>
            <p className="text-sm lg:text-lg text-gray-600 mt-2 flex-1">
                {description}
            </p>
            <button
                onClick={onGenerate}
                disabled={disabled}
                className={`mt-6 w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${config.buttonBg} ${config.buttonText} ${config.buttonHover} disabled:opacity-70 text-sm`}
            >
                {getButtonContent()}
            </button>
        </div>
    );
}

import { GenerationCard, GenerationType } from './GenerationCard';

interface GenerationGridProps {
    onGenerate: (type: GenerationType) => void;
    isGenerating: (type: GenerationType) => boolean;
    isSuccess: (type: GenerationType) => boolean;
    disabled?: boolean;
}

export function GenerationGrid({ onGenerate, isGenerating, isSuccess, disabled }: GenerationGridProps) {
    const cards = [
        {
            type: 'flashcards' as const,
            title: 'Flashcards',
            description: 'Generate Q&A pairs for key terms and concepts found in this document.',
            icon: 'flashcards' as const
        },
        {
            type: 'summary' as const,
            title: 'Concept Summary',
            description: 'Get a concise summary of the wishes topics that you would need explanation.',
            icon: 'summary' as const
        },
        {
            type: 'notes' as const,
            title: 'Smart Notes',
            description: 'Create a structured study guide with bullet points and key takeaways.',
            icon: 'notes' as const
        }
    ];

    return (
        <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6 md:p-10 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="lg:text-2xl text-xl font-heading sm:text-2xl font-bold text-gray-900">Instant Study Materials</h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base lg:text-lg">
                        Use AI to automatically transform this source into study aids.
                    </p>
                </div>

                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {cards.map((card) => (
                        <GenerationCard
                            key={card.type}
                            type={card.type}
                            title={card.title}
                            description={card.description}
                            icon={card.icon}
                            isGenerating={isGenerating(card.type)}
                            isSuccess={isSuccess(card.type)}
                            onGenerate={() => onGenerate(card.type)}
                            disabled={disabled || (disabled === undefined ? false : disabled)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { HeroFlashcardData } from '@/types/types';
import { HelpCircle, CheckCircle, Code, List, Type } from 'lucide-react';

interface FlashcardProps {
    data: HeroFlashcardData;
    className?: string;
}

export default function HeroFlashCard({ data, className = '' }: FlashcardProps) {
    const getIcon = () => {
        switch (data.type) {
            case 'MULTIPLE_CHOICE':
                return <List className="w-5 h-5 text-green-600" />;
            case 'TRUE_FALSE':
                return <HelpCircle className="w-5 h-5 text-green-600" />;
            case 'CODE_SNIPPET':
                return <Code className="w-5 h-5 text-green-600" />;
            default:
                return <Type className="w-5 h-5 text-green-600" />;
        }
    };

    const renderFrontContent = () => {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="p-3 bg-green-100 rounded-full">
                    {getIcon()}
                </div>
                <h3 className="text-lg font-heading font-medium text-text-main line-clamp-4 leading-tight">
                    {data.question}
                </h3>
                <div className="absolute bottom-4 right-4">
                    <span className={`text-xs px-2 py-1 rounded-lg border ${data.difficulty === 'Easy' ? 'border-green-200 text-green-600 bg-green-50' :
                        data.difficulty === 'Medium' ? 'border-yellow-200 text-yellow-600 bg-yellow-50' :
                            'border-red-200 text-red-600 bg-red-50'
                        }`}>
                        {data.difficulty}
                    </span>
                </div>
            </div>
        );
    };

    const renderBackContent = () => {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-green-600 text-white rounded-3xl">
                <div className="mb-3">
                    <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
                <div className="text-xl font-heading font-medium">
                    {Array.isArray(data.answer) ? data.answer.join(', ') : data.answer}
                </div>
            </div>
        );
    };

    return (
        <div className={`group w-full h-48 perspective-[1000px] cursor-pointer ${className}`}>
            <div className="relative w-full h-full transition-all duration-500 group-hover:transform-[rotateY(180deg)] transform-3d shadow-xl rounded-3xl">

                {/* Front Face */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-sm">
                    {/* Top decorative stripe */}
                    <div className="h-2 w-full bg-primary" />
                    {renderFrontContent()}
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] rounded-3xl overflow-hidden shadow-sm">
                    {renderBackContent()}
                </div>
            </div>
        </div>
    );
};


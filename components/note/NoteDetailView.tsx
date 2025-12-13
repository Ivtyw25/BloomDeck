import React from 'react';
import { ArrowLeft, Calendar, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MaterialItem } from '@/types/types';

interface NoteDetailViewProps {
    note: MaterialItem;
    onBack: () => void;
}

const NoteDetailView: React.FC<NoteDetailViewProps> = ({ note, onBack }) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="container px-6 py-4 min-h-screen animate-slide-in-right max-w-full">
            {/* Back Link */}
            <button
                onClick={onBack}
                className={`cursor-pointer mb-8 flex items-center gap-2 text-gray-500 transition-colors text-sm font-medium group hover:text-text-main`}
            >
                <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1`} />
                Back
            </button>

            {/* Navigation & Header */}
            <div className="max-w-4xl mx-auto">

                {/* Meta Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2 uppercase tracking-wide">
                            <Sparkles className="w-4 h-4" />
                            AI Generated Summary
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading leading-tight mb-4">
                            {note.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatDate(note.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Paper */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5  via-primary to-purple-200"></div>

                    {/* Note Content */}
                    <div className="prose prose-stone max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => <h1 className="text-3xl font-heading font-bold mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-2xl font-heading font-bold mb-3 mt-6 border-b pb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-heading font-bold mb-2 mt-4 text-primary">{children}</h3>,
                                ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-4">{children}</ol>,
                                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                p: ({ children }) => <p className="leading-relaxed mb-4">{children}</p>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 my-4 bg-gray-50 p-4 rounded-r-lg">
                                        {children}
                                    </blockquote>
                                ),
                                code: ({ children }) => (
                                    <code className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-sm font-mono">
                                        {children}
                                    </code>
                                ),
                            }}
                        >
                            {note.content || "*No content available.*"}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetailView;

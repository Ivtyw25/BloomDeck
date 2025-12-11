"use client";

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn("prose prose-sm prose-gray max-w-none text-text-main leading-relaxed", className)}>
            <ReactMarkdown
                components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    strong: ({ children }) => <span className="font-semibold text-text-main">{children}</span>,
                    h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-md font-bold mb-2 mt-2">{children}</h3>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2">{children}</blockquote>,
                    code: ({ node, inline, className, children, ...props }: any) => {
                        return inline ? (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-pink-500" {...props}>
                                {children}
                            </code>
                        ) : (
                            <div className="bg-gray-900 rounded-lg p-3 my-1 mx-1 overflow-x-auto inline-block align-middle max-w-full">
                                <code className="text-sm font-mono text-gray-100 block" {...props}>
                                    {children}
                                </code>
                            </div>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

// Note: I need to check if `lib/utils` exists for `cn`.

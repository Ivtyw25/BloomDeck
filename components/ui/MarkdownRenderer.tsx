"use client";

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn("prose prose-sm prose-gray max-w-none text-text-main leading-relaxed", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
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
                        return (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-pink-500" {...props}>
                                {children}
                            </code>
                        );
                    },
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-gray-50/50">
                            {children}
                        </thead>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {children}
                        </tbody>
                    ),
                    tr: ({ children }) => (
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            {children}
                        </tr>
                    ),
                    th: ({ children }) => (
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-3 py-2 whitespace-normal text-gray-600">
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

// Note: I need to check if `lib/utils` exists for `cn`.

import { RefObject, useState } from 'react';
import { Bot, User, Send, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useSmoothTyping } from '@/components/hooks/useSmoothTyping';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

function TypewriterText({ text }: { text: string }) {
    const displayedText = useSmoothTyping(text, 10);
    return <MarkdownRenderer content={displayedText} />;
}

export interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

interface ChatInterfaceProps {
    messages: ChatMessage[];
    inputMessage: string;
    isTyping: boolean;
    isLoading?: boolean;
    chatEndRef: RefObject<HTMLDivElement | null>;
    onInputChange: (value: string) => void;
    onSendMessage: () => void;
    onClearChat?: () => void;
}

export function ChatInterface({
    messages,
    inputMessage,
    isTyping,
    isLoading,
    chatEndRef,
    onInputChange,
    onSendMessage,
    onClearChat
}: ChatInterfaceProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isTyping) {
            onSendMessage();
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col">
            {/* Clear Chat Button */}
            {onClearChat && messages.length > 0 && !isLoading && (
                <div className="absolute top-2 left-4 sm:top-4 sm:left-6 z-10">
                    <button
                        onClick={() => setIsConfirmOpen(true)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Clear Chat History"
                    >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4 sm:space-y-6 pt-10 sm:pt-6">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm">Loading chat history...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted gap-4 opacity-80">
                        <Bot className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-text-main" strokeWidth={2} />
                        <div className="text-center space-y-1">
                            <p className="text-lg sm:text-xl font-medium font-heading text-text-main">No messages yet</p>
                            <p className="text-sm sm:text-md">Start chatting with your source!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isLastMessage = idx === messages.length - 1;
                        const shouldAnimate = isLastMessage && isTyping && msg.role === 'ai';

                        return (
                            <div key={idx} className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-primary/20 text-gray-900'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4" />}
                                </div>
                                <div className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm leading-relaxed wrap-break-word ${msg.role === 'user'
                                    ? 'bg-primary/80 text-white rounded-tr-sm'
                                    : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                                    }`}>
                                    {msg.role === 'ai' ? (
                                        !msg.text ? (
                                            <div className="flex gap-1 py-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                            </div>
                                        ) : shouldAnimate ? (
                                            <TypewriterText text={msg.text} />
                                        ) : (
                                            <MarkdownRenderer content={msg.text} />
                                        )
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
                <div className="relative">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question about the source..."
                        className="w-full pl-4 pr-12 py-2.5 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                    <button
                        onClick={onSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    onClearChat?.();
                    setIsConfirmOpen(false);
                }}
                title="Clear Chat History"
                description="Are you sure you want to clear all chat history? This action cannot be undone."
                confirmText="Clear Chat"
                isLoading={false}
            />
        </div>
    );
}

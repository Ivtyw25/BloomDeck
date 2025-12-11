import { RefObject } from 'react';
import { Bot, User, Send } from 'lucide-react';

export interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

interface ChatInterfaceProps {
    messages: ChatMessage[];
    inputMessage: string;
    isTyping: boolean;
    chatEndRef: RefObject<HTMLDivElement | null>;
    onInputChange: (value: string) => void;
    onSendMessage: () => void;
}

export function ChatInterface({
    messages,
    inputMessage,
    isTyping,
    chatEndRef,
    onInputChange,
    onSendMessage
}: ChatInterfaceProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSendMessage();
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-primary/10 text-gray-900'
                            }`}>
                            {msg.role === 'user' ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </div>
                        <div className={`max-w-[80%] px-4 sm:px-5 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.role === 'user'
                            ? 'bg-primary text-gray-900 rounded-tr-sm'
                            : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900" />
                        </div>
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
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
                        placeholder="Ask a question..."
                        className="w-full pl-4 pr-12 py-2.5 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                    <button
                        onClick={onSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

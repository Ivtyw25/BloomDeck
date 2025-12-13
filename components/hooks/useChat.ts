import { useState, useRef, useEffect } from 'react';
import { getSourceChat, saveChatMessage, deleteSourceChat } from '@/services/source';
import { toast } from 'sonner';
import { SourceDocument, FileType } from '@/app/types/types';

export interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

interface UseChatProps {
    sourceId: string;
    fileSearchStoreID?: string | null;
    data?: SourceDocument;
    sourceTitle?: string;
}

export function useChat({ sourceId, fileSearchStoreID, data, sourceTitle }: UseChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [type, setType] = useState<FileType | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Fetch chat history
    useEffect(() => {
        let isMounted = true;
        if (data) {
            setType(data.type);
        }
        async function fetchHistory() {
            if (!sourceId) return;

            try {
                const history = await getSourceChat(sourceId);
                if (isMounted && history) {
                    setMessages(history.map(msg => ({
                        role: msg.role === 'model' ? 'ai' : 'user', // Map database role 'model' to 'ai'
                        text: msg.content
                    })));
                }
            } catch (error) {
                console.error("Failed to load chat history", error);
                toast.error("Failed to load chat history");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        fetchHistory();
        return () => { isMounted = false; };
    }, [sourceId]);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || !sourceId) return;

        const text = inputMessage;
        setInputMessage('');

        const newMsg: ChatMessage = { role: 'user', text };
        setMessages(prev => [...prev, newMsg]);

        try {
            await saveChatMessage(sourceId, 'user', text);
        } catch (error) {
            console.error("Failed to save user message", error);
        }

        setIsTyping(true);
        let fullAiResponse = "";

        // Add a placeholder AI message for streaming
        setMessages(prev => [...prev, { role: 'ai', text: "" }]);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: messages, // Send existing history
                    fileSearchStoreID,
                    sourceTitle,
                    url: (data?.type === 'YOUTUBE' && typeof data.url === 'string') ? data.url : undefined
                })
            });

            if (!response.ok || !response.body) {
                throw new Error("Failed to fetch chat response");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullAiResponse += chunk;

                setMessages(prev => {
                    const newArr = [...prev];
                    const lastMsg = newArr[newArr.length - 1];
                    if (lastMsg.role === 'ai') {
                        lastMsg.text = fullAiResponse;
                    }
                    return newArr;
                });
            }
            // Save final AI message
            await saveChatMessage(sourceId, 'model', fullAiResponse);
        } catch (error) {
            console.error("Chat Error:", error);
            toast.error("Failed to generate response");
            setMessages(prev => {
                const newArr = [...prev];
                if (newArr[newArr.length - 1].role === 'ai' && newArr[newArr.length - 1].text === "") {
                    return newArr.slice(0, -1);
                }
                return newArr;
            });

        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = async () => {
        if (!sourceId) return;
        try {
            await deleteSourceChat(sourceId);
            setMessages([]);
            toast.success("Chat history cleared");
        } catch (error) {
            console.error("Failed to clear chat", error);
            toast.error("Failed to clear chat history");
        }
    };

    return {
        messages,
        inputMessage,
        isTyping,
        isLoading,
        chatEndRef,
        setInputMessage,
        sendMessage,
        clearChat
    };
}

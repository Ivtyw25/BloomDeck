import { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

interface UseChatProps {
    initialMessage?: string;
}

export function useChat({ initialMessage }: UseChatProps = {}) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initialize with welcome message
    useEffect(() => {
        if (initialMessage) {
            setMessages([{ role: 'ai', text: initialMessage }]);
        }
    }, [initialMessage]);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!inputMessage.trim()) return;

        const newMsg: ChatMessage = { role: 'user', text: inputMessage };
        setMessages(prev => [...prev, newMsg]);
        setInputMessage('');
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            const aiResponses = [
                "That's a key concept in this document. Specifically, it relates to...",
                "Based on the source material, the answer is yes. The author argues that...",
                "Here is a summary of that section: It primarily focuses on..."
            ];
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

            setMessages(prev => [...prev, { role: 'ai', text: randomResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return {
        messages,
        inputMessage,
        isTyping,
        chatEndRef,
        setInputMessage,
        sendMessage
    };
}

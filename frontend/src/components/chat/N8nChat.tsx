import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/firebase/useAuth';
import { format, isToday, isYesterday } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

interface QuickAction {
    id: string;
    label: string;
    message: string;
    icon: React.ReactNode;
}

const quickActions: QuickAction[] = [
    {
        id: 'book-flight',
        label: 'Book Flight',
        message: 'I would like to book a flight',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    },
    {
        id: 'book-hotel',
        label: 'Book Hotel',
        message: 'I need to book a hotel',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    },
    {
        id: 'tour-package',
        label: 'Tour Packages',
        message: 'Show me your tour packages',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    }
];

// Helper function to group messages by date
const getMessageDateGroup = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
};

interface N8nChatProps {
    webhookUrl: string;
    position?: 'bottom-right' | 'bottom-left';
}

export function N8nChat({ webhookUrl, position = 'bottom-right' }: N8nChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    // Handle clicks outside of chat
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
                handleChatToggle(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Ensure scroll is restored when component unmounts or chat closes
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Handle chat open/close
    const handleChatToggle = (open: boolean) => {
        setIsOpen(open);
        document.body.style.overflow = open ? 'hidden' : 'auto';
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const dateGroup = getMessageDateGroup(message.timestamp);
        if (!groups[dateGroup]) {
            groups[dateGroup] = [];
        }
        groups[dateGroup].push(message);
        return groups;
    }, {} as Record<string, Message[]>);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !user) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.text,
                    userId: user.uid,
                    userEmail: user.email,
                    timestamp: userMessage.timestamp
                }),
            });

            const data = await response.json();
            console.log('Raw webhook response:', data);

            const agentMessage: Message = {
                id: Date.now().toString(),
                text: data.output ?? "I'm sorry, I couldn't process your request.",
                sender: 'agent',
                timestamp: new Date()
            };

            console.log('Final agent message:', agentMessage);
            setMessages(prev => [...prev, agentMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                text: "Sorry, I'm having trouble connecting. Please try again later.",
                sender: 'agent',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickAction = (action: QuickAction) => {
        setInputText(action.message);
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        handleSendMessage(fakeEvent);
    };

    return (
        <>
            {user && (
                <div className={`fixed ${position === 'bottom-right' ? 'right-4' : 'left-4'} bottom-4 z-50`}>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                ref={chatContainerRef}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                onMouseEnter={() => document.body.style.overflow = 'hidden'}
                                onMouseLeave={() => document.body.style.overflow = 'auto'}
                                className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl w-[380px] max-w-full mb-4 overflow-hidden border border-primary/10"
                            >
                                {/* Enhanced Chat Header */}
                                <div className="bg-gradient-to-r from-forest-300 to-forest-400 p-4 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-inner">
                                                <img
                                                    src="/logo.png"
                                                    alt="Admas Travel"
                                                    className="w-6 h-6 object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L3N2Zz4=';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-white drop-shadow-sm">Admas Travel</h3>
                                                <div className="flex items-center space-x-1.5 text-xs text-white/90">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-sm" />
                                                    <span className="drop-shadow-sm">Online • Ready to help</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleChatToggle(false)}
                                            className="rounded-lg p-2 hover:bg-white/15 transition-colors"
                                        >
                                            <svg className="w-5 h-5 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="mt-3 text-sm text-white/90 border-t border-white/15 pt-3 font-medium drop-shadow-sm">
                                        Ask about tours, flights, hotels, or travel tips!
                                    </div>
                                </div>

                                {/* Enhanced Messages Container */}
                                <div className="h-[400px] overflow-y-auto p-4 space-y-6 bg-[url('/pattern.png')] bg-opacity-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-forest-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-forest-300">
                                    {Object.entries(groupedMessages).map(([dateGroup, dateMessages]) => (
                                        <div key={dateGroup} className="space-y-4">
                                            <div className="flex items-center justify-center">
                                                <div className="text-xs font-medium text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">
                                                    {dateGroup}
                                                </div>
                                            </div>
                                            {dateMessages.map((message) => (
                                                <motion.div
                                                    key={message.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm ${message.sender === 'user'
                                                            ? 'bg-gradient-to-br from-forest-300 to-forest-400 text-white shadow-md'
                                                            : 'bg-white text-gray-800 border border-gray-100'
                                                            }`}
                                                    >
                                                        <ReactMarkdown
                                                            className={`text-sm prose max-w-none ${message.sender === 'user'
                                                                ? 'text-white/95 prose-headings:text-white prose-a:text-white/95 prose-strong:text-white prose-strong:font-semibold drop-shadow-sm'
                                                                : 'text-gray-800 prose-headings:text-gray-900 prose-a:text-forest-400 prose-strong:text-gray-900'
                                                                } prose-p:leading-relaxed prose-a:underline prose-ul:my-1 prose-li:my-0.5 prose-p:my-1`}
                                                        >
                                                            {message.text}
                                                        </ReactMarkdown>
                                                        <div className={`text-[10px] mt-2 flex items-center gap-1.5 ${message.sender === 'user' ? 'text-white/85' : 'text-gray-400'
                                                            }`}>
                                                            {format(message.timestamp, 'HH:mm')}
                                                            {message.sender === 'user' && (
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                                                <div className="flex space-x-1.5">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                                        className="w-2 h-2 rounded-full bg-forest-300 shadow-sm"
                                                    />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                                        className="w-2 h-2 rounded-full bg-forest-300 shadow-sm"
                                                    />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                                        className="w-2 h-2 rounded-full bg-forest-300 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick Actions */}
                                <div className="p-2 border-t border-gray-100 bg-white">
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 px-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-forest-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-forest-300">
                                        {quickActions.map((action) => (
                                            <motion.button
                                                key={action.id}
                                                onClick={() => handleQuickAction(action)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-forest-50 text-forest-600 rounded-full text-sm font-medium hover:bg-forest-100 transition-colors whitespace-nowrap"
                                            >
                                                {action.icon}
                                                {action.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Enhanced Input Form */}
                                <div className="p-4 border-t border-gray-100 bg-white">
                                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="Type your message..."
                                            className="w-full px-4 py-2.5 pr-12 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-300/20 focus:border-forest-300 focus:outline-none bg-gray-50/50 placeholder-gray-400 transition-colors"
                                        />
                                        <motion.button
                                            type="submit"
                                            disabled={!inputText.trim() || isTyping}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="absolute right-2 flex items-center justify-center w-8 h-8 rounded-lg bg-forest-300 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-forest-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </motion.button>
                                    </form>
                                    <div className="mt-2 text-xs text-gray-500 text-center font-medium">
                                        Press Enter to send • We typically reply in a few minutes
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Enhanced Chat Toggle Button */}
                    <motion.button
                        onClick={() => handleChatToggle(!isOpen)}
                        className={`${isOpen ? 'hidden' : 'flex'} items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-forest-300 to-forest-400 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="relative">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white animate-pulse" />
                        </div>
                    </motion.button>
                </div>
            )}
        </>
    );
} 
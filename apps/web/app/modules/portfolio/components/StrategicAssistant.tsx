'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function StrategicAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello. I am your Strategic Portfolio Assistant. Ask me about capital allocation, risk exposure, or optimization scenarios.', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/portfolio/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg.content })
            });

            if (!response.ok) throw new Error('Failed to fetch insight');

            const data = await response.json();
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.data?.answer || "I'm unable to analyze that right now.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I encountered an error connecting to the strategic engine.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-surface-highlight/50 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                    <Sparkles size={16} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white">Strategic Assistant</h3>
                    <p className="text-xs text-muted">Powered by PetroSquare AI Strategy Engine</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted'}`}>
                            {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                            msg.role === 'assistant'
                                ? 'bg-surface-highlight border border-border text-gray-200'
                                : 'bg-primary text-primary-foreground'
                        }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <span className="text-[10px] opacity-50 mt-1 block text-right">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                            <Bot size={16} />
                        </div>
                        <div className="bg-surface-highlight border border-border rounded-2xl p-3 flex items-center gap-1">
                            <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-surface-highlight/20">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about allocation strategy..."
                        className="w-full bg-surface border border-border rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted/50"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="mt-2 text-[10px] text-center text-muted">
                    AI generated insights may vary based on market data latency. Verify critical decisions.
                </div>
            </div>
        </div>
    );
}

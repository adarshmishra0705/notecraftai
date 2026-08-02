import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { useAppContext } from '../lib/context';

export default function DocumentChat() {
    const { uploadData, apiKey, isDemoMode } = useAppContext();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I have analyzed your document. What would you like to know?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const documentText = uploadData?.rawText || '';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        if (isDemoMode) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: "This is a demo response! In a real scenario with an API key, I would use your document's context to answer your question." }]);
                setIsLoading(false);
            }, 1000);
            return;
        }

        try {
            const systemPrompt = `You are an expert tutor answering questions based strictly on the provided document text. 
            Do not make up information outside of the document context. If the answer is not in the document, say so politely.
            
            Document Text (excerpt):
            ${documentText.substring(0, 30000)}`;

            const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
            
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...chatHistory,
                        userMessage
                    ],
                    temperature: 0.3,
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error?.message || 'Failed to fetch response');
            }

            const data = await response.json();
            const aiMessage = data.choices[0].message.content;
            
            setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full bg-white border-8 border-brutal-black shadow-brutal relative z-10">
            {/* Header */}
            <div className="p-4 border-b-4 border-brutal-black bg-brutal-yellow flex items-center gap-3">
                <div className="bg-white border-2 border-brutal-black p-1">
                    <Bot className="w-6 h-6 text-brutal-black" />
                </div>
                <h2 className="text-xl font-display font-black text-brutal-black uppercase tracking-tight">Document Chat</h2>
                {isDemoMode && (
                    <span className="ml-auto text-xs font-black uppercase bg-brutal-pink px-2 py-1 border-2 border-brutal-black">Demo</span>
                )}
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brutal-bg relative">
                 <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#111111 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="relative z-10 flex flex-col space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 flex-shrink-0 border-4 border-brutal-black flex items-center justify-center ${msg.role === 'user' ? 'bg-brutal-blue text-white shadow-brutal-sm' : 'bg-brutal-pink text-brutal-black shadow-brutal-sm'}`}>
                                    {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                                </div>
                                <div className={`p-4 border-4 border-brutal-black text-brutal-black font-bold text-sm shadow-brutal-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-brutal-cyan text-right' : 'bg-white text-left'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-start gap-3 max-w-[85%]">
                                <div className="w-10 h-10 flex-shrink-0 border-4 border-brutal-black bg-brutal-pink flex items-center justify-center text-brutal-black shadow-brutal-sm">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div className="p-4 border-4 border-brutal-black bg-white shadow-brutal-sm flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="font-bold text-sm uppercase">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t-4 border-brutal-black bg-white flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the document..."
                    className="flex-1 bg-white border-4 border-brutal-black p-3 font-bold focus:outline-none focus:bg-brutal-yellow transition-colors placeholder:text-brutal-black/50 shadow-inner"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-brutal-blue text-white border-4 border-brutal-black p-3 shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal disabled:cursor-not-allowed"
                >
                    <Send className="w-6 h-6" />
                </button>
            </form>
        </div>
    );
}

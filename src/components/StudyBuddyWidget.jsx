import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { useAppContext } from '../lib/context';

export default function StudyBuddyWidget() {
    const { apiKey, isDemoMode } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your Nerd Bot. Ask me anything about what you're learning, or ask me to quiz you!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = input.trim();
        setInput("");
        
        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        
        if (!apiKey && !isDemoMode) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Please add your API key in Settings to chat with me!' }]);
            return;
        }

        setIsLoading(true);

        try {
            if (isDemoMode) {
                await new Promise(r => setTimeout(r, 1500));
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: "This is a demo response! If you provide a real API key, I can actually answer your questions about " + userMsg 
                }]);
                setIsLoading(false);
                return;
            }

            const promptMessages = [
                { role: "system", content: "You are a friendly, encouraging, and highly intelligent AI tutor. Your job is to help the user study, explain concepts simply, and quiz them if requested. Keep your responses relatively concise so they fit well in a chat widget." },
                ...newMessages.map(m => ({ role: m.role, content: m.content }))
            ];

            const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: promptMessages,
                    temperature: 0.7,
                })
            });

            if (!response.ok) throw new Error("Failed to get response");
            
            const data = await response.json();
            const aiMsg = data.choices[0].message.content;
            
            setMessages(prev => [...prev, { role: 'assistant', content: aiMsg }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I ran into an error connecting to my brain. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {/* Chat Window */}
            <div className={`mb-4 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <div className="bg-brutal-bg border-4 border-brutal-black shadow-brutal-lg w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-brutal-blue border-b-4 border-brutal-black p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-brutal-black shadow-brutal-sm">
                                <Sparkles className="w-5 h-5 text-brutal-black" />
                            </div>
                            <div>
                                <h3 className="text-brutal-black font-black uppercase tracking-wider">Nerd Bot</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-2 h-2 border border-brutal-black rounded-full bg-brutal-green"></div>
                                    <span className="text-brutal-black text-xs font-bold uppercase">Online</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-brutal-black bg-white border-2 border-brutal-black hover:bg-brutal-pink shadow-brutal-sm transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-white">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-brutal-cyan flex items-center justify-center flex-shrink-0 border-2 border-brutal-black shadow-brutal-sm">
                                        <Bot className="w-5 h-5 text-brutal-black" />
                                    </div>
                                )}
                                
                                <div className={`max-w-[75%] p-3 text-sm font-bold leading-relaxed border-2 border-brutal-black shadow-brutal-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-brutal-pink text-brutal-black translate-y-1' 
                                        : 'bg-brutal-yellow text-brutal-black'
                                }`}>
                                    {msg.content}
                                </div>
                                
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-brutal-blue flex items-center justify-center flex-shrink-0 border-2 border-brutal-black shadow-brutal-sm">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-brutal-cyan flex items-center justify-center flex-shrink-0 border-2 border-brutal-black shadow-brutal-sm">
                                    <Bot className="w-5 h-5 text-brutal-black" />
                                </div>
                                <div className="bg-brutal-yellow text-brutal-black p-3 border-2 border-brutal-black shadow-brutal-sm flex gap-1 items-center">
                                    <div className="w-2 h-2 bg-brutal-black rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-brutal-black rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-brutal-black rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t-4 border-brutal-black">
                        <div className="relative flex items-center shadow-brutal-sm">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a question..."
                                className="w-full pl-4 pr-12 py-3 bg-white border-2 border-brutal-black focus:outline-none focus:bg-brutal-bg transition-all text-sm font-bold text-brutal-black placeholder:text-brutal-black"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-2 bg-brutal-green hover:bg-brutal-pink disabled:bg-slate-300 text-brutal-black border-2 border-brutal-black transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 border-4 border-brutal-black flex items-center justify-center shadow-brutal transition-all duration-300 ${isOpen ? 'bg-white hover:bg-brutal-pink' : 'bg-brutal-green hover:bg-brutal-yellow hover:-translate-y-1 hover:shadow-brutal-lg'}`}
            >
                {isOpen ? <X className="w-8 h-8 text-brutal-black" /> : <MessageSquare className="w-8 h-8 text-brutal-black" />}
            </button>
            
            {!isOpen && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 bg-brutal-pink border-4 border-brutal-black animate-bounce shadow-brutal-sm"></div>
            )}
        </div>
    );
}

import React, { useState } from 'react';
import { Wand2, Loader2, Sparkles, RefreshCw } from 'lucide-react';

export default function LandingLiveDemo() {
    const [text, setText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [flashcard, setFlashcard] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleGenerate = () => {
        if (!text.trim()) return;
        
        setIsGenerating(true);
        setFlashcard(null);
        setIsFlipped(false);
        
        // Simulate API call for the landing page demo
        setTimeout(() => {
            setIsGenerating(false);
            setFlashcard({
                front: "What is the main concept of the text you just pasted?",
                back: "This is an AI-generated synthesis of your text, broken down into a bite-sized piece of knowledge. (This is a live demo!)"
            });
        }, 2000);
    };

    const resetDemo = () => {
        setText("");
        setFlashcard(null);
        setIsFlipped(false);
    };

    return (
        <section className="bg-[#fafbfd] py-24 relative overflow-hidden z-20">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-4 border border-indigo-100">
                        <Sparkles className="w-4 h-4" /> Live Demo
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">Try it right now.</h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Paste a sentence or two about any topic below, and watch the AI instantly transform it into a smart flashcard. No sign-up required.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    
                    {/* Input Side */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Your text snippet</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="e.g. Mitochondria are membrane-bound cell organelles that generate most of the chemical energy needed to power the cell's biochemical reactions..."
                            className="w-full h-40 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-700 resize-none font-medium placeholder:text-slate-400 mb-6"
                            disabled={isGenerating || flashcard !== null}
                        />
                        
                        {!flashcard ? (
                            <button
                                onClick={handleGenerate}
                                disabled={!text.trim() || isGenerating}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:cursor-not-allowed group"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing Text...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 group-hover:scale-110 transition-transform" />
                                        Generate Magic Card
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={resetDemo}
                                className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-indigo-100"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try another one
                            </button>
                        )}
                    </div>

                    {/* Output Side */}
                    <div className="relative h-64 md:h-80 perspective-1000">
                        {!flashcard && !isGenerating && (
                            <div className="absolute inset-0 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
                                <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-bold">Your flashcard will appear here</p>
                            </div>
                        )}
                        
                        {isGenerating && (
                            <div className="absolute inset-0 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-500 animation-pulse">
                                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                                <p className="font-bold">Extracting knowledge...</p>
                            </div>
                        )}

                        {flashcard && (
                            <div 
                                className={`w-full h-full cursor-pointer transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                {/* Front */}
                                <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border border-slate-200 p-8 shadow-xl flex flex-col justify-center items-center text-center">
                                    <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Question</div>
                                    <h3 className="text-xl md:text-2xl font-display font-bold text-slate-800 leading-snug">
                                        {flashcard.front}
                                    </h3>
                                    <div className="absolute bottom-4 right-4 text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                                        Tap to flip
                                    </div>
                                </div>
                                
                                {/* Back */}
                                <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-3xl border border-indigo-500 p-8 shadow-xl flex flex-col justify-center items-center text-center rotate-y-180">
                                    <div className="absolute top-4 left-4 text-xs font-bold text-indigo-300 uppercase tracking-widest">Answer</div>
                                    <h3 className="text-lg md:text-xl font-medium text-white leading-relaxed">
                                        {flashcard.back}
                                    </h3>
                                    <div className="absolute bottom-4 right-4 text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full">
                                        Tap to flip
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </section>
    );
}

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import NetworkAnimation from '../components/NetworkAnimation';
import AIBackgroundCharacter from '../components/AIBackgroundCharacter';
import FlashcardStudyView from '../components/FlashcardStudyView';

const sampleCards = [
    { id: '1', front: 'What is the core function of the SuperMemo-2 (SM-2) algorithm?', back: 'It calculates optimal review intervals for study cards based on user performance ratings.' }
];

function RevealOnScroll({ children, delay = 0, className = "" }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-brutal-bg text-brutal-black font-sans overflow-x-hidden relative">
            
            {/* Navbar */}
            <nav className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between border-b-4 border-brutal-black bg-white">
                <div className="flex items-center gap-2 sm:gap-3">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-brutal-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                    </svg>
                    <span className="font-display font-bold text-xl sm:text-2xl text-brutal-black tracking-tight uppercase">NoteCraft AI</span>
                </div>
                
                <div>
                    <Link to="/app" className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-bold text-brutal-black bg-brutal-yellow border-4 border-brutal-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all inline-block uppercase">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
                <NetworkAnimation />
                <AIBackgroundCharacter />
                
                <div className="max-w-2xl relative z-10 pt-10">
                    <RevealOnScroll>
                        <h1 className="text-5xl sm:text-6xl md:text-[80px] font-display font-black leading-[1.1] text-brutal-black mb-6 tracking-tighter uppercase">
                            Effortless Study,<br/>
                            <span className="bg-brutal-pink text-white px-2 sm:px-4 border-4 border-brutal-black shadow-brutal inline-block -rotate-2 mt-2">Smarter Learning.</span>
                        </h1>
                    </RevealOnScroll>
                    
                    <RevealOnScroll delay={150}>
                        <p className="text-lg sm:text-xl md:text-2xl text-brutal-black leading-relaxed mb-10 max-w-xl font-bold border-l-4 sm:border-l-8 border-brutal-yellow pl-4">
                            Transform your learning flow. NoteCraft AI converts your lectures, meetings, and documents into powerful, organized knowledge bases and intelligent flashcards.
                        </p>
                    </RevealOnScroll>
                    
                    <RevealOnScroll delay={300}>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <Link to="/app" className="px-6 sm:px-8 py-3 sm:py-4 bg-brutal-blue text-white font-black uppercase text-lg sm:text-xl border-4 border-brutal-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center justify-center gap-2 group w-full sm:w-auto">
                                Try It For Free
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                            <button 
                                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-brutal-black font-black uppercase text-lg sm:text-xl border-4 border-brutal-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brutal-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                Watch Demo
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </main>

            {/* How It Works Section */}
            <section className="bg-brutal-cyan py-32 border-t-8 border-brutal-black relative z-20 overflow-hidden" id="features">
                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                    <RevealOnScroll>
                        <span className="inline-block py-2 px-4 bg-brutal-yellow text-brutal-black border-4 border-brutal-black font-black tracking-widest uppercase mb-6 shadow-brutal rotate-1">Workflow</span>
                        <h2 className="text-5xl md:text-7xl font-display font-black text-brutal-black mb-20 tracking-tighter uppercase">How It Works</h2>
                    </RevealOnScroll>
                    
                    <div className="grid md:grid-cols-3 gap-12 max-w-sm md:max-w-none mx-auto">
                        {/* Step 1 */}
                        <RevealOnScroll delay={100} className="flex flex-col items-center group cursor-pointer w-full">
                            <div className="w-full max-w-[224px] h-40 bg-white border-4 border-brutal-black mb-6 sm:mb-8 flex items-center justify-center shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all duration-200 relative">
                                <div className="flex flex-col items-center text-brutal-black z-10">
                                    <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <span className="text-lg font-black tracking-widest uppercase">Upload</span>
                                </div>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-black text-brutal-black mb-3 uppercase">1. Upload Media</h4>
                            <p className="text-base sm:text-lg font-bold text-brutal-black leading-relaxed w-full">Drop in a Video, Audio file, PDF document, or any Web Link.</p>
                        </RevealOnScroll>
                        
                        {/* Step 2 */}
                        <RevealOnScroll delay={200} className="flex flex-col items-center group cursor-pointer w-full">
                            <div className="w-full max-w-[224px] h-40 bg-brutal-pink border-4 border-brutal-black mb-6 sm:mb-8 flex flex-col items-center justify-center p-6 shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all duration-200 relative">
                                <div className="w-3/4 h-4 bg-white border-2 border-brutal-black mb-3"></div>
                                <div className="w-full h-4 bg-white border-2 border-brutal-black mb-3"></div>
                                <div className="w-5/6 h-4 bg-white border-2 border-brutal-black"></div>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-black text-brutal-black mb-3 uppercase">2. Automagic</h4>
                            <p className="text-base sm:text-lg font-bold text-brutal-black leading-relaxed w-full">NoteCraft AI instantly extracts and organizes the core knowledge.</p>
                        </RevealOnScroll>
                        
                        {/* Step 3 */}
                        <RevealOnScroll delay={300} className="flex flex-col items-center group cursor-pointer w-full">
                            <div className="w-full max-w-[224px] h-40 bg-brutal-yellow border-4 border-brutal-black mb-6 sm:mb-8 flex flex-col p-5 shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all duration-200 relative">
                                <div className="flex justify-between items-center mb-6 w-full">
                                    <div className="text-lg font-black text-brutal-black uppercase">QUIZ</div>
                                    <div className="px-2 py-1 bg-white border-2 border-brutal-black text-brutal-black font-black uppercase text-[10px] sm:text-xs">Flashcards</div>
                                </div>
                                <div className="flex gap-2 items-end h-full mt-auto w-full">
                                    <div className="w-1/3 bg-white border-2 border-brutal-black h-1/2"></div>
                                    <div className="w-1/3 bg-white border-2 border-brutal-black h-3/4"></div>
                                    <div className="w-1/3 bg-white border-2 border-brutal-black h-full"></div>
                                </div>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-black text-brutal-black mb-3 uppercase">3. Study Smarter</h4>
                            <p className="text-base sm:text-lg font-bold text-brutal-black leading-relaxed w-full">Master concepts with personalized spaced repetition quizzes.</p>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* Blob Animations */}
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob { animation: blob 10s infinite; }
                    .animation-delay-2000 { animation-delay: 2s; }
                    .animation-delay-4000 { animation-delay: 4s; }
                `}} />
            </section>

            {/* Dynamic Study Section */}
            <section className="bg-brutal-green py-32 relative overflow-hidden z-20 border-t-8 border-brutal-black">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <RevealOnScroll className="order-2 lg:order-1">
                            <span className="inline-block py-2 px-4 bg-white text-brutal-black border-4 border-brutal-black font-black tracking-widest uppercase mb-6 shadow-brutal -rotate-1">Interactive</span>
                            <h2 className="text-5xl md:text-7xl font-display font-black text-brutal-black mb-6 leading-tight uppercase tracking-tighter">
                                A <span className="text-brutal-yellow bg-brutal-black px-2 shadow-brutal inline-block rotate-2">Dynamic</span><br/>Study Experience
                            </h2>
                            <p className="text-2xl text-brutal-black mb-10 leading-relaxed font-bold border-l-8 border-brutal-black pl-4">
                                Dive into a bold, interactive workspace. Smart Flashcards, interactive Study Roadmaps, an AI Study Buddy, and a hands-free Podcast Mode working in perfect harmony.
                            </p>
                            <Link to="/app" className="px-8 py-4 bg-brutal-pink text-brutal-black font-black uppercase text-xl border-4 border-brutal-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center gap-2 group">
                                Try It Right Now
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                        </RevealOnScroll>
                        
                        <RevealOnScroll delay={200} className="order-1 lg:order-2 relative">
                            <div className="relative border-8 border-brutal-black shadow-brutal bg-white overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-300">
                                <FlashcardStudyView cards={sampleCards} />
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>
        </div>
    );
}

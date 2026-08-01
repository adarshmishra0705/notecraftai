import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashcardStudyView from '../components/FlashcardStudyView';
import PodcastView from '../components/PodcastView';
import { calculateSM2 } from '../lib/sm2';
import { CheckCircle, Layers, Headphones } from 'lucide-react';
import { useAppContext } from '../lib/context';

export default function Study() {
    const navigate = useNavigate();
    const { uploadData } = useAppContext();
    const [cards, setCards] = useState([]);
    const [reviewedCount, setReviewedCount] = useState(0);
    
    // Tab State: 'flashcards' or 'podcast'
    const [activeTab, setActiveTab] = useState('flashcards');

    useEffect(() => {
        if (!uploadData || !uploadData.generatedCards) {
            navigate('/app');
            return;
        }
        setCards(uploadData.generatedCards);
    }, [uploadData, navigate]);

    const handleReviewComplete = (card, quality) => {
        // Calculate new SM2 values
        const result = calculateSM2(quality, card.easeFactor, card.repetitions, card.intervalDays);
        
        // Update the card in our state
        setCards(prevCards => prevCards.map(c => {
            if (c.id === card.id) {
                return { ...c, ...result };
            }
            return c;
        }));

        setReviewedCount(prev => prev + 1);
    };

    const handleFinish = () => {
        navigate('/app');
    };

    if (activeTab === 'flashcards' && reviewedCount >= cards.length && cards.length > 0) {
        return (
            <div className="min-h-screen bg-brutal-bg text-brutal-black flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
                {/* Pattern background */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#111111 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="bg-brutal-green border-8 border-brutal-black shadow-brutal p-12 max-w-lg w-full text-center relative z-10 rotate-1">
                    <CheckCircle className="w-24 h-24 text-brutal-black mx-auto mb-6 bg-white rounded-full border-4 border-brutal-black" />
                    <h2 className="text-4xl font-display font-black text-brutal-black mb-4 uppercase tracking-tighter">You're all caught up!</h2>
                    <p className="text-brutal-black mb-8 max-w-md text-center font-bold bg-white border-4 border-brutal-black p-4 inline-block">
                        You have successfully reviewed all the generated flashcards for this session. The SM-2 algorithm has scheduled your next reviews.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => setActiveTab('podcast')}
                            className="px-8 py-3 bg-white text-brutal-black border-4 border-brutal-black font-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:bg-brutal-pink transition-all uppercase"
                        >
                            Podcast Mode
                        </button>
                        <button 
                            onClick={handleFinish}
                            className="px-8 py-3 bg-brutal-blue text-white border-4 border-brutal-black font-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:bg-brutal-yellow hover:text-brutal-black transition-all uppercase"
                        >
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brutal-bg text-brutal-black p-8 flex flex-col font-sans relative">
            {/* Pattern background */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#111111 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            
            <header className="max-w-3xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between mb-8 relative z-10 bg-white border-4 border-brutal-black shadow-brutal p-4 gap-4 sm:gap-0">
                <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-brutal-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                    </svg>
                    <span className="font-display font-black text-xl sm:text-2xl text-brutal-black tracking-tighter uppercase">Study Session</span>
                </div>
                
                {/* Mode Toggle */}
                <div className="flex items-center bg-white border-4 border-brutal-black shadow-brutal-sm p-1 w-full sm:w-auto justify-center">
                    <button 
                        onClick={() => setActiveTab('flashcards')}
                        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-black transition-all uppercase ${activeTab === 'flashcards' ? 'bg-brutal-yellow text-brutal-black border-2 border-brutal-black' : 'text-brutal-black hover:bg-brutal-bg border-2 border-transparent'}`}
                    >
                        <Layers className="w-4 h-4" /> <span>Flashcards</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('podcast')}
                        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-black transition-all uppercase ${activeTab === 'podcast' ? 'bg-brutal-cyan text-brutal-black border-2 border-brutal-black' : 'text-brutal-black hover:bg-brutal-bg border-2 border-transparent'}`}
                    >
                        <Headphones className="w-4 h-4" /> <span>Podcast</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-3xl w-full mx-auto flex flex-col relative z-10">
                
                {activeTab === 'flashcards' && uploadData?.aiInsights && (
                    <div className="w-full bg-brutal-blue border-8 border-brutal-black shadow-brutal p-6 mb-8 relative -rotate-1">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-black text-white flex items-center gap-2 uppercase text-xl">
                                    <span className="text-2xl bg-white text-brutal-black rounded-full w-8 h-8 flex items-center justify-center border-2 border-brutal-black -rotate-12">✨</span> 
                                    AI Overview
                                </h4>
                                <span className={`px-4 py-1 border-4 border-brutal-black text-sm font-black uppercase ${
                                    uploadData.aiInsights.difficulty === 'Beginner' ? 'bg-brutal-green text-brutal-black' :
                                    uploadData.aiInsights.difficulty === 'Intermediate' ? 'bg-brutal-yellow text-brutal-black' :
                                    'bg-brutal-pink text-brutal-black'
                                }`}>
                                    {uploadData.aiInsights.difficulty} Level
                                </span>
                            </div>
                            <p className="text-white font-bold text-lg leading-relaxed mb-4 bg-brutal-black p-3 border-l-4 border-brutal-yellow">
                                {uploadData.aiInsights.summary}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {uploadData.aiInsights.tags?.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white text-brutal-black text-sm font-black uppercase border-2 border-brutal-black shadow-brutal-sm rotate-1">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full">
                    {activeTab === 'flashcards' ? (
                        <FlashcardStudyView 
                            cards={cards.slice(reviewedCount)} 
                            onReviewComplete={handleReviewComplete} 
                        />
                    ) : (
                        <PodcastView />
                    )}
                </div>
            </main>
        </div>
    );
}

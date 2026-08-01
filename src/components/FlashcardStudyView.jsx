import React, { useState } from 'react';
import { FileText, AlignLeft, Wand2, Loader2, PlayCircle } from 'lucide-react';
import { useAppContext } from '../lib/context';

export default function FlashcardStudyView({ cards = [], onReviewComplete }) {
    const { apiKey } = useAppContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    // AI Magic State
    const [isGeneratingTrick, setIsGeneratingTrick] = useState(false);
    const [trickResult, setTrickResult] = useState(null);
    const [trickError, setTrickError] = useState(null);

    // Video State
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const [videoError, setVideoError] = useState(null);

    const currentCard = cards[currentIndex];

    if (!currentCard) return null;

    const handleRating = (quality) => {
        setIsFlipped(false);
        setTrickResult(null); // Reset trick for next card
        setTrickError(null);
        setVideoId(null); // Reset video
        setVideoError(null);
        if (onReviewComplete) {
            onReviewComplete(currentCard, quality);
        }
        setCurrentIndex((prev) => (prev + 1) % cards.length); // loop for demo
    };

    const handleMagicTrick = async (e) => {
        e.stopPropagation(); // prevent card from flipping
        
        if (!apiKey) {
            setTrickError("API key required.");
            return;
        }

        setIsGeneratingTrick(true);
        setTrickError(null);

        try {
            const prompt = `You are an expert tutor. Create a very short, funny, or clever memory trick (mnemonic or ELI5 analogy) to help a student remember the following fact.
Fact: ${currentCard.back}
Context (Question): ${currentCard.front}

Keep your response under 3 sentences and make it highly memorable. Do NOT use markdown or quotes. Just output the trick directly.`;

            const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7 // higher temp for more creativity
                })
            });

            if (!response.ok) throw new Error("Failed to generate trick.");
            
            const data = await response.json();
            setTrickResult(data.choices[0].message.content);
        } catch (err) {
            setTrickError("Could not generate memory trick right now.");
        } finally {
            setIsGeneratingTrick(false);
        }
    };

    const handleFindVideo = async (e) => {
        e.stopPropagation();
        
        setIsVideoLoading(true);
        setVideoError(null);

        // Simulate AI analyzing the card and "searching" YouTube
        setTimeout(() => {
            // Mock curated educational videos relevant to the user's document (Java, Node, Mongo)
            const mockVideos = [
                '-MTSQjw5DrM', // Fireship: RESTful APIs in Node.js
                'Oe421EPjeBE', // Fireship: Node.js Beginners Guide
                'l9AzO1FMgM8', // Java in 100 Seconds
                '-bt_y4Loofg', // MongoDB in 100 Seconds
            ];
            // Just grab a random one to simulate the AI finding a relevant clip
            const randomVideo = mockVideos[Math.floor(Math.random() * mockVideos.length)];
            setVideoId(randomVideo);
            setIsVideoLoading(false);
        }, 1500);
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white border-4 sm:border-8 border-brutal-black shadow-brutal overflow-hidden flex flex-col p-4 sm:p-10">
            {/* Main Card Area */}
            <div className="w-full flex flex-col bg-white relative">
                <div className="flex justify-between items-center mb-6 sm:mb-10 border-b-4 border-brutal-black pb-4">
                    <h3 className="text-sm font-black text-brutal-black uppercase tracking-wider">Generated Flashcard</h3>
                    <span className="px-4 py-1.5 bg-brutal-pink text-brutal-black border-2 border-brutal-black text-xs font-black uppercase shadow-brutal-sm -rotate-2">
                        Card {currentIndex + 1} of {cards.length}
                    </span>
                </div>

                {/* Card flip container */}
                <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full cursor-pointer mx-auto group relative"
                    style={{ perspective: '1000px' }}
                >
                    <div 
                        className="grid w-full transition-all duration-500"
                        style={{ 
                            transformStyle: 'preserve-3d',
                            transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)'
                        }}
                    >
                        {/* Front */}
                        <div 
                            className="col-start-1 row-start-1 min-h-[200px] sm:min-h-[250px] bg-brutal-bg border-4 sm:border-8 border-brutal-black p-4 sm:p-8 flex items-center justify-center text-center shadow-brutal group-hover:shadow-brutal-sm group-hover:translate-x-1 group-hover:translate-y-1 transition-all" 
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <p className="text-xl sm:text-2xl font-black text-brutal-black leading-relaxed">{currentCard.front}</p>
                        </div>
                        {/* Back */}
                        <div 
                            className="col-start-1 row-start-1 min-h-[200px] sm:min-h-[250px] bg-white border-4 sm:border-8 border-brutal-black p-4 sm:p-8 flex flex-col items-center justify-center text-center shadow-brutal" 
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                        >
                            <p className="text-lg sm:text-xl font-bold text-brutal-black leading-relaxed bg-brutal-yellow p-3 sm:p-4 border-4 border-brutal-black inline-block">{currentCard.back}</p>
                            
                            {/* AI Magic Buttons (Only visible on the back) */}
                            <div className="mt-8 pt-6 border-t-4 border-brutal-black w-full flex flex-col items-center justify-center">
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {!trickResult && !isGeneratingTrick && (
                                        <button 
                                            onClick={handleMagicTrick}
                                            className="flex items-center gap-2 px-4 py-2 bg-brutal-cyan text-brutal-black border-4 border-brutal-black font-black uppercase shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all"
                                        >
                                            <Wand2 className="w-4 h-4" /> Explain / Trick
                                        </button>
                                    )}

                                    {!videoId && !isVideoLoading && (
                                        <button 
                                            onClick={handleFindVideo}
                                            className="flex items-center gap-2 px-4 py-2 bg-white text-brutal-black border-4 border-brutal-black font-black uppercase shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:bg-brutal-pink transition-all"
                                        >
                                            <PlayCircle className="w-4 h-4 text-brutal-black" /> Find Video
                                        </button>
                                    )}
                                </div>
                                
                                {isGeneratingTrick && (
                                    <div className="flex items-center gap-2 text-brutal-black font-black text-sm uppercase mt-4 bg-brutal-yellow px-4 py-2 border-2 border-brutal-black">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Cooking up magic...
                                    </div>
                                )}

                                {isVideoLoading && (
                                    <div className="flex items-center gap-2 text-brutal-black font-black text-sm uppercase mt-4 bg-brutal-yellow px-4 py-2 border-2 border-brutal-black">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Scanning YouTube...
                                    </div>
                                )}

                                {trickResult && (
                                    <div className="w-full bg-brutal-bg p-4 border-4 border-brutal-black text-left mt-4 shadow-brutal rotate-1" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Wand2 className="w-4 h-4 text-brutal-black" />
                                            <span className="text-xs font-black text-brutal-black uppercase tracking-wide">AI Memory Trick</span>
                                        </div>
                                        <p className="text-sm text-brutal-black font-bold italic">{trickResult}</p>
                                    </div>
                                )}

                                {videoId && (
                                    <div className="w-full mt-4 z-50 relative border-4 border-brutal-black p-2 bg-brutal-blue shadow-brutal -rotate-1" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2 mb-2 text-white">
                                            <PlayCircle className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-wide">Relevant Video Snippet</span>
                                        </div>
                                        <div className="relative w-full overflow-hidden border-4 border-brutal-black bg-black" style={{ paddingTop: '56.25%' }}>
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                                                src={`https://www.youtube.com/embed/${videoId}?controls=1&rel=0`}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}
                                
                                {trickError && (
                                    <p className="text-xs text-brutal-pink bg-brutal-black px-2 py-1 uppercase font-black mt-2">{trickError}</p>
                                )}
                                {videoError && (
                                    <p className="text-xs text-brutal-pink bg-brutal-black px-2 py-1 uppercase font-black mt-2">{videoError}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className={`mt-6 sm:mt-10 transition-opacity duration-300 flex flex-wrap gap-2 sm:gap-4 justify-center ${isFlipped ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    <button onClick={(e) => { e.stopPropagation(); handleRating(1); }} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border-4 border-brutal-black text-brutal-black hover:bg-brutal-pink hover:translate-x-1 hover:translate-y-1 font-black uppercase shadow-brutal transition-all text-sm sm:text-base">Again</button>
                    <button onClick={(e) => { e.stopPropagation(); handleRating(3); }} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border-4 border-brutal-black text-brutal-black hover:bg-brutal-yellow hover:translate-x-1 hover:translate-y-1 font-black uppercase shadow-brutal transition-all text-sm sm:text-base">Hard</button>
                    <button onClick={(e) => { e.stopPropagation(); handleRating(5); }} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border-4 border-brutal-black text-brutal-black hover:bg-brutal-green hover:translate-x-1 hover:translate-y-1 font-black uppercase shadow-brutal transition-all text-sm sm:text-base">Easy</button>
                </div>
            </div>
        </div>
    );
}

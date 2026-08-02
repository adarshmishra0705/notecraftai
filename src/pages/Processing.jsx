import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileSearch, LibraryBig, AlertCircle } from 'lucide-react';
import { useAppContext } from '../lib/context';
import { parseFileToText } from '../lib/parser';

export default function Processing() {
    const navigate = useNavigate();
    const { uploadData, apiKey, setUploadData, isDemoMode, setSavedDecks } = useAppContext();
    const [step, setStep] = useState(0);
    const [error, setError] = useState(null);
    const processedRef = useRef(false);

    const steps = [
        { icon: FileSearch, text: 'Analyzing document structure...' },
        { icon: Sparkles, text: 'Extracting key concepts...' },
        { icon: LibraryBig, text: 'Generating intelligent flashcards...' }
    ];

    useEffect(() => {
        if (!uploadData || (!apiKey && !isDemoMode)) {
            navigate('/app');
            return;
        }

        if (processedRef.current) return;
        processedRef.current = true;

        async function processFile() {
            try {
                setStep(0); // Analyzing
                
                // 1. Parse File
                const text = await parseFileToText(uploadData.file);
                
                setStep(1); // Extracting

                if (!text || text.trim().length === 0) {
                    throw new Error("Could not extract any text from the file.");
                }

                setStep(2); // Generating

                let finalCards = [];

                if (isDemoMode) {
                    // DEMO MODE: Wait 3 seconds to simulate API, then return fake cards
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    
                    finalCards = [
                        { id: 'd1', front: 'What is the core function of the SM-2 algorithm?', back: 'It calculates optimal review intervals based on user performance.', easeFactor: 2.5, repetitions: 0, intervalDays: 0 },
                        { id: 'd2', front: 'What happens to the repetition count if the user rates a card < 3?', back: 'The repetition count drops back to 0, and the interval is reset to 1 day.', easeFactor: 2.5, repetitions: 0, intervalDays: 0 },
                        { id: 'd3', front: 'What file did you just upload in Demo Mode?', back: `You uploaded a file named: ${uploadData.name}`, easeFactor: 2.5, repetitions: 0, intervalDays: 0 }
                    ];

                    const newDeck = { 
                        ...uploadData, 
                        sessionId: Date.now().toString(),
                        createdAt: new Date().toISOString(),
                        rawText: text,
                        generatedCards: finalCards,
                        aiInsights: {
                            summary: "This is a demo summary of your uploaded document. It contains key insights and concepts designed to test the UI.",
                            difficulty: "Beginner",
                            tags: ["#demo", "#testing"]
                        }
                    };
                    setUploadData(newDeck);
                    setSavedDecks(prev => [newDeck, ...prev]);
                } else {
                    // 2. Call Groq API via fetch (safe for browser)
                    const prompt = `You are an expert tutor. Analyze the following text and extract key educational flashcards and insights.
Output strictly as a JSON object containing EXACTLY these properties:
- "summary": A concise 2-3 sentence summary of the overall text.
- "difficulty": A single word rating the complexity ("Beginner", "Intermediate", or "Advanced").
- "tags": An array of 3-5 relevant string hashtags (e.g. ["#biology", "#cells"]).
- "flashcards": An array of objects, where each object has exactly two string properties: "front" (the question) and "back" (the answer).

Text:
${text.substring(0, 30000)}
`;
                    
                    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: "llama-3.3-70b-versatile",
                            messages: [{ role: "user", content: prompt }],
                            temperature: 0.2,
                            response_format: { type: "json_object" }
                        })
                    });

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        throw new Error(errData.error?.message || "Failed to generate flashcards from Groq API.");
                    }

                    const data = await response.json();
                    let generatedText = data.choices[0].message.content;
                    
                    let parsedObj;
                    let parsedCards;
                    try {
                        parsedObj = JSON.parse(generatedText);
                        parsedCards = parsedObj.flashcards;
                        if (!Array.isArray(parsedCards)) {
                            // Fallback if model named the array something else
                            const possibleArray = Object.values(parsedObj).find(val => Array.isArray(val));
                            parsedCards = possibleArray || [];
                        }
                    } catch (e) {
                        // Fallback parsing if JSON was malformed
                        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
                        parsedObj = JSON.parse(generatedText);
                        parsedCards = parsedObj.flashcards || [];
                    }

                    if (!Array.isArray(parsedCards) || parsedCards.length === 0) {
                        throw new Error("The AI did not return any flashcards.");
                    }

                    // Add SM-2 default fields and IDs
                    finalCards = parsedCards.map((c, i) => ({
                        id: Date.now().toString() + i,
                        front: c.front,
                        back: c.back,
                        easeFactor: 2.5,
                        repetitions: 0,
                        intervalDays: 0
                    }));

                    // Store in context to pass to Study view
                    const newDeck = { 
                        ...uploadData, 
                        sessionId: Date.now().toString(),
                        createdAt: new Date().toISOString(),
                        rawText: text, // Saved for Podcast Mode
                        generatedCards: finalCards,
                        aiInsights: {
                            summary: parsedObj.summary || "No summary provided.",
                            difficulty: parsedObj.difficulty || "Intermediate",
                            tags: Array.isArray(parsedObj.tags) ? parsedObj.tags : []
                        }
                    };
                    setUploadData(newDeck);
                    setSavedDecks(prev => [newDeck, ...prev]);
                }
                
                navigate('/app/study');

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }

        processFile();

    }, [navigate, uploadData, apiKey, isDemoMode, setUploadData]);

    if (error) {
        return (
            <div className="min-h-screen bg-brutal-bg flex items-center justify-center p-6 text-brutal-black font-sans relative overflow-hidden">
                {/* Pattern background */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#111111 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="bg-brutal-pink shadow-brutal border-8 border-brutal-black p-12 max-w-lg w-full text-center relative z-10 rotate-1">
                    <AlertCircle className="w-20 h-20 text-brutal-black mx-auto mb-6" />
                    <h2 className="text-3xl font-display font-black text-brutal-black mb-4 uppercase">Processing Failed</h2>
                    <p className="text-brutal-black font-bold mb-8 text-lg bg-white border-4 border-brutal-black p-4 inline-block">
                        {error}
                    </p>
                    <button onClick={() => navigate('/app')} className="px-8 py-3 bg-white text-brutal-black border-4 border-brutal-black font-black uppercase shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:bg-brutal-yellow transition-all">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brutal-bg flex items-center justify-center p-6 text-brutal-black font-sans relative overflow-hidden">
            {/* Pattern background */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#111111 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="bg-brutal-yellow shadow-brutal border-8 border-brutal-black p-12 max-w-lg w-full text-center relative z-10 -rotate-1">
                <div className="relative w-24 h-24 mx-auto mb-8 bg-white border-4 border-brutal-black flex items-center justify-center shadow-brutal animate-spin">
                    <div className="absolute inset-0 flex items-center justify-center text-brutal-black -animate-spin">
                        {React.createElement(steps[step].icon, { className: 'w-10 h-10' })}
                    </div>
                </div>
                
                <h2 className="text-3xl font-display font-black text-brutal-black mb-4 uppercase">Automagic Insight</h2>
                <p className="text-brutal-black font-bold h-6 transition-all duration-300 ease-in-out bg-white inline-block px-4 py-1 border-2 border-brutal-black shadow-brutal-sm">
                    {steps[step].text}
                </p>
                
                <div className="mt-8 flex justify-center gap-3">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`w-4 h-4 border-2 border-brutal-black transition-colors duration-500 ${i <= step ? 'bg-brutal-pink' : 'bg-white'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}

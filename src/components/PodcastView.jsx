import React, { useState, useEffect, useRef } from 'react';
import { Play, Headphones, Loader2, StopCircle } from 'lucide-react';
import { useAppContext } from '../lib/context';

export default function PodcastView() {
    const { uploadData, apiKey, isDemoMode } = useAppContext();
    
    const [script, setScript] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    
    // Store references to the available voices
    const [voices, setVoices] = useState([]);
    
    const utteranceRef = useRef(null); // Fix Chrome garbage collection bug

    useEffect(() => {
        // Load voices for Web Speech API
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };
        
        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const generatePodcast = async () => {
        // ... (keep generate logic the same)
        if (!isDemoMode && !apiKey) {
            setError("API key required.");
            return;
        }

        const text = uploadData?.rawText || "";
        if (!text && !isDemoMode) {
            setError("No text available to generate a podcast.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            if (isDemoMode) {
                await new Promise(r => setTimeout(r, 2000));
                setScript([
                    { host: "Alex", text: "Welcome to NoteCraft FM! Today we're diving into your latest uploaded document." },
                    { host: "Sam", text: "That's right, Alex. And let me tell you, this is a fascinating read." },
                    { host: "Alex", text: "It really is. The core concept here revolves around how AI is reshaping how we learn." },
                    { host: "Sam", text: "Exactly. Flashcards are great, but sometimes you just want to listen to a conversation." }
                ]);
                setIsGenerating(false);
                return;
            }

            const prompt = `You are a scriptwriter for an engaging, educational podcast. 
Turn the following text into a short 2-host podcast script. Make it conversational, witty, and easy to understand.
Host 1 is named "Alex" (energetic, leads the show).
Host 2 is named "Sam" (analytical, explains the deep concepts).

Output strictly as a JSON object with a property "dialogue" which is an array of objects. 
Each object must have "host" (either "Alex" or "Sam") and "text" (the spoken line).
Limit the podcast to exactly 6-8 lines total so it's short and punchy.

Text:
${text.substring(0, 15000)}
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
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) throw new Error("Failed to generate script.");
            
            const data = await response.json();
            let generatedText = data.choices[0].message.content;
            
            let parsedScript;
            try {
                const parsedObj = JSON.parse(generatedText);
                parsedScript = parsedObj.dialogue;
            } catch (e) {
                generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsedObj = JSON.parse(generatedText);
                parsedScript = parsedObj.dialogue;
            }

            if (!Array.isArray(parsedScript) || parsedScript.length === 0) {
                throw new Error("Invalid script generated.");
            }

            setScript(parsedScript);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to generate podcast.");
        } finally {
            setIsGenerating(false);
        }
    };

    const playPodcast = () => {
        if (!script || script.length === 0) return;
        
        window.speechSynthesis.cancel(); // Clear any stuck speech
        window.speechSynthesis.resume(); // Fix if it got paused
        setIsPlaying(true);
        playLine(0);
    };

    const stopPodcast = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentLineIndex(-1);
    };

    // Global array to prevent Chrome garbage collection
    const keepAliveUtterances = useRef([]);

    const playLine = (index) => {
        if (index >= script.length) {
            setIsPlaying(false);
            setCurrentLineIndex(-1);
            return;
        }

        setCurrentLineIndex(index);
        const line = script[index];
        const utterance = new SpeechSynthesisUtterance(line.text);
        
        // Push to ref array to ensure it stays in memory
        keepAliveUtterances.current.push(utterance);
        
        let availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length === 0 && voices.length > 0) {
            availableVoices = voices;
        }

        // Try to find distinct voices, fallback gracefully if not found
        if (availableVoices.length > 0) {
            // Find any English voices first, otherwise use whatever is available
            let targetVoices = availableVoices.filter(v => v.lang && v.lang.startsWith('en'));
            if (targetVoices.length === 0) targetVoices = availableVoices;
            
            let voiceToUse = targetVoices[0]; // default fallback
            
            if (line.host === "Alex") {
                voiceToUse = targetVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david')) || targetVoices[0];
            } else {
                voiceToUse = targetVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira')) || targetVoices[targetVoices.length - 1];
            }
            
            if (voiceToUse) {
                utterance.voice = voiceToUse;
            }
        }
        
        utterance.rate = 1.0; 
        
        utterance.onend = () => {
            playLine(index + 1);
        };
        
        utterance.onerror = (e) => {
            console.error("Speech Error:", e);
            setIsPlaying(false);
            setCurrentLineIndex(-1);
        };

        // Sometimes cancel is needed before speak in Chrome Windows
        window.speechSynthesis.cancel();
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 50);
    };

    if (!script && !isGenerating) {
        return (
            <div className="w-full bg-brutal-cyan border-8 border-brutal-black p-10 text-center shadow-brutal rotate-1">
                <div className="w-24 h-24 bg-white border-4 border-brutal-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-brutal-sm">
                    <Headphones className="w-12 h-12 text-brutal-black" />
                </div>
                <h3 className="text-3xl font-display font-black text-brutal-black mb-2 uppercase">Turn notes into a Podcast</h3>
                <p className="text-brutal-black font-bold mb-8 max-w-md mx-auto bg-white p-2 border-2 border-brutal-black">
                    Take a break from reading. Let AI synthesize a witty, 2-host audio podcast summarizing your material.
                </p>
                <button 
                    onClick={generatePodcast}
                    className="px-8 py-4 bg-brutal-pink text-brutal-black border-4 border-brutal-black font-black uppercase shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:bg-brutal-yellow transition-all text-lg"
                >
                    Generate Episode
                </button>
                {error && <p className="text-brutal-pink bg-brutal-black px-2 py-1 uppercase font-black mt-4 inline-block">{error}</p>}
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="w-full bg-brutal-yellow border-8 border-brutal-black p-16 text-center shadow-brutal flex flex-col items-center justify-center -rotate-1">
                <Loader2 className="w-16 h-16 text-brutal-black animate-spin mb-6" />
                <h3 className="text-3xl font-display font-black text-brutal-black uppercase">Writing Script...</h3>
                <p className="text-brutal-black font-bold mt-2 bg-white px-2 py-1 border-2 border-brutal-black">Groq is analyzing your document and writing the podcast.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border-8 border-brutal-black shadow-brutal flex flex-col relative overflow-hidden -rotate-1">
            <div className="relative z-10 p-8 flex items-center justify-between border-b-8 border-brutal-black bg-brutal-yellow">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brutal-pink border-4 border-brutal-black rounded-full flex items-center justify-center shadow-brutal-sm -rotate-12">
                        <Headphones className="w-8 h-8 text-brutal-black" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-display font-black text-brutal-black tracking-tighter uppercase">NoteCraft FM</h3>
                        <p className="text-brutal-black font-bold uppercase bg-white px-2 py-0.5 border-2 border-brutal-black inline-block mt-1">Episode 1 • Your Notes</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {isPlaying ? (
                        <button onClick={stopPodcast} className="p-4 bg-white border-4 border-brutal-black hover:bg-brutal-pink text-brutal-black transition-all shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1">
                            <StopCircle className="w-8 h-8" />
                        </button>
                    ) : (
                        <button onClick={playPodcast} className="p-4 bg-white border-4 border-brutal-black hover:bg-brutal-green text-brutal-black transition-all shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1">
                            <Play className="w-8 h-8 ml-1" />
                        </button>
                    )}
                </div>
            </div>
            
            <div className="relative z-10 p-8 max-h-[500px] overflow-y-auto space-y-6 bg-brutal-bg">
                {script?.map((line, idx) => {
                    const isActive = idx === currentLineIndex;
                    const isAlex = line.host === "Alex";
                    
                    return (
                        <div key={idx} className={`flex flex-col ${isAlex ? 'items-start' : 'items-end'} transition-opacity duration-300 ${isPlaying && !isActive ? 'opacity-40' : 'opacity-100'}`}>
                            <span className={`text-xs font-black uppercase tracking-widest mb-1 px-3 py-1 border-2 border-brutal-black ${isAlex ? 'bg-brutal-cyan' : 'bg-brutal-pink'} text-brutal-black rotate-1`}>
                                {line.host}
                            </span>
                            <div className={`max-w-[80%] p-5 text-lg font-bold border-4 border-brutal-black shadow-brutal ${
                                isActive 
                                    ? (isAlex ? 'bg-brutal-green text-brutal-black translate-x-1 translate-y-1 shadow-brutal-sm' : 'bg-brutal-yellow text-brutal-black translate-x-1 translate-y-1 shadow-brutal-sm')
                                    : 'bg-white text-brutal-black'
                            }`}>
                                {line.text}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

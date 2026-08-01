import React, { useState } from 'react';
import { Map, MapPin, Loader2, Target, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { useAppContext } from '../lib/context';

export default function RoadmapBuilder() {
    const { apiKey, isDemoMode } = useAppContext();
    
    const [topic, setTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [error, setError] = useState(null);

    const generateRoadmap = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic to learn.");
            return;
        }

        if (!isDemoMode && !apiKey) {
            setError("API key required.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            if (isDemoMode) {
                await new Promise(r => setTimeout(r, 2500));
                setRoadmap({
                    title: `Mastering ${topic}`,
                    description: "A structured 4-week curriculum designed to take you from beginner to proficient.",
                    weeks: [
                        {
                            weekNumber: 1,
                            theme: "Foundations & Basics",
                            milestones: [
                                { title: "Core Concepts", description: "Understand the fundamental principles and history." },
                                { title: "Essential Tools", description: "Set up your environment and learn the basic tools." }
                            ]
                        },
                        {
                            weekNumber: 2,
                            theme: "Intermediate Application",
                            milestones: [
                                { title: "First Project", description: "Apply what you learned in a controlled environment." },
                                { title: "Common Pitfalls", description: "Learn what to avoid and best practices." }
                            ]
                        },
                        {
                            weekNumber: 3,
                            theme: "Advanced Theory",
                            milestones: [
                                { title: "Deep Dive", description: "Explore the complex underlying mechanics." }
                            ]
                        },
                        {
                            weekNumber: 4,
                            theme: "Mastery",
                            milestones: [
                                { title: "Final Capstone", description: "Build a comprehensive project from scratch." }
                            ]
                        }
                    ]
                });
                setIsGenerating(false);
                return;
            }

            const prompt = `Act as an expert curriculum designer. The user wants to learn about: "${topic}".
Create a highly engaging, structured 4-week study roadmap for this topic.

Output strictly as a JSON object with this exact structure:
{
  "title": "Catchy Title for the Roadmap",
  "description": "1 sentence description",
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Theme of the week",
      "milestones": [
        { "title": "Milestone title", "description": "Short action-oriented description of what to learn" },
        ... (2 to 3 milestones per week)
      ]
    },
    ... (exactly 4 weeks)
  ]
}`;

            const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.6,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) throw new Error("Failed to generate roadmap.");
            
            const data = await response.json();
            let generatedText = data.choices[0].message.content;
            
            let parsedObj;
            try {
                parsedObj = JSON.parse(generatedText);
            } catch (e) {
                generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
                parsedObj = JSON.parse(generatedText);
            }

            if (!parsedObj || !parsedObj.weeks) {
                throw new Error("Invalid roadmap generated.");
            }

            setRoadmap(parsedObj);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to generate roadmap.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (roadmap) {
        return (
            <div className="w-full max-w-4xl mx-auto animation-fade-in pb-20">
                <div className="flex items-center justify-between mb-8 border-b-8 border-brutal-black pb-6">
                    <div>
                        <h2 className="text-4xl font-display font-black text-brutal-black tracking-tighter uppercase inline-block bg-brutal-yellow px-4 py-2 border-4 border-brutal-black shadow-brutal rotate-1">{roadmap.title}</h2>
                        <p className="text-brutal-black font-bold mt-4 bg-white px-3 py-1 border-2 border-brutal-black inline-block">{roadmap.description}</p>
                    </div>
                    <button 
                        onClick={() => setRoadmap(null)}
                        className="px-6 py-3 bg-white hover:bg-brutal-pink text-brutal-black font-black uppercase border-4 border-brutal-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        Create New
                    </button>
                </div>

                <div className="relative border-l-8 border-brutal-black ml-6 space-y-12 pb-8">
                    {roadmap.weeks.map((week, idx) => (
                        <div key={idx} className="relative pl-12">
                            {/* Node */}
                            <div className="absolute -left-[36px] top-0 w-16 h-16 bg-brutal-blue rounded-full border-4 border-brutal-black flex items-center justify-center shadow-brutal">
                                <span className="text-white font-black text-2xl">{week.weekNumber}</span>
                            </div>
                            
                            <div className="bg-white border-4 border-brutal-black p-6 shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 transition-all group">
                                <h3 className="text-sm font-black text-brutal-black uppercase tracking-wider mb-2 bg-brutal-yellow inline-block px-2 py-0.5 border-2 border-brutal-black rotate-2 group-hover:-rotate-2 transition-transform">Week {week.weekNumber}</h3>
                                <h4 className="text-2xl font-black text-brutal-black mb-6 uppercase">{week.theme}</h4>
                                
                                <div className="space-y-4">
                                    {week.milestones.map((ms, mIdx) => (
                                        <div key={mIdx} className="flex gap-4 p-4 bg-brutal-bg border-4 border-brutal-black hover:bg-brutal-cyan transition-colors">
                                            <div className="mt-0.5">
                                                <div className="w-8 h-8 bg-white border-4 border-brutal-black flex items-center justify-center shadow-brutal-sm group-hover:bg-brutal-pink transition-colors">
                                                    <CheckCircle2 className="w-5 h-5 text-brutal-black" />
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="font-black text-brutal-black uppercase text-lg">{ms.title}</h5>
                                                <p className="text-sm text-brutal-black font-bold mt-1 bg-white px-2 py-1 border-2 border-brutal-black">{ms.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white border-8 border-brutal-black p-10 text-center relative overflow-hidden shadow-brutal rotate-1">
                
                <div className="w-24 h-24 bg-brutal-pink border-4 border-brutal-black rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-brutal-sm -rotate-12">
                    <Map className="w-12 h-12 text-brutal-black" />
                </div>
                
                <h3 className="text-4xl font-display font-black text-brutal-black mb-3 relative z-10 uppercase tracking-tighter">Study Roadmap Builder</h3>
                <p className="text-brutal-black font-bold mb-10 max-w-md mx-auto relative z-10 bg-brutal-yellow p-3 border-4 border-brutal-black">
                    Tell the AI what you want to learn, and it will generate a beautiful, structured 4-week curriculum just for you.
                </p>

                <div className="relative max-w-lg mx-auto z-10">
                    <div className="relative flex items-center shadow-brutal">
                        <Search className="absolute left-4 w-8 h-8 text-brutal-black font-black" />
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isGenerating && generateRoadmap()}
                            placeholder="e.g. Machine Learning, World War II..."
                            className="w-full pl-14 pr-16 py-6 bg-white border-4 border-brutal-black focus:outline-none focus:bg-brutal-yellow transition-all font-bold text-brutal-black placeholder:text-slate-500 text-lg uppercase"
                            disabled={isGenerating}
                        />
                        <button 
                            onClick={generateRoadmap}
                            disabled={isGenerating || !topic.trim()}
                            className="absolute right-2 bg-brutal-blue hover:bg-brutal-cyan disabled:bg-slate-300 disabled:cursor-not-allowed text-white hover:text-brutal-black p-3 border-4 border-brutal-black transition-colors flex items-center justify-center shadow-brutal-sm"
                        >
                            {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <ArrowRight className="w-8 h-8 font-black" />}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-6 text-brutal-pink font-black bg-brutal-black py-2 px-4 inline-block border-2 border-brutal-pink uppercase">
                            {error}
                        </div>
                    )}
                </div>

                {isGenerating && (
                    <div className="mt-10 font-black text-brutal-black uppercase text-lg flex items-center justify-center gap-2 relative z-10 bg-brutal-green p-3 border-4 border-brutal-black inline-flex rotate-2 shadow-brutal-sm animate-pulse">
                        <Target className="w-6 h-6" /> Mapping out your learning journey...
                    </div>
                )}
            </div>
        </div>
    );
}

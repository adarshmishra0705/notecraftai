import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Settings, X, Key, Zap, Map, FileText } from 'lucide-react';
import { useAppContext } from '../lib/context';
import RoadmapBuilder from '../components/RoadmapBuilder';
import StudyBuddyWidget from '../components/StudyBuddyWidget';

export default function Dashboard() {
    const navigate = useNavigate();
    const { setUploadData, apiKey, setApiKey, isDemoMode, setIsDemoMode } = useAppContext();
    const [isDragging, setIsDragging] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'roadmap'
    
    const fileInputRef = useRef(null);

    const isUploadDisabled = !isDemoMode && !apiKey;

    const handleFile = (file) => {
        if (!file) return;
        setUploadData({ type: 'file', file, name: file.name });
        navigate('/app/processing');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (isUploadDisabled) return;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (isUploadDisabled) return;
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-brutal-bg text-brutal-black font-sans p-8 flex flex-col relative overflow-hidden">
            {/* Brutalist Pattern Background */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#111111 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <header className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between mb-8 md:mb-16 relative z-10 border-b-4 border-brutal-black bg-white p-4 gap-4 md:gap-0">
                <div className="flex items-center gap-3 w-full justify-between md:w-auto">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-brutal-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                        </svg>
                        <span className="font-display font-black text-xl sm:text-2xl text-brutal-black tracking-tight uppercase">NoteCraft <span className="bg-brutal-yellow px-1 border-2 border-brutal-black inline-block -rotate-3 ml-1">AI</span></span>
                    </div>
                    
                    {/* Settings button on mobile */}
                    <div className="flex md:hidden items-center">
                        <button 
                            onClick={() => setShowSettings(true)}
                            className={`p-2 transition-colors relative border-2 border-brutal-black shadow-brutal hover:shadow-brutal-sm hover:translate-y-1 ${isUploadDisabled ? 'bg-brutal-yellow text-brutal-black' : 'bg-white text-brutal-black hover:bg-brutal-bg'}`}
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                            {!apiKey && !isDemoMode && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-brutal-pink rounded-full border-2 border-brutal-black"></span>
                            )}
                        </button>
                    </div>
                </div>
                
                {/* Mode Toggle */}
                <div className="flex items-center bg-white border-4 border-brutal-black shadow-brutal p-1 w-full sm:w-auto md:absolute md:left-1/2 md:-translate-x-1/2 justify-center">
                    <button 
                        onClick={() => setActiveTab('notes')}
                        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-3 sm:px-6 py-2 text-xs sm:text-sm font-black transition-all uppercase ${activeTab === 'notes' ? 'bg-brutal-pink text-brutal-black border-2 border-brutal-black' : 'text-brutal-black hover:bg-brutal-bg border-2 border-transparent'}`}
                    >
                        <FileText className="w-4 h-4" /> <span>Smart Notes</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('roadmap')}
                        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-3 sm:px-6 py-2 text-xs sm:text-sm font-black transition-all uppercase ${activeTab === 'roadmap' ? 'bg-brutal-cyan text-brutal-black border-2 border-brutal-black' : 'text-brutal-black hover:bg-brutal-bg border-2 border-transparent'}`}
                    >
                        <Map className="w-4 h-4" /> <span>Study Roadmap</span>
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button 
                        onClick={() => setShowSettings(true)}
                        className={`p-2 transition-colors relative border-2 border-brutal-black shadow-brutal hover:shadow-brutal-sm hover:translate-y-1 ${isUploadDisabled ? 'bg-brutal-yellow text-brutal-black' : 'bg-white text-brutal-black hover:bg-brutal-bg'}`}
                        title="Settings"
                    >
                        <Settings className="w-6 h-6" />
                        {!apiKey && !isDemoMode && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-brutal-pink rounded-full border-2 border-brutal-black"></span>
                        )}
                    </button>
                    <div className="w-10 h-10 bg-brutal-blue rounded-full flex items-center justify-center text-white font-black border-2 border-brutal-black shadow-brutal">
                        U
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full mx-auto flex flex-col items-center justify-center relative z-10">
                {activeTab === 'roadmap' ? (
                    <RoadmapBuilder />
                ) : (
                    <div className="w-full max-w-3xl mx-auto animation-fade-in">
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-display font-black text-brutal-black tracking-tighter uppercase inline-block bg-brutal-yellow px-4 py-2 border-4 border-brutal-black shadow-brutal rotate-1">Upload Material</h1>
                        </div>

                        {isUploadDisabled && (
                            <div className="mb-8 p-4 bg-white border-4 border-brutal-black flex items-start gap-3 shadow-brutal translate-x-2">
                                <Key className="w-6 h-6 text-brutal-black flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-base font-black text-brutal-black uppercase">API Key Required</h4>
                                    <p className="text-sm font-bold text-brutal-black mt-1">Please configure your Groq API Key in the settings before uploading files. (Or enable Demo Mode)</p>
                                    <button onClick={() => setShowSettings(true)} className="mt-2 text-sm font-black text-brutal-pink hover:text-brutal-black underline uppercase">Open Settings</button>
                                </div>
                            </div>
                        )}
                        
                        {isDemoMode && (
                            <div className="mb-8 p-4 bg-brutal-cyan border-4 border-brutal-black flex items-start gap-3 shadow-brutal -translate-x-2">
                                <Zap className="w-6 h-6 text-brutal-black flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-base font-black text-brutal-black uppercase">Demo Mode Active</h4>
                                    <p className="text-sm font-bold text-brutal-black mt-1">Files uploaded will be processed locally, and fake flashcards will be generated to test the UI.</p>
                                </div>
                            </div>
                        )}

                        <div 
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => {
                                if (isUploadDisabled) {
                                    setShowSettings(true);
                                } else if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                }
                            }}
                            className={`block cursor-pointer group border-8 border-brutal-black p-8 sm:p-16 text-center transition-all duration-300 relative overflow-hidden bg-white shadow-brutal active:bg-brutal-yellow ${isDragging ? 'bg-brutal-yellow translate-x-2 translate-y-2 shadow-brutal-sm' : 'md:hover:-translate-y-2 md:hover:-translate-x-2 md:hover:shadow-brutal-lg'} ${isUploadDisabled ? 'opacity-60 border-dashed' : ''}`}
                        >
                            <input 
                                type="file"
                                accept=".txt,.pdf"
                                onChange={handleFileChange}
                                className="sr-only"
                                disabled={isUploadDisabled}
                                ref={fileInputRef}
                            />
                            
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white border-4 border-brutal-black rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 shadow-brutal group-hover:bg-brutal-pink group-hover:rotate-12 pointer-events-none">
                                <UploadCloud className="w-10 h-10 sm:w-12 sm:h-12 text-brutal-black" />
                            </div>
                            
                            <h3 className="relative text-2xl sm:text-3xl font-black text-brutal-black mb-2 uppercase pointer-events-none">Drop files here</h3>
                            <p className="relative text-brutal-black font-bold mb-8 uppercase text-xs sm:text-sm border-2 border-brutal-black inline-block px-3 py-1 bg-brutal-bg pointer-events-none">Supports PDF and TXT</p>
                            
                            <br />
                            <div 
                                className={`inline-block px-6 py-3 sm:px-8 sm:py-4 bg-brutal-blue border-4 border-brutal-black text-white font-black uppercase text-lg sm:text-xl shadow-brutal transition-all duration-300 w-full sm:w-auto pointer-events-none ${isUploadDisabled ? 'bg-slate-400' : 'md:group-hover:bg-brutal-yellow md:group-hover:text-brutal-black'}`}
                            >
                                {isUploadDisabled ? 'Configure API Key First' : 'Browse Files'}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-brutal-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animation-fade-in">
                    <div className="bg-white border-4 border-brutal-black shadow-brutal-lg w-full max-w-md overflow-hidden relative">
                        <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 p-2 bg-white border-2 border-brutal-black shadow-brutal text-brutal-black hover:bg-brutal-yellow hover:translate-x-1 hover:translate-y-1 transition-all z-10">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-6 border-b-4 border-brutal-black bg-brutal-pink">
                            <h3 className="text-2xl font-display font-black text-brutal-black uppercase">Settings</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            
                            {/* Demo Mode Toggle */}
                            <div className="flex items-center justify-between bg-white p-4 border-4 border-brutal-black shadow-brutal">
                                <div>
                                    <h4 className="text-base font-black text-brutal-black flex items-center gap-2 uppercase">
                                        <Zap className="w-5 h-5 text-brutal-black" /> Demo Mode
                                    </h4>
                                    <p className="text-sm font-bold text-brutal-black mt-1">Generate fake flashcards</p>
                                </div>
                                <button 
                                    onClick={() => setIsDemoMode(!isDemoMode)}
                                    className={`relative inline-flex h-8 w-14 items-center border-4 border-brutal-black transition-colors focus:outline-none ${isDemoMode ? 'bg-brutal-green' : 'bg-brutal-bg'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform bg-white border-2 border-brutal-black transition-transform ${isDemoMode ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            
                            {/* API Key */}
                            <div className={`transition-opacity ${isDemoMode ? 'opacity-50' : 'opacity-100'}`}>
                                <label className="block text-sm font-black text-brutal-black mb-2 uppercase">Groq API Key</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-brutal-black" />
                                    <input 
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        disabled={isDemoMode}
                                        placeholder="gsk_..."
                                        className="w-full pl-12 pr-4 py-3 bg-white border-4 border-brutal-black focus:outline-none focus:bg-brutal-yellow transition-all font-bold disabled:bg-slate-200 shadow-brutal"
                                    />
                                </div>
                                <p className="text-xs font-bold text-brutal-black mt-2 leading-relaxed">
                                    Stored locally in your browser.
                                </p>
                            </div>
                            
                        </div>
                        <div className="p-6 bg-brutal-bg border-t-4 border-brutal-black flex justify-end">
                            <button onClick={() => setShowSettings(false)} className="px-6 py-2.5 bg-brutal-cyan text-brutal-black border-4 border-brutal-black font-black uppercase hover:bg-brutal-yellow transition-colors shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1">
                                Save & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* AI Study Buddy Floating Chat */}
            <StudyBuddyWidget />
        </div>
    );
}

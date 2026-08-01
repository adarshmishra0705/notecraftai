import React from 'react';

export default function AIBackgroundCharacter() {
    return (
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0 opacity-80 animate-float hidden lg:block" style={{ transform: 'translate(10%, -10%)' }}>
            {/* Base Glow */}
            <div className="absolute inset-0 bg-slate-300/30 blur-[100px] rounded-full"></div>
            
            <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                {/* The Character Head/Core */}
                <div className="relative w-64 h-80 rounded-[40%] bg-gradient-to-b from-slate-200/40 to-white/10 backdrop-blur-3xl border border-white/40 shadow-[0_0_80px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center transform-style-3d animate-spin-slow-3d">
                    
                    {/* Inner glowing brain/core */}
                    <div className="absolute w-32 h-40 bg-slate-400/30 blur-2xl rounded-full animate-pulse-fast"></div>

                    {/* The "Eye" / Interface */}
                    <div className="relative w-24 h-8 bg-slate-900 rounded-full border border-slate-600/50 shadow-[0_0_30px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden">
                        {/* Scanning beam */}
                        <div className="absolute w-full h-[2px] bg-slate-300 opacity-80 animate-scan"></div>
                        {/* Actual eye dots */}
                        <div className="flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-slate-300 animate-blink shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300 animate-blink shadow-[0_0_10px_rgba(255,255,255,1)]" style={{animationDelay: '0.1s'}}></div>
                        </div>
                    </div>

                    {/* Floating Tech Rings around the character */}
                    <div className="absolute w-96 h-96 border border-slate-300/30 rounded-full border-t-slate-400/60 animate-spin-slow"></div>
                    <div className="absolute w-[450px] h-[450px] border border-slate-300/20 rounded-full border-b-slate-400/40 animate-spin-reverse-slow"></div>
                    
                </div>
            </div>
            
            {/* CSS Animations defined inline for simplicity and guarantee of working */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(10%); }
                    50% { transform: translateY(-30px) translateX(10%); }
                }
                @keyframes spin-slow-3d {
                    0% { transform: rotateY(-10deg) rotateX(5deg); }
                    50% { transform: rotateY(15deg) rotateX(-5deg); }
                    100% { transform: rotateY(-10deg) rotateX(5deg); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg) rotateX(60deg); }
                    to { transform: rotate(360deg) rotateX(60deg); }
                }
                @keyframes spin-reverse-slow {
                    from { transform: rotate(360deg) rotateX(70deg) rotateY(20deg); }
                    to { transform: rotate(0deg) rotateX(70deg) rotateY(20deg); }
                }
                @keyframes pulse-fast {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    50% { transform: translateY(100%); }
                    100% { transform: translateY(-100%); }
                }
                @keyframes blink {
                    0%, 96%, 98% { opacity: 1; transform: scaleY(1); }
                    97% { opacity: 0; transform: scaleY(0.1); }
                }
                .animate-float { animation: float 8s ease-in-out infinite; }
                .animate-spin-slow-3d { animation: spin-slow-3d 12s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 20s linear infinite; }
                .animate-spin-reverse-slow { animation: spin-reverse-slow 25s linear infinite; }
                .animate-pulse-fast { animation: pulse-fast 2s ease-in-out infinite; }
                .animate-scan { animation: scan 3s linear infinite; }
                .animate-blink { animation: blink 4s infinite; }
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
            `}} />
        </div>
    );
}

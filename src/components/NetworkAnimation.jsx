import React from 'react';

export default function NetworkAnimation() {
    return (
        <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none overflow-hidden opacity-90 z-0 hidden lg:block">
            <svg className="w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <path d="M 0,200 C 200,300 300,100 500,300 C 700,500 800,200 1000,400" fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <path d="M -100,500 C 150,600 250,300 450,550 C 650,800 800,400 1100,600" fill="none" stroke="url(#lineGrad)" strokeWidth="1" opacity="0.6"/>
                <path d="M 100,-50 C 250,200 450,50 650,250 C 850,450 700,700 950,850" fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <path d="M 300,100 C 350,300 550,200 700,450 C 850,700 900,500 1050,800" fill="none" stroke="url(#lineGrad)" strokeWidth="1" opacity="0.5"/>
                <g>
                    <circle r="6" fill="#4f46e5" filter="url(#glow)">
                        <animateMotion dur="15s" repeatCount="indefinite" path="M 0,200 C 200,300 300,100 500,300 C 700,500 800,200 1000,400" />
                    </circle>
                    <circle r="4" fill="#38bdf8" opacity="0.8">
                        <animateMotion dur="22s" repeatCount="indefinite" begin="-5s" path="M -100,500 C 150,600 250,300 450,550 C 650,800 800,400 1100,600" />
                    </circle>
                    <circle r="5" fill="#64748b">
                        <animateMotion dur="18s" repeatCount="indefinite" begin="-2s" path="M 100,-50 C 250,200 450,50 650,250 C 850,450 700,700 950,850" />
                    </circle>
                    <circle r="7" fill="#818cf8" filter="url(#glow)" opacity="0.9">
                        <animateMotion dur="25s" repeatCount="indefinite" begin="-12s" path="M 300,100 C 350,300 550,200 700,450 C 850,700 900,500 1050,800" />
                    </circle>
                    <circle r="4" fill="#0ea5e9">
                        <animateMotion dur="14s" repeatCount="indefinite" begin="-8s" path="M 0,200 C 200,300 300,100 500,300 C 700,500 800,200 1000,400" />
                    </circle>
                </g>
                <circle cx="215" cy="275" r="5" fill="#94a3b8" />
                <circle cx="430" cy="210" r="8" fill="#475569" />
                <circle cx="500" cy="300" r="10" fill="#cbd5e1" opacity="0.5" />
                <circle cx="500" cy="300" r="4" fill="#64748b" />
                <circle cx="650" cy="250" r="6" fill="#38bdf8" />
                <circle cx="700" cy="450" r="12" fill="#e2e8f0" />
                <circle cx="700" cy="450" r="5" fill="#818cf8" />
                <circle cx="365" cy="450" r="7" fill="#94a3b8" />
            </svg>
        </div>
    );
}

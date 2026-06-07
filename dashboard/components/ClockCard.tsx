"use client";
import { useState, useEffect, memo } from 'react';

const ZODIAC_TAMIL = [
  "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்",
  "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்",
  "தனுசு", "மகரம்", "கும்பம்", "மீனம்",
];

const ZODIAC_SYMBOLS = [
  "🐏", "🐂", "🧑‍🤝‍🧑", "🦀", "🦁", "💃",
  "⚖️", "🦂", "🏹", "🐊", "🏺", "🐟",
];

function getCurrentZodiac(hour: number) {
  return Math.floor(hour / 2) % 12;
}

const ClockCard = memo(function ClockCard() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="flex flex-col items-center w-full p-8 bg-darkNavy premium-radius premium-shadow border border-[rgba(212,175,55,0.2)]">
        <h2 className="font-tamil text-2xl text-gold mb-6 tracking-wide">ஜோதிட சக்கரம்</h2>
        <div className="w-[300px] h-[300px] rounded-full border border-[rgba(212,175,55,0.5)] flex items-center justify-center text-gold">
          ஏற்றுகிறது...
        </div>
      </div>
    );
  }

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const activeZodiac = getCurrentZodiac(h);

  const timeStr = `${h % 12 || 12}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  const dateStr = now.toLocaleDateString('ta-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const cx = 200;
  const cy = 200;
  const R  = 180; 

  const secDeg  = s * 6;
  const minDeg  = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;

  const polar = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const handPath = (angleDeg: number, length: number, _backLen = 10) => {
    const tip  = polar(angleDeg, length);
    const back = polar(angleDeg + 180, _backLen);
    return `M ${back.x} ${back.y} L ${tip.x} ${tip.y}`;
  };

  return (
    <div className="flex flex-col items-center w-full p-6 md:p-8 bg-darkNavy premium-radius premium-shadow border border-[rgba(212,175,55,0.2)] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

      <h2 className="font-tamil text-2xl text-gold mb-8 tracking-wider uppercase font-bold gold-text-glow z-10">
        ஜோதிட சக்கரம்
      </h2>

      {/* Rotating Outer Wheel Container */}
      <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
        
        {/* The rotating SVG ring */}
        <div className="absolute inset-0 animate-spin-slow">
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <defs>
              <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
                <stop offset="70%" stopColor="#D4AF37" stopOpacity="0" />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.8" />
              </radialGradient>
            </defs>

            {/* Thick Outer Ring */}
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="url(#goldGrad)" strokeWidth="15" />
            <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
            <circle cx={cx} cy={cy} r={R - 8} fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />

            {/* Zodiac Sections */}
            {ZODIAC_TAMIL.map((_, i) => {
              const startAngle = i * 30 - 90;
              const endAngle   = (i + 1) * 30 - 90;
              const s1 = polar(startAngle + 90, R - 8);
              const e1 = polar(endAngle + 90, R - 8);
              const s2 = polar(startAngle + 90, R - 40);
              const e2 = polar(endAngle + 90, R - 40);
              const isActive = i === activeZodiac;

              return (
                <path
                  key={i}
                  d={`M ${s1.x} ${s1.y} A ${R-8} ${R-8} 0 0 1 ${e1.x} ${e1.y} L ${e2.x} ${e2.y} A ${R-40} ${R-40} 0 0 0 ${s2.x} ${s2.y} Z`}
                  fill={isActive ? 'rgba(212,175,55,0.15)' : 'transparent'}
                  stroke="#D4AF37"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                />
              );
            })}

            {/* Zodiac Symbols rotated with the wheel */}
            {ZODIAC_SYMBOLS.map((sym, i) => {
              const midAngle = i * 30 + 15;
              const pos = polar(midAngle, R - 24);
              const isActive = i === activeZodiac;
              return (
                <text
                  key={i}
                  x={pos.x} y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="18"
                  fill={isActive ? '#FFFFFF' : '#D4AF37'}
                  className={isActive ? 'gold-text-glow' : ''}
                  transform={`rotate(${midAngle + 90} ${pos.x} ${pos.y})`}
                >
                  {sym}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Static Inner Dashboard (Does not rotate) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-[60%] h-[60%] rounded-full bg-[rgba(15,23,42,0.85)] backdrop-blur-md border border-[rgba(212,175,55,0.4)] flex flex-col items-center justify-center premium-shadow relative">
            
            {/* Analog Clock Hands (Static SVG over the inner circle) */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">
              {/* Hour hand */}
              <path
                d={handPath(hourDeg, 60, 15)}
                stroke="#D4AF37" strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Minute hand */}
              <path
                d={handPath(minDeg, 85, 20)}
                stroke="#FDE047" strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Second hand */}
              <path
                d={handPath(secDeg, 100, 25)}
                stroke="#F97316" strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Center pivot */}
              <circle cx={cx} cy={cy} r={6} fill="#D4AF37" />
              <circle cx={cx} cy={cy} r={3} fill="#0F172A" />
            </svg>

            {/* Digital Time & Text (Pushed down slightly so hands are visible in center) */}
            <div className="mt-24 flex flex-col items-center text-center">
              <div className="text-base md:text-lg font-bold text-gold font-sans tracking-widest gold-text-glow opacity-80">
                {timeStr}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5 font-tamil opacity-70">
                {dateStr}
              </div>
            </div>
            
            {/* Current Zodiac Active Pill */}
            <div className="absolute top-4 px-3 py-1 rounded-full border border-gold bg-[rgba(212,175,55,0.1)] flex items-center gap-1.5">
              <span className="text-gold text-sm">{ZODIAC_SYMBOLS[activeZodiac]}</span>
              <span className="text-gold font-bold text-xs font-tamil">{ZODIAC_TAMIL[activeZodiac]}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default ClockCard;

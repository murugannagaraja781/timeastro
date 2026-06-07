"use client";
import { useState, useEffect, memo } from 'react';

const ZODIAC_TAMIL = [
  "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்",
  "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்",
  "தனுசு", "மகரம்", "கும்பம்", "மீனம்",
];

const ZODIAC_SYMBOLS = [
  "♈", "♉", "♊", "♋", "♌", "♍",
  "♎", "♏", "♐", "♑", "♒", "♓",
];

// Each zodiac corresponds roughly to a 2-hour window
function getCurrentZodiac(hour: number) {
  // Rasi based on current hour (0-23) -> index 0-11
  return Math.floor(hour / 2) % 12;
}

const ClockCard = memo(function ClockCard() {
  // Initialize as null to avoid SSR/client hydration mismatch
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set immediately on mount (client-only)
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Render a stable placeholder until client has hydrated
  if (!now) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <h2 style={{
          fontFamily: "'Noto Sans Tamil', 'Latha', sans-serif",
          fontSize: '1.4rem',
          color: '#fcd34d',
          marginBottom: '12px',
        }}>ஜோதிடக் கடிகாரம்</h2>
        <div style={{
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 40% 40%, #fef08a, #f59e0b)',
          border: '3px solid #d97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fbbf24',
          fontSize: '0.9rem',
        }}>
          நேரம் ஏற்றுகிறது...
        </div>
      </div>
    );
  }

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  // Angles in degrees from 12 o'clock position
  const secDeg  = s * 6;
  const minDeg  = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;

  const activeZodiac = getCurrentZodiac(h);

  const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const dateStr = now.toLocaleDateString('ta-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Kolkata'
  });

  const cx = 200;
  const cy = 200;
  const R  = 190; // outer radius

  // Helper: polar to cartesian
  const polar = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // Hand path from center
  const handPath = (angleDeg: number, length: number, _backLen = 10) => {
    const tip  = polar(angleDeg, length);
    const back = polar(angleDeg + 180, _backLen);
    return `M ${back.x} ${back.y} L ${tip.x} ${tip.y}`;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Title */}
      <h2 style={{
        fontFamily: "'Noto Sans Tamil', 'Latha', sans-serif",
        fontSize: '1.4rem',
        color: '#fcd34d',
        marginBottom: '12px',
        textShadow: '0 0 20px rgba(252,211,77,0.6)',
        letterSpacing: '0.05em'
      }}>
        ஜோதிடக் கடிகாரம்
      </h2>

      {/* SVG Clock */}
      <svg
        viewBox="0 0 400 400"
        width="100%"
        style={{ maxWidth: 420, display: 'block' }}
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <radialGradient id="innerGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer ring background */}
        <circle cx={cx} cy={cy} r={R} fill="url(#bgGrad)" stroke="#d97706" strokeWidth="3" />

        {/* Decorative outer ring */}
        <circle cx={cx} cy={cy} r={R - 2} fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
        <circle cx={cx} cy={cy} r={R - 8} fill="none" stroke="orange" strokeWidth="0.5" opacity="0.3" />

        {/* Zodiac segment arcs (12 segments) */}
        {ZODIAC_TAMIL.map((_, i) => {
          const startAngle = i * 30 - 90;
          const endAngle   = (i + 1) * 30 - 90;
          const r1 = R - 10;
          const r2 = R - 48;
          const s1 = polar(startAngle + 90, r1);
          const e1 = polar(endAngle + 90, r1);
          const s2 = polar(startAngle + 90, r2);
          const e2 = polar(endAngle + 90, r2);
          const isActive = i === activeZodiac;
          return (
            <path
              key={i}
              d={`M ${s1.x} ${s1.y} A ${r1} ${r1} 0 0 1 ${e1.x} ${e1.y} L ${e2.x} ${e2.y} A ${r2} ${r2} 0 0 0 ${s2.x} ${s2.y} Z`}
              fill={isActive ? 'rgba(250,204,21,0.18)' : 'rgba(109,40,217,0.07)'}
              stroke={isActive ? '#fbbf24' : '#d97706'}
              strokeWidth={isActive ? 1.5 : 0.5}
            />
          );
        })}

        {/* Zodiac tick lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = i * 30;
          const p1 = polar(a, R - 10);
          const p2 = polar(a, R - 20);
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#fbbf24" strokeWidth="2" />
          );
        })}

        {/* Minor tick marks (60) */}
        {Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 === 0) return null;
          const a = i * 6;
          const p1 = polar(a, R - 10);
          const p2 = polar(a, R - 16);
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#b45309" strokeWidth="1" opacity="0.6" />
          );
        })}

        {/* Zodiac Tamil labels */}
        {ZODIAC_TAMIL.map((label, i) => {
          const midAngle = i * 30 + 15;
          const pos = polar(midAngle, R - 30);
          const isActive = i === activeZodiac;
          return (
            <text
              key={i}
              x={pos.x} y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill={isActive ? '#fcd34d' : '#fde047'}
              fontFamily="'Noto Sans Tamil', 'Latha', sans-serif"
              filter={isActive ? 'url(#glow)' : undefined}
              style={{ fontWeight: isActive ? 'bold' : 'normal' }}
            >
              {label}
            </text>
          );
        })}

        {/* Zodiac symbols (inner ring) */}
        {ZODIAC_SYMBOLS.map((sym, i) => {
          const midAngle = i * 30 + 15;
          const pos = polar(midAngle, R - 58);
          const isActive = i === activeZodiac;
          return (
            <text
              key={i}
              x={pos.x} y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fill={isActive ? '#fbbf24' : '#fbbf24'}
              filter={isActive ? 'url(#strongGlow)' : undefined}
            >
              {sym}
            </text>
          );
        })}

        {/* Inner decorative circles */}
        <circle cx={cx} cy={cy} r={R - 75} fill="url(#innerGrad)" stroke="orange" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={R - 78} fill="none" stroke="#b45309" strokeWidth="0.5" opacity="0.5" />

        {/* Hour numbers */}
        {[12,1,2,3,4,5,6,7,8,9,10,11].map((num, i) => {
          const pos = polar(i * 30, R - 93);
          return (
            <text key={num} x={pos.x} y={pos.y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="11" fill="#000000"
              fontFamily="'Inter', sans-serif" fontWeight="600"
            >
              {num}
            </text>
          );
        })}

        {/* Hour hand */}
        <path
          d={handPath(hourDeg, 70, 14)}
          stroke="#fbbf24" strokeWidth="5"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Minute hand */}
        <path
          d={handPath(minDeg, 100, 16)}
          stroke="#fef9c3" strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Second hand */}
        <path
          d={handPath(secDeg, 115, 20)}
          stroke="#f97316" strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Center pivot */}
        <circle cx={cx} cy={cy} r={7} fill="#fbbf24" filter="url(#glow)" />
        <circle cx={cx} cy={cy} r={4} fill="#fef08a" />
        <circle cx={cx} cy={cy} r={2} fill="#fbbf24" />
      </svg>

      {/* Digital time & date */}
      <div style={{
        marginTop: '16px',
        textAlign: 'center',
        background: 'rgba(109,40,217,0.15)',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: '12px',
        padding: '12px 24px',
        backdropFilter: 'blur(8px)',
        width: '100%',
        maxWidth: 420,
      }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#fcd34d',
          fontFamily: "'Inter', monospace",
          letterSpacing: '0.1em',
          textShadow: '0 0 20px rgba(252,211,77,0.5)',
        }}>
          {timeStr}
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: '#fde047',
          marginTop: '4px',
          fontFamily: "'Noto Sans Tamil', 'Latha', sans-serif",
        }}>
          {dateStr}
        </div>
      </div>

      {/* Active Zodiac Badge */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(251,191,36,0.12)',
        border: '1px solid rgba(251,191,36,0.35)',
        borderRadius: '999px',
        padding: '6px 18px',
      }}>
        <span style={{ fontSize: '1.2rem' }}>{ZODIAC_SYMBOLS[activeZodiac]}</span>
        <span style={{
          fontFamily: "'Noto Sans Tamil', 'Latha', sans-serif",
          color: '#fcd34d',
          fontSize: '0.95rem',
          fontWeight: 600,
        }}>
          {ZODIAC_TAMIL[activeZodiac]} ராசி நேரம்
        </span>
      </div>
    </div>
  );
});

export default ClockCard;

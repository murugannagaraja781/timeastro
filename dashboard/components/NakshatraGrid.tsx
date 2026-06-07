import { memo } from 'react';

const nakshatras = [
  'அஸ்விநி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்',
  'மகம்', 'பூரம்', 'உத்திரம்', 'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி'
];

const RULER_SYMBOLS = ["☋", "♀", "☀", "☾", "♂", "☊", "♃", "♄", "☿"];

const NakshatraGrid = memo(function NakshatraGrid() {
  const selected = 'அஸ்விநி';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 border-b border-[rgba(212,175,55,0.2)] pb-4">
        <h2 className="font-tamil text-2xl font-bold text-gold gold-text-glow">27 நட்சத்திரங்கள்</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {nakshatras.map((n, index) => {
          const symbol = RULER_SYMBOLS[index % 9];
          const isSelected = n === selected;

          return (
            <button
              key={n}
              className={`flex items-center gap-2 rounded-full py-2 px-4 text-sm font-tamil border transition-hover 
                ${isSelected 
                  ? 'border-gold bg-[rgba(212,175,55,0.15)] text-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                  : 'border-[rgba(255,255,255,0.1)] bg-[rgba(15,23,42,0.6)] text-gray-300 hover:border-gold hover:text-gold hover:-translate-y-0.5'
                }`}
            >
              <span className={isSelected ? "text-lg text-gold drop-shadow-md" : "text-lg text-gray-400"}>{symbol}</span>
              <span>{n}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default NakshatraGrid;

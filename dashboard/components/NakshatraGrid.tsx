import { memo } from 'react';
import Card from './Card';

const nakshatras = [
  'அஸ்விநி',
  'பரணி',
  'கார்த்திகை',
  'ரோகிணி',
  'முருகசுரூ',
  'திருவாதிரை',
  'புனர்பூ',
  'பூசிக்',
  'ஐலமுவால்',
  'சிதிரை',
  'சுவாதி',
  'விசாகம்',
  'அன்னம்',
  'தூட்டம்',
  'மிதுனம்',
  'பூரம்',
  'உத்திராடம்',
  'திருவோனமம்',
  'அவிதி',
  'சதயம்',
  'சித்திரை',
  'மூலாதரம்',
  'உத்திரம்',
  'திருவிழை',
  'விருச்சிகம்',
  'அவதம்',
  'எசேடு',
];

const NakshatraGrid = memo(function NakshatraGrid() {
  // For demo we mark the first item as selected
  const selected = 'அஸ்விநி';

  return (
    <Card>
      <h3 className="font-tamil text-xl mb-3 text-white">27 Nakshatram</h3>
      <div className="grid grid-cols-2 gap-2">
        {nakshatras.map((n) => (
          <button
            key={n}
            className={`rounded-lg py-2 px-3 text-sm font-tamil 
              ${n === selected ? 'border-2 border-accentBlue bg-glassBg' : 'bg-gray-800 text-gray-300'}
              hover:bg-glassBg hover:text-white transition-hover`}
          >
            {n}
          </button>
        ))}
      </div>
    </Card>
  );
});

export default NakshatraGrid;

import { memo } from 'react';

const PanchangCard = memo(function PanchangCard() {
  const date = "வியாழன், 4 ஜூன் 2026";

  const details = [
    { label: "திதி", value: "உத்திராடம்" },
    { label: "நட்சத்திரம்", value: "ரிஷபம்" },
    { label: "யோகம்", value: "Sukla" },
    { label: "கரணம்", value: "Bawa" },
    { label: "ராகு காலம்", value: "01:30 PM – 03:00 PM" },
    { label: "யமகண்டம்", value: "06:00 AM – 07:30 AM" },
    { label: "குளிகை", value: "09:00 AM – 10:30 AM" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 border-b border-[rgba(212,175,55,0.2)] pb-4">
        <h2 className="font-tamil text-2xl font-bold text-gold gold-text-glow">இன்றைய பஞ்சாங்கம்</h2>
        <div className="text-sm font-semibold text-pureWhite bg-[rgba(212,175,55,0.15)] px-4 py-1.5 premium-radius border border-[rgba(212,175,55,0.3)]">
          {date}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.map((d) => (
          <div key={d.label} className="bg-[rgba(15,23,42,0.6)] border border-[rgba(212,175,55,0.15)] premium-radius premium-shadow p-5 flex flex-col justify-center transition-hover hover:-translate-y-1 hover:border-gold hover:shadow-[0_10px_20px_rgba(212,175,55,0.1)] group">
            <span className="text-sm text-gray-400 font-tamil mb-1 group-hover:text-gray-300">{d.label}</span>
            <span className="font-bold text-gold text-lg">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PanchangCard;

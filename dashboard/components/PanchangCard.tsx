import { memo } from 'react';
import Card from "./Card";

const PanchangCard = memo(function PanchangCard() {
  const date = "வியாழன், 4 ஜூன் 2026";

  const details = [
    { label: "பஞ்சாங்கம்", value: "திரிதியை" },
    { label: "திதி", value: "உத்திராடம்" },
    { label: "நட்சத்திரம்", value: "ரிஷபம்" },
    { label: "யோகம்", value: "Sukla" },
    { label: "கரணம்", value: "Bawa" },
  ];

  const timings = [
    { label: "சூரியோதயம்", value: "05:42 AM" },
    { label: "சூரியாஸ்தமனம்", value: "06:34 PM" },
    { label: "நல்ல நேரம்", value: "11:44 AM – 12:32 PM" },
  ];

  const auspicious = [
    { label: "ராகு காலம்", value: "01:30 PM – 03:00 PM" },
    { label: "யமகண்டம்", value: "06:00 AM – 07:30 AM" },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <button className="text-sm text-gray-400 hover:text-white transition-hover">←</button>
        <h2 className="font-tamil text-2xl text-white">{date}</h2>
        <button className="text-sm text-gray-400 hover:text-white transition-hover">→</button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {details.map((d) => (
          <div key={d.label} className="flex flex-col">
            <span className="text-sm text-gray-400">{d.label}</span>
            <span className="font-bold text-white">{d.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {timings.map((t) => (
          <Card key={t.label}>
            <span className="text-sm text-gray-400">{t.label}</span>
            <p className="font-bold text-white">{t.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {auspicious.map((a) => (
          <Card key={a.label}>
            <span className="text-sm text-gray-400">{a.label}</span>
            <p className="font-bold text-white">{a.value}</p>
          </Card>
        ))}
      </div>
    </Card>
  );
});

export default PanchangCard;

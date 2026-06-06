import { memo, useState, useEffect } from 'react';
import Card from './Card';

const TimeInfoPanel = memo(function TimeInfoPanel() {
  const [timeString, setTimeString] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
      };
      setTimeString(now.toLocaleTimeString('ta-IN', options));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const location = 'Chennai';
  const sunrise = '5:42 AM';
  const timezone = 'Indian Standard Time (IST)';

  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <Card>
        <p className="text-sm text-gray-300">Current Time:</p>
        <p className="font-bold text-white">{timeString ?? '--:--:--'}</p>
      </Card>
      <Card>
        <p className="text-sm text-gray-300">Location:</p>
        <p className="font-bold text-white">{location}</p>
      </Card>
      <Card>
        <p className="text-sm text-gray-300">Sunrise:</p>
        <p className="font-bold text-white">{sunrise}</p>
      </Card>
      <Card>
        <p className="text-sm text-gray-300">Timezone:</p>
        <p className="font-bold text-white">{timezone}</p>
      </Card>
    </div>
  );
});

export default TimeInfoPanel;

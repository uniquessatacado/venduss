
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { SocialProofEvent } from '../types';
import { NAMES, PRODUCTS } from '../constants';
import { CheckCircle2 } from 'lucide-react';

const SocialProof: React.FC = () => {
  const { settings } = useStore();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<SocialProofEvent | null>(null);

  // Helper to pick location based on weights
  const getRandomLocation = () => {
      const locations = settings.socialProofLocations;
      if (!locations || locations.length === 0) return 'São Paulo, SP';

      const totalWeight = locations.reduce((sum, loc) => sum + loc.percentage, 0);
      let random = Math.random() * totalWeight;
      
      for (const loc of locations) {
          if (random < loc.percentage) return loc.name;
          random -= loc.percentage;
      }
      return locations[0].name;
  };

  useEffect(() => {
    if (!settings.showSocialProof) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const showNewProof = () => {
      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)].name;
      const timeAgo = Math.floor(Math.random() * 59) + 1; // 1 to 59 minutes ago
      const location = getRandomLocation();

      setData({
        name: randomName,
        productName: randomProduct,
        timeAgo: `${timeAgo} min`,
        location: location
      });
      setVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);

      // Schedule next appearance based on settings (convert seconds to ms)
      const minMs = (settings.socialProofMinTime || 60) * 1000;
      const maxMs = (settings.socialProofMaxTime || 120) * 1000;
      const nextDelay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      
      timeoutId = setTimeout(showNewProof, nextDelay);
    };

    // Initial start delay
    timeoutId = setTimeout(showNewProof, 5000);

    return () => clearTimeout(timeoutId);
  }, [settings.showSocialProof, settings.socialProofMinTime, settings.socialProofMaxTime, settings.socialProofLocations]);

  if (!visible || !data) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-[300px] animate-fade-in-up">
      <div className="bg-zinc-900/90 backdrop-blur-md shadow-2xl border border-zinc-800 rounded-lg p-3 flex items-start space-x-3">
        <div className="bg-green-900/30 p-1.5 rounded-full mt-0.5">
          <CheckCircle2 size={16} className="text-green-500" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
             <p className="text-xs text-zinc-400 mb-0.5">Há {data.timeAgo}</p>
             <p className="text-[10px] text-zinc-500 uppercase font-bold">{data.location}</p>
          </div>
          <p className="text-sm font-medium text-zinc-100 leading-tight">
            <span className="font-bold text-white">{data.name}</span> comprou <span className="text-zinc-300">{data.productName}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;

import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [spots, setSpots] = useState(315);

  useEffect(() => {
    // Decrease the spots counter periodically to create urgency
    const interval = setInterval(() => {
      setSpots((prevSpots) => {
        // Stop decreasing if we get too low (e.g., 12 spots left)
        if (prevSpots <= 12) return prevSpots;
        
        // Randomly decrease by 1 to 3 spots
        const decrease = Math.floor(Math.random() * 3) + 1;
        return Math.max(12, prevSpots - decrease);
      });
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleApplyClick = () => {
    // Trigger the content locker
    if (typeof (window as any)._nO === 'function') {
      (window as any)._nO();
    } else {
      console.warn("Content locker function _nO not found. It might be blocked by an ad blocker.");
    }
  };

  return (
    <section className="bg-black text-white pt-32 pb-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-start text-left">
        
        {/* Main Headline */}
        <div className="flex flex-col mb-8 max-w-5xl">
          <h1 className="text-[28px] sm:text-5xl md:text-[80px] leading-[1.1] font-bold tracking-tighter text-white">
            Stop scrolling for free.
          </h1>
          <h1 className="text-[28px] sm:text-5xl md:text-[80px] leading-[1.1] font-bold tracking-tighter text-[#FE2C55]">
            Start earning now.
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl font-normal max-w-2xl leading-relaxed mb-12">
          The most awaited <span className="text-[#FE2C55]">Beta</span> is here. Start earning automatically from your regular watch activity and enjoy your feed like never before.
        </p>

        {/* Scarcity Counter */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#FE2C55] text-5xl font-black tracking-tighter tabular-nums">
            {spots}
          </span>
          <span className="text-white text-sm font-semibold tracking-wide mt-2">
            spots remaining
          </span>
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleApplyClick}
          className="w-full md:w-[600px] bg-[#FE2C55] hover:bg-[#E01F45] text-white text-lg font-bold py-4 rounded-full transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_14px_0_rgba(254,44,85,0.39)]"
        >
          Apply Now
        </button>

        {/* Social Proof */}
        <div className="mt-6 w-full md:w-[600px] text-center">
          <p className="text-white text-sm font-semibold">
            100,000+ <span className="text-gray-400 font-normal">accounts got approved today!</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
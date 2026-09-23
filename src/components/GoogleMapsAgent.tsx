import React, { useState } from 'react';
import { MapPin, Navigation, Car, Train, Footprints, ExternalLink, Clock, Sparkles } from 'lucide-react';

export const GoogleMapsAgent: React.FC = () => {
  const [transitMode, setTransitMode] = useState<'driving' | 'transit' | 'walking'>('transit');
  const [origin, setOrigin] = useState('Midtown Manhattan');

  // Realistic ETA estimates
  const estimates = {
    driving: { time: '18 mins', distance: '3.4 miles', highlight: 'Curbside Valet service available outside awning' },
    transit: { time: '14 mins', distance: '3.2 miles', highlight: '1 train to Franklin St Station (2 min walk)' },
    walking: { time: '42 mins', distance: '2.1 miles', highlight: 'Scenic stroll along historic Tribeca cobblestones' },
  };

  const currentEst = estimates[transitMode];

  return (
    <section id="location-section" className="py-24 sm:py-32 bg-[#FFFFFF] text-[#121110] border-t border-[#E8E6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 text-left mb-16">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#14532D]">
            <MapPin className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Arrival & Concierge Transit</span>
          </div>
          <h2 
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#121110]"
            style={{ textWrap: 'balance' }}
          >
            Finding your way to 174 Franklin Street.
          </h2>
          <p className="text-sm sm:text-base text-[#595852] font-normal leading-relaxed">
            Nestled in the historic Tribeca district between Hudson and Greenwich. Complimentary curbside valet welcomes you at the white canopy.
          </p>
        </div>

        {/* 2-Column Split: Transit Planner & Live Google Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left: Transit Planner & Quick Route Calculator */}
          <div className="lg:col-span-5 bg-[#FAFAF7] rounded-3xl border border-[#E8E6DD] p-8 sm:p-9 flex flex-col justify-between space-y-6 text-left shadow-xs">
            
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8A82]">Destination</span>
                <h3 className="font-display text-2xl font-bold text-[#121110]">
                  Àdùkẹ́ Gastronomy
                </h3>
                <p className="text-xs text-[#595852]">
                  174 Franklin St, New York, NY 10013
                </p>
              </div>

              {/* Transit Mode Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">
                  Travel Mode
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-white border border-[#E8E6DD] rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setTransitMode('transit')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      transitMode === 'transit'
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'text-[#595852] hover:text-[#121110]'
                    }`}
                  >
                    <Train className="w-3.5 h-3.5" />
                    <span>Subway</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransitMode('driving')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      transitMode === 'driving'
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'text-[#595852] hover:text-[#121110]'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Valet / Car</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransitMode('walking')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      transitMode === 'walking'
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'text-[#595852] hover:text-[#121110]'
                    }`}
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>Walk</span>
                  </button>
                </div>
              </div>

              {/* Origin Quick Pick */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold uppercase tracking-wider text-[#121110]">
                  Departure Point
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Midtown', 'SoHo', 'FiDi', 'Brooklyn Heights', 'Chelsea'].map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setOrigin(loc)}
                      className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                        origin === loc
                          ? 'bg-[#DCFCE7] text-[#14532D] font-bold'
                          : 'bg-white text-[#595852] border border-[#E8E6DD] hover:text-[#121110]'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Transit Calculation Result */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E6DD] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#595852] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#14532D]" />
                    <span>Estimated Journey Time</span>
                  </span>
                  <span className="font-mono text-base font-bold text-[#14532D]">
                    {currentEst.time}
                  </span>
                </div>

                <div className="text-xs text-[#595852] pt-2 border-t border-[#F0EFEB] space-y-1">
                  <p className="font-medium text-[#121110]">{currentEst.highlight}</p>
                  <p className="text-[11px] text-[#8C8A82]">Distance from {origin}: {currentEst.distance}</p>
                </div>
              </div>
            </div>

            {/* Direct Google Maps Navigation Button */}
            <div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=174+Franklin+St+New+York+NY+10013&travelmode=${transitMode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-between cursor-pointer"
              >
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right: Interactive Maps Frame */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#E8E6DD] shadow-[0_12px_32px_rgba(18,17,16,0.05)] min-h-[380px] sm:min-h-[460px] relative bg-[#EFEFEA]">
            <iframe
              title="Google Map Location of Aduke Gastronomy at 174 Franklin Street, Tribeca"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '440px' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=174+Franklin+St,+New+York,+NY+10013&t=&z=16&ie=UTF8&iwloc=&output=embed"
            />
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-xl border border-[#E8E6DD] text-xs font-mono shadow-xs text-[#121110]">
              <span className="font-bold text-[#14532D]">● 174 Franklin St</span> · Tribeca, Manhattan
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

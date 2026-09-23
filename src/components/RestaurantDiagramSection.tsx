import React, { useState } from 'react';
import { Compass, Users, Sparkles, Flame, CheckCircle2, ArrowRight, Eye } from 'lucide-react';
import diagramImg from '../assets/images/nigerian_restaurant_diagram_1790149689564.jpg';

interface RestaurantDiagramSectionProps {
  onSelectZoneForReservation: (zoneId: string) => void;
}

export const RestaurantDiagramSection: React.FC<RestaurantDiagramSectionProps> = ({
  onSelectZoneForReservation,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('eko-grand');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const zones = [
    {
      id: 'eko-grand',
      name: 'The Eko Grand Dining Hall',
      yoruba: 'Àgbàlá Èkó',
      tagline: 'High vaulted ceilings & artisanal brass lighting',
      capacity: '6 Tables · 24 Guests Total',
      vibe: 'Afrobeats jazz, gentle conversation & wine pairings',
      highlights: ['Central view of open firewood hearth', 'Hand-woven raffia acoustic wall hangings', 'Spacious banquettes for parties of 2 to 6'],
      badge: 'Main Dining',
    },
    {
      id: 'danfo-bar',
      name: 'The Danfo Hearth & Suya Bar',
      yoruba: 'Ibùdó Sùyá',
      tagline: 'Front-row seats to sizzling charcoal skewers & yaji spice',
      capacity: '4 Tables + 10 Bar Stools',
      vibe: 'High-energy, sizzling skewers, direct chef interaction',
      highlights: ['Interactive grill master counter', 'Curated palm wine & cocktail tasting bar', 'Small plates & small chops priority'],
      badge: 'Social & Vibrant',
    },
    {
      id: 'lagos-veranda',
      name: 'The Lagos Palm Veranda',
      yoruba: 'Àtẹ́gùn Ọ̀pẹ',
      tagline: 'Lush indoor tropical greenery, skylights & breezy atmosphere',
      capacity: '4 Tables · 16 Guests Total',
      vibe: 'Sunlit afternoon lunch, evening romantic dates',
      highlights: ['Surrounded by living monsteras and dwarf palms', 'Natural daylight & twilight starlight', 'Heated year-round with private music zone'],
      badge: 'Botanical Intimacy',
    },
    {
      id: 'obas-suite',
      name: "The Oba's Private Suite",
      yoruba: 'Ààfin Ọba',
      tagline: 'Royal salon with carved mahogany table for celebrations',
      capacity: 'Private Table · 8 to 14 Guests',
      vibe: 'Exclusive family gatherings, executive dinners',
      highlights: ['Dedicated butler & sommelier service', 'Custom bespoke 7-course tasting menu', 'Private sound system & discreet side entrance'],
      badge: 'Private Dining',
    },
  ];

  const currentZoneData = zones.find((z) => z.id === selectedZone) || zones[0];

  return (
    <section id="diagram-section" className="py-24 sm:py-32 bg-[#FFFFFF] text-[#121110] border-t border-[#E8E6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 text-left mb-16">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#14532D]">
            <Compass className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Architectural Layout & Dining Environments</span>
          </div>
          <h2 
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#121110]"
            style={{ textWrap: 'balance' }}
          >
            Explore our curated dining atmospheres.
          </h2>
          <p className="text-sm sm:text-base text-[#595852] font-normal leading-relaxed">
            From the fiery warmth of the Danfo Suya Bar to the secluded intimacy of The Oba's Royal Suite, every space at Àdùkẹ́ has been architected to evoke the spirit of West African warmth.
          </p>
        </div>

        {/* 2-Column Split: Interactive Blueprint Diagram + Zone Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Illustrated Architectural Diagram */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-[#F4F3ED] border border-[#E8E6DD] shadow-[0_12px_32px_rgba(18,17,16,0.05)]">
              
              <img
                src={diagramImg}
                alt="Illustrated architectural floor plan of Aduke restaurant showing dining hall, suya bar, palm veranda, and private dining suite"
                referrerPolicy="no-referrer"
                className={`w-full h-auto object-cover transition-all duration-300 ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Floating Action to Inspect */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 hover:bg-white text-[#121110] shadow-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#14532D]" />
                <span>{isZoomed ? 'Reset View' : 'Zoom Floor Plan'}</span>
              </button>

              {/* Architectural Stamp */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#E8E6DD] text-[11px] font-mono text-[#595852] shadow-2xs">
                <span>Tribeca Pavilion · 12 Tables · 4 Distinct Zones</span>
              </div>
            </div>

            {/* Zone Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {zones.map((zone) => {
                const isSelected = selectedZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#DCFCE7] border-[#14532D] text-[#14532D] font-bold shadow-xs'
                        : 'bg-[#FAFAF7] hover:bg-white border-[#E8E6DD] text-[#595852]'
                    }`}
                  >
                    <p className="text-[10px] uppercase font-mono tracking-wider">{zone.badge}</p>
                    <p className="font-display text-xs font-bold truncate mt-0.5">{zone.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Focused Zone Dossier & Booking Direct Action */}
          <div className="lg:col-span-5 bg-[#FAFAF7] rounded-3xl border border-[#E8E6DD] p-7 sm:p-9 space-y-6 text-left shadow-xs">
            
            <div className="space-y-1 pb-4 border-b border-[#E8E6DD]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#14532D]">
                  {currentZoneData.badge}
                </span>
                <span className="font-serif italic text-xs text-[#C2410C]">
                  {currentZoneData.yoruba}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#121110]">
                {currentZoneData.name}
              </h3>
              <p className="text-xs text-[#595852] leading-relaxed pt-1">
                {currentZoneData.tagline}
              </p>
            </div>

            {/* Spec Details */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#121110]">Seating Configuration</p>
                  <p className="text-[#595852]">{currentZoneData.capacity}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C89B3C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#121110]">Atmospheric Soundscape</p>
                  <p className="text-[#595852]">{currentZoneData.vibe}</p>
                </div>
              </div>
            </div>

            {/* Highlights List */}
            <div className="space-y-2 pt-2 border-t border-[#E8E6DD]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#121110]">
                Curated Amenities
              </p>
              <ul className="space-y-1.5 text-xs text-[#595852]">
                {currentZoneData.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14532D] shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Booking CTA with Zone Hand-off */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => onSelectZoneForReservation(currentZoneData.id)}
                className="w-full py-3.5 px-4 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-between cursor-pointer"
              >
                <span>Select {currentZoneData.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-[#8C8A82] mt-2 font-mono">
                Guaranteed double-booking prevention in real-time
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

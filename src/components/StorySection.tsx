import React from 'react';
import { Flame, Heart, Wine } from 'lucide-react';
import jollofImg from '../assets/images/nigerian_jollof_deluxe_1790149678289.jpg';
import suyaImg from '../assets/images/nigerian_suya_prawns_1790149701081.jpg';
import { TiltCard } from './TiltCard';

export const StorySection: React.FC = () => {
  return (
    <section id="story-section" className="py-16 sm:py-24 bg-[#FAFAF7] text-[#121110] border-t border-[#E8E6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#14532D]">
              <Heart className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Our Story & Passion</span>
            </div>

            <h2 
              className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121110] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Cooking the Nigerian dishes we grew up loving.
            </h2>

            <p className="text-sm sm:text-base text-[#595852] font-normal leading-relaxed">
              Àdùkẹ́ was created with a clear vision: to celebrate real Nigerian cuisine cooked the traditional way over seasoned firewood.
            </p>

            <p className="text-sm sm:text-base text-[#595852] font-normal leading-relaxed">
              From our slow-simmered party jollof with its beloved bottom-pot crunch, to tender oxtail efo riro, stone-ground egusi, and charcoal-grilled suya skewers, we cook with care, generous portions, and genuine warmth for every guest.
            </p>

            {/* Simple Highlights */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E8E6DD]">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#14532D]">100% Authentic</p>
                <p className="text-xs text-[#595852] mt-0.5">Fresh native herbs & ground spices</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#C2410C]">Daily Fresh</p>
                <p className="text-xs text-[#595852] mt-0.5">Palm wine, chapman & natural zobo</p>
              </div>
            </div>

            {/* Chef Team */}
            <div className="pt-1 flex flex-wrap items-center gap-6 text-xs text-[#595852]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#14532D]" />
                <span className="font-bold text-[#121110]">Babatunde Adeleke</span>
                <span>· Head Chef</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
                <span className="font-bold text-[#121110]">Folashade Alabi</span>
                <span>· Hospitality Manager</span>
              </div>
            </div>

          </div>

          {/* Right Imagery Column */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <TiltCard maxTilt={4} scale={1.01} className="space-y-3 rounded-2xl">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F4F3ED] border border-[#E8E6DD] shadow-xs">
                <img
                  src={jollofImg}
                  alt="Firewood party jollof rice"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-104 transition-transform duration-500"
                />
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E8E6DD] text-xs space-y-1 text-left">
                <p className="font-bold text-[#121110] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Real Firewood Smoke</span>
                </p>
                <p className="text-[11px] text-[#595852] leading-snug">
                  Steamed in heavy cast-iron pots for that rich, smoky party flavor.
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={4} scale={1.01} className="space-y-3 pt-6 sm:pt-10 rounded-2xl">
              <div className="p-3 rounded-xl bg-white border border-[#E8E6DD] text-xs space-y-1 text-left">
                <p className="font-bold text-[#121110] flex items-center gap-1.5">
                  <Wine className="w-3.5 h-3.5 text-[#14532D]" />
                  <span>Yaji Pepper Suya</span>
                </p>
                <p className="text-[11px] text-[#595852] leading-snug">
                  Roasted peanuts, ginger, and peppers dusted fresh over hot charcoal.
                </p>
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F4F3ED] border border-[#E8E6DD] shadow-xs">
                <img
                  src={suyaImg}
                  alt="Grilled tiger prawn and beef suya"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-104 transition-transform duration-500"
                />
              </div>
            </TiltCard>
          </div>

        </div>

      </div>
    </section>
  );
};

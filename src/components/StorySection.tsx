import React from 'react';
import { Flame, Sparkles, Sprout, Wine } from 'lucide-react';
import jollofImg from '../assets/images/nigerian_jollof_deluxe_1790149678289.jpg';
import suyaImg from '../assets/images/nigerian_suya_prawns_1790149701081.jpg';
import { TiltCard } from './TiltCard';

export const StorySection: React.FC = () => {
  return (
    <section id="story-section" className="py-24 sm:py-32 bg-[#FAFAF7] text-[#121110] border-t border-[#E8E6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Narrative Column — Not Jam-Packed, Relaxed Breathable Typesetting */}
          <div className="lg:col-span-6 space-y-7 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#14532D]">
              <Sprout className="w-4 h-4 text-[#14532D]" />
              <span>Ancestral Heritage & Sustainable Flora</span>
            </div>

            <h2 
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#121110] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Rooted in ancient hearth fire, elevated by modern West African artistry.
            </h2>

            <p className="text-sm sm:text-base text-[#595852] font-normal leading-relaxed">
              At Àdùkẹ́, our mission is to celebrate the profound depth of Nigerian gastronomy without dilution. Our open hearth burns cured fruitwood and seasoned applewood, recreating the authentic deep smoke that gives party-style jollof and chargrilled suya their soul.
            </p>

            <p className="text-sm sm:text-base text-[#595852] font-normal leading-relaxed">
              Each dawn begins with the stone-grinding of organic melon seeds, slow fermentation of locust beans (iru) in clay vessels, and gentle simmering of 12-hour bone reductions perfumed with calabash nutmeg (ehuru) and fresh scent leaves.
            </p>

            {/* Proof Metric Adjacency Strip */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#E8E6DD]">
              <div>
                <p className="font-display text-3xl sm:text-4xl font-bold text-[#14532D] tracking-tight">100%</p>
                <p className="text-xs text-[#595852] mt-1 font-medium">Stone-Ground Indigenous Herbs & Spices</p>
              </div>
              <div>
                <p className="font-display text-3xl sm:text-4xl font-bold text-[#C2410C] tracking-tight">Daily Tapped</p>
                <p className="text-xs text-[#595852] mt-1 font-medium">Natural Sweet Palm Wine & Zobo Infusions</p>
              </div>
            </div>

            {/* Culinary Leadership */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#595852]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#14532D]" />
                <span className="font-bold text-[#121110]">Babatunde Adeleke</span>
                <span>· Executive Chef</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
                <span className="font-bold text-[#121110]">Folashade Alabi</span>
                <span>· Master Sommelier</span>
              </div>
            </div>

          </div>

          {/* Right Imagery Column — Hand-Crafted Editorial Presentation */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-5">
            <TiltCard maxTilt={5} scale={1.01} className="space-y-5 rounded-3xl">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#F4F3ED] border border-[#E8E6DD] shadow-xs">
                <img
                  src={jollofImg}
                  alt="Smoked party jollof rice royale with caramelized plantain dodo and braised oxtail"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-104 transition-transform duration-700"
                />
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#E8E6DD] text-xs space-y-1.5 text-left shadow-2xs">
                <p className="font-bold text-[#121110] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Woodfire Bottom-Pot Crunch</span>
                </p>
                <p className="text-[#595852] leading-relaxed">
                  Steamed in heavy cast-iron cauldrons over white oak to achieve the cherished caramelized bottom-pot crunch.
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={5} scale={1.01} className="space-y-5 pt-8 sm:pt-12 rounded-3xl">
              <div className="p-5 rounded-2xl bg-white border border-[#E8E6DD] text-xs space-y-1.5 text-left shadow-2xs">
                <p className="font-bold text-[#121110] flex items-center gap-1.5">
                  <Wine className="w-3.5 h-3.5 text-[#14532D]" />
                  <span>Northern Yaji Pepper Craft</span>
                </p>
                <p className="text-[#595852] leading-relaxed">
                  Roasted ginger, hand-pressed kuli-kuli peanut extract, and sun-dried scotch bonnets dusted fresh over charcoal.
                </p>
              </div>
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#F4F3ED] border border-[#E8E6DD] shadow-xs">
                <img
                  src={suyaImg}
                  alt="Jumbo grilled tiger prawns and tender beef suya skewers over embers"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-104 transition-transform duration-700"
                />
              </div>
            </TiltCard>
          </div>

        </div>

      </div>
    </section>
  );
};

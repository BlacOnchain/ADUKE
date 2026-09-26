import React from 'react';
import {
  ArrowRight,
  Utensils,
  MapPin,
  Clock,
  Flame,
} from 'lucide-react';
import heroImg from '../assets/images/hero_nigerian_restaurant_1790149661135.jpg';
import jollofImg from '../assets/images/nigerian_jollof_deluxe_1790149678289.jpg';
import suyaImg from '../assets/images/nigerian_suya_prawns_1790149701081.jpg';
import { TiltCard } from './TiltCard';

interface HeroProps {
  onBookTable: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBookTable,
  onExploreMenu,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 bg-[#FAFAF7] text-[#121110]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Welcoming Human Narrative */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            {/* Clean, authentic restaurant badge — No AI sparkle logo */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#14532D] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#14532D] animate-pulse" />
              <span>Victoria Island, Lagos · Open Hearth Dining</span>
            </div>

            <h1 
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121110] leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              Real Nigerian cooking, made over open woodfire.
            </h1>

            <p className="text-base sm:text-lg text-[#595852] font-normal leading-relaxed">
              We slow-cook our food with real firewood embers, fresh native herbs, and genuine Lagos hospitality. Come share smoky party jollof, tender braised oxtail, chargrilled suya, and chilled drinks with family and friends.
            </p>

            {/* Clear Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onBookTable}
                className="btn-interactive px-6 py-3.5 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-emerald-950/15 flex items-center gap-2 cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Reserve a Table</span>
              </button>

              <button
                onClick={onExploreMenu}
                className="btn-interactive px-5 py-3.5 bg-white hover:bg-[#F4F3ED] text-[#121110] text-xs sm:text-sm font-semibold rounded-xl border border-[#E8E6DD] flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>View Menu</span>
                <ArrowRight className="w-4 h-4 text-[#14532D]" />
              </button>
            </div>

            {/* Simple Human Highlights Strip */}
            <div className="pt-4 border-t border-[#E8E6DD] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#595852]">
              <span className="flex items-center gap-1.5 font-medium text-[#121110]">
                <MapPin className="w-3.5 h-3.5 text-[#14532D]" />
                14 Adeola Odeku, VI
              </span>
              <span aria-hidden="true" className="text-[#8C8A82]">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#14532D]" />
                Open Tuesday – Sunday
              </span>
              <span aria-hidden="true" className="text-[#8C8A82]">·</span>
              <span>Free Valet Parking</span>
            </div>

          </div>

          {/* Right Column: Clean, Elegant Single Visual Showcase */}
          <div className="lg:col-span-6 animate-fade-scale">
            <TiltCard maxTilt={4} scale={1.01} className="rounded-3xl">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8E6DD] bg-[#121110]">
                {/* Main Hero Photo */}
                <div className="aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden group">
                  <img
                    src={heroImg}
                    alt="Warm sunlit dining room at Àdùkẹ́ Lagos"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  
                  {/* Subtle warm gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Simple Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                      Victoria Island Dining Room
                    </span>
                  </div>

                  {/* Bottom Warm Caption */}
                  <div className="absolute bottom-5 left-5 right-5 text-left text-white space-y-1">
                    <h3 className="font-display text-xl sm:text-2xl font-bold">
                      The Hearth at Àdùkẹ́
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100">
                      Comfortable indoor tables and warm firewood aromas ready to welcome you.
                    </p>
                  </div>
                </div>

                {/* Simple 2-photo preview bar below */}
                <div className="grid grid-cols-2 p-3 bg-white gap-2 border-t border-[#E8E6DD]">
                  <div 
                    onClick={onExploreMenu}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAFAF7] hover:bg-[#F4F3ED] transition-colors cursor-pointer text-left"
                  >
                    <img
                      src={jollofImg}
                      alt="Firewood Party Jollof"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#121110] truncate">Party Jollof</p>
                      <p className="text-[11px] text-[#14532D] font-medium">Woodfire smoked</p>
                    </div>
                  </div>

                  <div 
                    onClick={onExploreMenu}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAFAF7] hover:bg-[#F4F3ED] transition-colors cursor-pointer text-left"
                  >
                    <img
                      src={suyaImg}
                      alt="Tiger Prawn Suya"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#121110] truncate">Tiger Prawn Suya</p>
                      <p className="text-[11px] text-[#C2410C] font-medium">Charcoal grilled</p>
                    </div>
                  </div>
                </div>

              </div>
            </TiltCard>
          </div>

        </div>

        {/* Lower Simple Hospitality Strip */}
        <div className="mt-12 pt-6 border-t border-[#E8E6DD] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="space-y-0.5">
            <p className="font-display text-lg sm:text-xl font-bold text-[#121110]">Woodfire Hearth</p>
            <p className="text-xs text-[#595852]">Cooked over seasoned oak embers</p>
          </div>
          <div className="space-y-0.5">
            <p className="font-display text-lg sm:text-xl font-bold text-[#14532D]">Fresh Ingredients</p>
            <p className="text-xs text-[#595852]">Stone-ground native spices & herbs</p>
          </div>
          <div className="space-y-0.5">
            <p className="font-display text-lg sm:text-xl font-bold text-[#C2410C]">Charcoal Grill</p>
            <p className="text-xs text-[#595852]">Northern yaji spiced suya skewers</p>
          </div>
          <div className="space-y-0.5">
            <p className="font-display text-lg sm:text-xl font-bold text-[#C89B3C]">Fresh Drinks</p>
            <p className="text-xs text-[#595852]">Fresh palm wine, zobo & chapman</p>
          </div>
        </div>

      </div>
    </section>
  );
};

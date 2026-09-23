import React from 'react';
import { ArrowRight, Utensils, Compass, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_nigerian_restaurant_1790149661135.jpg';

interface HeroProps {
  onBookTable: () => void;
  onExploreMenu: () => void;
  onExploreFloorPlan: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBookTable,
  onExploreMenu,
  onExploreFloorPlan,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 sm:pt-16 sm:pb-32 bg-[#FAFAF7] text-[#121110]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header Block — Not Jam-Packed, Generous Whitespace */}
        <div className="max-w-3xl space-y-6 text-left">
          
          {/* Quiet Unboxed Origin Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-3 text-xs tracking-wider uppercase font-medium text-[#595852]">
            <span className="text-[#14532D] font-bold">Àdùkẹ́ Gastronomy</span>
            <span aria-hidden="true" className="text-[#8C8A82]">·</span>
            <span>174 Franklin Street, Tribeca</span>
            <span aria-hidden="true" className="text-[#8C8A82]">·</span>
            <span>Firewood & Charcoal Embers</span>
          </div>

          {/* Majestic Serif Headline */}
          <h1 
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#121110] leading-[1.08]"
            style={{ textWrap: 'balance' }}
          >
            The poetry of woodfire, native herbs & modern Nigerian gastronomy.
          </h1>

          {/* Narrative Body */}
          <p className="text-base sm:text-lg text-[#595852] font-normal leading-relaxed max-w-2xl">
            Where applewood smoke embraces slow-braised oxtail efo riro, hand-pounded yam, and char-blistered suya skewers. An intimate celebration of West African culinary craftsmanship in the heart of Tribeca.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={onBookTable}
              className="px-6 py-3.5 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-950/15 flex items-center gap-2.5 cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Reserve a Table</span>
            </button>

            <button
              onClick={onExploreMenu}
              className="px-6 py-3.5 bg-white hover:bg-[#F4F3ED] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#E8E6DD] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>Explore Culinary Menu</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#14532D]" />
            </button>

            <button
              onClick={onExploreFloorPlan}
              className="px-4 py-3.5 text-xs font-semibold text-[#595852] hover:text-[#121110] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#C2410C]" />
              <span>View Pavilion Plan</span>
            </button>
          </div>

        </div>

        {/* Hero Visual Showcase — Spacious Single Focal Anchor */}
        <div className="mt-14 sm:mt-18">
          <div className="relative aspect-[21/9] min-h-[340px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(18,17,16,0.06)] bg-[#F4F3ED]">
            <img
              src={heroImg}
              alt="Contemporary sunlit dining hall of Àdùkẹ́ with handcrafted wooden tables, warm brass fixtures, and lush West African flora"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Soft Ambient Scrim for Legibility & Polish */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white pointer-events-none">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#DCFCE7] font-semibold">
                  The Eko Grand Pavilion
                </span>
                <p className="font-display text-lg sm:text-xl font-bold">
                  Curated dining under hand-woven raffia lanterns & Lagos brasswork
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-emerald-100">
                <span>12 Private Tables</span>
                <span>·</span>
                <span>Open Hearth Kitchen</span>
                <span>·</span>
                <span>Curbside Valet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Botanical & Culinary Adjacency Strip — Unboxed */}
        <div className="mt-12 pt-8 border-t border-[#E8E6DD] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <p className="font-display text-2xl font-bold text-[#121110]">Wood-Fired</p>
            <p className="text-xs text-[#595852] mt-0.5">Seasoned applewood & iron cauldrons</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[#14532D]">Iru & Herbs</p>
            <p className="text-xs text-[#595852] mt-0.5">Fermented locust beans & wild scent leaf</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[#C2410C]">Northern Yaji</p>
            <p className="text-xs text-[#595852] mt-0.5">Kuli-kuli peanut roast & scotch bonnet</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[#C89B3C]">Palm Wine</p>
            <p className="text-xs text-[#595852] mt-0.5">Sweet daily tapped palm wine & chapman</p>
          </div>
        </div>

      </div>
    </section>
  );
};

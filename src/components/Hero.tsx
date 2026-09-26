import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Utensils,
  Compass,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Clock,
  Thermometer,
  ShieldCheck,
  ChevronRight,
  Eye,
} from 'lucide-react';
import heroImg from '../assets/images/hero_nigerian_restaurant_1790149661135.jpg';
import jollofImg from '../assets/images/nigerian_jollof_deluxe_1790149678289.jpg';
import suyaImg from '../assets/images/nigerian_suya_prawns_1790149701081.jpg';
import { TiltCard } from './TiltCard';

interface HeroProps {
  onBookTable: () => void;
  onExploreMenu: () => void;
}

interface ShowcaseItem {
  id: string;
  tabLabel: string;
  title: string;
  tagline: string;
  image: string;
  temp: string;
  time: string;
  aromaNotes: string[];
  signatureNote: string;
  statusBadge: string;
}

export const Hero: React.FC<HeroProps> = ({
  onBookTable,
  onExploreMenu,
}) => {
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'hearth',
      tabLabel: 'Open Fire Hearth',
      title: 'The Eko Grand Hearth',
      tagline: 'Lagos hardwood embers, iron cauldrons & hand-woven raffia lanterns',
      image: heroImg,
      temp: '420°C White Oak',
      time: 'Continuous Ember Simmer',
      aromaNotes: ['Applewood smoke', 'Aromatics', 'Wild thyme', 'Palm embers'],
      signatureNote: 'Heart of Victoria Island dining hall with 12 private teak tables.',
      statusBadge: 'Open Hearth Live',
    },
    {
      id: 'jollof',
      tabLabel: 'Party Jollof Royale',
      title: 'Smoked Firewood Jollof Royale',
      tagline: 'Simmered in cast iron cauldrons with tiger prawns & roasted plum tomatoes',
      image: jollofImg,
      temp: '185°C Cast Iron',
      time: '45-Min Wood Smoke',
      aromaNotes: ['Smoked habanero', 'Roasted tatashe', 'Fermented iru', 'Wood ash aroma'],
      signatureNote: 'Traditional bottom-pot char crust loved across Nigerian celebrations.',
      statusBadge: 'Signature Dish',
    },
    {
      id: 'suya',
      tabLabel: 'Tiger Prawn Suya',
      title: 'Char-Blistered Jumbo Prawn Suya',
      tagline: 'Northern yaji peanut crust, charred red onions & fresh key lime',
      image: suyaImg,
      temp: '320°C Charcoal Sear',
      time: '6-Min Flash Skewer',
      aromaNotes: ['Crushed kuli-kuli', 'Northern ginger', 'Uda pod', 'Scotch bonnet'],
      signatureNote: 'Northern Hausa master skewer craftsmanship infused with coastal prawns.',
      statusBadge: 'Chef Selection',
    },
  ];

  const [activeTab, setActiveTab] = useState<string>('hearth');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const popIntervalRef = useRef<any>(null);

  const currentItem = showcaseItems.find((item) => item.id === activeTab) || showcaseItems[0];

  // Synthesize realistic gentle woodfire ember crackle & warm chime via Web Audio API
  const toggleWoodfireAudio = () => {
    try {
      if (isPlayingAudio) {
        if (noiseNodeRef.current) {
          try {
            (noiseNodeRef.current as any).stop?.();
            noiseNodeRef.current.disconnect();
          } catch {}
        }
        if (popIntervalRef.current) clearInterval(popIntervalRef.current);
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close().catch(() => {});
        }
        audioCtxRef.current = null;
        setIsPlayingAudio(false);
        return;
      }

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master low gain for gentle ambient background
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.09, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Low rumble filter for deep warm hearth resonance
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 1.8;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(480, ctx.currentTime);

      whiteNoise.connect(lowpass);
      lowpass.connect(masterGain);
      whiteNoise.start(0);
      noiseNodeRef.current = whiteNoise;

      // Random micro-pops simulating wood snapping and embers crackling
      const playPop = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const popOsc = ctx.createOscillator();
        const popGain = ctx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(200 + Math.random() * 800, ctx.currentTime);
        popGain.gain.setValueAtTime(0.04 + Math.random() * 0.06, ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

        popOsc.connect(popGain);
        popGain.connect(masterGain);
        popOsc.start(ctx.currentTime);
        popOsc.stop(ctx.currentTime + 0.09);
      };

      popIntervalRef.current = setInterval(() => {
        if (Math.random() > 0.45) playPop();
      }, 400);

      setIsPlayingAudio(true);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    return () => {
      if (popIntervalRef.current) clearInterval(popIntervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-10 pb-20 sm:pt-14 sm:pb-28 bg-[#FAFAF7] text-[#121110]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* TOP FOLD: 2-COLUMN BALANCED EDITORIAL & INTERACTIVE SHOWCASE */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Narrative, Typography & Direct Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Quiet Unboxed Origin Metadata (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-wider uppercase font-medium text-[#595852]">
              <span className="text-[#14532D] font-bold">Àdùkẹ́ Gastronomy</span>
              <span aria-hidden="true" className="text-[#8C8A82]">·</span>
              <span>14 Adeola Odeku, Victoria Island</span>
              <span aria-hidden="true" className="text-[#8C8A82]">·</span>
              <span>Firewood & Charcoal Embers</span>
            </div>

            {/* Majestic Serif Headline */}
            <h1 
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121110] leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              The poetry of woodfire, native herbs & modern Nigerian gastronomy.
            </h1>

            {/* Narrative Body */}
            <p className="text-base sm:text-lg text-[#595852] font-normal leading-relaxed">
              Where applewood smoke embraces slow-braised oxtail efo riro, hand-pounded yam, and char-blistered suya skewers. An intimate celebration of West African culinary craftsmanship in the heart of Victoria Island, Lagos.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onBookTable}
                className="btn-interactive px-6 py-3.5 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md shadow-emerald-950/15 flex items-center gap-2.5 cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Reserve a Table</span>
              </button>

              <button
                onClick={onExploreMenu}
                className="btn-interactive px-5 py-3.5 bg-white hover:bg-[#F4F3ED] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#E8E6DD] flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Explore Culinary Menu</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#14532D]" />
              </button>

            </div>

            {/* Quiet Hallmark Metrics Strip — Unboxed & Refined */}
            <div className="pt-3 border-t border-[#E8E6DD] flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#595852] font-mono">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#C2410C] animate-pulse" />
                <strong className="text-[#121110] font-sans font-bold">420°C</strong> Iron Cauldrons
              </span>
              <span aria-hidden="true" className="text-[#8C8A82]">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#14532D]" />
                <strong className="text-[#121110] font-sans font-bold">7-Hour</strong> Oxtail Simmer
              </span>
              <span aria-hidden="true" className="text-[#8C8A82]">·</span>
              <span>Wild Native Scent Leaf & Iru</span>
            </div>

          </div>

          {/* Right Column: Animated, Interactive Live Hearth 3D Tilt Showcase */}
          <div className="lg:col-span-6 animate-fade-scale">
            <TiltCard maxTilt={5} scale={1.01} className="rounded-3xl">
              <div className="relative bg-white border border-[#E8E6DD] rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(18,17,16,0.08)] transition-all">
              
              {/* Interactive Showcase Tabs (Button Segments) */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EFEB] gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#FAFAF7] rounded-xl border border-[#E8E6DD] text-xs">
                  {showcaseItems.map((item) => {
                    const isActive = item.id === activeTab;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-[#14532D] font-bold shadow-2xs'
                            : 'text-[#595852] hover:text-[#121110]'
                        }`}
                      >
                        {item.tabLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Audio Toggle: Hear Woodfire Simmer */}
                <button
                  onClick={toggleWoodfireAudio}
                  title={isPlayingAudio ? 'Mute woodfire sound' : 'Hear gentle woodfire ember sizzle'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer shrink-0 shadow-2xs ${
                    isPlayingAudio
                      ? 'bg-[#DCFCE7] text-[#14532D] border-[#14532D]/30 ring-1 ring-[#14532D]/20'
                      : 'bg-white text-[#595852] hover:text-[#121110] border-[#E8E6DD]'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#14532D] animate-pulse" />
                      <span className="hidden sm:inline text-[11px]">Embers Live</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Hearth Sound</span>
                    </>
                  )}
                </button>
              </div>

              {/* Showcase Main Stage with Simulated Floating Flame Embers */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mt-3 bg-[#121110] group">
                <img
                  key={currentItem.id}
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                {/* Ambient Hearth Glow Effect */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-orange-600/30 blur-3xl rounded-full pointer-events-none animate-hearth-glow" />

                {/* Floating Animated Glowing Ember Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute bottom-8 left-[20%] w-2 h-2 rounded-full bg-amber-400 blur-[0.5px] animate-ember-1 shadow-[0_0_8px_#F59E0B]" />
                  <div className="absolute bottom-6 left-[45%] w-1.5 h-1.5 rounded-full bg-orange-500 blur-[0.5px] animate-ember-2 shadow-[0_0_8px_#EA580C]" />
                  <div className="absolute bottom-10 left-[68%] w-2.5 h-2.5 rounded-full bg-yellow-300 blur-[0.5px] animate-ember-3 shadow-[0_0_10px_#FDE047]" />
                  <div className="absolute bottom-7 left-[35%] w-1 h-1 rounded-full bg-red-400 blur-[0.5px] animate-ember-4 shadow-[0_0_6px_#F87171]" />
                  <div className="absolute bottom-12 left-[82%] w-2 h-2 rounded-full bg-amber-300 blur-[0.5px] animate-ember-5 shadow-[0_0_8px_#FCD34D]" />
                </div>

                {/* Top Corner Stamps */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#14532D] ring-2 ring-emerald-400/50 animate-pulse" />
                    {currentItem.statusBadge}
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-orange-400" />
                    {currentItem.temp}
                  </span>
                </div>

                {/* Bottom Overlay Information */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-1.5 text-left text-white">
                  <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                    {currentItem.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-snug line-clamp-2">
                    {currentItem.tagline}
                  </p>
                </div>
              </div>

              {/* Sensory Aroma Notes & Interactive Menu Bridge */}
              <div className="mt-3.5 space-y-2.5 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#121110] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
                    <span>Sensory Tasting & Scent Notes:</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#8C8A82]">
                    {currentItem.time}
                  </span>
                </div>

                {/* Unboxed Aroma Notes with Subtle Delimiters */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#595852] bg-[#FAFAF7] p-2.5 rounded-xl border border-[#E8E6DD]">
                  {currentItem.aromaNotes.map((note, idx) => (
                    <React.Fragment key={note}>
                      <span className="font-medium text-[#121110]">{note}</span>
                      {idx < currentItem.aromaNotes.length - 1 && (
                        <span aria-hidden="true" className="text-[#C89B3C]">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Quick Interactive Callout */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <p className="text-[11px] text-[#595852] italic max-w-xs truncate">
                    "{currentItem.signatureNote}"
                  </p>
                  <button
                    onClick={onExploreMenu}
                    className="text-[#14532D] hover:text-[#0D3823] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    <span>View in Menu</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
            </TiltCard>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* LOWER SECTION: BOTANICAL HERITAGE STRIP & EXPANSIVE PAVILION SHOWCASE */}
        {/* ========================================================================= */}
        <div className="mt-14 pt-8 border-t border-[#E8E6DD] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
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

        {/* Architectural Pavilion Showcase Anchor */}
        <div className="mt-12">
          <div className="relative aspect-[21/9] min-h-[300px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(18,17,16,0.06)] bg-[#F4F3ED]">
            <img
              src={heroImg}
              alt="Contemporary sunlit dining hall of Àdùkẹ́ with handcrafted wooden tables, warm brass fixtures, and lush West African flora"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Soft Ambient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white pointer-events-none text-left">
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

      </div>
    </section>
  );
};

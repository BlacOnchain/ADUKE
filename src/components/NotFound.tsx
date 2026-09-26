import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, ArrowLeft, Home, Compass, Phone, Sparkles } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#121110] flex flex-col justify-between selection:bg-[#14532D] selection:text-white">
      {/* Top Header */}
      <header className="py-6 px-6 sm:px-12 border-b border-[#E8E6DD] bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-baseline gap-2 cursor-pointer group text-left"
          >
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#121110] group-hover:text-[#14532D] transition-colors">
              Àdùkẹ́
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#14532D]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8A82]">
              Lagos
            </span>
          </button>

          <a
            href="tel:+23414608910"
            className="text-xs font-semibold text-[#14532D] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Concierge: +234 1 460 8910</span>
          </a>
        </div>
      </header>

      {/* Main 404 Hero Content */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-2xl bg-white border border-[#E8E6DD] rounded-3xl p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(18,17,16,0.04)] space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCFCE7] text-[#14532D] text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Table Unoccupied · 404</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#121110] tracking-tight">
              Course Not Found
            </h1>

            <p className="text-sm sm:text-base text-[#595852] max-w-md mx-auto leading-relaxed">
              The page, booking code, or link you requested is not currently seated at our hearth. Let us guide you back to the dining room.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3.5 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-950/15 flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </button>

            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const el = document.getElementById('menu-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-5 py-3.5 bg-[#FAFAF7] hover:bg-[#F4F3ED] text-[#121110] text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#E8E6DD] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Compass className="w-4 h-4 text-[#14532D]" />
              <span>Explore Menu</span>
            </button>

            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const el = document.getElementById('reservation-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-5 py-3.5 bg-white hover:bg-[#F4F3ED] text-[#14532D] text-xs font-semibold uppercase tracking-wider rounded-xl border border-emerald-300 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Utensils className="w-4 h-4" />
              <span>Book Table</span>
            </button>
          </div>

          {/* Concierge Assistance Strip */}
          <div className="pt-6 border-t border-[#E8E6DD] text-xs text-[#8C8A82] space-y-1">
            <p>
              Need immediate assistance? Speak directly with our Host Concierge:
            </p>
            <p>
              <a
                href="tel:+23414608910"
                className="font-mono font-bold text-[#121110] hover:text-[#14532D] transition-colors"
              >
                +234 1 460 8910
              </a>
              {' '}·{' '}
              <a
                href="mailto:concierge@aduke.lagos.ng"
                className="text-[#14532D] font-medium hover:underline"
              >
                concierge@aduke.lagos.ng
              </a>
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-[#8C8A82] border-t border-[#E8E6DD]">
        <p>© {new Date().getFullYear()} Àdùkẹ́ Hospitality Group · 14 Adeola Odeku, Victoria Island, Lagos</p>
      </footer>
    </div>
  );
};

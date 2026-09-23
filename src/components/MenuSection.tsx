import React, { useState } from 'react';
import { Search, Plus, Sparkles, SlidersHorizontal, Settings, Clock } from 'lucide-react';
import { MenuItem, MenuCategory, NigerianDietBadge, formatNaira } from '../types/restaurant';

interface MenuSectionProps {
  menu: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
  onQuickAdd: (dish: MenuItem) => void;
  onOpenMenuManager: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menu,
  onSelectDish,
  onQuickAdd,
  onOpenMenuManager,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const categories: { id: MenuCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Complete Collection' },
    { id: 'appetizers', label: 'Small Chops & Starters' },
    { id: 'mains', label: 'Signature Mains & Swallows' },
    { id: 'desserts', label: 'Sweet Indulgences' },
    { id: 'drinks', label: 'Palm Wine & Chapman' },
  ];

  const dietaryTags: { id: string; label: string }[] = [
    { id: 'all', label: 'All Dietary Needs' },
    { id: 'halal', label: 'Halal' },
    { id: 'chef-signature', label: 'Chef Signature' },
    { id: 'suya-spiced', label: 'Suya-Spiced' },
    { id: 'seafood', label: 'Seafood' },
    { id: 'vegetarian', label: 'Vegetarian' },
  ];

  // Filter items
  const filteredItems = menu.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.yorubaName && item.yorubaName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || item.tags?.includes(selectedTag as NigerianDietBadge);

    return matchesCategory && matchesSearch && matchesTag;
  });

  return (
    <section id="menu-section" className="py-24 sm:py-32 bg-[#FAFAF7] text-[#121110] border-t border-[#E8E6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header — Breathable Editorial Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E8E6DD]">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#14532D]">
              <span>Àdùkẹ́ Gastronomic Offerings</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#C2410C]">Spring/Summer Tasting</span>
            </div>
            <h2 
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#121110]"
              style={{ textWrap: 'balance' }}
            >
              Curated by the hearth, seasoned by ancestral heritage.
            </h2>
            <p className="text-sm sm:text-base text-[#595852] font-normal leading-relaxed">
              Every dish is prepared using slow hearth-fire cooking, stone-ground indigenous spices, and heritage ingredients harvested from sustainable family farms.
            </p>
          </div>


        </div>

        {/* Category Navigation & Search Filter Controls */}
        <div className="pt-8 pb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Functional Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'bg-white hover:bg-[#F4F3ED] text-[#595852] border border-[#E8E6DD]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8A82]" />
            <input
              type="text"
              placeholder="Search jollof, suya, swallow..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E8E6DD] rounded-xl text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] transition-all"
            />
          </div>

        </div>

        {/* Dietary Filter Strip — Clean Unboxed Buttons */}
        <div className="flex items-center gap-2 pb-8 overflow-x-auto text-xs text-[#595852]">
          <span className="font-semibold text-[#121110] mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Dietary:</span>
          </span>
          {dietaryTags.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTag(t.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedTag === t.id
                  ? 'bg-[#DCFCE7] text-[#14532D] font-bold'
                  : 'hover:text-[#121110] text-[#595852]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Food Items Grid — Human-Crafted, Non-AI-Boxed Architecture */}
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-[#E8E6DD] p-8 space-y-3">
            <p className="font-display text-xl text-[#121110] font-semibold">No dishes match your filter</p>
            <p className="text-xs text-[#595852]">
              Try searching for another keyword or clear the dietary filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTag('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold bg-[#14532D] text-white rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 text-left">
            {filteredItems.map((dish) => (
              <article
                key={dish.id}
                className="group relative bg-white rounded-3xl border border-[#E8E6DD] overflow-hidden hover:shadow-[0_16px_36px_rgba(18,17,16,0.06)] hover:border-[#14532D]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Showcase */}
                  <div 
                    onClick={() => onSelectDish(dish)}
                    className="relative aspect-[16/10] bg-[#F4F3ED] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    
                    {/* Status Badge when sold out */}
                    {!dish.available && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-3 py-1 bg-white text-[#121110] text-xs font-bold uppercase tracking-wider rounded-lg">
                          Sold Out for Tonight
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-3">
                    
                    {/* Unboxed Metadata Strip (Zero-Pill Discipline) */}
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#8C8A82]">
                      <span className="text-[#14532D] font-bold uppercase tracking-wider">
                        {dish.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{dish.prepTimeMinutes} mins</span>
                      {dish.tags?.slice(0, 2).map((t) => (
                        <React.Fragment key={t}>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{t.replace('-', ' ')}</span>
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Dish Titles */}
                    <div 
                      onClick={() => onSelectDish(dish)}
                      className="cursor-pointer space-y-0.5"
                    >
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[#121110] group-hover:text-[#14532D] transition-colors leading-snug">
                        {dish.name}
                      </h3>
                      {dish.yorubaName && (
                        <p className="font-serif italic text-xs text-[#C2410C]">
                          {dish.yorubaName}
                        </p>
                      )}
                    </div>

                    {/* Narrative Description */}
                    <p className="text-xs text-[#595852] leading-relaxed line-clamp-3">
                      {dish.description}
                    </p>

                    {/* Sommelier Pairing Note */}
                    {dish.pairing && (
                      <p className="text-[11px] text-[#8C8A82] italic pt-1 border-t border-[#F0EFEB]">
                        <span className="text-[#121110] font-medium not-italic">Pair with: </span>
                        {dish.pairing}
                      </p>
                    )}

                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 flex items-center justify-between border-t border-[#F4F3ED]">
                  <div>
                    <span className="text-[10px] text-[#8C8A82] uppercase tracking-wider block">Price</span>
                    <span className="font-mono text-lg font-bold text-[#121110] tabular-nums">
                      {formatNaira(dish.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectDish(dish)}
                      className="px-3 py-2 text-xs font-medium text-[#595852] hover:text-[#121110] transition-colors cursor-pointer"
                    >
                      Details & Recipe
                    </button>

                    <button
                      type="button"
                      disabled={!dish.available}
                      onClick={() => onQuickAdd(dish)}
                      className="px-4 py-2 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

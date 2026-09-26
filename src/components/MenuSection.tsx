import React, { useState } from 'react';
import { Search, Plus, Sparkles, SlidersHorizontal } from 'lucide-react';
import { MenuItem, MenuCategory, NigerianDietBadge, formatNaira } from '../types/restaurant';
import { TiltCard } from './TiltCard';

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
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const categories: { id: MenuCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Dishes' },
    { id: 'appetizers', label: 'Small Chops & Starters' },
    { id: 'mains', label: 'Soups, Swallows & Mains' },
    { id: 'desserts', label: 'Sweet Treats' },
    { id: 'drinks', label: 'Drinks & Palm Wine' },
  ];

  const dietaryTags: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'halal', label: 'Halal' },
    { id: 'chef-signature', label: 'House Special' },
    { id: 'suya-spiced', label: 'Suya Spiced' },
    { id: 'seafood', label: 'Fresh Seafood' },
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
    <section id="menu-section" className="py-14 sm:py-24 bg-[#FAFAF7] text-[#121110] border-t border-[#E8E6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean, Human Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 sm:pb-12 border-b border-[#E8E6DD]">
          <div className="max-w-2xl space-y-2 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#14532D]">
              <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Freshly Prepared Daily</span>
            </div>
            <h2 
              className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121110]"
              style={{ textWrap: 'balance' }}
            >
              Our Food & Drink Menu
            </h2>
            <p className="text-xs sm:text-sm text-[#595852] font-normal leading-relaxed">
              Every dish is made from scratch with genuine woodfire smoke, rich native ingredients, and generous portions.
            </p>
          </div>
        </div>

        {/* Category Navigation & Search Filter Controls */}
        <div className="pt-6 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
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
          <div className="relative w-full md:w-64">
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

        {/* Dietary Filter Strip */}
        <div className="flex items-center gap-1.5 pb-6 overflow-x-auto text-xs text-[#595852] scrollbar-none">
          <span className="font-semibold text-[#121110] text-[11px] sm:text-xs mr-1 shrink-0">
            Filter by:
          </span>
          {dietaryTags.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTag(t.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === t.id
                  ? 'bg-[#DCFCE7] text-[#14532D] font-bold'
                  : 'bg-white/80 hover:bg-white text-[#595852] border border-[#E8E6DD]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Food Items Grid — 2 boxes per line on mobile, 3 on desktop */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#E8E6DD] p-6 space-y-3">
            <p className="font-display text-lg text-[#121110] font-semibold">No dishes match your search</p>
            <p className="text-xs text-[#595852]">
              Try searching with a different word or reset the filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTag('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold bg-[#14532D] text-white rounded-xl cursor-pointer"
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 text-left">
            {filteredItems.map((dish, idx) => (
              <TiltCard
                key={dish.id}
                maxTilt={4}
                scale={1.01}
                className="animate-fade-scale rounded-2xl sm:rounded-3xl h-full"
              >
                <article
                  style={{ animationDelay: `${Math.min(idx * 40, 300)}ms` }}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#E8E6DD] overflow-hidden hover:shadow-lg hover:border-[#14532D]/30 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Dish Photo */}
                    <div 
                      onClick={() => onSelectDish(dish)}
                      className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#F4F3ED] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      />
                      
                      {/* Sold Out Overlay */}
                      {!dish.available && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-2">
                          <span className="px-2.5 py-1 bg-white text-[#121110] text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg text-center">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-2">
                      
                      {/* Simple Category & Prep Time */}
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#8C8A82]">
                        <span className="text-[#14532D] font-bold uppercase">
                          {dish.category}
                        </span>
                        <span>·</span>
                        <span>{dish.prepTimeMinutes} mins</span>
                      </div>

                      {/* Dish Title */}
                      <div 
                        onClick={() => onSelectDish(dish)}
                        className="cursor-pointer space-y-0.5"
                      >
                        <h3 className="font-display text-sm sm:text-lg font-bold text-[#121110] group-hover:text-[#14532D] transition-colors leading-snug line-clamp-2">
                          {dish.name}
                        </h3>
                        {dish.yorubaName && (
                          <p className="font-serif italic text-[11px] sm:text-xs text-[#C2410C] truncate">
                            {dish.yorubaName}
                          </p>
                        )}
                      </div>

                      {/* Clean 2-line Description */}
                      <p className="text-[11px] sm:text-xs text-[#595852] leading-relaxed line-clamp-2">
                        {dish.description}
                      </p>

                    </div>
                  </div>

                  {/* Price & Add Action */}
                  <div className="p-3 sm:p-5 pt-1 sm:pt-2 border-t border-[#F4F3ED] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs sm:text-base font-bold text-[#121110] tabular-nums">
                        {formatNaira(dish.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectDish(dish)}
                        className="hidden sm:inline-block px-2.5 py-1.5 text-xs text-[#595852] hover:text-[#121110] font-medium transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        disabled={!dish.available}
                        onClick={() => onQuickAdd(dish)}
                        className="btn-interactive px-3 py-1.5 sm:px-4 sm:py-2 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-40 text-white text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Add to order bag"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>

                </article>
              </TiltCard>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

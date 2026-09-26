import React, { useState, useMemo } from 'react';
import { Search, Plus, SlidersHorizontal, Check } from 'lucide-react';
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

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: menu.length };
    menu.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [menu]);

  // Filter items
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.yorubaName && item.yorubaName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag === 'all' || item.tags?.includes(selectedTag as NigerianDietBadge);

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [menu, selectedCategory, searchQuery, selectedTag]);

  return (
    <section id="menu-section" className="py-14 sm:py-24 bg-[#FAFAF7] text-[#121110] border-t border-[#E8E6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean, Human Section Header without any AI sparkle icons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 sm:pb-12 border-b border-[#E8E6DD]">
          <div className="max-w-2xl space-y-2 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#14532D]">
              <span className="w-2 h-2 rounded-full bg-[#14532D]" />
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
        <div className="pt-6 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Category Filter Tabs with count badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
            {categories.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 sm:px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#14532D] text-white shadow-sm shadow-emerald-950/20 ring-1 ring-[#14532D]'
                      : 'bg-white hover:bg-[#F4F3ED] text-[#595852] hover:text-[#121110] border border-[#E8E6DD]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FAFAF7] text-[#8C8A82]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8A82]" />
            <input
              type="text"
              placeholder="Search jollof, suya, swallow..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#E8E6DD] rounded-xl text-[#121110] placeholder-[#8C8A82] focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] transition-all shadow-2xs"
            />
          </div>

        </div>

        {/* Dietary Filter Strip */}
        <div className="flex items-center gap-1.5 pb-6 overflow-x-auto text-xs text-[#595852] scrollbar-none">
          <span className="font-semibold text-[#121110] text-[11px] sm:text-xs mr-1 shrink-0">
            Dietary:
          </span>
          {dietaryTags.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTag(t.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                selectedTag === t.id
                  ? 'bg-[#DCFCE7] text-[#14532D] font-bold ring-1 ring-[#14532D]/30'
                  : 'bg-white hover:bg-[#F4F3ED] text-[#595852] border border-[#E8E6DD]'
              }`}
            >
              {selectedTag === t.id && <Check className="w-3 h-3 text-[#14532D]" />}
              <span>{t.label}</span>
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 text-left">
            {filteredItems.map((dish, idx) => (
              <TiltCard
                key={dish.id}
                maxTilt={4}
                scale={1.01}
                className="animate-fade-scale rounded-2xl sm:rounded-3xl h-full"
              >
                <article
                  style={{ animationDelay: `${Math.min(idx * 35, 300)}ms` }}
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
                    <div className="p-3.5 sm:p-5 space-y-1.5 sm:space-y-2">
                      
                      {/* Simple Category & Prep Time */}
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#8C8A82]">
                        <span className="text-[#14532D] font-bold uppercase tracking-wider">
                          {dish.category}
                        </span>
                        <span>·</span>
                        <span>{dish.prepTimeMinutes} mins</span>
                      </div>

                      {/* Dish Title & Yoruba Name with proper food fonts */}
                      <div 
                        onClick={() => onSelectDish(dish)}
                        className="cursor-pointer space-y-0.5"
                      >
                        <h3 className="font-display text-sm sm:text-lg font-bold text-[#121110] group-hover:text-[#14532D] transition-colors leading-snug line-clamp-2">
                          {dish.name}
                        </h3>
                        {dish.yorubaName && (
                          <p className="font-serif italic text-[11px] sm:text-xs text-[#C2410C] truncate font-medium">
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
                  <div className="p-3.5 sm:p-5 pt-1.5 sm:pt-2 border-t border-[#F4F3ED] flex items-center justify-between gap-2">
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
                        className="btn-interactive px-3 py-2 sm:px-4 sm:py-2 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-40 text-white text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl shadow-xs flex items-center gap-1 cursor-pointer min-h-[36px] sm:min-h-[38px]"
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

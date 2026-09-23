import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, CheckCircle2, DollarSign, Image as ImageIcon, Sparkles, Tag, Eye } from 'lucide-react';
import { MenuItem, MenuCategory, NigerianDietBadge } from '../types/restaurant';
import { restaurantDB } from '../data/db';

interface MenuManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItem[];
}

export const MenuManagementModal: React.FC<MenuManagementModalProps> = ({
  isOpen,
  onClose,
  menu,
}) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');

  // Form State
  const [name, setName] = useState('');
  const [yorubaName, setYorubaName] = useState('');
  const [category, setCategory] = useState<MenuCategory>('mains');
  const [price, setPrice] = useState<number>(25);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [tags, setTags] = useState<NigerianDietBadge[]>(['chef-signature']);

  if (!isOpen) return null;

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setName(item.name);
    setYorubaName(item.yorubaName || '');
    setCategory(item.category);
    setPrice(item.price);
    setDescription(item.description);
    setImageUrl(item.image);
    setAvailable(item.available !== false);
    setTags(item.tags || []);
  };

  const startNew = () => {
    setEditingItem(null);
    setIsAddingNew(true);
    setName('');
    setYorubaName('');
    setCategory('mains');
    setPrice(28);
    setDescription('');
    setImageUrl(menu[0]?.image || '');
    setAvailable(true);
    setTags(['chef-signature']);
  };

  const cancelForm = () => {
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert('Please provide item name and description.');
      return;
    }

    if (editingItem) {
      const updated: MenuItem = {
        ...editingItem,
        name: name.trim(),
        yorubaName: yorubaName.trim() || undefined,
        category,
        price: Number(price),
        description: description.trim(),
        image: imageUrl.trim() || editingItem.image,
        available,
        tags,
      };
      restaurantDB.updateMenuItem(updated);
    } else {
      const created: MenuItem = {
        id: `dish-${Date.now()}`,
        name: name.trim(),
        yorubaName: yorubaName.trim() || undefined,
        category,
        price: Number(price),
        description: description.trim(),
        image: imageUrl.trim() || menu[0]?.image || '',
        calories: 520,
        prepTimeMinutes: 18,
        tags,
        allergens: [],
        available,
      };
      restaurantDB.addMenuItem(created);
    }

    cancelForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this dish from the menu?')) {
      restaurantDB.deleteMenuItem(id);
      if (editingItem?.id === id) cancelForm();
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? menu
    : menu.filter((item) => item.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white border border-[#E8E6DD] rounded-3xl shadow-2xl overflow-hidden my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#FAFAF7] border-b border-[#E8E6DD] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold text-[#121110]">
                Dynamic Culinary Menu & Price Management
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] font-mono font-bold">
                Live Kitchen Sync
              </span>
            </div>
            <p className="text-xs text-[#595852]">
              Instant price modifications, recipe details, and real-time 86/available stock toggling.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8C8A82] hover:text-[#121110] hover:bg-[#F4F3ED] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[75vh] overflow-y-auto">
          
          {/* Left Column: Menu Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              {/* Category Filter */}
              <div className="flex items-center gap-1 p-1 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-xs">
                {(['all', 'appetizers', 'mains', 'desserts', 'drinks'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#14532D] text-white shadow-2xs'
                        : 'text-[#595852] hover:text-[#121110]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={startNew}
                className="px-3 py-1.5 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Dish</span>
              </button>
            </div>

            {/* Dish Rows */}
            <div className="space-y-2.5">
              {filteredItems.map((dish) => (
                <div
                  key={dish.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    editingItem?.id === dish.id
                      ? 'border-[#14532D] bg-[#DCFCE7]/30 ring-1 ring-[#14532D]'
                      : 'border-[#E8E6DD] bg-white hover:bg-[#FAFAF7]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover bg-[#F4F3ED] shrink-0 border border-[#E8E6DD]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-xs font-bold text-[#121110] truncate">
                          {dish.name}
                        </h4>
                        {!dish.available && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono">
                            86'd
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#595852] truncate">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-bold text-[#121110]">
                      ${dish.price.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => startEdit(dish)}
                      className="p-1.5 rounded-lg border border-[#E8E6DD] bg-white hover:bg-[#F4F3ED] text-[#595852] hover:text-[#121110] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(dish.id)}
                      className="p-1.5 rounded-lg border border-[#E8E6DD] bg-white hover:bg-rose-50 text-[#8C8A82] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Edit / Create Form */}
          <div className="lg:col-span-5 bg-[#FAFAF7] rounded-2xl border border-[#E8E6DD] p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DD]">
              <h4 className="font-display text-sm font-bold text-[#121110]">
                {editingItem ? 'Edit Dish & Price' : isAddingNew ? 'Create New Dish' : 'Select a Dish'}
              </h4>
              {(editingItem || isAddingNew) && (
                <button
                  type="button"
                  onClick={cancelForm}
                  className="text-xs text-[#8C8A82] hover:text-[#121110]"
                >
                  Cancel
                </button>
              )}
            </div>

            {editingItem || isAddingNew ? (
              <form onSubmit={handleSave} className="space-y-3.5">
                <div className="space-y-1">
                  <label htmlFor="dish-name" className="font-semibold text-[#121110]">Dish Name *</label>
                  <input
                    id="dish-name"
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="dish-yoruba-name" className="font-semibold text-[#121110]">Yoruba Heritage Subtitle</label>
                  <input
                    id="dish-yoruba-name"
                    type="text"
                    placeholder="e.g. Ọbẹ̀ Ẹ̀fọ́ Rírò àti Ìyán"
                    value={yorubaName}
                    onChange={(e) => setYorubaName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="dish-category" className="font-semibold text-[#121110]">Category</label>
                    <select
                      id="dish-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MenuCategory)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                    >
                      <option value="appetizers">Appetizers</option>
                      <option value="mains">Mains & Swallows</option>
                      <option value="desserts">Desserts</option>
                      <option value="drinks">Drinks & Palm Wine</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="dish-price" className="font-semibold text-[#121110]">Price ($ USD) *</label>
                    <input
                      id="dish-price"
                      required
                      type="number"
                      step="0.5"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-[#E8E6DD] rounded-xl text-[#121110] font-mono focus:outline-none focus:border-[#14532D]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="dish-desc" className="font-semibold text-[#121110]">Culinary Narrative / Description *</label>
                  <textarea
                    id="dish-desc"
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="dish-img" className="font-semibold text-[#121110]">Image URL</label>
                  <input
                    id="dish-img"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                {/* In stock toggle */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="rounded text-[#14532D] focus:ring-[#14532D]"
                  />
                  <span className="font-semibold text-[#121110]">Available Tonight (Not 86'd)</span>
                </label>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {editingItem ? 'Save Updates to Menu' : 'Publish Dish to Live Menu'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-16 text-center text-[#8C8A82] space-y-2">
                <Edit2 className="w-8 h-8 mx-auto text-[#C89B3C]" />
                <p className="font-medium text-[#121110]">No Dish Selected</p>
                <p className="text-[11px]">Click "Edit" on any dish to change prices or toggle availability, or click "Add Dish" to invent a new culinary item.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

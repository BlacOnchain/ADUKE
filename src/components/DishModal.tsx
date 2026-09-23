import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Flame, Sparkles, Clock, Check } from 'lucide-react';
import { MenuItem, CartItem } from '../types/restaurant';

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const DishModal: React.FC<DishModalProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    [groupId: string]: { optionId: string; optionName: string; price: number };
  }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Initialize required options
  useEffect(() => {
    if (item && item.customizationGroups) {
      const initial: { [groupId: string]: { optionId: string; optionName: string; price: number } } = {};
      item.customizationGroups.forEach((group) => {
        if (group.required && group.options.length > 0) {
          initial[group.id] = {
            optionId: group.options[0].id,
            optionName: group.options[0].name,
            price: group.options[0].price,
          };
        }
      });
      setSelectedOptions(initial);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [item]);

  // Options price calculation
  const optionsTotal = Object.values(selectedOptions).reduce((sum, opt) => sum + opt.price, 0);
  const unitPrice = item.price + optionsTotal;
  const totalPrice = unitPrice * quantity;

  const handleSelectOption = (
    groupId: string,
    groupTitle: string,
    optionId: string,
    optionName: string,
    price: number
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: { optionId, optionName, price },
    }));
  };

  const handleToggleAddon = (
    groupId: string,
    optionId: string,
    optionName: string,
    price: number
  ) => {
    setSelectedOptions((prev) => {
      const copy = { ...prev };
      const key = `${groupId}_${optionId}`;
      if (copy[key]) {
        delete copy[key];
      } else {
        copy[key] = { optionId, optionName, price };
      }
      return copy;
    });
  };

  const handleAdd = () => {
    const formattedOptions = Object.entries(selectedOptions).map(([key, opt]) => ({
      groupId: key.split('_')[0],
      groupTitle: '',
      optionId: opt.optionId,
      optionName: opt.optionName,
      price: opt.price,
    }));

    const cartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}`,
      item,
      quantity,
      selectedOptions: formattedOptions,
      specialInstructions: specialInstructions.trim() || undefined,
      unitPrice,
      totalPrice,
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white border border-[#E8E6DD] rounded-3xl overflow-hidden shadow-2xl my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-[#121110] hover:bg-white shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Hero Image */}
        <div className="relative h-64 bg-[#F4F3ED] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#14532D] text-white">
              {item.category.toUpperCase()}
            </span>
            <h2 className="font-display text-2xl font-bold text-white mt-1">
              {item.name}
            </h2>
            {item.yorubaName && (
              <p className="text-xs text-orange-200 italic font-serif">
                {item.yorubaName}
              </p>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Description & Prep Info */}
          <div className="space-y-2">
            <p className="text-xs text-[#595852] leading-relaxed">
              {item.description}
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-[#8C8A82] pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#14532D]" />
                <span>{item.prepTimeMinutes} mins</span>
              </span>
              <span>·</span>
              <span>{item.calories} Calories</span>
              {item.pairing && (
                <>
                  <span>·</span>
                  <span className="text-[#C2410C] font-sans truncate">{item.pairing}</span>
                </>
              )}
            </div>
          </div>

          {/* Customization Options */}
          {item.customizationGroups?.map((group) => (
            <div key={group.id} className="space-y-2 pt-3 border-t border-[#F0EFEB]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#121110] uppercase tracking-wider">
                  {group.title}
                </span>
                <span className="text-[11px] text-[#8C8A82]">
                  {group.required ? 'Required (Choose 1)' : 'Optional'}
                </span>
              </div>

              <div className="space-y-1.5">
                {group.options.map((opt) => {
                  const isChecked = group.required
                    ? selectedOptions[group.id]?.optionId === opt.id
                    : !!selectedOptions[`${group.id}_${opt.id}`];

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        if (group.required) {
                          handleSelectOption(group.id, group.title, opt.id, opt.name, opt.price);
                        } else {
                          handleToggleAddon(group.id, opt.id, opt.name, opt.price);
                        }
                      }}
                      className={`w-full p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'border-[#14532D] bg-[#DCFCE7]/40 text-[#121110] font-semibold'
                          : 'border-[#E8E6DD] bg-white hover:bg-[#FAFAF7] text-[#595852]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-${group.required ? 'full' : 'md'} border flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#14532D] border-[#14532D] text-white'
                              : 'border-[#D8D6CC] bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{opt.name}</span>
                      </div>

                      <span className="font-mono text-[#8C8A82]">
                        {opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Kitchen Special Requests */}
          <div className="space-y-1.5 pt-3 border-t border-[#F0EFEB]">
            <label className="block text-xs font-bold text-[#121110] uppercase tracking-wider">
              Dietary Instructions for the Chef
            </label>
            <input
              type="text"
              placeholder="e.g. Extra yaji pepper on the side, allergic to crustaceans..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-xs text-[#121110] focus:outline-none focus:border-[#14532D]"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#FAFAF7] border-t border-[#E8E6DD] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-white border border-[#E8E6DD] rounded-xl px-2 py-1.5 shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:text-[#14532D] transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs font-bold w-6 text-center tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 hover:text-[#14532D] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Bag CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3.5 px-4 bg-[#14532D] hover:bg-[#0D3823] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-between cursor-pointer"
          >
            <span>Add to Culinary Bag</span>
            <span className="font-mono tabular-nums text-sm font-bold">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

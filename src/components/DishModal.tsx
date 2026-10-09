import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, Clock, Check } from 'lucide-react';
import { MenuItem, CartItem, formatNaira } from '../types/restaurant';

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const DishModal: React.FC<DishModalProps> = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    [groupId: string]: { optionId: string; optionName: string; price: number };
  }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Initialize required options & dialog accessibility
  useEffect(() => {
    if (!item) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (item.customizationGroups) {
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

    // Focus close button or first action
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [item, onClose]);

  if (!item) return null;

  // Options price calculation
  const optionsTotal = Object.values(selectedOptions).reduce((sum, opt) => sum + opt.price, 0);
  const unitPrice = item.price + optionsTotal;
  const totalPrice = unitPrice * quantity;

  const handleSelectOption = (
    groupId: string,
    _groupTitle: string,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
        className="relative w-full max-w-lg bg-surface-pure border border-surface-hairline rounded-3xl overflow-hidden shadow-2xl my-8 text-left animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={`Close ${item.name} details dialog`}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-surface-pure/90 text-ink-primary hover:bg-surface-pure shadow-md transition-colors cursor-pointer"
        >
          <X aria-hidden="true" className="w-5 h-5" />
        </button>

        {/* Dish Hero Image */}
        <div className="relative h-64 bg-surface-muted overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-emerald text-white">
              {item.category.toUpperCase()}
            </span>
            <h2 id="dish-modal-title" className="font-display text-2xl font-bold text-white mt-1">
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
            <p className="text-xs text-ink-secondary leading-relaxed">
              {item.description}
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-ink-muted pt-1">
              <span className="flex items-center gap-1">
                <Clock aria-hidden="true" className="w-3.5 h-3.5 text-brand-emerald" />
                <span>{item.prepTimeMinutes} mins</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{item.calories} Calories</span>
              {item.pairing && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-brand-terracotta font-sans truncate">{item.pairing}</span>
                </>
              )}
            </div>
          </div>

          {/* Customization Options */}
          {item.customizationGroups?.map((group) => (
            <fieldset key={group.id} className="space-y-2 pt-3 border-t border-surface-muted">
              <legend className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-ink-primary uppercase tracking-wider">
                  {group.title}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {group.required ? 'Required (Choose 1)' : 'Optional'}
                </span>
              </legend>

              <div className="space-y-1.5 pt-1">
                {group.options.map((opt) => {
                  const isChecked = group.required
                    ? selectedOptions[group.id]?.optionId === opt.id
                    : !!selectedOptions[`${group.id}_${opt.id}`];

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role={group.required ? 'radio' : 'checkbox'}
                      aria-checked={isChecked}
                      onClick={() => {
                        if (group.required) {
                          handleSelectOption(group.id, group.title, opt.id, opt.name, opt.price);
                        } else {
                          handleToggleAddon(group.id, opt.id, opt.name, opt.price);
                        }
                      }}
                      className={`w-full p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'border-brand-emerald bg-brand-emerald-light/40 text-ink-primary font-semibold'
                          : 'border-surface-hairline bg-surface-pure hover:bg-surface-canvas text-ink-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-${group.required ? 'full' : 'md'} border flex items-center justify-center ${
                            isChecked
                              ? 'bg-brand-emerald border-brand-emerald text-white'
                              : 'border-surface-hairline bg-surface-pure'
                          }`}
                        >
                          {isChecked && <Check aria-hidden="true" className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{opt.name}</span>
                      </div>

                      <span className="font-mono text-ink-muted">
                        {opt.price > 0 ? `+${formatNaira(opt.price)}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {/* Kitchen Special Requests */}
          <div className="space-y-1.5 pt-3 border-t border-surface-muted">
            <label htmlFor="chef-special-notes" className="block text-xs font-bold text-ink-primary uppercase tracking-wider">
              Dietary Instructions for the Chef
            </label>
            <input
              id="chef-special-notes"
              type="text"
              placeholder="e.g. Extra yaji pepper on the side, allergic to crustaceans..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-canvas border border-surface-hairline rounded-xl text-xs text-ink-primary focus:outline-none focus:border-brand-emerald"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-surface-canvas border-t border-surface-hairline flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-surface-pure border border-surface-hairline rounded-xl px-2 py-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label={`Decrease quantity of ${item.name}`}
              className="p-1 hover:text-brand-emerald transition-colors cursor-pointer"
            >
              <Minus aria-hidden="true" className="w-3.5 h-3.5" />
            </button>
            <span aria-label={`Current quantity: ${quantity}`} className="font-mono text-xs font-bold w-6 text-center tabular-nums text-ink-primary">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              aria-label={`Increase quantity of ${item.name}`}
              className="p-1 hover:text-brand-emerald transition-colors cursor-pointer"
            >
              <Plus aria-hidden="true" className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Bag CTA */}
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${quantity} ${item.name} to bag for ${formatNaira(totalPrice)}`}
            className="btn-interactive flex-1 py-3.5 px-4 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-between cursor-pointer"
          >
            <span>Add to Culinary Bag</span>
            <span className="font-mono tabular-nums text-sm font-bold">
              {formatNaira(totalPrice)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

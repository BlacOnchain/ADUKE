import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, X } from 'lucide-react';
import { CustomerReview } from '../types/restaurant';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview?: (review: CustomerReview) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews: initialReviews, onAddReview }) => {
  const [localReviews, setLocalReviews] = useState<CustomerReview[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [dishRecommended, setDishRecommended] = useState('Smoked Firewood Jollof Rice Royale');
  const [diningType, setDiningType] = useState<'Dinner' | 'Lunch' | 'Celebration'>('Dinner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Focus trap, scroll lock, and Escape listener
  useEffect(() => {
    if (!isModalOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables && focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsModalOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const elements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!elements.length) return;

        const first = elements[0];
        const last = elements[elements.length - 1];

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
  }, [isModalOpen]);

  const averageRating = (
    localReviews.reduce((acc, r) => acc + r.rating, 0) / (localReviews.length || 1)
  ).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!author.trim() || !comment.trim() || !title.trim()) {
      setFormError('Please fill in your name, headline, and dining review.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReview: CustomerReview = {
        id: `rev-${Date.now()}`,
        author: author.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim(),
        dishRecommended: dishRecommended.trim(),
        diningType,
        date: 'Today in Victoria Island',
        verified: true,
      };

      setLocalReviews((prev) => [newReview, ...prev]);
      onAddReview?.(newReview);

      setIsSubmitting(false);
      setIsModalOpen(false);
      setAuthor('');
      setTitle('');
      setComment('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 300);
  };

  const handleStarKeyDown = (e: React.KeyboardEvent, star: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setRating(Math.min(5, star + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setRating(Math.max(1, star - 1));
    }
  };

  return (
    <section id="reviews-section" className="py-20 sm:py-28 bg-surface-pure border-t border-surface-hairline text-ink-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-surface-hairline">
          <div className="max-w-xl space-y-3 text-left">
            <p className="text-xs font-bold tracking-widest text-brand-emerald uppercase">
              Guest Testimonials
            </p>
            <h2 
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-ink-primary"
              style={{ textWrap: 'balance' }}
            >
              Memories forged around the hearth table.
            </h2>
            <div className="flex items-center gap-3 text-xs text-ink-secondary pt-1">
              <div aria-label={`Average rating: ${averageRating} out of 5 stars`} className="flex items-center gap-0.5 text-brand-brass">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} aria-hidden="true" className="w-4 h-4 fill-brand-brass text-brand-brass" />
                ))}
              </div>
              <span className="font-mono text-ink-primary font-bold tabular-nums">{averageRating} / 5.0</span>
              <span aria-hidden="true" className="text-ink-muted">·</span>
              <span>Based on {1200 + localReviews.length} dining guests</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Open review modal to share your dining experience"
            className="flex items-center gap-2 px-5 py-3 bg-surface-canvas hover:bg-surface-pure border border-surface-hairline text-ink-primary font-semibold text-xs rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <MessageSquarePlus aria-hidden="true" className="w-4 h-4 text-brand-emerald" />
            <span>Share Your Dining Experience</span>
          </button>
        </div>

        {/* Success Toast Banner */}
        {showSuccessToast && (
          <div role="status" className="mt-6 p-4 rounded-2xl bg-brand-emerald-light border border-brand-emerald/30 text-brand-emerald text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-brand-emerald shrink-0" />
              <span>Thank you! Your dining review and recommendation have been published live to our hearth guestbook.</span>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              aria-label="Dismiss success message"
              className="text-brand-emerald hover:opacity-75 p-1 cursor-pointer"
            >
              <X aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-10 text-left">
          {localReviews.map((rev) => (
            <article
              key={rev.id}
              className="p-6 sm:p-8 rounded-3xl bg-surface-canvas border border-surface-hairline flex flex-col justify-between space-y-5 hover:shadow-xs transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div aria-label={`Rating: ${rev.rating} out of 5 stars`} className="flex items-center gap-1 text-brand-brass">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} aria-hidden="true" className="w-3.5 h-3.5 fill-brand-brass text-brand-brass" />
                    ))}
                  </div>
                  <span className="text-[11px] text-ink-muted font-mono">{rev.date}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-ink-primary leading-snug">
                  "{rev.title}"
                </h3>

                <p className="text-xs text-ink-secondary leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-surface-hairline space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink-primary">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-[11px] text-brand-emerald font-medium flex items-center gap-1">
                      <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 text-brand-emerald" />
                      <span>Verified Guest</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-ink-muted italic">
                  Recommended: {rev.dishRecommended}
                </p>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            className="w-full max-w-lg bg-surface-pure rounded-3xl border border-surface-hairline shadow-2xl p-6 sm:p-8 space-y-6 text-left animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-hairline">
              <div>
                <h3 id="review-modal-title" className="font-display text-xl font-bold text-ink-primary">
                  Share Your Dining Story
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Your feedback is warmly cherished by our culinary crew.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close review dialog"
                className="p-1.5 rounded-xl border border-surface-hairline hover:bg-surface-muted text-ink-muted cursor-pointer"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {formError && (
                <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
                  {formError}
                </div>
              )}

              {/* Star Rating as accessible radiogroup with keyboard arrow navigation */}
              <fieldset className="space-y-1">
                <legend className="block font-semibold text-ink-primary">
                  Overall Hearth Rating: {rating} out of 5 stars
                </legend>
                <div
                  role="radiogroup"
                  aria-label="Star rating out of 5"
                  className="flex items-center gap-2 pt-1"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={rating === star}
                      aria-label={`${star} out of 5 stars`}
                      tabIndex={rating === star ? 0 : -1}
                      onClick={() => setRating(star)}
                      onKeyDown={(e) => handleStarKeyDown(e, star)}
                      className="cursor-pointer p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                    >
                      <Star
                        aria-hidden="true"
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-brand-brass text-brand-brass'
                            : 'text-surface-hairline'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono font-bold text-ink-primary ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </fieldset>

              {/* Headline */}
              <div className="space-y-1">
                <label htmlFor="rev-headline" className="block font-semibold text-ink-primary">
                  Review Headline *
                </label>
                <input
                  id="rev-headline"
                  type="text"
                  required
                  placeholder="e.g. Unforgettable party jollof with bottom-pot crunch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-canvas border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald shadow-2xs"
                />
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label htmlFor="rev-comment" className="block font-semibold text-ink-primary">
                  Your Dining Experience *
                </label>
                <textarea
                  id="rev-comment"
                  required
                  rows={3}
                  placeholder="Tell us about the flavors, atmosphere, and hospitality..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3.5 bg-surface-canvas border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald shadow-2xs resize-none"
                />
              </div>

              {/* Author & Recommended Dish */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="rev-author" className="block font-semibold text-ink-primary">
                    Your Name *
                  </label>
                  <input
                    id="rev-author"
                    type="text"
                    required
                    placeholder="e.g. Adeola Williams"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-canvas border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="rev-recommended" className="block font-semibold text-ink-primary">
                    Dish Recommendation
                  </label>
                  <select
                    id="rev-recommended"
                    value={dishRecommended}
                    onChange={(e) => setDishRecommended(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-canvas border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald shadow-2xs"
                  >
                    <option value="Smoked Firewood Jollof Rice Royale">Smoked Firewood Jollof</option>
                    <option value="Tiger Prawn & Beef Suya Platter">Tiger Prawn & Beef Suya</option>
                    <option value="Slow-Braised Oxtail & Rich Efo Riro">Slow-Braised Oxtail Efo Riro</option>
                    <option value="Whole Wood-Fired Grilled Croaker">Whole Wood-Fired Croaker</option>
                    <option value="The Lagos Chapman Supreme">Lagos Chapman Supreme</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="rev-dining-type" className="block font-semibold text-ink-primary">
                  Sitting Occasion
                </label>
                <select
                  id="rev-dining-type"
                  value={diningType}
                  onChange={(e) => setDiningType(e.target.value as 'Dinner' | 'Lunch' | 'Celebration')}
                  className="w-full px-3.5 py-2.5 bg-surface-canvas border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald shadow-2xs"
                >
                  <option value="Dinner">Dinner Sitting</option>
                  <option value="Lunch">Lunch & Suya Social</option>
                  <option value="Celebration">Milestone Celebration</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-hairline text-ink-secondary hover:bg-surface-canvas font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-interactive px-6 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Dining Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

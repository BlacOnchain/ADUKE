import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, X, AlertCircle, Sparkles } from 'lucide-react';
import { CustomerReview } from '../types/restaurant';
import { restaurantDB } from '../data/db';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
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

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
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
      restaurantDB.addReview({
        author: author.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim(),
        dishRecommended: dishRecommended.trim(),
        diningType,
      });

      setIsSubmitting(false);
      setIsModalOpen(false);
      setAuthor('');
      setTitle('');
      setComment('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 400);
  };

  return (
    <section id="reviews-section" className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E8E6DD] text-[#121110]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-[#E8E6DD]">
          <div className="max-w-xl space-y-3 text-left">
            <p className="text-xs font-bold tracking-widest text-[#14532D] uppercase">
              Guest Testimonials
            </p>
            <h2 
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#121110]"
              style={{ textWrap: 'balance' }}
            >
              Memories forged around the hearth table.
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#595852] pt-1">
              <div className="flex items-center gap-0.5 text-[#C89B3C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C89B3C]" />
                ))}
              </div>
              <span className="font-mono text-[#121110] font-bold tabular-nums">{averageRating} / 5.0</span>
              <span aria-hidden="true" className="text-[#8C8A82]">·</span>
              <span>Based on {1200 + reviews.length} verified dining guests</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#FAFAF7] hover:bg-white border border-[#E8E6DD] text-[#121110] font-semibold text-xs rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#14532D]" />
            <span>Share Your Dining Experience</span>
          </button>
        </div>

        {/* Success Toast Banner */}
        {showSuccessToast && (
          <div className="mb-6 p-4 rounded-2xl bg-[#DCFCE7] border border-emerald-300 text-[#14532D] text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#14532D]" />
              <span>Thank you! Your dining review and recommendation have been published live to our hearth guestbook.</span>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="text-[#14532D] hover:opacity-75 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Reviews Grid — Airy, Non-AI-Boxed Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-left">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="p-8 rounded-3xl bg-[#FAFAF7] border border-[#E8E6DD] flex flex-col justify-between space-y-6 hover:shadow-xs transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C89B3C]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C89B3C]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8C8A82] font-mono">{rev.date}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-[#121110] leading-snug">
                  "{rev.title}"
                </h3>

                <p className="text-xs text-[#595852] leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E6DD] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#121110]">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-[11px] text-[#14532D] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#14532D]" />
                      <span>Verified Guest</span>
                    </span>
                  )}
                </div>
                {rev.dishRecommended && (
                  <p className="text-[11px] text-[#C2410C] font-medium">
                    Favorite: {rev.dishRecommended}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl p-8 space-y-6 text-left shadow-2xl border border-[#E8E6DD]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DD]">
              <h3 className="font-display text-xl font-bold text-[#121110]">
                Share Your Dining Experience
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8C8A82] hover:text-[#121110] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="block text-[#121110] font-semibold">Your Overall Rating</label>
                <div className="flex items-center gap-1 text-[#C89B3C]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${s <= rating ? 'fill-[#C89B3C]' : 'text-[#E8E6DD]'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="modal-rev-name" className="block text-[#121110] font-medium">Your Name *</label>
                  <input
                    id="modal-rev-name"
                    required
                    type="text"
                    placeholder="e.g. Nkemdilim Okafor"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="modal-rev-service" className="block text-[#121110] font-medium">Dining Service</label>
                  <select
                    id="modal-rev-service"
                    value={diningType}
                    onChange={(e) => setDiningType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  >
                    <option value="Dinner">Dinner</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Celebration">Celebration / Party</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-rev-headline" className="block text-[#121110] font-medium">Review Headline *</label>
                <input
                  id="modal-rev-headline"
                  required
                  type="text"
                  placeholder="e.g. Unbelievable firewood jollof flavor!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-rev-dish" className="block text-[#121110] font-medium">Dish You Loved Most</label>
                <input
                  id="modal-rev-dish"
                  type="text"
                  placeholder="e.g. Tiger Prawn Suya or Seafood Okra"
                  value={dishRecommended}
                  onChange={(e) => setDishRecommended(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-rev-comment" className="block text-[#121110] font-medium">Detailed Feedback *</label>
                <textarea
                  id="modal-rev-comment"
                  required
                  rows={3}
                  placeholder="Share details regarding flavor, service, table atmosphere..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                {isSubmitting ? 'Publishing...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

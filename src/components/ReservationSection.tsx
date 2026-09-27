import React, { useState } from 'react';
import { Clock, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { SeatingArea, TableReservation } from '../types/restaurant';
import confetti from 'canvas-confetti';

interface ReservationSectionProps {
  seatingAreas: SeatingArea[];
  preSelectedAreaId?: string;
  onReservationComplete?: (res: TableReservation) => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  seatingAreas,
  preSelectedAreaId = 'eko-grand',
  onReservationComplete,
}) => {
  // Form State
  const [selectedAreaId, setSelectedAreaId] = useState(preSelectedAreaId);
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [partySize, setPartySize] = useState<number>(2);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('7:30 PM');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [occasion, setOccasion] = useState('Dinner Service');
  const [specialRequests, setSpecialRequests] = useState('');

  // Submission & Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Available Sitting Times
  const timeSlots = ['5:30 PM', '6:15 PM', '7:00 PM', '7:45 PM', '8:30 PM', '9:15 PM', '10:00 PM'];

  // Current selected seating area
  const selectedArea = seatingAreas.find((a) => a.id === selectedAreaId) || seatingAreas[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setBookingError('Please enter your full name, email address, and phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const bookingCode = `ADK-${Math.floor(1000 + Math.random() * 9000)}`;
      const reservation: TableReservation = {
        id: `res-${Date.now()}`,
        bookingCode,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        partySize,
        date,
        timeSlot: selectedTimeSlot,
        seatingAreaId: selectedArea.id,
        seatingAreaName: selectedArea.name,
        specialRequests: specialRequests.trim() || undefined,
        occasion,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setIsSubmitting(false);
      setConfirmedReservation(reservation);
      onReservationComplete?.(reservation);

      // Confetti burst
      try {
        confetti({
          particleCount: 65,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#14532D', '#C2410C', '#C89B3C'],
        });
      } catch {
        // ignore
      }
    }, 400);
  };

  const handleBookAnother = () => {
    setConfirmedReservation(null);
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
    setSpecialRequests('');
  };

  return (
    <section id="reservation-section" className="py-12 sm:py-24 bg-surface-canvas text-ink-primary border-t border-surface-hairline">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-brand-emerald">
            <span className="w-2 h-2 rounded-full bg-brand-emerald" />
            <span>Table Reservations</span>
          </div>
          <h2 
            className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink-primary"
            style={{ textWrap: 'balance' }}
          >
            Book your table with us.
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary font-normal leading-relaxed">
            Reserve your table in seconds and we'll have your spot and warm hospitality ready when you arrive.
          </p>
        </div>

        {/* Successful Digital Reservation Pass View */}
        {confirmedReservation ? (
          <div className="max-w-xl mx-auto bg-surface-pure rounded-2xl sm:rounded-3xl border border-surface-hairline shadow-lg overflow-hidden text-left animate-fadeIn">
            
            {/* Top Pass Header */}
            <div className="p-6 sm:p-8 bg-brand-emerald text-white space-y-2 sm:space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-emerald-light font-bold">
                    Reservation Confirmed
                  </span>
                </div>
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wider bg-black/20 px-2.5 py-1 rounded-lg">
                  {confirmedReservation.bookingCode}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Àdùkẹ́ Gastronomy
              </h3>

              <p className="text-xs text-emerald-100">
                14 Adeola Odeku Street, Victoria Island · Lagos State, Nigeria
              </p>
            </div>

            {/* Pass Body Content */}
            <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-surface-hairline text-xs">
                <div>
                  <span className="text-ink-muted block text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">Guest Name</span>
                  <span className="font-bold text-sm text-ink-primary mt-0.5 block truncate">{confirmedReservation.guestName}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">Party Size</span>
                  <span className="font-mono font-bold text-sm text-ink-primary mt-0.5 block">{confirmedReservation.partySize} Guests</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">Date & Sitting</span>
                  <span className="font-mono font-bold text-sm text-brand-emerald mt-0.5 block">
                    {confirmedReservation.date} · {confirmedReservation.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">Seating Area</span>
                  <span className="font-bold text-sm text-ink-primary mt-0.5 block truncate">{confirmedReservation.seatingAreaName}</span>
                </div>
              </div>

              {confirmedReservation.specialRequests && (
                <div className="text-xs space-y-1 bg-surface-canvas p-3.5 rounded-xl border border-surface-hairline">
                  <span className="font-semibold text-ink-primary">Kitchen & Allergen Notes:</span>
                  <p className="text-ink-secondary italic">{confirmedReservation.specialRequests}</p>
                </div>
              )}

              <div className="flex items-center gap-2.5 text-xs text-ink-secondary">
                <ShieldCheck className="w-4 h-4 text-brand-emerald shrink-0" />
                <span>
                  Tables held for 15 mins. Free valet parking on Adeola Odeku.
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 text-xs font-semibold text-ink-primary bg-surface-canvas hover:bg-surface-muted border border-surface-hairline rounded-xl transition-colors cursor-pointer text-center"
                >
                  Print / Save Pass
                </button>

                <button
                  type="button"
                  onClick={handleBookAnother}
                  className="px-5 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer text-center"
                >
                  Make Another Reservation
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Mobile-Optimized Sleek Rectangular Booking Container */
          <form
            onSubmit={handleBookingSubmit}
            className="bg-surface-pure rounded-2xl sm:rounded-3xl border border-surface-hairline shadow-sm p-4 sm:p-8 lg:p-10 space-y-7 sm:space-y-9 text-left"
          >
            {/* Step 1: Seating Area Selection */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-display text-base sm:text-xl font-bold text-ink-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-emerald text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>Choose Seating Area</span>
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5 ml-7">
                  Select where you'd like your table prepared.
                </p>
              </div>

              {/* Responsive Rectangular Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {seatingAreas.map((area) => {
                  const isSelected = selectedAreaId === area.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setSelectedAreaId(area.id)}
                      className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer flex flex-row sm:flex-col justify-between items-center sm:items-start gap-3 ${
                        isSelected
                          ? 'border-brand-emerald bg-brand-emerald-light/40 ring-1 ring-brand-emerald shadow-2xs'
                          : 'border-surface-hairline bg-surface-canvas hover:bg-surface-pure hover:border-brand-emerald/30'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-brand-emerald font-bold">
                          {area.capacity}
                        </span>
                        <h4 className="font-display text-sm font-bold text-ink-primary truncate">
                          {area.name}
                        </h4>
                        <p className="text-[11px] text-ink-secondary line-clamp-1 sm:line-clamp-2">
                          {area.description}
                        </p>
                      </div>

                      <div className="shrink-0 flex sm:w-full sm:pt-2 sm:mt-1 sm:border-t sm:border-surface-hairline items-center justify-end sm:justify-between text-[11px] font-mono">
                        <span className="hidden sm:inline text-ink-muted">
                          {area.totalTables} tables
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-brand-emerald text-white'
                              : 'border border-surface-hairline bg-surface-pure'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date, Party Size & Time Slots */}
            <div className="space-y-4 sm:space-y-5 pt-5 sm:pt-7 border-t border-surface-hairline">
              <div>
                <h3 className="font-display text-base sm:text-xl font-bold text-ink-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-emerald text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>Date, Time & Number of Guests</span>
                </h3>
              </div>

              {/* Date, Guests, Occasion Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
                {/* Date Picker */}
                <div className="space-y-1">
                  <label htmlFor="res-date" className="block font-semibold text-ink-primary text-xs">
                    Date *
                  </label>
                  <input
                    id="res-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-pure border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald font-mono text-xs cursor-pointer shadow-2xs"
                    required
                  />
                </div>

                {/* Party Size */}
                <div className="space-y-1">
                  <label htmlFor="res-party-size" className="block font-semibold text-ink-primary text-xs">
                    Number of Guests *
                  </label>
                  <select
                    id="res-party-size"
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full h-11 px-3.5 bg-surface-pure border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald font-mono text-xs cursor-pointer shadow-2xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Occasion */}
                <div className="space-y-1">
                  <label htmlFor="res-occasion" className="block font-semibold text-ink-primary text-xs">
                    Occasion
                  </label>
                  <select
                    id="res-occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-pure border border-surface-hairline rounded-xl text-ink-primary focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-xs cursor-pointer shadow-2xs"
                  >
                    <option value="Dinner Service">Dinner</option>
                    <option value="Birthday Celebration">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Business Executive">Business Meal</option>
                    <option value="Family Gathering">Family & Friends</option>
                  </select>
                </div>
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink-primary">
                    Select Sitting Time
                  </span>
                  <span className="text-[11px] text-ink-secondary">
                    Available slots for {date}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTimeSlot === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`py-2 px-1.5 sm:py-2.5 sm:px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[44px] ${
                          isSelected
                            ? 'border-brand-emerald bg-brand-emerald text-white shadow-xs'
                            : 'border-surface-hairline bg-surface-pure hover:bg-surface-muted text-ink-primary shadow-2xs'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold leading-tight block">
                          {time}
                        </span>
                        <span className={`text-[9px] sm:text-[10px] block font-mono mt-0.5 ${
                          isSelected ? 'text-brand-emerald-light' : 'text-brand-emerald'
                        }`}>
                          Available
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Guest Contact & Dietary Requests */}
            <div className="space-y-4 pt-5 sm:pt-7 border-t border-surface-hairline">
              <div>
                <h3 className="font-display text-base sm:text-xl font-bold text-ink-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-emerald text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>Primary Guest Details</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
                <div className="space-y-1">
                  <label htmlFor="res-guest-name" className="block font-semibold text-ink-primary text-xs">
                    Full Name *
                  </label>
                  <input
                    id="res-guest-name"
                    required
                    type="text"
                    placeholder="e.g. Oluwaseun Adeleke"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-pure border border-surface-hairline rounded-xl text-ink-primary text-xs focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="res-guest-phone" className="block font-semibold text-ink-primary text-xs">
                    Mobile Phone *
                  </label>
                  <input
                    id="res-guest-phone"
                    required
                    type="tel"
                    placeholder="+234 803 123 4567"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-pure border border-surface-hairline rounded-xl text-ink-primary text-xs focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="res-guest-email" className="block font-semibold text-ink-primary text-xs">
                    Email Confirmation *
                  </label>
                  <input
                    id="res-guest-email"
                    required
                    type="email"
                    placeholder="guest@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-pure border border-surface-hairline rounded-xl text-ink-primary text-xs focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label htmlFor="res-notes" className="block font-semibold text-ink-primary text-xs">
                  Dietary Restrictions or Special Requests (Optional)
                </label>
                <textarea
                  id="res-notes"
                  rows={2}
                  placeholder="e.g., Shellfish allergy, birthday celebration, quiet banquette preferred..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full p-3 bg-surface-pure border border-surface-hairline rounded-xl text-ink-primary text-xs focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald shadow-2xs resize-none"
                />
              </div>
            </div>

            {bookingError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <span>{bookingError}</span>
              </div>
            )}

            {/* Submit Action Bar */}
            <div className="pt-4 sm:pt-6 border-t border-surface-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="text-xs text-ink-secondary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-emerald shrink-0" />
                <span>No cancellation fee when modified 4+ hours prior.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-interactive w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-50 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>{isSubmitting ? 'Confirming Reservation...' : 'Confirm Table Reservation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};

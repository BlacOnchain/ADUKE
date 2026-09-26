import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { SeatingArea, TableReservation } from '../types/restaurant';
import { restaurantDB } from '../data/db';
import confetti from 'canvas-confetti';

interface ReservationSectionProps {
  seatingAreas: SeatingArea[];
  preSelectedAreaId?: string;
  onReservationComplete?: (res: TableReservation) => void;
  onViewDiagram?: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  seatingAreas,
  preSelectedAreaId = 'eko-grand',
  onReservationComplete,
  onViewDiagram,
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
  const selectedArea = useMemo(
    () => seatingAreas.find((a) => a.id === selectedAreaId) || seatingAreas[0],
    [seatingAreas, selectedAreaId]
  );

  // Check real-time slot availability (Double-booking prevention)
  const slotAvailability = useMemo(() => {
    return timeSlots.map((time) => {
      const avail = restaurantDB.checkSlotAvailability(date, time, selectedAreaId);
      return {
        time,
        available: avail.available,
        remainingTables: avail.remainingTables,
      };
    });
  }, [selectedAreaId, date, timeSlots]);

  const currentSlotStatus = slotAvailability.find((s) => s.time === selectedTimeSlot);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setBookingError('Please enter your full name, email address, and phone number.');
      return;
    }

    // Validate double booking again before inserting
    const check = restaurantDB.checkSlotAvailability(date, selectedTimeSlot, selectedAreaId);
    if (!check.available) {
      setBookingError(`Apologies, ${selectedArea.name} is fully booked at ${selectedTimeSlot}. Please select another time or atmosphere.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const result = restaurantDB.createReservation({
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
        });

        setIsSubmitting(false);

        if (result.success && result.reservation) {
          setConfirmedReservation(result.reservation);
          if (onReservationComplete) onReservationComplete(result.reservation);

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
        } else {
          setBookingError(result.error || 'Could not complete reservation.');
        }
      } catch (err: any) {
        setIsSubmitting(false);
        setBookingError(err.message || 'An error occurred reserving your table.');
      }
    }, 600);
  };

  const handleBookAnother = () => {
    setConfirmedReservation(null);
    setGuestName('');
    setGuestPhone('');
    setSpecialRequests('');
  };

  return (
    <section id="reservation-section" className="py-24 sm:py-32 bg-[#FAFAF7] text-[#121110] border-t border-[#E8E6DD]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#14532D]">
            <span className="w-2 h-2 rounded-full bg-[#14532D]" />
            <span>Table Reservations</span>
          </div>
          <h2 
            className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121110]"
            style={{ textWrap: 'balance' }}
          >
            Book your table with us.
          </h2>
          <p className="text-xs sm:text-base text-[#595852] font-normal leading-relaxed">
            Reserve your table in seconds and we'll have your spot and warm hospitality ready when you arrive.
          </p>
        </div>

        {/* Successful Digital Reservation Pass View */}
        {confirmedReservation ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#E8E6DD] shadow-[0_20px_50px_rgba(18,17,16,0.06)] overflow-hidden text-left animate-in fade-in zoom-in-95 duration-400">
            
            {/* Top Pass Header */}
            <div className="p-8 bg-[#14532D] text-white space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#DCFCE7] font-bold">
                    Reservation Confirmed
                  </span>
                </div>
                <span className="font-mono text-sm font-bold tracking-wider bg-black/20 px-3 py-1 rounded-lg">
                  {confirmedReservation.bookingCode}
                </span>
              </div>

              <h3 className="font-display text-3xl font-bold text-white">
                Àdùkẹ́ Gastronomy
              </h3>

              <p className="text-xs text-emerald-100">
                14 Adeola Odeku Street, Victoria Island · Lagos State, Nigeria
              </p>
            </div>

            {/* Pass Body Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-[#E8E6DD] text-xs">
                <div>
                  <span className="text-[#8C8A82] block text-[11px] uppercase tracking-wider font-medium">Guest Name</span>
                  <span className="font-bold text-sm text-[#121110] mt-0.5 block">{confirmedReservation.guestName}</span>
                </div>
                <div>
                  <span className="text-[#8C8A82] block text-[11px] uppercase tracking-wider font-medium">Party Size</span>
                  <span className="font-mono font-bold text-sm text-[#121110] mt-0.5 block">{confirmedReservation.partySize} Guests</span>
                </div>
                <div>
                  <span className="text-[#8C8A82] block text-[11px] uppercase tracking-wider font-medium">Date & Sitting</span>
                  <span className="font-mono font-bold text-sm text-[#14532D] mt-0.5 block">
                    {confirmedReservation.date} · {confirmedReservation.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C8A82] block text-[11px] uppercase tracking-wider font-medium">Seating Pavilion</span>
                  <span className="font-bold text-sm text-[#121110] mt-0.5 block">{confirmedReservation.seatingAreaName}</span>
                </div>
              </div>

              {confirmedReservation.specialRequests && (
                <div className="text-xs space-y-1 bg-[#FAFAF7] p-4 rounded-xl border border-[#E8E6DD]">
                  <span className="font-semibold text-[#121110]">Kitchen & Allergen Notes:</span>
                  <p className="text-[#595852] italic">{confirmedReservation.specialRequests}</p>
                </div>
              )}

              <div className="flex items-center gap-3 text-xs text-[#595852] pt-2">
                <ShieldCheck className="w-4 h-4 text-[#14532D] shrink-0" />
                <span>
                  Tables are held for 15 minutes past reservation time. Executive valet service welcomes you at the Adeola Odeku entrance.
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 text-xs font-semibold text-[#121110] bg-[#FAFAF7] hover:bg-[#F4F3ED] border border-[#E8E6DD] rounded-xl transition-colors cursor-pointer"
                >
                  Print / Save Pass
                </button>

                <button
                  type="button"
                  onClick={handleBookAnother}
                  className="px-5 py-2.5 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Make Another Reservation
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Human-Crafted Concierge Booking Form — No Nested AI Box Clutter */
          <form
            onSubmit={handleBookingSubmit}
            className="bg-white rounded-3xl border border-[#E8E6DD] shadow-[0_16px_40px_rgba(18,17,16,0.04)] p-8 sm:p-12 space-y-10 text-left"
          >
            {/* Step 1: Seating Area Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#121110]">
                    1. Choose Seating Area
                  </h3>
                  <p className="text-xs text-[#595852] mt-0.5">
                    Select where you'd like your table set.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {seatingAreas.map((area) => {
                  const isSelected = selectedAreaId === area.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setSelectedAreaId(area.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#14532D] bg-[#DCFCE7]/40 ring-1 ring-[#14532D]'
                          : 'border-[#E8E6DD] bg-[#FAFAF7] hover:bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8A82]">
                          {area.capacity}
                        </span>
                        <h4 className="font-display text-sm font-bold text-[#121110]">
                          {area.name}
                        </h4>
                        <p className="text-xs text-[#595852] line-clamp-2">
                          {area.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#E8E6DD]/60 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#14532D] font-bold">{area.totalTables} tables</span>
                        {isSelected && <span className="text-[#14532D] font-bold">✓ Selected</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date, Party Size & Sittings */}
            <div className="space-y-6 pt-6 border-t border-[#E8E6DD]">
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#121110]">
                2. Date, Time & Number of Guests
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Date Picker */}
                <div className="space-y-1.5">
                  <label htmlFor="res-date" className="block font-semibold text-[#121110]">
                    Date *
                  </label>
                  <div className="relative">
                    <input
                      id="res-date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D] font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Party Size */}
                <div className="space-y-1.5">
                  <label htmlFor="res-party-size" className="block font-semibold text-[#121110]">
                    Number of Guests *
                  </label>
                  <select
                    id="res-party-size"
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D] font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Occasion */}
                <div className="space-y-1.5">
                  <label htmlFor="res-occasion" className="block font-semibold text-[#121110]">
                    Occasion
                  </label>
                  <select
                    id="res-occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
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
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#121110]">
                  Select Time
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {slotAvailability.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    const isSoldOut = !slot.available;

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#14532D] bg-[#14532D] text-white shadow-xs'
                            : isSoldOut
                            ? 'border-[#E8E6DD] bg-[#F4F3ED] text-[#A8A69E] cursor-not-allowed opacity-50'
                            : 'border-[#E8E6DD] bg-[#FAFAF7] hover:bg-white text-[#121110]'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold block">{slot.time}</span>
                        <span className={`text-[10px] block mt-1 font-mono ${
                          isSelected ? 'text-[#DCFCE7]' : isSoldOut ? 'text-[#A8A69E]' : 'text-[#14532D]'
                        }`}>
                          {isSoldOut ? 'Full' : `${slot.remainingTables} left`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Guest Contact & Dietary Requests */}
            <div className="space-y-4 pt-6 border-t border-[#E8E6DD]">
              <h3 className="font-display text-xl font-bold text-[#121110]">
                3. Primary Guest Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label htmlFor="res-guest-name" className="block font-semibold text-[#121110]">Full Name *</label>
                  <input
                    id="res-guest-name"
                    required
                    type="text"
                    placeholder="e.g. Oluwaseun Adeleke"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="res-guest-phone" className="block font-semibold text-[#121110]">Nigerian / International Mobile *</label>
                  <input
                    id="res-guest-phone"
                    required
                    type="tel"
                    placeholder="+234 803 123 4567"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="res-guest-email" className="block font-semibold text-[#121110]">Email Confirmation *</label>
                  <input
                    id="res-guest-email"
                    required
                    type="email"
                    placeholder="guest@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label htmlFor="res-notes" className="block font-semibold text-[#121110]">
                  Dietary Restrictions, Allergens or Seating Requests (Optional)
                </label>
                <textarea
                  id="res-notes"
                  rows={2}
                  placeholder="e.g., Shellfish allergy, birthday dessert sparkler, quiet banquette preferred..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAFAF7] border border-[#E8E6DD] rounded-xl text-[#121110] focus:outline-none focus:border-[#14532D]"
                />
              </div>
            </div>

            {/* Error Message */}
            {bookingError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Submit Action Bar */}
            <div className="pt-6 border-t border-[#E8E6DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-[#595852] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#14532D]" />
                <span>No cancellation fee when modified 4+ hours prior.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !currentSlotStatus?.available}
                className="px-8 py-3.5 bg-[#14532D] hover:bg-[#0D3823] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Confirming with Host Stand...' : 'Confirm Table Reservation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};

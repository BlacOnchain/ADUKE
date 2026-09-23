import React, { useState } from 'react';
import { MapPin, Navigation, Car, Compass, ExternalLink, Clock, Sparkles, LocateFixed, ShieldAlert, Phone } from 'lucide-react';

export const GoogleMapsAgent: React.FC = () => {
  const [transitMode, setTransitMode] = useState<'driving' | 'ride' | 'walking'>('driving');
  const [origin, setOrigin] = useState('Ikoyi / Bourdillon');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Àdùkẹ́ Lagos Coordinates (Victoria Island)
  const RESTAURANT_COORDS = { lat: 6.4281, lng: 3.4219, address: '14 Adeola Odeku St, Victoria Island, Lagos, Nigeria' };

  // Calculate distance between two coordinates in km (Haversine Formula)
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const dist = calculateDistanceKm(latitude, longitude, RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng);
        setUserLocation({
          lat: latitude,
          lng: longitude,
          address: `Your Current Location (${dist < 100 ? `${dist.toFixed(1)} km away` : 'Global Device GPS'})`,
        });
        setOrigin('Your Live GPS Location');
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        setGeoError('Location permission denied or unavailable. You can still pick a popular Lagos district below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Lagos Transit Route Presets
  const lagosOrigins: { [key: string]: { driving: { time: string; dist: string; route: string }; ride: { time: string; dist: string; route: string }; walking: { time: string; dist: string; route: string } } } = {
    'Ikoyi / Bourdillon': {
      driving: { time: '12 mins', dist: '4.8 km', route: 'Via Falomo Bridge & Akin Adesola' },
      ride: { time: '14 mins', dist: '4.8 km', route: 'Uber/Bolt Premier drop-off at entrance canopy' },
      walking: { time: '55 mins', dist: '4.5 km', route: 'Scenic walk across Falomo & Victoria Island' },
    },
    'Lekki Phase 1': {
      driving: { time: '18 mins', dist: '7.2 km', route: 'Via Lekki-Ikoyi Link Bridge & Ozumba Mbadiwe' },
      ride: { time: '20 mins', dist: '7.2 km', route: 'Dedicated chauffeured valet curbside' },
      walking: { time: '1 hr 30 mins', dist: '7.0 km', route: 'Pedestrian walkway on Link Bridge' },
    },
    'Eko Atlantic': {
      driving: { time: '8 mins', dist: '2.5 km', route: 'Straight down Ahmadu Bello Way to Adeola Odeku' },
      ride: { time: '9 mins', dist: '2.5 km', route: 'Direct coastal boulevard transit' },
      walking: { time: '28 mins', dist: '2.4 km', route: 'Short walk through Victoria Island business district' },
    },
    'Ikeja GRA (Mainland)': {
      driving: { time: '38 mins', dist: '24 km', route: 'Via Third Mainland Bridge & Ring Road' },
      ride: { time: '45 mins', dist: '24 km', route: 'Island express highway transfer' },
      walking: { time: '4 hrs 45 mins', dist: '23 km', route: 'Not recommended for walking' },
    },
    'Your Live GPS Location': {
      driving: {
        time: userLocation ? `${Math.max(10, Math.round(calculateDistanceKm(userLocation.lat, userLocation.lng, RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng) * 2.8))} mins` : '18 mins',
        dist: userLocation ? `${calculateDistanceKm(userLocation.lat, userLocation.lng, RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng).toFixed(1)} km` : '5.2 km',
        route: 'Real-time GPS route to 14 Adeola Odeku St, Victoria Island',
      },
      ride: {
        time: userLocation ? `${Math.max(12, Math.round(calculateDistanceKm(userLocation.lat, userLocation.lng, RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng) * 3))} mins` : '20 mins',
        dist: userLocation ? `${calculateDistanceKm(userLocation.lat, userLocation.lng, RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng).toFixed(1)} km` : '5.2 km',
        route: 'Chauffeured dispatch with VIP valet greeting',
      },
      walking: {
        time: userLocation ? `${Math.round(calculateDistanceKm(userLocation.lat, userLocation.lng, RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng) * 14)} mins` : '45 mins',
        dist: userLocation ? `${calculateDistanceKm(userLocation.lat, userLocation.lng, RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng).toFixed(1)} km` : '5.2 km',
        route: 'Direct pedestrian transit to Victoria Island',
      },
    },
  };

  const selectedEstimate = (lagosOrigins[origin] || lagosOrigins['Ikoyi / Bourdillon'])[transitMode];

  return (
    <section id="location-section" className="py-20 sm:py-28 bg-[#FFFFFF] text-[#121110] border-t border-[#E8E6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 text-left mb-12">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#14532D]">
            <MapPin className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Victoria Island Lagos Flagship</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C2410C]">GPS Location & Concierge Transit</span>
          </div>
          <h2 
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#121110]"
            style={{ textWrap: 'balance' }}
          >
            14 Adeola Odeku Street, Victoria Island, Lagos.
          </h2>
          <p className="text-sm sm:text-base text-[#595852] font-normal leading-relaxed">
            Situated in the heartbeat of Victoria Island near Ahmadu Bello Way and Falomo Bridge. Complimentary executive valet greeting and guarded courtyard parking available.
          </p>
        </div>

        {/* 2-Column Split: Transit Planner & Interactive Nigerian Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Lagos Transit Planner */}
          <div className="lg:col-span-5 bg-[#FAFAF7] rounded-3xl border border-[#E8E6DD] p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left shadow-xs">
            
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8A82]">Destination Landmark</span>
                <h3 className="font-display text-2xl font-bold text-[#121110]">
                  Àdùkẹ́ Gastronomy Lagos
                </h3>
                <p className="text-xs text-[#595852]">
                  14 Adeola Odeku St, Victoria Island 106104, Lagos State, Nigeria
                </p>
                <div className="flex items-center gap-2 text-xs text-[#14532D] font-mono pt-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>+234 1 460 8910 · +234 803 555 1204</span>
                </div>
              </div>

              {/* Geolocation Button */}
              <div className="pt-2 border-t border-[#E8E6DD]">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={geoLoading}
                  className="w-full py-3 px-4 bg-white hover:bg-[#DCFCE7]/60 border border-[#14532D]/30 text-[#14532D] font-bold text-xs rounded-2xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LocateFixed className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
                  <span>{geoLoading ? 'Requesting GPS Location...' : 'Use My Exact Location for Distance & Route'}</span>
                </button>
                {geoError && (
                  <p className="text-[11px] text-[#9A3412] mt-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{geoError}</span>
                  </p>
                )}
              </div>

              {/* Transit Mode Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#121110]">
                  Travel Mode in Lagos
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-white border border-[#E8E6DD] rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setTransitMode('driving')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      transitMode === 'driving'
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'text-[#595852] hover:text-[#121110]'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Self Drive</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransitMode('ride')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      transitMode === 'ride'
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'text-[#595852] hover:text-[#121110]'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Uber / Valet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransitMode('walking')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      transitMode === 'walking'
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'text-[#595852] hover:text-[#121110]'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Walk</span>
                  </button>
                </div>
              </div>

              {/* Origin Quick Pick */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold uppercase tracking-wider text-[#121110]">
                  Lagos Departure District
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Ikoyi / Bourdillon', 'Lekki Phase 1', 'Eko Atlantic', 'Ikeja GRA (Mainland)'].map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setOrigin(loc)}
                      className={`px-3 py-1 rounded-xl text-xs transition-all cursor-pointer ${
                        origin === loc
                          ? 'bg-[#DCFCE7] text-[#14532D] font-bold ring-1 ring-[#14532D]'
                          : 'bg-white text-[#595852] border border-[#E8E6DD] hover:text-[#121110]'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Transit Calculation Result */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E6DD] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#595852] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#14532D]" />
                    <span>Estimated Journey Time</span>
                  </span>
                  <span className="font-mono text-base font-bold text-[#14532D]">
                    {selectedEstimate.time}
                  </span>
                </div>

                <div className="text-xs text-[#595852] pt-2 border-t border-[#F0EFEB] space-y-1">
                  <p className="font-semibold text-[#121110]">{selectedEstimate.route}</p>
                  <p className="text-[11px] text-[#8C8A82]">Distance from {origin}: {selectedEstimate.dist}</p>
                </div>
              </div>

            </div>

            {/* Google Maps External Routing Trigger */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Adeola+Odeku+Street+Victoria+Island+Lagos+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#121110] hover:bg-[#282725] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open in Google Maps Lagos</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

          </div>

          {/* Right: Embedded Interactive Nigerian Map */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#E8E6DD] bg-[#FAFAF7] relative min-h-[460px] flex flex-col">
            <iframe
              title="Àdùkẹ́ Modern Nigerian Gastronomy Lagos Map"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '440px', flex: 1 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Adeola+Odeku+Street+Victoria+Island+Lagos+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />

            {/* Overlay Banner */}
            <div className="p-4 bg-white/95 backdrop-blur-md border-t border-[#E8E6DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#14532D] animate-ping" />
                <span className="font-medium text-[#121110]">
                  14 Adeola Odeku St · Guarded Courtyard Valet Ready
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#8C8A82]">
                6.4281° N, 3.4219° E
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

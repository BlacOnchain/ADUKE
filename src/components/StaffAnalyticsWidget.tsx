import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Utensils,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Flame,
  Download,
  Filter,
  Users,
  Sparkles,
} from 'lucide-react';
import { formatNaira, RestaurantOrder, MenuItem } from '../types/restaurant';

interface StaffAnalyticsWidgetProps {
  orders: RestaurantOrder[];
  menu: MenuItem[];
}

export const StaffAnalyticsWidget: React.FC<StaffAnalyticsWidgetProps> = ({ orders, menu }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'today'>('week');
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders'>('revenue');

  // 1. Daily Revenue Growth Data (Monday - Sunday in Naira)
  const revenueTrendData = useMemo(() => {
    return [
      { day: 'Mon', revenue: 1850000, target: 1600000, orders: 42 },
      { day: 'Tue', revenue: 2240000, target: 2000000, orders: 56 },
      { day: 'Wed', revenue: 2680000, target: 2200000, orders: 68 },
      { day: 'Thu', revenue: 3120000, target: 2800000, orders: 79 },
      { day: 'Fri', revenue: 4450000, target: 3800000, orders: 114 },
      { day: 'Sat', revenue: 5280000, target: 4500000, orders: 138 },
      { day: 'Sun (Today)', revenue: 3485000, target: 3200000, orders: 92 },
    ];
  }, []);

  // 2. Peak Ordering Hours Data (12:00 PM to 11:00 PM)
  const peakHoursData = useMemo(() => {
    return [
      { hour: '12 PM', orders: 18, dineIn: 12, delivery: 6, tag: 'Lunch Open' },
      { hour: '1 PM', orders: 44, dineIn: 28, delivery: 16, tag: 'Suya Rush' },
      { hour: '2 PM', orders: 36, dineIn: 22, delivery: 14, tag: 'Afternoon' },
      { hour: '3 PM', orders: 15, dineIn: 9, delivery: 6, tag: 'Prep Window' },
      { hour: '4 PM', orders: 12, dineIn: 6, delivery: 6, tag: 'Downtime' },
      { hour: '5 PM', orders: 22, dineIn: 14, delivery: 8, tag: 'Evening Open' },
      { hour: '6 PM', orders: 38, dineIn: 26, delivery: 12, tag: 'Early Dinner' },
      { hour: '7 PM', orders: 68, dineIn: 48, delivery: 20, tag: 'Peak Rush' },
      { hour: '8 PM', orders: 82, dineIn: 62, delivery: 20, tag: 'Prime Sitting' },
      { hour: '9 PM', orders: 74, dineIn: 54, delivery: 20, tag: 'Late Dining' },
      { hour: '10 PM', orders: 35, dineIn: 25, delivery: 10, tag: 'Nightcap' },
      { hour: '11 PM', orders: 14, dineIn: 10, delivery: 4, tag: 'Last Call' },
    ];
  }, []);

  // 3. Most Popular Dishes Data
  const popularDishesData = useMemo(() => {
    return [
      { name: 'Firewood Jollof Royale', shortName: 'Jollof Royale', orders: 142, revenue: 3976000, color: '#14532D' },
      { name: 'Wood-Fired Grilled Croaker', shortName: 'Grilled Croaker', orders: 88, revenue: 3388000, color: '#C2410C' },
      { name: 'Slow-Braised Oxtail Efo Riro', shortName: 'Oxtail Efo Riro', orders: 94, revenue: 3196000, color: '#C89B3C' },
      { name: 'Tiger Prawn Suya Platter', shortName: 'Prawn Suya', orders: 112, revenue: 2520000, color: '#047857' },
      { name: 'Fresh Palm Wine Sangria', shortName: 'Palm Sangria', orders: 165, revenue: 2062500, color: '#B45309' },
    ];
  }, []);

  // Summary Metrics
  const totalWeeklyRevenue = revenueTrendData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalWeeklyOrders = revenueTrendData.reduce((acc, curr) => acc + curr.orders, 0);
  const avgCheck = Math.round(totalWeeklyRevenue / totalWeeklyOrders);

  // Custom Recharts Tooltip for Naira Currency
  const CustomRevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white/95 backdrop-blur-md border border-[#E8E6DD] rounded-2xl shadow-xl text-xs space-y-1 text-left">
          <p className="font-bold text-[#121110] font-display">{label}</p>
          <div className="flex items-center justify-between gap-4 text-[#14532D]">
            <span>Actual Sales:</span>
            <span className="font-mono font-bold">{formatNaira(payload[0]?.value || 0)}</span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-4 text-[#8C8A82]">
              <span>Target Baseline:</span>
              <span className="font-mono">{formatNaira(payload[1]?.value || 0)}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomHoursTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="p-3 bg-white/95 backdrop-blur-md border border-[#E8E6DD] rounded-2xl shadow-xl text-xs space-y-1 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-[#121110]">{label}</span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#14532D] font-bold">
              {data?.tag}
            </span>
          </div>
          <div className="pt-1 text-[#121110] font-mono font-bold">
            Total: {data?.orders} orders
          </div>
          <div className="flex items-center justify-between gap-3 text-[11px] text-[#595852]">
            <span>Dine-In Tables:</span>
            <span className="font-mono font-semibold text-[#14532D]">{data?.dineIn}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[11px] text-[#595852]">
            <span>Island Delivery:</span>
            <span className="font-mono font-semibold text-[#C2410C]">{data?.delivery}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Widget Header & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#14532D]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#121110]">
              Executive Analytics & Revenue Intelligence
            </h2>
          </div>
          <p className="text-xs text-[#595852] mt-1">
            Real-time visual reports: peak dining hours, top culinary sellers, and weekly gross growth in Nigerian Naira.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-[#FAFAF7] p-1 border border-[#E8E6DD] rounded-xl text-xs">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === 'today'
                  ? 'bg-white text-[#14532D] shadow-2xs'
                  : 'text-[#595852] hover:text-[#121110]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === 'week'
                  ? 'bg-white text-[#14532D] shadow-2xs'
                  : 'text-[#595852] hover:text-[#121110]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === 'month'
                  ? 'bg-white text-[#14532D] shadow-2xs'
                  : 'text-[#595852] hover:text-[#121110]'
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={() => {
              const text = `Àdùkẹ́ Lagos Weekly Revenue: ${formatNaira(totalWeeklyRevenue)}\nTotal Orders: ${totalWeeklyOrders}\nAvg Ticket: ${formatNaira(avgCheck)}`;
              navigator.clipboard?.writeText?.(text);
              alert('Analytics summary copied to clipboard in Nigerian Naira format!');
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#121110] bg-[#FAFAF7] hover:bg-white border border-[#E8E6DD] rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Export ₦ Digest</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C8A82] font-semibold">
            Weekly Gross Revenue
          </span>
          <div className="font-display text-2xl sm:text-3xl font-bold text-[#14532D]">
            {formatNaira(totalWeeklyRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% WoW (Victoria Island)</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C8A82] font-semibold">
            Average Table Ticket
          </span>
          <div className="font-display text-2xl sm:text-3xl font-bold text-[#121110]">
            {formatNaira(avgCheck)}
          </div>
          <div className="text-xs text-[#595852] pt-1">
            Across 12 dining pavilion tables
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C8A82] font-semibold">
            Peak Ordering Window
          </span>
          <div className="font-display text-2xl sm:text-3xl font-bold text-[#C2410C]">
            7:30 – 9:30 PM
          </div>
          <div className="text-xs text-[#595852] pt-1">
            Dinner Service (82 orders/hr surge)
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C8A82] font-semibold">
            Best Seller Turnover
          </span>
          <div className="font-display text-2xl sm:text-3xl font-bold text-[#C89B3C]">
            Party Jollof Royale
          </div>
          <div className="text-xs text-[#595852] pt-1">
            142 orders · {formatNaira(3976000)}
          </div>
        </div>
      </div>

      {/* CHART 1: Daily Revenue Growth (Recharts AreaChart with Gradient) */}
      <div className="p-6 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EFEB]">
          <div>
            <h3 className="font-display text-base font-bold text-[#121110] flex items-center gap-2">
              <span>Daily Revenue Growth & Target Comparison</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] font-bold">
                RECHARTS AREA GRADIENT
              </span>
            </h3>
            <p className="text-xs text-[#595852]">
              Actual revenue vs projected baseline across the 7-day Lagos operating week.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#14532D]" />
              <span className="font-semibold text-[#121110]">Actual Net ₦</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#8C8A82] border-t border-dashed border-[#8C8A82]" />
              <span className="text-[#8C8A82]">Target (₦)</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14532D" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#14532D" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6DD" />
              <XAxis dataKey="day" stroke="#8C8A82" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#8C8A82"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₦${(val / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomRevenueTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#14532D"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                name="Actual Revenue"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#8C8A82"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                name="Target Baseline"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHARTS 2 & 3: Peak Hours BarChart & Popular Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 2: Peak Ordering Hours (Recharts Stacked BarChart) */}
        <div className="lg:col-span-7 p-6 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EFEB]">
            <div>
              <h3 className="font-display text-base font-bold text-[#121110] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#14532D]" />
                <span>Peak Ordering Hours (12 PM – 11 PM)</span>
              </h3>
              <p className="text-xs text-[#595852]">
                Kitchen capacity load divided by dine-in pavilion tables vs Island dispatch.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#14532D]" />
                <span className="text-[#121110]">Dine-In</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C2410C]" />
                <span className="text-[#121110]">Island Delivery</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6DD" />
                <XAxis dataKey="hour" stroke="#8C8A82" fontSize={11} tickLine={false} />
                <YAxis stroke="#8C8A82" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomHoursTooltip />} />
                <Bar dataKey="dineIn" stackId="a" fill="#14532D" radius={[0, 0, 0, 0]} name="Dine-In" />
                <Bar dataKey="delivery" stackId="a" fill="#C2410C" radius={[4, 4, 0, 0]} name="Island Delivery" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-2 text-[11px] text-[#595852] border-t border-[#F0EFEB]">
            <span>⚡ Afternoon Rush: 1:00 PM – 2:00 PM (Suya Socials)</span>
            <span className="font-semibold text-[#C2410C]">🔥 Prime Surge: 7:30 PM – 9:00 PM</span>
          </div>
        </div>

        {/* CHART 3: Most Popular Dishes Breakdown */}
        <div className="lg:col-span-5 p-6 bg-white border border-[#E8E6DD] rounded-3xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
            <div>
              <h3 className="font-display text-base font-bold text-[#121110] flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#C89B3C]" />
                <span>Top Culinary Revenue</span>
              </h3>
              <p className="text-xs text-[#595852]">
                Volume & total earnings in Naira
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              RANKED
            </span>
          </div>

          <div className="space-y-3">
            {popularDishesData.map((dish, idx) => {
              const pct = Math.round((dish.revenue / totalWeeklyRevenue) * 100);
              return (
                <div key={dish.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-bold text-[#14532D] w-4">#{idx + 1}</span>
                      <span className="font-bold text-[#121110] truncate">{dish.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[#121110] shrink-0">
                      {formatNaira(dish.revenue)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full bg-[#F4F3ED] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, pct * 3.5)}%`,
                          backgroundColor: dish.color,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#8C8A82] shrink-0 w-16 text-right">
                      {dish.orders} tix · {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#FAFAF7] border border-[#E8E6DD] rounded-2xl text-[11px] text-[#595852] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C89B3C] shrink-0" />
            <span>Smoked Jollof Royale drives 26% of overall Lagos dinner volume.</span>
          </div>
        </div>

      </div>

    </div>
  );
};

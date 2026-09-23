import React, { useState } from 'react';
import { ChefHat, Calendar, Clock, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, X, Users, MapPin, Phone, Flame, Settings } from 'lucide-react';
import { RestaurantOrder, TableReservation, OrderStatus } from '../types/restaurant';
import { restaurantDB } from '../data/db';

interface StaffDashboardProps {
  orders: RestaurantOrder[];
  reservations: TableReservation[];
  onClose: () => void;
  onOpenMenuManager: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  orders,
  reservations,
  onClose,
  onOpenMenuManager,
}) => {
  const [activeTab, setActiveTab] = useState<'kitchen' | 'reservations' | 'floorplan'>('kitchen');

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    restaurantDB.updateOrderStatus(orderId, newStatus);
  };

  const handleUpdateReservationStatus = (resId: string, status: TableReservation['status']) => {
    restaurantDB.updateReservationStatus(resId, status);
  };

  const handleResetData = () => {
    if (confirm('Reset database to original curated demonstration orders and bookings?')) {
      restaurantDB.resetAll();
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#121110] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#E8E6DD]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#14532D] text-white flex items-center justify-center shadow-md shadow-emerald-950/15">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#121110]">
                  Staff & Kitchen Console
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] font-mono font-bold">
                  FIRESTORE LIVE
                </span>
              </div>
              <p className="text-xs text-[#595852] mt-0.5">
                Kitchen Display System (KDS), Host Stand Reservations & Pavilion Floor Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMenuManager}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#121110] bg-white hover:bg-[#F4F3ED] border border-[#E8E6DD] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#14532D]" />
              <span>Edit Menu & Prices</span>
            </button>

            <button
              onClick={handleResetData}
              title="Reset orders and reservations to demo state"
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-[#8C8A82] hover:text-[#121110] bg-white hover:bg-[#F4F3ED] border border-[#E8E6DD] rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#121110] hover:bg-[#282725] rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <span>Guest View</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 bg-[#EFEFEA] rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('kitchen')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'kitchen' ? 'bg-white text-[#121110] shadow-sm' : 'text-[#595852] hover:text-[#121110]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Kitchen Queue ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reservations' ? 'bg-white text-[#121110] shadow-sm' : 'text-[#595852] hover:text-[#121110]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Host Stand ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('floorplan')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'floorplan' ? 'bg-white text-[#121110] shadow-sm' : 'text-[#595852] hover:text-[#121110]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>Floor Plan Matrix</span>
          </button>
        </div>

        {/* TAB 1: KITCHEN DISPLAY SYSTEM */}
        {activeTab === 'kitchen' && (
          <div className="space-y-8 text-left">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#121110] mb-4">
                Active Fire & Prep Queue
              </h2>

              {activeOrders.length === 0 ? (
                <div className="py-20 text-center bg-white border border-dashed border-[#D8D6CC] rounded-3xl p-8">
                  <p className="font-display text-xl text-[#121110] font-semibold">Kitchen queue is clear</p>
                  <p className="text-xs text-[#595852] mt-1">
                    New delivery, pickup, or dine-in orders placed by guests will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white border border-[#E8E6DD] rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-xs"
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-lg font-bold text-[#14532D]">
                              #{ord.orderNumber}
                            </span>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] uppercase font-bold">
                              {ord.orderType}
                            </span>
                          </div>
                          <span className="text-xs font-bold font-mono text-[#14532D] capitalize">
                            ● {ord.status}
                          </span>
                        </div>

                        <div className="text-xs space-y-0.5">
                          <p className="text-[#121110] font-bold">{ord.customerName} · {ord.customerPhone}</p>
                          {ord.deliveryAddress && (
                            <p className="text-[#595852] truncate">{ord.deliveryAddress}</p>
                          )}
                          {ord.tableNumber && (
                            <p className="text-[#14532D] font-semibold">Table: {ord.tableNumber}</p>
                          )}
                        </div>

                        {/* Items */}
                        <div className="bg-[#FAFAF7] p-4 rounded-2xl space-y-2.5 border border-[#E8E6DD]">
                          {ord.items.map((i) => (
                            <div key={i.cartItemId} className="text-xs">
                              <div className="flex items-center justify-between text-[#121110] font-semibold">
                                <span>{i.quantity}x {i.item.name}</span>
                                <span className="font-mono text-[11px] text-[#8C8A82]">${i.totalPrice.toFixed(2)}</span>
                              </div>
                              {i.selectedOptions.length > 0 && (
                                <p className="text-[11px] text-[#14532D] font-medium">
                                  {i.selectedOptions.map((o) => o.optionName).join(', ')}
                                </p>
                              )}
                              {i.specialInstructions && (
                                <p className="text-[11px] text-[#8C8A82] italic">
                                  Note: {i.specialInstructions}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {ord.specialNotes && (
                          <p className="text-[11px] text-[#9A3412] italic bg-orange-50/70 p-2.5 rounded-xl border border-orange-200">
                            Chef Note: {ord.specialNotes}
                          </p>
                        )}
                      </div>

                      {/* Status Transition Action Buttons */}
                      <div className="pt-3 border-t border-[#F0EFEB] flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-bold text-[#121110]">
                          ${ord.total.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {ord.status === 'placed' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'cooking')}
                              className="px-3.5 py-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                            >
                              Fire on Embers →
                            </button>
                          )}
                          {ord.status === 'cooking' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'ready')}
                              className="px-3.5 py-1.5 bg-[#C89B3C] hover:bg-[#A17A27] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                            >
                              Ready for Host →
                            </button>
                          )}
                          {ord.status === 'ready' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                              className="px-3.5 py-1.5 bg-[#14532D] hover:bg-[#0D3823] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                            >
                              Delivered ✓
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past orders list */}
            {pastOrders.length > 0 && (
              <div className="pt-6 border-t border-[#E8E6DD]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8A82] mb-3">
                  Completed Service Records ({pastOrders.length})
                </h3>
                <div className="space-y-2">
                  {pastOrders.map((o) => (
                    <div key={o.id} className="p-3.5 bg-white border border-[#E8E6DD] rounded-2xl flex items-center justify-between text-xs text-[#595852]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[#121110]">#{o.orderNumber}</span>
                        <span className="font-semibold text-[#121110]">{o.customerName}</span>
                        <span className="font-mono">{o.items.length} items</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[#121110] font-bold">${o.total.toFixed(2)}</span>
                        <span className="text-[#14532D] font-semibold capitalize">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RESERVATIONS HOST STAND */}
        {activeTab === 'reservations' && (
          <div className="space-y-4 text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#121110]">
              Host Stand Guest Manifest ({reservations.length} total)
            </h2>

            <div className="overflow-x-auto border border-[#E8E6DD] rounded-3xl bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] text-[#595852] uppercase font-mono tracking-wider border-b border-[#E8E6DD]">
                  <tr>
                    <th className="p-4">Pass Code</th>
                    <th className="p-4">Guest & Contact</th>
                    <th className="p-4">Party</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Pavilion</th>
                    <th className="p-4">Occasion / Notes</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEB]">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-[#FAFAF7] transition-colors">
                      <td className="p-4 font-mono font-bold text-[#14532D]">
                        {res.bookingCode}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-[#121110]">{res.guestName}</div>
                        <div className="text-[11px] text-[#8C8A82]">{res.guestPhone}</div>
                      </td>
                      <td className="p-4 font-mono font-semibold">
                        {res.partySize} Guests
                      </td>
                      <td className="p-4 font-mono">
                        <div>{res.date}</div>
                        <div className="text-[#14532D] font-semibold">{res.timeSlot}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-[#121110]">{res.seatingAreaName}</span>
                      </td>
                      <td className="p-4 max-w-[200px]">
                        <div className="text-[#121110] font-medium">{res.occasion}</div>
                        {res.specialRequests && (
                          <div className="text-[11px] text-[#8C8A82] truncate" title={res.specialRequests}>
                            {res.specialRequests}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                          res.status === 'seated'
                            ? 'bg-amber-100 text-amber-800'
                            : res.status === 'completed'
                            ? 'bg-[#DCFCE7] text-[#14532D]'
                            : res.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateReservationStatus(res.id, 'seated')}
                            className="px-3.5 py-1.5 text-xs bg-[#14532D] hover:bg-[#0D3823] text-white font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer"
                          >
                            Seat Guest
                          </button>
                        )}
                        {res.status === 'seated' && (
                          <button
                            onClick={() => handleUpdateReservationStatus(res.id, 'completed')}
                            className="px-3.5 py-1.5 text-xs bg-[#0D3823] hover:bg-black text-white font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer"
                          >
                            Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FLOOR PLAN MATRIX */}
        {activeTab === 'floorplan' && (
          <div className="space-y-6 text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#121110]">
              Dining Pavilion Live Table Layout (12 Tables)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { table: 'Table 1', area: 'The Danfo Hearth', cap: '2 seats', occupied: true, guest: 'Babatunde O.' },
                { table: 'Table 2', area: 'The Danfo Hearth', cap: '2 seats', occupied: false },
                { table: 'Table 3', area: 'The Danfo Hearth', cap: '4 seats', occupied: false },
                { table: 'Table 4', area: 'Eko Grand Dining', cap: '4 seats', occupied: true, guest: 'Tunde Adeleke' },
                { table: 'Table 5', area: 'Eko Grand Dining', cap: '4 seats', occupied: false },
                { table: 'Table 6', area: 'Eko Grand Dining', cap: '6 seats', occupied: false },
                { table: 'Table 7', area: 'Eko Grand Dining', cap: '8 seats', occupied: false },
                { table: 'Table 8', area: 'Lagos Palm Veranda', cap: '2 seats', occupied: true, guest: 'Dr. Chioma N.' },
                { table: 'Table 9', area: 'Lagos Palm Veranda', cap: '4 seats', occupied: false },
                { table: 'Table 10', area: 'Lagos Palm Veranda', cap: '6 seats', occupied: false },
                { table: 'Table 11', area: "The Oba's Suite", cap: '8 seats', occupied: false },
                { table: 'Table 12', area: "The Oba's Suite", cap: '14 seats', occupied: false },
              ].map((tbl) => (
                <div
                  key={tbl.table}
                  className={`p-5 rounded-3xl border transition-all ${
                    tbl.occupied
                      ? 'border-emerald-300 bg-[#DCFCE7]/40 shadow-xs'
                      : 'border-[#E8E6DD] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-[#121110]">{tbl.table}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${tbl.occupied ? 'bg-[#14532D]' : 'bg-[#C89B3C]'}`} />
                  </div>
                  <div className="text-xs font-semibold text-[#121110]">{tbl.area}</div>
                  <div className="text-[11px] text-[#8C8A82] font-mono">{tbl.cap}</div>
                  <div className="pt-2 mt-3 border-t border-[#E8E6DD] text-[11px]">
                    {tbl.occupied ? (
                      <span className="text-[#14532D] font-bold">Occupied: {tbl.guest}</span>
                    ) : (
                      <span className="text-[#595852] font-semibold">Available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

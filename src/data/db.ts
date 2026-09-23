import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { notificationService } from '../services/notificationService';
import {
  MenuItem,
  TableReservation,
  RestaurantOrder,
  CustomerReview,
  SeatingArea,
  TableSession,
  TableServiceCall,
  TableStatus,
  PaymentMethod,
} from '../types/restaurant';
import { INITIAL_NIGERIAN_MENU, NIGERIAN_SEATING_AREAS } from './menuData';

const STORAGE_KEYS = {
  MENU: 'aduke_menu_v3_ngn',
  RESERVATIONS: 'aduke_reservations_v3_ngn',
  ORDERS: 'aduke_orders_v3_ngn',
  REVIEWS: 'aduke_reviews_v3_ngn',
  TABLES: 'aduke_table_sessions_v3',
};

const SEED_RESERVATIONS: TableReservation[] = [
  {
    id: 'res-aduke-1',
    bookingCode: 'ADK-9821',
    guestName: 'Chief Tunde Adeleke',
    guestEmail: 'tunde.adeleke@lagos.ng',
    guestPhone: '+234 803 555 1204',
    partySize: 4,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '19:30',
    seatingAreaId: 'eko-grand',
    seatingAreaName: 'The Eko Grand Dining Hall',
    occasion: 'Anniversary Celebration',
    specialRequests: 'Celebrating 10 years; prefer seating near the indoor palms.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'res-aduke-2',
    bookingCode: 'ADK-4102',
    guestName: 'Dr. Chioma Nnamdi',
    guestEmail: 'chioma.n@health.gov.ng',
    guestPhone: '+234 901 749 3320',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '20:15',
    seatingAreaId: 'lagos-veranda',
    seatingAreaName: 'The Lagos Palm Veranda',
    occasion: 'Romantic Dinner',
    specialRequests: 'Mild spice for fish courses.',
    status: 'seated',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'res-aduke-3',
    bookingCode: 'ADK-7719',
    guestName: 'Senator Babatunde Ogunlesi',
    guestEmail: 'b.ogunlesi@invest.ng',
    guestPhone: '+234 802 888 4411',
    partySize: 8,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '21:00',
    seatingAreaId: 'obas-vault',
    seatingAreaName: 'The Oba’s Private Dining Suite',
    occasion: 'Private Diplomatic Dinner',
    specialRequests: 'Sommelier tasting pairing and privacy screen.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

const SEED_ORDERS: RestaurantOrder[] = [
  {
    id: 'ord-aduke-1',
    orderNumber: 'ADK-8819',
    orderType: 'dine-in-table',
    customerName: 'Babatunde O.',
    customerPhone: '+234 802 334 9120',
    customerEmail: 'babatunde@lagos.ng',
    tableNumber: 'Table 4',
    items: [
      {
        cartItemId: 'item-1',
        item: INITIAL_NIGERIAN_MENU[3], // Smoked Jollof Royale
        quantity: 2,
        selectedOptions: [
          { groupId: 'protein', groupTitle: 'Choice of Protein', optionId: 'p-oxtail', optionName: 'Fall-Apart Braised Beef Oxtail', price: 8500 },
        ],
        unitPrice: 36500,
        totalPrice: 73000,
      },
      {
        cartItemId: 'item-2',
        item: INITIAL_NIGERIAN_MENU[0], // Suya Platter
        quantity: 1,
        selectedOptions: [
          { groupId: 'extras', groupTitle: 'Additions', optionId: 'ex-dodo', optionName: 'Side of Fried Sweet Plantain (Dodo)', price: 4500 },
        ],
        unitPrice: 27000,
        totalPrice: 27000,
      },
      {
        cartItemId: 'item-3',
        item: INITIAL_NIGERIAN_MENU[9], // Chapman
        quantity: 2,
        selectedOptions: [],
        unitPrice: 9500,
        totalPrice: 19000,
      },
    ],
    subtotal: 119000,
    tax: 8925, // 7.5% Nigerian VAT
    deliveryFee: 0,
    tip: 15000,
    total: 142925,
    status: 'cooking',
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    estimatedDeliveryTime: 'Plating in 10-15 mins',
    specialNotes: 'Extra spicy yaji pepper on the side.',
  },
  {
    id: 'ord-aduke-2',
    orderNumber: 'ADK-9012',
    orderType: 'delivery',
    customerName: 'Folashade Adeleke',
    customerPhone: '+234 814 620 9001',
    customerEmail: 'f.adeleke@island.ng',
    deliveryAddress: '18 Bourdillon Road, Ikoyi, Lagos',
    items: [
      {
        cartItemId: 'item-d1',
        item: INITIAL_NIGERIAN_MENU[4], // Slow Braised Oxtail & Efo Riro
        quantity: 1,
        selectedOptions: [
          { groupId: 'swallow', groupTitle: 'Swallow', optionId: 'sw-iyan', optionName: 'Fluffy Pounded Yam (Ìyán)', price: 0 },
        ],
        unitPrice: 34000,
        totalPrice: 34000,
      },
      {
        cartItemId: 'item-d2',
        item: INITIAL_NIGERIAN_MENU[6], // Seafood Okra Deluxe
        quantity: 1,
        selectedOptions: [],
        unitPrice: 39000,
        totalPrice: 39000,
      },
    ],
    subtotal: 73000,
    tax: 5475,
    deliveryFee: 4500,
    tip: 7000,
    total: 89975,
    status: 'ready',
    paymentStatus: 'paid',
    paymentMethod: 'pos_terminal',
    createdAt: new Date(Date.now() - 28 * 60000).toISOString(),
    estimatedDeliveryTime: 'Courier dispatched on Ozumba Mbadiwe',
    specialNotes: 'Ring gate intercom on arrival.',
  },
];

const SEED_TABLES: TableSession[] = [
  { tableNumber: 'Table 1', areaId: 'danfo-lounge', areaName: 'The Danfo Hearth & Bar', status: 'occupied', guestName: 'Babatunde O.', guestCount: 2, currentServiceCall: 'water', openedAt: '18:45', totalSpend: 46000, activeOrderIds: [] },
  { tableNumber: 'Table 2', areaId: 'danfo-lounge', areaName: 'The Danfo Hearth & Bar', status: 'vacant', currentServiceCall: 'none', totalSpend: 0, activeOrderIds: [] },
  { tableNumber: 'Table 3', areaId: 'danfo-lounge', areaName: 'The Danfo Hearth & Bar', status: 'vacant', currentServiceCall: 'none', totalSpend: 0, activeOrderIds: [] },
  { tableNumber: 'Table 4', areaId: 'eko-grand', areaName: 'The Eko Grand Dining Hall', status: 'occupied', guestName: 'Tunde Adeleke', guestCount: 4, currentServiceCall: 'none', openedAt: '19:30', totalSpend: 142925, activeOrderIds: ['ord-aduke-1'] },
  { tableNumber: 'Table 5', areaId: 'eko-grand', areaName: 'The Eko Grand Dining Hall', status: 'vacant', currentServiceCall: 'none', totalSpend: 0, activeOrderIds: [] },
  { tableNumber: 'Table 6', areaId: 'eko-grand', areaName: 'The Eko Grand Dining Hall', status: 'billing', guestName: 'Kunle & Friends', guestCount: 6, currentServiceCall: 'bill', openedAt: '18:15', totalSpend: 215000, activeOrderIds: [] },
  { tableNumber: 'Table 7', areaId: 'eko-grand', areaName: 'The Eko Grand Dining Hall', status: 'dirty', currentServiceCall: 'clearing', totalSpend: 0, activeOrderIds: [] },
  { tableNumber: 'Table 8', areaId: 'lagos-veranda', areaName: 'The Lagos Palm Veranda', status: 'occupied', guestName: 'Dr. Chioma N.', guestCount: 2, currentServiceCall: 'none', openedAt: '20:15', totalSpend: 62000, activeOrderIds: [] },
  { tableNumber: 'Table 9', areaId: 'lagos-veranda', areaName: 'The Lagos Palm Veranda', status: 'vacant', currentServiceCall: 'none', totalSpend: 0, activeOrderIds: [] },
  { tableNumber: 'Table 10', areaId: 'lagos-veranda', areaName: 'The Lagos Palm Veranda', status: 'vacant', currentServiceCall: 'none', totalSpend: 0, activeOrderIds: [] },
  { tableNumber: 'Table 11', areaId: 'obas-vault', areaName: 'The Oba’s Private Dining Suite', status: 'occupied', guestName: 'Sen. Ogunlesi', guestCount: 8, currentServiceCall: 'waiter', openedAt: '21:00', totalSpend: 480000, activeOrderIds: [] },
  { tableNumber: 'Table 12', areaId: 'obas-vault', areaName: 'The Oba’s Private Dining Suite', status: 'vacant', currentServiceCall: 'none', totalSpend: 0, activeOrderIds: [] },
];

const SEED_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-adk-1',
    author: 'Olumide Jacobs',
    rating: 5,
    date: 'Yesterday in Victoria Island',
    title: 'The authentic woodfire jollof is unmatched in Lagos',
    comment: 'The party-style smoked jollof with melt-in-your-mouth braised oxtail took me straight back to elite Lagos celebrations. QR table ordering at Table 4 was fast and elegant.',
    dishRecommended: 'Smoked Firewood Jollof Rice Royale',
    diningType: 'Dinner',
    verified: true,
  },
  {
    id: 'rev-adk-2',
    author: 'Amina Bello',
    rating: 5,
    date: '3 days ago',
    title: 'Supreme tiger prawns and refreshing Chapman',
    comment: 'The northern yaji pepper spice on the grilled prawns had the perfect savory punch. Impeccable modern Nigerian aesthetic and rapid tablet service.',
    dishRecommended: 'Tiger Prawn & Beef Suya Platter',
    diningType: 'Celebration',
    verified: true,
  },
  {
    id: 'rev-adk-3',
    author: 'Marcus & Sade Wright',
    rating: 5,
    date: '1 week ago',
    title: 'Booked the Palm Veranda for our anniversary',
    comment: 'The online reservation system held our table on time without double-booking confusion. The seafood okra and palm wine sangria are extraordinary.',
    dishRecommended: 'Seafood Okra Deluxe & Palm Wine Sangria',
    diningType: 'Celebration',
    verified: true,
  },
];

type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

function emitChange() {
  listeners.forEach((cb) => cb());
}

export const restaurantDB = {
  subscribe(callback: ChangeListener) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },

  // MENU
  getMenu(): MenuItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MENU);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_NIGERIAN_MENU));
    return INITIAL_NIGERIAN_MENU;
  },

  updateMenuItem(updatedItem: MenuItem): void {
    const menu = this.getMenu();
    const index = menu.findIndex((m) => m.id === updatedItem.id);
    if (index > -1) {
      menu[index] = updatedItem;
    } else {
      menu.push(updatedItem);
    }
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
    try {
      setDoc(doc(db, 'menu', updatedItem.id), updatedItem, { merge: true }).catch(() => {});
    } catch {}
    emitChange();
  },

  addMenuItem(newItem: MenuItem): void {
    const menu = this.getMenu();
    menu.push(newItem);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
    try {
      setDoc(doc(db, 'menu', newItem.id), newItem).catch(() => {});
    } catch {}
    emitChange();
  },

  deleteMenuItem(id: string): void {
    const menu = this.getMenu().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
    try {
      deleteDoc(doc(db, 'menu', id)).catch(() => {});
    } catch {}
    emitChange();
  },

  // SEATING AREAS
  getSeatingAreas(): SeatingArea[] {
    return NIGERIAN_SEATING_AREAS;
  },

  // TABLE SESSIONS
  getTableSessions(): TableSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TABLES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(SEED_TABLES));
    return SEED_TABLES;
  },

  getTableSession(tableNumber: string): TableSession | undefined {
    return this.getTableSessions().find(
      (t) => t.tableNumber.toLowerCase() === tableNumber.toLowerCase()
    );
  },

  startTableSession(tableNumber: string, guestName?: string, guestCount: number = 2): TableSession {
    const tables = this.getTableSessions();
    const index = tables.findIndex(
      (t) => t.tableNumber.toLowerCase() === tableNumber.toLowerCase()
    );
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    let session: TableSession;

    if (index > -1) {
      tables[index].status = 'occupied';
      tables[index].guestName = guestName || tables[index].guestName || 'Table Guest';
      tables[index].guestCount = guestCount;
      tables[index].openedAt = tables[index].openedAt || now;
      session = tables[index];
    } else {
      session = {
        tableNumber,
        areaId: 'eko-grand',
        areaName: 'The Eko Grand Dining Hall',
        status: 'occupied',
        guestName: guestName || 'Table Guest',
        guestCount,
        currentServiceCall: 'none',
        openedAt: now,
        totalSpend: 0,
        activeOrderIds: [],
      };
      tables.push(session);
    }

    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    try {
      setDoc(doc(db, 'table_sessions', tableNumber.replace(/\s+/g, '_')), session, { merge: true }).catch(() => {});
    } catch {}
    emitChange();
    return session;
  },

  callTableService(tableNumber: string, callType: TableServiceCall): void {
    const tables = this.getTableSessions();
    const index = tables.findIndex(
      (t) => t.tableNumber.toLowerCase() === tableNumber.toLowerCase()
    );
    if (index > -1) {
      tables[index].currentServiceCall = callType;
      if (callType === 'bill') {
        tables[index].status = 'billing';
      } else if (callType !== 'none') {
        tables[index].status = 'service_needed';
      }
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      try {
        setDoc(doc(db, 'table_sessions', tableNumber.replace(/\s+/g, '_')), tables[index], { merge: true }).catch(() => {});
      } catch {}
      emitChange();
    }
  },

  clearTableService(tableNumber: string): void {
    const tables = this.getTableSessions();
    const index = tables.findIndex(
      (t) => t.tableNumber.toLowerCase() === tableNumber.toLowerCase()
    );
    if (index > -1) {
      tables[index].currentServiceCall = 'none';
      if (tables[index].status === 'service_needed') {
        tables[index].status = 'occupied';
      }
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      try {
        setDoc(doc(db, 'table_sessions', tableNumber.replace(/\s+/g, '_')), tables[index], { merge: true }).catch(() => {});
      } catch {}
      emitChange();
    }
  },

  updateTableStatus(tableNumber: string, status: TableStatus): void {
    const tables = this.getTableSessions();
    const index = tables.findIndex(
      (t) => t.tableNumber.toLowerCase() === tableNumber.toLowerCase()
    );
    if (index > -1) {
      tables[index].status = status;
      if (status === 'vacant' || status === 'dirty') {
        tables[index].currentServiceCall = 'none';
        if (status === 'vacant') {
          tables[index].guestName = undefined;
          tables[index].totalSpend = 0;
          tables[index].activeOrderIds = [];
        }
      }
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      try {
        setDoc(doc(db, 'table_sessions', tableNumber.replace(/\s+/g, '_')), tables[index], { merge: true }).catch(() => {});
      } catch {}
      emitChange();
    }
  },

  settleTableBill(tableNumber: string, paymentMethod: PaymentMethod): void {
    const tables = this.getTableSessions();
    const index = tables.findIndex(
      (t) => t.tableNumber.toLowerCase() === tableNumber.toLowerCase()
    );
    if (index > -1) {
      tables[index].status = 'dirty';
      tables[index].currentServiceCall = 'none';
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));

      // Mark associated orders as paid
      const orders = this.getOrders();
      const updatedOrders = orders.map((o) => {
        if (o.tableNumber?.toLowerCase() === tableNumber.toLowerCase()) {
          return { ...o, paymentStatus: 'paid' as const, paymentMethod };
        }
        return o;
      });
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

      emitChange();
    }
  },

  // RESERVATIONS
  getReservations(): TableReservation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(SEED_RESERVATIONS));
    return SEED_RESERVATIONS;
  },

  checkSlotAvailability(date: string, timeSlot: string, seatingAreaId: string): {
    available: boolean;
    remainingTables: number;
    maxTables: number;
  } {
    const area = NIGERIAN_SEATING_AREAS.find((a) => a.id === seatingAreaId);
    const maxTables = area ? area.totalTables : 6;

    const existingBookings = this.getReservations().filter(
      (r) =>
        r.date === date &&
        r.timeSlot === timeSlot &&
        r.seatingAreaId === seatingAreaId &&
        r.status !== 'cancelled'
    );

    const remainingTables = Math.max(0, maxTables - existingBookings.length);
    return {
      available: remainingTables > 0,
      remainingTables,
      maxTables,
    };
  },

  createReservation(
    reservation: Omit<TableReservation, 'id' | 'bookingCode' | 'createdAt' | 'status'>
  ): { success: boolean; reservation?: TableReservation; error?: string } {
    const availability = this.checkSlotAvailability(
      reservation.date,
      reservation.timeSlot,
      reservation.seatingAreaId
    );

    if (!availability.available) {
      return {
        success: false,
        error: `All ${availability.maxTables} tables in this zone are already reserved for ${reservation.date} at ${reservation.timeSlot}. Please choose an alternate sitting time.`,
      };
    }

    const list = this.getReservations();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReservation: TableReservation = {
      ...reservation,
      id: `res-${Date.now()}`,
      bookingCode: `ADK-${randomSuffix}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const updated = [newReservation, ...list];
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));

    try {
      setDoc(doc(db, 'reservations', newReservation.id), newReservation).catch(() => {});
    } catch {}

    emitChange();
    return { success: true, reservation: newReservation };
  },

  updateReservationStatus(id: string, status: TableReservation['status']): void {
    const list = this.getReservations();
    const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
    try {
      updateDoc(doc(db, 'reservations', id), { status }).catch(() => {});
    } catch {}
    emitChange();
  },

  // ORDERS
  getOrders(): RestaurantOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    return SEED_ORDERS;
  },

  getActiveOrder(userId?: string): RestaurantOrder | undefined {
    return this.getOrders().find((o) => {
      const isOngoing = o.status !== 'completed' && o.status !== 'cancelled';
      if (userId) return isOngoing && o.userId === userId;
      return isOngoing;
    });
  },

  createOrder(
    orderData: Omit<RestaurantOrder, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'estimatedDeliveryTime'>
  ): RestaurantOrder {
    const list = this.getOrders();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: RestaurantOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `ADK-${randomSuffix}`,
      status: 'placed',
      paymentStatus: orderData.paymentStatus || 'unpaid',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: orderData.orderType === 'delivery' ? '30-45 mins' : '15-20 mins',
    };

    const updated = [newOrder, ...list];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    // Update table session total spend if dine-in
    if (orderData.tableNumber) {
      const tables = this.getTableSessions();
      const tIdx = tables.findIndex((t) => t.tableNumber.toLowerCase() === orderData.tableNumber?.toLowerCase());
      if (tIdx > -1) {
        tables[tIdx].status = 'occupied';
        tables[tIdx].totalSpend = (tables[tIdx].totalSpend || 0) + orderData.total;
        tables[tIdx].activeOrderIds.push(newOrder.id);
        localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      }
    }

    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(() => {});
    } catch {}

    // Subscribe user to real-time status notifications for this order
    try {
      notificationService.subscribeToOrder(newOrder.id);
      notificationService.notifyOrderStatus(newOrder);
    } catch {}

    emitChange();
    return newOrder;
  },

  updateOrderStatus(id: string, status: RestaurantOrder['status']): void {
    const list = this.getOrders();
    const updated = list.map((o) => (o.id === id ? { ...o, status } : o));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    try {
      updateDoc(doc(db, 'orders', id), { status }).catch(() => {});
    } catch {}

    // Dispatch real-time browser & in-app notification to subscribers
    const order = updated.find((o) => o.id === id);
    if (order) {
      try {
        notificationService.notifyOrderStatus(order);
      } catch {}
    }

    emitChange();
  },

  // REVIEWS
  getReviews(): CustomerReview[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
  },

  addReview(review: Omit<CustomerReview, 'id' | 'date' | 'verified'>): CustomerReview {
    const list = this.getReviews();
    const newReview: CustomerReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now in Victoria Island',
      verified: true,
    };
    const updated = [newReview, ...list];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    try {
      setDoc(doc(db, 'reviews', newReview.id), newReview).catch(() => {});
    } catch {}
    emitChange();
    return newReview;
  },

  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    emitChange();
  },
};

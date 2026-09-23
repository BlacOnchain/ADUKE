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
import {
  MenuItem,
  TableReservation,
  RestaurantOrder,
  CustomerReview,
  SeatingArea,
} from '../types/restaurant';
import { INITIAL_NIGERIAN_MENU, NIGERIAN_SEATING_AREAS } from './menuData';

const STORAGE_KEYS = {
  MENU: 'aduke_menu_v2',
  RESERVATIONS: 'aduke_reservations_v2',
  ORDERS: 'aduke_orders_v2',
  REVIEWS: 'aduke_reviews_v2',
};

const SEED_RESERVATIONS: TableReservation[] = [
  {
    id: 'res-aduke-1',
    bookingCode: 'ADK-9821',
    guestName: 'Tunde Adeleke',
    guestEmail: 'tunde.adeleke@example.com',
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
    guestEmail: 'chioma.n@example.com',
    guestPhone: '+1 (555) 749-3320',
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
];

const SEED_ORDERS: RestaurantOrder[] = [
  {
    id: 'ord-aduke-1',
    orderNumber: 'ADK-8819',
    orderType: 'delivery',
    customerName: 'Yemi Balogun',
    customerPhone: '+1 (555) 831-2900',
    customerEmail: 'yemi.b@example.com',
    deliveryAddress: '24 Victoria Crown St, Apt 4B',
    items: [
      {
        cartItemId: 'item-1',
        item: INITIAL_NIGERIAN_MENU[3], // Smoked Jollof
        quantity: 2,
        selectedOptions: [
          { groupId: 'protein', groupTitle: 'Choice of Protein', optionId: 'p-oxtail', optionName: 'Fall-Apart Braised Beef Oxtail', price: 8 },
        ],
        unitPrice: 40.0,
        totalPrice: 80.0,
      },
      {
        cartItemId: 'item-2',
        item: INITIAL_NIGERIAN_MENU[0], // Suya Platter
        quantity: 1,
        selectedOptions: [],
        unitPrice: 24.0,
        totalPrice: 24.0,
      },
    ],
    subtotal: 104.0,
    tax: 9.23,
    deliveryFee: 5.0,
    tip: 18.0,
    total: 136.23,
    status: 'cooking',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    estimatedDeliveryTime: '20-30 min',
    specialNotes: 'Extra spicy yaji on the side please.',
  },
];

const SEED_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-adk-1',
    author: 'Olumide Jacobs',
    rating: 5,
    date: 'Yesterday',
    title: 'The firewood smoky jollof is unmatched',
    comment: 'The party-style smoked jollof with melt-in-your-mouth braised oxtail took me straight back to authentic Lagos wedding celebrations. The ambiance with warm terracotta and lush palms is stunning.',
    dishRecommended: 'Smoked Firewood Jollof Rice Royale',
    diningType: 'Dinner',
    verified: true,
  },
  {
    id: 'rev-adk-2',
    author: 'Amina Bello',
    rating: 5,
    date: '4 days ago',
    title: 'Supreme tiger prawns and refreshing Chapman',
    comment: 'The yaji pepper crust on the grilled prawns had the perfect savory punch. Chapman cocktail was impeccably balanced. Beautiful modern Nigerian luxury aesthetic.',
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
    comment: 'The online reservation was seamless, preventing double-bookings and holding our table right on time. Outstanding hospitality and seafood okra.',
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
    // Persist to firestore asynchronously
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

  deleteMenuItem(itemId: string): void {
    const menu = this.getMenu().filter((m) => m.id !== itemId);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
    try {
      deleteDoc(doc(db, 'menu', itemId)).catch(() => {});
    } catch {}
    emitChange();
  },

  getSeatingAreas(): SeatingArea[] {
    return NIGERIAN_SEATING_AREAS;
  },

  // RESERVATION DOUBLE-BOOKING PREVENTION
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

  /**
   * Check if a specific slot can take another booking
   * Prevents double bookings by enforcing zone table capacity limit
   */
  checkSlotAvailability(date: string, timeSlot: string, seatingAreaId: string): {
    available: boolean;
    remainingTables: number;
    maxTables: number;
  } {
    const area = NIGERIAN_SEATING_AREAS.find((a) => a.id === seatingAreaId);
    const maxTables = area ? area.totalTables : 4;

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
    // Check for double booking
    const availability = this.checkSlotAvailability(
      reservation.date,
      reservation.timeSlot,
      reservation.seatingAreaId
    );

    if (!availability.available) {
      return {
        success: false,
        error: `All ${availability.maxTables} tables in this zone are already reserved for ${reservation.date} at ${reservation.timeSlot}. Please choose an alternate sitting time or dining area.`,
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

    // Save to Firestore
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
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: orderData.orderType === 'pickup' ? '15-20 min' : '30-40 min',
    };
    const updated = [newOrder, ...list];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    // Persist to Firestore
    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(() => {});
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
      date: 'Just now',
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
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_NIGERIAN_MENU));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(SEED_RESERVATIONS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    emitChange();
  },
};

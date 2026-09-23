export type NigerianDietBadge =
  | 'suya-spiced'
  | 'halal'
  | 'chef-signature'
  | 'vegetarian'
  | 'seafood'
  | 'hot-spice'
  | 'mild-spice'
  | 'gluten-free';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number; // in Naira
}

export interface CustomizationGroup {
  id: string;
  title: string;
  required: boolean;
  options: CustomizationOption[];
}

export type MenuCategory = 'appetizers' | 'mains' | 'desserts' | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  yorubaName?: string;
  category: MenuCategory;
  price: number; // in Nigerian Naira (NGN ₦)
  description: string;
  image: string;
  calories: number;
  prepTimeMinutes: number;
  tags: NigerianDietBadge[];
  allergens: string[];
  pairing?: string;
  available: boolean;
  customizationGroups?: CustomizationGroup[];
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  selectedOptions: {
    groupId: string;
    groupTitle: string;
    optionId: string;
    optionName: string;
    price: number;
  }[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface SeatingArea {
  id: string;
  name: string;
  localName: string;
  description: string;
  vibe: string;
  capacity: string;
  recommendedFor: string;
  tag: string;
  totalTables: number;
}

export type OrderStatus = 'placed' | 'confirmed' | 'cooking' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'delivery' | 'pickup' | 'dine-in-ahead' | 'dine-in-table';
export type PaymentMethod = 'pos_terminal' | 'cash' | 'bank_transfer' | 'ussd';

export interface RestaurantOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  orderType: OrderType;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress?: string;
  tableNumber?: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  status: OrderStatus;
  paymentStatus?: 'unpaid' | 'paid';
  paymentMethod?: PaymentMethod;
  createdAt: string;
  estimatedDeliveryTime: string;
  specialNotes?: string;
  userId?: string;
}

export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface TableReservation {
  id: string;
  bookingCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  seatingAreaId: string;
  seatingAreaName: string;
  occasion: string;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
  userId?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  dishRecommended: string;
  diningType: 'Dinner' | 'Lunch' | 'Celebration';
  verified: boolean;
}

export type StaffRole = 'owner' | 'manager' | 'chef' | 'cashier' | 'waiter' | 'customer';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  role?: StaffRole;
  title?: string;
  staffPin?: string;
}

export type TableServiceCall = 'none' | 'water' | 'bill' | 'waiter' | 'napkins' | 'clearing';
export type TableStatus = 'vacant' | 'occupied' | 'service_needed' | 'billing' | 'dirty';

export interface TableSession {
  tableNumber: string; // e.g. "Table 4"
  areaId: string;
  areaName: string;
  status: TableStatus;
  guestName?: string;
  guestCount?: number;
  currentServiceCall: TableServiceCall;
  openedAt?: string;
  totalSpend: number;
  activeOrderIds: string[];
}

export interface NotificationPreferences {
  browserNotificationsEnabled: boolean;
  soundEnabled: boolean;
  subscribedOrderIds: string[];
}

export interface InAppNotification {
  id: string;
  orderId: string;
  orderNumber: string;
  title: string;
  body: string;
  status: OrderStatus;
  timestamp: string;
  read: boolean;
}

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}

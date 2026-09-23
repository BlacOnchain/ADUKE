/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RestaurantOrder, OrderStatus, NotificationPreferences, InAppNotification } from '../types/restaurant';

const PREFS_KEY = 'aduke_notification_preferences_v1';
const HISTORY_KEY = 'aduke_notification_history_v1';

class NotificationService {
  private listeners: (() => void)[] = [];
  private history: InAppNotification[] = [];
  private preferences: NotificationPreferences = {
    browserNotificationsEnabled: true,
    soundEnabled: true,
    subscribedOrderIds: [],
  };

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        this.preferences = { ...this.preferences, ...JSON.parse(savedPrefs) };
      }
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
      }
    } catch {
      // ignore
    }
  }

  private saveState() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(this.preferences));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history.slice(0, 30)));
    } catch {
      // ignore
    }
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('Notification listener error:', err);
      }
    });
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        this.preferences.browserNotificationsEnabled = true;
        this.saveState();
        this.playChime();
        this.sendBrowserNotification(
          'Àdùkẹ́ Gastronomy Lagos',
          '🔔 Real-time order status notifications are now active on your device.'
        );
      } else {
        this.preferences.browserNotificationsEnabled = false;
        this.saveState();
      }
      return result;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'denied';
    }
  }

  public getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  public setPreferences(partial: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...partial };
    this.saveState();
  }

  public toggleSound(enabled?: boolean): boolean {
    const val = enabled !== undefined ? enabled : !this.preferences.soundEnabled;
    this.preferences.soundEnabled = val;
    this.saveState();
    if (val) this.playChime();
    return val;
  }

  public toggleBrowserPush(enabled?: boolean): boolean {
    const val = enabled !== undefined ? enabled : !this.preferences.browserNotificationsEnabled;
    this.preferences.browserNotificationsEnabled = val;
    this.saveState();
    return val;
  }

  public subscribeToOrder(orderId: string): void {
    if (!this.preferences.subscribedOrderIds.includes(orderId)) {
      this.preferences.subscribedOrderIds.push(orderId);
      this.saveState();
    }
  }

  public unsubscribeFromOrder(orderId: string): void {
    this.preferences.subscribedOrderIds = this.preferences.subscribedOrderIds.filter(
      (id) => id !== orderId
    );
    this.saveState();
  }

  public isSubscribedToOrder(orderId: string): boolean {
    return this.preferences.subscribedOrderIds.includes(orderId);
  }

  public getHistory(): InAppNotification[] {
    return [...this.history];
  }

  public markAllAsRead(): void {
    this.history = this.history.map((h) => ({ ...h, read: true }));
    this.saveState();
  }

  public clearHistory(): void {
    this.history = [];
    this.saveState();
  }

  /**
   * Synthesize a gentle, luxury xylophone/chime using Web Audio API
   */
  public playChime(): void {
    if (!this.preferences.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      // 3-note harmonic chime (D6 -> F#6 -> A6: bright, uplifting)
      playTone(1174.66, 0.0, 0.4);
      playTone(1479.98, 0.12, 0.45);
      playTone(1760.00, 0.24, 0.6);
    } catch {
      // AudioContext might be blocked until user gesture, ignore gracefully
    }
  }

  /**
   * Dispatches system browser notification if permitted and in preferences
   */
  public sendBrowserNotification(title: string, body: string, tag: string = 'aduke-order'): void {
    if (!this.isSupported()) return;
    if (Notification.permission !== 'granted' || !this.preferences.browserNotificationsEnabled) {
      return;
    }

    try {
      const options: NotificationOptions = {
        body,
        icon: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=192&h=192&fit=crop&crop=faces',
        badge: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=96&h=96&fit=crop&crop=faces',
        tag,
        silent: !this.preferences.soundEnabled,
      };

      const notification = new Notification(title, options);
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (err) {
      console.warn('Native notification error:', err);
    }
  }

  /**
   * Trigger status transition notification for an order
   */
  public notifyOrderStatus(order: RestaurantOrder, prevStatus?: OrderStatus): void {
    // Only notify if order is subscribed OR user has no specific order restrictions
    const isSubscribed = this.isSubscribedToOrder(order.id) || this.preferences.subscribedOrderIds.length === 0;
    if (!isSubscribed) return;

    const copy = this.getStatusCopy(order);

    // 1. Play sound
    this.playChime();

    // 2. Dispatch native browser notification
    this.sendBrowserNotification(copy.title, copy.body, `order-${order.id}`);

    // 3. Add to In-App History
    const inAppItem: InAppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      title: copy.title,
      body: copy.body,
      status: order.status,
      timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    this.history = [inAppItem, ...this.history.slice(0, 29)];
    this.saveState();
  }

  private getStatusCopy(order: RestaurantOrder): { title: string; body: string } {
    const isDelivery = order.orderType === 'delivery';
    const isTable = order.orderType === 'dine-in-table';

    switch (order.status) {
      case 'placed':
        return {
          title: `Order #${order.orderNumber} Received · Àdùkẹ́`,
          body: isTable
            ? `Your order for ${order.tableNumber || 'your table'} has been received by the floor manager.`
            : `Your order has been received by our host desk. Estimated: ${order.estimatedDeliveryTime}.`,
        };
      case 'confirmed':
        return {
          title: `Grill Master Confirmed #${order.orderNumber}`,
          body: 'Prime cuts seasoned with northern yaji and organic native herbs are prepped for the grill.',
        };
      case 'cooking':
        return {
          title: `Over Firewood & Charcoal Embers 🔥 (#${order.orderNumber})`,
          body: 'Your smoky jollof is simmering and char-blistered suya is searing over white oak coals.',
        };
      case 'ready':
        if (isDelivery) {
          return {
            title: `Dispatched with Lagos Courier 🛵 (#${order.orderNumber})`,
            body: `Your insulated order is en route to ${order.deliveryAddress || 'your address'}.`,
          };
        }
        if (isTable) {
          return {
            title: `Plated Fresh for ${order.tableNumber || 'Your Table'} 🍽️`,
            body: 'Our floor server is bringing your hot firewood dishes directly to your table.',
          };
        }
        return {
          title: `Plated & Ready for Pickup 🥡 (#${order.orderNumber})`,
          body: 'Your dishes are packaged warm and waiting for you at the 14 Adeola Odeku host desk.',
        };
      case 'completed':
        return {
          title: `Delivered! Ẹ gbádùn oúnjẹ yín (#${order.orderNumber})`,
          body: 'Thank you for dining with Àdùkẹ́ Modern Nigerian Gastronomy. Have a wonderful meal!',
        };
      case 'cancelled':
        return {
          title: `Order #${order.orderNumber} Cancelled`,
          body: 'This order has been cancelled. Please contact our host concierge for assistance.',
        };
      default:
        return {
          title: `Order Update #${order.orderNumber}`,
          body: `Your order status is now ${order.status}.`,
        };
    }
  }

  /**
   * Sends a test sample notification to allow the user to verify browser permissions
   */
  public sendTestNotification(): void {
    this.playChime();
    this.sendBrowserNotification(
      'Àdùkẹ́ Woodfire Embers 🔥',
      'Test Alert: Smoky jollof simmering over hardwood charcoal in Victoria Island!'
    );

    const testItem: InAppNotification = {
      id: `test-${Date.now()}`,
      orderId: 'test-demo',
      orderNumber: 'ADK-7720',
      title: 'Sample Status: Over Firewood Embers 🔥',
      body: 'Real-time push alerts are working perfectly on this device.',
      status: 'cooking',
      timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    this.history = [testItem, ...this.history.slice(0, 29)];
    this.saveState();
  }
}

export const notificationService = new NotificationService();

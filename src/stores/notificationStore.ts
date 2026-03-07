"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType = "trade" | "signal" | "system" | "billing";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  href?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

function countUnread(notifications: Notification[]) {
  return notifications.filter((n) => !n.read).length;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (n) =>
        set((state) => {
          const notification: Notification = {
            ...n,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            read: false,
          };
          // Keep last 50 notifications
          const updated = [notification, ...state.notifications].slice(0, 50);
          return { notifications: updated, unreadCount: countUnread(updated) };
        }),

      markRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return { notifications: updated, unreadCount: countUnread(updated) };
        }),

      markAllRead: () =>
        set((state) => {
          const updated = state.notifications.map((n) => ({ ...n, read: true }));
          return { notifications: updated, unreadCount: 0 };
        }),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "eulerx-notifications",
      partialize: (state) => ({ notifications: state.notifications }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.unreadCount = countUnread(state.notifications);
        }
      },
    }
  )
);

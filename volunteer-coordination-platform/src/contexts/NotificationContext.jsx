// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { 
  getNotifications, 
  getUnreadNotificationCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "../services/notifications";
import NotificationsDrawer from "../components/common/NotificationsDrawer";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    }
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchInitialData = async () => {
      const { data } = await getNotifications();
      setNotifications(data);
      const { count } = await getUnreadNotificationCount();
      setUnreadCount(count);
    };

    fetchInitialData();

    const channel = supabase
      .channel(`realtime-notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        markAsRead: handleMarkAsRead,
        markAllRead: handleMarkAllRead,
      }}
    >
      {children}
      {/* Drawer rendered globally here */}
      <NotificationsDrawer />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
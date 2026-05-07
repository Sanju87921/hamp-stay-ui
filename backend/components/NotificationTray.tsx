"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, PartyPopper, Wallet, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getNotificationsAction, 
  markNotificationAsReadAction, 
  markAllAsReadAction 
} from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";
import Link from "next/link";

export function NotificationTray({ isScrolled }: { isScrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      const data = await getNotificationsAction();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.isRead).length);
    }
    
    fetchNotifications();
    // Refresh every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsReadAction(id);
    if (result.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsReadAction();
    if (result.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "BOOKING": return <PartyPopper className="w-4 h-4 text-emerald-500" />;
      case "PAYMENT": return <Wallet className="w-4 h-4 text-amber-500" />;
      case "WARNING": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-full transition-all duration-300",
          isScrolled ? "hover:bg-sand-100 text-navy-950" : "hover:bg-white/10 text-white"
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-sand-100 overflow-hidden z-50 origin-top-right"
            >
              <div className="p-4 bg-sand-50 border-b border-sand-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy-950 uppercase tracking-widest">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-bold text-gold-600 hover:text-gold-700 uppercase tracking-wider"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-sand-200 mx-auto mb-3" />
                    <p className="text-sm text-navy-950/40">No new alerts.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-sand-50 transition-colors relative group",
                        notification.isRead ? "bg-white" : "bg-indigo-50/30"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className={cn(
                              "text-sm font-bold leading-tight mb-1",
                              notification.isRead ? "text-navy-950/80" : "text-navy-950"
                            )}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded transition-all"
                              >
                                <Check className="w-3 h-3 text-emerald-500" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-navy-950/50 leading-relaxed mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-navy-950/30 font-medium">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            {notification.link && (
                              <Link
                                href={notification.link}
                                onClick={() => {
                                  setIsOpen(false);
                                  handleMarkAsRead(notification.id);
                                }}
                                className="text-[10px] font-bold text-gold-600 uppercase tracking-widest hover:underline"
                              >
                                View
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block p-3 text-center text-[10px] font-bold text-navy-950/40 uppercase tracking-widest hover:bg-sand-50 transition-colors"
                >
                  View All Notifications
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

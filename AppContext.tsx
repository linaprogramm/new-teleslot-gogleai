import React, { createContext, useContext, useState, useEffect } from 'react';
import { Channel, Order, BloggerSubmission, OrderStatus, Slot } from '../types';
import { INITIAL_CHANNELS, INITIAL_ORDERS, INITIAL_SUBMISSIONS } from '../data/initialData';

interface AppContextType {
  channels: Channel[];
  orders: Order[];
  submissions: BloggerSubmission[];
  currentUser: string;
  isAdminUnlocked: boolean;
  setCurrentUser: (username: string) => void;
  unlockAdmin: (pin: string) => boolean;
  lockAdmin: () => void;
  addSlotToChannel: (channelId: string, slotData: { date: string; time: string; price: number }) => void;
  removeSlot: (channelId: string, slotId: string) => void;
  bookSlot: (orderParams: {
    channelId: string;
    slotId: string;
    format: 'photo' | 'repost' | 'story' | 'link';
    formatLabel: string;
    finalPrice: number;
    postLink?: string;
    comments?: string;
    advertiserHandle?: string;
  }) => Order;
  submitBloggerChannel: (submission: Omit<BloggerSubmission, 'id' | 'submittedAt' | 'status'>) => BloggerSubmission;
  approveSubmission: (submissionId: string) => void;
  rejectSubmission: (submissionId: string, reason?: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CHANNELS: 'teleslot_channels_v2',
  ORDERS: 'teleslot_orders_v2',
  SUBMISSIONS: 'teleslot_submissions_v2',
  USER: 'teleslot_current_user_v2',
  ADMIN: 'teleslot_admin_unlocked_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read from localStorage or fallback
  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHANNELS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse channels from localStorage', e);
    }
    return INITIAL_CHANNELS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse orders from localStorage', e);
    }
    return INITIAL_ORDERS;
  });

  const [submissions, setSubmissions] = useState<BloggerSubmission[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse submissions from localStorage', e);
    }
    return INITIAL_SUBMISSIONS;
  });

  const [currentUser, setCurrentUserState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) return stored;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }
    // Check Telegram WebApp user if available
    try {
      const tgUser = (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { username?: string } } } } })?.Telegram?.WebApp?.initDataUnsafe?.user?.username;
      if (tgUser) return `@${tgUser}`;
    } catch {
      // fallback
    }
    return '@founder_pro';
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN, String(isAdminUnlocked));
  }, [isAdminUnlocked]);

  const setCurrentUser = (username: string) => {
    const clean = username.startsWith('@') ? username : `@${username}`;
    setCurrentUserState(clean);
  };

  const unlockAdmin = (pin: string): boolean => {
    if (pin.trim() === '7788' || pin.trim().toLowerCase() === 'admin') {
      setIsAdminUnlocked(true);
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
  };

  const addSlotToChannel = (channelId: string, slotData: { date: string; time: string; price: number }) => {
    const newSlot: Slot = {
      id: `slot-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: slotData.date,
      time: slotData.time,
      price: slotData.price,
      status: 'free',
    };

    setChannels(prev =>
      prev.map(ch => {
        if (ch.id === channelId) {
          return {
            ...ch,
            slots: [...ch.slots, newSlot],
          };
        }
        return ch;
      })
    );
  };

  const removeSlot = (channelId: string, slotId: string) => {
    setChannels(prev =>
      prev.map(ch => {
        if (ch.id === channelId) {
          return {
            ...ch,
            slots: ch.slots.filter(s => s.id !== slotId),
          };
        }
        return ch;
      })
    );
  };

  const bookSlot = (orderParams: {
    channelId: string;
    slotId: string;
    format: 'photo' | 'repost' | 'story' | 'link';
    formatLabel: string;
    finalPrice: number;
    postLink?: string;
    comments?: string;
    advertiserHandle?: string;
  }): Order => {
    const channel = channels.find(c => c.id === orderParams.channelId);
    if (!channel) throw new Error('Канал не найден');

    const slot = channel.slots.find(s => s.id === orderParams.slotId) || channel.slots[0];
    const advertiser = orderParams.advertiserHandle || currentUser;

    const orderId = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockErid = `2Vtzqw${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      advertiserHandle: advertiser,
      channelId: channel.id,
      channelName: channel.name,
      channelHandle: channel.handle,
      channelAvatar: channel.avatar,
      channelUrl: channel.channelUrl,
      slotId: slot.id,
      slotDate: slot.date,
      slotTime: slot.time,
      format: orderParams.format,
      formatLabel: orderParams.formatLabel,
      price: orderParams.finalPrice,
      status: 'Оплачено',
      erid: mockErid,
      postLink: orderParams.postLink,
      comments: orderParams.comments,
      paymentMethod: 'СБП (Escrow защита)',
    };

    // Update slot status in channel to booked
    setChannels(prev =>
      prev.map(ch => {
        if (ch.id === channel.id) {
          return {
            ...ch,
            slots: ch.slots.map(s => (s.id === slot.id ? { ...s, status: 'booked', bookedBy: advertiser } : s)),
          };
        }
        return ch;
      })
    );

    // Prepend to orders
    setOrders(prev => [newOrder, ...prev]);

    return newOrder;
  };

  const submitBloggerChannel = (
    submissionData: Omit<BloggerSubmission, 'id' | 'submittedAt' | 'status'>
  ): BloggerSubmission => {
    const newSubmission: BloggerSubmission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      submittedAt: 'Только что',
      status: 'pending',
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    return newSubmission;
  };

  const approveSubmission = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    // Create channel in approved state with slots
    const newChannel: Channel = {
      id: `ch-${Date.now()}`,
      name: sub.channelName,
      handle: sub.channelHandle.startsWith('@') ? sub.channelHandle : `@${sub.channelHandle}`,
      channelUrl: sub.channelUrl || `https://t.me/${sub.channelHandle.replace('@', '')}`,
      platform: sub.platform,
      category: sub.category,
      categoryLabel: sub.categoryLabel,
      subscribers: sub.subscribers,
      dailyViews: sub.dailyViews,
      err: sub.err,
      badge: '🌱 Новый канал',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      verified: true,
      eridAuto: true,
      ownerUsername: sub.bloggerUsername,
      inn: sub.inn,
      description: sub.description || 'Проверенный канал биржи TeleSlot.',
      basePrice: sub.desiredBasePrice,
      slots: sub.initialSlots.map((s, idx) => ({
        id: `slot-${Date.now()}-${idx}`,
        date: s.date,
        time: s.time,
        price: s.price,
        status: 'free',
      })),
      demographics: {
        gender: { male: 45, female: 55 },
        age: [
          { label: '18-24', pct: 45 },
          { label: '25-34', pct: 38 },
          { label: '35+', pct: 17 },
        ],
        geo: [
          { country: 'Россия', pct: 84 },
          { country: 'Беларусь', pct: 8 },
          { country: 'Другие', pct: 8 },
        ],
      },
      status: 'approved',
    };

    // Add to channels and mark submission approved
    setChannels(prev => [newChannel, ...prev]);
    setSubmissions(prev => prev.map(s => (s.id === submissionId ? { ...s, status: 'approved' } : s)));
  };

  const rejectSubmission = (submissionId: string, reason?: string) => {
    setSubmissions(prev =>
      prev.map(s => (s.id === submissionId ? { ...s, status: 'rejected', rejectionReason: reason || 'Не соответствует правилам биржи' } : s))
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.CHANNELS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN);

    setChannels(INITIAL_CHANNELS);
    setOrders(INITIAL_ORDERS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setIsAdminUnlocked(false);
  };

  return (
    <AppContext.Provider
      value={{
        channels,
        orders,
        submissions,
        currentUser,
        isAdminUnlocked,
        setCurrentUser,
        unlockAdmin,
        lockAdmin,
        addSlotToChannel,
        removeSlot,
        bookSlot,
        submitBloggerChannel,
        approveSubmission,
        rejectSubmission,
        updateOrderStatus,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

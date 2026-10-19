import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TelegramHeader } from './components/TelegramHeader';
import { CatalogView } from './components/CatalogView';
import { ChannelDetailModal } from './components/ChannelDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { BloggerCabinetView } from './components/BloggerCabinetView';
import { AdminCrmView } from './components/AdminCrmView';
import { AdvertiserOrdersView } from './components/AdvertiserOrdersView';
import { Channel, FormatType, Slot, Order } from './types';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'blogger' | 'admin'>('catalog');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [checkoutDetails, setCheckoutDetails] = useState<{
    channel: Channel;
    slot: Slot;
    format: FormatType;
    finalPrice: number;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenDetail = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const handleProceedToBooking = (details: {
    channel: Channel;
    selectedSlot: Slot;
    selectedFormat: FormatType;
    finalPrice: number;
  }) => {
    setSelectedChannel(null);
    setCheckoutDetails({
      channel: details.channel,
      slot: details.selectedSlot,
      format: details.selectedFormat,
      finalPrice: details.finalPrice,
    });
  };

  const handleOrderSuccess = (order: Order) => {
    setCheckoutDetails(null);
    triggerToast(`Слот #${order.id} успешно забронирован! Токен erid: ${order.erid}`);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#15171E] flex flex-col items-center justify-start antialiased">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#15171E] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#EE8FA5]/40 animate-in fade-in slide-in-from-top-3 max-w-[90vw]">
          <span className="text-base">🎉</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Telegram Mini App Shell Container (max-w-lg for crisp mobile-first viewport) */}
      <div className="w-full max-w-lg bg-white min-h-screen shadow-xl flex flex-col relative border-x border-[#E9E6EC]">
        {/* Telegram Top Header & Role Switcher */}
        <TelegramHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Body Based on Active Tab */}
        <main className="flex-1 p-3.5 sm:p-4">
          {activeTab === 'catalog' && (
            <CatalogView
              onSelectChannel={handleOpenDetail}
              onOpenBloggerSubmit={() => setActiveTab('blogger')}
            />
          )}

          {activeTab === 'orders' && <AdvertiserOrdersView />}

          {activeTab === 'blogger' && <BloggerCabinetView />}

          {activeTab === 'admin' && <AdminCrmView />}
        </main>

        {/* Bottom Floating Bar on Mobile */}
        <footer className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-[#E9E6EC] py-2 px-4 flex items-center justify-around text-center select-none text-[10px] text-gray-500 z-30">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
              activeTab === 'catalog' ? 'text-[#C05572] font-black' : 'hover:text-[#15171E]'
            }`}
          >
            <span className="text-base">🛍️</span>
            <span>Каталог</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
              activeTab === 'orders' ? 'text-[#C05572] font-black' : 'hover:text-[#15171E]'
            }`}
          >
            <span className="text-base">📦</span>
            <span>Заказы</span>
          </button>

          <button
            onClick={() => setActiveTab('blogger')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
              activeTab === 'blogger' ? 'text-[#C05572] font-black' : 'hover:text-[#15171E]'
            }`}
          >
            <span className="text-base">🎙️</span>
            <span>Блогеру</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
              activeTab === 'admin' ? 'text-[#C05572] font-black' : 'hover:text-[#15171E]'
            }`}
          >
            <span className="text-base">🔐</span>
            <span>CRM</span>
          </button>
        </footer>
      </div>

      {/* Modal 1: Подробнее о канале блогера */}
      {selectedChannel && (
        <ChannelDetailModal
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
          onProceedToBooking={handleProceedToBooking}
        />
      )}

      {/* Modal 2: Оформление заказа & Оплата (с заглушкой по ТЗ) */}
      {checkoutDetails && (
        <CheckoutModal
          channel={checkoutDetails.channel}
          slot={checkoutDetails.slot}
          format={checkoutDetails.format}
          finalPrice={checkoutDetails.finalPrice}
          onClose={() => setCheckoutDetails(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

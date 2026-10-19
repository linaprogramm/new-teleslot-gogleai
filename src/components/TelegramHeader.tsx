import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Sparkles, Check, Lock, ChevronDown } from 'lucide-react';

interface TelegramHeaderProps {
  activeTab: 'catalog' | 'orders' | 'blogger' | 'admin';
  setActiveTab: (tab: 'catalog' | 'orders' | 'blogger' | 'admin') => void;
}

export const TelegramHeader: React.FC<TelegramHeaderProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, setCurrentUser, orders, submissions, isAdminUnlocked } = useApp();
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userInput, setUserInput] = useState(currentUser);

  const pendingSubmissionsCount = submissions.filter(s => s.status === 'pending').length;
  const userOrdersCount = orders.filter(o => o.advertiserHandle.toLowerCase() === currentUser.toLowerCase()).length;

  const handleSaveUser = () => {
    if (userInput.trim()) {
      setCurrentUser(userInput.trim());
    }
    setIsEditingUser(false);
  };

  const sampleUsers = ['@founder_pro', '@sofa_cozy', '@artem_crypto_dev', '@alex_startup'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9E6EC]">
      {/* Telegram Native Bar Simulator */}
      <div className="bg-[#15171E] text-white px-4 py-2 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="text-[#2AABEE] font-semibold cursor-pointer hover:underline">
            ✕ Закрыть
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300 font-medium">TeleSlot • TG + MAX</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <span className="inline-block w-2 h-2 rounded-full bg-[#2CB67D] animate-pulse"></span>
          <span className="text-[11px] text-gray-400">Mini App v2.6</span>
          <span className="cursor-pointer font-bold tracking-widest hover:text-white">•••</span>
        </div>
      </div>

      {/* Main Branding & Active User Section */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#15171E] to-[#2D3240] text-white flex items-center justify-center font-black text-sm relative shadow-sm">
            TS
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EE8FA5] border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[17px] text-[#15171E] tracking-tight">TeleSlot</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FDEEF2] text-[#C05572] px-1.5 py-0.5 rounded border border-[#F6CDD7]">
                Биржа
              </span>
            </div>
            <div className="text-[11px] text-gray-500 flex items-center gap-1">
              <span>Слоты рекламы & erid</span>
            </div>
          </div>
        </div>

        {/* Telegram User Pill / Switcher */}
        <div className="relative">
          {isEditingUser ? (
            <div className="flex items-center gap-1 bg-[#F4F3F6] rounded-full p-1 border border-[#DFDBE3]">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="@username"
                className="text-xs px-2 py-1 bg-transparent w-28 outline-none text-[#15171E] font-medium"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveUser();
                  if (e.key === 'Escape') setIsEditingUser(false);
                }}
              />
              <button
                onClick={handleSaveUser}
                className="w-6 h-6 bg-[#15171E] text-white rounded-full flex items-center justify-center text-xs hover:bg-black transition"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setUserInput(currentUser);
                setIsEditingUser(true);
              }}
              title="Нажмите, чтобы сменить Telegram-никнейм"
              className="flex items-center gap-1.5 bg-[#FDEEF2] hover:bg-[#F9E2E8] border border-[#F6CDD7] text-[#9E3E56] px-2.5 py-1.5 rounded-full text-xs font-semibold transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C05572]" />
              <span className="max-w-[110px] truncate">{currentUser}</span>
              <ChevronDown className="w-3 h-3 text-[#C05572] opacity-70" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs (Mobile-Friendly Pill Bar) */}
      <nav className="px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'bg-[#15171E] text-white shadow-sm'
              : 'bg-[#F4F3F6] text-gray-700 hover:bg-[#EAE8ED]'
          }`}
        >
          <span>🛍️</span>
          <span>Каталог</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#15171E] text-white shadow-sm'
              : 'bg-[#F4F3F6] text-gray-700 hover:bg-[#EAE8ED]'
          }`}
        >
          <span>📦</span>
          <span>Мои заказы</span>
          {userOrdersCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'orders' ? 'bg-[#EE8FA5] text-white' : 'bg-gray-300 text-gray-800'
              }`}
            >
              {userOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('blogger')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'blogger'
              ? 'bg-[#15171E] text-white shadow-sm'
              : 'bg-[#F4F3F6] text-gray-700 hover:bg-[#EAE8ED]'
          }`}
        >
          <span>🎙️</span>
          <span>Кабинет блогера</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'admin'
              ? 'bg-gradient-to-r from-[#C05572] to-[#DF768E] text-white shadow-sm'
              : 'bg-[#FDEEF2] text-[#9E3E56] hover:bg-[#F9E2E8]'
          }`}
        >
          <Lock className="w-3 h-3" />
          <span>CRM</span>
          {pendingSubmissionsCount > 0 && (
            <span className="text-[10px] bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded-full animate-pulse">
              {pendingSubmissionsCount}
            </span>
          )}
        </button>
      </nav>

      {/* Quick User Switcher Hint (Small Drawer on click) */}
      {isEditingUser && (
        <div className="bg-[#FFF0F4] border-t border-[#F6CDD7] px-4 py-2 flex items-center justify-between text-[11px] text-[#9E3E56]">
          <span>Быстрый выбор тестового ника:</span>
          <div className="flex gap-1.5 flex-wrap">
            {sampleUsers.map(u => (
              <button
                key={u}
                onClick={() => {
                  setCurrentUser(u);
                  setIsEditingUser(false);
                }}
                className="bg-white px-2 py-0.5 rounded border border-[#F6CDD7] font-semibold hover:bg-[#FDEEF2]"
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

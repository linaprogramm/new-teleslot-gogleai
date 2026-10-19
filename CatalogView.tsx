import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Channel } from '../types';
import { CATEGORIES, POST_FORMATS } from '../data/initialData';
import { Search, Sparkles, TrendingUp, Users, Clock, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface CatalogViewProps {
  onSelectChannel: (channel: Channel) => void;
  onOpenBloggerSubmit: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onSelectChannel, onOpenBloggerSubmit }) => {
  const { channels } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Only approved channels show in catalog
  const approvedChannels = useMemo(() => {
    return channels.filter(c => c.status === 'approved');
  }, [channels]);

  // Statistics calculation for Requirement 3: «Блок статистики: средняя цена, количество каналов»
  const stats = useMemo(() => {
    const totalChannels = approvedChannels.length;
    let totalSlots = 0;
    let freeSlots = 0;
    let priceSum = 0;
    let slotCountWithPrice = 0;

    approvedChannels.forEach(c => {
      totalSlots += c.slots.length;
      c.slots.forEach(s => {
        if (s.status === 'free') {
          freeSlots++;
          priceSum += s.price;
          slotCountWithPrice++;
        }
      });
    });

    const avgPrice = slotCountWithPrice > 0 ? Math.round(priceSum / slotCountWithPrice) : 5200;
    const totalAudience = approvedChannels.reduce((sum, c) => sum + c.subscribers, 0);

    return {
      totalChannels,
      freeSlots,
      avgPrice,
      totalAudience,
    };
  }, [approvedChannels]);

  // Filter channels by category and search
  const filteredChannels = useMemo(() => {
    return approvedChannels.filter(c => {
      // Category filter
      if (selectedCategory === 'deals') {
        const hasDeal = c.badge?.includes('Скидка') || c.badge?.includes('🔥');
        if (!hasDeal) return false;
      } else if (selectedCategory === 'mini') {
        if (c.subscribers > 15000 && c.basePrice > 2000) return false;
      } else if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesHandle = c.handle.toLowerCase().includes(query);
        const matchesDesc = c.description.toLowerCase().includes(query);
        return matchesName || matchesHandle || matchesDesc;
      }

      return true;
    });
  }, [approvedChannels, selectedCategory, searchQuery]);

  // Helper to get minimum price "от..." for a channel (considering the lowest format modifier e.g. Stories -40%)
  const getMinPrice = (channel: Channel) => {
    const minSlotPrice = channel.slots.length > 0
      ? Math.min(...channel.slots.map(s => s.price))
      : channel.basePrice;
    
    // Stories format gives 40% discount (0.6 multiplier)
    const storyMod = POST_FORMATS.find(f => f.id === 'story')?.priceMod || 0.6;
    return Math.round(minSlotPrice * storyMod);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Блок статистики: средняя цена, количество каналов и охват */}
      <div className="bg-gradient-to-br from-[#15171E] to-[#252A37] text-white rounded-3xl p-4 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#EE8FA5]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2CB67D]"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
              Статистика биржи
            </span>
          </div>
          <span className="text-[11px] bg-white/10 text-[#FFAEC0] font-semibold px-2 py-0.5 rounded-full border border-white/10">
            ✓ ОРД & Escrow
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
            <div className="text-[10px] text-gray-400 font-medium">Каналов</div>
            <div className="text-lg font-black text-white mt-0.5">{stats.totalChannels}</div>
            <div className="text-[9px] text-[#2CB67D] font-semibold">100% проверены</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
            <div className="text-[10px] text-gray-400 font-medium">Средняя цена</div>
            <div className="text-lg font-black text-[#FFAEC0] mt-0.5">
              {stats.avgPrice.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[9px] text-gray-300">за слот</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
            <div className="text-[10px] text-gray-400 font-medium">Свободных слотов</div>
            <div className="text-lg font-black text-white mt-0.5">{stats.freeSlots}</div>
            <div className="text-[9px] text-[#2CB67D] font-semibold">на сегодня / завтра</div>
          </div>
        </div>
      </div>

      {/* Quick Blogger CTA Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FDEEF2] to-[#FFF8FA] border border-[#F6CDD7] rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🌱</span>
          <div>
            <div className="text-xs font-bold text-[#15171E]">Вы автор Telegram-канала?</div>
            <div className="text-[11px] text-[#9E3E56]">Подключаем от 500+ подписчиков • 100% Escrow</div>
          </div>
        </div>
        <button
          onClick={onOpenBloggerSubmit}
          className="bg-[#15171E] hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm shrink-0"
        >
          <span>Предложить</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Поиск канала по названию, нику или теме..."
          className="w-full bg-white border border-[#DFDBE3] focus:border-[#EE8FA5] focus:ring-2 focus:ring-[#FDEEF2] rounded-2xl pl-9 pr-3.5 py-2.5 text-xs text-[#15171E] placeholder:text-gray-400 outline-none transition shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#15171E] text-white shadow-xs'
                  : 'bg-white border border-[#E9E6EC] text-gray-600 hover:border-[#F6CDD7] hover:text-[#15171E]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Channels List / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>Найдено каналов: <b className="text-[#15171E]">{filteredChannels.length}</b></span>
          <span className="text-[11px] text-[#C05572] font-semibold">Кликните на карточку для деталей</span>
        </div>

        {filteredChannels.length === 0 ? (
          <div className="bg-white border border-[#E9E6EC] rounded-2xl p-8 text-center space-y-2">
            <span className="text-3xl block">🔍</span>
            <div className="font-bold text-sm text-[#15171E]">Каналы не найдены</div>
            <div className="text-xs text-gray-500">Попробуйте изменить категорию или поисковый запрос</div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs text-[#C05572] font-bold underline"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          filteredChannels.map(channel => {
            const minPrice = getMinPrice(channel);
            const freeSlots = channel.slots.filter(s => s.status === 'free');
            const earliestSlot = freeSlots[0];

            return (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                className="bg-white border border-[#E9E6EC] hover:border-[#EE8FA5] rounded-3xl p-3.5 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.99] relative overflow-hidden group"
              >
                {/* Channel Header (Avatar + Name + Badge) */}
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-13 h-13 rounded-2xl object-cover border border-[#F6CDD7] shadow-xs"
                    />
                    {channel.verified && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#2AABEE] text-white rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-extrabold text-[15px] text-[#15171E] truncate group-hover:text-[#C05572] transition">
                        {channel.name}
                      </h3>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EBF3FC] text-[#1E88E5] border border-[#D0E2FC] shrink-0">
                        {channel.platform}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      <span className="font-medium text-gray-600">{channel.handle}</span>
                      <span>•</span>
                      <span className="text-[#2CB67D] font-semibold flex items-center gap-0.5 text-[11px]">
                        ✓ erid авто
                      </span>
                    </div>

                    {channel.badge && (
                      <span className="inline-block mt-1 text-[10px] font-bold bg-[#FFF0F4] text-[#C05572] px-2 py-0.5 rounded-md border border-[#F6CDD7]">
                        {channel.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics Row: Subscribers, 24h Views, ERR */}
                <div className="grid grid-cols-3 gap-2 bg-[#F8F9FA] rounded-2xl p-2 my-2.5 text-center border border-[#F0EDF2]">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Подписчики</div>
                    <div className="text-xs font-black text-[#15171E]">
                      {(channel.subscribers / 1000).toFixed(channel.subscribers >= 10000 ? 0 : 1)}k
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Охват 24ч</div>
                    <div className="text-xs font-black text-[#15171E]">
                      {(channel.dailyViews / 1000).toFixed(1)}k
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">ERR</div>
                    <div className="text-xs font-black text-[#2CB67D]">
                      {channel.err}
                    </div>
                  </div>
                </div>

                {/* Footer: Earliest Slot Pill + Price "от..." + Button "Подробнее" */}
                <div className="flex items-center justify-between pt-1 border-t border-[#F2EFF4]">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#C05572]" />
                    {earliestSlot ? (
                      <span className="text-gray-700">
                        Ближайший: <b className="text-[#15171E]">{earliestSlot.date}, {earliestSlot.time}</b>
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Слоты под запрос</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block -mb-0.5">от</span>
                      <span className="text-sm font-extrabold text-[#15171E]">
                        {minPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectChannel(channel);
                      }}
                      className="bg-[#FDEEF2] hover:bg-[#EE8FA5] hover:text-white text-[#9E3E56] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#F6CDD7] transition shadow-xs"
                    >
                      Подробнее →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

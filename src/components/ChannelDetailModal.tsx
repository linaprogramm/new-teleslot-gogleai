import React, { useState } from 'react';
import { Channel, FormatType, Slot } from '../types';
import { POST_FORMATS } from '../data/initialData';
import { X, ExternalLink, ShieldCheck, Check, Clock, TrendingUp, Users, Calendar, Sparkles } from 'lucide-react';

interface ChannelDetailModalProps {
  channel: Channel;
  onClose: () => void;
  onProceedToBooking: (bookingDetails: {
    channel: Channel;
    selectedSlot: Slot;
    selectedFormat: FormatType;
    finalPrice: number;
  }) => void;
}

export const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({
  channel,
  onClose,
  onProceedToBooking,
}) => {
  // Find first free slot or fallback
  const firstFreeSlot = channel.slots.find(s => s.status === 'free') || channel.slots[0];
  const [selectedSlotId, setSelectedSlotId] = useState<string>(firstFreeSlot?.id || '');
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('photo');

  const selectedSlot = channel.slots.find(s => s.id === selectedSlotId) || firstFreeSlot;
  const currentFormatObj = POST_FORMATS.find(f => f.id === selectedFormat) || POST_FORMATS[0];

  // Base price of the chosen slot
  const slotBasePrice = selectedSlot ? selectedSlot.price : channel.basePrice;
  // Recalculated price based on format: Пост 1.0, Репост 0.75, История 0.60, Ссылка 0.85
  const finalPrice = Math.round(slotBasePrice * currentFormatObj.priceMod);

  const handleBooking = () => {
    if (!selectedSlot) return;
    onProceedToBooking({
      channel,
      selectedSlot,
      selectedFormat,
      finalPrice,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#E9E6EC] animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-[#F0EDF2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Информация о блогере</span>
            <span className="text-[10px] bg-[#E8F8F0] text-[#1A8452] font-extrabold px-2 py-0.5 rounded-full border border-[#B7EBCE]">
              ✓ ОРД готов
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F3F6] hover:bg-[#EAE8ED] flex items-center justify-center text-gray-500 hover:text-black transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Channel Top Card */}
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0">
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F6CDD7] shadow-sm"
              />
              {channel.verified && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2AABEE] text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                  ✓
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h2 className="font-extrabold text-lg text-[#15171E] leading-tight">
                  {channel.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3FC] text-[#1E88E5] border border-[#D0E2FC] shrink-0">
                  {channel.platform}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <a
                  href={channel.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2AABEE] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>{channel.handle}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>•</span>
                <span className="text-gray-600 font-medium">{channel.categoryLabel}</span>
              </div>

              <p className="text-xs text-gray-600 mt-2 leading-relaxed bg-[#F8F9FA] p-2.5 rounded-xl border border-[#F0EDF2]">
                {channel.description}
              </p>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span>📊 Аудитория и вовлечение (TGStat)</span>
              <span className="text-[11px] text-[#2CB67D] font-semibold">100% живой трафик</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#F8F9FA] border border-[#E9E6EC] rounded-2xl p-2.5">
                <div className="text-[10px] text-gray-400 font-bold uppercase">Подписчики</div>
                <div className="text-base font-black text-[#15171E] mt-0.5">
                  {(channel.subscribers / 1000).toFixed(0)}k
                </div>
                <div className="text-[9px] text-gray-500">читателей</div>
              </div>

              <div className="bg-[#F8F9FA] border border-[#E9E6EC] rounded-2xl p-2.5">
                <div className="text-[10px] text-gray-400 font-bold uppercase">Охват 24ч</div>
                <div className="text-base font-black text-[#15171E] mt-0.5">
                  {(channel.dailyViews / 1000).toFixed(1)}k
                </div>
                <div className="text-[9px] text-gray-500">на пост</div>
              </div>

              <div className="bg-[#F8F9FA] border border-[#E9E6EC] rounded-2xl p-2.5">
                <div className="text-[10px] text-gray-400 font-bold uppercase">ERR активность</div>
                <div className="text-base font-black text-[#C05572] mt-0.5">
                  {channel.err}
                </div>
                <div className="text-[9px] text-[#2CB67D] font-semibold">выше среднего</div>
              </div>
            </div>

            {/* Demographics & Activity Bars */}
            <div className="bg-[#F8F9FA] border border-[#E9E6EC] rounded-2xl p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-600">Пол аудитории:</span>
                <span className="text-[11px] font-bold text-gray-800">
                  Женщины {channel.demographics.gender.female}% • Мужчины {channel.demographics.gender.male}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden flex bg-gray-200">
                <div
                  className="bg-[#EE8FA5]"
                  style={{ width: `${channel.demographics.gender.female}%` }}
                />
                <div
                  className="bg-[#2D3240]"
                  style={{ width: `${channel.demographics.gender.male}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span>Гео: Россия ({channel.demographics.geo[0].pct}%), СНГ ({100 - channel.demographics.geo[0].pct}%)</span>
                <span>Возраст: 18–34 лет (80%+)</span>
              </div>
            </div>
          </div>

          {/* 1. Выбор формата рекламы (Пост, Репост, История, Ссылка) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#15171E]">
                1. Выберите вид рекламы (цена пересчитывается):
              </span>
              <span className="text-[11px] font-bold text-[#C05572] bg-[#FFF0F4] px-2 py-0.5 rounded-full border border-[#F6CDD7]">
                {currentFormatObj.label} ({currentFormatObj.tag})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {POST_FORMATS.map(f => {
                const isSelected = selectedFormat === f.id;
                const calcPrice = Math.round(slotBasePrice * f.priceMod);

                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFormat(f.id)}
                    className={`p-3 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FFF0F4] border-[#EE8FA5] shadow-sm ring-1 ring-[#EE8FA5]'
                        : 'bg-white border-[#E9E6EC] hover:border-[#F6CDD7]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{f.icon}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'bg-[#EE8FA5] text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {f.tag}
                      </span>
                    </div>

                    <div className="font-extrabold text-xs text-[#15171E]">{f.label}</div>
                    <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{f.desc}</div>

                    <div className="text-xs font-black text-[#C05572] mt-2">
                      {calcPrice.toLocaleString('ru-RU')} ₽
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Выбор свободного слота (Дата и Время) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#15171E]">
                2. Выберите свободный слот (во сколько):
              </span>
              <span className="text-[11px] text-gray-500">
                Свободно: {channel.slots.filter(s => s.status === 'free').length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {channel.slots.map(slot => {
                const isSelected = selectedSlotId === slot.id;
                const isBooked = slot.status === 'booked';
                const slotFmtPrice = Math.round(slot.price * currentFormatObj.priceMod);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-2.5 rounded-2xl text-left border transition text-xs flex flex-col justify-between ${
                      isBooked
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-[#15171E] text-white border-[#15171E] shadow-sm'
                        : 'bg-[#F8F9FA] hover:bg-white border-[#E9E6EC] text-[#15171E]'
                    }`}
                  >
                    <div className="text-[11px] font-medium opacity-80">{slot.date}</div>
                    <div className="text-sm font-black flex items-center justify-between mt-0.5">
                      <span>{slot.time}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#EE8FA5]" />}
                    </div>

                    <div
                      className={`text-[10px] font-bold mt-1.5 ${
                        isBooked
                          ? 'text-red-400'
                          : isSelected
                          ? 'text-[#FFAEC0]'
                          : 'text-gray-500'
                      }`}
                    >
                      {isBooked ? 'Занят' : `${slotFmtPrice.toLocaleString('ru-RU')} ₽`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auto-marking erid & Escrow Guarantee Callout */}
          <div className="bg-[#E8F8F0] border border-[#B7EBCE] rounded-2xl p-3 flex items-start gap-2.5 text-xs text-[#1A8452]">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#1A8452]" />
            <div>
              <div className="font-bold">100% Безопасная сделка Escrow & Авто-маркировка erid</div>
              <div className="text-[11px] text-[#246B46] mt-0.5">
                Деньги замораживаются до проверки публикации ботом. Токен ОРД присваивается автоматически по ФЗ-38.
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Modal Footer with Live Price & Booking Button */}
        <div className="sticky bottom-0 bg-white border-t border-[#E9E6EC] p-4 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="text-[11px] text-gray-400">Итоговая стоимость:</div>
            <div className="text-xl font-black text-[#15171E] transition-all">
              {finalPrice.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[10px] text-[#C05572] font-semibold">
              {currentFormatObj.label} • {selectedSlot?.date}, {selectedSlot?.time}
            </div>
          </div>

          <button
            type="button"
            onClick={handleBooking}
            className="flex-1 bg-gradient-to-r from-[#15171E] to-[#2D3240] hover:from-black hover:to-[#15171E] text-white font-extrabold text-sm py-3.5 px-5 rounded-2xl shadow-md transition transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Забронировать</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

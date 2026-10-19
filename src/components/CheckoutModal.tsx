import React, { useState } from 'react';
import { Channel, FormatType, Slot, Order } from '../types';
import { POST_FORMATS } from '../data/initialData';
import { useApp } from '../context/AppContext';
import { PaymentStubModal } from './PaymentStubModal';
import { X, ShieldCheck, ArrowRight, Check, AlertCircle } from 'lucide-react';

interface CheckoutModalProps {
  channel: Channel;
  slot: Slot;
  format: FormatType;
  finalPrice: number;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  channel,
  slot,
  format,
  finalPrice,
  onClose,
  onOrderSuccess,
}) => {
  const { currentUser, bookSlot } = useApp();

  const [advertiserHandle, setAdvertiserHandle] = useState<string>(currentUser);
  const [postLink, setPostLink] = useState<string>('https://t.me/founder_pro/42');
  const [comments, setComments] = useState<string>('Опубликовать строго в указанный слот с нативной подводкой');
  const [paymentMethod, setPaymentMethod] = useState<string>('sbp');
  const [agreedCompliance, setAgreedCompliance] = useState<boolean>(true);
  const [showStub, setShowStub] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const formatObj = POST_FORMATS.find(f => f.id === format) || POST_FORMATS[0];

  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!advertiserHandle.trim()) {
      setErrorMsg('Укажите ваш Telegram-контакт для связи');
      return;
    }

    if (!postLink.trim() && !comments.trim()) {
      setErrorMsg('Укажите ссылку на рекламный пост или текст публикации');
      return;
    }

    if (!agreedCompliance) {
      setErrorMsg('Подтвердите соответствие правилам модерации (без казино, пирамид, 18+)');
      return;
    }

    // Opens Requirement 7 Payment Stub Modal
    setShowStub(true);
  };

  const handleCompleteOrder = () => {
    try {
      const newOrder = bookSlot({
        channelId: channel.id,
        slotId: slot.id,
        format: format,
        formatLabel: formatObj.label,
        finalPrice: finalPrice,
        postLink: postLink.trim(),
        comments: comments.trim(),
        advertiserHandle: advertiserHandle.trim(),
      });

      setShowStub(false);
      onOrderSuccess(newOrder);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка при оформлении заказа';
      setErrorMsg(message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#E9E6EC] animate-in slide-in-from-bottom duration-300"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-[#F0EDF2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Оформление и бронирование
              </span>
              <span className="text-[10px] bg-[#E8F8F0] text-[#1A8452] font-extrabold px-2 py-0.5 rounded-full border border-[#B7EBCE]">
                Escrow
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F4F3F6] hover:bg-[#EAE8ED] flex items-center justify-center text-gray-500 hover:text-black transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleOpenPayment} className="p-5 space-y-4">
            {/* Order Brief Box */}
            <div className="bg-[#FFF0F4] border border-[#F6CDD7] rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  className="w-11 h-11 rounded-xl object-cover border border-[#F6CDD7]"
                />
                <div>
                  <div className="font-extrabold text-xs text-[#15171E]">{channel.name}</div>
                  <div className="text-[11px] text-[#C05572] font-bold">
                    {slot.date} в {slot.time} • {formatObj.label}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400 font-semibold">К оплате:</div>
                <div className="text-sm font-black text-[#15171E]">
                  {finalPrice.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Telegram Contact */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#15171E]">
                1. Контакт для связи в Telegram (автоопределение):
              </label>
              <input
                type="text"
                value={advertiserHandle}
                onChange={e => setAdvertiserHandle(e.target.value)}
                placeholder="@your_username"
                className="w-full bg-[#F8F9FA] border border-[#DFDBE3] focus:border-[#EE8FA5] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#15171E] outline-none transition font-semibold"
                required
              />
              <span className="text-[10px] text-gray-400 block">
                Бот свяжется по этому никнейму для подтверждения выхода поста.
              </span>
            </div>

            {/* Step 2: Ad Materials / Creative */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#15171E]">
                2. Ссылка на рекламный пост или текст публикации:
              </label>
              <input
                type="text"
                value={postLink}
                onChange={e => setPostLink(e.target.value)}
                placeholder="https://t.me/your_channel/123 или текст поста..."
                className="w-full bg-[#F8F9FA] border border-[#DFDBE3] focus:border-[#EE8FA5] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#15171E] outline-none transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#15171E]">
                3. Пожелания для автора (подводка, точное время):
              </label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="Например: опубликовать ровно в 18:00 с нативной подводкой..."
                rows={2}
                className="w-full bg-[#F8F9FA] border border-[#DFDBE3] focus:border-[#EE8FA5] focus:bg-white rounded-xl p-3 text-xs text-[#15171E] outline-none transition resize-none"
              />
            </div>

            {/* Step 4: Payment Method Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#15171E]">
                4. Выберите способ оплаты:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sbp', name: '⚡ СБП (0%)', sub: 'По QR-коду' },
                  { id: 'card', name: '💳 Карта МИР', sub: 'Без комиссии' },
                  { id: 'stars', name: '⭐️ TG Stars & TON', sub: 'В мессенджере' },
                  { id: 'invoice', name: '🏢 Для ИП и ООО', sub: 'С актами и счетом' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      paymentMethod === m.id
                        ? 'bg-[#FFF0F4] border-[#EE8FA5] ring-1 ring-[#EE8FA5]'
                        : 'bg-[#F8F9FA] border-[#E9E6EC] hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-[#15171E]">{m.name}</div>
                    <div className="text-[10px] text-gray-500">{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Compliance Agreement */}
            <div className="bg-[#F8F9FA] border border-[#E9E6EC] rounded-xl p-3">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={agreedCompliance}
                  onChange={e => setAgreedCompliance(e.target.checked)}
                  className="mt-0.5 accent-[#C05572] rounded"
                />
                <span className="text-[11px] leading-tight">
                  Подтверждаю: реклама не относится к запрещенным тематикам (без казино, пирамид, 18+ адалта и накруток).
                </span>
              </label>
            </div>

            {/* Bottom Pay Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C05572] to-[#DF768E] hover:from-[#9E3E56] hover:to-[#C05572] text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-md transition flex items-center justify-between"
              >
                <span>Перейти к оплате</span>
                <span>{finalPrice.toLocaleString('ru-RU')} ₽</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Requirement 7: Modal Stub "Оплата в разработке" */}
      {showStub && (
        <PaymentStubModal
          channel={channel}
          slot={slot}
          format={format}
          formatLabel={formatObj.label}
          finalPrice={finalPrice}
          postLink={postLink}
          comments={comments}
          advertiserHandle={advertiserHandle}
          onClose={() => setShowStub(false)}
          onPaymentSuccess={handleCompleteOrder}
        />
      )}
    </>
  );
};

import React, { useState } from 'react';
import { Channel, FormatType, Slot, Order } from '../types';
import { X, CreditCard, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface PaymentStubModalProps {
  channel: Channel;
  slot: Slot;
  format: FormatType;
  formatLabel: string;
  finalPrice: number;
  postLink: string;
  comments: string;
  advertiserHandle: string;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export const PaymentStubModal: React.FC<PaymentStubModalProps> = ({
  channel,
  slot,
  format,
  formatLabel,
  finalPrice,
  postLink,
  comments,
  advertiserHandle,
  onClose,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleFinish = (order: Order) => {
    onPaymentSuccess(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E9E6EC] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#FFF0F4] border-b border-[#F6CDD7] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#FDEEF2] text-[#C05572] flex items-center justify-center text-sm font-black border border-[#F6CDD7]">
              💳
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-[#15171E]">
                Шлюз оплаты TeleSlot
              </h3>
              <div className="text-[10px] text-[#9E3E56]">Безопасная сделка Escrow</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 hover:text-black transition text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {!isSuccess ? (
            <>
              {/* Requirement 7: Модальное окно-заглушка "Оплата в разработке" */}
              <div className="text-center space-y-2 py-1">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF0F4] border border-[#F6CDD7] flex items-center justify-center text-2xl shadow-xs">
                  🚧
                </div>

                <div className="inline-block bg-[#FFF0F4] text-[#C05572] border border-[#F6CDD7] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Оплата в разработке
                </div>

                <h4 className="text-base font-extrabold text-[#15171E]">
                  Платежный шлюз подключается
                </h4>

                <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Интеграция официального эквайринга СБП, банковских карт МИР и Telegram Stars находится на этапе закрытого тестирования.
                </p>
              </div>

              {/* Order Summary Recap */}
              <div className="bg-[#F8F9FA] border border-[#E9E6EC] rounded-2xl p-3.5 text-xs space-y-2">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Рекламодатель:</span>
                  <b className="text-[#2AABEE]">{advertiserHandle}</b>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>Канал:</span>
                  <b className="text-[#15171E]">{channel.name}</b>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>Слот:</span>
                  <b className="text-[#C05572]">{slot.date} в {slot.time}</b>
                </div>

                <div className="flex justify-between items-center text-gray-500">
                  <span>Вид рекламы:</span>
                  <b className="text-[#15171E]">{formatLabel}</b>
                </div>

                <div className="flex justify-between items-center text-gray-500 pt-1 border-t border-[#E9E6EC]">
                  <span>Авто-маркировка:</span>
                  <b className="text-[#2CB67D]">✓ erid формируется</b>
                </div>

                <div className="flex justify-between items-center text-sm font-black text-[#15171E] pt-1 border-t border-[#E9E6EC]">
                  <span>Итого к оплате:</span>
                  <span className="text-base text-[#C05572]">
                    {finalPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              {/* Escrow Explanation */}
              <div className="bg-[#E8F8F0] border border-[#B7EBCE] rounded-xl p-2.5 text-[11px] text-[#1A8452] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#1A8452]" />
                <span>
                  <b>Escrow защита:</b> средства бронируются и переводятся блогеру только после выхода публикации.
                </span>
              </div>

              {/* Action Buttons: Demo Payment Simulation & Close */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSimulatePayment}
                  className="w-full bg-gradient-to-r from-[#C05572] to-[#DF768E] hover:from-[#9E3E56] hover:to-[#C05572] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Эмуляция оплаты и генерация erid...</span>
                    </>
                  ) : (
                    <>
                      <span>⚡ Провести тестовую оплату (Демо)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-[#F4F3F6] hover:bg-[#EAE8ED] text-gray-700 font-bold text-xs py-2.5 px-4 rounded-xl transition"
                >
                  Вернуться назад
                </button>
              </div>
            </>
          ) : (
            /* Success State after Test Payment Simulation */
            <div className="text-center space-y-3 py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F8F0] border-2 border-[#2CB67D] text-[#2CB67D] flex items-center justify-center text-2xl shadow-sm">
                ✓
              </div>

              <h4 className="text-base font-black text-[#15171E]">
                Слот успешно забронирован!
              </h4>

              <p className="text-xs text-gray-600 leading-relaxed">
                Сделка зафиксирована в системе TeleSlot. Средства защищены Escrow, слот заблокирован за вами.
              </p>

              <div className="bg-[#EBF8F2] border border-[#B7EBCE] rounded-xl p-3 text-left text-xs space-y-1.5 text-[#1A8452]">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2CB67D]" />
                  <span>Токен erid сформирован автоматически:</span>
                </div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-[#B7EBCE] font-mono text-[11px] font-bold text-gray-800">
                  2Vtzqw{Math.random().toString(36).substring(2, 8).toUpperCase()}
                </div>
                <div className="text-[10px] text-[#246B46]">
                  Данные внесены в реестр ОРД и направлены в ЕРИР (ФЗ-38).
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  // The actual booking execution is handled in parent
                }}
                className="w-full bg-[#15171E] hover:bg-black text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition"
              >
                Перейти в «Мои заказы» →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

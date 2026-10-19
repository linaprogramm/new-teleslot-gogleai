import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { Clock, ShieldCheck, CheckCircle2, ExternalLink, Copy, Check } from 'lucide-react';

export const AdvertiserOrdersView: React.FC = () => {
  const { orders, currentUser } = useApp();
  const [copiedErid, setCopiedErid] = useState<string | null>(null);
  const [filterAll, setFilterAll] = useState(false);

  // Filter orders: by default, show current user's orders; toggle to show all
  const userOrders = filterAll
    ? orders
    : orders.filter(o => o.advertiserHandle.toLowerCase() === currentUser.toLowerCase());

  const handleCopyErid = (erid: string) => {
    navigator.clipboard.writeText(erid);
    setCopiedErid(erid);
    setTimeout(() => setCopiedErid(null), 2000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#15171E] to-[#252A37] text-white rounded-3xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#EE8FA5]/20 text-[#FFAEC0] flex items-center justify-center font-bold text-sm">
              📦
            </span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Мои бронирования
              </div>
              <div className="text-sm font-black text-white">{currentUser}</div>
            </div>
          </div>

          <label className="flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer bg-white/10 px-2.5 py-1 rounded-xl">
            <input
              type="checkbox"
              checked={filterAll}
              onChange={e => setFilterAll(e.target.checked)}
              className="accent-[#EE8FA5]"
            />
            <span>Показать все</span>
          </label>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mt-1">
          Все ваши бронирования слотов защищены Escrow-счетом. Бот автоматически отслеживает публикацию и присваивает токен erid.
        </p>
      </div>

      {/* Orders Count and Filter Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Всего заказов: <b className="text-[#15171E]">{userOrders.length}</b>
        </span>
        <span className="text-[#2CB67D] font-bold">✓ Авто-маркировка erid активна</span>
      </div>

      {/* Orders List */}
      {userOrders.length === 0 ? (
        <div className="bg-white border border-[#E9E6EC] rounded-3xl p-8 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF0F4] border border-[#F6CDD7] flex items-center justify-center text-2xl">
            🛍️
          </div>
          <h3 className="font-extrabold text-sm text-[#15171E]">У вас пока нет активных заказов</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Перейдите в каталог, выберите подходящий канал и свободный слот для запуска рекламы.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userOrders.map(order => {
            const isCopied = copiedErid === order.erid;

            return (
              <div
                key={order.id}
                className="bg-white border border-[#E9E6EC] rounded-3xl p-4 shadow-xs space-y-3 relative overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.channelAvatar}
                      alt={order.channelName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-[#F6CDD7]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-[#15171E]">{order.channelName}</h4>
                        <a
                          href={order.channelUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-[#2AABEE]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="text-xs text-gray-500">{order.channelHandle}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-[#15171E] block">
                      {order.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        order.status === 'Оплачено'
                          ? 'bg-[#E8F8F0] text-[#1A8452] border border-[#B7EBCE]'
                          : order.status === 'В эфире'
                          ? 'bg-[#FFF0F4] text-[#C05572] border border-[#F6CDD7]'
                          : order.status === 'Завершен'
                          ? 'bg-[#EBF3FC] text-[#1A6FB5]'
                          : 'bg-[#FFF4E5] text-[#B25E09]'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Slot Details Row */}
                <div className="bg-[#F8F9FA] border border-[#F0EDF2] rounded-2xl p-2.5 text-xs grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Слот времени:</span>
                    <b className="text-[#C05572]">{order.slotDate} в {order.slotTime}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Вид рекламы:</span>
                    <b className="text-[#15171E]">{order.formatLabel}</b>
                  </div>
                </div>

                {/* erid & Escrow Badge */}
                <div className="flex items-center justify-between bg-[#EBF8F2] border border-[#B7EBCE] rounded-xl px-3 py-2 text-xs text-[#1A8452]">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-[#1A8452]" />
                    <span>erid: <b>{order.erid}</b></span>
                  </div>

                  <button
                    onClick={() => handleCopyErid(order.erid)}
                    className="flex items-center gap-1 text-[10px] font-bold bg-white text-[#1A8452] px-2 py-0.5 rounded-lg border border-[#B7EBCE] hover:bg-[#E8F8F0] transition"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-[#2CB67D]" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Скопирован' : 'Скопировать'}</span>
                  </button>
                </div>

                {/* Post Link / Details */}
                {order.postLink && (
                  <div className="text-[11px] text-gray-500 truncate pt-1">
                    Креатив: <a href={order.postLink} target="_blank" rel="noreferrer" className="text-[#2AABEE] hover:underline font-medium">{order.postLink}</a>
                  </div>
                )}

                {order.comments && (
                  <div className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <span className="font-semibold text-gray-400">Пожелания: </span>
                    <span>{order.comments}</span>
                  </div>
                )}

                <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1 border-t border-gray-100">
                  <span>Заказ #{order.id} от {order.createdAt}</span>
                  <span>Оплата: {order.paymentMethod || 'СБП (Escrow)'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

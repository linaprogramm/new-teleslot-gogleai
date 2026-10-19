import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, BloggerSubmission } from '../types';
import { Lock, Unlock, Check, X, ShieldAlert, RefreshCw, ExternalLink, Clock, DollarSign, Filter, Search } from 'lucide-react';

export const AdminCrmView: React.FC = () => {
  const {
    isAdminUnlocked,
    unlockAdmin,
    lockAdmin,
    submissions,
    orders,
    channels,
    approveSubmission,
    rejectSubmission,
    updateOrderStatus,
    resetToDefaults,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeCrmTab, setActiveCrmTab] = useState<'submissions' | 'orders' | 'channels'>('submissions');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [searchOrders, setSearchOrders] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string>('');

  // Auto-unlock if URL has #admin or ?admin=true
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
      unlockAdmin('7788');
    }
  }, [unlockAdmin]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockAdmin(pinInput);
    if (!success) {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    } else {
      setPinInput('');
    }
  };

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleApprove = (sub: BloggerSubmission) => {
    approveSubmission(sub.id);
    showNotification(`Канал "${sub.channelName}" одобрен и сразу добавлен в общий каталог!`);
  };

  const handleReject = (sub: BloggerSubmission) => {
    rejectSubmission(sub.id);
    showNotification(`Заявка по каналу "${sub.channelName}" отклонена.`);
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const processedSubmissions = submissions.filter(s => s.status !== 'pending');

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
  const avgCheck = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const activeOrdersCount = orders.filter(o => o.status !== 'Завершен' && o.status !== 'Отменен').length;

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilterStatus !== 'all' && o.status !== orderFilterStatus) return false;
    if (searchOrders.trim()) {
      const q = searchOrders.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchAdv = o.advertiserHandle.toLowerCase().includes(q);
      const matchCh = o.channelName.toLowerCase().includes(q);
      const matchErid = o.erid.toLowerCase().includes(q);
      return matchId || matchAdv || matchCh || matchErid;
    }
    return true;
  });

  // 1. PIN Lock Screen (Requirement 2: Доступ к CRM только по PIN-коду или секретной ссылке)
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-sm mx-auto my-12 bg-white border border-[#E9E6EC] rounded-3xl p-6 shadow-xl text-center space-y-4 animate-in zoom-in-95">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF0F4] border border-[#F6CDD7] flex items-center justify-center text-2xl text-[#C05572]">
          <Lock className="w-6 h-6 text-[#C05572]" />
        </div>

        <div>
          <h3 className="font-extrabold text-base text-[#15171E]">
            Вход в CRM Администратора
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Закрытый раздел управления заявками блогеров и таблицей заказов.
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-3">
          <div>
            <input
              type="password"
              maxLength={8}
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="Введите PIN-код"
              className={`w-full text-center text-lg font-mono tracking-widest bg-[#F8F9FA] border rounded-xl py-2.5 outline-none transition ${
                pinError ? 'border-red-500 bg-red-50 text-red-600' : 'border-[#DFDBE3] focus:border-[#EE8FA5]'
              }`}
              autoFocus
            />
            {pinError && (
              <span className="text-[11px] text-red-500 font-bold block mt-1">
                Неверный PIN-код
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#15171E] hover:bg-black text-white text-xs font-extrabold py-3 rounded-xl shadow-md transition"
          >
            Войти в CRM →
          </button>
        </form>

        <div className="pt-2 border-t border-[#F0EDF2]">
          <button
            type="button"
            onClick={() => {
              setPinInput('7788');
              unlockAdmin('7788');
            }}
            className="text-[11px] text-[#C05572] hover:underline font-bold"
          >
            Ввести тестовый PIN: <b>7788</b>
          </button>
        </div>
      </div>
    );
  }

  // 2. Unlocked CRM Dashboard
  return (
    <div className="space-y-4 pb-12">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#15171E] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-white/20">
          <span>🔔</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Header Bar */}
      <div className="bg-gradient-to-r from-[#15171E] to-[#252A37] text-white rounded-3xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C05572] to-[#DF768E] text-white flex items-center justify-center text-sm font-bold shadow-xs">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>CRM Администратора TeleSlot</span>
              <span className="text-[9px] bg-green-500/20 text-[#2CB67D] font-bold px-1.5 py-0.2 rounded border border-green-500/30">
                LIVE
              </span>
            </div>
            <div className="text-[10px] text-gray-400">Модерация каналов & реестр сделок</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Сбросить базу данных CRM к исходным демо-данным?')) {
                resetToDefaults();
                showNotification('База данных успешно сброшена к демо-состоянию');
              }
            }}
            title="Сброс к заводским демо-данным"
            className="bg-white/10 hover:bg-white/20 text-gray-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Сброс демо</span>
          </button>

          <button
            onClick={lockAdmin}
            className="bg-[#C05572] hover:bg-[#9E3E56] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-xs"
          >
            <Lock className="w-3 h-3" />
            <span>Выйти</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="bg-white border border-[#E9E6EC] rounded-2xl p-3 shadow-xs">
          <div className="text-[10px] text-gray-400 uppercase font-bold">Оборот сделок</div>
          <div className="text-base font-black text-[#15171E] mt-0.5">
            {totalRevenue.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-[10px] text-[#2CB67D] font-bold">100% Escrow</div>
        </div>

        <div className="bg-white border border-[#E9E6EC] rounded-2xl p-3 shadow-xs">
          <div className="text-[10px] text-gray-400 uppercase font-bold">Всего заказов</div>
          <div className="text-base font-black text-[#15171E] mt-0.5">
            {orders.length}
          </div>
          <div className="text-[10px] text-gray-500">{activeOrdersCount} активных</div>
        </div>

        <div className="bg-white border border-[#E9E6EC] rounded-2xl p-3 shadow-xs">
          <div className="text-[10px] text-gray-400 uppercase font-bold">Заявок на проверке</div>
          <div className="text-base font-black text-[#C05572] mt-0.5">
            {pendingSubmissions.length}
          </div>
          <div className="text-[10px] text-amber-600 font-bold">ждут решения</div>
        </div>

        <div className="bg-white border border-[#E9E6EC] rounded-2xl p-3 shadow-xs">
          <div className="text-[10px] text-gray-400 uppercase font-bold">Средний чек</div>
          <div className="text-base font-black text-[#15171E] mt-0.5">
            {avgCheck.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-[10px] text-gray-500">по бирже</div>
        </div>
      </div>

      {/* CRM Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#E9E6EC] pb-2">
        <button
          onClick={() => setActiveCrmTab('submissions')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeCrmTab === 'submissions'
              ? 'bg-[#15171E] text-white shadow-xs'
              : 'bg-white border border-[#E9E6EC] text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Заявки блогеров</span>
          {pendingSubmissions.length > 0 && (
            <span className="text-[10px] bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
              {pendingSubmissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveCrmTab('orders')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeCrmTab === 'orders'
              ? 'bg-[#15171E] text-white shadow-xs'
              : 'bg-white border border-[#E9E6EC] text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Таблица заказов</span>
          <span className="text-[10px] bg-gray-200 text-gray-800 font-bold px-1.5 py-0.2 rounded-full">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCrmTab('channels')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeCrmTab === 'channels'
              ? 'bg-[#15171E] text-white shadow-xs'
              : 'bg-white border border-[#E9E6EC] text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Каналы каталога ({channels.length})</span>
        </button>
      </div>

      {/* TAB 1: Requirement 5: Вкладка "Заявки блогеров" */}
      {activeCrmTab === 'submissions' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>Новых каналов на модерацию: <b>{pendingSubmissions.length}</b></span>
            <span className="text-[#1A8452] font-semibold">Одобренные каналы сразу попадают в каталог</span>
          </div>

          {pendingSubmissions.length === 0 ? (
            <div className="bg-white border border-[#E9E6EC] rounded-2xl p-6 text-center text-xs text-gray-500 space-y-1">
              <span className="text-2xl block mb-1">🎉</span>
              <div className="font-bold text-[#15171E]">Нет новых заявок на модерации</div>
              <div>Все заявки блогеров проверены и обработаны.</div>
            </div>
          ) : (
            pendingSubmissions.map(sub => (
              <div
                key={sub.id}
                className="bg-white border-2 border-[#F6CDD7] rounded-3xl p-4 shadow-sm space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#15171E]">{sub.channelName}</h4>
                      <span className="text-[10px] bg-[#FFF0F4] text-[#C05572] font-bold px-2 py-0.5 rounded-full border border-[#F6CDD7]">
                        {sub.categoryLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <a
                        href={sub.channelUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2AABEE] font-bold flex items-center gap-1 hover:underline"
                      >
                        <span>{sub.channelHandle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span>•</span>
                      <span>Автор: <b className="text-gray-800">{sub.bloggerUsername}</b></span>
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono shrink-0">
                    {sub.submittedAt}
                  </span>
                </div>

                {/* Sub details: INN, Subs, ERR, Price */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F8F9FA] rounded-2xl p-2.5 text-xs border border-[#F0EDF2]">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">ИНН автора</span>
                    <b className="font-mono text-[#15171E]">{sub.inn || 'Не указан'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Подписчики</span>
                    <b className="text-[#15171E]">{(sub.subscribers / 1000).toFixed(1)}k</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">ERR охват</span>
                    <b className="text-[#2CB67D]">{sub.err}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Базовая цена</span>
                    <b className="text-[#C05572]">{sub.desiredBasePrice.toLocaleString('ru-RU')} ₽</b>
                  </div>
                </div>

                {/* Initial Slots */}
                {sub.initialSlots.length > 0 && (
                  <div className="text-xs text-gray-600 bg-[#FFF8FA] p-2 rounded-xl border border-[#F6CDD7]">
                    <span className="font-bold text-[#C05572]">Предложенные слоты: </span>
                    {sub.initialSlots.map((s, idx) => (
                      <span key={idx} className="mr-2">
                        • {s.date} в {s.time} ({s.price} ₽)
                      </span>
                    ))}
                  </div>
                )}

                {/* Requirement 5: Кнопки "Одобрить" и "Отклонить" */}
                <div className="flex gap-2 pt-1 border-t border-[#F0EDF2]">
                  <button
                    onClick={() => handleApprove(sub)}
                    className="flex-1 bg-[#1A8452] hover:bg-[#14663e] text-white font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Одобрить (Добавить в каталог)</span>
                  </button>

                  <button
                    onClick={() => handleReject(sub)}
                    className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Отклонить</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Processed Submissions Archive */}
          {processedSubmissions.length > 0 && (
            <div className="pt-4 space-y-2">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                Архив решений ({processedSubmissions.length})
              </h5>
              <div className="space-y-1.5">
                {processedSubmissions.map(sub => (
                  <div
                    key={sub.id}
                    className="bg-white border border-[#E9E6EC] rounded-xl p-2.5 flex items-center justify-between text-xs text-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#15171E]">{sub.channelName}</span>
                      <span className="text-gray-400">({sub.bloggerUsername})</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sub.status === 'approved'
                          ? 'bg-[#E8F8F0] text-[#1A8452]'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {sub.status === 'approved' ? '✓ Одобрен' : '✕ Отклонен'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Requirement 5: Таблица заказов (Кто, Кому, Когда, Сумма, Статус) */}
      {activeCrmTab === 'orders' && (
        <div className="space-y-3">
          {/* Controls: Search & Status Filter */}
          <div className="flex gap-2 flex-wrap items-center justify-between">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchOrders}
                onChange={e => setSearchOrders(e.target.value)}
                placeholder="Поиск по ID, рекламодателю, каналу или erid..."
                className="w-full bg-white border border-[#DFDBE3] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#15171E] outline-none"
              />
            </div>

            <select
              value={orderFilterStatus}
              onChange={e => setOrderFilterStatus(e.target.value)}
              className="bg-white border border-[#DFDBE3] text-xs rounded-xl px-2.5 py-1.5 text-gray-700 outline-none font-medium"
            >
              <option value="all">Все статусы</option>
              <option value="Ожидает">Ожидает</option>
              <option value="Оплачено">Оплачено</option>
              <option value="В эфире">В эфире</option>
              <option value="Завершен">Завершен</option>
              <option value="Отменен">Отменен</option>
            </select>
          </div>

          {/* Orders Table Container */}
          <div className="bg-white border border-[#E9E6EC] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-[#E9E6EC] text-gray-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">ID & erid</th>
                    <th className="py-2.5 px-3">Кто (Рекламодатель)</th>
                    <th className="py-2.5 px-3">Кому (Канал)</th>
                    <th className="py-2.5 px-3">Когда (Слот & Формат)</th>
                    <th className="py-2.5 px-3">Сумма</th>
                    <th className="py-2.5 px-3">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDF2]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-400">
                        Заказы не найдены
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      return (
                        <tr key={order.id} className="hover:bg-[#FFFDFC] transition">
                          {/* ID & erid */}
                          <td className="py-3 px-3">
                            <div className="font-mono font-bold text-[#15171E]">#{order.id}</div>
                            <div className="text-[10px] text-gray-400">{order.createdAt}</div>
                            <div className="text-[10px] text-[#2CB67D] font-mono mt-0.5">
                              {order.erid}
                            </div>
                          </td>

                          {/* Кто */}
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#2AABEE]">{order.advertiserHandle}</span>
                          </td>

                          {/* Кому */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-[#15171E]">{order.channelName}</div>
                            <div className="text-[11px] text-gray-500">{order.channelHandle}</div>
                          </td>

                          {/* Когда & Формат */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-[#C05572]">
                              {order.slotDate} в {order.slotTime}
                            </div>
                            <div className="text-[11px] text-gray-500">{order.formatLabel}</div>
                            {order.postLink && (
                              <a
                                href={order.postLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-[#2AABEE] hover:underline truncate max-w-[120px] block"
                              >
                                Креатив ↗
                              </a>
                            )}
                          </td>

                          {/* Сумма */}
                          <td className="py-3 px-3">
                            <b className="text-xs text-[#15171E] whitespace-nowrap">
                              {order.price.toLocaleString('ru-RU')} ₽
                            </b>
                          </td>

                          {/* Статус (с интерактивной сменой) */}
                          <td className="py-3 px-3">
                            <select
                              value={order.status}
                              onChange={e => {
                                updateOrderStatus(order.id, e.target.value as OrderStatus);
                                showNotification(`Статус заказа #${order.id} обновлен на "${e.target.value}"`);
                              }}
                              className={`text-[11px] font-bold py-1 px-2 rounded-lg border outline-none cursor-pointer ${
                                order.status === 'Оплачено'
                                  ? 'bg-[#E8F8F0] text-[#1A8452] border-[#B7EBCE]'
                                  : order.status === 'В эфире'
                                  ? 'bg-[#FFF0F4] text-[#C05572] border-[#F6CDD7]'
                                  : order.status === 'Завершен'
                                  ? 'bg-[#EBF3FC] text-[#1A6FB5] border-[#D0E2FC]'
                                  : 'bg-[#FFF4E5] text-[#B25E09] border-[#FFE8A3]'
                              }`}
                            >
                              <option value="Ожидает">Ожидает</option>
                              <option value="Оплачено">Оплачено</option>
                              <option value="В эфире">В эфире</option>
                              <option value="Завершен">Завершен</option>
                              <option value="Отменен">Отменен</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Все каналы каталога */}
      {activeCrmTab === 'channels' && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500 px-1">
            Всего каналов в каталоге: <b>{channels.length}</b>
          </div>

          <div className="space-y-2">
            {channels.map(ch => (
              <div
                key={ch.id}
                className="bg-white border border-[#E9E6EC] rounded-2xl p-3 flex items-center justify-between text-xs shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ch.avatar}
                    alt={ch.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#F6CDD7]"
                  />
                  <div>
                    <div className="font-extrabold text-[#15171E]">{ch.name}</div>
                    <div className="text-gray-500">{ch.handle} • {ch.categoryLabel} • {(ch.subscribers / 1000).toFixed(0)}k подп.</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#C05572] block">
                    Слотов: {ch.slots.length} ({ch.slots.filter(s => s.status === 'free').length} своб.)
                  </span>
                  <span className="text-[10px] text-gray-400">от {ch.basePrice} ₽</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Channel, Slot, BloggerSubmission } from '../types';
import { Plus, Trash2, Calendar, Clock, DollarSign, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export const BloggerCabinetView: React.FC = () => {
  const { channels, orders, currentUser, addSlotToChannel, removeSlot, submitBloggerChannel, submissions } = useApp();

  // Find channels owned by current user (or fallback to demo channel if using a test account)
  const myChannels = channels.filter(
    c => c.ownerUsername.toLowerCase() === currentUser.toLowerCase()
  );

  // Fallback demo channel if user is test founder or has no channel yet
  const activeChannel: Channel | undefined = myChannels[0] || (currentUser === '@founder_pro' ? channels[0] : undefined);

  // Submissions sent by this user that are still pending
  const myPendingSubmissions = submissions.filter(
    s => s.bloggerUsername.toLowerCase() === currentUser.toLowerCase() && s.status === 'pending'
  );

  // State for "Добавить слот" Modal
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [slotDate, setSlotDate] = useState('Завтра, 20 окт');
  const [slotTime, setSlotTime] = useState('18:00');
  const [slotPrice, setSlotPrice] = useState('4500');
  const [slotSuccessMsg, setSlotSuccessMsg] = useState('');

  // State for "Предложить канал" Modal
  const [isSubmitChannelOpen, setIsSubmitChannelOpen] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelHandle, setChannelHandle] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [category, setCategory] = useState('tech');
  const [categoryLabel, setCategoryLabel] = useState('Технологии & IT');
  const [subscribers, setSubscribers] = useState('15000');
  const [dailyViews, setDailyViews] = useState('6500');
  const [err, setErr] = useState('42.5%');
  const [inn, setInn] = useState('772491028301');
  const [desiredBasePrice, setDesiredBasePrice] = useState('3500');
  const [description, setDescription] = useState('');
  const [initialSlotDate, setInitialSlotDate] = useState('21 октября');
  const [initialSlotTime, setInitialSlotTime] = useState('17:00');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Orders for this blogger's channel
  const channelOrders = activeChannel
    ? orders.filter(o => o.channelId === activeChannel.id)
    : [];

  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChannel) return;

    const priceNum = parseInt(slotPrice.replace(/\D/g, '')) || activeChannel.basePrice;

    addSlotToChannel(activeChannel.id, {
      date: slotDate.trim(),
      time: slotTime.trim(),
      price: priceNum,
    });

    setSlotSuccessMsg('Слот успешно добавлен и сразу опубликован в общем каталоге!');
    setTimeout(() => {
      setSlotSuccessMsg('');
      setIsAddSlotOpen(false);
    }, 1500);
  };

  const handleSubmitChannelForm = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseInt(desiredBasePrice.replace(/\D/g, '')) || 2500;
    const subsNum = parseInt(subscribers.replace(/\D/g, '')) || 5000;
    const viewsNum = parseInt(dailyViews.replace(/\D/g, '')) || 2000;

    submitBloggerChannel({
      bloggerUsername: currentUser,
      channelName: channelName.trim() || 'Мой канал',
      channelHandle: channelHandle.startsWith('@') ? channelHandle.trim() : `@${channelHandle.trim()}`,
      channelUrl: channelUrl.trim() || `https://t.me/${channelHandle.replace('@', '')}`,
      platform: 'Telegram',
      category: category,
      categoryLabel: categoryLabel,
      subscribers: subsNum,
      dailyViews: viewsNum,
      err: err.includes('%') ? err.trim() : `${err.trim()}%`,
      inn: inn.trim(),
      desiredBasePrice: priceNum,
      description: description.trim() || 'Авторский Telegram-канал на бирже TeleSlot.',
      initialSlots: [
        {
          date: initialSlotDate.trim(),
          time: initialSlotTime.trim(),
          price: priceNum,
        },
      ],
    });

    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setIsSubmitChannelOpen(false);
      // Reset form
      setChannelName('');
      setChannelHandle('');
      setChannelUrl('');
    }, 2000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-br from-[#15171E] to-[#252A37] text-white rounded-3xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#EE8FA5]/20 text-[#FFAEC0] flex items-center justify-center font-bold text-sm">
              🎙️
            </span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Кабинет блогера
              </div>
              <div className="text-sm font-black text-white">{currentUser}</div>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitChannelOpen(true)}
            className="bg-[#EE8FA5] hover:bg-[#DF768E] text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1"
          >
            <span>+ Предложить канал</span>
          </button>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mt-2">
          Управляйте слотами и принимайте заказы. Все средства замораживаются в Escrow и выплачиваются вам сразу после выхода публикации.
        </p>
      </div>

      {/* Pending Submissions Alert */}
      {myPendingSubmissions.length > 0 && (
        <div className="bg-[#FFF9E6] border border-[#FFE8A3] rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B25E09]">
            <Clock className="w-4 h-4 text-[#B25E09]" />
            <span>Заявка на модерации ({myPendingSubmissions.length})</span>
          </div>
          <div className="text-xs text-gray-700">
            Канал <b>{myPendingSubmissions[0].channelName}</b> ({myPendingSubmissions[0].channelHandle}) проверяется администратором. Скоро он появится в каталоге!
          </div>
        </div>
      )}

      {/* Channel Section */}
      {activeChannel ? (
        <div className="space-y-4">
          {/* Active Channel Card */}
          <div className="bg-white border border-[#E9E6EC] rounded-3xl p-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={activeChannel.avatar}
                  alt={activeChannel.name}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-[#F6CDD7]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-[#15171E]">{activeChannel.name}</h3>
                    <span className="text-[10px] bg-[#E8F8F0] text-[#1A8452] font-bold px-1.5 py-0.2 rounded-md">
                      Активен
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{activeChannel.handle} • {activeChannel.categoryLabel}</div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">ИНН: {activeChannel.inn || '772491028301'}</div>
                </div>
              </div>

              {/* Requirement 4: Кнопка "Добавить слот" */}
              <button
                onClick={() => setIsAddSlotOpen(true)}
                className="bg-[#15171E] hover:bg-black text-white text-xs font-extrabold px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#EE8FA5]" />
                <span>Добавить слот</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-[#F8F9FA] rounded-2xl p-2.5 my-3 text-center border border-[#F0EDF2]">
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Подписчики</div>
                <div className="text-xs font-black text-[#15171E]">{(activeChannel.subscribers / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Охват 24ч</div>
                <div className="text-xs font-black text-[#15171E]">{(activeChannel.dailyViews / 1000).toFixed(1)}k</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">ERR активность</div>
                <div className="text-xs font-black text-[#2CB67D]">{activeChannel.err}</div>
              </div>
            </div>

            {/* Slots count note */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span>Всего слотов в расписании: <b>{activeChannel.slots.length}</b></span>
              <span className="text-[#2CB67D] font-bold">
                Свободно: {activeChannel.slots.filter(s => s.status === 'free').length}
              </span>
            </div>
          </div>

          {/* Requirement 4: Список активных слотов */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-extrabold text-[#15171E] uppercase tracking-wider">
                Активные рекламные слоты:
              </h4>
              <button
                onClick={() => setIsAddSlotOpen(true)}
                className="text-xs text-[#C05572] font-bold hover:underline flex items-center gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Новый слот</span>
              </button>
            </div>

            <div className="space-y-2">
              {activeChannel.slots.map(slot => {
                const isBooked = slot.status === 'booked';

                return (
                  <div
                    key={slot.id}
                    className={`bg-white border rounded-2xl p-3 flex items-center justify-between shadow-xs transition ${
                      isBooked
                        ? 'border-[#FFE8A3] bg-[#FFFDFC]'
                        : 'border-[#E9E6EC] hover:border-[#EE8FA5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                          isBooked ? 'bg-[#FFF4E5] text-[#B25E09]' : 'bg-[#FDEEF2] text-[#C05572]'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#15171E]">
                          {slot.date} в {slot.time}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] mt-0.5">
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded-md ${
                              isBooked
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-[#E8F8F0] text-[#1A8452]'
                            }`}
                          >
                            {isBooked ? 'Забронирован' : 'Свободен в каталоге'}
                          </span>
                          {slot.bookedBy && (
                            <span className="text-gray-500 font-medium">({slot.bookedBy})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-black text-[#15171E]">
                          {slot.price.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-[10px] text-gray-400">базовая цена</div>
                      </div>

                      {!isBooked && (
                        <button
                          onClick={() => removeSlot(activeChannel.id, slot.id)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-gray-400 transition"
                          title="Удалить слот"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirement 4: Список заказов блогера */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-extrabold text-[#15171E] uppercase tracking-wider px-1">
              Поступившие заказы от рекламодателей ({channelOrders.length}):
            </h4>

            {channelOrders.length === 0 ? (
              <div className="bg-white border border-[#E9E6EC] rounded-2xl p-6 text-center text-xs text-gray-500">
                Заказов пока нет. Когда рекламодатель забронирует слот в каталоге, он появится здесь.
              </div>
            ) : (
              <div className="space-y-2">
                {channelOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#E9E6EC] rounded-2xl p-3.5 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#15171E]">#{order.id}</span>
                        <span className="text-[10px] bg-[#E8F8F0] text-[#1A8452] font-bold px-2 py-0.5 rounded-full border border-[#B7EBCE]">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs font-black text-[#C05572]">
                        {order.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <div className="text-xs text-gray-700">
                      Рекламодатель: <b className="text-[#2AABEE]">{order.advertiserHandle}</b>
                    </div>

                    <div className="text-xs text-gray-600 bg-[#F8F9FA] p-2 rounded-xl flex items-center justify-between">
                      <span>Слот: <b>{order.slotDate} в {order.slotTime}</b> ({order.formatLabel})</span>
                      <span className="text-[10px] text-gray-500 font-mono">erid: {order.erid}</span>
                    </div>

                    {order.postLink && (
                      <div className="text-[11px] text-gray-500 truncate">
                        Материалы: <a href={order.postLink} target="_blank" rel="noreferrer" className="text-[#2AABEE] hover:underline font-medium">{order.postLink}</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State if No Channel Yet */
        <div className="bg-white border border-[#E9E6EC] rounded-3xl p-6 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF0F4] border border-[#F6CDD7] flex items-center justify-center text-2xl">
            📡
          </div>
          <h3 className="font-extrabold text-sm text-[#15171E]">
            У вас пока нет подключенных каналов
          </h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Предложите ваш Telegram-канал прямо сейчас. Заполните ИНН, ссылку и свободные слоты, и начните получать заказы.
          </p>
          <button
            onClick={() => setIsSubmitChannelOpen(true)}
            className="bg-[#15171E] hover:bg-black text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition"
          >
            Предложить канал →
          </button>
        </div>
      )}

      {/* Modal: "Добавить слот" (Requirement 4) */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E9E6EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EDF2] pb-3">
              <h3 className="font-extrabold text-sm text-[#15171E] flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#EE8FA5]" />
                <span>Добавить свободный слот</span>
              </h3>
              <button
                onClick={() => setIsAddSlotOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {slotSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold text-center">
                ✓ {slotSuccessMsg}
              </div>
            )}

            <form onSubmit={handleAddSlotSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Дата публикации:
                </label>
                <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                  {['Сегодня, 19 окт', 'Завтра, 20 окт', '21 октября', '22 октября'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSlotDate(d)}
                      className={`py-1.5 px-2 text-xs rounded-lg border font-semibold ${
                        slotDate === d
                          ? 'bg-[#15171E] text-white border-[#15171E]'
                          : 'bg-[#F8F9FA] text-gray-700 border-gray-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={slotDate}
                  onChange={e => setSlotDate(e.target.value)}
                  placeholder="Или введите дату вручную..."
                  className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-3 py-2 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Время выхода (во сколько):
                </label>
                <div className="grid grid-cols-4 gap-1 mb-1.5">
                  {['12:00', '15:00', '18:00', '21:00'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSlotTime(t)}
                      className={`py-1.5 text-xs rounded-lg border font-semibold ${
                        slotTime === t
                          ? 'bg-[#C05572] text-white border-[#C05572]'
                          : 'bg-[#F8F9FA] text-gray-700 border-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={slotTime}
                  onChange={e => setSlotTime(e.target.value)}
                  placeholder="18:30"
                  className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-3 py-2 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Базовая цена за слот (руб.):
                </label>
                <input
                  type="number"
                  value={slotPrice}
                  onChange={e => setSlotPrice(e.target.value)}
                  placeholder="4500"
                  className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-3 py-2 text-xs font-bold text-[#15171E] outline-none"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Для форматов История (-40%) и Репост (-25%) цена пересчитается автоматически.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#15171E] hover:bg-black text-white text-xs font-extrabold py-3 px-4 rounded-xl shadow-md transition"
                >
                  Опубликовать слот в каталог →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: "Предложить канал" (Requirement 2: Блогер заходит, нажимает "Предложить канал", система берет TG username, заполняет ИНН, ссылку, слоты) */}
      {isSubmitChannelOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar p-5 shadow-2xl border border-[#E9E6EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EDF2] pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#15171E]">
                  Заявка: Предложить канал на биржу
                </h3>
                <div className="text-[11px] text-[#C05572]">
                  Telegram username: <b>{currentUser}</b> (взят автоматически)
                </div>
              </div>
              <button
                onClick={() => setIsSubmitChannelOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {submissionSuccess ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <div className="font-extrabold text-sm text-[#15171E]">Заявка отправлена на модерацию!</div>
                <div className="text-xs text-gray-500">Администратор проверит канал и одобрит его в CRM биржи.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmitChannelForm} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#15171E] mb-1">
                    Название канала:
                  </label>
                  <input
                    type="text"
                    value={channelName}
                    onChange={e => setChannelName(e.target.value)}
                    placeholder="Например: ТехноНовости & AI"
                    className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-3 py-2 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#15171E] mb-1">
                      Ссылка или @username:
                    </label>
                    <input
                      type="text"
                      value={channelHandle}
                      onChange={e => setChannelHandle(e.target.value)}
                      placeholder="@my_channel"
                      className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#15171E] mb-1">
                      ИНН (самозанятый / ИП):
                    </label>
                    <input
                      type="text"
                      value={inn}
                      onChange={e => setInn(e.target.value)}
                      placeholder="772491028301"
                      className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-3 py-2 outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-[#15171E] mb-1">Подписчики:</label>
                    <input
                      type="number"
                      value={subscribers}
                      onChange={e => setSubscribers(e.target.value)}
                      placeholder="15000"
                      className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-2.5 py-2 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#15171E] mb-1">Охват 24ч:</label>
                    <input
                      type="number"
                      value={dailyViews}
                      onChange={e => setDailyViews(e.target.value)}
                      placeholder="6000"
                      className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-2.5 py-2 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#15171E] mb-1">ERR%:</label>
                    <input
                      type="text"
                      value={err}
                      onChange={e => setErr(e.target.value)}
                      placeholder="40%"
                      className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-2.5 py-2 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#15171E] mb-1">Категория:</label>
                  <select
                    value={category}
                    onChange={e => {
                      setCategory(e.target.value);
                      const opt = e.target.selectedOptions[0];
                      if (opt) setCategoryLabel(opt.text);
                    }}
                    className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="tech">Технологии & IT</option>
                    <option value="beauty">Красота & Стиль</option>
                    <option value="news">Новости</option>
                    <option value="business">Бизнес & Стартапы</option>
                    <option value="lifestyle">Лайфстайл & Блог</option>
                  </select>
                </div>

                {/* Initial slot addition */}
                <div className="bg-[#FFF0F4] border border-[#F6CDD7] rounded-xl p-3 space-y-2">
                  <div className="font-extrabold text-[#C05572]">
                    Первый свободный рекламный слот:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-0.5">Дата</span>
                      <input
                        type="text"
                        value={initialSlotDate}
                        onChange={e => setInitialSlotDate(e.target.value)}
                        placeholder="21 окт"
                        className="w-full bg-white border border-[#DFDBE3] rounded-lg px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-0.5">Время</span>
                      <input
                        type="text"
                        value={initialSlotTime}
                        onChange={e => setInitialSlotTime(e.target.value)}
                        placeholder="18:00"
                        className="w-full bg-white border border-[#DFDBE3] rounded-lg px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-0.5">Цена (₽)</span>
                      <input
                        type="number"
                        value={desiredBasePrice}
                        onChange={e => setDesiredBasePrice(e.target.value)}
                        placeholder="3500"
                        className="w-full bg-white border border-[#DFDBE3] rounded-lg px-2 py-1 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#15171E] mb-1">
                    Краткое описание канала:
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="О чем блог, какая аудитория..."
                    rows={2}
                    className="w-full bg-[#F8F9FA] border border-[#DFDBE3] rounded-xl p-2.5 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#C05572] to-[#DF768E] hover:from-[#9E3E56] hover:to-[#C05572] text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition"
                >
                  Отправить канал на модерацию в CRM →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

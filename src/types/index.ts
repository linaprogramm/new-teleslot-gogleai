export type PlatformType = 'Telegram' | 'MAX' | 'Telegram + MAX';

export type FormatType = 'photo' | 'repost' | 'story' | 'link';

export interface PostFormat {
  id: FormatType;
  label: string;
  tag: string;
  priceMod: number;
  desc: string;
  icon: string;
}

export interface Slot {
  id: string;
  date: string;
  time: string;
  price: number;
  status: 'free' | 'booked';
  bookedBy?: string;
  format?: string;
}

export interface ChannelDemographics {
  gender: {
    male: number;
    female: number;
  };
  age: {
    label: string;
    pct: number;
  }[];
  geo: {
    country: string;
    pct: number;
  }[];
}

export interface Channel {
  id: string;
  name: string;
  handle: string;
  channelUrl: string;
  platform: PlatformType;
  category: string;
  categoryLabel: string;
  subscribers: number;
  dailyViews: number;
  err: string;
  badge?: string;
  avatar: string;
  verified: boolean;
  eridAuto: boolean;
  ownerUsername: string;
  inn?: string;
  description: string;
  basePrice: number;
  slots: Slot[];
  demographics: ChannelDemographics;
  status: 'approved' | 'pending' | 'rejected';
}

export type OrderStatus = 'Ожидает' | 'Оплачено' | 'В эфире' | 'Завершен' | 'Отменен';

export interface Order {
  id: string;
  createdAt: string;
  advertiserHandle: string;
  channelId: string;
  channelName: string;
  channelHandle: string;
  channelAvatar: string;
  channelUrl: string;
  slotId: string;
  slotDate: string;
  slotTime: string;
  format: FormatType;
  formatLabel: string;
  price: number;
  status: OrderStatus;
  erid: string;
  postLink?: string;
  comments?: string;
  paymentMethod?: string;
}

export interface BloggerSubmission {
  id: string;
  submittedAt: string;
  bloggerUsername: string;
  channelName: string;
  channelHandle: string;
  channelUrl: string;
  platform: PlatformType;
  category: string;
  categoryLabel: string;
  subscribers: number;
  dailyViews: number;
  err: string;
  inn: string;
  desiredBasePrice: number;
  description: string;
  initialSlots: {
    date: string;
    time: string;
    price: number;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const MAX_ITEMS = 20;

interface RecentlyViewedItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  category: { name: string; slug: string };
  tags?: { tag: { name: string; slug: string } }[];
  reviews?: { rating: number }[];
}

interface RecentlyViewedStore {
  items: RecentlyViewedItem[];
  hydrated: boolean;
  addItem: (item: RecentlyViewedItem) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,

      addItem: (item) => {
        const filtered = get().items.filter((i) => i.id !== item.id);
        set({ items: [item, ...filtered].slice(0, MAX_ITEMS) });
      },
    }),
    {
      name: 'store-recently-viewed',
      onRehydrateStorage: () => () => {
        useRecentlyViewedStore.setState({ hydrated: true });
      },
    }
  )
);

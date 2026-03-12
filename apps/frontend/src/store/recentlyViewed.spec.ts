import { useRecentlyViewedStore } from './recentlyViewed';


const makeItem = (id: string) => ({
  id,
  name: `Товар ${id}`,
  slug: `product-${id}`,
  price: 100,
  images: ['https://example.com/img.jpg'],
  stock: 5,
  category: { name: 'Электроника', slug: 'electronics' },
});


describe('recentlyViewedStore', () => {
  beforeEach(() => {
    useRecentlyViewedStore.setState({ items: [], hydrated: false });
  });

  it('starts with empty items', () => {
    const { items } = useRecentlyViewedStore.getState();
    expect(items).toEqual([]);
  });

  it('adds an item to the beginning', () => {
    useRecentlyViewedStore.getState().addItem(makeItem('1'));
    const { items } = useRecentlyViewedStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('1');
  });

  it('deduplicates by id — moves existing item to the beginning', () => {
    const store = useRecentlyViewedStore.getState();
    store.addItem(makeItem('1'));
    store.addItem(makeItem('2'));
    store.addItem(makeItem('1'));

    const { items } = useRecentlyViewedStore.getState();
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe('1');
    expect(items[1].id).toBe('2');
  });

  it('limits items to 20', () => {
    const store = useRecentlyViewedStore.getState();
    for (let i = 1; i <= 25; i++) {
      store.addItem(makeItem(String(i)));
    }

    const { items } = useRecentlyViewedStore.getState();
    expect(items).toHaveLength(20);
    expect(items[0].id).toBe('25');
    expect(items[19].id).toBe('6');
  });

  it('preserves item data correctly', () => {
    const item = {
      ...makeItem('1'),
      comparePrice: 150,
      tags: [{ tag: { name: 'Новинка', slug: 'new' } }],
      reviews: [{ rating: 5 }],
    };
    useRecentlyViewedStore.getState().addItem(item);

    const stored = useRecentlyViewedStore.getState().items[0];
    expect(stored.comparePrice).toBe(150);
    expect(stored.tags).toHaveLength(1);
    expect(stored.reviews).toHaveLength(1);
  });
});

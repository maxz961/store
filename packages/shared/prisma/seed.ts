import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Cleanup to avoid unique constraint issues on re-seed
  await prisma.promotionProduct.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // ── Users ──
  const admin = await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: {},
    create: { email: "admin@store.com", name: "Admin", role: Role.ADMIN },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@store.com" },
    update: {},
    create: { email: "customer@store.com", name: "Иван Петров", role: Role.CUSTOMER },
  });
  console.log("✅ Users created");

  // ── Categories ──
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: { name: "Электроника" },
    create: { name: "Электроника", slug: "electronics" },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: { name: "Одежда" },
    create: { name: "Одежда", slug: "clothing" },
  });

  const home = await prisma.category.upsert({
    where: { slug: "home" },
    update: {},
    create: { name: "Дом и сад", slug: "home" },
  });

  const sports = await prisma.category.upsert({
    where: { slug: "sports" },
    update: {},
    create: { name: "Спорт", slug: "sports" },
  });

  const books = await prisma.category.upsert({
    where: { slug: "books" },
    update: {},
    create: { name: "Книги", slug: "books" },
  });
  console.log("✅ Categories created");

  // ── Tags ──
  const newTag = await prisma.tag.upsert({
    where: { slug: "new" },
    update: { name: "Новинка" },
    create: { name: "Новинка", slug: "new" },
  });

  const saleTag = await prisma.tag.upsert({
    where: { slug: "sale" },
    update: { name: "Скидка" },
    create: { name: "Скидка", slug: "sale" },
  });

  const hitTag = await prisma.tag.upsert({
    where: { slug: "hit" },
    update: {},
    create: { name: "Хит продаж", slug: "hit" },
  });

  const premiumTag = await prisma.tag.upsert({
    where: { slug: "premium" },
    update: {},
    create: { name: "Премиум", slug: "premium" },
  });
  console.log("✅ Tags created");

  // ── Products (sequential to avoid pgbouncer prepared statement errors) ──
  const img = (id: string) => `https://images.unsplash.com/${id}?w=600&h=600&fit=crop&q=80`;

  const productDatas = [
    { name: "Беспроводные наушники", slug: "wireless-headphones", description: "Премиальные беспроводные наушники с активным шумоподавлением. Время работы — до 30 часов. Bluetooth 5.3, поддержка кодеков LDAC и aptX. Комфортные амбушюры с эффектом памяти.", price: 199.99, comparePrice: 249.99, stock: 50, images: [img("photo-1505740420928-5e560c06d30e"), img("photo-1484704849700-f032a568e944")], categoryId: electronics.id, isPublished: true, tags: { create: [{ tagId: hitTag.id }, { tagId: saleTag.id }] } },
    { name: "Смарт-часы Pro", slug: "smart-watch-pro", description: "Умные часы с AMOLED экраном 1.4\". Мониторинг сердечного ритма, SpO2, сна. GPS, NFC для оплаты. Водонепроницаемость 5ATM. 100+ спортивных режимов.", price: 349.99, stock: 30, images: [img("photo-1523275335684-37898b6baf30"), img("photo-1546868871-af0de0ae72be")], categoryId: electronics.id, isPublished: true, tags: { create: [{ tagId: newTag.id }, { tagId: premiumTag.id }] } },
    { name: "Портативная колонка", slug: "portable-speaker", description: "Мощная Bluetooth-колонка с глубоким басом. 20 Вт, IPX7 водозащита. Время работы до 12 часов. Возможность соединения двух колонок для стерео.", price: 79.99, comparePrice: 99.99, stock: 100, images: [img("photo-1608043152269-423dbba4e7e1")], categoryId: electronics.id, isPublished: true, tags: { create: [{ tagId: saleTag.id }] } },
    { name: "Механическая клавиатура", slug: "mechanical-keyboard", description: "Игровая механическая клавиатура с RGB подсветкой. Свичи Cherry MX Red. Алюминиевый корпус, съёмный USB-C кабель, PBT кейкапы.", price: 149.99, stock: 45, images: [img("photo-1587829741301-dc798b83add3")], categoryId: electronics.id, isPublished: true, tags: { create: [{ tagId: hitTag.id }] } },
    { name: "Классическая футболка", slug: "classic-t-shirt", description: "Базовая футболка из 100% органического хлопка. Плотность 180 г/м². Предварительно усажена — не садится после стирки. Доступна в 5 цветах.", price: 29.99, comparePrice: 39.99, stock: 200, images: [img("photo-1521572163474-6864f9cf17ab"), img("photo-1583743814966-8936f5b7be1a")], categoryId: clothing.id, isPublished: true, tags: { create: [{ tagId: saleTag.id }, { tagId: hitTag.id }] } },
    { name: "Джинсовая куртка", slug: "denim-jacket", description: "Стильная джинсовая куртка оверсайз. Плотный деним 12 oz, металлические пуговицы. Два нагрудных и два боковых кармана. Универсальный крой.", price: 89.99, stock: 60, images: [img("photo-1576995853123-5a10305d93c0")], categoryId: clothing.id, isPublished: true, tags: { create: [{ tagId: newTag.id }] } },
    { name: "Кроссовки для бега", slug: "running-sneakers", description: "Лёгкие кроссовки для бега с амортизацией. Дышащий верх из сетки, пена EVA в подошве. Вес 250 г. Подходят для асфальта и беговой дорожки.", price: 119.99, comparePrice: 159.99, stock: 80, images: [img("photo-1542291026-7eec264c27ff"), img("photo-1460353581641-37baddab0fa2")], categoryId: clothing.id, isPublished: true, tags: { create: [{ tagId: saleTag.id }, { tagId: premiumTag.id }] } },
    { name: "Настольная лампа", slug: "desk-lamp", description: "Минималистичная настольная лампа с регулировкой яркости и цветовой температуры. 5 режимов освещения, USB-порт для зарядки. Гибкая ножка 360°.", price: 59.99, stock: 70, images: [img("photo-1513506003901-1e6a229e2d15")], categoryId: home.id, isPublished: true, tags: { create: [{ tagId: newTag.id }] } },
    { name: "Керамическая ваза", slug: "ceramic-vase", description: "Элегантная ваза ручной работы из белой керамики. Высота 25 см, матовое покрытие. Подходит для свежих и сухих цветов. Каждая ваза уникальна.", price: 44.99, stock: 35, images: [img("photo-1612196808214-b8e1d6145a8c")], categoryId: home.id, isPublished: true, tags: { create: [{ tagId: premiumTag.id }] } },
    { name: "Ароматическая свеча", slug: "scented-candle", description: "Свеча из натурального соевого воска с ароматом лаванды и ванили. Время горения — 50 часов. Хлопковый фитиль, стеклянный стакан.", price: 24.99, comparePrice: 34.99, stock: 150, images: [img("photo-1572726729207-a78d6feb18d7")], categoryId: home.id, isPublished: true, tags: { create: [{ tagId: saleTag.id }, { tagId: hitTag.id }] } },
    { name: "Коврик для йоги", slug: "yoga-mat", description: "Нескользящий коврик для йоги 183x61 см, толщина 6 мм. Экологичный TPE материал. Двусторонний: гладкая и текстурированная стороны.", price: 39.99, stock: 90, images: [img("photo-1601925260368-ae2f83cf8b7f")], categoryId: sports.id, isPublished: true, tags: { create: [{ tagId: hitTag.id }] } },
    { name: "Гантели 2x5 кг", slug: "dumbbells-5kg", description: "Набор гантелей из чугуна с неопреновым покрытием. 2 штуки по 5 кг. Эргономичная рукоятка, не скользит.", price: 49.99, stock: 40, images: [img("photo-1583454110551-21f2fa2afe61")], categoryId: sports.id, isPublished: true },
    { name: "Чистый код", slug: "clean-code", description: "Роберт Мартин. Справочник по созданию читаемого, понятного и поддерживаемого кода. Настольная книга каждого разработчика. 464 страницы.", price: 34.99, stock: 120, images: [img("photo-1544716278-ca5e3f4abd8c")], categoryId: books.id, isPublished: true, tags: { create: [{ tagId: hitTag.id }, { tagId: premiumTag.id }] } },
    { name: "JavaScript: подробное руководство", slug: "javascript-guide", description: "Дэвид Флэнаган. Полное руководство по JavaScript — от основ до продвинутых тем. 7-е издание, обновлённое для ES2020+. 704 страницы.", price: 42.99, comparePrice: 54.99, stock: 75, images: [img("photo-1532012197267-da84d127e765")], categoryId: books.id, isPublished: true, tags: { create: [{ tagId: saleTag.id }, { tagId: newTag.id }] } },
    { name: "Винтажный проигрыватель", slug: "vintage-turntable", description: "Виниловый проигрыватель в ретро-стиле. Встроенные динамики, Bluetooth, выход на внешнюю акустику. 3 скорости: 33/45/78 RPM. Корпус из натурального дерева.", price: 189.99, stock: 0, images: [img("photo-1558618666-fcd25c85f82e")], categoryId: electronics.id, isPublished: true, tags: { create: [{ tagId: premiumTag.id }] } },
  ];

  const products = [];
  for (const data of productDatas) {
    products.push(await prisma.product.create({ data }));
  }
  console.log(`✅ ${products.length} products created`);

  // ── Reviews ──
  const reviewImg = (id: string) => `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&q=80`;

  await prisma.review.createMany({
    data: [
      { userId: customer.id, productId: products[0].id, rating: 5, comment: "Отличные наушники! Шумоподавление на высоте, батарея держит как заявлено.", images: [reviewImg("photo-1505740420928-5e560c06d30e"), reviewImg("photo-1484704849700-f032a568e944")], adminReply: "Спасибо за отзыв! Рады, что наушники оправдали ожидания.", adminReplyAt: new Date("2026-01-05") },
      { userId: admin.id, productId: products[0].id, rating: 4, comment: "Хороший звук, но немного давят после 3 часов." },
      { userId: customer.id, productId: products[1].id, rating: 5, comment: "Лучшие смарт-часы в этом ценовом сегменте. GPS работает точно.", images: [reviewImg("photo-1523275335684-37898b6baf30")] },
      { userId: customer.id, productId: products[4].id, rating: 5, comment: "Качественный хлопок, приятная к телу. Заказал ещё 3 штуки.", images: [reviewImg("photo-1521572163474-6864f9cf17ab")], adminReply: "Благодарим за покупку! У нас также есть модели из бамбукового волокна — рекомендуем попробовать.", adminReplyAt: new Date("2026-02-10") },
      { userId: admin.id, productId: products[4].id, rating: 4, comment: "Хорошая базовая футболка. За эти деньги — отлично." },
      { userId: customer.id, productId: products[6].id, rating: 5, comment: "Бегаю в них каждый день, очень удобные и лёгкие.", images: [reviewImg("photo-1542291026-7eec264c27ff"), reviewImg("photo-1460353581641-37baddab0fa2")] },
      { userId: customer.id, productId: products[13].id, rating: 5, comment: "Настольная книга. Каждый разработчик должен прочитать." },
    ],
  });
  console.log("✅ Reviews created");

  // ── Promotions ──
  await prisma.promotion.create({
    data: {
      title: "Весенняя распродажа",
      slug: "spring-sale",
      description: "Скидки до 25% на электронику и аксессуары",
      bannerImageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop",
      bannerBgColor: "#e8f5e9",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-04-30"),
      discountType: "PERCENTAGE",
      discountValue: 25,
      isActive: true,
      position: 0,
      link: "/products?tagSlugs=sale",
      products: {
        create: [
          { productId: products[0].id },
          { productId: products[2].id },
          { productId: products[4].id },
        ],
      },
    },
  });

  await prisma.promotion.create({
    data: {
      title: "Новинки сезона",
      slug: "new-arrivals",
      description: "Топовые новинки уже в каталоге",
      bannerImageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
      bannerBgColor: "#e3f2fd",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-05-31"),
      discountType: "PERCENTAGE",
      discountValue: 10,
      isActive: true,
      position: 1,
      link: "/products?tagSlugs=new",
      products: {
        create: [
          { productId: products[1].id },
          { productId: products[5].id },
          { productId: products[7].id },
        ],
      },
    },
  });

  await prisma.promotion.create({
    data: {
      title: "Спорт со скидкой",
      slug: "sport-discount",
      description: "Товары для спорта по специальной цене",
      bannerImageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=300&fit=crop",
      bannerBgColor: "#fff3e0",
      startDate: new Date("2026-03-15"),
      endDate: new Date("2026-04-15"),
      discountType: "FIXED",
      discountValue: 50,
      isActive: true,
      position: 2,
      link: "/products?categorySlug=sports",
      products: {
        create: [
          { productId: products[10].id },
          { productId: products[11].id },
        ],
      },
    },
  });
  console.log("✅ Promotions created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

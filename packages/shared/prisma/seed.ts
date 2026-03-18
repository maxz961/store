import { PrismaClient, Role } from "@prisma/client";

// Ensure pgbouncer=true for Supabase transaction pooler (port 6543)
const dbUrl = process.env.DATABASE_URL;
if (dbUrl && !dbUrl.includes('pgbouncer=true')) {
  const sep = dbUrl.includes('?') ? '&' : '?';
  process.env.DATABASE_URL = `${dbUrl}${sep}pgbouncer=true`;
}

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
    create: { email: "customer@store.com", name: "Ivan Petrov", role: Role.CUSTOMER },
  });
  console.log("✅ Users created");

  // ── Categories ──
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: { name: "Електроніка", nameEn: "Electronics" },
    create: { name: "Електроніка", nameEn: "Electronics", slug: "electronics" },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: { name: "Одяг", nameEn: "Clothing" },
    create: { name: "Одяг", nameEn: "Clothing", slug: "clothing" },
  });

  const home = await prisma.category.upsert({
    where: { slug: "home" },
    update: { name: "Дім та сад", nameEn: "Home & Garden" },
    create: { name: "Дім та сад", nameEn: "Home & Garden", slug: "home" },
  });

  const sports = await prisma.category.upsert({
    where: { slug: "sports" },
    update: { name: "Спорт", nameEn: "Sports" },
    create: { name: "Спорт", nameEn: "Sports", slug: "sports" },
  });

  const books = await prisma.category.upsert({
    where: { slug: "books" },
    update: { name: "Книги", nameEn: "Books" },
    create: { name: "Книги", nameEn: "Books", slug: "books" },
  });
  console.log("✅ Categories created");

  // ── Tags ──
  const newTag = await prisma.tag.upsert({
    where: { slug: "new" },
    update: { name: "Новинка", nameEn: "New", color: "#22c55e" },
    create: { name: "Новинка", nameEn: "New", slug: "new", color: "#22c55e" },
  });

  const saleTag = await prisma.tag.upsert({
    where: { slug: "sale" },
    update: { name: "Знижка", nameEn: "Sale", color: "#ef4444" },
    create: { name: "Знижка", nameEn: "Sale", slug: "sale", color: "#ef4444" },
  });

  const hitTag = await prisma.tag.upsert({
    where: { slug: "hit" },
    update: { name: "Хіт продажів", nameEn: "Best Seller", color: "#f59e0b" },
    create: { name: "Хіт продажів", nameEn: "Best Seller", slug: "hit", color: "#f59e0b" },
  });

  const premiumTag = await prisma.tag.upsert({
    where: { slug: "premium" },
    update: { name: "Преміум", nameEn: "Premium", color: "#8b5cf6" },
    create: { name: "Преміум", nameEn: "Premium", slug: "premium", color: "#8b5cf6" },
  });
  console.log("✅ Tags created");

  // ── Products (sequential to avoid pgbouncer prepared statement errors) ──
  const img = (id: string) => `https://images.unsplash.com/${id}?w=600&h=600&fit=crop&q=80`;

  const productDatas = [
    {
      name: "Бездротові навушники",
      nameEn: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Преміальні бездротові навушники з активним шумоподавленням. Час роботи — до 30 годин. Bluetooth 5.3, підтримка кодеків LDAC та aptX. Комфортні амбушури з ефектом пам'яті.",
      descriptionEn: "Premium wireless headphones with active noise cancellation. Up to 30 hours battery life. Bluetooth 5.3 with LDAC and aptX codecs. Memory foam ear cushions for all-day comfort.",
      price: 8999, comparePrice: 11499, stock: 50,
      images: [img("photo-1505740420928-5e560c06d30e"), img("photo-1484704849700-f032a568e944")],
      categoryId: electronics.id, isPublished: true,
      tags: { create: [{ tagId: hitTag.id }, { tagId: saleTag.id }] }
    },
    {
      name: "Смарт-годинник Pro",
      nameEn: "Smart Watch Pro",
      slug: "smart-watch-pro",
      description: "Смарт-годинник з AMOLED екраном 1.4\". Моніторинг серцевого ритму, SpO2, сну. GPS, NFC для оплати. Водонепроникність 5ATM. 100+ спортивних режимів.",
      descriptionEn: "Smart watch with 1.4\" AMOLED display. Heart rate, SpO2, and sleep monitoring. Built-in GPS, NFC payments. 5ATM water resistance. 100+ sports modes.",
      price: 99999, stock: 30,
      images: [img("photo-1523275335684-37898b6baf30"), img("photo-1546868871-af0de0ae72be")],
      categoryId: electronics.id, isPublished: true,
      tags: { create: [{ tagId: newTag.id }, { tagId: premiumTag.id }] }
    },
    {
      name: "Портативна колонка",
      nameEn: "Portable Speaker",
      slug: "portable-speaker",
      description: "Потужна Bluetooth-колонка з глибоким басом. 20 Вт, IPX7 водозахист. Час роботи до 12 годин. Можливість поєднання двох колонок для стерео.",
      descriptionEn: "Powerful Bluetooth speaker with deep bass. 20W output, IPX7 waterproof. Up to 12 hours playtime. Pair two speakers for true stereo sound.",
      price: 2799, comparePrice: 3499, stock: 100,
      images: [img("photo-1608043152269-423dbba4e7e1")],
      categoryId: electronics.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }] }
    },
    {
      name: "Механічна клавіатура",
      nameEn: "Mechanical Keyboard",
      slug: "mechanical-keyboard",
      description: "Ігрова механічна клавіатура з RGB підсвіткою. Свічі Cherry MX Red. Алюмінієвий корпус, знімний USB-C кабель, PBT кейкапи.",
      descriptionEn: "Gaming mechanical keyboard with RGB backlight. Cherry MX Red switches. Aluminum body, detachable USB-C cable, PBT keycaps.",
      price: 6999, stock: 45,
      images: [img("photo-1587829741301-dc798b83add3")],
      categoryId: electronics.id, isPublished: true,
      tags: { create: [{ tagId: hitTag.id }] }
    },
    {
      name: "Класична футболка",
      nameEn: "Classic T-Shirt",
      slug: "classic-t-shirt",
      description: "Базова футболка з 100% органічної бавовни. Щільність 180 г/м². Попередньо усаджена — не сідає після прання. Доступна у 5 кольорах.",
      descriptionEn: "Basic T-shirt made from 100% organic cotton. 180 g/m² fabric. Pre-shrunk — stays true to size after washing. Available in 5 colors.",
      price: 699, comparePrice: 899, stock: 200,
      images: [img("photo-1521572163474-6864f9cf17ab"), img("photo-1583743814966-8936f5b7be1a")],
      categoryId: clothing.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }, { tagId: hitTag.id }] }
    },
    {
      name: "Джинсова куртка",
      nameEn: "Denim Jacket",
      slug: "denim-jacket",
      description: "Стильна джинсова куртка оверсайз. Щільний деним 12 oz, металеві ґудзики. Два нагрудні та два бокові кишені. Універсальний крій.",
      descriptionEn: "Stylish oversized denim jacket. Heavy 12 oz denim, metal buttons. Two chest pockets and two side pockets. Versatile cut.",
      price: 3999, stock: 60,
      images: [img("photo-1576995853123-5a10305d93c0")],
      categoryId: clothing.id, isPublished: true,
      tags: { create: [{ tagId: newTag.id }] }
    },
    {
      name: "Кросівки для бігу",
      nameEn: "Running Sneakers",
      slug: "running-sneakers",
      description: "Легкі кросівки для бігу з амортизацією. Дихаючий верх із сітки, піна EVA у підошві. Вага 250 г. Підходять для асфальту та бігової доріжки.",
      descriptionEn: "Lightweight running shoes with cushioning. Breathable mesh upper, EVA foam midsole. Weight 250g. Suitable for road and treadmill running.",
      price: 4499, comparePrice: 5999, stock: 80,
      images: [img("photo-1542291026-7eec264c27ff"), img("photo-1460353581641-37baddab0fa2")],
      categoryId: clothing.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }, { tagId: premiumTag.id }] }
    },
    {
      name: "Настільна лампа",
      nameEn: "Desk Lamp",
      slug: "desk-lamp",
      description: "Мінімалістична настільна лампа з регулюванням яскравості та колірної температури. 5 режимів освітлення, USB-порт для зарядки. Гнучка ніжка 360°.",
      descriptionEn: "Minimalist desk lamp with adjustable brightness and color temperature. 5 lighting modes, USB charging port. 360° flexible neck.",
      price: 2199, stock: 70,
      images: [img("photo-1513506003901-1e6a229e2d15")],
      categoryId: home.id, isPublished: true,
      tags: { create: [{ tagId: newTag.id }] }
    },
    {
      name: "Керамічна ваза",
      nameEn: "Ceramic Vase",
      slug: "ceramic-vase",
      description: "Елегантна ваза ручної роботи з білої кераміки. Висота 25 см, матове покриття. Підходить для свіжих і сухих квітів. Кожна ваза унікальна.",
      descriptionEn: "Elegant handmade white ceramic vase. 25 cm tall, matte finish. Suitable for fresh and dried flowers. Each vase is unique.",
      price: 1499, stock: 35,
      images: [img("photo-1612196808214-b8e1d6145a8c")],
      categoryId: home.id, isPublished: true,
      tags: { create: [{ tagId: premiumTag.id }] }
    },
    {
      name: "Ароматична свічка",
      nameEn: "Scented Candle",
      slug: "scented-candle",
      description: "Свічка з натурального соєвого воску з ароматом лаванди та ванілі. Час горіння — 50 годин. Бавовняний ґніт, скляний стакан.",
      descriptionEn: "Natural soy wax candle with lavender and vanilla scent. 50-hour burn time. Cotton wick, glass jar.",
      price: 449, comparePrice: 599, stock: 150,
      images: [img("photo-1572726729207-a78d6feb18d7")],
      categoryId: home.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }, { tagId: hitTag.id }] }
    },
    {
      name: "Килимок для йоги",
      nameEn: "Yoga Mat",
      slug: "yoga-mat",
      description: "Нековзний килимок для йоги 183x61 см, товщина 6 мм. Екологічний TPE матеріал. Двосторонній: гладка та текстурована сторони.",
      descriptionEn: "Non-slip yoga mat 183x61 cm, 6 mm thick. Eco-friendly TPE material. Double-sided: smooth and textured surfaces.",
      price: 1299, stock: 90,
      images: [img("photo-1601925260368-ae2f83cf8b7f")],
      categoryId: sports.id, isPublished: true,
      tags: { create: [{ tagId: hitTag.id }] }
    },
    {
      name: "Гантелі 2x5 кг",
      nameEn: "Dumbbells 2x5 kg",
      slug: "dumbbells-5kg",
      description: "Набір гантелей з чавуну з неопреновим покриттям. 2 штуки по 5 кг. Ергономічна рукоятка, не ковзає.",
      descriptionEn: "Cast iron dumbbell set with neoprene coating. 2 pieces of 5 kg. Ergonomic grip, non-slip.",
      price: 1799, stock: 40,
      images: [img("photo-1583454110551-21f2fa2afe61")],
      categoryId: sports.id, isPublished: true
    },
    {
      name: "Чистий код",
      nameEn: "Clean Code",
      slug: "clean-code",
      description: "Роберт Мартін. Довідник зі створення читабельного, зрозумілого та підтримуваного коду. Настільна книга кожного розробника. 464 сторінки.",
      descriptionEn: "Robert Martin. A handbook of agile software craftsmanship. A must-read for every developer. 464 pages.",
      price: 599, stock: 120,
      images: [img("photo-1544716278-ca5e3f4abd8c")],
      categoryId: books.id, isPublished: true,
      tags: { create: [{ tagId: hitTag.id }, { tagId: premiumTag.id }] }
    },
    {
      name: "JavaScript: детальний посібник",
      nameEn: "JavaScript: The Definitive Guide",
      slug: "javascript-guide",
      description: "Девід Флеганан. Повний посібник з JavaScript — від основ до просунутих тем. 7-е видання, оновлене для ES2020+. 704 сторінки.",
      descriptionEn: "David Flanagan. Complete guide to JavaScript — from basics to advanced topics. 7th edition, updated for ES2020+. 704 pages.",
      price: 749, comparePrice: 999, stock: 75,
      images: [img("photo-1532012197267-da84d127e765")],
      categoryId: books.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }, { tagId: newTag.id }] }
    },
    {
      name: "Вінтажний програвач",
      nameEn: "Vintage Turntable",
      slug: "vintage-turntable",
      description: "Вінільний програвач у ретро-стилі. Вбудовані динаміки, Bluetooth, вихід на зовнішню акустику. 3 швидкості: 33/45/78 RPM. Корпус з натурального дерева.",
      descriptionEn: "Retro-style vinyl turntable. Built-in speakers, Bluetooth, external audio output. 3 speeds: 33/45/78 RPM. Natural wood cabinet.",
      price: 14999, stock: 0,
      images: [img("photo-1558618666-fcd25c85f82e")],
      categoryId: electronics.id, isPublished: true,
      tags: { create: [{ tagId: premiumTag.id }] }
    },
    // ── Electronics extra ──
    {
      name: "Веб-камера Full HD",
      nameEn: "Full HD Webcam",
      slug: "fullhd-webcam",
      description: "Веб-камера 1080p/30fps з вбудованим мікрофоном та автофокусом. Кріплення на монітор або штатив. Plug-and-play, не потребує драйверів.",
      descriptionEn: "1080p/30fps webcam with built-in microphone and autofocus. Clips onto monitor or tripod. Plug-and-play, no drivers needed.",
      price: 2499, comparePrice: 3299, stock: 55,
      images: [img("photo-1622979135225-d2ba269cf1ac")],
      categoryId: electronics.id, isPublished: true,
      tags: { create: [{ tagId: newTag.id }, { tagId: saleTag.id }] }
    },
    {
      name: "USB-C хаб 7-в-1",
      nameEn: "USB-C Hub 7-in-1",
      slug: "usbc-hub-7in1",
      description: "Компактний USB-C хаб: HDMI 4K, 3×USB-A, SD/microSD, PD 100W. Алюмінієвий корпус, кабель 15 см. Сумісний з MacBook, iPad та Windows-ноутбуками.",
      descriptionEn: "Compact USB-C hub: 4K HDMI, 3×USB-A, SD/microSD, 100W PD charging. Aluminum body, 15 cm cable. Compatible with MacBook, iPad, and Windows laptops.",
      price: 1799, stock: 80,
      images: [img("photo-1496181133206-80ce9b88a853")],
      categoryId: electronics.id, isPublished: true,
      tags: { create: [{ tagId: hitTag.id }] }
    },
    {
      name: "Бездротова миша",
      nameEn: "Wireless Mouse",
      slug: "wireless-mouse",
      description: "Ергономічна бездротова миша з тихими кнопками. 2.4 ГГц, радіус дії 10 м. Батарейка AA — до 18 місяців роботи. DPI 800–1600.",
      descriptionEn: "Ergonomic wireless mouse with silent clicks. 2.4 GHz, 10 m range. AA battery — up to 18 months. DPI 800–1600.",
      price: 1299, comparePrice: 1699, stock: 120,
      images: [img("photo-1527864550417-7fd91fc51a46")],
      categoryId: electronics.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }] }
    },
    {
      name: "Підставка для ноутбука",
      nameEn: "Laptop Stand",
      slug: "laptop-stand",
      description: "Регульована алюмінієва підставка для ноутбука. 6 рівнів висоти, складна конструкція. Підходить для 10–17\" ноутбуків. Покращує охолодження та поставу.",
      descriptionEn: "Adjustable aluminum laptop stand. 6 height levels, foldable design. Fits 10–17\" laptops. Improves cooling and posture.",
      price: 1599, stock: 65,
      images: [img("photo-1593642632559-0c6d3fc62b89")],
      categoryId: electronics.id, isPublished: true,
      tags: { create: [{ tagId: newTag.id }] }
    },
    // ── Clothing extra ──
    {
      name: "Худі оверсайз",
      nameEn: "Oversized Hoodie",
      slug: "oversized-hoodie",
      description: "Теплий худі з флісовою підкладкою. 80% бавовна, 20% поліестер. Великий кенгуру-кишеня, регульований капюшон. Доступний у 4 кольорах.",
      descriptionEn: "Warm hoodie with fleece lining. 80% cotton, 20% polyester. Large kangaroo pocket, adjustable hood. Available in 4 colors.",
      price: 2999, comparePrice: 3999, stock: 85,
      images: [img("photo-1556821840-3a63f95609a7")],
      categoryId: clothing.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }, { tagId: hitTag.id }] }
    },
    {
      name: "Спортивні легінси",
      nameEn: "Sports Leggings",
      slug: "sports-leggings",
      description: "Компресійні легінси для тренувань. 4-стороннє стретч-полотно, відведення вологи. Висока посадка, кишеня збоку. Підходять для йоги, фітнесу, бігу.",
      descriptionEn: "Compression leggings for workouts. 4-way stretch fabric, moisture-wicking. High waist, side pocket. Great for yoga, gym, and running.",
      price: 1599, stock: 100,
      images: [img("photo-1506629082955-511b1aa562c8")],
      categoryId: clothing.id, isPublished: true,
      tags: { create: [{ tagId: newTag.id }] }
    },
    {
      name: "Зимова куртка",
      nameEn: "Winter Jacket",
      slug: "winter-jacket",
      description: "Тепла зимова куртка з наповнювачем 200 г. Водовідштовхувальне покриття DWR. Регульований капюшон, ущільнені манжети. Температурний рейтинг до -15°C.",
      descriptionEn: "Warm winter jacket with 200g filling. DWR water-repellent coating. Adjustable hood, sealed cuffs. Temperature rating down to -15°C.",
      price: 7999, comparePrice: 9999, stock: 40,
      images: [img("photo-1544923246-77307dd654cb")],
      categoryId: clothing.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }, { tagId: premiumTag.id }] }
    },
    {
      name: "Міський рюкзак",
      nameEn: "Urban Backpack",
      slug: "urban-backpack",
      description: "Функціональний рюкзак 25 л для міста та подорожей. Відсік для ноутбука 15.6\", USB-порт для зарядки, антикрадіжкова кишеня позаду. Водостійка тканина.",
      descriptionEn: "Functional 25L backpack for city and travel. 15.6\" laptop compartment, USB charging port, anti-theft back pocket. Water-resistant fabric.",
      price: 2499, stock: 55,
      images: [img("photo-1553062407-98eeb64c6a62")],
      categoryId: clothing.id, isPublished: true,
      tags: { create: [{ tagId: hitTag.id }] }
    },
    // ── Home extra ──
    {
      name: "Термокружка 500 мл",
      nameEn: "Thermo Mug 500 ml",
      slug: "thermo-mug-500",
      description: "Вакуумна термокружка з нержавіючої сталі. Зберігає тепло 12 годин, холодне — 24 години. Герметична кришка з блокуванням. Об'єм 500 мл.",
      descriptionEn: "Vacuum stainless steel thermo mug. Keeps hot 12 hours, cold 24 hours. Leak-proof lid with lock. 500 ml capacity.",
      price: 1199, comparePrice: 1499, stock: 180,
      images: [img("photo-1495474472287-4d71bcdd2085")],
      categoryId: home.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }, { tagId: hitTag.id }] }
    },
    {
      name: "Дошка для нарізання",
      nameEn: "Cutting Board",
      slug: "cutting-board",
      description: "Обробна дошка з масиву акації. Розмір 40×28 см, товщина 2 см. Має жолоб по периметру для збору соку. Обробляється харчовим мінеральним маслом.",
      descriptionEn: "Solid acacia wood cutting board. Size 40×28 cm, 2 cm thick. Juice groove around perimeter. Treated with food-grade mineral oil.",
      price: 1299, stock: 60,
      images: [img("photo-1556909114-f6e7ad7d3136")],
      categoryId: home.id, isPublished: true,
      tags: { create: [{ tagId: newTag.id }] }
    },
    {
      name: "Декоративна подушка",
      nameEn: "Decorative Pillow",
      slug: "decorative-pillow",
      description: "М'яка декоративна подушка 45×45 см. Чохол з велюру, знімний та машинозмивний. Наповнювач — гіпоалергенний холофайбер. Доступна у 6 кольорах.",
      descriptionEn: "Soft decorative pillow 45×45 cm. Velvet cover, removable and machine washable. Hypoallergenic hollowfiber filling. Available in 6 colors.",
      price: 899, stock: 95,
      images: [img("photo-1567016432779-094069958ea5")],
      categoryId: home.id, isPublished: true,
      tags: { create: [{ tagId: hitTag.id }] }
    },
    {
      name: "Кошик для зберігання",
      nameEn: "Storage Basket",
      slug: "storage-basket",
      description: "Плетений кошик для зберігання речей. Натуральний сейзаль, розмір M (30×30×25 см). Підходить для іграшок, білизни, журналів. Набір 2 штуки.",
      descriptionEn: "Woven storage basket made from natural sisal. Size M (30×30×25 cm). Great for toys, laundry, magazines. Set of 2.",
      price: 1699, comparePrice: 2199, stock: 45,
      images: [img("photo-1586023492125-27b2c045efd7")],
      categoryId: home.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }] }
    },
    // ── Sports extra ──
    {
      name: "Еспандери (набір 5 шт.)",
      nameEn: "Resistance Bands Set (5 pcs)",
      slug: "resistance-bands",
      description: "Набір із 5 латексних еспандерів різного опору: 5, 10, 15, 20, 25 кг. У комплекті: сумка, дверний якір, ручки, щиколоткові ремінці.",
      descriptionEn: "Set of 5 latex resistance bands of varying resistance: 5, 10, 15, 20, 25 kg. Includes bag, door anchor, handles, and ankle straps.",
      price: 999, stock: 130,
      images: [img("photo-1517836357463-d25dfeac3438")],
      categoryId: sports.id, isPublished: true,
      tags: { create: [{ tagId: hitTag.id }, { tagId: newTag.id }] }
    },
    {
      name: "Скакалка швидкісна",
      nameEn: "Speed Jump Rope",
      slug: "speed-jump-rope",
      description: "Швидкісна скакалка з підшипниками та регульованим тросом. Алюмінієві ручки з нескользким покриттям. Підходить для кросфіту та боксу.",
      descriptionEn: "Speed jump rope with ball bearings and adjustable cable. Aluminum handles with non-slip coating. Great for crossfit and boxing.",
      price: 499, comparePrice: 699, stock: 200,
      images: [img("photo-1599058917212-d750089bc07e")],
      categoryId: sports.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }] }
    },
    {
      name: "Пляшка для води 1 л",
      nameEn: "Water Bottle 1L",
      slug: "water-bottle-1l",
      description: "Пляшка Tritan без BPA, об'єм 1 л. Широке горло для льоду, кришка з клямкою та петлею. Прозорі мітки об'єму. Миється в посудомийній машині.",
      descriptionEn: "BPA-free Tritan bottle, 1L capacity. Wide mouth for ice, flip-lock lid with carry loop. Volume markings. Dishwasher safe.",
      price: 699, stock: 160,
      images: [img("photo-1553531384-cc64ac80f931")],
      categoryId: sports.id, isPublished: true,
      tags: { create: [{ tagId: hitTag.id }] }
    },
    {
      name: "Масажний ролик",
      nameEn: "Foam Roller",
      slug: "foam-roller",
      description: "Масажний ролик для м'язів 33×14 см. Щільна піна EVA, поверхня з гребенями для глибокого масажу. Підходить для спини, стегон, литок.",
      descriptionEn: "Foam roller for muscle recovery 33×14 cm. Dense EVA foam, ridged surface for deep tissue massage. Great for back, hips, and calves.",
      price: 1499, comparePrice: 1999, stock: 75,
      images: [img("photo-1571019613454-1cb2f99b2d8b")],
      categoryId: sports.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }, { tagId: newTag.id }] }
    },
    // ── Books extra ──
    {
      name: "Патерни проектування",
      nameEn: "Design Patterns",
      slug: "design-patterns",
      description: "«Банда чотирьох». Класика об'єктно-орієнтованого проектування. 23 патерни з прикладами на C++ та Smalltalk. Обов'язкова книга для архітекторів ПЗ. 395 сторінок.",
      descriptionEn: "Gang of Four. Classic OOP design patterns book. 23 patterns with C++ and Smalltalk examples. Essential reading for software architects. 395 pages.",
      price: 1499, stock: 85,
      images: [img("photo-1507842217343-583bb7270b66")],
      categoryId: books.id, isPublished: true,
      tags: { create: [{ tagId: premiumTag.id }] }
    },
    {
      name: "Атомні звички",
      nameEn: "Atomic Habits",
      slug: "atomic-habits",
      description: "Джеймс Клір. Як формувати корисні звички та позбуватися шкідливих. Науково обґрунтований підхід до особистісного розвитку. Бестселер NYT. 320 сторінок.",
      descriptionEn: "James Clear. How to build good habits and break bad ones. Science-based approach to self-improvement. NYT bestseller. 320 pages.",
      price: 999, comparePrice: 1299, stock: 150,
      images: [img("photo-1544947950-fa07a98d237f")],
      categoryId: books.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }, { tagId: hitTag.id }] }
    },
    {
      name: "Досвідчений програміст",
      nameEn: "The Pragmatic Programmer",
      slug: "pragmatic-programmer",
      description: "Ендрю Хант, Девід Томас. Від підмайстра до майстра. 20-е ювілейне видання. Практичні поради щодо розробки ПЗ, які не втрачають актуальності. 352 сторінки.",
      descriptionEn: "Andrew Hunt, David Thomas. From Journeyman to Master. 20th Anniversary Edition. Timeless practical advice on software development. 352 pages.",
      price: 1299, stock: 70,
      images: [img("photo-1481627834876-b7833e8f5570")],
      categoryId: books.id, isPublished: true,
      tags: { create: [{ tagId: premiumTag.id }, { tagId: newTag.id }] }
    },
    {
      name: "Python: вивчаємо мову",
      nameEn: "Learning Python",
      slug: "learning-python",
      description: "Марк Лутц. Найповніший посібник з Python. Охоплює Python 3, ООП, функціональне програмування, бібліотеки. 5-е видання. 1594 сторінки.",
      descriptionEn: "Mark Lutz. The most comprehensive guide to Python. Covers Python 3, OOP, functional programming, libraries. 5th edition. 1594 pages.",
      price: 1799, comparePrice: 2299, stock: 40,
      images: [img("photo-1515879218367-8466d910aaa4")],
      categoryId: books.id, isPublished: true,
      tags: { create: [{ tagId: saleTag.id }] }
    },
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
      { userId: customer.id, productId: products[0].id, rating: 5, comment: "Excellent headphones! Noise cancellation is top-notch, battery lasts as advertised.", images: [reviewImg("photo-1505740420928-5e560c06d30e"), reviewImg("photo-1484704849700-f032a568e944")], adminReply: "Thank you for the review! We are glad the headphones met your expectations.", adminReplyAt: new Date("2026-01-05") },
      { userId: admin.id, productId: products[0].id, rating: 4, comment: "Great sound, but they get a bit uncomfortable after 3 hours." },
      { userId: customer.id, productId: products[1].id, rating: 5, comment: "Best smartwatch in this price range. GPS is very accurate.", images: [reviewImg("photo-1523275335684-37898b6baf30")] },
      { userId: customer.id, productId: products[4].id, rating: 5, comment: "Quality cotton, feels great. Ordered 3 more.", images: [reviewImg("photo-1521572163474-6864f9cf17ab")], adminReply: "Thank you for your purchase! We also have bamboo fiber models — highly recommended.", adminReplyAt: new Date("2026-02-10") },
      { userId: admin.id, productId: products[4].id, rating: 4, comment: "Good basic t-shirt. Great value for the price." },
      { userId: customer.id, productId: products[6].id, rating: 5, comment: "Running in them every day — very comfortable and lightweight.", images: [reviewImg("photo-1542291026-7eec264c27ff"), reviewImg("photo-1460353581641-37baddab0fa2")] },
      { userId: customer.id, productId: products[13].id, rating: 5, comment: "Essential reading. Every developer must read this book." },
    ],
  });
  console.log("✅ Reviews created");

  // ── Promotions ──
  await prisma.promotion.create({
    data: {
      title: "Весняний розпродаж",
      titleEn: "Spring Sale",
      slug: "spring-sale",
      description: "Знижки до 25% на електроніку та аксесуари",
      descriptionEn: "Up to 25% off electronics and accessories",
      bannerImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=300&fit=crop",
      bannerBgColor: "#b2dfdb",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2027-03-01"),
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
      title: "Новинки сезону",
      titleEn: "New Arrivals",
      slug: "new-arrivals",
      description: "Топові новинки вже в каталозі",
      descriptionEn: "Top new items now in the catalog",
      bannerImageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=300&fit=crop",
      bannerBgColor: "#d1c4e9",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2027-03-01"),
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
      title: "Спорт зі знижкою",
      titleEn: "Sports Discount",
      slug: "sport-discount",
      description: "Товари для спорту за спеціальною ціною",
      descriptionEn: "Sports items at special prices",
      bannerImageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=300&fit=crop",
      bannerBgColor: "#ffccbc",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2027-03-01"),
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

  // ── Support messages ──
  await prisma.supportMessage.deleteMany();

  const customer2 = await prisma.user.upsert({
    where: { email: "maria@store.com" },
    update: {},
    create: { email: "maria@store.com", name: "Maria Sokolova", role: Role.CUSTOMER },
  });

  await prisma.supportMessage.createMany({
    data: [
      // Ivan Petrov — answered conversation
      {
        userId: customer.id,
        content: "Hello! I placed an order two days ago but the status is still 'Processing'. When can I expect an update?",
        fromAdmin: false,
        createdAt: new Date("2026-03-10T09:00:00Z"),
      },
      {
        userId: customer.id,
        content: "Hello Ivan! Your order was handed to the delivery service this morning. You'll receive a tracking number by email within the hour.",
        fromAdmin: true,
        createdAt: new Date("2026-03-10T10:30:00Z"),
      },
      {
        userId: customer.id,
        content: "Thank you! Got the email, all clear.",
        fromAdmin: false,
        createdAt: new Date("2026-03-10T10:45:00Z"),
      },
      {
        userId: customer.id,
        content: "You're welcome! Feel free to reach out if you have any questions. Have a great day!",
        fromAdmin: true,
        createdAt: new Date("2026-03-10T10:50:00Z"),
      },

      // Maria Sokolova — new unhandled inquiry
      {
        userId: customer2.id,
        content: "Hi! I'd like to return an item — the headphones came in the wrong color. How do I process a return?",
        fromAdmin: false,
        createdAt: new Date("2026-03-11T14:00:00Z"),
      },
      {
        userId: customer2.id,
        content: "Could you also clarify the timeline? The order was placed 5 days ago.",
        fromAdmin: false,
        createdAt: new Date("2026-03-11T14:02:00Z"),
      },
    ],
  });
  console.log("✅ Support messages created");

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

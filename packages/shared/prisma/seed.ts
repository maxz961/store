import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: {},
    create: {
      email: "admin@store.com",
      name: "Admin",
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: { name: "Electronics", slug: "electronics" },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: { name: "Clothing", slug: "clothing" },
  });
  console.log("✅ Categories created");

  // Create tags
  const newTag = await prisma.tag.upsert({
    where: { slug: "new" },
    update: {},
    create: { name: "New", slug: "new" },
  });

  const saleTag = await prisma.tag.upsert({
    where: { slug: "sale" },
    update: {},
    create: { name: "Sale", slug: "sale" },
  });
  console.log("✅ Tags created");

  // Create sample products
  const product1 = await prisma.product.upsert({
    where: { slug: "wireless-headphones" },
    update: {},
    create: {
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Premium wireless headphones with noise cancellation.",
      price: 199.99,
      stock: 50,
      images: ["https://placehold.co/600x400"],
      categoryId: electronics.id,
      isPublished: true,
      tags: {
        create: [{ tagId: newTag.id }],
      },
    },
  });

  const product2 = await prisma.product.upsert({
    where: { slug: "classic-t-shirt" },
    update: {},
    create: {
      name: "Classic T-Shirt",
      slug: "classic-t-shirt",
      description: "Comfortable 100% cotton t-shirt.",
      price: 29.99,
      comparePrice: 39.99,
      stock: 200,
      images: ["https://placehold.co/600x400"],
      categoryId: clothing.id,
      isPublished: true,
      tags: {
        create: [{ tagId: saleTag.id }],
      },
    },
  });
  console.log("✅ Products created");

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

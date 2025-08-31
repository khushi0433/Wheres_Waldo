// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // delete existing
  await prisma.guess.deleteMany();
  await prisma.score.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.character.deleteMany();
  await prisma.photo.deleteMany();

  const photo = await prisma.photo.create({
    data: {
      title: "Sample Beach Scene",
      imageUrl: "https://example.com/sample-beach.jpg",
      naturalWidth: 1920,
      naturalHeight: 1080,
      characters: {
        create: [
          { name: "Waldo", boxX: 0.45, boxY: 0.57, boxW: 0.06, boxH: 0.08 },
          { name: "Wizard", boxX: 0.12, boxY: 0.34, boxW: 0.05, boxH: 0.07 },
          { name: "Wilma", boxX: 0.78, boxY: 0.22, boxW: 0.06, boxH: 0.07 }
        ]
      }
    },
    include: { characters: true }
  });

  console.log('Seeded photo:', photo.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

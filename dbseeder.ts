import { PrismaClient } from "@prisma/client";
import { fakerID_ID as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedDatabase() {
  // Seed Product table
  for (let i = 0; i < 10; i++) {
    await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        desc: faker.lorem.paragraph(),
        image: faker.image.url(),
        filename: faker.system.fileName(),
      },
    });
  }

  // Seed Portfolio table
  for (let i = 0; i < 10; i++) {
    await prisma.portofolio.create({
      data: {
        title: faker.lorem.words(),
        desc: faker.lorem.paragraph(),
        image: faker.image.url(),
        filename: faker.system.fileName(),
      },
    });
  }

  // Seed Service table
  for (let i = 0; i < 10; i++) {
    await prisma.service.create({
      data: {
        title: faker.company.catchPhrase(),
        desc: faker.lorem.paragraph(),
        link: faker.internet.url(),
        logo: faker.image.url(),
        filename: faker.system.fileName(),
      },
    });
  }

  // Seed Testimony table
  for (let i = 0; i < 10; i++) {
    await prisma.testimony.create({
      data: {
        username: faker.internet.userName(),
        location: faker.location.city(),
        comment: faker.lorem.paragraph(),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        avatar: faker.image.avatar(),
        filename: faker.system.fileName(),
      },
    });
  }

  // Seed Hero table
  for (let i = 0; i < 10; i++) {
    await prisma.hero.create({
      data: {
        number: faker.number.int({ min: 1, max: 5 }),
        position: faker.lorem.words(),
        text: faker.lorem.sentence(),
        hText: faker.lorem.words(),
        desc: faker.lorem.paragraph(),
      },
    });
  }

  // Seed User table
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        job: faker.person.jobTitle(),
        avatar: faker.image.avatar(),
        bio: faker.lorem.paragraph(),
      },
    });
  }

  // Seed Partnership table
  for (let i = 0; i < 10; i++) {
    await prisma.partnership.create({
      data: {
        name: faker.company.name(),
        image: faker.image.url(),
        filename: faker.system.commonFileName(),
      },
    });
  }
}

seedDatabase()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

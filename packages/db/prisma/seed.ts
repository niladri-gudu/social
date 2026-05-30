import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [];

  const testUser = await prisma.user.create({
    data: {
      username: "testuser",
      email: "test@example.com",
      passwordHash,
      bio: "Seeded test account",
    },
  });

  users.push(testUser);

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        passwordHash,
        bio: faker.person.bio(),
        avatarUrl: faker.image.avatar(),
      },
    });

    users.push(user);
  }

  console.log(`✅ Created ${users.length} users (including test user)`);

  const posts = [];

  for (let i = 0; i < 50; i++) {
    const author = users[Math.floor(Math.random() * users.length)];

    const post = await prisma.post.create({
      data: {
        authorId: author.id,
        content: faker.lorem.paragraph(),
      },
    });

    posts.push(post);
  }

  console.log(`✅ Created ${posts.length} posts`);

  for (const user of users) {
    const randomUsers = users
      .filter((u) => u.id !== user.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    for (const target of randomUsers) {
      try {
        await prisma.follow.create({
          data: {
            followerId: user.id,
            followingId: target.id,
          },
        });
      } catch {}
    }
  }

  console.log(`✅ Created follow relationships`);

  for (let i = 0; i < 150; i++) {
    const user = users[Math.floor(Math.random() * users.length)];

    const post = posts[Math.floor(Math.random() * posts.length)];

    await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        authorId: user.id,
        postId: post.id,
      },
    });
  }

  console.log(`✅ Created comments`);

  for (let i = 0; i < 200; i++) {
    const user = users[Math.floor(Math.random() * users.length)];

    const post = posts[Math.floor(Math.random() * posts.length)];

    try {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
    } catch {}
  }

  console.log(`✅ Created likes`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

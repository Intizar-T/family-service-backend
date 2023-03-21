import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = ["intizar", "rahim", "ovadan", "jennet", "hudayar"];
  const res = users.map(async (user) => {
    return await prisma.user.create({
      data: {
        name: user,
      },
    });
  });
  console.log(res);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UsersProps {
  device: string;
  name: string;
}

const users: UsersProps[] = [
  {
    device: "Linux; Android 8.0.0; SM-G955U Build/R16NW",
    name: "Intizar Comp",
  },
  { device: "Linux; Android 10; SM-N960N", name: "Intizar Mobile" },
  { device: "Linux; Android 12; LM-G900N", name: "Ovadan" },
  { device: "Linux; Android 11; M2003J15SC", name: "Рахым" },
  { device: "Linux; Android 10; Redmi Note 8 Pro", name: "Hudayar" },
  { device: "Linux; Android 11; SM-A307FN", name: "Jennet" },
];

async function main() {
  await Promise.all(
    users.map(async ({ device, name }) => {
      await prisma.user.create({
        data: {
          device,
          name,
        },
      });
    })
  );
  await prisma.product.create({
    data: {
      name: "Sorry, websayt tazalandy we hamma produktlar yena ocdi. Bu haty ocirip, obycny dowam ediworinlar",
      userName: "Intizar Comp",
      userDevice: "Linux; Android 8.0.0; SM-G955U Build/R16NW",
    },
  });
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

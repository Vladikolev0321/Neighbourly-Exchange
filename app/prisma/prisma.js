import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Example query to fetch all users from the 'User' table
const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  console.log(users);
};

getAllUsers().catch(e => {
  throw e;
}).finally(async () => {
  await prisma.$disconnect();
});

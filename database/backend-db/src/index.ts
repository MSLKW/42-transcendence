// import { PrismaClient } from '../prisma/generated'; // -> if edited the output item in schema.prisma 
import { PrismaClient } from '@prisma/client';

// Note: Adjust the relative path (../) to point correctly to your 'prisma/generated' folder
const prisma = new PrismaClient({}); 

// This is the only database call you need to worry about for now
export async function saveGameResult(winnerUsername: string): Promise<void> {
  try {
    const user = await prisma.user.update({
      where: { username: winnerUsername },
      data: { wins: { increment: 1 } },
    });
    console.log("Game result saved for:", user.username);
  } catch (e) {
    console.error("Database write error:", e);
  }
}
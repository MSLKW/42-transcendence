const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This is the only database call you need to worry about for now
async function saveGameResult(winnerUsername) {
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
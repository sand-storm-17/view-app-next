import { Coin } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const youtubers = await prisma.youTuber.findMany({
//       orderBy: {
//         subscriberCount: "desc",
//       },
//       select: {
//         id: true,
//         rank: true,
//         subscriberCount: true,
//         channelName: true,
//       },
//     });
//     return NextResponse.json({ youtubers });
//   } catch (error) {
//     console.error("Error fetching YouTubers:", error);
//     return NextResponse.error();
//   } finally {
//     await prisma.$disconnect();
//   }
// }

export async function GET() {
  try {
    const coins: Coin[] = await prisma.coin.findMany({
      orderBy: {
        subscriberCount: "desc",
      },
    });
    return NextResponse.json({ coins });
  } catch (error) {
    console.error("Error fetching coins", error);
    return NextResponse.error();
  }
}


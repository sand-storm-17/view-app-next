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

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = JSON.parse(json);
    console.log(data);
    await prisma.coin.create({
      data: {
        name: data.coinName,
        mintAmount: data.amount,
        mint: data.mint,
        mintAuth: data.mintAuth,
        freezeAuth: data.freezeAuth,
        tokenAccount: data.tokenAccount,
        createdBy: data.createdBy,
        subscriberCount: data.subscriberCount,
      },
    });
  } catch (error) {
    console.log("Error sending post request", error);
    return NextResponse.error();
  }
}

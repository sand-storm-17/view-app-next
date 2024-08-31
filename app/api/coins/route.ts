import { Coin } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request:NextRequest) {
  try {
    const data = await request.json();
    const res = await prisma.coin.create({
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
    return NextResponse.json({res});
  } catch (error) {
    console.error("eror in post", error);
    return NextResponse.json({ error: `Failed because of ${error}` }, { status: 500 });
  }
}

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


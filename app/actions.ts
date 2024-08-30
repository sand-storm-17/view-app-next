// "use server";

// import { PrismaClient } from '@prisma/client';

// interface Coindata {
//   coinName: string;
//   amount: number;
//   mint: string[];
//   mintAuth: string[];
//   freezeAuth: string[];
//   tokenAccount: string[];
//   createdBy: string;
//   subscriberCount: number;
// }

// const prisma = new PrismaClient();
// export async function saveCoin(data: Coindata) {
//   await prisma.coin.create({
//     data: {
//       name: data.coinName,
//       mintAmount: data.amount,
//       mint: data.mint,
//       mintAuth: data.mintAuth,
//       freezeAuth: data.freezeAuth,
//       tokenAccount: data.tokenAccount,
//       createdBy: data.createdBy,
//       subscriberCount: data.subscriberCount
//     },
//   });
// }

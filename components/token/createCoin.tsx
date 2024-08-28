// import { createMint, getAccount, getMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
// import { useConnection } from "@solana/wallet-adapter-react";
// import { Keypair } from "@solana/web3.js";

// export const createNewCoin = async (
//   name: FormDataEntryValue | null,
//   value: FormDataEntryValue | null,
//   email: FormDataEntryValue | null
// ) => {
//   const { connection } = useConnection();
//   const payer = Keypair.generate();
//   const mintAuthority = Keypair.generate();
//   const freezeAuthority = Keypair.generate();

//   const mint = await createMint(
//     connection,
//     payer,
//     mintAuthority.publicKey,
//     freezeAuthority.publicKey,
//     9 // We are using 9 to match the CLI decimal default exactly
//   );
//   const mintInfo = await getMint(connection, mint);

//   console.log(mintInfo.supply);
//   // 0
//   const tokenAccount = await getOrCreateAssociatedTokenAccount(
//     connection,
//     payer,
//     mint,
//     payer.publicKey
//   );

//   console.log(tokenAccount.address.toBase58());
//   // 7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi

//   const tokenAccountInfo = await getAccount(connection, tokenAccount.address);

//   await mintTo(
//     connection,
//     payer,
//     mint,
//     tokenAccount.address,
//     mintAuthority,
//     100000000000 // because decimals for the mint are set to 9
//   );

//   console.log(tokenAccountInfo.amount);
//   // 0

//   console.log(mintInfo.supply);
//   // 100

//   console.log(tokenAccountInfo.amount);

//   return;
// };

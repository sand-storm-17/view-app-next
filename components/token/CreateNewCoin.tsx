"use server";
import { TOKEN_PROGRAM_ID, getMinimumBalanceForRentExemptMint, MINT_SIZE, createInitializeMint2Instruction } from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Keypair, Transaction, SystemProgram } from "@solana/web3.js";

export const CreateNewCoin = async (
  name: FormDataEntryValue | null,
  value: FormDataEntryValue | null,
  email: FormDataEntryValue | null,
  connection: Connection,
  wallet: WalletContextState
) => {
  const payer = wallet.publicKey;
  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();

  if (payer == null) {
    console.log('no payer');
    return;
  }

  // const airdropSignature = await connection.requestAirdrop(
  //   payer,
  //   LAMPORTS_PER_SOL
  // );
  // await connection.confirmTransaction(airdropSignature);
  // const mint = await createMint(
  //   connection,
  //   payer,
  //   mintAuthority.publicKey,
  //   freezeAuthority.publicKey,
  //   9 // We are using 9 to match the CLI decimal default exactly
  // );
  // payer: Signer;
  const decimals = 9;
  const keypair = Keypair.generate();
  const programId = TOKEN_PROGRAM_ID;
  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: keypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId,
    }),
    createInitializeMint2Instruction(
      keypair.publicKey,
      decimals,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      programId
    )
  );

  const signature = await wallet.sendTransaction(transaction, connection);

  const latestBlockHash = await connection.getLatestBlockhash();

  const confirmation = await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: signature,
  }, 'confirmed');

  console.log(confirmation);

  return keypair.publicKey;
};

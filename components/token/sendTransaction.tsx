"use client";
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import {
  Connection,
  Transaction,
  SystemProgram,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import { useAnchorProvider } from "../solana/solana-provider";

export const sendTransaction = async (receiver: PublicKey, amount: number) => {
  // const wallet = useWallet();
  // const { connection } = useConnection();
  // if (wallet.publicKey == null) return null;
  // const transaction = new Transaction().add(
  //   SystemProgram.transfer({
  //     fromPubkey: wallet.publicKey,
  //     toPubkey: receiver,
  //     lamports: amount,
  //   })
  // );

  // const latestBlockHash = await connection.getLatestBlockhash();

  // const signature = await wallet.sendTransaction(transaction, connection);

  // await connection.confirmTransaction(
  //   {
  //     blockhash: latestBlockHash.blockhash,
  //     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //     signature: signature,
  //   },
  //   "processed"
  // );
  return;
};

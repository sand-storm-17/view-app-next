"use client";

import { useState, useEffect } from "react";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { sendTransaction } from "./sendTransaction";
import {
  Account,
  AccountType,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  createMint,
  createMintToInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
  MINT_SIZE,
  mintTo,
  mintToChecked,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  unpackAccount,
} from "@solana/spl-token";
// import { Coin, Prisma, PrismaClient } from '@prisma/client';
import { PublicKey } from "@solana/web3.js";
import { token } from "@coral-xyz/anchor/dist/cjs/utils";
import { serialize } from "borsh";
// import { Coin } from "@prisma/client";
import { saveCoin } from "@/app/actions";

interface Coindata {
  coinName: string;
  amount: number;
  mint: string[];
  mintAuth: string[];
  freezeAuth: string[];
  tokenAccount: string[];
  createdBy: string;
  subscriberCount: number;
}

const CreateNewCoin = async (
  name: string,
  amount: number,
  subCount: number,
  connection: Connection,
  wallet: WalletContextState
) => {
  const payer = wallet.publicKey;
  const mintAuthority = Keypair.generate();
  const freezeAuthority = mintAuthority;
  const mintAccount = Keypair.generate();
  const decimals = 9;
  const programId = TOKEN_PROGRAM_ID;
  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  if (payer == null) {
    console.log("no payer");
    return;
  }

  //Create New Mint using MintAccount Address
  //Start
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintAccount.publicKey,
      space: MINT_SIZE,
      lamports,
      programId,
    }),
    createInitializeMint2Instruction(
      mintAccount.publicKey,
      decimals,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      programId
    )
  );
  const signers: Signer[] = [mintAccount];
  let signature1;
  let latestBlockHash;
  signature1 = await wallet.sendTransaction(transaction, connection, {
    signers: signers,
  });

  latestBlockHash = await connection.getLatestBlockhash();

  console.log(mintAccount.publicKey.toBase58());

  if (latestBlockHash === undefined) throw Error;

  const mintInfo = await getMint(connection, mintAccount.publicKey);
  console.log(mintInfo.supply);

  //End

  console.log("second step");

  //Create an Associated Token Account
  //Start
  const associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID;
  const associatedToken = getAssociatedTokenAddressSync(
    mintAccount.publicKey,
    payer!,
    false,
    programId,
    associatedTokenProgramId
  );

  console.log(associatedToken.toBase58());

  const confirmation = await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature1,
    },
    "finalized"
  );

  console.log(confirmation);

  let account: Account;
  try {
    account = await getAccount(
      connection,
      associatedToken,
      "confirmed",
      programId
    );
  } catch (error: unknown) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
      try {
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            payer,
            associatedToken,
            payer,
            mintAccount.publicKey,
            programId,
            associatedTokenProgramId
          )
        );

        const signature = await wallet.sendTransaction(
          transaction,
          connection,
          { signers: [] }
        );

        await connection.confirmTransaction(
          {
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
          },
          "finalized"
        );
      } catch (error: unknown) {
        // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
        // instruction error if the associated account exists already.
      }

      // Now this should always succeed
      account = await getAccount(
        connection,
        associatedToken,
        "confirmed",
        programId
      );
    } else {
      throw error;
    }
  }

  const info = await connection.getAccountInfo(account.address, "finalized");
  console.log(info);
  const tokenAccount = unpackAccount(associatedToken, info, programId);
  const tokenAccountInfo = await getAccount(connection, tokenAccount.address);
  console.log(tokenAccountInfo.amount);

  //End

  // Mint to the new Associated Token Account
  const multiSigners: Signer[] = [mintAccount, mintAuthority];

  const transaction2 = new Transaction().add(
    createMintToInstruction(
      mintAccount.publicKey,
      tokenAccount.address,
      mintAuthority.publicKey,
      amount,
      multiSigners,
      programId
    )
  );

  const signature2 = await wallet.sendTransaction(transaction2, connection, {
    signers: multiSigners,
  });

  const latestBlockHash2 = await connection.getLatestBlockhash();

  const confirmation2 = await connection.confirmTransaction(
    {
      blockhash: latestBlockHash2.blockhash,
      lastValidBlockHeight: latestBlockHash2.lastValidBlockHeight,
      signature: signature2,
    },
    "confirmed"
  );

  //End

  //Creating and Adding metadata to the token

  // function createInitializeMetadataPointerInstruction(
  //   mint: PublicKey,
  //   authority: PublicKey | null,
  //   metadataAddress: PublicKey | null,
  //   programId: PublicKey,
  // );
  // function createUpdateMetadataPointerInstruction(
  //   mint: PublicKey,
  //   authority: PublicKey,
  //   metadataAddress: PublicKey | null,
  //   multiSigners: (Signer | PublicKey)[] = [],
  //   programId: PublicKey = TOKEN_2022_PROGRAM_ID,
  // );
  // function getMetadataPointerState(mint: Mint): Partial<MetadataPointer> | null;
  // const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  // const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
  // const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  //   'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  // );

  // const metadataAccount = await PublicKey.findProgramAddress(
  //   [
  //     Buffer.from('metadata'),
  //     TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  //     mintAccount.publicKey.toBuffer(),
  //   ],
  //   TOKEN_METADATA_PROGRAM_ID
  // );

  // const initMetadataPointerInstructions =
  //   createInitializeMetadataPointerInstruction(
  //     mintAccount.publicKey,
  //     payer,
  //     metadataAccount,
  //     TOKEN_2022_PROGRAM_ID
  //   );

  // const initMintInstructions = createInitializeMintInstruction(
  //   mint.publicKey,
  //   decimals,
  //   payer.publicKey,
  //   payer.publicKey,
  //   TOKEN_2022_PROGRAM_ID
  // );

  // const metadata = {
  //   name: name,
  //   symbol: 'SAN',
  //   description: 'New Coin',
  //   image: 'Img URL',
  // };

  // const metadataArgs = new CreateMetadataArgs({
  //   name: name,
  //   symbol: 'symbol',
  //   uri: 'uri',
  //   sellerFeeBasisPoints: 500, // Set this according to your needs
  //   creators: null, // You can specify creators if needed
  // });

  // // Serialize the metadata
  // const metadataBuffer = serialize(METADATA_SCHEMA, metadataArgs);

  // // Create the instruction to create the metadata account
  // const createMetadataInstruction = new TransactionInstruction({
  //   keys: [
  //     { pubkey: metadataAccount[0], isSigner: false, isWritable: true },
  //     { pubkey: mintAccount.publicKey, isSigner: false, isWritable: true },
  //     { pubkey: payer, isSigner: true, isWritable: false },
  //     { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  //   ],
  //   programId: TOKEN_METADATA_PROGRAM_ID,
  //   data: Buffer.from(metadataBuffer),
  // });

  // // Send the transaction to create the metadata account
  // const transaction3 = new Transaction().add(createMetadataInstruction);
  // const signature3 = await wallet.sendTransaction(transaction3, connection);
  // await connection.confirmTransaction(signature3, 'confirmed');

  // console.log(`Metadata created! Transaction signature: ${signature3}`);
  // alert(`Metadata created! Transaction signature: ${signature3}`);

  // await mintToChecked

  const data: Coindata = {
    coinName: name,
    amount: amount,
    mint: [mintAccount.publicKey.toString(), mintAccount.secretKey.toString()],
    mintAuth: [
      mintAuthority.publicKey.toString(),
      mintAuthority.secretKey.toString(),
    ],
    freezeAuth: [
      freezeAuthority.publicKey.toString(),
      freezeAuthority.publicKey.toString(),
    ],
    tokenAccount: [tokenAccount.address.toString()],
    createdBy: payer.toString(),
    subscriberCount: subCount,
  };
  // await saveCoin(data);
  try {
    await fetch("https://view-app-next.vercel.app/api/coins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    return console.log(error);
  }
};

export default function NewCoin() {
  const [showModal, setShowModal] = useState(false);
  function changeShowModal() {
    setShowModal(!showModal);
  }
  const { connection } = useConnection();
  // console.log(connection);
  const wallet = useWallet();
  // console.log(wallet);
  async function onSubmitHandler(e: FormData) {
    const name = e.get("name")?.toString();
    const value = Number(e.get("amount")?.toString());
    const email = e.get("email")?.toString();
    const subcount = Number(e.get("subcount")?.toString());
    console.log(name, value, email, subcount);
    if (
      name === undefined ||
      value === undefined ||
      email === undefined ||
      subcount === undefined
    ) {
      console.log("Values not present in form", name, value, email, subcount);
      return;
    }
    // const baseValue = e.get('value');
    const mint = await CreateNewCoin(name, value, subcount, connection, wallet);
  }

  const send1Sol = async () => {
    const receiverAdd = wallet.publicKey;
    await sendTransaction(receiverAdd!, 1000);
  };

  return (
    <div className="absolute flex">
      <button
        onClick={changeShowModal}
        className="flex border-1 border-white p-2 primary-800 font-heading1 bg-background-50 rounded-3xl m-2"
      >
        Want to create you own Coin?
      </button>
      {/* <button className="bg-black" onClick={send1Sol}>
        Send 1 Sol
      </button> */}
      {showModal ? (
        <div
          className="absolute flex items-start bg-transparent h-1/2 w-1/4 rounded-2xl"
          style={{ top: "20px" }}
        >
          <form
            action={onSubmitHandler}
            className="flex flex-col gap-4 p-8 m-8 bg-background-400 rounded-3xl font-body1 text-lg"
          >
            <div onClick={changeShowModal} className="flex basis-0 justify-end">
              X
            </div>
            <label>What do you want to call your Coin?</label>
            <input
              className="p-1 pl-2 rounded-lg"
              placeholder="Name"
              name="name"
              required
            ></input>
            <label>How many coins to mint?</label>
            <input
              className="p-1 pl-2 rounded-lg"
              placeholder="Amount"
              name="amount"
              type="number"
              required
            ></input>
            <label>Provide the Subscriber Count of Your Channel</label>
            <input
              className="p-1 pl-2 rounded-lg"
              placeholder="Subscriber Count"
              name="subcount"
              required
            ></input>
            <label>
              Provide email id linked to the youtube account for verification
            </label>
            <input
              className="p-1 pl-2 rounded-lg"
              placeholder="Email"
              name="email"
              type="email"
            ></input>
            <input type="submit" value="Submit" />
          </form>
        </div>
      ) : null}
    </div>
  );
}

"use client";
import { Coin } from "@prisma/client";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useGetBalance } from "../account/account-data-access";
import {
  Commitment,
  ConfirmOptions,
  Connection,
  ParsedAccountData,
  PublicKey,
  Signer,
  Transaction,
} from "@solana/web3.js";
import {
  Account,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  TokenInvalidMintError,
  TokenInvalidOwnerError,
} from "@solana/spl-token";
import { createSecretKey } from "crypto";
import { useAnchorProvider } from "../solana/solana-provider";

async function getCoins() {
  // Fetch data from external API
  const res = await fetch("https://view-app-next.vercel.app/api/coins");

  if (!res.ok) {
    throw new Error("Failed to fetch coins");
  }
  const response = await res.json();
  return response?.coins;
}
export async function getOrCreateAssociatedTokenAccountLocal(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  wallet: WalletContextState,
  allowOwnerOffCurve = false,
  commitment?: Commitment,
  confirmOptions?: ConfirmOptions,

  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): Promise<Account> {
  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    owner,
    allowOwnerOffCurve,
    programId,
    associatedTokenProgramId
  );

  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  let account: Account;
  try {
    account = await getAccount(
      connection,
      associatedToken,
      commitment,
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
        const transaction = new Transaction();
        const latestBlockHash = await connection.getLatestBlockhash('finalized');
        transaction.recentBlockhash =  latestBlockHash.blockhash;
        transaction.add(
          createAssociatedTokenAccountInstruction(
            payer,
            associatedToken,
            owner,
            mint,
            programId,
            associatedTokenProgramId
          )
        );
        const signature = await wallet.sendTransaction(
          transaction,
          connection
        );
        if (latestBlockHash === undefined) throw Error;

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
        commitment,
        programId
      );
    } else {
      throw error;
    }
  }

  if (!account.mint.equals(mint)) throw new TokenInvalidMintError();
  if (!account.owner.equals(owner)) throw new TokenInvalidOwnerError();

  return account;
}

async function sendTokens(
  token: Coin,
  destinationWalletPublicKey: PublicKey,
  connection: Connection,
  wallet: WalletContextState,
  TRANSFER_AMOUNT: number
) {
  const MINT_ADDRESS = new PublicKey(token.mint[0]);
  console.log(MINT_ADDRESS);
  const SOURCE_ACCOUNT_ADDRESS = new PublicKey(token.tokenAccount);
  const SOURCE_ACCOUNT_OWNER = new PublicKey(token.createdBy);

  async function getNumberDecimals(mintAddress: string): Promise<number> {
    const info = await connection.getParsedAccountInfo(
      new PublicKey(MINT_ADDRESS)
    );
    const result = (info.value?.data as ParsedAccountData).parsed.info
      .decimals as number;
    return result;
  }
  let destinationAccount = await getOrCreateAssociatedTokenAccountLocal(
    connection,
    destinationWalletPublicKey,
    MINT_ADDRESS,
    destinationWalletPublicKey,
    wallet
  );
  console.log(
    `Destination Account: ${destinationAccount.address.toString()}`
  );

  console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
  const numberDecimals = await getNumberDecimals(MINT_ADDRESS.toString());
  console.log(`    Number of Decimals: ${numberDecimals}`);
  console.log(`4 - Creating and Sending Transaction`);
  const tx = new Transaction();
  const latestBlockHash = await connection.getLatestBlockhash('finalized');
  if (latestBlockHash === undefined) throw Error;
  tx.add(
    createTransferInstruction(
      SOURCE_ACCOUNT_ADDRESS,
      destinationAccount.address,
      SOURCE_ACCOUNT_OWNER,
      TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
    )
  );
  // wallet!.signTransaction!(tx);
  // tx.recentBlockhash = latestBlockHash.blockhash;
  // tx.feePayer = wallet.publicKey!;
  const signature = await wallet.sendTransaction(tx, connection);
  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    },
    "processed"
  );
  console.log(
    "\x1b[32m", //Green Text
    `   Transaction Success!🎉`,
    `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
}

export default function Buy() {
  const { connection } = useConnection();
  const anchor = useAnchorProvider();
  anchor.sendAll
  const wallet = useWallet();
  const { data, isLoading, isError } = useQuery<Coin[]>({
    queryFn: async () => await getCoins(),
    queryKey: ["id"],
  });
  const [isActiveSell, setIsActiveSell] = useState(true);
  const [numberOfTokens, setNumberOfTokens] = useState(0);
  const [selectedToken, setSelectedToken] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const walletAddress = wallet.publicKey!;
  const walletBalance = useGetBalance({ address: walletAddress });
  let curTokenFirst:Coin = data?.find((token) => {
    return token.name === 'BITCOIN';
  })!;;
  const [curToken,setCurToken] = useState(curTokenFirst);

  const handleNumberOfTokensChange = (event: { target: { value: string } }) => {
    const value = Number(event.target.value);
    setNumberOfTokens(Math.max(0, value)); // Ensures non-negative value
  };

  const handleSellButtonClick = () => {
    setIsActiveSell(true);
  };

  const handleBuyButtonClick = () => {
    setIsActiveSell(false);
  };
  
  const handleTokenChange = async (event: { target: { value: string } }) => {
    setSelectedToken(event.target.value);
    setIsActiveSell;
    const curTokenChanged = await data?.find((token) => {
      return token.name === selectedToken;
    })!;
    setCurToken(curTokenChanged);
    const curCost = curToken?.subscriberCount! / 2000 / curToken?.mintAmount!;
    setTotalCost(curCost);
  };
  console.log(curToken);
  const buyHandler = () => {
    if(data !== undefined){
      sendTokens(
        curToken,
        wallet.publicKey!,
        connection,
        wallet,
        numberOfTokens
      )
    }
  }

  return (
    <div className="flex basis-full justify-center items-center">
      <div className="bg-background-400 min-h-full rounded-md p-4 shadow-md">
        <div className="flex justify-between">
          {/* <button
            className={` text-white font-bold py-2 px-4 rounded font-heading
              ${!isActiveSell && "active"} ${
              !isActiveSell ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
            }`}
            onClick={handleBuyButtonClick}
          >
            BUY
          </button> */}
          <button
            className={`text-white font-bold py-2 px-4 rounded font-heading ${
              isActiveSell && "active"
            } ${isActiveSell ? "bg-red-500 hover:bg-red-600 " : "bg-gray-500"}`}
            onClick={handleSellButtonClick}
          >
            SELL
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <label className="flex items-center font-body">
            Token
            <select
              className="ml-2 border rounded py-2 px-3 font-body"
              value={selectedToken}
              onChange={handleTokenChange}
            >
              {data?.map((value, index) => {
                return <option key={index}>{value.name}</option>;
              })}
            </select>
          </label>
          <div className="flex items-center font-body">
            <label>Number of tokens </label>
            <input
              type="number"
              step="any"
              id="numOfTokens"
              className="ml-2 border rounded py-2 px-3 font-body"
              value={numberOfTokens}
              onChange={handleNumberOfTokensChange}
            />
          </div>
          <div className="flex items-center font-body">
            <p>Cost Per Token: {totalCost.toFixed(10)} SOL</p>
          </div>
        </div>
        <div className="flex items-center font-body">
          <p onClick={() => walletBalance.refetch()}>
            Balance:{" "}
            {walletBalance.data
              ? `${walletBalance.data / 1000000000} SOL`
              : "Wallet not connected"}
          </p>
        </div>
        <button
        onClick={buyHandler}
          className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 w-full font-heading ${
            isActiveSell ? "bg-red-500" : ""
          }`
        }
        >
          {isActiveSell ? "SELL" : "BUY"}
        </button>
      </div>
    </div>
  );
}

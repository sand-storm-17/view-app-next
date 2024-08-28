'use client';

import { useContext } from "react";
import { SolanaProvider } from "./solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";

// import { PublicKey } from "@solana/web3.js";

const base58 = require('bs58');

// import { WalletButton } from "./solana-provider";
// import * as React from 'react';
// import {ReactNode, Suspense, useEffect, useRef} from 'react';

// import Link from 'next/link';
// import { usePathname } from "next/navigation";

// import { AccountChecker } from "../account/account-ui";
// import { ClusterChecker, ClusterUiSelect, ExplorerLink } from "../cluster/cluster-ui";

// import toast, {Toaster} from 'react-hot-toast';
// import cluster from "cluster";
// import { ConnectionProvider } from "@solana/wallet-adapter-react";

require('dotenv').config();

const web3 = require('@solana/web3.js');

const wallet = useWallet();
wallet.publicKey;
console.log(wallet);
// const secret = JSON.parse(process.env.SECRET_KEY);

// const from = web3.Keypair.fromSecretKey(new Uint8Array(secret));
// const from = web3.PublicKey('2ZhzT1HGbghNNLoq8nPLMKfoiQLJjn6aFNrsJpseF53r');

// const from = web3.Keypair.fromSecretKey(
//   base58.decode(
//     '588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2'
//   )
// );

// // const fromAddress = web3.PublicKey('2ZhzT1HGbghNNLoq8nPLMKfoiQLJjn6aFNrsJpseF53r');
// console.log(from);
// // Generate a random address to send to
// const to = web3.Keypair.generate();
// console.log(from, to);

// (async () => {
//   const endpoint = web3.clusterApiUrl('devnet');
//   const connection = new web3.Connection(endpoint, { commitment: 'confirmed' });
//   (async () => {
//     // 1e9 lamports = 10^9 lamports = 1 SOL
//     let txhash = await connection.requestAirdrop(from.publicKey, 10000);
//     console.log(`txhash: ${txhash}`);
//   })();
//   const transaction = new web3.Transaction().add(
//     web3.SystemProgram.transfer({
//       fromPubkey: from.publicKey, //user sends a youtube token
//       toPubkey: to.publicKey, // youtube token central wallet receives
//       lamports: web3.LAMPORTS_PER_SOL / 100, //0.01 SOL
//     }),
//     web3.SystemProgram.transfer({
//       fromPubkey: from.publicKey, // youtube token central wallet sends corresponding sol
//       toPubkey: to.publicKey, // youtube token central wallet receives
//       lamports: web3.LAMPORTS_PER_SOL / 100, // user receives the sol for the tokens
//     })
//   );

//   // Sign transaction, broadcast, and confirm
//   const signature = await web3.sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [from]
//   );
//   console.log('SIGNATURE', signature);
// })();


// const{
//     Connection,
//     PublicKey,
//     clusterApiUrl,
//     Keypair,
//     LAMPORTS_PER_SOL
// } = require("@solana/web3.js")

// const wallet = new Keypair()

// const publicKey = new PublicKey(wallet._keypair.publicKey)  
// console.log(publicKey);          
// const secretKey = wallet._keypair.secretKey
    

// const getWalletBalance = async() => {
//     try{
//         const connection = new Connection(clusterApiUrl('devnet'),'confirmed')
//         const walletBalance = await connection.getBalance(publicKey)
//         console.log(`Wallet Balance is ${walletBalance}`)
//     }
//     catch(er){
//         console.log(er)
//     }
// }

// const airDropSol = async() =>{
//     try{
//         const connection = new Connection(clusterApiUrl('testnet'),'confirmed')
//         const fromAirDropSignature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL)
//         await connection.confirmTransaction(fromAirDropSignature)

//     }catch(er){
//         console.log('Error Here: '+er)
//     }
// }

// const main = async() =>{
//     await getWalletBalance()
//     await airDropSol()
//     await getWalletBalance()
// }

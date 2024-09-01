"use client"

import { useState } from 'react';
import Leaderboard from './leaderboard-ui';
import Dashboard from './dashboard';
import { SolanaProvider, WalletButton } from '../solana/solana-provider';
import { ClusterUiSelect } from '../cluster/cluster-ui';
import { ClusterProvider, useCluster } from '../cluster/cluster-data-access';
import NewCoin from '../token/new-coin';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Window() {
  const [currentWindow, setCurrentWindow] = useState('Leaderboard');

  // setCurrentWindow
  // const cluster = useCluster();
  // console.log(cluster.cluster);

  // const wallet = useWallet();
  // console.log(wallet.publicKey);

  return (
    <div className="flex shrink basis-full bg-background-800 justify-center items-center">
      <div className="flex shrink grow-0 flex-col w-2/5 h-2/3 bg-background-100 border-none rounded-xl ">
        <div className="flex shrink m-5 justify-center">
          <div className="flex shrink items-start">
            <button
              onClick={()=>{
                setCurrentWindow('Leaderboard')
              }}
              className="flex font-heading text-2xl border rounded-l-2xl py-2 px-6 active:bg-background-800 hover:bg-primary-500"
            >
              Leaderboard
            </button>
            <button
              onClick={()=>{
                setCurrentWindow('Dashboard')
              }}
              className="flex font-heading text-2xl border rounded-r-2xl py-2 px-6 active:bg-background-800 hover:bg-primary-500"
            >
              Dashboard
            </button>
          </div>
        </div>
        <div className="flex basis-5/ overflow-y-scroll">
          {currentWindow == 'Leaderboard' ? <Leaderboard/> : <Dashboard />}
        </div>
      </div>
    </div>
  );
}

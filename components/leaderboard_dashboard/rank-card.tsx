'use client';

import { useState } from 'react';
import { MdKeyboardDoubleArrowUp } from 'react-icons/md';
import BuySell from '../buySellCard/BuySell';
// import { YouTuber } from '@prisma/client';

interface youtuber {
  name: string;
  rank: number;
  subscribers: number;
}

export default function RankCard({value}:{value:youtuber}) {
  let [showBuySell, setShowBuySell] = useState(true);
  function showBuySellWindow() {
    setShowBuySell(!showBuySell);
  }

  return (
    <div className="flex gap-2 border border-none bg-accent-200 mx-10 px-10 py-2 justify-between rounded-tr-lg rounded-bl-lg font-heading text-md shadow-sm shadow-accent-500">
      <div className="flex items-center">
        <MdKeyboardDoubleArrowUp />
        {value.rank}
      </div>
      <div className="flex-1 ">{value.name}</div>
      <div className="flex-1">{value.subscribers}</div>
      <div className="flex gap-2">
        <button
          onClick={showBuySellWindow}
          className="flex-1 px-2 rounded-lg hover:bg-white bg-green-600 text-black"
        >
          Buy
        </button>
        {showBuySell ? (
          <></>
        ) : (
          <div className='flex-1 flex-col absolute top-auto left-auto'>
            <BuySell/>
            <button onClick={showBuySellWindow}>Close</button>
          </div>
        )}
      </div>
      {}
    </div>
  );
}

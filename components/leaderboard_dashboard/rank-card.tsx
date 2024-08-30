'use client';

import { useState } from 'react';
import { MdKeyboardDoubleArrowUp } from 'react-icons/md';
import BuySell from '../buySellCard/Buy';
import { Coin } from '@prisma/client';
import Link from 'next/link';
// import { YouTuber } from '@prisma/client';


export default function RankCard({value,index}:{value:Coin,index:number}) {
  // let [showBuySell, setShowBuySell] = useState(true);
  // function showBuySellWindow() {
  //   setShowBuySell(!showBuySell);
  // }

  return (
    <div className="flex gap-2 border border-none bg-accent-200 mx-10 px-10 py-2 justify-between rounded-tr-lg rounded-bl-lg font-heading text-md shadow-sm shadow-accent-500">
      <div className="flex items-center">
        <MdKeyboardDoubleArrowUp />
        {index}
      </div>
      <div className="flex-1 pl-10">{value.name}</div>
      <div className="flex-1">{value.subscriberCount}</div>
      <div className="flex gap-2">
        <Link href='/buy'
          // onClick={showBuySellWindow}
          className="flex-1 px-2 rounded-lg hover:bg-white bg-green-600 text-black"
        >
          Buy
        </Link>
        {/* {showBuySell ? (
          <></>
        ) : (
          <div className='flex-1 flex-col absolute m-auto'>
            <BuySell/>
            <button onClick={showBuySellWindow}>Close</button>
          </div>
        )} */}
      </div>
      {}
    </div>
  );
}

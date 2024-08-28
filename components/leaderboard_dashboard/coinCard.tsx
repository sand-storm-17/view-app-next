import { MdKeyboardDoubleArrowUp } from 'react-icons/md';

export function CoinCard(props: {name: string, image: string, amount: string}) {
  return (
    <div className="flex gap-2 border border-none bg-accent-200 mx-10 px-10 py-2 justify-between rounded-tr-lg rounded-bl-lg font-heading1 text-md drop-shadow-lg shadow-sm shadow-accent-500">
      <div className='flex basis-1/4 items-center'>{props.image}</div>
      <div className='flex basis-1/4'>{props.name}</div>
      <div className='flex basis-1/2 justify-end'>
        {props.amount}
      </div>
    </div>
  );
}

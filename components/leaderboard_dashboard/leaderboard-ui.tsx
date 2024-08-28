import { Key, useEffect, useState } from 'react';
import RankCard from './rank-card';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

type youtuber = {
  id: number;
  rank: number;
  channelName: string;
  subscriberCount: number;
};

export default async function Leaderboard() {
  // const [repo, setRepo] = useState<youtuber[]>([]);
  // useEffect(() => {
  //   getYoutubers();
  // }, []);
  // async function getYoutubers() {
  //   // Fetch data from external API
  //   const res = await fetch('http://localhost:3000/api/youtubers');

  //   if (!res.ok) {
  //     throw new Error('Failed to fetch youtubers');
  //   }
  //   const response = await res.json();
  //   setRepo(response);
  // }
  // console.log(repo);
  return (
    <div className="flex basis-full flex-col gap-2 overflow-hidden">
      {/* {repo.map(=>{
        <RankCard value={val}/>
      })} */}
    </div>
  );
}

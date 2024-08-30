"use client";

import { Key, useEffect, useMemo, useState } from "react";
import RankCard from "./rank-card";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Coin } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type youtuber = {
  id: number;
  rank: number;
  channelName: string;
  subscriberCount: number;
};

async function getCoins() {
  // Fetch data from external API
  const res = await fetch("http://localhost:3000/api/coins");

  if (!res.ok) {
    throw new Error("Failed to fetch coins");
  }
  const response = await res.json();
  return response?.coins;
}

export default function Leaderboard() {

  const {data, isLoading, isError} = useQuery<Coin[]>({
    queryFn: async () => await getCoins(),
    queryKey: ["id"]
  })
  if(isLoading) return <div>Loading</div>
  if(isError) return <div>Sorry, there was an Error</div>
  return (
    <div className="flex basis-full flex-col gap-2 overflow-hidden">
      {data?.map((value) => {
        return <RankCard key={value.id} value={value} />;
      })}
    </div>
  );
}

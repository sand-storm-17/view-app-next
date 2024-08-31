"use client";

import { Key, useEffect, useMemo, useState } from "react";
import RankCard from "./rank-card";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Coin } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

async function getCoins() {
  // Fetch data from external API
  const res = await fetch("https://view-app-next.vercel.app/api/coins");

  if (!res.ok) {
    throw new Error("Failed to fetch coins");
  }
  const response = await res.json();
  return response?.coins;
}

export default function Leaderboard() {
  const { data, isLoading, isError } = useQuery<Coin[]>({
    queryFn: async () => await getCoins(),
    queryKey: ["id"],
  });
  if (isLoading) return <div className="flex basis-full justify-center items-center"><span className="loading loading-spinner"></span></div>;
  if (isError) return <div>Sorry, there was an Error</div>;
  return (
    <div className="flex basis-full flex-col gap-2">
      <div className="flex gap-2 border border-none bg-accent-200 mx-10 px-10 py-2 justify-between rounded-tr-lg rounded-bl-lg font-heading text-md shadow-sm shadow-accent-500">
        <div className="flex gap-10">
          <div>Rank</div>
          <div>Name</div>
        </div>
        <div>Subscriber Count</div>
        <div>Buy</div>
      </div>
      {data?.map((value, index) => {
        return <RankCard key={index} value={value} index={index + 1} />;
      })}
    </div>
  );
}

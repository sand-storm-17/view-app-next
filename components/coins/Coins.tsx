import { Coin } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

async function getCoins() {
  // Fetch data from external API
  const res = await fetch("https://view-app-next.vercel.app/api/coins", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch coins");
  }
  const response = await res.json();
  return response?.coins;
}

const Coins = () => {
  const { data, isLoading, isError } = useQuery<Coin[]>({
    queryFn: async () => await getCoins(),
    queryKey: ["id"],
  });
  return (
    <div>
      {data?.map((value, index) => {
        return <div key={value.id}>
            <div>
                <div>
                    {value.createdBy}
                </div>
                <div>
                    {value.mint[0]}
                </div>
                <div>
                    {value.mintAmount}
                </div>
                <div>
                    {value.name}
                </div>
                <div>
                    {value.subscriberCount}
                </div>
            </div>
        </div>;
      })}
    </div>
  );
};

export default Coins;

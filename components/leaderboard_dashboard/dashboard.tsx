"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CoinCard } from "./coinCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { ExplorerLink } from "../cluster/cluster-ui";
import { ellipsify } from "../ui/ui-layout";
import { useMemo, useState } from "react";
import { IconRefresh } from "@tabler/icons-react";
import Link from "next/link";

export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: [
      "get-token-accounts",
      { endpoint: connection.rpcEndpoint, address },
    ],
    queryFn: async () => {
      const [tokenAccounts, token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_PROGRAM_ID,
        }),
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_2022_PROGRAM_ID,
        }),
      ]);
      return [...tokenAccounts.value, ...token2022Accounts.value];
    },
  });
}

export default function Dashboard() {
  const [showAll, setShowAll] = useState(false);
  const wallet = useWallet();
  const address = wallet!.publicKey!;
  const query = useGetTokenAccounts({ address });
  const client = useQueryClient();
  const items = useMemo(() => {
    if (showAll) return query.data;
    return query.data?.slice(0, 5);
  }, [query.data, showAll]);

  return (
    <div className="flex-col basis-full">
      {query.isError && (
        <pre className="alert alert-error">
          Error: {query.error?.message.toString()}
        </pre>
      )}
      {query.isSuccess && (
        <div className="flex-1">
          {query.data.length === 0 ? (
            <div>No token accounts found.</div>
          ) : (
            <div className="flex grow-0 basis-full items-center justify-center table border-4 rounded-lg border-separate border-base-300 overflow-scroll">
              <div className="basis-full justify-evenly">
                <div className="flex grow-0 basis-full justify-evenly font-body">
                  <div>Token Acc Public Key</div>
                  <div>Mint Public Key</div>
                  <div>Balance</div>
                  <div>Sell</div>
                </div>
              </div>
              <div className="flex-col basis-full">
                {items?.map(({ account, pubkey }) => (
                  <div key={pubkey.toString()} className="flex justify-around">
                    <div>
                      <div className="flex space-x-2">
                        <span className="font-body">
                          <ExplorerLink
                            label={ellipsify(pubkey.toString())}
                            path={`account/${pubkey.toString()}`}
                          />
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex space-x-2">
                        <span className="font-body">
                          <ExplorerLink
                            label={ellipsify(account.data.parsed.info.mint)}
                            path={`account/${account.data.parsed.info.mint.toString()}`}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-body">
                        {account.data.parsed.info.tokenAmount.uiAmount}
                      </span>
                    </div>
                    <div>
                      <Link
                        href="/sell"
                        // onClick={showBuySellWindow}
                        className="flex-1 px-2 rounded-lg hover:bg-white bg-red-600 text-black"
                      >
                        Sell
                      </Link>
                    </div>
                  </div>
                ))}
                {(query.data?.length ?? 0) > 5 && (
                  <div>
                    <div className="text-center">
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => setShowAll(!showAll)}
                      >
                        {showAll ? "Show Less" : "Show All"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

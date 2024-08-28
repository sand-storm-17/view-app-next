import {CoinCard} from "./coinCard";

export default function Dashboard() {
  return (
    <>
      <div className="flex basis-full flex-col gap-2">
        <CoinCard name="pwp" image="pp" amount="10"/>
      </div>
    </>
  );
}


import Window from '@/components/leaderboard_dashboard/window';
import NewCoin from '@/components/token/new-coin';

export default function Page() {
  return (
    <div className="flex basis-full">
      <NewCoin />
      <Window />
    </div>
  );
}

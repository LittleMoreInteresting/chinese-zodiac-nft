import AppHeader from './components/AppHeader'
import NFTBox from './components/NFTBox'
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-15">
      <AppHeader />
      <NFTBox />
    </div>
  );
}

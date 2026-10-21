
import './App.css'
import SongCard from './components/Songs/SongCard'
import type { TrackView } from './components/Songs/Types/TrackView';
import { tracks } from './Data/track';
import type { Track } from './Model/Track';

function App() {


  const totalTracks: number = tracks.length;
  const random: number = Math.floor(Math.random() * totalTracks);
  const track: Track = tracks[random]

  const trackInfo: TrackView = {
    ...track,
    reproduccions: Math.floor(Math.random() * 10205)
  };

  return (
    <>
      <SongCard trackInfo={trackInfo} />
    </>
  )
}

export default App

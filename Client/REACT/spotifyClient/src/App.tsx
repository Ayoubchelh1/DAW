
import './App.css'
import SongCard from './components/Songs/SongCard'
import { tracks } from './Data/track';
import type { Track } from './Model/Track';

function App() {


  const totalTracks: number = tracks.length;
  const random: number = Math.floor(Math.random() * totalTracks);
  const track: Track = tracks[random]

  return (
    <>
      <SongCard title={track.title} artist={track.artist} duration={track.duration} />
    </>
  )
}

export default App

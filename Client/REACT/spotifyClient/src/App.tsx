import { useState } from 'react';
import './App.css'
import Header from './components/Header/Header'
import SongCard from './components/Songs/SongCard'
import type { TrackView } from './components/Songs/Types/TrackView';
import { tracks } from './Data/track';
import { users } from './Data/user';

function getRandomTrack(): TrackView {
  const totalTracks: number = tracks.length;
  const randomIndex: number = Math.floor(Math.random() * totalTracks);
  const randomTrack = tracks[randomIndex];

  return {
    ...randomTrack,
    reproduccions: Math.floor(Math.random() * 10205)
  };
}

function App() {

  const [randomUser] = useState(() => users[Math.floor(Math.random() * users.length)]);
  const [trackWr, setTrack] = useState<TrackView>(getRandomTrack);

  function incrementarReproduccions() {
    const tr = (prev: TrackView): TrackView => {
      return {
        ...prev,
        reproduccions: prev.reproduccions + 1
      }
    }

    setTrack(tr);

  }

  function handleClickRandom() {
    setTrack((currentTrack) => ({
      ...getRandomTrack(),
      reproduccions: currentTrack.reproduccions
    }));
  }

  return (
    <>
      <Header title="Spotify" user={randomUser.name} />
      <SongCard trackInfo={trackWr} />
      <p><button onClick={handleClickRandom}>Random</button></p>
    </>
  )
}

export default App

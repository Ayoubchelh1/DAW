
import { useState } from 'react';
import './App.css'
import Header from './components/Header/Header'
import SongCard from './components/Songs/SongCard'
import type { TrackView } from './components/Songs/Types/TrackView';
import { tracks } from './Data/track';
import { users } from './Data/user';
import type { Track } from './Model/Track';


export function getCurrentDate(): string {
  const currentDate = new Date();
  const year: string = currentDate.getFullYear().toString();
  const month: string = (currentDate.getMonth() + 1).toString();
  const day: string = currentDate.getDate().toString();

  return `${day}/${month}/${year}`;
}


function App() {

  const [randomUser] = useState(() => users[Math.floor(Math.random() * users.length)]);
  const [today] = useState(getCurrentDate);

  const totalTracks: number = tracks.length;
  const random: number = Math.floor(Math.random() * totalTracks);
  const track: Track = tracks[random]

  const trackWr: TrackView = {
    ...track,
    reproduccions: Math.floor(Math.random() * 10205)
  };

  return (
    <>
      <Header title="Spotify" user={randomUser.name} date={today} />
      <SongCard trackInfo={trackWr} />
    </>
  )
}

export default App

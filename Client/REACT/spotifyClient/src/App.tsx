import { useState } from 'react';
import './App.css'
import Header from './components/Header/Header'
import Reproduint from './components/Reproduint/Reproduint'
import SongCard from './components/Songs/SongCard'
import type { TrackView } from './components/Songs/Types/TrackView';
import { tracks } from './Data/track';
import { users } from './Data/user';
import type { Like } from './components/Songs/Types/Like';

function getRandomTrack(): TrackView {
  const totalTracks: number = tracks.length;
  const randomIndex: number = Math.floor(Math.random() * totalTracks);
  const randomTrack = tracks[randomIndex];

  return {
    ...randomTrack,
    reproduccions: Math.floor(Math.random() * 10205),
    likes: {
      like: false,
      totalLikes: 0
    }
  };
}

function App() {

  const [randomUser] = useState(() => users[Math.floor(Math.random() * users.length)]);
  const [track, setTrack] = useState<TrackView>(getRandomTrack);
  const [volum, setVolum] = useState(10);
  const [playingSongTitle, setPlayingSongTitle] = useState<string | null>(null);

  function pujarVolum() {
    setVolum((volumActual) => Math.min(volumActual + 1, 100));
  }

  function baixarVolum() {
    setVolum((volumActual) => Math.max(volumActual - 1, 0));
  }

  function incrementarReproduccions() {
    const tr = (prev: TrackView): TrackView => {
      return {
        ...prev,
        reproduccions: prev.reproduccions + 1
      }
    }

    setTrack(tr);

  }

  function togglePlaying() {
    if (playingSongTitle === track.title) {
      setPlayingSongTitle(null);
      return;
    }

    setPlayingSongTitle(track.title);
    incrementarReproduccions();
  }

  function reset() {
    setTrack((prev) => ({
      ...prev,
      reproduccions: 0,
      likes: {
        like: false,
        totalLikes: 0
      }
    }));
  }

  function gestionarLikes() {
    const tr = (prev: TrackView): TrackView => {

      let increment: number = 1;
      if (prev.likes.like) {
        increment = -1;
      }

      const likeObj: Like = {
        like: !prev.likes.like,
        totalLikes: prev.likes.totalLikes + increment
      }



      return {
        ...prev,
        likes: likeObj
      }
    }

    setTrack(tr);

  }

  function handleClickRandom() {
    setTrack(() => ({
      ...getRandomTrack(),

    }));
    setPlayingSongTitle(null);
  }

  return (
    <>
      <Header title="Spotify" user={randomUser.name} />
      <SongCard trackInfo={track} play={togglePlaying} reset={() => reset()} like={() => gestionarLikes()}
      />
      <Reproduint
        volum={volum}
        pujarVolum={pujarVolum}
        baixarVolum={baixarVolum}
        playingSongTitle={playingSongTitle}
      />
      <p><button onClick={handleClickRandom}>Random</button></p>
    </>
  )
}

export default App

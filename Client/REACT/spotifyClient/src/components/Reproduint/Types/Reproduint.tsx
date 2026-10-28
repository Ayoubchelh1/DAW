import { useState } from 'react';

const MIN_VOLUME = 0;
const MAX_VOLUME = 100;

const Reproduint = () => {
    const [volume, setVolume] = useState(50);

    function pujarVolum() {
        setVolume((currentVolume) => Math.min(currentVolume + 1, MAX_VOLUME));
    }

    function baixarVolum() {
        setVolume((currentVolume) => Math.max(currentVolume - 1, MIN_VOLUME));
    }

    return (
        <section>
            <h2>Reproduint</h2>
            <p>Volum: {volume}</p><button onClick={baixarVolum}>-</button><button onClick={pujarVolum}>+</button>
        </section>
    );
};

export default Reproduint;
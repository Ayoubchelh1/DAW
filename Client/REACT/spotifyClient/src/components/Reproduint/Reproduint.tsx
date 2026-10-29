import type { ReproduintProps } from './Types/ReproduintProps';

const Reproduint = (props: ReproduintProps) => {
    return (
        <section>
            <h2>Reproduint</h2>
            <span>Volum: {props.volum}</span>
            <button onClick={props.baixarVolum}>-</button>
            <button onClick={props.pujarVolum}>+</button>
            <p>
                {props.playingSongTitle ? `Playing song: ${props.playingSongTitle}` : "No song is playing"}
            </p>
            <button onClick={props.stopPlaying}>Stop</button>
        </section>
    );
};

export default Reproduint;
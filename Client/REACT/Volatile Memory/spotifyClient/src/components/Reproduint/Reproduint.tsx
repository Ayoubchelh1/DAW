import type { ReproduintProps } from './Types/ReproduintProps';

const Reproduint = (props: ReproduintProps) => {
    return (
        <section>
            <h2>Reproduint</h2>
            <span>Volum: {props.volum}</span>
            <button onClick={props.baixarVolum}>-</button>
            <button onClick={props.pujarVolum}>+</button>
            <p>{props.playingSongTitle && <button onClick={props.stopPlaying}>Stop</button>}</p>
        </section>
    );
};

export default Reproduint;
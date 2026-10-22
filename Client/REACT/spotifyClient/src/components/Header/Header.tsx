import type { HeaderProps } from "./Types/HeaderProps";

const Header = (props: HeaderProps) => {
    return (
        <header>
            <h1>{props.title}</h1>
            <p>Usuari: {props.user}</p>
            <p>Data: {props.date}</p>
        </header>
    );
};

export default Header;

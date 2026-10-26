import { useState } from "react";
import type { HeaderProps } from "./Types/HeaderProps";

function getCurrentDate(): string {
    const currentDate = new Date();
    const year: string = currentDate.getFullYear().toString();
    const month: string = (currentDate.getMonth() + 1).toString();
    const day: string = currentDate.getDate().toString();
    const hour: string = currentDate.getHours().toString().padStart(2, "0");
    const minutes: string = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds: string = currentDate.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
}

const Header = (props: HeaderProps) => {
    const [date, setDate] = useState(getCurrentDate);

    function handleClickUpdateDate() {
        setDate(getCurrentDate());
    }

    return (
        <header>
            <p><button onClick={handleClickUpdateDate}>Actualitzar Data</button></p>
            <h1>{props.title}</h1>
            <p>Usuari: {props.user}</p>
            <p>Data: {date}</p>
        </header>
    );
};

export default Header;

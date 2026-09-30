import { tracks } from "../../data/track";

export function createTableHead(): HTMLTableSectionElement {

    const thead: HTMLTableSectionElement = document.createElement("thead");
    const trHead: HTMLTableRowElement = document.createElement("tr");
    const thTitol: HTMLTableCellElement = document.createElement("th");
    const thDurada: HTMLTableCellElement = document.createElement("th");
    const thReproduccions: HTMLTableCellElement = document.createElement("th");
    const playTd: HTMLTableCellElement = document.createElement("td");
    const playBoto: HTMLButtonElement = document.createElement("button");


    thTitol.textContent = "Titol";
    thDurada.textContent = "Durada";
    thReproduccions.textContent = "Numero de reproduccions";
    playBoto.type = "button";
    playBoto.textContent = "Play";



    trHead.appendChild(thTitol);
    trHead.appendChild(thDurada);
    trHead.appendChild(thReproduccions);
    thead.appendChild(trHead);

    return thead

}


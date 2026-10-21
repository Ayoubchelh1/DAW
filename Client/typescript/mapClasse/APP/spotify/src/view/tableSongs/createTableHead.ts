export function createTableHead(): HTMLTableSectionElement {

    const thead: HTMLTableSectionElement = document.createElement("thead");
    const trHead: HTMLTableRowElement = document.createElement("tr");
    const thTitol: HTMLTableCellElement = document.createElement("th");
    const thDurada: HTMLTableCellElement = document.createElement("th");
    const thReproduccions: HTMLTableCellElement = document.createElement("th");
    const thPlay: HTMLTableCellElement = document.createElement("th");


    thTitol.textContent = "Titol";
    thDurada.textContent = "Durada";
    thReproduccions.textContent = "Numero de reproduccions";
    thPlay.textContent = "Play";

    trHead.appendChild(thTitol);
    trHead.appendChild(thDurada);
    trHead.appendChild(thReproduccions);
    trHead.appendChild(thPlay);
    thead.appendChild(trHead);

    return thead

}


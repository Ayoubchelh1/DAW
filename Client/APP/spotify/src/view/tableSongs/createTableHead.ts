
export function createTableHead(): HTMLTableSectionElement {

    const thead: HTMLTableSectionElement = document.createElement("thead");
    const trHead: HTMLTableRowElement = document.createElement("tr");
    const thTitol: HTMLTableCellElement = document.createElement("th");
    const thDurada: HTMLTableCellElement = document.createElement("th");
    const thReproduccions: HTMLTableCellElement = document.createElement("th");


    thTitol.textContent = "Titol";
    thDurada.textContent = "Durada";
    thReproduccions.textContent = "Numero de reproduccions";

    trHead.appendChild(thTitol);
    trHead.appendChild(thDurada);
    trHead.appendChild(thReproduccions);
    thead.appendChild(trHead);

    return thead

}


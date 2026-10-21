export function crearInputCerca(): HTMLInputElement {
    const input: HTMLInputElement = document.createElement("input");

    input.id = "cerca";
    input.name = "cerca";
    input.type = "text";
    input.placeholder = "Introdueix canço a buscar";

    return input;
}
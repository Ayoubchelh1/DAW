import { crearInputCerca } from "./crearInputCerca";

export function crearCerca(): HTMLFormElement {


    const form: HTMLFormElement = document.createElement("form");
    const label: HTMLLabelElement = document.createElement("label");
    const input: HTMLInputElement = crearInputCerca();

    label.textContent = "Buscar";
    label.appendChild(input);


    const botoCerca: HTMLButtonElement = crearBotoCerca();
}
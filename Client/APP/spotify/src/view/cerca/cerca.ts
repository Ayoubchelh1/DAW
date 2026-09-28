import { crearBotoCerca } from "./crearBotoCerca";
import { crearInputCerca } from "./crearInputCerca";

export function crearCerca(): HTMLFormElement {


    const form: HTMLFormElement = document.createElement("form");
    const label: HTMLLabelElement = document.createElement("label");
    const input: HTMLInputElement = crearInputCerca();

    label.textContent = "Buscar";
    label.appendChild(input);

    const getValueSearch: () => string = () => { return input.value.trim(); }

    const botoCerca: HTMLButtonElement = crearBotoCerca(getValueSearch);
    form.appendChild(label);
    form.appendChild(botoCerca);

    return form;
}
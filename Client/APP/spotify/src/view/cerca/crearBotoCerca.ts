export function crearBotoCerca(
    getValueSearch: () => string,
    cercar: (textABuscar: string) => void
): HTMLButtonElement {
    const botoCerca: HTMLButtonElement = document.createElement("button");
    botoCerca.type = "button";
    botoCerca.textContent = "Cerca";
    botoCerca.addEventListener("click",
        () => {
            cercar(getValueSearch());
        });
    return botoCerca;
}
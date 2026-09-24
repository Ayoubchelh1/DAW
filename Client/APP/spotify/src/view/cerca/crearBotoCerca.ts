export function crearBotoCerca(buscar: HTMLInputElement): HTMLButtonElement {
    const botoCerca: HTMLButtonElement = document.createElement("button");
    botoCerca.type = "button";
    botoCerca.textContent = "Cerca";
    botoCerca.addEventListener("click",
        () => {
            console.log("Buscar: " + buscar.value.trim());
        });
    return botoCerca;
}
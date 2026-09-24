export function crearBotoCerca(): HTMLButtonElement {
    const botoCerca: HTMLButtonElement = document.createElement("button");
    botoCerca.type = "button";
    botoCerca.addEventListener("click",
        () => {
            console.log("Clicat botó de cerca")
        });
    return botoCerca;
}
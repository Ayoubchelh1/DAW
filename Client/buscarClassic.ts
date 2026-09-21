interface Canco {
    id: string;
    titol: string;
    artista: string;
    durada: number;
}


function imprimir(canco: Canco): void {
    if (canco !== null) {
        console.log(canco);
    }
    else {
        console.log("Cançó no existeix");
    }
}

function imprimirArray(cancons: Canco[]): void {
    for (let i: number = 0; i < cancons.length; i++) {
        imprimir(cancons[i])
    }
}

const cancoABuscar: Canco = {
    id: "2B-CA",
    titol: "Rattle and Hum",
    artista: "U2",
    durada: 90
};

const cancons: Canco[] = [
    {
        id: "2B-CA",
        titol: "Rattle and Hum",
        artista: "U2",
        durada: 90
    },
    {
        id: "3B-TX",
        titol: "Chicago",
        artista: "Michael Jackson",
        durada: 190
    },
]


console.log(cancoABuscar);

function buscarCanco(titol: string, cancoList: Canco[]): Canco | null {
    const totalCancons: number = cancoList.length - 1;
    let i: number = 0;

    while (i < totalCancons && titol !== cancoList[i].titol) {
        i++
    }
    if (titol === cancoList[i].titol) {
        return cancoList[i];
    }
    else {
        return null;
    }

}

let existeixCanco: Canco | null = buscarCanco(cancoABuscar.titol, cancons);
imprimir(existeixCanco!);

existeixCanco = buscarCanco("Chicago", cancons);
imprimir(existeixCanco!);

existeixCanco = buscarCanco("binding lights", cancons);
imprimir(existeixCanco!);

function buscarCancoLlarga(durada: number, cancoList: Canco[]): Canco[] {
    const totalCancons: number = cancoList.length;

    const canconsLlargues: Canco[] = [];


    for (let i: number = 0; i < totalCancons; i++) {
        if (cancoList[i].durada >= durada) {
            canconsLlargues.push(cancoList[i]);

        }
    }
    return canconsLlargues;
}

const canconsLl: Canco[] = buscarCancoLlarga(30, cancons);
imprimirArray(canconsLl);

export { }
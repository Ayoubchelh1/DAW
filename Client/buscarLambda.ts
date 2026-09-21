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

let titol: string = "Chicago";

const songsSearch: Canco[] = cancons.filter(
    (c: Canco) => {
        return c.titol === titol && c.durada > 120;
    }
);

console.log(songsSearch);
export { }
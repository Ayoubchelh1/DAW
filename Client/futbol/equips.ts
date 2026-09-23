interface equip {
    nom: string;
    jugadors: Jugador;

}

interface Jugador {
    name: string;
    titulars: string;
}

const equip: equip[] = [
    {
        nom: "Esp",
        jugadors: [
            {
                name: "Berni",
                titulars: "Si"
            },
            {
                name: "Isac",
                titulars; "NO"
            }
        ]
    },
    {
        nom: "BCN",
        jugadors: [
            {
                name: "Isac",
                titulars: "No"
            }
        ]
    }
]


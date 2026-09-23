interface Equip {
    nom: string;
    jugadors: Jugador[];

}

interface Jugador {
    name: string;
    titulars: boolean;
    dorsal: number;
}

const equips: Equip[] = [
    {
        nom: "RCD Espanyol",
        jugadors: [
            {
                name: "Pol Lozano",
                titulars: false,
                dorsal: 10
            },
            {
                name: "Roger Hinojo",
                titulars: true,
                dorsal: 21
            },
            {
                name: "Urko Gonzalez",
                titulars: true,
                dorsal: 4
            }
        ]
    },
    {
        nom: "Real Betis",
        jugadors: [
            {
                name: "Anthony",
                titulars: false,
                dorsal: 7
            },
            {
                name: "Isco",
                titulars: false,
                dorsal: 21
            },
            {
                name: "Marc Roca",
                titulars: true,
                dorsal: 4
            }
        ]
    }
]


function equipTitular(equips: Equip[], nom: string): Jugador[] {
    const equipSel: Equip | undefined = equips.find(
        (e: Equip) => {
            return e.nom === nom;
        }
    )

    if (equipSel === undefined) {
        return [];
    }
    return equipSel.jugadors.filter(
        (j: Jugador) => { return j.titulars }
    )

}

const nomEquip: string = "Real Betis";
const jugadorTitulars: Jugador[] = equipTitular(equips, nomEquip);

console.log(jugadorTitulars);
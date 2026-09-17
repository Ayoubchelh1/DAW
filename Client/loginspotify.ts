
interface usuari {
    username: string;
    password: string;
    edat: number;
}


function autentificacio(u: usuari): boolean {

    let correcte: boolean = false;

    if (u.username === "correuOK" && u.password === "passwordOK" && u.edat > 14) {
        correcte = true;
    }

    return correcte;
}


function imprimir(auth: boolean): void {
    if (auth) {
        console.log("usuari correcte");
    } else {
        console.log("usuari incorrecte");
    }
}


const usuariCorrecte: usuari = {
    username: "correuOK",
    password: "passwordOK",
    edat: 15
};

let autoOK: boolean = autentificacio(usuariCorrecte);
imprimir(autoOK);

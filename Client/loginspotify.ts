
interface usuari {
    username: string;
    password: string;
    edat: number;
}

function autentificacio(usuari: usuari): boolean {

    let correcte: boolean = false;

    if (usuari.username === "correuOK" && 
        usuari.password === "passwordOK" && 
        usuari.edat > 14) {
        
        correcte = true;
    }

    return correcte;
}


function imprimir(auth: boolean): void {
    if (auth) {
        console.log("correu correcte");
    } else {
        console.log("correu incorrecte");
    }
}

const usuariCorrecte: usuari = {
    username: "correuOK",
    password: "passwordOK",
    edat: 15
};

let autoOK: boolean = autentificacio(usuariCorrecte);
imprimir(autoOK);

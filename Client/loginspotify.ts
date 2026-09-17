
interface usuari {
    username: string;
    password: string;
    edat: number;
}

// Función de autenticación
function autentificacio(usuari: usuari): boolean {

    let correcte:boolean = false;
    // Validar usuario
    if (usuario.correu === "correuOK" && usuari.password === "passwordOK" && usuari.edat>14) {
        correcte=true;
    } 
    return correcte  
}

function imprimir(auth:boolean):void{
    if(auth){
        consol.log("correu correcte)
                   }else{
        consol.log("correu incorrecte)
                   }
}

const usuariCorrecte:usuari = {
    password: "passwordOK" ,
    correu: "correuOK" ,
    edat: 15
}

let autoOK: boolean = autentificacio(usuariCorrecte);
imprimir(autoOK);
    

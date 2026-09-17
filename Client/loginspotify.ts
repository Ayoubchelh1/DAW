// ===============================
// AUTENTIFICACIÓN (HARDCODE)
// CON MENSAJES PERSONALIZADOS
// ===============================

// Datos simulando base de datos
const USUARIO_CORRECTO = "ayoub";
const PASSWORD_CORRECTO = "123456";

// Tipo de respuesta (para que quede más claro en TS)
type ResultadoAuth = {
    ok: boolean;
    mensaje: string;
};

// Función de autenticación
function autentificar(usuario: string, password: string, edad: number): ResultadoAuth {

    // Validar usuario
    if (usuario !== USUARIO_CORRECTO) {
        return {
            ok: false,
            mensaje: "Usuario incorrecto"
        };
    }

    // Validar contraseña
    if (password !== PASSWORD_CORRECTO) {
        return {
            ok: false,
            mensaje: "Contraseña incorrecta"
        };
    }

    // Validar edad (>14)
    if (edad <= 14) {
        return {
            ok: false,
            mensaje: "Debes tener más de 14 años para acceder"
        };
    }

    // Todo correcto
    return {
        ok: true,
        mensaje: "Autenticación correcta. Bienvenido!"
    };
}


// ===============================
// CASOS DE PRUEBA
// ===============================

// Caso 1: TODO CORRECTO
// Usuario, contraseña y edad válidos
console.log("Caso 1:", autentificar("ayoub", "123456", 18));
// Esperado: { ok: true, mensaje: "Autenticación correcta. Bienvenido!" }


// Caso 2: USUARIO INCORRECTO
// Usuario incorrecto aunque el resto esté bien
console.log("Caso 2:", autentificar("admin", "123456", 18));
// Esperado: { ok: false, mensaje: "Usuario incorrecto" }


// Caso 3: CONTRASEÑA INCORRECTA
// Usuario correcto pero password incorrecto
console.log("Caso 3:", autentificar("ayoub", "000000", 18));
// Esperado: { ok: false, mensaje: "Contraseña incorrecta" }


// Caso 4: EDAD NO VÁLIDA
// Usuario y password correctos pero edad <= 14
console.log("Caso 4:", autentificar("ayoub", "123456", 14));
// Esperado: { ok: false, mensaje: "Debes tener más de 14 años para acceder" }


// Caso 5: TODO INCORRECTO
// Falla primero en usuario (orden de validación)
console.log("Caso 5:", autentificar("test", "111111", 10));
// Esperado: { ok: false, mensaje: "Usuario incorrecto" }


// Caso 6: CASO LÍMITE VÁLIDO
// Edad justo mayor a 14
console.log("Caso 6:", autentificar("ayoub", "123456", 15));
// Esperado: { ok: true, mensaje: "Autenticación correcta. Bienvenido!" }
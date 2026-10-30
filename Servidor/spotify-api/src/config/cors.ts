import { CorsOptions } from "cors";
// Llista blanca de dominis autoritzats a fer peticions a la nostra API
const whitelist = [
    "http://localhost:5173", // React / Vite
    "http://localhost:4200", // Angular
    "http://localhost:5500", // Live Server
    "http://127.0.0.1:5500", // Live Server
    "https://www.musiccloud-app.com" // Domini de producció
];
export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Bloquejat pel sistema de seguretat CORS de MusicCloud"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Permetem que ens enviïn el token JWT
    credentials: true // Permet l'enviament de cookies o capçaleres d'autenticació si calgués
};
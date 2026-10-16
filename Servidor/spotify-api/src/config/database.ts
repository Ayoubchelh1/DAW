import "dotenv/config";
import { Server } from "http";
import sql from "mssql";
import { PassThrough } from "stream";

function getRequiredEnv(name: string) {
    const value: string | undefined = process.env[name];

    if (!value) {
        throw new Error('Missing envoirment variable $(name');

    }

    return value;
}

const databaseConfig: sql.config = {
    user: getRequiredEnv("DB_USER"),
    password: getRequiredEnv("DB_PASSWORD"),
    server: getRequiredEnv("DB_HOST"),
    port: getRequiredEnv("DB_PORT") as unknown as number,
    database: getRequiredEnv("DB_NAME"),
    options: {
        encrypt: getRequiredEnv("DB_ENCRYPT") === "true",
        trustServerCertificate: getRequiredEnv("DB_TRUST_SERVER_CERTIFICATE") === "true"
    }

}

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
    if (pool) {
        return pool;
    }

    pool = await sql.connect(databaseConfig);
    return pool;
}
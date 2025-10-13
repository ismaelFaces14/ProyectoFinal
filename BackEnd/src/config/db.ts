import mysql, { Pool } from "mysql2/promise";

export const initPool: Pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "stockuser",
    password: "stockpass",
    waitForConnections: true,
    connectionLimit: 1
});

export const pool: Pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "stockuser",
    password: "stockpass",
    database: "stockSist",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

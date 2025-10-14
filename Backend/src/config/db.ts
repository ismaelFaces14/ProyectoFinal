import mysql, { Pool } from "mysql2/promise";

export const initPool: Pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "stockuser",
    password: "stockpass",
    database: "stocksist",
    waitForConnections: true,
    connectionLimit: 5,
});

import { initPool } from "../config/db";

export async function initDB() {
    const conn = await initPool.getConnection();
    try {
        await conn.query("CREATE DATABASE IF NOT EXISTS stockSist;");
        await conn.query("USE stockSist;");

        await conn.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                descripcion TEXT,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS atributos (
                id BIGINT  AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE
            );
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS valores_atributos (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                id_atributo INT NOT NULL,
                valor VARCHAR(100) NOT NULL,
                FOREIGN KEY (id_atributo) REFERENCES atributos(id) ON DELETE CASCADE,
                UNIQUE (id_atributo, valor)
            );
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS producto_atributos (
                id_producto BIGINT NOT NULL,
                id_atributo BIGINT NOT NULL,
                PRIMARY KEY (id_producto, id_atributo),
                FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (id_atributo) REFERENCES atributos(id) ON DELETE CASCADE
            );
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS producto_variantes (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                id_producto BIGINT NOT NULL,
                sku VARCHAR(100),
                stock INT DEFAULT 0,
                precio DECIMAL(10,2) DEFAULT 0,
                FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
            );
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS producto_variantes_valores (
                id_variante BIGINT NOT NULL,
                id_valor BIGINT NOT NULL,
                PRIMARY KEY (id_variante, id_valor),
                FOREIGN KEY (id_variante) REFERENCES producto_variantes(id) ON DELETE CASCADE,
                FOREIGN KEY (id_valor) REFERENCES valores_atributos(id) ON DELETE CASCADE
            );
        `);

        console.log("Base de datos y tablas creadas correctamente");

    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
    } finally {
        conn.release();
    }
}
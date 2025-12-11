"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalidaModel = void 0;
const db_1 = require("../config/db");
const productoModel_1 = require("./productoModel");
class SalidaModel {
    static async registrarSalida(productos, notes) {
        const conn = await db_1.initPool.getConnection();
        try {
            await conn.beginTransaction();
            const [outputResult] = await conn.query(`INSERT INTO product_outputs (notes) VALUES (?)`, [notes || null]);
            const outputId = outputResult.insertId;
            for (const item of productos) {
                if (!item.product_id || isNaN(item.product_id)) {
                    throw new Error(`ID de producto inválido: ${item.product_id}`);
                }
                const resultado = await productoModel_1.ProductModel.descontarStock(item.product_id, item.quantity);
                if (resultado !== "ok") {
                    throw new Error(`Error con producto ${item.product_id}: ${resultado}`);
                }
                await conn.query(`INSERT INTO product_output_items (output_id, product_id, quantity, unit_price)
                    VALUES (?, ?, ?, ?)`, [outputId, item.product_id, item.quantity, item.unit_price]);
            }
            await conn.commit();
            return outputId;
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    }
    static async obtenerTodas() {
        const conn = await db_1.initPool.getConnection();
        try {
            const [rows] = await conn.query(`
                SELECT o.id,
                    MAX(o.output_date) AS output_date,
                    MAX(o.notes) AS notes,
                    COUNT(oi.id) AS cantidad_items,
                    COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS total
                FROM product_outputs o
                LEFT JOIN product_output_items oi ON oi.output_id = o.id
                GROUP BY o.id
                ORDER BY output_date DESC;
            `);
            return rows.map(row => ({
                id: row.id,
                output_date: row.output_date,
                notes: row.notes,
                cantidad_items: row.cantidad_items,
                total: row.total
            }));
        }
        finally {
            conn.release();
        }
    }
    static async obtenerDetalle(id) {
        const conn = await db_1.initPool.getConnection();
        try {
            const [rows] = await conn.query(`
      SELECT p.name, oi.quantity, oi.unit_price
      FROM product_output_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.output_id = ?
    `, [id]);
            return rows.map(row => ({
                name: row.name,
                quantity: row.quantity,
                unit_price: row.unit_price
            }));
        }
        finally {
            conn.release();
        }
    }
}
exports.SalidaModel = SalidaModel;
//# sourceMappingURL=salidaModel.js.map
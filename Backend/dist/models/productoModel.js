"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const db_1 = require("../config/db");
class ProductModel {
    static async crearProductoAtributos(product, attributes) {
        const conn = await db_1.initPool.getConnection();
        try {
            await conn.beginTransaction();
            const [productResult] = await conn.query(`INSERT INTO products (name, sku, stock, price) VALUES (?, ?, ?, ?)`, [product.name, product.sku, product.stock, product.price]);
            const productId = productResult.insertId;
            for (const attr of attributes) {
                const [existing] = await conn.query(`SELECT id FROM attributes WHERE name = ?`, [attr.name]);
                let attributeId;
                if (existing.length > 0) {
                    attributeId = existing[0].id;
                }
                else {
                    const [attrResult] = await conn.query(`INSERT INTO attributes (name, data_type) VALUES (?, ?)`, [attr.name, attr.data_type]);
                    attributeId = attrResult.insertId;
                }
                const valueFields = {
                    string: "value_string",
                    number: "value_number",
                    boolean: "value_boolean",
                    date: "value_date",
                };
                const field = valueFields[attr.data_type];
                const query = `INSERT INTO product_attributes (product_id, attribute_id, ${field}) VALUES (?, ?, ?)`;
                await conn.query(query, [productId, attributeId, attr.value]);
            }
            await conn.commit();
            return productId;
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    }
    static async encontrarTodos() {
        const conn = await db_1.initPool.getConnection();
        const [rows] = await conn.query(`SELECT * FROM products ORDER BY created_at DESC`);
        conn.release();
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            sku: row.sku,
            stock: row.stock,
            price: row.price,
            created_at: new Date(row.created_at),
        }));
    }
    static async encontrarPorId(productId) {
        const conn = await db_1.initPool.getConnection();
        const [rows] = await conn.query(`SELECT * FROM products WHERE id = ?`, [productId]);
        conn.release();
        if (rows.length === 0)
            return null;
        const row = rows[0];
        return {
            id: row.id,
            name: row.name,
            sku: row.sku,
            stock: row.stock,
            price: row.price,
            created_at: new Date(row.created_at),
        };
    }
    static async encontrarPorNombre(name) {
        const conn = await db_1.initPool.getConnection();
        const [rows] = await conn.query(`SELECT * FROM products WHERE name LIKE ?`, [`%${name}%`]);
        conn.release();
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            sku: row.sku,
            stock: row.stock,
            price: row.price,
            created_at: new Date(row.created_at),
        }));
    }
    static async actualizar(id, updates) {
        const conn = await db_1.initPool.getConnection();
        const fields = [];
        const values = [];
        if (updates.name !== undefined) {
            fields.push("name = ?");
            values.push(updates.name);
        }
        if (updates.sku !== undefined) {
            fields.push("sku = ?");
            values.push(updates.sku);
        }
        if (updates.stock !== undefined) {
            fields.push("stock = ?");
            values.push(updates.stock);
        }
        if (updates.price !== undefined) {
            fields.push("price = ?");
            values.push(updates.price);
        }
        if (fields.length === 0) {
            conn.release();
            return false;
        }
        values.push(id);
        const [result] = await conn.query(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, values);
        conn.release();
        return result.affectedRows > 0;
    }
    static async encontrarAtributos(productoId) {
        const conn = await db_1.initPool.getConnection();
        const [rows] = await conn.query(`SELECT
                a.id AS attribute_id,
                a.name AS attribute_name,
                a.data_type,
                pa.value_string,
                pa.value_number,
                pa.value_boolean,
                pa.value_date
            FROM product_attributes pa
            JOIN attributes a ON pa.attribute_id = a.id
            WHERE pa.product_id = ?
            `, [productoId]);
        conn.release();
        return rows.map((row) => {
            const dataType = row.data_type;
            let value = null;
            switch (dataType) {
                case "string":
                    value = row.value_string;
                    break;
                case "number":
                    value = row.value_number;
                    break;
                case "boolean":
                    value = row.value_boolean;
                    break;
                case "date":
                    value = row.value_date ? new Date(row.value_date) : null;
                    break;
            }
            return {
                attribute: {
                    id: row.attribute_id,
                    name: row.attribute_name,
                    data_type: dataType,
                },
                value
            };
        });
    }
    static async descontarStock(productId, cantidad, connection) {
        const conn = connection || await db_1.initPool.getConnection();
        const shouldRelease = !connection;
        try {
            const [rows] = await conn.query(`SELECT stock FROM products WHERE id = ? FOR UPDATE`, [productId]);
            if (rows.length === 0) {
                return "producto no encontrado";
            }
            const stockActual = rows[0].stock;
            if (stockActual < cantidad) {
                return "sin_stock";
            }
            const nuevoStock = stockActual - cantidad;
            const [result] = await conn.query(`UPDATE products SET stock = ? WHERE id = ?`, [nuevoStock, productId]);
            return result.affectedRows > 0 ? "ok" : "producto no encontrado";
        }
        finally {
            if (shouldRelease) {
                conn.release();
            }
        }
    }
    static async eliminarProducto(productId) {
        const conn = await db_1.initPool.getConnection();
        try {
            await conn.beginTransaction();
            await conn.query(`DELETE FROM product_attributes WHERE product_id = ?`, [productId]);
            const [result] = await conn.query(`DELETE FROM products WHERE id = ?`, [productId]);
            await conn.commit();
            return result.affectedRows > 0;
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    }
    static async actualizarProductoAtributos(productId, attributes) {
        const conn = await db_1.initPool.getConnection();
        try {
            await conn.beginTransaction();
            for (const attr of attributes) {
                const [existingAttr] = await conn.query(`SELECT id FROM attributes WHERE name = ?`, [attr.name]);
                if (existingAttr.length === 0) {
                    throw new Error(`El atributo "${attr.name}" no existe`);
                }
                const attributeId = existingAttr[0].id;
                const valueFields = {
                    string: "value_string",
                    number: "value_number",
                    boolean: "value_boolean",
                    date: "value_date",
                };
                const field = valueFields[attr.data_type];
                const [conexion] = await conn.query(`SELECT id FROM product_attributes WHERE product_id = ? AND attribute_id = ?`, [productId, attributeId]);
                if (conexion.length > 0) {
                    await conn.query(`UPDATE product_attributes
                        SET value_string = NULL, value_number = NULL, value_boolean = NULL, value_date = NULL
                        WHERE product_id = ? AND attribute_id = ?`, [productId, attributeId]);
                    await conn.query(`UPDATE product_attributes
                        SET ${field} = ?
                        WHERE product_id = ? AND attribute_id = ?`, [attr.value, productId, attributeId]);
                }
                else {
                    await conn.query(`INSERT INTO product_attributes (product_id, attribute_id, ${field}) VALUES (?, ?, ?)`, [productId, attributeId, attr.value]);
                }
            }
            await conn.commit();
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    }
}
exports.ProductModel = ProductModel;
//# sourceMappingURL=productoModel.js.map
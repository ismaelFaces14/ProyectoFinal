import { initPool } from "../config/db";
import { IProducto, ProductAttribute, AttributeDataType, IAtributo } from "../interfaces/tablas";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export class ProductModel {
    static async crearProductoAtributos(
        product: Omit<IProducto, "id" | "created_at">,
        attributes: { name: string; data_type: AttributeDataType; value: string | number | boolean | Date }[]
    ): Promise<number> {
        const conn = await initPool.getConnection();
        try {
            await conn.beginTransaction();


            const [productResult] = await conn.query<ResultSetHeader>(
                `INSERT INTO products (name, sku, stock, price) VALUES (?, ?, ?, ?)`,
                [product.name, product.sku, product.stock, product.price]
            );
            const productId: number = productResult.insertId;

            for (const attr of attributes) {
                const [existing] = await conn.query<RowDataPacket[]>(
                    `SELECT id FROM attributes WHERE name = ?`,
                    [attr.name]
                );

                let attributeId: number;
                if (existing.length > 0) {
                    attributeId = existing[0].id as number;
                } else {
                    const [attrResult] = await conn.query<ResultSetHeader>(
                        `INSERT INTO attributes (name, data_type) VALUES (?, ?)`,
                        [attr.name, attr.data_type]
                    );
                    attributeId = attrResult.insertId;
                }

                const valueFields: Record<AttributeDataType, keyof ProductAttribute> = {
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
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    static async encontrarTodos(): Promise<IProducto[]> {
        const conn = await initPool.getConnection();
        const [rows] = await conn.query<RowDataPacket[]>(
            `SELECT * FROM products ORDER BY created_at DESC`
        );
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

    static async encontrarPorNombre(name: string): Promise<IProducto[]> {
        const conn = await initPool.getConnection();
        const [rows] = await conn.query<RowDataPacket[]>(
            `SELECT * FROM products WHERE name LIKE ?`,
            [`%${name}%`]
        );
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

    static async actualizar(id: number, updates: Partial<Omit<IProducto, "id" | "created_at">>): Promise<boolean> {
        const conn = await initPool.getConnection();

        const fields: string[] = [];
        const values: (string | number)[] = [];

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

        const [result] = await conn.query<ResultSetHeader>(
            `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
            values
        );
        conn.release();
        return result.affectedRows > 0;
    }

    static async encontrarAtributos(productoId: number): Promise<{
        attribute: IAtributo;
        value: string | number | boolean | Date | null;
    }[]> {
        const conn = await initPool.getConnection();
        const [rows] = await conn.query<RowDataPacket[]>(
            `SELECT
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
            `, [productoId]
        );
        conn.release();

        return rows.map((row) => {
            const dataType = row.data_type as AttributeDataType;
            let value: string | number | boolean | Date | null = null;

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

    static async descontarStock(productId: number, cantidad: number): Promise<"ok" | "sin_stock" | "producto no encontrado"> {
        const conn = await initPool.getConnection();
        try {
            const [rows] = await conn.query<RowDataPacket[]>(
                `SELECT stock FROM products WHERE id = ?`,
                [productId]
            );

            if (rows.length === 0) {
                return "producto no encontrado";
            }

            const stockActual = rows[0].stock as number;
            if (stockActual < cantidad) {
                return "sin_stock";
            }

            const nuevoStock = stockActual - cantidad;
            const [result] = await conn.query<ResultSetHeader>(
                `UPDATE products SET stock = ? WHERE id = ?`,
                [nuevoStock, productId]
            );

            return result.affectedRows > 0 ? "ok" : "producto no encontrado";
        } finally {
            conn.release();
        }
    }

    static async eliminarProducto(productId: number): Promise<boolean> {
        const conn = await initPool.getConnection();
        try {
            await conn.beginTransaction();

            await conn.query(`DELETE FROM product_attributes WHERE product_id = ?`, [productId]);

            const [result] = await conn.query<ResultSetHeader>(
                `DELETE FROM products WHERE id = ?`, [productId]
            );
            await conn.commit();
            return result.affectedRows > 0;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    static async actualizarProductoAtributos(productId: number, attributes: { name: string; data_type: AttributeDataType; value: string | number | boolean | Date }[]): Promise<void> {
        const conn = await initPool.getConnection();
        try {
            await conn.beginTransaction();

            for (const attr of attributes) {
                const [existingAttr] = await conn.query<RowDataPacket[]>(
                    `SELECT id FROM attributes WHERE name = ?`,
                    [attr.name]
                );

                if (existingAttr.length === 0) {
                    throw new Error(`El atributo "${attr.name}" no existe`);
                }

                const attributeId = existingAttr[0].id as number;

                const valueFields: Record<AttributeDataType, keyof ProductAttribute> = {
                    string: "value_string",
                    number: "value_number",
                    boolean: "value_boolean",
                    date: "value_date",
                };

                const field = valueFields[attr.data_type];

                const [conexion] = await conn.query<RowDataPacket[]>(
                    `SELECT id FROM product_attributes WHERE product_id = ? AND attribute_id = ?`,
                    [productId, attributeId]
                );

                if (conexion.length > 0) {
                    await conn.query(
                        `UPDATE product_attributes
                        SET value_string = NULL, value_number = NULL, value_boolean = NULL, value_date = NULL
                        WHERE product_id = ? AND attribute_id = ?`,
                        [productId, attributeId]
                    );

                    await conn.query(
                        `UPDATE product_attributes
                        SET ${field} = ?
                        WHERE product_id = ? AND attribute_id = ?`,
                        [attr.value, productId, attributeId]
                    );
                } else {
                    await conn.query(
                        `INSERT INTO product_attributes (product_id, attribute_id, ${field}) VALUES (?, ?, ?)`,
                        [productId, attributeId, attr.value]
                    );
                }
            }

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
}

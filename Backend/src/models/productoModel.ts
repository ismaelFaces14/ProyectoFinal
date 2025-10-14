import { initPool } from "../config/db";
import { IProducto, ProductAttribute, AttributeDataType } from "../interfaces/tablas";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export class ProductModel {
    static async createProductWithAttributes(
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
    static async findAll(): Promise<IProducto[]> {
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

    static async findByName(name: string): Promise<IProducto[]> {
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

    static async update(id: number, updates: Partial<Omit<IProducto, "id" | "created_at">>): Promise<boolean> {
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
}

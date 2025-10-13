import { pool } from "../config/db";
import { IProductoCompleto, IValorAtributo } from "../interfaces/tablas.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const productoModel = {
    async crearProductoBase(nombre: string, descripcion?: string) {
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO productos (nombre, descripcion) VALUES (?, ?)",
            [nombre, descripcion || null]
        );
        return result.insertId;
    },

    async obtenerProductoCompleto(idProducto: number): Promise<IProductoCompleto | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `
      SELECT 
        p.id AS producto_id,
        p.nombre AS producto_nombre,
        p.descripcion AS producto_descripcion,
        a.nombre AS atributo_nombre,
        va.valor AS valor_atributo,
        pv.stock AS stock
      FROM productos p
      LEFT JOIN producto_variantes pv ON pv.id_producto = p.id
      LEFT JOIN valores_atributos va ON va.id = pv.id_valor_atributo
      LEFT JOIN atributos a ON a.id = va.id_atributo
      WHERE p.id = ?
      `,
            [idProducto]
        );

        if (rows.length === 0) return null;

        const producto: IProductoCompleto = {
            id: rows[0].producto_id,
            nombre: rows[0].producto_nombre,
            descripcion: rows[0].producto_descripcion,
            atributos: [],
            stock: rows[0].stock || 0,
        };

        const atributosMap = new Map<string, string>();
        rows.forEach((r) => {
            if (r.atributo_nombre && r.valor_atributo)
                atributosMap.set(r.atributo_nombre, r.valor_atributo);
        });

        producto.atributos = Array.from(atributosMap, ([nombre, valor]) => ({ nombre, valor }));
        return producto;
    },

    async obtenerOCrearAtributo(nombre: string): Promise<number> {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT id FROM atributos WHERE nombre = ?",
            [nombre]
        );
        if (rows.length > 0) return rows[0].id;

        const [insert] = await pool.query<ResultSetHeader>(
            "INSERT INTO atributos (nombre) VALUES (?)",
            [nombre]
        );
        return insert.insertId;
    },

    async obtenerOCrearValor(idAtributo: number, valor: string): Promise<number> {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT id FROM valores_atributos WHERE id_atributo = ? AND valor = ?",
            [idAtributo, valor]
        );
        if (rows.length > 0) return rows[0].id;

        const [insert] = await pool.query<ResultSetHeader>(
            "INSERT INTO valores_atributos (id_atributo, valor) VALUES (?, ?)",
            [idAtributo, valor]
        );
        return insert.insertId;
    },

    async crearVariante(idProducto: number, valores: IValorAtributo[], stock: number) {
        for (const v of valores) {
            await pool.query<ResultSetHeader>(
                `
        INSERT INTO producto_variantes (id_producto, id_valor_atributo, stock)
        VALUES (?, ?, ?)
        `,
                [idProducto, v.id, stock]
            );
        }
    },

    async listarProductos(): Promise<IProductoCompleto[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `
      SELECT 
        p.id AS id_producto,
        p.nombre,
        p.descripcion,
        SUM(pv.stock) AS stock_total
      FROM productos p
      LEFT JOIN producto_variantes pv ON pv.id_producto = p.id
      GROUP BY p.id
      `
        );

        return rows.map((r) => ({
            id: r.id_producto,
            nombre: r.nombre,
            descripcion: r.descripcion,
            atributos: [],
            stock: r.stock_total || 0,
        }));
    },
};

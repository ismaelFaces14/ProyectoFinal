import { initPool } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ProductModel } from "./productoModel";
import { ICreateOrderDTO, IAddItemDTO, OrderStatus, IOrderSummary } from "../interfaces/tablas";

export class PedidoModel {

    static async crearPedido(data: ICreateOrderDTO): Promise<number> {
        const conn = await initPool.getConnection();
        try {
            const [result] = await conn.query<ResultSetHeader>(
                `INSERT INTO orders (client_name, notes, status) VALUES (?, ?, 'pendiente')`,
                [data.client_name, data.notes || null]
            );
            return result.insertId;
        } finally {
            conn.release();
        }
    }

    static async agregarItem(data: IAddItemDTO): Promise<void> {
        const conn = await initPool.getConnection();
        try {
            await conn.beginTransaction();

            const [orderCheck] = await conn.query<RowDataPacket[]>(
                `SELECT status FROM orders WHERE id = ? FOR UPDATE`,
                [data.order_id]
            );

            if (orderCheck.length === 0) throw new Error("Pedido no encontrado");
            if (orderCheck[0].status === 'terminado') throw new Error("No se pueden agregar items a un pedido terminado");

            const [prodCheck] = await conn.query<RowDataPacket[]>(
                `SELECT price FROM products WHERE id = ?`,
                [data.product_id]
            );

            if (prodCheck.length === 0) throw new Error("Producto no existe");
            const finalPrice = data.unit_price || prodCheck[0].price;

            const stockResult = await ProductModel.descontarStock(data.product_id, data.quantity, conn);
            if (stockResult !== "ok") {
                throw new Error(`Stock insuficiente o error: ${stockResult}`);
            }

            await conn.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
                [data.order_id, data.product_id, data.quantity, finalPrice]
            );

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    static async cambiarEstado(orderId: number, nuevoEstado: OrderStatus): Promise<void> {
        const conn = await initPool.getConnection();
        try {
            await conn.query(
                `UPDATE orders SET status = ? WHERE id = ?`,
                [nuevoEstado, orderId]
            );
        } finally {
            conn.release();
        }
    }

    static async obtenerTodos(): Promise<IOrderSummary[]> {
        const conn = await initPool.getConnection();
        try {
            const [rows] = await conn.query<IOrderSummary[]>(`
                SELECT 
                    o.id, o.client_name, o.status, o.created_at,
                    COUNT(oi.id) as total_items,
                    COALESCE(SUM(oi.quantity * oi.unit_price), 0) as total_price
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                GROUP BY o.id
                ORDER BY 
                    CASE o.status 
                        WHEN 'en_curso' THEN 1 
                        WHEN 'pendiente' THEN 2 
                        ELSE 3 
                    END,
                    o.created_at DESC
            `);
            return rows;
        } finally {
            conn.release();
        }
    }

    static async obtenerDetalle(orderId: number) {
        const conn = await initPool.getConnection();
        try {
            const [header] = await conn.query<RowDataPacket[]>(`SELECT * FROM orders WHERE id = ?`, [orderId]);
            if (header.length === 0) return null;

            const [items] = await conn.query<RowDataPacket[]>(`
                SELECT oi.id, p.name, p.sku, oi.quantity, oi.unit_price, (oi.quantity * oi.unit_price) as subtotal
                FROM order_items oi
                JOIN products p ON p.id = oi.product_id
                WHERE oi.order_id = ?
            `, [orderId]);

            return { ...header[0], items };
        } finally {
            conn.release();
        }
    }

}
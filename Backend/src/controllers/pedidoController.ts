import { Request, Response } from "express";
import { PedidoModel } from "../models/pedidoModel";
import { OrderStatus } from "../interfaces/tablas";

export class PedidoController {

    static async crear(req: Request, res: Response) {
        try {
            const { client_name, notes } = req.body;
            if (!client_name) return res.status(400).json({ error: "Nombre de cliente requerido" });

            const id = await PedidoModel.crearPedido({ client_name, notes });
            return res.status(201).json({ message: "Pedido creado", id });
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    static async agregarItem(req: Request, res: Response) {
        try {
            const order_id = Number(req.params.id);
            const { product_id, quantity } = req.body;

            if (!product_id || !quantity || quantity <= 0) {
                return res.status(400).json({ error: "Datos de producto inválidos" });
            }

            await PedidoModel.agregarItem({ order_id, product_id, quantity });
            return res.status(200).json({ message: "Item agregado y stock descontado" });

        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    static async cambiarEstado(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { status } = req.body;

            const estadosValidos: OrderStatus[] = ['pendiente', 'en_curso', 'terminado'];
            if (!estadosValidos.includes(status)) {
                return res.status(400).json({ error: "Estado inválido" });
            }

            await PedidoModel.cambiarEstado(id, status as OrderStatus);
            return res.json({ message: `Estado actualizado a ${status}` });
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    static async listar(_: Request, res: Response) {
        try {
            const pedidos = await PedidoModel.obtenerTodos();
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    static async obtenerUno(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const pedido = await PedidoModel.obtenerDetalle(id);
            if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
            return res.json(pedido);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }
}
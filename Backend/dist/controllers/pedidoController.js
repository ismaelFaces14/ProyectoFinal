"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoController = void 0;
const pedidoModel_1 = require("../models/pedidoModel");
class PedidoController {
    static async crear(req, res) {
        try {
            const { client_name, notes } = req.body;
            if (!client_name)
                return res.status(400).json({ error: "Nombre de cliente requerido" });
            const id = await pedidoModel_1.PedidoModel.crearPedido({ client_name, notes });
            return res.status(201).json({ message: "Pedido creado", id });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async agregarItem(req, res) {
        try {
            const order_id = Number(req.params.id);
            const { product_id, quantity } = req.body;
            if (!product_id || !quantity || quantity <= 0) {
                return res.status(400).json({ error: "Datos de producto inválidos" });
            }
            await pedidoModel_1.PedidoModel.agregarItem({ order_id, product_id, quantity });
            return res.status(200).json({ message: "Item agregado y stock descontado" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async cambiarEstado(req, res) {
        try {
            const id = Number(req.params.id);
            const { status } = req.body;
            const estadosValidos = ['pendiente', 'en_curso', 'terminado'];
            if (!estadosValidos.includes(status)) {
                return res.status(400).json({ error: "Estado inválido" });
            }
            await pedidoModel_1.PedidoModel.cambiarEstado(id, status);
            return res.json({ message: `Estado actualizado a ${status}` });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async listar(_, res) {
        try {
            const pedidos = await pedidoModel_1.PedidoModel.obtenerTodos();
            res.json(pedidos);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async obtenerUno(req, res) {
        try {
            const id = Number(req.params.id);
            const pedido = await pedidoModel_1.PedidoModel.obtenerDetalle(id);
            if (!pedido)
                return res.status(404).json({ error: "Pedido no encontrado" });
            return res.json(pedido);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.PedidoController = PedidoController;
//# sourceMappingURL=pedidoController.js.map
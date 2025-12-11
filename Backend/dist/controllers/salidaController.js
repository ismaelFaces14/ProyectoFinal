"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalidaController = void 0;
const salidaModel_1 = require("../models/salidaModel");
class SalidaController {
    static async registrarSalida(req, res) {
        const { productos, notes } = req.body;
        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: "Debe incluir al menos un producto" });
        }
        try {
            const outputId = await salidaModel_1.SalidaModel.registrarSalida(productos, notes);
            return res.status(201).json({ message: "Salida registrada", outputId });
        }
        catch (err) {
            return res.status(500).json({ error: "Error al registrar salida", detalles: err.message });
        }
    }
    static async listarSalidas(_, res) {
        try {
            const salidas = await salidaModel_1.SalidaModel.obtenerTodas();
            return res.json(salidas);
        }
        catch (err) {
            console.error('Error en listarSalidas:', err);
            return res.status(500).json({
                error: 'Error al obtener salidas',
                detalles: err.message
            });
        }
    }
    static async obtenerDetalleSalida(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id))
                throw new Error('ID inválido');
            const detalle = await salidaModel_1.SalidaModel.obtenerDetalle(id);
            res.json(detalle);
        }
        catch (err) {
            console.error('Error al obtener detalle de salida:', err);
            res.status(500).json({ error: 'Error al obtener detalle', detalles: err.message });
        }
    }
}
exports.SalidaController = SalidaController;
//# sourceMappingURL=salidaController.js.map
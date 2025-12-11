import { Request, Response } from "express";
import { SalidaModel } from "../models/salidaModel";

export class SalidaController {

    static async registrarSalida(req: Request, res: Response) {
        const { productos, notes } = req.body;

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: "Debe incluir al menos un producto" });
        }

        try {
            const outputId = await SalidaModel.registrarSalida(productos, notes);
            return res.status(201).json({ message: "Salida registrada", outputId });
        } catch (err) {
            return res.status(500).json({ error: "Error al registrar salida", detalles: (err as Error).message });
        }
    }

    static async listarSalidas(_: Request, res: Response) {
        try {
            const salidas = await SalidaModel.obtenerTodas();
            return res.json(salidas);
        } catch (err) {
            console.error('Error en listarSalidas:', err);
            return res.status(500).json({
                error: 'Error al obtener salidas',
                detalles: (err as Error).message
            });
        }
    }

    static async obtenerDetalleSalida(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw new Error('ID inválido');

            const detalle = await SalidaModel.obtenerDetalle(id);
            res.json(detalle);
        } catch (err) {
            console.error('Error al obtener detalle de salida:', err);
            res.status(500).json({ error: 'Error al obtener detalle', detalles: (err as Error).message });
        }
    }
}
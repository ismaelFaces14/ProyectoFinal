import { Request, Response } from "express";
import { productoModel } from "../models/productoModel.js";
import { IProductoCompleto } from "../interfaces/tablas.js";

export const productoController = {
    async crearProducto(req: Request, res: Response) {
        try {
            const { nombre, descripcion, atributos, stock }: IProductoCompleto = req.body;

            if (!nombre || !atributos?.length)
                return res.status(400).json({ error: "Nombre y atributos son obligatorios" });

            const idProducto = await productoModel.crearProductoBase(nombre, descripcion);

            const valoresParaVariante = [];
            for (const atributo of atributos) {
                const idAtributo = await productoModel.obtenerOCrearAtributo(atributo.nombre);
                const idValor = await productoModel.obtenerOCrearValor(idAtributo, atributo.valor);
                valoresParaVariante.push({ id: idValor, id_atributo: idAtributo, valor: atributo.valor });
            }
            await productoModel.crearVariante(idProducto, valoresParaVariante, stock || 0);

            res.status(201).json({
                mensaje: "Producto creado correctamente",
                id: idProducto,
            });
            return;
        } catch (error) {
            console.error("❌ Error al crear producto:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    async obtenerProducto(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const producto = await productoModel.obtenerProductoCompleto(Number(id));
            if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
            res.json(producto);
            return;
        } catch (error) {
            console.error("❌ Error al obtener producto:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    async listarProductos(_: Request, res: Response) {
        try {
            const productos = await productoModel.listarProductos();
            res.json(productos);
        } catch (error) {
            console.error("❌ Error al listar productos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
};
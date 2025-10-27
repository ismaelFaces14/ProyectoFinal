import { Request, Response } from "express";
import { ProductModel } from "../models/productoModel";

export class ProductController {
    static async crear(req: Request, res: Response) {
        try {
            const { product, attributes } = req.body;

            if (!product || !attributes || !Array.isArray(attributes)) {
                return res.status(400).json({ error: "Datos incompletos" });
            }

            const productId = await ProductModel.crearProductoAtributos(product, attributes);
            return res.status(201).json({ message: "Producto creado", productId });
        } catch (err) {
            return res.status(500).json({ error: "Error al crear producto", detalles: (err as Error).message });
        }
    }

    static async obtenerTodos(_: Request, res: Response) {
        try {
            const products = await ProductModel.encontrarTodos();
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: "Error al obtener productos", detalles: (err as Error).message });
        }
    }

    static async obtenerPorNombre(req: Request, res: Response) {
        try {
            const name = req.params.name;
            const products = await ProductModel.encontrarPorNombre(name);
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: "Error al buscar producto", detalles: (err as Error).message });
        }
    }

    static async actualizar(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const updates = req.body;

            const success = await ProductModel.actualizar(id, updates);
            if (success) {
                return res.json({ mensaje: "Producto actualizado" });
            } else {
                return res.status(404).json({ error: "Producto no encontrado o sin cambios" });
            }
        } catch (err) {
            return res.status(500).json({ error: "Error al actualizar producto", detalles: (err as Error).message });
        }
    }

    static async obtenerAtributos(req: Request, res: Response) {
        try {
            const productId = Number(req.params.id);
            const attributes = await ProductModel.encontrarAtributos(productId);

            if (attributes.length === 0) {
                return res.status(404).json({ error: "No se encontraron atributos para este producto" });
            }

            return res.json(attributes);
        } catch (err) {
            return res.status(500).json({ error: "Error al obtener atributos", detalles: (err as Error).message });
        }
    }

    static async descontarStock(req: Request, res: Response) {
        try {
            const productId = Number(req.params.id);
            const { cantidad } = req.body;

            if (!cantidad || typeof cantidad !== "number" || cantidad <= 0) {
                return res.status(400).json({ error: "Cantidad inválida" });
            }

            const resultado = await ProductModel.descontarStock(productId, cantidad);

            switch (resultado) {
                case "ok":
                    return res.json({ mensaje: "Stock descontado correctamente" });
                case "sin_stock":
                    return res.status(409).json({ error: "Stock insuficiente" });
                case "producto no encontrado":
                    return res.status(404).json({ error: "Producto no encontrado" });
            }
        } catch (err) {
            return res.status(500).json({ error: "Error al descontar stock", detalles: (err as Error).message });
        }
    }

    static async eliminarProducto(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const success = await ProductModel.eliminarProducto(id);

            if (success) {
                return res.json({ mensaje: "Producto eliminado correctamente" });
            } else {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
        } catch (err) {
            return res.status(500).json({ error: "Error al eliminar producto", detalles: (err as Error).message })
        }
    }

    static async actualizarAtributo(req: Request, res: Response) {
        const productId = Number(req.params.id);
        const attributes = req.body.attributes;

        if (!productId || !Array.isArray(attributes)) {
            return res.status(400).json({ error: "Datos invalidos" });
        }

        try {
            await ProductModel.actualizarProductoAtributos(productId, attributes);
            return res.json({ mensaje: "Atributos actualizados correctamente" });
        } catch (err) {
            return res.status(500).json({ error: "Error interno al actuzalizar atributos", detalles: (err as Error).message })
        }
    }
}
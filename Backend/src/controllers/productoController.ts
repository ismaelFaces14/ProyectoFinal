import { Request, Response } from "express";
import { ProductModel } from "../models/productoModel";

export class ProductController {
    static async create(req: Request, res: Response) {
        try {
            const { product, attributes } = req.body;

            if (!product || !attributes || !Array.isArray(attributes)) {
                return res.status(400).json({ error: "Datos incompletos" });
            }

            const productId = await ProductModel.createProductWithAttributes(product, attributes);
            return res.status(201).json({ message: "Producto creado", productId });
        } catch (err) {
            return res.status(500).json({ error: "Error al crear producto", details: (err as Error).message });
        }
    }

    static async getAll(_: Request, res: Response) {
        try {
            const products = await ProductModel.findAll();
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: "Error al obtener productos", details: (err as Error).message });
        }
    }

    static async getByName(req: Request, res: Response) {
        try {
            const name = req.params.name;
            const products = await ProductModel.findByName(name);
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: "Error al buscar producto", details: (err as Error).message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const updates = req.body;

            const success = await ProductModel.update(id, updates);
            if (success) {
                return res.json({ message: "Producto actualizado" });
            } else {
                return res.status(404).json({ error: "Producto no encontrado o sin cambios" });
            }
        } catch (err) {
            return res.status(500).json({ error: "Error al actualizar producto", details: (err as Error).message });
        }
    }
}
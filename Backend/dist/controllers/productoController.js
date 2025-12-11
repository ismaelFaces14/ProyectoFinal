"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const productoModel_1 = require("../models/productoModel");
class ProductController {
    static async crear(req, res) {
        try {
            const { product, attributes } = req.body;
            if (!product || !attributes || !Array.isArray(attributes)) {
                return res.status(400).json({ error: "Datos incompletos" });
            }
            const productId = await productoModel_1.ProductModel.crearProductoAtributos(product, attributes);
            return res.status(201).json({ message: "Producto creado", productId });
        }
        catch (err) {
            return res.status(500).json({ error: "Error al crear producto", detalles: err.message });
        }
    }
    static async obtenerTodos(_, res) {
        try {
            const products = await productoModel_1.ProductModel.encontrarTodos();
            return res.json(products);
        }
        catch (err) {
            return res.status(500).json({ error: "Error al obtener productos", detalles: err.message });
        }
    }
    static async obtenerPorId(req, res) {
        try {
            const productId = Number(req.params.id);
            const products = await productoModel_1.ProductModel.encontrarPorId(productId);
            return res.json(products);
        }
        catch (err) {
            return res.status(500).json({ error: "Error al buscar producto", detalles: err.message });
        }
    }
    static async obtenerPorNombre(req, res) {
        try {
            const name = decodeURIComponent(req.params.name);
            const products = await productoModel_1.ProductModel.encontrarPorNombre(name);
            return res.json(products);
        }
        catch (err) {
            return res.status(500).json({ error: "Error al buscar producto", detalles: err.message });
        }
    }
    static async actualizar(req, res) {
        try {
            const id = Number(req.params.id);
            const updates = req.body;
            const success = await productoModel_1.ProductModel.actualizar(id, updates);
            if (success) {
                return res.json({ mensaje: "Producto actualizado" });
            }
            else {
                return res.status(404).json({ error: "Producto no encontrado o sin cambios" });
            }
        }
        catch (err) {
            return res.status(500).json({ error: "Error al actualizar producto", detalles: err.message });
        }
    }
    static async obtenerAtributos(req, res) {
        try {
            const productId = Number(req.params.id);
            const attributes = await productoModel_1.ProductModel.encontrarAtributos(productId);
            if (attributes.length === 0) {
                return res.status(404).json({ error: "No se encontraron atributos para este producto" });
            }
            return res.json(attributes);
        }
        catch (err) {
            return res.status(500).json({ error: "Error al obtener atributos", detalles: err.message });
        }
    }
    static async eliminarProducto(req, res) {
        try {
            const id = Number(req.params.id);
            const success = await productoModel_1.ProductModel.eliminarProducto(id);
            if (success) {
                return res.json({ mensaje: "Producto eliminado correctamente" });
            }
            else {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
        }
        catch (err) {
            return res.status(500).json({ error: "Error al eliminar producto", detalles: err.message });
        }
    }
    static async actualizarAtributo(req, res) {
        const productId = Number(req.params.id);
        const attributes = req.body.attributes;
        if (!productId || !Array.isArray(attributes)) {
            return res.status(400).json({ error: "Datos invalidos" });
        }
        try {
            await productoModel_1.ProductModel.actualizarProductoAtributos(productId, attributes);
            return res.json({ mensaje: "Atributos actualizados correctamente" });
        }
        catch (err) {
            return res.status(500).json({ error: "Error interno al actuzalizar atributos", detalles: err.message });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=productoController.js.map
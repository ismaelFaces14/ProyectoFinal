import { Router } from "express";
import { ProductController } from "../controllers/productoController";

const router = Router();

router.post("/", ProductController.crear);
router.get("/", ProductController.obtenerTodos);
router.get("/buscar/:name", ProductController.obtenerPorNombre);
router.get("/:id/atributos", ProductController.obtenerAtributos);
router.put("/:id", ProductController.actualizar);
router.put("/:id/salida", ProductController.descontarStock)
router.delete("/:id", ProductController.eliminarProducto);

export default router; 
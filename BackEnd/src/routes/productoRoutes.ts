import { Router } from "express";
import { productoController } from "../controllers/productoController";

const router = Router();

router.post("/", productoController.crearProducto);
router.get("/", productoController.listarProductos);
router.get("/:id", productoController.obtenerProducto);

export default router;
import { Router } from "express";
import { ProductController } from "../controllers/productoController";
import { autenticar } from "../middlewares/authMiddleware";

const router = Router();


router.post("/", autenticar, ProductController.crear);
router.get("/", autenticar, ProductController.obtenerTodos);
router.get("/buscar/:name", autenticar, ProductController.obtenerPorNombre);
router.get("/:id/atributos", autenticar, ProductController.obtenerAtributos);
router.put("/:id", autenticar, ProductController.actualizar);
router.put("/:id/salida", autenticar, ProductController.descontarStock)
router.delete("/:id", autenticar, ProductController.eliminarProducto);

export default router; 
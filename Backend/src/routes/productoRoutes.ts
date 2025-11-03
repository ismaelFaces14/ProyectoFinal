import { Router } from "express";
import { ProductController } from "../controllers/productoController";
//import { autenticar } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", ProductController.crear);
router.post("/salidas", ProductController.registrarSalida);

router.get('/salidas', ProductController.listarSalidas);
router.get("/", ProductController.obtenerTodos);
router.get("/:id", ProductController.obtenerPorId);
router.get("/buscar/:name", ProductController.obtenerPorNombre);
router.get("/:id/atributos", ProductController.obtenerAtributos);

router.delete("/:id", ProductController.eliminarProducto);

router.put("/:id", ProductController.actualizar);
router.put("/:id/atributos", ProductController.actualizarAtributo);

export default router; 
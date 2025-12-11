import { Router } from "express";
import { SalidaController } from "../controllers/salidaController";

const router = Router();

router.post("/", SalidaController.registrarSalida);

router.get('/:id/detalle', SalidaController.obtenerDetalleSalida);
router.get('/', SalidaController.listarSalidas);

export default router;
import { Router } from "express";
import { PedidoController } from "../controllers/pedidoController";

const router = Router();

router.post("/", PedidoController.crear);
router.post("/:id/items", PedidoController.agregarItem);

router.get("/", PedidoController.listar);
router.get("/:id", PedidoController.obtenerUno);

router.put("/:id/status", PedidoController.cambiarEstado);

export default router;
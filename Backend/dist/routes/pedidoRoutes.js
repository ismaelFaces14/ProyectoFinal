"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedidoController_1 = require("../controllers/pedidoController");
const router = (0, express_1.Router)();
router.post("/", pedidoController_1.PedidoController.crear);
router.post("/:id/items", pedidoController_1.PedidoController.agregarItem);
router.get("/", pedidoController_1.PedidoController.listar);
router.get("/:id", pedidoController_1.PedidoController.obtenerUno);
router.put("/:id/status", pedidoController_1.PedidoController.cambiarEstado);
exports.default = router;
//# sourceMappingURL=pedidoRoutes.js.map
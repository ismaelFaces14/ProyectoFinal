"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salidaController_1 = require("../controllers/salidaController");
const router = (0, express_1.Router)();
router.post("/", salidaController_1.SalidaController.registrarSalida);
router.get('/:id/detalle', salidaController_1.SalidaController.obtenerDetalleSalida);
router.get('/', salidaController_1.SalidaController.listarSalidas);
exports.default = router;
//# sourceMappingURL=salidaRoutes.js.map
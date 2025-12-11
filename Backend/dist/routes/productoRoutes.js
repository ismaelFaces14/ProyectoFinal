"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoController_1 = require("../controllers/productoController");
const router = (0, express_1.Router)();
router.post("/", productoController_1.ProductController.crear);
router.get("/", productoController_1.ProductController.obtenerTodos);
router.get("/:id", productoController_1.ProductController.obtenerPorId);
router.get("/buscar/:name", productoController_1.ProductController.obtenerPorNombre);
router.get("/:id/atributos", productoController_1.ProductController.obtenerAtributos);
router.delete("/:id", productoController_1.ProductController.eliminarProducto);
router.put("/:id", productoController_1.ProductController.actualizar);
router.put("/:id/atributos", productoController_1.ProductController.actualizarAtributo);
exports.default = router;
//# sourceMappingURL=productoRoutes.js.map
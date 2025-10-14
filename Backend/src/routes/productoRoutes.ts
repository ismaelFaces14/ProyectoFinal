import { Router } from "express";
import { ProductController } from "../controllers/productoController";

const router = Router();

router.post("/", ProductController.create);
router.get("/", ProductController.getAll);
router.get("/buscar/:name", ProductController.getByName);
router.put("/:id", ProductController.update);

export default router;
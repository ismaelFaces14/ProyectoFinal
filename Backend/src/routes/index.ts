import express from "express";
import productRoutes from "./productoRoutes";
import salidaRoutes from "./salidaRoutes";
import authRoutes from "./authRoutes";
import pedidoRoutes from "./pedidoRoutes";
import { autenticar } from "../middlewares/authMiddleware";
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use("/api/auth", authRoutes);

app.use("/api/productos", autenticar, productRoutes);
app.use("/api/salidas", autenticar, salidaRoutes);
app.use("/api/orders", autenticar, pedidoRoutes);

export default app;
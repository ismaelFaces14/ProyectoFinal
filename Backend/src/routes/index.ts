import express from "express";
import productRoutes from "./productoRoutes";
import authRoutes from "./authRoutes";
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use("/productos", productRoutes);
app.use("/auth", authRoutes);

export default app;
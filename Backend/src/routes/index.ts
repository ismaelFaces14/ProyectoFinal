import express from "express";
import productRoutes from "./productoRoutes";
import authRoutes from "./authRoutes";

const app = express();
app.use(express.json());

app.use("/productos", productRoutes);
app.use("/auth", authRoutes);

export default app;
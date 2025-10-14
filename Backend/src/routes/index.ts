import express from "express";
import productRoutes from "./productoRoutes";

const app = express();
app.use(express.json());

app.use("/productos", productRoutes);

export default app;
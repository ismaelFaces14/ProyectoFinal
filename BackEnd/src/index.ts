import express from "express";
import productoRoutes from "./routes/productoRoutes";
import { initDB } from "./database/init"

const app = express();
app.use(express.json());

app.use("/productos", productoRoutes);

const PORT = 3000;

initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error("Error iniciando la base de datos", err));
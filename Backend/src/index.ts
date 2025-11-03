import app from "./routes/index";
import { initDB } from "./config/init";
import dotenvSafe from "dotenv-safe";
import cors from 'cors';
dotenvSafe.config();
app.use(cors());

(async () => {
    await initDB();
    app.listen(3000, () => {
        console.log("Servidor corriendo en http://localhost:3000");
    });
})();
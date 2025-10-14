import app from "./routes/index";
import { initDB } from "./config/init";

(async () => {
    await initDB();
    app.listen(3000, () => {
        console.log("Servidor corriendo en http://localhost:3000");
    });
})();
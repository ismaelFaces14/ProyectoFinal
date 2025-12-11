"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./routes/index"));
const init_1 = require("./config/init");
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
dotenv_safe_1.default.config();
(async () => {
    await (0, init_1.initDB)();
    index_1.default.listen(3000, () => {
        console.log("Servidor corriendo en http://localhost:3000");
    });
})();
//# sourceMappingURL=index.js.map
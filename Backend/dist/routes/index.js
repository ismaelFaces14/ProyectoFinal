"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productoRoutes_1 = __importDefault(require("./productoRoutes"));
const salidaRoutes_1 = __importDefault(require("./salidaRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const pedidoRoutes_1 = __importDefault(require("./pedidoRoutes"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/productos", authMiddleware_1.autenticar, productoRoutes_1.default);
app.use("/api/salidas", authMiddleware_1.autenticar, salidaRoutes_1.default);
app.use("/api/orders", authMiddleware_1.autenticar, pedidoRoutes_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map
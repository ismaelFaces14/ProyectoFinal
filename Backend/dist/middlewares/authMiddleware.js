"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticar = autenticar;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
function autenticar(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ error: "Token no proporcionado" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, auth_1.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ error: "Token inválido o expirado" });
        return;
    }
}
//# sourceMappingURL=authMiddleware.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../config/auth");
class AuthController {
    static async login(req, res) {
        const { username, password } = req.body;
        if (username !== auth_1.ADMIN_CREDENTIALS.username) {
            return res.status(401).json({ error: "Usuario inválido" });
        }
        const valid = await bcrypt_1.default.compare(password, auth_1.ADMIN_CREDENTIALS.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }
        const token = jsonwebtoken_1.default.sign({ username }, auth_1.JWT_SECRET, { expiresIn: "4h" });
        return res.json({ token });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map
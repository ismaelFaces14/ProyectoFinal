import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ADMIN_CREDENTIALS, JWT_SECRET } from "../config/auth";

export class AuthController {
    static async login(req: Request, res: Response) {
        const { username, password } = req.body;

        if (username !== ADMIN_CREDENTIALS.username) {
            return res.status(401).json({ error: "Usuario inválido" });

        }
        const valid = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });

        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "2h" });
        return res.json({ token });
    }
}
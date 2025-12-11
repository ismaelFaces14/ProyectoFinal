import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth";

export interface RequestWithAdmin extends Request {
    user?: string
}

export function autenticar(req: RequestWithAdmin, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ error: "Token no proporcionado" });
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as string;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: "Token inválido o expirado" });
        return
    }
}
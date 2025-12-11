import { Request, Response, NextFunction } from "express";
export interface RequestWithAdmin extends Request {
    user?: string;
}
export declare function autenticar(req: RequestWithAdmin, res: Response, next: NextFunction): void;

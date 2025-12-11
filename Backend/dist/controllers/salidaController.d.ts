import { Request, Response } from "express";
export declare class SalidaController {
    static registrarSalida(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static listarSalidas(_: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static obtenerDetalleSalida(req: Request, res: Response): Promise<void>;
}

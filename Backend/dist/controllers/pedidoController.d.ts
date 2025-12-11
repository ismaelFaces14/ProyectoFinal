import { Request, Response } from "express";
export declare class PedidoController {
    static crear(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static agregarItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static cambiarEstado(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static listar(_: Request, res: Response): Promise<void>;
    static obtenerUno(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}

import { Request, Response } from "express";
export declare class ProductController {
    static crear(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static obtenerTodos(_: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static obtenerPorId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static obtenerPorNombre(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static actualizar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static obtenerAtributos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static eliminarProducto(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static actualizarAtributo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}

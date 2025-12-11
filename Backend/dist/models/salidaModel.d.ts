import { ISalidaResumen, IProductoSalidaDetalle } from "../interfaces/tablas";
export declare class SalidaModel {
    static registrarSalida(productos: {
        product_id: number;
        quantity: number;
        unit_price: number;
    }[], notes?: string): Promise<number>;
    static obtenerTodas(): Promise<ISalidaResumen[]>;
    static obtenerDetalle(id: number): Promise<IProductoSalidaDetalle[]>;
}

import { IProducto, AttributeDataType, IAtributo } from "../interfaces/tablas";
import { PoolConnection } from "mysql2/promise";
export declare class ProductModel {
    static crearProductoAtributos(product: Omit<IProducto, "id" | "created_at">, attributes: {
        name: string;
        data_type: AttributeDataType;
        value: string | number | boolean | Date;
    }[]): Promise<number>;
    static encontrarTodos(): Promise<IProducto[]>;
    static encontrarPorId(productId: number): Promise<IProducto | null>;
    static encontrarPorNombre(name: string): Promise<IProducto[]>;
    static actualizar(id: number, updates: Partial<Omit<IProducto, "id" | "created_at">>): Promise<boolean>;
    static encontrarAtributos(productoId: number): Promise<{
        attribute: IAtributo;
        value: string | number | boolean | Date | null;
    }[]>;
    static descontarStock(productId: number, cantidad: number, connection?: PoolConnection): Promise<"ok" | "sin_stock" | "producto no encontrado">;
    static eliminarProducto(productId: number): Promise<boolean>;
    static actualizarProductoAtributos(productId: number, attributes: {
        name: string;
        data_type: AttributeDataType;
        value: string | number | boolean | Date;
    }[]): Promise<void>;
}

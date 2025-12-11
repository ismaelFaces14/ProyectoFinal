import { RowDataPacket } from "mysql2/promise";
import { ICreateOrderDTO, IAddItemDTO, OrderStatus, IOrderSummary } from "../interfaces/tablas";
export declare class PedidoModel {
    static crearPedido(data: ICreateOrderDTO): Promise<number>;
    static agregarItem(data: IAddItemDTO): Promise<void>;
    static cambiarEstado(orderId: number, nuevoEstado: OrderStatus): Promise<void>;
    static obtenerTodos(): Promise<IOrderSummary[]>;
    static obtenerDetalle(orderId: number): Promise<{
        items: RowDataPacket[];
        constructor: {
            name: "RowDataPacket";
        };
    } | null>;
}

import { RowDataPacket } from "mysql2";

export interface IProducto {
    id: number;
    name: string;
    sku: string;
    stock: number;
    price: number;
    created_at: Date;
}

export type AttributeDataType = 'string' | 'number' | 'boolean' | 'date';

export interface IAtributo {
    id: number;
    name: string;
    data_type: AttributeDataType;
}

export interface ProductAttribute {
    id: number;
    product_id: number;
    attribute_id: number;
    value_string?: string;
    value_number?: number;
    value_boolean?: boolean;
    value_date?: Date;
}

export interface ISalidaResumen {
    id: number;
    output_date: string;
    notes: string | null;
    cantidad_items: number;
    total: number;
}

export interface IProductoSalidaDetalle {
    name: string;
    quantity: number;
    unit_price: number;
}

export type OrderStatus = 'pendiente' | 'en_curso' | 'terminado';

export interface ICreateOrderDTO {
    client_name: string;
    notes?: string;
}

export interface IAddItemDTO {
    order_id: number;
    product_id: number;
    quantity: number;
    unit_price?: number;
}

export interface IOrderSummary extends RowDataPacket {
    id: number;
    client_name: string;
    status: OrderStatus;
    created_at: Date;
    total_items: number;
    total_price: number;
}
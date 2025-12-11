export type OrderStatus = 'pendiente' | 'en_curso' | 'terminado';

export interface IOrderItem {
    id: number;
    product_id: number;
    name: string;
    sku: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface IPedidoDetalle {
    id: number;
    client_name: string;
    status: OrderStatus;
    notes?: string;
    created_at: string;
    items: IOrderItem[];
}

export interface IPedidoResumen {
    id: number;
    client_name: string;
    status: OrderStatus;
    total_items: number;
    total_price: number;
    created_at: string;
}
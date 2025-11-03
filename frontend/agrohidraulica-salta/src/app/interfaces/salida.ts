export interface IProductoSalida {
    product_id: number;
    name: string;
    sku: string;
    stock: number;
    quantity: number;
    unit_price: number;
}

export interface ISalidaResumen {
    id: number;
    output_date: string;
    notes: string | null;
    cantidad_items: number;
    total: number;
}
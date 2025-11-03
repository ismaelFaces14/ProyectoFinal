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
import { RowDataPacket } from "mysql2";

export interface IProductoCompleto {
    id?: number;
    nombre: string;
    descripcion?: string;
    atributos: IAtributoValor[];
    stock?: number;
}

export interface IAtributoValor {
    nombre: string;
    valor: string;
    esVariable?: boolean;
}

export interface IProductoVariante {
    id?: number;
    id_producto: number;
    sku?: string;
    stock: number;
    precio?: number;
    valores: IValorAtributo[];
}

export interface IAtributo {
    id?: number;
    nombre: string;
}

export interface IValorAtributo {
    id?: number;
    id_atributo: number;
    valor: string;
}

export interface IProductoBusqueda {
    id: number;
    nombre: string;
    descripcion?: string;
    atributos: IAtributoValor[];
    stock: number;
}

export interface ProductoJoinRow extends RowDataPacket {
    producto_id: number;
    producto_nombre: string;
    atributo_nombre: string;
    valor_atributo: string;
    stock: number | null;
}
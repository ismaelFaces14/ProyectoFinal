export type AttributeDataType = 'string' | 'number' | 'boolean' | 'date';

export interface IAtributo {
    id: number;
    name: string;
    data_type: AttributeDataType;
    value: string | number | boolean | Date;
}
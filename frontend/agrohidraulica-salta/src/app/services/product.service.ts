import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProducto } from '../interfaces/producto';
import { IAtributo } from '../interfaces/atributo';
import { IProductoSalida } from '../interfaces/salida';
import { ISalidaResumen } from '../interfaces/salida';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:3000/productos';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<IProducto[]> {
    return this.http.get<IProducto[]>(`${this.baseUrl}`);
  }

  obtenerPorNombre(nombre: string): Observable<IProducto[]> {
    return this.http.get<IProducto[]>(`${this.baseUrl}/buscar/${nombre}`);
  }

  obtenerPorId(id: number): Observable<IProducto> {
    return this.http.get<IProducto>(`${this.baseUrl}/${id}`);
  }

  crear(product: Omit<IProducto, 'id' | 'created_at'>, attributes: IAtributo[]): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}`, { product, attributes });
  }

  actualizar(id: number, updates: Partial<Omit<IProducto, "id" | "created_at">>): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/${id}`, updates);
  }

  eliminar(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  obtenerAtributos(id: number): Observable<{ attribute: IAtributo; value: string | number | boolean | Date | null }[]> {
    return this.http.get<{ attribute: IAtributo; value: string | number | boolean | Date | null }[]>(`${this.baseUrl}/${id}/atributos`);
  }

  actualizarAtributos(id: number, attributes: IAtributo[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/atributos`, { attributes });
  }

  registrarSalida(items: IProductoSalida[], notes: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/salidas`, { productos: items, notes });
  }

  obtenerSalidas(): Observable<ISalidaResumen[]> {
    return this.http.get<ISalidaResumen[]>(`${this.baseUrl}/salidas`);
  }

}
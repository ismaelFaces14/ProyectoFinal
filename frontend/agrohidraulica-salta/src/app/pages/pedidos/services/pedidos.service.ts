import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IPedidoResumen, IPedidoDetalle } from '../../../interfaces/pedido';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  crearPedido(client_name: string, notes?: string): Observable<{ message: string, id: number }> {
    return this.http.post<{ message: string, id: number }>(this.baseUrl, { client_name, notes });
  }
  listarPedidos(): Observable<IPedidoResumen[]> {
    return this.http.get<IPedidoResumen[]>(this.baseUrl);
  }
  obtenerDetalle(id: number): Observable<IPedidoDetalle> {
    return this.http.get<IPedidoDetalle>(`${this.baseUrl}/${id}`);
  }
  agregarItem(orderId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${orderId}/items`, { product_id: productId, quantity });
  }
  cambiarEstado(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, { status });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductoSalida, ISalidaResumen, IProductoSalidaDetalle } from '../../../interfaces/salida';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalidasService {
  private readonly baseUrl = `${environment.apiUrl}/salidas`;

  constructor(private http: HttpClient) { }

  registrarSalida(items: IProductoSalida[], notes: string): Observable<any> {
    return this.http.post(`${this.baseUrl}`, { productos: items, notes });
  }

  obtenerSalidas(): Observable<ISalidaResumen[]> {
    return this.http.get<ISalidaResumen[]>(`${this.baseUrl}`);
  }

  obtenerDetalleSalida(id: number): Observable<IProductoSalidaDetalle[]> {
    return this.http.get<IProductoSalidaDetalle[]>(`${this.baseUrl}/${id}/detalle`);
  }
}

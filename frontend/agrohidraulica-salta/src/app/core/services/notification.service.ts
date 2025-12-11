import { Injectable } from '@angular/core';
import { NotificationComponent } from '../../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationComponent!: NotificationComponent;

  registrar(componente: NotificationComponent) {
    this.notificationComponent = componente;
  }

  mostrar(mensaje: string, tipo: 'exito' | 'error' = 'exito') {
    this.notificationComponent?.mostrar(mensaje, tipo);
  }
  constructor() { }
}

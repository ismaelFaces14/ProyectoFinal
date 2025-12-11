import { Injectable } from '@angular/core';
import { ConfirmNotificationComponent } from '../../components/confirm-notification/confirm-notification.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmNotificationService {
  private dialog!: ConfirmNotificationComponent;

  registrar(component: ConfirmNotificationComponent) {
    this.dialog = component;
  }

  pedirConfirmacion(mensaje: string): Promise<boolean> {
    return this.dialog.mostrar(mensaje);
  }
  constructor() { }
}

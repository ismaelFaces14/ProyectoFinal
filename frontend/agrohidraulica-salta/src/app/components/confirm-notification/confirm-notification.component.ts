import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-notification',
  templateUrl: './confirm-notification.component.html',
  styleUrl: './confirm-notification.component.scss'
})
export class ConfirmNotificationComponent {
  visible = false;
  mensaje = '';
  private resolver!: (resultado: boolean) => void;

  mostrar(mensaje: string): Promise<boolean> {
    this.mensaje = mensaje;
    this.visible = true;
    return new Promise(resolve => this.resolver = resolve);
  }

  confirmar() {
    this.visible = false;
    this.resolver(true);
  }

  cancelar() {
    this.visible = false;
    this.resolver(false);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  mensaje = '';
  tipo: 'exito' | 'error' = 'exito';
  visible = false;

  mostrar(mensaje: string, tipo: 'exito' | 'error' = 'exito') {
    this.mensaje = mensaje;
    this.tipo = tipo;
    this.visible = true;

    setTimeout(() => this.visible = false, 3000);
  }
}

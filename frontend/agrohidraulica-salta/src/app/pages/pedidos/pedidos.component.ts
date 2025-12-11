import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PedidosService } from './services/pedidos.service';
import { IPedidoResumen } from '../../interfaces/pedido';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {
  pedidos: IPedidoResumen[] = [];

  nuevoCliente: string = '';
  notasIniciales: string = '';
  creando: boolean = false;

  constructor(
    private pedidoService: PedidosService,
    private router: Router,
    private notiService: NotificationService
  ) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.pedidoService.listarPedidos().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        this.notiService.mostrar('Error al cargar la lista de pedidos', 'error');
      }
    });
  }

  async crearNuevoPedido() {
    if (!this.nuevoCliente.trim()) return;
    this.creando = true;

    try {
      const res = await firstValueFrom(
        this.pedidoService.crearPedido(this.nuevoCliente, this.notasIniciales)
      );

      this.notiService.mostrar('Pedido creado correctamente', 'exito');
      this.router.navigate(['/pedidos', res.id]);

    } catch (err) {
      console.error('Error al crear pedido:', err);
      this.notiService.mostrar('No se pudo crear el pedido', 'error');
    } finally {
      this.creando = false;
    }
  }

  async cambiarEstado(id: number, nuevoEstado: string) {
    try {
      await firstValueFrom(
        this.pedidoService.cambiarEstado(id, nuevoEstado)
      );

      this.notiService.mostrar('El pedido ahora está en curso', 'exito');
      this.cargar();

    } catch (err) {
      console.error('Error al cambiar estado:', err);
      this.notiService.mostrar('No se pudo actualizar el estado', 'error');
    }
  }

  irADetalle(id: number) {
    this.router.navigate(['/pedidos', id]);
  }
}

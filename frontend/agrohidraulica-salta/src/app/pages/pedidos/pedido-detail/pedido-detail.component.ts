import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { PedidosService } from '../services/pedidos.service';
import { ProductService } from '../../productos/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmNotificationService } from '../../../core/services/confirm-notification.service';

import { IPedidoDetalle } from '../../../interfaces/pedido';
import { IProducto } from '../../../interfaces/producto';

@Component({
  selector: 'app-pedido-detail',
  templateUrl: './pedido-detail.component.html',
  styleUrl: './pedido-detail.component.scss'
})
export class PedidoDetailComponent implements OnInit {
  orden: IPedidoDetalle | null = null;
  productosDisponibles: IProducto[] = [];

  productoSeleccionadoId: number | null = null;
  cantidadAgregar: number = 1;
  cargandoAccion: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidosService,
    private productoService: ProductService,
    private notiService: NotificationService,
    private confirmService: ConfirmNotificationService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarOrden(Number(id));
      this.cargarProductos();
    }
  }
  cargarOrden(id: number) {
    this.pedidoService.obtenerDetalle(id).subscribe({
      next: (data) => this.orden = data,
      error: (err) => {
        console.error(err);
        this.notiService.mostrar('Error cargando el pedido', 'error');
        this.router.navigate(['/pedidos']);
      }
    });
  }

  cargarProductos() {
    this.productoService.obtenerTodos().subscribe({
      next: (prods) => this.productosDisponibles = prods,
      error: (err) => console.error(err)
    });
  }

  async agregarItem() {
    if (!this.orden || !this.productoSeleccionadoId) return;

    this.cargandoAccion = true;
    try {
      await firstValueFrom(
        this.pedidoService.agregarItem(
          this.orden.id,
          this.productoSeleccionadoId,
          this.cantidadAgregar
        )
      );

      this.notiService.mostrar('Producto agregado', 'exito');

      this.productoSeleccionadoId = null;
      this.cantidadAgregar = 1;
      this.cargarOrden(this.orden.id);

    } catch (err: any) {
      console.error(err);
      const msg = err.error?.error || 'Error al agregar producto';
      this.notiService.mostrar(msg, 'error');
    } finally {
      this.cargandoAccion = false;
    }
  }

  async finalizarPedido() {
    if (!this.orden) return;

    const confirmado = await this.confirmService.pedirConfirmacion(
      '¿Estás seguro de finalizar este pedido? Ya no se podrán agregar más ítems.'
    );

    if (!confirmado) return;

    try {
      await firstValueFrom(
        this.pedidoService.cambiarEstado(this.orden.id, 'terminado')
      );

      this.notiService.mostrar('Pedido finalizado correctamente', 'exito');
      this.router.navigate(['/pedidos']);

    } catch (err) {
      console.error(err);
      this.notiService.mostrar('No se pudo finalizar el pedido', 'error');
    }
  }

  get totalPedido(): number {
    if (!this.orden || !this.orden.items) return 0;
    return this.orden.items.reduce((acc, item) => acc + Number(item.subtotal), 0);
  }

}

import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { IProducto } from '../../interfaces/producto';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmNotificationService } from '../../core/services/confirm-notification.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  productos: IProducto[] = [];
  filtro = '';

  constructor(
    private confirmService: ConfirmNotificationService,
    private productService: ProductService,
    private router: Router,
    private notiService: NotificationService
  ) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    const obs = this.filtro.trim()
      ? this.productService.obtenerPorNombre(this.filtro)
      : this.productService.obtenerTodos();

    obs.subscribe(p => this.productos = p);
  }

  irA(ruta: string, id: number) {
    this.router.navigate([`/productos/${ruta}`, id]);
  }

  async eliminarProducto(id: number): Promise<void> {
    const confirmado = await this.confirmService.pedirConfirmacion('¿Estás seguro de que querés eliminar este producto?');
    if (!confirmado) return;

    try {
      const res = await firstValueFrom(this.productService.eliminar(id));

      if (res) {
        this.notiService.mostrar('Producto eliminado correctamente', 'exito');
        this.cargar();
      } else {
        this.notiService.mostrar('No se pudo eliminar el producto', 'error');
      }
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      this.notiService.mostrar('Ocurrió un error al intentar eliminar el producto', 'error');
    }
  }


}

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../productos/services/product.service';
import { SalidasService } from '../services/salidas.service';
import { IProducto } from '../../../interfaces/producto';
import { IProductoSalida } from '../../../interfaces/salida';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-registrar-salida',
  templateUrl: './registrar-salida.component.html',
  styleUrl: './registrar-salida.component.scss'
})
export class RegistrarSalidaComponent implements OnInit {
  productos: IProducto[] = [];
  salidaItems: IProductoSalida[] = [];
  notas: string = '';

  constructor(
    private salidaService: SalidasService,
    private productService: ProductService,
    private notiService: NotificationService
  ) { }

  ngOnInit(): void {
    this.productService.obtenerTodos().subscribe(p => this.productos = p);
  }

  agregarProducto(p: IProducto): void {
    if (this.salidaItems.some(item => item.product_id === p.id)) return;

    this.salidaItems.push({
      product_id: p.id,
      name: p.name,
      sku: p.sku,
      quantity: 1,
      unit_price: p.price,
      stock: p.stock
    });
  }

  eliminarItem(index: number): void {
    this.salidaItems.splice(index, 1);
  }

  calcularTotal(item: IProductoSalida): number {
    return item.quantity * item.unit_price;
  }

  get totalSalida(): number {
    return this.salidaItems.reduce((acc, item) => acc + this.calcularTotal(item), 0);
  }

  get hayValoresInvalidos(): boolean {
    return this.salidaItems.some(item =>
      item.quantity <= 0 || item.unit_price <= 0 || item.quantity > item.stock
    );
  }

  registrarSalida(): void {

    this.salidaService.registrarSalida(this.salidaItems, this.notas).subscribe(() => {
      this.notiService.mostrar('Salida registrada correctamente', 'exito');
      this.salidaItems = [];
      this.notas = '';
    });
  }
}

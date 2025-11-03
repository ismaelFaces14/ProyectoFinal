import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProducto } from '../../../interfaces/producto';
import { IProductoSalida } from '../../../interfaces/salida';

@Component({
  selector: 'app-producto-salida',
  templateUrl: './producto-salida.component.html',
  styleUrl: './producto-salida.component.scss'
})
export class ProductoSalidaComponent implements OnInit {
  productos: IProducto[] = [];
  salidaItems: IProductoSalida[] = [];
  notas: string = '';

  constructor(private productService: ProductService) { }

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

  get hayExcesoDeStock(): boolean {
    return this.salidaItems.some(item => item.quantity > item.stock);
  }

  get hayValoresInvalidos(): boolean {
    return this.salidaItems.some(item =>
      item.quantity <= 0 || item.unit_price <= 0 || item.quantity > item.stock
    );
  }

  registrarSalida(): void {
    if (this.salidaItems.length === 0) {
      alert('Agregá al menos un producto');
      return;
    }

    if (this.hayValoresInvalidos) {
      alert('Hay productos con valores inválidos: cantidad negativa, precio cero o exceso de stock');
      return;
    }

    this.productService.registrarSalida(this.salidaItems, this.notas).subscribe(() => {
      alert('Salida registrada correctamente');
      this.salidaItems = [];
      this.notas = '';
    });
  }
}
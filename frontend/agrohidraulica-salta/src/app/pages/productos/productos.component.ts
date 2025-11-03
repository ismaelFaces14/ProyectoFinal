import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { IProducto } from '../../interfaces/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  productos: IProducto[] = [];
  filtro = '';

  constructor(private productService: ProductService, private router: Router) { }

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

  eliminarProducto(id: number) {
    if (!confirm('¿Estás seguro de que querés eliminar este producto?')) return;

    this.productService.eliminar(id).subscribe({
      next: (res) => {
        if (res) {
          alert('Producto eliminado');
          this.cargar();
        } else {
          alert('No se pudo eliminar el producto');
        }
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
        alert('Ocurrió un error al intentar eliminar el producto');
      }
    });
  }


}

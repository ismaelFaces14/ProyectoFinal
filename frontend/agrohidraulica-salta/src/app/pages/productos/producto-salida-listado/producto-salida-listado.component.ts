import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ISalidaResumen } from '../../../interfaces/salida';

@Component({
  selector: 'app-producto-salida-listado',
  templateUrl: './producto-salida-listado.component.html',
  styleUrl: './producto-salida-listado.component.scss'
})
export class ProductoSalidaListadoComponent implements OnInit {
  salidas: ISalidaResumen[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.obtenerSalidas().subscribe(s => this.salidas = s);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProducto } from '../../../interfaces/producto';

@Component({
  selector: 'app-producto-editar',
  templateUrl: './producto-editar.component.html',
  styleUrl: './producto-editar.component.scss'
})
export class ProductoEditarComponent implements OnInit {
  form: FormGroup;
  producto: IProducto | null = null;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9\-]+$/)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {

      this.productService.obtenerPorId(this.id).subscribe(producto => {
        this.producto = producto;
        this.form.patchValue({
          name: producto.name,
          sku: producto.sku,
          stock: producto.stock,
          price: producto.price,
        });
      });
    }
  }

  guardar() {
    if (this.form.invalid || !this.producto) return;

    this.productService.actualizar(this.id, this.form.value).subscribe(() => {
      alert('Producto actualizado');
      this.router.navigate(['/productos']);
    });
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss'
})
export class ProductoFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9\-]+$/)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      attributes: this.fb.array([])
    });
  }

  get attributes(): FormArray {
    return this.form.get('attributes') as FormArray;
  }

  agregarAtributo() {
    this.attributes.push(this.fb.group({
      name: ['', Validators.required],
      data_type: ['string', Validators.required],
      value: [''],
    }));
  }

  eliminarAtributo(index: number) {
    this.attributes.removeAt(index);
  }

  guardar() {
    const { name, sku, stock, price, attributes } = this.form.value;
    this.productService.crear({ name, sku, stock, price }, attributes).subscribe(() => {
      alert('Producto creado');
      this.router.navigate(['/productos']);
    });

    const atributosInvalidos = this.attributes.controls.some(attr => attr.invalid);
    if (atributosInvalidos) {
      alert('Todos los atributos deben tener nombre');
      return;
    }
  }
}

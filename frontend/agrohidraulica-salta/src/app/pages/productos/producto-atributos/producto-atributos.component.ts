import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-producto-atributos',
  templateUrl: './producto-atributos.component.html',
  styleUrl: './producto-atributos.component.scss'
})
export class ProductoAtributosComponent implements OnInit {
  form: FormGroup;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.form = this.fb.group({
      attributes: this.fb.array([]),
    });
  }

  get attributes(): FormArray {
    return this.form.get('attributes') as FormArray;
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.obtenerAtributos(this.id).subscribe(attrs => {
      attrs.forEach(({ attribute, value }) => {
        this.attributes.push(this.fb.group({
          name: [attribute.name, Validators.required],
          data_type: [attribute.data_type],
          value: [value, Validators.required],
        }));
      });
    });
  }

  guardar() {
    const atributos = this.form.value.attributes;
    this.productService.actualizarAtributos(this.id, atributos).subscribe(() => {
      alert('Atributos actualizados');
      this.router.navigate(['/productos']);
    });
  }
}

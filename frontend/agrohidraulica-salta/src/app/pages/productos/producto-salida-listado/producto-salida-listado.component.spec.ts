import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoSalidaListadoComponent } from './producto-salida-listado.component';

describe('ProductoSalidaListadoComponent', () => {
  let component: ProductoSalidaListadoComponent;
  let fixture: ComponentFixture<ProductoSalidaListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductoSalidaListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoSalidaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoAtributosComponent } from './producto-atributos.component';

describe('ProductoAtributosComponent', () => {
  let component: ProductoAtributosComponent;
  let fixture: ComponentFixture<ProductoAtributosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductoAtributosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoAtributosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

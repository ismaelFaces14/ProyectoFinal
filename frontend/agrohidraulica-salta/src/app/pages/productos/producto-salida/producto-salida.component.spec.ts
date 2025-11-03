import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoSalidaComponent } from './producto-salida.component';

describe('ProductoSalidaComponent', () => {
  let component: ProductoSalidaComponent;
  let fixture: ComponentFixture<ProductoSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductoSalidaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductoSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

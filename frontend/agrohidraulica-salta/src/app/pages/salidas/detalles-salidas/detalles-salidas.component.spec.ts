import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesSalidasComponent } from './detalles-salidas.component';

describe('DetallesSalidasComponent', () => {
  let component: DetallesSalidasComponent;
  let fixture: ComponentFixture<DetallesSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetallesSalidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalidasService } from '../services/salidas.service';
import { IProductoSalidaDetalle } from '../../../interfaces/salida';

@Component({
  selector: 'app-detalles-salidas',
  templateUrl: './detalles-salidas.component.html',
  styleUrl: './detalles-salidas.component.scss'
})
export class DetallesSalidasComponent implements OnInit {
  productos: IProductoSalidaDetalle[] = [];
  salidaId!: number;
  totalGeneral = 0;

  constructor(private route: ActivatedRoute, private salidaService: SalidasService) { }
  ngOnInit(): void {
    this.salidaId = Number(this.route.snapshot.paramMap.get('id'));
    this.salidaService.obtenerDetalleSalida(this.salidaId).subscribe(p => {
      this.productos = p;
      this.totalGeneral = p.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
    });

  }
}

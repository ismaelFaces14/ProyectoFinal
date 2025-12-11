import { Component, OnInit } from '@angular/core';
import { SalidasService } from './services/salidas.service';
import { ISalidaResumen } from '../../interfaces/salida';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrl: './salidas.component.scss'
})
export class SalidasComponent implements OnInit {
  salidas: ISalidaResumen[] = [];

  constructor(private salidaService: SalidasService) { }

  ngOnInit(): void {
    this.salidaService.obtenerSalidas().subscribe(s => this.salidas = s);
  }
}

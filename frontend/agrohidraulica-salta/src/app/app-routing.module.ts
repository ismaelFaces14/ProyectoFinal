import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProductoFormComponent } from './pages/productos/producto-form/producto-form.component';
import { ProductoAtributosComponent } from './pages/productos/producto-atributos/producto-atributos.component';
import { ProductoEditarComponent } from './pages/productos/producto-editar/producto-editar.component';
import { SalidasComponent } from './pages/salidas/salidas.component';
import { RegistrarSalidaComponent } from './pages/salidas/registrar-salida/registrar-salida.component';
import { DetallesSalidasComponent } from './pages/salidas/detalles-salidas/detalles-salidas.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { PedidoDetailComponent } from './pages/pedidos/pedido-detail/pedido-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'productos',
    children: [
      { path: '', component: ProductosComponent },
      { path: 'nuevo', component: ProductoFormComponent },
      { path: 'atributos/:id', component: ProductoAtributosComponent },
      { path: 'editar/:id', component: ProductoEditarComponent }
    ]
  },
  {
    path: 'salidas',
    children: [
      { path: 'nueva', component: RegistrarSalidaComponent },
      { path: 'lista', component: SalidasComponent },
      { path: 'detalle/:id', component: DetallesSalidasComponent }
    ]
  },
  {
    path: 'pedidos',
    children: [
      { path: '', component: PedidosComponent },
      { path: ':id', component: PedidoDetailComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

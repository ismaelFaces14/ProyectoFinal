import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProductoFormComponent } from './pages/productos/producto-form/producto-form.component';
import { ProductoAtributosComponent } from './pages/productos/producto-atributos/producto-atributos.component';
import { ProductoSalidaComponent } from './pages/productos/producto-salida/producto-salida.component';
import { ProductoEditarComponent } from './pages/productos/producto-editar/producto-editar.component';
import { ProductoSalidaListadoComponent } from './pages/productos/producto-salida-listado/producto-salida-listado.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'productos/nuevo', component: ProductoFormComponent },
  { path: 'productos/atributos/:id', component: ProductoAtributosComponent },
  { path: 'productos/salidas/nueva', component: ProductoSalidaComponent },
  { path: 'productos/editar/:id', component: ProductoEditarComponent },
  { path: 'productos/salidas/listar', component: ProductoSalidaListadoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

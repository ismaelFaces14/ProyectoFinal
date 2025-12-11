import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProductoFormComponent } from './pages/productos/producto-form/producto-form.component';
import { ProductoAtributosComponent } from './pages/productos/producto-atributos/producto-atributos.component';
import { ProductoEditarComponent } from './pages/productos/producto-editar/producto-editar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ConfirmNotificationComponent } from './components/confirm-notification/confirm-notification.component';
import { SalidasComponent } from './pages/salidas/salidas.component';
import { RegistrarSalidaComponent } from './pages/salidas/registrar-salida/registrar-salida.component';
import { DetallesSalidasComponent } from './pages/salidas/detalles-salidas/detalles-salidas.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { PedidoDetailComponent } from './pages/pedidos/pedido-detail/pedido-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProductosComponent,
    ProductoFormComponent,
    ProductoEditarComponent,
    ProductoAtributosComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    ConfirmNotificationComponent,
    SalidasComponent,
    RegistrarSalidaComponent,
    DetallesSalidasComponent,
    PedidosComponent,
    PedidoDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

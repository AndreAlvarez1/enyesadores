import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { FilterPipe } from './pipes/filter.pipe';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './shared/menu/menu.component';
import { ObrasComponent } from './mantenedores/obras/obras.component';
import { ObraComponent } from './mantenedores/obra/obra.component';
import { OperariosComponent } from './mantenedores/operarios/operarios.component';
import { OperarioComponent } from './mantenedores/operario/operario.component';
import { InmueblesComponent } from './mantenedores/inmuebles/inmuebles.component';
import { NivelesComponent } from './mantenedores/niveles/niveles.component';
import { UnidadesComponent } from './mantenedores/unidades/unidades.component';
import { UnidadComponent } from './mantenedores/unidad/unidad.component';
import { RegistroComponent } from './mantenedores/registro/registro.component';
import { PreciosComponent } from './mantenedores/precios/precios.component';
import { HistorialComponent } from './components/historial/historial.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ResetpassComponent } from './components/resetpass/resetpass.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    FilterPipe,
    ObrasComponent,
    ObraComponent,
    OperariosComponent,
    OperarioComponent,
    InmueblesComponent,
    NivelesComponent,
    UnidadesComponent,
    UnidadComponent,
    RegistroComponent,
    PreciosComponent,
    HistorialComponent,
    UsuariosComponent,
    UsuarioComponent,
    ResetpassComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

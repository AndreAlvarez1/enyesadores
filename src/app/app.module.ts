import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FilterPipe } from './pipes/filter.pipe';


import { HttpClientModule } from '@angular/common/http';



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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    ObrasComponent,
    ObraComponent,
    FilterPipe,
    OperariosComponent,
    OperarioComponent,
    InmueblesComponent,
    NivelesComponent,
    UnidadesComponent,
    UnidadComponent,
    RegistroComponent,
    PreciosComponent,
    HistorialComponent
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

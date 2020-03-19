import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ObrasComponent } from './mantenedores/obras/obras.component';
import { ObraComponent } from './mantenedores/obra/obra.component';
import { OperariosComponent } from './mantenedores/operarios/operarios.component';
import { OperarioComponent } from './mantenedores/operario/operario.component';
import { InmueblesComponent } from './mantenedores/inmuebles/inmuebles.component';
import { NivelesComponent } from './mantenedores/niveles/niveles.component';
import { UnidadesComponent } from './mantenedores/unidades/unidades.component';
import { UnidadComponent } from './mantenedores/unidad/unidad.component';
import { PreciosComponent } from './mantenedores/precios/precios.component';
import { RegistroComponent } from './mantenedores/registro/registro.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'obras', component: ObrasComponent},
  {path: 'obra/:id', component: ObraComponent},
  {path: 'operarios', component: OperariosComponent},
  {path: 'operario/:id', component: OperarioComponent},
  {path: 'inmuebles/:obra', component: InmueblesComponent},
  {path: 'niveles/:obra/:inmueble', component: NivelesComponent},
  {path: 'unidades/:obra/:nivel', component: UnidadesComponent},
  {path: 'unidad/:obra/:unidad', component: UnidadComponent},
  {path: 'precios/:obra', component: PreciosComponent},
  {path: 'registro/:obra/:unidad', component: RegistroComponent},
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

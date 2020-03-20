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
import { HistorialComponent } from './components/historial/historial.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { AuthGuard } from './guards/auth.guard';
import { ResetpassComponent } from './components/resetpass/resetpass.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'resetpass', component: ResetpassComponent},
  {path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard]},
  {path: 'usuario/:id', component: UsuarioComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'obras', component: ObrasComponent, canActivate: [AuthGuard]},
  {path: 'obra/:id', component: ObraComponent, canActivate: [AuthGuard]},
  {path: 'operarios', component: OperariosComponent, canActivate: [AuthGuard]},
  {path: 'operario/:id', component: OperarioComponent, canActivate: [AuthGuard]},
  {path: 'inmuebles/:obra', component: InmueblesComponent, canActivate: [AuthGuard]},
  {path: 'niveles/:obra/:inmueble', component: NivelesComponent, canActivate: [AuthGuard]},
  {path: 'unidades/:obra/:nivel', component: UnidadesComponent, canActivate: [AuthGuard]},
  {path: 'unidad/:obra/:unidad', component: UnidadComponent, canActivate: [AuthGuard]},
  {path: 'precios/:obra', component: PreciosComponent, canActivate: [AuthGuard]},
  {path: 'registro/:obra/:unidad', component: RegistroComponent, canActivate: [AuthGuard]},
  {path: 'historial', component: HistorialComponent, canActivate: [AuthGuard]},

  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

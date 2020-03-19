"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var login_component_1 = require("./components/login/login.component");
var home_component_1 = require("./components/home/home.component");
var obras_component_1 = require("./mantenedores/obras/obras.component");
var obra_component_1 = require("./mantenedores/obra/obra.component");
var operarios_component_1 = require("./mantenedores/operarios/operarios.component");
var operario_component_1 = require("./mantenedores/operario/operario.component");
var inmuebles_component_1 = require("./mantenedores/inmuebles/inmuebles.component");
var niveles_component_1 = require("./mantenedores/niveles/niveles.component");
var unidades_component_1 = require("./mantenedores/unidades/unidades.component");
var unidad_component_1 = require("./mantenedores/unidad/unidad.component");
var precios_component_1 = require("./mantenedores/precios/precios.component");
var registro_component_1 = require("./mantenedores/registro/registro.component");
var routes = [
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'obras', component: obras_component_1.ObrasComponent },
    { path: 'obra/:id', component: obra_component_1.ObraComponent },
    { path: 'operarios', component: operarios_component_1.OperariosComponent },
    { path: 'operario/:id', component: operario_component_1.OperarioComponent },
    { path: 'inmuebles/:obra', component: inmuebles_component_1.InmueblesComponent },
    { path: 'niveles/:obra/:inmueble', component: niveles_component_1.NivelesComponent },
    { path: 'unidades/:obra/:nivel', component: unidades_component_1.UnidadesComponent },
    { path: 'unidad/:obra/:unidad', component: unidad_component_1.UnidadComponent },
    { path: 'precios/:obra', component: precios_component_1.PreciosComponent },
    { path: 'registro/:obra/:unidad', component: registro_component_1.RegistroComponent },
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: '**', pathMatch: 'full', redirectTo: 'login' }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes, { useHash: true })],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_routing_module_1 = require("./app-routing.module");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var filter_pipe_1 = require("./pipes/filter.pipe");
var http_1 = require("@angular/common/http");
var app_component_1 = require("./app.component");
var login_component_1 = require("./components/login/login.component");
var home_component_1 = require("./components/home/home.component");
var menu_component_1 = require("./shared/menu/menu.component");
var obras_component_1 = require("./mantenedores/obras/obras.component");
var obra_component_1 = require("./mantenedores/obra/obra.component");
var operarios_component_1 = require("./mantenedores/operarios/operarios.component");
var operario_component_1 = require("./mantenedores/operario/operario.component");
var inmuebles_component_1 = require("./mantenedores/inmuebles/inmuebles.component");
var niveles_component_1 = require("./mantenedores/niveles/niveles.component");
var unidades_component_1 = require("./mantenedores/unidades/unidades.component");
var unidad_component_1 = require("./mantenedores/unidad/unidad.component");
var registro_component_1 = require("./mantenedores/registro/registro.component");
var precios_component_1 = require("./mantenedores/precios/precios.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                home_component_1.HomeComponent,
                menu_component_1.MenuComponent,
                obras_component_1.ObrasComponent,
                obra_component_1.ObraComponent,
                filter_pipe_1.FilterPipe,
                operarios_component_1.OperariosComponent,
                operario_component_1.OperarioComponent,
                inmuebles_component_1.InmueblesComponent,
                niveles_component_1.NivelesComponent,
                unidades_component_1.UnidadesComponent,
                unidad_component_1.UnidadComponent,
                registro_component_1.RegistroComponent,
                precios_component_1.PreciosComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                forms_1.FormsModule
            ],
            providers: [
                { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy }
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;

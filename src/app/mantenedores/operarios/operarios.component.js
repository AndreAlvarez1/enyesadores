"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var OperariosComponent = /** @class */ (function () {
    function OperariosComponent(conex, router) {
        this.conex = conex;
        this.router = router;
        this.operarios = [];
        this.traerOperarios();
    }
    OperariosComponent.prototype.ngOnInit = function () {
    };
    OperariosComponent.prototype.traerOperarios = function () {
        var _this = this;
        this.conex.traeDatos('/tablas/OPERARIOS').subscribe(function (resp) {
            var todos = resp['datos'];
            _this.operarios = todos.filter(function (operario) { return operario.ESTADO === 1; });
        });
    };
    OperariosComponent.prototype.abrir = function (operario) {
        this.router.navigateByUrl("/operario/" + operario);
    };
    OperariosComponent = __decorate([
        core_1.Component({
            selector: 'app-operarios',
            templateUrl: './operarios.component.html',
            styleUrls: ['./operarios.component.css']
        })
    ], OperariosComponent);
    return OperariosComponent;
}());
exports.OperariosComponent = OperariosComponent;

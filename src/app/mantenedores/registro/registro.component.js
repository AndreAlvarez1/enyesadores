"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var registro_model_1 = require("src/app/models/registro.model");
var sweetalert2_1 = __importDefault(require("sweetalert2"));
var pega_model_1 = require("src/app/models/pega.model");
var RegistroComponent = /** @class */ (function () {
    function RegistroComponent(conex, route, router) {
        this.conex = conex;
        this.route = route;
        this.router = router;
        this.obraId = '';
        this.unidadId = '';
        this.unidad = {};
        this.pegas = [];
        this.operarios = [];
        this.usuario = '16.655.789-5';
        this.cuadrilla = [];
        this.cantidad = 0;
        this.ingresarPega = false;
        this.cuadrillaMemoria = false;
        this.obraId = this.route.snapshot.paramMap.get('obra');
        this.unidadId = this.route.snapshot.paramMap.get('unidad');
        this.traerPegas();
        this.traerUnidad();
        this.traerOperarios();
        if (localStorage.getItem('cuadrilla')) {
            this.cuadrillaMemoria = true;
        }
    }
    RegistroComponent.prototype.ngOnInit = function () {
    };
    RegistroComponent.prototype.traerUnidad = function () {
        var _this = this;
        this.conex.traeDatos("/unidad/" + this.obraId + "/" + this.unidadId)
            .subscribe(function (resp) {
            _this.unidad = resp['datos'][0];
            console.log('esta unidad', _this.unidad);
        });
    };
    RegistroComponent.prototype.traerPegas = function () {
        var _this = this;
        this.conex.traeDatos("/operaxuni/" + this.obraId)
            .subscribe(function (resp) {
            _this.pegas = resp['datos'].filter(function (p) { return p.IDUNIDAD === _this.unidadId; });
            console.log('pegas', _this.pegas);
        });
    };
    RegistroComponent.prototype.traerOperarios = function () {
        var _this = this;
        this.conex.traeDatos('/tablas/OPERARIOS').subscribe(function (resp) { _this.operarios = resp['datos']; console.log(_this.operarios); });
    };
    RegistroComponent.prototype.selectPega = function (pega) {
        this.operacion = pega;
        console.log('pega', this.operacion);
        if (this.operacion.COMPLETADO === 1) {
            this.ok();
            return;
        }
        this.ingresarPega = true;
    };
    RegistroComponent.prototype.traerCuadrilla = function () {
        this.cuadrilla = JSON.parse(localStorage.getItem('cuadrilla'));
    };
    RegistroComponent.prototype.escogerOperario = function (valor) {
        console.log('operario', valor);
        var operario = {
            rut: valor.RUT,
            nombre: valor.NOMBRE,
            apellido: valor.APELLIDO,
            apellidomat: valor.APELLIDOMAT,
            porcentaje: 100
        };
        // Reviso si ya agregué a ese operario, para no ponerlo dos veces
        if (this.operarioRepetido(valor)) {
            this.error('Ese operario ya lo agregaste a la cuadrilla');
            return;
        }
        this.cuadrilla.push(operario);
        this.dividirPorcentaje();
    };
    RegistroComponent.prototype.operarioRepetido = function (operario) {
        var resultado = this.cuadrilla.filter(function (o) { return o.rut === operario.RUT; });
        if (resultado.length > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    RegistroComponent.prototype.guardarAvance = function () {
        if (this.cantidad < 1 || this.cantidad > (this.operacion.META - this.operacion.PROGRESO)) {
            this.error('Debes ingresar una cantidad de avance mayor a 1 e inferior al la cantidad pendiente ');
            return;
        }
        if (this.cuadrilla.length < 1) {
            this.error('Debes ingresar por lo menos un operario');
            return;
        }
        if (!this.verificarPorcentaje()) {
            this.error('La suma de porcentajes debe ser 100');
            return;
        }
        console.log('cuadrilla', this.cuadrilla);
        localStorage.setItem('cuadrilla', JSON.stringify(this.cuadrilla));
        this.armarPaquete();
    };
    RegistroComponent.prototype.dividirPorcentaje = function () {
        var total = this.cuadrilla.length;
        for (var _i = 0, _a = this.cuadrilla; _i < _a.length; _i++) {
            var persona = _a[_i];
            persona.porcentaje = Math.ceil(100 / total);
        }
    };
    RegistroComponent.prototype.verificarPorcentaje = function () {
        var porcentaje = 0;
        for (var _i = 0, _a = this.cuadrilla; _i < _a.length; _i++) {
            var persona = _a[_i];
            porcentaje += persona.porcentaje;
        }
        if (porcentaje !== 100) {
            console.log('false', porcentaje);
            return false;
        }
        else {
            console.log('true', porcentaje);
            return true;
        }
    };
    RegistroComponent.prototype.borrarOperario = function (persona, posicion) {
        console.log('persona', persona);
        console.log('posicion', posicion);
        this.cuadrilla.splice(posicion, 1);
        this.dividirPorcentaje();
    };
    RegistroComponent.prototype.armarPaquete = function () {
        var _this = this;
        var paquete = [];
        for (var _i = 0, _a = this.cuadrilla; _i < _a.length; _i++) {
            var persona = _a[_i];
            var registro = new registro_model_1.RegistroModel();
            registro.RUT = persona.rut;
            registro.IDOPERACION = this.operacion.IDOPERACION;
            registro.IDUNIDAD = this.unidadId;
            registro.PORCENTAJE = persona.porcentaje;
            registro.CANTIDAD = this.cantidad * persona.porcentaje / 100;
            registro.PRECIO = this.operacion.PRECIO;
            registro.TOTAL = this.operacion.PRECIO * (this.cantidad * persona.porcentaje / 100);
            registro.REVISOR = this.usuario;
            paquete.push(registro);
        }
        console.log('Paquete', paquete);
        this.conex.guardarDato('/trabajo', paquete)
            .subscribe(function (resp) {
            console.log(resp);
            _this.actualizarPega();
        });
    };
    RegistroComponent.prototype.actualizarPega = function () {
        var _this = this;
        var pega = new pega_model_1.PegaModel();
        pega = this.operacion;
        pega.PROGRESO += this.cantidad;
        pega.REVISOR = this.usuario;
        pega.ACTUALIZADO = new Date();
        if (pega.PROGRESO === pega.META) {
            pega.COMPLETADO = 1;
        }
        console.log('acaa', pega);
        this.conex.guardarDato('/operaxuni/update', this.operacion)
            .subscribe(function (resp) {
            console.log(resp);
            _this.ingresarPega = false;
        });
    };
    RegistroComponent.prototype.volver = function () {
        this.router.navigateByUrl("/obra/" + this.obraId);
    };
    // WARNINGS
    RegistroComponent.prototype.error = function (mensaje) {
        sweetalert2_1.default.fire({
            text: mensaje,
            icon: 'warning',
            confirmButtonText: 'Ok'
        });
    };
    RegistroComponent.prototype.ok = function () {
        sweetalert2_1.default.fire({
            text: 'Esta operación ya fue completada',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    };
    RegistroComponent = __decorate([
        core_1.Component({
            selector: 'app-registro',
            templateUrl: './registro.component.html',
            styleUrls: ['./registro.component.css']
        })
    ], RegistroComponent);
    return RegistroComponent;
}());
exports.RegistroComponent = RegistroComponent;

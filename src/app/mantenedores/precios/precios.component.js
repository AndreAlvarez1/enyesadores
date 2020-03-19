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
var sweetalert2_1 = __importDefault(require("sweetalert2"));
var PreciosComponent = /** @class */ (function () {
    function PreciosComponent(conex, route, router) {
        this.conex = conex;
        this.route = route;
        this.router = router;
        this.obraId = '';
        this.operaciones = [];
        this.precios = [];
        this.precio = {
            ID: '',
            IDOPERACION: '',
            IDOBRA: '',
            PRECIO: '',
        };
        this.obraId = this.route.snapshot.paramMap.get('obra');
        this.traerOperaciones();
        this.traerPrecios();
    }
    PreciosComponent.prototype.ngOnInit = function () {
    };
    PreciosComponent.prototype.traerOperaciones = function () {
        var _this = this;
        this.conex.traeDatos("/tablas/OPERACIONES")
            .subscribe(function (resp) {
            _this.operaciones = resp['datos'];
            console.log('Operaciones', resp);
        });
    };
    PreciosComponent.prototype.traerPrecios = function () {
        var _this = this;
        this.conex.traeDatos("/operaciones/" + this.obraId)
            .subscribe(function (resp) {
            _this.precios = resp['datos'];
            console.log('Precios', resp);
        });
    };
    PreciosComponent.prototype.guardar = function (form) {
        var _this = this;
        if (!form.valid) {
            this.errorIncompleto();
            return;
        }
        console.log('por guardar', this.precio);
        this.precio.IDOBRA = this.obraId;
        if (this.verificaExiste()) {
            this.conex.guardarDato('/precios/update', this.precio)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
                _this.traerPrecios();
                _this.precio = {
                    ID: '',
                    IDOPERACION: '',
                    IDOBRA: '',
                    PRECIO: '',
                };
            });
        }
        else {
            this.conex.guardarDato('/precios/insert', this.precio)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
                _this.traerPrecios();
                _this.precio = {
                    ID: '',
                    IDOPERACION: '',
                    IDOBRA: '',
                    PRECIO: '',
                };
            });
        }
        // this.verificaCodigo();
    };
    PreciosComponent.prototype.verificaExiste = function () {
        var _this = this;
        var resultado = this.precios.filter(function (p) { return p.OPERACIONID === _this.precio.IDOPERACION; });
        if (resultado.length > 0) {
            console.log('existe');
            return true;
        }
        else {
            console.log('nuevo');
            return false;
        }
    };
    PreciosComponent.prototype.editar = function (i) {
        console.log('i', i);
        i.IDOPERACION = i.OPERACIONID;
        this.precio = i;
    };
    PreciosComponent.prototype.volver = function () {
        this.router.navigateByUrl("/obra/" + this.obraId);
    };
    // // Warnings
    PreciosComponent.prototype.errorIncompleto = function () {
        sweetalert2_1.default.fire({
            title: 'Formulario incompleto!',
            text: 'Llena todos los campos por favor',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    };
    PreciosComponent.prototype.exito = function (mensaje) {
        sweetalert2_1.default.fire({
            title: mensaje,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    };
    PreciosComponent = __decorate([
        core_1.Component({
            selector: 'app-precios',
            templateUrl: './precios.component.html',
            styleUrls: ['./precios.component.css']
        })
    ], PreciosComponent);
    return PreciosComponent;
}());
exports.PreciosComponent = PreciosComponent;

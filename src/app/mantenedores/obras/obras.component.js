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
var obra_model_1 = require("src/app/models/obra.model");
var regiones_json_1 = __importDefault(require("src/assets/js/regiones.json"));
var sweetalert2_1 = __importDefault(require("sweetalert2"));
var ObrasComponent = /** @class */ (function () {
    function ObrasComponent(conex, router) {
        this.conex = conex;
        this.router = router;
        this.obras = [];
        this.capataces = [];
        this.regionesAll = [];
        this.comunas = [];
        this.siguienteCodigo = '';
        this.mostrarComunas = false;
        this.cargarDatos();
        this.regionesAll = regiones_json_1.default;
        this.obra = new obra_model_1.ObraModel();
    }
    ObrasComponent.prototype.ngOnInit = function () {
    };
    ObrasComponent.prototype.cargarDatos = function () {
        this.traerObras();
        this.traerCapataces();
    };
    ObrasComponent.prototype.nuevo = function () {
        this.edito = false;
        this.obra = new obra_model_1.ObraModel();
        this.obra.CODIGO = this.nuevoCodigo();
    };
    ObrasComponent.prototype.traerObras = function () {
        var _this = this;
        this.conex.traeDatos('/tablas/OBRAS')
            .subscribe(function (resp) {
            console.log(resp);
            _this.obras = resp['datos'];
            _this.obra.CODIGO = _this.nuevoCodigo();
        });
    };
    ObrasComponent.prototype.abrir = function (obra) {
        console.log(obra);
        this.router.navigateByUrl('/obra/' + obra.CODIGO);
    };
    ObrasComponent.prototype.guardarObra = function (form) {
        var _this = this;
        if (!form.valid) {
            this.errorIncompleto();
            return;
        }
        // Limpio de apostrofes los campos
        this.obra.OBRANAME = this.obra.OBRANAME.replace(/'/g, '');
        this.obra.DIRECCION = this.obra.DIRECCION.replace(/'/g, '');
        var url = '/obras';
        if (!this.edito) {
            url = '/obras/insert';
        }
        else {
            url = '/obras/update';
        }
        this.conex.guardarDato(url, this.obra)
            .subscribe(function (resp) {
            _this.cerrarModal();
            _this.exito();
        });
    };
    ObrasComponent.prototype.nuevoCodigo = function () {
        var ultimo = this.obras[this.obras.length - 1];
        var nextCodigo = ultimo.CODIGO;
        var numero = (Number(nextCodigo.slice(2, 5)) + 1).toString();
        if (numero.length === 1) {
            nextCodigo = 'OB00' + numero;
        }
        else if (numero.length === 2) {
            nextCodigo = 'OB0' + numero;
        }
        else {
            nextCodigo = 'OB' + numero;
        }
        return nextCodigo;
    };
    ObrasComponent.prototype.filtrarComunas = function (regionSelect) {
        this.mostrarComunas = true;
        var filtrado = regiones_json_1.default.filter(function (resp) { return resp.region === regionSelect; });
        this.comunas = filtrado[0].comunas;
        console.log(this.comunas);
    };
    ObrasComponent.prototype.traerCapataces = function () {
        var _this = this;
        this.conex.traeDatos('/tablas/OPERARIOS')
            .subscribe(function (data) {
            var operarios = data["datos"];
            _this.capataces = operarios.filter(function (operario) { return operario.TIPO === 'CAPATAZ' && operario.ESTADO === 1; });
            console.log('operarios', operarios);
            console.log('capataces', _this.capataces);
        });
    };
    ObrasComponent.prototype.cerrarModal = function () {
        this.closebutton.nativeElement.click();
    };
    ObrasComponent.prototype.editarObra = function (obra) {
        console.log('obra', obra);
        this.edito = true;
        this.obra = obra;
    };
    // Warnings
    ObrasComponent.prototype.errorIncompleto = function () {
        sweetalert2_1.default.fire({
            title: 'Formulario incompleto!',
            text: 'Llena todos los campos por favor',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    };
    ObrasComponent.prototype.exito = function () {
        sweetalert2_1.default.fire({
            title: 'Datos grabados con exito',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        this.traerObras();
    };
    __decorate([
        core_1.ViewChild('closebutton')
    ], ObrasComponent.prototype, "closebutton", void 0);
    ObrasComponent = __decorate([
        core_1.Component({
            selector: 'app-obras',
            templateUrl: './obras.component.html',
            styleUrls: ['./obras.component.css']
        })
    ], ObrasComponent);
    return ObrasComponent;
}());
exports.ObrasComponent = ObrasComponent;

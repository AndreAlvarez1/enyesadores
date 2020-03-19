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
var OperarioComponent = /** @class */ (function () {
    function OperarioComponent(conex, route, router) {
        this.conex = conex;
        this.route = route;
        this.router = router;
        this.nuevo = true;
        this.operario = {
            RUT: '',
            NOMBRE: '',
            APELLIDO: '',
            APELLIDOMAT: '',
            CEL: '',
            TIPO: '',
            ESTADO: 1
        };
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id !== 'nuevo') {
            this.buscarOperario();
            this.nuevo = false;
        }
    }
    OperarioComponent.prototype.ngOnInit = function () {
    };
    OperarioComponent.prototype.buscarOperario = function () {
        var _this = this;
        this.conex.traeDatos("/operarios/" + this.id).subscribe(function (resp) {
            _this.operario = resp['datos'][0];
            console.log(_this.operario);
        });
    };
    OperarioComponent.prototype.guardarOperario = function (form) {
        var _this = this;
        if (!form.valid) {
            this.errorIncompleto();
            return;
        }
        if (this.nuevo) {
            this.conex.guardarDato('/operarios/insert', this.operario)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
            });
        }
        else {
            this.conex.guardarDato('/operarios/update', this.operario)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
            });
        }
    };
    OperarioComponent.prototype.borrar = function () {
        this.operario.ESTADO = 0;
        this.conex.guardarDato('/operarios/borrar', this.operario).subscribe(function (resp) { console.log('guardad'); });
        this.exito('Registro borrado con exito');
    };
    // Warnings
    OperarioComponent.prototype.errorIncompleto = function () {
        sweetalert2_1.default.fire({
            title: 'Formulario incompleto!',
            text: 'Llena todos los campos por favor',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    };
    OperarioComponent.prototype.alertaBorrar = function () {
        var _this = this;
        sweetalert2_1.default.fire({
            title: '¿Estás seguro?',
            // text: '¿Quieres comandar los productos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar',
            cancelButtonText: 'No'
        }).then(function (result) {
            if (result.value) {
                _this.borrar();
            }
            else {
                return;
            }
        });
    };
    OperarioComponent.prototype.exito = function (mensaje) {
        sweetalert2_1.default.fire({
            title: mensaje,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        this.router.navigateByUrl('/operarios');
    };
    OperarioComponent = __decorate([
        core_1.Component({
            selector: 'app-operario',
            templateUrl: './operario.component.html',
            styleUrls: ['./operario.component.css']
        })
    ], OperarioComponent);
    return OperarioComponent;
}());
exports.OperarioComponent = OperarioComponent;

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
var InmueblesComponent = /** @class */ (function () {
    function InmueblesComponent(conex, route, router) {
        this.conex = conex;
        this.route = route;
        this.router = router;
        this.obra = [];
        this.todos = []; // <-- inmuebles sin filtrar
        this.inmuebles = [];
        this.inmueble = {
            CODIGO: '',
            IDOBRA: '',
            INAME: '',
            OBRA: '',
            ESTADO: 1,
        };
        this.id = this.route.snapshot.paramMap.get('obra');
        this.inmueble.IDOBRA = this.id;
        this.traerObra();
        this.traerInmuebles();
    }
    InmueblesComponent.prototype.ngOnInit = function () {
    };
    InmueblesComponent.prototype.traerObra = function () {
        var _this = this;
        this.conex.traeDatos("/obras/" + this.id)
            .subscribe(function (resp) {
            var obraTemp = resp['datos'][0];
            _this.obra = obraTemp;
            _this.inmueble.OBRA = obraTemp.OBRANAME;
        });
    };
    InmueblesComponent.prototype.traerInmuebles = function () {
        var _this = this;
        this.conex.traeDatos("/tablas/INMUEBLES")
            .subscribe(function (resp) {
            _this.todos = resp['datos'];
            _this.inmuebles = resp['datos'].filter(function (i) { return i.IDOBRA === _this.id && i.ESTADO === 1; });
            console.log(_this.inmuebles);
            _this.inmueble.CODIGO = _this.nuevoCodigo();
        });
    };
    InmueblesComponent.prototype.editar = function (i) {
        console.log(i);
        this.inmueble = i;
    };
    InmueblesComponent.prototype.ir = function (i) {
        this.router.navigateByUrl("/niveles/" + this.id + "/" + i.CODIGO);
    };
    InmueblesComponent.prototype.volver = function () {
        this.router.navigateByUrl("/obra/" + this.id);
    };
    InmueblesComponent.prototype.guardarI = function (form, tarea) {
        var _this = this;
        if (!form.valid) {
            this.errorIncompleto();
            return;
        }
        // Limpio de apostrofes los campos
        this.inmueble.INAME = this.inmueble.INAME.replace(/'/g, '');
        console.log(this.inmueble);
        if (this.verificaCodigo()) {
            this.conex.guardarDato('/inmuebles/insert', this.inmueble)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
            });
        }
        else {
            this.conex.guardarDato('/inmuebles/update', this.inmueble)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
            });
        }
    };
    InmueblesComponent.prototype.verificaCodigo = function () {
        var _this = this;
        var buscar = this.inmuebles.filter(function (cod) { return cod.CODIGO === _this.inmueble.CODIGO; });
        if (buscar.length < 1) {
            return true;
        }
        else {
            console.log('update', buscar[0]);
            return false;
        }
    };
    InmueblesComponent.prototype.nuevoCodigo = function () {
        var ultimo = this.todos[this.todos.length - 1];
        var nextCodigo = ultimo.CODIGO;
        var numero = (Number(nextCodigo.slice(1, 5)) + 1).toString();
        console.log(numero);
        if (numero.length === 1) {
            nextCodigo = 'I000' + numero;
        }
        else if (numero.length === 2) {
            nextCodigo = 'I00' + numero;
        }
        else if (numero.length === 3) {
            nextCodigo = 'I0' + numero;
        }
        else {
            nextCodigo = 'I' + numero;
        }
        return nextCodigo;
    };
    InmueblesComponent.prototype.borrar = function (i) {
        i.ESTADO = 0;
        this.conex.guardarDato('/inmuebles/borrar', i).subscribe(function (resp) { console.log('borrado'); });
        this.exito('Registro borrado con exito');
    };
    // Warnings
    InmueblesComponent.prototype.errorIncompleto = function () {
        sweetalert2_1.default.fire({
            title: 'Formulario incompleto!',
            text: 'Llena todos los campos por favor',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    };
    InmueblesComponent.prototype.exito = function (mensaje) {
        sweetalert2_1.default.fire({
            title: mensaje,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        this.traerInmuebles();
    };
    InmueblesComponent.prototype.alertaBorrar = function (i) {
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
                _this.borrar(i);
            }
            else {
                return;
            }
        });
    };
    InmueblesComponent = __decorate([
        core_1.Component({
            selector: 'app-inmuebles',
            templateUrl: './inmuebles.component.html',
            styleUrls: ['./inmuebles.component.css']
        })
    ], InmueblesComponent);
    return InmueblesComponent;
}());
exports.InmueblesComponent = InmueblesComponent;

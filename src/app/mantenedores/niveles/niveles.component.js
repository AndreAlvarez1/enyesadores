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
var NivelesComponent = /** @class */ (function () {
    function NivelesComponent(conex, route, router) {
        this.conex = conex;
        this.route = route;
        this.router = router;
        this.obraId = '';
        this.obra = [];
        this.inmuebleId = '';
        this.inmuebles = [];
        this.nivelesALL = [];
        this.niveles = [];
        this.nivel = {
            CODIGO: '',
            IDOBRA: '',
            IDINMUEBLE: '',
            NNAME: '',
            ESTADO: 1,
        };
        this.obraId = this.route.snapshot.paramMap.get('obra');
        this.inmuebleId = this.route.snapshot.paramMap.get('inmueble');
        this.traerObra();
        this.traerInmuebles();
        this.nivel.IDOBRA = this.obraId;
        if (this.route.snapshot.paramMap.get('inmueble') !== 'todos') {
            this.nivel.IDINMUEBLE = this.inmuebleId;
        }
        this.traerNiveles(this.inmuebleId);
    }
    NivelesComponent.prototype.ngOnInit = function () {
    };
    NivelesComponent.prototype.traerObra = function () {
        var _this = this;
        this.conex.traeDatos("/obras/" + this.obraId)
            .subscribe(function (resp) {
            var obraTemp = resp['datos'][0];
            _this.obra = obraTemp;
            console.log('obra', _this.obra);
        });
    };
    NivelesComponent.prototype.traerInmuebles = function () {
        var _this = this;
        this.conex.traeDatos("/tablas/INMUEBLES")
            .subscribe(function (resp) {
            _this.inmuebles = resp['datos'].filter(function (i) { return i.IDOBRA === _this.obraId && i.ESTADO === 1; });
            console.log(_this.inmuebles);
        });
    };
    NivelesComponent.prototype.traerNiveles = function (filtro) {
        var _this = this;
        this.conex.traeDatos("/niveles")
            .subscribe(function (resp) {
            _this.nivelesALL = resp['datos'].filter(function (i) { return i.IDOBRA === _this.obraId; });
            _this.niveles = _this.nivelesALL;
            if (filtro !== 'Todos') {
                _this.niveles = _this.nivelesALL.filter(function (t) { return t.IDINMUEBLE === filtro; });
            }
            console.log('niveles', _this.niveles);
            _this.nuevoCodigo();
        });
    };
    NivelesComponent.prototype.filtrarNiveles = function (valor) {
        console.log(valor);
        if (valor === 'Todos') {
            this.traerNiveles(valor);
        }
        else {
            this.traerNiveles(valor.substring(3, 8));
        }
    };
    NivelesComponent.prototype.editar = function (i) {
        console.log(i);
        this.nivel = i;
    };
    NivelesComponent.prototype.ir = function (i) {
        this.router.navigateByUrl("/unidades/" + this.obraId + "/" + i.CODIGO);
    };
    NivelesComponent.prototype.volver = function () {
        if (this.inmuebleId !== 'Todos') {
            this.router.navigateByUrl("/inmuebles/" + this.obraId);
        }
        else {
            this.router.navigateByUrl("/obra/" + this.obraId);
        }
    };
    NivelesComponent.prototype.guardarN = function (form, tarea) {
        var _this = this;
        if (!form.valid) {
            this.errorIncompleto();
            return;
        }
        console.log(this.nivel);
        // Limpio de apostrofes los campos
        this.nivel.NNAME = this.nivel.NNAME.replace(/'/g, '');
        console.log(this.nivel);
        if (this.verificaCodigo()) {
            this.conex.guardarDato('/niveles/insert', this.nivel)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
                _this.traerNiveles(_this.nivel.IDINMUEBLE);
            });
        }
        else {
            this.conex.guardarDato('/niveles/update', this.nivel)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
                _this.traerNiveles(_this.nivel.IDINMUEBLE);
            });
        }
    };
    NivelesComponent.prototype.verificaCodigo = function () {
        var _this = this;
        var buscar = this.nivelesALL.filter(function (cod) { return cod.CODIGO === _this.nivel.CODIGO; });
        if (buscar.length < 1) {
            return true;
        }
        else {
            console.log('update', buscar[0]);
            return false;
        }
    };
    NivelesComponent.prototype.nuevoCodigo = function () {
        var _this = this;
        this.conex.traeDatos('/codigo/NIVELES')
            .subscribe(function (resp) {
            var nextCodigo = resp['datos'];
            var numero = (Number(nextCodigo.slice(1, 5)) + 1).toString();
            if (numero.length === 1) {
                nextCodigo = 'N000' + numero;
            }
            else if (numero.length === 2) {
                nextCodigo = 'N00' + numero;
            }
            else if (numero.length === 3) {
                nextCodigo = 'N0' + numero;
            }
            else {
                nextCodigo = 'N' + numero;
            }
            _this.nivel.CODIGO = nextCodigo;
        });
    };
    NivelesComponent.prototype.borrar = function (i) {
        i.ESTADO = 0;
        this.conex.guardarDato('/niveles/borrar', i).subscribe(function (resp) { console.log('borrado'); });
        this.exito('Registro borrado con exito');
        this.traerNiveles(i.IDINMUEBLE);
    };
    // // Warnings
    NivelesComponent.prototype.errorIncompleto = function () {
        sweetalert2_1.default.fire({
            title: 'Formulario incompleto!',
            text: 'Llena todos los campos por favor',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    };
    NivelesComponent.prototype.exito = function (mensaje) {
        sweetalert2_1.default.fire({
            title: mensaje,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    };
    NivelesComponent.prototype.alertaBorrar = function (i) {
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
    NivelesComponent = __decorate([
        core_1.Component({
            selector: 'app-niveles',
            templateUrl: './niveles.component.html',
            styleUrls: ['./niveles.component.css']
        })
    ], NivelesComponent);
    return NivelesComponent;
}());
exports.NivelesComponent = NivelesComponent;

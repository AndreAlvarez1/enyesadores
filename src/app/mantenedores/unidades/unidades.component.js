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
var UnidadesComponent = /** @class */ (function () {
    function UnidadesComponent(conex, route, router) {
        this.conex = conex;
        this.route = route;
        this.router = router;
        this.obraId = '';
        this.inmuebleId = '';
        this.nivelId = '';
        this.obra = [];
        this.inmueble = [];
        this.inmuebles = [];
        this.nivelesAll = [];
        this.niveles = [];
        this.unidades = [];
        this.unidadesAll = [];
        //   nivelesALL: any[] = [];
        this.unidad = {
            CODIGO: '',
            UNAME: '',
            IDOBRA: '',
            IDINMUEBLE: '',
            INAME: '',
            IDNIVEL: '',
            TIPO: '',
            DESCRIPCION: '',
            ESTADO: 1
        };
        this.obraId = this.route.snapshot.paramMap.get('obra');
        this.nivelId = this.route.snapshot.paramMap.get('nivel');
        this.traerObra();
        this.traerInmuebles();
        this.traerUnidades(this.nivelId);
        this.traerNiveles();
        this.unidad.IDOBRA = this.obraId;
        //   if (this.route.snapshot.paramMap.get('inmueble') !== 'todos') {
        //     this.nivel.IDINMUEBLE = this.inmuebleId;
        //   }
    }
    UnidadesComponent.prototype.ngOnInit = function () {
    };
    UnidadesComponent.prototype.traerUnidades = function (filtro) {
        var _this = this;
        this.conex.traeDatos("/unidades/" + this.obraId)
            .subscribe(function (resp) {
            _this.unidadesAll = resp['datos'];
            console.log(_this.unidadesAll);
            if (filtro !== 'Todos') {
                _this.unidades = _this.unidadesAll.filter(function (u) { return u.IDNIVEL === filtro; });
            }
            else {
                _this.unidades = _this.unidadesAll;
            }
            _this.nuevoCodigo();
        });
    };
    UnidadesComponent.prototype.traerObra = function () {
        var _this = this;
        this.conex.traeDatos("/obras/" + this.obraId)
            .subscribe(function (resp) {
            var obraTemp = resp['datos'][0];
            _this.obra = obraTemp;
        });
    };
    UnidadesComponent.prototype.traerInmuebles = function () {
        var _this = this;
        this.conex.traeDatos("/tablas/INMUEBLES")
            .subscribe(function (resp) {
            _this.inmuebles = resp['datos'].filter(function (i) { return i.IDOBRA === _this.obraId && i.ESTADO === 1; });
        });
    };
    UnidadesComponent.prototype.traerNiveles = function () {
        var _this = this;
        this.conex.traeDatos("/tablas/NIVELES")
            .subscribe(function (resp) {
            _this.nivelesAll = resp['datos'].filter(function (n) { return n.IDOBRA === _this.obraId && n.ESTADO === 1; });
            // this.camposXdefecto();
        });
    };
    // camposXdefecto() {
    //   if (this.nivelId !== 'Todos') {
    //     const nivel = this.nivelesAll.filter( nuevo => nuevo.CODIGO === this.nivelId );
    //     this.unidad.IDINMUEBLE = nivel[0].IDINMUEBLE;
    //     this.unidad.IDNIVEL = this.nivelId;
    //   }
    // }
    UnidadesComponent.prototype.filtrarUnidadesI = function (valor) {
        var codigo = valor;
        console.log('inmueble', valor);
        if (valor !== 'Todos') {
            console.log('inmueble codigo', codigo);
            this.inmuebleId = codigo;
            codigo = valor.substring(3, 8);
            this.niveles = this.nivelesAll.filter(function (niv) { return niv.IDINMUEBLE === codigo; });
            this.unidades = this.unidadesAll.filter(function (u) { return u.IDINMUEBLE === codigo; });
        }
        else {
            this.inmuebleId = 'Todos';
            this.niveles = this.nivelesAll;
            this.unidades = this.unidadesAll;
        }
    };
    UnidadesComponent.prototype.filtrarUnidadesN = function (valor) {
        var _this = this;
        if (valor === 'Todos' && this.inmuebleId === 'Todos') {
            this.unidades = this.unidadesAll;
        }
        else if (valor === 'Todos' && this.inmuebleId !== 'Todos') {
            this.unidades = this.unidadesAll.filter(function (u) { return u.IDINMUEBLE === _this.inmuebleId; });
        }
        else {
            this.unidades = this.unidadesAll.filter(function (u) { return u.IDNIVEL === valor.substring(3, 8); });
        }
    };
    UnidadesComponent.prototype.editar = function (i) {
        console.log(i);
        this.unidad = i;
    };
    UnidadesComponent.prototype.ir = function (i) {
        this.router.navigateByUrl("/unidad/" + this.obraId + "/" + i.CODIGO);
    };
    UnidadesComponent.prototype.volver = function () {
        if (this.nivelId !== 'Todos') {
            this.router.navigateByUrl("/niveles/" + this.obraId + "/Todos");
        }
        else {
            this.router.navigateByUrl("/obra/" + this.obraId);
        }
    };
    UnidadesComponent.prototype.guardarU = function (form, tarea) {
        var _this = this;
        if (!form.valid) {
            this.errorIncompleto();
            return;
        }
        if (this.unidad.IDINMUEBLE === 'Todos' || this.unidad.IDNIVEL === 'Todos') {
            this.error('La unidad debe pertenecer a un nivel o inmueble especificio. No puede escoger la alternativa Todos');
            return;
        }
        //   Limpio de apostrofes los campos
        this.unidad.UNAME = this.unidad.UNAME.replace(/'/g, '');
        console.log(this.unidad);
        if (this.verificaCodigo()) {
            this.conex.guardarDato('/unidades/insert', this.unidad)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
                _this.traerUnidades(_this.unidad.IDNIVEL);
            });
        }
        else {
            this.conex.guardarDato('/unidades/update', this.unidad)
                .subscribe(function (resp) {
                _this.exito('Registro grabado con exito');
                _this.traerUnidades(_this.unidad.IDNIVEL);
            });
        }
    };
    UnidadesComponent.prototype.verificaCodigo = function () {
        var _this = this;
        var buscar = this.unidadesAll.filter(function (cod) { return cod.CODIGO === _this.unidad.CODIGO; });
        if (buscar.length < 1) {
            return true;
        }
        else {
            console.log('update', buscar[0]);
            return false;
        }
    };
    UnidadesComponent.prototype.nuevoCodigo = function () {
        var _this = this;
        this.conex.traeDatos('/codigo/UNIDADES')
            .subscribe(function (resp) {
            var nextCodigo = resp['datos'];
            var numero = (Number(nextCodigo.slice(1, 6)) + 1).toString();
            if (numero.length === 1) {
                nextCodigo = 'U0000' + numero;
            }
            else if (numero.length === 2) {
                nextCodigo = 'U000' + numero;
            }
            else if (numero.length === 3) {
                nextCodigo = 'U00' + numero;
            }
            else if (numero.length === 4) {
                nextCodigo = 'U0' + numero;
            }
            else {
                nextCodigo = 'U' + numero;
            }
            _this.unidad.CODIGO = nextCodigo;
        });
    };
    UnidadesComponent.prototype.borrar = function (i) {
        i.ESTADO = 0;
        this.conex.guardarDato('/unidades/borrar', i).subscribe(function (resp) { console.log('borrado'); });
        this.exito('Registro borrado con exito');
        this.traerUnidades(this.unidad.IDNIVEL);
    };
    // // // Warnings
    UnidadesComponent.prototype.errorIncompleto = function () {
        sweetalert2_1.default.fire({
            title: 'Formulario incompleto!',
            text: 'Llena todos los campos por favor',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    };
    UnidadesComponent.prototype.error = function (mensaje) {
        sweetalert2_1.default.fire({
            text: mensaje,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    };
    UnidadesComponent.prototype.exito = function (mensaje) {
        sweetalert2_1.default.fire({
            title: mensaje,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    };
    UnidadesComponent.prototype.alertaBorrar = function (i) {
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
    UnidadesComponent = __decorate([
        core_1.Component({
            selector: 'app-unidades',
            templateUrl: './unidades.component.html',
            styleUrls: ['./unidades.component.css']
        })
    ], UnidadesComponent);
    return UnidadesComponent;
}());
exports.UnidadesComponent = UnidadesComponent;

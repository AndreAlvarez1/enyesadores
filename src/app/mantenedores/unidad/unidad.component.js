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
var pega_model_1 = require("src/app/models/pega.model");
var sweetalert2_1 = __importDefault(require("sweetalert2"));
var UnidadComponent = /** @class */ (function () {
    function UnidadComponent(conex, route, router) {
        this.conex = conex;
        this.route = route;
        this.router = router;
        this.obraId = '';
        this.unidadId = '';
        this.unidad = {};
        this.operaciones = [];
        this.pegas = [];
        this.pega = new pega_model_1.PegaModel();
        this.obraId = this.route.snapshot.paramMap.get('obra');
        this.unidadId = this.route.snapshot.paramMap.get('unidad');
    }
    UnidadComponent.prototype.ngOnInit = function () {
        this.traerUnidad();
        this.traerOperaciones();
        this.traerPegas();
    };
    // ===========================///
    // ======= TRAER INFO ========///
    // ===========================///
    UnidadComponent.prototype.traerUnidad = function () {
        var _this = this;
        this.conex.traeDatos("/unidad/" + this.obraId + "/" + this.unidadId)
            .subscribe(function (resp) {
            _this.unidad = resp['datos'][0];
            console.log('unidad', _this.unidad);
        });
    };
    UnidadComponent.prototype.traerOperaciones = function () {
        var _this = this;
        this.conex.traeDatos("/operaciones/" + this.obraId)
            .subscribe(function (resp) {
            _this.operaciones = resp['datos'];
            console.log('operaciones', resp);
        });
    };
    UnidadComponent.prototype.traerPegas = function () {
        var _this = this;
        this.conex.traeDatos("/operaxuni/" + this.obraId)
            .subscribe(function (resp) {
            _this.pegas = resp['datos'].filter(function (p) { return p.IDUNIDAD === _this.unidadId; });
            console.log('pegas', _this.pegas);
        });
    };
    // ===========================///
    // ======= TRAER INFO ========///
    // ===========================///
    UnidadComponent.prototype.volver = function () {
        this.router.navigateByUrl("/unidades/" + this.obraId + "/Todos");
    };
    UnidadComponent.prototype.guardarU = function (form) {
        if (!form.valid) {
            console.log('invalido', this.pega);
            this.errorIncompleto();
            return;
        }
        this.pega.IDUNIDAD = this.unidadId;
        console.log(this.pega);
        this.verificaCodigo();
    };
    UnidadComponent.prototype.verificaCodigo = function () {
        var _this = this;
        this.conex.traeDatos('/pegas/verificaID')
            .subscribe(function (resp) {
            var ids = resp['datos'];
            var resultados = ids.filter(function (id) { return id.ID === _this.pega.ID; });
            if (resultados.length > 0) {
                console.log('aca', _this.pega);
                _this.conex.guardarDato('/operaxuni/update', _this.pega)
                    .subscribe(function (resp) {
                    _this.exito('Registro grabado con exito');
                    _this.traerPegas();
                });
            }
            else {
                _this.conex.guardarDato('/operaxuni/insert', _this.pega)
                    .subscribe(function (resp) {
                    _this.exito('Registro grabado con exito');
                    _this.traerPegas();
                });
            }
        });
    };
    UnidadComponent.prototype.editar = function (i) {
        console.log('i', i);
        i.IDOPERACION = Number(i.IDOPERACION);
        i.OPERACIONID = Number(i.IDOPERACION);
        this.pega = i;
        console.log('pega', this.pega);
    };
    UnidadComponent.prototype.borrar = function (i) {
        i.ESTADO = 0;
        this.conex.guardarDato('/operaxuni/borrar', i).subscribe(function (resp) { console.log('borrado'); });
        this.exito('Registro borrado con exito');
        this.traerPegas();
    };
    // WARNINGS
    UnidadComponent.prototype.errorIncompleto = function () {
        sweetalert2_1.default.fire({
            title: 'Formulario incompleto!',
            text: 'Llena todos los campos por favor',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    };
    // error(mensaje) {
    //   Swal.fire({
    //     text: mensaje,
    //     icon: 'error',
    //     confirmButtonText: 'Ok'
    //   });
    // }
    UnidadComponent.prototype.exito = function (mensaje) {
        sweetalert2_1.default.fire({
            title: mensaje,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    };
    UnidadComponent.prototype.alertaBorrar = function (i) {
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
    UnidadComponent = __decorate([
        core_1.Component({
            selector: 'app-unidad',
            templateUrl: './unidad.component.html',
            styleUrls: ['./unidad.component.css']
        })
    ], UnidadComponent);
    return UnidadComponent;
}());
exports.UnidadComponent = UnidadComponent;

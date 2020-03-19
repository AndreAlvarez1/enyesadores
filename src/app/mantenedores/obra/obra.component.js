"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ObraComponent = /** @class */ (function () {
    function ObraComponent(conex, route, router) {
        this.conex = conex;
        this.route = route;
        this.router = router;
        this.loading = true;
        this.inmuebleId = 'Todos';
        this.obra = [];
        this.unidades = [];
        this.niveles = [];
        this.inmuebles = [];
        this.unidadesAll = [];
        this.nivelesAll = [];
        this.responsable = [];
        this.configurar = false;
        this.editar = false;
        this.cifras = {
            inmuebles: 0,
            niveles: 0,
            unidades: 0
        };
        this.id = this.route.snapshot.paramMap.get('id');
        this.traerObra();
        this.traerUnidades();
        this.traerNiveles();
        this.traerInmuebles();
    }
    ObraComponent.prototype.ngOnInit = function () {
    };
    ObraComponent.prototype.traerObra = function () {
        var _this = this;
        this.conex.traeDatos("/obras/" + this.id)
            .subscribe(function (resp) {
            _this.obra = resp['datos'][0];
            _this.traerResponsable(resp['datos'][0].RESPONSABLE);
        });
    };
    ObraComponent.prototype.traerUnidades = function () {
        var _this = this;
        this.conex.traeDatos("/unidades/" + this.id).subscribe(function (resp) {
            _this.unidadesAll = resp['datos'];
            if (_this.unidadesAll.length > 0) {
                _this.editar = false;
                _this.unidades = _this.unidadesAll;
                _this.cifras.unidades = _this.unidadesAll.length;
                localStorage.setItem('unidades', JSON.stringify(_this.unidadesAll));
                _this.loading = false;
            }
            else {
                _this.editar = true;
                _this.loading = false;
            }
        });
    };
    ObraComponent.prototype.traerNiveles = function () {
        var _this = this;
        this.conex.traeDatos("/tablas/NIVELES")
            .subscribe(function (resp) {
            _this.nivelesAll = resp['datos'].filter(function (n) { return n.IDOBRA === _this.id && n.ESTADO === 1; });
            _this.niveles = _this.nivelesAll;
            localStorage.setItem('niveles', JSON.stringify(_this.niveles));
            _this.cifras.niveles = _this.niveles.length;
        });
    };
    ObraComponent.prototype.traerInmuebles = function () {
        var _this = this;
        this.conex.traeDatos("/tablas/INMUEBLES")
            .subscribe(function (resp) {
            _this.inmuebles = resp['datos'].filter(function (i) { return i.IDOBRA === _this.id && i.ESTADO === 1; });
            localStorage.setItem('inmuebles', JSON.stringify(_this.inmuebles));
            _this.cifras.inmuebles = _this.inmuebles.length;
            console.log('inmuebles', _this.inmuebles);
        });
    };
    ObraComponent.prototype.traerResponsable = function (rut) {
        var _this = this;
        this.conex.traeDatos("/operarios/" + rut).subscribe(function (resp) {
            _this.responsable = resp['datos'][0];
        });
    };
    ObraComponent.prototype.filtrarUnidadesI = function (valor) {
        var codigo = valor;
        if (valor !== 'Todos') {
            codigo = valor.substring(0, 5);
            this.inmuebleId = codigo;
            this.niveles = this.nivelesAll.filter(function (niv) { return niv.IDINMUEBLE === codigo; });
            this.unidades = this.unidadesAll.filter(function (u) { return u.IDINMUEBLE === codigo; });
        }
        else {
            this.inmuebleId = 'Todos';
            this.niveles = this.nivelesAll;
            this.unidades = this.unidadesAll;
        }
    };
    ObraComponent.prototype.filtrarUnidadesN = function (valor) {
        var _this = this;
        if (valor === 'Todos' && this.inmuebleId === 'Todos') {
            this.unidades = this.unidadesAll;
        }
        else if (valor === 'Todos' && this.inmuebleId !== 'Todos') {
            this.unidades = this.unidadesAll.filter(function (u) { return u.IDINMUEBLE === _this.inmuebleId; });
        }
        else {
            console.log('inmueble codigo', valor.substring(0, 5));
            this.unidades = this.unidadesAll.filter(function (u) { return u.IDNIVEL === valor.substring(0, 5); });
        }
    };
    ObraComponent.prototype.abrirUnidad = function (unidad) {
        console.log(unidad);
        this.router.navigateByUrl("/registro/" + this.id + "/" + unidad.CODIGO);
    };
    ObraComponent.prototype.irMantenedor = function (dato) {
        var ruta = '';
        switch (dato) {
            case 'inmuebles':
                ruta = "/inmuebles/" + this.id;
                break;
            case 'niveles':
                ruta = "/niveles/" + this.id + "/Todos";
                break;
            case 'unidades':
                ruta = "/unidades/" + this.id + "/Todos";
                break;
            case 'precios':
                ruta = "/precios/" + this.id;
                break;
            case 'excel':
                ruta = "/importar/" + this.id;
                break;
            default:
                ruta = 'home';
        }
        this.router.navigateByUrl(ruta);
    };
    ObraComponent = __decorate([
        core_1.Component({
            selector: 'app-obra',
            templateUrl: './obra.component.html',
            styleUrls: ['./obra.component.css']
        })
    ], ObraComponent);
    return ObraComponent;
}());
exports.ObraComponent = ObraComponent;

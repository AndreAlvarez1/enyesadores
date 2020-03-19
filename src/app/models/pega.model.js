"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PegaModel = /** @class */ (function () {
    function PegaModel() {
        this.ID = 0;
        this.PROGRESO = 0;
        this.ESTADO = 1;
        this.CREADO = new Date();
        this.ACTUALIZADO = new Date();
        this.COMPLETADO = 0;
    }
    return PegaModel;
}());
exports.PegaModel = PegaModel;

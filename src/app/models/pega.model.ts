export class PegaModel {
   ID: number;
   IDUNIDAD: string;
   IDOPERACION: number;
   META: number;
   PROGRESO: number;
   CREADO: Date;
   ACTUALIZADO: Date;
   REVISOR: string;
   COMPLETADO: number;
   ESTADO: number;

    constructor() {
        this.ID = 0;
        this.PROGRESO = 0;
        this.ESTADO = 1;
        this.CREADO = new Date();
        this.ACTUALIZADO = new Date();
        this.COMPLETADO = 0;
    }
}

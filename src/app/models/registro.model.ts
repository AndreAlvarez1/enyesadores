export class RegistroModel {
    RUT: string;
    IDOPERACION: string;
    IDUNIDAD: string;
    PORCENTAJE: number;
    CANTIDAD: number;
    PRECIO: number;
    TOTAL: number;
    REVISOR: string;
    FECHA: Date;

    constructor() {
        this.FECHA = new Date();
    }
}

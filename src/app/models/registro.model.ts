export class RegistroModel {
    RUT: string;
    IDOPERACION: string;
    IDUNIDAD: string;
    PORCENTAJE: number;
    CANTIDAD: number;
    PRECIO: number;
    TOTAL: number;
    REVISOR: string;
    FECHA: string;

    constructor() {
        this.FECHA = this.modificarFecha(new Date());
    }




    modificarFecha(fecha) {
        const ano = (fecha.getFullYear()).toString();
        let mes = (fecha.getMonth() + 1).toString();
        let dia = (fecha.getDate()).toString();

        if ( mes.length < 2 ) {
          mes = '0' + mes;
        }

        if ( dia.length < 2 ) {
         dia = '0' + dia;
       }

        const fechaModif = ano + '-' + mes + '-' + dia;
        console.log('fecha Modif', fechaModif);
        return fechaModif;
      }
}

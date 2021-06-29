export class UnidadModel {
           CODIGO: string;
           UNAME: string;
           IDOBRA: string;
           IDINMUEBLE: string;
           INAME: string;
           IDNIVEL: string;
           TIPO: string;
           DESCRIPCION: string;
           ESTADO: number;
           CLONADO: string;
    constructor() {
        this.CODIGO = '',
        this.UNAME = '',
        this.IDOBRA = '',
        this.IDINMUEBLE = '',
        this.INAME = '',
        this.IDNIVEL = '',
        this.TIPO = '',
        this.DESCRIPCION = '',
        this.ESTADO = 1,
        this.CLONADO = 'no'
    }
}


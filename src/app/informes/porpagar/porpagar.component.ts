import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-porpagar',
  templateUrl: './porpagar.component.html',
  styleUrls: ['./porpagar.component.css']
})
export class PorpagarComponent implements OnInit {

  loading = true;
  vacio = false;
  searchString: string;
  
  date = new Date();
  firstDay  = new Date(this.date.getFullYear(), this.date.getMonth(), 1).toString();
  lastDay   = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).toString();
  registros: any[] = [];
  operarios: any[] = [];
  operario: any;

  modalOperario = false;

  constructor(private conex: ConectorService,
              private excel: ExcelService) { 

                this.firstDay = this.formatoFecha(this.firstDay);
                this.lastDay = this.formatoFecha(this.lastDay);          
                this.traerHistorial(this.firstDay, this.lastDay);
                this.conex.evaluarUser('Privado');

              }

  ngOnInit() {
  }

info(){
  console.log('registros', this.registros)
  console.log('operarios', this.operarios)
}

  buscar(form: NgForm) {
    console.log('fecha Ini', this.firstDay);
    console.log('fecha Fin', this.lastDay);
    this.traerHistorial(this.firstDay, this.lastDay);
  }


 traerHistorial(fechaIni, fechaFin) {
   this.loading = true;
   this.conex.traeDatos(`/trarealizados/${fechaIni}/${fechaFin}`)
             .subscribe( resp => {
              console.log(resp);
              this.registros = resp['datos'];

              if ( resp['datos'].length > 0) {
                for ( let o of this.registros){

                  const operario = {
                    rut: o.RUT,
                    nombre: o.NOMBRE,
                    apellido: o.APELLIDO,
                    materno: o.APELLIDOMAT,
                    trabajos:[o],
                    total: o.TOTAL
                  }

                  if (this.operarios.length == 0){
                      this.operarios.push(operario)
                    } else {
                      const existe = this.operarios.find( op => op.rut === o.RUT);
                      if (existe){
                        existe.trabajos.push(o)
                        existe.total += o.TOTAL;
                      } else {
                        this.operarios.push(operario)
                      }

                    }
                  }
               
                this.vacio = false;
              } else {
                this.vacio = true;
              }
              this.loading = false;
   });
 }


 exportAsXLSX(dato, titulo): void {
  this.excel.exportAsExcelFile(dato, titulo);
}

verOperario(o){
  console.log('operario', o)
  this.operario = o;
  this.modalOperario = true;
}

// ============================================ //
// ============================================ //
// ============== ARREGLA FECHAS ============== //
// ============================================ //
// ============================================ //

formatoFecha( fecha ) {
  const dia        = fecha.slice( 8, 10 );
  const mesPalabra = fecha.slice( 4, 7 );
  const mesNumero  = this.mesAnumero( mesPalabra );
  //
  const anno = fecha.slice( 11, 15 );
  const hora = fecha.slice( 16, 24 );

  const fechaSql = anno+ '-' + mesNumero + '-' + dia;
  return fechaSql;
}


mesAnumero( mesAbreviado: any ) {
  let mesNum: any;
  switch (mesAbreviado) {
  case 'Jan': case 'Enero'      : mesNum = '01'; break;
  case 'Feb': case 'Febrero'    : mesNum = '02'; break;
  case 'Mar': case 'Marzo'      : mesNum = '03'; break;
  case 'Apr': case 'Abril'      : mesNum = '04'; break;
  case 'May': case 'Mayo'       : mesNum = '05'; break;
  case 'Jun': case 'Junio'      : mesNum = '06'; break;
  case 'Jul': case 'Julio'      : mesNum = '07'; break;
  case 'Aug': case 'Agosto'     : mesNum = '08'; break;
  case 'Sep': case 'Septiembre' : mesNum = '09'; break;
  case 'Oct': case 'Octubre'    : mesNum = '10'; break;
  case 'Nov': case 'Noviembre'  : mesNum = '11'; break;
  case 'Dec': case 'Diciembre'  : mesNum = '12';
  }
  return mesNum;


}

}

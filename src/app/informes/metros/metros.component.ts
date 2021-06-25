import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-metros',
  templateUrl: './metros.component.html',
  styleUrls: ['./metros.component.css']
})
export class MetrosComponent implements OnInit {

  loading = true;
  vacio = false;
  searchString: string;
  
  date = new Date();
  firstDay  = new Date(this.date.getFullYear(), this.date.getMonth(), 1).toString();
  lastDay   = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).toString();
  registros: any[] = [];
  capataces: any[] = [];
  capataz: any;

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
    console.log('capataces', this.capataces)
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
                console.log('aca', resp);
                this.registros = resp['datos'];
  
                if ( resp['datos'].length > 0) {
                  for ( let o of this.registros){
                    if( o.IDOPERACION < 3){
                          let mts = 0
                          mts = o.CANTIDAD
                      
                          const capata = {
                            nombre: o.REVISOR,
                            trabajos:[o],
                            metros: mts
                          }
                      
                          if (this.capataces.length == 0){
                            this.capataces.push(capata)
                          } else {
                            const existe = this.capataces.find( op => op.nombre === o.REVISOR);
                            if (existe){
                              existe.trabajos.push(o)
                              existe.metros += mts;
                            } else {
                              this.capataces.push(capata)
                            }
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
    console.log('capataz', o)
    this.capataz = o;
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

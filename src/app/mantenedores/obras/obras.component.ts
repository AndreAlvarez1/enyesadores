import { Component, OnInit, ViewChild } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ObraModel } from 'src/app/models/obra.model';

import regiones from 'src/assets/js/regiones.json';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})
export class ObrasComponent implements OnInit {

  @ViewChild('closebutton') closebutton;
  obra: ObraModel;
  obras: any[] = [];
  capataces: any[] = [];
  regionesAll: any[] = [];
  comunas: any[] = [];
  siguienteCodigo = '';
  mostrarComunas = false;
  edito: boolean;

  constructor(private conex: ConectorService,
              private router: Router) {
              this.cargarDatos();
              this.regionesAll = regiones;

              this.obra = new ObraModel();
   }

  ngOnInit() {
  }


  cargarDatos() {
    this.traerObras();
    this.traerCapataces();
  }

  nuevo() {
    this.edito = false;
    this.obra = new ObraModel();
    this.obra.CODIGO = this.nuevoCodigo();
  }

  traerObras() {
    this.conex.traeDatos('/tablas/OBRAS')
        .subscribe(resp => {
          console.log(resp);
          this.obras = resp['datos'];
          this.obra.CODIGO = this.nuevoCodigo();
        });
  }

  abrir(obra) {
    console.log(obra);
    this.router.navigateByUrl('/obra/' + obra.CODIGO);
  }

  guardarObra(form: NgForm) {
    if ( !form.valid) {
      this.errorIncompleto();
      return; }

    // Limpio de apostrofes los campos
    this.obra.OBRANAME = this.obra.OBRANAME.replace(/'/g, '');
    this.obra.DIRECCION = this.obra.DIRECCION.replace(/'/g, '');

    let url = '/obras';
    if (!this.edito) {
      url = '/obras/insert';
    } else {
      url = '/obras/update';
    }

    this.conex.guardarDato(url, this.obra)
    .subscribe(resp => {
        this.cerrarModal();
        this.exito();
      });
}
  

  nuevoCodigo() {
    const ultimo = this.obras[this.obras.length - 1];
    let nextCodigo = ultimo.CODIGO;

    const numero = (Number(nextCodigo.slice(2, 5)) + 1).toString();

    if (numero.length === 1 ) {
      nextCodigo  = 'OB00' + numero;
    } else if (numero.length === 2) {
      nextCodigo = 'OB0' + numero;
    } else {
      nextCodigo = 'OB' + numero;
    }

    return nextCodigo;
  }

  filtrarComunas(regionSelect) {
    this.mostrarComunas = true;
    const filtrado = regiones.filter( resp => resp.region === regionSelect );
    this.comunas = filtrado[0].comunas;
    console.log(this.comunas);
  }

  traerCapataces() {
    this.conex.traeDatos('/tablas/OPERARIOS')
        .subscribe( data => {
          const operarios = data["datos"]
          this.capataces = operarios.filter( operario => operario.TIPO === 'CAPATAZ' && operario.ESTADO === 1 )

          console.log('operarios', operarios);
          console.log('capataces', this.capataces);
        });
  }

  cerrarModal() {
    this.closebutton.nativeElement.click();
  }


  editarObra(obra) {
    console.log('obra', obra);
    this.edito = true;
    this.obra = obra;

    }

// Warnings
errorIncompleto() {
  Swal.fire({
    title: 'Formulario incompleto!',
    text: 'Llena todos los campos por favor',
    icon: 'error',
    confirmButtonText: 'Ok'
  });
}

exito() {
  Swal.fire({
    title: 'Datos grabados con exito',
    icon: 'success',
    confirmButtonText: 'Ok'
  });
  this.traerObras();
}

}

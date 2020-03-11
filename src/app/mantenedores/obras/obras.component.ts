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

  traerObras() {
    this.conex.traeDatos('/obras')
        .subscribe(resp => {
          console.log(resp);
          this.obras = resp['datos'];
          this.obra.codigo = this.nuevoCodigo();

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
    this.obra.obraname = this.obra.obraname.replace(/'/g, '');
    this.obra.direccion = this.obra.direccion.replace(/'/g, '');
    console.log(this.obra);

    this.conex.guardarDato('/obras', this.obra)
        .subscribe(resp => {
            console.log(resp);
            this.cerrarModal();
            this.router.navigateByUrl('/obra/' + this.obra.codigo);
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
    this.conex.traeDatos('/operarios')
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



// Warnings
errorIncompleto() {
  Swal.fire({
    title: 'Formulario incompleto!',
    text: 'Llena todos los campos por favor',
    icon: 'error',
    confirmButtonText: 'Ok'
  });
}

}

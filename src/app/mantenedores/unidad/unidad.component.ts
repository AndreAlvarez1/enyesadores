import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { PegaModel } from 'src/app/models/pega.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent implements OnInit {

  obraId = '';
  unidadId = '';
  unidad = {};
  operaciones: any[] = [];
  pegas: any[] = [];
  pega: PegaModel = new PegaModel();

  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router) {

              this.obraId = this.route.snapshot.paramMap.get('obra');
              this.unidadId = this.route.snapshot.paramMap.get('unidad');

              }

  ngOnInit() {
              this.traerUnidad();
              this.traerOperaciones();
              this.traerPegas();

  }
  // ===========================///
  // ======= TRAER INFO ========///
  // ===========================///

  traerUnidad() {
    this.conex.traeDatos(`/unidad/${this.obraId}/${this.unidadId}`)
         .subscribe(resp => {
           this.unidad = resp['datos'][0];
           console.log('unidad', this.unidad);
         });
  }

  traerOperaciones() {
    this.conex.traeDatos(`/operaciones/${this.obraId}`)
    .subscribe(resp => {
      this.operaciones = resp['datos'];
      console.log('operaciones', resp);
    });
  }

  traerPegas() {
    this.conex.traeDatos(`/operaxuni/${this.obraId}`)
        .subscribe(resp => {
          this.pegas = resp['datos'].filter( p => p.IDUNIDAD === this.unidadId);
          console.log('pegas', this.pegas);
    });
  }

  // ===========================///
  // ======= TRAER INFO ========///
  // ===========================///

volver() {
  this.router.navigateByUrl(`/unidades/${this.obraId}/Todos`);
}

guardarU(form: NgForm) {
  if ( !form.valid) {
        console.log('invalido', this.pega);

        this.errorIncompleto();
        return; }

  this.pega.IDUNIDAD = this.unidadId;
  console.log(this.pega);

  this.verificaCodigo();
}

verificaCodigo() {
  this.conex.traeDatos('/pegas/verificaID')
            .subscribe( resp => {
              const ids = resp['datos'];
              const resultados = ids.filter( id => id.ID === this.pega.ID);
              if ( resultados.length > 0 ) {

                console.log('aca', this.pega);
                this.conex.guardarDato('/operaxuni/update', this.pega)
                    .subscribe( resp => {
                                this.exito('Registro grabado con exito');
                                this.traerPegas();
                  });
              } else {
                this.conex.guardarDato('/operaxuni/insert', this.pega)
                    .subscribe( resp => {
                                      this.exito('Registro grabado con exito');
                                      this.traerPegas();
                    });
              }
            });
}

editar(i) {
  console.log('i', i);
  i.IDOPERACION = Number(i.IDOPERACION);
  i.OPERACIONID = Number(i.IDOPERACION);
  this.pega = i;
  console.log('pega', this.pega);
}

borrar(i) {
  i.ESTADO = 0;
  this.conex.guardarDato('/operaxuni/borrar', i).subscribe(resp => { console.log('borrado'); });
  this.exito('Registro borrado con exito');
  this.traerPegas();
}




// WARNINGS
errorIncompleto() {
  Swal.fire({
    title: 'Formulario incompleto!',
    text: 'Llena todos los campos por favor',
    icon: 'error',
    confirmButtonText: 'Ok'
  });
}

// error(mensaje) {
//   Swal.fire({
//     text: mensaje,
//     icon: 'error',
//     confirmButtonText: 'Ok'
//   });
// }

exito(mensaje) {
  Swal.fire({
    title: mensaje,
    icon: 'success',
    confirmButtonText: 'Ok'
  });
}

alertaBorrar(i) {
  Swal.fire({
    title: '¿Estás seguro?',
    // text: '¿Quieres comandar los productos?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.value) {
      this.borrar(i);
    } else {
      return;
    }
  });
}


}

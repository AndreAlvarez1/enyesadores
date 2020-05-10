import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-operario',
  templateUrl: './operario.component.html',
  styleUrls: ['./operario.component.css']
})
export class OperarioComponent implements OnInit {

  id: string;
  nuevo = true;
  operario = {
              RUT: '',
              NOMBRE: '',
              APELLIDO: '',
              APELLIDOMAT: '',
              CEL: '',
              TIPO: '',
              ESTADO: 1
              };

  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router) {

                this.conex.evaluarUser('Privado');
                this.id = this.route.snapshot.paramMap.get('id');

                if (this.id !== 'nuevo') {
                  this.buscarOperario();
                  this.nuevo = false;
                }
              }

  ngOnInit() {
  }

  buscarOperario() {
    this.conex.traeDatos(`/operarios/${this.id}`).subscribe( resp => {
      this.operario = resp['datos'][0];
      console.log(this.operario);
    });
  }

  guardarOperario(form: NgForm) {
    if ( !form.valid) {
      this.errorIncompleto();
      return; }

    if (this.nuevo) {
      this.conex.guardarDato('/operarios/insert', this.operario)
          .subscribe(resp => {
              this.exito('Registro grabado con exito');
            });
    } else {
      this.conex.guardarDato('/operarios/update', this.operario)
                .subscribe(resp => {
                this.exito('Registro grabado con exito');
              });
    }
  }


  borrar() {
    this.operario.ESTADO = 0;
    this.conex.guardarDato('/operarios/borrar', this.operario).subscribe(resp => { console.log('guardad'); });
    this.exito('Registro borrado con exito');
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

alertaBorrar() {
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
      this.borrar();
    } else {
      return;
    }
  });
}

exito(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    this.router.navigateByUrl('/operarios');
}


}

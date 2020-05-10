import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.css']
})
export class PreciosComponent implements OnInit {

  obraId = '';
  operaciones: any[] = [];
  precios: any[] = [];
  precio = {
            ID: '',
            IDOPERACION: '',
            IDOBRA: '',
            PRECIO: '',
  };
  searchString: string;


  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router) {

                this.conex.evaluarUser('Privado');
                this.obraId = this.route.snapshot.paramMap.get('obra');
                this.traerOperaciones();
                this.traerPrecios();
              }

  ngOnInit() {
  }


  traerOperaciones() {
    this.conex.traeDatos(`/tablas/OPERACIONES`)
    .subscribe(resp => {
      this.operaciones = resp['datos'];
      console.log('Operaciones', resp);
    });
  }
  traerPrecios() {
    this.conex.traeDatos(`/operaciones/${this.obraId}`)
    .subscribe(resp => {
      this.precios = resp['datos'];
      console.log('Precios', resp);
    });
  }


  guardar(form: NgForm) {
    if ( !form.valid) {
      this.errorIncompleto();
      return; }

    console.log('por guardar', this.precio);

    this.precio.IDOBRA = this.obraId;

    if (this.verificaExiste() ) {
        this.conex.guardarDato('/precios/update', this.precio)
                  .subscribe( resp => {
                                      this.exito('Registro grabado con exito');
                                      this.traerPrecios();
                                      this.precio = {
                                                            ID: '',
                                                            IDOPERACION: '',
                                                            IDOBRA: '',
                                                            PRECIO: '',
                                                  };
                  });
    } else {
      this.conex.guardarDato('/precios/insert', this.precio)
                .subscribe( resp => {
                                      this.exito('Registro grabado con exito');
                                      this.traerPrecios();
                                      this.precio = {
                                        ID: '',
                                        IDOPERACION: '',
                                        IDOBRA: '',
                                        PRECIO: '',
                              };
                });
    }

    // this.verificaCodigo();

  }


  verificaExiste() {
    const resultado = this.precios.filter( p => p.OPERACIONID === this.precio.IDOPERACION);

    if (resultado.length > 0) {
      console.log('existe');
      return true;
    } else {
      console.log('nuevo');
      return false;
    }
  }

editar(i){
  console.log('i', i);
  i.IDOPERACION = i.OPERACIONID;
  this.precio = i;
}

  volver() {
    this.router.navigateByUrl(`/obra/${this.obraId}`);
  }


// // Warnings
errorIncompleto() {
  Swal.fire({
    title: 'Formulario incompleto!',
    text: 'Llena todos los campos por favor',
    icon: 'error',
    confirmButtonText: 'Ok'
  });
}

exito(mensaje) {
  Swal.fire({
    title: mensaje,
    icon: 'success',
    confirmButtonText: 'Ok'
  });
}


}



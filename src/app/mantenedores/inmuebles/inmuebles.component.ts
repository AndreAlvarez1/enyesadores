import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.css']
})
export class InmueblesComponent implements OnInit {

  id;
  obra: any[] = [];
  todos: any[] = []; // <-- inmuebles sin filtrar
  inmuebles: any[] = [];
  inmueble = {
              CODIGO: '',
              IDOBRA: '',
              INAME: '',
              OBRA: '',
              ESTADO: 1,
  };

  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router) {

                this.id = this.route.snapshot.paramMap.get('obra');
                this.inmueble.IDOBRA = this.id;
                this.traerObra();
                this.traerInmuebles();
              }

  ngOnInit() {
  }


traerObra() {
  this.conex.traeDatos(`/obras/${this.id}`)
            .subscribe( resp => {
              const obraTemp = resp['datos'][0];
              this.obra = obraTemp;
              this.inmueble.OBRA = obraTemp.OBRANAME;
            });
}

traerInmuebles() {
  this.conex.traeDatos(`/codigos/INMUEBLES`)
            .subscribe( resp => {
              this.todos = resp['datos'];
              this.inmuebles = resp['datos'].filter( i => i.IDOBRA === this.id && i.ESTADO === 1);
              console.log(this.inmuebles);
              this.inmueble.CODIGO = this.nuevoCodigo();
            });
}

  editar(i) {
    console.log(i);
    this.inmueble = i;
  }

  ir(i) {
    this.router.navigateByUrl(`/niveles/${this.id}/${i.CODIGO}`);
  }

  volver() {
    this.router.navigateByUrl(`/obra/${this.id}`);
    }

  guardarI(form: NgForm, tarea) {
    if ( !form.valid) {
      this.errorIncompleto();
      return; }

    // Limpio de apostrofes los campos
    this.inmueble.INAME = this.inmueble.INAME.replace(/'/g, '');
    console.log(this.inmueble);

    if (this.verificaCodigo()) {
      this.conex.guardarDato('/inmuebles/insert', this.inmueble)
          .subscribe(resp => {
              this.exito('Registro grabado con exito');
            });
    } else {
      this.conex.guardarDato('/inmuebles/update', this.inmueble)
                .subscribe(resp => {
                this.exito('Registro grabado con exito');
              });
    }
  }


  verificaCodigo() {
    const buscar = this.inmuebles.filter( cod => cod.CODIGO === this.inmueble.CODIGO);
    if (buscar.length < 1) {
      return true;
    } else {
      console.log('update', buscar[0]);
      return false;
    }
  }

  nuevoCodigo() {
    console.log('todos', this.todos);
    const ultimo = this.todos[0];

    let nextCodigo = ultimo.CODIGO;
    console.log('ultimo.CODIGO', ultimo.CODIGO);

    const numero = (Number(nextCodigo.slice(1, 5)) + 1).toString();
    console.log('numero', numero);

    if (numero.length === 1 ) {
      nextCodigo  = 'I000' + numero;
    } else if (numero.length === 2) {
      nextCodigo = 'I00' + numero;
    } else if (numero.length === 3) {
      nextCodigo = 'I0' + numero;
    } else {
      nextCodigo = 'I' + numero;
    }
    return nextCodigo;

}

borrar(i) {
  i.ESTADO = 0;
  this.conex.guardarDato('/inmuebles/borrar', i).subscribe(resp => { console.log('borrado'); });
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

exito(mensaje) {
  Swal.fire({
    title: mensaje,
    icon: 'success',
    confirmButtonText: 'Ok'
  });
  this.traerInmuebles();

  
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

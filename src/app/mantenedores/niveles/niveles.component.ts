import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-niveles',
  templateUrl: './niveles.component.html',
  styleUrls: ['./niveles.component.css']
})
export class NivelesComponent implements OnInit {

     obraId = '';
     obra: any[] = [];

     inmuebleId = '';
     inmuebles: any[] = [];

     nivelesALL: any[] = [];
     niveles: any[] = [];
     nivel = {
              CODIGO: '',
              IDOBRA: '',
              IDINMUEBLE: '',
              NNAME: '',
              ESTADO: 1,
  };

  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router) {

                this.obraId = this.route.snapshot.paramMap.get('obra');
                this.inmuebleId = this.route.snapshot.paramMap.get('inmueble');

                this.traerObra();
                this.traerInmuebles();
                this.nivel.IDOBRA = this.obraId;

                if (this.route.snapshot.paramMap.get('inmueble') !== 'todos') {
                  this.nivel.IDINMUEBLE = this.inmuebleId;
                }

                this.traerNiveles(this.inmuebleId);
              }

  ngOnInit() {
  }



traerObra() {
  this.conex.traeDatos(`/obras/${this.obraId}`)
            .subscribe( resp => {
              const obraTemp = resp['datos'][0];
              this.obra = obraTemp;
              console.log('obra', this.obra);
            });
}


traerInmuebles() {
  this.conex.traeDatos(`/tablas/INMUEBLES`)
            .subscribe( resp => {
              this.inmuebles = resp['datos'].filter( i => i.IDOBRA === this.obraId && i.ESTADO === 1);
              console.log(this.inmuebles);
            });
}

traerNiveles(filtro) {
  this.conex.traeDatos(`/niveles`)
            .subscribe( resp => {
              this.nivelesALL = resp['datos'].filter( i => i.IDOBRA === this.obraId);
              this.niveles = this.nivelesALL;

              if ( filtro !== 'Todos') {
                this.niveles = this.nivelesALL.filter( t => t.IDINMUEBLE === filtro);
              }

              console.log('niveles', this.niveles);
              this.nuevoCodigo();

            });
}

filtrarNiveles(valor) {
  console.log(valor);
  if (valor === 'Todos') {
    this.traerNiveles(valor);
  } else {
    this.traerNiveles(valor.substring(3, 8));
  }
}


  editar(i) {
    console.log(i);
    this.nivel = i;
  }

  ir(i) {
    this.router.navigateByUrl(`/unidades/${this.obraId}/${i.IDINMUEBLE}/${i.CODIGO}`);
  }

  volver() {
      if (this.inmuebleId !== 'todos') {
        this.router.navigateByUrl(`/inmuebles/${this.obraId}`);
      } else {
        this.router.navigateByUrl(`/obra/${this.obraId}`);
      }
    }

  guardarN(form: NgForm, tarea) {
    if ( !form.valid) {
      this.errorIncompleto();
      return; }

    console.log(this.nivel);

    // Limpio de apostrofes los campos
    this.nivel.NNAME = this.nivel.NNAME.replace(/'/g, '');
    console.log(this.nivel);

    if (this.verificaCodigo()) {
      this.conex.guardarDato('/niveles/insert', this.nivel)
          .subscribe(resp => {
              this.exito('Registro grabado con exito');
              this.traerNiveles(this.nivel.IDINMUEBLE);
            });
    } else {
      this.conex.guardarDato('/niveles/update', this.nivel)
                .subscribe(resp => {
                this.exito('Registro grabado con exito');
                this.traerNiveles(this.nivel.IDINMUEBLE);
              });
    }
  }


  verificaCodigo() {
    const buscar = this.nivelesALL.filter( cod => cod.CODIGO === this.nivel.CODIGO);
    if (buscar.length < 1) {
      return true;
    } else {
      console.log('update', buscar[0]);
      return false;
    }
  }

  nuevoCodigo() {

    this.conex.traeDatos('/tablas/NIVELES').subscribe( resp => {
      const todos = resp['datos']

      const ultimo = todos[todos.length - 1];
      let nextCodigo = ultimo.CODIGO;

      const numero = (Number(nextCodigo.slice(1, 5)) + 1).toString();
      console.log(numero);

      if (numero.length === 1 ) {
        nextCodigo  = 'N000' + numero;
      } else if (numero.length === 2) {
        nextCodigo = 'N00' + numero;
      } else if (numero.length === 3) {
        nextCodigo = 'N0' + numero;
      } else {
        nextCodigo = 'N' + numero;
      }
      this.nivel.CODIGO = nextCodigo;
  });
}

borrar(i) {
  i.ESTADO = 0;
  this.conex.guardarDato('/niveles/borrar', i).subscribe(resp => { console.log('borrado'); });
  this.exito('Registro borrado con exito');
  this.traerNiveles(i.IDINMUEBLE);
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

import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {

     obraId = '';
     inmuebleId = '';
     nivelId = '';

     obra: any[] = [];
     inmueble: any[] = [];

     inmuebles: any[] = [];
     nivelesALL: any[] = [];
     niveles: any[] = [];
     unidades: any[] = [];


//   nivelesALL: any[] = [];
  unidad = {
           CODIGO: '',
           UNAME: '',
           IDOBRA: '',
           IDINMUEBLE: '',
           INAME: '',
           IDNIVEL: '',
           TIPO: '',
           DESCRIPCION: '',
           ESTADO: 1
  };


  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router) {

                this.obraId = this.route.snapshot.paramMap.get('obra');
                this.nivelId = this.route.snapshot.paramMap.get('nivel');

                this.traerObra();
                this.traerInmuebles();
                this.traerUnidades(this.nivelId);
                this.traerNiveles(this.nivelId);

                this.unidad.IDOBRA = this.obraId;

              //   if (this.route.snapshot.paramMap.get('inmueble') !== 'todos') {
              //     this.nivel.IDINMUEBLE = this.inmuebleId;
              //   }

              }

  ngOnInit() {
  }



traerUnidades(filtro) {
  this.conex.traeDatos(`/unidades/${this.obraId}`)
            .subscribe( resp => {
              const unidades = resp['datos'];

              console.log('unidades', unidades);


              if (filtro !== 'Todos') {
                this.unidades = unidades.filter( u => u.IDNIVEL === filtro);
              } else {
                this.unidades = unidades;
              }
              this.nuevoCodigo();

            });
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
  this.conex.traeDatos(`/tablas/NIVELES`)
            .subscribe( resp => {
              this.nivelesALL = resp['datos'].filter( n => n.IDOBRA === this.obraId && n.ESTADO === 1);
              this.niveles = this.nivelesALL;
              console.log('todos los niveles de la obra', this.niveles);
              this.camposXdefecto();
            });
}


camposXdefecto() {
  if (this.nivelId !== 'Todos') {
    const nivel = this.niveles.filter( nuevo => nuevo.CODIGO === this.nivelId );
    console.log('nivel', nivel);
    this.unidad.IDINMUEBLE = nivel[0].IDINMUEBLE;
    this.unidad.IDNIVEL = this.nivelId;
  }

}


filtrarUnidadesI(valor) {

  let codigo = valor;

  if (valor !== 'Todos' ) {
    codigo = valor.substring(3, 8);
    this.niveles = this.nivelesALL.filter( niv => niv.IDINMUEBLE === codigo);
  } else {
    console.log('TODOS LOS Inmuebles')
    this.niveles = this.nivelesALL;
  }

  this.inmuebleId = codigo;

  this.conex.traeDatos(`/unidades/${this.obraId}`)
            .subscribe( resp => {
              const unidades = resp['datos'];

              console.log('unidades', unidades);
              if (codigo !== 'Todos') {
                this.unidades = unidades.filter( u => u.IDINMUEBLE === codigo);
              } else {
                this.unidades = unidades;
              }
            });
}




filtrarUnidadesN(valor) {

  if (this.inmuebleId === 'Todos') {
    if (valor === 'Todos') {
      console.log('aca toodos');
      this.traerUnidades(valor);
    } else {
      this.traerUnidades(valor.substring(3, 8));
    }
  } else {
    if (valor === 'Todos') {
      this.conex.traeDatos(`/unidades/${this.obraId}`)
          .subscribe( resp => {
            const unidades = resp['datos'];
            this.unidades = unidades.filter( u => u.IDINMUEBLE === this.inmuebleId);
          });
    } else {
      this.conex.traeDatos(`/unidades/${this.obraId}`)
          .subscribe( resp => {
            const unidades = resp['datos'];
            this.unidades = unidades.filter( u => u.IDINMUEBLE === this.inmuebleId && u.IDNIVEL === valor.substring(3, 8));
          });
    }
  }

  console.log(valor);
}


//   editar(i) {
//     console.log(i);
//     this.nivel = i;
//   }

//   ir(i) {
//     this.router.navigateByUrl(`/unidades/${this.obraId}/${i.IDINMUEBLE}/${i.CODIGO}`);
//   }

  volver() {
      if (this.nivelId !== 'Todos') {
        this.router.navigateByUrl(`/niveles/${this.obraId}/Todos`);
      } else {
        this.router.navigateByUrl(`/obra/${this.obraId}`);
      }
    }

  guardarU(form: NgForm, tarea) {
    if ( !form.valid) {
      this.errorIncompleto();
      return; }

    console.log(this.unidad);

    // Limpio de apostrofes los campos
    // this.nivel.NNAME = this.nivel.NNAME.replace(/'/g, '');
    // console.log(this.nivel);

    // if (this.verificaCodigo()) {
    //   this.conex.guardarDato('/niveles/insert', this.nivel)
    //       .subscribe(resp => {
    //           this.exito('Registro grabado con exito');
    //           this.traerNiveles(this.nivel.IDINMUEBLE);
    //         });
    // } else {
    //   this.conex.guardarDato('/niveles/update', this.nivel)
    //             .subscribe(resp => {
    //             this.exito('Registro grabado con exito');
    //             this.traerNiveles(this.nivel.IDINMUEBLE);
    //           });
    // }
  }


  verificaCodigo() {
    const buscar = this.unidades.filter( cod => cod.CODIGO === this.unidad.CODIGO);
    if (buscar.length < 1) {
      return true;
    } else {
      console.log('update', buscar[0]);
      return false;
    }
  }

nuevoCodigo() {
  this.conex.traeDatos('/codigo/UNIDADES')
      .subscribe( resp => {
              let nextCodigo =  resp['datos'];

              const numero = (Number(nextCodigo.slice(1, 6)) + 1).toString();

              if (numero.length === 1 ) {
              nextCodigo  = 'U0000' + numero;
            } else if (numero.length === 2) {
              nextCodigo = 'U000' + numero;
            } else if (numero.length === 3) {
              nextCodigo = 'U00' + numero;
            } else if (numero.length === 4) {
              nextCodigo = 'U0' + numero;
            } else {
              nextCodigo = 'U' + numero;
            }
              this.unidad.CODIGO = nextCodigo;
      });
}

// borrar(i) {
//   i.ESTADO = 0;
//   this.conex.guardarDato('/niveles/borrar', i).subscribe(resp => { console.log('borrado'); });
//   this.exito('Registro borrado con exito');
//   this.traerNiveles(i.IDINMUEBLE);
// }


// // // Warnings
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
      // this.borrar(i);
    } else {
      return;
    }
  });
}


}

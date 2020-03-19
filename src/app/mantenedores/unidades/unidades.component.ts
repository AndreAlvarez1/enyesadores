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
     nivelesAll: any[] = [];
     niveles: any[] = [];
     unidades: any[] = [];
     unidadesAll: any[] = [];


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
                this.traerNiveles();

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
              this.unidadesAll = resp['datos'];
              console.log(this.unidadesAll);


              if (filtro !== 'Todos') {
                this.unidades = this.unidadesAll.filter( u => u.IDNIVEL === filtro);
              } else {
                this.unidades = this.unidadesAll;
              }
              this.nuevoCodigo();
            });
}

traerObra() {
  this.conex.traeDatos(`/obras/${this.obraId}`)
            .subscribe( resp => {
              const obraTemp = resp['datos'][0];
              this.obra = obraTemp;
            });
}


traerInmuebles() {
  this.conex.traeDatos(`/tablas/INMUEBLES`)
            .subscribe( resp => {
              this.inmuebles = resp['datos'].filter( i => i.IDOBRA === this.obraId && i.ESTADO === 1);
            });
}

traerNiveles() {
  this.conex.traeDatos(`/tablas/NIVELES`)
            .subscribe( resp => {
              this.nivelesAll = resp['datos'].filter( n => n.IDOBRA === this.obraId && n.ESTADO === 1);
              // this.camposXdefecto();
            });
}


// camposXdefecto() {
//   if (this.nivelId !== 'Todos') {
//     const nivel = this.nivelesAll.filter( nuevo => nuevo.CODIGO === this.nivelId );
//     this.unidad.IDINMUEBLE = nivel[0].IDINMUEBLE;
//     this.unidad.IDNIVEL = this.nivelId;
//   }

// }


filtrarUnidadesI(valor) {

  let codigo = valor;
  console.log('inmueble', valor);

  if (valor !== 'Todos' ) {
    console.log('inmueble codigo', codigo);
    this.inmuebleId = codigo;
    codigo = valor.substring(3, 8);
    this.niveles = this.nivelesAll.filter( niv => niv.IDINMUEBLE === codigo);
    this.unidades = this.unidadesAll.filter( u => u.IDINMUEBLE === codigo);

  } else {
    this.inmuebleId = 'Todos';
    this.niveles = this.nivelesAll;
    this.unidades = this.unidadesAll;
  }
}


filtrarUnidadesN(valor) {
  if ( valor === 'Todos' && this.inmuebleId === 'Todos') {
       this.unidades = this.unidadesAll;
  } else if ( valor === 'Todos' && this.inmuebleId !== 'Todos') {
    this.unidades = this.unidadesAll.filter( u => u.IDINMUEBLE === this.inmuebleId);
  } else {
    this.unidades = this.unidadesAll.filter( u => u.IDNIVEL === valor.substring(3, 8));
  }
}


  editar(i) {
    console.log(i);
    this.unidad = i;
  }

  ir(i) {
    this.router.navigateByUrl(`/unidad/${this.obraId}/${i.CODIGO}`);
  }

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

    if (this.unidad.IDINMUEBLE === 'Todos' || this.unidad.IDNIVEL === 'Todos'){
      this.error('La unidad debe pertenecer a un nivel o inmueble especificio. No puede escoger la alternativa Todos')
      return;
    }

    //   Limpio de apostrofes los campos
    this.unidad.UNAME = this.unidad.UNAME.replace(/'/g, '');
    console.log(this.unidad);

    if (this.verificaCodigo()) {
      this.conex.guardarDato('/unidades/insert', this.unidad)
          .subscribe(resp => {
              this.exito('Registro grabado con exito');
              this.traerUnidades(this.unidad.IDNIVEL);
            });
    } else {
      this.conex.guardarDato('/unidades/update', this.unidad)
                .subscribe(resp => {
                this.exito('Registro grabado con exito');
                this.traerUnidades(this.unidad.IDNIVEL);
              });
    }
  }


  verificaCodigo() {
    const buscar = this.unidadesAll.filter( cod => cod.CODIGO === this.unidad.CODIGO);
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

borrar(i) {
  i.ESTADO = 0;
  this.conex.guardarDato('/unidades/borrar', i).subscribe(resp => { console.log('borrado'); });
  this.exito('Registro borrado con exito');
  this.traerUnidades(this.unidad.IDNIVEL);
}


// // // Warnings
errorIncompleto() {
  Swal.fire({
    title: 'Formulario incompleto!',
    text: 'Llena todos los campos por favor',
    icon: 'error',
    confirmButtonText: 'Ok'
  });
}

error(mensaje) {
  Swal.fire({
    text: mensaje,
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

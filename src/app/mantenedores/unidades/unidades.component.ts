import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ObraModel } from 'src/app/models/obra.model';
import { UnidadModel } from 'src/app/models/unidad.model';
import { PegaModel } from 'src/app/models/pega.model';

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {

     obraId             = '';
     inmuebleId         = '';
     nivelId            = '';

     obra               = new ObraModel();
     inmueble: any[]    = [];

     inmuebles: any[]   = [];
     nivelesAll: any[]  = [];
     niveles: any[]     = [];
     unidades: any[]    = [];
     unidadesAll: any[] = [];
     
     

     // Variables para clonar
     clonar = false;
     modalClonarNivel = false;

     operaciones: any[] = [];
     idMemoria;
     nivelClonar: any;
     listoParaClonar = 0;

     codigo_unidades = []
     unidadesXclonar = []
     loading3 = false;
     newCode: string = '';
     descripcion = '-clon';
//   nivelesALL: any[] = [];
  unidad: UnidadModel = new UnidadModel
  searchString: string;



  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router) {

                this.conex.evaluarUser('Privado');
                this.obraId = this.route.snapshot.paramMap.get('obra');
                this.nivelId = this.route.snapshot.paramMap.get('nivel');


                this.traerObra();
                this.traerInmuebles();
                this.traerUnidades(this.nivelId);
                this.traerNiveles();

                this.unidad.IDOBRA = this.obraId;


                this.operaciones = JSON.parse(localStorage.getItem('molde'));


              }

  ngOnInit() {

  }


info(){
  console.log('unidad', this.unidad)
  console.log('niveles', this.niveles);
  console.log('new CODE', this.newCode)
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
              console.log('recibo niveles', resp['datos'])
              this.nivelesAll = resp['datos'].filter( n => n.IDOBRA === this.obraId && n.ESTADO === 1);
              console.log('niveles all', this.nivelesAll )
              this.camposXdefecto();
            });
}


async camposXdefecto() {
  if (this.nivelId !== 'Todos') {
  
    const nivel = this.nivelesAll.filter( nuevo => nuevo.CODIGO === this.nivelId );
    if (nivel){
      console.log('nivel aca', nivel);
      this.unidad.IDINMUEBLE = nivel[0].IDINMUEBLE;
      this.unidad.IDNIVEL = this.nivelId;
      console.log('inmueble', this.unidad.IDINMUEBLE)
      this.niveles = this.nivelesAll.filter ( n =>  n.IDINMUEBLE === this.unidad.IDINMUEBLE)
      console.log('aca', this.niveles);

    }
  }

}


filtrarUnidadesI(valor) {
  this.nivelId = valor

  let codigo = valor;
  console.log('inmueble', valor);

  if (valor !== 'Todos' ) {
    console.log('inmueble codigo', codigo);
    this.inmuebleId = codigo;
    // codigo = valor.substring(3, 8);
    this.niveles = this.nivelesAll.filter( niv => niv.IDINMUEBLE === codigo);
    this.unidades = this.unidadesAll.filter( u => u.IDINMUEBLE === codigo);

  } else {
    this.inmuebleId = 'Todos';
    this.niveles = this.nivelesAll;
    this.unidades = this.unidadesAll;
  }
}


filtrarUnidadesN(valor) {
  
  console.log('filtrar niveles', valor); 

  if ( valor === 'Todos' && this.inmuebleId === 'Todos') {
       this.unidades = this.unidadesAll;
  } else if ( valor === 'Todos' && this.inmuebleId !== 'Todos') {
    this.unidades = this.unidadesAll.filter( u => u.IDINMUEBLE === this.unidad.IDINMUEBLE);
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

  guardarU(form: NgForm) {
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
              this.idMemoria = this.unidad.CODIGO;
              this.traerUnidades(this.unidad.IDNIVEL);

              if (localStorage.getItem('molde') ) {
                this.preguntaClonar();
              }
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
              const nuevoCode = this.sumCodigo(nextCodigo); 
              this.unidad.CODIGO = nuevoCode;
              this.newCode = nuevoCode;
      });
}


sumCodigo(value){
  const numero = (Number(value.slice(1, 6)) + 1).toString();
  if (numero.length === 1 ) {
    value  = 'U0000' + numero;
  } else if (numero.length === 2) {
    value = 'U000' + numero;
  } else if (numero.length === 3) {
    value = 'U00' + numero;
  } else if (numero.length === 4) {
    value = 'U0' + numero;
  } else {
    value = 'U' + numero;
  }
  return value;
}

borrar(i) {
  i.ESTADO = 0;
  this.conex.guardarDato('/unidades/borrar', i).subscribe(resp => { console.log('borrado'); });
  this.exito('Registro borrado con exito');
  this.traerUnidades(this.unidad.IDNIVEL);
}


guardarClon(){
  console.log('unidad', this.idMemoria);
  for ( const operacion of this.operaciones ) {
        operacion.IDUNIDAD = this.idMemoria;
  }
  console.log('nuevo paquete', this.operaciones);
  this.conex.guardarDato('/clonarOperaciones', this.operaciones).
  subscribe( resp => {
             console.log(resp);
             this.exito('Operaciones clonadas con exito');
             this.clonar = false;
  });
}




selectNivel(value){
  this.listoParaClonar = 0;
  console.log('escogió', value);
  let code = this.newCode;
  const codes = []
  
  this.codigo_unidades = []
  this.unidadesXclonar = []

  this.conex.traeDatos('/unidadesXnivel/' + value)
            .subscribe( resp => { 
                    const unidades_ref = resp['datos']
                    if (unidades_ref.length < 1 ){
                      console.log('no se puede clonar, no tiene unidades')
                      this.error('el nivel que escogiste para clonar no tiene unidades')
                      return
                    }
                    console.log('unidades_ref', unidades_ref)
                    const xCrear = []
                    for (let n of unidades_ref){
                      let uni = new UnidadModel
                      uni = n
                      uni.UNAME = n.UNAME + '' + this.descripcion;
                      uni.CLONADO = n.CODIGO
                      uni.IDNIVEL = this.nivelId;
                     
                        if (this.unidadesXclonar.length < 1){
                          uni.CODIGO = code;
                        } else {
                          uni.CODIGO = this.sumCodigo(code);
                          code = uni.CODIGO
                        }
                      codes.push("'" + uni.CODIGO + "'");
                      this.codigo_unidades.push("'" + uni.CLONADO + "'")
                      this.unidadesXclonar.push(uni);
                      
                    }

                    console.log('codes', codes)
                    this.verificarCodes(codes);
                    });

                  

  this.nivelClonar = value
}

verificarCodes(codigos ){

// VERIFICO QUE LOS CODIGOS QUE GENERÉ NO VAYAN A ESTAR REPETIDOS EN LA BD
  this.conex.traeDatos('/unidadesIn/' + codigos)
      .subscribe( resp => {
         console.log('resp verificar codes', resp)
         if (resp['datos'].length < 1){
           console.log('estamos bien');
           this.listoParaClonar = 1;
         }else {
           this.error('Hay un error con los codigos, no se puede continuar la clonación')
           this.loading3 = false;
           return;
         }
      }, err => { console.log('err', err)})
}


guardarUnidades(){
  this.loading3 = true
  console.log('guardar', this.unidadesXclonar)
  this.conex.guardarDato('/clonarUnidades', this.unidadesXclonar)
            .subscribe( resp => {
            console.log('guardé unidades', resp)
             // GUARDAR LAS UNIDADES y PASAR A CLONAR LAS OPERACIONES DE CADA UNA
            this.traerUnidadesParaClonar(this.codigo_unidades, this.unidadesXclonar)
          }, err => {
            console.log('errores', err);
            this.loading3 = false;
          })

 
}

traerUnidadesParaClonar(codigo_unidades, unidadesXclonar){
  const pegas = [];
  // TRAIGO TODAS LAS OPERACIONES QUE TIENE EL NIVEL
    this.conex.traeDatos('/operacionesXnivel/' + codigo_unidades)
              .subscribe( resp => {
                console.log('resp operaciones por nivel', resp)
                const opXclonar = resp['datos']
                if (opXclonar.length < 1){
                  this.error('no hay operaciones por clonar');
                  this.loading3 = false;
                  return;
                }

                // VOY ASIGNADO LAS OPERACIONES A CADA UNIDAD SEGUN EL CAMPO CLONADO DE LA UNIDAD
                for (let o of opXclonar){
                  let pega:PegaModel = new PegaModel();

                  const existe = unidadesXclonar.find( (u:any) => u.CLONADO === o.IDUNIDAD)
                  if (existe){
                    console.log('exuste3', existe)
                    pega.IDUNIDAD = existe.CODIGO;
                    pega.IDOPERACION = o.IDOPERACION;
                    pega.META = o.META;
                    pega.REVISOR = o.REVISOR
                    pegas.push(pega);
                  } else {
                    console.log('no existe la unidad para Clonar');
                    this.loading3 = false;
                    return;
                  }

                }

                console.log('pegas por insertar', pegas);
                this.guardarPegas(pegas);

                });
}
guardarPegas(pegas){
  this.conex.guardarDato('/clonarOperaciones', pegas)
            .subscribe( resp => {
                console.log('guardas las pegas', resp);
                this.exito('Registro grabado con exito');
                this.loading3 = false;
            });

}





//  Warnings
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

preguntaClonar() {
  Swal.fire({
    title: '¿Quieres clonar las operaciones',
    text: 'tienes un molde en memoria con las operaciones de otra unidad',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.value) {
      this.clonar = true;
      // this.operaciones = JSON.parse(localStorage.getItem('molde'));
    } else {
      return;
    }
  });
}

}

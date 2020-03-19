import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConectorService } from 'src/app/services/conector.service';

@Component({
  selector: 'app-obra',
  templateUrl: './obra.component.html',
  styleUrls: ['./obra.component.css']
})
export class ObraComponent implements OnInit {
 
  loading = true;
  id;
  inmuebleId          = 'Todos';
  obra: any[]         = [];
  unidades: any[]     = [];
  niveles: any[]      = [];
  inmuebles: any[]    = [];

  unidadesAll: any[]  = [];
  nivelesAll: any[]   = [];

  responsable: any[]  = [];
  configurar          = false;
  editar              = false;

  cifras = {
            inmuebles: 0,
            niveles: 0,
            unidades: 0
  };

  constructor( private conex: ConectorService,
               private route: ActivatedRoute,
               private router: Router ) {

                this.id = this.route.snapshot.paramMap.get('id');

                this.traerObra();
                this.traerUnidades();
                this.traerNiveles();
                this.traerInmuebles();
               }

  ngOnInit() {
  }

  traerObra() {
    this.conex.traeDatos(`/obras/${this.id}`)
              .subscribe( resp => {
                this.obra = resp['datos'][0];
                this.traerResponsable(resp['datos'][0].RESPONSABLE);
              });
  }

  traerUnidades() {
    this.conex.traeDatos(`/unidades/${this.id}`).subscribe( resp => {
      this.unidadesAll = resp['datos'];

      if ( this.unidadesAll.length > 0 ) {
        this.editar = false;
        this.unidades = this.unidadesAll;
        this.cifras.unidades = this.unidadesAll.length;
        localStorage.setItem('unidades', JSON.stringify(this.unidadesAll));
        this.loading = false;
      } else {
        this.editar = true;
        this.loading = false;
      }
    });
  }




  traerNiveles() {
    this.conex.traeDatos(`/tablas/NIVELES`)
              .subscribe( resp => {
                this.nivelesAll = resp['datos'].filter( n => n.IDOBRA === this.id && n.ESTADO === 1);
                this.niveles = this.nivelesAll;
                localStorage.setItem('niveles', JSON.stringify(this.niveles));
                this.cifras.niveles = this.niveles.length;
              });
  }

  traerInmuebles() {
    this.conex.traeDatos(`/tablas/INMUEBLES`)
              .subscribe( resp => {
                this.inmuebles = resp['datos'].filter( i => i.IDOBRA === this.id && i.ESTADO === 1);
                localStorage.setItem('inmuebles', JSON.stringify(this.inmuebles));
                this.cifras.inmuebles = this.inmuebles.length;
                console.log('inmuebles', this.inmuebles);

              });
  }

  traerResponsable(rut) {
    this.conex.traeDatos(`/operarios/${rut}`).subscribe( resp => {
      this.responsable = resp['datos'][0];
    });
  }


  filtrarUnidadesI(valor) {
    let codigo = valor;

    if (valor !== 'Todos' ) {
      codigo = valor.substring(0, 5);
      this.inmuebleId = codigo;
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
      console.log('inmueble codigo', valor.substring(0, 5));

      this.unidades = this.unidadesAll.filter( u => u.IDNIVEL === valor.substring(0, 5));
    }
  }

  abrirUnidad(unidad) {
    console.log(unidad);
    this.router.navigateByUrl(`/registro/${this.id}/${unidad.CODIGO}`);
  }


  irMantenedor(dato) {
    let ruta = '';

    switch (dato) {
      case 'inmuebles':
        ruta = `/inmuebles/${this.id}`;
        break;
      case 'niveles':
        ruta = `/niveles/${this.id}/Todos`;
        break;
      case 'unidades':
        ruta = `/unidades/${this.id}/Todos`;
        break;
      case 'precios':
        ruta = `/precios/${this.id}`;
        break;
      case 'excel':
        ruta = `/importar/${this.id}`;
        break;
      default:
        ruta = 'home'
    }

    this.router.navigateByUrl(ruta);
  }



}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConectorService } from 'src/app/services/conector.service';

@Component({
  selector: 'app-obra',
  templateUrl: './obra.component.html',
  styleUrls: ['./obra.component.css']
})
export class ObraComponent implements OnInit {

  id;
  obra: any[] = [];
  inmubebles: any[] = [];
  niveles: any[] = [];
  unidades: any[] = [];

  responsable: any[] = [];
  configurar = false;
  editar = false;


  constructor( private conex: ConectorService,
               private route: ActivatedRoute,
               private router: Router ) {

                this.id = this.route.snapshot.paramMap.get('id');
                this.traerObra();
               }

  ngOnInit() {
  }

  traerObra() {
    this.conex.traeDatos(`/obras/${this.id}`)
              .subscribe( resp => {
                this.obra = resp['datos'][0];
                this.traerResponsable(resp['datos'][0].RESPONSABLE);
                console.log(this.obra);
              });
  }

  traerResponsable(rut) {
    this.conex.traeDatos(`/operarios/${rut}`).subscribe( resp => {
      this.responsable = resp['datos'][0];
      console.log(this.responsable);
    });
  }

  modalConfigurar() {
    this.configurar = !this.configurar;
  }

  irMantenedor(dato) {
    console.log(dato);
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
      case 'excel':
        ruta = `/importar/${this.id}`;
        break;
      default:
        ruta = 'home'
    }

    this.router.navigateByUrl(ruta);
  }



}

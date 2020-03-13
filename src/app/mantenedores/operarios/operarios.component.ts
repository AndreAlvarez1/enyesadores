import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operarios',
  templateUrl: './operarios.component.html',
  styleUrls: ['./operarios.component.css']
})
export class OperariosComponent implements OnInit {

  operarios: any[] = [];

  constructor( private conex: ConectorService,
               private router: Router) {
    this.traerOperarios();
   }

  ngOnInit() {
  }

  traerOperarios() {
    this.conex.traeDatos('/tablas/OPERARIOS').subscribe( resp => {
      const todos = resp['datos'];
      this.operarios = todos.filter( operario => operario.ESTADO === 1);
    });
  }

  abrir(operario){
    this.router.navigateByUrl(`/operario/${operario}`);
  }

}

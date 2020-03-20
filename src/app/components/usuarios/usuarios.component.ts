import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  loading = false;

  constructor( private conex: ConectorService) {

    this.traerUsuario();
  }

  ngOnInit() {
  }

  traerUsuario() {
    this.loading = true;
    this.conex.traeDatos('/tablas/USUARIOS')
               .subscribe( resp => {
                 console.log(resp);
                 this.usuarios = resp['datos'].filter( u => u.ESTADO === 1);
                 this.loading = false;
              }, (err) => {
                console.log('error');
              });
  }

}

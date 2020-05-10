import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorService } from 'src/app/services/conector.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuario: UsuarioModel;

  constructor( private auth: AuthService,
               private conex: ConectorService,
               private router: Router) {

                this.conex.evaluarUser('Privado');

               }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    this.usuario.email = 'hey@andrealvarez.com';
    this.usuario.acceso = 'Administrador';
  }


  onSubmit(form: NgForm) {

    if (form.invalid) { return; }

    this.auth.nuevoUsuario( this.usuario)
              .subscribe( resp => {
                console.log(resp);
                this.guardarUsuario();
              }, (err) => {
                this.error(err.error.error.message)
              });
  }


  guardarUsuario() {
    this.conex.guardarDato('/usuarios/insert', this.usuario)
              .subscribe( resp => {
                console.log(resp);
                this.exito();
              });
  }


  error(mensaje) {
    Swal.fire({
      title: 'error',
      text: mensaje,
      icon: 'warning'
    });
  }

  exito() {
    Swal.fire({
      title: 'Listo!',
      text: 'Usuario creado con exito',
      icon: 'success'
    });
    this.router.navigateByUrl('/usuarios');
  }

}

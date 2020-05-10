import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConectorService } from 'src/app/services/conector.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario = new UsuarioModel();
  recordarme = true;


  constructor( private auth: AuthService,
               private router: Router,
               private conex: ConectorService) {
  }

  ngOnInit() {

    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
    }

    this.auth.logout();
  }

  login( form: NgForm) {
    if ( form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Verificando datos'
    });
    Swal.showLoading();

    this.auth.login(this.usuario)
              .subscribe( resp => {
                if (this.recordarme) {
                  localStorage.setItem('email', this.usuario.email);
                  localStorage.setItem('usuario', this.usuario.email);
                }
                this.traerUsuario();
              }, (err) => {
                Swal.close();
                this.error('Datos no coinciden', 'Intenalo de nuevo' + err.error.error.message);
              });
  }

  traerUsuario() {
    console.log('1-usuario.email', this.usuario.email);
    this.conex.traeDatos('/tablas/USUARIOS')
               .subscribe( resp => {
                const user = resp['datos'].filter( p => p.EMAIL === this.usuario.email);
                localStorage.setItem('user', JSON.stringify(user[0]));
                Swal.close();
                this.router.navigateByUrl('/home');
              }, (err) => {
                this.error('Error conectandose al Servidor', err.errror)
              });
  }

  error(titulo, mensaje) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning'
    });
  }

}

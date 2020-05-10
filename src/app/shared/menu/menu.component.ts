import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user = {    ID: '',
              NOMBRE: '',
              APELLIDO: '',
              EMAIL: '',
              RUT: '',
              ACCESO: '',
          }     

  constructor(private auth: AuthService,
              private router: Router) {

              if (!localStorage.getItem('user')) {
                this.salir();
              }

              this.user = JSON.parse(localStorage.getItem('user'));
              console.log('user', this.user);
               }

  ngOnInit() {
  }

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}

import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ReturnStatement } from '@angular/compiler';



@Injectable({
  providedIn: 'root'
})
export class ConectorService {


  public url = 'http://yeso.clubgournet.cl';
  public port = 8080;
  
  // Local
  // public url = 'http://localhost';

  constructor(private http: HttpClient,
              private auth: AuthService,
              private router: Router) { }


  traeDatos( ruta ) {
    return this.http.get( this.url + ':' + this.port + ruta );
 }


  guardarDato(ruta, body) {
    return this.http.post( this.url + ':' + this.port + ruta , body );

  }

  evaluarUser(acceso) {
    if (!localStorage.getItem('user')) {
      this.auth.logout();
      this.router.navigateByUrl('/login');
      return;
    }
    if (acceso === 'Privado') {
      if ( JSON.parse(localStorage.getItem('user')).ACCESO !== 'Administrador') {
         this.router.navigateByUrl('/home');
      }
    }


  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apiKey = 'AIzaSyBHC6PZ1zYWFzJs91aSy3JDQxe4UIzNDPg';
  userToken: string;


  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor( private http: HttpClient) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
  }

  login( usuario: UsuarioModel) {

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };
    return this.http.post( `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`, authData )
                    .pipe(
                      map( resp => {
                        this.guardarToken( resp['idToken']);
                        return resp;
                      })
                    );
   }

  nuevoUsuario( usuario: UsuarioModel ) {

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}/accounts:signUp?key=${this.apiKey}`, authData)
                     .pipe(
                            map( resp => {
                              this.guardarToken( resp['idToken']);
                              return resp;
                            })
                     );

  }


  resetPass(correo) {
    const payload = {
                    requestType: 'PASSWORD_RESET',
                    email: correo
                    };
    return this.http.post( `${this.url}/accounts:sendOobCode?key=${this.apiKey}`, payload )
                    .pipe(
                      map( resp => {
                        return resp;
                      })
                    );
  }

// ====================================//
// ====================================//
// =========== AUTENTICADO ============//
// ====================================//
// ====================================//

private guardarToken(idToken: string) {

  this.userToken = idToken;
  localStorage.setItem('token', idToken);

  const hoy = new Date();
  hoy.setSeconds(3600);
  localStorage.setItem('expira', hoy.getTime().toString());
}

leerToken() {
  if (localStorage.getItem('item')) {
    this.userToken = localStorage.getItem('item');
  } else {
    this.userToken = '';
  }
  return this.userToken;
}

estaAutenticado(): boolean {

  if ( this.userToken.length > 2 ) {
    return true;
  }

  const expira = Number(localStorage.getItem('expira'));

  const expiraDate = new Date();
  expiraDate.setTime(expira);

  if ( expiraDate > new Date() ) {
    console.log('está autenticado');
    return true;

  } else {
    console.log('no está autenticado');
    return false;

  }
}








}

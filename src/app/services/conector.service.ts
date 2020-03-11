import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ConectorService {


  public url = 'http://localhost';
  public port = 3060;

  constructor(private http: HttpClient) { }


  traeDatos( ruta ) {
    return this.http.get( this.url + ':' + this.port + ruta );
 }


  guardarDato(ruta, body) {
    return this.http.post( this.url + ':' + this.port + ruta , body );

  }


}

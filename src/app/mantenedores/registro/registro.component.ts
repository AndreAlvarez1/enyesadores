import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroModel } from 'src/app/models/registro.model';
import Swal from 'sweetalert2';
import { PegaModel } from 'src/app/models/pega.model';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  obraId = '';
  unidadId = '';
  unidad = {};
  pegas: any[] = [];
  operarios: any[] = [];
  historial: any[] = [];
  usuario = '16.655.789-5';
  costo;
  costoUnidad;

  cuadrilla: any[] = [];
  operacion;
  cantidad = 0;
  ingresarPega = false;

  cuadrillaMemoria = false;

  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router) {

              this.obraId = this.route.snapshot.paramMap.get('obra');
              this.unidadId = this.route.snapshot.paramMap.get('unidad');
              this.traerUnidad();
              this.refrescarData();
              this.traerOperarios();

              if (localStorage.getItem('cuadrilla')) {
                this.cuadrillaMemoria = true;
              }
  }

  ngOnInit() {
  }

  traerUnidad() {
    this.conex.traeDatos(`/unidad/${this.obraId}/${this.unidadId}`)
              .subscribe( resp => {
                          this.unidad = resp['datos'][0];
                          console.log('esta unidad', this.unidad);
              });
  }

  refrescarData(){
    this.traerPegas();
    this.traerHistorial();
  }

  traerPegas() {
    this.conex.traeDatos(`/operaxuni/${this.obraId}`)
              .subscribe( resp => {
                          this.pegas = resp['datos'].filter( p => p.IDUNIDAD === this.unidadId);
                          console.log('pegas', this.pegas);
                          this.costoUnidad = this.calcularCosto(this.pegas, 'pegas');

            });
  }

  traerOperarios() {
    this.conex.traeDatos('/tablas/OPERARIOS').subscribe( resp => { this.operarios = resp['datos']; console.log(this.operarios)});
  }

  traerHistorial() {
    this.conex.traeDatos(`/trabajosXUnidad/${this.unidadId}`)
              .subscribe( resp => {
                this.historial = resp['datos'];
                console.log('historial', this.historial);
                this.costo = this.calcularCosto(this.historial, 'historial');
              });
  }

  calcularCosto(pegas, origen) {
    let suma = 0;
    if (origen === 'historial') {
      for (const pega of pegas ) {
        suma += pega.TOTAL;
      }
    } else {
      for (const pega of pegas ) {
        suma += pega.PRECIO * pega.META;
      }
    }
    return suma;
  }

  selectPega(pega) {
    this.operacion = pega;
    console.log('pega', this.operacion);
    if ( this.operacion.COMPLETADO === 1 ) {
      this.ok();
      return;
    }
    this.cantidad = this.operacion.META - this.operacion.PROGRESO;
    this.ingresarPega = true;
  }


  traerCuadrilla() {
   this.cuadrilla = JSON.parse(localStorage.getItem('cuadrilla'));
  }


  escogerOperario(valor) {
    console.log('operario', valor);
    const operario = {
                      rut: valor.RUT,
                      nombre: valor.NOMBRE,
                      apellido: valor.APELLIDO,
                      apellidomat: valor.APELLIDOMAT,
                      porcentaje: 100
    };

    // Reviso si ya agregué a ese operario, para no ponerlo dos veces
    if (this.operarioRepetido(valor) ) {
      this.error('Ese operario ya lo agregaste a la cuadrilla');
      return;
    }

    this.cuadrilla.push(operario);
    this.dividirPorcentaje();
  }


  operarioRepetido(operario) {
    const resultado = this.cuadrilla.filter( o => o.rut === operario.RUT);
    if (resultado.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  guardarAvance() {

    if ( this.cantidad < 1 || this.cantidad > (this.operacion.META - this.operacion.PROGRESO) ){
      this.error('Debes ingresar una cantidad de avance mayor a 1 e inferior al la cantidad pendiente ');
      return;
    }

    if (this.cuadrilla.length < 1) {
      this.error('Debes ingresar por lo menos un operario');
      return;
    }

    if ( !this.verificarPorcentaje()) {
      this.error('La suma de porcentajes debe ser 100');
      return;
    }

    console.log('cuadrilla', this.cuadrilla);
    localStorage.setItem('cuadrilla', JSON.stringify(this.cuadrilla));
    this.armarPaquete();
  }

  

  dividirPorcentaje() {
    const total = this.cuadrilla.length;
    for ( const persona of this.cuadrilla) {
        persona.porcentaje = Math.ceil(100 / total);

    }
  }

  verificarPorcentaje() {
    let porcentaje = 0;

    for ( const persona of this.cuadrilla) {
      porcentaje += persona.porcentaje;
    }
    if (porcentaje !== 100) {
      console.log('false', porcentaje);
      return false;
    } else {
      console.log('true', porcentaje);
      return true;
    }
  }

  borrarOperario(persona, posicion) {
    console.log('persona', persona);
    console.log('posicion', posicion);
    this.cuadrilla.splice(posicion, 1);
    this.dividirPorcentaje();

  }

  armarPaquete() {
    const paquete: any[] = [];

    for (const persona of this.cuadrilla) {
      const registro = new RegistroModel();
      registro.RUT = persona.rut;
      registro.IDOPERACION = this.operacion.IDOPERACION;
      registro.IDUNIDAD = this.unidadId;
      registro.PORCENTAJE = persona.porcentaje;
      registro.CANTIDAD = this.cantidad * persona.porcentaje / 100;
      registro.PRECIO = this.operacion.PRECIO;
      registro.TOTAL = this.operacion.PRECIO * (this.cantidad * persona.porcentaje / 100);
      registro.REVISOR = this.usuario;

      paquete.push(registro);
    }

    console.log('Paquete', paquete);
    this.conex.guardarDato('/trabajo', paquete)
              .subscribe( resp => {
                console.log(resp);
                this.actualizarPega();

              });
  }

  actualizarPega() {
    let pega = new PegaModel();
    pega = this.operacion;
    pega.PROGRESO += this.cantidad;
    pega.REVISOR = this.usuario;
    pega.ACTUALIZADO = new Date();

    if (pega.PROGRESO === pega.META ) {
      pega.COMPLETADO = 1;
    }

    console.log('acaa', pega);
    this.conex.guardarDato('/operaxuni/update', this.operacion)
              .subscribe( resp => {
                  console.log(resp);
                  this.ingresarPega = false;
                  this.refrescarData();
                });

  }

  volver() {
    this.router.navigateByUrl(`/obra/${this.obraId}`);
  }


// WARNINGS

error(mensaje) {
  Swal.fire({
    text: mensaje,
    icon: 'warning',
    confirmButtonText: 'Ok'
  });
}

ok() {
  Swal.fire({
    text: 'Esta operación ya fue completada',
    icon: 'success',
    confirmButtonText: 'Ok'
  });
}



}

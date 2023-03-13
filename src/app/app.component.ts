import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const pixel = 4;

enum Estado {
  VIVO,
  MUERTO,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnInit {
  //
  universo_ancho_cuadricula = 200;
  canvas: any;
  context: CanvasRenderingContext2D | undefined;
  universo: Estado[] = [];
  ciclos:number = 0;

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.universo_ancho_cuadricula * pixel;
    this.canvas.height = this.universo_ancho_cuadricula * pixel;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.initialState();

    console.log({ univers: this.universo });
    this.draw();
  }

  ngOnInit(): void {
    setInterval(() => {
      this.updateUniverso();
      this.draw();
      console.log(`Ciclo # ${this.ciclos++}`);
    }, 200);
  }

  private initialState() {
    this.universo = [];

    const celulas_totales =
      this.universo_ancho_cuadricula * this.universo_ancho_cuadricula;

    for (let i = 0; i < celulas_totales; i++) {
      if (Math.floor(Math.random() * 2) == 1) {
        this.universo.push(Estado.MUERTO);
      } else {
        this.universo.push(Estado.VIVO);
      }
    }
  }

  private updateUniverso() {
    let universo_nuevo: Estado[] = [];

    for (let i = 0; i < this.universo.length; i++) {
      universo_nuevo.push(this.EvaluarReglasDeVida(i));
    }

    this.universo = universo_nuevo;
  }

  private EvaluarReglasDeVida(index_celula: number): Estado {
    let celulas_vecinas: Estado[] = [],
      celulda = this.universo[index_celula];

    // vecina_up
    if (index_celula - this.universo_ancho_cuadricula > 0) {
      celulas_vecinas.push(
        this.universo[index_celula - this.universo_ancho_cuadricula]
      );
    }

    // vecina_up_izq
    if (index_celula - this.universo_ancho_cuadricula - 1 > 0) {
      celulas_vecinas.push(
        this.universo[index_celula - this.universo_ancho_cuadricula - 1]
      );
    }

    // vecina_up_der
    if (index_celula - this.universo_ancho_cuadricula + 1 > 0) {
      celulas_vecinas.push(
        this.universo[index_celula - this.universo_ancho_cuadricula + 1]
      );
    }

    // vecina_down
    if (index_celula + this.universo_ancho_cuadricula > 0) {
      celulas_vecinas.push(
        this.universo[index_celula + this.universo_ancho_cuadricula]
      );
    }

    // vecina_down_izq
    if (index_celula + this.universo_ancho_cuadricula - 1 > 0) {
      celulas_vecinas.push(
        this.universo[index_celula + this.universo_ancho_cuadricula - 1]
      );
    }

    // vecina_down_der
    if (index_celula + this.universo_ancho_cuadricula + 1 > 0) {
      celulas_vecinas.push(
        this.universo[index_celula + this.universo_ancho_cuadricula + 1]
      );
    }

    // vecina_izq
    if (index_celula - 1 > 0) {
      celulas_vecinas.push(index_celula - 1);
    }
    // vecina_der
    if (index_celula + 1 > 0) {
      celulas_vecinas.push(index_celula + 1);
    }

    let count_vivas = celulas_vecinas.filter((c) => c == Estado.VIVO).length;

    // - Si una célula está viva y tiene dos o tres vecinas vivas, sobrevive.
    if (celulda == Estado.VIVO && (count_vivas == 2 || count_vivas == 3)) {
      return Estado.VIVO;
    }
    // - Si una célula está muerta y tiene tres vecinas vivas, nace.
    else if (celulda == Estado.MUERTO && count_vivas == 3) {
      return Estado.VIVO;
    }
    // - Si una célula está viva y tiene más de tres vecinas vivas, muere.
    else if (celulda == Estado.VIVO && count_vivas > 3) {
      return Estado.MUERTO;
    } else {
      return Estado.MUERTO;
    }
  }

  private draw() {
    let //
      column = 0, // ++ cada iteracion, se resetea cuando row aumenta
      row = 0; // ++ index MOD ancho_pixel == 0
    for (let index = 0; index < this.universo.length; index++) {
      const celula = this.universo[index];
      this.context!.strokeStyle = 'black'; //CELULA VIVA
      this.context!.fillStyle = celula == Estado.VIVO ? 'green' : 'red'; //CELULA VIVA
      this.context!.beginPath();

      row = Math.trunc(index / this.universo_ancho_cuadricula);
      column = index - this.universo_ancho_cuadricula * row;

      this.context!.rect(column * pixel, row * pixel, pixel, pixel);
      this.context!.stroke();
      this.context!.fill();
    }
  }
}

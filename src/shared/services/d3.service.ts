import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class D3Service {

  constructor() { }

  translate(x: number, y: number): string {
    return `translate(${x}, ${y})`;
  }

}

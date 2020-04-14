import { Injectable, Inject } from '@angular/core';
@Injectable()
export class LineService {

  constructor(
    @Inject('config') private config,
  ) { }


  showConfig() {
    console.log(this.config);
  }

}

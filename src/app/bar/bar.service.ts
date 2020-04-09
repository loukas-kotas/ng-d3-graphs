import { Injectable } from '@angular/core';
import { D3Service } from 'src/shared/services/d3.service';

@Injectable()
export class BarService {

  constructor(
    private d3Service: D3Service,
  ) { }

}

import { Injectable } from '@angular/core';
import { PieD3, Slice, Label } from './pie.component';
import { GraphOptions } from 'src/shared/models/graph-options.interface';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class PieService {

  constructor() { }

  factoryPieGraph(data: any[], labels: string[], options: GraphOptions, radius: number): PieD3 {
    return {slices: this.factoryPath(data, labels, radius)};
  }


  factoryPath(data: any[], labels: string[], radius: number): any {
    const pieData = this.factoryPieData();
    const pie = pieData(d3.entries(data)) as Array<any>;
    let i = 0;
    pie.forEach(slice => {
      slice.path = this.factoryArc(radius)(slice);
      slice.label = { text: labels[i], x: this.factoryArc(radius).centroid(slice)[0], y: this.factoryArc(radius).centroid(slice)[1] };
      i++;
    });
    return pie;
  }


  factoryPieData(): any {
    return d3.pie<any>()
    .value((d) => d.value );
  }

  factoryArc(radius: number): any {
    return d3.arc()
    .innerRadius(0)
    .outerRadius(radius);
  }


}

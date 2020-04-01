import { Component, OnInit } from '@angular/core';
import { Line } from './line/line.component';
import { Pie } from './pie/pie.component';
import { Bar } from './bar/bar.component';

import * as areaData from '../shared/data/area-small';
import * as bandData from '../shared/data/band';
import { GraphOptions } from 'src/shared/models/graph-options.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-d3';

  line: Line;
  pie: Pie;
  bar: Bar;
  area: any;
  band: any;

  ngOnInit() {
    this.line = this.getLineData();
    this.pie = this.getPieData();
    this.bar = this.getBarData();
    this.area = this.getAreaData();
    this.band = this.getBandData();
  }

  getLineData(): Line {
    return {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
      data: [65, 59, 80, 81, 56, 55, 40, 10, 25]
    };
  }

  getPieData(): Pie {
    return {
      labels: ['A', 'B', 'C', 'D'],
      data: [100, 200, 300, 100],
      options: { width: 400, height: 400 },
      backgroundColors: ['black', 'red', 'yellow', 'green'],
    };
  }

  getBarData(): Bar {
    return {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      data: [900, 100, 200, 300, 400, 500, 600, 500, 250],
      options: { width: 960, height: 500, margin: { top: 50, right: 50, bottom: 50, left: 50 } }
    };
  }

  getAreaData(): any {
    const labels = areaData.data.map(d => d.date);
    const data = areaData.data.map(d => d.value);
    return {
      labels,
      data
    };
  }

  getBandData(): any {
    const labels = bandData.data.map(d => d.date);
    const data = bandData.data.map(d => { return {high: d.high, low: d.low} });
    const options: GraphOptions = {width: 300, height: 300, yAxisLabel: '°F'};
    return {
      labels,
      data,
      options
    };
  }


}

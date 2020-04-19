import { Component, OnInit } from '@angular/core';
import { GraphOptions } from 'ng-d3-graphs/shared/models/graph-options.interface';

import { BandOptions } from '../components/band/band.component';
import { BarOptions } from '../components/bar/bar.component';
import { MultilineOptions } from '../components/multiline/multiline.component';

import * as areaData from './shared/data/area-small';
import * as bandData from './shared/data/band';
import * as barData from './shared/data/bar';
import * as lineData from './shared/data/line';
import * as multilineData from './shared/data/multiline';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng-d3-graphs';

  line: any;
  pie: any;
  bar: any;
  area: any;
  band: any;
  multiline: any;

  ngOnInit() {
    this.line = this.getLineData();
    this.pie = this.getPieData();
    this.bar = this.getBarData();
    // TODO: comment in when issue #96 is done.
    // this.area = this.getAreaData();
    this.band = this.getBandData();
    this.multiline = this.getMultilineData();
  }

  getLineData(): any {
    return {
      labels: lineData.data.map((d) => d.date),
      data: lineData.data.map((d) => d.value),
      options: {
        height: '300',
        gridTicks: 10,
        xAxisLabel: 'Date (days)',
        yAxisLabel: 'Value (Watt)',
      },
    };
  }

  getPieData(): any {
    return {
      labels: ['A', 'B', 'C', 'D'],
      data: [100, 200, 300, 100],
      options: { width: 300, height: 300, xAxisLabel: 'Pie Axis' },
      backgroundColors: ['black', 'red', 'yellow', 'green'],
    };
  }

  getBarData(): any {
    const labels = barData.data.map((d) => d.Run);
    const data = barData.data.map((d) => d.Speed);
    const options: BarOptions = { height: 300, gridTicks: 0, xAxisLabel: 'bar-x', yAxisLabel: 'bar-y' };

    return {
      labels,
      data,
      options,
    };
  }

  // TODO: comment in when issue #96 is done.
  // getAreaData(): any {
  //   const labels = areaData.data.map(d => d.date);
  //   const data = areaData.data.map(d => d.value);
  //   return {
  //     labels,
  //     data
  //   };
  // }

  getBandData(): any {
    const labels = bandData.data.map((d) => d.date);
    const data = bandData.data.map((d) => {
      return { high: d.high, low: d.low };
    });
    const options: BandOptions = { height: 300, yAxisLabel: 'y-band', xAxisLabel: 'x-band', gridTicks: 0 };
    return {
      labels,
      data,
      options,
    };
  }

  getMultilineData(): any {
    const labels = multilineData.data.dates;
    const data = multilineData.data.series;
    const options: MultilineOptions = {
      height: 300,
      yAxisLabel: multilineData.data.y,
      gridTicks: 10,
      xAxisLabel: 'Time',
    };
    return {
      labels,
      data,
      options,
    };
  }
}

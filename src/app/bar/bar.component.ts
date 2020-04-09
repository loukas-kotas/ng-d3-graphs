import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GraphOptions } from 'src/shared/models/graph-options.interface';
import { D3Service } from 'src/shared/services/d3.service';
import * as d3 from 'd3';
import { Axis } from 'src/shared/models/axis.interface';
import { BarService } from './bar.service';

export interface Bar {
  labels: any[];
  data: any[];
  options?: any;
}
export interface BarD3 {
  xAxis: Axis[];
  yAxis: Axis[];
  xAxisPath: string;
  yAxisPath: string;
  rectanglesData: Rectangle[];
}

export interface Rectangle {
  x: number;
  y: number;
  height: number;
  width: number;
}
@Component({
  selector: 'ng-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() labels: any[] = [];
  @Input() options?: GraphOptions = {width: 600, height: 300, margin: {top: 50, right: 50, bottom: 50, left: 50}};
  graph: BarD3 = {xAxis: [], yAxis: [], xAxisPath: '', yAxisPath: '', rectanglesData: []};

  constructor(
  ) { }

  ngOnInit() {
    const options = {
      width: this.options.width - this.options.margin.right - this.options.margin.left,
      height: this.options.height - this.options.margin.top,
      margin: this.options.margin
    };

  }

}

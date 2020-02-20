import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { LineService } from './services/line.service';
import { fromEvent, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';

export interface Line {
  labels: any[];
  data: any[];
  options?: any;
}

export interface LineD3 {
  xAxis: Axis[];
  yAxis: Axis[];
  path: any;
  circleData: CircleData[];
}
export interface CircleData {
  cx: any;
  cy: any;
  r?: number;
}
export interface Axis {
  x?: number;
  y?: number;
  label: string;
}

@Component({
  selector: 'ng-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineComponent implements OnInit {


  @Input() data: any[] = [];
  @Input() labels: string[] = [];
  @Input() options?: any = {width: 879, height: 804, margin: {top: 50, right: 50, bottom: 50, left: 50}};

  graph: LineD3 = {xAxis: [], yAxis: [], path: '', circleData: []};

  @ViewChild('svg', {static: false}) svg: ElementRef;

  constructor(
    private lineService: LineService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    this.generateGraph();


    fromEvent(window, 'resize')
    .pipe(
      debounce(() => interval(300))
    )
    .subscribe(d => {
      console.log(window.innerWidth);
      this.options.width = window.innerWidth;
      this.options.height = window.innerHeight;
      this.generateGraph();

    });

    // Call the resize function

  }

  private generateGraph() {
    const options = { width: this.options.width - 200, height: this.options.height - 100, margin: this.options.margin };
    this.graph = this.lineService.factoryLineGraph(this.labels, this.data, options);
    const pathData = [];
    for (let index = 0; index < this.data.length; index++) {
      pathData.push({
        x: this.labels[index],
        y: this.data[index]
      });
    }
    // append line. D3 returns line generator, not path data.
    d3.select('#svg-container')
      .append('path')
      .attr('class', 'line') // Assign a class for styling
      .data([pathData])
      .attr('d', this.graph.path);
    return options;
  }

  translate(x, y) {
    return `translate(${x}, ${y})`;
  }

  itemCx(item) {
    return `${item.cx}`;
  }

  itemCy(item) {
    return `${item.cy}`;
  }

  itemR(item) {
    return `${item.r}`;
  }

}

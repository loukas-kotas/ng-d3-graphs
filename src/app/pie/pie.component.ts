import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, AfterViewInit, AfterContentInit } from '@angular/core';
import { GraphOptions } from 'src/shared/models/graph-options.interface';
import { D3Service } from 'src/shared/services/d3.service';
import { PieService } from './pie.service';
import * as d3 from 'd3';

export interface Pie {
  labels: string[];
  data: any[];
  backgroundColors?: string[];
  options: GraphOptions;
}

export interface Label {
  text: string;
  x: number;
  y: number;
}

export interface Slice {
  path: any;
  label: Label;
}

export interface PieD3 {
  slices: Slice[];
}

@Component({
  selector: 'ng-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieComponent implements OnInit, AfterContentInit {

  @Input() labels: string[];
  @Input() data: any[] = [];
  @Input() backgroundColors: string[] = [];
  @Input() radius: number = 100;
  @Input() options: GraphOptions  = {width: 300, height: 300};
  color = this.interpolateColor(); // range [0,1] -> builtin range of colors.
  graph: PieD3 = {slices: []};
  defaultSliceColor = 'lightblue';

  constructor(
    private pieService: PieService,
    private d3Service: D3Service,
  ) { }

  ngOnInit() {
    const options = this.options;
    this.graph = this.pieService.factoryPieGraph(this.data, this.labels, options, this.radius);
  }

  ngAfterContentInit() {
    if (!this.backgroundColors) {
      this.backgroundColors = this.setDefaultSliceColor();
    }
  }

  private setDefaultSliceColor(): string[] {
    const backgroundColors = [];
    for (let i = 0; i < this.data.length; i++) {
      backgroundColors.push(this.defaultSliceColor);
    }
    return backgroundColors;
  }

  translate(x, y): string {
    return this.d3Service.translate(x, y);
  }

  /**
   * range [0, 1]
   */
  interpolateColor(): any {
    return d3.interpolateCool;
  }

}

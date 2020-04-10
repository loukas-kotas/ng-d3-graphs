import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import * as d3 from 'd3';
import { GraphOptions } from 'src/shared/models/graph-options.interface';

@Component({
  selector: 'ng-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineComponent implements OnInit {


  @Input() data: any[] = [];
  @Input() labels: any[] = [];
  @Input() options?: GraphOptions = {width: 879, height: 804, margin: {top: 50, right: 50, bottom: 50, left: 50}};

  constructor() {}

  ngOnInit() {
    const options = { width: this.options.width - 200, height: this.options.height - 100, margin: this.options.margin };
  }

}

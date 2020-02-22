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
    private barService: BarService,
    private d3Service: D3Service,
  ) { }

  ngOnInit() {
    const options = {
      width: this.options.width - this.options.margin.right - this.options.margin.left,
      height: this.options.height - this.options.margin.top,
      margin: this.options.margin
    };

    this.graph = this.barService.factoryBarGraph(this.data, this.labels, options);



    // TODO: Use d3.js axis for band till axis can be generated with conventional d3 line path gneratatos
    const scaleX = this.d3Service.scaleBandX(this.labels, options.width);
    const axisX = d3.axisBottom(scaleX);
    d3.select('#bar-x-axis')
      .call(axisX);


    const scaleY = this.d3Service.scaleLinearYRangeRound(this.data, options.height);
    const axisY = d3.axisLeft(scaleY);
    d3.select('#bar-y-axis')
      .call(axisY);


  }

  translate(x: number, y: number) {
    return this.d3Service.translate(x, y);
  }

  getMockData() {
    var svg = d3.select("#svg-example"),
    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.1);

    var y = d3.scaleLinear()
      .rangeRound([height, 0]);


    const data = [
      {
        "Expt": 1,
        "Run": 1,
        "Speed": 850
      },
      {
        "Expt": 1,
        "Run": 2,
        "Speed": 740
      },
      {
        "Expt": 1,
        "Run": 3,
        "Speed": 900
      },
      {
        "Expt": 1,
        "Run": 4,
        "Speed": 1070
      },
      {
        "Expt": 1,
        "Run": 5,
        "Speed": 930
      },
      {
        "Expt": 1,
        "Run": 6,
        "Speed": 850
      },
      {
        "Expt": 1,
        "Run": 7,
        "Speed": 950
      },
      {
        "Expt": 1,
        "Run": 8,
        "Speed": 980
      },
      {
        "Expt": 1,
        "Run": 9,
        "Speed": 980
      },
      {
        "Expt": 1,
        "Run": 10,
        "Speed": 880
      },
      {
        "Expt": 1,
        "Run": 11,
        "Speed": 1000
      },
      {
        "Expt": 1,
        "Run": 12,
        "Speed": 980
      },
      {
        "Expt": 1,
        "Run": 13,
        "Speed": 930
      },
      {
        "Expt": 1,
        "Run": 14,
        "Speed": 650
      },
      {
        "Expt": 1,
        "Run": 15,
        "Speed": 760
      },
      {
        "Expt": 1,
        "Run": 16,
        "Speed": 810
      },
      {
        "Expt": 1,
        "Run": 17,
        "Speed": 1000
      },
      {
        "Expt": 1,
        "Run": 18,
        "Speed": 1000
      },
      {
        "Expt": 1,
        "Run": 19,
        "Speed": 960
      },
      {
        "Expt": 1,
        "Run": 20,
        "Speed": 960
      }
    ];

      x.domain(data.map(function (d) {
          console.log(d.Run);
          return String(d.Run);
        }));

      y.domain([0, d3.max(data, function (d) {
          console.log(d.Speed);
          return Number(d.Speed);
          })]);

      g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

      g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Speed");

      g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(String(d.Run));
      })
      .attr("y", function (d) {
        return y(Number(d.Speed));
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(Number(d.Speed));
      });
  }

}

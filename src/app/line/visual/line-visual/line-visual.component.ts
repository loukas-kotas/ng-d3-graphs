import { Component, OnInit } from '@angular/core';
import { LineService } from '../../services/line.service';


export class LineVisualComponent {

  public width: number;
  public height: number;

  constructor(
    private lineService: LineService,
    private options: any,
  ) {
    this.width = this.lineService.getDim(this.options.margin).width;
    this.height = this.lineService.getDim(this.options.margin).height;
  }

}

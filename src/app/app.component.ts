import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-d3';

  lineData: number[] = [];

  ngOnInit() {
    this.lineData = this.getLineData();
  }

  getLineData(): number[] {
    const N = 100;
    const dataset = [];
    for (let index = 0; index < N; index++) {
      dataset.push({y: Math.random() * 1 });
    }
    return dataset;
  }

}

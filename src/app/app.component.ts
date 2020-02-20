import { Component, OnInit } from '@angular/core';
import { Line } from './line/line.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-d3';

  line: Line;

  ngOnInit() {
    this.line = this.getLineData();
  }

  getLineData(): Line {
    return {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
      data: [65, 59, 80, 81, 56, 55, 40, 10, 25]
    }
  }

}

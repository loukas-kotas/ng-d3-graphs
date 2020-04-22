# Pie

Import the **PieModule** from **ng-d3-graphs**

```javascript
import { PieModule } from 'ng-d3-graphs';
//...
@NgModule({
imports: [
  PieModule,
]});
```

## Properties

| Name             |   Type   |       Default |                      Description |
| ---------------- | :------: | ------------: | -------------------------------: |
| labels           | string[] |            [] |                 Array of labels. |
| data             | string[] |            [] |                 Array of values. |
| backgroundColors |   any    | d3.schemeSet2 | sections background color range. |
| radius           |  number  |           100 |                   radius of pie. |
| options          |  any[]   |            [] |                 Array of values. |

### options

| Name       |                            Type                             |                                    Default |                      Description |
| ---------- | :---------------------------------------------------------: | -----------------------------------------: | -------------------------------: |
| width      |                           number                            |                                        879 |               width of svg graph |
| height     |                           number                            |                                        804 |              height of svg graph |
| margin     | {top: number, right: number:, bottom: number, left: number} | {top: 50, right: 50, bottom: 50, left: 50} | Object containing the svg margin |
| yAxisLabel |                           number                            |                                         '' |                  label of y axis |
| xAxisLabel |                           number                            |                                         '' |                  label of x axis |
| gridTicks  |                           number                            |                                          0 |              ticks of grid lines |

## Example

```javascript
const labels = ['A', 'B', 'C', 'D'];
const data = [100, 200, 300, 100];
const backgroundColors = ['black', 'red', 'yellow', 'green'];
```

```html
<ng-pie [labels]="labels" [data]="data"></ng-pie>
```

<img src="./images/ng-d3-graphs-pie.png" style="width:50%;height:400px;">

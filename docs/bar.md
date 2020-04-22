# Bar

Import the **BarModule** from **ng-d3-graphs**

```javascript
import { BarModule } from 'ng-d3-graphs';
//...
@NgModule({
imports: [
  BarModule,
]});
```

## Properties

| Name    |   Type   | Default |      Description |
| ------- | :------: | ------: | ---------------: |
| labels  | string[] |      [] | Array of labels. |
| data    | string[] |      [] | Array of values. |
| options |  any[]   |      [] | Array of values. |

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
const labels = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '50',
];
const data = [
  '850',
  '740',
  '900',
  '1070',
  '930',
  '850',
  '950',
  '980',
  '980',
  '880',
  '1000',
  '980',
  '930',
  '650',
  '760',
  '810',
  '1000',
  '1000',
  '960',
  '960',
  '2000',
];
```

```html
<ng-bar [labels]="labels" [data]="data"></ng-bar>
```

<img src="./images/ng-d3-graphs-bar.png" style="width:100%;height:400px;">

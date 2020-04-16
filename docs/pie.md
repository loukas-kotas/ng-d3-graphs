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

| Name        | Type           | Default  | Description |
| ------------- |:-------------:| -----:| -------------:|
| labels        | string[]        | [] | Array of labels. |
| data        | string[]        | [] | Array of values. |
| backgroundColors        | any        | d3.schemeSet2 | sections background color range.  |


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

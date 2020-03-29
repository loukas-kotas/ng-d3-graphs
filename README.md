# NgD3

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

## Git Workflow

* Install [Commitizen](https://marketplace.visualstudio.com/items?itemName=axetroy.vscode-changelog-generator) globally
* Install vscode plugin [changelog-generator](https://marketplace.visualstudio.com/items?itemName=axetroy.vscode-changelog-generator)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## How to Migrate d3.js graph into a component

### Line


1. Add an SVG to draw our line chart on --> create a graph component with an svg element in it
2. Use the D3 standard margin convetion --> 
3. Create an x axis --> create an axis component. Get direction as input 'horizontal'.
4. Create a y axis --> use axis component. direction 'vertical'
5. Create an x scale --> 
6. Create a y scale
7. Create a line generator
8. Create a random dataset
9. Create a path object for the line
10. Bind the data to the path object
11. Call the line generator on the data-bound path object
12. Add circles to show each datapoint
13. Add some basic styling to the chart so its easier on the eyes

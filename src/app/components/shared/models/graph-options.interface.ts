export interface GraphOptions {
  width?: number;
  height?: number;
  margin?: Margin;
  yAxisLabel?: string;
  xAxisLabel?: string;
  xAxisTicks?: number;
  timeParser?: string;
  timeFormat?: string;
}

export interface Margin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

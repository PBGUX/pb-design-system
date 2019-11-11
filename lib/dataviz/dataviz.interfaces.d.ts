export interface PbdsDatavizPie {
    label: string;
    value: number;
}
export interface PbdsDatavizBar {
    label: string;
    value: number;
}
export interface PbdsDatavizGauge {
    minvalue: number;
    maxvalue: number;
    value: number;
}
export interface PbdsDatavizSparkline {
    [index: number]: number;
    length: number;
}
export interface PbdsDatavizLine {
    dates: Array<string>;
    series: Array<PbdsDatavizLineSeries>;
}
export interface PbdsDatavizLineSeries {
    label: string;
    values: Array<number>;
}
export interface PbdsDatavizBarStacked {
    key: string;
    [propName: string]: any;
}
export interface PbdsDatavizMapData {
    label: string;
    longitude: number;
    latitude: number;
    value: number | string;
    [propName: string]: any;
}
export interface PbdsDatavizChoroplethMapData {
    id: string | number;
    value: number;
    label?: string;
    [propName: string]: any;
}
export interface PbdsDatavizHeatmap {
    yLabel: string;
    xLabel: string;
    value: number;
}
export interface PbdsDatavizBarGrouped {
    key: string;
    [propName: string]: any;
}
export interface PbdsDatavizBarSingleHorizontal {
    label: string;
    value: number;
    startDate?: string;
    endDate?: string;
}
export interface PbdsDatavizBarSingleHorizontalCompare {
    label: string;
    value: number;
    startDate: string;
    endDate: string;
    compareValue: number | null;
    compareStartDate: string;
    compareEndDate: string;
    compareChangeValue: number;
    compareChangeDirection: 'increase' | 'decrease' | '';
    compareChangeInverse: boolean;
}

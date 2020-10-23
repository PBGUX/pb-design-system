import { OnInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { PbdsDatavizSparkline } from './dataviz.interfaces';
export declare class PbdsDatavizSparklineComponent implements OnInit, OnChanges {
    private _element;
    chartClass: boolean;
    sparklineClass: boolean;
    data: PbdsDatavizSparkline;
    width: number;
    height: number;
    type: 'line' | 'line-high' | 'area' | 'area-high' | 'bar';
    color: string;
    colorNegative: string | null;
    strokeWidth: number;
    yAxisMinBuffer: number;
    yAxisMaxBuffer: number;
    private chart;
    private svg;
    private margin;
    constructor(_element: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    updateChart(): void;
}

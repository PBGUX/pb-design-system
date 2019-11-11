import { OnInit, ElementRef } from '@angular/core';
import { PbdsDatavizSparkline } from './dataviz.interfaces';
export declare class PbdsDatavizSparklineComponent implements OnInit {
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
}

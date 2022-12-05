import { OnInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { PbdsDatavizSparkline } from './dataviz.interfaces';
import * as i0 from "@angular/core";
export declare class PbdsDatavizSparklineComponent implements OnInit, OnChanges {
    private _element;
    chartClass: boolean;
    sparklineClass: boolean;
    data: PbdsDatavizSparkline[];
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
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDatavizSparklineComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDatavizSparklineComponent, "pbds-dataviz-sparkline", never, { "data": "data"; "width": "width"; "height": "height"; "type": "type"; "color": "color"; "colorNegative": "colorNegative"; "strokeWidth": "strokeWidth"; "yAxisMinBuffer": "yAxisMinBuffer"; "yAxisMaxBuffer": "yAxisMaxBuffer"; }, {}, never, never, false>;
}

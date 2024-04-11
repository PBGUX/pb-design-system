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
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDatavizSparklineComponent, "pbds-dataviz-sparkline", never, { "data": { "alias": "data"; "required": false; }; "width": { "alias": "width"; "required": false; }; "height": { "alias": "height"; "required": false; }; "type": { "alias": "type"; "required": false; }; "color": { "alias": "color"; "required": false; }; "colorNegative": { "alias": "colorNegative"; "required": false; }; "strokeWidth": { "alias": "strokeWidth"; "required": false; }; "yAxisMinBuffer": { "alias": "yAxisMinBuffer"; "required": false; }; "yAxisMaxBuffer": { "alias": "yAxisMaxBuffer"; "required": false; }; }, {}, never, never, false, never>;
}

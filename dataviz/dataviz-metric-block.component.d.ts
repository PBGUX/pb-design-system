import { ElementRef, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PbdsDatavizMetricBlockComponent implements OnInit {
    class: string;
    heading: string;
    value: number;
    unit: string;
    description: string;
    centered: boolean;
    centeredText: boolean;
    vertical: boolean;
    infoMessage: string | null;
    hideValueMargin: boolean;
    isPercentUnit: boolean;
    isUnit: boolean;
    get hostClasses(): string;
    indicatorRef: ElementRef;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDatavizMetricBlockComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDatavizMetricBlockComponent, "pbds-dataviz-metric-block", never, { "class": { "alias": "class"; "required": false; }; "heading": { "alias": "heading"; "required": false; }; "value": { "alias": "value"; "required": false; }; "unit": { "alias": "unit"; "required": false; }; "description": { "alias": "description"; "required": false; }; "centered": { "alias": "centered"; "required": false; }; "centeredText": { "alias": "centeredText"; "required": false; }; "vertical": { "alias": "vertical"; "required": false; }; "infoMessage": { "alias": "infoMessage"; "required": false; }; }, {}, ["indicatorRef"], ["pbds-dataviz-metric-indicator", "pbds-dataviz-sparkline"], false, never>;
}

import { OnInit, ElementRef } from '@angular/core';
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
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDatavizMetricBlockComponent, "pbds-dataviz-metric-block", never, { "class": "class"; "heading": "heading"; "value": "value"; "unit": "unit"; "description": "description"; "centered": "centered"; "centeredText": "centeredText"; "vertical": "vertical"; "infoMessage": "infoMessage"; }, {}, ["indicatorRef"], ["pbds-dataviz-metric-indicator", "pbds-dataviz-sparkline"], false, never>;
}

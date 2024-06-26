import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Location, ViewportScroller } from '@angular/common';
import { PbdsDatavizBarSingleHorizontal, PbdsDatavizBarSingleHorizontalCompare } from './dataviz.interfaces';
import { PbdsDatavizService } from './dataviz.service';
import * as i0 from "@angular/core";
export declare class PbdsDatavizBarSingleHorizontalComponent implements OnInit, OnDestroy, OnChanges {
    private _dataviz;
    private _element;
    private _scroll;
    private _location;
    chartClass: boolean;
    singleStackedBarClass: boolean;
    data: Array<PbdsDatavizBarSingleHorizontal | PbdsDatavizBarSingleHorizontalCompare>;
    width: number;
    height: number;
    nullValueText: string;
    percentage: boolean;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    barMargin: number;
    hideXAxis: boolean;
    xAxisTicks: number;
    xAxisTitle: string | null;
    xAxisFormatType: 'number';
    xAxisFormatString: string;
    xAxisTickLabelSuffix: string;
    hideXGrid: boolean;
    hideLegend: boolean;
    hideLegendTooltip: boolean;
    legendWidth: number;
    legendPosition: 'right' | 'bottom';
    legendLabelFormatType: 'number' | 'time';
    legendLabelFormatString: string;
    hideTooltip: boolean;
    tooltipLabelFormatType: 'number' | 'time';
    tooltipLabelFormatString: string;
    tooltipDateFormatString: string;
    tooltipValueFormatType: 'number';
    tooltipValueFormatString: string;
    tooltipValueSuffix: string;
    tooltipPercentFormatString: string;
    compareChangeFormatString: string;
    monochrome: boolean;
    customColor: boolean;
    colorsArray: any[];
    theme: 'classic' | 'ocean' | 'sunset' | 'twilight';
    gradient: boolean;
    hovered: EventEmitter<object>;
    clicked: EventEmitter<object>;
    private isSingleData;
    private isCompare;
    private chart;
    private svg;
    private margin;
    private colorRange;
    private barPadding;
    private xAxisCall;
    private xAxis;
    private xAxisScale;
    private xAxisTickSize;
    private xAxisTickSizeOuter;
    private xAxisFormat;
    private xAxisTitleMargin;
    private hideXAxisDomain;
    private hideXAxisZero;
    private hideXAxisTicks;
    private xGrid;
    private xGridCall;
    private legendLabelFormat;
    private tooltip;
    private tooltipLabelFormat;
    private tooltipValueFormat;
    private tooltipDateFormat;
    private tooltipPercentFormat;
    private tooltipCompareChangeFormat;
    constructor(_dataviz: PbdsDatavizService, _element: ElementRef, _scroll: ViewportScroller, _location: Location);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    updateChart(): void;
    barMouseOver: (event: any, data: any) => void;
    barMouseOut: () => void;
    barMouseClick: (event: any, data: any) => void;
    private tooltipShow;
    private tooltipHide;
    legendMouseOver: (event: any, data: any) => void;
    legendMouseOut: () => void;
    legendMouseClick: (event: any, data: any) => void;
    private xAxisFormatter;
    private barFill;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDatavizBarSingleHorizontalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDatavizBarSingleHorizontalComponent, "pbds-dataviz-bar-single-horizontal", never, { "data": { "alias": "data"; "required": false; }; "width": { "alias": "width"; "required": false; }; "height": { "alias": "height"; "required": false; }; "nullValueText": { "alias": "nullValueText"; "required": false; }; "percentage": { "alias": "percentage"; "required": false; }; "marginTop": { "alias": "marginTop"; "required": false; }; "marginRight": { "alias": "marginRight"; "required": false; }; "marginBottom": { "alias": "marginBottom"; "required": false; }; "marginLeft": { "alias": "marginLeft"; "required": false; }; "barMargin": { "alias": "barMargin"; "required": false; }; "hideXAxis": { "alias": "hideXAxis"; "required": false; }; "xAxisTicks": { "alias": "xAxisTicks"; "required": false; }; "xAxisTitle": { "alias": "xAxisTitle"; "required": false; }; "xAxisFormatType": { "alias": "xAxisFormatType"; "required": false; }; "xAxisFormatString": { "alias": "xAxisFormatString"; "required": false; }; "xAxisTickLabelSuffix": { "alias": "xAxisTickLabelSuffix"; "required": false; }; "hideXGrid": { "alias": "hideXGrid"; "required": false; }; "hideLegend": { "alias": "hideLegend"; "required": false; }; "hideLegendTooltip": { "alias": "hideLegendTooltip"; "required": false; }; "legendWidth": { "alias": "legendWidth"; "required": false; }; "legendPosition": { "alias": "legendPosition"; "required": false; }; "legendLabelFormatType": { "alias": "legendLabelFormatType"; "required": false; }; "legendLabelFormatString": { "alias": "legendLabelFormatString"; "required": false; }; "hideTooltip": { "alias": "hideTooltip"; "required": false; }; "tooltipLabelFormatType": { "alias": "tooltipLabelFormatType"; "required": false; }; "tooltipLabelFormatString": { "alias": "tooltipLabelFormatString"; "required": false; }; "tooltipDateFormatString": { "alias": "tooltipDateFormatString"; "required": false; }; "tooltipValueFormatType": { "alias": "tooltipValueFormatType"; "required": false; }; "tooltipValueFormatString": { "alias": "tooltipValueFormatString"; "required": false; }; "tooltipValueSuffix": { "alias": "tooltipValueSuffix"; "required": false; }; "tooltipPercentFormatString": { "alias": "tooltipPercentFormatString"; "required": false; }; "compareChangeFormatString": { "alias": "compareChangeFormatString"; "required": false; }; "monochrome": { "alias": "monochrome"; "required": false; }; "customColor": { "alias": "customColor"; "required": false; }; "colorsArray": { "alias": "colorsArray"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "gradient": { "alias": "gradient"; "required": false; }; }, { "hovered": "hovered"; "clicked": "clicked"; }, never, never, false, never>;
}

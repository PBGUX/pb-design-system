import { OnInit, OnChanges, EventEmitter, ElementRef, OnDestroy, SimpleChanges } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { PbdsDatavizService } from './dataviz.service';
import { PbdsDatavizBar } from './dataviz.interfaces';
import * as i0 from "@angular/core";
export declare class PbdsDatavizBarComponent implements OnInit, OnDestroy, OnChanges {
    private _dataviz;
    private _element;
    private _scroll;
    private _location;
    chartClass: boolean;
    barClass: boolean;
    data: PbdsDatavizBar[];
    width: number;
    height: number;
    type: 'low' | 'medium' | 'high' | 'debug';
    singleSeries: boolean;
    xAxisFormatType: 'number' | 'time';
    xAxisFormatString: string;
    xAxisTitle: string | null;
    yAxisFormatType: 'number' | 'time';
    yAxisFormatString: string;
    yAxisTicks: number;
    yAxisMinBuffer: number;
    yAxisMaxBuffer: number;
    hideLegend: boolean;
    legendWidth: number;
    legendPosition: 'right' | 'bottom';
    legendLabelFormatType: 'number' | 'time';
    legendLabelFormatString: string;
    tooltipLabelFormatType: 'number' | 'time';
    tooltipLabelFormatString: string;
    tooltipLabelSuffix: string;
    hideTooltipLabel: boolean;
    tooltipValueFormatType: 'number' | 'time';
    tooltipValueFormatString: string;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    threshold: any;
    thresholdLabel: string;
    average: any;
    averageLabel: string;
    theme: any;
    gradient: boolean;
    hovered: EventEmitter<object>;
    clicked: EventEmitter<object>;
    private chart;
    private svg;
    private margin;
    private colorRange;
    private hideGrayBars;
    private yThreshold;
    private yAverage;
    private xAxisScale;
    private xAxisCall;
    private xAxis;
    private xAxisFormat;
    private xAxisTitleMargin;
    private yAxisScale;
    private yAxisCall;
    private yAxis;
    private yAxisFormat;
    private xGrid;
    private xGridCall;
    private yGrid;
    private yGridCall;
    private xAxisTickSize;
    private xAxisTickSizeOuter;
    private yAxisTickSize;
    private yAxisTickSizeOuter;
    private hideXAxis;
    private hideYAxis;
    private hideXAxisDomain;
    private hideYAxisDomain;
    private hideXAxisZero;
    private hideYAxisZero;
    private hideXGrid;
    private hideYGrid;
    private hideXAxisTicks;
    private hideYAxisTicks;
    private legendLabelFormat;
    private tooltip;
    private hideTooltip;
    private tooltipValueFormat;
    private tooltipLabelFormat;
    constructor(_dataviz: PbdsDatavizService, _element: ElementRef, _scroll: ViewportScroller, _location: Location);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    updateChart: () => void;
    barMouseOver: (event: any, data: any) => void;
    barMouseOut: () => void;
    barMouseClick: (event: any, data: any) => void;
    legendMouseOver: (event: any, data: any) => void;
    legendMouseOut: () => void;
    legendMouseClick: (event: any, data: any) => void;
    private tooltipShow;
    private tooltipHide;
    private xAxisFormatter;
    private yAxisFormatter;
    private barFill;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDatavizBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDatavizBarComponent, "pbds-dataviz-bar", never, { "data": { "alias": "data"; "required": false; }; "width": { "alias": "width"; "required": false; }; "height": { "alias": "height"; "required": false; }; "type": { "alias": "type"; "required": false; }; "singleSeries": { "alias": "singleSeries"; "required": false; }; "xAxisFormatType": { "alias": "xAxisFormatType"; "required": false; }; "xAxisFormatString": { "alias": "xAxisFormatString"; "required": false; }; "xAxisTitle": { "alias": "xAxisTitle"; "required": false; }; "yAxisFormatType": { "alias": "yAxisFormatType"; "required": false; }; "yAxisFormatString": { "alias": "yAxisFormatString"; "required": false; }; "yAxisTicks": { "alias": "yAxisTicks"; "required": false; }; "yAxisMinBuffer": { "alias": "yAxisMinBuffer"; "required": false; }; "yAxisMaxBuffer": { "alias": "yAxisMaxBuffer"; "required": false; }; "hideLegend": { "alias": "hideLegend"; "required": false; }; "legendWidth": { "alias": "legendWidth"; "required": false; }; "legendPosition": { "alias": "legendPosition"; "required": false; }; "legendLabelFormatType": { "alias": "legendLabelFormatType"; "required": false; }; "legendLabelFormatString": { "alias": "legendLabelFormatString"; "required": false; }; "tooltipLabelFormatType": { "alias": "tooltipLabelFormatType"; "required": false; }; "tooltipLabelFormatString": { "alias": "tooltipLabelFormatString"; "required": false; }; "tooltipLabelSuffix": { "alias": "tooltipLabelSuffix"; "required": false; }; "hideTooltipLabel": { "alias": "hideTooltipLabel"; "required": false; }; "tooltipValueFormatType": { "alias": "tooltipValueFormatType"; "required": false; }; "tooltipValueFormatString": { "alias": "tooltipValueFormatString"; "required": false; }; "marginTop": { "alias": "marginTop"; "required": false; }; "marginRight": { "alias": "marginRight"; "required": false; }; "marginBottom": { "alias": "marginBottom"; "required": false; }; "marginLeft": { "alias": "marginLeft"; "required": false; }; "threshold": { "alias": "threshold"; "required": false; }; "thresholdLabel": { "alias": "thresholdLabel"; "required": false; }; "average": { "alias": "average"; "required": false; }; "averageLabel": { "alias": "averageLabel"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "gradient": { "alias": "gradient"; "required": false; }; }, { "hovered": "hovered"; "clicked": "clicked"; }, never, never, false, never>;
}

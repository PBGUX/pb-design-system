import { OnInit, OnChanges, EventEmitter, ElementRef, OnDestroy, SimpleChanges } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { PbdsDatavizService } from './dataviz.service';
import { PbdsDatavizBarGrouped } from './dataviz.interfaces';
import * as i0 from "@angular/core";
export declare class PbdsDatavizBarGroupedComponent implements OnInit, OnDestroy, OnChanges {
    private _dataviz;
    private _element;
    private _scroll;
    private _location;
    chartClass: boolean;
    groupedBarClass: boolean;
    data: Array<PbdsDatavizBarGrouped>;
    width: number;
    height: number;
    vertical: boolean;
    hideXAxis: boolean;
    xAxisMaxBuffer: number;
    xAxisFormatType: 'number' | 'time';
    xAxisFormatString: string;
    xAxisTicks: number;
    xAxisTitle: string | null;
    hideYAxis: boolean;
    yAxisMaxBuffer: number;
    yAxisFormatType: 'number' | 'time';
    yAxisFormatString: string;
    yAxisTicks: number;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    hideLegend: boolean;
    legendWidth: number;
    legendPosition: 'right' | 'bottom';
    legendLabelFormatType: 'number' | 'time';
    legendLabelFormatString: string;
    hideTooltip: boolean;
    tooltipLabelFormatType: 'number' | 'time';
    tooltipLabelFormatString: string;
    tooltipValueFormatType: 'number';
    tooltipValueFormatString: string;
    showGrid: boolean;
    theme: 'classic' | 'sunset' | 'ocean' | 'twilight';
    gradient: boolean;
    hovered: EventEmitter<object>;
    clicked: EventEmitter<object>;
    private barScale;
    private chart;
    private svg;
    private margin;
    private colorRange;
    private xAxisMax;
    private xAxisScale;
    private xAxisCall;
    private xAxis;
    private xAxisTickSize;
    private xAxisTickSizeOuter;
    private xAxisFormat;
    private xAxisTitleMargin;
    private hideXAxisDomain;
    private hideXAxisZero;
    private hideXAxisTicks;
    private xGrid;
    private xGridCall;
    private yAxisMax;
    private yAxisScale;
    private yAxisCall;
    private yAxis;
    private yAxisFormat;
    private yAxisTickSize;
    private yAxisTickSizeOuter;
    private hideYAxisZero;
    private hideYAxisDomain;
    private hideYAxisTicks;
    private yGrid;
    private yGridCall;
    private legendLabelFormat;
    private hideGrayBars;
    private tooltip;
    private tooltipValueFormat;
    private tooltipLabelFormat;
    constructor(_dataviz: PbdsDatavizService, _element: ElementRef, _scroll: ViewportScroller, _location: Location);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    updateChartVertical(): void;
    updateChartHorizontal(): void;
    updateLegend(): void;
    barMouseOver: (event: any, data: PbdsDatavizBarGrouped[]) => void;
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
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDatavizBarGroupedComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDatavizBarGroupedComponent, "pbds-dataviz-bar-grouped", never, { "data": "data"; "width": "width"; "height": "height"; "vertical": "vertical"; "hideXAxis": "hideXAxis"; "xAxisMaxBuffer": "xAxisMaxBuffer"; "xAxisFormatType": "xAxisFormatType"; "xAxisFormatString": "xAxisFormatString"; "xAxisTicks": "xAxisTicks"; "xAxisTitle": "xAxisTitle"; "hideYAxis": "hideYAxis"; "yAxisMaxBuffer": "yAxisMaxBuffer"; "yAxisFormatType": "yAxisFormatType"; "yAxisFormatString": "yAxisFormatString"; "yAxisTicks": "yAxisTicks"; "marginTop": "marginTop"; "marginRight": "marginRight"; "marginBottom": "marginBottom"; "marginLeft": "marginLeft"; "hideLegend": "hideLegend"; "legendWidth": "legendWidth"; "legendPosition": "legendPosition"; "legendLabelFormatType": "legendLabelFormatType"; "legendLabelFormatString": "legendLabelFormatString"; "hideTooltip": "hideTooltip"; "tooltipLabelFormatType": "tooltipLabelFormatType"; "tooltipLabelFormatString": "tooltipLabelFormatString"; "tooltipValueFormatType": "tooltipValueFormatType"; "tooltipValueFormatString": "tooltipValueFormatString"; "showGrid": "showGrid"; "theme": "theme"; "gradient": "gradient"; }, { "hovered": "hovered"; "clicked": "clicked"; }, never, never, false, never>;
}

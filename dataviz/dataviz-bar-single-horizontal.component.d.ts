import { OnInit, ElementRef, OnChanges, SimpleChanges, EventEmitter, OnDestroy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { PbdsDatavizService } from './dataviz.service';
import { PbdsDatavizBarSingleHorizontal, PbdsDatavizBarSingleHorizontalCompare } from './dataviz.interfaces';
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
    theme: 'classic' | 'ocean' | 'sunset' | 'twilight';
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
    barMouseOver: (event: any, data: any, index: any, nodes: any) => void;
    barMouseOut: () => void;
    barMouseClick: (event: any, data: any, index: any, nodes: any) => void;
    private tooltipShow;
    private tooltipHide;
    legendMouseOver: (event: any, data: any, index: any, nodes: any) => void;
    legendMouseOut: () => void;
    legendMouseClick: (event: any, data: any, index: any, nodes: any) => void;
    private xAxisFormatter;
}
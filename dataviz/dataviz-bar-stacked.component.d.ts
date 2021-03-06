import { OnInit, OnChanges, EventEmitter, ElementRef, OnDestroy, SimpleChanges } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { PbdsDatavizService } from './dataviz.service';
import { PbdsDatavizBarStacked } from './dataviz.interfaces';
export declare class PbdsDatavizBarStackedComponent implements OnInit, OnDestroy, OnChanges {
    private _dataviz;
    private _element;
    private _scroll;
    chartClass: boolean;
    stackedBarClass: boolean;
    data: Array<PbdsDatavizBarStacked>;
    width: number;
    height: number;
    type: 'low' | 'medium' | 'high' | 'debug';
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    hideXAxis: boolean;
    xAxisFormatType: 'number' | 'time';
    xAxisFormatString: string;
    yAxisFormatType: 'number' | 'time';
    yAxisFormatString: string;
    yAxisTicks: number;
    yAxisMaxBuffer: number;
    hideLegend: boolean;
    legendWidth: number;
    legendPosition: 'right' | 'bottom';
    legendLabelFormatType: 'number' | 'time';
    legendLabelFormatString: string;
    tooltipHeadingFormatType: 'time';
    tooltipHeadingFormatString: string;
    tooltipHeadingValueFormatType: 'number';
    tooltipHeadingValueFormatString: string;
    tooltipLabelFormatType: 'time';
    tooltipLabelFormatString: string;
    tooltipValueFormatType: 'number';
    tooltipValueFormatString: string;
    theme: any;
    hovered: EventEmitter<object>;
    clicked: EventEmitter<object>;
    private dataStack;
    private dataKeys;
    private chart;
    private svg;
    private grayBars;
    private mouseBars;
    private bars;
    private margin;
    private colorRange;
    private hideGrayBars;
    private xAxisScale;
    private xAxisCall;
    private xAxis;
    private xAxisFormat;
    private xAxisTickSize;
    private xAxisTickSizeOuter;
    private hideXAxisDomain;
    private hideXAxisZero;
    private hideXAxisTicks;
    private hideXGrid;
    private hideYGrid;
    private yAxisMax;
    private yAxisScale;
    private yAxisCall;
    private yAxis;
    private yAxisFormat;
    private yAxisTickSize;
    private yAxisTickSizeOuter;
    private xGrid;
    private xGridCall;
    private yGrid;
    private yGridCall;
    private hideYAxis;
    private hideYAxisZero;
    private hideYAxisDomain;
    private hideYAxisTicks;
    private legendLabelFormat;
    private tooltip;
    private hideTooltip;
    private tooltipHeadingFormat;
    private tooltipHeadingValueFormat;
    private tooltipValueFormat;
    private tooltipLabelFormat;
    constructor(_dataviz: PbdsDatavizService, _element: ElementRef, _scroll: ViewportScroller);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    updateChart: (firstRun?: boolean) => void;
    barMouseOver: (event: any, data: any) => void;
    barMouseOut: () => void;
    barMouseClick: (event: any, data: any) => void;
    legendMouseOver: (event: any, data: any) => void;
    legendMouseOut: () => void;
    legendMouseClick: (event: any, data: any) => void;
    private xAxisFormatter;
    private tooltipShow;
    private tooltipHide;
    private yAxisFormatter;
}

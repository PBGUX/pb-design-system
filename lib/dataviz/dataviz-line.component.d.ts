import { OnInit, OnChanges, EventEmitter, ElementRef, OnDestroy, SimpleChanges } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { PbdsDatavizService } from './dataviz.service';
import { PbdsDatavizLine } from './dataviz.interfaces';
export declare class PbdsDatavizLineComponent implements OnInit, OnDestroy, OnChanges {
    private _dataviz;
    private _element;
    private _scroll;
    private _location;
    chartClass: boolean;
    lineClass: boolean;
    data: PbdsDatavizLine;
    width: number;
    height: number;
    type: 'medium' | 'high' | 'debug';
    area: boolean;
    xAxisFormatString: string;
    xAxisTicks: number;
    yAxisFormatString: string;
    yAxisTicks: number;
    yAxisMinBuffer: number;
    yAxisMaxBuffer: number;
    hideXGrid: boolean;
    hideYGrid: boolean;
    hideLegend: boolean;
    legendWidth: number;
    legendPosition: 'right' | 'bottom';
    legendLabelFormatType: 'number' | 'time';
    legendLabelFormatString: string;
    tooltipHeadingFormatString: string;
    tooltipLabelFormatType: 'number' | 'time';
    tooltipLabelFormatString: string;
    tooltipValueFormatType: 'number' | 'time';
    tooltipValueFormatString: string;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    theme: any;
    hovered: EventEmitter<object>;
    clicked: EventEmitter<object>;
    tooltipHovered: EventEmitter<object>;
    tooltipClicked: EventEmitter<object>;
    private chart;
    private svg;
    private mouserect;
    private tooltipLine;
    private margin;
    private d3line;
    private d3area;
    private lineWidth;
    private lineCurved;
    private linePoints;
    private colorRange;
    private xAxisScale;
    private xAxisCall;
    private xAxis;
    private xAxisFormat;
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
    private hideXAxisTicks;
    private hideYAxisTicks;
    private legendLabelFormat;
    private tooltip;
    private hideTooltip;
    private tooltipHeadingFormat;
    private tooltipValueFormat;
    private tooltipLabelFormat;
    private mousedata;
    constructor(_dataviz: PbdsDatavizService, _element: ElementRef, _scroll: ViewportScroller, _location: Location);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    updateChart: () => void;
    legendMouseOver: (event: any, data: any, index: any, nodes: any) => void;
    legendMouseOut: () => void;
    legendMouseClick: (event: any, data: any, index: any, nodes: any) => void;
    mouserectMouseMove: (event: any, index: any, nodes: any) => boolean;
    mouserectMouseOut: (event: any, index: any, nodes: any) => void;
    mouserectMouseClick: () => void;
    private tooltipShow;
    private tooltipHide;
    private xAxisFormatter;
    private yAxisFormatter;
}

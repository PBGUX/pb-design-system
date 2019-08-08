import { OnInit, OnChanges, EventEmitter, ElementRef, OnDestroy, SimpleChanges } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { PbdsDatavizMapData } from './dataviz.interfaces';
export declare class DatavizBubbleMapComponent implements OnInit, OnChanges, OnDestroy {
    private _element;
    private _scroll;
    chartClass: boolean;
    bubbleMapClass: boolean;
    data: Array<PbdsDatavizMapData>;
    topojson: any;
    feature: string;
    projectionType: any;
    scale: any;
    center: any;
    width: number;
    height: number;
    type: 'medium' | 'high' | 'debug';
    dot: boolean;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    color: string;
    textColor: string;
    textSizeRange: number[];
    dotSize: number;
    bubbleSizeRange: number[];
    bubbleLabelFormatType: 'number';
    bubbleLabelFormatString: string;
    hideTooltip: boolean;
    hideTooltipValue: boolean;
    tooltipValueFormatType: 'number';
    tooltipValueFormatString: string;
    hovered: EventEmitter<object>;
    clicked: EventEmitter<object>;
    private projection;
    private geoPath;
    private topojsonFeature;
    private chart;
    private svg;
    private margin;
    private bubbleContainer;
    private bubbleRadius;
    private fontRange;
    private bubbleLabelFormat;
    private tooltip;
    private tooltipValueFormat;
    constructor(_element: ElementRef, _scroll: ViewportScroller);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    updateChart: () => void;
    bubbleMouseOver: (event: any, data: any, index: any, nodes: any) => void;
    bubbleMouseOut: (event: any, data: any, index: any, nodes: any) => void;
    bubbleMouseClick: (event: any, data: any, index: any, nodes: any) => void;
    private tooltipShow;
    private tooltipHide;
}

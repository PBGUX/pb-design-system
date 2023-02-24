import { OnInit, OnChanges, EventEmitter, ElementRef, OnDestroy, SimpleChanges } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { PbdsDatavizService } from './dataviz.service';
import { PbdsDatavizLine } from './dataviz.interfaces';
import * as i0 from "@angular/core";
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
    xAxisType: 'date' | 'number' | 'string';
    xAxisFormatString: string;
    xAxisTicks: number;
    xAxisTitle: string | null;
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
    tooltipHeadingSuffix: string;
    tooltipLabelFormatType: 'number' | 'time';
    tooltipLabelFormatString: string;
    tooltipValueFormatType: 'number' | 'time';
    tooltipValueFormatString: string;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    theme: any;
    customColor: boolean;
    colorsArray: any[];
    lineCurved: boolean;
    hovered: EventEmitter<object>;
    clicked: EventEmitter<object>;
    tooltipHovered: EventEmitter<object>;
    tooltipClicked: EventEmitter<object>;
    private chart;
    private svg;
    private mouserect;
    private tooltipLine;
    private margin;
    private clipPathId;
    private d3line;
    private d3area;
    private lineWidth;
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
    private xAxisTitleMargin;
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
    legendMouseOver: (event: any, data: any) => void;
    legendMouseOut: () => void;
    legendMouseClick: (event: any, data: any) => void;
    mouserectMouseMove: (event: any, data: any) => boolean;
    mouserectMouseOut: (event: any, data: any) => void;
    mouserectMouseClick: (event: any) => void;
    private tooltipShow;
    private tooltipHide;
    private xAxisFormatter;
    private yAxisFormatter;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDatavizLineComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDatavizLineComponent, "pbds-dataviz-line", never, { "data": "data"; "width": "width"; "height": "height"; "type": "type"; "area": "area"; "xAxisType": "xAxisType"; "xAxisFormatString": "xAxisFormatString"; "xAxisTicks": "xAxisTicks"; "xAxisTitle": "xAxisTitle"; "yAxisFormatString": "yAxisFormatString"; "yAxisTicks": "yAxisTicks"; "yAxisMinBuffer": "yAxisMinBuffer"; "yAxisMaxBuffer": "yAxisMaxBuffer"; "hideXGrid": "hideXGrid"; "hideYGrid": "hideYGrid"; "hideLegend": "hideLegend"; "legendWidth": "legendWidth"; "legendPosition": "legendPosition"; "legendLabelFormatType": "legendLabelFormatType"; "legendLabelFormatString": "legendLabelFormatString"; "tooltipHeadingFormatString": "tooltipHeadingFormatString"; "tooltipHeadingSuffix": "tooltipHeadingSuffix"; "tooltipLabelFormatType": "tooltipLabelFormatType"; "tooltipLabelFormatString": "tooltipLabelFormatString"; "tooltipValueFormatType": "tooltipValueFormatType"; "tooltipValueFormatString": "tooltipValueFormatString"; "marginTop": "marginTop"; "marginRight": "marginRight"; "marginBottom": "marginBottom"; "marginLeft": "marginLeft"; "theme": "theme"; "customColor": "customColor"; "colorsArray": "colorsArray"; "lineCurved": "lineCurved"; }, { "hovered": "hovered"; "clicked": "clicked"; "tooltipHovered": "tooltipHovered"; "tooltipClicked": "tooltipClicked"; }, never, never, false, never>;
}

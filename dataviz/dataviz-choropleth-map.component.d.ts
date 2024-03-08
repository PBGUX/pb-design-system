import { OnInit, OnChanges, EventEmitter, ElementRef, OnDestroy, SimpleChanges } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { PbdsDatavizService } from './dataviz.service';
import { PbdsDatavizChoroplethMapData } from './dataviz.interfaces';
import * as i0 from "@angular/core";
export declare class PbdsDatavizChoroplethMapComponent implements OnInit, OnDestroy, OnChanges {
    private _dataviz;
    private _element;
    private _scroll;
    chartClass: boolean;
    choroplethMapClass: boolean;
    data: Array<PbdsDatavizChoroplethMapData>;
    topojson: any;
    feature: string;
    projectionType: any;
    dataField: string;
    mesh: string | null;
    scale: any;
    center: any;
    width: number;
    height: number;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    theme: 'classic' | 'ocean' | 'sunset' | 'twilight';
    colorScale: 'threshold' | 'quantile' | 'quantize';
    domain: Array<number>;
    hideTooltip: boolean;
    tooltipHeaderSuffix: string;
    tooltipValueFormatType: 'number';
    tooltipValueFormatString: string;
    hideLegend: boolean;
    legendWidth: number;
    legendLabel: string | null;
    legendValueFormatType: 'number';
    legendValueFormatString: string;
    legendLeft: number;
    legendTop: number;
    hovered: EventEmitter<object>;
    clicked: EventEmitter<object>;
    private projection;
    private geoPath;
    private topojsonFeature;
    private chart;
    private svg;
    private margin;
    private colorRange;
    private colorDomain;
    private tooltip;
    private tooltipValueFormat;
    private legendValueFormat;
    constructor(_dataviz: PbdsDatavizService, _element: ElementRef, _scroll: ViewportScroller);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    updateChart: () => void;
    featureMouseOver: (event: any, data: any) => void;
    featureMouseOut: (event: any, data: any) => void;
    featureMouseClick: (event: any, data: any) => void;
    private tooltipShow;
    private tooltipHide;
    private tooltipMove;
    private tooltipSetPosition;
    legend: (g: any) => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDatavizChoroplethMapComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDatavizChoroplethMapComponent, "pbds-dataviz-choropleth-map", never, { "data": "data"; "topojson": "topojson"; "feature": "feature"; "projectionType": "projectionType"; "dataField": "dataField"; "mesh": "mesh"; "scale": "scale"; "center": "center"; "width": "width"; "height": "height"; "marginTop": "marginTop"; "marginRight": "marginRight"; "marginBottom": "marginBottom"; "marginLeft": "marginLeft"; "theme": "theme"; "colorScale": "colorScale"; "domain": "domain"; "hideTooltip": "hideTooltip"; "tooltipHeaderSuffix": "tooltipHeaderSuffix"; "tooltipValueFormatType": "tooltipValueFormatType"; "tooltipValueFormatString": "tooltipValueFormatString"; "hideLegend": "hideLegend"; "legendWidth": "legendWidth"; "legendLabel": "legendLabel"; "legendValueFormatType": "legendValueFormatType"; "legendValueFormatString": "legendValueFormatString"; "legendLeft": "legendLeft"; "legendTop": "legendTop"; }, { "hovered": "hovered"; "clicked": "clicked"; }, never, never, false, never>;
}

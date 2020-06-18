/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, event as d3_event } from 'd3-selection';
import { scaleLinear as d3_scaleLinear } from 'd3-scale';
import { min as d3_min, max as d3_max } from 'd3-array';
import { geoPath as d3_geoPath, geoAlbers as d3_geoAlbers, geoAlbersUsa as d3_geoAlbersUsa, geoMercator as d3_geoMercator } from 'd3-geo';
import * as topojson from 'topojson';
import { PbdsDatavizService } from './dataviz.service';
export class DatavizBubbleMapComponent {
    /**
     * @param {?} _element
     * @param {?} _scroll
     * @param {?} _dataviz
     */
    constructor(_element, _scroll, _dataviz) {
        this._element = _element;
        this._scroll = _scroll;
        this._dataviz = _dataviz;
        this.chartClass = true;
        this.bubbleMapClass = true;
        this.feature = '';
        this.scale = null;
        this.center = null;
        this.width = 306;
        this.height = 400;
        this.type = 'medium'; // debug to show all chart options
        // debug to show all chart options
        this.dot = false;
        this.marginTop = 0;
        this.marginRight = 0;
        this.marginBottom = 0;
        this.marginLeft = 0;
        this.color = '#ef8200';
        this.textColor = '#fff';
        this.textSizeRange = [14, 24];
        this.dotSize = 4;
        this.bubbleSizeRange = [500, 2000];
        this.bubbleLabelFormatType = null;
        this.bubbleLabelFormatString = '';
        this.hideTooltip = false;
        this.hideTooltipValue = false;
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (/**
         * @return {?}
         */
        () => {
            // bubbles
            this.bubbleContainer
                .selectAll('circle')
                .data(this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('circle')
                .attr('class', 'dot-circle')
                .classed('solid', this.dot)
                .attr('cx', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.projection([d.longitude, d.latitude])[0]))
                .attr('cy', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.projection([d.longitude, d.latitude])[1]))
                .attr('r', (/**
             * @param {?} d
             * @return {?}
             */
            d => (!this.dot ? Math.sqrt(this.bubbleRadius(d.value)) : `${this.dotSize}px`)))), (/**
             * @param {?} update
             * @return {?}
             */
            update => update
                .transition()
                .duration(1000)
                .attr('cx', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.projection([d.longitude, d.latitude])[0]))
                .attr('cy', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.projection([d.longitude, d.latitude])[1]))
                .attr('r', (/**
             * @param {?} d
             * @return {?}
             */
            d => (!this.dot ? Math.sqrt(this.bubbleRadius(d.value)) : `${this.dotSize}px`)))
                .transition()
                .attr('pointer-events', 'auto')), (/**
             * @param {?} exit
             * @return {?}
             */
            exit => exit
                .transition()
                .attr('pointer-events', 'none')
                .remove()));
            if (!this.hideTooltip) {
                this.bubbleContainer
                    .selectAll('circle')
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.bubbleMouseOver(d3_event, data, index, nodes)))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.bubbleMouseOut(d3_event, data, index, nodes)))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.bubbleMouseClick(d3_event, data, index, nodes)));
                // bubble text
                if (this.type !== 'high' && !this.dot) {
                    this.bubbleContainer
                        .selectAll('text')
                        .data(this.data)
                        .join((/**
                     * @param {?} enter
                     * @return {?}
                     */
                    enter => enter
                        .append('text')
                        .text((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => (this.bubbleLabelFormat ? this.bubbleLabelFormat(d.value) : d.value)))
                        .attr('class', 'dot-text')
                        .style('fill', this.textColor)
                        .style('font-size', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => `${Math.round(this.fontRange(d.value))}px`))
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.projection([d.longitude, d.latitude])[0]))
                        .attr('y', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.projection([d.longitude, d.latitude])[1]))
                        .attr('dy', '.4em')), (/**
                     * @param {?} update
                     * @return {?}
                     */
                    update => update
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .text((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => (this.bubbleLabelFormat ? this.bubbleLabelFormat(d.value) : d.value)))
                        .style('font-size', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => `${Math.round(this.fontRange(d.value))}px`))
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.projection([d.longitude, d.latitude])[0]))
                        .attr('y', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.projection([d.longitude, d.latitude])[1]))
                        .attr('dy', '.4em')
                        .transition()
                        .attr('pointer-events', 'auto')), (/**
                     * @param {?} exit
                     * @return {?}
                     */
                    exit => exit
                        .transition()
                        .attr('pointer-events', 'none')
                        .remove()));
                }
            }
        });
        this.bubbleMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.chart
                .selectAll('.dot-circle')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.chart
                .selectAll('.dot-circle')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .classed('active', true);
            this.tooltipShow(data, nodes[index]);
            this.hovered.emit({ event, data });
        });
        this.bubbleMouseOut = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.chart
                .selectAll('.dot-circle')
                .classed('active', false)
                .classed('inactive', false);
            this.tooltipHide();
        });
        this.bubbleMouseClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.clicked.emit({ event, data });
        });
        this.tooltipShow = (/**
         * @param {?} data
         * @param {?} node
         * @return {?}
         */
        (data, node) => {
            /** @type {?} */
            const dimensions = node.getBoundingClientRect();
            /** @type {?} */
            const scroll = this._scroll.getScrollPosition();
            this.tooltip.select('.tooltip-header').html((/**
             * @param {?} d
             * @return {?}
             */
            d => `${data.label}`));
            if (!this.hideTooltipValue) {
                this.tooltip
                    .select('.tooltip-value')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => (this.tooltipValueFormat ? `${this.tooltipValueFormat(data.value)}` : `${data.value}`)));
            }
            /** @type {?} */
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight + 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight}px`); //
            this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        () => {
            this.tooltip.style('opacity', 0);
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        if (this.type !== 'debug') {
            // set type defaults
            switch (this.type) {
                case 'medium':
                    break;
                case 'high':
                    break;
            }
        }
        switch (this.projectionType) {
            case 'geoAlbers':
                this.projection = d3_geoAlbers();
                break;
            case 'geoAlbersUsa':
                this.projection = d3_geoAlbersUsa();
                break;
            case 'geoMercator':
                this.projection = d3_geoMercator();
                break;
            default:
                break;
        }
        // dreate formatters
        this.bubbleLabelFormat = this._dataviz.d3Format(this.bubbleLabelFormatType, this.bubbleLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        // console.log('TOPOJSON: ', this.topojson);
        this.topojsonFeature = topojson.feature(this.topojson, this.topojson.objects[this.feature]);
        this.projection.fitSize([+this.width, +this.height], this.topojsonFeature);
        // console.log('TOPOJSON FEATURE: ', this.topojsonFeature);
        // console.log('MESH: ', topojson.mesh(this.topojson, this.topojson.objects[this.feature], (a, b) => a !== b));
        // console.log('DATA: ', this.data);
        if (this.scale) {
            this.projection.scale(+this.scale);
        }
        if (this.center) {
            this.projection.center(this.center);
        }
        this.geoPath = d3_geoPath().projection(this.projection);
        // bubble radius range
        if (this.data && !this.dot) {
            this.bubbleRadius = d3_scaleLinear()
                .range(this.bubbleSizeRange)
                .domain([d3_min(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => +d.value)), d3_max(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => +d.value))]);
            // font range
            this.fontRange = d3_scaleLinear()
                .range(this.textSizeRange)
                .domain([d3_min(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => +d.value)), d3_max(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => +d.value))]);
        }
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', 'pbds-tooltip south')
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
            // tooltip header
            this.tooltip.append('div').attr('class', 'tooltip-header');
            if (!this.hideTooltipValue)
                this.tooltip.append('div').attr('class', 'tooltip-value');
        }
        // create the chart
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width + this.margin.left + this.margin.right)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this.height +
            this.margin.top +
            this.margin.bottom}`)
            .append('g')
            .attr('class', 'container');
        // map
        this.svg
            .append('g')
            .attr('class', 'map')
            .selectAll('path')
            .data(this.topojsonFeature.features)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('path')
            .attr('class', 'feature')
            .attr('d', this.geoPath)));
        // borders
        this.svg
            .append('path')
            .attr('class', 'mesh')
            .datum(topojson.mesh(this.topojson, this.topojson.objects[this.feature], (/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => a !== b)))
            .attr('d', this.geoPath);
        this.bubbleContainer = this.svg
            .append('g')
            .attr('class', 'dots')
            .style('color', this.color);
        this.updateChart();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
}
DatavizBubbleMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bubble-map',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
DatavizBubbleMapComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ViewportScroller },
    { type: PbdsDatavizService }
];
DatavizBubbleMapComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    bubbleMapClass: [{ type: HostBinding, args: ['class.pbds-chart-bubble-map',] }],
    data: [{ type: Input }],
    topojson: [{ type: Input }],
    feature: [{ type: Input }],
    projectionType: [{ type: Input }],
    scale: [{ type: Input }],
    center: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    type: [{ type: Input }],
    dot: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    color: [{ type: Input }],
    textColor: [{ type: Input }],
    textSizeRange: [{ type: Input }],
    dotSize: [{ type: Input }],
    bubbleSizeRange: [{ type: Input }],
    bubbleLabelFormatType: [{ type: Input }],
    bubbleLabelFormatString: [{ type: Input }],
    hideTooltip: [{ type: Input }],
    hideTooltipValue: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.chartClass;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleMapClass;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.data;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.topojson;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.feature;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.projectionType;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.scale;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.center;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.width;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.height;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.type;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.dot;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.marginTop;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.marginRight;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.marginBottom;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.marginLeft;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.color;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.textColor;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.textSizeRange;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.dotSize;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleSizeRange;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleLabelFormatType;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleLabelFormatString;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.hideTooltip;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.hideTooltipValue;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.hovered;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.projection;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.geoPath;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.topojsonFeature;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.bubbleContainer;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.bubbleRadius;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.fontRange;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.bubbleLabelFormat;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.tooltipValueFormat;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.updateChart;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleMouseOver;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleMouseOut;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleMouseClick;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype._scroll;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype._dataviz;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1idWJibGUtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LWJ1YmJsZS1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLEtBQUssSUFBSSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEUsT0FBTyxFQUFFLFdBQVcsSUFBSSxjQUFjLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDekQsT0FBTyxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsT0FBTyxJQUFJLFVBQVUsRUFDckIsU0FBUyxJQUFJLFlBQVksRUFDekIsWUFBWSxJQUFJLGVBQWUsRUFDL0IsV0FBVyxJQUFJLGNBQWMsRUFDOUIsTUFBTSxRQUFRLENBQUM7QUFFaEIsT0FBTyxLQUFLLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFFckMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFTdkQsTUFBTSxPQUFPLHlCQUF5Qjs7Ozs7O0lBcUdwQyxZQUFvQixRQUFvQixFQUFVLE9BQXlCLEVBQVUsUUFBNEI7UUFBN0YsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFuR2pILGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFTdEIsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQU1iLFVBQUssR0FBRyxJQUFJLENBQUM7UUFHYixXQUFNLEdBQUcsSUFBSSxDQUFDO1FBR2QsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFdBQU0sR0FBRyxHQUFHLENBQUM7UUFHYixTQUFJLEdBQWdDLFFBQVEsQ0FBQyxDQUFDLGtDQUFrQzs7UUFHaEYsUUFBRyxHQUFHLEtBQUssQ0FBQztRQUdaLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFHZCxnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUdoQixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUdqQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBR2YsVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUdsQixjQUFTLEdBQUcsTUFBTSxDQUFDO1FBR25CLGtCQUFhLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHekIsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUdaLG9CQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFHOUIsMEJBQXFCLEdBQWEsSUFBSSxDQUFDO1FBR3ZDLDRCQUF1QixHQUFHLEVBQUUsQ0FBQztRQUc3QixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUdwQixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFHekIsMkJBQXNCLEdBQWEsSUFBSSxDQUFDO1FBR3hDLDZCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUc5QixZQUFPLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFHM0QsWUFBTyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBOEozRCxnQkFBVzs7O1FBQUcsR0FBRyxFQUFFO1lBQ2pCLFVBQVU7WUFFVixJQUFJLENBQUMsZUFBZTtpQkFDakIsU0FBUyxDQUFDLFFBQVEsQ0FBQztpQkFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7aUJBQ2YsSUFBSTs7OztZQUNILEtBQUssQ0FBQyxFQUFFLENBQ04sS0FBSztpQkFDRixNQUFNLENBQUMsUUFBUSxDQUFDO2lCQUNoQixJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztpQkFDM0IsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUMxQixJQUFJLENBQUMsSUFBSTs7OztZQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7aUJBQzlELElBQUksQ0FBQyxJQUFJOzs7O1lBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztpQkFDOUQsSUFBSSxDQUFDLEdBQUc7Ozs7WUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUM7Ozs7WUFDOUYsTUFBTSxDQUFDLEVBQUUsQ0FDUCxNQUFNO2lCQUNILFVBQVUsRUFBRTtpQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDO2lCQUNkLElBQUksQ0FBQyxJQUFJOzs7O1lBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztpQkFDOUQsSUFBSSxDQUFDLElBQUk7Ozs7WUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMs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RWIsbURBQ2U7O0lBRWYsMENBQ2E7O0lBRWIsMkNBQ2M7O0lBRWQsMENBQ1k7O0lBRVosMkNBQ2E7O0lBRWIseUNBQzZDOztJQUU3Qyx3Q0FDWTs7SUFFWiw4Q0FDYzs7SUFFZCxnREFDZ0I7O0lBRWhCLGlEQUNpQjs7SUFFakIsK0NBQ2U7O0lBRWYsMENBQ2tCOztJQUVsQiw4Q0FDbUI7O0lBRW5CLGtEQUN5Qjs7SUFFekIsNENBQ1k7O0lBRVosb0RBQzhCOztJQUU5QiwwREFDdUM7O0lBRXZDLDREQUM2Qjs7SUFFN0IsZ0RBQ29COztJQUVwQixxREFDeUI7O0lBRXpCLDJEQUN3Qzs7SUFFeEMsNkRBQzhCOztJQUU5Qiw0Q0FDMkQ7O0lBRTNELDRDQUMyRDs7Ozs7SUFFM0QsK0NBQW1COzs7OztJQUNuQiw0Q0FBZ0I7Ozs7O0lBQ2hCLG9EQUF3Qjs7Ozs7SUFDeEIsMENBQWM7Ozs7O0lBQ2Qsd0NBQVk7Ozs7O0lBQ1osMkNBQWU7Ozs7O0lBQ2Ysb0RBQXdCOzs7OztJQUN4QixpREFBcUI7Ozs7O0lBQ3JCLDhDQUFrQjs7Ozs7SUFDbEIsc0RBQTBCOzs7OztJQUMxQiw0Q0FBZ0I7Ozs7O0lBQ2hCLHVEQUEyQjs7SUFpSjNCLGdEQTBFRTs7SUFFRixvREFjRTs7SUFFRixtREFPRTs7SUFFRixxREFFRTs7Ozs7SUFFRixnREFrQkU7Ozs7O0lBRUYsZ0RBRUU7Ozs7O0lBOVFVLDZDQUE0Qjs7Ozs7SUFBRSw0Q0FBaUM7Ozs7O0lBQUUsNkNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QsIGV2ZW50IGFzIGQzX2V2ZW50IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgbWluIGFzIGQzX21pbiwgbWF4IGFzIGQzX21heCB9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7XG4gIGdlb1BhdGggYXMgZDNfZ2VvUGF0aCxcbiAgZ2VvQWxiZXJzIGFzIGQzX2dlb0FsYmVycyxcbiAgZ2VvQWxiZXJzVXNhIGFzIGQzX2dlb0FsYmVyc1VzYSxcbiAgZ2VvTWVyY2F0b3IgYXMgZDNfZ2VvTWVyY2F0b3Jcbn0gZnJvbSAnZDMtZ2VvJztcblxuaW1wb3J0ICogYXMgdG9wb2pzb24gZnJvbSAndG9wb2pzb24nO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpek1hcERhdGEgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1idWJibGUtbWFwJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1idWJibGUtbWFwJylcbiAgYnViYmxlTWFwQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6TWFwRGF0YT47XG5cbiAgQElucHV0KClcbiAgdG9wb2pzb247XG5cbiAgQElucHV0KClcbiAgZmVhdHVyZSA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHByb2plY3Rpb25UeXBlO1xuXG4gIEBJbnB1dCgpXG4gIHNjYWxlID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBjZW50ZXIgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzA2O1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbWVkaXVtJyB8ICdoaWdoJyB8ICdkZWJ1ZycgPSAnbWVkaXVtJzsgLy8gZGVidWcgdG8gc2hvdyBhbGwgY2hhcnQgb3B0aW9uc1xuXG4gIEBJbnB1dCgpXG4gIGRvdCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDA7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI2VmODIwMCc7XG5cbiAgQElucHV0KClcbiAgdGV4dENvbG9yID0gJyNmZmYnO1xuXG4gIEBJbnB1dCgpXG4gIHRleHRTaXplUmFuZ2UgPSBbMTQsIDI0XTtcblxuICBASW5wdXQoKVxuICBkb3RTaXplID0gNDtcblxuICBASW5wdXQoKVxuICBidWJibGVTaXplUmFuZ2UgPSBbNTAwLCAyMDAwXTtcblxuICBASW5wdXQoKVxuICBidWJibGVMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBidWJibGVMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgaGlkZVRvb2x0aXBWYWx1ZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIHByb2plY3Rpb247XG4gIHByaXZhdGUgZ2VvUGF0aDtcbiAgcHJpdmF0ZSB0b3BvanNvbkZlYXR1cmU7XG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcbiAgcHJpdmF0ZSBidWJibGVDb250YWluZXI7XG4gIHByaXZhdGUgYnViYmxlUmFkaXVzO1xuICBwcml2YXRlIGZvbnRSYW5nZTtcbiAgcHJpdmF0ZSBidWJibGVMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIsIHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdkZWJ1ZycpIHtcbiAgICAgIC8vIHNldCB0eXBlIGRlZmF1bHRzXG4gICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICBjYXNlICdtZWRpdW0nOlxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2hpZ2gnOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy5wcm9qZWN0aW9uVHlwZSkge1xuICAgICAgY2FzZSAnZ2VvQWxiZXJzJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9BbGJlcnNVc2EnOlxuICAgICAgICB0aGlzLnByb2plY3Rpb24gPSBkM19nZW9BbGJlcnNVc2EoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2dlb01lcmNhdG9yJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvTWVyY2F0b3IoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIGRyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy5idWJibGVMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5idWJibGVMYWJlbEZvcm1hdFR5cGUsIHRoaXMuYnViYmxlTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTjogJywgdGhpcy50b3BvanNvbik7XG5cbiAgICB0aGlzLnRvcG9qc29uRmVhdHVyZSA9IHRvcG9qc29uLmZlYXR1cmUodGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0pO1xuICAgIHRoaXMucHJvamVjdGlvbi5maXRTaXplKFsrdGhpcy53aWR0aCwgK3RoaXMuaGVpZ2h0XSwgdGhpcy50b3BvanNvbkZlYXR1cmUpO1xuXG4gICAgLy8gY29uc29sZS5sb2coJ1RPUE9KU09OIEZFQVRVUkU6ICcsIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcbiAgICAvLyBjb25zb2xlLmxvZygnTUVTSDogJywgdG9wb2pzb24ubWVzaCh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKTtcbiAgICAvLyBjb25zb2xlLmxvZygnREFUQTogJywgdGhpcy5kYXRhKTtcblxuICAgIGlmICh0aGlzLnNjYWxlKSB7XG4gICAgICB0aGlzLnByb2plY3Rpb24uc2NhbGUoK3RoaXMuc2NhbGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNlbnRlcikge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLmNlbnRlcih0aGlzLmNlbnRlcik7XG4gICAgfVxuXG4gICAgdGhpcy5nZW9QYXRoID0gZDNfZ2VvUGF0aCgpLnByb2plY3Rpb24odGhpcy5wcm9qZWN0aW9uKTtcblxuICAgIC8vIGJ1YmJsZSByYWRpdXMgcmFuZ2VcbiAgICBpZiAodGhpcy5kYXRhICYmICF0aGlzLmRvdCkge1xuICAgICAgdGhpcy5idWJibGVSYWRpdXMgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAgIC5yYW5nZSh0aGlzLmJ1YmJsZVNpemVSYW5nZSlcbiAgICAgICAgLmRvbWFpbihbZDNfbWluKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gK2QudmFsdWUpLCBkM19tYXgodGhpcy5kYXRhLCAoZDogYW55KSA9PiArZC52YWx1ZSldKTtcblxuICAgICAgLy8gZm9udCByYW5nZVxuICAgICAgdGhpcy5mb250UmFuZ2UgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAgIC5yYW5nZSh0aGlzLnRleHRTaXplUmFuZ2UpXG4gICAgICAgIC5kb21haW4oW2QzX21pbih0aGlzLmRhdGEsIChkOiBhbnkpID0+ICtkLnZhbHVlKSwgZDNfbWF4KHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gK2QudmFsdWUpXSk7XG4gICAgfVxuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXInKTtcbiAgICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcFZhbHVlKSB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLXZhbHVlJyk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHRoZSBjaGFydFxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHQpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHR9ICR7K3RoaXMuaGVpZ2h0ICtcbiAgICAgICAgICB0aGlzLm1hcmdpbi50b3AgK1xuICAgICAgICAgIHRoaXMubWFyZ2luLmJvdHRvbX1gXG4gICAgICApXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdjb250YWluZXInKTtcblxuICAgIC8vIG1hcFxuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdtYXAnKVxuICAgICAgLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAuZGF0YSh0aGlzLnRvcG9qc29uRmVhdHVyZS5mZWF0dXJlcylcbiAgICAgIC5qb2luKGVudGVyID0+XG4gICAgICAgIGVudGVyXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ZlYXR1cmUnKVxuICAgICAgICAgIC5hdHRyKCdkJywgdGhpcy5nZW9QYXRoKVxuICAgICAgKTtcblxuICAgIC8vIGJvcmRlcnNcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWVzaCcpXG4gICAgICAuZGF0dW0odG9wb2pzb24ubWVzaCh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKVxuICAgICAgLmF0dHIoJ2QnLCB0aGlzLmdlb1BhdGgpO1xuXG4gICAgdGhpcy5idWJibGVDb250YWluZXIgPSB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZG90cycpXG4gICAgICAuc3R5bGUoJ2NvbG9yJywgdGhpcy5jb2xvcik7XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgLy8gYnViYmxlc1xuXG4gICAgdGhpcy5idWJibGVDb250YWluZXJcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdkb3QtY2lyY2xlJylcbiAgICAgICAgICAgIC5jbGFzc2VkKCdzb2xpZCcsIHRoaXMuZG90KVxuICAgICAgICAgICAgLmF0dHIoJ2N4JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMF0pXG4gICAgICAgICAgICAuYXR0cignY3knLCBkID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVsxXSlcbiAgICAgICAgICAgIC5hdHRyKCdyJywgZCA9PiAoIXRoaXMuZG90ID8gTWF0aC5zcXJ0KHRoaXMuYnViYmxlUmFkaXVzKGQudmFsdWUpKSA6IGAke3RoaXMuZG90U2l6ZX1weGApKSxcbiAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAuYXR0cigncicsIGQgPT4gKCF0aGlzLmRvdCA/IE1hdGguc3FydCh0aGlzLmJ1YmJsZVJhZGl1cyhkLnZhbHVlKSkgOiBgJHt0aGlzLmRvdFNpemV9cHhgKSlcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgIGV4aXQgPT5cbiAgICAgICAgICBleGl0XG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAucmVtb3ZlKClcbiAgICAgICk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5idWJibGVNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJ1YmJsZU1vdXNlT3V0KGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5idWJibGVNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcblxuICAgICAgLy8gYnViYmxlIHRleHRcbiAgICAgIGlmICh0aGlzLnR5cGUgIT09ICdoaWdoJyAmJiAhdGhpcy5kb3QpIHtcbiAgICAgICAgdGhpcy5idWJibGVDb250YWluZXJcbiAgICAgICAgICAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgICAgLmpvaW4oXG4gICAgICAgICAgICBlbnRlciA9PlxuICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAgIC50ZXh0KGQgPT4gKHRoaXMuYnViYmxlTGFiZWxGb3JtYXQgPyB0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0KGQudmFsdWUpIDogZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2RvdC10ZXh0JylcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCB0aGlzLnRleHRDb2xvcilcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIGQgPT4gYCR7TWF0aC5yb3VuZCh0aGlzLmZvbnRSYW5nZShkLnZhbHVlKSl9cHhgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMF0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVsxXSlcbiAgICAgICAgICAgICAgICAuYXR0cignZHknLCAnLjRlbScpLFxuICAgICAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgLnRleHQoZCA9PiAodGhpcy5idWJibGVMYWJlbEZvcm1hdCA/IHRoaXMuYnViYmxlTGFiZWxGb3JtYXQoZC52YWx1ZSkgOiBkLnZhbHVlKSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIGQgPT4gYCR7TWF0aC5yb3VuZCh0aGlzLmZvbnRSYW5nZShkLnZhbHVlKSl9cHhgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMF0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVsxXSlcbiAgICAgICAgICAgICAgICAuYXR0cignZHknLCAnLjRlbScpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgICAgICBleGl0ID0+XG4gICAgICAgICAgICAgIGV4aXRcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGJ1YmJsZU1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmRvdC1jaXJjbGUnKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5kb3QtY2lyY2xlJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2FjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy50b29sdGlwU2hvdyhkYXRhLCBub2Rlc1tpbmRleF0pO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBidWJibGVNb3VzZU91dCA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmRvdC1jaXJjbGUnKVxuICAgICAgLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGJ1YmJsZU1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChkYXRhLCBub2RlKSA9PiB7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXInKS5odG1sKGQgPT4gYCR7ZGF0YS5sYWJlbH1gKTtcblxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcFZhbHVlKSB7XG4gICAgICB0aGlzLnRvb2x0aXBcbiAgICAgICAgLnNlbGVjdCgnLnRvb2x0aXAtdmFsdWUnKVxuICAgICAgICAuaHRtbChkID0+ICh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA/IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfWAgOiBgJHtkYXRhLnZhbHVlfWApKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0V2lkdGggPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodCArIDg7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAkeytzY3JvbGxbMV0gKyArZGltZW5zaW9ucy50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0fXB4YCk7IC8vXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSArICtkaW1lbnNpb25zLmxlZnQgLSB0b29sdGlwT2Zmc2V0V2lkdGggKyArZGltZW5zaW9ucy53aWR0aCAvIDJ9cHhgKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xufVxuIl19
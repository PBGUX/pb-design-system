/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, scaleLinear as d3_scaleLinear, min as d3_min, max as d3_max, event as d3_event, geoPath as d3_geoPath, geoAlbers as d3_geoAlbers, geoAlbersUsa as d3_geoAlbersUsa, geoMercator as d3_geoMercator } from 'd3';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1idWJibGUtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LWJ1YmJsZS1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE9BQU8sRUFDTCxNQUFNLElBQUksU0FBUyxFQUNuQixXQUFXLElBQUksY0FBYyxFQUM3QixHQUFHLElBQUksTUFBTSxFQUNiLEdBQUcsSUFBSSxNQUFNLEVBQ2IsS0FBSyxJQUFJLFFBQVEsRUFDakIsT0FBTyxJQUFJLFVBQVUsRUFDckIsU0FBUyxJQUFJLFlBQVksRUFDekIsWUFBWSxJQUFJLGVBQWUsRUFDL0IsV0FBVyxJQUFJLGNBQWMsRUFDOUIsTUFBTSxJQUFJLENBQUM7QUFFWixPQUFPLEtBQUssUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUVyQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQVN2RCxNQUFNLE9BQU8seUJBQXlCOzs7Ozs7SUFxR3BDLFlBQW9CLFFBQW9CLEVBQVUsT0FBeUIsRUFBVSxRQUE0QjtRQUE3RixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQW5HakgsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixtQkFBYyxHQUFHLElBQUksQ0FBQztRQVN0QixZQUFPLEdBQUcsRUFBRSxDQUFDO1FBTWIsVUFBSyxHQUFHLElBQUksQ0FBQztRQUdiLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFHZCxVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osV0FBTSxHQUFHLEdBQUcsQ0FBQztRQUdiLFNBQUksR0FBZ0MsUUFBUSxDQUFDLENBQUMsa0NBQWtDOztRQUdoRixRQUFHLEdBQUcsS0FBSyxDQUFDO1FBR1osY0FBUyxHQUFHLENBQUMsQ0FBQztRQUdkLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBR2hCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBR2pCLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFHZixVQUFLLEdBQUcsU0FBUyxDQUFDO1FBR2xCLGNBQVMsR0FBRyxNQUFNLENBQUM7UUFHbkIsa0JBQWEsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUd6QixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBR1osb0JBQWUsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUc5QiwwQkFBcUIsR0FBYSxJQUFJLENBQUM7UUFHdkMsNEJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBRzdCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBR3BCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUd6QiwyQkFBc0IsR0FBYSxJQUFJLENBQUM7UUFHeEMsNkJBQXdCLEdBQUcsRUFBRSxDQUFDO1FBRzlCLFlBQU8sR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUczRCxZQUFPLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUE4SjNELGdCQUFXOzs7UUFBRyxHQUFHLEVBQUU7WUFDakIsVUFBVTtZQUVWLElBQUksQ0FBQyxlQUFlO2lCQUNqQixTQUFTLENBQUMsUUFBUSxDQUFDO2lCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDZixJQUFJOzs7O1lBQ0gsS0FBSyxDQUFDLEVBQUUsQ0FDTixLQUFLO2lCQUNGLE1BQU0sQ0FBQyxRQUFRLENBQUM7aUJBQ2hCLElBQUksQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO2lCQUMzQixPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQzFCLElBQUksQ0FBQyxJQUFJOzs7O1lBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztpQkFDOUQsSUFBSSxDQUFDLElBQUk7Ozs7WUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO2lCQUM5RCxJQUFJLENBQUMsR0FBRzs7OztZQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBQzs7OztZQUM5RixNQUFNLENBQUMsRUFBRSxDQUNQLE1BQU07aUJBQ0gsVUFBVSxFQUFFO2lCQUNaLFFBQVEsQ0FBQyxJQUFJLENBQUM7aUJBQ2QsSUFBSSxDQUFDLElBQUk7Ozs7WUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO2lCQUM5RCxJQUFJLENBQUMsSUFBSTs7OztZQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7aUJBQzlELElBQUksQ0FBQyxHQUFHOzs7O1lBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxD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Q0FDYzs7SUFFZCxnREFDZ0I7O0lBRWhCLGlEQUNpQjs7SUFFakIsK0NBQ2U7O0lBRWYsMENBQ2tCOztJQUVsQiw4Q0FDbUI7O0lBRW5CLGtEQUN5Qjs7SUFFekIsNENBQ1k7O0lBRVosb0RBQzhCOztJQUU5QiwwREFDdUM7O0lBRXZDLDREQUM2Qjs7SUFFN0IsZ0RBQ29COztJQUVwQixxREFDeUI7O0lBRXpCLDJEQUN3Qzs7SUFFeEMsNkRBQzhCOztJQUU5Qiw0Q0FDMkQ7O0lBRTNELDRDQUMyRDs7Ozs7SUFFM0QsK0NBQW1COzs7OztJQUNuQiw0Q0FBZ0I7Ozs7O0lBQ2hCLG9EQUF3Qjs7Ozs7SUFDeEIsMENBQWM7Ozs7O0lBQ2Qsd0NBQVk7Ozs7O0lBQ1osMkNBQWU7Ozs7O0lBQ2Ysb0RBQXdCOzs7OztJQUN4QixpREFBcUI7Ozs7O0lBQ3JCLDhDQUFrQjs7Ozs7SUFDbEIsc0RBQTBCOzs7OztJQUMxQiw0Q0FBZ0I7Ozs7O0lBQ2hCLHVEQUEyQjs7SUFpSjNCLGdEQTBFRTs7SUFFRixvREFjRTs7SUFFRixtREFPRTs7SUFFRixxREFFRTs7Ozs7SUFFRixnREFrQkU7Ozs7O0lBRUYsZ0RBRUU7Ozs7O0lBOVFVLDZDQUE0Qjs7Ozs7SUFBRSw0Q0FBaUM7Ozs7O0lBQUUsNkNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7XG4gIHNlbGVjdCBhcyBkM19zZWxlY3QsXG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBtaW4gYXMgZDNfbWluLFxuICBtYXggYXMgZDNfbWF4LFxuICBldmVudCBhcyBkM19ldmVudCxcbiAgZ2VvUGF0aCBhcyBkM19nZW9QYXRoLFxuICBnZW9BbGJlcnMgYXMgZDNfZ2VvQWxiZXJzLFxuICBnZW9BbGJlcnNVc2EgYXMgZDNfZ2VvQWxiZXJzVXNhLFxuICBnZW9NZXJjYXRvciBhcyBkM19nZW9NZXJjYXRvclxufSBmcm9tICdkMyc7XG5cbmltcG9ydCAqIGFzIHRvcG9qc29uIGZyb20gJ3RvcG9qc29uJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpNYXBEYXRhIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotYnViYmxlLW1hcCcsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgRGF0YXZpekJ1YmJsZU1hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtYnViYmxlLW1hcCcpXG4gIGJ1YmJsZU1hcENsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpek1hcERhdGE+O1xuXG4gIEBJbnB1dCgpXG4gIHRvcG9qc29uO1xuXG4gIEBJbnB1dCgpXG4gIGZlYXR1cmUgPSAnJztcblxuICBASW5wdXQoKVxuICBwcm9qZWN0aW9uVHlwZTtcblxuICBASW5wdXQoKVxuICBzY2FsZSA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgY2VudGVyID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwNjtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ21lZGl1bScgfCAnaGlnaCcgfCAnZGVidWcnID0gJ21lZGl1bSc7IC8vIGRlYnVnIHRvIHNob3cgYWxsIGNoYXJ0IG9wdGlvbnNcblxuICBASW5wdXQoKVxuICBkb3QgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkxlZnQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yID0gJyNlZjgyMDAnO1xuXG4gIEBJbnB1dCgpXG4gIHRleHRDb2xvciA9ICcjZmZmJztcblxuICBASW5wdXQoKVxuICB0ZXh0U2l6ZVJhbmdlID0gWzE0LCAyNF07XG5cbiAgQElucHV0KClcbiAgZG90U2l6ZSA9IDQ7XG5cbiAgQElucHV0KClcbiAgYnViYmxlU2l6ZVJhbmdlID0gWzUwMCwgMjAwMF07XG5cbiAgQElucHV0KClcbiAgYnViYmxlTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgYnViYmxlTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBoaWRlVG9vbHRpcCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwVmFsdWUgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBwcm9qZWN0aW9uO1xuICBwcml2YXRlIGdlb1BhdGg7XG4gIHByaXZhdGUgdG9wb2pzb25GZWF0dXJlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgYnViYmxlQ29udGFpbmVyO1xuICBwcml2YXRlIGJ1YmJsZVJhZGl1cztcbiAgcHJpdmF0ZSBmb250UmFuZ2U7XG4gIHByaXZhdGUgYnViYmxlTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyLCBwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XG4gICAgICAvLyBzZXQgdHlwZSBkZWZhdWx0c1xuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdoaWdoJzpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMucHJvamVjdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgJ2dlb0FsYmVycyc6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb0FsYmVycygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZ2VvQWxiZXJzVXNhJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzVXNhKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9NZXJjYXRvcic6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb01lcmNhdG9yKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBkcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMuYnViYmxlTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMuYnViYmxlTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnVE9QT0pTT046ICcsIHRoaXMudG9wb2pzb24pO1xuXG4gICAgdGhpcy50b3BvanNvbkZlYXR1cmUgPSB0b3BvanNvbi5mZWF0dXJlKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLmZlYXR1cmVdKTtcbiAgICB0aGlzLnByb2plY3Rpb24uZml0U2l6ZShbK3RoaXMud2lkdGgsICt0aGlzLmhlaWdodF0sIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTiBGRUFUVVJFOiAnLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG4gICAgLy8gY29uc29sZS5sb2coJ01FU0g6ICcsIHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ0RBVEE6ICcsIHRoaXMuZGF0YSk7XG5cbiAgICBpZiAodGhpcy5zY2FsZSkge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLnNjYWxlKCt0aGlzLnNjYWxlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jZW50ZXIpIHtcbiAgICAgIHRoaXMucHJvamVjdGlvbi5jZW50ZXIodGhpcy5jZW50ZXIpO1xuICAgIH1cblxuICAgIHRoaXMuZ2VvUGF0aCA9IGQzX2dlb1BhdGgoKS5wcm9qZWN0aW9uKHRoaXMucHJvamVjdGlvbik7XG5cbiAgICAvLyBidWJibGUgcmFkaXVzIHJhbmdlXG4gICAgaWYgKHRoaXMuZGF0YSAmJiAhdGhpcy5kb3QpIHtcbiAgICAgIHRoaXMuYnViYmxlUmFkaXVzID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgICAucmFuZ2UodGhpcy5idWJibGVTaXplUmFuZ2UpXG4gICAgICAgIC5kb21haW4oW2QzX21pbih0aGlzLmRhdGEsIChkOiBhbnkpID0+ICtkLnZhbHVlKSwgZDNfbWF4KHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gK2QudmFsdWUpXSk7XG5cbiAgICAgIC8vIGZvbnQgcmFuZ2VcbiAgICAgIHRoaXMuZm9udFJhbmdlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgICAucmFuZ2UodGhpcy50ZXh0U2l6ZVJhbmdlKVxuICAgICAgICAuZG9tYWluKFtkM19taW4odGhpcy5kYXRhLCAoZDogYW55KSA9PiArZC52YWx1ZSksIGQzX21heCh0aGlzLmRhdGEsIChkOiBhbnkpID0+ICtkLnZhbHVlKV0pO1xuICAgIH1cblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgc291dGgnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcblxuICAgICAgLy8gdG9vbHRpcCBoZWFkZXJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XG4gICAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXBWYWx1ZSkgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC12YWx1ZScpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0fSAkeyt0aGlzLmhlaWdodCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4udG9wICtcbiAgICAgICAgICB0aGlzLm1hcmdpbi5ib3R0b219YFxuICAgICAgKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY29udGFpbmVyJyk7XG5cbiAgICAvLyBtYXBcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy50b3BvanNvbkZlYXR1cmUuZmVhdHVyZXMpXG4gICAgICAuam9pbihlbnRlciA9PlxuICAgICAgICBlbnRlclxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdmZWF0dXJlJylcbiAgICAgICAgICAuYXR0cignZCcsIHRoaXMuZ2VvUGF0aClcbiAgICAgICk7XG5cbiAgICAvLyBib3JkZXJzXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21lc2gnKVxuICAgICAgLmRhdHVtKHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSlcbiAgICAgIC5hdHRyKCdkJywgdGhpcy5nZW9QYXRoKTtcblxuICAgIHRoaXMuYnViYmxlQ29udGFpbmVyID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2RvdHMnKVxuICAgICAgLnN0eWxlKCdjb2xvcicsIHRoaXMuY29sb3IpO1xuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIC8vIGJ1YmJsZXNcblxuICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZG90LWNpcmNsZScpXG4gICAgICAgICAgICAuY2xhc3NlZCgnc29saWQnLCB0aGlzLmRvdClcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAuYXR0cigncicsIGQgPT4gKCF0aGlzLmRvdCA/IE1hdGguc3FydCh0aGlzLmJ1YmJsZVJhZGl1cyhkLnZhbHVlKSkgOiBgJHt0aGlzLmRvdFNpemV9cHhgKSksXG4gICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cignY3gnLCBkID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVswXSlcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzFdKVxuICAgICAgICAgICAgLmF0dHIoJ3InLCBkID0+ICghdGhpcy5kb3QgPyBNYXRoLnNxcnQodGhpcy5idWJibGVSYWRpdXMoZC52YWx1ZSkpIDogYCR7dGhpcy5kb3RTaXplfXB4YCkpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICBleGl0ID0+XG4gICAgICAgICAgZXhpdFxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG4gICAgICApO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLmJ1YmJsZUNvbnRhaW5lclxuICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYnViYmxlTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5idWJibGVNb3VzZU91dChkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYnViYmxlTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG5cbiAgICAgIC8vIGJ1YmJsZSB0ZXh0XG4gICAgICBpZiAodGhpcy50eXBlICE9PSAnaGlnaCcgJiYgIXRoaXMuZG90KSB7XG4gICAgICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAgICAgLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAgIC5qb2luKFxuICAgICAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgICAudGV4dChkID0+ICh0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0ID8gdGhpcy5idWJibGVMYWJlbEZvcm1hdChkLnZhbHVlKSA6IGQudmFsdWUpKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdkb3QtdGV4dCcpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgdGhpcy50ZXh0Q29sb3IpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBkID0+IGAke01hdGgucm91bmQodGhpcy5mb250UmFuZ2UoZC52YWx1ZSkpfXB4YClcbiAgICAgICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2R5JywgJy40ZW0nKSxcbiAgICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgIC50ZXh0KGQgPT4gKHRoaXMuYnViYmxlTGFiZWxGb3JtYXQgPyB0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0KGQudmFsdWUpIDogZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBkID0+IGAke01hdGgucm91bmQodGhpcy5mb250UmFuZ2UoZC52YWx1ZSkpfXB4YClcbiAgICAgICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2R5JywgJy40ZW0nKVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICAgICAgZXhpdCA9PlxuICAgICAgICAgICAgICBleGl0XG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlKClcbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBidWJibGVNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5kb3QtY2lyY2xlJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuZG90LWNpcmNsZScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdhY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMudG9vbHRpcFNob3coZGF0YSwgbm9kZXNbaW5kZXhdKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgYnViYmxlTW91c2VPdXQgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5kb3QtY2lyY2xlJylcbiAgICAgIC5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSlcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBidWJibGVNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZGF0YSwgbm9kZSkgPT4ge1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbChkID0+IGAke2RhdGEubGFiZWx9YCk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXBWYWx1ZSkge1xuICAgICAgdGhpcy50b29sdGlwXG4gICAgICAgIC5zZWxlY3QoJy50b29sdGlwLXZhbHVlJylcbiAgICAgICAgLmh0bWwoZCA9PiAodGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPyBgJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX1gIDogYCR7ZGF0YS52YWx1ZX1gKSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9vbHRpcE9mZnNldFdpZHRoID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0V2lkdGggLyAyO1xuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQgKyA4O1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHsrc2Nyb2xsWzFdICsgK2RpbWVuc2lvbnMudG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodH1weGApOyAvL1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAkeytzY3JvbGxbMF0gKyArZGltZW5zaW9ucy5sZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRoICsgK2RpbWVuc2lvbnMud2lkdGggLyAyfXB4YCk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcbn1cbiJdfQ==
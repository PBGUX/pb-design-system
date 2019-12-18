/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, scaleLinear as d3_scaleLinear, min as d3_min, max as d3_max, event as d3_event, geoPath as d3_geoPath, geoAlbers as d3_geoAlbers, geoAlbersUsa as d3_geoAlbersUsa, geoMercator as d3_geoMercator } from 'd3';
import * as topojson from 'topojson';
import { PbdsDatavizService } from './dataviz.service';
var DatavizBubbleMapComponent = /** @class */ (function () {
    function DatavizBubbleMapComponent(_element, _scroll, _dataviz) {
        var _this = this;
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
        function () {
            // bubbles
            _this.bubbleContainer
                .selectAll('circle')
                .data(_this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                return enter
                    .append('circle')
                    .attr('class', 'dot-circle')
                    .classed('solid', _this.dot)
                    .attr('cx', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.projection([d.longitude, d.latitude])[0]; }))
                    .attr('cy', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.projection([d.longitude, d.latitude])[1]; }))
                    .attr('r', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return (!_this.dot ? Math.sqrt(_this.bubbleRadius(d.value)) : _this.dotSize + "px"); }));
            }), (/**
             * @param {?} update
             * @return {?}
             */
            function (update) {
                return update
                    .transition()
                    .duration(1000)
                    .attr('cx', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.projection([d.longitude, d.latitude])[0]; }))
                    .attr('cy', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.projection([d.longitude, d.latitude])[1]; }))
                    .attr('r', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return (!_this.dot ? Math.sqrt(_this.bubbleRadius(d.value)) : _this.dotSize + "px"); }))
                    .transition()
                    .attr('pointer-events', 'auto');
            }), (/**
             * @param {?} exit
             * @return {?}
             */
            function (exit) {
                return exit
                    .transition()
                    .attr('pointer-events', 'none')
                    .remove();
            }));
            if (!_this.hideTooltip) {
                _this.bubbleContainer
                    .selectAll('circle')
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.bubbleMouseOver(d3_event, data, index, nodes); }))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.bubbleMouseOut(d3_event, data, index, nodes); }))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.bubbleMouseClick(d3_event, data, index, nodes); }));
                // bubble text
                if (_this.type !== 'high' && !_this.dot) {
                    _this.bubbleContainer
                        .selectAll('text')
                        .data(_this.data)
                        .join((/**
                     * @param {?} enter
                     * @return {?}
                     */
                    function (enter) {
                        return enter
                            .append('text')
                            .text((/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return (_this.bubbleLabelFormat ? _this.bubbleLabelFormat(d.value) : d.value); }))
                            .attr('class', 'dot-text')
                            .style('fill', _this.textColor)
                            .style('font-size', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return Math.round(_this.fontRange(d.value)) + "px"; }))
                            .attr('x', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.projection([d.longitude, d.latitude])[0]; }))
                            .attr('y', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.projection([d.longitude, d.latitude])[1]; }))
                            .attr('dy', '.4em');
                    }), (/**
                     * @param {?} update
                     * @return {?}
                     */
                    function (update) {
                        return update
                            .attr('pointer-events', 'none')
                            .transition()
                            .duration(1000)
                            .text((/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return (_this.bubbleLabelFormat ? _this.bubbleLabelFormat(d.value) : d.value); }))
                            .style('font-size', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return Math.round(_this.fontRange(d.value)) + "px"; }))
                            .attr('x', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.projection([d.longitude, d.latitude])[0]; }))
                            .attr('y', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.projection([d.longitude, d.latitude])[1]; }))
                            .attr('dy', '.4em')
                            .transition()
                            .attr('pointer-events', 'auto');
                    }), (/**
                     * @param {?} exit
                     * @return {?}
                     */
                    function (exit) {
                        return exit
                            .transition()
                            .attr('pointer-events', 'none')
                            .remove();
                    }));
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
        function (event, data, index, nodes) {
            _this.chart
                .selectAll('.dot-circle')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; }))
                .classed('inactive', true);
            _this.chart
                .selectAll('.dot-circle')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i === index; }))
                .classed('active', true);
            _this.tooltipShow(data, nodes[index]);
            _this.hovered.emit({ event: event, data: data });
        });
        this.bubbleMouseOut = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            _this.chart
                .selectAll('.dot-circle')
                .classed('active', false)
                .classed('inactive', false);
            _this.tooltipHide();
        });
        this.bubbleMouseClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            _this.clicked.emit({ event: event, data: data });
        });
        this.tooltipShow = (/**
         * @param {?} data
         * @param {?} node
         * @return {?}
         */
        function (data, node) {
            /** @type {?} */
            var dimensions = node.getBoundingClientRect();
            /** @type {?} */
            var scroll = _this._scroll.getScrollPosition();
            _this.tooltip.select('.tooltip-header').html((/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return "" + data.label; }));
            if (!_this.hideTooltipValue) {
                _this.tooltip
                    .select('.tooltip-value')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return (_this.tooltipValueFormat ? "" + _this.tooltipValueFormat(data.value) : "" + data.value); }));
            }
            /** @type {?} */
            var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight + 8;
            _this.tooltip.style('top', +scroll[1] + +dimensions.top - tooltipOffsetHeight + "px"); //
            _this.tooltip.style('left', +scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2 + "px");
            _this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        function () {
            _this.tooltip.style('opacity', 0);
        });
    }
    /**
     * @return {?}
     */
    DatavizBubbleMapComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
                function (d) { return +d.value; })), d3_max(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return +d.value; }))]);
            // font range
            this.fontRange = d3_scaleLinear()
                .range(this.textSizeRange)
                .domain([d3_min(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return +d.value; })), d3_max(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return +d.value; }))]);
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
            .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + (+this.width + this.margin.left + this.margin.right) + " " + (+this.height +
            this.margin.top +
            this.margin.bottom))
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
        function (enter) {
            return enter
                .append('path')
                .attr('class', 'feature')
                .attr('d', _this.geoPath);
        }));
        // borders
        this.svg
            .append('path')
            .attr('class', 'mesh')
            .datum(topojson.mesh(this.topojson, this.topojson.objects[this.feature], (/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return a !== b; })))
            .attr('d', this.geoPath);
        this.bubbleContainer = this.svg
            .append('g')
            .attr('class', 'dots')
            .style('color', this.color);
        this.updateChart();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    DatavizBubbleMapComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    };
    /**
     * @return {?}
     */
    DatavizBubbleMapComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.tooltip)
            this.tooltip.remove();
    };
    DatavizBubbleMapComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-bubble-map',
                    template: "",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    DatavizBubbleMapComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ViewportScroller },
        { type: PbdsDatavizService }
    ]; };
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
    return DatavizBubbleMapComponent;
}());
export { DatavizBubbleMapComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1idWJibGUtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LWJ1YmJsZS1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE9BQU8sRUFDTCxNQUFNLElBQUksU0FBUyxFQUNuQixXQUFXLElBQUksY0FBYyxFQUM3QixHQUFHLElBQUksTUFBTSxFQUNiLEdBQUcsSUFBSSxNQUFNLEVBQ2IsS0FBSyxJQUFJLFFBQVEsRUFDakIsT0FBTyxJQUFJLFVBQVUsRUFDckIsU0FBUyxJQUFJLFlBQVksRUFDekIsWUFBWSxJQUFJLGVBQWUsRUFDL0IsV0FBVyxJQUFJLGNBQWMsRUFDOUIsTUFBTSxJQUFJLENBQUM7QUFFWixPQUFPLEtBQUssUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUVyQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUd2RDtJQTJHRSxtQ0FBb0IsUUFBb0IsRUFBVSxPQUF5QixFQUFVLFFBQTRCO1FBQWpILGlCQUFxSDtRQUFqRyxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQW5HakgsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixtQkFBYyxHQUFHLElBQUksQ0FBQztRQVN0QixZQUFPLEdBQUcsRUFBRSxDQUFDO1FBTWIsVUFBSyxHQUFHLElBQUksQ0FBQztRQUdiLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFHZCxVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osV0FBTSxHQUFHLEdBQUcsQ0FBQztRQUdiLFNBQUksR0FBZ0MsUUFBUSxDQUFDLENBQUMsa0NBQWtDOztRQUdoRixRQUFHLEdBQUcsS0FBSyxDQUFDO1FBR1osY0FBUyxHQUFHLENBQUMsQ0FBQztRQUdkLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBR2hCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBR2pCLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFHZixVQUFLLEdBQUcsU0FBUyxDQUFDO1FBR2xCLGNBQVMsR0FBRyxNQUFNLENBQUM7UUFHbkIsa0JBQWEsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUd6QixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBR1osb0JBQWUsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUc5QiwwQkFBcUIsR0FBYSxJQUFJLENBQUM7UUFHdkMsNEJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBRzdCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBR3BCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUd6QiwyQkFBc0IsR0FBYSxJQUFJLENBQUM7UUFHeEMsNkJBQXdCLEdBQUcsRUFBRSxDQUFDO1FBRzlCLFlBQU8sR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUczRCxZQUFPLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUE4SjNELGdCQUFXOzs7UUFBRztZQUNaLFVBQVU7WUFFVixLQUFJLENBQUMsZUFBZTtpQkFDakIsU0FBUyxDQUFDLFFBQVEsQ0FBQztpQkFDbkIsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUM7aUJBQ2YsSUFBSTs7OztZQUNILFVBQUEsS0FBSztnQkFDSCxPQUFBLEtBQUs7cUJBQ0YsTUFBTSxDQUFDLFFBQVEsQ0FBQztxQkFDaEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7cUJBQzNCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLEdBQUcsQ0FBQztxQkFDMUIsSUFBSSxDQUFDLElBQUk7Ozs7Z0JBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBN0MsQ0FBNkMsRUFBQztxQkFDOUQsSUFBSSxDQUFDLElBQUk7Ozs7Z0JBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBN0MsQ0FBNkMsRUFBQztxQkFDOUQsSUFBSSxDQUFDLEdBQUc7Ozs7Z0JBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBSSxLQUFJLENBQUMsT0FBTyxPQUFJLENBQUMsRUFBekUsQ0FBeUUsRUFBQztZQU41RixDQU00Rjs7OztZQUM5RixVQUFBLE1BQU07Z0JBQ0osT0FBQSxNQUFNO3FCQUNILFVBQVUsRUFBRTtxQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDO3FCQUNkLElBQUksQ0FBQyxJQUFJOzs7O2dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQTdDLENBQTZDLEVBQUM7cUJBQzlELElBQUksQ0FBQyxJQUFJOzs7O2dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQTdDLENBQTZDLEVBQUM7cUJBQzlELElBQUksQ0FBQyxHQUFHOzs7O2dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUksS0FBSSxDQUFDLE9BQU8sT0FBSSxDQUFDLEVBQXpFLENBQXlFLEVBQUM7cUJBQ3pGLFVBQVUsRUFBRTtxQkFDWixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDO1lBUGpDLENBT2lDOzs7O1lBQ25DLFVBQUEsSUFBSTtnQkFDRixPQUFBLElBQUk7cUJBQ0QsVUFBVSxFQUFFO3FCQUNaLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUM7cUJBQzlCLE1BQU0sRUFBRTtZQUhYLENBR1csRUFDZCxDQUFDO1lBRUosSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3JCLEtBQUksQ0FBQyxlQUFlO3FCQUNqQixTQUFTLENBQUMsUUFBUSxDQUFDO3FCQUNuQixFQUFFLENBQUMsV0FBVzs7Ozs7O2dCQUFFLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLElBQUssT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFsRCxDQUFrRCxFQUFDO3FCQUMzRixFQUFFLENBQUMsVUFBVTs7Ozs7O2dCQUFFLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLElBQUssT0FBQSxLQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFqRCxDQUFpRCxFQUFDO3FCQUN6RixFQUFFLENBQUMsT0FBTzs7Ozs7O2dCQUFFLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLElBQUssT0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQW5ELENBQW1ELEVBQUMsQ0FBQztnQkFFNUYsY0FBYztnQkFDZCxJQUFJLEtBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLENBQUMsS0FBSSxDQUFDLEdBQUcsRUFBRTtvQkFDckMsS0FBSSxDQUFDLGVBQWU7eUJBQ2pCLFNBQVMsQ0FBQyxNQUFNLENBQUM7eUJBQ2pCLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDO3lCQUNmLElBQUk7Ozs7b0JBQ0gsVUFBQSxLQUFLO3dCQUNILE9BQUEsS0FBSzs2QkFDRixNQUFNLENBQUMsTUFBTSxDQUFDOzZCQUNkLElBQUk7Ozs7d0JBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFwRSxDQUFvRSxFQUFDOzZCQUMvRSxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQzs2QkFDekIsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUMsU0FBUyxDQUFDOzZCQUM3QixLQUFLLENBQUMsV0FBVzs7Ozt3QkFBRSxVQUFBLENBQUMsSUFBSSxPQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBSSxFQUExQyxDQUEwQyxFQUFDOzZCQUNuRSxJQUFJLENBQUMsR0FBRzs7Ozt3QkFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUE3QyxDQUE2QyxFQUFDOzZCQUM3RCxJQUFJLENBQUMsR0FBRzs7Ozt3QkFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUE3QyxDQUE2QyxFQUFDOzZCQUM3RCxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztvQkFSckIsQ0FRcUI7Ozs7b0JBQ3ZCLFVBQUEsTUFBTTt3QkFDSixPQUFBLE1BQU07NkJBQ0gsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQzs2QkFDOUIsVUFBVSxFQUFFOzZCQUNaLFFBQVEsQ0FBQyxJQUFJLENBQUM7NkJBQ2QsSUFBSTs7Ozt3QkFBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQXBFLENBQW9FLEVBQUM7NkJBQy9FLEtBQUssQ0FBQyxXQUFXOzs7O3dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFJLEVBQTFDLENBQTBDLEVBQUM7NkJBQ25FLElBQUksQ0FBQyxHQUFHOzs7O3dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQTdDLENBQTZDLEVBQUM7NkJBQzdELElBQUksQ0FBQyxHQUFHOzs7O3dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQTdDLENBQTZDLEVBQUM7NkJBQzdELElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDOzZCQUNsQixVQUFVLEVBQUU7NkJBQ1osSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQztvQkFWakMsQ0FVaUM7Ozs7b0JBQ25DLFVBQUEsSUFBSTt3QkFDRixPQUFBLElBQUk7NkJBQ0QsVUFBVSxFQUFFOzZCQUNaLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUM7NkJBQzlCLE1BQU0sRUFBRTtvQkFIWCxDQUdXLEVBQ2QsQ0FBQztpQkFDTDthQUNGO1FBQ0gsQ0FBQyxFQUFDO1FBRUYsb0JBQWU7Ozs7Ozs7UUFBRyxVQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUs7WUFDMUMsS0FBSSxDQUFDLEtBQUs7aUJBQ1AsU0FBUyxDQUFDLGFBQWEsQ0FBQztpQkFDeEIsTUFBTTs7Ozs7WUFBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEtBQUssS0FBSyxFQUFYLENBQVcsRUFBQztpQkFDN0IsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU3QixLQUFJLENBQUMsS0FBSztpQkFDUCxTQUFTLENBQUMsYUFBYSxDQUFDO2lCQUN4QixNQUFNOzs7OztZQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsS0FBSyxLQUFLLEVBQVgsQ0FBVyxFQUFDO2lCQUM3QixPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTNCLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRXJDLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsRUFBQztRQUVGLG1CQUFjOzs7Ozs7O1FBQUcsVUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLO1lBQ3pDLEtBQUksQ0FBQyxLQUFLO2lCQUNQLFNBQVMsQ0FBQyxhQUFhLENBQUM7aUJBQ3hCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDO2lCQUN4QixPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTlCLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLEVBQUM7UUFFRixxQkFBZ0I7Ozs7Ozs7UUFBRyxVQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUs7WUFDM0MsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxDQUFDLENBQUM7UUFDckMsQ0FBQyxFQUFDO1FBRU0sZ0JBQVc7Ozs7O1FBQUcsVUFBQyxJQUFJLEVBQUUsSUFBSTs7Z0JBQ3pCLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUU7O2dCQUN6QyxNQUFNLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtZQUUvQyxLQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUk7Ozs7WUFBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUcsSUFBSSxDQUFDLEtBQU8sRUFBZixDQUFlLEVBQUMsQ0FBQztZQUVsRSxJQUFJLENBQUMsS0FBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUMxQixLQUFJLENBQUMsT0FBTztxQkFDVCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7cUJBQ3hCLElBQUk7Ozs7Z0JBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsS0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFHLElBQUksQ0FBQyxLQUFPLENBQUMsRUFBdEYsQ0FBc0YsRUFBQyxDQUFDO2FBQ3RHOztnQkFFSyxrQkFBa0IsR0FBRyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxHQUFHLENBQUM7O2dCQUN6RCxtQkFBbUIsR0FBRyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsWUFBWSxHQUFHLENBQUM7WUFFakUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsT0FBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hGLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLENBQUMsT0FBSSxDQUFDLENBQUM7WUFDOUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsRUFBQztRQUVNLGdCQUFXOzs7UUFBRztZQUNwQixLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxFQUFDO0lBOVFrSCxDQUFDOzs7O0lBRXJILDRDQUFROzs7SUFBUjtRQUFBLGlCQWlJQztRQWhJQyxJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1osR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFDcEIsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDeEIsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVk7WUFDMUIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVU7U0FDdkIsQ0FBQztRQUVGLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7WUFDekIsb0JBQW9CO1lBQ3BCLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDakIsS0FBSyxRQUFRO29CQUNYLE1BQU07Z0JBRVIsS0FBSyxNQUFNO29CQUNULE1BQU07YUFDVDtTQUNGO1FBRUQsUUFBUSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQzNCLEtBQUssV0FBVztnQkFDZCxJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksRUFBRSxDQUFDO2dCQUNqQyxNQUFNO1lBRVIsS0FBSyxjQUFjO2dCQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLGVBQWUsRUFBRSxDQUFDO2dCQUNwQyxNQUFNO1lBRVIsS0FBSyxhQUFhO2dCQUNoQixJQUFJLENBQUMsVUFBVSxHQUFHLGNBQWMsRUFBRSxDQUFDO2dCQUNuQyxNQUFNO1lBRVI7Z0JBQ0UsTUFBTTtTQUNUO1FBRUQsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDMUcsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUU3Ryw0Q0FBNEM7UUFFNUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDNUYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTNFLDJEQUEyRDtRQUMzRCwrR0FBK0c7UUFDL0csb0NBQW9DO1FBRXBDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXhELHNCQUFzQjtRQUN0QixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsY0FBYyxFQUFFO2lCQUNqQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztpQkFDM0IsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJOzs7O2dCQUFFLFVBQUMsQ0FBTSxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFSLENBQVEsRUFBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSTs7OztnQkFBRSxVQUFDLENBQU0sSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBUixDQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUYsYUFBYTtZQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsY0FBYyxFQUFFO2lCQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztpQkFDekIsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJOzs7O2dCQUFFLFVBQUMsQ0FBTSxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFSLENBQVEsRUFBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSTs7OztnQkFBRSxVQUFDLENBQU0sSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBUixDQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0Y7UUFFRCxVQUFVO1FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO2lCQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDO2lCQUNiLElBQUksQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUM7aUJBQ25DLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2lCQUNuQixJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUNBQWlDO1lBRWpFLGlCQUFpQjtZQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztTQUN2RjtRQUVELG1CQUFtQjtRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFaEYsbUJBQW1CO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUs7YUFDbEIsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUNiLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ2pFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQ25FLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDO2FBQzFCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxlQUFlLENBQUM7YUFDNUMsSUFBSSxDQUNILFNBQVMsRUFDVCxNQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxVQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssV0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQzVHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztZQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFFLENBQ3ZCO2FBQ0EsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFOUIsTUFBTTtRQUNOLElBQUksQ0FBQyxHQUFHO2FBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO2FBQ3BCLFNBQVMsQ0FBQyxNQUFNLENBQUM7YUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO2FBQ25DLElBQUk7Ozs7UUFBQyxVQUFBLEtBQUs7WUFDVCxPQUFBLEtBQUs7aUJBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQztpQkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztpQkFDeEIsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDO1FBSDFCLENBRzBCLEVBQzNCLENBQUM7UUFFSixVQUFVO1FBQ1YsSUFBSSxDQUFDLEdBQUc7YUFDTCxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7YUFDckIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDOzs7OztRQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsS0FBSyxDQUFDLEVBQVAsQ0FBTyxFQUFDLENBQUM7YUFDM0YsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRzthQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7YUFDckIsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7Ozs7O0lBRUQsK0NBQVc7Ozs7SUFBWCxVQUFZLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzdDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7Ozs7SUFFRCwrQ0FBVzs7O0lBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQyxDQUFDOztnQkF4UEYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSxFQUFFO29CQUVaLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDs7OztnQkEvQkMsVUFBVTtnQkFPSCxnQkFBZ0I7Z0JBZ0JoQixrQkFBa0I7Ozs2QkFVeEIsV0FBVyxTQUFDLGtCQUFrQjtpQ0FHOUIsV0FBVyxTQUFDLDZCQUE2Qjt1QkFHekMsS0FBSzsyQkFHTCxLQUFLOzBCQUdMLEtBQUs7aUNBR0wsS0FBSzt3QkFHTCxLQUFLO3lCQUdMLEtBQUs7d0JBR0wsS0FBSzt5QkFHTCxLQUFLO3VCQUdMLEtBQUs7c0JBR0wsS0FBSzs0QkFHTCxLQUFLOzhCQUdMLEtBQUs7K0JBR0wsS0FBSzs2QkFHTCxLQUFLO3dCQUdMLEtBQUs7NEJBR0wsS0FBSztnQ0FHTCxLQUFLOzBCQUdMLEtBQUs7a0NBR0wsS0FBSzt3Q0FHTCxLQUFLOzBDQUdMLEtBQUs7OEJBR0wsS0FBSzttQ0FHTCxLQUFLO3lDQUdMLEtBQUs7MkNBR0wsS0FBSzswQkFHTCxNQUFNOzBCQUdOLE1BQU07O0lBK1JULGdDQUFDO0NBQUEsQUExWEQsSUEwWEM7U0FwWFkseUJBQXlCOzs7SUFDcEMsK0NBQ2tCOztJQUVsQixtREFDc0I7O0lBRXRCLHlDQUNnQzs7SUFFaEMsNkNBQ1M7O0lBRVQsNENBQ2E7O0lBRWIsbURBQ2U7O0lBRWYsMENBQ2E7O0lBRWIsMkNBQ2M7O0lBRWQsMENBQ1k7O0lBRVosMkNBQ2E7O0lBRWIseUNBQzZDOztJQUU3Qyx3Q0FDWTs7SUFFWiw4Q0FDYzs7SUFFZCxnREFDZ0I7O0lBRWhCLGlEQUNpQjs7SUFFakIsK0NBQ2U7O0lBRWYsMENBQ2tCOztJQUVsQiw4Q0FDbUI7O0lBRW5CLGtEQUN5Qjs7SUFFekIsNENBQ1k7O0lBRVosb0RBQzhCOztJQUU5QiwwREFDdUM7O0lBRXZDLDREQUM2Qjs7SUFFN0IsZ0RBQ29COztJQUVwQixxREFDeUI7O0lBRXpCLDJEQUN3Qzs7SUFFeEMsNkRBQzhCOztJQUU5Qiw0Q0FDMkQ7O0lBRTNELDRDQUMyRDs7Ozs7SUFFM0QsK0NBQW1COzs7OztJQUNuQiw0Q0FBZ0I7Ozs7O0lBQ2hCLG9EQUF3Qjs7Ozs7SUFDeEIsMENBQWM7Ozs7O0lBQ2Qsd0NBQVk7Ozs7O0lBQ1osMkNBQWU7Ozs7O0lBQ2Ysb0RBQXdCOzs7OztJQUN4QixpREFBcUI7Ozs7O0lBQ3JCLDhDQUFrQjs7Ozs7SUFDbEIsc0RBQTBCOzs7OztJQUMxQiw0Q0FBZ0I7Ozs7O0lBQ2hCLHVEQUEyQjs7SUFpSjNCLGdEQTBFRTs7SUFFRixvREFjRTs7SUFFRixtREFPRTs7SUFFRixxREFFRTs7Ozs7SUFFRixnREFrQkU7Ozs7O0lBRUYsZ0RBRUU7Ozs7O0lBOVFVLDZDQUE0Qjs7Ozs7SUFBRSw0Q0FBaUM7Ozs7O0lBQUUsNkNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7XG4gIHNlbGVjdCBhcyBkM19zZWxlY3QsXG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBtaW4gYXMgZDNfbWluLFxuICBtYXggYXMgZDNfbWF4LFxuICBldmVudCBhcyBkM19ldmVudCxcbiAgZ2VvUGF0aCBhcyBkM19nZW9QYXRoLFxuICBnZW9BbGJlcnMgYXMgZDNfZ2VvQWxiZXJzLFxuICBnZW9BbGJlcnNVc2EgYXMgZDNfZ2VvQWxiZXJzVXNhLFxuICBnZW9NZXJjYXRvciBhcyBkM19nZW9NZXJjYXRvclxufSBmcm9tICdkMyc7XG5cbmltcG9ydCAqIGFzIHRvcG9qc29uIGZyb20gJ3RvcG9qc29uJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpNYXBEYXRhIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotYnViYmxlLW1hcCcsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgRGF0YXZpekJ1YmJsZU1hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtYnViYmxlLW1hcCcpXG4gIGJ1YmJsZU1hcENsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpek1hcERhdGE+O1xuXG4gIEBJbnB1dCgpXG4gIHRvcG9qc29uO1xuXG4gIEBJbnB1dCgpXG4gIGZlYXR1cmUgPSAnJztcblxuICBASW5wdXQoKVxuICBwcm9qZWN0aW9uVHlwZTtcblxuICBASW5wdXQoKVxuICBzY2FsZSA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgY2VudGVyID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwNjtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ21lZGl1bScgfCAnaGlnaCcgfCAnZGVidWcnID0gJ21lZGl1bSc7IC8vIGRlYnVnIHRvIHNob3cgYWxsIGNoYXJ0IG9wdGlvbnNcblxuICBASW5wdXQoKVxuICBkb3QgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkxlZnQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yID0gJyNlZjgyMDAnO1xuXG4gIEBJbnB1dCgpXG4gIHRleHRDb2xvciA9ICcjZmZmJztcblxuICBASW5wdXQoKVxuICB0ZXh0U2l6ZVJhbmdlID0gWzE0LCAyNF07XG5cbiAgQElucHV0KClcbiAgZG90U2l6ZSA9IDQ7XG5cbiAgQElucHV0KClcbiAgYnViYmxlU2l6ZVJhbmdlID0gWzUwMCwgMjAwMF07XG5cbiAgQElucHV0KClcbiAgYnViYmxlTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgYnViYmxlTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBoaWRlVG9vbHRpcCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwVmFsdWUgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBwcm9qZWN0aW9uO1xuICBwcml2YXRlIGdlb1BhdGg7XG4gIHByaXZhdGUgdG9wb2pzb25GZWF0dXJlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgYnViYmxlQ29udGFpbmVyO1xuICBwcml2YXRlIGJ1YmJsZVJhZGl1cztcbiAgcHJpdmF0ZSBmb250UmFuZ2U7XG4gIHByaXZhdGUgYnViYmxlTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyLCBwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XG4gICAgICAvLyBzZXQgdHlwZSBkZWZhdWx0c1xuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdoaWdoJzpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMucHJvamVjdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgJ2dlb0FsYmVycyc6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb0FsYmVycygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZ2VvQWxiZXJzVXNhJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzVXNhKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9NZXJjYXRvcic6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb01lcmNhdG9yKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBkcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMuYnViYmxlTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMuYnViYmxlTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnVE9QT0pTT046ICcsIHRoaXMudG9wb2pzb24pO1xuXG4gICAgdGhpcy50b3BvanNvbkZlYXR1cmUgPSB0b3BvanNvbi5mZWF0dXJlKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLmZlYXR1cmVdKTtcbiAgICB0aGlzLnByb2plY3Rpb24uZml0U2l6ZShbK3RoaXMud2lkdGgsICt0aGlzLmhlaWdodF0sIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTiBGRUFUVVJFOiAnLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG4gICAgLy8gY29uc29sZS5sb2coJ01FU0g6ICcsIHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ0RBVEE6ICcsIHRoaXMuZGF0YSk7XG5cbiAgICBpZiAodGhpcy5zY2FsZSkge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLnNjYWxlKCt0aGlzLnNjYWxlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jZW50ZXIpIHtcbiAgICAgIHRoaXMucHJvamVjdGlvbi5jZW50ZXIodGhpcy5jZW50ZXIpO1xuICAgIH1cblxuICAgIHRoaXMuZ2VvUGF0aCA9IGQzX2dlb1BhdGgoKS5wcm9qZWN0aW9uKHRoaXMucHJvamVjdGlvbik7XG5cbiAgICAvLyBidWJibGUgcmFkaXVzIHJhbmdlXG4gICAgaWYgKHRoaXMuZGF0YSAmJiAhdGhpcy5kb3QpIHtcbiAgICAgIHRoaXMuYnViYmxlUmFkaXVzID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgICAucmFuZ2UodGhpcy5idWJibGVTaXplUmFuZ2UpXG4gICAgICAgIC5kb21haW4oW2QzX21pbih0aGlzLmRhdGEsIChkOiBhbnkpID0+ICtkLnZhbHVlKSwgZDNfbWF4KHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gK2QudmFsdWUpXSk7XG5cbiAgICAgIC8vIGZvbnQgcmFuZ2VcbiAgICAgIHRoaXMuZm9udFJhbmdlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgICAucmFuZ2UodGhpcy50ZXh0U2l6ZVJhbmdlKVxuICAgICAgICAuZG9tYWluKFtkM19taW4odGhpcy5kYXRhLCAoZDogYW55KSA9PiArZC52YWx1ZSksIGQzX21heCh0aGlzLmRhdGEsIChkOiBhbnkpID0+ICtkLnZhbHVlKV0pO1xuICAgIH1cblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgc291dGgnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcblxuICAgICAgLy8gdG9vbHRpcCBoZWFkZXJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XG4gICAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXBWYWx1ZSkgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC12YWx1ZScpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0fSAkeyt0aGlzLmhlaWdodCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4udG9wICtcbiAgICAgICAgICB0aGlzLm1hcmdpbi5ib3R0b219YFxuICAgICAgKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY29udGFpbmVyJyk7XG5cbiAgICAvLyBtYXBcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy50b3BvanNvbkZlYXR1cmUuZmVhdHVyZXMpXG4gICAgICAuam9pbihlbnRlciA9PlxuICAgICAgICBlbnRlclxuICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdmZWF0dXJlJylcbiAgICAgICAgICAuYXR0cignZCcsIHRoaXMuZ2VvUGF0aClcbiAgICAgICk7XG5cbiAgICAvLyBib3JkZXJzXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21lc2gnKVxuICAgICAgLmRhdHVtKHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSlcbiAgICAgIC5hdHRyKCdkJywgdGhpcy5nZW9QYXRoKTtcblxuICAgIHRoaXMuYnViYmxlQ29udGFpbmVyID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2RvdHMnKVxuICAgICAgLnN0eWxlKCdjb2xvcicsIHRoaXMuY29sb3IpO1xuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIC8vIGJ1YmJsZXNcblxuICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZG90LWNpcmNsZScpXG4gICAgICAgICAgICAuY2xhc3NlZCgnc29saWQnLCB0aGlzLmRvdClcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAuYXR0cigncicsIGQgPT4gKCF0aGlzLmRvdCA/IE1hdGguc3FydCh0aGlzLmJ1YmJsZVJhZGl1cyhkLnZhbHVlKSkgOiBgJHt0aGlzLmRvdFNpemV9cHhgKSksXG4gICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cignY3gnLCBkID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVswXSlcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzFdKVxuICAgICAgICAgICAgLmF0dHIoJ3InLCBkID0+ICghdGhpcy5kb3QgPyBNYXRoLnNxcnQodGhpcy5idWJibGVSYWRpdXMoZC52YWx1ZSkpIDogYCR7dGhpcy5kb3RTaXplfXB4YCkpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICBleGl0ID0+XG4gICAgICAgICAgZXhpdFxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG4gICAgICApO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLmJ1YmJsZUNvbnRhaW5lclxuICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYnViYmxlTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5idWJibGVNb3VzZU91dChkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYnViYmxlTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG5cbiAgICAgIC8vIGJ1YmJsZSB0ZXh0XG4gICAgICBpZiAodGhpcy50eXBlICE9PSAnaGlnaCcgJiYgIXRoaXMuZG90KSB7XG4gICAgICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAgICAgLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAgIC5qb2luKFxuICAgICAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgICAudGV4dChkID0+ICh0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0ID8gdGhpcy5idWJibGVMYWJlbEZvcm1hdChkLnZhbHVlKSA6IGQudmFsdWUpKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdkb3QtdGV4dCcpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgdGhpcy50ZXh0Q29sb3IpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBkID0+IGAke01hdGgucm91bmQodGhpcy5mb250UmFuZ2UoZC52YWx1ZSkpfXB4YClcbiAgICAgICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2R5JywgJy40ZW0nKSxcbiAgICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgIC50ZXh0KGQgPT4gKHRoaXMuYnViYmxlTGFiZWxGb3JtYXQgPyB0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0KGQudmFsdWUpIDogZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBkID0+IGAke01hdGgucm91bmQodGhpcy5mb250UmFuZ2UoZC52YWx1ZSkpfXB4YClcbiAgICAgICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2R5JywgJy40ZW0nKVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICAgICAgZXhpdCA9PlxuICAgICAgICAgICAgICBleGl0XG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlKClcbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBidWJibGVNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5kb3QtY2lyY2xlJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuZG90LWNpcmNsZScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdhY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMudG9vbHRpcFNob3coZGF0YSwgbm9kZXNbaW5kZXhdKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgYnViYmxlTW91c2VPdXQgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5kb3QtY2lyY2xlJylcbiAgICAgIC5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSlcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBidWJibGVNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZGF0YSwgbm9kZSkgPT4ge1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbChkID0+IGAke2RhdGEubGFiZWx9YCk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXBWYWx1ZSkge1xuICAgICAgdGhpcy50b29sdGlwXG4gICAgICAgIC5zZWxlY3QoJy50b29sdGlwLXZhbHVlJylcbiAgICAgICAgLmh0bWwoZCA9PiAodGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPyBgJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX1gIDogYCR7ZGF0YS52YWx1ZX1gKSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9vbHRpcE9mZnNldFdpZHRoID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0V2lkdGggLyAyO1xuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQgKyA4O1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHsrc2Nyb2xsWzFdICsgK2RpbWVuc2lvbnMudG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodH1weGApOyAvL1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAkeytzY3JvbGxbMF0gKyArZGltZW5zaW9ucy5sZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRoICsgK2RpbWVuc2lvbnMud2lkdGggLyAyfXB4YCk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcbn1cbiJdfQ==
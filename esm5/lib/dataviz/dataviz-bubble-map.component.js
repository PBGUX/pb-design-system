/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, format as d3_format, scaleLinear as d3_scaleLinear, min as d3_min, max as d3_max, event as d3_event, geoPath as d3_geoPath, geoAlbers as d3_geoAlbers, geoAlbersUsa as d3_geoAlbersUsa, geoMercator as d3_geoMercator } from 'd3';
import * as topojson from 'topojson';
var DatavizBubbleMapComponent = /** @class */ (function () {
    function DatavizBubbleMapComponent(_element, _scroll) {
        var _this = this;
        this._element = _element;
        this._scroll = _scroll;
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
                function (d) { return (!_this.dot ? Math.sqrt(_this.bubbleRadius(d.value)) : _this.dotSize + "px"); }));
            }), (/**
             * @param {?} exit
             * @return {?}
             */
            function (exit) { return exit.remove(); }));
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
                            .attr('dy', '.4em');
                    }), (/**
                     * @param {?} exit
                     * @return {?}
                     */
                    function (exit) { return exit.remove(); }));
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
        switch (this.bubbleLabelFormatType) {
            case 'number':
                this.bubbleLabelFormat = d3_format(this.bubbleLabelFormatString);
                break;
            default:
                this.bubbleLabelFormat = null;
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = d3_format(this.tooltipValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
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
            .attr('width', +this.width)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + +this.width + " " + (+this.height + this.margin.top + this.margin.bottom))
            .append('g')
            .attr('class', 'container');
        // map
        this.svg
            .append('g')
            .attr('class', 'map')
            .selectAll('path')
            .data(this.topojsonFeature.features)
            .enter()
            .append('path')
            .attr('class', 'feature')
            .attr('d', this.geoPath);
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
        { type: ViewportScroller }
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1idWJibGUtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LWJ1YmJsZS1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE9BQU8sRUFDTCxNQUFNLElBQUksU0FBUyxFQUNuQixNQUFNLElBQUksU0FBUyxFQUNuQixXQUFXLElBQUksY0FBYyxFQUM3QixHQUFHLElBQUksTUFBTSxFQUNiLEdBQUcsSUFBSSxNQUFNLEVBQ2IsS0FBSyxJQUFJLFFBQVEsRUFDakIsT0FBTyxJQUFJLFVBQVUsRUFDckIsU0FBUyxJQUFJLFlBQVksRUFDekIsWUFBWSxJQUFJLGVBQWUsRUFDL0IsV0FBVyxJQUFJLGNBQWMsRUFDOUIsTUFBTSxJQUFJLENBQUM7QUFFWixPQUFPLEtBQUssUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUlyQztJQTJHRSxtQ0FBb0IsUUFBb0IsRUFBVSxPQUF5QjtRQUEzRSxpQkFBK0U7UUFBM0QsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBbkczRSxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBR2xCLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBU3RCLFlBQU8sR0FBRyxFQUFFLENBQUM7UUFNYixVQUFLLEdBQUcsSUFBSSxDQUFDO1FBR2IsV0FBTSxHQUFHLElBQUksQ0FBQztRQUdkLFVBQUssR0FBRyxHQUFHLENBQUM7UUFHWixXQUFNLEdBQUcsR0FBRyxDQUFDO1FBR2IsU0FBSSxHQUFnQyxRQUFR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Q2tCOztJQUVsQiw4Q0FDbUI7O0lBRW5CLGtEQUN5Qjs7SUFFekIsNENBQ1k7O0lBRVosb0RBQzhCOztJQUU5QiwwREFDdUM7O0lBRXZDLDREQUM2Qjs7SUFFN0IsZ0RBQ29COztJQUVwQixxREFDeUI7O0lBRXpCLDJEQUN3Qzs7SUFFeEMsNkRBQzhCOztJQUU5Qiw0Q0FDMkQ7O0lBRTNELDRDQUMyRDs7Ozs7SUFFM0QsK0NBQW1COzs7OztJQUNuQiw0Q0FBZ0I7Ozs7O0lBQ2hCLG9EQUF3Qjs7Ozs7SUFDeEIsMENBQWM7Ozs7O0lBQ2Qsd0NBQVk7Ozs7O0lBQ1osMkNBQWU7Ozs7O0lBQ2Ysb0RBQXdCOzs7OztJQUN4QixpREFBcUI7Ozs7O0lBQ3JCLDhDQUFrQjs7Ozs7SUFDbEIsc0RBQTBCOzs7OztJQUMxQiw0Q0FBZ0I7Ozs7O0lBQ2hCLHVEQUEyQjs7SUE0SjNCLGdEQTZERTs7SUFFRixvREFjRTs7SUFFRixtREFPRTs7SUFFRixxREFFRTs7Ozs7SUFFRixnREFrQkU7Ozs7O0lBRUYsZ0RBRUU7Ozs7O0lBNVFVLDZDQUE0Qjs7Ozs7SUFBRSw0Q0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtcbiAgc2VsZWN0IGFzIGQzX3NlbGVjdCxcbiAgZm9ybWF0IGFzIGQzX2Zvcm1hdCxcbiAgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsXG4gIG1pbiBhcyBkM19taW4sXG4gIG1heCBhcyBkM19tYXgsXG4gIGV2ZW50IGFzIGQzX2V2ZW50LFxuICBnZW9QYXRoIGFzIGQzX2dlb1BhdGgsXG4gIGdlb0FsYmVycyBhcyBkM19nZW9BbGJlcnMsXG4gIGdlb0FsYmVyc1VzYSBhcyBkM19nZW9BbGJlcnNVc2EsXG4gIGdlb01lcmNhdG9yIGFzIGQzX2dlb01lcmNhdG9yXG59IGZyb20gJ2QzJztcblxuaW1wb3J0ICogYXMgdG9wb2pzb24gZnJvbSAndG9wb2pzb24nO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpek1hcERhdGEgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1idWJibGUtbWFwJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1idWJibGUtbWFwJylcbiAgYnViYmxlTWFwQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6TWFwRGF0YT47XG5cbiAgQElucHV0KClcbiAgdG9wb2pzb247XG5cbiAgQElucHV0KClcbiAgZmVhdHVyZSA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHByb2plY3Rpb25UeXBlO1xuXG4gIEBJbnB1dCgpXG4gIHNjYWxlID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBjZW50ZXIgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzA2O1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbWVkaXVtJyB8ICdoaWdoJyB8ICdkZWJ1ZycgPSAnbWVkaXVtJzsgLy8gZGVidWcgdG8gc2hvdyBhbGwgY2hhcnQgb3B0aW9uc1xuXG4gIEBJbnB1dCgpXG4gIGRvdCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDA7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI2VmODIwMCc7XG5cbiAgQElucHV0KClcbiAgdGV4dENvbG9yID0gJyNmZmYnO1xuXG4gIEBJbnB1dCgpXG4gIHRleHRTaXplUmFuZ2UgPSBbMTQsIDI0XTtcblxuICBASW5wdXQoKVxuICBkb3RTaXplID0gNDtcblxuICBASW5wdXQoKVxuICBidWJibGVTaXplUmFuZ2UgPSBbNTAwLCAyMDAwXTtcblxuICBASW5wdXQoKVxuICBidWJibGVMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBidWJibGVMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgaGlkZVRvb2x0aXBWYWx1ZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIHByb2plY3Rpb247XG4gIHByaXZhdGUgZ2VvUGF0aDtcbiAgcHJpdmF0ZSB0b3BvanNvbkZlYXR1cmU7XG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcbiAgcHJpdmF0ZSBidWJibGVDb250YWluZXI7XG4gIHByaXZhdGUgYnViYmxlUmFkaXVzO1xuICBwcml2YXRlIGZvbnRSYW5nZTtcbiAgcHJpdmF0ZSBidWJibGVMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XG4gICAgICAvLyBzZXQgdHlwZSBkZWZhdWx0c1xuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdoaWdoJzpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMucHJvamVjdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgJ2dlb0FsYmVycyc6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb0FsYmVycygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZ2VvQWxiZXJzVXNhJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzVXNhKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9NZXJjYXRvcic6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb01lcmNhdG9yKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMuYnViYmxlTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICB0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMuYnViYmxlTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5idWJibGVMYWJlbEZvcm1hdCA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ1RPUE9KU09OOiAnLCB0aGlzLnRvcG9qc29uKTtcblxuICAgIHRoaXMudG9wb2pzb25GZWF0dXJlID0gdG9wb2pzb24uZmVhdHVyZSh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSk7XG4gICAgdGhpcy5wcm9qZWN0aW9uLmZpdFNpemUoWyt0aGlzLndpZHRoLCArdGhpcy5oZWlnaHRdLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnVE9QT0pTT04gRkVBVFVSRTogJywgdGhpcy50b3BvanNvbkZlYXR1cmUpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdNRVNIOiAnLCB0b3BvanNvbi5tZXNoKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLmZlYXR1cmVdLCAoYSwgYikgPT4gYSAhPT0gYikpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdEQVRBOiAnLCB0aGlzLmRhdGEpO1xuXG4gICAgaWYgKHRoaXMuc2NhbGUpIHtcbiAgICAgIHRoaXMucHJvamVjdGlvbi5zY2FsZSgrdGhpcy5zY2FsZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2VudGVyKSB7XG4gICAgICB0aGlzLnByb2plY3Rpb24uY2VudGVyKHRoaXMuY2VudGVyKTtcbiAgICB9XG5cbiAgICB0aGlzLmdlb1BhdGggPSBkM19nZW9QYXRoKCkucHJvamVjdGlvbih0aGlzLnByb2plY3Rpb24pO1xuXG4gICAgLy8gYnViYmxlIHJhZGl1cyByYW5nZVxuICAgIGlmICh0aGlzLmRhdGEgJiYgIXRoaXMuZG90KSB7XG4gICAgICB0aGlzLmJ1YmJsZVJhZGl1cyA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgICAgLnJhbmdlKHRoaXMuYnViYmxlU2l6ZVJhbmdlKVxuICAgICAgICAuZG9tYWluKFtkM19taW4odGhpcy5kYXRhLCAoZDogYW55KSA9PiArZC52YWx1ZSksIGQzX21heCh0aGlzLmRhdGEsIChkOiBhbnkpID0+ICtkLnZhbHVlKV0pO1xuXG4gICAgICAvLyBmb250IHJhbmdlXG4gICAgICB0aGlzLmZvbnRSYW5nZSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgICAgLnJhbmdlKHRoaXMudGV4dFNpemVSYW5nZSlcbiAgICAgICAgLmRvbWFpbihbZDNfbWluKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gK2QudmFsdWUpLCBkM19tYXgodGhpcy5kYXRhLCAoZDogYW55KSA9PiArZC52YWx1ZSldKTtcbiAgICB9XG5cbiAgICAvLyBUT09MVElQXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBkM19zZWxlY3QoJ2JvZHknKVxuICAgICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAncGJkcy10b29sdGlwIHNvdXRoJylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgLy8gaGlkZSB0b29sdGlwIGZvciBhY2Nlc3NpYmlsaXR5XG5cbiAgICAgIC8vIHRvb2x0aXAgaGVhZGVyXG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWhlYWRlcicpO1xuICAgICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwVmFsdWUpIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdmFsdWUnKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aH0gJHsrdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b219YFxuICAgICAgKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY29udGFpbmVyJyk7XG5cbiAgICAvLyBtYXBcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy50b3BvanNvbkZlYXR1cmUuZmVhdHVyZXMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZmVhdHVyZScpXG4gICAgICAuYXR0cignZCcsIHRoaXMuZ2VvUGF0aCk7XG5cbiAgICAvLyBib3JkZXJzXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21lc2gnKVxuICAgICAgLmRhdHVtKHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSlcbiAgICAgIC5hdHRyKCdkJywgdGhpcy5nZW9QYXRoKTtcblxuICAgIHRoaXMuYnViYmxlQ29udGFpbmVyID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2RvdHMnKVxuICAgICAgLnN0eWxlKCdjb2xvcicsIHRoaXMuY29sb3IpO1xuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIC8vIGJ1YmJsZXNcblxuICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZG90LWNpcmNsZScpXG4gICAgICAgICAgICAuY2xhc3NlZCgnc29saWQnLCB0aGlzLmRvdClcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAuYXR0cigncicsIGQgPT4gKCF0aGlzLmRvdCA/IE1hdGguc3FydCh0aGlzLmJ1YmJsZVJhZGl1cyhkLnZhbHVlKSkgOiBgJHt0aGlzLmRvdFNpemV9cHhgKSksXG4gICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cignY3gnLCBkID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVswXSlcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzFdKVxuICAgICAgICAgICAgLmF0dHIoJ3InLCBkID0+ICghdGhpcy5kb3QgPyBNYXRoLnNxcnQodGhpcy5idWJibGVSYWRpdXMoZC52YWx1ZSkpIDogYCR7dGhpcy5kb3RTaXplfXB4YCkpLFxuICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5idWJibGVNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJ1YmJsZU1vdXNlT3V0KGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5idWJibGVNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcblxuICAgICAgLy8gYnViYmxlIHRleHRcbiAgICAgIGlmICh0aGlzLnR5cGUgIT09ICdoaWdoJyAmJiAhdGhpcy5kb3QpIHtcbiAgICAgICAgdGhpcy5idWJibGVDb250YWluZXJcbiAgICAgICAgICAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgICAgLmpvaW4oXG4gICAgICAgICAgICBlbnRlciA9PlxuICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAgIC50ZXh0KGQgPT4gKHRoaXMuYnViYmxlTGFiZWxGb3JtYXQgPyB0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0KGQudmFsdWUpIDogZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2RvdC10ZXh0JylcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCB0aGlzLnRleHRDb2xvcilcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIGQgPT4gYCR7TWF0aC5yb3VuZCh0aGlzLmZvbnRSYW5nZShkLnZhbHVlKSl9cHhgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMF0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVsxXSlcbiAgICAgICAgICAgICAgICAuYXR0cignZHknLCAnLjRlbScpLFxuICAgICAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAudGV4dChkID0+ICh0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0ID8gdGhpcy5idWJibGVMYWJlbEZvcm1hdChkLnZhbHVlKSA6IGQudmFsdWUpKVxuICAgICAgICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgZCA9PiBgJHtNYXRoLnJvdW5kKHRoaXMuZm9udFJhbmdlKGQudmFsdWUpKX1weGApXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVswXSlcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzFdKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkeScsICcuNGVtJyksXG4gICAgICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBidWJibGVNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5kb3QtY2lyY2xlJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuZG90LWNpcmNsZScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdhY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMudG9vbHRpcFNob3coZGF0YSwgbm9kZXNbaW5kZXhdKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgYnViYmxlTW91c2VPdXQgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5kb3QtY2lyY2xlJylcbiAgICAgIC5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSlcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBidWJibGVNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZGF0YSwgbm9kZSkgPT4ge1xuICAgIGxldCBkaW1lbnNpb25zID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXInKS5odG1sKGQgPT4gYCR7ZGF0YS5sYWJlbH1gKTtcblxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcFZhbHVlKSB7XG4gICAgICB0aGlzLnRvb2x0aXBcbiAgICAgICAgLnNlbGVjdCgnLnRvb2x0aXAtdmFsdWUnKVxuICAgICAgICAuaHRtbChkID0+ICh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA/IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfWAgOiBgJHtkYXRhLnZhbHVlfWApKTtcbiAgICB9XG5cbiAgICBsZXQgdG9vbHRpcE9mZnNldFdpZHRoID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0V2lkdGggLyAyO1xuICAgIGxldCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0ICsgODtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7K3Njcm9sbFsxXSArICtkaW1lbnNpb25zLnRvcCAtIHRvb2x0aXBPZmZzZXRIZWlnaHR9cHhgKTsgLy9cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBgJHsrc2Nyb2xsWzBdICsgK2RpbWVuc2lvbnMubGVmdCAtIHRvb2x0aXBPZmZzZXRXaWR0aCArICtkaW1lbnNpb25zLndpZHRoIC8gMn1weGApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG59XG4iXX0=
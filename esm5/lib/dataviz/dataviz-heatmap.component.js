/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, HostBinding, Input, Output, ElementRef, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { PbdsDatavizService } from './dataviz.service';
import { select as d3_select, event as d3_event } from 'd3-selection';
import { scaleThreshold as d3_scaleThreshold, scaleQuantile as d3_scaleQuantile, scaleQuantize as d3_scaleQuantize, scaleBand as d3_scaleBand } from 'd3-scale';
import { min as d3_min, max as d3_max } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { isoParse as d3_isoParse } from 'd3-time-format';
var PbdsDatavizHeatmapComponent = /** @class */ (function () {
    function PbdsDatavizHeatmapComponent(_dataviz, _element, _scroll) {
        var _this = this;
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this.chartClass = true;
        this.heatmapClass = true;
        this.width = 306;
        this.height = 400;
        this.marginTop = 0; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginRight = 0; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginLeft = 55;
        this.scale = 'quantile';
        this.xAxisFormatType = null;
        this.xAxisFormatString = '';
        this.yAxisFormatType = null;
        this.yAxisFormatString = '';
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'right';
        this.legendLabelFormatType = null;
        this.legendLabelFormatString = '';
        this.tooltipXLabelFormatType = null;
        this.tooltipXLabelFormatString = '';
        this.tooltipYLabelFormatType = null;
        this.tooltipYLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.theme = 'classic';
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (/**
         * @return {?}
         */
        function () {
            _this.svg
                .selectAll('rect')
                .data(_this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                return enter
                    .append('rect')
                    .attr('class', 'block')
                    .classed('empty', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return d.value === undefined || d.value === null; }))
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.xAxisScale(d.xLabel); }))
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.yAxisScale(d.yLabel); }))
                    .attr('width', _this.xAxisScale.bandwidth())
                    .attr('height', _this.yAxisScale.bandwidth())
                    .style('fill', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.colorRange(d.value); }));
            }), (/**
             * @param {?} update
             * @return {?}
             */
            function (update) {
                return update.call((/**
                 * @param {?} update
                 * @return {?}
                 */
                function (update) {
                    update
                        .classed('empty', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return d.value === undefined || d.value === null; }))
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.xAxisScale(d.xLabel); }))
                        .attr('y', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.yAxisScale(d.yLabel); }))
                        .attr('width', _this.xAxisScale.bandwidth())
                        .attr('height', _this.yAxisScale.bandwidth())
                        .style('fill', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.colorRange(d.value); }))
                        .transition()
                        .attr('pointer-events', 'auto');
                    return update;
                }));
            }), (/**
             * @param {?} exit
             * @return {?}
             */
            function (exit) {
                return exit
                    .transition()
                    .attr('pointer-events', 'none')
                    .remove();
            }))
                .on('mouseover', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) { return _this.blockMouseOver(d3_event, data, index, nodes); }))
                .on('mouseout', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) { return _this.blockMouseOut(); }))
                .on('click', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) { return _this.blockMouseClick(d3_event, data, index, nodes); }));
            if (!_this.hideLegend) {
                _this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(_this.colorDomain)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                function (enter) {
                    /** @type {?} */
                    var li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.colorRange(d); }));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html((/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) {
                        /** @type {?} */
                        var label = d;
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                label = _this.legendLabelFormat(d);
                                break;
                        }
                        return "&ge; " + label;
                    }));
                    return li;
                }), (/**
                 * @param {?} update
                 * @return {?}
                 */
                function (update) {
                    return update.select('.legend-label').html((/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) {
                        /** @type {?} */
                        var label = d;
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                label = _this.legendLabelFormat(d);
                                break;
                        }
                        return "&ge; " + label;
                    }));
                }), (/**
                 * @param {?} exit
                 * @return {?}
                 */
                function (exit) { return exit.remove(); }))
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.legendMouseOver(d3_event, data, index, nodes); }))
                    .on('mouseout', (/**
                 * @return {?}
                 */
                function () { return _this.legendMouseOut(); }))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.legendMouseClick(d3_event, data, index, nodes); }));
            }
        });
        this.blockMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            // console.log(data.value, event, data, index, nodes);
            if (data.value !== null) {
                _this.tooltipShow(data, index, nodes[index]);
            }
            _this.hovered.emit({ event: event, data: data });
        });
        this.blockMouseOut = (/**
         * @return {?}
         */
        function () {
            _this.tooltipHide();
        });
        this.blockMouseClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            _this.clicked.emit({ event: event, data: data });
        });
        this.legendMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            _this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; }))
                .classed('inactive', true);
            _this.chart
                .selectAll('.block')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                if (index + 1 === nodes.length) {
                    return d.value < data;
                }
                else {
                    return d.value < data || d.value >= +d3_select(nodes[index + 1]).data()[0];
                }
            }))
                .classed('inactive', true);
            _this.hovered.emit({ event: event, data: data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        function () {
            _this.chart.selectAll('.legend-item').classed('inactive', false);
            _this.chart.selectAll('.block').classed('inactive', false);
        });
        this.legendMouseClick = (/**
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
         * @param {?} index
         * @param {?} node
         * @return {?}
         */
        function (data, index, node) {
            // console.log('TOOLTIP: ', data, index, node);
            // console.log('TOOLTIP: ', data, index, node);
            /** @type {?} */
            var dimensions = node.getBoundingClientRect();
            /** @type {?} */
            var scroll = _this._scroll.getScrollPosition();
            /** @type {?} */
            var yLabel;
            /** @type {?} */
            var xLabel;
            switch (_this.tooltipYLabelFormatType) {
                case 'number':
                    yLabel = _this.tooltipYLabelFormat(data.yLabel);
                    break;
                case 'time':
                    /** @type {?} */
                    var parsedTime = d3_isoParse(data.yLabel);
                    yLabel = _this.tooltipYLabelFormat(parsedTime);
                    break;
                default:
                    yLabel = "" + data.yLabel + _this.tooltipYLabelFormatString;
            }
            switch (_this.tooltipXLabelFormatType) {
                case 'number':
                    xLabel = _this.tooltipXLabelFormat(data.xLabel);
                    break;
                case 'time':
                    /** @type {?} */
                    var parsedTime = d3_isoParse(data.xLabel);
                    xLabel = _this.tooltipXLabelFormat(parsedTime);
                    break;
                default:
                    xLabel = "" + data.xLabel + _this.tooltipXLabelFormatString;
            }
            /** @type {?} */
            var value = _this.tooltipValueFormat === null
                ? "<div class=\"tooltip-value\">" + data.value + "</div>"
                : "<div class=\"tooltip-value\">" + _this.tooltipValueFormat(data.value) + "</div>";
            _this.tooltip.html("\n        " + yLabel + " : " + xLabel + "<br>\n        " + value + "\n      ");
            /** @type {?} */
            var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight + 8;
            _this.tooltip.style('top', +scroll[1] + +dimensions.top - tooltipOffsetHeight + "px"); //
            _this.tooltip.style('left', +scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2 + "px");
            _this.tooltip.style('opacity', 1);
            _this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        function () {
            _this.tooltip.style('opacity', 0);
        });
        this.xAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            switch (_this.xAxisFormatType) {
                case 'number':
                    return _this.xAxisFormat(item);
                case 'time':
                    /** @type {?} */
                    var parseDate = d3_isoParse(item);
                    return _this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        });
        this.yAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            switch (_this.yAxisFormatType) {
                case 'number':
                    return _this.yAxisFormat(item);
                case 'time':
                    /** @type {?} */
                    var parseDate = d3_isoParse(item);
                    return _this.yAxisFormat(parseDate);
                default:
                    return item;
            }
        });
    }
    /**
     * @return {?}
     */
    PbdsDatavizHeatmapComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        // create formatters
        this.yAxisFormat = this._dataviz.d3Format(this.yAxisFormatType, this.yAxisFormatString);
        this.xAxisFormat = this._dataviz.d3Format(this.xAxisFormatType, this.xAxisFormatString);
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipYLabelFormat = this._dataviz.d3Format(this.tooltipYLabelFormatType, this.tooltipYLabelFormatString);
        this.tooltipXLabelFormat = this._dataviz.d3Format(this.tooltipXLabelFormatType, this.tooltipXLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        // defaults for all chart types
        this.hideXAxis = false;
        this.hideXAxisZero = false;
        this.hideXAxisDomain = true;
        this.hideYAxisDomain = true;
        this.hideTooltip = false;
        this.hideXAxisTicks = true;
        this.hideYAxisTicks = true;
        this.xAxisTickSize = 8;
        this.xAxisTickSizeOuter = 0;
        this.yAxisTickSize = 8;
        this.yAxisTickSizeOuter = 0;
        // create the chart
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + +this.width + " " + (+this.height + this.margin.top + this.margin.bottom));
        // color range
        /** @type {?} */
        var colors = this._dataviz
            .getColors(true, this.theme)
            .slice()
            .reverse();
        /** @type {?} */
        var colorDomain = [
            +d3_min(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.value; })),
            +d3_max(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.value; }))
        ];
        /** @type {?} */
        var colorValues = this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.value; }));
        switch (this.scale) {
            case 'threshold':
                this.colorRange = d3_scaleThreshold()
                    .domain(this.domain)
                    .range(colors);
                this.colorDomain = this.colorRange.domain();
                break;
            case 'quantile':
                this.colorRange = d3_scaleQuantile()
                    .domain(colorValues)
                    .range(colors);
                this.colorDomain = this.colorRange.quantiles();
                break;
            case 'quantize':
                this.colorRange = d3_scaleQuantize()
                    .domain(colorDomain)
                    .range(colors);
                this.colorDomain = this.colorRange.thresholds();
                break;
        }
        // console.log(colors, colorDomain, colorValues, this.scale, this.colorRange, this.colorDomain);
        // define axis labels
        /** @type {?} */
        var xAxisLabels = tslib_1.__spread(new Set(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.xLabel; }))));
        /** @type {?} */
        var yAxisLabels = tslib_1.__spread(new Set(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.yLabel; })))).reverse();
        // X axis
        this.xAxisScale = d3_scaleBand()
            .domain(xAxisLabels)
            .rangeRound([0, this.width - this.margin.left])
            .paddingInner(0.1);
        this.xAxisCall = d3_axisBottom(this.xAxisScale)
            .tickSize(this.xAxisTickSize)
            .tickSizeOuter(this.xAxisTickSizeOuter)
            .tickFormat(this.xAxisFormatter);
        this.xAxis = this.svg
            .append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', "translate(0, " + this.height + ")")
            .classed('axis-hidden', this.hideXAxis)
            .classed('axis-zero-hidden', this.hideXAxisZero)
            .classed('axis-domain-hidden', this.hideXAxisDomain)
            .classed('axis-ticks-hidden', this.hideXAxisTicks)
            .call(this.xAxisCall);
        // Y axis
        this.yAxisScale = d3_scaleBand()
            .domain(yAxisLabels)
            .rangeRound([this.height, 0])
            .paddingInner(0.1);
        this.yAxisCall = d3_axisLeft(this.yAxisScale)
            .tickSize(this.yAxisTickSize)
            .tickSizeOuter(this.yAxisTickSizeOuter)
            .tickFormat(this.yAxisFormatter);
        this.yAxis = this.svg
            .append('g')
            .attr('class', 'axis axis-y')
            .classed('axis-hidden', this.hideYAxis)
            .classed('axis-zero-hidden', this.hideYAxisZero)
            .classed('axis-domain-hidden', this.hideYAxisDomain)
            .classed('axis-ticks-hidden', this.hideYAxisTicks)
            .call(this.yAxisCall);
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', 'pbds-tooltip south')
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
        }
        this.updateChart();
    };
    /**
     * @return {?}
     */
    PbdsDatavizHeatmapComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.tooltip)
            this.tooltip.remove();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PbdsDatavizHeatmapComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    };
    PbdsDatavizHeatmapComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-heatmap',
                    template: "",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizHeatmapComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: ElementRef },
        { type: ViewportScroller }
    ]; };
    PbdsDatavizHeatmapComponent.propDecorators = {
        chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
        heatmapClass: [{ type: HostBinding, args: ['class.pbds-chart-heatmap',] }],
        data: [{ type: Input }],
        width: [{ type: Input }],
        height: [{ type: Input }],
        marginTop: [{ type: Input }],
        marginRight: [{ type: Input }],
        marginBottom: [{ type: Input }],
        marginLeft: [{ type: Input }],
        scale: [{ type: Input }],
        domain: [{ type: Input }],
        xAxisFormatType: [{ type: Input }],
        xAxisFormatString: [{ type: Input }],
        yAxisFormatType: [{ type: Input }],
        yAxisFormatString: [{ type: Input }],
        hideLegend: [{ type: Input }],
        legendWidth: [{ type: Input }],
        legendPosition: [{ type: Input }],
        legendLabelFormatType: [{ type: Input }],
        legendLabelFormatString: [{ type: Input }],
        tooltipXLabelFormatType: [{ type: Input }],
        tooltipXLabelFormatString: [{ type: Input }],
        tooltipYLabelFormatType: [{ type: Input }],
        tooltipYLabelFormatString: [{ type: Input }],
        tooltipValueFormatType: [{ type: Input }],
        tooltipValueFormatString: [{ type: Input }],
        theme: [{ type: Input }],
        hovered: [{ type: Output }],
        clicked: [{ type: Output }]
    };
    return PbdsDatavizHeatmapComponent;
}());
export { PbdsDatavizHeatmapComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.heatmapClass;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.scale;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.domain;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.yAxisFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.yAxisFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipXLabelFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipXLabelFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipYLabelFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipYLabelFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.colorDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideXAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideYAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideYAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideYAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideYAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipYLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipXLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideTooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipValueFormat;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.blockMouseOver;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.blockMouseOut;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.blockMouseClick;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype._scroll;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1oZWF0bWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LWhlYXRtYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFJVCxXQUFXLEVBQ1gsS0FBSyxFQUNMLE1BQU0sRUFDTixVQUFVLEVBRVYsWUFBWSxFQUNaLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUduRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUV2RCxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxLQUFLLElBQUksUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RFLE9BQU8sRUFDTCxjQUFjLElBQUksaUJBQWlCLEVBQ25DLGFBQWEsSUFBSSxnQkFBZ0IsRUFDakMsYUFBYSxJQUFJLGdCQUFnQixFQUNqQyxTQUFTLElBQUksWUFBWSxFQUMxQixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hELE9BQU8sRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDL0UsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RDtJQThIRSxxQ0FBb0IsUUFBNEIsRUFBVSxRQUFvQixFQUFVLE9BQXlCO1FBQWpILGlCQUFxSDtRQUFqRyxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVk7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQXRIakgsZUFB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QUEyQjs7SUFpSzNCLGtEQXlGRTs7SUFFRixxREFRRTs7SUFFRixvREFFRTs7SUFFRixzREFFRTs7SUFFRixzREFrQkU7O0lBRUYscURBSUU7O0lBRUYsdURBRUU7Ozs7O0lBRUYsa0RBd0RFOzs7OztJQUVGLGtEQUVFOzs7OztJQUVGLHFEQVlFOzs7OztJQUVGLHFEQVlFOzs7OztJQWxZVSwrQ0FBb0M7Ozs7O0lBQUUsK0NBQTRCOzs7OztJQUFFLDhDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEVsZW1lbnRSZWYsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEV2ZW50RW1pdHRlcixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpekhlYXRtYXAgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QsIGV2ZW50IGFzIGQzX2V2ZW50IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7XG4gIHNjYWxlVGhyZXNob2xkIGFzIGQzX3NjYWxlVGhyZXNob2xkLFxuICBzY2FsZVF1YW50aWxlIGFzIGQzX3NjYWxlUXVhbnRpbGUsXG4gIHNjYWxlUXVhbnRpemUgYXMgZDNfc2NhbGVRdWFudGl6ZSxcbiAgc2NhbGVCYW5kIGFzIGQzX3NjYWxlQmFuZFxufSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBtaW4gYXMgZDNfbWluLCBtYXggYXMgZDNfbWF4IH0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHsgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLCBheGlzTGVmdCBhcyBkM19heGlzTGVmdCB9IGZyb20gJ2QzLWF4aXMnO1xuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1oZWF0bWFwJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekhlYXRtYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWhlYXRtYXAnKVxuICBoZWF0bWFwQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6SGVhdG1hcD47XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAzMDY7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNDAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5SaWdodCA9IDA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAzMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkxlZnQgPSA1NTtcblxuICBASW5wdXQoKVxuICBzY2FsZTogJ3RocmVzaG9sZCcgfCAncXVhbnRpbGUnIHwgJ3F1YW50aXplJyA9ICdxdWFudGlsZSc7XG5cbiAgQElucHV0KClcbiAgZG9tYWluOiBBcnJheTxudW1iZXI+O1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgeUF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeUF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBoaWRlTGVnZW5kID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kV2lkdGggPSAxMDUgKyAyODsgLy8gaGFyZGNvZGVkIGxlZ2VuZCB3aWR0aCArIGxlZnQgbWFyZ2luLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBsZWdlbmRQb3NpdGlvbjogJ3JpZ2h0JyB8ICdib3R0b20nID0gJ3JpZ2h0JztcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBYTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFhMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBZTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFlMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0aGVtZTogJ2NsYXNzaWMnIHwgJ29jZWFuJyB8ICdzdW5zZXQnIHwgJ3R3aWxpZ2h0JyA9ICdjbGFzc2ljJztcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBjb2xvckRvbWFpbjtcbiAgcHJpdmF0ZSB4QXhpc1NjYWxlO1xuICBwcml2YXRlIHhBeGlzQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpcztcbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdDtcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgaGlkZVhBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzOiBib29sZWFuO1xuICBwcml2YXRlIHlBeGlzO1xuICBwcml2YXRlIHlBeGlzRm9ybWF0O1xuICBwcml2YXRlIHlBeGlzVGlja1NpemU7XG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZU91dGVyO1xuICBwcml2YXRlIHlBeGlzU2NhbGU7XG4gIHByaXZhdGUgeUF4aXNDYWxsO1xuICBwcml2YXRlIGhpZGVZQXhpczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsZWdlbmRMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIHRvb2x0aXBZTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFhMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSBoaWRlVG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGF0YXZpejogUGJkc0RhdGF2aXpTZXJ2aWNlLCBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMueUF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueUF4aXNGb3JtYXRUeXBlLCB0aGlzLnlBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnhBeGlzRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0VHlwZSwgdGhpcy54QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUsIHRoaXMubGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFlMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwWUxhYmVsRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwWUxhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBYTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFhMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFhMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcpO1xuXG4gICAgLy8gZGVmYXVsdHMgZm9yIGFsbCBjaGFydCB0eXBlc1xuICAgIHRoaXMuaGlkZVhBeGlzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSB0cnVlO1xuICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICB0aGlzLmhpZGVUb29sdGlwID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnhBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnlBeGlzVGlja1NpemVPdXRlciA9IDA7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aH0gJHsrdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b219YFxuICAgICAgKTtcblxuICAgIC8vIGNvbG9yIHJhbmdlXG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5fZGF0YXZpelxuICAgICAgLmdldENvbG9ycyh0cnVlLCB0aGlzLnRoZW1lKVxuICAgICAgLnNsaWNlKClcbiAgICAgIC5yZXZlcnNlKCk7XG5cbiAgICBjb25zdCBjb2xvckRvbWFpbjogYW55ID0gW1xuICAgICAgK2QzX21pbih0aGlzLmRhdGEsIChkOiBQYmRzRGF0YXZpekhlYXRtYXApID0+IGQudmFsdWUpLFxuICAgICAgK2QzX21heCh0aGlzLmRhdGEsIChkOiBQYmRzRGF0YXZpekhlYXRtYXApID0+IGQudmFsdWUpXG4gICAgXTtcbiAgICBjb25zdCBjb2xvclZhbHVlcyA9IHRoaXMuZGF0YS5tYXAoZCA9PiBkLnZhbHVlKTtcblxuICAgIHN3aXRjaCAodGhpcy5zY2FsZSkge1xuICAgICAgY2FzZSAndGhyZXNob2xkJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVUaHJlc2hvbGQoKVxuICAgICAgICAgIC5kb21haW4odGhpcy5kb21haW4pXG4gICAgICAgICAgLnJhbmdlKGNvbG9ycyk7XG5cbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IHRoaXMuY29sb3JSYW5nZS5kb21haW4oKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3F1YW50aWxlJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVRdWFudGlsZSgpXG4gICAgICAgICAgLmRvbWFpbihjb2xvclZhbHVlcylcbiAgICAgICAgICAucmFuZ2UoY29sb3JzKTtcblxuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gdGhpcy5jb2xvclJhbmdlLnF1YW50aWxlcygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncXVhbnRpemUnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVF1YW50aXplKClcbiAgICAgICAgICAuZG9tYWluKGNvbG9yRG9tYWluKVxuICAgICAgICAgIC5yYW5nZShjb2xvcnMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLmNvbG9yUmFuZ2UudGhyZXNob2xkcygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhjb2xvcnMsIGNvbG9yRG9tYWluLCBjb2xvclZhbHVlcywgdGhpcy5zY2FsZSwgdGhpcy5jb2xvclJhbmdlLCB0aGlzLmNvbG9yRG9tYWluKTtcblxuICAgIC8vIGRlZmluZSBheGlzIGxhYmVsc1xuICAgIGNvbnN0IHhBeGlzTGFiZWxzOiBhbnkgPSBbLi4ubmV3IFNldCh0aGlzLmRhdGEubWFwKGQgPT4gZC54TGFiZWwpKV07XG4gICAgY29uc3QgeUF4aXNMYWJlbHM6IGFueSA9IFsuLi5uZXcgU2V0KHRoaXMuZGF0YS5tYXAoZCA9PiBkLnlMYWJlbCkpXS5yZXZlcnNlKCk7XG5cbiAgICAvLyBYIGF4aXNcbiAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUJhbmQoKVxuICAgICAgLmRvbWFpbih4QXhpc0xhYmVscylcbiAgICAgIC5yYW5nZVJvdW5kKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdF0pXG4gICAgICAucGFkZGluZ0lubmVyKDAuMSk7XG5cbiAgICB0aGlzLnhBeGlzQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKVxuICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy14JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXNUaWNrcylcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIC8vIFkgYXhpc1xuICAgIHRoaXMueUF4aXNTY2FsZSA9IGQzX3NjYWxlQmFuZCgpXG4gICAgICAuZG9tYWluKHlBeGlzTGFiZWxzKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMuaGVpZ2h0LCAwXSlcbiAgICAgIC5wYWRkaW5nSW5uZXIoMC4xKTtcblxuICAgIHRoaXMueUF4aXNDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgLnRpY2tTaXplKHRoaXMueUF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy55QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnlBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy15JylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuICAgIH1cblxuICAgIC8vIGFkZCBsZWdlbmQgY2xhc3Nlc1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVDaGFydCA9ICgpID0+IHtcbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmxvY2snKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ2VtcHR5JywgZCA9PiBkLnZhbHVlID09PSB1bmRlZmluZWQgfHwgZC52YWx1ZSA9PT0gbnVsbClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC54TGFiZWwpKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkLnlMYWJlbCkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy55QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC52YWx1ZSkpLFxuICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICB1cGRhdGUuY2FsbCh1cGRhdGUgPT4ge1xuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC5jbGFzc2VkKCdlbXB0eScsIGQgPT4gZC52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGQudmFsdWUgPT09IG51bGwpXG4gICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLnhMYWJlbCkpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZC55TGFiZWwpKVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLnlBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSksXG4gICAgICAgIGV4aXQgPT5cbiAgICAgICAgICBleGl0XG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAucmVtb3ZlKClcbiAgICAgIClcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5ibG9ja01vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJsb2NrTW91c2VPdXQoKSlcbiAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJsb2NrTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcbiAgICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgLmRhdGEodGhpcy5jb2xvckRvbWFpbilcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgZW50ZXIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGkgPSBlbnRlci5hcHBlbmQoJ2xpJykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKTtcblxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1rZXknKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCBkID0+IHRoaXMuY29sb3JSYW5nZShkKSk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKVxuICAgICAgICAgICAgICAuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWw6IHN0cmluZyA9IGQ7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBgJmdlOyAke2xhYmVsfWA7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICBsZXQgbGFiZWw6IHN0cmluZyA9IGQ7XG5cbiAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICBsYWJlbCA9IHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiBgJmdlOyAke2xhYmVsfWA7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubGVnZW5kTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4gdGhpcy5sZWdlbmRNb3VzZU91dCgpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5sZWdlbmRNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcbiAgICB9XG4gIH07XG5cbiAgYmxvY2tNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKGRhdGEudmFsdWUsIGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpO1xuXG4gICAgaWYgKGRhdGEudmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudG9vbHRpcFNob3coZGF0YSwgaW5kZXgsIG5vZGVzW2luZGV4XSk7XG4gICAgfVxuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBibG9ja01vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBibG9ja01vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5ibG9jaycpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgIGlmIChpbmRleCArIDEgPT09IG5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBkLnZhbHVlIDwgZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZC52YWx1ZSA8IGRhdGEgfHwgZC52YWx1ZSA+PSArZDNfc2VsZWN0KG5vZGVzW2luZGV4ICsgMV0pLmRhdGEoKVswXTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmJsb2NrJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKGRhdGEsIGluZGV4LCBub2RlKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJ1RPT0xUSVA6ICcsIGRhdGEsIGluZGV4LCBub2RlKTtcblxuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIGxldCB5TGFiZWw7XG4gICAgbGV0IHhMYWJlbDtcblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwWUxhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgeUxhYmVsID0gdGhpcy50b29sdGlwWUxhYmVsRm9ybWF0KGRhdGEueUxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZGF0YS55TGFiZWwpO1xuICAgICAgICB5TGFiZWwgPSB0aGlzLnRvb2x0aXBZTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB5TGFiZWwgPSBgJHtkYXRhLnlMYWJlbH0ke3RoaXMudG9vbHRpcFlMYWJlbEZvcm1hdFN0cmluZ31gO1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwWExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgeExhYmVsID0gdGhpcy50b29sdGlwWExhYmVsRm9ybWF0KGRhdGEueExhYmVsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZGF0YS54TGFiZWwpO1xuICAgICAgICB4TGFiZWwgPSB0aGlzLnRvb2x0aXBYTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB4TGFiZWwgPSBgJHtkYXRhLnhMYWJlbH0ke3RoaXMudG9vbHRpcFhMYWJlbEZvcm1hdFN0cmluZ31gO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID1cbiAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgID8gYDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlXCI+JHtkYXRhLnZhbHVlfTwvZGl2PmBcbiAgICAgICAgOiBgPGRpdiBjbGFzcz1cInRvb2x0aXAtdmFsdWVcIj4ke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfTwvZGl2PmA7XG5cbiAgICB0aGlzLnRvb2x0aXAuaHRtbChcbiAgICAgIGBcbiAgICAgICAgJHt5TGFiZWx9IDogJHt4TGFiZWx9PGJyPlxuICAgICAgICAke3ZhbHVlfVxuICAgICAgYFxuICAgICk7XG5cbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0V2lkdGggPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodCArIDg7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAkeytzY3JvbGxbMV0gKyArZGltZW5zaW9ucy50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0fXB4YCk7IC8vXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSArICtkaW1lbnNpb25zLmxlZnQgLSB0b29sdGlwT2Zmc2V0V2lkdGggKyArZGltZW5zaW9ucy53aWR0aCAvIDJ9cHhgKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIHN3aXRjaCAodGhpcy54QXhpc0Zvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KGl0ZW0pO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XG4gICAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHlBeGlzRm9ybWF0dGVyID0gaXRlbSA9PiB7XG4gICAgc3dpdGNoICh0aGlzLnlBeGlzRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQoaXRlbSk7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQocGFyc2VEYXRlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9O1xufVxuIl19
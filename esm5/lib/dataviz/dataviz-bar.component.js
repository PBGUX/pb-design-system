/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { select as d3_select, isoParse as d3_isoParse, scaleOrdinal as d3_scaleOrdinal, scaleBand as d3_scaleBand, scaleLinear as d3_scaleLinear, min as d3_min, max as d3_max, axisBottom as d3_axisBottom, axisLeft as d3_axisLeft, event as d3_event } from 'd3';
import { PbdsDatavizService } from './dataviz.service';
var PbdsDatavizBarComponent = /** @class */ (function () {
    function PbdsDatavizBarComponent(_dataviz, _element, _scroll, _location) {
        var _this = this;
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this._location = _location;
        this.chartClass = true;
        this.barClass = true;
        this.width = 306;
        this.height = 400;
        this.type = 'medium'; // debug to show all chart options
        // debug to show all chart options
        this.singleSeries = false;
        this.xAxisFormatType = null;
        this.xAxisFormatString = '';
        this.xAxisTitle = null;
        this.yAxisFormatType = null;
        this.yAxisFormatString = '';
        this.yAxisTicks = 5;
        this.yAxisMinBuffer = 0.01;
        this.yAxisMaxBuffer = 0.01;
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'right';
        this.legendLabelFormatType = null;
        this.legendLabelFormatString = '';
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.marginTop = 10; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginRight = 0; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.threshold = null;
        this.thresholdLabel = 'Threshold';
        this.average = null;
        this.averageLabel = 'Average';
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (/**
         * @return {?}
         */
        function () {
            // update the xScale
            _this.xAxisScale.domain(_this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.label; })));
            // update the yScale
            _this.yAxisScale
                .domain([
                d3_min(_this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return d.value - d.value * +_this.yAxisMinBuffer; })),
                d3_max(_this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return d.value + d.value * +_this.yAxisMaxBuffer; }))
            ])
                .rangeRound([_this.height, 0])
                .nice();
            _this.xAxis
                .transition()
                .duration(1000)
                .call(_this.xAxisCall);
            _this.yAxis
                .transition()
                .duration(1000)
                .call(_this.yAxisCall);
            // update the grids
            if (!_this.hideXGrid) {
                _this.xGrid
                    .transition()
                    .duration(1000)
                    .call(_this.xGridCall);
            }
            if (!_this.hideYGrid) {
                _this.yGrid
                    .transition()
                    .duration(1000)
                    .call(_this.yGridCall);
            }
            if (!_this.hideGrayBars) {
                // gray bars
                _this.svg
                    .selectAll('.gray-bar')
                    .data(_this.data)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                function (enter) {
                    return enter
                        .append('rect')
                        .attr('class', 'gray-bar')
                        .attr('height', 0)
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.xAxisScale(d.label); }))
                        .attr('width', _this.xAxisScale.bandwidth())
                        .call((/**
                     * @param {?} enter
                     * @return {?}
                     */
                    function (enter) {
                        return enter
                            .transition()
                            .duration(500)
                            .attr('height', _this.height);
                    }));
                }), (/**
                 * @param {?} update
                 * @return {?}
                 */
                function (update) {
                    return update
                        .transition()
                        .duration(1000)
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.xAxisScale(d.label); }))
                        .attr('width', _this.xAxisScale.bandwidth());
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
                // color bars
                _this.svg
                    .selectAll('.bar')
                    .data(_this.data)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                function (enter) {
                    return enter
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('fill', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return "url(" + _this._location.path() + "#gradient-" + _this.colorRange(d.label).substr(1) + ")"; })) // removes hash to prevent safari bug;
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 4; }))
                        .attr('width', _this.xAxisScale.bandwidth() / 2)
                        .attr('y', _this.height)
                        .attr('height', 0)
                        .attr('pointer-events', 'none')
                        .call((/**
                     * @param {?} enter
                     * @return {?}
                     */
                    function (enter) {
                        return enter
                            .transition()
                            .duration(1000)
                            .attr('y', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.yAxisScale(d.value); }))
                            .attr('height', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.height - _this.yAxisScale(d.value); }))
                            .attr('data-color', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.colorRange(d.label); }))
                            .transition()
                            .attr('pointer-events', 'auto');
                    }));
                }), (/**
                 * @param {?} update
                 * @return {?}
                 */
                function (update) {
                    return update
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 4; }))
                        .attr('width', _this.xAxisScale.bandwidth() / 2)
                        .attr('height', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.height - _this.yAxisScale(d.value); }))
                        .attr('y', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.yAxisScale(d.value); }))
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
                }))
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.barMouseOver(d3_event, data, index, nodes); }))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.barMouseOut(); }))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.barMouseClick(d3_event, data, index, nodes); }));
            }
            else {
                // color bars
                _this.svg
                    .selectAll('.bar')
                    .data(_this.data)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                function (enter) {
                    return enter
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('fill', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return "url(" + _this._location.path() + "#gradient-" + _this.colorRange(d.label).substr(1) + ")"; }))
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 5.5; }))
                        .attr('width', _this.xAxisScale.bandwidth() / 1.5)
                        .attr('y', _this.height)
                        .attr('height', 0)
                        .attr('pointer-events', 'none')
                        .call((/**
                     * @param {?} enter
                     * @return {?}
                     */
                    function (enter) {
                        return enter
                            .transition()
                            .duration(1000)
                            .attr('y', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.yAxisScale(d.value); }))
                            .attr('height', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.height - _this.yAxisScale(d.value); }))
                            .attr('data-color', (/**
                         * @param {?} d
                         * @return {?}
                         */
                        function (d) { return _this.colorRange(d.label); }))
                            .transition()
                            .attr('pointer-events', 'auto');
                    }));
                }), (/**
                 * @param {?} update
                 * @return {?}
                 */
                function (update) {
                    return update
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 5.5; }))
                        .attr('width', _this.xAxisScale.bandwidth() / 1.5)
                        .attr('height', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.height - _this.yAxisScale(d.value); }))
                        .attr('y', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.yAxisScale(d.value); }))
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
                }))
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.barMouseOver(d3_event, data, index, nodes); }))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.barMouseOut(); }))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.barMouseClick(d3_event, data, index, nodes); }));
            }
            if (!_this.hideLegend) {
                _this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(_this.data)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                function (enter) {
                    /** @type {?} */
                    var li = enter.insert('li', 'li.legend-static').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return _this.colorRange(d.label); }));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html((/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) {
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.label);
                            case 'time':
                                /** @type {?} */
                                var parsedTime = d3_isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
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
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.label);
                            case 'time':
                                /** @type {?} */
                                var parsedTime = d3_isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
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
            if (_this.threshold) {
                _this.yThreshold
                    .raise()
                    .transition()
                    .duration(1000)
                    .attr('transform', "translate(0,  " + _this.yAxisScale(+_this.threshold) + ")");
            }
            if (_this.average) {
                _this.yAverage
                    .raise()
                    .transition()
                    .duration(1000)
                    .attr('transform', "translate(0,  " + _this.yAxisScale(+_this.average) + ")");
            }
        });
        this.barMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            _this.chart
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; }))
                .classed('inactive', true);
            /** @type {?} */
            var bar = _this.chart.selectAll('.bar').filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i === index; }));
            /** @type {?} */
            var barColor = bar.attr('data-color');
            bar.style('fill', barColor);
            _this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; }))
                .classed('inactive', true);
            _this.tooltipShow(data, nodes.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i === index; }))[0]);
            _this.hovered.emit({ event: event, data: data });
        });
        this.barMouseOut = (/**
         * @return {?}
         */
        function () {
            _this.chart
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
            _this.chart.selectAll('.legend-item').classed('inactive', false);
            _this.tooltipHide();
        });
        this.barMouseClick = (/**
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
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; }))
                .classed('inactive', true);
            /** @type {?} */
            var bar = _this.chart.selectAll('.bar').filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i === index; }));
            /** @type {?} */
            var barColor = bar.attr('data-color');
            bar.style('fill', barColor);
            _this.tooltipShow(data, _this.chart
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i === index; }))
                .node());
            _this.hovered.emit({ event: event, data: data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        function () {
            _this.chart.selectAll('.legend-item').classed('inactive', false);
            _this.chart
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
            _this.tooltipHide();
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
         * @param {?} node
         * @return {?}
         */
        function (data, node) {
            /** @type {?} */
            var dimensions = node.getBoundingClientRect();
            /** @type {?} */
            var scroll = _this._scroll.getScrollPosition();
            /** @type {?} */
            var label;
            switch (_this.tooltipLabelFormatType) {
                case 'number':
                    label = _this.tooltipLabelFormat(data.label);
                    break;
                case 'time':
                    /** @type {?} */
                    var parsedTime = d3_isoParse(data.label);
                    label = _this.tooltipLabelFormat(parsedTime);
                    break;
                default:
                    label = data.label;
            }
            /** @type {?} */
            var value = _this.tooltipValueFormat === null
                ? "<div class=\"tooltip-value\">" + data.value + "</div>"
                : "<div class=\"tooltip-value\">" + _this.tooltipValueFormat(data.value) + "</div>";
            _this.tooltip.html("\n        " + (_this.hideTooltipLabel ? '' : "" + label) + "\n        " + value + "\n      ");
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
    PbdsDatavizBarComponent.prototype.ngOnInit = /**
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
        // create formatters
        this.xAxisFormat = this._dataviz.d3Format(this.xAxisFormatType, this.xAxisFormatString);
        this.yAxisFormat = this._dataviz.d3Format(this.yAxisFormatType, this.yAxisFormatString);
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipLabelFormat = this._dataviz.d3Format(this.tooltipLabelFormatType, this.tooltipLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        // defaults for all chart types
        this.hideGrayBars = false;
        this.hideXAxis = false;
        this.hideYAxis = false;
        this.hideXAxisZero = false;
        this.hideYAxisZero = false;
        this.hideXGrid = false;
        this.hideYGrid = false;
        this.hideXAxisDomain = false;
        this.hideYAxisDomain = false;
        this.hideTooltip = false;
        this.hideXAxisTicks = false;
        this.hideYAxisTicks = false;
        this.xAxisTickSize = 8;
        this.xAxisTickSizeOuter = 0;
        this.xAxisTitleMargin = this.xAxisTitle ? 20 : 0;
        this.yAxisTickSize = 8;
        this.yAxisTickSizeOuter = 0;
        this.hideTooltipLabel = false;
        if (this.type !== 'debug') {
            // set type defaults
            switch (this.type) {
                case 'low':
                    this.hideGrayBars = true;
                    this.hideXAxis = !this.hideLegend;
                    this.hideXAxisTicks = true;
                    this.hideXGrid = true;
                    this.hideYAxisDomain = false;
                    this.hideYAxisTicks = true;
                    this.legendPosition = 'bottom';
                    this.hideTooltipLabel = true;
                    break;
                case 'medium':
                    this.hideXAxisDomain = true;
                    this.hideXAxis = !this.hideLegend;
                    this.hideXGrid = true;
                    this.hideXAxisTicks = true;
                    this.hideYAxisDomain = true;
                    this.hideYAxisTicks = true;
                    this.hideYGrid = true;
                    this.hideTooltipLabel = true;
                    break;
                case 'high':
                    this.hideXAxis = true;
                    this.hideXAxisDomain = true;
                    this.hideXGrid = true;
                    this.hideYAxisDomain = true;
                    this.hideYAxisTicks = true;
                    this.hideYGrid = true;
                    this.hideLegend = true;
                    this.hideTooltipLabel = false;
                    break;
            }
            // single series overrides
            if (this.singleSeries) {
                this.hideLegend = true;
                this.hideXAxis = true;
                this.hideXGrid = true;
                this.hideTooltipLabel = false;
            }
        }
        // adjust margin if xAxis hidden
        if (this.hideXAxis)
            this.margin.bottom = 10; // need small margin for yAxis with 0 tick label
        if (!this.hideLegend && this.legendPosition === 'right') {
            this.width = +this.width - +this.legendWidth;
        }
        // create the chart
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width)
            .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + +this.width + " " + (+this.height +
            this.margin.top +
            this.margin.bottom +
            this.xAxisTitleMargin));
        // build color ranges
        this.colorRange = d3_scaleOrdinal().range(this._dataviz.createGradientDefs(this.svg, this.singleSeries, this.theme));
        // X AXIS
        this.xAxisScale = d3_scaleBand()
            .domain(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.label; })))
            .rangeRound([0, this.width - this.margin.left])
            .align(0);
        // add padding to the scale for gray bars
        !this.hideGrayBars
            ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
            : this.xAxisScale.paddingInner(0).paddingOuter(0);
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
        // X GRIDLINES
        if (!this.hideXGrid) {
            this.xGridCall = d3_axisBottom(this.xAxisScale).tickSize(-this.height);
            this.xGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-x')
                .classed('grid-zero-hidden', this.hideXAxisZero)
                .attr('transform', "translate(0, " + this.height + ")")
                .call(this.xGridCall);
        }
        // X AXIS TITLE
        if (this.xAxisTitle) {
            this.svg
                .append('text')
                .attr('class', 'axis-title')
                .attr('text-anchor', 'center')
                .attr('x', this.width / 2 - this.margin.left)
                .attr('y', this.height + this.margin.top + (this.hideXAxis ? 15 : 0))
                .text(this.xAxisTitle);
        }
        // Y AXIS
        this.yAxisScale = d3_scaleLinear()
            .domain([
            d3_min(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.value - d.value * +_this.yAxisMinBuffer; })),
            d3_max(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.value + d.value * +_this.yAxisMaxBuffer; }))
        ])
            .nice()
            .rangeRound([this.height, 0]);
        this.yAxisCall = d3_axisLeft(this.yAxisScale)
            .ticks(this.yAxisTicks)
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
        // Y GRIDLINES
        if (!this.hideYGrid) {
            this.yGridCall = d3_axisLeft(this.yAxisScale)
                .ticks(this.yAxisTicks)
                .tickSize(-this.width + this.margin.left + this.margin.right);
            this.yGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-y')
                .classed('grid-zero-hidden', this.hideYAxisZero)
                .attr('transform', "translate(0, 0)")
                .call(this.yGridCall);
        }
        // Y THRESHOLD
        if (this.threshold) {
            this.yThreshold = this.svg
                .append('line')
                .attr('class', 'threshold')
                .attr('x2', +this.width - this.margin.right - this.margin.left)
                .attr('transform', "translate(0,  " + this.yAxisScale(+this.threshold) + ")");
        }
        // Y AVERAGE
        if (this.average) {
            this.yAverage = this.svg
                .append('line')
                .attr('class', 'average')
                .attr('x2', +this.width - this.margin.right - this.margin.left)
                .attr('transform', "translate(0,  " + this.yAxisScale(+this.average) + ")");
        }
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
        // add average to legend
        if (this.average && !this.hideLegend) {
            this.chart
                .select('.legend')
                .append('li')
                .attr('class', 'legend-static legend-average')
                .html((/**
             * @return {?}
             */
            function () {
                return "\n          <span class=\"legend-key\"></span>\n          <span class=\"legend-label\">" + _this.averageLabel + "</span>\n        ";
            }));
        }
        // add threshold to legend
        if (this.threshold && !this.hideLegend) {
            this.chart
                .select('.legend')
                .append('li')
                .attr('class', 'legend-static legend-threshold')
                .html((/**
             * @return {?}
             */
            function () {
                return "\n          <span class=\"legend-key\"></span>\n          <span class=\"legend-label\">" + _this.thresholdLabel + "</span>\n        ";
            }));
        }
        this.updateChart();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PbdsDatavizBarComponent.prototype.ngOnChanges = /**
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
    PbdsDatavizBarComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.tooltip)
            this.tooltip.remove();
    };
    PbdsDatavizBarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-bar',
                    template: "",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizBarComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: ElementRef },
        { type: ViewportScroller },
        { type: Location }
    ]; };
    PbdsDatavizBarComponent.propDecorators = {
        chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
        barClass: [{ type: HostBinding, args: ['class.pbds-chart-bar',] }],
        data: [{ type: Input }],
        width: [{ type: Input }],
        height: [{ type: Input }],
        type: [{ type: Input }],
        singleSeries: [{ type: Input }],
        xAxisFormatType: [{ type: Input }],
        xAxisFormatString: [{ type: Input }],
        xAxisTitle: [{ type: Input }],
        yAxisFormatType: [{ type: Input }],
        yAxisFormatString: [{ type: Input }],
        yAxisTicks: [{ type: Input }],
        yAxisMinBuffer: [{ type: Input }],
        yAxisMaxBuffer: [{ type: Input }],
        hideLegend: [{ type: Input }],
        legendWidth: [{ type: Input }],
        legendPosition: [{ type: Input }],
        legendLabelFormatType: [{ type: Input }],
        legendLabelFormatString: [{ type: Input }],
        tooltipLabelFormatType: [{ type: Input }],
        tooltipLabelFormatString: [{ type: Input }],
        tooltipValueFormatType: [{ type: Input }],
        tooltipValueFormatString: [{ type: Input }],
        marginTop: [{ type: Input }],
        marginRight: [{ type: Input }],
        marginBottom: [{ type: Input }],
        marginLeft: [{ type: Input }],
        threshold: [{ type: Input }],
        thresholdLabel: [{ type: Input }],
        average: [{ type: Input }],
        averageLabel: [{ type: Input }],
        theme: [{ type: Input }],
        hovered: [{ type: Output }],
        clicked: [{ type: Output }]
    };
    return PbdsDatavizBarComponent;
}());
export { PbdsDatavizBarComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.barClass;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.type;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.singleSeries;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.xAxisTitle;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisTicks;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisMinBuffer;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisMaxBuffer;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.threshold;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.thresholdLabel;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.average;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.averageLabel;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideGrayBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yThreshold;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAverage;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisTitleMargin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideTooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideTooltipLabel;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltipLabelFormat;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.barMouseOver;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.barMouseOut;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.barMouseClick;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype._scroll;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype._location;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUdYLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFN0QsT0FBTyxFQUNMLE1BQU0sSUFBSSxTQUFTLEVBQ25CLFFBQVEsSUFBSSxXQUFXLEVBQ3ZCLFlBQVksSUFBSSxlQUFlLEVBQy9CLFNBQVMsSUFBSSxZQUFZLEVBQ3pCLFdBQVcsSUFBSSxjQUFjLEVBQzdCLEdBQUcsSUFBSSxNQUFNLEVBQ2IsR0FBRyxJQUFJLE1BQU0sRUFDYixVQUFVLElBQUksYUFBYSxFQUMzQixRQUFRLElBQUksV0FBVyxFQUN2QixLQUFLLElBQUksUUFBUSxFQUNsQixNQUFNLElBQUksQ0FBQztBQUVaLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR3ZEO0lBeUpFLGlDQUNVLFFBQTRCLEVBQzVCLFFBQW9CLEVBQ3BCLE9BQXlCLEVBQ3pCLFNBQW1CO1FBSjdCLGlCQUtJO1FBSk0sYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUNwQixZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQUN6QixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBcko3QixlQUFVLEdBQUcsSUFBSSxDQUFDO1FBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFNaEIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFdBQU0sR0FBRyxHQUFHLENBQUM7UUFHYixTQUFJLEdBQXdD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OENBQW9COzs7OztJQUNwQix3Q0FBYzs7Ozs7SUFDZCw0Q0FBa0I7Ozs7O0lBQ2xCLHdDQUFjOzs7OztJQUNkLDRDQUFrQjs7Ozs7SUFDbEIsZ0RBQThCOzs7OztJQUM5QixxREFBbUM7Ozs7O0lBQ25DLGdEQUE4Qjs7Ozs7SUFDOUIscURBQW1DOzs7OztJQUNuQyw0Q0FBMkI7Ozs7O0lBQzNCLDRDQUEyQjs7Ozs7SUFDM0Isa0RBQWlDOzs7OztJQUNqQyxrREFBaUM7Ozs7O0lBQ2pDLGdEQUErQjs7Ozs7SUFDL0IsZ0RBQStCOzs7OztJQUMvQiw0Q0FBMkI7Ozs7O0lBQzNCLDRDQUEyQjs7Ozs7SUFDM0IsaURBQWdDOzs7OztJQUNoQyxpREFBZ0M7Ozs7O0lBQ2hDLG9EQUEwQjs7Ozs7SUFDMUIsMENBQWdCOzs7OztJQUNoQiw4Q0FBNkI7Ozs7O0lBQzdCLG1EQUFrQzs7Ozs7SUFDbEMscURBQTJCOzs7OztJQUMzQixxREFBMkI7O0lBeVIzQiw4Q0FzT0U7O0lBRUYsK0NBb0JFOztJQUVGLDhDQVNFOztJQUVGLGdEQUVFOztJQUVGLGtEQTBCRTs7SUFFRixpREFTRTs7SUFFRixtREFFRTs7Ozs7SUFFRiw4Q0FvQ0U7Ozs7O0lBRUYsOENBRUU7Ozs7O0lBRUYsaURBWUU7Ozs7O0lBRUYsaURBWUU7Ozs7O0lBbHBCQSwyQ0FBb0M7Ozs7O0lBQ3BDLDJDQUE0Qjs7Ozs7SUFDNUIsMENBQWlDOzs7OztJQUNqQyw0Q0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyLCBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7XG4gIHNlbGVjdCBhcyBkM19zZWxlY3QsXG4gIGlzb1BhcnNlIGFzIGQzX2lzb1BhcnNlLFxuICBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsLFxuICBzY2FsZUJhbmQgYXMgZDNfc2NhbGVCYW5kLFxuICBzY2FsZUxpbmVhciBhcyBkM19zY2FsZUxpbmVhcixcbiAgbWluIGFzIGQzX21pbixcbiAgbWF4IGFzIGQzX21heCxcbiAgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLFxuICBheGlzTGVmdCBhcyBkM19heGlzTGVmdCxcbiAgZXZlbnQgYXMgZDNfZXZlbnRcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhciB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWJhcicsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWJhcicpXG4gIGJhckNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBQYmRzRGF0YXZpekJhcltdO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzA2O1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbG93JyB8ICdtZWRpdW0nIHwgJ2hpZ2gnIHwgJ2RlYnVnJyA9ICdtZWRpdW0nOyAvLyBkZWJ1ZyB0byBzaG93IGFsbCBjaGFydCBvcHRpb25zXG5cbiAgQElucHV0KClcbiAgc2luZ2xlU2VyaWVzID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB4QXhpc1RpdGxlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzVGlja3MgPSA1O1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWluQnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICB5QXhpc01heEJ1ZmZlciA9IDAuMDE7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMTA1ICsgMjg7IC8vIGhhcmRjb2RlZCBsZWdlbmQgd2lkdGggKyBsZWZ0IG1hcmdpbiwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbGVnZW5kUG9zaXRpb246ICdyaWdodCcgfCAnYm90dG9tJyA9ICdyaWdodCc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDEwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMzA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gNTU7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICB0aHJlc2hvbGQgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRocmVzaG9sZExhYmVsID0gJ1RocmVzaG9sZCc7XG5cbiAgQElucHV0KClcbiAgYXZlcmFnZSA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgYXZlcmFnZUxhYmVsID0gJ0F2ZXJhZ2UnO1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lO1xuXG4gIEBPdXRwdXQoKVxuICBob3ZlcmVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBPdXRwdXQoKVxuICBjbGlja2VkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcbiAgcHJpdmF0ZSBjb2xvclJhbmdlO1xuICBwcml2YXRlIGhpZGVHcmF5QmFyczogYm9vbGVhbjtcbiAgcHJpdmF0ZSB5VGhyZXNob2xkO1xuICBwcml2YXRlIHlBdmVyYWdlO1xuICBwcml2YXRlIHhBeGlzU2NhbGU7XG4gIHByaXZhdGUgeEF4aXNDYWxsO1xuICBwcml2YXRlIHhBeGlzO1xuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xuICBwcml2YXRlIHhBeGlzVGl0bGVNYXJnaW46IG51bWJlcjtcbiAgcHJpdmF0ZSB5QXhpc1NjYWxlO1xuICBwcml2YXRlIHlBeGlzQ2FsbDtcbiAgcHJpdmF0ZSB5QXhpcztcbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdDtcbiAgcHJpdmF0ZSB4R3JpZDtcbiAgcHJpdmF0ZSB4R3JpZENhbGw7XG4gIHByaXZhdGUgeUdyaWQ7XG4gIHByaXZhdGUgeUdyaWRDYWxsO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgaGlkZVhBeGlzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEdyaWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlHcmlkOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgaGlkZVRvb2x0aXA6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVRvb2x0aXBMYWJlbDogYm9vbGVhbjtcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcExhYmVsRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcixcbiAgICBwcml2YXRlIF9sb2NhdGlvbjogTG9jYXRpb25cbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXG4gICAgICByaWdodDogK3RoaXMubWFyZ2luUmlnaHQsXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRlIGZvcm1hdHRlcnNcbiAgICB0aGlzLnhBeGlzRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0VHlwZSwgdGhpcy54QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy55QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy55QXhpc0Zvcm1hdFR5cGUsIHRoaXMueUF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcpO1xuXG4gICAgLy8gZGVmYXVsdHMgZm9yIGFsbCBjaGFydCB0eXBlc1xuICAgIHRoaXMuaGlkZUdyYXlCYXJzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhHcmlkID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUdyaWQgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlVG9vbHRpcCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gZmFsc2U7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnhBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgdGhpcy54QXhpc1RpdGxlTWFyZ2luID0gdGhpcy54QXhpc1RpdGxlID8gMjAgOiAwO1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuICAgIHRoaXMuaGlkZVRvb2x0aXBMYWJlbCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMudHlwZSAhPT0gJ2RlYnVnJykge1xuICAgICAgLy8gc2V0IHR5cGUgZGVmYXVsdHNcbiAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2xvdyc6XG4gICAgICAgICAgdGhpcy5oaWRlR3JheUJhcnMgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzID0gIXRoaXMuaGlkZUxlZ2VuZDtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmxlZ2VuZFBvc2l0aW9uID0gJ2JvdHRvbSc7XG4gICAgICAgICAgdGhpcy5oaWRlVG9vbHRpcExhYmVsID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdtZWRpdW0nOlxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpcyA9ICF0aGlzLmhpZGVMZWdlbmQ7XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZR3JpZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlVG9vbHRpcExhYmVsID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdoaWdoJzpcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhHcmlkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZUxlZ2VuZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlVG9vbHRpcExhYmVsID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIC8vIHNpbmdsZSBzZXJpZXMgb3ZlcnJpZGVzXG4gICAgICBpZiAodGhpcy5zaW5nbGVTZXJpZXMpIHtcbiAgICAgICAgdGhpcy5oaWRlTGVnZW5kID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oaWRlWEF4aXMgPSB0cnVlO1xuICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXBMYWJlbCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFkanVzdCBtYXJnaW4gaWYgeEF4aXMgaGlkZGVuXG4gICAgaWYgKHRoaXMuaGlkZVhBeGlzKSB0aGlzLm1hcmdpbi5ib3R0b20gPSAxMDsgLy8gbmVlZCBzbWFsbCBtYXJnaW4gZm9yIHlBeGlzIHdpdGggMCB0aWNrIGxhYmVsXG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCAmJiB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICB0aGlzLndpZHRoID0gK3RoaXMud2lkdGggLSArdGhpcy5sZWdlbmRXaWR0aDtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20gKyB0aGlzLnhBeGlzVGl0bGVNYXJnaW4pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aH0gJHsrdGhpcy5oZWlnaHQgK1xuICAgICAgICAgIHRoaXMubWFyZ2luLnRvcCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4uYm90dG9tICtcbiAgICAgICAgICB0aGlzLnhBeGlzVGl0bGVNYXJnaW59YFxuICAgICAgKTtcblxuICAgIC8vIGJ1aWxkIGNvbG9yIHJhbmdlc1xuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpLnJhbmdlKFxuICAgICAgdGhpcy5fZGF0YXZpei5jcmVhdGVHcmFkaWVudERlZnModGhpcy5zdmcsIHRoaXMuc2luZ2xlU2VyaWVzLCB0aGlzLnRoZW1lKVxuICAgICk7XG5cbiAgICAvLyBYIEFYSVNcbiAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUJhbmQoKVxuICAgICAgLmRvbWFpbih0aGlzLmRhdGEubWFwKGQgPT4gZC5sYWJlbCkpXG4gICAgICAucmFuZ2VSb3VuZChbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnRdKVxuICAgICAgLmFsaWduKDApO1xuXG4gICAgLy8gYWRkIHBhZGRpbmcgdG8gdGhlIHNjYWxlIGZvciBncmF5IGJhcnNcbiAgICAhdGhpcy5oaWRlR3JheUJhcnNcbiAgICAgID8gdGhpcy54QXhpc1NjYWxlLnBhZGRpbmdJbm5lcigwLjEpLnBhZGRpbmdPdXRlcigwKVxuICAgICAgOiB0aGlzLnhBeGlzU2NhbGUucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKTtcblxuICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAudGlja1NpemUodGhpcy54QXhpc1RpY2tTaXplKVxuICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy54QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAudGlja0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0dGVyKTtcblxuICAgIHRoaXMueEF4aXMgPSB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXgnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgLy8gWCBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKS50aWNrU2l6ZSgtdGhpcy5oZWlnaHQpO1xuXG4gICAgICB0aGlzLnhHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteCcpXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gWCBBWElTIFRJVExFXG4gICAgaWYgKHRoaXMueEF4aXNUaXRsZSkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzLXRpdGxlJylcbiAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ2NlbnRlcicpXG4gICAgICAgIC5hdHRyKCd4JywgdGhpcy53aWR0aCAvIDIgLSB0aGlzLm1hcmdpbi5sZWZ0KVxuICAgICAgICAuYXR0cigneScsIHRoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgKHRoaXMuaGlkZVhBeGlzID8gMTUgOiAwKSlcbiAgICAgICAgLnRleHQodGhpcy54QXhpc1RpdGxlKTtcbiAgICB9XG5cbiAgICAvLyBZIEFYSVNcbiAgICB0aGlzLnlBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFtcbiAgICAgICAgZDNfbWluKHRoaXMuZGF0YSwgZCA9PiBkLnZhbHVlIC0gZC52YWx1ZSAqICt0aGlzLnlBeGlzTWluQnVmZmVyKSxcbiAgICAgICAgZDNfbWF4KHRoaXMuZGF0YSwgZCA9PiBkLnZhbHVlICsgZC52YWx1ZSAqICt0aGlzLnlBeGlzTWF4QnVmZmVyKVxuICAgICAgXSlcbiAgICAgIC5uaWNlKClcbiAgICAgIC5yYW5nZVJvdW5kKFt0aGlzLmhlaWdodCwgMF0pO1xuXG4gICAgdGhpcy55QXhpc0NhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgLnRpY2tTaXplKHRoaXMueUF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy55QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnlBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy15JylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gWSBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XG4gICAgICB0aGlzLnlHcmlkQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgICAgLnRpY2tTaXplKC10aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KTtcblxuICAgICAgdGhpcy55R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXknKVxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgMClgKVxuICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gWSBUSFJFU0hPTERcbiAgICBpZiAodGhpcy50aHJlc2hvbGQpIHtcbiAgICAgIHRoaXMueVRocmVzaG9sZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2xpbmUnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAndGhyZXNob2xkJylcbiAgICAgICAgLmF0dHIoJ3gyJywgK3RoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5yaWdodCAtIHRoaXMubWFyZ2luLmxlZnQpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICAke3RoaXMueUF4aXNTY2FsZSgrdGhpcy50aHJlc2hvbGQpfSlgKTtcbiAgICB9XG5cbiAgICAvLyBZIEFWRVJBR0VcbiAgICBpZiAodGhpcy5hdmVyYWdlKSB7XG4gICAgICB0aGlzLnlBdmVyYWdlID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnbGluZScpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdhdmVyYWdlJylcbiAgICAgICAgLmF0dHIoJ3gyJywgK3RoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5yaWdodCAtIHRoaXMubWFyZ2luLmxlZnQpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICAke3RoaXMueUF4aXNTY2FsZSgrdGhpcy5hdmVyYWdlKX0pYCk7XG4gICAgfVxuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuICAgIH1cblxuICAgIC8vIGFkZCBsZWdlbmQgY2xhc3Nlc1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xuICAgIH1cblxuICAgIC8vIGFkZCBhdmVyYWdlIHRvIGxlZ2VuZFxuICAgIGlmICh0aGlzLmF2ZXJhZ2UgJiYgIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcbiAgICAgICAgLmFwcGVuZCgnbGknKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLXN0YXRpYyBsZWdlbmQtYXZlcmFnZScpXG4gICAgICAgIC5odG1sKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGVnZW5kLWtleVwiPjwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImxlZ2VuZC1sYWJlbFwiPiR7dGhpcy5hdmVyYWdlTGFiZWx9PC9zcGFuPlxuICAgICAgICBgO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdGhyZXNob2xkIHRvIGxlZ2VuZFxuICAgIGlmICh0aGlzLnRocmVzaG9sZCAmJiAhdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0XG4gICAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgICAuYXBwZW5kKCdsaScpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtc3RhdGljIGxlZ2VuZC10aHJlc2hvbGQnKVxuICAgICAgICAuaHRtbCgoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImxlZ2VuZC1rZXlcIj48L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJsZWdlbmQtbGFiZWxcIj4ke3RoaXMudGhyZXNob2xkTGFiZWx9PC9zcGFuPlxuICAgICAgICBgO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgLy8gdXBkYXRlIHRoZSB4U2NhbGVcbiAgICB0aGlzLnhBeGlzU2NhbGUuZG9tYWluKHRoaXMuZGF0YS5tYXAoZCA9PiBkLmxhYmVsKSk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIHlTY2FsZVxuICAgIHRoaXMueUF4aXNTY2FsZVxuICAgICAgLmRvbWFpbihbXG4gICAgICAgIGQzX21pbih0aGlzLmRhdGEsIGQgPT4gZC52YWx1ZSAtIGQudmFsdWUgKiArdGhpcy55QXhpc01pbkJ1ZmZlciksXG4gICAgICAgIGQzX21heCh0aGlzLmRhdGEsIGQgPT4gZC52YWx1ZSArIGQudmFsdWUgKiArdGhpcy55QXhpc01heEJ1ZmZlcilcbiAgICAgIF0pXG4gICAgICAucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKVxuICAgICAgLm5pY2UoKTtcblxuICAgIHRoaXMueEF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgdGhpcy55QXhpc1xuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIGdyaWRzXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZFxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgdGhpcy55R3JpZFxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVHcmF5QmFycykge1xuICAgICAgLy8gZ3JheSBiYXJzXG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuZ3JheS1iYXInKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+XG4gICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyYXktYmFyJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC5sYWJlbCkpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgICAgLmNhbGwoZW50ZXIgPT5cbiAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpLFxuICAgICAgICAgIGV4aXQgPT5cbiAgICAgICAgICAgIGV4aXRcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgICApO1xuXG4gICAgICAvLyBjb2xvciBiYXJzXG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXInKVxuICAgICAgICAgICAgICAuYXR0cignZmlsbCcsIGQgPT4gYHVybCgke3RoaXMuX2xvY2F0aW9uLnBhdGgoKX0jZ3JhZGllbnQtJHt0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkuc3Vic3RyKDEpfSlgKSAvLyByZW1vdmVzIGhhc2ggdG8gcHJldmVudCBzYWZhcmkgYnVnO1xuICAgICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQubGFiZWwpICsgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNClcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gMilcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgLmNhbGwoZW50ZXIgPT5cbiAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGQgPT4gdGhpcy5oZWlnaHQgLSB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1jb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLmxhYmVsKSArIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDIpXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IHRoaXMuaGVpZ2h0IC0gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgICAgZXhpdCA9PlxuICAgICAgICAgICAgZXhpdFxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgLnJlbW92ZSgpXG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VPdXQoKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbG9yIGJhcnNcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+XG4gICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucGF0aCgpfSNncmFkaWVudC0ke3RoaXMuY29sb3JSYW5nZShkLmxhYmVsKS5zdWJzdHIoMSl9KWApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC5sYWJlbCkgKyB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA1LjUpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDEuNSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgLmNhbGwoZW50ZXIgPT5cbiAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGQgPT4gdGhpcy5oZWlnaHQgLSB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1jb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLmxhYmVsKSArIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDUuNSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gMS41KVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiB0aGlzLmhlaWdodCAtIHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICAgIGV4aXQgPT5cbiAgICAgICAgICAgIGV4aXRcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlT3V0KCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0XG4gICAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZW50ZXIuaW5zZXJ0KCdsaScsICdsaS5sZWdlbmQtc3RhdGljJykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKTtcblxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1rZXknKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCBkID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKVxuICAgICAgICAgICAgICAuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmxhYmVsKTtcblxuICAgICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1sYWJlbCcpLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubGVnZW5kTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4gdGhpcy5sZWdlbmRNb3VzZU91dCgpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5sZWdlbmRNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50aHJlc2hvbGQpIHtcbiAgICAgIHRoaXMueVRocmVzaG9sZFxuICAgICAgICAucmFpc2UoKVxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAgJHt0aGlzLnlBeGlzU2NhbGUoK3RoaXMudGhyZXNob2xkKX0pYCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXZlcmFnZSkge1xuICAgICAgdGhpcy55QXZlcmFnZVxuICAgICAgICAucmFpc2UoKVxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAgJHt0aGlzLnlBeGlzU2NhbGUoK3RoaXMuYXZlcmFnZSl9KWApO1xuICAgIH1cbiAgfTtcblxuICBiYXJNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIGNvbnN0IGJhciA9IHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuYmFyJykuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleCk7XG5cbiAgICBjb25zdCBiYXJDb2xvciA9IGJhci5hdHRyKCdkYXRhLWNvbG9yJyk7XG5cbiAgICBiYXIuc3R5bGUoJ2ZpbGwnLCBiYXJDb2xvcik7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMudG9vbHRpcFNob3coZGF0YSwgbm9kZXMuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleClbMF0pO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBiYXJNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKVxuICAgICAgLnN0eWxlKCdmaWxsJywgbnVsbCk7XG5cbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgYmFyTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgY29uc3QgYmFyID0gdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXInKS5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGluZGV4KTtcblxuICAgIGNvbnN0IGJhckNvbG9yID0gYmFyLmF0dHIoJ2RhdGEtY29sb3InKTtcblxuICAgIGJhci5zdHlsZSgnZmlsbCcsIGJhckNvbG9yKTtcblxuICAgIHRoaXMudG9vbHRpcFNob3coXG4gICAgICBkYXRhLFxuICAgICAgdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpXG4gICAgICAgIC5ub2RlKClcbiAgICApO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKVxuICAgICAgLnN0eWxlKCdmaWxsJywgbnVsbCk7XG5cbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKGRhdGEsIG5vZGUpID0+IHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBsZXQgbGFiZWw7XG5cbiAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgbGFiZWwgPSB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChkYXRhLmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZGF0YS5sYWJlbCk7XG4gICAgICAgIGxhYmVsID0gdGhpcy50b29sdGlwTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsYWJlbCA9IGRhdGEubGFiZWw7XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlID1cbiAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgID8gYDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlXCI+JHtkYXRhLnZhbHVlfTwvZGl2PmBcbiAgICAgICAgOiBgPGRpdiBjbGFzcz1cInRvb2x0aXAtdmFsdWVcIj4ke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfTwvZGl2PmA7XG5cbiAgICB0aGlzLnRvb2x0aXAuaHRtbChcbiAgICAgIGBcbiAgICAgICAgJHt0aGlzLmhpZGVUb29sdGlwTGFiZWwgPyAnJyA6IGAke2xhYmVsfWB9XG4gICAgICAgICR7dmFsdWV9XG4gICAgICBgXG4gICAgKTtcblxuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRXaWR0aCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldFdpZHRoIC8gMjtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0ICsgODtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7K3Njcm9sbFsxXSArICtkaW1lbnNpb25zLnRvcCAtIHRvb2x0aXBPZmZzZXRIZWlnaHR9cHhgKTsgLy9cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBgJHsrc2Nyb2xsWzBdICsgK2RpbWVuc2lvbnMubGVmdCAtIHRvb2x0aXBPZmZzZXRXaWR0aCArICtkaW1lbnNpb25zLndpZHRoIC8gMn1weGApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIHN3aXRjaCAodGhpcy54QXhpc0Zvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KGl0ZW0pO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XG4gICAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHlBeGlzRm9ybWF0dGVyID0gaXRlbSA9PiB7XG4gICAgc3dpdGNoICh0aGlzLnlBeGlzRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQoaXRlbSk7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQocGFyc2VEYXRlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9O1xufVxuIl19
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { select as d3_select, event as d3_event } from 'd3-selection';
import { scaleOrdinal as d3_scaleOrdinal, scaleBand as d3_scaleBand, scaleLinear as d3_scaleLinear } from 'd3-scale';
import { max as d3_max } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { values as d3_values } from 'd3-collection';
import { isoParse as d3_isoParse } from 'd3-time-format';
import { PbdsDatavizService } from './dataviz.service';
var PbdsDatavizBarGroupedComponent = /** @class */ (function () {
    function PbdsDatavizBarGroupedComponent(_dataviz, _element, _scroll, _location) {
        var _this = this;
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this._location = _location;
        this.chartClass = true;
        this.groupedBarClass = true;
        this.width = 306;
        this.height = 400;
        this.vertical = true;
        this.hideXAxis = false;
        this.xAxisMaxBuffer = 0.01;
        this.xAxisFormatType = null;
        this.xAxisFormatString = '';
        this.xAxisTicks = 5;
        this.hideYAxis = false;
        this.yAxisMaxBuffer = 0.01;
        this.yAxisFormatType = null;
        this.yAxisFormatString = '';
        this.yAxisTicks = 5;
        this.marginTop = 10;
        this.marginRight = this.vertical ? 0 : 55;
        this.marginBottom = 30;
        this.marginLeft = 55;
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'right';
        this.legendLabelFormatType = null;
        this.legendLabelFormatString = '';
        this.hideTooltip = false;
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.showGrid = false;
        this.theme = 'classic';
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.barMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            /** @type {?} */
            var node = d3_select(nodes[index]);
            _this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .classed('inactive', true);
            node.classed('inactive', false).style('fill', node.attr('data-color'));
            _this.tooltipShow(data, nodes[index]);
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
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; }))
                .classed('inactive', true);
            /** @type {?} */
            var bar = _this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i === index; }))
                .classed('inactive', null);
            /** @type {?} */
            var barColor = bar.attr('data-color');
            bar.style('fill', (/**
             * @return {?}
             */
            function () { return barColor; }));
            _this.hovered.emit({ event: event, data: data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        function () {
            _this.chart.selectAll('.legend-item').classed('inactive', false);
            _this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
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
            _this.tooltip.html("\n        " + label + "\n        " + value + "\n      ");
            /** @type {?} */
            var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight;
            /** @type {?} */
            var tooltipTipSize = 8;
            if (_this.vertical) {
                _this.tooltip.style('top', +scroll[1] + +dimensions.top - tooltipOffsetHeight - tooltipTipSize + "px");
                _this.tooltip.style('left', +scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2 + "px");
            }
            else {
                _this.tooltip.style('top', +scroll[1] + +dimensions.top + +dimensions.height / 2 - tooltipOffsetHeight / 2 + "px");
                _this.tooltip.style('left', +scroll[0] + +dimensions.right + tooltipTipSize + "px");
            }
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
    PbdsDatavizBarGroupedComponent.prototype.ngOnInit = /**
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
        this.hideXAxisZero = false;
        this.hideXAxisDomain = false;
        this.hideXAxisTicks = true;
        this.xAxisTickSize = 8;
        this.xAxisTickSizeOuter = 0;
        this.hideYAxisZero = false;
        this.hideYAxisDomain = false;
        this.hideYAxisTicks = true;
        this.yAxisTickSize = 8;
        this.yAxisTickSizeOuter = 0;
        if (!this.hideLegend && this.legendPosition === 'right') {
            this.width = +this.width - +this.legendWidth;
        }
        // create the chart
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', (/**
         * @return {?}
         */
        function () {
            if (_this.vertical) {
                return +_this.width;
            }
            else {
                return +_this.width + _this.margin.left + _this.margin.right;
            }
        }))
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', (/**
         * @return {?}
         */
        function () {
            if (_this.vertical) {
                return "-" + _this.margin.left + " -" + _this.margin.top + " " + +_this.width + " " + (+_this.height +
                    _this.margin.top +
                    _this.margin.bottom);
            }
            else {
                return "-" + _this.margin.left + " -" + _this.margin.top + " " + (+_this.width + _this.margin.left + _this.margin.right) + " " + (+_this
                    .height +
                    _this.margin.top +
                    _this.margin.bottom);
            }
        }));
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', (/**
             * @return {?}
             */
            function () {
                return _this.vertical ? 'pbds-tooltip south' : 'pbds-tooltip west';
            }))
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
        }
        // build color ranges
        this.colorRange = d3_scaleOrdinal().range(this._dataviz.createGradientDefs(this.svg, false, this.theme, this.vertical));
        if (this.vertical) {
            // X AXIS
            this.xAxisScale = d3_scaleBand()
                .domain(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.key; })))
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
            // if (!this.hideXGrid) {
            //   this.xGridCall = d3_axisBottom(this.xAxisScale).tickSize(-this.height);
            //   this.xGrid = this.svg
            //     .append('g')
            //     .attr('class', 'grid grid-x')
            //     .classed('grid-zero-hidden', this.hideXAxisZero)
            //     .attr('transform', `translate(0, ${this.height})`)
            //     .call(this.xGridCall);
            // }
            // Y AXIS
            this.yAxisMax = d3_max(this.data, (/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                /** @type {?} */
                var clone = tslib_1.__assign({}, data);
                delete clone.key;
                return d3_max(d3_values(clone));
            }));
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale = d3_scaleLinear()
                .domain([0, this.yAxisMax])
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
            if (this.showGrid) {
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
            // color bar scale
            this.barScale = d3_scaleBand()
                .domain(Object.keys(this.data[0]).slice(1))
                .rangeRound([0, this.xAxisScale.bandwidth()])
                .paddingInner(0.2)
                .paddingOuter(0.5);
            this.updateChartVertical();
        }
        else {
            // X AXIS
            this.xAxisMax = d3_max(this.data, (/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                /** @type {?} */
                var clone = tslib_1.__assign({}, data);
                delete clone.key;
                return d3_max(d3_values(clone));
            }));
            this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
            this.xAxisScale = d3_scaleLinear()
                .domain([0, this.xAxisMax])
                .rangeRound([0, this.width])
                .nice();
            this.xAxisCall = d3_axisBottom(this.xAxisScale)
                .ticks(this.xAxisTicks)
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
            // Y AXIS
            this.yAxisScale = d3_scaleBand()
                .domain(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.key; })))
                .rangeRound([0, this.height])
                .align(1);
            // add padding to the scale for gray bars
            !this.hideGrayBars
                ? this.yAxisScale.paddingInner(0.1).paddingOuter(0)
                : this.yAxisScale.paddingInner(0).paddingOuter(0);
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
            // X GRIDLINES
            if (this.showGrid) {
                this.xGridCall = d3_axisBottom(this.xAxisScale).tickSize(-this.height);
                this.xGrid = this.svg
                    .append('g')
                    .attr('class', 'grid grid-x')
                    .classed('grid-zero-hidden', this.hideXAxisZero)
                    .attr('transform', "translate(0, " + this.height + ")")
                    .call(this.xGridCall);
            }
            // Y GRIDLINES
            // if (!this.hideYGrid) {
            //   this.yGridCall = d3_axisLeft(this.yAxisScale)
            //     .ticks(this.yAxisTicks)
            //     .tickSize(-this.width);
            //   this.yGrid = this.svg
            //     .append('g')
            //     .attr('class', 'grid grid-y')
            //     .classed('grid-zero-hidden', this.hideYAxisZero)
            //     .attr('transform', `translate(0, 0)`)
            //     .call(this.yGridCall);
            // }
            // color bar scale
            this.barScale = d3_scaleBand()
                .domain(Object.keys(this.data[0]).slice(1))
                .rangeRound([this.yAxisScale.bandwidth(), 0])
                .paddingInner(0.2)
                .paddingOuter(0.5);
            this.updateChartHorizontal();
        }
    };
    /**
     * @return {?}
     */
    PbdsDatavizBarGroupedComponent.prototype.ngOnDestroy = /**
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
    PbdsDatavizBarGroupedComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.data && !changes.data.firstChange) {
            if (this.vertical) {
                this.updateChartVertical();
            }
            else {
                this.updateChartHorizontal();
            }
        }
    };
    /**
     * @return {?}
     */
    PbdsDatavizBarGroupedComponent.prototype.updateChartVertical = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // update the xScale
        this.xAxisScale.domain(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.key; })));
        // update the yScale
        this.yAxisMax = d3_max(this.data, (/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            /** @type {?} */
            var clone = tslib_1.__assign({}, data);
            delete clone.key;
            return d3_max(d3_values(clone));
        }));
        this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
        this.yAxisScale
            .domain([0, this.yAxisMax])
            .rangeRound([this.height, 0])
            .nice();
        this.xAxis
            .transition()
            .duration(1000)
            .call(this.xAxisCall);
        this.yAxis
            .transition()
            .duration(1000)
            .call(this.yAxisCall);
        // update the grids
        // if (!this.hideXGrid) {
        //   this.xGrid
        //     .transition()
        //     .duration(1000)
        //     .call(this.xGridCall);
        // }
        if (this.showGrid) {
            this.yGrid
                .transition()
                .duration(1000)
                .call(this.yGridCall);
        }
        // update the color bar scale
        this.barScale.domain(Object.keys(this.data[0]).slice(1)).rangeRound([0, this.xAxisScale.bandwidth()]);
        this.svg
            .selectAll('.gray-bar')
            .data(this.data)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        function (enter) {
            return enter
                .append('rect')
                .attr('class', 'gray-bar')
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.xAxisScale(d.key); }))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.yAxisScale(d.value); }))
                .attr('width', _this.xAxisScale.bandwidth())
                .attr('height', _this.height);
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
            function (d) { return _this.xAxisScale(d.key); }))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.yAxisScale(d.value); }))
                .attr('width', _this.xAxisScale.bandwidth())
                .attr('height', _this.height);
        }));
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        function (enter) {
            return enter
                .append('g')
                .attr('class', 'bar-group')
                .attr('transform', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                return "translate(" + _this.xAxisScale(d.key) + ", 0)";
            }));
        }), (/**
         * @param {?} update
         * @return {?}
         */
        function (update) {
            return update
                .transition()
                .duration(1000)
                .attr('transform', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                return "translate(" + _this.xAxisScale(d.key) + ", 0)";
            }));
        }));
        this.svg
            .selectAll('.bar-group')
            .selectAll('.bar')
            .data((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) {
            /** @type {?} */
            var clone = tslib_1.__assign({}, d);
            delete clone.key;
            /** @type {?} */
            var keys = Object.keys(clone);
            /** @type {?} */
            var keyData = keys.map((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                return { label: key, value: d[key], parentIndex: i };
            }));
            return keyData;
        }))
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
                .attr('data-color', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.colorRange(d.label); }))
                .attr('data-parent-index', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.parentIndex; }))
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.barScale(d.label); }))
                .attr('width', _this.barScale.bandwidth())
                .attr('y', _this.height)
                .attr('height', 0)
                .call((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                return enter
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(0) // 500
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
            function (d) { return _this.barScale(d.label); }))
                .attr('width', _this.barScale.bandwidth())
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
                .duration(0) // 100
                .attr('pointer-events', 'none')
                .attr('height', 0)
                .attr('y', _this.height);
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
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    };
    /**
     * @return {?}
     */
    PbdsDatavizBarGroupedComponent.prototype.updateChartHorizontal = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // update the xScale
        this.xAxisMax = d3_max(this.data, (/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            /** @type {?} */
            var clone = tslib_1.__assign({}, data);
            delete clone.key;
            return d3_max(d3_values(clone));
        }));
        this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
        this.xAxisScale
            .domain([0, this.xAxisMax])
            .rangeRound([0, this.width])
            .nice();
        // update the yScale
        this.yAxisScale.domain(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.key; })));
        this.xAxis
            .transition()
            .duration(1000)
            .call(this.xAxisCall);
        this.yAxis
            .transition()
            .duration(1000)
            .call(this.yAxisCall);
        // update the grids
        if (this.showGrid) {
            this.xGrid
                .transition()
                .duration(1000)
                .call(this.xGridCall);
        }
        // if (!this.hideYGrid) {
        //   this.yGrid
        //     .transition()
        //     .duration(1000)
        //     .call(this.yGridCall);
        // }
        // update the color bar scale
        this.barScale.domain(Object.keys(this.data[0]).slice(1)).rangeRound([0, this.yAxisScale.bandwidth()]);
        this.svg
            .selectAll('.gray-bar')
            .data(this.data)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        function (enter) {
            return enter
                .append('rect')
                .attr('class', 'gray-bar')
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.yAxisScale(d.key); }))
                .attr('width', _this.width)
                .attr('height', _this.yAxisScale.bandwidth());
        }), (/**
         * @param {?} update
         * @return {?}
         */
        function (update) {
            return update
                .transition()
                .duration(1000)
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.yAxisScale(d.key); }))
                .attr('width', _this.width)
                .attr('height', _this.yAxisScale.bandwidth());
        }));
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        function (enter) {
            return enter
                .append('g')
                .attr('class', 'bar-group')
                .attr('transform', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                return "translate(0, " + _this.yAxisScale(d.key) + ")";
            }));
        }), (/**
         * @param {?} update
         * @return {?}
         */
        function (update) {
            return update
                .transition()
                .duration(1000)
                .attr('transform', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                return "translate(0, " + _this.yAxisScale(d.key) + ")";
            }));
        }));
        this.svg
            .selectAll('.bar-group')
            .selectAll('.bar')
            .data((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) {
            /** @type {?} */
            var clone = tslib_1.__assign({}, d);
            delete clone.key;
            /** @type {?} */
            var keys = Object.keys(clone);
            /** @type {?} */
            var keyData = keys.map((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                return { label: key, value: d[key], parentIndex: i };
            }));
            return keyData;
        }))
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
            function (d) { return "url(" + _this._location.path() + "#gradient-horizontal-" + _this.colorRange(d.label).substr(1) + ")"; }))
                .attr('data-color', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.colorRange(d.label); }))
                .attr('data-parent-index', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.parentIndex; }))
                .attr('x', 0)
                .attr('width', 0)
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.barScale(d.label); }))
                .attr('height', _this.barScale.bandwidth())
                .call((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                return enter
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(0) // 500
                    .attr('width', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.xAxisScale(d.value); }))
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
                .attr('width', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.xAxisScale(d.value); }))
                .attr('height', _this.barScale.bandwidth())
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.barScale(d.label); }))
                .transition()
                .attr('pointer-events', 'auto');
        }), (/**
         * @param {?} exit
         * @return {?}
         */
        function (exit) {
            return exit
                .transition()
                .duration(0) // 100
                .attr('pointer-events', 'none')
                .attr('width', 0);
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
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    };
    /**
     * @return {?}
     */
    PbdsDatavizBarGroupedComponent.prototype.updateLegend = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // legend
        if (!this.hideLegend) {
            /** @type {?} */
            var legendData = tslib_1.__assign({}, this.data[0]);
            delete legendData.key;
            /** @type {?} */
            var legendKeys = Object.keys(legendData).map((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                return { label: key };
            }));
            this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(legendKeys)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                /** @type {?} */
                var li = enter.append('li').attr('class', 'legend-item');
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.colorRange(d.label); }));
                li.insert('span', '.legend-item')
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
                update.select('.legend-label').html((/**
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
                return update;
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
    };
    PbdsDatavizBarGroupedComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-bar-grouped',
                    template: "",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizBarGroupedComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: ElementRef },
        { type: ViewportScroller },
        { type: Location }
    ]; };
    PbdsDatavizBarGroupedComponent.propDecorators = {
        chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
        groupedBarClass: [{ type: HostBinding, args: ['class.pbds-chart-bar-grouped',] }],
        data: [{ type: Input }],
        width: [{ type: Input }],
        height: [{ type: Input }],
        vertical: [{ type: Input }],
        hideXAxis: [{ type: Input }],
        xAxisMaxBuffer: [{ type: Input }],
        xAxisFormatType: [{ type: Input }],
        xAxisFormatString: [{ type: Input }],
        xAxisTicks: [{ type: Input }],
        hideYAxis: [{ type: Input }],
        yAxisMaxBuffer: [{ type: Input }],
        yAxisFormatType: [{ type: Input }],
        yAxisFormatString: [{ type: Input }],
        yAxisTicks: [{ type: Input }],
        marginTop: [{ type: Input }],
        marginRight: [{ type: Input }],
        marginBottom: [{ type: Input }],
        marginLeft: [{ type: Input }],
        hideLegend: [{ type: Input }],
        legendWidth: [{ type: Input }],
        legendPosition: [{ type: Input }],
        legendLabelFormatType: [{ type: Input }],
        legendLabelFormatString: [{ type: Input }],
        hideTooltip: [{ type: Input }],
        tooltipLabelFormatType: [{ type: Input }],
        tooltipLabelFormatString: [{ type: Input }],
        tooltipValueFormatType: [{ type: Input }],
        tooltipValueFormatString: [{ type: Input }],
        showGrid: [{ type: Input }],
        theme: [{ type: Input }],
        hovered: [{ type: Output }],
        clicked: [{ type: Output }]
    };
    return PbdsDatavizBarGroupedComponent;
}());
export { PbdsDatavizBarGroupedComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.groupedBarClass;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.vertical;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hideXAxis;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.xAxisMaxBuffer;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.xAxisTicks;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hideYAxis;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.yAxisMaxBuffer;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.yAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.yAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.yAxisTicks;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hideTooltip;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.showGrid;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.barScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisMax;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisMax;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideYAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideYAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideYAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideGrayBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltipLabelFormat;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.barMouseOver;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.barMouseOut;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.barMouseClick;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype._scroll;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype._location;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItZ3JvdXBlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2RhdGF2aXovZGF0YXZpei1iYXItZ3JvdXBlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUU3RCxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxLQUFLLElBQUksUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxZQUFZLElBQUksZUFBZSxFQUFFLFNBQVMsSUFBSSxZQUFZLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNySCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsVUFBVSxJQUFJLGFBQWEsRUFBRSxRQUFRLElBQUksV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxRQUFRLElBQUksV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFekQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHdkQ7SUFnSkUsd0NBQ1UsUUFBNEIsRUFDNUIsUUFBb0IsRUFDcEIsT0FBeUIsRUFDekIsU0FBbUI7UUFKN0IsaUJBS0k7UUFKTSxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BC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akIsK0NBQytEOztJQUUvRCxpREFDMkQ7O0lBRTNELGlEQUMyRDs7Ozs7SUFFM0Qsa0RBQWlCOzs7OztJQUNqQiwrQ0FBYzs7Ozs7SUFDZCw2Q0FBWTs7Ozs7SUFDWixnREFBZTs7Ozs7SUFDZixvREFBbUI7Ozs7O0lBQ25CLGtEQUFpQjs7Ozs7SUFDakIsb0RBQW1COzs7OztJQUNuQixtREFBa0I7Ozs7O0lBQ2xCLCtDQUFjOzs7OztJQUNkLHVEQUE4Qjs7Ozs7SUFDOUIsNERBQW1DOzs7OztJQUNuQyxxREFBb0I7Ozs7O0lBQ3BCLHlEQUFpQzs7Ozs7SUFDakMsdURBQStCOzs7OztJQUMvQix3REFBZ0M7Ozs7O0lBQ2hDLCtDQUFjOzs7OztJQUNkLG1EQUFrQjs7Ozs7SUFDbEIsa0RBQWlCOzs7OztJQUNqQixvREFBbUI7Ozs7O0lBQ25CLG1EQUFrQjs7Ozs7SUFDbEIsK0NBQWM7Ozs7O0lBQ2QscURBQW9COzs7OztJQUNwQix1REFBOEI7Ozs7O0lBQzlCLDREQUFtQzs7Ozs7SUFDbkMsdURBQStCOzs7OztJQUMvQix5REFBaUM7Ozs7O0lBQ2pDLHdEQUFnQzs7Ozs7SUFDaEMsK0NBQWM7Ozs7O0lBQ2QsbURBQWtCOzs7OztJQUNsQiwyREFBMEI7Ozs7O0lBQzFCLHNEQUE4Qjs7Ozs7SUFDOUIsaURBQWdCOzs7OztJQUNoQiw0REFBMkI7Ozs7O0lBQzNCLDREQUEyQjs7SUFrcEIzQixzREFhRTs7SUFFRixxREFPRTs7SUFFRix1REFFRTs7SUFFRix5REF1QkU7O0lBRUYsd0RBUUU7O0lBRUYsMERBRUU7Ozs7O0lBRUYscURBNENFOzs7OztJQUVGLHFEQUVFOzs7OztJQUVGLHdEQVlFOzs7OztJQUVGLHdEQVlFOzs7OztJQTl4QkEsa0RBQW9DOzs7OztJQUNwQyxrREFBNEI7Ozs7O0lBQzVCLGlEQUFpQzs7Ozs7SUFDakMsbURBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciwgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0LCBldmVudCBhcyBkM19ldmVudCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsLCBzY2FsZUJhbmQgYXMgZDNfc2NhbGVCYW5kLCBzY2FsZUxpbmVhciBhcyBkM19zY2FsZUxpbmVhciB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IG1heCBhcyBkM19tYXggfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQgeyBheGlzQm90dG9tIGFzIGQzX2F4aXNCb3R0b20sIGF4aXNMZWZ0IGFzIGQzX2F4aXNMZWZ0IH0gZnJvbSAnZDMtYXhpcyc7XG5pbXBvcnQgeyB2YWx1ZXMgYXMgZDNfdmFsdWVzIH0gZnJvbSAnZDMtY29sbGVjdGlvbic7XG5pbXBvcnQgeyBpc29QYXJzZSBhcyBkM19pc29QYXJzZSB9IGZyb20gJ2QzLXRpbWUtZm9ybWF0JztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJHcm91cGVkIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotYmFyLWdyb3VwZWQnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6QmFyR3JvdXBlZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtYmFyLWdyb3VwZWQnKVxuICBncm91cGVkQmFyQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6QmFyR3JvdXBlZD47XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAzMDY7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNDAwO1xuXG4gIEBJbnB1dCgpXG4gIHZlcnRpY2FsID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBoaWRlWEF4aXMgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB4QXhpc01heEJ1ZmZlciA9IDAuMDE7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB4QXhpc1RpY2tzID0gNTtcblxuICBASW5wdXQoKVxuICBoaWRlWUF4aXMgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB5QXhpc01heEJ1ZmZlciA9IDAuMDE7XG5cbiAgQElucHV0KClcbiAgeUF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeUF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB5QXhpc1RpY2tzID0gNTtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAxMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5SaWdodCA9IHRoaXMudmVydGljYWwgPyAwIDogNTU7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMzA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDU1O1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDEwNSArIDI4OyAvLyBoYXJkY29kZWQgbGVnZW5kIHdpZHRoICsgbGVmdCBtYXJnaW4sIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFBvc2l0aW9uOiAncmlnaHQnIHwgJ2JvdHRvbScgPSAncmlnaHQnO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGlkZVRvb2x0aXAgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHNob3dHcmlkID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgdGhlbWU6ICdjbGFzc2ljJyB8ICdzdW5zZXQnIHwgJ29jZWFuJyB8ICd0d2lsaWdodCcgPSAnY2xhc3NpYyc7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBiYXJTY2FsZTtcbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgeEF4aXNNYXg7XG4gIHByaXZhdGUgeEF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XG4gIHByaXZhdGUgeEF4aXM7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xuICBwcml2YXRlIGhpZGVYQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIHhHcmlkO1xuICBwcml2YXRlIHhHcmlkQ2FsbDtcbiAgcHJpdmF0ZSB5QXhpc01heDtcbiAgcHJpdmF0ZSB5QXhpc1NjYWxlO1xuICBwcml2YXRlIHlBeGlzQ2FsbDtcbiAgcHJpdmF0ZSB5QXhpcztcbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdDtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgaGlkZVlBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgeUdyaWQ7XG4gIHByaXZhdGUgeUdyaWRDYWxsO1xuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xuICBwcml2YXRlIGhpZGVHcmF5QmFyczogYm9vbGVhbjtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZGF0YXZpejogUGJkc0RhdGF2aXpTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyLFxuICAgIHByaXZhdGUgX2xvY2F0aW9uOiBMb2NhdGlvblxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMueEF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueEF4aXNGb3JtYXRUeXBlLCB0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnlBeGlzRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0VHlwZSwgdGhpcy55QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUsIHRoaXMubGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXG4gICAgdGhpcy5oaWRlR3JheUJhcnMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc1plcm8gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuICAgIHRoaXMuaGlkZVlBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnlBeGlzVGlja1NpemVPdXRlciA9IDA7XG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCAmJiB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICB0aGlzLndpZHRoID0gK3RoaXMud2lkdGggLSArdGhpcy5sZWdlbmRXaWR0aDtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICAgICAgcmV0dXJuICt0aGlzLndpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiArdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICAgICAgcmV0dXJuIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGh9ICR7K3RoaXMuaGVpZ2h0ICtcbiAgICAgICAgICAgIHRoaXMubWFyZ2luLnRvcCArXG4gICAgICAgICAgICB0aGlzLm1hcmdpbi5ib3R0b219YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodH0gJHsrdGhpc1xuICAgICAgICAgICAgLmhlaWdodCArXG4gICAgICAgICAgICB0aGlzLm1hcmdpbi50b3AgK1xuICAgICAgICAgICAgdGhpcy5tYXJnaW4uYm90dG9tfWA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnZlcnRpY2FsID8gJ3BiZHMtdG9vbHRpcCBzb3V0aCcgOiAncGJkcy10b29sdGlwIHdlc3QnO1xuICAgICAgICB9KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcbiAgICB9XG5cbiAgICAvLyBhZGQgbGVnZW5kIGNsYXNzZXNcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcbiAgICB9XG5cbiAgICAvLyBidWlsZCBjb2xvciByYW5nZXNcbiAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKS5yYW5nZShcbiAgICAgIHRoaXMuX2RhdGF2aXouY3JlYXRlR3JhZGllbnREZWZzKHRoaXMuc3ZnLCBmYWxzZSwgdGhpcy50aGVtZSwgdGhpcy52ZXJ0aWNhbClcbiAgICApO1xuXG4gICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgIC8vIFggQVhJU1xuICAgICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgICAgLmRvbWFpbih0aGlzLmRhdGEubWFwKGQgPT4gZC5rZXkpKVxuICAgICAgICAucmFuZ2VSb3VuZChbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnRdKVxuICAgICAgICAuYWxpZ24oMCk7XG5cbiAgICAgIC8vIGFkZCBwYWRkaW5nIHRvIHRoZSBzY2FsZSBmb3IgZ3JheSBiYXJzXG4gICAgICAhdGhpcy5oaWRlR3JheUJhcnNcbiAgICAgICAgPyB0aGlzLnhBeGlzU2NhbGUucGFkZGluZ0lubmVyKDAuMSkucGFkZGluZ091dGVyKDApXG4gICAgICAgIDogdGhpcy54QXhpc1NjYWxlLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCk7XG5cbiAgICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrU2l6ZSh0aGlzLnhBeGlzVGlja1NpemUpXG4gICAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgICAudGlja0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0dGVyKTtcblxuICAgICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXgnKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpcylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc0RvbWFpbilcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXNUaWNrcylcbiAgICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgICAvLyBYIEdSSURMSU5FU1xuICAgICAgLy8gaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgLy8gICB0aGlzLnhHcmlkQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKS50aWNrU2l6ZSgtdGhpcy5oZWlnaHQpO1xuXG4gICAgICAvLyAgIHRoaXMueEdyaWQgPSB0aGlzLnN2Z1xuICAgICAgLy8gICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLy8gICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteCcpXG4gICAgICAvLyAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAvLyAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcbiAgICAgIC8vICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgICAvLyB9XG5cbiAgICAgIC8vIFkgQVhJU1xuICAgICAgdGhpcy55QXhpc01heCA9IGQzX21heCh0aGlzLmRhdGEsIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB7IC4uLmRhdGEgfTtcbiAgICAgICAgZGVsZXRlIGNsb25lLmtleTtcblxuICAgICAgICByZXR1cm4gZDNfbWF4KGQzX3ZhbHVlcyhjbG9uZSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMueUF4aXNNYXggPSB0aGlzLnlBeGlzTWF4ICsgdGhpcy55QXhpc01heCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG5cbiAgICAgIHRoaXMueUF4aXNTY2FsZSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgICAgLmRvbWFpbihbMCwgdGhpcy55QXhpc01heF0pXG4gICAgICAgIC5uaWNlKClcbiAgICAgICAgLnJhbmdlUm91bmQoW3RoaXMuaGVpZ2h0LCAwXSk7XG5cbiAgICAgIHRoaXMueUF4aXNDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUodGhpcy55QXhpc1RpY2tTaXplKVxuICAgICAgICAudGlja1NpemVPdXRlcih0aGlzLnlBeGlzVGlja1NpemVPdXRlcilcbiAgICAgICAgLnRpY2tGb3JtYXQodGhpcy55QXhpc0Zvcm1hdHRlcik7XG5cbiAgICAgIHRoaXMueUF4aXMgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy15JylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXMpXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNEb21haW4pXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzVGlja3MpXG4gICAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgICAgLy8gWSBHUklETElORVNcbiAgICAgIGlmICh0aGlzLnNob3dHcmlkKSB7XG4gICAgICAgIHRoaXMueUdyaWRDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAgICAgLnRpY2tTaXplKC10aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KTtcblxuICAgICAgICB0aGlzLnlHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXknKVxuICAgICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsIDApYClcbiAgICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbG9yIGJhciBzY2FsZVxuICAgICAgdGhpcy5iYXJTY2FsZSA9IGQzX3NjYWxlQmFuZCgpXG4gICAgICAgIC5kb21haW4oT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5zbGljZSgxKSlcbiAgICAgICAgLnJhbmdlUm91bmQoWzAsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKV0pXG4gICAgICAgIC5wYWRkaW5nSW5uZXIoMC4yKVxuICAgICAgICAucGFkZGluZ091dGVyKDAuNSk7XG5cbiAgICAgIHRoaXMudXBkYXRlQ2hhcnRWZXJ0aWNhbCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBYIEFYSVNcbiAgICAgIHRoaXMueEF4aXNNYXggPSBkM19tYXgodGhpcy5kYXRhLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGNsb25lID0geyAuLi5kYXRhIH07XG4gICAgICAgIGRlbGV0ZSBjbG9uZS5rZXk7XG4gICAgICAgIHJldHVybiBkM19tYXgoZDNfdmFsdWVzKGNsb25lKSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy54QXhpc01heCA9IHRoaXMueEF4aXNNYXggKyB0aGlzLnhBeGlzTWF4ICogdGhpcy54QXhpc01heEJ1ZmZlcjtcblxuICAgICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgICAuZG9tYWluKFswLCB0aGlzLnhBeGlzTWF4XSlcbiAgICAgICAgLnJhbmdlUm91bmQoWzAsIHRoaXMud2lkdGhdKVxuICAgICAgICAubmljZSgpO1xuXG4gICAgICB0aGlzLnhBeGlzQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKVxuICAgICAgICAudGlja3ModGhpcy54QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUodGhpcy54QXhpc1RpY2tTaXplKVxuICAgICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XG5cbiAgICAgIHRoaXMueEF4aXMgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy14JylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXMpXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNEb21haW4pXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzVGlja3MpXG4gICAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgICAgLy8gWSBBWElTXG4gICAgICB0aGlzLnlBeGlzU2NhbGUgPSBkM19zY2FsZUJhbmQoKVxuICAgICAgICAuZG9tYWluKHRoaXMuZGF0YS5tYXAoZCA9PiBkLmtleSkpXG4gICAgICAgIC5yYW5nZVJvdW5kKFswLCB0aGlzLmhlaWdodF0pXG4gICAgICAgIC5hbGlnbigxKTtcblxuICAgICAgLy8gYWRkIHBhZGRpbmcgdG8gdGhlIHNjYWxlIGZvciBncmF5IGJhcnNcbiAgICAgICF0aGlzLmhpZGVHcmF5QmFyc1xuICAgICAgICA/IHRoaXMueUF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMC4xKS5wYWRkaW5nT3V0ZXIoMClcbiAgICAgICAgOiB0aGlzLnlBeGlzU2NhbGUucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKTtcblxuICAgICAgdGhpcy55QXhpc0NhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrU2l6ZSh0aGlzLnlBeGlzVGlja1NpemUpXG4gICAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgICAudGlja0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0dGVyKTtcblxuICAgICAgdGhpcy55QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXknKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpcylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc0RvbWFpbilcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXNUaWNrcylcbiAgICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgICAvLyBYIEdSSURMSU5FU1xuICAgICAgaWYgKHRoaXMuc2hvd0dyaWQpIHtcbiAgICAgICAgdGhpcy54R3JpZENhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSkudGlja1NpemUoLXRoaXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcbiAgICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICAgIH1cblxuICAgICAgLy8gWSBHUklETElORVNcbiAgICAgIC8vIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcbiAgICAgIC8vICAgdGhpcy55R3JpZENhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAvLyAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgIC8vICAgICAudGlja1NpemUoLXRoaXMud2lkdGgpO1xuXG4gICAgICAvLyAgIHRoaXMueUdyaWQgPSB0aGlzLnN2Z1xuICAgICAgLy8gICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLy8gICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteScpXG4gICAgICAvLyAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAvLyAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgMClgKVxuICAgICAgLy8gICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gY29sb3IgYmFyIHNjYWxlXG4gICAgICB0aGlzLmJhclNjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgICAgLmRvbWFpbihPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLnNsaWNlKDEpKVxuICAgICAgICAucmFuZ2VSb3VuZChbdGhpcy55QXhpc1NjYWxlLmJhbmR3aWR0aCgpLCAwXSlcbiAgICAgICAgLnBhZGRpbmdJbm5lcigwLjIpXG4gICAgICAgIC5wYWRkaW5nT3V0ZXIoMC41KTtcblxuICAgICAgdGhpcy51cGRhdGVDaGFydEhvcml6b250YWwoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICBpZiAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNoYXJ0VmVydGljYWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ2hhcnRIb3Jpem9udGFsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2hhcnRWZXJ0aWNhbCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIHhTY2FsZVxuICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4odGhpcy5kYXRhLm1hcChkID0+IGQua2V5KSk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIHlTY2FsZVxuICAgIHRoaXMueUF4aXNNYXggPSBkM19tYXgodGhpcy5kYXRhLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICBjb25zdCBjbG9uZSA9IHsgLi4uZGF0YSB9O1xuICAgICAgZGVsZXRlIGNsb25lLmtleTtcblxuICAgICAgcmV0dXJuIGQzX21heChkM192YWx1ZXMoY2xvbmUpKTtcbiAgICB9KTtcblxuICAgIHRoaXMueUF4aXNNYXggPSB0aGlzLnlBeGlzTWF4ICsgdGhpcy55QXhpc01heCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG5cbiAgICB0aGlzLnlBeGlzU2NhbGVcbiAgICAgIC5kb21haW4oWzAsIHRoaXMueUF4aXNNYXhdKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMuaGVpZ2h0LCAwXSlcbiAgICAgIC5uaWNlKCk7XG5cbiAgICB0aGlzLnhBeGlzXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIHRoaXMueUF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSBncmlkc1xuICAgIC8vIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAvLyAgIHRoaXMueEdyaWRcbiAgICAvLyAgICAgLnRyYW5zaXRpb24oKVxuICAgIC8vICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAvLyAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIC8vIH1cblxuICAgIGlmICh0aGlzLnNob3dHcmlkKSB7XG4gICAgICB0aGlzLnlHcmlkXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdGhlIGNvbG9yIGJhciBzY2FsZVxuICAgIHRoaXMuYmFyU2NhbGUuZG9tYWluKE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuc2xpY2UoMSkpLnJhbmdlUm91bmQoWzAsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKV0pO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5ncmF5LWJhcicpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JheS1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXG4gICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KSxcbiAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC5rZXkpKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgICk7XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyLWdyb3VwJylcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3RoaXMueEF4aXNTY2FsZShkLmtleSl9LCAwKWA7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3RoaXMueEF4aXNTY2FsZShkLmtleSl9LCAwKWA7XG4gICAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoKGQsIGkpID0+IHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB7IC4uLmQgfTtcbiAgICAgICAgZGVsZXRlIGNsb25lLmtleTtcblxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoY2xvbmUpO1xuXG4gICAgICAgIGNvbnN0IGtleURhdGEgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICByZXR1cm4geyBsYWJlbDoga2V5LCB2YWx1ZTogZFtrZXldLCBwYXJlbnRJbmRleDogaSB9O1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5RGF0YTtcbiAgICAgIH0pXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucGF0aCgpfSNncmFkaWVudC0ke3RoaXMuY29sb3JSYW5nZShkLmxhYmVsKS5zdWJzdHIoMSl9KWApXG4gICAgICAgICAgICAuYXR0cignZGF0YS1jb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtcGFyZW50LWluZGV4JywgZCA9PiBkLnBhcmVudEluZGV4KVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMuYmFyU2NhbGUoZC5sYWJlbCkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLmJhclNjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgLmNhbGwoZW50ZXIgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZW50ZXJcbiAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigwKSAvLyA1MDBcbiAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiB0aGlzLmhlaWdodCAtIHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy5iYXJTY2FsZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMuYmFyU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiB0aGlzLmhlaWdodCAtIHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICBleGl0ID0+XG4gICAgICAgICAgZXhpdFxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDApIC8vIDEwMFxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAuYXR0cigneScsIHRoaXMuaGVpZ2h0KVxuICAgICAgKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlT3V0KCkpXG4gICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcblxuICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XG5cbiAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5heGlzJykucmFpc2UoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0SG9yaXpvbnRhbCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIHhTY2FsZVxuICAgIHRoaXMueEF4aXNNYXggPSBkM19tYXgodGhpcy5kYXRhLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICBjb25zdCBjbG9uZSA9IHsgLi4uZGF0YSB9O1xuICAgICAgZGVsZXRlIGNsb25lLmtleTtcbiAgICAgIHJldHVybiBkM19tYXgoZDNfdmFsdWVzKGNsb25lKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnhBeGlzTWF4ID0gdGhpcy54QXhpc01heCArIHRoaXMueEF4aXNNYXggKiB0aGlzLnhBeGlzTWF4QnVmZmVyO1xuXG4gICAgdGhpcy54QXhpc1NjYWxlXG4gICAgICAuZG9tYWluKFswLCB0aGlzLnhBeGlzTWF4XSlcbiAgICAgIC5yYW5nZVJvdW5kKFswLCB0aGlzLndpZHRoXSlcbiAgICAgIC5uaWNlKCk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIHlTY2FsZVxuICAgIHRoaXMueUF4aXNTY2FsZS5kb21haW4odGhpcy5kYXRhLm1hcChkID0+IGQua2V5KSk7XG5cbiAgICB0aGlzLnhBeGlzXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIHRoaXMueUF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSBncmlkc1xuICAgIGlmICh0aGlzLnNob3dHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XG4gICAgLy8gICB0aGlzLnlHcmlkXG4gICAgLy8gICAgIC50cmFuc2l0aW9uKClcbiAgICAvLyAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgLy8gICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICAvLyB9XG5cbiAgICAvLyB1cGRhdGUgdGhlIGNvbG9yIGJhciBzY2FsZVxuICAgIHRoaXMuYmFyU2NhbGUuZG9tYWluKE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuc2xpY2UoMSkpLnJhbmdlUm91bmQoWzAsIHRoaXMueUF4aXNTY2FsZS5iYW5kd2lkdGgoKV0pO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5ncmF5LWJhcicpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JheS1iYXInKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkLmtleSkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLndpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMueUF4aXNTY2FsZS5iYW5kd2lkdGgoKSksXG4gICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQua2V5KSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy55QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICBlbnRlciA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXItZ3JvdXAnKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKDAsICR7dGhpcy55QXhpc1NjYWxlKGQua2V5KX0pYDtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKDAsICR7dGhpcy55QXhpc1NjYWxlKGQua2V5KX0pYDtcbiAgICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YSgoZCwgaSkgPT4ge1xuICAgICAgICBjb25zdCBjbG9uZSA9IHsgLi4uZCB9O1xuICAgICAgICBkZWxldGUgY2xvbmUua2V5O1xuXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhjbG9uZSk7XG5cbiAgICAgICAgY29uc3Qga2V5RGF0YSA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHJldHVybiB7IGxhYmVsOiBrZXksIHZhbHVlOiBkW2tleV0sIHBhcmVudEluZGV4OiBpIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBrZXlEYXRhO1xuICAgICAgfSlcbiAgICAgIC5qb2luKFxuICAgICAgICBlbnRlciA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXInKVxuICAgICAgICAgICAgLmF0dHIoXG4gICAgICAgICAgICAgICdmaWxsJyxcbiAgICAgICAgICAgICAgZCA9PiBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucGF0aCgpfSNncmFkaWVudC1ob3Jpem9udGFsLSR7dGhpcy5jb2xvclJhbmdlKGQubGFiZWwpLnN1YnN0cigxKX0pYFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtY29sb3InLCBkID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC5hdHRyKCdkYXRhLXBhcmVudC1pbmRleCcsIGQgPT4gZC5wYXJlbnRJbmRleClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMClcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy5iYXJTY2FsZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmJhclNjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmNhbGwoZW50ZXIgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZW50ZXJcbiAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigwKSAvLyA1MDBcbiAgICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5iYXJTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLmJhclNjYWxlKGQubGFiZWwpKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKSxcbiAgICAgICAgZXhpdCA9PlxuICAgICAgICAgIGV4aXRcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigwKSAvLyAxMDBcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICApXG4gICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgLm9uKCdtb3VzZW91dCcsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VPdXQoKSlcbiAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuXG4gICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcblxuICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmF4aXMnKS5yYWlzZSgpO1xuICB9XG5cbiAgdXBkYXRlTGVnZW5kKCkge1xuICAgIC8vIGxlZ2VuZFxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICBjb25zdCBsZWdlbmREYXRhID0geyAuLi50aGlzLmRhdGFbMF0gfTtcbiAgICAgIGRlbGV0ZSBsZWdlbmREYXRhLmtleTtcbiAgICAgIGNvbnN0IGxlZ2VuZEtleXMgPSBPYmplY3Qua2V5cyhsZWdlbmREYXRhKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB7IGxhYmVsOiBrZXkgfTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNoYXJ0XG4gICAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgICAuZGF0YShsZWdlbmRLZXlzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaSA9IGVudGVyLmFwcGVuZCgnbGknKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtaXRlbScpO1xuXG4gICAgICAgICAgICBsaS5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWtleScpXG4gICAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKTtcblxuICAgICAgICAgICAgbGkuaW5zZXJ0KCdzcGFuJywgJy5sZWdlbmQtaXRlbScpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKVxuICAgICAgICAgICAgICAuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmxhYmVsKTtcblxuICAgICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHVwZGF0ZSA9PiB7XG4gICAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmxhYmVsKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHRoaXMubGVnZW5kTW91c2VPdXQoKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubGVnZW5kTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG4gICAgfVxuICB9XG5cbiAgYmFyTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICBjb25zdCBub2RlID0gZDNfc2VsZWN0KG5vZGVzW2luZGV4XSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBub2RlLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpLnN0eWxlKCdmaWxsJywgbm9kZS5hdHRyKCdkYXRhLWNvbG9yJykpO1xuXG4gICAgdGhpcy50b29sdGlwU2hvdyhkYXRhLCBub2Rlc1tpbmRleF0pO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBiYXJNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKVxuICAgICAgLnN0eWxlKCdmaWxsJywgbnVsbCk7XG5cbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgYmFyTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBjb25zdCBiYXIgPSB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCBudWxsKTtcblxuICAgIGNvbnN0IGJhckNvbG9yID0gYmFyLmF0dHIoJ2RhdGEtY29sb3InKTtcblxuICAgIGJhci5zdHlsZSgnZmlsbCcsICgpID0+IGJhckNvbG9yKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKVxuICAgICAgLnN0eWxlKCdmaWxsJywgbnVsbCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKGRhdGEsIG5vZGUpID0+IHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBsZXQgbGFiZWw7XG5cbiAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgbGFiZWwgPSB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChkYXRhLmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZGF0YS5sYWJlbCk7XG4gICAgICAgIGxhYmVsID0gdGhpcy50b29sdGlwTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsYWJlbCA9IGRhdGEubGFiZWw7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPVxuICAgICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPT09IG51bGxcbiAgICAgICAgPyBgPGRpdiBjbGFzcz1cInRvb2x0aXAtdmFsdWVcIj4ke2RhdGEudmFsdWV9PC9kaXY+YFxuICAgICAgICA6IGA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZVwiPiR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS52YWx1ZSl9PC9kaXY+YDtcblxuICAgIHRoaXMudG9vbHRpcC5odG1sKFxuICAgICAgYFxuICAgICAgICAke2xhYmVsfVxuICAgICAgICAke3ZhbHVlfVxuICAgICAgYFxuICAgICk7XG5cbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0V2lkdGggPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCB0b29sdGlwVGlwU2l6ZSA9IDg7XG5cbiAgICBpZiAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHsrc2Nyb2xsWzFdICsgK2RpbWVuc2lvbnMudG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodCAtIHRvb2x0aXBUaXBTaXplfXB4YCk7XG4gICAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBgJHsrc2Nyb2xsWzBdICsgK2RpbWVuc2lvbnMubGVmdCAtIHRvb2x0aXBPZmZzZXRXaWR0aCArICtkaW1lbnNpb25zLndpZHRoIC8gMn1weGApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAkeytzY3JvbGxbMV0gKyArZGltZW5zaW9ucy50b3AgKyArZGltZW5zaW9ucy5oZWlnaHQgLyAyIC0gdG9vbHRpcE9mZnNldEhlaWdodCAvIDJ9cHhgKTtcbiAgICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAkeytzY3JvbGxbMF0gKyArZGltZW5zaW9ucy5yaWdodCArIHRvb2x0aXBUaXBTaXplfXB4YCk7XG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICBwcml2YXRlIHhBeGlzRm9ybWF0dGVyID0gaXRlbSA9PiB7XG4gICAgc3dpdGNoICh0aGlzLnhBeGlzRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQoaXRlbSk7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQocGFyc2VEYXRlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgeUF4aXNGb3JtYXR0ZXIgPSBpdGVtID0+IHtcbiAgICBzd2l0Y2ggKHRoaXMueUF4aXNGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXR1cm4gdGhpcy55QXhpc0Zvcm1hdChpdGVtKTtcblxuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgICAgICByZXR1cm4gdGhpcy55QXhpc0Zvcm1hdChwYXJzZURhdGUpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH07XG59XG4iXX0=
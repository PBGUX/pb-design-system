/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, ElementRef, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { select as d3_select, scaleLinear as d3_scaleLinear, scaleOrdinal as d3_scaleOrdinal, format as d3_format, event as d3_event, timeFormat as d3_timeFormat, isoParse as d3_isoParse, sum as d3_sum, axisBottom as d3_axisBottom, easeLinear as d3_easeLinear } from 'd3';
import { PbdsDatavizService } from './dataviz.service';
var PbdsDatavizBarSingleHorizontalComponent = /** @class */ (function () {
    function PbdsDatavizBarSingleHorizontalComponent(_dataviz, _element, _scroll, _location) {
        var _this = this;
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this._location = _location;
        this.chartClass = true;
        this.singleStackedBarClass = true;
        this.width = 300;
        this.height = 40;
        this.nullValueText = 'No data available';
        this.percentage = false;
        this.marginTop = 10;
        this.marginRight = 20;
        this.marginBottom = 35;
        this.marginLeft = 15;
        this.barMargin = 2;
        this.hideXAxis = false;
        this.xAxisTicks = 6;
        this.xAxisTitle = null;
        this.xAxisFormatType = null;
        this.xAxisFormatString = '';
        this.xAxisTickLabelSuffix = '';
        this.hideXGrid = false;
        this.hideLegend = false;
        this.hideLegendTooltip = true;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'bottom';
        this.legendLabelFormatType = null;
        this.legendLabelFormatString = '';
        this.hideTooltip = false;
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipDateFormatString = '%b %e, %Y';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.tooltipValueSuffix = '';
        this.tooltipPercentFormatString = '.2%';
        this.compareChangeFormatString = '.2%';
        this.monochrome = false;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.isSingleData = false;
        this.isCompare = false;
        this.barPadding = 40;
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
            _this.chart.selectAll('.bar').classed('inactive', true);
            node.classed('inactive', false);
            _this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                // debugger;
                return i !== index;
            }))
                .classed('inactive', true);
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
            var percentage = data.value / d3_sum(_this.data, (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.value; }));
            /** @type {?} */
            var comparePercentage = data.compareValue / d3_sum(_this.data, (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.compareValue; }));
            /** @type {?} */
            var tooltipLabel = "";
            /** @type {?} */
            var tooltipCompareDaterangeMargin = "";
            /** @type {?} */
            var tooltipCompareDaterange = "";
            /** @type {?} */
            var tooltipCompareValue = "";
            /** @type {?} */
            var tooltipDaterangeMargin = "";
            /** @type {?} */
            var tooltipDaterange = "";
            /** @type {?} */
            var tooltipValue = "" + _this.nullValueText;
            /** @type {?} */
            var tooltipIndicator = '';
            // tooltip label
            if (!_this.isSingleData) {
                _this.tooltip.classed('pbds-tooltip-compare', null);
                switch (_this.tooltipLabelFormatType) {
                    case 'number':
                        tooltipLabel = _this.tooltipLabelFormat(data.label);
                        break;
                    case 'time':
                        /** @type {?} */
                        var parsedTime = d3_isoParse(data.label);
                        tooltipLabel = _this.tooltipLabelFormat(parsedTime);
                        break;
                    default:
                        tooltipLabel = data.label;
                }
            }
            // tooltip compare daterange
            if (_this.isCompare && data.compareStartDate && data.compareEndDate) {
                _this.tooltip.classed('pbds-tooltip-compare', _this.isCompare);
                tooltipCompareDaterangeMargin = "mt-2";
                tooltipCompareDaterange = _this.tooltipDateFormat(d3_isoParse(data.compareStartDate)) + " - " + _this.tooltipDateFormat(d3_isoParse(data.compareEndDate));
            }
            // tooltip compare value
            if (_this.percentage && _this.isCompare && data.compareValue) {
                tooltipCompareValue =
                    _this.tooltipValueFormat === null
                        ? _this.tooltipPercentFormat(comparePercentage) + " (" + data.comparveValue + _this.tooltipValueSuffix + ")"
                        : _this.tooltipPercentFormat(comparePercentage) + " (" + _this.tooltipValueFormat(data.compareValue) + _this.tooltipValueSuffix + ")";
            }
            else if (_this.isCompare && data.compareValue !== null) {
                tooltipCompareValue =
                    _this.tooltipValueFormat === null
                        ? "" + data.compareValue + _this.tooltipValueSuffix + " (" + _this.tooltipPercentFormat(comparePercentage) + ")"
                        : "" + _this.tooltipValueFormat(data.compareValue) + _this.tooltipValueSuffix + " (" + _this.tooltipPercentFormat(comparePercentage) + ")";
            }
            else if (_this.isCompare && data.compareValue === null) {
                tooltipCompareValue = "" + _this.nullValueText;
            }
            // tooltip daterange
            if (data.startDate && data.endDate) {
                tooltipDaterange = _this.tooltipDateFormat(d3_isoParse(data.startDate)) + " - " + _this.tooltipDateFormat(d3_isoParse(data.endDate));
            }
            //tooltip daterange margin
            if (tooltipLabel !== '') {
                tooltipDaterangeMargin = "mt-2";
            }
            // tooltip value
            if (_this.isSingleData && _this.percentage && data.value) {
                tooltipValue = _this.tooltipValueFormat === null ? "" + data.value : "" + _this.tooltipValueFormat(data.value);
            }
            else if (_this.isSingleData && data.value !== null) {
                tooltipValue =
                    _this.tooltipValueFormat === null
                        ? "" + data.value + _this.tooltipValueSuffix
                        : "" + _this.tooltipValueFormat(data.value) + _this.tooltipValueSuffix;
            }
            else if (!_this.isSingleData && _this.percentage && data.value !== null) {
                tooltipValue =
                    _this.tooltipValueFormat === null
                        ? _this.tooltipPercentFormat(percentage) + " (" + data.value + _this.tooltipValueSuffix + ")"
                        : _this.tooltipPercentFormat(percentage) + " (" + _this.tooltipValueFormat(data.value) + _this.tooltipValueSuffix + ")";
            }
            else if (!_this.isSingleData && data.value !== null) {
                tooltipValue =
                    _this.tooltipValueFormat === null
                        ? "" + data.value + _this.tooltipValueSuffix + " (" + _this.tooltipPercentFormat(percentage) + ")"
                        : "" + _this.tooltipValueFormat(data.value) + _this.tooltipValueSuffix + " (" + _this.tooltipPercentFormat(percentage) + ")";
            }
            // tooltip metric indicator
            if (!_this.isSingleData && _this.isCompare && data.value !== null && data.compareValue !== null) {
                tooltipIndicator = "<div class=\"metric-block-indicator " + data.compareChangeDirection + " " + (data.compareChangeInverse ? 'inverse' : '') + " ml-2\"><span>" + _this.tooltipCompareChangeFormat(data.compareChangeValue) + "</span></div>";
            }
            _this.tooltip.html((/**
             * @return {?}
             */
            function () {
                return "\n        <div class=\"tooltip-label font-weight-bold\">" + tooltipLabel + "</div>\n        <div class=\"" + tooltipCompareDaterangeMargin + "\">" + tooltipCompareDaterange + "</div>\n        <div class=\"tooltip-value font-weight-bold\">" + tooltipCompareValue + "</div>\n        <div class=\"" + tooltipDaterangeMargin + "\">" + tooltipDaterange + "</div>\n        <div class=\"tooltip-value\"><span class=\"font-weight-bold\">" + tooltipValue + "</span> <span>" + tooltipIndicator + "</span></div>\n      ";
            }));
            /** @type {?} */
            var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight;
            /** @type {?} */
            var tooltipTipSize = 8;
            _this.tooltip.style('top', +scroll[1] + +dimensions.top - tooltipOffsetHeight - tooltipTipSize + "px");
            if (_this.data.length > 1) {
                _this.tooltip.style('left', +scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2 + "px");
            }
            else {
                _this.tooltip.style('left', +scroll[0] - tooltipOffsetWidth + +dimensions.right + "px");
            }
            _this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        function () {
            _this.tooltip.style('opacity', 0);
        });
        this.legendMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            if (!_this.hideLegendTooltip) {
                /** @type {?} */
                var barHover = _this.svg
                    .selectAll('.bar')
                    .filter((/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                function (d, i) { return i === index; }))
                    .node();
                _this.tooltipShow(data, barHover);
            }
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
            _this.chart
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i === index; }))
                .classed('inactive', null);
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
            // hide tooltip for zero/null values
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
        this.xAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            switch (_this.xAxisFormatType) {
                case 'number':
                    return "" + _this.xAxisFormat(item) + _this.xAxisTickLabelSuffix;
                default:
                    return "" + item + _this.xAxisTickLabelSuffix;
            }
        });
    }
    /**
     * @return {?}
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.height = +this.height + this.barPadding;
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        this.isSingleData = this.data.length === 1 ? true : false;
        this.isCompare = Object.keys(this.data[0]).includes('compareValue');
        // create formatters
        this.xAxisFormat = this._dataviz.d3Format(this.xAxisFormatType, this.xAxisFormatString);
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        this.tooltipDateFormat = d3_timeFormat(this.tooltipDateFormatString);
        this.tooltipPercentFormat = d3_format(this.tooltipPercentFormatString);
        this.tooltipCompareChangeFormat = d3_format(this.compareChangeFormatString);
        // defaults for all chart types
        this.hideXAxisZero = false;
        this.hideXAxisDomain = true;
        this.hideXAxisTicks = true;
        this.xAxisTickSize = 8;
        this.xAxisTickSizeOuter = 0;
        this.xAxisTitleMargin = this.xAxisTitle ? 20 : 0;
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
            return +_this.width + _this.margin.left + _this.margin.right;
        }))
            .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', (/**
         * @return {?}
         */
        function () {
            return "-" + _this.margin.left + " -" + _this.margin.top + " " + (+_this.width + _this.margin.left + _this.margin.right) + " " + (+_this
                .height +
                _this.margin.top +
                _this.margin.bottom +
                _this.xAxisTitleMargin);
        }));
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', 'pbds-tooltip south')
                .classed('pbds-tooltip-compare', this.isCompare)
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
        }
        // add legend classes
        if (!this.hideLegend && this.data.length > 1) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
        }
        // X AXIS
        this.xAxisScale = d3_scaleLinear()
            .domain([0, Math.ceil(d3_sum(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.value; })))])
            .range([0, +this.width]);
        this.xAxisCall = d3_axisBottom(this.xAxisScale)
            // .tickValues([0, d3_sum(this.data, (d: any) => d.value)])
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
            .classed('axis-ticks-hidden', this.hideXAxisTicks);
        // .call(this.xAxisCall);
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
        if (this.xAxisTitle) {
            this.svg
                .append('text')
                .attr('class', 'axis-title')
                .attr('text-anchor', 'center')
                .attr('x', this.width / 2 - this.margin.left)
                .attr('y', this.height + this.margin.top + (!this.hideXAxis ? 40 : 0))
                .text(this.xAxisTitle);
        }
        // build color ranges
        /** @type {?} */
        var colors;
        if (this.isSingleData) {
            colors = this._dataviz.createGradientDefs(this.svg, this.monochrome, this.theme, false);
        }
        else if (this.monochrome) {
            colors = this._dataviz.getColors(this.monochrome, this.theme).reverse();
        }
        else {
            colors = this._dataviz.getColors(this.monochrome, this.theme);
        }
        this.colorRange = d3_scaleOrdinal().range(colors);
        this.updateChart();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.ngOnChanges = /**
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
    PbdsDatavizBarSingleHorizontalComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.tooltip)
            this.tooltip.remove();
    };
    /**
     * @return {?}
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.updateChart = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.isSingleData = this.data.length === 1 ? true : false;
        this.isCompare = Object.keys(this.data[0]).includes('compareValue');
        /** @type {?} */
        var sumValues = d3_sum(this.data, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.value; }));
        /** @type {?} */
        var isLastBarZero = this.data[this.data.length - 1].value === 0 || this.data[this.data.length - 1].value === null ? true : false;
        /** @type {?} */
        var lastBarZeroCount = 0;
        /** @type {?} */
        var cloneData = tslib_1.__spread(this.data);
        /** @type {?} */
        var isLast = false;
        cloneData.reverse().forEach((/**
         * @param {?} value
         * @param {?} index
         * @param {?} array
         * @return {?}
         */
        function (value, index, array) {
            if ((value.value === 0 || value.value === null) && !isLast) {
                lastBarZeroCount++;
            }
            else {
                isLast = true;
            }
        }));
        if (this.percentage && !this.isSingleData) {
            this.xAxisScale.domain([0, sumValues]).range([0, +this.width]);
            this.xAxisCall.tickValues([0, sumValues * 0.25, sumValues * 0.5, sumValues * 0.75, sumValues]);
            this.xAxis.call(this.xAxisCall);
            this.xGridCall.tickValues([0, sumValues * 0.25, sumValues * 0.5, sumValues * 0.75, sumValues]);
            this.xGrid.call(this.xGridCall);
            this.svg
                .select('.axis-x')
                .selectAll('text')
                .html((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                /** @type {?} */
                var format = d3_format('.0%');
                return format(i * 0.25);
            }));
        }
        else if (this.percentage && this.isSingleData) {
            this.xAxisScale.domain([0, 1.0]).range([0, +this.width]);
            this.xAxisCall.tickValues([0, 0.25, 0.5, 0.75, 1.0]);
            this.xAxis.call(this.xAxisCall);
            this.xGridCall.tickValues([0, 0.25, 0.5, 0.75, 1.0]);
            this.xGrid.call(this.xGridCall);
            this.svg
                .select('.axis-x')
                .selectAll('text')
                .html((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                /** @type {?} */
                var format = d3_format('.0%');
                return format(i * 0.25);
            }));
        }
        else {
            this.xAxisScale.domain([0, Math.ceil(sumValues)]).range([0, +this.width]);
            this.xGridCall.tickValues(this.xAxisScale.ticks().filter((/**
             * @param {?} n
             * @return {?}
             */
            function (n) { return Number.isInteger(n); }))); // remove decimal grid values
            this.xAxis
                .transition()
                .duration(1000)
                .call(this.xAxisCall);
            // update the grids
            if (!this.hideXGrid) {
                this.xGrid
                    .transition()
                    .duration(1000)
                    .call(this.xGridCall);
            }
        }
        this.svg
            .selectAll('.bar')
            .data(this.data)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        function (enter) {
            return enter
                .append('rect')
                .attr('class', 'bar')
                .attr('width', 0)
                .attr('height', (/**
             * @return {?}
             */
            function () {
                return _this.height - _this.barPadding;
            }))
                .attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                if (_this.isSingleData) {
                    return "url(" + _this._location.path() + "#gradient-horizontal-" + _this.colorRange(d.label).substr(1) + ")";
                }
                else {
                    return _this.colorRange(d.label);
                }
            }))
                .attr('y', (/**
             * @return {?}
             */
            function () {
                return _this.barPadding / 2;
            }))
                .attr('x', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                return _this.data.slice(0, i).reduce((/**
                 * @param {?} acc
                 * @param {?} item
                 * @return {?}
                 */
                function (acc, item) {
                    // console.log(acc, item, acc + this.xAxisScale(item.value) + this.barMargin);
                    return +acc + +_this.xAxisScale(item.value);
                }), 1);
            }))
                .attr('pointer-events', 'none')
                .call((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                return (enter
                    .transition()
                    // .duration(0)
                    .delay((/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                function (d, i) { return i * 250; }))
                    .ease(d3_easeLinear)
                    .attr('width', (/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                function (d, i) {
                    // debugger;
                    if (i === _this.data.length - lastBarZeroCount - 1 && isLastBarZero) {
                        return _this.xAxisScale(d.value);
                    }
                    else if (i !== _this.data.length - 1) {
                        /** @type {?} */
                        var width = _this.xAxisScale(d.value) - +_this.barMargin;
                        width = Math.sign(width) === -1 ? 0 : width; // handle negative values
                        return width;
                    }
                    else {
                        return _this.xAxisScale(d.value);
                    }
                }))
                    .transition()
                    .attr('pointer-events', 'auto'));
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
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                // debugger;
                if (d.value === null || d.value === 0) {
                    return _this.xAxisScale(0);
                }
                else if (i === _this.data.length - 1) {
                    return _this.xAxisScale(d.value);
                }
                else {
                    return _this.xAxisScale(d.value) - _this.barMargin;
                }
            }))
                .attr('x', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                return _this.data.slice(0, i).reduce((/**
                 * @param {?} acc
                 * @param {?} item
                 * @return {?}
                 */
                function (acc, item) {
                    return acc + +_this.xAxisScale(item.value);
                }), 0);
            }))
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
        if (!this.hideLegend) {
            this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                /** @type {?} */
                var li = enter
                    .append('li')
                    .attr('class', 'legend-item')
                    .classed('align-items-start', _this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.colorRange(d.label); }))
                    .classed('mt-1', _this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-description')
                    .classed('d-flex', _this.isCompare)
                    .classed('flex-column', _this.isCompare);
                li.select('.legend-description')
                    .insert('span')
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
                li.select('.legend-description')
                    .insert('div')
                    .attr('class', 'legend-change')
                    .classed('d-none', !_this.isCompare);
                li.select('.legend-change').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) {
                    return "<div class=\"metric-block-indicator " + d.compareChangeDirection + " " + (d.compareChangeInverse ? 'inverse' : '') + " mt-1\"><span>" + _this.tooltipCompareChangeFormat(d.compareChangeValue) + "</span></div>";
                }));
                return li;
            }), (/**
             * @param {?} update
             * @return {?}
             */
            function (update) {
                update.classed('align-items-start', _this.isCompare);
                update.select('.legend-key').classed('mt-1', _this.isCompare);
                update.select('.legend-change').classed('d-none', !_this.isCompare);
                if (_this.isCompare) {
                    update.select('.legend-change').html((/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) {
                        return "<div class=\"metric-block-indicator " + d.compareChangeDirection + " " + (d.compareChangeInverse ? 'inverse' : '') + " mt-1\"><span>" + _this.tooltipCompareChangeFormat(d.compareChangeValue) + "</span></div>";
                    }));
                }
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
    PbdsDatavizBarSingleHorizontalComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-bar-single-horizontal',
                    template: "",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizBarSingleHorizontalComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: ElementRef },
        { type: ViewportScroller },
        { type: Location }
    ]; };
    PbdsDatavizBarSingleHorizontalComponent.propDecorators = {
        chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
        singleStackedBarClass: [{ type: HostBinding, args: ['class.pbds-chart-bar-single-horizontal',] }],
        data: [{ type: Input }],
        width: [{ type: Input }],
        height: [{ type: Input }],
        nullValueText: [{ type: Input }],
        percentage: [{ type: Input }],
        marginTop: [{ type: Input }],
        marginRight: [{ type: Input }],
        marginBottom: [{ type: Input }],
        marginLeft: [{ type: Input }],
        barMargin: [{ type: Input }],
        hideXAxis: [{ type: Input }],
        xAxisTicks: [{ type: Input }],
        xAxisTitle: [{ type: Input }],
        xAxisFormatType: [{ type: Input }],
        xAxisFormatString: [{ type: Input }],
        xAxisTickLabelSuffix: [{ type: Input }],
        hideXGrid: [{ type: Input }],
        hideLegend: [{ type: Input }],
        hideLegendTooltip: [{ type: Input }],
        legendWidth: [{ type: Input }],
        legendPosition: [{ type: Input }],
        legendLabelFormatType: [{ type: Input }],
        legendLabelFormatString: [{ type: Input }],
        hideTooltip: [{ type: Input }],
        tooltipLabelFormatType: [{ type: Input }],
        tooltipLabelFormatString: [{ type: Input }],
        tooltipDateFormatString: [{ type: Input }],
        tooltipValueFormatType: [{ type: Input }],
        tooltipValueFormatString: [{ type: Input }],
        tooltipValueSuffix: [{ type: Input }],
        tooltipPercentFormatString: [{ type: Input }],
        compareChangeFormatString: [{ type: Input }],
        monochrome: [{ type: Input }],
        theme: [{ type: Input }],
        hovered: [{ type: Output }],
        clicked: [{ type: Output }]
    };
    return PbdsDatavizBarSingleHorizontalComponent;
}());
export { PbdsDatavizBarSingleHorizontalComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.singleStackedBarClass;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.nullValueText;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.percentage;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barMargin;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXAxis;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTicks;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTitle;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTickLabelSuffix;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXGrid;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideLegendTooltip;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideTooltip;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipDateFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipValueSuffix;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipPercentFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.compareChangeFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.monochrome;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.isSingleData;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.isCompare;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barPadding;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTitleMargin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipDateFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipPercentFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipCompareChangeFormat;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barMouseOver;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barMouseOut;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipHide;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype._scroll;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype._location;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc2luZ2xlLWhvcml6b250YWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotYmFyLXNpbmdsZS1ob3Jpem9udGFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBR1gsTUFBTSxFQUNOLFlBQVksRUFDWix1QkFBdUIsRUFFeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTdELE9BQU8sRUFDTCxNQUFNLElBQUksU0FBUyxFQUNuQixXQUFXLElBQUksY0FBYyxFQUM3QixZQUFZLElBQUksZUFBZSxFQUMvQixNQUFNLElBQUksU0FBUyxFQUNuQixLQUFLLElBQUksUUFBUSxFQUNqQixVQUFVLElBQUksYUFBYSxFQUMzQixRQUFRLElBQUksV0FBVyxFQUN2QixHQUFHLElBQUksTUFBTSxFQUNiLFVBQVUsSUFBSSxhQUFhLEVBQzNCLFVBQVUsSUFBSSxhQUFhLEVBQzVCLE1BQU0sSUFBSSxDQUFDO0FBRVosT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHdkQ7SUFvSkUsaURBQ1UsUUFBNEIsRUFDNUIsUUFBb0IsRUFDcEIsT0FBeUIsRUFDekIsU0FBbUI7UUFKN0IsaUJBS0k7UUFKTSxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQ3pCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFoSjdCLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsMEJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBTTdCLFVBQUssR0FBRyxHQUFHLENBQUM7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dCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyLCBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7XG4gIHNlbGVjdCBhcyBkM19zZWxlY3QsXG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsLFxuICBmb3JtYXQgYXMgZDNfZm9ybWF0LFxuICBldmVudCBhcyBkM19ldmVudCxcbiAgdGltZUZvcm1hdCBhcyBkM190aW1lRm9ybWF0LFxuICBpc29QYXJzZSBhcyBkM19pc29QYXJzZSxcbiAgc3VtIGFzIGQzX3N1bSxcbiAgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLFxuICBlYXNlTGluZWFyIGFzIGQzX2Vhc2VMaW5lYXJcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhclNpbmdsZUhvcml6b250YWwsIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBhcmUgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1iYXItc2luZ2xlLWhvcml6b250YWwnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtYmFyLXNpbmdsZS1ob3Jpem9udGFsJylcbiAgc2luZ2xlU3RhY2tlZEJhckNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpekJhclNpbmdsZUhvcml6b250YWwgfCBQYmRzRGF0YXZpekJhclNpbmdsZUhvcml6b250YWxDb21wYXJlPjtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwMDtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDtcblxuICBASW5wdXQoKVxuICBudWxsVmFsdWVUZXh0ID0gJ05vIGRhdGEgYXZhaWxhYmxlJztcblxuICBASW5wdXQoKVxuICBwZXJjZW50YWdlID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luVG9wID0gMTA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAyMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAzNTtcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gMTU7XG5cbiAgQElucHV0KClcbiAgYmFyTWFyZ2luID0gMjtcblxuICBASW5wdXQoKVxuICBoaWRlWEF4aXMgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB4QXhpc1RpY2tzID0gNjtcblxuICBASW5wdXQoKVxuICB4QXhpc1RpdGxlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGlja0xhYmVsU3VmZml4ID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGlkZVhHcmlkID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmRUb29sdGlwID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDEwNSArIDI4OyAvLyBoYXJkY29kZWQgbGVnZW5kIHdpZHRoICsgbGVmdCBtYXJnaW4sIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFBvc2l0aW9uOiAncmlnaHQnIHwgJ2JvdHRvbScgPSAnYm90dG9tJztcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBEYXRlRm9ybWF0U3RyaW5nID0gJyViICVlLCAlWSc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZVN1ZmZpeCA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBQZXJjZW50Rm9ybWF0U3RyaW5nID0gJy4yJSc7XG5cbiAgQElucHV0KClcbiAgY29tcGFyZUNoYW5nZUZvcm1hdFN0cmluZyA9ICcuMiUnO1xuXG4gIEBJbnB1dCgpXG4gIG1vbm9jaHJvbWUgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0aGVtZTogJ2NsYXNzaWMnIHwgJ29jZWFuJyB8ICdzdW5zZXQnIHwgJ3R3aWxpZ2h0JztcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGlzU2luZ2xlRGF0YSA9IGZhbHNlO1xuICBwcml2YXRlIGlzQ29tcGFyZSA9IGZhbHNlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBiYXJQYWRkaW5nID0gNDA7XG4gIHByaXZhdGUgeEF4aXNDYWxsO1xuICBwcml2YXRlIHhBeGlzO1xuICBwcml2YXRlIHhBeGlzU2NhbGU7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xuICBwcml2YXRlIHhBeGlzVGl0bGVNYXJnaW46IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSB4R3JpZDtcbiAgcHJpdmF0ZSB4R3JpZENhbGw7XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBEYXRlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBQZXJjZW50Rm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcixcbiAgICBwcml2YXRlIF9sb2NhdGlvbjogTG9jYXRpb25cbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gK3RoaXMuaGVpZ2h0ICsgdGhpcy5iYXJQYWRkaW5nO1xuXG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICB0aGlzLmlzU2luZ2xlRGF0YSA9IHRoaXMuZGF0YS5sZW5ndGggPT09IDEgPyB0cnVlIDogZmFsc2U7XG4gICAgdGhpcy5pc0NvbXBhcmUgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLmluY2x1ZGVzKCdjb21wYXJlVmFsdWUnKTtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFR5cGUsIHRoaXMueEF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwRGF0ZUZvcm1hdCA9IGQzX3RpbWVGb3JtYXQodGhpcy50b29sdGlwRGF0ZUZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwUGVyY2VudEZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMuY29tcGFyZUNoYW5nZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXG4gICAgdGhpcy5oaWRlWEF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSB0cnVlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuICAgIHRoaXMueEF4aXNUaXRsZU1hcmdpbiA9IHRoaXMueEF4aXNUaXRsZSA/IDIwIDogMDtcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICgpID0+IHtcbiAgICAgICAgcmV0dXJuICt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgICAgfSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20gKyB0aGlzLnhBeGlzVGl0bGVNYXJnaW4pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0fSAkeyt0aGlzXG4gICAgICAgICAgLmhlaWdodCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4udG9wICtcbiAgICAgICAgICB0aGlzLm1hcmdpbi5ib3R0b20gK1xuICAgICAgICAgIHRoaXMueEF4aXNUaXRsZU1hcmdpbn1gO1xuICAgICAgfSk7XG5cbiAgICAvLyBUT09MVElQXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBkM19zZWxlY3QoJ2JvZHknKVxuICAgICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAncGJkcy10b29sdGlwIHNvdXRoJylcbiAgICAgICAgLmNsYXNzZWQoJ3BiZHMtdG9vbHRpcC1jb21wYXJlJywgdGhpcy5pc0NvbXBhcmUpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuICAgIH1cblxuICAgIC8vIGFkZCBsZWdlbmQgY2xhc3Nlc1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMuZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xuICAgIH1cblxuICAgIC8vIFggQVhJU1xuICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIE1hdGguY2VpbChkM19zdW0odGhpcy5kYXRhLCAoZDogYW55KSA9PiBkLnZhbHVlKSldKVxuICAgICAgLnJhbmdlKFswLCArdGhpcy53aWR0aF0pO1xuXG4gICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgIC8vIC50aWNrVmFsdWVzKFswLCBkM19zdW0odGhpcy5kYXRhLCAoZDogYW55KSA9PiBkLnZhbHVlKV0pXG4gICAgICAudGlja3ModGhpcy54QXhpc1RpY2tzKVxuICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy14JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXNUaWNrcyk7XG4gICAgLy8gLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgLy8gWCBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKS50aWNrU2l6ZSgtdGhpcy5oZWlnaHQpO1xuXG4gICAgICB0aGlzLnhHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteCcpXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMueEF4aXNUaXRsZSkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzLXRpdGxlJylcbiAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ2NlbnRlcicpXG4gICAgICAgIC5hdHRyKCd4JywgdGhpcy53aWR0aCAvIDIgLSB0aGlzLm1hcmdpbi5sZWZ0KVxuICAgICAgICAuYXR0cigneScsIHRoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgKCF0aGlzLmhpZGVYQXhpcyA/IDQwIDogMCkpXG4gICAgICAgIC50ZXh0KHRoaXMueEF4aXNUaXRsZSk7XG4gICAgfVxuXG4gICAgLy8gYnVpbGQgY29sb3IgcmFuZ2VzXG4gICAgbGV0IGNvbG9ycztcblxuICAgIGlmICh0aGlzLmlzU2luZ2xlRGF0YSkge1xuICAgICAgY29sb3JzID0gdGhpcy5fZGF0YXZpei5jcmVhdGVHcmFkaWVudERlZnModGhpcy5zdmcsIHRoaXMubW9ub2Nocm9tZSwgdGhpcy50aGVtZSwgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tb25vY2hyb21lKSB7XG4gICAgICBjb2xvcnMgPSB0aGlzLl9kYXRhdml6LmdldENvbG9ycyh0aGlzLm1vbm9jaHJvbWUsIHRoaXMudGhlbWUpLnJldmVyc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sb3JzID0gdGhpcy5fZGF0YXZpei5nZXRDb2xvcnModGhpcy5tb25vY2hyb21lLCB0aGlzLnRoZW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKS5yYW5nZShjb2xvcnMpO1xuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0KCkge1xuICAgIHRoaXMuaXNTaW5nbGVEYXRhID0gdGhpcy5kYXRhLmxlbmd0aCA9PT0gMSA/IHRydWUgOiBmYWxzZTtcbiAgICB0aGlzLmlzQ29tcGFyZSA9IE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuaW5jbHVkZXMoJ2NvbXBhcmVWYWx1ZScpO1xuXG4gICAgY29uc3Qgc3VtVmFsdWVzID0gZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC52YWx1ZSk7XG4gICAgY29uc3QgaXNMYXN0QmFyWmVybyA9XG4gICAgICB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdLnZhbHVlID09PSAwIHx8IHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoIC0gMV0udmFsdWUgPT09IG51bGwgPyB0cnVlIDogZmFsc2U7XG5cbiAgICBsZXQgbGFzdEJhclplcm9Db3VudCA9IDA7XG4gICAgY29uc3QgY2xvbmVEYXRhID0gWy4uLnRoaXMuZGF0YV07XG4gICAgbGV0IGlzTGFzdCA9IGZhbHNlO1xuXG4gICAgY2xvbmVEYXRhLnJldmVyc2UoKS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICBpZiAoKHZhbHVlLnZhbHVlID09PSAwIHx8IHZhbHVlLnZhbHVlID09PSBudWxsKSAmJiAhaXNMYXN0KSB7XG4gICAgICAgIGxhc3RCYXJaZXJvQ291bnQrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzTGFzdCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5wZXJjZW50YWdlICYmICF0aGlzLmlzU2luZ2xlRGF0YSkge1xuICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbihbMCwgc3VtVmFsdWVzXSkucmFuZ2UoWzAsICt0aGlzLndpZHRoXSk7XG4gICAgICB0aGlzLnhBeGlzQ2FsbC50aWNrVmFsdWVzKFswLCBzdW1WYWx1ZXMgKiAwLjI1LCBzdW1WYWx1ZXMgKiAwLjUsIHN1bVZhbHVlcyAqIDAuNzUsIHN1bVZhbHVlc10pO1xuICAgICAgdGhpcy54QXhpcy5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgICAgdGhpcy54R3JpZENhbGwudGlja1ZhbHVlcyhbMCwgc3VtVmFsdWVzICogMC4yNSwgc3VtVmFsdWVzICogMC41LCBzdW1WYWx1ZXMgKiAwLjc1LCBzdW1WYWx1ZXNdKTtcbiAgICAgIHRoaXMueEdyaWQuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG5cbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3QoJy5heGlzLXgnKVxuICAgICAgICAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgLmh0bWwoKGQsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBmb3JtYXQgPSBkM19mb3JtYXQoJy4wJScpO1xuICAgICAgICAgIHJldHVybiBmb3JtYXQoaSAqIDAuMjUpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGVyY2VudGFnZSAmJiB0aGlzLmlzU2luZ2xlRGF0YSkge1xuICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbihbMCwgMS4wXSkucmFuZ2UoWzAsICt0aGlzLndpZHRoXSk7XG4gICAgICB0aGlzLnhBeGlzQ2FsbC50aWNrVmFsdWVzKFswLCAwLjI1LCAwLjUsIDAuNzUsIDEuMF0pO1xuICAgICAgdGhpcy54QXhpcy5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgICAgdGhpcy54R3JpZENhbGwudGlja1ZhbHVlcyhbMCwgMC4yNSwgMC41LCAwLjc1LCAxLjBdKTtcbiAgICAgIHRoaXMueEdyaWQuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG5cbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3QoJy5heGlzLXgnKVxuICAgICAgICAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgLmh0bWwoKGQsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBmb3JtYXQgPSBkM19mb3JtYXQoJy4wJScpO1xuICAgICAgICAgIHJldHVybiBmb3JtYXQoaSAqIDAuMjUpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbihbMCwgTWF0aC5jZWlsKHN1bVZhbHVlcyldKS5yYW5nZShbMCwgK3RoaXMud2lkdGhdKTtcbiAgICAgIHRoaXMueEdyaWRDYWxsLnRpY2tWYWx1ZXModGhpcy54QXhpc1NjYWxlLnRpY2tzKCkuZmlsdGVyKG4gPT4gTnVtYmVyLmlzSW50ZWdlcihuKSkpOyAvLyByZW1vdmUgZGVjaW1hbCBncmlkIHZhbHVlc1xuXG4gICAgICB0aGlzLnhBeGlzXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgICAgLy8gdXBkYXRlIHRoZSBncmlkc1xuICAgICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgICB0aGlzLnhHcmlkXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgLSB0aGlzLmJhclBhZGRpbmc7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBkID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTaW5nbGVEYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wYXRoKCl9I2dyYWRpZW50LWhvcml6b250YWwtJHt0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkuc3Vic3RyKDEpfSlgO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cigneScsICgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFyUGFkZGluZyAvIDI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNsaWNlKDAsIGkpLnJlZHVjZSgoYWNjLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYWNjLCBpdGVtLCBhY2MgKyB0aGlzLnhBeGlzU2NhbGUoaXRlbS52YWx1ZSkgKyB0aGlzLmJhck1hcmdpbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuICthY2MgKyArdGhpcy54QXhpc1NjYWxlKGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuY2FsbChlbnRlciA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC8vIC5kdXJhdGlvbigwKVxuICAgICAgICAgICAgICAgICAgLmRlbGF5KChkLCBpKSA9PiBpICogMjUwKVxuICAgICAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZUxpbmVhcilcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5kYXRhLmxlbmd0aCAtIGxhc3RCYXJaZXJvQ291bnQgLSAxICYmIGlzTGFzdEJhclplcm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgIT09IHRoaXMuZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHdpZHRoID0gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpIC0gK3RoaXMuYmFyTWFyZ2luO1xuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoID0gTWF0aC5zaWduKHdpZHRoKSA9PT0gLTEgPyAwIDogd2lkdGg7IC8vIGhhbmRsZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJylcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgLy8gZGVidWdnZXI7XG4gICAgICAgICAgICAgIGlmIChkLnZhbHVlID09PSBudWxsIHx8IGQudmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKDApO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHRoaXMuZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpIC0gdGhpcy5iYXJNYXJnaW47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2xpY2UoMCwgaSkucmVkdWNlKChhY2MsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjICsgK3RoaXMueEF4aXNTY2FsZShpdGVtLnZhbHVlKTtcbiAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKSxcbiAgICAgICAgZXhpdCA9PlxuICAgICAgICAgIGV4aXRcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlT3V0KCkpXG4gICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0XG4gICAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnYWxpZ24taXRlbXMtc3RhcnQnLCB0aGlzLmlzQ29tcGFyZSk7XG5cbiAgICAgICAgICAgIGxpLmluc2VydCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG4gICAgICAgICAgICAgIC5jbGFzc2VkKCdtdC0xJywgdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBsaS5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWRlc2NyaXB0aW9uJylcbiAgICAgICAgICAgICAgLmNsYXNzZWQoJ2QtZmxleCcsIHRoaXMuaXNDb21wYXJlKVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnZmxleC1jb2x1bW4nLCB0aGlzLmlzQ29tcGFyZSk7XG5cbiAgICAgICAgICAgIGxpLnNlbGVjdCgnLmxlZ2VuZC1kZXNjcmlwdGlvbicpXG4gICAgICAgICAgICAgIC5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJylcbiAgICAgICAgICAgICAgLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsaS5zZWxlY3QoJy5sZWdlbmQtZGVzY3JpcHRpb24nKVxuICAgICAgICAgICAgICAuaW5zZXJ0KCdkaXYnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWNoYW5nZScpXG4gICAgICAgICAgICAgIC5jbGFzc2VkKCdkLW5vbmUnLCAhdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBsaS5zZWxlY3QoJy5sZWdlbmQtY2hhbmdlJykuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWluZGljYXRvciAke2QuY29tcGFyZUNoYW5nZURpcmVjdGlvbn0gJHtcbiAgICAgICAgICAgICAgICBkLmNvbXBhcmVDaGFuZ2VJbnZlcnNlID8gJ2ludmVyc2UnIDogJydcbiAgICAgICAgICAgICAgfSBtdC0xXCI+PHNwYW4+JHt0aGlzLnRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0KGQuY29tcGFyZUNoYW5nZVZhbHVlKX08L3NwYW4+PC9kaXY+YDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB1cGRhdGUgPT4ge1xuICAgICAgICAgICAgdXBkYXRlLmNsYXNzZWQoJ2FsaWduLWl0ZW1zLXN0YXJ0JywgdGhpcy5pc0NvbXBhcmUpO1xuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1rZXknKS5jbGFzc2VkKCdtdC0xJywgdGhpcy5pc0NvbXBhcmUpO1xuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1jaGFuZ2UnKS5jbGFzc2VkKCdkLW5vbmUnLCAhdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBhcmUpIHtcbiAgICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1jaGFuZ2UnKS5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1pbmRpY2F0b3IgJHtkLmNvbXBhcmVDaGFuZ2VEaXJlY3Rpb259ICR7XG4gICAgICAgICAgICAgICAgICBkLmNvbXBhcmVDaGFuZ2VJbnZlcnNlID8gJ2ludmVyc2UnIDogJydcbiAgICAgICAgICAgICAgICB9IG10LTFcIj48c3Bhbj4ke3RoaXMudG9vbHRpcENvbXBhcmVDaGFuZ2VGb3JtYXQoZC5jb21wYXJlQ2hhbmdlVmFsdWUpfTwvc3Bhbj48L2Rpdj5gO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1sYWJlbCcpLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5sZWdlbmRNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3V0KCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmxlZ2VuZE1vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuICAgIH1cbiAgfVxuXG4gIGJhck1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IGQzX3NlbGVjdChub2Rlc1tpbmRleF0pO1xuXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXInKS5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgbm9kZS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICByZXR1cm4gaSAhPT0gaW5kZXg7XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTaG93KGRhdGEsIG5vZGVzW2luZGV4XSk7XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGJhck1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBudWxsKTtcblxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBiYXJNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZGF0YSwgbm9kZSkgPT4ge1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuXG4gICAgY29uc3QgcGVyY2VudGFnZSA9IGRhdGEudmFsdWUgLyBkM19zdW0odGhpcy5kYXRhLCAoZDogYW55KSA9PiBkLnZhbHVlKTtcbiAgICBjb25zdCBjb21wYXJlUGVyY2VudGFnZSA9IGRhdGEuY29tcGFyZVZhbHVlIC8gZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC5jb21wYXJlVmFsdWUpO1xuXG4gICAgbGV0IHRvb2x0aXBMYWJlbCA9IGBgO1xuICAgIGxldCB0b29sdGlwQ29tcGFyZURhdGVyYW5nZU1hcmdpbiA9IGBgO1xuICAgIGxldCB0b29sdGlwQ29tcGFyZURhdGVyYW5nZSA9IGBgO1xuICAgIGxldCB0b29sdGlwQ29tcGFyZVZhbHVlID0gYGA7XG4gICAgbGV0IHRvb2x0aXBEYXRlcmFuZ2VNYXJnaW4gPSBgYDtcbiAgICBsZXQgdG9vbHRpcERhdGVyYW5nZSA9IGBgO1xuICAgIGxldCB0b29sdGlwVmFsdWUgPSBgJHt0aGlzLm51bGxWYWx1ZVRleHR9YDtcbiAgICBsZXQgdG9vbHRpcEluZGljYXRvciA9ICcnO1xuXG4gICAgLy8gdG9vbHRpcCBsYWJlbFxuICAgIGlmICghdGhpcy5pc1NpbmdsZURhdGEpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdwYmRzLXRvb2x0aXAtY29tcGFyZScsIG51bGwpO1xuXG4gICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIHRvb2x0aXBMYWJlbCA9IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGRhdGEubGFiZWwpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkYXRhLmxhYmVsKTtcbiAgICAgICAgICB0b29sdGlwTGFiZWwgPSB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRvb2x0aXBMYWJlbCA9IGRhdGEubGFiZWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdG9vbHRpcCBjb21wYXJlIGRhdGVyYW5nZVxuICAgIGlmICh0aGlzLmlzQ29tcGFyZSAmJiBkYXRhLmNvbXBhcmVTdGFydERhdGUgJiYgZGF0YS5jb21wYXJlRW5kRGF0ZSkge1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3BiZHMtdG9vbHRpcC1jb21wYXJlJywgdGhpcy5pc0NvbXBhcmUpO1xuICAgICAgdG9vbHRpcENvbXBhcmVEYXRlcmFuZ2VNYXJnaW4gPSBgbXQtMmA7XG5cbiAgICAgIHRvb2x0aXBDb21wYXJlRGF0ZXJhbmdlID0gYCR7dGhpcy50b29sdGlwRGF0ZUZvcm1hdChcbiAgICAgICAgZDNfaXNvUGFyc2UoZGF0YS5jb21wYXJlU3RhcnREYXRlKVxuICAgICAgKX0gLSAke3RoaXMudG9vbHRpcERhdGVGb3JtYXQoZDNfaXNvUGFyc2UoZGF0YS5jb21wYXJlRW5kRGF0ZSkpfWA7XG4gICAgfVxuXG4gICAgLy8gdG9vbHRpcCBjb21wYXJlIHZhbHVlXG4gICAgaWYgKHRoaXMucGVyY2VudGFnZSAmJiB0aGlzLmlzQ29tcGFyZSAmJiBkYXRhLmNvbXBhcmVWYWx1ZSkge1xuICAgICAgdG9vbHRpcENvbXBhcmVWYWx1ZSA9XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgICAgPyBgJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KGNvbXBhcmVQZXJjZW50YWdlKX0gKCR7ZGF0YS5jb21wYXJ2ZVZhbHVlfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9KWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQoY29tcGFyZVBlcmNlbnRhZ2UpfSAoJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLmNvbXBhcmVWYWx1ZSl9JHtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFZhbHVlU3VmZml4XG4gICAgICAgICAgfSlgO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbXBhcmUgJiYgZGF0YS5jb21wYXJlVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBDb21wYXJlVmFsdWUgPVxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICAgID8gYCR7ZGF0YS5jb21wYXJlVmFsdWV9JHt0aGlzLnRvb2x0aXBWYWx1ZVN1ZmZpeH0gKCR7dGhpcy50b29sdGlwUGVyY2VudEZvcm1hdChjb21wYXJlUGVyY2VudGFnZSl9KWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEuY29tcGFyZVZhbHVlKX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fSAoJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KFxuICAgICAgICAgICAgY29tcGFyZVBlcmNlbnRhZ2VcbiAgICAgICAgICApfSlgO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbXBhcmUgJiYgZGF0YS5jb21wYXJlVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBDb21wYXJlVmFsdWUgPSBgJHt0aGlzLm51bGxWYWx1ZVRleHR9YDtcbiAgICB9XG5cbiAgICAvLyB0b29sdGlwIGRhdGVyYW5nZVxuICAgIGlmIChkYXRhLnN0YXJ0RGF0ZSAmJiBkYXRhLmVuZERhdGUpIHtcbiAgICAgIHRvb2x0aXBEYXRlcmFuZ2UgPSBgJHt0aGlzLnRvb2x0aXBEYXRlRm9ybWF0KGQzX2lzb1BhcnNlKGRhdGEuc3RhcnREYXRlKSl9IC0gJHt0aGlzLnRvb2x0aXBEYXRlRm9ybWF0KFxuICAgICAgICBkM19pc29QYXJzZShkYXRhLmVuZERhdGUpXG4gICAgICApfWA7XG4gICAgfVxuXG4gICAgLy90b29sdGlwIGRhdGVyYW5nZSBtYXJnaW5cbiAgICBpZiAodG9vbHRpcExhYmVsICE9PSAnJykge1xuICAgICAgdG9vbHRpcERhdGVyYW5nZU1hcmdpbiA9IGBtdC0yYDtcbiAgICB9XG5cbiAgICAvLyB0b29sdGlwIHZhbHVlXG4gICAgaWYgKHRoaXMuaXNTaW5nbGVEYXRhICYmIHRoaXMucGVyY2VudGFnZSAmJiBkYXRhLnZhbHVlKSB7XG4gICAgICB0b29sdGlwVmFsdWUgPSB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbCA/IGAke2RhdGEudmFsdWV9YCA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfWA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU2luZ2xlRGF0YSAmJiBkYXRhLnZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0b29sdGlwVmFsdWUgPVxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICAgID8gYCR7ZGF0YS52YWx1ZX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9YDtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2luZ2xlRGF0YSAmJiB0aGlzLnBlcmNlbnRhZ2UgJiYgZGF0YS52YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdG9vbHRpcFZhbHVlID1cbiAgICAgICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPT09IG51bGxcbiAgICAgICAgICA/IGAke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQocGVyY2VudGFnZSl9ICgke2RhdGEudmFsdWV9JHt0aGlzLnRvb2x0aXBWYWx1ZVN1ZmZpeH0pYFxuICAgICAgICAgIDogYCR7dGhpcy50b29sdGlwUGVyY2VudEZvcm1hdChwZXJjZW50YWdlKX0gKCR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS52YWx1ZSl9JHtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFZhbHVlU3VmZml4XG4gICAgICAgICAgfSlgO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaW5nbGVEYXRhICYmIGRhdGEudmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBWYWx1ZSA9XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgICAgPyBgJHtkYXRhLnZhbHVlfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9ICgke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQocGVyY2VudGFnZSl9KWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9ICgke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQoXG4gICAgICAgICAgICBwZXJjZW50YWdlXG4gICAgICAgICAgKX0pYDtcbiAgICB9XG5cbiAgICAvLyB0b29sdGlwIG1ldHJpYyBpbmRpY2F0b3JcbiAgICBpZiAoIXRoaXMuaXNTaW5nbGVEYXRhICYmIHRoaXMuaXNDb21wYXJlICYmIGRhdGEudmFsdWUgIT09IG51bGwgJiYgZGF0YS5jb21wYXJlVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBJbmRpY2F0b3IgPSBgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1pbmRpY2F0b3IgJHtkYXRhLmNvbXBhcmVDaGFuZ2VEaXJlY3Rpb259ICR7XG4gICAgICAgIGRhdGEuY29tcGFyZUNoYW5nZUludmVyc2UgPyAnaW52ZXJzZScgOiAnJ1xuICAgICAgfSBtbC0yXCI+PHNwYW4+JHt0aGlzLnRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0KGRhdGEuY29tcGFyZUNoYW5nZVZhbHVlKX08L3NwYW4+PC9kaXY+YDtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXAuaHRtbCgoKSA9PiB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC1sYWJlbCBmb250LXdlaWdodC1ib2xkXCI+JHt0b29sdGlwTGFiZWx9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCIke3Rvb2x0aXBDb21wYXJlRGF0ZXJhbmdlTWFyZ2lufVwiPiR7dG9vbHRpcENvbXBhcmVEYXRlcmFuZ2V9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlIGZvbnQtd2VpZ2h0LWJvbGRcIj4ke3Rvb2x0aXBDb21wYXJlVmFsdWV9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCIke3Rvb2x0aXBEYXRlcmFuZ2VNYXJnaW59XCI+JHt0b29sdGlwRGF0ZXJhbmdlfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZVwiPjxzcGFuIGNsYXNzPVwiZm9udC13ZWlnaHQtYm9sZFwiPiR7dG9vbHRpcFZhbHVlfTwvc3Bhbj4gPHNwYW4+JHt0b29sdGlwSW5kaWNhdG9yfTwvc3Bhbj48L2Rpdj5cbiAgICAgIGA7XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0V2lkdGggPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCB0b29sdGlwVGlwU2l6ZSA9IDg7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAkeytzY3JvbGxbMV0gKyArZGltZW5zaW9ucy50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC0gdG9vbHRpcFRpcFNpemV9cHhgKTtcblxuICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID4gMSkge1xuICAgICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSArICtkaW1lbnNpb25zLmxlZnQgLSB0b29sdGlwT2Zmc2V0V2lkdGggKyArZGltZW5zaW9ucy53aWR0aCAvIDJ9cHhgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSAtIHRvb2x0aXBPZmZzZXRXaWR0aCArICtkaW1lbnNpb25zLnJpZ2h0fXB4YCk7XG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kVG9vbHRpcCkge1xuICAgICAgY29uc3QgYmFySG92ZXIgPSB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpXG4gICAgICAgIC5ub2RlKCk7XG5cbiAgICAgIHRoaXMudG9vbHRpcFNob3coZGF0YSwgYmFySG92ZXIpO1xuICAgIH1cblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIG51bGwpO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKVxuICAgICAgLnN0eWxlKCdmaWxsJywgbnVsbCk7XG5cbiAgICAvLyBoaWRlIHRvb2x0aXAgZm9yIHplcm8vbnVsbCB2YWx1ZXNcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHhBeGlzRm9ybWF0dGVyID0gaXRlbSA9PiB7XG4gICAgc3dpdGNoICh0aGlzLnhBeGlzRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIGAke3RoaXMueEF4aXNGb3JtYXQoaXRlbSl9JHt0aGlzLnhBeGlzVGlja0xhYmVsU3VmZml4fWA7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBgJHtpdGVtfSR7dGhpcy54QXhpc1RpY2tMYWJlbFN1ZmZpeH1gO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
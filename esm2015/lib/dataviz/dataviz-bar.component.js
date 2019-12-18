/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { select as d3_select, isoParse as d3_isoParse, scaleOrdinal as d3_scaleOrdinal, scaleBand as d3_scaleBand, scaleLinear as d3_scaleLinear, min as d3_min, max as d3_max, axisBottom as d3_axisBottom, axisLeft as d3_axisLeft, event as d3_event } from 'd3';
import { PbdsDatavizService } from './dataviz.service';
export class PbdsDatavizBarComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     * @param {?} _scroll
     * @param {?} _location
     */
    constructor(_dataviz, _element, _scroll, _location) {
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
        () => {
            // update the xScale
            this.xAxisScale.domain(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            d => d.label)));
            // update the yScale
            this.yAxisScale
                .domain([
                d3_min(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => d.value - d.value * +this.yAxisMinBuffer)),
                d3_max(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => d.value + d.value * +this.yAxisMaxBuffer))
            ])
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
            if (!this.hideXGrid) {
                this.xGrid
                    .transition()
                    .duration(1000)
                    .call(this.xGridCall);
            }
            if (!this.hideYGrid) {
                this.yGrid
                    .transition()
                    .duration(1000)
                    .call(this.yGridCall);
            }
            if (!this.hideGrayBars) {
                // gray bars
                this.svg
                    .selectAll('.gray-bar')
                    .data(this.data)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => enter
                    .append('rect')
                    .attr('class', 'gray-bar')
                    .attr('height', 0)
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label)))
                    .attr('width', this.xAxisScale.bandwidth())
                    .call((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => enter
                    .transition()
                    .duration(500)
                    .attr('height', this.height)))), (/**
                 * @param {?} update
                 * @return {?}
                 */
                update => update
                    .transition()
                    .duration(1000)
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label)))
                    .attr('width', this.xAxisScale.bandwidth())), (/**
                 * @param {?} exit
                 * @return {?}
                 */
                exit => exit
                    .transition()
                    .attr('pointer-events', 'none')
                    .remove()));
                // color bars
                this.svg
                    .selectAll('.bar')
                    .data(this.data)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => enter
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('fill', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => `url(${this._location.path()}#gradient-${this.colorRange(d.label).substr(1)})`)) // removes hash to prevent safari bug;
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 4))
                    .attr('width', this.xAxisScale.bandwidth() / 2)
                    .attr('y', this.height)
                    .attr('height', 0)
                    .attr('pointer-events', 'none')
                    .call((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => enter
                    .transition()
                    .duration(1000)
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d.value)))
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.height - this.yAxisScale(d.value)))
                    .attr('data-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)))
                    .transition()
                    .attr('pointer-events', 'auto')))), (/**
                 * @param {?} update
                 * @return {?}
                 */
                update => update
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 4))
                    .attr('width', this.xAxisScale.bandwidth() / 2)
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.height - this.yAxisScale(d.value)))
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d.value)))
                    .transition()
                    .attr('pointer-events', 'auto')), (/**
                 * @param {?} exit
                 * @return {?}
                 */
                exit => exit
                    .transition()
                    .attr('pointer-events', 'none')
                    .remove()))
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseOver(d3_event, data, index, nodes)))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseOut()))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseClick(d3_event, data, index, nodes)));
            }
            else {
                // color bars
                this.svg
                    .selectAll('.bar')
                    .data(this.data)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => enter
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('fill', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => `url(${this._location.path()}#gradient-${this.colorRange(d.label).substr(1)})`))
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 5.5))
                    .attr('width', this.xAxisScale.bandwidth() / 1.5)
                    .attr('y', this.height)
                    .attr('height', 0)
                    .attr('pointer-events', 'none')
                    .call((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => enter
                    .transition()
                    .duration(1000)
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d.value)))
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.height - this.yAxisScale(d.value)))
                    .attr('data-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)))
                    .transition()
                    .attr('pointer-events', 'auto')))), (/**
                 * @param {?} update
                 * @return {?}
                 */
                update => update
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 5.5))
                    .attr('width', this.xAxisScale.bandwidth() / 1.5)
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.height - this.yAxisScale(d.value)))
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d.value)))
                    .transition()
                    .attr('pointer-events', 'auto')), (/**
                 * @param {?} exit
                 * @return {?}
                 */
                exit => exit
                    .transition()
                    .attr('pointer-events', 'none')
                    .remove()))
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseOver(d3_event, data, index, nodes)))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseOut()))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseClick(d3_event, data, index, nodes)));
            }
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.data)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => {
                    /** @type {?} */
                    const li = enter.insert('li', 'li.legend-static').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.colorRange(d.label)));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d.label);
                            case 'time':
                                /** @type {?} */
                                const parsedTime = d3_isoParse(d.label);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    }));
                    return li;
                }), (/**
                 * @param {?} update
                 * @return {?}
                 */
                update => update.select('.legend-label').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = d3_isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }))), (/**
                 * @param {?} exit
                 * @return {?}
                 */
                exit => exit.remove()))
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.legendMouseOver(d3_event, data, index, nodes)))
                    .on('mouseout', (/**
                 * @return {?}
                 */
                () => this.legendMouseOut()))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.legendMouseClick(d3_event, data, index, nodes)));
            }
            if (this.threshold) {
                this.yThreshold
                    .raise()
                    .transition()
                    .duration(1000)
                    .attr('transform', `translate(0,  ${this.yAxisScale(+this.threshold)})`);
            }
            if (this.average) {
                this.yAverage
                    .raise()
                    .transition()
                    .duration(1000)
                    .attr('transform', `translate(0,  ${this.yAxisScale(+this.average)})`);
            }
        });
        this.barMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.chart
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            /** @type {?} */
            const bar = this.chart.selectAll('.bar').filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index));
            /** @type {?} */
            const barColor = bar.attr('data-color');
            bar.style('fill', barColor);
            this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.tooltipShow(data, nodes.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))[0]);
            this.hovered.emit({ event, data });
        });
        this.barMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.tooltipHide();
        });
        this.barMouseClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.clicked.emit({ event, data });
        });
        this.legendMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.chart
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            /** @type {?} */
            const bar = this.chart.selectAll('.bar').filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index));
            /** @type {?} */
            const barColor = bar.attr('data-color');
            bar.style('fill', barColor);
            this.tooltipShow(data, this.chart
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .node());
            this.hovered.emit({ event, data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
            this.tooltipHide();
        });
        this.legendMouseClick = (/**
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
            /** @type {?} */
            let label;
            switch (this.tooltipLabelFormatType) {
                case 'number':
                    label = this.tooltipLabelFormat(data.label);
                    break;
                case 'time':
                    /** @type {?} */
                    const parsedTime = d3_isoParse(data.label);
                    label = this.tooltipLabelFormat(parsedTime);
                    break;
                default:
                    label = data.label;
            }
            /** @type {?} */
            const value = this.tooltipValueFormat === null
                ? `<div class="tooltip-value">${data.value}</div>`
                : `<div class="tooltip-value">${this.tooltipValueFormat(data.value)}</div>`;
            this.tooltip.html(`
        ${this.hideTooltipLabel ? '' : `${label}`}
        ${value}
      `);
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
        this.xAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        item => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return this.xAxisFormat(item);
                case 'time':
                    /** @type {?} */
                    const parseDate = d3_isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        });
        this.yAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        item => {
            switch (this.yAxisFormatType) {
                case 'number':
                    return this.yAxisFormat(item);
                case 'time':
                    /** @type {?} */
                    const parseDate = d3_isoParse(item);
                    return this.yAxisFormat(parseDate);
                default:
                    return item;
            }
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
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height +
            this.margin.top +
            this.margin.bottom +
            this.xAxisTitleMargin}`);
        // build color ranges
        this.colorRange = d3_scaleOrdinal().range(this._dataviz.createGradientDefs(this.svg, this.singleSeries, this.theme));
        // X AXIS
        this.xAxisScale = d3_scaleBand()
            .domain(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        d => d.label)))
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
            .attr('transform', `translate(0, ${this.height})`)
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
                .attr('transform', `translate(0, ${this.height})`)
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
            d => d.value - d.value * +this.yAxisMinBuffer)),
            d3_max(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            d => d.value + d.value * +this.yAxisMaxBuffer))
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
                .attr('transform', `translate(0, 0)`)
                .call(this.yGridCall);
        }
        // Y THRESHOLD
        if (this.threshold) {
            this.yThreshold = this.svg
                .append('line')
                .attr('class', 'threshold')
                .attr('x2', +this.width - this.margin.right - this.margin.left)
                .attr('transform', `translate(0,  ${this.yAxisScale(+this.threshold)})`);
        }
        // Y AVERAGE
        if (this.average) {
            this.yAverage = this.svg
                .append('line')
                .attr('class', 'average')
                .attr('x2', +this.width - this.margin.right - this.margin.left)
                .attr('transform', `translate(0,  ${this.yAxisScale(+this.average)})`);
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
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
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
            () => {
                return `
          <span class="legend-key"></span>
          <span class="legend-label">${this.averageLabel}</span>
        `;
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
            () => {
                return `
          <span class="legend-key"></span>
          <span class="legend-label">${this.thresholdLabel}</span>
        `;
            }));
        }
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
PbdsDatavizBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizBarComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller },
    { type: Location }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUdYLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFN0QsT0FBTyxFQUNMLE1BQU0sSUFBSSxTQUFTLEVBQ25CLFFBQVEsSUFBSSxXQUFXLEVBQ3ZCLFlBQVksSUFBSSxlQUFlLEVBQy9CLFNBQVMsSUFBSSxZQUFZLEVBQ3pCLFdBQVcsSUFBSSxjQUFjLEVBQzdCLEdBQUcsSUFBSSxNQUFNLEVBQ2IsR0FBRyxJQUFJLE1BQU0sRUFDYixVQUFVLElBQUksYUFBYSxFQUMzQixRQUFRLElBQUksV0FBVyxFQUN2QixLQUFLLElBQUksUUFBUSxFQUNsQixNQUFNLElBQUksQ0FBQztBQUVaLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBU3ZELE1BQU0sT0FBTyx1QkFBdUI7Ozs7Ozs7SUFtSmxDLFlBQ1UsUUFBNEIsRUFDNUIsUUFBb0IsRUFDcEIsT0FBeUIsRUFDekIsU0FBbUI7UUFIbkIsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUNwQixZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQUN6QixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBcko3QixlQUFVLEdBQUcsSUFBSSxDQUFDO1FBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFNaEIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFdBQU0sR0FBRyxHQUFHLENBQUM7UUFH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Ozs7OztJQUVGLGlEQVlFOzs7OztJQWxwQkEsMkNBQW9DOzs7OztJQUNwQywyQ0FBNEI7Ozs7O0lBQzVCLDBDQUFpQzs7Ozs7SUFDakMsNENBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciwgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge1xuICBzZWxlY3QgYXMgZDNfc2VsZWN0LFxuICBpc29QYXJzZSBhcyBkM19pc29QYXJzZSxcbiAgc2NhbGVPcmRpbmFsIGFzIGQzX3NjYWxlT3JkaW5hbCxcbiAgc2NhbGVCYW5kIGFzIGQzX3NjYWxlQmFuZCxcbiAgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsXG4gIG1pbiBhcyBkM19taW4sXG4gIG1heCBhcyBkM19tYXgsXG4gIGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSxcbiAgYXhpc0xlZnQgYXMgZDNfYXhpc0xlZnQsXG4gIGV2ZW50IGFzIGQzX2V2ZW50XG59IGZyb20gJ2QzJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXIgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1iYXInLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6QmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1iYXInKVxuICBiYXJDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogUGJkc0RhdGF2aXpCYXJbXTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwNjtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ2xvdycgfCAnbWVkaXVtJyB8ICdoaWdoJyB8ICdkZWJ1ZycgPSAnbWVkaXVtJzsgLy8gZGVidWcgdG8gc2hvdyBhbGwgY2hhcnQgb3B0aW9uc1xuXG4gIEBJbnB1dCgpXG4gIHNpbmdsZVNlcmllcyA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgeEF4aXNUaXRsZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeUF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeUF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB5QXhpc1RpY2tzID0gNTtcblxuICBASW5wdXQoKVxuICB5QXhpc01pbkJ1ZmZlciA9IDAuMDE7XG5cbiAgQElucHV0KClcbiAgeUF4aXNNYXhCdWZmZXIgPSAwLjAxO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDEwNSArIDI4OyAvLyBoYXJkY29kZWQgbGVnZW5kIHdpZHRoICsgbGVmdCBtYXJnaW4sIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFBvc2l0aW9uOiAncmlnaHQnIHwgJ2JvdHRvbScgPSAncmlnaHQnO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAxMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDMwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDU1OyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgdGhyZXNob2xkID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0aHJlc2hvbGRMYWJlbCA9ICdUaHJlc2hvbGQnO1xuXG4gIEBJbnB1dCgpXG4gIGF2ZXJhZ2UgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGF2ZXJhZ2VMYWJlbCA9ICdBdmVyYWdlJztcblxuICBASW5wdXQoKVxuICB0aGVtZTtcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBoaWRlR3JheUJhcnM6IGJvb2xlYW47XG4gIHByaXZhdGUgeVRocmVzaG9sZDtcbiAgcHJpdmF0ZSB5QXZlcmFnZTtcbiAgcHJpdmF0ZSB4QXhpc1NjYWxlO1xuICBwcml2YXRlIHhBeGlzQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpcztcbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdDtcbiAgcHJpdmF0ZSB4QXhpc1RpdGxlTWFyZ2luOiBudW1iZXI7XG4gIHByaXZhdGUgeUF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB5QXhpc0NhbGw7XG4gIHByaXZhdGUgeUF4aXM7XG4gIHByaXZhdGUgeUF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeEdyaWQ7XG4gIHByaXZhdGUgeEdyaWRDYWxsO1xuICBwcml2YXRlIHlHcmlkO1xuICBwcml2YXRlIHlHcmlkQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHlBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIGhpZGVYQXhpczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXM6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhHcmlkOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZR3JpZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsZWdlbmRMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIGhpZGVUb29sdGlwOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVUb29sdGlwTGFiZWw6IGJvb2xlYW47XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBMYWJlbEZvcm1hdDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIsXG4gICAgcHJpdmF0ZSBfbG9jYXRpb246IExvY2F0aW9uXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFR5cGUsIHRoaXMueEF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMueUF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueUF4aXNGb3JtYXRUeXBlLCB0aGlzLnlBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSwgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGRlZmF1bHRzIGZvciBhbGwgY2hhcnQgdHlwZXNcbiAgICB0aGlzLmhpZGVHcmF5QmFycyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc1plcm8gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1plcm8gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYR3JpZCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlHcmlkID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVRvb2x0aXAgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IGZhbHNlO1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuICAgIHRoaXMueEF4aXNUaXRsZU1hcmdpbiA9IHRoaXMueEF4aXNUaXRsZSA/IDIwIDogMDtcbiAgICB0aGlzLnlBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyID0gMDtcbiAgICB0aGlzLmhpZGVUb29sdGlwTGFiZWwgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdkZWJ1ZycpIHtcbiAgICAgIC8vIHNldCB0eXBlIGRlZmF1bHRzXG4gICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICBjYXNlICdsb3cnOlxuICAgICAgICAgIHRoaXMuaGlkZUdyYXlCYXJzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpcyA9ICF0aGlzLmhpZGVMZWdlbmQ7XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5sZWdlbmRQb3NpdGlvbiA9ICdib3R0b20nO1xuICAgICAgICAgIHRoaXMuaGlkZVRvb2x0aXBMYWJlbCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXMgPSAhdGhpcy5oaWRlTGVnZW5kO1xuICAgICAgICAgIHRoaXMuaGlkZVhHcmlkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVRvb2x0aXBMYWJlbCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnaGlnaCc6XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXMgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlHcmlkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVMZWdlbmQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVRvb2x0aXBMYWJlbCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBzaW5nbGUgc2VyaWVzIG92ZXJyaWRlc1xuICAgICAgaWYgKHRoaXMuc2luZ2xlU2VyaWVzKSB7XG4gICAgICAgIHRoaXMuaGlkZUxlZ2VuZCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGlkZVhBeGlzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhpZGVUb29sdGlwTGFiZWwgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhZGp1c3QgbWFyZ2luIGlmIHhBeGlzIGhpZGRlblxuICAgIGlmICh0aGlzLmhpZGVYQXhpcykgdGhpcy5tYXJnaW4uYm90dG9tID0gMTA7IC8vIG5lZWQgc21hbGwgbWFyZ2luIGZvciB5QXhpcyB3aXRoIDAgdGljayBsYWJlbFxuXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQgJiYgdGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgdGhpcy53aWR0aCA9ICt0aGlzLndpZHRoIC0gK3RoaXMubGVnZW5kV2lkdGg7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHRoZSBjaGFydFxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tICsgdGhpcy54QXhpc1RpdGxlTWFyZ2luKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGh9ICR7K3RoaXMuaGVpZ2h0ICtcbiAgICAgICAgICB0aGlzLm1hcmdpbi50b3AgK1xuICAgICAgICAgIHRoaXMubWFyZ2luLmJvdHRvbSArXG4gICAgICAgICAgdGhpcy54QXhpc1RpdGxlTWFyZ2lufWBcbiAgICAgICk7XG5cbiAgICAvLyBidWlsZCBjb2xvciByYW5nZXNcbiAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKS5yYW5nZShcbiAgICAgIHRoaXMuX2RhdGF2aXouY3JlYXRlR3JhZGllbnREZWZzKHRoaXMuc3ZnLCB0aGlzLnNpbmdsZVNlcmllcywgdGhpcy50aGVtZSlcbiAgICApO1xuXG4gICAgLy8gWCBBWElTXG4gICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgIC5kb21haW4odGhpcy5kYXRhLm1hcChkID0+IGQubGFiZWwpKVxuICAgICAgLnJhbmdlUm91bmQoWzAsIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0XSlcbiAgICAgIC5hbGlnbigwKTtcblxuICAgIC8vIGFkZCBwYWRkaW5nIHRvIHRoZSBzY2FsZSBmb3IgZ3JheSBiYXJzXG4gICAgIXRoaXMuaGlkZUdyYXlCYXJzXG4gICAgICA/IHRoaXMueEF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMC4xKS5wYWRkaW5nT3V0ZXIoMClcbiAgICAgIDogdGhpcy54QXhpc1NjYWxlLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCk7XG5cbiAgICB0aGlzLnhBeGlzQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKVxuICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy14JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXNUaWNrcylcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIC8vIFggR1JJRExJTkVTXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZENhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSkudGlja1NpemUoLXRoaXMuaGVpZ2h0KTtcblxuICAgICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXgnKVxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIH1cblxuICAgIC8vIFggQVhJUyBUSVRMRVxuICAgIGlmICh0aGlzLnhBeGlzVGl0bGUpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcy10aXRsZScpXG4gICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdjZW50ZXInKVxuICAgICAgICAuYXR0cigneCcsIHRoaXMud2lkdGggLyAyIC0gdGhpcy5tYXJnaW4ubGVmdClcbiAgICAgICAgLmF0dHIoJ3knLCB0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArICh0aGlzLmhpZGVYQXhpcyA/IDE1IDogMCkpXG4gICAgICAgIC50ZXh0KHRoaXMueEF4aXNUaXRsZSk7XG4gICAgfVxuXG4gICAgLy8gWSBBWElTXG4gICAgdGhpcy55QXhpc1NjYWxlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbXG4gICAgICAgIGQzX21pbih0aGlzLmRhdGEsIGQgPT4gZC52YWx1ZSAtIGQudmFsdWUgKiArdGhpcy55QXhpc01pbkJ1ZmZlciksXG4gICAgICAgIGQzX21heCh0aGlzLmRhdGEsIGQgPT4gZC52YWx1ZSArIGQudmFsdWUgKiArdGhpcy55QXhpc01heEJ1ZmZlcilcbiAgICAgIF0pXG4gICAgICAubmljZSgpXG4gICAgICAucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKTtcblxuICAgIHRoaXMueUF4aXNDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnlBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnlBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueUF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy55QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteScpXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXNUaWNrcylcbiAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgIC8vIFkgR1JJRExJTkVTXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgdGhpcy55R3JpZENhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAgIC50aWNrU2l6ZSgtdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodCk7XG5cbiAgICAgIHRoaXMueUdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC15JylcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsIDApYClcbiAgICAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgIH1cblxuICAgIC8vIFkgVEhSRVNIT0xEXG4gICAgaWYgKHRoaXMudGhyZXNob2xkKSB7XG4gICAgICB0aGlzLnlUaHJlc2hvbGQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdsaW5lJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RocmVzaG9sZCcpXG4gICAgICAgIC5hdHRyKCd4MicsICt0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ucmlnaHQgLSB0aGlzLm1hcmdpbi5sZWZ0KVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAgJHt0aGlzLnlBeGlzU2NhbGUoK3RoaXMudGhyZXNob2xkKX0pYCk7XG4gICAgfVxuXG4gICAgLy8gWSBBVkVSQUdFXG4gICAgaWYgKHRoaXMuYXZlcmFnZSkge1xuICAgICAgdGhpcy55QXZlcmFnZSA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2xpbmUnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXZlcmFnZScpXG4gICAgICAgIC5hdHRyKCd4MicsICt0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ucmlnaHQgLSB0aGlzLm1hcmdpbi5sZWZ0KVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAgJHt0aGlzLnlBeGlzU2NhbGUoK3RoaXMuYXZlcmFnZSl9KWApO1xuICAgIH1cblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgc291dGgnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcbiAgICB9XG5cbiAgICAvLyBhZGQgbGVnZW5kIGNsYXNzZXNcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgYXZlcmFnZSB0byBsZWdlbmRcbiAgICBpZiAodGhpcy5hdmVyYWdlICYmICF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuY2hhcnRcbiAgICAgICAgLnNlbGVjdCgnLmxlZ2VuZCcpXG4gICAgICAgIC5hcHBlbmQoJ2xpJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1zdGF0aWMgbGVnZW5kLWF2ZXJhZ2UnKVxuICAgICAgICAuaHRtbCgoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImxlZ2VuZC1rZXlcIj48L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJsZWdlbmQtbGFiZWxcIj4ke3RoaXMuYXZlcmFnZUxhYmVsfTwvc3Bhbj5cbiAgICAgICAgYDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRocmVzaG9sZCB0byBsZWdlbmRcbiAgICBpZiAodGhpcy50aHJlc2hvbGQgJiYgIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcbiAgICAgICAgLmFwcGVuZCgnbGknKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLXN0YXRpYyBsZWdlbmQtdGhyZXNob2xkJylcbiAgICAgICAgLmh0bWwoKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJsZWdlbmQta2V5XCI+PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGVnZW5kLWxhYmVsXCI+JHt0aGlzLnRocmVzaG9sZExhYmVsfTwvc3Bhbj5cbiAgICAgICAgYDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIC8vIHVwZGF0ZSB0aGUgeFNjYWxlXG4gICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbih0aGlzLmRhdGEubWFwKGQgPT4gZC5sYWJlbCkpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSB5U2NhbGVcbiAgICB0aGlzLnlBeGlzU2NhbGVcbiAgICAgIC5kb21haW4oW1xuICAgICAgICBkM19taW4odGhpcy5kYXRhLCBkID0+IGQudmFsdWUgLSBkLnZhbHVlICogK3RoaXMueUF4aXNNaW5CdWZmZXIpLFxuICAgICAgICBkM19tYXgodGhpcy5kYXRhLCBkID0+IGQudmFsdWUgKyBkLnZhbHVlICogK3RoaXMueUF4aXNNYXhCdWZmZXIpXG4gICAgICBdKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMuaGVpZ2h0LCAwXSlcbiAgICAgIC5uaWNlKCk7XG5cbiAgICB0aGlzLnhBeGlzXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIHRoaXMueUF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSBncmlkc1xuICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAgIHRoaXMueEdyaWRcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcbiAgICAgIHRoaXMueUdyaWRcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlR3JheUJhcnMpIHtcbiAgICAgIC8vIGdyYXkgYmFyc1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLmdyYXktYmFyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmF5LWJhcicpXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAgIC5jYWxsKGVudGVyID0+XG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLmxhYmVsKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKSxcbiAgICAgICAgICBleGl0ID0+XG4gICAgICAgICAgICBleGl0XG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAucmVtb3ZlKClcbiAgICAgICAgKTtcblxuICAgICAgLy8gY29sb3IgYmFyc1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBkID0+IGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wYXRoKCl9I2dyYWRpZW50LSR7dGhpcy5jb2xvclJhbmdlKGQubGFiZWwpLnN1YnN0cigxKX0pYCkgLy8gcmVtb3ZlcyBoYXNoIHRvIHByZXZlbnQgc2FmYXJpIGJ1ZztcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLmxhYmVsKSArIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDIpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgIC5jYWxsKGVudGVyID0+XG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IHRoaXMuaGVpZ2h0IC0gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtY29sb3InLCBkID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSlcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJylcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC5sYWJlbCkgKyB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA0KVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyAyKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiB0aGlzLmhlaWdodCAtIHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICAgIGV4aXQgPT5cbiAgICAgICAgICAgIGV4aXRcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlT3V0KCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb2xvciBiYXJzXG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXInKVxuICAgICAgICAgICAgICAuYXR0cignZmlsbCcsIGQgPT4gYHVybCgke3RoaXMuX2xvY2F0aW9uLnBhdGgoKX0jZ3JhZGllbnQtJHt0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkuc3Vic3RyKDEpfSlgKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQubGFiZWwpICsgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNS41KVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyAxLjUpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgIC5jYWxsKGVudGVyID0+XG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IHRoaXMuaGVpZ2h0IC0gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtY29sb3InLCBkID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSlcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJylcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC5sYWJlbCkgKyB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA1LjUpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDEuNSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGQgPT4gdGhpcy5oZWlnaHQgLSB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKSxcbiAgICAgICAgICBleGl0ID0+XG4gICAgICAgICAgICBleGl0XG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAucmVtb3ZlKClcbiAgICAgICAgKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZU91dCgpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcbiAgICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaSA9IGVudGVyLmluc2VydCgnbGknLCAnbGkubGVnZW5kLXN0YXRpYycpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJyk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpO1xuXG4gICAgICAgICAgICBsaS5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJylcbiAgICAgICAgICAgICAgLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHRoaXMubGVnZW5kTW91c2VPdXQoKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubGVnZW5kTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGhyZXNob2xkKSB7XG4gICAgICB0aGlzLnlUaHJlc2hvbGRcbiAgICAgICAgLnJhaXNlKClcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgICR7dGhpcy55QXhpc1NjYWxlKCt0aGlzLnRocmVzaG9sZCl9KWApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmF2ZXJhZ2UpIHtcbiAgICAgIHRoaXMueUF2ZXJhZ2VcbiAgICAgICAgLnJhaXNlKClcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgICR7dGhpcy55QXhpc1NjYWxlKCt0aGlzLmF2ZXJhZ2UpfSlgKTtcbiAgICB9XG4gIH07XG5cbiAgYmFyTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBjb25zdCBiYXIgPSB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmJhcicpLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpO1xuXG4gICAgY29uc3QgYmFyQ29sb3IgPSBiYXIuYXR0cignZGF0YS1jb2xvcicpO1xuXG4gICAgYmFyLnN0eWxlKCdmaWxsJywgYmFyQ29sb3IpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTaG93KGRhdGEsIG5vZGVzLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpWzBdKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgYmFyTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsIG51bGwpO1xuXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGJhck1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIGNvbnN0IGJhciA9IHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuYmFyJykuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleCk7XG5cbiAgICBjb25zdCBiYXJDb2xvciA9IGJhci5hdHRyKCdkYXRhLWNvbG9yJyk7XG5cbiAgICBiYXIuc3R5bGUoJ2ZpbGwnLCBiYXJDb2xvcik7XG5cbiAgICB0aGlzLnRvb2x0aXBTaG93KFxuICAgICAgZGF0YSxcbiAgICAgIHRoaXMuY2hhcnRcbiAgICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGluZGV4KVxuICAgICAgICAubm9kZSgpXG4gICAgKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsIG51bGwpO1xuXG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChkYXRhLCBub2RlKSA9PiB7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgbGV0IGxhYmVsO1xuXG4gICAgc3dpdGNoICh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGxhYmVsID0gdGhpcy50b29sdGlwTGFiZWxGb3JtYXQoZGF0YS5sYWJlbCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGRhdGEubGFiZWwpO1xuICAgICAgICBsYWJlbCA9IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGFiZWwgPSBkYXRhLmxhYmVsO1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZSA9XG4gICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICA/IGA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZVwiPiR7ZGF0YS52YWx1ZX08L2Rpdj5gXG4gICAgICAgIDogYDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlXCI+JHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX08L2Rpdj5gO1xuXG4gICAgdGhpcy50b29sdGlwLmh0bWwoXG4gICAgICBgXG4gICAgICAgICR7dGhpcy5oaWRlVG9vbHRpcExhYmVsID8gJycgOiBgJHtsYWJlbH1gfVxuICAgICAgICAke3ZhbHVlfVxuICAgICAgYFxuICAgICk7XG5cbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0V2lkdGggPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodCArIDg7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAkeytzY3JvbGxbMV0gKyArZGltZW5zaW9ucy50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0fXB4YCk7IC8vXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSArICtkaW1lbnNpb25zLmxlZnQgLSB0b29sdGlwT2Zmc2V0V2lkdGggKyArZGltZW5zaW9ucy53aWR0aCAvIDJ9cHhgKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSBpdGVtID0+IHtcbiAgICBzd2l0Y2ggKHRoaXMueEF4aXNGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChpdGVtKTtcblxuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChwYXJzZURhdGUpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIHN3aXRjaCAodGhpcy55QXhpc0Zvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KGl0ZW0pO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
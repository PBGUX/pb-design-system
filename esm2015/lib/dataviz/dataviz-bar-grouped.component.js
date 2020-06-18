/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { select as d3_select, event as d3_event } from 'd3-selection';
import { scaleOrdinal as d3_scaleOrdinal, scaleBand as d3_scaleBand, scaleLinear as d3_scaleLinear } from 'd3-scale';
import { max as d3_max } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { values as d3_values } from 'd3-collection';
import { isoParse as d3_isoParse } from 'd3-time-format';
import { PbdsDatavizService } from './dataviz.service';
export class PbdsDatavizBarGroupedComponent {
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
        (event, data, index, nodes) => {
            /** @type {?} */
            const node = d3_select(nodes[index]);
            this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .classed('inactive', true);
            node.classed('inactive', false).style('fill', node.attr('data-color'));
            this.tooltipShow(data, nodes[index]);
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
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            /** @type {?} */
            const bar = this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .classed('inactive', null);
            /** @type {?} */
            const barColor = bar.attr('data-color');
            bar.style('fill', (/**
             * @return {?}
             */
            () => barColor));
            this.hovered.emit({ event, data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart
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
        ${label}
        ${value}
      `);
            /** @type {?} */
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            /** @type {?} */
            const tooltipTipSize = 8;
            if (this.vertical) {
                this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight - tooltipTipSize}px`);
                this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            }
            else {
                this.tooltip.style('top', `${+scroll[1] + +dimensions.top + +dimensions.height / 2 - tooltipOffsetHeight / 2}px`);
                this.tooltip.style('left', `${+scroll[0] + +dimensions.right + tooltipTipSize}px`);
            }
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
        () => {
            if (this.vertical) {
                return +this.width;
            }
            else {
                return +this.width + this.margin.left + this.margin.right;
            }
        }))
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', (/**
         * @return {?}
         */
        () => {
            if (this.vertical) {
                return `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height +
                    this.margin.top +
                    this.margin.bottom}`;
            }
            else {
                return `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this
                    .height +
                    this.margin.top +
                    this.margin.bottom}`;
            }
        }));
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', (/**
             * @return {?}
             */
            () => {
                return this.vertical ? 'pbds-tooltip south' : 'pbds-tooltip west';
            }))
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
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
            d => d.key)))
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
            (data) => {
                /** @type {?} */
                const clone = Object.assign({}, data);
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
                    .attr('transform', `translate(0, 0)`)
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
            (data) => {
                /** @type {?} */
                const clone = Object.assign({}, data);
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
                .attr('transform', `translate(0, ${this.height})`)
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
            d => d.key)))
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
                    .attr('transform', `translate(0, ${this.height})`)
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            if (this.vertical) {
                this.updateChartVertical();
            }
            else {
                this.updateChartHorizontal();
            }
        }
    }
    /**
     * @return {?}
     */
    updateChartVertical() {
        // update the xScale
        this.xAxisScale.domain(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        d => d.key)));
        // update the yScale
        this.yAxisMax = d3_max(this.data, (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            /** @type {?} */
            const clone = Object.assign({}, data);
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
        enter => enter
            .append('rect')
            .attr('class', 'gray-bar')
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.xAxisScale(d.key)))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.yAxisScale(d.value)))
            .attr('width', this.xAxisScale.bandwidth())
            .attr('height', this.height)), (/**
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
        d => this.xAxisScale(d.key)))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.yAxisScale(d.value)))
            .attr('width', this.xAxisScale.bandwidth())
            .attr('height', this.height)));
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return `translate(${this.xAxisScale(d.key)}, 0)`;
        }))), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .transition()
            .duration(1000)
            .attr('transform', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return `translate(${this.xAxisScale(d.key)}, 0)`;
        }))));
        this.svg
            .selectAll('.bar-group')
            .selectAll('.bar')
            .data((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            /** @type {?} */
            const clone = Object.assign({}, d);
            delete clone.key;
            /** @type {?} */
            const keys = Object.keys(clone);
            /** @type {?} */
            const keyData = keys.map((/**
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
        enter => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        d => `url(${this._location.path()}#gradient-${this.colorRange(d.label).substr(1)})`))
            .attr('data-color', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.colorRange(d.label)))
            .attr('data-parent-index', (/**
         * @param {?} d
         * @return {?}
         */
        d => d.parentIndex))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.barScale(d.label)))
            .attr('width', this.barScale.bandwidth())
            .attr('y', this.height)
            .attr('height', 0)
            .call((/**
         * @param {?} enter
         * @return {?}
         */
        enter => {
            return enter
                .attr('pointer-events', 'none')
                .transition()
                .duration(0) // 500
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
                .attr('pointer-events', 'auto');
        }))), (/**
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
        d => this.barScale(d.label)))
            .attr('width', this.barScale.bandwidth())
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
            .duration(0) // 100
            .attr('pointer-events', 'none')
            .attr('height', 0)
            .attr('y', this.height)))
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
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    }
    /**
     * @return {?}
     */
    updateChartHorizontal() {
        // update the xScale
        this.xAxisMax = d3_max(this.data, (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            /** @type {?} */
            const clone = Object.assign({}, data);
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
        d => d.key)));
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
        enter => enter
            .append('rect')
            .attr('class', 'gray-bar')
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.yAxisScale(d.key)))
            .attr('width', this.width)
            .attr('height', this.yAxisScale.bandwidth())), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .transition()
            .duration(1000)
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.yAxisScale(d.key)))
            .attr('width', this.width)
            .attr('height', this.yAxisScale.bandwidth())));
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return `translate(0, ${this.yAxisScale(d.key)})`;
        }))), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .transition()
            .duration(1000)
            .attr('transform', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return `translate(0, ${this.yAxisScale(d.key)})`;
        }))));
        this.svg
            .selectAll('.bar-group')
            .selectAll('.bar')
            .data((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            /** @type {?} */
            const clone = Object.assign({}, d);
            delete clone.key;
            /** @type {?} */
            const keys = Object.keys(clone);
            /** @type {?} */
            const keyData = keys.map((/**
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
        enter => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        d => `url(${this._location.path()}#gradient-horizontal-${this.colorRange(d.label).substr(1)})`))
            .attr('data-color', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.colorRange(d.label)))
            .attr('data-parent-index', (/**
         * @param {?} d
         * @return {?}
         */
        d => d.parentIndex))
            .attr('x', 0)
            .attr('width', 0)
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.barScale(d.label)))
            .attr('height', this.barScale.bandwidth())
            .call((/**
         * @param {?} enter
         * @return {?}
         */
        enter => {
            return enter
                .attr('pointer-events', 'none')
                .transition()
                .duration(0) // 500
                .attr('width', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.xAxisScale(d.value)))
                .transition()
                .attr('pointer-events', 'auto');
        }))), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .attr('pointer-events', 'none')
            .transition()
            .duration(1000)
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.xAxisScale(d.value)))
            .attr('height', this.barScale.bandwidth())
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.barScale(d.label)))
            .transition()
            .attr('pointer-events', 'auto')), (/**
         * @param {?} exit
         * @return {?}
         */
        exit => exit
            .transition()
            .duration(0) // 100
            .attr('pointer-events', 'none')
            .attr('width', 0)))
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
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    }
    /**
     * @return {?}
     */
    updateLegend() {
        // legend
        if (!this.hideLegend) {
            /** @type {?} */
            const legendData = Object.assign({}, this.data[0]);
            delete legendData.key;
            /** @type {?} */
            const legendKeys = Object.keys(legendData).map((/**
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
            enter => {
                /** @type {?} */
                const li = enter.append('li').attr('class', 'legend-item');
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)));
                li.insert('span', '.legend-item')
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
            update => {
                update.select('.legend-label').html((/**
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
                return update;
            }), (/**
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
    }
}
PbdsDatavizBarGroupedComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar-grouped',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizBarGroupedComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller },
    { type: Location }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItZ3JvdXBlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2RhdGF2aXovZGF0YXZpei1iYXItZ3JvdXBlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFHWCx1QkFBdUIsRUFDeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTdELE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLEtBQUssSUFBSSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEUsT0FBTyxFQUFFLFlBQVksSUFBSSxlQUFlLEVBQUUsU0FBUyxJQUFJLFlBQVksRUFBRSxXQUFXLElBQUksY0FBYyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JILE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDL0UsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQVN2RCxNQUFNLE9BQU8sOEJBQThCOzs7Ozs7O0lBMEl6QyxZQUNVLFFBQTRCLEVBQzVCLFFBQW9CLEVBQ3BCLE9BQXlCLEVBQ3pCLFNBQW1CO1FBSG5CLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLGFBQVEsR0FBUixRQUFR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QUM5QixpREFBZ0I7Ozs7O0lBQ2hCLDREQUEyQjs7Ozs7SUFDM0IsNERBQTJCOztJQWtwQjNCLHNEQWFFOztJQUVGLHFEQU9FOztJQUVGLHVEQUVFOztJQUVGLHlEQXVCRTs7SUFFRix3REFRRTs7SUFFRiwwREFFRTs7Ozs7SUFFRixxREE0Q0U7Ozs7O0lBRUYscURBRUU7Ozs7O0lBRUYsd0RBWUU7Ozs7O0lBRUYsd0RBWUU7Ozs7O0lBOXhCQSxrREFBb0M7Ozs7O0lBQ3BDLGtEQUE0Qjs7Ozs7SUFDNUIsaURBQWlDOzs7OztJQUNqQyxtREFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyLCBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QsIGV2ZW50IGFzIGQzX2V2ZW50IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IHNjYWxlT3JkaW5hbCBhcyBkM19zY2FsZU9yZGluYWwsIHNjYWxlQmFuZCBhcyBkM19zY2FsZUJhbmQsIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgbWF4IGFzIGQzX21heCB9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7IGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSwgYXhpc0xlZnQgYXMgZDNfYXhpc0xlZnQgfSBmcm9tICdkMy1heGlzJztcbmltcG9ydCB7IHZhbHVlcyBhcyBkM192YWx1ZXMgfSBmcm9tICdkMy1jb2xsZWN0aW9uJztcbmltcG9ydCB7IGlzb1BhcnNlIGFzIGQzX2lzb1BhcnNlIH0gZnJvbSAnZDMtdGltZS1mb3JtYXQnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhckdyb3VwZWQgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1iYXItZ3JvdXBlZCcsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1iYXItZ3JvdXBlZCcpXG4gIGdyb3VwZWRCYXJDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogQXJyYXk8UGJkc0RhdGF2aXpCYXJHcm91cGVkPjtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwNjtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDA7XG5cbiAgQElucHV0KClcbiAgdmVydGljYWwgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVYQXhpcyA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzTWF4QnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGlja3MgPSA1O1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVZQXhpcyA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWF4QnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzVGlja3MgPSA1O1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDEwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gdGhpcy52ZXJ0aWNhbCA/IDAgOiA1NTtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAzMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gNTU7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMTA1ICsgMjg7IC8vIGhhcmRjb2RlZCBsZWdlbmQgd2lkdGggKyBsZWZ0IG1hcmdpbiwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbGVnZW5kUG9zaXRpb246ICdyaWdodCcgfCAnYm90dG9tJyA9ICdyaWdodCc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBoaWRlVG9vbHRpcCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgc2hvd0dyaWQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0aGVtZTogJ2NsYXNzaWMnIHwgJ3N1bnNldCcgfCAnb2NlYW4nIHwgJ3R3aWxpZ2h0JyA9ICdjbGFzc2ljJztcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGJhclNjYWxlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSB4QXhpc01heDtcbiAgcHJpdmF0ZSB4QXhpc1NjYWxlO1xuICBwcml2YXRlIHhBeGlzQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpcztcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgaGlkZVhBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgeEdyaWQ7XG4gIHByaXZhdGUgeEdyaWRDYWxsO1xuICBwcml2YXRlIHlBeGlzTWF4O1xuICBwcml2YXRlIHlBeGlzU2NhbGU7XG4gIHByaXZhdGUgeUF4aXNDYWxsO1xuICBwcml2YXRlIHlBeGlzO1xuICBwcml2YXRlIHlBeGlzRm9ybWF0O1xuICBwcml2YXRlIHlBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSB5R3JpZDtcbiAgcHJpdmF0ZSB5R3JpZENhbGw7XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgaGlkZUdyYXlCYXJzOiBib29sZWFuO1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBMYWJlbEZvcm1hdDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIsXG4gICAgcHJpdmF0ZSBfbG9jYXRpb246IExvY2F0aW9uXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFR5cGUsIHRoaXMueEF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMueUF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueUF4aXNGb3JtYXRUeXBlLCB0aGlzLnlBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSwgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGRlZmF1bHRzIGZvciBhbGwgY2hhcnQgdHlwZXNcbiAgICB0aGlzLmhpZGVHcmF5QmFycyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnhBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgdGhpcy5oaWRlWUF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICB0aGlzLnlBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyID0gMDtcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgICByZXR1cm4gK3RoaXMud2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cigndmlld0JveCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgICByZXR1cm4gYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aH0gJHsrdGhpcy5oZWlnaHQgK1xuICAgICAgICAgICAgdGhpcy5tYXJnaW4udG9wICtcbiAgICAgICAgICAgIHRoaXMubWFyZ2luLmJvdHRvbX1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0fSAkeyt0aGlzXG4gICAgICAgICAgICAuaGVpZ2h0ICtcbiAgICAgICAgICAgIHRoaXMubWFyZ2luLnRvcCArXG4gICAgICAgICAgICB0aGlzLm1hcmdpbi5ib3R0b219YDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAvLyBUT09MVElQXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBkM19zZWxlY3QoJ2JvZHknKVxuICAgICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudmVydGljYWwgPyAncGJkcy10b29sdGlwIHNvdXRoJyA6ICdwYmRzLXRvb2x0aXAgd2VzdCc7XG4gICAgICAgIH0pXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuICAgIH1cblxuICAgIC8vIGFkZCBsZWdlbmQgY2xhc3Nlc1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xuICAgIH1cblxuICAgIC8vIGJ1aWxkIGNvbG9yIHJhbmdlc1xuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpLnJhbmdlKFxuICAgICAgdGhpcy5fZGF0YXZpei5jcmVhdGVHcmFkaWVudERlZnModGhpcy5zdmcsIGZhbHNlLCB0aGlzLnRoZW1lLCB0aGlzLnZlcnRpY2FsKVxuICAgICk7XG5cbiAgICBpZiAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgLy8gWCBBWElTXG4gICAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUJhbmQoKVxuICAgICAgICAuZG9tYWluKHRoaXMuZGF0YS5tYXAoZCA9PiBkLmtleSkpXG4gICAgICAgIC5yYW5nZVJvdW5kKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdF0pXG4gICAgICAgIC5hbGlnbigwKTtcblxuICAgICAgLy8gYWRkIHBhZGRpbmcgdG8gdGhlIHNjYWxlIGZvciBncmF5IGJhcnNcbiAgICAgICF0aGlzLmhpZGVHcmF5QmFyc1xuICAgICAgICA/IHRoaXMueEF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMC4xKS5wYWRkaW5nT3V0ZXIoMClcbiAgICAgICAgOiB0aGlzLnhBeGlzU2NhbGUucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKTtcblxuICAgICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy54QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1RpY2tzKVxuICAgICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAgIC8vIFggR1JJRExJTkVTXG4gICAgICAvLyBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICAvLyAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpLnRpY2tTaXplKC10aGlzLmhlaWdodCk7XG5cbiAgICAgIC8vICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAvLyAgICAgLmFwcGVuZCgnZycpXG4gICAgICAvLyAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcbiAgICAgIC8vICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgIC8vICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgLy8gICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gWSBBWElTXG4gICAgICB0aGlzLnlBeGlzTWF4ID0gZDNfbWF4KHRoaXMuZGF0YSwgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBjbG9uZSA9IHsgLi4uZGF0YSB9O1xuICAgICAgICBkZWxldGUgY2xvbmUua2V5O1xuXG4gICAgICAgIHJldHVybiBkM19tYXgoZDNfdmFsdWVzKGNsb25lKSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy55QXhpc01heCA9IHRoaXMueUF4aXNNYXggKyB0aGlzLnlBeGlzTWF4ICogdGhpcy55QXhpc01heEJ1ZmZlcjtcblxuICAgICAgdGhpcy55QXhpc1NjYWxlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgICAuZG9tYWluKFswLCB0aGlzLnlBeGlzTWF4XSlcbiAgICAgICAgLm5pY2UoKVxuICAgICAgICAucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKTtcblxuICAgICAgdGhpcy55QXhpc0NhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAgIC50aWNrU2l6ZSh0aGlzLnlBeGlzVGlja1NpemUpXG4gICAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgICAudGlja0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0dGVyKTtcblxuICAgICAgdGhpcy55QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXknKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpcylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc0RvbWFpbilcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXNUaWNrcylcbiAgICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgICAvLyBZIEdSSURMSU5FU1xuICAgICAgaWYgKHRoaXMuc2hvd0dyaWQpIHtcbiAgICAgICAgdGhpcy55R3JpZENhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgICAgICAudGlja1NpemUoLXRoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHQpO1xuXG4gICAgICAgIHRoaXMueUdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteScpXG4gICAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgMClgKVxuICAgICAgICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICAgIH1cblxuICAgICAgLy8gY29sb3IgYmFyIHNjYWxlXG4gICAgICB0aGlzLmJhclNjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgICAgLmRvbWFpbihPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLnNsaWNlKDEpKVxuICAgICAgICAucmFuZ2VSb3VuZChbMCwgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpXSlcbiAgICAgICAgLnBhZGRpbmdJbm5lcigwLjIpXG4gICAgICAgIC5wYWRkaW5nT3V0ZXIoMC41KTtcblxuICAgICAgdGhpcy51cGRhdGVDaGFydFZlcnRpY2FsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFggQVhJU1xuICAgICAgdGhpcy54QXhpc01heCA9IGQzX21heCh0aGlzLmRhdGEsIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB7IC4uLmRhdGEgfTtcbiAgICAgICAgZGVsZXRlIGNsb25lLmtleTtcbiAgICAgICAgcmV0dXJuIGQzX21heChkM192YWx1ZXMoY2xvbmUpKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnhBeGlzTWF4ID0gdGhpcy54QXhpc01heCArIHRoaXMueEF4aXNNYXggKiB0aGlzLnhBeGlzTWF4QnVmZmVyO1xuXG4gICAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAgIC5kb21haW4oWzAsIHRoaXMueEF4aXNNYXhdKVxuICAgICAgICAucmFuZ2VSb3VuZChbMCwgdGhpcy53aWR0aF0pXG4gICAgICAgIC5uaWNlKCk7XG5cbiAgICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrcyh0aGlzLnhBeGlzVGlja3MpXG4gICAgICAgIC50aWNrU2l6ZSh0aGlzLnhBeGlzVGlja1NpemUpXG4gICAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgICAudGlja0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0dGVyKTtcblxuICAgICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXgnKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpcylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc0RvbWFpbilcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXNUaWNrcylcbiAgICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgICAvLyBZIEFYSVNcbiAgICAgIHRoaXMueUF4aXNTY2FsZSA9IGQzX3NjYWxlQmFuZCgpXG4gICAgICAgIC5kb21haW4odGhpcy5kYXRhLm1hcChkID0+IGQua2V5KSlcbiAgICAgICAgLnJhbmdlUm91bmQoWzAsIHRoaXMuaGVpZ2h0XSlcbiAgICAgICAgLmFsaWduKDEpO1xuXG4gICAgICAvLyBhZGQgcGFkZGluZyB0byB0aGUgc2NhbGUgZm9yIGdyYXkgYmFyc1xuICAgICAgIXRoaXMuaGlkZUdyYXlCYXJzXG4gICAgICAgID8gdGhpcy55QXhpc1NjYWxlLnBhZGRpbmdJbm5lcigwLjEpLnBhZGRpbmdPdXRlcigwKVxuICAgICAgICA6IHRoaXMueUF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMCkucGFkZGluZ091dGVyKDApO1xuXG4gICAgICB0aGlzLnlBeGlzQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgICAgLnRpY2tTaXplKHRoaXMueUF4aXNUaWNrU2l6ZSlcbiAgICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy55QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAgIC50aWNrRm9ybWF0KHRoaXMueUF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgICB0aGlzLnlBeGlzID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteScpXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzRG9tYWluKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1RpY2tzKVxuICAgICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAgIC8vIFggR1JJRExJTkVTXG4gICAgICBpZiAodGhpcy5zaG93R3JpZCkge1xuICAgICAgICB0aGlzLnhHcmlkQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKS50aWNrU2l6ZSgtdGhpcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLnhHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXgnKVxuICAgICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgICAgfVxuXG4gICAgICAvLyBZIEdSSURMSU5FU1xuICAgICAgLy8gaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgLy8gICB0aGlzLnlHcmlkQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgIC8vICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgLy8gICAgIC50aWNrU2l6ZSgtdGhpcy53aWR0aCk7XG5cbiAgICAgIC8vICAgdGhpcy55R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAvLyAgICAgLmFwcGVuZCgnZycpXG4gICAgICAvLyAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC15JylcbiAgICAgIC8vICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcbiAgICAgIC8vICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAwKWApXG4gICAgICAvLyAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgICAgLy8gfVxuXG4gICAgICAvLyBjb2xvciBiYXIgc2NhbGVcbiAgICAgIHRoaXMuYmFyU2NhbGUgPSBkM19zY2FsZUJhbmQoKVxuICAgICAgICAuZG9tYWluKE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuc2xpY2UoMSkpXG4gICAgICAgIC5yYW5nZVJvdW5kKFt0aGlzLnlBeGlzU2NhbGUuYmFuZHdpZHRoKCksIDBdKVxuICAgICAgICAucGFkZGluZ0lubmVyKDAuMilcbiAgICAgICAgLnBhZGRpbmdPdXRlcigwLjUpO1xuXG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0SG9yaXpvbnRhbCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ2hhcnRWZXJ0aWNhbCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGVDaGFydEhvcml6b250YWwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVDaGFydFZlcnRpY2FsKCkge1xuICAgIC8vIHVwZGF0ZSB0aGUgeFNjYWxlXG4gICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbih0aGlzLmRhdGEubWFwKGQgPT4gZC5rZXkpKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgeVNjYWxlXG4gICAgdGhpcy55QXhpc01heCA9IGQzX21heCh0aGlzLmRhdGEsIChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGNsb25lID0geyAuLi5kYXRhIH07XG4gICAgICBkZWxldGUgY2xvbmUua2V5O1xuXG4gICAgICByZXR1cm4gZDNfbWF4KGQzX3ZhbHVlcyhjbG9uZSkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy55QXhpc01heCA9IHRoaXMueUF4aXNNYXggKyB0aGlzLnlBeGlzTWF4ICogdGhpcy55QXhpc01heEJ1ZmZlcjtcblxuICAgIHRoaXMueUF4aXNTY2FsZVxuICAgICAgLmRvbWFpbihbMCwgdGhpcy55QXhpc01heF0pXG4gICAgICAucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKVxuICAgICAgLm5pY2UoKTtcblxuICAgIHRoaXMueEF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgdGhpcy55QXhpc1xuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIGdyaWRzXG4gICAgLy8gaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgIC8vICAgdGhpcy54R3JpZFxuICAgIC8vICAgICAudHJhbnNpdGlvbigpXG4gICAgLy8gICAgIC5kdXJhdGlvbigxMDAwKVxuICAgIC8vICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgLy8gfVxuXG4gICAgaWYgKHRoaXMuc2hvd0dyaWQpIHtcbiAgICAgIHRoaXMueUdyaWRcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0aGUgY29sb3IgYmFyIHNjYWxlXG4gICAgdGhpcy5iYXJTY2FsZS5kb21haW4oT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5zbGljZSgxKSkucmFuZ2VSb3VuZChbMCwgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpXSk7XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgnLmdyYXktYmFyJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICBlbnRlciA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmF5LWJhcicpXG4gICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcbiAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpLFxuICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXG4gICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxuICAgICAgKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICBlbnRlciA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXItZ3JvdXAnKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7dGhpcy54QXhpc1NjYWxlKGQua2V5KX0sIDApYDtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7dGhpcy54QXhpc1NjYWxlKGQua2V5KX0sIDApYDtcbiAgICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YSgoZCwgaSkgPT4ge1xuICAgICAgICBjb25zdCBjbG9uZSA9IHsgLi4uZCB9O1xuICAgICAgICBkZWxldGUgY2xvbmUua2V5O1xuXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhjbG9uZSk7XG5cbiAgICAgICAgY29uc3Qga2V5RGF0YSA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHJldHVybiB7IGxhYmVsOiBrZXksIHZhbHVlOiBkW2tleV0sIHBhcmVudEluZGV4OiBpIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBrZXlEYXRhO1xuICAgICAgfSlcbiAgICAgIC5qb2luKFxuICAgICAgICBlbnRlciA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXInKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBkID0+IGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wYXRoKCl9I2dyYWRpZW50LSR7dGhpcy5jb2xvclJhbmdlKGQubGFiZWwpLnN1YnN0cigxKX0pYClcbiAgICAgICAgICAgIC5hdHRyKCdkYXRhLWNvbG9yJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG4gICAgICAgICAgICAuYXR0cignZGF0YS1wYXJlbnQtaW5kZXgnLCBkID0+IGQucGFyZW50SW5kZXgpXG4gICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy5iYXJTY2FsZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMuYmFyU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAuYXR0cigneScsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAuY2FsbChlbnRlciA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBlbnRlclxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDApIC8vIDUwMFxuICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IHRoaXMuaGVpZ2h0IC0gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLmJhclNjYWxlKGQubGFiZWwpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5iYXJTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IHRoaXMuaGVpZ2h0IC0gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgIGV4aXQgPT5cbiAgICAgICAgICBleGl0XG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMCkgLy8gMTAwXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgICAgICAgIC5hdHRyKCd5JywgdGhpcy5oZWlnaHQpXG4gICAgICApXG4gICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgLm9uKCdtb3VzZW91dCcsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VPdXQoKSlcbiAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuXG4gICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcblxuICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmF4aXMnKS5yYWlzZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnRIb3Jpem9udGFsKCkge1xuICAgIC8vIHVwZGF0ZSB0aGUgeFNjYWxlXG4gICAgdGhpcy54QXhpc01heCA9IGQzX21heCh0aGlzLmRhdGEsIChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGNsb25lID0geyAuLi5kYXRhIH07XG4gICAgICBkZWxldGUgY2xvbmUua2V5O1xuICAgICAgcmV0dXJuIGQzX21heChkM192YWx1ZXMoY2xvbmUpKTtcbiAgICB9KTtcblxuICAgIHRoaXMueEF4aXNNYXggPSB0aGlzLnhBeGlzTWF4ICsgdGhpcy54QXhpc01heCAqIHRoaXMueEF4aXNNYXhCdWZmZXI7XG5cbiAgICB0aGlzLnhBeGlzU2NhbGVcbiAgICAgIC5kb21haW4oWzAsIHRoaXMueEF4aXNNYXhdKVxuICAgICAgLnJhbmdlUm91bmQoWzAsIHRoaXMud2lkdGhdKVxuICAgICAgLm5pY2UoKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgeVNjYWxlXG4gICAgdGhpcy55QXhpc1NjYWxlLmRvbWFpbih0aGlzLmRhdGEubWFwKGQgPT4gZC5rZXkpKTtcblxuICAgIHRoaXMueEF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgdGhpcy55QXhpc1xuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIGdyaWRzXG4gICAgaWYgKHRoaXMuc2hvd0dyaWQpIHtcbiAgICAgIHRoaXMueEdyaWRcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIH1cblxuICAgIC8vIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcbiAgICAvLyAgIHRoaXMueUdyaWRcbiAgICAvLyAgICAgLnRyYW5zaXRpb24oKVxuICAgIC8vICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAvLyAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgIC8vIH1cblxuICAgIC8vIHVwZGF0ZSB0aGUgY29sb3IgYmFyIHNjYWxlXG4gICAgdGhpcy5iYXJTY2FsZS5kb21haW4oT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5zbGljZSgxKSkucmFuZ2VSb3VuZChbMCwgdGhpcy55QXhpc1NjYWxlLmJhbmR3aWR0aCgpXSk7XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgnLmdyYXktYmFyJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICBlbnRlciA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmF5LWJhcicpXG4gICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQua2V5KSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy55QXhpc1NjYWxlLmJhbmR3aWR0aCgpKSxcbiAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZC5rZXkpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLnlBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICApO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jhci1ncm91cCcpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoMCwgJHt0aGlzLnlBeGlzU2NhbGUoZC5rZXkpfSlgO1xuICAgICAgICAgICAgfSksXG4gICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoMCwgJHt0aGlzLnlBeGlzU2NhbGUoZC5rZXkpfSlgO1xuICAgICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKChkLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGNsb25lID0geyAuLi5kIH07XG4gICAgICAgIGRlbGV0ZSBjbG9uZS5rZXk7XG5cbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGNsb25lKTtcblxuICAgICAgICBjb25zdCBrZXlEYXRhID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHsgbGFiZWw6IGtleSwgdmFsdWU6IGRba2V5XSwgcGFyZW50SW5kZXg6IGkgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGtleURhdGE7XG4gICAgICB9KVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gICAgICAgICAgICAuYXR0cihcbiAgICAgICAgICAgICAgJ2ZpbGwnLFxuICAgICAgICAgICAgICBkID0+IGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wYXRoKCl9I2dyYWRpZW50LWhvcml6b250YWwtJHt0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkuc3Vic3RyKDEpfSlgXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYXR0cignZGF0YS1jb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtcGFyZW50LWluZGV4JywgZCA9PiBkLnBhcmVudEluZGV4KVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMClcbiAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLmJhclNjYWxlKGQubGFiZWwpKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuYmFyU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAuY2FsbChlbnRlciA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBlbnRlclxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDApIC8vIDUwMFxuICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmJhclNjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMuYmFyU2NhbGUoZC5sYWJlbCkpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICBleGl0ID0+XG4gICAgICAgICAgZXhpdFxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDApIC8vIDEwMFxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMClcbiAgICAgIClcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZU91dCgpKVxuICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG5cbiAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xuXG4gICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcuYXhpcycpLnJhaXNlKCk7XG4gIH1cblxuICB1cGRhdGVMZWdlbmQoKSB7XG4gICAgLy8gbGVnZW5kXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIGNvbnN0IGxlZ2VuZERhdGEgPSB7IC4uLnRoaXMuZGF0YVswXSB9O1xuICAgICAgZGVsZXRlIGxlZ2VuZERhdGEua2V5O1xuICAgICAgY29uc3QgbGVnZW5kS2V5cyA9IE9iamVjdC5rZXlzKGxlZ2VuZERhdGEpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHsgbGFiZWw6IGtleSB9O1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY2hhcnRcbiAgICAgICAgLnNlbGVjdCgnLmxlZ2VuZCcpXG4gICAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAgIC5kYXRhKGxlZ2VuZEtleXMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZW50ZXIuYXBwZW5kKCdsaScpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJyk7XG5cbiAgICAgICAgICAgIGxpLmluc2VydCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpO1xuXG4gICAgICAgICAgICBsaS5pbnNlcnQoJ3NwYW4nLCAnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgICAgICAgIC5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdXBkYXRlID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubGVnZW5kTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4gdGhpcy5sZWdlbmRNb3VzZU91dCgpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5sZWdlbmRNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcbiAgICB9XG4gIH1cblxuICBiYXJNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSBkM19zZWxlY3Qobm9kZXNbaW5kZXhdKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIG5vZGUuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSkuc3R5bGUoJ2ZpbGwnLCBub2RlLmF0dHIoJ2RhdGEtY29sb3InKSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTaG93KGRhdGEsIG5vZGVzW2luZGV4XSk7XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGJhck1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBudWxsKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBiYXJNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIGNvbnN0IGJhciA9IHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIG51bGwpO1xuXG4gICAgY29uc3QgYmFyQ29sb3IgPSBiYXIuYXR0cignZGF0YS1jb2xvcicpO1xuXG4gICAgYmFyLnN0eWxlKCdmaWxsJywgKCkgPT4gYmFyQ29sb3IpO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBudWxsKTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZGF0YSwgbm9kZSkgPT4ge1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIGxldCBsYWJlbDtcblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBsYWJlbCA9IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGRhdGEubGFiZWwpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkYXRhLmxhYmVsKTtcbiAgICAgICAgbGFiZWwgPSB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxhYmVsID0gZGF0YS5sYWJlbDtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9XG4gICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICA/IGA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZVwiPiR7ZGF0YS52YWx1ZX08L2Rpdj5gXG4gICAgICAgIDogYDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlXCI+JHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX08L2Rpdj5gO1xuXG4gICAgdGhpcy50b29sdGlwLmh0bWwoXG4gICAgICBgXG4gICAgICAgICR7bGFiZWx9XG4gICAgICAgICR7dmFsdWV9XG4gICAgICBgXG4gICAgKTtcblxuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRXaWR0aCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldFdpZHRoIC8gMjtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHRvb2x0aXBUaXBTaXplID0gODtcblxuICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAkeytzY3JvbGxbMV0gKyArZGltZW5zaW9ucy50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC0gdG9vbHRpcFRpcFNpemV9cHhgKTtcbiAgICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAkeytzY3JvbGxbMF0gKyArZGltZW5zaW9ucy5sZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRoICsgK2RpbWVuc2lvbnMud2lkdGggLyAyfXB4YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7K3Njcm9sbFsxXSArICtkaW1lbnNpb25zLnRvcCArICtkaW1lbnNpb25zLmhlaWdodCAvIDIgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC8gMn1weGApO1xuICAgICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSArICtkaW1lbnNpb25zLnJpZ2h0ICsgdG9vbHRpcFRpcFNpemV9cHhgKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSBpdGVtID0+IHtcbiAgICBzd2l0Y2ggKHRoaXMueEF4aXNGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChpdGVtKTtcblxuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChwYXJzZURhdGUpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIHN3aXRjaCAodGhpcy55QXhpc0Zvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KGl0ZW0pO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
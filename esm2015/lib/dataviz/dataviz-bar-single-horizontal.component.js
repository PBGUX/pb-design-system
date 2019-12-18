/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { select as d3_select, scaleLinear as d3_scaleLinear, scaleOrdinal as d3_scaleOrdinal, format as d3_format, event as d3_event, timeFormat as d3_timeFormat, isoParse as d3_isoParse, sum as d3_sum, axisBottom as d3_axisBottom, easeLinear as d3_easeLinear } from 'd3';
import { PbdsDatavizService } from './dataviz.service';
export class PbdsDatavizBarSingleHorizontalComponent {
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
        (event, data, index, nodes) => {
            /** @type {?} */
            const node = d3_select(nodes[index]);
            this.chart.selectAll('.bar').classed('inactive', true);
            node.classed('inactive', false);
            this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                // debugger;
                return i !== index;
            }))
                .classed('inactive', true);
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
            const percentage = data.value / d3_sum(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => d.value));
            /** @type {?} */
            const comparePercentage = data.compareValue / d3_sum(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => d.compareValue));
            /** @type {?} */
            let tooltipLabel = ``;
            /** @type {?} */
            let tooltipCompareDaterangeMargin = ``;
            /** @type {?} */
            let tooltipCompareDaterange = ``;
            /** @type {?} */
            let tooltipCompareValue = ``;
            /** @type {?} */
            let tooltipDaterangeMargin = ``;
            /** @type {?} */
            let tooltipDaterange = ``;
            /** @type {?} */
            let tooltipValue = `${this.nullValueText}`;
            /** @type {?} */
            let tooltipIndicator = '';
            // tooltip label
            if (!this.isSingleData) {
                this.tooltip.classed('pbds-tooltip-compare', null);
                switch (this.tooltipLabelFormatType) {
                    case 'number':
                        tooltipLabel = this.tooltipLabelFormat(data.label);
                        break;
                    case 'time':
                        /** @type {?} */
                        const parsedTime = d3_isoParse(data.label);
                        tooltipLabel = this.tooltipLabelFormat(parsedTime);
                        break;
                    default:
                        tooltipLabel = data.label;
                }
            }
            // tooltip compare daterange
            if (this.isCompare && data.compareStartDate && data.compareEndDate) {
                this.tooltip.classed('pbds-tooltip-compare', this.isCompare);
                tooltipCompareDaterangeMargin = `mt-2`;
                tooltipCompareDaterange = `${this.tooltipDateFormat(d3_isoParse(data.compareStartDate))} - ${this.tooltipDateFormat(d3_isoParse(data.compareEndDate))}`;
            }
            // tooltip compare value
            if (this.percentage && this.isCompare && data.compareValue) {
                tooltipCompareValue =
                    this.tooltipValueFormat === null
                        ? `${this.tooltipPercentFormat(comparePercentage)} (${data.comparveValue}${this.tooltipValueSuffix})`
                        : `${this.tooltipPercentFormat(comparePercentage)} (${this.tooltipValueFormat(data.compareValue)}${this.tooltipValueSuffix})`;
            }
            else if (this.isCompare && data.compareValue !== null) {
                tooltipCompareValue =
                    this.tooltipValueFormat === null
                        ? `${data.compareValue}${this.tooltipValueSuffix} (${this.tooltipPercentFormat(comparePercentage)})`
                        : `${this.tooltipValueFormat(data.compareValue)}${this.tooltipValueSuffix} (${this.tooltipPercentFormat(comparePercentage)})`;
            }
            else if (this.isCompare && data.compareValue === null) {
                tooltipCompareValue = `${this.nullValueText}`;
            }
            // tooltip daterange
            if (data.startDate && data.endDate) {
                tooltipDaterange = `${this.tooltipDateFormat(d3_isoParse(data.startDate))} - ${this.tooltipDateFormat(d3_isoParse(data.endDate))}`;
            }
            //tooltip daterange margin
            if (tooltipLabel !== '') {
                tooltipDaterangeMargin = `mt-2`;
            }
            // tooltip value
            if (this.isSingleData && this.percentage && data.value) {
                tooltipValue = this.tooltipValueFormat === null ? `${data.value}` : `${this.tooltipValueFormat(data.value)}`;
            }
            else if (this.isSingleData && data.value !== null) {
                tooltipValue =
                    this.tooltipValueFormat === null
                        ? `${data.value}${this.tooltipValueSuffix}`
                        : `${this.tooltipValueFormat(data.value)}${this.tooltipValueSuffix}`;
            }
            else if (!this.isSingleData && this.percentage && data.value !== null) {
                tooltipValue =
                    this.tooltipValueFormat === null
                        ? `${this.tooltipPercentFormat(percentage)} (${data.value}${this.tooltipValueSuffix})`
                        : `${this.tooltipPercentFormat(percentage)} (${this.tooltipValueFormat(data.value)}${this.tooltipValueSuffix})`;
            }
            else if (!this.isSingleData && data.value !== null) {
                tooltipValue =
                    this.tooltipValueFormat === null
                        ? `${data.value}${this.tooltipValueSuffix} (${this.tooltipPercentFormat(percentage)})`
                        : `${this.tooltipValueFormat(data.value)}${this.tooltipValueSuffix} (${this.tooltipPercentFormat(percentage)})`;
            }
            // tooltip metric indicator
            if (!this.isSingleData && this.isCompare && data.value !== null && data.compareValue !== null) {
                tooltipIndicator = `<div class="metric-block-indicator ${data.compareChangeDirection} ${data.compareChangeInverse ? 'inverse' : ''} ml-2"><span>${this.tooltipCompareChangeFormat(data.compareChangeValue)}</span></div>`;
            }
            this.tooltip.html((/**
             * @return {?}
             */
            () => {
                return `
        <div class="tooltip-label font-weight-bold">${tooltipLabel}</div>
        <div class="${tooltipCompareDaterangeMargin}">${tooltipCompareDaterange}</div>
        <div class="tooltip-value font-weight-bold">${tooltipCompareValue}</div>
        <div class="${tooltipDaterangeMargin}">${tooltipDaterange}</div>
        <div class="tooltip-value"><span class="font-weight-bold">${tooltipValue}</span> <span>${tooltipIndicator}</span></div>
      `;
            }));
            /** @type {?} */
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            /** @type {?} */
            const tooltipTipSize = 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight - tooltipTipSize}px`);
            if (this.data.length > 1) {
                this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            }
            else {
                this.tooltip.style('left', `${+scroll[0] - tooltipOffsetWidth + +dimensions.right}px`);
            }
            this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        () => {
            this.tooltip.style('opacity', 0);
        });
        this.legendMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            if (!this.hideLegendTooltip) {
                /** @type {?} */
                const barHover = this.svg
                    .selectAll('.bar')
                    .filter((/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                (d, i) => i === index))
                    .node();
                this.tooltipShow(data, barHover);
            }
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
            this.chart
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .classed('inactive', null);
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
            // hide tooltip for zero/null values
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
        this.xAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        item => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return `${this.xAxisFormat(item)}${this.xAxisTickLabelSuffix}`;
                default:
                    return `${item}${this.xAxisTickLabelSuffix}`;
            }
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
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
        () => {
            return +this.width + this.margin.left + this.margin.right;
        }))
            .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', (/**
         * @return {?}
         */
        () => {
            return `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this
                .height +
                this.margin.top +
                this.margin.bottom +
                this.xAxisTitleMargin}`;
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
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
        }
        // X AXIS
        this.xAxisScale = d3_scaleLinear()
            .domain([0, Math.ceil(d3_sum(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => d.value)))])
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
            .attr('transform', `translate(0, ${this.height})`)
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
                .attr('transform', `translate(0, ${this.height})`)
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
        let colors;
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
    /**
     * @return {?}
     */
    updateChart() {
        this.isSingleData = this.data.length === 1 ? true : false;
        this.isCompare = Object.keys(this.data[0]).includes('compareValue');
        /** @type {?} */
        const sumValues = d3_sum(this.data, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.value));
        /** @type {?} */
        const isLastBarZero = this.data[this.data.length - 1].value === 0 || this.data[this.data.length - 1].value === null ? true : false;
        /** @type {?} */
        let lastBarZeroCount = 0;
        /** @type {?} */
        const cloneData = [...this.data];
        /** @type {?} */
        let isLast = false;
        cloneData.reverse().forEach((/**
         * @param {?} value
         * @param {?} index
         * @param {?} array
         * @return {?}
         */
        (value, index, array) => {
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
            (d, i) => {
                /** @type {?} */
                const format = d3_format('.0%');
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
            (d, i) => {
                /** @type {?} */
                const format = d3_format('.0%');
                return format(i * 0.25);
            }));
        }
        else {
            this.xAxisScale.domain([0, Math.ceil(sumValues)]).range([0, +this.width]);
            this.xGridCall.tickValues(this.xAxisScale.ticks().filter((/**
             * @param {?} n
             * @return {?}
             */
            n => Number.isInteger(n)))); // remove decimal grid values
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
        enter => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('width', 0)
            .attr('height', (/**
         * @return {?}
         */
        () => {
            return this.height - this.barPadding;
        }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        d => {
            if (this.isSingleData) {
                return `url(${this._location.path()}#gradient-horizontal-${this.colorRange(d.label).substr(1)})`;
            }
            else {
                return this.colorRange(d.label);
            }
        }))
            .attr('y', (/**
         * @return {?}
         */
        () => {
            return this.barPadding / 2;
        }))
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return this.data.slice(0, i).reduce((/**
             * @param {?} acc
             * @param {?} item
             * @return {?}
             */
            (acc, item) => {
                // console.log(acc, item, acc + this.xAxisScale(item.value) + this.barMargin);
                return +acc + +this.xAxisScale(item.value);
            }), 1);
        }))
            .attr('pointer-events', 'none')
            .call((/**
         * @param {?} enter
         * @return {?}
         */
        enter => {
            return (enter
                .transition()
                // .duration(0)
                .delay((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i * 250))
                .ease(d3_easeLinear)
                .attr('width', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                // debugger;
                if (i === this.data.length - lastBarZeroCount - 1 && isLastBarZero) {
                    return this.xAxisScale(d.value);
                }
                else if (i !== this.data.length - 1) {
                    /** @type {?} */
                    let width = this.xAxisScale(d.value) - +this.barMargin;
                    width = Math.sign(width) === -1 ? 0 : width; // handle negative values
                    return width;
                }
                else {
                    return this.xAxisScale(d.value);
                }
            }))
                .transition()
                .attr('pointer-events', 'auto'));
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
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            // debugger;
            if (d.value === null || d.value === 0) {
                return this.xAxisScale(0);
            }
            else if (i === this.data.length - 1) {
                return this.xAxisScale(d.value);
            }
            else {
                return this.xAxisScale(d.value) - this.barMargin;
            }
        }))
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return this.data.slice(0, i).reduce((/**
             * @param {?} acc
             * @param {?} item
             * @return {?}
             */
            (acc, item) => {
                return acc + +this.xAxisScale(item.value);
            }), 0);
        }))
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
                const li = enter
                    .append('li')
                    .attr('class', 'legend-item')
                    .classed('align-items-start', this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)))
                    .classed('mt-1', this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-description')
                    .classed('d-flex', this.isCompare)
                    .classed('flex-column', this.isCompare);
                li.select('.legend-description')
                    .insert('span')
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
                li.select('.legend-description')
                    .insert('div')
                    .attr('class', 'legend-change')
                    .classed('d-none', !this.isCompare);
                li.select('.legend-change').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    return `<div class="metric-block-indicator ${d.compareChangeDirection} ${d.compareChangeInverse ? 'inverse' : ''} mt-1"><span>${this.tooltipCompareChangeFormat(d.compareChangeValue)}</span></div>`;
                }));
                return li;
            }), (/**
             * @param {?} update
             * @return {?}
             */
            update => {
                update.classed('align-items-start', this.isCompare);
                update.select('.legend-key').classed('mt-1', this.isCompare);
                update.select('.legend-change').classed('d-none', !this.isCompare);
                if (this.isCompare) {
                    update.select('.legend-change').html((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => {
                        return `<div class="metric-block-indicator ${d.compareChangeDirection} ${d.compareChangeInverse ? 'inverse' : ''} mt-1"><span>${this.tooltipCompareChangeFormat(d.compareChangeValue)}</span></div>`;
                    }));
                }
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
PbdsDatavizBarSingleHorizontalComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar-single-horizontal',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizBarSingleHorizontalComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller },
    { type: Location }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc2luZ2xlLWhvcml6b250YWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotYmFyLXNpbmdsZS1ob3Jpem9udGFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFdBQVcsRUFHWCxNQUFNLEVBQ04sWUFBWSxFQUNaLHVCQUF1QixFQUV4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFN0QsT0FBTyxFQUNMLE1BQU0sSUFBSSxTQUFTLEVBQ25CLFdBQVcsSUFBSSxjQUFjLEVBQzdCLFlBQVksSUFBSSxlQUFlLEVBQy9CLE1BQU0sSUFBSSxTQUFTLEVBQ25CLEtBQUssSUFBSSxRQUFRLEVBQ2pCLFVBQVUsSUFBSSxhQUFhLEVBQzNCLFFBQVEsSUFBSSxXQUFXLEVBQ3ZCLEdBQUcsSUFBSSxNQUFNLEVBQ2IsVUFBVSxJQUFJLGFBQWEsRUFDM0IsVUFBVSxJQUFJLGFBQWEsRUFDNUIsTUFBTSxJQUFJLENBQUM7QUFFWixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQVN2RCxNQUFNLE9BQU8sdUNBQXVDOzs7Ozs7O0lBOElsRCxZQUNVLFFBQTRCLEVBQzVCLFFBQW9CLEVBQ3BCLE9BQXlCLEVBQ3pCLFNBQW1CO1FBSG5CLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLGFBQVEsR0FBUixRQUFRLENBQVk7UUFDcEIsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFDekIsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQWhKN0IsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQiwwQkFBcUIsR0FBRyxJQUFJLENBQUM7UUFNN0IsVUFBSyxHQUFH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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyLCBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7XG4gIHNlbGVjdCBhcyBkM19zZWxlY3QsXG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsLFxuICBmb3JtYXQgYXMgZDNfZm9ybWF0LFxuICBldmVudCBhcyBkM19ldmVudCxcbiAgdGltZUZvcm1hdCBhcyBkM190aW1lRm9ybWF0LFxuICBpc29QYXJzZSBhcyBkM19pc29QYXJzZSxcbiAgc3VtIGFzIGQzX3N1bSxcbiAgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLFxuICBlYXNlTGluZWFyIGFzIGQzX2Vhc2VMaW5lYXJcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhclNpbmdsZUhvcml6b250YWwsIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBhcmUgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1iYXItc2luZ2xlLWhvcml6b250YWwnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtYmFyLXNpbmdsZS1ob3Jpem9udGFsJylcbiAgc2luZ2xlU3RhY2tlZEJhckNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpekJhclNpbmdsZUhvcml6b250YWwgfCBQYmRzRGF0YXZpekJhclNpbmdsZUhvcml6b250YWxDb21wYXJlPjtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwMDtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDtcblxuICBASW5wdXQoKVxuICBudWxsVmFsdWVUZXh0ID0gJ05vIGRhdGEgYXZhaWxhYmxlJztcblxuICBASW5wdXQoKVxuICBwZXJjZW50YWdlID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luVG9wID0gMTA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAyMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAzNTtcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gMTU7XG5cbiAgQElucHV0KClcbiAgYmFyTWFyZ2luID0gMjtcblxuICBASW5wdXQoKVxuICBoaWRlWEF4aXMgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB4QXhpc1RpY2tzID0gNjtcblxuICBASW5wdXQoKVxuICB4QXhpc1RpdGxlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGlja0xhYmVsU3VmZml4ID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGlkZVhHcmlkID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmRUb29sdGlwID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDEwNSArIDI4OyAvLyBoYXJkY29kZWQgbGVnZW5kIHdpZHRoICsgbGVmdCBtYXJnaW4sIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFBvc2l0aW9uOiAncmlnaHQnIHwgJ2JvdHRvbScgPSAnYm90dG9tJztcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBEYXRlRm9ybWF0U3RyaW5nID0gJyViICVlLCAlWSc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZVN1ZmZpeCA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBQZXJjZW50Rm9ybWF0U3RyaW5nID0gJy4yJSc7XG5cbiAgQElucHV0KClcbiAgY29tcGFyZUNoYW5nZUZvcm1hdFN0cmluZyA9ICcuMiUnO1xuXG4gIEBJbnB1dCgpXG4gIG1vbm9jaHJvbWUgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0aGVtZTogJ2NsYXNzaWMnIHwgJ29jZWFuJyB8ICdzdW5zZXQnIHwgJ3R3aWxpZ2h0JztcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGlzU2luZ2xlRGF0YSA9IGZhbHNlO1xuICBwcml2YXRlIGlzQ29tcGFyZSA9IGZhbHNlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBiYXJQYWRkaW5nID0gNDA7XG4gIHByaXZhdGUgeEF4aXNDYWxsO1xuICBwcml2YXRlIHhBeGlzO1xuICBwcml2YXRlIHhBeGlzU2NhbGU7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xuICBwcml2YXRlIHhBeGlzVGl0bGVNYXJnaW46IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSB4R3JpZDtcbiAgcHJpdmF0ZSB4R3JpZENhbGw7XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBEYXRlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBQZXJjZW50Rm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcixcbiAgICBwcml2YXRlIF9sb2NhdGlvbjogTG9jYXRpb25cbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gK3RoaXMuaGVpZ2h0ICsgdGhpcy5iYXJQYWRkaW5nO1xuXG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICB0aGlzLmlzU2luZ2xlRGF0YSA9IHRoaXMuZGF0YS5sZW5ndGggPT09IDEgPyB0cnVlIDogZmFsc2U7XG4gICAgdGhpcy5pc0NvbXBhcmUgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLmluY2x1ZGVzKCdjb21wYXJlVmFsdWUnKTtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFR5cGUsIHRoaXMueEF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwRGF0ZUZvcm1hdCA9IGQzX3RpbWVGb3JtYXQodGhpcy50b29sdGlwRGF0ZUZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwUGVyY2VudEZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMuY29tcGFyZUNoYW5nZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXG4gICAgdGhpcy5oaWRlWEF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSB0cnVlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuICAgIHRoaXMueEF4aXNUaXRsZU1hcmdpbiA9IHRoaXMueEF4aXNUaXRsZSA/IDIwIDogMDtcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICgpID0+IHtcbiAgICAgICAgcmV0dXJuICt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgICAgfSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20gKyB0aGlzLnhBeGlzVGl0bGVNYXJnaW4pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0fSAkeyt0aGlzXG4gICAgICAgICAgLmhlaWdodCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4udG9wICtcbiAgICAgICAgICB0aGlzLm1hcmdpbi5ib3R0b20gK1xuICAgICAgICAgIHRoaXMueEF4aXNUaXRsZU1hcmdpbn1gO1xuICAgICAgfSk7XG5cbiAgICAvLyBUT09MVElQXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBkM19zZWxlY3QoJ2JvZHknKVxuICAgICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAncGJkcy10b29sdGlwIHNvdXRoJylcbiAgICAgICAgLmNsYXNzZWQoJ3BiZHMtdG9vbHRpcC1jb21wYXJlJywgdGhpcy5pc0NvbXBhcmUpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuICAgIH1cblxuICAgIC8vIGFkZCBsZWdlbmQgY2xhc3Nlc1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMuZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xuICAgIH1cblxuICAgIC8vIFggQVhJU1xuICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIE1hdGguY2VpbChkM19zdW0odGhpcy5kYXRhLCAoZDogYW55KSA9PiBkLnZhbHVlKSldKVxuICAgICAgLnJhbmdlKFswLCArdGhpcy53aWR0aF0pO1xuXG4gICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgIC8vIC50aWNrVmFsdWVzKFswLCBkM19zdW0odGhpcy5kYXRhLCAoZDogYW55KSA9PiBkLnZhbHVlKV0pXG4gICAgICAudGlja3ModGhpcy54QXhpc1RpY2tzKVxuICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy14JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXNUaWNrcyk7XG4gICAgLy8gLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgLy8gWCBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKS50aWNrU2l6ZSgtdGhpcy5oZWlnaHQpO1xuXG4gICAgICB0aGlzLnhHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteCcpXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMueEF4aXNUaXRsZSkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzLXRpdGxlJylcbiAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ2NlbnRlcicpXG4gICAgICAgIC5hdHRyKCd4JywgdGhpcy53aWR0aCAvIDIgLSB0aGlzLm1hcmdpbi5sZWZ0KVxuICAgICAgICAuYXR0cigneScsIHRoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgKCF0aGlzLmhpZGVYQXhpcyA/IDQwIDogMCkpXG4gICAgICAgIC50ZXh0KHRoaXMueEF4aXNUaXRsZSk7XG4gICAgfVxuXG4gICAgLy8gYnVpbGQgY29sb3IgcmFuZ2VzXG4gICAgbGV0IGNvbG9ycztcblxuICAgIGlmICh0aGlzLmlzU2luZ2xlRGF0YSkge1xuICAgICAgY29sb3JzID0gdGhpcy5fZGF0YXZpei5jcmVhdGVHcmFkaWVudERlZnModGhpcy5zdmcsIHRoaXMubW9ub2Nocm9tZSwgdGhpcy50aGVtZSwgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tb25vY2hyb21lKSB7XG4gICAgICBjb2xvcnMgPSB0aGlzLl9kYXRhdml6LmdldENvbG9ycyh0aGlzLm1vbm9jaHJvbWUsIHRoaXMudGhlbWUpLnJldmVyc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sb3JzID0gdGhpcy5fZGF0YXZpei5nZXRDb2xvcnModGhpcy5tb25vY2hyb21lLCB0aGlzLnRoZW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKS5yYW5nZShjb2xvcnMpO1xuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0KCkge1xuICAgIHRoaXMuaXNTaW5nbGVEYXRhID0gdGhpcy5kYXRhLmxlbmd0aCA9PT0gMSA/IHRydWUgOiBmYWxzZTtcbiAgICB0aGlzLmlzQ29tcGFyZSA9IE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuaW5jbHVkZXMoJ2NvbXBhcmVWYWx1ZScpO1xuXG4gICAgY29uc3Qgc3VtVmFsdWVzID0gZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC52YWx1ZSk7XG4gICAgY29uc3QgaXNMYXN0QmFyWmVybyA9XG4gICAgICB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdLnZhbHVlID09PSAwIHx8IHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoIC0gMV0udmFsdWUgPT09IG51bGwgPyB0cnVlIDogZmFsc2U7XG5cbiAgICBsZXQgbGFzdEJhclplcm9Db3VudCA9IDA7XG4gICAgY29uc3QgY2xvbmVEYXRhID0gWy4uLnRoaXMuZGF0YV07XG4gICAgbGV0IGlzTGFzdCA9IGZhbHNlO1xuXG4gICAgY2xvbmVEYXRhLnJldmVyc2UoKS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICBpZiAoKHZhbHVlLnZhbHVlID09PSAwIHx8IHZhbHVlLnZhbHVlID09PSBudWxsKSAmJiAhaXNMYXN0KSB7XG4gICAgICAgIGxhc3RCYXJaZXJvQ291bnQrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzTGFzdCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5wZXJjZW50YWdlICYmICF0aGlzLmlzU2luZ2xlRGF0YSkge1xuICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbihbMCwgc3VtVmFsdWVzXSkucmFuZ2UoWzAsICt0aGlzLndpZHRoXSk7XG4gICAgICB0aGlzLnhBeGlzQ2FsbC50aWNrVmFsdWVzKFswLCBzdW1WYWx1ZXMgKiAwLjI1LCBzdW1WYWx1ZXMgKiAwLjUsIHN1bVZhbHVlcyAqIDAuNzUsIHN1bVZhbHVlc10pO1xuICAgICAgdGhpcy54QXhpcy5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgICAgdGhpcy54R3JpZENhbGwudGlja1ZhbHVlcyhbMCwgc3VtVmFsdWVzICogMC4yNSwgc3VtVmFsdWVzICogMC41LCBzdW1WYWx1ZXMgKiAwLjc1LCBzdW1WYWx1ZXNdKTtcbiAgICAgIHRoaXMueEdyaWQuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG5cbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3QoJy5heGlzLXgnKVxuICAgICAgICAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgLmh0bWwoKGQsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBmb3JtYXQgPSBkM19mb3JtYXQoJy4wJScpO1xuICAgICAgICAgIHJldHVybiBmb3JtYXQoaSAqIDAuMjUpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGVyY2VudGFnZSAmJiB0aGlzLmlzU2luZ2xlRGF0YSkge1xuICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbihbMCwgMS4wXSkucmFuZ2UoWzAsICt0aGlzLndpZHRoXSk7XG4gICAgICB0aGlzLnhBeGlzQ2FsbC50aWNrVmFsdWVzKFswLCAwLjI1LCAwLjUsIDAuNzUsIDEuMF0pO1xuICAgICAgdGhpcy54QXhpcy5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgICAgdGhpcy54R3JpZENhbGwudGlja1ZhbHVlcyhbMCwgMC4yNSwgMC41LCAwLjc1LCAxLjBdKTtcbiAgICAgIHRoaXMueEdyaWQuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG5cbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3QoJy5heGlzLXgnKVxuICAgICAgICAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgLmh0bWwoKGQsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBmb3JtYXQgPSBkM19mb3JtYXQoJy4wJScpO1xuICAgICAgICAgIHJldHVybiBmb3JtYXQoaSAqIDAuMjUpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbihbMCwgTWF0aC5jZWlsKHN1bVZhbHVlcyldKS5yYW5nZShbMCwgK3RoaXMud2lkdGhdKTtcbiAgICAgIHRoaXMueEdyaWRDYWxsLnRpY2tWYWx1ZXModGhpcy54QXhpc1NjYWxlLnRpY2tzKCkuZmlsdGVyKG4gPT4gTnVtYmVyLmlzSW50ZWdlcihuKSkpOyAvLyByZW1vdmUgZGVjaW1hbCBncmlkIHZhbHVlc1xuXG4gICAgICB0aGlzLnhBeGlzXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgICAgLy8gdXBkYXRlIHRoZSBncmlkc1xuICAgICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgICB0aGlzLnhHcmlkXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgLSB0aGlzLmJhclBhZGRpbmc7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBkID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTaW5nbGVEYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wYXRoKCl9I2dyYWRpZW50LWhvcml6b250YWwtJHt0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkuc3Vic3RyKDEpfSlgO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cigneScsICgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFyUGFkZGluZyAvIDI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNsaWNlKDAsIGkpLnJlZHVjZSgoYWNjLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYWNjLCBpdGVtLCBhY2MgKyB0aGlzLnhBeGlzU2NhbGUoaXRlbS52YWx1ZSkgKyB0aGlzLmJhck1hcmdpbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuICthY2MgKyArdGhpcy54QXhpc1NjYWxlKGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuY2FsbChlbnRlciA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC8vIC5kdXJhdGlvbigwKVxuICAgICAgICAgICAgICAgICAgLmRlbGF5KChkLCBpKSA9PiBpICogMjUwKVxuICAgICAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZUxpbmVhcilcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5kYXRhLmxlbmd0aCAtIGxhc3RCYXJaZXJvQ291bnQgLSAxICYmIGlzTGFzdEJhclplcm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgIT09IHRoaXMuZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHdpZHRoID0gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpIC0gK3RoaXMuYmFyTWFyZ2luO1xuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoID0gTWF0aC5zaWduKHdpZHRoKSA9PT0gLTEgPyAwIDogd2lkdGg7IC8vIGhhbmRsZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJylcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgLy8gZGVidWdnZXI7XG4gICAgICAgICAgICAgIGlmIChkLnZhbHVlID09PSBudWxsIHx8IGQudmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKDApO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHRoaXMuZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpIC0gdGhpcy5iYXJNYXJnaW47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2xpY2UoMCwgaSkucmVkdWNlKChhY2MsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjICsgK3RoaXMueEF4aXNTY2FsZShpdGVtLnZhbHVlKTtcbiAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKSxcbiAgICAgICAgZXhpdCA9PlxuICAgICAgICAgIGV4aXRcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC5yZW1vdmUoKVxuICAgICAgKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlT3V0KCkpXG4gICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0XG4gICAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnYWxpZ24taXRlbXMtc3RhcnQnLCB0aGlzLmlzQ29tcGFyZSk7XG5cbiAgICAgICAgICAgIGxpLmluc2VydCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG4gICAgICAgICAgICAgIC5jbGFzc2VkKCdtdC0xJywgdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBsaS5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWRlc2NyaXB0aW9uJylcbiAgICAgICAgICAgICAgLmNsYXNzZWQoJ2QtZmxleCcsIHRoaXMuaXNDb21wYXJlKVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnZmxleC1jb2x1bW4nLCB0aGlzLmlzQ29tcGFyZSk7XG5cbiAgICAgICAgICAgIGxpLnNlbGVjdCgnLmxlZ2VuZC1kZXNjcmlwdGlvbicpXG4gICAgICAgICAgICAgIC5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJylcbiAgICAgICAgICAgICAgLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsaS5zZWxlY3QoJy5sZWdlbmQtZGVzY3JpcHRpb24nKVxuICAgICAgICAgICAgICAuaW5zZXJ0KCdkaXYnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWNoYW5nZScpXG4gICAgICAgICAgICAgIC5jbGFzc2VkKCdkLW5vbmUnLCAhdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBsaS5zZWxlY3QoJy5sZWdlbmQtY2hhbmdlJykuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWluZGljYXRvciAke2QuY29tcGFyZUNoYW5nZURpcmVjdGlvbn0gJHtcbiAgICAgICAgICAgICAgICBkLmNvbXBhcmVDaGFuZ2VJbnZlcnNlID8gJ2ludmVyc2UnIDogJydcbiAgICAgICAgICAgICAgfSBtdC0xXCI+PHNwYW4+JHt0aGlzLnRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0KGQuY29tcGFyZUNoYW5nZVZhbHVlKX08L3NwYW4+PC9kaXY+YDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB1cGRhdGUgPT4ge1xuICAgICAgICAgICAgdXBkYXRlLmNsYXNzZWQoJ2FsaWduLWl0ZW1zLXN0YXJ0JywgdGhpcy5pc0NvbXBhcmUpO1xuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1rZXknKS5jbGFzc2VkKCdtdC0xJywgdGhpcy5pc0NvbXBhcmUpO1xuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1jaGFuZ2UnKS5jbGFzc2VkKCdkLW5vbmUnLCAhdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBhcmUpIHtcbiAgICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1jaGFuZ2UnKS5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1pbmRpY2F0b3IgJHtkLmNvbXBhcmVDaGFuZ2VEaXJlY3Rpb259ICR7XG4gICAgICAgICAgICAgICAgICBkLmNvbXBhcmVDaGFuZ2VJbnZlcnNlID8gJ2ludmVyc2UnIDogJydcbiAgICAgICAgICAgICAgICB9IG10LTFcIj48c3Bhbj4ke3RoaXMudG9vbHRpcENvbXBhcmVDaGFuZ2VGb3JtYXQoZC5jb21wYXJlQ2hhbmdlVmFsdWUpfTwvc3Bhbj48L2Rpdj5gO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1sYWJlbCcpLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5sZWdlbmRNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3V0KCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmxlZ2VuZE1vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuICAgIH1cbiAgfVxuXG4gIGJhck1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IGQzX3NlbGVjdChub2Rlc1tpbmRleF0pO1xuXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXInKS5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgbm9kZS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICByZXR1cm4gaSAhPT0gaW5kZXg7XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTaG93KGRhdGEsIG5vZGVzW2luZGV4XSk7XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGJhck1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBudWxsKTtcblxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBiYXJNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZGF0YSwgbm9kZSkgPT4ge1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuXG4gICAgY29uc3QgcGVyY2VudGFnZSA9IGRhdGEudmFsdWUgLyBkM19zdW0odGhpcy5kYXRhLCAoZDogYW55KSA9PiBkLnZhbHVlKTtcbiAgICBjb25zdCBjb21wYXJlUGVyY2VudGFnZSA9IGRhdGEuY29tcGFyZVZhbHVlIC8gZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC5jb21wYXJlVmFsdWUpO1xuXG4gICAgbGV0IHRvb2x0aXBMYWJlbCA9IGBgO1xuICAgIGxldCB0b29sdGlwQ29tcGFyZURhdGVyYW5nZU1hcmdpbiA9IGBgO1xuICAgIGxldCB0b29sdGlwQ29tcGFyZURhdGVyYW5nZSA9IGBgO1xuICAgIGxldCB0b29sdGlwQ29tcGFyZVZhbHVlID0gYGA7XG4gICAgbGV0IHRvb2x0aXBEYXRlcmFuZ2VNYXJnaW4gPSBgYDtcbiAgICBsZXQgdG9vbHRpcERhdGVyYW5nZSA9IGBgO1xuICAgIGxldCB0b29sdGlwVmFsdWUgPSBgJHt0aGlzLm51bGxWYWx1ZVRleHR9YDtcbiAgICBsZXQgdG9vbHRpcEluZGljYXRvciA9ICcnO1xuXG4gICAgLy8gdG9vbHRpcCBsYWJlbFxuICAgIGlmICghdGhpcy5pc1NpbmdsZURhdGEpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdwYmRzLXRvb2x0aXAtY29tcGFyZScsIG51bGwpO1xuXG4gICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIHRvb2x0aXBMYWJlbCA9IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGRhdGEubGFiZWwpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkYXRhLmxhYmVsKTtcbiAgICAgICAgICB0b29sdGlwTGFiZWwgPSB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRvb2x0aXBMYWJlbCA9IGRhdGEubGFiZWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdG9vbHRpcCBjb21wYXJlIGRhdGVyYW5nZVxuICAgIGlmICh0aGlzLmlzQ29tcGFyZSAmJiBkYXRhLmNvbXBhcmVTdGFydERhdGUgJiYgZGF0YS5jb21wYXJlRW5kRGF0ZSkge1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3BiZHMtdG9vbHRpcC1jb21wYXJlJywgdGhpcy5pc0NvbXBhcmUpO1xuICAgICAgdG9vbHRpcENvbXBhcmVEYXRlcmFuZ2VNYXJnaW4gPSBgbXQtMmA7XG5cbiAgICAgIHRvb2x0aXBDb21wYXJlRGF0ZXJhbmdlID0gYCR7dGhpcy50b29sdGlwRGF0ZUZvcm1hdChcbiAgICAgICAgZDNfaXNvUGFyc2UoZGF0YS5jb21wYXJlU3RhcnREYXRlKVxuICAgICAgKX0gLSAke3RoaXMudG9vbHRpcERhdGVGb3JtYXQoZDNfaXNvUGFyc2UoZGF0YS5jb21wYXJlRW5kRGF0ZSkpfWA7XG4gICAgfVxuXG4gICAgLy8gdG9vbHRpcCBjb21wYXJlIHZhbHVlXG4gICAgaWYgKHRoaXMucGVyY2VudGFnZSAmJiB0aGlzLmlzQ29tcGFyZSAmJiBkYXRhLmNvbXBhcmVWYWx1ZSkge1xuICAgICAgdG9vbHRpcENvbXBhcmVWYWx1ZSA9XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgICAgPyBgJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KGNvbXBhcmVQZXJjZW50YWdlKX0gKCR7ZGF0YS5jb21wYXJ2ZVZhbHVlfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9KWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQoY29tcGFyZVBlcmNlbnRhZ2UpfSAoJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLmNvbXBhcmVWYWx1ZSl9JHtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFZhbHVlU3VmZml4XG4gICAgICAgICAgfSlgO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbXBhcmUgJiYgZGF0YS5jb21wYXJlVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBDb21wYXJlVmFsdWUgPVxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICAgID8gYCR7ZGF0YS5jb21wYXJlVmFsdWV9JHt0aGlzLnRvb2x0aXBWYWx1ZVN1ZmZpeH0gKCR7dGhpcy50b29sdGlwUGVyY2VudEZvcm1hdChjb21wYXJlUGVyY2VudGFnZSl9KWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEuY29tcGFyZVZhbHVlKX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fSAoJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KFxuICAgICAgICAgICAgY29tcGFyZVBlcmNlbnRhZ2VcbiAgICAgICAgICApfSlgO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbXBhcmUgJiYgZGF0YS5jb21wYXJlVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBDb21wYXJlVmFsdWUgPSBgJHt0aGlzLm51bGxWYWx1ZVRleHR9YDtcbiAgICB9XG5cbiAgICAvLyB0b29sdGlwIGRhdGVyYW5nZVxuICAgIGlmIChkYXRhLnN0YXJ0RGF0ZSAmJiBkYXRhLmVuZERhdGUpIHtcbiAgICAgIHRvb2x0aXBEYXRlcmFuZ2UgPSBgJHt0aGlzLnRvb2x0aXBEYXRlRm9ybWF0KGQzX2lzb1BhcnNlKGRhdGEuc3RhcnREYXRlKSl9IC0gJHt0aGlzLnRvb2x0aXBEYXRlRm9ybWF0KFxuICAgICAgICBkM19pc29QYXJzZShkYXRhLmVuZERhdGUpXG4gICAgICApfWA7XG4gICAgfVxuXG4gICAgLy90b29sdGlwIGRhdGVyYW5nZSBtYXJnaW5cbiAgICBpZiAodG9vbHRpcExhYmVsICE9PSAnJykge1xuICAgICAgdG9vbHRpcERhdGVyYW5nZU1hcmdpbiA9IGBtdC0yYDtcbiAgICB9XG5cbiAgICAvLyB0b29sdGlwIHZhbHVlXG4gICAgaWYgKHRoaXMuaXNTaW5nbGVEYXRhICYmIHRoaXMucGVyY2VudGFnZSAmJiBkYXRhLnZhbHVlKSB7XG4gICAgICB0b29sdGlwVmFsdWUgPSB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbCA/IGAke2RhdGEudmFsdWV9YCA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfWA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU2luZ2xlRGF0YSAmJiBkYXRhLnZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0b29sdGlwVmFsdWUgPVxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICAgID8gYCR7ZGF0YS52YWx1ZX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9YDtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2luZ2xlRGF0YSAmJiB0aGlzLnBlcmNlbnRhZ2UgJiYgZGF0YS52YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdG9vbHRpcFZhbHVlID1cbiAgICAgICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPT09IG51bGxcbiAgICAgICAgICA/IGAke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQocGVyY2VudGFnZSl9ICgke2RhdGEudmFsdWV9JHt0aGlzLnRvb2x0aXBWYWx1ZVN1ZmZpeH0pYFxuICAgICAgICAgIDogYCR7dGhpcy50b29sdGlwUGVyY2VudEZvcm1hdChwZXJjZW50YWdlKX0gKCR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS52YWx1ZSl9JHtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFZhbHVlU3VmZml4XG4gICAgICAgICAgfSlgO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaW5nbGVEYXRhICYmIGRhdGEudmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBWYWx1ZSA9XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgICAgPyBgJHtkYXRhLnZhbHVlfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9ICgke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQocGVyY2VudGFnZSl9KWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9ICgke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQoXG4gICAgICAgICAgICBwZXJjZW50YWdlXG4gICAgICAgICAgKX0pYDtcbiAgICB9XG5cbiAgICAvLyB0b29sdGlwIG1ldHJpYyBpbmRpY2F0b3JcbiAgICBpZiAoIXRoaXMuaXNTaW5nbGVEYXRhICYmIHRoaXMuaXNDb21wYXJlICYmIGRhdGEudmFsdWUgIT09IG51bGwgJiYgZGF0YS5jb21wYXJlVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBJbmRpY2F0b3IgPSBgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1pbmRpY2F0b3IgJHtkYXRhLmNvbXBhcmVDaGFuZ2VEaXJlY3Rpb259ICR7XG4gICAgICAgIGRhdGEuY29tcGFyZUNoYW5nZUludmVyc2UgPyAnaW52ZXJzZScgOiAnJ1xuICAgICAgfSBtbC0yXCI+PHNwYW4+JHt0aGlzLnRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0KGRhdGEuY29tcGFyZUNoYW5nZVZhbHVlKX08L3NwYW4+PC9kaXY+YDtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXAuaHRtbCgoKSA9PiB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC1sYWJlbCBmb250LXdlaWdodC1ib2xkXCI+JHt0b29sdGlwTGFiZWx9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCIke3Rvb2x0aXBDb21wYXJlRGF0ZXJhbmdlTWFyZ2lufVwiPiR7dG9vbHRpcENvbXBhcmVEYXRlcmFuZ2V9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlIGZvbnQtd2VpZ2h0LWJvbGRcIj4ke3Rvb2x0aXBDb21wYXJlVmFsdWV9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCIke3Rvb2x0aXBEYXRlcmFuZ2VNYXJnaW59XCI+JHt0b29sdGlwRGF0ZXJhbmdlfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZVwiPjxzcGFuIGNsYXNzPVwiZm9udC13ZWlnaHQtYm9sZFwiPiR7dG9vbHRpcFZhbHVlfTwvc3Bhbj4gPHNwYW4+JHt0b29sdGlwSW5kaWNhdG9yfTwvc3Bhbj48L2Rpdj5cbiAgICAgIGA7XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0V2lkdGggPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCB0b29sdGlwVGlwU2l6ZSA9IDg7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAkeytzY3JvbGxbMV0gKyArZGltZW5zaW9ucy50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC0gdG9vbHRpcFRpcFNpemV9cHhgKTtcblxuICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID4gMSkge1xuICAgICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSArICtkaW1lbnNpb25zLmxlZnQgLSB0b29sdGlwT2Zmc2V0V2lkdGggKyArZGltZW5zaW9ucy53aWR0aCAvIDJ9cHhgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSAtIHRvb2x0aXBPZmZzZXRXaWR0aCArICtkaW1lbnNpb25zLnJpZ2h0fXB4YCk7XG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kVG9vbHRpcCkge1xuICAgICAgY29uc3QgYmFySG92ZXIgPSB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpXG4gICAgICAgIC5ub2RlKCk7XG5cbiAgICAgIHRoaXMudG9vbHRpcFNob3coZGF0YSwgYmFySG92ZXIpO1xuICAgIH1cblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIG51bGwpO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKVxuICAgICAgLnN0eWxlKCdmaWxsJywgbnVsbCk7XG5cbiAgICAvLyBoaWRlIHRvb2x0aXAgZm9yIHplcm8vbnVsbCB2YWx1ZXNcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHhBeGlzRm9ybWF0dGVyID0gaXRlbSA9PiB7XG4gICAgc3dpdGNoICh0aGlzLnhBeGlzRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIGAke3RoaXMueEF4aXNGb3JtYXQoaXRlbSl9JHt0aGlzLnhBeGlzVGlja0xhYmVsU3VmZml4fWA7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBgJHtpdGVtfSR7dGhpcy54QXhpc1RpY2tMYWJlbFN1ZmZpeH1gO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
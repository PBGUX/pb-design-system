/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, event as d3_event } from 'd3-selection';
import { scaleOrdinal as d3_scaleOrdinal, scaleLinear as d3_scaleLinear, scaleBand as d3_scaleBand } from 'd3-scale';
import { max as d3_max } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { isoParse as d3_isoParse } from 'd3-time-format';
import { stack as d3_stack, stackOrderNone as d3_stackOrderNone } from 'd3-shape';
import { PbdsDatavizService } from './dataviz.service';
export class PbdsDatavizBarStackedComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     * @param {?} _scroll
     */
    constructor(_dataviz, _element, _scroll) {
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this.chartClass = true;
        this.stackedBarClass = true;
        this.width = 306;
        this.height = 400;
        this.type = 'medium'; // debug to show all chart options
        // debug to show all chart options
        this.marginTop = 10; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginRight = 0; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.hideXAxis = false;
        this.xAxisFormatType = null;
        this.xAxisFormatString = '';
        this.yAxisFormatType = null;
        this.yAxisFormatString = '';
        this.yAxisTicks = 5;
        this.yAxisMaxBuffer = 0.01;
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'right';
        this.legendLabelFormatType = null;
        this.legendLabelFormatString = '';
        this.tooltipHeadingFormatType = null;
        this.tooltipHeadingFormatString = '';
        this.tooltipHeadingValueFormatType = null;
        this.tooltipHeadingValueFormatString = '';
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (/**
         * @param {?=} firstRun
         * @return {?}
         */
        (firstRun = true) => {
            this.dataKeys = Object.keys(this.data[0]).filter((/**
             * @param {?} item
             * @return {?}
             */
            item => item !== 'key'));
            // create the D3 stack data
            this.dataStack = d3_stack()
                .keys(this.dataKeys)
                .order(d3_stackOrderNone)(this.data);
            // update the xScale
            this.xAxisScale.domain(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            d => d.key)));
            // update the yScale
            this.yAxisMax = d3_max(this.dataStack, (/**
             * @param {?} data
             * @return {?}
             */
            (data) => {
                return d3_max(data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => {
                    return d[1];
                }));
            }));
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale
                .domain([0, this.yAxisMax])
                .rangeRound([this.height, 0])
                .nice();
            this.xAxis
                .transition()
                .duration(0) // 1000
                .call(this.xAxisCall);
            this.yAxis
                .transition()
                .duration(0) // 1000
                .call(this.yAxisCall);
            // update the grids
            if (!this.hideXGrid) {
                this.xGrid
                    .transition()
                    .duration(0) // 1000
                    .call(this.xGridCall);
            }
            if (!this.hideYGrid) {
                this.yGrid
                    .transition()
                    .duration(0) // 1000
                    .call(this.yGridCall);
            }
            // add gray bars
            if (!this.hideGrayBars) {
                this.grayBars
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
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height)), (/**
                 * @param {?} update
                 * @return {?}
                 */
                update => update
                    .transition()
                    .duration((/**
                 * @param {?} d
                 * @param {?} i
                 * @param {?} n
                 * @return {?}
                 */
                (d, i, n) => (firstRun ? 0 : 1000)))
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.key)))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height)), (/**
                 * @param {?} exit
                 * @return {?}
                 */
                exit => exit.remove()));
            }
            // add colored bars
            /** @type {?} */
            const barGroups = this.bars
                .selectAll('.bar-group')
                .data(this.dataStack)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('g')
                .attr('class', 'bar-group')
                .attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.colorRange(d.index)))), (/**
             * @param {?} update
             * @return {?}
             */
            update => update.attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.colorRange(d.index)))), (/**
             * @param {?} exit
             * @return {?}
             */
            exit => exit.remove()));
            barGroups
                .selectAll('.bar')
                .data((/**
             * @param {?} d
             * @return {?}
             */
            d => d))
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('rect')
                .attr('class', 'bar')
                .classed('bar-divided', this.type !== 'high')
                .classed('bar-divided-low', this.type === 'low')
                .attr('x', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                /** @type {?} */
                let x;
                if (this.type === 'medium') {
                    x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 8) * 3;
                }
                else {
                    x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 4) * 1;
                }
                return x;
            }))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.yAxisScale(d[0])))
                .attr('width', (/**
             * @param {?} d
             * @return {?}
             */
            d => {
                /** @type {?} */
                let width;
                if (this.type === 'medium') {
                    width = this.xAxisScale.bandwidth() / 4;
                }
                else {
                    width = this.xAxisScale.bandwidth() / 2;
                }
                return width;
            }))
                .attr('height', 0)
                .call((/**
             * @param {?} enter
             * @return {?}
             */
            enter => {
                enter
                    .transition()
                    .duration((/**
                 * @param {?} d
                 * @param {?} i
                 * @param {?} n
                 * @return {?}
                 */
                (d, i, n) => (firstRun ? 0 : 500)))
                    .delay((/**
                 * @param {?} d
                 * @param {?} i
                 * @param {?} n
                 * @return {?}
                 */
                (d, i, n) => (firstRun ? 0 : 750)))
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d[1])))
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    return this.yAxisScale(d[0]) - this.yAxisScale(d[1]);
                }));
                return enter;
            }))), (/**
             * @param {?} update
             * @return {?}
             */
            update => update.call((/**
             * @param {?} update
             * @return {?}
             */
            update => {
                // let width;
                // if (this.type === 'medium') {
                //   width = this.xAxisScale.bandwidth() / 4;
                // } else {
                //   width = this.xAxisScale.bandwidth() / 2;
                // }
                update
                    .transition()
                    .duration(1000)
                    .attr('width', this.xAxisScale.bandwidth() / 4)
                    .attr('x', (/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                (d, i) => this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 8) * 3))
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d[1])))
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d[0]) - this.yAxisScale(d[1])));
                return update;
            }))), (/**
             * @param {?} exit
             * @return {?}
             */
            exit => exit.remove()));
            // mouseover bars
            this.mouseBars
                .selectAll('.mouseover-bar')
                .data(this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('rect')
                .attr('class', 'mouseover-bar')
                .style('opacity', 0)
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.xAxisScale(d.key)))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height)), (/**
             * @param {?} update
             * @return {?}
             */
            update => update
                .attr('pointer-events', 'none')
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.xAxisScale(d.key)))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height)
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
            this.bars.raise();
            this.xAxis.raise();
            this.mouseBars.raise();
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.dataStack)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => {
                    /** @type {?} */
                    const li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.colorRange(d.index)));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d.key);
                            case 'time':
                                /** @type {?} */
                                const parsedTime = d3_isoParse(d.key);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
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
                                return this.legendLabelFormat(d.key);
                            case 'time':
                                /** @type {?} */
                                const parsedTime = d3_isoParse(d.key);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
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
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.tooltipShow(data, index, nodes[index]);
            this.hovered.emit({ event, data });
        });
        this.barMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.bar').classed('inactive', false);
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
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.hovered.emit({ event, data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.bar-group').classed('inactive', false);
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
                    return this.xAxisFormat(item);
                case 'time':
                    /** @type {?} */
                    const parseDate = d3_isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        });
        this.tooltipShow = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} node
         * @return {?}
         */
        (data, index, node) => {
            // console.log('TOOLTIP: ', data, index, node);
            // console.log('TOOLTIP: ', data, index, node);
            /** @type {?} */
            const scroll = this._scroll.getScrollPosition();
            /** @type {?} */
            const mouserectDimensions = node.getBoundingClientRect();
            /** @type {?} */
            const clientWidth = document.body.clientWidth - 10;
            /** @type {?} */
            let dimensionCalculated;
            /** @type {?} */
            let tooltipDimensions;
            /** @type {?} */
            let tooltipOffsetHeight;
            /** @type {?} */
            let yPosition;
            /** @type {?} */
            let xPosition;
            // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
            this.tooltip.select('.tooltip-header').html((/**
             * @param {?} d
             * @return {?}
             */
            d => {
                switch (this.tooltipHeadingFormatType) {
                    case 'time':
                        /** @type {?} */
                        const parseDate = d3_isoParse(data.key);
                        return this.tooltipHeadingFormat(parseDate);
                    default:
                        return data.key;
                }
            }));
            this.tooltip.select('.tooltip-header-value').html((/**
             * @param {?} d
             * @return {?}
             */
            d => {
                /** @type {?} */
                let total = 0;
                Object.keys(data).map((/**
                 * @param {?} e
                 * @return {?}
                 */
                e => {
                    if (e !== 'key') {
                        total = total + data[e];
                    }
                }));
                return this.tooltipHeadingValueFormat(total);
            }));
            this.tooltip
                .select('.tooltip-table')
                .select('tbody')
                .html((/**
             * @param {?} d
             * @return {?}
             */
            d => {
                /** @type {?} */
                let html = ``;
                /** @type {?} */
                let label;
                /** @type {?} */
                let value;
                Object.keys(data).map((/**
                 * @param {?} key
                 * @param {?} index
                 * @return {?}
                 */
                (key, index) => {
                    switch (this.tooltipLabelFormatType) {
                        case 'time':
                            /** @type {?} */
                            const parseDate = d3_isoParse(key);
                            label = this.tooltipHeadingFormat(parseDate);
                            break;
                        default:
                            label = key;
                    }
                    switch (this.tooltipValueFormatType) {
                        case 'number':
                            value = this.tooltipValueFormat(data[key]);
                            break;
                        default:
                            value = data[key];
                    }
                    if (key !== 'key') {
                        html += `
              <tr class='tooltip-item'>
                <td style="color: ${this.colorRange(index - 1)}">
                  <span class="pbds-tooltip-key"></span>
                </td>
                <td class="tooltip-label pr-2 text-nowrap">${label}</td>
                <td class="tooltip-value text-right text-nowrap">${value}</td>
              </tr>
            `;
                    }
                }));
                return html;
            }));
            tooltipDimensions = this.tooltip.node().getBoundingClientRect();
            dimensionCalculated = mouserectDimensions.left + mouserectDimensions.width + tooltipDimensions.width + 8;
            tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            // flip the tooltip positions if near the right edge of the screen
            if (dimensionCalculated > clientWidth) {
                this.tooltip.classed('east', true);
                this.tooltip.classed('west', false);
                if (this.type === 'medium') {
                    xPosition = `${mouserectDimensions.left + (mouserectDimensions.width / 8) * 3 - tooltipDimensions.width - 8}px`;
                }
                else {
                    xPosition = `${mouserectDimensions.left + (mouserectDimensions.width / 4) * 1 - tooltipDimensions.width - 8}px`;
                }
            }
            else if (dimensionCalculated < clientWidth) {
                this.tooltip.classed('east', false);
                this.tooltip.classed('west', true);
                if (this.type === 'medium') {
                    xPosition = `${mouserectDimensions.left + (mouserectDimensions.width / 8) * 5 + 8}px`;
                }
                else {
                    xPosition = `${mouserectDimensions.left + (mouserectDimensions.width / 4) * 3 + 8}px`;
                }
            }
            yPosition = this.svg
                .selectAll('.bar-group')
                .filter(':last-child')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .node()
                .getBoundingClientRect();
            // set the tooltip styles
            this.tooltip.style('top', `${yPosition.top - tooltipOffsetHeight / 2 + scroll[1]}px`);
            this.tooltip.style('left', xPosition);
            this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        () => {
            this.tooltip.style('opacity', 0);
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
        // extract keys for stack data
        this.dataKeys = Object.keys(this.data[0]).filter((/**
         * @param {?} item
         * @return {?}
         */
        item => item !== 'key'));
        // create the D3 stack data
        this.dataStack = d3_stack()
            .keys(this.dataKeys)
            .order(d3_stackOrderNone)(this.data);
        //////////////////////////////////////////
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
        this.tooltipHeadingFormat = this._dataviz.d3Format(this.tooltipHeadingFormatType, this.tooltipHeadingFormatString);
        this.tooltipHeadingValueFormat = this._dataviz.d3Format(this.tooltipHeadingValueFormatType, this.tooltipHeadingValueFormatString);
        this.tooltipLabelFormat = this._dataviz.d3Format(this.tooltipLabelFormatType, this.tooltipLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        // defaults for all chart types
        this.hideGrayBars = false;
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
        this.yAxisTickSize = 8;
        this.yAxisTickSizeOuter = 0;
        // this.hideTooltipLabel = false;
        if (this.type !== 'debug') {
            // set type defaults
            switch (this.type) {
                case 'low':
                    this.hideGrayBars = true;
                    this.hideXAxisTicks = true;
                    this.hideXGrid = true;
                    this.hideYAxisDomain = false;
                    this.hideYAxisTicks = true;
                    this.legendPosition = 'bottom';
                    break;
                case 'medium':
                    this.hideXAxisDomain = true;
                    this.hideXGrid = true;
                    this.hideXAxisTicks = true;
                    this.hideYAxisDomain = true;
                    this.hideYAxisTicks = true;
                    this.hideYGrid = true;
                    break;
                case 'high':
                    this.hideXAxis = true;
                    this.hideXAxisTicks = true;
                    this.hideXAxisDomain = true;
                    this.hideXGrid = true;
                    this.hideYAxisDomain = true;
                    this.hideYAxisTicks = true;
                    this.hideYGrid = true;
                    this.hideLegend = false;
                    this.legendPosition = 'bottom';
                    break;
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
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height + this.margin.top + this.margin.bottom}`);
        this.grayBars = this.svg.append('g').attr('class', 'gray-bars');
        this.mouseBars = this.svg.append('g').attr('class', 'mouseover-bars');
        this.bars = this.svg.append('g').attr('class', 'bars');
        // build color ranges
        this.colorRange = d3_scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
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
        if (!this.hideXGrid) {
            this.xGridCall = d3_axisBottom(this.xAxisScale).tickSize(-this.height);
            this.xGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-x')
                .classed('grid-zero-hidden', this.hideXAxisZero)
                .attr('transform', `translate(0, ${this.height})`)
                .call(this.xGridCall);
        }
        // KEEP: use this block to debug yAxisMax
        // console.log(
        //   d3_max(this.dataStack, (data: any) => {
        //     // console.log(data);
        //     return d3_max(data, (d: any) => {
        //       // console.log('D: ', d);
        //       return d[1];
        //     });
        //   })
        // );
        // Y AXIS
        this.yAxisMax = d3_max(this.dataStack, (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            return d3_max(data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                return d[1];
            }));
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
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', 'pbds-tooltip west')
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
            // tooltip header
            this.tooltip.append('div').attr('class', 'tooltip-header');
            this.tooltip.append('div').attr('class', 'tooltip-header-value');
            // tooltip table
            this.tooltip
                .append('table')
                .attr('class', 'tooltip-table text-left w-100')
                .append('tbody');
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
        }
        this.updateChart();
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
            this.updateChart(false);
        }
    }
}
PbdsDatavizBarStackedComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar-stacked',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizBarStackedComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller }
];
PbdsDatavizBarStackedComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    stackedBarClass: [{ type: HostBinding, args: ['class.pbds-chart-stacked-bar',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    type: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    hideXAxis: [{ type: Input }],
    xAxisFormatType: [{ type: Input }],
    xAxisFormatString: [{ type: Input }],
    yAxisFormatType: [{ type: Input }],
    yAxisFormatString: [{ type: Input }],
    yAxisTicks: [{ type: Input }],
    yAxisMaxBuffer: [{ type: Input }],
    hideLegend: [{ type: Input }],
    legendWidth: [{ type: Input }],
    legendPosition: [{ type: Input }],
    legendLabelFormatType: [{ type: Input }],
    legendLabelFormatString: [{ type: Input }],
    tooltipHeadingFormatType: [{ type: Input }],
    tooltipHeadingFormatString: [{ type: Input }],
    tooltipHeadingValueFormatType: [{ type: Input }],
    tooltipHeadingValueFormatString: [{ type: Input }],
    tooltipLabelFormatType: [{ type: Input }],
    tooltipLabelFormatString: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    theme: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.stackedBarClass;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.type;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.hideXAxis;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.yAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.yAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.yAxisTicks;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.yAxisMaxBuffer;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingValueFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingValueFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.dataStack;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.dataKeys;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.grayBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.mouseBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.bars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideGrayBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideXGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisMax;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideTooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipLabelFormat;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.barMouseOver;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.barMouseOut;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.barMouseClick;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype._scroll;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2RhdGF2aXovZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFHWCx1QkFBdUIsRUFDeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0RSxPQUFPLEVBQUUsWUFBWSxJQUFJLGVBQWUsRUFBRSxXQUFXLElBQUksY0FBYyxFQUFFLFNBQVMsSUFBSSxZQUFZLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDckgsT0FBTyxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDekMsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsUUFBUSxJQUFJLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsUUFBUSxJQUFJLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxLQUFLLElBQUksUUFBUSxFQUFFLGNBQWMsSUFBSSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUVsRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQVN2RCxNQUFNLE9BQU8sOEJBQThCOzs7Ozs7SUFnSnpDLFlBQW9CLFFBQTRCLEVBQVUsUUFBb0IsRUFBVSxPQUF5QjtRQUE3RixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUFVLGFBQVEsR0FBUixRQUFRLENB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Ozs7SUFDL0IseURBQWlDOzs7OztJQUNqQyx3REFBZ0M7Ozs7O0lBQ2hDLDJEQUEwQjs7Ozs7SUFDMUIsaURBQWdCOzs7OztJQUNoQixxREFBNkI7Ozs7O0lBQzdCLDhEQUE2Qjs7Ozs7SUFDN0IsbUVBQWtDOzs7OztJQUNsQyw0REFBMkI7Ozs7O0lBQzNCLDREQUEyQjs7SUF1UDNCLHFEQXVQRTs7SUFFRixzREFVRTs7SUFFRixxREFJRTs7SUFFRix1REFFRTs7SUFFRix5REFZRTs7SUFFRix3REFNRTs7SUFFRiwwREFFRTs7Ozs7SUFFRix3REFZRTs7Ozs7SUFFRixxREFzSEU7Ozs7O0lBRUYscURBRUU7Ozs7O0lBRUYsd0RBWUU7Ozs7O0lBcHJCVSxrREFBb0M7Ozs7O0lBQUUsa0RBQTRCOzs7OztJQUFFLGlEQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIE9uRGVzdHJveSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0LCBldmVudCBhcyBkM19ldmVudCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsLCBzY2FsZUxpbmVhciBhcyBkM19zY2FsZUxpbmVhciwgc2NhbGVCYW5kIGFzIGQzX3NjYWxlQmFuZCB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IG1heCBhcyBkM19tYXggfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQgeyBheGlzQm90dG9tIGFzIGQzX2F4aXNCb3R0b20sIGF4aXNMZWZ0IGFzIGQzX2F4aXNMZWZ0IH0gZnJvbSAnZDMtYXhpcyc7XG5pbXBvcnQgeyBpc29QYXJzZSBhcyBkM19pc29QYXJzZSB9IGZyb20gJ2QzLXRpbWUtZm9ybWF0JztcbmltcG9ydCB7IHN0YWNrIGFzIGQzX3N0YWNrLCBzdGFja09yZGVyTm9uZSBhcyBkM19zdGFja09yZGVyTm9uZSB9IGZyb20gJ2QzLXNoYXBlJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJTdGFja2VkIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotYmFyLXN0YWNrZWQnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtc3RhY2tlZC1iYXInKVxuICBzdGFja2VkQmFyQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6QmFyU3RhY2tlZD47XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAzMDY7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNDAwO1xuXG4gIEBJbnB1dCgpXG4gIHR5cGU6ICdsb3cnIHwgJ21lZGl1bScgfCAnaGlnaCcgfCAnZGVidWcnID0gJ21lZGl1bSc7IC8vIGRlYnVnIHRvIHNob3cgYWxsIGNoYXJ0IG9wdGlvbnNcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAxMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDMwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDU1OyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgaGlkZVhBeGlzID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzVGlja3MgPSA1O1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWF4QnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICBoaWRlTGVnZW5kID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kV2lkdGggPSAxMDUgKyAyODsgLy8gaGFyZGNvZGVkIGxlZ2VuZCB3aWR0aCArIGxlZnQgbWFyZ2luLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBsZWdlbmRQb3NpdGlvbjogJ3JpZ2h0JyB8ICdib3R0b20nID0gJ3JpZ2h0JztcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBIZWFkaW5nRm9ybWF0VHlwZTogJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwSGVhZGluZ0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFR5cGU6ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lO1xuXG4gIEBPdXRwdXQoKVxuICBob3ZlcmVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBPdXRwdXQoKVxuICBjbGlja2VkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIHByaXZhdGUgZGF0YVN0YWNrO1xuICBwcml2YXRlIGRhdGFLZXlzO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBncmF5QmFycztcbiAgcHJpdmF0ZSBtb3VzZUJhcnM7XG4gIHByaXZhdGUgYmFycztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBoaWRlR3JheUJhcnM6IGJvb2xlYW47XG4gIHByaXZhdGUgeEF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XG4gIHByaXZhdGUgeEF4aXM7XG4gIHByaXZhdGUgeEF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIGhpZGVYQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYR3JpZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUdyaWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgeUF4aXNNYXg7XG4gIHByaXZhdGUgeUF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB5QXhpc0NhbGw7XG4gIHByaXZhdGUgeUF4aXM7XG4gIHByaXZhdGUgeUF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHlBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIHhHcmlkO1xuICBwcml2YXRlIHhHcmlkQ2FsbDtcbiAgcHJpdmF0ZSB5R3JpZDtcbiAgcHJpdmF0ZSB5R3JpZENhbGw7XG4gIHByaXZhdGUgaGlkZVlBeGlzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgaGlkZVRvb2x0aXA6IGJvb2xlYW47XG4gIHByaXZhdGUgdG9vbHRpcEhlYWRpbmdGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcExhYmVsRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIGV4dHJhY3Qga2V5cyBmb3Igc3RhY2sgZGF0YVxuICAgIHRoaXMuZGF0YUtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLmZpbHRlcihpdGVtID0+IGl0ZW0gIT09ICdrZXknKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgRDMgc3RhY2sgZGF0YVxuICAgIHRoaXMuZGF0YVN0YWNrID0gZDNfc3RhY2soKVxuICAgICAgLmtleXModGhpcy5kYXRhS2V5cylcbiAgICAgIC5vcmRlcihkM19zdGFja09yZGVyTm9uZSkodGhpcy5kYXRhKTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMueEF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueEF4aXNGb3JtYXRUeXBlLCB0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnlBeGlzRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0VHlwZSwgdGhpcy55QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUsIHRoaXMubGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KFxuICAgICAgdGhpcy50b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0VHlwZSxcbiAgICAgIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFN0cmluZ1xuICAgICk7XG4gICAgdGhpcy50b29sdGlwTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGRlZmF1bHRzIGZvciBhbGwgY2hhcnQgdHlwZXNcbiAgICB0aGlzLmhpZGVHcmF5QmFycyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEdyaWQgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZR3JpZCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVUb29sdGlwID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSBmYWxzZTtcbiAgICB0aGlzLnhBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyID0gMDtcbiAgICB0aGlzLnlBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyID0gMDtcbiAgICAvLyB0aGlzLmhpZGVUb29sdGlwTGFiZWwgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdkZWJ1ZycpIHtcbiAgICAgIC8vIHNldCB0eXBlIGRlZmF1bHRzXG4gICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICBjYXNlICdsb3cnOlxuICAgICAgICAgIHRoaXMuaGlkZUdyYXlCYXJzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmxlZ2VuZFBvc2l0aW9uID0gJ2JvdHRvbSc7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZR3JpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnaGlnaCc6XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXMgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlHcmlkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVMZWdlbmQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmxlZ2VuZFBvc2l0aW9uID0gJ2JvdHRvbSc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRqdXN0IG1hcmdpbiBpZiB4QXhpcyBoaWRkZW5cbiAgICBpZiAodGhpcy5oaWRlWEF4aXMpIHRoaXMubWFyZ2luLmJvdHRvbSA9IDEwOyAvLyBuZWVkIHNtYWxsIG1hcmdpbiBmb3IgeUF4aXMgd2l0aCAwIHRpY2sgbGFiZWxcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRofSAkeyt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbX1gXG4gICAgICApO1xuXG4gICAgdGhpcy5ncmF5QmFycyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2dyYXktYmFycycpO1xuICAgIHRoaXMubW91c2VCYXJzID0gdGhpcy5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnbW91c2VvdmVyLWJhcnMnKTtcbiAgICB0aGlzLmJhcnMgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdiYXJzJyk7XG5cbiAgICAvLyBidWlsZCBjb2xvciByYW5nZXNcbiAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKS5yYW5nZSh0aGlzLl9kYXRhdml6LmdldENvbG9ycyhmYWxzZSwgdGhpcy50aGVtZSkpO1xuXG4gICAgLy8gWCBBWElTXG4gICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgIC5kb21haW4odGhpcy5kYXRhLm1hcChkID0+IGQua2V5KSlcbiAgICAgIC5yYW5nZVJvdW5kKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdF0pXG4gICAgICAuYWxpZ24oMCk7XG5cbiAgICAvLyBhZGQgcGFkZGluZyB0byB0aGUgc2NhbGUgZm9yIGdyYXkgYmFyc1xuICAgICF0aGlzLmhpZGVHcmF5QmFyc1xuICAgICAgPyB0aGlzLnhBeGlzU2NhbGUucGFkZGluZ0lubmVyKDAuMSkucGFkZGluZ091dGVyKDApXG4gICAgICA6IHRoaXMueEF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMCkucGFkZGluZ091dGVyKDApO1xuXG4gICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnhBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXMpXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc0RvbWFpbilcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzVGlja3MpXG4gICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAvLyBYIEdSSURMSU5FU1xuICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpLnRpY2tTaXplKC10aGlzLmhlaWdodCk7XG5cbiAgICAgIHRoaXMueEdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBLRUVQOiB1c2UgdGhpcyBibG9jayB0byBkZWJ1ZyB5QXhpc01heFxuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgZDNfbWF4KHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgLy8gICAgIHJldHVybiBkM19tYXgoZGF0YSwgKGQ6IGFueSkgPT4ge1xuICAgIC8vICAgICAgIC8vIGNvbnNvbGUubG9nKCdEOiAnLCBkKTtcbiAgICAvLyAgICAgICByZXR1cm4gZFsxXTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9KVxuICAgIC8vICk7XG5cbiAgICAvLyBZIEFYSVNcbiAgICB0aGlzLnlBeGlzTWF4ID0gZDNfbWF4KHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICByZXR1cm4gZDNfbWF4KGRhdGEsIChkOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIGRbMV07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMueUF4aXNNYXggPSB0aGlzLnlBeGlzTWF4ICsgdGhpcy55QXhpc01heCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG5cbiAgICB0aGlzLnlBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCB0aGlzLnlBeGlzTWF4XSlcbiAgICAgIC5uaWNlKClcbiAgICAgIC5yYW5nZVJvdW5kKFt0aGlzLmhlaWdodCwgMF0pO1xuXG4gICAgdGhpcy55QXhpc0NhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgLnRpY2tTaXplKHRoaXMueUF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy55QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnlBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy15JylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gWSBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XG4gICAgICB0aGlzLnlHcmlkQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgICAgLnRpY2tTaXplKC10aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KTtcblxuICAgICAgdGhpcy55R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXknKVxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgMClgKVxuICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCB3ZXN0JylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgLy8gaGlkZSB0b29sdGlwIGZvciBhY2Nlc3NpYmlsaXR5XG5cbiAgICAgIC8vIHRvb2x0aXAgaGVhZGVyXG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWhlYWRlcicpO1xuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXItdmFsdWUnKTtcblxuICAgICAgLy8gdG9vbHRpcCB0YWJsZVxuICAgICAgdGhpcy50b29sdGlwXG4gICAgICAgIC5hcHBlbmQoJ3RhYmxlJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdGFibGUgdGV4dC1sZWZ0IHctMTAwJylcbiAgICAgICAgLmFwcGVuZCgndGJvZHknKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgbGVnZW5kIGNsYXNzZXNcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVDaGFydCA9IChmaXJzdFJ1biA9IHRydWUpID0+IHtcbiAgICB0aGlzLmRhdGFLZXlzID0gT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5maWx0ZXIoaXRlbSA9PiBpdGVtICE9PSAna2V5Jyk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIEQzIHN0YWNrIGRhdGFcbiAgICB0aGlzLmRhdGFTdGFjayA9IGQzX3N0YWNrKClcbiAgICAgIC5rZXlzKHRoaXMuZGF0YUtleXMpXG4gICAgICAub3JkZXIoZDNfc3RhY2tPcmRlck5vbmUpKHRoaXMuZGF0YSk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIHhTY2FsZVxuICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4odGhpcy5kYXRhLm1hcChkID0+IGQua2V5KSk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIHlTY2FsZVxuICAgIHRoaXMueUF4aXNNYXggPSBkM19tYXgodGhpcy5kYXRhU3RhY2ssIChkYXRhOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiBkM19tYXgoZGF0YSwgKGQ6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gZFsxXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy55QXhpc01heCA9IHRoaXMueUF4aXNNYXggKyB0aGlzLnlBeGlzTWF4ICogdGhpcy55QXhpc01heEJ1ZmZlcjtcblxuICAgIHRoaXMueUF4aXNTY2FsZVxuICAgICAgLmRvbWFpbihbMCwgdGhpcy55QXhpc01heF0pXG4gICAgICAucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKVxuICAgICAgLm5pY2UoKTtcblxuICAgIHRoaXMueEF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigwKSAvLyAxMDAwXG4gICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICB0aGlzLnlBeGlzXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMCkgLy8gMTAwMFxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSBncmlkc1xuICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAgIHRoaXMueEdyaWRcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMCkgLy8gMTAwMFxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgdGhpcy55R3JpZFxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigwKSAvLyAxMDAwXG4gICAgICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgZ3JheSBiYXJzXG4gICAgaWYgKCF0aGlzLmhpZGVHcmF5QmFycykge1xuICAgICAgdGhpcy5ncmF5QmFyc1xuICAgICAgICAuc2VsZWN0QWxsKCcuZ3JheS1iYXInKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+XG4gICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyYXktYmFyJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KSxcbiAgICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigoZCwgaSwgbikgPT4gKGZpcnN0UnVuID8gMCA6IDEwMDApKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpLFxuICAgICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIGFkZCBjb2xvcmVkIGJhcnNcbiAgICBjb25zdCBiYXJHcm91cHMgPSB0aGlzLmJhcnNcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLmRhdGEodGhpcy5kYXRhU3RhY2spXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyLWdyb3VwJylcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5pbmRleCkpLFxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlLmF0dHIoJ2ZpbGwnLCBkID0+IHRoaXMuY29sb3JSYW5nZShkLmluZGV4KSksXG4gICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgKTtcblxuICAgIGJhckdyb3Vwc1xuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YShkID0+IGQpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgICAgIC5jbGFzc2VkKCdiYXItZGl2aWRlZCcsIHRoaXMudHlwZSAhPT0gJ2hpZ2gnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ2Jhci1kaXZpZGVkLWxvdycsIHRoaXMudHlwZSA9PT0gJ2xvdycpXG4gICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIGxldCB4O1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdtZWRpdW0nKSB7XG4gICAgICAgICAgICAgICAgeCA9IHRoaXMueEF4aXNTY2FsZShkLmRhdGEua2V5KSArICh0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA4KSAqIDM7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgeCA9IHRoaXMueEF4aXNTY2FsZShkLmRhdGEua2V5KSArICh0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA0KSAqIDE7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGRbMF0pKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgZCA9PiB7XG4gICAgICAgICAgICAgIGxldCB3aWR0aDtcblxuICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xuICAgICAgICAgICAgICAgIHdpZHRoID0gdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDI7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAuY2FsbChlbnRlciA9PiB7XG4gICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigoZCwgaSwgbikgPT4gKGZpcnN0UnVuID8gMCA6IDUwMCkpXG4gICAgICAgICAgICAgICAgLmRlbGF5KChkLCBpLCBuKSA9PiAoZmlyc3RSdW4gPyAwIDogNzUwKSlcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGRbMV0pKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnlBeGlzU2NhbGUoZFswXSkgLSB0aGlzLnlBeGlzU2NhbGUoZFsxXSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGVudGVyO1xuICAgICAgICAgICAgfSksXG4gICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgIHVwZGF0ZS5jYWxsKHVwZGF0ZSA9PiB7XG4gICAgICAgICAgICAvLyBsZXQgd2lkdGg7XG5cbiAgICAgICAgICAgIC8vIGlmICh0aGlzLnR5cGUgPT09ICdtZWRpdW0nKSB7XG4gICAgICAgICAgICAvLyAgIHdpZHRoID0gdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNDtcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgIHdpZHRoID0gdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gMjtcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQpXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHRoaXMueEF4aXNTY2FsZShkLmRhdGEua2V5KSArICh0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA4KSAqIDMpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZFsxXSkpXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IHRoaXMueUF4aXNTY2FsZShkWzBdKSAtIHRoaXMueUF4aXNTY2FsZShkWzFdKSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSksXG5cbiAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICApO1xuXG4gICAgLy8gbW91c2VvdmVyIGJhcnNcbiAgICB0aGlzLm1vdXNlQmFyc1xuICAgICAgLnNlbGVjdEFsbCgnLm1vdXNlb3Zlci1iYXInKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21vdXNlb3Zlci1iYXInKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC5rZXkpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KSxcbiAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgIGV4aXQgPT5cbiAgICAgICAgICBleGl0XG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAucmVtb3ZlKClcbiAgICAgIClcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZU91dCgpKVxuICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG5cbiAgICB0aGlzLmJhcnMucmFpc2UoKTtcbiAgICB0aGlzLnhBeGlzLnJhaXNlKCk7XG4gICAgdGhpcy5tb3VzZUJhcnMucmFpc2UoKTtcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0XG4gICAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGFTdGFjaylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgZW50ZXIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGkgPSBlbnRlci5hcHBlbmQoJ2xpJykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKTtcblxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1rZXknKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCBkID0+IHRoaXMuY29sb3JSYW5nZShkLmluZGV4KSk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKVxuICAgICAgICAgICAgICAuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmtleSk7XG5cbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5rZXkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHVwZGF0ZSA9PiB7XG4gICAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmtleSk7XG5cbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmtleSk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHRoaXMubGVnZW5kTW91c2VPdXQoKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubGVnZW5kTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG4gICAgfVxuICB9O1xuXG4gIGJhck1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTaG93KGRhdGEsIGluZGV4LCBub2Rlc1tpbmRleF0pO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBiYXJNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmJhcicpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGJhck1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSBpdGVtID0+IHtcbiAgICBzd2l0Y2ggKHRoaXMueEF4aXNGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChpdGVtKTtcblxuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChwYXJzZURhdGUpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChkYXRhLCBpbmRleCwgbm9kZSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdUT09MVElQOiAnLCBkYXRhLCBpbmRleCwgbm9kZSk7XG5cbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBjb25zdCBtb3VzZXJlY3REaW1lbnNpb25zID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjbGllbnRXaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSAxMDtcbiAgICBsZXQgZGltZW5zaW9uQ2FsY3VsYXRlZDtcbiAgICBsZXQgdG9vbHRpcERpbWVuc2lvbnM7XG4gICAgbGV0IHRvb2x0aXBPZmZzZXRIZWlnaHQ7XG4gICAgbGV0IHlQb3NpdGlvbjtcbiAgICBsZXQgeFBvc2l0aW9uO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsLCBtb3VzZXJlY3REaW1lbnNpb25zLCB0b29sdGlwT2Zmc2V0SGVpZ2h0LCB0b29sdGlwRGltZW5zaW9ucywgZGltZW5zaW9uQ2FsY3VsYXRlZCwgY2xpZW50V2lkdGgpO1xuXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbChkID0+IHtcbiAgICAgIHN3aXRjaCAodGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdFR5cGUpIHtcbiAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoZGF0YS5rZXkpO1xuICAgICAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0KHBhcnNlRGF0ZSk7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gZGF0YS5rZXk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXItdmFsdWUnKS5odG1sKGQgPT4ge1xuICAgICAgbGV0IHRvdGFsID0gMDtcblxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubWFwKGUgPT4ge1xuICAgICAgICBpZiAoZSAhPT0gJ2tleScpIHtcbiAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgZGF0YVtlXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXQodG90YWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy50b29sdGlwXG4gICAgICAuc2VsZWN0KCcudG9vbHRpcC10YWJsZScpXG4gICAgICAuc2VsZWN0KCd0Ym9keScpXG4gICAgICAuaHRtbChkID0+IHtcbiAgICAgICAgbGV0IGh0bWwgPSBgYDtcbiAgICAgICAgbGV0IGxhYmVsO1xuICAgICAgICBsZXQgdmFsdWU7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkubWFwKChrZXksIGluZGV4KSA9PiB7XG4gICAgICAgICAgc3dpdGNoICh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShrZXkpO1xuICAgICAgICAgICAgICBsYWJlbCA9IHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQocGFyc2VEYXRlKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGxhYmVsID0ga2V5O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHN3aXRjaCAodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGFba2V5XSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICB2YWx1ZSA9IGRhdGFba2V5XTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoa2V5ICE9PSAna2V5Jykge1xuICAgICAgICAgICAgaHRtbCArPSBgXG4gICAgICAgICAgICAgIDx0ciBjbGFzcz0ndG9vbHRpcC1pdGVtJz5cbiAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJjb2xvcjogJHt0aGlzLmNvbG9yUmFuZ2UoaW5kZXggLSAxKX1cIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGJkcy10b29sdGlwLWtleVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRvb2x0aXAtbGFiZWwgcHItMiB0ZXh0LW5vd3JhcFwiPiR7bGFiZWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0b29sdGlwLXZhbHVlIHRleHQtcmlnaHQgdGV4dC1ub3dyYXBcIj4ke3ZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICBgO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgICB9KTtcblxuICAgIHRvb2x0aXBEaW1lbnNpb25zID0gdGhpcy50b29sdGlwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBkaW1lbnNpb25DYWxjdWxhdGVkID0gbW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgbW91c2VyZWN0RGltZW5zaW9ucy53aWR0aCArIHRvb2x0aXBEaW1lbnNpb25zLndpZHRoICsgODtcbiAgICB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuXG4gICAgLy8gZmxpcCB0aGUgdG9vbHRpcCBwb3NpdGlvbnMgaWYgbmVhciB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgc2NyZWVuXG4gICAgaWYgKGRpbWVuc2lvbkNhbGN1bGF0ZWQgPiBjbGllbnRXaWR0aCkge1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ2Vhc3QnLCB0cnVlKTtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgZmFsc2UpO1xuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xuICAgICAgICB4UG9zaXRpb24gPSBgJHttb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyAobW91c2VyZWN0RGltZW5zaW9ucy53aWR0aCAvIDgpICogMyAtIHRvb2x0aXBEaW1lbnNpb25zLndpZHRoIC0gOH1weGA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4UG9zaXRpb24gPSBgJHttb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyAobW91c2VyZWN0RGltZW5zaW9ucy53aWR0aCAvIDQpICogMSAtIHRvb2x0aXBEaW1lbnNpb25zLndpZHRoIC0gOH1weGA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkaW1lbnNpb25DYWxjdWxhdGVkIDwgY2xpZW50V2lkdGgpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdlYXN0JywgZmFsc2UpO1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3dlc3QnLCB0cnVlKTtcblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcbiAgICAgICAgeFBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgKG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggLyA4KSAqIDUgKyA4fXB4YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gNCkgKiAzICsgOH1weGA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgeVBvc2l0aW9uID0gdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLmZpbHRlcignOmxhc3QtY2hpbGQnKVxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleClcbiAgICAgIC5ub2RlKClcbiAgICAgIC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIC8vIHNldCB0aGUgdG9vbHRpcCBzdHlsZXNcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAke3lQb3NpdGlvbi50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC8gMiArIHNjcm9sbFsxXX1weGApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIHhQb3NpdGlvbik7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICBwcml2YXRlIHlBeGlzRm9ybWF0dGVyID0gaXRlbSA9PiB7XG4gICAgc3dpdGNoICh0aGlzLnlBeGlzRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQoaXRlbSk7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQocGFyc2VEYXRlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9O1xufVxuIl19
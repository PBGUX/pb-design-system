import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { max as d3_max, min as d3_min } from "d3-array";
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft, axisTop as d3_axisTop } from 'd3-axis';
import { scaleBand as d3_scaleBand, scaleLinear as d3_scaleLinear, scaleOrdinal as d3_scaleOrdinal } from 'd3-scale';
import { select as d3_select } from 'd3-selection';
import { stack as d3_stack, stackOffsetDiverging, stackOrderNone as d3_stackOrderNone } from 'd3-shape';
import { isoParse as d3_isoParse } from 'd3-time-format';
import * as i0 from "@angular/core";
import * as i1 from "./dataviz.service";
import * as i2 from "@angular/common";
export class PbdsDatavizBarStackedComponent {
    constructor(_dataviz, _element, _scroll) {
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this.chartClass = true;
        this.stackedBarClass = true;
        this.width = 306;
        this.height = 400;
        this.type = 'medium'; // debug to show all chart options
        this.marginTop = 10; // hardcoded on purpose, do not document until feedback
        this.marginRight = 0; // hardcoded on purpose, do not document until feedback
        this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
        this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
        this.hideXAxis = false;
        this.xAxisFormatType = null;
        this.xAxisFormatString = '';
        this.xAxisTitle = null;
        this.yAxisFormatType = null;
        this.yAxisFormatString = '';
        this.yAxisTicks = 5;
        this.yAxisMaxBuffer = 0.01;
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'bottom';
        this.legendLabelFormatType = null;
        this.legendLabelFormatString = '';
        this.tooltipHeadingFormatType = null;
        this.tooltipHeadingFormatString = '';
        this.tooltipHeadingSuffix = '';
        this.tooltipHeadingValueFormatType = null;
        this.tooltipHeadingValueFormatString = '';
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.customColor = false;
        this.colorsArray = [];
        this.rotateXaxis = true;
        this.isDiverging = false;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (firstRun = true) => {
            this.dataKeys = Object.keys(this.data[0]).filter((item) => item !== 'key');
            // create the D3 stack data
            if (this.isDiverging) {
                this.dataStack = d3_stack().keys(this.dataKeys).offset(stackOffsetDiverging)(this.data);
            }
            else {
                this.dataStack = d3_stack().keys(this.dataKeys).order(d3_stackOrderNone)(this.data);
            }
            // update the xScale
            this.xAxisScale.domain(this.data.map((d) => d.key));
            // update the yScale
            this.yAxisMin = d3_min(this.dataStack, (data) => {
                return d3_min(data, (d) => {
                    return d[0];
                });
            });
            this.yAxisMax = d3_max(this.dataStack, (data) => {
                return d3_max(data, (d) => {
                    return d[1];
                });
            });
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale.domain([this.yAxisMin, this.yAxisMax]).rangeRound([this.height, 0]).nice();
            this.xAxis
                .transition()
                .duration(0) // 1000
                .call(this.xAxisCall);
            this.yAxis
                .transition()
                .duration(0) // 1000
                .call(this.yAxisCall);
            if (this.isDiverging) {
                const center = d3_scaleLinear().range([0, this.width]);
                const centerLine = d3_axisTop(center).ticks(0);
                this.svg
                    .append('g')
                    .attr('class', 'centerline')
                    .attr('transform', `translate(0, ${this.yAxisScale(0)})`)
                    .call(centerLine);
            }
            else {
                this.svg.selectAll('.centerline').remove();
            }
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
                    .join((enter) => enter
                    .append('rect')
                    .attr('class', 'gray-bar')
                    .attr('x', (d) => this.xAxisScale(d.key))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height), (update) => update
                    .transition()
                    .duration((d, i, n) => (firstRun ? 0 : 1000))
                    .attr('x', (d) => this.xAxisScale(d.key))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height)
                    .selection(), (exit) => exit.remove());
            }
            // add colored bars
            const barGroups = this.bars
                .selectAll('.bar-group')
                .data(this.dataStack)
                .join((enter) => enter
                .append('g')
                .attr('class', 'bar-group')
                .attr('fill', (d) => this.colorRange(d.index)), (update) => update.attr('fill', (d) => this.colorRange(d.index)), (exit) => exit.remove());
            barGroups
                .selectAll('.bar')
                .data((d) => d)
                .join((enter) => enter
                .append('rect')
                .attr('class', 'bar')
                .classed('bar-divided', this.type !== 'high')
                .classed('bar-divided-low', this.type === 'low')
                .attr('x', (d, i) => {
                let x;
                if (this.type === 'medium') {
                    x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 8) * 3;
                }
                else {
                    x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 4) * 1;
                }
                return x;
            })
                .attr('y', (d) => this.yAxisScale(d[0]))
                .attr('width', (d) => {
                let width;
                if (this.type === 'medium') {
                    width = this.xAxisScale.bandwidth() / 4;
                }
                else {
                    width = this.xAxisScale.bandwidth() / 2;
                }
                return width;
            })
                .attr('height', 0)
                .call((enter) => {
                enter
                    .transition()
                    .duration((d, i, n) => (firstRun ? 0 : 500))
                    .delay((d, i, n) => (firstRun ? 0 : 750))
                    .attr('y', (d) => this.yAxisScale(d[1]))
                    .attr('height', (d) => {
                    return this.yAxisScale(d[0]) - this.yAxisScale(d[1]);
                });
                return enter;
            }), (update) => update.call((update) => {
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
                    .attr('x', (d, i) => this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 8) * 3)
                    .attr('y', (d) => this.yAxisScale(d[1]))
                    .attr('height', (d) => this.yAxisScale(d[0]) - this.yAxisScale(d[1]))
                    .selection();
                return update;
            }), (exit) => exit.remove());
            // mouseover bars
            this.mouseBars
                .selectAll('.mouseover-bar')
                .data(this.data)
                .join((enter) => enter
                .append('rect')
                .attr('class', 'mouseover-bar')
                .style('opacity', 0)
                .attr('x', (d) => this.xAxisScale(d.key))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height), (update) => update
                .attr('pointer-events', 'none')
                .attr('x', (d) => this.xAxisScale(d.key))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height)
                .transition()
                .selection()
                .attr('pointer-events', 'auto'), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove())
                .datum((d, i) => {
                return { data: d, index: i };
            })
                .on('mouseover', (event, data) => this.barMouseOver(event, data))
                .on('mouseout', (event, data) => this.barMouseOut())
                .on('click', (event, data) => this.barMouseClick(event, data));
            this.bars.raise();
            this.xAxis.raise();
            this.mouseBars.raise();
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.dataStack)
                    .join((enter) => {
                    const li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (d) => this.colorRange(d.index));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html((d) => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d.key);
                            case 'time':
                                const parsedTime = d3_isoParse(d.key);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
                        }
                    });
                    return li;
                }, (update) => {
                    update.select('.legend-label').html((d) => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d.key);
                            case 'time':
                                const parsedTime = d3_isoParse(d.key);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
                        }
                    });
                    return update;
                }, (exit) => exit.remove())
                    .datum((d, i) => {
                    return { data: this.data, index: i };
                })
                    .on('mouseover', (event, data) => this.legendMouseOver(event, data))
                    .on('mouseout', () => this.legendMouseOut())
                    .on('click', (event, data) => this.legendMouseClick(event, data));
            }
        };
        this.barMouseOver = (event, data) => {
            this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((d, i) => {
                return i !== data.index;
            })
                .classed('inactive', true);
            this.tooltipShow(event, data);
            this.hovered.emit({ event, data });
        };
        this.barMouseOut = () => {
            this.chart.selectAll('.bar').classed('inactive', false);
            this.tooltipHide();
        };
        this.barMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.legendMouseOver = (event, data) => {
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== data.index)
                .classed('inactive', true);
            this.chart
                .selectAll('.bar-group')
                .filter((d, i) => i !== data.index)
                .classed('inactive', true);
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.bar-group').classed('inactive', false);
            this.tooltipHide();
        };
        this.legendMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.xAxisFormatter = (item) => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return this.xAxisFormat(item);
                case 'time':
                    const parseDate = d3_isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        };
        this.tooltipShow = (event, data) => {
            const scroll = this._scroll.getScrollPosition();
            const mouserectDimensions = event.currentTarget.getBoundingClientRect();
            const clientWidth = document.body.clientWidth - 10;
            let dimensionCalculated;
            let tooltipDimensions;
            let tooltipOffsetHeight;
            // const yPosition = event.currentTarget.getBoundingClientRect();
            let yPosition;
            let xPosition;
            // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
            this.tooltip.select('.tooltip-header').html((d) => {
                switch (this.tooltipHeadingFormatType) {
                    case 'time':
                        const parseDate = d3_isoParse(data.data.key);
                        return `${this.tooltipHeadingFormat(parseDate)}${this.tooltipHeadingSuffix}`;
                    default:
                        return `${data.data.key}${this.tooltipHeadingSuffix}`;
                }
            });
            this.tooltip.select('.tooltip-header-value').html((d) => {
                let total = 0;
                Object.keys(data.data).map((e) => {
                    if (e !== 'key') {
                        total = total + data.data[e];
                    }
                });
                return this.tooltipHeadingValueFormat(total);
            });
            this.tooltip
                .select('.tooltip-table')
                .select('tbody')
                .html((d) => {
                let html = ``;
                Object.keys(data.data).map((key, index) => {
                    let label;
                    let value = data.data[key];
                    switch (this.tooltipLabelFormatType) {
                        case 'time':
                            const parseDate = d3_isoParse(key);
                            label = this.tooltipHeadingFormat(parseDate);
                            break;
                        default:
                            label = key;
                    }
                    switch (this.tooltipValueFormatType) {
                        case 'number':
                            if (value === null || value === undefined) {
                                value = '';
                            }
                            else {
                                value = this.tooltipValueFormat(data.data[key]);
                            }
                            break;
                        default:
                            value = data.data[key];
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
                });
                return html;
            });
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
                .filter((d, i) => {
                return i === data.index;
            })
                .node()
                .getBoundingClientRect();
            // set the tooltip styles
            this.tooltip.style('top', `${yPosition.top - tooltipOffsetHeight / 2 + scroll[1]}px`);
            this.tooltip.style('left', xPosition);
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.yAxisFormatter = (item) => {
            switch (this.yAxisFormatType) {
                case 'number':
                    return this.yAxisFormat(item);
                case 'time':
                    const parseDate = d3_isoParse(item);
                    return this.yAxisFormat(parseDate);
                default:
                    return item;
            }
        };
    }
    ngOnInit() {
        // extract keys for stack data
        this.dataKeys = Object.keys(this.data[0]).filter((item) => item !== 'key');
        // create the D3 stack data
        if (this.isDiverging) {
            this.dataStack = d3_stack().keys(this.dataKeys).offset(stackOffsetDiverging)(this.data);
        }
        else {
            this.dataStack = d3_stack().keys(this.dataKeys).order(d3_stackOrderNone)(this.data);
        }
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
        this.xAxisTitleMargin = this.xAxisTitle ? 30 : 0;
        // adjust margin if xAxis hidden
        //if (this.hideXAxis) this.margin.bottom = 10; // need small margin for yAxis with 0 tick label
        if (!this.hideLegend && this.legendPosition === 'right') {
            this.width = +this.width - +this.legendWidth;
        }
        // create the chart
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
        }
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
        debugger;
        const colors = this.customColor ? this.colorsArray : this._dataviz.getColors(false, this.theme);
        this.colorRange = d3_scaleOrdinal().range(colors);
        // X AXIS
        this.xAxisScale = d3_scaleBand()
            .domain(this.data.map((d) => d.key))
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
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${this.svg.attr('width') / 2 - this.margin.left / 2 - this.margin.right / 2}, ${+this.height + +this.margin.top + (this.hideXAxis ? 20 : 40)})`)
                .text(this.xAxisTitle);
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
        this.yAxisMin = d3_min(this.dataStack, (data) => {
            return d3_min(data, (d) => {
                return d[0];
            });
        });
        this.yAxisMax = d3_max(this.dataStack, (data) => {
            return d3_max(data, (d) => {
                return d[1];
            });
        });
        this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
        this.yAxisScale = d3_scaleLinear().domain([this.yAxisMin, this.yAxisMax]).nice().rangeRound([this.height, 0]);
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
        if (this.isDiverging) {
            const center = d3_scaleLinear().range([0, this.width]);
            const centerLine = d3_axisTop(center).ticks(0);
            this.svg
                .append('g')
                .attr('class', 'centerline')
                .attr('transform', `translate(0, ${this.yAxisScale(0)})`)
                .call(centerLine);
        }
        else {
            this.svg.selectAll('.centerline').remove();
        }
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
            this.tooltip.append('table').attr('class', 'tooltip-table text-left w-100').append('tbody');
        }
        this.updateChart();
    }
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart(false);
        }
    }
}
PbdsDatavizBarStackedComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsDatavizBarStackedComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBarStackedComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: PbdsDatavizBarStackedComponent, selector: "pbds-dataviz-bar-stacked", inputs: { data: "data", width: "width", height: "height", type: "type", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", hideXAxis: "hideXAxis", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", xAxisTitle: "xAxisTitle", yAxisFormatType: "yAxisFormatType", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", yAxisMaxBuffer: "yAxisMaxBuffer", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", tooltipHeadingFormatType: "tooltipHeadingFormatType", tooltipHeadingFormatString: "tooltipHeadingFormatString", tooltipHeadingSuffix: "tooltipHeadingSuffix", tooltipHeadingValueFormatType: "tooltipHeadingValueFormatType", tooltipHeadingValueFormatString: "tooltipHeadingValueFormatString", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", theme: "theme", customColor: "customColor", colorsArray: "colorsArray", totalSavings: "totalSavings", rotateXaxis: "rotateXaxis", isDiverging: "isDiverging" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-stacked-bar": "this.stackedBarClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsDatavizBarStackedComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-bar-stacked', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: i1.PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], stackedBarClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-stacked-bar']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], type: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], hideXAxis: [{
                type: Input
            }], xAxisFormatType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], xAxisTitle: [{
                type: Input
            }], yAxisFormatType: [{
                type: Input
            }], yAxisFormatString: [{
                type: Input
            }], yAxisTicks: [{
                type: Input
            }], yAxisMaxBuffer: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendPosition: [{
                type: Input
            }], legendLabelFormatType: [{
                type: Input
            }], legendLabelFormatString: [{
                type: Input
            }], tooltipHeadingFormatType: [{
                type: Input
            }], tooltipHeadingFormatString: [{
                type: Input
            }], tooltipHeadingSuffix: [{
                type: Input
            }], tooltipHeadingValueFormatType: [{
                type: Input
            }], tooltipHeadingValueFormatString: [{
                type: Input
            }], tooltipLabelFormatType: [{
                type: Input
            }], tooltipLabelFormatString: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], theme: [{
                type: Input
            }], customColor: [{
                type: Input
            }], colorsArray: [{
                type: Input
            }], totalSavings: [{
                type: Input
            }], rotateXaxis: [{
                type: Input
            }], isDiverging: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsWUFBWSxFQUNaLFdBQVcsRUFDWCxLQUFLLEVBSUwsTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDeEQsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsUUFBUSxJQUFJLFdBQVcsRUFBRSxPQUFPLElBQUksVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxTQUFTLElBQUksWUFBWSxFQUFFLFdBQVcsSUFBSSxjQUFjLEVBQUUsWUFBWSxJQUFJLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNySCxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxjQUFjLElBQUksaUJBQWlCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDeEcsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQVd6RCxNQUFNLE9BQU8sOEJBQThCO0lBbUt6QyxZQUFvQixRQUE0QixFQUFVLFFBQW9CLEVBQVUsT0FBeUI7UUFBN0YsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFqS2pILGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFNdkIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFdBQU0sR0FBRyxHQUFHLENBQUM7UUFHYixTQUFJLEdBQXdDLFFBQVEsQ0FBQyxDQUFDLGtDQUFrQztRQUd4RixjQUFTLEdBQUcsRUFBRSxDQUFDLENBQUMsdURBQXVEO1FBR3ZFLGdCQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsdURBQXVEO1FBR3hFLGlCQUFZLEdBQUcsRUFBRSxDQUFDLENBQUMsdURBQXVEO1FBRzFFLGVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyx1REFBdUQ7UUFHeEUsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUdsQixvQkFBZSxHQUFzQixJQUFJLENBQUM7UUFHMUMsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBR3ZCLGVBQVUsR0FBa0IsSUFBSSxDQUFDO1FBR2pDLG9CQUFlLEdBQXNCLElBQUksQ0FBQztRQUcxQyxzQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFHdkIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUdmLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBR3RCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFHbkIsZ0JBQVcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsdUVBQXVFO1FBRy9GLG1CQUFjLEdBQXVCLFFBQVEsQ0FBQztRQUc5QywwQkFBcUIsR0FBc0IsSUFBSSxDQUFDO1FBR2hELDRCQUF1QixHQUFHLEVBQUUsQ0FBQztRQUc3Qiw2QkFBd0IsR0FBVyxJQUFJLENBQUM7UUFHeEMsK0JBQTBCLEdBQUcsRUFBRSxDQUFDO1FBR2hDLHlCQUFvQixHQUFHLEVBQUUsQ0FBQztRQUcxQixrQ0FBNkIsR0FBYSxJQUFJLENBQUM7UUFHL0Msb0NBQStCLEdBQUcsRUFBRSxDQUFDO1FBR3JDLDJCQUFzQixHQUFXLElBQUksQ0FBQztRQUd0Qyw2QkFBd0IsR0FBRyxFQUFFLENBQUM7UUFHOUIsMkJBQXNCLEdBQWEsSUFBSSxDQUFDO1FBR3hDLDZCQUF3QixHQUFHLEVBQUUsQ0FBQztRQU05QixnQkFBVyxHQUFXLEtBQUssQ0FBQztRQUc1QixnQkFBVyxHQUFDLEVBQUUsQ0FBQztRQUlOLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBRzdCLFlBQU8sR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUczRCxZQUFPLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUF5VTNELGdCQUFXLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQztZQUUzRSwyQkFBMkI7WUFDM0IsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckY7WUFFRCxvQkFBb0I7WUFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRXBELG9CQUFvQjtZQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBUyxFQUFFLEVBQUU7Z0JBQ25ELE9BQU8sTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFO29CQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQVMsRUFBRSxFQUFFO2dCQUNuRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRTtvQkFDN0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7WUFFcEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUUzRixJQUFJLENBQUMsS0FBSztpQkFDUCxVQUFVLEVBQUU7aUJBQ1osUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87aUJBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFeEIsSUFBSSxDQUFDLEtBQUs7aUJBQ1AsVUFBVSxFQUFFO2lCQUNaLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO2lCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRXhCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsTUFBTSxNQUFNLEdBQUcsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUV2RCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLENBQUMsR0FBRztxQkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDO3FCQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO3FCQUMzQixJQUFJLENBQUMsV0FBVyxFQUFFLGdCQUFnQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQ3hELElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNyQjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUM1QztZQUVELG1CQUFtQjtZQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLEtBQUs7cUJBQ1AsVUFBVSxFQUFFO3FCQUNaLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO3FCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3pCO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxLQUFLO3FCQUNQLFVBQVUsRUFBRTtxQkFDWixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztxQkFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN6QjtZQUVELGdCQUFnQjtZQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFFBQVE7cUJBQ1YsU0FBUyxDQUFDLFdBQVcsQ0FBQztxQkFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7cUJBQ2YsSUFBSSxDQUNILENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FDUixLQUFLO3FCQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUM7cUJBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7cUJBQ3pCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN4QyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7cUJBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUNoQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ1QsTUFBTTtxQkFDSCxVQUFVLEVBQUU7cUJBQ1osUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUM1QyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDeEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO3FCQUMxQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7cUJBQzNCLFNBQVMsRUFBRSxFQUNoQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUN4QixDQUFDO2FBQ0w7WUFFRCxtQkFBbUI7WUFDbkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUk7aUJBQ3hCLFNBQVMsQ0FBQyxZQUFZLENBQUM7aUJBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUNwQixJQUFJLENBQ0gsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUNSLEtBQUs7aUJBQ0YsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQztpQkFDMUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDbEQsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUNoRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUN4QixDQUFDO1lBRUosU0FBUztpQkFDTixTQUFTLENBQUMsTUFBTSxDQUFDO2lCQUNqQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDZCxJQUFJLENBQ0gsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUNSLEtBQUs7aUJBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQztpQkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztpQkFDcEIsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQztpQkFDNUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDO2lCQUMvQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsQixJQUFJLENBQUMsQ0FBQztnQkFFTixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO29CQUMxQixDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3pFO3FCQUFNO29CQUNMLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDekU7Z0JBRUQsT0FBTyxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdkMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNuQixJQUFJLEtBQUssQ0FBQztnQkFFVixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO29CQUMxQixLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQ3pDO3FCQUFNO29CQUNMLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDekM7Z0JBRUQsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7aUJBQ2pCLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNkLEtBQUs7cUJBQ0YsVUFBVSxFQUFFO3FCQUNaLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDM0MsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN4QyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2QyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ3BCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxDQUFDLENBQUMsQ0FBQztnQkFFTCxPQUFPLEtBQUssQ0FBQztZQUNmLENBQUMsQ0FBQyxFQUNOLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDVCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ3JCLGFBQWE7Z0JBRWIsZ0NBQWdDO2dCQUNoQyw2Q0FBNkM7Z0JBQzdDLFdBQVc7Z0JBQ1gsNkNBQTZDO2dCQUM3QyxJQUFJO2dCQUVKLE1BQU07cUJBQ0gsVUFBVSxFQUFFO3FCQUNaLFFBQVEsQ0FBQyxJQUFJLENBQUM7cUJBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDOUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN4RixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2QyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3BFLFNBQVMsRUFBRSxDQUFDO2dCQUVmLE9BQU8sTUFBTSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxFQUVKLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQ3hCLENBQUM7WUFFSixpQkFBaUI7WUFDakIsSUFBSSxDQUFDLFNBQVM7aUJBQ1gsU0FBUyxDQUFDLGdCQUFnQixDQUFDO2lCQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDZixJQUFJLENBQ0gsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUNSLEtBQUs7aUJBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQztpQkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQztpQkFDOUIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7aUJBQ25CLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN4QyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7aUJBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUNoQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ1QsTUFBTTtpQkFDSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDO2lCQUM5QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDeEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO2lCQUMxQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQzNCLFVBQVUsRUFBRTtpQkFDWixTQUFTLEVBQUU7aUJBQ1gsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxFQUNuQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FDaEY7aUJBQ0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNkLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUMvQixDQUFDLENBQUM7aUJBQ0QsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNoRSxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUNuRCxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUVqRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLEtBQUs7cUJBQ1AsTUFBTSxDQUFDLFNBQVMsQ0FBQztxQkFDakIsU0FBUyxDQUFDLGNBQWMsQ0FBQztxQkFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7cUJBQ3BCLElBQUksQ0FDSCxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUNSLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztvQkFFM0QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7eUJBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7eUJBQzNCLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFFOUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7eUJBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUM7eUJBQzdCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNWLFFBQVEsSUFBSSxDQUFDLHFCQUFxQixFQUFFOzRCQUNsQyxLQUFLLFFBQVE7Z0NBQ1gsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUV2QyxLQUFLLE1BQU07Z0NBQ1QsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FDdEMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7NEJBRTVDO2dDQUNFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQzt5QkFDaEI7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7b0JBRUwsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQyxFQUNELENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQ1QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDeEMsUUFBUSxJQUFJLENBQUMscUJBQXFCLEVBQUU7NEJBQ2xDLEtBQUssUUFBUTtnQ0FDWCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBRXZDLEtBQUssTUFBTTtnQ0FDVCxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUN0QyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQzs0QkFFNUM7Z0NBQ0UsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO3lCQUNoQjtvQkFDSCxDQUFDLENBQUMsQ0FBQztvQkFFSCxPQUFPLE1BQU0sQ0FBQztnQkFDaEIsQ0FBQyxFQUNELENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQ3hCO3FCQUNBLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDZCxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN2QyxDQUFDLENBQUM7cUJBQ0QsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUNuRSxFQUFFLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztxQkFDM0MsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNyRTtRQUNILENBQUMsQ0FBQztRQUVGLGlCQUFZLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDN0IsSUFBSSxDQUFDLEtBQUs7aUJBQ1AsU0FBUyxDQUFDLFlBQVksQ0FBQztpQkFDdkIsU0FBUyxDQUFDLE1BQU0sQ0FBQztpQkFDakIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNmLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDMUIsQ0FBQyxDQUFDO2lCQUNELE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUM7UUFFRixnQkFBVyxHQUFHLEdBQUcsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRXhELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUM7UUFFRixrQkFBYSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDO1FBRUYsb0JBQWUsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNoQyxJQUFJLENBQUMsS0FBSztpQkFDUCxTQUFTLENBQUMsY0FBYyxDQUFDO2lCQUN6QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDbEMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsS0FBSztpQkFDUCxTQUFTLENBQUMsWUFBWSxDQUFDO2lCQUN2QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDbEMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQztRQUVGLG1CQUFjLEdBQUcsR0FBRyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFaEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUU5RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDO1FBRUYscUJBQWdCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUM7UUFFTSxtQkFBYyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDaEMsUUFBUSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUM1QixLQUFLLFFBQVE7b0JBQ1gsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVoQyxLQUFLLE1BQU07b0JBQ1QsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXJDO29CQUNFLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7UUFDSCxDQUFDLENBQUM7UUFFTSxnQkFBVyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3BDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNoRCxNQUFNLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN4RSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDbkQsSUFBSSxtQkFBbUIsQ0FBQztZQUN4QixJQUFJLGlCQUFpQixDQUFDO1lBQ3RCLElBQUksbUJBQW1CLENBQUM7WUFDeEIsaUVBQWlFO1lBQ2pFLElBQUksU0FBUyxDQUFDO1lBQ2QsSUFBSSxTQUFTLENBQUM7WUFFZCxzSEFBc0g7WUFFdEgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDaEQsUUFBUSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7b0JBQ3JDLEtBQUssTUFBTTt3QkFDVCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDN0MsT0FBTyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztvQkFFL0U7d0JBQ0UsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2lCQUN6RDtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDdEQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUVkLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUMvQixJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7d0JBQ2YsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM5QjtnQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFFSCxPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxPQUFPO2lCQUNULE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQztpQkFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDVixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBRWQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO29CQUN4QyxJQUFJLEtBQUssQ0FBQztvQkFDVixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUUzQixRQUFRLElBQUksQ0FBQyxzQkFBc0IsRUFBRTt3QkFDbkMsS0FBSyxNQUFNOzRCQUNULE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDbkMsS0FBSyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFDN0MsTUFBTTt3QkFFUjs0QkFDRSxLQUFLLEdBQUcsR0FBRyxDQUFDO3FCQUNmO29CQUVELFFBQVEsSUFBSSxDQUFDLHNCQUFzQixFQUFFO3dCQUNuQyxLQUFLLFFBQVE7NEJBQ1gsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0NBQ3pDLEtBQUssR0FBRyxFQUFFLENBQUM7NkJBQ1o7aUNBQU07Z0NBQ0wsS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7NkJBQ2pEOzRCQUNELE1BQU07d0JBRVI7NEJBQ0UsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzFCO29CQUVELElBQUksR0FBRyxLQUFLLEtBQUssRUFBRTt3QkFDakIsSUFBSSxJQUFJOztvQ0FFZ0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDOzs7NkRBR0QsS0FBSzttRUFDQyxLQUFLOzthQUUzRCxDQUFDO3FCQUNIO2dCQUNILENBQUMsQ0FBQyxDQUFDO2dCQUVILE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7WUFFTCxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDaEUsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxHQUFHLG1CQUFtQixDQUFDLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ3pHLG1CQUFtQixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFFeEQsa0VBQWtFO1lBQ2xFLElBQUksbUJBQW1CLEdBQUcsV0FBVyxFQUFFO2dCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDMUIsU0FBUyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsbUJBQW1CLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUM7aUJBQ2pIO3FCQUFNO29CQUNMLFNBQVMsR0FBRyxHQUFHLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDO2lCQUNqSDthQUNGO2lCQUFNLElBQUksbUJBQW1CLEdBQUcsV0FBVyxFQUFFO2dCQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFbkMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDMUIsU0FBUyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsbUJBQW1CLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztpQkFDdkY7cUJBQU07b0JBQ0wsU0FBUyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsbUJBQW1CLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztpQkFDdkY7YUFDRjtZQUVELFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRztpQkFDakIsU0FBUyxDQUFDLFlBQVksQ0FBQztpQkFDdkIsTUFBTSxDQUFDLGFBQWEsQ0FBQztpQkFDckIsU0FBUyxDQUFDLE1BQU0sQ0FBQztpQkFDakIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNmLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDMUIsQ0FBQyxDQUFDO2lCQUNELElBQUksRUFBRTtpQkFDTixxQkFBcUIsRUFBRSxDQUFDO1lBRTNCLHlCQUF5QjtZQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxTQUFTLENBQUMsR0FBRyxHQUFHLG1CQUFtQixHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBRU0sZ0JBQVcsR0FBRyxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQztRQUVNLG1CQUFjLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNoQyxRQUFRLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQzVCLEtBQUssUUFBUTtvQkFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWhDLEtBQUssTUFBTTtvQkFDVCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3BDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFckM7b0JBQ0UsT0FBTyxJQUFJLENBQUM7YUFDZjtRQUNILENBQUMsQ0FBQztJQXZ2QmtILENBQUM7SUFFckgsUUFBUTtRQUNOLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBRTNFLDJCQUEyQjtRQUMzQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6RjthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyRjtRQUVELDBDQUEwQztRQUUxQyxJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1osR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFDcEIsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDeEIsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVk7WUFDMUIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVU7U0FDdkIsQ0FBQztRQUVGLG9CQUFvQjtRQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDMUcsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUNuSCxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQ3JELElBQUksQ0FBQyw2QkFBNkIsRUFDbEMsSUFBSSxDQUFDLCtCQUErQixDQUNyQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3RyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBRTdHLCtCQUErQjtRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7UUFDNUIsaUNBQWlDO1FBRWpDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7WUFDekIsb0JBQW9CO1lBQ3BCLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDakIsS0FBSyxLQUFLO29CQUNSLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUN6QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO29CQUM3QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7b0JBQy9CLE1BQU07Z0JBRVIsS0FBSyxRQUFRO29CQUNYLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO29CQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7b0JBQzNCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO29CQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ3RCLE1BQU07Z0JBRVIsS0FBSyxNQUFNO29CQUNULElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7b0JBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztvQkFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7b0JBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztvQkFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7b0JBQy9CLE1BQU07YUFDVDtTQUNGO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpELGdDQUFnQztRQUNoQywrRkFBK0Y7UUFFL0YsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxPQUFPLEVBQUU7WUFDdkQsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzlDO1FBRUQsbUJBQW1CO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVoRixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsY0FBYyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGlCQUFpQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztTQUMvRTtRQUNELG1CQUFtQjtRQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLO2FBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDYixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUMxQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUNuRSxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQzthQUMxQixJQUFJLENBQUMscUJBQXFCLEVBQUUsZUFBZSxDQUFDO2FBQzVDLElBQUksQ0FDSCxTQUFTLEVBQ1QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQ3JELENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQy9DLEVBQUUsQ0FDSCxDQUFDO1FBRUosSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV2RCxxQkFBcUI7UUFDckIsUUFBUSxDQUFBO1FBQ1IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRyxJQUFJLENBQUMsVUFBVSxHQUFHLGVBQWUsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVsRCxTQUFTO1FBQ1QsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLEVBQUU7YUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFWix5Q0FBeUM7UUFDekMsQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7YUFDNUIsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQzthQUN0QyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUc7YUFDbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO2FBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQzthQUNqRCxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDdEMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUM7YUFDL0MsT0FBTyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUM7YUFDbkQsT0FBTyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV4QixjQUFjO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV2RSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHO2lCQUNsQixNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO2lCQUM1QixPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQztpQkFDL0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDO2lCQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsZUFBZTtRQUNmLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsR0FBRztpQkFDTCxNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO2lCQUMzQixJQUFJLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQztpQkFDN0IsSUFBSSxDQUNILFdBQVcsRUFDWCxhQUFhLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUNwRixDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUM3RCxHQUFHLENBQ0o7aUJBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMxQjtRQUVELHlDQUF5QztRQUN6QyxlQUFlO1FBQ2YsNENBQTRDO1FBQzVDLDRCQUE0QjtRQUU1Qix3Q0FBd0M7UUFDeEMsa0NBQWtDO1FBQ2xDLHFCQUFxQjtRQUNyQixVQUFVO1FBQ1YsT0FBTztRQUNQLEtBQUs7UUFFTCxTQUFTO1FBQ1QsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQ25ELE9BQU8sTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFO2dCQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDbkQsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUU7Z0JBQzdCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFFcEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5RyxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQzFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQ3RCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO2FBQzVCLGFBQWEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7YUFDdEMsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHO2FBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQzthQUM1QixPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDdEMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUM7YUFDL0MsT0FBTyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUM7YUFDbkQsT0FBTyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV4QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsTUFBTSxNQUFNLEdBQUcsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRXZELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFL0MsSUFBSSxDQUFDLEdBQUc7aUJBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztpQkFDM0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2lCQUN4RCxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckI7YUFBTTtZQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQzVDO1FBRUQsY0FBYztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7aUJBQzFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2lCQUN0QixRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFaEUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRztpQkFDbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztpQkFDNUIsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUM7aUJBQy9DLElBQUksQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUM7aUJBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDekI7UUFFRCxVQUFVO1FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO2lCQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDO2lCQUNiLElBQUksQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUM7aUJBQ2xDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2lCQUNuQixJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUNBQWlDO1lBRWpFLGlCQUFpQjtZQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBRWpFLGdCQUFnQjtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLCtCQUErQixDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzdGO1FBSUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsT0FBTztZQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUM3QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQzs7NEhBMWJVLDhCQUE4QjtnSEFBOUIsOEJBQThCLDJnREFKL0IsRUFBRTs0RkFJRCw4QkFBOEI7a0JBTjFDLFNBQVM7K0JBQ0UsMEJBQTBCLFlBQzFCLEVBQUUsbUJBRUssdUJBQXVCLENBQUMsTUFBTTtpS0FJL0MsVUFBVTtzQkFEVCxXQUFXO3VCQUFDLGtCQUFrQjtnQkFJL0IsZUFBZTtzQkFEZCxXQUFXO3VCQUFDLDhCQUE4QjtnQkFJM0MsSUFBSTtzQkFESCxLQUFLO2dCQUlOLEtBQUs7c0JBREosS0FBSztnQkFJTixNQUFNO3NCQURMLEtBQUs7Z0JBSU4sSUFBSTtzQkFESCxLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sWUFBWTtzQkFEWCxLQUFLO2dCQUlOLFVBQVU7c0JBRFQsS0FBSztnQkFJTixTQUFTO3NCQURSLEtBQUs7Z0JBSU4sZUFBZTtzQkFEZCxLQUFLO2dCQUlOLGlCQUFpQjtzQkFEaEIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sZUFBZTtzQkFEZCxLQUFLO2dCQUlOLGlCQUFpQjtzQkFEaEIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sY0FBYztzQkFEYixLQUFLO2dCQUlOLFVBQVU7c0JBRFQsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sY0FBYztzQkFEYixLQUFLO2dCQUlOLHFCQUFxQjtzQkFEcEIsS0FBSztnQkFJTix1QkFBdUI7c0JBRHRCLEtBQUs7Z0JBSU4sd0JBQXdCO3NCQUR2QixLQUFLO2dCQUlOLDBCQUEwQjtzQkFEekIsS0FBSztnQkFJTixvQkFBb0I7c0JBRG5CLEtBQUs7Z0JBSU4sNkJBQTZCO3NCQUQ1QixLQUFLO2dCQUlOLCtCQUErQjtzQkFEOUIsS0FBSztnQkFJTixzQkFBc0I7c0JBRHJCLEtBQUs7Z0JBSU4sd0JBQXdCO3NCQUR2QixLQUFLO2dCQUlOLHNCQUFzQjtzQkFEckIsS0FBSztnQkFJTix3QkFBd0I7c0JBRHZCLEtBQUs7Z0JBSU4sS0FBSztzQkFESixLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sWUFBWTtzQkFEWCxLQUFLO2dCQUVHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFHTixPQUFPO3NCQUROLE1BQU07Z0JBSVAsT0FBTztzQkFETixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdEJpbmRpbmcsXHJcbiAgSW5wdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFNpbXBsZUNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuaW1wb3J0IHsgbWF4IGFzIGQzX21heCwgbWluIGFzIGQzX21pbiB9IGZyb20gXCJkMy1hcnJheVwiO1xyXG5pbXBvcnQgeyBheGlzQm90dG9tIGFzIGQzX2F4aXNCb3R0b20sIGF4aXNMZWZ0IGFzIGQzX2F4aXNMZWZ0LCBheGlzVG9wIGFzIGQzX2F4aXNUb3AgfSBmcm9tICdkMy1heGlzJztcclxuaW1wb3J0IHsgc2NhbGVCYW5kIGFzIGQzX3NjYWxlQmFuZCwgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsIHNjYWxlT3JkaW5hbCBhcyBkM19zY2FsZU9yZGluYWwgfSBmcm9tICdkMy1zY2FsZSc7XHJcbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xyXG5pbXBvcnQgeyBzdGFjayBhcyBkM19zdGFjaywgc3RhY2tPZmZzZXREaXZlcmdpbmcsIHN0YWNrT3JkZXJOb25lIGFzIGQzX3N0YWNrT3JkZXJOb25lIH0gZnJvbSAnZDMtc2hhcGUnO1xyXG5pbXBvcnQgeyBpc29QYXJzZSBhcyBkM19pc29QYXJzZSB9IGZyb20gJ2QzLXRpbWUtZm9ybWF0JztcclxuXHJcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyU3RhY2tlZCB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotYmFyLXN0YWNrZWQnLFxyXG4gIHRlbXBsYXRlOiBgYCxcclxuICBzdHlsZXM6IFtdLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekJhclN0YWNrZWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxyXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtc3RhY2tlZC1iYXInKVxyXG4gIHN0YWNrZWRCYXJDbGFzcyA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZGF0YTogQXJyYXk8UGJkc0RhdGF2aXpCYXJTdGFja2VkPjtcclxuXHJcbiAgQElucHV0KClcclxuICB3aWR0aCA9IDMwNjtcclxuXHJcbiAgQElucHV0KClcclxuICBoZWlnaHQgPSA0MDA7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdHlwZTogJ2xvdycgfCAnbWVkaXVtJyB8ICdoaWdoJyB8ICdkZWJ1ZycgPSAnbWVkaXVtJzsgLy8gZGVidWcgdG8gc2hvdyBhbGwgY2hhcnQgb3B0aW9uc1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1hcmdpblRvcCA9IDEwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWFyZ2luUmlnaHQgPSAwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWFyZ2luQm90dG9tID0gMzA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcclxuXHJcbiAgQElucHV0KClcclxuICBtYXJnaW5MZWZ0ID0gNTU7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcclxuXHJcbiAgQElucHV0KClcclxuICBoaWRlWEF4aXMgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICB4QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcclxuXHJcbiAgQElucHV0KClcclxuICB4QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHhBeGlzVGl0bGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHlBeGlzRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHlBeGlzRm9ybWF0U3RyaW5nID0gJyc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgeUF4aXNUaWNrcyA9IDU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgeUF4aXNNYXhCdWZmZXIgPSAwLjAxO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICBsZWdlbmRXaWR0aCA9IDEwNSArIDI4OyAvLyBoYXJkY29kZWQgbGVnZW5kIHdpZHRoICsgbGVmdCBtYXJnaW4sIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxlZ2VuZFBvc2l0aW9uOiAncmlnaHQnIHwgJ2JvdHRvbScgPSAnYm90dG9tJztcclxuXHJcbiAgQElucHV0KClcclxuICBsZWdlbmRMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcclxuXHJcbiAgQElucHV0KClcclxuICBsZWdlbmRMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvb2x0aXBIZWFkaW5nRm9ybWF0VHlwZTogJ3RpbWUnID0gbnVsbDtcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwSGVhZGluZ0Zvcm1hdFN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvb2x0aXBIZWFkaW5nU3VmZml4ID0gJyc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcExhYmVsRm9ybWF0VHlwZTogJ3RpbWUnID0gbnVsbDtcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdGhlbWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY3VzdG9tQ29sb3I6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNvbG9yc0FycmF5PVtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvdGFsU2F2aW5ncztcclxuICBASW5wdXQoKSByb3RhdGVYYXhpcyA9IHRydWU7XHJcbiAgQElucHV0KCkgaXNEaXZlcmdpbmcgPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcclxuXHJcbiAgcHJpdmF0ZSBkYXRhU3RhY2s7XHJcbiAgcHJpdmF0ZSBkYXRhS2V5cztcclxuICBwcml2YXRlIGNoYXJ0O1xyXG4gIHByaXZhdGUgc3ZnO1xyXG4gIHByaXZhdGUgZ3JheUJhcnM7XHJcbiAgcHJpdmF0ZSBtb3VzZUJhcnM7XHJcbiAgcHJpdmF0ZSBiYXJzO1xyXG4gIHByaXZhdGUgbWFyZ2luO1xyXG4gIHByaXZhdGUgY29sb3JSYW5nZTtcclxuICBwcml2YXRlIGhpZGVHcmF5QmFyczogYm9vbGVhbjtcclxuICBwcml2YXRlIHhBeGlzU2NhbGU7XHJcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XHJcbiAgcHJpdmF0ZSB4QXhpcztcclxuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xyXG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xyXG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSB4QXhpc1RpdGxlTWFyZ2luOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBoaWRlWEF4aXNEb21haW46IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBoaWRlWEF4aXNaZXJvOiBib29sZWFuO1xyXG4gIHByaXZhdGUgaGlkZVhBeGlzVGlja3M6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBoaWRlWEdyaWQ6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBoaWRlWUdyaWQ6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSB5QXhpc01heDtcclxuICBwcml2YXRlIHlBeGlzU2NhbGU7XHJcbiAgcHJpdmF0ZSB5QXhpc0NhbGw7XHJcbiAgcHJpdmF0ZSB5QXhpcztcclxuICBwcml2YXRlIHlBeGlzRm9ybWF0O1xyXG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZTogbnVtYmVyO1xyXG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSB4R3JpZDtcclxuICBwcml2YXRlIHhHcmlkQ2FsbDtcclxuICBwcml2YXRlIHlHcmlkO1xyXG4gIHByaXZhdGUgeUdyaWRDYWxsO1xyXG4gIHByaXZhdGUgaGlkZVlBeGlzOiBib29sZWFuO1xyXG4gIHByaXZhdGUgaGlkZVlBeGlzWmVybzogYm9vbGVhbjtcclxuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcclxuICBwcml2YXRlIGhpZGVZQXhpc1RpY2tzOiBib29sZWFuO1xyXG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XHJcbiAgcHJpdmF0ZSB0b29sdGlwO1xyXG4gIHByaXZhdGUgaGlkZVRvb2x0aXA6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSB0b29sdGlwSGVhZGluZ0Zvcm1hdDtcclxuICBwcml2YXRlIHRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXQ7XHJcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XHJcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XHJcbiAgeUF4aXNNaW46IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGF0YXZpejogUGJkc0RhdGF2aXpTZXJ2aWNlLCBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIpIHt9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy8gZXh0cmFjdCBrZXlzIGZvciBzdGFjayBkYXRhXHJcbiAgICB0aGlzLmRhdGFLZXlzID0gT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09ICdrZXknKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgdGhlIEQzIHN0YWNrIGRhdGFcclxuICAgIGlmICh0aGlzLmlzRGl2ZXJnaW5nKSB7XHJcbiAgICAgIHRoaXMuZGF0YVN0YWNrID0gZDNfc3RhY2soKS5rZXlzKHRoaXMuZGF0YUtleXMpLm9mZnNldChzdGFja09mZnNldERpdmVyZ2luZykodGhpcy5kYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGF0YVN0YWNrID0gZDNfc3RhY2soKS5rZXlzKHRoaXMuZGF0YUtleXMpLm9yZGVyKGQzX3N0YWNrT3JkZXJOb25lKSh0aGlzLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIHRoaXMubWFyZ2luID0ge1xyXG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcclxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxyXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcclxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xyXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFR5cGUsIHRoaXMueEF4aXNGb3JtYXRTdHJpbmcpO1xyXG4gICAgdGhpcy55QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy55QXhpc0Zvcm1hdFR5cGUsIHRoaXMueUF4aXNGb3JtYXRTdHJpbmcpO1xyXG4gICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUsIHRoaXMubGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcpO1xyXG4gICAgdGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdFR5cGUsIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcpO1xyXG4gICAgdGhpcy50b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdChcclxuICAgICAgdGhpcy50b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0VHlwZSxcclxuICAgICAgdGhpcy50b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0U3RyaW5nXHJcbiAgICApO1xyXG4gICAgdGhpcy50b29sdGlwTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcpO1xyXG4gICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcpO1xyXG5cclxuICAgIC8vIGRlZmF1bHRzIGZvciBhbGwgY2hhcnQgdHlwZXNcclxuICAgIHRoaXMuaGlkZUdyYXlCYXJzID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVZQXhpcyA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWEF4aXNaZXJvID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVZQXhpc1plcm8gPSBmYWxzZTtcclxuICAgIHRoaXMuaGlkZVhHcmlkID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVZR3JpZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSBmYWxzZTtcclxuICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVUb29sdGlwID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gZmFsc2U7XHJcbiAgICB0aGlzLnhBeGlzVGlja1NpemUgPSA4O1xyXG4gICAgdGhpcy54QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xyXG4gICAgdGhpcy55QXhpc1RpY2tTaXplID0gODtcclxuICAgIHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyID0gMDtcclxuICAgIC8vIHRoaXMuaGlkZVRvb2x0aXBMYWJlbCA9IGZhbHNlO1xyXG5cclxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdkZWJ1ZycpIHtcclxuICAgICAgLy8gc2V0IHR5cGUgZGVmYXVsdHNcclxuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdsb3cnOlxyXG4gICAgICAgICAgdGhpcy5oaWRlR3JheUJhcnMgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmxlZ2VuZFBvc2l0aW9uID0gJ2JvdHRvbSc7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnbWVkaXVtJzpcclxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVhHcmlkID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVZR3JpZCA9IHRydWU7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnaGlnaCc6XHJcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpcyA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVhHcmlkID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWUdyaWQgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlTGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLmxlZ2VuZFBvc2l0aW9uID0gJ2JvdHRvbSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMueEF4aXNUaXRsZU1hcmdpbiA9IHRoaXMueEF4aXNUaXRsZSA/IDMwIDogMDtcclxuXHJcbiAgICAvLyBhZGp1c3QgbWFyZ2luIGlmIHhBeGlzIGhpZGRlblxyXG4gICAgLy9pZiAodGhpcy5oaWRlWEF4aXMpIHRoaXMubWFyZ2luLmJvdHRvbSA9IDEwOyAvLyBuZWVkIHNtYWxsIG1hcmdpbiBmb3IgeUF4aXMgd2l0aCAwIHRpY2sgbGFiZWxcclxuXHJcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCAmJiB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcclxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcclxuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XHJcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xyXG4gICAgfVxyXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xyXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XHJcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXHJcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoKVxyXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tKVxyXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcclxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXHJcbiAgICAgIC5hdHRyKFxyXG4gICAgICAgICd2aWV3Qm94JyxcclxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRofSAke1xyXG4gICAgICAgICAgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tXHJcbiAgICAgICAgfWBcclxuICAgICAgKTtcclxuXHJcbiAgICB0aGlzLmdyYXlCYXJzID0gdGhpcy5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnZ3JheS1iYXJzJyk7XHJcbiAgICB0aGlzLm1vdXNlQmFycyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ21vdXNlb3Zlci1iYXJzJyk7XHJcbiAgICB0aGlzLmJhcnMgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdiYXJzJyk7XHJcblxyXG4gICAgLy8gYnVpbGQgY29sb3IgcmFuZ2VzXHJcbiAgICBkZWJ1Z2dlclxyXG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5jdXN0b21Db2xvciA/IHRoaXMuY29sb3JzQXJyYXkgOiB0aGlzLl9kYXRhdml6LmdldENvbG9ycyhmYWxzZSwgdGhpcy50aGVtZSk7XHJcbiAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKS5yYW5nZShjb2xvcnMpO1xyXG5cclxuICAgIC8vIFggQVhJU1xyXG4gICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVCYW5kKClcclxuICAgICAgLmRvbWFpbih0aGlzLmRhdGEubWFwKChkKSA9PiBkLmtleSkpXHJcbiAgICAgIC5yYW5nZVJvdW5kKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdF0pXHJcbiAgICAgIC5hbGlnbigwKTtcclxuXHJcbiAgICAvLyBhZGQgcGFkZGluZyB0byB0aGUgc2NhbGUgZm9yIGdyYXkgYmFyc1xyXG4gICAgIXRoaXMuaGlkZUdyYXlCYXJzXHJcbiAgICAgID8gdGhpcy54QXhpc1NjYWxlLnBhZGRpbmdJbm5lcigwLjEpLnBhZGRpbmdPdXRlcigwKVxyXG4gICAgICA6IHRoaXMueEF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMCkucGFkZGluZ091dGVyKDApO1xyXG5cclxuICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXHJcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnhBeGlzVGlja1NpemUpXHJcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxyXG4gICAgICAudGlja0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0dGVyKTtcclxuXHJcbiAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcclxuICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXHJcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXHJcbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzKVxyXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcclxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxyXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1RpY2tzKVxyXG4gICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XHJcblxyXG4gICAgLy8gWCBHUklETElORVNcclxuICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcclxuICAgICAgdGhpcy54R3JpZENhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSkudGlja1NpemUoLXRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgIHRoaXMueEdyaWQgPSB0aGlzLnN2Z1xyXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteCcpXHJcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXHJcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcclxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gWCBBWElTIFRJVExFXHJcbiAgICBpZiAodGhpcy54QXhpc1RpdGxlKSB7XHJcbiAgICAgIHRoaXMuc3ZnXHJcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMtdGl0bGUnKVxyXG4gICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxyXG4gICAgICAgIC5hdHRyKFxyXG4gICAgICAgICAgJ3RyYW5zZm9ybScsXHJcbiAgICAgICAgICBgdHJhbnNsYXRlKCR7dGhpcy5zdmcuYXR0cignd2lkdGgnKSAvIDIgLSB0aGlzLm1hcmdpbi5sZWZ0IC8gMiAtIHRoaXMubWFyZ2luLnJpZ2h0IC8gMn0sICR7XHJcbiAgICAgICAgICAgICt0aGlzLmhlaWdodCArICt0aGlzLm1hcmdpbi50b3AgKyAodGhpcy5oaWRlWEF4aXMgPyAyMCA6IDQwKVxyXG4gICAgICAgICAgfSlgXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC50ZXh0KHRoaXMueEF4aXNUaXRsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gS0VFUDogdXNlIHRoaXMgYmxvY2sgdG8gZGVidWcgeUF4aXNNYXhcclxuICAgIC8vIGNvbnNvbGUubG9nKFxyXG4gICAgLy8gICBkM19tYXgodGhpcy5kYXRhU3RhY2ssIChkYXRhOiBhbnkpID0+IHtcclxuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIGQzX21heChkYXRhLCAoZDogYW55KSA9PiB7XHJcbiAgICAvLyAgICAgICAvLyBjb25zb2xlLmxvZygnRDogJywgZCk7XHJcbiAgICAvLyAgICAgICByZXR1cm4gZFsxXTtcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgfSlcclxuICAgIC8vICk7XHJcblxyXG4gICAgLy8gWSBBWElTXHJcbiAgICB0aGlzLnlBeGlzTWluID0gZDNfbWluKHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgIHJldHVybiBkM19taW4oZGF0YSwgKGQ6IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBkWzBdO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy55QXhpc01heCA9IGQzX21heCh0aGlzLmRhdGFTdGFjaywgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICByZXR1cm4gZDNfbWF4KGRhdGEsIChkOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gZFsxXTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnlBeGlzTWF4ID0gdGhpcy55QXhpc01heCArIHRoaXMueUF4aXNNYXggKiB0aGlzLnlBeGlzTWF4QnVmZmVyO1xyXG5cclxuICAgIHRoaXMueUF4aXNTY2FsZSA9IGQzX3NjYWxlTGluZWFyKCkuZG9tYWluKFt0aGlzLnlBeGlzTWluLCB0aGlzLnlBeGlzTWF4XSkubmljZSgpLnJhbmdlUm91bmQoW3RoaXMuaGVpZ2h0LCAwXSk7XHJcblxyXG4gICAgdGhpcy55QXhpc0NhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXHJcbiAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXHJcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnlBeGlzVGlja1NpemUpXHJcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyKVxyXG4gICAgICAudGlja0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0dGVyKTtcclxuXHJcbiAgICB0aGlzLnlBeGlzID0gdGhpcy5zdmdcclxuICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteScpXHJcbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzKVxyXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcclxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzRG9tYWluKVxyXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1RpY2tzKVxyXG4gICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEaXZlcmdpbmcpIHtcclxuICAgICAgY29uc3QgY2VudGVyID0gZDNfc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgdGhpcy53aWR0aF0pO1xyXG5cclxuICAgICAgY29uc3QgY2VudGVyTGluZSA9IGQzX2F4aXNUb3AoY2VudGVyKS50aWNrcygwKTtcclxuXHJcbiAgICAgIHRoaXMuc3ZnXHJcbiAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NlbnRlcmxpbmUnKVxyXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy55QXhpc1NjYWxlKDApfSlgKVxyXG4gICAgICAgIC5jYWxsKGNlbnRlckxpbmUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcuY2VudGVybGluZScpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFkgR1JJRExJTkVTXHJcbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XHJcbiAgICAgIHRoaXMueUdyaWRDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxyXG4gICAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXHJcbiAgICAgICAgLnRpY2tTaXplKC10aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KTtcclxuXHJcbiAgICAgIHRoaXMueUdyaWQgPSB0aGlzLnN2Z1xyXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteScpXHJcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXHJcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgMClgKVxyXG4gICAgICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT09MVElQXHJcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcclxuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcclxuICAgICAgICAuYXBwZW5kKCdkaXYnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgd2VzdCcpXHJcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcclxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcclxuXHJcbiAgICAgIC8vIHRvb2x0aXAgaGVhZGVyXHJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XHJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyLXZhbHVlJyk7XHJcblxyXG4gICAgICAvLyB0b29sdGlwIHRhYmxlXHJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ3RhYmxlJykuYXR0cignY2xhc3MnLCAndG9vbHRpcC10YWJsZSB0ZXh0LWxlZnQgdy0xMDAnKS5hcHBlbmQoJ3Rib2R5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcclxuICAgICAgdGhpcy51cGRhdGVDaGFydChmYWxzZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVDaGFydCA9IChmaXJzdFJ1biA9IHRydWUpID0+IHtcclxuICAgIHRoaXMuZGF0YUtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gJ2tleScpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSB0aGUgRDMgc3RhY2sgZGF0YVxyXG4gICAgaWYgKHRoaXMuaXNEaXZlcmdpbmcpIHtcclxuICAgICAgdGhpcy5kYXRhU3RhY2sgPSBkM19zdGFjaygpLmtleXModGhpcy5kYXRhS2V5cykub2Zmc2V0KHN0YWNrT2Zmc2V0RGl2ZXJnaW5nKSh0aGlzLmRhdGEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kYXRhU3RhY2sgPSBkM19zdGFjaygpLmtleXModGhpcy5kYXRhS2V5cykub3JkZXIoZDNfc3RhY2tPcmRlck5vbmUpKHRoaXMuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIHRoZSB4U2NhbGVcclxuICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4odGhpcy5kYXRhLm1hcCgoZCkgPT4gZC5rZXkpKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgdGhlIHlTY2FsZVxyXG4gICAgdGhpcy55QXhpc01pbiA9IGQzX21pbih0aGlzLmRhdGFTdGFjaywgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICByZXR1cm4gZDNfbWluKGRhdGEsIChkOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gZFswXTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMueUF4aXNNYXggPSBkM19tYXgodGhpcy5kYXRhU3RhY2ssIChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgcmV0dXJuIGQzX21heChkYXRhLCAoZDogYW55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGRbMV07XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy55QXhpc01heCA9IHRoaXMueUF4aXNNYXggKyB0aGlzLnlBeGlzTWF4ICogdGhpcy55QXhpc01heEJ1ZmZlcjtcclxuXHJcbiAgICB0aGlzLnlBeGlzU2NhbGUuZG9tYWluKFt0aGlzLnlBeGlzTWluLCB0aGlzLnlBeGlzTWF4XSkucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKS5uaWNlKCk7XHJcblxyXG4gICAgdGhpcy54QXhpc1xyXG4gICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgIC5kdXJhdGlvbigwKSAvLyAxMDAwXHJcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcclxuXHJcbiAgICB0aGlzLnlBeGlzXHJcbiAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgLmR1cmF0aW9uKDApIC8vIDEwMDBcclxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzRGl2ZXJnaW5nKSB7XHJcbiAgICAgIGNvbnN0IGNlbnRlciA9IGQzX3NjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHRoaXMud2lkdGhdKTtcclxuXHJcbiAgICAgIGNvbnN0IGNlbnRlckxpbmUgPSBkM19heGlzVG9wKGNlbnRlcikudGlja3MoMCk7XHJcblxyXG4gICAgICB0aGlzLnN2Z1xyXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdjZW50ZXJsaW5lJylcclxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMueUF4aXNTY2FsZSgwKX0pYClcclxuICAgICAgICAuY2FsbChjZW50ZXJMaW5lKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmNlbnRlcmxpbmUnKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgdGhlIGdyaWRzXHJcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XHJcbiAgICAgIHRoaXMueEdyaWRcclxuICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgLmR1cmF0aW9uKDApIC8vIDEwMDBcclxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xyXG4gICAgICB0aGlzLnlHcmlkXHJcbiAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgIC5kdXJhdGlvbigwKSAvLyAxMDAwXHJcbiAgICAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZCBncmF5IGJhcnNcclxuICAgIGlmICghdGhpcy5oaWRlR3JheUJhcnMpIHtcclxuICAgICAgdGhpcy5ncmF5QmFyc1xyXG4gICAgICAgIC5zZWxlY3RBbGwoJy5ncmF5LWJhcicpXHJcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxyXG4gICAgICAgIC5qb2luKFxyXG4gICAgICAgICAgKGVudGVyKSA9PlxyXG4gICAgICAgICAgICBlbnRlclxyXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmF5LWJhcicpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcclxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KSxcclxuICAgICAgICAgICh1cGRhdGUpID0+XHJcbiAgICAgICAgICAgIHVwZGF0ZVxyXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAuZHVyYXRpb24oKGQsIGksIG4pID0+IChmaXJzdFJ1biA/IDAgOiAxMDAwKSlcclxuICAgICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB0aGlzLnhBeGlzU2NhbGUoZC5rZXkpKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcclxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXHJcbiAgICAgICAgICAgICAgLnNlbGVjdGlvbigpLFxyXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZCBjb2xvcmVkIGJhcnNcclxuICAgIGNvbnN0IGJhckdyb3VwcyA9IHRoaXMuYmFyc1xyXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcclxuICAgICAgLmRhdGEodGhpcy5kYXRhU3RhY2spXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIChlbnRlcikgPT5cclxuICAgICAgICAgIGVudGVyXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyLWdyb3VwJylcclxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQuaW5kZXgpKSxcclxuICAgICAgICAodXBkYXRlKSA9PiB1cGRhdGUuYXR0cignZmlsbCcsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5pbmRleCkpLFxyXG4gICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXHJcbiAgICAgICk7XHJcblxyXG4gICAgYmFyR3JvdXBzXHJcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxyXG4gICAgICAuZGF0YSgoZCkgPT4gZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgKGVudGVyKSA9PlxyXG4gICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXInKVxyXG4gICAgICAgICAgICAuY2xhc3NlZCgnYmFyLWRpdmlkZWQnLCB0aGlzLnR5cGUgIT09ICdoaWdoJylcclxuICAgICAgICAgICAgLmNsYXNzZWQoJ2Jhci1kaXZpZGVkLWxvdycsIHRoaXMudHlwZSA9PT0gJ2xvdycpXHJcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICBsZXQgeDtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcclxuICAgICAgICAgICAgICAgIHggPSB0aGlzLnhBeGlzU2NhbGUoZC5kYXRhLmtleSkgKyAodGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gOCkgKiAzO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy54QXhpc1NjYWxlKGQuZGF0YS5rZXkpICsgKHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQpICogMTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHJldHVybiB4O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZFswXSkpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IHdpZHRoO1xyXG5cclxuICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xyXG4gICAgICAgICAgICAgICAgd2lkdGggPSB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA0O1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDI7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gd2lkdGg7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxyXG4gICAgICAgICAgICAuY2FsbCgoZW50ZXIpID0+IHtcclxuICAgICAgICAgICAgICBlbnRlclxyXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKChkLCBpLCBuKSA9PiAoZmlyc3RSdW4gPyAwIDogNTAwKSlcclxuICAgICAgICAgICAgICAgIC5kZWxheSgoZCwgaSwgbikgPT4gKGZpcnN0UnVuID8gMCA6IDc1MCkpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZFsxXSkpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNTY2FsZShkWzBdKSAtIHRoaXMueUF4aXNTY2FsZShkWzFdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gZW50ZXI7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICh1cGRhdGUpID0+XHJcbiAgICAgICAgICB1cGRhdGUuY2FsbCgodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGxldCB3aWR0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmICh0aGlzLnR5cGUgPT09ICdtZWRpdW0nKSB7XHJcbiAgICAgICAgICAgIC8vICAgd2lkdGggPSB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA0O1xyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgIHdpZHRoID0gdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gMjtcclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgdXBkYXRlXHJcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gdGhpcy54QXhpc1NjYWxlKGQuZGF0YS5rZXkpICsgKHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDgpICogMylcclxuICAgICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZFsxXSkpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZFswXSkgLSB0aGlzLnlBeGlzU2NhbGUoZFsxXSkpXHJcbiAgICAgICAgICAgICAgLnNlbGVjdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcclxuICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxyXG4gICAgICApO1xyXG5cclxuICAgIC8vIG1vdXNlb3ZlciBiYXJzXHJcbiAgICB0aGlzLm1vdXNlQmFyc1xyXG4gICAgICAuc2VsZWN0QWxsKCcubW91c2VvdmVyLWJhcicpXHJcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgKGVudGVyKSA9PlxyXG4gICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtb3VzZW92ZXItYmFyJylcclxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpLFxyXG4gICAgICAgICh1cGRhdGUpID0+XHJcbiAgICAgICAgICB1cGRhdGVcclxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxyXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB0aGlzLnhBeGlzU2NhbGUoZC5rZXkpKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcclxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAuc2VsZWN0aW9uKClcclxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKSxcclxuICAgICAgICAoZXhpdCkgPT4gZXhpdC50cmFuc2l0aW9uKCkuc2VsZWN0aW9uKCkuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpLnJlbW92ZSgpXHJcbiAgICAgIClcclxuICAgICAgLmRhdHVtKChkLCBpKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgZGF0YTogZCwgaW5kZXg6IGkgfTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYmFyTW91c2VPdmVyKGV2ZW50LCBkYXRhKSlcclxuICAgICAgLm9uKCdtb3VzZW91dCcsIChldmVudCwgZGF0YSkgPT4gdGhpcy5iYXJNb3VzZU91dCgpKVxyXG4gICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJhck1vdXNlQ2xpY2soZXZlbnQsIGRhdGEpKTtcclxuXHJcbiAgICB0aGlzLmJhcnMucmFpc2UoKTtcclxuICAgIHRoaXMueEF4aXMucmFpc2UoKTtcclxuICAgIHRoaXMubW91c2VCYXJzLnJhaXNlKCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcclxuICAgICAgdGhpcy5jaGFydFxyXG4gICAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxyXG4gICAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXHJcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhU3RhY2spXHJcbiAgICAgICAgLmpvaW4oXHJcbiAgICAgICAgICAoZW50ZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGkgPSBlbnRlci5hcHBlbmQoJ2xpJykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKTtcclxuXHJcbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1rZXknKVxyXG4gICAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5pbmRleCkpO1xyXG5cclxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcclxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJylcclxuICAgICAgICAgICAgICAuaHRtbCgoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBsaTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxyXG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5rZXkpO1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcclxuICAgICAgICApXHJcbiAgICAgICAgLmRhdHVtKChkLCBpKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4geyBkYXRhOiB0aGlzLmRhdGEsIGluZGV4OiBpIH07XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChldmVudCwgZGF0YSkgPT4gdGhpcy5sZWdlbmRNb3VzZU92ZXIoZXZlbnQsIGRhdGEpKVxyXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3V0KCkpXHJcbiAgICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4gdGhpcy5sZWdlbmRNb3VzZUNsaWNrKGV2ZW50LCBkYXRhKSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgYmFyTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XHJcbiAgICB0aGlzLmNoYXJ0XHJcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxyXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcclxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBpICE9PSBkYXRhLmluZGV4O1xyXG4gICAgICB9KVxyXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcclxuXHJcbiAgICB0aGlzLnRvb2x0aXBTaG93KGV2ZW50LCBkYXRhKTtcclxuXHJcbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xyXG4gIH07XHJcblxyXG4gIGJhck1vdXNlT3V0ID0gKCkgPT4ge1xyXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXInKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgYmFyTW91c2VDbGljayA9IChldmVudCwgZGF0YSkgPT4ge1xyXG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcclxuICB9O1xyXG5cclxuICBsZWdlbmRNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEpID0+IHtcclxuICAgIHRoaXMuY2hhcnRcclxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcclxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gZGF0YS5pbmRleClcclxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5jaGFydFxyXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcclxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gZGF0YS5pbmRleClcclxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcclxuICB9O1xyXG5cclxuICBsZWdlbmRNb3VzZU91dCA9ICgpID0+IHtcclxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmJhci1ncm91cCcpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xyXG5cclxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcclxuICB9O1xyXG5cclxuICBsZWdlbmRNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XHJcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSAoaXRlbSkgPT4ge1xyXG4gICAgc3dpdGNoICh0aGlzLnhBeGlzRm9ybWF0VHlwZSkge1xyXG4gICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KGl0ZW0pO1xyXG5cclxuICAgICAgY2FzZSAndGltZSc6XHJcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQocGFyc2VEYXRlKTtcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChldmVudCwgZGF0YSkgPT4ge1xyXG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XHJcbiAgICBjb25zdCBtb3VzZXJlY3REaW1lbnNpb25zID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IGNsaWVudFdpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIDEwO1xyXG4gICAgbGV0IGRpbWVuc2lvbkNhbGN1bGF0ZWQ7XHJcbiAgICBsZXQgdG9vbHRpcERpbWVuc2lvbnM7XHJcbiAgICBsZXQgdG9vbHRpcE9mZnNldEhlaWdodDtcclxuICAgIC8vIGNvbnN0IHlQb3NpdGlvbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBsZXQgeVBvc2l0aW9uO1xyXG4gICAgbGV0IHhQb3NpdGlvbjtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGwsIG1vdXNlcmVjdERpbWVuc2lvbnMsIHRvb2x0aXBPZmZzZXRIZWlnaHQsIHRvb2x0aXBEaW1lbnNpb25zLCBkaW1lbnNpb25DYWxjdWxhdGVkLCBjbGllbnRXaWR0aCk7XHJcblxyXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbCgoZCkgPT4ge1xyXG4gICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRUeXBlKSB7XHJcbiAgICAgICAgY2FzZSAndGltZSc6XHJcbiAgICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShkYXRhLmRhdGEua2V5KTtcclxuICAgICAgICAgIHJldHVybiBgJHt0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0KHBhcnNlRGF0ZSl9JHt0aGlzLnRvb2x0aXBIZWFkaW5nU3VmZml4fWA7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICByZXR1cm4gYCR7ZGF0YS5kYXRhLmtleX0ke3RoaXMudG9vbHRpcEhlYWRpbmdTdWZmaXh9YDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyLXZhbHVlJykuaHRtbCgoZCkgPT4ge1xyXG4gICAgICBsZXQgdG90YWwgPSAwO1xyXG5cclxuICAgICAgT2JqZWN0LmtleXMoZGF0YS5kYXRhKS5tYXAoKGUpID0+IHtcclxuICAgICAgICBpZiAoZSAhPT0gJ2tleScpIHtcclxuICAgICAgICAgIHRvdGFsID0gdG90YWwgKyBkYXRhLmRhdGFbZV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXQodG90YWwpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy50b29sdGlwXHJcbiAgICAgIC5zZWxlY3QoJy50b29sdGlwLXRhYmxlJylcclxuICAgICAgLnNlbGVjdCgndGJvZHknKVxyXG4gICAgICAuaHRtbCgoZCkgPT4ge1xyXG4gICAgICAgIGxldCBodG1sID0gYGA7XHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEuZGF0YSkubWFwKChrZXksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICBsZXQgbGFiZWw7XHJcbiAgICAgICAgICBsZXQgdmFsdWUgPSBkYXRhLmRhdGFba2V5XTtcclxuXHJcbiAgICAgICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICd0aW1lJzpcclxuICAgICAgICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShrZXkpO1xyXG4gICAgICAgICAgICAgIGxhYmVsID0gdGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdChwYXJzZURhdGUpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICBsYWJlbCA9IGtleTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEuZGF0YVtrZXldKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgIHZhbHVlID0gZGF0YS5kYXRhW2tleV07XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGtleSAhPT0gJ2tleScpIHtcclxuICAgICAgICAgICAgaHRtbCArPSBgXHJcbiAgICAgICAgICAgICAgPHRyIGNsYXNzPSd0b29sdGlwLWl0ZW0nPlxyXG4gICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwiY29sb3I6ICR7dGhpcy5jb2xvclJhbmdlKGluZGV4IC0gMSl9XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGJkcy10b29sdGlwLWtleVwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0b29sdGlwLWxhYmVsIHByLTIgdGV4dC1ub3dyYXBcIj4ke2xhYmVsfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0b29sdGlwLXZhbHVlIHRleHQtcmlnaHQgdGV4dC1ub3dyYXBcIj4ke3ZhbHVlfTwvdGQ+XHJcbiAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRvb2x0aXBEaW1lbnNpb25zID0gdGhpcy50b29sdGlwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGRpbWVuc2lvbkNhbGN1bGF0ZWQgPSBtb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyBtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoICsgdG9vbHRpcERpbWVuc2lvbnMud2lkdGggKyA4O1xyXG4gICAgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICAvLyBmbGlwIHRoZSB0b29sdGlwIHBvc2l0aW9ucyBpZiBuZWFyIHRoZSByaWdodCBlZGdlIG9mIHRoZSBzY3JlZW5cclxuICAgIGlmIChkaW1lbnNpb25DYWxjdWxhdGVkID4gY2xpZW50V2lkdGgpIHtcclxuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ2Vhc3QnLCB0cnVlKTtcclxuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3dlc3QnLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xyXG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gOCkgKiAzIC0gdG9vbHRpcERpbWVuc2lvbnMud2lkdGggLSA4fXB4YDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4UG9zaXRpb24gPSBgJHttb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyAobW91c2VyZWN0RGltZW5zaW9ucy53aWR0aCAvIDQpICogMSAtIHRvb2x0aXBEaW1lbnNpb25zLndpZHRoIC0gOH1weGA7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZGltZW5zaW9uQ2FsY3VsYXRlZCA8IGNsaWVudFdpZHRoKSB7XHJcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdlYXN0JywgZmFsc2UpO1xyXG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnd2VzdCcsIHRydWUpO1xyXG5cclxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcclxuICAgICAgICB4UG9zaXRpb24gPSBgJHttb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyAobW91c2VyZWN0RGltZW5zaW9ucy53aWR0aCAvIDgpICogNSArIDh9cHhgO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gNCkgKiAzICsgOH1weGA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB5UG9zaXRpb24gPSB0aGlzLnN2Z1xyXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcclxuICAgICAgLmZpbHRlcignOmxhc3QtY2hpbGQnKVxyXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcclxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBpID09PSBkYXRhLmluZGV4O1xyXG4gICAgICB9KVxyXG4gICAgICAubm9kZSgpXHJcbiAgICAgIC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAvLyBzZXQgdGhlIHRvb2x0aXAgc3R5bGVzXHJcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAke3lQb3NpdGlvbi50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC8gMiArIHNjcm9sbFsxXX1weGApO1xyXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgeFBvc2l0aW9uKTtcclxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XHJcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHlBeGlzRm9ybWF0dGVyID0gKGl0ZW0pID0+IHtcclxuICAgIHN3aXRjaCAodGhpcy55QXhpc0Zvcm1hdFR5cGUpIHtcclxuICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICByZXR1cm4gdGhpcy55QXhpc0Zvcm1hdChpdGVtKTtcclxuXHJcbiAgICAgIGNhc2UgJ3RpbWUnOlxyXG4gICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuIl19
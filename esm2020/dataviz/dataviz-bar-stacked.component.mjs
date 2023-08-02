import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { max as d3_max, min as d3_min } from 'd3-array';
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
                Object.keys(data.data)
                    .filter((key) => key !== 'key') // remove the 'key' property
                    .map((key, index) => {
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
                    html += `
              <tr class='tooltip-item'>
                <td style="color: ${this.colorRange(index)}">
                  <span class="pbds-tooltip-key"></span>
                </td>
                <td class="tooltip-label pr-2 text-nowrap">${label}</td>
                <td class="tooltip-value text-right text-nowrap">${value}</td>
              </tr>
            `;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsWUFBWSxFQUNaLFdBQVcsRUFDWCxLQUFLLEVBSUwsTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDeEQsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsUUFBUSxJQUFJLFdBQVcsRUFBRSxPQUFPLElBQUksVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxTQUFTLElBQUksWUFBWSxFQUFFLFdBQVcsSUFBSSxjQUFjLEVBQUUsWUFBWSxJQUFJLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNySCxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxjQUFjLElBQUksaUJBQWlCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDeEcsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQVd6RCxNQUFNLE9BQU8sOEJBQThCO0lBbUt6QyxZQUFvQixRQUE0QixFQUFVLFFBQW9CLEVBQVUsT0FBeUI7UUFBN0YsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFqS2pILGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIs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QkFJTixTQUFTO3NCQURSLEtBQUs7Z0JBSU4sZUFBZTtzQkFEZCxLQUFLO2dCQUlOLGlCQUFpQjtzQkFEaEIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sZUFBZTtzQkFEZCxLQUFLO2dCQUlOLGlCQUFpQjtzQkFEaEIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sY0FBYztzQkFEYixLQUFLO2dCQUlOLFVBQVU7c0JBRFQsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sY0FBYztzQkFEYixLQUFLO2dCQUlOLHFCQUFxQjtzQkFEcEIsS0FBSztnQkFJTix1QkFBdUI7c0JBRHRCLEtBQUs7Z0JBSU4sd0JBQXdCO3NCQUR2QixLQUFLO2dCQUlOLDBCQUEwQjtzQkFEekIsS0FBSztnQkFJTixvQkFBb0I7c0JBRG5CLEtBQUs7Z0JBSU4sNkJBQTZCO3NCQUQ1QixLQUFLO2dCQUlOLCtCQUErQjtzQkFEOUIsS0FBSztnQkFJTixzQkFBc0I7c0JBRHJCLEtBQUs7Z0JBSU4sd0JBQXdCO3NCQUR2QixLQUFLO2dCQUlOLHNCQUFzQjtzQkFEckIsS0FBSztnQkFJTix3QkFBd0I7c0JBRHZCLEtBQUs7Z0JBSU4sS0FBSztzQkFESixLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sWUFBWTtzQkFEWCxLQUFLO2dCQUVHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFHTixPQUFPO3NCQUROLE1BQU07Z0JBSVAsT0FBTztzQkFETixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdEJpbmRpbmcsXHJcbiAgSW5wdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFNpbXBsZUNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuaW1wb3J0IHsgbWF4IGFzIGQzX21heCwgbWluIGFzIGQzX21pbiB9IGZyb20gJ2QzLWFycmF5JztcclxuaW1wb3J0IHsgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLCBheGlzTGVmdCBhcyBkM19heGlzTGVmdCwgYXhpc1RvcCBhcyBkM19heGlzVG9wIH0gZnJvbSAnZDMtYXhpcyc7XHJcbmltcG9ydCB7IHNjYWxlQmFuZCBhcyBkM19zY2FsZUJhbmQsIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLCBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsIH0gZnJvbSAnZDMtc2NhbGUnO1xyXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcclxuaW1wb3J0IHsgc3RhY2sgYXMgZDNfc3RhY2ssIHN0YWNrT2Zmc2V0RGl2ZXJnaW5nLCBzdGFja09yZGVyTm9uZSBhcyBkM19zdGFja09yZGVyTm9uZSB9IGZyb20gJ2QzLXNoYXBlJztcclxuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XHJcblxyXG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhclN0YWNrZWQgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWJhci1zdGFja2VkJyxcclxuICB0ZW1wbGF0ZTogYGAsXHJcbiAgc3R5bGVzOiBbXSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpCYXJTdGFja2VkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcclxuICBjaGFydENsYXNzID0gdHJ1ZTtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LXN0YWNrZWQtYmFyJylcclxuICBzdGFja2VkQmFyQ2xhc3MgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6QmFyU3RhY2tlZD47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgd2lkdGggPSAzMDY7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgaGVpZ2h0ID0gNDAwO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHR5cGU6ICdsb3cnIHwgJ21lZGl1bScgfCAnaGlnaCcgfCAnZGVidWcnID0gJ21lZGl1bSc7IC8vIGRlYnVnIHRvIHNob3cgYWxsIGNoYXJ0IG9wdGlvbnNcclxuXHJcbiAgQElucHV0KClcclxuICBtYXJnaW5Ub3AgPSAxMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1hcmdpblJpZ2h0ID0gMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1hcmdpbkJvdHRvbSA9IDMwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWFyZ2luTGVmdCA9IDU1OyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgaGlkZVhBeGlzID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgeEF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgeEF4aXNGb3JtYXRTdHJpbmcgPSAnJztcclxuXHJcbiAgQElucHV0KClcclxuICB4QXhpc1RpdGxlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgQElucHV0KClcclxuICB5QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcclxuXHJcbiAgQElucHV0KClcclxuICB5QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHlBeGlzVGlja3MgPSA1O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHlBeGlzTWF4QnVmZmVyID0gMC4wMTtcclxuXHJcbiAgQElucHV0KClcclxuICBoaWRlTGVnZW5kID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kV2lkdGggPSAxMDUgKyAyODsgLy8gaGFyZGNvZGVkIGxlZ2VuZCB3aWR0aCArIGxlZnQgbWFyZ2luLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcclxuXHJcbiAgQElucHV0KClcclxuICBsZWdlbmRQb3NpdGlvbjogJ3JpZ2h0JyB8ICdib3R0b20nID0gJ2JvdHRvbSc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwSGVhZGluZ0Zvcm1hdFR5cGU6ICd0aW1lJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcgPSAnJztcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwSGVhZGluZ1N1ZmZpeCA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFR5cGU6ICd0aW1lJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRoZW1lO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGN1c3RvbUNvbG9yOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY29sb3JzQXJyYXkgPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICB0b3RhbFNhdmluZ3M7XHJcbiAgQElucHV0KCkgcm90YXRlWGF4aXMgPSB0cnVlO1xyXG4gIEBJbnB1dCgpIGlzRGl2ZXJnaW5nID0gZmFsc2U7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XHJcblxyXG4gIHByaXZhdGUgZGF0YVN0YWNrO1xyXG4gIHByaXZhdGUgZGF0YUtleXM7XHJcbiAgcHJpdmF0ZSBjaGFydDtcclxuICBwcml2YXRlIHN2ZztcclxuICBwcml2YXRlIGdyYXlCYXJzO1xyXG4gIHByaXZhdGUgbW91c2VCYXJzO1xyXG4gIHByaXZhdGUgYmFycztcclxuICBwcml2YXRlIG1hcmdpbjtcclxuICBwcml2YXRlIGNvbG9yUmFuZ2U7XHJcbiAgcHJpdmF0ZSBoaWRlR3JheUJhcnM6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSB4QXhpc1NjYWxlO1xyXG4gIHByaXZhdGUgeEF4aXNDYWxsO1xyXG4gIHByaXZhdGUgeEF4aXM7XHJcbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdDtcclxuICBwcml2YXRlIHhBeGlzVGlja1NpemU6IG51bWJlcjtcclxuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xyXG4gIHByaXZhdGUgeEF4aXNUaXRsZU1hcmdpbjogbnVtYmVyO1xyXG4gIHByaXZhdGUgaGlkZVhBeGlzRG9tYWluOiBib29sZWFuO1xyXG4gIHByaXZhdGUgaGlkZVhBeGlzWmVybzogYm9vbGVhbjtcclxuICBwcml2YXRlIGhpZGVYQXhpc1RpY2tzOiBib29sZWFuO1xyXG4gIHByaXZhdGUgaGlkZVhHcmlkOiBib29sZWFuO1xyXG4gIHByaXZhdGUgaGlkZVlHcmlkOiBib29sZWFuO1xyXG4gIHByaXZhdGUgeUF4aXNNYXg7XHJcbiAgcHJpdmF0ZSB5QXhpc1NjYWxlO1xyXG4gIHByaXZhdGUgeUF4aXNDYWxsO1xyXG4gIHByaXZhdGUgeUF4aXM7XHJcbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdDtcclxuICBwcml2YXRlIHlBeGlzVGlja1NpemU6IG51bWJlcjtcclxuICBwcml2YXRlIHlBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xyXG4gIHByaXZhdGUgeEdyaWQ7XHJcbiAgcHJpdmF0ZSB4R3JpZENhbGw7XHJcbiAgcHJpdmF0ZSB5R3JpZDtcclxuICBwcml2YXRlIHlHcmlkQ2FsbDtcclxuICBwcml2YXRlIGhpZGVZQXhpczogYm9vbGVhbjtcclxuICBwcml2YXRlIGhpZGVZQXhpc1plcm86IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBoaWRlWUF4aXNEb21haW46IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBoaWRlWUF4aXNUaWNrczogYm9vbGVhbjtcclxuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xyXG4gIHByaXZhdGUgdG9vbHRpcDtcclxuICBwcml2YXRlIGhpZGVUb29sdGlwOiBib29sZWFuO1xyXG4gIHByaXZhdGUgdG9vbHRpcEhlYWRpbmdGb3JtYXQ7XHJcbiAgcHJpdmF0ZSB0b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0O1xyXG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xyXG4gIHByaXZhdGUgdG9vbHRpcExhYmVsRm9ybWF0O1xyXG4gIHlBeGlzTWluOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIGV4dHJhY3Qga2V5cyBmb3Igc3RhY2sgZGF0YVxyXG4gICAgdGhpcy5kYXRhS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSAna2V5Jyk7XHJcblxyXG4gICAgLy8gY3JlYXRlIHRoZSBEMyBzdGFjayBkYXRhXHJcbiAgICBpZiAodGhpcy5pc0RpdmVyZ2luZykge1xyXG4gICAgICB0aGlzLmRhdGFTdGFjayA9IGQzX3N0YWNrKCkua2V5cyh0aGlzLmRhdGFLZXlzKS5vZmZzZXQoc3RhY2tPZmZzZXREaXZlcmdpbmcpKHRoaXMuZGF0YSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRhdGFTdGFjayA9IGQzX3N0YWNrKCkua2V5cyh0aGlzLmRhdGFLZXlzKS5vcmRlcihkM19zdGFja09yZGVyTm9uZSkodGhpcy5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICB0aGlzLm1hcmdpbiA9IHtcclxuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXHJcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcclxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXHJcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcclxuICAgIH07XHJcblxyXG4gICAgLy8gY3JlYXRlIGZvcm1hdHRlcnNcclxuICAgIHRoaXMueEF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueEF4aXNGb3JtYXRUeXBlLCB0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMueUF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueUF4aXNGb3JtYXRUeXBlLCB0aGlzLnlBeGlzRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQoXHJcbiAgICAgIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFR5cGUsXHJcbiAgICAgIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFN0cmluZ1xyXG4gICAgKTtcclxuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcclxuXHJcbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXHJcbiAgICB0aGlzLmhpZGVHcmF5QmFycyA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWUF4aXMgPSBmYWxzZTtcclxuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWUF4aXNaZXJvID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVYR3JpZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWUdyaWQgPSBmYWxzZTtcclxuICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlVG9vbHRpcCA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IGZhbHNlO1xyXG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcclxuICAgIHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyID0gMDtcclxuICAgIHRoaXMueUF4aXNUaWNrU2l6ZSA9IDg7XHJcbiAgICB0aGlzLnlBeGlzVGlja1NpemVPdXRlciA9IDA7XHJcbiAgICAvLyB0aGlzLmhpZGVUb29sdGlwTGFiZWwgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XHJcbiAgICAgIC8vIHNldCB0eXBlIGRlZmF1bHRzXHJcbiAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnbG93JzpcclxuICAgICAgICAgIHRoaXMuaGlkZUdyYXlCYXJzID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5sZWdlbmRQb3NpdGlvbiA9ICdib3R0b20nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ21lZGl1bSc6XHJcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWUdyaWQgPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ2hpZ2gnOlxyXG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXMgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlHcmlkID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZUxlZ2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5sZWdlbmRQb3NpdGlvbiA9ICdib3R0b20nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnhBeGlzVGl0bGVNYXJnaW4gPSB0aGlzLnhBeGlzVGl0bGUgPyAzMCA6IDA7XHJcblxyXG4gICAgLy8gYWRqdXN0IG1hcmdpbiBpZiB4QXhpcyBoaWRkZW5cclxuICAgIC8vaWYgKHRoaXMuaGlkZVhBeGlzKSB0aGlzLm1hcmdpbi5ib3R0b20gPSAxMDsgLy8gbmVlZCBzbWFsbCBtYXJnaW4gZm9yIHlBeGlzIHdpdGggMCB0aWNrIGxhYmVsXHJcblxyXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQgJiYgdGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICB0aGlzLndpZHRoID0gK3RoaXMud2lkdGggLSArdGhpcy5sZWdlbmRXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XHJcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XHJcbiAgICAgIHRoaXMuY2hhcnQuY2xhc3NlZCgncGJkcy1jaGFydC1sZWdlbmQtYm90dG9tJywgdGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gJ2JvdHRvbScgPyB0cnVlIDogZmFsc2UpO1xyXG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcclxuICAgIH1cclxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcclxuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxyXG4gICAgICAuYXBwZW5kKCdzdmcnKVxyXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aClcclxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcclxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXHJcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxyXG4gICAgICAuYXR0cihcclxuICAgICAgICAndmlld0JveCcsXHJcbiAgICAgICAgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aH0gJHsrdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b219YFxyXG4gICAgICApO1xyXG5cclxuICAgIHRoaXMuZ3JheUJhcnMgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdncmF5LWJhcnMnKTtcclxuICAgIHRoaXMubW91c2VCYXJzID0gdGhpcy5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnbW91c2VvdmVyLWJhcnMnKTtcclxuICAgIHRoaXMuYmFycyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2JhcnMnKTtcclxuXHJcbiAgICAvLyBidWlsZCBjb2xvciByYW5nZXNcclxuICAgIGNvbnN0IGNvbG9ycyA9IHRoaXMuY3VzdG9tQ29sb3IgPyB0aGlzLmNvbG9yc0FycmF5IDogdGhpcy5fZGF0YXZpei5nZXRDb2xvcnMoZmFsc2UsIHRoaXMudGhlbWUpO1xyXG4gICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVPcmRpbmFsKCkucmFuZ2UoY29sb3JzKTtcclxuXHJcbiAgICAvLyBYIEFYSVNcclxuICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlQmFuZCgpXHJcbiAgICAgIC5kb21haW4odGhpcy5kYXRhLm1hcCgoZCkgPT4gZC5rZXkpKVxyXG4gICAgICAucmFuZ2VSb3VuZChbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnRdKVxyXG4gICAgICAuYWxpZ24oMCk7XHJcblxyXG4gICAgLy8gYWRkIHBhZGRpbmcgdG8gdGhlIHNjYWxlIGZvciBncmF5IGJhcnNcclxuICAgICF0aGlzLmhpZGVHcmF5QmFyc1xyXG4gICAgICA/IHRoaXMueEF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMC4xKS5wYWRkaW5nT3V0ZXIoMClcclxuICAgICAgOiB0aGlzLnhBeGlzU2NhbGUucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKTtcclxuXHJcbiAgICB0aGlzLnhBeGlzQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKVxyXG4gICAgICAudGlja1NpemUodGhpcy54QXhpc1RpY2tTaXplKVxyXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcclxuICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XHJcblxyXG4gICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXHJcbiAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXgnKVxyXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxyXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpcylcclxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXHJcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc0RvbWFpbilcclxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXNUaWNrcylcclxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xyXG5cclxuICAgIC8vIFggR1JJRExJTkVTXHJcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XHJcbiAgICAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpLnRpY2tTaXplKC10aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICB0aGlzLnhHcmlkID0gdGhpcy5zdmdcclxuICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXgnKVxyXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxyXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXHJcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFggQVhJUyBUSVRMRVxyXG4gICAgaWYgKHRoaXMueEF4aXNUaXRsZSkge1xyXG4gICAgICB0aGlzLnN2Z1xyXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzLXRpdGxlJylcclxuICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcclxuICAgICAgICAuYXR0cihcclxuICAgICAgICAgICd0cmFuc2Zvcm0nLFxyXG4gICAgICAgICAgYHRyYW5zbGF0ZSgke3RoaXMuc3ZnLmF0dHIoJ3dpZHRoJykgLyAyIC0gdGhpcy5tYXJnaW4ubGVmdCAvIDIgLSB0aGlzLm1hcmdpbi5yaWdodCAvIDJ9LCAke1xyXG4gICAgICAgICAgICArdGhpcy5oZWlnaHQgKyArdGhpcy5tYXJnaW4udG9wICsgKHRoaXMuaGlkZVhBeGlzID8gMjAgOiA0MClcclxuICAgICAgICAgIH0pYFxyXG4gICAgICAgIClcclxuICAgICAgICAudGV4dCh0aGlzLnhBeGlzVGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEtFRVA6IHVzZSB0aGlzIGJsb2NrIHRvIGRlYnVnIHlBeGlzTWF4XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcclxuICAgIC8vICAgZDNfbWF4KHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBkM19tYXgoZGF0YSwgKGQ6IGFueSkgPT4ge1xyXG4gICAgLy8gICAgICAgLy8gY29uc29sZS5sb2coJ0Q6ICcsIGQpO1xyXG4gICAgLy8gICAgICAgcmV0dXJuIGRbMV07XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgIH0pXHJcbiAgICAvLyApO1xyXG5cclxuICAgIC8vIFkgQVhJU1xyXG4gICAgdGhpcy55QXhpc01pbiA9IGQzX21pbih0aGlzLmRhdGFTdGFjaywgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICByZXR1cm4gZDNfbWluKGRhdGEsIChkOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gZFswXTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMueUF4aXNNYXggPSBkM19tYXgodGhpcy5kYXRhU3RhY2ssIChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgcmV0dXJuIGQzX21heChkYXRhLCAoZDogYW55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGRbMV07XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy55QXhpc01heCA9IHRoaXMueUF4aXNNYXggKyB0aGlzLnlBeGlzTWF4ICogdGhpcy55QXhpc01heEJ1ZmZlcjtcclxuXHJcbiAgICB0aGlzLnlBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpLmRvbWFpbihbdGhpcy55QXhpc01pbiwgdGhpcy55QXhpc01heF0pLm5pY2UoKS5yYW5nZVJvdW5kKFt0aGlzLmhlaWdodCwgMF0pO1xyXG5cclxuICAgIHRoaXMueUF4aXNDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxyXG4gICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxyXG4gICAgICAudGlja1NpemUodGhpcy55QXhpc1RpY2tTaXplKVxyXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnlBeGlzVGlja1NpemVPdXRlcilcclxuICAgICAgLnRpY2tGb3JtYXQodGhpcy55QXhpc0Zvcm1hdHRlcik7XHJcblxyXG4gICAgdGhpcy55QXhpcyA9IHRoaXMuc3ZnXHJcbiAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXknKVxyXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpcylcclxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXHJcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc0RvbWFpbilcclxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXNUaWNrcylcclxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzRGl2ZXJnaW5nKSB7XHJcbiAgICAgIGNvbnN0IGNlbnRlciA9IGQzX3NjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHRoaXMud2lkdGhdKTtcclxuXHJcbiAgICAgIGNvbnN0IGNlbnRlckxpbmUgPSBkM19heGlzVG9wKGNlbnRlcikudGlja3MoMCk7XHJcblxyXG4gICAgICB0aGlzLnN2Z1xyXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdjZW50ZXJsaW5lJylcclxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMueUF4aXNTY2FsZSgwKX0pYClcclxuICAgICAgICAuY2FsbChjZW50ZXJMaW5lKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmNlbnRlcmxpbmUnKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBZIEdSSURMSU5FU1xyXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xyXG4gICAgICB0aGlzLnlHcmlkQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcclxuICAgICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxyXG4gICAgICAgIC50aWNrU2l6ZSgtdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodCk7XHJcblxyXG4gICAgICB0aGlzLnlHcmlkID0gdGhpcy5zdmdcclxuICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXknKVxyXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxyXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsIDApYClcclxuICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9PTFRJUFxyXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XHJcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXHJcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCAncGJkcy10b29sdGlwIHdlc3QnKVxyXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXHJcbiAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgLy8gaGlkZSB0b29sdGlwIGZvciBhY2Nlc3NpYmlsaXR5XHJcblxyXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxyXG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWhlYWRlcicpO1xyXG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWhlYWRlci12YWx1ZScpO1xyXG5cclxuICAgICAgLy8gdG9vbHRpcCB0YWJsZVxyXG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCd0YWJsZScpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdGFibGUgdGV4dC1sZWZ0IHctMTAwJykuYXBwZW5kKCd0Ym9keScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlQ2hhcnQgPSAoZmlyc3RSdW4gPSB0cnVlKSA9PiB7XHJcbiAgICB0aGlzLmRhdGFLZXlzID0gT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09ICdrZXknKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgdGhlIEQzIHN0YWNrIGRhdGFcclxuICAgIGlmICh0aGlzLmlzRGl2ZXJnaW5nKSB7XHJcbiAgICAgIHRoaXMuZGF0YVN0YWNrID0gZDNfc3RhY2soKS5rZXlzKHRoaXMuZGF0YUtleXMpLm9mZnNldChzdGFja09mZnNldERpdmVyZ2luZykodGhpcy5kYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGF0YVN0YWNrID0gZDNfc3RhY2soKS5rZXlzKHRoaXMuZGF0YUtleXMpLm9yZGVyKGQzX3N0YWNrT3JkZXJOb25lKSh0aGlzLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSB0aGUgeFNjYWxlXHJcbiAgICB0aGlzLnhBeGlzU2NhbGUuZG9tYWluKHRoaXMuZGF0YS5tYXAoKGQpID0+IGQua2V5KSk7XHJcblxyXG4gICAgLy8gdXBkYXRlIHRoZSB5U2NhbGVcclxuICAgIHRoaXMueUF4aXNNaW4gPSBkM19taW4odGhpcy5kYXRhU3RhY2ssIChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgcmV0dXJuIGQzX21pbihkYXRhLCAoZDogYW55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF07XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnlBeGlzTWF4ID0gZDNfbWF4KHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgIHJldHVybiBkM19tYXgoZGF0YSwgKGQ6IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBkWzFdO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMueUF4aXNNYXggPSB0aGlzLnlBeGlzTWF4ICsgdGhpcy55QXhpc01heCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XHJcblxyXG4gICAgdGhpcy55QXhpc1NjYWxlLmRvbWFpbihbdGhpcy55QXhpc01pbiwgdGhpcy55QXhpc01heF0pLnJhbmdlUm91bmQoW3RoaXMuaGVpZ2h0LCAwXSkubmljZSgpO1xyXG5cclxuICAgIHRoaXMueEF4aXNcclxuICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAuZHVyYXRpb24oMCkgLy8gMTAwMFxyXG4gICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XHJcblxyXG4gICAgdGhpcy55QXhpc1xyXG4gICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgIC5kdXJhdGlvbigwKSAvLyAxMDAwXHJcbiAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0RpdmVyZ2luZykge1xyXG4gICAgICBjb25zdCBjZW50ZXIgPSBkM19zY2FsZUxpbmVhcigpLnJhbmdlKFswLCB0aGlzLndpZHRoXSk7XHJcblxyXG4gICAgICBjb25zdCBjZW50ZXJMaW5lID0gZDNfYXhpc1RvcChjZW50ZXIpLnRpY2tzKDApO1xyXG5cclxuICAgICAgdGhpcy5zdmdcclxuICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCAnY2VudGVybGluZScpXHJcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLnlBeGlzU2NhbGUoMCl9KWApXHJcbiAgICAgICAgLmNhbGwoY2VudGVyTGluZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5jZW50ZXJsaW5lJykucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIHRoZSBncmlkc1xyXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xyXG4gICAgICB0aGlzLnhHcmlkXHJcbiAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgIC5kdXJhdGlvbigwKSAvLyAxMDAwXHJcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcclxuICAgICAgdGhpcy55R3JpZFxyXG4gICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAuZHVyYXRpb24oMCkgLy8gMTAwMFxyXG4gICAgICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgZ3JheSBiYXJzXHJcbiAgICBpZiAoIXRoaXMuaGlkZUdyYXlCYXJzKSB7XHJcbiAgICAgIHRoaXMuZ3JheUJhcnNcclxuICAgICAgICAuc2VsZWN0QWxsKCcuZ3JheS1iYXInKVxyXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcclxuICAgICAgICAuam9pbihcclxuICAgICAgICAgIChlbnRlcikgPT5cclxuICAgICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcclxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JheS1iYXInKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodCksXHJcbiAgICAgICAgICAodXBkYXRlKSA9PlxyXG4gICAgICAgICAgICB1cGRhdGVcclxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKChkLCBpLCBuKSA9PiAoZmlyc3RSdW4gPyAwIDogMTAwMCkpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcclxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICAgIC5zZWxlY3Rpb24oKSxcclxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgY29sb3JlZCBiYXJzXHJcbiAgICBjb25zdCBiYXJHcm91cHMgPSB0aGlzLmJhcnNcclxuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXHJcbiAgICAgIC5kYXRhKHRoaXMuZGF0YVN0YWNrKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICAoZW50ZXIpID0+XHJcbiAgICAgICAgICBlbnRlclxyXG4gICAgICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jhci1ncm91cCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmluZGV4KSksXHJcbiAgICAgICAgKHVwZGF0ZSkgPT4gdXBkYXRlLmF0dHIoJ2ZpbGwnLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQuaW5kZXgpKSxcclxuICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxyXG4gICAgICApO1xyXG5cclxuICAgIGJhckdyb3Vwc1xyXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcclxuICAgICAgLmRhdGEoKGQpID0+IGQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIChlbnRlcikgPT5cclxuICAgICAgICAgIGVudGVyXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcclxuICAgICAgICAgICAgLmNsYXNzZWQoJ2Jhci1kaXZpZGVkJywgdGhpcy50eXBlICE9PSAnaGlnaCcpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKCdiYXItZGl2aWRlZC1sb3cnLCB0aGlzLnR5cGUgPT09ICdsb3cnKVxyXG4gICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IHg7XHJcblxyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdtZWRpdW0nKSB7XHJcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy54QXhpc1NjYWxlKGQuZGF0YS5rZXkpICsgKHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDgpICogMztcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgeCA9IHRoaXMueEF4aXNTY2FsZShkLmRhdGEua2V5KSArICh0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA0KSAqIDE7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4geDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGRbMF0pKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgIGxldCB3aWR0aDtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNDtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2lkdGggPSB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyAyO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuIHdpZHRoO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcclxuICAgICAgICAgICAgLmNhbGwoKGVudGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigoZCwgaSwgbikgPT4gKGZpcnN0UnVuID8gMCA6IDUwMCkpXHJcbiAgICAgICAgICAgICAgICAuZGVsYXkoKGQsIGksIG4pID0+IChmaXJzdFJ1biA/IDAgOiA3NTApKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGRbMV0pKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnlBeGlzU2NhbGUoZFswXSkgLSB0aGlzLnlBeGlzU2NhbGUoZFsxXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVudGVyO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAodXBkYXRlKSA9PlxyXG4gICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBsZXQgd2lkdGg7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xyXG4gICAgICAgICAgICAvLyAgIHdpZHRoID0gdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNDtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gICB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDI7XHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZVxyXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcclxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA0KVxyXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHRoaXMueEF4aXNTY2FsZShkLmRhdGEua2V5KSArICh0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA4KSAqIDMpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGRbMV0pKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGRbMF0pIC0gdGhpcy55QXhpc1NjYWxlKGRbMV0pKVxyXG4gICAgICAgICAgICAgIC5zZWxlY3Rpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XHJcbiAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcclxuICAgICAgKTtcclxuXHJcbiAgICAvLyBtb3VzZW92ZXIgYmFyc1xyXG4gICAgdGhpcy5tb3VzZUJhcnNcclxuICAgICAgLnNlbGVjdEFsbCgnLm1vdXNlb3Zlci1iYXInKVxyXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIChlbnRlcikgPT5cclxuICAgICAgICAgIGVudGVyXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbW91c2VvdmVyLWJhcicpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KSxcclxuICAgICAgICAodXBkYXRlKSA9PlxyXG4gICAgICAgICAgdXBkYXRlXHJcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXHJcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgLnNlbGVjdGlvbigpXHJcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXHJcbiAgICAgICAgKGV4aXQpID0+IGV4aXQudHJhbnNpdGlvbigpLnNlbGVjdGlvbigpLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKS5yZW1vdmUoKVxyXG4gICAgICApXHJcbiAgICAgIC5kYXR1bSgoZCwgaSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IGRhdGE6IGQsIGluZGV4OiBpIH07XHJcbiAgICAgIH0pXHJcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJhck1vdXNlT3ZlcihldmVudCwgZGF0YSkpXHJcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYmFyTW91c2VPdXQoKSlcclxuICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4gdGhpcy5iYXJNb3VzZUNsaWNrKGV2ZW50LCBkYXRhKSk7XHJcblxyXG4gICAgdGhpcy5iYXJzLnJhaXNlKCk7XHJcbiAgICB0aGlzLnhBeGlzLnJhaXNlKCk7XHJcbiAgICB0aGlzLm1vdXNlQmFycy5yYWlzZSgpO1xyXG5cclxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XHJcbiAgICAgIHRoaXMuY2hhcnRcclxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcclxuICAgICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxyXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YVN0YWNrKVxyXG4gICAgICAgIC5qb2luKFxyXG4gICAgICAgICAgKGVudGVyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZW50ZXIuYXBwZW5kKCdsaScpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJyk7XHJcblxyXG4gICAgICAgICAgICBsaS5hcHBlbmQoJ3NwYW4nKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcclxuICAgICAgICAgICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQuaW5kZXgpKTtcclxuXHJcbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXHJcbiAgICAgICAgICAgICAgLmh0bWwoKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5rZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbGk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbCgoZCkgPT4ge1xyXG4gICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcclxuICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQua2V5KTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC5kYXR1bSgoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHsgZGF0YTogdGhpcy5kYXRhLCBpbmRleDogaSB9O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubGVnZW5kTW91c2VPdmVyKGV2ZW50LCBkYXRhKSlcclxuICAgICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4gdGhpcy5sZWdlbmRNb3VzZU91dCgpKVxyXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubGVnZW5kTW91c2VDbGljayhldmVudCwgZGF0YSkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGJhck1vdXNlT3ZlciA9IChldmVudCwgZGF0YSkgPT4ge1xyXG4gICAgdGhpcy5jaGFydFxyXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcclxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXHJcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IHtcclxuICAgICAgICByZXR1cm4gaSAhPT0gZGF0YS5pbmRleDtcclxuICAgICAgfSlcclxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy50b29sdGlwU2hvdyhldmVudCwgZGF0YSk7XHJcblxyXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcclxuICB9O1xyXG5cclxuICBiYXJNb3VzZU91dCA9ICgpID0+IHtcclxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuYmFyJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGJhck1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEpID0+IHtcclxuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XHJcbiAgICB0aGlzLmNoYXJ0XHJcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXHJcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGRhdGEuaW5kZXgpXHJcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xyXG5cclxuICAgIHRoaXMuY2hhcnRcclxuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXHJcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGRhdGEuaW5kZXgpXHJcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xyXG5cclxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kTW91c2VPdXQgPSAoKSA9PiB7XHJcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSkgPT4ge1xyXG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHhBeGlzRm9ybWF0dGVyID0gKGl0ZW0pID0+IHtcclxuICAgIHN3aXRjaCAodGhpcy54QXhpc0Zvcm1hdFR5cGUpIHtcclxuICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChpdGVtKTtcclxuXHJcbiAgICAgIGNhc2UgJ3RpbWUnOlxyXG4gICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZXZlbnQsIGRhdGEpID0+IHtcclxuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xyXG4gICAgY29uc3QgbW91c2VyZWN0RGltZW5zaW9ucyA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBjbGllbnRXaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSAxMDtcclxuICAgIGxldCBkaW1lbnNpb25DYWxjdWxhdGVkO1xyXG4gICAgbGV0IHRvb2x0aXBEaW1lbnNpb25zO1xyXG4gICAgbGV0IHRvb2x0aXBPZmZzZXRIZWlnaHQ7XHJcbiAgICAvLyBjb25zdCB5UG9zaXRpb24gPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgbGV0IHlQb3NpdGlvbjtcclxuICAgIGxldCB4UG9zaXRpb247XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsLCBtb3VzZXJlY3REaW1lbnNpb25zLCB0b29sdGlwT2Zmc2V0SGVpZ2h0LCB0b29sdGlwRGltZW5zaW9ucywgZGltZW5zaW9uQ2FsY3VsYXRlZCwgY2xpZW50V2lkdGgpO1xyXG5cclxuICAgIHRoaXMudG9vbHRpcC5zZWxlY3QoJy50b29sdGlwLWhlYWRlcicpLmh0bWwoKGQpID0+IHtcclxuICAgICAgc3dpdGNoICh0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0VHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ3RpbWUnOlxyXG4gICAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoZGF0YS5kYXRhLmtleSk7XHJcbiAgICAgICAgICByZXR1cm4gYCR7dGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdChwYXJzZURhdGUpfSR7dGhpcy50b29sdGlwSGVhZGluZ1N1ZmZpeH1gO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgcmV0dXJuIGAke2RhdGEuZGF0YS5rZXl9JHt0aGlzLnRvb2x0aXBIZWFkaW5nU3VmZml4fWA7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudG9vbHRpcC5zZWxlY3QoJy50b29sdGlwLWhlYWRlci12YWx1ZScpLmh0bWwoKGQpID0+IHtcclxuICAgICAgbGV0IHRvdGFsID0gMDtcclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKGRhdGEuZGF0YSkubWFwKChlKSA9PiB7XHJcbiAgICAgICAgaWYgKGUgIT09ICdrZXknKSB7XHJcbiAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgZGF0YS5kYXRhW2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy50b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0KHRvdGFsKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudG9vbHRpcFxyXG4gICAgICAuc2VsZWN0KCcudG9vbHRpcC10YWJsZScpXHJcbiAgICAgIC5zZWxlY3QoJ3Rib2R5JylcclxuICAgICAgLmh0bWwoKGQpID0+IHtcclxuICAgICAgICBsZXQgaHRtbCA9IGBgO1xyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLmRhdGEpXHJcbiAgICAgICAgICAuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gJ2tleScpIC8vIHJlbW92ZSB0aGUgJ2tleScgcHJvcGVydHlcclxuICAgICAgICAgIC5tYXAoKGtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGxhYmVsO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBkYXRhLmRhdGFba2V5XTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSAndGltZSc6XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShrZXkpO1xyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0KHBhcnNlRGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGxhYmVsID0ga2V5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLmRhdGFba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gZGF0YS5kYXRhW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgIDx0ciBjbGFzcz0ndG9vbHRpcC1pdGVtJz5cclxuICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cImNvbG9yOiAke3RoaXMuY29sb3JSYW5nZShpbmRleCl9XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGJkcy10b29sdGlwLWtleVwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0b29sdGlwLWxhYmVsIHByLTIgdGV4dC1ub3dyYXBcIj4ke2xhYmVsfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0b29sdGlwLXZhbHVlIHRleHQtcmlnaHQgdGV4dC1ub3dyYXBcIj4ke3ZhbHVlfTwvdGQ+XHJcbiAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdG9vbHRpcERpbWVuc2lvbnMgPSB0aGlzLnRvb2x0aXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgZGltZW5zaW9uQ2FsY3VsYXRlZCA9IG1vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggKyB0b29sdGlwRGltZW5zaW9ucy53aWR0aCArIDg7XHJcbiAgICB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgIC8vIGZsaXAgdGhlIHRvb2x0aXAgcG9zaXRpb25zIGlmIG5lYXIgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIHNjcmVlblxyXG4gICAgaWYgKGRpbWVuc2lvbkNhbGN1bGF0ZWQgPiBjbGllbnRXaWR0aCkge1xyXG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIHRydWUpO1xyXG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnd2VzdCcsIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdtZWRpdW0nKSB7XHJcbiAgICAgICAgeFBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgKG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggLyA4KSAqIDMgLSB0b29sdGlwRGltZW5zaW9ucy53aWR0aCAtIDh9cHhgO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gNCkgKiAxIC0gdG9vbHRpcERpbWVuc2lvbnMud2lkdGggLSA4fXB4YDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChkaW1lbnNpb25DYWxjdWxhdGVkIDwgY2xpZW50V2lkdGgpIHtcclxuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ2Vhc3QnLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgdHJ1ZSk7XHJcblxyXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xyXG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gOCkgKiA1ICsgOH1weGA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeFBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgKG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggLyA0KSAqIDMgKyA4fXB4YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHlQb3NpdGlvbiA9IHRoaXMuc3ZnXHJcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxyXG4gICAgICAuZmlsdGVyKCc6bGFzdC1jaGlsZCcpXHJcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxyXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGkgPT09IGRhdGEuaW5kZXg7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5ub2RlKClcclxuICAgICAgLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIC8vIHNldCB0aGUgdG9vbHRpcCBzdHlsZXNcclxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7eVBvc2l0aW9uLnRvcCAtIHRvb2x0aXBPZmZzZXRIZWlnaHQgLyAyICsgc2Nyb2xsWzFdfXB4YCk7XHJcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCB4UG9zaXRpb24pO1xyXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcclxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgeUF4aXNGb3JtYXR0ZXIgPSAoaXRlbSkgPT4ge1xyXG4gICAgc3dpdGNoICh0aGlzLnlBeGlzRm9ybWF0VHlwZSkge1xyXG4gICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KGl0ZW0pO1xyXG5cclxuICAgICAgY2FzZSAndGltZSc6XHJcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQocGFyc2VEYXRlKTtcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iXX0=
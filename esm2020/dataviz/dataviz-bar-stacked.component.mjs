import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { max as d3_max, min as d3_min } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
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
                .duration(1000) // 1000
                .call(this.xAxisCall);
            this.yAxis
                .transition()
                .duration(1000) // 1000
                .call(this.yAxisCall);
            // update the grids
            if (!this.hideXGrid) {
                this.xGrid
                    .transition()
                    .duration(1000) // 1000
                    .call(this.xGridCall);
            }
            if (!this.hideYGrid) {
                this.yGrid
                    .transition()
                    .duration(1000) // 1000
                    .call(this.yGridCall);
            }
            if (this.isDiverging) {
                this.centerline
                    .transition()
                    .duration(1000) // 1000
                    .attr('transform', `translate(0,  ${this.yAxisScale(0)})`);
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
                update
                    .transition()
                    .duration(1000)
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
            let yMaxBar = 0;
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
                .selectAll('.bar')
                .filter((d, i) => {
                return i === data.index;
            })
                .each((d, i) => {
                yMaxBar = d[1] > yMaxBar ? d[1] : yMaxBar;
            })
                .filter((d, i) => {
                return d[1] === yMaxBar;
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
            this.centerline = this.svg
                .append('line')
                .attr('class', 'centerline')
                .attr('x2', +this.width - this.margin.right - this.margin.left)
                .attr('transform', `translate(0,  ${this.yAxisScale(0)})`);
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
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
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
PbdsDatavizBarStackedComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDatavizBarStackedComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBarStackedComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: PbdsDatavizBarStackedComponent, selector: "pbds-dataviz-bar-stacked", inputs: { data: "data", width: "width", height: "height", type: "type", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", hideXAxis: "hideXAxis", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", xAxisTitle: "xAxisTitle", yAxisFormatType: "yAxisFormatType", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", yAxisMaxBuffer: "yAxisMaxBuffer", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", tooltipHeadingFormatType: "tooltipHeadingFormatType", tooltipHeadingFormatString: "tooltipHeadingFormatString", tooltipHeadingSuffix: "tooltipHeadingSuffix", tooltipHeadingValueFormatType: "tooltipHeadingValueFormatType", tooltipHeadingValueFormatString: "tooltipHeadingValueFormatString", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", theme: "theme", totalSavings: "totalSavings", rotateXaxis: "rotateXaxis", isDiverging: "isDiverging" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-stacked-bar": "this.stackedBarClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDatavizBarStackedComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsWUFBWSxFQUNaLFdBQVcsRUFDWCxLQUFLLEVBSUwsTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDeEQsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsUUFBUSxJQUFJLFdBQVcsRUFBeUIsTUFBTSxTQUFTLENBQUM7QUFDdEcsT0FBTyxFQUFFLFNBQVMsSUFBSSxZQUFZLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxZQUFZLElBQUksZUFBZSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JILE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxLQUFLLElBQUksUUFBUSxFQUFFLG9CQUFvQixFQUFFLGNBQWMsSUFBSSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN4RyxPQUFPLEVBQUUsUUFBUSxJQUFJLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBV3pELE1BQU0sT0FBTyw4QkFBOEI7SUE4SnpDLFlBQW9CLFFBQTRCLEVBQVUsUUFBb0IsRUFBVSxPQUF5QjtRQUE3RixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVk7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQTVKakgsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixvQkFBZSxHQUFHLElBQUksQ0FB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b25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdEJpbmRpbmcsXHJcbiAgSW5wdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFNpbXBsZUNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuaW1wb3J0IHsgbWF4IGFzIGQzX21heCwgbWluIGFzIGQzX21pbiB9IGZyb20gJ2QzLWFycmF5JztcclxuaW1wb3J0IHsgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLCBheGlzTGVmdCBhcyBkM19heGlzTGVmdCwgYXhpc1RvcCBhcyBkM19heGlzVG9wIH0gZnJvbSAnZDMtYXhpcyc7XHJcbmltcG9ydCB7IHNjYWxlQmFuZCBhcyBkM19zY2FsZUJhbmQsIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLCBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsIH0gZnJvbSAnZDMtc2NhbGUnO1xyXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcclxuaW1wb3J0IHsgc3RhY2sgYXMgZDNfc3RhY2ssIHN0YWNrT2Zmc2V0RGl2ZXJnaW5nLCBzdGFja09yZGVyTm9uZSBhcyBkM19zdGFja09yZGVyTm9uZSB9IGZyb20gJ2QzLXNoYXBlJztcclxuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XHJcblxyXG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhclN0YWNrZWQgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWJhci1zdGFja2VkJyxcclxuICB0ZW1wbGF0ZTogYGAsXHJcbiAgc3R5bGVzOiBbXSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpCYXJTdGFja2VkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcclxuICBjaGFydENsYXNzID0gdHJ1ZTtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LXN0YWNrZWQtYmFyJylcclxuICBzdGFja2VkQmFyQ2xhc3MgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6QmFyU3RhY2tlZD47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgd2lkdGggPSAzMDY7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgaGVpZ2h0ID0gNDAwO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHR5cGU6ICdsb3cnIHwgJ21lZGl1bScgfCAnaGlnaCcgfCAnZGVidWcnID0gJ21lZGl1bSc7IC8vIGRlYnVnIHRvIHNob3cgYWxsIGNoYXJ0IG9wdGlvbnNcclxuXHJcbiAgQElucHV0KClcclxuICBtYXJnaW5Ub3AgPSAxMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1hcmdpblJpZ2h0ID0gMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1hcmdpbkJvdHRvbSA9IDMwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWFyZ2luTGVmdCA9IDU1OyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgaGlkZVhBeGlzID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgeEF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgeEF4aXNGb3JtYXRTdHJpbmcgPSAnJztcclxuXHJcbiAgQElucHV0KClcclxuICB4QXhpc1RpdGxlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgQElucHV0KClcclxuICB5QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcclxuXHJcbiAgQElucHV0KClcclxuICB5QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHlBeGlzVGlja3MgPSA1O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHlBeGlzTWF4QnVmZmVyID0gMC4wMTtcclxuXHJcbiAgQElucHV0KClcclxuICBoaWRlTGVnZW5kID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kV2lkdGggPSAxMDUgKyAyODsgLy8gaGFyZGNvZGVkIGxlZ2VuZCB3aWR0aCArIGxlZnQgbWFyZ2luLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcclxuXHJcbiAgQElucHV0KClcclxuICBsZWdlbmRQb3NpdGlvbjogJ3JpZ2h0JyB8ICdib3R0b20nID0gJ2JvdHRvbSc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwSGVhZGluZ0Zvcm1hdFR5cGU6ICd0aW1lJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcgPSAnJztcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwSGVhZGluZ1N1ZmZpeCA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFR5cGU6ICd0aW1lJyA9IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRoZW1lO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHRvdGFsU2F2aW5ncztcclxuICBASW5wdXQoKSByb3RhdGVYYXhpcyA9IHRydWU7XHJcbiAgQElucHV0KCkgaXNEaXZlcmdpbmcgPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcclxuXHJcbiAgcHJpdmF0ZSBkYXRhU3RhY2s7XHJcbiAgcHJpdmF0ZSBkYXRhS2V5cztcclxuICBwcml2YXRlIGNoYXJ0O1xyXG4gIHByaXZhdGUgc3ZnO1xyXG4gIHByaXZhdGUgZ3JheUJhcnM7XHJcbiAgcHJpdmF0ZSBtb3VzZUJhcnM7XHJcbiAgcHJpdmF0ZSBiYXJzO1xyXG4gIHByaXZhdGUgbWFyZ2luO1xyXG4gIHByaXZhdGUgY29sb3JSYW5nZTtcclxuICBwcml2YXRlIGhpZGVHcmF5QmFyczogYm9vbGVhbjtcclxuICBwcml2YXRlIHhBeGlzU2NhbGU7XHJcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XHJcbiAgcHJpdmF0ZSB4QXhpcztcclxuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xyXG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xyXG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSB4QXhpc1RpdGxlTWFyZ2luOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBoaWRlWEF4aXNEb21haW46IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBoaWRlWEF4aXNaZXJvOiBib29sZWFuO1xyXG4gIHByaXZhdGUgaGlkZVhBeGlzVGlja3M6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBoaWRlWEdyaWQ6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBoaWRlWUdyaWQ6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSB5QXhpc01heDtcclxuICBwcml2YXRlIHlBeGlzU2NhbGU7XHJcbiAgcHJpdmF0ZSB5QXhpc0NhbGw7XHJcbiAgcHJpdmF0ZSB5QXhpcztcclxuICBwcml2YXRlIHlBeGlzRm9ybWF0O1xyXG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZTogbnVtYmVyO1xyXG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSB4R3JpZDtcclxuICBwcml2YXRlIHhHcmlkQ2FsbDtcclxuICBwcml2YXRlIHlHcmlkO1xyXG4gIHByaXZhdGUgeUdyaWRDYWxsO1xyXG4gIHByaXZhdGUgaGlkZVlBeGlzOiBib29sZWFuO1xyXG4gIHByaXZhdGUgaGlkZVlBeGlzWmVybzogYm9vbGVhbjtcclxuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcclxuICBwcml2YXRlIGhpZGVZQXhpc1RpY2tzOiBib29sZWFuO1xyXG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XHJcbiAgcHJpdmF0ZSB0b29sdGlwO1xyXG4gIHByaXZhdGUgaGlkZVRvb2x0aXA6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSB0b29sdGlwSGVhZGluZ0Zvcm1hdDtcclxuICBwcml2YXRlIHRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXQ7XHJcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XHJcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XHJcbiAgcHJpdmF0ZSBjZW50ZXJsaW5lO1xyXG4gIHlBeGlzTWluOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIGV4dHJhY3Qga2V5cyBmb3Igc3RhY2sgZGF0YVxyXG4gICAgdGhpcy5kYXRhS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSAna2V5Jyk7XHJcblxyXG4gICAgLy8gY3JlYXRlIHRoZSBEMyBzdGFjayBkYXRhXHJcbiAgICBpZiAodGhpcy5pc0RpdmVyZ2luZykge1xyXG4gICAgICB0aGlzLmRhdGFTdGFjayA9IGQzX3N0YWNrKCkua2V5cyh0aGlzLmRhdGFLZXlzKS5vZmZzZXQoc3RhY2tPZmZzZXREaXZlcmdpbmcpKHRoaXMuZGF0YSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRhdGFTdGFjayA9IGQzX3N0YWNrKCkua2V5cyh0aGlzLmRhdGFLZXlzKS5vcmRlcihkM19zdGFja09yZGVyTm9uZSkodGhpcy5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICB0aGlzLm1hcmdpbiA9IHtcclxuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXHJcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcclxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXHJcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcclxuICAgIH07XHJcblxyXG4gICAgLy8gY3JlYXRlIGZvcm1hdHRlcnNcclxuICAgIHRoaXMueEF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueEF4aXNGb3JtYXRUeXBlLCB0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMueUF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueUF4aXNGb3JtYXRUeXBlLCB0aGlzLnlBeGlzRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQoXHJcbiAgICAgIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFR5cGUsXHJcbiAgICAgIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFN0cmluZ1xyXG4gICAgKTtcclxuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcclxuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcclxuXHJcbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXHJcbiAgICB0aGlzLmhpZGVHcmF5QmFycyA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWUF4aXMgPSBmYWxzZTtcclxuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWUF4aXNaZXJvID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVYR3JpZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWUdyaWQgPSBmYWxzZTtcclxuICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gZmFsc2U7XHJcbiAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlVG9vbHRpcCA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IGZhbHNlO1xyXG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcclxuICAgIHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyID0gMDtcclxuICAgIHRoaXMueUF4aXNUaWNrU2l6ZSA9IDg7XHJcbiAgICB0aGlzLnlBeGlzVGlja1NpemVPdXRlciA9IDA7XHJcbiAgICAvLyB0aGlzLmhpZGVUb29sdGlwTGFiZWwgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XHJcbiAgICAgIC8vIHNldCB0eXBlIGRlZmF1bHRzXHJcbiAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnbG93JzpcclxuICAgICAgICAgIHRoaXMuaGlkZUdyYXlCYXJzID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5sZWdlbmRQb3NpdGlvbiA9ICdib3R0b20nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ21lZGl1bSc6XHJcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWUdyaWQgPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ2hpZ2gnOlxyXG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXMgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZVlHcmlkID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaGlkZUxlZ2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5sZWdlbmRQb3NpdGlvbiA9ICdib3R0b20nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnhBeGlzVGl0bGVNYXJnaW4gPSB0aGlzLnhBeGlzVGl0bGUgPyAzMCA6IDA7XHJcblxyXG4gICAgLy8gYWRqdXN0IG1hcmdpbiBpZiB4QXhpcyBoaWRkZW5cclxuICAgIC8vaWYgKHRoaXMuaGlkZVhBeGlzKSB0aGlzLm1hcmdpbi5ib3R0b20gPSAxMDsgLy8gbmVlZCBzbWFsbCBtYXJnaW4gZm9yIHlBeGlzIHdpdGggMCB0aWNrIGxhYmVsXHJcblxyXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQgJiYgdGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICB0aGlzLndpZHRoID0gK3RoaXMud2lkdGggLSArdGhpcy5sZWdlbmRXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XHJcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcclxuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxyXG4gICAgICAuYXBwZW5kKCdzdmcnKVxyXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aClcclxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcclxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXHJcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxyXG4gICAgICAuYXR0cihcclxuICAgICAgICAndmlld0JveCcsXHJcbiAgICAgICAgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aH0gJHsrdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b219YFxyXG4gICAgICApO1xyXG5cclxuICAgIHRoaXMuZ3JheUJhcnMgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdncmF5LWJhcnMnKTtcclxuICAgIHRoaXMubW91c2VCYXJzID0gdGhpcy5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnbW91c2VvdmVyLWJhcnMnKTtcclxuICAgIHRoaXMuYmFycyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2JhcnMnKTtcclxuXHJcbiAgICAvLyBidWlsZCBjb2xvciByYW5nZXNcclxuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpLnJhbmdlKHRoaXMuX2RhdGF2aXouZ2V0Q29sb3JzKGZhbHNlLCB0aGlzLnRoZW1lKSk7XHJcblxyXG4gICAgLy8gWCBBWElTXHJcbiAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUJhbmQoKVxyXG4gICAgICAuZG9tYWluKHRoaXMuZGF0YS5tYXAoKGQpID0+IGQua2V5KSlcclxuICAgICAgLnJhbmdlUm91bmQoWzAsIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0XSlcclxuICAgICAgLmFsaWduKDApO1xyXG5cclxuICAgIC8vIGFkZCBwYWRkaW5nIHRvIHRoZSBzY2FsZSBmb3IgZ3JheSBiYXJzXHJcbiAgICAhdGhpcy5oaWRlR3JheUJhcnNcclxuICAgICAgPyB0aGlzLnhBeGlzU2NhbGUucGFkZGluZ0lubmVyKDAuMSkucGFkZGluZ091dGVyKDApXHJcbiAgICAgIDogdGhpcy54QXhpc1NjYWxlLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCk7XHJcblxyXG4gICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcclxuICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcclxuICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy54QXhpc1RpY2tTaXplT3V0ZXIpXHJcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpO1xyXG5cclxuICAgIHRoaXMueEF4aXMgPSB0aGlzLnN2Z1xyXG4gICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy14JylcclxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcclxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXMpXHJcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxyXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNEb21haW4pXHJcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzVGlja3MpXHJcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcclxuXHJcbiAgICAvLyBYIEdSSURMSU5FU1xyXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xyXG4gICAgICB0aGlzLnhHcmlkQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKS50aWNrU2l6ZSgtdGhpcy5oZWlnaHQpO1xyXG5cclxuICAgICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXHJcbiAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcclxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcclxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxyXG4gICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBYIEFYSVMgVElUTEVcclxuICAgIGlmICh0aGlzLnhBeGlzVGl0bGUpIHtcclxuICAgICAgdGhpcy5zdmdcclxuICAgICAgICAuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcy10aXRsZScpXHJcbiAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgICAgLmF0dHIoXHJcbiAgICAgICAgICAndHJhbnNmb3JtJyxcclxuICAgICAgICAgIGB0cmFuc2xhdGUoJHt0aGlzLnN2Zy5hdHRyKCd3aWR0aCcpIC8gMiAtIHRoaXMubWFyZ2luLmxlZnQgLyAyIC0gdGhpcy5tYXJnaW4ucmlnaHQgLyAyfSwgJHtcclxuICAgICAgICAgICAgK3RoaXMuaGVpZ2h0ICsgK3RoaXMubWFyZ2luLnRvcCArICh0aGlzLmhpZGVYQXhpcyA/IDIwIDogNDApXHJcbiAgICAgICAgICB9KWBcclxuICAgICAgICApXHJcbiAgICAgICAgLnRleHQodGhpcy54QXhpc1RpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBLRUVQOiB1c2UgdGhpcyBibG9jayB0byBkZWJ1ZyB5QXhpc01heFxyXG4gICAgLy8gY29uc29sZS5sb2coXHJcbiAgICAvLyAgIGQzX21heCh0aGlzLmRhdGFTdGFjaywgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gZDNfbWF4KGRhdGEsIChkOiBhbnkpID0+IHtcclxuICAgIC8vICAgICAgIC8vIGNvbnNvbGUubG9nKCdEOiAnLCBkKTtcclxuICAgIC8vICAgICAgIHJldHVybiBkWzFdO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICB9KVxyXG4gICAgLy8gKTtcclxuXHJcbiAgICAvLyBZIEFYSVNcclxuICAgIHRoaXMueUF4aXNNaW4gPSBkM19taW4odGhpcy5kYXRhU3RhY2ssIChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgcmV0dXJuIGQzX21pbihkYXRhLCAoZDogYW55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGRbMF07XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnlBeGlzTWF4ID0gZDNfbWF4KHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgIHJldHVybiBkM19tYXgoZGF0YSwgKGQ6IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBkWzFdO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMueUF4aXNNYXggPSB0aGlzLnlBeGlzTWF4ICsgdGhpcy55QXhpc01heCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XHJcblxyXG4gICAgdGhpcy55QXhpc1NjYWxlID0gZDNfc2NhbGVMaW5lYXIoKS5kb21haW4oW3RoaXMueUF4aXNNaW4sIHRoaXMueUF4aXNNYXhdKS5uaWNlKCkucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKTtcclxuXHJcbiAgICB0aGlzLnlBeGlzQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcclxuICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcclxuICAgICAgLnRpY2tTaXplKHRoaXMueUF4aXNUaWNrU2l6ZSlcclxuICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy55QXhpc1RpY2tTaXplT3V0ZXIpXHJcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueUF4aXNGb3JtYXR0ZXIpO1xyXG5cclxuICAgIHRoaXMueUF4aXMgPSB0aGlzLnN2Z1xyXG4gICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy15JylcclxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXMpXHJcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxyXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNEb21haW4pXHJcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzVGlja3MpXHJcbiAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0RpdmVyZ2luZykge1xyXG4gICAgICB0aGlzLmNlbnRlcmxpbmUgPSB0aGlzLnN2Z1xyXG4gICAgICAgIC5hcHBlbmQoJ2xpbmUnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdjZW50ZXJsaW5lJylcclxuICAgICAgICAuYXR0cigneDInLCArdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLnJpZ2h0IC0gdGhpcy5tYXJnaW4ubGVmdClcclxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAgJHt0aGlzLnlBeGlzU2NhbGUoMCl9KWApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcuY2VudGVybGluZScpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFkgR1JJRExJTkVTXHJcbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XHJcbiAgICAgIHRoaXMueUdyaWRDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxyXG4gICAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXHJcbiAgICAgICAgLnRpY2tTaXplKC10aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KTtcclxuXHJcbiAgICAgIHRoaXMueUdyaWQgPSB0aGlzLnN2Z1xyXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteScpXHJcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXHJcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgMClgKVxyXG4gICAgICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT09MVElQXHJcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcclxuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcclxuICAgICAgICAuYXBwZW5kKCdkaXYnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgd2VzdCcpXHJcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcclxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcclxuXHJcbiAgICAgIC8vIHRvb2x0aXAgaGVhZGVyXHJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XHJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyLXZhbHVlJyk7XHJcblxyXG4gICAgICAvLyB0b29sdGlwIHRhYmxlXHJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ3RhYmxlJykuYXR0cignY2xhc3MnLCAndG9vbHRpcC10YWJsZSB0ZXh0LWxlZnQgdy0xMDAnKS5hcHBlbmQoJ3Rib2R5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWRkIGxlZ2VuZCBjbGFzc2VzXHJcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xyXG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcclxuICAgICAgdGhpcy5jaGFydC5hcHBlbmQoJ3VsJykuYXR0cignY2xhc3MnLCBgbGVnZW5kIGxlZ2VuZC0ke3RoaXMubGVnZW5kUG9zaXRpb259YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcclxuICAgICAgdGhpcy51cGRhdGVDaGFydChmYWxzZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVDaGFydCA9IChmaXJzdFJ1biA9IHRydWUpID0+IHtcclxuICAgIHRoaXMuZGF0YUtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gJ2tleScpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSB0aGUgRDMgc3RhY2sgZGF0YVxyXG4gICAgaWYgKHRoaXMuaXNEaXZlcmdpbmcpIHtcclxuICAgICAgdGhpcy5kYXRhU3RhY2sgPSBkM19zdGFjaygpLmtleXModGhpcy5kYXRhS2V5cykub2Zmc2V0KHN0YWNrT2Zmc2V0RGl2ZXJnaW5nKSh0aGlzLmRhdGEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kYXRhU3RhY2sgPSBkM19zdGFjaygpLmtleXModGhpcy5kYXRhS2V5cykub3JkZXIoZDNfc3RhY2tPcmRlck5vbmUpKHRoaXMuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIHRoZSB4U2NhbGVcclxuICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4odGhpcy5kYXRhLm1hcCgoZCkgPT4gZC5rZXkpKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgdGhlIHlTY2FsZVxyXG4gICAgdGhpcy55QXhpc01pbiA9IGQzX21pbih0aGlzLmRhdGFTdGFjaywgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICByZXR1cm4gZDNfbWluKGRhdGEsIChkOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gZFswXTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMueUF4aXNNYXggPSBkM19tYXgodGhpcy5kYXRhU3RhY2ssIChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgcmV0dXJuIGQzX21heChkYXRhLCAoZDogYW55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGRbMV07XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy55QXhpc01heCA9IHRoaXMueUF4aXNNYXggKyB0aGlzLnlBeGlzTWF4ICogdGhpcy55QXhpc01heEJ1ZmZlcjtcclxuXHJcbiAgICB0aGlzLnlBeGlzU2NhbGUuZG9tYWluKFt0aGlzLnlBeGlzTWluLCB0aGlzLnlBeGlzTWF4XSkucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKS5uaWNlKCk7XHJcblxyXG4gICAgdGhpcy54QXhpc1xyXG4gICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgIC5kdXJhdGlvbigxMDAwKSAvLyAxMDAwXHJcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcclxuXHJcbiAgICB0aGlzLnlBeGlzXHJcbiAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgLmR1cmF0aW9uKDEwMDApIC8vIDEwMDBcclxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xyXG5cclxuICAgIC8vIHVwZGF0ZSB0aGUgZ3JpZHNcclxuICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcclxuICAgICAgdGhpcy54R3JpZFxyXG4gICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAuZHVyYXRpb24oMTAwMCkgLy8gMTAwMFxyXG4gICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XHJcbiAgICAgIHRoaXMueUdyaWRcclxuICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApIC8vIDEwMDBcclxuICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEaXZlcmdpbmcpIHtcclxuICAgICAgdGhpcy5jZW50ZXJsaW5lXHJcbiAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKSAvLyAxMDAwXHJcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgICR7dGhpcy55QXhpc1NjYWxlKDApfSlgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgZ3JheSBiYXJzXHJcbiAgICBpZiAoIXRoaXMuaGlkZUdyYXlCYXJzKSB7XHJcbiAgICAgIHRoaXMuZ3JheUJhcnNcclxuICAgICAgICAuc2VsZWN0QWxsKCcuZ3JheS1iYXInKVxyXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcclxuICAgICAgICAuam9pbihcclxuICAgICAgICAgIChlbnRlcikgPT5cclxuICAgICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcclxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JheS1iYXInKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodCksXHJcbiAgICAgICAgICAodXBkYXRlKSA9PlxyXG4gICAgICAgICAgICB1cGRhdGVcclxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKChkLCBpLCBuKSA9PiAoZmlyc3RSdW4gPyAwIDogMTAwMCkpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcclxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICAgIC5zZWxlY3Rpb24oKSxcclxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgY29sb3JlZCBiYXJzXHJcbiAgICBjb25zdCBiYXJHcm91cHMgPSB0aGlzLmJhcnNcclxuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXHJcbiAgICAgIC5kYXRhKHRoaXMuZGF0YVN0YWNrKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICAoZW50ZXIpID0+XHJcbiAgICAgICAgICBlbnRlclxyXG4gICAgICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jhci1ncm91cCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmluZGV4KSksXHJcbiAgICAgICAgKHVwZGF0ZSkgPT4gdXBkYXRlLmF0dHIoJ2ZpbGwnLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQuaW5kZXgpKSxcclxuICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxyXG4gICAgICApO1xyXG5cclxuICAgIGJhckdyb3Vwc1xyXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcclxuICAgICAgLmRhdGEoKGQpID0+IGQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIChlbnRlcikgPT5cclxuICAgICAgICAgIGVudGVyXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcclxuICAgICAgICAgICAgLmNsYXNzZWQoJ2Jhci1kaXZpZGVkJywgdGhpcy50eXBlICE9PSAnaGlnaCcpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKCdiYXItZGl2aWRlZC1sb3cnLCB0aGlzLnR5cGUgPT09ICdsb3cnKVxyXG4gICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IHg7XHJcblxyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdtZWRpdW0nKSB7XHJcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy54QXhpc1NjYWxlKGQuZGF0YS5rZXkpICsgKHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDgpICogMztcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgeCA9IHRoaXMueEF4aXNTY2FsZShkLmRhdGEua2V5KSArICh0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA0KSAqIDE7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4geDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGRbMF0pKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgIGxldCB3aWR0aDtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNDtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2lkdGggPSB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyAyO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuIHdpZHRoO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcclxuICAgICAgICAgICAgLmNhbGwoKGVudGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigoZCwgaSwgbikgPT4gKGZpcnN0UnVuID8gMCA6IDUwMCkpXHJcbiAgICAgICAgICAgICAgICAuZGVsYXkoKGQsIGksIG4pID0+IChmaXJzdFJ1biA/IDAgOiA3NTApKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGRbMV0pKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnlBeGlzU2NhbGUoZFswXSkgLSB0aGlzLnlBeGlzU2NhbGUoZFsxXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGVudGVyO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAodXBkYXRlKSA9PlxyXG4gICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICB1cGRhdGVcclxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB3aWR0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xyXG4gICAgICAgICAgICAgICAgICB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpZHRoO1xyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHg7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcclxuICAgICAgICAgICAgICAgICAgeCA9IHRoaXMueEF4aXNTY2FsZShkLmRhdGEua2V5KSArICh0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA4KSAqIDM7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB4ID0gdGhpcy54QXhpc1NjYWxlKGQuZGF0YS5rZXkpICsgKHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQpICogMTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4geDtcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpID0+IHRoaXMueUF4aXNTY2FsZShkWzFdKSlcclxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpID0+IHRoaXMueUF4aXNTY2FsZShkWzBdKSAtIHRoaXMueUF4aXNTY2FsZShkWzFdKSlcclxuICAgICAgICAgICAgICAuc2VsZWN0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xyXG4gICAgICAgICAgfSksXHJcblxyXG4gICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXHJcbiAgICAgICk7XHJcblxyXG4gICAgLy8gbW91c2VvdmVyIGJhcnNcclxuICAgIHRoaXMubW91c2VCYXJzXHJcbiAgICAgIC5zZWxlY3RBbGwoJy5tb3VzZW92ZXItYmFyJylcclxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICAoZW50ZXIpID0+XHJcbiAgICAgICAgICBlbnRlclxyXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21vdXNlb3Zlci1iYXInKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxyXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB0aGlzLnhBeGlzU2NhbGUoZC5rZXkpKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodCksXHJcbiAgICAgICAgKHVwZGF0ZSkgPT5cclxuICAgICAgICAgIHVwZGF0ZVxyXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXHJcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgIC5zZWxlY3Rpb24oKVxyXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxyXG4gICAgICAgIChleGl0KSA9PiBleGl0LnRyYW5zaXRpb24oKS5zZWxlY3Rpb24oKS5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJykucmVtb3ZlKClcclxuICAgICAgKVxyXG4gICAgICAuZGF0dW0oKGQsIGkpID0+IHtcclxuICAgICAgICByZXR1cm4geyBkYXRhOiBkLCBpbmRleDogaSB9O1xyXG4gICAgICB9KVxyXG4gICAgICAub24oJ21vdXNlb3ZlcicsIChldmVudCwgZGF0YSkgPT4gdGhpcy5iYXJNb3VzZU92ZXIoZXZlbnQsIGRhdGEpKVxyXG4gICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJhck1vdXNlT3V0KCkpXHJcbiAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYmFyTW91c2VDbGljayhldmVudCwgZGF0YSkpO1xyXG5cclxuICAgIHRoaXMuYmFycy5yYWlzZSgpO1xyXG4gICAgdGhpcy54QXhpcy5yYWlzZSgpO1xyXG4gICAgdGhpcy5tb3VzZUJhcnMucmFpc2UoKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xyXG4gICAgICB0aGlzLmNoYXJ0XHJcbiAgICAgICAgLnNlbGVjdCgnLmxlZ2VuZCcpXHJcbiAgICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcclxuICAgICAgICAuZGF0YSh0aGlzLmRhdGFTdGFjaylcclxuICAgICAgICAuam9pbihcclxuICAgICAgICAgIChlbnRlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBsaSA9IGVudGVyLmFwcGVuZCgnbGknKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtaXRlbScpO1xyXG5cclxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcclxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWtleScpXHJcbiAgICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmluZGV4KSk7XHJcblxyXG4gICAgICAgICAgICBsaS5hcHBlbmQoJ3NwYW4nKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKVxyXG4gICAgICAgICAgICAgIC5odG1sKChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQua2V5KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGxpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICh1cGRhdGUpID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1sYWJlbCcpLmh0bWwoKGQpID0+IHtcclxuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmtleSk7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkLmtleTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxyXG4gICAgICAgIClcclxuICAgICAgICAuZGF0dW0oKGQsIGkpID0+IHtcclxuICAgICAgICAgIHJldHVybiB7IGRhdGE6IHRoaXMuZGF0YSwgaW5kZXg6IGkgfTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3ZlcihldmVudCwgZGF0YSkpXHJcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHRoaXMubGVnZW5kTW91c2VPdXQoKSlcclxuICAgICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmxlZ2VuZE1vdXNlQ2xpY2soZXZlbnQsIGRhdGEpKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBiYXJNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEpID0+IHtcclxuICAgIHRoaXMuY2hhcnRcclxuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXHJcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxyXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGkgIT09IGRhdGEuaW5kZXg7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xyXG5cclxuICAgIHRoaXMudG9vbHRpcFNob3coZXZlbnQsIGRhdGEpO1xyXG5cclxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XHJcbiAgfTtcclxuXHJcbiAgYmFyTW91c2VPdXQgPSAoKSA9PiB7XHJcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmJhcicpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xyXG5cclxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcclxuICB9O1xyXG5cclxuICBiYXJNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XHJcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZE1vdXNlT3ZlciA9IChldmVudCwgZGF0YSkgPT4ge1xyXG4gICAgdGhpcy5jaGFydFxyXG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxyXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBkYXRhLmluZGV4KVxyXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcclxuXHJcbiAgICB0aGlzLmNoYXJ0XHJcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxyXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBkYXRhLmluZGV4KVxyXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcclxuXHJcbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZE1vdXNlT3V0ID0gKCkgPT4ge1xyXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xyXG5cclxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZE1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEpID0+IHtcclxuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdHRlciA9IChpdGVtKSA9PiB7XHJcbiAgICBzd2l0Y2ggKHRoaXMueEF4aXNGb3JtYXRUeXBlKSB7XHJcbiAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQoaXRlbSk7XHJcblxyXG4gICAgICBjYXNlICd0aW1lJzpcclxuICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShpdGVtKTtcclxuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChwYXJzZURhdGUpO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKGV2ZW50LCBkYXRhKSA9PiB7XHJcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcclxuICAgIGNvbnN0IG1vdXNlcmVjdERpbWVuc2lvbnMgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3QgY2xpZW50V2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gMTA7XHJcbiAgICBsZXQgZGltZW5zaW9uQ2FsY3VsYXRlZDtcclxuICAgIGxldCB0b29sdGlwRGltZW5zaW9ucztcclxuICAgIGxldCB0b29sdGlwT2Zmc2V0SGVpZ2h0O1xyXG4gICAgLy8gY29uc3QgeVBvc2l0aW9uID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGxldCB5TWF4QmFyID0gMDtcclxuICAgIGxldCB5UG9zaXRpb247XHJcbiAgICBsZXQgeFBvc2l0aW9uO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbCwgbW91c2VyZWN0RGltZW5zaW9ucywgdG9vbHRpcE9mZnNldEhlaWdodCwgdG9vbHRpcERpbWVuc2lvbnMsIGRpbWVuc2lvbkNhbGN1bGF0ZWQsIGNsaWVudFdpZHRoKTtcclxuXHJcbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXInKS5odG1sKChkKSA9PiB7XHJcbiAgICAgIHN3aXRjaCAodGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdFR5cGUpIHtcclxuICAgICAgICBjYXNlICd0aW1lJzpcclxuICAgICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGRhdGEuZGF0YS5rZXkpO1xyXG4gICAgICAgICAgcmV0dXJuIGAke3RoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQocGFyc2VEYXRlKX0ke3RoaXMudG9vbHRpcEhlYWRpbmdTdWZmaXh9YDtcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHJldHVybiBgJHtkYXRhLmRhdGEua2V5fSR7dGhpcy50b29sdGlwSGVhZGluZ1N1ZmZpeH1gO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXItdmFsdWUnKS5odG1sKChkKSA9PiB7XHJcbiAgICAgIGxldCB0b3RhbCA9IDA7XHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhkYXRhLmRhdGEpLm1hcCgoZSkgPT4ge1xyXG4gICAgICAgIGlmIChlICE9PSAna2V5Jykge1xyXG4gICAgICAgICAgdG90YWwgPSB0b3RhbCArIGRhdGEuZGF0YVtlXTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdCh0b3RhbCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnRvb2x0aXBcclxuICAgICAgLnNlbGVjdCgnLnRvb2x0aXAtdGFibGUnKVxyXG4gICAgICAuc2VsZWN0KCd0Ym9keScpXHJcbiAgICAgIC5odG1sKChkKSA9PiB7XHJcbiAgICAgICAgbGV0IGh0bWwgPSBgYDtcclxuXHJcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5kYXRhKS5tYXAoKGtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgIGxldCBsYWJlbDtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IGRhdGEuZGF0YVtrZXldO1xyXG5cclxuICAgICAgICAgIHN3aXRjaCAodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxyXG4gICAgICAgICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGtleSk7XHJcbiAgICAgICAgICAgICAgbGFiZWwgPSB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0KHBhcnNlRGF0ZSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgIGxhYmVsID0ga2V5O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHN3aXRjaCAodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS5kYXRhW2tleV0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgdmFsdWUgPSBkYXRhLmRhdGFba2V5XTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoa2V5ICE9PSAna2V5Jykge1xyXG4gICAgICAgICAgICBodG1sICs9IGBcclxuICAgICAgICAgICAgICA8dHIgY2xhc3M9J3Rvb2x0aXAtaXRlbSc+XHJcbiAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJjb2xvcjogJHt0aGlzLmNvbG9yUmFuZ2UoaW5kZXggLSAxKX1cIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwYmRzLXRvb2x0aXAta2V5XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRvb2x0aXAtbGFiZWwgcHItMiB0ZXh0LW5vd3JhcFwiPiR7bGFiZWx9PC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRvb2x0aXAtdmFsdWUgdGV4dC1yaWdodCB0ZXh0LW5vd3JhcFwiPiR7dmFsdWV9PC90ZD5cclxuICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICBgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdG9vbHRpcERpbWVuc2lvbnMgPSB0aGlzLnRvb2x0aXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgZGltZW5zaW9uQ2FsY3VsYXRlZCA9IG1vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggKyB0b29sdGlwRGltZW5zaW9ucy53aWR0aCArIDg7XHJcbiAgICB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgIC8vIGZsaXAgdGhlIHRvb2x0aXAgcG9zaXRpb25zIGlmIG5lYXIgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIHNjcmVlblxyXG4gICAgaWYgKGRpbWVuc2lvbkNhbGN1bGF0ZWQgPiBjbGllbnRXaWR0aCkge1xyXG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIHRydWUpO1xyXG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnd2VzdCcsIGZhbHNlKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdtZWRpdW0nKSB7XHJcbiAgICAgICAgeFBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgKG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggLyA4KSAqIDMgLSB0b29sdGlwRGltZW5zaW9ucy53aWR0aCAtIDh9cHhgO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gNCkgKiAxIC0gdG9vbHRpcERpbWVuc2lvbnMud2lkdGggLSA4fXB4YDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChkaW1lbnNpb25DYWxjdWxhdGVkIDwgY2xpZW50V2lkdGgpIHtcclxuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ2Vhc3QnLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgdHJ1ZSk7XHJcblxyXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xyXG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gOCkgKiA1ICsgOH1weGA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeFBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgKG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggLyA0KSAqIDMgKyA4fXB4YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHlQb3NpdGlvbiA9IHRoaXMuc3ZnXHJcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxyXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcclxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBpID09PSBkYXRhLmluZGV4O1xyXG4gICAgICB9KVxyXG4gICAgICAuZWFjaCgoZCwgaSkgPT4ge1xyXG4gICAgICAgIHlNYXhCYXIgPSBkWzFdID4geU1heEJhciA/IGRbMV0gOiB5TWF4QmFyO1xyXG4gICAgICB9KVxyXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGRbMV0gPT09IHlNYXhCYXI7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5ub2RlKClcclxuICAgICAgLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIC8vIHNldCB0aGUgdG9vbHRpcCBzdHlsZXNcclxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7eVBvc2l0aW9uLnRvcCAtIHRvb2x0aXBPZmZzZXRIZWlnaHQgLyAyICsgc2Nyb2xsWzFdfXB4YCk7XHJcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCB4UG9zaXRpb24pO1xyXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcclxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgeUF4aXNGb3JtYXR0ZXIgPSAoaXRlbSkgPT4ge1xyXG4gICAgc3dpdGNoICh0aGlzLnlBeGlzRm9ybWF0VHlwZSkge1xyXG4gICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KGl0ZW0pO1xyXG5cclxuICAgICAgY2FzZSAndGltZSc6XHJcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQocGFyc2VEYXRlKTtcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iXX0=
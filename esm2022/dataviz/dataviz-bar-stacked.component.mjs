import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, } from '@angular/core';
import { max as d3_max, min as d3_min } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { scaleBand as d3_scaleBand, scaleLinear as d3_scaleLinear, scaleOrdinal as d3_scaleOrdinal } from 'd3-scale';
import { select as d3_select } from 'd3-selection';
import { stack as d3_stack, stackOrderNone as d3_stackOrderNone, stackOffsetDiverging } from 'd3-shape';
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
                <td class="tooltip-label pe-2 text-nowrap">${label}</td>
                <td class="tooltip-value text-end text-nowrap">${value}</td>
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
            left: +this.marginLeft,
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
        const colors = this.customColor ? this.colorsArray : this._dataviz.getColors(false, this.theme);
        this.colorRange = d3_scaleOrdinal().range(colors);
        // this.colorRange = d3_scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
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
            this.tooltip.append('table').attr('class', 'tooltip-table text-start w-100').append('tbody');
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizBarStackedComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: PbdsDatavizBarStackedComponent, selector: "pbds-dataviz-bar-stacked", inputs: { data: "data", width: "width", height: "height", type: "type", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", hideXAxis: "hideXAxis", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", xAxisTitle: "xAxisTitle", yAxisFormatType: "yAxisFormatType", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", yAxisMaxBuffer: "yAxisMaxBuffer", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", tooltipHeadingFormatType: "tooltipHeadingFormatType", tooltipHeadingFormatString: "tooltipHeadingFormatString", tooltipHeadingSuffix: "tooltipHeadingSuffix", tooltipHeadingValueFormatType: "tooltipHeadingValueFormatType", tooltipHeadingValueFormatString: "tooltipHeadingValueFormatString", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", theme: "theme", customColor: "customColor", colorsArray: "colorsArray", totalSavings: "totalSavings", rotateXaxis: "rotateXaxis", isDiverging: "isDiverging" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-stacked-bar": "this.stackedBarClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizBarStackedComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsWUFBWSxFQUNaLFdBQVcsRUFDWCxLQUFLLEVBSUwsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDeEQsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsUUFBUSxJQUFJLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsU0FBUyxJQUFJLFlBQVksRUFBRSxXQUFXLElBQUksY0FBYyxFQUFFLFlBQVksSUFBSSxlQUFlLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDckgsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLEtBQUssSUFBSSxRQUFRLEVBQUUsY0FBYyxJQUFJLGlCQUFpQixFQUFFLG9CQUFvQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hHLE9BQU8sRUFBRSxRQUFRLElBQUksV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFXekQsTUFBTSxPQUFPLDhCQUE4QjtJQW9LekMsWUFDVSxRQUE0QixFQUM1QixRQUFvQixFQUNwQixPQUF5QjtRQUZ6QixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBcktuQyxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBR2xCLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBTXZCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFHWixXQUFNLEdBQUcsR0FBRyxDQUFDO1FBR2IsU0FBSSxHQUF3QyxRQUFRLENBQUMsQ0FBQyxrQ0FBa0M7UUFHeEYsY0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDLHVEQUF1RDtRQUd2RSxnQkFBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLHVEQUF1RDtRQUd4RSxpQkFBWSxHQUFHLEVBQUUsQ0FBQyxDQUFDLHVEQUF1RDtRQUcxRSxlQUFVLEdBQUcsRUFBRSxDQUFDLENBQUMsdURBQXVEO1FBR3hFLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFHbEIsb0JBQWUsR0FBc0IsSUFBSSxDQUFDO1FBRzFDLHNCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUd2QixlQUFVLEdBQWtCLElBQUksQ0FBQztRQUdqQyxvQkFBZSxHQUFzQixJQUFJLENBQUM7UUFHMUMsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBR3ZCLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFHZixtQkFBYyxHQUFHLElBQUksQ0FBQztRQUd0QixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBR25CLGdCQUFXLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLHVFQUF1RTtRQUcvRixtQkFBYyxHQUF1QixRQUFRLENBQUM7UUFHOUMsMEJBQXFCLEdBQXNCLElBQUksQ0FBQztRQUdoRCw0QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFHN0IsNkJBQXdCLEdBQVcsSUFBSSxDQUFDO1FBR3hDLCtCQUEwQixHQUFHLEVBQUUsQ0FBQztRQUdoQyx5QkFBb0IsR0FBRyxFQUFFLENBQUM7UUFHMUIsa0NBQTZCLEdBQWEsSUFBSSxDQUFDO1FBRy9DLG9DQUErQixHQUFHLEVBQUUsQ0FBQztRQUdyQywyQkFBc0IsR0FBVyxJQUFJLENBQUM7UUFHdEMsNkJBQXdCLEdBQUcsRUFBRSxDQUFDO1FBRzlCLDJCQUFzQixHQUFhLElBQUksQ0FBQztRQUd4Qyw2QkFBd0IsR0FBRyxFQUFFLENBQUM7UUFNOUIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFHN0IsZ0JBQVcsR0FBRyxFQUFFLENBQUM7UUFJUixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUc3QixZQUFPLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFHM0QsWUFBTyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBd1UzRCxnQkFBVyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUM7WUFFM0UsMkJBQTJCO1lBQzNCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN6RjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JGO1lBRUQsb0JBQW9CO1lBQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUVwRCxvQkFBb0I7WUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQVMsRUFBRSxFQUFFO2dCQUNuRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRTtvQkFDN0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFTLEVBQUUsRUFBRTtnQkFDbkQsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUU7b0JBQzdCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBRXBFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFM0YsSUFBSSxDQUFDLEtBQUs7aUJBQ1AsVUFBVSxFQUFFO2lCQUNaLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPO2lCQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRXhCLElBQUksQ0FBQyxLQUFLO2lCQUNQLFVBQVUsRUFBRTtpQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTztpQkFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUV4QixtQkFBbUI7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxLQUFLO3FCQUNQLFVBQVUsRUFBRTtxQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTztxQkFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN6QjtZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNuQixJQUFJLENBQUMsS0FBSztxQkFDUCxVQUFVLEVBQUU7cUJBQ1osUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU87cUJBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDekI7WUFFRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxVQUFVO3FCQUNaLFVBQVUsRUFBRTtxQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTztxQkFDdEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDOUQ7WUFFRCxnQkFBZ0I7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxRQUFRO3FCQUNWLFNBQVMsQ0FBQyxXQUFXLENBQUM7cUJBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO3FCQUNmLElBQUksQ0FDSCxDQUFDLEtBQUssRUFBRSxFQUFFLENBQ1IsS0FBSztxQkFDRixNQUFNLENBQUMsTUFBTSxDQUFDO3FCQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO3FCQUN6QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDeEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO3FCQUMxQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFDaEMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUNULE1BQU07cUJBQ0gsVUFBVSxFQUFFO3FCQUNaLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDNUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3hDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztxQkFDMUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO3FCQUMzQixTQUFTLEVBQUUsRUFDaEIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FDeEIsQ0FBQzthQUNMO1lBRUQsbUJBQW1CO1lBQ25CLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJO2lCQUN4QixTQUFTLENBQUMsWUFBWSxDQUFDO2lCQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDcEIsSUFBSSxDQUNILENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FDUixLQUFLO2lCQUNGLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ1gsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUM7aUJBQzFCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ2xELENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDaEUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FDeEIsQ0FBQztZQUVKLFNBQVM7aUJBQ04sU0FBUyxDQUFDLE1BQU0sQ0FBQztpQkFDakIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2QsSUFBSSxDQUNILENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FDUixLQUFLO2lCQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUM7aUJBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7aUJBQ3BCLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUM7aUJBQzVDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQztpQkFDL0MsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLENBQUM7Z0JBRU4sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDMUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN6RTtxQkFBTTtvQkFDTCxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3pFO2dCQUVELE9BQU8sQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDbkIsSUFBSSxLQUFLLENBQUM7Z0JBRVYsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDMUIsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUN6QztxQkFBTTtvQkFDTCxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQ3pDO2dCQUVELE9BQU8sS0FBSyxDQUFDO1lBQ2YsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2lCQUNqQixJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDZCxLQUFLO3FCQUNGLFVBQVUsRUFBRTtxQkFDWixRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzNDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDeEMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNwQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsQ0FBQyxDQUFDLENBQUM7Z0JBRUwsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDLENBQUMsRUFDTixDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNyQixNQUFNO3FCQUNILFVBQVUsRUFBRTtxQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDO3FCQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDbkIsSUFBSSxLQUFLLENBQUM7b0JBRVYsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTt3QkFDMUIsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUN6Qzt5QkFBTTt3QkFDTCxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ3pDO29CQUVELE9BQU8sS0FBSyxDQUFDO2dCQUNmLENBQUMsQ0FBQztxQkFDRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNsQixJQUFJLENBQUMsQ0FBQztvQkFFTixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO3dCQUMxQixDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3pFO3lCQUFNO3dCQUNMLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDekU7b0JBRUQsT0FBTyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDO3FCQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDcEUsU0FBUyxFQUFFLENBQUM7Z0JBRWYsT0FBTyxNQUFNLENBQUM7WUFDaEIsQ0FBQyxDQUFDLEVBRUosQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FDeEIsQ0FBQztZQUVKLGlCQUFpQjtZQUNqQixJQUFJLENBQUMsU0FBUztpQkFDWCxTQUFTLENBQUMsZ0JBQWdCLENBQUM7aUJBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUNmLElBQUksQ0FDSCxDQUFDLEtBQUssRUFBRSxFQUFFLENBQ1IsS0FBSztpQkFDRixNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDO2lCQUM5QixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztpQkFDbkIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3hDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDMUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQ2hDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDVCxNQUFNO2lCQUNILElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUM7aUJBQzlCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN4QyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7aUJBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDM0IsVUFBVSxFQUFFO2lCQUNaLFNBQVMsRUFBRTtpQkFDWCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLEVBQ25DLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUNoRjtpQkFDQSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2QsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQy9CLENBQUMsQ0FBQztpQkFDRCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ2hFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7aUJBQ25ELEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRWpFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXZCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixJQUFJLENBQUMsS0FBSztxQkFDUCxNQUFNLENBQUMsU0FBUyxDQUFDO3FCQUNqQixTQUFTLENBQUMsY0FBYyxDQUFDO3FCQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztxQkFDcEIsSUFBSSxDQUNILENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUUzRCxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzt5QkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQzt5QkFDM0IsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUU5RCxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzt5QkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQzt5QkFDN0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7d0JBQ1YsUUFBUSxJQUFJLENBQUMscUJBQXFCLEVBQUU7NEJBQ2xDLEtBQUssUUFBUTtnQ0FDWCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBRXZDLEtBQUssTUFBTTtnQ0FDVCxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUN0QyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQzs0QkFFNUM7Z0NBQ0UsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO3lCQUNoQjtvQkFDSCxDQUFDLENBQUMsQ0FBQztvQkFFTCxPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDLEVBQ0QsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDVCxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUN4QyxRQUFRLElBQUksQ0FBQyxxQkFBcUIsRUFBRTs0QkFDbEMsS0FBSyxRQUFRO2dDQUNYLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFFdkMsS0FBSyxNQUFNO2dDQUNULE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ3RDLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDOzRCQUU1QztnQ0FDRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQ2hCO29CQUNILENBQUMsQ0FBQyxDQUFDO29CQUVILE9BQU8sTUFBTSxDQUFDO2dCQUNoQixDQUFDLEVBQ0QsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FDeEI7cUJBQ0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNkLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZDLENBQUMsQ0FBQztxQkFDRCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ25FLEVBQUUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO3FCQUMzQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3JFO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsaUJBQVksR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsS0FBSztpQkFDUCxTQUFTLENBQUMsWUFBWSxDQUFDO2lCQUN2QixTQUFTLENBQUMsTUFBTSxDQUFDO2lCQUNqQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMxQixDQUFDLENBQUM7aUJBQ0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU5QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQztRQUVGLGdCQUFXLEdBQUcsR0FBRyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFeEQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQztRQUVGLGtCQUFhLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUM7UUFFRixvQkFBZSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxLQUFLO2lCQUNQLFNBQVMsQ0FBQyxjQUFjLENBQUM7aUJBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDO2lCQUNsQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxLQUFLO2lCQUNQLFNBQVMsQ0FBQyxZQUFZLENBQUM7aUJBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDO2lCQUNsQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDO1FBRUYsbUJBQWMsR0FBRyxHQUFHLEVBQUU7WUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVoRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTlELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUM7UUFFRixxQkFBZ0IsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQztRQUVNLG1CQUFjLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNoQyxRQUFRLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQzVCLEtBQUssUUFBUTtvQkFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWhDLEtBQUssTUFBTTtvQkFDVCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3BDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFckM7b0JBQ0UsT0FBTyxJQUFJLENBQUM7YUFDZjtRQUNILENBQUMsQ0FBQztRQUVNLGdCQUFXLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ2hELE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3hFLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUNuRCxJQUFJLG1CQUFtQixDQUFDO1lBQ3hCLElBQUksaUJBQWlCLENBQUM7WUFDdEIsSUFBSSxtQkFBbUIsQ0FBQztZQUN4QixpRUFBaUU7WUFDakUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLElBQUksU0FBUyxDQUFDO1lBQ2QsSUFBSSxTQUFTLENBQUM7WUFFZCxzSEFBc0g7WUFFdEgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDaEQsUUFBUSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7b0JBQ3JDLEtBQUssTUFBTTt3QkFDVCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDN0MsT0FBTyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztvQkFFL0U7d0JBQ0UsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2lCQUN6RDtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDdEQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUVkLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUMvQixJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7d0JBQ2YsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM5QjtnQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFFSCxPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxPQUFPO2lCQUNULE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQztpQkFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDVixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBRWQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO3FCQUNuQixNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyw0QkFBNEI7cUJBQzNELEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtvQkFDbEIsSUFBSSxLQUFLLENBQUM7b0JBQ1YsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFM0IsUUFBUSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7d0JBQ25DLEtBQUssTUFBTTs0QkFDVCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ25DLEtBQUssR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQzdDLE1BQU07d0JBRVI7NEJBQ0UsS0FBSyxHQUFHLEdBQUcsQ0FBQztxQkFDZjtvQkFFRCxRQUFRLElBQUksQ0FBQyxzQkFBc0IsRUFBRTt3QkFDbkMsS0FBSyxRQUFROzRCQUNYLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO2dDQUN6QyxLQUFLLEdBQUcsRUFBRSxDQUFDOzZCQUNaO2lDQUFNO2dDQUNMLEtBQUssR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzZCQUNqRDs0QkFDRCxNQUFNO3dCQUVSOzRCQUNFLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMxQjtvQkFFRCxJQUFJLElBQUk7O29DQUVnQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQzs7OzZEQUdHLEtBQUs7aUVBQ0QsS0FBSzs7YUFFekQsQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQztnQkFFTCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDO1lBRUwsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ2hFLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUN6RyxtQkFBbUIsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBRXhELGtFQUFrRTtZQUNsRSxJQUFJLG1CQUFtQixHQUFHLFdBQVcsRUFBRTtnQkFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRXBDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7b0JBQzFCLFNBQVMsR0FBRyxHQUFHLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDO2lCQUNqSDtxQkFBTTtvQkFDTCxTQUFTLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQztpQkFDakg7YUFDRjtpQkFBTSxJQUFJLG1CQUFtQixHQUFHLFdBQVcsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRW5DLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7b0JBQzFCLFNBQVMsR0FBRyxHQUFHLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7aUJBQ3ZGO3FCQUFNO29CQUNMLFNBQVMsR0FBRyxHQUFHLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7aUJBQ3ZGO2FBQ0Y7WUFFRCxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUc7aUJBQ2pCLFNBQVMsQ0FBQyxZQUFZLENBQUM7aUJBQ3ZCLFNBQVMsQ0FBQyxNQUFNLENBQUM7aUJBQ2pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDZixPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzFCLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2IsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzVDLENBQUMsQ0FBQztpQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDO1lBQzFCLENBQUMsQ0FBQztpQkFDRCxJQUFJLEVBQUU7aUJBQ04scUJBQXFCLEVBQUUsQ0FBQztZQUUzQix5QkFBeUI7WUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsU0FBUyxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQztRQUVNLGdCQUFXLEdBQUcsR0FBRyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUM7UUFFTSxtQkFBYyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDaEMsUUFBUSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUM1QixLQUFLLFFBQVE7b0JBQ1gsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVoQyxLQUFLLE1BQU07b0JBQ1QsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXJDO29CQUNFLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7UUFDSCxDQUFDLENBQUM7SUE1dkJDLENBQUM7SUFFSixRQUFRO1FBQ04sOEJBQThCO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUM7UUFFM0UsMkJBQTJCO1FBQzNCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pGO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JGO1FBRUQsMENBQTBDO1FBRTFDLElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDWixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUztZQUNwQixLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVztZQUN4QixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUMxQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTtTQUN2QixDQUFDO1FBRUYsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUMxRyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ25ILElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FDckQsSUFBSSxDQUFDLDZCQUE2QixFQUNsQyxJQUFJLENBQUMsK0JBQStCLENBQ3JDLENBQUM7UUFDRixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzdHLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFN0csK0JBQStCO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztRQUM1QixpQ0FBaUM7UUFFakMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUN6QixvQkFBb0I7WUFDcEIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNqQixLQUFLLEtBQUs7b0JBQ1IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7b0JBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztvQkFDL0IsTUFBTTtnQkFFUixLQUFLLFFBQVE7b0JBQ1gsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7b0JBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7b0JBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDdEIsTUFBTTtnQkFFUixLQUFLLE1BQU07b0JBQ1QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUMzQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztvQkFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO29CQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO29CQUN4QixJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztvQkFDL0IsTUFBTTthQUNUO1NBQ0Y7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakQsZ0NBQWdDO1FBQ2hDLCtGQUErRjtRQUUvRixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLE9BQU8sRUFBRTtZQUN2RCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDOUM7UUFFRCxtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWhGLG1CQUFtQjtRQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLO2FBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDYixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUMxQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUNuRSxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQzthQUMxQixJQUFJLENBQUMscUJBQXFCLEVBQUUsZUFBZSxDQUFDO2FBQzVDLElBQUksQ0FDSCxTQUFTLEVBQ1QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQ2pILENBQUM7UUFFSixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXZELHFCQUFxQjtRQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hHLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBZSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELHlGQUF5RjtRQUV6RixTQUFTO1FBQ1QsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLEVBQUU7YUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFWix5Q0FBeUM7UUFDekMsQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7YUFDNUIsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQzthQUN0QyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUc7YUFDbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO2FBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQzthQUNqRCxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDdEMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUM7YUFDL0MsT0FBTyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUM7YUFDbkQsT0FBTyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV4QixjQUFjO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV2RSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHO2lCQUNsQixNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO2lCQUM1QixPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQztpQkFDL0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDO2lCQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsZUFBZTtRQUNmLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsR0FBRztpQkFDTCxNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO2lCQUMzQixJQUFJLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQztpQkFDN0IsSUFBSSxDQUNILFdBQVcsRUFDWCxhQUFhLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUNwRixDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUM3RCxHQUFHLENBQ0o7aUJBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMxQjtRQUVELHlDQUF5QztRQUN6QyxlQUFlO1FBQ2YsNENBQTRDO1FBQzVDLDRCQUE0QjtRQUU1Qix3Q0FBd0M7UUFDeEMsa0NBQWtDO1FBQ2xDLHFCQUFxQjtRQUNyQixVQUFVO1FBQ1YsT0FBTztRQUNQLEtBQUs7UUFFTCxTQUFTO1FBQ1QsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQ25ELE9BQU8sTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFO2dCQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDbkQsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUU7Z0JBQzdCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFFcEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5RyxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQzFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQ3RCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO2FBQzVCLGFBQWEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7YUFDdEMsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHO2FBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQzthQUM1QixPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDdEMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUM7YUFDL0MsT0FBTyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUM7YUFDbkQsT0FBTyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV4QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRztpQkFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztpQkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztpQkFDM0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7aUJBQzlELElBQUksQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzlEO2FBQU07WUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUM1QztRQUVELGNBQWM7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2lCQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztpQkFDdEIsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWhFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUc7aUJBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ1gsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUM7aUJBQzVCLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDO2lCQUMvQyxJQUFJLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDO2lCQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsVUFBVTtRQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztpQkFDN0IsTUFBTSxDQUFDLEtBQUssQ0FBQztpQkFDYixJQUFJLENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDO2lCQUNsQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztpQkFDbkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLGlDQUFpQztZQUVqRSxpQkFBaUI7WUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUVqRSxnQkFBZ0I7WUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5RjtRQUVELHFCQUFxQjtRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsY0FBYyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGlCQUFpQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztTQUMvRTtRQUVELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLE9BQU87WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN6QjtJQUNILENBQUM7K0dBemJVLDhCQUE4QjttR0FBOUIsOEJBQThCLDJnREFKL0IsRUFBRTs7NEZBSUQsOEJBQThCO2tCQU4xQyxTQUFTOytCQUNFLDBCQUEwQixZQUMxQixFQUFFLG1CQUVLLHVCQUF1QixDQUFDLE1BQU07aUtBSS9DLFVBQVU7c0JBRFQsV0FBVzt1QkFBQyxrQkFBa0I7Z0JBSS9CLGVBQWU7c0JBRGQsV0FBVzt1QkFBQyw4QkFBOEI7Z0JBSTNDLElBQUk7c0JBREgsS0FBSztnQkFJTixLQUFLO3NCQURKLEtBQUs7Z0JBSU4sTUFBTTtzQkFETCxLQUFLO2dCQUlOLElBQUk7c0JBREgsS0FBSztnQkFJTixTQUFTO3NCQURSLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLFlBQVk7c0JBRFgsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLGVBQWU7c0JBRGQsS0FBSztnQkFJTixpQkFBaUI7c0JBRGhCLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxLQUFLO2dCQUlOLGVBQWU7c0JBRGQsS0FBSztnQkFJTixpQkFBaUI7c0JBRGhCLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxLQUFLO2dCQUlOLGNBQWM7c0JBRGIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLGNBQWM7c0JBRGIsS0FBSztnQkFJTixxQkFBcUI7c0JBRHBCLEtBQUs7Z0JBSU4sdUJBQXVCO3NCQUR0QixLQUFLO2dCQUlOLHdCQUF3QjtzQkFEdkIsS0FBSztnQkFJTiwwQkFBMEI7c0JBRHpCLEtBQUs7Z0JBSU4sb0JBQW9CO3NCQURuQixLQUFLO2dCQUlOLDZCQUE2QjtzQkFENUIsS0FBSztnQkFJTiwrQkFBK0I7c0JBRDlCLEtBQUs7Z0JBSU4sc0JBQXNCO3NCQURyQixLQUFLO2dCQUlOLHdCQUF3QjtzQkFEdkIsS0FBSztnQkFJTixzQkFBc0I7c0JBRHJCLEtBQUs7Z0JBSU4sd0JBQXdCO3NCQUR2QixLQUFLO2dCQUlOLEtBQUs7c0JBREosS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLFlBQVk7c0JBRFgsS0FBSztnQkFFRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBR04sT0FBTztzQkFETixNQUFNO2dCQUlQLE9BQU87c0JBRE4sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgbWF4IGFzIGQzX21heCwgbWluIGFzIGQzX21pbiB9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7IGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSwgYXhpc0xlZnQgYXMgZDNfYXhpc0xlZnQgfSBmcm9tICdkMy1heGlzJztcbmltcG9ydCB7IHNjYWxlQmFuZCBhcyBkM19zY2FsZUJhbmQsIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLCBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBzdGFjayBhcyBkM19zdGFjaywgc3RhY2tPcmRlck5vbmUgYXMgZDNfc3RhY2tPcmRlck5vbmUsIHN0YWNrT2Zmc2V0RGl2ZXJnaW5nIH0gZnJvbSAnZDMtc2hhcGUnO1xuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyU3RhY2tlZCB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWJhci1zdGFja2VkJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpCYXJTdGFja2VkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1zdGFja2VkLWJhcicpXG4gIHN0YWNrZWRCYXJDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogQXJyYXk8UGJkc0RhdGF2aXpCYXJTdGFja2VkPjtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwNjtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ2xvdycgfCAnbWVkaXVtJyB8ICdoaWdoJyB8ICdkZWJ1ZycgPSAnbWVkaXVtJzsgLy8gZGVidWcgdG8gc2hvdyBhbGwgY2hhcnQgb3B0aW9uc1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDEwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMzA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gNTU7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBoaWRlWEF4aXMgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGl0bGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgeUF4aXNUaWNrcyA9IDU7XG5cbiAgQElucHV0KClcbiAgeUF4aXNNYXhCdWZmZXIgPSAwLjAxO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDEwNSArIDI4OyAvLyBoYXJkY29kZWQgbGVnZW5kIHdpZHRoICsgbGVmdCBtYXJnaW4sIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFBvc2l0aW9uOiAncmlnaHQnIHwgJ2JvdHRvbScgPSAnYm90dG9tJztcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBIZWFkaW5nRm9ybWF0VHlwZTogJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwSGVhZGluZ0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBIZWFkaW5nU3VmZml4ID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0VHlwZTogJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdGhlbWU7XG5cbiAgQElucHV0KClcbiAgY3VzdG9tQ29sb3I6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBjb2xvcnNBcnJheSA9IFtdO1xuXG4gIEBJbnB1dCgpXG4gIHRvdGFsU2F2aW5ncztcbiAgQElucHV0KCkgcm90YXRlWGF4aXMgPSB0cnVlO1xuICBASW5wdXQoKSBpc0RpdmVyZ2luZyA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKVxuICBob3ZlcmVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBPdXRwdXQoKVxuICBjbGlja2VkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIHByaXZhdGUgZGF0YVN0YWNrO1xuICBwcml2YXRlIGRhdGFLZXlzO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBncmF5QmFycztcbiAgcHJpdmF0ZSBtb3VzZUJhcnM7XG4gIHByaXZhdGUgYmFycztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBoaWRlR3JheUJhcnM6IGJvb2xlYW47XG4gIHByaXZhdGUgeEF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XG4gIHByaXZhdGUgeEF4aXM7XG4gIHByaXZhdGUgeEF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGl0bGVNYXJnaW46IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEdyaWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlHcmlkOiBib29sZWFuO1xuICBwcml2YXRlIHlBeGlzTWF4O1xuICBwcml2YXRlIHlBeGlzU2NhbGU7XG4gIHByaXZhdGUgeUF4aXNDYWxsO1xuICBwcml2YXRlIHlBeGlzO1xuICBwcml2YXRlIHlBeGlzRm9ybWF0O1xuICBwcml2YXRlIHlBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSB4R3JpZDtcbiAgcHJpdmF0ZSB4R3JpZENhbGw7XG4gIHByaXZhdGUgeUdyaWQ7XG4gIHByaXZhdGUgeUdyaWRDYWxsO1xuICBwcml2YXRlIGhpZGVZQXhpczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsZWdlbmRMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIGhpZGVUb29sdGlwOiBib29sZWFuO1xuICBwcml2YXRlIHRvb2x0aXBIZWFkaW5nRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSBjZW50ZXJsaW5lO1xuICB5QXhpc01pbjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcixcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIGV4dHJhY3Qga2V5cyBmb3Igc3RhY2sgZGF0YVxuICAgIHRoaXMuZGF0YUtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gJ2tleScpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBEMyBzdGFjayBkYXRhXG4gICAgaWYgKHRoaXMuaXNEaXZlcmdpbmcpIHtcbiAgICAgIHRoaXMuZGF0YVN0YWNrID0gZDNfc3RhY2soKS5rZXlzKHRoaXMuZGF0YUtleXMpLm9mZnNldChzdGFja09mZnNldERpdmVyZ2luZykodGhpcy5kYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhU3RhY2sgPSBkM19zdGFjaygpLmtleXModGhpcy5kYXRhS2V5cykub3JkZXIoZDNfc3RhY2tPcmRlck5vbmUpKHRoaXMuZGF0YSk7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0LFxuICAgIH07XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMueEF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueEF4aXNGb3JtYXRUeXBlLCB0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnlBeGlzRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0VHlwZSwgdGhpcy55QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUsIHRoaXMubGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KFxuICAgICAgdGhpcy50b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0VHlwZSxcbiAgICAgIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFN0cmluZyxcbiAgICApO1xuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXG4gICAgdGhpcy5oaWRlR3JheUJhcnMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhHcmlkID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUdyaWQgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlVG9vbHRpcCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gZmFsc2U7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnhBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnlBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgLy8gdGhpcy5oaWRlVG9vbHRpcExhYmVsID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XG4gICAgICAvLyBzZXQgdHlwZSBkZWZhdWx0c1xuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbG93JzpcbiAgICAgICAgICB0aGlzLmhpZGVHcmF5QmFycyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5sZWdlbmRQb3NpdGlvbiA9ICdib3R0b20nO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ21lZGl1bSc6XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhHcmlkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUdyaWQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2hpZ2gnOlxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZR3JpZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlTGVnZW5kID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5sZWdlbmRQb3NpdGlvbiA9ICdib3R0b20nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMueEF4aXNUaXRsZU1hcmdpbiA9IHRoaXMueEF4aXNUaXRsZSA/IDMwIDogMDtcblxuICAgIC8vIGFkanVzdCBtYXJnaW4gaWYgeEF4aXMgaGlkZGVuXG4gICAgLy9pZiAodGhpcy5oaWRlWEF4aXMpIHRoaXMubWFyZ2luLmJvdHRvbSA9IDEwOyAvLyBuZWVkIHNtYWxsIG1hcmdpbiBmb3IgeUF4aXMgd2l0aCAwIHRpY2sgbGFiZWxcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRofSAkeyt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbX1gLFxuICAgICAgKTtcblxuICAgIHRoaXMuZ3JheUJhcnMgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdncmF5LWJhcnMnKTtcbiAgICB0aGlzLm1vdXNlQmFycyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ21vdXNlb3Zlci1iYXJzJyk7XG4gICAgdGhpcy5iYXJzID0gdGhpcy5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnYmFycycpO1xuXG4gICAgLy8gYnVpbGQgY29sb3IgcmFuZ2VzXG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5jdXN0b21Db2xvciA/IHRoaXMuY29sb3JzQXJyYXkgOiB0aGlzLl9kYXRhdml6LmdldENvbG9ycyhmYWxzZSwgdGhpcy50aGVtZSk7XG4gICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVPcmRpbmFsKCkucmFuZ2UoY29sb3JzKTtcbiAgICAvLyB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKS5yYW5nZSh0aGlzLl9kYXRhdml6LmdldENvbG9ycyhmYWxzZSwgdGhpcy50aGVtZSkpO1xuXG4gICAgLy8gWCBBWElTXG4gICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgIC5kb21haW4odGhpcy5kYXRhLm1hcCgoZCkgPT4gZC5rZXkpKVxuICAgICAgLnJhbmdlUm91bmQoWzAsIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0XSlcbiAgICAgIC5hbGlnbigwKTtcblxuICAgIC8vIGFkZCBwYWRkaW5nIHRvIHRoZSBzY2FsZSBmb3IgZ3JheSBiYXJzXG4gICAgIXRoaXMuaGlkZUdyYXlCYXJzXG4gICAgICA/IHRoaXMueEF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMC4xKS5wYWRkaW5nT3V0ZXIoMClcbiAgICAgIDogdGhpcy54QXhpc1NjYWxlLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCk7XG5cbiAgICB0aGlzLnhBeGlzQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKVxuICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy14JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXNUaWNrcylcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIC8vIFggR1JJRExJTkVTXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZENhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSkudGlja1NpemUoLXRoaXMuaGVpZ2h0KTtcblxuICAgICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXgnKVxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIH1cblxuICAgIC8vIFggQVhJUyBUSVRMRVxuICAgIGlmICh0aGlzLnhBeGlzVGl0bGUpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcy10aXRsZScpXG4gICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAuYXR0cihcbiAgICAgICAgICAndHJhbnNmb3JtJyxcbiAgICAgICAgICBgdHJhbnNsYXRlKCR7dGhpcy5zdmcuYXR0cignd2lkdGgnKSAvIDIgLSB0aGlzLm1hcmdpbi5sZWZ0IC8gMiAtIHRoaXMubWFyZ2luLnJpZ2h0IC8gMn0sICR7XG4gICAgICAgICAgICArdGhpcy5oZWlnaHQgKyArdGhpcy5tYXJnaW4udG9wICsgKHRoaXMuaGlkZVhBeGlzID8gMjAgOiA0MClcbiAgICAgICAgICB9KWAsXG4gICAgICAgIClcbiAgICAgICAgLnRleHQodGhpcy54QXhpc1RpdGxlKTtcbiAgICB9XG5cbiAgICAvLyBLRUVQOiB1c2UgdGhpcyBibG9jayB0byBkZWJ1ZyB5QXhpc01heFxuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgZDNfbWF4KHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgLy8gICAgIHJldHVybiBkM19tYXgoZGF0YSwgKGQ6IGFueSkgPT4ge1xuICAgIC8vICAgICAgIC8vIGNvbnNvbGUubG9nKCdEOiAnLCBkKTtcbiAgICAvLyAgICAgICByZXR1cm4gZFsxXTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9KVxuICAgIC8vICk7XG5cbiAgICAvLyBZIEFYSVNcbiAgICB0aGlzLnlBeGlzTWluID0gZDNfbWluKHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICByZXR1cm4gZDNfbWluKGRhdGEsIChkOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIGRbMF07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLnlBeGlzTWF4ID0gZDNfbWF4KHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICByZXR1cm4gZDNfbWF4KGRhdGEsIChkOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIGRbMV07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMueUF4aXNNYXggPSB0aGlzLnlBeGlzTWF4ICsgdGhpcy55QXhpc01heCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG5cbiAgICB0aGlzLnlBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpLmRvbWFpbihbdGhpcy55QXhpc01pbiwgdGhpcy55QXhpc01heF0pLm5pY2UoKS5yYW5nZVJvdW5kKFt0aGlzLmhlaWdodCwgMF0pO1xuXG4gICAgdGhpcy55QXhpc0NhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgLnRpY2tTaXplKHRoaXMueUF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy55QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnlBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy15JylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgaWYgKHRoaXMuaXNEaXZlcmdpbmcpIHtcbiAgICAgIHRoaXMuY2VudGVybGluZSA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2xpbmUnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnY2VudGVybGluZScpXG4gICAgICAgIC5hdHRyKCd4MicsICt0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ucmlnaHQgLSB0aGlzLm1hcmdpbi5sZWZ0KVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAgJHt0aGlzLnlBeGlzU2NhbGUoMCl9KWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5jZW50ZXJsaW5lJykucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgLy8gWSBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XG4gICAgICB0aGlzLnlHcmlkQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgICAgLnRpY2tTaXplKC10aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KTtcblxuICAgICAgdGhpcy55R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXknKVxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgMClgKVxuICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCB3ZXN0JylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgLy8gaGlkZSB0b29sdGlwIGZvciBhY2Nlc3NpYmlsaXR5XG5cbiAgICAgIC8vIHRvb2x0aXAgaGVhZGVyXG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWhlYWRlcicpO1xuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXItdmFsdWUnKTtcblxuICAgICAgLy8gdG9vbHRpcCB0YWJsZVxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgndGFibGUnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLXRhYmxlIHRleHQtc3RhcnQgdy0xMDAnKS5hcHBlbmQoJ3Rib2R5Jyk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGxlZ2VuZCBjbGFzc2VzXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuY2hhcnQuY2xhc3NlZCgncGJkcy1jaGFydC1sZWdlbmQtYm90dG9tJywgdGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gJ2JvdHRvbScgPyB0cnVlIDogZmFsc2UpO1xuICAgICAgdGhpcy5jaGFydC5hcHBlbmQoJ3VsJykuYXR0cignY2xhc3MnLCBgbGVnZW5kIGxlZ2VuZC0ke3RoaXMubGVnZW5kUG9zaXRpb259YCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydChmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoZmlyc3RSdW4gPSB0cnVlKSA9PiB7XG4gICAgdGhpcy5kYXRhS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSAna2V5Jyk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIEQzIHN0YWNrIGRhdGFcbiAgICBpZiAodGhpcy5pc0RpdmVyZ2luZykge1xuICAgICAgdGhpcy5kYXRhU3RhY2sgPSBkM19zdGFjaygpLmtleXModGhpcy5kYXRhS2V5cykub2Zmc2V0KHN0YWNrT2Zmc2V0RGl2ZXJnaW5nKSh0aGlzLmRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGFTdGFjayA9IGQzX3N0YWNrKCkua2V5cyh0aGlzLmRhdGFLZXlzKS5vcmRlcihkM19zdGFja09yZGVyTm9uZSkodGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdGhlIHhTY2FsZVxuICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4odGhpcy5kYXRhLm1hcCgoZCkgPT4gZC5rZXkpKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgeVNjYWxlXG4gICAgdGhpcy55QXhpc01pbiA9IGQzX21pbih0aGlzLmRhdGFTdGFjaywgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIGQzX21pbihkYXRhLCAoZDogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiBkWzBdO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy55QXhpc01heCA9IGQzX21heCh0aGlzLmRhdGFTdGFjaywgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIGQzX21heChkYXRhLCAoZDogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiBkWzFdO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnlBeGlzTWF4ID0gdGhpcy55QXhpc01heCArIHRoaXMueUF4aXNNYXggKiB0aGlzLnlBeGlzTWF4QnVmZmVyO1xuXG4gICAgdGhpcy55QXhpc1NjYWxlLmRvbWFpbihbdGhpcy55QXhpc01pbiwgdGhpcy55QXhpc01heF0pLnJhbmdlUm91bmQoW3RoaXMuaGVpZ2h0LCAwXSkubmljZSgpO1xuXG4gICAgdGhpcy54QXhpc1xuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDEwMDApIC8vIDEwMDBcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIHRoaXMueUF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigxMDAwKSAvLyAxMDAwXG4gICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIGdyaWRzXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZFxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKSAvLyAxMDAwXG4gICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XG4gICAgICB0aGlzLnlHcmlkXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApIC8vIDEwMDBcbiAgICAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRGl2ZXJnaW5nKSB7XG4gICAgICB0aGlzLmNlbnRlcmxpbmVcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMCkgLy8gMTAwMFxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAgJHt0aGlzLnlBeGlzU2NhbGUoMCl9KWApO1xuICAgIH1cblxuICAgIC8vIGFkZCBncmF5IGJhcnNcbiAgICBpZiAoIXRoaXMuaGlkZUdyYXlCYXJzKSB7XG4gICAgICB0aGlzLmdyYXlCYXJzXG4gICAgICAgIC5zZWxlY3RBbGwoJy5ncmF5LWJhcicpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmF5LWJhcicpXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KSxcbiAgICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKChkLCBpLCBuKSA9PiAoZmlyc3RSdW4gPyAwIDogMTAwMCkpXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgICAuc2VsZWN0aW9uKCksXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKCksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGNvbG9yZWQgYmFyc1xuICAgIGNvbnN0IGJhckdyb3VwcyA9IHRoaXMuYmFyc1xuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuZGF0YSh0aGlzLmRhdGFTdGFjaylcbiAgICAgIC5qb2luKFxuICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jhci1ncm91cCcpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5pbmRleCkpLFxuICAgICAgICAodXBkYXRlKSA9PiB1cGRhdGUuYXR0cignZmlsbCcsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5pbmRleCkpLFxuICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKSxcbiAgICAgICk7XG5cbiAgICBiYXJHcm91cHNcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoKGQpID0+IGQpXG4gICAgICAuam9pbihcbiAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXInKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ2Jhci1kaXZpZGVkJywgdGhpcy50eXBlICE9PSAnaGlnaCcpXG4gICAgICAgICAgICAuY2xhc3NlZCgnYmFyLWRpdmlkZWQtbG93JywgdGhpcy50eXBlID09PSAnbG93JylcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgbGV0IHg7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy54QXhpc1NjYWxlKGQuZGF0YS5rZXkpICsgKHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDgpICogMztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy54QXhpc1NjYWxlKGQuZGF0YS5rZXkpICsgKHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQpICogMTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpID0+IHRoaXMueUF4aXNTY2FsZShkWzBdKSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSA9PiB7XG4gICAgICAgICAgICAgIGxldCB3aWR0aDtcblxuICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xuICAgICAgICAgICAgICAgIHdpZHRoID0gdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDI7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAuY2FsbCgoZW50ZXIpID0+IHtcbiAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKChkLCBpLCBuKSA9PiAoZmlyc3RSdW4gPyAwIDogNTAwKSlcbiAgICAgICAgICAgICAgICAuZGVsYXkoKGQsIGksIG4pID0+IChmaXJzdFJ1biA/IDAgOiA3NTApKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpID0+IHRoaXMueUF4aXNTY2FsZShkWzFdKSlcbiAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnlBeGlzU2NhbGUoZFswXSkgLSB0aGlzLnlBeGlzU2NhbGUoZFsxXSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGVudGVyO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHdpZHRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcbiAgICAgICAgICAgICAgICAgIHdpZHRoID0gdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgd2lkdGggPSB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyAyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB3aWR0aDtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB4O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcbiAgICAgICAgICAgICAgICAgIHggPSB0aGlzLnhBeGlzU2NhbGUoZC5kYXRhLmtleSkgKyAodGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gOCkgKiAzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB4ID0gdGhpcy54QXhpc1NjYWxlKGQuZGF0YS5rZXkpICsgKHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQpICogMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGRbMV0pKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpID0+IHRoaXMueUF4aXNTY2FsZShkWzBdKSAtIHRoaXMueUF4aXNTY2FsZShkWzFdKSlcbiAgICAgICAgICAgICAgLnNlbGVjdGlvbigpO1xuXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgIH0pLFxuXG4gICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpLFxuICAgICAgKTtcblxuICAgIC8vIG1vdXNlb3ZlciBiYXJzXG4gICAgdGhpcy5tb3VzZUJhcnNcbiAgICAgIC5zZWxlY3RBbGwoJy5tb3VzZW92ZXItYmFyJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21vdXNlb3Zlci1iYXInKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpLFxuICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5zZWxlY3Rpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKSxcbiAgICAgICAgKGV4aXQpID0+IGV4aXQudHJhbnNpdGlvbigpLnNlbGVjdGlvbigpLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKS5yZW1vdmUoKSxcbiAgICAgIClcbiAgICAgIC5kYXR1bSgoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4geyBkYXRhOiBkLCBpbmRleDogaSB9O1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJhck1vdXNlT3ZlcihldmVudCwgZGF0YSkpXG4gICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJhck1vdXNlT3V0KCkpXG4gICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJhck1vdXNlQ2xpY2soZXZlbnQsIGRhdGEpKTtcblxuICAgIHRoaXMuYmFycy5yYWlzZSgpO1xuICAgIHRoaXMueEF4aXMucmFpc2UoKTtcbiAgICB0aGlzLm1vdXNlQmFycy5yYWlzZSgpO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuY2hhcnRcbiAgICAgICAgLnNlbGVjdCgnLmxlZ2VuZCcpXG4gICAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YVN0YWNrKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZW50ZXIuYXBwZW5kKCdsaScpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJyk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmluZGV4KSk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKVxuICAgICAgICAgICAgICAuaHRtbCgoZCkgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQua2V5KTtcblxuICAgICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmtleSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1sYWJlbCcpLmh0bWwoKGQpID0+IHtcbiAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmtleSk7XG5cbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmtleSk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5rZXk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKCksXG4gICAgICAgIClcbiAgICAgICAgLmRhdHVtKChkLCBpKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHsgZGF0YTogdGhpcy5kYXRhLCBpbmRleDogaSB9O1xuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChldmVudCwgZGF0YSkgPT4gdGhpcy5sZWdlbmRNb3VzZU92ZXIoZXZlbnQsIGRhdGEpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4gdGhpcy5sZWdlbmRNb3VzZU91dCgpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmxlZ2VuZE1vdXNlQ2xpY2soZXZlbnQsIGRhdGEpKTtcbiAgICB9XG4gIH07XG5cbiAgYmFyTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIGkgIT09IGRhdGEuaW5kZXg7XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTaG93KGV2ZW50LCBkYXRhKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgYmFyTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXInKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBiYXJNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gZGF0YS5pbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBkYXRhLmluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdHRlciA9IChpdGVtKSA9PiB7XG4gICAgc3dpdGNoICh0aGlzLnhBeGlzRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQoaXRlbSk7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQocGFyc2VEYXRlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBjb25zdCBtb3VzZXJlY3REaW1lbnNpb25zID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjbGllbnRXaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSAxMDtcbiAgICBsZXQgZGltZW5zaW9uQ2FsY3VsYXRlZDtcbiAgICBsZXQgdG9vbHRpcERpbWVuc2lvbnM7XG4gICAgbGV0IHRvb2x0aXBPZmZzZXRIZWlnaHQ7XG4gICAgLy8gY29uc3QgeVBvc2l0aW9uID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgeU1heEJhciA9IDA7XG4gICAgbGV0IHlQb3NpdGlvbjtcbiAgICBsZXQgeFBvc2l0aW9uO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsLCBtb3VzZXJlY3REaW1lbnNpb25zLCB0b29sdGlwT2Zmc2V0SGVpZ2h0LCB0b29sdGlwRGltZW5zaW9ucywgZGltZW5zaW9uQ2FsY3VsYXRlZCwgY2xpZW50V2lkdGgpO1xuXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbCgoZCkgPT4ge1xuICAgICAgc3dpdGNoICh0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0VHlwZSkge1xuICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShkYXRhLmRhdGEua2V5KTtcbiAgICAgICAgICByZXR1cm4gYCR7dGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdChwYXJzZURhdGUpfSR7dGhpcy50b29sdGlwSGVhZGluZ1N1ZmZpeH1gO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGAke2RhdGEuZGF0YS5rZXl9JHt0aGlzLnRvb2x0aXBIZWFkaW5nU3VmZml4fWA7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXItdmFsdWUnKS5odG1sKChkKSA9PiB7XG4gICAgICBsZXQgdG90YWwgPSAwO1xuXG4gICAgICBPYmplY3Qua2V5cyhkYXRhLmRhdGEpLm1hcCgoZSkgPT4ge1xuICAgICAgICBpZiAoZSAhPT0gJ2tleScpIHtcbiAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgZGF0YS5kYXRhW2VdO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdCh0b3RhbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2x0aXBcbiAgICAgIC5zZWxlY3QoJy50b29sdGlwLXRhYmxlJylcbiAgICAgIC5zZWxlY3QoJ3Rib2R5JylcbiAgICAgIC5odG1sKChkKSA9PiB7XG4gICAgICAgIGxldCBodG1sID0gYGA7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5kYXRhKVxuICAgICAgICAgIC5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSAna2V5JykgLy8gcmVtb3ZlIHRoZSAna2V5JyBwcm9wZXJ0eVxuICAgICAgICAgIC5tYXAoKGtleSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGxldCBsYWJlbDtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGRhdGEuZGF0YVtrZXldO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShrZXkpO1xuICAgICAgICAgICAgICAgIGxhYmVsID0gdGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdChwYXJzZURhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbGFiZWwgPSBrZXk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS5kYXRhW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHZhbHVlID0gZGF0YS5kYXRhW2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0bWwgKz0gYFxuICAgICAgICAgICAgICA8dHIgY2xhc3M9J3Rvb2x0aXAtaXRlbSc+XG4gICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwiY29sb3I6ICR7dGhpcy5jb2xvclJhbmdlKGluZGV4KX1cIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGJkcy10b29sdGlwLWtleVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRvb2x0aXAtbGFiZWwgcGUtMiB0ZXh0LW5vd3JhcFwiPiR7bGFiZWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0b29sdGlwLXZhbHVlIHRleHQtZW5kIHRleHQtbm93cmFwXCI+JHt2YWx1ZX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgYDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICAgIH0pO1xuXG4gICAgdG9vbHRpcERpbWVuc2lvbnMgPSB0aGlzLnRvb2x0aXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGRpbWVuc2lvbkNhbGN1bGF0ZWQgPSBtb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyBtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoICsgdG9vbHRpcERpbWVuc2lvbnMud2lkdGggKyA4O1xuICAgIHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAvLyBmbGlwIHRoZSB0b29sdGlwIHBvc2l0aW9ucyBpZiBuZWFyIHRoZSByaWdodCBlZGdlIG9mIHRoZSBzY3JlZW5cbiAgICBpZiAoZGltZW5zaW9uQ2FsY3VsYXRlZCA+IGNsaWVudFdpZHRoKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIHRydWUpO1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3dlc3QnLCBmYWxzZSk7XG5cbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdtZWRpdW0nKSB7XG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gOCkgKiAzIC0gdG9vbHRpcERpbWVuc2lvbnMud2lkdGggLSA4fXB4YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gNCkgKiAxIC0gdG9vbHRpcERpbWVuc2lvbnMud2lkdGggLSA4fXB4YDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRpbWVuc2lvbkNhbGN1bGF0ZWQgPCBjbGllbnRXaWR0aCkge1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ2Vhc3QnLCBmYWxzZSk7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnd2VzdCcsIHRydWUpO1xuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xuICAgICAgICB4UG9zaXRpb24gPSBgJHttb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyAobW91c2VyZWN0RGltZW5zaW9ucy53aWR0aCAvIDgpICogNSArIDh9cHhgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeFBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgKG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggLyA0KSAqIDMgKyA4fXB4YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB5UG9zaXRpb24gPSB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIGkgPT09IGRhdGEuaW5kZXg7XG4gICAgICB9KVxuICAgICAgLmVhY2goKGQsIGkpID0+IHtcbiAgICAgICAgeU1heEJhciA9IGRbMV0gPiB5TWF4QmFyID8gZFsxXSA6IHlNYXhCYXI7XG4gICAgICB9KVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gZFsxXSA9PT0geU1heEJhcjtcbiAgICAgIH0pXG4gICAgICAubm9kZSgpXG4gICAgICAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAvLyBzZXQgdGhlIHRvb2x0aXAgc3R5bGVzXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHt5UG9zaXRpb24udG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodCAvIDIgKyBzY3JvbGxbMV19cHhgKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCB4UG9zaXRpb24pO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdHRlciA9IChpdGVtKSA9PiB7XG4gICAgc3dpdGNoICh0aGlzLnlBeGlzRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQoaXRlbSk7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQocGFyc2VEYXRlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9O1xufVxuIl19
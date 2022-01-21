import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { scaleOrdinal as d3_scaleOrdinal, scaleBand as d3_scaleBand, scaleLinear as d3_scaleLinear } from 'd3-scale';
import { max as d3_max } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { isoParse as d3_isoParse } from 'd3-time-format';
import * as i0 from "@angular/core";
import * as i1 from "./dataviz.service";
import * as i2 from "@angular/common";
export class PbdsDatavizBarGroupedComponent {
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
        this.barMouseOver = (event, data) => {
            const node = d3_select(event.currentTarget);
            this.chart.selectAll('.bar-group').selectAll('.bar').classed('inactive', true);
            node.classed('inactive', false).style('fill', node.attr('data-color'));
            this.tooltipShow(event, data);
            this.hovered.emit({ event, data });
        };
        this.barMouseOut = () => {
            this.chart.selectAll('.bar').classed('inactive', false).style('fill', null);
            this.tooltipHide();
        };
        this.barMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.legendMouseOver = (event, data) => {
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => d.label !== data.label)
                .classed('inactive', true);
            this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((d, i) => d.label !== data.label)
                .classed('inactive', true);
            const bar = this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((d, i) => d.label === data.label)
                .classed('inactive', null);
            const barColor = bar.attr('data-color');
            bar.style('fill', () => barColor);
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.bar-group').selectAll('.bar').classed('inactive', false).style('fill', null);
        };
        this.legendMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.tooltipShow = (event, data) => {
            const dimensions = event.currentTarget.getBoundingClientRect();
            const scroll = this._scroll.getScrollPosition();
            let label;
            switch (this.tooltipLabelFormatType) {
                case 'number':
                    label = this.tooltipLabelFormat(data.label);
                    break;
                case 'time':
                    const parsedTime = d3_isoParse(data.label);
                    label = this.tooltipLabelFormat(parsedTime);
                    break;
                default:
                    label = data.label;
            }
            const value = this.tooltipValueFormat === null
                ? `<div class="tooltip-value">${data.value}</div>`
                : `<div class="tooltip-value">${this.tooltipValueFormat(data.value)}</div>`;
            this.tooltip.html(`
        ${label}
        ${value}
      `);
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
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
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
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
            .attr('width', () => {
            if (this.vertical) {
                return +this.width;
            }
            else {
                return +this.width + this.margin.left + this.margin.right;
            }
        })
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', () => {
            if (this.vertical) {
                return `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height + this.margin.top + this.margin.bottom}`;
            }
            else {
                return `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom}`;
            }
        });
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', () => {
                return this.vertical ? 'pbds-tooltip south' : 'pbds-tooltip west';
            })
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
            this.yAxisMax = d3_max(this.data, (data) => {
                const clone = { ...data };
                delete clone.key;
                return d3_max(Object.values(clone));
            });
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale = d3_scaleLinear().domain([0, this.yAxisMax]).nice().rangeRound([this.height, 0]);
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
            this.xAxisMax = d3_max(this.data, (data) => {
                const clone = { ...data };
                delete clone.key;
                return d3_max(Object.values(clone));
            });
            this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
            this.xAxisScale = d3_scaleLinear().domain([0, this.xAxisMax]).rangeRound([0, this.width]).nice();
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
                .domain(this.data.map((d) => d.key))
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
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
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
    updateChartVertical() {
        // update the xScale
        this.xAxisScale.domain(this.data.map((d) => d.key));
        // update the yScale
        this.yAxisMax = d3_max(this.data, (data) => {
            const clone = { ...data };
            delete clone.key;
            return d3_max(Object.values(clone));
        });
        this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
        this.yAxisScale.domain([0, this.yAxisMax]).rangeRound([this.height, 0]).nice();
        this.xAxis.transition().duration(1000).call(this.xAxisCall);
        this.yAxis.transition().duration(1000).call(this.yAxisCall);
        // update the grids
        // if (!this.hideXGrid) {
        //   this.xGrid
        //     .transition()
        //     .duration(1000)
        //     .call(this.xGridCall);
        // }
        if (this.showGrid) {
            this.yGrid.transition().duration(1000).call(this.yGridCall);
        }
        // update the color bar scale
        this.barScale.domain(Object.keys(this.data[0]).slice(1)).rangeRound([0, this.xAxisScale.bandwidth()]);
        this.svg
            .selectAll('.gray-bar')
            .data(this.data)
            .join((enter) => enter
            .append('rect')
            .attr('class', 'gray-bar')
            .attr('x', (d) => this.xAxisScale(d.key))
            .attr('y', (d) => this.yAxisScale(d.value))
            .attr('width', this.xAxisScale.bandwidth())
            .attr('height', this.height), (update) => update
            .transition()
            .duration(1000)
            .attr('x', (d) => this.xAxisScale(d.key))
            .attr('y', (d) => this.yAxisScale(d.value))
            .attr('width', this.xAxisScale.bandwidth())
            .attr('height', this.height)
            .selection());
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((enter) => enter
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (d, i) => {
            return `translate(${this.xAxisScale(d.key)}, 0)`;
        }), (update) => update
            .transition()
            .duration(1000)
            .attr('transform', (d, i) => {
            return `translate(${this.xAxisScale(d.key)}, 0)`;
        })
            .selection());
        this.svg
            .selectAll('.bar-group')
            // .selectAll('.bar')
            .selectChildren()
            .data((d, i) => {
            const clone = { ...d };
            delete clone.key;
            const keys = Object.keys(clone);
            const keyData = keys.map(function (key) {
                return { label: key, value: d[key], parentIndex: i };
            });
            return keyData;
        })
            .join((enter) => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', (d) => `url(${this._location.path()}#gradient-${this.colorRange(d.label).substr(1)})`)
            .attr('data-color', (d) => this.colorRange(d.label))
            .attr('data-parent-index', (d) => d.parentIndex)
            .attr('x', (d) => this.barScale(d.label))
            .attr('width', this.barScale.bandwidth())
            .attr('y', this.height)
            .attr('height', 0)
            .call((enter) => {
            return enter
                .attr('pointer-events', 'none')
                .transition()
                .duration(0) // 500
                .attr('height', (d) => this.height - this.yAxisScale(d.value))
                .attr('y', (d) => this.yAxisScale(d.value))
                .transition()
                .attr('pointer-events', 'auto');
        }), (update) => update
            .attr('pointer-events', 'none')
            .transition()
            .duration(1000)
            .attr('x', (d) => this.barScale(d.label))
            .attr('width', this.barScale.bandwidth())
            .attr('height', (d) => this.height - this.yAxisScale(d.value))
            .attr('y', (d) => this.yAxisScale(d.value))
            .transition()
            .selection()
            .attr('pointer-events', 'auto'), (exit) => exit
            .transition()
            .duration(0) // 100
            .selection()
            .attr('pointer-events', 'none')
            .attr('height', 0)
            .attr('y', this.height))
            .on('mouseover', (event, data) => this.barMouseOver(event, data))
            .on('mouseout', (event, data) => this.barMouseOut())
            .on('click', (event, data) => this.barMouseClick(event, data));
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    }
    updateChartHorizontal() {
        // update the xScale
        this.xAxisMax = d3_max(this.data, (data) => {
            const clone = { ...data };
            delete clone.key;
            return d3_max(Object.values(clone));
        });
        this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
        this.xAxisScale.domain([0, this.xAxisMax]).rangeRound([0, this.width]).nice();
        // update the yScale
        this.yAxisScale.domain(this.data.map((d) => d.key));
        this.xAxis.transition().duration(1000).call(this.xAxisCall);
        this.yAxis.transition().duration(1000).call(this.yAxisCall);
        // update the grids
        if (this.showGrid) {
            this.xGrid.transition().duration(1000).call(this.xGridCall);
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
            .join((enter) => enter
            .append('rect')
            .attr('class', 'gray-bar')
            .attr('y', (d) => this.yAxisScale(d.key))
            .attr('width', this.width)
            .attr('height', this.yAxisScale.bandwidth()), (update) => update
            .transition()
            .duration(1000)
            .attr('y', (d) => this.yAxisScale(d.key))
            .attr('width', this.width)
            .attr('height', this.yAxisScale.bandwidth())
            .selection());
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((enter) => enter
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (d, i) => {
            return `translate(0, ${this.yAxisScale(d.key)})`;
        }), (update) => update
            .transition()
            .duration(1000)
            .attr('transform', (d, i) => {
            return `translate(0, ${this.yAxisScale(d.key)})`;
        })
            .selection());
        this.svg
            .selectAll('.bar-group')
            .selectAll('.bar')
            .data((d, i) => {
            const clone = { ...d };
            delete clone.key;
            const keys = Object.keys(clone);
            const keyData = keys.map(function (key) {
                return { label: key, value: d[key], parentIndex: i };
            });
            return keyData;
        })
            .join((enter) => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', (d) => `url(${this._location.path()}#gradient-horizontal-${this.colorRange(d.label).substr(1)})`)
            .attr('data-color', (d) => this.colorRange(d.label))
            .attr('data-parent-index', (d) => d.parentIndex)
            .attr('x', 0)
            .attr('width', 0)
            .attr('y', (d) => this.barScale(d.label))
            .attr('height', this.barScale.bandwidth())
            .call((enter) => {
            return enter
                .attr('pointer-events', 'none')
                .transition()
                .duration(0) // 500
                .attr('width', (d) => this.xAxisScale(d.value))
                .transition()
                .attr('pointer-events', 'auto');
        }), (update) => update
            .attr('pointer-events', 'none')
            .transition()
            .duration(1000)
            .attr('width', (d) => this.xAxisScale(d.value))
            .attr('height', this.barScale.bandwidth())
            .attr('y', (d) => this.barScale(d.label))
            .transition()
            .selection()
            .attr('pointer-events', 'auto'), (exit) => exit
            .transition()
            .duration(0) // 100
            .selection()
            .attr('pointer-events', 'none')
            .attr('width', 0))
            .on('mouseover', (event, data) => this.barMouseOver(event, data))
            .on('mouseout', (event, data) => this.barMouseOut())
            .on('click', (event, data) => this.barMouseClick(event, data));
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    }
    updateLegend() {
        // legend
        if (!this.hideLegend) {
            const legendData = { ...this.data[0] };
            delete legendData.key;
            const legendKeys = Object.keys(legendData).map(function (key) {
                return { label: key };
            });
            this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(legendKeys)
                .join((enter) => {
                const li = enter.append('li').attr('class', 'legend-item');
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (d) => this.colorRange(d.label));
                li.insert('span', '.legend-item')
                    .attr('class', 'legend-label')
                    .html((d) => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            const parsedTime = d3_isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                return li;
            }, (update) => {
                update.select('.legend-label').html((d) => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            const parsedTime = d3_isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                return update;
            }, (exit) => exit.remove())
                .on('mouseover', (event, data) => this.legendMouseOver(event, data))
                .on('mouseout', () => this.legendMouseOut())
                .on('click', (event, data) => this.legendMouseClick(event, data));
        }
    }
}
PbdsDatavizBarGroupedComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.2", ngImport: i0, type: PbdsDatavizBarGroupedComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBarGroupedComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.2", type: PbdsDatavizBarGroupedComponent, selector: "pbds-dataviz-bar-grouped", inputs: { data: "data", width: "width", height: "height", vertical: "vertical", hideXAxis: "hideXAxis", xAxisMaxBuffer: "xAxisMaxBuffer", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", xAxisTicks: "xAxisTicks", hideYAxis: "hideYAxis", yAxisMaxBuffer: "yAxisMaxBuffer", yAxisFormatType: "yAxisFormatType", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", hideTooltip: "hideTooltip", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", showGrid: "showGrid", theme: "theme" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-bar-grouped": "this.groupedBarClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.2", ngImport: i0, type: PbdsDatavizBarGroupedComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pbds-dataviz-bar-grouped',
                    template: ``,
                    styles: [],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i1.PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }, { type: i2.Location }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], groupedBarClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-bar-grouped']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], vertical: [{
                type: Input
            }], hideXAxis: [{
                type: Input
            }], xAxisMaxBuffer: [{
                type: Input
            }], xAxisFormatType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], xAxisTicks: [{
                type: Input
            }], hideYAxis: [{
                type: Input
            }], yAxisMaxBuffer: [{
                type: Input
            }], yAxisFormatType: [{
                type: Input
            }], yAxisFormatString: [{
                type: Input
            }], yAxisTicks: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
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
            }], hideTooltip: [{
                type: Input
            }], tooltipLabelFormatType: [{
                type: Input
            }], tooltipLabelFormatString: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], showGrid: [{
                type: Input
            }], theme: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItZ3JvdXBlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1iYXItZ3JvdXBlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFFWixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxZQUFZLElBQUksZUFBZSxFQUFFLFNBQVMsSUFBSSxZQUFZLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNySCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsVUFBVSxJQUFJLGFBQWEsRUFBRSxRQUFRLElBQUksV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxRQUFRLElBQUksV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFXekQsTUFBTSxPQUFPLDhCQUE4QjtJQTBJekMsWUFDVSxRQUE0QixFQUM1QixRQUFvQixFQUNwQixPQUF5QixFQUN6QixTQUFtQjtRQUhuQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQ3pCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUE1STdCLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFNdkIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFdBQU0sR0FBRyxHQUFHLENBQUM7UUFHYixhQUFRLEdB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VztzQkFEVixLQUFLO2dCQUlOLGNBQWM7c0JBRGIsS0FBSztnQkFJTixxQkFBcUI7c0JBRHBCLEtBQUs7Z0JBSU4sdUJBQXVCO3NCQUR0QixLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixzQkFBc0I7c0JBRHJCLEtBQUs7Z0JBSU4sd0JBQXdCO3NCQUR2QixLQUFLO2dCQUlOLHNCQUFzQjtzQkFEckIsS0FBSztnQkFJTix3QkFBd0I7c0JBRHZCLEtBQUs7Z0JBSU4sUUFBUTtzQkFEUCxLQUFLO2dCQUlOLEtBQUs7c0JBREosS0FBSztnQkFJTixPQUFPO3NCQUROLE1BQU07Z0JBSVAsT0FBTztzQkFETixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciwgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IHNjYWxlT3JkaW5hbCBhcyBkM19zY2FsZU9yZGluYWwsIHNjYWxlQmFuZCBhcyBkM19zY2FsZUJhbmQsIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgbWF4IGFzIGQzX21heCB9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7IGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSwgYXhpc0xlZnQgYXMgZDNfYXhpc0xlZnQgfSBmcm9tICdkMy1heGlzJztcbmltcG9ydCB7IGlzb1BhcnNlIGFzIGQzX2lzb1BhcnNlIH0gZnJvbSAnZDMtdGltZS1mb3JtYXQnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhckdyb3VwZWQgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1iYXItZ3JvdXBlZCcsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1iYXItZ3JvdXBlZCcpXG4gIGdyb3VwZWRCYXJDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogQXJyYXk8UGJkc0RhdGF2aXpCYXJHcm91cGVkPjtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwNjtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDA7XG5cbiAgQElucHV0KClcbiAgdmVydGljYWwgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVYQXhpcyA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzTWF4QnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGlja3MgPSA1O1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVZQXhpcyA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWF4QnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzVGlja3MgPSA1O1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDEwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gdGhpcy52ZXJ0aWNhbCA/IDAgOiA1NTtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAzMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gNTU7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMTA1ICsgMjg7IC8vIGhhcmRjb2RlZCBsZWdlbmQgd2lkdGggKyBsZWZ0IG1hcmdpbiwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbGVnZW5kUG9zaXRpb246ICdyaWdodCcgfCAnYm90dG9tJyA9ICdyaWdodCc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBoaWRlVG9vbHRpcCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgc2hvd0dyaWQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0aGVtZTogJ2NsYXNzaWMnIHwgJ3N1bnNldCcgfCAnb2NlYW4nIHwgJ3R3aWxpZ2h0JyA9ICdjbGFzc2ljJztcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGJhclNjYWxlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSB4QXhpc01heDtcbiAgcHJpdmF0ZSB4QXhpc1NjYWxlO1xuICBwcml2YXRlIHhBeGlzQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpcztcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgaGlkZVhBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgeEdyaWQ7XG4gIHByaXZhdGUgeEdyaWRDYWxsO1xuICBwcml2YXRlIHlBeGlzTWF4O1xuICBwcml2YXRlIHlBeGlzU2NhbGU7XG4gIHByaXZhdGUgeUF4aXNDYWxsO1xuICBwcml2YXRlIHlBeGlzO1xuICBwcml2YXRlIHlBeGlzRm9ybWF0O1xuICBwcml2YXRlIHlBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSB5R3JpZDtcbiAgcHJpdmF0ZSB5R3JpZENhbGw7XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgaGlkZUdyYXlCYXJzOiBib29sZWFuO1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBMYWJlbEZvcm1hdDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIsXG4gICAgcHJpdmF0ZSBfbG9jYXRpb246IExvY2F0aW9uXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFR5cGUsIHRoaXMueEF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMueUF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueUF4aXNGb3JtYXRUeXBlLCB0aGlzLnlBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSwgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGRlZmF1bHRzIGZvciBhbGwgY2hhcnQgdHlwZXNcbiAgICB0aGlzLmhpZGVHcmF5QmFycyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnhBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgdGhpcy5oaWRlWUF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICB0aGlzLnlBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyID0gMDtcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgICByZXR1cm4gK3RoaXMud2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cigndmlld0JveCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgICByZXR1cm4gYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aH0gJHtcbiAgICAgICAgICAgICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbVxuICAgICAgICAgIH1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0fSAke1xuICAgICAgICAgICAgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tXG4gICAgICAgICAgfWA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnZlcnRpY2FsID8gJ3BiZHMtdG9vbHRpcCBzb3V0aCcgOiAncGJkcy10b29sdGlwIHdlc3QnO1xuICAgICAgICB9KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcbiAgICB9XG5cbiAgICAvLyBhZGQgbGVnZW5kIGNsYXNzZXNcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcbiAgICB9XG5cbiAgICAvLyBidWlsZCBjb2xvciByYW5nZXNcbiAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKS5yYW5nZShcbiAgICAgIHRoaXMuX2RhdGF2aXouY3JlYXRlR3JhZGllbnREZWZzKHRoaXMuc3ZnLCBmYWxzZSwgdGhpcy50aGVtZSwgdGhpcy52ZXJ0aWNhbClcbiAgICApO1xuXG4gICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgIC8vIFggQVhJU1xuICAgICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgICAgLmRvbWFpbih0aGlzLmRhdGEubWFwKChkKSA9PiBkLmtleSkpXG4gICAgICAgIC5yYW5nZVJvdW5kKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdF0pXG4gICAgICAgIC5hbGlnbigwKTtcblxuICAgICAgLy8gYWRkIHBhZGRpbmcgdG8gdGhlIHNjYWxlIGZvciBncmF5IGJhcnNcbiAgICAgICF0aGlzLmhpZGVHcmF5QmFyc1xuICAgICAgICA/IHRoaXMueEF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMC4xKS5wYWRkaW5nT3V0ZXIoMClcbiAgICAgICAgOiB0aGlzLnhBeGlzU2NhbGUucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKTtcblxuICAgICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy54QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1RpY2tzKVxuICAgICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAgIC8vIFggR1JJRExJTkVTXG4gICAgICAvLyBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICAvLyAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpLnRpY2tTaXplKC10aGlzLmhlaWdodCk7XG5cbiAgICAgIC8vICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAvLyAgICAgLmFwcGVuZCgnZycpXG4gICAgICAvLyAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcbiAgICAgIC8vICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgIC8vICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgLy8gICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gWSBBWElTXG4gICAgICB0aGlzLnlBeGlzTWF4ID0gZDNfbWF4KHRoaXMuZGF0YSwgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBjbG9uZSA9IHsgLi4uZGF0YSB9O1xuICAgICAgICBkZWxldGUgY2xvbmUua2V5O1xuXG4gICAgICAgIHJldHVybiBkM19tYXgoT2JqZWN0LnZhbHVlcyhjbG9uZSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMueUF4aXNNYXggPSB0aGlzLnlBeGlzTWF4ICsgdGhpcy55QXhpc01heCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG5cbiAgICAgIHRoaXMueUF4aXNTY2FsZSA9IGQzX3NjYWxlTGluZWFyKCkuZG9tYWluKFswLCB0aGlzLnlBeGlzTWF4XSkubmljZSgpLnJhbmdlUm91bmQoW3RoaXMuaGVpZ2h0LCAwXSk7XG5cbiAgICAgIHRoaXMueUF4aXNDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUodGhpcy55QXhpc1RpY2tTaXplKVxuICAgICAgICAudGlja1NpemVPdXRlcih0aGlzLnlBeGlzVGlja1NpemVPdXRlcilcbiAgICAgICAgLnRpY2tGb3JtYXQodGhpcy55QXhpc0Zvcm1hdHRlcik7XG5cbiAgICAgIHRoaXMueUF4aXMgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy15JylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXMpXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNEb21haW4pXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzVGlja3MpXG4gICAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgICAgLy8gWSBHUklETElORVNcbiAgICAgIGlmICh0aGlzLnNob3dHcmlkKSB7XG4gICAgICAgIHRoaXMueUdyaWRDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAgICAgLnRpY2tTaXplKC10aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KTtcblxuICAgICAgICB0aGlzLnlHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXknKVxuICAgICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsIDApYClcbiAgICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbG9yIGJhciBzY2FsZVxuICAgICAgdGhpcy5iYXJTY2FsZSA9IGQzX3NjYWxlQmFuZCgpXG4gICAgICAgIC5kb21haW4oT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5zbGljZSgxKSlcbiAgICAgICAgLnJhbmdlUm91bmQoWzAsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKV0pXG4gICAgICAgIC5wYWRkaW5nSW5uZXIoMC4yKVxuICAgICAgICAucGFkZGluZ091dGVyKDAuNSk7XG5cbiAgICAgIHRoaXMudXBkYXRlQ2hhcnRWZXJ0aWNhbCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBYIEFYSVNcbiAgICAgIHRoaXMueEF4aXNNYXggPSBkM19tYXgodGhpcy5kYXRhLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGNsb25lID0geyAuLi5kYXRhIH07XG4gICAgICAgIGRlbGV0ZSBjbG9uZS5rZXk7XG4gICAgICAgIHJldHVybiBkM19tYXgoT2JqZWN0LnZhbHVlcyhjbG9uZSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMueEF4aXNNYXggPSB0aGlzLnhBeGlzTWF4ICsgdGhpcy54QXhpc01heCAqIHRoaXMueEF4aXNNYXhCdWZmZXI7XG5cbiAgICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlTGluZWFyKCkuZG9tYWluKFswLCB0aGlzLnhBeGlzTWF4XSkucmFuZ2VSb3VuZChbMCwgdGhpcy53aWR0aF0pLm5pY2UoKTtcblxuICAgICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgICAgLnRpY2tzKHRoaXMueEF4aXNUaWNrcylcbiAgICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy54QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1RpY2tzKVxuICAgICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAgIC8vIFkgQVhJU1xuICAgICAgdGhpcy55QXhpc1NjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgICAgLmRvbWFpbih0aGlzLmRhdGEubWFwKChkKSA9PiBkLmtleSkpXG4gICAgICAgIC5yYW5nZVJvdW5kKFswLCB0aGlzLmhlaWdodF0pXG4gICAgICAgIC5hbGlnbigxKTtcblxuICAgICAgLy8gYWRkIHBhZGRpbmcgdG8gdGhlIHNjYWxlIGZvciBncmF5IGJhcnNcbiAgICAgICF0aGlzLmhpZGVHcmF5QmFyc1xuICAgICAgICA/IHRoaXMueUF4aXNTY2FsZS5wYWRkaW5nSW5uZXIoMC4xKS5wYWRkaW5nT3V0ZXIoMClcbiAgICAgICAgOiB0aGlzLnlBeGlzU2NhbGUucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKTtcblxuICAgICAgdGhpcy55QXhpc0NhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrU2l6ZSh0aGlzLnlBeGlzVGlja1NpemUpXG4gICAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgICAudGlja0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0dGVyKTtcblxuICAgICAgdGhpcy55QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXknKVxuICAgICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpcylcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc0RvbWFpbilcbiAgICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXNUaWNrcylcbiAgICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgICAvLyBYIEdSSURMSU5FU1xuICAgICAgaWYgKHRoaXMuc2hvd0dyaWQpIHtcbiAgICAgICAgdGhpcy54R3JpZENhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSkudGlja1NpemUoLXRoaXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcbiAgICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICAgIH1cblxuICAgICAgLy8gWSBHUklETElORVNcbiAgICAgIC8vIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcbiAgICAgIC8vICAgdGhpcy55R3JpZENhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAvLyAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgIC8vICAgICAudGlja1NpemUoLXRoaXMud2lkdGgpO1xuXG4gICAgICAvLyAgIHRoaXMueUdyaWQgPSB0aGlzLnN2Z1xuICAgICAgLy8gICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLy8gICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteScpXG4gICAgICAvLyAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAvLyAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgMClgKVxuICAgICAgLy8gICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gY29sb3IgYmFyIHNjYWxlXG4gICAgICB0aGlzLmJhclNjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgICAgLmRvbWFpbihPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLnNsaWNlKDEpKVxuICAgICAgICAucmFuZ2VSb3VuZChbdGhpcy55QXhpc1NjYWxlLmJhbmR3aWR0aCgpLCAwXSlcbiAgICAgICAgLnBhZGRpbmdJbm5lcigwLjIpXG4gICAgICAgIC5wYWRkaW5nT3V0ZXIoMC41KTtcblxuICAgICAgdGhpcy51cGRhdGVDaGFydEhvcml6b250YWwoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICBpZiAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNoYXJ0VmVydGljYWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ2hhcnRIb3Jpem9udGFsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2hhcnRWZXJ0aWNhbCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIHhTY2FsZVxuICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4odGhpcy5kYXRhLm1hcCgoZCkgPT4gZC5rZXkpKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgeVNjYWxlXG4gICAgdGhpcy55QXhpc01heCA9IGQzX21heCh0aGlzLmRhdGEsIChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGNsb25lID0geyAuLi5kYXRhIH07XG4gICAgICBkZWxldGUgY2xvbmUua2V5O1xuXG4gICAgICByZXR1cm4gZDNfbWF4KE9iamVjdC52YWx1ZXMoY2xvbmUpKTtcbiAgICB9KTtcblxuICAgIHRoaXMueUF4aXNNYXggPSB0aGlzLnlBeGlzTWF4ICsgdGhpcy55QXhpc01heCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG5cbiAgICB0aGlzLnlBeGlzU2NhbGUuZG9tYWluKFswLCB0aGlzLnlBeGlzTWF4XSkucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKS5uaWNlKCk7XG5cbiAgICB0aGlzLnhBeGlzLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIHRoaXMueUF4aXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSBncmlkc1xuICAgIC8vIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAvLyAgIHRoaXMueEdyaWRcbiAgICAvLyAgICAgLnRyYW5zaXRpb24oKVxuICAgIC8vICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAvLyAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIC8vIH1cblxuICAgIGlmICh0aGlzLnNob3dHcmlkKSB7XG4gICAgICB0aGlzLnlHcmlkLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdGhlIGNvbG9yIGJhciBzY2FsZVxuICAgIHRoaXMuYmFyU2NhbGUuZG9tYWluKE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuc2xpY2UoMSkpLnJhbmdlUm91bmQoWzAsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKV0pO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5ncmF5LWJhcicpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmF5LWJhcicpXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB0aGlzLnhBeGlzU2NhbGUoZC5rZXkpKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGQudmFsdWUpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KSxcbiAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcbiAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpID0+IHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIC5zZWxlY3Rpb24oKVxuICAgICAgKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jhci1ncm91cCcpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt0aGlzLnhBeGlzU2NhbGUoZC5rZXkpfSwgMClgO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3RoaXMueEF4aXNTY2FsZShkLmtleSl9LCAwKWA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnNlbGVjdGlvbigpXG4gICAgICApO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLy8gLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuc2VsZWN0Q2hpbGRyZW4oKVxuICAgICAgLmRhdGEoKGQsIGkpID0+IHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB7IC4uLmQgfTtcbiAgICAgICAgZGVsZXRlIGNsb25lLmtleTtcblxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoY2xvbmUpO1xuXG4gICAgICAgIGNvbnN0IGtleURhdGEgPSBrZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHsgbGFiZWw6IGtleSwgdmFsdWU6IGRba2V5XSwgcGFyZW50SW5kZXg6IGkgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGtleURhdGE7XG4gICAgICB9KVxuICAgICAgLmpvaW4oXG4gICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgKGQpID0+IGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wYXRoKCl9I2dyYWRpZW50LSR7dGhpcy5jb2xvclJhbmdlKGQubGFiZWwpLnN1YnN0cigxKX0pYClcbiAgICAgICAgICAgIC5hdHRyKCdkYXRhLWNvbG9yJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC5hdHRyKCdkYXRhLXBhcmVudC1pbmRleCcsIChkKSA9PiBkLnBhcmVudEluZGV4KVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy5iYXJTY2FsZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMuYmFyU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAuYXR0cigneScsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAuY2FsbCgoZW50ZXIpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVudGVyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oMCkgLy8gNTAwXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSA9PiB0aGlzLmhlaWdodCAtIHRoaXMueUF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyk7XG4gICAgICAgICAgICB9KSxcblxuICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB0aGlzLmJhclNjYWxlKGQubGFiZWwpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5iYXJTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgPT4gdGhpcy5oZWlnaHQgLSB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuc2VsZWN0aW9uKClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgIChleGl0KSA9PlxuICAgICAgICAgIGV4aXRcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigwKSAvLyAxMDBcbiAgICAgICAgICAgIC5zZWxlY3Rpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAuYXR0cigneScsIHRoaXMuaGVpZ2h0KVxuICAgICAgKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGE6IFBiZHNEYXRhdml6QmFyR3JvdXBlZFtdKSA9PiB0aGlzLmJhck1vdXNlT3ZlcihldmVudCwgZGF0YSkpXG4gICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJhck1vdXNlT3V0KCkpXG4gICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJhck1vdXNlQ2xpY2soZXZlbnQsIGRhdGEpKTtcblxuICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XG5cbiAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5heGlzJykucmFpc2UoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0SG9yaXpvbnRhbCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIHhTY2FsZVxuICAgIHRoaXMueEF4aXNNYXggPSBkM19tYXgodGhpcy5kYXRhLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICBjb25zdCBjbG9uZSA9IHsgLi4uZGF0YSB9O1xuICAgICAgZGVsZXRlIGNsb25lLmtleTtcbiAgICAgIHJldHVybiBkM19tYXgoT2JqZWN0LnZhbHVlcyhjbG9uZSkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy54QXhpc01heCA9IHRoaXMueEF4aXNNYXggKyB0aGlzLnhBeGlzTWF4ICogdGhpcy54QXhpc01heEJ1ZmZlcjtcblxuICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4oWzAsIHRoaXMueEF4aXNNYXhdKS5yYW5nZVJvdW5kKFswLCB0aGlzLndpZHRoXSkubmljZSgpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSB5U2NhbGVcbiAgICB0aGlzLnlBeGlzU2NhbGUuZG9tYWluKHRoaXMuZGF0YS5tYXAoKGQpID0+IGQua2V5KSk7XG5cbiAgICB0aGlzLnhBeGlzLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIHRoaXMueUF4aXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSBncmlkc1xuICAgIGlmICh0aGlzLnNob3dHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XG4gICAgLy8gICB0aGlzLnlHcmlkXG4gICAgLy8gICAgIC50cmFuc2l0aW9uKClcbiAgICAvLyAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgLy8gICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICAvLyB9XG5cbiAgICAvLyB1cGRhdGUgdGhlIGNvbG9yIGJhciBzY2FsZVxuICAgIHRoaXMuYmFyU2NhbGUuZG9tYWluKE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuc2xpY2UoMSkpLnJhbmdlUm91bmQoWzAsIHRoaXMueUF4aXNTY2FsZS5iYW5kd2lkdGgoKV0pO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5ncmF5LWJhcicpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmF5LWJhcicpXG4gICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZC5rZXkpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLnlBeGlzU2NhbGUuYmFuZHdpZHRoKCkpLFxuICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZC5rZXkpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLnlBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAuc2VsZWN0aW9uKClcbiAgICAgICk7XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgnLmJhci1ncm91cCcpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXItZ3JvdXAnKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKDAsICR7dGhpcy55QXhpc1NjYWxlKGQua2V5KX0pYDtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoMCwgJHt0aGlzLnlBeGlzU2NhbGUoZC5rZXkpfSlgO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zZWxlY3Rpb24oKVxuICAgICAgKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoKGQsIGkpID0+IHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB7IC4uLmQgfTtcbiAgICAgICAgZGVsZXRlIGNsb25lLmtleTtcblxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoY2xvbmUpO1xuXG4gICAgICAgIGNvbnN0IGtleURhdGEgPSBrZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHsgbGFiZWw6IGtleSwgdmFsdWU6IGRba2V5XSwgcGFyZW50SW5kZXg6IGkgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGtleURhdGE7XG4gICAgICB9KVxuICAgICAgLmpvaW4oXG4gICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgICAgIC5hdHRyKFxuICAgICAgICAgICAgICAnZmlsbCcsXG4gICAgICAgICAgICAgIChkKSA9PiBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucGF0aCgpfSNncmFkaWVudC1ob3Jpem9udGFsLSR7dGhpcy5jb2xvclJhbmdlKGQubGFiZWwpLnN1YnN0cigxKX0pYFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtY29sb3InLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtcGFyZW50LWluZGV4JywgKGQpID0+IGQucGFyZW50SW5kZXgpXG4gICAgICAgICAgICAuYXR0cigneCcsIDApXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy5iYXJTY2FsZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmJhclNjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmNhbGwoKGVudGVyKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBlbnRlclxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDApIC8vIDUwMFxuICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSA9PiB0aGlzLnhBeGlzU2NhbGUoZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpID0+IHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmJhclNjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy5iYXJTY2FsZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5zZWxlY3Rpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKSxcbiAgICAgICAgKGV4aXQpID0+XG4gICAgICAgICAgZXhpdFxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDApIC8vIDEwMFxuICAgICAgICAgICAgLnNlbGVjdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAwKVxuICAgICAgKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYmFyTW91c2VPdmVyKGV2ZW50LCBkYXRhKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYmFyTW91c2VPdXQoKSlcbiAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYmFyTW91c2VDbGljayhldmVudCwgZGF0YSkpO1xuXG4gICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcblxuICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmF4aXMnKS5yYWlzZSgpO1xuICB9XG5cbiAgdXBkYXRlTGVnZW5kKCkge1xuICAgIC8vIGxlZ2VuZFxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICBjb25zdCBsZWdlbmREYXRhID0geyAuLi50aGlzLmRhdGFbMF0gfTtcbiAgICAgIGRlbGV0ZSBsZWdlbmREYXRhLmtleTtcbiAgICAgIGNvbnN0IGxlZ2VuZEtleXMgPSBPYmplY3Qua2V5cyhsZWdlbmREYXRhKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4geyBsYWJlbDoga2V5IH07XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcbiAgICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgLmRhdGEobGVnZW5kS2V5cylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgKGVudGVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaSA9IGVudGVyLmFwcGVuZCgnbGknKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtaXRlbScpO1xuXG4gICAgICAgICAgICBsaS5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWtleScpXG4gICAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpO1xuXG4gICAgICAgICAgICBsaS5pbnNlcnQoJ3NwYW4nLCAnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgICAgICAgIC5odG1sKChkKSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbCgoZCkgPT4ge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3ZlcihldmVudCwgZGF0YSkpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3V0KCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubGVnZW5kTW91c2VDbGljayhldmVudCwgZGF0YSkpO1xuICAgIH1cbiAgfVxuXG4gIGJhck1vdXNlT3ZlciA9IChldmVudCwgZGF0YTogUGJkc0RhdGF2aXpCYXJHcm91cGVkW10pID0+IHtcbiAgICBjb25zdCBub2RlID0gZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKS5zZWxlY3RBbGwoJy5iYXInKS5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgbm9kZS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKS5zdHlsZSgnZmlsbCcsIG5vZGUuYXR0cignZGF0YS1jb2xvcicpKTtcblxuICAgIHRoaXMudG9vbHRpcFNob3coZXZlbnQsIGRhdGEpO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBiYXJNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmJhcicpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpLnN0eWxlKCdmaWxsJywgbnVsbCk7XG5cbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgYmFyTW91c2VDbGljayA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGQubGFiZWwgIT09IGRhdGEubGFiZWwpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBkLmxhYmVsICE9PSBkYXRhLmxhYmVsKVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBjb25zdCBiYXIgPSB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gZC5sYWJlbCA9PT0gZGF0YS5sYWJlbClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIG51bGwpO1xuXG4gICAgY29uc3QgYmFyQ29sb3IgPSBiYXIuYXR0cignZGF0YS1jb2xvcicpO1xuXG4gICAgYmFyLnN0eWxlKCdmaWxsJywgKCkgPT4gYmFyQ29sb3IpO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmJhci1ncm91cCcpLnNlbGVjdEFsbCgnLmJhcicpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpLnN0eWxlKCdmaWxsJywgbnVsbCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIGxldCBsYWJlbDtcblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBsYWJlbCA9IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGRhdGEubGFiZWwpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkYXRhLmxhYmVsKTtcbiAgICAgICAgbGFiZWwgPSB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxhYmVsID0gZGF0YS5sYWJlbDtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9XG4gICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICA/IGA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZVwiPiR7ZGF0YS52YWx1ZX08L2Rpdj5gXG4gICAgICAgIDogYDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlXCI+JHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX08L2Rpdj5gO1xuXG4gICAgdGhpcy50b29sdGlwLmh0bWwoXG4gICAgICBgXG4gICAgICAgICR7bGFiZWx9XG4gICAgICAgICR7dmFsdWV9XG4gICAgICBgXG4gICAgKTtcblxuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRXaWR0aCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldFdpZHRoIC8gMjtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHRvb2x0aXBUaXBTaXplID0gODtcblxuICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAkeytzY3JvbGxbMV0gKyArZGltZW5zaW9ucy50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC0gdG9vbHRpcFRpcFNpemV9cHhgKTtcbiAgICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAkeytzY3JvbGxbMF0gKyArZGltZW5zaW9ucy5sZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRoICsgK2RpbWVuc2lvbnMud2lkdGggLyAyfXB4YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7K3Njcm9sbFsxXSArICtkaW1lbnNpb25zLnRvcCArICtkaW1lbnNpb25zLmhlaWdodCAvIDIgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC8gMn1weGApO1xuICAgICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSArICtkaW1lbnNpb25zLnJpZ2h0ICsgdG9vbHRpcFRpcFNpemV9cHhgKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSAoaXRlbSkgPT4ge1xuICAgIHN3aXRjaCAodGhpcy54QXhpc0Zvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KGl0ZW0pO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XG4gICAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHlBeGlzRm9ybWF0dGVyID0gKGl0ZW0pID0+IHtcbiAgICBzd2l0Y2ggKHRoaXMueUF4aXNGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXR1cm4gdGhpcy55QXhpc0Zvcm1hdChpdGVtKTtcblxuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgICAgICByZXR1cm4gdGhpcy55QXhpc0Zvcm1hdChwYXJzZURhdGUpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH07XG59XG4iXX0=
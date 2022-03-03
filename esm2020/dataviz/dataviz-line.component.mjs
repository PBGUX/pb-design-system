import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select, pointer as d3_pointer } from 'd3-selection';
import { line as d3_line, area as d3_area, curveCatmullRom as d3_curveCatmullRom } from 'd3-shape';
import { scaleOrdinal as d3_scaleOrdinal, scaleLinear as d3_scaleLinear, scaleTime as d3_scaleTime, scalePoint as d3_scalePoint } from 'd3-scale';
import { min as d3_min, max as d3_max, extent as d3_extent, bisectLeft as d3_bisectLeft, range as d3_range, bisect as d3_bisect } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { format as d3_format } from 'd3-format';
import { isoParse as d3_isoParse, isoFormat as d3_isoFormat, timeFormat as d3_timeFormat } from 'd3-time-format';
import { easeQuadInOut as d3_easeQuadInOut } from 'd3-ease';
import * as i0 from "@angular/core";
import * as i1 from "./dataviz.service";
import * as i2 from "@angular/common";
// assign an ID for each component instance
let nextId = 0;
export class PbdsDatavizLineComponent {
    constructor(_dataviz, _element, _scroll, _location) {
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this._location = _location;
        this.chartClass = true;
        this.lineClass = true;
        this.width = 306;
        this.height = 400;
        this.type = 'medium'; // debug to show all chart options
        this.area = false;
        this.xAxisType = 'date';
        this.xAxisFormatString = '';
        this.xAxisTicks = 6;
        this.yAxisFormatString = '';
        this.yAxisTicks = 5;
        this.yAxisMinBuffer = 0.01;
        this.yAxisMaxBuffer = 0.01;
        this.hideXGrid = true;
        this.hideYGrid = true;
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'right';
        this.legendLabelFormatType = null;
        this.legendLabelFormatString = '';
        this.tooltipHeadingFormatString = '';
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.marginTop = 10; // hardcoded on purpose, do not document until feedback
        this.marginRight = 20; // hardcoded on purpose, do not document until feedback
        this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
        this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
        this.lineCurved = true;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.tooltipHovered = new EventEmitter();
        this.tooltipClicked = new EventEmitter();
        this.updateChart = () => {
            this.mouserect.data(this.data);
            // update the xScale
            if (this.xAxisType === 'date') {
                this.xAxisScale = d3_scaleTime()
                    .domain(d3_extent(this.data.labels, (d) => {
                    return d3_isoParse(d);
                }))
                    .range([0, this.width - this.margin.left - this.margin.right]);
            }
            else if (this.xAxisType === 'number') {
                this.xAxisScale = d3_scaleLinear()
                    .domain(d3_extent(this.data.labels, (d) => {
                    return d;
                }))
                    .range([0, this.width - this.margin.left - this.margin.right]);
            }
            else {
                this.xAxisScale = d3_scalePoint()
                    .domain(this.data.labels)
                    .range([0, this.width - this.margin.left - this.margin.right]);
            }
            // update the yScale
            this.yAxisScale
                .domain([
                d3_min(this.data.series, (d, i) => {
                    const minVal = +d3_min(d.values);
                    return minVal - minVal * +this.yAxisMinBuffer;
                }),
                d3_max(this.data.series, (d, i) => {
                    const maxVal = +d3_max(d.values);
                    return maxVal + maxVal * this.yAxisMaxBuffer;
                })
            ])
                .nice();
            this.xAxis.transition().duration(1000).call(this.xAxisCall);
            this.yAxis.transition().duration(1000).call(this.yAxisCall);
            // update the grids
            if (!this.hideXGrid) {
                this.xGrid.transition().duration(1000).call(this.xGridCall);
            }
            if (!this.hideYGrid) {
                this.yGrid.transition().duration(1000).call(this.yGridCall);
            }
            // lines
            this.svg
                .selectAll('path.line')
                .attr('filter', () => this.type !== 'high' ? `url(${this._location.prepareExternalUrl(this._location.path())}#glow)` : null)
                .data(this.data.series)
                .join((enter) => {
                enter
                    .append('path')
                    .attr('clip-path', `url(${this._location.prepareExternalUrl(this._location.path())}#clip-path-${this.clipPathId})`)
                    .attr('class', 'line')
                    .style('stroke', (d) => this.colorRange(d.label))
                    .style('stroke-width', this.lineWidth)
                    .attr('d', (data) => {
                    const array = new Array(data.values.length).fill(0);
                    return this.d3line(array);
                })
                    .call((enter) => enter
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('d', (data) => this.d3line(data.values)));
            }, (update) => update.call((update) => update
                .transition()
                .duration(1000)
                .ease(d3_easeQuadInOut)
                .attr('d', (d) => this.d3line(d.values))), (exit) => exit.remove());
            // area
            if (this.area) {
                this.svg
                    .selectAll('path.area')
                    .data(this.data.series)
                    .join((enter) => enter
                    .append('path')
                    .attr('clip-path', `url(${this._location.prepareExternalUrl(this._location.path())}#clip-path-${this.clipPathId})`)
                    .attr('class', 'area')
                    .attr('d', (data) => {
                    const array = new Array(data.values.length).fill(0);
                    return this.d3area(array);
                })
                    .style('color', (d) => this.colorRange(d.label))
                    .call((enter) => enter
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('d', (data) => this.d3area(data.values))), (update) => update.call((update) => {
                    return update
                        .transition()
                        .duration(1000)
                        .ease(d3_easeQuadInOut)
                        .attr('d', (d) => this.d3area(d.values));
                }), (exit) => exit.remove());
            }
            // circles
            if (this.linePoints) {
                // add points
                this.svg
                    .selectAll('g.points')
                    .data(this.data.series)
                    .join((enter) => enter
                    .append('g')
                    .attr('class', 'points')
                    .attr('clip-path', `url(${this._location.prepareExternalUrl(this._location.path())}#clip-path-points-${this.clipPathId})`)
                    .style('color', (d, i) => this.colorRange(d.label))
                    .selectAll('circle')
                    .data((d) => d.values)
                    .join((enter) => enter
                    .append('circle')
                    .attr('cx', (d, i) => {
                    if (this.xAxisType === 'date') {
                        return this.xAxisScale(d3_isoParse(this.data.labels[i]));
                    }
                    else {
                        return this.xAxisScale(this.data.labels[i]);
                    }
                })
                    .attr('cy', (d) => this.yAxisScale(0))
                    .attr('r', this.lineWidth * 2)
                    .style('stroke-width', this.lineWidth)
                    .call((enter) => enter
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('cy', (d) => this.yAxisScale(d))), () => { }, (exit) => exit.remove()), (update) => update
                    .selectAll('circle')
                    .data((d) => d.values)
                    .join((enter) => enter
                    .append('circle')
                    .attr('cx', (d, i) => {
                    if (this.xAxisType === 'date') {
                        return this.xAxisScale(d3_isoParse(this.data.labels[i]));
                    }
                    else {
                        return this.xAxisScale(this.data.labels[i]);
                    }
                })
                    .attr('cy', (d) => this.yAxisScale(d))
                    .attr('r', this.lineWidth * 2)
                    .style('stroke-width', this.lineWidth), (update) => update.call((update) => update
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('cx', (d, i) => {
                    if (this.xAxisType === 'date') {
                        return this.xAxisScale(d3_isoParse(this.data.labels[i]));
                    }
                    else {
                        return this.xAxisScale(this.data.labels[i]);
                    }
                })
                    .attr('cy', (d) => this.yAxisScale(d))), (exit) => exit.remove()), (exit) => exit.remove());
            }
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.data.series)
                    .join((enter) => {
                    const li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (d) => this.colorRange(d.label));
                    li.append('span')
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
            if (!this.hideTooltip) {
                this.tooltip
                    .select('.tooltip-table')
                    .selectAll('tr')
                    .data(this.data.series)
                    .join((enter) => {
                    const tooltipItem = enter.append('tr').attr('class', 'tooltip-item');
                    tooltipItem
                        .append('td')
                        .style('color', (d) => this.colorRange(d.label))
                        .append('span')
                        .attr('class', 'pbds-tooltip-key');
                    tooltipItem
                        .append('td')
                        .attr('class', 'tooltip-label pr-2 text-nowrap')
                        .html((d) => {
                        return this.tooltipLabelFormatType ? this.tooltipLabelFormat(d.label) : d.label;
                    });
                    tooltipItem
                        .append('td')
                        .attr('class', 'tooltip-value text-right text-nowrap')
                        .html((d) => '');
                    return tooltipItem;
                }, (update) => {
                    // update the tooltip label text
                    const tooltipLabel = update.select('.tooltip-label');
                    tooltipLabel.html((d) => {
                        return this.tooltipLabelFormatType ? this.tooltipLabelFormat(d.label) : d.label;
                    });
                }, (exit) => exit.remove());
            }
            this.svg.selectAll('.points').raise();
            this.mouserect.raise();
        };
        this.legendMouseOver = (event, data) => {
            // console.log(data, this.linePoints);
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => {
                return d.label !== data.label;
            })
                .classed('inactive', true);
            this.svg
                .selectAll('.line')
                .filter((d, i) => {
                return d.label !== data.label;
            })
                .classed('inactive', true);
            if (this.area) {
                this.svg
                    .selectAll('.area')
                    .filter((d, i) => {
                    return d.label !== data.label;
                })
                    .classed('inactive', true);
            }
            if (this.linePoints) {
                this.svg
                    .selectAll('.points')
                    .filter((d, i) => {
                    return d.label !== data.label;
                })
                    .selectAll('circle')
                    .classed('inactive', true);
            }
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.line').classed('inactive', false).classed('active', false);
            if (this.linePoints) {
                this.svg.selectAll('circle').classed('active', false).classed('inactive', false);
            }
            if (this.area) {
                this.svg.selectAll('.area').classed('inactive', false);
            }
        };
        this.legendMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.mouserectMouseMove = (event, data) => {
            let mouseX; // mouse x position
            let lower;
            let upper;
            let closest;
            let closestIndex;
            let leftIndex = 0;
            // handle string type, no invert function on scalePoint
            if (this.xAxisType === 'string') {
                mouseX = d3_pointer(event)[0];
            }
            else {
                mouseX = this.xAxisScale.invert(d3_pointer(event)[0]);
            }
            // console.log(mouseX);
            if (this.xAxisType === 'date') {
                leftIndex = d3_bisectLeft(this.data.labels, d3_isoFormat(mouseX));
                // prevent error for 0 index
                if (leftIndex === 0)
                    return false;
                lower = new Date(this.data.labels[leftIndex - 1]);
                upper = new Date(this.data.labels[leftIndex]);
                closest = +mouseX - +lower > +upper - mouseX ? upper : lower; // date mouse is closest to
                closestIndex = this.data.labels.indexOf(d3_isoFormat(closest)); // which index the mouse is closest to
                // console.log(+mouseXDate, leftIndex, +dateLower, +dateUpper, +closestDate, closestIndex);
            }
            else if (this.xAxisType === 'number') {
                leftIndex = d3_bisectLeft(this.data.labels, mouseX);
                // prevent error for 0 index
                if (leftIndex === 0)
                    return false;
                lower = this.data.labels[leftIndex - 1];
                upper = this.data.labels[leftIndex];
                closest = +mouseX - +lower > +upper - mouseX ? upper : lower; // date mouse is closest to
                closestIndex = this.data.labels.indexOf(closest); // which index the mouse is closest to
                // console.log(+mouseXDate, leftIndex, +lower, +upper, +closest, closestIndex);
            }
            else {
                const domain = this.xAxisScale.domain();
                const range = this.xAxisScale.range();
                const rangePoints = d3_range(range[0], range[1], this.xAxisScale.step());
                rangePoints.push(range[1]);
                leftIndex = d3_bisect(rangePoints, mouseX);
                if (leftIndex === 0)
                    return false;
                lower = rangePoints[leftIndex - 1];
                upper = rangePoints[leftIndex];
                closest = +mouseX - +lower > +upper - mouseX ? +upper : +lower;
                const rangeIndex = rangePoints.indexOf(closest);
                closest = domain[rangeIndex];
                closestIndex = this.data.labels.indexOf(domain[rangeIndex]);
            }
            const circles = this.svg.selectAll('.line-group').selectAll('circle');
            circles.filter((d, i) => i === closestIndex).classed('active', true);
            circles.filter((d, i) => i !== closestIndex).classed('active', false);
            this.tooltipLine.attr('x1', this.xAxisScale(closest)).attr('x2', this.xAxisScale(closest)).classed('active', true);
            // console.log(this.tooltipLine.node().getBoundingClientRect(), this._scroll.getScrollPosition());
            this.tooltipShow(this.tooltipLine.node(), closestIndex);
            this.mousedata = {
                label: closest,
                series: this.data.series.map((d) => {
                    return {
                        label: d.label,
                        value: d.values[closestIndex]
                    };
                })
            };
            this.tooltipHovered.emit({ event, data: this.mousedata }); // index of left closest date
        };
        this.mouserectMouseOut = (event, data) => {
            this.svg.selectAll('circle').classed('active', false);
            this.tooltipLine.classed('active', false);
            this.tooltipHide();
        };
        this.mouserectMouseClick = (event) => {
            this.tooltipClicked.emit({ event, data: this.mousedata });
        };
        this.tooltipShow = (node, closestIndex) => {
            const scroll = this._scroll.getScrollPosition();
            const mouserectDimensions = node.getBoundingClientRect();
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            const tooltipDimensions = this.tooltip.node().getBoundingClientRect();
            const dimensionCalculated = mouserectDimensions.left + tooltipDimensions.width + 8;
            const clientWidth = document.body.clientWidth - 10;
            let position;
            // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
            this.tooltip.select('.tooltip-header').html((d) => {
                if (this.xAxisType === 'date') {
                    const parsedTime = d3_isoParse(this.data.labels[closestIndex]);
                    return this.tooltipHeadingFormat(parsedTime);
                }
                else if (this.xAxisType === 'number') {
                    const heading = this.data.labels[closestIndex];
                    return this.tooltipHeadingFormat(heading);
                }
                else {
                    return this.data.labels[closestIndex];
                }
            });
            this.tooltip.selectAll('.tooltip-value').html((d, i) => {
                const value = this.data.series[i].values[closestIndex];
                if (value) {
                    return this.tooltipValueFormatType ? this.tooltipValueFormat(value) : value;
                }
                return '';
            });
            // flip the tooltip positions if near the right edge of the screen
            if (dimensionCalculated > clientWidth) {
                this.tooltip.classed('east', true);
                this.tooltip.classed('west', false);
                position = `${mouserectDimensions.left - tooltipDimensions.width - 8}px`;
            }
            else if (dimensionCalculated < clientWidth) {
                this.tooltip.classed('east', false);
                this.tooltip.classed('west', true);
                position = `${mouserectDimensions.left + 8}px`;
            }
            // console.log('POSITION: ', position, mouserectDimensions);
            // set the tooltip styles
            this.tooltip.style('top', `${mouserectDimensions.top + mouserectDimensions.height / 2 - tooltipOffsetHeight / 2 + scroll[1]}px`);
            this.tooltip.style('left', position);
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.xAxisFormatter = (item) => {
            if (this.xAxisType === 'date') {
                const parseDate = d3_isoParse(item);
                return this.xAxisFormat(parseDate);
            }
            else if (this.xAxisType === 'number') {
                return this.xAxisFormat(item);
            }
            else {
                return item;
                // return this.xAxisFormat(item);
            }
        };
        this.yAxisFormatter = (item) => {
            return this.yAxisFormat(item);
        };
    }
    ngOnInit() {
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        this.clipPathId = nextId;
        // create formatters
        this.xAxisFormat =
            this.xAxisType === 'date' ? d3_timeFormat(this.xAxisFormatString) : d3_format(this.xAxisFormatString);
        this.yAxisFormat = d3_format(this.yAxisFormatString);
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipHeadingFormat =
            this.xAxisType === 'date'
                ? d3_timeFormat(this.tooltipHeadingFormatString)
                : d3_format(this.tooltipHeadingFormatString);
        this.tooltipLabelFormat = this._dataviz.d3Format(this.tooltipLabelFormatType, this.tooltipLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        // defaults for all chart types
        this.lineWidth = 3;
        this.linePoints = true;
        this.hideXAxis = false;
        this.hideYAxis = false;
        this.hideXAxisZero = false;
        this.hideYAxisZero = false;
        this.hideXAxisDomain = false;
        this.hideYAxisDomain = false;
        this.hideTooltip = false;
        this.hideXAxisTicks = false;
        this.hideYAxisTicks = false;
        this.xAxisTickSize = 8;
        this.xAxisTickSizeOuter = 0;
        this.yAxisTickSize = 8;
        this.yAxisTickSizeOuter = 0;
        if (this.type !== 'debug') {
            // set type defaults
            switch (this.type) {
                case 'medium':
                    this.hideXAxisTicks = true;
                    this.hideYAxisTicks = true;
                    break;
                case 'high':
                    this.lineWidth = 2;
                    this.lineCurved = false;
                    this.linePoints = false;
                    this.hideXAxisTicks = true;
                    this.hideYAxisTicks = true;
                    this.hideXGrid = false;
                    this.hideYGrid = false;
                    break;
            }
        }
        // adjust margin if xAxis hidden
        if (this.hideXAxis)
            this.margin.bottom = 10; // need small margin for yAxis with 0 tick label
        if (!this.hideLegend && this.legendPosition === 'right') {
            this.width = +this.width - +this.legendWidth;
        }
        // define line
        this.d3line = d3_line()
            .x((d, i) => {
            if (this.xAxisType === 'date') {
                return this.xAxisScale(d3_isoParse(this.data.labels[i]));
            }
            else if (this.xAxisType === 'number') {
                return this.xAxisScale(this.data.labels[i]);
            }
            else {
                return this.xAxisScale(this.data.labels[i]);
            }
        })
            .y((d) => this.yAxisScale(d));
        // define line curve
        if (this.lineCurved) {
            this.d3line.curve(d3_curveCatmullRom.alpha(0.5));
        }
        // define area
        if (this.area) {
            this.d3area = d3_area()
                .x((d, i) => {
                if (this.xAxisType === 'date') {
                    return this.xAxisScale(d3_isoParse(this.data.labels[i]));
                }
                else if (this.xAxisType === 'number') {
                    return this.xAxisScale(this.data.labels[i]);
                }
                else {
                    return this.xAxisScale(this.data.labels[i]);
                }
            })
                .y0(this.height)
                .y1((d, i) => this.yAxisScale(d));
            if (this.lineCurved) {
                this.d3area.curve(d3_curveCatmullRom.alpha(0.5));
            }
        }
        // create the chart
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width + this.margin.right)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom}`);
        // add rectangle to capture mouse
        this.mouserect = this.svg
            .append('rect')
            .attr('width', this.width - this.margin.left - this.margin.right)
            .attr('height', this.height)
            .attr('class', 'mouserect')
            .on('mousemove', (event, data) => this.mouserectMouseMove(event, data))
            .on('mouseout', (event, data) => this.mouserectMouseOut(event, data))
            .on('click', (event, data) => this.mouserectMouseClick(event));
        this.tooltipLine = this.svg.append('line').attr('y1', 0).attr('y2', this.height).attr('class', 'tooltip-line');
        // define color range
        this.colorRange = d3_scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
        // add glow def
        this._dataviz.createGlowFilter(this.svg);
        // X AXIS
        if (this.xAxisType === 'date') {
            this.xAxisScale = d3_scaleTime()
                .domain(d3_extent(this.data.labels, (d) => {
                return d3_isoParse(d);
            }))
                .range([0, this.width - this.margin.left - this.margin.right]);
        }
        else if (this.xAxisType === 'number') {
            this.xAxisScale = d3_scaleLinear()
                .domain(d3_extent(this.data.labels, (d) => {
                return d;
            }))
                .range([0, this.width - this.margin.left - this.margin.right]);
        }
        else {
            this.xAxisScale = d3_scalePoint()
                .domain(this.data.labels)
                .range([0, this.width - this.margin.left - this.margin.right]);
        }
        if (this.xAxisType === 'string') {
            this.xAxisCall = d3_axisBottom(this.xAxisScale)
                // .ticks(+this.xAxisTicks)
                .tickSize(this.xAxisTickSize)
                .tickSizeOuter(this.xAxisTickSizeOuter)
                .tickFormat(this.xAxisFormatter)
                .tickValues(this.xAxisScale.domain().filter((d, i) => {
                // see https://github.com/d3/d3-scale/issues/182
                // d3 cannot determine number of strings to show on xaxis with scalePoint()
                return i % this.xAxisTicks === 0;
            }));
        }
        else {
            this.xAxisCall = d3_axisBottom(this.xAxisScale)
                .ticks(+this.xAxisTicks)
                .tickSize(this.xAxisTickSize)
                .tickSizeOuter(this.xAxisTickSizeOuter)
                .tickFormat(this.xAxisFormatter);
        }
        this.xAxis = this.svg
            .append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(0, ${this.height})`) //${-this.margin.right / 2}
            .classed('axis-hidden', this.hideXAxis)
            .classed('axis-zero-hidden', this.hideXAxisZero)
            .classed('axis-domain-hidden', this.hideXAxisDomain)
            .classed('axis-ticks-hidden', this.hideXAxisTicks)
            .call(this.xAxisCall);
        // X GRIDLINES
        if (!this.hideXGrid) {
            if (this.xAxisType === 'string') {
                this.xGridCall = d3_axisBottom(this.xAxisScale)
                    .tickSize(-this.height)
                    .tickValues(this.xAxisScale.domain().filter((d, i) => {
                    // see https://github.com/d3/d3-scale/issues/182
                    // d3 cannot determine number of strings to show on xaxis with scalePoint()
                    return i % this.xAxisTicks === 0;
                }));
            }
            else {
                this.xGridCall = d3_axisBottom(this.xAxisScale).tickSize(-this.height);
            }
            this.xGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-x')
                .classed('grid-zero-hidden', this.hideXAxisZero)
                .attr('transform', `translate(0, ${this.height})`) //${-this.margin.right / 2}
                .call(this.xGridCall);
        }
        // Y AXIS
        this.yAxisScale = d3_scaleLinear()
            .domain([
            d3_min(this.data.series, (d, i) => {
                const minVal = +d3_min(d.values);
                return minVal - minVal * +this.yAxisMinBuffer;
            }),
            d3_max(this.data.series, (d, i) => {
                const maxVal = +d3_max(d.values);
                return maxVal + maxVal * this.yAxisMaxBuffer;
            })
        ])
            .nice()
            .range([this.height, 0]);
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
            // tooltip table
            const tooltipTable = this.tooltip.append('table').attr('class', 'tooltip-table text-left w-100');
            const tooltipTableTbody = tooltipTable.append('tbody');
            tooltipTableTbody
                .selectAll('tr')
                .data(this.data)
                .join((enter) => enter.append('tr'));
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
        }
        // add clip path for line animation
        this.svg
            .append('clipPath')
            .attr('id', `clip-path-${this.clipPathId}`)
            .append('rect')
            .attr('width', +this.width - +this.margin.left - +this.margin.right)
            .attr('height', +this.height);
        // add clip path for points animation
        this.svg
            .append('clipPath')
            .attr('id', `clip-path-points-${this.clipPathId}`)
            .append('rect')
            .attr('width', +this.width + +this.margin.left - +this.margin.right)
            .attr('height', +this.height)
            .attr('transform', `translate(-${this.margin.left}, 0)`);
        this.updateChart();
        nextId++;
    }
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    }
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
}
PbdsDatavizLineComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsDatavizLineComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizLineComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.4", type: PbdsDatavizLineComponent, selector: "pbds-dataviz-line", inputs: { data: "data", width: "width", height: "height", type: "type", area: "area", xAxisType: "xAxisType", xAxisFormatString: "xAxisFormatString", xAxisTicks: "xAxisTicks", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", yAxisMinBuffer: "yAxisMinBuffer", yAxisMaxBuffer: "yAxisMaxBuffer", hideXGrid: "hideXGrid", hideYGrid: "hideYGrid", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", tooltipHeadingFormatString: "tooltipHeadingFormatString", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", theme: "theme", lineCurved: "lineCurved" }, outputs: { hovered: "hovered", clicked: "clicked", tooltipHovered: "tooltipHovered", tooltipClicked: "tooltipClicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-line": "this.lineClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsDatavizLineComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pbds-dataviz-line',
                    template: ``,
                    styles: [],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i1.PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }, { type: i2.Location }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], lineClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-line']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], type: [{
                type: Input
            }], area: [{
                type: Input
            }], xAxisType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], xAxisTicks: [{
                type: Input
            }], yAxisFormatString: [{
                type: Input
            }], yAxisTicks: [{
                type: Input
            }], yAxisMinBuffer: [{
                type: Input
            }], yAxisMaxBuffer: [{
                type: Input
            }], hideXGrid: [{
                type: Input
            }], hideYGrid: [{
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
            }], tooltipHeadingFormatString: [{
                type: Input
            }], tooltipLabelFormatType: [{
                type: Input
            }], tooltipLabelFormatString: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], theme: [{
                type: Input
            }], lineCurved: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }], tooltipHovered: [{
                type: Output
            }], tooltipClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1saW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0YXZpei9kYXRhdml6LWxpbmUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBRVosV0FBVyxFQUdYLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxPQUFPLElBQUksVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsZUFBZSxJQUFJLGtCQUFrQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ25HLE9BQU8sRUFDTCxZQUFZLElBQUksZUFBZSxFQUMvQixXQUFXLElBQUksY0FBYyxFQUM3QixTQUFTLElBQUksWUFBWSxFQUN6QixVQUFVLElBQUksYUFBYSxFQUM1QixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQ0wsR0FBRyxJQUFJLE1BQU0sRUFDYixHQUFHLElBQUksTUFBTSxFQUNiLE1BQU0sSUFBSSxTQUFTLEVBQ25CLFVBQVUsSUFBSSxhQUFhLEVBQzNCLEtBQUssSUFBSSxRQUFRLEVBQ2pCLE1BQU0sSUFBSSxTQUFTLEVBQ3BCLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDL0UsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDaEQsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsU0FBUyxJQUFJLFlBQVksRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLE1B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c0JBRHZCLEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixZQUFZO3NCQURYLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxLQUFLO2dCQUlOLEtBQUs7c0JBREosS0FBSztnQkFHRyxVQUFVO3NCQUFsQixLQUFLO2dCQUdOLE9BQU87c0JBRE4sTUFBTTtnQkFJUCxPQUFPO3NCQUROLE1BQU07Z0JBSVAsY0FBYztzQkFEYixNQUFNO2dCQUlQLGNBQWM7c0JBRGIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIE9uRGVzdHJveSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIsIExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCwgcG9pbnRlciBhcyBkM19wb2ludGVyIH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IGxpbmUgYXMgZDNfbGluZSwgYXJlYSBhcyBkM19hcmVhLCBjdXJ2ZUNhdG11bGxSb20gYXMgZDNfY3VydmVDYXRtdWxsUm9tIH0gZnJvbSAnZDMtc2hhcGUnO1xuaW1wb3J0IHtcbiAgc2NhbGVPcmRpbmFsIGFzIGQzX3NjYWxlT3JkaW5hbCxcbiAgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsXG4gIHNjYWxlVGltZSBhcyBkM19zY2FsZVRpbWUsXG4gIHNjYWxlUG9pbnQgYXMgZDNfc2NhbGVQb2ludFxufSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQge1xuICBtaW4gYXMgZDNfbWluLFxuICBtYXggYXMgZDNfbWF4LFxuICBleHRlbnQgYXMgZDNfZXh0ZW50LFxuICBiaXNlY3RMZWZ0IGFzIGQzX2Jpc2VjdExlZnQsXG4gIHJhbmdlIGFzIGQzX3JhbmdlLFxuICBiaXNlY3QgYXMgZDNfYmlzZWN0XG59IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7IGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSwgYXhpc0xlZnQgYXMgZDNfYXhpc0xlZnQgfSBmcm9tICdkMy1heGlzJztcbmltcG9ydCB7IGZvcm1hdCBhcyBkM19mb3JtYXQgfSBmcm9tICdkMy1mb3JtYXQnO1xuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UsIGlzb0Zvcm1hdCBhcyBkM19pc29Gb3JtYXQsIHRpbWVGb3JtYXQgYXMgZDNfdGltZUZvcm1hdCB9IGZyb20gJ2QzLXRpbWUtZm9ybWF0JztcbmltcG9ydCB7IGVhc2VRdWFkSW5PdXQgYXMgZDNfZWFzZVF1YWRJbk91dCB9IGZyb20gJ2QzLWVhc2UnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekxpbmUgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbi8vIGFzc2lnbiBhbiBJRCBmb3IgZWFjaCBjb21wb25lbnQgaW5zdGFuY2VcbmxldCBuZXh0SWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotbGluZScsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpMaW5lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1saW5lJylcbiAgbGluZUNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBQYmRzRGF0YXZpekxpbmU7XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAzMDY7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNDAwO1xuXG4gIEBJbnB1dCgpXG4gIHR5cGU6ICdtZWRpdW0nIHwgJ2hpZ2gnIHwgJ2RlYnVnJyA9ICdtZWRpdW0nOyAvLyBkZWJ1ZyB0byBzaG93IGFsbCBjaGFydCBvcHRpb25zXG5cbiAgQElucHV0KClcbiAgYXJlYSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVHlwZTogJ2RhdGUnIHwgJ251bWJlcicgfCAnc3RyaW5nJyA9ICdkYXRlJztcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGlja3MgPSA2O1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgeUF4aXNUaWNrcyA9IDU7XG5cbiAgQElucHV0KClcbiAgeUF4aXNNaW5CdWZmZXIgPSAwLjAxO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWF4QnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICBoaWRlWEdyaWQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVZR3JpZCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMTA1ICsgMjg7IC8vIGhhcmRjb2RlZCBsZWdlbmQgd2lkdGggKyBsZWZ0IG1hcmdpbiwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbGVnZW5kUG9zaXRpb246ICdyaWdodCcgfCAnYm90dG9tJyA9ICdyaWdodCc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwSGVhZGluZ0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luVG9wID0gMTA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5SaWdodCA9IDIwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMzA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gNTU7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICB0aGVtZTtcblxuICBASW5wdXQoKSBsaW5lQ3VydmVkID0gdHJ1ZTtcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgdG9vbHRpcEhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHRvb2x0aXBDbGlja2VkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1vdXNlcmVjdDtcbiAgcHJpdmF0ZSB0b29sdGlwTGluZTtcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY2xpcFBhdGhJZDtcbiAgcHJpdmF0ZSBkM2xpbmU7XG4gIHByaXZhdGUgZDNhcmVhO1xuICBwcml2YXRlIGxpbmVXaWR0aDtcbiAgcHJpdmF0ZSBsaW5lUG9pbnRzO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgeEF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XG4gIHByaXZhdGUgeEF4aXM7XG4gIHByaXZhdGUgeEF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeUF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB5QXhpc0NhbGw7XG4gIHByaXZhdGUgeUF4aXM7XG4gIHByaXZhdGUgeUF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeEdyaWQ7XG4gIHByaXZhdGUgeEdyaWRDYWxsO1xuICBwcml2YXRlIHlHcmlkO1xuICBwcml2YXRlIHlHcmlkQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHlBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIGhpZGVYQXhpczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXM6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSBoaWRlVG9vbHRpcDogYm9vbGVhbjtcbiAgcHJpdmF0ZSB0b29sdGlwSGVhZGluZ0Zvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcExhYmVsRm9ybWF0O1xuICBwcml2YXRlIG1vdXNlZGF0YTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIsXG4gICAgcHJpdmF0ZSBfbG9jYXRpb246IExvY2F0aW9uXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIHRoaXMuY2xpcFBhdGhJZCA9IG5leHRJZDtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9XG4gICAgICB0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnID8gZDNfdGltZUZvcm1hdCh0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKSA6IGQzX2Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnlBeGlzRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMueUF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0ID1cbiAgICAgIHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZSdcbiAgICAgICAgPyBkM190aW1lRm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcpXG4gICAgICAgIDogZDNfZm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXG4gICAgdGhpcy5saW5lV2lkdGggPSAzO1xuICAgIHRoaXMubGluZVBvaW50cyA9IHRydWU7XG4gICAgdGhpcy5oaWRlWEF4aXMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVUb29sdGlwID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSBmYWxzZTtcbiAgICB0aGlzLnhBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyID0gMDtcbiAgICB0aGlzLnlBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyID0gMDtcblxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdkZWJ1ZycpIHtcbiAgICAgIC8vIHNldCB0eXBlIGRlZmF1bHRzXG4gICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICBjYXNlICdtZWRpdW0nOlxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2hpZ2gnOlxuICAgICAgICAgIHRoaXMubGluZVdpZHRoID0gMjtcbiAgICAgICAgICB0aGlzLmxpbmVDdXJ2ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmxpbmVQb2ludHMgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuaGlkZVlHcmlkID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRqdXN0IG1hcmdpbiBpZiB4QXhpcyBoaWRkZW5cbiAgICBpZiAodGhpcy5oaWRlWEF4aXMpIHRoaXMubWFyZ2luLmJvdHRvbSA9IDEwOyAvLyBuZWVkIHNtYWxsIG1hcmdpbiBmb3IgeUF4aXMgd2l0aCAwIHRpY2sgbGFiZWxcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGRlZmluZSBsaW5lXG4gICAgdGhpcy5kM2xpbmUgPSBkM19saW5lKClcbiAgICAgIC54KChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5sYWJlbHNbaV0pKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUodGhpcy5kYXRhLmxhYmVsc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAueSgoZDogYW55KSA9PiB0aGlzLnlBeGlzU2NhbGUoZCkpO1xuXG4gICAgLy8gZGVmaW5lIGxpbmUgY3VydmVcbiAgICBpZiAodGhpcy5saW5lQ3VydmVkKSB7XG4gICAgICB0aGlzLmQzbGluZS5jdXJ2ZShkM19jdXJ2ZUNhdG11bGxSb20uYWxwaGEoMC41KSk7XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIGFyZWFcbiAgICBpZiAodGhpcy5hcmVhKSB7XG4gICAgICB0aGlzLmQzYXJlYSA9IGQzX2FyZWEoKVxuICAgICAgICAueCgoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmxhYmVsc1tpXSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnkwKHRoaXMuaGVpZ2h0KVxuICAgICAgICAueTEoKGQ6IGFueSwgaSkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKTtcblxuICAgICAgaWYgKHRoaXMubGluZUN1cnZlZCkge1xuICAgICAgICB0aGlzLmQzYXJlYS5jdXJ2ZShkM19jdXJ2ZUNhdG11bGxSb20uYWxwaGEoMC41KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHRoZSBjaGFydFxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLnJpZ2h0fSAke1xuICAgICAgICAgICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbVxuICAgICAgICB9YFxuICAgICAgKTtcblxuICAgIC8vIGFkZCByZWN0YW5nbGUgdG8gY2FwdHVyZSBtb3VzZVxuICAgIHRoaXMubW91c2VyZWN0ID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdtb3VzZXJlY3QnKVxuICAgICAgLm9uKCdtb3VzZW1vdmUnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubW91c2VyZWN0TW91c2VNb3ZlKGV2ZW50LCBkYXRhKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubW91c2VyZWN0TW91c2VPdXQoZXZlbnQsIGRhdGEpKVxuICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4gdGhpcy5tb3VzZXJlY3RNb3VzZUNsaWNrKGV2ZW50KSk7XG5cbiAgICB0aGlzLnRvb2x0aXBMaW5lID0gdGhpcy5zdmcuYXBwZW5kKCdsaW5lJykuYXR0cigneTEnLCAwKS5hdHRyKCd5MicsIHRoaXMuaGVpZ2h0KS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWxpbmUnKTtcblxuICAgIC8vIGRlZmluZSBjb2xvciByYW5nZVxuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpLnJhbmdlKHRoaXMuX2RhdGF2aXouZ2V0Q29sb3JzKGZhbHNlLCB0aGlzLnRoZW1lKSk7XG5cbiAgICAvLyBhZGQgZ2xvdyBkZWZcbiAgICB0aGlzLl9kYXRhdml6LmNyZWF0ZUdsb3dGaWx0ZXIodGhpcy5zdmcpO1xuXG4gICAgLy8gWCBBWElTXG4gICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlVGltZSgpXG4gICAgICAgIC5kb21haW4oXG4gICAgICAgICAgZDNfZXh0ZW50KHRoaXMuZGF0YS5sYWJlbHMsIChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkM19pc29QYXJzZShkKTtcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAgIC5kb21haW4oXG4gICAgICAgICAgZDNfZXh0ZW50KHRoaXMuZGF0YS5sYWJlbHMsIChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICAgLnJhbmdlKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlUG9pbnQoKVxuICAgICAgICAuZG9tYWluKHRoaXMuZGF0YS5sYWJlbHMpXG4gICAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAgIC8vIC50aWNrcygrdGhpcy54QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUodGhpcy54QXhpc1RpY2tTaXplKVxuICAgICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcilcbiAgICAgICAgLnRpY2tWYWx1ZXMoXG4gICAgICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbigpLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kMy9kMy1zY2FsZS9pc3N1ZXMvMTgyXG4gICAgICAgICAgICAvLyBkMyBjYW5ub3QgZGV0ZXJtaW5lIG51bWJlciBvZiBzdHJpbmdzIHRvIHNob3cgb24geGF4aXMgd2l0aCBzY2FsZVBvaW50KClcbiAgICAgICAgICAgIHJldHVybiBpICUgdGhpcy54QXhpc1RpY2tzID09PSAwO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrcygrdGhpcy54QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUodGhpcy54QXhpc1RpY2tTaXplKVxuICAgICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XG4gICAgfVxuXG4gICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKSAvLyR7LXRoaXMubWFyZ2luLnJpZ2h0IC8gMn1cbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgLy8gWCBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAgICAgLnRpY2tTaXplKC10aGlzLmhlaWdodClcbiAgICAgICAgICAudGlja1ZhbHVlcyhcbiAgICAgICAgICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4oKS5maWx0ZXIoKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kMy9kMy1zY2FsZS9pc3N1ZXMvMTgyXG4gICAgICAgICAgICAgIC8vIGQzIGNhbm5vdCBkZXRlcm1pbmUgbnVtYmVyIG9mIHN0cmluZ3MgdG8gc2hvdyBvbiB4YXhpcyB3aXRoIHNjYWxlUG9pbnQoKVxuICAgICAgICAgICAgICByZXR1cm4gaSAlIHRoaXMueEF4aXNUaWNrcyA9PT0gMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpLnRpY2tTaXplKC10aGlzLmhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMueEdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApIC8vJHstdGhpcy5tYXJnaW4ucmlnaHQgLyAyfVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gWSBBWElTXG4gICAgdGhpcy55QXhpc1NjYWxlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbXG4gICAgICAgIGQzX21pbih0aGlzLmRhdGEuc2VyaWVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWluVmFsID0gK2QzX21pbihkLnZhbHVlcyk7XG4gICAgICAgICAgcmV0dXJuIG1pblZhbCAtIG1pblZhbCAqICt0aGlzLnlBeGlzTWluQnVmZmVyO1xuICAgICAgICB9KSxcbiAgICAgICAgZDNfbWF4KHRoaXMuZGF0YS5zZXJpZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBtYXhWYWwgPSArZDNfbWF4KGQudmFsdWVzKTtcbiAgICAgICAgICByZXR1cm4gbWF4VmFsICsgbWF4VmFsICogdGhpcy55QXhpc01heEJ1ZmZlcjtcbiAgICAgICAgfSlcbiAgICAgIF0pXG4gICAgICAubmljZSgpXG4gICAgICAucmFuZ2UoW3RoaXMuaGVpZ2h0LCAwXSk7XG5cbiAgICB0aGlzLnlBeGlzQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAudGlja1NpemUodGhpcy55QXhpc1RpY2tTaXplKVxuICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy55QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAudGlja0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0dGVyKTtcblxuICAgIHRoaXMueUF4aXMgPSB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXknKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXMpXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc0RvbWFpbilcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzVGlja3MpXG4gICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyBZIEdSSURMSU5FU1xuICAgIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcbiAgICAgIHRoaXMueUdyaWRDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUoLXRoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHQpO1xuXG4gICAgICB0aGlzLnlHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteScpXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAwKWApXG4gICAgICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBUT09MVElQXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBkM19zZWxlY3QoJ2JvZHknKVxuICAgICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAncGJkcy10b29sdGlwIHdlc3QnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcblxuICAgICAgLy8gdG9vbHRpcCBoZWFkZXJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XG5cbiAgICAgIC8vIHRvb2x0aXAgdGFibGVcbiAgICAgIGNvbnN0IHRvb2x0aXBUYWJsZSA9IHRoaXMudG9vbHRpcC5hcHBlbmQoJ3RhYmxlJykuYXR0cignY2xhc3MnLCAndG9vbHRpcC10YWJsZSB0ZXh0LWxlZnQgdy0xMDAnKTtcblxuICAgICAgY29uc3QgdG9vbHRpcFRhYmxlVGJvZHkgPSB0b29sdGlwVGFibGUuYXBwZW5kKCd0Ym9keScpO1xuXG4gICAgICB0b29sdGlwVGFibGVUYm9keVxuICAgICAgICAuc2VsZWN0QWxsKCd0cicpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgICAgLmpvaW4oKGVudGVyKSA9PiBlbnRlci5hcHBlbmQoJ3RyJykpO1xuICAgIH1cblxuICAgIC8vIGFkZCBsZWdlbmQgY2xhc3Nlc1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xuICAgIH1cblxuICAgIC8vIGFkZCBjbGlwIHBhdGggZm9yIGxpbmUgYW5pbWF0aW9uXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2NsaXBQYXRoJylcbiAgICAgIC5hdHRyKCdpZCcsIGBjbGlwLXBhdGgtJHt0aGlzLmNsaXBQYXRoSWR9YClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggLSArdGhpcy5tYXJnaW4ubGVmdCAtICt0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQpO1xuXG4gICAgLy8gYWRkIGNsaXAgcGF0aCBmb3IgcG9pbnRzIGFuaW1hdGlvblxuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdjbGlwUGF0aCcpXG4gICAgICAuYXR0cignaWQnLCBgY2xpcC1wYXRoLXBvaW50cy0ke3RoaXMuY2xpcFBhdGhJZH1gKVxuICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aCArICt0aGlzLm1hcmdpbi5sZWZ0IC0gK3RoaXMubWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKC0ke3RoaXMubWFyZ2luLmxlZnR9LCAwKWApO1xuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuXG4gICAgbmV4dElkKys7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgdGhpcy5tb3VzZXJlY3QuZGF0YSh0aGlzLmRhdGEpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSB4U2NhbGVcbiAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVUaW1lKClcbiAgICAgICAgLmRvbWFpbihcbiAgICAgICAgICBkM19leHRlbnQodGhpcy5kYXRhLmxhYmVscywgKGQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGQzX2lzb1BhcnNlKGQpO1xuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICAgLnJhbmdlKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0XSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgICAgLmRvbWFpbihcbiAgICAgICAgICBkM19leHRlbnQodGhpcy5kYXRhLmxhYmVscywgKGQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGQ7XG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICAucmFuZ2UoWzAsIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHRdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVQb2ludCgpXG4gICAgICAgIC5kb21haW4odGhpcy5kYXRhLmxhYmVscylcbiAgICAgICAgLnJhbmdlKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0XSk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRoZSB5U2NhbGVcbiAgICB0aGlzLnlBeGlzU2NhbGVcbiAgICAgIC5kb21haW4oW1xuICAgICAgICBkM19taW4odGhpcy5kYXRhLnNlcmllcywgKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1pblZhbCA9ICtkM19taW4oZC52YWx1ZXMpO1xuICAgICAgICAgIHJldHVybiBtaW5WYWwgLSBtaW5WYWwgKiArdGhpcy55QXhpc01pbkJ1ZmZlcjtcbiAgICAgICAgfSksXG4gICAgICAgIGQzX21heCh0aGlzLmRhdGEuc2VyaWVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF4VmFsID0gK2QzX21heChkLnZhbHVlcyk7XG4gICAgICAgICAgcmV0dXJuIG1heFZhbCArIG1heFZhbCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG4gICAgICAgIH0pXG4gICAgICBdKVxuICAgICAgLm5pY2UoKTtcblxuICAgIHRoaXMueEF4aXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgdGhpcy55QXhpcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIGdyaWRzXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgdGhpcy55R3JpZC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gbGluZXNcbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgncGF0aC5saW5lJylcbiAgICAgIC5hdHRyKCdmaWx0ZXInLCAoKSA9PlxuICAgICAgICB0aGlzLnR5cGUgIT09ICdoaWdoJyA/IGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wcmVwYXJlRXh0ZXJuYWxVcmwodGhpcy5fbG9jYXRpb24ucGF0aCgpKX0jZ2xvdylgIDogbnVsbFxuICAgICAgKVxuICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgIC5qb2luKFxuICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAuYXR0cihcbiAgICAgICAgICAgICAgJ2NsaXAtcGF0aCcsXG4gICAgICAgICAgICAgIGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wcmVwYXJlRXh0ZXJuYWxVcmwodGhpcy5fbG9jYXRpb24ucGF0aCgpKX0jY2xpcC1wYXRoLSR7dGhpcy5jbGlwUGF0aElkfSlgXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGluZScpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMubGluZVdpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBhcnJheSA9IG5ldyBBcnJheShkYXRhLnZhbHVlcy5sZW5ndGgpLmZpbGwoMCk7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmQzbGluZShhcnJheSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhbGwoKGVudGVyKSA9PlxuICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkJywgKGRhdGEpID0+IHRoaXMuZDNsaW5lKGRhdGEudmFsdWVzKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cignZCcsIChkKSA9PiB0aGlzLmQzbGluZShkLnZhbHVlcykpXG4gICAgICAgICAgKSxcbiAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICk7XG5cbiAgICAvLyBhcmVhXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgncGF0aC5hcmVhJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAgIC5hdHRyKFxuICAgICAgICAgICAgICAgICdjbGlwLXBhdGgnLFxuICAgICAgICAgICAgICAgIGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wcmVwYXJlRXh0ZXJuYWxVcmwodGhpcy5fbG9jYXRpb24ucGF0aCgpKX0jY2xpcC1wYXRoLSR7dGhpcy5jbGlwUGF0aElkfSlgXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2FyZWEnKVxuICAgICAgICAgICAgICAuYXR0cignZCcsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJyYXkgPSBuZXcgQXJyYXkoZGF0YS52YWx1ZXMubGVuZ3RoKS5maWxsKDApO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmQzYXJlYShhcnJheSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5zdHlsZSgnY29sb3InLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAuY2FsbCgoZW50ZXIpID0+XG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdkJywgKGRhdGEpID0+IHRoaXMuZDNhcmVhKGRhdGEudmFsdWVzKSlcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgPT4gdGhpcy5kM2FyZWEoZC52YWx1ZXMpKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gY2lyY2xlc1xuICAgIGlmICh0aGlzLmxpbmVQb2ludHMpIHtcbiAgICAgIC8vIGFkZCBwb2ludHNcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJ2cucG9pbnRzJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdwb2ludHMnKVxuICAgICAgICAgICAgICAuYXR0cihcbiAgICAgICAgICAgICAgICAnY2xpcC1wYXRoJyxcbiAgICAgICAgICAgICAgICBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucHJlcGFyZUV4dGVybmFsVXJsKHRoaXMuX2xvY2F0aW9uLnBhdGgoKSl9I2NsaXAtcGF0aC1wb2ludHMtJHt0aGlzLmNsaXBQYXRoSWR9KWBcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2NvbG9yJywgKGQsIGkpID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSlcblxuICAgICAgICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgICAgICAgICAuZGF0YSgoZCkgPT4gZC52YWx1ZXMpXG4gICAgICAgICAgICAgIC5qb2luKFxuICAgICAgICAgICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmxhYmVsc1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpID0+IHRoaXMueUF4aXNTY2FsZSgwKSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3InLCB0aGlzLmxpbmVXaWR0aCAqIDIpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy5saW5lV2lkdGgpXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKChlbnRlcikgPT5cbiAgICAgICAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpID0+IHRoaXMueUF4aXNTY2FsZShkKSlcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7fSxcbiAgICAgICAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgLmRhdGEoKGQpID0+IGQudmFsdWVzKVxuICAgICAgICAgICAgICAuam9pbihcbiAgICAgICAgICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5sYWJlbHNbaV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZSh0aGlzLmRhdGEubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZCkpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdyJywgdGhpcy5saW5lV2lkdGggKiAyKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMubGluZVdpZHRoKSxcbiAgICAgICAgICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmxhYmVsc1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZSh0aGlzLmRhdGEubGFiZWxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZCkpXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcbiAgICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgKGVudGVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaSA9IGVudGVyLmFwcGVuZCgnbGknKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtaXRlbScpO1xuXG4gICAgICAgICAgICBsaS5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWtleScpXG4gICAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpO1xuXG4gICAgICAgICAgICBsaS5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJylcbiAgICAgICAgICAgICAgLmh0bWwoKGQpID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmxhYmVsKTtcblxuICAgICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICh1cGRhdGUpID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKChkKSA9PiB7XG4gICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubGVnZW5kTW91c2VPdmVyKGV2ZW50LCBkYXRhKSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHRoaXMubGVnZW5kTW91c2VPdXQoKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4gdGhpcy5sZWdlbmRNb3VzZUNsaWNrKGV2ZW50LCBkYXRhKSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXBcbiAgICAgICAgLnNlbGVjdCgnLnRvb2x0aXAtdGFibGUnKVxuICAgICAgICAuc2VsZWN0QWxsKCd0cicpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YS5zZXJpZXMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdG9vbHRpcEl0ZW0gPSBlbnRlci5hcHBlbmQoJ3RyJykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1pdGVtJyk7XG5cbiAgICAgICAgICAgIHRvb2x0aXBJdGVtXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3RkJylcbiAgICAgICAgICAgICAgLnN0eWxlKCdjb2xvcicsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncGJkcy10b29sdGlwLWtleScpO1xuXG4gICAgICAgICAgICB0b29sdGlwSXRlbVxuICAgICAgICAgICAgICAuYXBwZW5kKCd0ZCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0b29sdGlwLWxhYmVsIHByLTIgdGV4dC1ub3dyYXAnKVxuICAgICAgICAgICAgICAuaHRtbCgoZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUgPyB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChkLmxhYmVsKSA6IGQubGFiZWw7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0b29sdGlwSXRlbVxuICAgICAgICAgICAgICAuYXBwZW5kKCd0ZCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0b29sdGlwLXZhbHVlIHRleHQtcmlnaHQgdGV4dC1ub3dyYXAnKVxuICAgICAgICAgICAgICAuaHRtbCgoZCkgPT4gJycpO1xuXG4gICAgICAgICAgICByZXR1cm4gdG9vbHRpcEl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICAodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHRvb2x0aXAgbGFiZWwgdGV4dFxuICAgICAgICAgICAgY29uc3QgdG9vbHRpcExhYmVsID0gdXBkYXRlLnNlbGVjdCgnLnRvb2x0aXAtbGFiZWwnKTtcblxuICAgICAgICAgICAgdG9vbHRpcExhYmVsLmh0bWwoKGQpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSA/IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGQubGFiZWwpIDogZC5sYWJlbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5wb2ludHMnKS5yYWlzZSgpO1xuICAgIHRoaXMubW91c2VyZWN0LnJhaXNlKCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coZGF0YSwgdGhpcy5saW5lUG9pbnRzKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgIHJldHVybiBkLmxhYmVsICE9PSBkYXRhLmxhYmVsO1xuICAgICAgfSlcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIGQubGFiZWwgIT09IGRhdGEubGFiZWw7XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBpZiAodGhpcy5hcmVhKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAgIC5maWx0ZXIoKGQsIGkpID0+IHtcbiAgICAgICAgICByZXR1cm4gZC5sYWJlbCAhPT0gZGF0YS5sYWJlbDtcbiAgICAgICAgfSlcbiAgICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGluZVBvaW50cykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnBvaW50cycpXG4gICAgICAgIC5maWx0ZXIoKGQsIGkpID0+IHtcbiAgICAgICAgICByZXR1cm4gZC5sYWJlbCAhPT0gZGF0YS5sYWJlbDtcbiAgICAgICAgfSlcbiAgICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlJylcbiAgICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxpbmUnKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG5cbiAgICBpZiAodGhpcy5saW5lUG9pbnRzKSB7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJ2NpcmNsZScpLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hcmVhKSB7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5hcmVhJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIGxlZ2VuZE1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIG1vdXNlcmVjdE1vdXNlTW92ZSA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIGxldCBtb3VzZVg7IC8vIG1vdXNlIHggcG9zaXRpb25cbiAgICBsZXQgbG93ZXI7XG4gICAgbGV0IHVwcGVyO1xuICAgIGxldCBjbG9zZXN0O1xuICAgIGxldCBjbG9zZXN0SW5kZXg7XG5cbiAgICBsZXQgbGVmdEluZGV4ID0gMDtcblxuICAgIC8vIGhhbmRsZSBzdHJpbmcgdHlwZSwgbm8gaW52ZXJ0IGZ1bmN0aW9uIG9uIHNjYWxlUG9pbnRcbiAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBtb3VzZVggPSBkM19wb2ludGVyKGV2ZW50KVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW91c2VYID0gdGhpcy54QXhpc1NjYWxlLmludmVydChkM19wb2ludGVyKGV2ZW50KVswXSk7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2cobW91c2VYKTtcblxuICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICBsZWZ0SW5kZXggPSBkM19iaXNlY3RMZWZ0KHRoaXMuZGF0YS5sYWJlbHMsIGQzX2lzb0Zvcm1hdChtb3VzZVgpKTtcblxuICAgICAgLy8gcHJldmVudCBlcnJvciBmb3IgMCBpbmRleFxuICAgICAgaWYgKGxlZnRJbmRleCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBsb3dlciA9IG5ldyBEYXRlKHRoaXMuZGF0YS5sYWJlbHNbbGVmdEluZGV4IC0gMV0pO1xuICAgICAgdXBwZXIgPSBuZXcgRGF0ZSh0aGlzLmRhdGEubGFiZWxzW2xlZnRJbmRleF0pO1xuICAgICAgY2xvc2VzdCA9ICttb3VzZVggLSArbG93ZXIgPiArdXBwZXIgLSBtb3VzZVggPyB1cHBlciA6IGxvd2VyOyAvLyBkYXRlIG1vdXNlIGlzIGNsb3Nlc3QgdG9cbiAgICAgIGNsb3Nlc3RJbmRleCA9IHRoaXMuZGF0YS5sYWJlbHMuaW5kZXhPZihkM19pc29Gb3JtYXQoY2xvc2VzdCkpOyAvLyB3aGljaCBpbmRleCB0aGUgbW91c2UgaXMgY2xvc2VzdCB0b1xuICAgICAgLy8gY29uc29sZS5sb2coK21vdXNlWERhdGUsIGxlZnRJbmRleCwgK2RhdGVMb3dlciwgK2RhdGVVcHBlciwgK2Nsb3Nlc3REYXRlLCBjbG9zZXN0SW5kZXgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICBsZWZ0SW5kZXggPSBkM19iaXNlY3RMZWZ0KHRoaXMuZGF0YS5sYWJlbHMsIG1vdXNlWCk7XG5cbiAgICAgIC8vIHByZXZlbnQgZXJyb3IgZm9yIDAgaW5kZXhcbiAgICAgIGlmIChsZWZ0SW5kZXggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgICAgbG93ZXIgPSB0aGlzLmRhdGEubGFiZWxzW2xlZnRJbmRleCAtIDFdO1xuICAgICAgdXBwZXIgPSB0aGlzLmRhdGEubGFiZWxzW2xlZnRJbmRleF07XG4gICAgICBjbG9zZXN0ID0gK21vdXNlWCAtICtsb3dlciA+ICt1cHBlciAtIG1vdXNlWCA/IHVwcGVyIDogbG93ZXI7IC8vIGRhdGUgbW91c2UgaXMgY2xvc2VzdCB0b1xuICAgICAgY2xvc2VzdEluZGV4ID0gdGhpcy5kYXRhLmxhYmVscy5pbmRleE9mKGNsb3Nlc3QpOyAvLyB3aGljaCBpbmRleCB0aGUgbW91c2UgaXMgY2xvc2VzdCB0b1xuICAgICAgLy8gY29uc29sZS5sb2coK21vdXNlWERhdGUsIGxlZnRJbmRleCwgK2xvd2VyLCArdXBwZXIsICtjbG9zZXN0LCBjbG9zZXN0SW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkb21haW4gPSB0aGlzLnhBeGlzU2NhbGUuZG9tYWluKCk7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMueEF4aXNTY2FsZS5yYW5nZSgpO1xuICAgICAgY29uc3QgcmFuZ2VQb2ludHMgPSBkM19yYW5nZShyYW5nZVswXSwgcmFuZ2VbMV0sIHRoaXMueEF4aXNTY2FsZS5zdGVwKCkpO1xuICAgICAgcmFuZ2VQb2ludHMucHVzaChyYW5nZVsxXSk7XG5cbiAgICAgIGxlZnRJbmRleCA9IGQzX2Jpc2VjdChyYW5nZVBvaW50cywgbW91c2VYKTtcblxuICAgICAgaWYgKGxlZnRJbmRleCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBsb3dlciA9IHJhbmdlUG9pbnRzW2xlZnRJbmRleCAtIDFdO1xuICAgICAgdXBwZXIgPSByYW5nZVBvaW50c1tsZWZ0SW5kZXhdO1xuICAgICAgY2xvc2VzdCA9ICttb3VzZVggLSArbG93ZXIgPiArdXBwZXIgLSBtb3VzZVggPyArdXBwZXIgOiArbG93ZXI7XG5cbiAgICAgIGNvbnN0IHJhbmdlSW5kZXggPSByYW5nZVBvaW50cy5pbmRleE9mKGNsb3Nlc3QpO1xuICAgICAgY2xvc2VzdCA9IGRvbWFpbltyYW5nZUluZGV4XTtcblxuICAgICAgY2xvc2VzdEluZGV4ID0gdGhpcy5kYXRhLmxhYmVscy5pbmRleE9mKGRvbWFpbltyYW5nZUluZGV4XSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2lyY2xlcyA9IHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmxpbmUtZ3JvdXAnKS5zZWxlY3RBbGwoJ2NpcmNsZScpO1xuICAgIGNpcmNsZXMuZmlsdGVyKChkLCBpKSA9PiBpID09PSBjbG9zZXN0SW5kZXgpLmNsYXNzZWQoJ2FjdGl2ZScsIHRydWUpO1xuICAgIGNpcmNsZXMuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBjbG9zZXN0SW5kZXgpLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcExpbmUuYXR0cigneDEnLCB0aGlzLnhBeGlzU2NhbGUoY2xvc2VzdCkpLmF0dHIoJ3gyJywgdGhpcy54QXhpc1NjYWxlKGNsb3Nlc3QpKS5jbGFzc2VkKCdhY3RpdmUnLCB0cnVlKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudG9vbHRpcExpbmUubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKSk7XG4gICAgdGhpcy50b29sdGlwU2hvdyh0aGlzLnRvb2x0aXBMaW5lLm5vZGUoKSwgY2xvc2VzdEluZGV4KTtcblxuICAgIHRoaXMubW91c2VkYXRhID0ge1xuICAgICAgbGFiZWw6IGNsb3Nlc3QsXG4gICAgICBzZXJpZXM6IHRoaXMuZGF0YS5zZXJpZXMubWFwKChkKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFiZWw6IGQubGFiZWwsXG4gICAgICAgICAgdmFsdWU6IGQudmFsdWVzW2Nsb3Nlc3RJbmRleF1cbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgfTtcblxuICAgIHRoaXMudG9vbHRpcEhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhOiB0aGlzLm1vdXNlZGF0YSB9KTsgLy8gaW5kZXggb2YgbGVmdCBjbG9zZXN0IGRhdGVcbiAgfTtcblxuICBtb3VzZXJlY3RNb3VzZU91dCA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnY2lyY2xlJykuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuICAgIHRoaXMudG9vbHRpcExpbmUuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBtb3VzZXJlY3RNb3VzZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy50b29sdGlwQ2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGE6IHRoaXMubW91c2VkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAobm9kZSwgY2xvc2VzdEluZGV4KSA9PiB7XG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgY29uc3QgbW91c2VyZWN0RGltZW5zaW9ucyA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCB0b29sdGlwRGltZW5zaW9ucyA9IHRoaXMudG9vbHRpcC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZGltZW5zaW9uQ2FsY3VsYXRlZCA9IG1vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIHRvb2x0aXBEaW1lbnNpb25zLndpZHRoICsgODtcbiAgICBjb25zdCBjbGllbnRXaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSAxMDtcbiAgICBsZXQgcG9zaXRpb247XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGwsIG1vdXNlcmVjdERpbWVuc2lvbnMsIHRvb2x0aXBPZmZzZXRIZWlnaHQsIHRvb2x0aXBEaW1lbnNpb25zLCBkaW1lbnNpb25DYWxjdWxhdGVkLCBjbGllbnRXaWR0aCk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXInKS5odG1sKChkKSA9PiB7XG4gICAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UodGhpcy5kYXRhLmxhYmVsc1tjbG9zZXN0SW5kZXhdKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb25zdCBoZWFkaW5nID0gdGhpcy5kYXRhLmxhYmVsc1tjbG9zZXN0SW5kZXhdO1xuICAgICAgICByZXR1cm4gdGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdChoZWFkaW5nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubGFiZWxzW2Nsb3Nlc3RJbmRleF07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0QWxsKCcudG9vbHRpcC12YWx1ZScpLmh0bWwoKGQsIGkpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRhLnNlcmllc1tpXS52YWx1ZXNbY2xvc2VzdEluZGV4XTtcblxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUgPyB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCh2YWx1ZSkgOiB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuXG4gICAgLy8gZmxpcCB0aGUgdG9vbHRpcCBwb3NpdGlvbnMgaWYgbmVhciB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgc2NyZWVuXG4gICAgaWYgKGRpbWVuc2lvbkNhbGN1bGF0ZWQgPiBjbGllbnRXaWR0aCkge1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ2Vhc3QnLCB0cnVlKTtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgZmFsc2UpO1xuICAgICAgcG9zaXRpb24gPSBgJHttb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgLSB0b29sdGlwRGltZW5zaW9ucy53aWR0aCAtIDh9cHhgO1xuICAgIH0gZWxzZSBpZiAoZGltZW5zaW9uQ2FsY3VsYXRlZCA8IGNsaWVudFdpZHRoKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIGZhbHNlKTtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgdHJ1ZSk7XG4gICAgICBwb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIDh9cHhgO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdQT1NJVElPTjogJywgcG9zaXRpb24sIG1vdXNlcmVjdERpbWVuc2lvbnMpO1xuXG4gICAgLy8gc2V0IHRoZSB0b29sdGlwIHN0eWxlc1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZShcbiAgICAgICd0b3AnLFxuICAgICAgYCR7bW91c2VyZWN0RGltZW5zaW9ucy50b3AgKyBtb3VzZXJlY3REaW1lbnNpb25zLmhlaWdodCAvIDIgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC8gMiArIHNjcm9sbFsxXX1weGBcbiAgICApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIHBvc2l0aW9uKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSAoaXRlbSkgPT4ge1xuICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShpdGVtKTtcbiAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICAgIC8vIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHlBeGlzRm9ybWF0dGVyID0gKGl0ZW0pID0+IHtcbiAgICByZXR1cm4gdGhpcy55QXhpc0Zvcm1hdChpdGVtKTtcbiAgfTtcbn1cbiJdfQ==
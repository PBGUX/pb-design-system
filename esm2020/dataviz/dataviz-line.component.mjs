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
                this.xAxisScale
                    .domain(d3_extent(this.data.labels, (d) => {
                    return d3_isoParse(d);
                }))
                    .range([0, this.width - this.margin.left - this.margin.right]);
            }
            else if (this.xAxisType === 'number') {
                this.xAxisScale.domain(d3_extent(this.data.labels, (d) => {
                    return d;
                }));
            }
            else {
                this.xAxisScale.domain(this.data.labels);
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
                    .attr('r', (d, i) => {
                    // hide circles if there is no data
                    if (d === null) {
                        return 0;
                    }
                    return this.lineWidth * 2;
                })
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
                    .attr('r', (d, i) => {
                    // hide circles if there is no data
                    if (d === null) {
                        return 0;
                    }
                    return this.lineWidth * 2;
                })
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
                    .attr('cy', (d) => {
                    if (d === null) {
                        return this.yAxisScale(0);
                    }
                    return this.yAxisScale(d);
                })
                    .attr('r', (d, i) => {
                    // hide circles if there is no data
                    if (d === null) {
                        return 0;
                    }
                    return this.lineWidth * 2;
                })), (exit) => exit.remove()), (exit) => exit.remove());
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
            .y((d) => this.yAxisScale(d))
            .defined((d, i) => {
            // console.log(d);
            return d !== null; // only draw line if data is not null
        });
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
                .y1((d, i) => this.yAxisScale(d))
                .defined((d, i) => {
                // console.log(d);
                return d !== null; // only draw line if data is not null
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1saW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0YXZpei9kYXRhdml6LWxpbmUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBRVosV0FBVyxFQUdYLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxPQUFPLElBQUksVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsZUFBZSxJQUFJLGtCQUFrQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ25HLE9BQU8sRUFDTCxZQUFZLElBQUksZUFBZSxFQUMvQixXQUFXLElBQUksY0FBYyxFQUM3QixTQUFTLElBQUksWUFBWSxFQUN6QixVQUFVLElBQUksYUFBYSxFQUM1QixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQ0wsR0FBRyxJQUFJLE1BQU0sRUFDYixHQUFHLElBQUksTUFBTSxFQUNiLE1BQU0sSUFBSSxTQUFTLEVBQ25CLFVBQVUsSUFBSSxhQUFhLEVBQzNCLEtBQUssSUFBSSxRQUFRLEVBQ2pCLE1BQU0sSUFBSSxTQUFTLEVBQ3BCLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDL0UsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDaEQsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsU0FBUyxJQUFJLFlBQVksRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLE1B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QURKLEtBQUs7Z0JBSU4sTUFBTTtzQkFETCxLQUFLO2dCQUlOLElBQUk7c0JBREgsS0FBSztnQkFJTixJQUFJO3NCQURILEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLGlCQUFpQjtzQkFEaEIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4saUJBQWlCO3NCQURoQixLQUFLO2dCQUlOLFVBQVU7c0JBRFQsS0FBSztnQkFJTixjQUFjO3NCQURiLEtBQUs7Z0JBSU4sY0FBYztzQkFEYixLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSztnQkFJTixTQUFTO3NCQURSLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixjQUFjO3NCQURiLEtBQUs7Z0JBSU4scUJBQXFCO3NCQURwQixLQUFLO2dCQUlOLHVCQUF1QjtzQkFEdEIsS0FBSztnQkFJTiwwQkFBMEI7c0JBRHpCLEtBQUs7Z0JBSU4sc0JBQXNCO3NCQURyQixLQUFLO2dCQUlOLHdCQUF3QjtzQkFEdkIsS0FBSztnQkFJTixzQkFBc0I7c0JBRHJCLEtBQUs7Z0JBSU4sd0JBQXdCO3NCQUR2QixLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sWUFBWTtzQkFEWCxLQUFLO2dCQUlOLFVBQVU7c0JBRFQsS0FBSztnQkFJTixLQUFLO3NCQURKLEtBQUs7Z0JBR0csVUFBVTtzQkFBbEIsS0FBSztnQkFHTixPQUFPO3NCQUROLE1BQU07Z0JBSVAsT0FBTztzQkFETixNQUFNO2dCQUlQLGNBQWM7c0JBRGIsTUFBTTtnQkFJUCxjQUFjO3NCQURiLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyLCBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QsIHBvaW50ZXIgYXMgZDNfcG9pbnRlciB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBsaW5lIGFzIGQzX2xpbmUsIGFyZWEgYXMgZDNfYXJlYSwgY3VydmVDYXRtdWxsUm9tIGFzIGQzX2N1cnZlQ2F0bXVsbFJvbSB9IGZyb20gJ2QzLXNoYXBlJztcbmltcG9ydCB7XG4gIHNjYWxlT3JkaW5hbCBhcyBkM19zY2FsZU9yZGluYWwsXG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBzY2FsZVRpbWUgYXMgZDNfc2NhbGVUaW1lLFxuICBzY2FsZVBvaW50IGFzIGQzX3NjYWxlUG9pbnRcbn0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHtcbiAgbWluIGFzIGQzX21pbixcbiAgbWF4IGFzIGQzX21heCxcbiAgZXh0ZW50IGFzIGQzX2V4dGVudCxcbiAgYmlzZWN0TGVmdCBhcyBkM19iaXNlY3RMZWZ0LFxuICByYW5nZSBhcyBkM19yYW5nZSxcbiAgYmlzZWN0IGFzIGQzX2Jpc2VjdFxufSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQgeyBheGlzQm90dG9tIGFzIGQzX2F4aXNCb3R0b20sIGF4aXNMZWZ0IGFzIGQzX2F4aXNMZWZ0IH0gZnJvbSAnZDMtYXhpcyc7XG5pbXBvcnQgeyBmb3JtYXQgYXMgZDNfZm9ybWF0IH0gZnJvbSAnZDMtZm9ybWF0JztcbmltcG9ydCB7IGlzb1BhcnNlIGFzIGQzX2lzb1BhcnNlLCBpc29Gb3JtYXQgYXMgZDNfaXNvRm9ybWF0LCB0aW1lRm9ybWF0IGFzIGQzX3RpbWVGb3JtYXQgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XG5pbXBvcnQgeyBlYXNlUXVhZEluT3V0IGFzIGQzX2Vhc2VRdWFkSW5PdXQgfSBmcm9tICdkMy1lYXNlJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpMaW5lIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG4vLyBhc3NpZ24gYW4gSUQgZm9yIGVhY2ggY29tcG9uZW50IGluc3RhbmNlXG5sZXQgbmV4dElkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWxpbmUnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtbGluZScpXG4gIGxpbmVDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogUGJkc0RhdGF2aXpMaW5lO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzA2O1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbWVkaXVtJyB8ICdoaWdoJyB8ICdkZWJ1ZycgPSAnbWVkaXVtJzsgLy8gZGVidWcgdG8gc2hvdyBhbGwgY2hhcnQgb3B0aW9uc1xuXG4gIEBJbnB1dCgpXG4gIGFyZWEgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB4QXhpc1R5cGU6ICdkYXRlJyB8ICdudW1iZXInIHwgJ3N0cmluZycgPSAnZGF0ZSc7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB4QXhpc1RpY2tzID0gNjtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzVGlja3MgPSA1O1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWluQnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICB5QXhpc01heEJ1ZmZlciA9IDAuMDE7XG5cbiAgQElucHV0KClcbiAgaGlkZVhHcmlkID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBoaWRlWUdyaWQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDEwNSArIDI4OyAvLyBoYXJkY29kZWQgbGVnZW5kIHdpZHRoICsgbGVmdCBtYXJnaW4sIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFBvc2l0aW9uOiAncmlnaHQnIHwgJ2JvdHRvbScgPSAncmlnaHQnO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDEwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAyMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDMwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDU1OyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgdGhlbWU7XG5cbiAgQElucHV0KCkgbGluZUN1cnZlZCA9IHRydWU7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHRvb2x0aXBIb3ZlcmVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBPdXRwdXQoKVxuICB0b29sdGlwQ2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtb3VzZXJlY3Q7XG4gIHByaXZhdGUgdG9vbHRpcExpbmU7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNsaXBQYXRoSWQ7XG4gIHByaXZhdGUgZDNsaW5lO1xuICBwcml2YXRlIGQzYXJlYTtcbiAgcHJpdmF0ZSBsaW5lV2lkdGg7XG4gIHByaXZhdGUgbGluZVBvaW50cztcbiAgcHJpdmF0ZSBjb2xvclJhbmdlO1xuICBwcml2YXRlIHhBeGlzU2NhbGU7XG4gIHByaXZhdGUgeEF4aXNDYWxsO1xuICBwcml2YXRlIHhBeGlzO1xuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xuICBwcml2YXRlIHlBeGlzU2NhbGU7XG4gIHByaXZhdGUgeUF4aXNDYWxsO1xuICBwcml2YXRlIHlBeGlzO1xuICBwcml2YXRlIHlBeGlzRm9ybWF0O1xuICBwcml2YXRlIHhHcmlkO1xuICBwcml2YXRlIHhHcmlkQ2FsbDtcbiAgcHJpdmF0ZSB5R3JpZDtcbiAgcHJpdmF0ZSB5R3JpZENhbGw7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIHlBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXM6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgaGlkZVRvb2x0aXA6IGJvb2xlYW47XG4gIHByaXZhdGUgdG9vbHRpcEhlYWRpbmdGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSBtb3VzZWRhdGE7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZGF0YXZpejogUGJkc0RhdGF2aXpTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyLFxuICAgIHByaXZhdGUgX2xvY2F0aW9uOiBMb2NhdGlvblxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICB0aGlzLmNsaXBQYXRoSWQgPSBuZXh0SWQ7XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMueEF4aXNGb3JtYXQgPVxuICAgICAgdGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJyA/IGQzX3RpbWVGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFN0cmluZykgOiBkM19mb3JtYXQodGhpcy54QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy55QXhpc0Zvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSwgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdCA9XG4gICAgICB0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnXG4gICAgICAgID8gZDNfdGltZUZvcm1hdCh0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0U3RyaW5nKVxuICAgICAgICA6IGQzX2Zvcm1hdCh0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcpO1xuXG4gICAgLy8gZGVmYXVsdHMgZm9yIGFsbCBjaGFydCB0eXBlc1xuICAgIHRoaXMubGluZVdpZHRoID0gMztcbiAgICB0aGlzLmxpbmVQb2ludHMgPSB0cnVlO1xuICAgIHRoaXMuaGlkZVhBeGlzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc1plcm8gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1plcm8gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlVG9vbHRpcCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gZmFsc2U7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnhBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnlBeGlzVGlja1NpemVPdXRlciA9IDA7XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XG4gICAgICAvLyBzZXQgdHlwZSBkZWZhdWx0c1xuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdoaWdoJzpcbiAgICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IDI7XG4gICAgICAgICAgdGhpcy5saW5lQ3VydmVkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5saW5lUG9pbnRzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmhpZGVZR3JpZCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFkanVzdCBtYXJnaW4gaWYgeEF4aXMgaGlkZGVuXG4gICAgaWYgKHRoaXMuaGlkZVhBeGlzKSB0aGlzLm1hcmdpbi5ib3R0b20gPSAxMDsgLy8gbmVlZCBzbWFsbCBtYXJnaW4gZm9yIHlBeGlzIHdpdGggMCB0aWNrIGxhYmVsXG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCAmJiB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICB0aGlzLndpZHRoID0gK3RoaXMud2lkdGggLSArdGhpcy5sZWdlbmRXaWR0aDtcbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgbGluZVxuICAgIHRoaXMuZDNsaW5lID0gZDNfbGluZSgpXG4gICAgICAueCgoZDogYW55LCBpKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkM19pc29QYXJzZSh0aGlzLmRhdGEubGFiZWxzW2ldKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZSh0aGlzLmRhdGEubGFiZWxzW2ldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnkoKGQ6IGFueSkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKVxuICAgICAgLmRlZmluZWQoKGQsIGkpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZCk7XG4gICAgICAgIHJldHVybiBkICE9PSBudWxsOyAvLyBvbmx5IGRyYXcgbGluZSBpZiBkYXRhIGlzIG5vdCBudWxsXG4gICAgICB9KTtcblxuICAgIC8vIGRlZmluZSBsaW5lIGN1cnZlXG4gICAgaWYgKHRoaXMubGluZUN1cnZlZCkge1xuICAgICAgdGhpcy5kM2xpbmUuY3VydmUoZDNfY3VydmVDYXRtdWxsUm9tLmFscGhhKDAuNSkpO1xuICAgIH1cblxuICAgIC8vIGRlZmluZSBhcmVhXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgdGhpcy5kM2FyZWEgPSBkM19hcmVhKClcbiAgICAgICAgLngoKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5sYWJlbHNbaV0pKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZSh0aGlzLmRhdGEubGFiZWxzW2ldKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZSh0aGlzLmRhdGEubGFiZWxzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC55MCh0aGlzLmhlaWdodClcbiAgICAgICAgLnkxKChkOiBhbnksIGkpID0+IHRoaXMueUF4aXNTY2FsZShkKSlcbiAgICAgICAgLmRlZmluZWQoKGQsIGkpID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkKTtcbiAgICAgICAgICByZXR1cm4gZCAhPT0gbnVsbDsgLy8gb25seSBkcmF3IGxpbmUgaWYgZGF0YSBpcyBub3QgbnVsbFxuICAgICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMubGluZUN1cnZlZCkge1xuICAgICAgICB0aGlzLmQzYXJlYS5jdXJ2ZShkM19jdXJ2ZUNhdG11bGxSb20uYWxwaGEoMC41KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHRoZSBjaGFydFxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLnJpZ2h0fSAke1xuICAgICAgICAgICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbVxuICAgICAgICB9YFxuICAgICAgKTtcblxuICAgIC8vIGFkZCByZWN0YW5nbGUgdG8gY2FwdHVyZSBtb3VzZVxuICAgIHRoaXMubW91c2VyZWN0ID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdtb3VzZXJlY3QnKVxuICAgICAgLm9uKCdtb3VzZW1vdmUnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubW91c2VyZWN0TW91c2VNb3ZlKGV2ZW50LCBkYXRhKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubW91c2VyZWN0TW91c2VPdXQoZXZlbnQsIGRhdGEpKVxuICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4gdGhpcy5tb3VzZXJlY3RNb3VzZUNsaWNrKGV2ZW50KSk7XG5cbiAgICB0aGlzLnRvb2x0aXBMaW5lID0gdGhpcy5zdmcuYXBwZW5kKCdsaW5lJykuYXR0cigneTEnLCAwKS5hdHRyKCd5MicsIHRoaXMuaGVpZ2h0KS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWxpbmUnKTtcblxuICAgIC8vIGRlZmluZSBjb2xvciByYW5nZVxuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpLnJhbmdlKHRoaXMuX2RhdGF2aXouZ2V0Q29sb3JzKGZhbHNlLCB0aGlzLnRoZW1lKSk7XG5cbiAgICAvLyBhZGQgZ2xvdyBkZWZcbiAgICB0aGlzLl9kYXRhdml6LmNyZWF0ZUdsb3dGaWx0ZXIodGhpcy5zdmcpO1xuXG4gICAgLy8gWCBBWElTXG4gICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlVGltZSgpXG4gICAgICAgIC5kb21haW4oXG4gICAgICAgICAgZDNfZXh0ZW50KHRoaXMuZGF0YS5sYWJlbHMsIChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkM19pc29QYXJzZShkKTtcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAgIC5kb21haW4oXG4gICAgICAgICAgZDNfZXh0ZW50KHRoaXMuZGF0YS5sYWJlbHMsIChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICAgLnJhbmdlKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlUG9pbnQoKVxuICAgICAgICAuZG9tYWluKHRoaXMuZGF0YS5sYWJlbHMpXG4gICAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAgIC8vIC50aWNrcygrdGhpcy54QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUodGhpcy54QXhpc1RpY2tTaXplKVxuICAgICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcilcbiAgICAgICAgLnRpY2tWYWx1ZXMoXG4gICAgICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbigpLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kMy9kMy1zY2FsZS9pc3N1ZXMvMTgyXG4gICAgICAgICAgICAvLyBkMyBjYW5ub3QgZGV0ZXJtaW5lIG51bWJlciBvZiBzdHJpbmdzIHRvIHNob3cgb24geGF4aXMgd2l0aCBzY2FsZVBvaW50KClcbiAgICAgICAgICAgIHJldHVybiBpICUgdGhpcy54QXhpc1RpY2tzID09PSAwO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrcygrdGhpcy54QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUodGhpcy54QXhpc1RpY2tTaXplKVxuICAgICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XG4gICAgfVxuXG4gICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKSAvLyR7LXRoaXMubWFyZ2luLnJpZ2h0IC8gMn1cbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgLy8gWCBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAgICAgLnRpY2tTaXplKC10aGlzLmhlaWdodClcbiAgICAgICAgICAudGlja1ZhbHVlcyhcbiAgICAgICAgICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4oKS5maWx0ZXIoKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kMy9kMy1zY2FsZS9pc3N1ZXMvMTgyXG4gICAgICAgICAgICAgIC8vIGQzIGNhbm5vdCBkZXRlcm1pbmUgbnVtYmVyIG9mIHN0cmluZ3MgdG8gc2hvdyBvbiB4YXhpcyB3aXRoIHNjYWxlUG9pbnQoKVxuICAgICAgICAgICAgICByZXR1cm4gaSAlIHRoaXMueEF4aXNUaWNrcyA9PT0gMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpLnRpY2tTaXplKC10aGlzLmhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMueEdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApIC8vJHstdGhpcy5tYXJnaW4ucmlnaHQgLyAyfVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gWSBBWElTXG4gICAgdGhpcy55QXhpc1NjYWxlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbXG4gICAgICAgIGQzX21pbih0aGlzLmRhdGEuc2VyaWVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWluVmFsID0gK2QzX21pbihkLnZhbHVlcyk7XG4gICAgICAgICAgcmV0dXJuIG1pblZhbCAtIG1pblZhbCAqICt0aGlzLnlBeGlzTWluQnVmZmVyO1xuICAgICAgICB9KSxcbiAgICAgICAgZDNfbWF4KHRoaXMuZGF0YS5zZXJpZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBtYXhWYWwgPSArZDNfbWF4KGQudmFsdWVzKTtcbiAgICAgICAgICByZXR1cm4gbWF4VmFsICsgbWF4VmFsICogdGhpcy55QXhpc01heEJ1ZmZlcjtcbiAgICAgICAgfSlcbiAgICAgIF0pXG4gICAgICAubmljZSgpXG4gICAgICAucmFuZ2UoW3RoaXMuaGVpZ2h0LCAwXSk7XG5cbiAgICB0aGlzLnlBeGlzQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAudGlja1NpemUodGhpcy55QXhpc1RpY2tTaXplKVxuICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy55QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAudGlja0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0dGVyKTtcblxuICAgIHRoaXMueUF4aXMgPSB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXknKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXMpXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc0RvbWFpbilcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzVGlja3MpXG4gICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyBZIEdSSURMSU5FU1xuICAgIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcbiAgICAgIHRoaXMueUdyaWRDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUoLXRoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHQpO1xuXG4gICAgICB0aGlzLnlHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteScpXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAwKWApXG4gICAgICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBUT09MVElQXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBkM19zZWxlY3QoJ2JvZHknKVxuICAgICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAncGJkcy10b29sdGlwIHdlc3QnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcblxuICAgICAgLy8gdG9vbHRpcCBoZWFkZXJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XG5cbiAgICAgIC8vIHRvb2x0aXAgdGFibGVcbiAgICAgIGNvbnN0IHRvb2x0aXBUYWJsZSA9IHRoaXMudG9vbHRpcC5hcHBlbmQoJ3RhYmxlJykuYXR0cignY2xhc3MnLCAndG9vbHRpcC10YWJsZSB0ZXh0LWxlZnQgdy0xMDAnKTtcblxuICAgICAgY29uc3QgdG9vbHRpcFRhYmxlVGJvZHkgPSB0b29sdGlwVGFibGUuYXBwZW5kKCd0Ym9keScpO1xuXG4gICAgICB0b29sdGlwVGFibGVUYm9keVxuICAgICAgICAuc2VsZWN0QWxsKCd0cicpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgICAgLmpvaW4oKGVudGVyKSA9PiBlbnRlci5hcHBlbmQoJ3RyJykpO1xuICAgIH1cblxuICAgIC8vIGFkZCBsZWdlbmQgY2xhc3Nlc1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xuICAgIH1cblxuICAgIC8vIGFkZCBjbGlwIHBhdGggZm9yIGxpbmUgYW5pbWF0aW9uXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2NsaXBQYXRoJylcbiAgICAgIC5hdHRyKCdpZCcsIGBjbGlwLXBhdGgtJHt0aGlzLmNsaXBQYXRoSWR9YClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggLSArdGhpcy5tYXJnaW4ubGVmdCAtICt0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQpO1xuXG4gICAgLy8gYWRkIGNsaXAgcGF0aCBmb3IgcG9pbnRzIGFuaW1hdGlvblxuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdjbGlwUGF0aCcpXG4gICAgICAuYXR0cignaWQnLCBgY2xpcC1wYXRoLXBvaW50cy0ke3RoaXMuY2xpcFBhdGhJZH1gKVxuICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aCArICt0aGlzLm1hcmdpbi5sZWZ0IC0gK3RoaXMubWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKC0ke3RoaXMubWFyZ2luLmxlZnR9LCAwKWApO1xuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuXG4gICAgbmV4dElkKys7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgdGhpcy5tb3VzZXJlY3QuZGF0YSh0aGlzLmRhdGEpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSB4U2NhbGVcbiAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgdGhpcy54QXhpc1NjYWxlXG4gICAgICAgIC5kb21haW4oXG4gICAgICAgICAgZDNfZXh0ZW50KHRoaXMuZGF0YS5sYWJlbHMsIChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkM19pc29QYXJzZShkKTtcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnhBeGlzU2NhbGUuZG9tYWluKFxuICAgICAgICBkM19leHRlbnQodGhpcy5kYXRhLmxhYmVscywgKGQ6IGFueSkgPT4ge1xuICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbih0aGlzLmRhdGEubGFiZWxzKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdGhlIHlTY2FsZVxuICAgIHRoaXMueUF4aXNTY2FsZVxuICAgICAgLmRvbWFpbihbXG4gICAgICAgIGQzX21pbih0aGlzLmRhdGEuc2VyaWVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWluVmFsID0gK2QzX21pbihkLnZhbHVlcyk7XG4gICAgICAgICAgcmV0dXJuIG1pblZhbCAtIG1pblZhbCAqICt0aGlzLnlBeGlzTWluQnVmZmVyO1xuICAgICAgICB9KSxcbiAgICAgICAgZDNfbWF4KHRoaXMuZGF0YS5zZXJpZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBtYXhWYWwgPSArZDNfbWF4KGQudmFsdWVzKTtcbiAgICAgICAgICByZXR1cm4gbWF4VmFsICsgbWF4VmFsICogdGhpcy55QXhpc01heEJ1ZmZlcjtcbiAgICAgICAgfSlcbiAgICAgIF0pXG4gICAgICAubmljZSgpO1xuXG4gICAgdGhpcy54QXhpcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICB0aGlzLnlBeGlzLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgZ3JpZHNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XG4gICAgICB0aGlzLnlHcmlkLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBsaW5lc1xuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoLmxpbmUnKVxuICAgICAgLmF0dHIoJ2ZpbHRlcicsICgpID0+XG4gICAgICAgIHRoaXMudHlwZSAhPT0gJ2hpZ2gnID8gYHVybCgke3RoaXMuX2xvY2F0aW9uLnByZXBhcmVFeHRlcm5hbFVybCh0aGlzLl9sb2NhdGlvbi5wYXRoKCkpfSNnbG93KWAgOiBudWxsXG4gICAgICApXG4gICAgICAuZGF0YSh0aGlzLmRhdGEuc2VyaWVzKVxuICAgICAgLmpvaW4oXG4gICAgICAgIChlbnRlcikgPT4ge1xuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5hdHRyKFxuICAgICAgICAgICAgICAnY2xpcC1wYXRoJyxcbiAgICAgICAgICAgICAgYHVybCgke3RoaXMuX2xvY2F0aW9uLnByZXBhcmVFeHRlcm5hbFVybCh0aGlzLl9sb2NhdGlvbi5wYXRoKCkpfSNjbGlwLXBhdGgtJHt0aGlzLmNsaXBQYXRoSWR9KWBcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lJylcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy5saW5lV2lkdGgpXG4gICAgICAgICAgICAuYXR0cignZCcsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gbmV3IEFycmF5KGRhdGEudmFsdWVzLmxlbmd0aCkuZmlsbCgwKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZDNsaW5lKGFycmF5KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2FsbCgoZW50ZXIpID0+XG4gICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZGF0YSkgPT4gdGhpcy5kM2xpbmUoZGF0YS52YWx1ZXMpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICB1cGRhdGUuY2FsbCgodXBkYXRlKSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpID0+IHRoaXMuZDNsaW5lKGQudmFsdWVzKSlcbiAgICAgICAgICApLFxuICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgKTtcblxuICAgIC8vIGFyZWFcbiAgICBpZiAodGhpcy5hcmVhKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCdwYXRoLmFyZWEnKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEuc2VyaWVzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgICAgLmF0dHIoXG4gICAgICAgICAgICAgICAgJ2NsaXAtcGF0aCcsXG4gICAgICAgICAgICAgICAgYHVybCgke3RoaXMuX2xvY2F0aW9uLnByZXBhcmVFeHRlcm5hbFVybCh0aGlzLl9sb2NhdGlvbi5wYXRoKCkpfSNjbGlwLXBhdGgtJHt0aGlzLmNsaXBQYXRoSWR9KWBcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYXJlYScpXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJheSA9IG5ldyBBcnJheShkYXRhLnZhbHVlcy5sZW5ndGgpLmZpbGwoMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZDNhcmVhKGFycmF5KTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnN0eWxlKCdjb2xvcicsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG4gICAgICAgICAgICAgIC5jYWxsKChlbnRlcikgPT5cbiAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZGF0YSkgPT4gdGhpcy5kM2FyZWEoZGF0YS52YWx1ZXMpKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgICB1cGRhdGUuY2FsbCgodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB1cGRhdGVcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgICAuYXR0cignZCcsIChkKSA9PiB0aGlzLmQzYXJlYShkLnZhbHVlcykpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBjaXJjbGVzXG4gICAgaWYgKHRoaXMubGluZVBvaW50cykge1xuICAgICAgLy8gYWRkIHBvaW50c1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnZy5wb2ludHMnKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEuc2VyaWVzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BvaW50cycpXG4gICAgICAgICAgICAgIC5hdHRyKFxuICAgICAgICAgICAgICAgICdjbGlwLXBhdGgnLFxuICAgICAgICAgICAgICAgIGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wcmVwYXJlRXh0ZXJuYWxVcmwodGhpcy5fbG9jYXRpb24ucGF0aCgpKX0jY2xpcC1wYXRoLXBvaW50cy0ke3RoaXMuY2xpcFBhdGhJZH0pYFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdHlsZSgnY29sb3InLCAoZCwgaSkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuXG4gICAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgICAgICAgIC5kYXRhKChkKSA9PiBkLnZhbHVlcylcbiAgICAgICAgICAgICAgLmpvaW4oXG4gICAgICAgICAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkM19pc29QYXJzZSh0aGlzLmRhdGEubGFiZWxzW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUodGhpcy5kYXRhLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKDApKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigncicsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gaGlkZSBjaXJjbGVzIGlmIHRoZXJlIGlzIG5vIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZVdpZHRoICogMjtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLmxpbmVXaWR0aClcbiAgICAgICAgICAgICAgICAgICAgLmNhbGwoKGVudGVyKSA9PlxuICAgICAgICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICgpID0+IHt9LFxuICAgICAgICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgICAgICAgICAuZGF0YSgoZCkgPT4gZC52YWx1ZXMpXG4gICAgICAgICAgICAgIC5qb2luKFxuICAgICAgICAgICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmxhYmVsc1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpID0+IHRoaXMueUF4aXNTY2FsZShkKSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3InLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIGhpZGUgY2lyY2xlcyBpZiB0aGVyZSBpcyBubyBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxpbmVXaWR0aCAqIDI7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy5saW5lV2lkdGgpLFxuICAgICAgICAgICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgICAgICAgICB1cGRhdGUuY2FsbCgodXBkYXRlKSA9PlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkM19pc29QYXJzZSh0aGlzLmRhdGEubGFiZWxzW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnlBeGlzU2NhbGUoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnlBeGlzU2NhbGUoZCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAuYXR0cigncicsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoaWRlIGNpcmNsZXMgaWYgdGhlcmUgaXMgbm8gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxpbmVXaWR0aCAqIDI7XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0XG4gICAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEuc2VyaWVzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZW50ZXIuYXBwZW5kKCdsaScpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJyk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKVxuICAgICAgICAgICAgICAuaHRtbCgoZCkgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1sYWJlbCcpLmh0bWwoKGQpID0+IHtcbiAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmxhYmVsKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChldmVudCwgZGF0YSkgPT4gdGhpcy5sZWdlbmRNb3VzZU92ZXIoZXZlbnQsIGRhdGEpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4gdGhpcy5sZWdlbmRNb3VzZU91dCgpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmxlZ2VuZE1vdXNlQ2xpY2soZXZlbnQsIGRhdGEpKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcFxuICAgICAgICAuc2VsZWN0KCcudG9vbHRpcC10YWJsZScpXG4gICAgICAgIC5zZWxlY3RBbGwoJ3RyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgKGVudGVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b29sdGlwSXRlbSA9IGVudGVyLmFwcGVuZCgndHInKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWl0ZW0nKTtcblxuICAgICAgICAgICAgdG9vbHRpcEl0ZW1cbiAgICAgICAgICAgICAgLmFwcGVuZCgndGQnKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2NvbG9yJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSlcbiAgICAgICAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAta2V5Jyk7XG5cbiAgICAgICAgICAgIHRvb2x0aXBJdGVtXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3RkJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtbGFiZWwgcHItMiB0ZXh0LW5vd3JhcCcpXG4gICAgICAgICAgICAgIC5odG1sKChkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSA/IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGQubGFiZWwpIDogZC5sYWJlbDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRvb2x0aXBJdGVtXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3RkJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdmFsdWUgdGV4dC1yaWdodCB0ZXh0LW5vd3JhcCcpXG4gICAgICAgICAgICAgIC5odG1sKChkKSA9PiAnJyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0b29sdGlwSXRlbTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICh1cGRhdGUpID0+IHtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgdG9vbHRpcCBsYWJlbCB0ZXh0XG4gICAgICAgICAgICBjb25zdCB0b29sdGlwTGFiZWwgPSB1cGRhdGUuc2VsZWN0KCcudG9vbHRpcC1sYWJlbCcpO1xuXG4gICAgICAgICAgICB0b29sdGlwTGFiZWwuaHRtbCgoZCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlID8gdGhpcy50b29sdGlwTGFiZWxGb3JtYXQoZC5sYWJlbCkgOiBkLmxhYmVsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLnBvaW50cycpLnJhaXNlKCk7XG4gICAgdGhpcy5tb3VzZXJlY3QucmFpc2UoKTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhLCB0aGlzLmxpbmVQb2ludHMpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIGQubGFiZWwgIT09IGRhdGEubGFiZWw7XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgnLmxpbmUnKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gZC5sYWJlbCAhPT0gZGF0YS5sYWJlbDtcbiAgICAgIH0pXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIGlmICh0aGlzLmFyZWEpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5hcmVhJylcbiAgICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICAgIHJldHVybiBkLmxhYmVsICE9PSBkYXRhLmxhYmVsO1xuICAgICAgICB9KVxuICAgICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5saW5lUG9pbnRzKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcucG9pbnRzJylcbiAgICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICAgIHJldHVybiBkLmxhYmVsICE9PSBkYXRhLmxhYmVsO1xuICAgICAgICB9KVxuICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcbiAgICB9XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGluZScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcblxuICAgIGlmICh0aGlzLmxpbmVQb2ludHMpIHtcbiAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnY2lyY2xlJykuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFyZWEpIHtcbiAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmFyZWEnKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbW91c2VyZWN0TW91c2VNb3ZlID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgbGV0IG1vdXNlWDsgLy8gbW91c2UgeCBwb3NpdGlvblxuICAgIGxldCBsb3dlcjtcbiAgICBsZXQgdXBwZXI7XG4gICAgbGV0IGNsb3Nlc3Q7XG4gICAgbGV0IGNsb3Nlc3RJbmRleDtcblxuICAgIGxldCBsZWZ0SW5kZXggPSAwO1xuXG4gICAgLy8gaGFuZGxlIHN0cmluZyB0eXBlLCBubyBpbnZlcnQgZnVuY3Rpb24gb24gc2NhbGVQb2ludFxuICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG1vdXNlWCA9IGQzX3BvaW50ZXIoZXZlbnQpWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb3VzZVggPSB0aGlzLnhBeGlzU2NhbGUuaW52ZXJ0KGQzX3BvaW50ZXIoZXZlbnQpWzBdKTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhtb3VzZVgpO1xuXG4gICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgIGxlZnRJbmRleCA9IGQzX2Jpc2VjdExlZnQodGhpcy5kYXRhLmxhYmVscywgZDNfaXNvRm9ybWF0KG1vdXNlWCkpO1xuXG4gICAgICAvLyBwcmV2ZW50IGVycm9yIGZvciAwIGluZGV4XG4gICAgICBpZiAobGVmdEluZGV4ID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGxvd2VyID0gbmV3IERhdGUodGhpcy5kYXRhLmxhYmVsc1tsZWZ0SW5kZXggLSAxXSk7XG4gICAgICB1cHBlciA9IG5ldyBEYXRlKHRoaXMuZGF0YS5sYWJlbHNbbGVmdEluZGV4XSk7XG4gICAgICBjbG9zZXN0ID0gK21vdXNlWCAtICtsb3dlciA+ICt1cHBlciAtIG1vdXNlWCA/IHVwcGVyIDogbG93ZXI7IC8vIGRhdGUgbW91c2UgaXMgY2xvc2VzdCB0b1xuICAgICAgY2xvc2VzdEluZGV4ID0gdGhpcy5kYXRhLmxhYmVscy5pbmRleE9mKGQzX2lzb0Zvcm1hdChjbG9zZXN0KSk7IC8vIHdoaWNoIGluZGV4IHRoZSBtb3VzZSBpcyBjbG9zZXN0IHRvXG4gICAgICAvLyBjb25zb2xlLmxvZygrbW91c2VYRGF0ZSwgbGVmdEluZGV4LCArZGF0ZUxvd2VyLCArZGF0ZVVwcGVyLCArY2xvc2VzdERhdGUsIGNsb3Nlc3RJbmRleCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGxlZnRJbmRleCA9IGQzX2Jpc2VjdExlZnQodGhpcy5kYXRhLmxhYmVscywgbW91c2VYKTtcblxuICAgICAgLy8gcHJldmVudCBlcnJvciBmb3IgMCBpbmRleFxuICAgICAgaWYgKGxlZnRJbmRleCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBsb3dlciA9IHRoaXMuZGF0YS5sYWJlbHNbbGVmdEluZGV4IC0gMV07XG4gICAgICB1cHBlciA9IHRoaXMuZGF0YS5sYWJlbHNbbGVmdEluZGV4XTtcbiAgICAgIGNsb3Nlc3QgPSArbW91c2VYIC0gK2xvd2VyID4gK3VwcGVyIC0gbW91c2VYID8gdXBwZXIgOiBsb3dlcjsgLy8gZGF0ZSBtb3VzZSBpcyBjbG9zZXN0IHRvXG4gICAgICBjbG9zZXN0SW5kZXggPSB0aGlzLmRhdGEubGFiZWxzLmluZGV4T2YoY2xvc2VzdCk7IC8vIHdoaWNoIGluZGV4IHRoZSBtb3VzZSBpcyBjbG9zZXN0IHRvXG4gICAgICAvLyBjb25zb2xlLmxvZygrbW91c2VYRGF0ZSwgbGVmdEluZGV4LCArbG93ZXIsICt1cHBlciwgK2Nsb3Nlc3QsIGNsb3Nlc3RJbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IHRoaXMueEF4aXNTY2FsZS5kb21haW4oKTtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy54QXhpc1NjYWxlLnJhbmdlKCk7XG4gICAgICBjb25zdCByYW5nZVBvaW50cyA9IGQzX3JhbmdlKHJhbmdlWzBdLCByYW5nZVsxXSwgdGhpcy54QXhpc1NjYWxlLnN0ZXAoKSk7XG4gICAgICByYW5nZVBvaW50cy5wdXNoKHJhbmdlWzFdKTtcblxuICAgICAgbGVmdEluZGV4ID0gZDNfYmlzZWN0KHJhbmdlUG9pbnRzLCBtb3VzZVgpO1xuXG4gICAgICBpZiAobGVmdEluZGV4ID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGxvd2VyID0gcmFuZ2VQb2ludHNbbGVmdEluZGV4IC0gMV07XG4gICAgICB1cHBlciA9IHJhbmdlUG9pbnRzW2xlZnRJbmRleF07XG4gICAgICBjbG9zZXN0ID0gK21vdXNlWCAtICtsb3dlciA+ICt1cHBlciAtIG1vdXNlWCA/ICt1cHBlciA6ICtsb3dlcjtcblxuICAgICAgY29uc3QgcmFuZ2VJbmRleCA9IHJhbmdlUG9pbnRzLmluZGV4T2YoY2xvc2VzdCk7XG4gICAgICBjbG9zZXN0ID0gZG9tYWluW3JhbmdlSW5kZXhdO1xuXG4gICAgICBjbG9zZXN0SW5kZXggPSB0aGlzLmRhdGEubGFiZWxzLmluZGV4T2YoZG9tYWluW3JhbmdlSW5kZXhdKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaXJjbGVzID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcubGluZS1ncm91cCcpLnNlbGVjdEFsbCgnY2lyY2xlJyk7XG4gICAgY2lyY2xlcy5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGNsb3Nlc3RJbmRleCkuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG4gICAgY2lyY2xlcy5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGNsb3Nlc3RJbmRleCkuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy50b29sdGlwTGluZS5hdHRyKCd4MScsIHRoaXMueEF4aXNTY2FsZShjbG9zZXN0KSkuYXR0cigneDInLCB0aGlzLnhBeGlzU2NhbGUoY2xvc2VzdCkpLmNsYXNzZWQoJ2FjdGl2ZScsIHRydWUpO1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy50b29sdGlwTGluZS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpKTtcbiAgICB0aGlzLnRvb2x0aXBTaG93KHRoaXMudG9vbHRpcExpbmUubm9kZSgpLCBjbG9zZXN0SW5kZXgpO1xuXG4gICAgdGhpcy5tb3VzZWRhdGEgPSB7XG4gICAgICBsYWJlbDogY2xvc2VzdCxcbiAgICAgIHNlcmllczogdGhpcy5kYXRhLnNlcmllcy5tYXAoKGQpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsYWJlbDogZC5sYWJlbCxcbiAgICAgICAgICB2YWx1ZTogZC52YWx1ZXNbY2xvc2VzdEluZGV4XVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICB9O1xuXG4gICAgdGhpcy50b29sdGlwSG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGE6IHRoaXMubW91c2VkYXRhIH0pOyAvLyBpbmRleCBvZiBsZWZ0IGNsb3Nlc3QgZGF0ZVxuICB9O1xuXG4gIG1vdXNlcmVjdE1vdXNlT3V0ID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5zdmcuc2VsZWN0QWxsKCdjaXJjbGUnKS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG4gICAgdGhpcy50b29sdGlwTGluZS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIG1vdXNlcmVjdE1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBDbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YTogdGhpcy5tb3VzZWRhdGEgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChub2RlLCBjbG9zZXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBjb25zdCBtb3VzZXJlY3REaW1lbnNpb25zID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHRvb2x0aXBEaW1lbnNpb25zID0gdGhpcy50b29sdGlwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkaW1lbnNpb25DYWxjdWxhdGVkID0gbW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgdG9vbHRpcERpbWVuc2lvbnMud2lkdGggKyA4O1xuICAgIGNvbnN0IGNsaWVudFdpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIDEwO1xuICAgIGxldCBwb3NpdGlvbjtcblxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbCwgbW91c2VyZWN0RGltZW5zaW9ucywgdG9vbHRpcE9mZnNldEhlaWdodCwgdG9vbHRpcERpbWVuc2lvbnMsIGRpbWVuc2lvbkNhbGN1bGF0ZWQsIGNsaWVudFdpZHRoKTtcblxuICAgIHRoaXMudG9vbHRpcC5zZWxlY3QoJy50b29sdGlwLWhlYWRlcicpLmh0bWwoKGQpID0+IHtcbiAgICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZSh0aGlzLmRhdGEubGFiZWxzW2Nsb3Nlc3RJbmRleF0pO1xuICAgICAgICByZXR1cm4gdGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdChwYXJzZWRUaW1lKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbnN0IGhlYWRpbmcgPSB0aGlzLmRhdGEubGFiZWxzW2Nsb3Nlc3RJbmRleF07XG4gICAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0KGhlYWRpbmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sYWJlbHNbY2xvc2VzdEluZGV4XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMudG9vbHRpcC5zZWxlY3RBbGwoJy50b29sdGlwLXZhbHVlJykuaHRtbCgoZCwgaSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGEuc2VyaWVzW2ldLnZhbHVlc1tjbG9zZXN0SW5kZXhdO1xuXG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSA/IHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0KHZhbHVlKSA6IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG5cbiAgICAvLyBmbGlwIHRoZSB0b29sdGlwIHBvc2l0aW9ucyBpZiBuZWFyIHRoZSByaWdodCBlZGdlIG9mIHRoZSBzY3JlZW5cbiAgICBpZiAoZGltZW5zaW9uQ2FsY3VsYXRlZCA+IGNsaWVudFdpZHRoKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIHRydWUpO1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3dlc3QnLCBmYWxzZSk7XG4gICAgICBwb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCAtIHRvb2x0aXBEaW1lbnNpb25zLndpZHRoIC0gOH1weGA7XG4gICAgfSBlbHNlIGlmIChkaW1lbnNpb25DYWxjdWxhdGVkIDwgY2xpZW50V2lkdGgpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdlYXN0JywgZmFsc2UpO1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3dlc3QnLCB0cnVlKTtcbiAgICAgIHBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgOH1weGA7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ1BPU0lUSU9OOiAnLCBwb3NpdGlvbiwgbW91c2VyZWN0RGltZW5zaW9ucyk7XG5cbiAgICAvLyBzZXQgdGhlIHRvb2x0aXAgc3R5bGVzXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKFxuICAgICAgJ3RvcCcsXG4gICAgICBgJHttb3VzZXJlY3REaW1lbnNpb25zLnRvcCArIG1vdXNlcmVjdERpbWVuc2lvbnMuaGVpZ2h0IC8gMiAtIHRvb2x0aXBPZmZzZXRIZWlnaHQgLyAyICsgc2Nyb2xsWzFdfXB4YFxuICAgICk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgcG9zaXRpb24pO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdHRlciA9IChpdGVtKSA9PiB7XG4gICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQocGFyc2VEYXRlKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQoaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpdGVtO1xuICAgICAgLy8gcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQoaXRlbSk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgeUF4aXNGb3JtYXR0ZXIgPSAoaXRlbSkgPT4ge1xuICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KGl0ZW0pO1xuICB9O1xufVxuIl19
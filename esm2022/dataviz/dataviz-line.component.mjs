import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, } from '@angular/core';
import { bisect as d3_bisect, bisectRight as d3_bisectRight, extent as d3_extent, max as d3_max, min as d3_min, range as d3_range, } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { easeQuadInOut as d3_easeQuadInOut } from 'd3-ease';
import { format as d3_format } from 'd3-format';
import { scaleLinear as d3_scaleLinear, scaleOrdinal as d3_scaleOrdinal, scalePoint as d3_scalePoint, scaleTime as d3_scaleTime, } from 'd3-scale';
import { pointer as d3_pointer, select as d3_select } from 'd3-selection';
import { area as d3_area, curveCatmullRom as d3_curveCatmullRom, line as d3_line } from 'd3-shape';
import { isoFormat as d3_isoFormat, isoParse as d3_isoParse, timeFormat as d3_timeFormat } from 'd3-time-format';
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
        this.xAxisTitle = null;
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
        this.tooltipHeadingSuffix = '';
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.marginTop = 10; // hardcoded on purpose, do not document until feedback
        this.marginRight = 20; // hardcoded on purpose, do not document until feedback
        this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
        this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
        this.customColor = false;
        this.colorsArray = [];
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
                }),
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
                        .attr('class', 'tooltip-label pe-2 text-nowrap')
                        .html((d) => {
                        return this.tooltipLabelFormatType ? this.tooltipLabelFormat(d.label) : d.label;
                    });
                    tooltipItem
                        .append('td')
                        .attr('class', 'tooltip-value text-end text-nowrap')
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
            if (this.xAxisType === 'date') {
                leftIndex = d3_bisectRight(this.data.labels, d3_isoFormat(mouseX));
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
                leftIndex = d3_bisectRight(this.data.labels, mouseX);
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
                label: this.xAxisType === 'date' ? new Date(closest).toISOString() : closest,
                series: this.data.series.map((d) => {
                    return {
                        label: d.label,
                        value: d.values[closestIndex],
                    };
                }),
            };
            this.tooltipHovered.emit({ event, data: this.mousedata }); // index of left closest date
        };
        this.mouserectMouseOut = (event, data) => {
            this.svg.selectAll('circle').classed('active', false);
            this.tooltipLine.classed('active', false);
            this.tooltipHide();
        };
        this.mouserectMouseClick = (event) => {
            this.clicked.emit({ event, data: this.mousedata });
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
                    return `${this.tooltipHeadingFormat(parsedTime)}${this.tooltipHeadingSuffix}`;
                }
                else if (this.xAxisType === 'number') {
                    const heading = this.data.labels[closestIndex];
                    return `${this.tooltipHeadingFormat(heading)}${this.tooltipHeadingSuffix}`;
                }
                else {
                    return `${this.data.labels[closestIndex]}${this.tooltipHeadingSuffix}`;
                }
            });
            this.tooltip.selectAll('.tooltip-value').html((d, i) => {
                const value = this.data.series[i].values[closestIndex];
                if (value === null || value === undefined) {
                    return '';
                }
                return this.tooltipValueFormatType ? this.tooltipValueFormat(value) : value;
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
            left: +this.marginLeft,
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
        this.xAxisTitleMargin = this.xAxisTitle ? 30 : 0;
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
            .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin}`);
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
        const colors = this.customColor ? this.colorsArray : this._dataviz.getColors(false, this.theme);
        this.colorRange = d3_scaleOrdinal().range(colors);
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
        // X AXIS TITLE
        if (this.xAxisTitle) {
            this.svg
                .append('text')
                .attr('class', 'axis-title')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${this.svg.attr('width') / 2 - this.margin.left / 2 - this.margin.right / 2}, ${this.height + this.margin.top + (this.hideXAxis ? 20 : 40)})`)
                // .attr('x', this.width / 2 - this.margin.left - this.margin.right)
                // .attr('y', this.height + this.margin.top + (this.hideXAxis ? 25 : 50))
                .text(this.xAxisTitle);
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
            }),
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
            const tooltipTable = this.tooltip.append('table').attr('class', 'tooltip-table text-start w-100');
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizLineComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: PbdsDatavizLineComponent, selector: "pbds-dataviz-line", inputs: { data: "data", width: "width", height: "height", type: "type", area: "area", xAxisType: "xAxisType", xAxisFormatString: "xAxisFormatString", xAxisTicks: "xAxisTicks", xAxisTitle: "xAxisTitle", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", yAxisMinBuffer: "yAxisMinBuffer", yAxisMaxBuffer: "yAxisMaxBuffer", hideXGrid: "hideXGrid", hideYGrid: "hideYGrid", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", tooltipHeadingFormatString: "tooltipHeadingFormatString", tooltipHeadingSuffix: "tooltipHeadingSuffix", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", theme: "theme", customColor: "customColor", colorsArray: "colorsArray", lineCurved: "lineCurved" }, outputs: { hovered: "hovered", clicked: "clicked", tooltipHovered: "tooltipHovered", tooltipClicked: "tooltipClicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-line": "this.lineClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizLineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-line', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
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
            }], xAxisTitle: [{
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
            }], tooltipHeadingSuffix: [{
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
            }], customColor: [{
                type: Input
            }], colorsArray: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1saW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0YXZpei9kYXRhdml6LWxpbmUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixXQUFXLEVBQ1gsS0FBSyxFQUlMLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQ0wsTUFBTSxJQUFJLFNBQVMsRUFDbkIsV0FBVyxJQUFJLGNBQWMsRUFDN0IsTUFBTSxJQUFJLFNBQVMsRUFDbkIsR0FBRyxJQUFJLE1BQU0sRUFDYixHQUFHLElBQUksTUFBTSxFQUNiLEtBQUssSUFBSSxRQUFRLEdBQ2xCLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDL0UsT0FBTyxFQUFFLGFBQWEsSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUM1RCxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNoRCxPQUFPLEVBQ0wsV0FBVyxJQUFJLGNBQWMsRUFDN0IsWUFBWSxJQUFJLGVBQWUsRUFDL0IsVUFBVSxJQUFJLGFBQWEsRUFDM0IsU0FBUyxJQUFJLFlBQVksR0FDMUIsTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUFFLE9BQU8sSUFBSSxVQUFVLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxlQUFlLElBQUksa0JBQWtCLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNuRyxPQUFPLEVBQUUsU0FBUyxJQUFJ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Y0FBYztzQkFEYixNQUFNO2dCQUlQLGNBQWM7c0JBRGIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBMb2NhdGlvbiwgVmlld3BvcnRTY3JvbGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7XG4gIGJpc2VjdCBhcyBkM19iaXNlY3QsXG4gIGJpc2VjdFJpZ2h0IGFzIGQzX2Jpc2VjdFJpZ2h0LFxuICBleHRlbnQgYXMgZDNfZXh0ZW50LFxuICBtYXggYXMgZDNfbWF4LFxuICBtaW4gYXMgZDNfbWluLFxuICByYW5nZSBhcyBkM19yYW5nZSxcbn0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHsgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLCBheGlzTGVmdCBhcyBkM19heGlzTGVmdCB9IGZyb20gJ2QzLWF4aXMnO1xuaW1wb3J0IHsgZWFzZVF1YWRJbk91dCBhcyBkM19lYXNlUXVhZEluT3V0IH0gZnJvbSAnZDMtZWFzZSc7XG5pbXBvcnQgeyBmb3JtYXQgYXMgZDNfZm9ybWF0IH0gZnJvbSAnZDMtZm9ybWF0JztcbmltcG9ydCB7XG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsLFxuICBzY2FsZVBvaW50IGFzIGQzX3NjYWxlUG9pbnQsXG4gIHNjYWxlVGltZSBhcyBkM19zY2FsZVRpbWUsXG59IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IHBvaW50ZXIgYXMgZDNfcG9pbnRlciwgc2VsZWN0IGFzIGQzX3NlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBhcmVhIGFzIGQzX2FyZWEsIGN1cnZlQ2F0bXVsbFJvbSBhcyBkM19jdXJ2ZUNhdG11bGxSb20sIGxpbmUgYXMgZDNfbGluZSB9IGZyb20gJ2QzLXNoYXBlJztcbmltcG9ydCB7IGlzb0Zvcm1hdCBhcyBkM19pc29Gb3JtYXQsIGlzb1BhcnNlIGFzIGQzX2lzb1BhcnNlLCB0aW1lRm9ybWF0IGFzIGQzX3RpbWVGb3JtYXQgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6TGluZSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcblxuLy8gYXNzaWduIGFuIElEIGZvciBlYWNoIGNvbXBvbmVudCBpbnN0YW5jZVxubGV0IG5leHRJZCA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1saW5lJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpMaW5lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1saW5lJylcbiAgbGluZUNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBQYmRzRGF0YXZpekxpbmU7XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAzMDY7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNDAwO1xuXG4gIEBJbnB1dCgpXG4gIHR5cGU6ICdtZWRpdW0nIHwgJ2hpZ2gnIHwgJ2RlYnVnJyA9ICdtZWRpdW0nOyAvLyBkZWJ1ZyB0byBzaG93IGFsbCBjaGFydCBvcHRpb25zXG5cbiAgQElucHV0KClcbiAgYXJlYSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVHlwZTogJ2RhdGUnIHwgJ251bWJlcicgfCAnc3RyaW5nJyA9ICdkYXRlJztcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGlja3MgPSA2O1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGl0bGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgeUF4aXNUaWNrcyA9IDU7XG5cbiAgQElucHV0KClcbiAgeUF4aXNNaW5CdWZmZXIgPSAwLjAxO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWF4QnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICBoaWRlWEdyaWQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVZR3JpZCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMTA1ICsgMjg7IC8vIGhhcmRjb2RlZCBsZWdlbmQgd2lkdGggKyBsZWZ0IG1hcmdpbiwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbGVnZW5kUG9zaXRpb246ICdyaWdodCcgfCAnYm90dG9tJyA9ICdyaWdodCc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwSGVhZGluZ0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBIZWFkaW5nU3VmZml4ID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAxMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gMjA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAzMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkxlZnQgPSA1NTsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lO1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbUNvbG9yOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgY29sb3JzQXJyYXkgPSBbXTtcblxuICBASW5wdXQoKSBsaW5lQ3VydmVkID0gdHJ1ZTtcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgdG9vbHRpcEhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHRvb2x0aXBDbGlja2VkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1vdXNlcmVjdDtcbiAgcHJpdmF0ZSB0b29sdGlwTGluZTtcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY2xpcFBhdGhJZDtcbiAgcHJpdmF0ZSBkM2xpbmU7XG4gIHByaXZhdGUgZDNhcmVhO1xuICBwcml2YXRlIGxpbmVXaWR0aDtcbiAgcHJpdmF0ZSBsaW5lUG9pbnRzO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgeEF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XG4gIHByaXZhdGUgeEF4aXM7XG4gIHByaXZhdGUgeEF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeUF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB5QXhpc0NhbGw7XG4gIHByaXZhdGUgeUF4aXM7XG4gIHByaXZhdGUgeUF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeEdyaWQ7XG4gIHByaXZhdGUgeEdyaWRDYWxsO1xuICBwcml2YXRlIHlHcmlkO1xuICBwcml2YXRlIHlHcmlkQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNUaXRsZU1hcmdpbjogbnVtYmVyO1xuICBwcml2YXRlIHlBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXM6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgaGlkZVRvb2x0aXA6IGJvb2xlYW47XG4gIHByaXZhdGUgdG9vbHRpcEhlYWRpbmdGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSBtb3VzZWRhdGE7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZGF0YXZpejogUGJkc0RhdGF2aXpTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyLFxuICAgIHByaXZhdGUgX2xvY2F0aW9uOiBMb2NhdGlvbixcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXG4gICAgICByaWdodDogK3RoaXMubWFyZ2luUmlnaHQsXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnQsXG4gICAgfTtcblxuICAgIHRoaXMuY2xpcFBhdGhJZCA9IG5leHRJZDtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9XG4gICAgICB0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnID8gZDNfdGltZUZvcm1hdCh0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKSA6IGQzX2Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnlBeGlzRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMueUF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0ID1cbiAgICAgIHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZSdcbiAgICAgICAgPyBkM190aW1lRm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcpXG4gICAgICAgIDogZDNfZm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXG4gICAgdGhpcy5saW5lV2lkdGggPSAzO1xuICAgIHRoaXMubGluZVBvaW50cyA9IHRydWU7XG4gICAgdGhpcy5oaWRlWEF4aXMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNEb21haW4gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVUb29sdGlwID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSBmYWxzZTtcbiAgICB0aGlzLnhBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyID0gMDtcbiAgICB0aGlzLnlBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyID0gMDtcblxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdkZWJ1ZycpIHtcbiAgICAgIC8vIHNldCB0eXBlIGRlZmF1bHRzXG4gICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICBjYXNlICdtZWRpdW0nOlxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2hpZ2gnOlxuICAgICAgICAgIHRoaXMubGluZVdpZHRoID0gMjtcbiAgICAgICAgICB0aGlzLmxpbmVDdXJ2ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmxpbmVQb2ludHMgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYR3JpZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuaGlkZVlHcmlkID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy54QXhpc1RpdGxlTWFyZ2luID0gdGhpcy54QXhpc1RpdGxlID8gMzAgOiAwO1xuXG4gICAgLy8gYWRqdXN0IG1hcmdpbiBpZiB4QXhpcyBoaWRkZW5cbiAgICBpZiAodGhpcy5oaWRlWEF4aXMpIHRoaXMubWFyZ2luLmJvdHRvbSA9IDEwOyAvLyBuZWVkIHNtYWxsIG1hcmdpbiBmb3IgeUF4aXMgd2l0aCAwIHRpY2sgbGFiZWxcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGRlZmluZSBsaW5lXG4gICAgdGhpcy5kM2xpbmUgPSBkM19saW5lKClcbiAgICAgIC54KChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5sYWJlbHNbaV0pKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUodGhpcy5kYXRhLmxhYmVsc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAueSgoZDogYW55KSA9PiB0aGlzLnlBeGlzU2NhbGUoZCkpXG4gICAgICAuZGVmaW5lZCgoZCwgaSkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhkKTtcbiAgICAgICAgcmV0dXJuIGQgIT09IG51bGw7IC8vIG9ubHkgZHJhdyBsaW5lIGlmIGRhdGEgaXMgbm90IG51bGxcbiAgICAgIH0pO1xuXG4gICAgLy8gZGVmaW5lIGxpbmUgY3VydmVcbiAgICBpZiAodGhpcy5saW5lQ3VydmVkKSB7XG4gICAgICB0aGlzLmQzbGluZS5jdXJ2ZShkM19jdXJ2ZUNhdG11bGxSb20uYWxwaGEoMC41KSk7XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIGFyZWFcbiAgICBpZiAodGhpcy5hcmVhKSB7XG4gICAgICB0aGlzLmQzYXJlYSA9IGQzX2FyZWEoKVxuICAgICAgICAueCgoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmxhYmVsc1tpXSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKHRoaXMuZGF0YS5sYWJlbHNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnkwKHRoaXMuaGVpZ2h0KVxuICAgICAgICAueTEoKGQ6IGFueSwgaSkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKVxuICAgICAgICAuZGVmaW5lZCgoZCwgaSkgPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGQpO1xuICAgICAgICAgIHJldHVybiBkICE9PSBudWxsOyAvLyBvbmx5IGRyYXcgbGluZSBpZiBkYXRhIGlzIG5vdCBudWxsXG4gICAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5saW5lQ3VydmVkKSB7XG4gICAgICAgIHRoaXMuZDNhcmVhLmN1cnZlKGQzX2N1cnZlQ2F0bXVsbFJvbS5hbHBoYSgwLjUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSArIHRoaXMueEF4aXNUaXRsZU1hcmdpbilcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ucmlnaHR9ICR7XG4gICAgICAgICAgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tICsgdGhpcy54QXhpc1RpdGxlTWFyZ2luXG4gICAgICAgIH1gLFxuICAgICAgKTtcblxuICAgIC8vIGFkZCByZWN0YW5nbGUgdG8gY2FwdHVyZSBtb3VzZVxuICAgIHRoaXMubW91c2VyZWN0ID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdtb3VzZXJlY3QnKVxuICAgICAgLm9uKCdtb3VzZW1vdmUnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubW91c2VyZWN0TW91c2VNb3ZlKGV2ZW50LCBkYXRhKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubW91c2VyZWN0TW91c2VPdXQoZXZlbnQsIGRhdGEpKVxuICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4gdGhpcy5tb3VzZXJlY3RNb3VzZUNsaWNrKGV2ZW50KSk7XG5cbiAgICB0aGlzLnRvb2x0aXBMaW5lID0gdGhpcy5zdmcuYXBwZW5kKCdsaW5lJykuYXR0cigneTEnLCAwKS5hdHRyKCd5MicsIHRoaXMuaGVpZ2h0KS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWxpbmUnKTtcblxuICAgIC8vIGRlZmluZSBjb2xvciByYW5nZVxuXG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5jdXN0b21Db2xvciA/IHRoaXMuY29sb3JzQXJyYXkgOiB0aGlzLl9kYXRhdml6LmdldENvbG9ycyhmYWxzZSwgdGhpcy50aGVtZSk7XG4gICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVPcmRpbmFsKCkucmFuZ2UoY29sb3JzKTtcblxuICAgIC8vIGFkZCBnbG93IGRlZlxuICAgIHRoaXMuX2RhdGF2aXouY3JlYXRlR2xvd0ZpbHRlcih0aGlzLnN2Zyk7XG5cbiAgICAvLyBYIEFYSVNcbiAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVUaW1lKClcbiAgICAgICAgLmRvbWFpbihcbiAgICAgICAgICBkM19leHRlbnQodGhpcy5kYXRhLmxhYmVscywgKGQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGQzX2lzb1BhcnNlKGQpO1xuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAgIC5kb21haW4oXG4gICAgICAgICAgZDNfZXh0ZW50KHRoaXMuZGF0YS5sYWJlbHMsIChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZVBvaW50KClcbiAgICAgICAgLmRvbWFpbih0aGlzLmRhdGEubGFiZWxzKVxuICAgICAgICAucmFuZ2UoWzAsIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHRdKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnhBeGlzQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKVxuICAgICAgICAvLyAudGlja3MoK3RoaXMueEF4aXNUaWNrcylcbiAgICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy54QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpXG4gICAgICAgIC50aWNrVmFsdWVzKFxuICAgICAgICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4oKS5maWx0ZXIoKGQsIGkpID0+IHtcbiAgICAgICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZDMvZDMtc2NhbGUvaXNzdWVzLzE4MlxuICAgICAgICAgICAgLy8gZDMgY2Fubm90IGRldGVybWluZSBudW1iZXIgb2Ygc3RyaW5ncyB0byBzaG93IG9uIHhheGlzIHdpdGggc2NhbGVQb2ludCgpXG4gICAgICAgICAgICByZXR1cm4gaSAlIHRoaXMueEF4aXNUaWNrcyA9PT0gMDtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgICAgLnRpY2tzKCt0aGlzLnhBeGlzVGlja3MpXG4gICAgICAgIC50aWNrU2l6ZSh0aGlzLnhBeGlzVGlja1NpemUpXG4gICAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgICAudGlja0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0dGVyKTtcbiAgICB9XG5cbiAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy14JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApIC8vJHstdGhpcy5tYXJnaW4ucmlnaHQgLyAyfVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXMpXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc0RvbWFpbilcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzVGlja3MpXG4gICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAvLyBYIEdSSURMSU5FU1xuICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy54R3JpZENhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgICAgICAudGlja1NpemUoLXRoaXMuaGVpZ2h0KVxuICAgICAgICAgIC50aWNrVmFsdWVzKFxuICAgICAgICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbigpLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2QzL2QzLXNjYWxlL2lzc3Vlcy8xODJcbiAgICAgICAgICAgICAgLy8gZDMgY2Fubm90IGRldGVybWluZSBudW1iZXIgb2Ygc3RyaW5ncyB0byBzaG93IG9uIHhheGlzIHdpdGggc2NhbGVQb2ludCgpXG4gICAgICAgICAgICAgIHJldHVybiBpICUgdGhpcy54QXhpc1RpY2tzID09PSAwO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpLnRpY2tTaXplKC10aGlzLmhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMueEdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApIC8vJHstdGhpcy5tYXJnaW4ucmlnaHQgLyAyfVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gWCBBWElTIFRJVExFXG4gICAgaWYgKHRoaXMueEF4aXNUaXRsZSkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzLXRpdGxlJylcbiAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgIC5hdHRyKFxuICAgICAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgICAgIGB0cmFuc2xhdGUoJHt0aGlzLnN2Zy5hdHRyKCd3aWR0aCcpIC8gMiAtIHRoaXMubWFyZ2luLmxlZnQgLyAyIC0gdGhpcy5tYXJnaW4ucmlnaHQgLyAyfSwgJHtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgKHRoaXMuaGlkZVhBeGlzID8gMjAgOiA0MClcbiAgICAgICAgICB9KWAsXG4gICAgICAgIClcbiAgICAgICAgLy8gLmF0dHIoJ3gnLCB0aGlzLndpZHRoIC8gMiAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgICAgLy8gLmF0dHIoJ3knLCB0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArICh0aGlzLmhpZGVYQXhpcyA/IDI1IDogNTApKVxuICAgICAgICAudGV4dCh0aGlzLnhBeGlzVGl0bGUpO1xuICAgIH1cblxuICAgIC8vIFkgQVhJU1xuICAgIHRoaXMueUF4aXNTY2FsZSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oW1xuICAgICAgICBkM19taW4odGhpcy5kYXRhLnNlcmllcywgKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1pblZhbCA9ICtkM19taW4oZC52YWx1ZXMpO1xuICAgICAgICAgIHJldHVybiBtaW5WYWwgLSBtaW5WYWwgKiArdGhpcy55QXhpc01pbkJ1ZmZlcjtcbiAgICAgICAgfSksXG4gICAgICAgIGQzX21heCh0aGlzLmRhdGEuc2VyaWVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF4VmFsID0gK2QzX21heChkLnZhbHVlcyk7XG4gICAgICAgICAgcmV0dXJuIG1heFZhbCArIG1heFZhbCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG4gICAgICAgIH0pLFxuICAgICAgXSlcbiAgICAgIC5uaWNlKClcbiAgICAgIC5yYW5nZShbdGhpcy5oZWlnaHQsIDBdKTtcblxuICAgIHRoaXMueUF4aXNDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnlBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnlBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueUF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy55QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteScpXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXNUaWNrcylcbiAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgIC8vIFkgR1JJRExJTkVTXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgdGhpcy55R3JpZENhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAgIC50aWNrU2l6ZSgtdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodCk7XG5cbiAgICAgIHRoaXMueUdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC15JylcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsIDApYClcbiAgICAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgIH1cblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgd2VzdCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXInKTtcblxuICAgICAgLy8gdG9vbHRpcCB0YWJsZVxuICAgICAgY29uc3QgdG9vbHRpcFRhYmxlID0gdGhpcy50b29sdGlwLmFwcGVuZCgndGFibGUnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLXRhYmxlIHRleHQtc3RhcnQgdy0xMDAnKTtcblxuICAgICAgY29uc3QgdG9vbHRpcFRhYmxlVGJvZHkgPSB0b29sdGlwVGFibGUuYXBwZW5kKCd0Ym9keScpO1xuXG4gICAgICB0b29sdGlwVGFibGVUYm9keVxuICAgICAgICAuc2VsZWN0QWxsKCd0cicpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgICAgLmpvaW4oKGVudGVyKSA9PiBlbnRlci5hcHBlbmQoJ3RyJykpO1xuICAgIH1cblxuICAgIC8vIGFkZCBsZWdlbmQgY2xhc3Nlc1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xuICAgIH1cblxuICAgIC8vIGFkZCBjbGlwIHBhdGggZm9yIGxpbmUgYW5pbWF0aW9uXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2NsaXBQYXRoJylcbiAgICAgIC5hdHRyKCdpZCcsIGBjbGlwLXBhdGgtJHt0aGlzLmNsaXBQYXRoSWR9YClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggLSArdGhpcy5tYXJnaW4ubGVmdCAtICt0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQpO1xuXG4gICAgLy8gYWRkIGNsaXAgcGF0aCBmb3IgcG9pbnRzIGFuaW1hdGlvblxuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdjbGlwUGF0aCcpXG4gICAgICAuYXR0cignaWQnLCBgY2xpcC1wYXRoLXBvaW50cy0ke3RoaXMuY2xpcFBhdGhJZH1gKVxuICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aCArICt0aGlzLm1hcmdpbi5sZWZ0IC0gK3RoaXMubWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKC0ke3RoaXMubWFyZ2luLmxlZnR9LCAwKWApO1xuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuXG4gICAgbmV4dElkKys7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgdGhpcy5tb3VzZXJlY3QuZGF0YSh0aGlzLmRhdGEpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSB4U2NhbGVcbiAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgdGhpcy54QXhpc1NjYWxlXG4gICAgICAgIC5kb21haW4oXG4gICAgICAgICAgZDNfZXh0ZW50KHRoaXMuZGF0YS5sYWJlbHMsIChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkM19pc29QYXJzZShkKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgICAucmFuZ2UoWzAsIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHRdKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnbnVtYmVyJykge1xuICAgICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbihcbiAgICAgICAgZDNfZXh0ZW50KHRoaXMuZGF0YS5sYWJlbHMsIChkOiBhbnkpID0+IHtcbiAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnhBeGlzU2NhbGUuZG9tYWluKHRoaXMuZGF0YS5sYWJlbHMpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0aGUgeVNjYWxlXG4gICAgdGhpcy55QXhpc1NjYWxlXG4gICAgICAuZG9tYWluKFtcbiAgICAgICAgZDNfbWluKHRoaXMuZGF0YS5zZXJpZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBtaW5WYWwgPSArZDNfbWluKGQudmFsdWVzKTtcbiAgICAgICAgICByZXR1cm4gbWluVmFsIC0gbWluVmFsICogK3RoaXMueUF4aXNNaW5CdWZmZXI7XG4gICAgICAgIH0pLFxuICAgICAgICBkM19tYXgodGhpcy5kYXRhLnNlcmllcywgKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1heFZhbCA9ICtkM19tYXgoZC52YWx1ZXMpO1xuICAgICAgICAgIHJldHVybiBtYXhWYWwgKyBtYXhWYWwgKiB0aGlzLnlBeGlzTWF4QnVmZmVyO1xuICAgICAgICB9KSxcbiAgICAgIF0pXG4gICAgICAubmljZSgpO1xuXG4gICAgdGhpcy54QXhpcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICB0aGlzLnlBeGlzLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgZ3JpZHNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XG4gICAgICB0aGlzLnlHcmlkLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBsaW5lc1xuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoLmxpbmUnKVxuICAgICAgLmF0dHIoJ2ZpbHRlcicsICgpID0+XG4gICAgICAgIHRoaXMudHlwZSAhPT0gJ2hpZ2gnID8gYHVybCgke3RoaXMuX2xvY2F0aW9uLnByZXBhcmVFeHRlcm5hbFVybCh0aGlzLl9sb2NhdGlvbi5wYXRoKCkpfSNnbG93KWAgOiBudWxsLFxuICAgICAgKVxuICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgIC5qb2luKFxuICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAuYXR0cihcbiAgICAgICAgICAgICAgJ2NsaXAtcGF0aCcsXG4gICAgICAgICAgICAgIGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wcmVwYXJlRXh0ZXJuYWxVcmwodGhpcy5fbG9jYXRpb24ucGF0aCgpKX0jY2xpcC1wYXRoLSR7dGhpcy5jbGlwUGF0aElkfSlgLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpbmUnKVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLmxpbmVXaWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdkJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgYXJyYXkgPSBuZXcgQXJyYXkoZGF0YS52YWx1ZXMubGVuZ3RoKS5maWxsKDApO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kM2xpbmUoYXJyYXkpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYWxsKChlbnRlcikgPT5cbiAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgICAuYXR0cignZCcsIChkYXRhKSA9PiB0aGlzLmQzbGluZShkYXRhLnZhbHVlcykpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICB1cGRhdGUuY2FsbCgodXBkYXRlKSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpID0+IHRoaXMuZDNsaW5lKGQudmFsdWVzKSksXG4gICAgICAgICAgKSxcbiAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKCksXG4gICAgICApO1xuXG4gICAgLy8gYXJlYVxuICAgIGlmICh0aGlzLmFyZWEpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJ3BhdGguYXJlYScpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YS5zZXJpZXMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgICAgICAuYXR0cihcbiAgICAgICAgICAgICAgICAnY2xpcC1wYXRoJyxcbiAgICAgICAgICAgICAgICBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucHJlcGFyZUV4dGVybmFsVXJsKHRoaXMuX2xvY2F0aW9uLnBhdGgoKSl9I2NsaXAtcGF0aC0ke3RoaXMuY2xpcFBhdGhJZH0pYCxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYXJlYScpXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJheSA9IG5ldyBBcnJheShkYXRhLnZhbHVlcy5sZW5ndGgpLmZpbGwoMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZDNhcmVhKGFycmF5KTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnN0eWxlKCdjb2xvcicsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG4gICAgICAgICAgICAgIC5jYWxsKChlbnRlcikgPT5cbiAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZGF0YSkgPT4gdGhpcy5kM2FyZWEoZGF0YS52YWx1ZXMpKSxcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgPT4gdGhpcy5kM2FyZWEoZC52YWx1ZXMpKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIGNpcmNsZXNcbiAgICBpZiAodGhpcy5saW5lUG9pbnRzKSB7XG4gICAgICAvLyBhZGQgcG9pbnRzXG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCdnLnBvaW50cycpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YS5zZXJpZXMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncG9pbnRzJylcbiAgICAgICAgICAgICAgLmF0dHIoXG4gICAgICAgICAgICAgICAgJ2NsaXAtcGF0aCcsXG4gICAgICAgICAgICAgICAgYHVybCgke3RoaXMuX2xvY2F0aW9uLnByZXBhcmVFeHRlcm5hbFVybCh0aGlzLl9sb2NhdGlvbi5wYXRoKCkpfSNjbGlwLXBhdGgtcG9pbnRzLSR7dGhpcy5jbGlwUGF0aElkfSlgLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5zdHlsZSgnY29sb3InLCAoZCwgaSkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuXG4gICAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgICAgICAgIC5kYXRhKChkKSA9PiBkLnZhbHVlcylcbiAgICAgICAgICAgICAgLmpvaW4oXG4gICAgICAgICAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkM19pc29QYXJzZSh0aGlzLmRhdGEubGFiZWxzW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUodGhpcy5kYXRhLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKDApKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigncicsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gaGlkZSBjaXJjbGVzIGlmIHRoZXJlIGlzIG5vIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZVdpZHRoICogMjtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLmxpbmVXaWR0aClcbiAgICAgICAgICAgICAgICAgICAgLmNhbGwoKGVudGVyKSA9PlxuICAgICAgICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKSxcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7fSxcbiAgICAgICAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKSxcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgICAgICAgIC5kYXRhKChkKSA9PiBkLnZhbHVlcylcbiAgICAgICAgICAgICAgLmpvaW4oXG4gICAgICAgICAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkM19pc29QYXJzZSh0aGlzLmRhdGEubGFiZWxzW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUodGhpcy5kYXRhLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigncicsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gaGlkZSBjaXJjbGVzIGlmIHRoZXJlIGlzIG5vIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZVdpZHRoICogMjtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLmxpbmVXaWR0aCksXG4gICAgICAgICAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICAgICAgICAgIHVwZGF0ZS5jYWxsKCh1cGRhdGUpID0+XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5sYWJlbHNbaV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUodGhpcy5kYXRhLmxhYmVsc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNTY2FsZSgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNTY2FsZShkKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdyJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhpZGUgY2lyY2xlcyBpZiB0aGVyZSBpcyBubyBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZVdpZHRoICogMjtcbiAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKCksXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKCksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuY2hhcnRcbiAgICAgICAgLnNlbGVjdCgnLmxlZ2VuZCcpXG4gICAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YS5zZXJpZXMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGkgPSBlbnRlci5hcHBlbmQoJ2xpJykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKTtcblxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1rZXknKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKTtcblxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgICAgICAgIC5odG1sKChkKSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbCgoZCkgPT4ge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKSxcbiAgICAgICAgKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChldmVudCwgZGF0YSkgPT4gdGhpcy5sZWdlbmRNb3VzZU92ZXIoZXZlbnQsIGRhdGEpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4gdGhpcy5sZWdlbmRNb3VzZU91dCgpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmxlZ2VuZE1vdXNlQ2xpY2soZXZlbnQsIGRhdGEpKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcFxuICAgICAgICAuc2VsZWN0KCcudG9vbHRpcC10YWJsZScpXG4gICAgICAgIC5zZWxlY3RBbGwoJ3RyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgKGVudGVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b29sdGlwSXRlbSA9IGVudGVyLmFwcGVuZCgndHInKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWl0ZW0nKTtcblxuICAgICAgICAgICAgdG9vbHRpcEl0ZW1cbiAgICAgICAgICAgICAgLmFwcGVuZCgndGQnKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2NvbG9yJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSlcbiAgICAgICAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAta2V5Jyk7XG5cbiAgICAgICAgICAgIHRvb2x0aXBJdGVtXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3RkJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtbGFiZWwgcGUtMiB0ZXh0LW5vd3JhcCcpXG4gICAgICAgICAgICAgIC5odG1sKChkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSA/IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGQubGFiZWwpIDogZC5sYWJlbDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRvb2x0aXBJdGVtXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3RkJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdmFsdWUgdGV4dC1lbmQgdGV4dC1ub3dyYXAnKVxuICAgICAgICAgICAgICAuaHRtbCgoZCkgPT4gJycpO1xuXG4gICAgICAgICAgICByZXR1cm4gdG9vbHRpcEl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICAodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHRvb2x0aXAgbGFiZWwgdGV4dFxuICAgICAgICAgICAgY29uc3QgdG9vbHRpcExhYmVsID0gdXBkYXRlLnNlbGVjdCgnLnRvb2x0aXAtbGFiZWwnKTtcblxuICAgICAgICAgICAgdG9vbHRpcExhYmVsLmh0bWwoKGQpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSA/IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGQubGFiZWwpIDogZC5sYWJlbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKCksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcucG9pbnRzJykucmFpc2UoKTtcbiAgICB0aGlzLm1vdXNlcmVjdC5yYWlzZSgpO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3ZlciA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKGRhdGEsIHRoaXMubGluZVBvaW50cyk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gZC5sYWJlbCAhPT0gZGF0YS5sYWJlbDtcbiAgICAgIH0pXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgIHJldHVybiBkLmxhYmVsICE9PSBkYXRhLmxhYmVsO1xuICAgICAgfSlcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGQubGFiZWwgIT09IGRhdGEubGFiZWw7XG4gICAgICAgIH0pXG4gICAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxpbmVQb2ludHMpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5wb2ludHMnKVxuICAgICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGQubGFiZWwgIT09IGRhdGEubGFiZWw7XG4gICAgICAgIH0pXG4gICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuICAgIH1cblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5saW5lJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSkuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgaWYgKHRoaXMubGluZVBvaW50cykge1xuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCdjaXJjbGUnKS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSkuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcuYXJlYScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBsZWdlbmRNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBtb3VzZXJlY3RNb3VzZU1vdmUgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICBsZXQgbW91c2VYOyAvLyBtb3VzZSB4IHBvc2l0aW9uXG4gICAgbGV0IGxvd2VyO1xuICAgIGxldCB1cHBlcjtcbiAgICBsZXQgY2xvc2VzdDtcbiAgICBsZXQgY2xvc2VzdEluZGV4O1xuXG4gICAgbGV0IGxlZnRJbmRleCA9IDA7XG5cbiAgICAvLyBoYW5kbGUgc3RyaW5nIHR5cGUsIG5vIGludmVydCBmdW5jdGlvbiBvbiBzY2FsZVBvaW50XG4gICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgbW91c2VYID0gZDNfcG9pbnRlcihldmVudClbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vdXNlWCA9IHRoaXMueEF4aXNTY2FsZS5pbnZlcnQoZDNfcG9pbnRlcihldmVudClbMF0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICBsZWZ0SW5kZXggPSBkM19iaXNlY3RSaWdodCh0aGlzLmRhdGEubGFiZWxzLCBkM19pc29Gb3JtYXQobW91c2VYKSk7XG5cbiAgICAgIC8vIHByZXZlbnQgZXJyb3IgZm9yIDAgaW5kZXhcbiAgICAgIGlmIChsZWZ0SW5kZXggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgICAgbG93ZXIgPSBuZXcgRGF0ZSh0aGlzLmRhdGEubGFiZWxzW2xlZnRJbmRleCAtIDFdKTtcbiAgICAgIHVwcGVyID0gbmV3IERhdGUodGhpcy5kYXRhLmxhYmVsc1tsZWZ0SW5kZXhdKTtcbiAgICAgIGNsb3Nlc3QgPSArbW91c2VYIC0gK2xvd2VyID4gK3VwcGVyIC0gbW91c2VYID8gdXBwZXIgOiBsb3dlcjsgLy8gZGF0ZSBtb3VzZSBpcyBjbG9zZXN0IHRvXG4gICAgICBjbG9zZXN0SW5kZXggPSB0aGlzLmRhdGEubGFiZWxzLmluZGV4T2YoZDNfaXNvRm9ybWF0KGNsb3Nlc3QpKTsgLy8gd2hpY2ggaW5kZXggdGhlIG1vdXNlIGlzIGNsb3Nlc3QgdG9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCttb3VzZVhEYXRlLCBsZWZ0SW5kZXgsICtkYXRlTG93ZXIsICtkYXRlVXBwZXIsICtjbG9zZXN0RGF0ZSwgY2xvc2VzdEluZGV4KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnbnVtYmVyJykge1xuICAgICAgbGVmdEluZGV4ID0gZDNfYmlzZWN0UmlnaHQodGhpcy5kYXRhLmxhYmVscywgbW91c2VYKTtcblxuICAgICAgLy8gcHJldmVudCBlcnJvciBmb3IgMCBpbmRleFxuICAgICAgaWYgKGxlZnRJbmRleCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBsb3dlciA9IHRoaXMuZGF0YS5sYWJlbHNbbGVmdEluZGV4IC0gMV07XG4gICAgICB1cHBlciA9IHRoaXMuZGF0YS5sYWJlbHNbbGVmdEluZGV4XTtcbiAgICAgIGNsb3Nlc3QgPSArbW91c2VYIC0gK2xvd2VyID4gK3VwcGVyIC0gbW91c2VYID8gdXBwZXIgOiBsb3dlcjsgLy8gZGF0ZSBtb3VzZSBpcyBjbG9zZXN0IHRvXG4gICAgICBjbG9zZXN0SW5kZXggPSB0aGlzLmRhdGEubGFiZWxzLmluZGV4T2YoY2xvc2VzdCk7IC8vIHdoaWNoIGluZGV4IHRoZSBtb3VzZSBpcyBjbG9zZXN0IHRvXG4gICAgICAvLyBjb25zb2xlLmxvZygrbW91c2VYRGF0ZSwgbGVmdEluZGV4LCArbG93ZXIsICt1cHBlciwgK2Nsb3Nlc3QsIGNsb3Nlc3RJbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IHRoaXMueEF4aXNTY2FsZS5kb21haW4oKTtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy54QXhpc1NjYWxlLnJhbmdlKCk7XG4gICAgICBjb25zdCByYW5nZVBvaW50cyA9IGQzX3JhbmdlKHJhbmdlWzBdLCByYW5nZVsxXSwgdGhpcy54QXhpc1NjYWxlLnN0ZXAoKSk7XG4gICAgICByYW5nZVBvaW50cy5wdXNoKHJhbmdlWzFdKTtcblxuICAgICAgbGVmdEluZGV4ID0gZDNfYmlzZWN0KHJhbmdlUG9pbnRzLCBtb3VzZVgpO1xuXG4gICAgICBpZiAobGVmdEluZGV4ID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGxvd2VyID0gcmFuZ2VQb2ludHNbbGVmdEluZGV4IC0gMV07XG4gICAgICB1cHBlciA9IHJhbmdlUG9pbnRzW2xlZnRJbmRleF07XG4gICAgICBjbG9zZXN0ID0gK21vdXNlWCAtICtsb3dlciA+ICt1cHBlciAtIG1vdXNlWCA/ICt1cHBlciA6ICtsb3dlcjtcblxuICAgICAgY29uc3QgcmFuZ2VJbmRleCA9IHJhbmdlUG9pbnRzLmluZGV4T2YoY2xvc2VzdCk7XG4gICAgICBjbG9zZXN0ID0gZG9tYWluW3JhbmdlSW5kZXhdO1xuXG4gICAgICBjbG9zZXN0SW5kZXggPSB0aGlzLmRhdGEubGFiZWxzLmluZGV4T2YoZG9tYWluW3JhbmdlSW5kZXhdKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaXJjbGVzID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcubGluZS1ncm91cCcpLnNlbGVjdEFsbCgnY2lyY2xlJyk7XG5cbiAgICBjaXJjbGVzLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gY2xvc2VzdEluZGV4KS5jbGFzc2VkKCdhY3RpdmUnLCB0cnVlKTtcbiAgICBjaXJjbGVzLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gY2xvc2VzdEluZGV4KS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBMaW5lLmF0dHIoJ3gxJywgdGhpcy54QXhpc1NjYWxlKGNsb3Nlc3QpKS5hdHRyKCd4MicsIHRoaXMueEF4aXNTY2FsZShjbG9zZXN0KSkuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRvb2x0aXBMaW5lLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCkpO1xuICAgIHRoaXMudG9vbHRpcFNob3codGhpcy50b29sdGlwTGluZS5ub2RlKCksIGNsb3Nlc3RJbmRleCk7XG5cbiAgICB0aGlzLm1vdXNlZGF0YSA9IHtcbiAgICAgIGxhYmVsOiB0aGlzLnhBeGlzVHlwZSA9PT0gJ2RhdGUnID8gbmV3IERhdGUoY2xvc2VzdCkudG9JU09TdHJpbmcoKSA6IGNsb3Nlc3QsXG4gICAgICBzZXJpZXM6IHRoaXMuZGF0YS5zZXJpZXMubWFwKChkKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFiZWw6IGQubGFiZWwsXG4gICAgICAgICAgdmFsdWU6IGQudmFsdWVzW2Nsb3Nlc3RJbmRleF0sXG4gICAgICAgIH07XG4gICAgICB9KSxcbiAgICB9O1xuXG4gICAgdGhpcy50b29sdGlwSG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGE6IHRoaXMubW91c2VkYXRhIH0pOyAvLyBpbmRleCBvZiBsZWZ0IGNsb3Nlc3QgZGF0ZVxuICB9O1xuXG4gIG1vdXNlcmVjdE1vdXNlT3V0ID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5zdmcuc2VsZWN0QWxsKCdjaXJjbGUnKS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG4gICAgdGhpcy50b29sdGlwTGluZS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIG1vdXNlcmVjdE1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhOiB0aGlzLm1vdXNlZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKG5vZGUsIGNsb3Nlc3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIGNvbnN0IG1vdXNlcmVjdERpbWVuc2lvbnMgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgdG9vbHRpcERpbWVuc2lvbnMgPSB0aGlzLnRvb2x0aXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGRpbWVuc2lvbkNhbGN1bGF0ZWQgPSBtb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyB0b29sdGlwRGltZW5zaW9ucy53aWR0aCArIDg7XG4gICAgY29uc3QgY2xpZW50V2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gMTA7XG4gICAgbGV0IHBvc2l0aW9uO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsLCBtb3VzZXJlY3REaW1lbnNpb25zLCB0b29sdGlwT2Zmc2V0SGVpZ2h0LCB0b29sdGlwRGltZW5zaW9ucywgZGltZW5zaW9uQ2FsY3VsYXRlZCwgY2xpZW50V2lkdGgpO1xuXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbCgoZCkgPT4ge1xuICAgICAgaWYgKHRoaXMueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5sYWJlbHNbY2xvc2VzdEluZGV4XSk7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0KHBhcnNlZFRpbWUpfSR7dGhpcy50b29sdGlwSGVhZGluZ1N1ZmZpeH1gO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnhBeGlzVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgY29uc3QgaGVhZGluZyA9IHRoaXMuZGF0YS5sYWJlbHNbY2xvc2VzdEluZGV4XTtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQoaGVhZGluZyl9JHt0aGlzLnRvb2x0aXBIZWFkaW5nU3VmZml4fWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5kYXRhLmxhYmVsc1tjbG9zZXN0SW5kZXhdfSR7dGhpcy50b29sdGlwSGVhZGluZ1N1ZmZpeH1gO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdEFsbCgnLnRvb2x0aXAtdmFsdWUnKS5odG1sKChkLCBpKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5zZXJpZXNbaV0udmFsdWVzW2Nsb3Nlc3RJbmRleF07XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSA/IHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0KHZhbHVlKSA6IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgLy8gZmxpcCB0aGUgdG9vbHRpcCBwb3NpdGlvbnMgaWYgbmVhciB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgc2NyZWVuXG4gICAgaWYgKGRpbWVuc2lvbkNhbGN1bGF0ZWQgPiBjbGllbnRXaWR0aCkge1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ2Vhc3QnLCB0cnVlKTtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgZmFsc2UpO1xuICAgICAgcG9zaXRpb24gPSBgJHttb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgLSB0b29sdGlwRGltZW5zaW9ucy53aWR0aCAtIDh9cHhgO1xuICAgIH0gZWxzZSBpZiAoZGltZW5zaW9uQ2FsY3VsYXRlZCA8IGNsaWVudFdpZHRoKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIGZhbHNlKTtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgdHJ1ZSk7XG4gICAgICBwb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIDh9cHhgO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdQT1NJVElPTjogJywgcG9zaXRpb24sIG1vdXNlcmVjdERpbWVuc2lvbnMpO1xuXG4gICAgLy8gc2V0IHRoZSB0b29sdGlwIHN0eWxlc1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZShcbiAgICAgICd0b3AnLFxuICAgICAgYCR7bW91c2VyZWN0RGltZW5zaW9ucy50b3AgKyBtb3VzZXJlY3REaW1lbnNpb25zLmhlaWdodCAvIDIgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC8gMiArIHNjcm9sbFsxXX1weGAsXG4gICAgKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBwb3NpdGlvbik7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICBwcml2YXRlIHhBeGlzRm9ybWF0dGVyID0gKGl0ZW0pID0+IHtcbiAgICBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdkYXRlJykge1xuICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XG4gICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChwYXJzZURhdGUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy54QXhpc1R5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAvLyByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChpdGVtKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdHRlciA9IChpdGVtKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQoaXRlbSk7XG4gIH07XG59XG4iXX0=
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { select as d3_select, event as d3_event, mouse as d3_mouse } from 'd3-selection';
import { line as d3_line, area as d3_area, curveCatmullRom as d3_curveCatmullRom } from 'd3-shape';
import { scaleOrdinal as d3_scaleOrdinal, scaleLinear as d3_scaleLinear, scaleTime as d3_scaleTime } from 'd3-scale';
import { min as d3_min, max as d3_max, extent as d3_extent, bisectLeft as d3_bisectLeft } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { format as d3_format } from 'd3-format';
import { isoParse as d3_isoParse, isoFormat as d3_isoFormat, timeFormat as d3_timeFormat } from 'd3-time-format';
import { easeQuadInOut as d3_easeQuadInOut } from 'd3-ease';
import { PbdsDatavizService } from './dataviz.service';
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.tooltipHovered = new EventEmitter();
        this.tooltipClicked = new EventEmitter();
        this.updateChart = () => {
            this.mouserect.data(this.data);
            // update the xScale
            this.xAxisScale.domain(d3_extent(this.data.dates, (d, i) => {
                return d3_isoParse(d);
            }));
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
            this.xAxis
                .transition()
                .duration(1000)
                .call(this.xAxisCall);
            this.yAxis
                .transition()
                .duration(1000)
                .call(this.yAxisCall);
            // update the grids
            if (!this.hideXGrid) {
                this.xGrid
                    .transition()
                    .duration(1000)
                    .call(this.xGridCall);
            }
            if (!this.hideYGrid) {
                this.yGrid
                    .transition()
                    .duration(1000)
                    .call(this.yGridCall);
            }
            // lines
            this.svg
                .selectAll('path.line')
                .attr('filter', () => (this.type !== 'high' ? `url(${this._location.path()}#glow)` : null))
                .data(this.data.series)
                .join(enter => {
                enter
                    .append('path')
                    .attr('clip-path', `url(${this._location.path()}#clip-path-${this.clipPathId})`)
                    .attr('class', 'line')
                    .style('stroke', d => this.colorRange(d.label))
                    .style('stroke-width', this.lineWidth)
                    .attr('d', data => {
                    const array = new Array(data.values.length).fill(0);
                    return this.d3line(array);
                })
                    .call(enter => enter
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('d', data => this.d3line(data.values)));
            }, update => update.call(update => update
                .transition()
                .duration(1000)
                .ease(d3_easeQuadInOut)
                .attr('d', d => this.d3line(d.values))), exit => exit.remove());
            // area
            if (this.area) {
                this.svg
                    .selectAll('path.area')
                    .data(this.data.series)
                    .join(enter => enter
                    .append('path')
                    .attr('clip-path', `url(${this._location.path()}#clip-path-${this.clipPathId})`)
                    .attr('class', 'area')
                    .attr('d', data => {
                    const array = new Array(data.values.length).fill(0);
                    return this.d3area(array);
                })
                    .style('color', d => this.colorRange(d.label))
                    .call(enter => enter
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('d', data => this.d3area(data.values))), update => update.call(update => {
                    return update
                        .transition()
                        .duration(1000)
                        .ease(d3_easeQuadInOut)
                        .attr('d', d => this.d3area(d.values));
                }), exit => exit.remove());
            }
            // circles
            if (this.linePoints) {
                // add points
                this.svg
                    .selectAll('g.points')
                    .data(this.data.series)
                    .join(enter => enter
                    .append('g')
                    .attr('class', 'points')
                    .attr('clip-path', `url(${this._location.path()}#clip-path-points-${this.clipPathId})`)
                    .style('color', (d, i) => this.colorRange(d.label))
                    .selectAll('circle')
                    .data(d => d.values)
                    .join(enter => enter
                    .append('circle')
                    .attr('cx', (d, i) => this.xAxisScale(d3_isoParse(this.data.dates[i])))
                    .attr('cy', d => this.yAxisScale(0))
                    .attr('r', this.lineWidth * 2)
                    .style('stroke-width', this.lineWidth)
                    .call(enter => enter
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('cy', d => this.yAxisScale(d))), () => { }, exit => exit.remove()), update => update
                    .selectAll('circle')
                    .data(d => d.values)
                    .join(enter => enter
                    .append('circle')
                    .attr('cx', (d, i) => this.xAxisScale(d3_isoParse(this.data.dates[i])))
                    .attr('cy', d => this.yAxisScale(d))
                    .attr('r', this.lineWidth * 2)
                    .style('stroke-width', this.lineWidth), update => update.call(update => update
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('cx', (d, i) => this.xAxisScale(d3_isoParse(this.data.dates[i])))
                    .attr('cy', d => this.yAxisScale(d))), exit => exit.remove()), exit => exit.remove());
            }
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.data.series)
                    .join(enter => {
                    const li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', d => this.colorRange(d.label));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html(d => {
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
                }, update => {
                    update.select('.legend-label').html(d => {
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
                }, exit => exit.remove())
                    .on('mouseover', (data, index, nodes) => this.legendMouseOver(d3_event, data, index, nodes))
                    .on('mouseout', () => this.legendMouseOut())
                    .on('click', (data, index, nodes) => this.legendMouseClick(d3_event, data, index, nodes));
            }
            if (!this.hideTooltip) {
                this.tooltip
                    .select('.tooltip-table')
                    .selectAll('tr')
                    .data(this.data.series)
                    .join(enter => {
                    const tooltipItem = enter.append('tr').attr('class', 'tooltip-item');
                    tooltipItem
                        .append('td')
                        .style('color', d => this.colorRange(d.label))
                        .append('span')
                        .attr('class', 'pbds-tooltip-key');
                    tooltipItem
                        .append('td')
                        .attr('class', 'tooltip-label pr-2 text-nowrap')
                        .html(d => {
                        return this.tooltipLabelFormatType ? this.tooltipLabelFormat(d.label) : d.label;
                    });
                    tooltipItem
                        .append('td')
                        .attr('class', 'tooltip-value text-right text-nowrap')
                        .html(d => '');
                    return tooltipItem;
                }, () => { }, exit => exit.remove());
            }
            this.svg.selectAll('.points').raise();
            this.mouserect.raise();
        };
        this.legendMouseOver = (event, data, index, nodes) => {
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== index)
                .classed('inactive', true);
            this.svg
                .selectAll('.line')
                .filter((d, i) => i !== index)
                .classed('inactive', true);
            this.svg
                .selectAll('.line')
                .filter((d, i) => i === index)
                .classed('active', true);
            if (this.area) {
                this.svg
                    .selectAll('.area')
                    .filter((d, i) => i !== index)
                    .classed('inactive', true);
            }
            if (this.linePoints) {
                this.svg
                    .selectAll('.points')
                    .filter((d, i) => i !== index)
                    .selectAll('circle')
                    .classed('inactive', true);
            }
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart
                .selectAll('.line')
                .classed('inactive', false)
                .classed('active', false);
            if (this.linePoints) {
                this.svg
                    .selectAll('circle')
                    .classed('active', false)
                    .classed('inactive', false);
            }
            if (this.area) {
                this.svg.selectAll('.area').classed('inactive', false);
            }
        };
        this.legendMouseClick = (event, data, index, nodes) => {
            this.clicked.emit({ event, data });
        };
        this.mouserectMouseMove = (event, index, nodes) => {
            const mouseXDate = this.xAxisScale.invert(d3_mouse(nodes[0])[0]); // return date at mouse x position
            const leftIndex = d3_bisectLeft(this.data.dates, d3_isoFormat(mouseXDate)); // index of left closest date
            // prevent error for 0 index
            if (leftIndex === 0)
                return false;
            const dateLower = new Date(this.data.dates[leftIndex - 1]);
            const dateUpper = new Date(this.data.dates[leftIndex]);
            const closestDate = +mouseXDate - +dateLower > +dateUpper - mouseXDate ? dateUpper : dateLower; // date mouse is closest to
            const closestIndex = this.data.dates.indexOf(d3_isoFormat(closestDate)); // which index the mouse is closest to
            // console.log(+mouseXDate, leftIndex, +dateLower, +dateUpper, +closestDate, closestIndex);
            const circles = this.svg.selectAll('.line-group').selectAll('circle');
            circles.filter((d, i) => i === closestIndex).classed('active', true);
            circles.filter((d, i) => i !== closestIndex).classed('active', false);
            this.tooltipLine
                .attr('x1', this.xAxisScale(closestDate))
                .attr('x2', this.xAxisScale(closestDate))
                .classed('active', true);
            // console.log(this.tooltipLine.node().getBoundingClientRect(), this._scroll.getScrollPosition());
            this.tooltipShow(this.tooltipLine.node(), closestIndex);
            this.mousedata = {
                date: closestDate,
                series: this.data.series.map(d => {
                    return {
                        label: d.label,
                        value: d.values[closestIndex]
                    };
                })
            };
            this.tooltipHovered.emit({ event, data: this.mousedata });
        };
        this.mouserectMouseOut = (event, index, nodes) => {
            this.svg.selectAll('circle').classed('active', false);
            this.tooltipLine.classed('active', false);
            this.tooltipHide();
        };
        this.mouserectMouseClick = () => {
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
            this.tooltip.select('.tooltip-header').html(d => {
                const parsedTime = d3_isoParse(this.data.dates[closestIndex]);
                return this.tooltipHeadingFormat(parsedTime);
            });
            this.tooltip.selectAll('.tooltip-value').html((d, i) => {
                return this.tooltipValueFormatType
                    ? this.tooltipValueFormat(this.data.series[i].values[closestIndex])
                    : this.data.series[i].values[closestIndex];
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
        this.xAxisFormatter = item => {
            const parseDate = d3_isoParse(item);
            return this.xAxisFormat(parseDate);
        };
        this.yAxisFormatter = item => {
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
        this.xAxisFormat = d3_timeFormat(this.xAxisFormatString);
        this.yAxisFormat = d3_format(this.yAxisFormatString);
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipHeadingFormat = d3_timeFormat(this.tooltipHeadingFormatString);
        this.tooltipLabelFormat = this._dataviz.d3Format(this.tooltipLabelFormatType, this.tooltipLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        // defaults for all chart types
        this.lineWidth = 3;
        this.lineCurved = true;
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
            .x((d, i) => this.xAxisScale(d3_isoParse(this.data.dates[i])))
            .y((d) => this.yAxisScale(d));
        // define line curve
        if (this.lineCurved) {
            this.d3line.curve(d3_curveCatmullRom.alpha(0.5));
        }
        // define area
        if (this.area) {
            this.d3area = d3_area()
                .x((d, i) => this.xAxisScale(d3_isoParse(this.data.dates[i])))
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
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.right} ${+this.height +
            this.margin.top +
            this.margin.bottom}`);
        // add rectangle to capture mouse
        this.mouserect = this.svg
            .append('rect')
            .attr('width', this.width - this.margin.left - this.margin.right)
            .attr('height', this.height)
            .attr('class', 'mouserect')
            .on('mousemove', (data, index, nodes) => this.mouserectMouseMove(d3_event, index, nodes))
            .on('mouseout', (data, index, nodes) => this.mouserectMouseOut(d3_event, index, nodes))
            .on('click', (data, index, nodes) => this.mouserectMouseClick());
        this.tooltipLine = this.svg
            .append('line')
            .attr('y1', 0)
            .attr('y2', this.height)
            .attr('class', 'tooltip-line');
        // define color range
        this.colorRange = d3_scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
        // add glow def
        this._dataviz.createGlowFilter(this.svg);
        // X AXIS
        this.xAxisScale = d3_scaleTime()
            .domain(d3_extent(this.data.dates, (d, i) => {
            return d3_isoParse(d);
        }))
            .range([0, this.width - this.margin.left - this.margin.right]);
        this.xAxisCall = d3_axisBottom(this.xAxisScale)
            .ticks(+this.xAxisTicks)
            .tickSize(this.xAxisTickSize)
            .tickSizeOuter(this.xAxisTickSizeOuter)
            .tickFormat(this.xAxisFormatter);
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
            this.xGridCall = d3_axisBottom(this.xAxisScale).tickSize(-this.height);
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
                .join(enter => enter.append('tr'));
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
PbdsDatavizLineComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-line',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
PbdsDatavizLineComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller },
    { type: Location }
];
PbdsDatavizLineComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    lineClass: [{ type: HostBinding, args: ['class.pbds-chart-line',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    type: [{ type: Input }],
    area: [{ type: Input }],
    xAxisFormatString: [{ type: Input }],
    xAxisTicks: [{ type: Input }],
    yAxisFormatString: [{ type: Input }],
    yAxisTicks: [{ type: Input }],
    yAxisMinBuffer: [{ type: Input }],
    yAxisMaxBuffer: [{ type: Input }],
    hideXGrid: [{ type: Input }],
    hideYGrid: [{ type: Input }],
    hideLegend: [{ type: Input }],
    legendWidth: [{ type: Input }],
    legendPosition: [{ type: Input }],
    legendLabelFormatType: [{ type: Input }],
    legendLabelFormatString: [{ type: Input }],
    tooltipHeadingFormatString: [{ type: Input }],
    tooltipLabelFormatType: [{ type: Input }],
    tooltipLabelFormatString: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    theme: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }],
    tooltipHovered: [{ type: Output }],
    tooltipClicked: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1saW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZGEwNTdjby9EZXNrdG9wL0NvZGUvbmctZGVzaWduc3lzdGVtL2NsaWVudC9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotbGluZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUdYLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFN0QsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxLQUFLLElBQUksUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsZUFBZSxJQUFJLGtCQUFrQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ25HLE9BQU8sRUFBRSxZQUFZLElBQUksZUFBZSxFQUFFLFdBQVcsSUFBSSxjQUFjLEVBQUUsU0FBUyxJQUFJLFlBQVksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNySCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsVUFBVSxJQUFJLGFBQWEsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMxRyxPQUFPLEVBQUUsVUFBVSxJQUFJLGFBQWEsRUFBRSxRQUFRLElBQUksV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2hELE9BQU8sRUFB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MEJBR0wsS0FBSzs2QkFHTCxLQUFLO29DQUdMLEtBQUs7c0NBR0wsS0FBSzt5Q0FHTCxLQUFLO3FDQUdMLEtBQUs7dUNBR0wsS0FBSztxQ0FHTCxLQUFLO3VDQUdMLEtBQUs7d0JBR0wsS0FBSzswQkFHTCxLQUFLOzJCQUdMLEtBQUs7eUJBR0wsS0FBSztvQkFHTCxLQUFLO3NCQUdMLE1BQU07c0JBR04sTUFBTTs2QkFHTixNQUFNOzZCQUdOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyLCBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QsIGV2ZW50IGFzIGQzX2V2ZW50LCBtb3VzZSBhcyBkM19tb3VzZSB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBsaW5lIGFzIGQzX2xpbmUsIGFyZWEgYXMgZDNfYXJlYSwgY3VydmVDYXRtdWxsUm9tIGFzIGQzX2N1cnZlQ2F0bXVsbFJvbSB9IGZyb20gJ2QzLXNoYXBlJztcbmltcG9ydCB7IHNjYWxlT3JkaW5hbCBhcyBkM19zY2FsZU9yZGluYWwsIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLCBzY2FsZVRpbWUgYXMgZDNfc2NhbGVUaW1lIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgbWluIGFzIGQzX21pbiwgbWF4IGFzIGQzX21heCwgZXh0ZW50IGFzIGQzX2V4dGVudCwgYmlzZWN0TGVmdCBhcyBkM19iaXNlY3RMZWZ0IH0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHsgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLCBheGlzTGVmdCBhcyBkM19heGlzTGVmdCB9IGZyb20gJ2QzLWF4aXMnO1xuaW1wb3J0IHsgZm9ybWF0IGFzIGQzX2Zvcm1hdCB9IGZyb20gJ2QzLWZvcm1hdCc7XG5pbXBvcnQgeyBpc29QYXJzZSBhcyBkM19pc29QYXJzZSwgaXNvRm9ybWF0IGFzIGQzX2lzb0Zvcm1hdCwgdGltZUZvcm1hdCBhcyBkM190aW1lRm9ybWF0IH0gZnJvbSAnZDMtdGltZS1mb3JtYXQnO1xuaW1wb3J0IHsgZWFzZVF1YWRJbk91dCBhcyBkM19lYXNlUXVhZEluT3V0IH0gZnJvbSAnZDMtZWFzZSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6TGluZSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuLy8gYXNzaWduIGFuIElEIGZvciBlYWNoIGNvbXBvbmVudCBpbnN0YW5jZVxubGV0IG5leHRJZCA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1saW5lJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekxpbmVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWxpbmUnKVxuICBsaW5lQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IFBiZHNEYXRhdml6TGluZTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwNjtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ21lZGl1bScgfCAnaGlnaCcgfCAnZGVidWcnID0gJ21lZGl1bSc7IC8vIGRlYnVnIHRvIHNob3cgYWxsIGNoYXJ0IG9wdGlvbnNcblxuICBASW5wdXQoKVxuICBhcmVhID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB4QXhpc1RpY2tzID0gNjtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzVGlja3MgPSA1O1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWluQnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICB5QXhpc01heEJ1ZmZlciA9IDAuMDE7XG5cbiAgQElucHV0KClcbiAgaGlkZVhHcmlkID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBoaWRlWUdyaWQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDEwNSArIDI4OyAvLyBoYXJkY29kZWQgbGVnZW5kIHdpZHRoICsgbGVmdCBtYXJnaW4sIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFBvc2l0aW9uOiAncmlnaHQnIHwgJ2JvdHRvbScgPSAncmlnaHQnO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDEwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAyMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDMwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDU1OyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgdGhlbWU7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHRvb2x0aXBIb3ZlcmVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBPdXRwdXQoKVxuICB0b29sdGlwQ2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtb3VzZXJlY3Q7XG4gIHByaXZhdGUgdG9vbHRpcExpbmU7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNsaXBQYXRoSWQ7XG4gIHByaXZhdGUgZDNsaW5lO1xuICBwcml2YXRlIGQzYXJlYTtcbiAgcHJpdmF0ZSBsaW5lV2lkdGg7XG4gIHByaXZhdGUgbGluZUN1cnZlZDtcbiAgcHJpdmF0ZSBsaW5lUG9pbnRzO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgeEF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XG4gIHByaXZhdGUgeEF4aXM7XG4gIHByaXZhdGUgeEF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeUF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB5QXhpc0NhbGw7XG4gIHByaXZhdGUgeUF4aXM7XG4gIHByaXZhdGUgeUF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeEdyaWQ7XG4gIHByaXZhdGUgeEdyaWRDYWxsO1xuICBwcml2YXRlIHlHcmlkO1xuICBwcml2YXRlIHlHcmlkQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHlBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIGhpZGVYQXhpczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXM6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSBoaWRlVG9vbHRpcDogYm9vbGVhbjtcbiAgcHJpdmF0ZSB0b29sdGlwSGVhZGluZ0Zvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcExhYmVsRm9ybWF0O1xuICBwcml2YXRlIG1vdXNlZGF0YTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIsXG4gICAgcHJpdmF0ZSBfbG9jYXRpb246IExvY2F0aW9uXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIHRoaXMuY2xpcFBhdGhJZCA9IG5leHRJZDtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IGQzX3RpbWVGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy55QXhpc0Zvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSwgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdCA9IGQzX3RpbWVGb3JtYXQodGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGRlZmF1bHRzIGZvciBhbGwgY2hhcnQgdHlwZXNcbiAgICB0aGlzLmxpbmVXaWR0aCA9IDM7XG4gICAgdGhpcy5saW5lQ3VydmVkID0gdHJ1ZTtcbiAgICB0aGlzLmxpbmVQb2ludHMgPSB0cnVlO1xuICAgIHRoaXMuaGlkZVhBeGlzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc1plcm8gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1plcm8gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlVG9vbHRpcCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gZmFsc2U7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnhBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnlBeGlzVGlja1NpemVPdXRlciA9IDA7XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XG4gICAgICAvLyBzZXQgdHlwZSBkZWZhdWx0c1xuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdoaWdoJzpcbiAgICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IDI7XG4gICAgICAgICAgdGhpcy5saW5lQ3VydmVkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5saW5lUG9pbnRzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmhpZGVZR3JpZCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFkanVzdCBtYXJnaW4gaWYgeEF4aXMgaGlkZGVuXG4gICAgaWYgKHRoaXMuaGlkZVhBeGlzKSB0aGlzLm1hcmdpbi5ib3R0b20gPSAxMDsgLy8gbmVlZCBzbWFsbCBtYXJnaW4gZm9yIHlBeGlzIHdpdGggMCB0aWNrIGxhYmVsXG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCAmJiB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICB0aGlzLndpZHRoID0gK3RoaXMud2lkdGggLSArdGhpcy5sZWdlbmRXaWR0aDtcbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgbGluZVxuICAgIHRoaXMuZDNsaW5lID0gZDNfbGluZSgpXG4gICAgICAueCgoZDogYW55LCBpKSA9PiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmRhdGVzW2ldKSkpXG4gICAgICAueSgoZDogYW55KSA9PiB0aGlzLnlBeGlzU2NhbGUoZCkpO1xuXG4gICAgLy8gZGVmaW5lIGxpbmUgY3VydmVcbiAgICBpZiAodGhpcy5saW5lQ3VydmVkKSB7XG4gICAgICB0aGlzLmQzbGluZS5jdXJ2ZShkM19jdXJ2ZUNhdG11bGxSb20uYWxwaGEoMC41KSk7XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIGFyZWFcbiAgICBpZiAodGhpcy5hcmVhKSB7XG4gICAgICB0aGlzLmQzYXJlYSA9IGQzX2FyZWEoKVxuICAgICAgICAueCgoZDogYW55LCBpKSA9PiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmRhdGVzW2ldKSkpXG4gICAgICAgIC55MCh0aGlzLmhlaWdodClcbiAgICAgICAgLnkxKChkOiBhbnksIGkpID0+IHRoaXMueUF4aXNTY2FsZShkKSk7XG5cbiAgICAgIGlmICh0aGlzLmxpbmVDdXJ2ZWQpIHtcbiAgICAgICAgdGhpcy5kM2FyZWEuY3VydmUoZDNfY3VydmVDYXRtdWxsUm9tLmFscGhhKDAuNSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ucmlnaHQpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5yaWdodH0gJHsrdGhpcy5oZWlnaHQgK1xuICAgICAgICAgIHRoaXMubWFyZ2luLnRvcCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4uYm90dG9tfWBcbiAgICAgICk7XG5cbiAgICAvLyBhZGQgcmVjdGFuZ2xlIHRvIGNhcHR1cmUgbW91c2VcbiAgICB0aGlzLm1vdXNlcmVjdCA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHQpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbW91c2VyZWN0JylcbiAgICAgIC5vbignbW91c2Vtb3ZlJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5tb3VzZXJlY3RNb3VzZU1vdmUoZDNfZXZlbnQsIGluZGV4LCBub2RlcykpXG4gICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5tb3VzZXJlY3RNb3VzZU91dChkM19ldmVudCwgaW5kZXgsIG5vZGVzKSlcbiAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLm1vdXNlcmVjdE1vdXNlQ2xpY2soKSk7XG5cbiAgICB0aGlzLnRvb2x0aXBMaW5lID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3kxJywgMClcbiAgICAgIC5hdHRyKCd5MicsIHRoaXMuaGVpZ2h0KVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtbGluZScpO1xuXG4gICAgLy8gZGVmaW5lIGNvbG9yIHJhbmdlXG4gICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVPcmRpbmFsKCkucmFuZ2UodGhpcy5fZGF0YXZpei5nZXRDb2xvcnMoZmFsc2UsIHRoaXMudGhlbWUpKTtcblxuICAgIC8vIGFkZCBnbG93IGRlZlxuICAgIHRoaXMuX2RhdGF2aXouY3JlYXRlR2xvd0ZpbHRlcih0aGlzLnN2Zyk7XG5cbiAgICAvLyBYIEFYSVNcbiAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZVRpbWUoKVxuICAgICAgLmRvbWFpbihcbiAgICAgICAgZDNfZXh0ZW50KHRoaXMuZGF0YS5kYXRlcywgKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIHJldHVybiBkM19pc29QYXJzZShkKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuXG4gICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgIC50aWNrcygrdGhpcy54QXhpc1RpY2tzKVxuICAgICAgLnRpY2tTaXplKHRoaXMueEF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy54QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnhBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy14JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApIC8vJHstdGhpcy5tYXJnaW4ucmlnaHQgLyAyfVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXMpXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc0RvbWFpbilcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzVGlja3MpXG4gICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAvLyBYIEdSSURMSU5FU1xuICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAgIHRoaXMueEdyaWRDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpLnRpY2tTaXplKC10aGlzLmhlaWdodCk7XG5cbiAgICAgIHRoaXMueEdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC14JylcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7dGhpcy5oZWlnaHR9KWApIC8vJHstdGhpcy5tYXJnaW4ucmlnaHQgLyAyfVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gWSBBWElTXG4gICAgdGhpcy55QXhpc1NjYWxlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbXG4gICAgICAgIGQzX21pbih0aGlzLmRhdGEuc2VyaWVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWluVmFsID0gK2QzX21pbihkLnZhbHVlcyk7XG4gICAgICAgICAgcmV0dXJuIG1pblZhbCAtIG1pblZhbCAqICt0aGlzLnlBeGlzTWluQnVmZmVyO1xuICAgICAgICB9KSxcbiAgICAgICAgZDNfbWF4KHRoaXMuZGF0YS5zZXJpZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBtYXhWYWwgPSArZDNfbWF4KGQudmFsdWVzKTtcbiAgICAgICAgICByZXR1cm4gbWF4VmFsICsgbWF4VmFsICogdGhpcy55QXhpc01heEJ1ZmZlcjtcbiAgICAgICAgfSlcbiAgICAgIF0pXG4gICAgICAubmljZSgpXG4gICAgICAucmFuZ2UoW3RoaXMuaGVpZ2h0LCAwXSk7XG5cbiAgICB0aGlzLnlBeGlzQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAudGlja1NpemUodGhpcy55QXhpc1RpY2tTaXplKVxuICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy55QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAudGlja0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0dGVyKTtcblxuICAgIHRoaXMueUF4aXMgPSB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXknKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXMpXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc0RvbWFpbilcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzVGlja3MpXG4gICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyBZIEdSSURMSU5FU1xuICAgIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcbiAgICAgIHRoaXMueUdyaWRDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgICAudGlja1NpemUoLXRoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHQpO1xuXG4gICAgICB0aGlzLnlHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteScpXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAwKWApXG4gICAgICAgIC5jYWxsKHRoaXMueUdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBUT09MVElQXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBkM19zZWxlY3QoJ2JvZHknKVxuICAgICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAncGJkcy10b29sdGlwIHdlc3QnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcblxuICAgICAgLy8gdG9vbHRpcCBoZWFkZXJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XG5cbiAgICAgIC8vIHRvb2x0aXAgdGFibGVcbiAgICAgIGNvbnN0IHRvb2x0aXBUYWJsZSA9IHRoaXMudG9vbHRpcC5hcHBlbmQoJ3RhYmxlJykuYXR0cignY2xhc3MnLCAndG9vbHRpcC10YWJsZSB0ZXh0LWxlZnQgdy0xMDAnKTtcblxuICAgICAgY29uc3QgdG9vbHRpcFRhYmxlVGJvZHkgPSB0b29sdGlwVGFibGUuYXBwZW5kKCd0Ym9keScpO1xuXG4gICAgICB0b29sdGlwVGFibGVUYm9keVxuICAgICAgICAuc2VsZWN0QWxsKCd0cicpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgICAgLmpvaW4oZW50ZXIgPT4gZW50ZXIuYXBwZW5kKCd0cicpKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgbGVnZW5kIGNsYXNzZXNcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgY2xpcCBwYXRoIGZvciBsaW5lIGFuaW1hdGlvblxuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdjbGlwUGF0aCcpXG4gICAgICAuYXR0cignaWQnLCBgY2xpcC1wYXRoLSR7dGhpcy5jbGlwUGF0aElkfWApXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoIC0gK3RoaXMubWFyZ2luLmxlZnQgLSArdGhpcy5tYXJnaW4ucmlnaHQpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0KTtcblxuICAgIC8vIGFkZCBjbGlwIHBhdGggZm9yIHBvaW50cyBhbmltYXRpb25cbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnY2xpcFBhdGgnKVxuICAgICAgLmF0dHIoJ2lkJywgYGNsaXAtcGF0aC1wb2ludHMtJHt0aGlzLmNsaXBQYXRoSWR9YClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggKyArdGhpcy5tYXJnaW4ubGVmdCAtICt0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgtJHt0aGlzLm1hcmdpbi5sZWZ0fSwgMClgKTtcblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcblxuICAgIG5leHRJZCsrO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMubW91c2VyZWN0LmRhdGEodGhpcy5kYXRhKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgeFNjYWxlXG4gICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbihcbiAgICAgIGQzX2V4dGVudCh0aGlzLmRhdGEuZGF0ZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIGQzX2lzb1BhcnNlKGQpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gdXBkYXRlIHRoZSB5U2NhbGVcbiAgICB0aGlzLnlBeGlzU2NhbGVcbiAgICAgIC5kb21haW4oW1xuICAgICAgICBkM19taW4odGhpcy5kYXRhLnNlcmllcywgKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1pblZhbCA9ICtkM19taW4oZC52YWx1ZXMpO1xuICAgICAgICAgIHJldHVybiBtaW5WYWwgLSBtaW5WYWwgKiArdGhpcy55QXhpc01pbkJ1ZmZlcjtcbiAgICAgICAgfSksXG4gICAgICAgIGQzX21heCh0aGlzLmRhdGEuc2VyaWVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF4VmFsID0gK2QzX21heChkLnZhbHVlcyk7XG4gICAgICAgICAgcmV0dXJuIG1heFZhbCArIG1heFZhbCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG4gICAgICAgIH0pXG4gICAgICBdKVxuICAgICAgLm5pY2UoKTtcblxuICAgIHRoaXMueEF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgdGhpcy55QXhpc1xuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIGdyaWRzXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZFxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgdGhpcy55R3JpZFxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gbGluZXNcbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgncGF0aC5saW5lJylcbiAgICAgIC5hdHRyKCdmaWx0ZXInLCAoKSA9PiAodGhpcy50eXBlICE9PSAnaGlnaCcgPyBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucGF0aCgpfSNnbG93KWAgOiBudWxsKSlcbiAgICAgIC5kYXRhKHRoaXMuZGF0YS5zZXJpZXMpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT4ge1xuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGlwLXBhdGgnLCBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucGF0aCgpfSNjbGlwLXBhdGgtJHt0aGlzLmNsaXBQYXRoSWR9KWApXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGluZScpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLmxpbmVXaWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdkJywgZGF0YSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gbmV3IEFycmF5KGRhdGEudmFsdWVzLmxlbmd0aCkuZmlsbCgwKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZDNsaW5lKGFycmF5KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2FsbChlbnRlciA9PlxuICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkJywgZGF0YSA9PiB0aGlzLmQzbGluZShkYXRhLnZhbHVlcykpXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICB1cGRhdGUuY2FsbCh1cGRhdGUgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cignZCcsIGQgPT4gdGhpcy5kM2xpbmUoZC52YWx1ZXMpKVxuICAgICAgICAgICksXG4gICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgKTtcblxuICAgIC8vIGFyZWFcbiAgICBpZiAodGhpcy5hcmVhKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCdwYXRoLmFyZWEnKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEuc2VyaWVzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGlwLXBhdGgnLCBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucGF0aCgpfSNjbGlwLXBhdGgtJHt0aGlzLmNsaXBQYXRoSWR9KWApXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdhcmVhJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2QnLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJheSA9IG5ldyBBcnJheShkYXRhLnZhbHVlcy5sZW5ndGgpLmZpbGwoMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZDNhcmVhKGFycmF5KTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnN0eWxlKCdjb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAuY2FsbChlbnRlciA9PlxuICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgICAuYXR0cignZCcsIGRhdGEgPT4gdGhpcy5kM2FyZWEoZGF0YS52YWx1ZXMpKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgdXBkYXRlLmNhbGwodXBkYXRlID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkJywgZCA9PiB0aGlzLmQzYXJlYShkLnZhbHVlcykpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gY2lyY2xlc1xuICAgIGlmICh0aGlzLmxpbmVQb2ludHMpIHtcbiAgICAgIC8vIGFkZCBwb2ludHNcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJ2cucG9pbnRzJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncG9pbnRzJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsaXAtcGF0aCcsIGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wYXRoKCl9I2NsaXAtcGF0aC1wb2ludHMtJHt0aGlzLmNsaXBQYXRoSWR9KWApXG4gICAgICAgICAgICAgIC5zdHlsZSgnY29sb3InLCAoZCwgaSkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuXG4gICAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgICAgICAgIC5kYXRhKGQgPT4gZC52YWx1ZXMpXG4gICAgICAgICAgICAgIC5qb2luKFxuICAgICAgICAgICAgICAgIGVudGVyID0+XG4gICAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCwgaSkgPT4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5kYXRlc1tpXSkpKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCBkID0+IHRoaXMueUF4aXNTY2FsZSgwKSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3InLCB0aGlzLmxpbmVXaWR0aCAqIDIpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy5saW5lV2lkdGgpXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKGVudGVyID0+XG4gICAgICAgICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjeScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQpKVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICgpID0+IHt9LFxuICAgICAgICAgICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgICAgICAgIC5kYXRhKGQgPT4gZC52YWx1ZXMpXG4gICAgICAgICAgICAgIC5qb2luKFxuICAgICAgICAgICAgICAgIGVudGVyID0+XG4gICAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCwgaSkgPT4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5kYXRlc1tpXSkpKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkKSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3InLCB0aGlzLmxpbmVXaWR0aCAqIDIpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy5saW5lV2lkdGgpLFxuICAgICAgICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgICAgICAgdXBkYXRlLmNhbGwodXBkYXRlID0+XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkLCBpKSA9PiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmRhdGVzW2ldKSkpXG4gICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZCkpXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0XG4gICAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEuc2VyaWVzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaSA9IGVudGVyLmFwcGVuZCgnbGknKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtaXRlbScpO1xuXG4gICAgICAgICAgICBsaS5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWtleScpXG4gICAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKTtcblxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgICAgICAgIC5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdXBkYXRlID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubGVnZW5kTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4gdGhpcy5sZWdlbmRNb3VzZU91dCgpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5sZWdlbmRNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcFxuICAgICAgICAuc2VsZWN0KCcudG9vbHRpcC10YWJsZScpXG4gICAgICAgIC5zZWxlY3RBbGwoJ3RyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgZW50ZXIgPT4ge1xuICAgICAgICAgICAgY29uc3QgdG9vbHRpcEl0ZW0gPSBlbnRlci5hcHBlbmQoJ3RyJykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1pdGVtJyk7XG5cbiAgICAgICAgICAgIHRvb2x0aXBJdGVtXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3RkJylcbiAgICAgICAgICAgICAgLnN0eWxlKCdjb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcC1rZXknKTtcblxuICAgICAgICAgICAgdG9vbHRpcEl0ZW1cbiAgICAgICAgICAgICAgLmFwcGVuZCgndGQnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndG9vbHRpcC1sYWJlbCBwci0yIHRleHQtbm93cmFwJylcbiAgICAgICAgICAgICAgLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSA/IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGQubGFiZWwpIDogZC5sYWJlbDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRvb2x0aXBJdGVtXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3RkJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdmFsdWUgdGV4dC1yaWdodCB0ZXh0LW5vd3JhcCcpXG4gICAgICAgICAgICAgIC5odG1sKGQgPT4gJycpO1xuXG4gICAgICAgICAgICByZXR1cm4gdG9vbHRpcEl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoKSA9PiB7fSxcbiAgICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5wb2ludHMnKS5yYWlzZSgpO1xuICAgIHRoaXMubW91c2VyZWN0LnJhaXNlKCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2FjdGl2ZScsIHRydWUpO1xuXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGluZVBvaW50cykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnBvaW50cycpXG4gICAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcbiAgICB9XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKVxuICAgICAgLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcblxuICAgIGlmICh0aGlzLmxpbmVQb2ludHMpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgIC5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSlcbiAgICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFyZWEpIHtcbiAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmFyZWEnKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBtb3VzZXJlY3RNb3VzZU1vdmUgPSAoZXZlbnQsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGNvbnN0IG1vdXNlWERhdGUgPSB0aGlzLnhBeGlzU2NhbGUuaW52ZXJ0KGQzX21vdXNlKG5vZGVzWzBdKVswXSk7IC8vIHJldHVybiBkYXRlIGF0IG1vdXNlIHggcG9zaXRpb25cbiAgICBjb25zdCBsZWZ0SW5kZXggPSBkM19iaXNlY3RMZWZ0KHRoaXMuZGF0YS5kYXRlcywgZDNfaXNvRm9ybWF0KG1vdXNlWERhdGUpKTsgLy8gaW5kZXggb2YgbGVmdCBjbG9zZXN0IGRhdGVcblxuICAgIC8vIHByZXZlbnQgZXJyb3IgZm9yIDAgaW5kZXhcbiAgICBpZiAobGVmdEluZGV4ID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBkYXRlTG93ZXIgPSBuZXcgRGF0ZSh0aGlzLmRhdGEuZGF0ZXNbbGVmdEluZGV4IC0gMV0pO1xuICAgIGNvbnN0IGRhdGVVcHBlciA9IG5ldyBEYXRlKHRoaXMuZGF0YS5kYXRlc1tsZWZ0SW5kZXhdKTtcbiAgICBjb25zdCBjbG9zZXN0RGF0ZSA9ICttb3VzZVhEYXRlIC0gK2RhdGVMb3dlciA+ICtkYXRlVXBwZXIgLSBtb3VzZVhEYXRlID8gZGF0ZVVwcGVyIDogZGF0ZUxvd2VyOyAvLyBkYXRlIG1vdXNlIGlzIGNsb3Nlc3QgdG9cbiAgICBjb25zdCBjbG9zZXN0SW5kZXggPSB0aGlzLmRhdGEuZGF0ZXMuaW5kZXhPZihkM19pc29Gb3JtYXQoY2xvc2VzdERhdGUpKTsgLy8gd2hpY2ggaW5kZXggdGhlIG1vdXNlIGlzIGNsb3Nlc3QgdG9cbiAgICAvLyBjb25zb2xlLmxvZygrbW91c2VYRGF0ZSwgbGVmdEluZGV4LCArZGF0ZUxvd2VyLCArZGF0ZVVwcGVyLCArY2xvc2VzdERhdGUsIGNsb3Nlc3RJbmRleCk7XG5cbiAgICBjb25zdCBjaXJjbGVzID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcubGluZS1ncm91cCcpLnNlbGVjdEFsbCgnY2lyY2xlJyk7XG4gICAgY2lyY2xlcy5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGNsb3Nlc3RJbmRleCkuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG4gICAgY2lyY2xlcy5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGNsb3Nlc3RJbmRleCkuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy50b29sdGlwTGluZVxuICAgICAgLmF0dHIoJ3gxJywgdGhpcy54QXhpc1NjYWxlKGNsb3Nlc3REYXRlKSlcbiAgICAgIC5hdHRyKCd4MicsIHRoaXMueEF4aXNTY2FsZShjbG9zZXN0RGF0ZSkpXG4gICAgICAuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRvb2x0aXBMaW5lLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCkpO1xuICAgIHRoaXMudG9vbHRpcFNob3codGhpcy50b29sdGlwTGluZS5ub2RlKCksIGNsb3Nlc3RJbmRleCk7XG5cbiAgICB0aGlzLm1vdXNlZGF0YSA9IHtcbiAgICAgIGRhdGU6IGNsb3Nlc3REYXRlLFxuICAgICAgc2VyaWVzOiB0aGlzLmRhdGEuc2VyaWVzLm1hcChkID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsYWJlbDogZC5sYWJlbCxcbiAgICAgICAgICB2YWx1ZTogZC52YWx1ZXNbY2xvc2VzdEluZGV4XVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICB9O1xuXG4gICAgdGhpcy50b29sdGlwSG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGE6IHRoaXMubW91c2VkYXRhIH0pO1xuICB9O1xuXG4gIG1vdXNlcmVjdE1vdXNlT3V0ID0gKGV2ZW50LCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJ2NpcmNsZScpLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcbiAgICB0aGlzLnRvb2x0aXBMaW5lLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgbW91c2VyZWN0TW91c2VDbGljayA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBDbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YTogdGhpcy5tb3VzZWRhdGEgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChub2RlLCBjbG9zZXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBjb25zdCBtb3VzZXJlY3REaW1lbnNpb25zID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHRvb2x0aXBEaW1lbnNpb25zID0gdGhpcy50b29sdGlwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkaW1lbnNpb25DYWxjdWxhdGVkID0gbW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgdG9vbHRpcERpbWVuc2lvbnMud2lkdGggKyA4O1xuICAgIGNvbnN0IGNsaWVudFdpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIDEwO1xuICAgIGxldCBwb3NpdGlvbjtcblxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbCwgbW91c2VyZWN0RGltZW5zaW9ucywgdG9vbHRpcE9mZnNldEhlaWdodCwgdG9vbHRpcERpbWVuc2lvbnMsIGRpbWVuc2lvbkNhbGN1bGF0ZWQsIGNsaWVudFdpZHRoKTtcblxuICAgIHRoaXMudG9vbHRpcC5zZWxlY3QoJy50b29sdGlwLWhlYWRlcicpLmh0bWwoZCA9PiB7XG4gICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UodGhpcy5kYXRhLmRhdGVzW2Nsb3Nlc3RJbmRleF0pO1xuICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0QWxsKCcudG9vbHRpcC12YWx1ZScpLmh0bWwoKGQsIGkpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGVcbiAgICAgICAgPyB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCh0aGlzLmRhdGEuc2VyaWVzW2ldLnZhbHVlc1tjbG9zZXN0SW5kZXhdKVxuICAgICAgICA6IHRoaXMuZGF0YS5zZXJpZXNbaV0udmFsdWVzW2Nsb3Nlc3RJbmRleF07XG4gICAgfSk7XG5cbiAgICAvLyBmbGlwIHRoZSB0b29sdGlwIHBvc2l0aW9ucyBpZiBuZWFyIHRoZSByaWdodCBlZGdlIG9mIHRoZSBzY3JlZW5cbiAgICBpZiAoZGltZW5zaW9uQ2FsY3VsYXRlZCA+IGNsaWVudFdpZHRoKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIHRydWUpO1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3dlc3QnLCBmYWxzZSk7XG4gICAgICBwb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCAtIHRvb2x0aXBEaW1lbnNpb25zLndpZHRoIC0gOH1weGA7XG4gICAgfSBlbHNlIGlmIChkaW1lbnNpb25DYWxjdWxhdGVkIDwgY2xpZW50V2lkdGgpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdlYXN0JywgZmFsc2UpO1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3dlc3QnLCB0cnVlKTtcbiAgICAgIHBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgOH1weGA7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ1BPU0lUSU9OOiAnLCBwb3NpdGlvbiwgbW91c2VyZWN0RGltZW5zaW9ucyk7XG5cbiAgICAvLyBzZXQgdGhlIHRvb2x0aXAgc3R5bGVzXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKFxuICAgICAgJ3RvcCcsXG4gICAgICBgJHttb3VzZXJlY3REaW1lbnNpb25zLnRvcCArIG1vdXNlcmVjdERpbWVuc2lvbnMuaGVpZ2h0IC8gMiAtIHRvb2x0aXBPZmZzZXRIZWlnaHQgLyAyICsgc2Nyb2xsWzFdfXB4YFxuICAgICk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgcG9zaXRpb24pO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KGl0ZW0pO1xuICB9O1xufVxuIl19
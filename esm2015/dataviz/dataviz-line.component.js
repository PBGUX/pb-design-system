import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { select as d3_select, pointer as d3_pointer } from 'd3-selection';
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
                .attr('filter', () => (this.type !== 'high' ? `url(${this._location.path()}#glow)` : null))
                .data(this.data.series)
                .join((enter) => {
                enter
                    .append('path')
                    .attr('clip-path', `url(${this._location.path()}#clip-path-${this.clipPathId})`)
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
                    .attr('clip-path', `url(${this._location.path()}#clip-path-${this.clipPathId})`)
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
                    .attr('clip-path', `url(${this._location.path()}#clip-path-points-${this.clipPathId})`)
                    .style('color', (d, i) => this.colorRange(d.label))
                    .selectAll('circle')
                    .data((d) => d.values)
                    .join((enter) => enter
                    .append('circle')
                    .attr('cx', (d, i) => this.xAxisScale(d3_isoParse(this.data.dates[i])))
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
                    .attr('cx', (d, i) => this.xAxisScale(d3_isoParse(this.data.dates[i])))
                    .attr('cy', (d) => this.yAxisScale(d))
                    .attr('r', this.lineWidth * 2)
                    .style('stroke-width', this.lineWidth), (update) => update.call((update) => update
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('cx', (d, i) => this.xAxisScale(d3_isoParse(this.data.dates[i])))
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
            const mouseXDate = this.xAxisScale.invert(d3_pointer(event)[0]); // return date at mouse x position
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
                series: this.data.series.map((d) => {
                    return {
                        label: d.label,
                        value: d.values[closestIndex]
                    };
                })
            };
            this.tooltipHovered.emit({ event, data: this.mousedata });
        };
        this.mouserectMouseOut = (event, data) => {
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
            this.tooltip.select('.tooltip-header').html((d) => {
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
        this.xAxisFormatter = (item) => {
            const parseDate = d3_isoParse(item);
            return this.xAxisFormat(parseDate);
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
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom}`);
        // add rectangle to capture mouse
        this.mouserect = this.svg
            .append('rect')
            .attr('width', this.width - this.margin.left - this.margin.right)
            .attr('height', this.height)
            .attr('class', 'mouserect')
            .on('mousemove', (event, data) => this.mouserectMouseMove(event, data))
            .on('mouseout', (event, data) => this.mouserectMouseOut(event, data))
            .on('click', (event, data) => this.mouserectMouseClick());
        this.tooltipLine = this.svg.append('line').attr('y1', 0).attr('y2', this.height).attr('class', 'tooltip-line');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1saW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0YXZpei9kYXRhdml6LWxpbmUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFHWCx1QkFBdUIsRUFDeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTdELE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE9BQU8sSUFBSSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUUsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxlQUFlLElBQUksa0JBQWtCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbkcsT0FBTyxFQUFFLFlBQVksSUFBSSxlQUFlLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxTQUFTLElBQUksWUFBWSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JILE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFHLE9BQU8sRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDL0UsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDaEQsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsU0FBUyxJQUFJLFlBQVksRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLE1BQU0s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TUFBTTthQUNoRDs7O1lBWFEsa0JBQWtCO1lBbEJ6QixVQUFVO1lBT0gsZ0JBQWdCO1lBQUUsUUFBUTs7O3lCQXdCaEMsV0FBVyxTQUFDLGtCQUFrQjt3QkFHOUIsV0FBVyxTQUFDLHVCQUF1QjttQkFHbkMsS0FBSztvQkFHTCxLQUFLO3FCQUdMLEtBQUs7bUJBR0wsS0FBSzttQkFHTCxLQUFLO2dDQUdMLEtBQUs7eUJBR0wsS0FBSztnQ0FHTCxLQUFLO3lCQUdMLEtBQUs7NkJBR0wsS0FBSzs2QkFHTCxLQUFLO3dCQUdMLEtBQUs7d0JBR0wsS0FBSzt5QkFHTCxLQUFLOzBCQUdMLEtBQUs7NkJBR0wsS0FBSztvQ0FHTCxLQUFLO3NDQUdMLEtBQUs7eUNBR0wsS0FBSztxQ0FHTCxLQUFLO3VDQUdMLEtBQUs7cUNBR0wsS0FBSzt1Q0FHTCxLQUFLO3dCQUdMLEtBQUs7MEJBR0wsS0FBSzsyQkFHTCxLQUFLO3lCQUdMLEtBQUs7b0JBR0wsS0FBSztzQkFHTCxNQUFNO3NCQUdOLE1BQU07NkJBR04sTUFBTTs2QkFHTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciwgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0LCBwb2ludGVyIGFzIGQzX3BvaW50ZXIgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgbGluZSBhcyBkM19saW5lLCBhcmVhIGFzIGQzX2FyZWEsIGN1cnZlQ2F0bXVsbFJvbSBhcyBkM19jdXJ2ZUNhdG11bGxSb20gfSBmcm9tICdkMy1zaGFwZSc7XG5pbXBvcnQgeyBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsLCBzY2FsZUxpbmVhciBhcyBkM19zY2FsZUxpbmVhciwgc2NhbGVUaW1lIGFzIGQzX3NjYWxlVGltZSB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IG1pbiBhcyBkM19taW4sIG1heCBhcyBkM19tYXgsIGV4dGVudCBhcyBkM19leHRlbnQsIGJpc2VjdExlZnQgYXMgZDNfYmlzZWN0TGVmdCB9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7IGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSwgYXhpc0xlZnQgYXMgZDNfYXhpc0xlZnQgfSBmcm9tICdkMy1heGlzJztcbmltcG9ydCB7IGZvcm1hdCBhcyBkM19mb3JtYXQgfSBmcm9tICdkMy1mb3JtYXQnO1xuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UsIGlzb0Zvcm1hdCBhcyBkM19pc29Gb3JtYXQsIHRpbWVGb3JtYXQgYXMgZDNfdGltZUZvcm1hdCB9IGZyb20gJ2QzLXRpbWUtZm9ybWF0JztcbmltcG9ydCB7IGVhc2VRdWFkSW5PdXQgYXMgZDNfZWFzZVF1YWRJbk91dCB9IGZyb20gJ2QzLWVhc2UnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekxpbmUgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbi8vIGFzc2lnbiBhbiBJRCBmb3IgZWFjaCBjb21wb25lbnQgaW5zdGFuY2VcbmxldCBuZXh0SWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotbGluZScsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpMaW5lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1saW5lJylcbiAgbGluZUNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBQYmRzRGF0YXZpekxpbmU7XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAzMDY7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNDAwO1xuXG4gIEBJbnB1dCgpXG4gIHR5cGU6ICdtZWRpdW0nIHwgJ2hpZ2gnIHwgJ2RlYnVnJyA9ICdtZWRpdW0nOyAvLyBkZWJ1ZyB0byBzaG93IGFsbCBjaGFydCBvcHRpb25zXG5cbiAgQElucHV0KClcbiAgYXJlYSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgeEF4aXNUaWNrcyA9IDY7XG5cbiAgQElucHV0KClcbiAgeUF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB5QXhpc1RpY2tzID0gNTtcblxuICBASW5wdXQoKVxuICB5QXhpc01pbkJ1ZmZlciA9IDAuMDE7XG5cbiAgQElucHV0KClcbiAgeUF4aXNNYXhCdWZmZXIgPSAwLjAxO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVYR3JpZCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgaGlkZVlHcmlkID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBoaWRlTGVnZW5kID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kV2lkdGggPSAxMDUgKyAyODsgLy8gaGFyZGNvZGVkIGxlZ2VuZCB3aWR0aCArIGxlZnQgbWFyZ2luLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBsZWdlbmRQb3NpdGlvbjogJ3JpZ2h0JyB8ICdib3R0b20nID0gJ3JpZ2h0JztcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBIZWFkaW5nRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAxMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gMjA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAzMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkxlZnQgPSA1NTsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lO1xuXG4gIEBPdXRwdXQoKVxuICBob3ZlcmVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBPdXRwdXQoKVxuICBjbGlja2VkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBPdXRwdXQoKVxuICB0b29sdGlwSG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgdG9vbHRpcENsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgbW91c2VyZWN0O1xuICBwcml2YXRlIHRvb2x0aXBMaW5lO1xuICBwcml2YXRlIG1hcmdpbjtcbiAgcHJpdmF0ZSBjbGlwUGF0aElkO1xuICBwcml2YXRlIGQzbGluZTtcbiAgcHJpdmF0ZSBkM2FyZWE7XG4gIHByaXZhdGUgbGluZVdpZHRoO1xuICBwcml2YXRlIGxpbmVDdXJ2ZWQ7XG4gIHByaXZhdGUgbGluZVBvaW50cztcbiAgcHJpdmF0ZSBjb2xvclJhbmdlO1xuICBwcml2YXRlIHhBeGlzU2NhbGU7XG4gIHByaXZhdGUgeEF4aXNDYWxsO1xuICBwcml2YXRlIHhBeGlzO1xuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xuICBwcml2YXRlIHlBeGlzU2NhbGU7XG4gIHByaXZhdGUgeUF4aXNDYWxsO1xuICBwcml2YXRlIHlBeGlzO1xuICBwcml2YXRlIHlBeGlzRm9ybWF0O1xuICBwcml2YXRlIHhHcmlkO1xuICBwcml2YXRlIHhHcmlkQ2FsbDtcbiAgcHJpdmF0ZSB5R3JpZDtcbiAgcHJpdmF0ZSB5R3JpZENhbGw7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIHlBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXM6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgaGlkZVRvb2x0aXA6IGJvb2xlYW47XG4gIHByaXZhdGUgdG9vbHRpcEhlYWRpbmdGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSBtb3VzZWRhdGE7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZGF0YXZpejogUGJkc0RhdGF2aXpTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyLFxuICAgIHByaXZhdGUgX2xvY2F0aW9uOiBMb2NhdGlvblxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICB0aGlzLmNsaXBQYXRoSWQgPSBuZXh0SWQ7XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMueEF4aXNGb3JtYXQgPSBkM190aW1lRm9ybWF0KHRoaXMueEF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMueUF4aXNGb3JtYXQgPSBkM19mb3JtYXQodGhpcy55QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUsIHRoaXMubGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQgPSBkM190aW1lRm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXG4gICAgdGhpcy5saW5lV2lkdGggPSAzO1xuICAgIHRoaXMubGluZUN1cnZlZCA9IHRydWU7XG4gICAgdGhpcy5saW5lUG9pbnRzID0gdHJ1ZTtcbiAgICB0aGlzLmhpZGVYQXhpcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVRvb2x0aXAgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IGZhbHNlO1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuXG4gICAgaWYgKHRoaXMudHlwZSAhPT0gJ2RlYnVnJykge1xuICAgICAgLy8gc2V0IHR5cGUgZGVmYXVsdHNcbiAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ21lZGl1bSc6XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnaGlnaCc6XG4gICAgICAgICAgdGhpcy5saW5lV2lkdGggPSAyO1xuICAgICAgICAgIHRoaXMubGluZUN1cnZlZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMubGluZVBvaW50cyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhHcmlkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5oaWRlWUdyaWQgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhZGp1c3QgbWFyZ2luIGlmIHhBeGlzIGhpZGRlblxuICAgIGlmICh0aGlzLmhpZGVYQXhpcykgdGhpcy5tYXJnaW4uYm90dG9tID0gMTA7IC8vIG5lZWQgc21hbGwgbWFyZ2luIGZvciB5QXhpcyB3aXRoIDAgdGljayBsYWJlbFxuXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQgJiYgdGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgdGhpcy53aWR0aCA9ICt0aGlzLndpZHRoIC0gK3RoaXMubGVnZW5kV2lkdGg7XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIGxpbmVcbiAgICB0aGlzLmQzbGluZSA9IGQzX2xpbmUoKVxuICAgICAgLngoKGQ6IGFueSwgaSkgPT4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5kYXRlc1tpXSkpKVxuICAgICAgLnkoKGQ6IGFueSkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKTtcblxuICAgIC8vIGRlZmluZSBsaW5lIGN1cnZlXG4gICAgaWYgKHRoaXMubGluZUN1cnZlZCkge1xuICAgICAgdGhpcy5kM2xpbmUuY3VydmUoZDNfY3VydmVDYXRtdWxsUm9tLmFscGhhKDAuNSkpO1xuICAgIH1cblxuICAgIC8vIGRlZmluZSBhcmVhXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgdGhpcy5kM2FyZWEgPSBkM19hcmVhKClcbiAgICAgICAgLngoKGQ6IGFueSwgaSkgPT4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5kYXRlc1tpXSkpKVxuICAgICAgICAueTAodGhpcy5oZWlnaHQpXG4gICAgICAgIC55MSgoZDogYW55LCBpKSA9PiB0aGlzLnlBeGlzU2NhbGUoZCkpO1xuXG4gICAgICBpZiAodGhpcy5saW5lQ3VydmVkKSB7XG4gICAgICAgIHRoaXMuZDNhcmVhLmN1cnZlKGQzX2N1cnZlQ2F0bXVsbFJvbS5hbHBoYSgwLjUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ucmlnaHR9ICR7XG4gICAgICAgICAgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tXG4gICAgICAgIH1gXG4gICAgICApO1xuXG4gICAgLy8gYWRkIHJlY3RhbmdsZSB0byBjYXB0dXJlIG1vdXNlXG4gICAgdGhpcy5tb3VzZXJlY3QgPSB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cignd2lkdGgnLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21vdXNlcmVjdCcpXG4gICAgICAub24oJ21vdXNlbW92ZScsIChldmVudCwgZGF0YSkgPT4gdGhpcy5tb3VzZXJlY3RNb3VzZU1vdmUoZXZlbnQsIGRhdGEpKVxuICAgICAgLm9uKCdtb3VzZW91dCcsIChldmVudCwgZGF0YSkgPT4gdGhpcy5tb3VzZXJlY3RNb3VzZU91dChldmVudCwgZGF0YSkpXG4gICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLm1vdXNlcmVjdE1vdXNlQ2xpY2soKSk7XG5cbiAgICB0aGlzLnRvb2x0aXBMaW5lID0gdGhpcy5zdmcuYXBwZW5kKCdsaW5lJykuYXR0cigneTEnLCAwKS5hdHRyKCd5MicsIHRoaXMuaGVpZ2h0KS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWxpbmUnKTtcblxuICAgIC8vIGRlZmluZSBjb2xvciByYW5nZVxuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpLnJhbmdlKHRoaXMuX2RhdGF2aXouZ2V0Q29sb3JzKGZhbHNlLCB0aGlzLnRoZW1lKSk7XG5cbiAgICAvLyBhZGQgZ2xvdyBkZWZcbiAgICB0aGlzLl9kYXRhdml6LmNyZWF0ZUdsb3dGaWx0ZXIodGhpcy5zdmcpO1xuXG4gICAgLy8gWCBBWElTXG4gICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVUaW1lKClcbiAgICAgIC5kb21haW4oXG4gICAgICAgIGQzX2V4dGVudCh0aGlzLmRhdGEuZGF0ZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgICByZXR1cm4gZDNfaXNvUGFyc2UoZCk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucmFuZ2UoWzAsIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHRdKTtcblxuICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAudGlja3MoK3RoaXMueEF4aXNUaWNrcylcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnhBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKSAvLyR7LXRoaXMubWFyZ2luLnJpZ2h0IC8gMn1cbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgLy8gWCBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKS50aWNrU2l6ZSgtdGhpcy5oZWlnaHQpO1xuXG4gICAgICB0aGlzLnhHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteCcpXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKSAvLyR7LXRoaXMubWFyZ2luLnJpZ2h0IC8gMn1cbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIH1cblxuICAgIC8vIFkgQVhJU1xuICAgIHRoaXMueUF4aXNTY2FsZSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oW1xuICAgICAgICBkM19taW4odGhpcy5kYXRhLnNlcmllcywgKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1pblZhbCA9ICtkM19taW4oZC52YWx1ZXMpO1xuICAgICAgICAgIHJldHVybiBtaW5WYWwgLSBtaW5WYWwgKiArdGhpcy55QXhpc01pbkJ1ZmZlcjtcbiAgICAgICAgfSksXG4gICAgICAgIGQzX21heCh0aGlzLmRhdGEuc2VyaWVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF4VmFsID0gK2QzX21heChkLnZhbHVlcyk7XG4gICAgICAgICAgcmV0dXJuIG1heFZhbCArIG1heFZhbCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG4gICAgICAgIH0pXG4gICAgICBdKVxuICAgICAgLm5pY2UoKVxuICAgICAgLnJhbmdlKFt0aGlzLmhlaWdodCwgMF0pO1xuXG4gICAgdGhpcy55QXhpc0NhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAudGlja3ModGhpcy55QXhpc1RpY2tzKVxuICAgICAgLnRpY2tTaXplKHRoaXMueUF4aXNUaWNrU2l6ZSlcbiAgICAgIC50aWNrU2l6ZU91dGVyKHRoaXMueUF4aXNUaWNrU2l6ZU91dGVyKVxuICAgICAgLnRpY2tGb3JtYXQodGhpcy55QXhpc0Zvcm1hdHRlcik7XG5cbiAgICB0aGlzLnlBeGlzID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy15JylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gWSBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVlHcmlkKSB7XG4gICAgICB0aGlzLnlHcmlkQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgICAgLnRpY2tTaXplKC10aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KTtcblxuICAgICAgdGhpcy55R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXknKVxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzWmVybylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgMClgKVxuICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCB3ZXN0JylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgLy8gaGlkZSB0b29sdGlwIGZvciBhY2Nlc3NpYmlsaXR5XG5cbiAgICAgIC8vIHRvb2x0aXAgaGVhZGVyXG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLWhlYWRlcicpO1xuXG4gICAgICAvLyB0b29sdGlwIHRhYmxlXG4gICAgICBjb25zdCB0b29sdGlwVGFibGUgPSB0aGlzLnRvb2x0aXAuYXBwZW5kKCd0YWJsZScpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdGFibGUgdGV4dC1sZWZ0IHctMTAwJyk7XG5cbiAgICAgIGNvbnN0IHRvb2x0aXBUYWJsZVRib2R5ID0gdG9vbHRpcFRhYmxlLmFwcGVuZCgndGJvZHknKTtcblxuICAgICAgdG9vbHRpcFRhYmxlVGJvZHlcbiAgICAgICAgLnNlbGVjdEFsbCgndHInKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKChlbnRlcikgPT4gZW50ZXIuYXBwZW5kKCd0cicpKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgbGVnZW5kIGNsYXNzZXNcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgY2xpcCBwYXRoIGZvciBsaW5lIGFuaW1hdGlvblxuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdjbGlwUGF0aCcpXG4gICAgICAuYXR0cignaWQnLCBgY2xpcC1wYXRoLSR7dGhpcy5jbGlwUGF0aElkfWApXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoIC0gK3RoaXMubWFyZ2luLmxlZnQgLSArdGhpcy5tYXJnaW4ucmlnaHQpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0KTtcblxuICAgIC8vIGFkZCBjbGlwIHBhdGggZm9yIHBvaW50cyBhbmltYXRpb25cbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnY2xpcFBhdGgnKVxuICAgICAgLmF0dHIoJ2lkJywgYGNsaXAtcGF0aC1wb2ludHMtJHt0aGlzLmNsaXBQYXRoSWR9YClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggKyArdGhpcy5tYXJnaW4ubGVmdCAtICt0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgtJHt0aGlzLm1hcmdpbi5sZWZ0fSwgMClgKTtcblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcblxuICAgIG5leHRJZCsrO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMubW91c2VyZWN0LmRhdGEodGhpcy5kYXRhKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgeFNjYWxlXG4gICAgdGhpcy54QXhpc1NjYWxlLmRvbWFpbihcbiAgICAgIGQzX2V4dGVudCh0aGlzLmRhdGEuZGF0ZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIGQzX2lzb1BhcnNlKGQpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gdXBkYXRlIHRoZSB5U2NhbGVcbiAgICB0aGlzLnlBeGlzU2NhbGVcbiAgICAgIC5kb21haW4oW1xuICAgICAgICBkM19taW4odGhpcy5kYXRhLnNlcmllcywgKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1pblZhbCA9ICtkM19taW4oZC52YWx1ZXMpO1xuICAgICAgICAgIHJldHVybiBtaW5WYWwgLSBtaW5WYWwgKiArdGhpcy55QXhpc01pbkJ1ZmZlcjtcbiAgICAgICAgfSksXG4gICAgICAgIGQzX21heCh0aGlzLmRhdGEuc2VyaWVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF4VmFsID0gK2QzX21heChkLnZhbHVlcyk7XG4gICAgICAgICAgcmV0dXJuIG1heFZhbCArIG1heFZhbCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG4gICAgICAgIH0pXG4gICAgICBdKVxuICAgICAgLm5pY2UoKTtcblxuICAgIHRoaXMueEF4aXMudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgdGhpcy55QXhpcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnlBeGlzQ2FsbCk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIGdyaWRzXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgdGhpcy55R3JpZC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gbGluZXNcbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdEFsbCgncGF0aC5saW5lJylcbiAgICAgIC5hdHRyKCdmaWx0ZXInLCAoKSA9PiAodGhpcy50eXBlICE9PSAnaGlnaCcgPyBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucGF0aCgpfSNnbG93KWAgOiBudWxsKSlcbiAgICAgIC5kYXRhKHRoaXMuZGF0YS5zZXJpZXMpXG4gICAgICAuam9pbihcbiAgICAgICAgKGVudGVyKSA9PiB7XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsaXAtcGF0aCcsIGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wYXRoKCl9I2NsaXAtcGF0aC0ke3RoaXMuY2xpcFBhdGhJZH0pYClcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lJylcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgKGQpID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSlcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy5saW5lV2lkdGgpXG4gICAgICAgICAgICAuYXR0cignZCcsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gbmV3IEFycmF5KGRhdGEudmFsdWVzLmxlbmd0aCkuZmlsbCgwKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZDNsaW5lKGFycmF5KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2FsbCgoZW50ZXIpID0+XG4gICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZGF0YSkgPT4gdGhpcy5kM2xpbmUoZGF0YS52YWx1ZXMpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICB1cGRhdGUuY2FsbCgodXBkYXRlKSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgKGQpID0+IHRoaXMuZDNsaW5lKGQudmFsdWVzKSlcbiAgICAgICAgICApLFxuICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgKTtcblxuICAgIC8vIGFyZWFcbiAgICBpZiAodGhpcy5hcmVhKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCdwYXRoLmFyZWEnKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEuc2VyaWVzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsaXAtcGF0aCcsIGB1cmwoJHt0aGlzLl9sb2NhdGlvbi5wYXRoKCl9I2NsaXAtcGF0aC0ke3RoaXMuY2xpcFBhdGhJZH0pYClcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2FyZWEnKVxuICAgICAgICAgICAgICAuYXR0cignZCcsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJyYXkgPSBuZXcgQXJyYXkoZGF0YS52YWx1ZXMubGVuZ3RoKS5maWxsKDApO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmQzYXJlYShhcnJheSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5zdHlsZSgnY29sb3InLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAuY2FsbCgoZW50ZXIpID0+XG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdkJywgKGRhdGEpID0+IHRoaXMuZDNhcmVhKGRhdGEudmFsdWVzKSlcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZCkgPT4gdGhpcy5kM2FyZWEoZC52YWx1ZXMpKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gY2lyY2xlc1xuICAgIGlmICh0aGlzLmxpbmVQb2ludHMpIHtcbiAgICAgIC8vIGFkZCBwb2ludHNcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJ2cucG9pbnRzJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcylcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdwb2ludHMnKVxuICAgICAgICAgICAgICAuYXR0cignY2xpcC1wYXRoJywgYHVybCgke3RoaXMuX2xvY2F0aW9uLnBhdGgoKX0jY2xpcC1wYXRoLXBvaW50cy0ke3RoaXMuY2xpcFBhdGhJZH0pYClcbiAgICAgICAgICAgICAgLnN0eWxlKCdjb2xvcicsIChkLCBpKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG5cbiAgICAgICAgICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgLmRhdGEoKGQpID0+IGQudmFsdWVzKVxuICAgICAgICAgICAgICAuam9pbihcbiAgICAgICAgICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCwgaSkgPT4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5kYXRlc1tpXSkpKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKDApKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigncicsIHRoaXMubGluZVdpZHRoICogMilcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLmxpbmVXaWR0aClcbiAgICAgICAgICAgICAgICAgICAgLmNhbGwoKGVudGVyKSA9PlxuICAgICAgICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICgpID0+IHt9LFxuICAgICAgICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgICAgICAgICAuZGF0YSgoZCkgPT4gZC52YWx1ZXMpXG4gICAgICAgICAgICAgIC5qb2luKFxuICAgICAgICAgICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkLCBpKSA9PiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmRhdGVzW2ldKSkpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSA9PiB0aGlzLnlBeGlzU2NhbGUoZCkpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdyJywgdGhpcy5saW5lV2lkdGggKiAyKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMubGluZVdpZHRoKSxcbiAgICAgICAgICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQsIGkpID0+IHRoaXMueEF4aXNTY2FsZShkM19pc29QYXJzZSh0aGlzLmRhdGEuZGF0ZXNbaV0pKSlcbiAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY3knLCAoZCkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuY2hhcnRcbiAgICAgICAgLnNlbGVjdCgnLmxlZ2VuZCcpXG4gICAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YS5zZXJpZXMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGkgPSBlbnRlci5hcHBlbmQoJ2xpJykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKTtcblxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1rZXknKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKTtcblxuICAgICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgICAgICAgIC5odG1sKChkKSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbCgoZCkgPT4ge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3ZlcihldmVudCwgZGF0YSkpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3V0KCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubGVnZW5kTW91c2VDbGljayhldmVudCwgZGF0YSkpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwXG4gICAgICAgIC5zZWxlY3QoJy50b29sdGlwLXRhYmxlJylcbiAgICAgICAgLnNlbGVjdEFsbCgndHInKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEuc2VyaWVzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRvb2x0aXBJdGVtID0gZW50ZXIuYXBwZW5kKCd0cicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaXRlbScpO1xuXG4gICAgICAgICAgICB0b29sdGlwSXRlbVxuICAgICAgICAgICAgICAuYXBwZW5kKCd0ZCcpXG4gICAgICAgICAgICAgIC5zdHlsZSgnY29sb3InLCAoZCkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcC1rZXknKTtcblxuICAgICAgICAgICAgdG9vbHRpcEl0ZW1cbiAgICAgICAgICAgICAgLmFwcGVuZCgndGQnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndG9vbHRpcC1sYWJlbCBwci0yIHRleHQtbm93cmFwJylcbiAgICAgICAgICAgICAgLmh0bWwoKGQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlID8gdGhpcy50b29sdGlwTGFiZWxGb3JtYXQoZC5sYWJlbCkgOiBkLmxhYmVsO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdG9vbHRpcEl0ZW1cbiAgICAgICAgICAgICAgLmFwcGVuZCgndGQnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndG9vbHRpcC12YWx1ZSB0ZXh0LXJpZ2h0IHRleHQtbm93cmFwJylcbiAgICAgICAgICAgICAgLmh0bWwoKGQpID0+ICcnKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRvb2x0aXBJdGVtO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSB0b29sdGlwIGxhYmVsIHRleHRcbiAgICAgICAgICAgIGNvbnN0IHRvb2x0aXBMYWJlbCA9IHVwZGF0ZS5zZWxlY3QoJy50b29sdGlwLWxhYmVsJyk7XG5cbiAgICAgICAgICAgIHRvb2x0aXBMYWJlbC5odG1sKChkKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUgPyB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChkLmxhYmVsKSA6IGQubGFiZWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcucG9pbnRzJykucmFpc2UoKTtcbiAgICB0aGlzLm1vdXNlcmVjdC5yYWlzZSgpO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3ZlciA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKGRhdGEsIHRoaXMubGluZVBvaW50cyk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gZC5sYWJlbCAhPT0gZGF0YS5sYWJlbDtcbiAgICAgIH0pXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgIHJldHVybiBkLmxhYmVsICE9PSBkYXRhLmxhYmVsO1xuICAgICAgfSlcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGQubGFiZWwgIT09IGRhdGEubGFiZWw7XG4gICAgICAgIH0pXG4gICAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxpbmVQb2ludHMpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5wb2ludHMnKVxuICAgICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGQubGFiZWwgIT09IGRhdGEubGFiZWw7XG4gICAgICAgIH0pXG4gICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuICAgIH1cblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5saW5lJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSkuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgaWYgKHRoaXMubGluZVBvaW50cykge1xuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCdjaXJjbGUnKS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSkuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcuYXJlYScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBsZWdlbmRNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBtb3VzZXJlY3RNb3VzZU1vdmUgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICBjb25zdCBtb3VzZVhEYXRlID0gdGhpcy54QXhpc1NjYWxlLmludmVydChkM19wb2ludGVyKGV2ZW50KVswXSk7IC8vIHJldHVybiBkYXRlIGF0IG1vdXNlIHggcG9zaXRpb25cblxuICAgIGNvbnN0IGxlZnRJbmRleCA9IGQzX2Jpc2VjdExlZnQodGhpcy5kYXRhLmRhdGVzLCBkM19pc29Gb3JtYXQobW91c2VYRGF0ZSkpOyAvLyBpbmRleCBvZiBsZWZ0IGNsb3Nlc3QgZGF0ZVxuXG4gICAgLy8gcHJldmVudCBlcnJvciBmb3IgMCBpbmRleFxuICAgIGlmIChsZWZ0SW5kZXggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGRhdGVMb3dlciA9IG5ldyBEYXRlKHRoaXMuZGF0YS5kYXRlc1tsZWZ0SW5kZXggLSAxXSk7XG4gICAgY29uc3QgZGF0ZVVwcGVyID0gbmV3IERhdGUodGhpcy5kYXRhLmRhdGVzW2xlZnRJbmRleF0pO1xuICAgIGNvbnN0IGNsb3Nlc3REYXRlID0gK21vdXNlWERhdGUgLSArZGF0ZUxvd2VyID4gK2RhdGVVcHBlciAtIG1vdXNlWERhdGUgPyBkYXRlVXBwZXIgOiBkYXRlTG93ZXI7IC8vIGRhdGUgbW91c2UgaXMgY2xvc2VzdCB0b1xuICAgIGNvbnN0IGNsb3Nlc3RJbmRleCA9IHRoaXMuZGF0YS5kYXRlcy5pbmRleE9mKGQzX2lzb0Zvcm1hdChjbG9zZXN0RGF0ZSkpOyAvLyB3aGljaCBpbmRleCB0aGUgbW91c2UgaXMgY2xvc2VzdCB0b1xuICAgIC8vIGNvbnNvbGUubG9nKCttb3VzZVhEYXRlLCBsZWZ0SW5kZXgsICtkYXRlTG93ZXIsICtkYXRlVXBwZXIsICtjbG9zZXN0RGF0ZSwgY2xvc2VzdEluZGV4KTtcblxuICAgIGNvbnN0IGNpcmNsZXMgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5saW5lLWdyb3VwJykuc2VsZWN0QWxsKCdjaXJjbGUnKTtcbiAgICBjaXJjbGVzLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gY2xvc2VzdEluZGV4KS5jbGFzc2VkKCdhY3RpdmUnLCB0cnVlKTtcbiAgICBjaXJjbGVzLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gY2xvc2VzdEluZGV4KS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBMaW5lXG4gICAgICAuYXR0cigneDEnLCB0aGlzLnhBeGlzU2NhbGUoY2xvc2VzdERhdGUpKVxuICAgICAgLmF0dHIoJ3gyJywgdGhpcy54QXhpc1NjYWxlKGNsb3Nlc3REYXRlKSlcbiAgICAgIC5jbGFzc2VkKCdhY3RpdmUnLCB0cnVlKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudG9vbHRpcExpbmUubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKSk7XG4gICAgdGhpcy50b29sdGlwU2hvdyh0aGlzLnRvb2x0aXBMaW5lLm5vZGUoKSwgY2xvc2VzdEluZGV4KTtcblxuICAgIHRoaXMubW91c2VkYXRhID0ge1xuICAgICAgZGF0ZTogY2xvc2VzdERhdGUsXG4gICAgICBzZXJpZXM6IHRoaXMuZGF0YS5zZXJpZXMubWFwKChkKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFiZWw6IGQubGFiZWwsXG4gICAgICAgICAgdmFsdWU6IGQudmFsdWVzW2Nsb3Nlc3RJbmRleF1cbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgfTtcblxuICAgIHRoaXMudG9vbHRpcEhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhOiB0aGlzLm1vdXNlZGF0YSB9KTtcbiAgfTtcblxuICBtb3VzZXJlY3RNb3VzZU91dCA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnY2lyY2xlJykuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuICAgIHRoaXMudG9vbHRpcExpbmUuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBtb3VzZXJlY3RNb3VzZUNsaWNrID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcENsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhOiB0aGlzLm1vdXNlZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKG5vZGUsIGNsb3Nlc3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIGNvbnN0IG1vdXNlcmVjdERpbWVuc2lvbnMgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgdG9vbHRpcERpbWVuc2lvbnMgPSB0aGlzLnRvb2x0aXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGRpbWVuc2lvbkNhbGN1bGF0ZWQgPSBtb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyB0b29sdGlwRGltZW5zaW9ucy53aWR0aCArIDg7XG4gICAgY29uc3QgY2xpZW50V2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gMTA7XG4gICAgbGV0IHBvc2l0aW9uO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsLCBtb3VzZXJlY3REaW1lbnNpb25zLCB0b29sdGlwT2Zmc2V0SGVpZ2h0LCB0b29sdGlwRGltZW5zaW9ucywgZGltZW5zaW9uQ2FsY3VsYXRlZCwgY2xpZW50V2lkdGgpO1xuXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbCgoZCkgPT4ge1xuICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5kYXRlc1tjbG9zZXN0SW5kZXhdKTtcbiAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0KHBhcnNlZFRpbWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdEFsbCgnLnRvb2x0aXAtdmFsdWUnKS5odG1sKChkLCBpKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlXG4gICAgICAgID8gdGhpcy50b29sdGlwVmFsdWVGb3JtYXQodGhpcy5kYXRhLnNlcmllc1tpXS52YWx1ZXNbY2xvc2VzdEluZGV4XSlcbiAgICAgICAgOiB0aGlzLmRhdGEuc2VyaWVzW2ldLnZhbHVlc1tjbG9zZXN0SW5kZXhdO1xuICAgIH0pO1xuXG4gICAgLy8gZmxpcCB0aGUgdG9vbHRpcCBwb3NpdGlvbnMgaWYgbmVhciB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgc2NyZWVuXG4gICAgaWYgKGRpbWVuc2lvbkNhbGN1bGF0ZWQgPiBjbGllbnRXaWR0aCkge1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ2Vhc3QnLCB0cnVlKTtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgZmFsc2UpO1xuICAgICAgcG9zaXRpb24gPSBgJHttb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgLSB0b29sdGlwRGltZW5zaW9ucy53aWR0aCAtIDh9cHhgO1xuICAgIH0gZWxzZSBpZiAoZGltZW5zaW9uQ2FsY3VsYXRlZCA8IGNsaWVudFdpZHRoKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIGZhbHNlKTtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgdHJ1ZSk7XG4gICAgICBwb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIDh9cHhgO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdQT1NJVElPTjogJywgcG9zaXRpb24sIG1vdXNlcmVjdERpbWVuc2lvbnMpO1xuXG4gICAgLy8gc2V0IHRoZSB0b29sdGlwIHN0eWxlc1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZShcbiAgICAgICd0b3AnLFxuICAgICAgYCR7bW91c2VyZWN0RGltZW5zaW9ucy50b3AgKyBtb3VzZXJlY3REaW1lbnNpb25zLmhlaWdodCAvIDIgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC8gMiArIHNjcm9sbFsxXX1weGBcbiAgICApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIHBvc2l0aW9uKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSAoaXRlbSkgPT4ge1xuICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdHRlciA9IChpdGVtKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMueUF4aXNGb3JtYXQoaXRlbSk7XG4gIH07XG59XG4iXX0=
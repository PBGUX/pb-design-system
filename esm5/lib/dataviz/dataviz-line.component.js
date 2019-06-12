/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, isoParse as d3_isoParse, isoFormat as d3_isoFormat, timeFormat as d3_timeFormat, format as d3_format, scaleOrdinal as d3_scaleOrdinal, scaleTime as d3_scaleTime, line as d3_line, scaleLinear as d3_scaleLinear, extent as d3_extent, min as d3_min, max as d3_max, axisBottom as d3_axisBottom, axisLeft as d3_axisLeft, event as d3_event, curveCatmullRom as d3_curveCatmullRom, mouse as d3_mouse, bisectLeft as d3_bisectLeft, area as d3_area } from 'd3';
import { PbdsDatavizService } from './dataviz.service';
var PbdsDatavizLineComponent = /** @class */ (function () {
    function PbdsDatavizLineComponent(_dataviz, _element, _scroll) {
        var _this = this;
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this.chartClass = true;
        this.lineClass = true;
        this.width = 306;
        this.height = 400;
        this.type = 'medium'; // debug to show all chart options
        // debug to show all chart options
        this.area = false;
        this.xAxisFormatString = '';
        this.xAxisTicks = 6;
        this.yAxisFormatString = '';
        this.yAxisTicks = 5;
        this.yAxisMinBuffer = 0.01;
        this.yAxisMaxBuffer = 0.01;
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'right';
        this.legendLabelFormatType = null;
        this.legendLabelFormatString = '';
        this.tooltipHeadingFormatString = '';
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.marginTop = 10; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginRight = 20; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.tooltipHovered = new EventEmitter();
        this.tooltipClicked = new EventEmitter();
        this.updateChart = function () {
            _this.mouserect.data(_this.data);
            // update the xScale
            _this.xAxisScale.domain(d3_extent(_this.data.dates, function (d, i) {
                return d3_isoParse(d);
            }));
            // update the yScale
            _this.yAxisScale
                .domain([
                d3_min(_this.data.series, function (d, i) {
                    /** @type {?} */
                    var minVal = +d3_min(d.values);
                    return minVal - minVal * +_this.yAxisMinBuffer;
                }),
                d3_max(_this.data.series, function (d, i) {
                    /** @type {?} */
                    var maxVal = +d3_max(d.values);
                    return maxVal + maxVal * _this.yAxisMaxBuffer;
                })
            ])
                .nice();
            _this.xAxis
                .transition()
                .duration(1000)
                .call(_this.xAxisCall);
            _this.yAxis
                .transition()
                .duration(1000)
                .call(_this.yAxisCall);
            // update the grids
            if (!_this.hideXGrid) {
                _this.xGrid
                    .transition()
                    .duration(1000)
                    .call(_this.xGridCall);
            }
            if (!_this.hideYGrid) {
                _this.yGrid
                    .transition()
                    .duration(1000)
                    .call(_this.yGridCall);
            }
            /** @type {?} */
            var group = _this.svg.selectAll('.line-group').data(_this.data.series);
            // remove lines
            group.exit().remove();
            // update existing
            group
                .select('path.line')
                .transition()
                .duration(1000)
                .attr('d', function (d) { return _this.d3line(d.values); });
            if (_this.area) {
                group
                    .select('path.area')
                    .transition()
                    .duration(1000)
                    .attr('d', function (d) { return _this.d3area(d.values); });
            }
            group
                .selectAll('circle')
                .data(function (d) { return d.values; })
                .transition()
                .duration(1000)
                .attr('cx', function (d, i) { return _this.xAxisScale(d3_isoParse(_this.data.dates[i])); })
                .attr('cy', function (d) { return _this.yAxisScale(d); });
            // add group on enter
            /** @type {?} */
            var groupEnter = group
                .enter()
                .append('g')
                .attr('class', 'line-group');
            // add line on enter
            /** @type {?} */
            var line = groupEnter
                .append('path')
                .attr('class', 'line')
                .style('color', function (d) { return _this.colorRange(d.label); })
                .style('stroke-width', _this.lineWidth)
                .transition()
                .duration(1000)
                .attr('d', function (data) { return _this.d3line(data.values); });
            if (_this.area) {
                groupEnter
                    .append('path')
                    .attr('class', 'area')
                    .attr('d', function (data) { return _this.d3area(data.values); })
                    .style('color', function (d) { return _this.colorRange(d.label); });
            }
            // add points
            if (_this.linePoints) {
                /** @type {?} */
                var points = groupEnter
                    .append('g')
                    .attr('class', 'points')
                    .style('color', function (d) { return _this.colorRange(d.label); });
                /** @type {?} */
                var circles = points.selectAll('circle').data(function (d) { return d.values; });
                circles
                    .enter()
                    .append('circle')
                    .attr('cx', function (d, i) { return _this.xAxisScale(d3_isoParse(_this.data.dates[i])); })
                    .attr('cy', function (d) { return _this.yAxisScale(d); })
                    .attr('r', _this.lineWidth * 2)
                    .style('stroke-width', _this.lineWidth);
            }
            if (_this.type !== 'high') {
                line.attr('filter', 'url(#glow)');
            }
            if (!_this.hideLegend) {
                /** @type {?} */
                var legendItem = _this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(_this.data.series);
                legendItem.exit().remove();
                // update existing items
                legendItem.select('.legend-label').html(function (d) {
                    switch (_this.legendLabelFormatType) {
                        case 'number':
                            return _this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            var parsedTime = d3_isoParse(d.label);
                            return _this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                // legend items on enter
                /** @type {?} */
                var enterLegendItem = legendItem
                    .enter()
                    .append('li')
                    .attr('class', 'legend-item');
                enterLegendItem
                    .append('span')
                    .attr('class', 'legend-key')
                    .style('background-color', function (d) { return _this.colorRange(d.label); });
                enterLegendItem
                    .append('span')
                    .attr('class', 'legend-label')
                    .html(function (d) {
                    switch (_this.legendLabelFormatType) {
                        case 'number':
                            return _this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            var parsedTime = d3_isoParse(d.label);
                            return _this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                enterLegendItem
                    .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3_event, data, index, nodes); })
                    .on('mouseout', function () { return _this.legendMouseOut(); })
                    .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3_event, data, index, nodes); });
            }
            if (!_this.hideTooltip) {
                /** @type {?} */
                var tooltipItem = _this.tooltip
                    .select('.tooltip-table')
                    .selectAll('tr')
                    .data(_this.data.series);
                tooltipItem.exit().remove();
                // update existing items
                tooltipItem.select('.tooltip-label pr-2').html(function (d) {
                    return _this.tooltipHeadingFormat(d.label);
                });
                // items on enter
                /** @type {?} */
                var entertooltipItem = tooltipItem
                    .enter()
                    .append('tr')
                    .attr('class', 'tooltip-item');
                entertooltipItem
                    .append('td')
                    .style('color', function (d) { return _this.colorRange(d.label); })
                    .append('span')
                    .attr('class', 'pbds-tooltip-key');
                entertooltipItem
                    .append('td')
                    .attr('class', 'tooltip-label pr-2 text-nowrap')
                    .html(function (d) {
                    return _this.tooltipLabelFormatType ? _this.tooltipLabelFormat(d.label) : d.label;
                });
                entertooltipItem
                    .append('td')
                    .attr('class', 'tooltip-value text-right text-nowrap')
                    .html(function (d) { return ''; });
            }
            _this.mouserect.raise();
        };
        this.legendMouseOver = function (event, data, index, nodes) {
            _this.chart
                .selectAll('.legend-item')
                .filter(function (d, i) { return i !== index; })
                .classed('inactive', true);
            _this.chart
                .selectAll('.line-group')
                .filter(function (d, i) { return i !== index; })
                .classed('inactive', true);
            /** @type {?} */
            var line = _this.chart.selectAll('.line-group').filter(function (d, i) { return i === index; });
            line.classed('active', true);
            if (_this.linePoints) {
                /** @type {?} */
                var circles = line.selectAll('circle');
                circles.classed('active', true);
            }
            _this.hovered.emit({ event: event, data: data });
        };
        this.legendMouseOut = function () {
            _this.chart.selectAll('.legend-item').classed('inactive', false);
            _this.chart
                .selectAll('.line-group')
                .classed('inactive', false)
                .classed('active', false);
            if (_this.linePoints) {
                /** @type {?} */
                var circles = _this.chart.selectAll('circle');
                circles.classed('active', false);
            }
        };
        this.legendMouseClick = function (event, data, index, nodes) {
            _this.clicked.emit({ event: event, data: data });
        };
        this.mouserectMouseMove = function (event, index, nodes) {
            /** @type {?} */
            var mouseXDate = _this.xAxisScale.invert(d3_mouse(nodes[0])[0]);
            // return date at mouse x position
            /** @type {?} */
            var leftIndex = d3_bisectLeft(_this.data.dates, d3_isoFormat(mouseXDate));
            // prevent error for 0 index
            if (leftIndex === 0)
                return false;
            /** @type {?} */
            var dateLower = new Date(_this.data.dates[leftIndex - 1]);
            /** @type {?} */
            var dateUpper = new Date(_this.data.dates[leftIndex]);
            /** @type {?} */
            var closestDate = +mouseXDate - +dateLower > +dateUpper - mouseXDate ? dateUpper : dateLower;
            // date mouse is closest to
            /** @type {?} */
            var closestIndex = _this.data.dates.indexOf(d3_isoFormat(closestDate));
            // which index the mouse is closest to
            // console.log(+mouseXDate, leftIndex, +dateLower, +dateUpper, +closestDate, closestIndex);
            /** @type {?} */
            var circles = _this.svg.selectAll('.line-group').selectAll('circle');
            circles.filter(function (d, i) { return i === closestIndex; }).classed('active', true);
            circles.filter(function (d, i) { return i !== closestIndex; }).classed('active', false);
            _this.tooltipLine
                .attr('x1', _this.xAxisScale(closestDate))
                .attr('x2', _this.xAxisScale(closestDate))
                .classed('active', true);
            // console.log(this.tooltipLine.node().getBoundingClientRect(), this._scroll.getScrollPosition());
            _this.tooltipShow(_this.tooltipLine.node(), closestIndex);
            _this.mousedata = {
                date: closestDate,
                series: _this.data.series.map(function (d) {
                    return {
                        label: d.label,
                        value: d.values[closestIndex]
                    };
                })
            };
            _this.tooltipHovered.emit({ event: event, data: _this.mousedata });
        };
        this.mouserectMouseOut = function (event, index, nodes) {
            _this.svg.selectAll('circle').classed('active', false);
            _this.tooltipLine.classed('active', false);
            _this.tooltipHide();
        };
        this.mouserectMouseClick = function () {
            _this.tooltipClicked.emit({ event: event, data: _this.mousedata });
        };
        this.tooltipShow = function (node, closestIndex) {
            /** @type {?} */
            var scroll = _this._scroll.getScrollPosition();
            /** @type {?} */
            var mouserectDimensions = node.getBoundingClientRect();
            /** @type {?} */
            var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight;
            /** @type {?} */
            var tooltipDimensions = _this.tooltip.node().getBoundingClientRect();
            /** @type {?} */
            var dimensionCalculated = mouserectDimensions.left + tooltipDimensions.width + 8;
            /** @type {?} */
            var clientWidth = document.body.clientWidth - 10;
            /** @type {?} */
            var position;
            // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
            _this.tooltip.select('.tooltip-header').html(function (d) {
                /** @type {?} */
                var parsedTime = d3_isoParse(_this.data.dates[closestIndex]);
                return _this.tooltipHeadingFormat(parsedTime);
            });
            _this.tooltip.selectAll('.tooltip-value').html(function (d, i) {
                return _this.tooltipValueFormatType
                    ? _this.tooltipValueFormat(_this.data.series[i].values[closestIndex])
                    : _this.data.series[i].values[closestIndex];
            });
            // flip the tooltip positions if near the right edge of the screen
            if (dimensionCalculated > clientWidth) {
                _this.tooltip.classed('east', true);
                _this.tooltip.classed('west', false);
                position = mouserectDimensions.left - tooltipDimensions.width - 8 + "px";
            }
            else if (dimensionCalculated < clientWidth) {
                _this.tooltip.classed('east', false);
                _this.tooltip.classed('west', true);
                position = mouserectDimensions.left + 8 + "px";
            }
            // console.log('POSITION: ', position, mouserectDimensions);
            // set the tooltip styles
            _this.tooltip.style('top', mouserectDimensions.top + mouserectDimensions.height / 2 - tooltipOffsetHeight / 2 + scroll[1] + "px");
            _this.tooltip.style('left', position);
            _this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = function () {
            _this.tooltip.style('opacity', 0);
        };
        this.xAxisFormatter = function (item) {
            /** @type {?} */
            var parseDate = d3_isoParse(item);
            return _this.xAxisFormat(parseDate);
        };
        this.yAxisFormatter = function (item) {
            return _this.yAxisFormat(item);
        };
    }
    /**
     * @return {?}
     */
    PbdsDatavizLineComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        this.xAxisFormat = d3_timeFormat(this.xAxisFormatString);
        this.yAxisFormat = d3_format(this.yAxisFormatString);
        switch (this.legendLabelFormatType) {
            case 'number':
                this.legendLabelFormat = d3_format(this.legendLabelFormatString);
                break;
            case 'time':
                this.legendLabelFormat = d3_timeFormat(this.legendLabelFormatString);
                break;
            default:
                this.legendLabelFormat = null;
                break;
        }
        this.tooltipHeadingFormat = d3_timeFormat(this.tooltipHeadingFormatString);
        switch (this.tooltipLabelFormatType) {
            case 'number':
                this.tooltipLabelFormat = d3_format(this.tooltipLabelFormatString);
                break;
            case 'time':
                this.tooltipLabelFormat = d3_timeFormat(this.tooltipLabelFormatString);
                break;
            default:
                this.tooltipLabelFormat = null;
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = d3_format(this.tooltipValueFormatString);
                break;
            case 'time':
                this.tooltipValueFormat = d3_timeFormat(this.tooltipValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
        // defaults for all chart types
        this.lineWidth = 3;
        this.lineCurved = true;
        this.linePoints = true;
        this.hideXAxis = false;
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
        if (this.type !== 'debug') {
            // set type defaults
            switch (this.type) {
                case 'medium':
                    this.hideXGrid = true;
                    this.hideXAxisTicks = true;
                    this.hideYAxisTicks = true;
                    this.hideYGrid = true;
                    break;
                case 'high':
                    this.lineWidth = 2;
                    this.lineCurved = false;
                    this.linePoints = false;
                    this.hideXAxisTicks = true;
                    this.hideYAxisTicks = true;
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
            .x(function (d, i) { return _this.xAxisScale(d3_isoParse(_this.data.dates[i])); })
            .y(function (d) { return _this.yAxisScale(d); });
        // define line curve
        if (this.lineCurved) {
            this.d3line.curve(d3_curveCatmullRom.alpha(0.5));
        }
        // define area
        if (this.area) {
            this.d3area = d3_area()
                .x(function (d, i) { return _this.xAxisScale(d3_isoParse(_this.data.dates[i])); })
                .y0(this.height)
                .y1(function (d, i) { return _this.yAxisScale(d); });
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
            .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + (+this.width + this.margin.right) + " " + (+this.height +
            this.margin.top +
            this.margin.bottom));
        // add rectangle to capture mouse
        this.mouserect = this.svg
            .append('rect')
            .attr('width', this.width - this.margin.left - this.margin.right)
            .attr('height', this.height)
            .attr('class', 'mouserect')
            .on('mousemove', function (data, index, nodes) { return _this.mouserectMouseMove(d3_event, index, nodes); })
            .on('mouseout', function (data, index, nodes) { return _this.mouserectMouseOut(d3_event, index, nodes); })
            .on('click', function (data, index, nodes) { return _this.mouserectMouseClick(); });
        this.tooltipLine = this.svg
            .append('line')
            .attr('y1', 0)
            .attr('y2', this.height)
            .attr('class', 'tooltip-line');
        // define color range
        this.colorRange = d3_scaleOrdinal().range(this._dataviz.getColors(false));
        // add glow def
        this._dataviz.createGlowFilter(this.svg);
        // X AXIS
        this.xAxisScale = d3_scaleTime()
            .domain(d3_extent(this.data.dates, function (d, i) {
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
            .attr('transform', "translate(0, " + this.height + ")") //${-this.margin.right / 2}
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
                .attr('transform', "translate(0, " + this.height + ")") //${-this.margin.right / 2}
                .call(this.xGridCall);
        }
        // Y AXIS
        this.yAxisScale = d3_scaleLinear()
            .domain([
            d3_min(this.data.series, function (d, i) {
                /** @type {?} */
                var minVal = +d3_min(d.values);
                return minVal - minVal * +_this.yAxisMinBuffer;
            }),
            d3_max(this.data.series, function (d, i) {
                /** @type {?} */
                var maxVal = +d3_max(d.values);
                return maxVal + maxVal * _this.yAxisMaxBuffer;
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
                .attr('transform', "translate(0, 0)")
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
            /** @type {?} */
            var tooltipTable = this.tooltip.append('table').attr('class', 'tooltip-table text-left w-100');
            /** @type {?} */
            var tooltipTableTbody = tooltipTable.append('tbody');
            tooltipTableTbody
                .selectAll('tr')
                .data(this.data)
                .enter()
                .append('tr');
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
        }
        this.updateChart();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PbdsDatavizLineComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    };
    /**
     * @return {?}
     */
    PbdsDatavizLineComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.tooltip)
            this.tooltip.remove();
    };
    PbdsDatavizLineComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-line',
                    template: "",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizLineComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: ElementRef },
        { type: ViewportScroller }
    ]; };
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
        hovered: [{ type: Output }],
        clicked: [{ type: Output }],
        tooltipHovered: [{ type: Output }],
        tooltipClicked: [{ type: Output }]
    };
    return PbdsDatavizLineComponent;
}());
export { PbdsDatavizLineComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.lineClass;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.type;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.area;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.xAxisTicks;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.yAxisFormatString;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.yAxisTicks;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.yAxisMinBuffer;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.yAxisMaxBuffer;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.tooltipHeadingFormatString;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.clicked;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.tooltipHovered;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.tooltipClicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.mouserect;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.tooltipLine;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.d3line;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.d3area;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.lineWidth;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.lineCurved;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.linePoints;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.yAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.yAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.yAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.yAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.xGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.xGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.yGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.yGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.yAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.yAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideXAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideYAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideYAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideYAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideXGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideYGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideYAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.hideTooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.tooltipHeadingFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.tooltipLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.mousedata;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.legendMouseClick;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.mouserectMouseMove;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.mouserectMouseOut;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.mouserectMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype.yAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype._scroll;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1saW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LWxpbmUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBR1gsdUJBQXVCLEVBRXhCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE9BQU8sRUFDTCxNQUFNLElBQUksU0FBUyxFQUNuQixRQUFRLElBQUksV0FBVyxFQUN2QixTQUFTLElBQUksWUFBWSxFQUN6QixVQUFVLElBQUksYUFBYSxFQUMzQixNQUFNLElBQUksU0FBUyxFQUNuQixZQUFZLElBQUksZUFBZSxFQUMvQixTQUFTLElBQUksWUFBWSxFQUN6QixJQUFJLElBQUksT0FBTyxFQUNmLFdBQVcsSUFBSSxjQUFjLEVBQzdCLE1BQU0sSUFBSSxTQUFTLEVBQ25CLEdBQUcsSUFBSSxNQUFNLEVBQ2IsR0FBRyxJQUFJLE1BQU0sRUFDYixVQUFVLElBQUksYUFBYSxFQUMzQixRQUFRLElBQUksV0FBVyxFQUN2QixLQUFLLElBQUksUUFBUSxFQUNqQixlQUFlLElBQUksa0JBQWtCLEVBQ3JDLEtBQUssSUFBSSxRQUFRLEVBQ2pCLFVBQVUsSUFBSSxhQUFhLEVBQzNCLElBQUksSUFBSSxPQUFPLEVBQ2hCLE1BQU0sSUFBSSxDQUFDO0FBRVosT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHdkQ7SUFpSkUsa0NBQW9CLFFBQTRCLEVBQVUsUUFBb0IsRUFBVSxPQUF5QjtRQUFqSCxpQkFBcUg7UUFBakcsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FB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Ozs7OztJQUNmLDZDQUFrQjs7Ozs7SUFDbEIsOENBQW1COzs7OztJQUNuQiw4Q0FBbUI7Ozs7O0lBQ25CLDhDQUFtQjs7Ozs7SUFDbkIsOENBQW1COzs7OztJQUNuQiw2Q0FBa0I7Ozs7O0lBQ2xCLHlDQUFjOzs7OztJQUNkLCtDQUFvQjs7Ozs7SUFDcEIsOENBQW1COzs7OztJQUNuQiw2Q0FBa0I7Ozs7O0lBQ2xCLHlDQUFjOzs7OztJQUNkLCtDQUFvQjs7Ozs7SUFDcEIseUNBQWM7Ozs7O0lBQ2QsNkNBQWtCOzs7OztJQUNsQix5Q0FBYzs7Ozs7SUFDZCw2Q0FBa0I7Ozs7O0lBQ2xCLGlEQUE4Qjs7Ozs7SUFDOUIsc0RBQW1DOzs7OztJQUNuQyxpREFBOEI7Ozs7O0lBQzlCLHNEQUFtQzs7Ozs7SUFDbkMsNkNBQTJCOzs7OztJQUMzQiw2Q0FBMkI7Ozs7O0lBQzNCLG1EQUFpQzs7Ozs7SUFDakMsbURBQWlDOzs7OztJQUNqQyxpREFBK0I7Ozs7O0lBQy9CLGlEQUErQjs7Ozs7SUFDL0IsNkNBQTJCOzs7OztJQUMzQiw2Q0FBMkI7Ozs7O0lBQzNCLGtEQUFnQzs7Ozs7SUFDaEMsa0RBQWdDOzs7OztJQUNoQyxxREFBMEI7Ozs7O0lBQzFCLDJDQUFnQjs7Ozs7SUFDaEIsK0NBQTZCOzs7OztJQUM3Qix3REFBNkI7Ozs7O0lBQzdCLHNEQUEyQjs7Ozs7SUFDM0Isc0RBQTJCOzs7OztJQUMzQiw2Q0FBa0I7O0lBNFJsQiwrQ0EyTkU7O0lBRUYsbURBb0JFOztJQUVGLGtEQVlFOztJQUVGLG9EQUVFOztJQUVGLHNEQW9DRTs7SUFFRixxREFJRTs7SUFFRix1REFFRTs7Ozs7SUFFRiwrQ0EwQ0U7Ozs7O0lBRUYsK0NBRUU7Ozs7O0lBRUYsa0RBR0U7Ozs7O0lBRUYsa0RBRUU7Ozs7O0lBdG9CVSw0Q0FBb0M7Ozs7O0lBQUUsNENBQTRCOzs7OztJQUFFLDJDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIE9uRGVzdHJveSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIEluamVjdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7XG4gIHNlbGVjdCBhcyBkM19zZWxlY3QsXG4gIGlzb1BhcnNlIGFzIGQzX2lzb1BhcnNlLFxuICBpc29Gb3JtYXQgYXMgZDNfaXNvRm9ybWF0LFxuICB0aW1lRm9ybWF0IGFzIGQzX3RpbWVGb3JtYXQsXG4gIGZvcm1hdCBhcyBkM19mb3JtYXQsXG4gIHNjYWxlT3JkaW5hbCBhcyBkM19zY2FsZU9yZGluYWwsXG4gIHNjYWxlVGltZSBhcyBkM19zY2FsZVRpbWUsXG4gIGxpbmUgYXMgZDNfbGluZSxcbiAgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsXG4gIGV4dGVudCBhcyBkM19leHRlbnQsXG4gIG1pbiBhcyBkM19taW4sXG4gIG1heCBhcyBkM19tYXgsXG4gIGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSxcbiAgYXhpc0xlZnQgYXMgZDNfYXhpc0xlZnQsXG4gIGV2ZW50IGFzIGQzX2V2ZW50LFxuICBjdXJ2ZUNhdG11bGxSb20gYXMgZDNfY3VydmVDYXRtdWxsUm9tLFxuICBtb3VzZSBhcyBkM19tb3VzZSxcbiAgYmlzZWN0TGVmdCBhcyBkM19iaXNlY3RMZWZ0LFxuICBhcmVhIGFzIGQzX2FyZWFcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekxpbmUgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1saW5lJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekxpbmVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWxpbmUnKVxuICBsaW5lQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IFBiZHNEYXRhdml6TGluZTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwNjtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ21lZGl1bScgfCAnaGlnaCcgfCAnZGVidWcnID0gJ21lZGl1bSc7IC8vIGRlYnVnIHRvIHNob3cgYWxsIGNoYXJ0IG9wdGlvbnNcblxuICBASW5wdXQoKVxuICBhcmVhID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB4QXhpc1RpY2tzID0gNjtcblxuICBASW5wdXQoKVxuICB5QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzVGlja3MgPSA1O1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWluQnVmZmVyID0gMC4wMTtcblxuICBASW5wdXQoKVxuICB5QXhpc01heEJ1ZmZlciA9IDAuMDE7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMTA1ICsgMjg7IC8vIGhhcmRjb2RlZCBsZWdlbmQgd2lkdGggKyBsZWZ0IG1hcmdpbiwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbGVnZW5kUG9zaXRpb246ICdyaWdodCcgfCAnYm90dG9tJyA9ICdyaWdodCc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwSGVhZGluZ0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luVG9wID0gMTA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5SaWdodCA9IDIwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMzA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gNTU7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgdG9vbHRpcEhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHRvb2x0aXBDbGlja2VkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1vdXNlcmVjdDtcbiAgcHJpdmF0ZSB0b29sdGlwTGluZTtcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgZDNsaW5lO1xuICBwcml2YXRlIGQzYXJlYTtcbiAgcHJpdmF0ZSBsaW5lV2lkdGg7XG4gIHByaXZhdGUgbGluZUN1cnZlZDtcbiAgcHJpdmF0ZSBsaW5lUG9pbnRzO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgeEF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XG4gIHByaXZhdGUgeEF4aXM7XG4gIHByaXZhdGUgeEF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeUF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB5QXhpc0NhbGw7XG4gIHByaXZhdGUgeUF4aXM7XG4gIHByaXZhdGUgeUF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeEdyaWQ7XG4gIHByaXZhdGUgeEdyaWRDYWxsO1xuICBwcml2YXRlIHlHcmlkO1xuICBwcml2YXRlIHlHcmlkQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZU91dGVyOiBudW1iZXI7XG4gIHByaXZhdGUgeUF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHlBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIGhpZGVYQXhpczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXM6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhHcmlkOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZR3JpZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsZWdlbmRMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIGhpZGVUb29sdGlwOiBib29sZWFuO1xuICBwcml2YXRlIHRvb2x0aXBIZWFkaW5nRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgbW91c2VkYXRhO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXG4gICAgICByaWdodDogK3RoaXMubWFyZ2luUmlnaHQsXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcbiAgICB9O1xuXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IGQzX3RpbWVGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFN0cmluZyk7XG5cbiAgICB0aGlzLnlBeGlzRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMueUF4aXNGb3JtYXRTdHJpbmcpO1xuXG4gICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IGQzX3RpbWVGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQgPSBkM190aW1lRm9ybWF0KHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcpO1xuXG4gICAgc3dpdGNoICh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgdGhpcy50b29sdGlwTGFiZWxGb3JtYXQgPSBkM190aW1lRm9ybWF0KHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdCA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gZDNfdGltZUZvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIGRlZmF1bHRzIGZvciBhbGwgY2hhcnQgdHlwZXNcbiAgICB0aGlzLmxpbmVXaWR0aCA9IDM7XG4gICAgdGhpcy5saW5lQ3VydmVkID0gdHJ1ZTtcbiAgICB0aGlzLmxpbmVQb2ludHMgPSB0cnVlO1xuICAgIHRoaXMuaGlkZVhBeGlzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc1plcm8gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1plcm8gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYR3JpZCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlHcmlkID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVRvb2x0aXAgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IGZhbHNlO1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuXG4gICAgaWYgKHRoaXMudHlwZSAhPT0gJ2RlYnVnJykge1xuICAgICAgLy8gc2V0IHR5cGUgZGVmYXVsdHNcbiAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ21lZGl1bSc6XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlHcmlkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdoaWdoJzpcbiAgICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IDI7XG4gICAgICAgICAgdGhpcy5saW5lQ3VydmVkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5saW5lUG9pbnRzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRqdXN0IG1hcmdpbiBpZiB4QXhpcyBoaWRkZW5cbiAgICBpZiAodGhpcy5oaWRlWEF4aXMpIHRoaXMubWFyZ2luLmJvdHRvbSA9IDEwOyAvLyBuZWVkIHNtYWxsIG1hcmdpbiBmb3IgeUF4aXMgd2l0aCAwIHRpY2sgbGFiZWxcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGRlZmluZSBsaW5lXG4gICAgdGhpcy5kM2xpbmUgPSBkM19saW5lKClcbiAgICAgIC54KChkOiBhbnksIGkpID0+IHRoaXMueEF4aXNTY2FsZShkM19pc29QYXJzZSh0aGlzLmRhdGEuZGF0ZXNbaV0pKSlcbiAgICAgIC55KChkOiBhbnkpID0+IHRoaXMueUF4aXNTY2FsZShkKSk7XG5cbiAgICAvLyBkZWZpbmUgbGluZSBjdXJ2ZVxuICAgIGlmICh0aGlzLmxpbmVDdXJ2ZWQpIHtcbiAgICAgIHRoaXMuZDNsaW5lLmN1cnZlKGQzX2N1cnZlQ2F0bXVsbFJvbS5hbHBoYSgwLjUpKTtcbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgYXJlYVxuICAgIGlmICh0aGlzLmFyZWEpIHtcbiAgICAgIHRoaXMuZDNhcmVhID0gZDNfYXJlYSgpXG4gICAgICAgIC54KChkOiBhbnksIGkpID0+IHRoaXMueEF4aXNTY2FsZShkM19pc29QYXJzZSh0aGlzLmRhdGEuZGF0ZXNbaV0pKSlcbiAgICAgICAgLnkwKHRoaXMuaGVpZ2h0KVxuICAgICAgICAueTEoKGQ6IGFueSwgaSkgPT4gdGhpcy55QXhpc1NjYWxlKGQpKTtcblxuICAgICAgaWYgKHRoaXMubGluZUN1cnZlZCkge1xuICAgICAgICB0aGlzLmQzYXJlYS5jdXJ2ZShkM19jdXJ2ZUNhdG11bGxSb20uYWxwaGEoMC41KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHRoZSBjaGFydFxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLnJpZ2h0fSAkeyt0aGlzLmhlaWdodCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4udG9wICtcbiAgICAgICAgICB0aGlzLm1hcmdpbi5ib3R0b219YFxuICAgICAgKTtcblxuICAgIC8vIGFkZCByZWN0YW5nbGUgdG8gY2FwdHVyZSBtb3VzZVxuICAgIHRoaXMubW91c2VyZWN0ID0gdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdtb3VzZXJlY3QnKVxuICAgICAgLm9uKCdtb3VzZW1vdmUnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLm1vdXNlcmVjdE1vdXNlTW92ZShkM19ldmVudCwgaW5kZXgsIG5vZGVzKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLm1vdXNlcmVjdE1vdXNlT3V0KGQzX2V2ZW50LCBpbmRleCwgbm9kZXMpKVxuICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubW91c2VyZWN0TW91c2VDbGljaygpKTtcblxuICAgIHRoaXMudG9vbHRpcExpbmUgPSB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0cigneTEnLCAwKVxuICAgICAgLmF0dHIoJ3kyJywgdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cignY2xhc3MnLCAndG9vbHRpcC1saW5lJyk7XG5cbiAgICAvLyBkZWZpbmUgY29sb3IgcmFuZ2VcbiAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKS5yYW5nZSh0aGlzLl9kYXRhdml6LmdldENvbG9ycyhmYWxzZSkpO1xuXG4gICAgLy8gYWRkIGdsb3cgZGVmXG4gICAgdGhpcy5fZGF0YXZpei5jcmVhdGVHbG93RmlsdGVyKHRoaXMuc3ZnKTtcblxuICAgIC8vIFggQVhJU1xuICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlVGltZSgpXG4gICAgICAuZG9tYWluKFxuICAgICAgICBkM19leHRlbnQodGhpcy5kYXRhLmRhdGVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGQzX2lzb1BhcnNlKGQpO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0XSk7XG5cbiAgICB0aGlzLnhBeGlzQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKVxuICAgICAgLnRpY2tzKCt0aGlzLnhBeGlzVGlja3MpXG4gICAgICAudGlja1NpemUodGhpcy54QXhpc1RpY2tTaXplKVxuICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy54QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAudGlja0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0dGVyKTtcblxuICAgIHRoaXMueEF4aXMgPSB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXgnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYCkgLy8key10aGlzLm1hcmdpbi5yaWdodCAvIDJ9XG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXNUaWNrcylcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIC8vIFggR1JJRExJTkVTXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZENhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSkudGlja1NpemUoLXRoaXMuaGVpZ2h0KTtcblxuICAgICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXgnKVxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYCkgLy8key10aGlzLm1hcmdpbi5yaWdodCAvIDJ9XG4gICAgICAgIC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcbiAgICB9XG5cbiAgICAvLyBZIEFYSVNcbiAgICB0aGlzLnlBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFtcbiAgICAgICAgZDNfbWluKHRoaXMuZGF0YS5zZXJpZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBtaW5WYWwgPSArZDNfbWluKGQudmFsdWVzKTtcbiAgICAgICAgICByZXR1cm4gbWluVmFsIC0gbWluVmFsICogK3RoaXMueUF4aXNNaW5CdWZmZXI7XG4gICAgICAgIH0pLFxuICAgICAgICBkM19tYXgodGhpcy5kYXRhLnNlcmllcywgKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1heFZhbCA9ICtkM19tYXgoZC52YWx1ZXMpO1xuICAgICAgICAgIHJldHVybiBtYXhWYWwgKyBtYXhWYWwgKiB0aGlzLnlBeGlzTWF4QnVmZmVyO1xuICAgICAgICB9KVxuICAgICAgXSlcbiAgICAgIC5uaWNlKClcbiAgICAgIC5yYW5nZShbdGhpcy5oZWlnaHQsIDBdKTtcblxuICAgIHRoaXMueUF4aXNDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnlBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnlBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueUF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy55QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteScpXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXNUaWNrcylcbiAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgIC8vIFkgR1JJRExJTkVTXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgdGhpcy55R3JpZENhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAgIC50aWNrU2l6ZSgtdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodCk7XG5cbiAgICAgIHRoaXMueUdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC15JylcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsIDApYClcbiAgICAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgIH1cblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgd2VzdCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXInKTtcblxuICAgICAgLy8gdG9vbHRpcCB0YWJsZVxuICAgICAgY29uc3QgdG9vbHRpcFRhYmxlID0gdGhpcy50b29sdGlwLmFwcGVuZCgndGFibGUnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLXRhYmxlIHRleHQtbGVmdCB3LTEwMCcpO1xuXG4gICAgICBjb25zdCB0b29sdGlwVGFibGVUYm9keSA9IHRvb2x0aXBUYWJsZS5hcHBlbmQoJ3Rib2R5Jyk7XG5cbiAgICAgIHRvb2x0aXBUYWJsZVRib2R5XG4gICAgICAgIC5zZWxlY3RBbGwoJ3RyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKCd0cicpO1xuICAgIH1cblxuICAgIC8vIGFkZCBsZWdlbmQgY2xhc3Nlc1xuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kKSB7XG4gICAgICB0aGlzLmNoYXJ0LmNsYXNzZWQoJ3BiZHMtY2hhcnQtbGVnZW5kLWJvdHRvbScsIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdib3R0b20nID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIHRoaXMuY2hhcnQuYXBwZW5kKCd1bCcpLmF0dHIoJ2NsYXNzJywgYGxlZ2VuZCBsZWdlbmQtJHt0aGlzLmxlZ2VuZFBvc2l0aW9ufWApO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICB1cGRhdGVDaGFydCA9ICgpID0+IHtcbiAgICB0aGlzLm1vdXNlcmVjdC5kYXRhKHRoaXMuZGF0YSk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIHhTY2FsZVxuICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4oXG4gICAgICBkM19leHRlbnQodGhpcy5kYXRhLmRhdGVzLCAoZDogYW55LCBpKSA9PiB7XG4gICAgICAgIHJldHVybiBkM19pc29QYXJzZShkKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgeVNjYWxlXG4gICAgdGhpcy55QXhpc1NjYWxlXG4gICAgICAuZG9tYWluKFtcbiAgICAgICAgZDNfbWluKHRoaXMuZGF0YS5zZXJpZXMsIChkOiBhbnksIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBtaW5WYWwgPSArZDNfbWluKGQudmFsdWVzKTtcbiAgICAgICAgICByZXR1cm4gbWluVmFsIC0gbWluVmFsICogK3RoaXMueUF4aXNNaW5CdWZmZXI7XG4gICAgICAgIH0pLFxuICAgICAgICBkM19tYXgodGhpcy5kYXRhLnNlcmllcywgKGQ6IGFueSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1heFZhbCA9ICtkM19tYXgoZC52YWx1ZXMpO1xuICAgICAgICAgIHJldHVybiBtYXhWYWwgKyBtYXhWYWwgKiB0aGlzLnlBeGlzTWF4QnVmZmVyO1xuICAgICAgICB9KVxuICAgICAgXSlcbiAgICAgIC5uaWNlKCk7XG5cbiAgICB0aGlzLnhBeGlzXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIHRoaXMueUF4aXNcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgLmNhbGwodGhpcy55QXhpc0NhbGwpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSBncmlkc1xuICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAgIHRoaXMueEdyaWRcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcbiAgICAgIHRoaXMueUdyaWRcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgIH1cblxuICAgIGxldCBncm91cCA9IHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmxpbmUtZ3JvdXAnKS5kYXRhKHRoaXMuZGF0YS5zZXJpZXMpO1xuXG4gICAgLy8gcmVtb3ZlIGxpbmVzXG4gICAgZ3JvdXAuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgLy8gdXBkYXRlIGV4aXN0aW5nXG4gICAgZ3JvdXBcbiAgICAgIC5zZWxlY3QoJ3BhdGgubGluZScpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgIC5hdHRyKCdkJywgZCA9PiB0aGlzLmQzbGluZShkLnZhbHVlcykpO1xuXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgZ3JvdXBcbiAgICAgICAgLnNlbGVjdCgncGF0aC5hcmVhJylcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmF0dHIoJ2QnLCBkID0+IHRoaXMuZDNhcmVhKGQudmFsdWVzKSk7XG4gICAgfVxuXG4gICAgZ3JvdXBcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAuZGF0YShkID0+IGQudmFsdWVzKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAuYXR0cignY3gnLCAoZCwgaSkgPT4gdGhpcy54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKHRoaXMuZGF0YS5kYXRlc1tpXSkpKVxuICAgICAgLmF0dHIoJ2N5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZCkpO1xuXG4gICAgLy8gYWRkIGdyb3VwIG9uIGVudGVyXG4gICAgY29uc3QgZ3JvdXBFbnRlciA9IGdyb3VwXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGluZS1ncm91cCcpO1xuXG4gICAgLy8gYWRkIGxpbmUgb24gZW50ZXJcbiAgICBjb25zdCBsaW5lID0gZ3JvdXBFbnRlclxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGluZScpXG4gICAgICAuc3R5bGUoJ2NvbG9yJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG4gICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMubGluZVdpZHRoKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAuYXR0cignZCcsIGRhdGEgPT4gdGhpcy5kM2xpbmUoZGF0YS52YWx1ZXMpKTtcblxuICAgIGlmICh0aGlzLmFyZWEpIHtcbiAgICAgIGdyb3VwRW50ZXJcbiAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdhcmVhJylcbiAgICAgICAgLmF0dHIoJ2QnLCBkYXRhID0+IHRoaXMuZDNhcmVhKGRhdGEudmFsdWVzKSlcbiAgICAgICAgLnN0eWxlKCdjb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgcG9pbnRzXG4gICAgaWYgKHRoaXMubGluZVBvaW50cykge1xuICAgICAgY29uc3QgcG9pbnRzID0gZ3JvdXBFbnRlclxuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BvaW50cycpXG4gICAgICAgIC5zdHlsZSgnY29sb3InLCBkID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSk7XG5cbiAgICAgIGNvbnN0IGNpcmNsZXMgPSBwb2ludHMuc2VsZWN0QWxsKCdjaXJjbGUnKS5kYXRhKGQgPT4gZC52YWx1ZXMpO1xuXG4gICAgICBjaXJjbGVzXG4gICAgICAgIC5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgIC5hdHRyKCdjeCcsIChkLCBpKSA9PiB0aGlzLnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UodGhpcy5kYXRhLmRhdGVzW2ldKSkpXG4gICAgICAgIC5hdHRyKCdjeScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQpKVxuICAgICAgICAuYXR0cigncicsIHRoaXMubGluZVdpZHRoICogMilcbiAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLmxpbmVXaWR0aCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSAhPT0gJ2hpZ2gnKSB7XG4gICAgICBsaW5lLmF0dHIoJ2ZpbHRlcicsICd1cmwoI2dsb3cpJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIGxldCBsZWdlbmRJdGVtID0gdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcbiAgICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhLnNlcmllcyk7XG5cbiAgICAgIGxlZ2VuZEl0ZW0uZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICAvLyB1cGRhdGUgZXhpc3RpbmcgaXRlbXNcbiAgICAgIGxlZ2VuZEl0ZW0uc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbChkID0+IHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmxhYmVsKTtcblxuICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBsZWdlbmQgaXRlbXMgb24gZW50ZXJcbiAgICAgIGxldCBlbnRlckxlZ2VuZEl0ZW0gPSBsZWdlbmRJdGVtXG4gICAgICAgIC5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoJ2xpJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJyk7XG5cbiAgICAgIGVudGVyTGVnZW5kSXRlbVxuICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1rZXknKVxuICAgICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCBkID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSk7XG5cbiAgICAgIGVudGVyTGVnZW5kSXRlbVxuICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgIC5odG1sKGQgPT4ge1xuICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgZW50ZXJMZWdlbmRJdGVtXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5sZWdlbmRNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3V0KCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmxlZ2VuZE1vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgbGV0IHRvb2x0aXBJdGVtID0gdGhpcy50b29sdGlwXG4gICAgICAgIC5zZWxlY3QoJy50b29sdGlwLXRhYmxlJylcbiAgICAgICAgLnNlbGVjdEFsbCgndHInKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEuc2VyaWVzKTtcblxuICAgICAgdG9vbHRpcEl0ZW0uZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICAvLyB1cGRhdGUgZXhpc3RpbmcgaXRlbXNcbiAgICAgIHRvb2x0aXBJdGVtLnNlbGVjdCgnLnRvb2x0aXAtbGFiZWwgcHItMicpLmh0bWwoZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0KGQubGFiZWwpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGl0ZW1zIG9uIGVudGVyXG4gICAgICBsZXQgZW50ZXJ0b29sdGlwSXRlbSA9IHRvb2x0aXBJdGVtXG4gICAgICAgIC5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoJ3RyJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaXRlbScpO1xuXG4gICAgICBlbnRlcnRvb2x0aXBJdGVtXG4gICAgICAgIC5hcHBlbmQoJ3RkJylcbiAgICAgICAgLnN0eWxlKCdjb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcC1rZXknKTtcblxuICAgICAgZW50ZXJ0b29sdGlwSXRlbVxuICAgICAgICAuYXBwZW5kKCd0ZCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd0b29sdGlwLWxhYmVsIHByLTIgdGV4dC1ub3dyYXAnKVxuICAgICAgICAuaHRtbChkID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlID8gdGhpcy50b29sdGlwTGFiZWxGb3JtYXQoZC5sYWJlbCkgOiBkLmxhYmVsO1xuICAgICAgICB9KTtcblxuICAgICAgZW50ZXJ0b29sdGlwSXRlbVxuICAgICAgICAuYXBwZW5kKCd0ZCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd0b29sdGlwLXZhbHVlIHRleHQtcmlnaHQgdGV4dC1ub3dyYXAnKVxuICAgICAgICAuaHRtbChkID0+ICcnKTtcbiAgICB9XG5cbiAgICB0aGlzLm1vdXNlcmVjdC5yYWlzZSgpO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGluZS1ncm91cCcpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgY29uc3QgbGluZSA9IHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGluZS1ncm91cCcpLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpO1xuICAgIGxpbmUuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBpZiAodGhpcy5saW5lUG9pbnRzKSB7XG4gICAgICBjb25zdCBjaXJjbGVzID0gbGluZS5zZWxlY3RBbGwoJ2NpcmNsZScpO1xuICAgICAgY2lyY2xlcy5jbGFzc2VkKCdhY3RpdmUnLCB0cnVlKTtcbiAgICB9XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5saW5lLWdyb3VwJylcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKVxuICAgICAgLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcblxuICAgIGlmICh0aGlzLmxpbmVQb2ludHMpIHtcbiAgICAgIGNvbnN0IGNpcmNsZXMgPSB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnY2lyY2xlJyk7XG4gICAgICBjaXJjbGVzLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBtb3VzZXJlY3RNb3VzZU1vdmUgPSAoZXZlbnQsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGNvbnN0IG1vdXNlWERhdGUgPSB0aGlzLnhBeGlzU2NhbGUuaW52ZXJ0KGQzX21vdXNlKG5vZGVzWzBdKVswXSk7IC8vIHJldHVybiBkYXRlIGF0IG1vdXNlIHggcG9zaXRpb25cbiAgICBjb25zdCBsZWZ0SW5kZXggPSBkM19iaXNlY3RMZWZ0KHRoaXMuZGF0YS5kYXRlcywgZDNfaXNvRm9ybWF0KG1vdXNlWERhdGUpKTsgLy8gaW5kZXggb2YgbGVmdCBjbG9zZXN0IGRhdGVcblxuICAgIC8vIHByZXZlbnQgZXJyb3IgZm9yIDAgaW5kZXhcbiAgICBpZiAobGVmdEluZGV4ID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBkYXRlTG93ZXIgPSBuZXcgRGF0ZSh0aGlzLmRhdGEuZGF0ZXNbbGVmdEluZGV4IC0gMV0pO1xuICAgIGNvbnN0IGRhdGVVcHBlciA9IG5ldyBEYXRlKHRoaXMuZGF0YS5kYXRlc1tsZWZ0SW5kZXhdKTtcbiAgICBjb25zdCBjbG9zZXN0RGF0ZSA9ICttb3VzZVhEYXRlIC0gK2RhdGVMb3dlciA+ICtkYXRlVXBwZXIgLSBtb3VzZVhEYXRlID8gZGF0ZVVwcGVyIDogZGF0ZUxvd2VyOyAvLyBkYXRlIG1vdXNlIGlzIGNsb3Nlc3QgdG9cbiAgICBjb25zdCBjbG9zZXN0SW5kZXggPSB0aGlzLmRhdGEuZGF0ZXMuaW5kZXhPZihkM19pc29Gb3JtYXQoY2xvc2VzdERhdGUpKTsgLy8gd2hpY2ggaW5kZXggdGhlIG1vdXNlIGlzIGNsb3Nlc3QgdG9cbiAgICAvLyBjb25zb2xlLmxvZygrbW91c2VYRGF0ZSwgbGVmdEluZGV4LCArZGF0ZUxvd2VyLCArZGF0ZVVwcGVyLCArY2xvc2VzdERhdGUsIGNsb3Nlc3RJbmRleCk7XG5cbiAgICBjb25zdCBjaXJjbGVzID0gdGhpcy5zdmcuc2VsZWN0QWxsKCcubGluZS1ncm91cCcpLnNlbGVjdEFsbCgnY2lyY2xlJyk7XG4gICAgY2lyY2xlcy5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGNsb3Nlc3RJbmRleCkuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG4gICAgY2lyY2xlcy5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGNsb3Nlc3RJbmRleCkuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy50b29sdGlwTGluZVxuICAgICAgLmF0dHIoJ3gxJywgdGhpcy54QXhpc1NjYWxlKGNsb3Nlc3REYXRlKSlcbiAgICAgIC5hdHRyKCd4MicsIHRoaXMueEF4aXNTY2FsZShjbG9zZXN0RGF0ZSkpXG4gICAgICAuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRvb2x0aXBMaW5lLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCkpO1xuICAgIHRoaXMudG9vbHRpcFNob3codGhpcy50b29sdGlwTGluZS5ub2RlKCksIGNsb3Nlc3RJbmRleCk7XG5cbiAgICB0aGlzLm1vdXNlZGF0YSA9IHtcbiAgICAgIGRhdGU6IGNsb3Nlc3REYXRlLFxuICAgICAgc2VyaWVzOiB0aGlzLmRhdGEuc2VyaWVzLm1hcChkID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsYWJlbDogZC5sYWJlbCxcbiAgICAgICAgICB2YWx1ZTogZC52YWx1ZXNbY2xvc2VzdEluZGV4XVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICB9O1xuXG4gICAgdGhpcy50b29sdGlwSG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGE6IHRoaXMubW91c2VkYXRhIH0pO1xuICB9O1xuXG4gIG1vdXNlcmVjdE1vdXNlT3V0ID0gKGV2ZW50LCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJ2NpcmNsZScpLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcbiAgICB0aGlzLnRvb2x0aXBMaW5lLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgbW91c2VyZWN0TW91c2VDbGljayA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBDbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YTogdGhpcy5tb3VzZWRhdGEgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChub2RlLCBjbG9zZXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBjb25zdCBtb3VzZXJlY3REaW1lbnNpb25zID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHRvb2x0aXBEaW1lbnNpb25zID0gdGhpcy50b29sdGlwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkaW1lbnNpb25DYWxjdWxhdGVkID0gbW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgdG9vbHRpcERpbWVuc2lvbnMud2lkdGggKyA4O1xuICAgIGNvbnN0IGNsaWVudFdpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIDEwO1xuICAgIGxldCBwb3NpdGlvbjtcblxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbCwgbW91c2VyZWN0RGltZW5zaW9ucywgdG9vbHRpcE9mZnNldEhlaWdodCwgdG9vbHRpcERpbWVuc2lvbnMsIGRpbWVuc2lvbkNhbGN1bGF0ZWQsIGNsaWVudFdpZHRoKTtcblxuICAgIHRoaXMudG9vbHRpcC5zZWxlY3QoJy50b29sdGlwLWhlYWRlcicpLmh0bWwoZCA9PiB7XG4gICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UodGhpcy5kYXRhLmRhdGVzW2Nsb3Nlc3RJbmRleF0pO1xuICAgICAgcmV0dXJuIHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0QWxsKCcudG9vbHRpcC12YWx1ZScpLmh0bWwoKGQsIGkpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGVcbiAgICAgICAgPyB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCh0aGlzLmRhdGEuc2VyaWVzW2ldLnZhbHVlc1tjbG9zZXN0SW5kZXhdKVxuICAgICAgICA6IHRoaXMuZGF0YS5zZXJpZXNbaV0udmFsdWVzW2Nsb3Nlc3RJbmRleF07XG4gICAgfSk7XG5cbiAgICAvLyBmbGlwIHRoZSB0b29sdGlwIHBvc2l0aW9ucyBpZiBuZWFyIHRoZSByaWdodCBlZGdlIG9mIHRoZSBzY3JlZW5cbiAgICBpZiAoZGltZW5zaW9uQ2FsY3VsYXRlZCA+IGNsaWVudFdpZHRoKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIHRydWUpO1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3dlc3QnLCBmYWxzZSk7XG4gICAgICBwb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCAtIHRvb2x0aXBEaW1lbnNpb25zLndpZHRoIC0gOH1weGA7XG4gICAgfSBlbHNlIGlmIChkaW1lbnNpb25DYWxjdWxhdGVkIDwgY2xpZW50V2lkdGgpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdlYXN0JywgZmFsc2UpO1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3dlc3QnLCB0cnVlKTtcbiAgICAgIHBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgOH1weGA7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ1BPU0lUSU9OOiAnLCBwb3NpdGlvbiwgbW91c2VyZWN0RGltZW5zaW9ucyk7XG5cbiAgICAvLyBzZXQgdGhlIHRvb2x0aXAgc3R5bGVzXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKFxuICAgICAgJ3RvcCcsXG4gICAgICBgJHttb3VzZXJlY3REaW1lbnNpb25zLnRvcCArIG1vdXNlcmVjdERpbWVuc2lvbnMuaGVpZ2h0IC8gMiAtIHRvb2x0aXBPZmZzZXRIZWlnaHQgLyAyICsgc2Nyb2xsWzFdfXB4YFxuICAgICk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgcG9zaXRpb24pO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgIHJldHVybiB0aGlzLnhBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KGl0ZW0pO1xuICB9O1xufVxuIl19
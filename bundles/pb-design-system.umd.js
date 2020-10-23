(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@ng-bootstrap/ng-bootstrap'), require('d3-selection'), require('d3-scale'), require('d3-shape'), require('d3-interpolate'), require('d3-format'), require('d3-time-format'), require('d3'), require('d3-array'), require('d3-axis'), require('d3-ease'), require('d3-geo'), require('topojson-client'), require('d3-collection'), require('@angular/forms'), require('@angular/material/radio')) :
    typeof define === 'function' && define.amd ? define('pb-design-system', ['exports', '@angular/core', '@angular/common', '@ng-bootstrap/ng-bootstrap', 'd3-selection', 'd3-scale', 'd3-shape', 'd3-interpolate', 'd3-format', 'd3-time-format', 'd3', 'd3-array', 'd3-axis', 'd3-ease', 'd3-geo', 'topojson-client', 'd3-collection', '@angular/forms', '@angular/material/radio'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['pb-design-system'] = {}, global.ng.core, global.ng.common, global['^7']['0']['0'], global['d3-selection'], global['d3-scale'], global['d3-shape'], global['d3-interpolate'], global['d3-format'], global['d3-time-format'], global['^5']['16']['0'], global['d3-array'], global['d3-axis'], global['d3-ease'], global['d3-geo'], global['^3']['0']['0'], global['d3-collection'], global.ng.forms, global.ng.material.radio));
}(this, (function (exports, i0, common, ngBootstrap, d3Selection, d3Scale, d3Shape, d3Interpolate, d3Format, d3TimeFormat, d3, d3Array, d3Axis, d3Ease, d3Geo, topojson, d3Collection, forms, radio) { 'use strict';

    var PbdsDatavizService = /** @class */ (function () {
        function PbdsDatavizService() {
            var _this = this;
            this.colors = {
                classic: {
                    full: [
                        '#B70077',
                        '#0384D4',
                        '#EE6B0B',
                        '#A319B1',
                        '#11A611',
                        '#1BB9FF',
                        '#495A9C',
                        '#EDB700',
                        '#8B98C8',
                        '#E6C49C',
                        '#CCB8CE',
                        '#9B9B9B'
                    ],
                    mono: ['#001D56', '#003296', '#4B74C5', '#89A1D0', '#A3BCEE', '#C9D7F3'] // blue
                },
                twilight: {
                    full: [
                        '#A319B1',
                        '#11A611',
                        '#1BB9FF',
                        '#EE6B0B',
                        '#B70077',
                        '#0384D4',
                        '#495A9C',
                        '#EDB700',
                        '#8B98C8',
                        '#E6C49C',
                        '#CCB8CE',
                        '#9B9B9B'
                    ],
                    mono: ['#05395C', '#0A5B92', '#0072B8', '#5DA9DC', '#A5D4F3', '#D1EDFF'] // light blue
                },
                ocean: {
                    full: [
                        '#0384D4',
                        '#B70077',
                        '#1BB9FF',
                        '#495A9C',
                        '#EDB700',
                        '#A319B1',
                        '#EE6B0B',
                        '#11A611',
                        '#8B98C8',
                        '#E6C49C',
                        '#CCB8CE',
                        '#9B9B9B'
                    ],
                    mono: ['#394B4D', '#3A6B6E', '#14767D', '#99BFC2', '#C9E6E8', '#DEECED'] // blue-green
                },
                sunset: {
                    full: [
                        '#B70077',
                        '#EE6B0B',
                        '#1BB9FF',
                        '#EDB700',
                        '#11A611',
                        '#A319B1',
                        '#0384D4',
                        '#CCB8CE',
                        '#495A9C',
                        '#E6C49C',
                        '#8B98C8',
                        '#9B9B9B'
                    ],
                    mono: ['#31254A', '#50248F', '#7945C4', '#9A79E2', '#C4A8FF', '#D9C7FF'] // purple
                }
            };
            this.getColors = function (mono, theme) {
                if (mono === void 0) { mono = false; }
                if (theme === void 0) { theme = 'classic'; }
                return mono ? _this.colors[theme].mono : _this.colors[theme].full;
            };
            this.createGradientDefs = function (svg, mono, theme, vertical) {
                if (mono === void 0) { mono = false; }
                if (theme === void 0) { theme = 'classic'; }
                if (vertical === void 0) { vertical = true; }
                var colors = mono ? [_this.colors[theme].mono[2]] : _this.colors[theme].full;
                for (var i = 0; i < colors.length; i++) {
                    var color = mono ? _this.colors[theme].mono[2] : _this.colors[theme].full[i];
                    var gradient = void 0;
                    if (vertical) {
                        gradient = svg
                            .append('defs')
                            .append('linearGradient')
                            .attr('id', "gradient-" + color.replace('#', ''))
                            .attr('x1', '0')
                            .attr('y1', '0')
                            .attr('x2', '0')
                            .attr('y2', '1')
                            .attr('spreadMethod', 'pad');
                        gradient
                            .append('stop')
                            .attr('offset', '0%')
                            .attr('stop-color', color)
                            .attr('stop-opacity', '1'); // top of bar will be full opacity
                        gradient
                            .append('stop')
                            .attr('offset', '100%')
                            .attr('stop-color', color)
                            .attr('stop-opacity', '.3'); // bottom of bar will be .3 opacity
                    }
                    else {
                        gradient = svg
                            .append('defs')
                            .append('linearGradient')
                            .attr('id', "gradient-horizontal-" + color.replace('#', ''))
                            .attr('x1', '1')
                            .attr('y1', '0')
                            .attr('x2', '0')
                            .attr('y2', '0')
                            .attr('spreadMethod', 'pad');
                        gradient
                            .append('stop')
                            .attr('offset', '0%')
                            .attr('stop-color', color)
                            .attr('stop-opacity', '1'); // top of bar will be full opacity
                        gradient
                            .append('stop')
                            .attr('offset', '100%')
                            .attr('stop-color', color)
                            .attr('stop-opacity', '.3'); // bottom of bar will be .3 opacity
                    }
                }
                return colors;
            };
            this.createGlowFilter = function (svg) {
                // add a new definition
                var glow = svg
                    .append('defs')
                    .append('filter')
                    .attr('id', 'glow')
                    .attr('width', '200%')
                    .attr('height', '200%');
                glow
                    .append('feGaussianBlur')
                    .attr('in', 'SourceGraphic')
                    .attr('stdDeviation', 4);
                // build two dropshadows with different intensities
                var feOffsets = [
                    {
                        dy: 2,
                        slope: 0.2
                    },
                    {
                        dy: 5,
                        slope: 0.05
                    }
                ];
                for (var i = 0; i < feOffsets.length; i++) {
                    glow
                        .append('feOffset')
                        .attr('result', 'offsetBlur' + i)
                        .attr('dx', 0)
                        .attr('dy', feOffsets[i].dy);
                }
                for (var y = 0; y < feOffsets.length; y++) {
                    glow
                        .append('feComponentTransfer')
                        .attr('result', 'coloredBlur' + y)
                        .attr('in', 'offsetBlur' + y)
                        .append('feFuncA')
                        .attr('type', 'linear')
                        .attr('slope', feOffsets[y].slope);
                }
                var merge = glow.append('feMerge');
                merge.append('feMergeNode').attr('in', 'SourceGraphic');
                for (var x = 0; x < feOffsets.length; x++) {
                    merge.append('feMergeNode').attr('in', 'coloredBlur' + x);
                }
            };
        }
        PbdsDatavizService.prototype.d3Format = function (type, string) {
            var format;
            switch (type) {
                case 'number':
                    format = d3.format(string);
                    break;
                case 'time':
                    format = d3.timeFormat(string);
                    break;
                default:
                    format = null;
                    break;
            }
            return format;
        };
        return PbdsDatavizService;
    }());
    PbdsDatavizService.ɵprov = i0.ɵɵdefineInjectable({ factory: function PbdsDatavizService_Factory() { return new PbdsDatavizService(); }, token: PbdsDatavizService, providedIn: "root" });
    PbdsDatavizService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    PbdsDatavizService.ctorParameters = function () { return []; };

    var PbdsDatavizPieComponent = /** @class */ (function () {
        function PbdsDatavizPieComponent(_dataviz, _element) {
            var _this = this;
            this._dataviz = _dataviz;
            this._element = _element;
            this.chartClass = true;
            this.pieClass = true;
            this.width = 300;
            this.type = 'pie';
            this.monochrome = false;
            this.legendLabelFormatType = null;
            this.legendLabelFormatString = '';
            this.legendValueFormatString = '';
            this.tooltipLabelFormatType = null;
            this.tooltipLabelFormatString = '';
            this.tooltipValueFormatString = '';
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.currentData = [];
            this.updateChart = function (firstRun) {
                if (firstRun === void 0) { firstRun = true; }
                // slices
                _this.svg
                    .selectAll('path')
                    .data(_this.pie(_this.data))
                    .join(function (enter) {
                    var path = enter.append('path');
                    path
                        .each(function (d) { return (d.outerRadius = _this.outerRadius); })
                        .attr('fill', function (d) { return _this.colorRange(d.data.label); })
                        .attr('class', 'slice')
                        .each(function (d, i, nodes) {
                        _this.currentData.splice(i, 1, d);
                    });
                    if (_this.type === 'pie') {
                        path
                            .style('stroke', '#fff')
                            .style('stroke-width', 2)
                            .style('stroke-alignment', 'inner');
                    }
                    path.call(function (path) { return path
                        .transition()
                        .duration(function (d, i, n) { return (firstRun ? 0 : 500); })
                        .attrTween('d', _this.arcEnterTween); });
                    return path;
                }, function (update) {
                    _this.tooltipHide();
                    update
                        .each(function (d) { return (d.outerRadius = _this.outerRadius); })
                        .call(function (update) { return update
                        .transition()
                        .duration(500)
                        .attrTween('d', _this.arcTween); });
                    return update;
                }, function (exit) { return exit.remove(); })
                    .on('mouseover', function (data, index, nodes) {
                    _this.pathMouseOver(d3Selection.event, data, index, nodes);
                    // this.tooltipShow(this.chart.node(), data);
                })
                    .on('mousemove', function (data, index, nodes) {
                    _this.tooltipShow(_this.chart.node(), data);
                    _this.tooltipMove(_this.chart.node());
                })
                    .on('mouseout', function (data, index, nodes) {
                    _this.pathMouseOut(data, index, nodes);
                    _this.tooltipHide();
                })
                    .on('click', function (data, index, nodes) {
                    _this.pathClick(d3Selection.event, data, index, nodes);
                });
                // legend
                _this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(_this.data)
                    .join(function (enter) {
                    var li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', function (d) { return _this.colorRange(d.label); });
                    var description = li.append('span').attr('class', 'legend-description');
                    description
                        .append('span')
                        .attr('class', 'legend-label')
                        .html(function (d) {
                        switch (_this.legendLabelFormatType) {
                            case 'time':
                                var parsedTime = d3TimeFormat.isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    });
                    description
                        .append('span')
                        .attr('class', 'legend-value')
                        .html(function (d) { return _this.legendValueFormat(d.value); });
                    return li;
                }, function (update) {
                    update.selectAll('.legend-key').style('background-color', function (d) { return _this.colorRange(d.label); });
                    update.select('.legend-label').html(function (d) {
                        switch (_this.legendLabelFormatType) {
                            case 'time':
                                var parsedTime = d3TimeFormat.isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    });
                    update.select('.legend-value').html(function (d) { return _this.legendValueFormat(d.value); });
                    return update;
                }, function (exit) { return exit.remove(); })
                    .on('mouseover focus', function (data, index, nodes) {
                    _this.legendMouseOverFocus(data, index, nodes);
                    _this.pathMouseOver(d3Selection.event, data, index, nodes);
                })
                    .on('mouseout blur', function (data, index, nodes) {
                    _this.legendMouseOutBlur(data, index, nodes);
                    _this.pathMouseOut(data, index, nodes);
                })
                    .on('click', function (data, index, nodes) {
                    _this.clicked.emit({ event: d3Selection.event, data: data });
                });
            };
            this.arcEnterTween = function (data, index, nodes) {
                var i = d3Interpolate.interpolate(data.startAngle, data.endAngle);
                return function (t) {
                    data.endAngle = i(t);
                    return _this.arc(data);
                };
            };
            this.arcTween = function (data, index, nodes) {
                // console.log('ARGS: ', data, index, nodes);
                var i = d3Interpolate.interpolate(_this.currentData[index], data);
                _this.currentData[index] = i(1);
                return function (t) { return _this.arc(i(t)); };
            };
            this.arcExitTween = function (data, index, nodes) {
                var end = Object.assign({}, _this.currentData[index], { startAngle: _this.currentData[index].endAngle });
                var i = d3Interpolate.interpolate(data, end);
                return function (t) {
                    return _this.arc(i(t));
                };
            };
            this.arcMouseOverTween = function (data, index, nodes) {
                var i = d3Interpolate.interpolate(data.outerRadius, _this.outerRadius + _this.arcZoom);
                return function (t) {
                    data.outerRadius = i(t);
                    return _this.arc(data);
                };
            };
            this.arcMouseOutTween = function (data, index, nodes) {
                var i = d3Interpolate.interpolate(data.outerRadius, _this.outerRadius);
                return function (t) {
                    data.outerRadius = i(t);
                    return _this.arc(data);
                };
            };
            this.legendMouseOverFocus = function (data, index, nodes) {
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
            };
            this.legendMouseOutBlur = function (data, index, nodes) {
                _this.chart.selectAll('.legend-item').classed('inactive', false);
            };
            this.pathMouseOver = function (event, data, index, nodes) {
                var slices = _this.chart.selectAll('.slice');
                var slice = slices.filter(function (d, i) { return i === index; });
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                slices.filter(function (d, i) { return i !== index; }).classed('inactive', true);
                slice
                    .transition()
                    .duration(300)
                    .delay(0)
                    .attrTween('d', _this.arcMouseOverTween);
                _this.hovered.emit({
                    event: event,
                    data: data.data ? data.data : data // legend hover data is different than slice hover data
                });
            };
            this.pathMouseOut = function (data, index, value) {
                var slices = _this.chart.selectAll('.slice');
                var slice = slices.filter(function (d, i) { return i === index; });
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', false);
                slices.classed('inactive', false);
                slice
                    .transition()
                    .duration(300)
                    .delay(0)
                    .attrTween('d', _this.arcMouseOutTween);
            };
            this.pathClick = function (event, data, index, nodes) {
                _this.clicked.emit({
                    event: event,
                    data: data.data
                });
            };
            this.tooltipShow = function (node, data) {
                _this.tooltipSetPosition(node);
                var percentage = (data.endAngle - data.startAngle) / (2 * Math.PI);
                var label;
                switch (_this.tooltipLabelFormatType) {
                    case 'time':
                        var parsedTime = d3TimeFormat.isoParse(data.data.label);
                        label = _this.tooltipLabelFormat(parsedTime);
                        break;
                    default:
                        label = data.data.label;
                }
                _this.tooltip.html("\n        <div class=\"tooltip-label\">" + label + "</div>\n        <div class=\"tooltip-value\">" + _this.tooltipValueFormat(percentage) + "</div>\n      ");
                _this.tooltip.style('opacity', 1);
            };
            this.tooltipMove = function (node) {
                _this.tooltipSetPosition(node);
            };
            this.tooltipHide = function () {
                _this.tooltip.style('opacity', 0);
            };
            this.tooltipSetPosition = function (node) {
                var coordinates = d3Selection.mouse(node);
                _this.tooltip.style('left', coordinates[0] + 16 + "px");
                _this.tooltip.style('top', coordinates[1] + 16 + "px");
            };
        }
        PbdsDatavizPieComponent.prototype.ngOnInit = function () {
            this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
            this.width = this.width - this.margin.left - this.margin.right;
            this.height = this.width - this.margin.top - this.margin.bottom;
            this.colors = this._dataviz.getColors(this.monochrome, this.theme);
            this.innerRadius = Math.min(this.width, this.height) / 2.5;
            this.outerRadius = Math.min(this.width, this.height) / 2;
            this.arcZoom = 10;
            this.anglePad = 0.02;
            this.legendValueFormat = d3Format.format(this.legendValueFormatString);
            this.tooltipValueFormat = d3Format.format(this.tooltipValueFormatString);
            // create formatters
            this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
            this.tooltipLabelFormat = this._dataviz.d3Format(this.tooltipLabelFormatType, this.tooltipLabelFormatString);
            this.colorRange = d3Scale.scaleOrdinal()
                .range(this.colors)
                .domain(this.data.map(function (c) { return c.label; }));
            if (this.type === 'pie') {
                this.innerRadius = 0;
                this.anglePad = 0;
            }
            this.pie = d3Shape.pie()
                .padAngle(this.anglePad)
                .value(function (d) { return d.value; })
                .sort(null);
            this.arc = d3Shape.arc()
                .padRadius(this.outerRadius)
                .innerRadius(this.innerRadius);
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            this.svg = this.chart
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', "-" + (this.width / 2 + this.margin.left) + " -" + (this.height / 2 + this.margin.top) + " " + (this.width +
                this.margin.left +
                this.margin.right) + " " + (this.height + this.margin.top + this.margin.bottom));
            this.chart.append('ul').attr('class', 'legend legend-right');
            this.tooltip = this.chart
                .append('div')
                .style('opacity', 0)
                .attr('class', 'pbds-tooltip')
                .attr('aria-hidden', 'true');
            this.updateChart();
        };
        PbdsDatavizPieComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.updateChart(false);
            }
        };
        PbdsDatavizPieComponent.prototype.ngOnDestroy = function () {
            if (this.tooltip)
                this.tooltip.remove();
        };
        return PbdsDatavizPieComponent;
    }());
    PbdsDatavizPieComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-pie',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    PbdsDatavizPieComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: i0.ElementRef }
    ]; };
    PbdsDatavizPieComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        pieClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-pie',] }],
        data: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        type: [{ type: i0.Input }],
        monochrome: [{ type: i0.Input }],
        legendLabelFormatType: [{ type: i0.Input }],
        legendLabelFormatString: [{ type: i0.Input }],
        legendValueFormatString: [{ type: i0.Input }],
        tooltipLabelFormatType: [{ type: i0.Input }],
        tooltipLabelFormatString: [{ type: i0.Input }],
        tooltipValueFormatString: [{ type: i0.Input }],
        theme: [{ type: i0.Input }],
        hovered: [{ type: i0.Output }],
        clicked: [{ type: i0.Output }]
    };

    var PbdsDatavizBarComponent = /** @class */ (function () {
        function PbdsDatavizBarComponent(_dataviz, _element, _scroll, _location) {
            var _this = this;
            this._dataviz = _dataviz;
            this._element = _element;
            this._scroll = _scroll;
            this._location = _location;
            this.chartClass = true;
            this.barClass = true;
            this.width = 306;
            this.height = 400;
            this.type = 'medium'; // debug to show all chart options
            this.singleSeries = false;
            this.xAxisFormatType = null;
            this.xAxisFormatString = '';
            this.xAxisTitle = null;
            this.yAxisFormatType = null;
            this.yAxisFormatString = '';
            this.yAxisTicks = 5;
            this.yAxisMinBuffer = 0.01;
            this.yAxisMaxBuffer = 0.01;
            this.hideLegend = false;
            this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
            this.legendPosition = 'right';
            this.legendLabelFormatType = null;
            this.legendLabelFormatString = '';
            this.tooltipLabelFormatType = null;
            this.tooltipLabelFormatString = '';
            this.tooltipValueFormatType = null;
            this.tooltipValueFormatString = '';
            this.marginTop = 10; // hardcoded on purpose, do not document until feedback
            this.marginRight = 0; // hardcoded on purpose, do not document until feedback
            this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
            this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
            this.threshold = null;
            this.thresholdLabel = 'Threshold';
            this.average = null;
            this.averageLabel = 'Average';
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.updateChart = function () {
                // update the xScale
                _this.xAxisScale.domain(_this.data.map(function (d) { return d.label; }));
                // update the yScale
                _this.yAxisScale
                    .domain([
                    d3Array.min(_this.data, function (d) { return d.value - d.value * +_this.yAxisMinBuffer; }),
                    d3Array.max(_this.data, function (d) { return d.value + d.value * +_this.yAxisMaxBuffer; })
                ])
                    .rangeRound([_this.height, 0])
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
                if (!_this.hideGrayBars) {
                    // gray bars
                    _this.svg
                        .selectAll('.gray-bar')
                        .data(_this.data)
                        .join(function (enter) { return enter
                        .append('rect')
                        .attr('class', 'gray-bar')
                        .attr('height', 0)
                        .attr('x', function (d) { return _this.xAxisScale(d.label); })
                        .attr('width', _this.xAxisScale.bandwidth())
                        .call(function (enter) { return enter
                        .transition()
                        .duration(500)
                        .attr('height', _this.height); }); }, function (update) { return update
                        .transition()
                        .duration(1000)
                        .attr('x', function (d) { return _this.xAxisScale(d.label); })
                        .attr('width', _this.xAxisScale.bandwidth()); }, function (exit) { return exit
                        .transition()
                        .attr('pointer-events', 'none')
                        .remove(); });
                    // color bars
                    _this.svg
                        .selectAll('.bar')
                        .data(_this.data)
                        .join(function (enter) { return enter
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('fill', function (d) { return "url(" + _this._location.path() + "#gradient-" + _this.colorRange(d.label).substr(1) + ")"; }) // removes hash to prevent safari bug;
                        .attr('x', function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 4; })
                        .attr('width', _this.xAxisScale.bandwidth() / 2)
                        .attr('y', _this.height)
                        .attr('height', 0)
                        .attr('pointer-events', 'none')
                        .call(function (enter) { return enter
                        .transition()
                        .duration(1000)
                        .attr('y', function (d) { return _this.yAxisScale(d.value); })
                        .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); })
                        .attr('data-color', function (d) { return _this.colorRange(d.label); })
                        .transition()
                        .attr('pointer-events', 'auto'); }); }, function (update) { return update
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .attr('x', function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 4; })
                        .attr('width', _this.xAxisScale.bandwidth() / 2)
                        .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); })
                        .attr('y', function (d) { return _this.yAxisScale(d.value); })
                        .transition()
                        .attr('pointer-events', 'auto'); }, function (exit) { return exit
                        .transition()
                        .attr('pointer-events', 'none')
                        .remove(); })
                        .on('mouseover', function (data, index, nodes) { return _this.barMouseOver(d3Selection.event, data, index, nodes); })
                        .on('mouseout', function (data, index, nodes) { return _this.barMouseOut(); })
                        .on('click', function (data, index, nodes) { return _this.barMouseClick(d3Selection.event, data, index, nodes); });
                }
                else {
                    // color bars
                    _this.svg
                        .selectAll('.bar')
                        .data(_this.data)
                        .join(function (enter) { return enter
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('fill', function (d) { return "url(" + _this._location.path() + "#gradient-" + _this.colorRange(d.label).substr(1) + ")"; })
                        .attr('x', function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 5.5; })
                        .attr('width', _this.xAxisScale.bandwidth() / 1.5)
                        .attr('y', _this.height)
                        .attr('height', 0)
                        .attr('pointer-events', 'none')
                        .call(function (enter) { return enter
                        .transition()
                        .duration(1000)
                        .attr('y', function (d) { return _this.yAxisScale(d.value); })
                        .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); })
                        .attr('data-color', function (d) { return _this.colorRange(d.label); })
                        .transition()
                        .attr('pointer-events', 'auto'); }); }, function (update) { return update
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .attr('x', function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 5.5; })
                        .attr('width', _this.xAxisScale.bandwidth() / 1.5)
                        .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); })
                        .attr('y', function (d) { return _this.yAxisScale(d.value); })
                        .transition()
                        .attr('pointer-events', 'auto'); }, function (exit) { return exit
                        .transition()
                        .attr('pointer-events', 'none')
                        .remove(); })
                        .on('mouseover', function (data, index, nodes) { return _this.barMouseOver(d3Selection.event, data, index, nodes); })
                        .on('mouseout', function (data, index, nodes) { return _this.barMouseOut(); })
                        .on('click', function (data, index, nodes) { return _this.barMouseClick(d3Selection.event, data, index, nodes); });
                }
                if (!_this.hideLegend) {
                    _this.chart
                        .select('.legend')
                        .selectAll('.legend-item')
                        .data(_this.data)
                        .join(function (enter) {
                        var li = enter.insert('li', 'li.legend-static').attr('class', 'legend-item');
                        li.append('span')
                            .attr('class', 'legend-key')
                            .style('background-color', function (d) { return _this.colorRange(d.label); });
                        li.append('span')
                            .attr('class', 'legend-label')
                            .html(function (d) {
                            switch (_this.legendLabelFormatType) {
                                case 'number':
                                    return _this.legendLabelFormat(d.label);
                                case 'time':
                                    var parsedTime = d3TimeFormat.isoParse(d.label);
                                    return _this.legendLabelFormat(parsedTime);
                                default:
                                    return d.label;
                            }
                        });
                        return li;
                    }, function (update) { return update.select('.legend-label').html(function (d) {
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.label);
                            case 'time':
                                var parsedTime = d3TimeFormat.isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    }); }, function (exit) { return exit.remove(); })
                        .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3Selection.event, data, index, nodes); })
                        .on('mouseout', function () { return _this.legendMouseOut(); })
                        .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3Selection.event, data, index, nodes); });
                }
                if (_this.threshold) {
                    _this.yThreshold
                        .raise()
                        .transition()
                        .duration(1000)
                        .attr('transform', "translate(0,  " + _this.yAxisScale(+_this.threshold) + ")");
                }
                if (_this.average) {
                    _this.yAverage
                        .raise()
                        .transition()
                        .duration(1000)
                        .attr('transform', "translate(0,  " + _this.yAxisScale(+_this.average) + ")");
                }
            };
            this.barMouseOver = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.bar')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                var bar = _this.chart.selectAll('.bar').filter(function (d, i) { return i === index; });
                var barColor = bar.attr('data-color');
                bar.style('fill', barColor);
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.tooltipShow(data, nodes.filter(function (d, i) { return i === index; })[0]);
                _this.hovered.emit({ event: event, data: data });
            };
            this.barMouseOut = function () {
                _this.chart
                    .selectAll('.bar')
                    .classed('inactive', false)
                    .style('fill', null);
                _this.chart.selectAll('.legend-item').classed('inactive', false);
                _this.tooltipHide();
            };
            this.barMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.legendMouseOver = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.chart
                    .selectAll('.bar')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                var bar = _this.chart.selectAll('.bar').filter(function (d, i) { return i === index; });
                var barColor = bar.attr('data-color');
                bar.style('fill', barColor);
                _this.tooltipShow(data, _this.chart
                    .selectAll('.bar')
                    .filter(function (d, i) { return i === index; })
                    .node());
                _this.hovered.emit({ event: event, data: data });
            };
            this.legendMouseOut = function () {
                _this.chart.selectAll('.legend-item').classed('inactive', false);
                _this.chart
                    .selectAll('.bar')
                    .classed('inactive', false)
                    .style('fill', null);
                _this.tooltipHide();
            };
            this.legendMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.tooltipShow = function (data, node) {
                var dimensions = node.getBoundingClientRect();
                var scroll = _this._scroll.getScrollPosition();
                var label;
                switch (_this.tooltipLabelFormatType) {
                    case 'number':
                        label = _this.tooltipLabelFormat(data.label);
                        break;
                    case 'time':
                        var parsedTime = d3TimeFormat.isoParse(data.label);
                        label = _this.tooltipLabelFormat(parsedTime);
                        break;
                    default:
                        label = data.label;
                }
                var value = _this.tooltipValueFormat === null
                    ? "<div class=\"tooltip-value\">" + data.value + "</div>"
                    : "<div class=\"tooltip-value\">" + _this.tooltipValueFormat(data.value) + "</div>";
                _this.tooltip.html("\n        " + (_this.hideTooltipLabel ? '' : "" + label) + "\n        " + value + "\n      ");
                var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
                var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight + 8;
                _this.tooltip.style('top', +scroll[1] + +dimensions.top - tooltipOffsetHeight + "px"); //
                _this.tooltip.style('left', +scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2 + "px");
                _this.tooltip.style('opacity', 1);
            };
            this.tooltipHide = function () {
                _this.tooltip.style('opacity', 0);
            };
            this.xAxisFormatter = function (item) {
                switch (_this.xAxisFormatType) {
                    case 'number':
                        return _this.xAxisFormat(item);
                    case 'time':
                        var parseDate = d3TimeFormat.isoParse(item);
                        return _this.xAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
            this.yAxisFormatter = function (item) {
                switch (_this.yAxisFormatType) {
                    case 'number':
                        return _this.yAxisFormat(item);
                    case 'time':
                        var parseDate = d3TimeFormat.isoParse(item);
                        return _this.yAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
        }
        PbdsDatavizBarComponent.prototype.ngOnInit = function () {
            var _this = this;
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
            this.xAxisTitleMargin = this.xAxisTitle ? 20 : 0;
            this.yAxisTickSize = 8;
            this.yAxisTickSizeOuter = 0;
            this.hideTooltipLabel = false;
            if (this.type !== 'debug') {
                // set type defaults
                switch (this.type) {
                    case 'low':
                        this.hideGrayBars = true;
                        this.hideXAxis = !this.hideLegend;
                        this.hideXAxisTicks = true;
                        this.hideXGrid = true;
                        this.hideYAxisDomain = false;
                        this.hideYAxisTicks = true;
                        this.legendPosition = 'bottom';
                        this.hideTooltipLabel = true;
                        break;
                    case 'medium':
                        this.hideXAxisDomain = true;
                        this.hideXAxis = !this.hideLegend;
                        this.hideXGrid = true;
                        this.hideXAxisTicks = true;
                        this.hideYAxisDomain = true;
                        this.hideYAxisTicks = true;
                        this.hideYGrid = true;
                        this.hideTooltipLabel = true;
                        break;
                    case 'high':
                        this.hideXAxis = true;
                        this.hideXAxisDomain = true;
                        this.hideXGrid = true;
                        this.hideYAxisDomain = true;
                        this.hideYAxisTicks = true;
                        this.hideYGrid = true;
                        this.hideLegend = true;
                        this.hideTooltipLabel = false;
                        break;
                }
                // single series overrides
                if (this.singleSeries) {
                    this.hideLegend = true;
                    this.hideXAxis = true;
                    this.hideXGrid = true;
                    this.hideTooltipLabel = false;
                }
            }
            // adjust margin if xAxis hidden
            if (this.hideXAxis)
                this.margin.bottom = 10; // need small margin for yAxis with 0 tick label
            if (!this.hideLegend && this.legendPosition === 'right') {
                this.width = +this.width - +this.legendWidth;
            }
            // create the chart
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            // create chart svg
            this.svg = this.chart
                .append('svg')
                .attr('width', +this.width)
                .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + +this.width + " " + (+this.height +
                this.margin.top +
                this.margin.bottom +
                this.xAxisTitleMargin));
            // build color ranges
            this.colorRange = d3Scale.scaleOrdinal().range(this._dataviz.createGradientDefs(this.svg, this.singleSeries, this.theme));
            // X AXIS
            this.xAxisScale = d3Scale.scaleBand()
                .domain(this.data.map(function (d) { return d.label; }))
                .rangeRound([0, this.width - this.margin.left])
                .align(0);
            // add padding to the scale for gray bars
            !this.hideGrayBars
                ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
                : this.xAxisScale.paddingInner(0).paddingOuter(0);
            this.xAxisCall = d3Axis.axisBottom(this.xAxisScale)
                .tickSize(this.xAxisTickSize)
                .tickSizeOuter(this.xAxisTickSizeOuter)
                .tickFormat(this.xAxisFormatter);
            this.xAxis = this.svg
                .append('g')
                .attr('class', 'axis axis-x')
                .attr('transform', "translate(0, " + this.height + ")")
                .classed('axis-hidden', this.hideXAxis)
                .classed('axis-zero-hidden', this.hideXAxisZero)
                .classed('axis-domain-hidden', this.hideXAxisDomain)
                .classed('axis-ticks-hidden', this.hideXAxisTicks)
                .call(this.xAxisCall);
            // X GRIDLINES
            if (!this.hideXGrid) {
                this.xGridCall = d3Axis.axisBottom(this.xAxisScale).tickSize(-this.height);
                this.xGrid = this.svg
                    .append('g')
                    .attr('class', 'grid grid-x')
                    .classed('grid-zero-hidden', this.hideXAxisZero)
                    .attr('transform', "translate(0, " + this.height + ")")
                    .call(this.xGridCall);
            }
            // X AXIS TITLE
            if (this.xAxisTitle) {
                this.svg
                    .append('text')
                    .attr('class', 'axis-title')
                    .attr('text-anchor', 'center')
                    .attr('x', this.width / 2 - this.margin.left)
                    .attr('y', this.height + this.margin.top + (this.hideXAxis ? 15 : 0))
                    .text(this.xAxisTitle);
            }
            // Y AXIS
            this.yAxisScale = d3Scale.scaleLinear()
                .domain([
                d3Array.min(this.data, function (d) { return d.value - d.value * +_this.yAxisMinBuffer; }),
                d3Array.max(this.data, function (d) { return d.value + d.value * +_this.yAxisMaxBuffer; })
            ])
                .nice()
                .rangeRound([this.height, 0]);
            this.yAxisCall = d3Axis.axisLeft(this.yAxisScale)
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
                this.yGridCall = d3Axis.axisLeft(this.yAxisScale)
                    .ticks(this.yAxisTicks)
                    .tickSize(-this.width + this.margin.left + this.margin.right);
                this.yGrid = this.svg
                    .append('g')
                    .attr('class', 'grid grid-y')
                    .classed('grid-zero-hidden', this.hideYAxisZero)
                    .attr('transform', "translate(0, 0)")
                    .call(this.yGridCall);
            }
            // Y THRESHOLD
            if (this.threshold) {
                this.yThreshold = this.svg
                    .append('line')
                    .attr('class', 'threshold')
                    .attr('x2', +this.width - this.margin.right - this.margin.left)
                    .attr('transform', "translate(0,  " + this.yAxisScale(+this.threshold) + ")");
            }
            // Y AVERAGE
            if (this.average) {
                this.yAverage = this.svg
                    .append('line')
                    .attr('class', 'average')
                    .attr('x2', +this.width - this.margin.right - this.margin.left)
                    .attr('transform', "translate(0,  " + this.yAxisScale(+this.average) + ")");
            }
            // TOOLTIP
            if (!this.hideTooltip) {
                this.tooltip = d3Selection.select('body')
                    .append('div')
                    .attr('class', 'pbds-tooltip south')
                    .style('opacity', 0)
                    .attr('aria-hidden', 'true'); // hide tooltip for accessibility
            }
            // add legend classes
            if (!this.hideLegend) {
                this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
                this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
            }
            // add average to legend
            if (this.average && !this.hideLegend) {
                this.chart
                    .select('.legend')
                    .append('li')
                    .attr('class', 'legend-static legend-average')
                    .html(function () {
                    return "\n          <span class=\"legend-key\"></span>\n          <span class=\"legend-label\">" + _this.averageLabel + "</span>\n        ";
                });
            }
            // add threshold to legend
            if (this.threshold && !this.hideLegend) {
                this.chart
                    .select('.legend')
                    .append('li')
                    .attr('class', 'legend-static legend-threshold')
                    .html(function () {
                    return "\n          <span class=\"legend-key\"></span>\n          <span class=\"legend-label\">" + _this.thresholdLabel + "</span>\n        ";
                });
            }
            this.updateChart();
        };
        PbdsDatavizBarComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.updateChart();
            }
        };
        PbdsDatavizBarComponent.prototype.ngOnDestroy = function () {
            if (this.tooltip)
                this.tooltip.remove();
        };
        return PbdsDatavizBarComponent;
    }());
    PbdsDatavizBarComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-bar',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    PbdsDatavizBarComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: i0.ElementRef },
        { type: common.ViewportScroller },
        { type: common.Location }
    ]; };
    PbdsDatavizBarComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        barClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-bar',] }],
        data: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        height: [{ type: i0.Input }],
        type: [{ type: i0.Input }],
        singleSeries: [{ type: i0.Input }],
        xAxisFormatType: [{ type: i0.Input }],
        xAxisFormatString: [{ type: i0.Input }],
        xAxisTitle: [{ type: i0.Input }],
        yAxisFormatType: [{ type: i0.Input }],
        yAxisFormatString: [{ type: i0.Input }],
        yAxisTicks: [{ type: i0.Input }],
        yAxisMinBuffer: [{ type: i0.Input }],
        yAxisMaxBuffer: [{ type: i0.Input }],
        hideLegend: [{ type: i0.Input }],
        legendWidth: [{ type: i0.Input }],
        legendPosition: [{ type: i0.Input }],
        legendLabelFormatType: [{ type: i0.Input }],
        legendLabelFormatString: [{ type: i0.Input }],
        tooltipLabelFormatType: [{ type: i0.Input }],
        tooltipLabelFormatString: [{ type: i0.Input }],
        tooltipValueFormatType: [{ type: i0.Input }],
        tooltipValueFormatString: [{ type: i0.Input }],
        marginTop: [{ type: i0.Input }],
        marginRight: [{ type: i0.Input }],
        marginBottom: [{ type: i0.Input }],
        marginLeft: [{ type: i0.Input }],
        threshold: [{ type: i0.Input }],
        thresholdLabel: [{ type: i0.Input }],
        average: [{ type: i0.Input }],
        averageLabel: [{ type: i0.Input }],
        theme: [{ type: i0.Input }],
        hovered: [{ type: i0.Output }],
        clicked: [{ type: i0.Output }]
    };

    // assign an ID for each component instance
    var nextId = 0;
    var PbdsDatavizLineComponent = /** @class */ (function () {
        function PbdsDatavizLineComponent(_dataviz, _element, _scroll, _location) {
            var _this = this;
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
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.tooltipHovered = new i0.EventEmitter();
            this.tooltipClicked = new i0.EventEmitter();
            this.updateChart = function () {
                _this.mouserect.data(_this.data);
                // update the xScale
                _this.xAxisScale.domain(d3Array.extent(_this.data.dates, function (d, i) {
                    return d3TimeFormat.isoParse(d);
                }));
                // update the yScale
                _this.yAxisScale
                    .domain([
                    d3Array.min(_this.data.series, function (d, i) {
                        var minVal = +d3Array.min(d.values);
                        return minVal - minVal * +_this.yAxisMinBuffer;
                    }),
                    d3Array.max(_this.data.series, function (d, i) {
                        var maxVal = +d3Array.max(d.values);
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
                // lines
                _this.svg
                    .selectAll('path.line')
                    .attr('filter', function () { return (_this.type !== 'high' ? "url(" + _this._location.path() + "#glow)" : null); })
                    .data(_this.data.series)
                    .join(function (enter) {
                    enter
                        .append('path')
                        .attr('clip-path', "url(" + _this._location.path() + "#clip-path-" + _this.clipPathId + ")")
                        .attr('class', 'line')
                        .style('stroke', function (d) { return _this.colorRange(d.label); })
                        .style('stroke-width', _this.lineWidth)
                        .attr('d', function (data) {
                        var array = new Array(data.values.length).fill(0);
                        return _this.d3line(array);
                    })
                        .call(function (enter) { return enter
                        .transition()
                        .duration(1000)
                        .ease(d3Ease.easeQuadInOut)
                        .attr('d', function (data) { return _this.d3line(data.values); }); });
                }, function (update) { return update.call(function (update) { return update
                    .transition()
                    .duration(1000)
                    .ease(d3Ease.easeQuadInOut)
                    .attr('d', function (d) { return _this.d3line(d.values); }); }); }, function (exit) { return exit.remove(); });
                // area
                if (_this.area) {
                    _this.svg
                        .selectAll('path.area')
                        .data(_this.data.series)
                        .join(function (enter) { return enter
                        .append('path')
                        .attr('clip-path', "url(" + _this._location.path() + "#clip-path-" + _this.clipPathId + ")")
                        .attr('class', 'area')
                        .attr('d', function (data) {
                        var array = new Array(data.values.length).fill(0);
                        return _this.d3area(array);
                    })
                        .style('color', function (d) { return _this.colorRange(d.label); })
                        .call(function (enter) { return enter
                        .transition()
                        .duration(1000)
                        .ease(d3Ease.easeQuadInOut)
                        .attr('d', function (data) { return _this.d3area(data.values); }); }); }, function (update) { return update.call(function (update) {
                        return update
                            .transition()
                            .duration(1000)
                            .ease(d3Ease.easeQuadInOut)
                            .attr('d', function (d) { return _this.d3area(d.values); });
                    }); }, function (exit) { return exit.remove(); });
                }
                // circles
                if (_this.linePoints) {
                    // add points
                    _this.svg
                        .selectAll('g.points')
                        .data(_this.data.series)
                        .join(function (enter) { return enter
                        .append('g')
                        .attr('class', 'points')
                        .attr('clip-path', "url(" + _this._location.path() + "#clip-path-points-" + _this.clipPathId + ")")
                        .style('color', function (d, i) { return _this.colorRange(d.label); })
                        .selectAll('circle')
                        .data(function (d) { return d.values; })
                        .join(function (enter) { return enter
                        .append('circle')
                        .attr('cx', function (d, i) { return _this.xAxisScale(d3TimeFormat.isoParse(_this.data.dates[i])); })
                        .attr('cy', function (d) { return _this.yAxisScale(0); })
                        .attr('r', _this.lineWidth * 2)
                        .style('stroke-width', _this.lineWidth)
                        .call(function (enter) { return enter
                        .transition()
                        .duration(1000)
                        .ease(d3Ease.easeQuadInOut)
                        .attr('cy', function (d) { return _this.yAxisScale(d); }); }); }, function () { }, function (exit) { return exit.remove(); }); }, function (update) { return update
                        .selectAll('circle')
                        .data(function (d) { return d.values; })
                        .join(function (enter) { return enter
                        .append('circle')
                        .attr('cx', function (d, i) { return _this.xAxisScale(d3TimeFormat.isoParse(_this.data.dates[i])); })
                        .attr('cy', function (d) { return _this.yAxisScale(d); })
                        .attr('r', _this.lineWidth * 2)
                        .style('stroke-width', _this.lineWidth); }, function (update) { return update.call(function (update) { return update
                        .transition()
                        .duration(1000)
                        .ease(d3Ease.easeQuadInOut)
                        .attr('cx', function (d, i) { return _this.xAxisScale(d3TimeFormat.isoParse(_this.data.dates[i])); })
                        .attr('cy', function (d) { return _this.yAxisScale(d); }); }); }, function (exit) { return exit.remove(); }); }, function (exit) { return exit.remove(); });
                }
                if (!_this.hideLegend) {
                    _this.chart
                        .select('.legend')
                        .selectAll('.legend-item')
                        .data(_this.data.series)
                        .join(function (enter) {
                        var li = enter.append('li').attr('class', 'legend-item');
                        li.append('span')
                            .attr('class', 'legend-key')
                            .style('background-color', function (d) { return _this.colorRange(d.label); });
                        li.append('span')
                            .attr('class', 'legend-label')
                            .html(function (d) {
                            switch (_this.legendLabelFormatType) {
                                case 'number':
                                    return _this.legendLabelFormat(d.label);
                                case 'time':
                                    var parsedTime = d3TimeFormat.isoParse(d.label);
                                    return _this.legendLabelFormat(parsedTime);
                                default:
                                    return d.label;
                            }
                        });
                        return li;
                    }, function (update) {
                        update.select('.legend-label').html(function (d) {
                            switch (_this.legendLabelFormatType) {
                                case 'number':
                                    return _this.legendLabelFormat(d.label);
                                case 'time':
                                    var parsedTime = d3TimeFormat.isoParse(d.label);
                                    return _this.legendLabelFormat(parsedTime);
                                default:
                                    return d.label;
                            }
                        });
                        return update;
                    }, function (exit) { return exit.remove(); })
                        .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3Selection.event, data, index, nodes); })
                        .on('mouseout', function () { return _this.legendMouseOut(); })
                        .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3Selection.event, data, index, nodes); });
                }
                if (!_this.hideTooltip) {
                    _this.tooltip
                        .select('.tooltip-table')
                        .selectAll('tr')
                        .data(_this.data.series)
                        .join(function (enter) {
                        var tooltipItem = enter.append('tr').attr('class', 'tooltip-item');
                        tooltipItem
                            .append('td')
                            .style('color', function (d) { return _this.colorRange(d.label); })
                            .append('span')
                            .attr('class', 'pbds-tooltip-key');
                        tooltipItem
                            .append('td')
                            .attr('class', 'tooltip-label pr-2 text-nowrap')
                            .html(function (d) {
                            return _this.tooltipLabelFormatType ? _this.tooltipLabelFormat(d.label) : d.label;
                        });
                        tooltipItem
                            .append('td')
                            .attr('class', 'tooltip-value text-right text-nowrap')
                            .html(function (d) { return ''; });
                        return tooltipItem;
                    }, function () { }, function (exit) { return exit.remove(); });
                }
                _this.svg.selectAll('.points').raise();
                _this.mouserect.raise();
            };
            this.legendMouseOver = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.svg
                    .selectAll('.line')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.svg
                    .selectAll('.line')
                    .filter(function (d, i) { return i === index; })
                    .classed('active', true);
                if (_this.area) {
                    _this.svg
                        .selectAll('.area')
                        .filter(function (d, i) { return i !== index; })
                        .classed('inactive', true);
                }
                if (_this.linePoints) {
                    _this.svg
                        .selectAll('.points')
                        .filter(function (d, i) { return i !== index; })
                        .selectAll('circle')
                        .classed('inactive', true);
                }
                _this.hovered.emit({ event: event, data: data });
            };
            this.legendMouseOut = function () {
                _this.chart.selectAll('.legend-item').classed('inactive', false);
                _this.chart
                    .selectAll('.line')
                    .classed('inactive', false)
                    .classed('active', false);
                if (_this.linePoints) {
                    _this.svg
                        .selectAll('circle')
                        .classed('active', false)
                        .classed('inactive', false);
                }
                if (_this.area) {
                    _this.svg.selectAll('.area').classed('inactive', false);
                }
            };
            this.legendMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.mouserectMouseMove = function (event, index, nodes) {
                var mouseXDate = _this.xAxisScale.invert(d3Selection.mouse(nodes[0])[0]); // return date at mouse x position
                var leftIndex = d3Array.bisectLeft(_this.data.dates, d3TimeFormat.isoFormat(mouseXDate)); // index of left closest date
                // prevent error for 0 index
                if (leftIndex === 0)
                    return false;
                var dateLower = new Date(_this.data.dates[leftIndex - 1]);
                var dateUpper = new Date(_this.data.dates[leftIndex]);
                var closestDate = +mouseXDate - +dateLower > +dateUpper - mouseXDate ? dateUpper : dateLower; // date mouse is closest to
                var closestIndex = _this.data.dates.indexOf(d3TimeFormat.isoFormat(closestDate)); // which index the mouse is closest to
                // console.log(+mouseXDate, leftIndex, +dateLower, +dateUpper, +closestDate, closestIndex);
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
                var scroll = _this._scroll.getScrollPosition();
                var mouserectDimensions = node.getBoundingClientRect();
                var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight;
                var tooltipDimensions = _this.tooltip.node().getBoundingClientRect();
                var dimensionCalculated = mouserectDimensions.left + tooltipDimensions.width + 8;
                var clientWidth = document.body.clientWidth - 10;
                var position;
                // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
                _this.tooltip.select('.tooltip-header').html(function (d) {
                    var parsedTime = d3TimeFormat.isoParse(_this.data.dates[closestIndex]);
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
                var parseDate = d3TimeFormat.isoParse(item);
                return _this.xAxisFormat(parseDate);
            };
            this.yAxisFormatter = function (item) {
                return _this.yAxisFormat(item);
            };
        }
        PbdsDatavizLineComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.margin = {
                top: +this.marginTop,
                right: +this.marginRight,
                bottom: +this.marginBottom,
                left: +this.marginLeft
            };
            this.clipPathId = nextId;
            // create formatters
            this.xAxisFormat = d3TimeFormat.timeFormat(this.xAxisFormatString);
            this.yAxisFormat = d3Format.format(this.yAxisFormatString);
            this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
            this.tooltipHeadingFormat = d3TimeFormat.timeFormat(this.tooltipHeadingFormatString);
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
            this.d3line = d3Shape.line()
                .x(function (d, i) { return _this.xAxisScale(d3TimeFormat.isoParse(_this.data.dates[i])); })
                .y(function (d) { return _this.yAxisScale(d); });
            // define line curve
            if (this.lineCurved) {
                this.d3line.curve(d3Shape.curveCatmullRom.alpha(0.5));
            }
            // define area
            if (this.area) {
                this.d3area = d3Shape.area()
                    .x(function (d, i) { return _this.xAxisScale(d3TimeFormat.isoParse(_this.data.dates[i])); })
                    .y0(this.height)
                    .y1(function (d, i) { return _this.yAxisScale(d); });
                if (this.lineCurved) {
                    this.d3area.curve(d3Shape.curveCatmullRom.alpha(0.5));
                }
            }
            // create the chart
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
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
                .on('mousemove', function (data, index, nodes) { return _this.mouserectMouseMove(d3Selection.event, index, nodes); })
                .on('mouseout', function (data, index, nodes) { return _this.mouserectMouseOut(d3Selection.event, index, nodes); })
                .on('click', function (data, index, nodes) { return _this.mouserectMouseClick(); });
            this.tooltipLine = this.svg
                .append('line')
                .attr('y1', 0)
                .attr('y2', this.height)
                .attr('class', 'tooltip-line');
            // define color range
            this.colorRange = d3Scale.scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
            // add glow def
            this._dataviz.createGlowFilter(this.svg);
            // X AXIS
            this.xAxisScale = d3Scale.scaleTime()
                .domain(d3Array.extent(this.data.dates, function (d, i) {
                return d3TimeFormat.isoParse(d);
            }))
                .range([0, this.width - this.margin.left - this.margin.right]);
            this.xAxisCall = d3Axis.axisBottom(this.xAxisScale)
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
                this.xGridCall = d3Axis.axisBottom(this.xAxisScale).tickSize(-this.height);
                this.xGrid = this.svg
                    .append('g')
                    .attr('class', 'grid grid-x')
                    .classed('grid-zero-hidden', this.hideXAxisZero)
                    .attr('transform', "translate(0, " + this.height + ")") //${-this.margin.right / 2}
                    .call(this.xGridCall);
            }
            // Y AXIS
            this.yAxisScale = d3Scale.scaleLinear()
                .domain([
                d3Array.min(this.data.series, function (d, i) {
                    var minVal = +d3Array.min(d.values);
                    return minVal - minVal * +_this.yAxisMinBuffer;
                }),
                d3Array.max(this.data.series, function (d, i) {
                    var maxVal = +d3Array.max(d.values);
                    return maxVal + maxVal * _this.yAxisMaxBuffer;
                })
            ])
                .nice()
                .range([this.height, 0]);
            this.yAxisCall = d3Axis.axisLeft(this.yAxisScale)
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
                this.yGridCall = d3Axis.axisLeft(this.yAxisScale)
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
                this.tooltip = d3Selection.select('body')
                    .append('div')
                    .attr('class', 'pbds-tooltip west')
                    .style('opacity', 0)
                    .attr('aria-hidden', 'true'); // hide tooltip for accessibility
                // tooltip header
                this.tooltip.append('div').attr('class', 'tooltip-header');
                // tooltip table
                var tooltipTable = this.tooltip.append('table').attr('class', 'tooltip-table text-left w-100');
                var tooltipTableTbody = tooltipTable.append('tbody');
                tooltipTableTbody
                    .selectAll('tr')
                    .data(this.data)
                    .join(function (enter) { return enter.append('tr'); });
            }
            // add legend classes
            if (!this.hideLegend) {
                this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
                this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
            }
            // add clip path for line animation
            this.svg
                .append('clipPath')
                .attr('id', "clip-path-" + this.clipPathId)
                .append('rect')
                .attr('width', +this.width - +this.margin.left - +this.margin.right)
                .attr('height', +this.height);
            // add clip path for points animation
            this.svg
                .append('clipPath')
                .attr('id', "clip-path-points-" + this.clipPathId)
                .append('rect')
                .attr('width', +this.width + +this.margin.left - +this.margin.right)
                .attr('height', +this.height)
                .attr('transform', "translate(-" + this.margin.left + ", 0)");
            this.updateChart();
            nextId++;
        };
        PbdsDatavizLineComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.updateChart();
            }
        };
        PbdsDatavizLineComponent.prototype.ngOnDestroy = function () {
            if (this.tooltip)
                this.tooltip.remove();
        };
        return PbdsDatavizLineComponent;
    }());
    PbdsDatavizLineComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-line',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    PbdsDatavizLineComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: i0.ElementRef },
        { type: common.ViewportScroller },
        { type: common.Location }
    ]; };
    PbdsDatavizLineComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        lineClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-line',] }],
        data: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        height: [{ type: i0.Input }],
        type: [{ type: i0.Input }],
        area: [{ type: i0.Input }],
        xAxisFormatString: [{ type: i0.Input }],
        xAxisTicks: [{ type: i0.Input }],
        yAxisFormatString: [{ type: i0.Input }],
        yAxisTicks: [{ type: i0.Input }],
        yAxisMinBuffer: [{ type: i0.Input }],
        yAxisMaxBuffer: [{ type: i0.Input }],
        hideXGrid: [{ type: i0.Input }],
        hideYGrid: [{ type: i0.Input }],
        hideLegend: [{ type: i0.Input }],
        legendWidth: [{ type: i0.Input }],
        legendPosition: [{ type: i0.Input }],
        legendLabelFormatType: [{ type: i0.Input }],
        legendLabelFormatString: [{ type: i0.Input }],
        tooltipHeadingFormatString: [{ type: i0.Input }],
        tooltipLabelFormatType: [{ type: i0.Input }],
        tooltipLabelFormatString: [{ type: i0.Input }],
        tooltipValueFormatType: [{ type: i0.Input }],
        tooltipValueFormatString: [{ type: i0.Input }],
        marginTop: [{ type: i0.Input }],
        marginRight: [{ type: i0.Input }],
        marginBottom: [{ type: i0.Input }],
        marginLeft: [{ type: i0.Input }],
        theme: [{ type: i0.Input }],
        hovered: [{ type: i0.Output }],
        clicked: [{ type: i0.Output }],
        tooltipHovered: [{ type: i0.Output }],
        tooltipClicked: [{ type: i0.Output }]
    };

    var PbdsDatavizGaugeComponent = /** @class */ (function () {
        function PbdsDatavizGaugeComponent(_dataviz, _element) {
            var _this = this;
            this._dataviz = _dataviz;
            this._element = _element;
            this.chartClass = true;
            this.gaugeClass = true;
            this.width = 300;
            this.type = 'halfmoon';
            this.color = '#E23DA8';
            this.hideLabel = false;
            this.labelFormatString = '';
            this.gaugeWidth = 20;
            this.degreesToRadians = function (degree) {
                return (degree * Math.PI) / 180;
            };
            this.calculateMinMax = function () {
                var percentage = _this.data.minvalue / (_this.data.maxvalue - _this.data.minvalue);
                return percentage * (_this.data.value - _this.data.minvalue) + (_this.data.value - _this.data.minvalue);
            };
            this.calculateCurve = function (data) {
                var start = _this.degreesToRadians(_this.startAngle);
                var end = start + (data * (_this.degreesToRadians(_this.endAngle) - start)) / _this.data.maxvalue;
                return [
                    {
                        startAngle: start,
                        endAngle: end
                    }
                ];
            };
            this.drawChart = function () {
                _this.gauge = _this.svg.append('g').attr('class', 'gauge-group');
                // background arc
                _this.gauge
                    .append('path')
                    .data(_this.calculateCurve(_this.data.maxvalue))
                    .attr('class', 'gauge-background')
                    .attr('d', function (d) {
                    return _this.arc({
                        innerRadius: _this.radius - _this.gaugeWidth,
                        outerRadius: _this.radius,
                        startAngle: d.startAngle,
                        endAngle: d.endAngle
                    });
                });
                // value arc
                _this.gauge
                    .append('path')
                    .data(_this.calculateCurve(_this.calculateMinMax()))
                    .attr('class', 'gauge-value')
                    .attr('fill', _this.color)
                    .attr('d', function (d) {
                    return _this.arc({
                        innerRadius: _this.radius - _this.gaugeWidth,
                        outerRadius: _this.radius,
                        startAngle: d.startAngle,
                        endAngle: d.endAngle
                    });
                });
                switch (_this.type) {
                    case 'horseshoe':
                        _this.svg.attr('height', 230).attr('viewBox', "-" + _this.width / 2 + " -" + _this.height / 2 + " " + _this.height + " 230");
                        break;
                    case 'halfmoon':
                        _this.svg.attr('height', _this.width / 2);
                        _this.svg.attr('viewBox', "-" + _this.width / 2 + " -" + _this.width / 2 + " " + _this.width + " " + _this.width / 2);
                        break;
                }
            };
            this.updateChart = function () {
                var group = _this.svg.select('.gauge-group');
                group
                    .select('.gauge-value')
                    .transition()
                    .duration(750)
                    .call(_this.arcTween, _this.calculateMinMax());
                _this.labelTween = _this.chart.select('.gauge-number');
                _this.labelTween
                    .transition()
                    .duration(750)
                    .call(_this.textTween, _this.data.value);
            };
            this.arcTween = function (transition, value) {
                var newAngle = _this.calculateCurve(value);
                transition.attrTween('d', function (d) {
                    var interpolate = d3Interpolate.interpolate(d.endAngle, newAngle[0].endAngle);
                    return function (t) {
                        d.endAngle = interpolate(t);
                        return _this.arc({
                            innerRadius: _this.radius - _this.gaugeWidth,
                            outerRadius: _this.radius,
                            startAngle: d.startAngle,
                            endAngle: d.endAngle
                        });
                    };
                });
            };
            this.textTween = function (transition, value) {
                value = d3Format.format('.4f')(value);
                value = value.replace(/,/g, '.');
                transition.tween('text', function () {
                    var interpolate = d3Interpolate.interpolate(d3Format.format('.4f')(+_this.oldValue), value);
                    return function (t) {
                        _this.labelTween.text(function (d) {
                            var updatedNumber = _this.labelFormat(interpolate(t));
                            _this.label = updatedNumber;
                            return updatedNumber;
                        });
                    };
                });
            };
        }
        PbdsDatavizGaugeComponent.prototype.ngOnInit = function () {
            this.height = this.width;
            this.radius = Math.max(this.width, this.height) / 2;
            this.labelFormat = d3Format.format(this.labelFormatString);
            this.label = this.labelFormat(this.data.value);
            switch (this.type) {
                case 'halfmoon':
                    this.startAngle = -90;
                    this.endAngle = 90;
                    this.rounded = true;
                    break;
                case 'horseshoe':
                    this.startAngle = -140;
                    this.endAngle = 140;
                    this.rounded = true;
                    break;
                case 'circle':
                    this.startAngle = 0;
                    this.endAngle = 360;
                    this.rounded = false;
                    break;
            }
            this.arc = d3Shape.arc().cornerRadius(this.rounded ? this.gaugeWidth : 0);
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            this.svg = this.chart
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', "-" + this.width / 2 + " -" + this.height / 2 + " " + this.width + " " + this.height);
            this.drawChart();
        };
        PbdsDatavizGaugeComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.oldValue = changes.data.previousValue.value;
                this.updateChart();
            }
        };
        return PbdsDatavizGaugeComponent;
    }());
    PbdsDatavizGaugeComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-gauge',
                    template: "\n    <div\n      *ngIf=\"!hideLabel\"\n      class=\"gauge-details\"\n      [ngClass]=\"{ halfmoon: type === 'halfmoon', 'gauge-details-small': type === 'halfmoon' }\"\n      [ngStyle]=\"{ 'max-width.px': width - 3 * gaugeWidth }\"\n    >\n      <div class=\"gauge-number\">{{ label }}</div>\n      <div *ngIf=\"description\" class=\"gauge-description text-center\">{{ description }}</div>\n    </div>\n  "
                },] }
    ];
    PbdsDatavizGaugeComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: i0.ElementRef }
    ]; };
    PbdsDatavizGaugeComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        gaugeClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-gauge',] }],
        data: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        type: [{ type: i0.Input }],
        color: [{ type: i0.Input }],
        hideLabel: [{ type: i0.Input }],
        labelFormatString: [{ type: i0.Input }],
        description: [{ type: i0.Input }],
        gaugeWidth: [{ type: i0.Input }]
    };

    var PbdsDatavizSparklineComponent = /** @class */ (function () {
        function PbdsDatavizSparklineComponent(_element) {
            this._element = _element;
            this.chartClass = true;
            this.sparklineClass = true;
            this.width = 160;
            this.height = 40;
            this.type = 'line';
            this.color = '#E23DA8';
            this.colorNegative = null; // undocumented, may add if needed
            this.strokeWidth = 2; // undocumented, width is automatically set by the type
            this.yAxisMinBuffer = 0;
            this.yAxisMaxBuffer = 0;
        }
        PbdsDatavizSparklineComponent.prototype.ngOnInit = function () {
            this.margin = { top: 1, right: 0, bottom: 1, left: 0 };
            if (this.type === 'bar') {
                this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
            }
            if (this.type === 'line-high' || this.type === 'area-high') {
                this.strokeWidth = 1;
            }
            if (this.colorNegative === null) {
                this.colorNegative = this.color;
            }
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            this.svg = this.chart
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + this.width + " " + this.height);
            if (this.type === 'line' || this.type === 'line-high' || this.type === 'area' || this.type === 'area-high') {
                this.svg
                    .append('path')
                    .attr('class', 'sparkline')
                    .attr('fill', 'none')
                    .attr('stroke-width', this.strokeWidth)
                    .attr('stroke', this.color);
            }
            if (this.type === 'area' || this.type === 'area-high') {
                this.svg
                    .append('path')
                    .attr('class', 'sparkarea')
                    .attr('fill', this.color)
                    .attr('fill-opacity', 0.3);
            }
            this.updateChart();
        };
        PbdsDatavizSparklineComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.updateChart();
            }
        };
        PbdsDatavizSparklineComponent.prototype.updateChart = function () {
            var _this = this;
            var data = this.data;
            var x = d3Scale.scaleLinear()
                .domain([0, this.data.length])
                .range([0, this.width - this.margin.left - this.margin.right]);
            var y = d3Scale.scaleLinear()
                .domain([+d3Array.min(this.data) - this.yAxisMinBuffer, +d3Array.max(this.data) + this.yAxisMaxBuffer])
                .range([this.height - this.margin.top - this.margin.bottom, 0]);
            var line = d3Shape.line()
                .x(function (d, i) { return x(i); })
                .y(function (d) { return y(d); });
            var area = d3Shape.area()
                .x(function (d, i) { return x(i); })
                .y0(this.height)
                .y1(function (d) { return y(d); });
            if (this.type === 'line' || this.type === 'line-high' || this.type === 'area' || this.type === 'area-high') {
                this.svg
                    .selectAll('.sparkline')
                    .transition()
                    .duration(1000)
                    .attr('d', function () { return line(data); });
            }
            if (this.type === 'area' || this.type === 'area-high') {
                this.svg
                    .selectAll('.sparkarea')
                    .transition()
                    .duration(1000)
                    .attr('d', function () { return area(data); });
            }
            if (this.type === 'bar') {
                var barWidth_1 = (this.width - this.data.length) / this.data.length;
                // handles negative values, see example https://www.essycode.com/posts/create-sparkline-charts-d3/
                this.svg
                    .selectAll('.sparkbar')
                    .data(this.data)
                    .join(function (enter) { return enter
                    .append('rect')
                    .attr('class', 'sparkbar')
                    .attr('x', function (d, i) { return x(i); })
                    .attr('y', _this.height)
                    .attr('width', barWidth_1)
                    .attr('fill', function (d) { return (d > 0 ? _this.color : _this.colorNegative); }) // still uses undocumented negative color values
                    .attr('height', 0)
                    .call(function (enter) {
                    enter
                        .transition()
                        .duration(1000)
                        .attr('y', function (d) { return (d > 0 ? y(d) : y(0)); })
                        .attr('height', function (d) { return Math.abs(y(d) - y(0)); });
                    return enter;
                }); }, function (update) { return update
                    .transition()
                    .duration(1000)
                    .attr('x', function (d, i) { return x(i); })
                    .attr('y', function (d) { return (d > 0 ? y(d) : y(0)); })
                    .attr('width', barWidth_1)
                    .attr('height', function (d) { return Math.abs(y(d) - y(0)); })
                    .attr('fill', function (d) { return (d > 0 ? _this.color : _this.colorNegative); }); }, function (exit) { return exit.remove(); });
            }
        };
        return PbdsDatavizSparklineComponent;
    }());
    PbdsDatavizSparklineComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-sparkline',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    PbdsDatavizSparklineComponent.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    PbdsDatavizSparklineComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        sparklineClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-sparkline',] }],
        data: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        height: [{ type: i0.Input }],
        type: [{ type: i0.Input }],
        color: [{ type: i0.Input }],
        colorNegative: [{ type: i0.Input }],
        strokeWidth: [{ type: i0.Input }],
        yAxisMinBuffer: [{ type: i0.Input }],
        yAxisMaxBuffer: [{ type: i0.Input }]
    };

    var PbdsDatavizBarStackedComponent = /** @class */ (function () {
        function PbdsDatavizBarStackedComponent(_dataviz, _element, _scroll) {
            var _this = this;
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
            this.yAxisFormatType = null;
            this.yAxisFormatString = '';
            this.yAxisTicks = 5;
            this.yAxisMaxBuffer = 0.01;
            this.hideLegend = false;
            this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
            this.legendPosition = 'right';
            this.legendLabelFormatType = null;
            this.legendLabelFormatString = '';
            this.tooltipHeadingFormatType = null;
            this.tooltipHeadingFormatString = '';
            this.tooltipHeadingValueFormatType = null;
            this.tooltipHeadingValueFormatString = '';
            this.tooltipLabelFormatType = null;
            this.tooltipLabelFormatString = '';
            this.tooltipValueFormatType = null;
            this.tooltipValueFormatString = '';
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.updateChart = function (firstRun) {
                if (firstRun === void 0) { firstRun = true; }
                _this.dataKeys = Object.keys(_this.data[0]).filter(function (item) { return item !== 'key'; });
                // create the D3 stack data
                _this.dataStack = d3Shape.stack()
                    .keys(_this.dataKeys)
                    .order(d3Shape.stackOrderNone)(_this.data);
                // update the xScale
                _this.xAxisScale.domain(_this.data.map(function (d) { return d.key; }));
                // update the yScale
                _this.yAxisMax = d3Array.max(_this.dataStack, function (data) {
                    return d3Array.max(data, function (d) {
                        return d[1];
                    });
                });
                _this.yAxisMax = _this.yAxisMax + _this.yAxisMax * _this.yAxisMaxBuffer;
                _this.yAxisScale
                    .domain([0, _this.yAxisMax])
                    .rangeRound([_this.height, 0])
                    .nice();
                _this.xAxis
                    .transition()
                    .duration(0) // 1000
                    .call(_this.xAxisCall);
                _this.yAxis
                    .transition()
                    .duration(0) // 1000
                    .call(_this.yAxisCall);
                // update the grids
                if (!_this.hideXGrid) {
                    _this.xGrid
                        .transition()
                        .duration(0) // 1000
                        .call(_this.xGridCall);
                }
                if (!_this.hideYGrid) {
                    _this.yGrid
                        .transition()
                        .duration(0) // 1000
                        .call(_this.yGridCall);
                }
                // add gray bars
                if (!_this.hideGrayBars) {
                    _this.grayBars
                        .selectAll('.gray-bar')
                        .data(_this.data)
                        .join(function (enter) { return enter
                        .append('rect')
                        .attr('class', 'gray-bar')
                        .attr('x', function (d) { return _this.xAxisScale(d.key); })
                        .attr('width', _this.xAxisScale.bandwidth())
                        .attr('height', _this.height); }, function (update) { return update
                        .transition()
                        .duration(function (d, i, n) { return (firstRun ? 0 : 1000); })
                        .attr('x', function (d) { return _this.xAxisScale(d.key); })
                        .attr('width', _this.xAxisScale.bandwidth())
                        .attr('height', _this.height); }, function (exit) { return exit.remove(); });
                }
                // add colored bars
                var barGroups = _this.bars
                    .selectAll('.bar-group')
                    .data(_this.dataStack)
                    .join(function (enter) { return enter
                    .append('g')
                    .attr('class', 'bar-group')
                    .attr('fill', function (d) { return _this.colorRange(d.index); }); }, function (update) { return update.attr('fill', function (d) { return _this.colorRange(d.index); }); }, function (exit) { return exit.remove(); });
                barGroups
                    .selectAll('.bar')
                    .data(function (d) { return d; })
                    .join(function (enter) { return enter
                    .append('rect')
                    .attr('class', 'bar')
                    .classed('bar-divided', _this.type !== 'high')
                    .classed('bar-divided-low', _this.type === 'low')
                    .attr('x', function (d, i) {
                    var x;
                    if (_this.type === 'medium') {
                        x = _this.xAxisScale(d.data.key) + (_this.xAxisScale.bandwidth() / 8) * 3;
                    }
                    else {
                        x = _this.xAxisScale(d.data.key) + (_this.xAxisScale.bandwidth() / 4) * 1;
                    }
                    return x;
                })
                    .attr('y', function (d) { return _this.yAxisScale(d[0]); })
                    .attr('width', function (d) {
                    var width;
                    if (_this.type === 'medium') {
                        width = _this.xAxisScale.bandwidth() / 4;
                    }
                    else {
                        width = _this.xAxisScale.bandwidth() / 2;
                    }
                    return width;
                })
                    .attr('height', 0)
                    .call(function (enter) {
                    enter
                        .transition()
                        .duration(function (d, i, n) { return (firstRun ? 0 : 500); })
                        .delay(function (d, i, n) { return (firstRun ? 0 : 750); })
                        .attr('y', function (d) { return _this.yAxisScale(d[1]); })
                        .attr('height', function (d) {
                        return _this.yAxisScale(d[0]) - _this.yAxisScale(d[1]);
                    });
                    return enter;
                }); }, function (update) { return update.call(function (update) {
                    // let width;
                    // if (this.type === 'medium') {
                    //   width = this.xAxisScale.bandwidth() / 4;
                    // } else {
                    //   width = this.xAxisScale.bandwidth() / 2;
                    // }
                    update
                        .transition()
                        .duration(1000)
                        .attr('width', _this.xAxisScale.bandwidth() / 4)
                        .attr('x', function (d, i) { return _this.xAxisScale(d.data.key) + (_this.xAxisScale.bandwidth() / 8) * 3; })
                        .attr('y', function (d) { return _this.yAxisScale(d[1]); })
                        .attr('height', function (d) { return _this.yAxisScale(d[0]) - _this.yAxisScale(d[1]); });
                    return update;
                }); }, function (exit) { return exit.remove(); });
                // mouseover bars
                _this.mouseBars
                    .selectAll('.mouseover-bar')
                    .data(_this.data)
                    .join(function (enter) { return enter
                    .append('rect')
                    .attr('class', 'mouseover-bar')
                    .style('opacity', 0)
                    .attr('x', function (d) { return _this.xAxisScale(d.key); })
                    .attr('width', _this.xAxisScale.bandwidth())
                    .attr('height', _this.height); }, function (update) { return update
                    .attr('pointer-events', 'none')
                    .attr('x', function (d) { return _this.xAxisScale(d.key); })
                    .attr('width', _this.xAxisScale.bandwidth())
                    .attr('height', _this.height)
                    .transition()
                    .attr('pointer-events', 'auto'); }, function (exit) { return exit
                    .transition()
                    .attr('pointer-events', 'none')
                    .remove(); })
                    .on('mouseover', function (data, index, nodes) { return _this.barMouseOver(d3Selection.event, data, index, nodes); })
                    .on('mouseout', function (data, index, nodes) { return _this.barMouseOut(); })
                    .on('click', function (data, index, nodes) { return _this.barMouseClick(d3Selection.event, data, index, nodes); });
                _this.bars.raise();
                _this.xAxis.raise();
                _this.mouseBars.raise();
                if (!_this.hideLegend) {
                    _this.chart
                        .select('.legend')
                        .selectAll('.legend-item')
                        .data(_this.dataStack)
                        .join(function (enter) {
                        var li = enter.append('li').attr('class', 'legend-item');
                        li.append('span')
                            .attr('class', 'legend-key')
                            .style('background-color', function (d) { return _this.colorRange(d.index); });
                        li.append('span')
                            .attr('class', 'legend-label')
                            .html(function (d) {
                            switch (_this.legendLabelFormatType) {
                                case 'number':
                                    return _this.legendLabelFormat(d.key);
                                case 'time':
                                    var parsedTime = d3TimeFormat.isoParse(d.key);
                                    return _this.legendLabelFormat(parsedTime);
                                default:
                                    return d.key;
                            }
                        });
                        return li;
                    }, function (update) {
                        update.select('.legend-label').html(function (d) {
                            switch (_this.legendLabelFormatType) {
                                case 'number':
                                    return _this.legendLabelFormat(d.key);
                                case 'time':
                                    var parsedTime = d3TimeFormat.isoParse(d.key);
                                    return _this.legendLabelFormat(parsedTime);
                                default:
                                    return d.key;
                            }
                        });
                        return update;
                    }, function (exit) { return exit.remove(); })
                        .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3Selection.event, data, index, nodes); })
                        .on('mouseout', function () { return _this.legendMouseOut(); })
                        .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3Selection.event, data, index, nodes); });
                }
            };
            this.barMouseOver = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.bar-group')
                    .selectAll('.bar')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.tooltipShow(data, index, nodes[index]);
                _this.hovered.emit({ event: event, data: data });
            };
            this.barMouseOut = function () {
                _this.chart.selectAll('.bar').classed('inactive', false);
                _this.tooltipHide();
            };
            this.barMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.legendMouseOver = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.chart
                    .selectAll('.bar-group')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.hovered.emit({ event: event, data: data });
            };
            this.legendMouseOut = function () {
                _this.chart.selectAll('.legend-item').classed('inactive', false);
                _this.chart.selectAll('.bar-group').classed('inactive', false);
                _this.tooltipHide();
            };
            this.legendMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.xAxisFormatter = function (item) {
                switch (_this.xAxisFormatType) {
                    case 'number':
                        return _this.xAxisFormat(item);
                    case 'time':
                        var parseDate = d3TimeFormat.isoParse(item);
                        return _this.xAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
            this.tooltipShow = function (data, index, node) {
                // console.log('TOOLTIP: ', data, index, node);
                var scroll = _this._scroll.getScrollPosition();
                var mouserectDimensions = node.getBoundingClientRect();
                var clientWidth = document.body.clientWidth - 10;
                var dimensionCalculated;
                var tooltipDimensions;
                var tooltipOffsetHeight;
                var yPosition;
                var xPosition;
                // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
                _this.tooltip.select('.tooltip-header').html(function (d) {
                    switch (_this.tooltipHeadingFormatType) {
                        case 'time':
                            var parseDate = d3TimeFormat.isoParse(data.key);
                            return _this.tooltipHeadingFormat(parseDate);
                        default:
                            return data.key;
                    }
                });
                _this.tooltip.select('.tooltip-header-value').html(function (d) {
                    var total = 0;
                    Object.keys(data).map(function (e) {
                        if (e !== 'key') {
                            total = total + data[e];
                        }
                    });
                    return _this.tooltipHeadingValueFormat(total);
                });
                _this.tooltip
                    .select('.tooltip-table')
                    .select('tbody')
                    .html(function (d) {
                    var html = "";
                    var label;
                    var value;
                    Object.keys(data).map(function (key, index) {
                        switch (_this.tooltipLabelFormatType) {
                            case 'time':
                                var parseDate = d3TimeFormat.isoParse(key);
                                label = _this.tooltipHeadingFormat(parseDate);
                                break;
                            default:
                                label = key;
                        }
                        switch (_this.tooltipValueFormatType) {
                            case 'number':
                                value = _this.tooltipValueFormat(data[key]);
                                break;
                            default:
                                value = data[key];
                        }
                        if (key !== 'key') {
                            html += "\n              <tr class='tooltip-item'>\n                <td style=\"color: " + _this.colorRange(index - 1) + "\">\n                  <span class=\"pbds-tooltip-key\"></span>\n                </td>\n                <td class=\"tooltip-label pr-2 text-nowrap\">" + label + "</td>\n                <td class=\"tooltip-value text-right text-nowrap\">" + value + "</td>\n              </tr>\n            ";
                        }
                    });
                    return html;
                });
                tooltipDimensions = _this.tooltip.node().getBoundingClientRect();
                dimensionCalculated = mouserectDimensions.left + mouserectDimensions.width + tooltipDimensions.width + 8;
                tooltipOffsetHeight = +_this.tooltip.node().offsetHeight;
                // flip the tooltip positions if near the right edge of the screen
                if (dimensionCalculated > clientWidth) {
                    _this.tooltip.classed('east', true);
                    _this.tooltip.classed('west', false);
                    if (_this.type === 'medium') {
                        xPosition = mouserectDimensions.left + (mouserectDimensions.width / 8) * 3 - tooltipDimensions.width - 8 + "px";
                    }
                    else {
                        xPosition = mouserectDimensions.left + (mouserectDimensions.width / 4) * 1 - tooltipDimensions.width - 8 + "px";
                    }
                }
                else if (dimensionCalculated < clientWidth) {
                    _this.tooltip.classed('east', false);
                    _this.tooltip.classed('west', true);
                    if (_this.type === 'medium') {
                        xPosition = mouserectDimensions.left + (mouserectDimensions.width / 8) * 5 + 8 + "px";
                    }
                    else {
                        xPosition = mouserectDimensions.left + (mouserectDimensions.width / 4) * 3 + 8 + "px";
                    }
                }
                yPosition = _this.svg
                    .selectAll('.bar-group')
                    .filter(':last-child')
                    .selectAll('.bar')
                    .filter(function (d, i) { return i === index; })
                    .node()
                    .getBoundingClientRect();
                // set the tooltip styles
                _this.tooltip.style('top', yPosition.top - tooltipOffsetHeight / 2 + scroll[1] + "px");
                _this.tooltip.style('left', xPosition);
                _this.tooltip.style('opacity', 1);
            };
            this.tooltipHide = function () {
                _this.tooltip.style('opacity', 0);
            };
            this.yAxisFormatter = function (item) {
                switch (_this.yAxisFormatType) {
                    case 'number':
                        return _this.yAxisFormat(item);
                    case 'time':
                        var parseDate = d3TimeFormat.isoParse(item);
                        return _this.yAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
        }
        PbdsDatavizBarStackedComponent.prototype.ngOnInit = function () {
            // extract keys for stack data
            this.dataKeys = Object.keys(this.data[0]).filter(function (item) { return item !== 'key'; });
            // create the D3 stack data
            this.dataStack = d3Shape.stack()
                .keys(this.dataKeys)
                .order(d3Shape.stackOrderNone)(this.data);
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
            // adjust margin if xAxis hidden
            if (this.hideXAxis)
                this.margin.bottom = 10; // need small margin for yAxis with 0 tick label
            if (!this.hideLegend && this.legendPosition === 'right') {
                this.width = +this.width - +this.legendWidth;
            }
            // create the chart
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            // create chart svg
            this.svg = this.chart
                .append('svg')
                .attr('width', +this.width)
                .attr('height', +this.height + this.margin.top + this.margin.bottom)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + +this.width + " " + (+this.height + this.margin.top + this.margin.bottom));
            this.grayBars = this.svg.append('g').attr('class', 'gray-bars');
            this.mouseBars = this.svg.append('g').attr('class', 'mouseover-bars');
            this.bars = this.svg.append('g').attr('class', 'bars');
            // build color ranges
            this.colorRange = d3Scale.scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
            // X AXIS
            this.xAxisScale = d3Scale.scaleBand()
                .domain(this.data.map(function (d) { return d.key; }))
                .rangeRound([0, this.width - this.margin.left])
                .align(0);
            // add padding to the scale for gray bars
            !this.hideGrayBars
                ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
                : this.xAxisScale.paddingInner(0).paddingOuter(0);
            this.xAxisCall = d3Axis.axisBottom(this.xAxisScale)
                .tickSize(this.xAxisTickSize)
                .tickSizeOuter(this.xAxisTickSizeOuter)
                .tickFormat(this.xAxisFormatter);
            this.xAxis = this.svg
                .append('g')
                .attr('class', 'axis axis-x')
                .attr('transform', "translate(0, " + this.height + ")")
                .classed('axis-hidden', this.hideXAxis)
                .classed('axis-zero-hidden', this.hideXAxisZero)
                .classed('axis-domain-hidden', this.hideXAxisDomain)
                .classed('axis-ticks-hidden', this.hideXAxisTicks)
                .call(this.xAxisCall);
            // X GRIDLINES
            if (!this.hideXGrid) {
                this.xGridCall = d3Axis.axisBottom(this.xAxisScale).tickSize(-this.height);
                this.xGrid = this.svg
                    .append('g')
                    .attr('class', 'grid grid-x')
                    .classed('grid-zero-hidden', this.hideXAxisZero)
                    .attr('transform', "translate(0, " + this.height + ")")
                    .call(this.xGridCall);
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
            this.yAxisMax = d3Array.max(this.dataStack, function (data) {
                return d3Array.max(data, function (d) {
                    return d[1];
                });
            });
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale = d3Scale.scaleLinear()
                .domain([0, this.yAxisMax])
                .nice()
                .rangeRound([this.height, 0]);
            this.yAxisCall = d3Axis.axisLeft(this.yAxisScale)
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
                this.yGridCall = d3Axis.axisLeft(this.yAxisScale)
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
                this.tooltip = d3Selection.select('body')
                    .append('div')
                    .attr('class', 'pbds-tooltip west')
                    .style('opacity', 0)
                    .attr('aria-hidden', 'true'); // hide tooltip for accessibility
                // tooltip header
                this.tooltip.append('div').attr('class', 'tooltip-header');
                this.tooltip.append('div').attr('class', 'tooltip-header-value');
                // tooltip table
                this.tooltip
                    .append('table')
                    .attr('class', 'tooltip-table text-left w-100')
                    .append('tbody');
            }
            // add legend classes
            if (!this.hideLegend) {
                this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
                this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
            }
            this.updateChart();
        };
        PbdsDatavizBarStackedComponent.prototype.ngOnDestroy = function () {
            if (this.tooltip)
                this.tooltip.remove();
        };
        PbdsDatavizBarStackedComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.updateChart(false);
            }
        };
        return PbdsDatavizBarStackedComponent;
    }());
    PbdsDatavizBarStackedComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-bar-stacked',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    PbdsDatavizBarStackedComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: i0.ElementRef },
        { type: common.ViewportScroller }
    ]; };
    PbdsDatavizBarStackedComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        stackedBarClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-stacked-bar',] }],
        data: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        height: [{ type: i0.Input }],
        type: [{ type: i0.Input }],
        marginTop: [{ type: i0.Input }],
        marginRight: [{ type: i0.Input }],
        marginBottom: [{ type: i0.Input }],
        marginLeft: [{ type: i0.Input }],
        hideXAxis: [{ type: i0.Input }],
        xAxisFormatType: [{ type: i0.Input }],
        xAxisFormatString: [{ type: i0.Input }],
        yAxisFormatType: [{ type: i0.Input }],
        yAxisFormatString: [{ type: i0.Input }],
        yAxisTicks: [{ type: i0.Input }],
        yAxisMaxBuffer: [{ type: i0.Input }],
        hideLegend: [{ type: i0.Input }],
        legendWidth: [{ type: i0.Input }],
        legendPosition: [{ type: i0.Input }],
        legendLabelFormatType: [{ type: i0.Input }],
        legendLabelFormatString: [{ type: i0.Input }],
        tooltipHeadingFormatType: [{ type: i0.Input }],
        tooltipHeadingFormatString: [{ type: i0.Input }],
        tooltipHeadingValueFormatType: [{ type: i0.Input }],
        tooltipHeadingValueFormatString: [{ type: i0.Input }],
        tooltipLabelFormatType: [{ type: i0.Input }],
        tooltipLabelFormatString: [{ type: i0.Input }],
        tooltipValueFormatType: [{ type: i0.Input }],
        tooltipValueFormatString: [{ type: i0.Input }],
        theme: [{ type: i0.Input }],
        hovered: [{ type: i0.Output }],
        clicked: [{ type: i0.Output }]
    };

    var PbdsDatavizMetricIndicatorComponent = /** @class */ (function () {
        function PbdsDatavizMetricIndicatorComponent() {
            this.value = 0;
            this.class = '';
            this.indicator = 'flat';
            this.inverse = false;
        }
        Object.defineProperty(PbdsDatavizMetricIndicatorComponent.prototype, "hostClasses", {
            get: function () {
                return ['metric-block-indicator', this.indicator, this.inverse ? 'inverse' : '', this.class].join(' ');
            },
            enumerable: false,
            configurable: true
        });
        return PbdsDatavizMetricIndicatorComponent;
    }());
    PbdsDatavizMetricIndicatorComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-metric-indicator',
                    template: "\n    <span>{{ value }}</span>\n  "
                },] }
    ];
    PbdsDatavizMetricIndicatorComponent.propDecorators = {
        value: [{ type: i0.Input }],
        class: [{ type: i0.Input }],
        indicator: [{ type: i0.Input }],
        inverse: [{ type: i0.Input }],
        hostClasses: [{ type: i0.HostBinding, args: ['class',] }]
    };

    var PbdsDatavizMetricBlockComponent = /** @class */ (function () {
        function PbdsDatavizMetricBlockComponent() {
            this.class = '';
            this.heading = null;
            this.value = 0;
            this.unit = null;
            this.description = null;
            this.centered = false;
            this.centeredText = false;
            this.vertical = false;
            this.infoMessage = null;
            this.hideValueMargin = false;
            this.isPercentUnit = false;
            this.isUnit = false;
        }
        Object.defineProperty(PbdsDatavizMetricBlockComponent.prototype, "hostClasses", {
            get: function () {
                return [
                    'metric-block',
                    this.centered ? 'metric-block-centered' : '',
                    this.centeredText ? 'metric-block-centered-text' : '',
                    this.vertical ? 'metric-block-vertical' : '',
                    this.class
                ].join(' ');
            },
            enumerable: false,
            configurable: true
        });
        PbdsDatavizMetricBlockComponent.prototype.ngOnInit = function () {
            if (!this.indicatorRef) {
                this.hideValueMargin = true;
            }
            if (this.unit !== '%' && this.unit !== null) {
                this.isUnit = true;
            }
            else if (this.unit === '%') {
                this.isPercentUnit = true;
            }
        };
        return PbdsDatavizMetricBlockComponent;
    }());
    PbdsDatavizMetricBlockComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-metric-block',
                    template: "\n    <div class=\"metric-block-inner\">\n      <div *ngIf=\"heading\" class=\"metric-block-heading\">\n        {{ heading }}\n        <i\n          *ngIf=\"infoMessage\"\n          class=\"pbi-icon-mini pbi-info-circle-open ml-1 align-middle\"\n          ngbTooltip=\"{{ infoMessage }}\"\n          container=\"body\"\n        ></i>\n      </div>\n      <div class=\"metric-block-data-block\">\n        <div class=\"metric-block-contents\">\n          <div class=\"metric-block-value\" [ngClass]=\"{ 'mr-0': hideValueMargin }\">\n            {{ value\n            }}<span [ngClass]=\"{ 'metric-block-unit': isUnit, 'metric-block-percentage': isPercentUnit }\">{{\n              unit\n            }}</span>\n          </div>\n\n          <div>\n            <ng-content select=\"pbds-dataviz-metric-indicator\"></ng-content>\n          </div>\n          <div *ngIf=\"description\" class=\"metric-block-description\">{{ description }}</div>\n        </div>\n        <ng-content select=\"pbds-dataviz-sparkline\"></ng-content>\n      </div>\n    </div>\n  "
                },] }
    ];
    PbdsDatavizMetricBlockComponent.propDecorators = {
        class: [{ type: i0.Input }],
        heading: [{ type: i0.Input }],
        value: [{ type: i0.Input }],
        unit: [{ type: i0.Input }],
        description: [{ type: i0.Input }],
        centered: [{ type: i0.Input }],
        centeredText: [{ type: i0.Input }],
        vertical: [{ type: i0.Input }],
        infoMessage: [{ type: i0.Input }],
        hostClasses: [{ type: i0.HostBinding, args: ['class',] }],
        indicatorRef: [{ type: i0.ContentChild, args: [PbdsDatavizMetricIndicatorComponent, { static: true },] }]
    };

    var DatavizBubbleMapComponent = /** @class */ (function () {
        function DatavizBubbleMapComponent(_element, _scroll, _dataviz) {
            var _this = this;
            this._element = _element;
            this._scroll = _scroll;
            this._dataviz = _dataviz;
            this.chartClass = true;
            this.bubbleMapClass = true;
            this.feature = '';
            this.scale = null;
            this.center = null;
            this.width = 306;
            this.height = 400;
            this.type = 'medium'; // debug to show all chart options
            this.dot = false;
            this.marginTop = 0;
            this.marginRight = 0;
            this.marginBottom = 0;
            this.marginLeft = 0;
            this.color = '#ef8200';
            this.textColor = '#fff';
            this.textSizeRange = [14, 24];
            this.dotSize = 4;
            this.bubbleSizeRange = [500, 2000];
            this.bubbleLabelFormatType = null;
            this.bubbleLabelFormatString = '';
            this.hideTooltip = false;
            this.hideTooltipValue = false;
            this.tooltipValueFormatType = null;
            this.tooltipValueFormatString = '';
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.updateChart = function () {
                // bubbles
                _this.bubbleContainer
                    .selectAll('circle')
                    .data(_this.data)
                    .join(function (enter) { return enter
                    .append('circle')
                    .attr('class', 'dot-circle')
                    .classed('solid', _this.dot)
                    .attr('cx', function (d) { return _this.projection([d.longitude, d.latitude])[0]; })
                    .attr('cy', function (d) { return _this.projection([d.longitude, d.latitude])[1]; })
                    .attr('r', function (d) { return (!_this.dot ? Math.sqrt(_this.bubbleRadius(d.value)) : _this.dotSize + "px"); }); }, function (update) { return update
                    .transition()
                    .duration(1000)
                    .attr('cx', function (d) { return _this.projection([d.longitude, d.latitude])[0]; })
                    .attr('cy', function (d) { return _this.projection([d.longitude, d.latitude])[1]; })
                    .attr('r', function (d) { return (!_this.dot ? Math.sqrt(_this.bubbleRadius(d.value)) : _this.dotSize + "px"); })
                    .transition()
                    .attr('pointer-events', 'auto'); }, function (exit) { return exit.transition().attr('pointer-events', 'none').remove(); });
                if (!_this.hideTooltip) {
                    _this.bubbleContainer
                        .selectAll('circle')
                        .on('mouseover', function (data, index, nodes) { return _this.bubbleMouseOver(d3Selection.event, data, index, nodes); })
                        .on('mouseout', function (data, index, nodes) { return _this.bubbleMouseOut(d3Selection.event, data, index, nodes); })
                        .on('click', function (data, index, nodes) { return _this.bubbleMouseClick(d3Selection.event, data, index, nodes); });
                    // bubble text
                    if (_this.type !== 'high' && !_this.dot) {
                        _this.bubbleContainer
                            .selectAll('text')
                            .data(_this.data)
                            .join(function (enter) { return enter
                            .append('text')
                            .text(function (d) { return (_this.bubbleLabelFormat ? _this.bubbleLabelFormat(d.value) : d.value); })
                            .attr('class', 'dot-text')
                            .style('fill', _this.textColor)
                            .style('font-size', function (d) { return Math.round(_this.fontRange(d.value)) + "px"; })
                            .attr('x', function (d) { return _this.projection([d.longitude, d.latitude])[0]; })
                            .attr('y', function (d) { return _this.projection([d.longitude, d.latitude])[1]; })
                            .attr('dy', '.4em'); }, function (update) { return update
                            .attr('pointer-events', 'none')
                            .transition()
                            .duration(1000)
                            .text(function (d) { return (_this.bubbleLabelFormat ? _this.bubbleLabelFormat(d.value) : d.value); })
                            .style('font-size', function (d) { return Math.round(_this.fontRange(d.value)) + "px"; })
                            .attr('x', function (d) { return _this.projection([d.longitude, d.latitude])[0]; })
                            .attr('y', function (d) { return _this.projection([d.longitude, d.latitude])[1]; })
                            .attr('dy', '.4em')
                            .transition()
                            .attr('pointer-events', 'auto'); }, function (exit) { return exit.transition().attr('pointer-events', 'none').remove(); });
                    }
                }
            };
            this.bubbleMouseOver = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.dot-circle')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.chart
                    .selectAll('.dot-circle')
                    .filter(function (d, i) { return i === index; })
                    .classed('active', true);
                _this.tooltipShow(data, nodes[index]);
                _this.hovered.emit({ event: event, data: data });
            };
            this.bubbleMouseOut = function (event, data, index, nodes) {
                _this.chart.selectAll('.dot-circle').classed('active', false).classed('inactive', false);
                _this.tooltipHide();
            };
            this.bubbleMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.tooltipShow = function (data, node) {
                var dimensions = node.getBoundingClientRect();
                var scroll = _this._scroll.getScrollPosition();
                _this.tooltip.select('.tooltip-header').html(function (d) { return "" + data.label; });
                if (!_this.hideTooltipValue) {
                    _this.tooltip
                        .select('.tooltip-value')
                        .html(function (d) { return (_this.tooltipValueFormat ? "" + _this.tooltipValueFormat(data.value) : "" + data.value); });
                }
                var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
                var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight + 8;
                _this.tooltip.style('top', +scroll[1] + +dimensions.top - tooltipOffsetHeight + "px"); //
                _this.tooltip.style('left', +scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2 + "px");
                _this.tooltip.style('opacity', 1);
            };
            this.tooltipHide = function () {
                _this.tooltip.style('opacity', 0);
            };
        }
        DatavizBubbleMapComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.margin = {
                top: +this.marginTop,
                right: +this.marginRight,
                bottom: +this.marginBottom,
                left: +this.marginLeft
            };
            if (this.type !== 'debug') {
                // set type defaults
                switch (this.type) {
                    case 'medium':
                        break;
                    case 'high':
                        break;
                }
            }
            switch (this.projectionType) {
                case 'geoAlbers':
                    this.projection = d3Geo.geoAlbers();
                    break;
                case 'geoAlbersUsa':
                    this.projection = d3Geo.geoAlbersUsa();
                    break;
                case 'geoMercator':
                    this.projection = d3Geo.geoMercator();
                    break;
                default:
                    break;
            }
            // dreate formatters
            this.bubbleLabelFormat = this._dataviz.d3Format(this.bubbleLabelFormatType, this.bubbleLabelFormatString);
            this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
            // console.log('TOPOJSON: ', this.topojson);
            this.topojsonFeature = topojson.feature(this.topojson, this.topojson.objects[this.feature]);
            this.projection.fitSize([+this.width, +this.height], this.topojsonFeature);
            // console.log('TOPOJSON FEATURE: ', this.topojsonFeature);
            // console.log('MESH: ', topojson.mesh(this.topojson, this.topojson.objects[this.feature], (a, b) => a !== b));
            // console.log('DATA: ', this.data);
            if (this.scale) {
                this.projection.scale(+this.scale);
            }
            if (this.center) {
                this.projection.center(this.center);
            }
            this.geoPath = d3Geo.geoPath().projection(this.projection);
            // bubble radius range
            if (this.data && !this.dot) {
                this.bubbleRadius = d3Scale.scaleLinear()
                    .range(this.bubbleSizeRange)
                    .domain([d3Array.min(this.data, function (d) { return +d.value; }), d3Array.max(this.data, function (d) { return +d.value; })]);
                // font range
                this.fontRange = d3Scale.scaleLinear()
                    .range(this.textSizeRange)
                    .domain([d3Array.min(this.data, function (d) { return +d.value; }), d3Array.max(this.data, function (d) { return +d.value; })]);
            }
            // TOOLTIP
            if (!this.hideTooltip) {
                this.tooltip = d3Selection.select('body')
                    .append('div')
                    .attr('class', 'pbds-tooltip south')
                    .style('opacity', 0)
                    .attr('aria-hidden', 'true'); // hide tooltip for accessibility
                // tooltip header
                this.tooltip.append('div').attr('class', 'tooltip-header');
                if (!this.hideTooltipValue)
                    this.tooltip.append('div').attr('class', 'tooltip-value');
            }
            // create the chart
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            // create chart svg
            this.svg = this.chart
                .append('svg')
                .attr('width', +this.width + this.margin.left + this.margin.right)
                .attr('height', +this.height + this.margin.top + this.margin.bottom)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + (+this.width + this.margin.left + this.margin.right) + " " + (+this.height + this.margin.top + this.margin.bottom))
                .append('g')
                .attr('class', 'container');
            // map
            this.svg
                .append('g')
                .attr('class', 'map')
                .selectAll('path')
                .data(this.topojsonFeature.features)
                .join(function (enter) { return enter.append('path').attr('class', 'feature').attr('d', _this.geoPath); });
            // borders
            this.svg
                .append('path')
                .attr('class', 'mesh')
                .datum(topojson.mesh(this.topojson, this.topojson.objects[this.feature], function (a, b) { return a !== b; }))
                .attr('d', this.geoPath);
            this.bubbleContainer = this.svg.append('g').attr('class', 'dots').style('color', this.color);
            this.updateChart();
        };
        DatavizBubbleMapComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.updateChart();
            }
        };
        DatavizBubbleMapComponent.prototype.ngOnDestroy = function () {
            if (this.tooltip)
                this.tooltip.remove();
        };
        return DatavizBubbleMapComponent;
    }());
    DatavizBubbleMapComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-bubble-map',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    DatavizBubbleMapComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: common.ViewportScroller },
        { type: PbdsDatavizService }
    ]; };
    DatavizBubbleMapComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        bubbleMapClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-bubble-map',] }],
        data: [{ type: i0.Input }],
        topojson: [{ type: i0.Input }],
        feature: [{ type: i0.Input }],
        projectionType: [{ type: i0.Input }],
        scale: [{ type: i0.Input }],
        center: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        height: [{ type: i0.Input }],
        type: [{ type: i0.Input }],
        dot: [{ type: i0.Input }],
        marginTop: [{ type: i0.Input }],
        marginRight: [{ type: i0.Input }],
        marginBottom: [{ type: i0.Input }],
        marginLeft: [{ type: i0.Input }],
        color: [{ type: i0.Input }],
        textColor: [{ type: i0.Input }],
        textSizeRange: [{ type: i0.Input }],
        dotSize: [{ type: i0.Input }],
        bubbleSizeRange: [{ type: i0.Input }],
        bubbleLabelFormatType: [{ type: i0.Input }],
        bubbleLabelFormatString: [{ type: i0.Input }],
        hideTooltip: [{ type: i0.Input }],
        hideTooltipValue: [{ type: i0.Input }],
        tooltipValueFormatType: [{ type: i0.Input }],
        tooltipValueFormatString: [{ type: i0.Input }],
        hovered: [{ type: i0.Output }],
        clicked: [{ type: i0.Output }]
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var PbdsDatavizHeatmapComponent = /** @class */ (function () {
        function PbdsDatavizHeatmapComponent(_dataviz, _element, _scroll) {
            var _this = this;
            this._dataviz = _dataviz;
            this._element = _element;
            this._scroll = _scroll;
            this.chartClass = true;
            this.heatmapClass = true;
            this.width = 306;
            this.height = 400;
            this.marginTop = 0; // hardcoded on purpose, do not document until feedback
            this.marginRight = 0; // hardcoded on purpose, do not document until feedback
            this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
            this.marginLeft = 55;
            this.scale = 'quantile';
            this.xAxisFormatType = null;
            this.xAxisFormatString = '';
            this.yAxisFormatType = null;
            this.yAxisFormatString = '';
            this.hideLegend = false;
            this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
            this.legendPosition = 'right';
            this.legendLabelFormatType = null;
            this.legendLabelFormatString = '';
            this.tooltipXLabelFormatType = null;
            this.tooltipXLabelFormatString = '';
            this.tooltipYLabelFormatType = null;
            this.tooltipYLabelFormatString = '';
            this.tooltipValueFormatType = null;
            this.tooltipValueFormatString = '';
            this.theme = 'classic';
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.updateChart = function () {
                _this.svg
                    .selectAll('rect')
                    .data(_this.data)
                    .join(function (enter) { return enter
                    .append('rect')
                    .attr('class', 'block')
                    .classed('empty', function (d) { return d.value === undefined || d.value === null; })
                    .attr('x', function (d) { return _this.xAxisScale(d.xLabel); })
                    .attr('y', function (d) { return _this.yAxisScale(d.yLabel); })
                    .attr('width', _this.xAxisScale.bandwidth())
                    .attr('height', _this.yAxisScale.bandwidth())
                    .style('fill', function (d) { return _this.colorRange(d.value); }); }, function (update) { return update.call(function (update) {
                    update
                        .classed('empty', function (d) { return d.value === undefined || d.value === null; })
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .attr('x', function (d) { return _this.xAxisScale(d.xLabel); })
                        .attr('y', function (d) { return _this.yAxisScale(d.yLabel); })
                        .attr('width', _this.xAxisScale.bandwidth())
                        .attr('height', _this.yAxisScale.bandwidth())
                        .style('fill', function (d) { return _this.colorRange(d.value); })
                        .transition()
                        .attr('pointer-events', 'auto');
                    return update;
                }); }, function (exit) { return exit
                    .transition()
                    .attr('pointer-events', 'none')
                    .remove(); })
                    .on('mouseover', function (data, index, nodes) { return _this.blockMouseOver(d3Selection.event, data, index, nodes); })
                    .on('mouseout', function (data, index, nodes) { return _this.blockMouseOut(); })
                    .on('click', function (data, index, nodes) { return _this.blockMouseClick(d3Selection.event, data, index, nodes); });
                if (!_this.hideLegend) {
                    _this.chart
                        .select('.legend')
                        .selectAll('.legend-item')
                        .data(_this.colorDomain)
                        .join(function (enter) {
                        var li = enter.append('li').attr('class', 'legend-item');
                        li.append('span')
                            .attr('class', 'legend-key')
                            .style('background-color', function (d) { return _this.colorRange(d); });
                        li.append('span')
                            .attr('class', 'legend-label')
                            .html(function (d) {
                            var label = d;
                            switch (_this.legendLabelFormatType) {
                                case 'number':
                                    label = _this.legendLabelFormat(d);
                                    break;
                            }
                            return "&ge; " + label;
                        });
                        return li;
                    }, function (update) { return update.select('.legend-label').html(function (d) {
                        var label = d;
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                label = _this.legendLabelFormat(d);
                                break;
                        }
                        return "&ge; " + label;
                    }); }, function (exit) { return exit.remove(); })
                        .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3Selection.event, data, index, nodes); })
                        .on('mouseout', function () { return _this.legendMouseOut(); })
                        .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3Selection.event, data, index, nodes); });
                }
            };
            this.blockMouseOver = function (event, data, index, nodes) {
                // console.log(data.value, event, data, index, nodes);
                if (data.value !== null) {
                    _this.tooltipShow(data, index, nodes[index]);
                }
                _this.hovered.emit({ event: event, data: data });
            };
            this.blockMouseOut = function () {
                _this.tooltipHide();
            };
            this.blockMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.legendMouseOver = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.chart
                    .selectAll('.block')
                    .filter(function (d, i) {
                    if (index + 1 === nodes.length) {
                        return d.value < data;
                    }
                    else {
                        return d.value < data || d.value >= +d3Selection.select(nodes[index + 1]).data()[0];
                    }
                })
                    .classed('inactive', true);
                _this.hovered.emit({ event: event, data: data });
            };
            this.legendMouseOut = function () {
                _this.chart.selectAll('.legend-item').classed('inactive', false);
                _this.chart.selectAll('.block').classed('inactive', false);
            };
            this.legendMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.tooltipShow = function (data, index, node) {
                // console.log('TOOLTIP: ', data, index, node);
                var dimensions = node.getBoundingClientRect();
                var scroll = _this._scroll.getScrollPosition();
                var yLabel;
                var xLabel;
                switch (_this.tooltipYLabelFormatType) {
                    case 'number':
                        yLabel = _this.tooltipYLabelFormat(data.yLabel);
                        break;
                    case 'time':
                        var parsedTime = d3TimeFormat.isoParse(data.yLabel);
                        yLabel = _this.tooltipYLabelFormat(parsedTime);
                        break;
                    default:
                        yLabel = "" + data.yLabel + _this.tooltipYLabelFormatString;
                }
                switch (_this.tooltipXLabelFormatType) {
                    case 'number':
                        xLabel = _this.tooltipXLabelFormat(data.xLabel);
                        break;
                    case 'time':
                        var parsedTime = d3TimeFormat.isoParse(data.xLabel);
                        xLabel = _this.tooltipXLabelFormat(parsedTime);
                        break;
                    default:
                        xLabel = "" + data.xLabel + _this.tooltipXLabelFormatString;
                }
                var value = _this.tooltipValueFormat === null
                    ? "<div class=\"tooltip-value\">" + data.value + "</div>"
                    : "<div class=\"tooltip-value\">" + _this.tooltipValueFormat(data.value) + "</div>";
                _this.tooltip.html("\n        " + yLabel + " : " + xLabel + "<br>\n        " + value + "\n      ");
                var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
                var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight + 8;
                _this.tooltip.style('top', +scroll[1] + +dimensions.top - tooltipOffsetHeight + "px"); //
                _this.tooltip.style('left', +scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2 + "px");
                _this.tooltip.style('opacity', 1);
                _this.tooltip.style('opacity', 1);
            };
            this.tooltipHide = function () {
                _this.tooltip.style('opacity', 0);
            };
            this.xAxisFormatter = function (item) {
                switch (_this.xAxisFormatType) {
                    case 'number':
                        return _this.xAxisFormat(item);
                    case 'time':
                        var parseDate = d3TimeFormat.isoParse(item);
                        return _this.xAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
            this.yAxisFormatter = function (item) {
                switch (_this.yAxisFormatType) {
                    case 'number':
                        return _this.yAxisFormat(item);
                    case 'time':
                        var parseDate = d3TimeFormat.isoParse(item);
                        return _this.yAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
        }
        PbdsDatavizHeatmapComponent.prototype.ngOnInit = function () {
            this.margin = {
                top: +this.marginTop,
                right: +this.marginRight,
                bottom: +this.marginBottom,
                left: +this.marginLeft
            };
            // create formatters
            this.yAxisFormat = this._dataviz.d3Format(this.yAxisFormatType, this.yAxisFormatString);
            this.xAxisFormat = this._dataviz.d3Format(this.xAxisFormatType, this.xAxisFormatString);
            this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
            this.tooltipYLabelFormat = this._dataviz.d3Format(this.tooltipYLabelFormatType, this.tooltipYLabelFormatString);
            this.tooltipXLabelFormat = this._dataviz.d3Format(this.tooltipXLabelFormatType, this.tooltipXLabelFormatString);
            this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
            // defaults for all chart types
            this.hideXAxis = false;
            this.hideXAxisZero = false;
            this.hideXAxisDomain = true;
            this.hideYAxisDomain = true;
            this.hideTooltip = false;
            this.hideXAxisTicks = true;
            this.hideYAxisTicks = true;
            this.xAxisTickSize = 8;
            this.xAxisTickSizeOuter = 0;
            this.yAxisTickSize = 8;
            this.yAxisTickSizeOuter = 0;
            // create the chart
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            // create chart svg
            this.svg = this.chart
                .append('svg')
                .attr('width', +this.width)
                .attr('height', +this.height + this.margin.top + this.margin.bottom)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + +this.width + " " + (+this.height + this.margin.top + this.margin.bottom));
            // color range
            var colors = this._dataviz
                .getColors(true, this.theme)
                .slice()
                .reverse();
            var colorDomain = [
                +d3Array.min(this.data, function (d) { return d.value; }),
                +d3Array.max(this.data, function (d) { return d.value; })
            ];
            var colorValues = this.data.map(function (d) { return d.value; });
            switch (this.scale) {
                case 'threshold':
                    this.colorRange = d3Scale.scaleThreshold()
                        .domain(this.domain)
                        .range(colors);
                    this.colorDomain = this.colorRange.domain();
                    break;
                case 'quantile':
                    this.colorRange = d3Scale.scaleQuantile()
                        .domain(colorValues)
                        .range(colors);
                    this.colorDomain = this.colorRange.quantiles();
                    break;
                case 'quantize':
                    this.colorRange = d3Scale.scaleQuantize()
                        .domain(colorDomain)
                        .range(colors);
                    this.colorDomain = this.colorRange.thresholds();
                    break;
            }
            // console.log(colors, colorDomain, colorValues, this.scale, this.colorRange, this.colorDomain);
            // define axis labels
            var xAxisLabels = __spread(new Set(this.data.map(function (d) { return d.xLabel; })));
            var yAxisLabels = __spread(new Set(this.data.map(function (d) { return d.yLabel; }))).reverse();
            // X axis
            this.xAxisScale = d3Scale.scaleBand()
                .domain(xAxisLabels)
                .rangeRound([0, this.width - this.margin.left])
                .paddingInner(0.1);
            this.xAxisCall = d3Axis.axisBottom(this.xAxisScale)
                .tickSize(this.xAxisTickSize)
                .tickSizeOuter(this.xAxisTickSizeOuter)
                .tickFormat(this.xAxisFormatter);
            this.xAxis = this.svg
                .append('g')
                .attr('class', 'axis axis-x')
                .attr('transform', "translate(0, " + this.height + ")")
                .classed('axis-hidden', this.hideXAxis)
                .classed('axis-zero-hidden', this.hideXAxisZero)
                .classed('axis-domain-hidden', this.hideXAxisDomain)
                .classed('axis-ticks-hidden', this.hideXAxisTicks)
                .call(this.xAxisCall);
            // Y axis
            this.yAxisScale = d3Scale.scaleBand()
                .domain(yAxisLabels)
                .rangeRound([this.height, 0])
                .paddingInner(0.1);
            this.yAxisCall = d3Axis.axisLeft(this.yAxisScale)
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
            // TOOLTIP
            if (!this.hideTooltip) {
                this.tooltip = d3Selection.select('body')
                    .append('div')
                    .attr('class', 'pbds-tooltip south')
                    .style('opacity', 0)
                    .attr('aria-hidden', 'true'); // hide tooltip for accessibility
            }
            // add legend classes
            if (!this.hideLegend) {
                this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
                this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
            }
            this.updateChart();
        };
        PbdsDatavizHeatmapComponent.prototype.ngOnDestroy = function () {
            if (this.tooltip)
                this.tooltip.remove();
        };
        PbdsDatavizHeatmapComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.updateChart();
            }
        };
        return PbdsDatavizHeatmapComponent;
    }());
    PbdsDatavizHeatmapComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-heatmap',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    PbdsDatavizHeatmapComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: i0.ElementRef },
        { type: common.ViewportScroller }
    ]; };
    PbdsDatavizHeatmapComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        heatmapClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-heatmap',] }],
        data: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        height: [{ type: i0.Input }],
        marginTop: [{ type: i0.Input }],
        marginRight: [{ type: i0.Input }],
        marginBottom: [{ type: i0.Input }],
        marginLeft: [{ type: i0.Input }],
        scale: [{ type: i0.Input }],
        domain: [{ type: i0.Input }],
        xAxisFormatType: [{ type: i0.Input }],
        xAxisFormatString: [{ type: i0.Input }],
        yAxisFormatType: [{ type: i0.Input }],
        yAxisFormatString: [{ type: i0.Input }],
        hideLegend: [{ type: i0.Input }],
        legendWidth: [{ type: i0.Input }],
        legendPosition: [{ type: i0.Input }],
        legendLabelFormatType: [{ type: i0.Input }],
        legendLabelFormatString: [{ type: i0.Input }],
        tooltipXLabelFormatType: [{ type: i0.Input }],
        tooltipXLabelFormatString: [{ type: i0.Input }],
        tooltipYLabelFormatType: [{ type: i0.Input }],
        tooltipYLabelFormatString: [{ type: i0.Input }],
        tooltipValueFormatType: [{ type: i0.Input }],
        tooltipValueFormatString: [{ type: i0.Input }],
        theme: [{ type: i0.Input }],
        hovered: [{ type: i0.Output }],
        clicked: [{ type: i0.Output }]
    };

    var PbdsDatavizChoroplethMapComponent = /** @class */ (function () {
        function PbdsDatavizChoroplethMapComponent(_dataviz, _element, _scroll) {
            var _this = this;
            this._dataviz = _dataviz;
            this._element = _element;
            this._scroll = _scroll;
            this.chartClass = true;
            this.choroplethMapClass = true;
            this.feature = '';
            this.dataField = 'id';
            this.mesh = null;
            this.scale = null;
            this.center = null;
            this.width = 960;
            this.height = 500;
            this.marginTop = 0;
            this.marginRight = 0;
            this.marginBottom = 0;
            this.marginLeft = 0;
            this.theme = 'classic';
            this.colorScale = 'quantile';
            this.hideTooltip = false;
            this.tooltipValueFormatType = null;
            this.tooltipValueFormatString = '';
            this.hideLegend = false;
            this.legendWidth = 260;
            this.legendLabel = null;
            this.legendValueFormatType = null;
            this.legendValueFormatString = '';
            this.legendLeft = 20;
            this.legendTop = 20;
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.updateChart = function () {
                _this.svg
                    .select('.map')
                    .selectAll('path')
                    .style('fill', function (d, i) {
                    var match = _this.data.find(function (obj) { return obj[_this.dataField] === d[_this.dataField]; });
                    if (match) {
                        return _this.colorRange(match.value);
                    }
                })
                    .classed('hasData', function (d, i) {
                    return _this.data.some(function (obj) { return obj[_this.dataField] === d[_this.dataField]; });
                });
                if (!_this.hideTooltip) {
                    _this.svg
                        .select('.map')
                        .selectAll('path')
                        .on('mouseover', function (data, index, nodes) { return _this.featureMouseOver(d3Selection.event, _this.data.find(function (obj) { return obj[_this.dataField] === data[_this.dataField]; }), index, nodes); })
                        .on('mouseout', function (data, index, nodes) { return _this.featureMouseOut(d3Selection.event, _this.data, index, nodes); })
                        .on('mousemove', function (data, index, nodes) { return _this.tooltipMove(_this.chart.node()); })
                        .on('click', function (data, index, nodes) { return _this.featureMouseClick(d3Selection.event, _this.data.find(function (obj) { return obj[_this.dataField] === data[_this.dataField]; }), index, nodes); });
                }
            };
            this.featureMouseOver = function (event, data, index, nodes) {
                if (data) {
                    _this.tooltipShow(data, nodes[index]);
                    _this.hovered.emit({ event: event, data: data });
                }
            };
            this.featureMouseOut = function (event, data, index, nodes) {
                _this.tooltipHide();
            };
            this.featureMouseClick = function (event, data, index, nodes) {
                if (data) {
                    _this.clicked.emit({ event: event, data: data });
                }
            };
            this.tooltipShow = function (data, node) {
                // console.log('TOOLTIP: ', data, node);
                _this.tooltipSetPosition(node);
                if (data.label) {
                    _this.tooltip.select('.tooltip-header').html(function (d) { return "" + data.label; });
                }
                _this.tooltip
                    .select('.tooltip-value')
                    .html(function (d) { return (_this.tooltipValueFormat ? "" + _this.tooltipValueFormat(data.value) : "" + data.value); });
                _this.tooltip.style('opacity', 1);
            };
            this.tooltipHide = function () {
                _this.tooltip.style('opacity', 0);
            };
            this.tooltipMove = function (node) {
                _this.tooltipSetPosition(node);
            };
            this.tooltipSetPosition = function (node) {
                var mouse = d3Selection.mouse(node);
                var mouseLeft = +mouse[0];
                var mouseTop = +mouse[1];
                var geometry = node.getBoundingClientRect();
                var geometryLeft = +geometry.left;
                var geometryTop = +geometry.top;
                var scroll = _this._scroll.getScrollPosition();
                // const scrollLeft = +scroll[0];
                var scrollTop = +scroll[1];
                var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
                var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight;
                _this.tooltip.style('top', scrollTop + mouseTop + geometryTop - tooltipOffsetHeight - 14 + "px");
                _this.tooltip.style('left', mouseLeft + geometryLeft - tooltipOffsetWidth + "px");
            };
            this.legend = function (g) {
                var length = _this.colorRange.range().length;
                // console.log(this.colorRange.range().length, this.colorDomain);
                var x = d3Scale.scaleLinear()
                    .domain([1, length - 1])
                    .rangeRound([+_this.legendWidth / length, (_this.legendWidth * (length - 1)) / length]);
                g.attr('class', 'legend')
                    .selectAll('rect')
                    .data(_this.colorRange.range())
                    .join('rect')
                    .attr('height', 8)
                    .attr('x', function (d, i) { return x(i); })
                    .attr('width', function (d, i) { return x(i + 1) - x(i); })
                    .attr('fill', function (d) { return d; });
                if (_this.legendLabel) {
                    g.append('text').attr('y', -6).attr('text-anchor', 'start').attr('class', 'legend-label').text(_this.legendLabel);
                }
                g.call(d3Axis.axisBottom(x)
                    .tickSize(13)
                    .tickValues(d3Array.range(1, length))
                    .tickFormat(function (i) { return _this.legendValueFormat ? "" + _this.legendValueFormat(_this.colorDomain[i - 1]) : "" + _this.colorDomain[i - 1]; }))
                    .select('.domain')
                    .remove();
            };
        }
        PbdsDatavizChoroplethMapComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.margin = {
                top: +this.marginTop,
                right: +this.marginRight,
                bottom: +this.marginBottom,
                left: +this.marginLeft
            };
            // color range
            var colors = this._dataviz.getColors(true, this.theme).slice().reverse();
            var colorDomain = [+d3Array.min(this.data, function (d) { return d.value; }), +d3Array.max(this.data, function (d) { return d.value; })];
            var colorValues = this.data.map(function (d) { return d.value; });
            switch (this.colorScale) {
                case 'threshold':
                    this.colorRange = d3Scale.scaleThreshold().domain(this.domain).range(colors);
                    this.colorDomain = this.colorRange.domain();
                    break;
                case 'quantile':
                    this.colorRange = d3Scale.scaleQuantile().domain(colorValues).range(colors);
                    this.colorDomain = this.colorRange.quantiles();
                    break;
                case 'quantize':
                    this.colorRange = d3Scale.scaleQuantize().domain(colorDomain).range(colors);
                    this.colorDomain = this.colorRange.thresholds();
                    break;
            }
            // create formatters
            this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
            this.legendValueFormat = this._dataviz.d3Format(this.legendValueFormatType, this.legendValueFormatString);
            switch (this.projectionType) {
                case 'geoAlbers':
                    this.projection = d3Geo.geoAlbers();
                    break;
                case 'geoAlbersUsa':
                    this.projection = d3Geo.geoAlbersUsa();
                    break;
                case 'geoMercator':
                    this.projection = d3Geo.geoMercator();
                    break;
            }
            this.topojsonFeature = topojson.feature(this.topojson, this.topojson.objects[this.feature]);
            this.projection.fitSize([+this.width, +this.height], this.topojsonFeature);
            if (this.scale) {
                this.projection.scale(+this.scale);
            }
            if (this.center) {
                this.projection.center(this.center);
            }
            this.geoPath = d3Geo.geoPath().projection(this.projection);
            // console.log('TOPOJSON: ', this.topojson);
            // console.log('TOPOJSON FEATURE: ', this.topojsonFeature);
            // console.log('MESH: ', topojson.mesh(this.topojson, this.topojson.objects[this.feature], (a, b) => a !== b));
            // console.log('DATA: ', this.data);
            // create the chart
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            // TOOLTIP
            if (!this.hideTooltip) {
                this.tooltip = d3Selection.select('body')
                    .append('div')
                    .attr('class', 'pbds-tooltip south')
                    .style('opacity', 0)
                    .attr('aria-hidden', 'true'); // hide tooltip for accessibility
                // tooltip header
                this.tooltip.append('div').attr('class', 'tooltip-header');
                this.tooltip.append('div').attr('class', 'tooltip-value');
            }
            // create chart svg
            this.svg = this.chart
                .append('svg')
                .attr('width', +this.width)
                .attr('height', +this.height + this.margin.top + this.margin.bottom)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + +this.width + " " + (+this.height + this.margin.top + this.margin.bottom));
            // map
            this.svg
                .append('g')
                .attr('class', 'map')
                .selectAll('path')
                .data(this.topojsonFeature.features)
                .join(function (enter) { return enter.append('path').attr('class', 'feature').attr('d', _this.geoPath); });
            // borders
            this.svg
                .append('path')
                .attr('class', 'mesh')
                .datum(topojson.mesh(this.topojson, this.topojson.objects[this.mesh || this.feature], function (a, b) { return a !== b; }))
                .attr('d', this.geoPath);
            // legend
            if (!this.hideLegend) {
                this.svg
                    .append('g')
                    .attr('transform', "translate(" + +this.legendLeft + ", " + +this.legendTop + ")")
                    .call(this.legend);
            }
            this.updateChart();
        };
        PbdsDatavizChoroplethMapComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.updateChart();
            }
        };
        PbdsDatavizChoroplethMapComponent.prototype.ngOnDestroy = function () {
            if (this.tooltip)
                this.tooltip.remove();
        };
        return PbdsDatavizChoroplethMapComponent;
    }());
    PbdsDatavizChoroplethMapComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-choropleth-map',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    PbdsDatavizChoroplethMapComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: i0.ElementRef },
        { type: common.ViewportScroller }
    ]; };
    PbdsDatavizChoroplethMapComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        choroplethMapClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-choropleth-map',] }],
        data: [{ type: i0.Input }],
        topojson: [{ type: i0.Input }],
        feature: [{ type: i0.Input }],
        projectionType: [{ type: i0.Input }],
        dataField: [{ type: i0.Input }],
        mesh: [{ type: i0.Input }],
        scale: [{ type: i0.Input }],
        center: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        height: [{ type: i0.Input }],
        marginTop: [{ type: i0.Input }],
        marginRight: [{ type: i0.Input }],
        marginBottom: [{ type: i0.Input }],
        marginLeft: [{ type: i0.Input }],
        theme: [{ type: i0.Input }],
        colorScale: [{ type: i0.Input }],
        domain: [{ type: i0.Input }],
        hideTooltip: [{ type: i0.Input }],
        tooltipValueFormatType: [{ type: i0.Input }],
        tooltipValueFormatString: [{ type: i0.Input }],
        hideLegend: [{ type: i0.Input }],
        legendWidth: [{ type: i0.Input }],
        legendLabel: [{ type: i0.Input }],
        legendValueFormatType: [{ type: i0.Input }],
        legendValueFormatString: [{ type: i0.Input }],
        legendLeft: [{ type: i0.Input }],
        legendTop: [{ type: i0.Input }],
        hovered: [{ type: i0.Output }],
        clicked: [{ type: i0.Output }]
    };

    var PbdsDatavizBarGroupedComponent = /** @class */ (function () {
        function PbdsDatavizBarGroupedComponent(_dataviz, _element, _scroll, _location) {
            var _this = this;
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
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.barMouseOver = function (event, data, index, nodes) {
                var node = d3Selection.select(nodes[index]);
                _this.chart
                    .selectAll('.bar-group')
                    .selectAll('.bar')
                    .classed('inactive', true);
                node.classed('inactive', false).style('fill', node.attr('data-color'));
                _this.tooltipShow(data, nodes[index]);
                _this.hovered.emit({ event: event, data: data });
            };
            this.barMouseOut = function () {
                _this.chart
                    .selectAll('.bar')
                    .classed('inactive', false)
                    .style('fill', null);
                _this.tooltipHide();
            };
            this.barMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.legendMouseOver = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.chart
                    .selectAll('.bar-group')
                    .selectAll('.bar')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                var bar = _this.chart
                    .selectAll('.bar-group')
                    .selectAll('.bar')
                    .filter(function (d, i) { return i === index; })
                    .classed('inactive', null);
                var barColor = bar.attr('data-color');
                bar.style('fill', function () { return barColor; });
                _this.hovered.emit({ event: event, data: data });
            };
            this.legendMouseOut = function () {
                _this.chart.selectAll('.legend-item').classed('inactive', false);
                _this.chart
                    .selectAll('.bar-group')
                    .selectAll('.bar')
                    .classed('inactive', false)
                    .style('fill', null);
            };
            this.legendMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.tooltipShow = function (data, node) {
                var dimensions = node.getBoundingClientRect();
                var scroll = _this._scroll.getScrollPosition();
                var label;
                switch (_this.tooltipLabelFormatType) {
                    case 'number':
                        label = _this.tooltipLabelFormat(data.label);
                        break;
                    case 'time':
                        var parsedTime = d3TimeFormat.isoParse(data.label);
                        label = _this.tooltipLabelFormat(parsedTime);
                        break;
                    default:
                        label = data.label;
                }
                var value = _this.tooltipValueFormat === null
                    ? "<div class=\"tooltip-value\">" + data.value + "</div>"
                    : "<div class=\"tooltip-value\">" + _this.tooltipValueFormat(data.value) + "</div>";
                _this.tooltip.html("\n        " + label + "\n        " + value + "\n      ");
                var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
                var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight;
                var tooltipTipSize = 8;
                if (_this.vertical) {
                    _this.tooltip.style('top', +scroll[1] + +dimensions.top - tooltipOffsetHeight - tooltipTipSize + "px");
                    _this.tooltip.style('left', +scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2 + "px");
                }
                else {
                    _this.tooltip.style('top', +scroll[1] + +dimensions.top + +dimensions.height / 2 - tooltipOffsetHeight / 2 + "px");
                    _this.tooltip.style('left', +scroll[0] + +dimensions.right + tooltipTipSize + "px");
                }
                _this.tooltip.style('opacity', 1);
            };
            this.tooltipHide = function () {
                _this.tooltip.style('opacity', 0);
            };
            this.xAxisFormatter = function (item) {
                switch (_this.xAxisFormatType) {
                    case 'number':
                        return _this.xAxisFormat(item);
                    case 'time':
                        var parseDate = d3TimeFormat.isoParse(item);
                        return _this.xAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
            this.yAxisFormatter = function (item) {
                switch (_this.yAxisFormatType) {
                    case 'number':
                        return _this.yAxisFormat(item);
                    case 'time':
                        var parseDate = d3TimeFormat.isoParse(item);
                        return _this.yAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
        }
        PbdsDatavizBarGroupedComponent.prototype.ngOnInit = function () {
            var _this = this;
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
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            // create chart svg
            this.svg = this.chart
                .append('svg')
                .attr('width', function () {
                if (_this.vertical) {
                    return +_this.width;
                }
                else {
                    return +_this.width + _this.margin.left + _this.margin.right;
                }
            })
                .attr('height', +this.height + this.margin.top + this.margin.bottom)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', function () {
                if (_this.vertical) {
                    return "-" + _this.margin.left + " -" + _this.margin.top + " " + +_this.width + " " + (+_this.height +
                        _this.margin.top +
                        _this.margin.bottom);
                }
                else {
                    return "-" + _this.margin.left + " -" + _this.margin.top + " " + (+_this.width + _this.margin.left + _this.margin.right) + " " + (+_this
                        .height +
                        _this.margin.top +
                        _this.margin.bottom);
                }
            });
            // TOOLTIP
            if (!this.hideTooltip) {
                this.tooltip = d3Selection.select('body')
                    .append('div')
                    .attr('class', function () {
                    return _this.vertical ? 'pbds-tooltip south' : 'pbds-tooltip west';
                })
                    .style('opacity', 0)
                    .attr('aria-hidden', 'true'); // hide tooltip for accessibility
            }
            // add legend classes
            if (!this.hideLegend) {
                this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
                this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
            }
            // build color ranges
            this.colorRange = d3Scale.scaleOrdinal().range(this._dataviz.createGradientDefs(this.svg, false, this.theme, this.vertical));
            if (this.vertical) {
                // X AXIS
                this.xAxisScale = d3Scale.scaleBand()
                    .domain(this.data.map(function (d) { return d.key; }))
                    .rangeRound([0, this.width - this.margin.left])
                    .align(0);
                // add padding to the scale for gray bars
                !this.hideGrayBars
                    ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
                    : this.xAxisScale.paddingInner(0).paddingOuter(0);
                this.xAxisCall = d3Axis.axisBottom(this.xAxisScale)
                    .tickSize(this.xAxisTickSize)
                    .tickSizeOuter(this.xAxisTickSizeOuter)
                    .tickFormat(this.xAxisFormatter);
                this.xAxis = this.svg
                    .append('g')
                    .attr('class', 'axis axis-x')
                    .attr('transform', "translate(0, " + this.height + ")")
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
                this.yAxisMax = d3Array.max(this.data, function (data) {
                    var clone = Object.assign({}, data);
                    delete clone.key;
                    return d3Array.max(d3Collection.values(clone));
                });
                this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
                this.yAxisScale = d3Scale.scaleLinear()
                    .domain([0, this.yAxisMax])
                    .nice()
                    .rangeRound([this.height, 0]);
                this.yAxisCall = d3Axis.axisLeft(this.yAxisScale)
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
                    this.yGridCall = d3Axis.axisLeft(this.yAxisScale)
                        .ticks(this.yAxisTicks)
                        .tickSize(-this.width + this.margin.left + this.margin.right);
                    this.yGrid = this.svg
                        .append('g')
                        .attr('class', 'grid grid-y')
                        .classed('grid-zero-hidden', this.hideYAxisZero)
                        .attr('transform', "translate(0, 0)")
                        .call(this.yGridCall);
                }
                // color bar scale
                this.barScale = d3Scale.scaleBand()
                    .domain(Object.keys(this.data[0]).slice(1))
                    .rangeRound([0, this.xAxisScale.bandwidth()])
                    .paddingInner(0.2)
                    .paddingOuter(0.5);
                this.updateChartVertical();
            }
            else {
                // X AXIS
                this.xAxisMax = d3Array.max(this.data, function (data) {
                    var clone = Object.assign({}, data);
                    delete clone.key;
                    return d3Array.max(d3Collection.values(clone));
                });
                this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
                this.xAxisScale = d3Scale.scaleLinear()
                    .domain([0, this.xAxisMax])
                    .rangeRound([0, this.width])
                    .nice();
                this.xAxisCall = d3Axis.axisBottom(this.xAxisScale)
                    .ticks(this.xAxisTicks)
                    .tickSize(this.xAxisTickSize)
                    .tickSizeOuter(this.xAxisTickSizeOuter)
                    .tickFormat(this.xAxisFormatter);
                this.xAxis = this.svg
                    .append('g')
                    .attr('class', 'axis axis-x')
                    .attr('transform', "translate(0, " + this.height + ")")
                    .classed('axis-hidden', this.hideXAxis)
                    .classed('axis-zero-hidden', this.hideXAxisZero)
                    .classed('axis-domain-hidden', this.hideXAxisDomain)
                    .classed('axis-ticks-hidden', this.hideXAxisTicks)
                    .call(this.xAxisCall);
                // Y AXIS
                this.yAxisScale = d3Scale.scaleBand()
                    .domain(this.data.map(function (d) { return d.key; }))
                    .rangeRound([0, this.height])
                    .align(1);
                // add padding to the scale for gray bars
                !this.hideGrayBars
                    ? this.yAxisScale.paddingInner(0.1).paddingOuter(0)
                    : this.yAxisScale.paddingInner(0).paddingOuter(0);
                this.yAxisCall = d3Axis.axisLeft(this.yAxisScale)
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
                    this.xGridCall = d3Axis.axisBottom(this.xAxisScale).tickSize(-this.height);
                    this.xGrid = this.svg
                        .append('g')
                        .attr('class', 'grid grid-x')
                        .classed('grid-zero-hidden', this.hideXAxisZero)
                        .attr('transform', "translate(0, " + this.height + ")")
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
                this.barScale = d3Scale.scaleBand()
                    .domain(Object.keys(this.data[0]).slice(1))
                    .rangeRound([this.yAxisScale.bandwidth(), 0])
                    .paddingInner(0.2)
                    .paddingOuter(0.5);
                this.updateChartHorizontal();
            }
        };
        PbdsDatavizBarGroupedComponent.prototype.ngOnDestroy = function () {
            if (this.tooltip)
                this.tooltip.remove();
        };
        PbdsDatavizBarGroupedComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                if (this.vertical) {
                    this.updateChartVertical();
                }
                else {
                    this.updateChartHorizontal();
                }
            }
        };
        PbdsDatavizBarGroupedComponent.prototype.updateChartVertical = function () {
            var _this = this;
            // update the xScale
            this.xAxisScale.domain(this.data.map(function (d) { return d.key; }));
            // update the yScale
            this.yAxisMax = d3Array.max(this.data, function (data) {
                var clone = Object.assign({}, data);
                delete clone.key;
                return d3Array.max(d3Collection.values(clone));
            });
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale
                .domain([0, this.yAxisMax])
                .rangeRound([this.height, 0])
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
            // if (!this.hideXGrid) {
            //   this.xGrid
            //     .transition()
            //     .duration(1000)
            //     .call(this.xGridCall);
            // }
            if (this.showGrid) {
                this.yGrid
                    .transition()
                    .duration(1000)
                    .call(this.yGridCall);
            }
            // update the color bar scale
            this.barScale.domain(Object.keys(this.data[0]).slice(1)).rangeRound([0, this.xAxisScale.bandwidth()]);
            this.svg
                .selectAll('.gray-bar')
                .data(this.data)
                .join(function (enter) { return enter
                .append('rect')
                .attr('class', 'gray-bar')
                .attr('x', function (d) { return _this.xAxisScale(d.key); })
                .attr('y', function (d) { return _this.yAxisScale(d.value); })
                .attr('width', _this.xAxisScale.bandwidth())
                .attr('height', _this.height); }, function (update) { return update
                .transition()
                .duration(1000)
                .attr('x', function (d) { return _this.xAxisScale(d.key); })
                .attr('y', function (d) { return _this.yAxisScale(d.value); })
                .attr('width', _this.xAxisScale.bandwidth())
                .attr('height', _this.height); });
            this.svg
                .selectAll('.bar-group')
                .data(this.data)
                .join(function (enter) { return enter
                .append('g')
                .attr('class', 'bar-group')
                .attr('transform', function (d, i) {
                return "translate(" + _this.xAxisScale(d.key) + ", 0)";
            }); }, function (update) { return update
                .transition()
                .duration(1000)
                .attr('transform', function (d, i) {
                return "translate(" + _this.xAxisScale(d.key) + ", 0)";
            }); });
            this.svg
                .selectAll('.bar-group')
                .selectAll('.bar')
                .data(function (d, i) {
                var clone = Object.assign({}, d);
                delete clone.key;
                var keys = Object.keys(clone);
                var keyData = keys.map(function (key) {
                    return { label: key, value: d[key], parentIndex: i };
                });
                return keyData;
            })
                .join(function (enter) { return enter
                .append('rect')
                .attr('class', 'bar')
                .attr('fill', function (d) { return "url(" + _this._location.path() + "#gradient-" + _this.colorRange(d.label).substr(1) + ")"; })
                .attr('data-color', function (d) { return _this.colorRange(d.label); })
                .attr('data-parent-index', function (d) { return d.parentIndex; })
                .attr('x', function (d) { return _this.barScale(d.label); })
                .attr('width', _this.barScale.bandwidth())
                .attr('y', _this.height)
                .attr('height', 0)
                .call(function (enter) {
                return enter
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(0) // 500
                    .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); })
                    .attr('y', function (d) { return _this.yAxisScale(d.value); })
                    .transition()
                    .attr('pointer-events', 'auto');
            }); }, function (update) { return update
                .attr('pointer-events', 'none')
                .transition()
                .duration(1000)
                .attr('x', function (d) { return _this.barScale(d.label); })
                .attr('width', _this.barScale.bandwidth())
                .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); })
                .attr('y', function (d) { return _this.yAxisScale(d.value); })
                .transition()
                .attr('pointer-events', 'auto'); }, function (exit) { return exit
                .transition()
                .duration(0) // 100
                .attr('pointer-events', 'none')
                .attr('height', 0)
                .attr('y', _this.height); })
                .on('mouseover', function (data, index, nodes) { return _this.barMouseOver(d3Selection.event, data, index, nodes); })
                .on('mouseout', function (data, index, nodes) { return _this.barMouseOut(); })
                .on('click', function (data, index, nodes) { return _this.barMouseClick(d3Selection.event, data, index, nodes); });
            this.updateLegend();
            this.svg.selectAll('.axis').raise();
        };
        PbdsDatavizBarGroupedComponent.prototype.updateChartHorizontal = function () {
            var _this = this;
            // update the xScale
            this.xAxisMax = d3Array.max(this.data, function (data) {
                var clone = Object.assign({}, data);
                delete clone.key;
                return d3Array.max(d3Collection.values(clone));
            });
            this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
            this.xAxisScale
                .domain([0, this.xAxisMax])
                .rangeRound([0, this.width])
                .nice();
            // update the yScale
            this.yAxisScale.domain(this.data.map(function (d) { return d.key; }));
            this.xAxis
                .transition()
                .duration(1000)
                .call(this.xAxisCall);
            this.yAxis
                .transition()
                .duration(1000)
                .call(this.yAxisCall);
            // update the grids
            if (this.showGrid) {
                this.xGrid
                    .transition()
                    .duration(1000)
                    .call(this.xGridCall);
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
                .join(function (enter) { return enter
                .append('rect')
                .attr('class', 'gray-bar')
                .attr('y', function (d) { return _this.yAxisScale(d.key); })
                .attr('width', _this.width)
                .attr('height', _this.yAxisScale.bandwidth()); }, function (update) { return update
                .transition()
                .duration(1000)
                .attr('y', function (d) { return _this.yAxisScale(d.key); })
                .attr('width', _this.width)
                .attr('height', _this.yAxisScale.bandwidth()); });
            this.svg
                .selectAll('.bar-group')
                .data(this.data)
                .join(function (enter) { return enter
                .append('g')
                .attr('class', 'bar-group')
                .attr('transform', function (d, i) {
                return "translate(0, " + _this.yAxisScale(d.key) + ")";
            }); }, function (update) { return update
                .transition()
                .duration(1000)
                .attr('transform', function (d, i) {
                return "translate(0, " + _this.yAxisScale(d.key) + ")";
            }); });
            this.svg
                .selectAll('.bar-group')
                .selectAll('.bar')
                .data(function (d, i) {
                var clone = Object.assign({}, d);
                delete clone.key;
                var keys = Object.keys(clone);
                var keyData = keys.map(function (key) {
                    return { label: key, value: d[key], parentIndex: i };
                });
                return keyData;
            })
                .join(function (enter) { return enter
                .append('rect')
                .attr('class', 'bar')
                .attr('fill', function (d) { return "url(" + _this._location.path() + "#gradient-horizontal-" + _this.colorRange(d.label).substr(1) + ")"; })
                .attr('data-color', function (d) { return _this.colorRange(d.label); })
                .attr('data-parent-index', function (d) { return d.parentIndex; })
                .attr('x', 0)
                .attr('width', 0)
                .attr('y', function (d) { return _this.barScale(d.label); })
                .attr('height', _this.barScale.bandwidth())
                .call(function (enter) {
                return enter
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(0) // 500
                    .attr('width', function (d) { return _this.xAxisScale(d.value); })
                    .transition()
                    .attr('pointer-events', 'auto');
            }); }, function (update) { return update
                .attr('pointer-events', 'none')
                .transition()
                .duration(1000)
                .attr('width', function (d) { return _this.xAxisScale(d.value); })
                .attr('height', _this.barScale.bandwidth())
                .attr('y', function (d) { return _this.barScale(d.label); })
                .transition()
                .attr('pointer-events', 'auto'); }, function (exit) { return exit
                .transition()
                .duration(0) // 100
                .attr('pointer-events', 'none')
                .attr('width', 0); })
                .on('mouseover', function (data, index, nodes) { return _this.barMouseOver(d3Selection.event, data, index, nodes); })
                .on('mouseout', function (data, index, nodes) { return _this.barMouseOut(); })
                .on('click', function (data, index, nodes) { return _this.barMouseClick(d3Selection.event, data, index, nodes); });
            this.updateLegend();
            this.svg.selectAll('.axis').raise();
        };
        PbdsDatavizBarGroupedComponent.prototype.updateLegend = function () {
            var _this = this;
            // legend
            if (!this.hideLegend) {
                var legendData = Object.assign({}, this.data[0]);
                delete legendData.key;
                var legendKeys = Object.keys(legendData).map(function (key) {
                    return { label: key };
                });
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(legendKeys)
                    .join(function (enter) {
                    var li = enter.append('li').attr('class', 'legend-item');
                    li.insert('span')
                        .attr('class', 'legend-key')
                        .style('background-color', function (d) { return _this.colorRange(d.label); });
                    li.insert('span', '.legend-item')
                        .attr('class', 'legend-label')
                        .html(function (d) {
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.label);
                            case 'time':
                                var parsedTime = d3TimeFormat.isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    });
                    return li;
                }, function (update) {
                    update.select('.legend-label').html(function (d) {
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.label);
                            case 'time':
                                var parsedTime = d3TimeFormat.isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    });
                    return update;
                }, function (exit) { return exit.remove(); })
                    .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3Selection.event, data, index, nodes); })
                    .on('mouseout', function () { return _this.legendMouseOut(); })
                    .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3Selection.event, data, index, nodes); });
            }
        };
        return PbdsDatavizBarGroupedComponent;
    }());
    PbdsDatavizBarGroupedComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-bar-grouped',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    PbdsDatavizBarGroupedComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: i0.ElementRef },
        { type: common.ViewportScroller },
        { type: common.Location }
    ]; };
    PbdsDatavizBarGroupedComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        groupedBarClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-bar-grouped',] }],
        data: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        height: [{ type: i0.Input }],
        vertical: [{ type: i0.Input }],
        hideXAxis: [{ type: i0.Input }],
        xAxisMaxBuffer: [{ type: i0.Input }],
        xAxisFormatType: [{ type: i0.Input }],
        xAxisFormatString: [{ type: i0.Input }],
        xAxisTicks: [{ type: i0.Input }],
        hideYAxis: [{ type: i0.Input }],
        yAxisMaxBuffer: [{ type: i0.Input }],
        yAxisFormatType: [{ type: i0.Input }],
        yAxisFormatString: [{ type: i0.Input }],
        yAxisTicks: [{ type: i0.Input }],
        marginTop: [{ type: i0.Input }],
        marginRight: [{ type: i0.Input }],
        marginBottom: [{ type: i0.Input }],
        marginLeft: [{ type: i0.Input }],
        hideLegend: [{ type: i0.Input }],
        legendWidth: [{ type: i0.Input }],
        legendPosition: [{ type: i0.Input }],
        legendLabelFormatType: [{ type: i0.Input }],
        legendLabelFormatString: [{ type: i0.Input }],
        hideTooltip: [{ type: i0.Input }],
        tooltipLabelFormatType: [{ type: i0.Input }],
        tooltipLabelFormatString: [{ type: i0.Input }],
        tooltipValueFormatType: [{ type: i0.Input }],
        tooltipValueFormatString: [{ type: i0.Input }],
        showGrid: [{ type: i0.Input }],
        theme: [{ type: i0.Input }],
        hovered: [{ type: i0.Output }],
        clicked: [{ type: i0.Output }]
    };

    var PbdsDatavizBarSingleHorizontalComponent = /** @class */ (function () {
        function PbdsDatavizBarSingleHorizontalComponent(_dataviz, _element, _scroll, _location) {
            var _this = this;
            this._dataviz = _dataviz;
            this._element = _element;
            this._scroll = _scroll;
            this._location = _location;
            this.chartClass = true;
            this.singleStackedBarClass = true;
            this.width = 300;
            this.height = 40;
            this.nullValueText = 'No data available';
            this.percentage = false;
            this.marginTop = 10;
            this.marginRight = 20;
            this.marginBottom = 35;
            this.marginLeft = 15;
            this.barMargin = 2;
            this.hideXAxis = false;
            this.xAxisTicks = 6;
            this.xAxisTitle = null;
            this.xAxisFormatType = null;
            this.xAxisFormatString = '';
            this.xAxisTickLabelSuffix = '';
            this.hideXGrid = false;
            this.hideLegend = false;
            this.hideLegendTooltip = true;
            this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
            this.legendPosition = 'bottom';
            this.legendLabelFormatType = null;
            this.legendLabelFormatString = '';
            this.hideTooltip = false;
            this.tooltipLabelFormatType = null;
            this.tooltipLabelFormatString = '';
            this.tooltipDateFormatString = '%b %e, %Y';
            this.tooltipValueFormatType = null;
            this.tooltipValueFormatString = '';
            this.tooltipValueSuffix = '';
            this.tooltipPercentFormatString = '.2%';
            this.compareChangeFormatString = '.2%';
            this.monochrome = false;
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.isSingleData = false;
            this.isCompare = false;
            this.barPadding = 40;
            this.barMouseOver = function (event, data, index, nodes) {
                var node = d3Selection.select(nodes[index]);
                _this.chart.selectAll('.bar').classed('inactive', true);
                node.classed('inactive', false);
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) {
                    // debugger;
                    return i !== index;
                })
                    .classed('inactive', true);
                _this.tooltipShow(data, nodes[index]);
                _this.hovered.emit({ event: event, data: data });
            };
            this.barMouseOut = function () {
                _this.chart
                    .selectAll('.bar')
                    .classed('inactive', false)
                    .style('fill', null);
                _this.chart.selectAll('.legend-item').classed('inactive', false);
                _this.tooltipHide();
            };
            this.barMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.tooltipShow = function (data, node) {
                var dimensions = node.getBoundingClientRect();
                var scroll = _this._scroll.getScrollPosition();
                var percentage = data.value / d3Array.sum(_this.data, function (d) { return d.value; });
                var comparePercentage = data.compareValue / d3Array.sum(_this.data, function (d) { return d.compareValue; });
                var tooltipLabel = "";
                var tooltipCompareDaterangeMargin = "";
                var tooltipCompareDaterange = "";
                var tooltipCompareValue = "";
                var tooltipDaterangeMargin = "";
                var tooltipDaterange = "";
                var tooltipValue = "" + _this.nullValueText;
                var tooltipIndicator = '';
                // tooltip label
                if (!_this.isSingleData) {
                    _this.tooltip.classed('pbds-tooltip-compare', null);
                    switch (_this.tooltipLabelFormatType) {
                        case 'number':
                            tooltipLabel = _this.tooltipLabelFormat(data.label);
                            break;
                        case 'time':
                            var parsedTime = d3TimeFormat.isoParse(data.label);
                            tooltipLabel = _this.tooltipLabelFormat(parsedTime);
                            break;
                        default:
                            tooltipLabel = data.label;
                    }
                }
                // tooltip compare daterange
                if (_this.isCompare && data.compareStartDate && data.compareEndDate) {
                    _this.tooltip.classed('pbds-tooltip-compare', _this.isCompare);
                    tooltipCompareDaterangeMargin = "mt-2";
                    tooltipCompareDaterange = _this.tooltipDateFormat(d3TimeFormat.isoParse(data.compareStartDate)) + " - " + _this.tooltipDateFormat(d3TimeFormat.isoParse(data.compareEndDate));
                }
                // tooltip compare value
                if (_this.percentage && _this.isCompare && data.compareValue) {
                    tooltipCompareValue =
                        _this.tooltipValueFormat === null
                            ? _this.tooltipPercentFormat(comparePercentage) + " (" + data.comparveValue + _this.tooltipValueSuffix + ")"
                            : _this.tooltipPercentFormat(comparePercentage) + " (" + _this.tooltipValueFormat(data.compareValue) + _this.tooltipValueSuffix + ")";
                }
                else if (_this.isCompare && data.compareValue !== null) {
                    tooltipCompareValue =
                        _this.tooltipValueFormat === null
                            ? "" + data.compareValue + _this.tooltipValueSuffix + " (" + _this.tooltipPercentFormat(comparePercentage) + ")"
                            : "" + _this.tooltipValueFormat(data.compareValue) + _this.tooltipValueSuffix + " (" + _this.tooltipPercentFormat(comparePercentage) + ")";
                }
                else if (_this.isCompare && data.compareValue === null) {
                    tooltipCompareValue = "" + _this.nullValueText;
                }
                // tooltip daterange
                if (data.startDate && data.endDate) {
                    tooltipDaterange = _this.tooltipDateFormat(d3TimeFormat.isoParse(data.startDate)) + " - " + _this.tooltipDateFormat(d3TimeFormat.isoParse(data.endDate));
                }
                //tooltip daterange margin
                if (tooltipLabel !== '') {
                    tooltipDaterangeMargin = "mt-2";
                }
                // tooltip value
                if (_this.isSingleData && _this.percentage && data.value) {
                    tooltipValue = _this.tooltipValueFormat === null ? "" + data.value : "" + _this.tooltipValueFormat(data.value);
                }
                else if (_this.isSingleData && data.value !== null) {
                    tooltipValue =
                        _this.tooltipValueFormat === null
                            ? "" + data.value + _this.tooltipValueSuffix
                            : "" + _this.tooltipValueFormat(data.value) + _this.tooltipValueSuffix;
                }
                else if (!_this.isSingleData && _this.percentage && data.value !== null) {
                    tooltipValue =
                        _this.tooltipValueFormat === null
                            ? _this.tooltipPercentFormat(percentage) + " (" + data.value + _this.tooltipValueSuffix + ")"
                            : _this.tooltipPercentFormat(percentage) + " (" + _this.tooltipValueFormat(data.value) + _this.tooltipValueSuffix + ")";
                }
                else if (!_this.isSingleData && data.value !== null) {
                    tooltipValue =
                        _this.tooltipValueFormat === null
                            ? "" + data.value + _this.tooltipValueSuffix + " (" + _this.tooltipPercentFormat(percentage) + ")"
                            : "" + _this.tooltipValueFormat(data.value) + _this.tooltipValueSuffix + " (" + _this.tooltipPercentFormat(percentage) + ")";
                }
                // tooltip metric indicator
                if (!_this.isSingleData && _this.isCompare && data.value !== null && data.compareValue !== null) {
                    tooltipIndicator = "<div class=\"metric-block-indicator " + data.compareChangeDirection + " " + (data.compareChangeInverse ? 'inverse' : '') + " ml-2\"><span>" + _this.tooltipCompareChangeFormat(data.compareChangeValue) + "</span></div>";
                }
                _this.tooltip.html(function () {
                    return "\n        <div class=\"tooltip-label font-weight-bold\">" + tooltipLabel + "</div>\n        <div class=\"" + tooltipCompareDaterangeMargin + "\">" + tooltipCompareDaterange + "</div>\n        <div class=\"tooltip-value font-weight-bold\">" + tooltipCompareValue + "</div>\n        <div class=\"" + tooltipDaterangeMargin + "\">" + tooltipDaterange + "</div>\n        <div class=\"tooltip-value\"><span class=\"font-weight-bold\">" + tooltipValue + "</span> <span>" + tooltipIndicator + "</span></div>\n      ";
                });
                var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
                var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight;
                var tooltipTipSize = 8;
                _this.tooltip.style('top', +scroll[1] + +dimensions.top - tooltipOffsetHeight - tooltipTipSize + "px");
                if (_this.data.length > 1) {
                    _this.tooltip.style('left', +scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2 + "px");
                }
                else {
                    _this.tooltip.style('left', +scroll[0] - tooltipOffsetWidth + +dimensions.right + "px");
                }
                _this.tooltip.style('opacity', 1);
            };
            this.tooltipHide = function () {
                _this.tooltip.style('opacity', 0);
            };
            this.legendMouseOver = function (event, data, index, nodes) {
                if (!_this.hideLegendTooltip) {
                    var barHover = _this.svg
                        .selectAll('.bar')
                        .filter(function (d, i) { return i === index; })
                        .node();
                    _this.tooltipShow(data, barHover);
                }
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.chart
                    .selectAll('.bar')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.chart
                    .selectAll('.bar')
                    .filter(function (d, i) { return i === index; })
                    .classed('inactive', null);
                _this.hovered.emit({ event: event, data: data });
            };
            this.legendMouseOut = function () {
                _this.chart.selectAll('.legend-item').classed('inactive', false);
                _this.chart
                    .selectAll('.bar')
                    .classed('inactive', false)
                    .style('fill', null);
                // hide tooltip for zero/null values
                _this.tooltipHide();
            };
            this.legendMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.xAxisFormatter = function (item) {
                switch (_this.xAxisFormatType) {
                    case 'number':
                        return "" + _this.xAxisFormat(item) + _this.xAxisTickLabelSuffix;
                    default:
                        return "" + item + _this.xAxisTickLabelSuffix;
                }
            };
        }
        PbdsDatavizBarSingleHorizontalComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.height = +this.height + this.barPadding;
            this.margin = {
                top: +this.marginTop,
                right: +this.marginRight,
                bottom: +this.marginBottom,
                left: +this.marginLeft
            };
            this.isSingleData = this.data.length === 1 ? true : false;
            this.isCompare = Object.keys(this.data[0]).includes('compareValue');
            // create formatters
            this.xAxisFormat = this._dataviz.d3Format(this.xAxisFormatType, this.xAxisFormatString);
            this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
            this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
            this.tooltipDateFormat = d3TimeFormat.timeFormat(this.tooltipDateFormatString);
            this.tooltipPercentFormat = d3Format.format(this.tooltipPercentFormatString);
            this.tooltipCompareChangeFormat = d3Format.format(this.compareChangeFormatString);
            // defaults for all chart types
            this.hideXAxisZero = false;
            this.hideXAxisDomain = true;
            this.hideXAxisTicks = true;
            this.xAxisTickSize = 8;
            this.xAxisTickSizeOuter = 0;
            this.xAxisTitleMargin = this.xAxisTitle ? 20 : 0;
            if (!this.hideLegend && this.legendPosition === 'right') {
                this.width = +this.width - +this.legendWidth;
            }
            // create the chart
            this.chart = d3Selection.select(this._element.nativeElement).attr('aria-hidden', 'true');
            // create chart svg
            this.svg = this.chart
                .append('svg')
                .attr('width', function () {
                return +_this.width + _this.margin.left + _this.margin.right;
            })
                .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
                .attr('class', 'img-fluid')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', function () {
                return "-" + _this.margin.left + " -" + _this.margin.top + " " + (+_this.width + _this.margin.left + _this.margin.right) + " " + (+_this
                    .height +
                    _this.margin.top +
                    _this.margin.bottom +
                    _this.xAxisTitleMargin);
            });
            // TOOLTIP
            if (!this.hideTooltip) {
                this.tooltip = d3Selection.select('body')
                    .append('div')
                    .attr('class', 'pbds-tooltip south')
                    .classed('pbds-tooltip-compare', this.isCompare)
                    .style('opacity', 0)
                    .attr('aria-hidden', 'true'); // hide tooltip for accessibility
            }
            // add legend classes
            if (!this.hideLegend && this.data.length > 1) {
                this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
                this.chart.append('ul').attr('class', "legend legend-" + this.legendPosition);
            }
            // X AXIS
            this.xAxisScale = d3Scale.scaleLinear()
                .domain([0, Math.ceil(d3Array.sum(this.data, function (d) { return d.value; }))])
                .range([0, +this.width]);
            this.xAxisCall = d3Axis.axisBottom(this.xAxisScale)
                // .tickValues([0, d3_sum(this.data, (d: any) => d.value)])
                .ticks(this.xAxisTicks)
                .tickSize(this.xAxisTickSize)
                .tickSizeOuter(this.xAxisTickSizeOuter)
                .tickFormat(this.xAxisFormatter);
            this.xAxis = this.svg
                .append('g')
                .attr('class', 'axis axis-x')
                .attr('transform', "translate(0, " + this.height + ")")
                .classed('axis-hidden', this.hideXAxis)
                .classed('axis-zero-hidden', this.hideXAxisZero)
                .classed('axis-domain-hidden', this.hideXAxisDomain)
                .classed('axis-ticks-hidden', this.hideXAxisTicks);
            // .call(this.xAxisCall);
            // X GRIDLINES
            if (!this.hideXGrid) {
                this.xGridCall = d3Axis.axisBottom(this.xAxisScale).tickSize(-this.height);
                this.xGrid = this.svg
                    .append('g')
                    .attr('class', 'grid grid-x')
                    .classed('grid-zero-hidden', this.hideXAxisZero)
                    .attr('transform', "translate(0, " + this.height + ")")
                    .call(this.xGridCall);
            }
            if (this.xAxisTitle) {
                this.svg
                    .append('text')
                    .attr('class', 'axis-title')
                    .attr('text-anchor', 'center')
                    .attr('x', this.width / 2 - this.margin.left)
                    .attr('y', this.height + this.margin.top + (!this.hideXAxis ? 40 : 0))
                    .text(this.xAxisTitle);
            }
            // build color ranges
            var colors;
            if (this.isSingleData) {
                colors = this._dataviz.createGradientDefs(this.svg, this.monochrome, this.theme, false);
            }
            else if (this.monochrome) {
                colors = this._dataviz.getColors(this.monochrome, this.theme).reverse();
            }
            else {
                colors = this._dataviz.getColors(this.monochrome, this.theme);
            }
            this.colorRange = d3Scale.scaleOrdinal().range(colors);
            this.updateChart();
        };
        PbdsDatavizBarSingleHorizontalComponent.prototype.ngOnChanges = function (changes) {
            if (changes.data && !changes.data.firstChange) {
                this.updateChart();
            }
        };
        PbdsDatavizBarSingleHorizontalComponent.prototype.ngOnDestroy = function () {
            if (this.tooltip)
                this.tooltip.remove();
        };
        PbdsDatavizBarSingleHorizontalComponent.prototype.updateChart = function () {
            var _this = this;
            this.isSingleData = this.data.length === 1 ? true : false;
            this.isCompare = Object.keys(this.data[0]).includes('compareValue');
            var sumValues = d3Array.sum(this.data, function (d) { return d.value; });
            var isLastBarZero = this.data[this.data.length - 1].value === 0 || this.data[this.data.length - 1].value === null ? true : false;
            var lastBarZeroCount = 0;
            var cloneData = __spread(this.data);
            var isLast = false;
            cloneData.reverse().forEach(function (value, index, array) {
                if ((value.value === 0 || value.value === null) && !isLast) {
                    lastBarZeroCount++;
                }
                else {
                    isLast = true;
                }
            });
            if (this.percentage && !this.isSingleData) {
                this.xAxisScale.domain([0, sumValues]).range([0, +this.width]);
                this.xAxisCall.tickValues([0, sumValues * 0.25, sumValues * 0.5, sumValues * 0.75, sumValues]);
                this.xAxis.call(this.xAxisCall);
                this.xGridCall.tickValues([0, sumValues * 0.25, sumValues * 0.5, sumValues * 0.75, sumValues]);
                this.xGrid.call(this.xGridCall);
                this.svg
                    .select('.axis-x')
                    .selectAll('text')
                    .html(function (d, i) {
                    var format = d3Format.format('.0%');
                    return format(i * 0.25);
                });
            }
            else if (this.percentage && this.isSingleData) {
                this.xAxisScale.domain([0, 1.0]).range([0, +this.width]);
                this.xAxisCall.tickValues([0, 0.25, 0.5, 0.75, 1.0]);
                this.xAxis.call(this.xAxisCall);
                this.xGridCall.tickValues([0, 0.25, 0.5, 0.75, 1.0]);
                this.xGrid.call(this.xGridCall);
                this.svg
                    .select('.axis-x')
                    .selectAll('text')
                    .html(function (d, i) {
                    var format = d3Format.format('.0%');
                    return format(i * 0.25);
                });
            }
            else {
                this.xAxisScale.domain([0, Math.ceil(sumValues)]).range([0, +this.width]);
                this.xGridCall.tickValues(this.xAxisScale.ticks().filter(function (n) { return Number.isInteger(n); })); // remove decimal grid values
                this.xAxis
                    .transition()
                    .duration(1000)
                    .call(this.xAxisCall);
                // update the grids
                if (!this.hideXGrid) {
                    this.xGrid
                        .transition()
                        .duration(1000)
                        .call(this.xGridCall);
                }
            }
            this.svg
                .selectAll('.bar')
                .data(this.data)
                .join(function (enter) { return enter
                .append('rect')
                .attr('class', 'bar')
                .attr('width', 0)
                .attr('height', function () {
                return _this.height - _this.barPadding;
            })
                .attr('fill', function (d) {
                if (_this.isSingleData) {
                    return "url(" + _this._location.path() + "#gradient-horizontal-" + _this.colorRange(d.label).substr(1) + ")";
                }
                else {
                    return _this.colorRange(d.label);
                }
            })
                .attr('y', function () {
                return _this.barPadding / 2;
            })
                .attr('x', function (d, i) {
                return _this.data.slice(0, i).reduce(function (acc, item) {
                    // console.log(acc, item, acc + this.xAxisScale(item.value) + this.barMargin);
                    return +acc + +_this.xAxisScale(item.value);
                }, 1);
            })
                .attr('pointer-events', 'none')
                .call(function (enter) {
                return (enter
                    .transition()
                    // .duration(0)
                    .delay(function (d, i) { return i * 250; })
                    .ease(d3Ease.easeLinear)
                    .attr('width', function (d, i) {
                    // debugger;
                    if (i === _this.data.length - lastBarZeroCount - 1 && isLastBarZero) {
                        return _this.xAxisScale(d.value);
                    }
                    else if (i !== _this.data.length - 1) {
                        var width = _this.xAxisScale(d.value) - +_this.barMargin;
                        width = Math.sign(width) === -1 ? 0 : width; // handle negative values
                        return width;
                    }
                    else {
                        return _this.xAxisScale(d.value);
                    }
                })
                    .transition()
                    .attr('pointer-events', 'auto'));
            }); }, function (update) { return update
                .attr('pointer-events', 'none')
                .transition()
                .duration(1000)
                .attr('width', function (d, i) {
                // debugger;
                if (d.value === null || d.value === 0) {
                    return _this.xAxisScale(0);
                }
                else if (i === _this.data.length - 1) {
                    return _this.xAxisScale(d.value);
                }
                else {
                    return _this.xAxisScale(d.value) - _this.barMargin;
                }
            })
                .attr('x', function (d, i) {
                return _this.data.slice(0, i).reduce(function (acc, item) {
                    return acc + +_this.xAxisScale(item.value);
                }, 0);
            })
                .transition()
                .attr('pointer-events', 'auto'); }, function (exit) { return exit
                .transition()
                .attr('pointer-events', 'none')
                .remove(); })
                .on('mouseover', function (data, index, nodes) { return _this.barMouseOver(d3Selection.event, data, index, nodes); })
                .on('mouseout', function (data, index, nodes) { return _this.barMouseOut(); })
                .on('click', function (data, index, nodes) { return _this.barMouseClick(d3Selection.event, data, index, nodes); });
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.data)
                    .join(function (enter) {
                    var li = enter
                        .append('li')
                        .attr('class', 'legend-item')
                        .classed('align-items-start', _this.isCompare);
                    li.insert('span')
                        .attr('class', 'legend-key')
                        .style('background-color', function (d) { return _this.colorRange(d.label); })
                        .classed('mt-1', _this.isCompare);
                    li.insert('span')
                        .attr('class', 'legend-description')
                        .classed('d-flex', _this.isCompare)
                        .classed('flex-column', _this.isCompare);
                    li.select('.legend-description')
                        .insert('span')
                        .attr('class', 'legend-label')
                        .html(function (d) {
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.label);
                            case 'time':
                                var parsedTime = d3TimeFormat.isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    });
                    li.select('.legend-description')
                        .insert('div')
                        .attr('class', 'legend-change')
                        .classed('d-none', !_this.isCompare);
                    li.select('.legend-change').html(function (d) {
                        return "<div class=\"metric-block-indicator " + d.compareChangeDirection + " " + (d.compareChangeInverse ? 'inverse' : '') + " mt-1\"><span>" + _this.tooltipCompareChangeFormat(d.compareChangeValue) + "</span></div>";
                    });
                    return li;
                }, function (update) {
                    update.classed('align-items-start', _this.isCompare);
                    update.select('.legend-key').classed('mt-1', _this.isCompare);
                    update.select('.legend-change').classed('d-none', !_this.isCompare);
                    if (_this.isCompare) {
                        update.select('.legend-change').html(function (d) {
                            return "<div class=\"metric-block-indicator " + d.compareChangeDirection + " " + (d.compareChangeInverse ? 'inverse' : '') + " mt-1\"><span>" + _this.tooltipCompareChangeFormat(d.compareChangeValue) + "</span></div>";
                        });
                    }
                    update.select('.legend-label').html(function (d) {
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.label);
                            case 'time':
                                var parsedTime = d3TimeFormat.isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    });
                    return update;
                }, function (exit) { return exit.remove(); })
                    .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3Selection.event, data, index, nodes); })
                    .on('mouseout', function () { return _this.legendMouseOut(); })
                    .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3Selection.event, data, index, nodes); });
            }
        };
        return PbdsDatavizBarSingleHorizontalComponent;
    }());
    PbdsDatavizBarSingleHorizontalComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-dataviz-bar-single-horizontal',
                    template: "",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    PbdsDatavizBarSingleHorizontalComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: i0.ElementRef },
        { type: common.ViewportScroller },
        { type: common.Location }
    ]; };
    PbdsDatavizBarSingleHorizontalComponent.propDecorators = {
        chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
        singleStackedBarClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-bar-single-horizontal',] }],
        data: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        height: [{ type: i0.Input }],
        nullValueText: [{ type: i0.Input }],
        percentage: [{ type: i0.Input }],
        marginTop: [{ type: i0.Input }],
        marginRight: [{ type: i0.Input }],
        marginBottom: [{ type: i0.Input }],
        marginLeft: [{ type: i0.Input }],
        barMargin: [{ type: i0.Input }],
        hideXAxis: [{ type: i0.Input }],
        xAxisTicks: [{ type: i0.Input }],
        xAxisTitle: [{ type: i0.Input }],
        xAxisFormatType: [{ type: i0.Input }],
        xAxisFormatString: [{ type: i0.Input }],
        xAxisTickLabelSuffix: [{ type: i0.Input }],
        hideXGrid: [{ type: i0.Input }],
        hideLegend: [{ type: i0.Input }],
        hideLegendTooltip: [{ type: i0.Input }],
        legendWidth: [{ type: i0.Input }],
        legendPosition: [{ type: i0.Input }],
        legendLabelFormatType: [{ type: i0.Input }],
        legendLabelFormatString: [{ type: i0.Input }],
        hideTooltip: [{ type: i0.Input }],
        tooltipLabelFormatType: [{ type: i0.Input }],
        tooltipLabelFormatString: [{ type: i0.Input }],
        tooltipDateFormatString: [{ type: i0.Input }],
        tooltipValueFormatType: [{ type: i0.Input }],
        tooltipValueFormatString: [{ type: i0.Input }],
        tooltipValueSuffix: [{ type: i0.Input }],
        tooltipPercentFormatString: [{ type: i0.Input }],
        compareChangeFormatString: [{ type: i0.Input }],
        monochrome: [{ type: i0.Input }],
        theme: [{ type: i0.Input }],
        hovered: [{ type: i0.Output }],
        clicked: [{ type: i0.Output }]
    };

    var PbdsDatavizModule = /** @class */ (function () {
        function PbdsDatavizModule() {
        }
        return PbdsDatavizModule;
    }());
    PbdsDatavizModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [
                        PbdsDatavizPieComponent,
                        PbdsDatavizBarComponent,
                        PbdsDatavizLineComponent,
                        PbdsDatavizGaugeComponent,
                        PbdsDatavizSparklineComponent,
                        PbdsDatavizBarStackedComponent,
                        PbdsDatavizMetricBlockComponent,
                        DatavizBubbleMapComponent,
                        PbdsDatavizMetricIndicatorComponent,
                        PbdsDatavizHeatmapComponent,
                        PbdsDatavizChoroplethMapComponent,
                        PbdsDatavizBarGroupedComponent,
                        PbdsDatavizBarSingleHorizontalComponent
                    ],
                    imports: [common.CommonModule, ngBootstrap.NgbTooltipModule],
                    exports: [
                        PbdsDatavizPieComponent,
                        PbdsDatavizBarComponent,
                        PbdsDatavizLineComponent,
                        PbdsDatavizGaugeComponent,
                        PbdsDatavizSparklineComponent,
                        PbdsDatavizBarStackedComponent,
                        PbdsDatavizMetricBlockComponent,
                        DatavizBubbleMapComponent,
                        PbdsDatavizMetricIndicatorComponent,
                        PbdsDatavizHeatmapComponent,
                        PbdsDatavizChoroplethMapComponent,
                        PbdsDatavizBarGroupedComponent,
                        PbdsDatavizBarSingleHorizontalComponent
                    ]
                },] }
    ];

    var PbdsHeaderShadowDirective = /** @class */ (function () {
        function PbdsHeaderShadowDirective(_scroll) {
            this._scroll = _scroll;
        }
        PbdsHeaderShadowDirective.prototype.onWindowScroll = function () {
            var offset = this._scroll.getScrollPosition();
            this.shadow = offset[1] > 20;
        };
        return PbdsHeaderShadowDirective;
    }());
    PbdsHeaderShadowDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'header.bg-brand-header'
                },] }
    ];
    PbdsHeaderShadowDirective.ctorParameters = function () { return [
        { type: common.ViewportScroller }
    ]; };
    PbdsHeaderShadowDirective.propDecorators = {
        shadow: [{ type: i0.HostBinding, args: ['class.pbds-header-shadow',] }],
        onWindowScroll: [{ type: i0.HostListener, args: ['window:scroll', [],] }]
    };

    var PbdsHeaderShadowModule = /** @class */ (function () {
        function PbdsHeaderShadowModule() {
        }
        return PbdsHeaderShadowModule;
    }());
    PbdsHeaderShadowModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [PbdsHeaderShadowDirective],
                    imports: [common.CommonModule],
                    exports: [PbdsHeaderShadowDirective]
                },] }
    ];

    var PbdsDaterangeService = /** @class */ (function () {
        function PbdsDaterangeService(localeId) {
            this.localeId = localeId;
            this.locale = this.localeId.toLowerCase();
        }
        PbdsDaterangeService.prototype.setLocale = function (locale) {
            this.locale = (locale.language + "-" + locale.country).toLowerCase();
            // set the angular LOCALE_ID dynamically for ng-bootstrap datepicker
            common.registerLocaleData(locale.locale, this.locale);
        };
        PbdsDaterangeService.prototype.getCurrentLocale = function () {
            return this.locale;
        };
        return PbdsDaterangeService;
    }());
    PbdsDaterangeService.ɵprov = i0.ɵɵdefineInjectable({ factory: function PbdsDaterangeService_Factory() { return new PbdsDaterangeService(i0.ɵɵinject(i0.LOCALE_ID)); }, token: PbdsDaterangeService, providedIn: "root" });
    PbdsDaterangeService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    PbdsDaterangeService.ctorParameters = function () { return [
        { type: String, decorators: [{ type: i0.Inject, args: [i0.LOCALE_ID,] }] }
    ]; };

    // Define custom service providing the months and weekdays translations
    var CustomDatepickerI18n = /** @class */ (function (_super) {
        __extends(CustomDatepickerI18n, _super);
        function CustomDatepickerI18n(daterangeService) {
            var _this = _super.call(this) || this;
            _this.daterangeService = daterangeService;
            return _this;
        }
        CustomDatepickerI18n.prototype.getWeekdayShortName = function (weekday) {
            // for ng-bootstrap, sunday number of 7 converted to 0
            weekday = weekday === 7 ? 0 : weekday;
            // console.log(
            //   'weekday: ',
            //   this.daterangeService.getCurrentLocale(),
            //   weekday,
            //   getLocaleDayNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Abbreviated)[weekday]
            // );
            return common.getLocaleDayNames(this.daterangeService.getCurrentLocale(), common.FormStyle.Standalone, common.TranslationWidth.Abbreviated)[weekday];
        };
        CustomDatepickerI18n.prototype.getMonthShortName = function (month) {
            return common.getLocaleMonthNames(this.daterangeService.getCurrentLocale(), common.FormStyle.Standalone, common.TranslationWidth.Wide)[month - 1];
        };
        CustomDatepickerI18n.prototype.getMonthFullName = function (month) {
            return common.getLocaleMonthNames(this.daterangeService.getCurrentLocale(), common.FormStyle.Standalone, common.TranslationWidth.Wide)[month - 1];
        };
        CustomDatepickerI18n.prototype.getDayAriaLabel = function (date) {
            return date.day + "-" + date.month + "-" + date.year;
        };
        return CustomDatepickerI18n;
    }(ngBootstrap.NgbDatepickerI18n));
    CustomDatepickerI18n.decorators = [
        { type: i0.Injectable }
    ];
    CustomDatepickerI18n.ctorParameters = function () { return [
        { type: PbdsDaterangeService }
    ]; };
    var PbdsDaterangePopoverComponent = /** @class */ (function () {
        function PbdsDaterangePopoverComponent(calendar, daterangeService) {
            var _this = this;
            this.calendar = calendar;
            this.daterangeService = daterangeService;
            this.presets = [
                {
                    label: 'All Dates',
                    value: null
                },
                {
                    label: 'Last 7 Days',
                    value: 7
                },
                {
                    label: 'Last 30 Days',
                    value: 30
                },
                {
                    label: 'Year to Date',
                    value: 365
                }
            ];
            this.presetSelected = null;
            this.filterSelected = 0;
            this.showCustomPreset = true;
            this.applyText = 'Apply';
            this.cancelText = 'Cancel';
            this.customRangeText = 'Custom Range';
            this.minDate = this.calendar.getPrev(this.calendar.getToday(), 'y');
            this.maxDate = this.calendar.getToday();
            this.fromDate = null;
            this.toDate = null;
            this.inputFormat = '{fromDate} to {toDate}';
            this.change = new i0.EventEmitter();
            this.firstDayOfWeek = common.getLocaleFirstDayOfWeek(this.daterangeService.getCurrentLocale());
            this.dateRange = '';
            this.isDatepickerVisible = false;
            this.presetSelect = function ($event) {
                if ($event.value === 'custom') {
                    _this.presetSelected = 'custom';
                    return false;
                }
                if ($event.value) {
                    _this.toDate = _this.calendar.getToday();
                    _this.fromDate = _this.calendar.getPrev(_this.toDate, 'd', $event.value);
                    _this.presetSelected = $event.value;
                }
                else {
                    _this.fromDate = null;
                    _this.toDate = null;
                    _this.presetSelected = null;
                }
                _this.isDatepickerVisible = false;
            };
            this.isHovered = function (date) { return _this.fromDate && !_this.toDate && _this.hoveredDate && date.after(_this.fromDate) && date.before(_this.hoveredDate); };
            this.isInside = function (date) { return date.after(_this.fromDate) && date.before(_this.toDate); };
            this.isRange = function (date) { return date.equals(_this.fromDate) || date.equals(_this.toDate) || _this.isInside(date) || _this.isHovered(date); };
        }
        PbdsDaterangePopoverComponent.prototype.ngOnInit = function () {
            // china should start on a Monday, Angular locale returns incorrect 0
            this.firstDayOfWeek =
                this.daterangeService.getCurrentLocale() === 'zh-cn' ? this.firstDayOfWeek + 1 : this.firstDayOfWeek;
            if (this.presetSelected === 'custom') {
                this.showDatepicker();
            }
        };
        PbdsDaterangePopoverComponent.prototype.ngOnChanges = function (changes) {
            var _this = this;
            if (changes.filters && this.filters) {
                this.selectedFilter = this.filters[this.filterSelected];
            }
            if (changes.presets) {
                if (!this.filters && this.presetSelected) {
                    this.presetClick(this.presets.find(function (p) { return p.value === _this.presetSelected; }));
                }
                else if (this.presetSelected) {
                    this.presetSelect({ value: this.presetSelected });
                    this.apply();
                }
            }
            // if (changes.toText && changes.toText.firstChange === false) {
            //   this.setInputLabel();
            // }
            this.setInputLabel();
        };
        PbdsDaterangePopoverComponent.prototype.apply = function () {
            this.setInputLabel();
            this.change.emit({
                fromDate: this.fromDate,
                toDate: this.toDate,
                formattedDate: this.isDatepickerVisible ? this.dateFormat() : this.dateRange,
                filter: this.filters ? this.selectedFilter.field : null,
                value: this.presetSelected
            });
            this.datepickerPopup.close();
        };
        PbdsDaterangePopoverComponent.prototype.cancel = function () {
            this.datepickerPopup.close();
        };
        PbdsDaterangePopoverComponent.prototype.onDateSelection = function (date) {
            if (!this.fromDate && !this.toDate) {
                this.fromDate = date;
            }
            else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
                this.toDate = date;
            }
            else {
                this.toDate = null;
                this.fromDate = date;
            }
            // this.presetSelected = null;
        };
        PbdsDaterangePopoverComponent.prototype.presetClick = function (preset) {
            // console.log('PRESET CLICK: ', preset);
            if (preset) {
                if (preset.value === 'custom') {
                    return false;
                }
                if (preset.value) {
                    this.toDate = this.calendar.getToday();
                    this.fromDate = this.calendar.getPrev(this.toDate, 'd', preset.value);
                    this.presetSelected = preset.value;
                }
                else {
                    this.fromDate = null;
                    this.toDate = null;
                    this.presetSelected = null;
                }
                this.isDatepickerVisible = false;
                this.apply();
            }
        };
        PbdsDaterangePopoverComponent.prototype.getFormattedDate = function (date) {
            if (date) {
                var locale = this.daterangeService.getCurrentLocale();
                var dateFormat = common.getLocaleDateFormat(locale, common.FormatWidth.Short);
                var formattedDate = common.formatDate(date.month + "/" + date.day + "/" + date.year, dateFormat, locale);
                return formattedDate;
            }
        };
        PbdsDaterangePopoverComponent.prototype.showDatepicker = function () {
            this.isDatepickerVisible = true;
            this.presetSelect({ value: 'custom' });
        };
        PbdsDaterangePopoverComponent.prototype.onFilterChange = function (filter, index) {
            this.selectedFilter = this.filters[index];
        };
        PbdsDaterangePopoverComponent.prototype.setPreset = function (value) {
            this.presetSelected = value;
            this.presetSelect({ value: this.presetSelected });
            this.apply();
        };
        PbdsDaterangePopoverComponent.prototype.setFilter = function (index) {
            if (this.filters !== undefined) {
                this.selectedFilter = this.filters[index];
            }
        };
        PbdsDaterangePopoverComponent.prototype.setDateRange = function (value) {
            this.fromDate = new ngBootstrap.NgbDate(value.fromDate.year, value.fromDate.month, value.fromDate.day);
            this.toDate = new ngBootstrap.NgbDate(value.toDate.year, value.toDate.month, value.toDate.day);
            this.isDatepickerVisible = value.value === 'custom';
            this.presetSelected = value.value;
            if (this.filters) {
                this.filterSelected = this.filters.findIndex(function (f) { return f.field === value.filter; });
                this.selectedFilter = this.filters[this.filterSelected];
            }
            this.apply();
        };
        PbdsDaterangePopoverComponent.prototype.setInputLabel = function () {
            var _this = this;
            if (this.presets) {
                var selected = this.presets.find(function (p) { return p.value === _this.presetSelected; });
                if (selected) {
                    if (this.fromDate === null || this.toDate === null) {
                        this.dateRange = selected.label;
                    }
                    else if (this.presetSelected === null || (this.presetSelected !== null && this.presetSelected !== 'custom')) {
                        this.dateRange = selected.label;
                    }
                    else {
                        this.dateRange = this.dateFormat();
                    }
                }
                else if (this.presetSelected === 'custom' && this.fromDate && this.toDate) {
                    this.dateRange = this.dateFormat();
                }
            }
        };
        PbdsDaterangePopoverComponent.prototype.dateFormat = function () {
            return this.inputFormat
                .replace('{fromDate}', this.getFormattedDate(this.fromDate))
                .replace('{toDate}', this.getFormattedDate(this.toDate));
        };
        return PbdsDaterangePopoverComponent;
    }());
    PbdsDaterangePopoverComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-daterange-popover',
                    template: "<div class=\"input-group pbds-daterange-popover\">\n  <input\n    type=\"text\"\n    class=\"form-control\"\n    aria-describedby=\"daterange-button\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <button\n      class=\"btn btn-secondary\"\n      type=\"button\"\n      id=\"daterange-button\"\n      #datepickerPopup=\"ngbPopover\"\n      [ngbPopover]=\"daterangeContent\"\n      popoverClass=\"daterange-popover\"\n      autoClose=\"outside\"\n      container=\"body\"\n      placement=\"bottom-right auto\"\n      aria-label=\"Open Daterange Picker\"\n    >\n      <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n\n  <ng-template #daterangeContent>\n    <div>\n      <div class=\"d-block d-md-flex\">\n        <div *ngIf=\"isDatepickerVisible\">\n          <ngb-datepicker\n            #datepicker\n            [displayMonths]=\"'2'\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            navigation=\"select\"\n            outsideDays=\"hidden\"\n            [firstDayOfWeek]=\"firstDayOfWeek\"\n            [showWeekdays]=\"true\"\n            [dayTemplate]=\"t\"\n            (select)=\"onDateSelection($event)\"\n          >\n          </ngb-datepicker>\n          <!--  -->\n\n          <ng-template #t let-date let-focused=\"focused\">\n            <span\n              class=\"custom-day\"\n              [class.focused]=\"focused\"\n              [class.range]=\"isRange(date)\"\n              [class.faded]=\"isHovered(date) || isInside(date)\"\n              (mouseenter)=\"hoveredDate = date\"\n              (mouseleave)=\"hoveredDate = null\"\n            >\n              {{ date.day }}\n            </span>\n          </ng-template>\n        </div>\n\n        <div\n          class=\"d-flex flex-column justify-content-lg-between mt-md-0\"\n          [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\"\n        >\n          <!-- filters -->\n          <div *ngIf=\"filters\" class=\"mb-3\" ngbDropdown>\n            <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n              {{ selectedFilter.label }}\n            </button>\n            <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n              <button\n                class=\"dropdown-item\"\n                type=\"button\"\n                *ngFor=\"let filter of filters; let index = index\"\n                (click)=\"onFilterChange(filter, index)\"\n              >\n                {{ filter.label }}\n              </button>\n            </div>\n          </div>\n\n          <!-- presets radio buttons-->\n          <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n            <mat-radio-group\n              aria-label=\"Select an option\"\n              class=\"stacked-radio-group\"\n              name=\"presets\"\n              [(ngModel)]=\"presetSelected\"\n              (change)=\"presetSelect($event)\"\n            >\n              <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{\n                preset.label\n              }}</mat-radio-button>\n\n              <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'custom'\" (change)=\"showDatepicker()\">{{\n                customRangeText\n              }}</mat-radio-button>\n            </mat-radio-group>\n          </div>\n\n          <!-- presets buttons-->\n          <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngFor=\"let preset of presets\"\n              (click)=\"presetClick(preset)\"\n            >\n              {{ preset.label }}\n            </button>\n\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngIf=\"showCustomPreset\"\n              (click)=\"showDatepicker()\"\n            >\n              {{ customRangeText }}\n            </button>\n          </div>\n\n          <!-- buttons -->\n          <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n            <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"apply()\">{{ applyText }}</button>\n            <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"cancel()\">\n              {{ cancelText }}\n            </button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </ng-template>\n</div>\n",
                    providers: [{ provide: ngBootstrap.NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
                },] }
    ];
    PbdsDaterangePopoverComponent.ctorParameters = function () { return [
        { type: ngBootstrap.NgbCalendar },
        { type: PbdsDaterangeService }
    ]; };
    PbdsDaterangePopoverComponent.propDecorators = {
        datepickerPopup: [{ type: i0.ViewChild, args: ['datepickerPopup', { static: true },] }],
        presets: [{ type: i0.Input }],
        presetSelected: [{ type: i0.Input }],
        filters: [{ type: i0.Input }],
        filterSelected: [{ type: i0.Input }],
        showCustomPreset: [{ type: i0.Input }],
        applyText: [{ type: i0.Input }],
        cancelText: [{ type: i0.Input }],
        customRangeText: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        fromDate: [{ type: i0.Input }],
        toDate: [{ type: i0.Input }],
        inputFormat: [{ type: i0.Input }],
        change: [{ type: i0.Output }]
    };

    var PbdsDaterangePopoverModule = /** @class */ (function () {
        function PbdsDaterangePopoverModule() {
        }
        return PbdsDaterangePopoverModule;
    }());
    PbdsDaterangePopoverModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [PbdsDaterangePopoverComponent],
                    imports: [common.CommonModule, forms.FormsModule, radio.MatRadioModule, ngBootstrap.NgbDatepickerModule, ngBootstrap.NgbPopoverModule, ngBootstrap.NgbDropdownModule],
                    exports: [PbdsDaterangePopoverComponent]
                },] }
    ];

    var PbdsPageTitleComponent = /** @class */ (function () {
        function PbdsPageTitleComponent() {
            this.layout = 'container';
        }
        return PbdsPageTitleComponent;
    }());
    PbdsPageTitleComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-page-title',
                    template: "<div class=\"page-header\">\n  <div class=\"page-title\" [ngClass]=\"layout\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <h1 [ngClass]=\"{ 'mb-0': sub, 'has-sub': sub }\">{{ ttl }}</h1>\n        <h2>{{ sub }}</h2>\n      </div>\n    </div>\n  </div>\n</div>\n",
                    styles: [".page-header h1.has-sub{margin-bottom:0;margin-top:85px}.page-title h1.mb-0+h2{font-size:16px;line-height:1.4;margin-bottom:25px}"]
                },] }
    ];
    PbdsPageTitleComponent.propDecorators = {
        ttl: [{ type: i0.Input }],
        sub: [{ type: i0.Input }],
        layout: [{ type: i0.Input }]
    };

    var PbdsPageTitleModule = /** @class */ (function () {
        function PbdsPageTitleModule() {
        }
        return PbdsPageTitleModule;
    }());
    PbdsPageTitleModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [PbdsPageTitleComponent],
                    imports: [common.CommonModule],
                    exports: [PbdsPageTitleComponent]
                },] }
    ];

    var PbdsColumnToggleComponent = /** @class */ (function () {
        function PbdsColumnToggleComponent() {
            this.storagekey = false;
            this.minimum = 1;
            this.toggle = new i0.EventEmitter();
        }
        PbdsColumnToggleComponent.prototype.ngOnInit = function () {
            var _this = this;
            if (this.storagekey) {
                this.columnStorage = localStorage.getItem(this.storagekey);
                if (this.columnStorage) {
                    this.columnStorage = JSON.parse(this.columnStorage);
                    this.columns.map(function (column) {
                        var savedColumn = _this.columnStorage.find(function (obj) { return obj.field === column.field; });
                        column.toggle.selected = savedColumn ? savedColumn.toggle.selected : true;
                    });
                }
                this.setLocalStorage();
            }
            this.updateTotalSelected();
        };
        PbdsColumnToggleComponent.prototype.toggleColumn = function (column) {
            // prevent unchecking all columns
            if (this.totalSelected === this.minimum && column.toggle.selected) {
                return;
            }
            column.toggle.selected = !column.toggle.selected;
            if (this.storagekey) {
                this.setLocalStorage();
            }
            this.toggle.emit({
                showAll: false,
                column: column,
                columns: this.columns
            });
            this.updateTotalSelected();
        };
        PbdsColumnToggleComponent.prototype.showAllColumns = function (columnToggleDropdown) {
            this.columns.map(function (column) {
                if (column.toggle.visible) {
                    column.toggle.selected = true;
                }
            });
            if (this.storagekey) {
                this.setLocalStorage();
            }
            this.toggle.emit({
                showAll: true,
                column: null,
                columns: this.columns
            });
            this.updateTotalSelected();
            columnToggleDropdown.close();
        };
        PbdsColumnToggleComponent.prototype.showSelectedIcon = function (column) {
            return column.toggle.selected ? '' : 'invisible';
        };
        PbdsColumnToggleComponent.prototype.setLocalStorage = function () {
            if (this.storagekey) {
                localStorage.setItem(this.storagekey, JSON.stringify(this.columns));
            }
        };
        PbdsColumnToggleComponent.prototype.updateTotalSelected = function () {
            this.totalSelected = this.columns.filter(function (value) { return value.toggle.selected && value.toggle.visible; }).length;
        };
        return PbdsColumnToggleComponent;
    }());
    PbdsColumnToggleComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-column-toggle',
                    template: "<div ngbDropdown #columnToggleDropdown=\"ngbDropdown\" [autoClose]=\"'outside'\" class=\"d-inline-block\">\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\"></i>\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <ng-container *ngFor=\"let column of columns\">\n      <button *ngIf=\"column.toggle.visible\" class=\"dropdown-item\" (click)=\"toggleColumn(column)\">\n        <i class=\"pbi-icon-mini pbi-check small mr-1\" [ngClass]=\"showSelectedIcon(column)\"></i>\n        {{ column.header }}\n      </button>\n    </ng-container>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <button class=\"dropdown-item\" (click)=\"showAllColumns(columnToggleDropdown)\">Show All</button>\n  </div>\n</div>\n"
                },] }
    ];
    PbdsColumnToggleComponent.propDecorators = {
        columns: [{ type: i0.Input }],
        storagekey: [{ type: i0.Input }],
        minimum: [{ type: i0.Input }],
        toggle: [{ type: i0.Output }]
    };

    var PbdsColumnToggleModule = /** @class */ (function () {
        function PbdsColumnToggleModule() {
        }
        return PbdsColumnToggleModule;
    }());
    PbdsColumnToggleModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [PbdsColumnToggleComponent],
                    imports: [common.CommonModule, ngBootstrap.NgbDropdownModule],
                    exports: [PbdsColumnToggleComponent]
                },] }
    ];

    var PbdsComponentsModule = /** @class */ (function () {
        function PbdsComponentsModule() {
        }
        return PbdsComponentsModule;
    }());
    PbdsComponentsModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [],
                    imports: [
                        PbdsDatavizModule,
                        PbdsHeaderShadowModule,
                        PbdsDaterangePopoverModule,
                        PbdsPageTitleModule,
                        PbdsColumnToggleModule
                    ],
                    exports: [
                        PbdsDatavizModule,
                        PbdsHeaderShadowModule,
                        PbdsDaterangePopoverModule,
                        PbdsPageTitleModule,
                        PbdsColumnToggleModule
                    ]
                },] }
    ];

    var public_api = {};

    /**
     * Generated bundle index. Do not edit.
     */

    exports.PbdsComponentsModule = PbdsComponentsModule;
    exports.ɵa = PbdsDatavizModule;
    exports.ɵb = PbdsDatavizPieComponent;
    exports.ɵc = PbdsDatavizService;
    exports.ɵd = PbdsDatavizBarComponent;
    exports.ɵe = PbdsDatavizLineComponent;
    exports.ɵf = PbdsDatavizGaugeComponent;
    exports.ɵg = PbdsDatavizSparklineComponent;
    exports.ɵh = PbdsDatavizBarStackedComponent;
    exports.ɵi = PbdsDatavizMetricBlockComponent;
    exports.ɵj = PbdsDatavizMetricIndicatorComponent;
    exports.ɵk = DatavizBubbleMapComponent;
    exports.ɵl = PbdsDatavizHeatmapComponent;
    exports.ɵm = PbdsDatavizChoroplethMapComponent;
    exports.ɵn = PbdsDatavizBarGroupedComponent;
    exports.ɵo = PbdsDatavizBarSingleHorizontalComponent;
    exports.ɵp = PbdsHeaderShadowModule;
    exports.ɵq = PbdsHeaderShadowDirective;
    exports.ɵr = PbdsDaterangePopoverModule;
    exports.ɵs = CustomDatepickerI18n;
    exports.ɵt = PbdsDaterangePopoverComponent;
    exports.ɵu = PbdsDaterangeService;
    exports.ɵv = PbdsPageTitleModule;
    exports.ɵw = PbdsPageTitleComponent;
    exports.ɵx = PbdsColumnToggleModule;
    exports.ɵy = PbdsColumnToggleComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pb-design-system.umd.js.map

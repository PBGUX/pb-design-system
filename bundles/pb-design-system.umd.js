(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3'), require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('pb-design-system', ['exports', 'd3', '@angular/core', '@angular/common'], factory) :
    (factory((global['pb-design-system'] = {}),global['~5']['0']['0'],global.ng.core,global.ng.common));
}(this, (function (exports,d3,i0,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsDatavizService = /** @class */ (function () {
        function PbdsDatavizService() {
            var _this = this;
            this.colors = {
                mono: ['#00436e', '#005a93', '#0072b8', '#66aad4', '#cce3f1', '#e5f1f8'],
                theme: [
                    '#3e53a4',
                    '#cf0989',
                    '#009bdf',
                    '#ee6b0b',
                    '#edb700',
                    '#a03f9b',
                    '#00b140',
                    '#66c3ec',
                    '#c0c0c0',
                    '#f5a66d',
                    '#8b98c8',
                    '#aad88f'
                ]
            };
            this.getColors = function (mono) {
                return mono ? _this.colors.mono : _this.colors.theme;
            };
            this.createGradientDefs = function (svg, mono) {
                /** @type {?} */
                var colors = mono ? [_this.colors.mono[2]] : _this.colors.theme;
                for (var i = 0; i < colors.length; i++) {
                    /** @type {?} */
                    var color = mono ? _this.colors.mono[2] : _this.colors.theme[i];
                    /** @type {?} */
                    var gradient = svg
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
                return colors;
            };
            this.createGlowFilter = function (svg) {
                // add a new definition
                /** @type {?} */
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
                /** @type {?} */
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
                /** @type {?} */
                var merge = glow.append('feMerge');
                merge.append('feMergeNode').attr('in', 'SourceGraphic');
                for (var x = 0; x < feOffsets.length; x++) {
                    merge.append('feMergeNode').attr('in', 'coloredBlur' + x);
                }
            };
        }
        PbdsDatavizService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        PbdsDatavizService.ctorParameters = function () { return []; };
        /** @nocollapse */ PbdsDatavizService.ngInjectableDef = i0.defineInjectable({ factory: function PbdsDatavizService_Factory() { return new PbdsDatavizService(); }, token: PbdsDatavizService, providedIn: "root" });
        return PbdsDatavizService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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
            this.updateChart = function () {
                /** @type {?} */
                var paths = _this.svg.selectAll('path').data(_this.pie(_this.data));
                paths.exit().remove();
                //update existing items
                paths
                    .each(function (d) { return (d.outerRadius = _this.outerRadius); })
                    .transition()
                    .duration(500)
                    .attrTween('d', _this.arcTween);
                // paths on enter
                /** @type {?} */
                var enterPaths = paths
                    .enter()
                    .append('path')
                    .each(function (d) { return (d.outerRadius = _this.outerRadius); })
                    .attr('d', _this.arc)
                    .attr('fill', function (d) { return _this.colorRange(d.data.label); })
                    .attr('class', 'slice')
                    .each(function (d, i, nodes) {
                    _this.currentData.splice(i, 1, d);
                });
                if (_this.type === 'pie') {
                    enterPaths
                        .style('stroke', '#fff')
                        .style('stroke-width', 2)
                        .style('stroke-alignment', 'inner');
                }
                /** @type {?} */
                var legendItem = _this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(_this.data);
                legendItem.exit().remove();
                // update existing items
                legendItem.select('.legend-label').html(function (d) {
                    switch (_this.legendLabelFormatType) {
                        case 'time':
                            /** @type {?} */
                            var parsedTime = d3.isoParse(d.label);
                            return _this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                legendItem.select('.legend-value').html(function (d) { return _this.legendValueFormat(d.value); });
                // legend items on enter
                /** @type {?} */
                var enterLegendItem = legendItem
                    .enter()
                    .append('li')
                    .attr('tabindex', 0)
                    .attr('class', 'legend-item');
                enterLegendItem
                    .append('span')
                    .attr('class', 'legend-key')
                    .style('background-color', function (d) { return _this.colorRange(d.label); });
                /** @type {?} */
                var legendDescription = enterLegendItem.append('span').attr('class', 'legend-description');
                legendDescription
                    .append('span')
                    .attr('class', 'legend-label')
                    .html(function (d) {
                    switch (_this.legendLabelFormatType) {
                        case 'time':
                            /** @type {?} */
                            var parsedTime = d3.isoParse(d.label);
                            return _this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                legendDescription
                    .append('span')
                    .attr('class', 'legend-value')
                    .html(function (d) { return _this.legendValueFormat(d.value); });
                enterLegendItem
                    .on('mouseover focus', function (data, index, nodes) {
                    _this.legendMouseOverFocus(data, index, nodes);
                    _this.pathMouseOver(d3.event, data, index, nodes);
                })
                    .on('mouseout blur', function (data, index, nodes) {
                    _this.legendMouseOutBlur(data, index, nodes);
                    _this.pathMouseOut(data, index, nodes);
                })
                    .on('click', function (data, index, nodes) {
                    _this.clicked.emit(data);
                });
                enterPaths
                    .on('mouseover', function (data, index, nodes) {
                    _this.pathMouseOver(d3.event, data, index, nodes);
                    _this.tooltipShow(_this.chart.node(), data);
                })
                    .on('mousemove', function (data, index, nodes) {
                    _this.tooltipMove(_this.chart.node());
                })
                    .on('mouseout', function (data, index, nodes) {
                    _this.pathMouseOut(data, index, nodes);
                    _this.tooltipHide();
                })
                    .on('click', function (data, index, nodes) {
                    _this.pathClick(d3.event, data, index, nodes);
                });
            };
            this.arcTween = function (data, index, nodes) {
                // console.log('ARGS: ', data, index, nodes);
                /** @type {?} */
                var i = d3.interpolate(_this.currentData[index], data);
                _this.currentData[index] = i(1);
                return function (t) { return _this.arc(i(t)); };
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
                /** @type {?} */
                var slices = _this.chart.selectAll('.slice');
                /** @type {?} */
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
                    .attrTween('d', function (d) {
                    /** @type {?} */
                    var i = d3.interpolate(d.outerRadius, _this.outerRadius + _this.arcZoom);
                    return function (t) {
                        d.outerRadius = i(t);
                        return _this.arc(d);
                    };
                });
                _this.hovered.emit({
                    event: event,
                    data: data.data ? data.data : data // legend hover data is different than slice hover data
                });
            };
            this.pathMouseOut = function (data, index, value) {
                /** @type {?} */
                var slices = _this.chart.selectAll('.slice');
                /** @type {?} */
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
                    .attrTween('d', function (d) {
                    /** @type {?} */
                    var i = d3.interpolate(d.outerRadius, _this.outerRadius);
                    return function (t) {
                        d.outerRadius = i(t);
                        return _this.arc(d);
                    };
                });
            };
            this.pathClick = function (event, data, index, nodes) {
                _this.clicked.emit({
                    event: event,
                    data: data.data
                });
            };
            this.tooltipShow = function (node, data) {
                _this.tooltipSetPosition(node);
                /** @type {?} */
                var percentage = (data.endAngle - data.startAngle) / (2 * Math.PI);
                /** @type {?} */
                var label;
                switch (_this.tooltipLabelFormatType) {
                    case 'time':
                        /** @type {?} */
                        var parsedTime = d3.isoParse(data.data.label);
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
                /** @type {?} */
                var coordinates = d3.mouse(node);
                _this.tooltip.style('left', coordinates[0] + 16 + "px");
                _this.tooltip.style('top', coordinates[1] + 16 + "px");
            };
        }
        /**
         * @return {?}
         */
        PbdsDatavizPieComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
                this.width = this.width - this.margin.left - this.margin.right;
                this.height = this.width - this.margin.top - this.margin.bottom;
                this.colors = this._dataviz.getColors(this.monochrome);
                this.innerRadius = Math.min(this.width, this.height) / 2.5;
                this.outerRadius = Math.min(this.width, this.height) / 2;
                this.arcZoom = 10;
                this.anglePad = 0.02;
                this.legendValueFormat = d3.format(this.legendValueFormatString);
                this.tooltipValueFormat = d3.format(this.tooltipValueFormatString);
                switch (this.legendLabelFormatType) {
                    case 'time':
                        this.legendLabelFormat = d3.timeFormat(this.legendLabelFormatString);
                        break;
                    default:
                        this.legendLabelFormat = null;
                        break;
                }
                switch (this.tooltipLabelFormatType) {
                    case 'time':
                        this.tooltipLabelFormat = d3.timeFormat(this.tooltipLabelFormatString);
                        break;
                    default:
                        this.tooltipLabelFormat = null;
                        break;
                }
                this.colorRange = d3.scaleOrdinal()
                    .range(this.colors)
                    .domain(this.data.map(function (c) { return c.label; }));
                if (this.type === 'pie') {
                    this.innerRadius = 0;
                    this.anglePad = 0;
                }
                this.pie = d3.pie()
                    .padAngle(this.anglePad)
                    .value(function (d) { return d.value; })
                    .sort(null);
                this.arc = d3.arc()
                    .padRadius(this.outerRadius)
                    .innerRadius(this.innerRadius);
                this.chart = d3.select(this._element.nativeElement).attr('aria-hidden', 'true');
                this.svg = this.chart
                    .append('svg')
                    .attr('width', this.width)
                    .attr('height', this.height)
                    .attr('class', 'img-fluid')
                    .attr('preserveAspectRatio', 'xMinYMin meet')
                    .attr('viewBox', "-" + (this.width / 2 + this.margin.left) + " -" + (this.height / 2 + this.margin.top) + " " + (this.width +
                    this.margin.left +
                    this.margin.right) + " " + (this.height + this.margin.top + this.margin.bottom));
                this.legend = this.chart.append('ul').attr('class', 'legend legend-right');
                this.tooltip = this.chart
                    .append('div')
                    .style('opacity', 0)
                    .attr('class', 'pbds-tooltip')
                    .attr('aria-hidden', 'true');
                this.updateChart();
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        PbdsDatavizPieComponent.prototype.ngOnChanges = /**
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
        PbdsDatavizPieComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                if (this.tooltip)
                    this.tooltip.remove();
            };
        PbdsDatavizPieComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'pbds-dataviz-pie',
                        template: "",
                        changeDetection: i0.ChangeDetectionStrategy.OnPush
                    }] }
        ];
        /** @nocollapse */
        PbdsDatavizPieComponent.ctorParameters = function () {
            return [
                { type: PbdsDatavizService },
                { type: i0.ElementRef }
            ];
        };
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
            hovered: [{ type: i0.Output }],
            clicked: [{ type: i0.Output }]
        };
        return PbdsDatavizPieComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsDatavizBarComponent = /** @class */ (function () {
        function PbdsDatavizBarComponent(_dataviz, _element, _scroll) {
            var _this = this;
            this._dataviz = _dataviz;
            this._element = _element;
            this._scroll = _scroll;
            this.chartClass = true;
            this.barClass = true;
            this.width = 306;
            this.height = 400;
            this.type = 'medium'; // debug to show all chart options
            // debug to show all chart options
            this.singleSeries = false;
            this.xAxisFormatType = null;
            this.xAxisFormatString = '';
            this.yAxisFormatType = null;
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
            this.tooltipLabelFormatType = null;
            this.tooltipLabelFormatString = '';
            this.tooltipValueFormatType = null;
            this.tooltipValueFormatString = '';
            this.marginTop = 10; // hardcoded on purpose, do not document until feedback
            // hardcoded on purpose, do not document until feedback
            this.marginRight = 0; // hardcoded on purpose, do not document until feedback
            // hardcoded on purpose, do not document until feedback
            this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
            // hardcoded on purpose, do not document until feedback
            this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
            // hardcoded on purpose, do not document until feedback
            this.threshold = null;
            this.average = null;
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.updateChart = function () {
                // update the xScale
                _this.xAxisScale.domain(_this.data.map(function (d) { return d.label; }));
                // update the yScale
                _this.yAxisScale
                    .domain([
                    d3.min(_this.data, function (d) { return d.value - d.value * +_this.yAxisMinBuffer; }),
                    d3.max(_this.data, function (d) { return d.value + d.value * +_this.yAxisMaxBuffer; })
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
                    // rebind data to groups
                    /** @type {?} */
                    var group = _this.svg.selectAll('.bar-group').data(_this.data);
                    // remove bars
                    group.exit().remove();
                    // update gray bars
                    group
                        .select('.gray-bar')
                        .transition()
                        .duration(1000)
                        .attr('x', function (d) { return _this.xAxisScale(d.label); })
                        .attr('width', _this.xAxisScale.bandwidth());
                    // update the existing bars
                    group
                        .select('.bar')
                        .transition()
                        .duration(1000)
                        .attr('x', function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 4; })
                        .attr('width', _this.xAxisScale.bandwidth() / 2)
                        .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); })
                        .attr('y', function (d) { return _this.yAxisScale(d.value); });
                    // add group on enter
                    /** @type {?} */
                    var groupEnter = group
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');
                    // add gray bars on enter
                    groupEnter
                        .append('rect')
                        .attr('class', 'gray-bar')
                        .attr('rx', 0)
                        .attr('height', 0)
                        .attr('x', function (d) { return _this.xAxisScale(d.label); })
                        .attr('width', _this.xAxisScale.bandwidth())
                        .transition()
                        // .delay(1000)
                        .attr('height', _this.height)
                        .attr('width', _this.xAxisScale.bandwidth());
                    // add bars on enter
                    groupEnter
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('rx', 2)
                        .attr('fill', function (d) { return "url(#gradient-" + _this.colorRange(d.label).substr(1) + ")"; }) // removes hash to prevent safari bug;
                        .attr('x', function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 4; })
                        .attr('width', _this.xAxisScale.bandwidth() / 2)
                        .attr('y', _this.height)
                        .attr('height', 0)
                        .transition()
                        .duration(1000)
                        // .delay(1000)
                        .attr('y', function (d) { return _this.yAxisScale(d.value); })
                        .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); })
                        .attr('data-color', function (d) { return _this.colorRange(d.label); });
                    groupEnter
                        .select('.bar')
                        .on('mouseover focus', function (data, index, nodes) { return _this.barMouseOverFocus(d3.event, data, index, nodes); })
                        .on('mouseout blur', function (data, index, nodes) { return _this.barMouseOutBlur(); })
                        .on('click', function (data, index, nodes) { return _this.barMouseClick(d3.event, data, index, nodes); });
                }
                else {
                    // rebind data to groups
                    /** @type {?} */
                    var group = _this.svg.selectAll('.bar-group').data(_this.data);
                    // remove bars
                    group.exit().remove();
                    // update the existing bars
                    group
                        .select('.bar')
                        .attr('x', function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 5.5; })
                        .attr('width', _this.xAxisScale.bandwidth() / 1.5)
                        .transition()
                        .duration(1000)
                        .attr('y', function (d) { return _this.yAxisScale(d.value); })
                        .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); });
                    // add group on enter
                    /** @type {?} */
                    var groupEnter = group
                        .enter()
                        .append('g')
                        .attr('class', 'bar-group');
                    // add bars on enter
                    groupEnter
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('rx', 2)
                        .attr('fill', function (d) { return "url(#gradient-" + _this.colorRange(d.label).substr(1) + ")"; }) // removes hash to prevent safari bug;
                        .attr('x', function (d) { return _this.xAxisScale(d.label) + _this.xAxisScale.bandwidth() / 5.5; })
                        .attr('width', _this.xAxisScale.bandwidth() / 1.5)
                        .attr('y', _this.height)
                        .attr('height', 0)
                        .transition()
                        .duration(1000)
                        .attr('y', function (d) { return _this.yAxisScale(d.value); })
                        .attr('height', function (d) { return _this.height - _this.yAxisScale(d.value); })
                        .attr('data-color', function (d) { return _this.colorRange(d.label); });
                    groupEnter
                        .select('.bar')
                        .on('mouseover focus', function (data, index, nodes) { return _this.barMouseOverFocus(d3.event, data, index, nodes); })
                        .on('mouseout blur', function () { return _this.barMouseOutBlur(); })
                        .on('click', function (data, index, nodes) { return _this.barMouseClick(d3.event, data, index, nodes); });
                }
                if (!_this.hideLegend) {
                    /** @type {?} */
                    var legendItem = _this.chart
                        .select('.legend')
                        .selectAll('.legend-item')
                        .data(_this.data);
                    legendItem.exit().remove();
                    // update existing items
                    legendItem.select('.legend-label').html(function (d) {
                        // return this.legendLabelFormat === null ? d.label : this.legendLabelFormat(d.label);
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.label);
                            case 'time':
                                /** @type {?} */
                                var parsedTime = d3.isoParse(d.label);
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
                        // return this.legendLabelFormat === null ? d.label : this.legendLabelFormat(d.label);
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.label);
                            case 'time':
                                /** @type {?} */
                                var parsedTime = d3.isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    });
                    enterLegendItem
                        .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3.event, data, index, nodes); })
                        .on('mouseout', function () { return _this.legendMouseOut(); })
                        .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3.event, data, index, nodes); });
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
            this.barMouseOverFocus = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.bar-group')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                /** @type {?} */
                var bar = _this.chart
                    .selectAll('.bar-group')
                    .filter(function (d, i) { return i === index; })
                    .select('.bar');
                /** @type {?} */
                var barColor = bar.attr('data-color');
                bar.style('fill', function () { return barColor; });
                _this.chart
                    .selectAll('.legend-item')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.tooltipShow(data, nodes.filter(function (d, i) { return i === index; }));
                _this.hovered.emit({ event: event, data: data });
            };
            this.barMouseOutBlur = function () {
                _this.chart
                    .selectAll('.bar-group')
                    .classed('inactive', false)
                    .select('.bar')
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
                    .selectAll('.bar-group')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                /** @type {?} */
                var bar = _this.chart
                    .selectAll('.bar-group')
                    .filter(function (d, i) { return i === index; })
                    .select('.bar');
                /** @type {?} */
                var barColor = bar.attr('data-color');
                bar.style('fill', function () { return barColor; });
                _this.tooltipShow(data, _this.chart.selectAll('.bar').filter(function (d, i) { return i === index; })._groups[0]); // TODO: find better way than using _groups
                _this.hovered.emit({ event: event, data: data });
            };
            this.legendMouseOut = function () {
                _this.chart.selectAll('.legend-item').classed('inactive', false);
                _this.chart
                    .selectAll('.bar-group')
                    .classed('inactive', false)
                    .select('.bar')
                    .style('fill', null);
                _this.tooltipHide();
            };
            this.legendMouseClick = function (event, data, index, nodes) {
                _this.clicked.emit({ event: event, data: data });
            };
            this.tooltipShow = function (data, node) {
                /** @type {?} */
                var dimensions = node[0].getBoundingClientRect();
                /** @type {?} */
                var scroll = _this._scroll.getScrollPosition();
                /** @type {?} */
                var label;
                switch (_this.tooltipLabelFormatType) {
                    case 'number':
                        label = _this.tooltipLabelFormat(data.label);
                        break;
                    case 'time':
                        /** @type {?} */
                        var parsedTime = d3.isoParse(data.label);
                        label = _this.tooltipLabelFormat(parsedTime);
                        break;
                    default:
                        label = data.label;
                }
                /** @type {?} */
                var value = _this.tooltipValueFormat === null
                    ? "<div class=\"tooltip-value\">" + data.value + "</div>"
                    : "<div class=\"tooltip-value\">" + _this.tooltipValueFormat(data.value) + "</div>";
                _this.tooltip.html("\n        " + (_this.hideTooltipLabel ? '' : "" + label) + "\n        " + value + "\n      ");
                /** @type {?} */
                var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
                /** @type {?} */
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
                        /** @type {?} */
                        var parseDate = d3.isoParse(item);
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
                        /** @type {?} */
                        var parseDate = d3.isoParse(item);
                        return _this.yAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
        }
        /**
         * @return {?}
         */
        PbdsDatavizBarComponent.prototype.ngOnInit = /**
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
                switch (this.xAxisFormatType) {
                    case 'number':
                        this.xAxisFormat = d3.format(this.xAxisFormatString);
                        break;
                    case 'time':
                        this.xAxisFormat = d3.timeFormat(this.xAxisFormatString);
                        break;
                }
                switch (this.yAxisFormatType) {
                    case 'number':
                        this.yAxisFormat = d3.format(this.yAxisFormatString);
                        break;
                    case 'time':
                        this.yAxisFormat = d3.timeFormat(this.yAxisFormatString);
                        break;
                }
                switch (this.legendLabelFormatType) {
                    case 'number':
                        this.legendLabelFormat = d3.format(this.legendLabelFormatString);
                        break;
                    case 'time':
                        this.legendLabelFormat = d3.timeFormat(this.legendLabelFormatString);
                        break;
                    default:
                        this.legendLabelFormat = null;
                        break;
                }
                switch (this.tooltipLabelFormatType) {
                    case 'number':
                        this.tooltipLabelFormat = d3.format(this.tooltipLabelFormatString);
                        break;
                    case 'time':
                        this.tooltipLabelFormat = d3.timeFormat(this.tooltipLabelFormatString);
                        break;
                    default:
                        this.tooltipLabelFormat = null;
                        break;
                }
                switch (this.tooltipValueFormatType) {
                    case 'number':
                        this.tooltipValueFormat = d3.format(this.tooltipValueFormatString);
                        break;
                    case 'time':
                        this.tooltipValueFormat = d3.timeFormat(this.tooltipValueFormatString);
                        break;
                    default:
                        this.tooltipValueFormat = null;
                }
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
                this.chart = d3.select(this._element.nativeElement).attr('aria-hidden', 'true');
                // create chart svg
                this.svg = this.chart
                    .append('svg')
                    .attr('width', +this.width)
                    .attr('height', +this.height + this.margin.top + this.margin.bottom)
                    .attr('class', 'img-fluid')
                    .attr('preserveAspectRatio', 'xMinYMin meet')
                    .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + +this.width + " " + (+this.height + this.margin.top + this.margin.bottom));
                // build color ranges
                this.colorRange = d3.scaleOrdinal().range(this._dataviz.createGradientDefs(this.svg, this.singleSeries));
                // X AXIS
                this.xAxisScale = d3.scaleBand()
                    .domain(this.data.map(function (d) { return d.label; }))
                    .rangeRound([0, this.width - this.margin.left])
                    .align(0);
                // add padding to the scale for gray bars
                !this.hideGrayBars
                    ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
                    : this.xAxisScale.paddingInner(0).paddingOuter(0);
                this.xAxisCall = d3.axisBottom(this.xAxisScale)
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
                    this.xGridCall = d3.axisBottom(this.xAxisScale).tickSize(-this.height);
                    this.xGrid = this.svg
                        .append('g')
                        .attr('class', 'grid grid-x')
                        .classed('grid-zero-hidden', this.hideXAxisZero)
                        .attr('transform', "translate(0, " + this.height + ")")
                        .call(this.xGridCall);
                }
                // Y AXIS
                this.yAxisScale = d3.scaleLinear()
                    .domain([
                    d3.min(this.data, function (d) { return d.value - d.value * +_this.yAxisMinBuffer; }),
                    d3.max(this.data, function (d) { return d.value + d.value * +_this.yAxisMaxBuffer; })
                ])
                    .nice()
                    .rangeRound([this.height, 0]);
                this.yAxisCall = d3.axisLeft(this.yAxisScale)
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
                    this.yGridCall = d3.axisLeft(this.yAxisScale)
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
                        .attr('x2', +this.width)
                        .attr('transform', "translate(0,  " + this.yAxisScale(+this.threshold) + ")");
                }
                // Y AVERAGE
                if (this.average) {
                    this.yAverage = this.svg
                        .append('line')
                        .attr('class', 'average')
                        .attr('x2', +this.width)
                        .attr('transform', "translate(0,  " + this.yAxisScale(+this.average) + ")");
                }
                // TOOLTIP
                if (!this.hideTooltip) {
                    this.tooltip = d3.select('body')
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
        /**
         * @param {?} changes
         * @return {?}
         */
        PbdsDatavizBarComponent.prototype.ngOnChanges = /**
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
        PbdsDatavizBarComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                if (this.tooltip)
                    this.tooltip.remove();
            };
        PbdsDatavizBarComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'pbds-dataviz-bar',
                        template: "",
                        changeDetection: i0.ChangeDetectionStrategy.OnPush
                    }] }
        ];
        /** @nocollapse */
        PbdsDatavizBarComponent.ctorParameters = function () {
            return [
                { type: PbdsDatavizService },
                { type: i0.ElementRef },
                { type: common.ViewportScroller }
            ];
        };
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
            average: [{ type: i0.Input }],
            hovered: [{ type: i0.Output }],
            clicked: [{ type: i0.Output }]
        };
        return PbdsDatavizBarComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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
            this.hovered = new i0.EventEmitter();
            this.clicked = new i0.EventEmitter();
            this.tooltipHovered = new i0.EventEmitter();
            this.tooltipClicked = new i0.EventEmitter();
            this.updateChart = function () {
                _this.mouserect.data(_this.data);
                // update the xScale
                _this.xAxisScale.domain(d3.extent(_this.data.dates, function (d, i) {
                    return d3.isoParse(d);
                }));
                // update the yScale
                _this.yAxisScale
                    .domain([
                    d3.min(_this.data.series, function (d, i) {
                        /** @type {?} */
                        var minVal = +d3.min(d.values);
                        return minVal - minVal * +_this.yAxisMinBuffer;
                    }),
                    d3.max(_this.data.series, function (d, i) {
                        /** @type {?} */
                        var maxVal = +d3.max(d.values);
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
                    .attr('cx', function (d, i) { return _this.xAxisScale(d3.isoParse(_this.data.dates[i])); })
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
                        .attr('cx', function (d, i) { return _this.xAxisScale(d3.isoParse(_this.data.dates[i])); })
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
                                var parsedTime = d3.isoParse(d.label);
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
                                var parsedTime = d3.isoParse(d.label);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    });
                    enterLegendItem
                        .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3.event, data, index, nodes); })
                        .on('mouseout', function () { return _this.legendMouseOut(); })
                        .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3.event, data, index, nodes); });
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
                var mouseXDate = _this.xAxisScale.invert(d3.mouse(nodes[0])[0]);
                // return date at mouse x position
                /** @type {?} */
                var leftIndex = d3.bisectLeft(_this.data.dates, d3.isoFormat(mouseXDate));
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
                var closestIndex = _this.data.dates.indexOf(d3.isoFormat(closestDate));
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
                    var parsedTime = d3.isoParse(_this.data.dates[closestIndex]);
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
                var parseDate = d3.isoParse(item);
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
                this.xAxisFormat = d3.timeFormat(this.xAxisFormatString);
                this.yAxisFormat = d3.format(this.yAxisFormatString);
                switch (this.legendLabelFormatType) {
                    case 'number':
                        this.legendLabelFormat = d3.format(this.legendLabelFormatString);
                        break;
                    case 'time':
                        this.legendLabelFormat = d3.timeFormat(this.legendLabelFormatString);
                        break;
                    default:
                        this.legendLabelFormat = null;
                        break;
                }
                this.tooltipHeadingFormat = d3.timeFormat(this.tooltipHeadingFormatString);
                switch (this.tooltipLabelFormatType) {
                    case 'number':
                        this.tooltipLabelFormat = d3.format(this.tooltipLabelFormatString);
                        break;
                    case 'time':
                        this.tooltipLabelFormat = d3.timeFormat(this.tooltipLabelFormatString);
                        break;
                    default:
                        this.tooltipLabelFormat = null;
                        break;
                }
                switch (this.tooltipValueFormatType) {
                    case 'number':
                        this.tooltipValueFormat = d3.format(this.tooltipValueFormatString);
                        break;
                    case 'time':
                        this.tooltipValueFormat = d3.timeFormat(this.tooltipValueFormatString);
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
                this.d3line = d3.line()
                    .x(function (d, i) { return _this.xAxisScale(d3.isoParse(_this.data.dates[i])); })
                    .y(function (d) { return _this.yAxisScale(d); });
                // define line curve
                if (this.lineCurved) {
                    this.d3line.curve(d3.curveCatmullRom.alpha(0.5));
                }
                // define area
                if (this.area) {
                    this.d3area = d3.area()
                        .x(function (d, i) { return _this.xAxisScale(d3.isoParse(_this.data.dates[i])); })
                        .y0(this.height)
                        .y1(function (d, i) { return _this.yAxisScale(d); });
                    if (this.lineCurved) {
                        this.d3area.curve(d3.curveCatmullRom.alpha(0.5));
                    }
                }
                // create the chart
                this.chart = d3.select(this._element.nativeElement).attr('aria-hidden', 'true');
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
                    .on('mousemove', function (data, index, nodes) { return _this.mouserectMouseMove(d3.event, index, nodes); })
                    .on('mouseout', function (data, index, nodes) { return _this.mouserectMouseOut(d3.event, index, nodes); })
                    .on('click', function (data, index, nodes) { return _this.mouserectMouseClick(); });
                this.tooltipLine = this.svg
                    .append('line')
                    .attr('y1', 0)
                    .attr('y2', this.height)
                    .attr('class', 'tooltip-line');
                // define color range
                this.colorRange = d3.scaleOrdinal().range(this._dataviz.getColors(false));
                // add glow def
                this._dataviz.createGlowFilter(this.svg);
                // X AXIS
                this.xAxisScale = d3.scaleTime()
                    .domain(d3.extent(this.data.dates, function (d, i) {
                    return d3.isoParse(d);
                }))
                    .range([0, this.width - this.margin.left - this.margin.right]);
                this.xAxisCall = d3.axisBottom(this.xAxisScale)
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
                    this.xGridCall = d3.axisBottom(this.xAxisScale).tickSize(-this.height);
                    this.xGrid = this.svg
                        .append('g')
                        .attr('class', 'grid grid-x')
                        .classed('grid-zero-hidden', this.hideXAxisZero)
                        .attr('transform', "translate(0, " + this.height + ")") //${-this.margin.right / 2}
                        .call(this.xGridCall);
                }
                // Y AXIS
                this.yAxisScale = d3.scaleLinear()
                    .domain([
                    d3.min(this.data.series, function (d, i) {
                        /** @type {?} */
                        var minVal = +d3.min(d.values);
                        return minVal - minVal * +_this.yAxisMinBuffer;
                    }),
                    d3.max(this.data.series, function (d, i) {
                        /** @type {?} */
                        var maxVal = +d3.max(d.values);
                        return maxVal + maxVal * _this.yAxisMaxBuffer;
                    })
                ])
                    .nice()
                    .range([this.height, 0]);
                this.yAxisCall = d3.axisLeft(this.yAxisScale)
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
                    this.yGridCall = d3.axisLeft(this.yAxisScale)
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
                    this.tooltip = d3.select('body')
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
            { type: i0.Component, args: [{
                        selector: 'pbds-dataviz-line',
                        template: "",
                        changeDetection: i0.ChangeDetectionStrategy.OnPush
                    }] }
        ];
        /** @nocollapse */
        PbdsDatavizLineComponent.ctorParameters = function () {
            return [
                { type: PbdsDatavizService },
                { type: i0.ElementRef },
                { type: common.ViewportScroller }
            ];
        };
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
            hovered: [{ type: i0.Output }],
            clicked: [{ type: i0.Output }],
            tooltipHovered: [{ type: i0.Output }],
            tooltipClicked: [{ type: i0.Output }]
        };
        return PbdsDatavizLineComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsDatavizGaugeComponent = /** @class */ (function () {
        function PbdsDatavizGaugeComponent(_dataviz, _element) {
            var _this = this;
            this._dataviz = _dataviz;
            this._element = _element;
            this.chartClass = true;
            this.pieClass = true;
            this.width = 300;
            this.type = 'halfmoon';
            this.color = '#cf0989';
            this.hideLabel = false;
            this.labelFormatString = '';
            this.labelSmall = false;
            this.gaugeWidth = 20;
            this.degreesToRadians = function (degree) {
                return (degree * Math.PI) / 180;
            };
            this.calculateMinMax = function () {
                /** @type {?} */
                var percentage = _this.data.minvalue / (_this.data.maxvalue - _this.data.minvalue);
                return percentage * (_this.data.value - _this.data.minvalue) + (_this.data.value - _this.data.minvalue);
            };
            this.calculateCurve = function (data) {
                /** @type {?} */
                var start = _this.degreesToRadians(_this.startAngle);
                /** @type {?} */
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
                /** @type {?} */
                var background = _this.gauge
                    .append('path')
                    .data(_this.calculateCurve(_this.data.maxvalue))
                    .attr('class', 'gauge-background')
                    .attr('fill', _this.backgroundColor)
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
                /** @type {?} */
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
                /** @type {?} */
                var newAngle = _this.calculateCurve(value);
                transition.attrTween('d', function (d) {
                    /** @type {?} */
                    var interpolate = d3.interpolate(d.endAngle, newAngle[0].endAngle);
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
                value = d3.format('.2f')(value); // TODO: check these .1f formats here, should they be inputs?
                value = value.replace(/,/g, '.');
                transition.tween('text', function () {
                    /** @type {?} */
                    var interpolate = d3.interpolate(d3.format('.2f')(+_this.oldValue), value);
                    return function (t) {
                        _this.labelTween.text(function (d) {
                            /** @type {?} */
                            var updatedNumber = _this.labelFormat(interpolate(t));
                            _this.label = updatedNumber;
                            return updatedNumber;
                        });
                    };
                });
            };
        }
        /**
         * @return {?}
         */
        PbdsDatavizGaugeComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.height = this.width;
                this.radius = Math.max(this.width, this.height) / 2;
                this.labelFormat = d3.format(this.labelFormatString);
                this.backgroundColor = '#F0F0F0';
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
                this.arc = d3.arc().cornerRadius(this.rounded ? this.gaugeWidth : 0);
                this.chart = d3.select(this._element.nativeElement).attr('aria-hidden', 'true');
                this.svg = this.chart
                    .append('svg')
                    .attr('width', this.width)
                    .attr('height', this.height)
                    .attr('class', 'img-fluid') // to resize chart
                    .attr('preserveAspectRatio', 'xMinYMin meet')
                    .attr('viewBox', "-" + this.width / 2 + " -" + this.height / 2 + " " + this.width + " " + this.height);
                this.drawChart();
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        PbdsDatavizGaugeComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes.data && !changes.data.firstChange) {
                    // console.log(changes.data.previousValue.value, changes.data.currentValue.value);
                    this.oldValue = changes.data.previousValue.value;
                    this.updateChart();
                }
            };
        PbdsDatavizGaugeComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'pbds-dataviz-gauge',
                        template: "\n    <div\n      *ngIf=\"!hideLabel\"\n      class=\"gauge-details\"\n      [ngClass]=\"{ halfmoon: type === 'halfmoon', 'gauge-details-small': labelSmall }\"\n    >\n      <div class=\"gauge-number\">{{ label }}</div>\n      <div *ngIf=\"description\" class=\"gauge-description text-center\">{{ description }}</div>\n    </div>\n  "
                    }] }
        ];
        /** @nocollapse */
        PbdsDatavizGaugeComponent.ctorParameters = function () {
            return [
                { type: PbdsDatavizService },
                { type: i0.ElementRef }
            ];
        };
        PbdsDatavizGaugeComponent.propDecorators = {
            chartClass: [{ type: i0.HostBinding, args: ['class.pbds-chart',] }],
            pieClass: [{ type: i0.HostBinding, args: ['class.pbds-chart-gauge',] }],
            data: [{ type: i0.Input }],
            width: [{ type: i0.Input }],
            type: [{ type: i0.Input }],
            color: [{ type: i0.Input }],
            hideLabel: [{ type: i0.Input }],
            labelFormatString: [{ type: i0.Input }],
            labelSmall: [{ type: i0.Input }],
            description: [{ type: i0.Input }],
            gaugeWidth: [{ type: i0.Input }]
        };
        return PbdsDatavizGaugeComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsDatavizSparklineComponent = /** @class */ (function () {
        function PbdsDatavizSparklineComponent(_element) {
            this._element = _element;
            this.chartClass = true;
            this.sparklineClass = true;
            this.width = 160;
            this.height = 40;
            this.type = 'line';
            this.color = '#cf0989';
            this.colorNegative = null; // undocumented, may add if needed
            // undocumented, may add if needed
            this.strokeWidth = 2; // undocumented, width is automatically set by the type
            // undocumented, width is automatically set by the type
            this.yAxisMinBuffer = 0;
            this.yAxisMaxBuffer = 0;
        }
        /**
         * @return {?}
         */
        PbdsDatavizSparklineComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
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
                /** @type {?} */
                var x = d3.scaleLinear().range([0, this.width - this.margin.left - this.margin.right]);
                /** @type {?} */
                var y = d3.scaleLinear().range([this.height - this.margin.top - this.margin.bottom, 0]);
                y.domain([+d3.min(this.data) - this.yAxisMinBuffer, +d3.max(this.data) + this.yAxisMaxBuffer]);
                x.domain([0, this.data.length]);
                /** @type {?} */
                var line = d3.line()
                    .x(function (d, i) { return x(i); })
                    .y(function (d) { return y(d); });
                /** @type {?} */
                var area = d3.area()
                    .x(function (d, i) { return x(i); })
                    .y0(this.height)
                    .y1(function (d) { return y(d); });
                this.chart = d3.select(this._element.nativeElement).attr('aria-hidden', 'true');
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
                        .datum(this.data)
                        .attr('class', 'sparkline')
                        .attr('fill', 'none')
                        .attr('stroke-width', this.strokeWidth)
                        .attr('stroke', this.color)
                        .attr('d', line);
                }
                if (this.type === 'area' || this.type === 'area-high') {
                    this.svg
                        .append('path')
                        .datum(this.data)
                        .attr('class', 'sparkarea')
                        .attr('fill', this.color)
                        .attr('fill-opacity', 0.3)
                        .attr('d', area);
                }
                if (this.type === 'bar') {
                    /** @type {?} */
                    var barWidth = (this.width - this.data.length) / this.data.length;
                    // handles negative values, see example https://www.essycode.com/posts/create-sparkline-charts-d3/
                    this.svg
                        .selectAll('.bar')
                        .data(this.data)
                        .enter()
                        .append('rect')
                        .attr('class', 'sparkbar')
                        .attr('x', function (d, i) { return x(i); })
                        .attr('y', function (d) { return (d > 0 ? y(d) : y(0)); })
                        .attr('width', barWidth)
                        .attr('height', function (d) { return Math.abs(y(d) - y(0)); })
                        .attr('fill', function (d) { return (d > 0 ? _this.color : _this.colorNegative); }); // still uses undocumented negative color values
                }
            };
        PbdsDatavizSparklineComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'pbds-dataviz-sparkline',
                        template: "",
                        changeDetection: i0.ChangeDetectionStrategy.OnPush
                    }] }
        ];
        /** @nocollapse */
        PbdsDatavizSparklineComponent.ctorParameters = function () {
            return [
                { type: i0.ElementRef }
            ];
        };
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
        return PbdsDatavizSparklineComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsDatavizStackedBarComponent = /** @class */ (function () {
        function PbdsDatavizStackedBarComponent(_dataviz, _element, _scroll) {
            var _this = this;
            this._dataviz = _dataviz;
            this._element = _element;
            this._scroll = _scroll;
            this.chartClass = true;
            this.stackedBarClass = true;
            this.width = 306;
            this.height = 400;
            this.type = 'medium'; // debug to show all chart options
            // debug to show all chart options
            this.marginTop = 10; // hardcoded on purpose, do not document until feedback
            // hardcoded on purpose, do not document until feedback
            this.marginRight = 0; // hardcoded on purpose, do not document until feedback
            // hardcoded on purpose, do not document until feedback
            this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
            // hardcoded on purpose, do not document until feedback
            this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
            // hardcoded on purpose, do not document until feedback
            this.hideXAxis = false;
            this.xAxisFormatType = null;
            this.xAxisFormatString = '';
            this.yAxisFormatType = null;
            this.yAxisFormatString = '';
            this.yAxisTicks = 5;
            this.yAxisMaxBuffer = 0.01;
            this.hideLegend = false;
            this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
            // hardcoded legend width + left margin, do not document until feedback
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
            this.updateChart = function () {
                _this.dataKeys = Object.keys(_this.data[0]).filter(function (item) { return item !== 'key'; });
                // create the D3 stack data
                _this.dataStack = d3.stack()
                    .keys(_this.dataKeys)
                    .order(d3.stackOrderNone)(_this.data);
                // update the xScale
                _this.xAxisScale.domain(_this.data.map(function (d) { return d.key; }));
                // update the yScale
                _this.yAxisMax = d3.max(_this.dataStack, function (data) {
                    return d3.max(data, function (d) {
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
                // add gray bars
                if (!_this.hideGrayBars) {
                    _this.grayBars
                        .selectAll('.gray-bar')
                        .data(_this.data)
                        .join(function (enter) {
                        return enter
                            .append('rect')
                            .attr('class', 'gray-bar')
                            .attr('x', function (d) { return _this.xAxisScale(d.key); })
                            .attr('width', _this.xAxisScale.bandwidth())
                            .attr('height', _this.height);
                    }, function (update) {
                        return update
                            .transition()
                            .duration(1000)
                            .attr('x', function (d) { return _this.xAxisScale(d.key); })
                            .attr('width', _this.xAxisScale.bandwidth())
                            .attr('height', _this.height);
                    }, function (exit) { return exit.remove(); });
                }
                // add colored bars
                /** @type {?} */
                var barGroups = _this.bars
                    .selectAll('.bar-group')
                    .data(_this.dataStack)
                    .join(function (enter) {
                    return enter
                        .append('g')
                        .attr('class', 'bar-group')
                        .attr('fill', function (d) { return _this.colorRange(d.index); });
                }, function (update) { return update.attr('fill', function (d) { return _this.colorRange(d.index); }); }, function (exit) { return exit.remove(); });
                barGroups
                    .selectAll('.bar')
                    .data(function (d) { return d; })
                    .join(function (enter) {
                    return enter
                        .append('rect')
                        .attr('class', 'bar')
                        .classed('bar-divided', _this.type !== 'high')
                        .classed('bar-divided-low', _this.type === 'low')
                        .attr('x', function (d, i) {
                        /** @type {?} */
                        var x;
                        if (_this.type === 'medium') {
                            x = _this.xAxisScale(d.data.key) + (_this.xAxisScale.bandwidth() / 8) * 3;
                        }
                        else {
                            x = _this.xAxisScale(d.data.key) + (_this.xAxisScale.bandwidth() / 4) * 1;
                        }
                        return x;
                    })
                        .attr('y', function (d) { return _this.yAxisScale(d[1]); })
                        .attr('width', 0)
                        .attr('height', 0)
                        .call(function (enter) {
                        /** @type {?} */
                        var width;
                        if (_this.type === 'medium') {
                            width = _this.xAxisScale.bandwidth() / 4;
                        }
                        else {
                            width = _this.xAxisScale.bandwidth() / 2;
                        }
                        enter
                            .transition()
                            .duration(1000)
                            .attr('width', width)
                            .attr('height', function (d) { return _this.yAxisScale(d[0]) - _this.yAxisScale(d[1]); });
                        return enter;
                    });
                }, function (update) {
                    return update.call(function (update) {
                        /** @type {?} */
                        var width;
                        if (_this.type === 'medium') {
                            width = _this.xAxisScale.bandwidth() / 4;
                        }
                        else {
                            width = _this.xAxisScale.bandwidth() / 2;
                        }
                        update
                            .transition()
                            .duration(1000)
                            .attr('width', _this.xAxisScale.bandwidth() / 4)
                            .attr('x', function (d, i) { return _this.xAxisScale(d.data.key) + (_this.xAxisScale.bandwidth() / 8) * 3; })
                            .attr('y', function (d) { return _this.yAxisScale(d[1]); })
                            .attr('height', function (d) { return _this.yAxisScale(d[0]) - _this.yAxisScale(d[1]); });
                        return update;
                    });
                }, function (exit) { return exit.remove(); });
                // mouseover bars
                _this.mouseBars
                    .selectAll('.mouseover-bar')
                    .data(_this.data)
                    .join(function (enter) {
                    return enter
                        .append('rect')
                        .attr('class', 'mouseover-bar')
                        .style('opacity', 0)
                        .attr('x', function (d) { return _this.xAxisScale(d.key); })
                        .attr('width', _this.xAxisScale.bandwidth())
                        .attr('height', _this.height);
                }, function (update) {
                    return update
                        .attr('x', function (d) { return _this.xAxisScale(d.key); })
                        .attr('width', _this.xAxisScale.bandwidth())
                        .attr('height', _this.height);
                }, function (exit) { return exit.remove(); })
                    .on('mouseover focus', function (data, index, nodes) { return _this.barMouseOverFocus(d3.event, data, index, nodes); })
                    .on('mouseout blur', function (data, index, nodes) { return _this.barMouseOutBlur(); })
                    .on('click', function (data, index, nodes) { return _this.barMouseClick(d3.event, data, index, nodes); });
                _this.bars.raise();
                _this.mouseBars.raise();
                if (!_this.hideLegend) {
                    // TODO: refactor to use .join() with enter, update, exit
                    /** @type {?} */
                    var legendItem = _this.chart
                        .select('.legend')
                        .selectAll('.legend-item')
                        .data(_this.dataStack);
                    legendItem.exit().remove();
                    // update existing items
                    legendItem.select('.legend-label').html(function (d) {
                        // return this.legendLabelFormat === null ? d.label : this.legendLabelFormat(d.label);
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.key);
                            case 'time':
                                /** @type {?} */
                                var parsedTime = d3.isoParse(d.key);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
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
                        .style('background-color', function (d) { return _this.colorRange(d.index); });
                    enterLegendItem
                        .append('span')
                        .attr('class', 'legend-label')
                        .html(function (d) {
                        // return this.legendLabelFormat === null ? d.label : this.legendLabelFormat(d.label);
                        switch (_this.legendLabelFormatType) {
                            case 'number':
                                return _this.legendLabelFormat(d.key);
                            case 'time':
                                /** @type {?} */
                                var parsedTime = d3.isoParse(d.key);
                                return _this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
                        }
                    });
                    enterLegendItem
                        .on('mouseover', function (data, index, nodes) { return _this.legendMouseOver(d3.event, data, index, nodes); })
                        .on('mouseout', function () { return _this.legendMouseOut(); })
                        .on('click', function (data, index, nodes) { return _this.legendMouseClick(d3.event, data, index, nodes); });
                }
            };
            this.barMouseOverFocus = function (event, data, index, nodes) {
                _this.chart
                    .selectAll('.bar-group')
                    .selectAll('.bar')
                    .filter(function (d, i) { return i !== index; })
                    .classed('inactive', true);
                _this.tooltipShow(data, index, nodes[index]);
                _this.hovered.emit({ event: event, data: data });
            };
            this.barMouseOutBlur = function () {
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
                        /** @type {?} */
                        var parseDate = d3.isoParse(item);
                        return _this.xAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
            this.tooltipShow = function (data, index, node) {
                // console.log('TOOLTIP: ', data, index, node);
                // console.log('TOOLTIP: ', data, index, node);
                /** @type {?} */
                var scroll = _this._scroll.getScrollPosition();
                /** @type {?} */
                var mouserectDimensions = node.getBoundingClientRect();
                /** @type {?} */
                var clientWidth = document.body.clientWidth - 10;
                /** @type {?} */
                var dimensionCalculated;
                /** @type {?} */
                var tooltipDimensions;
                /** @type {?} */
                var tooltipOffsetHeight;
                /** @type {?} */
                var yPosition;
                /** @type {?} */
                var xPosition;
                // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
                _this.tooltip.select('.tooltip-header').html(function (d) {
                    switch (_this.tooltipHeadingFormatType) {
                        case 'time':
                            /** @type {?} */
                            var parseDate = d3.isoParse(data.key);
                            return _this.tooltipHeadingFormat(parseDate);
                        default:
                            return data.key;
                    }
                });
                _this.tooltip.select('.tooltip-header-value').html(function (d) {
                    /** @type {?} */
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
                    /** @type {?} */
                    var html = "";
                    /** @type {?} */
                    var label;
                    /** @type {?} */
                    var value;
                    Object.keys(data).map(function (key, index) {
                        switch (_this.tooltipLabelFormatType) {
                            case 'time':
                                /** @type {?} */
                                var parseDate = d3.isoParse(key);
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
                        /** @type {?} */
                        var parseDate = d3.isoParse(item);
                        return _this.yAxisFormat(parseDate);
                    default:
                        return item;
                }
            };
        }
        /**
         * @return {?}
         */
        PbdsDatavizStackedBarComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                // extract keys for stack data
                this.dataKeys = Object.keys(this.data[0]).filter(function (item) { return item !== 'key'; });
                // create the D3 stack data
                this.dataStack = d3.stack()
                    .keys(this.dataKeys)
                    .order(d3.stackOrderNone)(this.data);
                //////////////////////////////////////////
                this.margin = {
                    top: +this.marginTop,
                    right: +this.marginRight,
                    bottom: +this.marginBottom,
                    left: +this.marginLeft
                };
                switch (this.xAxisFormatType) {
                    case 'number':
                        this.xAxisFormat = d3.format(this.xAxisFormatString);
                        break;
                    case 'time':
                        this.xAxisFormat = d3.timeFormat(this.xAxisFormatString);
                        break;
                }
                switch (this.yAxisFormatType) {
                    case 'number':
                        this.yAxisFormat = d3.format(this.yAxisFormatString);
                        break;
                    case 'time':
                        this.yAxisFormat = d3.timeFormat(this.yAxisFormatString);
                        break;
                }
                switch (this.legendLabelFormatType) {
                    case 'number':
                        this.legendLabelFormat = d3.format(this.legendLabelFormatString);
                        break;
                    case 'time':
                        this.legendLabelFormat = d3.timeFormat(this.legendLabelFormatString);
                        break;
                    default:
                        this.legendLabelFormat = null;
                        break;
                }
                switch (this.tooltipHeadingFormatType) {
                    case 'time':
                        this.tooltipHeadingFormat = d3.timeFormat(this.tooltipHeadingFormatString);
                        break;
                    default:
                        this.tooltipHeadingFormat = null;
                        break;
                }
                switch (this.tooltipHeadingValueFormatType) {
                    case 'number':
                        this.tooltipHeadingValueFormat = d3.format(this.tooltipHeadingValueFormatString);
                        break;
                    default:
                        this.tooltipHeadingValueFormat = null;
                        break;
                }
                switch (this.tooltipLabelFormatType) {
                    case 'time':
                        this.tooltipLabelFormat = d3.timeFormat(this.tooltipLabelFormatString);
                        break;
                    default:
                        this.tooltipLabelFormat = null;
                        break;
                }
                switch (this.tooltipValueFormatType) {
                    case 'number':
                        this.tooltipValueFormat = d3.format(this.tooltipValueFormatString);
                        break;
                    default:
                        this.tooltipValueFormat = null;
                }
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
                this.chart = d3.select(this._element.nativeElement).attr('aria-hidden', 'true');
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
                this.colorRange = d3.scaleOrdinal().range(this._dataviz.getColors(false));
                // X AXIS
                this.xAxisScale = d3.scaleBand()
                    .domain(this.data.map(function (d) { return d.key; }))
                    .rangeRound([0, this.width - this.margin.left])
                    .align(0);
                // add padding to the scale for gray bars
                !this.hideGrayBars
                    ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
                    : this.xAxisScale.paddingInner(0).paddingOuter(0);
                this.xAxisCall = d3.axisBottom(this.xAxisScale)
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
                    this.xGridCall = d3.axisBottom(this.xAxisScale).tickSize(-this.height);
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
                this.yAxisMax = d3.max(this.dataStack, function (data) {
                    return d3.max(data, function (d) {
                        return d[1];
                    });
                });
                this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
                this.yAxisScale = d3.scaleLinear()
                    .domain([0, this.yAxisMax])
                    .nice()
                    .rangeRound([this.height, 0]);
                this.yAxisCall = d3.axisLeft(this.yAxisScale)
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
                    this.yGridCall = d3.axisLeft(this.yAxisScale)
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
                    this.tooltip = d3.select('body')
                        .append('div')
                        .attr('class', 'pbds-tooltip west')
                        .style('opacity', 0)
                        .attr('aria-hidden', 'true'); // hide tooltip for accessibility
                    // tooltip header
                    this.tooltip.append('div').attr('class', 'tooltip-header');
                    this.tooltip.append('div').attr('class', 'tooltip-header-value');
                    // tooltip table
                    /** @type {?} */
                    var tooltipTable = this.tooltip
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
        /**
         * @return {?}
         */
        PbdsDatavizStackedBarComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                if (this.tooltip)
                    this.tooltip.remove();
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        PbdsDatavizStackedBarComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes.data && !changes.data.firstChange) {
                    this.updateChart();
                }
            };
        PbdsDatavizStackedBarComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'pbds-dataviz-stacked-bar',
                        template: "",
                        changeDetection: i0.ChangeDetectionStrategy.OnPush
                    }] }
        ];
        /** @nocollapse */
        PbdsDatavizStackedBarComponent.ctorParameters = function () {
            return [
                { type: PbdsDatavizService },
                { type: i0.ElementRef },
                { type: common.ViewportScroller }
            ];
        };
        PbdsDatavizStackedBarComponent.propDecorators = {
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
            hovered: [{ type: i0.Output }],
            clicked: [{ type: i0.Output }]
        };
        return PbdsDatavizStackedBarComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsDatavizMetricIndicatorComponent = /** @class */ (function () {
        function PbdsDatavizMetricIndicatorComponent() {
            this.value = 0;
            this.class = '';
            this.indicator = 'flat';
            this.inverse = false;
        }
        Object.defineProperty(PbdsDatavizMetricIndicatorComponent.prototype, "hostClasses", {
            get: /**
             * @return {?}
             */ function () {
                return ['metric-block-indicator', this.indicator, this.inverse ? 'inverse' : '', this.class].join(' ');
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        PbdsDatavizMetricIndicatorComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () { };
        PbdsDatavizMetricIndicatorComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'pbds-dataviz-metric-indicator',
                        template: "\n    <span>{{ value }}</span>\n  "
                    }] }
        ];
        /** @nocollapse */
        PbdsDatavizMetricIndicatorComponent.ctorParameters = function () { return []; };
        PbdsDatavizMetricIndicatorComponent.propDecorators = {
            value: [{ type: i0.Input }],
            class: [{ type: i0.Input }],
            indicator: [{ type: i0.Input }],
            inverse: [{ type: i0.Input }],
            hostClasses: [{ type: i0.HostBinding, args: ['class',] }]
        };
        return PbdsDatavizMetricIndicatorComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsDatavizMetricBlockComponent = /** @class */ (function () {
        function PbdsDatavizMetricBlockComponent() {
            this.class = '';
            this.heading = null;
            this.value = 0;
            this.unit = null;
            this.description = null;
            this.centered = false;
            this.hideValueMargin = false;
            this.isPercentUnit = false;
            this.isUnit = false;
        }
        Object.defineProperty(PbdsDatavizMetricBlockComponent.prototype, "hostClasses", {
            get: /**
             * @return {?}
             */ function () {
                return ['metric-block', this.centered ? 'metric-block-centered' : '', this.class].join(' ');
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        PbdsDatavizMetricBlockComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
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
        PbdsDatavizMetricBlockComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'pbds-dataviz-metric-block',
                        template: "\n    <ng-content select=\"pbds-dataviz-sparkline\"></ng-content>\n\n    <div class=\"metric-block-data\">\n      <div *ngIf=\"heading\" class=\"metric-block-heading\">{{ heading }}</div>\n\n      <div class=\"metric-block-value\" [ngClass]=\"{ 'mr-0': hideValueMargin }\">\n        {{ value\n        }}<span [ngClass]=\"{ 'metric-block-unit': isUnit, 'metric-block-percentage': isPercentUnit }\">{{ unit }}</span>\n      </div>\n\n      <ng-content select=\"pbds-dataviz-metric-indicator\"></ng-content>\n\n      <div *ngIf=\"description\" class=\"metric-block-description\">{{ description }}</div>\n    </div>\n  "
                    }] }
        ];
        /** @nocollapse */
        PbdsDatavizMetricBlockComponent.ctorParameters = function () { return []; };
        PbdsDatavizMetricBlockComponent.propDecorators = {
            class: [{ type: i0.Input }],
            heading: [{ type: i0.Input }],
            value: [{ type: i0.Input }],
            unit: [{ type: i0.Input }],
            description: [{ type: i0.Input }],
            centered: [{ type: i0.Input }],
            hostClasses: [{ type: i0.HostBinding, args: ['class',] }],
            indicatorRef: [{ type: i0.ContentChild, args: [PbdsDatavizMetricIndicatorComponent,] }]
        };
        return PbdsDatavizMetricBlockComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsDatavizModule = /** @class */ (function () {
        function PbdsDatavizModule() {
        }
        PbdsDatavizModule.decorators = [
            { type: i0.NgModule, args: [{
                        declarations: [
                            PbdsDatavizPieComponent,
                            PbdsDatavizBarComponent,
                            PbdsDatavizLineComponent,
                            PbdsDatavizGaugeComponent,
                            PbdsDatavizSparklineComponent,
                            PbdsDatavizStackedBarComponent,
                            PbdsDatavizMetricBlockComponent,
                            PbdsDatavizMetricIndicatorComponent
                        ],
                        imports: [common.CommonModule],
                        exports: [
                            PbdsDatavizPieComponent,
                            PbdsDatavizBarComponent,
                            PbdsDatavizLineComponent,
                            PbdsDatavizGaugeComponent,
                            PbdsDatavizSparklineComponent,
                            PbdsDatavizStackedBarComponent,
                            PbdsDatavizMetricBlockComponent,
                            PbdsDatavizMetricIndicatorComponent
                        ]
                    },] }
        ];
        return PbdsDatavizModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsHeaderShadowDirective = /** @class */ (function () {
        function PbdsHeaderShadowDirective(_scroll) {
            this._scroll = _scroll;
        }
        /**
         * @return {?}
         */
        PbdsHeaderShadowDirective.prototype.onWindowScroll = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var offset = this._scroll.getScrollPosition();
                this.shadow = offset[1] > 20;
            };
        PbdsHeaderShadowDirective.decorators = [
            { type: i0.Directive, args: [{
                        selector: 'header.bg-brand-header'
                    },] }
        ];
        /** @nocollapse */
        PbdsHeaderShadowDirective.ctorParameters = function () {
            return [
                { type: common.ViewportScroller }
            ];
        };
        PbdsHeaderShadowDirective.propDecorators = {
            shadow: [{ type: i0.HostBinding, args: ['class.pbds-header-shadow',] }],
            onWindowScroll: [{ type: i0.HostListener, args: ['window:scroll', [],] }]
        };
        return PbdsHeaderShadowDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PbdsHeaderShadowModule = /** @class */ (function () {
        function PbdsHeaderShadowModule() {
        }
        PbdsHeaderShadowModule.decorators = [
            { type: i0.NgModule, args: [{
                        declarations: [PbdsHeaderShadowDirective],
                        imports: [common.CommonModule],
                        exports: [PbdsHeaderShadowDirective]
                    },] }
        ];
        return PbdsHeaderShadowModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.PbdsDatavizModule = PbdsDatavizModule;
    exports.PbdsDatavizService = PbdsDatavizService;
    exports.PbdsDatavizBarComponent = PbdsDatavizBarComponent;
    exports.PbdsDatavizLineComponent = PbdsDatavizLineComponent;
    exports.PbdsDatavizPieComponent = PbdsDatavizPieComponent;
    exports.PbdsDatavizGaugeComponent = PbdsDatavizGaugeComponent;
    exports.PbdsDatavizSparklineComponent = PbdsDatavizSparklineComponent;
    exports.PbdsDatavizMetricIndicatorComponent = PbdsDatavizMetricIndicatorComponent;
    exports.PbdsDatavizMetricBlockComponent = PbdsDatavizMetricBlockComponent;
    exports.PbdsHeaderShadowModule = PbdsHeaderShadowModule;
    exports.PbdsHeaderShadowDirective = PbdsHeaderShadowDirective;
    exports.ɵa = PbdsDatavizStackedBarComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=pb-design-system.umd.js.map
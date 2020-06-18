/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select, mouse as d3_mouse, event as d3_event } from 'd3-selection';
import { scaleOrdinal as d3_scaleOrdinal } from 'd3-scale';
import { pie as d3_pie, arc as d3_arc } from 'd3-shape';
import { interpolate as d3_interpolate } from 'd3-interpolate';
import { format as d3_format } from 'd3-format';
import { isoParse as d3_isoParse } from 'd3-time-format';
import { PbdsDatavizService } from './dataviz.service';
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.currentData = [];
        this.updateChart = (/**
         * @param {?=} firstRun
         * @return {?}
         */
        function (firstRun) {
            if (firstRun === void 0) { firstRun = true; }
            // slices
            _this.svg
                .selectAll('path')
                .data(_this.pie(_this.data))
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                /** @type {?} */
                var path = enter.append('path');
                path
                    .each((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return (d.outerRadius = _this.outerRadius); }))
                    .attr('fill', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.colorRange(d.data.label); }))
                    .attr('class', 'slice')
                    .each((/**
                 * @param {?} d
                 * @param {?} i
                 * @param {?} nodes
                 * @return {?}
                 */
                function (d, i, nodes) {
                    _this.currentData.splice(i, 1, d);
                }));
                if (_this.type === 'pie') {
                    path
                        .style('stroke', '#fff')
                        .style('stroke-width', 2)
                        .style('stroke-alignment', 'inner');
                }
                path.call((/**
                 * @param {?} path
                 * @return {?}
                 */
                function (path) {
                    return path
                        .transition()
                        .duration((/**
                     * @param {?} d
                     * @param {?} i
                     * @param {?} n
                     * @return {?}
                     */
                    function (d, i, n) { return (firstRun ? 0 : 500); }))
                        .attrTween('d', _this.arcEnterTween);
                }));
                return path;
            }), (/**
             * @param {?} update
             * @return {?}
             */
            function (update) {
                _this.tooltipHide();
                update
                    .each((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return (d.outerRadius = _this.outerRadius); }))
                    .call((/**
                 * @param {?} update
                 * @return {?}
                 */
                function (update) {
                    return update
                        .transition()
                        .duration(500)
                        .attrTween('d', _this.arcTween);
                }));
                return update;
            }), (/**
             * @param {?} exit
             * @return {?}
             */
            function (exit) { return exit.remove(); }))
                .on('mouseover', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) {
                _this.pathMouseOver(d3_event, data, index, nodes);
                // this.tooltipShow(this.chart.node(), data);
            }))
                .on('mousemove', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) {
                _this.tooltipShow(_this.chart.node(), data);
                _this.tooltipMove(_this.chart.node());
            }))
                .on('mouseout', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) {
                _this.pathMouseOut(data, index, nodes);
                _this.tooltipHide();
            }))
                .on('click', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) {
                _this.pathClick(d3_event, data, index, nodes);
            }));
            // legend
            _this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(_this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                /** @type {?} */
                var li = enter.append('li').attr('class', 'legend-item');
                li.append('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.colorRange(d.label); }));
                /** @type {?} */
                var description = li.append('span').attr('class', 'legend-description');
                description
                    .append('span')
                    .attr('class', 'legend-label')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) {
                    switch (_this.legendLabelFormatType) {
                        case 'time':
                            /** @type {?} */
                            var parsedTime = d3_isoParse(d.label);
                            return _this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                description
                    .append('span')
                    .attr('class', 'legend-value')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.legendValueFormat(d.value); }));
                return li;
            }), (/**
             * @param {?} update
             * @return {?}
             */
            function (update) {
                update.selectAll('.legend-key').style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.colorRange(d.label); }));
                update.select('.legend-label').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) {
                    switch (_this.legendLabelFormatType) {
                        case 'time':
                            /** @type {?} */
                            var parsedTime = d3_isoParse(d.label);
                            return _this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                update.select('.legend-value').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return _this.legendValueFormat(d.value); }));
                return update;
            }), (/**
             * @param {?} exit
             * @return {?}
             */
            function (exit) { return exit.remove(); }))
                .on('mouseover focus', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) {
                _this.legendMouseOverFocus(data, index, nodes);
                _this.pathMouseOver(d3_event, data, index, nodes);
            }))
                .on('mouseout blur', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) {
                _this.legendMouseOutBlur(data, index, nodes);
                _this.pathMouseOut(data, index, nodes);
            }))
                .on('click', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            function (data, index, nodes) {
                _this.clicked.emit({ event: d3_event, data: data });
            }));
        });
        this.arcEnterTween = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (data, index, nodes) {
            /** @type {?} */
            var i = d3_interpolate(data.startAngle, data.endAngle);
            return (/**
             * @param {?} t
             * @return {?}
             */
            function (t) {
                data.endAngle = i(t);
                return _this.arc(data);
            });
        });
        this.arcTween = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (data, index, nodes) {
            // console.log('ARGS: ', data, index, nodes);
            /** @type {?} */
            var i = d3_interpolate(_this.currentData[index], data);
            _this.currentData[index] = i(1);
            return (/**
             * @param {?} t
             * @return {?}
             */
            function (t) { return _this.arc(i(t)); });
        });
        this.arcExitTween = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (data, index, nodes) {
            /** @type {?} */
            var end = Object.assign({}, _this.currentData[index], { startAngle: _this.currentData[index].endAngle });
            /** @type {?} */
            var i = d3_interpolate(data, end);
            return (/**
             * @param {?} t
             * @return {?}
             */
            function (t) {
                return _this.arc(i(t));
            });
        });
        this.arcMouseOverTween = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (data, index, nodes) {
            /** @type {?} */
            var i = d3_interpolate(data.outerRadius, _this.outerRadius + _this.arcZoom);
            return (/**
             * @param {?} t
             * @return {?}
             */
            function (t) {
                data.outerRadius = i(t);
                return _this.arc(data);
            });
        });
        this.arcMouseOutTween = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (data, index, nodes) {
            /** @type {?} */
            var i = d3_interpolate(data.outerRadius, _this.outerRadius);
            return (/**
             * @param {?} t
             * @return {?}
             */
            function (t) {
                data.outerRadius = i(t);
                return _this.arc(data);
            });
        });
        this.legendMouseOverFocus = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (data, index, nodes) {
            _this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; }))
                .classed('inactive', true);
        });
        this.legendMouseOutBlur = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (data, index, nodes) {
            _this.chart.selectAll('.legend-item').classed('inactive', false);
        });
        this.pathMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            /** @type {?} */
            var slices = _this.chart.selectAll('.slice');
            /** @type {?} */
            var slice = slices.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i === index; }));
            _this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; }))
                .classed('inactive', true);
            slices.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; })).classed('inactive', true);
            slice
                .transition()
                .duration(300)
                .delay(0)
                .attrTween('d', _this.arcMouseOverTween);
            _this.hovered.emit({
                event: event,
                data: data.data ? data.data : data // legend hover data is different than slice hover data
            });
        });
        this.pathMouseOut = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} value
         * @return {?}
         */
        function (data, index, value) {
            /** @type {?} */
            var slices = _this.chart.selectAll('.slice');
            /** @type {?} */
            var slice = slices.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i === index; }));
            _this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return i !== index; }))
                .classed('inactive', false);
            slices.classed('inactive', false);
            slice
                .transition()
                .duration(300)
                .delay(0)
                .attrTween('d', _this.arcMouseOutTween);
        });
        this.pathClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            _this.clicked.emit({
                event: event,
                data: data.data
            });
        });
        this.tooltipShow = (/**
         * @param {?} node
         * @param {?} data
         * @return {?}
         */
        function (node, data) {
            _this.tooltipSetPosition(node);
            /** @type {?} */
            var percentage = (data.endAngle - data.startAngle) / (2 * Math.PI);
            /** @type {?} */
            var label;
            switch (_this.tooltipLabelFormatType) {
                case 'time':
                    /** @type {?} */
                    var parsedTime = d3_isoParse(data.data.label);
                    label = _this.tooltipLabelFormat(parsedTime);
                    break;
                default:
                    label = data.data.label;
            }
            _this.tooltip.html("\n        <div class=\"tooltip-label\">" + label + "</div>\n        <div class=\"tooltip-value\">" + _this.tooltipValueFormat(percentage) + "</div>\n      ");
            _this.tooltip.style('opacity', 1);
        });
        this.tooltipMove = (/**
         * @param {?} node
         * @return {?}
         */
        function (node) {
            _this.tooltipSetPosition(node);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        function () {
            _this.tooltip.style('opacity', 0);
        });
        this.tooltipSetPosition = (/**
         * @param {?} node
         * @return {?}
         */
        function (node) {
            /** @type {?} */
            var coordinates = d3_mouse(node);
            _this.tooltip.style('left', coordinates[0] + 16 + "px");
            _this.tooltip.style('top', coordinates[1] + 16 + "px");
        });
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
        this.colors = this._dataviz.getColors(this.monochrome, this.theme);
        this.innerRadius = Math.min(this.width, this.height) / 2.5;
        this.outerRadius = Math.min(this.width, this.height) / 2;
        this.arcZoom = 10;
        this.anglePad = 0.02;
        this.legendValueFormat = d3_format(this.legendValueFormatString);
        this.tooltipValueFormat = d3_format(this.tooltipValueFormatString);
        // create formatters
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipLabelFormat = this._dataviz.d3Format(this.tooltipLabelFormatType, this.tooltipLabelFormatString);
        this.colorRange = d3_scaleOrdinal()
            .range(this.colors)
            .domain(this.data.map((/**
         * @param {?} c
         * @return {?}
         */
        function (c) { return c.label; })));
        if (this.type === 'pie') {
            this.innerRadius = 0;
            this.anglePad = 0;
        }
        this.pie = d3_pie()
            .padAngle(this.anglePad)
            .value((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.value; }))
            .sort(null);
        this.arc = d3_arc()
            .padRadius(this.outerRadius)
            .innerRadius(this.innerRadius);
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
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
            this.updateChart(false);
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
        { type: Component, args: [{
                    selector: 'pbds-dataviz-pie',
                    template: "",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizPieComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: ElementRef }
    ]; };
    PbdsDatavizPieComponent.propDecorators = {
        chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
        pieClass: [{ type: HostBinding, args: ['class.pbds-chart-pie',] }],
        data: [{ type: Input }],
        width: [{ type: Input }],
        type: [{ type: Input }],
        monochrome: [{ type: Input }],
        legendLabelFormatType: [{ type: Input }],
        legendLabelFormatString: [{ type: Input }],
        legendValueFormatString: [{ type: Input }],
        tooltipLabelFormatType: [{ type: Input }],
        tooltipLabelFormatString: [{ type: Input }],
        tooltipValueFormatString: [{ type: Input }],
        theme: [{ type: Input }],
        hovered: [{ type: Output }],
        clicked: [{ type: Output }]
    };
    return PbdsDatavizPieComponent;
}());
export { PbdsDatavizPieComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.pieClass;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.type;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.monochrome;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.legendValueFormatString;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.currentData;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.height;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.colors;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.arc;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.arcZoom;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.pie;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.legendValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.innerRadius;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.anglePad;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.outerRadius;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.tooltipLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.tooltipValueFormat;
    /** @type {?} */
    PbdsDatavizPieComponent.prototype.updateChart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.arcEnterTween;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.arcTween;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.arcExitTween;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.arcMouseOverTween;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.arcMouseOutTween;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.legendMouseOverFocus;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.legendMouseOutBlur;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.pathMouseOver;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.pathMouseOut;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.pathClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.tooltipMove;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype.tooltipSetPosition;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizPieComponent.prototype._element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1waWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFdBQVcsRUFHWCxNQUFNLEVBQ04sWUFBWSxFQUNaLHVCQUF1QixFQUV4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxLQUFLLElBQUksUUFBUSxFQUFFLEtBQUssSUFBSSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekYsT0FBTyxFQUFFLFlBQVksSUFBSSxlQUFlLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDM0QsT0FBTyxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2hELE9BQU8sRUFBRSxRQUFRLElBQUksV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFekQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHdkQ7SUF1RUUsaUNBQW9CLFFBQTRCLEVBQVUsUUFBb0I7UUFBOUUsaUJBQWtGO1FBQTlELGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQS9EOUUsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixhQUFRLEdBQUcsSUFBSSxDQUFDO1FBTWhCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFHWixTQUFJLEdBQW9CLEtBQUssQ0FBQztRQUc5QixlQUFVLEdB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bkluaXQsXG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCwgbW91c2UgYXMgZDNfbW91c2UsIGV2ZW50IGFzIGQzX2V2ZW50IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IHNjYWxlT3JkaW5hbCBhcyBkM19zY2FsZU9yZGluYWwgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBwaWUgYXMgZDNfcGllLCBhcmMgYXMgZDNfYXJjIH0gZnJvbSAnZDMtc2hhcGUnO1xuaW1wb3J0IHsgaW50ZXJwb2xhdGUgYXMgZDNfaW50ZXJwb2xhdGUgfSBmcm9tICdkMy1pbnRlcnBvbGF0ZSc7XG5pbXBvcnQgeyBmb3JtYXQgYXMgZDNfZm9ybWF0IH0gZnJvbSAnZDMtZm9ybWF0JztcbmltcG9ydCB7IGlzb1BhcnNlIGFzIGQzX2lzb1BhcnNlIH0gZnJvbSAnZDMtdGltZS1mb3JtYXQnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpelBpZSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LXBpZScsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVVcmxzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpQaWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LXBpZScpXG4gIHBpZUNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpelBpZT47XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAzMDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ3BpZScgfCAnZG9udXQnID0gJ3BpZSc7XG5cbiAgQElucHV0KClcbiAgbW9ub2Nocm9tZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0VHlwZTogJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0VHlwZTogJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0aGVtZTtcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGN1cnJlbnREYXRhID0gW107XG4gIHByaXZhdGUgaGVpZ2h0O1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIG1hcmdpbjtcbiAgcHJpdmF0ZSBjb2xvcnM7XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBhcmM7XG4gIHByaXZhdGUgYXJjWm9vbTtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgcGllO1xuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xuICBwcml2YXRlIGxlZ2VuZFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIGlubmVyUmFkaXVzO1xuICBwcml2YXRlIGFuZ2xlUGFkO1xuICBwcml2YXRlIG91dGVyUmFkaXVzO1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgdG9vbHRpcExhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7IHRvcDogMTAsIHJpZ2h0OiAxMCwgYm90dG9tOiAxMCwgbGVmdDogMTAgfTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi50b3AgLSB0aGlzLm1hcmdpbi5ib3R0b207XG4gICAgdGhpcy5jb2xvcnMgPSB0aGlzLl9kYXRhdml6LmdldENvbG9ycyh0aGlzLm1vbm9jaHJvbWUsIHRoaXMudGhlbWUpO1xuICAgIHRoaXMuaW5uZXJSYWRpdXMgPSBNYXRoLm1pbih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCkgLyAyLjU7XG4gICAgdGhpcy5vdXRlclJhZGl1cyA9IE1hdGgubWluKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KSAvIDI7XG4gICAgdGhpcy5hcmNab29tID0gMTA7XG4gICAgdGhpcy5hbmdsZVBhZCA9IDAuMDI7XG4gICAgdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyk7XG5cbiAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZU9yZGluYWwoKVxuICAgICAgLnJhbmdlKHRoaXMuY29sb3JzKVxuICAgICAgLmRvbWFpbih0aGlzLmRhdGEubWFwKGMgPT4gYy5sYWJlbCkpO1xuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3BpZScpIHtcbiAgICAgIHRoaXMuaW5uZXJSYWRpdXMgPSAwO1xuICAgICAgdGhpcy5hbmdsZVBhZCA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5waWUgPSBkM19waWUoKVxuICAgICAgLnBhZEFuZ2xlKHRoaXMuYW5nbGVQYWQpXG4gICAgICAudmFsdWUoKGQ6IGFueSkgPT4gZC52YWx1ZSlcbiAgICAgIC5zb3J0KG51bGwpO1xuXG4gICAgdGhpcy5hcmMgPSBkM19hcmMoKVxuICAgICAgLnBhZFJhZGl1cyh0aGlzLm91dGVyUmFkaXVzKVxuICAgICAgLmlubmVyUmFkaXVzKHRoaXMuaW5uZXJSYWRpdXMpO1xuXG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMud2lkdGggLyAyICsgdGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5oZWlnaHQgLyAyICsgdGhpcy5tYXJnaW4udG9wfSAke3RoaXMud2lkdGggK1xuICAgICAgICAgIHRoaXMubWFyZ2luLmxlZnQgK1xuICAgICAgICAgIHRoaXMubWFyZ2luLnJpZ2h0fSAke3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tfWBcbiAgICAgICk7XG5cbiAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsICdsZWdlbmQgbGVnZW5kLXJpZ2h0Jyk7XG5cbiAgICB0aGlzLnRvb2x0aXAgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAnKVxuICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKGZpcnN0UnVuID0gdHJ1ZSkgPT4ge1xuICAgIC8vIHNsaWNlc1xuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5kYXRhKHRoaXMucGllKHRoaXMuZGF0YSkpXG4gICAgICAuam9pbihcbiAgICAgICAgZW50ZXIgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhdGggPSBlbnRlci5hcHBlbmQoJ3BhdGgnKTtcblxuICAgICAgICAgIHBhdGhcbiAgICAgICAgICAgIC5lYWNoKChkOiBhbnkpID0+IChkLm91dGVyUmFkaXVzID0gdGhpcy5vdXRlclJhZGl1cykpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsIChkOiBhbnkpID0+IHRoaXMuY29sb3JSYW5nZShkLmRhdGEubGFiZWwpKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NsaWNlJylcbiAgICAgICAgICAgIC5lYWNoKChkLCBpLCBub2RlcykgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRhLnNwbGljZShpLCAxLCBkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ3BpZScpIHtcbiAgICAgICAgICAgIHBhdGhcbiAgICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnI2ZmZicpXG4gICAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgMilcbiAgICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UtYWxpZ25tZW50JywgJ2lubmVyJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGF0aC5jYWxsKHBhdGggPT5cbiAgICAgICAgICAgIHBhdGhcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oKGQsIGksIG4pID0+IChmaXJzdFJ1biA/IDAgOiA1MDApKVxuICAgICAgICAgICAgICAuYXR0clR3ZWVuKCdkJywgdGhpcy5hcmNFbnRlclR3ZWVuKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlID0+IHtcbiAgICAgICAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC5lYWNoKChkOiBhbnkpID0+IChkLm91dGVyUmFkaXVzID0gdGhpcy5vdXRlclJhZGl1cykpXG4gICAgICAgICAgICAuY2FsbCh1cGRhdGUgPT5cbiAgICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgLmF0dHJUd2VlbignZCcsIHRoaXMuYXJjVHdlZW4pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMucGF0aE1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKTtcbiAgICAgICAgLy8gdGhpcy50b29sdGlwU2hvdyh0aGlzLmNoYXJ0Lm5vZGUoKSwgZGF0YSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW1vdmUnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMudG9vbHRpcFNob3codGhpcy5jaGFydC5ub2RlKCksIGRhdGEpO1xuICAgICAgICB0aGlzLnRvb2x0aXBNb3ZlKHRoaXMuY2hhcnQubm9kZSgpKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgICAgICB0aGlzLnBhdGhNb3VzZU91dChkYXRhLCBpbmRleCwgbm9kZXMpO1xuICAgICAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICAgICAgdGhpcy5wYXRoQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICB9KTtcblxuICAgIC8vIGxlZ2VuZFxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICBlbnRlciA9PiB7XG4gICAgICAgICAgY29uc3QgbGkgPSBlbnRlci5hcHBlbmQoJ2xpJykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKTtcblxuICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWtleScpXG4gICAgICAgICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCAoZDogYW55KSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpO1xuXG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBsaS5hcHBlbmQoJ3NwYW4nKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtZGVzY3JpcHRpb24nKTtcblxuICAgICAgICAgIGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKVxuICAgICAgICAgICAgLmh0bWwoKGQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkZXNjcmlwdGlvblxuICAgICAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLXZhbHVlJylcbiAgICAgICAgICAgIC5odG1sKChkOiBhbnkpID0+IHRoaXMubGVnZW5kVmFsdWVGb3JtYXQoZC52YWx1ZSkpO1xuXG4gICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGUgPT4ge1xuICAgICAgICAgIHVwZGF0ZS5zZWxlY3RBbGwoJy5sZWdlbmQta2V5Jykuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCAoZDogYW55KSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpO1xuXG4gICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1sYWJlbCcpLmh0bWwoKGQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtdmFsdWUnKS5odG1sKChkOiBhbnkpID0+IHRoaXMubGVnZW5kVmFsdWVGb3JtYXQoZC52YWx1ZSkpO1xuXG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICApXG5cbiAgICAgIC5vbignbW91c2VvdmVyIGZvY3VzJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgICAgICB0aGlzLmxlZ2VuZE1vdXNlT3ZlckZvY3VzKGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICAgIHRoaXMucGF0aE1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0IGJsdXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMubGVnZW5kTW91c2VPdXRCbHVyKGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICAgIHRoaXMucGF0aE1vdXNlT3V0KGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICAgICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudDogZDNfZXZlbnQsIGRhdGE6IGRhdGEgfSk7XG4gICAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIGFyY0VudGVyVHdlZW4gPSAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgY29uc3QgaSA9IGQzX2ludGVycG9sYXRlKGRhdGEuc3RhcnRBbmdsZSwgZGF0YS5lbmRBbmdsZSk7XG4gICAgcmV0dXJuIHQgPT4ge1xuICAgICAgZGF0YS5lbmRBbmdsZSA9IGkodCk7XG4gICAgICByZXR1cm4gdGhpcy5hcmMoZGF0YSk7XG4gICAgfTtcbiAgfTtcblxuICBwcml2YXRlIGFyY1R3ZWVuID0gKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdBUkdTOiAnLCBkYXRhLCBpbmRleCwgbm9kZXMpO1xuICAgIGNvbnN0IGkgPSBkM19pbnRlcnBvbGF0ZSh0aGlzLmN1cnJlbnREYXRhW2luZGV4XSwgZGF0YSk7XG5cbiAgICB0aGlzLmN1cnJlbnREYXRhW2luZGV4XSA9IGkoMSk7XG4gICAgcmV0dXJuIHQgPT4gdGhpcy5hcmMoaSh0KSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBhcmNFeGl0VHdlZW4gPSAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgY29uc3QgZW5kID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50RGF0YVtpbmRleF0sIHsgc3RhcnRBbmdsZTogdGhpcy5jdXJyZW50RGF0YVtpbmRleF0uZW5kQW5nbGUgfSk7XG4gICAgY29uc3QgaSA9IGQzX2ludGVycG9sYXRlKGRhdGEsIGVuZCk7XG5cbiAgICByZXR1cm4gdCA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hcmMoaSh0KSk7XG4gICAgfTtcbiAgfTtcblxuICBwcml2YXRlIGFyY01vdXNlT3ZlclR3ZWVuID0gKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGNvbnN0IGkgPSBkM19pbnRlcnBvbGF0ZShkYXRhLm91dGVyUmFkaXVzLCB0aGlzLm91dGVyUmFkaXVzICsgdGhpcy5hcmNab29tKTtcblxuICAgIHJldHVybiB0ID0+IHtcbiAgICAgIGRhdGEub3V0ZXJSYWRpdXMgPSBpKHQpO1xuICAgICAgcmV0dXJuIHRoaXMuYXJjKGRhdGEpO1xuICAgIH07XG4gIH07XG5cbiAgcHJpdmF0ZSBhcmNNb3VzZU91dFR3ZWVuID0gKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGNvbnN0IGkgPSBkM19pbnRlcnBvbGF0ZShkYXRhLm91dGVyUmFkaXVzLCB0aGlzLm91dGVyUmFkaXVzKTtcbiAgICByZXR1cm4gdCA9PiB7XG4gICAgICBkYXRhLm91dGVyUmFkaXVzID0gaSh0KTtcbiAgICAgIHJldHVybiB0aGlzLmFyYyhkYXRhKTtcbiAgICB9O1xuICB9O1xuXG4gIHByaXZhdGUgbGVnZW5kTW91c2VPdmVyRm9jdXMgPSAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBsZWdlbmRNb3VzZU91dEJsdXIgPSAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuICB9O1xuXG4gIHByaXZhdGUgcGF0aE1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgY29uc3Qgc2xpY2VzID0gdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5zbGljZScpO1xuICAgIGNvbnN0IHNsaWNlID0gc2xpY2VzLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBzbGljZXMuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleCkuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHNsaWNlXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMzAwKVxuICAgICAgLmRlbGF5KDApXG4gICAgICAuYXR0clR3ZWVuKCdkJywgdGhpcy5hcmNNb3VzZU92ZXJUd2Vlbik7XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7XG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICBkYXRhOiBkYXRhLmRhdGEgPyBkYXRhLmRhdGEgOiBkYXRhIC8vIGxlZ2VuZCBob3ZlciBkYXRhIGlzIGRpZmZlcmVudCB0aGFuIHNsaWNlIGhvdmVyIGRhdGFcbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIHBhdGhNb3VzZU91dCA9IChkYXRhLCBpbmRleCwgdmFsdWUpID0+IHtcbiAgICBjb25zdCBzbGljZXMgPSB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLnNsaWNlJyk7XG4gICAgY29uc3Qgc2xpY2UgPSBzbGljZXMuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleCk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICBzbGljZXMuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICBzbGljZVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDMwMClcbiAgICAgIC5kZWxheSgwKVxuICAgICAgLmF0dHJUd2VlbignZCcsIHRoaXMuYXJjTW91c2VPdXRUd2Vlbik7XG4gIH07XG5cbiAgcHJpdmF0ZSBwYXRoQ2xpY2sgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHtcbiAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgIGRhdGE6IGRhdGEuZGF0YVxuICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAobm9kZSwgZGF0YSkgPT4ge1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKG5vZGUpO1xuXG4gICAgY29uc3QgcGVyY2VudGFnZSA9IChkYXRhLmVuZEFuZ2xlIC0gZGF0YS5zdGFydEFuZ2xlKSAvICgyICogTWF0aC5QSSk7XG4gICAgbGV0IGxhYmVsO1xuXG4gICAgc3dpdGNoICh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZGF0YS5kYXRhLmxhYmVsKTtcbiAgICAgICAgbGFiZWwgPSB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxhYmVsID0gZGF0YS5kYXRhLmxhYmVsO1xuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcC5odG1sKFxuICAgICAgYFxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC1sYWJlbFwiPiR7bGFiZWx9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlXCI+JHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChwZXJjZW50YWdlKX08L2Rpdj5cbiAgICAgIGBcbiAgICApO1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwTW92ZSA9IG5vZGUgPT4ge1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKG5vZGUpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2V0UG9zaXRpb24gPSBub2RlID0+IHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGQzX21vdXNlKG5vZGUpO1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7Y29vcmRpbmF0ZXNbMF0gKyAxNn1weGApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7Y29vcmRpbmF0ZXNbMV0gKyAxNn1weGApO1xuICB9O1xufVxuIl19
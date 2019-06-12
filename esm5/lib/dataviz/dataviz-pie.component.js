/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select, scaleOrdinal as d3_scaleOrdinal, pie as d3_pie, arc as d3_arc, interpolate as d3_interpolate, mouse as d3_mouse, format as d3_format, event as d3_event, timeFormat as d3_timeFormat, isoParse as d3_isoParse } from 'd3';
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
                        var parsedTime = d3_isoParse(d.label);
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
                        var parsedTime = d3_isoParse(d.label);
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
                _this.pathMouseOver(d3_event, data, index, nodes);
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
                _this.pathMouseOver(d3_event, data, index, nodes);
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
                _this.pathClick(d3_event, data, index, nodes);
            });
        };
        this.arcTween = function (data, index, nodes) {
            // console.log('ARGS: ', data, index, nodes);
            /** @type {?} */
            var i = d3_interpolate(_this.currentData[index], data);
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
                var i = d3_interpolate(d.outerRadius, _this.outerRadius + _this.arcZoom);
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
                var i = d3_interpolate(d.outerRadius, _this.outerRadius);
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
                    var parsedTime = d3_isoParse(data.data.label);
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
            var coordinates = d3_mouse(node);
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
        this.legendValueFormat = d3_format(this.legendValueFormatString);
        this.tooltipValueFormat = d3_format(this.tooltipValueFormatString);
        switch (this.legendLabelFormatType) {
            case 'time':
                this.legendLabelFormat = d3_timeFormat(this.legendLabelFormatString);
                break;
            default:
                this.legendLabelFormat = null;
                break;
        }
        switch (this.tooltipLabelFormatType) {
            case 'time':
                this.tooltipLabelFormat = d3_timeFormat(this.tooltipLabelFormatString);
                break;
            default:
                this.tooltipLabelFormat = null;
                break;
        }
        this.colorRange = d3_scaleOrdinal()
            .range(this.colors)
            .domain(this.data.map(function (c) { return c.label; }));
        if (this.type === 'pie') {
            this.innerRadius = 0;
            this.anglePad = 0;
        }
        this.pie = d3_pie()
            .padAngle(this.anglePad)
            .value(function (d) { return d.value; })
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
    PbdsDatavizPieComponent.prototype.legend;
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
    PbdsDatavizPieComponent.prototype.arcTween;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1waWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFdBQVcsRUFHWCxNQUFNLEVBQ04sWUFBWSxFQUNaLHVCQUF1QixFQUV4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsTUFBTSxJQUFJLFNBQVMsRUFDbkIsWUFBWSxJQUFJLGVBQWUsRUFDL0IsR0FBRyxJQUFJLE1BQU0sRUFDYixHQUFHLElBQUksTUFBTSxFQUNiLFdBQVcsSUFBSSxjQUFjLEVBQzdCLEtBQUssSUFBSSxRQUFRLEVBQ2pCLE1BQU0sSUFBSSxTQUFTLEVBQ25CLEtBQUssSUFBSSxRQUFRLEVBQ2pCLFVBQVUsSUFBSSxhQUFhLEVBQzNCLFFBQVEsSUFBSSxXQUFXLEVBQ3hCLE1BQU0sSUFBSSxDQUFDO0FBRVosT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHdkQ7SUFxRUUsaUNBQW9CLFFBQTRCLEVBQVUsUUFBb0I7UUFBOUUsaUJBQWtGO1FBQTlELGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQTdEOUUsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixhQUFRLEdBQUcsSUFBSSxDQUFDO1FBTWhCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFHWixTQUFJLEdBQW9CLEtBQUssQ0FBQztRQUc5QixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBR25CLDBCQUFxQixHQUFXLElBQUksQ0FBQztRQUdyQyw0QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFHN0IsNEJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBRzdCLDJCQUFzQixHQUFXLElBQUksQ0FBQztRQUd0Qyw2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QUVFOzs7OztJQUVGLHFEQUtFOzs7OztJQS9UVSwyQ0FBb0M7Ozs7O0lBQUUsMkNBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgc2VsZWN0IGFzIGQzX3NlbGVjdCxcbiAgc2NhbGVPcmRpbmFsIGFzIGQzX3NjYWxlT3JkaW5hbCxcbiAgcGllIGFzIGQzX3BpZSxcbiAgYXJjIGFzIGQzX2FyYyxcbiAgaW50ZXJwb2xhdGUgYXMgZDNfaW50ZXJwb2xhdGUsXG4gIG1vdXNlIGFzIGQzX21vdXNlLFxuICBmb3JtYXQgYXMgZDNfZm9ybWF0LFxuICBldmVudCBhcyBkM19ldmVudCxcbiAgdGltZUZvcm1hdCBhcyBkM190aW1lRm9ybWF0LFxuICBpc29QYXJzZSBhcyBkM19pc29QYXJzZVxufSBmcm9tICdkMyc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6UGllIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotcGllJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZVVybHM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelBpZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtcGllJylcbiAgcGllQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6UGllPjtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAncGllJyB8ICdkb251dCcgPSAncGllJztcblxuICBASW5wdXQoKVxuICBtb25vY2hyb21lID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRUeXBlOiAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBPdXRwdXQoKVxuICBob3ZlcmVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBPdXRwdXQoKVxuICBjbGlja2VkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIHByaXZhdGUgY3VycmVudERhdGEgPSBbXTtcbiAgcHJpdmF0ZSBoZWlnaHQ7XG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNvbG9ycztcbiAgcHJpdmF0ZSBjb2xvclJhbmdlO1xuICBwcml2YXRlIGFyYztcbiAgcHJpdmF0ZSBhcmNab29tO1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBwaWU7XG4gIHByaXZhdGUgbGVnZW5kO1xuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xuICBwcml2YXRlIGxlZ2VuZFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIGlubmVyUmFkaXVzO1xuICBwcml2YXRlIGFuZ2xlUGFkO1xuICBwcml2YXRlIG91dGVyUmFkaXVzO1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgdG9vbHRpcExhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7IHRvcDogMTAsIHJpZ2h0OiAxMCwgYm90dG9tOiAxMCwgbGVmdDogMTAgfTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi50b3AgLSB0aGlzLm1hcmdpbi5ib3R0b207XG4gICAgdGhpcy5jb2xvcnMgPSB0aGlzLl9kYXRhdml6LmdldENvbG9ycyh0aGlzLm1vbm9jaHJvbWUpO1xuICAgIHRoaXMuaW5uZXJSYWRpdXMgPSBNYXRoLm1pbih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCkgLyAyLjU7XG4gICAgdGhpcy5vdXRlclJhZGl1cyA9IE1hdGgubWluKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KSAvIDI7XG4gICAgdGhpcy5hcmNab29tID0gMTA7XG4gICAgdGhpcy5hbmdsZVBhZCA9IDAuMDI7XG4gICAgdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IGQzX3RpbWVGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgdGhpcy50b29sdGlwTGFiZWxGb3JtYXQgPSBkM190aW1lRm9ybWF0KHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdCA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpXG4gICAgICAucmFuZ2UodGhpcy5jb2xvcnMpXG4gICAgICAuZG9tYWluKHRoaXMuZGF0YS5tYXAoYyA9PiBjLmxhYmVsKSk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAncGllJykge1xuICAgICAgdGhpcy5pbm5lclJhZGl1cyA9IDA7XG4gICAgICB0aGlzLmFuZ2xlUGFkID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLnBpZSA9IGQzX3BpZSgpXG4gICAgICAucGFkQW5nbGUodGhpcy5hbmdsZVBhZClcbiAgICAgIC52YWx1ZSgoZDogYW55KSA9PiBkLnZhbHVlKVxuICAgICAgLnNvcnQobnVsbCk7XG5cbiAgICB0aGlzLmFyYyA9IGQzX2FyYygpXG4gICAgICAucGFkUmFkaXVzKHRoaXMub3V0ZXJSYWRpdXMpXG4gICAgICAuaW5uZXJSYWRpdXModGhpcy5pbm5lclJhZGl1cyk7XG5cbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy53aWR0aCAvIDIgKyB0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLmhlaWdodCAvIDIgKyB0aGlzLm1hcmdpbi50b3B9ICR7dGhpcy53aWR0aCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4ubGVmdCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4ucmlnaHR9ICR7dGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b219YFxuICAgICAgKTtcblxuICAgIHRoaXMubGVnZW5kID0gdGhpcy5jaGFydC5hcHBlbmQoJ3VsJykuYXR0cignY2xhc3MnLCAnbGVnZW5kIGxlZ2VuZC1yaWdodCcpO1xuXG4gICAgdGhpcy50b29sdGlwID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAuYXR0cignY2xhc3MnLCAncGJkcy10b29sdGlwJylcbiAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgbGV0IHBhdGhzID0gdGhpcy5zdmcuc2VsZWN0QWxsKCdwYXRoJykuZGF0YSh0aGlzLnBpZSh0aGlzLmRhdGEpKTtcblxuICAgIHBhdGhzLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgIC8vdXBkYXRlIGV4aXN0aW5nIGl0ZW1zXG4gICAgcGF0aHNcbiAgICAgIC5lYWNoKChkOiBhbnkpID0+IChkLm91dGVyUmFkaXVzID0gdGhpcy5vdXRlclJhZGl1cykpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgLmF0dHJUd2VlbignZCcsIHRoaXMuYXJjVHdlZW4pO1xuXG4gICAgLy8gcGF0aHMgb24gZW50ZXJcbiAgICBsZXQgZW50ZXJQYXRocyA9IHBhdGhzXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuZWFjaCgoZDogYW55KSA9PiAoZC5vdXRlclJhZGl1cyA9IHRoaXMub3V0ZXJSYWRpdXMpKVxuICAgICAgLmF0dHIoJ2QnLCB0aGlzLmFyYylcbiAgICAgIC5hdHRyKCdmaWxsJywgKGQ6IGFueSkgPT4gdGhpcy5jb2xvclJhbmdlKGQuZGF0YS5sYWJlbCkpXG4gICAgICAuYXR0cignY2xhc3MnLCAnc2xpY2UnKVxuICAgICAgLmVhY2goKGQsIGksIG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMuY3VycmVudERhdGEuc3BsaWNlKGksIDEsIGQpO1xuICAgICAgfSk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAncGllJykge1xuICAgICAgZW50ZXJQYXRoc1xuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmJylcbiAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAyKVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZS1hbGlnbm1lbnQnLCAnaW5uZXInKTtcbiAgICB9XG5cbiAgICBsZXQgbGVnZW5kSXRlbSA9IHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSk7XG5cbiAgICBsZWdlbmRJdGVtLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgIC8vIHVwZGF0ZSBleGlzdGluZyBpdGVtc1xuICAgIGxlZ2VuZEl0ZW0uc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbCgoZDogYW55KSA9PiB7XG4gICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGVnZW5kSXRlbS5zZWxlY3QoJy5sZWdlbmQtdmFsdWUnKS5odG1sKChkOiBhbnkpID0+IHRoaXMubGVnZW5kVmFsdWVGb3JtYXQoZC52YWx1ZSkpO1xuXG4gICAgLy8gbGVnZW5kIGl0ZW1zIG9uIGVudGVyXG4gICAgbGV0IGVudGVyTGVnZW5kSXRlbSA9IGxlZ2VuZEl0ZW1cbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdsaScpXG4gICAgICAuYXR0cigndGFiaW5kZXgnLCAwKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJyk7XG5cbiAgICBlbnRlckxlZ2VuZEl0ZW1cbiAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1rZXknKVxuICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgKGQ6IGFueSkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKTtcblxuICAgIGNvbnN0IGxlZ2VuZERlc2NyaXB0aW9uID0gZW50ZXJMZWdlbmRJdGVtLmFwcGVuZCgnc3BhbicpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1kZXNjcmlwdGlvbicpO1xuXG4gICAgbGVnZW5kRGVzY3JpcHRpb25cbiAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAuaHRtbCgoZDogYW55KSA9PiB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGxlZ2VuZERlc2NyaXB0aW9uXG4gICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtdmFsdWUnKVxuICAgICAgLmh0bWwoKGQ6IGFueSkgPT4gdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdChkLnZhbHVlKSk7XG5cbiAgICBlbnRlckxlZ2VuZEl0ZW1cbiAgICAgIC5vbignbW91c2VvdmVyIGZvY3VzJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgICAgICB0aGlzLmxlZ2VuZE1vdXNlT3ZlckZvY3VzKGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICAgIHRoaXMucGF0aE1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0IGJsdXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMubGVnZW5kTW91c2VPdXRCbHVyKGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICAgIHRoaXMucGF0aE1vdXNlT3V0KGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICAgICAgdGhpcy5jbGlja2VkLmVtaXQoZGF0YSk7XG4gICAgICB9KTtcblxuICAgIGVudGVyUGF0aHNcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgICAgICB0aGlzLnBhdGhNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICAgIHRoaXMudG9vbHRpcFNob3codGhpcy5jaGFydC5ub2RlKCksIGRhdGEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2Vtb3ZlJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgICAgICB0aGlzLnRvb2x0aXBNb3ZlKHRoaXMuY2hhcnQubm9kZSgpKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgICAgICB0aGlzLnBhdGhNb3VzZU91dChkYXRhLCBpbmRleCwgbm9kZXMpO1xuICAgICAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICAgICAgdGhpcy5wYXRoQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIGFyY1R3ZWVuID0gKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdBUkdTOiAnLCBkYXRhLCBpbmRleCwgbm9kZXMpO1xuICAgIGNvbnN0IGkgPSBkM19pbnRlcnBvbGF0ZSh0aGlzLmN1cnJlbnREYXRhW2luZGV4XSwgZGF0YSk7XG5cbiAgICB0aGlzLmN1cnJlbnREYXRhW2luZGV4XSA9IGkoMSk7XG4gICAgcmV0dXJuIHQgPT4gdGhpcy5hcmMoaSh0KSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBsZWdlbmRNb3VzZU92ZXJGb2N1cyA9IChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcbiAgfTtcblxuICBwcml2YXRlIGxlZ2VuZE1vdXNlT3V0Qmx1ciA9IChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBwYXRoTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICBsZXQgc2xpY2VzID0gdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5zbGljZScpO1xuICAgIGxldCBzbGljZSA9IHNsaWNlcy5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGluZGV4KTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgc2xpY2VzLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBzbGljZVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDMwMClcbiAgICAgIC5kZWxheSgwKVxuICAgICAgLmF0dHJUd2VlbignZCcsIChkOiBhbnkpID0+IHtcbiAgICAgICAgbGV0IGkgPSBkM19pbnRlcnBvbGF0ZShkLm91dGVyUmFkaXVzLCB0aGlzLm91dGVyUmFkaXVzICsgdGhpcy5hcmNab29tKTtcbiAgICAgICAgcmV0dXJuIHQgPT4ge1xuICAgICAgICAgIGQub3V0ZXJSYWRpdXMgPSBpKHQpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmFyYyhkKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoe1xuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgZGF0YTogZGF0YS5kYXRhID8gZGF0YS5kYXRhIDogZGF0YSAvLyBsZWdlbmQgaG92ZXIgZGF0YSBpcyBkaWZmZXJlbnQgdGhhbiBzbGljZSBob3ZlciBkYXRhXG4gICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBwYXRoTW91c2VPdXQgPSAoZGF0YSwgaW5kZXgsIHZhbHVlKSA9PiB7XG4gICAgbGV0IHNsaWNlcyA9IHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuc2xpY2UnKTtcbiAgICBsZXQgc2xpY2UgPSBzbGljZXMuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleCk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICBzbGljZXMuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICBzbGljZVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDMwMClcbiAgICAgIC5kZWxheSgwKVxuICAgICAgLmF0dHJUd2VlbignZCcsIChkOiBhbnkpID0+IHtcbiAgICAgICAgbGV0IGkgPSBkM19pbnRlcnBvbGF0ZShkLm91dGVyUmFkaXVzLCB0aGlzLm91dGVyUmFkaXVzKTtcbiAgICAgICAgcmV0dXJuIHQgPT4ge1xuICAgICAgICAgIGQub3V0ZXJSYWRpdXMgPSBpKHQpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmFyYyhkKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgcGF0aENsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7XG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICBkYXRhOiBkYXRhLmRhdGFcbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKG5vZGUsIGRhdGEpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBTZXRQb3NpdGlvbihub2RlKTtcblxuICAgIGxldCBwZXJjZW50YWdlID0gKGRhdGEuZW5kQW5nbGUgLSBkYXRhLnN0YXJ0QW5nbGUpIC8gKDIgKiBNYXRoLlBJKTtcbiAgICBsZXQgbGFiZWw7XG5cbiAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkYXRhLmRhdGEubGFiZWwpO1xuICAgICAgICBsYWJlbCA9IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGFiZWwgPSBkYXRhLmRhdGEubGFiZWw7XG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwLmh0bWwoXG4gICAgICBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLWxhYmVsXCI+JHtsYWJlbH08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRvb2x0aXAtdmFsdWVcIj4ke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KHBlcmNlbnRhZ2UpfTwvZGl2PlxuICAgICAgYFxuICAgICk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBNb3ZlID0gbm9kZSA9PiB7XG4gICAgdGhpcy50b29sdGlwU2V0UG9zaXRpb24obm9kZSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTZXRQb3NpdGlvbiA9IG5vZGUgPT4ge1xuICAgIGxldCBjb29yZGluYXRlcyA9IGQzX21vdXNlKG5vZGUpO1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7Y29vcmRpbmF0ZXNbMF0gKyAxNn1weGApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7Y29vcmRpbmF0ZXNbMV0gKyAxNn1weGApO1xuICB9O1xufVxuIl19
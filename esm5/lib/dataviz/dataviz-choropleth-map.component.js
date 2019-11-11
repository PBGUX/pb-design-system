/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, format as d3_format, scaleLinear as d3_scaleLinear, axisBottom as d3_axisBottom, range as d3_range, min as d3_min, max as d3_max, event as d3_event, mouse as d3_mouse, geoPath as d3_geoPath, geoAlbers as d3_geoAlbers, geoAlbersUsa as d3_geoAlbersUsa, geoMercator as d3_geoMercator, scaleThreshold as d3_scaleThreshold, scaleQuantile as d3_scaleQuantile, scaleQuantize as d3_scaleQuantize } from 'd3';
import * as topojson from 'topojson';
import { PbdsDatavizService } from './dataviz.service';
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (/**
         * @return {?}
         */
        function () {
            _this.svg
                .select('.map')
                .selectAll('path')
                .style('fill', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                /** @type {?} */
                var match = _this.data.find((/**
                 * @param {?} obj
                 * @return {?}
                 */
                function (obj) { return obj[_this.dataField] === d[_this.dataField]; }));
                if (match) {
                    return _this.colorRange(match.value);
                }
            }))
                .classed('hasData', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) {
                return _this.data.some((/**
                 * @param {?} obj
                 * @return {?}
                 */
                function (obj) { return obj[_this.dataField] === d[_this.dataField]; }));
            }));
            if (!_this.hideTooltip) {
                _this.svg
                    .select('.map')
                    .selectAll('path')
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) {
                    return _this.featureMouseOver(d3_event, _this.data.find((/**
                     * @param {?} obj
                     * @return {?}
                     */
                    function (obj) { return obj[_this.dataField] === data[_this.dataField]; })), index, nodes);
                }))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.featureMouseOut(d3_event, _this.data, index, nodes); }))
                    .on('mousemove', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) { return _this.tooltipMove(_this.chart.node()); }))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                function (data, index, nodes) {
                    return _this.featureMouseClick(d3_event, _this.data.find((/**
                     * @param {?} obj
                     * @return {?}
                     */
                    function (obj) { return obj[_this.dataField] === data[_this.dataField]; })), index, nodes);
                }));
            }
        });
        this.featureMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            if (data) {
                _this.tooltipShow(data, nodes[index]);
                _this.hovered.emit({ event: event, data: data });
            }
        });
        this.featureMouseOut = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            _this.tooltipHide();
        });
        this.featureMouseClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        function (event, data, index, nodes) {
            if (data) {
                _this.clicked.emit({ event: event, data: data });
            }
        });
        this.tooltipShow = (/**
         * @param {?} data
         * @param {?} node
         * @return {?}
         */
        function (data, node) {
            // console.log('TOOLTIP: ', data, node);
            _this.tooltipSetPosition(node);
            if (data.label) {
                _this.tooltip.select('.tooltip-header').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return "" + data.label; }));
            }
            _this.tooltip
                .select('.tooltip-value')
                .html((/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return (_this.tooltipValueFormat ? "" + _this.tooltipValueFormat(data.value) : "" + data.value); }));
            _this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        function () {
            _this.tooltip.style('opacity', 0);
        });
        this.tooltipMove = (/**
         * @param {?} node
         * @return {?}
         */
        function (node) {
            _this.tooltipSetPosition(node);
        });
        this.tooltipSetPosition = (/**
         * @param {?} node
         * @return {?}
         */
        function (node) {
            /** @type {?} */
            var mouse = d3_mouse(node);
            /** @type {?} */
            var mouseLeft = +mouse[0];
            /** @type {?} */
            var mouseTop = +mouse[1];
            /** @type {?} */
            var geometry = node.getBoundingClientRect();
            /** @type {?} */
            var geometryLeft = +geometry.left;
            /** @type {?} */
            var geometryTop = +geometry.top;
            /** @type {?} */
            var scroll = _this._scroll.getScrollPosition();
            // const scrollLeft = +scroll[0];
            /** @type {?} */
            var scrollTop = +scroll[1];
            /** @type {?} */
            var tooltipOffsetWidth = +_this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            var tooltipOffsetHeight = +_this.tooltip.node().offsetHeight;
            _this.tooltip.style('top', scrollTop + mouseTop + geometryTop - tooltipOffsetHeight - 14 + "px");
            _this.tooltip.style('left', mouseLeft + geometryLeft - tooltipOffsetWidth + "px");
        });
        this.legend = (/**
         * @param {?} g
         * @return {?}
         */
        function (g) {
            /** @type {?} */
            var length = _this.colorRange.range().length;
            // console.log(this.colorRange.range().length, this.colorDomain);
            /** @type {?} */
            var x = d3_scaleLinear()
                .domain([1, length - 1])
                .rangeRound([+_this.legendWidth / length, (_this.legendWidth * (length - 1)) / length]);
            g.attr('class', 'legend')
                .selectAll('rect')
                .data(_this.colorRange.range())
                .join('rect')
                .attr('height', 8)
                .attr('x', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return x(i); }))
                .attr('width', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            function (d, i) { return x(i + 1) - x(i); }))
                .attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d; }));
            if (_this.legendLabel) {
                g.append('text')
                    .attr('y', -6)
                    .attr('text-anchor', 'start')
                    .attr('class', 'legend-label')
                    .text(_this.legendLabel);
            }
            g.call(d3_axisBottom(x)
                .tickSize(13)
                .tickValues(d3_range(1, length))
                .tickFormat((/**
             * @param {?} i
             * @return {?}
             */
            function (i) {
                return _this.legendValueFormat ? "" + _this.legendValueFormat(_this.colorDomain[i - 1]) : "" + _this.colorDomain[i - 1];
            })))
                .select('.domain')
                .remove();
        });
    }
    /**
     * @return {?}
     */
    PbdsDatavizChoroplethMapComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        // color range
        /** @type {?} */
        var colors = this._dataviz
            .getColors(true, this.theme)
            .slice()
            .reverse();
        /** @type {?} */
        var colorDomain = [+d3_min(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.value; })), +d3_max(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return d.value; }))];
        /** @type {?} */
        var colorValues = this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.value; }));
        switch (this.colorScale) {
            case 'threshold':
                this.colorRange = d3_scaleThreshold()
                    .domain(this.domain)
                    .range(colors);
                this.colorDomain = this.colorRange.domain();
                break;
            case 'quantile':
                this.colorRange = d3_scaleQuantile()
                    .domain(colorValues)
                    .range(colors);
                this.colorDomain = this.colorRange.quantiles();
                break;
            case 'quantize':
                this.colorRange = d3_scaleQuantize()
                    .domain(colorDomain)
                    .range(colors);
                this.colorDomain = this.colorRange.thresholds();
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = d3_format(this.tooltipValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
        switch (this.legendValueFormatType) {
            case 'number':
                this.legendValueFormat = d3_format(this.legendValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
        switch (this.projectionType) {
            case 'geoAlbers':
                this.projection = d3_geoAlbers();
                break;
            case 'geoAlbersUsa':
                this.projection = d3_geoAlbersUsa();
                break;
            case 'geoMercator':
                this.projection = d3_geoMercator();
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
        this.geoPath = d3_geoPath().projection(this.projection);
        // console.log('TOPOJSON: ', this.topojson);
        // console.log('TOPOJSON FEATURE: ', this.topojsonFeature);
        // console.log('MESH: ', topojson.mesh(this.topojson, this.topojson.objects[this.feature], (a, b) => a !== b));
        // console.log('DATA: ', this.data);
        // create the chart
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
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
            .enter()
            .append('path')
            .attr('class', 'feature')
            .attr('d', this.geoPath);
        // borders
        this.svg
            .append('path')
            .attr('class', 'mesh')
            .datum(topojson.mesh(this.topojson, this.topojson.objects[this.mesh || this.feature], (/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return a !== b; })))
            .attr('d', this.geoPath);
        // legend
        if (!this.hideLegend) {
            this.svg
                .append('g')
                .attr('transform', "translate(" + +this.legendLeft + ", " + +this.legendTop + ")") // TODO: this needs to be the top/right of the chart
                .call(this.legend);
        }
        this.updateChart();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PbdsDatavizChoroplethMapComponent.prototype.ngOnChanges = /**
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
    PbdsDatavizChoroplethMapComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.tooltip)
            this.tooltip.remove();
    };
    PbdsDatavizChoroplethMapComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-choropleth-map',
                    template: "",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizChoroplethMapComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: ElementRef },
        { type: ViewportScroller }
    ]; };
    PbdsDatavizChoroplethMapComponent.propDecorators = {
        chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
        choroplethMapClass: [{ type: HostBinding, args: ['class.pbds-chart-choropleth-map',] }],
        data: [{ type: Input }],
        topojson: [{ type: Input }],
        feature: [{ type: Input }],
        projectionType: [{ type: Input }],
        dataField: [{ type: Input }],
        mesh: [{ type: Input }],
        scale: [{ type: Input }],
        center: [{ type: Input }],
        width: [{ type: Input }],
        height: [{ type: Input }],
        marginTop: [{ type: Input }],
        marginRight: [{ type: Input }],
        marginBottom: [{ type: Input }],
        marginLeft: [{ type: Input }],
        theme: [{ type: Input }],
        colorScale: [{ type: Input }],
        domain: [{ type: Input }],
        hideTooltip: [{ type: Input }],
        tooltipValueFormatType: [{ type: Input }],
        tooltipValueFormatString: [{ type: Input }],
        hideLegend: [{ type: Input }],
        legendWidth: [{ type: Input }],
        legendLabel: [{ type: Input }],
        legendValueFormatType: [{ type: Input }],
        legendValueFormatString: [{ type: Input }],
        legendLeft: [{ type: Input }],
        legendTop: [{ type: Input }],
        hovered: [{ type: Output }],
        clicked: [{ type: Output }]
    };
    return PbdsDatavizChoroplethMapComponent;
}());
export { PbdsDatavizChoroplethMapComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.choroplethMapClass;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.topojson;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.feature;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.projectionType;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.dataField;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.mesh;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.scale;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.center;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.colorScale;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.domain;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.hideTooltip;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.legendLabel;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.legendValueFormatType;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.legendValueFormatString;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.legendLeft;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.legendTop;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.projection;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.geoPath;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.topojsonFeature;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.colorDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.legendValueFormat;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.featureMouseOver;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.featureMouseOut;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.featureMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.tooltipMove;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype.tooltipSetPosition;
    /** @type {?} */
    PbdsDatavizChoroplethMapComponent.prototype.legend;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizChoroplethMapComponent.prototype._scroll;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2RhdGF2aXovZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFHWCx1QkFBdUIsRUFDeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsT0FBTyxFQUNMLE1BQU0sSUFBSSxTQUFTLEVBQ25CLE1BQU0sSUFBSSxTQUFTLEVBQ25CLFdBQVcsSUFBSSxjQUFjLEVBQzdCLFVBQVUsSUFBSSxhQUFhLEVBQzNCLEtBQUssSUFBSSxRQUFRLEVBQ2pCLEdBQUcsSUFBSSxNQUFNLEVBQ2IsR0FBRyxJQUFJLE1BQU0sRUFDYixLQUFLLElBQUksUUFBUSxFQUNqQixLQUFLLElBQUksUUFBUSxFQUNqQixPQUFPLElBQUksVUFBVSxFQUNyQixTQUFTLElBQUksWUFBWSxFQUN6QixZQUFZLElBQUksZUFBZSxFQUMvQixXQUFXLElBQUksY0FBYyxFQUM3QixjQUFjLElBQUksaUJBQWlCLEVBQ25DLGFBQWEsSUFBSSxnQkFBZ0IsRUFDakMsYUFBYSxJQUFJLGdCQUFnQixFQUNsQyxNQUFNLElBQUksQ0FBQztBQUVaLE9BQU8sS0FBSyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBSXZEO0lBZ0hFLDJDQUFvQixRQUE0QixFQUFVLFFBQW9CLEVBQVUsT0FBeUI7UUFBakgsaUJBQXFIO1FBQWpHLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUFV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Ozs7O0lBRUYsd0RBRUU7Ozs7O0lBRUYsd0RBRUU7Ozs7O0lBRUYsK0RBa0JFOztJQUVGLG1EQW9DRTs7Ozs7SUExU1UscURBQW9DOzs7OztJQUFFLHFEQUE0Qjs7Ozs7SUFBRSxvREFBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtcbiAgc2VsZWN0IGFzIGQzX3NlbGVjdCxcbiAgZm9ybWF0IGFzIGQzX2Zvcm1hdCxcbiAgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsXG4gIGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSxcbiAgcmFuZ2UgYXMgZDNfcmFuZ2UsXG4gIG1pbiBhcyBkM19taW4sXG4gIG1heCBhcyBkM19tYXgsXG4gIGV2ZW50IGFzIGQzX2V2ZW50LFxuICBtb3VzZSBhcyBkM19tb3VzZSxcbiAgZ2VvUGF0aCBhcyBkM19nZW9QYXRoLFxuICBnZW9BbGJlcnMgYXMgZDNfZ2VvQWxiZXJzLFxuICBnZW9BbGJlcnNVc2EgYXMgZDNfZ2VvQWxiZXJzVXNhLFxuICBnZW9NZXJjYXRvciBhcyBkM19nZW9NZXJjYXRvcixcbiAgc2NhbGVUaHJlc2hvbGQgYXMgZDNfc2NhbGVUaHJlc2hvbGQsXG4gIHNjYWxlUXVhbnRpbGUgYXMgZDNfc2NhbGVRdWFudGlsZSxcbiAgc2NhbGVRdWFudGl6ZSBhcyBkM19zY2FsZVF1YW50aXplXG59IGZyb20gJ2QzJztcblxuaW1wb3J0ICogYXMgdG9wb2pzb24gZnJvbSAndG9wb2pzb24nO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBEYXRhIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotY2hvcm9wbGV0aC1tYXAnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtY2hvcm9wbGV0aC1tYXAnKVxuICBjaG9yb3BsZXRoTWFwQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcERhdGE+O1xuXG4gIEBJbnB1dCgpXG4gIHRvcG9qc29uO1xuXG4gIEBJbnB1dCgpXG4gIGZlYXR1cmUgPSAnJztcblxuICBASW5wdXQoKVxuICBwcm9qZWN0aW9uVHlwZTtcblxuICBASW5wdXQoKVxuICBkYXRhRmllbGQgPSAnaWQnO1xuXG4gIEBJbnB1dCgpXG4gIG1lc2g6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHNjYWxlID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBjZW50ZXIgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gOTYwO1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDUwMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkxlZnQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lOiAnY2xhc3NpYycgfCAnb2NlYW4nIHwgJ3N1bnNldCcgfCAndHdpbGlnaHQnID0gJ2NsYXNzaWMnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yU2NhbGU6ICd0aHJlc2hvbGQnIHwgJ3F1YW50aWxlJyB8ICdxdWFudGl6ZScgPSAncXVhbnRpbGUnO1xuXG4gIEBJbnB1dCgpXG4gIGRvbWFpbjogQXJyYXk8bnVtYmVyPjtcblxuICBASW5wdXQoKVxuICBoaWRlVG9vbHRpcCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBoaWRlTGVnZW5kID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kV2lkdGggPSAyNjA7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGVmdCA9IDIwO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFRvcCA9IDIwO1xuXG4gIEBPdXRwdXQoKVxuICBob3ZlcmVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBPdXRwdXQoKVxuICBjbGlja2VkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIHByaXZhdGUgcHJvamVjdGlvbjtcbiAgcHJpdmF0ZSBnZW9QYXRoO1xuICBwcml2YXRlIHRvcG9qc29uRmVhdHVyZTtcbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgY29sb3JEb21haW47XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgbGVnZW5kVmFsdWVGb3JtYXQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGF0YXZpejogUGJkc0RhdGF2aXpTZXJ2aWNlLCBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICAvLyBjb2xvciByYW5nZVxuICAgIGNvbnN0IGNvbG9ycyA9IHRoaXMuX2RhdGF2aXpcbiAgICAgIC5nZXRDb2xvcnModHJ1ZSwgdGhpcy50aGVtZSlcbiAgICAgIC5zbGljZSgpXG4gICAgICAucmV2ZXJzZSgpO1xuXG4gICAgY29uc3QgY29sb3JEb21haW46IGFueSA9IFsrZDNfbWluKHRoaXMuZGF0YSwgZCA9PiBkLnZhbHVlKSwgK2QzX21heCh0aGlzLmRhdGEsIGQgPT4gZC52YWx1ZSldO1xuICAgIGNvbnN0IGNvbG9yVmFsdWVzID0gdGhpcy5kYXRhLm1hcChkID0+IGQudmFsdWUpO1xuXG4gICAgc3dpdGNoICh0aGlzLmNvbG9yU2NhbGUpIHtcbiAgICAgIGNhc2UgJ3RocmVzaG9sZCc6XG4gICAgICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlVGhyZXNob2xkKClcbiAgICAgICAgICAuZG9tYWluKHRoaXMuZG9tYWluKVxuICAgICAgICAgIC5yYW5nZShjb2xvcnMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLmNvbG9yUmFuZ2UuZG9tYWluKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdxdWFudGlsZSc6XG4gICAgICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlUXVhbnRpbGUoKVxuICAgICAgICAgIC5kb21haW4oY29sb3JWYWx1ZXMpXG4gICAgICAgICAgLnJhbmdlKGNvbG9ycyk7XG5cbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IHRoaXMuY29sb3JSYW5nZS5xdWFudGlsZXMoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3F1YW50aXplJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVRdWFudGl6ZSgpXG4gICAgICAgICAgLmRvbWFpbihjb2xvckRvbWFpbilcbiAgICAgICAgICAucmFuZ2UoY29sb3JzKTtcblxuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gdGhpcy5jb2xvclJhbmdlLnRocmVzaG9sZHMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgc3dpdGNoICh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMubGVnZW5kVmFsdWVGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMubGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSBudWxsO1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy5wcm9qZWN0aW9uVHlwZSkge1xuICAgICAgY2FzZSAnZ2VvQWxiZXJzJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9BbGJlcnNVc2EnOlxuICAgICAgICB0aGlzLnByb2plY3Rpb24gPSBkM19nZW9BbGJlcnNVc2EoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2dlb01lcmNhdG9yJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvTWVyY2F0b3IoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy50b3BvanNvbkZlYXR1cmUgPSB0b3BvanNvbi5mZWF0dXJlKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLmZlYXR1cmVdKTtcbiAgICB0aGlzLnByb2plY3Rpb24uZml0U2l6ZShbK3RoaXMud2lkdGgsICt0aGlzLmhlaWdodF0sIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcblxuICAgIGlmICh0aGlzLnNjYWxlKSB7XG4gICAgICB0aGlzLnByb2plY3Rpb24uc2NhbGUoK3RoaXMuc2NhbGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNlbnRlcikge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLmNlbnRlcih0aGlzLmNlbnRlcik7XG4gICAgfVxuXG4gICAgdGhpcy5nZW9QYXRoID0gZDNfZ2VvUGF0aCgpLnByb2plY3Rpb24odGhpcy5wcm9qZWN0aW9uKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTjogJywgdGhpcy50b3BvanNvbik7XG4gICAgLy8gY29uc29sZS5sb2coJ1RPUE9KU09OIEZFQVRVUkU6ICcsIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcbiAgICAvLyBjb25zb2xlLmxvZygnTUVTSDogJywgdG9wb2pzb24ubWVzaCh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKTtcbiAgICAvLyBjb25zb2xlLmxvZygnREFUQTogJywgdGhpcy5kYXRhKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXInKTtcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdmFsdWUnKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGh9ICR7K3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tfWBcbiAgICAgICk7XG5cbiAgICAvLyBtYXBcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy50b3BvanNvbkZlYXR1cmUuZmVhdHVyZXMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZmVhdHVyZScpXG4gICAgICAuYXR0cignZCcsIHRoaXMuZ2VvUGF0aCk7XG5cbiAgICAvLyBib3JkZXJzXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21lc2gnKVxuICAgICAgLmRhdHVtKHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMubWVzaCB8fCB0aGlzLmZlYXR1cmVdLCAoYSwgYikgPT4gYSAhPT0gYikpXG4gICAgICAuYXR0cignZCcsIHRoaXMuZ2VvUGF0aCk7XG5cbiAgICAvLyBsZWdlbmRcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7K3RoaXMubGVnZW5kTGVmdH0sICR7K3RoaXMubGVnZW5kVG9wfSlgKSAvLyBUT0RPOiB0aGlzIG5lZWRzIHRvIGJlIHRoZSB0b3AvcmlnaHQgb2YgdGhlIGNoYXJ0XG4gICAgICAgIC5jYWxsKHRoaXMubGVnZW5kKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3QoJy5tYXAnKVxuICAgICAgLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgPT4ge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHRoaXMuZGF0YS5maW5kKG9iaiA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkW3RoaXMuZGF0YUZpZWxkXSk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yUmFuZ2UobWF0Y2gudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2hhc0RhdGEnLCAoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNvbWUob2JqID0+IG9ialt0aGlzLmRhdGFGaWVsZF0gPT09IGRbdGhpcy5kYXRhRmllbGRdKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0KCcubWFwJylcbiAgICAgICAgLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT5cbiAgICAgICAgICB0aGlzLmZlYXR1cmVNb3VzZU92ZXIoXG4gICAgICAgICAgICBkM19ldmVudCxcbiAgICAgICAgICAgIHRoaXMuZGF0YS5maW5kKG9iaiA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkYXRhW3RoaXMuZGF0YUZpZWxkXSksXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIG5vZGVzXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmZlYXR1cmVNb3VzZU91dChkM19ldmVudCwgdGhpcy5kYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ21vdXNlbW92ZScsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMudG9vbHRpcE1vdmUodGhpcy5jaGFydC5ub2RlKCkpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT5cbiAgICAgICAgICB0aGlzLmZlYXR1cmVNb3VzZUNsaWNrKFxuICAgICAgICAgICAgZDNfZXZlbnQsXG4gICAgICAgICAgICB0aGlzLmRhdGEuZmluZChvYmogPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZGF0YVt0aGlzLmRhdGFGaWVsZF0pLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBub2Rlc1xuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgZmVhdHVyZU1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudG9vbHRpcFNob3coZGF0YSwgbm9kZXNbaW5kZXhdKTtcbiAgICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZlYXR1cmVNb3VzZU91dCA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGZlYXR1cmVNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChkYXRhLCBub2RlKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJ1RPT0xUSVA6ICcsIGRhdGEsIG5vZGUpO1xuXG4gICAgdGhpcy50b29sdGlwU2V0UG9zaXRpb24obm9kZSk7XG5cbiAgICBpZiAoZGF0YS5sYWJlbCkge1xuICAgICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbChkID0+IGAke2RhdGEubGFiZWx9YCk7XG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwXG4gICAgICAuc2VsZWN0KCcudG9vbHRpcC12YWx1ZScpXG4gICAgICAuaHRtbChkID0+ICh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA/IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfWAgOiBgJHtkYXRhLnZhbHVlfWApKTtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwTW92ZSA9IG5vZGUgPT4ge1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKG5vZGUpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNldFBvc2l0aW9uID0gbm9kZSA9PiB7XG4gICAgY29uc3QgbW91c2UgPSBkM19tb3VzZShub2RlKTtcbiAgICBjb25zdCBtb3VzZUxlZnQgPSArbW91c2VbMF07XG4gICAgY29uc3QgbW91c2VUb3AgPSArbW91c2VbMV07XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZ2VvbWV0cnlMZWZ0ID0gK2dlb21ldHJ5LmxlZnQ7XG4gICAgY29uc3QgZ2VvbWV0cnlUb3AgPSArZ2VvbWV0cnkudG9wO1xuXG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgLy8gY29uc3Qgc2Nyb2xsTGVmdCA9ICtzY3JvbGxbMF07XG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gK3Njcm9sbFsxXTtcblxuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRXaWR0aCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldFdpZHRoIC8gMjtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHtzY3JvbGxUb3AgKyBtb3VzZVRvcCArIGdlb21ldHJ5VG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodCAtIDE0fXB4YCk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7bW91c2VMZWZ0ICsgZ2VvbWV0cnlMZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRofXB4YCk7XG4gIH07XG5cbiAgbGVnZW5kID0gZyA9PiB7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5jb2xvclJhbmdlLnJhbmdlKCkubGVuZ3RoO1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5jb2xvclJhbmdlLnJhbmdlKCkubGVuZ3RoLCB0aGlzLmNvbG9yRG9tYWluKTtcblxuICAgIGNvbnN0IHggPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFsxLCBsZW5ndGggLSAxXSlcbiAgICAgIC5yYW5nZVJvdW5kKFsrdGhpcy5sZWdlbmRXaWR0aCAvIGxlbmd0aCwgKHRoaXMubGVnZW5kV2lkdGggKiAobGVuZ3RoIC0gMSkpIC8gbGVuZ3RoXSk7XG5cbiAgICBnLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZCcpXG4gICAgICAuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIC5kYXRhKHRoaXMuY29sb3JSYW5nZS5yYW5nZSgpKVxuICAgICAgLmpvaW4oJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIDgpXG4gICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB4KGkpKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKGQsIGkpID0+IHgoaSArIDEpIC0geChpKSlcbiAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiBkKTtcblxuICAgIGlmICh0aGlzLmxlZ2VuZExhYmVsKSB7XG4gICAgICBnLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCd5JywgLTYpXG4gICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdzdGFydCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKVxuICAgICAgICAudGV4dCh0aGlzLmxlZ2VuZExhYmVsKTtcbiAgICB9XG5cbiAgICBnLmNhbGwoXG4gICAgICBkM19heGlzQm90dG9tKHgpXG4gICAgICAgIC50aWNrU2l6ZSgxMylcbiAgICAgICAgLnRpY2tWYWx1ZXMoZDNfcmFuZ2UoMSwgbGVuZ3RoKSlcbiAgICAgICAgLnRpY2tGb3JtYXQoKGk6IG51bWJlcikgPT5cbiAgICAgICAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID8gYCR7dGhpcy5sZWdlbmRWYWx1ZUZvcm1hdCh0aGlzLmNvbG9yRG9tYWluW2kgLSAxXSl9YCA6IGAke3RoaXMuY29sb3JEb21haW5baSAtIDFdfWBcbiAgICAgICAgKVxuICAgIClcbiAgICAgIC5zZWxlY3QoJy5kb21haW4nKVxuICAgICAgLnJlbW92ZSgpO1xuICB9O1xufVxuIl19
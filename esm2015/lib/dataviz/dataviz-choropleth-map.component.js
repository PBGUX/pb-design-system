/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, scaleLinear as d3_scaleLinear, axisBottom as d3_axisBottom, range as d3_range, min as d3_min, max as d3_max, event as d3_event, mouse as d3_mouse, geoPath as d3_geoPath, geoAlbers as d3_geoAlbers, geoAlbersUsa as d3_geoAlbersUsa, geoMercator as d3_geoMercator, scaleThreshold as d3_scaleThreshold, scaleQuantile as d3_scaleQuantile, scaleQuantize as d3_scaleQuantize } from 'd3';
import * as topojson from 'topojson';
import { PbdsDatavizService } from './dataviz.service';
export class PbdsDatavizChoroplethMapComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     * @param {?} _scroll
     */
    constructor(_dataviz, _element, _scroll) {
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
        () => {
            this.svg
                .select('.map')
                .selectAll('path')
                .style('fill', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                /** @type {?} */
                const match = this.data.find((/**
                 * @param {?} obj
                 * @return {?}
                 */
                obj => obj[this.dataField] === d[this.dataField]));
                if (match) {
                    return this.colorRange(match.value);
                }
            }))
                .classed('hasData', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                return this.data.some((/**
                 * @param {?} obj
                 * @return {?}
                 */
                obj => obj[this.dataField] === d[this.dataField]));
            }));
            if (!this.hideTooltip) {
                this.svg
                    .select('.map')
                    .selectAll('path')
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.featureMouseOver(d3_event, this.data.find((/**
                 * @param {?} obj
                 * @return {?}
                 */
                obj => obj[this.dataField] === data[this.dataField])), index, nodes)))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.featureMouseOut(d3_event, this.data, index, nodes)))
                    .on('mousemove', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.tooltipMove(this.chart.node())))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.featureMouseClick(d3_event, this.data.find((/**
                 * @param {?} obj
                 * @return {?}
                 */
                obj => obj[this.dataField] === data[this.dataField])), index, nodes)));
            }
        });
        this.featureMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            if (data) {
                this.tooltipShow(data, nodes[index]);
                this.hovered.emit({ event, data });
            }
        });
        this.featureMouseOut = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.tooltipHide();
        });
        this.featureMouseClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            if (data) {
                this.clicked.emit({ event, data });
            }
        });
        this.tooltipShow = (/**
         * @param {?} data
         * @param {?} node
         * @return {?}
         */
        (data, node) => {
            // console.log('TOOLTIP: ', data, node);
            this.tooltipSetPosition(node);
            if (data.label) {
                this.tooltip.select('.tooltip-header').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => `${data.label}`));
            }
            this.tooltip
                .select('.tooltip-value')
                .html((/**
             * @param {?} d
             * @return {?}
             */
            d => (this.tooltipValueFormat ? `${this.tooltipValueFormat(data.value)}` : `${data.value}`)));
            this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        () => {
            this.tooltip.style('opacity', 0);
        });
        this.tooltipMove = (/**
         * @param {?} node
         * @return {?}
         */
        node => {
            this.tooltipSetPosition(node);
        });
        this.tooltipSetPosition = (/**
         * @param {?} node
         * @return {?}
         */
        node => {
            /** @type {?} */
            const mouse = d3_mouse(node);
            /** @type {?} */
            const mouseLeft = +mouse[0];
            /** @type {?} */
            const mouseTop = +mouse[1];
            /** @type {?} */
            const geometry = node.getBoundingClientRect();
            /** @type {?} */
            const geometryLeft = +geometry.left;
            /** @type {?} */
            const geometryTop = +geometry.top;
            /** @type {?} */
            const scroll = this._scroll.getScrollPosition();
            // const scrollLeft = +scroll[0];
            /** @type {?} */
            const scrollTop = +scroll[1];
            /** @type {?} */
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            this.tooltip.style('top', `${scrollTop + mouseTop + geometryTop - tooltipOffsetHeight - 14}px`);
            this.tooltip.style('left', `${mouseLeft + geometryLeft - tooltipOffsetWidth}px`);
        });
        this.legend = (/**
         * @param {?} g
         * @return {?}
         */
        g => {
            /** @type {?} */
            const length = this.colorRange.range().length;
            // console.log(this.colorRange.range().length, this.colorDomain);
            /** @type {?} */
            const x = d3_scaleLinear()
                .domain([1, length - 1])
                .rangeRound([+this.legendWidth / length, (this.legendWidth * (length - 1)) / length]);
            g.attr('class', 'legend')
                .selectAll('rect')
                .data(this.colorRange.range())
                .join('rect')
                .attr('height', 8)
                .attr('x', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => x(i)))
                .attr('width', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => x(i + 1) - x(i)))
                .attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            d => d));
            if (this.legendLabel) {
                g.append('text')
                    .attr('y', -6)
                    .attr('text-anchor', 'start')
                    .attr('class', 'legend-label')
                    .text(this.legendLabel);
            }
            g.call(d3_axisBottom(x)
                .tickSize(13)
                .tickValues(d3_range(1, length))
                .tickFormat((/**
             * @param {?} i
             * @return {?}
             */
            (i) => this.legendValueFormat ? `${this.legendValueFormat(this.colorDomain[i - 1])}` : `${this.colorDomain[i - 1]}`)))
                .select('.domain')
                .remove();
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        // color range
        /** @type {?} */
        const colors = this._dataviz
            .getColors(true, this.theme)
            .slice()
            .reverse();
        /** @type {?} */
        const colorDomain = [+d3_min(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            d => d.value)), +d3_max(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            d => d.value))];
        /** @type {?} */
        const colorValues = this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        d => d.value));
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
        // create formatters
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        this.legendValueFormat = this._dataviz.d3Format(this.legendValueFormatType, this.legendValueFormatString);
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
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height + this.margin.top + this.margin.bottom}`);
        // map
        this.svg
            .append('g')
            .attr('class', 'map')
            .selectAll('path')
            .data(this.topojsonFeature.features)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('path')
            .attr('class', 'feature')
            .attr('d', this.geoPath)));
        // borders
        this.svg
            .append('path')
            .attr('class', 'mesh')
            .datum(topojson.mesh(this.topojson, this.topojson.objects[this.mesh || this.feature], (/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => a !== b)))
            .attr('d', this.geoPath);
        // legend
        if (!this.hideLegend) {
            this.svg
                .append('g')
                .attr('transform', `translate(${+this.legendLeft}, ${+this.legendTop})`)
                .call(this.legend);
        }
        this.updateChart();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
}
PbdsDatavizChoroplethMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-choropleth-map',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizChoroplethMapComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2RhdGF2aXovZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFHWCx1QkFBdUIsRUFDeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsT0FBTyxFQUNMLE1BQU0sSUFBSSxTQUFTLEVBQ25CLFdBQVcsSUFBSSxjQUFjLEVBQzdCLFVBQVUsSUFBSSxhQUFhLEVBQzNCLEtBQUssSUFBSSxRQUFRLEVBQ2pCLEdBQUcsSUFBSSxNQUFNLEVBQ2IsR0FBRyxJQUFJLE1BQU0sRUFDYixLQUFLLElBQUksUUFBUSxFQUNqQixLQUFLLElBQUksUUFBUSxFQUNqQixPQUFPLElBQUksVUFBVSxFQUNyQixTQUFTLElBQUksWUFBWSxFQUN6QixZQUFZLElBQUksZUFBZSxFQUMvQixXQUFXLElBQUksY0FBYyxFQUM3QixjQUFjLElBQUksaUJBQWlCLEVBQ25DLGFBQWEsSUFBSSxnQkFBZ0IsRUFDakMsYUFBYSxJQUFJLGdCQUFnQixFQUNsQyxNQUFNLElBQUksQ0FBQztBQUVaLE9BQU8sS0FBSyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBVXZELE1BQU0sT0FBTyxpQ0FBaUM7Ozs7OztJQTBHNUMsWUFBb0IsUUFBNEIsRUFBVSxRQUFvQixFQUFVLE9BQXlCO1FBQTdGLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUFVLFlBQU8sR0FBUCxP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TUFBTTs7OztJQTFGUCx1REFDa0I7O0lBRWxCLCtEQUMwQjs7SUFFMUIsaURBQzBDOztJQUUxQyxxREFDUzs7SUFFVCxvREFDYTs7SUFFYiwyREFDZTs7SUFFZixzREFDaUI7O0lBRWpCLGlEQUMyQjs7SUFFM0Isa0RBQ2E7O0lBRWIsbURBQ2M7O0lBRWQsa0RBQ1k7O0lBRVosbURBQ2E7O0lBRWIsc0RBQ2M7O0lBRWQsd0RBQ2dCOztJQUVoQix5REFDaUI7O0lBRWpCLHVEQUNlOztJQUVmLGtEQUMrRDs7SUFFL0QsdURBQytEOztJQUUvRCxtREFDc0I7O0lBRXRCLHdEQUNvQjs7SUFFcEIsbUVBQ3dDOztJQUV4QyxxRUFDOEI7O0lBRTlCLHVEQUNtQjs7SUFFbkIsd0RBQ2tCOztJQUVsQix3REFDa0M7O0lBRWxDLGtFQUN1Qzs7SUFFdkMsb0VBQzZCOztJQUU3Qix1REFDZ0I7O0lBRWhCLHNEQUNlOztJQUVmLG9EQUMyRDs7SUFFM0Qsb0RBQzJEOzs7OztJQUUzRCx1REFBbUI7Ozs7O0lBQ25CLG9EQUFnQjs7Ozs7SUFDaEIsNERBQXdCOzs7OztJQUN4QixrREFBYzs7Ozs7SUFDZCxnREFBWTs7Ozs7SUFDWixtREFBZTs7Ozs7SUFDZix1REFBbUI7Ozs7O0lBQ25CLHdEQUFvQjs7Ozs7SUFDcEIsb0RBQWdCOzs7OztJQUNoQiwrREFBMkI7Ozs7O0lBQzNCLDhEQUEwQjs7SUF3SjFCLHdEQXFDRTs7SUFFRiw2REFLRTs7SUFFRiw0REFFRTs7SUFFRiw4REFJRTs7Ozs7SUFFRix3REFjRTs7Ozs7SUFFRix3REFFRTs7Ozs7SUFFRix3REFFRTs7Ozs7SUFFRiwrREFrQkU7O0lBRUYsbURBb0NFOzs7OztJQTlSVSxxREFBb0M7Ozs7O0lBQUUscURBQTRCOzs7OztJQUFFLG9EQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIE9uRGVzdHJveSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge1xuICBzZWxlY3QgYXMgZDNfc2VsZWN0LFxuICBzY2FsZUxpbmVhciBhcyBkM19zY2FsZUxpbmVhcixcbiAgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLFxuICByYW5nZSBhcyBkM19yYW5nZSxcbiAgbWluIGFzIGQzX21pbixcbiAgbWF4IGFzIGQzX21heCxcbiAgZXZlbnQgYXMgZDNfZXZlbnQsXG4gIG1vdXNlIGFzIGQzX21vdXNlLFxuICBnZW9QYXRoIGFzIGQzX2dlb1BhdGgsXG4gIGdlb0FsYmVycyBhcyBkM19nZW9BbGJlcnMsXG4gIGdlb0FsYmVyc1VzYSBhcyBkM19nZW9BbGJlcnNVc2EsXG4gIGdlb01lcmNhdG9yIGFzIGQzX2dlb01lcmNhdG9yLFxuICBzY2FsZVRocmVzaG9sZCBhcyBkM19zY2FsZVRocmVzaG9sZCxcbiAgc2NhbGVRdWFudGlsZSBhcyBkM19zY2FsZVF1YW50aWxlLFxuICBzY2FsZVF1YW50aXplIGFzIGQzX3NjYWxlUXVhbnRpemVcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgKiBhcyB0b3BvanNvbiBmcm9tICd0b3BvanNvbic7XG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcERhdGEgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1jaG9yb3BsZXRoLW1hcCcsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpDaG9yb3BsZXRoTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1jaG9yb3BsZXRoLW1hcCcpXG4gIGNob3JvcGxldGhNYXBDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogQXJyYXk8UGJkc0RhdGF2aXpDaG9yb3BsZXRoTWFwRGF0YT47XG5cbiAgQElucHV0KClcbiAgdG9wb2pzb247XG5cbiAgQElucHV0KClcbiAgZmVhdHVyZSA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHByb2plY3Rpb25UeXBlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGFGaWVsZCA9ICdpZCc7XG5cbiAgQElucHV0KClcbiAgbWVzaDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgc2NhbGUgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGNlbnRlciA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSA5NjA7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNTAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDA7XG5cbiAgQElucHV0KClcbiAgdGhlbWU6ICdjbGFzc2ljJyB8ICdvY2VhbicgfCAnc3Vuc2V0JyB8ICd0d2lsaWdodCcgPSAnY2xhc3NpYyc7XG5cbiAgQElucHV0KClcbiAgY29sb3JTY2FsZTogJ3RocmVzaG9sZCcgfCAncXVhbnRpbGUnIHwgJ3F1YW50aXplJyA9ICdxdWFudGlsZSc7XG5cbiAgQElucHV0KClcbiAgZG9tYWluOiBBcnJheTxudW1iZXI+O1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDI2MDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBsZWdlbmRMZWZ0ID0gMjA7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVG9wID0gMjA7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBwcm9qZWN0aW9uO1xuICBwcml2YXRlIGdlb1BhdGg7XG4gIHByaXZhdGUgdG9wb2pzb25GZWF0dXJlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBjb2xvckRvbWFpbjtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcbiAgcHJpdmF0ZSBsZWdlbmRWYWx1ZUZvcm1hdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIC8vIGNvbG9yIHJhbmdlXG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5fZGF0YXZpelxuICAgICAgLmdldENvbG9ycyh0cnVlLCB0aGlzLnRoZW1lKVxuICAgICAgLnNsaWNlKClcbiAgICAgIC5yZXZlcnNlKCk7XG5cbiAgICBjb25zdCBjb2xvckRvbWFpbjogYW55ID0gWytkM19taW4odGhpcy5kYXRhLCBkID0+IGQudmFsdWUpLCArZDNfbWF4KHRoaXMuZGF0YSwgZCA9PiBkLnZhbHVlKV07XG4gICAgY29uc3QgY29sb3JWYWx1ZXMgPSB0aGlzLmRhdGEubWFwKGQgPT4gZC52YWx1ZSk7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29sb3JTY2FsZSkge1xuICAgICAgY2FzZSAndGhyZXNob2xkJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVUaHJlc2hvbGQoKVxuICAgICAgICAgIC5kb21haW4odGhpcy5kb21haW4pXG4gICAgICAgICAgLnJhbmdlKGNvbG9ycyk7XG5cbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IHRoaXMuY29sb3JSYW5nZS5kb21haW4oKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3F1YW50aWxlJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVRdWFudGlsZSgpXG4gICAgICAgICAgLmRvbWFpbihjb2xvclZhbHVlcylcbiAgICAgICAgICAucmFuZ2UoY29sb3JzKTtcblxuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gdGhpcy5jb2xvclJhbmdlLnF1YW50aWxlcygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncXVhbnRpemUnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVF1YW50aXplKClcbiAgICAgICAgICAuZG9tYWluKGNvbG9yRG9tYWluKVxuICAgICAgICAgIC5yYW5nZShjb2xvcnMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLmNvbG9yUmFuZ2UudGhyZXNob2xkcygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0VHlwZSwgdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICBzd2l0Y2ggKHRoaXMucHJvamVjdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgJ2dlb0FsYmVycyc6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb0FsYmVycygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZ2VvQWxiZXJzVXNhJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzVXNhKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9NZXJjYXRvcic6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb01lcmNhdG9yKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMudG9wb2pzb25GZWF0dXJlID0gdG9wb2pzb24uZmVhdHVyZSh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSk7XG4gICAgdGhpcy5wcm9qZWN0aW9uLmZpdFNpemUoWyt0aGlzLndpZHRoLCArdGhpcy5oZWlnaHRdLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG5cbiAgICBpZiAodGhpcy5zY2FsZSkge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLnNjYWxlKCt0aGlzLnNjYWxlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jZW50ZXIpIHtcbiAgICAgIHRoaXMucHJvamVjdGlvbi5jZW50ZXIodGhpcy5jZW50ZXIpO1xuICAgIH1cblxuICAgIHRoaXMuZ2VvUGF0aCA9IGQzX2dlb1BhdGgoKS5wcm9qZWN0aW9uKHRoaXMucHJvamVjdGlvbik7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnVE9QT0pTT046ICcsIHRoaXMudG9wb2pzb24pO1xuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTiBGRUFUVVJFOiAnLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG4gICAgLy8gY29uc29sZS5sb2coJ01FU0g6ICcsIHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ0RBVEE6ICcsIHRoaXMuZGF0YSk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgc291dGgnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcblxuICAgICAgLy8gdG9vbHRpcCBoZWFkZXJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLXZhbHVlJyk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRofSAkeyt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbX1gXG4gICAgICApO1xuXG4gICAgLy8gbWFwXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcCcpXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5kYXRhKHRoaXMudG9wb2pzb25GZWF0dXJlLmZlYXR1cmVzKVxuICAgICAgLmpvaW4oZW50ZXIgPT5cbiAgICAgICAgZW50ZXJcbiAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZmVhdHVyZScpXG4gICAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLmdlb1BhdGgpXG4gICAgICApO1xuXG4gICAgLy8gYm9yZGVyc1xuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdtZXNoJylcbiAgICAgIC5kYXR1bSh0b3BvanNvbi5tZXNoKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLm1lc2ggfHwgdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKVxuICAgICAgLmF0dHIoJ2QnLCB0aGlzLmdlb1BhdGgpO1xuXG4gICAgLy8gbGVnZW5kXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgkeyt0aGlzLmxlZ2VuZExlZnR9LCAkeyt0aGlzLmxlZ2VuZFRvcH0pYClcbiAgICAgICAgLmNhbGwodGhpcy5sZWdlbmQpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICB1cGRhdGVDaGFydCA9ICgpID0+IHtcbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdCgnLm1hcCcpXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5kYXRhLmZpbmQob2JqID0+IG9ialt0aGlzLmRhdGFGaWVsZF0gPT09IGRbdGhpcy5kYXRhRmllbGRdKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29sb3JSYW5nZShtYXRjaC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2xhc3NlZCgnaGFzRGF0YScsIChkLCBpKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuc29tZShvYmogPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZFt0aGlzLmRhdGFGaWVsZF0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3QoJy5tYXAnKVxuICAgICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PlxuICAgICAgICAgIHRoaXMuZmVhdHVyZU1vdXNlT3ZlcihcbiAgICAgICAgICAgIGQzX2V2ZW50LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmZpbmQob2JqID0+IG9ialt0aGlzLmRhdGFGaWVsZF0gPT09IGRhdGFbdGhpcy5kYXRhRmllbGRdKSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgbm9kZXNcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuZmVhdHVyZU1vdXNlT3V0KGQzX2V2ZW50LCB0aGlzLmRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAgIC5vbignbW91c2Vtb3ZlJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy50b29sdGlwTW92ZSh0aGlzLmNoYXJ0Lm5vZGUoKSkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PlxuICAgICAgICAgIHRoaXMuZmVhdHVyZU1vdXNlQ2xpY2soXG4gICAgICAgICAgICBkM19ldmVudCxcbiAgICAgICAgICAgIHRoaXMuZGF0YS5maW5kKG9iaiA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkYXRhW3RoaXMuZGF0YUZpZWxkXSksXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIG5vZGVzXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbiAgfTtcblxuICBmZWF0dXJlTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy50b29sdGlwU2hvdyhkYXRhLCBub2Rlc1tpbmRleF0pO1xuICAgICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgICB9XG4gIH07XG5cbiAgZmVhdHVyZU1vdXNlT3V0ID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgZmVhdHVyZU1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKGRhdGEsIG5vZGUpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygnVE9PTFRJUDogJywgZGF0YSwgbm9kZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTZXRQb3NpdGlvbihub2RlKTtcblxuICAgIGlmIChkYXRhLmxhYmVsKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXInKS5odG1sKGQgPT4gYCR7ZGF0YS5sYWJlbH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXBcbiAgICAgIC5zZWxlY3QoJy50b29sdGlwLXZhbHVlJylcbiAgICAgIC5odG1sKGQgPT4gKHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID8gYCR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS52YWx1ZSl9YCA6IGAke2RhdGEudmFsdWV9YCkpO1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBNb3ZlID0gbm9kZSA9PiB7XG4gICAgdGhpcy50b29sdGlwU2V0UG9zaXRpb24obm9kZSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2V0UG9zaXRpb24gPSBub2RlID0+IHtcbiAgICBjb25zdCBtb3VzZSA9IGQzX21vdXNlKG5vZGUpO1xuICAgIGNvbnN0IG1vdXNlTGVmdCA9ICttb3VzZVswXTtcbiAgICBjb25zdCBtb3VzZVRvcCA9ICttb3VzZVsxXTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBnZW9tZXRyeUxlZnQgPSArZ2VvbWV0cnkubGVmdDtcbiAgICBjb25zdCBnZW9tZXRyeVRvcCA9ICtnZW9tZXRyeS50b3A7XG5cbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICAvLyBjb25zdCBzY3JvbGxMZWZ0ID0gK3Njcm9sbFswXTtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSArc2Nyb2xsWzFdO1xuXG4gICAgY29uc3QgdG9vbHRpcE9mZnNldFdpZHRoID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0V2lkdGggLyAyO1xuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAke3Njcm9sbFRvcCArIG1vdXNlVG9wICsgZ2VvbWV0cnlUb3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC0gMTR9cHhgKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBgJHttb3VzZUxlZnQgKyBnZW9tZXRyeUxlZnQgLSB0b29sdGlwT2Zmc2V0V2lkdGh9cHhgKTtcbiAgfTtcblxuICBsZWdlbmQgPSBnID0+IHtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmNvbG9yUmFuZ2UucmFuZ2UoKS5sZW5ndGg7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbG9yUmFuZ2UucmFuZ2UoKS5sZW5ndGgsIHRoaXMuY29sb3JEb21haW4pO1xuXG4gICAgY29uc3QgeCA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWzEsIGxlbmd0aCAtIDFdKVxuICAgICAgLnJhbmdlUm91bmQoWyt0aGlzLmxlZ2VuZFdpZHRoIC8gbGVuZ3RoLCAodGhpcy5sZWdlbmRXaWR0aCAqIChsZW5ndGggLSAxKSkgLyBsZW5ndGhdKTtcblxuICAgIGcuYXR0cignY2xhc3MnLCAnbGVnZW5kJylcbiAgICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEodGhpcy5jb2xvclJhbmdlLnJhbmdlKCkpXG4gICAgICAuam9pbigncmVjdCcpXG4gICAgICAuYXR0cignaGVpZ2h0JywgOClcbiAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHgoaSkpXG4gICAgICAuYXR0cignd2lkdGgnLCAoZCwgaSkgPT4geChpICsgMSkgLSB4KGkpKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCBkID0+IGQpO1xuXG4gICAgaWYgKHRoaXMubGVnZW5kTGFiZWwpIHtcbiAgICAgIGcuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ3knLCAtNilcbiAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ3N0YXJ0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgIC50ZXh0KHRoaXMubGVnZW5kTGFiZWwpO1xuICAgIH1cblxuICAgIGcuY2FsbChcbiAgICAgIGQzX2F4aXNCb3R0b20oeClcbiAgICAgICAgLnRpY2tTaXplKDEzKVxuICAgICAgICAudGlja1ZhbHVlcyhkM19yYW5nZSgxLCBsZW5ndGgpKVxuICAgICAgICAudGlja0Zvcm1hdCgoaTogbnVtYmVyKSA9PlxuICAgICAgICAgIHRoaXMubGVnZW5kVmFsdWVGb3JtYXQgPyBgJHt0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0KHRoaXMuY29sb3JEb21haW5baSAtIDFdKX1gIDogYCR7dGhpcy5jb2xvckRvbWFpbltpIC0gMV19YFxuICAgICAgICApXG4gICAgKVxuICAgICAgLnNlbGVjdCgnLmRvbWFpbicpXG4gICAgICAucmVtb3ZlKCk7XG4gIH07XG59XG4iXX0=
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, HostBinding, Input, Output, ElementRef, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { PbdsDatavizService } from './dataviz.service';
import { select as d3_select, isoParse as d3_isoParse, scaleBand as d3_scaleBand, scaleThreshold as d3_scaleThreshold, scaleQuantile as d3_scaleQuantile, scaleQuantize as d3_scaleQuantize, min as d3_min, max as d3_max, axisBottom as d3_axisBottom, axisLeft as d3_axisLeft, event as d3_event } from 'd3';
export class PbdsDatavizHeatmapComponent {
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
        this.heatmapClass = true;
        this.width = 306;
        this.height = 400;
        this.marginTop = 0; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginRight = 0; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
        // hardcoded on purpose, do not document until feedback
        this.marginLeft = 55;
        this.scale = 'quantile';
        this.xAxisFormatType = null;
        this.xAxisFormatString = '';
        this.yAxisFormatType = null;
        this.yAxisFormatString = '';
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        // hardcoded legend width + left margin, do not document until feedback
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (/**
         * @return {?}
         */
        () => {
            this.svg
                .selectAll('rect')
                .data(this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('rect')
                .attr('class', 'block')
                .classed('empty', (/**
             * @param {?} d
             * @return {?}
             */
            d => d.value === undefined || d.value === null))
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.xAxisScale(d.xLabel)))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.yAxisScale(d.yLabel)))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.yAxisScale.bandwidth())
                .style('fill', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.colorRange(d.value)))), (/**
             * @param {?} update
             * @return {?}
             */
            update => update.call((/**
             * @param {?} update
             * @return {?}
             */
            update => {
                update
                    .classed('empty', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => d.value === undefined || d.value === null))
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.xLabel)))
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d.yLabel)))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.yAxisScale.bandwidth())
                    .style('fill', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.value)))
                    .transition()
                    .attr('pointer-events', 'auto');
                return update;
            }))), (/**
             * @param {?} exit
             * @return {?}
             */
            exit => exit
                .transition()
                .attr('pointer-events', 'none')
                .remove()))
                .on('mouseover', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => this.blockMouseOver(d3_event, data, index, nodes)))
                .on('mouseout', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => this.blockMouseOut()))
                .on('click', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => this.blockMouseClick(d3_event, data, index, nodes)));
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.colorDomain)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => {
                    /** @type {?} */
                    const li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.colorRange(d)));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => {
                        /** @type {?} */
                        let label = d;
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                label = this.legendLabelFormat(d);
                                break;
                        }
                        return `&ge; ${label}`;
                    }));
                    return li;
                }), (/**
                 * @param {?} update
                 * @return {?}
                 */
                update => update.select('.legend-label').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    /** @type {?} */
                    let label = d;
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            label = this.legendLabelFormat(d);
                            break;
                    }
                    return `&ge; ${label}`;
                }))), (/**
                 * @param {?} exit
                 * @return {?}
                 */
                exit => exit.remove()))
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.legendMouseOver(d3_event, data, index, nodes)))
                    .on('mouseout', (/**
                 * @return {?}
                 */
                () => this.legendMouseOut()))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.legendMouseClick(d3_event, data, index, nodes)));
            }
        });
        this.blockMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            // console.log(data.value, event, data, index, nodes);
            if (data.value !== null) {
                this.tooltipShow(data, index, nodes[index]);
            }
            this.hovered.emit({ event, data });
        });
        this.blockMouseOut = (/**
         * @return {?}
         */
        () => {
            this.tooltipHide();
        });
        this.blockMouseClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.clicked.emit({ event, data });
        });
        this.legendMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.chart
                .selectAll('.block')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                if (index + 1 === nodes.length) {
                    return d.value < data;
                }
                else {
                    return d.value < data || d.value >= +d3_select(nodes[index + 1]).data()[0];
                }
            }))
                .classed('inactive', true);
            this.hovered.emit({ event, data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.block').classed('inactive', false);
        });
        this.legendMouseClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.clicked.emit({ event, data });
        });
        this.tooltipShow = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} node
         * @return {?}
         */
        (data, index, node) => {
            // console.log('TOOLTIP: ', data, index, node);
            // console.log('TOOLTIP: ', data, index, node);
            /** @type {?} */
            const dimensions = node.getBoundingClientRect();
            /** @type {?} */
            const scroll = this._scroll.getScrollPosition();
            /** @type {?} */
            let yLabel;
            /** @type {?} */
            let xLabel;
            switch (this.tooltipYLabelFormatType) {
                case 'number':
                    yLabel = this.tooltipYLabelFormat(data.yLabel);
                    break;
                case 'time':
                    /** @type {?} */
                    const parsedTime = d3_isoParse(data.yLabel);
                    yLabel = this.tooltipYLabelFormat(parsedTime);
                    break;
                default:
                    yLabel = `${data.yLabel}${this.tooltipYLabelFormatString}`;
            }
            switch (this.tooltipXLabelFormatType) {
                case 'number':
                    xLabel = this.tooltipXLabelFormat(data.xLabel);
                    break;
                case 'time':
                    /** @type {?} */
                    const parsedTime = d3_isoParse(data.xLabel);
                    xLabel = this.tooltipXLabelFormat(parsedTime);
                    break;
                default:
                    xLabel = `${data.xLabel}${this.tooltipXLabelFormatString}`;
            }
            /** @type {?} */
            const value = this.tooltipValueFormat === null
                ? `<div class="tooltip-value">${data.value}</div>`
                : `<div class="tooltip-value">${this.tooltipValueFormat(data.value)}</div>`;
            this.tooltip.html(`
        ${yLabel} : ${xLabel}<br>
        ${value}
      `);
            /** @type {?} */
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight + 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight}px`); //
            this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            this.tooltip.style('opacity', 1);
            this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        () => {
            this.tooltip.style('opacity', 0);
        });
        this.xAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        item => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return this.xAxisFormat(item);
                case 'time':
                    /** @type {?} */
                    const parseDate = d3_isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        });
        this.yAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        item => {
            switch (this.yAxisFormatType) {
                case 'number':
                    return this.yAxisFormat(item);
                case 'time':
                    /** @type {?} */
                    const parseDate = d3_isoParse(item);
                    return this.yAxisFormat(parseDate);
                default:
                    return item;
            }
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
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height + this.margin.top + this.margin.bottom}`);
        // color range
        /** @type {?} */
        const colors = this._dataviz
            .getColors(true, this.theme)
            .slice()
            .reverse();
        /** @type {?} */
        const colorDomain = [
            +d3_min(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => d.value)),
            +d3_max(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => d.value))
        ];
        /** @type {?} */
        const colorValues = this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        d => d.value));
        switch (this.scale) {
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
        // console.log(colors, colorDomain, colorValues, this.scale, this.colorRange, this.colorDomain);
        // define axis labels
        /** @type {?} */
        const xAxisLabels = [...new Set(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            d => d.xLabel)))];
        /** @type {?} */
        const yAxisLabels = [...new Set(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            d => d.yLabel)))].reverse();
        // X axis
        this.xAxisScale = d3_scaleBand()
            .domain(xAxisLabels)
            .rangeRound([0, this.width - this.margin.left])
            .paddingInner(0.1);
        this.xAxisCall = d3_axisBottom(this.xAxisScale)
            .tickSize(this.xAxisTickSize)
            .tickSizeOuter(this.xAxisTickSizeOuter)
            .tickFormat(this.xAxisFormatter);
        this.xAxis = this.svg
            .append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(0, ${this.height})`)
            .classed('axis-hidden', this.hideXAxis)
            .classed('axis-zero-hidden', this.hideXAxisZero)
            .classed('axis-domain-hidden', this.hideXAxisDomain)
            .classed('axis-ticks-hidden', this.hideXAxisTicks)
            .call(this.xAxisCall);
        // Y axis
        this.yAxisScale = d3_scaleBand()
            .domain(yAxisLabels)
            .rangeRound([this.height, 0])
            .paddingInner(0.1);
        this.yAxisCall = d3_axisLeft(this.yAxisScale)
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
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', 'pbds-tooltip south')
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
        }
        this.updateChart();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
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
}
PbdsDatavizHeatmapComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-heatmap',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizHeatmapComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller }
];
PbdsDatavizHeatmapComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    heatmapClass: [{ type: HostBinding, args: ['class.pbds-chart-heatmap',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    scale: [{ type: Input }],
    domain: [{ type: Input }],
    xAxisFormatType: [{ type: Input }],
    xAxisFormatString: [{ type: Input }],
    yAxisFormatType: [{ type: Input }],
    yAxisFormatString: [{ type: Input }],
    hideLegend: [{ type: Input }],
    legendWidth: [{ type: Input }],
    legendPosition: [{ type: Input }],
    legendLabelFormatType: [{ type: Input }],
    legendLabelFormatString: [{ type: Input }],
    tooltipXLabelFormatType: [{ type: Input }],
    tooltipXLabelFormatString: [{ type: Input }],
    tooltipYLabelFormatType: [{ type: Input }],
    tooltipYLabelFormatString: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    theme: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.heatmapClass;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.scale;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.domain;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.yAxisFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.yAxisFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipXLabelFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipXLabelFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipYLabelFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipYLabelFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.colorDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideXAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideYAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideYAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideYAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideYAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipYLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipXLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.hideTooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipValueFormat;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.blockMouseOver;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.blockMouseOut;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.blockMouseClick;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizHeatmapComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype.yAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizHeatmapComponent.prototype._scroll;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1oZWF0bWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LWhlYXRtYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUlULFdBQVcsRUFDWCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFVBQVUsRUFFVixZQUFZLEVBQ1osdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR25ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXZELE9BQU8sRUFDTCxNQUFNLElBQUksU0FBUyxFQUNuQixRQUFRLElBQUksV0FBVyxFQUN2QixTQUFTLElBQUksWUFBWSxFQUN6QixjQUFjLElBQUksaUJBQWlCLEVBQ25DLGFBQWEsSUFBSSxnQkFBZ0IsRUFDakMsYUFBYSxJQUFJLGdCQUFnQixFQUNqQyxHQUFHLElBQUksTUFBTSxFQUNiLEdBQUcsSUFBSSxNQUFNLEVBQ2IsVUFBVSxJQUFJLGFBQWEsRUFDM0IsUUFBUSxJQUFJLFdBQVcsRUFDdkIsS0FBSyxJQUFJLFFBQVEsRUFDbEIsTUFBTSxJQUFJLENBQUM7QUFRWixNQUFNLE9BQU8sMkJBQTJCOzs7Ozs7SUF3SHRDLFlBQW9CLFFBQTRCLEVBQVUsUUFBb0IsRUFBVSxPQUF5QjtRQUE3RixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVk7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQXRIakgsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQU1wQixVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osV0FBTSxHQUFHLEdBQUcsQ0FBQztRQUdiLGNBQVMsR0FBRyxDQUFD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a0Q7O0lBRWxELGdFQUMrQjs7SUFFL0IsNkRBQ3dDOztJQUV4QywrREFDOEI7O0lBRTlCLDRDQUMrRDs7SUFFL0QsOENBQzJEOztJQUUzRCw4Q0FDMkQ7Ozs7O0lBRTNELDRDQUFjOzs7OztJQUNkLDBDQUFZOzs7OztJQUNaLDZDQUFlOzs7OztJQUNmLGlEQUFtQjs7Ozs7SUFDbkIsa0RBQW9COzs7OztJQUNwQixpREFBbUI7Ozs7O0lBQ25CLGdEQUFrQjs7Ozs7SUFDbEIsNENBQWM7Ozs7O0lBQ2Qsa0RBQW9COzs7OztJQUNwQixvREFBOEI7Ozs7O0lBQzlCLHlEQUFtQzs7Ozs7SUFDbkMsc0RBQWlDOzs7OztJQUNqQyxvREFBK0I7Ozs7O0lBQy9CLHFEQUFnQzs7Ozs7SUFDaEMsZ0RBQTJCOzs7OztJQUMzQiw0Q0FBYzs7Ozs7SUFDZCxrREFBb0I7Ozs7O0lBQ3BCLG9EQUFzQjs7Ozs7SUFDdEIseURBQTJCOzs7OztJQUMzQixpREFBbUI7Ozs7O0lBQ25CLGdEQUFrQjs7Ozs7SUFDbEIsZ0RBQTJCOzs7OztJQUMzQixzREFBaUM7Ozs7O0lBQ2pDLG9EQUErQjs7Ozs7SUFDL0IscURBQWdDOzs7OztJQUNoQyx3REFBMEI7Ozs7O0lBQzFCLDhDQUFnQjs7Ozs7SUFDaEIsMERBQTRCOzs7OztJQUM1QiwwREFBNEI7Ozs7O0lBQzVCLGtEQUFvQjs7Ozs7SUFDcEIseURBQTJCOztJQWlLM0Isa0RBeUZFOztJQUVGLHFEQVFFOztJQUVGLG9EQUVFOztJQUVGLHNEQUVFOztJQUVGLHNEQWtCRTs7SUFFRixxREFJRTs7SUFFRix1REFFRTs7Ozs7SUFFRixrREF3REU7Ozs7O0lBRUYsa0RBRUU7Ozs7O0lBRUYscURBWUU7Ozs7O0lBRUYscURBWUU7Ozs7O0lBbFlVLCtDQUFvQzs7Ozs7SUFBRSwrQ0FBNEI7Ozs7O0lBQUUsOENBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRWxlbWVudFJlZixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6SGVhdG1hcCB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgc2VsZWN0IGFzIGQzX3NlbGVjdCxcbiAgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UsXG4gIHNjYWxlQmFuZCBhcyBkM19zY2FsZUJhbmQsXG4gIHNjYWxlVGhyZXNob2xkIGFzIGQzX3NjYWxlVGhyZXNob2xkLFxuICBzY2FsZVF1YW50aWxlIGFzIGQzX3NjYWxlUXVhbnRpbGUsXG4gIHNjYWxlUXVhbnRpemUgYXMgZDNfc2NhbGVRdWFudGl6ZSxcbiAgbWluIGFzIGQzX21pbixcbiAgbWF4IGFzIGQzX21heCxcbiAgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLFxuICBheGlzTGVmdCBhcyBkM19heGlzTGVmdCxcbiAgZXZlbnQgYXMgZDNfZXZlbnRcbn0gZnJvbSAnZDMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotaGVhdG1hcCcsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpIZWF0bWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1oZWF0bWFwJylcbiAgaGVhdG1hcENsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpekhlYXRtYXA+O1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzA2O1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAwOyAvLyBoYXJkY29kZWQgb24gcHVycG9zZSwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMzA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gNTU7XG5cbiAgQElucHV0KClcbiAgc2NhbGU6ICd0aHJlc2hvbGQnIHwgJ3F1YW50aWxlJyB8ICdxdWFudGl6ZScgPSAncXVhbnRpbGUnO1xuXG4gIEBJbnB1dCgpXG4gIGRvbWFpbjogQXJyYXk8bnVtYmVyPjtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB4QXhpc0Zvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMTA1ICsgMjg7IC8vIGhhcmRjb2RlZCBsZWdlbmQgd2lkdGggKyBsZWZ0IG1hcmdpbiwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbGVnZW5kUG9zaXRpb246ICdyaWdodCcgfCAnYm90dG9tJyA9ICdyaWdodCc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwWExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBYTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwWUxhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBZTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdGhlbWU6ICdjbGFzc2ljJyB8ICdvY2VhbicgfCAnc3Vuc2V0JyB8ICd0d2lsaWdodCcgPSAnY2xhc3NpYyc7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgY29sb3JEb21haW47XG4gIHByaXZhdGUgeEF4aXNTY2FsZTtcbiAgcHJpdmF0ZSB4QXhpc0NhbGw7XG4gIHByaXZhdGUgeEF4aXM7XG4gIHByaXZhdGUgeEF4aXNGb3JtYXQ7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIGhpZGVYQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1RpY2tzOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpczogYm9vbGVhbjtcbiAgcHJpdmF0ZSB5QXhpcztcbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdDtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplO1xuICBwcml2YXRlIHlBeGlzVGlja1NpemVPdXRlcjtcbiAgcHJpdmF0ZSB5QXhpc1NjYWxlO1xuICBwcml2YXRlIHlBeGlzQ2FsbDtcbiAgcHJpdmF0ZSBoaWRlWUF4aXM6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwWUxhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBYTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgaGlkZVRvb2x0aXA7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXG4gICAgICByaWdodDogK3RoaXMubWFyZ2luUmlnaHQsXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRlIGZvcm1hdHRlcnNcbiAgICB0aGlzLnlBeGlzRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnlBeGlzRm9ybWF0VHlwZSwgdGhpcy55QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFR5cGUsIHRoaXMueEF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBZTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFlMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFlMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwWExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBYTGFiZWxGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBYTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGRlZmF1bHRzIGZvciBhbGwgY2hhcnQgdHlwZXNcbiAgICB0aGlzLmhpZGVYQXhpcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IHRydWU7XG4gICAgdGhpcy5oaWRlVG9vbHRpcCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgIHRoaXMuaGlkZVlBeGlzVGlja3MgPSB0cnVlO1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuICAgIHRoaXMueUF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBjaGFydFxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGh9ICR7K3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tfWBcbiAgICAgICk7XG5cbiAgICAvLyBjb2xvciByYW5nZVxuICAgIGNvbnN0IGNvbG9ycyA9IHRoaXMuX2RhdGF2aXpcbiAgICAgIC5nZXRDb2xvcnModHJ1ZSwgdGhpcy50aGVtZSlcbiAgICAgIC5zbGljZSgpXG4gICAgICAucmV2ZXJzZSgpO1xuXG4gICAgY29uc3QgY29sb3JEb21haW46IGFueSA9IFtcbiAgICAgICtkM19taW4odGhpcy5kYXRhLCAoZDogUGJkc0RhdGF2aXpIZWF0bWFwKSA9PiBkLnZhbHVlKSxcbiAgICAgICtkM19tYXgodGhpcy5kYXRhLCAoZDogUGJkc0RhdGF2aXpIZWF0bWFwKSA9PiBkLnZhbHVlKVxuICAgIF07XG4gICAgY29uc3QgY29sb3JWYWx1ZXMgPSB0aGlzLmRhdGEubWFwKGQgPT4gZC52YWx1ZSk7XG5cbiAgICBzd2l0Y2ggKHRoaXMuc2NhbGUpIHtcbiAgICAgIGNhc2UgJ3RocmVzaG9sZCc6XG4gICAgICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlVGhyZXNob2xkKClcbiAgICAgICAgICAuZG9tYWluKHRoaXMuZG9tYWluKVxuICAgICAgICAgIC5yYW5nZShjb2xvcnMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLmNvbG9yUmFuZ2UuZG9tYWluKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdxdWFudGlsZSc6XG4gICAgICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlUXVhbnRpbGUoKVxuICAgICAgICAgIC5kb21haW4oY29sb3JWYWx1ZXMpXG4gICAgICAgICAgLnJhbmdlKGNvbG9ycyk7XG5cbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IHRoaXMuY29sb3JSYW5nZS5xdWFudGlsZXMoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3F1YW50aXplJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVRdWFudGl6ZSgpXG4gICAgICAgICAgLmRvbWFpbihjb2xvckRvbWFpbilcbiAgICAgICAgICAucmFuZ2UoY29sb3JzKTtcblxuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gdGhpcy5jb2xvclJhbmdlLnRocmVzaG9sZHMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coY29sb3JzLCBjb2xvckRvbWFpbiwgY29sb3JWYWx1ZXMsIHRoaXMuc2NhbGUsIHRoaXMuY29sb3JSYW5nZSwgdGhpcy5jb2xvckRvbWFpbik7XG5cbiAgICAvLyBkZWZpbmUgYXhpcyBsYWJlbHNcbiAgICBjb25zdCB4QXhpc0xhYmVsczogYW55ID0gWy4uLm5ldyBTZXQodGhpcy5kYXRhLm1hcChkID0+IGQueExhYmVsKSldO1xuICAgIGNvbnN0IHlBeGlzTGFiZWxzOiBhbnkgPSBbLi4ubmV3IFNldCh0aGlzLmRhdGEubWFwKGQgPT4gZC55TGFiZWwpKV0ucmV2ZXJzZSgpO1xuXG4gICAgLy8gWCBheGlzXG4gICAgdGhpcy54QXhpc1NjYWxlID0gZDNfc2NhbGVCYW5kKClcbiAgICAgIC5kb21haW4oeEF4aXNMYWJlbHMpXG4gICAgICAucmFuZ2VSb3VuZChbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnRdKVxuICAgICAgLnBhZGRpbmdJbm5lcigwLjEpO1xuXG4gICAgdGhpcy54QXhpc0NhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSlcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnhBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXMpXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc0RvbWFpbilcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzVGlja3MpXG4gICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAvLyBZIGF4aXNcbiAgICB0aGlzLnlBeGlzU2NhbGUgPSBkM19zY2FsZUJhbmQoKVxuICAgICAgLmRvbWFpbih5QXhpc0xhYmVscylcbiAgICAgIC5yYW5nZVJvdW5kKFt0aGlzLmhlaWdodCwgMF0pXG4gICAgICAucGFkZGluZ0lubmVyKDAuMSk7XG5cbiAgICB0aGlzLnlBeGlzQ2FsbCA9IGQzX2F4aXNMZWZ0KHRoaXMueUF4aXNTY2FsZSlcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnlBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnlBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueUF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy55QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteScpXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXNUaWNrcylcbiAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgc291dGgnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcbiAgICB9XG5cbiAgICAvLyBhZGQgbGVnZW5kIGNsYXNzZXNcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jsb2NrJylcbiAgICAgICAgICAgIC5jbGFzc2VkKCdlbXB0eScsIGQgPT4gZC52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGQudmFsdWUgPT09IG51bGwpXG4gICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQueExhYmVsKSlcbiAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZC55TGFiZWwpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMueUF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQudmFsdWUpKSxcbiAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgdXBkYXRlLmNhbGwodXBkYXRlID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnZW1wdHknLCBkID0+IGQudmFsdWUgPT09IHVuZGVmaW5lZCB8fCBkLnZhbHVlID09PSBudWxsKVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC54TGFiZWwpKVxuICAgICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGQueUxhYmVsKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy55QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBkID0+IHRoaXMuY29sb3JSYW5nZShkLnZhbHVlKSlcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpO1xuXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgIH0pLFxuICAgICAgICBleGl0ID0+XG4gICAgICAgICAgZXhpdFxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG4gICAgICApXG4gICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmxvY2tNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5ibG9ja01vdXNlT3V0KCkpXG4gICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5ibG9ja01vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuY2hhcnRcbiAgICAgICAgLnNlbGVjdCgnLmxlZ2VuZCcpXG4gICAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAgIC5kYXRhKHRoaXMuY29sb3JEb21haW4pXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZW50ZXIuYXBwZW5kKCdsaScpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJyk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZCkpO1xuXG4gICAgICAgICAgICBsaS5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJylcbiAgICAgICAgICAgICAgLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsOiBzdHJpbmcgPSBkO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYCZnZTsgJHtsYWJlbH1gO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgbGV0IGxhYmVsOiBzdHJpbmcgPSBkO1xuXG4gICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgbGFiZWwgPSB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gYCZnZTsgJHtsYWJlbH1gO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHRoaXMubGVnZW5kTW91c2VPdXQoKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubGVnZW5kTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG4gICAgfVxuICB9O1xuXG4gIGJsb2NrTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhLnZhbHVlLCBldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKTtcblxuICAgIGlmIChkYXRhLnZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnRvb2x0aXBTaG93KGRhdGEsIGluZGV4LCBub2Rlc1tpbmRleF0pO1xuICAgIH1cblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgYmxvY2tNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgYmxvY2tNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmxvY2snKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICBpZiAoaW5kZXggKyAxID09PSBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gZC52YWx1ZSA8IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGQudmFsdWUgPCBkYXRhIHx8IGQudmFsdWUgPj0gK2QzX3NlbGVjdChub2Rlc1tpbmRleCArIDFdKS5kYXRhKClbMF07XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5ibG9jaycpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChkYXRhLCBpbmRleCwgbm9kZSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdUT09MVElQOiAnLCBkYXRhLCBpbmRleCwgbm9kZSk7XG5cbiAgICBjb25zdCBkaW1lbnNpb25zID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBsZXQgeUxhYmVsO1xuICAgIGxldCB4TGFiZWw7XG5cbiAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcFlMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHlMYWJlbCA9IHRoaXMudG9vbHRpcFlMYWJlbEZvcm1hdChkYXRhLnlMYWJlbCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGRhdGEueUxhYmVsKTtcbiAgICAgICAgeUxhYmVsID0gdGhpcy50b29sdGlwWUxhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeUxhYmVsID0gYCR7ZGF0YS55TGFiZWx9JHt0aGlzLnRvb2x0aXBZTGFiZWxGb3JtYXRTdHJpbmd9YDtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcFhMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHhMYWJlbCA9IHRoaXMudG9vbHRpcFhMYWJlbEZvcm1hdChkYXRhLnhMYWJlbCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGRhdGEueExhYmVsKTtcbiAgICAgICAgeExhYmVsID0gdGhpcy50b29sdGlwWExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeExhYmVsID0gYCR7ZGF0YS54TGFiZWx9JHt0aGlzLnRvb2x0aXBYTGFiZWxGb3JtYXRTdHJpbmd9YDtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9XG4gICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICA/IGA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZVwiPiR7ZGF0YS52YWx1ZX08L2Rpdj5gXG4gICAgICAgIDogYDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlXCI+JHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX08L2Rpdj5gO1xuXG4gICAgdGhpcy50b29sdGlwLmh0bWwoXG4gICAgICBgXG4gICAgICAgICR7eUxhYmVsfSA6ICR7eExhYmVsfTxicj5cbiAgICAgICAgJHt2YWx1ZX1cbiAgICAgIGBcbiAgICApO1xuXG4gICAgY29uc3QgdG9vbHRpcE9mZnNldFdpZHRoID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0V2lkdGggLyAyO1xuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQgKyA4O1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHsrc2Nyb2xsWzFdICsgK2RpbWVuc2lvbnMudG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodH1weGApOyAvL1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAkeytzY3JvbGxbMF0gKyArZGltZW5zaW9ucy5sZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRoICsgK2RpbWVuc2lvbnMud2lkdGggLyAyfXB4YCk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSBpdGVtID0+IHtcbiAgICBzd2l0Y2ggKHRoaXMueEF4aXNGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChpdGVtKTtcblxuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGl0ZW0pO1xuICAgICAgICByZXR1cm4gdGhpcy54QXhpc0Zvcm1hdChwYXJzZURhdGUpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIHN3aXRjaCAodGhpcy55QXhpc0Zvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KGl0ZW0pO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
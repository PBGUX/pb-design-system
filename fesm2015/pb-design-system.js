import { Injectable, ɵɵdefineInjectable, EventEmitter, Component, ChangeDetectionStrategy, ElementRef, HostBinding, Input, Output, ContentChild, NgModule, Directive, HostListener, Inject, LOCALE_ID, ɵɵinject, ViewChild } from '@angular/core';
import { ViewportScroller, Location, CommonModule, registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, getLocaleFirstDayOfWeek, getLocaleDateFormat, FormatWidth, formatDate } from '@angular/common';
import { isoParse, event as event$1, interpolate, mouse, format, timeFormat, scaleOrdinal, pie, arc, select, min, max, scaleBand, axisBottom, scaleLinear, axisLeft, extent, bisectLeft, isoFormat, line, curveCatmullRom, area, scaleTime, stack, stackOrderNone, geoAlbers, geoAlbersUsa, geoMercator, geoPath, scaleThreshold, scaleQuantile, scaleQuantize, range, values, sum, easeLinear } from 'd3';
import { feature, mesh } from 'topojson';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerI18n, NgbDate, NgbCalendar, NgbDatepickerModule, NgbPopoverModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatRadioModule } from '@angular/material/radio';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizService {
    constructor() {
        this.colors = {
            classic: {
                full: [
                    '#E23DA8',
                    '#1BB9FF',
                    '#FF8B00',
                    '#A319B1',
                    '#00B140',
                    '#0384D4',
                    '#314183',
                    '#EDB700',
                    '#8b98c8',
                    '#ccb8ce',
                    '#e6c49c',
                    '#9b9b9b'
                ],
                mono: ['#001D56', '#003296', '#4B74C5', '#89A1D0', '#A3BCEE', '#C9D7F3'] // blue
            },
            twilight: {
                full: [
                    '#A319B1',
                    '#00B140',
                    '#FF8B00',
                    '#1BB9FF',
                    '#E23DA8',
                    '#0384D4',
                    '#314183',
                    '#EDB700',
                    '#8b98c8',
                    '#ccb8ce',
                    '#e6c49c',
                    '#9b9b9b'
                ],
                mono: ['#05395C', '#0A5B92', '#0072B8', '#5DA9DC', '#A5D4F3', '#D1EDFF'] // light blue
            },
            ocean: {
                full: [
                    '#0384D4',
                    '#E23DA8',
                    '#1BB9FF',
                    '#314183',
                    '#FFC500',
                    '#A319B1',
                    '#FF8B00',
                    '#14767D',
                    '#8b98c8',
                    '#e6c49c',
                    '#ccb8ce',
                    '#9b9b9b'
                ],
                mono: ['#394B4D', '#3A6B6E', '#14767D', '#99BFC2', '#C9E6E8', '#DEECED'] // blue-green
            },
            sunset: {
                full: [
                    '#CE2060',
                    '#FF8B00',
                    '#1BB9FF',
                    '#FFC500',
                    '#00B140',
                    '#50248F',
                    '#0384d4',
                    '#CCB8CE',
                    '#314183',
                    '#E6C49C',
                    '#8b98c8',
                    '#9b9b9b'
                ],
                mono: ['#31254A', '#50248F', '#7945C4', '#9A79E2', '#C4A8FF', '#D9C7FF'] // purple
            }
        };
        this.getColors = (/**
         * @param {?=} mono
         * @param {?=} theme
         * @return {?}
         */
        (mono = false, theme = 'classic') => {
            return mono ? this.colors[theme].mono : this.colors[theme].full;
        });
        this.createGradientDefs = (/**
         * @param {?} svg
         * @param {?=} mono
         * @param {?=} theme
         * @param {?=} vertical
         * @return {?}
         */
        (svg, mono = false, theme = 'classic', vertical = true) => {
            /** @type {?} */
            const colors = mono ? [this.colors[theme].mono[2]] : this.colors[theme].full;
            for (let i = 0; i < colors.length; i++) {
                /** @type {?} */
                const color = mono ? this.colors[theme].mono[2] : this.colors[theme].full[i];
                /** @type {?} */
                let gradient;
                if (vertical) {
                    gradient = svg
                        .append('defs')
                        .append('linearGradient')
                        .attr('id', `gradient-${color.replace('#', '')}`)
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
                        .attr('id', `gradient-horizontal-${color.replace('#', '')}`)
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
        });
        this.createGlowFilter = (/**
         * @param {?} svg
         * @return {?}
         */
        svg => {
            // add a new definition
            /** @type {?} */
            const glow = svg
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
            const feOffsets = [
                {
                    dy: 2,
                    slope: 0.2
                },
                {
                    dy: 5,
                    slope: 0.05
                }
            ];
            for (let i = 0; i < feOffsets.length; i++) {
                glow
                    .append('feOffset')
                    .attr('result', 'offsetBlur' + i)
                    .attr('dx', 0)
                    .attr('dy', feOffsets[i].dy);
            }
            for (let y = 0; y < feOffsets.length; y++) {
                glow
                    .append('feComponentTransfer')
                    .attr('result', 'coloredBlur' + y)
                    .attr('in', 'offsetBlur' + y)
                    .append('feFuncA')
                    .attr('type', 'linear')
                    .attr('slope', feOffsets[y].slope);
            }
            /** @type {?} */
            const merge = glow.append('feMerge');
            merge.append('feMergeNode').attr('in', 'SourceGraphic');
            for (let x = 0; x < feOffsets.length; x++) {
                merge.append('feMergeNode').attr('in', 'coloredBlur' + x);
            }
        });
    }
}
PbdsDatavizService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
PbdsDatavizService.ctorParameters = () => [];
/** @nocollapse */ PbdsDatavizService.ngInjectableDef = ɵɵdefineInjectable({ factory: function PbdsDatavizService_Factory() { return new PbdsDatavizService(); }, token: PbdsDatavizService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizService.prototype.colors;
    /** @type {?} */
    PbdsDatavizService.prototype.getColors;
    /** @type {?} */
    PbdsDatavizService.prototype.createGradientDefs;
    /** @type {?} */
    PbdsDatavizService.prototype.createGlowFilter;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizPieComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     */
    constructor(_dataviz, _element) {
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
         * @return {?}
         */
        () => {
            /** @type {?} */
            const paths = this.svg.selectAll('path').data(this.pie(this.data));
            paths
                .exit()
                .transition()
                .attr('pointer-events', 'none')
                .remove();
            //update existing items
            paths
                .each((/**
             * @param {?} d
             * @return {?}
             */
            (d) => (d.outerRadius = this.outerRadius)))
                .attr('pointer-events', 'none')
                .transition()
                .duration(500)
                .attrTween('d', this.arcTween)
                .transition()
                .attr('pointer-events', 'auto');
            // paths on enter
            /** @type {?} */
            const enterPaths = paths
                .enter()
                .append('path')
                .each((/**
             * @param {?} d
             * @return {?}
             */
            (d) => (d.outerRadius = this.outerRadius)))
                .attr('d', this.arc)
                .attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.colorRange(d.data.label)))
                .attr('class', 'slice')
                .each((/**
             * @param {?} d
             * @param {?} i
             * @param {?} nodes
             * @return {?}
             */
            (d, i, nodes) => {
                this.currentData.splice(i, 1, d);
            }));
            if (this.type === 'pie') {
                enterPaths
                    .style('stroke', '#fff')
                    .style('stroke-width', 2)
                    .style('stroke-alignment', 'inner');
            }
            /** @type {?} */
            const legendItem = this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(this.data);
            legendItem.exit().remove();
            // update existing items
            legendItem.select('.legend-label').html((/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                switch (this.legendLabelFormatType) {
                    case 'time':
                        /** @type {?} */
                        const parsedTime = isoParse(d.label);
                        return this.legendLabelFormat(parsedTime);
                    default:
                        return d.label;
                }
            }));
            legendItem.select('.legend-value').html((/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.legendValueFormat(d.value)));
            // legend items on enter
            /** @type {?} */
            const enterLegendItem = legendItem
                .enter()
                .append('li')
                // .attr('tabindex', 0)
                .attr('class', 'legend-item');
            enterLegendItem
                .append('span')
                .attr('class', 'legend-key')
                .style('background-color', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.colorRange(d.label)));
            /** @type {?} */
            const legendDescription = enterLegendItem.append('span').attr('class', 'legend-description');
            legendDescription
                .append('span')
                .attr('class', 'legend-label')
                .html((/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                switch (this.legendLabelFormatType) {
                    case 'time':
                        /** @type {?} */
                        const parsedTime = isoParse(d.label);
                        return this.legendLabelFormat(parsedTime);
                    default:
                        return d.label;
                }
            }));
            legendDescription
                .append('span')
                .attr('class', 'legend-value')
                .html((/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.legendValueFormat(d.value)));
            enterLegendItem
                .on('mouseover focus', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => {
                this.legendMouseOverFocus(data, index, nodes);
                this.pathMouseOver(event$1, data, index, nodes);
            }))
                .on('mouseout blur', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => {
                this.legendMouseOutBlur(data, index, nodes);
                this.pathMouseOut(data, index, nodes);
            }))
                .on('click', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => {
                this.clicked.emit({ event: event$1, data: data });
            }));
            enterPaths
                .on('mouseover', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => {
                this.pathMouseOver(event$1, data, index, nodes);
                this.tooltipShow(this.chart.node(), data);
            }))
                .on('mousemove', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => {
                this.tooltipMove(this.chart.node());
            }))
                .on('mouseout', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => {
                this.pathMouseOut(data, index, nodes);
                this.tooltipHide();
            }))
                .on('click', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => {
                this.pathClick(event$1, data, index, nodes);
            }));
        });
        this.arcTween = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => {
            // console.log('ARGS: ', data, index, nodes);
            /** @type {?} */
            const i = interpolate(this.currentData[index], data);
            this.currentData[index] = i(1);
            return (/**
             * @param {?} t
             * @return {?}
             */
            t => this.arc(i(t)));
        });
        this.legendMouseOverFocus = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => {
            this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
        });
        this.legendMouseOutBlur = (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
        });
        this.pathMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            /** @type {?} */
            const slices = this.chart.selectAll('.slice');
            /** @type {?} */
            const slice = slices.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index));
            this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            slices.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index)).classed('inactive', true);
            slice
                .transition()
                .duration(300)
                .delay(0)
                .attrTween('d', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                /** @type {?} */
                const i = interpolate(d.outerRadius, this.outerRadius + this.arcZoom);
                return (/**
                 * @param {?} t
                 * @return {?}
                 */
                t => {
                    d.outerRadius = i(t);
                    return this.arc(d);
                });
            }));
            this.hovered.emit({
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
        (data, index, value) => {
            /** @type {?} */
            const slices = this.chart.selectAll('.slice');
            /** @type {?} */
            const slice = slices.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index));
            this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', false);
            slices.classed('inactive', false);
            slice
                .transition()
                .duration(300)
                .delay(0)
                .attrTween('d', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                /** @type {?} */
                const i = interpolate(d.outerRadius, this.outerRadius);
                return (/**
                 * @param {?} t
                 * @return {?}
                 */
                t => {
                    d.outerRadius = i(t);
                    return this.arc(d);
                });
            }));
        });
        this.pathClick = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.clicked.emit({
                event: event,
                data: data.data
            });
        });
        this.tooltipShow = (/**
         * @param {?} node
         * @param {?} data
         * @return {?}
         */
        (node, data) => {
            this.tooltipSetPosition(node);
            /** @type {?} */
            const percentage = (data.endAngle - data.startAngle) / (2 * Math.PI);
            /** @type {?} */
            let label;
            switch (this.tooltipLabelFormatType) {
                case 'time':
                    /** @type {?} */
                    const parsedTime = isoParse(data.data.label);
                    label = this.tooltipLabelFormat(parsedTime);
                    break;
                default:
                    label = data.data.label;
            }
            this.tooltip.html(`
        <div class="tooltip-label">${label}</div>
        <div class="tooltip-value">${this.tooltipValueFormat(percentage)}</div>
      `);
            this.tooltip.style('opacity', 1);
        });
        this.tooltipMove = (/**
         * @param {?} node
         * @return {?}
         */
        node => {
            this.tooltipSetPosition(node);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        () => {
            this.tooltip.style('opacity', 0);
        });
        this.tooltipSetPosition = (/**
         * @param {?} node
         * @return {?}
         */
        node => {
            /** @type {?} */
            const coordinates = mouse(node);
            this.tooltip.style('left', `${coordinates[0] + 16}px`);
            this.tooltip.style('top', `${coordinates[1] + 16}px`);
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
        this.width = this.width - this.margin.left - this.margin.right;
        this.height = this.width - this.margin.top - this.margin.bottom;
        this.colors = this._dataviz.getColors(this.monochrome, this.theme);
        this.innerRadius = Math.min(this.width, this.height) / 2.5;
        this.outerRadius = Math.min(this.width, this.height) / 2;
        this.arcZoom = 10;
        this.anglePad = 0.02;
        this.legendValueFormat = format(this.legendValueFormatString);
        this.tooltipValueFormat = format(this.tooltipValueFormatString);
        switch (this.legendLabelFormatType) {
            case 'time':
                this.legendLabelFormat = timeFormat(this.legendLabelFormatString);
                break;
            default:
                this.legendLabelFormat = null;
                break;
        }
        switch (this.tooltipLabelFormatType) {
            case 'time':
                this.tooltipLabelFormat = timeFormat(this.tooltipLabelFormatString);
                break;
            default:
                this.tooltipLabelFormat = null;
                break;
        }
        this.colorRange = scaleOrdinal()
            .range(this.colors)
            .domain(this.data.map((/**
         * @param {?} c
         * @return {?}
         */
        c => c.label)));
        if (this.type === 'pie') {
            this.innerRadius = 0;
            this.anglePad = 0;
        }
        this.pie = pie()
            .padAngle(this.anglePad)
            .value((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.value))
            .sort(null);
        this.arc = arc()
            .padRadius(this.outerRadius)
            .innerRadius(this.innerRadius);
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        this.svg = this.chart
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.width / 2 + this.margin.left} -${this.height / 2 + this.margin.top} ${this.width +
            this.margin.left +
            this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`);
        this.legend = this.chart.append('ul').attr('class', 'legend legend-right');
        this.tooltip = this.chart
            .append('div')
            .style('opacity', 0)
            .attr('class', 'pbds-tooltip')
            .attr('aria-hidden', 'true');
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
PbdsDatavizPieComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-pie',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizPieComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef }
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizBarComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     * @param {?} _scroll
     * @param {?} _location
     */
    constructor(_dataviz, _element, _scroll, _location) {
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this._location = _location;
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            let group;
            /** @type {?} */
            let groupEnter;
            // update the xScale
            this.xAxisScale.domain(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            d => d.label)));
            // update the yScale
            this.yAxisScale
                .domain([
                min(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => d.value - d.value * +this.yAxisMinBuffer)),
                max(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => d.value + d.value * +this.yAxisMaxBuffer))
            ])
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
            if (!this.hideGrayBars) {
                // rebind data to groups
                group = this.svg.selectAll('.bar-group').data(this.data);
                // remove bars
                // add bars on enter
                group
                    .exit()
                    .transition()
                    .attr('pointer-events', 'none')
                    .remove();
                // update gray bars
                group
                    .select('.gray-bar')
                    .transition()
                    .duration(1000)
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label)))
                    .attr('width', this.xAxisScale.bandwidth());
                // update the existing bars
                group
                    .select('.bar')
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 4))
                    .attr('width', this.xAxisScale.bandwidth() / 2)
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.height - this.yAxisScale(d.value)))
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d.value)))
                    .transition()
                    .attr('pointer-events', 'auto');
                // add group on enter
                groupEnter = group
                    .enter()
                    .append('g')
                    .attr('class', 'bar-group');
                // add gray bars on enter
                groupEnter
                    .append('rect')
                    .attr('class', 'gray-bar')
                    .attr('rx', 0)
                    .attr('height', 0)
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label)))
                    .attr('width', this.xAxisScale.bandwidth())
                    .transition()
                    .attr('height', this.height)
                    .attr('width', this.xAxisScale.bandwidth());
                // add bars on enter
                groupEnter
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('rx', 2)
                    .attr('fill', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => `url(${this._location.path()}#gradient-${this.colorRange(d.label).substr(1)})`)) // removes hash to prevent safari bug;
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 4))
                    .attr('width', this.xAxisScale.bandwidth() / 2)
                    .attr('y', this.height)
                    .attr('height', 0)
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d.value)))
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.height - this.yAxisScale(d.value)))
                    .attr('data-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)))
                    .transition()
                    .attr('pointer-events', 'auto');
                groupEnter
                    .select('.bar')
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseOver(event$1, data, index, nodes)))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseOut()))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseClick(event$1, data, index, nodes)));
            }
            else {
                // rebind data to groups
                group = this.svg.selectAll('.bar-group').data(this.data);
                // remove bars
                group
                    .exit()
                    .transition()
                    .attr('pointer-events', 'none')
                    .remove();
                // update the existing bars
                group
                    .select('.bar')
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 5.5))
                    .attr('width', this.xAxisScale.bandwidth() / 1.5)
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d.value)))
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.height - this.yAxisScale(d.value)))
                    .transition()
                    .attr('pointer-events', 'auto');
                // add group on enter
                groupEnter = group
                    .enter()
                    .append('g')
                    .attr('class', 'bar-group');
                // add bars on enter
                groupEnter
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('rx', 2)
                    .attr('fill', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => `url(${this._location.path()}#gradient-${this.colorRange(d.label).substr(1)})`)) // removes hash to prevent safari bug;
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 5.5))
                    .attr('width', this.xAxisScale.bandwidth() / 1.5)
                    .attr('y', this.height)
                    .attr('height', 0)
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d.value)))
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.height - this.yAxisScale(d.value)))
                    .attr('data-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)))
                    .transition()
                    .attr('pointer-events', 'auto');
                groupEnter
                    .select('.bar')
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseOver(event$1, data, index, nodes)))
                    .on('mouseout', (/**
                 * @return {?}
                 */
                () => this.barMouseOut()))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.barMouseClick(event$1, data, index, nodes)));
            }
            if (!this.hideLegend) {
                /** @type {?} */
                const legendItem = this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.data);
                legendItem.exit().remove();
                // update existing items
                legendItem.select('.legend-label').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    // return this.legendLabelFormat === null ? d.label : this.legendLabelFormat(d.label);
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                // legend items on enter
                /** @type {?} */
                const enterLegendItem = legendItem
                    .enter()
                    .append('li')
                    .attr('class', 'legend-item');
                enterLegendItem
                    .append('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)));
                enterLegendItem
                    .append('span')
                    .attr('class', 'legend-label')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    // return this.legendLabelFormat === null ? d.label : this.legendLabelFormat(d.label);
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                enterLegendItem
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.legendMouseOver(event$1, data, index, nodes)))
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
                (data, index, nodes) => this.legendMouseClick(event$1, data, index, nodes)));
            }
            if (this.threshold) {
                this.yThreshold
                    .raise()
                    .transition()
                    .duration(1000)
                    .attr('transform', `translate(0,  ${this.yAxisScale(+this.threshold)})`);
            }
            if (this.average) {
                this.yAverage
                    .raise()
                    .transition()
                    .duration(1000)
                    .attr('transform', `translate(0,  ${this.yAxisScale(+this.average)})`);
            }
        });
        this.barMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.chart
                .selectAll('.bar-group')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            /** @type {?} */
            const bar = this.chart
                .selectAll('.bar-group')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .select('.bar');
            /** @type {?} */
            const barColor = bar.attr('data-color');
            bar.style('fill', (/**
             * @return {?}
             */
            () => barColor));
            this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.tooltipShow(data, nodes.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index)));
            this.hovered.emit({ event, data });
        });
        this.barMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart
                .selectAll('.bar-group')
                .classed('inactive', false)
                .select('.bar')
                .style('fill', null);
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.tooltipHide();
        });
        this.barMouseClick = (/**
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
                .selectAll('.bar-group')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            /** @type {?} */
            const bar = this.chart
                .selectAll('.bar-group')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .select('.bar');
            /** @type {?} */
            const barColor = bar.attr('data-color');
            bar.style('fill', (/**
             * @return {?}
             */
            () => barColor));
            this.tooltipShow(data, this.chart.selectAll('.bar').filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))._groups[0]); // TODO: find better way than using _groups
            this.hovered.emit({ event, data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart
                .selectAll('.bar-group')
                .classed('inactive', false)
                .select('.bar')
                .style('fill', null);
            this.tooltipHide();
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
         * @param {?} node
         * @return {?}
         */
        (data, node) => {
            /** @type {?} */
            const dimensions = node[0].getBoundingClientRect();
            /** @type {?} */
            const scroll = this._scroll.getScrollPosition();
            /** @type {?} */
            let label;
            switch (this.tooltipLabelFormatType) {
                case 'number':
                    label = this.tooltipLabelFormat(data.label);
                    break;
                case 'time':
                    /** @type {?} */
                    const parsedTime = isoParse(data.label);
                    label = this.tooltipLabelFormat(parsedTime);
                    break;
                default:
                    label = data.label;
            }
            /** @type {?} */
            const value = this.tooltipValueFormat === null
                ? `<div class="tooltip-value">${data.value}</div>`
                : `<div class="tooltip-value">${this.tooltipValueFormat(data.value)}</div>`;
            this.tooltip.html(`
        ${this.hideTooltipLabel ? '' : `${label}`}
        ${value}
      `);
            /** @type {?} */
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight + 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight}px`); //
            this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
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
                    const parseDate = isoParse(item);
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
                    const parseDate = isoParse(item);
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
        switch (this.xAxisFormatType) {
            case 'number':
                this.xAxisFormat = format(this.xAxisFormatString);
                break;
            case 'time':
                this.xAxisFormat = timeFormat(this.xAxisFormatString);
                break;
        }
        switch (this.yAxisFormatType) {
            case 'number':
                this.yAxisFormat = format(this.yAxisFormatString);
                break;
            case 'time':
                this.yAxisFormat = timeFormat(this.yAxisFormatString);
                break;
        }
        switch (this.legendLabelFormatType) {
            case 'number':
                this.legendLabelFormat = format(this.legendLabelFormatString);
                break;
            case 'time':
                this.legendLabelFormat = timeFormat(this.legendLabelFormatString);
                break;
            default:
                this.legendLabelFormat = null;
                break;
        }
        switch (this.tooltipLabelFormatType) {
            case 'number':
                this.tooltipLabelFormat = format(this.tooltipLabelFormatString);
                break;
            case 'time':
                this.tooltipLabelFormat = timeFormat(this.tooltipLabelFormatString);
                break;
            default:
                this.tooltipLabelFormat = null;
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = format(this.tooltipValueFormatString);
                break;
            case 'time':
                this.tooltipValueFormat = timeFormat(this.tooltipValueFormatString);
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
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height + this.margin.top + this.margin.bottom}`);
        // build color ranges
        this.colorRange = scaleOrdinal().range(this._dataviz.createGradientDefs(this.svg, this.singleSeries, this.theme));
        // X AXIS
        this.xAxisScale = scaleBand()
            .domain(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        d => d.label)))
            .rangeRound([0, this.width - this.margin.left])
            .align(0);
        // add padding to the scale for gray bars
        !this.hideGrayBars
            ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
            : this.xAxisScale.paddingInner(0).paddingOuter(0);
        this.xAxisCall = axisBottom(this.xAxisScale)
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
        // X GRIDLINES
        if (!this.hideXGrid) {
            this.xGridCall = axisBottom(this.xAxisScale).tickSize(-this.height);
            this.xGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-x')
                .classed('grid-zero-hidden', this.hideXAxisZero)
                .attr('transform', `translate(0, ${this.height})`)
                .call(this.xGridCall);
        }
        // Y AXIS
        this.yAxisScale = scaleLinear()
            .domain([
            min(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            d => d.value - d.value * +this.yAxisMinBuffer)),
            max(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            d => d.value + d.value * +this.yAxisMaxBuffer))
        ])
            .nice()
            .rangeRound([this.height, 0]);
        this.yAxisCall = axisLeft(this.yAxisScale)
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
            this.yGridCall = axisLeft(this.yAxisScale)
                .ticks(this.yAxisTicks)
                .tickSize(-this.width + this.margin.left + this.margin.right);
            this.yGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-y')
                .classed('grid-zero-hidden', this.hideYAxisZero)
                .attr('transform', `translate(0, 0)`)
                .call(this.yGridCall);
        }
        // Y THRESHOLD
        if (this.threshold) {
            this.yThreshold = this.svg
                .append('line')
                .attr('class', 'threshold')
                .attr('x2', +this.width)
                .attr('transform', `translate(0,  ${this.yAxisScale(+this.threshold)})`);
        }
        // Y AVERAGE
        if (this.average) {
            this.yAverage = this.svg
                .append('line')
                .attr('class', 'average')
                .attr('x2', +this.width)
                .attr('transform', `translate(0,  ${this.yAxisScale(+this.average)})`);
        }
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = select('body')
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
PbdsDatavizBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizBarComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller },
    { type: Location }
];
PbdsDatavizBarComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    barClass: [{ type: HostBinding, args: ['class.pbds-chart-bar',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    type: [{ type: Input }],
    singleSeries: [{ type: Input }],
    xAxisFormatType: [{ type: Input }],
    xAxisFormatString: [{ type: Input }],
    yAxisFormatType: [{ type: Input }],
    yAxisFormatString: [{ type: Input }],
    yAxisTicks: [{ type: Input }],
    yAxisMinBuffer: [{ type: Input }],
    yAxisMaxBuffer: [{ type: Input }],
    hideLegend: [{ type: Input }],
    legendWidth: [{ type: Input }],
    legendPosition: [{ type: Input }],
    legendLabelFormatType: [{ type: Input }],
    legendLabelFormatString: [{ type: Input }],
    tooltipLabelFormatType: [{ type: Input }],
    tooltipLabelFormatString: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    threshold: [{ type: Input }],
    average: [{ type: Input }],
    theme: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.barClass;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.type;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.singleSeries;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisTicks;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisMinBuffer;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.yAxisMaxBuffer;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.threshold;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.average;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideGrayBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yThreshold;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAverage;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideYAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideTooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.hideTooltipLabel;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltipLabelFormat;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.barMouseOver;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.barMouseOut;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.barMouseClick;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizBarComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype.yAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype._scroll;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarComponent.prototype._location;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizLineComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     * @param {?} _scroll
     * @param {?} _location
     */
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
        // debug to show all chart options
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.tooltipHovered = new EventEmitter();
        this.tooltipClicked = new EventEmitter();
        this.updateChart = (/**
         * @return {?}
         */
        () => {
            this.mouserect.data(this.data);
            // update the xScale
            this.xAxisScale.domain(extent(this.data.dates, (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                return isoParse(d);
            })));
            // update the yScale
            this.yAxisScale
                .domain([
                min(this.data.series, (/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                (d, i) => {
                    /** @type {?} */
                    const minVal = +min(d.values);
                    return minVal - minVal * +this.yAxisMinBuffer;
                })),
                max(this.data.series, (/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                (d, i) => {
                    /** @type {?} */
                    const maxVal = +max(d.values);
                    return maxVal + maxVal * this.yAxisMaxBuffer;
                }))
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
            /** @type {?} */
            const group = this.svg.selectAll('.line-group').data(this.data.series);
            // remove lines
            group.exit().remove();
            // update existing
            group
                .select('path.line')
                .transition()
                .duration(1000)
                .attr('d', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.d3line(d.values)));
            if (this.area) {
                group
                    .select('path.area')
                    .transition()
                    .duration(1000)
                    .attr('d', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.d3area(d.values)));
            }
            group
                .selectAll('circle')
                .data((/**
             * @param {?} d
             * @return {?}
             */
            d => d.values))
                .transition()
                .duration(1000)
                .attr('cx', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => this.xAxisScale(isoParse(this.data.dates[i]))))
                .attr('cy', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.yAxisScale(d)));
            // add group on enter
            /** @type {?} */
            const groupEnter = group
                .enter()
                .append('g')
                .attr('class', 'line-group');
            // add line on enter
            /** @type {?} */
            const line = groupEnter
                .append('path')
                .attr('class', 'line')
                .style('color', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.colorRange(d.label)))
                .style('stroke-width', this.lineWidth)
                .transition()
                .duration(1000)
                .attr('d', (/**
             * @param {?} data
             * @return {?}
             */
            data => this.d3line(data.values)));
            if (this.area) {
                groupEnter
                    .append('path')
                    .attr('class', 'area')
                    .attr('d', (/**
                 * @param {?} data
                 * @return {?}
                 */
                data => this.d3area(data.values)))
                    .style('color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)));
            }
            // add points
            if (this.linePoints) {
                /** @type {?} */
                const points = groupEnter
                    .append('g')
                    .attr('class', 'points')
                    .style('color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)));
                /** @type {?} */
                const circles = points.selectAll('circle').data((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => d.values));
                circles
                    .enter()
                    .append('circle')
                    .attr('cx', (/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                (d, i) => this.xAxisScale(isoParse(this.data.dates[i]))))
                    .attr('cy', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d)))
                    .attr('r', this.lineWidth * 2)
                    .style('stroke-width', this.lineWidth);
            }
            if (this.type !== 'high') {
                line.attr('filter', `url(${this._location.path()}#glow)`);
            }
            if (!this.hideLegend) {
                /** @type {?} */
                const legendItem = this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.data.series);
                legendItem.exit().remove();
                // update existing items
                legendItem.select('.legend-label').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                // legend items on enter
                /** @type {?} */
                const enterLegendItem = legendItem
                    .enter()
                    .append('li')
                    .attr('class', 'legend-item');
                enterLegendItem
                    .append('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)));
                enterLegendItem
                    .append('span')
                    .attr('class', 'legend-label')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                enterLegendItem
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.legendMouseOver(event$1, data, index, nodes)))
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
                (data, index, nodes) => this.legendMouseClick(event$1, data, index, nodes)));
            }
            if (!this.hideTooltip) {
                /** @type {?} */
                const tooltipItem = this.tooltip
                    .select('.tooltip-table')
                    .selectAll('tr')
                    .data(this.data.series);
                tooltipItem.exit().remove();
                // update existing items
                tooltipItem.select('.tooltip-label pr-2').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    return this.tooltipHeadingFormat(d.label);
                }));
                // items on enter
                /** @type {?} */
                const entertooltipItem = tooltipItem
                    .enter()
                    .append('tr')
                    .attr('class', 'tooltip-item');
                entertooltipItem
                    .append('td')
                    .style('color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)))
                    .append('span')
                    .attr('class', 'pbds-tooltip-key');
                entertooltipItem
                    .append('td')
                    .attr('class', 'tooltip-label pr-2 text-nowrap')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    return this.tooltipLabelFormatType ? this.tooltipLabelFormat(d.label) : d.label;
                }));
                entertooltipItem
                    .append('td')
                    .attr('class', 'tooltip-value text-right text-nowrap')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => ''));
            }
            this.mouserect.raise();
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
                .selectAll('.line-group')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            /** @type {?} */
            const line = this.chart.selectAll('.line-group').filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index));
            line.classed('active', true);
            if (this.linePoints) {
                /** @type {?} */
                const circles = line.selectAll('circle');
                circles.classed('active', true);
            }
            this.hovered.emit({ event, data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart
                .selectAll('.line-group')
                .classed('inactive', false)
                .classed('active', false);
            if (this.linePoints) {
                /** @type {?} */
                const circles = this.chart.selectAll('circle');
                circles.classed('active', false);
            }
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
        this.mouserectMouseMove = (/**
         * @param {?} event
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, index, nodes) => {
            /** @type {?} */
            const mouseXDate = this.xAxisScale.invert(mouse(nodes[0])[0]);
            // return date at mouse x position
            /** @type {?} */
            const leftIndex = bisectLeft(this.data.dates, isoFormat(mouseXDate));
            // prevent error for 0 index
            if (leftIndex === 0)
                return false;
            /** @type {?} */
            const dateLower = new Date(this.data.dates[leftIndex - 1]);
            /** @type {?} */
            const dateUpper = new Date(this.data.dates[leftIndex]);
            /** @type {?} */
            const closestDate = +mouseXDate - +dateLower > +dateUpper - mouseXDate ? dateUpper : dateLower;
            // date mouse is closest to
            /** @type {?} */
            const closestIndex = this.data.dates.indexOf(isoFormat(closestDate));
            // which index the mouse is closest to
            // console.log(+mouseXDate, leftIndex, +dateLower, +dateUpper, +closestDate, closestIndex);
            /** @type {?} */
            const circles = this.svg.selectAll('.line-group').selectAll('circle');
            circles.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === closestIndex)).classed('active', true);
            circles.filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== closestIndex)).classed('active', false);
            this.tooltipLine
                .attr('x1', this.xAxisScale(closestDate))
                .attr('x2', this.xAxisScale(closestDate))
                .classed('active', true);
            // console.log(this.tooltipLine.node().getBoundingClientRect(), this._scroll.getScrollPosition());
            this.tooltipShow(this.tooltipLine.node(), closestIndex);
            this.mousedata = {
                date: closestDate,
                series: this.data.series.map((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    return {
                        label: d.label,
                        value: d.values[closestIndex]
                    };
                }))
            };
            this.tooltipHovered.emit({ event, data: this.mousedata });
        });
        this.mouserectMouseOut = (/**
         * @param {?} event
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, index, nodes) => {
            this.svg.selectAll('circle').classed('active', false);
            this.tooltipLine.classed('active', false);
            this.tooltipHide();
        });
        this.mouserectMouseClick = (/**
         * @return {?}
         */
        () => {
            this.tooltipClicked.emit({ event, data: this.mousedata });
        });
        this.tooltipShow = (/**
         * @param {?} node
         * @param {?} closestIndex
         * @return {?}
         */
        (node, closestIndex) => {
            /** @type {?} */
            const scroll = this._scroll.getScrollPosition();
            /** @type {?} */
            const mouserectDimensions = node.getBoundingClientRect();
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            /** @type {?} */
            const tooltipDimensions = this.tooltip.node().getBoundingClientRect();
            /** @type {?} */
            const dimensionCalculated = mouserectDimensions.left + tooltipDimensions.width + 8;
            /** @type {?} */
            const clientWidth = document.body.clientWidth - 10;
            /** @type {?} */
            let position;
            // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
            this.tooltip.select('.tooltip-header').html((/**
             * @param {?} d
             * @return {?}
             */
            d => {
                /** @type {?} */
                const parsedTime = isoParse(this.data.dates[closestIndex]);
                return this.tooltipHeadingFormat(parsedTime);
            }));
            this.tooltip.selectAll('.tooltip-value').html((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                return this.tooltipValueFormatType
                    ? this.tooltipValueFormat(this.data.series[i].values[closestIndex])
                    : this.data.series[i].values[closestIndex];
            }));
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
            /** @type {?} */
            const parseDate = isoParse(item);
            return this.xAxisFormat(parseDate);
        });
        this.yAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        item => {
            return this.yAxisFormat(item);
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
        this.xAxisFormat = timeFormat(this.xAxisFormatString);
        this.yAxisFormat = format(this.yAxisFormatString);
        switch (this.legendLabelFormatType) {
            case 'number':
                this.legendLabelFormat = format(this.legendLabelFormatString);
                break;
            case 'time':
                this.legendLabelFormat = timeFormat(this.legendLabelFormatString);
                break;
            default:
                this.legendLabelFormat = null;
                break;
        }
        this.tooltipHeadingFormat = timeFormat(this.tooltipHeadingFormatString);
        switch (this.tooltipLabelFormatType) {
            case 'number':
                this.tooltipLabelFormat = format(this.tooltipLabelFormatString);
                break;
            case 'time':
                this.tooltipLabelFormat = timeFormat(this.tooltipLabelFormatString);
                break;
            default:
                this.tooltipLabelFormat = null;
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = format(this.tooltipValueFormatString);
                break;
            case 'time':
                this.tooltipValueFormat = timeFormat(this.tooltipValueFormatString);
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
        this.d3line = line()
            .x((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => this.xAxisScale(isoParse(this.data.dates[i]))))
            .y((/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.yAxisScale(d)));
        // define line curve
        if (this.lineCurved) {
            this.d3line.curve(curveCatmullRom.alpha(0.5));
        }
        // define area
        if (this.area) {
            this.d3area = area()
                .x((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => this.xAxisScale(isoParse(this.data.dates[i]))))
                .y0(this.height)
                .y1((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => this.yAxisScale(d)));
            if (this.lineCurved) {
                this.d3area.curve(curveCatmullRom.alpha(0.5));
            }
        }
        // create the chart
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
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
            .on('mousemove', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.mouserectMouseMove(event$1, index, nodes)))
            .on('mouseout', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.mouserectMouseOut(event$1, index, nodes)))
            .on('click', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.mouserectMouseClick()));
        this.tooltipLine = this.svg
            .append('line')
            .attr('y1', 0)
            .attr('y2', this.height)
            .attr('class', 'tooltip-line');
        // define color range
        this.colorRange = scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
        // add glow def
        this._dataviz.createGlowFilter(this.svg);
        // X AXIS
        this.xAxisScale = scaleTime()
            .domain(extent(this.data.dates, (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return isoParse(d);
        })))
            .range([0, this.width - this.margin.left - this.margin.right]);
        this.xAxisCall = axisBottom(this.xAxisScale)
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
            this.xGridCall = axisBottom(this.xAxisScale).tickSize(-this.height);
            this.xGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-x')
                .classed('grid-zero-hidden', this.hideXAxisZero)
                .attr('transform', `translate(0, ${this.height})`) //${-this.margin.right / 2}
                .call(this.xGridCall);
        }
        // Y AXIS
        this.yAxisScale = scaleLinear()
            .domain([
            min(this.data.series, (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                /** @type {?} */
                const minVal = +min(d.values);
                return minVal - minVal * +this.yAxisMinBuffer;
            })),
            max(this.data.series, (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                /** @type {?} */
                const maxVal = +max(d.values);
                return maxVal + maxVal * this.yAxisMaxBuffer;
            }))
        ])
            .nice()
            .range([this.height, 0]);
        this.yAxisCall = axisLeft(this.yAxisScale)
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
            this.yGridCall = axisLeft(this.yAxisScale)
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
            this.tooltip = select('body')
                .append('div')
                .attr('class', 'pbds-tooltip west')
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
            // tooltip header
            this.tooltip.append('div').attr('class', 'tooltip-header');
            // tooltip table
            /** @type {?} */
            const tooltipTable = this.tooltip.append('table').attr('class', 'tooltip-table text-left w-100');
            /** @type {?} */
            const tooltipTableTbody = tooltipTable.append('tbody');
            tooltipTableTbody
                .selectAll('tr')
                .data(this.data)
                .enter()
                .append('tr');
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
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
PbdsDatavizLineComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-line',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
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
    PbdsDatavizLineComponent.prototype.hideXGrid;
    /** @type {?} */
    PbdsDatavizLineComponent.prototype.hideYGrid;
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
    PbdsDatavizLineComponent.prototype.theme;
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
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizLineComponent.prototype._location;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizGaugeComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     */
    constructor(_dataviz, _element) {
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
        this.degreesToRadians = (/**
         * @param {?} degree
         * @return {?}
         */
        degree => {
            return (degree * Math.PI) / 180;
        });
        this.calculateMinMax = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const percentage = this.data.minvalue / (this.data.maxvalue - this.data.minvalue);
            return percentage * (this.data.value - this.data.minvalue) + (this.data.value - this.data.minvalue);
        });
        this.calculateCurve = (/**
         * @param {?} data
         * @return {?}
         */
        data => {
            /** @type {?} */
            const start = this.degreesToRadians(this.startAngle);
            /** @type {?} */
            const end = start + (data * (this.degreesToRadians(this.endAngle) - start)) / this.data.maxvalue;
            return [
                {
                    startAngle: start,
                    endAngle: end
                }
            ];
        });
        this.drawChart = (/**
         * @return {?}
         */
        () => {
            this.gauge = this.svg.append('g').attr('class', 'gauge-group');
            // background arc
            this.gauge
                .append('path')
                .data(this.calculateCurve(this.data.maxvalue))
                .attr('class', 'gauge-background')
                .attr('d', (/**
             * @param {?} d
             * @return {?}
             */
            d => {
                return this.arc({
                    innerRadius: this.radius - this.gaugeWidth,
                    outerRadius: this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            }));
            // value arc
            this.gauge
                .append('path')
                .data(this.calculateCurve(this.calculateMinMax()))
                .attr('class', 'gauge-value')
                .attr('fill', this.color)
                .attr('d', (/**
             * @param {?} d
             * @return {?}
             */
            d => {
                return this.arc({
                    innerRadius: this.radius - this.gaugeWidth,
                    outerRadius: this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            }));
            switch (this.type) {
                case 'horseshoe':
                    this.svg.attr('height', 230).attr('viewBox', `-${this.width / 2} -${this.height / 2} ${this.height} 230`);
                    break;
                case 'halfmoon':
                    this.svg.attr('height', this.width / 2);
                    this.svg.attr('viewBox', `-${this.width / 2} -${this.width / 2} ${this.width} ${this.width / 2}`);
                    break;
            }
        });
        this.updateChart = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const group = this.svg.select('.gauge-group');
            group
                .select('.gauge-value')
                .transition()
                .duration(750)
                .call(this.arcTween, this.calculateMinMax());
            this.labelTween = this.chart.select('.gauge-number');
            this.labelTween
                .transition()
                .duration(750)
                .call(this.textTween, this.data.value);
        });
        this.arcTween = (/**
         * @param {?} transition
         * @param {?} value
         * @return {?}
         */
        (transition, value) => {
            /** @type {?} */
            const newAngle = this.calculateCurve(value);
            transition.attrTween('d', (/**
             * @param {?} d
             * @return {?}
             */
            d => {
                /** @type {?} */
                const interpolate$1 = interpolate(d.endAngle, newAngle[0].endAngle);
                return (/**
                 * @param {?} t
                 * @return {?}
                 */
                t => {
                    d.endAngle = interpolate$1(t);
                    return this.arc({
                        innerRadius: this.radius - this.gaugeWidth,
                        outerRadius: this.radius,
                        startAngle: d.startAngle,
                        endAngle: d.endAngle
                    });
                });
            }));
        });
        this.textTween = (/**
         * @param {?} transition
         * @param {?} value
         * @return {?}
         */
        (transition, value) => {
            value = format('.2f')(value); // TODO: check these .1f formats here, should they be inputs?
            value = value.replace(/,/g, '.');
            transition.tween('text', (/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const interpolate$1 = interpolate(format('.2f')(+this.oldValue), value);
                return (/**
                 * @param {?} t
                 * @return {?}
                 */
                t => {
                    this.labelTween.text((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => {
                        /** @type {?} */
                        const updatedNumber = this.labelFormat(interpolate$1(t));
                        this.label = updatedNumber;
                        return updatedNumber;
                    }));
                });
            }));
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.height = this.width;
        this.radius = Math.max(this.width, this.height) / 2;
        this.labelFormat = format(this.labelFormatString);
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
        this.arc = arc().cornerRadius(this.rounded ? this.gaugeWidth : 0);
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        this.svg = this.chart
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'img-fluid') // to resize chart
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`);
        this.drawChart();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            // console.log(changes.data.previousValue.value, changes.data.currentValue.value);
            this.oldValue = changes.data.previousValue.value;
            this.updateChart();
        }
    }
}
PbdsDatavizGaugeComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-gauge',
                template: `
    <div
      *ngIf="!hideLabel"
      class="gauge-details"
      [ngClass]="{ halfmoon: type === 'halfmoon', 'gauge-details-small': type === 'halfmoon' }"
      [ngStyle]="{ 'max-width.px': width - 3 * gaugeWidth }"
    >
      <div class="gauge-number">{{ label }}</div>
      <div *ngIf="description" class="gauge-description text-center">{{ description }}</div>
    </div>
  `
            }] }
];
/** @nocollapse */
PbdsDatavizGaugeComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef }
];
PbdsDatavizGaugeComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    gaugeClass: [{ type: HostBinding, args: ['class.pbds-chart-gauge',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    type: [{ type: Input }],
    color: [{ type: Input }],
    hideLabel: [{ type: Input }],
    labelFormatString: [{ type: Input }],
    description: [{ type: Input }],
    gaugeWidth: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.gaugeClass;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.type;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.color;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.hideLabel;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.labelFormatString;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.description;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.gaugeWidth;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.gauge;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.labelTween;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.label;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.startAngle;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.endAngle;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.radius;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.arc;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.labelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.oldValue;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.height;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.rounded;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.degreesToRadians;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.calculateMinMax;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.calculateCurve;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.drawChart;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.arcTween;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.textTween;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype._element;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizSparklineComponent {
    /**
     * @param {?} _element
     */
    constructor(_element) {
        this._element = _element;
        this.chartClass = true;
        this.sparklineClass = true;
        this.width = 160;
        this.height = 40;
        this.type = 'line';
        this.color = '#E23DA8';
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
    ngOnInit() {
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
        let x = scaleLinear().range([0, this.width - this.margin.left - this.margin.right]);
        /** @type {?} */
        let y = scaleLinear().range([this.height - this.margin.top - this.margin.bottom, 0]);
        y.domain([+min(this.data) - this.yAxisMinBuffer, +max(this.data) + this.yAxisMaxBuffer]);
        x.domain([0, this.data.length]);
        /** @type {?} */
        let line$1 = line()
            .x((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => x(i)))
            .y((/**
         * @param {?} d
         * @return {?}
         */
        (d) => y(d)));
        /** @type {?} */
        let area$1 = area()
            .x((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => x(i)))
            .y0(this.height)
            .y1((/**
         * @param {?} d
         * @return {?}
         */
        (d) => y(d)));
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        this.svg = this.chart
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${this.width} ${this.height}`);
        if (this.type === 'line' || this.type === 'line-high' || this.type === 'area' || this.type === 'area-high') {
            this.svg
                .append('path')
                .datum(this.data)
                .attr('class', 'sparkline')
                .attr('fill', 'none')
                .attr('stroke-width', this.strokeWidth)
                .attr('stroke', this.color)
                .attr('d', line$1);
        }
        if (this.type === 'area' || this.type === 'area-high') {
            this.svg
                .append('path')
                .datum(this.data)
                .attr('class', 'sparkarea')
                .attr('fill', this.color)
                .attr('fill-opacity', 0.3)
                .attr('d', area$1);
        }
        if (this.type === 'bar') {
            /** @type {?} */
            const barWidth = (this.width - this.data.length) / this.data.length;
            // handles negative values, see example https://www.essycode.com/posts/create-sparkline-charts-d3/
            this.svg
                .selectAll('.bar')
                .data(this.data)
                .enter()
                .append('rect')
                .attr('class', 'sparkbar')
                .attr('x', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => x(i)))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            d => (d > 0 ? y(d) : y(0))))
                .attr('width', barWidth)
                .attr('height', (/**
             * @param {?} d
             * @return {?}
             */
            d => Math.abs(y(d) - y(0))))
                .attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            d => (d > 0 ? this.color : this.colorNegative))); // still uses undocumented negative color values
        }
    }
}
PbdsDatavizSparklineComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-sparkline',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizSparklineComponent.ctorParameters = () => [
    { type: ElementRef }
];
PbdsDatavizSparklineComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    sparklineClass: [{ type: HostBinding, args: ['class.pbds-chart-sparkline',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    type: [{ type: Input }],
    color: [{ type: Input }],
    colorNegative: [{ type: Input }],
    strokeWidth: [{ type: Input }],
    yAxisMinBuffer: [{ type: Input }],
    yAxisMaxBuffer: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.sparklineClass;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.type;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.color;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.colorNegative;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.strokeWidth;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.yAxisMinBuffer;
    /** @type {?} */
    PbdsDatavizSparklineComponent.prototype.yAxisMaxBuffer;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizSparklineComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizSparklineComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizSparklineComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizSparklineComponent.prototype._element;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizBarStackedComponent {
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (/**
         * @return {?}
         */
        () => {
            this.dataKeys = Object.keys(this.data[0]).filter((/**
             * @param {?} item
             * @return {?}
             */
            item => item !== 'key'));
            // create the D3 stack data
            this.dataStack = stack()
                .keys(this.dataKeys)
                .order(stackOrderNone)(this.data);
            // update the xScale
            this.xAxisScale.domain(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            d => d.key)));
            // update the yScale
            this.yAxisMax = max(this.dataStack, (/**
             * @param {?} data
             * @return {?}
             */
            (data) => {
                return max(data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => {
                    return d[1];
                }));
            }));
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale
                .domain([0, this.yAxisMax])
                .rangeRound([this.height, 0])
                .nice();
            this.xAxis
                .transition()
                .duration(0) // 1000
                .call(this.xAxisCall);
            this.yAxis
                .transition()
                .duration(0) // 1000
                .call(this.yAxisCall);
            // update the grids
            if (!this.hideXGrid) {
                this.xGrid
                    .transition()
                    .duration(0) // 1000
                    .call(this.xGridCall);
            }
            if (!this.hideYGrid) {
                this.yGrid
                    .transition()
                    .duration(0) // 1000
                    .call(this.yGridCall);
            }
            // add gray bars
            if (!this.hideGrayBars) {
                this.grayBars
                    .selectAll('.gray-bar')
                    .data(this.data)
                    .join((/**
                 * @param {?} enter
                 * @return {?}
                 */
                enter => enter
                    .append('rect')
                    .attr('class', 'gray-bar')
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.key)))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height)), (/**
                 * @param {?} update
                 * @return {?}
                 */
                update => update
                    .transition()
                    .duration(0) // 1000
                    .attr('x', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.xAxisScale(d.key)))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height)), (/**
                 * @param {?} exit
                 * @return {?}
                 */
                exit => exit.remove()));
            }
            // add colored bars
            /** @type {?} */
            const barGroups = this.bars
                .selectAll('.bar-group')
                .data(this.dataStack)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('g')
                .attr('class', 'bar-group')
                .attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.colorRange(d.index)))), (/**
             * @param {?} update
             * @return {?}
             */
            update => update.attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.colorRange(d.index)))), (/**
             * @param {?} exit
             * @return {?}
             */
            exit => exit.remove()));
            barGroups
                .selectAll('.bar')
                .data((/**
             * @param {?} d
             * @return {?}
             */
            d => d))
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('rect')
                .attr('class', 'bar')
                .classed('bar-divided', this.type !== 'high')
                .classed('bar-divided-low', this.type === 'low')
                .attr('x', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                /** @type {?} */
                let x;
                if (this.type === 'medium') {
                    x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 8) * 3;
                }
                else {
                    x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 4) * 1;
                }
                return x;
            }))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.yAxisScale(d[1])))
                .attr('width', 0)
                .attr('height', 0)
                .call((/**
             * @param {?} enter
             * @return {?}
             */
            enter => {
                /** @type {?} */
                let width;
                if (this.type === 'medium') {
                    width = this.xAxisScale.bandwidth() / 4;
                }
                else {
                    width = this.xAxisScale.bandwidth() / 2;
                }
                enter
                    .transition()
                    .duration(0) // 1000
                    .attr('width', width)
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d[0]) - this.yAxisScale(d[1])));
                return enter;
            }))), (/**
             * @param {?} update
             * @return {?}
             */
            update => update.call((/**
             * @param {?} update
             * @return {?}
             */
            update => {
                /** @type {?} */
                let width;
                if (this.type === 'medium') {
                    width = this.xAxisScale.bandwidth() / 4;
                }
                else {
                    width = this.xAxisScale.bandwidth() / 2;
                }
                update
                    .transition()
                    .duration(0) // 1000
                    .attr('width', this.xAxisScale.bandwidth() / 4)
                    .attr('x', (/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                (d, i) => this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 8) * 3))
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d[1])))
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.yAxisScale(d[0]) - this.yAxisScale(d[1])));
                return update;
            }))), (/**
             * @param {?} exit
             * @return {?}
             */
            exit => exit.remove()));
            // mouseover bars
            this.mouseBars
                .selectAll('.mouseover-bar')
                .data(this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('rect')
                .attr('class', 'mouseover-bar')
                .style('opacity', 0)
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.xAxisScale(d.key)))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height)), (/**
             * @param {?} update
             * @return {?}
             */
            update => update
                .attr('pointer-events', 'none')
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.xAxisScale(d.key)))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height)
                .transition()
                .attr('pointer-events', 'auto')), (/**
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
            (data, index, nodes) => this.barMouseOver(event$1, data, index, nodes)))
                .on('mouseout', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => this.barMouseOut()))
                .on('click', (/**
             * @param {?} data
             * @param {?} index
             * @param {?} nodes
             * @return {?}
             */
            (data, index, nodes) => this.barMouseClick(event$1, data, index, nodes)));
            this.bars.raise();
            this.xAxis.raise();
            this.mouseBars.raise();
            if (!this.hideLegend) {
                // TODO: refactor to use .join() with enter, update, exit
                /** @type {?} */
                const legendItem = this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.dataStack);
                legendItem.exit().remove();
                // update existing items
                legendItem.select('.legend-label').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    // return this.legendLabelFormat === null ? d.label : this.legendLabelFormat(d.label);
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.key);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.key);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.key;
                    }
                }));
                // legend items on enter
                /** @type {?} */
                const enterLegendItem = legendItem
                    .enter()
                    .append('li')
                    .attr('class', 'legend-item');
                enterLegendItem
                    .append('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.index)));
                enterLegendItem
                    .append('span')
                    .attr('class', 'legend-label')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    // return this.legendLabelFormat === null ? d.label : this.legendLabelFormat(d.label);
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.key);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.key);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.key;
                    }
                }));
                enterLegendItem
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.legendMouseOver(event$1, data, index, nodes)))
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
                (data, index, nodes) => this.legendMouseClick(event$1, data, index, nodes)));
            }
        });
        this.barMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.tooltipShow(data, index, nodes[index]);
            this.hovered.emit({ event, data });
        });
        this.barMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.bar').classed('inactive', false);
            this.tooltipHide();
        });
        this.barMouseClick = (/**
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
                .selectAll('.bar-group')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.hovered.emit({ event, data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.bar-group').classed('inactive', false);
            this.tooltipHide();
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
                    const parseDate = isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
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
            const scroll = this._scroll.getScrollPosition();
            /** @type {?} */
            const mouserectDimensions = node.getBoundingClientRect();
            /** @type {?} */
            const clientWidth = document.body.clientWidth - 10;
            /** @type {?} */
            let dimensionCalculated;
            /** @type {?} */
            let tooltipDimensions;
            /** @type {?} */
            let tooltipOffsetHeight;
            /** @type {?} */
            let yPosition;
            /** @type {?} */
            let xPosition;
            // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
            this.tooltip.select('.tooltip-header').html((/**
             * @param {?} d
             * @return {?}
             */
            d => {
                switch (this.tooltipHeadingFormatType) {
                    case 'time':
                        /** @type {?} */
                        const parseDate = isoParse(data.key);
                        return this.tooltipHeadingFormat(parseDate);
                    default:
                        return data.key;
                }
            }));
            this.tooltip.select('.tooltip-header-value').html((/**
             * @param {?} d
             * @return {?}
             */
            d => {
                /** @type {?} */
                let total = 0;
                Object.keys(data).map((/**
                 * @param {?} e
                 * @return {?}
                 */
                e => {
                    if (e !== 'key') {
                        total = total + data[e];
                    }
                }));
                return this.tooltipHeadingValueFormat(total);
            }));
            this.tooltip
                .select('.tooltip-table')
                .select('tbody')
                .html((/**
             * @param {?} d
             * @return {?}
             */
            d => {
                /** @type {?} */
                let html = ``;
                /** @type {?} */
                let label;
                /** @type {?} */
                let value;
                Object.keys(data).map((/**
                 * @param {?} key
                 * @param {?} index
                 * @return {?}
                 */
                (key, index) => {
                    switch (this.tooltipLabelFormatType) {
                        case 'time':
                            /** @type {?} */
                            const parseDate = isoParse(key);
                            label = this.tooltipHeadingFormat(parseDate);
                            break;
                        default:
                            label = key;
                    }
                    switch (this.tooltipValueFormatType) {
                        case 'number':
                            value = this.tooltipValueFormat(data[key]);
                            break;
                        default:
                            value = data[key];
                    }
                    if (key !== 'key') {
                        html += `
              <tr class='tooltip-item'>
                <td style="color: ${this.colorRange(index - 1)}">
                  <span class="pbds-tooltip-key"></span>
                </td>
                <td class="tooltip-label pr-2 text-nowrap">${label}</td>
                <td class="tooltip-value text-right text-nowrap">${value}</td>
              </tr>
            `;
                    }
                }));
                return html;
            }));
            tooltipDimensions = this.tooltip.node().getBoundingClientRect();
            dimensionCalculated = mouserectDimensions.left + mouserectDimensions.width + tooltipDimensions.width + 8;
            tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            // flip the tooltip positions if near the right edge of the screen
            if (dimensionCalculated > clientWidth) {
                this.tooltip.classed('east', true);
                this.tooltip.classed('west', false);
                if (this.type === 'medium') {
                    xPosition = `${mouserectDimensions.left + (mouserectDimensions.width / 8) * 3 - tooltipDimensions.width - 8}px`;
                }
                else {
                    xPosition = `${mouserectDimensions.left + (mouserectDimensions.width / 4) * 1 - tooltipDimensions.width - 8}px`;
                }
            }
            else if (dimensionCalculated < clientWidth) {
                this.tooltip.classed('east', false);
                this.tooltip.classed('west', true);
                if (this.type === 'medium') {
                    xPosition = `${mouserectDimensions.left + (mouserectDimensions.width / 8) * 5 + 8}px`;
                }
                else {
                    xPosition = `${mouserectDimensions.left + (mouserectDimensions.width / 4) * 3 + 8}px`;
                }
            }
            yPosition = this.svg
                .selectAll('.bar-group')
                .filter(':last-child')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .node()
                .getBoundingClientRect();
            // set the tooltip styles
            this.tooltip.style('top', `${yPosition.top - tooltipOffsetHeight / 2 + scroll[1]}px`);
            this.tooltip.style('left', xPosition);
            this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        () => {
            this.tooltip.style('opacity', 0);
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
                    const parseDate = isoParse(item);
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
        // extract keys for stack data
        this.dataKeys = Object.keys(this.data[0]).filter((/**
         * @param {?} item
         * @return {?}
         */
        item => item !== 'key'));
        // create the D3 stack data
        this.dataStack = stack()
            .keys(this.dataKeys)
            .order(stackOrderNone)(this.data);
        //////////////////////////////////////////
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        switch (this.xAxisFormatType) {
            case 'number':
                this.xAxisFormat = format(this.xAxisFormatString);
                break;
            case 'time':
                this.xAxisFormat = timeFormat(this.xAxisFormatString);
                break;
        }
        switch (this.yAxisFormatType) {
            case 'number':
                this.yAxisFormat = format(this.yAxisFormatString);
                break;
            case 'time':
                this.yAxisFormat = timeFormat(this.yAxisFormatString);
                break;
        }
        switch (this.legendLabelFormatType) {
            case 'number':
                this.legendLabelFormat = format(this.legendLabelFormatString);
                break;
            case 'time':
                this.legendLabelFormat = timeFormat(this.legendLabelFormatString);
                break;
            default:
                this.legendLabelFormat = null;
                break;
        }
        switch (this.tooltipHeadingFormatType) {
            case 'time':
                this.tooltipHeadingFormat = timeFormat(this.tooltipHeadingFormatString);
                break;
            default:
                this.tooltipHeadingFormat = null;
                break;
        }
        switch (this.tooltipHeadingValueFormatType) {
            case 'number':
                this.tooltipHeadingValueFormat = format(this.tooltipHeadingValueFormatString);
                break;
            default:
                this.tooltipHeadingValueFormat = null;
                break;
        }
        switch (this.tooltipLabelFormatType) {
            case 'time':
                this.tooltipLabelFormat = timeFormat(this.tooltipLabelFormatString);
                break;
            default:
                this.tooltipLabelFormat = null;
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = format(this.tooltipValueFormatString);
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
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height + this.margin.top + this.margin.bottom}`);
        this.grayBars = this.svg.append('g').attr('class', 'gray-bars');
        this.mouseBars = this.svg.append('g').attr('class', 'mouseover-bars');
        this.bars = this.svg.append('g').attr('class', 'bars');
        // build color ranges
        this.colorRange = scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
        // X AXIS
        this.xAxisScale = scaleBand()
            .domain(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        d => d.key)))
            .rangeRound([0, this.width - this.margin.left])
            .align(0);
        // add padding to the scale for gray bars
        !this.hideGrayBars
            ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
            : this.xAxisScale.paddingInner(0).paddingOuter(0);
        this.xAxisCall = axisBottom(this.xAxisScale)
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
        // X GRIDLINES
        if (!this.hideXGrid) {
            this.xGridCall = axisBottom(this.xAxisScale).tickSize(-this.height);
            this.xGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-x')
                .classed('grid-zero-hidden', this.hideXAxisZero)
                .attr('transform', `translate(0, ${this.height})`)
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
        this.yAxisMax = max(this.dataStack, (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            return max(data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                return d[1];
            }));
        }));
        this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
        this.yAxisScale = scaleLinear()
            .domain([0, this.yAxisMax])
            .nice()
            .rangeRound([this.height, 0]);
        this.yAxisCall = axisLeft(this.yAxisScale)
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
            this.yGridCall = axisLeft(this.yAxisScale)
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
            this.tooltip = select('body')
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
PbdsDatavizBarStackedComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar-stacked',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizBarStackedComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller }
];
PbdsDatavizBarStackedComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    stackedBarClass: [{ type: HostBinding, args: ['class.pbds-chart-stacked-bar',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    type: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    hideXAxis: [{ type: Input }],
    xAxisFormatType: [{ type: Input }],
    xAxisFormatString: [{ type: Input }],
    yAxisFormatType: [{ type: Input }],
    yAxisFormatString: [{ type: Input }],
    yAxisTicks: [{ type: Input }],
    yAxisMaxBuffer: [{ type: Input }],
    hideLegend: [{ type: Input }],
    legendWidth: [{ type: Input }],
    legendPosition: [{ type: Input }],
    legendLabelFormatType: [{ type: Input }],
    legendLabelFormatString: [{ type: Input }],
    tooltipHeadingFormatType: [{ type: Input }],
    tooltipHeadingFormatString: [{ type: Input }],
    tooltipHeadingValueFormatType: [{ type: Input }],
    tooltipHeadingValueFormatString: [{ type: Input }],
    tooltipLabelFormatType: [{ type: Input }],
    tooltipLabelFormatString: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    theme: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.stackedBarClass;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.type;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.hideXAxis;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.yAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.yAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.yAxisTicks;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.yAxisMaxBuffer;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingValueFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingValueFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.dataStack;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.dataKeys;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.grayBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.mouseBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.bars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideGrayBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideXGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisMax;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideYAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.hideTooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipHeadingValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipLabelFormat;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.barMouseOver;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.barMouseOut;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.barMouseClick;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizBarStackedComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype.yAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarStackedComponent.prototype._scroll;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizMetricIndicatorComponent {
    constructor() {
        this.value = 0;
        this.class = '';
        this.indicator = 'flat';
        this.inverse = false;
    }
    /**
     * @return {?}
     */
    get hostClasses() {
        return ['metric-block-indicator', this.indicator, this.inverse ? 'inverse' : '', this.class].join(' ');
    }
}
PbdsDatavizMetricIndicatorComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-metric-indicator',
                template: `
    <span>{{ value }}</span>
  `
            }] }
];
PbdsDatavizMetricIndicatorComponent.propDecorators = {
    value: [{ type: Input }],
    class: [{ type: Input }],
    indicator: [{ type: Input }],
    inverse: [{ type: Input }],
    hostClasses: [{ type: HostBinding, args: ['class',] }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizMetricIndicatorComponent.prototype.value;
    /** @type {?} */
    PbdsDatavizMetricIndicatorComponent.prototype.class;
    /** @type {?} */
    PbdsDatavizMetricIndicatorComponent.prototype.indicator;
    /** @type {?} */
    PbdsDatavizMetricIndicatorComponent.prototype.inverse;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizMetricBlockComponent {
    constructor() {
        this.class = '';
        this.heading = null;
        this.value = 0;
        this.unit = null;
        this.description = null;
        this.centered = false;
        this.centeredText = false;
        this.vertical = false;
        this.hideValueMargin = false;
        this.isPercentUnit = false;
        this.isUnit = false;
    }
    /**
     * @return {?}
     */
    get hostClasses() {
        return [
            'metric-block',
            this.centered ? 'metric-block-centered' : '',
            this.centeredText ? 'metric-block-centered-text' : '',
            this.vertical ? 'metric-block-vertical' : '',
            this.class
        ].join(' ');
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.indicatorRef) {
            this.hideValueMargin = true;
        }
        if (this.unit !== '%' && this.unit !== null) {
            this.isUnit = true;
        }
        else if (this.unit === '%') {
            this.isPercentUnit = true;
        }
    }
}
PbdsDatavizMetricBlockComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-metric-block',
                template: `
    <div class="metric-block-inner">
      <div *ngIf="heading" class="metric-block-heading">{{ heading }}</div>
      <div class="metric-block-data-block">
        <div class="metric-block-contents">
          <div class="metric-block-value" [ngClass]="{ 'mr-0': hideValueMargin }">
            {{ value
            }}<span [ngClass]="{ 'metric-block-unit': isUnit, 'metric-block-percentage': isPercentUnit }">{{
              unit
            }}</span>
          </div>

          <div>
            <ng-content select="pbds-dataviz-metric-indicator"></ng-content>
          </div>
          <div *ngIf="description" class="metric-block-description">{{ description }}</div>
        </div>
        <ng-content select="pbds-dataviz-sparkline"></ng-content>
      </div>
    </div>
  `
            }] }
];
PbdsDatavizMetricBlockComponent.propDecorators = {
    class: [{ type: Input }],
    heading: [{ type: Input }],
    value: [{ type: Input }],
    unit: [{ type: Input }],
    description: [{ type: Input }],
    centered: [{ type: Input }],
    centeredText: [{ type: Input }],
    vertical: [{ type: Input }],
    hostClasses: [{ type: HostBinding, args: ['class',] }],
    indicatorRef: [{ type: ContentChild, args: [PbdsDatavizMetricIndicatorComponent, { static: true },] }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.class;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.heading;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.value;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.unit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.description;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.centered;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.centeredText;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.vertical;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.hideValueMargin;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.isPercentUnit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.isUnit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.indicatorRef;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class DatavizBubbleMapComponent {
    /**
     * @param {?} _element
     * @param {?} _scroll
     */
    constructor(_element, _scroll) {
        this._element = _element;
        this._scroll = _scroll;
        this.chartClass = true;
        this.bubbleMapClass = true;
        this.feature = '';
        this.scale = null;
        this.center = null;
        this.width = 306;
        this.height = 400;
        this.type = 'medium'; // debug to show all chart options
        // debug to show all chart options
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (/**
         * @return {?}
         */
        () => {
            // bubbles
            this.bubbleContainer
                .selectAll('circle')
                .data(this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('circle')
                .attr('class', 'dot-circle')
                .classed('solid', this.dot)
                .attr('cx', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.projection([d.longitude, d.latitude])[0]))
                .attr('cy', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.projection([d.longitude, d.latitude])[1]))
                .attr('r', (/**
             * @param {?} d
             * @return {?}
             */
            d => (!this.dot ? Math.sqrt(this.bubbleRadius(d.value)) : `${this.dotSize}px`)))), (/**
             * @param {?} update
             * @return {?}
             */
            update => update
                .transition()
                .duration(1000)
                .attr('cx', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.projection([d.longitude, d.latitude])[0]))
                .attr('cy', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.projection([d.longitude, d.latitude])[1]))
                .attr('r', (/**
             * @param {?} d
             * @return {?}
             */
            d => (!this.dot ? Math.sqrt(this.bubbleRadius(d.value)) : `${this.dotSize}px`)))
                .transition()
                .attr('pointer-events', 'auto')), (/**
             * @param {?} exit
             * @return {?}
             */
            exit => exit
                .transition()
                .attr('pointer-events', 'none')
                .remove()));
            if (!this.hideTooltip) {
                this.bubbleContainer
                    .selectAll('circle')
                    .on('mouseover', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.bubbleMouseOver(event$1, data, index, nodes)))
                    .on('mouseout', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.bubbleMouseOut(event$1, data, index, nodes)))
                    .on('click', (/**
                 * @param {?} data
                 * @param {?} index
                 * @param {?} nodes
                 * @return {?}
                 */
                (data, index, nodes) => this.bubbleMouseClick(event$1, data, index, nodes)));
                // bubble text
                if (this.type !== 'high' && !this.dot) {
                    this.bubbleContainer
                        .selectAll('text')
                        .data(this.data)
                        .join((/**
                     * @param {?} enter
                     * @return {?}
                     */
                    enter => enter
                        .append('text')
                        .text((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => (this.bubbleLabelFormat ? this.bubbleLabelFormat(d.value) : d.value)))
                        .attr('class', 'dot-text')
                        .style('fill', this.textColor)
                        .style('font-size', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => `${Math.round(this.fontRange(d.value))}px`))
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.projection([d.longitude, d.latitude])[0]))
                        .attr('y', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.projection([d.longitude, d.latitude])[1]))
                        .attr('dy', '.4em')), (/**
                     * @param {?} update
                     * @return {?}
                     */
                    update => update
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .text((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => (this.bubbleLabelFormat ? this.bubbleLabelFormat(d.value) : d.value)))
                        .style('font-size', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => `${Math.round(this.fontRange(d.value))}px`))
                        .attr('x', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.projection([d.longitude, d.latitude])[0]))
                        .attr('y', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => this.projection([d.longitude, d.latitude])[1]))
                        .attr('dy', '.4em')
                        .transition()
                        .attr('pointer-events', 'auto')), (/**
                     * @param {?} exit
                     * @return {?}
                     */
                    exit => exit
                        .transition()
                        .attr('pointer-events', 'none')
                        .remove()));
                }
            }
        });
        this.bubbleMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.chart
                .selectAll('.dot-circle')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.chart
                .selectAll('.dot-circle')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .classed('active', true);
            this.tooltipShow(data, nodes[index]);
            this.hovered.emit({ event, data });
        });
        this.bubbleMouseOut = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            this.chart
                .selectAll('.dot-circle')
                .classed('active', false)
                .classed('inactive', false);
            this.tooltipHide();
        });
        this.bubbleMouseClick = (/**
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
         * @param {?} node
         * @return {?}
         */
        (data, node) => {
            /** @type {?} */
            const dimensions = node.getBoundingClientRect();
            /** @type {?} */
            const scroll = this._scroll.getScrollPosition();
            this.tooltip.select('.tooltip-header').html((/**
             * @param {?} d
             * @return {?}
             */
            d => `${data.label}`));
            if (!this.hideTooltipValue) {
                this.tooltip
                    .select('.tooltip-value')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => (this.tooltipValueFormat ? `${this.tooltipValueFormat(data.value)}` : `${data.value}`)));
            }
            /** @type {?} */
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight + 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight}px`); //
            this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        () => {
            this.tooltip.style('opacity', 0);
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
                this.projection = geoAlbers();
                break;
            case 'geoAlbersUsa':
                this.projection = geoAlbersUsa();
                break;
            case 'geoMercator':
                this.projection = geoMercator();
                break;
            default:
                break;
        }
        switch (this.bubbleLabelFormatType) {
            case 'number':
                this.bubbleLabelFormat = format(this.bubbleLabelFormatString);
                break;
            default:
                this.bubbleLabelFormat = null;
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = format(this.tooltipValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
        // console.log('TOPOJSON: ', this.topojson);
        this.topojsonFeature = feature(this.topojson, this.topojson.objects[this.feature]);
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
        this.geoPath = geoPath().projection(this.projection);
        // bubble radius range
        if (this.data && !this.dot) {
            this.bubbleRadius = scaleLinear()
                .range(this.bubbleSizeRange)
                .domain([min(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => +d.value)), max(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => +d.value))]);
            // font range
            this.fontRange = scaleLinear()
                .range(this.textSizeRange)
                .domain([min(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => +d.value)), max(this.data, (/**
                 * @param {?} d
                 * @return {?}
                 */
                (d) => +d.value))]);
        }
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = select('body')
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
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width + this.margin.left + this.margin.right)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this.height +
            this.margin.top +
            this.margin.bottom}`)
            .append('g')
            .attr('class', 'container');
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
            .datum(mesh(this.topojson, this.topojson.objects[this.feature], (/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => a !== b)))
            .attr('d', this.geoPath);
        this.bubbleContainer = this.svg
            .append('g')
            .attr('class', 'dots')
            .style('color', this.color);
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
DatavizBubbleMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bubble-map',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
DatavizBubbleMapComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ViewportScroller }
];
DatavizBubbleMapComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    bubbleMapClass: [{ type: HostBinding, args: ['class.pbds-chart-bubble-map',] }],
    data: [{ type: Input }],
    topojson: [{ type: Input }],
    feature: [{ type: Input }],
    projectionType: [{ type: Input }],
    scale: [{ type: Input }],
    center: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    type: [{ type: Input }],
    dot: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    color: [{ type: Input }],
    textColor: [{ type: Input }],
    textSizeRange: [{ type: Input }],
    dotSize: [{ type: Input }],
    bubbleSizeRange: [{ type: Input }],
    bubbleLabelFormatType: [{ type: Input }],
    bubbleLabelFormatString: [{ type: Input }],
    hideTooltip: [{ type: Input }],
    hideTooltipValue: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.chartClass;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleMapClass;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.data;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.topojson;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.feature;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.projectionType;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.scale;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.center;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.width;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.height;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.type;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.dot;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.marginTop;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.marginRight;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.marginBottom;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.marginLeft;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.color;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.textColor;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.textSizeRange;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.dotSize;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleSizeRange;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleLabelFormatType;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleLabelFormatString;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.hideTooltip;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.hideTooltipValue;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.hovered;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.projection;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.geoPath;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.topojsonFeature;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.bubbleContainer;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.bubbleRadius;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.fontRange;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.bubbleLabelFormat;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.tooltipValueFormat;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.updateChart;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleMouseOver;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleMouseOut;
    /** @type {?} */
    DatavizBubbleMapComponent.prototype.bubbleMouseClick;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    DatavizBubbleMapComponent.prototype._scroll;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizHeatmapComponent {
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
            (data, index, nodes) => this.blockMouseOver(event$1, data, index, nodes)))
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
            (data, index, nodes) => this.blockMouseClick(event$1, data, index, nodes)));
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
                (data, index, nodes) => this.legendMouseOver(event$1, data, index, nodes)))
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
                (data, index, nodes) => this.legendMouseClick(event$1, data, index, nodes)));
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
                    return d.value < data || d.value >= +select(nodes[index + 1]).data()[0];
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
                    const parsedTime = isoParse(data.yLabel);
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
                    const parsedTime = isoParse(data.xLabel);
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
                    const parseDate = isoParse(item);
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
                    const parseDate = isoParse(item);
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
        switch (this.yAxisFormatType) {
            case 'number':
                this.yAxisFormat = format(this.yAxisFormatString);
                break;
            case 'time':
                this.yAxisFormat = timeFormat(this.yAxisFormatString);
                break;
            default:
                this.yAxisFormat = null;
                break;
        }
        switch (this.xAxisFormatType) {
            case 'number':
                this.xAxisFormat = format(this.xAxisFormatString);
                break;
            case 'time':
                this.xAxisFormat = timeFormat(this.xAxisFormatString);
                break;
            default:
                this.xAxisFormat = null;
                break;
        }
        switch (this.legendLabelFormatType) {
            case 'number':
                this.legendLabelFormat = format(this.legendLabelFormatString);
                break;
            default:
                this.legendLabelFormat = null;
                break;
        }
        switch (this.tooltipYLabelFormatType) {
            case 'number':
                this.tooltipYLabelFormat = format(this.tooltipYLabelFormatString);
                break;
            case 'time':
                this.tooltipYLabelFormat = timeFormat(this.tooltipYLabelFormatString);
                break;
            default:
                this.tooltipYLabelFormat = null;
                break;
        }
        switch (this.tooltipXLabelFormatType) {
            case 'number':
                this.tooltipXLabelFormat = format(this.tooltipXLabelFormatString);
                break;
            case 'time':
                this.tooltipXLabelFormat = timeFormat(this.tooltipXLabelFormatString);
                break;
            default:
                this.tooltipXLabelFormat = null;
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = format(this.tooltipValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
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
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
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
            +min(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => d.value)),
            +max(this.data, (/**
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
                this.colorRange = scaleThreshold()
                    .domain(this.domain)
                    .range(colors);
                this.colorDomain = this.colorRange.domain();
                break;
            case 'quantile':
                this.colorRange = scaleQuantile()
                    .domain(colorValues)
                    .range(colors);
                this.colorDomain = this.colorRange.quantiles();
                break;
            case 'quantize':
                this.colorRange = scaleQuantize()
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
        this.xAxisScale = scaleBand()
            .domain(xAxisLabels)
            .rangeRound([0, this.width - this.margin.left])
            .paddingInner(0.1);
        this.xAxisCall = axisBottom(this.xAxisScale)
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
        this.yAxisScale = scaleBand()
            .domain(yAxisLabels)
            .rangeRound([this.height, 0])
            .paddingInner(0.1);
        this.yAxisCall = axisLeft(this.yAxisScale)
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
            this.tooltip = select('body')
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizChoroplethMapComponent {
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
                (data, index, nodes) => this.featureMouseOver(event$1, this.data.find((/**
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
                (data, index, nodes) => this.featureMouseOut(event$1, this.data, index, nodes)))
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
                (data, index, nodes) => this.featureMouseClick(event$1, this.data.find((/**
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
            const mouse$1 = mouse(node);
            /** @type {?} */
            const mouseLeft = +mouse$1[0];
            /** @type {?} */
            const mouseTop = +mouse$1[1];
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
            const x = scaleLinear()
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
            g.call(axisBottom(x)
                .tickSize(13)
                .tickValues(range(1, length))
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
        const colorDomain = [+min(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            d => d.value)), +max(this.data, (/**
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
                this.colorRange = scaleThreshold()
                    .domain(this.domain)
                    .range(colors);
                this.colorDomain = this.colorRange.domain();
                break;
            case 'quantile':
                this.colorRange = scaleQuantile()
                    .domain(colorValues)
                    .range(colors);
                this.colorDomain = this.colorRange.quantiles();
                break;
            case 'quantize':
                this.colorRange = scaleQuantize()
                    .domain(colorDomain)
                    .range(colors);
                this.colorDomain = this.colorRange.thresholds();
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = format(this.tooltipValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
        switch (this.legendValueFormatType) {
            case 'number':
                this.legendValueFormat = format(this.legendValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
        switch (this.projectionType) {
            case 'geoAlbers':
                this.projection = geoAlbers();
                break;
            case 'geoAlbersUsa':
                this.projection = geoAlbersUsa();
                break;
            case 'geoMercator':
                this.projection = geoMercator();
                break;
        }
        this.topojsonFeature = feature(this.topojson, this.topojson.objects[this.feature]);
        this.projection.fitSize([+this.width, +this.height], this.topojsonFeature);
        if (this.scale) {
            this.projection.scale(+this.scale);
        }
        if (this.center) {
            this.projection.center(this.center);
        }
        this.geoPath = geoPath().projection(this.projection);
        // console.log('TOPOJSON: ', this.topojson);
        // console.log('TOPOJSON FEATURE: ', this.topojsonFeature);
        // console.log('MESH: ', topojson.mesh(this.topojson, this.topojson.objects[this.feature], (a, b) => a !== b));
        // console.log('DATA: ', this.data);
        // create the chart
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = select('body')
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
            .enter()
            .append('path')
            .attr('class', 'feature')
            .attr('d', this.geoPath);
        // borders
        this.svg
            .append('path')
            .attr('class', 'mesh')
            .datum(mesh(this.topojson, this.topojson.objects[this.mesh || this.feature], (/**
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
                .attr('transform', `translate(${+this.legendLeft}, ${+this.legendTop})`) // TODO: this needs to be the top/right of the chart
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizBarGroupedComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     * @param {?} _scroll
     * @param {?} _location
     */
    constructor(_dataviz, _element, _scroll, _location) {
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
        // hardcoded legend width + left margin, do not document until feedback
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.barMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            /** @type {?} */
            const node = select(nodes[index]);
            this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .classed('inactive', true);
            node.classed('inactive', false).style('fill', node.attr('data-color'));
            this.tooltipShow(data, nodes[index]);
            this.hovered.emit({ event, data });
        });
        this.barMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
            this.tooltipHide();
        });
        this.barMouseClick = (/**
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
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            /** @type {?} */
            const bar = this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .classed('inactive', null);
            /** @type {?} */
            const barColor = bar.attr('data-color');
            bar.style('fill', (/**
             * @return {?}
             */
            () => barColor));
            this.hovered.emit({ event, data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
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
         * @param {?} node
         * @return {?}
         */
        (data, node) => {
            /** @type {?} */
            const dimensions = node.getBoundingClientRect();
            /** @type {?} */
            const scroll = this._scroll.getScrollPosition();
            /** @type {?} */
            let label;
            switch (this.tooltipLabelFormatType) {
                case 'number':
                    label = this.tooltipLabelFormat(data.label);
                    break;
                case 'time':
                    /** @type {?} */
                    const parsedTime = isoParse(data.label);
                    label = this.tooltipLabelFormat(parsedTime);
                    break;
                default:
                    label = data.label;
            }
            /** @type {?} */
            const value = this.tooltipValueFormat === null
                ? `<div class="tooltip-value">${data.value}</div>`
                : `<div class="tooltip-value">${this.tooltipValueFormat(data.value)}</div>`;
            this.tooltip.html(`
        ${label}
        ${value}
      `);
            /** @type {?} */
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            /** @type {?} */
            const tooltipTipSize = 8;
            if (this.vertical) {
                this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight - tooltipTipSize}px`);
                this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            }
            else {
                this.tooltip.style('top', `${+scroll[1] + +dimensions.top + +dimensions.height / 2 - tooltipOffsetHeight / 2}px`);
                this.tooltip.style('left', `${+scroll[0] + +dimensions.right + tooltipTipSize}px`);
            }
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
                    const parseDate = isoParse(item);
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
                    const parseDate = isoParse(item);
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
        switch (this.xAxisFormatType) {
            case 'number':
                this.xAxisFormat = format(this.xAxisFormatString);
                break;
            case 'time':
                this.xAxisFormat = timeFormat(this.xAxisFormatString);
                break;
        }
        switch (this.yAxisFormatType) {
            case 'number':
                this.yAxisFormat = format(this.yAxisFormatString);
                break;
            case 'time':
                this.yAxisFormat = timeFormat(this.yAxisFormatString);
                break;
        }
        switch (this.legendLabelFormatType) {
            case 'number':
                this.legendLabelFormat = format(this.legendLabelFormatString);
                break;
            case 'time':
                this.legendLabelFormat = timeFormat(this.legendLabelFormatString);
                break;
            default:
                this.legendLabelFormat = null;
                break;
        }
        switch (this.tooltipLabelFormatType) {
            case 'time':
                this.tooltipLabelFormat = timeFormat(this.tooltipLabelFormatString);
                break;
            default:
                this.tooltipLabelFormat = null;
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = format(this.tooltipValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
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
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', (/**
         * @return {?}
         */
        () => {
            if (this.vertical) {
                return +this.width;
            }
            else {
                return +this.width + this.margin.left + this.margin.right;
            }
        }))
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', (/**
         * @return {?}
         */
        () => {
            if (this.vertical) {
                return `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height +
                    this.margin.top +
                    this.margin.bottom}`;
            }
            else {
                return `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this
                    .height +
                    this.margin.top +
                    this.margin.bottom}`;
            }
        }));
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = select('body')
                .append('div')
                .attr('class', (/**
             * @return {?}
             */
            () => {
                return this.vertical ? 'pbds-tooltip south' : 'pbds-tooltip west';
            }))
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
        }
        // build color ranges
        this.colorRange = scaleOrdinal().range(this._dataviz.createGradientDefs(this.svg, false, this.theme, this.vertical));
        if (this.vertical) {
            // X AXIS
            this.xAxisScale = scaleBand()
                .domain(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            d => d.key)))
                .rangeRound([0, this.width - this.margin.left])
                .align(0);
            // add padding to the scale for gray bars
            !this.hideGrayBars
                ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
                : this.xAxisScale.paddingInner(0).paddingOuter(0);
            this.xAxisCall = axisBottom(this.xAxisScale)
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
            this.yAxisMax = max(this.data, (/**
             * @param {?} data
             * @return {?}
             */
            (data) => {
                /** @type {?} */
                const clone = Object.assign({}, data);
                delete clone.key;
                return max(values(clone));
            }));
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale = scaleLinear()
                .domain([0, this.yAxisMax])
                .nice()
                .rangeRound([this.height, 0]);
            this.yAxisCall = axisLeft(this.yAxisScale)
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
                this.yGridCall = axisLeft(this.yAxisScale)
                    .ticks(this.yAxisTicks)
                    .tickSize(-this.width + this.margin.left + this.margin.right);
                this.yGrid = this.svg
                    .append('g')
                    .attr('class', 'grid grid-y')
                    .classed('grid-zero-hidden', this.hideYAxisZero)
                    .attr('transform', `translate(0, 0)`)
                    .call(this.yGridCall);
            }
            // color bar scale
            this.barScale = scaleBand()
                .domain(Object.keys(this.data[0]).slice(1))
                .rangeRound([0, this.xAxisScale.bandwidth()])
                .paddingInner(0.2)
                .paddingOuter(0.5);
            this.updateChartVertical();
        }
        else {
            // X AXIS
            this.xAxisMax = max(this.data, (/**
             * @param {?} data
             * @return {?}
             */
            (data) => {
                /** @type {?} */
                const clone = Object.assign({}, data);
                delete clone.key;
                return max(values(clone));
            }));
            this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
            this.xAxisScale = scaleLinear()
                .domain([0, this.xAxisMax])
                .rangeRound([0, this.width])
                .nice();
            this.xAxisCall = axisBottom(this.xAxisScale)
                .ticks(this.xAxisTicks)
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
            // Y AXIS
            this.yAxisScale = scaleBand()
                .domain(this.data.map((/**
             * @param {?} d
             * @return {?}
             */
            d => d.key)))
                .rangeRound([0, this.height])
                .align(1);
            // add padding to the scale for gray bars
            !this.hideGrayBars
                ? this.yAxisScale.paddingInner(0.1).paddingOuter(0)
                : this.yAxisScale.paddingInner(0).paddingOuter(0);
            this.yAxisCall = axisLeft(this.yAxisScale)
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
                this.xGridCall = axisBottom(this.xAxisScale).tickSize(-this.height);
                this.xGrid = this.svg
                    .append('g')
                    .attr('class', 'grid grid-x')
                    .classed('grid-zero-hidden', this.hideXAxisZero)
                    .attr('transform', `translate(0, ${this.height})`)
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
            this.barScale = scaleBand()
                .domain(Object.keys(this.data[0]).slice(1))
                .rangeRound([this.yAxisScale.bandwidth(), 0])
                .paddingInner(0.2)
                .paddingOuter(0.5);
            this.updateChartHorizontal();
        }
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
            if (this.vertical) {
                this.updateChartVertical();
            }
            else {
                this.updateChartHorizontal();
            }
        }
    }
    /**
     * @return {?}
     */
    updateChartVertical() {
        // update the xScale
        this.xAxisScale.domain(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        d => d.key)));
        // update the yScale
        this.yAxisMax = max(this.data, (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            /** @type {?} */
            const clone = Object.assign({}, data);
            delete clone.key;
            return max(values(clone));
        }));
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
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('rect')
            .attr('class', 'gray-bar')
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.xAxisScale(d.key)))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.yAxisScale(d.value)))
            .attr('width', this.xAxisScale.bandwidth())
            .attr('height', this.height)), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .transition()
            .duration(1000)
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.xAxisScale(d.key)))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.yAxisScale(d.value)))
            .attr('width', this.xAxisScale.bandwidth())
            .attr('height', this.height)));
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return `translate(${this.xAxisScale(d.key)}, 0)`;
        }))), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .transition()
            .duration(1000)
            .attr('transform', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return `translate(${this.xAxisScale(d.key)}, 0)`;
        }))));
        this.svg
            .selectAll('.bar-group')
            .selectAll('.bar')
            .data((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            /** @type {?} */
            const clone = Object.assign({}, d);
            delete clone.key;
            /** @type {?} */
            const keys = Object.keys(clone);
            /** @type {?} */
            const keyData = keys.map((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                return { label: key, value: d[key], parentIndex: i };
            }));
            return keyData;
        }))
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        d => `url(${this._location.path()}#gradient-${this.colorRange(d.label).substr(1)})`))
            .attr('data-color', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.colorRange(d.label)))
            .attr('data-parent-index', (/**
         * @param {?} d
         * @return {?}
         */
        d => d.parentIndex))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.barScale(d.label)))
            .attr('width', this.barScale.bandwidth())
            .attr('y', this.height)
            .attr('height', 0)
            .call((/**
         * @param {?} enter
         * @return {?}
         */
        enter => {
            return enter
                .attr('pointer-events', 'none')
                .transition()
                .duration(0) // 500
                .attr('height', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.height - this.yAxisScale(d.value)))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.yAxisScale(d.value)))
                .transition()
                .attr('pointer-events', 'auto');
        }))), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .attr('pointer-events', 'none')
            .transition()
            .duration(1000)
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.barScale(d.label)))
            .attr('width', this.barScale.bandwidth())
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.height - this.yAxisScale(d.value)))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.yAxisScale(d.value)))
            .transition()
            .attr('pointer-events', 'auto')), (/**
         * @param {?} exit
         * @return {?}
         */
        exit => exit
            .transition()
            .duration(0) // 100
            .attr('pointer-events', 'none')
            .attr('height', 0)
            .attr('y', this.height)))
            .on('mouseover', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.barMouseOver(event$1, data, index, nodes)))
            .on('mouseout', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.barMouseOut()))
            .on('click', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.barMouseClick(event$1, data, index, nodes)));
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    }
    /**
     * @return {?}
     */
    updateChartHorizontal() {
        // update the xScale
        this.xAxisMax = max(this.data, (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            /** @type {?} */
            const clone = Object.assign({}, data);
            delete clone.key;
            return max(values(clone));
        }));
        this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
        this.xAxisScale
            .domain([0, this.xAxisMax])
            .rangeRound([0, this.width])
            .nice();
        // update the yScale
        this.yAxisScale.domain(this.data.map((/**
         * @param {?} d
         * @return {?}
         */
        d => d.key)));
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
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('rect')
            .attr('class', 'gray-bar')
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.yAxisScale(d.key)))
            .attr('width', this.width)
            .attr('height', this.yAxisScale.bandwidth())), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .transition()
            .duration(1000)
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.yAxisScale(d.key)))
            .attr('width', this.width)
            .attr('height', this.yAxisScale.bandwidth())));
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return `translate(0, ${this.yAxisScale(d.key)})`;
        }))), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .transition()
            .duration(1000)
            .attr('transform', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return `translate(0, ${this.yAxisScale(d.key)})`;
        }))));
        this.svg
            .selectAll('.bar-group')
            .selectAll('.bar')
            .data((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            /** @type {?} */
            const clone = Object.assign({}, d);
            delete clone.key;
            /** @type {?} */
            const keys = Object.keys(clone);
            /** @type {?} */
            const keyData = keys.map((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                return { label: key, value: d[key], parentIndex: i };
            }));
            return keyData;
        }))
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        d => `url(${this._location.path()}#gradient-horizontal-${this.colorRange(d.label).substr(1)})`))
            .attr('data-color', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.colorRange(d.label)))
            .attr('data-parent-index', (/**
         * @param {?} d
         * @return {?}
         */
        d => d.parentIndex))
            .attr('x', 0)
            .attr('width', 0)
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.barScale(d.label)))
            .attr('height', this.barScale.bandwidth())
            .call((/**
         * @param {?} enter
         * @return {?}
         */
        enter => {
            return enter
                .attr('pointer-events', 'none')
                .transition()
                .duration(0) // 500
                .attr('width', (/**
             * @param {?} d
             * @return {?}
             */
            d => this.xAxisScale(d.value)))
                .transition()
                .attr('pointer-events', 'auto');
        }))), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .attr('pointer-events', 'none')
            .transition()
            .duration(1000)
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.xAxisScale(d.value)))
            .attr('height', this.barScale.bandwidth())
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        d => this.barScale(d.label)))
            .transition()
            .attr('pointer-events', 'auto')), (/**
         * @param {?} exit
         * @return {?}
         */
        exit => exit
            .transition()
            .duration(0) // 100
            .attr('pointer-events', 'none')
            .attr('width', 0)))
            .on('mouseover', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.barMouseOver(event$1, data, index, nodes)))
            .on('mouseout', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.barMouseOut()))
            .on('click', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.barMouseClick(event$1, data, index, nodes)));
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    }
    /**
     * @return {?}
     */
    updateLegend() {
        // legend
        if (!this.hideLegend) {
            /** @type {?} */
            const legendData = Object.assign({}, this.data[0]);
            delete legendData.key;
            /** @type {?} */
            const legendKeys = Object.keys(legendData).map((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                return { label: key };
            }));
            this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(legendKeys)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => {
                /** @type {?} */
                const li = enter.append('li').attr('class', 'legend-item');
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)));
                li.insert('span', '.legend-item')
                    .attr('class', 'legend-label')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                return li;
            }), (/**
             * @param {?} update
             * @return {?}
             */
            update => {
                update.select('.legend-label').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                return update;
            }), (/**
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
            (data, index, nodes) => this.legendMouseOver(event$1, data, index, nodes)))
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
            (data, index, nodes) => this.legendMouseClick(event$1, data, index, nodes)));
        }
    }
}
PbdsDatavizBarGroupedComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar-grouped',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizBarGroupedComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller },
    { type: Location }
];
PbdsDatavizBarGroupedComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    groupedBarClass: [{ type: HostBinding, args: ['class.pbds-chart-bar-grouped',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    vertical: [{ type: Input }],
    hideXAxis: [{ type: Input }],
    xAxisMaxBuffer: [{ type: Input }],
    xAxisFormatType: [{ type: Input }],
    xAxisFormatString: [{ type: Input }],
    xAxisTicks: [{ type: Input }],
    hideYAxis: [{ type: Input }],
    yAxisMaxBuffer: [{ type: Input }],
    yAxisFormatType: [{ type: Input }],
    yAxisFormatString: [{ type: Input }],
    yAxisTicks: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    hideLegend: [{ type: Input }],
    legendWidth: [{ type: Input }],
    legendPosition: [{ type: Input }],
    legendLabelFormatType: [{ type: Input }],
    legendLabelFormatString: [{ type: Input }],
    hideTooltip: [{ type: Input }],
    tooltipLabelFormatType: [{ type: Input }],
    tooltipLabelFormatString: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    showGrid: [{ type: Input }],
    theme: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.groupedBarClass;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.vertical;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hideXAxis;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.xAxisMaxBuffer;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.xAxisTicks;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hideYAxis;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.yAxisMaxBuffer;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.yAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.yAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.yAxisTicks;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hideTooltip;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.showGrid;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.barScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisMax;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisMax;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideYAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideYAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideYAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.hideGrayBars;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltipLabelFormat;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.barMouseOver;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.barMouseOut;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.barMouseClick;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizBarGroupedComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.tooltipHide;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype.yAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype._scroll;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarGroupedComponent.prototype._location;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizBarSingleHorizontalComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     * @param {?} _scroll
     * @param {?} _location
     */
    constructor(_dataviz, _element, _scroll, _location) {
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
        // hardcoded legend width + left margin, do not document until feedback
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.isSingleData = false;
        this.isCompare = false;
        this.barPadding = 40;
        this.barMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            /** @type {?} */
            const node = select(nodes[index]);
            this.chart.selectAll('.bar').classed('inactive', true);
            node.classed('inactive', false);
            this.chart
                .selectAll('.legend-item')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                // debugger;
                return i !== index;
            }))
                .classed('inactive', true);
            this.tooltipShow(data, nodes[index]);
            this.hovered.emit({ event, data });
        });
        this.barMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.tooltipHide();
        });
        this.barMouseClick = (/**
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
         * @param {?} node
         * @return {?}
         */
        (data, node) => {
            /** @type {?} */
            const dimensions = node.getBoundingClientRect();
            /** @type {?} */
            const scroll = this._scroll.getScrollPosition();
            /** @type {?} */
            const percentage = data.value / sum(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => d.value));
            /** @type {?} */
            const comparePercentage = data.compareValue / sum(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => d.compareValue));
            /** @type {?} */
            let tooltipLabel = ``;
            /** @type {?} */
            let tooltipCompareDaterangeMargin = ``;
            /** @type {?} */
            let tooltipCompareDaterange = ``;
            /** @type {?} */
            let tooltipCompareValue = ``;
            /** @type {?} */
            let tooltipDaterangeMargin = ``;
            /** @type {?} */
            let tooltipDaterange = ``;
            /** @type {?} */
            let tooltipValue = `${this.nullValueText}`;
            /** @type {?} */
            let tooltipIndicator = '';
            // tooltip label
            if (!this.isSingleData) {
                switch (this.tooltipLabelFormatType) {
                    case 'number':
                        tooltipLabel = this.tooltipLabelFormat(data.label);
                        break;
                    case 'time':
                        /** @type {?} */
                        const parsedTime = isoParse(data.label);
                        tooltipLabel = this.tooltipLabelFormat(parsedTime);
                        break;
                    default:
                        tooltipLabel = data.label;
                }
            }
            // tooltip compare daterange
            if (this.isCompare && data.compareStartDate && data.compareEndDate) {
                tooltipCompareDaterangeMargin = `mt-2`;
                tooltipCompareDaterange = `${this.tooltipDateFormat(isoParse(data.compareStartDate))} - ${this.tooltipDateFormat(isoParse(data.compareEndDate))}`;
            }
            // tooltip compare value
            if (this.percentage && this.isCompare && data.compareValue) {
                tooltipCompareValue =
                    this.tooltipValueFormat === null
                        ? `${this.tooltipPercentFormat(comparePercentage)} (${data.comparveValue}${this.tooltipValueSuffix})`
                        : `${this.tooltipPercentFormat(comparePercentage)} (${this.tooltipValueFormat(data.compareValue)}${this.tooltipValueSuffix})`;
            }
            else if (this.isCompare && data.compareValue !== null) {
                tooltipCompareValue =
                    this.tooltipValueFormat === null
                        ? `${data.compareValue}${this.tooltipValueSuffix} (${this.tooltipPercentFormat(comparePercentage)})`
                        : `${this.tooltipValueFormat(data.compareValue)}${this.tooltipValueSuffix} (${this.tooltipPercentFormat(comparePercentage)})`;
            }
            else if (this.isCompare && data.compareValue === null) {
                tooltipCompareValue = `${this.nullValueText}`;
            }
            // tooltip daterange
            if (data.startDate && data.endDate) {
                tooltipDaterange = `${this.tooltipDateFormat(isoParse(data.startDate))} - ${this.tooltipDateFormat(isoParse(data.endDate))}`;
            }
            //tooltip daterange margin
            if (tooltipLabel !== '') {
                tooltipDaterangeMargin = `mt-2`;
            }
            // tooltip value
            if (this.isSingleData && this.percentage && data.value) {
                tooltipValue = this.tooltipValueFormat === null ? `${data.value}` : `${this.tooltipValueFormat(data.value)}`;
            }
            else if (this.isSingleData && data.value !== null) {
                tooltipValue =
                    this.tooltipValueFormat === null
                        ? `${data.value}${this.tooltipValueSuffix}`
                        : `${this.tooltipValueFormat(data.value)}${this.tooltipValueSuffix}`;
            }
            else if (!this.isSingleData && this.percentage && data.value !== null) {
                tooltipValue =
                    this.tooltipValueFormat === null
                        ? `${this.tooltipPercentFormat(percentage)} (${data.value}${this.tooltipValueSuffix})`
                        : `${this.tooltipPercentFormat(percentage)} (${this.tooltipValueFormat(data.value)}${this.tooltipValueSuffix})`;
            }
            else if (!this.isSingleData && data.value !== null) {
                tooltipValue =
                    this.tooltipValueFormat === null
                        ? `${data.value}${this.tooltipValueSuffix} (${this.tooltipPercentFormat(percentage)})`
                        : `${this.tooltipValueFormat(data.value)}${this.tooltipValueSuffix} (${this.tooltipPercentFormat(percentage)})`;
            }
            // tooltip metric indicator
            if (!this.isSingleData && this.isCompare && data.value !== null && data.compareValue !== null) {
                tooltipIndicator = `<div class="metric-block-indicator ${data.compareChangeDirection} ${data.compareChangeInverse ? 'inverse' : ''} ml-2"><span>${this.tooltipCompareChangeFormat(data.compareChangeValue)}</span></div>`;
            }
            this.tooltip.html((/**
             * @return {?}
             */
            () => {
                return `
        <div class="tooltip-label font-weight-bold">${tooltipLabel}</div>
        <div class="${tooltipCompareDaterangeMargin}">${tooltipCompareDaterange}</div>
        <div class="tooltip-value font-weight-bold">${tooltipCompareValue}</div>
        <div class="${tooltipDaterangeMargin}">${tooltipDaterange}</div>
        <div class="tooltip-value"><span class="font-weight-bold">${tooltipValue}</span> <span>${tooltipIndicator}</span></div>
      `;
            }));
            /** @type {?} */
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            /** @type {?} */
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            /** @type {?} */
            const tooltipTipSize = 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight - tooltipTipSize}px`);
            if (this.data.length > 1) {
                this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            }
            else {
                this.tooltip.style('left', `${+scroll[0] - tooltipOffsetWidth + +dimensions.right}px`);
            }
            this.tooltip.style('opacity', 1);
        });
        this.tooltipHide = (/**
         * @return {?}
         */
        () => {
            this.tooltip.style('opacity', 0);
        });
        this.legendMouseOver = (/**
         * @param {?} event
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (event, data, index, nodes) => {
            if (!this.hideLegendTooltip) {
                /** @type {?} */
                const barHover = this.svg
                    .selectAll('.bar')
                    .filter((/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                (d, i) => i === index))
                    .node();
                this.tooltipShow(data, barHover);
            }
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
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i !== index))
                .classed('inactive', true);
            this.chart
                .selectAll('.bar')
                .filter((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i === index))
                .classed('inactive', null);
            this.hovered.emit({ event, data });
        });
        this.legendMouseOut = (/**
         * @return {?}
         */
        () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
            // hide tooltip for zero/null values
            this.tooltipHide();
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
        this.xAxisFormatter = (/**
         * @param {?} item
         * @return {?}
         */
        item => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return `${this.xAxisFormat(item)}${this.xAxisTickLabelSuffix}`;
                default:
                    return `${item}${this.xAxisTickLabelSuffix}`;
            }
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.height = +this.height + this.barPadding;
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        this.isSingleData = this.data.length === 1 ? true : false;
        this.isCompare = Object.keys(this.data[0]).includes('compareValue');
        switch (this.xAxisFormatType) {
            case 'number':
                this.xAxisFormat = format(this.xAxisFormatString);
                break;
        }
        switch (this.legendLabelFormatType) {
            case 'number':
                this.legendLabelFormat = format(this.legendLabelFormatString);
                break;
            case 'time':
                this.legendLabelFormat = timeFormat(this.legendLabelFormatString);
                break;
            default:
                this.legendLabelFormat = null;
                break;
        }
        switch (this.tooltipValueFormatType) {
            case 'number':
                this.tooltipValueFormat = format(this.tooltipValueFormatString);
                break;
            default:
                this.tooltipValueFormat = null;
        }
        this.tooltipDateFormat = timeFormat(this.tooltipDateFormatString);
        this.tooltipPercentFormat = format(this.tooltipPercentFormatString);
        this.tooltipCompareChangeFormat = format(this.compareChangeFormatString);
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
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', (/**
         * @return {?}
         */
        () => {
            return +this.width + this.margin.left + this.margin.right;
        }))
            .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', (/**
         * @return {?}
         */
        () => {
            return `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this
                .height +
                this.margin.top +
                this.margin.bottom +
                this.xAxisTitleMargin}`;
        }));
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = select('body')
                .append('div')
                .attr('class', 'pbds-tooltip south')
                .classed('pbds-tooltip-compare', this.isCompare)
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
        }
        // add legend classes
        if (!this.hideLegend && this.data.length > 1) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
        }
        // X AXIS
        this.xAxisScale = scaleLinear()
            .domain([0, Math.ceil(sum(this.data, (/**
             * @param {?} d
             * @return {?}
             */
            (d) => d.value)))])
            .range([0, +this.width]);
        this.xAxisCall = axisBottom(this.xAxisScale)
            // .tickValues([0, d3_sum(this.data, (d: any) => d.value)])
            .ticks(this.xAxisTicks)
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
            .classed('axis-ticks-hidden', this.hideXAxisTicks);
        // .call(this.xAxisCall);
        // X GRIDLINES
        if (!this.hideXGrid) {
            this.xGridCall = axisBottom(this.xAxisScale).tickSize(-this.height);
            this.xGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-x')
                .classed('grid-zero-hidden', this.hideXAxisZero)
                .attr('transform', `translate(0, ${this.height})`)
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
        /** @type {?} */
        let colors;
        if (this.isSingleData) {
            colors = this._dataviz.createGradientDefs(this.svg, this.monochrome, this.theme, false);
        }
        else if (this.monochrome) {
            colors = this._dataviz.getColors(this.monochrome, this.theme).reverse();
        }
        else {
            colors = this._dataviz.getColors(this.monochrome, this.theme);
        }
        this.colorRange = scaleOrdinal().range(colors);
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
    /**
     * @return {?}
     */
    updateChart() {
        this.isSingleData = this.data.length === 1 ? true : false;
        this.isCompare = Object.keys(this.data[0]).includes('compareValue');
        /** @type {?} */
        const sumValues = sum(this.data, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.value));
        /** @type {?} */
        const isLastBarZero = this.data[this.data.length - 1].value === 0 || this.data[this.data.length - 1].value === null ? true : false;
        /** @type {?} */
        let lastBarZeroCount = 0;
        /** @type {?} */
        const cloneData = [...this.data];
        /** @type {?} */
        let isLast = false;
        cloneData.reverse().forEach((/**
         * @param {?} value
         * @param {?} index
         * @param {?} array
         * @return {?}
         */
        (value, index, array) => {
            if ((value.value === 0 || value.value === null) && !isLast) {
                lastBarZeroCount++;
            }
            else {
                isLast = true;
            }
        }));
        if (this.percentage && !this.isSingleData) {
            this.xAxisScale.domain([0, sumValues]).range([0, +this.width]);
            this.xAxisCall.tickValues([0, sumValues * 0.25, sumValues * 0.5, sumValues * 0.75, sumValues]);
            this.xAxis.call(this.xAxisCall);
            this.xGridCall.tickValues([0, sumValues * 0.25, sumValues * 0.5, sumValues * 0.75, sumValues]);
            this.xGrid.call(this.xGridCall);
            this.svg
                .select('.axis-x')
                .selectAll('text')
                .html((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                /** @type {?} */
                const format$1 = format('.0%');
                return format$1(i * 0.25);
            }));
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
                .html((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                /** @type {?} */
                const format$1 = format('.0%');
                return format$1(i * 0.25);
            }));
        }
        else {
            this.xAxisScale.domain([0, Math.ceil(sumValues)]).range([0, +this.width]);
            this.xGridCall.tickValues(this.xAxisScale.ticks().filter((/**
             * @param {?} n
             * @return {?}
             */
            n => Number.isInteger(n)))); // remove decimal grid values
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
            .join((/**
         * @param {?} enter
         * @return {?}
         */
        enter => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('width', 0)
            .attr('height', (/**
         * @return {?}
         */
        () => {
            return this.height - this.barPadding;
        }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        d => {
            if (this.isSingleData) {
                return `url(${this._location.path()}#gradient-horizontal-${this.colorRange(d.label).substr(1)})`;
            }
            else {
                return this.colorRange(d.label);
            }
        }))
            .attr('y', (/**
         * @return {?}
         */
        () => {
            return this.barPadding / 2;
        }))
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return this.data.slice(0, i).reduce((/**
             * @param {?} acc
             * @param {?} item
             * @return {?}
             */
            (acc, item) => {
                // console.log(acc, item, acc + this.xAxisScale(item.value) + this.barMargin);
                return +acc + +this.xAxisScale(item.value);
            }), 1);
        }))
            .attr('pointer-events', 'none')
            .call((/**
         * @param {?} enter
         * @return {?}
         */
        enter => {
            return (enter
                .transition()
                // .duration(0)
                .delay((/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => i * 250))
                .ease(easeLinear)
                .attr('width', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => {
                // debugger;
                if (i === this.data.length - lastBarZeroCount - 1 && isLastBarZero) {
                    return this.xAxisScale(d.value);
                }
                else if (i !== this.data.length - 1) {
                    /** @type {?} */
                    let width = this.xAxisScale(d.value) - +this.barMargin;
                    width = Math.sign(width) === -1 ? 0 : width; // handle negative values
                    return width;
                }
                else {
                    return this.xAxisScale(d.value);
                }
            }))
                .transition()
                .attr('pointer-events', 'auto'));
        }))), (/**
         * @param {?} update
         * @return {?}
         */
        update => update
            .attr('pointer-events', 'none')
            .transition()
            .duration(1000)
            .attr('width', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            // debugger;
            if (d.value === null || d.value === 0) {
                return this.xAxisScale(0);
            }
            else if (i === this.data.length - 1) {
                return this.xAxisScale(d.value);
            }
            else {
                return this.xAxisScale(d.value) - this.barMargin;
            }
        }))
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            return this.data.slice(0, i).reduce((/**
             * @param {?} acc
             * @param {?} item
             * @return {?}
             */
            (acc, item) => {
                return acc + +this.xAxisScale(item.value);
            }), 0);
        }))
            .transition()
            .attr('pointer-events', 'auto')), (/**
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
        (data, index, nodes) => this.barMouseOver(event$1, data, index, nodes)))
            .on('mouseout', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.barMouseOut()))
            .on('click', (/**
         * @param {?} data
         * @param {?} index
         * @param {?} nodes
         * @return {?}
         */
        (data, index, nodes) => this.barMouseClick(event$1, data, index, nodes)));
        if (!this.hideLegend) {
            this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => {
                /** @type {?} */
                const li = enter
                    .append('li')
                    .attr('class', 'legend-item')
                    .classed('align-items-start', this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => this.colorRange(d.label)))
                    .classed('mt-1', this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-description')
                    .classed('d-flex', this.isCompare)
                    .classed('flex-column', this.isCompare);
                li.select('.legend-description')
                    .insert('span')
                    .attr('class', 'legend-label')
                    .html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                li.select('.legend-description')
                    .insert('div')
                    .attr('class', 'legend-change')
                    .classed('d-none', !this.isCompare);
                li.select('.legend-change').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    return `<div class="metric-block-indicator ${d.compareChangeDirection} ${d.compareChangeInverse ? 'inverse' : ''} mt-1"><span>${this.tooltipCompareChangeFormat(d.compareChangeValue)}</span></div>`;
                }));
                return li;
            }), (/**
             * @param {?} update
             * @return {?}
             */
            update => {
                update.classed('align-items-start', this.isCompare);
                update.select('.legend-key').classed('mt-1', this.isCompare);
                update.select('.legend-change').classed('d-none', !this.isCompare);
                if (this.isCompare) {
                    update.select('.legend-change').html((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => {
                        return `<div class="metric-block-indicator ${d.compareChangeDirection} ${d.compareChangeInverse ? 'inverse' : ''} mt-1"><span>${this.tooltipCompareChangeFormat(d.compareChangeValue)}</span></div>`;
                    }));
                }
                update.select('.legend-label').html((/**
                 * @param {?} d
                 * @return {?}
                 */
                d => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            /** @type {?} */
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }));
                return update;
            }), (/**
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
            (data, index, nodes) => this.legendMouseOver(event$1, data, index, nodes)))
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
            (data, index, nodes) => this.legendMouseClick(event$1, data, index, nodes)));
        }
    }
}
PbdsDatavizBarSingleHorizontalComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar-single-horizontal',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PbdsDatavizBarSingleHorizontalComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller },
    { type: Location }
];
PbdsDatavizBarSingleHorizontalComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    singleStackedBarClass: [{ type: HostBinding, args: ['class.pbds-chart-bar-single-horizontal',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    nullValueText: [{ type: Input }],
    percentage: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    barMargin: [{ type: Input }],
    hideXAxis: [{ type: Input }],
    xAxisTicks: [{ type: Input }],
    xAxisTitle: [{ type: Input }],
    xAxisFormatType: [{ type: Input }],
    xAxisFormatString: [{ type: Input }],
    xAxisTickLabelSuffix: [{ type: Input }],
    hideXGrid: [{ type: Input }],
    hideLegend: [{ type: Input }],
    hideLegendTooltip: [{ type: Input }],
    legendWidth: [{ type: Input }],
    legendPosition: [{ type: Input }],
    legendLabelFormatType: [{ type: Input }],
    legendLabelFormatString: [{ type: Input }],
    hideTooltip: [{ type: Input }],
    tooltipLabelFormatType: [{ type: Input }],
    tooltipLabelFormatString: [{ type: Input }],
    tooltipDateFormatString: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    tooltipValueSuffix: [{ type: Input }],
    tooltipPercentFormatString: [{ type: Input }],
    compareChangeFormatString: [{ type: Input }],
    monochrome: [{ type: Input }],
    theme: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.singleStackedBarClass;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.height;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.nullValueText;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.percentage;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.marginTop;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.marginRight;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.marginBottom;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.marginLeft;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barMargin;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXAxis;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTicks;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTitle;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisFormatType;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTickLabelSuffix;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXGrid;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideLegend;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideLegendTooltip;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendWidth;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendPosition;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideTooltip;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipLabelFormatType;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipLabelFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipDateFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipValueFormatType;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipValueFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipValueSuffix;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipPercentFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.compareChangeFormatString;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.monochrome;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.theme;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hovered;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.clicked;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.isSingleData;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.isCompare;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.margin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.colorRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barPadding;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxis;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisScale;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTickSize;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTickSizeOuter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisTitleMargin;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXAxisDomain;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXAxisZero;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.hideXAxisTicks;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xGrid;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xGridCall;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipLabelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipValueFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipDateFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipPercentFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipCompareChangeFormat;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barMouseOver;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barMouseOut;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.barMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipShow;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.tooltipHide;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendMouseOver;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendMouseOut;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalComponent.prototype.legendMouseClick;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype.xAxisFormatter;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype._element;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype._scroll;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizBarSingleHorizontalComponent.prototype._location;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDatavizModule {
}
PbdsDatavizModule.decorators = [
    { type: NgModule, args: [{
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
                imports: [CommonModule],
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function PbdsDatavizPie() { }
if (false) {
    /** @type {?} */
    PbdsDatavizPie.prototype.label;
    /** @type {?} */
    PbdsDatavizPie.prototype.value;
}
/**
 * @record
 */
function PbdsDatavizBar() { }
if (false) {
    /** @type {?} */
    PbdsDatavizBar.prototype.label;
    /** @type {?} */
    PbdsDatavizBar.prototype.value;
}
/**
 * @record
 */
function PbdsDatavizGauge() { }
if (false) {
    /** @type {?} */
    PbdsDatavizGauge.prototype.minvalue;
    /** @type {?} */
    PbdsDatavizGauge.prototype.maxvalue;
    /** @type {?} */
    PbdsDatavizGauge.prototype.value;
}
/**
 * @record
 */
function PbdsDatavizSparkline() { }
if (false) {
    /** @type {?} */
    PbdsDatavizSparkline.prototype.length;
    /* Skipping unhandled member: [index: number]: number;*/
}
/**
 * @record
 */
function PbdsDatavizLine() { }
if (false) {
    /** @type {?} */
    PbdsDatavizLine.prototype.dates;
    /** @type {?} */
    PbdsDatavizLine.prototype.series;
}
/**
 * @record
 */
function PbdsDatavizLineSeries() { }
if (false) {
    /** @type {?} */
    PbdsDatavizLineSeries.prototype.label;
    /** @type {?} */
    PbdsDatavizLineSeries.prototype.values;
}
/**
 * @record
 */
function PbdsDatavizBarStacked() { }
if (false) {
    /** @type {?} */
    PbdsDatavizBarStacked.prototype.key;
    /* Skipping unhandled member: [propName: string]: any;*/
}
/**
 * @record
 */
function PbdsDatavizMapData() { }
if (false) {
    /** @type {?} */
    PbdsDatavizMapData.prototype.label;
    /** @type {?} */
    PbdsDatavizMapData.prototype.longitude;
    /** @type {?} */
    PbdsDatavizMapData.prototype.latitude;
    /** @type {?} */
    PbdsDatavizMapData.prototype.value;
    /* Skipping unhandled member: [propName: string]: any;*/
}
/**
 * @record
 */
function PbdsDatavizChoroplethMapData() { }
if (false) {
    /** @type {?} */
    PbdsDatavizChoroplethMapData.prototype.id;
    /** @type {?} */
    PbdsDatavizChoroplethMapData.prototype.value;
    /** @type {?|undefined} */
    PbdsDatavizChoroplethMapData.prototype.label;
    /* Skipping unhandled member: [propName: string]: any;*/
}
/**
 * @record
 */
function PbdsDatavizHeatmap() { }
if (false) {
    /** @type {?} */
    PbdsDatavizHeatmap.prototype.yLabel;
    /** @type {?} */
    PbdsDatavizHeatmap.prototype.xLabel;
    /** @type {?} */
    PbdsDatavizHeatmap.prototype.value;
}
/**
 * @record
 */
function PbdsDatavizBarGrouped() { }
if (false) {
    /** @type {?} */
    PbdsDatavizBarGrouped.prototype.key;
    /* Skipping unhandled member: [propName: string]: any;*/
}
/**
 * @record
 */
function PbdsDatavizBarSingleHorizontal() { }
if (false) {
    /** @type {?} */
    PbdsDatavizBarSingleHorizontal.prototype.label;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontal.prototype.value;
    /** @type {?|undefined} */
    PbdsDatavizBarSingleHorizontal.prototype.startDate;
    /** @type {?|undefined} */
    PbdsDatavizBarSingleHorizontal.prototype.endDate;
}
/**
 * @record
 */
function PbdsDatavizBarSingleHorizontalCompare() { }
if (false) {
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.label;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.value;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.startDate;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.endDate;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.compareValue;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.compareStartDate;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.compareEndDate;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.compareChangeValue;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.compareChangeDirection;
    /** @type {?} */
    PbdsDatavizBarSingleHorizontalCompare.prototype.compareChangeInverse;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsHeaderShadowDirective {
    /**
     * @param {?} _scroll
     */
    constructor(_scroll) {
        this._scroll = _scroll;
    }
    /**
     * @return {?}
     */
    onWindowScroll() {
        /** @type {?} */
        const offset = this._scroll.getScrollPosition();
        this.shadow = offset[1] > 20;
    }
}
PbdsHeaderShadowDirective.decorators = [
    { type: Directive, args: [{
                selector: 'header.bg-brand-header'
            },] }
];
/** @nocollapse */
PbdsHeaderShadowDirective.ctorParameters = () => [
    { type: ViewportScroller }
];
PbdsHeaderShadowDirective.propDecorators = {
    shadow: [{ type: HostBinding, args: ['class.pbds-header-shadow',] }],
    onWindowScroll: [{ type: HostListener, args: ['window:scroll', [],] }]
};
if (false) {
    /** @type {?} */
    PbdsHeaderShadowDirective.prototype.shadow;
    /**
     * @type {?}
     * @private
     */
    PbdsHeaderShadowDirective.prototype._scroll;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsHeaderShadowModule {
}
PbdsHeaderShadowModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PbdsHeaderShadowDirective],
                imports: [CommonModule],
                exports: [PbdsHeaderShadowDirective]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDaterangeService {
    /**
     * @param {?} localeId
     */
    constructor(localeId) {
        this.localeId = localeId;
        this.locale = this.localeId.toLowerCase();
    }
    /**
     * @param {?} locale
     * @return {?}
     */
    setLocale(locale) {
        this.locale = `${locale.language}-${locale.country}`.toLowerCase();
        // set the angular LOCALE_ID dynamically for ng-bootstrap datepicker
        registerLocaleData(locale.locale, this.locale);
    }
    /**
     * @return {?}
     */
    getCurrentLocale() {
        return this.locale;
    }
}
PbdsDaterangeService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
PbdsDaterangeService.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];
/** @nocollapse */ PbdsDaterangeService.ngInjectableDef = ɵɵdefineInjectable({ factory: function PbdsDaterangeService_Factory() { return new PbdsDaterangeService(ɵɵinject(LOCALE_ID)); }, token: PbdsDaterangeService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangeService.prototype.locale;
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangeService.prototype.localeId;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// Define custom service providing the months and weekdays translations
class CustomDatepickerI18n extends NgbDatepickerI18n {
    /**
     * @param {?} daterangeService
     */
    constructor(daterangeService) {
        super();
        this.daterangeService = daterangeService;
    }
    /**
     * @param {?} weekday
     * @return {?}
     */
    getWeekdayShortName(weekday) {
        // for ng-bootstrap, sunday number of 7 converted to 0
        weekday = weekday === 7 ? 0 : weekday;
        // console.log(
        //   'weekday: ',
        //   this.daterangeService.getCurrentLocale(),
        //   weekday,
        //   getLocaleDayNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Abbreviated)[weekday]
        // );
        return getLocaleDayNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Abbreviated)[weekday];
    }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonthShortName(month) {
        return getLocaleMonthNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Wide)[month - 1];
    }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonthFullName(month) {
        return getLocaleMonthNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Wide)[month - 1];
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getDayAriaLabel(date) {
        return `${date.day}-${date.month}-${date.year}`;
    }
}
CustomDatepickerI18n.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CustomDatepickerI18n.ctorParameters = () => [
    { type: PbdsDaterangeService }
];
if (false) {
    /** @type {?} */
    CustomDatepickerI18n.prototype.daterangeService;
}
class PbdsDaterangePopoverComponent {
    /**
     * @param {?} calendar
     * @param {?} daterangeService
     */
    constructor(calendar, daterangeService) {
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
        this.change = new EventEmitter();
        this.firstDayOfWeek = getLocaleFirstDayOfWeek(this.daterangeService.getCurrentLocale());
        this.dateRange = '';
        this.isDatepickerVisible = false;
        this.presetSelect = (/**
         * @param {?} $event
         * @return {?}
         */
        $event => {
            if ($event.value === 'custom') {
                this.presetSelected = 'custom';
                return false;
            }
            if ($event.value) {
                this.toDate = this.calendar.getToday();
                this.fromDate = this.calendar.getPrev(this.toDate, 'd', $event.value);
                this.presetSelected = $event.value;
            }
            else {
                this.fromDate = null;
                this.toDate = null;
                this.presetSelected = null;
            }
            this.isDatepickerVisible = false;
        });
        this.isHovered = (/**
         * @param {?} date
         * @return {?}
         */
        (date) => this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate));
        this.isInside = (/**
         * @param {?} date
         * @return {?}
         */
        (date) => date.after(this.fromDate) && date.before(this.toDate));
        this.isRange = (/**
         * @param {?} date
         * @return {?}
         */
        (date) => date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date));
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // china should start on a Monday, Angular locale returns incorrect 0
        this.firstDayOfWeek =
            this.daterangeService.getCurrentLocale() === 'zh-cn' ? this.firstDayOfWeek + 1 : this.firstDayOfWeek;
        if (this.presetSelected === 'custom') {
            this.showDatepicker();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.filters && this.filters) {
            this.selectedFilter = this.filters[this.filterSelected];
        }
        if (changes.presets) {
            if (!this.filters && this.presetSelected) {
                this.presetClick(this.presets.find((/**
                 * @param {?} p
                 * @return {?}
                 */
                p => p.value === this.presetSelected)));
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
    }
    /**
     * @return {?}
     */
    apply() {
        this.setInputLabel();
        this.change.emit({
            fromDate: this.fromDate,
            toDate: this.toDate,
            formattedDate: this.isDatepickerVisible ? this.dateFormat() : this.dateRange,
            filter: this.filters ? this.selectedFilter.field : null,
            value: this.presetSelected
        });
        this.datepickerPopup.close();
    }
    /**
     * @return {?}
     */
    cancel() {
        this.datepickerPopup.close();
    }
    /**
     * @param {?} date
     * @return {?}
     */
    onDateSelection(date) {
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
    }
    /**
     * @param {?} preset
     * @return {?}
     */
    presetClick(preset) {
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
    }
    /**
     * @private
     * @param {?} date
     * @return {?}
     */
    getFormattedDate(date) {
        if (date) {
            /** @type {?} */
            const locale = this.daterangeService.getCurrentLocale();
            /** @type {?} */
            const dateFormat = getLocaleDateFormat(locale, FormatWidth.Short);
            /** @type {?} */
            const formattedDate = formatDate(`${date.month}/${date.day}/${date.year}`, dateFormat, locale);
            return formattedDate;
        }
    }
    /**
     * @return {?}
     */
    showDatepicker() {
        this.isDatepickerVisible = true;
        this.presetSelect({ value: 'custom' });
    }
    /**
     * @param {?} filter
     * @param {?} index
     * @return {?}
     */
    onFilterChange(filter, index) {
        this.selectedFilter = this.filters[index];
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setPreset(value) {
        this.presetSelected = value;
        this.presetSelect({ value: this.presetSelected });
        this.apply();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    setFilter(index) {
        if (this.filters !== undefined) {
            this.selectedFilter = this.filters[index];
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setDateRange(value) {
        this.fromDate = new NgbDate(value.fromDate.year, value.fromDate.month, value.fromDate.day);
        this.toDate = new NgbDate(value.toDate.year, value.toDate.month, value.toDate.day);
        this.isDatepickerVisible = value.value === 'custom';
        this.presetSelected = value.value;
        if (this.filters) {
            this.filterSelected = this.filters.findIndex((/**
             * @param {?} f
             * @return {?}
             */
            f => f.field === value.filter));
            this.selectedFilter = this.filters[this.filterSelected];
        }
        this.apply();
    }
    /**
     * @private
     * @return {?}
     */
    setInputLabel() {
        if (this.presets) {
            /** @type {?} */
            const selected = this.presets.find((/**
             * @param {?} p
             * @return {?}
             */
            p => p.value === this.presetSelected));
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
    }
    /**
     * @private
     * @return {?}
     */
    dateFormat() {
        return this.inputFormat
            .replace('{fromDate}', this.getFormattedDate(this.fromDate))
            .replace('{toDate}', this.getFormattedDate(this.toDate));
    }
}
PbdsDaterangePopoverComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-daterange-popover',
                template: "<div class=\"input-group pbds-daterange-popover\">\n  <input\n    type=\"text\"\n    class=\"form-control\"\n    aria-describedby=\"daterange-button\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <button\n      class=\"btn btn-secondary\"\n      type=\"button\"\n      id=\"daterange-button\"\n      #datepickerPopup=\"ngbPopover\"\n      [ngbPopover]=\"daterangeContent\"\n      popoverClass=\"daterange-popover\"\n      autoClose=\"outside\"\n      container=\"body\"\n      placement=\"bottom-right auto\"\n      aria-label=\"Open Daterange Picker\"\n    >\n      <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n\n  <ng-template #daterangeContent>\n    <div>\n      <div class=\"d-block d-md-flex\">\n        <div *ngIf=\"isDatepickerVisible\">\n          <ngb-datepicker\n            #datepicker\n            [displayMonths]=\"'2'\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            navigation=\"select\"\n            outsideDays=\"hidden\"\n            [firstDayOfWeek]=\"firstDayOfWeek\"\n            [showWeekdays]=\"true\"\n            [dayTemplate]=\"t\"\n            (select)=\"onDateSelection($event)\"\n          >\n          </ngb-datepicker>\n          <!--  -->\n\n          <ng-template #t let-date let-focused=\"focused\">\n            <span\n              class=\"custom-day\"\n              [class.focused]=\"focused\"\n              [class.range]=\"isRange(date)\"\n              [class.faded]=\"isHovered(date) || isInside(date)\"\n              (mouseenter)=\"hoveredDate = date\"\n              (mouseleave)=\"hoveredDate = null\"\n            >\n              {{ date.day }}\n            </span>\n          </ng-template>\n        </div>\n\n        <div\n          class=\"d-flex flex-column justify-content-lg-between mt-md-0\"\n          [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\"\n        >\n          <!-- filters -->\n          <div *ngIf=\"filters\" class=\"mb-3\" ngbDropdown>\n            <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n              {{ selectedFilter.label }}\n            </button>\n            <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n              <button\n                class=\"dropdown-item\"\n                type=\"button\"\n                *ngFor=\"let filter of filters; let index = index\"\n                (click)=\"onFilterChange(filter, index)\"\n              >\n                {{ filter.label }}\n              </button>\n            </div>\n          </div>\n\n          <!-- presets radio buttons-->\n          <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n            <mat-radio-group\n              aria-label=\"Select an option\"\n              class=\"stacked-radio-group\"\n              name=\"presets\"\n              [(ngModel)]=\"presetSelected\"\n              (change)=\"presetSelect($event)\"\n            >\n              <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{\n                preset.label\n              }}</mat-radio-button>\n\n              <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'custom'\" (change)=\"showDatepicker()\">{{\n                customRangeText\n              }}</mat-radio-button>\n            </mat-radio-group>\n          </div>\n\n          <!-- presets buttons-->\n          <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngFor=\"let preset of presets\"\n              (click)=\"presetClick(preset)\"\n            >\n              {{ preset.label }}\n            </button>\n\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngIf=\"showCustomPreset\"\n              (click)=\"showDatepicker()\"\n            >\n              {{ customRangeText }}\n            </button>\n          </div>\n\n          <!-- buttons -->\n          <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n            <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"apply()\">{{ applyText }}</button>\n            <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"cancel()\">\n              {{ cancelText }}\n            </button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </ng-template>\n</div>\n",
                providers: [{ provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
            }] }
];
/** @nocollapse */
PbdsDaterangePopoverComponent.ctorParameters = () => [
    { type: NgbCalendar },
    { type: PbdsDaterangeService }
];
PbdsDaterangePopoverComponent.propDecorators = {
    datepickerPopup: [{ type: ViewChild, args: ['datepickerPopup', { static: true },] }],
    presets: [{ type: Input }],
    presetSelected: [{ type: Input }],
    filters: [{ type: Input }],
    filterSelected: [{ type: Input }],
    showCustomPreset: [{ type: Input }],
    applyText: [{ type: Input }],
    cancelText: [{ type: Input }],
    customRangeText: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    fromDate: [{ type: Input }],
    toDate: [{ type: Input }],
    inputFormat: [{ type: Input }],
    change: [{ type: Output }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangePopoverComponent.prototype.datepickerPopup;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.presets;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.presetSelected;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.filters;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.filterSelected;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.showCustomPreset;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.applyText;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.cancelText;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.customRangeText;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.minDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.maxDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.fromDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.toDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.inputFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangePopoverComponent.prototype.change;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.firstDayOfWeek;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.hoveredDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.dateRange;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.isDatepickerVisible;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.selectedFilter;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.presetSelect;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.isHovered;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.isInside;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.isRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangePopoverComponent.prototype.calendar;
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangePopoverComponent.prototype.daterangeService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PbdsDaterangePopoverModule {
}
PbdsDaterangePopoverModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PbdsDaterangePopoverComponent],
                imports: [CommonModule, FormsModule, MatRadioModule, NgbDatepickerModule, NgbPopoverModule, NgbDropdownModule],
                exports: [PbdsDaterangePopoverComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function PbdsDaterangePreset() { }
if (false) {
    /** @type {?} */
    PbdsDaterangePreset.prototype.label;
    /** @type {?} */
    PbdsDaterangePreset.prototype.value;
}
/**
 * @record
 */
function PbdsDaterangeFilter() { }
if (false) {
    /** @type {?} */
    PbdsDaterangeFilter.prototype.field;
    /** @type {?} */
    PbdsDaterangeFilter.prototype.label;
}
/**
 * @record
 */
function PbdsDaterangeChange() { }
if (false) {
    /** @type {?} */
    PbdsDaterangeChange.prototype.fromDate;
    /** @type {?} */
    PbdsDaterangeChange.prototype.toDate;
    /** @type {?} */
    PbdsDaterangeChange.prototype.formattedDate;
    /** @type {?} */
    PbdsDaterangeChange.prototype.filter;
    /** @type {?} */
    PbdsDaterangeChange.prototype.value;
}
/**
 * @record
 */
function PbdsDaterangeLocale() { }
if (false) {
    /** @type {?} */
    PbdsDaterangeLocale.prototype.language;
    /** @type {?} */
    PbdsDaterangeLocale.prototype.country;
    /** @type {?} */
    PbdsDaterangeLocale.prototype.locale;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { CustomDatepickerI18n, DatavizBubbleMapComponent, PbdsDatavizBarComponent, PbdsDatavizBarGroupedComponent, PbdsDatavizBarSingleHorizontalComponent, PbdsDatavizBarStackedComponent, PbdsDatavizChoroplethMapComponent, PbdsDatavizGaugeComponent, PbdsDatavizHeatmapComponent, PbdsDatavizLineComponent, PbdsDatavizMetricBlockComponent, PbdsDatavizMetricIndicatorComponent, PbdsDatavizModule, PbdsDatavizPieComponent, PbdsDatavizService, PbdsDatavizSparklineComponent, PbdsDaterangePopoverComponent, PbdsDaterangePopoverModule, PbdsDaterangeService, PbdsHeaderShadowDirective, PbdsHeaderShadowModule };
//# sourceMappingURL=pb-design-system.js.map

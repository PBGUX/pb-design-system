import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Component, ChangeDetectionStrategy, HostBinding, Input, Output, ContentChild, forwardRef, Directive, Inject, NgModule } from '@angular/core';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2$1 from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { pointer, select } from 'd3-selection';
import { scaleOrdinal, scaleBand, scaleLinear, scaleTime, scalePoint, scaleQuantize, scaleQuantile, scaleThreshold } from 'd3-scale';
import { pie, arc, line, curveCatmullRom, area, stack, stackOffsetDiverging, stackOrderNone } from 'd3-shape';
import { interpolate } from 'd3-interpolate';
import { format as format$1 } from 'd3-format';
import { isoParse, isoFormat, timeFormat as timeFormat$1 } from 'd3-time-format';
import { timeFormat, format } from 'd3';
import { min, max, extent, bisectLeft, range, bisect, sum } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { easeQuadInOut, easeLinear } from 'd3-ease';
import { geoMercator, geoAlbersUsa, geoAlbers, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';

class PbdsDatavizService {
    constructor() {
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
        this.getColors = (mono = false, theme = 'classic') => {
            return mono ? this.colors[theme].mono : this.colors[theme].full;
        };
        this.createGradientDefs = (svg, mono = false, theme = 'classic', vertical = true) => {
            const colors = mono ? [this.colors[theme].mono[2]] : this.colors[theme].full;
            for (let i = 0; i < colors.length; i++) {
                const color = mono ? this.colors[theme].mono[2] : this.colors[theme].full[i];
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
        };
        this.createGlowFilter = svg => {
            // add a new definition
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
            const merge = glow.append('feMerge');
            merge.append('feMergeNode').attr('in', 'SourceGraphic');
            for (let x = 0; x < feOffsets.length; x++) {
                merge.append('feMergeNode').attr('in', 'coloredBlur' + x);
            }
        };
    }
    d3Format(type, string) {
        let format$1;
        switch (type) {
            case 'number':
                format$1 = format(string);
                break;
            case 'time':
                format$1 = timeFormat(string);
                break;
            default:
                format$1 = null;
                break;
        }
        return format$1;
    }
}
PbdsDatavizService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PbdsDatavizService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class PbdsDatavizPieComponent {
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
        this.tooltipLabelSuffix = '';
        this.tooltipValueFormatString = '';
        this.customColor = false;
        this.colorsArray = [];
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.currentData = [];
        this.updateChart = (firstRun = true) => {
            // slices
            this.svg
                .selectAll('path')
                .data(this.pie(this.data))
                .join((enter) => {
                const path = enter.append('path');
                path
                    .each((d) => (d.outerRadius = this.outerRadius))
                    .attr('fill', (d) => this.colorRange(d.data.label))
                    .attr('class', 'slice')
                    .each((d, i, nodes) => {
                    // save the current data to be used in arc update tween
                    this.currentData.splice(i, 1, d);
                });
                if (this.type === 'pie') {
                    path.style('stroke', '#fff').style('stroke-width', 2).style('stroke-alignment', 'inner');
                }
                path.call((path) => path
                    .transition()
                    .delay(500)
                    .duration((d, i, n) => (firstRun ? 0 : 500))
                    .attrTween('d', this.arcEnterTween));
                return path;
            }, (update) => {
                this.tooltipHide();
                update.each((d) => {
                    return (d.outerRadius = this.outerRadius);
                });
                update.transition().duration(500).attrTween('d', this.arcUpdateTween);
                return update;
            }, (exit) => exit.remove())
                .on('mouseover', (event, data) => {
                this.pathMouseOver(event, data);
                this.tooltipShow(event, data);
            })
                .on('mousemove', (event, data) => {
                this.tooltipShow(event, data);
                // this.tooltipMove(event, data);
                this.tooltipMove(event, this.chart.node());
            })
                .on('mouseout', (event, data) => {
                this.pathMouseOut(event, data);
                this.tooltipHide();
            })
                .on('click', (event, data) => {
                this.pathClick(event, data);
            });
            // legend
            this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(this.data)
                .join((enter) => {
                const li = enter.append('li').attr('class', 'legend-item');
                li.append('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (d) => this.colorRange(d.label));
                const description = li.append('span').attr('class', 'legend-description');
                description
                    .append('span')
                    .attr('class', 'legend-label')
                    .html((d) => {
                    switch (this.legendLabelFormatType) {
                        case 'time':
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                description
                    .append('span')
                    .attr('class', 'legend-value')
                    .html((d) => this.legendValueFormat(d.value));
                return li;
            }, (update) => {
                update.selectAll('.legend-key').style('background-color', (d) => this.colorRange(d.label));
                update.select('.legend-label').html((d) => {
                    switch (this.legendLabelFormatType) {
                        case 'time':
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                update.select('.legend-value').html((d) => this.legendValueFormat(d.value));
                return update;
            }, (exit) => exit.remove())
                .datum((d, i) => {
                return { data: d, index: i };
            })
                .on('mouseover focus', (event, data) => {
                this.legendMouseOverFocus(event, data);
                this.pathMouseOver(event, data);
            })
                .on('mouseout blur', (event, data) => {
                this.legendMouseOutBlur(event, data);
                this.pathMouseOut(event, data);
            })
                .on('click', (event, data) => {
                this.clicked.emit({ event: event, data: data.data });
            });
        };
        this.arcEnterTween = (data) => {
            const i = interpolate(data.startAngle, data.endAngle);
            return (t) => {
                data.endAngle = i(t);
                return this.arc(data);
            };
        };
        // see https://bl.ocks.org/HarryStevens/e1acaf628b1693f1b32e5f2e1a7f73fb
        this.arcUpdateTween = (data, index, n) => {
            const interpolate$1 = interpolate(this.currentData[index], data);
            // update the current data for this slice
            this.currentData[index] = interpolate$1(0);
            return (t) => {
                return this.arc(interpolate$1(t));
            };
        };
        this.arcMouseOverTween = (data) => {
            const i = interpolate(data.outerRadius, this.outerRadius + this.arcZoom);
            return (t) => {
                data.outerRadius = i(t);
                return this.arc(data);
            };
        };
        this.arcMouseOutTween = (data) => {
            // debugger;
            const i = interpolate(data.outerRadius, this.outerRadius);
            return (t) => {
                data.outerRadius = i(t);
                return this.arc(data);
            };
        };
        this.legendMouseOverFocus = (event, data) => {
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => {
                return `${d.label}` !== `${data.label}`;
            })
                .classed('inactive', true);
        };
        this.legendMouseOutBlur = (event, data) => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
        };
        this.pathMouseOver = (event, data) => {
            // console.log(data);
            const slices = this.chart.selectAll('.slice');
            const slice = slices.filter((d, i) => i === data.index);
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== data.index)
                .classed('inactive', true);
            slices.filter((d, i) => i !== data.index).classed('inactive', true);
            slice.transition().duration(300).delay(0).attrTween('d', this.arcMouseOverTween);
            this.hovered.emit({
                event: event,
                data: data.data ? data.data : data // legend hover data is different than slice hover data
            });
        };
        this.pathMouseOut = (event, data) => {
            const slices = this.chart.selectAll('.slice');
            const slice = slices.filter((d, i) => d.label === data.label);
            this.chart.selectAll('.legend-item').classed('inactive', false);
            slices.classed('inactive', false);
            slice.transition().duration(300).delay(0).attrTween('d', this.arcMouseOutTween);
        };
        this.pathClick = (event, data) => {
            this.clicked.emit({
                event: event,
                data: data.data
            });
        };
        this.tooltipShow = (event, data) => {
            // debugger;
            this.tooltipSetPosition(event);
            const percentage = (data.endAngle - data.startAngle) / (2 * Math.PI);
            let label;
            switch (this.tooltipLabelFormatType) {
                case 'time':
                    const parsedTime = isoParse(data.data.label);
                    label = `${this.tooltipLabelFormat(parsedTime)}${this.tooltipLabelSuffix}`;
                    break;
                default:
                    label = `${data.data.label}${this.tooltipLabelSuffix}`;
            }
            this.tooltip.html(`
        <div class="tooltip-label">${label}</div>
        <div class="tooltip-value">${this.tooltipValueFormat(percentage)}</div>
      `);
            this.tooltip.style('opacity', 1);
        };
        this.tooltipMove = (event, node) => {
            this.tooltipSetPosition(event, node);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.tooltipSetPosition = (event, node) => {
            // debugger;
            const coordinates = pointer(event, node);
            this.tooltip.style('left', `${coordinates[0] + 16}px`);
            this.tooltip.style('top', `${coordinates[1] + 16}px`);
        };
    }
    ngOnInit() {
        this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
        this.width = this.width - this.margin.left - this.margin.right;
        this.height = this.width - this.margin.top - this.margin.bottom;
        this.colors = (this.customColor && !this.monochrome) ? this.colorsArray : this._dataviz.getColors(this.monochrome, this.theme);
        this.innerRadius = Math.min(this.width, this.height) / 2.5;
        this.outerRadius = Math.min(this.width, this.height) / 2;
        this.arcZoom = 10;
        this.anglePad = 0.02;
        this.legendValueFormat = format$1(this.legendValueFormatString);
        this.tooltipValueFormat = format$1(this.tooltipValueFormatString);
        // create formatters
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipLabelFormat = this._dataviz.d3Format(this.tooltipLabelFormatType, this.tooltipLabelFormatString);
        this.colorRange = scaleOrdinal()
            .range(this.colors)
            .domain(this.data.map((c) => c.label));
        if (this.type === 'pie') {
            this.innerRadius = 0;
            this.anglePad = 0;
        }
        this.pie = pie()
            .padAngle(this.anglePad)
            .value((d) => d.value)
            .sort(null);
        this.arc = arc().padRadius(this.outerRadius).innerRadius(this.innerRadius);
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        this.svg = this.chart
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.width / 2 + this.margin.left} -${this.height / 2 + this.margin.top} ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`);
        this.chart.append('ul').attr('class', 'legend legend-right');
        this.tooltip = this.chart
            .append('div')
            .style('opacity', 0)
            .attr('class', 'pbds-tooltip')
            .attr('aria-hidden', 'true');
        this.updateChart();
    }
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart(false);
        }
    }
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
}
PbdsDatavizPieComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizPieComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizPieComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizPieComponent, selector: "pbds-dataviz-pie", inputs: { data: "data", width: "width", type: "type", monochrome: "monochrome", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", legendValueFormatString: "legendValueFormatString", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipLabelSuffix: "tooltipLabelSuffix", tooltipValueFormatString: "tooltipValueFormatString", theme: "theme", customColor: "customColor", colorsArray: "colorsArray" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-pie": "this.pieClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizPieComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-pie', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], pieClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-pie']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], type: [{
                type: Input
            }], monochrome: [{
                type: Input
            }], legendLabelFormatType: [{
                type: Input
            }], legendLabelFormatString: [{
                type: Input
            }], legendValueFormatString: [{
                type: Input
            }], tooltipLabelFormatType: [{
                type: Input
            }], tooltipLabelFormatString: [{
                type: Input
            }], tooltipLabelSuffix: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], theme: [{
                type: Input
            }], customColor: [{
                type: Input
            }], colorsArray: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });

class PbdsDatavizBarComponent {
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
        this.tooltipLabelSuffix = '';
        this.hideTooltipLabel = true;
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
        this.gradient = true;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = () => {
            // update the xScale
            this.xAxisScale.domain(this.data.map((d) => d.label));
            // update the yScale
            this.yAxisScale
                .domain([
                min(this.data, (d) => d.value - d.value * +this.yAxisMinBuffer),
                max(this.data, (d) => d.value + d.value * +this.yAxisMaxBuffer)
            ])
                .rangeRound([this.height, 0])
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
            if (!this.hideGrayBars) {
                // gray bars
                this.svg
                    .selectAll('.gray-bar')
                    .data(this.data)
                    .join((enter) => enter
                    .append('rect')
                    .attr('class', 'gray-bar')
                    .attr('height', 0)
                    .attr('x', (d) => this.xAxisScale(d.label))
                    .attr('width', this.xAxisScale.bandwidth())
                    .call((enter) => enter.transition().duration(500).attr('height', this.height)), (update) => update
                    .transition()
                    .duration(1000)
                    .attr('x', (d) => this.xAxisScale(d.label))
                    .attr('width', this.xAxisScale.bandwidth())
                    .selection(), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove());
                // color bars
                this.svg
                    .selectAll('.bar')
                    .data(this.data)
                    .join((enter) => enter
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('fill', (d) => this.barFill(d)) // removes hash to prevent safari bug;
                    .attr('x', (d) => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 4)
                    .attr('width', this.xAxisScale.bandwidth() / 2)
                    .attr('y', this.height)
                    .attr('height', 0)
                    .attr('pointer-events', 'none')
                    .call((enter) => enter
                    .transition()
                    .duration(1000)
                    .attr('y', (d) => this.yAxisScale(d.value))
                    .attr('height', (d) => this.height - this.yAxisScale(d.value))
                    .attr('data-color', (d) => this.colorRange(d.label))
                    .transition()
                    .attr('pointer-events', 'auto')), (update) => update
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('x', (d) => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 4)
                    .attr('width', this.xAxisScale.bandwidth() / 2)
                    .attr('height', (d) => this.height - this.yAxisScale(d.value))
                    .attr('y', (d) => this.yAxisScale(d.value))
                    .transition()
                    .selection()
                    .attr('pointer-events', 'auto'), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove())
                    .on('mouseover', (event, data) => this.barMouseOver(event, data))
                    .on('mouseout', (event, data) => this.barMouseOut())
                    .on('click', (event, data) => this.barMouseClick(event, data));
            }
            else {
                // color bars
                this.svg
                    .selectAll('.bar')
                    .data(this.data)
                    .join((enter) => enter
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('fill', (d) => this.barFill(d))
                    .attr('x', (d) => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 5.5)
                    .attr('width', this.xAxisScale.bandwidth() / 1.5)
                    .attr('y', this.height)
                    .attr('height', 0)
                    .attr('pointer-events', 'none')
                    .call((enter) => enter
                    .transition()
                    .duration(1000)
                    .attr('y', (d) => this.yAxisScale(d.value))
                    .attr('height', (d) => this.height - this.yAxisScale(d.value))
                    .attr('data-color', (d) => this.colorRange(d.label))
                    .transition()
                    .attr('pointer-events', 'auto')), (update) => update
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('x', (d) => this.xAxisScale(d.label) + this.xAxisScale.bandwidth() / 5.5)
                    .attr('width', this.xAxisScale.bandwidth() / 1.5)
                    .attr('height', (d) => this.height - this.yAxisScale(d.value))
                    .attr('y', (d) => this.yAxisScale(d.value))
                    .transition()
                    .selection()
                    .attr('pointer-events', 'auto'), (exit) => exit.transition().attr('pointer-events', 'none').remove())
                    .on('mouseover', (event, data) => this.barMouseOver(event, data))
                    .on('mouseout', (event, data) => this.barMouseOut())
                    .on('click', (event, data) => this.barMouseClick(event, data));
            }
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.data)
                    .join((enter) => {
                    const li = enter.insert('li', 'li.legend-static').attr('class', 'legend-item');
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
                                const parsedTime = isoParse(d.label);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.label;
                        }
                    });
                    return li;
                }, (update) => update.select('.legend-label').html((d) => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                }), (exit) => exit.remove())
                    .on('mouseover', (event, data) => this.legendMouseOver(event, data))
                    .on('mouseout', () => this.legendMouseOut())
                    .on('click', (event, data) => this.legendMouseClick(event, data));
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
        };
        this.barMouseOver = (event, data) => {
            this.chart
                .selectAll('.bar')
                .filter((d, i) => d.label !== data.label)
                .classed('inactive', true);
            const bar = this.chart.selectAll('.bar').filter((d, i) => d.label === data.label);
            const barColor = bar.attr('data-color');
            bar.style('fill', barColor);
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => d.label !== data.label)
                .classed('inactive', true);
            this.tooltipShow(event, data);
            this.hovered.emit({ event, data });
        };
        this.barMouseOut = () => {
            this.chart.selectAll('.bar').classed('inactive', false).style('fill', null);
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.tooltipHide();
        };
        this.barMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.legendMouseOver = (event, data) => {
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => d.label !== data.label)
                .classed('inactive', true);
            this.chart
                .selectAll('.bar')
                .filter((d, i) => d.label !== data.label)
                .classed('inactive', true);
            const bar = this.chart.selectAll('.bar').filter((d, i) => d.label === data.label);
            const barColor = bar.attr('data-color');
            bar.style('fill', barColor);
            this.tooltipShow(event, data, this.chart
                .selectAll('.bar')
                .filter((d, i) => d.label === data.label)
                .node());
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.bar').classed('inactive', false).style('fill', null);
            this.tooltipHide();
        };
        this.legendMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.tooltipShow = (event, data, node) => {
            const scroll = this._scroll.getScrollPosition();
            let dimensions = event.currentTarget.getBoundingClientRect();
            let label;
            if (node) {
                const target = this.chart
                    .selectAll('.bar')
                    .filter((d, i) => d.label === data.label)
                    .node();
                dimensions = target.getBoundingClientRect();
            }
            switch (this.tooltipLabelFormatType) {
                case 'number':
                    label = `${this.tooltipLabelFormat(data.label)}${this.tooltipLabelSuffix}`;
                    break;
                case 'time':
                    const parsedTime = isoParse(data.label);
                    label = `${this.tooltipLabelFormat(parsedTime)}${this.tooltipLabelSuffix}`;
                    break;
                default:
                    label = `${data.label}${this.tooltipLabelSuffix}`;
            }
            const value = this.tooltipValueFormat === null
                ? `<div class="tooltip-value">${data.value}</div>`
                : `<div class="tooltip-value">${this.tooltipValueFormat(data.value)}</div>`;
            this.tooltip.html(`
        ${this.hideTooltipLabel ? '' : `${label}`}
        ${value}
      `);
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight + 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight}px`); //
            this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.xAxisFormatter = (item) => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return this.xAxisFormat(item);
                case 'time':
                    const parseDate = isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        };
        this.yAxisFormatter = (item) => {
            switch (this.yAxisFormatType) {
                case 'number':
                    return this.yAxisFormat(item);
                case 'time':
                    const parseDate = isoParse(item);
                    return this.yAxisFormat(parseDate);
                default:
                    return item;
            }
        };
    }
    ngOnInit() {
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
        this.yAxisTickSize = 8;
        this.yAxisTickSizeOuter = 0;
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
                    break;
                case 'medium':
                    this.hideXAxisDomain = true;
                    this.hideXAxis = !this.hideLegend;
                    this.hideXGrid = true;
                    this.hideXAxisTicks = true;
                    this.hideYAxisDomain = true;
                    this.hideYAxisTicks = true;
                    this.hideYGrid = true;
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
            this.xAxisTitleMargin = this.xAxisTitle ? 30 : 0;
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
            .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin}`);
        // build color ranges
        this.colorRange = scaleOrdinal().range(this._dataviz.createGradientDefs(this.svg, this.singleSeries, this.theme));
        // X AXIS
        this.xAxisScale = scaleBand()
            .domain(this.data.map((d) => d.label))
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
        // X AXIS TITLE
        if (this.xAxisTitle) {
            this.svg
                .append('text')
                .attr('class', 'axis-title')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${this.svg.attr('width') / 2 - this.margin.left / 2 - this.margin.right / 2}, ${this.height + this.margin.top + (this.hideXAxis ? 20 : 40)})`)
                .text(this.xAxisTitle);
        }
        // Y AXIS
        this.yAxisScale = scaleLinear()
            .domain([
            min(this.data, (d) => d.value - d.value * +this.yAxisMinBuffer),
            max(this.data, (d) => d.value + d.value * +this.yAxisMaxBuffer)
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
                .attr('x2', +this.width - this.margin.right - this.margin.left)
                .attr('transform', `translate(0,  ${this.yAxisScale(+this.threshold)})`);
        }
        // Y AVERAGE
        if (this.average) {
            this.yAverage = this.svg
                .append('line')
                .attr('class', 'average')
                .attr('x2', +this.width - this.margin.right - this.margin.left)
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
        // add average to legend
        if (this.average && !this.hideLegend) {
            this.chart
                .select('.legend')
                .append('li')
                .attr('class', 'legend-static legend-average')
                .html(() => {
                return `
          <span class="legend-key"></span>
          <span class="legend-label">${this.averageLabel}</span>
        `;
            });
        }
        // add threshold to legend
        if (this.threshold && !this.hideLegend) {
            this.chart
                .select('.legend')
                .append('li')
                .attr('class', 'legend-static legend-threshold')
                .html(() => {
                return `
          <span class="legend-key"></span>
          <span class="legend-label">${this.thresholdLabel}</span>
        `;
            });
        }
        this.updateChart();
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
    barFill(d) {
        const path = this._location.path();
        const url = this._location.prepareExternalUrl(path);
        const colorRange = this.colorRange(d.label);
        if (this.gradient) {
            return `url(${url}#gradient-${colorRange.substr(1)})`;
        }
        else {
            return colorRange;
        }
    }
}
PbdsDatavizBarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBarComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizBarComponent, selector: "pbds-dataviz-bar", inputs: { data: "data", width: "width", height: "height", type: "type", singleSeries: "singleSeries", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", xAxisTitle: "xAxisTitle", yAxisFormatType: "yAxisFormatType", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", yAxisMinBuffer: "yAxisMinBuffer", yAxisMaxBuffer: "yAxisMaxBuffer", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipLabelSuffix: "tooltipLabelSuffix", hideTooltipLabel: "hideTooltipLabel", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", threshold: "threshold", thresholdLabel: "thresholdLabel", average: "average", averageLabel: "averageLabel", theme: "theme", gradient: "gradient" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-bar": "this.barClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-bar', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }, { type: i2.Location }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], barClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-bar']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], type: [{
                type: Input
            }], singleSeries: [{
                type: Input
            }], xAxisFormatType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], xAxisTitle: [{
                type: Input
            }], yAxisFormatType: [{
                type: Input
            }], yAxisFormatString: [{
                type: Input
            }], yAxisTicks: [{
                type: Input
            }], yAxisMinBuffer: [{
                type: Input
            }], yAxisMaxBuffer: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendPosition: [{
                type: Input
            }], legendLabelFormatType: [{
                type: Input
            }], legendLabelFormatString: [{
                type: Input
            }], tooltipLabelFormatType: [{
                type: Input
            }], tooltipLabelFormatString: [{
                type: Input
            }], tooltipLabelSuffix: [{
                type: Input
            }], hideTooltipLabel: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], threshold: [{
                type: Input
            }], thresholdLabel: [{
                type: Input
            }], average: [{
                type: Input
            }], averageLabel: [{
                type: Input
            }], theme: [{
                type: Input
            }], gradient: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });

// assign an ID for each component instance
let nextId = 0;
class PbdsDatavizLineComponent {
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
        this.xAxisType = 'date';
        this.xAxisFormatString = '';
        this.xAxisTicks = 6;
        this.xAxisTitle = null;
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
        this.tooltipHeadingSuffix = '';
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.marginTop = 10; // hardcoded on purpose, do not document until feedback
        this.marginRight = 20; // hardcoded on purpose, do not document until feedback
        this.marginBottom = 30; // hardcoded on purpose, do not document until feedback
        this.marginLeft = 55; // hardcoded on purpose, do not document until feedback
        this.customColor = false;
        this.colorsArray = [];
        this.lineCurved = true;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.tooltipHovered = new EventEmitter();
        this.tooltipClicked = new EventEmitter();
        this.updateChart = () => {
            this.mouserect.data(this.data);
            // update the xScale
            if (this.xAxisType === 'date') {
                this.xAxisScale
                    .domain(extent(this.data.labels, (d) => {
                    return isoParse(d);
                }))
                    .range([0, this.width - this.margin.left - this.margin.right]);
            }
            else if (this.xAxisType === 'number') {
                this.xAxisScale.domain(extent(this.data.labels, (d) => {
                    return d;
                }));
            }
            else {
                this.xAxisScale.domain(this.data.labels);
            }
            // update the yScale
            this.yAxisScale
                .domain([
                min(this.data.series, (d, i) => {
                    const minVal = +min(d.values);
                    return minVal - minVal * +this.yAxisMinBuffer;
                }),
                max(this.data.series, (d, i) => {
                    const maxVal = +max(d.values);
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
                .attr('filter', () => this.type !== 'high' ? `url(${this._location.prepareExternalUrl(this._location.path())}#glow)` : null)
                .data(this.data.series)
                .join((enter) => {
                enter
                    .append('path')
                    .attr('clip-path', `url(${this._location.prepareExternalUrl(this._location.path())}#clip-path-${this.clipPathId})`)
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
                    .ease(easeQuadInOut)
                    .attr('d', (data) => this.d3line(data.values)));
            }, (update) => update.call((update) => update
                .transition()
                .duration(1000)
                .ease(easeQuadInOut)
                .attr('d', (d) => this.d3line(d.values))), (exit) => exit.remove());
            // area
            if (this.area) {
                this.svg
                    .selectAll('path.area')
                    .data(this.data.series)
                    .join((enter) => enter
                    .append('path')
                    .attr('clip-path', `url(${this._location.prepareExternalUrl(this._location.path())}#clip-path-${this.clipPathId})`)
                    .attr('class', 'area')
                    .attr('d', (data) => {
                    const array = new Array(data.values.length).fill(0);
                    return this.d3area(array);
                })
                    .style('color', (d) => this.colorRange(d.label))
                    .call((enter) => enter
                    .transition()
                    .duration(1000)
                    .ease(easeQuadInOut)
                    .attr('d', (data) => this.d3area(data.values))), (update) => update.call((update) => {
                    return update
                        .transition()
                        .duration(1000)
                        .ease(easeQuadInOut)
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
                    .attr('clip-path', `url(${this._location.prepareExternalUrl(this._location.path())}#clip-path-points-${this.clipPathId})`)
                    .style('color', (d, i) => this.colorRange(d.label))
                    .selectAll('circle')
                    .data((d) => d.values)
                    .join((enter) => enter
                    .append('circle')
                    .attr('cx', (d, i) => {
                    if (this.xAxisType === 'date') {
                        return this.xAxisScale(isoParse(this.data.labels[i]));
                    }
                    else {
                        return this.xAxisScale(this.data.labels[i]);
                    }
                })
                    .attr('cy', (d) => this.yAxisScale(0))
                    .attr('r', (d, i) => {
                    // hide circles if there is no data
                    if (d === null) {
                        return 0;
                    }
                    return this.lineWidth * 2;
                })
                    .style('stroke-width', this.lineWidth)
                    .call((enter) => enter
                    .transition()
                    .duration(1000)
                    .ease(easeQuadInOut)
                    .attr('cy', (d) => this.yAxisScale(d))), () => { }, (exit) => exit.remove()), (update) => update
                    .selectAll('circle')
                    .data((d) => d.values)
                    .join((enter) => enter
                    .append('circle')
                    .attr('cx', (d, i) => {
                    if (this.xAxisType === 'date') {
                        return this.xAxisScale(isoParse(this.data.labels[i]));
                    }
                    else {
                        return this.xAxisScale(this.data.labels[i]);
                    }
                })
                    .attr('cy', (d) => this.yAxisScale(d))
                    .attr('r', (d, i) => {
                    // hide circles if there is no data
                    if (d === null) {
                        return 0;
                    }
                    return this.lineWidth * 2;
                })
                    .style('stroke-width', this.lineWidth), (update) => update.call((update) => update
                    .transition()
                    .duration(1000)
                    .ease(easeQuadInOut)
                    .attr('cx', (d, i) => {
                    if (this.xAxisType === 'date') {
                        return this.xAxisScale(isoParse(this.data.labels[i]));
                    }
                    else {
                        return this.xAxisScale(this.data.labels[i]);
                    }
                })
                    .attr('cy', (d) => {
                    if (d === null) {
                        return this.yAxisScale(0);
                    }
                    return this.yAxisScale(d);
                })
                    .attr('r', (d, i) => {
                    // hide circles if there is no data
                    if (d === null) {
                        return 0;
                    }
                    return this.lineWidth * 2;
                })), (exit) => exit.remove()), (exit) => exit.remove());
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
                                const parsedTime = isoParse(d.label);
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
                                const parsedTime = isoParse(d.label);
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
            let mouseX; // mouse x position
            let lower;
            let upper;
            let closest;
            let closestIndex;
            let leftIndex = 0;
            // handle string type, no invert function on scalePoint
            if (this.xAxisType === 'string') {
                mouseX = pointer(event)[0];
            }
            else {
                mouseX = this.xAxisScale.invert(pointer(event)[0]);
            }
            // console.log(mouseX);
            if (this.xAxisType === 'date') {
                leftIndex = bisectLeft(this.data.labels, isoFormat(mouseX));
                // prevent error for 0 index
                if (leftIndex === 0)
                    return false;
                lower = new Date(this.data.labels[leftIndex - 1]);
                upper = new Date(this.data.labels[leftIndex]);
                closest = +mouseX - +lower > +upper - mouseX ? upper : lower; // date mouse is closest to
                closestIndex = this.data.labels.indexOf(isoFormat(closest)); // which index the mouse is closest to
                // console.log(+mouseXDate, leftIndex, +dateLower, +dateUpper, +closestDate, closestIndex);
            }
            else if (this.xAxisType === 'number') {
                leftIndex = bisectLeft(this.data.labels, mouseX);
                // prevent error for 0 index
                if (leftIndex === 0)
                    return false;
                lower = this.data.labels[leftIndex - 1];
                upper = this.data.labels[leftIndex];
                closest = +mouseX - +lower > +upper - mouseX ? upper : lower; // date mouse is closest to
                closestIndex = this.data.labels.indexOf(closest); // which index the mouse is closest to
                // console.log(+mouseXDate, leftIndex, +lower, +upper, +closest, closestIndex);
            }
            else {
                const domain = this.xAxisScale.domain();
                const range$1 = this.xAxisScale.range();
                const rangePoints = range(range$1[0], range$1[1], this.xAxisScale.step());
                rangePoints.push(range$1[1]);
                leftIndex = bisect(rangePoints, mouseX);
                if (leftIndex === 0)
                    return false;
                lower = rangePoints[leftIndex - 1];
                upper = rangePoints[leftIndex];
                closest = +mouseX - +lower > +upper - mouseX ? +upper : +lower;
                const rangeIndex = rangePoints.indexOf(closest);
                closest = domain[rangeIndex];
                closestIndex = this.data.labels.indexOf(domain[rangeIndex]);
            }
            const circles = this.svg.selectAll('.line-group').selectAll('circle');
            circles.filter((d, i) => i === closestIndex).classed('active', true);
            circles.filter((d, i) => i !== closestIndex).classed('active', false);
            this.tooltipLine.attr('x1', this.xAxisScale(closest)).attr('x2', this.xAxisScale(closest)).classed('active', true);
            // console.log(this.tooltipLine.node().getBoundingClientRect(), this._scroll.getScrollPosition());
            this.tooltipShow(this.tooltipLine.node(), closestIndex);
            this.mousedata = {
                label: this.xAxisType === 'date' ? new Date(closest).toISOString() : closest,
                series: this.data.series.map((d) => {
                    return {
                        label: d.label,
                        value: d.values[closestIndex]
                    };
                })
            };
            this.tooltipHovered.emit({ event, data: this.mousedata }); // index of left closest date
        };
        this.mouserectMouseOut = (event, data) => {
            this.svg.selectAll('circle').classed('active', false);
            this.tooltipLine.classed('active', false);
            this.tooltipHide();
        };
        this.mouserectMouseClick = (event) => {
            this.clicked.emit({ event, data: this.mousedata });
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
                if (this.xAxisType === 'date') {
                    const parsedTime = isoParse(this.data.labels[closestIndex]);
                    return `${this.tooltipHeadingFormat(parsedTime)}${this.tooltipHeadingSuffix}`;
                }
                else if (this.xAxisType === 'number') {
                    const heading = this.data.labels[closestIndex];
                    return `${this.tooltipHeadingFormat(heading)}${this.tooltipHeadingSuffix}`;
                }
                else {
                    return `${this.data.labels[closestIndex]}${this.tooltipHeadingSuffix}`;
                }
            });
            this.tooltip.selectAll('.tooltip-value').html((d, i) => {
                const value = this.data.series[i].values[closestIndex];
                if (value === null || value === undefined) {
                    return '';
                }
                return this.tooltipValueFormatType ? this.tooltipValueFormat(value) : value;
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
            if (this.xAxisType === 'date') {
                const parseDate = isoParse(item);
                return this.xAxisFormat(parseDate);
            }
            else if (this.xAxisType === 'number') {
                return this.xAxisFormat(item);
            }
            else {
                return item;
                // return this.xAxisFormat(item);
            }
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
        this.xAxisFormat =
            this.xAxisType === 'date' ? timeFormat$1(this.xAxisFormatString) : format$1(this.xAxisFormatString);
        this.yAxisFormat = format$1(this.yAxisFormatString);
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipHeadingFormat =
            this.xAxisType === 'date'
                ? timeFormat$1(this.tooltipHeadingFormatString)
                : format$1(this.tooltipHeadingFormatString);
        this.tooltipLabelFormat = this._dataviz.d3Format(this.tooltipLabelFormatType, this.tooltipLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        // defaults for all chart types
        this.lineWidth = 3;
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
        this.xAxisTitleMargin = this.xAxisTitle ? 30 : 0;
        // adjust margin if xAxis hidden
        if (this.hideXAxis)
            this.margin.bottom = 10; // need small margin for yAxis with 0 tick label
        if (!this.hideLegend && this.legendPosition === 'right') {
            this.width = +this.width - +this.legendWidth;
        }
        // define line
        this.d3line = line()
            .x((d, i) => {
            if (this.xAxisType === 'date') {
                return this.xAxisScale(isoParse(this.data.labels[i]));
            }
            else if (this.xAxisType === 'number') {
                return this.xAxisScale(this.data.labels[i]);
            }
            else {
                return this.xAxisScale(this.data.labels[i]);
            }
        })
            .y((d) => this.yAxisScale(d))
            .defined((d, i) => {
            // console.log(d);
            return d !== null; // only draw line if data is not null
        });
        // define line curve
        if (this.lineCurved) {
            this.d3line.curve(curveCatmullRom.alpha(0.5));
        }
        // define area
        if (this.area) {
            this.d3area = area()
                .x((d, i) => {
                if (this.xAxisType === 'date') {
                    return this.xAxisScale(isoParse(this.data.labels[i]));
                }
                else if (this.xAxisType === 'number') {
                    return this.xAxisScale(this.data.labels[i]);
                }
                else {
                    return this.xAxisScale(this.data.labels[i]);
                }
            })
                .y0(this.height)
                .y1((d, i) => this.yAxisScale(d))
                .defined((d, i) => {
                // console.log(d);
                return d !== null; // only draw line if data is not null
            });
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
            .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin}`);
        // add rectangle to capture mouse
        this.mouserect = this.svg
            .append('rect')
            .attr('width', this.width - this.margin.left - this.margin.right)
            .attr('height', this.height)
            .attr('class', 'mouserect')
            .on('mousemove', (event, data) => this.mouserectMouseMove(event, data))
            .on('mouseout', (event, data) => this.mouserectMouseOut(event, data))
            .on('click', (event, data) => this.mouserectMouseClick(event));
        this.tooltipLine = this.svg.append('line').attr('y1', 0).attr('y2', this.height).attr('class', 'tooltip-line');
        // define color range
        const colors = this.customColor ? this.colorsArray : this._dataviz.getColors(false, this.theme);
        this.colorRange = scaleOrdinal().range(colors);
        // add glow def
        this._dataviz.createGlowFilter(this.svg);
        // X AXIS
        if (this.xAxisType === 'date') {
            this.xAxisScale = scaleTime()
                .domain(extent(this.data.labels, (d) => {
                return isoParse(d);
            }))
                .range([0, this.width - this.margin.left - this.margin.right]);
        }
        else if (this.xAxisType === 'number') {
            this.xAxisScale = scaleLinear()
                .domain(extent(this.data.labels, (d) => {
                return d;
            }))
                .range([0, this.width - this.margin.left - this.margin.right]);
        }
        else {
            this.xAxisScale = scalePoint()
                .domain(this.data.labels)
                .range([0, this.width - this.margin.left - this.margin.right]);
        }
        if (this.xAxisType === 'string') {
            this.xAxisCall = axisBottom(this.xAxisScale)
                // .ticks(+this.xAxisTicks)
                .tickSize(this.xAxisTickSize)
                .tickSizeOuter(this.xAxisTickSizeOuter)
                .tickFormat(this.xAxisFormatter)
                .tickValues(this.xAxisScale.domain().filter((d, i) => {
                // see https://github.com/d3/d3-scale/issues/182
                // d3 cannot determine number of strings to show on xaxis with scalePoint()
                return i % this.xAxisTicks === 0;
            }));
        }
        else {
            this.xAxisCall = axisBottom(this.xAxisScale)
                .ticks(+this.xAxisTicks)
                .tickSize(this.xAxisTickSize)
                .tickSizeOuter(this.xAxisTickSizeOuter)
                .tickFormat(this.xAxisFormatter);
        }
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
            if (this.xAxisType === 'string') {
                this.xGridCall = axisBottom(this.xAxisScale)
                    .tickSize(-this.height)
                    .tickValues(this.xAxisScale.domain().filter((d, i) => {
                    // see https://github.com/d3/d3-scale/issues/182
                    // d3 cannot determine number of strings to show on xaxis with scalePoint()
                    return i % this.xAxisTicks === 0;
                }));
            }
            else {
                this.xGridCall = axisBottom(this.xAxisScale).tickSize(-this.height);
            }
            this.xGrid = this.svg
                .append('g')
                .attr('class', 'grid grid-x')
                .classed('grid-zero-hidden', this.hideXAxisZero)
                .attr('transform', `translate(0, ${this.height})`) //${-this.margin.right / 2}
                .call(this.xGridCall);
        }
        // X AXIS TITLE
        if (this.xAxisTitle) {
            this.svg
                .append('text')
                .attr('class', 'axis-title')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${this.svg.attr('width') / 2 - this.margin.left / 2 - this.margin.right / 2}, ${this.height + this.margin.top + (this.hideXAxis ? 20 : 40)})`)
                // .attr('x', this.width / 2 - this.margin.left - this.margin.right)
                // .attr('y', this.height + this.margin.top + (this.hideXAxis ? 25 : 50))
                .text(this.xAxisTitle);
        }
        // Y AXIS
        this.yAxisScale = scaleLinear()
            .domain([
            min(this.data.series, (d, i) => {
                const minVal = +min(d.values);
                return minVal - minVal * +this.yAxisMinBuffer;
            }),
            max(this.data.series, (d, i) => {
                const maxVal = +max(d.values);
                return maxVal + maxVal * this.yAxisMaxBuffer;
            })
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
PbdsDatavizLineComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizLineComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizLineComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizLineComponent, selector: "pbds-dataviz-line", inputs: { data: "data", width: "width", height: "height", type: "type", area: "area", xAxisType: "xAxisType", xAxisFormatString: "xAxisFormatString", xAxisTicks: "xAxisTicks", xAxisTitle: "xAxisTitle", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", yAxisMinBuffer: "yAxisMinBuffer", yAxisMaxBuffer: "yAxisMaxBuffer", hideXGrid: "hideXGrid", hideYGrid: "hideYGrid", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", tooltipHeadingFormatString: "tooltipHeadingFormatString", tooltipHeadingSuffix: "tooltipHeadingSuffix", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", theme: "theme", customColor: "customColor", colorsArray: "colorsArray", lineCurved: "lineCurved" }, outputs: { hovered: "hovered", clicked: "clicked", tooltipHovered: "tooltipHovered", tooltipClicked: "tooltipClicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-line": "this.lineClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizLineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-line', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }, { type: i2.Location }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], lineClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-line']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], type: [{
                type: Input
            }], area: [{
                type: Input
            }], xAxisType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], xAxisTicks: [{
                type: Input
            }], xAxisTitle: [{
                type: Input
            }], yAxisFormatString: [{
                type: Input
            }], yAxisTicks: [{
                type: Input
            }], yAxisMinBuffer: [{
                type: Input
            }], yAxisMaxBuffer: [{
                type: Input
            }], hideXGrid: [{
                type: Input
            }], hideYGrid: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendPosition: [{
                type: Input
            }], legendLabelFormatType: [{
                type: Input
            }], legendLabelFormatString: [{
                type: Input
            }], tooltipHeadingFormatString: [{
                type: Input
            }], tooltipHeadingSuffix: [{
                type: Input
            }], tooltipLabelFormatType: [{
                type: Input
            }], tooltipLabelFormatString: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], theme: [{
                type: Input
            }], customColor: [{
                type: Input
            }], colorsArray: [{
                type: Input
            }], lineCurved: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }], tooltipHovered: [{
                type: Output
            }], tooltipClicked: [{
                type: Output
            }] } });

class PbdsDatavizGaugeComponent {
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
        this.detailsPaddingTop = 0;
        this.degreesToRadians = (degree) => {
            return (degree * Math.PI) / 180;
        };
        this.calculateMinMax = () => {
            const percentage = this.data.minvalue / (this.data.maxvalue - this.data.minvalue);
            return percentage * (this.data.value - this.data.minvalue) + (this.data.value - this.data.minvalue);
        };
        this.calculateCurve = (data) => {
            const start = this.degreesToRadians(this.startAngle);
            const end = start + (data * (this.degreesToRadians(this.endAngle) - start)) / this.data.maxvalue;
            return [
                {
                    startAngle: start,
                    endAngle: end
                }
            ];
        };
        this.drawChart = () => {
            this.gauge = this.svg.append('g').attr('class', 'gauge-group');
            // background arc
            this.gauge
                .append('path')
                .data(this.calculateCurve(this.data.maxvalue))
                .attr('class', 'gauge-background')
                .attr('d', (d) => {
                return this.arc({
                    innerRadius: this.radius - this.gaugeWidth,
                    outerRadius: this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            });
            // value arc
            this.gauge
                .append('path')
                .data(this.calculateCurve(this.calculateMinMax()))
                .attr('class', 'gauge-value')
                .attr('fill', this.color)
                .attr('d', (d) => {
                return this.arc({
                    innerRadius: this.radius - this.gaugeWidth,
                    outerRadius: this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            });
            switch (this.type) {
                case 'horseshoe':
                    const svgClone = this.svg.node().cloneNode(true);
                    const fakeSvg = document.body.appendChild(svgClone);
                    fakeSvg.setAttribute('style', 'position: absolute; left: -10000px;'); // position the cloned element offscreen
                    const fakeGroup = fakeSvg.getElementsByClassName('gauge-group')[0];
                    const fakeBox = fakeGroup.getBBox();
                    this.svg
                        .attr('height', fakeBox.height)
                        .attr('viewBox', `-${this.width / 2} -${this.width / 2} ${this.width} ${fakeBox.height}`);
                    this.detailsPaddingTop = this.gaugeWidth;
                    fakeSvg.remove(); // remove the cloned element from the DOM
                    break;
                case 'halfmoon':
                    this.svg.attr('height', this.width / 2);
                    this.svg.attr('viewBox', `-${this.width / 2} -${this.width / 2} ${this.width} ${this.width / 2}`);
                    break;
            }
        };
        this.updateChart = () => {
            const group = this.svg.select('.gauge-group');
            group.select('.gauge-value').transition().duration(750).call(this.arcTween, this.calculateMinMax());
            this.labelTween = this.chart.select('.gauge-number');
            this.labelTween.transition().duration(750).call(this.textTween, this.data.value);
        };
        this.arcTween = (transition, value) => {
            const newAngle = this.calculateCurve(value);
            transition.attrTween('d', (d) => {
                const interpolate$1 = interpolate(d.endAngle, newAngle[0].endAngle);
                return (t) => {
                    d.endAngle = interpolate$1(t);
                    return this.arc({
                        innerRadius: this.radius - this.gaugeWidth,
                        outerRadius: this.radius,
                        startAngle: d.startAngle,
                        endAngle: d.endAngle
                    });
                };
            });
        };
        this.textTween = (transition, value) => {
            value = format$1('.4f')(value);
            value = value.replace(/,/g, '.');
            transition.tween('text', () => {
                const interpolate$1 = interpolate(format$1('.4f')(+this.oldValue), value);
                return (t) => {
                    this.labelTween.text((d) => {
                        const updatedNumber = this.labelFormat(interpolate$1(t));
                        this.label = updatedNumber;
                        return updatedNumber;
                    });
                };
            });
        };
    }
    ngOnInit() {
        this.height = this.width;
        this.radius = Math.max(this.width, this.height) / 2;
        this.labelFormat = format$1(this.labelFormatString);
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
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`);
        this.drawChart();
    }
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.oldValue = changes.data.previousValue.value;
            this.updateChart();
        }
    }
}
PbdsDatavizGaugeComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizGaugeComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizGaugeComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizGaugeComponent, selector: "pbds-dataviz-gauge", inputs: { data: "data", width: "width", type: "type", color: "color", hideLabel: "hideLabel", labelFormatString: "labelFormatString", description: "description", gaugeWidth: "gaugeWidth" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-gauge": "this.gaugeClass" } }, usesOnChanges: true, ngImport: i0, template: `
    <div
      *ngIf="!hideLabel"
      class="gauge-details"
      [ngClass]="{ halfmoon: type === 'halfmoon', 'gauge-details-small': type === 'halfmoon' }"
      [ngStyle]="{ 'max-width.px': width - 3 * gaugeWidth, 'padding-top.px': detailsPaddingTop }"
    >
      <div class="gauge-number">{{ label }}</div>
      <div *ngIf="description" class="gauge-description text-center">{{ description }}</div>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizGaugeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-gauge', template: `
    <div
      *ngIf="!hideLabel"
      class="gauge-details"
      [ngClass]="{ halfmoon: type === 'halfmoon', 'gauge-details-small': type === 'halfmoon' }"
      [ngStyle]="{ 'max-width.px': width - 3 * gaugeWidth, 'padding-top.px': detailsPaddingTop }"
    >
      <div class="gauge-number">{{ label }}</div>
      <div *ngIf="description" class="gauge-description text-center">{{ description }}</div>
    </div>
  ` }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], gaugeClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-gauge']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], type: [{
                type: Input
            }], color: [{
                type: Input
            }], hideLabel: [{
                type: Input
            }], labelFormatString: [{
                type: Input
            }], description: [{
                type: Input
            }], gaugeWidth: [{
                type: Input
            }] } });

class PbdsDatavizSparklineComponent {
    constructor(_element) {
        this._element = _element;
        this.chartClass = true;
        this.sparklineClass = true;
        this.data = [];
        this.width = 160;
        this.height = 40;
        this.type = 'line';
        this.color = '#E23DA8';
        this.colorNegative = null; // undocumented, may add if needed
        this.strokeWidth = 2; // undocumented, width is automatically set by the type
        this.yAxisMinBuffer = 0;
        this.yAxisMaxBuffer = 0;
    }
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
                .attr('class', 'sparkline')
                .attr('fill', 'none')
                .attr('stroke-width', this.strokeWidth)
                .attr('stroke', this.color);
        }
        if (this.type === 'area' || this.type === 'area-high') {
            this.svg.append('path').attr('class', 'sparkarea').attr('fill', this.color).attr('fill-opacity', 0.3);
        }
        this.updateChart();
    }
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    }
    updateChart() {
        const data = this.data;
        const x = scaleLinear()
            .domain([0, this.data.length])
            .range([0, this.width - this.margin.left - this.margin.right]);
        const y = scaleLinear()
            .domain([+min(data) - this.yAxisMinBuffer, +max(data) + this.yAxisMaxBuffer])
            .range([this.height - this.margin.top - this.margin.bottom, 0]);
        const line$1 = line()
            .x((d, i) => x(i))
            .y((d) => y(d));
        const area$1 = area()
            .x((d, i) => x(i))
            .y0(this.height)
            .y1((d) => y(d));
        if (this.type === 'line' || this.type === 'line-high' || this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkline')
                .transition()
                .duration(1000)
                .attr('d', () => line$1(data));
        }
        if (this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkarea')
                .transition()
                .duration(1000)
                .attr('d', () => area$1(data));
        }
        if (this.type === 'bar') {
            const barWidth = (this.width - this.data.length) / this.data.length;
            // handles negative values, see example https://www.essycode.com/posts/create-sparkline-charts-d3/
            this.svg
                .selectAll('.sparkbar')
                .data(this.data)
                .join((enter) => enter
                .append('rect')
                .attr('class', 'sparkbar')
                .attr('x', (d, i) => x(i))
                .attr('y', this.height)
                .attr('width', barWidth)
                .attr('fill', (d) => (d > 0 ? this.color : this.colorNegative)) // still uses undocumented negative color values
                .attr('height', 0)
                .call((enter) => {
                enter
                    .transition()
                    .duration(1000)
                    .attr('y', (d) => (d > 0 ? y(d) : y(0)))
                    .attr('height', (d) => Math.abs(y(d) - y(0)));
                return enter;
            }), (update) => update
                .transition()
                .duration(1000)
                .selection()
                .attr('x', (d, i) => x(i))
                .attr('y', (d) => (d > 0 ? y(d) : y(0)))
                .attr('width', barWidth)
                .attr('height', (d) => Math.abs(y(d) - y(0)))
                .attr('fill', (d) => (d > 0 ? this.color : this.colorNegative)), (exit) => exit.remove());
        }
    }
}
PbdsDatavizSparklineComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizSparklineComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizSparklineComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizSparklineComponent, selector: "pbds-dataviz-sparkline", inputs: { data: "data", width: "width", height: "height", type: "type", color: "color", colorNegative: "colorNegative", strokeWidth: "strokeWidth", yAxisMinBuffer: "yAxisMinBuffer", yAxisMaxBuffer: "yAxisMaxBuffer" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-sparkline": "this.sparklineClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizSparklineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-sparkline', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], sparklineClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-sparkline']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], type: [{
                type: Input
            }], color: [{
                type: Input
            }], colorNegative: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], yAxisMinBuffer: [{
                type: Input
            }], yAxisMaxBuffer: [{
                type: Input
            }] } });

class PbdsDatavizBarStackedComponent {
    constructor(_dataviz, _element, _scroll) {
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
        this.xAxisTitle = null;
        this.yAxisFormatType = null;
        this.yAxisFormatString = '';
        this.yAxisTicks = 5;
        this.yAxisMaxBuffer = 0.01;
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'bottom';
        this.legendLabelFormatType = null;
        this.legendLabelFormatString = '';
        this.tooltipHeadingFormatType = null;
        this.tooltipHeadingFormatString = '';
        this.tooltipHeadingSuffix = '';
        this.tooltipHeadingValueFormatType = null;
        this.tooltipHeadingValueFormatString = '';
        this.tooltipLabelFormatType = null;
        this.tooltipLabelFormatString = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.customColor = false;
        this.colorsArray = [];
        this.rotateXaxis = true;
        this.isDiverging = false;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = (firstRun = true) => {
            this.dataKeys = Object.keys(this.data[0]).filter((item) => item !== 'key');
            // create the D3 stack data
            if (this.isDiverging) {
                this.dataStack = stack().keys(this.dataKeys).offset(stackOffsetDiverging)(this.data);
            }
            else {
                this.dataStack = stack().keys(this.dataKeys).order(stackOrderNone)(this.data);
            }
            // update the xScale
            this.xAxisScale.domain(this.data.map((d) => d.key));
            // update the yScale
            this.yAxisMin = min(this.dataStack, (data) => {
                return min(data, (d) => {
                    return d[0];
                });
            });
            this.yAxisMax = max(this.dataStack, (data) => {
                return max(data, (d) => {
                    return d[1];
                });
            });
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale.domain([this.yAxisMin, this.yAxisMax]).rangeRound([this.height, 0]).nice();
            this.xAxis
                .transition()
                .duration(1000) // 1000
                .call(this.xAxisCall);
            this.yAxis
                .transition()
                .duration(1000) // 1000
                .call(this.yAxisCall);
            // update the grids
            if (!this.hideXGrid) {
                this.xGrid
                    .transition()
                    .duration(1000) // 1000
                    .call(this.xGridCall);
            }
            if (!this.hideYGrid) {
                this.yGrid
                    .transition()
                    .duration(1000) // 1000
                    .call(this.yGridCall);
            }
            if (this.isDiverging) {
                this.centerline
                    .transition()
                    .duration(1000) // 1000
                    .attr('transform', `translate(0,  ${this.yAxisScale(0)})`);
            }
            // add gray bars
            if (!this.hideGrayBars) {
                this.grayBars
                    .selectAll('.gray-bar')
                    .data(this.data)
                    .join((enter) => enter
                    .append('rect')
                    .attr('class', 'gray-bar')
                    .attr('x', (d) => this.xAxisScale(d.key))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height), (update) => update
                    .transition()
                    .duration((d, i, n) => (firstRun ? 0 : 1000))
                    .attr('x', (d) => this.xAxisScale(d.key))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height)
                    .selection(), (exit) => exit.remove());
            }
            // add colored bars
            const barGroups = this.bars
                .selectAll('.bar-group')
                .data(this.dataStack)
                .join((enter) => enter
                .append('g')
                .attr('class', 'bar-group')
                .attr('fill', (d) => this.colorRange(d.index)), (update) => update.attr('fill', (d) => this.colorRange(d.index)), (exit) => exit.remove());
            barGroups
                .selectAll('.bar')
                .data((d) => d)
                .join((enter) => enter
                .append('rect')
                .attr('class', 'bar')
                .classed('bar-divided', this.type !== 'high')
                .classed('bar-divided-low', this.type === 'low')
                .attr('x', (d, i) => {
                let x;
                if (this.type === 'medium') {
                    x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 8) * 3;
                }
                else {
                    x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 4) * 1;
                }
                return x;
            })
                .attr('y', (d) => this.yAxisScale(d[0]))
                .attr('width', (d) => {
                let width;
                if (this.type === 'medium') {
                    width = this.xAxisScale.bandwidth() / 4;
                }
                else {
                    width = this.xAxisScale.bandwidth() / 2;
                }
                return width;
            })
                .attr('height', 0)
                .call((enter) => {
                enter
                    .transition()
                    .duration((d, i, n) => (firstRun ? 0 : 500))
                    .delay((d, i, n) => (firstRun ? 0 : 750))
                    .attr('y', (d) => this.yAxisScale(d[1]))
                    .attr('height', (d) => {
                    return this.yAxisScale(d[0]) - this.yAxisScale(d[1]);
                });
                return enter;
            }), (update) => update.call((update) => {
                update
                    .transition()
                    .duration(1000)
                    .attr('width', (d) => {
                    let width;
                    if (this.type === 'medium') {
                        width = this.xAxisScale.bandwidth() / 4;
                    }
                    else {
                        width = this.xAxisScale.bandwidth() / 2;
                    }
                    return width;
                })
                    .attr('x', (d, i) => {
                    let x;
                    if (this.type === 'medium') {
                        x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 8) * 3;
                    }
                    else {
                        x = this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 4) * 1;
                    }
                    return x;
                })
                    .attr('y', (d) => this.yAxisScale(d[1]))
                    .attr('height', (d) => this.yAxisScale(d[0]) - this.yAxisScale(d[1]))
                    .selection();
                return update;
            }), (exit) => exit.remove());
            // mouseover bars
            this.mouseBars
                .selectAll('.mouseover-bar')
                .data(this.data)
                .join((enter) => enter
                .append('rect')
                .attr('class', 'mouseover-bar')
                .style('opacity', 0)
                .attr('x', (d) => this.xAxisScale(d.key))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height), (update) => update
                .attr('pointer-events', 'none')
                .attr('x', (d) => this.xAxisScale(d.key))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height)
                .transition()
                .selection()
                .attr('pointer-events', 'auto'), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove())
                .datum((d, i) => {
                return { data: d, index: i };
            })
                .on('mouseover', (event, data) => this.barMouseOver(event, data))
                .on('mouseout', (event, data) => this.barMouseOut())
                .on('click', (event, data) => this.barMouseClick(event, data));
            this.bars.raise();
            this.xAxis.raise();
            this.mouseBars.raise();
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.dataStack)
                    .join((enter) => {
                    const li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (d) => this.colorRange(d.index));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html((d) => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d.key);
                            case 'time':
                                const parsedTime = isoParse(d.key);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
                        }
                    });
                    return li;
                }, (update) => {
                    update.select('.legend-label').html((d) => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d.key);
                            case 'time':
                                const parsedTime = isoParse(d.key);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
                        }
                    });
                    return update;
                }, (exit) => exit.remove())
                    .datum((d, i) => {
                    return { data: this.data, index: i };
                })
                    .on('mouseover', (event, data) => this.legendMouseOver(event, data))
                    .on('mouseout', () => this.legendMouseOut())
                    .on('click', (event, data) => this.legendMouseClick(event, data));
            }
        };
        this.barMouseOver = (event, data) => {
            this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((d, i) => {
                return i !== data.index;
            })
                .classed('inactive', true);
            this.tooltipShow(event, data);
            this.hovered.emit({ event, data });
        };
        this.barMouseOut = () => {
            this.chart.selectAll('.bar').classed('inactive', false);
            this.tooltipHide();
        };
        this.barMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.legendMouseOver = (event, data) => {
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== data.index)
                .classed('inactive', true);
            this.chart
                .selectAll('.bar-group')
                .filter((d, i) => i !== data.index)
                .classed('inactive', true);
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.bar-group').classed('inactive', false);
            this.tooltipHide();
        };
        this.legendMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.xAxisFormatter = (item) => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return this.xAxisFormat(item);
                case 'time':
                    const parseDate = isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        };
        this.tooltipShow = (event, data) => {
            const scroll = this._scroll.getScrollPosition();
            const mouserectDimensions = event.currentTarget.getBoundingClientRect();
            const clientWidth = document.body.clientWidth - 10;
            let dimensionCalculated;
            let tooltipDimensions;
            let tooltipOffsetHeight;
            // const yPosition = event.currentTarget.getBoundingClientRect();
            let yMaxBar = 0;
            let yPosition;
            let xPosition;
            // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
            this.tooltip.select('.tooltip-header').html((d) => {
                switch (this.tooltipHeadingFormatType) {
                    case 'time':
                        const parseDate = isoParse(data.data.key);
                        return `${this.tooltipHeadingFormat(parseDate)}${this.tooltipHeadingSuffix}`;
                    default:
                        return `${data.data.key}${this.tooltipHeadingSuffix}`;
                }
            });
            this.tooltip.select('.tooltip-header-value').html((d) => {
                let total = 0;
                Object.keys(data.data).map((e) => {
                    if (e !== 'key') {
                        total = total + data.data[e];
                    }
                });
                return this.tooltipHeadingValueFormat(total);
            });
            this.tooltip
                .select('.tooltip-table')
                .select('tbody')
                .html((d) => {
                let html = ``;
                Object.keys(data.data)
                    .filter((key) => key !== 'key') // remove the 'key' property
                    .map((key, index) => {
                    let label;
                    let value = data.data[key];
                    switch (this.tooltipLabelFormatType) {
                        case 'time':
                            const parseDate = isoParse(key);
                            label = this.tooltipHeadingFormat(parseDate);
                            break;
                        default:
                            label = key;
                    }
                    switch (this.tooltipValueFormatType) {
                        case 'number':
                            if (value === null || value === undefined) {
                                value = '';
                            }
                            else {
                                value = this.tooltipValueFormat(data.data[key]);
                            }
                            break;
                        default:
                            value = data.data[key];
                    }
                    html += `
              <tr class='tooltip-item'>
                <td style="color: ${this.colorRange(index)}">
                  <span class="pbds-tooltip-key"></span>
                </td>
                <td class="tooltip-label pr-2 text-nowrap">${label}</td>
                <td class="tooltip-value text-right text-nowrap">${value}</td>
              </tr>
            `;
                });
                return html;
            });
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
                .selectAll('.bar')
                .filter((d, i) => {
                return i === data.index;
            })
                .each((d, i) => {
                yMaxBar = d[1] > yMaxBar ? d[1] : yMaxBar;
            })
                .filter((d, i) => {
                return d[1] === yMaxBar;
            })
                .node()
                .getBoundingClientRect();
            // set the tooltip styles
            this.tooltip.style('top', `${yPosition.top - tooltipOffsetHeight / 2 + scroll[1]}px`);
            this.tooltip.style('left', xPosition);
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.yAxisFormatter = (item) => {
            switch (this.yAxisFormatType) {
                case 'number':
                    return this.yAxisFormat(item);
                case 'time':
                    const parseDate = isoParse(item);
                    return this.yAxisFormat(parseDate);
                default:
                    return item;
            }
        };
    }
    ngOnInit() {
        // extract keys for stack data
        this.dataKeys = Object.keys(this.data[0]).filter((item) => item !== 'key');
        // create the D3 stack data
        if (this.isDiverging) {
            this.dataStack = stack().keys(this.dataKeys).offset(stackOffsetDiverging)(this.data);
        }
        else {
            this.dataStack = stack().keys(this.dataKeys).order(stackOrderNone)(this.data);
        }
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
        this.xAxisTitleMargin = this.xAxisTitle ? 30 : 0;
        // adjust margin if xAxis hidden
        //if (this.hideXAxis) this.margin.bottom = 10; // need small margin for yAxis with 0 tick label
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
        const colors = this.customColor ? this.colorsArray : this._dataviz.getColors(false, this.theme);
        this.colorRange = scaleOrdinal().range(colors);
        // this.colorRange = d3_scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
        // X AXIS
        this.xAxisScale = scaleBand()
            .domain(this.data.map((d) => d.key))
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
        // X AXIS TITLE
        if (this.xAxisTitle) {
            this.svg
                .append('text')
                .attr('class', 'axis-title')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${this.svg.attr('width') / 2 - this.margin.left / 2 - this.margin.right / 2}, ${+this.height + +this.margin.top + (this.hideXAxis ? 20 : 40)})`)
                .text(this.xAxisTitle);
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
        this.yAxisMin = min(this.dataStack, (data) => {
            return min(data, (d) => {
                return d[0];
            });
        });
        this.yAxisMax = max(this.dataStack, (data) => {
            return max(data, (d) => {
                return d[1];
            });
        });
        this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
        this.yAxisScale = scaleLinear().domain([this.yAxisMin, this.yAxisMax]).nice().rangeRound([this.height, 0]);
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
        if (this.isDiverging) {
            this.centerline = this.svg
                .append('line')
                .attr('class', 'centerline')
                .attr('x2', +this.width - this.margin.right - this.margin.left)
                .attr('transform', `translate(0,  ${this.yAxisScale(0)})`);
        }
        else {
            this.svg.selectAll('.centerline').remove();
        }
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
            this.tooltip.append('table').attr('class', 'tooltip-table text-left w-100').append('tbody');
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
        }
        this.updateChart();
    }
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart(false);
        }
    }
}
PbdsDatavizBarStackedComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBarStackedComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBarStackedComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizBarStackedComponent, selector: "pbds-dataviz-bar-stacked", inputs: { data: "data", width: "width", height: "height", type: "type", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", hideXAxis: "hideXAxis", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", xAxisTitle: "xAxisTitle", yAxisFormatType: "yAxisFormatType", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", yAxisMaxBuffer: "yAxisMaxBuffer", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", tooltipHeadingFormatType: "tooltipHeadingFormatType", tooltipHeadingFormatString: "tooltipHeadingFormatString", tooltipHeadingSuffix: "tooltipHeadingSuffix", tooltipHeadingValueFormatType: "tooltipHeadingValueFormatType", tooltipHeadingValueFormatString: "tooltipHeadingValueFormatString", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", theme: "theme", customColor: "customColor", colorsArray: "colorsArray", totalSavings: "totalSavings", rotateXaxis: "rotateXaxis", isDiverging: "isDiverging" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-stacked-bar": "this.stackedBarClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBarStackedComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-bar-stacked', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], stackedBarClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-stacked-bar']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], type: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], hideXAxis: [{
                type: Input
            }], xAxisFormatType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], xAxisTitle: [{
                type: Input
            }], yAxisFormatType: [{
                type: Input
            }], yAxisFormatString: [{
                type: Input
            }], yAxisTicks: [{
                type: Input
            }], yAxisMaxBuffer: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendPosition: [{
                type: Input
            }], legendLabelFormatType: [{
                type: Input
            }], legendLabelFormatString: [{
                type: Input
            }], tooltipHeadingFormatType: [{
                type: Input
            }], tooltipHeadingFormatString: [{
                type: Input
            }], tooltipHeadingSuffix: [{
                type: Input
            }], tooltipHeadingValueFormatType: [{
                type: Input
            }], tooltipHeadingValueFormatString: [{
                type: Input
            }], tooltipLabelFormatType: [{
                type: Input
            }], tooltipLabelFormatString: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], theme: [{
                type: Input
            }], customColor: [{
                type: Input
            }], colorsArray: [{
                type: Input
            }], totalSavings: [{
                type: Input
            }], rotateXaxis: [{
                type: Input
            }], isDiverging: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });

class PbdsDatavizMetricIndicatorComponent {
    constructor() {
        this.value = 0;
        this.class = '';
        this.indicator = 'flat';
        this.inverse = false;
    }
    get hostClasses() {
        return ['metric-block-indicator', this.indicator, this.inverse ? 'inverse' : '', this.class].join(' ');
    }
}
PbdsDatavizMetricIndicatorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizMetricIndicatorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizMetricIndicatorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizMetricIndicatorComponent, selector: "pbds-dataviz-metric-indicator", inputs: { value: "value", class: "class", indicator: "indicator", inverse: "inverse" }, host: { properties: { "class": "this.hostClasses" } }, ngImport: i0, template: `
    <span>{{ value }}</span>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizMetricIndicatorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-metric-indicator', template: `
    <span>{{ value }}</span>
  ` }]
        }], propDecorators: { value: [{
                type: Input
            }], class: [{
                type: Input
            }], indicator: [{
                type: Input
            }], inverse: [{
                type: Input
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }] } });

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
        this.infoMessage = null;
        this.hideValueMargin = false;
        this.isPercentUnit = false;
        this.isUnit = false;
    }
    get hostClasses() {
        return [
            'metric-block',
            this.centered ? 'metric-block-centered' : '',
            this.centeredText ? 'metric-block-centered-text' : '',
            this.vertical ? 'metric-block-vertical' : '',
            this.class
        ].join(' ');
    }
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
PbdsDatavizMetricBlockComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizMetricBlockComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizMetricBlockComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizMetricBlockComponent, selector: "pbds-dataviz-metric-block", inputs: { class: "class", heading: "heading", value: "value", unit: "unit", description: "description", centered: "centered", centeredText: "centeredText", vertical: "vertical", infoMessage: "infoMessage" }, host: { properties: { "class": "this.hostClasses" } }, queries: [{ propertyName: "indicatorRef", first: true, predicate: PbdsDatavizMetricIndicatorComponent, descendants: true, static: true }], ngImport: i0, template: `
    <div class="metric-block-inner">
      <div *ngIf="heading" class="metric-block-heading">
        {{ heading }}
        <i
          *ngIf="infoMessage"
          class="pbi-icon-mini pbi-info-circle-open ml-1 align-middle"
          ngbTooltip="{{ infoMessage }}"
          container="body"
        ></i>
      </div>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2$1.NgbTooltip, selector: "[ngbTooltip]", inputs: ["animation", "autoClose", "placement", "popperOptions", "triggers", "positionTarget", "container", "disableTooltip", "tooltipClass", "openDelay", "closeDelay", "ngbTooltip"], outputs: ["shown", "hidden"], exportAs: ["ngbTooltip"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizMetricBlockComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-metric-block', template: `
    <div class="metric-block-inner">
      <div *ngIf="heading" class="metric-block-heading">
        {{ heading }}
        <i
          *ngIf="infoMessage"
          class="pbi-icon-mini pbi-info-circle-open ml-1 align-middle"
          ngbTooltip="{{ infoMessage }}"
          container="body"
        ></i>
      </div>
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
  ` }]
        }], propDecorators: { class: [{
                type: Input
            }], heading: [{
                type: Input
            }], value: [{
                type: Input
            }], unit: [{
                type: Input
            }], description: [{
                type: Input
            }], centered: [{
                type: Input
            }], centeredText: [{
                type: Input
            }], vertical: [{
                type: Input
            }], infoMessage: [{
                type: Input
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }], indicatorRef: [{
                type: ContentChild,
                args: [PbdsDatavizMetricIndicatorComponent, { static: true }]
            }] } });

class PbdsDatavizBubbleMapComponent {
    constructor(_element, _scroll, _dataviz) {
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
        this.tooltipHeaderSuffix = '';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = () => {
            // bubbles
            this.bubbleContainer
                .selectAll('circle')
                .data(this.data)
                .join((enter) => enter
                .append('circle')
                .attr('class', 'dot-circle')
                .classed('solid', this.dot)
                .attr('cx', (d) => this.projection([d.longitude, d.latitude])[0])
                .attr('cy', (d) => this.projection([d.longitude, d.latitude])[1])
                .attr('r', (d) => (!this.dot ? Math.sqrt(this.bubbleRadius(d.value)) : `${this.dotSize}px`)), (update) => update
                .transition()
                .duration(1000)
                .attr('cx', (d) => this.projection([d.longitude, d.latitude])[0])
                .attr('cy', (d) => this.projection([d.longitude, d.latitude])[1])
                .attr('r', (d) => (!this.dot ? Math.sqrt(this.bubbleRadius(d.value)) : `${this.dotSize}px`))
                .transition()
                .selection()
                .attr('pointer-events', 'auto'), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove());
            if (!this.hideTooltip) {
                this.bubbleContainer
                    .selectAll('circle')
                    .on('mouseover', (event, data) => this.bubbleMouseOver(event, data))
                    .on('mouseout', (event, data) => this.bubbleMouseOut(event, data))
                    .on('click', (event, data) => this.bubbleMouseClick(event, data));
                // bubble text
                if (this.type !== 'high' && !this.dot) {
                    this.bubbleContainer
                        .selectAll('text')
                        .data(this.data)
                        .join((enter) => enter
                        .append('text')
                        .text((d) => (this.bubbleLabelFormat ? this.bubbleLabelFormat(d.value) : d.value))
                        .attr('class', 'dot-text')
                        .style('fill', this.textColor)
                        .style('font-size', (d) => `${Math.round(this.fontRange(d.value))}px`)
                        .attr('x', (d) => this.projection([d.longitude, d.latitude])[0])
                        .attr('y', (d) => this.projection([d.longitude, d.latitude])[1])
                        .attr('dy', '.4em'), (update) => update
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .text((d) => (this.bubbleLabelFormat ? this.bubbleLabelFormat(d.value) : d.value))
                        .style('font-size', (d) => `${Math.round(this.fontRange(d.value))}px`)
                        .attr('x', (d) => this.projection([d.longitude, d.latitude])[0])
                        .attr('y', (d) => this.projection([d.longitude, d.latitude])[1])
                        .attr('dy', '.4em')
                        .transition()
                        .selection()
                        .attr('pointer-events', 'auto'), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove());
                }
            }
        };
        this.bubbleMouseOver = (event, data) => {
            this.chart.selectAll('.dot-circle').classed('inactive', true);
            select(event.currentTarget).classed('active', true).classed('inactive', false);
            this.tooltipShow(event, data);
            this.hovered.emit({ event, data });
        };
        this.bubbleMouseOut = (event, data) => {
            this.chart.selectAll('.dot-circle').classed('active', false).classed('inactive', false);
            this.tooltipHide();
        };
        this.bubbleMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.tooltipShow = (event, data) => {
            const dimensions = event.currentTarget.getBoundingClientRect();
            const scroll = this._scroll.getScrollPosition();
            this.tooltip.select('.tooltip-header').html((d) => `${data.label}${this.tooltipHeaderSuffix}`);
            if (!this.hideTooltipValue) {
                this.tooltip
                    .select('.tooltip-value')
                    .html((d) => (this.tooltipValueFormat ? `${this.tooltipValueFormat(data.value)}` : `${data.value}`));
            }
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight + 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight}px`); //
            this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
    }
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
        this.geoPath = geoPath().projection(this.projection);
        // bubble radius range
        if (this.data && !this.dot) {
            this.bubbleRadius = scaleLinear()
                .range(this.bubbleSizeRange)
                .domain([min(this.data, (d) => +d.value), max(this.data, (d) => +d.value)]);
            // font range
            this.fontRange = scaleLinear()
                .range(this.textSizeRange)
                .domain([min(this.data, (d) => +d.value), max(this.data, (d) => +d.value)]);
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
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom}`)
            .append('g')
            .attr('class', 'container');
        // map
        this.svg
            .append('g')
            .attr('class', 'map')
            .selectAll('path')
            .data(this.topojsonFeature.features)
            .join((enter) => enter.append('path').attr('class', 'feature').attr('d', this.geoPath));
        // borders
        this.svg
            .append('path')
            .attr('class', 'mesh')
            .datum(topojson.mesh(this.topojson, this.topojson.objects[this.feature], (a, b) => a !== b))
            .attr('d', this.geoPath);
        this.bubbleContainer = this.svg.append('g').attr('class', 'dots').style('color', this.color);
        this.updateChart();
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
PbdsDatavizBubbleMapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBubbleMapComponent, deps: [{ token: i0.ElementRef }, { token: i2.ViewportScroller }, { token: PbdsDatavizService }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBubbleMapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizBubbleMapComponent, selector: "pbds-dataviz-bubble-map", inputs: { data: "data", topojson: "topojson", feature: "feature", projectionType: "projectionType", scale: "scale", center: "center", width: "width", height: "height", type: "type", dot: "dot", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", color: "color", textColor: "textColor", textSizeRange: "textSizeRange", dotSize: "dotSize", bubbleSizeRange: "bubbleSizeRange", bubbleLabelFormatType: "bubbleLabelFormatType", bubbleLabelFormatString: "bubbleLabelFormatString", hideTooltip: "hideTooltip", hideTooltipValue: "hideTooltipValue", tooltipHeaderSuffix: "tooltipHeaderSuffix", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-bubble-map": "this.bubbleMapClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBubbleMapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-bubble-map', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i2.ViewportScroller }, { type: PbdsDatavizService }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], bubbleMapClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-bubble-map']
            }], data: [{
                type: Input
            }], topojson: [{
                type: Input
            }], feature: [{
                type: Input
            }], projectionType: [{
                type: Input
            }], scale: [{
                type: Input
            }], center: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], type: [{
                type: Input
            }], dot: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], color: [{
                type: Input
            }], textColor: [{
                type: Input
            }], textSizeRange: [{
                type: Input
            }], dotSize: [{
                type: Input
            }], bubbleSizeRange: [{
                type: Input
            }], bubbleLabelFormatType: [{
                type: Input
            }], bubbleLabelFormatString: [{
                type: Input
            }], hideTooltip: [{
                type: Input
            }], hideTooltipValue: [{
                type: Input
            }], tooltipHeaderSuffix: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });

class PbdsDatavizHeatmapComponent {
    constructor(_dataviz, _element, _scroll) {
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = () => {
            this.svg
                .selectAll('rect')
                .data(this.data)
                .join((enter) => enter
                .append('rect')
                .attr('class', 'block')
                .classed('empty', (d) => d.value === undefined || d.value === null)
                .attr('x', (d) => this.xAxisScale(d.xLabel))
                .attr('y', (d) => this.yAxisScale(d.yLabel))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.yAxisScale.bandwidth())
                .style('fill', (d) => this.colorRange(d.value)), (update) => update.call((update) => {
                update
                    .classed('empty', (d) => d.value === undefined || d.value === null)
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(1000)
                    .attr('x', (d) => this.xAxisScale(d.xLabel))
                    .attr('y', (d) => this.yAxisScale(d.yLabel))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.yAxisScale.bandwidth())
                    .style('fill', (d) => this.colorRange(d.value))
                    .transition()
                    .selection()
                    .attr('pointer-events', 'auto');
                return update;
            }), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove())
                .on('mouseover', (event, data) => this.blockMouseOver(event, data))
                .on('mouseout', (event, data) => this.blockMouseOut())
                .on('click', (event, data) => this.blockMouseClick(event, data));
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.colorDomain)
                    .join((enter) => {
                    const li = enter
                        .append('li')
                        .attr('class', 'legend-item')
                        .attr('data-index', (d, i) => {
                        return i;
                    });
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (d) => this.colorRange(d));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html((d) => {
                        let label = d;
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                label = this.legendLabelFormat(d);
                                break;
                        }
                        return `&ge; ${label}`;
                    });
                    return li;
                }, (update) => update
                    .select('.legend-label')
                    .attr('data-index', (d, i) => {
                    return i;
                })
                    .html((d) => {
                    // console.log('HTML D: ', d);
                    let label = d;
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            label = this.legendLabelFormat(d);
                            break;
                    }
                    return `&ge; ${label}`;
                }), (exit) => exit.remove())
                    .on('mouseover', (event, data) => this.legendMouseOver(event, data))
                    .on('mouseout', () => this.legendMouseOut())
                    .on('click', (event, data) => this.legendMouseClick(event, data));
            }
        };
        this.blockMouseOver = (event, data) => {
            // console.log(data.value, event, data, index, nodes);
            if (data.value !== null) {
                this.tooltipShow(event, data);
            }
            this.hovered.emit({ event, data });
        };
        this.blockMouseOut = () => {
            this.tooltipHide();
        };
        this.blockMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.legendMouseOver = (event, data) => {
            const legendItems = this.chart.selectAll('.legend-item');
            const hovered = select(event.currentTarget);
            const hoveredIndex = +hovered.attr('data-index');
            legendItems.classed('inactive', true);
            hovered.classed('inactive', false);
            const nodes = legendItems.nodes();
            this.chart
                .selectAll('.block')
                .filter((d, i) => {
                if (hoveredIndex + 1 === nodes.length) {
                    return d.value < data;
                }
                else {
                    const nextNodeData = +select(nodes[+hoveredIndex + 1]).data();
                    return d.value < data || d.value >= nextNodeData;
                }
            })
                .classed('inactive', true);
            this.hovered.emit({ event, data: data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.block').classed('inactive', false);
        };
        this.legendMouseClick = (event, data) => {
            this.clicked.emit({ event, data: data });
        };
        this.tooltipShow = (event, data) => {
            // console.log('TOOLTIP: ', data, index, node);
            const dimensions = event.currentTarget.getBoundingClientRect();
            const scroll = this._scroll.getScrollPosition();
            let yLabel;
            let xLabel;
            switch (this.tooltipYLabelFormatType) {
                case 'number':
                    yLabel = this.tooltipYLabelFormat(data.yLabel);
                    break;
                case 'time':
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
                    const parsedTime = isoParse(data.xLabel);
                    xLabel = this.tooltipXLabelFormat(parsedTime);
                    break;
                default:
                    xLabel = `${data.xLabel}${this.tooltipXLabelFormatString}`;
            }
            const value = this.tooltipValueFormat === null
                ? `<div class="tooltip-value">${data.value}</div>`
                : `<div class="tooltip-value">${this.tooltipValueFormat(data.value)}</div>`;
            this.tooltip.html(`
        ${yLabel} : ${xLabel}<br>
        ${value}
      `);
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight + 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight}px`); //
            this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            this.tooltip.style('opacity', 1);
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.xAxisFormatter = (item) => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return this.xAxisFormat(item);
                case 'time':
                    const parseDate = isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        };
        this.yAxisFormatter = (item) => {
            switch (this.yAxisFormatType) {
                case 'number':
                    return this.yAxisFormat(item);
                case 'time':
                    const parseDate = isoParse(item);
                    return this.yAxisFormat(parseDate);
                default:
                    return item;
            }
        };
    }
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
        const colors = this._dataviz.getColors(true, this.theme).slice().reverse();
        const colorDomain = [
            +min(this.data, (d) => d.value),
            +max(this.data, (d) => d.value)
        ];
        const colorValues = this.data.map((d) => d.value);
        switch (this.scale) {
            case 'threshold':
                this.colorRange = scaleThreshold().domain(this.domain).range(colors);
                this.colorDomain = this.colorRange.domain();
                break;
            case 'quantile':
                this.colorRange = scaleQuantile().domain(colorValues).range(colors);
                this.colorDomain = this.colorRange.quantiles();
                break;
            case 'quantize':
                this.colorRange = scaleQuantize().domain(colorDomain).range(colors);
                this.colorDomain = this.colorRange.thresholds();
                break;
        }
        // console.log(colors, colorDomain, colorValues, this.scale, this.colorRange, this.colorDomain);
        // define axis labels
        const xAxisLabels = [...new Set(this.data.map((d) => d.xLabel))];
        const yAxisLabels = [...new Set(this.data.map((d) => d.yLabel))].reverse();
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
        this.yAxisScale = scaleBand().domain(yAxisLabels).rangeRound([this.height, 0]).paddingInner(0.1);
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
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    }
}
PbdsDatavizHeatmapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizHeatmapComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizHeatmapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizHeatmapComponent, selector: "pbds-dataviz-heatmap", inputs: { data: "data", width: "width", height: "height", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", scale: "scale", domain: "domain", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", yAxisFormatType: "yAxisFormatType", yAxisFormatString: "yAxisFormatString", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", tooltipXLabelFormatType: "tooltipXLabelFormatType", tooltipXLabelFormatString: "tooltipXLabelFormatString", tooltipYLabelFormatType: "tooltipYLabelFormatType", tooltipYLabelFormatString: "tooltipYLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", theme: "theme" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-heatmap": "this.heatmapClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizHeatmapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-heatmap', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], heatmapClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-heatmap']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], scale: [{
                type: Input
            }], domain: [{
                type: Input
            }], xAxisFormatType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], yAxisFormatType: [{
                type: Input
            }], yAxisFormatString: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendPosition: [{
                type: Input
            }], legendLabelFormatType: [{
                type: Input
            }], legendLabelFormatString: [{
                type: Input
            }], tooltipXLabelFormatType: [{
                type: Input
            }], tooltipXLabelFormatString: [{
                type: Input
            }], tooltipYLabelFormatType: [{
                type: Input
            }], tooltipYLabelFormatString: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], theme: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });

class PbdsDatavizChoroplethMapComponent {
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
        this.tooltipHeaderSuffix = '';
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
        this.updateChart = () => {
            this.svg
                .select('.map')
                .selectAll('path')
                .style('fill', (d, i) => {
                const match = this.data.find((obj) => obj[this.dataField] === d[this.dataField]);
                if (match) {
                    return this.colorRange(match.value);
                }
            })
                .classed('hasData', (d, i) => {
                return this.data.some((obj) => obj[this.dataField] === d[this.dataField]);
            });
            if (!this.hideTooltip) {
                this.svg
                    .select('.map')
                    .selectAll('path')
                    .on('mouseover', (event, data) => this.featureMouseOver(event, this.data.find((obj) => obj[this.dataField] === data[this.dataField])))
                    .on('mouseout', (event, data) => this.featureMouseOut(event, this.data))
                    .on('mousemove', (event, data) => this.tooltipMove(event))
                    .on('click', (event, data) => this.featureMouseClick(event, this.data.find((obj) => obj[this.dataField] === data[this.dataField])));
            }
        };
        this.featureMouseOver = (event, data) => {
            if (data) {
                this.tooltipShow(event, data);
                this.hovered.emit({ event, data });
            }
        };
        this.featureMouseOut = (event, data) => {
            this.tooltipHide();
        };
        this.featureMouseClick = (event, data) => {
            if (data) {
                this.clicked.emit({ event, data });
            }
        };
        this.tooltipShow = (event, data) => {
            // console.log('TOOLTIP: ', data, node);
            this.tooltipSetPosition(event);
            if (data.label) {
                this.tooltip.select('.tooltip-header').html((d) => `${data.label}${this.tooltipHeaderSuffix}`);
            }
            this.tooltip
                .select('.tooltip-value')
                .html((d) => (this.tooltipValueFormat ? `${this.tooltipValueFormat(data.value)}` : `${data.value}`));
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.tooltipMove = (event) => {
            this.tooltipSetPosition(event);
        };
        this.tooltipSetPosition = (event) => {
            const mouse = pointer(event, this.chart.node());
            const mouseLeft = +mouse[0];
            const mouseTop = +mouse[1];
            const geometry = this.chart.node().getBoundingClientRect();
            const geometryLeft = +geometry.left;
            const geometryTop = +geometry.top;
            const scroll = this._scroll.getScrollPosition();
            // const scrollLeft = +scroll[0];
            const scrollTop = +scroll[1];
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            this.tooltip.style('top', `${scrollTop + mouseTop + geometryTop - tooltipOffsetHeight - 14}px`);
            this.tooltip.style('left', `${mouseLeft + geometryLeft - tooltipOffsetWidth}px`); //
        };
        this.legend = (g) => {
            const length = this.colorRange.range().length;
            // console.log(this.colorRange.range().length, this.colorDomain);
            const x = scaleLinear()
                .domain([1, length - 1])
                .rangeRound([+this.legendWidth / length, (this.legendWidth * (length - 1)) / length]);
            g.attr('class', 'legend')
                .selectAll('rect')
                .data(this.colorRange.range())
                .join('rect')
                .attr('height', 8)
                .attr('x', (d, i) => x(i))
                .attr('width', (d, i) => x(i + 1) - x(i))
                .attr('fill', (d) => d);
            if (this.legendLabel) {
                g.append('text').attr('y', -6).attr('text-anchor', 'start').attr('class', 'legend-label').text(this.legendLabel);
            }
            g.call(axisBottom(x)
                .tickSize(13)
                .tickValues(range(1, length))
                .tickFormat((i) => this.legendValueFormat ? `${this.legendValueFormat(this.colorDomain[i - 1])}` : `${this.colorDomain[i - 1]}`))
                .select('.domain')
                .remove();
        };
    }
    ngOnInit() {
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        // color range
        const colors = this._dataviz.getColors(true, this.theme).slice().reverse();
        const colorDomain = [+min(this.data, (d) => d.value), +max(this.data, (d) => d.value)];
        const colorValues = this.data.map((d) => d.value);
        switch (this.colorScale) {
            case 'threshold':
                this.colorRange = scaleThreshold().domain(this.domain).range(colors);
                this.colorDomain = this.colorRange.domain();
                break;
            case 'quantile':
                this.colorRange = scaleQuantile().domain(colorValues).range(colors);
                this.colorDomain = this.colorRange.quantiles();
                break;
            case 'quantize':
                this.colorRange = scaleQuantize().domain(colorDomain).range(colors);
                this.colorDomain = this.colorRange.thresholds();
                break;
        }
        // create formatters
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        this.legendValueFormat = this._dataviz.d3Format(this.legendValueFormatType, this.legendValueFormatString);
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
        this.topojsonFeature = topojson.feature(this.topojson, this.topojson.objects[this.feature]);
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
            .join((enter) => enter.append('path').attr('class', 'feature').attr('d', this.geoPath));
        // borders
        this.svg
            .append('path')
            .attr('class', 'mesh')
            .datum(topojson.mesh(this.topojson, this.topojson.objects[this.mesh || this.feature], (a, b) => a !== b))
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
PbdsDatavizChoroplethMapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizChoroplethMapComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizChoroplethMapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizChoroplethMapComponent, selector: "pbds-dataviz-choropleth-map", inputs: { data: "data", topojson: "topojson", feature: "feature", projectionType: "projectionType", dataField: "dataField", mesh: "mesh", scale: "scale", center: "center", width: "width", height: "height", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", theme: "theme", colorScale: "colorScale", domain: "domain", hideTooltip: "hideTooltip", tooltipHeaderSuffix: "tooltipHeaderSuffix", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", hideLegend: "hideLegend", legendWidth: "legendWidth", legendLabel: "legendLabel", legendValueFormatType: "legendValueFormatType", legendValueFormatString: "legendValueFormatString", legendLeft: "legendLeft", legendTop: "legendTop" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-choropleth-map": "this.choroplethMapClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizChoroplethMapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-choropleth-map', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], choroplethMapClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-choropleth-map']
            }], data: [{
                type: Input
            }], topojson: [{
                type: Input
            }], feature: [{
                type: Input
            }], projectionType: [{
                type: Input
            }], dataField: [{
                type: Input
            }], mesh: [{
                type: Input
            }], scale: [{
                type: Input
            }], center: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], theme: [{
                type: Input
            }], colorScale: [{
                type: Input
            }], domain: [{
                type: Input
            }], hideTooltip: [{
                type: Input
            }], tooltipHeaderSuffix: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendLabel: [{
                type: Input
            }], legendValueFormatType: [{
                type: Input
            }], legendValueFormatString: [{
                type: Input
            }], legendLeft: [{
                type: Input
            }], legendTop: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });

class PbdsDatavizBarGroupedComponent {
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
        this.xAxisTitle = null;
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
        this.gradient = true;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.barMouseOver = (event, data) => {
            const node = select(event.currentTarget);
            this.chart.selectAll('.bar-group').selectAll('.bar').classed('inactive', true);
            node.classed('inactive', false).style('fill', node.attr('data-color'));
            this.tooltipShow(event, data);
            this.hovered.emit({ event, data });
        };
        this.barMouseOut = () => {
            this.chart.selectAll('.bar').classed('inactive', false).style('fill', null);
            this.tooltipHide();
        };
        this.barMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.legendMouseOver = (event, data) => {
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => d.label !== data.label)
                .classed('inactive', true);
            this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((d, i) => d.label !== data.label)
                .classed('inactive', true);
            const bar = this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((d, i) => d.label === data.label)
                .classed('inactive', null);
            const barColor = bar.attr('data-color');
            bar.style('fill', () => barColor);
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.bar-group').selectAll('.bar').classed('inactive', false).style('fill', null);
        };
        this.legendMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.tooltipShow = (event, data) => {
            const dimensions = event.currentTarget.getBoundingClientRect();
            const scroll = this._scroll.getScrollPosition();
            let label;
            switch (this.tooltipLabelFormatType) {
                case 'number':
                    label = this.tooltipLabelFormat(data.label);
                    break;
                case 'time':
                    const parsedTime = isoParse(data.label);
                    label = this.tooltipLabelFormat(parsedTime);
                    break;
                default:
                    label = data.label;
            }
            const value = this.tooltipValueFormat === null
                ? `<div class="tooltip-value">${data.value}</div>`
                : `<div class="tooltip-value">${this.tooltipValueFormat(data.value)}</div>`;
            this.tooltip.html(`
        ${label}
        ${value}
      `);
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
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
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.xAxisFormatter = (item) => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return this.xAxisFormat(item);
                case 'time':
                    const parseDate = isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        };
        this.yAxisFormatter = (item) => {
            switch (this.yAxisFormatType) {
                case 'number':
                    return this.yAxisFormat(item);
                case 'time':
                    const parseDate = isoParse(item);
                    return this.yAxisFormat(parseDate);
                default:
                    return item;
            }
        };
    }
    ngOnInit() {
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
        this.xAxisTitleMargin = this.xAxisTitle ? 30 : 0;
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
            .attr('width', () => {
            if (this.vertical) {
                return +this.width;
            }
            else {
                return +this.width + this.margin.left + this.margin.right;
            }
        })
            .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', () => {
            if (this.vertical) {
                return `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin}`;
            }
            else {
                return `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin}`;
            }
        });
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = select('body')
                .append('div')
                .attr('class', () => {
                return this.vertical ? 'pbds-tooltip south' : 'pbds-tooltip west';
            })
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
                .domain(this.data.map((d) => d.key))
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
            this.yAxisMax = max(this.data, (data) => {
                const clone = { ...data };
                delete clone.key;
                return max(Object.values(clone));
            });
            this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
            this.yAxisScale = scaleLinear().domain([0, this.yAxisMax]).nice().rangeRound([this.height, 0]);
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
            this.xAxisMax = max(this.data, (data) => {
                const clone = { ...data };
                delete clone.key;
                return max(Object.values(clone));
            });
            this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
            this.xAxisScale = scaleLinear().domain([0, this.xAxisMax]).rangeRound([0, this.width]).nice();
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
                .domain(this.data.map((d) => d.key))
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
        // X AXIS TITLE
        if (this.xAxisTitle) {
            this.svg
                .append('text')
                .attr('class', 'axis-title')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${this.svg.attr('width') / 2 - this.margin.left / 2 - this.margin.right / 2}, ${this.height + this.margin.top + (this.hideXAxis ? 20 : 40)})`)
                .text(this.xAxisTitle);
        }
    }
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
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
    updateChartVertical() {
        // update the xScale
        this.xAxisScale.domain(this.data.map((d) => d.key));
        // update the yScale
        this.yAxisMax = max(this.data, (data) => {
            const clone = { ...data };
            delete clone.key;
            return max(Object.values(clone));
        });
        this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
        this.yAxisScale.domain([0, this.yAxisMax]).rangeRound([this.height, 0]).nice();
        this.xAxis.transition().duration(1000).call(this.xAxisCall);
        this.yAxis.transition().duration(1000).call(this.yAxisCall);
        // update the grids
        // if (!this.hideXGrid) {
        //   this.xGrid
        //     .transition()
        //     .duration(1000)
        //     .call(this.xGridCall);
        // }
        if (this.showGrid) {
            this.yGrid.transition().duration(1000).call(this.yGridCall);
        }
        // update the color bar scale
        this.barScale.domain(Object.keys(this.data[0]).slice(1)).rangeRound([0, this.xAxisScale.bandwidth()]);
        this.svg
            .selectAll('.gray-bar')
            .data(this.data)
            .join((enter) => enter
            .append('rect')
            .attr('class', 'gray-bar')
            .attr('x', (d) => this.xAxisScale(d.key))
            .attr('y', (d) => this.yAxisScale(d.value))
            .attr('width', this.xAxisScale.bandwidth())
            .attr('height', this.height), (update) => update
            .transition()
            .duration(1000)
            .attr('x', (d) => this.xAxisScale(d.key))
            .attr('y', (d) => this.yAxisScale(d.value))
            .attr('width', this.xAxisScale.bandwidth())
            .attr('height', this.height)
            .selection());
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((enter) => enter
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (d, i) => {
            return `translate(${this.xAxisScale(d.key)}, 0)`;
        }), (update) => update
            .transition()
            .duration(1000)
            .attr('transform', (d, i) => {
            return `translate(${this.xAxisScale(d.key)}, 0)`;
        })
            .selection());
        this.svg
            .selectAll('.bar-group')
            // .selectAll('.bar')
            .selectChildren()
            .data((d, i) => {
            const clone = { ...d };
            delete clone.key;
            const keys = Object.keys(clone);
            const keyData = keys.map(function (key) {
                return { label: key, value: d[key], parentIndex: i };
            });
            return keyData;
        })
            .join((enter) => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', (d) => this.barFill(d))
            .attr('data-color', (d) => this.colorRange(d.label))
            .attr('data-parent-index', (d) => d.parentIndex)
            .attr('x', (d) => this.barScale(d.label))
            .attr('width', this.barScale.bandwidth())
            .attr('y', this.height)
            .attr('height', 0)
            .call((enter) => {
            return enter
                .attr('pointer-events', 'none')
                .transition()
                .duration(0) // 500
                .attr('height', (d) => this.height - this.yAxisScale(d.value))
                .attr('y', (d) => this.yAxisScale(d.value))
                .transition()
                .attr('pointer-events', 'auto');
        }), (update) => update
            .attr('pointer-events', 'none')
            .transition()
            .duration(1000)
            .attr('x', (d) => this.barScale(d.label))
            .attr('width', this.barScale.bandwidth())
            .attr('height', (d) => this.height - this.yAxisScale(d.value))
            .attr('y', (d) => this.yAxisScale(d.value))
            .transition()
            .selection()
            .attr('pointer-events', 'auto'), (exit) => exit
            .transition()
            .duration(0) // 100
            .selection()
            .attr('pointer-events', 'none')
            .attr('height', 0)
            .attr('y', this.height))
            .on('mouseover', (event, data) => this.barMouseOver(event, data))
            .on('mouseout', (event, data) => this.barMouseOut())
            .on('click', (event, data) => this.barMouseClick(event, data));
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    }
    updateChartHorizontal() {
        // update the xScale
        this.xAxisMax = max(this.data, (data) => {
            const clone = { ...data };
            delete clone.key;
            return max(Object.values(clone));
        });
        this.xAxisMax = this.xAxisMax + this.xAxisMax * this.xAxisMaxBuffer;
        this.xAxisScale.domain([0, this.xAxisMax]).rangeRound([0, this.width]).nice();
        // update the yScale
        this.yAxisScale.domain(this.data.map((d) => d.key));
        this.xAxis.transition().duration(1000).call(this.xAxisCall);
        this.yAxis.transition().duration(1000).call(this.yAxisCall);
        // update the grids
        if (this.showGrid) {
            this.xGrid.transition().duration(1000).call(this.xGridCall);
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
            .join((enter) => enter
            .append('rect')
            .attr('class', 'gray-bar')
            .attr('y', (d) => this.yAxisScale(d.key))
            .attr('width', this.width)
            .attr('height', this.yAxisScale.bandwidth()), (update) => update
            .transition()
            .duration(1000)
            .attr('y', (d) => this.yAxisScale(d.key))
            .attr('width', this.width)
            .attr('height', this.yAxisScale.bandwidth())
            .selection());
        this.svg
            .selectAll('.bar-group')
            .data(this.data)
            .join((enter) => enter
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (d, i) => {
            return `translate(0, ${this.yAxisScale(d.key)})`;
        }), (update) => update
            .transition()
            .duration(1000)
            .attr('transform', (d, i) => {
            return `translate(0, ${this.yAxisScale(d.key)})`;
        })
            .selection());
        this.svg
            .selectAll('.bar-group')
            .selectAll('.bar')
            .data((d, i) => {
            const clone = { ...d };
            delete clone.key;
            const keys = Object.keys(clone);
            const keyData = keys.map(function (key) {
                return { label: key, value: d[key], parentIndex: i };
            });
            return keyData;
        })
            .join((enter) => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', (d) => this.barFill(d, true))
            .attr('data-color', (d) => this.colorRange(d.label))
            .attr('data-parent-index', (d) => d.parentIndex)
            .attr('x', 0)
            .attr('width', 0)
            .attr('y', (d) => this.barScale(d.label))
            .attr('height', this.barScale.bandwidth())
            .call((enter) => {
            return enter
                .attr('pointer-events', 'none')
                .transition()
                .duration(0) // 500
                .attr('width', (d) => this.xAxisScale(d.value))
                .transition()
                .attr('pointer-events', 'auto');
        }), (update) => update
            .attr('pointer-events', 'none')
            .transition()
            .duration(1000)
            .attr('width', (d) => this.xAxisScale(d.value))
            .attr('height', this.barScale.bandwidth())
            .attr('y', (d) => this.barScale(d.label))
            .transition()
            .selection()
            .attr('pointer-events', 'auto'), (exit) => exit
            .transition()
            .duration(0) // 100
            .selection()
            .attr('pointer-events', 'none')
            .attr('width', 0))
            .on('mouseover', (event, data) => this.barMouseOver(event, data))
            .on('mouseout', (event, data) => this.barMouseOut())
            .on('click', (event, data) => this.barMouseClick(event, data));
        this.updateLegend();
        this.svg.selectAll('.axis').raise();
    }
    updateLegend() {
        // legend
        if (!this.hideLegend) {
            const legendData = { ...this.data[0] };
            delete legendData.key;
            const legendKeys = Object.keys(legendData).map(function (key) {
                return { label: key };
            });
            this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(legendKeys)
                .join((enter) => {
                const li = enter.append('li').attr('class', 'legend-item');
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (d) => this.colorRange(d.label));
                li.insert('span', '.legend-item')
                    .attr('class', 'legend-label')
                    .html((d) => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            const parsedTime = isoParse(d.label);
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
                            const parsedTime = isoParse(d.label);
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
    }
    barFill(d, isHorizontal = false) {
        const horizontal = isHorizontal ? '-horizontal' : '';
        const path = this._location.path();
        const url = this._location.prepareExternalUrl(path);
        const colorRange = this.colorRange(d.label);
        if (this.gradient) {
            return `url(${url}#gradient${horizontal}-${colorRange.substr(1)})`;
        }
        else {
            return colorRange;
        }
    }
}
PbdsDatavizBarGroupedComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBarGroupedComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBarGroupedComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizBarGroupedComponent, selector: "pbds-dataviz-bar-grouped", inputs: { data: "data", width: "width", height: "height", vertical: "vertical", hideXAxis: "hideXAxis", xAxisMaxBuffer: "xAxisMaxBuffer", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", xAxisTicks: "xAxisTicks", xAxisTitle: "xAxisTitle", hideYAxis: "hideYAxis", yAxisMaxBuffer: "yAxisMaxBuffer", yAxisFormatType: "yAxisFormatType", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", hideTooltip: "hideTooltip", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", showGrid: "showGrid", theme: "theme", gradient: "gradient" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-bar-grouped": "this.groupedBarClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBarGroupedComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-bar-grouped', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }, { type: i2.Location }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], groupedBarClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-bar-grouped']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], vertical: [{
                type: Input
            }], hideXAxis: [{
                type: Input
            }], xAxisMaxBuffer: [{
                type: Input
            }], xAxisFormatType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], xAxisTicks: [{
                type: Input
            }], xAxisTitle: [{
                type: Input
            }], hideYAxis: [{
                type: Input
            }], yAxisMaxBuffer: [{
                type: Input
            }], yAxisFormatType: [{
                type: Input
            }], yAxisFormatString: [{
                type: Input
            }], yAxisTicks: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendPosition: [{
                type: Input
            }], legendLabelFormatType: [{
                type: Input
            }], legendLabelFormatString: [{
                type: Input
            }], hideTooltip: [{
                type: Input
            }], tooltipLabelFormatType: [{
                type: Input
            }], tooltipLabelFormatString: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], showGrid: [{
                type: Input
            }], theme: [{
                type: Input
            }], gradient: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });

class PbdsDatavizBarSingleHorizontalComponent {
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
        this.customColor = false;
        this.colorsArray = [];
        this.gradient = true;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.isSingleData = false;
        this.isCompare = false;
        this.barPadding = 40;
        this.barMouseOver = (event, data) => {
            const node = select(event.currentTarget);
            this.chart.selectAll('.bar').classed('inactive', true);
            node.classed('inactive', false);
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => {
                // debugger;
                return i !== data.index;
            })
                .classed('inactive', true);
            this.tooltipShow(event, data.data[data.index]);
            this.hovered.emit({ event, data });
        };
        this.barMouseOut = () => {
            this.chart.selectAll('.bar').classed('inactive', false).style('fill', null);
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.tooltipHide();
        };
        this.barMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.tooltipShow = (event, data, node) => {
            const dimensions = node ? node.getBoundingClientRect() : event.currentTarget.getBoundingClientRect();
            const scroll = this._scroll.getScrollPosition();
            const percentage = data.value / sum(this.data, (d) => d.value);
            const comparePercentage = data.compareValue / sum(this.data, (d) => d.compareValue);
            let tooltipLabel = ``;
            let tooltipCompareDaterangeMargin = ``;
            let tooltipCompareDaterange = ``;
            let tooltipCompareValue = ``;
            let tooltipDaterangeMargin = ``;
            let tooltipDaterange = ``;
            let tooltipValue = `${this.nullValueText}`;
            let tooltipIndicator = '';
            // tooltip label
            if (!this.isSingleData) {
                this.tooltip.classed('pbds-tooltip-compare', null);
                switch (this.tooltipLabelFormatType) {
                    case 'number':
                        tooltipLabel = this.tooltipLabelFormat(data.label);
                        break;
                    case 'time':
                        const parsedTime = isoParse(data.label);
                        tooltipLabel = this.tooltipLabelFormat(parsedTime);
                        break;
                    default:
                        tooltipLabel = data.label;
                }
            }
            // tooltip compare daterange
            if (this.isCompare && data.compareStartDate && data.compareEndDate) {
                this.tooltip.classed('pbds-tooltip-compare', this.isCompare);
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
            this.tooltip.html(() => {
                return `
        <div class="tooltip-label font-weight-bold">${tooltipLabel}</div>
        <div class="${tooltipCompareDaterangeMargin}">${tooltipCompareDaterange}</div>
        <div class="tooltip-value font-weight-bold">${tooltipCompareValue}</div>
        <div class="${tooltipDaterangeMargin}">${tooltipDaterange}</div>
        <div class="tooltip-value"><span class="font-weight-bold">${tooltipValue}</span> <span>${tooltipIndicator}</span></div>
      `;
            });
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            const tooltipTipSize = 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight - tooltipTipSize}px`);
            if (this.data.length > 1) {
                this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            }
            else {
                this.tooltip.style('left', `${+scroll[0] - tooltipOffsetWidth + +dimensions.right}px`);
            }
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.legendMouseOver = (event, data) => {
            if (!this.hideLegendTooltip) {
                const barHover = this.svg
                    .selectAll('.bar')
                    .filter((d, i) => i === data.index)
                    .node();
                this.tooltipShow(event, data.data[data.index], barHover);
            }
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== data.index)
                .classed('inactive', true);
            this.chart
                .selectAll('.bar')
                .filter((d, i) => i !== data.index)
                .classed('inactive', true);
            // this.chart
            //   .selectAll('.bar')
            //   .filter((d, i) => i === data.index)
            //   .classed('inactive', null);
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.bar').classed('inactive', false).style('fill', null);
            // hide tooltip for zero/null values
            this.tooltipHide();
        };
        this.legendMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.xAxisFormatter = (item) => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return `${this.xAxisFormat(item)}${this.xAxisTickLabelSuffix}`;
                default:
                    return `${item}${this.xAxisTickLabelSuffix}`;
            }
        };
    }
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
        // create formatters
        this.xAxisFormat = this._dataviz.d3Format(this.xAxisFormatType, this.xAxisFormatString);
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        this.tooltipDateFormat = timeFormat$1(this.tooltipDateFormatString);
        this.tooltipPercentFormat = format$1(this.tooltipPercentFormatString);
        this.tooltipCompareChangeFormat = format$1(this.compareChangeFormatString);
        // defaults for all chart types
        this.hideXAxisZero = false;
        this.hideXAxisDomain = true;
        this.hideXAxisTicks = true;
        this.xAxisTickSize = 8;
        this.xAxisTickSizeOuter = 0;
        this.xAxisTitleMargin = this.xAxisTitle ? 30 : 0;
        if (!this.hideLegend && this.legendPosition === 'right') {
            this.width = +this.width - +this.legendWidth;
        }
        // create the chart
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', () => {
            return +this.width + this.margin.left + this.margin.right;
        })
            .attr('height', +this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', () => {
            return `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom + this.xAxisTitleMargin}`;
        });
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
            .domain([0, Math.ceil(sum(this.data, (d) => d.value))])
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
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${this.svg.attr('width') / 2 - this.margin.left / 2 - this.margin.right / 2}, ${this.height + this.margin.top + (this.hideXAxis ? 20 : 40)})`)
                // .attr('x', this.width / 2 - this.margin.left)
                // .attr('y', this.height + this.margin.top + (!this.hideXAxis ? 40 : 0))
                .text(this.xAxisTitle);
        }
        // build color ranges
        debugger;
        let colors;
        if (this.isSingleData) {
            colors = this._dataviz.createGradientDefs(this.svg, this.monochrome, this.theme, false);
        }
        else if (this.monochrome) {
            colors = this._dataviz.getColors(this.monochrome, this.theme).reverse();
        }
        else {
            colors = this.customColor ? this.colorsArray : this._dataviz.getColors(this.monochrome, this.theme);
        }
        this.colorRange = scaleOrdinal().range(colors);
        this.updateChart();
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
    updateChart() {
        this.isSingleData = this.data.length === 1 ? true : false;
        this.isCompare = Object.keys(this.data[0]).includes('compareValue');
        const sumValues = sum(this.data, (d) => d.value);
        const isLastBarZero = this.data[this.data.length - 1].value === 0 || this.data[this.data.length - 1].value === null ? true : false;
        let lastBarZeroCount = 0;
        const cloneData = [...this.data];
        let isLast = false;
        cloneData.reverse().forEach((value, index, array) => {
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
                .html((d, i) => {
                const format = format$1('.0%');
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
                .html((d, i) => {
                const format = format$1('.0%');
                return format(i * 0.25);
            });
        }
        else {
            this.xAxisScale.domain([0, Math.ceil(sumValues)]).range([0, +this.width]);
            this.xGridCall.tickValues(this.xAxisScale.ticks().filter((n) => Number.isInteger(n))); // remove decimal grid values
            this.xAxis.transition().duration(1000).call(this.xAxisCall);
            // update the grids
            if (!this.hideXGrid) {
                this.xGrid.transition().duration(1000).call(this.xGridCall);
            }
        }
        this.svg
            .selectAll('.bar')
            .data(this.data)
            .join((enter) => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('width', 0)
            .attr('height', () => {
            return this.height - this.barPadding;
        })
            .attr('fill', (d) => this.barFill(d))
            .attr('y', () => {
            return this.barPadding / 2;
        })
            .attr('x', (d, i) => {
            return this.data.slice(0, i).reduce((acc, item) => {
                // console.log(acc, item, acc + this.xAxisScale(item.value) + this.barMargin);
                return +acc + +this.xAxisScale(item.value);
            }, 1);
        })
            .attr('pointer-events', 'none')
            .call((enter) => {
            return (enter
                .transition()
                // .duration(0)
                .delay((d, i) => i * 250)
                .ease(easeLinear)
                .attr('width', (d, i) => {
                // debugger;
                if (i === this.data.length - lastBarZeroCount - 1 && isLastBarZero) {
                    return this.xAxisScale(d.value);
                }
                else if (i !== this.data.length - 1) {
                    let width = this.xAxisScale(d.value) - +this.barMargin;
                    width = Math.sign(width) === -1 ? 0 : width; // handle negative values
                    return width;
                }
                else {
                    return this.xAxisScale(d.value);
                }
            })
                .transition()
                .attr('pointer-events', 'auto'));
        }), (update) => update
            .attr('pointer-events', 'none')
            .transition()
            .duration(1000)
            .attr('width', (d, i) => {
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
        })
            .attr('x', (d, i) => {
            return this.data.slice(0, i).reduce((acc, item) => {
                return acc + +this.xAxisScale(item.value);
            }, 0);
        })
            .transition()
            .selection()
            .attr('pointer-events', 'auto'), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove())
            .datum((d, i) => {
            return { data: this.data, index: i };
        })
            .on('mouseover', (event, data) => this.barMouseOver(event, data))
            .on('mouseout', (event, data) => this.barMouseOut())
            .on('click', (event, data) => this.barMouseClick(event, data));
        if (!this.hideLegend) {
            this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(this.data)
                .join((enter) => {
                const li = enter.append('li').attr('class', 'legend-item').classed('align-items-start', this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', (d) => this.colorRange(d.label))
                    .classed('mt-1', this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-description')
                    .classed('d-flex', this.isCompare)
                    .classed('flex-column', this.isCompare);
                li.select('.legend-description')
                    .insert('span')
                    .attr('class', 'legend-label')
                    .html((d) => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                li.select('.legend-description')
                    .insert('div')
                    .attr('class', 'legend-change')
                    .classed('d-none', !this.isCompare);
                li.select('.legend-change').html((d) => {
                    return `<div class="metric-block-indicator ${d.compareChangeDirection} ${d.compareChangeInverse ? 'inverse' : ''} mt-1"><span>${this.tooltipCompareChangeFormat(d.compareChangeValue)}</span></div>`;
                });
                return li;
            }, (update) => {
                update.classed('align-items-start', this.isCompare);
                update.select('.legend-key').classed('mt-1', this.isCompare);
                update.select('.legend-change').classed('d-none', !this.isCompare);
                if (this.isCompare) {
                    update.select('.legend-change').html((d) => {
                        return `<div class="metric-block-indicator ${d.compareChangeDirection} ${d.compareChangeInverse ? 'inverse' : ''} mt-1"><span>${this.tooltipCompareChangeFormat(d.compareChangeValue)}</span></div>`;
                    });
                }
                update.select('.legend-label').html((d) => {
                    switch (this.legendLabelFormatType) {
                        case 'number':
                            return this.legendLabelFormat(d.label);
                        case 'time':
                            const parsedTime = isoParse(d.label);
                            return this.legendLabelFormat(parsedTime);
                        default:
                            return d.label;
                    }
                });
                return update;
            }, (exit) => exit.remove())
                .datum((d, i) => {
                return { data: this.data, index: i };
            })
                .on('mouseover', (event, data) => this.legendMouseOver(event, data))
                .on('mouseout', () => this.legendMouseOut())
                .on('click', (event, data) => this.legendMouseClick(event, data));
        }
    }
    barFill(d) {
        const path = this._location.path();
        const url = this._location.prepareExternalUrl(path);
        const colorRange = this.colorRange(d.label);
        if (this.gradient && this.isSingleData) {
            return `url(${url}#gradient-horizontal-${colorRange.substr(1)})`;
        }
        else {
            return colorRange;
        }
    }
}
PbdsDatavizBarSingleHorizontalComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBarSingleHorizontalComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBarSingleHorizontalComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizBarSingleHorizontalComponent, selector: "pbds-dataviz-bar-single-horizontal", inputs: { data: "data", width: "width", height: "height", nullValueText: "nullValueText", percentage: "percentage", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", barMargin: "barMargin", hideXAxis: "hideXAxis", xAxisTicks: "xAxisTicks", xAxisTitle: "xAxisTitle", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", xAxisTickLabelSuffix: "xAxisTickLabelSuffix", hideXGrid: "hideXGrid", hideLegend: "hideLegend", hideLegendTooltip: "hideLegendTooltip", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", hideTooltip: "hideTooltip", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipDateFormatString: "tooltipDateFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", tooltipValueSuffix: "tooltipValueSuffix", tooltipPercentFormatString: "tooltipPercentFormatString", compareChangeFormatString: "compareChangeFormatString", monochrome: "monochrome", customColor: "customColor", colorsArray: "colorsArray", theme: "theme", gradient: "gradient" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-bar-single-horizontal": "this.singleStackedBarClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizBarSingleHorizontalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-bar-single-horizontal', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }, { type: i2.Location }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], singleStackedBarClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-bar-single-horizontal']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], nullValueText: [{
                type: Input
            }], percentage: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], barMargin: [{
                type: Input
            }], hideXAxis: [{
                type: Input
            }], xAxisTicks: [{
                type: Input
            }], xAxisTitle: [{
                type: Input
            }], xAxisFormatType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], xAxisTickLabelSuffix: [{
                type: Input
            }], hideXGrid: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], hideLegendTooltip: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendPosition: [{
                type: Input
            }], legendLabelFormatType: [{
                type: Input
            }], legendLabelFormatString: [{
                type: Input
            }], hideTooltip: [{
                type: Input
            }], tooltipLabelFormatType: [{
                type: Input
            }], tooltipLabelFormatString: [{
                type: Input
            }], tooltipDateFormatString: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], tooltipValueSuffix: [{
                type: Input
            }], tooltipPercentFormatString: [{
                type: Input
            }], compareChangeFormatString: [{
                type: Input
            }], monochrome: [{
                type: Input
            }], customColor: [{
                type: Input
            }], colorsArray: [{
                type: Input
            }], theme: [{
                type: Input
            }], gradient: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });

class PbdsDatavizScatterplotComponent {
    constructor(_dataviz, _element, _scroll) {
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this.chartClass = true;
        this.scatterplotClass = true;
        this.width = 306;
        this.height = 400;
        this.jitterX = 4;
        this.jitterY = 4;
        this.xAxisType = 'date';
        this.xAxisFormatString = '';
        this.xAxisTicks = 6;
        this.yAxisFormatString = '';
        this.yAxisTicks = 5;
        this.yAxisMinBuffer = 0.01;
        this.yAxisMaxBuffer = 0.01;
        this.hideXGrid = false;
        this.hideYGrid = false;
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
        this.legendPosition = 'right';
        this.legendLabelFormatType = null;
        this.tooltipXLabel = 'X';
        this.tooltipXValueFormatType = null;
        this.tooltipXValueFormatString = '';
        this.tooltipYLabel = 'Y';
        this.tooltipYValueFormatType = null;
        this.tooltipYValueFormatString = '';
        this.tooltipValueLabel = 'Value';
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.marginTop = 10;
        this.marginRight = 20;
        this.marginBottom = 30;
        this.marginLeft = 55;
        this.customColor = false;
        this.colorsArray = [];
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.tooltipHovered = new EventEmitter();
        this.tooltipClicked = new EventEmitter();
        this.updateChart = () => {
            // build color ranges
            const labels = new Set();
            this.data.map((d) => labels.add(d.key));
            const labelsArray = Array.from(labels.values());
            //custom colors
            const colors = this.customColor ? this.colorsArray : this._dataviz.getColors(false, this.theme);
            this.colorRange = scaleOrdinal().domain(labelsArray).range(colors);
            // update the xScale
            if (this.xAxisType === 'date') {
                this.xAxisScale.domain(extent(this.data, (d) => {
                    return isoParse(d.x);
                }));
            }
            else if (this.xAxisType === 'number') {
                this.xAxisScale.domain(extent(this.data, (d) => {
                    return +d.x;
                }));
            }
            // update the yScale
            this.yAxisScale
                .domain([
                min(this.data, (d, i) => {
                    const minVal = +d.y;
                    return minVal - minVal * +this.yAxisMinBuffer;
                }),
                max(this.data, (d, i) => {
                    const maxVal = +d.y;
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
            this.svg
                .selectAll('circle')
                .data(this.data)
                .join((enter) => {
                return enter
                    .append('circle')
                    .attr('cx', (d) => {
                    if (this.xAxisType === 'date') {
                        return this.xAxisScale(isoParse(d.x)) - this.jitter(this.jitterX);
                    }
                    return this.xAxisScale(d.x) - this.jitter(this.jitterX);
                })
                    .attr('cy', (d) => this.yAxisScale(0))
                    .attr('r', (d) => {
                    if (d.value) {
                        return this.valueScale(d.value);
                    }
                    return 5;
                })
                    .attr('fill', (d) => this.colorRange(d.key))
                    .attr('stroke', (d) => this.colorRange(d.key))
                    .call((enter) => {
                    enter.attr('cy', (d) => this.yAxisScale(d.y) - this.jitter(this.jitterY));
                });
            }, (update) => {
                update
                    .transition()
                    .duration(1000)
                    .attr('cx', (d) => this.xAxisScale(d.x) - this.jitter(this.jitterX))
                    .attr('cy', (d) => this.yAxisScale(d.y) - this.jitter(this.jitterY));
                return update;
            }, (exit) => {
                exit
                    .attr('cy', (d) => this.yAxisScale(0) - this.jitter(this.jitterY))
                    .attr('r', 0)
                    .remove();
            })
                .on('mouseover', (event, data) => this.tooltipShow(event, data))
                .on('mouseout', (event, data) => this.tooltipHide())
                .on('click', (event, data) => this.tooltipClicked.emit({ event, data: data }));
            if (!this.hideLegend) {
                const uniqueKeys = new Set();
                this.data.forEach((d) => {
                    uniqueKeys.add(d.key);
                });
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(Array.from(uniqueKeys.values()))
                    .join((enter) => {
                    const li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', (d) => this.colorRange(d));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html((d) => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d);
                            case 'time':
                                const parsedTime = isoParse(d);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d;
                        }
                    });
                    return li;
                }, (update) => {
                    update.select('.legend-label').html((d) => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d);
                            case 'time':
                                const parsedTime = isoParse(d);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d;
                        }
                    });
                    return update;
                }, (exit) => exit.remove())
                    .on('mouseover', (event, data) => this.legendMouseOver(event, data))
                    .on('mouseout', () => this.legendMouseOut())
                    .on('click', (event, data) => this.legendMouseClick(event, data));
            }
        };
        this.legendMouseOver = (event, data) => {
            const filteredData = this.data.filter((d) => d.key === data);
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => {
                return d !== data;
            })
                .classed('inactive', true);
            this.svg
                .selectAll('circle')
                .filter((d, i) => {
                return d.key !== data;
            })
                .classed('inactive', true);
            this.hovered.emit({ event, data: filteredData });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.svg.selectAll('circle').classed('inactive', false);
        };
        this.legendMouseClick = (event, data) => {
            const filteredData = this.data.filter((d) => d.key === data);
            this.clicked.emit({ event, data: filteredData });
        };
        this.tooltipShow = (event, data) => {
            const scroll = this._scroll.getScrollPosition();
            const boundRect = event.currentTarget.getBoundingClientRect();
            this.svg.selectAll('circle').classed('inactive', true);
            select(event.currentTarget).classed('inactive', false).classed('active', true);
            const clientWidth = document.body.clientWidth - 10;
            let html = `
      <tr>
        <td class="pr-3">${this.tooltipXLabel}</td><td class="text-right">${this.tooltipXValueFormatter(data.x)}</td>
      </tr>
      <tr>
        <td class="pr-3">${this.tooltipYLabel}</td><td class="text-right">${this.tooltipYValueFormatter(data.y)}</td>
      </tr>
    `;
            if (data.value) {
                html += `
      <tr>
        <td class="pr-3">${this.tooltipValueLabel}</td><td class="text-right">${this.tooltipValueFormatter(data.value)}</td>
      </tr>
      `;
            }
            this.tooltip.select('tbody').html(html);
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            const tooltipDimensions = this.tooltip.node().getBoundingClientRect();
            const dimensionCalculated = boundRect.left + tooltipDimensions.width + 8;
            let position;
            // flip the tooltip positions if near the right edge of the screen
            if (dimensionCalculated > clientWidth) {
                this.tooltip.classed('east', true);
                this.tooltip.classed('west', false);
                position = `${boundRect.left - boundRect.width / 2 - tooltipDimensions.width - 8}px`;
            }
            else if (dimensionCalculated < clientWidth) {
                this.tooltip.classed('east', false);
                this.tooltip.classed('west', true);
                position = `${boundRect.left + boundRect.width / 2 + 8}px`;
            }
            // set the tooltip styles
            this.tooltip.style('top', `${boundRect.top + boundRect.height / 2 - tooltipOffsetHeight / 2 + scroll[1]}px`);
            this.tooltip.style('left', position);
            this.tooltip.style('opacity', 1);
            this.tooltipHovered.emit({ event, data: data });
        };
        this.tooltipHide = () => {
            this.svg.selectAll('circle').classed('inactive', false).classed('active', false);
            this.tooltip.style('opacity', 0);
        };
        this.xAxisFormatter = (item) => {
            if (this.xAxisType === 'date') {
                const parseDate = isoParse(item);
                return this.xAxisFormat(parseDate);
            }
            else if (this.xAxisType === 'number') {
                return this.xAxisFormat(item);
            }
            else {
                return item;
            }
        };
        this.yAxisFormatter = (item) => {
            return this.yAxisFormat(item);
        };
        this.tooltipXValueFormatter = (item) => {
            if (this.tooltipXValueFormatType === 'time') {
                const parseDate = isoParse(item);
                return this.tooltipXValueFormat(parseDate);
            }
            else if (this.tooltipXValueFormatType === 'number') {
                return this.tooltipXValueFormat(item);
            }
            else {
                return item;
            }
        };
        this.tooltipYValueFormatter = (item) => {
            if (this.tooltipYValueFormatType === 'time') {
                const parseDate = isoParse(item);
                return this.tooltipYValueFormat(parseDate);
            }
            else if (this.tooltipYValueFormatType === 'number') {
                return this.tooltipYValueFormat(item);
            }
            else {
                return item;
            }
        };
        this.tooltipValueFormatter = (item) => {
            if (this.tooltipValueFormatType === 'time') {
                const parseDate = isoParse(item);
                return this.tooltipValueFormat(parseDate);
            }
            else if (this.tooltipValueFormatType === 'number') {
                return this.tooltipValueFormat(item);
            }
            else {
                return item;
            }
        };
    }
    ngOnInit() {
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        // create formatters
        this.xAxisFormat =
            this.xAxisType === 'date' ? timeFormat$1(this.xAxisFormatString) : format$1(this.xAxisFormatString);
        this.yAxisFormat = format$1(this.yAxisFormatString);
        this.tooltipXValueFormat = this._dataviz.d3Format(this.tooltipXValueFormatType, this.tooltipXValueFormatString);
        this.tooltipYValueFormat = this._dataviz.d3Format(this.tooltipYValueFormatType, this.tooltipYValueFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        this.xAxisTickSize = 8;
        this.xAxisTickSizeOuter = 0;
        this.yAxisTickSize = 8;
        this.yAxisTickSizeOuter = 0;
        // create the chart
        this.chart = select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width + this.margin.right)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom}`);
        // X AXIS
        if (this.xAxisType === 'date') {
            this.xAxisScale = scaleTime()
                .domain(extent(this.data, (d) => {
                return isoParse(d.x);
            }))
                .range([0, this.width - this.margin.left - this.margin.right]);
        }
        else if (this.xAxisType === 'number') {
            this.xAxisScale = scaleLinear()
                .domain(extent(this.data, (d) => {
                return +d.x;
            }))
                .range([0, this.width - this.margin.left - this.margin.right]);
        }
        else {
            const keys = this.data.map((d) => d.x);
            console.log('KEYS: ', keys);
            this.xAxisScale = scalePoint()
                .domain(keys)
                .range([0, this.width - this.margin.left - this.margin.right]);
        }
        this.xAxisCall = axisBottom(this.xAxisScale)
            .ticks(+this.xAxisTicks)
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
            if (this.xAxisType === 'string') {
                this.xGridCall = axisBottom(this.xAxisScale)
                    .tickSize(-this.height)
                    .tickValues(this.xAxisScale.domain().filter((d, i) => {
                    console.log('GRID: ', d, i);
                    // see https://github.com/d3/d3-scale/issues/182
                    // d3 cannot determine number of strings to show on xaxis with scalePoint()
                    return i % this.xAxisTicks === 0;
                }));
            }
            else {
                this.xGridCall = axisBottom(this.xAxisScale).tickSize(-this.height);
            }
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
            min(this.data, (d, i) => {
                const minVal = +d.y;
                return minVal - minVal * +this.yAxisMinBuffer;
            }),
            max(this.data, (d, i) => {
                const maxVal = +d.y;
                return maxVal + maxVal * this.yAxisMaxBuffer;
            })
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
        // create value scale if passed in data
        if ('value' in this.data[0]) {
            this.valueScale = scaleLinear()
                .domain(extent(this.data, (d) => {
                return +d.value;
            }))
                .range([5, 50]);
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
            this.tooltip.append('table').attr('class', 'tooltip-table text-left w-100').append('tbody');
        }
        // add legend classes
        if (!this.hideLegend) {
            this.chart.classed('pbds-chart-legend-bottom', this.legendPosition === 'bottom' ? true : false);
            this.chart.append('ul').attr('class', `legend legend-${this.legendPosition}`);
        }
        this.updateChart();
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
    jitter(jitter) {
        return Math.random() * jitter;
    }
}
PbdsDatavizScatterplotComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizScatterplotComponent, deps: [{ token: PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizScatterplotComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizScatterplotComponent, selector: "pbds-dataviz-scatterplot", inputs: { data: "data", width: "width", height: "height", jitterX: "jitterX", jitterY: "jitterY", xAxisType: "xAxisType", xAxisFormatString: "xAxisFormatString", xAxisTicks: "xAxisTicks", yAxisFormatString: "yAxisFormatString", yAxisTicks: "yAxisTicks", yAxisMinBuffer: "yAxisMinBuffer", yAxisMaxBuffer: "yAxisMaxBuffer", hideXGrid: "hideXGrid", hideYGrid: "hideYGrid", hideLegend: "hideLegend", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", tooltipXLabel: "tooltipXLabel", tooltipXValueFormatType: "tooltipXValueFormatType", tooltipXValueFormatString: "tooltipXValueFormatString", tooltipYLabel: "tooltipYLabel", tooltipYValueFormatType: "tooltipYValueFormatType", tooltipYValueFormatString: "tooltipYValueFormatString", tooltipValueLabel: "tooltipValueLabel", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", theme: "theme", customColor: "customColor", colorsArray: "colorsArray" }, outputs: { hovered: "hovered", clicked: "clicked", tooltipHovered: "tooltipHovered", tooltipClicked: "tooltipClicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-scatterplot": "this.scatterplotClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizScatterplotComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-scatterplot', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], scatterplotClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-scatterplot']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], jitterX: [{
                type: Input
            }], jitterY: [{
                type: Input
            }], xAxisType: [{
                type: Input
            }], xAxisFormatString: [{
                type: Input
            }], xAxisTicks: [{
                type: Input
            }], yAxisFormatString: [{
                type: Input
            }], yAxisTicks: [{
                type: Input
            }], yAxisMinBuffer: [{
                type: Input
            }], yAxisMaxBuffer: [{
                type: Input
            }], hideXGrid: [{
                type: Input
            }], hideYGrid: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendPosition: [{
                type: Input
            }], legendLabelFormatType: [{
                type: Input
            }], tooltipXLabel: [{
                type: Input
            }], tooltipXValueFormatType: [{
                type: Input
            }], tooltipXValueFormatString: [{
                type: Input
            }], tooltipYLabel: [{
                type: Input
            }], tooltipYValueFormatType: [{
                type: Input
            }], tooltipYValueFormatString: [{
                type: Input
            }], tooltipValueLabel: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], theme: [{
                type: Input
            }], customColor: [{
                type: Input
            }], colorsArray: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }], tooltipHovered: [{
                type: Output
            }], tooltipClicked: [{
                type: Output
            }] } });

const ANNOTATION_MARGIN_TOP$3 = 62;
const ANNOTATION_OFFSET$3 = -22;
const ANNOTATION_COMMENT_OFFSET$3 = -47;
const TRANSITION_DURATION$3 = 1000;
const TRANSITION_DELAY$3 = 500;
class PbdsBarStackedAnnotationsDirective {
    constructor(component) {
        this.component = component;
        this.annotationsHilight = null;
        this.annotationClicked = new EventEmitter();
        component.marginTop = ANNOTATION_MARGIN_TOP$3;
    }
    ngOnInit() {
        this.annotationsGroup = this.component.svg.append('g').attr('class', 'annotations');
        this.hilightBox = this.annotationsGroup
            .append('rect')
            .classed('annotations-hilight', true)
            .attr('opacity', 0)
            .attr('width', this.component.xAxisScale.bandwidth())
            .attr('height', this.component.height)
            .attr('transform', `translate(${0}, ${0})`);
        this.update();
    }
    ngOnChanges(changes) {
        if (changes && changes.annotationsHilight && !changes.annotationsHilight.firstChange) {
            if (changes.annotationsHilight.currentValue) {
                this.updateHilight();
            }
            else {
                this.hilightBox.transition().duration(200).attr('opacity', 0);
            }
        }
        if (changes.annotations && !changes.annotations.firstChange) {
            this.update();
        }
    }
    update() {
        const isAnotations = this.annotations;
        const isIncidents = this.annotations?.incidents?.length > 0;
        const isComments = this.annotations?.comments?.length > 0;
        if (isAnotations && isIncidents) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.incident')
                .data(this.annotations.incidents)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'incident');
                g.attr('transform', (d, i) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    const y = ANNOTATION_OFFSET$3;
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION$3)
                    .ease(easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('dx', 1)
                    .attr('dy', 9)
                    .attr('text-anchor', 'middle')
                    .text((d) => {
                    return d.icon || '';
                })
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION$3)
                    .ease(easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION$3)
                    .ease(easeQuadInOut)
                    .attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    const y = ANNOTATION_OFFSET$3;
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION$3).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION$3).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY$3).remove();
            })
                .on('mouseover', (event, data) => {
                select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                // console.log('incident clicked', this.index.get(event.currentTarget.node));
                this.annotationClicked.emit({ event, data, index: +select(event.currentTarget).attr('index') });
            });
        }
        if (isAnotations && isComments) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.comment')
                .data(this.annotations.comments)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'comment');
                g.attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    let y = ANNOTATION_OFFSET$3;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET$3;
                    }
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION$3)
                    .ease(easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 3)
                    .attr('dx', 0)
                    .attr('dy', 5)
                    .attr('text-anchor', 'middle')
                    .text('')
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION$3)
                    .ease(easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION$3)
                    .ease(easeQuadInOut)
                    .attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    let y = ANNOTATION_OFFSET$3;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET$3;
                    }
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION$3).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION$3).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY$3).remove();
            })
                .on('mouseover', (event) => {
                select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event) => {
                select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                this.annotationClicked.emit({ event, data, index: +select(event.currentTarget).attr('index') });
            });
        }
        // hilight
        if (this.annotationsHilight) {
            this.updateHilight();
        }
        this.component.svg.selectAll('.mouseover-bar').classed('pbds-annotation-add', true);
    }
    updateHilight() {
        const opacity = this.hilightBox.attr('opacity');
        const duration = opacity === 0 ? 0 : 300;
        this.hilightBox
            .transition()
            .duration(duration)
            .ease(easeQuadInOut)
            .attr('transform', () => {
            const x = this.component.xAxisScale(this.annotationsHilight);
            const y = 0;
            return `translate(${x}, ${y})`;
        })
            .transition()
            .duration(200)
            .attr('opacity', 1);
    }
}
PbdsBarStackedAnnotationsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsBarStackedAnnotationsDirective, deps: [{ token: forwardRef(() => PbdsDatavizBarStackedComponent) }], target: i0.ɵɵFactoryTarget.Directive });
PbdsBarStackedAnnotationsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.7", type: PbdsBarStackedAnnotationsDirective, selector: "pbds-dataviz-bar-stacked[annotations]", inputs: { annotations: "annotations", annotationsHilight: "annotationsHilight" }, outputs: { annotationClicked: "annotationClicked" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsBarStackedAnnotationsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'pbds-dataviz-bar-stacked[annotations]'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => PbdsDatavizBarStackedComponent)]
                }] }]; }, propDecorators: { annotations: [{
                type: Input,
                args: ['annotations']
            }], annotationsHilight: [{
                type: Input,
                args: ['annotationsHilight']
            }], annotationClicked: [{
                type: Output
            }] } });

const ANNOTATION_MARGIN_TOP$2 = 62;
const ANNOTATION_OFFSET$2 = -22;
const ANNOTATION_COMMENT_OFFSET$2 = -47;
const ANNOTATION_WIDTH = 26;
const TRANSITION_DURATION$2 = 1000;
const TRANSITION_DELAY$2 = 500;
class PbdsLineAnnotationsDirective {
    constructor(component) {
        this.component = component;
        this.annotationsHilight = null;
        this.annotationClicked = new EventEmitter();
        component.marginTop = ANNOTATION_MARGIN_TOP$2;
    }
    ngOnInit() {
        this.annotationsGroup = this.component.svg.append('g').attr('class', 'annotations');
        this.hilightBox = this.annotationsGroup
            .append('rect')
            .classed('annotations-hilight', true)
            .attr('opacity', 0)
            .attr('width', ANNOTATION_WIDTH)
            .attr('height', this.component.height)
            .attr('transform', `translate(${ANNOTATION_WIDTH / 2}, ${0})`);
        this.update();
    }
    ngOnChanges(changes) {
        if (changes && changes.annotationsHilight && !changes.annotationsHilight.firstChange) {
            if (changes.annotationsHilight.currentValue) {
                this.updateHilight();
            }
            else {
                this.hilightBox.transition().duration(200).attr('opacity', 0);
            }
        }
        if (changes.annotations && !changes.annotations.firstChange) {
            this.update();
        }
    }
    update() {
        const isAnotations = this.annotations;
        const isIncidents = this.annotations?.incidents?.length > 0;
        const isComments = this.annotations?.comments?.length > 0;
        if (isAnotations && isIncidents) {
            this.annotationsGroup
                .selectAll('g.incident')
                .data(this.annotations.incidents)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'incident');
                g.attr('transform', (d, i) => {
                    let x;
                    const y = ANNOTATION_OFFSET$2;
                    if (this.component.xAxisType === 'date') {
                        x = this.component.xAxisScale(isoParse(d.key));
                    }
                    else {
                        x = this.component.xAxisScale(d.key);
                    }
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION$2)
                    .ease(easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('dx', 1)
                    .attr('dy', 9)
                    .attr('text-anchor', 'middle')
                    .text((d) => {
                    return d.icon || '';
                })
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION$2)
                    .ease(easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION$2)
                    .ease(easeQuadInOut)
                    .attr('transform', (d) => {
                    let x;
                    const y = ANNOTATION_OFFSET$2;
                    if (this.component.xAxisType === 'date') {
                        x = this.component.xAxisScale(isoParse(d.key));
                    }
                    else {
                        x = this.component.xAxisScale(d.key);
                    }
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION$2).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION$2).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY$2).remove();
            })
                .on('mouseover', (event, data) => {
                select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                // console.log('incident clicked', this.index.get(event.currentTarget.node));
                this.annotationClicked.emit({ event, data, index: +select(event.currentTarget).attr('index') });
            });
        }
        if (isAnotations && isComments) {
            this.annotationsGroup
                .selectAll('g.comment')
                .data(this.annotations.comments)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'comment');
                g.attr('transform', (d) => {
                    let x;
                    let y = ANNOTATION_OFFSET$2;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (this.component.xAxisType === 'date') {
                        x = this.component.xAxisScale(isoParse(d.key));
                    }
                    else {
                        x = this.component.xAxisScale(d.key);
                    }
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET$2;
                    }
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION$2)
                    .ease(easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 3)
                    .attr('dx', 0)
                    .attr('dy', 5)
                    .attr('text-anchor', 'middle')
                    .text('')
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION$2)
                    .ease(easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION$2)
                    .ease(easeQuadInOut)
                    .attr('transform', (d) => {
                    let x;
                    let y = ANNOTATION_OFFSET$2;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (this.component.xAxisType === 'date') {
                        x = this.component.xAxisScale(isoParse(d.key));
                    }
                    else {
                        x = this.component.xAxisScale(d.key);
                    }
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET$2;
                    }
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION$2).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION$2).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY$2).remove();
            })
                .on('mouseover', (event) => {
                select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event) => {
                select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                this.annotationClicked.emit({ event, data, index: +select(event.currentTarget).attr('index') });
            });
        }
        // hilight
        if (this.annotationsHilight) {
            this.updateHilight();
        }
        this.component.svg.selectAll('.mouserect').classed('pbds-annotation-add', true);
    }
    updateHilight() {
        const opacity = this.hilightBox.attr('opacity');
        const duration = opacity === 0 ? 0 : 300;
        const xAxisType = this.component.xAxisType;
        this.hilightBox
            .transition()
            .duration(duration)
            .ease(easeQuadInOut)
            .attr('transform', () => {
            let x = 0;
            const y = 0;
            if (xAxisType === 'date') {
                x = this.component.xAxisScale(isoParse(this.annotationsHilight));
            }
            else {
                x = this.component.xAxisScale(this.annotationsHilight);
            }
            return `translate(${x - ANNOTATION_WIDTH / 2}, ${y})`;
        })
            .transition()
            .duration(200)
            .attr('opacity', 1);
    }
}
PbdsLineAnnotationsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsLineAnnotationsDirective, deps: [{ token: forwardRef(() => PbdsDatavizLineComponent) }], target: i0.ɵɵFactoryTarget.Directive });
PbdsLineAnnotationsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.7", type: PbdsLineAnnotationsDirective, selector: "pbds-dataviz-line[annotations]", inputs: { annotations: "annotations", annotationsHilight: "annotationsHilight" }, outputs: { annotationClicked: "annotationClicked" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsLineAnnotationsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'pbds-dataviz-line[annotations]'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => PbdsDatavizLineComponent)]
                }] }]; }, propDecorators: { annotations: [{
                type: Input,
                args: ['annotations']
            }], annotationsHilight: [{
                type: Input,
                args: ['annotationsHilight']
            }], annotationClicked: [{
                type: Output
            }] } });

const ANNOTATION_MARGIN_TOP$1 = 62;
const ANNOTATION_OFFSET$1 = -22;
const ANNOTATION_COMMENT_OFFSET$1 = -47;
const TRANSITION_DURATION$1 = 1000;
const TRANSITION_DELAY$1 = 500;
class PbdsBarGroupedAnnotationsDirective {
    constructor(component) {
        this.component = component;
        this.annotationsHilight = null;
        this.annotationClicked = new EventEmitter();
        component.marginTop = ANNOTATION_MARGIN_TOP$1;
    }
    ngOnInit() {
        this.annotationsGroup = this.component.svg.append('g').attr('class', 'annotations');
        this.hilightBox = this.annotationsGroup
            .append('rect')
            .classed('annotations-hilight', true)
            .attr('opacity', 0)
            .attr('width', this.component.xAxisScale.bandwidth())
            .attr('height', this.component.height)
            .attr('transform', `translate(${0}, ${0})`);
        this.update();
    }
    ngOnChanges(changes) {
        if (changes && changes.annotationsHilight && !changes.annotationsHilight.firstChange) {
            if (changes.annotationsHilight.currentValue) {
                this.updateHilight();
            }
            else {
                this.hilightBox.transition().duration(200).attr('opacity', 0);
            }
        }
        if (changes.annotations && !changes.annotations.firstChange) {
            this.update();
        }
    }
    update() {
        const isAnotations = this.annotations;
        const isIncidents = this.annotations?.incidents?.length > 0;
        const isComments = this.annotations?.comments?.length > 0;
        if (isAnotations && isIncidents) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.incident')
                .data(this.annotations.incidents)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'incident');
                g.attr('transform', (d, i) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    const y = ANNOTATION_OFFSET$1;
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION$1)
                    .ease(easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('dx', 1)
                    .attr('dy', 9)
                    .attr('text-anchor', 'middle')
                    .text((d) => {
                    return d.icon || '';
                })
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION$1)
                    .ease(easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION$1)
                    .ease(easeQuadInOut)
                    .attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    const y = ANNOTATION_OFFSET$1;
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION$1).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION$1).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY$1).remove();
            })
                .on('mouseover', (event, data) => {
                select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                // console.log('incident clicked', this.index.get(event.currentTarget.node));
                this.annotationClicked.emit({ event, data, index: +select(event.currentTarget).attr('index') });
            });
        }
        if (isAnotations && isComments) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.comment')
                .data(this.annotations.comments)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'comment');
                g.attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    let y = ANNOTATION_OFFSET$1;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET$1;
                    }
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION$1)
                    .ease(easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 3)
                    .attr('dx', 0)
                    .attr('dy', 5)
                    .attr('text-anchor', 'middle')
                    .text('')
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION$1)
                    .ease(easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION$1)
                    .ease(easeQuadInOut)
                    .attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    let y = ANNOTATION_OFFSET$1;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET$1;
                    }
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION$1).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION$1).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY$1).remove();
            })
                .on('mouseover', (event) => {
                select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event) => {
                select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                this.annotationClicked.emit({ event, data, index: +select(event.currentTarget).attr('index') });
            });
        }
        // hilight
        if (this.annotationsHilight) {
            this.updateHilight();
        }
        this.component.svg.selectAll('.bar').classed('pbds-annotation-add', true);
    }
    updateHilight() {
        const opacity = this.hilightBox.attr('opacity');
        const duration = opacity === 0 ? 0 : 300;
        this.hilightBox
            .transition()
            .duration(duration)
            .ease(easeQuadInOut)
            .attr('transform', () => {
            const x = this.component.xAxisScale(this.annotationsHilight);
            const y = 0;
            return `translate(${x}, ${y})`;
        })
            .transition()
            .duration(200)
            .attr('opacity', 1);
    }
}
PbdsBarGroupedAnnotationsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsBarGroupedAnnotationsDirective, deps: [{ token: forwardRef(() => PbdsDatavizBarGroupedComponent) }], target: i0.ɵɵFactoryTarget.Directive });
PbdsBarGroupedAnnotationsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.7", type: PbdsBarGroupedAnnotationsDirective, selector: "pbds-dataviz-bar-grouped[annotations]", inputs: { annotations: "annotations", annotationsHilight: "annotationsHilight" }, outputs: { annotationClicked: "annotationClicked" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsBarGroupedAnnotationsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'pbds-dataviz-bar-grouped[annotations]'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => PbdsDatavizBarGroupedComponent)]
                }] }]; }, propDecorators: { annotations: [{
                type: Input,
                args: ['annotations']
            }], annotationsHilight: [{
                type: Input,
                args: ['annotationsHilight']
            }], annotationClicked: [{
                type: Output
            }] } });

const ANNOTATION_MARGIN_TOP = 62;
const ANNOTATION_OFFSET = -22;
const ANNOTATION_COMMENT_OFFSET = -47;
const TRANSITION_DURATION = 1000;
const TRANSITION_DELAY = 500;
class PbdsBarAnnotationsDirective {
    constructor(component) {
        this.component = component;
        this.annotationsHilight = null;
        this.annotationClicked = new EventEmitter();
        component.marginTop = ANNOTATION_MARGIN_TOP;
    }
    ngOnInit() {
        this.annotationsGroup = this.component.svg.append('g').attr('class', 'annotations');
        this.hilightBox = this.annotationsGroup
            .append('rect')
            .classed('annotations-hilight', true)
            .attr('opacity', 0)
            .attr('width', this.component.xAxisScale.bandwidth())
            .attr('height', this.component.height)
            .attr('transform', `translate(${0}, ${0})`);
        this.update();
    }
    ngOnChanges(changes) {
        if (changes && changes.annotationsHilight && !changes.annotationsHilight.firstChange) {
            if (changes.annotationsHilight.currentValue) {
                this.updateHilight();
            }
            else {
                this.hilightBox.transition().duration(200).attr('opacity', 0);
            }
        }
    }
    update() {
        const isAnotations = this.annotations;
        const isIncidents = this.annotations?.incidents?.length > 0;
        const isComments = this.annotations?.comments?.length > 0;
        const bandwidth = this.component.xAxisScale.bandwidth();
        if (isAnotations && isIncidents) {
            this.annotationsGroup
                .selectAll('g.incident')
                .data(this.annotations.incidents)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'incident');
                g.attr('transform', (d, i) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    const y = ANNOTATION_OFFSET;
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('dx', 1)
                    .attr('dy', 9)
                    .attr('text-anchor', 'middle')
                    .text((d) => {
                    return d.icon || '';
                })
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(easeQuadInOut)
                    .attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    const y = ANNOTATION_OFFSET;
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY).remove();
            })
                .on('mouseover', (event, data) => {
                select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                // console.log('incident clicked', this.index.get(event.currentTarget.node));
                this.annotationClicked.emit({ event, data, index: +select(event.currentTarget).attr('index') });
            });
        }
        if (isAnotations && isComments) {
            this.annotationsGroup
                .selectAll('g.comment')
                .data(this.annotations.comments)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'comment');
                g.attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    let y = ANNOTATION_OFFSET;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET;
                    }
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 3)
                    .attr('dx', 0)
                    .attr('dy', 5)
                    .attr('text-anchor', 'middle')
                    .text('')
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(easeQuadInOut)
                    .attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    let y = ANNOTATION_OFFSET;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET;
                    }
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY).remove();
            })
                .on('mouseover', (event, data) => {
                select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                this.annotationClicked.emit({ event, data, index: +select(event.currentTarget).attr('index') });
            });
        }
        // hilight
        if (this.annotationsHilight) {
            this.updateHilight();
        }
        this.component.svg.selectAll('.bar').classed('pbds-annotation-add', true);
    }
    updateHilight() {
        const opacity = this.hilightBox.attr('opacity');
        const duration = opacity === 0 ? 0 : 300;
        this.hilightBox
            .transition()
            .duration(duration)
            .ease(easeQuadInOut)
            .attr('transform', () => {
            const x = this.component.xAxisScale(this.annotationsHilight);
            const y = 0;
            return `translate(${x}, ${y})`;
        })
            .transition()
            .duration(200)
            .attr('opacity', 1);
    }
}
PbdsBarAnnotationsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsBarAnnotationsDirective, deps: [{ token: forwardRef(() => PbdsDatavizBarComponent) }], target: i0.ɵɵFactoryTarget.Directive });
PbdsBarAnnotationsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.7", type: PbdsBarAnnotationsDirective, selector: "pbds-dataviz-bar[annotations]", inputs: { annotations: "annotations", annotationsHilight: "annotationsHilight" }, outputs: { annotationClicked: "annotationClicked" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsBarAnnotationsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'pbds-dataviz-bar[annotations]'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => PbdsDatavizBarComponent)]
                }] }]; }, propDecorators: { annotations: [{
                type: Input,
                args: ['annotations']
            }], annotationsHilight: [{
                type: Input,
                args: ['annotationsHilight']
            }], annotationClicked: [{
                type: Output,
                args: ['annotationClicked']
            }] } });

class PbdsDatavizModule {
}
PbdsDatavizModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsDatavizModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizModule, declarations: [PbdsDatavizPieComponent,
        PbdsDatavizBarComponent,
        PbdsDatavizLineComponent,
        PbdsDatavizGaugeComponent,
        PbdsDatavizSparklineComponent,
        PbdsDatavizBarStackedComponent,
        PbdsDatavizMetricBlockComponent,
        PbdsDatavizBubbleMapComponent,
        PbdsDatavizMetricIndicatorComponent,
        PbdsDatavizHeatmapComponent,
        PbdsDatavizChoroplethMapComponent,
        PbdsDatavizBarGroupedComponent,
        PbdsDatavizBarSingleHorizontalComponent,
        PbdsDatavizScatterplotComponent,
        PbdsBarStackedAnnotationsDirective,
        PbdsLineAnnotationsDirective,
        PbdsBarGroupedAnnotationsDirective,
        PbdsBarAnnotationsDirective], imports: [CommonModule, NgbTooltipModule], exports: [PbdsDatavizPieComponent,
        PbdsDatavizBarComponent,
        PbdsDatavizLineComponent,
        PbdsDatavizGaugeComponent,
        PbdsDatavizSparklineComponent,
        PbdsDatavizBarStackedComponent,
        PbdsDatavizMetricBlockComponent,
        PbdsDatavizBubbleMapComponent,
        PbdsDatavizMetricIndicatorComponent,
        PbdsDatavizHeatmapComponent,
        PbdsDatavizChoroplethMapComponent,
        PbdsDatavizBarGroupedComponent,
        PbdsDatavizBarSingleHorizontalComponent,
        PbdsDatavizScatterplotComponent,
        PbdsBarStackedAnnotationsDirective,
        PbdsLineAnnotationsDirective,
        PbdsBarGroupedAnnotationsDirective,
        PbdsBarAnnotationsDirective] });
PbdsDatavizModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizModule, imports: [CommonModule, NgbTooltipModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        PbdsDatavizPieComponent,
                        PbdsDatavizBarComponent,
                        PbdsDatavizLineComponent,
                        PbdsDatavizGaugeComponent,
                        PbdsDatavizSparklineComponent,
                        PbdsDatavizBarStackedComponent,
                        PbdsDatavizMetricBlockComponent,
                        PbdsDatavizBubbleMapComponent,
                        PbdsDatavizMetricIndicatorComponent,
                        PbdsDatavizHeatmapComponent,
                        PbdsDatavizChoroplethMapComponent,
                        PbdsDatavizBarGroupedComponent,
                        PbdsDatavizBarSingleHorizontalComponent,
                        PbdsDatavizScatterplotComponent,
                        PbdsBarStackedAnnotationsDirective,
                        PbdsLineAnnotationsDirective,
                        PbdsBarGroupedAnnotationsDirective,
                        PbdsBarAnnotationsDirective
                    ],
                    imports: [CommonModule, NgbTooltipModule],
                    exports: [
                        PbdsDatavizPieComponent,
                        PbdsDatavizBarComponent,
                        PbdsDatavizLineComponent,
                        PbdsDatavizGaugeComponent,
                        PbdsDatavizSparklineComponent,
                        PbdsDatavizBarStackedComponent,
                        PbdsDatavizMetricBlockComponent,
                        PbdsDatavizBubbleMapComponent,
                        PbdsDatavizMetricIndicatorComponent,
                        PbdsDatavizHeatmapComponent,
                        PbdsDatavizChoroplethMapComponent,
                        PbdsDatavizBarGroupedComponent,
                        PbdsDatavizBarSingleHorizontalComponent,
                        PbdsDatavizScatterplotComponent,
                        PbdsBarStackedAnnotationsDirective,
                        PbdsLineAnnotationsDirective,
                        PbdsBarGroupedAnnotationsDirective,
                        PbdsBarAnnotationsDirective
                    ]
                }]
        }] });

// dataviz

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsBarAnnotationsDirective, PbdsBarGroupedAnnotationsDirective, PbdsBarStackedAnnotationsDirective, PbdsDatavizBarComponent, PbdsDatavizBarGroupedComponent, PbdsDatavizBarSingleHorizontalComponent, PbdsDatavizBarStackedComponent, PbdsDatavizBubbleMapComponent, PbdsDatavizChoroplethMapComponent, PbdsDatavizGaugeComponent, PbdsDatavizHeatmapComponent, PbdsDatavizLineComponent, PbdsDatavizMetricBlockComponent, PbdsDatavizMetricIndicatorComponent, PbdsDatavizModule, PbdsDatavizPieComponent, PbdsDatavizScatterplotComponent, PbdsDatavizService, PbdsDatavizSparklineComponent, PbdsLineAnnotationsDirective };
//# sourceMappingURL=pb-design-system-dataviz.mjs.map

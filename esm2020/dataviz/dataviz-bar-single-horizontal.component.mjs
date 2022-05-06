import { Component, Input, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { scaleOrdinal as d3_scaleOrdinal, scaleLinear as d3_scaleLinear } from 'd3-scale';
import { sum as d3_sum } from 'd3-array';
import { axisBottom as d3_axisBottom } from 'd3-axis';
import { format as d3_format } from 'd3-format';
import { timeFormat as d3_timeFormat, isoParse as d3_isoParse } from 'd3-time-format';
import { easeLinear as d3_easeLinear } from 'd3-ease';
import * as i0 from "@angular/core";
import * as i1 from "./dataviz.service";
import * as i2 from "@angular/common";
export class PbdsDatavizBarSingleHorizontalComponent {
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
        this.gradient = true;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.isSingleData = false;
        this.isCompare = false;
        this.barPadding = 40;
        this.barMouseOver = (event, data) => {
            const node = d3_select(event.currentTarget);
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
            const percentage = data.value / d3_sum(this.data, (d) => d.value);
            const comparePercentage = data.compareValue / d3_sum(this.data, (d) => d.compareValue);
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
                        const parsedTime = d3_isoParse(data.label);
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
                tooltipCompareDaterange = `${this.tooltipDateFormat(d3_isoParse(data.compareStartDate))} - ${this.tooltipDateFormat(d3_isoParse(data.compareEndDate))}`;
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
                tooltipDaterange = `${this.tooltipDateFormat(d3_isoParse(data.startDate))} - ${this.tooltipDateFormat(d3_isoParse(data.endDate))}`;
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
        this.tooltipDateFormat = d3_timeFormat(this.tooltipDateFormatString);
        this.tooltipPercentFormat = d3_format(this.tooltipPercentFormatString);
        this.tooltipCompareChangeFormat = d3_format(this.compareChangeFormatString);
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
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
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
            this.tooltip = d3_select('body')
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
        this.xAxisScale = d3_scaleLinear()
            .domain([0, Math.ceil(d3_sum(this.data, (d) => d.value))])
            .range([0, +this.width]);
        this.xAxisCall = d3_axisBottom(this.xAxisScale)
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
            this.xGridCall = d3_axisBottom(this.xAxisScale).tickSize(-this.height);
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
        this.colorRange = d3_scaleOrdinal().range(colors);
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
        const sumValues = d3_sum(this.data, (d) => d.value);
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
                const format = d3_format('.0%');
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
                const format = d3_format('.0%');
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
                .ease(d3_easeLinear)
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
                            const parsedTime = d3_isoParse(d.label);
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
                            const parsedTime = d3_isoParse(d.label);
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
PbdsDatavizBarSingleHorizontalComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsDatavizBarSingleHorizontalComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBarSingleHorizontalComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.4", type: PbdsDatavizBarSingleHorizontalComponent, selector: "pbds-dataviz-bar-single-horizontal", inputs: { data: "data", width: "width", height: "height", nullValueText: "nullValueText", percentage: "percentage", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", barMargin: "barMargin", hideXAxis: "hideXAxis", xAxisTicks: "xAxisTicks", xAxisTitle: "xAxisTitle", xAxisFormatType: "xAxisFormatType", xAxisFormatString: "xAxisFormatString", xAxisTickLabelSuffix: "xAxisTickLabelSuffix", hideXGrid: "hideXGrid", hideLegend: "hideLegend", hideLegendTooltip: "hideLegendTooltip", legendWidth: "legendWidth", legendPosition: "legendPosition", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", hideTooltip: "hideTooltip", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipDateFormatString: "tooltipDateFormatString", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", tooltipValueSuffix: "tooltipValueSuffix", tooltipPercentFormatString: "tooltipPercentFormatString", compareChangeFormatString: "compareChangeFormatString", monochrome: "monochrome", theme: "theme", gradient: "gradient" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-bar-single-horizontal": "this.singleStackedBarClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsDatavizBarSingleHorizontalComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pbds-dataviz-bar-single-horizontal',
                    template: ``,
                    styles: [],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i1.PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }, { type: i2.Location }]; }, propDecorators: { chartClass: [{
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
            }], theme: [{
                type: Input
            }], gradient: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc2luZ2xlLWhvcml6b250YWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRhdml6L2RhdGF2aXotYmFyLXNpbmdsZS1ob3Jpem9udGFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxXQUFXLEVBR1gsTUFBTSxFQUNOLFlBQVksRUFDWix1QkFBdUIsRUFFeEIsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksSUFBSSxlQUFlLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMxRixPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsVUFBVSxJQUFJLGFBQWEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUN0RCxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNoRCxPQUFPLEVBQUUsVUFBVSxJQUFJLGFBQWEsRUFBRSxRQUFRLElBQUksV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEYsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsTUFBTSxTQUFTLENBQUM7Ozs7QUFXdEQsTUFBTSxPQUFPLHVDQUF1QztJQWdKbEQsWUFDVSxRQUE0QixFQUM1QixRQUFvQixFQUNwQixPQUF5QixFQUN6QixTQUFtQjtRQUhuQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQ3pCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFsSjdCLGVBQVUsR0FB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XG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciwgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IHNjYWxlT3JkaW5hbCBhcyBkM19zY2FsZU9yZGluYWwsIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgc3VtIGFzIGQzX3N1bSB9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7IGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSB9IGZyb20gJ2QzLWF4aXMnO1xuaW1wb3J0IHsgZm9ybWF0IGFzIGQzX2Zvcm1hdCB9IGZyb20gJ2QzLWZvcm1hdCc7XG5pbXBvcnQgeyB0aW1lRm9ybWF0IGFzIGQzX3RpbWVGb3JtYXQsIGlzb1BhcnNlIGFzIGQzX2lzb1BhcnNlIH0gZnJvbSAnZDMtdGltZS1mb3JtYXQnO1xuaW1wb3J0IHsgZWFzZUxpbmVhciBhcyBkM19lYXNlTGluZWFyIH0gZnJvbSAnZDMtZWFzZSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbCwgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsQ29tcGFyZSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWJhci1zaW5nbGUtaG9yaXpvbnRhbCcsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1iYXItc2luZ2xlLWhvcml6b250YWwnKVxuICBzaW5nbGVTdGFja2VkQmFyQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbCB8IFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBhcmU+O1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzAwO1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwO1xuXG4gIEBJbnB1dCgpXG4gIG51bGxWYWx1ZVRleHQgPSAnTm8gZGF0YSBhdmFpbGFibGUnO1xuXG4gIEBJbnB1dCgpXG4gIHBlcmNlbnRhZ2UgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAxMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5SaWdodCA9IDIwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDM1O1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkxlZnQgPSAxNTtcblxuICBASW5wdXQoKVxuICBiYXJNYXJnaW4gPSAyO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVYQXhpcyA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGlja3MgPSA2O1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzVGl0bGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgeEF4aXNUaWNrTGFiZWxTdWZmaXggPSAnJztcblxuICBASW5wdXQoKVxuICBoaWRlWEdyaWQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBoaWRlTGVnZW5kID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZFRvb2x0aXAgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMTA1ICsgMjg7IC8vIGhhcmRjb2RlZCBsZWdlbmQgd2lkdGggKyBsZWZ0IG1hcmdpbiwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbGVnZW5kUG9zaXRpb246ICdyaWdodCcgfCAnYm90dG9tJyA9ICdib3R0b20nO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGlkZVRvb2x0aXAgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcERhdGVGb3JtYXRTdHJpbmcgPSAnJWIgJWUsICVZJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlU3VmZml4ID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFBlcmNlbnRGb3JtYXRTdHJpbmcgPSAnLjIlJztcblxuICBASW5wdXQoKVxuICBjb21wYXJlQ2hhbmdlRm9ybWF0U3RyaW5nID0gJy4yJSc7XG5cbiAgQElucHV0KClcbiAgbW9ub2Nocm9tZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lOiAnY2xhc3NpYycgfCAnb2NlYW4nIHwgJ3N1bnNldCcgfCAndHdpbGlnaHQnO1xuXG4gIEBJbnB1dCgpIGdyYWRpZW50ID0gdHJ1ZTtcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGlzU2luZ2xlRGF0YSA9IGZhbHNlO1xuICBwcml2YXRlIGlzQ29tcGFyZSA9IGZhbHNlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBiYXJQYWRkaW5nID0gNDA7XG4gIHByaXZhdGUgeEF4aXNDYWxsO1xuICBwcml2YXRlIHhBeGlzO1xuICBwcml2YXRlIHhBeGlzU2NhbGU7XG4gIHByaXZhdGUgeEF4aXNUaWNrU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemVPdXRlcjogbnVtYmVyO1xuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xuICBwcml2YXRlIHhBeGlzVGl0bGVNYXJnaW46IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSB4R3JpZDtcbiAgcHJpdmF0ZSB4R3JpZENhbGw7XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBEYXRlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBQZXJjZW50Rm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcixcbiAgICBwcml2YXRlIF9sb2NhdGlvbjogTG9jYXRpb25cbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gK3RoaXMuaGVpZ2h0ICsgdGhpcy5iYXJQYWRkaW5nO1xuXG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICB0aGlzLmlzU2luZ2xlRGF0YSA9IHRoaXMuZGF0YS5sZW5ndGggPT09IDEgPyB0cnVlIDogZmFsc2U7XG4gICAgdGhpcy5pc0NvbXBhcmUgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLmluY2x1ZGVzKCdjb21wYXJlVmFsdWUnKTtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy54QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy54QXhpc0Zvcm1hdFR5cGUsIHRoaXMueEF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwRGF0ZUZvcm1hdCA9IGQzX3RpbWVGb3JtYXQodGhpcy50b29sdGlwRGF0ZUZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwUGVyY2VudEZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMuY29tcGFyZUNoYW5nZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXG4gICAgdGhpcy5oaWRlWEF4aXNaZXJvID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSB0cnVlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSB0cnVlO1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZSA9IDg7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplT3V0ZXIgPSAwO1xuICAgIHRoaXMueEF4aXNUaXRsZU1hcmdpbiA9IHRoaXMueEF4aXNUaXRsZSA/IDMwIDogMDtcblxuICAgIGlmICghdGhpcy5oaWRlTGVnZW5kICYmIHRoaXMubGVnZW5kUG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMud2lkdGggPSArdGhpcy53aWR0aCAtICt0aGlzLmxlZ2VuZFdpZHRoO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICgpID0+IHtcbiAgICAgICAgcmV0dXJuICt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgICAgfSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20gKyB0aGlzLnhBeGlzVGl0bGVNYXJnaW4pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0fSAke1xuICAgICAgICAgICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSArIHRoaXMueEF4aXNUaXRsZU1hcmdpblxuICAgICAgICB9YDtcbiAgICAgIH0pO1xuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5jbGFzc2VkKCdwYmRzLXRvb2x0aXAtY29tcGFyZScsIHRoaXMuaXNDb21wYXJlKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcbiAgICB9XG5cbiAgICAvLyBhZGQgbGVnZW5kIGNsYXNzZXNcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCAmJiB0aGlzLmRhdGEubGVuZ3RoID4gMSkge1xuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcbiAgICB9XG5cbiAgICAvLyBYIEFYSVNcbiAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCBNYXRoLmNlaWwoZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC52YWx1ZSkpXSlcbiAgICAgIC5yYW5nZShbMCwgK3RoaXMud2lkdGhdKTtcblxuICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAvLyAudGlja1ZhbHVlcyhbMCwgZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC52YWx1ZSldKVxuICAgICAgLnRpY2tzKHRoaXMueEF4aXNUaWNrcylcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnhBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXMpXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc0RvbWFpbilcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzVGlja3MpO1xuICAgIC8vIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIC8vIFggR1JJRExJTkVTXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZENhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSkudGlja1NpemUoLXRoaXMuaGVpZ2h0KTtcblxuICAgICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXgnKVxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnhBeGlzVGl0bGUpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcy10aXRsZScpXG4gICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAuYXR0cihcbiAgICAgICAgICAndHJhbnNmb3JtJyxcbiAgICAgICAgICBgdHJhbnNsYXRlKCR7dGhpcy5zdmcuYXR0cignd2lkdGgnKSAvIDIgLSB0aGlzLm1hcmdpbi5sZWZ0IC8gMiAtIHRoaXMubWFyZ2luLnJpZ2h0IC8gMn0sICR7XG4gICAgICAgICAgICB0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArICh0aGlzLmhpZGVYQXhpcyA/IDIwIDogNDApXG4gICAgICAgICAgfSlgXG4gICAgICAgIClcbiAgICAgICAgLy8gLmF0dHIoJ3gnLCB0aGlzLndpZHRoIC8gMiAtIHRoaXMubWFyZ2luLmxlZnQpXG4gICAgICAgIC8vIC5hdHRyKCd5JywgdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyAoIXRoaXMuaGlkZVhBeGlzID8gNDAgOiAwKSlcbiAgICAgICAgLnRleHQodGhpcy54QXhpc1RpdGxlKTtcbiAgICB9XG5cbiAgICAvLyBidWlsZCBjb2xvciByYW5nZXNcbiAgICBsZXQgY29sb3JzO1xuXG4gICAgaWYgKHRoaXMuaXNTaW5nbGVEYXRhKSB7XG4gICAgICBjb2xvcnMgPSB0aGlzLl9kYXRhdml6LmNyZWF0ZUdyYWRpZW50RGVmcyh0aGlzLnN2ZywgdGhpcy5tb25vY2hyb21lLCB0aGlzLnRoZW1lLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1vbm9jaHJvbWUpIHtcbiAgICAgIGNvbG9ycyA9IHRoaXMuX2RhdGF2aXouZ2V0Q29sb3JzKHRoaXMubW9ub2Nocm9tZSwgdGhpcy50aGVtZSkucmV2ZXJzZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xvcnMgPSB0aGlzLl9kYXRhdml6LmdldENvbG9ycyh0aGlzLm1vbm9jaHJvbWUsIHRoaXMudGhlbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpLnJhbmdlKGNvbG9ycyk7XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnQoKSB7XG4gICAgdGhpcy5pc1NpbmdsZURhdGEgPSB0aGlzLmRhdGEubGVuZ3RoID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHRoaXMuaXNDb21wYXJlID0gT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5pbmNsdWRlcygnY29tcGFyZVZhbHVlJyk7XG5cbiAgICBjb25zdCBzdW1WYWx1ZXMgPSBkM19zdW0odGhpcy5kYXRhLCAoZDogYW55KSA9PiBkLnZhbHVlKTtcbiAgICBjb25zdCBpc0xhc3RCYXJaZXJvID1cbiAgICAgIHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoIC0gMV0udmFsdWUgPT09IDAgfHwgdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXS52YWx1ZSA9PT0gbnVsbCA/IHRydWUgOiBmYWxzZTtcblxuICAgIGxldCBsYXN0QmFyWmVyb0NvdW50ID0gMDtcbiAgICBjb25zdCBjbG9uZURhdGEgPSBbLi4udGhpcy5kYXRhXTtcbiAgICBsZXQgaXNMYXN0ID0gZmFsc2U7XG5cbiAgICBjbG9uZURhdGEucmV2ZXJzZSgpLmZvckVhY2goKHZhbHVlLCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgIGlmICgodmFsdWUudmFsdWUgPT09IDAgfHwgdmFsdWUudmFsdWUgPT09IG51bGwpICYmICFpc0xhc3QpIHtcbiAgICAgICAgbGFzdEJhclplcm9Db3VudCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNMYXN0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnBlcmNlbnRhZ2UgJiYgIXRoaXMuaXNTaW5nbGVEYXRhKSB7XG4gICAgICB0aGlzLnhBeGlzU2NhbGUuZG9tYWluKFswLCBzdW1WYWx1ZXNdKS5yYW5nZShbMCwgK3RoaXMud2lkdGhdKTtcbiAgICAgIHRoaXMueEF4aXNDYWxsLnRpY2tWYWx1ZXMoWzAsIHN1bVZhbHVlcyAqIDAuMjUsIHN1bVZhbHVlcyAqIDAuNSwgc3VtVmFsdWVzICogMC43NSwgc3VtVmFsdWVzXSk7XG4gICAgICB0aGlzLnhBeGlzLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgICB0aGlzLnhHcmlkQ2FsbC50aWNrVmFsdWVzKFswLCBzdW1WYWx1ZXMgKiAwLjI1LCBzdW1WYWx1ZXMgKiAwLjUsIHN1bVZhbHVlcyAqIDAuNzUsIHN1bVZhbHVlc10pO1xuICAgICAgdGhpcy54R3JpZC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcblxuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdCgnLmF4aXMteCcpXG4gICAgICAgIC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgICAuaHRtbCgoZCwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZvcm1hdCA9IGQzX2Zvcm1hdCgnLjAlJyk7XG4gICAgICAgICAgcmV0dXJuIGZvcm1hdChpICogMC4yNSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wZXJjZW50YWdlICYmIHRoaXMuaXNTaW5nbGVEYXRhKSB7XG4gICAgICB0aGlzLnhBeGlzU2NhbGUuZG9tYWluKFswLCAxLjBdKS5yYW5nZShbMCwgK3RoaXMud2lkdGhdKTtcbiAgICAgIHRoaXMueEF4aXNDYWxsLnRpY2tWYWx1ZXMoWzAsIDAuMjUsIDAuNSwgMC43NSwgMS4wXSk7XG4gICAgICB0aGlzLnhBeGlzLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgICB0aGlzLnhHcmlkQ2FsbC50aWNrVmFsdWVzKFswLCAwLjI1LCAwLjUsIDAuNzUsIDEuMF0pO1xuICAgICAgdGhpcy54R3JpZC5jYWxsKHRoaXMueEdyaWRDYWxsKTtcblxuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdCgnLmF4aXMteCcpXG4gICAgICAgIC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgICAuaHRtbCgoZCwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZvcm1hdCA9IGQzX2Zvcm1hdCgnLjAlJyk7XG4gICAgICAgICAgcmV0dXJuIGZvcm1hdChpICogMC4yNSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnhBeGlzU2NhbGUuZG9tYWluKFswLCBNYXRoLmNlaWwoc3VtVmFsdWVzKV0pLnJhbmdlKFswLCArdGhpcy53aWR0aF0pO1xuICAgICAgdGhpcy54R3JpZENhbGwudGlja1ZhbHVlcyh0aGlzLnhBeGlzU2NhbGUudGlja3MoKS5maWx0ZXIoKG4pID0+IE51bWJlci5pc0ludGVnZXIobikpKTsgLy8gcmVtb3ZlIGRlY2ltYWwgZ3JpZCB2YWx1ZXNcblxuICAgICAgdGhpcy54QXhpcy50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAgIC8vIHVwZGF0ZSB0aGUgZ3JpZHNcbiAgICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAgICAgdGhpcy54R3JpZC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmpvaW4oXG4gICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDApXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgLSB0aGlzLmJhclBhZGRpbmc7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCkgPT4gdGhpcy5iYXJGaWxsKGQpKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhclBhZGRpbmcgLyAyO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zbGljZSgwLCBpKS5yZWR1Y2UoKGFjYywgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFjYywgaXRlbSwgYWNjICsgdGhpcy54QXhpc1NjYWxlKGl0ZW0udmFsdWUpICsgdGhpcy5iYXJNYXJnaW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiArYWNjICsgK3RoaXMueEF4aXNTY2FsZShpdGVtLnZhbHVlKTtcbiAgICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLmNhbGwoKGVudGVyKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC8vIC5kdXJhdGlvbigwKVxuICAgICAgICAgICAgICAgICAgLmRlbGF5KChkLCBpKSA9PiBpICogMjUwKVxuICAgICAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZUxpbmVhcilcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5kYXRhLmxlbmd0aCAtIGxhc3RCYXJaZXJvQ291bnQgLSAxICYmIGlzTGFzdEJhclplcm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgIT09IHRoaXMuZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHdpZHRoID0gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpIC0gK3RoaXMuYmFyTWFyZ2luO1xuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoID0gTWF0aC5zaWduKHdpZHRoKSA9PT0gLTEgPyAwIDogd2lkdGg7IC8vIGhhbmRsZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJylcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgaWYgKGQudmFsdWUgPT09IG51bGwgfHwgZC52YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUoMCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gdGhpcy5kYXRhLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc1NjYWxlKGQudmFsdWUpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUoZC52YWx1ZSkgLSB0aGlzLmJhck1hcmdpbjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zbGljZSgwLCBpKS5yZWR1Y2UoKGFjYywgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2MgKyArdGhpcy54QXhpc1NjYWxlKGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuc2VsZWN0aW9uKClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgIChleGl0KSA9PiBleGl0LnRyYW5zaXRpb24oKS5zZWxlY3Rpb24oKS5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJykucmVtb3ZlKClcbiAgICAgIClcbiAgICAgIC5kYXR1bSgoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4geyBkYXRhOiB0aGlzLmRhdGEsIGluZGV4OiBpIH07XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYmFyTW91c2VPdmVyKGV2ZW50LCBkYXRhKSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYmFyTW91c2VPdXQoKSlcbiAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYmFyTW91c2VDbGljayhldmVudCwgZGF0YSkpO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuY2hhcnRcbiAgICAgICAgLnNlbGVjdCgnLmxlZ2VuZCcpXG4gICAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgKGVudGVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaSA9IGVudGVyLmFwcGVuZCgnbGknKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2FsaWduLWl0ZW1zLXN0YXJ0JywgdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBsaS5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWtleScpXG4gICAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIChkKSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpXG4gICAgICAgICAgICAgIC5jbGFzc2VkKCdtdC0xJywgdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBsaS5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWRlc2NyaXB0aW9uJylcbiAgICAgICAgICAgICAgLmNsYXNzZWQoJ2QtZmxleCcsIHRoaXMuaXNDb21wYXJlKVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnZmxleC1jb2x1bW4nLCB0aGlzLmlzQ29tcGFyZSk7XG5cbiAgICAgICAgICAgIGxpLnNlbGVjdCgnLmxlZ2VuZC1kZXNjcmlwdGlvbicpXG4gICAgICAgICAgICAgIC5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJylcbiAgICAgICAgICAgICAgLmh0bWwoKGQpID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChkLmxhYmVsKTtcblxuICAgICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxpLnNlbGVjdCgnLmxlZ2VuZC1kZXNjcmlwdGlvbicpXG4gICAgICAgICAgICAgIC5pbnNlcnQoJ2RpdicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtY2hhbmdlJylcbiAgICAgICAgICAgICAgLmNsYXNzZWQoJ2Qtbm9uZScsICF0aGlzLmlzQ29tcGFyZSk7XG5cbiAgICAgICAgICAgIGxpLnNlbGVjdCgnLmxlZ2VuZC1jaGFuZ2UnKS5odG1sKChkKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1pbmRpY2F0b3IgJHtkLmNvbXBhcmVDaGFuZ2VEaXJlY3Rpb259ICR7XG4gICAgICAgICAgICAgICAgZC5jb21wYXJlQ2hhbmdlSW52ZXJzZSA/ICdpbnZlcnNlJyA6ICcnXG4gICAgICAgICAgICAgIH0gbXQtMVwiPjxzcGFuPiR7dGhpcy50b29sdGlwQ29tcGFyZUNoYW5nZUZvcm1hdChkLmNvbXBhcmVDaGFuZ2VWYWx1ZSl9PC9zcGFuPjwvZGl2PmA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgdXBkYXRlLmNsYXNzZWQoJ2FsaWduLWl0ZW1zLXN0YXJ0JywgdGhpcy5pc0NvbXBhcmUpO1xuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1rZXknKS5jbGFzc2VkKCdtdC0xJywgdGhpcy5pc0NvbXBhcmUpO1xuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1jaGFuZ2UnKS5jbGFzc2VkKCdkLW5vbmUnLCAhdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBhcmUpIHtcbiAgICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1jaGFuZ2UnKS5odG1sKChkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWluZGljYXRvciAke2QuY29tcGFyZUNoYW5nZURpcmVjdGlvbn0gJHtcbiAgICAgICAgICAgICAgICAgIGQuY29tcGFyZUNoYW5nZUludmVyc2UgPyAnaW52ZXJzZScgOiAnJ1xuICAgICAgICAgICAgICAgIH0gbXQtMVwiPjxzcGFuPiR7dGhpcy50b29sdGlwQ29tcGFyZUNoYW5nZUZvcm1hdChkLmNvbXBhcmVDaGFuZ2VWYWx1ZSl9PC9zcGFuPjwvZGl2PmA7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLWxhYmVsJykuaHRtbCgoZCkgPT4ge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApXG4gICAgICAgIC5kYXR1bSgoZCwgaSkgPT4ge1xuICAgICAgICAgIHJldHVybiB7IGRhdGE6IHRoaXMuZGF0YSwgaW5kZXg6IGkgfTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMubGVnZW5kTW91c2VPdmVyKGV2ZW50LCBkYXRhKSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHRoaXMubGVnZW5kTW91c2VPdXQoKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4gdGhpcy5sZWdlbmRNb3VzZUNsaWNrKGV2ZW50LCBkYXRhKSk7XG4gICAgfVxuICB9XG5cbiAgYmFyTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IGQzX3NlbGVjdChldmVudC5jdXJyZW50VGFyZ2V0KTtcblxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuYmFyJykuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIG5vZGUuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgcmV0dXJuIGkgIT09IGRhdGEuaW5kZXg7XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTaG93KGV2ZW50LCBkYXRhLmRhdGFbZGF0YS5pbmRleF0pO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBiYXJNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmJhcicpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpLnN0eWxlKCdmaWxsJywgbnVsbCk7XG5cbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgYmFyTW91c2VDbGljayA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChldmVudCwgZGF0YSwgbm9kZT8pID0+IHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0gbm9kZSA/IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgOiBldmVudC5jdXJyZW50VGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuXG4gICAgY29uc3QgcGVyY2VudGFnZSA9IGRhdGEudmFsdWUgLyBkM19zdW0odGhpcy5kYXRhLCAoZDogYW55KSA9PiBkLnZhbHVlKTtcbiAgICBjb25zdCBjb21wYXJlUGVyY2VudGFnZSA9IGRhdGEuY29tcGFyZVZhbHVlIC8gZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC5jb21wYXJlVmFsdWUpO1xuXG4gICAgbGV0IHRvb2x0aXBMYWJlbCA9IGBgO1xuICAgIGxldCB0b29sdGlwQ29tcGFyZURhdGVyYW5nZU1hcmdpbiA9IGBgO1xuICAgIGxldCB0b29sdGlwQ29tcGFyZURhdGVyYW5nZSA9IGBgO1xuICAgIGxldCB0b29sdGlwQ29tcGFyZVZhbHVlID0gYGA7XG4gICAgbGV0IHRvb2x0aXBEYXRlcmFuZ2VNYXJnaW4gPSBgYDtcbiAgICBsZXQgdG9vbHRpcERhdGVyYW5nZSA9IGBgO1xuICAgIGxldCB0b29sdGlwVmFsdWUgPSBgJHt0aGlzLm51bGxWYWx1ZVRleHR9YDtcbiAgICBsZXQgdG9vbHRpcEluZGljYXRvciA9ICcnO1xuXG4gICAgLy8gdG9vbHRpcCBsYWJlbFxuICAgIGlmICghdGhpcy5pc1NpbmdsZURhdGEpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdwYmRzLXRvb2x0aXAtY29tcGFyZScsIG51bGwpO1xuXG4gICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIHRvb2x0aXBMYWJlbCA9IHRoaXMudG9vbHRpcExhYmVsRm9ybWF0KGRhdGEubGFiZWwpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkYXRhLmxhYmVsKTtcbiAgICAgICAgICB0b29sdGlwTGFiZWwgPSB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRvb2x0aXBMYWJlbCA9IGRhdGEubGFiZWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdG9vbHRpcCBjb21wYXJlIGRhdGVyYW5nZVxuICAgIGlmICh0aGlzLmlzQ29tcGFyZSAmJiBkYXRhLmNvbXBhcmVTdGFydERhdGUgJiYgZGF0YS5jb21wYXJlRW5kRGF0ZSkge1xuICAgICAgdGhpcy50b29sdGlwLmNsYXNzZWQoJ3BiZHMtdG9vbHRpcC1jb21wYXJlJywgdGhpcy5pc0NvbXBhcmUpO1xuICAgICAgdG9vbHRpcENvbXBhcmVEYXRlcmFuZ2VNYXJnaW4gPSBgbXQtMmA7XG5cbiAgICAgIHRvb2x0aXBDb21wYXJlRGF0ZXJhbmdlID0gYCR7dGhpcy50b29sdGlwRGF0ZUZvcm1hdChcbiAgICAgICAgZDNfaXNvUGFyc2UoZGF0YS5jb21wYXJlU3RhcnREYXRlKVxuICAgICAgKX0gLSAke3RoaXMudG9vbHRpcERhdGVGb3JtYXQoZDNfaXNvUGFyc2UoZGF0YS5jb21wYXJlRW5kRGF0ZSkpfWA7XG4gICAgfVxuXG4gICAgLy8gdG9vbHRpcCBjb21wYXJlIHZhbHVlXG4gICAgaWYgKHRoaXMucGVyY2VudGFnZSAmJiB0aGlzLmlzQ29tcGFyZSAmJiBkYXRhLmNvbXBhcmVWYWx1ZSkge1xuICAgICAgdG9vbHRpcENvbXBhcmVWYWx1ZSA9XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgICAgPyBgJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KGNvbXBhcmVQZXJjZW50YWdlKX0gKCR7ZGF0YS5jb21wYXJ2ZVZhbHVlfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9KWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQoY29tcGFyZVBlcmNlbnRhZ2UpfSAoJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLmNvbXBhcmVWYWx1ZSl9JHtcbiAgICAgICAgICAgICAgdGhpcy50b29sdGlwVmFsdWVTdWZmaXhcbiAgICAgICAgICAgIH0pYDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb21wYXJlICYmIGRhdGEuY29tcGFyZVZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0b29sdGlwQ29tcGFyZVZhbHVlID1cbiAgICAgICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPT09IG51bGxcbiAgICAgICAgICA/IGAke2RhdGEuY29tcGFyZVZhbHVlfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9ICgke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQoY29tcGFyZVBlcmNlbnRhZ2UpfSlgXG4gICAgICAgICAgOiBgJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLmNvbXBhcmVWYWx1ZSl9JHt0aGlzLnRvb2x0aXBWYWx1ZVN1ZmZpeH0gKCR7dGhpcy50b29sdGlwUGVyY2VudEZvcm1hdChcbiAgICAgICAgICAgICAgY29tcGFyZVBlcmNlbnRhZ2VcbiAgICAgICAgICAgICl9KWA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzQ29tcGFyZSAmJiBkYXRhLmNvbXBhcmVWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdG9vbHRpcENvbXBhcmVWYWx1ZSA9IGAke3RoaXMubnVsbFZhbHVlVGV4dH1gO1xuICAgIH1cblxuICAgIC8vIHRvb2x0aXAgZGF0ZXJhbmdlXG4gICAgaWYgKGRhdGEuc3RhcnREYXRlICYmIGRhdGEuZW5kRGF0ZSkge1xuICAgICAgdG9vbHRpcERhdGVyYW5nZSA9IGAke3RoaXMudG9vbHRpcERhdGVGb3JtYXQoZDNfaXNvUGFyc2UoZGF0YS5zdGFydERhdGUpKX0gLSAke3RoaXMudG9vbHRpcERhdGVGb3JtYXQoXG4gICAgICAgIGQzX2lzb1BhcnNlKGRhdGEuZW5kRGF0ZSlcbiAgICAgICl9YDtcbiAgICB9XG5cbiAgICAvL3Rvb2x0aXAgZGF0ZXJhbmdlIG1hcmdpblxuICAgIGlmICh0b29sdGlwTGFiZWwgIT09ICcnKSB7XG4gICAgICB0b29sdGlwRGF0ZXJhbmdlTWFyZ2luID0gYG10LTJgO1xuICAgIH1cblxuICAgIC8vIHRvb2x0aXAgdmFsdWVcbiAgICBpZiAodGhpcy5pc1NpbmdsZURhdGEgJiYgdGhpcy5wZXJjZW50YWdlICYmIGRhdGEudmFsdWUpIHtcbiAgICAgIHRvb2x0aXBWYWx1ZSA9IHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsID8gYCR7ZGF0YS52YWx1ZX1gIDogYCR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS52YWx1ZSl9YDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTaW5nbGVEYXRhICYmIGRhdGEudmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBWYWx1ZSA9XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgICAgPyBgJHtkYXRhLnZhbHVlfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9YFxuICAgICAgICAgIDogYCR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS52YWx1ZSl9JHt0aGlzLnRvb2x0aXBWYWx1ZVN1ZmZpeH1gO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaW5nbGVEYXRhICYmIHRoaXMucGVyY2VudGFnZSAmJiBkYXRhLnZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0b29sdGlwVmFsdWUgPVxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICAgID8gYCR7dGhpcy50b29sdGlwUGVyY2VudEZvcm1hdChwZXJjZW50YWdlKX0gKCR7ZGF0YS52YWx1ZX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fSlgXG4gICAgICAgICAgOiBgJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KHBlcmNlbnRhZ2UpfSAoJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX0ke1xuICAgICAgICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZVN1ZmZpeFxuICAgICAgICAgICAgfSlgO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaW5nbGVEYXRhICYmIGRhdGEudmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBWYWx1ZSA9XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgICAgPyBgJHtkYXRhLnZhbHVlfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9ICgke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQocGVyY2VudGFnZSl9KWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9ICgke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQoXG4gICAgICAgICAgICAgIHBlcmNlbnRhZ2VcbiAgICAgICAgICAgICl9KWA7XG4gICAgfVxuXG4gICAgLy8gdG9vbHRpcCBtZXRyaWMgaW5kaWNhdG9yXG4gICAgaWYgKCF0aGlzLmlzU2luZ2xlRGF0YSAmJiB0aGlzLmlzQ29tcGFyZSAmJiBkYXRhLnZhbHVlICE9PSBudWxsICYmIGRhdGEuY29tcGFyZVZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0b29sdGlwSW5kaWNhdG9yID0gYDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2staW5kaWNhdG9yICR7ZGF0YS5jb21wYXJlQ2hhbmdlRGlyZWN0aW9ufSAke1xuICAgICAgICBkYXRhLmNvbXBhcmVDaGFuZ2VJbnZlcnNlID8gJ2ludmVyc2UnIDogJydcbiAgICAgIH0gbWwtMlwiPjxzcGFuPiR7dGhpcy50b29sdGlwQ29tcGFyZUNoYW5nZUZvcm1hdChkYXRhLmNvbXBhcmVDaGFuZ2VWYWx1ZSl9PC9zcGFuPjwvZGl2PmA7XG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwLmh0bWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInRvb2x0aXAtbGFiZWwgZm9udC13ZWlnaHQtYm9sZFwiPiR7dG9vbHRpcExhYmVsfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHt0b29sdGlwQ29tcGFyZURhdGVyYW5nZU1hcmdpbn1cIj4ke3Rvb2x0aXBDb21wYXJlRGF0ZXJhbmdlfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZSBmb250LXdlaWdodC1ib2xkXCI+JHt0b29sdGlwQ29tcGFyZVZhbHVlfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHt0b29sdGlwRGF0ZXJhbmdlTWFyZ2lufVwiPiR7dG9vbHRpcERhdGVyYW5nZX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRvb2x0aXAtdmFsdWVcIj48c3BhbiBjbGFzcz1cImZvbnQtd2VpZ2h0LWJvbGRcIj4ke3Rvb2x0aXBWYWx1ZX08L3NwYW4+IDxzcGFuPiR7dG9vbHRpcEluZGljYXRvcn08L3NwYW4+PC9kaXY+XG4gICAgICBgO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdG9vbHRpcE9mZnNldFdpZHRoID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0V2lkdGggLyAyO1xuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgdG9vbHRpcFRpcFNpemUgPSA4O1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHsrc2Nyb2xsWzFdICsgK2RpbWVuc2lvbnMudG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodCAtIHRvb2x0aXBUaXBTaXplfXB4YCk7XG5cbiAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAkeytzY3JvbGxbMF0gKyArZGltZW5zaW9ucy5sZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRoICsgK2RpbWVuc2lvbnMud2lkdGggLyAyfXB4YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAkeytzY3JvbGxbMF0gLSB0b29sdGlwT2Zmc2V0V2lkdGggKyArZGltZW5zaW9ucy5yaWdodH1weGApO1xuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmRUb29sdGlwKSB7XG4gICAgICBjb25zdCBiYXJIb3ZlciA9IHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAuZmlsdGVyKChkLCBpKSA9PiBpID09PSBkYXRhLmluZGV4KVxuICAgICAgICAubm9kZSgpO1xuXG4gICAgICB0aGlzLnRvb2x0aXBTaG93KGV2ZW50LCBkYXRhLmRhdGFbZGF0YS5pbmRleF0sIGJhckhvdmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSAhPT0gZGF0YS5pbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBkYXRhLmluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICAvLyB0aGlzLmNoYXJ0XG4gICAgLy8gICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAvLyAgIC5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGRhdGEuaW5kZXgpXG4gICAgLy8gICAuY2xhc3NlZCgnaW5hY3RpdmUnLCBudWxsKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXInKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKS5zdHlsZSgnZmlsbCcsIG51bGwpO1xuXG4gICAgLy8gaGlkZSB0b29sdGlwIGZvciB6ZXJvL251bGwgdmFsdWVzXG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSAoaXRlbSkgPT4ge1xuICAgIHN3aXRjaCAodGhpcy54QXhpc0Zvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnhBeGlzRm9ybWF0KGl0ZW0pfSR7dGhpcy54QXhpc1RpY2tMYWJlbFN1ZmZpeH1gO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gYCR7aXRlbX0ke3RoaXMueEF4aXNUaWNrTGFiZWxTdWZmaXh9YDtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBiYXJGaWxsKGQpIHtcbiAgICBjb25zdCBwYXRoID0gdGhpcy5fbG9jYXRpb24ucGF0aCgpO1xuICAgIGNvbnN0IHVybCA9IHRoaXMuX2xvY2F0aW9uLnByZXBhcmVFeHRlcm5hbFVybChwYXRoKTtcbiAgICBjb25zdCBjb2xvclJhbmdlID0gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpO1xuXG4gICAgaWYgKHRoaXMuZ3JhZGllbnQgJiYgdGhpcy5pc1NpbmdsZURhdGEpIHtcbiAgICAgIHJldHVybiBgdXJsKCR7dXJsfSNncmFkaWVudC1ob3Jpem9udGFsLSR7Y29sb3JSYW5nZS5zdWJzdHIoMSl9KWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb2xvclJhbmdlO1xuICAgIH1cbiAgfVxufVxuIl19
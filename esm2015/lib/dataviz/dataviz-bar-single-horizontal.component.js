import { Component, Input, ElementRef, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller, Location } from '@angular/common';
import { select as d3_select, event as d3_event } from 'd3-selection';
import { scaleOrdinal as d3_scaleOrdinal, scaleLinear as d3_scaleLinear } from 'd3-scale';
import { sum as d3_sum } from 'd3-array';
import { axisBottom as d3_axisBottom } from 'd3-axis';
import { format as d3_format } from 'd3-format';
import { timeFormat as d3_timeFormat, isoParse as d3_isoParse } from 'd3-time-format';
import { easeLinear as d3_easeLinear } from 'd3-ease';
import { PbdsDatavizService } from './dataviz.service';
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
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.isSingleData = false;
        this.isCompare = false;
        this.barPadding = 40;
        this.barMouseOver = (event, data, index, nodes) => {
            const node = d3_select(nodes[index]);
            this.chart.selectAll('.bar').classed('inactive', true);
            node.classed('inactive', false);
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => {
                // debugger;
                return i !== index;
            })
                .classed('inactive', true);
            this.tooltipShow(data, nodes[index]);
            this.hovered.emit({ event, data });
        };
        this.barMouseOut = () => {
            this.chart
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.tooltipHide();
        };
        this.barMouseClick = (event, data, index, nodes) => {
            this.clicked.emit({ event, data });
        };
        this.tooltipShow = (data, node) => {
            const dimensions = node.getBoundingClientRect();
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
        this.legendMouseOver = (event, data, index, nodes) => {
            if (!this.hideLegendTooltip) {
                const barHover = this.svg
                    .selectAll('.bar')
                    .filter((d, i) => i === index)
                    .node();
                this.tooltipShow(data, barHover);
            }
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== index)
                .classed('inactive', true);
            this.chart
                .selectAll('.bar')
                .filter((d, i) => i !== index)
                .classed('inactive', true);
            this.chart
                .selectAll('.bar')
                .filter((d, i) => i === index)
                .classed('inactive', null);
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart
                .selectAll('.bar')
                .classed('inactive', false)
                .style('fill', null);
            // hide tooltip for zero/null values
            this.tooltipHide();
        };
        this.legendMouseClick = (event, data, index, nodes) => {
            this.clicked.emit({ event, data });
        };
        this.xAxisFormatter = item => {
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
        this.xAxisTitleMargin = this.xAxisTitle ? 20 : 0;
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
            return `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this
                .height +
                this.margin.top +
                this.margin.bottom +
                this.xAxisTitleMargin}`;
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
                .attr('text-anchor', 'center')
                .attr('x', this.width / 2 - this.margin.left)
                .attr('y', this.height + this.margin.top + (!this.hideXAxis ? 40 : 0))
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
            this.xGridCall.tickValues(this.xAxisScale.ticks().filter(n => Number.isInteger(n))); // remove decimal grid values
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
            .join(enter => enter
            .append('rect')
            .attr('class', 'bar')
            .attr('width', 0)
            .attr('height', () => {
            return this.height - this.barPadding;
        })
            .attr('fill', d => {
            if (this.isSingleData) {
                return `url(${this._location.path()}#gradient-horizontal-${this.colorRange(d.label).substr(1)})`;
            }
            else {
                return this.colorRange(d.label);
            }
        })
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
            .call(enter => {
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
        }), update => update
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
            .attr('pointer-events', 'auto'), exit => exit
            .transition()
            .attr('pointer-events', 'none')
            .remove())
            .on('mouseover', (data, index, nodes) => this.barMouseOver(d3_event, data, index, nodes))
            .on('mouseout', (data, index, nodes) => this.barMouseOut())
            .on('click', (data, index, nodes) => this.barMouseClick(d3_event, data, index, nodes));
        if (!this.hideLegend) {
            this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(this.data)
                .join(enter => {
                const li = enter
                    .append('li')
                    .attr('class', 'legend-item')
                    .classed('align-items-start', this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-key')
                    .style('background-color', d => this.colorRange(d.label))
                    .classed('mt-1', this.isCompare);
                li.insert('span')
                    .attr('class', 'legend-description')
                    .classed('d-flex', this.isCompare)
                    .classed('flex-column', this.isCompare);
                li.select('.legend-description')
                    .insert('span')
                    .attr('class', 'legend-label')
                    .html(d => {
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
                li.select('.legend-change').html(d => {
                    return `<div class="metric-block-indicator ${d.compareChangeDirection} ${d.compareChangeInverse ? 'inverse' : ''} mt-1"><span>${this.tooltipCompareChangeFormat(d.compareChangeValue)}</span></div>`;
                });
                return li;
            }, update => {
                update.classed('align-items-start', this.isCompare);
                update.select('.legend-key').classed('mt-1', this.isCompare);
                update.select('.legend-change').classed('d-none', !this.isCompare);
                if (this.isCompare) {
                    update.select('.legend-change').html(d => {
                        return `<div class="metric-block-indicator ${d.compareChangeDirection} ${d.compareChangeInverse ? 'inverse' : ''} mt-1"><span>${this.tooltipCompareChangeFormat(d.compareChangeValue)}</span></div>`;
                    });
                }
                update.select('.legend-label').html(d => {
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
            }, exit => exit.remove())
                .on('mouseover', (data, index, nodes) => this.legendMouseOver(d3_event, data, index, nodes))
                .on('mouseout', () => this.legendMouseOut())
                .on('click', (data, index, nodes) => this.legendMouseClick(d3_event, data, index, nodes));
        }
    }
}
PbdsDatavizBarSingleHorizontalComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar-single-horizontal',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc2luZ2xlLWhvcml6b250YWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9kYTA1N2NvL0Rlc2t0b3AvQ29kZS9uZy1kZXNpZ25zeXN0ZW0vY2xpZW50L3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vc3JjLyIsInNvdXJjZXMiOlsibGliL2RhdGF2aXovZGF0YXZpei1iYXItc2luZ2xlLWhvcml6b250YWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBR1gsTUFBTSxFQUNOLFlBQVksRUFDWix1QkFBdUIsRUFFeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTdELE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLEtBQUssSUFBSSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEUsT0FBTyxFQUFFLFlBQVksSUFBSSxlQUFlLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMxRixPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsVUFBVSxJQUFJLGFBQWEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUN0RCxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNoRCxPQUFPLEVBQUUsVUFBVSxJQUFJLGFBQWEsRUFBRSxRQUFRLElBQUksV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEYsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFdEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFTdkQsTUFBTSxPQUFPLHVDQUF1QztJ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S0FBSztvQkFHTCxLQUFLO3NCQUdMLE1BQU07c0JBR04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIsIExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCwgZXZlbnQgYXMgZDNfZXZlbnQgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgc2NhbGVPcmRpbmFsIGFzIGQzX3NjYWxlT3JkaW5hbCwgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBzdW0gYXMgZDNfc3VtIH0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHsgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tIH0gZnJvbSAnZDMtYXhpcyc7XG5pbXBvcnQgeyBmb3JtYXQgYXMgZDNfZm9ybWF0IH0gZnJvbSAnZDMtZm9ybWF0JztcbmltcG9ydCB7IHRpbWVGb3JtYXQgYXMgZDNfdGltZUZvcm1hdCwgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XG5pbXBvcnQgeyBlYXNlTGluZWFyIGFzIGQzX2Vhc2VMaW5lYXIgfSBmcm9tICdkMy1lYXNlJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsLCBQYmRzRGF0YXZpekJhclNpbmdsZUhvcml6b250YWxDb21wYXJlIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotYmFyLXNpbmdsZS1ob3Jpem9udGFsJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekJhclNpbmdsZUhvcml6b250YWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWJhci1zaW5nbGUtaG9yaXpvbnRhbCcpXG4gIHNpbmdsZVN0YWNrZWRCYXJDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogQXJyYXk8UGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsIHwgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsQ29tcGFyZT47XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAzMDA7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNDA7XG5cbiAgQElucHV0KClcbiAgbnVsbFZhbHVlVGV4dCA9ICdObyBkYXRhIGF2YWlsYWJsZSc7XG5cbiAgQElucHV0KClcbiAgcGVyY2VudGFnZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDEwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gMjA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMzU7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDE1O1xuXG4gIEBJbnB1dCgpXG4gIGJhck1hcmdpbiA9IDI7XG5cbiAgQElucHV0KClcbiAgaGlkZVhBeGlzID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgeEF4aXNUaWNrcyA9IDY7XG5cbiAgQElucHV0KClcbiAgeEF4aXNUaXRsZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeEF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB4QXhpc1RpY2tMYWJlbFN1ZmZpeCA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVYR3JpZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBoaWRlTGVnZW5kVG9vbHRpcCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kV2lkdGggPSAxMDUgKyAyODsgLy8gaGFyZGNvZGVkIGxlZ2VuZCB3aWR0aCArIGxlZnQgbWFyZ2luLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBsZWdlbmRQb3NpdGlvbjogJ3JpZ2h0JyB8ICdib3R0b20nID0gJ2JvdHRvbSc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBoaWRlVG9vbHRpcCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInIHwgJ3RpbWUnID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwRGF0ZUZvcm1hdFN0cmluZyA9ICclYiAlZSwgJVknO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVTdWZmaXggPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwUGVyY2VudEZvcm1hdFN0cmluZyA9ICcuMiUnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbXBhcmVDaGFuZ2VGb3JtYXRTdHJpbmcgPSAnLjIlJztcblxuICBASW5wdXQoKVxuICBtb25vY2hyb21lID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgdGhlbWU6ICdjbGFzc2ljJyB8ICdvY2VhbicgfCAnc3Vuc2V0JyB8ICd0d2lsaWdodCc7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBpc1NpbmdsZURhdGEgPSBmYWxzZTtcbiAgcHJpdmF0ZSBpc0NvbXBhcmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgYmFyUGFkZGluZyA9IDQwO1xuICBwcml2YXRlIHhBeGlzQ2FsbDtcbiAgcHJpdmF0ZSB4QXhpcztcbiAgcHJpdmF0ZSB4QXhpc1NjYWxlO1xuICBwcml2YXRlIHhBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSB4QXhpc0Zvcm1hdDtcbiAgcHJpdmF0ZSB4QXhpc1RpdGxlTWFyZ2luOiBudW1iZXI7XG4gIHByaXZhdGUgaGlkZVhBeGlzRG9tYWluOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVYQXhpc1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzVGlja3M6IGJvb2xlYW47XG4gIHByaXZhdGUgeEdyaWQ7XG4gIHByaXZhdGUgeEdyaWRDYWxsO1xuICBwcml2YXRlIGxlZ2VuZExhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgdG9vbHRpcExhYmVsRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwRGF0ZUZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwUGVyY2VudEZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwQ29tcGFyZUNoYW5nZUZvcm1hdDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIsXG4gICAgcHJpdmF0ZSBfbG9jYXRpb246IExvY2F0aW9uXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmhlaWdodCA9ICt0aGlzLmhlaWdodCArIHRoaXMuYmFyUGFkZGluZztcblxuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXG4gICAgICByaWdodDogK3RoaXMubWFyZ2luUmlnaHQsXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcbiAgICB9O1xuXG4gICAgdGhpcy5pc1NpbmdsZURhdGEgPSB0aGlzLmRhdGEubGVuZ3RoID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHRoaXMuaXNDb21wYXJlID0gT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5pbmNsdWRlcygnY29tcGFyZVZhbHVlJyk7XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMueEF4aXNGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMueEF4aXNGb3JtYXRUeXBlLCB0aGlzLnhBeGlzRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSwgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcERhdGVGb3JtYXQgPSBkM190aW1lRm9ybWF0KHRoaXMudG9vbHRpcERhdGVGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQgPSBkM19mb3JtYXQodGhpcy50b29sdGlwUGVyY2VudEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwQ29tcGFyZUNoYW5nZUZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLmNvbXBhcmVDaGFuZ2VGb3JtYXRTdHJpbmcpO1xuXG4gICAgLy8gZGVmYXVsdHMgZm9yIGFsbCBjaGFydCB0eXBlc1xuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICB0aGlzLnhBeGlzVGlja1NpemUgPSA4O1xuICAgIHRoaXMueEF4aXNUaWNrU2l6ZU91dGVyID0gMDtcbiAgICB0aGlzLnhBeGlzVGl0bGVNYXJnaW4gPSB0aGlzLnhBeGlzVGl0bGUgPyAyMCA6IDA7XG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCAmJiB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICB0aGlzLndpZHRoID0gK3RoaXMud2lkdGggLSArdGhpcy5sZWdlbmRXaWR0aDtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiArdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICAgIH0pXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tICsgdGhpcy54QXhpc1RpdGxlTWFyZ2luKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKCd2aWV3Qm94JywgKCkgPT4ge1xuICAgICAgICByZXR1cm4gYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodH0gJHsrdGhpc1xuICAgICAgICAgIC5oZWlnaHQgK1xuICAgICAgICAgIHRoaXMubWFyZ2luLnRvcCArXG4gICAgICAgICAgdGhpcy5tYXJnaW4uYm90dG9tICtcbiAgICAgICAgICB0aGlzLnhBeGlzVGl0bGVNYXJnaW59YDtcbiAgICAgIH0pO1xuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5jbGFzc2VkKCdwYmRzLXRvb2x0aXAtY29tcGFyZScsIHRoaXMuaXNDb21wYXJlKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcbiAgICB9XG5cbiAgICAvLyBhZGQgbGVnZW5kIGNsYXNzZXNcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCAmJiB0aGlzLmRhdGEubGVuZ3RoID4gMSkge1xuICAgICAgdGhpcy5jaGFydC5jbGFzc2VkKCdwYmRzLWNoYXJ0LWxlZ2VuZC1ib3R0b20nLCB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAnYm90dG9tJyA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsIGBsZWdlbmQgbGVnZW5kLSR7dGhpcy5sZWdlbmRQb3NpdGlvbn1gKTtcbiAgICB9XG5cbiAgICAvLyBYIEFYSVNcbiAgICB0aGlzLnhBeGlzU2NhbGUgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCBNYXRoLmNlaWwoZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC52YWx1ZSkpXSlcbiAgICAgIC5yYW5nZShbMCwgK3RoaXMud2lkdGhdKTtcblxuICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAvLyAudGlja1ZhbHVlcyhbMCwgZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC52YWx1ZSldKVxuICAgICAgLnRpY2tzKHRoaXMueEF4aXNUaWNrcylcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnhBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnhBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueEF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy54QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtaGlkZGVuJywgdGhpcy5oaWRlWEF4aXMpXG4gICAgICAuY2xhc3NlZCgnYXhpcy16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgIC5jbGFzc2VkKCdheGlzLWRvbWFpbi1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc0RvbWFpbilcbiAgICAgIC5jbGFzc2VkKCdheGlzLXRpY2tzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzVGlja3MpO1xuICAgIC8vIC5jYWxsKHRoaXMueEF4aXNDYWxsKTtcblxuICAgIC8vIFggR1JJRExJTkVTXG4gICAgaWYgKCF0aGlzLmhpZGVYR3JpZCkge1xuICAgICAgdGhpcy54R3JpZENhbGwgPSBkM19heGlzQm90dG9tKHRoaXMueEF4aXNTY2FsZSkudGlja1NpemUoLXRoaXMuaGVpZ2h0KTtcblxuICAgICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZCBncmlkLXgnKVxuICAgICAgICAuY2xhc3NlZCgnZ3JpZC16ZXJvLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzWmVybylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnhBeGlzVGl0bGUpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcy10aXRsZScpXG4gICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdjZW50ZXInKVxuICAgICAgICAuYXR0cigneCcsIHRoaXMud2lkdGggLyAyIC0gdGhpcy5tYXJnaW4ubGVmdClcbiAgICAgICAgLmF0dHIoJ3knLCB0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArICghdGhpcy5oaWRlWEF4aXMgPyA0MCA6IDApKVxuICAgICAgICAudGV4dCh0aGlzLnhBeGlzVGl0bGUpO1xuICAgIH1cblxuICAgIC8vIGJ1aWxkIGNvbG9yIHJhbmdlc1xuICAgIGxldCBjb2xvcnM7XG5cbiAgICBpZiAodGhpcy5pc1NpbmdsZURhdGEpIHtcbiAgICAgIGNvbG9ycyA9IHRoaXMuX2RhdGF2aXouY3JlYXRlR3JhZGllbnREZWZzKHRoaXMuc3ZnLCB0aGlzLm1vbm9jaHJvbWUsIHRoaXMudGhlbWUsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubW9ub2Nocm9tZSkge1xuICAgICAgY29sb3JzID0gdGhpcy5fZGF0YXZpei5nZXRDb2xvcnModGhpcy5tb25vY2hyb21lLCB0aGlzLnRoZW1lKS5yZXZlcnNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbG9ycyA9IHRoaXMuX2RhdGF2aXouZ2V0Q29sb3JzKHRoaXMubW9ub2Nocm9tZSwgdGhpcy50aGVtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVPcmRpbmFsKCkucmFuZ2UoY29sb3JzKTtcblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICB1cGRhdGVDaGFydCgpIHtcbiAgICB0aGlzLmlzU2luZ2xlRGF0YSA9IHRoaXMuZGF0YS5sZW5ndGggPT09IDEgPyB0cnVlIDogZmFsc2U7XG4gICAgdGhpcy5pc0NvbXBhcmUgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGFbMF0pLmluY2x1ZGVzKCdjb21wYXJlVmFsdWUnKTtcblxuICAgIGNvbnN0IHN1bVZhbHVlcyA9IGQzX3N1bSh0aGlzLmRhdGEsIChkOiBhbnkpID0+IGQudmFsdWUpO1xuICAgIGNvbnN0IGlzTGFzdEJhclplcm8gPVxuICAgICAgdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXS52YWx1ZSA9PT0gMCB8fCB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdLnZhbHVlID09PSBudWxsID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgbGV0IGxhc3RCYXJaZXJvQ291bnQgPSAwO1xuICAgIGNvbnN0IGNsb25lRGF0YSA9IFsuLi50aGlzLmRhdGFdO1xuICAgIGxldCBpc0xhc3QgPSBmYWxzZTtcblxuICAgIGNsb25lRGF0YS5yZXZlcnNlKCkuZm9yRWFjaCgodmFsdWUsIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgaWYgKCh2YWx1ZS52YWx1ZSA9PT0gMCB8fCB2YWx1ZS52YWx1ZSA9PT0gbnVsbCkgJiYgIWlzTGFzdCkge1xuICAgICAgICBsYXN0QmFyWmVyb0NvdW50Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc0xhc3QgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGVyY2VudGFnZSAmJiAhdGhpcy5pc1NpbmdsZURhdGEpIHtcbiAgICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4oWzAsIHN1bVZhbHVlc10pLnJhbmdlKFswLCArdGhpcy53aWR0aF0pO1xuICAgICAgdGhpcy54QXhpc0NhbGwudGlja1ZhbHVlcyhbMCwgc3VtVmFsdWVzICogMC4yNSwgc3VtVmFsdWVzICogMC41LCBzdW1WYWx1ZXMgKiAwLjc1LCBzdW1WYWx1ZXNdKTtcbiAgICAgIHRoaXMueEF4aXMuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAgIHRoaXMueEdyaWRDYWxsLnRpY2tWYWx1ZXMoWzAsIHN1bVZhbHVlcyAqIDAuMjUsIHN1bVZhbHVlcyAqIDAuNSwgc3VtVmFsdWVzICogMC43NSwgc3VtVmFsdWVzXSk7XG4gICAgICB0aGlzLnhHcmlkLmNhbGwodGhpcy54R3JpZENhbGwpO1xuXG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0KCcuYXhpcy14JylcbiAgICAgICAgLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAgIC5odG1sKChkLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgZm9ybWF0ID0gZDNfZm9ybWF0KCcuMCUnKTtcbiAgICAgICAgICByZXR1cm4gZm9ybWF0KGkgKiAwLjI1KTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBlcmNlbnRhZ2UgJiYgdGhpcy5pc1NpbmdsZURhdGEpIHtcbiAgICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4oWzAsIDEuMF0pLnJhbmdlKFswLCArdGhpcy53aWR0aF0pO1xuICAgICAgdGhpcy54QXhpc0NhbGwudGlja1ZhbHVlcyhbMCwgMC4yNSwgMC41LCAwLjc1LCAxLjBdKTtcbiAgICAgIHRoaXMueEF4aXMuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAgIHRoaXMueEdyaWRDYWxsLnRpY2tWYWx1ZXMoWzAsIDAuMjUsIDAuNSwgMC43NSwgMS4wXSk7XG4gICAgICB0aGlzLnhHcmlkLmNhbGwodGhpcy54R3JpZENhbGwpO1xuXG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0KCcuYXhpcy14JylcbiAgICAgICAgLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAgIC5odG1sKChkLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgZm9ybWF0ID0gZDNfZm9ybWF0KCcuMCUnKTtcbiAgICAgICAgICByZXR1cm4gZm9ybWF0KGkgKiAwLjI1KTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMueEF4aXNTY2FsZS5kb21haW4oWzAsIE1hdGguY2VpbChzdW1WYWx1ZXMpXSkucmFuZ2UoWzAsICt0aGlzLndpZHRoXSk7XG4gICAgICB0aGlzLnhHcmlkQ2FsbC50aWNrVmFsdWVzKHRoaXMueEF4aXNTY2FsZS50aWNrcygpLmZpbHRlcihuID0+IE51bWJlci5pc0ludGVnZXIobikpKTsgLy8gcmVtb3ZlIGRlY2ltYWwgZ3JpZCB2YWx1ZXNcblxuICAgICAgdGhpcy54QXhpc1xuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuY2FsbCh0aGlzLnhBeGlzQ2FsbCk7XG5cbiAgICAgIC8vIHVwZGF0ZSB0aGUgZ3JpZHNcbiAgICAgIGlmICghdGhpcy5oaWRlWEdyaWQpIHtcbiAgICAgICAgdGhpcy54R3JpZFxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsICgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0IC0gdGhpcy5iYXJQYWRkaW5nO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmlzU2luZ2xlRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBgdXJsKCR7dGhpcy5fbG9jYXRpb24ucGF0aCgpfSNncmFkaWVudC1ob3Jpem9udGFsLSR7dGhpcy5jb2xvclJhbmdlKGQubGFiZWwpLnN1YnN0cigxKX0pYDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhclBhZGRpbmcgLyAyO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zbGljZSgwLCBpKS5yZWR1Y2UoKGFjYywgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFjYywgaXRlbSwgYWNjICsgdGhpcy54QXhpc1NjYWxlKGl0ZW0udmFsdWUpICsgdGhpcy5iYXJNYXJnaW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiArYWNjICsgK3RoaXMueEF4aXNTY2FsZShpdGVtLnZhbHVlKTtcbiAgICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLmNhbGwoZW50ZXIgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAvLyAuZHVyYXRpb24oMClcbiAgICAgICAgICAgICAgICAgIC5kZWxheSgoZCwgaSkgPT4gaSAqIDI1MClcbiAgICAgICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VMaW5lYXIpXG4gICAgICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMuZGF0YS5sZW5ndGggLSBsYXN0QmFyWmVyb0NvdW50IC0gMSAmJiBpc0xhc3RCYXJaZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpICE9PSB0aGlzLmRhdGEubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgIGxldCB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKSAtICt0aGlzLmJhck1hcmdpbjtcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IE1hdGguc2lnbih3aWR0aCkgPT09IC0xID8gMCA6IHdpZHRoOyAvLyBoYW5kbGUgbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUoZC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICBpZiAoZC52YWx1ZSA9PT0gbnVsbCB8fCBkLnZhbHVlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZSgwKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSB0aGlzLmRhdGEubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhBeGlzU2NhbGUoZC52YWx1ZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNTY2FsZShkLnZhbHVlKSAtIHRoaXMuYmFyTWFyZ2luO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNsaWNlKDAsIGkpLnJlZHVjZSgoYWNjLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYyArICt0aGlzLnhBeGlzU2NhbGUoaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgIGV4aXQgPT5cbiAgICAgICAgICBleGl0XG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAucmVtb3ZlKClcbiAgICAgIClcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5iYXJNb3VzZU91dCgpKVxuICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcbiAgICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaSA9IGVudGVyXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ2xpJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJylcbiAgICAgICAgICAgICAgLmNsYXNzZWQoJ2FsaWduLWl0ZW1zLXN0YXJ0JywgdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBsaS5pbnNlcnQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWtleScpXG4gICAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnbXQtMScsIHRoaXMuaXNDb21wYXJlKTtcblxuICAgICAgICAgICAgbGkuaW5zZXJ0KCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1kZXNjcmlwdGlvbicpXG4gICAgICAgICAgICAgIC5jbGFzc2VkKCdkLWZsZXgnLCB0aGlzLmlzQ29tcGFyZSlcbiAgICAgICAgICAgICAgLmNsYXNzZWQoJ2ZsZXgtY29sdW1uJywgdGhpcy5pc0NvbXBhcmUpO1xuXG4gICAgICAgICAgICBsaS5zZWxlY3QoJy5sZWdlbmQtZGVzY3JpcHRpb24nKVxuICAgICAgICAgICAgICAuaW5zZXJ0KCdzcGFuJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgICAgICAgIC5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGkuc2VsZWN0KCcubGVnZW5kLWRlc2NyaXB0aW9uJylcbiAgICAgICAgICAgICAgLmluc2VydCgnZGl2JylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1jaGFuZ2UnKVxuICAgICAgICAgICAgICAuY2xhc3NlZCgnZC1ub25lJywgIXRoaXMuaXNDb21wYXJlKTtcblxuICAgICAgICAgICAgbGkuc2VsZWN0KCcubGVnZW5kLWNoYW5nZScpLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1pbmRpY2F0b3IgJHtkLmNvbXBhcmVDaGFuZ2VEaXJlY3Rpb259ICR7XG4gICAgICAgICAgICAgICAgZC5jb21wYXJlQ2hhbmdlSW52ZXJzZSA/ICdpbnZlcnNlJyA6ICcnXG4gICAgICAgICAgICAgIH0gbXQtMVwiPjxzcGFuPiR7dGhpcy50b29sdGlwQ29tcGFyZUNoYW5nZUZvcm1hdChkLmNvbXBhcmVDaGFuZ2VWYWx1ZSl9PC9zcGFuPjwvZGl2PmA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdXBkYXRlID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZS5jbGFzc2VkKCdhbGlnbi1pdGVtcy1zdGFydCcsIHRoaXMuaXNDb21wYXJlKTtcbiAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQta2V5JykuY2xhc3NlZCgnbXQtMScsIHRoaXMuaXNDb21wYXJlKTtcbiAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtY2hhbmdlJykuY2xhc3NlZCgnZC1ub25lJywgIXRoaXMuaXNDb21wYXJlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wYXJlKSB7XG4gICAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtY2hhbmdlJykuaHRtbChkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2staW5kaWNhdG9yICR7ZC5jb21wYXJlQ2hhbmdlRGlyZWN0aW9ufSAke1xuICAgICAgICAgICAgICAgICAgZC5jb21wYXJlQ2hhbmdlSW52ZXJzZSA/ICdpbnZlcnNlJyA6ICcnXG4gICAgICAgICAgICAgICAgfSBtdC0xXCI+PHNwYW4+JHt0aGlzLnRvb2x0aXBDb21wYXJlQ2hhbmdlRm9ybWF0KGQuY29tcGFyZUNoYW5nZVZhbHVlKX08L3NwYW4+PC9kaXY+YDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdlbmRMYWJlbEZvcm1hdChwYXJzZWRUaW1lKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMubGVnZW5kTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4gdGhpcy5sZWdlbmRNb3VzZU91dCgpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5sZWdlbmRNb3VzZUNsaWNrKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKTtcbiAgICB9XG4gIH1cblxuICBiYXJNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSBkM19zZWxlY3Qobm9kZXNbaW5kZXhdKTtcblxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuYmFyJykuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIG5vZGUuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4ge1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgcmV0dXJuIGkgIT09IGluZGV4O1xuICAgICAgfSlcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy50b29sdGlwU2hvdyhkYXRhLCBub2Rlc1tpbmRleF0pO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBiYXJNb3VzZU91dCA9ICgpID0+IHtcbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKVxuICAgICAgLnN0eWxlKCdmaWxsJywgbnVsbCk7XG5cbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgYmFyTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKGRhdGEsIG5vZGUpID0+IHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcblxuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSBkYXRhLnZhbHVlIC8gZDNfc3VtKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gZC52YWx1ZSk7XG4gICAgY29uc3QgY29tcGFyZVBlcmNlbnRhZ2UgPSBkYXRhLmNvbXBhcmVWYWx1ZSAvIGQzX3N1bSh0aGlzLmRhdGEsIChkOiBhbnkpID0+IGQuY29tcGFyZVZhbHVlKTtcblxuICAgIGxldCB0b29sdGlwTGFiZWwgPSBgYDtcbiAgICBsZXQgdG9vbHRpcENvbXBhcmVEYXRlcmFuZ2VNYXJnaW4gPSBgYDtcbiAgICBsZXQgdG9vbHRpcENvbXBhcmVEYXRlcmFuZ2UgPSBgYDtcbiAgICBsZXQgdG9vbHRpcENvbXBhcmVWYWx1ZSA9IGBgO1xuICAgIGxldCB0b29sdGlwRGF0ZXJhbmdlTWFyZ2luID0gYGA7XG4gICAgbGV0IHRvb2x0aXBEYXRlcmFuZ2UgPSBgYDtcbiAgICBsZXQgdG9vbHRpcFZhbHVlID0gYCR7dGhpcy5udWxsVmFsdWVUZXh0fWA7XG4gICAgbGV0IHRvb2x0aXBJbmRpY2F0b3IgPSAnJztcblxuICAgIC8vIHRvb2x0aXAgbGFiZWxcbiAgICBpZiAoIXRoaXMuaXNTaW5nbGVEYXRhKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgncGJkcy10b29sdGlwLWNvbXBhcmUnLCBudWxsKTtcblxuICAgICAgc3dpdGNoICh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICB0b29sdGlwTGFiZWwgPSB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdChkYXRhLmxhYmVsKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZGF0YS5sYWJlbCk7XG4gICAgICAgICAgdG9vbHRpcExhYmVsID0gdGhpcy50b29sdGlwTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0b29sdGlwTGFiZWwgPSBkYXRhLmxhYmVsO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRvb2x0aXAgY29tcGFyZSBkYXRlcmFuZ2VcbiAgICBpZiAodGhpcy5pc0NvbXBhcmUgJiYgZGF0YS5jb21wYXJlU3RhcnREYXRlICYmIGRhdGEuY29tcGFyZUVuZERhdGUpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdwYmRzLXRvb2x0aXAtY29tcGFyZScsIHRoaXMuaXNDb21wYXJlKTtcbiAgICAgIHRvb2x0aXBDb21wYXJlRGF0ZXJhbmdlTWFyZ2luID0gYG10LTJgO1xuXG4gICAgICB0b29sdGlwQ29tcGFyZURhdGVyYW5nZSA9IGAke3RoaXMudG9vbHRpcERhdGVGb3JtYXQoXG4gICAgICAgIGQzX2lzb1BhcnNlKGRhdGEuY29tcGFyZVN0YXJ0RGF0ZSlcbiAgICAgICl9IC0gJHt0aGlzLnRvb2x0aXBEYXRlRm9ybWF0KGQzX2lzb1BhcnNlKGRhdGEuY29tcGFyZUVuZERhdGUpKX1gO1xuICAgIH1cblxuICAgIC8vIHRvb2x0aXAgY29tcGFyZSB2YWx1ZVxuICAgIGlmICh0aGlzLnBlcmNlbnRhZ2UgJiYgdGhpcy5pc0NvbXBhcmUgJiYgZGF0YS5jb21wYXJlVmFsdWUpIHtcbiAgICAgIHRvb2x0aXBDb21wYXJlVmFsdWUgPVxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICAgID8gYCR7dGhpcy50b29sdGlwUGVyY2VudEZvcm1hdChjb21wYXJlUGVyY2VudGFnZSl9ICgke2RhdGEuY29tcGFydmVWYWx1ZX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fSlgXG4gICAgICAgICAgOiBgJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KGNvbXBhcmVQZXJjZW50YWdlKX0gKCR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS5jb21wYXJlVmFsdWUpfSR7XG4gICAgICAgICAgICAgIHRoaXMudG9vbHRpcFZhbHVlU3VmZml4XG4gICAgICAgICAgICB9KWA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzQ29tcGFyZSAmJiBkYXRhLmNvbXBhcmVWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdG9vbHRpcENvbXBhcmVWYWx1ZSA9XG4gICAgICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID09PSBudWxsXG4gICAgICAgICAgPyBgJHtkYXRhLmNvbXBhcmVWYWx1ZX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fSAoJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KGNvbXBhcmVQZXJjZW50YWdlKX0pYFxuICAgICAgICAgIDogYCR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS5jb21wYXJlVmFsdWUpfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9ICgke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQoXG4gICAgICAgICAgICAgIGNvbXBhcmVQZXJjZW50YWdlXG4gICAgICAgICAgICApfSlgO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbXBhcmUgJiYgZGF0YS5jb21wYXJlVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRvb2x0aXBDb21wYXJlVmFsdWUgPSBgJHt0aGlzLm51bGxWYWx1ZVRleHR9YDtcbiAgICB9XG5cbiAgICAvLyB0b29sdGlwIGRhdGVyYW5nZVxuICAgIGlmIChkYXRhLnN0YXJ0RGF0ZSAmJiBkYXRhLmVuZERhdGUpIHtcbiAgICAgIHRvb2x0aXBEYXRlcmFuZ2UgPSBgJHt0aGlzLnRvb2x0aXBEYXRlRm9ybWF0KGQzX2lzb1BhcnNlKGRhdGEuc3RhcnREYXRlKSl9IC0gJHt0aGlzLnRvb2x0aXBEYXRlRm9ybWF0KFxuICAgICAgICBkM19pc29QYXJzZShkYXRhLmVuZERhdGUpXG4gICAgICApfWA7XG4gICAgfVxuXG4gICAgLy90b29sdGlwIGRhdGVyYW5nZSBtYXJnaW5cbiAgICBpZiAodG9vbHRpcExhYmVsICE9PSAnJykge1xuICAgICAgdG9vbHRpcERhdGVyYW5nZU1hcmdpbiA9IGBtdC0yYDtcbiAgICB9XG5cbiAgICAvLyB0b29sdGlwIHZhbHVlXG4gICAgaWYgKHRoaXMuaXNTaW5nbGVEYXRhICYmIHRoaXMucGVyY2VudGFnZSAmJiBkYXRhLnZhbHVlKSB7XG4gICAgICB0b29sdGlwVmFsdWUgPSB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbCA/IGAke2RhdGEudmFsdWV9YCA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfWA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU2luZ2xlRGF0YSAmJiBkYXRhLnZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0b29sdGlwVmFsdWUgPVxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICAgID8gYCR7ZGF0YS52YWx1ZX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fWBcbiAgICAgICAgICA6IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfSR7dGhpcy50b29sdGlwVmFsdWVTdWZmaXh9YDtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2luZ2xlRGF0YSAmJiB0aGlzLnBlcmNlbnRhZ2UgJiYgZGF0YS52YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdG9vbHRpcFZhbHVlID1cbiAgICAgICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPT09IG51bGxcbiAgICAgICAgICA/IGAke3RoaXMudG9vbHRpcFBlcmNlbnRGb3JtYXQocGVyY2VudGFnZSl9ICgke2RhdGEudmFsdWV9JHt0aGlzLnRvb2x0aXBWYWx1ZVN1ZmZpeH0pYFxuICAgICAgICAgIDogYCR7dGhpcy50b29sdGlwUGVyY2VudEZvcm1hdChwZXJjZW50YWdlKX0gKCR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQoZGF0YS52YWx1ZSl9JHtcbiAgICAgICAgICAgICAgdGhpcy50b29sdGlwVmFsdWVTdWZmaXhcbiAgICAgICAgICAgIH0pYDtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2luZ2xlRGF0YSAmJiBkYXRhLnZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0b29sdGlwVmFsdWUgPVxuICAgICAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9PT0gbnVsbFxuICAgICAgICAgID8gYCR7ZGF0YS52YWx1ZX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fSAoJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KHBlcmNlbnRhZ2UpfSlgXG4gICAgICAgICAgOiBgJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX0ke3RoaXMudG9vbHRpcFZhbHVlU3VmZml4fSAoJHt0aGlzLnRvb2x0aXBQZXJjZW50Rm9ybWF0KFxuICAgICAgICAgICAgICBwZXJjZW50YWdlXG4gICAgICAgICAgICApfSlgO1xuICAgIH1cblxuICAgIC8vIHRvb2x0aXAgbWV0cmljIGluZGljYXRvclxuICAgIGlmICghdGhpcy5pc1NpbmdsZURhdGEgJiYgdGhpcy5pc0NvbXBhcmUgJiYgZGF0YS52YWx1ZSAhPT0gbnVsbCAmJiBkYXRhLmNvbXBhcmVWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdG9vbHRpcEluZGljYXRvciA9IGA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWluZGljYXRvciAke2RhdGEuY29tcGFyZUNoYW5nZURpcmVjdGlvbn0gJHtcbiAgICAgICAgZGF0YS5jb21wYXJlQ2hhbmdlSW52ZXJzZSA/ICdpbnZlcnNlJyA6ICcnXG4gICAgICB9IG1sLTJcIj48c3Bhbj4ke3RoaXMudG9vbHRpcENvbXBhcmVDaGFuZ2VGb3JtYXQoZGF0YS5jb21wYXJlQ2hhbmdlVmFsdWUpfTwvc3Bhbj48L2Rpdj5gO1xuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcC5odG1sKCgpID0+IHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLWxhYmVsIGZvbnQtd2VpZ2h0LWJvbGRcIj4ke3Rvb2x0aXBMYWJlbH08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7dG9vbHRpcENvbXBhcmVEYXRlcmFuZ2VNYXJnaW59XCI+JHt0b29sdGlwQ29tcGFyZURhdGVyYW5nZX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRvb2x0aXAtdmFsdWUgZm9udC13ZWlnaHQtYm9sZFwiPiR7dG9vbHRpcENvbXBhcmVWYWx1ZX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7dG9vbHRpcERhdGVyYW5nZU1hcmdpbn1cIj4ke3Rvb2x0aXBEYXRlcmFuZ2V9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlXCI+PHNwYW4gY2xhc3M9XCJmb250LXdlaWdodC1ib2xkXCI+JHt0b29sdGlwVmFsdWV9PC9zcGFuPiA8c3Bhbj4ke3Rvb2x0aXBJbmRpY2F0b3J9PC9zcGFuPjwvZGl2PlxuICAgICAgYDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRXaWR0aCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldFdpZHRoIC8gMjtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHRvb2x0aXBUaXBTaXplID0gODtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7K3Njcm9sbFsxXSArICtkaW1lbnNpb25zLnRvcCAtIHRvb2x0aXBPZmZzZXRIZWlnaHQgLSB0b29sdGlwVGlwU2l6ZX1weGApO1xuXG4gICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBgJHsrc2Nyb2xsWzBdICsgK2RpbWVuc2lvbnMubGVmdCAtIHRvb2x0aXBPZmZzZXRXaWR0aCArICtkaW1lbnNpb25zLndpZHRoIC8gMn1weGApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBgJHsrc2Nyb2xsWzBdIC0gdG9vbHRpcE9mZnNldFdpZHRoICsgK2RpbWVuc2lvbnMucmlnaHR9cHhgKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmRUb29sdGlwKSB7XG4gICAgICBjb25zdCBiYXJIb3ZlciA9IHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAuZmlsdGVyKChkLCBpKSA9PiBpID09PSBpbmRleClcbiAgICAgICAgLm5vZGUoKTtcblxuICAgICAgdGhpcy50b29sdGlwU2hvdyhkYXRhLCBiYXJIb3Zlcik7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgbnVsbCk7XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBudWxsKTtcblxuICAgIC8vIGhpZGUgdG9vbHRpcCBmb3IgemVyby9udWxsIHZhbHVlc1xuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBsZWdlbmRNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgeEF4aXNGb3JtYXR0ZXIgPSBpdGVtID0+IHtcbiAgICBzd2l0Y2ggKHRoaXMueEF4aXNGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXR1cm4gYCR7dGhpcy54QXhpc0Zvcm1hdChpdGVtKX0ke3RoaXMueEF4aXNUaWNrTGFiZWxTdWZmaXh9YDtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGAke2l0ZW19JHt0aGlzLnhBeGlzVGlja0xhYmVsU3VmZml4fWA7XG4gICAgfVxuICB9O1xufVxuIl19
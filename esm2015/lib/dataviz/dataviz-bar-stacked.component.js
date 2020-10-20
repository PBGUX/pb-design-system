import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, event as d3_event } from 'd3-selection';
import { scaleOrdinal as d3_scaleOrdinal, scaleLinear as d3_scaleLinear, scaleBand as d3_scaleBand } from 'd3-scale';
import { max as d3_max } from 'd3-array';
import { axisBottom as d3_axisBottom, axisLeft as d3_axisLeft } from 'd3-axis';
import { isoParse as d3_isoParse } from 'd3-time-format';
import { stack as d3_stack, stackOrderNone as d3_stackOrderNone } from 'd3-shape';
import { PbdsDatavizService } from './dataviz.service';
export class PbdsDatavizBarStackedComponent {
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
        this.yAxisFormatType = null;
        this.yAxisFormatString = '';
        this.yAxisTicks = 5;
        this.yAxisMaxBuffer = 0.01;
        this.hideLegend = false;
        this.legendWidth = 105 + 28; // hardcoded legend width + left margin, do not document until feedback
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
        this.updateChart = (firstRun = true) => {
            this.dataKeys = Object.keys(this.data[0]).filter(item => item !== 'key');
            // create the D3 stack data
            this.dataStack = d3_stack()
                .keys(this.dataKeys)
                .order(d3_stackOrderNone)(this.data);
            // update the xScale
            this.xAxisScale.domain(this.data.map(d => d.key));
            // update the yScale
            this.yAxisMax = d3_max(this.dataStack, (data) => {
                return d3_max(data, (d) => {
                    return d[1];
                });
            });
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
                    .join(enter => enter
                    .append('rect')
                    .attr('class', 'gray-bar')
                    .attr('x', d => this.xAxisScale(d.key))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height), update => update
                    .transition()
                    .duration((d, i, n) => (firstRun ? 0 : 1000))
                    .attr('x', d => this.xAxisScale(d.key))
                    .attr('width', this.xAxisScale.bandwidth())
                    .attr('height', this.height), exit => exit.remove());
            }
            // add colored bars
            const barGroups = this.bars
                .selectAll('.bar-group')
                .data(this.dataStack)
                .join(enter => enter
                .append('g')
                .attr('class', 'bar-group')
                .attr('fill', d => this.colorRange(d.index)), update => update.attr('fill', d => this.colorRange(d.index)), exit => exit.remove());
            barGroups
                .selectAll('.bar')
                .data(d => d)
                .join(enter => enter
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
                .attr('y', d => this.yAxisScale(d[0]))
                .attr('width', d => {
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
                .call(enter => {
                enter
                    .transition()
                    .duration((d, i, n) => (firstRun ? 0 : 500))
                    .delay((d, i, n) => (firstRun ? 0 : 750))
                    .attr('y', d => this.yAxisScale(d[1]))
                    .attr('height', d => {
                    return this.yAxisScale(d[0]) - this.yAxisScale(d[1]);
                });
                return enter;
            }), update => update.call(update => {
                // let width;
                // if (this.type === 'medium') {
                //   width = this.xAxisScale.bandwidth() / 4;
                // } else {
                //   width = this.xAxisScale.bandwidth() / 2;
                // }
                update
                    .transition()
                    .duration(1000)
                    .attr('width', this.xAxisScale.bandwidth() / 4)
                    .attr('x', (d, i) => this.xAxisScale(d.data.key) + (this.xAxisScale.bandwidth() / 8) * 3)
                    .attr('y', d => this.yAxisScale(d[1]))
                    .attr('height', d => this.yAxisScale(d[0]) - this.yAxisScale(d[1]));
                return update;
            }), exit => exit.remove());
            // mouseover bars
            this.mouseBars
                .selectAll('.mouseover-bar')
                .data(this.data)
                .join(enter => enter
                .append('rect')
                .attr('class', 'mouseover-bar')
                .style('opacity', 0)
                .attr('x', d => this.xAxisScale(d.key))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height), update => update
                .attr('pointer-events', 'none')
                .attr('x', d => this.xAxisScale(d.key))
                .attr('width', this.xAxisScale.bandwidth())
                .attr('height', this.height)
                .transition()
                .attr('pointer-events', 'auto'), exit => exit
                .transition()
                .attr('pointer-events', 'none')
                .remove())
                .on('mouseover', (data, index, nodes) => this.barMouseOver(d3_event, data, index, nodes))
                .on('mouseout', (data, index, nodes) => this.barMouseOut())
                .on('click', (data, index, nodes) => this.barMouseClick(d3_event, data, index, nodes));
            this.bars.raise();
            this.xAxis.raise();
            this.mouseBars.raise();
            if (!this.hideLegend) {
                this.chart
                    .select('.legend')
                    .selectAll('.legend-item')
                    .data(this.dataStack)
                    .join(enter => {
                    const li = enter.append('li').attr('class', 'legend-item');
                    li.append('span')
                        .attr('class', 'legend-key')
                        .style('background-color', d => this.colorRange(d.index));
                    li.append('span')
                        .attr('class', 'legend-label')
                        .html(d => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d.key);
                            case 'time':
                                const parsedTime = d3_isoParse(d.key);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
                        }
                    });
                    return li;
                }, update => {
                    update.select('.legend-label').html(d => {
                        switch (this.legendLabelFormatType) {
                            case 'number':
                                return this.legendLabelFormat(d.key);
                            case 'time':
                                const parsedTime = d3_isoParse(d.key);
                                return this.legendLabelFormat(parsedTime);
                            default:
                                return d.key;
                        }
                    });
                    return update;
                }, exit => exit.remove())
                    .on('mouseover', (data, index, nodes) => this.legendMouseOver(d3_event, data, index, nodes))
                    .on('mouseout', () => this.legendMouseOut())
                    .on('click', (data, index, nodes) => this.legendMouseClick(d3_event, data, index, nodes));
            }
        };
        this.barMouseOver = (event, data, index, nodes) => {
            this.chart
                .selectAll('.bar-group')
                .selectAll('.bar')
                .filter((d, i) => i !== index)
                .classed('inactive', true);
            this.tooltipShow(data, index, nodes[index]);
            this.hovered.emit({ event, data });
        };
        this.barMouseOut = () => {
            this.chart.selectAll('.bar').classed('inactive', false);
            this.tooltipHide();
        };
        this.barMouseClick = (event, data, index, nodes) => {
            this.clicked.emit({ event, data });
        };
        this.legendMouseOver = (event, data, index, nodes) => {
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== index)
                .classed('inactive', true);
            this.chart
                .selectAll('.bar-group')
                .filter((d, i) => i !== index)
                .classed('inactive', true);
            this.hovered.emit({ event, data });
        };
        this.legendMouseOut = () => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
            this.chart.selectAll('.bar-group').classed('inactive', false);
            this.tooltipHide();
        };
        this.legendMouseClick = (event, data, index, nodes) => {
            this.clicked.emit({ event, data });
        };
        this.xAxisFormatter = item => {
            switch (this.xAxisFormatType) {
                case 'number':
                    return this.xAxisFormat(item);
                case 'time':
                    const parseDate = d3_isoParse(item);
                    return this.xAxisFormat(parseDate);
                default:
                    return item;
            }
        };
        this.tooltipShow = (data, index, node) => {
            // console.log('TOOLTIP: ', data, index, node);
            const scroll = this._scroll.getScrollPosition();
            const mouserectDimensions = node.getBoundingClientRect();
            const clientWidth = document.body.clientWidth - 10;
            let dimensionCalculated;
            let tooltipDimensions;
            let tooltipOffsetHeight;
            let yPosition;
            let xPosition;
            // console.log(scroll, mouserectDimensions, tooltipOffsetHeight, tooltipDimensions, dimensionCalculated, clientWidth);
            this.tooltip.select('.tooltip-header').html(d => {
                switch (this.tooltipHeadingFormatType) {
                    case 'time':
                        const parseDate = d3_isoParse(data.key);
                        return this.tooltipHeadingFormat(parseDate);
                    default:
                        return data.key;
                }
            });
            this.tooltip.select('.tooltip-header-value').html(d => {
                let total = 0;
                Object.keys(data).map(e => {
                    if (e !== 'key') {
                        total = total + data[e];
                    }
                });
                return this.tooltipHeadingValueFormat(total);
            });
            this.tooltip
                .select('.tooltip-table')
                .select('tbody')
                .html(d => {
                let html = ``;
                let label;
                let value;
                Object.keys(data).map((key, index) => {
                    switch (this.tooltipLabelFormatType) {
                        case 'time':
                            const parseDate = d3_isoParse(key);
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
                .filter(':last-child')
                .selectAll('.bar')
                .filter((d, i) => i === index)
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
        this.yAxisFormatter = item => {
            switch (this.yAxisFormatType) {
                case 'number':
                    return this.yAxisFormat(item);
                case 'time':
                    const parseDate = d3_isoParse(item);
                    return this.yAxisFormat(parseDate);
                default:
                    return item;
            }
        };
    }
    ngOnInit() {
        // extract keys for stack data
        this.dataKeys = Object.keys(this.data[0]).filter(item => item !== 'key');
        // create the D3 stack data
        this.dataStack = d3_stack()
            .keys(this.dataKeys)
            .order(d3_stackOrderNone)(this.data);
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
        // adjust margin if xAxis hidden
        if (this.hideXAxis)
            this.margin.bottom = 10; // need small margin for yAxis with 0 tick label
        if (!this.hideLegend && this.legendPosition === 'right') {
            this.width = +this.width - +this.legendWidth;
        }
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
        this.grayBars = this.svg.append('g').attr('class', 'gray-bars');
        this.mouseBars = this.svg.append('g').attr('class', 'mouseover-bars');
        this.bars = this.svg.append('g').attr('class', 'bars');
        // build color ranges
        this.colorRange = d3_scaleOrdinal().range(this._dataviz.getColors(false, this.theme));
        // X AXIS
        this.xAxisScale = d3_scaleBand()
            .domain(this.data.map(d => d.key))
            .rangeRound([0, this.width - this.margin.left])
            .align(0);
        // add padding to the scale for gray bars
        !this.hideGrayBars
            ? this.xAxisScale.paddingInner(0.1).paddingOuter(0)
            : this.xAxisScale.paddingInner(0).paddingOuter(0);
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
        this.yAxisMax = d3_max(this.dataStack, (data) => {
            return d3_max(data, (d) => {
                return d[1];
            });
        });
        this.yAxisMax = this.yAxisMax + this.yAxisMax * this.yAxisMaxBuffer;
        this.yAxisScale = d3_scaleLinear()
            .domain([0, this.yAxisMax])
            .nice()
            .rangeRound([this.height, 0]);
        this.yAxisCall = d3_axisLeft(this.yAxisScale)
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
            this.yGridCall = d3_axisLeft(this.yAxisScale)
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
            this.tooltip = d3_select('body')
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
PbdsDatavizBarStackedComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-bar-stacked',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2RhMDU3Y28vRGVza3RvcC9Db2RlL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9zcmMvIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LWJhci1zdGFja2VkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLEtBQUssSUFBSSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEUsT0FBTyxFQUFFLFlBQVksSUFBSSxlQUFlLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxTQUFTLElBQUksWUFBWSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JILE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDL0UsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxjQUFjLElBQUksaUJBQWlCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFbEYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFTdkQsTUFBTSxPQUFPLDhCQUE4QjtJQWdKekMsWUFBb0IsUUFBNEIsRUFBVSxRQUFvQixFQUFVLE9BQXlC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LElBQUksQ0FBQyxPQUFPO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekI7SUFDSCxDQUFDOzs7WUF6WUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwwQkFBMEI7Z0JBQ3BDLFFBQVEsRUFBRSxFQUFFO2dCQUVaLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7WUFSUSxrQkFBa0I7WUFoQnpCLFVBQVU7WUFPSCxnQkFBZ0I7Ozt5QkFtQnRCLFdBQVcsU0FBQyxrQkFBa0I7OEJBRzlCLFdBQVcsU0FBQyw4QkFBOEI7bUJBRzFDLEtBQUs7b0JBR0wsS0FBSztxQkFHTCxLQUFLO21CQUdMLEtBQUs7d0JBR0wsS0FBSzswQkFHTCxLQUFLOzJCQUdMLEtBQUs7eUJBR0wsS0FBSzt3QkFHTCxLQUFLOzhCQUdMLEtBQUs7Z0NBR0wsS0FBSzs4QkFHTCxLQUFLO2dDQUdMLEtBQUs7eUJBR0wsS0FBSzs2QkFHTCxLQUFLO3lCQUdMLEtBQUs7MEJBR0wsS0FBSzs2QkFHTCxLQUFLO29DQUdMLEtBQUs7c0NBR0wsS0FBSzt1Q0FHTCxLQUFLO3lDQUdMLEtBQUs7NENBR0wsS0FBSzs4Q0FHTCxLQUFLO3FDQUdMLEtBQUs7dUNBR0wsS0FBSztxQ0FHTCxLQUFLO3VDQUdMLEtBQUs7b0JBR0wsS0FBSztzQkFHTCxNQUFNO3NCQUdOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCwgZXZlbnQgYXMgZDNfZXZlbnQgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgc2NhbGVPcmRpbmFsIGFzIGQzX3NjYWxlT3JkaW5hbCwgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsIHNjYWxlQmFuZCBhcyBkM19zY2FsZUJhbmQgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBtYXggYXMgZDNfbWF4IH0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHsgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tLCBheGlzTGVmdCBhcyBkM19heGlzTGVmdCB9IGZyb20gJ2QzLWF4aXMnO1xuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XG5pbXBvcnQgeyBzdGFjayBhcyBkM19zdGFjaywgc3RhY2tPcmRlck5vbmUgYXMgZDNfc3RhY2tPcmRlck5vbmUgfSBmcm9tICdkMy1zaGFwZSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyU3RhY2tlZCB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWJhci1zdGFja2VkJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekJhclN0YWNrZWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LXN0YWNrZWQtYmFyJylcbiAgc3RhY2tlZEJhckNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpekJhclN0YWNrZWQ+O1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzA2O1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbG93JyB8ICdtZWRpdW0nIHwgJ2hpZ2gnIHwgJ2RlYnVnJyA9ICdtZWRpdW0nOyAvLyBkZWJ1ZyB0byBzaG93IGFsbCBjaGFydCBvcHRpb25zXG5cbiAgQElucHV0KClcbiAgbWFyZ2luVG9wID0gMTA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5SaWdodCA9IDA7IC8vIGhhcmRjb2RlZCBvbiBwdXJwb3NlLCBkbyBub3QgZG9jdW1lbnQgdW50aWwgZmVlZGJhY2tcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAzMDsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkxlZnQgPSA1NTsgLy8gaGFyZGNvZGVkIG9uIHB1cnBvc2UsIGRvIG5vdCBkb2N1bWVudCB1bnRpbCBmZWVkYmFja1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVYQXhpcyA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzRm9ybWF0VHlwZTogJ251bWJlcicgfCAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHhBeGlzRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgeUF4aXNGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgeUF4aXNGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB5QXhpc1RpY2tzID0gNTtcblxuICBASW5wdXQoKVxuICB5QXhpc01heEJ1ZmZlciA9IDAuMDE7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMTA1ICsgMjg7IC8vIGhhcmRjb2RlZCBsZWdlbmQgd2lkdGggKyBsZWZ0IG1hcmdpbiwgZG8gbm90IGRvY3VtZW50IHVudGlsIGZlZWRiYWNrXG5cbiAgQElucHV0KClcbiAgbGVnZW5kUG9zaXRpb246ICdyaWdodCcgfCAnYm90dG9tJyA9ICdyaWdodCc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAnbnVtYmVyJyB8ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwSGVhZGluZ0Zvcm1hdFR5cGU6ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcEhlYWRpbmdGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRUeXBlOiAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0aGVtZTtcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIGRhdGFTdGFjaztcbiAgcHJpdmF0ZSBkYXRhS2V5cztcbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgZ3JheUJhcnM7XG4gIHByaXZhdGUgbW91c2VCYXJzO1xuICBwcml2YXRlIGJhcnM7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgaGlkZUdyYXlCYXJzOiBib29sZWFuO1xuICBwcml2YXRlIHhBeGlzU2NhbGU7XG4gIHByaXZhdGUgeEF4aXNDYWxsO1xuICBwcml2YXRlIHhBeGlzO1xuICBwcml2YXRlIHhBeGlzRm9ybWF0O1xuICBwcml2YXRlIHhBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB4QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNEb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVhBeGlzWmVybzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWEdyaWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgaGlkZVlHcmlkOiBib29sZWFuO1xuICBwcml2YXRlIHlBeGlzTWF4O1xuICBwcml2YXRlIHlBeGlzU2NhbGU7XG4gIHByaXZhdGUgeUF4aXNDYWxsO1xuICBwcml2YXRlIHlBeGlzO1xuICBwcml2YXRlIHlBeGlzRm9ybWF0O1xuICBwcml2YXRlIHlBeGlzVGlja1NpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSB5QXhpc1RpY2tTaXplT3V0ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSB4R3JpZDtcbiAgcHJpdmF0ZSB4R3JpZENhbGw7XG4gIHByaXZhdGUgeUdyaWQ7XG4gIHByaXZhdGUgeUdyaWRDYWxsO1xuICBwcml2YXRlIGhpZGVZQXhpczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNaZXJvOiBib29sZWFuO1xuICBwcml2YXRlIGhpZGVZQXhpc0RvbWFpbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBoaWRlWUF4aXNUaWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsZWdlbmRMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIGhpZGVUb29sdGlwOiBib29sZWFuO1xuICBwcml2YXRlIHRvb2x0aXBIZWFkaW5nRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIHRvb2x0aXBMYWJlbEZvcm1hdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBleHRyYWN0IGtleXMgZm9yIHN0YWNrIGRhdGFcbiAgICB0aGlzLmRhdGFLZXlzID0gT2JqZWN0LmtleXModGhpcy5kYXRhWzBdKS5maWx0ZXIoaXRlbSA9PiBpdGVtICE9PSAna2V5Jyk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIEQzIHN0YWNrIGRhdGFcbiAgICB0aGlzLmRhdGFTdGFjayA9IGQzX3N0YWNrKClcbiAgICAgIC5rZXlzKHRoaXMuZGF0YUtleXMpXG4gICAgICAub3JkZXIoZDNfc3RhY2tPcmRlck5vbmUpKHRoaXMuZGF0YSk7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXG4gICAgICByaWdodDogK3RoaXMubWFyZ2luUmlnaHQsXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRlIGZvcm1hdHRlcnNcbiAgICB0aGlzLnhBeGlzRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0VHlwZSwgdGhpcy54QXhpc0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy55QXhpc0Zvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy55QXhpc0Zvcm1hdFR5cGUsIHRoaXMueUF4aXNGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdFN0cmluZyk7XG4gICAgdGhpcy50b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdChcbiAgICAgIHRoaXMudG9vbHRpcEhlYWRpbmdWYWx1ZUZvcm1hdFR5cGUsXG4gICAgICB0aGlzLnRvb2x0aXBIZWFkaW5nVmFsdWVGb3JtYXRTdHJpbmdcbiAgICApO1xuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBkZWZhdWx0cyBmb3IgYWxsIGNoYXJ0IHR5cGVzXG4gICAgdGhpcy5oaWRlR3JheUJhcnMgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpcyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzWmVybyA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhHcmlkID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlWUdyaWQgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlVG9vbHRpcCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZVhBeGlzVGlja3MgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gZmFsc2U7XG4gICAgdGhpcy54QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnhBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgdGhpcy55QXhpc1RpY2tTaXplID0gODtcbiAgICB0aGlzLnlBeGlzVGlja1NpemVPdXRlciA9IDA7XG4gICAgLy8gdGhpcy5oaWRlVG9vbHRpcExhYmVsID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XG4gICAgICAvLyBzZXQgdHlwZSBkZWZhdWx0c1xuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbG93JzpcbiAgICAgICAgICB0aGlzLmhpZGVHcmF5QmFycyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5sZWdlbmRQb3NpdGlvbiA9ICdib3R0b20nO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ21lZGl1bSc6XG4gICAgICAgICAgdGhpcy5oaWRlWEF4aXNEb21haW4gPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVhHcmlkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc0RvbWFpbiA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUF4aXNUaWNrcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWUdyaWQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2hpZ2gnOlxuICAgICAgICAgIHRoaXMuaGlkZVhBeGlzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVYQXhpc0RvbWFpbiA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlWEdyaWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGlkZVlBeGlzRG9tYWluID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZQXhpc1RpY2tzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmhpZGVZR3JpZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oaWRlTGVnZW5kID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5sZWdlbmRQb3NpdGlvbiA9ICdib3R0b20nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFkanVzdCBtYXJnaW4gaWYgeEF4aXMgaGlkZGVuXG4gICAgaWYgKHRoaXMuaGlkZVhBeGlzKSB0aGlzLm1hcmdpbi5ib3R0b20gPSAxMDsgLy8gbmVlZCBzbWFsbCBtYXJnaW4gZm9yIHlBeGlzIHdpdGggMCB0aWNrIGxhYmVsXG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCAmJiB0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICB0aGlzLndpZHRoID0gK3RoaXMud2lkdGggLSArdGhpcy5sZWdlbmRXaWR0aDtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIGNyZWF0ZSBjaGFydCBzdmdcbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCArdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCArdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b20pXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHsrdGhpcy53aWR0aH0gJHsrdGhpcy5oZWlnaHQgKyB0aGlzLm1hcmdpbi50b3AgKyB0aGlzLm1hcmdpbi5ib3R0b219YFxuICAgICAgKTtcblxuICAgIHRoaXMuZ3JheUJhcnMgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdncmF5LWJhcnMnKTtcbiAgICB0aGlzLm1vdXNlQmFycyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ21vdXNlb3Zlci1iYXJzJyk7XG4gICAgdGhpcy5iYXJzID0gdGhpcy5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnYmFycycpO1xuXG4gICAgLy8gYnVpbGQgY29sb3IgcmFuZ2VzXG4gICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVPcmRpbmFsKCkucmFuZ2UodGhpcy5fZGF0YXZpei5nZXRDb2xvcnMoZmFsc2UsIHRoaXMudGhlbWUpKTtcblxuICAgIC8vIFggQVhJU1xuICAgIHRoaXMueEF4aXNTY2FsZSA9IGQzX3NjYWxlQmFuZCgpXG4gICAgICAuZG9tYWluKHRoaXMuZGF0YS5tYXAoZCA9PiBkLmtleSkpXG4gICAgICAucmFuZ2VSb3VuZChbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnRdKVxuICAgICAgLmFsaWduKDApO1xuXG4gICAgLy8gYWRkIHBhZGRpbmcgdG8gdGhlIHNjYWxlIGZvciBncmF5IGJhcnNcbiAgICAhdGhpcy5oaWRlR3JheUJhcnNcbiAgICAgID8gdGhpcy54QXhpc1NjYWxlLnBhZGRpbmdJbm5lcigwLjEpLnBhZGRpbmdPdXRlcigwKVxuICAgICAgOiB0aGlzLnhBeGlzU2NhbGUucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKTtcblxuICAgIHRoaXMueEF4aXNDYWxsID0gZDNfYXhpc0JvdHRvbSh0aGlzLnhBeGlzU2NhbGUpXG4gICAgICAudGlja1NpemUodGhpcy54QXhpc1RpY2tTaXplKVxuICAgICAgLnRpY2tTaXplT3V0ZXIodGhpcy54QXhpc1RpY2tTaXplT3V0ZXIpXG4gICAgICAudGlja0Zvcm1hdCh0aGlzLnhBeGlzRm9ybWF0dGVyKTtcblxuICAgIHRoaXMueEF4aXMgPSB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXgnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHt0aGlzLmhlaWdodH0pYClcbiAgICAgIC5jbGFzc2VkKCdheGlzLWhpZGRlbicsIHRoaXMuaGlkZVhBeGlzKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1plcm8pXG4gICAgICAuY2xhc3NlZCgnYXhpcy1kb21haW4taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNEb21haW4pXG4gICAgICAuY2xhc3NlZCgnYXhpcy10aWNrcy1oaWRkZW4nLCB0aGlzLmhpZGVYQXhpc1RpY2tzKVxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgLy8gWCBHUklETElORVNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkQ2FsbCA9IGQzX2F4aXNCb3R0b20odGhpcy54QXhpc1NjYWxlKS50aWNrU2l6ZSgtdGhpcy5oZWlnaHQpO1xuXG4gICAgICB0aGlzLnhHcmlkID0gdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdncmlkIGdyaWQteCcpXG4gICAgICAgIC5jbGFzc2VkKCdncmlkLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWEF4aXNaZXJvKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke3RoaXMuaGVpZ2h0fSlgKVxuICAgICAgICAuY2FsbCh0aGlzLnhHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gS0VFUDogdXNlIHRoaXMgYmxvY2sgdG8gZGVidWcgeUF4aXNNYXhcbiAgICAvLyBjb25zb2xlLmxvZyhcbiAgICAvLyAgIGQzX21heCh0aGlzLmRhdGFTdGFjaywgKGRhdGE6IGFueSkgPT4ge1xuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgIC8vICAgICByZXR1cm4gZDNfbWF4KGRhdGEsIChkOiBhbnkpID0+IHtcbiAgICAvLyAgICAgICAvLyBjb25zb2xlLmxvZygnRDogJywgZCk7XG4gICAgLy8gICAgICAgcmV0dXJuIGRbMV07XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfSlcbiAgICAvLyApO1xuXG4gICAgLy8gWSBBWElTXG4gICAgdGhpcy55QXhpc01heCA9IGQzX21heCh0aGlzLmRhdGFTdGFjaywgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIGQzX21heChkYXRhLCAoZDogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiBkWzFdO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnlBeGlzTWF4ID0gdGhpcy55QXhpc01heCArIHRoaXMueUF4aXNNYXggKiB0aGlzLnlBeGlzTWF4QnVmZmVyO1xuXG4gICAgdGhpcy55QXhpc1NjYWxlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgdGhpcy55QXhpc01heF0pXG4gICAgICAubmljZSgpXG4gICAgICAucmFuZ2VSb3VuZChbdGhpcy5oZWlnaHQsIDBdKTtcblxuICAgIHRoaXMueUF4aXNDYWxsID0gZDNfYXhpc0xlZnQodGhpcy55QXhpc1NjYWxlKVxuICAgICAgLnRpY2tzKHRoaXMueUF4aXNUaWNrcylcbiAgICAgIC50aWNrU2l6ZSh0aGlzLnlBeGlzVGlja1NpemUpXG4gICAgICAudGlja1NpemVPdXRlcih0aGlzLnlBeGlzVGlja1NpemVPdXRlcilcbiAgICAgIC50aWNrRm9ybWF0KHRoaXMueUF4aXNGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy55QXhpcyA9IHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteScpXG4gICAgICAuY2xhc3NlZCgnYXhpcy1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpcylcbiAgICAgIC5jbGFzc2VkKCdheGlzLXplcm8taGlkZGVuJywgdGhpcy5oaWRlWUF4aXNaZXJvKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtZG9tYWluLWhpZGRlbicsIHRoaXMuaGlkZVlBeGlzRG9tYWluKVxuICAgICAgLmNsYXNzZWQoJ2F4aXMtdGlja3MtaGlkZGVuJywgdGhpcy5oaWRlWUF4aXNUaWNrcylcbiAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgIC8vIFkgR1JJRExJTkVTXG4gICAgaWYgKCF0aGlzLmhpZGVZR3JpZCkge1xuICAgICAgdGhpcy55R3JpZENhbGwgPSBkM19heGlzTGVmdCh0aGlzLnlBeGlzU2NhbGUpXG4gICAgICAgIC50aWNrcyh0aGlzLnlBeGlzVGlja3MpXG4gICAgICAgIC50aWNrU2l6ZSgtdGhpcy53aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodCk7XG5cbiAgICAgIHRoaXMueUdyaWQgPSB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyaWQgZ3JpZC15JylcbiAgICAgICAgLmNsYXNzZWQoJ2dyaWQtemVyby1oaWRkZW4nLCB0aGlzLmhpZGVZQXhpc1plcm8pXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsIDApYClcbiAgICAgICAgLmNhbGwodGhpcy55R3JpZENhbGwpO1xuICAgIH1cblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgd2VzdCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXInKTtcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyLXZhbHVlJyk7XG5cbiAgICAgIC8vIHRvb2x0aXAgdGFibGVcbiAgICAgIHRoaXMudG9vbHRpcFxuICAgICAgICAuYXBwZW5kKCd0YWJsZScpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd0b29sdGlwLXRhYmxlIHRleHQtbGVmdCB3LTEwMCcpXG4gICAgICAgIC5hcHBlbmQoJ3Rib2R5Jyk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGxlZ2VuZCBjbGFzc2VzXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuY2hhcnQuY2xhc3NlZCgncGJkcy1jaGFydC1sZWdlbmQtYm90dG9tJywgdGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gJ2JvdHRvbScgPyB0cnVlIDogZmFsc2UpO1xuICAgICAgdGhpcy5jaGFydC5hcHBlbmQoJ3VsJykuYXR0cignY2xhc3MnLCBgbGVnZW5kIGxlZ2VuZC0ke3RoaXMubGVnZW5kUG9zaXRpb259YCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydChmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoZmlyc3RSdW4gPSB0cnVlKSA9PiB7XG4gICAgdGhpcy5kYXRhS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGF0YVswXSkuZmlsdGVyKGl0ZW0gPT4gaXRlbSAhPT0gJ2tleScpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBEMyBzdGFjayBkYXRhXG4gICAgdGhpcy5kYXRhU3RhY2sgPSBkM19zdGFjaygpXG4gICAgICAua2V5cyh0aGlzLmRhdGFLZXlzKVxuICAgICAgLm9yZGVyKGQzX3N0YWNrT3JkZXJOb25lKSh0aGlzLmRhdGEpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSB4U2NhbGVcbiAgICB0aGlzLnhBeGlzU2NhbGUuZG9tYWluKHRoaXMuZGF0YS5tYXAoZCA9PiBkLmtleSkpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSB5U2NhbGVcbiAgICB0aGlzLnlBeGlzTWF4ID0gZDNfbWF4KHRoaXMuZGF0YVN0YWNrLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICByZXR1cm4gZDNfbWF4KGRhdGEsIChkOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIGRbMV07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMueUF4aXNNYXggPSB0aGlzLnlBeGlzTWF4ICsgdGhpcy55QXhpc01heCAqIHRoaXMueUF4aXNNYXhCdWZmZXI7XG5cbiAgICB0aGlzLnlBeGlzU2NhbGVcbiAgICAgIC5kb21haW4oWzAsIHRoaXMueUF4aXNNYXhdKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMuaGVpZ2h0LCAwXSlcbiAgICAgIC5uaWNlKCk7XG5cbiAgICB0aGlzLnhBeGlzXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMCkgLy8gMTAwMFxuICAgICAgLmNhbGwodGhpcy54QXhpc0NhbGwpO1xuXG4gICAgdGhpcy55QXhpc1xuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDApIC8vIDEwMDBcbiAgICAgIC5jYWxsKHRoaXMueUF4aXNDYWxsKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgZ3JpZHNcbiAgICBpZiAoIXRoaXMuaGlkZVhHcmlkKSB7XG4gICAgICB0aGlzLnhHcmlkXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDApIC8vIDEwMDBcbiAgICAgICAgLmNhbGwodGhpcy54R3JpZENhbGwpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlWUdyaWQpIHtcbiAgICAgIHRoaXMueUdyaWRcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMCkgLy8gMTAwMFxuICAgICAgICAuY2FsbCh0aGlzLnlHcmlkQ2FsbCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGdyYXkgYmFyc1xuICAgIGlmICghdGhpcy5oaWRlR3JheUJhcnMpIHtcbiAgICAgIHRoaXMuZ3JheUJhcnNcbiAgICAgICAgLnNlbGVjdEFsbCgnLmdyYXktYmFyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmF5LWJhcicpXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhBeGlzU2NhbGUoZC5rZXkpKVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodCksXG4gICAgICAgICAgdXBkYXRlID0+XG4gICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oKGQsIGksIG4pID0+IChmaXJzdFJ1biA/IDAgOiAxMDAwKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KSxcbiAgICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgY29sb3JlZCBiYXJzXG4gICAgY29uc3QgYmFyR3JvdXBzID0gdGhpcy5iYXJzXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YVN0YWNrKVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jhci1ncm91cCcpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsIGQgPT4gdGhpcy5jb2xvclJhbmdlKGQuaW5kZXgpKSxcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZS5hdHRyKCdmaWxsJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5pbmRleCkpLFxuICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICk7XG5cbiAgICBiYXJHcm91cHNcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoZCA9PiBkKVxuICAgICAgLmpvaW4oXG4gICAgICAgIGVudGVyID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gICAgICAgICAgICAuY2xhc3NlZCgnYmFyLWRpdmlkZWQnLCB0aGlzLnR5cGUgIT09ICdoaWdoJylcbiAgICAgICAgICAgIC5jbGFzc2VkKCdiYXItZGl2aWRlZC1sb3cnLCB0aGlzLnR5cGUgPT09ICdsb3cnKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICBsZXQgeDtcblxuICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xuICAgICAgICAgICAgICAgIHggPSB0aGlzLnhBeGlzU2NhbGUoZC5kYXRhLmtleSkgKyAodGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gOCkgKiAzO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHggPSB0aGlzLnhBeGlzU2NhbGUoZC5kYXRhLmtleSkgKyAodGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gNCkgKiAxO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkWzBdKSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGQgPT4ge1xuICAgICAgICAgICAgICBsZXQgd2lkdGg7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQ7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd2lkdGggPSB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyAyO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgLmNhbGwoZW50ZXIgPT4ge1xuICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oKGQsIGksIG4pID0+IChmaXJzdFJ1biA/IDAgOiA1MDApKVxuICAgICAgICAgICAgICAgIC5kZWxheSgoZCwgaSwgbikgPT4gKGZpcnN0UnVuID8gMCA6IDc1MCkpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueUF4aXNTY2FsZShkWzFdKSlcbiAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy55QXhpc1NjYWxlKGRbMF0pIC0gdGhpcy55QXhpc1NjYWxlKGRbMV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHJldHVybiBlbnRlcjtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICB1cGRhdGUuY2FsbCh1cGRhdGUgPT4ge1xuICAgICAgICAgICAgLy8gbGV0IHdpZHRoO1xuXG4gICAgICAgICAgICAvLyBpZiAodGhpcy50eXBlID09PSAnbWVkaXVtJykge1xuICAgICAgICAgICAgLy8gICB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDQ7XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICB3aWR0aCA9IHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSAvIDI7XG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkgLyA0KVxuICAgICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB0aGlzLnhBeGlzU2NhbGUoZC5kYXRhLmtleSkgKyAodGhpcy54QXhpc1NjYWxlLmJhbmR3aWR0aCgpIC8gOCkgKiAzKVxuICAgICAgICAgICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55QXhpc1NjYWxlKGRbMV0pKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiB0aGlzLnlBeGlzU2NhbGUoZFswXSkgLSB0aGlzLnlBeGlzU2NhbGUoZFsxXSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgICAgICAgIH0pLFxuXG4gICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgKTtcblxuICAgIC8vIG1vdXNlb3ZlciBiYXJzXG4gICAgdGhpcy5tb3VzZUJhcnNcbiAgICAgIC5zZWxlY3RBbGwoJy5tb3VzZW92ZXItYmFyJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICBlbnRlciA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtb3VzZW92ZXItYmFyJylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAuYXR0cigneCcsIGQgPT4gdGhpcy54QXhpc1NjYWxlKGQua2V5KSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueEF4aXNTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodCksXG4gICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueEF4aXNTY2FsZShkLmtleSkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnhBeGlzU2NhbGUuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICBleGl0ID0+XG4gICAgICAgICAgZXhpdFxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgLnJlbW92ZSgpXG4gICAgICApXG4gICAgICAub24oJ21vdXNlb3ZlcicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpKVxuICAgICAgLm9uKCdtb3VzZW91dCcsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHRoaXMuYmFyTW91c2VPdXQoKSlcbiAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmJhck1vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuXG4gICAgdGhpcy5iYXJzLnJhaXNlKCk7XG4gICAgdGhpcy54QXhpcy5yYWlzZSgpO1xuICAgIHRoaXMubW91c2VCYXJzLnJhaXNlKCk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5jaGFydFxuICAgICAgICAuc2VsZWN0KCcubGVnZW5kJylcbiAgICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhU3RhY2spXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZW50ZXIuYXBwZW5kKCdsaScpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1pdGVtJyk7XG5cbiAgICAgICAgICAgIGxpLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgZCA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5pbmRleCkpO1xuXG4gICAgICAgICAgICBsaS5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJylcbiAgICAgICAgICAgICAgLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5rZXkpO1xuXG4gICAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB1cGRhdGUgPT4ge1xuICAgICAgICAgICAgdXBkYXRlLnNlbGVjdCgnLmxlZ2VuZC1sYWJlbCcpLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQoZC5rZXkpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lID0gZDNfaXNvUGFyc2UoZC5rZXkpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5sZWdlbmRNb3VzZU92ZXIoZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB0aGlzLmxlZ2VuZE1vdXNlT3V0KCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLmxlZ2VuZE1vdXNlQ2xpY2soZDNfZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykpO1xuICAgIH1cbiAgfTtcblxuICBiYXJNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXItZ3JvdXAnKVxuICAgICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgdGhpcy50b29sdGlwU2hvdyhkYXRhLCBpbmRleCwgbm9kZXNbaW5kZXhdKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gIH07XG5cbiAgYmFyTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXInKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBiYXJNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXJ0XG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGxlZ2VuZE1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgbGVnZW5kTW91c2VDbGljayA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHhBeGlzRm9ybWF0dGVyID0gaXRlbSA9PiB7XG4gICAgc3dpdGNoICh0aGlzLnhBeGlzRm9ybWF0VHlwZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQoaXRlbSk7XG5cbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBjb25zdCBwYXJzZURhdGUgPSBkM19pc29QYXJzZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNGb3JtYXQocGFyc2VEYXRlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZGF0YSwgaW5kZXgsIG5vZGUpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygnVE9PTFRJUDogJywgZGF0YSwgaW5kZXgsIG5vZGUpO1xuXG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgY29uc3QgbW91c2VyZWN0RGltZW5zaW9ucyA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY2xpZW50V2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gMTA7XG4gICAgbGV0IGRpbWVuc2lvbkNhbGN1bGF0ZWQ7XG4gICAgbGV0IHRvb2x0aXBEaW1lbnNpb25zO1xuICAgIGxldCB0b29sdGlwT2Zmc2V0SGVpZ2h0O1xuICAgIGxldCB5UG9zaXRpb247XG4gICAgbGV0IHhQb3NpdGlvbjtcblxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbCwgbW91c2VyZWN0RGltZW5zaW9ucywgdG9vbHRpcE9mZnNldEhlaWdodCwgdG9vbHRpcERpbWVuc2lvbnMsIGRpbWVuc2lvbkNhbGN1bGF0ZWQsIGNsaWVudFdpZHRoKTtcblxuICAgIHRoaXMudG9vbHRpcC5zZWxlY3QoJy50b29sdGlwLWhlYWRlcicpLmh0bWwoZCA9PiB7XG4gICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcEhlYWRpbmdGb3JtYXRUeXBlKSB7XG4gICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgIGNvbnN0IHBhcnNlRGF0ZSA9IGQzX2lzb1BhcnNlKGRhdGEua2V5KTtcbiAgICAgICAgICByZXR1cm4gdGhpcy50b29sdGlwSGVhZGluZ0Zvcm1hdChwYXJzZURhdGUpO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGRhdGEua2V5O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyLXZhbHVlJykuaHRtbChkID0+IHtcbiAgICAgIGxldCB0b3RhbCA9IDA7XG5cbiAgICAgIE9iamVjdC5rZXlzKGRhdGEpLm1hcChlID0+IHtcbiAgICAgICAgaWYgKGUgIT09ICdrZXknKSB7XG4gICAgICAgICAgdG90YWwgPSB0b3RhbCArIGRhdGFbZV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy50b29sdGlwSGVhZGluZ1ZhbHVlRm9ybWF0KHRvdGFsKTtcbiAgICB9KTtcblxuICAgIHRoaXMudG9vbHRpcFxuICAgICAgLnNlbGVjdCgnLnRvb2x0aXAtdGFibGUnKVxuICAgICAgLnNlbGVjdCgndGJvZHknKVxuICAgICAgLmh0bWwoZCA9PiB7XG4gICAgICAgIGxldCBodG1sID0gYGA7XG4gICAgICAgIGxldCBsYWJlbDtcbiAgICAgICAgbGV0IHZhbHVlO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLm1hcCgoa2V5LCBpbmRleCkgPT4ge1xuICAgICAgICAgIHN3aXRjaCAodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2Uoa2V5KTtcbiAgICAgICAgICAgICAgbGFiZWwgPSB0aGlzLnRvb2x0aXBIZWFkaW5nRm9ybWF0KHBhcnNlRGF0ZSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBsYWJlbCA9IGtleTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzd2l0Y2ggKHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhW2tleV0pO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgdmFsdWUgPSBkYXRhW2tleV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGtleSAhPT0gJ2tleScpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gYFxuICAgICAgICAgICAgICA8dHIgY2xhc3M9J3Rvb2x0aXAtaXRlbSc+XG4gICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwiY29sb3I6ICR7dGhpcy5jb2xvclJhbmdlKGluZGV4IC0gMSl9XCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBiZHMtdG9vbHRpcC1rZXlcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0b29sdGlwLWxhYmVsIHByLTIgdGV4dC1ub3dyYXBcIj4ke2xhYmVsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwidG9vbHRpcC12YWx1ZSB0ZXh0LXJpZ2h0IHRleHQtbm93cmFwXCI+JHt2YWx1ZX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgYDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBodG1sO1xuICAgICAgfSk7XG5cbiAgICB0b29sdGlwRGltZW5zaW9ucyA9IHRoaXMudG9vbHRpcC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgZGltZW5zaW9uQ2FsY3VsYXRlZCA9IG1vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggKyB0b29sdGlwRGltZW5zaW9ucy53aWR0aCArIDg7XG4gICAgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodDtcblxuICAgIC8vIGZsaXAgdGhlIHRvb2x0aXAgcG9zaXRpb25zIGlmIG5lYXIgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIHNjcmVlblxuICAgIGlmIChkaW1lbnNpb25DYWxjdWxhdGVkID4gY2xpZW50V2lkdGgpIHtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCdlYXN0JywgdHJ1ZSk7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnd2VzdCcsIGZhbHNlKTtcblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21lZGl1bScpIHtcbiAgICAgICAgeFBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgKG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggLyA4KSAqIDMgLSB0b29sdGlwRGltZW5zaW9ucy53aWR0aCAtIDh9cHhgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeFBvc2l0aW9uID0gYCR7bW91c2VyZWN0RGltZW5zaW9ucy5sZWZ0ICsgKG1vdXNlcmVjdERpbWVuc2lvbnMud2lkdGggLyA0KSAqIDEgLSB0b29sdGlwRGltZW5zaW9ucy53aWR0aCAtIDh9cHhgO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGltZW5zaW9uQ2FsY3VsYXRlZCA8IGNsaWVudFdpZHRoKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuY2xhc3NlZCgnZWFzdCcsIGZhbHNlKTtcbiAgICAgIHRoaXMudG9vbHRpcC5jbGFzc2VkKCd3ZXN0JywgdHJ1ZSk7XG5cbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdtZWRpdW0nKSB7XG4gICAgICAgIHhQb3NpdGlvbiA9IGAke21vdXNlcmVjdERpbWVuc2lvbnMubGVmdCArIChtb3VzZXJlY3REaW1lbnNpb25zLndpZHRoIC8gOCkgKiA1ICsgOH1weGA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4UG9zaXRpb24gPSBgJHttb3VzZXJlY3REaW1lbnNpb25zLmxlZnQgKyAobW91c2VyZWN0RGltZW5zaW9ucy53aWR0aCAvIDQpICogMyArIDh9cHhgO1xuICAgICAgfVxuICAgIH1cblxuICAgIHlQb3NpdGlvbiA9IHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCcuYmFyLWdyb3VwJylcbiAgICAgIC5maWx0ZXIoJzpsYXN0LWNoaWxkJylcbiAgICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpXG4gICAgICAubm9kZSgpXG4gICAgICAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAvLyBzZXQgdGhlIHRvb2x0aXAgc3R5bGVzXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHt5UG9zaXRpb24udG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodCAvIDIgKyBzY3JvbGxbMV19cHhgKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCB4UG9zaXRpb24pO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB5QXhpc0Zvcm1hdHRlciA9IGl0ZW0gPT4ge1xuICAgIHN3aXRjaCAodGhpcy55QXhpc0Zvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KGl0ZW0pO1xuXG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VEYXRlID0gZDNfaXNvUGFyc2UoaXRlbSk7XG4gICAgICAgIHJldHVybiB0aGlzLnlBeGlzRm9ybWF0KHBhcnNlRGF0ZSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
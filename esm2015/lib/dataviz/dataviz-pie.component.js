/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select, scaleOrdinal as d3_scaleOrdinal, pie as d3_pie, arc as d3_arc, interpolate as d3_interpolate, mouse as d3_mouse, format as d3_format, event as d3_event, timeFormat as d3_timeFormat, isoParse as d3_isoParse } from 'd3';
import { PbdsDatavizService } from './dataviz.service';
export class PbdsDatavizPieComponent {
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
        this.updateChart = () => {
            /** @type {?} */
            let paths = this.svg.selectAll('path').data(this.pie(this.data));
            paths.exit().remove();
            //update existing items
            paths
                .each((d) => (d.outerRadius = this.outerRadius))
                .transition()
                .duration(500)
                .attrTween('d', this.arcTween);
            // paths on enter
            /** @type {?} */
            let enterPaths = paths
                .enter()
                .append('path')
                .each((d) => (d.outerRadius = this.outerRadius))
                .attr('d', this.arc)
                .attr('fill', (d) => this.colorRange(d.data.label))
                .attr('class', 'slice')
                .each((d, i, nodes) => {
                this.currentData.splice(i, 1, d);
            });
            if (this.type === 'pie') {
                enterPaths
                    .style('stroke', '#fff')
                    .style('stroke-width', 2)
                    .style('stroke-alignment', 'inner');
            }
            /** @type {?} */
            let legendItem = this.chart
                .select('.legend')
                .selectAll('.legend-item')
                .data(this.data);
            legendItem.exit().remove();
            // update existing items
            legendItem.select('.legend-label').html((d) => {
                switch (this.legendLabelFormatType) {
                    case 'time':
                        /** @type {?} */
                        const parsedTime = d3_isoParse(d.label);
                        return this.legendLabelFormat(parsedTime);
                    default:
                        return d.label;
                }
            });
            legendItem.select('.legend-value').html((d) => this.legendValueFormat(d.value));
            // legend items on enter
            /** @type {?} */
            let enterLegendItem = legendItem
                .enter()
                .append('li')
                .attr('tabindex', 0)
                .attr('class', 'legend-item');
            enterLegendItem
                .append('span')
                .attr('class', 'legend-key')
                .style('background-color', (d) => this.colorRange(d.label));
            /** @type {?} */
            const legendDescription = enterLegendItem.append('span').attr('class', 'legend-description');
            legendDescription
                .append('span')
                .attr('class', 'legend-label')
                .html((d) => {
                switch (this.legendLabelFormatType) {
                    case 'time':
                        /** @type {?} */
                        const parsedTime = d3_isoParse(d.label);
                        return this.legendLabelFormat(parsedTime);
                    default:
                        return d.label;
                }
            });
            legendDescription
                .append('span')
                .attr('class', 'legend-value')
                .html((d) => this.legendValueFormat(d.value));
            enterLegendItem
                .on('mouseover focus', (data, index, nodes) => {
                this.legendMouseOverFocus(data, index, nodes);
                this.pathMouseOver(d3_event, data, index, nodes);
            })
                .on('mouseout blur', (data, index, nodes) => {
                this.legendMouseOutBlur(data, index, nodes);
                this.pathMouseOut(data, index, nodes);
            })
                .on('click', (data, index, nodes) => {
                this.clicked.emit(data);
            });
            enterPaths
                .on('mouseover', (data, index, nodes) => {
                this.pathMouseOver(d3_event, data, index, nodes);
                this.tooltipShow(this.chart.node(), data);
            })
                .on('mousemove', (data, index, nodes) => {
                this.tooltipMove(this.chart.node());
            })
                .on('mouseout', (data, index, nodes) => {
                this.pathMouseOut(data, index, nodes);
                this.tooltipHide();
            })
                .on('click', (data, index, nodes) => {
                this.pathClick(d3_event, data, index, nodes);
            });
        };
        this.arcTween = (data, index, nodes) => {
            // console.log('ARGS: ', data, index, nodes);
            /** @type {?} */
            const i = d3_interpolate(this.currentData[index], data);
            this.currentData[index] = i(1);
            return t => this.arc(i(t));
        };
        this.legendMouseOverFocus = (data, index, nodes) => {
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== index)
                .classed('inactive', true);
        };
        this.legendMouseOutBlur = (data, index, nodes) => {
            this.chart.selectAll('.legend-item').classed('inactive', false);
        };
        this.pathMouseOver = (event, data, index, nodes) => {
            /** @type {?} */
            let slices = this.chart.selectAll('.slice');
            /** @type {?} */
            let slice = slices.filter((d, i) => i === index);
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== index)
                .classed('inactive', true);
            slices.filter((d, i) => i !== index).classed('inactive', true);
            slice
                .transition()
                .duration(300)
                .delay(0)
                .attrTween('d', (d) => {
                /** @type {?} */
                let i = d3_interpolate(d.outerRadius, this.outerRadius + this.arcZoom);
                return t => {
                    d.outerRadius = i(t);
                    return this.arc(d);
                };
            });
            this.hovered.emit({
                event: event,
                data: data.data ? data.data : data // legend hover data is different than slice hover data
            });
        };
        this.pathMouseOut = (data, index, value) => {
            /** @type {?} */
            let slices = this.chart.selectAll('.slice');
            /** @type {?} */
            let slice = slices.filter((d, i) => i === index);
            this.chart
                .selectAll('.legend-item')
                .filter((d, i) => i !== index)
                .classed('inactive', false);
            slices.classed('inactive', false);
            slice
                .transition()
                .duration(300)
                .delay(0)
                .attrTween('d', (d) => {
                /** @type {?} */
                let i = d3_interpolate(d.outerRadius, this.outerRadius);
                return t => {
                    d.outerRadius = i(t);
                    return this.arc(d);
                };
            });
        };
        this.pathClick = (event, data, index, nodes) => {
            this.clicked.emit({
                event: event,
                data: data.data
            });
        };
        this.tooltipShow = (node, data) => {
            this.tooltipSetPosition(node);
            /** @type {?} */
            let percentage = (data.endAngle - data.startAngle) / (2 * Math.PI);
            /** @type {?} */
            let label;
            switch (this.tooltipLabelFormatType) {
                case 'time':
                    /** @type {?} */
                    const parsedTime = d3_isoParse(data.data.label);
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
        };
        this.tooltipMove = node => {
            this.tooltipSetPosition(node);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.tooltipSetPosition = node => {
            /** @type {?} */
            let coordinates = d3_mouse(node);
            this.tooltip.style('left', `${coordinates[0] + 16}px`);
            this.tooltip.style('top', `${coordinates[1] + 16}px`);
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
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
            .domain(this.data.map(c => c.label));
        if (this.type === 'pie') {
            this.innerRadius = 0;
            this.anglePad = 0;
        }
        this.pie = d3_pie()
            .padAngle(this.anglePad)
            .value((d) => d.value)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1waWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFdBQVcsRUFHWCxNQUFNLEVBQ04sWUFBWSxFQUNaLHVCQUF1QixFQUV4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsTUFBTSxJQUFJLFNBQVMsRUFDbkIsWUFBWSxJQUFJLGVBQWUsRUFDL0IsR0FBRyxJQUFJLE1BQU0sRUFDYixHQUFHLElBQUksTUFBTSxFQUNiLFdBQVcsSUFBSSxjQUFjLEVBQzdCLEtBQUssSUFBSSxRQUFRLEVBQ2pCLE1BQU0sSUFBSSxTQUFTLEVBQ25CLEtBQUssSUFBSSxRQUFRLEVBQ2pCLFVBQVUsSUFBSSxhQUFhLEVBQzNCLFFBQVEsSUFBSSxXQUFXLEVBQ3hCLE1BQU0sSUFBSSxDQUFDO0FBRVosT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFTdkQsTUFBTSxPQUFPLHVCQUF1Qjs7Ozs7SUErRGxDLFlBQW9CLFFBQTRCLEVBQVUsUUFBb0I7UUFBMUQsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBN0Q5RSxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFNaEIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFNBQUksR0FBb0IsS0FBSyxDQUFDO1FBRzlCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFHbkIsMEJBQXFCLEdBQVcsSUFBSSxDQUFDO1FBR3JDLDRCQUF1QixHQUFHLEVBQUUsQ0FBQztRQUc3Qiw0QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFHN0IsMkJBQXNCLEdBQVcsSUFBSSxDQUFD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Z0RBMkJFOzs7OztJQUVGLCtDQXNCRTs7Ozs7SUFFRiw0Q0FLRTs7Ozs7SUFFRiw4Q0F3QkU7Ozs7O0lBRUYsOENBRUU7Ozs7O0lBRUYsOENBRUU7Ozs7O0lBRUYscURBS0U7Ozs7O0lBL1RVLDJDQUFvQzs7Ozs7SUFBRSwyQ0FBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBzZWxlY3QgYXMgZDNfc2VsZWN0LFxuICBzY2FsZU9yZGluYWwgYXMgZDNfc2NhbGVPcmRpbmFsLFxuICBwaWUgYXMgZDNfcGllLFxuICBhcmMgYXMgZDNfYXJjLFxuICBpbnRlcnBvbGF0ZSBhcyBkM19pbnRlcnBvbGF0ZSxcbiAgbW91c2UgYXMgZDNfbW91c2UsXG4gIGZvcm1hdCBhcyBkM19mb3JtYXQsXG4gIGV2ZW50IGFzIGQzX2V2ZW50LFxuICB0aW1lRm9ybWF0IGFzIGQzX3RpbWVGb3JtYXQsXG4gIGlzb1BhcnNlIGFzIGQzX2lzb1BhcnNlXG59IGZyb20gJ2QzJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpQaWUgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1waWUnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlVXJsczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6UGllQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1waWUnKVxuICBwaWVDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogQXJyYXk8UGJkc0RhdGF2aXpQaWU+O1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzAwO1xuXG4gIEBJbnB1dCgpXG4gIHR5cGU6ICdwaWUnIHwgJ2RvbnV0JyA9ICdwaWUnO1xuXG4gIEBJbnB1dCgpXG4gIG1vbm9jaHJvbWUgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbEZvcm1hdFR5cGU6ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBsZWdlbmRWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFR5cGU6ICd0aW1lJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBjdXJyZW50RGF0YSA9IFtdO1xuICBwcml2YXRlIGhlaWdodDtcbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JzO1xuICBwcml2YXRlIGNvbG9yUmFuZ2U7XG4gIHByaXZhdGUgYXJjO1xuICBwcml2YXRlIGFyY1pvb207XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIHBpZTtcbiAgcHJpdmF0ZSBsZWdlbmQ7XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgbGVnZW5kVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgaW5uZXJSYWRpdXM7XG4gIHByaXZhdGUgYW5nbGVQYWQ7XG4gIHByaXZhdGUgb3V0ZXJSYWRpdXM7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHsgdG9wOiAxMCwgcmlnaHQ6IDEwLCBib3R0b206IDEwLCBsZWZ0OiAxMCB9O1xuICAgIHRoaXMud2lkdGggPSB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbTtcbiAgICB0aGlzLmNvbG9ycyA9IHRoaXMuX2RhdGF2aXouZ2V0Q29sb3JzKHRoaXMubW9ub2Nocm9tZSk7XG4gICAgdGhpcy5pbm5lclJhZGl1cyA9IE1hdGgubWluKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KSAvIDIuNTtcbiAgICB0aGlzLm91dGVyUmFkaXVzID0gTWF0aC5taW4odGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpIC8gMjtcbiAgICB0aGlzLmFyY1pvb20gPSAxMDtcbiAgICB0aGlzLmFuZ2xlUGFkID0gMC4wMjtcbiAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMubGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0ID0gZDNfdGltZUZvcm1hdCh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0ID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgc3dpdGNoICh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICB0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdCA9IGQzX3RpbWVGb3JtYXQodGhpcy50b29sdGlwTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVPcmRpbmFsKClcbiAgICAgIC5yYW5nZSh0aGlzLmNvbG9ycylcbiAgICAgIC5kb21haW4odGhpcy5kYXRhLm1hcChjID0+IGMubGFiZWwpKTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdwaWUnKSB7XG4gICAgICB0aGlzLmlubmVyUmFkaXVzID0gMDtcbiAgICAgIHRoaXMuYW5nbGVQYWQgPSAwO1xuICAgIH1cblxuICAgIHRoaXMucGllID0gZDNfcGllKClcbiAgICAgIC5wYWRBbmdsZSh0aGlzLmFuZ2xlUGFkKVxuICAgICAgLnZhbHVlKChkOiBhbnkpID0+IGQudmFsdWUpXG4gICAgICAuc29ydChudWxsKTtcblxuICAgIHRoaXMuYXJjID0gZDNfYXJjKClcbiAgICAgIC5wYWRSYWRpdXModGhpcy5vdXRlclJhZGl1cylcbiAgICAgIC5pbm5lclJhZGl1cyh0aGlzLmlubmVyUmFkaXVzKTtcblxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCB0aGlzLndpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLndpZHRoIC8gMiArIHRoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMuaGVpZ2h0IC8gMiArIHRoaXMubWFyZ2luLnRvcH0gJHt0aGlzLndpZHRoICtcbiAgICAgICAgICB0aGlzLm1hcmdpbi5sZWZ0ICtcbiAgICAgICAgICB0aGlzLm1hcmdpbi5yaWdodH0gJHt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbX1gXG4gICAgICApO1xuXG4gICAgdGhpcy5sZWdlbmQgPSB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsICdsZWdlbmQgbGVnZW5kLXJpZ2h0Jyk7XG5cbiAgICB0aGlzLnRvb2x0aXAgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAnKVxuICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICB1cGRhdGVDaGFydCA9ICgpID0+IHtcbiAgICBsZXQgcGF0aHMgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJ3BhdGgnKS5kYXRhKHRoaXMucGllKHRoaXMuZGF0YSkpO1xuXG4gICAgcGF0aHMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgLy91cGRhdGUgZXhpc3RpbmcgaXRlbXNcbiAgICBwYXRoc1xuICAgICAgLmVhY2goKGQ6IGFueSkgPT4gKGQub3V0ZXJSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzKSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAuYXR0clR3ZWVuKCdkJywgdGhpcy5hcmNUd2Vlbik7XG5cbiAgICAvLyBwYXRocyBvbiBlbnRlclxuICAgIGxldCBlbnRlclBhdGhzID0gcGF0aHNcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5lYWNoKChkOiBhbnkpID0+IChkLm91dGVyUmFkaXVzID0gdGhpcy5vdXRlclJhZGl1cykpXG4gICAgICAuYXR0cignZCcsIHRoaXMuYXJjKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZDogYW55KSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5kYXRhLmxhYmVsKSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdzbGljZScpXG4gICAgICAuZWFjaCgoZCwgaSwgbm9kZXMpID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50RGF0YS5zcGxpY2UoaSwgMSwgZCk7XG4gICAgICB9KTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdwaWUnKSB7XG4gICAgICBlbnRlclBhdGhzXG4gICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJyNmZmYnKVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIDIpXG4gICAgICAgIC5zdHlsZSgnc3Ryb2tlLWFsaWdubWVudCcsICdpbm5lcicpO1xuICAgIH1cblxuICAgIGxldCBsZWdlbmRJdGVtID0gdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdCgnLmxlZ2VuZCcpXG4gICAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKTtcblxuICAgIGxlZ2VuZEl0ZW0uZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgLy8gdXBkYXRlIGV4aXN0aW5nIGl0ZW1zXG4gICAgbGVnZW5kSXRlbS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKChkOiBhbnkpID0+IHtcbiAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZWdlbmRJdGVtLnNlbGVjdCgnLmxlZ2VuZC12YWx1ZScpLmh0bWwoKGQ6IGFueSkgPT4gdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdChkLnZhbHVlKSk7XG5cbiAgICAvLyBsZWdlbmQgaXRlbXMgb24gZW50ZXJcbiAgICBsZXQgZW50ZXJMZWdlbmRJdGVtID0gbGVnZW5kSXRlbVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ2xpJylcbiAgICAgIC5hdHRyKCd0YWJpbmRleCcsIDApXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWl0ZW0nKTtcblxuICAgIGVudGVyTGVnZW5kSXRlbVxuICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWtleScpXG4gICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCAoZDogYW55KSA9PiB0aGlzLmNvbG9yUmFuZ2UoZC5sYWJlbCkpO1xuXG4gICAgY29uc3QgbGVnZW5kRGVzY3JpcHRpb24gPSBlbnRlckxlZ2VuZEl0ZW0uYXBwZW5kKCdzcGFuJykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWRlc2NyaXB0aW9uJyk7XG5cbiAgICBsZWdlbmREZXNjcmlwdGlvblxuICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJylcbiAgICAgIC5odG1sKChkOiBhbnkpID0+IHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmxlZ2VuZExhYmVsRm9ybWF0VHlwZSkge1xuICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnZW5kTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgbGVnZW5kRGVzY3JpcHRpb25cbiAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC12YWx1ZScpXG4gICAgICAuaHRtbCgoZDogYW55KSA9PiB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0KGQudmFsdWUpKTtcblxuICAgIGVudGVyTGVnZW5kSXRlbVxuICAgICAgLm9uKCdtb3VzZW92ZXIgZm9jdXMnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMubGVnZW5kTW91c2VPdmVyRm9jdXMoZGF0YSwgaW5kZXgsIG5vZGVzKTtcbiAgICAgICAgdGhpcy5wYXRoTW91c2VPdmVyKGQzX2V2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQgYmx1cicsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICAgICAgdGhpcy5sZWdlbmRNb3VzZU91dEJsdXIoZGF0YSwgaW5kZXgsIG5vZGVzKTtcbiAgICAgICAgdGhpcy5wYXRoTW91c2VPdXQoZGF0YSwgaW5kZXgsIG5vZGVzKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgICAgICB0aGlzLmNsaWNrZWQuZW1pdChkYXRhKTtcbiAgICAgIH0pO1xuXG4gICAgZW50ZXJQYXRoc1xuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMucGF0aE1vdXNlT3ZlcihkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKTtcbiAgICAgICAgdGhpcy50b29sdGlwU2hvdyh0aGlzLmNoYXJ0Lm5vZGUoKSwgZGF0YSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW1vdmUnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMudG9vbHRpcE1vdmUodGhpcy5jaGFydC5ub2RlKCkpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMucGF0aE1vdXNlT3V0KGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2NsaWNrJywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgICAgICB0aGlzLnBhdGhDbGljayhkM19ldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgYXJjVHdlZW4gPSAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJ0FSR1M6ICcsIGRhdGEsIGluZGV4LCBub2Rlcyk7XG4gICAgY29uc3QgaSA9IGQzX2ludGVycG9sYXRlKHRoaXMuY3VycmVudERhdGFbaW5kZXhdLCBkYXRhKTtcblxuICAgIHRoaXMuY3VycmVudERhdGFbaW5kZXhdID0gaSgxKTtcbiAgICByZXR1cm4gdCA9PiB0aGlzLmFyYyhpKHQpKTtcbiAgfTtcblxuICBwcml2YXRlIGxlZ2VuZE1vdXNlT3ZlckZvY3VzID0gKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuICB9O1xuXG4gIHByaXZhdGUgbGVnZW5kTW91c2VPdXRCbHVyID0gKGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcbiAgfTtcblxuICBwcml2YXRlIHBhdGhNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIGxldCBzbGljZXMgPSB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLnNsaWNlJyk7XG4gICAgbGV0IHNsaWNlID0gc2xpY2VzLmZpbHRlcigoZCwgaSkgPT4gaSA9PT0gaW5kZXgpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGluZGV4KVxuICAgICAgLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBzbGljZXMuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleCkuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHNsaWNlXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMzAwKVxuICAgICAgLmRlbGF5KDApXG4gICAgICAuYXR0clR3ZWVuKCdkJywgKGQ6IGFueSkgPT4ge1xuICAgICAgICBsZXQgaSA9IGQzX2ludGVycG9sYXRlKGQub3V0ZXJSYWRpdXMsIHRoaXMub3V0ZXJSYWRpdXMgKyB0aGlzLmFyY1pvb20pO1xuICAgICAgICByZXR1cm4gdCA9PiB7XG4gICAgICAgICAgZC5vdXRlclJhZGl1cyA9IGkodCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYXJjKGQpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7XG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICBkYXRhOiBkYXRhLmRhdGEgPyBkYXRhLmRhdGEgOiBkYXRhIC8vIGxlZ2VuZCBob3ZlciBkYXRhIGlzIGRpZmZlcmVudCB0aGFuIHNsaWNlIGhvdmVyIGRhdGFcbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIHBhdGhNb3VzZU91dCA9IChkYXRhLCBpbmRleCwgdmFsdWUpID0+IHtcbiAgICBsZXQgc2xpY2VzID0gdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5zbGljZScpO1xuICAgIGxldCBzbGljZSA9IHNsaWNlcy5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGluZGV4KTtcblxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiBpICE9PSBpbmRleClcbiAgICAgIC5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHNsaWNlcy5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHNsaWNlXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oMzAwKVxuICAgICAgLmRlbGF5KDApXG4gICAgICAuYXR0clR3ZWVuKCdkJywgKGQ6IGFueSkgPT4ge1xuICAgICAgICBsZXQgaSA9IGQzX2ludGVycG9sYXRlKGQub3V0ZXJSYWRpdXMsIHRoaXMub3V0ZXJSYWRpdXMpO1xuICAgICAgICByZXR1cm4gdCA9PiB7XG4gICAgICAgICAgZC5vdXRlclJhZGl1cyA9IGkodCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYXJjKGQpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBwYXRoQ2xpY2sgPSAoZXZlbnQsIGRhdGEsIGluZGV4LCBub2RlcykgPT4ge1xuICAgIHRoaXMuY2xpY2tlZC5lbWl0KHtcbiAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgIGRhdGE6IGRhdGEuZGF0YVxuICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAobm9kZSwgZGF0YSkgPT4ge1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKG5vZGUpO1xuXG4gICAgbGV0IHBlcmNlbnRhZ2UgPSAoZGF0YS5lbmRBbmdsZSAtIGRhdGEuc3RhcnRBbmdsZSkgLyAoMiAqIE1hdGguUEkpO1xuICAgIGxldCBsYWJlbDtcblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGRhdGEuZGF0YS5sYWJlbCk7XG4gICAgICAgIGxhYmVsID0gdGhpcy50b29sdGlwTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsYWJlbCA9IGRhdGEuZGF0YS5sYWJlbDtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXAuaHRtbChcbiAgICAgIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInRvb2x0aXAtbGFiZWxcIj4ke2xhYmVsfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZVwiPiR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQocGVyY2VudGFnZSl9PC9kaXY+XG4gICAgICBgXG4gICAgKTtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcE1vdmUgPSBub2RlID0+IHtcbiAgICB0aGlzLnRvb2x0aXBTZXRQb3NpdGlvbihub2RlKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNldFBvc2l0aW9uID0gbm9kZSA9PiB7XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gZDNfbW91c2Uobm9kZSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBgJHtjb29yZGluYXRlc1swXSArIDE2fXB4YCk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHtjb29yZGluYXRlc1sxXSArIDE2fXB4YCk7XG4gIH07XG59XG4iXX0=
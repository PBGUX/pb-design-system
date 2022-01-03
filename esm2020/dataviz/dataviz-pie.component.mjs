import { Component, Input, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select, pointer as d3_pointer } from 'd3-selection';
import { scaleOrdinal as d3_scaleOrdinal } from 'd3-scale';
import { pie as d3_pie, arc as d3_arc } from 'd3-shape';
import { interpolate as d3_interpolate } from 'd3-interpolate';
import { format as d3_format } from 'd3-format';
import { isoParse as d3_isoParse } from 'd3-time-format';
import * as i0 from "@angular/core";
import * as i1 from "./dataviz.service";
export class PbdsDatavizPieComponent {
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
                            const parsedTime = d3_isoParse(d.label);
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
                            const parsedTime = d3_isoParse(d.label);
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
            const i = d3_interpolate(data.startAngle, data.endAngle);
            return (t) => {
                data.endAngle = i(t);
                return this.arc(data);
            };
        };
        // see https://bl.ocks.org/HarryStevens/e1acaf628b1693f1b32e5f2e1a7f73fb
        this.arcUpdateTween = (data, index, n) => {
            const interpolate = d3_interpolate(this.currentData[index], data);
            // update the current data for this slice
            this.currentData[index] = interpolate(0);
            return (t) => {
                return this.arc(interpolate(t));
            };
        };
        this.arcMouseOverTween = (data) => {
            const i = d3_interpolate(data.outerRadius, this.outerRadius + this.arcZoom);
            return (t) => {
                data.outerRadius = i(t);
                return this.arc(data);
            };
        };
        this.arcMouseOutTween = (data) => {
            // debugger;
            const i = d3_interpolate(data.outerRadius, this.outerRadius);
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
        this.tooltipMove = (event, node) => {
            this.tooltipSetPosition(event, node);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.tooltipSetPosition = (event, node) => {
            // debugger;
            const coordinates = d3_pointer(event, node);
            this.tooltip.style('left', `${coordinates[0] + 16}px`);
            this.tooltip.style('top', `${coordinates[1] + 16}px`);
        };
    }
    ngOnInit() {
        this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
        this.width = this.width - this.margin.left - this.margin.right;
        this.height = this.width - this.margin.top - this.margin.bottom;
        this.colors = this._dataviz.getColors(this.monochrome, this.theme);
        this.innerRadius = Math.min(this.width, this.height) / 2.5;
        this.outerRadius = Math.min(this.width, this.height) / 2;
        this.arcZoom = 10;
        this.anglePad = 0.02;
        this.legendValueFormat = d3_format(this.legendValueFormatString);
        this.tooltipValueFormat = d3_format(this.tooltipValueFormatString);
        // create formatters
        this.legendLabelFormat = this._dataviz.d3Format(this.legendLabelFormatType, this.legendLabelFormatString);
        this.tooltipLabelFormat = this._dataviz.d3Format(this.tooltipLabelFormatType, this.tooltipLabelFormatString);
        this.colorRange = d3_scaleOrdinal()
            .range(this.colors)
            .domain(this.data.map((c) => c.label));
        if (this.type === 'pie') {
            this.innerRadius = 0;
            this.anglePad = 0;
        }
        this.pie = d3_pie()
            .padAngle(this.anglePad)
            .value((d) => d.value)
            .sort(null);
        this.arc = d3_arc().padRadius(this.outerRadius).innerRadius(this.innerRadius);
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
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
PbdsDatavizPieComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PbdsDatavizPieComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizPieComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.2", type: PbdsDatavizPieComponent, selector: "pbds-dataviz-pie", inputs: { data: "data", width: "width", type: "type", monochrome: "monochrome", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", legendValueFormatString: "legendValueFormatString", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipValueFormatString: "tooltipValueFormatString", theme: "theme" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-pie": "this.pieClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PbdsDatavizPieComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-pie', template: ``, changeDetection: ChangeDetectionStrategy.OnPush, styles: [] }]
        }], ctorParameters: function () { return [{ type: i1.PbdsDatavizService }, { type: i0.ElementRef }]; }, propDecorators: { chartClass: [{
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
            }], tooltipValueFormatString: [{
                type: Input
            }], theme: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1waWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRhdml6L2RhdGF2aXotcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxXQUFXLEVBR1gsTUFBTSxFQUNOLFlBQVksRUFDWix1QkFBdUIsRUFFeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsT0FBTyxJQUFJLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxJQUFJLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMzRCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLElBQUksY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0QsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDaEQsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBV3pELE1BQU0sT0FBTyx1QkFBdUI7SUFpRWxDLFlBQW9CLFFBQTRCLEVBQVUsUUFBb0I7UUFBMUQsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBL0Q5RSxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFNaEIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFNBQUksR0FBb0IsS0FBSyxDQUFDO1FBRzlCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFHbkIsMEJBQXFCLEdBQVcsSUFBSSxDQUFDO1FBR3JDLDRCQUF1QixHQUFHLEVB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LENBQUM7YUFDN0IsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUM3QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxPQUFPO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQyxDQUFDOztvSEFySVUsdUJBQXVCO3dHQUF2Qix1QkFBdUIsb29CQUp4QixFQUFFOzJGQUlELHVCQUF1QjtrQkFObkMsU0FBUzsrQkFDRSxrQkFBa0IsWUFDbEIsRUFBRSxtQkFFSyx1QkFBdUIsQ0FBQyxNQUFNO2tJQUkvQyxVQUFVO3NCQURULFdBQVc7dUJBQUMsa0JBQWtCO2dCQUkvQixRQUFRO3NCQURQLFdBQVc7dUJBQUMsc0JBQXNCO2dCQUluQyxJQUFJO3NCQURILEtBQUs7Z0JBSU4sS0FBSztzQkFESixLQUFLO2dCQUlOLElBQUk7c0JBREgsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4scUJBQXFCO3NCQURwQixLQUFLO2dCQUlOLHVCQUF1QjtzQkFEdEIsS0FBSztnQkFJTix1QkFBdUI7c0JBRHRCLEtBQUs7Z0JBSU4sc0JBQXNCO3NCQURyQixLQUFLO2dCQUlOLHdCQUF3QjtzQkFEdkIsS0FBSztnQkFJTix3QkFBd0I7c0JBRHZCLEtBQUs7Z0JBSU4sS0FBSztzQkFESixLQUFLO2dCQUlOLE9BQU87c0JBRE4sTUFBTTtnQkFJUCxPQUFPO3NCQUROLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0LCBwb2ludGVyIGFzIGQzX3BvaW50ZXIgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgc2NhbGVPcmRpbmFsIGFzIGQzX3NjYWxlT3JkaW5hbCB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IHBpZSBhcyBkM19waWUsIGFyYyBhcyBkM19hcmMgfSBmcm9tICdkMy1zaGFwZSc7XG5pbXBvcnQgeyBpbnRlcnBvbGF0ZSBhcyBkM19pbnRlcnBvbGF0ZSB9IGZyb20gJ2QzLWludGVycG9sYXRlJztcbmltcG9ydCB7IGZvcm1hdCBhcyBkM19mb3JtYXQgfSBmcm9tICdkMy1mb3JtYXQnO1xuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6UGllIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotcGllJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZVVybHM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelBpZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtcGllJylcbiAgcGllQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6UGllPjtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAncGllJyB8ICdkb251dCcgPSAncGllJztcblxuICBASW5wdXQoKVxuICBtb25vY2hyb21lID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRUeXBlOiAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lO1xuXG4gIEBPdXRwdXQoKVxuICBob3ZlcmVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKVxuICBjbGlja2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByaXZhdGUgY3VycmVudERhdGEgPSBbXTtcbiAgcHJpdmF0ZSBoZWlnaHQ7XG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNvbG9ycztcbiAgcHJpdmF0ZSBjb2xvclJhbmdlO1xuICBwcml2YXRlIGFyYztcbiAgcHJpdmF0ZSBhcmNab29tO1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBwaWU7XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgbGVnZW5kVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgaW5uZXJSYWRpdXM7XG4gIHByaXZhdGUgYW5nbGVQYWQ7XG4gIHByaXZhdGUgb3V0ZXJSYWRpdXM7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHsgdG9wOiAxMCwgcmlnaHQ6IDEwLCBib3R0b206IDEwLCBsZWZ0OiAxMCB9O1xuICAgIHRoaXMud2lkdGggPSB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbTtcbiAgICB0aGlzLmNvbG9ycyA9IHRoaXMuX2RhdGF2aXouZ2V0Q29sb3JzKHRoaXMubW9ub2Nocm9tZSwgdGhpcy50aGVtZSk7XG4gICAgdGhpcy5pbm5lclJhZGl1cyA9IE1hdGgubWluKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KSAvIDIuNTtcbiAgICB0aGlzLm91dGVyUmFkaXVzID0gTWF0aC5taW4odGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpIC8gMjtcbiAgICB0aGlzLmFyY1pvb20gPSAxMDtcbiAgICB0aGlzLmFuZ2xlUGFkID0gMC4wMjtcbiAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMubGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUsIHRoaXMubGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcblxuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpXG4gICAgICAucmFuZ2UodGhpcy5jb2xvcnMpXG4gICAgICAuZG9tYWluKHRoaXMuZGF0YS5tYXAoKGMpID0+IGMubGFiZWwpKTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdwaWUnKSB7XG4gICAgICB0aGlzLmlubmVyUmFkaXVzID0gMDtcbiAgICAgIHRoaXMuYW5nbGVQYWQgPSAwO1xuICAgIH1cblxuICAgIHRoaXMucGllID0gZDNfcGllKClcbiAgICAgIC5wYWRBbmdsZSh0aGlzLmFuZ2xlUGFkKVxuICAgICAgLnZhbHVlKChkOiBhbnkpID0+IGQudmFsdWUpXG4gICAgICAuc29ydChudWxsKTtcblxuICAgIHRoaXMuYXJjID0gZDNfYXJjKCkucGFkUmFkaXVzKHRoaXMub3V0ZXJSYWRpdXMpLmlubmVyUmFkaXVzKHRoaXMuaW5uZXJSYWRpdXMpO1xuXG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMud2lkdGggLyAyICsgdGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5oZWlnaHQgLyAyICsgdGhpcy5tYXJnaW4udG9wfSAke1xuICAgICAgICAgIHRoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHRcbiAgICAgICAgfSAke3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tfWBcbiAgICAgICk7XG5cbiAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsICdsZWdlbmQgbGVnZW5kLXJpZ2h0Jyk7XG5cbiAgICB0aGlzLnRvb2x0aXAgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAnKVxuICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKGZpcnN0UnVuID0gdHJ1ZSkgPT4ge1xuICAgIC8vIHNsaWNlc1xuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5kYXRhKHRoaXMucGllKHRoaXMuZGF0YSkpXG4gICAgICAuam9pbihcbiAgICAgICAgKGVudGVyKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGF0aCA9IGVudGVyLmFwcGVuZCgncGF0aCcpO1xuXG4gICAgICAgICAgcGF0aFxuICAgICAgICAgICAgLmVhY2goKGQ6IGFueSkgPT4gKGQub3V0ZXJSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzKSlcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgKGQ6IGFueSkgPT4gdGhpcy5jb2xvclJhbmdlKGQuZGF0YS5sYWJlbCkpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc2xpY2UnKVxuICAgICAgICAgICAgLmVhY2goKGQsIGksIG5vZGVzKSA9PiB7XG4gICAgICAgICAgICAgIC8vIHNhdmUgdGhlIGN1cnJlbnQgZGF0YSB0byBiZSB1c2VkIGluIGFyYyB1cGRhdGUgdHdlZW5cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0YS5zcGxpY2UoaSwgMSwgZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdwaWUnKSB7XG4gICAgICAgICAgICBwYXRoLnN0eWxlKCdzdHJva2UnLCAnI2ZmZicpLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAyKS5zdHlsZSgnc3Ryb2tlLWFsaWdubWVudCcsICdpbm5lcicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhdGguY2FsbCgocGF0aCkgPT5cbiAgICAgICAgICAgIHBhdGhcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZGVsYXkoNTAwKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oKGQsIGksIG4pID0+IChmaXJzdFJ1biA/IDAgOiA1MDApKVxuICAgICAgICAgICAgICAuYXR0clR3ZWVuKCdkJywgdGhpcy5hcmNFbnRlclR3ZWVuKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgfSxcbiAgICAgICAgKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcblxuICAgICAgICAgIHVwZGF0ZS5lYWNoKChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoZC5vdXRlclJhZGl1cyA9IHRoaXMub3V0ZXJSYWRpdXMpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdXBkYXRlLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmF0dHJUd2VlbignZCcsIHRoaXMuYXJjVXBkYXRlVHdlZW4pO1xuXG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgfSxcbiAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcbiAgICAgIClcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMucGF0aE1vdXNlT3ZlcihldmVudCwgZGF0YSk7XG4gICAgICAgIHRoaXMudG9vbHRpcFNob3coZXZlbnQsIGRhdGEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2Vtb3ZlJywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMudG9vbHRpcFNob3coZXZlbnQsIGRhdGEpO1xuICAgICAgICAvLyB0aGlzLnRvb2x0aXBNb3ZlKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgdGhpcy50b29sdGlwTW92ZShldmVudCwgdGhpcy5jaGFydC5ub2RlKCkpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5wYXRoTW91c2VPdXQoZXZlbnQsIGRhdGEpO1xuICAgICAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLnBhdGhDbGljayhldmVudCwgZGF0YSk7XG4gICAgICB9KTtcblxuICAgIC8vIGxlZ2VuZFxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICBjb25zdCBsaSA9IGVudGVyLmFwcGVuZCgnbGknKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtaXRlbScpO1xuXG4gICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIChkOiBhbnkpID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSk7XG5cbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGxpLmFwcGVuZCgnc3BhbicpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1kZXNjcmlwdGlvbicpO1xuXG4gICAgICAgICAgZGVzY3JpcHRpb25cbiAgICAgICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgICAgICAuaHRtbCgoZDogYW55KSA9PiB7XG4gICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtdmFsdWUnKVxuICAgICAgICAgICAgLmh0bWwoKGQ6IGFueSkgPT4gdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdChkLnZhbHVlKSk7XG5cbiAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgIH0sXG4gICAgICAgICh1cGRhdGUpID0+IHtcbiAgICAgICAgICB1cGRhdGUuc2VsZWN0QWxsKCcubGVnZW5kLWtleScpLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgKGQ6IGFueSkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKTtcblxuICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLXZhbHVlJykuaHRtbCgoZDogYW55KSA9PiB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0KGQudmFsdWUpKTtcblxuICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICApXG4gICAgICAuZGF0dW0oKGQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgZGF0YTogZCwgaW5kZXg6IGkgfTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3ZlciBmb2N1cycsIChldmVudCwgZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLmxlZ2VuZE1vdXNlT3ZlckZvY3VzKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgdGhpcy5wYXRoTW91c2VPdmVyKGV2ZW50LCBkYXRhKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0IGJsdXInLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5sZWdlbmRNb3VzZU91dEJsdXIoZXZlbnQsIGRhdGEpO1xuICAgICAgICB0aGlzLnBhdGhNb3VzZU91dChldmVudCwgZGF0YSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50OiBldmVudCwgZGF0YTogZGF0YS5kYXRhIH0pO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBhcmNFbnRlclR3ZWVuID0gKGRhdGEpID0+IHtcbiAgICBjb25zdCBpID0gZDNfaW50ZXJwb2xhdGUoZGF0YS5zdGFydEFuZ2xlLCBkYXRhLmVuZEFuZ2xlKTtcbiAgICByZXR1cm4gKHQpID0+IHtcbiAgICAgIGRhdGEuZW5kQW5nbGUgPSBpKHQpO1xuICAgICAgcmV0dXJuIHRoaXMuYXJjKGRhdGEpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gc2VlIGh0dHBzOi8vYmwub2Nrcy5vcmcvSGFycnlTdGV2ZW5zL2UxYWNhZjYyOGIxNjkzZjFiMzJlNWYyZTFhN2Y3M2ZiXG4gIHByaXZhdGUgYXJjVXBkYXRlVHdlZW4gPSAoZGF0YSwgaW5kZXgsIG4pID0+IHtcbiAgICBjb25zdCBpbnRlcnBvbGF0ZSA9IGQzX2ludGVycG9sYXRlKHRoaXMuY3VycmVudERhdGFbaW5kZXhdLCBkYXRhKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgY3VycmVudCBkYXRhIGZvciB0aGlzIHNsaWNlXG4gICAgdGhpcy5jdXJyZW50RGF0YVtpbmRleF0gPSBpbnRlcnBvbGF0ZSgwKTtcblxuICAgIHJldHVybiAodCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYXJjKGludGVycG9sYXRlKHQpKTtcbiAgICB9O1xuICB9O1xuXG4gIHByaXZhdGUgYXJjTW91c2VPdmVyVHdlZW4gPSAoZGF0YSkgPT4ge1xuICAgIGNvbnN0IGkgPSBkM19pbnRlcnBvbGF0ZShkYXRhLm91dGVyUmFkaXVzLCB0aGlzLm91dGVyUmFkaXVzICsgdGhpcy5hcmNab29tKTtcblxuICAgIHJldHVybiAodCkgPT4ge1xuICAgICAgZGF0YS5vdXRlclJhZGl1cyA9IGkodCk7XG4gICAgICByZXR1cm4gdGhpcy5hcmMoZGF0YSk7XG4gICAgfTtcbiAgfTtcblxuICBwcml2YXRlIGFyY01vdXNlT3V0VHdlZW4gPSAoZGF0YSkgPT4ge1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIGNvbnN0IGkgPSBkM19pbnRlcnBvbGF0ZShkYXRhLm91dGVyUmFkaXVzLCB0aGlzLm91dGVyUmFkaXVzKTtcbiAgICByZXR1cm4gKHQpID0+IHtcbiAgICAgIGRhdGEub3V0ZXJSYWRpdXMgPSBpKHQpO1xuICAgICAgcmV0dXJuIHRoaXMuYXJjKGRhdGEpO1xuICAgIH07XG4gIH07XG5cbiAgcHJpdmF0ZSBsZWdlbmRNb3VzZU92ZXJGb2N1cyA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgIHJldHVybiBgJHtkLmxhYmVsfWAgIT09IGAke2RhdGEubGFiZWx9YDtcbiAgICAgIH0pXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcbiAgfTtcblxuICBwcml2YXRlIGxlZ2VuZE1vdXNlT3V0Qmx1ciA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcbiAgfTtcblxuICBwcml2YXRlIHBhdGhNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgIGNvbnN0IHNsaWNlcyA9IHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuc2xpY2UnKTtcbiAgICBjb25zdCBzbGljZSA9IHNsaWNlcy5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGRhdGEuaW5kZXgpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGRhdGEuaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHNsaWNlcy5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGRhdGEuaW5kZXgpLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBzbGljZS50cmFuc2l0aW9uKCkuZHVyYXRpb24oMzAwKS5kZWxheSgwKS5hdHRyVHdlZW4oJ2QnLCB0aGlzLmFyY01vdXNlT3ZlclR3ZWVuKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHtcbiAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgIGRhdGE6IGRhdGEuZGF0YSA/IGRhdGEuZGF0YSA6IGRhdGEgLy8gbGVnZW5kIGhvdmVyIGRhdGEgaXMgZGlmZmVyZW50IHRoYW4gc2xpY2UgaG92ZXIgZGF0YVxuICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgcGF0aE1vdXNlT3V0ID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgY29uc3Qgc2xpY2VzID0gdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5zbGljZScpO1xuICAgIGNvbnN0IHNsaWNlID0gc2xpY2VzLmZpbHRlcigoZCwgaSkgPT4gZC5sYWJlbCA9PT0gZGF0YS5sYWJlbCk7XG5cbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICBzbGljZXMuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICBzbGljZS50cmFuc2l0aW9uKCkuZHVyYXRpb24oMzAwKS5kZWxheSgwKS5hdHRyVHdlZW4oJ2QnLCB0aGlzLmFyY01vdXNlT3V0VHdlZW4pO1xuICB9O1xuXG4gIHByaXZhdGUgcGF0aENsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoe1xuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgZGF0YTogZGF0YS5kYXRhXG4gICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKGV2ZW50KTtcblxuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAoZGF0YS5lbmRBbmdsZSAtIGRhdGEuc3RhcnRBbmdsZSkgLyAoMiAqIE1hdGguUEkpO1xuICAgIGxldCBsYWJlbDtcblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGRhdGEuZGF0YS5sYWJlbCk7XG4gICAgICAgIGxhYmVsID0gdGhpcy50b29sdGlwTGFiZWxGb3JtYXQocGFyc2VkVGltZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsYWJlbCA9IGRhdGEuZGF0YS5sYWJlbDtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXAuaHRtbChcbiAgICAgIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInRvb2x0aXAtbGFiZWxcIj4ke2xhYmVsfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC12YWx1ZVwiPiR7dGhpcy50b29sdGlwVmFsdWVGb3JtYXQocGVyY2VudGFnZSl9PC9kaXY+XG4gICAgICBgXG4gICAgKTtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcE1vdmUgPSAoZXZlbnQsIG5vZGUpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBTZXRQb3NpdGlvbihldmVudCwgbm9kZSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTZXRQb3NpdGlvbiA9IChldmVudCwgbm9kZT8pID0+IHtcbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGQzX3BvaW50ZXIoZXZlbnQsIG5vZGUpO1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7Y29vcmRpbmF0ZXNbMF0gKyAxNn1weGApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7Y29vcmRpbmF0ZXNbMV0gKyAxNn1weGApO1xuICB9O1xufVxuIl19
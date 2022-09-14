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
        this.tooltipLabelSuffix = '';
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
PbdsDatavizPieComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizPieComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizPieComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: PbdsDatavizPieComponent, selector: "pbds-dataviz-pie", inputs: { data: "data", width: "width", type: "type", monochrome: "monochrome", legendLabelFormatType: "legendLabelFormatType", legendLabelFormatString: "legendLabelFormatString", legendValueFormatString: "legendValueFormatString", tooltipLabelFormatType: "tooltipLabelFormatType", tooltipLabelFormatString: "tooltipLabelFormatString", tooltipLabelSuffix: "tooltipLabelSuffix", tooltipValueFormatString: "tooltipValueFormatString", theme: "theme" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-pie": "this.pieClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizPieComponent, decorators: [{
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
            }], tooltipLabelSuffix: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1waWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRhdml6L2RhdGF2aXotcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxXQUFXLEVBR1gsTUFBTSxFQUNOLFlBQVksRUFDWix1QkFBdUIsRUFFeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsT0FBTyxJQUFJLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxJQUFJLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMzRCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLElBQUksY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0QsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDaEQsT0FBTyxFQUFFLFFBQVEsSUFBSSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBV3pELE1BQU0sT0FBTyx1QkFBdUI7SUFvRWxDLFlBQW9CLFFBQTRCLEVBQVUsUUFBb0I7UUFBMUQsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBbEU5RSxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFNaEIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFNBQUksR0FBb0IsS0FBSyxDQUFDO1FBRzlCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFHbkIsMEJBQXFCLEdBQVcsSUFBSSxDQUFDO1FBR3JDLDRCQUF1QixHQUFHLEVBQUUsQ0FBQztRQUc3Qiw0QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFHN0IsMkJBQXNCLEdBQVcsSUFBSSxDQUFDO1FBR3RDLDZCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUc5Qix1QkFBa0IsR0FBRyxFQUFFLENBQUM7UUFHeEIsNkJBQXdCLEdBQUcsRUFBRSxDQUFDO1FBTTlCLFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUdyRCxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFFN0MsZ0JBQVcsR0FBRyxFQUFFLENBQUM7UUF5RnpCLGdCQUFXLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLEVBQUU7WUFDaEMsU0FBUztZQUNULElBQUksQ0FBQyxHQUFHO2lCQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUM7aUJBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDekIsSUFBSSxDQUNILENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ1IsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFbEMsSUFBSTtxQkFDRCxJQUFJLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQ3BELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDdkQsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7cUJBQ3RCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7b0JBQ3BCLHVEQUF1RDtvQkFDdkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLENBQUM7Z0JBRUwsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtvQkFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQzFGO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUNqQixJQUFJO3FCQUNELFVBQVUsRUFBRTtxQkFDWixLQUFLLENBQUMsR0FBRyxDQUFDO3FCQUNWLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDM0MsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQ3RDLENBQUM7Z0JBRUYsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDLEVBQ0QsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDVCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBRW5CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRTtvQkFDckIsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUV0RSxPQUFPLE1BQU0sQ0FBQztZQUNoQixDQUFDLEVBQ0QsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FDeEI7aUJBQ0EsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hDLENBQUMsQ0FBQztpQkFDRCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUIsaUNBQWlDO2dCQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDO2lCQUNELEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMvQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDO2lCQUNELEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1lBRUwsU0FBUztZQUNULElBQUksQ0FBQyxLQUFLO2lCQUNQLE1BQU0sQ0FBQyxTQUFTLENBQUM7aUJBQ2pCLFNBQVMsQ0FBQyxjQUFjLENBQUM7aUJBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUNmLElBQUksQ0FDSCxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFFM0QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7cUJBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7cUJBQzNCLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFFbkUsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUM7Z0JBRTFFLFdBQVc7cUJBQ1IsTUFBTSxDQUFDLE1BQU0sQ0FBQztxQkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQztxQkFDN0IsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUU7b0JBQ2YsUUFBUSxJQUFJLENBQUMscUJBQXFCLEVBQUU7d0JBQ2xDLEtBQUssTUFBTTs0QkFDVCxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUN4QyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFFNUM7NEJBQ0UsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO3FCQUNsQjtnQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFFTCxXQUFXO3FCQUNSLE1BQU0sQ0FBQyxNQUFNLENBQUM7cUJBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUM7cUJBQzdCLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUVyRCxPQUFPLEVBQUUsQ0FBQztZQUNaLENBQUMsRUFDRCxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNULE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUVoRyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO29CQUM3QyxRQUFRLElBQUksQ0FBQyxxQkFBcUIsRUFBRTt3QkFDbEMsS0FBSyxNQUFNOzRCQUNULE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ3hDLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUU1Qzs0QkFDRSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUM7cUJBQ2xCO2dCQUNILENBQUMsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBRWpGLE9BQU8sTUFBTSxDQUFDO1lBQ2hCLENBQUMsRUFDRCxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUN4QjtpQkFDQSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2QsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQy9CLENBQUMsQ0FBQztpQkFDRCxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQztpQkFDRCxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqQyxDQUFDLENBQUM7aUJBQ0QsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztRQUVNLGtCQUFhLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMvQixNQUFNLENBQUMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekQsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRUYsd0VBQXdFO1FBQ2hFLG1CQUFjLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFDLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWxFLHlDQUF5QztZQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6QyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ1gsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVNLHNCQUFpQixHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxDQUFDLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFNUUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNYLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRU0scUJBQWdCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNsQyxZQUFZO1lBQ1osTUFBTSxDQUFDLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzdELE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDWCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVNLHlCQUFvQixHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzdDLElBQUksQ0FBQyxLQUFLO2lCQUNQLFNBQVMsQ0FBQyxjQUFjLENBQUM7aUJBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDZixPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzFDLENBQUMsQ0FBQztpQkFDRCxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQztRQUVNLHVCQUFrQixHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFDO1FBRU0sa0JBQWEsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN0QyxxQkFBcUI7WUFFckIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFeEQsSUFBSSxDQUFDLEtBQUs7aUJBQ1AsU0FBUyxDQUFDLGNBQWMsQ0FBQztpQkFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQ2xDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVwRSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBRWpGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNoQixLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHVEQUF1RDthQUMzRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFTSxpQkFBWSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU5RCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWhFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbEYsQ0FBQyxDQUFDO1FBRU0sY0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNoQixLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7YUFDaEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRU0sZ0JBQVcsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNwQyxZQUFZO1lBQ1osSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRS9CLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLElBQUksS0FBSyxDQUFDO1lBRVYsUUFBUSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7Z0JBQ25DLEtBQUssTUFBTTtvQkFDVCxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDaEQsS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUMzRSxNQUFNO2dCQUVSO29CQUNFLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2FBQzFEO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2Y7cUNBQytCLEtBQUs7cUNBQ0wsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztPQUNqRSxDQUNGLENBQUM7WUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBRU0sZ0JBQVcsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNwQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQztRQUVNLGdCQUFXLEdBQUcsR0FBRyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUM7UUFFTSx1QkFBa0IsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFLLEVBQUUsRUFBRTtZQUM1QyxZQUFZO1lBQ1osTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU1QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUM7SUEvVStFLENBQUM7SUFFbEYsUUFBUTtRQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDM0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQy9ELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDM0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FB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TUFBTTtnQkFJUCxPQUFPO3NCQUROLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0LCBwb2ludGVyIGFzIGQzX3BvaW50ZXIgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgc2NhbGVPcmRpbmFsIGFzIGQzX3NjYWxlT3JkaW5hbCB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IHBpZSBhcyBkM19waWUsIGFyYyBhcyBkM19hcmMgfSBmcm9tICdkMy1zaGFwZSc7XG5pbXBvcnQgeyBpbnRlcnBvbGF0ZSBhcyBkM19pbnRlcnBvbGF0ZSB9IGZyb20gJ2QzLWludGVycG9sYXRlJztcbmltcG9ydCB7IGZvcm1hdCBhcyBkM19mb3JtYXQgfSBmcm9tICdkMy1mb3JtYXQnO1xuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UgfSBmcm9tICdkMy10aW1lLWZvcm1hdCc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6UGllIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotcGllJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZVVybHM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelBpZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtcGllJylcbiAgcGllQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6UGllPjtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAncGllJyB8ICdkb251dCcgPSAncGllJztcblxuICBASW5wdXQoKVxuICBtb25vY2hyb21lID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kTGFiZWxGb3JtYXRUeXBlOiAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwTGFiZWxGb3JtYXRUeXBlOiAndGltZScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBMYWJlbFN1ZmZpeCA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lO1xuXG4gIEBPdXRwdXQoKVxuICBob3ZlcmVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKVxuICBjbGlja2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByaXZhdGUgY3VycmVudERhdGEgPSBbXTtcbiAgcHJpdmF0ZSBoZWlnaHQ7XG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgbWFyZ2luO1xuICBwcml2YXRlIGNvbG9ycztcbiAgcHJpdmF0ZSBjb2xvclJhbmdlO1xuICBwcml2YXRlIGFyYztcbiAgcHJpdmF0ZSBhcmNab29tO1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBwaWU7XG4gIHByaXZhdGUgbGVnZW5kTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgbGVnZW5kVmFsdWVGb3JtYXQ7XG4gIHByaXZhdGUgaW5uZXJSYWRpdXM7XG4gIHByaXZhdGUgYW5nbGVQYWQ7XG4gIHByaXZhdGUgb3V0ZXJSYWRpdXM7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHsgdG9wOiAxMCwgcmlnaHQ6IDEwLCBib3R0b206IDEwLCBsZWZ0OiAxMCB9O1xuICAgIHRoaXMud2lkdGggPSB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbTtcbiAgICB0aGlzLmNvbG9ycyA9IHRoaXMuX2RhdGF2aXouZ2V0Q29sb3JzKHRoaXMubW9ub2Nocm9tZSwgdGhpcy50aGVtZSk7XG4gICAgdGhpcy5pbm5lclJhZGl1cyA9IE1hdGgubWluKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KSAvIDIuNTtcbiAgICB0aGlzLm91dGVyUmFkaXVzID0gTWF0aC5taW4odGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpIC8gMjtcbiAgICB0aGlzLmFyY1pvb20gPSAxMDtcbiAgICB0aGlzLmFuZ2xlUGFkID0gMC4wMjtcbiAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMubGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy5sZWdlbmRMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUsIHRoaXMubGVnZW5kTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBMYWJlbEZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcExhYmVsRm9ybWF0U3RyaW5nKTtcblxuICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlT3JkaW5hbCgpXG4gICAgICAucmFuZ2UodGhpcy5jb2xvcnMpXG4gICAgICAuZG9tYWluKHRoaXMuZGF0YS5tYXAoKGMpID0+IGMubGFiZWwpKTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdwaWUnKSB7XG4gICAgICB0aGlzLmlubmVyUmFkaXVzID0gMDtcbiAgICAgIHRoaXMuYW5nbGVQYWQgPSAwO1xuICAgIH1cblxuICAgIHRoaXMucGllID0gZDNfcGllKClcbiAgICAgIC5wYWRBbmdsZSh0aGlzLmFuZ2xlUGFkKVxuICAgICAgLnZhbHVlKChkOiBhbnkpID0+IGQudmFsdWUpXG4gICAgICAuc29ydChudWxsKTtcblxuICAgIHRoaXMuYXJjID0gZDNfYXJjKCkucGFkUmFkaXVzKHRoaXMub3V0ZXJSYWRpdXMpLmlubmVyUmFkaXVzKHRoaXMuaW5uZXJSYWRpdXMpO1xuXG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd2aWV3Qm94JyxcbiAgICAgICAgYC0ke3RoaXMud2lkdGggLyAyICsgdGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5oZWlnaHQgLyAyICsgdGhpcy5tYXJnaW4udG9wfSAke1xuICAgICAgICAgIHRoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHRcbiAgICAgICAgfSAke3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tfWBcbiAgICAgICk7XG5cbiAgICB0aGlzLmNoYXJ0LmFwcGVuZCgndWwnKS5hdHRyKCdjbGFzcycsICdsZWdlbmQgbGVnZW5kLXJpZ2h0Jyk7XG5cbiAgICB0aGlzLnRvb2x0aXAgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAnKVxuICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKGZpcnN0UnVuID0gdHJ1ZSkgPT4ge1xuICAgIC8vIHNsaWNlc1xuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5kYXRhKHRoaXMucGllKHRoaXMuZGF0YSkpXG4gICAgICAuam9pbihcbiAgICAgICAgKGVudGVyKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGF0aCA9IGVudGVyLmFwcGVuZCgncGF0aCcpO1xuXG4gICAgICAgICAgcGF0aFxuICAgICAgICAgICAgLmVhY2goKGQ6IGFueSkgPT4gKGQub3V0ZXJSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzKSlcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgKGQ6IGFueSkgPT4gdGhpcy5jb2xvclJhbmdlKGQuZGF0YS5sYWJlbCkpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc2xpY2UnKVxuICAgICAgICAgICAgLmVhY2goKGQsIGksIG5vZGVzKSA9PiB7XG4gICAgICAgICAgICAgIC8vIHNhdmUgdGhlIGN1cnJlbnQgZGF0YSB0byBiZSB1c2VkIGluIGFyYyB1cGRhdGUgdHdlZW5cbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0YS5zcGxpY2UoaSwgMSwgZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdwaWUnKSB7XG4gICAgICAgICAgICBwYXRoLnN0eWxlKCdzdHJva2UnLCAnI2ZmZicpLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAyKS5zdHlsZSgnc3Ryb2tlLWFsaWdubWVudCcsICdpbm5lcicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhdGguY2FsbCgocGF0aCkgPT5cbiAgICAgICAgICAgIHBhdGhcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZGVsYXkoNTAwKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oKGQsIGksIG4pID0+IChmaXJzdFJ1biA/IDAgOiA1MDApKVxuICAgICAgICAgICAgICAuYXR0clR3ZWVuKCdkJywgdGhpcy5hcmNFbnRlclR3ZWVuKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgfSxcbiAgICAgICAgKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcblxuICAgICAgICAgIHVwZGF0ZS5lYWNoKChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoZC5vdXRlclJhZGl1cyA9IHRoaXMub3V0ZXJSYWRpdXMpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdXBkYXRlLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmF0dHJUd2VlbignZCcsIHRoaXMuYXJjVXBkYXRlVHdlZW4pO1xuXG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgfSxcbiAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcbiAgICAgIClcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMucGF0aE1vdXNlT3ZlcihldmVudCwgZGF0YSk7XG4gICAgICAgIHRoaXMudG9vbHRpcFNob3coZXZlbnQsIGRhdGEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2Vtb3ZlJywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMudG9vbHRpcFNob3coZXZlbnQsIGRhdGEpO1xuICAgICAgICAvLyB0aGlzLnRvb2x0aXBNb3ZlKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgdGhpcy50b29sdGlwTW92ZShldmVudCwgdGhpcy5jaGFydC5ub2RlKCkpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5wYXRoTW91c2VPdXQoZXZlbnQsIGRhdGEpO1xuICAgICAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLnBhdGhDbGljayhldmVudCwgZGF0YSk7XG4gICAgICB9KTtcblxuICAgIC8vIGxlZ2VuZFxuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3QoJy5sZWdlbmQnKVxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgIC5qb2luKFxuICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICBjb25zdCBsaSA9IGVudGVyLmFwcGVuZCgnbGknKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtaXRlbScpO1xuXG4gICAgICAgICAgbGkuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQta2V5JylcbiAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIChkOiBhbnkpID0+IHRoaXMuY29sb3JSYW5nZShkLmxhYmVsKSk7XG5cbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGxpLmFwcGVuZCgnc3BhbicpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1kZXNjcmlwdGlvbicpO1xuXG4gICAgICAgICAgZGVzY3JpcHRpb25cbiAgICAgICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpXG4gICAgICAgICAgICAuaHRtbCgoZDogYW55KSA9PiB7XG4gICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFRpbWUgPSBkM19pc29QYXJzZShkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtdmFsdWUnKVxuICAgICAgICAgICAgLmh0bWwoKGQ6IGFueSkgPT4gdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdChkLnZhbHVlKSk7XG5cbiAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgIH0sXG4gICAgICAgICh1cGRhdGUpID0+IHtcbiAgICAgICAgICB1cGRhdGUuc2VsZWN0QWxsKCcubGVnZW5kLWtleScpLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgKGQ6IGFueSkgPT4gdGhpcy5jb2xvclJhbmdlKGQubGFiZWwpKTtcblxuICAgICAgICAgIHVwZGF0ZS5zZWxlY3QoJy5sZWdlbmQtbGFiZWwnKS5odG1sKChkOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRMYWJlbEZvcm1hdFR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGQubGFiZWwpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2VuZExhYmVsRm9ybWF0KHBhcnNlZFRpbWUpO1xuXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB1cGRhdGUuc2VsZWN0KCcubGVnZW5kLXZhbHVlJykuaHRtbCgoZDogYW55KSA9PiB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0KGQudmFsdWUpKTtcblxuICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICApXG4gICAgICAuZGF0dW0oKGQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgZGF0YTogZCwgaW5kZXg6IGkgfTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3ZlciBmb2N1cycsIChldmVudCwgZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLmxlZ2VuZE1vdXNlT3ZlckZvY3VzKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgdGhpcy5wYXRoTW91c2VPdmVyKGV2ZW50LCBkYXRhKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0IGJsdXInLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5sZWdlbmRNb3VzZU91dEJsdXIoZXZlbnQsIGRhdGEpO1xuICAgICAgICB0aGlzLnBhdGhNb3VzZU91dChldmVudCwgZGF0YSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50OiBldmVudCwgZGF0YTogZGF0YS5kYXRhIH0pO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBhcmNFbnRlclR3ZWVuID0gKGRhdGEpID0+IHtcbiAgICBjb25zdCBpID0gZDNfaW50ZXJwb2xhdGUoZGF0YS5zdGFydEFuZ2xlLCBkYXRhLmVuZEFuZ2xlKTtcbiAgICByZXR1cm4gKHQpID0+IHtcbiAgICAgIGRhdGEuZW5kQW5nbGUgPSBpKHQpO1xuICAgICAgcmV0dXJuIHRoaXMuYXJjKGRhdGEpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gc2VlIGh0dHBzOi8vYmwub2Nrcy5vcmcvSGFycnlTdGV2ZW5zL2UxYWNhZjYyOGIxNjkzZjFiMzJlNWYyZTFhN2Y3M2ZiXG4gIHByaXZhdGUgYXJjVXBkYXRlVHdlZW4gPSAoZGF0YSwgaW5kZXgsIG4pID0+IHtcbiAgICBjb25zdCBpbnRlcnBvbGF0ZSA9IGQzX2ludGVycG9sYXRlKHRoaXMuY3VycmVudERhdGFbaW5kZXhdLCBkYXRhKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgY3VycmVudCBkYXRhIGZvciB0aGlzIHNsaWNlXG4gICAgdGhpcy5jdXJyZW50RGF0YVtpbmRleF0gPSBpbnRlcnBvbGF0ZSgwKTtcblxuICAgIHJldHVybiAodCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYXJjKGludGVycG9sYXRlKHQpKTtcbiAgICB9O1xuICB9O1xuXG4gIHByaXZhdGUgYXJjTW91c2VPdmVyVHdlZW4gPSAoZGF0YSkgPT4ge1xuICAgIGNvbnN0IGkgPSBkM19pbnRlcnBvbGF0ZShkYXRhLm91dGVyUmFkaXVzLCB0aGlzLm91dGVyUmFkaXVzICsgdGhpcy5hcmNab29tKTtcblxuICAgIHJldHVybiAodCkgPT4ge1xuICAgICAgZGF0YS5vdXRlclJhZGl1cyA9IGkodCk7XG4gICAgICByZXR1cm4gdGhpcy5hcmMoZGF0YSk7XG4gICAgfTtcbiAgfTtcblxuICBwcml2YXRlIGFyY01vdXNlT3V0VHdlZW4gPSAoZGF0YSkgPT4ge1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIGNvbnN0IGkgPSBkM19pbnRlcnBvbGF0ZShkYXRhLm91dGVyUmFkaXVzLCB0aGlzLm91dGVyUmFkaXVzKTtcbiAgICByZXR1cm4gKHQpID0+IHtcbiAgICAgIGRhdGEub3V0ZXJSYWRpdXMgPSBpKHQpO1xuICAgICAgcmV0dXJuIHRoaXMuYXJjKGRhdGEpO1xuICAgIH07XG4gIH07XG5cbiAgcHJpdmF0ZSBsZWdlbmRNb3VzZU92ZXJGb2N1cyA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2hhcnRcbiAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbScpXG4gICAgICAuZmlsdGVyKChkLCBpKSA9PiB7XG4gICAgICAgIHJldHVybiBgJHtkLmxhYmVsfWAgIT09IGAke2RhdGEubGFiZWx9YDtcbiAgICAgIH0pXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcbiAgfTtcblxuICBwcml2YXRlIGxlZ2VuZE1vdXNlT3V0Qmx1ciA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcbiAgfTtcblxuICBwcml2YXRlIHBhdGhNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgIGNvbnN0IHNsaWNlcyA9IHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuc2xpY2UnKTtcbiAgICBjb25zdCBzbGljZSA9IHNsaWNlcy5maWx0ZXIoKGQsIGkpID0+IGkgPT09IGRhdGEuaW5kZXgpO1xuXG4gICAgdGhpcy5jaGFydFxuICAgICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgIC5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGRhdGEuaW5kZXgpXG4gICAgICAuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIHNsaWNlcy5maWx0ZXIoKGQsIGkpID0+IGkgIT09IGRhdGEuaW5kZXgpLmNsYXNzZWQoJ2luYWN0aXZlJywgdHJ1ZSk7XG5cbiAgICBzbGljZS50cmFuc2l0aW9uKCkuZHVyYXRpb24oMzAwKS5kZWxheSgwKS5hdHRyVHdlZW4oJ2QnLCB0aGlzLmFyY01vdXNlT3ZlclR3ZWVuKTtcblxuICAgIHRoaXMuaG92ZXJlZC5lbWl0KHtcbiAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgIGRhdGE6IGRhdGEuZGF0YSA/IGRhdGEuZGF0YSA6IGRhdGEgLy8gbGVnZW5kIGhvdmVyIGRhdGEgaXMgZGlmZmVyZW50IHRoYW4gc2xpY2UgaG92ZXIgZGF0YVxuICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgcGF0aE1vdXNlT3V0ID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgY29uc3Qgc2xpY2VzID0gdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5zbGljZScpO1xuICAgIGNvbnN0IHNsaWNlID0gc2xpY2VzLmZpbHRlcigoZCwgaSkgPT4gZC5sYWJlbCA9PT0gZGF0YS5sYWJlbCk7XG5cbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJykuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICBzbGljZXMuY2xhc3NlZCgnaW5hY3RpdmUnLCBmYWxzZSk7XG5cbiAgICBzbGljZS50cmFuc2l0aW9uKCkuZHVyYXRpb24oMzAwKS5kZWxheSgwKS5hdHRyVHdlZW4oJ2QnLCB0aGlzLmFyY01vdXNlT3V0VHdlZW4pO1xuICB9O1xuXG4gIHByaXZhdGUgcGF0aENsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoe1xuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgZGF0YTogZGF0YS5kYXRhXG4gICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKGV2ZW50KTtcblxuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAoZGF0YS5lbmRBbmdsZSAtIGRhdGEuc3RhcnRBbmdsZSkgLyAoMiAqIE1hdGguUEkpO1xuICAgIGxldCBsYWJlbDtcblxuICAgIHN3aXRjaCAodGhpcy50b29sdGlwTGFiZWxGb3JtYXRUeXBlKSB7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgY29uc3QgcGFyc2VkVGltZSA9IGQzX2lzb1BhcnNlKGRhdGEuZGF0YS5sYWJlbCk7XG4gICAgICAgIGxhYmVsID0gYCR7dGhpcy50b29sdGlwTGFiZWxGb3JtYXQocGFyc2VkVGltZSl9JHt0aGlzLnRvb2x0aXBMYWJlbFN1ZmZpeH1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGFiZWwgPSBgJHtkYXRhLmRhdGEubGFiZWx9JHt0aGlzLnRvb2x0aXBMYWJlbFN1ZmZpeH1gO1xuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcC5odG1sKFxuICAgICAgYFxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC1sYWJlbFwiPiR7bGFiZWx9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLXZhbHVlXCI+JHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChwZXJjZW50YWdlKX08L2Rpdj5cbiAgICAgIGBcbiAgICApO1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwTW92ZSA9IChldmVudCwgbm9kZSkgPT4ge1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKGV2ZW50LCBub2RlKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNldFBvc2l0aW9uID0gKGV2ZW50LCBub2RlPykgPT4ge1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZDNfcG9pbnRlcihldmVudCwgbm9kZSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBgJHtjb29yZGluYXRlc1swXSArIDE2fXB4YCk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHtjb29yZGluYXRlc1sxXSArIDE2fXB4YCk7XG4gIH07XG59XG4iXX0=
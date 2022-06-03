import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { line as d3_line, area as d3_area } from 'd3-shape';
import { scaleLinear as d3_scaleLinear } from 'd3-scale';
import { min as d3_min, max as d3_max } from 'd3-array';
import * as i0 from "@angular/core";
export class PbdsDatavizSparklineComponent {
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
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
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
        const x = d3_scaleLinear()
            .domain([0, this.data.length])
            .range([0, this.width - this.margin.left - this.margin.right]);
        const y = d3_scaleLinear()
            .domain([+d3_min(data) - this.yAxisMinBuffer, +d3_max(data) + this.yAxisMaxBuffer])
            .range([this.height - this.margin.top - this.margin.bottom, 0]);
        const line = d3_line()
            .x((d, i) => x(i))
            .y((d) => y(d));
        const area = d3_area()
            .x((d, i) => x(i))
            .y0(this.height)
            .y1((d) => y(d));
        if (this.type === 'line' || this.type === 'line-high' || this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkline')
                .transition()
                .duration(1000)
                .attr('d', () => line(data));
        }
        if (this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkarea')
                .transition()
                .duration(1000)
                .attr('d', () => area(data));
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
PbdsDatavizSparklineComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizSparklineComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizSparklineComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: PbdsDatavizSparklineComponent, selector: "pbds-dataviz-sparkline", inputs: { data: "data", width: "width", height: "height", type: "type", color: "color", colorNegative: "colorNegative", strokeWidth: "strokeWidth", yAxisMinBuffer: "yAxisMinBuffer", yAxisMaxBuffer: "yAxisMaxBuffer" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-sparkline": "this.sparklineClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizSparklineComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pbds-dataviz-sparkline',
                    template: ``,
                    styles: [],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1zcGFya2xpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRhdml6L2RhdGF2aXotc3BhcmtsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxXQUFXLEVBQ1gsdUJBQXVCLEVBR3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDNUQsT0FBTyxFQUFFLFdBQVcsSUFBSSxjQUFjLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDekQsT0FBTyxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFVeEQsTUFBTSxPQUFPLDZCQUE2QjtJQXNDeEMsWUFBb0IsUUFBb0I7UUFBcEIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQXBDeEMsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixtQkFBYyxHQUFHLElBQUksQ0FBQztRQUd0QixTQUFJLEdBQTJCLEVBQUUsQ0FBQztRQUdsQyxVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUdaLFNBQUksR0FBd0QsTUFBTSxDQUFDO1FBR25FLFVBQUssR0FBRyxTQUFTLENBQUM7UUFHbEIsa0JBQWEsR0FBa0IsSUFBSSxDQUFDLENBQUMsa0NBQWtDO1FBR3ZFLGdCQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsdURBQXVEO1FBR3hFLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBR25CLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO0lBTXdCLENBQUM7SUFF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QUFLO3NCQURKLEtBQUs7Z0JBSU4sYUFBYTtzQkFEWixLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixjQUFjO3NCQURiLEtBQUs7Z0JBSU4sY0FBYztzQkFEYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBsaW5lIGFzIGQzX2xpbmUsIGFyZWEgYXMgZDNfYXJlYSB9IGZyb20gJ2QzLXNoYXBlJztcbmltcG9ydCB7IHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgbWluIGFzIGQzX21pbiwgbWF4IGFzIGQzX21heCB9IGZyb20gJ2QzLWFycmF5JztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTcGFya2xpbmUgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1zcGFya2xpbmUnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6U3BhcmtsaW5lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtc3BhcmtsaW5lJylcbiAgc3BhcmtsaW5lQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IFBiZHNEYXRhdml6U3BhcmtsaW5lW10gPSBbXTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDE2MDtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbGluZScgfCAnbGluZS1oaWdoJyB8ICdhcmVhJyB8ICdhcmVhLWhpZ2gnIHwgJ2JhcicgPSAnbGluZSc7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI0UyM0RBOCc7XG5cbiAgQElucHV0KClcbiAgY29sb3JOZWdhdGl2ZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7IC8vIHVuZG9jdW1lbnRlZCwgbWF5IGFkZCBpZiBuZWVkZWRcblxuICBASW5wdXQoKVxuICBzdHJva2VXaWR0aCA9IDI7IC8vIHVuZG9jdW1lbnRlZCwgd2lkdGggaXMgYXV0b21hdGljYWxseSBzZXQgYnkgdGhlIHR5cGVcblxuICBASW5wdXQoKVxuICB5QXhpc01pbkJ1ZmZlciA9IDA7XG5cbiAgQElucHV0KClcbiAgeUF4aXNNYXhCdWZmZXIgPSAwO1xuXG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0geyB0b3A6IDEsIHJpZ2h0OiAwLCBib3R0b206IDEsIGxlZnQ6IDAgfTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdiYXInKSB7XG4gICAgICB0aGlzLm1hcmdpbiA9IHsgdG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwIH07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2xpbmUtaGlnaCcgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sb3JOZWdhdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5jb2xvck5lZ2F0aXZlID0gdGhpcy5jb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cigndmlld0JveCcsIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gKTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdsaW5lJyB8fCB0aGlzLnR5cGUgPT09ICdsaW5lLWhpZ2gnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnc3BhcmtsaW5lJylcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnbm9uZScpXG4gICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCB0aGlzLnN0cm9rZVdpZHRoKVxuICAgICAgICAuYXR0cignc3Ryb2tlJywgdGhpcy5jb2xvcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ3NwYXJrYXJlYScpLmF0dHIoJ2ZpbGwnLCB0aGlzLmNvbG9yKS5hdHRyKCdmaWxsLW9wYWNpdHknLCAwLjMpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVDaGFydCgpIHtcbiAgICBjb25zdCBkYXRhOiBhbnkgPSB0aGlzLmRhdGE7XG5cbiAgICBjb25zdCB4ID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgdGhpcy5kYXRhLmxlbmd0aF0pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHRdKTtcblxuICAgIGNvbnN0IHkgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFsrZDNfbWluKGRhdGEpIC0gdGhpcy55QXhpc01pbkJ1ZmZlciwgK2QzX21heChkYXRhKSArIHRoaXMueUF4aXNNYXhCdWZmZXJdKVxuICAgICAgLnJhbmdlKFt0aGlzLmhlaWdodCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbSwgMF0pO1xuXG4gICAgY29uc3QgbGluZSA9IGQzX2xpbmUoKVxuICAgICAgLngoKGQsIGkpID0+IHgoaSkpXG4gICAgICAueSgoZDogYW55KSA9PiB5KGQpKTtcblxuICAgIGNvbnN0IGFyZWEgPSBkM19hcmVhKClcbiAgICAgIC54KChkLCBpKSA9PiB4KGkpKVxuICAgICAgLnkwKHRoaXMuaGVpZ2h0KVxuICAgICAgLnkxKChkOiBhbnkpID0+IHkoZCkpO1xuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2xpbmUnIHx8IHRoaXMudHlwZSA9PT0gJ2xpbmUtaGlnaCcgfHwgdGhpcy50eXBlID09PSAnYXJlYScgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrbGluZScpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5hdHRyKCdkJywgKCkgPT4gbGluZShkYXRhKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5zcGFya2FyZWEnKVxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuYXR0cignZCcsICgpID0+IGFyZWEoZGF0YSkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdiYXInKSB7XG4gICAgICBjb25zdCBiYXJXaWR0aCA9ICh0aGlzLndpZHRoIC0gdGhpcy5kYXRhLmxlbmd0aCkgLyB0aGlzLmRhdGEubGVuZ3RoO1xuXG4gICAgICAvLyBoYW5kbGVzIG5lZ2F0aXZlIHZhbHVlcywgc2VlIGV4YW1wbGUgaHR0cHM6Ly93d3cuZXNzeWNvZGUuY29tL3Bvc3RzL2NyZWF0ZS1zcGFya2xpbmUtY2hhcnRzLWQzL1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrYmFyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NwYXJrYmFyJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4geChpKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgYmFyV2lkdGgpXG4gICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgKGQpID0+IChkID4gMCA/IHRoaXMuY29sb3IgOiB0aGlzLmNvbG9yTmVnYXRpdmUpKSAvLyBzdGlsbCB1c2VzIHVuZG9jdW1lbnRlZCBuZWdhdGl2ZSBjb2xvciB2YWx1ZXNcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAgIC5jYWxsKChlbnRlcikgPT4ge1xuICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpID0+IChkID4gMCA/IHkoZCkgOiB5KDApKSlcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgPT4gTWF0aC5hYnMoeShkKSAtIHkoMCkpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRlcjtcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuc2VsZWN0aW9uKClcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4geChpKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gKGQgPiAwID8geShkKSA6IHkoMCkpKVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCBiYXJXaWR0aClcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSA9PiBNYXRoLmFicyh5KGQpIC0geSgwKSkpXG4gICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgKGQpID0+IChkID4gMCA/IHRoaXMuY29sb3IgOiB0aGlzLmNvbG9yTmVnYXRpdmUpKSxcbiAgICAgICAgICAoZXhpdCkgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19
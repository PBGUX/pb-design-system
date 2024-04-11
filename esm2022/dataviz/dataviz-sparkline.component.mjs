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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizSparklineComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: PbdsDatavizSparklineComponent, selector: "pbds-dataviz-sparkline", inputs: { data: "data", width: "width", height: "height", type: "type", color: "color", colorNegative: "colorNegative", strokeWidth: "strokeWidth", yAxisMinBuffer: "yAxisMinBuffer", yAxisMaxBuffer: "yAxisMaxBuffer" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-sparkline": "this.sparklineClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizSparklineComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1zcGFya2xpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRhdml6L2RhdGF2aXotc3BhcmtsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxXQUFXLEVBQ1gsdUJBQXVCLEVBR3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxJQUFJLElBQUksT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDNUQsT0FBTyxFQUFFLFdBQVcsSUFBSSxjQUFjLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDekQsT0FBTyxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFVeEQsTUFBTSxPQUFPLDZCQUE2QjtJQXNDeEMsWUFBb0IsUUFBb0I7UUFBcEIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQXBDeEMsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixtQkFBYyxHQUFHLElBQUksQ0FBQztRQUd0QixTQUFJLEdBQTJCLEVBQUUsQ0FBQztRQUdsQyxVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUdaLFNBQUksR0FBd0QsTUFBTSxDQUFDO1FBR25FLFVBQUssR0FBRyxTQUFTLENBQUM7UUFHbEIsa0JBQWEsR0FBa0IsSUFBSSxDQUFDLENBQUMsa0NBQWtDO1FBR3ZFLGdCQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsdURBQXVEO1FBR3hFLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBR25CLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO0lBTXdCLENBQUM7SUFF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LGNBQWM7c0JBRGIsS0FBSztnQkFJTixjQUFjO3NCQURiLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IGxpbmUgYXMgZDNfbGluZSwgYXJlYSBhcyBkM19hcmVhIH0gZnJvbSAnZDMtc2hhcGUnO1xuaW1wb3J0IHsgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBtaW4gYXMgZDNfbWluLCBtYXggYXMgZDNfbWF4IH0gZnJvbSAnZDMtYXJyYXknO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNwYXJrbGluZSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LXNwYXJrbGluZScsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpTcGFya2xpbmVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1zcGFya2xpbmUnKVxuICBzcGFya2xpbmVDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogUGJkc0RhdGF2aXpTcGFya2xpbmVbXSA9IFtdO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMTYwO1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwO1xuXG4gIEBJbnB1dCgpXG4gIHR5cGU6ICdsaW5lJyB8ICdsaW5lLWhpZ2gnIHwgJ2FyZWEnIHwgJ2FyZWEtaGlnaCcgfCAnYmFyJyA9ICdsaW5lJztcblxuICBASW5wdXQoKVxuICBjb2xvciA9ICcjRTIzREE4JztcblxuICBASW5wdXQoKVxuICBjb2xvck5lZ2F0aXZlOiBzdHJpbmcgfCBudWxsID0gbnVsbDsgLy8gdW5kb2N1bWVudGVkLCBtYXkgYWRkIGlmIG5lZWRlZFxuXG4gIEBJbnB1dCgpXG4gIHN0cm9rZVdpZHRoID0gMjsgLy8gdW5kb2N1bWVudGVkLCB3aWR0aCBpcyBhdXRvbWF0aWNhbGx5IHNldCBieSB0aGUgdHlwZVxuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWluQnVmZmVyID0gMDtcblxuICBASW5wdXQoKVxuICB5QXhpc01heEJ1ZmZlciA9IDA7XG5cbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgbWFyZ2luO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7IHRvcDogMSwgcmlnaHQ6IDAsIGJvdHRvbTogMSwgbGVmdDogMCB9O1xuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2JhcicpIHtcbiAgICAgIHRoaXMubWFyZ2luID0geyB0b3A6IDAsIHJpZ2h0OiAwLCBib3R0b206IDAsIGxlZnQ6IDAgfTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnbGluZS1oaWdoJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2xvck5lZ2F0aXZlID09PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbG9yTmVnYXRpdmUgPSB0aGlzLmNvbG9yO1xuICAgIH1cblxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCB0aGlzLndpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKCd2aWV3Qm94JywgYC0ke3RoaXMubWFyZ2luLmxlZnR9IC0ke3RoaXMubWFyZ2luLnRvcH0gJHt0aGlzLndpZHRofSAke3RoaXMuaGVpZ2h0fWApO1xuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2xpbmUnIHx8IHRoaXMudHlwZSA9PT0gJ2xpbmUtaGlnaCcgfHwgdGhpcy50eXBlID09PSAnYXJlYScgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdzcGFya2xpbmUnKVxuICAgICAgICAuYXR0cignZmlsbCcsICdub25lJylcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIHRoaXMuc3Ryb2tlV2lkdGgpXG4gICAgICAgIC5hdHRyKCdzdHJva2UnLCB0aGlzLmNvbG9yKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnYXJlYScgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnc3BhcmthcmVhJykuYXR0cignZmlsbCcsIHRoaXMuY29sb3IpLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIDAuMyk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0KCkge1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZGF0YTtcblxuICAgIGNvbnN0IHggPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCB0aGlzLmRhdGEubGVuZ3RoXSlcbiAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuXG4gICAgY29uc3QgeSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWytkM19taW4oZGF0YSkgLSB0aGlzLnlBeGlzTWluQnVmZmVyLCArZDNfbWF4KGRhdGEpICsgdGhpcy55QXhpc01heEJ1ZmZlcl0pXG4gICAgICAucmFuZ2UoW3RoaXMuaGVpZ2h0IC0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tLCAwXSk7XG5cbiAgICBjb25zdCBsaW5lID0gZDNfbGluZSgpXG4gICAgICAueCgoZCwgaSkgPT4geChpKSlcbiAgICAgIC55KChkOiBhbnkpID0+IHkoZCkpO1xuXG4gICAgY29uc3QgYXJlYSA9IGQzX2FyZWEoKVxuICAgICAgLngoKGQsIGkpID0+IHgoaSkpXG4gICAgICAueTAodGhpcy5oZWlnaHQpXG4gICAgICAueTEoKGQ6IGFueSkgPT4geShkKSk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnbGluZScgfHwgdGhpcy50eXBlID09PSAnbGluZS1oaWdoJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuc3BhcmtsaW5lJylcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmF0dHIoJ2QnLCAoKSA9PiBsaW5lKGRhdGEpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnYXJlYScgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrYXJlYScpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5hdHRyKCdkJywgKCkgPT4gYXJlYShkYXRhKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2JhcicpIHtcbiAgICAgIGNvbnN0IGJhcldpZHRoID0gKHRoaXMud2lkdGggLSB0aGlzLmRhdGEubGVuZ3RoKSAvIHRoaXMuZGF0YS5sZW5ndGg7XG5cbiAgICAgIC8vIGhhbmRsZXMgbmVnYXRpdmUgdmFsdWVzLCBzZWUgZXhhbXBsZSBodHRwczovL3d3dy5lc3N5Y29kZS5jb20vcG9zdHMvY3JlYXRlLXNwYXJrbGluZS1jaGFydHMtZDMvXG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuc3BhcmtiYXInKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc3BhcmtiYXInKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB4KGkpKVxuICAgICAgICAgICAgICAuYXR0cigneScsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCBiYXJXaWR0aClcbiAgICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCkgPT4gKGQgPiAwID8gdGhpcy5jb2xvciA6IHRoaXMuY29sb3JOZWdhdGl2ZSkpIC8vIHN0aWxsIHVzZXMgdW5kb2N1bWVudGVkIG5lZ2F0aXZlIGNvbG9yIHZhbHVlc1xuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgICAgICAgICAgLmNhbGwoKGVudGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gKGQgPiAwID8geShkKSA6IHkoMCkpKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkKSA9PiBNYXRoLmFicyh5KGQpIC0geSgwKSkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudGVyO1xuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5zZWxlY3Rpb24oKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB4KGkpKVxuICAgICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiAoZCA+IDAgPyB5KGQpIDogeSgwKSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGJhcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpID0+IE1hdGguYWJzKHkoZCkgLSB5KDApKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCkgPT4gKGQgPiAwID8gdGhpcy5jb2xvciA6IHRoaXMuY29sb3JOZWdhdGl2ZSkpLFxuICAgICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=
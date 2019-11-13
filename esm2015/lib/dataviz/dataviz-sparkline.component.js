/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select, line as d3_line, scaleLinear as d3_scaleLinear, min as d3_min, max as d3_max, area as d3_area } from 'd3';
export class PbdsDatavizSparklineComponent {
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
            this.svg
                .append('path')
                .attr('class', 'sparkarea')
                .attr('fill', this.color)
                .attr('fill-opacity', 0.3);
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
    updateChart() {
        /** @type {?} */
        const data = this.data;
        /** @type {?} */
        const x = d3_scaleLinear()
            .domain([0, this.data.length])
            .range([0, this.width - this.margin.left - this.margin.right]);
        /** @type {?} */
        const y = d3_scaleLinear()
            .domain([+d3_min(this.data) - this.yAxisMinBuffer, +d3_max(this.data) + this.yAxisMaxBuffer])
            .range([this.height - this.margin.top - this.margin.bottom, 0]);
        /** @type {?} */
        const line = d3_line()
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
        const area = d3_area()
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
        if (this.type === 'line' || this.type === 'line-high' || this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkline')
                .transition()
                .duration(750)
                .attr('d', (/**
             * @return {?}
             */
            () => line(data)));
        }
        if (this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkarea')
                .transition()
                .duration(750)
                .attr('d', (/**
             * @return {?}
             */
            () => area(data)));
        }
        if (this.type === 'bar') {
            /** @type {?} */
            const barWidth = (this.width - this.data.length) / this.data.length;
            // handles negative values, see example https://www.essycode.com/posts/create-sparkline-charts-d3/
            this.svg
                .selectAll('.sparkbar')
                .data(this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            enter => enter
                .append('rect')
                .attr('class', 'sparkbar')
                .attr('x', (/**
             * @param {?} d
             * @param {?} i
             * @return {?}
             */
            (d, i) => x(i)))
                .attr('y', this.height)
                .attr('width', barWidth)
                .attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            d => (d > 0 ? this.color : this.colorNegative))) // still uses undocumented negative color values
                .attr('height', 0)
                .call((/**
             * @param {?} enter
             * @return {?}
             */
            enter => {
                enter
                    .transition()
                    .duration(750)
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => (d > 0 ? y(d) : y(0))))
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => Math.abs(y(d) - y(0))));
                return enter;
            }))), (/**
             * @param {?} update
             * @return {?}
             */
            update => update
                .transition()
                .duration(750)
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
            d => (d > 0 ? this.color : this.colorNegative)))), (/**
             * @param {?} exit
             * @return {?}
             */
            exit => exit.remove()))
                .enter();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1zcGFya2xpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotc3BhcmtsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFdBQVcsRUFDWCx1QkFBdUIsRUFHeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLE1BQU0sSUFBSSxTQUFTLEVBQ25CLElBQUksSUFBSSxPQUFPLEVBQ2YsV0FBVyxJQUFJLGNBQWMsRUFDN0IsR0FBRyxJQUFJLE1BQU0sRUFDYixHQUFHLElBQUksTUFBTSxFQUNiLElBQUksSUFBSSxPQUFPLEVBQ2hCLE1BQU0sSUFBSSxDQUFDO0FBVVosTUFBTSxPQUFPLDZCQUE2Qjs7OztJQXNDeEMsWUFBb0IsUUFBb0I7UUFBcEIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQXBDeEMsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixtQkFBYyxHQUFHLElBQUksQ0FBQztRQU10QixVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUdaLFNBQUksR0FBd0QsTUFBTSxDQUFDO1FBR25FLFVBQUssR0FBRyxTQUFTLENBQUM7UUFHbEIsa0JBQWEsR0FBa0IsSUFBSSxDQUFDLENBQUMsa0NBQWtDOztRQUd2RSxnQkFBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLHVEQUF1RDs7UUFHeEUsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFHbkIsbUJBQWMsR0FBRyxDQUFDLENBQUM7SUFNd0IsQ0FBQzs7OztJQUU1QyxRQUFRO1FBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxD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OztJQUVILGlEQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIHNlbGVjdCBhcyBkM19zZWxlY3QsXG4gIGxpbmUgYXMgZDNfbGluZSxcbiAgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsXG4gIG1pbiBhcyBkM19taW4sXG4gIG1heCBhcyBkM19tYXgsXG4gIGFyZWEgYXMgZDNfYXJlYVxufSBmcm9tICdkMyc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U3BhcmtsaW5lIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotc3BhcmtsaW5lJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelNwYXJrbGluZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LXNwYXJrbGluZScpXG4gIHNwYXJrbGluZUNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBQYmRzRGF0YXZpelNwYXJrbGluZTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDE2MDtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbGluZScgfCAnbGluZS1oaWdoJyB8ICdhcmVhJyB8ICdhcmVhLWhpZ2gnIHwgJ2JhcicgPSAnbGluZSc7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI0UyM0RBOCc7XG5cbiAgQElucHV0KClcbiAgY29sb3JOZWdhdGl2ZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7IC8vIHVuZG9jdW1lbnRlZCwgbWF5IGFkZCBpZiBuZWVkZWRcblxuICBASW5wdXQoKVxuICBzdHJva2VXaWR0aCA9IDI7IC8vIHVuZG9jdW1lbnRlZCwgd2lkdGggaXMgYXV0b21hdGljYWxseSBzZXQgYnkgdGhlIHR5cGVcblxuICBASW5wdXQoKVxuICB5QXhpc01pbkJ1ZmZlciA9IDA7XG5cbiAgQElucHV0KClcbiAgeUF4aXNNYXhCdWZmZXIgPSAwO1xuXG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0geyB0b3A6IDEsIHJpZ2h0OiAwLCBib3R0b206IDEsIGxlZnQ6IDAgfTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdiYXInKSB7XG4gICAgICB0aGlzLm1hcmdpbiA9IHsgdG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwIH07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2xpbmUtaGlnaCcgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sb3JOZWdhdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5jb2xvck5lZ2F0aXZlID0gdGhpcy5jb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cigndmlld0JveCcsIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gKTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdsaW5lJyB8fCB0aGlzLnR5cGUgPT09ICdsaW5lLWhpZ2gnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnc3BhcmtsaW5lJylcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnbm9uZScpXG4gICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCB0aGlzLnN0cm9rZVdpZHRoKVxuICAgICAgICAuYXR0cignc3Ryb2tlJywgdGhpcy5jb2xvcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnc3BhcmthcmVhJylcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCB0aGlzLmNvbG9yKVxuICAgICAgICAuYXR0cignZmlsbC1vcGFjaXR5JywgMC4zKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2hhcnQoKSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0gdGhpcy5kYXRhO1xuXG4gICAgY29uc3QgeCA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIHRoaXMuZGF0YS5sZW5ndGhdKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0XSk7XG5cbiAgICBjb25zdCB5ID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbK2QzX21pbih0aGlzLmRhdGEpIC0gdGhpcy55QXhpc01pbkJ1ZmZlciwgK2QzX21heCh0aGlzLmRhdGEpICsgdGhpcy55QXhpc01heEJ1ZmZlcl0pXG4gICAgICAucmFuZ2UoW3RoaXMuaGVpZ2h0IC0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tLCAwXSk7XG5cbiAgICBjb25zdCBsaW5lID0gZDNfbGluZSgpXG4gICAgICAueCgoZCwgaSkgPT4geChpKSlcbiAgICAgIC55KChkOiBhbnkpID0+IHkoZCkpO1xuXG4gICAgY29uc3QgYXJlYSA9IGQzX2FyZWEoKVxuICAgICAgLngoKGQsIGkpID0+IHgoaSkpXG4gICAgICAueTAodGhpcy5oZWlnaHQpXG4gICAgICAueTEoKGQ6IGFueSkgPT4geShkKSk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnbGluZScgfHwgdGhpcy50eXBlID09PSAnbGluZS1oaWdoJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuc3BhcmtsaW5lJylcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oNzUwKVxuICAgICAgICAuYXR0cignZCcsICgpID0+IGxpbmUoZGF0YSkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdhcmVhJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuc3BhcmthcmVhJylcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oNzUwKVxuICAgICAgICAuYXR0cignZCcsICgpID0+IGFyZWEoZGF0YSkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdiYXInKSB7XG4gICAgICBjb25zdCBiYXJXaWR0aCA9ICh0aGlzLndpZHRoIC0gdGhpcy5kYXRhLmxlbmd0aCkgLyB0aGlzLmRhdGEubGVuZ3RoO1xuXG4gICAgICAvLyBoYW5kbGVzIG5lZ2F0aXZlIHZhbHVlcywgc2VlIGV4YW1wbGUgaHR0cHM6Ly93d3cuZXNzeWNvZGUuY29tL3Bvc3RzL2NyZWF0ZS1zcGFya2xpbmUtY2hhcnRzLWQzL1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrYmFyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdzcGFya2JhcicpXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHgoaSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGJhcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cignZmlsbCcsIGQgPT4gKGQgPiAwID8gdGhpcy5jb2xvciA6IHRoaXMuY29sb3JOZWdhdGl2ZSkpIC8vIHN0aWxsIHVzZXMgdW5kb2N1bWVudGVkIG5lZ2F0aXZlIGNvbG9yIHZhbHVlc1xuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgICAgICAgICAgLmNhbGwoZW50ZXIgPT4ge1xuICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNzUwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IChkID4gMCA/IHkoZCkgOiB5KDApKSlcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IE1hdGguYWJzKHkoZCkgLSB5KDApKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZW50ZXI7XG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4geChpKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IChkID4gMCA/IHkoZCkgOiB5KDApKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgYmFyV2lkdGgpXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IE1hdGguYWJzKHkoZCkgLSB5KDApKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBkID0+IChkID4gMCA/IHRoaXMuY29sb3IgOiB0aGlzLmNvbG9yTmVnYXRpdmUpKSxcbiAgICAgICAgICBleGl0ID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICAgKVxuICAgICAgICAuZW50ZXIoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
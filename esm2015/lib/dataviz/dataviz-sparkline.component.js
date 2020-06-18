/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { line as d3_line, area as d3_area } from 'd3-shape';
import { scaleLinear as d3_scaleLinear } from 'd3-scale';
import { min as d3_min, max as d3_max } from 'd3-array';
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
                .duration(1000)
                .attr('d', (/**
             * @return {?}
             */
            () => line(data)));
        }
        if (this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkarea')
                .transition()
                .duration(1000)
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
                    .duration(1000)
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
                .duration(1000)
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
            exit => exit.remove()));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1zcGFya2xpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotc3BhcmtsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFdBQVcsRUFDWCx1QkFBdUIsRUFHeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBVXhELE1BQU0sT0FBTyw2QkFBNkI7Ozs7SUFzQ3hDLFlBQW9CLFFBQW9CO1FBQXBCLGFBQVEsR0FBUixRQUFRLENBQVk7UUFwQ3hDLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFNdEIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFdBQU0sR0FBRyxFQUFFLENBQUM7UUFHWixTQUFJLEdBQXdELE1BQU0sQ0FBQztRQUduRSxVQUFLLEdBQUcsU0FBUyxDQUFDO1FBR2xCLGtCQUFhLEdBQWtCLElBQUksQ0FBQyxDQUFDLGtDQUFrQzs7UUFHdkUsZ0JBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyx1REFBdUQ7O1FBR3hFLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBR25CLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO0lBTXdCLENBQUM7Ozs7SUFFNUMsUUFBUTtRQUNOLElBQUks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SUFFaEIsdURBQ21COztJQUVuQix1REFDbUI7Ozs7O0lBRW5CLDhDQUFjOzs7OztJQUNkLDRDQUFZOzs7OztJQUNaLCtDQUFlOzs7OztJQUVILGlEQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgbGluZSBhcyBkM19saW5lLCBhcmVhIGFzIGQzX2FyZWEgfSBmcm9tICdkMy1zaGFwZSc7XG5pbXBvcnQgeyBzY2FsZUxpbmVhciBhcyBkM19zY2FsZUxpbmVhciB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IG1pbiBhcyBkM19taW4sIG1heCBhcyBkM19tYXggfSBmcm9tICdkMy1hcnJheSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U3BhcmtsaW5lIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotc3BhcmtsaW5lJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelNwYXJrbGluZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LXNwYXJrbGluZScpXG4gIHNwYXJrbGluZUNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBQYmRzRGF0YXZpelNwYXJrbGluZTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDE2MDtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbGluZScgfCAnbGluZS1oaWdoJyB8ICdhcmVhJyB8ICdhcmVhLWhpZ2gnIHwgJ2JhcicgPSAnbGluZSc7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI0UyM0RBOCc7XG5cbiAgQElucHV0KClcbiAgY29sb3JOZWdhdGl2ZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7IC8vIHVuZG9jdW1lbnRlZCwgbWF5IGFkZCBpZiBuZWVkZWRcblxuICBASW5wdXQoKVxuICBzdHJva2VXaWR0aCA9IDI7IC8vIHVuZG9jdW1lbnRlZCwgd2lkdGggaXMgYXV0b21hdGljYWxseSBzZXQgYnkgdGhlIHR5cGVcblxuICBASW5wdXQoKVxuICB5QXhpc01pbkJ1ZmZlciA9IDA7XG5cbiAgQElucHV0KClcbiAgeUF4aXNNYXhCdWZmZXIgPSAwO1xuXG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0geyB0b3A6IDEsIHJpZ2h0OiAwLCBib3R0b206IDEsIGxlZnQ6IDAgfTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdiYXInKSB7XG4gICAgICB0aGlzLm1hcmdpbiA9IHsgdG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwIH07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2xpbmUtaGlnaCcgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sb3JOZWdhdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5jb2xvck5lZ2F0aXZlID0gdGhpcy5jb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cigndmlld0JveCcsIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gKTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdsaW5lJyB8fCB0aGlzLnR5cGUgPT09ICdsaW5lLWhpZ2gnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnc3BhcmtsaW5lJylcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnbm9uZScpXG4gICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCB0aGlzLnN0cm9rZVdpZHRoKVxuICAgICAgICAuYXR0cignc3Ryb2tlJywgdGhpcy5jb2xvcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnc3BhcmthcmVhJylcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCB0aGlzLmNvbG9yKVxuICAgICAgICAuYXR0cignZmlsbC1vcGFjaXR5JywgMC4zKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2hhcnQoKSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0gdGhpcy5kYXRhO1xuXG4gICAgY29uc3QgeCA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIHRoaXMuZGF0YS5sZW5ndGhdKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0XSk7XG5cbiAgICBjb25zdCB5ID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbK2QzX21pbih0aGlzLmRhdGEpIC0gdGhpcy55QXhpc01pbkJ1ZmZlciwgK2QzX21heCh0aGlzLmRhdGEpICsgdGhpcy55QXhpc01heEJ1ZmZlcl0pXG4gICAgICAucmFuZ2UoW3RoaXMuaGVpZ2h0IC0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tLCAwXSk7XG5cbiAgICBjb25zdCBsaW5lID0gZDNfbGluZSgpXG4gICAgICAueCgoZCwgaSkgPT4geChpKSlcbiAgICAgIC55KChkOiBhbnkpID0+IHkoZCkpO1xuXG4gICAgY29uc3QgYXJlYSA9IGQzX2FyZWEoKVxuICAgICAgLngoKGQsIGkpID0+IHgoaSkpXG4gICAgICAueTAodGhpcy5oZWlnaHQpXG4gICAgICAueTEoKGQ6IGFueSkgPT4geShkKSk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnbGluZScgfHwgdGhpcy50eXBlID09PSAnbGluZS1oaWdoJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuc3BhcmtsaW5lJylcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmF0dHIoJ2QnLCAoKSA9PiBsaW5lKGRhdGEpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnYXJlYScgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrYXJlYScpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5hdHRyKCdkJywgKCkgPT4gYXJlYShkYXRhKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2JhcicpIHtcbiAgICAgIGNvbnN0IGJhcldpZHRoID0gKHRoaXMud2lkdGggLSB0aGlzLmRhdGEubGVuZ3RoKSAvIHRoaXMuZGF0YS5sZW5ndGg7XG5cbiAgICAgIC8vIGhhbmRsZXMgbmVnYXRpdmUgdmFsdWVzLCBzZWUgZXhhbXBsZSBodHRwczovL3d3dy5lc3N5Y29kZS5jb20vcG9zdHMvY3JlYXRlLXNwYXJrbGluZS1jaGFydHMtZDMvXG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuc3BhcmtiYXInKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+XG4gICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NwYXJrYmFyJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4geChpKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgYmFyV2lkdGgpXG4gICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiAoZCA+IDAgPyB0aGlzLmNvbG9yIDogdGhpcy5jb2xvck5lZ2F0aXZlKSkgLy8gc3RpbGwgdXNlcyB1bmRvY3VtZW50ZWQgbmVnYXRpdmUgY29sb3IgdmFsdWVzXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgICAuY2FsbChlbnRlciA9PiB7XG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IChkID4gMCA/IHkoZCkgOiB5KDApKSlcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IE1hdGguYWJzKHkoZCkgLSB5KDApKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZW50ZXI7XG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHgoaSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiAoZCA+IDAgPyB5KGQpIDogeSgwKSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGJhcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiBNYXRoLmFicyh5KGQpIC0geSgwKSkpXG4gICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiAoZCA+IDAgPyB0aGlzLmNvbG9yIDogdGhpcy5jb2xvck5lZ2F0aXZlKSksXG4gICAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=
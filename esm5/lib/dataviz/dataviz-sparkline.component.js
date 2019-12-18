/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select, line as d3_line, scaleLinear as d3_scaleLinear, min as d3_min, max as d3_max, area as d3_area } from 'd3';
var PbdsDatavizSparklineComponent = /** @class */ (function () {
    function PbdsDatavizSparklineComponent(_element) {
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
    PbdsDatavizSparklineComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
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
            .attr('viewBox', "-" + this.margin.left + " -" + this.margin.top + " " + this.width + " " + this.height);
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
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PbdsDatavizSparklineComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    };
    /**
     * @return {?}
     */
    PbdsDatavizSparklineComponent.prototype.updateChart = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var data = this.data;
        /** @type {?} */
        var x = d3_scaleLinear()
            .domain([0, this.data.length])
            .range([0, this.width - this.margin.left - this.margin.right]);
        /** @type {?} */
        var y = d3_scaleLinear()
            .domain([+d3_min(this.data) - this.yAxisMinBuffer, +d3_max(this.data) + this.yAxisMaxBuffer])
            .range([this.height - this.margin.top - this.margin.bottom, 0]);
        /** @type {?} */
        var line = d3_line()
            .x((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return x(i); }))
            .y((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return y(d); }));
        /** @type {?} */
        var area = d3_area()
            .x((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return x(i); }))
            .y0(this.height)
            .y1((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return y(d); }));
        if (this.type === 'line' || this.type === 'line-high' || this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkline')
                .transition()
                .duration(1000)
                .attr('d', (/**
             * @return {?}
             */
            function () { return line(data); }));
        }
        if (this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkarea')
                .transition()
                .duration(1000)
                .attr('d', (/**
             * @return {?}
             */
            function () { return area(data); }));
        }
        if (this.type === 'bar') {
            /** @type {?} */
            var barWidth_1 = (this.width - this.data.length) / this.data.length;
            // handles negative values, see example https://www.essycode.com/posts/create-sparkline-charts-d3/
            this.svg
                .selectAll('.sparkbar')
                .data(this.data)
                .join((/**
             * @param {?} enter
             * @return {?}
             */
            function (enter) {
                return enter
                    .append('rect')
                    .attr('class', 'sparkbar')
                    .attr('x', (/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                function (d, i) { return x(i); }))
                    .attr('y', _this.height)
                    .attr('width', barWidth_1)
                    .attr('fill', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return (d > 0 ? _this.color : _this.colorNegative); })) // still uses undocumented negative color values
                    .attr('height', 0)
                    .call((/**
                 * @param {?} enter
                 * @return {?}
                 */
                function (enter) {
                    enter
                        .transition()
                        .duration(1000)
                        .attr('y', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return (d > 0 ? y(d) : y(0)); }))
                        .attr('height', (/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) { return Math.abs(y(d) - y(0)); }));
                    return enter;
                }));
            }), (/**
             * @param {?} update
             * @return {?}
             */
            function (update) {
                return update
                    .transition()
                    .duration(1000)
                    .attr('x', (/**
                 * @param {?} d
                 * @param {?} i
                 * @return {?}
                 */
                function (d, i) { return x(i); }))
                    .attr('y', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return (d > 0 ? y(d) : y(0)); }))
                    .attr('width', barWidth_1)
                    .attr('height', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return Math.abs(y(d) - y(0)); }))
                    .attr('fill', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return (d > 0 ? _this.color : _this.colorNegative); }));
            }), (/**
             * @param {?} exit
             * @return {?}
             */
            function (exit) { return exit.remove(); }));
        }
    };
    PbdsDatavizSparklineComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-sparkline',
                    template: "",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizSparklineComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
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
    return PbdsDatavizSparklineComponent;
}());
export { PbdsDatavizSparklineComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1zcGFya2xpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotc3BhcmtsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFdBQVcsRUFDWCx1QkFBdUIsRUFHeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLE1BQU0sSUFBSSxTQUFTLEVBQ25CLElBQUksSUFBSSxPQUFPLEVBQ2YsV0FBVyxJQUFJLGNBQWMsRUFDN0IsR0FBRyxJQUFJLE1BQU0sRUFDYixHQUFHLElBQUksTUFBTSxFQUNiLElBQUksSUFBSSxPQUFPLEVBQ2hCLE1BQU0sSUFBSSxDQUFDO0FBSVo7SUE0Q0UsdUNBQW9CLFFBQW9CO1FBQXBCLGFBQVEsR0FBUixRQUFRLENBQVk7UUFwQ3hDLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFNdEIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFdBQU0sR0FBRyxFQUFFLENBQUM7UUFHWixTQUFJLEdBQXdELE1BQU0sQ0FBQztRQUduRSxVQUFLLEdBQUcsU0FBUyxDQUFDO1FBR2xCLGtCQUFhLEdBQWtCLElBQUksQ0FBQyxDQUFDLGtDQUFrQzs7UUFHdkUsZ0JBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyx1REFBdUQ7O1FBR3hFLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBR25CLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO0lBTXdCLENBQUM7Ozs7SUFFNUMsZ0RBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FB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LG1EQUNrQjs7SUFFbEIsdURBQ3NCOztJQUV0Qiw2Q0FDMkI7O0lBRTNCLDhDQUNZOztJQUVaLCtDQUNZOztJQUVaLDZDQUNtRTs7SUFFbkUsOENBQ2tCOztJQUVsQixzREFDb0M7O0lBRXBDLG9EQUNnQjs7SUFFaEIsdURBQ21COztJQUVuQix1REFDbUI7Ozs7O0lBRW5CLDhDQUFjOzs7OztJQUNkLDRDQUFZOzs7OztJQUNaLCtDQUFlOzs7OztJQUVILGlEQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIHNlbGVjdCBhcyBkM19zZWxlY3QsXG4gIGxpbmUgYXMgZDNfbGluZSxcbiAgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsXG4gIG1pbiBhcyBkM19taW4sXG4gIG1heCBhcyBkM19tYXgsXG4gIGFyZWEgYXMgZDNfYXJlYVxufSBmcm9tICdkMyc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U3BhcmtsaW5lIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotc3BhcmtsaW5lJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelNwYXJrbGluZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LXNwYXJrbGluZScpXG4gIHNwYXJrbGluZUNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBQYmRzRGF0YXZpelNwYXJrbGluZTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDE2MDtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA0MDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbGluZScgfCAnbGluZS1oaWdoJyB8ICdhcmVhJyB8ICdhcmVhLWhpZ2gnIHwgJ2JhcicgPSAnbGluZSc7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI0UyM0RBOCc7XG5cbiAgQElucHV0KClcbiAgY29sb3JOZWdhdGl2ZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7IC8vIHVuZG9jdW1lbnRlZCwgbWF5IGFkZCBpZiBuZWVkZWRcblxuICBASW5wdXQoKVxuICBzdHJva2VXaWR0aCA9IDI7IC8vIHVuZG9jdW1lbnRlZCwgd2lkdGggaXMgYXV0b21hdGljYWxseSBzZXQgYnkgdGhlIHR5cGVcblxuICBASW5wdXQoKVxuICB5QXhpc01pbkJ1ZmZlciA9IDA7XG5cbiAgQElucHV0KClcbiAgeUF4aXNNYXhCdWZmZXIgPSAwO1xuXG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0geyB0b3A6IDEsIHJpZ2h0OiAwLCBib3R0b206IDEsIGxlZnQ6IDAgfTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdiYXInKSB7XG4gICAgICB0aGlzLm1hcmdpbiA9IHsgdG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwIH07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2xpbmUtaGlnaCcgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sb3JOZWdhdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5jb2xvck5lZ2F0aXZlID0gdGhpcy5jb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cigndmlld0JveCcsIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gKTtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdsaW5lJyB8fCB0aGlzLnR5cGUgPT09ICdsaW5lLWhpZ2gnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnc3BhcmtsaW5lJylcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnbm9uZScpXG4gICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCB0aGlzLnN0cm9rZVdpZHRoKVxuICAgICAgICAuYXR0cignc3Ryb2tlJywgdGhpcy5jb2xvcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnc3BhcmthcmVhJylcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCB0aGlzLmNvbG9yKVxuICAgICAgICAuYXR0cignZmlsbC1vcGFjaXR5JywgMC4zKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2hhcnQoKSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0gdGhpcy5kYXRhO1xuXG4gICAgY29uc3QgeCA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIHRoaXMuZGF0YS5sZW5ndGhdKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0XSk7XG5cbiAgICBjb25zdCB5ID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbK2QzX21pbih0aGlzLmRhdGEpIC0gdGhpcy55QXhpc01pbkJ1ZmZlciwgK2QzX21heCh0aGlzLmRhdGEpICsgdGhpcy55QXhpc01heEJ1ZmZlcl0pXG4gICAgICAucmFuZ2UoW3RoaXMuaGVpZ2h0IC0gdGhpcy5tYXJnaW4udG9wIC0gdGhpcy5tYXJnaW4uYm90dG9tLCAwXSk7XG5cbiAgICBjb25zdCBsaW5lID0gZDNfbGluZSgpXG4gICAgICAueCgoZCwgaSkgPT4geChpKSlcbiAgICAgIC55KChkOiBhbnkpID0+IHkoZCkpO1xuXG4gICAgY29uc3QgYXJlYSA9IGQzX2FyZWEoKVxuICAgICAgLngoKGQsIGkpID0+IHgoaSkpXG4gICAgICAueTAodGhpcy5oZWlnaHQpXG4gICAgICAueTEoKGQ6IGFueSkgPT4geShkKSk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnbGluZScgfHwgdGhpcy50eXBlID09PSAnbGluZS1oaWdoJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuc3BhcmtsaW5lJylcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmF0dHIoJ2QnLCAoKSA9PiBsaW5lKGRhdGEpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnYXJlYScgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrYXJlYScpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5hdHRyKCdkJywgKCkgPT4gYXJlYShkYXRhKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2JhcicpIHtcbiAgICAgIGNvbnN0IGJhcldpZHRoID0gKHRoaXMud2lkdGggLSB0aGlzLmRhdGEubGVuZ3RoKSAvIHRoaXMuZGF0YS5sZW5ndGg7XG5cbiAgICAgIC8vIGhhbmRsZXMgbmVnYXRpdmUgdmFsdWVzLCBzZWUgZXhhbXBsZSBodHRwczovL3d3dy5lc3N5Y29kZS5jb20vcG9zdHMvY3JlYXRlLXNwYXJrbGluZS1jaGFydHMtZDMvXG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCcuc3BhcmtiYXInKVxuICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIGVudGVyID0+XG4gICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NwYXJrYmFyJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4geChpKSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgYmFyV2lkdGgpXG4gICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiAoZCA+IDAgPyB0aGlzLmNvbG9yIDogdGhpcy5jb2xvck5lZ2F0aXZlKSkgLy8gc3RpbGwgdXNlcyB1bmRvY3VtZW50ZWQgbmVnYXRpdmUgY29sb3IgdmFsdWVzXG4gICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAgICAgICAuY2FsbChlbnRlciA9PiB7XG4gICAgICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBkID0+IChkID4gMCA/IHkoZCkgOiB5KDApKSlcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IE1hdGguYWJzKHkoZCkgLSB5KDApKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZW50ZXI7XG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgIHVwZGF0ZSA9PlxuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHgoaSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiAoZCA+IDAgPyB5KGQpIDogeSgwKSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGJhcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiBNYXRoLmFicyh5KGQpIC0geSgwKSkpXG4gICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiAoZCA+IDAgPyB0aGlzLmNvbG9yIDogdGhpcy5jb2xvck5lZ2F0aXZlKSksXG4gICAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=
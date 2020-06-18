/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { line as d3_line, area as d3_area } from 'd3-shape';
import { scaleLinear as d3_scaleLinear } from 'd3-scale';
import { min as d3_min, max as d3_max } from 'd3-array';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1zcGFya2xpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotc3BhcmtsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFdBQVcsRUFDWCx1QkFBdUIsRUFHeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLElBQUksSUFBSSxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBSXhEO0lBNENFLHVDQUFvQixRQUFvQjtRQUFwQixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBcEN4QyxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBR2xCLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBTXRCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFHWixXQUFNLEdBQUcsRUFBRSxDQUFDO1FBR1osU0FBSSxHQUF3RCxNQUFNLENBQUM7UUFHbkUsVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUdsQixrQkFBYSxHQUFrQixJQUFJLENBQUMsQ0FBQyxrQ0FBa0M7O1FBR3ZFLGdCQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsdURBQXVEOztRQUd4RSxtQkFBYyxHQUFHLENBQUMsQ0FBQztRQUduQixtQkFBYyxHQUFHLENBQUMsQ0FBQztJQU13QixDQUFDOzs7O0lBRTVDLGdEQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxNQUFNLEdB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R0wsS0FBSzs4QkFHTCxLQUFLO2lDQUdMLEtBQUs7aUNBR0wsS0FBSzs7SUF1SVIsb0NBQUM7Q0FBQSxBQTVLRCxJQTRLQztTQXRLWSw2QkFBNkI7OztJQUN4QyxtREFDa0I7O0lBRWxCLHVEQUNzQjs7SUFFdEIsNkNBQzJCOztJQUUzQiw4Q0FDWTs7SUFFWiwrQ0FDWTs7SUFFWiw2Q0FDbUU7O0lBRW5FLDhDQUNrQjs7SUFFbEIsc0RBQ29DOztJQUVwQyxvREFDZ0I7O0lBRWhCLHVEQUNtQjs7SUFFbkIsdURBQ21COzs7OztJQUVuQiw4Q0FBYzs7Ozs7SUFDZCw0Q0FBWTs7Ozs7SUFDWiwrQ0FBZTs7Ozs7SUFFSCxpREFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IGxpbmUgYXMgZDNfbGluZSwgYXJlYSBhcyBkM19hcmVhIH0gZnJvbSAnZDMtc2hhcGUnO1xuaW1wb3J0IHsgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBtaW4gYXMgZDNfbWluLCBtYXggYXMgZDNfbWF4IH0gZnJvbSAnZDMtYXJyYXknO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNwYXJrbGluZSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LXNwYXJrbGluZScsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpTcGFya2xpbmVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1zcGFya2xpbmUnKVxuICBzcGFya2xpbmVDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogUGJkc0RhdGF2aXpTcGFya2xpbmU7XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAxNjA7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ2xpbmUnIHwgJ2xpbmUtaGlnaCcgfCAnYXJlYScgfCAnYXJlYS1oaWdoJyB8ICdiYXInID0gJ2xpbmUnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yID0gJyNFMjNEQTgnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yTmVnYXRpdmU6IHN0cmluZyB8IG51bGwgPSBudWxsOyAvLyB1bmRvY3VtZW50ZWQsIG1heSBhZGQgaWYgbmVlZGVkXG5cbiAgQElucHV0KClcbiAgc3Ryb2tlV2lkdGggPSAyOyAvLyB1bmRvY3VtZW50ZWQsIHdpZHRoIGlzIGF1dG9tYXRpY2FsbHkgc2V0IGJ5IHRoZSB0eXBlXG5cbiAgQElucHV0KClcbiAgeUF4aXNNaW5CdWZmZXIgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWF4QnVmZmVyID0gMDtcblxuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHsgdG9wOiAxLCByaWdodDogMCwgYm90dG9tOiAxLCBsZWZ0OiAwIH07XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnYmFyJykge1xuICAgICAgdGhpcy5tYXJnaW4gPSB7IHRvcDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCwgbGVmdDogMCB9O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdsaW5lLWhpZ2gnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSAxO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbG9yTmVnYXRpdmUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuY29sb3JOZWdhdGl2ZSA9IHRoaXMuY29sb3I7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAke3RoaXMud2lkdGh9ICR7dGhpcy5oZWlnaHR9YCk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnbGluZScgfHwgdGhpcy50eXBlID09PSAnbGluZS1oaWdoJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NwYXJrbGluZScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJ25vbmUnKVxuICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgdGhpcy5zdHJva2VXaWR0aClcbiAgICAgICAgLmF0dHIoJ3N0cm9rZScsIHRoaXMuY29sb3IpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdhcmVhJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NwYXJrYXJlYScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgdGhpcy5jb2xvcilcbiAgICAgICAgLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIDAuMyk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0KCkge1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZGF0YTtcblxuICAgIGNvbnN0IHggPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCB0aGlzLmRhdGEubGVuZ3RoXSlcbiAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuXG4gICAgY29uc3QgeSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWytkM19taW4odGhpcy5kYXRhKSAtIHRoaXMueUF4aXNNaW5CdWZmZXIsICtkM19tYXgodGhpcy5kYXRhKSArIHRoaXMueUF4aXNNYXhCdWZmZXJdKVxuICAgICAgLnJhbmdlKFt0aGlzLmhlaWdodCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbSwgMF0pO1xuXG4gICAgY29uc3QgbGluZSA9IGQzX2xpbmUoKVxuICAgICAgLngoKGQsIGkpID0+IHgoaSkpXG4gICAgICAueSgoZDogYW55KSA9PiB5KGQpKTtcblxuICAgIGNvbnN0IGFyZWEgPSBkM19hcmVhKClcbiAgICAgIC54KChkLCBpKSA9PiB4KGkpKVxuICAgICAgLnkwKHRoaXMuaGVpZ2h0KVxuICAgICAgLnkxKChkOiBhbnkpID0+IHkoZCkpO1xuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2xpbmUnIHx8IHRoaXMudHlwZSA9PT0gJ2xpbmUtaGlnaCcgfHwgdGhpcy50eXBlID09PSAnYXJlYScgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrbGluZScpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5hdHRyKCdkJywgKCkgPT4gbGluZShkYXRhKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2FyZWEnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5zcGFya2FyZWEnKVxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuYXR0cignZCcsICgpID0+IGFyZWEoZGF0YSkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdiYXInKSB7XG4gICAgICBjb25zdCBiYXJXaWR0aCA9ICh0aGlzLndpZHRoIC0gdGhpcy5kYXRhLmxlbmd0aCkgLyB0aGlzLmRhdGEubGVuZ3RoO1xuXG4gICAgICAvLyBoYW5kbGVzIG5lZ2F0aXZlIHZhbHVlcywgc2VlIGV4YW1wbGUgaHR0cHM6Ly93d3cuZXNzeWNvZGUuY29tL3Bvc3RzL2NyZWF0ZS1zcGFya2xpbmUtY2hhcnRzLWQzL1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrYmFyJylcbiAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICBlbnRlciA9PlxuICAgICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdzcGFya2JhcicpXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHgoaSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGJhcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cignZmlsbCcsIGQgPT4gKGQgPiAwID8gdGhpcy5jb2xvciA6IHRoaXMuY29sb3JOZWdhdGl2ZSkpIC8vIHN0aWxsIHVzZXMgdW5kb2N1bWVudGVkIG5lZ2F0aXZlIGNvbG9yIHZhbHVlc1xuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMClcbiAgICAgICAgICAgICAgLmNhbGwoZW50ZXIgPT4ge1xuICAgICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiAoZCA+IDAgPyB5KGQpIDogeSgwKSkpXG4gICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiBNYXRoLmFicyh5KGQpIC0geSgwKSkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudGVyO1xuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB4KGkpKVxuICAgICAgICAgICAgICAuYXR0cigneScsIGQgPT4gKGQgPiAwID8geShkKSA6IHkoMCkpKVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCBiYXJXaWR0aClcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGQgPT4gTWF0aC5hYnMoeShkKSAtIHkoMCkpKVxuICAgICAgICAgICAgICAuYXR0cignZmlsbCcsIGQgPT4gKGQgPiAwID8gdGhpcy5jb2xvciA6IHRoaXMuY29sb3JOZWdhdGl2ZSkpLFxuICAgICAgICAgIGV4aXQgPT4gZXhpdC5yZW1vdmUoKVxuICAgICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19
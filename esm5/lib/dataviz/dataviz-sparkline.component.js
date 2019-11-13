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
                .duration(750)
                .attr('d', (/**
             * @return {?}
             */
            function () { return line(data); }));
        }
        if (this.type === 'area' || this.type === 'area-high') {
            this.svg
                .selectAll('.sparkarea')
                .transition()
                .duration(750)
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
                        .duration(750)
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
                    .duration(750)
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
            function (exit) { return exit.remove(); }))
                .enter();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1zcGFya2xpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotc3BhcmtsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFdBQVcsRUFDWCx1QkFBdUIsRUFHeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLE1BQU0sSUFBSSxTQUFTLEVBQ25CLElBQUksSUFBSSxPQUFPLEVBQ2YsV0FBVyxJQUFJLGNBQWMsRUFDN0IsR0FBRyxJQUFJLE1BQU0sRUFDYixHQUFHLElBQUksTUFBTSxFQUNiLElBQUksSUFBSSxPQUFPLEVBQ2hCLE1BQU0sSUFBSSxDQUFDO0FBSVo7SUE0Q0UsdUNBQW9CLFFBQW9CO1FBQXBCLGFBQVEsR0FBUixRQUFRLENBQVk7UUFwQ3hDLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFNdEIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUdaLFdBQU0sR0FBRyxFQUFFLENBQUM7UUFHWixTQUFJLEdBQXdELE1BQU0sQ0FBQztRQUduRSxVQUFLLEdBQUcsU0FBUyxDQUFDO1FBR2xCLGtCQUFhLEdBQWtCLElBQUksQ0FBQyxDQUFDLGtDQUFrQzs7UUFHdkUsZ0JBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyx1REFBdUQ7O1FBR3hFLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBR25CLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO0lBTXdCLENBQUM7Ozs7SUFFNUMsZ0RBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUV2RCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDeEQ7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1NBQ3RCO1FBRUQsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksRUFBRTtZQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDakM7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFaEYsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSzthQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ2IsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ3pCLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUMzQixJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQzthQUMxQixJQUFJLENBQUMscUJBQXFCLEVBQUUsZUFBZSxDQUFDO2FBQzVDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksVUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBSSxJQUFJLENBQUMsS0FBSyxTQUFJLElBQUksQ0FBQyxNQUFRLENBQUMsQ0FBQztRQUU1RixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzFHLElBQUksQ0FBQyxHQUFHO2lCQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUM7aUJBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUM7aUJBQzFCLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO2lCQUNwQixJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUM7aUJBQ3RDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUNyRCxJQUFJLENBQUMsR0FBRztpQkFDTCxNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDO2lCQUMxQixJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQ3hCLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDOUI7UUFFRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQzs7Ozs7SUFFRCxtREFBVzs7OztJQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDN0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQzs7OztJQUVELG1EQUFXOzs7SUFBWDtRQUFBLGlCQTJFQzs7WUExRU8sSUFBSSxHQUFRLElBQUksQ0FBQyxJQUFJOztZQUVyQixDQUFDLEdBQUcsY0FBYyxFQUFFO2FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzdCLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7O1lBRTFELENBQUMsR0FBRyxjQUFjLEVBQUU7YUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUM1RixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDOztZQUUzRCxJQUFJLEdBQUcsT0FBTyxFQUFFO2FBQ25CLENBQUM7Ozs7O1FBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFKLENBQUksRUFBQzthQUNqQixDQUFDOzs7O1FBQUMsVUFBQyxDQUFNLElBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUosQ0FBSSxFQUFDOztZQUVoQixJQUFJLEdBQUcsT0FBTyxFQUFFO2FBQ25CLENBQUM7Ozs7O1FBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFKLENBQUksRUFBQzthQUNqQixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUNmLEVBQUU7Ozs7UUFBQyxVQUFDLENBQU0sSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBSixDQUFJLEVBQUM7UUFFdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUMxRyxJQUFJLENBQUMsR0FBRztpQkFDTCxTQUFTLENBQUMsWUFBWSxDQUFDO2lCQUN2QixVQUFVLEVBQUU7aUJBQ1osUUFBUSxDQUFDLEdBQUcsQ0FBQztpQkFDYixJQUFJLENBQUMsR0FBRzs7O1lBQUUsY0FBTSxPQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBVixDQUFVLEVBQUMsQ0FBQztTQUNoQztRQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDckQsSUFBSSxDQUFDLEdBQUc7aUJBQ0wsU0FBUyxDQUFDLFlBQVksQ0FBQztpQkFDdkIsVUFBVSxFQUFFO2lCQUNaLFFBQVEsQ0FBQyxHQUFHLENBQUM7aUJBQ2IsSUFBSSxDQUFDLEdBQUc7OztZQUFFLGNBQU0sT0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQVYsQ0FBVSxFQUFDLENBQUM7U0FDaEM7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFOztnQkFDakIsVUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUVuRSxrR0FBa0c7WUFDbEcsSUFBSSxDQUFDLEdBQUc7aUJBQ0wsU0FBUyxDQUFDLFdBQVcsQ0FBQztpQkFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7aUJBQ2YsSUFBSTs7OztZQUNILFVBQUEsS0FBSztnQkFDSCxPQUFBLEtBQUs7cUJBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQztxQkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztxQkFDekIsSUFBSSxDQUFDLEdBQUc7Ozs7O2dCQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBSixDQUFJLEVBQUM7cUJBQ3pCLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQztxQkFDdEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFRLENBQUM7cUJBQ3ZCLElBQUksQ0FBQyxNQUFNOzs7O2dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLEVBQXpDLENBQXlDLEVBQUMsQ0FBQyxnREFBZ0Q7cUJBQzdHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3FCQUNqQixJQUFJOzs7O2dCQUFDLFVBQUEsS0FBSztvQkFDVCxLQUFLO3lCQUNGLFVBQVUsRUFBRTt5QkFDWixRQUFRLENBQUMsR0FBRyxDQUFDO3lCQUNiLElBQUksQ0FBQyxHQUFHOzs7O29CQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFyQixDQUFxQixFQUFDO3lCQUNyQyxJQUFJLENBQUMsUUFBUTs7OztvQkFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFyQixDQUFxQixFQUFDLENBQUM7b0JBRTlDLE9BQU8sS0FBSyxDQUFDO2dCQUNmLENBQUMsRUFBQztZQWhCSixDQWdCSTs7OztZQUNOLFVBQUEsTUFBTTtnQkFDSixPQUFBLE1BQU07cUJBQ0gsVUFBVSxFQUFFO3FCQUNaLFFBQVEsQ0FBQyxHQUFHLENBQUM7cUJBQ2IsSUFBSSxDQUFDLEdBQUc7Ozs7O2dCQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBSixDQUFJLEVBQUM7cUJBQ3pCLElBQUksQ0FBQyxHQUFHOzs7O2dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFyQixDQUFxQixFQUFDO3FCQUNyQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVEsQ0FBQztxQkFDdkIsSUFBSSxDQUFDLFFBQVE7Ozs7Z0JBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBckIsQ0FBcUIsRUFBQztxQkFDMUMsSUFBSSxDQUFDLE1BQU07Ozs7Z0JBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsRUFBekMsQ0FBeUMsRUFBQztZQVAvRCxDQU8rRDs7OztZQUNqRSxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBYixDQUFhLEVBQ3RCO2lCQUNBLEtBQUssRUFBRSxDQUFDO1NBQ1o7SUFDSCxDQUFDOztnQkE1S0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFFBQVEsRUFBRSxFQUFFO29CQUVaLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDs7OztnQkF2QkMsVUFBVTs7OzZCQXlCVCxXQUFXLFNBQUMsa0JBQWtCO2lDQUc5QixXQUFXLFNBQUMsNEJBQTRCO3VCQUd4QyxLQUFLO3dCQUdMLEtBQUs7eUJBR0wsS0FBSzt1QkFHTCxLQUFLO3dCQUdMLEtBQUs7Z0NBR0wsS0FBSzs4QkFHTCxLQUFLO2lDQUdMLEtBQUs7aUNBR0wsS0FBSzs7SUF3SVIsb0NBQUM7Q0FBQSxBQTdLRCxJQTZLQztTQXZLWSw2QkFBNkI7OztJQUN4QyxtREFDa0I7O0lBRWxCLHVEQUNzQjs7SUFFdEIsNkNBQzJCOztJQUUzQiw4Q0FDWTs7SUFFWiwrQ0FDWTs7SUFFWiw2Q0FDbUU7O0lBRW5FLDhDQUNrQjs7SUFFbEIsc0RBQ29DOztJQUVwQyxvREFDZ0I7O0lBRWhCLHVEQUNtQjs7SUFFbkIsdURBQ21COzs7OztJQUVuQiw4Q0FBYzs7Ozs7SUFDZCw0Q0FBWTs7Ozs7SUFDWiwrQ0FBZTs7Ozs7SUFFSCxpREFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBzZWxlY3QgYXMgZDNfc2VsZWN0LFxuICBsaW5lIGFzIGQzX2xpbmUsXG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBtaW4gYXMgZDNfbWluLFxuICBtYXggYXMgZDNfbWF4LFxuICBhcmVhIGFzIGQzX2FyZWFcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNwYXJrbGluZSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LXNwYXJrbGluZScsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpTcGFya2xpbmVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1zcGFya2xpbmUnKVxuICBzcGFya2xpbmVDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogUGJkc0RhdGF2aXpTcGFya2xpbmU7XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAxNjA7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ2xpbmUnIHwgJ2xpbmUtaGlnaCcgfCAnYXJlYScgfCAnYXJlYS1oaWdoJyB8ICdiYXInID0gJ2xpbmUnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yID0gJyNFMjNEQTgnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yTmVnYXRpdmU6IHN0cmluZyB8IG51bGwgPSBudWxsOyAvLyB1bmRvY3VtZW50ZWQsIG1heSBhZGQgaWYgbmVlZGVkXG5cbiAgQElucHV0KClcbiAgc3Ryb2tlV2lkdGggPSAyOyAvLyB1bmRvY3VtZW50ZWQsIHdpZHRoIGlzIGF1dG9tYXRpY2FsbHkgc2V0IGJ5IHRoZSB0eXBlXG5cbiAgQElucHV0KClcbiAgeUF4aXNNaW5CdWZmZXIgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHlBeGlzTWF4QnVmZmVyID0gMDtcblxuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHsgdG9wOiAxLCByaWdodDogMCwgYm90dG9tOiAxLCBsZWZ0OiAwIH07XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnYmFyJykge1xuICAgICAgdGhpcy5tYXJnaW4gPSB7IHRvcDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCwgbGVmdDogMCB9O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdsaW5lLWhpZ2gnIHx8IHRoaXMudHlwZSA9PT0gJ2FyZWEtaGlnaCcpIHtcbiAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSAxO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbG9yTmVnYXRpdmUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuY29sb3JOZWdhdGl2ZSA9IHRoaXMuY29sb3I7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAke3RoaXMud2lkdGh9ICR7dGhpcy5oZWlnaHR9YCk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnbGluZScgfHwgdGhpcy50eXBlID09PSAnbGluZS1oaWdoJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NwYXJrbGluZScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJ25vbmUnKVxuICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgdGhpcy5zdHJva2VXaWR0aClcbiAgICAgICAgLmF0dHIoJ3N0cm9rZScsIHRoaXMuY29sb3IpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdhcmVhJyB8fCB0aGlzLnR5cGUgPT09ICdhcmVhLWhpZ2gnKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NwYXJrYXJlYScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgdGhpcy5jb2xvcilcbiAgICAgICAgLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIDAuMyk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0KCkge1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZGF0YTtcblxuICAgIGNvbnN0IHggPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCB0aGlzLmRhdGEubGVuZ3RoXSlcbiAgICAgIC5yYW5nZShbMCwgdGhpcy53aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodF0pO1xuXG4gICAgY29uc3QgeSA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWytkM19taW4odGhpcy5kYXRhKSAtIHRoaXMueUF4aXNNaW5CdWZmZXIsICtkM19tYXgodGhpcy5kYXRhKSArIHRoaXMueUF4aXNNYXhCdWZmZXJdKVxuICAgICAgLnJhbmdlKFt0aGlzLmhlaWdodCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbSwgMF0pO1xuXG4gICAgY29uc3QgbGluZSA9IGQzX2xpbmUoKVxuICAgICAgLngoKGQsIGkpID0+IHgoaSkpXG4gICAgICAueSgoZDogYW55KSA9PiB5KGQpKTtcblxuICAgIGNvbnN0IGFyZWEgPSBkM19hcmVhKClcbiAgICAgIC54KChkLCBpKSA9PiB4KGkpKVxuICAgICAgLnkwKHRoaXMuaGVpZ2h0KVxuICAgICAgLnkxKChkOiBhbnkpID0+IHkoZCkpO1xuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2xpbmUnIHx8IHRoaXMudHlwZSA9PT0gJ2xpbmUtaGlnaCcgfHwgdGhpcy50eXBlID09PSAnYXJlYScgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrbGluZScpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAgICAgLmF0dHIoJ2QnLCAoKSA9PiBsaW5lKGRhdGEpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnYXJlYScgfHwgdGhpcy50eXBlID09PSAnYXJlYS1oaWdoJykge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLnNlbGVjdEFsbCgnLnNwYXJrYXJlYScpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAgICAgLmF0dHIoJ2QnLCAoKSA9PiBhcmVhKGRhdGEpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnYmFyJykge1xuICAgICAgY29uc3QgYmFyV2lkdGggPSAodGhpcy53aWR0aCAtIHRoaXMuZGF0YS5sZW5ndGgpIC8gdGhpcy5kYXRhLmxlbmd0aDtcblxuICAgICAgLy8gaGFuZGxlcyBuZWdhdGl2ZSB2YWx1ZXMsIHNlZSBleGFtcGxlIGh0dHBzOi8vd3d3LmVzc3ljb2RlLmNvbS9wb3N0cy9jcmVhdGUtc3BhcmtsaW5lLWNoYXJ0cy1kMy9cbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5zcGFya2JhcicpXG4gICAgICAgIC5kYXRhKHRoaXMuZGF0YSlcbiAgICAgICAgLmpvaW4oXG4gICAgICAgICAgZW50ZXIgPT5cbiAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc3BhcmtiYXInKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB4KGkpKVxuICAgICAgICAgICAgICAuYXR0cigneScsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCBiYXJXaWR0aClcbiAgICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBkID0+IChkID4gMCA/IHRoaXMuY29sb3IgOiB0aGlzLmNvbG9yTmVnYXRpdmUpKSAvLyBzdGlsbCB1c2VzIHVuZG9jdW1lbnRlZCBuZWdhdGl2ZSBjb2xvciB2YWx1ZXNcbiAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDApXG4gICAgICAgICAgICAgIC5jYWxsKGVudGVyID0+IHtcbiAgICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiAoZCA+IDAgPyB5KGQpIDogeSgwKSkpXG4gICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiBNYXRoLmFicyh5KGQpIC0geSgwKSkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudGVyO1xuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICB1cGRhdGUgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbig3NTApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHgoaSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgZCA9PiAoZCA+IDAgPyB5KGQpIDogeSgwKSkpXG4gICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGJhcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiBNYXRoLmFicyh5KGQpIC0geSgwKSkpXG4gICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiAoZCA+IDAgPyB0aGlzLmNvbG9yIDogdGhpcy5jb2xvck5lZ2F0aXZlKSksXG4gICAgICAgICAgZXhpdCA9PiBleGl0LnJlbW92ZSgpXG4gICAgICAgIClcbiAgICAgICAgLmVudGVyKCk7XG4gICAgfVxuICB9XG59XG4iXX0=
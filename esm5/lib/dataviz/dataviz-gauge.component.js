/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { interpolate as d3_interpolate } from 'd3-interpolate';
import { arc as d3_arc } from 'd3-shape';
import { format as d3_format } from 'd3-format';
import { PbdsDatavizService } from './dataviz.service';
var PbdsDatavizGaugeComponent = /** @class */ (function () {
    function PbdsDatavizGaugeComponent(_dataviz, _element) {
        var _this = this;
        this._dataviz = _dataviz;
        this._element = _element;
        this.chartClass = true;
        this.gaugeClass = true;
        this.width = 300;
        this.type = 'halfmoon';
        this.color = '#E23DA8';
        this.hideLabel = false;
        this.labelFormatString = '';
        this.gaugeWidth = 20;
        this.degreesToRadians = (/**
         * @param {?} degree
         * @return {?}
         */
        function (degree) {
            return (degree * Math.PI) / 180;
        });
        this.calculateMinMax = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var percentage = _this.data.minvalue / (_this.data.maxvalue - _this.data.minvalue);
            return percentage * (_this.data.value - _this.data.minvalue) + (_this.data.value - _this.data.minvalue);
        });
        this.calculateCurve = (/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            /** @type {?} */
            var start = _this.degreesToRadians(_this.startAngle);
            /** @type {?} */
            var end = start + (data * (_this.degreesToRadians(_this.endAngle) - start)) / _this.data.maxvalue;
            return [
                {
                    startAngle: start,
                    endAngle: end
                }
            ];
        });
        this.drawChart = (/**
         * @return {?}
         */
        function () {
            _this.gauge = _this.svg.append('g').attr('class', 'gauge-group');
            // background arc
            _this.gauge
                .append('path')
                .data(_this.calculateCurve(_this.data.maxvalue))
                .attr('class', 'gauge-background')
                .attr('d', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return _this.arc({
                    innerRadius: _this.radius - _this.gaugeWidth,
                    outerRadius: _this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            }));
            // value arc
            _this.gauge
                .append('path')
                .data(_this.calculateCurve(_this.calculateMinMax()))
                .attr('class', 'gauge-value')
                .attr('fill', _this.color)
                .attr('d', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return _this.arc({
                    innerRadius: _this.radius - _this.gaugeWidth,
                    outerRadius: _this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            }));
            switch (_this.type) {
                case 'horseshoe':
                    _this.svg.attr('height', 230).attr('viewBox', "-" + _this.width / 2 + " -" + _this.height / 2 + " " + _this.height + " 230");
                    break;
                case 'halfmoon':
                    _this.svg.attr('height', _this.width / 2);
                    _this.svg.attr('viewBox', "-" + _this.width / 2 + " -" + _this.width / 2 + " " + _this.width + " " + _this.width / 2);
                    break;
            }
        });
        this.updateChart = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var group = _this.svg.select('.gauge-group');
            group
                .select('.gauge-value')
                .transition()
                .duration(750)
                .call(_this.arcTween, _this.calculateMinMax());
            _this.labelTween = _this.chart.select('.gauge-number');
            _this.labelTween
                .transition()
                .duration(750)
                .call(_this.textTween, _this.data.value);
        });
        this.arcTween = (/**
         * @param {?} transition
         * @param {?} value
         * @return {?}
         */
        function (transition, value) {
            /** @type {?} */
            var newAngle = _this.calculateCurve(value);
            transition.attrTween('d', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                /** @type {?} */
                var interpolate = d3_interpolate(d.endAngle, newAngle[0].endAngle);
                return (/**
                 * @param {?} t
                 * @return {?}
                 */
                function (t) {
                    d.endAngle = interpolate(t);
                    return _this.arc({
                        innerRadius: _this.radius - _this.gaugeWidth,
                        outerRadius: _this.radius,
                        startAngle: d.startAngle,
                        endAngle: d.endAngle
                    });
                });
            }));
        });
        this.textTween = (/**
         * @param {?} transition
         * @param {?} value
         * @return {?}
         */
        function (transition, value) {
            value = d3_format('.4f')(value);
            value = value.replace(/,/g, '.');
            transition.tween('text', (/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var interpolate = d3_interpolate(d3_format('.4f')(+_this.oldValue), value);
                return (/**
                 * @param {?} t
                 * @return {?}
                 */
                function (t) {
                    _this.labelTween.text((/**
                     * @param {?} d
                     * @return {?}
                     */
                    function (d) {
                        /** @type {?} */
                        var updatedNumber = _this.labelFormat(interpolate(t));
                        _this.label = updatedNumber;
                        return updatedNumber;
                    }));
                });
            }));
        });
    }
    /**
     * @return {?}
     */
    PbdsDatavizGaugeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.height = this.width;
        this.radius = Math.max(this.width, this.height) / 2;
        this.labelFormat = d3_format(this.labelFormatString);
        this.label = this.labelFormat(this.data.value);
        switch (this.type) {
            case 'halfmoon':
                this.startAngle = -90;
                this.endAngle = 90;
                this.rounded = true;
                break;
            case 'horseshoe':
                this.startAngle = -140;
                this.endAngle = 140;
                this.rounded = true;
                break;
            case 'circle':
                this.startAngle = 0;
                this.endAngle = 360;
                this.rounded = false;
                break;
        }
        this.arc = d3_arc().cornerRadius(this.rounded ? this.gaugeWidth : 0);
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        this.svg = this.chart
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', "-" + this.width / 2 + " -" + this.height / 2 + " " + this.width + " " + this.height);
        this.drawChart();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PbdsDatavizGaugeComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.data && !changes.data.firstChange) {
            this.oldValue = changes.data.previousValue.value;
            this.updateChart();
        }
    };
    PbdsDatavizGaugeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-gauge',
                    template: "\n    <div\n      *ngIf=\"!hideLabel\"\n      class=\"gauge-details\"\n      [ngClass]=\"{ halfmoon: type === 'halfmoon', 'gauge-details-small': type === 'halfmoon' }\"\n      [ngStyle]=\"{ 'max-width.px': width - 3 * gaugeWidth }\"\n    >\n      <div class=\"gauge-number\">{{ label }}</div>\n      <div *ngIf=\"description\" class=\"gauge-description text-center\">{{ description }}</div>\n    </div>\n  "
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizGaugeComponent.ctorParameters = function () { return [
        { type: PbdsDatavizService },
        { type: ElementRef }
    ]; };
    PbdsDatavizGaugeComponent.propDecorators = {
        chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
        gaugeClass: [{ type: HostBinding, args: ['class.pbds-chart-gauge',] }],
        data: [{ type: Input }],
        width: [{ type: Input }],
        type: [{ type: Input }],
        color: [{ type: Input }],
        hideLabel: [{ type: Input }],
        labelFormatString: [{ type: Input }],
        description: [{ type: Input }],
        gaugeWidth: [{ type: Input }]
    };
    return PbdsDatavizGaugeComponent;
}());
export { PbdsDatavizGaugeComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.chartClass;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.gaugeClass;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.data;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.width;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.type;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.color;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.hideLabel;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.labelFormatString;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.description;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.gaugeWidth;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.gauge;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.labelTween;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.label;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.startAngle;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.endAngle;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.radius;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.arc;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.labelFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.oldValue;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.height;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype.rounded;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.degreesToRadians;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.calculateMinMax;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.calculateCurve;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.drawChart;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.updateChart;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.arcTween;
    /** @type {?} */
    PbdsDatavizGaugeComponent.prototype.textTween;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype._dataviz;
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizGaugeComponent.prototype._element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1nYXVnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2RhdGF2aXovZGF0YXZpei1nYXVnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBRTVHLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxXQUFXLElBQUksY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0QsT0FBTyxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDekMsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFaEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHdkQ7SUE0REUsbUNBQW9CLFFBQTRCLEVBQVUsUUFBb0I7UUFBOUUsaUJBQWtGO1FBQTlELGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQTNDOUUsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixlQUFVLEdBQUcsSUFBSSxDQUFDO1FBTWxCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFHWixTQUFJLEdBQXdDLFVBQVUsQ0FBQztRQUd2RCxVQUFLLEdBQUcsU0FBUyxDQUFDO1FBR2xCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFHbEIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBTXZCLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFrRWhCLHFCQUFnQjs7OztRQUFHLFVBQUEsTUFBTTtZQUN2QixPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDbEMs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LFFBQVEsRUFBRSx3WkFVVDtpQkFFRjs7OztnQkFqQlEsa0JBQWtCO2dCQVBRLFVBQVU7Ozs2QkEwQjFDLFdBQVcsU0FBQyxrQkFBa0I7NkJBRzlCLFdBQVcsU0FBQyx3QkFBd0I7dUJBR3BDLEtBQUs7d0JBR0wsS0FBSzt1QkFHTCxLQUFLO3dCQUdMLEtBQUs7NEJBR0wsS0FBSztvQ0FHTCxLQUFLOzhCQUdMLEtBQUs7NkJBR0wsS0FBSzs7SUF3TFIsZ0NBQUM7Q0FBQSxBQW5PRCxJQW1PQztTQXBOWSx5QkFBeUI7OztJQUNwQywrQ0FDa0I7O0lBRWxCLCtDQUNrQjs7SUFFbEIseUNBQ3VCOztJQUV2QiwwQ0FDWTs7SUFFWix5Q0FDdUQ7O0lBRXZELDBDQUNrQjs7SUFFbEIsOENBQ2tCOztJQUVsQixzREFDdUI7O0lBRXZCLGdEQUNZOztJQUVaLCtDQUNnQjs7Ozs7SUFFaEIsMENBQWM7Ozs7O0lBQ2Qsd0NBQVk7Ozs7O0lBQ1osMENBQWM7Ozs7O0lBQ2QsK0NBQW1COztJQUNuQiwwQ0FBYTs7Ozs7SUFDYiwrQ0FBbUI7Ozs7O0lBQ25CLDZDQUFpQjs7Ozs7SUFDakIsMkNBQWU7Ozs7O0lBQ2Ysd0NBQVk7Ozs7O0lBQ1osZ0RBQW9COzs7OztJQUNwQiw2Q0FBaUI7Ozs7O0lBQ2pCLDJDQUFlOzs7OztJQUNmLDRDQUFnQjs7SUFvRGhCLHFEQUVFOztJQUVGLG9EQUlFOztJQUVGLG1EQVVFOztJQUVGLDhDQXlDRTs7SUFFRixnREFlRTs7SUFFRiw2Q0FpQkU7O0lBRUYsOENBZUU7Ozs7O0lBdEtVLDZDQUFvQzs7Ozs7SUFBRSw2Q0FBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBpbnRlcnBvbGF0ZSBhcyBkM19pbnRlcnBvbGF0ZSB9IGZyb20gJ2QzLWludGVycG9sYXRlJztcbmltcG9ydCB7IGFyYyBhcyBkM19hcmMgfSBmcm9tICdkMy1zaGFwZSc7XG5pbXBvcnQgeyBmb3JtYXQgYXMgZDNfZm9ybWF0IH0gZnJvbSAnZDMtZm9ybWF0JztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpHYXVnZSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWdhdWdlJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICAqbmdJZj1cIiFoaWRlTGFiZWxcIlxuICAgICAgY2xhc3M9XCJnYXVnZS1kZXRhaWxzXCJcbiAgICAgIFtuZ0NsYXNzXT1cInsgaGFsZm1vb246IHR5cGUgPT09ICdoYWxmbW9vbicsICdnYXVnZS1kZXRhaWxzLXNtYWxsJzogdHlwZSA9PT0gJ2hhbGZtb29uJyB9XCJcbiAgICAgIFtuZ1N0eWxlXT1cInsgJ21heC13aWR0aC5weCc6IHdpZHRoIC0gMyAqIGdhdWdlV2lkdGggfVwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cImdhdWdlLW51bWJlclwiPnt7IGxhYmVsIH19PC9kaXY+XG4gICAgICA8ZGl2ICpuZ0lmPVwiZGVzY3JpcHRpb25cIiBjbGFzcz1cImdhdWdlLWRlc2NyaXB0aW9uIHRleHQtY2VudGVyXCI+e3sgZGVzY3JpcHRpb24gfX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtZ2F1Z2UnKVxuICBnYXVnZUNsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBQYmRzRGF0YXZpekdhdWdlO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzAwO1xuXG4gIEBJbnB1dCgpXG4gIHR5cGU6ICdoYWxmbW9vbicgfCAnaG9yc2VzaG9lJyB8ICdjaXJjbGUnID0gJ2hhbGZtb29uJztcblxuICBASW5wdXQoKVxuICBjb2xvciA9ICcjRTIzREE4JztcblxuICBASW5wdXQoKVxuICBoaWRlTGFiZWwgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGRlc2NyaXB0aW9uO1xuXG4gIEBJbnB1dCgpXG4gIGdhdWdlV2lkdGggPSAyMDtcblxuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBnYXVnZTtcbiAgcHJpdmF0ZSBsYWJlbFR3ZWVuO1xuICBwdWJsaWMgbGFiZWw7XG4gIHByaXZhdGUgc3RhcnRBbmdsZTtcbiAgcHJpdmF0ZSBlbmRBbmdsZTtcbiAgcHJpdmF0ZSByYWRpdXM7XG4gIHByaXZhdGUgYXJjO1xuICBwcml2YXRlIGxhYmVsRm9ybWF0O1xuICBwcml2YXRlIG9sZFZhbHVlO1xuICBwcml2YXRlIGhlaWdodDtcbiAgcHJpdmF0ZSByb3VuZGVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5yYWRpdXMgPSBNYXRoLm1heCh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCkgLyAyO1xuICAgIHRoaXMubGFiZWxGb3JtYXQgPSBkM19mb3JtYXQodGhpcy5sYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy5sYWJlbCA9IHRoaXMubGFiZWxGb3JtYXQodGhpcy5kYXRhLnZhbHVlKTtcblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdoYWxmbW9vbic6XG4gICAgICAgIHRoaXMuc3RhcnRBbmdsZSA9IC05MDtcbiAgICAgICAgdGhpcy5lbmRBbmdsZSA9IDkwO1xuICAgICAgICB0aGlzLnJvdW5kZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnaG9yc2VzaG9lJzpcbiAgICAgICAgdGhpcy5zdGFydEFuZ2xlID0gLTE0MDtcbiAgICAgICAgdGhpcy5lbmRBbmdsZSA9IDE0MDtcbiAgICAgICAgdGhpcy5yb3VuZGVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgICAgIHRoaXMuc3RhcnRBbmdsZSA9IDA7XG4gICAgICAgIHRoaXMuZW5kQW5nbGUgPSAzNjA7XG4gICAgICAgIHRoaXMucm91bmRlZCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLmFyYyA9IGQzX2FyYygpLmNvcm5lclJhZGl1cyh0aGlzLnJvdW5kZWQgPyB0aGlzLmdhdWdlV2lkdGggOiAwKTtcblxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCB0aGlzLndpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKCd2aWV3Qm94JywgYC0ke3RoaXMud2lkdGggLyAyfSAtJHt0aGlzLmhlaWdodCAvIDJ9ICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gKTtcblxuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLm9sZFZhbHVlID0gY2hhbmdlcy5kYXRhLnByZXZpb3VzVmFsdWUudmFsdWU7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgZGVncmVlc1RvUmFkaWFucyA9IGRlZ3JlZSA9PiB7XG4gICAgcmV0dXJuIChkZWdyZWUgKiBNYXRoLlBJKSAvIDE4MDtcbiAgfTtcblxuICBjYWxjdWxhdGVNaW5NYXggPSAoKSA9PiB7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuZGF0YS5taW52YWx1ZSAvICh0aGlzLmRhdGEubWF4dmFsdWUgLSB0aGlzLmRhdGEubWludmFsdWUpO1xuXG4gICAgcmV0dXJuIHBlcmNlbnRhZ2UgKiAodGhpcy5kYXRhLnZhbHVlIC0gdGhpcy5kYXRhLm1pbnZhbHVlKSArICh0aGlzLmRhdGEudmFsdWUgLSB0aGlzLmRhdGEubWludmFsdWUpO1xuICB9O1xuXG4gIGNhbGN1bGF0ZUN1cnZlID0gZGF0YSA9PiB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmRlZ3JlZXNUb1JhZGlhbnModGhpcy5zdGFydEFuZ2xlKTtcbiAgICBjb25zdCBlbmQgPSBzdGFydCArIChkYXRhICogKHRoaXMuZGVncmVlc1RvUmFkaWFucyh0aGlzLmVuZEFuZ2xlKSAtIHN0YXJ0KSkgLyB0aGlzLmRhdGEubWF4dmFsdWU7XG5cbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBzdGFydEFuZ2xlOiBzdGFydCxcbiAgICAgICAgZW5kQW5nbGU6IGVuZFxuICAgICAgfVxuICAgIF07XG4gIH07XG5cbiAgZHJhd0NoYXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMuZ2F1Z2UgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdnYXVnZS1ncm91cCcpO1xuXG4gICAgLy8gYmFja2dyb3VuZCBhcmNcbiAgICB0aGlzLmdhdWdlXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5kYXRhKHRoaXMuY2FsY3VsYXRlQ3VydmUodGhpcy5kYXRhLm1heHZhbHVlKSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdnYXVnZS1iYWNrZ3JvdW5kJylcbiAgICAgIC5hdHRyKCdkJywgZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyYyh7XG4gICAgICAgICAgaW5uZXJSYWRpdXM6IHRoaXMucmFkaXVzIC0gdGhpcy5nYXVnZVdpZHRoLFxuICAgICAgICAgIG91dGVyUmFkaXVzOiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICBzdGFydEFuZ2xlOiBkLnN0YXJ0QW5nbGUsXG4gICAgICAgICAgZW5kQW5nbGU6IGQuZW5kQW5nbGVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIC8vIHZhbHVlIGFyY1xuICAgIHRoaXMuZ2F1Z2VcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy5jYWxjdWxhdGVDdXJ2ZSh0aGlzLmNhbGN1bGF0ZU1pbk1heCgpKSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdnYXVnZS12YWx1ZScpXG4gICAgICAuYXR0cignZmlsbCcsIHRoaXMuY29sb3IpXG4gICAgICAuYXR0cignZCcsIGQgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcmMoe1xuICAgICAgICAgIGlubmVyUmFkaXVzOiB0aGlzLnJhZGl1cyAtIHRoaXMuZ2F1Z2VXaWR0aCxcbiAgICAgICAgICBvdXRlclJhZGl1czogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgc3RhcnRBbmdsZTogZC5zdGFydEFuZ2xlLFxuICAgICAgICAgIGVuZEFuZ2xlOiBkLmVuZEFuZ2xlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSAnaG9yc2VzaG9lJzpcbiAgICAgICAgdGhpcy5zdmcuYXR0cignaGVpZ2h0JywgMjMwKS5hdHRyKCd2aWV3Qm94JywgYC0ke3RoaXMud2lkdGggLyAyfSAtJHt0aGlzLmhlaWdodCAvIDJ9ICR7dGhpcy5oZWlnaHR9IDIzMGApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2hhbGZtb29uJzpcbiAgICAgICAgdGhpcy5zdmcuYXR0cignaGVpZ2h0JywgdGhpcy53aWR0aCAvIDIpO1xuICAgICAgICB0aGlzLnN2Zy5hdHRyKCd2aWV3Qm94JywgYC0ke3RoaXMud2lkdGggLyAyfSAtJHt0aGlzLndpZHRoIC8gMn0gJHt0aGlzLndpZHRofSAke3RoaXMud2lkdGggLyAyfWApO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH07XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgY29uc3QgZ3JvdXAgPSB0aGlzLnN2Zy5zZWxlY3QoJy5nYXVnZS1ncm91cCcpO1xuXG4gICAgZ3JvdXBcbiAgICAgIC5zZWxlY3QoJy5nYXVnZS12YWx1ZScpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oNzUwKVxuICAgICAgLmNhbGwodGhpcy5hcmNUd2VlbiwgdGhpcy5jYWxjdWxhdGVNaW5NYXgoKSk7XG5cbiAgICB0aGlzLmxhYmVsVHdlZW4gPSB0aGlzLmNoYXJ0LnNlbGVjdCgnLmdhdWdlLW51bWJlcicpO1xuXG4gICAgdGhpcy5sYWJlbFR3ZWVuXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oNzUwKVxuICAgICAgLmNhbGwodGhpcy50ZXh0VHdlZW4sIHRoaXMuZGF0YS52YWx1ZSk7XG4gIH07XG5cbiAgYXJjVHdlZW4gPSAodHJhbnNpdGlvbiwgdmFsdWUpID0+IHtcbiAgICBjb25zdCBuZXdBbmdsZSA9IHRoaXMuY2FsY3VsYXRlQ3VydmUodmFsdWUpO1xuXG4gICAgdHJhbnNpdGlvbi5hdHRyVHdlZW4oJ2QnLCBkID0+IHtcbiAgICAgIGNvbnN0IGludGVycG9sYXRlID0gZDNfaW50ZXJwb2xhdGUoZC5lbmRBbmdsZSwgbmV3QW5nbGVbMF0uZW5kQW5nbGUpO1xuXG4gICAgICByZXR1cm4gdCA9PiB7XG4gICAgICAgIGQuZW5kQW5nbGUgPSBpbnRlcnBvbGF0ZSh0KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcmMoe1xuICAgICAgICAgIGlubmVyUmFkaXVzOiB0aGlzLnJhZGl1cyAtIHRoaXMuZ2F1Z2VXaWR0aCxcbiAgICAgICAgICBvdXRlclJhZGl1czogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgc3RhcnRBbmdsZTogZC5zdGFydEFuZ2xlLFxuICAgICAgICAgIGVuZEFuZ2xlOiBkLmVuZEFuZ2xlXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICB0ZXh0VHdlZW4gPSAodHJhbnNpdGlvbiwgdmFsdWUpID0+IHtcbiAgICB2YWx1ZSA9IGQzX2Zvcm1hdCgnLjRmJykodmFsdWUpO1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvLC9nLCAnLicpO1xuXG4gICAgdHJhbnNpdGlvbi50d2VlbigndGV4dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGludGVycG9sYXRlID0gZDNfaW50ZXJwb2xhdGUoZDNfZm9ybWF0KCcuNGYnKSgrdGhpcy5vbGRWYWx1ZSksIHZhbHVlKTtcblxuICAgICAgcmV0dXJuIHQgPT4ge1xuICAgICAgICB0aGlzLmxhYmVsVHdlZW4udGV4dChkID0+IHtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkTnVtYmVyID0gdGhpcy5sYWJlbEZvcm1hdChpbnRlcnBvbGF0ZSh0KSk7XG4gICAgICAgICAgdGhpcy5sYWJlbCA9IHVwZGF0ZWROdW1iZXI7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZWROdW1iZXI7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcbn1cbiJdfQ==
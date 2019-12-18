/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding } from '@angular/core';
import { select as d3_select, arc as d3_arc, interpolate as d3_interpolate, format as d3_format } from 'd3';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1nYXVnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2RhdGF2aXovZGF0YXZpei1nYXVnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBRTVHLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBRTVHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR3ZEO0lBNERFLG1DQUFvQixRQUE0QixFQUFVLFFBQW9CO1FBQTlFLGlCQUFrRjtRQUE5RCxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVk7UUEzQzlFLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsZUFBVSxHQUFHLElBQUksQ0FBQztRQU1sQixVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osU0FBSSxHQUF3QyxVQUFVLENBQUM7UUFHdkQsVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUdsQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBR2xCLHNCQUFpQixHQUFHLEVBQUUsQ0FBQztRQU12QixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBa0VoQixxQkFBZ0I7Ozs7UUFBRyxVQUFBLE1BQU07WUFDdkIsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2xDLENBQUMsRUFBQztRQUVGLG9CQUFlOzs7UUFBRzs7Z0JBQ1YsVUFBVSxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSSxDQUFDLElBQUks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d0JBQXdCO3VCQUdwQyxLQUFLO3dCQUdMLEtBQUs7dUJBR0wsS0FBSzt3QkFHTCxLQUFLOzRCQUdMLEtBQUs7b0NBR0wsS0FBSzs4QkFHTCxLQUFLOzZCQUdMLEtBQUs7O0lBd0xSLGdDQUFDO0NBQUEsQUFuT0QsSUFtT0M7U0FwTlkseUJBQXlCOzs7SUFDcEMsK0NBQ2tCOztJQUVsQiwrQ0FDa0I7O0lBRWxCLHlDQUN1Qjs7SUFFdkIsMENBQ1k7O0lBRVoseUNBQ3VEOztJQUV2RCwwQ0FDa0I7O0lBRWxCLDhDQUNrQjs7SUFFbEIsc0RBQ3VCOztJQUV2QixnREFDWTs7SUFFWiwrQ0FDZ0I7Ozs7O0lBRWhCLDBDQUFjOzs7OztJQUNkLHdDQUFZOzs7OztJQUNaLDBDQUFjOzs7OztJQUNkLCtDQUFtQjs7SUFDbkIsMENBQWE7Ozs7O0lBQ2IsK0NBQW1COzs7OztJQUNuQiw2Q0FBaUI7Ozs7O0lBQ2pCLDJDQUFlOzs7OztJQUNmLHdDQUFZOzs7OztJQUNaLGdEQUFvQjs7Ozs7SUFDcEIsNkNBQWlCOzs7OztJQUNqQiwyQ0FBZTs7Ozs7SUFDZiw0Q0FBZ0I7O0lBb0RoQixxREFFRTs7SUFFRixvREFJRTs7SUFFRixtREFVRTs7SUFFRiw4Q0F5Q0U7O0lBRUYsZ0RBZUU7O0lBRUYsNkNBaUJFOztJQUVGLDhDQWVFOzs7OztJQXRLVSw2Q0FBb0M7Ozs7O0lBQUUsNkNBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBFbGVtZW50UmVmLCBIb3N0QmluZGluZywgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QsIGFyYyBhcyBkM19hcmMsIGludGVycG9sYXRlIGFzIGQzX2ludGVycG9sYXRlLCBmb3JtYXQgYXMgZDNfZm9ybWF0IH0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekdhdWdlIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotZ2F1Z2UnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgICpuZ0lmPVwiIWhpZGVMYWJlbFwiXG4gICAgICBjbGFzcz1cImdhdWdlLWRldGFpbHNcIlxuICAgICAgW25nQ2xhc3NdPVwieyBoYWxmbW9vbjogdHlwZSA9PT0gJ2hhbGZtb29uJywgJ2dhdWdlLWRldGFpbHMtc21hbGwnOiB0eXBlID09PSAnaGFsZm1vb24nIH1cIlxuICAgICAgW25nU3R5bGVdPVwieyAnbWF4LXdpZHRoLnB4Jzogd2lkdGggLSAzICogZ2F1Z2VXaWR0aCB9XCJcbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzPVwiZ2F1Z2UtbnVtYmVyXCI+e3sgbGFiZWwgfX08L2Rpdj5cbiAgICAgIDxkaXYgKm5nSWY9XCJkZXNjcmlwdGlvblwiIGNsYXNzPVwiZ2F1Z2UtZGVzY3JpcHRpb24gdGV4dC1jZW50ZXJcIj57eyBkZXNjcmlwdGlvbiB9fTwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6R2F1Z2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1nYXVnZScpXG4gIGdhdWdlQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IFBiZHNEYXRhdml6R2F1Z2U7XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSAzMDA7XG5cbiAgQElucHV0KClcbiAgdHlwZTogJ2hhbGZtb29uJyB8ICdob3JzZXNob2UnIHwgJ2NpcmNsZScgPSAnaGFsZm1vb24nO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yID0gJyNFMjNEQTgnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMYWJlbCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxhYmVsRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgZGVzY3JpcHRpb247XG5cbiAgQElucHV0KClcbiAgZ2F1Z2VXaWR0aCA9IDIwO1xuXG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIGdhdWdlO1xuICBwcml2YXRlIGxhYmVsVHdlZW47XG4gIHB1YmxpYyBsYWJlbDtcbiAgcHJpdmF0ZSBzdGFydEFuZ2xlO1xuICBwcml2YXRlIGVuZEFuZ2xlO1xuICBwcml2YXRlIHJhZGl1cztcbiAgcHJpdmF0ZSBhcmM7XG4gIHByaXZhdGUgbGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgb2xkVmFsdWU7XG4gIHByaXZhdGUgaGVpZ2h0O1xuICBwcml2YXRlIHJvdW5kZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGF0YXZpejogUGJkc0RhdGF2aXpTZXJ2aWNlLCBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy53aWR0aDtcbiAgICB0aGlzLnJhZGl1cyA9IE1hdGgubWF4KHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KSAvIDI7XG4gICAgdGhpcy5sYWJlbEZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLmxhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxhYmVsID0gdGhpcy5sYWJlbEZvcm1hdCh0aGlzLmRhdGEudmFsdWUpO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2hhbGZtb29uJzpcbiAgICAgICAgdGhpcy5zdGFydEFuZ2xlID0gLTkwO1xuICAgICAgICB0aGlzLmVuZEFuZ2xlID0gOTA7XG4gICAgICAgIHRoaXMucm91bmRlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdob3JzZXNob2UnOlxuICAgICAgICB0aGlzLnN0YXJ0QW5nbGUgPSAtMTQwO1xuICAgICAgICB0aGlzLmVuZEFuZ2xlID0gMTQwO1xuICAgICAgICB0aGlzLnJvdW5kZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgdGhpcy5zdGFydEFuZ2xlID0gMDtcbiAgICAgICAgdGhpcy5lbmRBbmdsZSA9IDM2MDtcbiAgICAgICAgdGhpcy5yb3VuZGVkID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuYXJjID0gZDNfYXJjKCkuY29ybmVyUmFkaXVzKHRoaXMucm91bmRlZCA/IHRoaXMuZ2F1Z2VXaWR0aCA6IDApO1xuXG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBgLSR7dGhpcy53aWR0aCAvIDJ9IC0ke3RoaXMuaGVpZ2h0IC8gMn0gJHt0aGlzLndpZHRofSAke3RoaXMuaGVpZ2h0fWApO1xuXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMub2xkVmFsdWUgPSBjaGFuZ2VzLmRhdGEucHJldmlvdXNWYWx1ZS52YWx1ZTtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICBkZWdyZWVzVG9SYWRpYW5zID0gZGVncmVlID0+IHtcbiAgICByZXR1cm4gKGRlZ3JlZSAqIE1hdGguUEkpIC8gMTgwO1xuICB9O1xuXG4gIGNhbGN1bGF0ZU1pbk1heCA9ICgpID0+IHtcbiAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5kYXRhLm1pbnZhbHVlIC8gKHRoaXMuZGF0YS5tYXh2YWx1ZSAtIHRoaXMuZGF0YS5taW52YWx1ZSk7XG5cbiAgICByZXR1cm4gcGVyY2VudGFnZSAqICh0aGlzLmRhdGEudmFsdWUgLSB0aGlzLmRhdGEubWludmFsdWUpICsgKHRoaXMuZGF0YS52YWx1ZSAtIHRoaXMuZGF0YS5taW52YWx1ZSk7XG4gIH07XG5cbiAgY2FsY3VsYXRlQ3VydmUgPSBkYXRhID0+IHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuZGVncmVlc1RvUmFkaWFucyh0aGlzLnN0YXJ0QW5nbGUpO1xuICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgKGRhdGEgKiAodGhpcy5kZWdyZWVzVG9SYWRpYW5zKHRoaXMuZW5kQW5nbGUpIC0gc3RhcnQpKSAvIHRoaXMuZGF0YS5tYXh2YWx1ZTtcblxuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIHN0YXJ0QW5nbGU6IHN0YXJ0LFxuICAgICAgICBlbmRBbmdsZTogZW5kXG4gICAgICB9XG4gICAgXTtcbiAgfTtcblxuICBkcmF3Q2hhcnQgPSAoKSA9PiB7XG4gICAgdGhpcy5nYXVnZSA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2dhdWdlLWdyb3VwJyk7XG5cbiAgICAvLyBiYWNrZ3JvdW5kIGFyY1xuICAgIHRoaXMuZ2F1Z2VcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy5jYWxjdWxhdGVDdXJ2ZSh0aGlzLmRhdGEubWF4dmFsdWUpKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dhdWdlLWJhY2tncm91bmQnKVxuICAgICAgLmF0dHIoJ2QnLCBkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJjKHtcbiAgICAgICAgICBpbm5lclJhZGl1czogdGhpcy5yYWRpdXMgLSB0aGlzLmdhdWdlV2lkdGgsXG4gICAgICAgICAgb3V0ZXJSYWRpdXM6IHRoaXMucmFkaXVzLFxuICAgICAgICAgIHN0YXJ0QW5nbGU6IGQuc3RhcnRBbmdsZSxcbiAgICAgICAgICBlbmRBbmdsZTogZC5lbmRBbmdsZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgLy8gdmFsdWUgYXJjXG4gICAgdGhpcy5nYXVnZVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuZGF0YSh0aGlzLmNhbGN1bGF0ZUN1cnZlKHRoaXMuY2FsY3VsYXRlTWluTWF4KCkpKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dhdWdlLXZhbHVlJylcbiAgICAgIC5hdHRyKCdmaWxsJywgdGhpcy5jb2xvcilcbiAgICAgIC5hdHRyKCdkJywgZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyYyh7XG4gICAgICAgICAgaW5uZXJSYWRpdXM6IHRoaXMucmFkaXVzIC0gdGhpcy5nYXVnZVdpZHRoLFxuICAgICAgICAgIG91dGVyUmFkaXVzOiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICBzdGFydEFuZ2xlOiBkLnN0YXJ0QW5nbGUsXG4gICAgICAgICAgZW5kQW5nbGU6IGQuZW5kQW5nbGVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdob3JzZXNob2UnOlxuICAgICAgICB0aGlzLnN2Zy5hdHRyKCdoZWlnaHQnLCAyMzApLmF0dHIoJ3ZpZXdCb3gnLCBgLSR7dGhpcy53aWR0aCAvIDJ9IC0ke3RoaXMuaGVpZ2h0IC8gMn0gJHt0aGlzLmhlaWdodH0gMjMwYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaGFsZm1vb24nOlxuICAgICAgICB0aGlzLnN2Zy5hdHRyKCdoZWlnaHQnLCB0aGlzLndpZHRoIC8gMik7XG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoJ3ZpZXdCb3gnLCBgLSR7dGhpcy53aWR0aCAvIDJ9IC0ke3RoaXMud2lkdGggLyAyfSAke3RoaXMud2lkdGh9ICR7dGhpcy53aWR0aCAvIDJ9YCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICB1cGRhdGVDaGFydCA9ICgpID0+IHtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuc3ZnLnNlbGVjdCgnLmdhdWdlLWdyb3VwJyk7XG5cbiAgICBncm91cFxuICAgICAgLnNlbGVjdCgnLmdhdWdlLXZhbHVlJylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbig3NTApXG4gICAgICAuY2FsbCh0aGlzLmFyY1R3ZWVuLCB0aGlzLmNhbGN1bGF0ZU1pbk1heCgpKTtcblxuICAgIHRoaXMubGFiZWxUd2VlbiA9IHRoaXMuY2hhcnQuc2VsZWN0KCcuZ2F1Z2UtbnVtYmVyJyk7XG5cbiAgICB0aGlzLmxhYmVsVHdlZW5cbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbig3NTApXG4gICAgICAuY2FsbCh0aGlzLnRleHRUd2VlbiwgdGhpcy5kYXRhLnZhbHVlKTtcbiAgfTtcblxuICBhcmNUd2VlbiA9ICh0cmFuc2l0aW9uLCB2YWx1ZSkgPT4ge1xuICAgIGNvbnN0IG5ld0FuZ2xlID0gdGhpcy5jYWxjdWxhdGVDdXJ2ZSh2YWx1ZSk7XG5cbiAgICB0cmFuc2l0aW9uLmF0dHJUd2VlbignZCcsIGQgPT4ge1xuICAgICAgY29uc3QgaW50ZXJwb2xhdGUgPSBkM19pbnRlcnBvbGF0ZShkLmVuZEFuZ2xlLCBuZXdBbmdsZVswXS5lbmRBbmdsZSk7XG5cbiAgICAgIHJldHVybiB0ID0+IHtcbiAgICAgICAgZC5lbmRBbmdsZSA9IGludGVycG9sYXRlKHQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFyYyh7XG4gICAgICAgICAgaW5uZXJSYWRpdXM6IHRoaXMucmFkaXVzIC0gdGhpcy5nYXVnZVdpZHRoLFxuICAgICAgICAgIG91dGVyUmFkaXVzOiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICBzdGFydEFuZ2xlOiBkLnN0YXJ0QW5nbGUsXG4gICAgICAgICAgZW5kQW5nbGU6IGQuZW5kQW5nbGVcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIHRleHRUd2VlbiA9ICh0cmFuc2l0aW9uLCB2YWx1ZSkgPT4ge1xuICAgIHZhbHVlID0gZDNfZm9ybWF0KCcuNGYnKSh2YWx1ZSk7XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8sL2csICcuJyk7XG5cbiAgICB0cmFuc2l0aW9uLnR3ZWVuKCd0ZXh0JywgKCkgPT4ge1xuICAgICAgY29uc3QgaW50ZXJwb2xhdGUgPSBkM19pbnRlcnBvbGF0ZShkM19mb3JtYXQoJy40ZicpKCt0aGlzLm9sZFZhbHVlKSwgdmFsdWUpO1xuXG4gICAgICByZXR1cm4gdCA9PiB7XG4gICAgICAgIHRoaXMubGFiZWxUd2Vlbi50ZXh0KGQgPT4ge1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWROdW1iZXIgPSB0aGlzLmxhYmVsRm9ybWF0KGludGVycG9sYXRlKHQpKTtcbiAgICAgICAgICB0aGlzLmxhYmVsID0gdXBkYXRlZE51bWJlcjtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlZE51bWJlcjtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xufVxuIl19
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ElementRef, HostBinding } from '@angular/core';
import { select as d3_select, arc as d3_arc, interpolate as d3_interpolate, format as d3_format } from 'd3';
import { PbdsDatavizService } from './dataviz.service';
export class PbdsDatavizGaugeComponent {
    /**
     * @param {?} _dataviz
     * @param {?} _element
     */
    constructor(_dataviz, _element) {
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
        degree => {
            return (degree * Math.PI) / 180;
        });
        this.calculateMinMax = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const percentage = this.data.minvalue / (this.data.maxvalue - this.data.minvalue);
            return percentage * (this.data.value - this.data.minvalue) + (this.data.value - this.data.minvalue);
        });
        this.calculateCurve = (/**
         * @param {?} data
         * @return {?}
         */
        data => {
            /** @type {?} */
            const start = this.degreesToRadians(this.startAngle);
            /** @type {?} */
            const end = start + (data * (this.degreesToRadians(this.endAngle) - start)) / this.data.maxvalue;
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
        () => {
            this.gauge = this.svg.append('g').attr('class', 'gauge-group');
            // background arc
            /** @type {?} */
            const background = this.gauge
                .append('path')
                .data(this.calculateCurve(this.data.maxvalue))
                .attr('class', 'gauge-background')
                .attr('fill', this.backgroundColor)
                .attr('d', (/**
             * @param {?} d
             * @return {?}
             */
            d => {
                return this.arc({
                    innerRadius: this.radius - this.gaugeWidth,
                    outerRadius: this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            }));
            // value arc
            this.gauge
                .append('path')
                .data(this.calculateCurve(this.calculateMinMax()))
                .attr('class', 'gauge-value')
                .attr('fill', this.color)
                .attr('d', (/**
             * @param {?} d
             * @return {?}
             */
            d => {
                return this.arc({
                    innerRadius: this.radius - this.gaugeWidth,
                    outerRadius: this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            }));
            switch (this.type) {
                case 'horseshoe':
                    this.svg.attr('height', 230).attr('viewBox', `-${this.width / 2} -${this.height / 2} ${this.height} 230`);
                    break;
                case 'halfmoon':
                    this.svg.attr('height', this.width / 2);
                    this.svg.attr('viewBox', `-${this.width / 2} -${this.width / 2} ${this.width} ${this.width / 2}`);
                    break;
            }
        });
        this.updateChart = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            let group = this.svg.select('.gauge-group');
            group
                .select('.gauge-value')
                .transition()
                .duration(750)
                .call(this.arcTween, this.calculateMinMax());
            this.labelTween = this.chart.select('.gauge-number');
            this.labelTween
                .transition()
                .duration(750)
                .call(this.textTween, this.data.value);
        });
        this.arcTween = (/**
         * @param {?} transition
         * @param {?} value
         * @return {?}
         */
        (transition, value) => {
            /** @type {?} */
            let newAngle = this.calculateCurve(value);
            transition.attrTween('d', (/**
             * @param {?} d
             * @return {?}
             */
            d => {
                /** @type {?} */
                let interpolate = d3_interpolate(d.endAngle, newAngle[0].endAngle);
                return (/**
                 * @param {?} t
                 * @return {?}
                 */
                t => {
                    d.endAngle = interpolate(t);
                    return this.arc({
                        innerRadius: this.radius - this.gaugeWidth,
                        outerRadius: this.radius,
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
        (transition, value) => {
            value = d3_format('.2f')(value); // TODO: check these .1f formats here, should they be inputs?
            value = value.replace(/,/g, '.');
            transition.tween('text', (/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                let interpolate = d3_interpolate(d3_format('.2f')(+this.oldValue), value);
                return (/**
                 * @param {?} t
                 * @return {?}
                 */
                t => {
                    this.labelTween.text((/**
                     * @param {?} d
                     * @return {?}
                     */
                    d => {
                        /** @type {?} */
                        let updatedNumber = this.labelFormat(interpolate(t));
                        this.label = updatedNumber;
                        return updatedNumber;
                    }));
                });
            }));
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.height = this.width;
        this.radius = Math.max(this.width, this.height) / 2;
        this.labelFormat = d3_format(this.labelFormatString);
        this.backgroundColor = '#F0F0F0';
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
            .attr('class', 'img-fluid') // to resize chart
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`);
        this.drawChart();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            // console.log(changes.data.previousValue.value, changes.data.currentValue.value);
            this.oldValue = changes.data.previousValue.value;
            this.updateChart();
        }
    }
}
PbdsDatavizGaugeComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-gauge',
                template: `
    <div
      *ngIf="!hideLabel"
      class="gauge-details"
      [ngClass]="{ halfmoon: type === 'halfmoon', 'gauge-details-small': type === 'halfmoon' }"
      [ngStyle]="{ 'max-width.px': width - 3 * gaugeWidth }"
    >
      <div class="gauge-number">{{ label }}</div>
      <div *ngIf="description" class="gauge-description text-center">{{ description }}</div>
    </div>
  `
            }] }
];
/** @nocollapse */
PbdsDatavizGaugeComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef }
];
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
    PbdsDatavizGaugeComponent.prototype.backgroundColor;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1nYXVnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2RhdGF2aXovZGF0YXZpei1nYXVnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBRTVHLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBRTVHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBa0J2RCxNQUFNLE9BQU8seUJBQXlCOzs7OztJQThDcEMsWUFBb0IsUUFBNEIsRUFBVSxRQUFvQjtRQUExRCxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVk7UUE1QzlFLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsZUFBVSxHQUFHLElBQUksQ0FBQztRQU1sQixVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osU0FBSSxHQUF3QyxVQUFVLENBQUM7UUFHdkQsVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUdsQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBR2xCLHNCQUFpQixHQUFHLEVBQUUsQ0FBQztRQU12QixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBc0VoQixxQkFBZ0I7Ozs7UUFBRyxNQUFNLENBQUMsRUFBRTtZQUMxQixPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDbEMsQ0FBQyxFQUFDO1FBRUYsb0JBQWU7OztRQUFHLEdBQUcsRUFBRTs7a0JBQ2YsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxH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LElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQ2pELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7OztZQWhIRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsUUFBUSxFQUFFOzs7Ozs7Ozs7O0dBVVQ7YUFFRjs7OztZQWpCUSxrQkFBa0I7WUFKUSxVQUFVOzs7eUJBdUIxQyxXQUFXLFNBQUMsa0JBQWtCO3lCQUc5QixXQUFXLFNBQUMsd0JBQXdCO21CQUdwQyxLQUFLO29CQUdMLEtBQUs7bUJBR0wsS0FBSztvQkFHTCxLQUFLO3dCQUdMLEtBQUs7Z0NBR0wsS0FBSzswQkFHTCxLQUFLO3lCQUdMLEtBQUs7Ozs7SUEzQk4sK0NBQ2tCOztJQUVsQiwrQ0FDa0I7O0lBRWxCLHlDQUN1Qjs7SUFFdkIsMENBQ1k7O0lBRVoseUNBQ3VEOztJQUV2RCwwQ0FDa0I7O0lBRWxCLDhDQUNrQjs7SUFFbEIsc0RBQ3VCOztJQUV2QixnREFDWTs7SUFFWiwrQ0FDZ0I7Ozs7O0lBRWhCLDBDQUFjOzs7OztJQUNkLHdDQUFZOzs7OztJQUNaLDBDQUFjOzs7OztJQUNkLCtDQUFtQjs7SUFDbkIsMENBQWE7Ozs7O0lBQ2IsK0NBQW1COzs7OztJQUNuQiw2Q0FBaUI7Ozs7O0lBQ2pCLDJDQUFlOzs7OztJQUNmLG9EQUF3Qjs7Ozs7SUFDeEIsd0NBQVk7Ozs7O0lBQ1osZ0RBQW9COzs7OztJQUNwQiw2Q0FBaUI7Ozs7O0lBQ2pCLDJDQUFlOzs7OztJQUNmLDRDQUFnQjs7SUF1RGhCLHFEQUVFOztJQUVGLG9EQUlFOztJQUVGLG1EQVVFOztJQUVGLDhDQTBDRTs7SUFFRixnREFlRTs7SUFFRiw2Q0FpQkU7O0lBRUYsOENBZUU7Ozs7O0lBMUtVLDZDQUFvQzs7Ozs7SUFBRSw2Q0FBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCwgYXJjIGFzIGQzX2FyYywgaW50ZXJwb2xhdGUgYXMgZDNfaW50ZXJwb2xhdGUsIGZvcm1hdCBhcyBkM19mb3JtYXQgfSBmcm9tICdkMyc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6R2F1Z2UgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1nYXVnZScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgKm5nSWY9XCIhaGlkZUxhYmVsXCJcbiAgICAgIGNsYXNzPVwiZ2F1Z2UtZGV0YWlsc1wiXG4gICAgICBbbmdDbGFzc109XCJ7IGhhbGZtb29uOiB0eXBlID09PSAnaGFsZm1vb24nLCAnZ2F1Z2UtZGV0YWlscy1zbWFsbCc6IHR5cGUgPT09ICdoYWxmbW9vbicgfVwiXG4gICAgICBbbmdTdHlsZV09XCJ7ICdtYXgtd2lkdGgucHgnOiB3aWR0aCAtIDMgKiBnYXVnZVdpZHRoIH1cIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJnYXVnZS1udW1iZXJcIj57eyBsYWJlbCB9fTwvZGl2PlxuICAgICAgPGRpdiAqbmdJZj1cImRlc2NyaXB0aW9uXCIgY2xhc3M9XCJnYXVnZS1kZXNjcmlwdGlvbiB0ZXh0LWNlbnRlclwiPnt7IGRlc2NyaXB0aW9uIH19PC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpHYXVnZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWdhdWdlJylcbiAgZ2F1Z2VDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogUGJkc0RhdGF2aXpHYXVnZTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnaGFsZm1vb24nIHwgJ2hvcnNlc2hvZScgfCAnY2lyY2xlJyA9ICdoYWxmbW9vbic7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI0UyM0RBOCc7XG5cbiAgQElucHV0KClcbiAgaGlkZUxhYmVsID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBkZXNjcmlwdGlvbjtcblxuICBASW5wdXQoKVxuICBnYXVnZVdpZHRoID0gMjA7XG5cbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgZ2F1Z2U7XG4gIHByaXZhdGUgbGFiZWxUd2VlbjsgLy8gVE9ETzogcmVuYW1lIHRoaXNcbiAgcHVibGljIGxhYmVsO1xuICBwcml2YXRlIHN0YXJ0QW5nbGU7XG4gIHByaXZhdGUgZW5kQW5nbGU7XG4gIHByaXZhdGUgcmFkaXVzO1xuICBwcml2YXRlIGJhY2tncm91bmRDb2xvcjsgLy8gVE9ETzogc2hvdWxkIHRoaXMgYmUgYW4gaW5wdXQ/XG4gIHByaXZhdGUgYXJjO1xuICBwcml2YXRlIGxhYmVsRm9ybWF0O1xuICBwcml2YXRlIG9sZFZhbHVlO1xuICBwcml2YXRlIGhlaWdodDtcbiAgcHJpdmF0ZSByb3VuZGVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5yYWRpdXMgPSBNYXRoLm1heCh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCkgLyAyO1xuICAgIHRoaXMubGFiZWxGb3JtYXQgPSBkM19mb3JtYXQodGhpcy5sYWJlbEZvcm1hdFN0cmluZyk7XG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSAnI0YwRjBGMCc7XG4gICAgdGhpcy5sYWJlbCA9IHRoaXMubGFiZWxGb3JtYXQodGhpcy5kYXRhLnZhbHVlKTtcblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdoYWxmbW9vbic6XG4gICAgICAgIHRoaXMuc3RhcnRBbmdsZSA9IC05MDtcbiAgICAgICAgdGhpcy5lbmRBbmdsZSA9IDkwO1xuICAgICAgICB0aGlzLnJvdW5kZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnaG9yc2VzaG9lJzpcbiAgICAgICAgdGhpcy5zdGFydEFuZ2xlID0gLTE0MDtcbiAgICAgICAgdGhpcy5lbmRBbmdsZSA9IDE0MDtcbiAgICAgICAgdGhpcy5yb3VuZGVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgICAgIHRoaXMuc3RhcnRBbmdsZSA9IDA7XG4gICAgICAgIHRoaXMuZW5kQW5nbGUgPSAzNjA7XG4gICAgICAgIHRoaXMucm91bmRlZCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLmFyYyA9IGQzX2FyYygpLmNvcm5lclJhZGl1cyh0aGlzLnJvdW5kZWQgPyB0aGlzLmdhdWdlV2lkdGggOiAwKTtcblxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICB0aGlzLnN2ZyA9IHRoaXMuY2hhcnRcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCB0aGlzLndpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpIC8vIHRvIHJlc2l6ZSBjaGFydFxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cigndmlld0JveCcsIGAtJHt0aGlzLndpZHRoIC8gMn0gLSR7dGhpcy5oZWlnaHQgLyAyfSAke3RoaXMud2lkdGh9ICR7dGhpcy5oZWlnaHR9YCk7XG5cbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgLy8gY29uc29sZS5sb2coY2hhbmdlcy5kYXRhLnByZXZpb3VzVmFsdWUudmFsdWUsIGNoYW5nZXMuZGF0YS5jdXJyZW50VmFsdWUudmFsdWUpO1xuXG4gICAgICB0aGlzLm9sZFZhbHVlID0gY2hhbmdlcy5kYXRhLnByZXZpb3VzVmFsdWUudmFsdWU7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgZGVncmVlc1RvUmFkaWFucyA9IGRlZ3JlZSA9PiB7XG4gICAgcmV0dXJuIChkZWdyZWUgKiBNYXRoLlBJKSAvIDE4MDtcbiAgfTtcblxuICBjYWxjdWxhdGVNaW5NYXggPSAoKSA9PiB7XG4gICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuZGF0YS5taW52YWx1ZSAvICh0aGlzLmRhdGEubWF4dmFsdWUgLSB0aGlzLmRhdGEubWludmFsdWUpO1xuXG4gICAgcmV0dXJuIHBlcmNlbnRhZ2UgKiAodGhpcy5kYXRhLnZhbHVlIC0gdGhpcy5kYXRhLm1pbnZhbHVlKSArICh0aGlzLmRhdGEudmFsdWUgLSB0aGlzLmRhdGEubWludmFsdWUpO1xuICB9O1xuXG4gIGNhbGN1bGF0ZUN1cnZlID0gZGF0YSA9PiB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmRlZ3JlZXNUb1JhZGlhbnModGhpcy5zdGFydEFuZ2xlKTtcbiAgICBjb25zdCBlbmQgPSBzdGFydCArIChkYXRhICogKHRoaXMuZGVncmVlc1RvUmFkaWFucyh0aGlzLmVuZEFuZ2xlKSAtIHN0YXJ0KSkgLyB0aGlzLmRhdGEubWF4dmFsdWU7XG5cbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBzdGFydEFuZ2xlOiBzdGFydCxcbiAgICAgICAgZW5kQW5nbGU6IGVuZFxuICAgICAgfVxuICAgIF07XG4gIH07XG5cbiAgZHJhd0NoYXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMuZ2F1Z2UgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdnYXVnZS1ncm91cCcpO1xuXG4gICAgLy8gYmFja2dyb3VuZCBhcmNcbiAgICBjb25zdCBiYWNrZ3JvdW5kID0gdGhpcy5nYXVnZVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuZGF0YSh0aGlzLmNhbGN1bGF0ZUN1cnZlKHRoaXMuZGF0YS5tYXh2YWx1ZSkpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZ2F1Z2UtYmFja2dyb3VuZCcpXG4gICAgICAuYXR0cignZmlsbCcsIHRoaXMuYmFja2dyb3VuZENvbG9yKVxuICAgICAgLmF0dHIoJ2QnLCBkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJjKHtcbiAgICAgICAgICBpbm5lclJhZGl1czogdGhpcy5yYWRpdXMgLSB0aGlzLmdhdWdlV2lkdGgsXG4gICAgICAgICAgb3V0ZXJSYWRpdXM6IHRoaXMucmFkaXVzLFxuICAgICAgICAgIHN0YXJ0QW5nbGU6IGQuc3RhcnRBbmdsZSxcbiAgICAgICAgICBlbmRBbmdsZTogZC5lbmRBbmdsZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgLy8gdmFsdWUgYXJjXG4gICAgdGhpcy5nYXVnZVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuZGF0YSh0aGlzLmNhbGN1bGF0ZUN1cnZlKHRoaXMuY2FsY3VsYXRlTWluTWF4KCkpKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dhdWdlLXZhbHVlJylcbiAgICAgIC5hdHRyKCdmaWxsJywgdGhpcy5jb2xvcilcbiAgICAgIC5hdHRyKCdkJywgZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyYyh7XG4gICAgICAgICAgaW5uZXJSYWRpdXM6IHRoaXMucmFkaXVzIC0gdGhpcy5nYXVnZVdpZHRoLFxuICAgICAgICAgIG91dGVyUmFkaXVzOiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICBzdGFydEFuZ2xlOiBkLnN0YXJ0QW5nbGUsXG4gICAgICAgICAgZW5kQW5nbGU6IGQuZW5kQW5nbGVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdob3JzZXNob2UnOlxuICAgICAgICB0aGlzLnN2Zy5hdHRyKCdoZWlnaHQnLCAyMzApLmF0dHIoJ3ZpZXdCb3gnLCBgLSR7dGhpcy53aWR0aCAvIDJ9IC0ke3RoaXMuaGVpZ2h0IC8gMn0gJHt0aGlzLmhlaWdodH0gMjMwYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaGFsZm1vb24nOlxuICAgICAgICB0aGlzLnN2Zy5hdHRyKCdoZWlnaHQnLCB0aGlzLndpZHRoIC8gMik7XG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoJ3ZpZXdCb3gnLCBgLSR7dGhpcy53aWR0aCAvIDJ9IC0ke3RoaXMud2lkdGggLyAyfSAke3RoaXMud2lkdGh9ICR7dGhpcy53aWR0aCAvIDJ9YCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICB1cGRhdGVDaGFydCA9ICgpID0+IHtcbiAgICBsZXQgZ3JvdXAgPSB0aGlzLnN2Zy5zZWxlY3QoJy5nYXVnZS1ncm91cCcpO1xuXG4gICAgZ3JvdXBcbiAgICAgIC5zZWxlY3QoJy5nYXVnZS12YWx1ZScpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oNzUwKVxuICAgICAgLmNhbGwodGhpcy5hcmNUd2VlbiwgdGhpcy5jYWxjdWxhdGVNaW5NYXgoKSk7XG5cbiAgICB0aGlzLmxhYmVsVHdlZW4gPSB0aGlzLmNoYXJ0LnNlbGVjdCgnLmdhdWdlLW51bWJlcicpO1xuXG4gICAgdGhpcy5sYWJlbFR3ZWVuXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oNzUwKVxuICAgICAgLmNhbGwodGhpcy50ZXh0VHdlZW4sIHRoaXMuZGF0YS52YWx1ZSk7XG4gIH07XG5cbiAgYXJjVHdlZW4gPSAodHJhbnNpdGlvbiwgdmFsdWUpID0+IHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmNhbGN1bGF0ZUN1cnZlKHZhbHVlKTtcblxuICAgIHRyYW5zaXRpb24uYXR0clR3ZWVuKCdkJywgZCA9PiB7XG4gICAgICBsZXQgaW50ZXJwb2xhdGUgPSBkM19pbnRlcnBvbGF0ZShkLmVuZEFuZ2xlLCBuZXdBbmdsZVswXS5lbmRBbmdsZSk7XG5cbiAgICAgIHJldHVybiB0ID0+IHtcbiAgICAgICAgZC5lbmRBbmdsZSA9IGludGVycG9sYXRlKHQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFyYyh7XG4gICAgICAgICAgaW5uZXJSYWRpdXM6IHRoaXMucmFkaXVzIC0gdGhpcy5nYXVnZVdpZHRoLFxuICAgICAgICAgIG91dGVyUmFkaXVzOiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICBzdGFydEFuZ2xlOiBkLnN0YXJ0QW5nbGUsXG4gICAgICAgICAgZW5kQW5nbGU6IGQuZW5kQW5nbGVcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIHRleHRUd2VlbiA9ICh0cmFuc2l0aW9uLCB2YWx1ZSkgPT4ge1xuICAgIHZhbHVlID0gZDNfZm9ybWF0KCcuMmYnKSh2YWx1ZSk7IC8vIFRPRE86IGNoZWNrIHRoZXNlIC4xZiBmb3JtYXRzIGhlcmUsIHNob3VsZCB0aGV5IGJlIGlucHV0cz9cbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLywvZywgJy4nKTtcblxuICAgIHRyYW5zaXRpb24udHdlZW4oJ3RleHQnLCAoKSA9PiB7XG4gICAgICBsZXQgaW50ZXJwb2xhdGUgPSBkM19pbnRlcnBvbGF0ZShkM19mb3JtYXQoJy4yZicpKCt0aGlzLm9sZFZhbHVlKSwgdmFsdWUpO1xuXG4gICAgICByZXR1cm4gdCA9PiB7XG4gICAgICAgIHRoaXMubGFiZWxUd2Vlbi50ZXh0KGQgPT4ge1xuICAgICAgICAgIGxldCB1cGRhdGVkTnVtYmVyID0gdGhpcy5sYWJlbEZvcm1hdChpbnRlcnBvbGF0ZSh0KSk7XG4gICAgICAgICAgdGhpcy5sYWJlbCA9IHVwZGF0ZWROdW1iZXI7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZWROdW1iZXI7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcbn1cbiJdfQ==
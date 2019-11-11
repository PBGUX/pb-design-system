/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, HostBinding } from '@angular/core';
var PbdsDatavizMetricIndicatorComponent = /** @class */ (function () {
    function PbdsDatavizMetricIndicatorComponent() {
        this.value = 0;
        this.class = '';
        this.indicator = 'flat';
        this.inverse = false;
    }
    Object.defineProperty(PbdsDatavizMetricIndicatorComponent.prototype, "hostClasses", {
        get: /**
         * @return {?}
         */
        function () {
            return ['metric-block-indicator', this.indicator, this.inverse ? 'inverse' : '', this.class].join(' ');
        },
        enumerable: true,
        configurable: true
    });
    PbdsDatavizMetricIndicatorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-metric-indicator',
                    template: "\n    <span>{{ value }}</span>\n  "
                }] }
    ];
    PbdsDatavizMetricIndicatorComponent.propDecorators = {
        value: [{ type: Input }],
        class: [{ type: Input }],
        indicator: [{ type: Input }],
        inverse: [{ type: Input }],
        hostClasses: [{ type: HostBinding, args: ['class',] }]
    };
    return PbdsDatavizMetricIndicatorComponent;
}());
export { PbdsDatavizMetricIndicatorComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizMetricIndicatorComponent.prototype.value;
    /** @type {?} */
    PbdsDatavizMetricIndicatorComponent.prototype.class;
    /** @type {?} */
    PbdsDatavizMetricIndicatorComponent.prototype.indicator;
    /** @type {?} */
    PbdsDatavizMetricIndicatorComponent.prototype.inverse;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQ7SUFBQTtRQVNFLFVBQUssR0FBRyxDQUFDLENBQUM7UUFHVixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBR1gsY0FBUyxHQUFxQyxNQUFNLENBQUM7UUFHckQsWUFBTyxHQUFHLEtBQUssQ0FBQztJQU1sQixDQUFDO0lBSkMsc0JBQ0ksNERBQVc7Ozs7UUFEZjtZQUVFLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekcsQ0FBQzs7O09BQUE7O2dCQXZCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLCtCQUErQjtvQkFDekMsUUFBUSxFQUFFLG9DQUVUO2lCQUVGOzs7d0JBRUUsS0FBSzt3QkFHTCxLQUFLOzRCQUdMLEtBQUs7MEJBR0wsS0FBSzs4QkFHTCxXQUFXLFNBQUMsT0FBTzs7SUFJdEIsMENBQUM7Q0FBQSxBQXhCRCxJQXdCQztTQWpCWSxtQ0FBbUM7OztJQUM5QyxvREFDVTs7SUFFVixvREFDVzs7SUFFWCx3REFDcUQ7O0lBRXJELHNEQUNnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3Bhbj57eyB2YWx1ZSB9fTwvc3Bhbj5cbiAgYCxcbiAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHZhbHVlID0gMDtcblxuICBASW5wdXQoKVxuICBjbGFzcyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGluZGljYXRvcjogJ2ZsYXQnIHwgJ2luY3JlYXNlJyB8ICdkZWNyZWFzZScgPSAnZmxhdCc7XG5cbiAgQElucHV0KClcbiAgaW52ZXJzZSA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgaG9zdENsYXNzZXMoKSB7XG4gICAgcmV0dXJuIFsnbWV0cmljLWJsb2NrLWluZGljYXRvcicsIHRoaXMuaW5kaWNhdG9yLCB0aGlzLmludmVyc2UgPyAnaW52ZXJzZScgOiAnJywgdGhpcy5jbGFzc10uam9pbignICcpO1xuICB9XG59XG4iXX0=
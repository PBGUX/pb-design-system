/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, HostBinding } from '@angular/core';
export class PbdsDatavizMetricIndicatorComponent {
    constructor() {
        this.value = 0;
        this.class = '';
        this.indicator = 'flat';
        this.inverse = false;
    }
    /**
     * @return {?}
     */
    get hostClasses() {
        return ['metric-block-indicator', this.indicator, this.inverse ? 'inverse' : '', this.class].join(' ');
    }
    /**
     * @return {?}
     */
    ngOnInit() { }
}
PbdsDatavizMetricIndicatorComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-metric-indicator',
                template: `
    <span>{{ value }}</span>
  `
            }] }
];
/** @nocollapse */
PbdsDatavizMetricIndicatorComponent.ctorParameters = () => [];
PbdsDatavizMetricIndicatorComponent.propDecorators = {
    value: [{ type: Input }],
    class: [{ type: Input }],
    indicator: [{ type: Input }],
    inverse: [{ type: Input }],
    hostClasses: [{ type: HostBinding, args: ['class',] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFTdEUsTUFBTSxPQUFPLG1DQUFtQztJQWtCOUM7UUFoQkEsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUdWLFVBQUssR0FBRyxFQUFFLENBQUM7UUFHWCxjQUFTLEdBQXFDLE1BQU0sQ0FBQztRQUdyRCxZQUFPLEdBQUcsS0FBSyxDQUFDO0lBT0QsQ0FBQzs7OztJQUxoQixJQUNJLFdBQVc7UUFDYixPQUFPLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7Ozs7SUFJRCxRQUFRLEtBQUksQ0FBQzs7O1lBM0JkLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsK0JBQStCO2dCQUN6QyxRQUFRLEVBQUU7O0dBRVQ7YUFFRjs7Ozs7b0JBRUUsS0FBSztvQkFHTCxLQUFLO3dCQUdMLEtBQUs7c0JBR0wsS0FBSzswQkFHTCxXQUFXLFNBQUMsT0FBTzs7OztJQVpwQixvREFDVTs7SUFFVixvREFDVzs7SUFFWCx3REFDcUQ7O0lBRXJELHNEQUNnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3InLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzcGFuPnt7IHZhbHVlIH19PC9zcGFuPlxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KClcbiAgdmFsdWUgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIGNsYXNzID0gJyc7XG5cbiAgQElucHV0KClcbiAgaW5kaWNhdG9yOiAnZmxhdCcgfCAnaW5jcmVhc2UnIHwgJ2RlY3JlYXNlJyA9ICdmbGF0JztcblxuICBASW5wdXQoKVxuICBpbnZlcnNlID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBob3N0Q2xhc3NlcygpIHtcbiAgICByZXR1cm4gWydtZXRyaWMtYmxvY2staW5kaWNhdG9yJywgdGhpcy5pbmRpY2F0b3IsIHRoaXMuaW52ZXJzZSA/ICdpbnZlcnNlJyA6ICcnLCB0aGlzLmNsYXNzXS5qb2luKCcgJyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgbmdPbkluaXQoKSB7fVxufVxuIl19
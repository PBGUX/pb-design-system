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
    /**
     * @return {?}
     */
    PbdsDatavizMetricIndicatorComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () { };
    PbdsDatavizMetricIndicatorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-metric-indicator',
                    template: "\n    <span>{{ value }}</span>\n  "
                }] }
    ];
    /** @nocollapse */
    PbdsDatavizMetricIndicatorComponent.ctorParameters = function () { return []; };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdEU7SUF5QkU7UUFoQkEsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUdWLFVBQUssR0FBRyxFQUFFLENBQUM7UUFHWCxjQUFTLEdBQXFDLE1BQU0sQ0FBQztRQUdyRCxZQUFPLEdBQUcsS0FBSyxDQUFDO0lBT0QsQ0FBQztJQUxoQixzQkFDSSw0REFBVzs7OztRQURmO1lBRUUsT0FBTyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6RyxDQUFDOzs7T0FBQTs7OztJQUlELHNEQUFROzs7SUFBUixjQUFZLENBQUM7O2dCQTNCZCxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLCtCQUErQjtvQkFDekMsUUFBUSxFQUFFLG9DQUVUO2lCQUVGOzs7Ozt3QkFFRSxLQUFLO3dCQUdMLEtBQUs7NEJBR0wsS0FBSzswQkFHTCxLQUFLOzhCQUdMLFdBQVcsU0FBQyxPQUFPOztJQVF0QiwwQ0FBQztDQUFBLEFBNUJELElBNEJDO1NBckJZLG1DQUFtQzs7O0lBQzlDLG9EQUNVOztJQUVWLG9EQUNXOztJQUVYLHdEQUNxRDs7SUFFckQsc0RBQ2dCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotbWV0cmljLWluZGljYXRvcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHNwYW4+e3sgdmFsdWUgfX08L3NwYW4+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpNZXRyaWNJbmRpY2F0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKVxuICB2YWx1ZSA9IDA7XG5cbiAgQElucHV0KClcbiAgY2xhc3MgPSAnJztcblxuICBASW5wdXQoKVxuICBpbmRpY2F0b3I6ICdmbGF0JyB8ICdpbmNyZWFzZScgfCAnZGVjcmVhc2UnID0gJ2ZsYXQnO1xuXG4gIEBJbnB1dCgpXG4gIGludmVyc2UgPSBmYWxzZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGhvc3RDbGFzc2VzKCkge1xuICAgIHJldHVybiBbJ21ldHJpYy1ibG9jay1pbmRpY2F0b3InLCB0aGlzLmluZGljYXRvciwgdGhpcy5pbnZlcnNlID8gJ2ludmVyc2UnIDogJycsIHRoaXMuY2xhc3NdLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBuZ09uSW5pdCgpIHt9XG59XG4iXX0=
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, HostBinding, ElementRef, ContentChild } from '@angular/core';
import { PbdsDatavizMetricIndicatorComponent } from './dataviz-metric-indicator.component';
var PbdsDatavizMetricBlockComponent = /** @class */ (function () {
    function PbdsDatavizMetricBlockComponent() {
        this.class = '';
        this.heading = null;
        this.value = 0;
        this.unit = null;
        this.description = null;
        this.centered = false;
        this.centeredText = false;
        this.vertical = false;
        this.infoMessage = null;
        this.hideValueMargin = false;
        this.isPercentUnit = false;
        this.isUnit = false;
    }
    Object.defineProperty(PbdsDatavizMetricBlockComponent.prototype, "hostClasses", {
        get: /**
         * @return {?}
         */
        function () {
            return [
                'metric-block',
                this.centered ? 'metric-block-centered' : '',
                this.centeredText ? 'metric-block-centered-text' : '',
                this.vertical ? 'metric-block-vertical' : '',
                this.class
            ].join(' ');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    PbdsDatavizMetricBlockComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (!this.indicatorRef) {
            this.hideValueMargin = true;
        }
        if (this.unit !== '%' && this.unit !== null) {
            this.isUnit = true;
        }
        else if (this.unit === '%') {
            this.isPercentUnit = true;
        }
    };
    PbdsDatavizMetricBlockComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-dataviz-metric-block',
                    template: "\n    <div class=\"metric-block-inner\">\n      <div *ngIf=\"heading\" class=\"metric-block-heading\">\n        {{ heading }}\n        <i\n          *ngIf=\"infoMessage\"\n          class=\"pbi-icon-mini pbi-info-circle-open ml-1 text-muted align-middle\"\n          ngbTooltip=\"{{ infoMessage }}\"\n          container=\"body\"\n        ></i>\n      </div>\n      <div class=\"metric-block-data-block\">\n        <div class=\"metric-block-contents\">\n          <div class=\"metric-block-value\" [ngClass]=\"{ 'mr-0': hideValueMargin }\">\n            {{ value\n            }}<span [ngClass]=\"{ 'metric-block-unit': isUnit, 'metric-block-percentage': isPercentUnit }\">{{\n              unit\n            }}</span>\n          </div>\n\n          <div>\n            <ng-content select=\"pbds-dataviz-metric-indicator\"></ng-content>\n          </div>\n          <div *ngIf=\"description\" class=\"metric-block-description\">{{ description }}</div>\n        </div>\n        <ng-content select=\"pbds-dataviz-sparkline\"></ng-content>\n      </div>\n    </div>\n  "
                }] }
    ];
    PbdsDatavizMetricBlockComponent.propDecorators = {
        class: [{ type: Input }],
        heading: [{ type: Input }],
        value: [{ type: Input }],
        unit: [{ type: Input }],
        description: [{ type: Input }],
        centered: [{ type: Input }],
        centeredText: [{ type: Input }],
        vertical: [{ type: Input }],
        infoMessage: [{ type: Input }],
        hostClasses: [{ type: HostBinding, args: ['class',] }],
        indicatorRef: [{ type: ContentChild, args: [PbdsDatavizMetricIndicatorComponent, { static: true },] }]
    };
    return PbdsDatavizMetricBlockComponent;
}());
export { PbdsDatavizMetricBlockComponent };
if (false) {
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.class;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.heading;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.value;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.unit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.description;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.centered;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.centeredText;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.vertical;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.infoMessage;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.hideValueMargin;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.isPercentUnit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.isUnit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.indicatorRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtYmxvY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotbWV0cmljLWJsb2NrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEcsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFFM0Y7SUFBQTtRQW1DRSxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBR1gsWUFBTyxHQUFXLElBQUksQ0FBQztRQUd2QixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBR1YsU0FBSSxHQUFXLElBQUksQ0FBQztRQUdwQixnQkFBVyxHQUFXLElBQUksQ0FBQztRQUczQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBR2pCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBR3JCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFHakIsZ0JBQVcsR0FBa0IsSUFBSSxDQUFDO1FBRWxDLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLFdBQU0sR0FBRyxLQUFLLENBQUM7SUEwQmpCLENBQUM7SUF4QkMsc0JBQ0ksd0RBQVc7Ozs7UUFEZjtZQUVFLE9BQU87Z0JBQ0wsY0FBYztnQkFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM1QyxJQUFJLENBQUMsS0FBSzthQUNYLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsQ0FBQzs7O09BQUE7Ozs7SUFJRCxrREFBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztTQUM3QjtRQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7Z0JBeEZGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxRQUFRLEVBQUUsMGlDQTRCVDtpQkFFRjs7O3dCQUVFLEtBQUs7MEJBR0wsS0FBSzt3QkFHTCxLQUFLO3VCQUdMLEtBQUs7OEJBR0wsS0FBSzsyQkFHTCxLQUFLOytCQUdMLEtBQUs7MkJBR0wsS0FBSzs4QkFHTCxLQUFLOzhCQU9MLFdBQVcsU0FBQyxPQUFPOytCQVduQixZQUFZLFNBQUMsbUNBQW1DLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztJQWFyRSxzQ0FBQztDQUFBLEFBekZELElBeUZDO1NBeERZLCtCQUErQjs7O0lBQzFDLGdEQUNXOztJQUVYLGtEQUN1Qjs7SUFFdkIsZ0RBQ1U7O0lBRVYsK0NBQ29COztJQUVwQixzREFDMkI7O0lBRTNCLG1EQUNpQjs7SUFFakIsdURBQ3FCOztJQUVyQixtREFDaUI7O0lBRWpCLHNEQUNrQzs7SUFFbEMsMERBQXdCOztJQUN4Qix3REFBc0I7O0lBQ3RCLGlEQUFlOztJQWFmLHVEQUE4RiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgSG9zdEJpbmRpbmcsIEVsZW1lbnRSZWYsIENvbnRlbnRDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1tZXRyaWMtYmxvY2snLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2staW5uZXJcIj5cbiAgICAgIDxkaXYgKm5nSWY9XCJoZWFkaW5nXCIgY2xhc3M9XCJtZXRyaWMtYmxvY2staGVhZGluZ1wiPlxuICAgICAgICB7eyBoZWFkaW5nIH19XG4gICAgICAgIDxpXG4gICAgICAgICAgKm5nSWY9XCJpbmZvTWVzc2FnZVwiXG4gICAgICAgICAgY2xhc3M9XCJwYmktaWNvbi1taW5pIHBiaS1pbmZvLWNpcmNsZS1vcGVuIG1sLTEgdGV4dC1tdXRlZCBhbGlnbi1taWRkbGVcIlxuICAgICAgICAgIG5nYlRvb2x0aXA9XCJ7eyBpbmZvTWVzc2FnZSB9fVwiXG4gICAgICAgICAgY29udGFpbmVyPVwiYm9keVwiXG4gICAgICAgID48L2k+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2stZGF0YS1ibG9ja1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWNvbnRlbnRzXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay12YWx1ZVwiIFtuZ0NsYXNzXT1cInsgJ21yLTAnOiBoaWRlVmFsdWVNYXJnaW4gfVwiPlxuICAgICAgICAgICAge3sgdmFsdWVcbiAgICAgICAgICAgIH19PHNwYW4gW25nQ2xhc3NdPVwieyAnbWV0cmljLWJsb2NrLXVuaXQnOiBpc1VuaXQsICdtZXRyaWMtYmxvY2stcGVyY2VudGFnZSc6IGlzUGVyY2VudFVuaXQgfVwiPnt7XG4gICAgICAgICAgICAgIHVuaXRcbiAgICAgICAgICAgIH19PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cInBiZHMtZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgKm5nSWY9XCJkZXNjcmlwdGlvblwiIGNsYXNzPVwibWV0cmljLWJsb2NrLWRlc2NyaXB0aW9uXCI+e3sgZGVzY3JpcHRpb24gfX08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cInBiZHMtZGF0YXZpei1zcGFya2xpbmVcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KClcbiAgY2xhc3MgPSAnJztcblxuICBASW5wdXQoKVxuICBoZWFkaW5nOiBzdHJpbmcgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHZhbHVlID0gMDtcblxuICBASW5wdXQoKVxuICB1bml0OiBzdHJpbmcgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGNlbnRlcmVkID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgY2VudGVyZWRUZXh0ID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgdmVydGljYWwgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBpbmZvTWVzc2FnZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgaGlkZVZhbHVlTWFyZ2luID0gZmFsc2U7XG4gIGlzUGVyY2VudFVuaXQgPSBmYWxzZTtcbiAgaXNVbml0ID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBob3N0Q2xhc3NlcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ21ldHJpYy1ibG9jaycsXG4gICAgICB0aGlzLmNlbnRlcmVkID8gJ21ldHJpYy1ibG9jay1jZW50ZXJlZCcgOiAnJyxcbiAgICAgIHRoaXMuY2VudGVyZWRUZXh0ID8gJ21ldHJpYy1ibG9jay1jZW50ZXJlZC10ZXh0JyA6ICcnLFxuICAgICAgdGhpcy52ZXJ0aWNhbCA/ICdtZXRyaWMtYmxvY2stdmVydGljYWwnIDogJycsXG4gICAgICB0aGlzLmNsYXNzXG4gICAgXS5qb2luKCcgJyk7XG4gIH1cblxuICBAQ29udGVudENoaWxkKFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSB9KSBpbmRpY2F0b3JSZWY6IEVsZW1lbnRSZWY7XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmluZGljYXRvclJlZikge1xuICAgICAgdGhpcy5oaWRlVmFsdWVNYXJnaW4gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnVuaXQgIT09ICclJyAmJiB0aGlzLnVuaXQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaXNVbml0ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudW5pdCA9PT0gJyUnKSB7XG4gICAgICB0aGlzLmlzUGVyY2VudFVuaXQgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19
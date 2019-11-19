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
                    template: "\n    <div class=\"metric-block-inner\">\n      <div *ngIf=\"heading\" class=\"metric-block-heading\">\n        {{ heading }}\n        <i\n          *ngIf=\"infoMessage\"\n          class=\"pbi-icon-mini pbi-info-circle-open ml-1 align-middle\"\n          ngbTooltip=\"{{ infoMessage }}\"\n          container=\"body\"\n        ></i>\n      </div>\n      <div class=\"metric-block-data-block\">\n        <div class=\"metric-block-contents\">\n          <div class=\"metric-block-value\" [ngClass]=\"{ 'mr-0': hideValueMargin }\">\n            {{ value\n            }}<span [ngClass]=\"{ 'metric-block-unit': isUnit, 'metric-block-percentage': isPercentUnit }\">{{\n              unit\n            }}</span>\n          </div>\n\n          <div>\n            <ng-content select=\"pbds-dataviz-metric-indicator\"></ng-content>\n          </div>\n          <div *ngIf=\"description\" class=\"metric-block-description\">{{ description }}</div>\n        </div>\n        <ng-content select=\"pbds-dataviz-sparkline\"></ng-content>\n      </div>\n    </div>\n  "
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtYmxvY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotbWV0cmljLWJsb2NrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEcsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFFM0Y7SUFBQTtRQW1DRSxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBR1gsWUFBTyxHQUFXLElBQUksQ0FBQztRQUd2QixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBR1YsU0FBSSxHQUFXLElBQUksQ0FBQztRQUdwQixnQkFBVyxHQUFXLElBQUksQ0FBQztRQUczQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBR2pCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBR3JCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFHakIsZ0JBQVcsR0FBa0IsSUFBSSxDQUFDO1FBRWxDLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLFdBQU0sR0FBRyxLQUFLLENBQUM7SUEwQmpCLENBQUM7SUF4QkMsc0JBQ0ksd0RBQVc7Ozs7UUFEZjtZQUVFLE9BQU87Z0JBQ0wsY0FBYztnQkFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM1QyxJQUFJLENBQUMsS0FBSzthQUNYLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsQ0FBQzs7O09BQUE7Ozs7SUFJRCxrREFBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztTQUM3QjtRQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7Z0JBeEZGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxRQUFRLEVBQUUsK2hDQTRCVDtpQkFFRjs7O3dCQUVFLEtBQUs7MEJBR0wsS0FBSzt3QkFHTCxLQUFLO3VCQUdMLEtBQUs7OEJBR0wsS0FBSzsyQkFHTCxLQUFLOytCQUdMLEtBQUs7MkJBR0wsS0FBSzs4QkFHTCxLQUFLOzhCQU9MLFdBQVcsU0FBQyxPQUFPOytCQVduQixZQUFZLFNBQUMsbUNBQW1DLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztJQWFyRSxzQ0FBQztDQUFBLEFBekZELElBeUZDO1NBeERZLCtCQUErQjs7O0lBQzFDLGdEQUNXOztJQUVYLGtEQUN1Qjs7SUFFdkIsZ0RBQ1U7O0lBRVYsK0NBQ29COztJQUVwQixzREFDMkI7O0lBRTNCLG1EQUNpQjs7SUFFakIsdURBQ3FCOztJQUVyQixtREFDaUI7O0lBRWpCLHNEQUNrQzs7SUFFbEMsMERBQXdCOztJQUN4Qix3REFBc0I7O0lBQ3RCLGlEQUFlOztJQWFmLHVEQUE4RiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgSG9zdEJpbmRpbmcsIEVsZW1lbnRSZWYsIENvbnRlbnRDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1tZXRyaWMtYmxvY2snLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2staW5uZXJcIj5cbiAgICAgIDxkaXYgKm5nSWY9XCJoZWFkaW5nXCIgY2xhc3M9XCJtZXRyaWMtYmxvY2staGVhZGluZ1wiPlxuICAgICAgICB7eyBoZWFkaW5nIH19XG4gICAgICAgIDxpXG4gICAgICAgICAgKm5nSWY9XCJpbmZvTWVzc2FnZVwiXG4gICAgICAgICAgY2xhc3M9XCJwYmktaWNvbi1taW5pIHBiaS1pbmZvLWNpcmNsZS1vcGVuIG1sLTEgYWxpZ24tbWlkZGxlXCJcbiAgICAgICAgICBuZ2JUb29sdGlwPVwie3sgaW5mb01lc3NhZ2UgfX1cIlxuICAgICAgICAgIGNvbnRhaW5lcj1cImJvZHlcIlxuICAgICAgICA+PC9pPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWRhdGEtYmxvY2tcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1jb250ZW50c1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2stdmFsdWVcIiBbbmdDbGFzc109XCJ7ICdtci0wJzogaGlkZVZhbHVlTWFyZ2luIH1cIj5cbiAgICAgICAgICAgIHt7IHZhbHVlXG4gICAgICAgICAgICB9fTxzcGFuIFtuZ0NsYXNzXT1cInsgJ21ldHJpYy1ibG9jay11bml0JzogaXNVbml0LCAnbWV0cmljLWJsb2NrLXBlcmNlbnRhZ2UnOiBpc1BlcmNlbnRVbml0IH1cIj57e1xuICAgICAgICAgICAgICB1bml0XG4gICAgICAgICAgICB9fTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwYmRzLWRhdGF2aXotbWV0cmljLWluZGljYXRvclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2ICpuZ0lmPVwiZGVzY3JpcHRpb25cIiBjbGFzcz1cIm1ldHJpYy1ibG9jay1kZXNjcmlwdGlvblwiPnt7IGRlc2NyaXB0aW9uIH19PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwYmRzLWRhdGF2aXotc3BhcmtsaW5lXCI+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpNZXRyaWNCbG9ja0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpXG4gIGNsYXNzID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGVhZGluZzogc3RyaW5nID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB2YWx1ZSA9IDA7XG5cbiAgQElucHV0KClcbiAgdW5pdDogc3RyaW5nID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBkZXNjcmlwdGlvbjogc3RyaW5nID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBjZW50ZXJlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGNlbnRlcmVkVGV4dCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHZlcnRpY2FsID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgaW5mb01lc3NhZ2U6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGhpZGVWYWx1ZU1hcmdpbiA9IGZhbHNlO1xuICBpc1BlcmNlbnRVbml0ID0gZmFsc2U7XG4gIGlzVW5pdCA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgaG9zdENsYXNzZXMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdtZXRyaWMtYmxvY2snLFxuICAgICAgdGhpcy5jZW50ZXJlZCA/ICdtZXRyaWMtYmxvY2stY2VudGVyZWQnIDogJycsXG4gICAgICB0aGlzLmNlbnRlcmVkVGV4dCA/ICdtZXRyaWMtYmxvY2stY2VudGVyZWQtdGV4dCcgOiAnJyxcbiAgICAgIHRoaXMudmVydGljYWwgPyAnbWV0cmljLWJsb2NrLXZlcnRpY2FsJyA6ICcnLFxuICAgICAgdGhpcy5jbGFzc1xuICAgIF0uam9pbignICcpO1xuICB9XG5cbiAgQENvbnRlbnRDaGlsZChQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUgfSkgaW5kaWNhdG9yUmVmOiBFbGVtZW50UmVmO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pbmRpY2F0b3JSZWYpIHtcbiAgICAgIHRoaXMuaGlkZVZhbHVlTWFyZ2luID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51bml0ICE9PSAnJScgJiYgdGhpcy51bml0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmlzVW5pdCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnVuaXQgPT09ICclJykge1xuICAgICAgdGhpcy5pc1BlcmNlbnRVbml0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
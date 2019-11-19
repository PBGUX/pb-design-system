/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, HostBinding, ElementRef, ContentChild } from '@angular/core';
import { PbdsDatavizMetricIndicatorComponent } from './dataviz-metric-indicator.component';
export class PbdsDatavizMetricBlockComponent {
    constructor() {
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
    /**
     * @return {?}
     */
    get hostClasses() {
        return [
            'metric-block',
            this.centered ? 'metric-block-centered' : '',
            this.centeredText ? 'metric-block-centered-text' : '',
            this.vertical ? 'metric-block-vertical' : '',
            this.class
        ].join(' ');
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.indicatorRef) {
            this.hideValueMargin = true;
        }
        if (this.unit !== '%' && this.unit !== null) {
            this.isUnit = true;
        }
        else if (this.unit === '%') {
            this.isPercentUnit = true;
        }
    }
}
PbdsDatavizMetricBlockComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-metric-block',
                template: `
    <div class="metric-block-inner">
      <div *ngIf="heading" class="metric-block-heading">
        {{ heading }}
        <i
          *ngIf="infoMessage"
          class="pbi-icon-mini pbi-info-circle-open ml-1 align-middle"
          ngbTooltip="{{ infoMessage }}"
          container="body"
        ></i>
      </div>
      <div class="metric-block-data-block">
        <div class="metric-block-contents">
          <div class="metric-block-value" [ngClass]="{ 'mr-0': hideValueMargin }">
            {{ value
            }}<span [ngClass]="{ 'metric-block-unit': isUnit, 'metric-block-percentage': isPercentUnit }">{{
              unit
            }}</span>
          </div>

          <div>
            <ng-content select="pbds-dataviz-metric-indicator"></ng-content>
          </div>
          <div *ngIf="description" class="metric-block-description">{{ description }}</div>
        </div>
        <ng-content select="pbds-dataviz-sparkline"></ng-content>
      </div>
    </div>
  `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtYmxvY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotbWV0cmljLWJsb2NrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEcsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFtQzNGLE1BQU0sT0FBTywrQkFBK0I7SUFqQzVDO1FBbUNFLFVBQUssR0FBRyxFQUFFLENBQUM7UUFHWCxZQUFPLEdBQVcsSUFBSSxDQUFDO1FBR3ZCLFVBQUssR0FBRyxDQUFDLENBQUM7UUFHVixTQUFJLEdBQVcsSUFBSSxDQUFDO1FBR3BCLGdCQUFXLEdBQVcsSUFBSSxDQUFDO1FBRzNCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFHakIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFHckIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUdqQixnQkFBVyxHQUFrQixJQUFJLENBQUM7UUFFbEMsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFDdEIsV0FBTSxHQUFHLEtBQUssQ0FBQztJQTBCakIsQ0FBQzs7OztJQXhCQyxJQUNJLFdBQVc7UUFDYixPQUFPO1lBQ0wsY0FBYztZQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxLQUFLO1NBQ1gsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZCxDQUFDOzs7O0lBSUQsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1NBQzdCO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUMzQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjthQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7U0FDM0I7SUFDSCxDQUFDOzs7WUF4RkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwyQkFBMkI7Z0JBQ3JDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCVDthQUVGOzs7b0JBRUUsS0FBSztzQkFHTCxLQUFLO29CQUdMLEtBQUs7bUJBR0wsS0FBSzswQkFHTCxLQUFLO3VCQUdMLEtBQUs7MkJBR0wsS0FBSzt1QkFHTCxLQUFLOzBCQUdMLEtBQUs7MEJBT0wsV0FBVyxTQUFDLE9BQU87MkJBV25CLFlBQVksU0FBQyxtQ0FBbUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Ozs7SUExQ25FLGdEQUNXOztJQUVYLGtEQUN1Qjs7SUFFdkIsZ0RBQ1U7O0lBRVYsK0NBQ29COztJQUVwQixzREFDMkI7O0lBRTNCLG1EQUNpQjs7SUFFakIsdURBQ3FCOztJQUVyQixtREFDaUI7O0lBRWpCLHNEQUNrQzs7SUFFbEMsMERBQXdCOztJQUN4Qix3REFBc0I7O0lBQ3RCLGlEQUFlOztJQWFmLHVEQUE4RiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgSG9zdEJpbmRpbmcsIEVsZW1lbnRSZWYsIENvbnRlbnRDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1tZXRyaWMtYmxvY2snLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2staW5uZXJcIj5cbiAgICAgIDxkaXYgKm5nSWY9XCJoZWFkaW5nXCIgY2xhc3M9XCJtZXRyaWMtYmxvY2staGVhZGluZ1wiPlxuICAgICAgICB7eyBoZWFkaW5nIH19XG4gICAgICAgIDxpXG4gICAgICAgICAgKm5nSWY9XCJpbmZvTWVzc2FnZVwiXG4gICAgICAgICAgY2xhc3M9XCJwYmktaWNvbi1taW5pIHBiaS1pbmZvLWNpcmNsZS1vcGVuIG1sLTEgYWxpZ24tbWlkZGxlXCJcbiAgICAgICAgICBuZ2JUb29sdGlwPVwie3sgaW5mb01lc3NhZ2UgfX1cIlxuICAgICAgICAgIGNvbnRhaW5lcj1cImJvZHlcIlxuICAgICAgICA+PC9pPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWRhdGEtYmxvY2tcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1jb250ZW50c1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2stdmFsdWVcIiBbbmdDbGFzc109XCJ7ICdtci0wJzogaGlkZVZhbHVlTWFyZ2luIH1cIj5cbiAgICAgICAgICAgIHt7IHZhbHVlXG4gICAgICAgICAgICB9fTxzcGFuIFtuZ0NsYXNzXT1cInsgJ21ldHJpYy1ibG9jay11bml0JzogaXNVbml0LCAnbWV0cmljLWJsb2NrLXBlcmNlbnRhZ2UnOiBpc1BlcmNlbnRVbml0IH1cIj57e1xuICAgICAgICAgICAgICB1bml0XG4gICAgICAgICAgICB9fTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwYmRzLWRhdGF2aXotbWV0cmljLWluZGljYXRvclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2ICpuZ0lmPVwiZGVzY3JpcHRpb25cIiBjbGFzcz1cIm1ldHJpYy1ibG9jay1kZXNjcmlwdGlvblwiPnt7IGRlc2NyaXB0aW9uIH19PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwYmRzLWRhdGF2aXotc3BhcmtsaW5lXCI+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpNZXRyaWNCbG9ja0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpXG4gIGNsYXNzID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGVhZGluZzogc3RyaW5nID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB2YWx1ZSA9IDA7XG5cbiAgQElucHV0KClcbiAgdW5pdDogc3RyaW5nID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBkZXNjcmlwdGlvbjogc3RyaW5nID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBjZW50ZXJlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGNlbnRlcmVkVGV4dCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHZlcnRpY2FsID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgaW5mb01lc3NhZ2U6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGhpZGVWYWx1ZU1hcmdpbiA9IGZhbHNlO1xuICBpc1BlcmNlbnRVbml0ID0gZmFsc2U7XG4gIGlzVW5pdCA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgaG9zdENsYXNzZXMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdtZXRyaWMtYmxvY2snLFxuICAgICAgdGhpcy5jZW50ZXJlZCA/ICdtZXRyaWMtYmxvY2stY2VudGVyZWQnIDogJycsXG4gICAgICB0aGlzLmNlbnRlcmVkVGV4dCA/ICdtZXRyaWMtYmxvY2stY2VudGVyZWQtdGV4dCcgOiAnJyxcbiAgICAgIHRoaXMudmVydGljYWwgPyAnbWV0cmljLWJsb2NrLXZlcnRpY2FsJyA6ICcnLFxuICAgICAgdGhpcy5jbGFzc1xuICAgIF0uam9pbignICcpO1xuICB9XG5cbiAgQENvbnRlbnRDaGlsZChQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUgfSkgaW5kaWNhdG9yUmVmOiBFbGVtZW50UmVmO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pbmRpY2F0b3JSZWYpIHtcbiAgICAgIHRoaXMuaGlkZVZhbHVlTWFyZ2luID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51bml0ICE9PSAnJScgJiYgdGhpcy51bml0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmlzVW5pdCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnVuaXQgPT09ICclJykge1xuICAgICAgdGhpcy5pc1BlcmNlbnRVbml0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
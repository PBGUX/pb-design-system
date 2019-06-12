/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        this.hideValueMargin = false;
        this.isPercentUnit = false;
        this.isUnit = false;
    }
    /**
     * @return {?}
     */
    get hostClasses() {
        return ['metric-block', this.centered ? 'metric-block-centered' : '', this.class].join(' ');
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
    <ng-content select="pbds-dataviz-sparkline"></ng-content>

    <div class="metric-block-data">
      <div *ngIf="heading" class="metric-block-heading">{{ heading }}</div>

      <div class="metric-block-value" [ngClass]="{ 'mr-0': hideValueMargin }">
        {{ value
        }}<span [ngClass]="{ 'metric-block-unit': isUnit, 'metric-block-percentage': isPercentUnit }">{{ unit }}</span>
      </div>

      <ng-content select="pbds-dataviz-metric-indicator"></ng-content>

      <div *ngIf="description" class="metric-block-description">{{ description }}</div>
    </div>
  `
            }] }
];
/** @nocollapse */
PbdsDatavizMetricBlockComponent.ctorParameters = () => [];
PbdsDatavizMetricBlockComponent.propDecorators = {
    class: [{ type: Input }],
    heading: [{ type: Input }],
    value: [{ type: Input }],
    unit: [{ type: Input }],
    description: [{ type: Input }],
    centered: [{ type: Input }],
    hostClasses: [{ type: HostBinding, args: ['class',] }],
    indicatorRef: [{ type: ContentChild, args: [PbdsDatavizMetricIndicatorComponent,] }]
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
    PbdsDatavizMetricBlockComponent.prototype.hideValueMargin;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.isPercentUnit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.isUnit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.indicatorRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtYmxvY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotbWV0cmljLWJsb2NrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEcsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFzQjNGLE1BQU0sT0FBTywrQkFBK0I7SUE4QjFDO1FBNUJBLFVBQUssR0FBRyxFQUFFLENBQUM7UUFHWCxZQUFPLEdBQVcsSUFBSSxDQUFDO1FBR3ZCLFVBQUssR0FBRyxDQUFDLENBQUM7UUFHVixTQUFJLEdBQVcsSUFBSSxDQUFDO1FBR3BCLGdCQUFXLEdBQVcsSUFBSSxDQUFDO1FBRzNCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFFakIsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFDdEIsV0FBTSxHQUFHLEtBQUssQ0FBQztJQVNBLENBQUM7Ozs7SUFQaEIsSUFDSSxXQUFXO1FBQ2IsT0FBTyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUYsQ0FBQzs7OztJQU1ELFFBQVE7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztTQUM3QjtRQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7O1lBOURGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7OztHQWVUO2FBRUY7Ozs7O29CQUVFLEtBQUs7c0JBR0wsS0FBSztvQkFHTCxLQUFLO21CQUdMLEtBQUs7MEJBR0wsS0FBSzt1QkFHTCxLQUFLOzBCQU9MLFdBQVcsU0FBQyxPQUFPOzJCQUtuQixZQUFZLFNBQUMsbUNBQW1DOzs7O0lBM0JqRCxnREFDVzs7SUFFWCxrREFDdUI7O0lBRXZCLGdEQUNVOztJQUVWLCtDQUNvQjs7SUFFcEIsc0RBQzJCOztJQUUzQixtREFDaUI7O0lBRWpCLDBEQUF3Qjs7SUFDeEIsd0RBQXNCOztJQUN0QixpREFBZTs7SUFPZix1REFBNEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIEhvc3RCaW5kaW5nLCBFbGVtZW50UmVmLCBDb250ZW50Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpNZXRyaWNJbmRpY2F0b3JDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotbWV0cmljLWluZGljYXRvci5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotbWV0cmljLWJsb2NrJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwYmRzLWRhdGF2aXotc3BhcmtsaW5lXCI+PC9uZy1jb250ZW50PlxuXG4gICAgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1kYXRhXCI+XG4gICAgICA8ZGl2ICpuZ0lmPVwiaGVhZGluZ1wiIGNsYXNzPVwibWV0cmljLWJsb2NrLWhlYWRpbmdcIj57eyBoZWFkaW5nIH19PC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2stdmFsdWVcIiBbbmdDbGFzc109XCJ7ICdtci0wJzogaGlkZVZhbHVlTWFyZ2luIH1cIj5cbiAgICAgICAge3sgdmFsdWVcbiAgICAgICAgfX08c3BhbiBbbmdDbGFzc109XCJ7ICdtZXRyaWMtYmxvY2stdW5pdCc6IGlzVW5pdCwgJ21ldHJpYy1ibG9jay1wZXJjZW50YWdlJzogaXNQZXJjZW50VW5pdCB9XCI+e3sgdW5pdCB9fTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwYmRzLWRhdGF2aXotbWV0cmljLWluZGljYXRvclwiPjwvbmctY29udGVudD5cblxuICAgICAgPGRpdiAqbmdJZj1cImRlc2NyaXB0aW9uXCIgY2xhc3M9XCJtZXRyaWMtYmxvY2stZGVzY3JpcHRpb25cIj57eyBkZXNjcmlwdGlvbiB9fTwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6TWV0cmljQmxvY2tDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKVxuICBjbGFzcyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhlYWRpbmc6IHN0cmluZyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdmFsdWUgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHVuaXQ6IHN0cmluZyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgZGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgY2VudGVyZWQgPSBmYWxzZTtcblxuICBoaWRlVmFsdWVNYXJnaW4gPSBmYWxzZTtcbiAgaXNQZXJjZW50VW5pdCA9IGZhbHNlO1xuICBpc1VuaXQgPSBmYWxzZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGhvc3RDbGFzc2VzKCkge1xuICAgIHJldHVybiBbJ21ldHJpYy1ibG9jaycsIHRoaXMuY2VudGVyZWQgPyAnbWV0cmljLWJsb2NrLWNlbnRlcmVkJyA6ICcnLCB0aGlzLmNsYXNzXS5qb2luKCcgJyk7XG4gIH1cblxuICBAQ29udGVudENoaWxkKFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50KSBpbmRpY2F0b3JSZWY6IEVsZW1lbnRSZWY7XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pbmRpY2F0b3JSZWYpIHtcbiAgICAgIHRoaXMuaGlkZVZhbHVlTWFyZ2luID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51bml0ICE9PSAnJScgJiYgdGhpcy51bml0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmlzVW5pdCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnVuaXQgPT09ICclJykge1xuICAgICAgdGhpcy5pc1BlcmNlbnRVbml0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
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
      <div *ngIf="heading" class="metric-block-heading">{{ heading }}</div>
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
    PbdsDatavizMetricBlockComponent.prototype.hideValueMargin;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.isPercentUnit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.isUnit;
    /** @type {?} */
    PbdsDatavizMetricBlockComponent.prototype.indicatorRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtYmxvY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotbWV0cmljLWJsb2NrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEcsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUEyQjNGLE1BQU0sT0FBTywrQkFBK0I7SUF6QjVDO1FBMkJFLFVBQUssR0FBRyxFQUFFLENBQUM7UUFHWCxZQUFPLEdBQVcsSUFBSSxDQUFDO1FBR3ZCLFVBQUssR0FBRyxDQUFDLENBQUM7UUFHVixTQUFJLEdBQVcsSUFBSSxDQUFDO1FBR3BCLGdCQUFXLEdBQVcsSUFBSSxDQUFDO1FBRzNCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFHakIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFHckIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUVqQixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUN0QixXQUFNLEdBQUcsS0FBSyxDQUFDO0lBMEJqQixDQUFDOzs7O0lBeEJDLElBQ0ksV0FBVztRQUNiLE9BQU87WUFDTCxjQUFjO1lBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLEtBQUs7U0FDWCxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNkLENBQUM7Ozs7SUFJRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7U0FDN0I7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQzNDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRTtZQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztTQUMzQjtJQUNILENBQUM7OztZQTdFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CVDthQUVGOzs7b0JBRUUsS0FBSztzQkFHTCxLQUFLO29CQUdMLEtBQUs7bUJBR0wsS0FBSzswQkFHTCxLQUFLO3VCQUdMLEtBQUs7MkJBR0wsS0FBSzt1QkFHTCxLQUFLOzBCQU9MLFdBQVcsU0FBQyxPQUFPOzJCQVduQixZQUFZLFNBQUMsbUNBQW1DLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzs7O0lBdkNuRSxnREFDVzs7SUFFWCxrREFDdUI7O0lBRXZCLGdEQUNVOztJQUVWLCtDQUNvQjs7SUFFcEIsc0RBQzJCOztJQUUzQixtREFDaUI7O0lBRWpCLHVEQUNxQjs7SUFFckIsbURBQ2lCOztJQUVqQiwwREFBd0I7O0lBQ3hCLHdEQUFzQjs7SUFDdEIsaURBQWU7O0lBYWYsdURBQThGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBIb3N0QmluZGluZywgRWxlbWVudFJlZiwgQ29udGVudENoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3IuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LW1ldHJpYy1ibG9jaycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1pbm5lclwiPlxuICAgICAgPGRpdiAqbmdJZj1cImhlYWRpbmdcIiBjbGFzcz1cIm1ldHJpYy1ibG9jay1oZWFkaW5nXCI+e3sgaGVhZGluZyB9fTwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1kYXRhLWJsb2NrXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2stY29udGVudHNcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLXZhbHVlXCIgW25nQ2xhc3NdPVwieyAnbXItMCc6IGhpZGVWYWx1ZU1hcmdpbiB9XCI+XG4gICAgICAgICAgICB7eyB2YWx1ZVxuICAgICAgICAgICAgfX08c3BhbiBbbmdDbGFzc109XCJ7ICdtZXRyaWMtYmxvY2stdW5pdCc6IGlzVW5pdCwgJ21ldHJpYy1ibG9jay1wZXJjZW50YWdlJzogaXNQZXJjZW50VW5pdCB9XCI+e3tcbiAgICAgICAgICAgICAgdW5pdFxuICAgICAgICAgICAgfX08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwicGJkcy1kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3JcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiAqbmdJZj1cImRlc2NyaXB0aW9uXCIgY2xhc3M9XCJtZXRyaWMtYmxvY2stZGVzY3JpcHRpb25cIj57eyBkZXNjcmlwdGlvbiB9fTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwicGJkcy1kYXRhdml6LXNwYXJrbGluZVwiPjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6TWV0cmljQmxvY2tDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKVxuICBjbGFzcyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhlYWRpbmc6IHN0cmluZyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdmFsdWUgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHVuaXQ6IHN0cmluZyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgZGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgY2VudGVyZWQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBjZW50ZXJlZFRleHQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB2ZXJ0aWNhbCA9IGZhbHNlO1xuXG4gIGhpZGVWYWx1ZU1hcmdpbiA9IGZhbHNlO1xuICBpc1BlcmNlbnRVbml0ID0gZmFsc2U7XG4gIGlzVW5pdCA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgaG9zdENsYXNzZXMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdtZXRyaWMtYmxvY2snLFxuICAgICAgdGhpcy5jZW50ZXJlZCA/ICdtZXRyaWMtYmxvY2stY2VudGVyZWQnIDogJycsXG4gICAgICB0aGlzLmNlbnRlcmVkVGV4dCA/ICdtZXRyaWMtYmxvY2stY2VudGVyZWQtdGV4dCcgOiAnJyxcbiAgICAgIHRoaXMudmVydGljYWwgPyAnbWV0cmljLWJsb2NrLXZlcnRpY2FsJyA6ICcnLFxuICAgICAgdGhpcy5jbGFzc1xuICAgIF0uam9pbignICcpO1xuICB9XG5cbiAgQENvbnRlbnRDaGlsZChQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUgfSkgaW5kaWNhdG9yUmVmOiBFbGVtZW50UmVmO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pbmRpY2F0b3JSZWYpIHtcbiAgICAgIHRoaXMuaGlkZVZhbHVlTWFyZ2luID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51bml0ICE9PSAnJScgJiYgdGhpcy51bml0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmlzVW5pdCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnVuaXQgPT09ICclJykge1xuICAgICAgdGhpcy5pc1BlcmNlbnRVbml0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
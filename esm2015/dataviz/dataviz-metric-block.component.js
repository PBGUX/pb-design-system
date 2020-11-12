import { Component, Input, HostBinding, ContentChild } from '@angular/core';
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
    get hostClasses() {
        return [
            'metric-block',
            this.centered ? 'metric-block-centered' : '',
            this.centeredText ? 'metric-block-centered-text' : '',
            this.vertical ? 'metric-block-vertical' : '',
            this.class
        ].join(' ');
    }
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
            },] }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtYmxvY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9kYTA1N2NvL0Rlc2t0b3AvQ29kZS9uZy1kZXNpZ25zeXN0ZW0vY2xpZW50L3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0YXZpei8iLCJzb3VyY2VzIjpbImRhdGF2aXotbWV0cmljLWJsb2NrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxXQUFXLEVBQWMsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWhHLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBbUMzRixNQUFNLE9BQU8sK0JBQStCO0lBakM1QztRQW1DRSxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBR1gsWUFBTyxHQUFXLElBQUksQ0FBQztRQUd2QixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBR1YsU0FBSSxHQUFXLElBQUksQ0FBQztRQUdwQixnQkFBVyxHQUFXLElBQUksQ0FBQztRQUczQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBR2pCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBR3JCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFHakIsZ0JBQVcsR0FBa0IsSUFBSSxDQUFDO1FBRWxDLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLFdBQU0sR0FBRyxLQUFLLENBQUM7SUEwQmpCLENBQUM7SUF4QkMsSUFDSSxXQUFXO1FBQ2IsT0FBTztZQUNMLGNBQWM7WUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsS0FBSztTQUNYLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztJQUlELFFBQVE7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztTQUM3QjtRQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7O1lBeEZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0QlQ7YUFFRjs7O29CQUVFLEtBQUs7c0JBR0wsS0FBSztvQkFHTCxLQUFLO21CQUdMLEtBQUs7MEJBR0wsS0FBSzt1QkFHTCxLQUFLOzJCQUdMLEtBQUs7dUJBR0wsS0FBSzswQkFHTCxLQUFLOzBCQU9MLFdBQVcsU0FBQyxPQUFPOzJCQVduQixZQUFZLFNBQUMsbUNBQW1DLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBIb3N0QmluZGluZywgRWxlbWVudFJlZiwgQ29udGVudENoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3IuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LW1ldHJpYy1ibG9jaycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1pbm5lclwiPlxuICAgICAgPGRpdiAqbmdJZj1cImhlYWRpbmdcIiBjbGFzcz1cIm1ldHJpYy1ibG9jay1oZWFkaW5nXCI+XG4gICAgICAgIHt7IGhlYWRpbmcgfX1cbiAgICAgICAgPGlcbiAgICAgICAgICAqbmdJZj1cImluZm9NZXNzYWdlXCJcbiAgICAgICAgICBjbGFzcz1cInBiaS1pY29uLW1pbmkgcGJpLWluZm8tY2lyY2xlLW9wZW4gbWwtMSBhbGlnbi1taWRkbGVcIlxuICAgICAgICAgIG5nYlRvb2x0aXA9XCJ7eyBpbmZvTWVzc2FnZSB9fVwiXG4gICAgICAgICAgY29udGFpbmVyPVwiYm9keVwiXG4gICAgICAgID48L2k+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2stZGF0YS1ibG9ja1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWNvbnRlbnRzXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay12YWx1ZVwiIFtuZ0NsYXNzXT1cInsgJ21yLTAnOiBoaWRlVmFsdWVNYXJnaW4gfVwiPlxuICAgICAgICAgICAge3sgdmFsdWVcbiAgICAgICAgICAgIH19PHNwYW4gW25nQ2xhc3NdPVwieyAnbWV0cmljLWJsb2NrLXVuaXQnOiBpc1VuaXQsICdtZXRyaWMtYmxvY2stcGVyY2VudGFnZSc6IGlzUGVyY2VudFVuaXQgfVwiPnt7XG4gICAgICAgICAgICAgIHVuaXRcbiAgICAgICAgICAgIH19PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cInBiZHMtZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgKm5nSWY9XCJkZXNjcmlwdGlvblwiIGNsYXNzPVwibWV0cmljLWJsb2NrLWRlc2NyaXB0aW9uXCI+e3sgZGVzY3JpcHRpb24gfX08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cInBiZHMtZGF0YXZpei1zcGFya2xpbmVcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KClcbiAgY2xhc3MgPSAnJztcblxuICBASW5wdXQoKVxuICBoZWFkaW5nOiBzdHJpbmcgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHZhbHVlID0gMDtcblxuICBASW5wdXQoKVxuICB1bml0OiBzdHJpbmcgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGNlbnRlcmVkID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgY2VudGVyZWRUZXh0ID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgdmVydGljYWwgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBpbmZvTWVzc2FnZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgaGlkZVZhbHVlTWFyZ2luID0gZmFsc2U7XG4gIGlzUGVyY2VudFVuaXQgPSBmYWxzZTtcbiAgaXNVbml0ID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBob3N0Q2xhc3NlcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ21ldHJpYy1ibG9jaycsXG4gICAgICB0aGlzLmNlbnRlcmVkID8gJ21ldHJpYy1ibG9jay1jZW50ZXJlZCcgOiAnJyxcbiAgICAgIHRoaXMuY2VudGVyZWRUZXh0ID8gJ21ldHJpYy1ibG9jay1jZW50ZXJlZC10ZXh0JyA6ICcnLFxuICAgICAgdGhpcy52ZXJ0aWNhbCA/ICdtZXRyaWMtYmxvY2stdmVydGljYWwnIDogJycsXG4gICAgICB0aGlzLmNsYXNzXG4gICAgXS5qb2luKCcgJyk7XG4gIH1cblxuICBAQ29udGVudENoaWxkKFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSB9KSBpbmRpY2F0b3JSZWY6IEVsZW1lbnRSZWY7XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmluZGljYXRvclJlZikge1xuICAgICAgdGhpcy5oaWRlVmFsdWVNYXJnaW4gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnVuaXQgIT09ICclJyAmJiB0aGlzLnVuaXQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaXNVbml0ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudW5pdCA9PT0gJyUnKSB7XG4gICAgICB0aGlzLmlzUGVyY2VudFVuaXQgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19
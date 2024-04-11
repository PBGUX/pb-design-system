import { Component, ContentChild, HostBinding, Input } from '@angular/core';
import { PbdsDatavizMetricIndicatorComponent } from './dataviz-metric-indicator.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@ng-bootstrap/ng-bootstrap";
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
            this.class,
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizMetricBlockComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: PbdsDatavizMetricBlockComponent, selector: "pbds-dataviz-metric-block", inputs: { class: "class", heading: "heading", value: "value", unit: "unit", description: "description", centered: "centered", centeredText: "centeredText", vertical: "vertical", infoMessage: "infoMessage" }, host: { properties: { "class": "this.hostClasses" } }, queries: [{ propertyName: "indicatorRef", first: true, predicate: PbdsDatavizMetricIndicatorComponent, descendants: true, static: true }], ngImport: i0, template: `
    <div class="metric-block-inner">
      <div class="metric-block-heading" *ngIf="heading">
        {{ heading }}
        <i
          class="pbi-icon-mini pbi-info-circle-open ms-1 align-middle"
          *ngIf="infoMessage"
          ngbTooltip="{{ infoMessage }}"
          container="body"
        ></i>
      </div>
      <div class="metric-block-data-block">
        <div class="metric-block-contents">
          <div class="metric-block-value" [ngClass]="{ 'me-0': hideValueMargin }">
            {{ value
            }}<span [ngClass]="{ 'metric-block-unit': isUnit, 'metric-block-percentage': isPercentUnit }">{{
              unit
            }}</span>
          </div>

          <div>
            <ng-content select="pbds-dataviz-metric-indicator"></ng-content>
          </div>
          <div class="metric-block-description" *ngIf="description">{{ description }}</div>
        </div>
        <ng-content select="pbds-dataviz-sparkline"></ng-content>
      </div>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgbTooltip, selector: "[ngbTooltip]", inputs: ["animation", "autoClose", "placement", "popperOptions", "triggers", "positionTarget", "container", "disableTooltip", "tooltipClass", "tooltipContext", "openDelay", "closeDelay", "ngbTooltip"], outputs: ["shown", "hidden"], exportAs: ["ngbTooltip"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizMetricBlockComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-metric-block', template: `
    <div class="metric-block-inner">
      <div class="metric-block-heading" *ngIf="heading">
        {{ heading }}
        <i
          class="pbi-icon-mini pbi-info-circle-open ms-1 align-middle"
          *ngIf="infoMessage"
          ngbTooltip="{{ infoMessage }}"
          container="body"
        ></i>
      </div>
      <div class="metric-block-data-block">
        <div class="metric-block-contents">
          <div class="metric-block-value" [ngClass]="{ 'me-0': hideValueMargin }">
            {{ value
            }}<span [ngClass]="{ 'metric-block-unit': isUnit, 'metric-block-percentage': isPercentUnit }">{{
              unit
            }}</span>
          </div>

          <div>
            <ng-content select="pbds-dataviz-metric-indicator"></ng-content>
          </div>
          <div class="metric-block-description" *ngIf="description">{{ description }}</div>
        </div>
        <ng-content select="pbds-dataviz-sparkline"></ng-content>
      </div>
    </div>
  ` }]
        }], propDecorators: { class: [{
                type: Input
            }], heading: [{
                type: Input
            }], value: [{
                type: Input
            }], unit: [{
                type: Input
            }], description: [{
                type: Input
            }], centered: [{
                type: Input
            }], centeredText: [{
                type: Input
            }], vertical: [{
                type: Input
            }], infoMessage: [{
                type: Input
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }], indicatorRef: [{
                type: ContentChild,
                args: [PbdsDatavizMetricIndicatorComponent, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtYmxvY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRhdml6L2RhdGF2aXotbWV0cmljLWJsb2NrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBYyxXQUFXLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBRWhHLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOzs7O0FBbUMzRixNQUFNLE9BQU8sK0JBQStCO0lBakM1QztRQW1DRSxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBR1gsWUFBTyxHQUFXLElBQUksQ0FBQztRQUd2QixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBR1YsU0FBSSxHQUFXLElBQUksQ0FBQztRQUdwQixnQkFBVyxHQUFXLElBQUksQ0FBQztRQUczQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBR2pCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBR3JCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFHakIsZ0JBQVcsR0FBa0IsSUFBSSxDQUFDO1FBRWxDLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLFdBQU0sR0FBRyxLQUFLLENBQUM7S0EwQmhCO0lBeEJDLElBQ0ksV0FBVztRQUNiLE9BQU87WUFDTCxjQUFjO1lBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLEtBQUs7U0FDWCxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNkLENBQUM7SUFJRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7U0FDN0I7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQzNDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRTtZQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztTQUMzQjtJQUNILENBQUM7K0dBdkRVLCtCQUErQjttR0FBL0IsK0JBQStCLGtYQTJDNUIsbUNBQW1DLDhEQTFFdkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0QlQ7OzRGQUdVLCtCQUErQjtrQkFqQzNDLFNBQVM7K0JBQ0UsMkJBQTJCLFlBQzNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJUOzhCQUtELEtBQUs7c0JBREosS0FBSztnQkFJTixPQUFPO3NCQUROLEtBQUs7Z0JBSU4sS0FBSztzQkFESixLQUFLO2dCQUlOLElBQUk7c0JBREgsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sUUFBUTtzQkFEUCxLQUFLO2dCQUlOLFlBQVk7c0JBRFgsS0FBSztnQkFJTixRQUFRO3NCQURQLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQVFGLFdBQVc7c0JBRGQsV0FBVzt1QkFBQyxPQUFPO2dCQVdpRCxZQUFZO3NCQUFoRixZQUFZO3VCQUFDLG1DQUFtQyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBFbGVtZW50UmVmLCBIb3N0QmluZGluZywgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1tZXRyaWMtYmxvY2snLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2staW5uZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2staGVhZGluZ1wiICpuZ0lmPVwiaGVhZGluZ1wiPlxuICAgICAgICB7eyBoZWFkaW5nIH19XG4gICAgICAgIDxpXG4gICAgICAgICAgY2xhc3M9XCJwYmktaWNvbi1taW5pIHBiaS1pbmZvLWNpcmNsZS1vcGVuIG1zLTEgYWxpZ24tbWlkZGxlXCJcbiAgICAgICAgICAqbmdJZj1cImluZm9NZXNzYWdlXCJcbiAgICAgICAgICBuZ2JUb29sdGlwPVwie3sgaW5mb01lc3NhZ2UgfX1cIlxuICAgICAgICAgIGNvbnRhaW5lcj1cImJvZHlcIlxuICAgICAgICA+PC9pPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWRhdGEtYmxvY2tcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1ldHJpYy1ibG9jay1jb250ZW50c1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXRyaWMtYmxvY2stdmFsdWVcIiBbbmdDbGFzc109XCJ7ICdtZS0wJzogaGlkZVZhbHVlTWFyZ2luIH1cIj5cbiAgICAgICAgICAgIHt7IHZhbHVlXG4gICAgICAgICAgICB9fTxzcGFuIFtuZ0NsYXNzXT1cInsgJ21ldHJpYy1ibG9jay11bml0JzogaXNVbml0LCAnbWV0cmljLWJsb2NrLXBlcmNlbnRhZ2UnOiBpc1BlcmNlbnRVbml0IH1cIj57e1xuICAgICAgICAgICAgICB1bml0XG4gICAgICAgICAgICB9fTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwYmRzLWRhdGF2aXotbWV0cmljLWluZGljYXRvclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibWV0cmljLWJsb2NrLWRlc2NyaXB0aW9uXCIgKm5nSWY9XCJkZXNjcmlwdGlvblwiPnt7IGRlc2NyaXB0aW9uIH19PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwYmRzLWRhdGF2aXotc3BhcmtsaW5lXCI+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW10sXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6TWV0cmljQmxvY2tDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKVxuICBjbGFzcyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhlYWRpbmc6IHN0cmluZyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdmFsdWUgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHVuaXQ6IHN0cmluZyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgZGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgY2VudGVyZWQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBjZW50ZXJlZFRleHQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB2ZXJ0aWNhbCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGluZm9NZXNzYWdlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBoaWRlVmFsdWVNYXJnaW4gPSBmYWxzZTtcbiAgaXNQZXJjZW50VW5pdCA9IGZhbHNlO1xuICBpc1VuaXQgPSBmYWxzZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGhvc3RDbGFzc2VzKCkge1xuICAgIHJldHVybiBbXG4gICAgICAnbWV0cmljLWJsb2NrJyxcbiAgICAgIHRoaXMuY2VudGVyZWQgPyAnbWV0cmljLWJsb2NrLWNlbnRlcmVkJyA6ICcnLFxuICAgICAgdGhpcy5jZW50ZXJlZFRleHQgPyAnbWV0cmljLWJsb2NrLWNlbnRlcmVkLXRleHQnIDogJycsXG4gICAgICB0aGlzLnZlcnRpY2FsID8gJ21ldHJpYy1ibG9jay12ZXJ0aWNhbCcgOiAnJyxcbiAgICAgIHRoaXMuY2xhc3MsXG4gICAgXS5qb2luKCcgJyk7XG4gIH1cblxuICBAQ29udGVudENoaWxkKFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSB9KSBpbmRpY2F0b3JSZWY6IEVsZW1lbnRSZWY7XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmluZGljYXRvclJlZikge1xuICAgICAgdGhpcy5oaWRlVmFsdWVNYXJnaW4gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnVuaXQgIT09ICclJyAmJiB0aGlzLnVuaXQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaXNVbml0ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudW5pdCA9PT0gJyUnKSB7XG4gICAgICB0aGlzLmlzUGVyY2VudFVuaXQgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19
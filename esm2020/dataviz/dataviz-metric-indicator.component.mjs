import { Component, Input, HostBinding } from '@angular/core';
import * as i0 from "@angular/core";
export class PbdsDatavizMetricIndicatorComponent {
    constructor() {
        this.value = 0;
        this.class = '';
        this.indicator = 'flat';
        this.inverse = false;
    }
    get hostClasses() {
        return ['metric-block-indicator', this.indicator, this.inverse ? 'inverse' : '', this.class].join(' ');
    }
}
PbdsDatavizMetricIndicatorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizMetricIndicatorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizMetricIndicatorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDatavizMetricIndicatorComponent, selector: "pbds-dataviz-metric-indicator", inputs: { value: "value", class: "class", indicator: "indicator", inverse: "inverse" }, host: { properties: { "class": "this.hostClasses" } }, ngImport: i0, template: `
    <span>{{ value }}</span>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizMetricIndicatorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-metric-indicator', template: `
    <span>{{ value }}</span>
  ` }]
        }], propDecorators: { value: [{
                type: Input
            }], class: [{
                type: Input
            }], indicator: [{
                type: Input
            }], inverse: [{
                type: Input
            }], hostClasses: [{
                type: HostBinding,
                args: ['class']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0YXZpei9kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFTOUQsTUFBTSxPQUFPLG1DQUFtQztJQVBoRDtRQVNFLFVBQUssR0FBRyxDQUFDLENBQUM7UUFHVixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBR1gsY0FBUyxHQUFxQyxNQUFNLENBQUM7UUFHckQsWUFBTyxHQUFHLEtBQUssQ0FBQztLQU1qQjtJQUpDLElBQ0ksV0FBVztRQUNiLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekcsQ0FBQzs7Z0lBaEJVLG1DQUFtQztvSEFBbkMsbUNBQW1DLG9OQUxwQzs7R0FFVDsyRkFHVSxtQ0FBbUM7a0JBUC9DLFNBQVM7K0JBQ0UsK0JBQStCLFlBQy9COztHQUVUOzhCQUtELEtBQUs7c0JBREosS0FBSztnQkFJTixLQUFLO3NCQURKLEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLE9BQU87c0JBRE4sS0FBSztnQkFJRixXQUFXO3NCQURkLFdBQVc7dUJBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3Bhbj57eyB2YWx1ZSB9fTwvc3Bhbj5cbiAgYCxcbiAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHZhbHVlID0gMDtcblxuICBASW5wdXQoKVxuICBjbGFzcyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGluZGljYXRvcjogJ2ZsYXQnIHwgJ2luY3JlYXNlJyB8ICdkZWNyZWFzZScgPSAnZmxhdCc7XG5cbiAgQElucHV0KClcbiAgaW52ZXJzZSA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgaG9zdENsYXNzZXMoKSB7XG4gICAgcmV0dXJuIFsnbWV0cmljLWJsb2NrLWluZGljYXRvcicsIHRoaXMuaW5kaWNhdG9yLCB0aGlzLmludmVyc2UgPyAnaW52ZXJzZScgOiAnJywgdGhpcy5jbGFzc10uam9pbignICcpO1xuICB9XG59XG4iXX0=
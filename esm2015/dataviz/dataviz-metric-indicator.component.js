import { Component, Input, HostBinding } from '@angular/core';
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
PbdsDatavizMetricIndicatorComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-metric-indicator',
                template: `
    <span>{{ value }}</span>
  `
            },] }
];
PbdsDatavizMetricIndicatorComponent.propDecorators = {
    value: [{ type: Input }],
    class: [{ type: Input }],
    indicator: [{ type: Input }],
    inverse: [{ type: Input }],
    hostClasses: [{ type: HostBinding, args: ['class',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZGEwNTdjby9EZXNrdG9wL0NvZGUvbmctZGVzaWduc3lzdGVtL2NsaWVudC9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovIiwic291cmNlcyI6WyJkYXRhdml6LW1ldHJpYy1pbmRpY2F0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVM5RCxNQUFNLE9BQU8sbUNBQW1DO0lBUGhEO1FBU0UsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUdWLFVBQUssR0FBRyxFQUFFLENBQUM7UUFHWCxjQUFTLEdBQXFDLE1BQU0sQ0FBQztRQUdyRCxZQUFPLEdBQUcsS0FBSyxDQUFDO0lBTWxCLENBQUM7SUFKQyxJQUNJLFdBQVc7UUFDYixPQUFPLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7OztZQXZCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLCtCQUErQjtnQkFDekMsUUFBUSxFQUFFOztHQUVUO2FBRUY7OztvQkFFRSxLQUFLO29CQUdMLEtBQUs7d0JBR0wsS0FBSztzQkFHTCxLQUFLOzBCQUdMLFdBQVcsU0FBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3InLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzcGFuPnt7IHZhbHVlIH19PC9zcGFuPlxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgdmFsdWUgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIGNsYXNzID0gJyc7XG5cbiAgQElucHV0KClcbiAgaW5kaWNhdG9yOiAnZmxhdCcgfCAnaW5jcmVhc2UnIHwgJ2RlY3JlYXNlJyA9ICdmbGF0JztcblxuICBASW5wdXQoKVxuICBpbnZlcnNlID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBob3N0Q2xhc3NlcygpIHtcbiAgICByZXR1cm4gWydtZXRyaWMtYmxvY2staW5kaWNhdG9yJywgdGhpcy5pbmRpY2F0b3IsIHRoaXMuaW52ZXJzZSA/ICdpbnZlcnNlJyA6ICcnLCB0aGlzLmNsYXNzXS5qb2luKCcgJyk7XG4gIH1cbn1cbiJdfQ==
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvc3QwMTZsby9naXRodWIvbmctZGVzaWduc3lzdGVtL2NsaWVudC9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXotbWV0cmljLWluZGljYXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUzlELE1BQU0sT0FBTyxtQ0FBbUM7SUFQaEQ7UUFTRSxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBR1YsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUdYLGNBQVMsR0FBcUMsTUFBTSxDQUFDO1FBR3JELFlBQU8sR0FBRyxLQUFLLENBQUM7SUFNbEIsQ0FBQztJQUpDLElBQ0ksV0FBVztRQUNiLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekcsQ0FBQzs7O1lBdkJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsK0JBQStCO2dCQUN6QyxRQUFRLEVBQUU7O0dBRVQ7YUFFRjs7O29CQUVFLEtBQUs7b0JBR0wsS0FBSzt3QkFHTCxLQUFLO3NCQUdMLEtBQUs7MEJBR0wsV0FBVyxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotbWV0cmljLWluZGljYXRvcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHNwYW4+e3sgdmFsdWUgfX08L3NwYW4+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpNZXRyaWNJbmRpY2F0b3JDb21wb25lbnQge1xuICBASW5wdXQoKVxuICB2YWx1ZSA9IDA7XG5cbiAgQElucHV0KClcbiAgY2xhc3MgPSAnJztcblxuICBASW5wdXQoKVxuICBpbmRpY2F0b3I6ICdmbGF0JyB8ICdpbmNyZWFzZScgfCAnZGVjcmVhc2UnID0gJ2ZsYXQnO1xuXG4gIEBJbnB1dCgpXG4gIGludmVyc2UgPSBmYWxzZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGhvc3RDbGFzc2VzKCkge1xuICAgIHJldHVybiBbJ21ldHJpYy1ibG9jay1pbmRpY2F0b3InLCB0aGlzLmluZGljYXRvciwgdGhpcy5pbnZlcnNlID8gJ2ludmVyc2UnIDogJycsIHRoaXMuY2xhc3NdLmpvaW4oJyAnKTtcbiAgfVxufVxuIl19
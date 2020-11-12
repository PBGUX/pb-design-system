import { Component, Input, ElementRef, HostBinding } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { interpolate as d3_interpolate } from 'd3-interpolate';
import { arc as d3_arc } from 'd3-shape';
import { format as d3_format } from 'd3-format';
import { PbdsDatavizService } from './dataviz.service';
export class PbdsDatavizGaugeComponent {
    constructor(_dataviz, _element) {
        this._dataviz = _dataviz;
        this._element = _element;
        this.chartClass = true;
        this.gaugeClass = true;
        this.width = 300;
        this.type = 'halfmoon';
        this.color = '#E23DA8';
        this.hideLabel = false;
        this.labelFormatString = '';
        this.gaugeWidth = 20;
        this.degreesToRadians = degree => {
            return (degree * Math.PI) / 180;
        };
        this.calculateMinMax = () => {
            const percentage = this.data.minvalue / (this.data.maxvalue - this.data.minvalue);
            return percentage * (this.data.value - this.data.minvalue) + (this.data.value - this.data.minvalue);
        };
        this.calculateCurve = data => {
            const start = this.degreesToRadians(this.startAngle);
            const end = start + (data * (this.degreesToRadians(this.endAngle) - start)) / this.data.maxvalue;
            return [
                {
                    startAngle: start,
                    endAngle: end
                }
            ];
        };
        this.drawChart = () => {
            this.gauge = this.svg.append('g').attr('class', 'gauge-group');
            // background arc
            this.gauge
                .append('path')
                .data(this.calculateCurve(this.data.maxvalue))
                .attr('class', 'gauge-background')
                .attr('d', d => {
                return this.arc({
                    innerRadius: this.radius - this.gaugeWidth,
                    outerRadius: this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            });
            // value arc
            this.gauge
                .append('path')
                .data(this.calculateCurve(this.calculateMinMax()))
                .attr('class', 'gauge-value')
                .attr('fill', this.color)
                .attr('d', d => {
                return this.arc({
                    innerRadius: this.radius - this.gaugeWidth,
                    outerRadius: this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            });
            switch (this.type) {
                case 'horseshoe':
                    this.svg.attr('height', 230).attr('viewBox', `-${this.width / 2} -${this.height / 2} ${this.height} 230`);
                    break;
                case 'halfmoon':
                    this.svg.attr('height', this.width / 2);
                    this.svg.attr('viewBox', `-${this.width / 2} -${this.width / 2} ${this.width} ${this.width / 2}`);
                    break;
            }
        };
        this.updateChart = () => {
            const group = this.svg.select('.gauge-group');
            group
                .select('.gauge-value')
                .transition()
                .duration(750)
                .call(this.arcTween, this.calculateMinMax());
            this.labelTween = this.chart.select('.gauge-number');
            this.labelTween
                .transition()
                .duration(750)
                .call(this.textTween, this.data.value);
        };
        this.arcTween = (transition, value) => {
            const newAngle = this.calculateCurve(value);
            transition.attrTween('d', d => {
                const interpolate = d3_interpolate(d.endAngle, newAngle[0].endAngle);
                return t => {
                    d.endAngle = interpolate(t);
                    return this.arc({
                        innerRadius: this.radius - this.gaugeWidth,
                        outerRadius: this.radius,
                        startAngle: d.startAngle,
                        endAngle: d.endAngle
                    });
                };
            });
        };
        this.textTween = (transition, value) => {
            value = d3_format('.4f')(value);
            value = value.replace(/,/g, '.');
            transition.tween('text', () => {
                const interpolate = d3_interpolate(d3_format('.4f')(+this.oldValue), value);
                return t => {
                    this.labelTween.text(d => {
                        const updatedNumber = this.labelFormat(interpolate(t));
                        this.label = updatedNumber;
                        return updatedNumber;
                    });
                };
            });
        };
    }
    ngOnInit() {
        this.height = this.width;
        this.radius = Math.max(this.width, this.height) / 2;
        this.labelFormat = d3_format(this.labelFormatString);
        this.label = this.labelFormat(this.data.value);
        switch (this.type) {
            case 'halfmoon':
                this.startAngle = -90;
                this.endAngle = 90;
                this.rounded = true;
                break;
            case 'horseshoe':
                this.startAngle = -140;
                this.endAngle = 140;
                this.rounded = true;
                break;
            case 'circle':
                this.startAngle = 0;
                this.endAngle = 360;
                this.rounded = false;
                break;
        }
        this.arc = d3_arc().cornerRadius(this.rounded ? this.gaugeWidth : 0);
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        this.svg = this.chart
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`);
        this.drawChart();
    }
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.oldValue = changes.data.previousValue.value;
            this.updateChart();
        }
    }
}
PbdsDatavizGaugeComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-gauge',
                template: `
    <div
      *ngIf="!hideLabel"
      class="gauge-details"
      [ngClass]="{ halfmoon: type === 'halfmoon', 'gauge-details-small': type === 'halfmoon' }"
      [ngStyle]="{ 'max-width.px': width - 3 * gaugeWidth }"
    >
      <div class="gauge-number">{{ label }}</div>
      <div *ngIf="description" class="gauge-description text-center">{{ description }}</div>
    </div>
  `
            },] }
];
PbdsDatavizGaugeComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef }
];
PbdsDatavizGaugeComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    gaugeClass: [{ type: HostBinding, args: ['class.pbds-chart-gauge',] }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    type: [{ type: Input }],
    color: [{ type: Input }],
    hideLabel: [{ type: Input }],
    labelFormatString: [{ type: Input }],
    description: [{ type: Input }],
    gaugeWidth: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1nYXVnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2RhMDU3Y28vRGVza3RvcC9Db2RlL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRhdml6LyIsInNvdXJjZXMiOlsiZGF0YXZpei1nYXVnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBNEIsTUFBTSxlQUFlLENBQUM7QUFFNUcsT0FBTyxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLFdBQVcsSUFBSSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUVoRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQWtCdkQsTUFBTSxPQUFPLHlCQUF5QjtJQTZDcEMsWUFBb0IsUUFBNEIsRUFBVSxRQUFvQjtRQUExRCxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVk7UUEzQzlFLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFHbEIsZUFBVSxHQUFHLElBQUksQ0FBQztRQU1sQixVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osU0FBSSxHQUF3QyxVQUFVLENBQUM7UUFHdkQsVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUdsQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBR2xCLHNCQUFpQixHQUFHLEVBQUUsQ0FBQztRQU12QixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBa0VoQixxQkFBZ0IsR0FBRyxNQUFNLENBQUMsRUFBRTtZQUMxQixPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDbEMsQ0FBQyxDQUFDO1FBRUYsb0JBQWUsR0FBRyxHQUFHLEVBQUU7WUFDckIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWxGLE9BQU8sVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEcsQ0FBQyxDQUFDO1FBRUYsbUJBQWMsR0FBRyxJQUFJLENBQUMsRUFBRTtZQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUVqRyxPQUFPO2dCQUNMO29CQUNFLFVBQVUsRUFBRSxLQUFLO29CQUNqQixRQUFRLEVBQUUsR0FBRztpQkFDZDthQUNGLENBQUM7UUFDSixDQUFDLENBQUM7UUFFRixjQUFTLEdBQUcsR0FBRyxFQUFFO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRS9ELGlCQUFpQjtZQUNqQixJQUFJLENBQUMsS0FBSztpQkFDUCxNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQzdDLElBQUksQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUM7aUJBQ2pDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO29CQUNkLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVO29CQUMxQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ3hCLFVBQVUsRUFBRSxDQUFDLENBQUMsVUFBVTtvQkFDeEIsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRO2lCQUNyQixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVMLFlBQVk7WUFDWixJQUFJLENBQUMsS0FBSztpQkFDUCxNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO2lCQUNqRCxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztpQkFDNUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2lCQUN4QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNiLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFDZCxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVTtvQkFDMUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNO29CQUN4QixVQUFVLEVBQUUsQ0FBQyxDQUFDLFVBQVU7b0JBQ3hCLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUTtpQkFDckIsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFTCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pCLEtBQUssV0FBVztvQkFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQyxDQUFDO29CQUMxRyxNQUFNO2dCQUNSLEtBQUssVUFBVTtvQkFDYixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2xHLE1BQU07YUFDVDtRQUNILENBQUMsQ0FBQztRQUVGLGdCQUFXLEdBQUcsR0FBRyxFQUFFO1lBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTlDLEtBQUs7aUJBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQztpQkFDdEIsVUFBVSxFQUFFO2lCQUNaLFFBQVEsQ0FBQyxHQUFHLENBQUM7aUJBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFFL0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVyRCxJQUFJLENBQUMsVUFBVTtpQkFDWixVQUFVLEVBQUU7aUJBQ1osUUFBUSxDQUFDLEdBQUcsQ0FBQztpQkFDYixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztRQUVGLGFBQVEsR0FBRyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMvQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTVDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUM1QixNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXJFLE9BQU8sQ0FBQyxDQUFDLEVBQUU7b0JBQ1QsQ0FBQyxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRTVCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQzt3QkFDZCxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVTt3QkFDMUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNO3dCQUN4QixVQUFVLEVBQUUsQ0FBQyxDQUFDLFVBQVU7d0JBQ3hCLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUTtxQkFDckIsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsY0FBUyxHQUFHLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ2hDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWpDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtnQkFDNUIsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFNUUsT0FBTyxDQUFDLENBQUMsRUFBRTtvQkFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDdkIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkQsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7d0JBQzNCLE9BQU8sYUFBYSxDQUFDO29CQUN2QixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztJQXRLK0UsQ0FBQztJQUVsRixRQUFRO1FBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0MsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssVUFBVTtnQkFDYixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU07WUFFUixLQUFLLFdBQVc7Z0JBQ2QsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixNQUFNO1lBRVIsS0FBSyxRQUFRO2dCQUNYLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQ3JCLE1BQU07U0FDVDtRQUVELElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJFLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVoRixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLO2FBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDYixJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDekIsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQzNCLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDO2FBQzFCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxlQUFlLENBQUM7YUFDNUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFFMUYsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDN0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7WUFDakQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQzs7O1lBNUdGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7R0FVVDthQUVGOzs7WUFqQlEsa0JBQWtCO1lBUFEsVUFBVTs7O3lCQTBCMUMsV0FBVyxTQUFDLGtCQUFrQjt5QkFHOUIsV0FBVyxTQUFDLHdCQUF3QjttQkFHcEMsS0FBSztvQkFHTCxLQUFLO21CQUdMLEtBQUs7b0JBR0wsS0FBSzt3QkFHTCxLQUFLO2dDQUdMLEtBQUs7MEJBR0wsS0FBSzt5QkFHTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBFbGVtZW50UmVmLCBIb3N0QmluZGluZywgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgaW50ZXJwb2xhdGUgYXMgZDNfaW50ZXJwb2xhdGUgfSBmcm9tICdkMy1pbnRlcnBvbGF0ZSc7XG5pbXBvcnQgeyBhcmMgYXMgZDNfYXJjIH0gZnJvbSAnZDMtc2hhcGUnO1xuaW1wb3J0IHsgZm9ybWF0IGFzIGQzX2Zvcm1hdCB9IGZyb20gJ2QzLWZvcm1hdCc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6R2F1Z2UgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1nYXVnZScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgKm5nSWY9XCIhaGlkZUxhYmVsXCJcbiAgICAgIGNsYXNzPVwiZ2F1Z2UtZGV0YWlsc1wiXG4gICAgICBbbmdDbGFzc109XCJ7IGhhbGZtb29uOiB0eXBlID09PSAnaGFsZm1vb24nLCAnZ2F1Z2UtZGV0YWlscy1zbWFsbCc6IHR5cGUgPT09ICdoYWxmbW9vbicgfVwiXG4gICAgICBbbmdTdHlsZV09XCJ7ICdtYXgtd2lkdGgucHgnOiB3aWR0aCAtIDMgKiBnYXVnZVdpZHRoIH1cIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJnYXVnZS1udW1iZXJcIj57eyBsYWJlbCB9fTwvZGl2PlxuICAgICAgPGRpdiAqbmdJZj1cImRlc2NyaXB0aW9uXCIgY2xhc3M9XCJnYXVnZS1kZXNjcmlwdGlvbiB0ZXh0LWNlbnRlclwiPnt7IGRlc2NyaXB0aW9uIH19PC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpHYXVnZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWdhdWdlJylcbiAgZ2F1Z2VDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogUGJkc0RhdGF2aXpHYXVnZTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnaGFsZm1vb24nIHwgJ2hvcnNlc2hvZScgfCAnY2lyY2xlJyA9ICdoYWxmbW9vbic7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI0UyM0RBOCc7XG5cbiAgQElucHV0KClcbiAgaGlkZUxhYmVsID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBkZXNjcmlwdGlvbjtcblxuICBASW5wdXQoKVxuICBnYXVnZVdpZHRoID0gMjA7XG5cbiAgcHJpdmF0ZSBjaGFydDtcbiAgcHJpdmF0ZSBzdmc7XG4gIHByaXZhdGUgZ2F1Z2U7XG4gIHByaXZhdGUgbGFiZWxUd2VlbjtcbiAgcHVibGljIGxhYmVsO1xuICBwcml2YXRlIHN0YXJ0QW5nbGU7XG4gIHByaXZhdGUgZW5kQW5nbGU7XG4gIHByaXZhdGUgcmFkaXVzO1xuICBwcml2YXRlIGFyYztcbiAgcHJpdmF0ZSBsYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSBvbGRWYWx1ZTtcbiAgcHJpdmF0ZSBoZWlnaHQ7XG4gIHByaXZhdGUgcm91bmRlZDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLndpZHRoO1xuICAgIHRoaXMucmFkaXVzID0gTWF0aC5tYXgodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpIC8gMjtcbiAgICB0aGlzLmxhYmVsRm9ybWF0ID0gZDNfZm9ybWF0KHRoaXMubGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGFiZWwgPSB0aGlzLmxhYmVsRm9ybWF0KHRoaXMuZGF0YS52YWx1ZSk7XG5cbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSAnaGFsZm1vb24nOlxuICAgICAgICB0aGlzLnN0YXJ0QW5nbGUgPSAtOTA7XG4gICAgICAgIHRoaXMuZW5kQW5nbGUgPSA5MDtcbiAgICAgICAgdGhpcy5yb3VuZGVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2hvcnNlc2hvZSc6XG4gICAgICAgIHRoaXMuc3RhcnRBbmdsZSA9IC0xNDA7XG4gICAgICAgIHRoaXMuZW5kQW5nbGUgPSAxNDA7XG4gICAgICAgIHRoaXMucm91bmRlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdjaXJjbGUnOlxuICAgICAgICB0aGlzLnN0YXJ0QW5nbGUgPSAwO1xuICAgICAgICB0aGlzLmVuZEFuZ2xlID0gMzYwO1xuICAgICAgICB0aGlzLnJvdW5kZWQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5hcmMgPSBkM19hcmMoKS5jb3JuZXJSYWRpdXModGhpcy5yb3VuZGVkID8gdGhpcy5nYXVnZVdpZHRoIDogMCk7XG5cbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cigndmlld0JveCcsIGAtJHt0aGlzLndpZHRoIC8gMn0gLSR7dGhpcy5oZWlnaHQgLyAyfSAke3RoaXMud2lkdGh9ICR7dGhpcy5oZWlnaHR9YCk7XG5cbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy5vbGRWYWx1ZSA9IGNoYW5nZXMuZGF0YS5wcmV2aW91c1ZhbHVlLnZhbHVlO1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIGRlZ3JlZXNUb1JhZGlhbnMgPSBkZWdyZWUgPT4ge1xuICAgIHJldHVybiAoZGVncmVlICogTWF0aC5QSSkgLyAxODA7XG4gIH07XG5cbiAgY2FsY3VsYXRlTWluTWF4ID0gKCkgPT4ge1xuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLmRhdGEubWludmFsdWUgLyAodGhpcy5kYXRhLm1heHZhbHVlIC0gdGhpcy5kYXRhLm1pbnZhbHVlKTtcblxuICAgIHJldHVybiBwZXJjZW50YWdlICogKHRoaXMuZGF0YS52YWx1ZSAtIHRoaXMuZGF0YS5taW52YWx1ZSkgKyAodGhpcy5kYXRhLnZhbHVlIC0gdGhpcy5kYXRhLm1pbnZhbHVlKTtcbiAgfTtcblxuICBjYWxjdWxhdGVDdXJ2ZSA9IGRhdGEgPT4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5kZWdyZWVzVG9SYWRpYW5zKHRoaXMuc3RhcnRBbmdsZSk7XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyAoZGF0YSAqICh0aGlzLmRlZ3JlZXNUb1JhZGlhbnModGhpcy5lbmRBbmdsZSkgLSBzdGFydCkpIC8gdGhpcy5kYXRhLm1heHZhbHVlO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgc3RhcnRBbmdsZTogc3RhcnQsXG4gICAgICAgIGVuZEFuZ2xlOiBlbmRcbiAgICAgIH1cbiAgICBdO1xuICB9O1xuXG4gIGRyYXdDaGFydCA9ICgpID0+IHtcbiAgICB0aGlzLmdhdWdlID0gdGhpcy5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnZ2F1Z2UtZ3JvdXAnKTtcblxuICAgIC8vIGJhY2tncm91bmQgYXJjXG4gICAgdGhpcy5nYXVnZVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuZGF0YSh0aGlzLmNhbGN1bGF0ZUN1cnZlKHRoaXMuZGF0YS5tYXh2YWx1ZSkpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZ2F1Z2UtYmFja2dyb3VuZCcpXG4gICAgICAuYXR0cignZCcsIGQgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcmMoe1xuICAgICAgICAgIGlubmVyUmFkaXVzOiB0aGlzLnJhZGl1cyAtIHRoaXMuZ2F1Z2VXaWR0aCxcbiAgICAgICAgICBvdXRlclJhZGl1czogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgc3RhcnRBbmdsZTogZC5zdGFydEFuZ2xlLFxuICAgICAgICAgIGVuZEFuZ2xlOiBkLmVuZEFuZ2xlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAvLyB2YWx1ZSBhcmNcbiAgICB0aGlzLmdhdWdlXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5kYXRhKHRoaXMuY2FsY3VsYXRlQ3VydmUodGhpcy5jYWxjdWxhdGVNaW5NYXgoKSkpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZ2F1Z2UtdmFsdWUnKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCB0aGlzLmNvbG9yKVxuICAgICAgLmF0dHIoJ2QnLCBkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJjKHtcbiAgICAgICAgICBpbm5lclJhZGl1czogdGhpcy5yYWRpdXMgLSB0aGlzLmdhdWdlV2lkdGgsXG4gICAgICAgICAgb3V0ZXJSYWRpdXM6IHRoaXMucmFkaXVzLFxuICAgICAgICAgIHN0YXJ0QW5nbGU6IGQuc3RhcnRBbmdsZSxcbiAgICAgICAgICBlbmRBbmdsZTogZC5lbmRBbmdsZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2hvcnNlc2hvZSc6XG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoJ2hlaWdodCcsIDIzMCkuYXR0cigndmlld0JveCcsIGAtJHt0aGlzLndpZHRoIC8gMn0gLSR7dGhpcy5oZWlnaHQgLyAyfSAke3RoaXMuaGVpZ2h0fSAyMzBgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdoYWxmbW9vbic6XG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoJ2hlaWdodCcsIHRoaXMud2lkdGggLyAyKTtcbiAgICAgICAgdGhpcy5zdmcuYXR0cigndmlld0JveCcsIGAtJHt0aGlzLndpZHRoIC8gMn0gLSR7dGhpcy53aWR0aCAvIDJ9ICR7dGhpcy53aWR0aH0gJHt0aGlzLndpZHRoIC8gMn1gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9O1xuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGdyb3VwID0gdGhpcy5zdmcuc2VsZWN0KCcuZ2F1Z2UtZ3JvdXAnKTtcblxuICAgIGdyb3VwXG4gICAgICAuc2VsZWN0KCcuZ2F1Z2UtdmFsdWUnKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAgIC5jYWxsKHRoaXMuYXJjVHdlZW4sIHRoaXMuY2FsY3VsYXRlTWluTWF4KCkpO1xuXG4gICAgdGhpcy5sYWJlbFR3ZWVuID0gdGhpcy5jaGFydC5zZWxlY3QoJy5nYXVnZS1udW1iZXInKTtcblxuICAgIHRoaXMubGFiZWxUd2VlblxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAgIC5jYWxsKHRoaXMudGV4dFR3ZWVuLCB0aGlzLmRhdGEudmFsdWUpO1xuICB9O1xuXG4gIGFyY1R3ZWVuID0gKHRyYW5zaXRpb24sIHZhbHVlKSA9PiB7XG4gICAgY29uc3QgbmV3QW5nbGUgPSB0aGlzLmNhbGN1bGF0ZUN1cnZlKHZhbHVlKTtcblxuICAgIHRyYW5zaXRpb24uYXR0clR3ZWVuKCdkJywgZCA9PiB7XG4gICAgICBjb25zdCBpbnRlcnBvbGF0ZSA9IGQzX2ludGVycG9sYXRlKGQuZW5kQW5nbGUsIG5ld0FuZ2xlWzBdLmVuZEFuZ2xlKTtcblxuICAgICAgcmV0dXJuIHQgPT4ge1xuICAgICAgICBkLmVuZEFuZ2xlID0gaW50ZXJwb2xhdGUodCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXJjKHtcbiAgICAgICAgICBpbm5lclJhZGl1czogdGhpcy5yYWRpdXMgLSB0aGlzLmdhdWdlV2lkdGgsXG4gICAgICAgICAgb3V0ZXJSYWRpdXM6IHRoaXMucmFkaXVzLFxuICAgICAgICAgIHN0YXJ0QW5nbGU6IGQuc3RhcnRBbmdsZSxcbiAgICAgICAgICBlbmRBbmdsZTogZC5lbmRBbmdsZVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgdGV4dFR3ZWVuID0gKHRyYW5zaXRpb24sIHZhbHVlKSA9PiB7XG4gICAgdmFsdWUgPSBkM19mb3JtYXQoJy40ZicpKHZhbHVlKTtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLywvZywgJy4nKTtcblxuICAgIHRyYW5zaXRpb24udHdlZW4oJ3RleHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnRlcnBvbGF0ZSA9IGQzX2ludGVycG9sYXRlKGQzX2Zvcm1hdCgnLjRmJykoK3RoaXMub2xkVmFsdWUpLCB2YWx1ZSk7XG5cbiAgICAgIHJldHVybiB0ID0+IHtcbiAgICAgICAgdGhpcy5sYWJlbFR3ZWVuLnRleHQoZCA9PiB7XG4gICAgICAgICAgY29uc3QgdXBkYXRlZE51bWJlciA9IHRoaXMubGFiZWxGb3JtYXQoaW50ZXJwb2xhdGUodCkpO1xuICAgICAgICAgIHRoaXMubGFiZWwgPSB1cGRhdGVkTnVtYmVyO1xuICAgICAgICAgIHJldHVybiB1cGRhdGVkTnVtYmVyO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG59XG4iXX0=
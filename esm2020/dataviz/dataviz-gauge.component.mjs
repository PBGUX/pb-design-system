import { Component, Input, HostBinding } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { interpolate as d3_interpolate } from 'd3-interpolate';
import { arc as d3_arc } from 'd3-shape';
import { format as d3_format } from 'd3-format';
import * as i0 from "@angular/core";
import * as i1 from "./dataviz.service";
import * as i2 from "@angular/common";
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
        this.detailsPaddingTop = 0;
        this.degreesToRadians = (degree) => {
            return (degree * Math.PI) / 180;
        };
        this.calculateMinMax = () => {
            const percentage = this.data.minvalue / (this.data.maxvalue - this.data.minvalue);
            return percentage * (this.data.value - this.data.minvalue) + (this.data.value - this.data.minvalue);
        };
        this.calculateCurve = (data) => {
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
                .attr('d', (d) => {
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
                .attr('d', (d) => {
                return this.arc({
                    innerRadius: this.radius - this.gaugeWidth,
                    outerRadius: this.radius,
                    startAngle: d.startAngle,
                    endAngle: d.endAngle
                });
            });
            switch (this.type) {
                case 'horseshoe':
                    const svgClone = this.svg.node().cloneNode(true);
                    const fakeSvg = document.body.appendChild(svgClone);
                    fakeSvg.setAttribute('style', 'position: absolute; left: -10000px;'); // position the cloned element offscreen
                    const fakeGroup = fakeSvg.getElementsByClassName('gauge-group')[0];
                    const fakeBox = fakeGroup.getBBox();
                    this.svg
                        .attr('height', fakeBox.height)
                        .attr('viewBox', `-${this.width / 2} -${this.width / 2} ${this.width} ${fakeBox.height}`);
                    this.detailsPaddingTop = this.gaugeWidth;
                    fakeSvg.remove(); // remove the cloned element from the DOM
                    break;
                case 'halfmoon':
                    this.svg.attr('height', this.width / 2);
                    this.svg.attr('viewBox', `-${this.width / 2} -${this.width / 2} ${this.width} ${this.width / 2}`);
                    break;
            }
        };
        this.updateChart = () => {
            const group = this.svg.select('.gauge-group');
            group.select('.gauge-value').transition().duration(750).call(this.arcTween, this.calculateMinMax());
            this.labelTween = this.chart.select('.gauge-number');
            this.labelTween.transition().duration(750).call(this.textTween, this.data.value);
        };
        this.arcTween = (transition, value) => {
            const newAngle = this.calculateCurve(value);
            transition.attrTween('d', (d) => {
                const interpolate = d3_interpolate(d.endAngle, newAngle[0].endAngle);
                return (t) => {
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
                return (t) => {
                    this.labelTween.text((d) => {
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
PbdsDatavizGaugeComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizGaugeComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizGaugeComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: PbdsDatavizGaugeComponent, selector: "pbds-dataviz-gauge", inputs: { data: "data", width: "width", type: "type", color: "color", hideLabel: "hideLabel", labelFormatString: "labelFormatString", description: "description", gaugeWidth: "gaugeWidth" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-gauge": "this.gaugeClass" } }, usesOnChanges: true, ngImport: i0, template: `
    <div
      *ngIf="!hideLabel"
      class="gauge-details"
      [ngClass]="{ halfmoon: type === 'halfmoon', 'gauge-details-small': type === 'halfmoon' }"
      [ngStyle]="{ 'max-width.px': width - 3 * gaugeWidth, 'padding-top.px': detailsPaddingTop }"
    >
      <div class="gauge-number">{{ label }}</div>
      <div *ngIf="description" class="gauge-description text-center">{{ description }}</div>
    </div>
  `, isInline: true, directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizGaugeComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pbds-dataviz-gauge',
                    template: `
    <div
      *ngIf="!hideLabel"
      class="gauge-details"
      [ngClass]="{ halfmoon: type === 'halfmoon', 'gauge-details-small': type === 'halfmoon' }"
      [ngStyle]="{ 'max-width.px': width - 3 * gaugeWidth, 'padding-top.px': detailsPaddingTop }"
    >
      <div class="gauge-number">{{ label }}</div>
      <div *ngIf="description" class="gauge-description text-center">{{ description }}</div>
    </div>
  `,
                    styles: []
                }]
        }], ctorParameters: function () { return [{ type: i1.PbdsDatavizService }, { type: i0.ElementRef }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], gaugeClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-gauge']
            }], data: [{
                type: Input
            }], width: [{
                type: Input
            }], type: [{
                type: Input
            }], color: [{
                type: Input
            }], hideLabel: [{
                type: Input
            }], labelFormatString: [{
                type: Input
            }], description: [{
                type: Input
            }], gaugeWidth: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1nYXVnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1nYXVnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQWMsV0FBVyxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUU1RyxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7O0FBb0JoRCxNQUFNLE9BQU8seUJBQXlCO0lBOENwQyxZQUFvQixRQUE0QixFQUFVLFFBQW9CO1FBQTFELGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQTVDOUUsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixlQUFVLEdBQUcsSUFBSSxDQUFDO1FBTWxCLFVBQUssR0FBRyxHQUFHLENBQUM7UUFHWixTQUFJLEdBQXdDLFVBQVUsQ0FBQztRQUd2RCxVQUFLLEdBQUcsU0FBUyxDQUFDO1FBR2xCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFHbEIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBTXZCLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFlUixzQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFvRDlCLHFCQUFnQixHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDNUIsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2xDLENBQUMsQ0FBQztRQUVGLG9CQUFlLEdBQUcsR0FBRyxFQUFFO1lBQ3JCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVsRixPQUFPLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RHLENBQUMsQ0FBQztRQUVGLG1CQUFjLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUVqRyxPQUFPO2dCQUNMO29CQUNFLFVBQVUsRUFBRSxLQUFLO29CQUNqQixRQUFRLEVBQUUsR0FBRztpQkFDZDthQUNGLENBQUM7UUFDSixDQUFDLENBQUM7UUFFRixjQUFTLEdBQUcsR0FBRyxFQUFFO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRS9ELGlCQUFpQjtZQUNqQixJQUFJLENBQUMsS0FBSztpQkFDUCxNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQzdDLElBQUksQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUM7aUJBQ2pDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDZixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7b0JBQ2QsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVU7b0JBQzFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTTtvQkFDeEIsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVO29CQUN4QixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7aUJBQ3JCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUwsWUFBWTtZQUNaLElBQUksQ0FBQyxLQUFLO2lCQUNQLE1BQU0sQ0FBQyxNQUFNLENBQUM7aUJBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7aUJBQ2pELElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO2lCQUM1QixJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQ3hCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDZixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7b0JBQ2QsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVU7b0JBQzFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTTtvQkFDeEIsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVO29CQUN4QixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7aUJBQ3JCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUwsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNqQixLQUFLLFdBQVc7b0JBQ2QsTUFBTSxRQUFRLEdBQWtCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUVoRSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEQsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUscUNBQXFDLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztvQkFFOUcsTUFBTSxTQUFTLEdBQVEsT0FBTyxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4RSxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRXBDLElBQUksQ0FBQyxHQUFHO3lCQUNMLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQzt5QkFDOUIsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBRTVGLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUV6QyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyx5Q0FBeUM7b0JBQzNELE1BQU07Z0JBQ1IsS0FBSyxVQUFVO29CQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEcsTUFBTTthQUNUO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsZ0JBQVcsR0FBRyxHQUFHLEVBQUU7WUFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFOUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFFcEcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVyRCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQztRQUVGLGFBQVEsR0FBRyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMvQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTVDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQzlCLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFckUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNYLENBQUMsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU1QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ2QsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVU7d0JBQzFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTTt3QkFDeEIsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVO3dCQUN4QixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7cUJBQ3JCLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLGNBQVMsR0FBRyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNoQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVqQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQzVCLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRTVFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDWCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUN6QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQzt3QkFDM0IsT0FBTyxhQUFhLENBQUM7b0JBQ3ZCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBN0srRSxDQUFDO0lBRWxGLFFBQVE7UUFDTixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUvQyxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakIsS0FBSyxVQUFVO2dCQUNiLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTTtZQUVSLEtBQUssV0FBVztnQkFDZCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU07WUFFUixLQUFLLFFBQVE7Z0JBQ1gsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO2dCQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztnQkFDckIsTUFBTTtTQUNUO1FBRUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFckUsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWhGLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUs7YUFDbEIsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUNiLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUN6QixJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDM0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUM7YUFDMUIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQzthQUM1QyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUUxRixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUM3QyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztZQUNqRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDOztzSEE5RlUseUJBQXlCOzBHQUF6Qix5QkFBeUIsMlhBYjFCOzs7Ozs7Ozs7O0dBVVQ7MkZBR1UseUJBQXlCO2tCQWZyQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRTs7Ozs7Ozs7OztHQVVUO29CQUNELE1BQU0sRUFBRSxFQUFFO2lCQUNYO2tJQUdDLFVBQVU7c0JBRFQsV0FBVzt1QkFBQyxrQkFBa0I7Z0JBSS9CLFVBQVU7c0JBRFQsV0FBVzt1QkFBQyx3QkFBd0I7Z0JBSXJDLElBQUk7c0JBREgsS0FBSztnQkFJTixLQUFLO3NCQURKLEtBQUs7Z0JBSU4sSUFBSTtzQkFESCxLQUFLO2dCQUlOLEtBQUs7c0JBREosS0FBSztnQkFJTixTQUFTO3NCQURSLEtBQUs7Z0JBSU4saUJBQWlCO3NCQURoQixLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBpbnRlcnBvbGF0ZSBhcyBkM19pbnRlcnBvbGF0ZSB9IGZyb20gJ2QzLWludGVycG9sYXRlJztcbmltcG9ydCB7IGFyYyBhcyBkM19hcmMgfSBmcm9tICdkMy1zaGFwZSc7XG5pbXBvcnQgeyBmb3JtYXQgYXMgZDNfZm9ybWF0IH0gZnJvbSAnZDMtZm9ybWF0JztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpHYXVnZSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWdhdWdlJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICAqbmdJZj1cIiFoaWRlTGFiZWxcIlxuICAgICAgY2xhc3M9XCJnYXVnZS1kZXRhaWxzXCJcbiAgICAgIFtuZ0NsYXNzXT1cInsgaGFsZm1vb246IHR5cGUgPT09ICdoYWxmbW9vbicsICdnYXVnZS1kZXRhaWxzLXNtYWxsJzogdHlwZSA9PT0gJ2hhbGZtb29uJyB9XCJcbiAgICAgIFtuZ1N0eWxlXT1cInsgJ21heC13aWR0aC5weCc6IHdpZHRoIC0gMyAqIGdhdWdlV2lkdGgsICdwYWRkaW5nLXRvcC5weCc6IGRldGFpbHNQYWRkaW5nVG9wIH1cIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJnYXVnZS1udW1iZXJcIj57eyBsYWJlbCB9fTwvZGl2PlxuICAgICAgPGRpdiAqbmdJZj1cImRlc2NyaXB0aW9uXCIgY2xhc3M9XCJnYXVnZS1kZXNjcmlwdGlvbiB0ZXh0LWNlbnRlclwiPnt7IGRlc2NyaXB0aW9uIH19PC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpHYXVnZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWdhdWdlJylcbiAgZ2F1Z2VDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogUGJkc0RhdGF2aXpHYXVnZTtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDMwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnaGFsZm1vb24nIHwgJ2hvcnNlc2hvZScgfCAnY2lyY2xlJyA9ICdoYWxmbW9vbic7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI0UyM0RBOCc7XG5cbiAgQElucHV0KClcbiAgaGlkZUxhYmVsID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgbGFiZWxGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBkZXNjcmlwdGlvbjtcblxuICBASW5wdXQoKVxuICBnYXVnZVdpZHRoID0gMjA7XG5cbiAgcHVibGljIGxhYmVsO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBnYXVnZTtcbiAgcHJpdmF0ZSBsYWJlbFR3ZWVuO1xuICBwcml2YXRlIHN0YXJ0QW5nbGU7XG4gIHByaXZhdGUgZW5kQW5nbGU7XG4gIHByaXZhdGUgcmFkaXVzO1xuICBwcml2YXRlIGFyYztcbiAgcHJpdmF0ZSBsYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSBvbGRWYWx1ZTtcbiAgcHJpdmF0ZSBoZWlnaHQ7XG4gIHByaXZhdGUgcm91bmRlZDtcbiAgcHJpdmF0ZSBkZXRhaWxzUGFkZGluZ1RvcCA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGF0YXZpejogUGJkc0RhdGF2aXpTZXJ2aWNlLCBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy53aWR0aDtcbiAgICB0aGlzLnJhZGl1cyA9IE1hdGgubWF4KHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KSAvIDI7XG4gICAgdGhpcy5sYWJlbEZvcm1hdCA9IGQzX2Zvcm1hdCh0aGlzLmxhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxhYmVsID0gdGhpcy5sYWJlbEZvcm1hdCh0aGlzLmRhdGEudmFsdWUpO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2hhbGZtb29uJzpcbiAgICAgICAgdGhpcy5zdGFydEFuZ2xlID0gLTkwO1xuICAgICAgICB0aGlzLmVuZEFuZ2xlID0gOTA7XG4gICAgICAgIHRoaXMucm91bmRlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdob3JzZXNob2UnOlxuICAgICAgICB0aGlzLnN0YXJ0QW5nbGUgPSAtMTQwO1xuICAgICAgICB0aGlzLmVuZEFuZ2xlID0gMTQwO1xuICAgICAgICB0aGlzLnJvdW5kZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgdGhpcy5zdGFydEFuZ2xlID0gMDtcbiAgICAgICAgdGhpcy5lbmRBbmdsZSA9IDM2MDtcbiAgICAgICAgdGhpcy5yb3VuZGVkID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuYXJjID0gZDNfYXJjKCkuY29ybmVyUmFkaXVzKHRoaXMucm91bmRlZCA/IHRoaXMuZ2F1Z2VXaWR0aCA6IDApO1xuXG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpXG4gICAgICAuYXR0cignY2xhc3MnLCAnaW1nLWZsdWlkJylcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluIG1lZXQnKVxuICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBgLSR7dGhpcy53aWR0aCAvIDJ9IC0ke3RoaXMuaGVpZ2h0IC8gMn0gJHt0aGlzLndpZHRofSAke3RoaXMuaGVpZ2h0fWApO1xuXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMub2xkVmFsdWUgPSBjaGFuZ2VzLmRhdGEucHJldmlvdXNWYWx1ZS52YWx1ZTtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICBkZWdyZWVzVG9SYWRpYW5zID0gKGRlZ3JlZSkgPT4ge1xuICAgIHJldHVybiAoZGVncmVlICogTWF0aC5QSSkgLyAxODA7XG4gIH07XG5cbiAgY2FsY3VsYXRlTWluTWF4ID0gKCkgPT4ge1xuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLmRhdGEubWludmFsdWUgLyAodGhpcy5kYXRhLm1heHZhbHVlIC0gdGhpcy5kYXRhLm1pbnZhbHVlKTtcblxuICAgIHJldHVybiBwZXJjZW50YWdlICogKHRoaXMuZGF0YS52YWx1ZSAtIHRoaXMuZGF0YS5taW52YWx1ZSkgKyAodGhpcy5kYXRhLnZhbHVlIC0gdGhpcy5kYXRhLm1pbnZhbHVlKTtcbiAgfTtcblxuICBjYWxjdWxhdGVDdXJ2ZSA9IChkYXRhKSA9PiB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmRlZ3JlZXNUb1JhZGlhbnModGhpcy5zdGFydEFuZ2xlKTtcbiAgICBjb25zdCBlbmQgPSBzdGFydCArIChkYXRhICogKHRoaXMuZGVncmVlc1RvUmFkaWFucyh0aGlzLmVuZEFuZ2xlKSAtIHN0YXJ0KSkgLyB0aGlzLmRhdGEubWF4dmFsdWU7XG5cbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBzdGFydEFuZ2xlOiBzdGFydCxcbiAgICAgICAgZW5kQW5nbGU6IGVuZFxuICAgICAgfVxuICAgIF07XG4gIH07XG5cbiAgZHJhd0NoYXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMuZ2F1Z2UgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdnYXVnZS1ncm91cCcpO1xuXG4gICAgLy8gYmFja2dyb3VuZCBhcmNcbiAgICB0aGlzLmdhdWdlXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5kYXRhKHRoaXMuY2FsY3VsYXRlQ3VydmUodGhpcy5kYXRhLm1heHZhbHVlKSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdnYXVnZS1iYWNrZ3JvdW5kJylcbiAgICAgIC5hdHRyKCdkJywgKGQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJjKHtcbiAgICAgICAgICBpbm5lclJhZGl1czogdGhpcy5yYWRpdXMgLSB0aGlzLmdhdWdlV2lkdGgsXG4gICAgICAgICAgb3V0ZXJSYWRpdXM6IHRoaXMucmFkaXVzLFxuICAgICAgICAgIHN0YXJ0QW5nbGU6IGQuc3RhcnRBbmdsZSxcbiAgICAgICAgICBlbmRBbmdsZTogZC5lbmRBbmdsZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgLy8gdmFsdWUgYXJjXG4gICAgdGhpcy5nYXVnZVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuZGF0YSh0aGlzLmNhbGN1bGF0ZUN1cnZlKHRoaXMuY2FsY3VsYXRlTWluTWF4KCkpKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dhdWdlLXZhbHVlJylcbiAgICAgIC5hdHRyKCdmaWxsJywgdGhpcy5jb2xvcilcbiAgICAgIC5hdHRyKCdkJywgKGQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJjKHtcbiAgICAgICAgICBpbm5lclJhZGl1czogdGhpcy5yYWRpdXMgLSB0aGlzLmdhdWdlV2lkdGgsXG4gICAgICAgICAgb3V0ZXJSYWRpdXM6IHRoaXMucmFkaXVzLFxuICAgICAgICAgIHN0YXJ0QW5nbGU6IGQuc3RhcnRBbmdsZSxcbiAgICAgICAgICBlbmRBbmdsZTogZC5lbmRBbmdsZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2hvcnNlc2hvZSc6XG4gICAgICAgIGNvbnN0IHN2Z0Nsb25lOiBTVkdTVkdFbGVtZW50ID0gdGhpcy5zdmcubm9kZSgpLmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICBjb25zdCBmYWtlU3ZnID0gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdmdDbG9uZSk7XG4gICAgICAgIGZha2VTdmcuc2V0QXR0cmlidXRlKCdzdHlsZScsICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IC0xMDAwMHB4OycpOyAvLyBwb3NpdGlvbiB0aGUgY2xvbmVkIGVsZW1lbnQgb2Zmc2NyZWVuXG5cbiAgICAgICAgY29uc3QgZmFrZUdyb3VwOiBhbnkgPSBmYWtlU3ZnLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2dhdWdlLWdyb3VwJylbMF07XG4gICAgICAgIGNvbnN0IGZha2VCb3ggPSBmYWtlR3JvdXAuZ2V0QkJveCgpO1xuXG4gICAgICAgIHRoaXMuc3ZnXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGZha2VCb3guaGVpZ2h0KVxuICAgICAgICAgIC5hdHRyKCd2aWV3Qm94JywgYC0ke3RoaXMud2lkdGggLyAyfSAtJHt0aGlzLndpZHRoIC8gMn0gJHt0aGlzLndpZHRofSAke2Zha2VCb3guaGVpZ2h0fWApO1xuXG4gICAgICAgIHRoaXMuZGV0YWlsc1BhZGRpbmdUb3AgPSB0aGlzLmdhdWdlV2lkdGg7XG5cbiAgICAgICAgZmFrZVN2Zy5yZW1vdmUoKTsgLy8gcmVtb3ZlIHRoZSBjbG9uZWQgZWxlbWVudCBmcm9tIHRoZSBET01cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdoYWxmbW9vbic6XG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoJ2hlaWdodCcsIHRoaXMud2lkdGggLyAyKTtcbiAgICAgICAgdGhpcy5zdmcuYXR0cigndmlld0JveCcsIGAtJHt0aGlzLndpZHRoIC8gMn0gLSR7dGhpcy53aWR0aCAvIDJ9ICR7dGhpcy53aWR0aH0gJHt0aGlzLndpZHRoIC8gMn1gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9O1xuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGdyb3VwID0gdGhpcy5zdmcuc2VsZWN0KCcuZ2F1Z2UtZ3JvdXAnKTtcblxuICAgIGdyb3VwLnNlbGVjdCgnLmdhdWdlLXZhbHVlJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkuY2FsbCh0aGlzLmFyY1R3ZWVuLCB0aGlzLmNhbGN1bGF0ZU1pbk1heCgpKTtcblxuICAgIHRoaXMubGFiZWxUd2VlbiA9IHRoaXMuY2hhcnQuc2VsZWN0KCcuZ2F1Z2UtbnVtYmVyJyk7XG5cbiAgICB0aGlzLmxhYmVsVHdlZW4udHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkuY2FsbCh0aGlzLnRleHRUd2VlbiwgdGhpcy5kYXRhLnZhbHVlKTtcbiAgfTtcblxuICBhcmNUd2VlbiA9ICh0cmFuc2l0aW9uLCB2YWx1ZSkgPT4ge1xuICAgIGNvbnN0IG5ld0FuZ2xlID0gdGhpcy5jYWxjdWxhdGVDdXJ2ZSh2YWx1ZSk7XG5cbiAgICB0cmFuc2l0aW9uLmF0dHJUd2VlbignZCcsIChkKSA9PiB7XG4gICAgICBjb25zdCBpbnRlcnBvbGF0ZSA9IGQzX2ludGVycG9sYXRlKGQuZW5kQW5nbGUsIG5ld0FuZ2xlWzBdLmVuZEFuZ2xlKTtcblxuICAgICAgcmV0dXJuICh0KSA9PiB7XG4gICAgICAgIGQuZW5kQW5nbGUgPSBpbnRlcnBvbGF0ZSh0KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcmMoe1xuICAgICAgICAgIGlubmVyUmFkaXVzOiB0aGlzLnJhZGl1cyAtIHRoaXMuZ2F1Z2VXaWR0aCxcbiAgICAgICAgICBvdXRlclJhZGl1czogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgc3RhcnRBbmdsZTogZC5zdGFydEFuZ2xlLFxuICAgICAgICAgIGVuZEFuZ2xlOiBkLmVuZEFuZ2xlXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICB0ZXh0VHdlZW4gPSAodHJhbnNpdGlvbiwgdmFsdWUpID0+IHtcbiAgICB2YWx1ZSA9IGQzX2Zvcm1hdCgnLjRmJykodmFsdWUpO1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvLC9nLCAnLicpO1xuXG4gICAgdHJhbnNpdGlvbi50d2VlbigndGV4dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGludGVycG9sYXRlID0gZDNfaW50ZXJwb2xhdGUoZDNfZm9ybWF0KCcuNGYnKSgrdGhpcy5vbGRWYWx1ZSksIHZhbHVlKTtcblxuICAgICAgcmV0dXJuICh0KSA9PiB7XG4gICAgICAgIHRoaXMubGFiZWxUd2Vlbi50ZXh0KChkKSA9PiB7XG4gICAgICAgICAgY29uc3QgdXBkYXRlZE51bWJlciA9IHRoaXMubGFiZWxGb3JtYXQoaW50ZXJwb2xhdGUodCkpO1xuICAgICAgICAgIHRoaXMubGFiZWwgPSB1cGRhdGVkTnVtYmVyO1xuICAgICAgICAgIHJldHVybiB1cGRhdGVkTnVtYmVyO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG59XG4iXX0=
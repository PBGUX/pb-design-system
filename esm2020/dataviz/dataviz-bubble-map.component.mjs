import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { scaleLinear as d3_scaleLinear } from 'd3-scale';
import { min as d3_min, max as d3_max } from 'd3-array';
import { geoPath as d3_geoPath, geoAlbers as d3_geoAlbers, geoAlbersUsa as d3_geoAlbersUsa, geoMercator as d3_geoMercator } from 'd3-geo';
import * as topojson from 'topojson-client';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./dataviz.service";
export class PbdsDatavizBubbleMapComponent {
    constructor(_element, _scroll, _dataviz) {
        this._element = _element;
        this._scroll = _scroll;
        this._dataviz = _dataviz;
        this.chartClass = true;
        this.bubbleMapClass = true;
        this.feature = '';
        this.scale = null;
        this.center = null;
        this.width = 306;
        this.height = 400;
        this.type = 'medium'; // debug to show all chart options
        this.dot = false;
        this.marginTop = 0;
        this.marginRight = 0;
        this.marginBottom = 0;
        this.marginLeft = 0;
        this.color = '#ef8200';
        this.textColor = '#fff';
        this.textSizeRange = [14, 24];
        this.dotSize = 4;
        this.bubbleSizeRange = [500, 2000];
        this.bubbleLabelFormatType = null;
        this.bubbleLabelFormatString = '';
        this.hideTooltip = false;
        this.hideTooltipValue = false;
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = () => {
            // bubbles
            this.bubbleContainer
                .selectAll('circle')
                .data(this.data)
                .join((enter) => enter
                .append('circle')
                .attr('class', 'dot-circle')
                .classed('solid', this.dot)
                .attr('cx', (d) => this.projection([d.longitude, d.latitude])[0])
                .attr('cy', (d) => this.projection([d.longitude, d.latitude])[1])
                .attr('r', (d) => (!this.dot ? Math.sqrt(this.bubbleRadius(d.value)) : `${this.dotSize}px`)), (update) => update
                .transition()
                .duration(1000)
                .attr('cx', (d) => this.projection([d.longitude, d.latitude])[0])
                .attr('cy', (d) => this.projection([d.longitude, d.latitude])[1])
                .attr('r', (d) => (!this.dot ? Math.sqrt(this.bubbleRadius(d.value)) : `${this.dotSize}px`))
                .transition()
                .selection()
                .attr('pointer-events', 'auto'), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove());
            if (!this.hideTooltip) {
                this.bubbleContainer
                    .selectAll('circle')
                    .on('mouseover', (event, data) => this.bubbleMouseOver(event, data))
                    .on('mouseout', (event, data) => this.bubbleMouseOut(event, data))
                    .on('click', (event, data) => this.bubbleMouseClick(event, data));
                // bubble text
                if (this.type !== 'high' && !this.dot) {
                    this.bubbleContainer
                        .selectAll('text')
                        .data(this.data)
                        .join((enter) => enter
                        .append('text')
                        .text((d) => (this.bubbleLabelFormat ? this.bubbleLabelFormat(d.value) : d.value))
                        .attr('class', 'dot-text')
                        .style('fill', this.textColor)
                        .style('font-size', (d) => `${Math.round(this.fontRange(d.value))}px`)
                        .attr('x', (d) => this.projection([d.longitude, d.latitude])[0])
                        .attr('y', (d) => this.projection([d.longitude, d.latitude])[1])
                        .attr('dy', '.4em'), (update) => update
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(1000)
                        .text((d) => (this.bubbleLabelFormat ? this.bubbleLabelFormat(d.value) : d.value))
                        .style('font-size', (d) => `${Math.round(this.fontRange(d.value))}px`)
                        .attr('x', (d) => this.projection([d.longitude, d.latitude])[0])
                        .attr('y', (d) => this.projection([d.longitude, d.latitude])[1])
                        .attr('dy', '.4em')
                        .transition()
                        .selection()
                        .attr('pointer-events', 'auto'), (exit) => exit.transition().selection().attr('pointer-events', 'none').remove());
                }
            }
        };
        this.bubbleMouseOver = (event, data) => {
            this.chart.selectAll('.dot-circle').classed('inactive', true);
            d3_select(event.currentTarget).classed('active', true).classed('inactive', false);
            this.tooltipShow(event, data);
            this.hovered.emit({ event, data });
        };
        this.bubbleMouseOut = (event, data) => {
            this.chart.selectAll('.dot-circle').classed('active', false).classed('inactive', false);
            this.tooltipHide();
        };
        this.bubbleMouseClick = (event, data) => {
            this.clicked.emit({ event, data });
        };
        this.tooltipShow = (event, data) => {
            const dimensions = event.currentTarget.getBoundingClientRect();
            const scroll = this._scroll.getScrollPosition();
            this.tooltip.select('.tooltip-header').html((d) => `${data.label}`);
            if (!this.hideTooltipValue) {
                this.tooltip
                    .select('.tooltip-value')
                    .html((d) => (this.tooltipValueFormat ? `${this.tooltipValueFormat(data.value)}` : `${data.value}`));
            }
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight + 8;
            this.tooltip.style('top', `${+scroll[1] + +dimensions.top - tooltipOffsetHeight}px`); //
            this.tooltip.style('left', `${+scroll[0] + +dimensions.left - tooltipOffsetWidth + +dimensions.width / 2}px`);
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
    }
    ngOnInit() {
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        if (this.type !== 'debug') {
            // set type defaults
            switch (this.type) {
                case 'medium':
                    break;
                case 'high':
                    break;
            }
        }
        switch (this.projectionType) {
            case 'geoAlbers':
                this.projection = d3_geoAlbers();
                break;
            case 'geoAlbersUsa':
                this.projection = d3_geoAlbersUsa();
                break;
            case 'geoMercator':
                this.projection = d3_geoMercator();
                break;
            default:
                break;
        }
        // dreate formatters
        this.bubbleLabelFormat = this._dataviz.d3Format(this.bubbleLabelFormatType, this.bubbleLabelFormatString);
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        // console.log('TOPOJSON: ', this.topojson);
        this.topojsonFeature = topojson.feature(this.topojson, this.topojson.objects[this.feature]);
        this.projection.fitSize([+this.width, +this.height], this.topojsonFeature);
        // console.log('TOPOJSON FEATURE: ', this.topojsonFeature);
        // console.log('MESH: ', topojson.mesh(this.topojson, this.topojson.objects[this.feature], (a, b) => a !== b));
        // console.log('DATA: ', this.data);
        if (this.scale) {
            this.projection.scale(+this.scale);
        }
        if (this.center) {
            this.projection.center(this.center);
        }
        this.geoPath = d3_geoPath().projection(this.projection);
        // bubble radius range
        if (this.data && !this.dot) {
            this.bubbleRadius = d3_scaleLinear()
                .range(this.bubbleSizeRange)
                .domain([d3_min(this.data, (d) => +d.value), d3_max(this.data, (d) => +d.value)]);
            // font range
            this.fontRange = d3_scaleLinear()
                .range(this.textSizeRange)
                .domain([d3_min(this.data, (d) => +d.value), d3_max(this.data, (d) => +d.value)]);
        }
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', 'pbds-tooltip south')
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
            // tooltip header
            this.tooltip.append('div').attr('class', 'tooltip-header');
            if (!this.hideTooltipValue)
                this.tooltip.append('div').attr('class', 'tooltip-value');
        }
        // create the chart
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width + this.margin.left + this.margin.right)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width + this.margin.left + this.margin.right} ${+this.height + this.margin.top + this.margin.bottom}`)
            .append('g')
            .attr('class', 'container');
        // map
        this.svg
            .append('g')
            .attr('class', 'map')
            .selectAll('path')
            .data(this.topojsonFeature.features)
            .join((enter) => enter.append('path').attr('class', 'feature').attr('d', this.geoPath));
        // borders
        this.svg
            .append('path')
            .attr('class', 'mesh')
            .datum(topojson.mesh(this.topojson, this.topojson.objects[this.feature], (a, b) => a !== b))
            .attr('d', this.geoPath);
        this.bubbleContainer = this.svg.append('g').attr('class', 'dots').style('color', this.color);
        this.updateChart();
    }
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            this.updateChart();
        }
    }
    ngOnDestroy() {
        if (this.tooltip)
            this.tooltip.remove();
    }
}
PbdsDatavizBubbleMapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizBubbleMapComponent, deps: [{ token: i0.ElementRef }, { token: i1.ViewportScroller }, { token: i2.PbdsDatavizService }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizBubbleMapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: PbdsDatavizBubbleMapComponent, selector: "pbds-dataviz-bubble-map", inputs: { data: "data", topojson: "topojson", feature: "feature", projectionType: "projectionType", scale: "scale", center: "center", width: "width", height: "height", type: "type", dot: "dot", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", color: "color", textColor: "textColor", textSizeRange: "textSizeRange", dotSize: "dotSize", bubbleSizeRange: "bubbleSizeRange", bubbleLabelFormatType: "bubbleLabelFormatType", bubbleLabelFormatString: "bubbleLabelFormatString", hideTooltip: "hideTooltip", hideTooltipValue: "hideTooltipValue", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-bubble-map": "this.bubbleMapClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizBubbleMapComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pbds-dataviz-bubble-map',
                    template: ``,
                    styles: [],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ViewportScroller }, { type: i2.PbdsDatavizService }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], bubbleMapClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-bubble-map']
            }], data: [{
                type: Input
            }], topojson: [{
                type: Input
            }], feature: [{
                type: Input
            }], projectionType: [{
                type: Input
            }], scale: [{
                type: Input
            }], center: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], type: [{
                type: Input
            }], dot: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], color: [{
                type: Input
            }], textColor: [{
                type: Input
            }], textSizeRange: [{
                type: Input
            }], dotSize: [{
                type: Input
            }], bubbleSizeRange: [{
                type: Input
            }], bubbleLabelFormatType: [{
                type: Input
            }], bubbleLabelFormatString: [{
                type: Input
            }], hideTooltip: [{
                type: Input
            }], hideTooltipValue: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1idWJibGUtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0YXZpei9kYXRhdml6LWJ1YmJsZS1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBRVosV0FBVyxFQUdYLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hELE9BQU8sRUFDTCxPQUFPLElBQUksVUFBVSxFQUNyQixTQUFTLElBQUksWUFBWSxFQUN6QixZQUFZLElBQUksZUFBZSxFQUMvQixXQUFXLElBQUksY0FBYyxFQUM5QixNQUFNLFFBQVEsQ0FBQztBQUVoQixPQUFPLEtBQUssUUFBUSxNQUFNLGlCQUFpQixDQUFDOzs7O0FBVzVDLE1BQU0sT0FBTyw2QkFBNkI7SUFxR3hDLFlBQW9CLFFBQW9CLEVBQVUsT0FBeUIsRUFBVSxRQUE0QjtRQUE3RixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQW5HakgsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixtQkFBYyxHQUFHLElBQUksQ0FBQztRQVN0QixZQUFPLEdBQUcsRUFBRSxDQUFDO1FBTWIsVUFBSyxHQUFHLElBQUksQ0FBQztRQUdiLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFHZCxVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osV0FBTSxHQUFHLEdBQUcsQ0FBQztRQUdiLFNBQUksR0FBZ0MsUUFBUSxDQUFDLENBQUMsa0NBQWtDO1FBR2hGLFFBQUcsR0FBRyxLQUFLLENBQUM7UUFHWixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBR2QsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFHaEIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFHakIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUdmLFVBQUssR0FBRyxTQUFTLENBQUM7UUFHbEIsY0FBUyxHQUFHLE1BQU0sQ0FBQztRQUduQixrQkFBYSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBR3pCLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFHWixvQkFBZSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRzlCLDBCQUFxQixHQUFhLElBQUksQ0FBQztRQUd2Qyw0QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFHN0IsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFHcEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBR3pCLDJCQUFzQixHQUFhLElBQUksQ0FBQztRQUd4Qyw2QkFBd0IsR0FBRyxFQUFFLENBQUM7UUFHOUIsWUFBTyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBRzNELFlBQU8sR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQXNKM0QsZ0JBQVcsR0FBRyxHQUFHLEVBQUU7WUFDakIsVUFBVTtZQUVWLElBQUksQ0FBQyxlQUFlO2lCQUNqQixTQUFTLENBQUMsUUFBUSxDQUFDO2lCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDZixJQUFJLENBQ0gsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUNSLEtBQUs7aUJBQ0YsTUFBTSxDQUFDLFFBQVEsQ0FBQztpQkFDaEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7aUJBQzNCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDMUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2hFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLEVBQ2hHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDVCxNQUFNO2lCQUNILFVBQVUsRUFBRTtpQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDO2lCQUNkLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDaEUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFD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Z2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBzY2FsZUxpbmVhciBhcyBkM19zY2FsZUxpbmVhciB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IG1pbiBhcyBkM19taW4sIG1heCBhcyBkM19tYXggfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge1xuICBnZW9QYXRoIGFzIGQzX2dlb1BhdGgsXG4gIGdlb0FsYmVycyBhcyBkM19nZW9BbGJlcnMsXG4gIGdlb0FsYmVyc1VzYSBhcyBkM19nZW9BbGJlcnNVc2EsXG4gIGdlb01lcmNhdG9yIGFzIGQzX2dlb01lcmNhdG9yXG59IGZyb20gJ2QzLWdlbyc7XG5cbmltcG9ydCAqIGFzIHRvcG9qc29uIGZyb20gJ3RvcG9qc29uLWNsaWVudCc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6TWFwRGF0YSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWJ1YmJsZS1tYXAnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1idWJibGUtbWFwJylcbiAgYnViYmxlTWFwQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6TWFwRGF0YT47XG5cbiAgQElucHV0KClcbiAgdG9wb2pzb247XG5cbiAgQElucHV0KClcbiAgZmVhdHVyZSA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHByb2plY3Rpb25UeXBlO1xuXG4gIEBJbnB1dCgpXG4gIHNjYWxlID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBjZW50ZXIgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzA2O1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbWVkaXVtJyB8ICdoaWdoJyB8ICdkZWJ1ZycgPSAnbWVkaXVtJzsgLy8gZGVidWcgdG8gc2hvdyBhbGwgY2hhcnQgb3B0aW9uc1xuXG4gIEBJbnB1dCgpXG4gIGRvdCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDA7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI2VmODIwMCc7XG5cbiAgQElucHV0KClcbiAgdGV4dENvbG9yID0gJyNmZmYnO1xuXG4gIEBJbnB1dCgpXG4gIHRleHRTaXplUmFuZ2UgPSBbMTQsIDI0XTtcblxuICBASW5wdXQoKVxuICBkb3RTaXplID0gNDtcblxuICBASW5wdXQoKVxuICBidWJibGVTaXplUmFuZ2UgPSBbNTAwLCAyMDAwXTtcblxuICBASW5wdXQoKVxuICBidWJibGVMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBidWJibGVMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgaGlkZVRvb2x0aXBWYWx1ZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIHByb2plY3Rpb247XG4gIHByaXZhdGUgZ2VvUGF0aDtcbiAgcHJpdmF0ZSB0b3BvanNvbkZlYXR1cmU7XG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcbiAgcHJpdmF0ZSBidWJibGVDb250YWluZXI7XG4gIHByaXZhdGUgYnViYmxlUmFkaXVzO1xuICBwcml2YXRlIGZvbnRSYW5nZTtcbiAgcHJpdmF0ZSBidWJibGVMYWJlbEZvcm1hdDtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIsIHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdkZWJ1ZycpIHtcbiAgICAgIC8vIHNldCB0eXBlIGRlZmF1bHRzXG4gICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICBjYXNlICdtZWRpdW0nOlxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2hpZ2gnOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy5wcm9qZWN0aW9uVHlwZSkge1xuICAgICAgY2FzZSAnZ2VvQWxiZXJzJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9BbGJlcnNVc2EnOlxuICAgICAgICB0aGlzLnByb2plY3Rpb24gPSBkM19nZW9BbGJlcnNVc2EoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2dlb01lcmNhdG9yJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvTWVyY2F0b3IoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIGRyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy5idWJibGVMYWJlbEZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy5idWJibGVMYWJlbEZvcm1hdFR5cGUsIHRoaXMuYnViYmxlTGFiZWxGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTjogJywgdGhpcy50b3BvanNvbik7XG5cbiAgICB0aGlzLnRvcG9qc29uRmVhdHVyZSA9IHRvcG9qc29uLmZlYXR1cmUodGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0pO1xuICAgIHRoaXMucHJvamVjdGlvbi5maXRTaXplKFsrdGhpcy53aWR0aCwgK3RoaXMuaGVpZ2h0XSwgdGhpcy50b3BvanNvbkZlYXR1cmUpO1xuXG4gICAgLy8gY29uc29sZS5sb2coJ1RPUE9KU09OIEZFQVRVUkU6ICcsIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcbiAgICAvLyBjb25zb2xlLmxvZygnTUVTSDogJywgdG9wb2pzb24ubWVzaCh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKTtcbiAgICAvLyBjb25zb2xlLmxvZygnREFUQTogJywgdGhpcy5kYXRhKTtcblxuICAgIGlmICh0aGlzLnNjYWxlKSB7XG4gICAgICB0aGlzLnByb2plY3Rpb24uc2NhbGUoK3RoaXMuc2NhbGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNlbnRlcikge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLmNlbnRlcih0aGlzLmNlbnRlcik7XG4gICAgfVxuXG4gICAgdGhpcy5nZW9QYXRoID0gZDNfZ2VvUGF0aCgpLnByb2plY3Rpb24odGhpcy5wcm9qZWN0aW9uKTtcblxuICAgIC8vIGJ1YmJsZSByYWRpdXMgcmFuZ2VcbiAgICBpZiAodGhpcy5kYXRhICYmICF0aGlzLmRvdCkge1xuICAgICAgdGhpcy5idWJibGVSYWRpdXMgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAgIC5yYW5nZSh0aGlzLmJ1YmJsZVNpemVSYW5nZSlcbiAgICAgICAgLmRvbWFpbihbZDNfbWluKHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gK2QudmFsdWUpLCBkM19tYXgodGhpcy5kYXRhLCAoZDogYW55KSA9PiArZC52YWx1ZSldKTtcblxuICAgICAgLy8gZm9udCByYW5nZVxuICAgICAgdGhpcy5mb250UmFuZ2UgPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAgIC5yYW5nZSh0aGlzLnRleHRTaXplUmFuZ2UpXG4gICAgICAgIC5kb21haW4oW2QzX21pbih0aGlzLmRhdGEsIChkOiBhbnkpID0+ICtkLnZhbHVlKSwgZDNfbWF4KHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gK2QudmFsdWUpXSk7XG4gICAgfVxuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXInKTtcbiAgICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcFZhbHVlKSB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLXZhbHVlJyk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHRoZSBjaGFydFxuICAgIHRoaXMuY2hhcnQgPSBkM19zZWxlY3QodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHQpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGggKyB0aGlzLm1hcmdpbi5sZWZ0ICsgdGhpcy5tYXJnaW4ucmlnaHR9ICR7XG4gICAgICAgICAgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tXG4gICAgICAgIH1gXG4gICAgICApXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdjb250YWluZXInKTtcblxuICAgIC8vIG1hcFxuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdtYXAnKVxuICAgICAgLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAuZGF0YSh0aGlzLnRvcG9qc29uRmVhdHVyZS5mZWF0dXJlcylcbiAgICAgIC5qb2luKChlbnRlcikgPT4gZW50ZXIuYXBwZW5kKCdwYXRoJykuYXR0cignY2xhc3MnLCAnZmVhdHVyZScpLmF0dHIoJ2QnLCB0aGlzLmdlb1BhdGgpKTtcblxuICAgIC8vIGJvcmRlcnNcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWVzaCcpXG4gICAgICAuZGF0dW0odG9wb2pzb24ubWVzaCh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKVxuICAgICAgLmF0dHIoJ2QnLCB0aGlzLmdlb1BhdGgpO1xuXG4gICAgdGhpcy5idWJibGVDb250YWluZXIgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdkb3RzJykuc3R5bGUoJ2NvbG9yJywgdGhpcy5jb2xvcik7XG5cbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgLy8gYnViYmxlc1xuXG4gICAgdGhpcy5idWJibGVDb250YWluZXJcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuam9pbihcbiAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2RvdC1jaXJjbGUnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ3NvbGlkJywgdGhpcy5kb3QpXG4gICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVsxXSlcbiAgICAgICAgICAgIC5hdHRyKCdyJywgKGQpID0+ICghdGhpcy5kb3QgPyBNYXRoLnNxcnQodGhpcy5idWJibGVSYWRpdXMoZC52YWx1ZSkpIDogYCR7dGhpcy5kb3RTaXplfXB4YCkpLFxuICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVsxXSlcbiAgICAgICAgICAgIC5hdHRyKCdyJywgKGQpID0+ICghdGhpcy5kb3QgPyBNYXRoLnNxcnQodGhpcy5idWJibGVSYWRpdXMoZC52YWx1ZSkpIDogYCR7dGhpcy5kb3RTaXplfXB4YCkpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuc2VsZWN0aW9uKClcbiAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgIChleGl0KSA9PiBleGl0LnRyYW5zaXRpb24oKS5zZWxlY3Rpb24oKS5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJykucmVtb3ZlKClcbiAgICAgICk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJ1YmJsZU1vdXNlT3ZlcihldmVudCwgZGF0YSkpXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuYnViYmxlTW91c2VPdXQoZXZlbnQsIGRhdGEpKVxuICAgICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJ1YmJsZU1vdXNlQ2xpY2soZXZlbnQsIGRhdGEpKTtcblxuICAgICAgLy8gYnViYmxlIHRleHRcbiAgICAgIGlmICh0aGlzLnR5cGUgIT09ICdoaWdoJyAmJiAhdGhpcy5kb3QpIHtcbiAgICAgICAgdGhpcy5idWJibGVDb250YWluZXJcbiAgICAgICAgICAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAgICAgLmpvaW4oXG4gICAgICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgICAgIGVudGVyXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgICAgLnRleHQoKGQpID0+ICh0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0ID8gdGhpcy5idWJibGVMYWJlbEZvcm1hdChkLnZhbHVlKSA6IGQudmFsdWUpKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdkb3QtdGV4dCcpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgdGhpcy50ZXh0Q29sb3IpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCAoZCkgPT4gYCR7TWF0aC5yb3VuZCh0aGlzLmZvbnRSYW5nZShkLnZhbHVlKSl9cHhgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVswXSlcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2R5JywgJy40ZW0nKSxcbiAgICAgICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgLnRleHQoKGQpID0+ICh0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0ID8gdGhpcy5idWJibGVMYWJlbEZvcm1hdChkLnZhbHVlKSA6IGQudmFsdWUpKVxuICAgICAgICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgKGQpID0+IGAke01hdGgucm91bmQodGhpcy5mb250UmFuZ2UoZC52YWx1ZSkpfXB4YClcbiAgICAgICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMF0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzFdKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkeScsICcuNGVtJylcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLnNlbGVjdGlvbigpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKSxcbiAgICAgICAgICAgIChleGl0KSA9PiBleGl0LnRyYW5zaXRpb24oKS5zZWxlY3Rpb24oKS5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdub25lJykucmVtb3ZlKClcbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBidWJibGVNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICB0aGlzLmNoYXJ0LnNlbGVjdEFsbCgnLmRvdC1jaXJjbGUnKS5jbGFzc2VkKCdpbmFjdGl2ZScsIHRydWUpO1xuXG4gICAgZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsYXNzZWQoJ2FjdGl2ZScsIHRydWUpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy50b29sdGlwU2hvdyhldmVudCwgZGF0YSk7XG5cbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIGJ1YmJsZU1vdXNlT3V0ID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5kb3QtY2lyY2xlJykuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpLmNsYXNzZWQoJ2luYWN0aXZlJywgZmFsc2UpO1xuXG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGJ1YmJsZU1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICB0aGlzLmNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcblxuICAgIHRoaXMudG9vbHRpcC5zZWxlY3QoJy50b29sdGlwLWhlYWRlcicpLmh0bWwoKGQpID0+IGAke2RhdGEubGFiZWx9YCk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXBWYWx1ZSkge1xuICAgICAgdGhpcy50b29sdGlwXG4gICAgICAgIC5zZWxlY3QoJy50b29sdGlwLXZhbHVlJylcbiAgICAgICAgLmh0bWwoKGQpID0+ICh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA/IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfWAgOiBgJHtkYXRhLnZhbHVlfWApKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0V2lkdGggPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodCArIDg7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAkeytzY3JvbGxbMV0gKyArZGltZW5zaW9ucy50b3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0fXB4YCk7IC8vXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7K3Njcm9sbFswXSArICtkaW1lbnNpb25zLmxlZnQgLSB0b29sdGlwT2Zmc2V0V2lkdGggKyArZGltZW5zaW9ucy53aWR0aCAvIDJ9cHhgKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xufVxuIl19
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
        this.tooltipHeaderSuffix = '';
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
            this.tooltip.select('.tooltip-header').html((d) => `${data.label}${this.tooltipHeaderSuffix}`);
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
PbdsDatavizBubbleMapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: PbdsDatavizBubbleMapComponent, selector: "pbds-dataviz-bubble-map", inputs: { data: "data", topojson: "topojson", feature: "feature", projectionType: "projectionType", scale: "scale", center: "center", width: "width", height: "height", type: "type", dot: "dot", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", color: "color", textColor: "textColor", textSizeRange: "textSizeRange", dotSize: "dotSize", bubbleSizeRange: "bubbleSizeRange", bubbleLabelFormatType: "bubbleLabelFormatType", bubbleLabelFormatString: "bubbleLabelFormatString", hideTooltip: "hideTooltip", hideTooltipValue: "hideTooltipValue", tooltipHeaderSuffix: "tooltipHeaderSuffix", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-bubble-map": "this.bubbleMapClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
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
            }], tooltipHeaderSuffix: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1idWJibGUtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0YXZpei9kYXRhdml6LWJ1YmJsZS1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBRVosV0FBVyxFQUdYLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hELE9BQU8sRUFDTCxPQUFPLElBQUksVUFBVSxFQUNyQixTQUFTLElBQUksWUFBWSxFQUN6QixZQUFZLElBQUksZUFBZSxFQUMvQixXQUFXLElBQUksY0FBYyxFQUM5QixNQUFNLFFBQVEsQ0FBQztBQUVoQixPQUFPLEtBQUssUUFBUSxNQUFNLGlCQUFpQixDQUFDOzs7O0FBVzVDLE1BQU0sT0FBTyw2QkFBNkI7SUF3R3hDLFlBQW9CLFFBQW9CLEVBQVUsT0FBeUIsRUFBVSxRQUE0QjtRQUE3RixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQXRHakgsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixtQkFBYyxHQUFHLElBQUksQ0FBQztRQVN0QixZQUFPLEdBQUcsRUFBRSxDQUFDO1FBTWIsVUFBSyxHQUFHLElBQUksQ0FBQztRQUdiLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFHZCxVQUFLLEdBQUcsR0FBRyxDQUFDO1FBR1osV0FBTSxHQUFHLEdBQUcsQ0FBQztRQUdiLFNBQUksR0FBZ0MsUUFBUSxDQUFDLENBQUMsa0NBQWtDO1FBR2hGLFFBQUcsR0FBRyxLQUFLLENBQUM7UUFHWixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBR2QsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFHaEIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFHakIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUdmLFVBQUssR0FBRyxTQUFTLENBQUM7UUFHbEIsY0FBUyxHQUFHLE1BQU0sQ0FBQztRQUduQixrQkFBYSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBR3pCLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFHWixvQkFBZSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRzlCLDBCQUFxQixHQUFhLElBQUksQ0FBQztRQUd2Qyw0QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFHN0IsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFHcEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBR3pCLHdCQUFtQixHQUFHLEVBQUUsQ0FBQztRQUd6QiwyQkFBc0IsR0FBYSxJQUFJLENBQUM7UUFHeEMsNkJBQXdCLEdBQUcsRUFBRSxDQUFDO1FBRzlCLFlBQU8sR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUczRCxZQUFPLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFzSjNELGdCQUFXLEdBQUcsR0FBRyxFQUFFO1lBQ2pCLFVBQVU7WUFFVixJQUFJLENBQUMsZUFBZTtpQkFDakIsU0FBUyxDQUFDLFFBQVEsQ0FBQztpQkFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7aUJBQ2YsSUFBSSxDQUNILENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FDUixLQUFLO2lCQUNGLE1BQU0sQ0FBQyxRQUFRLENBQUM7aUJBQ2hCLElBQUksQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO2lCQUMzQixPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQzFCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDaEUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxFQUNoRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ1QsTUFBTTtpQkFDSCxVQUFVLEVBQUU7aUJBQ1osUUFBUSxDQUFDLElBQUksQ0FBQztpQkFDZCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDaEUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2hFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxD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O3NCQUROLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBzY2FsZUxpbmVhciBhcyBkM19zY2FsZUxpbmVhciB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IG1pbiBhcyBkM19taW4sIG1heCBhcyBkM19tYXggfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge1xuICBnZW9QYXRoIGFzIGQzX2dlb1BhdGgsXG4gIGdlb0FsYmVycyBhcyBkM19nZW9BbGJlcnMsXG4gIGdlb0FsYmVyc1VzYSBhcyBkM19nZW9BbGJlcnNVc2EsXG4gIGdlb01lcmNhdG9yIGFzIGQzX2dlb01lcmNhdG9yXG59IGZyb20gJ2QzLWdlbyc7XG5cbmltcG9ydCAqIGFzIHRvcG9qc29uIGZyb20gJ3RvcG9qc29uLWNsaWVudCc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcbmltcG9ydCB7IFBiZHNEYXRhdml6TWFwRGF0YSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWJ1YmJsZS1tYXAnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1idWJibGUtbWFwJylcbiAgYnViYmxlTWFwQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6TWFwRGF0YT47XG5cbiAgQElucHV0KClcbiAgdG9wb2pzb247XG5cbiAgQElucHV0KClcbiAgZmVhdHVyZSA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHByb2plY3Rpb25UeXBlO1xuXG4gIEBJbnB1dCgpXG4gIHNjYWxlID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBjZW50ZXIgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gMzA2O1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDQwMDtcblxuICBASW5wdXQoKVxuICB0eXBlOiAnbWVkaXVtJyB8ICdoaWdoJyB8ICdkZWJ1ZycgPSAnbWVkaXVtJzsgLy8gZGVidWcgdG8gc2hvdyBhbGwgY2hhcnQgb3B0aW9uc1xuXG4gIEBJbnB1dCgpXG4gIGRvdCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDA7XG5cbiAgQElucHV0KClcbiAgY29sb3IgPSAnI2VmODIwMCc7XG5cbiAgQElucHV0KClcbiAgdGV4dENvbG9yID0gJyNmZmYnO1xuXG4gIEBJbnB1dCgpXG4gIHRleHRTaXplUmFuZ2UgPSBbMTQsIDI0XTtcblxuICBASW5wdXQoKVxuICBkb3RTaXplID0gNDtcblxuICBASW5wdXQoKVxuICBidWJibGVTaXplUmFuZ2UgPSBbNTAwLCAyMDAwXTtcblxuICBASW5wdXQoKVxuICBidWJibGVMYWJlbEZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBidWJibGVMYWJlbEZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgaGlkZVRvb2x0aXBWYWx1ZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBIZWFkZXJTdWZmaXggPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBwcm9qZWN0aW9uO1xuICBwcml2YXRlIGdlb1BhdGg7XG4gIHByaXZhdGUgdG9wb2pzb25GZWF0dXJlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgYnViYmxlQ29udGFpbmVyO1xuICBwcml2YXRlIGJ1YmJsZVJhZGl1cztcbiAgcHJpdmF0ZSBmb250UmFuZ2U7XG4gIHByaXZhdGUgYnViYmxlTGFiZWxGb3JtYXQ7XG4gIHByaXZhdGUgdG9vbHRpcDtcbiAgcHJpdmF0ZSB0b29sdGlwVmFsdWVGb3JtYXQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyLCBwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXJnaW4gPSB7XG4gICAgICB0b3A6ICt0aGlzLm1hcmdpblRvcCxcbiAgICAgIHJpZ2h0OiArdGhpcy5tYXJnaW5SaWdodCxcbiAgICAgIGJvdHRvbTogK3RoaXMubWFyZ2luQm90dG9tLFxuICAgICAgbGVmdDogK3RoaXMubWFyZ2luTGVmdFxuICAgIH07XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnZGVidWcnKSB7XG4gICAgICAvLyBzZXQgdHlwZSBkZWZhdWx0c1xuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdoaWdoJzpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMucHJvamVjdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgJ2dlb0FsYmVycyc6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb0FsYmVycygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZ2VvQWxiZXJzVXNhJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzVXNhKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9NZXJjYXRvcic6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb01lcmNhdG9yKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBkcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMuYnViYmxlTGFiZWxGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMuYnViYmxlTGFiZWxGb3JtYXRUeXBlLCB0aGlzLmJ1YmJsZUxhYmVsRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA9IHRoaXMuX2RhdGF2aXouZDNGb3JtYXQodGhpcy50b29sdGlwVmFsdWVGb3JtYXRUeXBlLCB0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnVE9QT0pTT046ICcsIHRoaXMudG9wb2pzb24pO1xuXG4gICAgdGhpcy50b3BvanNvbkZlYXR1cmUgPSB0b3BvanNvbi5mZWF0dXJlKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLmZlYXR1cmVdKTtcbiAgICB0aGlzLnByb2plY3Rpb24uZml0U2l6ZShbK3RoaXMud2lkdGgsICt0aGlzLmhlaWdodF0sIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTiBGRUFUVVJFOiAnLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG4gICAgLy8gY29uc29sZS5sb2coJ01FU0g6ICcsIHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ0RBVEE6ICcsIHRoaXMuZGF0YSk7XG5cbiAgICBpZiAodGhpcy5zY2FsZSkge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLnNjYWxlKCt0aGlzLnNjYWxlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jZW50ZXIpIHtcbiAgICAgIHRoaXMucHJvamVjdGlvbi5jZW50ZXIodGhpcy5jZW50ZXIpO1xuICAgIH1cblxuICAgIHRoaXMuZ2VvUGF0aCA9IGQzX2dlb1BhdGgoKS5wcm9qZWN0aW9uKHRoaXMucHJvamVjdGlvbik7XG5cbiAgICAvLyBidWJibGUgcmFkaXVzIHJhbmdlXG4gICAgaWYgKHRoaXMuZGF0YSAmJiAhdGhpcy5kb3QpIHtcbiAgICAgIHRoaXMuYnViYmxlUmFkaXVzID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgICAucmFuZ2UodGhpcy5idWJibGVTaXplUmFuZ2UpXG4gICAgICAgIC5kb21haW4oW2QzX21pbih0aGlzLmRhdGEsIChkOiBhbnkpID0+ICtkLnZhbHVlKSwgZDNfbWF4KHRoaXMuZGF0YSwgKGQ6IGFueSkgPT4gK2QudmFsdWUpXSk7XG5cbiAgICAgIC8vIGZvbnQgcmFuZ2VcbiAgICAgIHRoaXMuZm9udFJhbmdlID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgICAucmFuZ2UodGhpcy50ZXh0U2l6ZVJhbmdlKVxuICAgICAgICAuZG9tYWluKFtkM19taW4odGhpcy5kYXRhLCAoZDogYW55KSA9PiArZC52YWx1ZSksIGQzX21heCh0aGlzLmRhdGEsIChkOiBhbnkpID0+ICtkLnZhbHVlKV0pO1xuICAgIH1cblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgc291dGgnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcblxuICAgICAgLy8gdG9vbHRpcCBoZWFkZXJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XG4gICAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXBWYWx1ZSkgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC12YWx1ZScpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRoICsgdGhpcy5tYXJnaW4ubGVmdCArIHRoaXMubWFyZ2luLnJpZ2h0fSAke1xuICAgICAgICAgICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbVxuICAgICAgICB9YFxuICAgICAgKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY29udGFpbmVyJyk7XG5cbiAgICAvLyBtYXBcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy50b3BvanNvbkZlYXR1cmUuZmVhdHVyZXMpXG4gICAgICAuam9pbigoZW50ZXIpID0+IGVudGVyLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2ZlYXR1cmUnKS5hdHRyKCdkJywgdGhpcy5nZW9QYXRoKSk7XG5cbiAgICAvLyBib3JkZXJzXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21lc2gnKVxuICAgICAgLmRhdHVtKHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSlcbiAgICAgIC5hdHRyKCdkJywgdGhpcy5nZW9QYXRoKTtcblxuICAgIHRoaXMuYnViYmxlQ29udGFpbmVyID0gdGhpcy5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnZG90cycpLnN0eWxlKCdjb2xvcicsIHRoaXMuY29sb3IpO1xuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIC8vIGJ1YmJsZXNcblxuICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmpvaW4oXG4gICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdkb3QtY2lyY2xlJylcbiAgICAgICAgICAgIC5jbGFzc2VkKCdzb2xpZCcsIHRoaXMuZG90KVxuICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVswXSlcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAuYXR0cigncicsIChkKSA9PiAoIXRoaXMuZG90ID8gTWF0aC5zcXJ0KHRoaXMuYnViYmxlUmFkaXVzKGQudmFsdWUpKSA6IGAke3RoaXMuZG90U2l6ZX1weGApKSxcbiAgICAgICAgKHVwZGF0ZSkgPT5cbiAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVswXSlcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIChkKSA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMV0pXG4gICAgICAgICAgICAuYXR0cigncicsIChkKSA9PiAoIXRoaXMuZG90ID8gTWF0aC5zcXJ0KHRoaXMuYnViYmxlUmFkaXVzKGQudmFsdWUpKSA6IGAke3RoaXMuZG90U2l6ZX1weGApKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLnNlbGVjdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnYXV0bycpLFxuICAgICAgICAoZXhpdCkgPT4gZXhpdC50cmFuc2l0aW9uKCkuc2VsZWN0aW9uKCkuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpLnJlbW92ZSgpXG4gICAgICApO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLmJ1YmJsZUNvbnRhaW5lclxuICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIChldmVudCwgZGF0YSkgPT4gdGhpcy5idWJibGVNb3VzZU92ZXIoZXZlbnQsIGRhdGEpKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLmJ1YmJsZU1vdXNlT3V0KGV2ZW50LCBkYXRhKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT4gdGhpcy5idWJibGVNb3VzZUNsaWNrKGV2ZW50LCBkYXRhKSk7XG5cbiAgICAgIC8vIGJ1YmJsZSB0ZXh0XG4gICAgICBpZiAodGhpcy50eXBlICE9PSAnaGlnaCcgJiYgIXRoaXMuZG90KSB7XG4gICAgICAgIHRoaXMuYnViYmxlQ29udGFpbmVyXG4gICAgICAgICAgLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgICAgIC5qb2luKFxuICAgICAgICAgICAgKGVudGVyKSA9PlxuICAgICAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAgIC50ZXh0KChkKSA9PiAodGhpcy5idWJibGVMYWJlbEZvcm1hdCA/IHRoaXMuYnViYmxlTGFiZWxGb3JtYXQoZC52YWx1ZSkgOiBkLnZhbHVlKSlcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZG90LXRleHQnKVxuICAgICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIHRoaXMudGV4dENvbG9yKVxuICAgICAgICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgKGQpID0+IGAke01hdGgucm91bmQodGhpcy5mb250UmFuZ2UoZC52YWx1ZSkpfXB4YClcbiAgICAgICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB0aGlzLnByb2plY3Rpb24oW2QubG9uZ2l0dWRlLCBkLmxhdGl0dWRlXSlbMF0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoZCkgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzFdKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkeScsICcuNGVtJyksXG4gICAgICAgICAgICAodXBkYXRlKSA9PlxuICAgICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgICAuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgIC50ZXh0KChkKSA9PiAodGhpcy5idWJibGVMYWJlbEZvcm1hdCA/IHRoaXMuYnViYmxlTGFiZWxGb3JtYXQoZC52YWx1ZSkgOiBkLnZhbHVlKSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIChkKSA9PiBgJHtNYXRoLnJvdW5kKHRoaXMuZm9udFJhbmdlKGQudmFsdWUpKX1weGApXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy5wcm9qZWN0aW9uKFtkLmxvbmdpdHVkZSwgZC5sYXRpdHVkZV0pWzBdKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgKGQpID0+IHRoaXMucHJvamVjdGlvbihbZC5sb25naXR1ZGUsIGQubGF0aXR1ZGVdKVsxXSlcbiAgICAgICAgICAgICAgICAuYXR0cignZHknLCAnLjRlbScpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5zZWxlY3Rpb24oKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyksXG4gICAgICAgICAgICAoZXhpdCkgPT4gZXhpdC50cmFuc2l0aW9uKCkuc2VsZWN0aW9uKCkuYXR0cigncG9pbnRlci1ldmVudHMnLCAnbm9uZScpLnJlbW92ZSgpXG4gICAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgYnViYmxlTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5kb3QtY2lyY2xlJykuY2xhc3NlZCgnaW5hY3RpdmUnLCB0cnVlKTtcblxuICAgIGQzX3NlbGVjdChldmVudC5jdXJyZW50VGFyZ2V0KS5jbGFzc2VkKCdhY3RpdmUnLCB0cnVlKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcFNob3coZXZlbnQsIGRhdGEpO1xuXG4gICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBidWJibGVNb3VzZU91dCA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuZG90LWNpcmNsZScpLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKS5jbGFzc2VkKCdpbmFjdGl2ZScsIGZhbHNlKTtcblxuICAgIHRoaXMudG9vbHRpcEhpZGUoKTtcbiAgfTtcblxuICBidWJibGVNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTaG93ID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXInKS5odG1sKChkKSA9PiBgJHtkYXRhLmxhYmVsfSR7dGhpcy50b29sdGlwSGVhZGVyU3VmZml4fWApO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwVmFsdWUpIHtcbiAgICAgIHRoaXMudG9vbHRpcFxuICAgICAgICAuc2VsZWN0KCcudG9vbHRpcC12YWx1ZScpXG4gICAgICAgIC5odG1sKChkKSA9PiAodGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPyBgJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX1gIDogYCR7ZGF0YS52YWx1ZX1gKSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9vbHRpcE9mZnNldFdpZHRoID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0V2lkdGggLyAyO1xuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQgKyA4O1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHsrc2Nyb2xsWzFdICsgK2RpbWVuc2lvbnMudG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodH1weGApOyAvL1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAkeytzY3JvbGxbMF0gKyArZGltZW5zaW9ucy5sZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRoICsgK2RpbWVuc2lvbnMud2lkdGggLyAyfXB4YCk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwSGlkZSA9ICgpID0+IHtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcbn1cbiJdfQ==
import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { select as d3_select, pointer as d3_pointer } from 'd3-selection';
import { scaleLinear as d3_scaleLinear, scaleThreshold as d3_scaleThreshold, scaleQuantile as d3_scaleQuantile, scaleQuantize as d3_scaleQuantize } from 'd3-scale';
import { min as d3_min, max as d3_max, range as d3_range } from 'd3-array';
import { geoPath as d3_geoPath, geoAlbers as d3_geoAlbers, geoAlbersUsa as d3_geoAlbersUsa, geoMercator as d3_geoMercator } from 'd3-geo';
import { axisBottom as d3_axisBottom } from 'd3-axis';
import * as topojson from 'topojson-client';
import * as i0 from "@angular/core";
import * as i1 from "./dataviz.service";
import * as i2 from "@angular/common";
export class PbdsDatavizChoroplethMapComponent {
    constructor(_dataviz, _element, _scroll) {
        this._dataviz = _dataviz;
        this._element = _element;
        this._scroll = _scroll;
        this.chartClass = true;
        this.choroplethMapClass = true;
        this.feature = '';
        this.dataField = 'id';
        this.mesh = null;
        this.scale = null;
        this.center = null;
        this.width = 960;
        this.height = 500;
        this.marginTop = 0;
        this.marginRight = 0;
        this.marginBottom = 0;
        this.marginLeft = 0;
        this.theme = 'classic';
        this.colorScale = 'quantile';
        this.hideTooltip = false;
        this.tooltipValueFormatType = null;
        this.tooltipValueFormatString = '';
        this.hideLegend = false;
        this.legendWidth = 260;
        this.legendLabel = null;
        this.legendValueFormatType = null;
        this.legendValueFormatString = '';
        this.legendLeft = 20;
        this.legendTop = 20;
        this.hovered = new EventEmitter();
        this.clicked = new EventEmitter();
        this.updateChart = () => {
            this.svg
                .select('.map')
                .selectAll('path')
                .style('fill', (d, i) => {
                const match = this.data.find((obj) => obj[this.dataField] === d[this.dataField]);
                if (match) {
                    return this.colorRange(match.value);
                }
            })
                .classed('hasData', (d, i) => {
                return this.data.some((obj) => obj[this.dataField] === d[this.dataField]);
            });
            if (!this.hideTooltip) {
                this.svg
                    .select('.map')
                    .selectAll('path')
                    .on('mouseover', (event, data) => this.featureMouseOver(event, this.data.find((obj) => obj[this.dataField] === data[this.dataField])))
                    .on('mouseout', (event, data) => this.featureMouseOut(event, this.data))
                    .on('mousemove', (event, data) => this.tooltipMove(event))
                    .on('click', (event, data) => this.featureMouseClick(event, this.data.find((obj) => obj[this.dataField] === data[this.dataField])));
            }
        };
        this.featureMouseOver = (event, data) => {
            if (data) {
                this.tooltipShow(event, data);
                this.hovered.emit({ event, data });
            }
        };
        this.featureMouseOut = (event, data) => {
            this.tooltipHide();
        };
        this.featureMouseClick = (event, data) => {
            if (data) {
                this.clicked.emit({ event, data });
            }
        };
        this.tooltipShow = (event, data) => {
            // console.log('TOOLTIP: ', data, node);
            this.tooltipSetPosition(event);
            if (data.label) {
                this.tooltip.select('.tooltip-header').html((d) => `${data.label}`);
            }
            this.tooltip
                .select('.tooltip-value')
                .html((d) => (this.tooltipValueFormat ? `${this.tooltipValueFormat(data.value)}` : `${data.value}`));
            this.tooltip.style('opacity', 1);
        };
        this.tooltipHide = () => {
            this.tooltip.style('opacity', 0);
        };
        this.tooltipMove = (event) => {
            this.tooltipSetPosition(event);
        };
        this.tooltipSetPosition = (event) => {
            const mouse = d3_pointer(event, this.chart.node());
            const mouseLeft = +mouse[0];
            const mouseTop = +mouse[1];
            const geometry = this.chart.node().getBoundingClientRect();
            const geometryLeft = +geometry.left;
            const geometryTop = +geometry.top;
            const scroll = this._scroll.getScrollPosition();
            // const scrollLeft = +scroll[0];
            const scrollTop = +scroll[1];
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            this.tooltip.style('top', `${scrollTop + mouseTop + geometryTop - tooltipOffsetHeight - 14}px`);
            this.tooltip.style('left', `${mouseLeft + geometryLeft - tooltipOffsetWidth}px`); //
        };
        this.legend = (g) => {
            const length = this.colorRange.range().length;
            // console.log(this.colorRange.range().length, this.colorDomain);
            const x = d3_scaleLinear()
                .domain([1, length - 1])
                .rangeRound([+this.legendWidth / length, (this.legendWidth * (length - 1)) / length]);
            g.attr('class', 'legend')
                .selectAll('rect')
                .data(this.colorRange.range())
                .join('rect')
                .attr('height', 8)
                .attr('x', (d, i) => x(i))
                .attr('width', (d, i) => x(i + 1) - x(i))
                .attr('fill', (d) => d);
            if (this.legendLabel) {
                g.append('text').attr('y', -6).attr('text-anchor', 'start').attr('class', 'legend-label').text(this.legendLabel);
            }
            g.call(d3_axisBottom(x)
                .tickSize(13)
                .tickValues(d3_range(1, length))
                .tickFormat((i) => this.legendValueFormat ? `${this.legendValueFormat(this.colorDomain[i - 1])}` : `${this.colorDomain[i - 1]}`))
                .select('.domain')
                .remove();
        };
    }
    ngOnInit() {
        this.margin = {
            top: +this.marginTop,
            right: +this.marginRight,
            bottom: +this.marginBottom,
            left: +this.marginLeft
        };
        // color range
        const colors = this._dataviz.getColors(true, this.theme).slice().reverse();
        const colorDomain = [+d3_min(this.data, (d) => d.value), +d3_max(this.data, (d) => d.value)];
        const colorValues = this.data.map((d) => d.value);
        switch (this.colorScale) {
            case 'threshold':
                this.colorRange = d3_scaleThreshold().domain(this.domain).range(colors);
                this.colorDomain = this.colorRange.domain();
                break;
            case 'quantile':
                this.colorRange = d3_scaleQuantile().domain(colorValues).range(colors);
                this.colorDomain = this.colorRange.quantiles();
                break;
            case 'quantize':
                this.colorRange = d3_scaleQuantize().domain(colorDomain).range(colors);
                this.colorDomain = this.colorRange.thresholds();
                break;
        }
        // create formatters
        this.tooltipValueFormat = this._dataviz.d3Format(this.tooltipValueFormatType, this.tooltipValueFormatString);
        this.legendValueFormat = this._dataviz.d3Format(this.legendValueFormatType, this.legendValueFormatString);
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
        }
        this.topojsonFeature = topojson.feature(this.topojson, this.topojson.objects[this.feature]);
        this.projection.fitSize([+this.width, +this.height], this.topojsonFeature);
        if (this.scale) {
            this.projection.scale(+this.scale);
        }
        if (this.center) {
            this.projection.center(this.center);
        }
        this.geoPath = d3_geoPath().projection(this.projection);
        // console.log('TOPOJSON: ', this.topojson);
        // console.log('TOPOJSON FEATURE: ', this.topojsonFeature);
        // console.log('MESH: ', topojson.mesh(this.topojson, this.topojson.objects[this.feature], (a, b) => a !== b));
        // console.log('DATA: ', this.data);
        // create the chart
        this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');
        // TOOLTIP
        if (!this.hideTooltip) {
            this.tooltip = d3_select('body')
                .append('div')
                .attr('class', 'pbds-tooltip south')
                .style('opacity', 0)
                .attr('aria-hidden', 'true'); // hide tooltip for accessibility
            // tooltip header
            this.tooltip.append('div').attr('class', 'tooltip-header');
            this.tooltip.append('div').attr('class', 'tooltip-value');
        }
        // create chart svg
        this.svg = this.chart
            .append('svg')
            .attr('width', +this.width)
            .attr('height', +this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'img-fluid')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `-${this.margin.left} -${this.margin.top} ${+this.width} ${+this.height + this.margin.top + this.margin.bottom}`);
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
            .datum(topojson.mesh(this.topojson, this.topojson.objects[this.mesh || this.feature], (a, b) => a !== b))
            .attr('d', this.geoPath);
        // legend
        if (!this.hideLegend) {
            this.svg
                .append('g')
                .attr('transform', `translate(${+this.legendLeft}, ${+this.legendTop})`)
                .call(this.legend);
        }
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
PbdsDatavizChoroplethMapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizChoroplethMapComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }], target: i0.ɵɵFactoryTarget.Component });
PbdsDatavizChoroplethMapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: PbdsDatavizChoroplethMapComponent, selector: "pbds-dataviz-choropleth-map", inputs: { data: "data", topojson: "topojson", feature: "feature", projectionType: "projectionType", dataField: "dataField", mesh: "mesh", scale: "scale", center: "center", width: "width", height: "height", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", theme: "theme", colorScale: "colorScale", domain: "domain", hideTooltip: "hideTooltip", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", hideLegend: "hideLegend", legendWidth: "legendWidth", legendLabel: "legendLabel", legendValueFormatType: "legendValueFormatType", legendValueFormatString: "legendValueFormatString", legendLeft: "legendLeft", legendTop: "legendTop" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-choropleth-map": "this.choroplethMapClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizChoroplethMapComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pbds-dataviz-choropleth-map',
                    template: ``,
                    styles: [],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i1.PbdsDatavizService }, { type: i0.ElementRef }, { type: i2.ViewportScroller }]; }, propDecorators: { chartClass: [{
                type: HostBinding,
                args: ['class.pbds-chart']
            }], choroplethMapClass: [{
                type: HostBinding,
                args: ['class.pbds-chart-choropleth-map']
            }], data: [{
                type: Input
            }], topojson: [{
                type: Input
            }], feature: [{
                type: Input
            }], projectionType: [{
                type: Input
            }], dataField: [{
                type: Input
            }], mesh: [{
                type: Input
            }], scale: [{
                type: Input
            }], center: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], theme: [{
                type: Input
            }], colorScale: [{
                type: Input
            }], domain: [{
                type: Input
            }], hideTooltip: [{
                type: Input
            }], tooltipValueFormatType: [{
                type: Input
            }], tooltipValueFormatString: [{
                type: Input
            }], hideLegend: [{
                type: Input
            }], legendWidth: [{
                type: Input
            }], legendLabel: [{
                type: Input
            }], legendValueFormatType: [{
                type: Input
            }], legendValueFormatString: [{
                type: Input
            }], legendLeft: [{
                type: Input
            }], legendTop: [{
                type: Input
            }], hovered: [{
                type: Output
            }], clicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFFWixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE9BQU8sSUFBSSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUUsT0FBTyxFQUNMLFdBQVcsSUFBSSxjQUFjLEVBQzdCLGNBQWMsSUFBSSxpQkFBaUIsRUFDbkMsYUFBYSxJQUFJLGdCQUFnQixFQUNqQyxhQUFhLElBQUksZ0JBQWdCLEVBQ2xDLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsT0FBTyxJQUFJLFVBQVUsRUFDckIsU0FBUyxJQUFJLFlBQVksRUFDekIsWUFBWSxJQUFJLGVBQWUsRUFDL0IsV0FBVyxJQUFJLGNBQWMsRUFDOUIsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFdEQsT0FBTyxLQUFLLFFBQVEsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQVc1QyxNQUFNLE9BQU8saUNBQWlDO0lBMEc1QyxZQUFvQixRQUE0QixFQUFVLFFBQW9CLEVBQVUsT0FBeUI7UUFBN0YsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQVUsWUFB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TixVQUFVO3NCQURULEtBQUs7Z0JBSU4sS0FBSztzQkFESixLQUFLO2dCQUlOLFVBQVU7c0JBRFQsS0FBSztnQkFJTixNQUFNO3NCQURMLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLHNCQUFzQjtzQkFEckIsS0FBSztnQkFJTix3QkFBd0I7c0JBRHZCLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4scUJBQXFCO3NCQURwQixLQUFLO2dCQUlOLHVCQUF1QjtzQkFEdEIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLE9BQU87c0JBRE4sTUFBTTtnQkFJUCxPQUFPO3NCQUROLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCwgcG9pbnRlciBhcyBkM19wb2ludGVyIH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7XG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBzY2FsZVRocmVzaG9sZCBhcyBkM19zY2FsZVRocmVzaG9sZCxcbiAgc2NhbGVRdWFudGlsZSBhcyBkM19zY2FsZVF1YW50aWxlLFxuICBzY2FsZVF1YW50aXplIGFzIGQzX3NjYWxlUXVhbnRpemVcbn0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgbWluIGFzIGQzX21pbiwgbWF4IGFzIGQzX21heCwgcmFuZ2UgYXMgZDNfcmFuZ2UgfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge1xuICBnZW9QYXRoIGFzIGQzX2dlb1BhdGgsXG4gIGdlb0FsYmVycyBhcyBkM19nZW9BbGJlcnMsXG4gIGdlb0FsYmVyc1VzYSBhcyBkM19nZW9BbGJlcnNVc2EsXG4gIGdlb01lcmNhdG9yIGFzIGQzX2dlb01lcmNhdG9yXG59IGZyb20gJ2QzLWdlbyc7XG5pbXBvcnQgeyBheGlzQm90dG9tIGFzIGQzX2F4aXNCb3R0b20gfSBmcm9tICdkMy1heGlzJztcblxuaW1wb3J0ICogYXMgdG9wb2pzb24gZnJvbSAndG9wb2pzb24tY2xpZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpDaG9yb3BsZXRoTWFwRGF0YSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWNob3JvcGxldGgtbWFwJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWNob3JvcGxldGgtbWFwJylcbiAgY2hvcm9wbGV0aE1hcENsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpekNob3JvcGxldGhNYXBEYXRhPjtcblxuICBASW5wdXQoKVxuICB0b3BvanNvbjtcblxuICBASW5wdXQoKVxuICBmZWF0dXJlID0gJyc7XG5cbiAgQElucHV0KClcbiAgcHJvamVjdGlvblR5cGU7XG5cbiAgQElucHV0KClcbiAgZGF0YUZpZWxkID0gJ2lkJztcblxuICBASW5wdXQoKVxuICBtZXNoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBzY2FsZSA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgY2VudGVyID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDk2MDtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA1MDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luVG9wID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5SaWdodCA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gMDtcblxuICBASW5wdXQoKVxuICB0aGVtZTogJ2NsYXNzaWMnIHwgJ29jZWFuJyB8ICdzdW5zZXQnIHwgJ3R3aWxpZ2h0JyA9ICdjbGFzc2ljJztcblxuICBASW5wdXQoKVxuICBjb2xvclNjYWxlOiAndGhyZXNob2xkJyB8ICdxdWFudGlsZScgfCAncXVhbnRpemUnID0gJ3F1YW50aWxlJztcblxuICBASW5wdXQoKVxuICBkb21haW46IEFycmF5PG51bWJlcj47XG5cbiAgQElucHV0KClcbiAgaGlkZVRvb2x0aXAgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMjYwO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExlZnQgPSAyMDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRUb3AgPSAyMDtcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIHByb2plY3Rpb247XG4gIHByaXZhdGUgZ2VvUGF0aDtcbiAgcHJpdmF0ZSB0b3BvanNvbkZlYXR1cmU7XG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcbiAgcHJpdmF0ZSBjb2xvclJhbmdlO1xuICBwcml2YXRlIGNvbG9yRG9tYWluO1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIGxlZ2VuZFZhbHVlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXG4gICAgICByaWdodDogK3RoaXMubWFyZ2luUmlnaHQsXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcbiAgICB9O1xuXG4gICAgLy8gY29sb3IgcmFuZ2VcbiAgICBjb25zdCBjb2xvcnMgPSB0aGlzLl9kYXRhdml6LmdldENvbG9ycyh0cnVlLCB0aGlzLnRoZW1lKS5zbGljZSgpLnJldmVyc2UoKTtcblxuICAgIGNvbnN0IGNvbG9yRG9tYWluOiBhbnkgPSBbK2QzX21pbih0aGlzLmRhdGEsIChkKSA9PiBkLnZhbHVlKSwgK2QzX21heCh0aGlzLmRhdGEsIChkKSA9PiBkLnZhbHVlKV07XG4gICAgY29uc3QgY29sb3JWYWx1ZXMgPSB0aGlzLmRhdGEubWFwKChkKSA9PiBkLnZhbHVlKTtcblxuICAgIHN3aXRjaCAodGhpcy5jb2xvclNjYWxlKSB7XG4gICAgICBjYXNlICd0aHJlc2hvbGQnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVRocmVzaG9sZCgpLmRvbWFpbih0aGlzLmRvbWFpbikucmFuZ2UoY29sb3JzKTtcblxuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gdGhpcy5jb2xvclJhbmdlLmRvbWFpbigpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncXVhbnRpbGUnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVF1YW50aWxlKCkuZG9tYWluKGNvbG9yVmFsdWVzKS5yYW5nZShjb2xvcnMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLmNvbG9yUmFuZ2UucXVhbnRpbGVzKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdxdWFudGl6ZSc6XG4gICAgICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlUXVhbnRpemUoKS5kb21haW4oY29sb3JEb21haW4pLnJhbmdlKGNvbG9ycyk7XG5cbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IHRoaXMuY29sb3JSYW5nZS50aHJlc2hvbGRzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kVmFsdWVGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIHN3aXRjaCAodGhpcy5wcm9qZWN0aW9uVHlwZSkge1xuICAgICAgY2FzZSAnZ2VvQWxiZXJzJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9BbGJlcnNVc2EnOlxuICAgICAgICB0aGlzLnByb2plY3Rpb24gPSBkM19nZW9BbGJlcnNVc2EoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2dlb01lcmNhdG9yJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvTWVyY2F0b3IoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy50b3BvanNvbkZlYXR1cmUgPSB0b3BvanNvbi5mZWF0dXJlKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLmZlYXR1cmVdKTtcbiAgICB0aGlzLnByb2plY3Rpb24uZml0U2l6ZShbK3RoaXMud2lkdGgsICt0aGlzLmhlaWdodF0sIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcblxuICAgIGlmICh0aGlzLnNjYWxlKSB7XG4gICAgICB0aGlzLnByb2plY3Rpb24uc2NhbGUoK3RoaXMuc2NhbGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNlbnRlcikge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLmNlbnRlcih0aGlzLmNlbnRlcik7XG4gICAgfVxuXG4gICAgdGhpcy5nZW9QYXRoID0gZDNfZ2VvUGF0aCgpLnByb2plY3Rpb24odGhpcy5wcm9qZWN0aW9uKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTjogJywgdGhpcy50b3BvanNvbik7XG4gICAgLy8gY29uc29sZS5sb2coJ1RPUE9KU09OIEZFQVRVUkU6ICcsIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcbiAgICAvLyBjb25zb2xlLmxvZygnTUVTSDogJywgdG9wb2pzb24ubWVzaCh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKTtcbiAgICAvLyBjb25zb2xlLmxvZygnREFUQTogJywgdGhpcy5kYXRhKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXInKTtcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdmFsdWUnKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGh9ICR7K3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tfWBcbiAgICAgICk7XG5cbiAgICAvLyBtYXBcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy50b3BvanNvbkZlYXR1cmUuZmVhdHVyZXMpXG4gICAgICAuam9pbigoZW50ZXIpID0+IGVudGVyLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2ZlYXR1cmUnKS5hdHRyKCdkJywgdGhpcy5nZW9QYXRoKSk7XG5cbiAgICAvLyBib3JkZXJzXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21lc2gnKVxuICAgICAgLmRhdHVtKHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMubWVzaCB8fCB0aGlzLmZlYXR1cmVdLCAoYSwgYikgPT4gYSAhPT0gYikpXG4gICAgICAuYXR0cignZCcsIHRoaXMuZ2VvUGF0aCk7XG5cbiAgICAvLyBsZWdlbmRcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7K3RoaXMubGVnZW5kTGVmdH0sICR7K3RoaXMubGVnZW5kVG9wfSlgKVxuICAgICAgICAuY2FsbCh0aGlzLmxlZ2VuZCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0KCcubWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpID0+IHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLmRhdGEuZmluZCgob2JqKSA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkW3RoaXMuZGF0YUZpZWxkXSk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yUmFuZ2UobWF0Y2gudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2hhc0RhdGEnLCAoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNvbWUoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZFt0aGlzLmRhdGFGaWVsZF0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3QoJy5tYXAnKVxuICAgICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+XG4gICAgICAgICAgdGhpcy5mZWF0dXJlTW91c2VPdmVyKFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICB0aGlzLmRhdGEuZmluZCgob2JqKSA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkYXRhW3RoaXMuZGF0YUZpZWxkXSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsIChldmVudCwgZGF0YSkgPT4gdGhpcy5mZWF0dXJlTW91c2VPdXQoZXZlbnQsIHRoaXMuZGF0YSkpXG4gICAgICAgIC5vbignbW91c2Vtb3ZlJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLnRvb2x0aXBNb3ZlKGV2ZW50KSlcbiAgICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT5cbiAgICAgICAgICB0aGlzLmZlYXR1cmVNb3VzZUNsaWNrKFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICB0aGlzLmRhdGEuZmluZCgob2JqKSA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkYXRhW3RoaXMuZGF0YUZpZWxkXSlcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIGZlYXR1cmVNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy50b29sdGlwU2hvdyhldmVudCwgZGF0YSk7XG4gICAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICAgIH1cbiAgfTtcblxuICBmZWF0dXJlTW91c2VPdXQgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgZmVhdHVyZU1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdUT09MVElQOiAnLCBkYXRhLCBub2RlKTtcblxuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKGV2ZW50KTtcblxuICAgIGlmIChkYXRhLmxhYmVsKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXInKS5odG1sKChkKSA9PiBgJHtkYXRhLmxhYmVsfWApO1xuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcFxuICAgICAgLnNlbGVjdCgnLnRvb2x0aXAtdmFsdWUnKVxuICAgICAgLmh0bWwoKGQpID0+ICh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA/IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfWAgOiBgJHtkYXRhLnZhbHVlfWApKTtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwTW92ZSA9IChldmVudCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKGV2ZW50KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTZXRQb3NpdGlvbiA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1vdXNlID0gZDNfcG9pbnRlcihldmVudCwgdGhpcy5jaGFydC5ub2RlKCkpO1xuICAgIGNvbnN0IG1vdXNlTGVmdCA9ICttb3VzZVswXTtcbiAgICBjb25zdCBtb3VzZVRvcCA9ICttb3VzZVsxXTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gdGhpcy5jaGFydC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZ2VvbWV0cnlMZWZ0ID0gK2dlb21ldHJ5LmxlZnQ7XG4gICAgY29uc3QgZ2VvbWV0cnlUb3AgPSArZ2VvbWV0cnkudG9wO1xuXG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgLy8gY29uc3Qgc2Nyb2xsTGVmdCA9ICtzY3JvbGxbMF07XG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gK3Njcm9sbFsxXTtcblxuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRXaWR0aCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldFdpZHRoIC8gMjtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHtzY3JvbGxUb3AgKyBtb3VzZVRvcCArIGdlb21ldHJ5VG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodCAtIDE0fXB4YCk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7bW91c2VMZWZ0ICsgZ2VvbWV0cnlMZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRofXB4YCk7IC8vXG4gIH07XG5cbiAgbGVnZW5kID0gKGcpID0+IHtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmNvbG9yUmFuZ2UucmFuZ2UoKS5sZW5ndGg7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbG9yUmFuZ2UucmFuZ2UoKS5sZW5ndGgsIHRoaXMuY29sb3JEb21haW4pO1xuXG4gICAgY29uc3QgeCA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWzEsIGxlbmd0aCAtIDFdKVxuICAgICAgLnJhbmdlUm91bmQoWyt0aGlzLmxlZ2VuZFdpZHRoIC8gbGVuZ3RoLCAodGhpcy5sZWdlbmRXaWR0aCAqIChsZW5ndGggLSAxKSkgLyBsZW5ndGhdKTtcblxuICAgIGcuYXR0cignY2xhc3MnLCAnbGVnZW5kJylcbiAgICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEodGhpcy5jb2xvclJhbmdlLnJhbmdlKCkpXG4gICAgICAuam9pbigncmVjdCcpXG4gICAgICAuYXR0cignaGVpZ2h0JywgOClcbiAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHgoaSkpXG4gICAgICAuYXR0cignd2lkdGgnLCAoZCwgaSkgPT4geChpICsgMSkgLSB4KGkpKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCkgPT4gZCk7XG5cbiAgICBpZiAodGhpcy5sZWdlbmRMYWJlbCkge1xuICAgICAgZy5hcHBlbmQoJ3RleHQnKS5hdHRyKCd5JywgLTYpLmF0dHIoJ3RleHQtYW5jaG9yJywgJ3N0YXJ0JykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJykudGV4dCh0aGlzLmxlZ2VuZExhYmVsKTtcbiAgICB9XG5cbiAgICBnLmNhbGwoXG4gICAgICBkM19heGlzQm90dG9tKHgpXG4gICAgICAgIC50aWNrU2l6ZSgxMylcbiAgICAgICAgLnRpY2tWYWx1ZXMoZDNfcmFuZ2UoMSwgbGVuZ3RoKSlcbiAgICAgICAgLnRpY2tGb3JtYXQoKGk6IG51bWJlcikgPT5cbiAgICAgICAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID8gYCR7dGhpcy5sZWdlbmRWYWx1ZUZvcm1hdCh0aGlzLmNvbG9yRG9tYWluW2kgLSAxXSl9YCA6IGAke3RoaXMuY29sb3JEb21haW5baSAtIDFdfWBcbiAgICAgICAgKVxuICAgIClcbiAgICAgIC5zZWxlY3QoJy5kb21haW4nKVxuICAgICAgLnJlbW92ZSgpO1xuICB9O1xufVxuIl19
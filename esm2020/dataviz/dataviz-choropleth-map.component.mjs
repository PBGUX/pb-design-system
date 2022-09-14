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
        this.tooltipHeaderSuffix = '';
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
                this.tooltip.select('.tooltip-header').html((d) => `${data.label}${this.tooltipHeaderSuffix}`);
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
PbdsDatavizChoroplethMapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: PbdsDatavizChoroplethMapComponent, selector: "pbds-dataviz-choropleth-map", inputs: { data: "data", topojson: "topojson", feature: "feature", projectionType: "projectionType", dataField: "dataField", mesh: "mesh", scale: "scale", center: "center", width: "width", height: "height", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", theme: "theme", colorScale: "colorScale", domain: "domain", hideTooltip: "hideTooltip", tooltipHeaderSuffix: "tooltipHeaderSuffix", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", hideLegend: "hideLegend", legendWidth: "legendWidth", legendLabel: "legendLabel", legendValueFormatType: "legendValueFormatType", legendValueFormatString: "legendValueFormatString", legendLeft: "legendLeft", legendTop: "legendTop" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-choropleth-map": "this.choroplethMapClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
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
            }], tooltipHeaderSuffix: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFFWixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE9BQU8sSUFBSSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUUsT0FBTyxFQUNMLFdBQVcsSUFBSSxjQUFjLEVBQzdCLGNBQWMsSUFBSSxpQkFBaUIsRUFDbkMsYUFBYSxJQUFJLGdCQUFnQixFQUNqQyxhQUFhLElBQUksZ0JBQWdCLEVBQ2xDLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsT0FBTyxJQUFJLFVBQVUsRUFDckIsU0FBUyxJQUFJLFlBQVksRUFDekIsWUFBWSxJQUFJLGVBQWUsRUFDL0IsV0FBVyxJQUFJLGNBQWMsRUFDOUIsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFdEQsT0FBTyxLQUFLLFFBQVEsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQVc1QyxNQUFNLE9BQU8saUNBQWlDO0lBNkc1QyxZQUFvQixRQUE0QixFQUFVLFFBQW9CLEVBQVUsT0FBeUI7UUFBN0YsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQVUsWUFB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SztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sWUFBWTtzQkFEWCxLQUFLO2dCQUlOLFVBQVU7c0JBRFQsS0FBSztnQkFJTixLQUFLO3NCQURKLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxLQUFLO2dCQUlOLE1BQU07c0JBREwsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sbUJBQW1CO3NCQURsQixLQUFLO2dCQUlOLHNCQUFzQjtzQkFEckIsS0FBSztnQkFJTix3QkFBd0I7c0JBRHZCLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4scUJBQXFCO3NCQURwQixLQUFLO2dCQUlOLHVCQUF1QjtzQkFEdEIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLE9BQU87c0JBRE4sTUFBTTtnQkFJUCxPQUFPO3NCQUROLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCwgcG9pbnRlciBhcyBkM19wb2ludGVyIH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7XG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBzY2FsZVRocmVzaG9sZCBhcyBkM19zY2FsZVRocmVzaG9sZCxcbiAgc2NhbGVRdWFudGlsZSBhcyBkM19zY2FsZVF1YW50aWxlLFxuICBzY2FsZVF1YW50aXplIGFzIGQzX3NjYWxlUXVhbnRpemVcbn0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgbWluIGFzIGQzX21pbiwgbWF4IGFzIGQzX21heCwgcmFuZ2UgYXMgZDNfcmFuZ2UgfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge1xuICBnZW9QYXRoIGFzIGQzX2dlb1BhdGgsXG4gIGdlb0FsYmVycyBhcyBkM19nZW9BbGJlcnMsXG4gIGdlb0FsYmVyc1VzYSBhcyBkM19nZW9BbGJlcnNVc2EsXG4gIGdlb01lcmNhdG9yIGFzIGQzX2dlb01lcmNhdG9yXG59IGZyb20gJ2QzLWdlbyc7XG5pbXBvcnQgeyBheGlzQm90dG9tIGFzIGQzX2F4aXNCb3R0b20gfSBmcm9tICdkMy1heGlzJztcblxuaW1wb3J0ICogYXMgdG9wb2pzb24gZnJvbSAndG9wb2pzb24tY2xpZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpDaG9yb3BsZXRoTWFwRGF0YSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWNob3JvcGxldGgtbWFwJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWNob3JvcGxldGgtbWFwJylcbiAgY2hvcm9wbGV0aE1hcENsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpekNob3JvcGxldGhNYXBEYXRhPjtcblxuICBASW5wdXQoKVxuICB0b3BvanNvbjtcblxuICBASW5wdXQoKVxuICBmZWF0dXJlID0gJyc7XG5cbiAgQElucHV0KClcbiAgcHJvamVjdGlvblR5cGU7XG5cbiAgQElucHV0KClcbiAgZGF0YUZpZWxkID0gJ2lkJztcblxuICBASW5wdXQoKVxuICBtZXNoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBzY2FsZSA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgY2VudGVyID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDk2MDtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA1MDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luVG9wID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5SaWdodCA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gMDtcblxuICBASW5wdXQoKVxuICB0aGVtZTogJ2NsYXNzaWMnIHwgJ29jZWFuJyB8ICdzdW5zZXQnIHwgJ3R3aWxpZ2h0JyA9ICdjbGFzc2ljJztcblxuICBASW5wdXQoKVxuICBjb2xvclNjYWxlOiAndGhyZXNob2xkJyB8ICdxdWFudGlsZScgfCAncXVhbnRpemUnID0gJ3F1YW50aWxlJztcblxuICBASW5wdXQoKVxuICBkb21haW46IEFycmF5PG51bWJlcj47XG5cbiAgQElucHV0KClcbiAgaGlkZVRvb2x0aXAgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0b29sdGlwSGVhZGVyU3VmZml4ID0gJyc7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDI2MDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBsZWdlbmRMZWZ0ID0gMjA7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVG9wID0gMjA7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBwcm9qZWN0aW9uO1xuICBwcml2YXRlIGdlb1BhdGg7XG4gIHByaXZhdGUgdG9wb2pzb25GZWF0dXJlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBjb2xvckRvbWFpbjtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcbiAgcHJpdmF0ZSBsZWdlbmRWYWx1ZUZvcm1hdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIC8vIGNvbG9yIHJhbmdlXG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5fZGF0YXZpei5nZXRDb2xvcnModHJ1ZSwgdGhpcy50aGVtZSkuc2xpY2UoKS5yZXZlcnNlKCk7XG5cbiAgICBjb25zdCBjb2xvckRvbWFpbjogYW55ID0gWytkM19taW4odGhpcy5kYXRhLCAoZCkgPT4gZC52YWx1ZSksICtkM19tYXgodGhpcy5kYXRhLCAoZCkgPT4gZC52YWx1ZSldO1xuICAgIGNvbnN0IGNvbG9yVmFsdWVzID0gdGhpcy5kYXRhLm1hcCgoZCkgPT4gZC52YWx1ZSk7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29sb3JTY2FsZSkge1xuICAgICAgY2FzZSAndGhyZXNob2xkJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVUaHJlc2hvbGQoKS5kb21haW4odGhpcy5kb21haW4pLnJhbmdlKGNvbG9ycyk7XG5cbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IHRoaXMuY29sb3JSYW5nZS5kb21haW4oKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3F1YW50aWxlJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVRdWFudGlsZSgpLmRvbWFpbihjb2xvclZhbHVlcykucmFuZ2UoY29sb3JzKTtcblxuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gdGhpcy5jb2xvclJhbmdlLnF1YW50aWxlcygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncXVhbnRpemUnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVF1YW50aXplKCkuZG9tYWluKGNvbG9yRG9tYWluKS5yYW5nZShjb2xvcnMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLmNvbG9yUmFuZ2UudGhyZXNob2xkcygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0VHlwZSwgdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICBzd2l0Y2ggKHRoaXMucHJvamVjdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgJ2dlb0FsYmVycyc6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb0FsYmVycygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZ2VvQWxiZXJzVXNhJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzVXNhKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9NZXJjYXRvcic6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb01lcmNhdG9yKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMudG9wb2pzb25GZWF0dXJlID0gdG9wb2pzb24uZmVhdHVyZSh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSk7XG4gICAgdGhpcy5wcm9qZWN0aW9uLmZpdFNpemUoWyt0aGlzLndpZHRoLCArdGhpcy5oZWlnaHRdLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG5cbiAgICBpZiAodGhpcy5zY2FsZSkge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLnNjYWxlKCt0aGlzLnNjYWxlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jZW50ZXIpIHtcbiAgICAgIHRoaXMucHJvamVjdGlvbi5jZW50ZXIodGhpcy5jZW50ZXIpO1xuICAgIH1cblxuICAgIHRoaXMuZ2VvUGF0aCA9IGQzX2dlb1BhdGgoKS5wcm9qZWN0aW9uKHRoaXMucHJvamVjdGlvbik7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnVE9QT0pTT046ICcsIHRoaXMudG9wb2pzb24pO1xuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTiBGRUFUVVJFOiAnLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG4gICAgLy8gY29uc29sZS5sb2coJ01FU0g6ICcsIHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ0RBVEE6ICcsIHRoaXMuZGF0YSk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgc291dGgnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcblxuICAgICAgLy8gdG9vbHRpcCBoZWFkZXJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLXZhbHVlJyk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRofSAkeyt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbX1gXG4gICAgICApO1xuXG4gICAgLy8gbWFwXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcCcpXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5kYXRhKHRoaXMudG9wb2pzb25GZWF0dXJlLmZlYXR1cmVzKVxuICAgICAgLmpvaW4oKGVudGVyKSA9PiBlbnRlci5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICdmZWF0dXJlJykuYXR0cignZCcsIHRoaXMuZ2VvUGF0aCkpO1xuXG4gICAgLy8gYm9yZGVyc1xuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdtZXNoJylcbiAgICAgIC5kYXR1bSh0b3BvanNvbi5tZXNoKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLm1lc2ggfHwgdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKVxuICAgICAgLmF0dHIoJ2QnLCB0aGlzLmdlb1BhdGgpO1xuXG4gICAgLy8gbGVnZW5kXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgkeyt0aGlzLmxlZ2VuZExlZnR9LCAkeyt0aGlzLmxlZ2VuZFRvcH0pYClcbiAgICAgICAgLmNhbGwodGhpcy5sZWdlbmQpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICB1cGRhdGVDaGFydCA9ICgpID0+IHtcbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdCgnLm1hcCcpXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5kYXRhLmZpbmQoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZFt0aGlzLmRhdGFGaWVsZF0pO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb2xvclJhbmdlKG1hdGNoLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jbGFzc2VkKCdoYXNEYXRhJywgKGQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zb21lKChvYmopID0+IG9ialt0aGlzLmRhdGFGaWVsZF0gPT09IGRbdGhpcy5kYXRhRmllbGRdKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0KCcubWFwJylcbiAgICAgICAgLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PlxuICAgICAgICAgIHRoaXMuZmVhdHVyZU1vdXNlT3ZlcihcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmZpbmQoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZGF0YVt0aGlzLmRhdGFGaWVsZF0pXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuZmVhdHVyZU1vdXNlT3V0KGV2ZW50LCB0aGlzLmRhdGEpKVxuICAgICAgICAub24oJ21vdXNlbW92ZScsIChldmVudCwgZGF0YSkgPT4gdGhpcy50b29sdGlwTW92ZShldmVudCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+XG4gICAgICAgICAgdGhpcy5mZWF0dXJlTW91c2VDbGljayhcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmZpbmQoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZGF0YVt0aGlzLmRhdGFGaWVsZF0pXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbiAgfTtcblxuICBmZWF0dXJlTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudG9vbHRpcFNob3coZXZlbnQsIGRhdGEpO1xuICAgICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgICB9XG4gIH07XG5cbiAgZmVhdHVyZU1vdXNlT3V0ID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGZlYXR1cmVNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygnVE9PTFRJUDogJywgZGF0YSwgbm9kZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTZXRQb3NpdGlvbihldmVudCk7XG5cbiAgICBpZiAoZGF0YS5sYWJlbCkge1xuICAgICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbCgoZCkgPT4gYCR7ZGF0YS5sYWJlbH0ke3RoaXMudG9vbHRpcEhlYWRlclN1ZmZpeH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXBcbiAgICAgIC5zZWxlY3QoJy50b29sdGlwLXZhbHVlJylcbiAgICAgIC5odG1sKChkKSA9PiAodGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPyBgJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX1gIDogYCR7ZGF0YS52YWx1ZX1gKSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcE1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBTZXRQb3NpdGlvbihldmVudCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2V0UG9zaXRpb24gPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtb3VzZSA9IGQzX3BvaW50ZXIoZXZlbnQsIHRoaXMuY2hhcnQubm9kZSgpKTtcbiAgICBjb25zdCBtb3VzZUxlZnQgPSArbW91c2VbMF07XG4gICAgY29uc3QgbW91c2VUb3AgPSArbW91c2VbMV07XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IHRoaXMuY2hhcnQubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGdlb21ldHJ5TGVmdCA9ICtnZW9tZXRyeS5sZWZ0O1xuICAgIGNvbnN0IGdlb21ldHJ5VG9wID0gK2dlb21ldHJ5LnRvcDtcblxuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIC8vIGNvbnN0IHNjcm9sbExlZnQgPSArc2Nyb2xsWzBdO1xuICAgIGNvbnN0IHNjcm9sbFRvcCA9ICtzY3JvbGxbMV07XG5cbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0V2lkdGggPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodDtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7c2Nyb2xsVG9wICsgbW91c2VUb3AgKyBnZW9tZXRyeVRvcCAtIHRvb2x0aXBPZmZzZXRIZWlnaHQgLSAxNH1weGApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAke21vdXNlTGVmdCArIGdlb21ldHJ5TGVmdCAtIHRvb2x0aXBPZmZzZXRXaWR0aH1weGApOyAvL1xuICB9O1xuXG4gIGxlZ2VuZCA9IChnKSA9PiB7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5jb2xvclJhbmdlLnJhbmdlKCkubGVuZ3RoO1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5jb2xvclJhbmdlLnJhbmdlKCkubGVuZ3RoLCB0aGlzLmNvbG9yRG9tYWluKTtcblxuICAgIGNvbnN0IHggPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFsxLCBsZW5ndGggLSAxXSlcbiAgICAgIC5yYW5nZVJvdW5kKFsrdGhpcy5sZWdlbmRXaWR0aCAvIGxlbmd0aCwgKHRoaXMubGVnZW5kV2lkdGggKiAobGVuZ3RoIC0gMSkpIC8gbGVuZ3RoXSk7XG5cbiAgICBnLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZCcpXG4gICAgICAuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIC5kYXRhKHRoaXMuY29sb3JSYW5nZS5yYW5nZSgpKVxuICAgICAgLmpvaW4oJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIDgpXG4gICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB4KGkpKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKGQsIGkpID0+IHgoaSArIDEpIC0geChpKSlcbiAgICAgIC5hdHRyKCdmaWxsJywgKGQpID0+IGQpO1xuXG4gICAgaWYgKHRoaXMubGVnZW5kTGFiZWwpIHtcbiAgICAgIGcuYXBwZW5kKCd0ZXh0JykuYXR0cigneScsIC02KS5hdHRyKCd0ZXh0LWFuY2hvcicsICdzdGFydCcpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpLnRleHQodGhpcy5sZWdlbmRMYWJlbCk7XG4gICAgfVxuXG4gICAgZy5jYWxsKFxuICAgICAgZDNfYXhpc0JvdHRvbSh4KVxuICAgICAgICAudGlja1NpemUoMTMpXG4gICAgICAgIC50aWNrVmFsdWVzKGQzX3JhbmdlKDEsIGxlbmd0aCkpXG4gICAgICAgIC50aWNrRm9ybWF0KChpOiBudW1iZXIpID0+XG4gICAgICAgICAgdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdCA/IGAke3RoaXMubGVnZW5kVmFsdWVGb3JtYXQodGhpcy5jb2xvckRvbWFpbltpIC0gMV0pfWAgOiBgJHt0aGlzLmNvbG9yRG9tYWluW2kgLSAxXX1gXG4gICAgICAgIClcbiAgICApXG4gICAgICAuc2VsZWN0KCcuZG9tYWluJylcbiAgICAgIC5yZW1vdmUoKTtcbiAgfTtcbn1cbiJdfQ==
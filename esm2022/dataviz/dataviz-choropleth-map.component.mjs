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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizChoroplethMapComponent, deps: [{ token: i1.PbdsDatavizService }, { token: i0.ElementRef }, { token: i2.ViewportScroller }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: PbdsDatavizChoroplethMapComponent, selector: "pbds-dataviz-choropleth-map", inputs: { data: "data", topojson: "topojson", feature: "feature", projectionType: "projectionType", dataField: "dataField", mesh: "mesh", scale: "scale", center: "center", width: "width", height: "height", marginTop: "marginTop", marginRight: "marginRight", marginBottom: "marginBottom", marginLeft: "marginLeft", theme: "theme", colorScale: "colorScale", domain: "domain", hideTooltip: "hideTooltip", tooltipHeaderSuffix: "tooltipHeaderSuffix", tooltipValueFormatType: "tooltipValueFormatType", tooltipValueFormatString: "tooltipValueFormatString", hideLegend: "hideLegend", legendWidth: "legendWidth", legendLabel: "legendLabel", legendValueFormatType: "legendValueFormatType", legendValueFormatString: "legendValueFormatString", legendLeft: "legendLeft", legendTop: "legendTop" }, outputs: { hovered: "hovered", clicked: "clicked" }, host: { properties: { "class.pbds-chart": "this.chartClass", "class.pbds-chart-choropleth-map": "this.choroplethMapClass" } }, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDatavizChoroplethMapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-dataviz-choropleth-map', template: ``, changeDetection: ChangeDetectionStrategy.OnPush }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFFWixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE9BQU8sSUFBSSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUUsT0FBTyxFQUNMLFdBQVcsSUFBSSxjQUFjLEVBQzdCLGNBQWMsSUFBSSxpQkFBaUIsRUFDbkMsYUFBYSxJQUFJLGdCQUFnQixFQUNqQyxhQUFhLElBQUksZ0JBQWdCLEVBQ2xDLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsT0FBTyxJQUFJLFVBQVUsRUFDckIsU0FBUyxJQUFJLFlBQVksRUFDekIsWUFBWSxJQUFJLGVBQWUsRUFDL0IsV0FBVyxJQUFJLGNBQWMsRUFDOUIsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFdEQsT0FBTyxLQUFLLFFBQVEsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQVc1QyxNQUFNLE9BQU8saUNBQWlDO0lBNkc1QyxZQUFvQixRQUE0QixFQUFVLFFBQW9CLEVBQVUsT0FBeUI7UUFBN0YsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQVUsWUFB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QUFLO2dCQUlOLEtBQUs7c0JBREosS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sTUFBTTtzQkFETCxLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixtQkFBbUI7c0JBRGxCLEtBQUs7Z0JBSU4sc0JBQXNCO3NCQURyQixLQUFLO2dCQUlOLHdCQUF3QjtzQkFEdkIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixxQkFBcUI7c0JBRHBCLEtBQUs7Z0JBSU4sdUJBQXVCO3NCQUR0QixLQUFLO2dCQUlOLFVBQVU7c0JBRFQsS0FBSztnQkFJTixTQUFTO3NCQURSLEtBQUs7Z0JBSU4sT0FBTztzQkFETixNQUFNO2dCQUlQLE9BQU87c0JBRE4sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIE9uRGVzdHJveSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBzZWxlY3QgYXMgZDNfc2VsZWN0LCBwb2ludGVyIGFzIGQzX3BvaW50ZXIgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHtcbiAgc2NhbGVMaW5lYXIgYXMgZDNfc2NhbGVMaW5lYXIsXG4gIHNjYWxlVGhyZXNob2xkIGFzIGQzX3NjYWxlVGhyZXNob2xkLFxuICBzY2FsZVF1YW50aWxlIGFzIGQzX3NjYWxlUXVhbnRpbGUsXG4gIHNjYWxlUXVhbnRpemUgYXMgZDNfc2NhbGVRdWFudGl6ZVxufSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBtaW4gYXMgZDNfbWluLCBtYXggYXMgZDNfbWF4LCByYW5nZSBhcyBkM19yYW5nZSB9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7XG4gIGdlb1BhdGggYXMgZDNfZ2VvUGF0aCxcbiAgZ2VvQWxiZXJzIGFzIGQzX2dlb0FsYmVycyxcbiAgZ2VvQWxiZXJzVXNhIGFzIGQzX2dlb0FsYmVyc1VzYSxcbiAgZ2VvTWVyY2F0b3IgYXMgZDNfZ2VvTWVyY2F0b3Jcbn0gZnJvbSAnZDMtZ2VvJztcbmltcG9ydCB7IGF4aXNCb3R0b20gYXMgZDNfYXhpc0JvdHRvbSB9IGZyb20gJ2QzLWF4aXMnO1xuXG5pbXBvcnQgKiBhcyB0b3BvanNvbiBmcm9tICd0b3BvanNvbi1jbGllbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhdml6LnNlcnZpY2UnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBEYXRhIH0gZnJvbSAnLi9kYXRhdml6LmludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotY2hvcm9wbGV0aC1tYXAnLFxuICB0ZW1wbGF0ZTogYGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQnKVxuICBjaGFydENsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtY2hhcnQtY2hvcm9wbGV0aC1tYXAnKVxuICBjaG9yb3BsZXRoTWFwQ2xhc3MgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGE6IEFycmF5PFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcERhdGE+O1xuXG4gIEBJbnB1dCgpXG4gIHRvcG9qc29uO1xuXG4gIEBJbnB1dCgpXG4gIGZlYXR1cmUgPSAnJztcblxuICBASW5wdXQoKVxuICBwcm9qZWN0aW9uVHlwZTtcblxuICBASW5wdXQoKVxuICBkYXRhRmllbGQgPSAnaWQnO1xuXG4gIEBJbnB1dCgpXG4gIG1lc2g6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHNjYWxlID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBjZW50ZXIgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoID0gOTYwO1xuXG4gIEBJbnB1dCgpXG4gIGhlaWdodCA9IDUwMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Ub3AgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblJpZ2h0ID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5Cb3R0b20gPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkxlZnQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lOiAnY2xhc3NpYycgfCAnb2NlYW4nIHwgJ3N1bnNldCcgfCAndHdpbGlnaHQnID0gJ2NsYXNzaWMnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yU2NhbGU6ICd0aHJlc2hvbGQnIHwgJ3F1YW50aWxlJyB8ICdxdWFudGl6ZScgPSAncXVhbnRpbGUnO1xuXG4gIEBJbnB1dCgpXG4gIGRvbWFpbjogQXJyYXk8bnVtYmVyPjtcblxuICBASW5wdXQoKVxuICBoaWRlVG9vbHRpcCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBIZWFkZXJTdWZmaXggPSAnJztcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMjYwO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExlZnQgPSAyMDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRUb3AgPSAyMDtcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIHByb2plY3Rpb247XG4gIHByaXZhdGUgZ2VvUGF0aDtcbiAgcHJpdmF0ZSB0b3BvanNvbkZlYXR1cmU7XG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcbiAgcHJpdmF0ZSBjb2xvclJhbmdlO1xuICBwcml2YXRlIGNvbG9yRG9tYWluO1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIGxlZ2VuZFZhbHVlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXG4gICAgICByaWdodDogK3RoaXMubWFyZ2luUmlnaHQsXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcbiAgICB9O1xuXG4gICAgLy8gY29sb3IgcmFuZ2VcbiAgICBjb25zdCBjb2xvcnMgPSB0aGlzLl9kYXRhdml6LmdldENvbG9ycyh0cnVlLCB0aGlzLnRoZW1lKS5zbGljZSgpLnJldmVyc2UoKTtcblxuICAgIGNvbnN0IGNvbG9yRG9tYWluOiBhbnkgPSBbK2QzX21pbih0aGlzLmRhdGEsIChkKSA9PiBkLnZhbHVlKSwgK2QzX21heCh0aGlzLmRhdGEsIChkKSA9PiBkLnZhbHVlKV07XG4gICAgY29uc3QgY29sb3JWYWx1ZXMgPSB0aGlzLmRhdGEubWFwKChkKSA9PiBkLnZhbHVlKTtcblxuICAgIHN3aXRjaCAodGhpcy5jb2xvclNjYWxlKSB7XG4gICAgICBjYXNlICd0aHJlc2hvbGQnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVRocmVzaG9sZCgpLmRvbWFpbih0aGlzLmRvbWFpbikucmFuZ2UoY29sb3JzKTtcblxuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gdGhpcy5jb2xvclJhbmdlLmRvbWFpbigpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncXVhbnRpbGUnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVF1YW50aWxlKCkuZG9tYWluKGNvbG9yVmFsdWVzKS5yYW5nZShjb2xvcnMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLmNvbG9yUmFuZ2UucXVhbnRpbGVzKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdxdWFudGl6ZSc6XG4gICAgICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlUXVhbnRpemUoKS5kb21haW4oY29sb3JEb21haW4pLnJhbmdlKGNvbG9ycyk7XG5cbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IHRoaXMuY29sb3JSYW5nZS50aHJlc2hvbGRzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kVmFsdWVGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIHN3aXRjaCAodGhpcy5wcm9qZWN0aW9uVHlwZSkge1xuICAgICAgY2FzZSAnZ2VvQWxiZXJzJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9BbGJlcnNVc2EnOlxuICAgICAgICB0aGlzLnByb2plY3Rpb24gPSBkM19nZW9BbGJlcnNVc2EoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2dlb01lcmNhdG9yJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvTWVyY2F0b3IoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy50b3BvanNvbkZlYXR1cmUgPSB0b3BvanNvbi5mZWF0dXJlKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLmZlYXR1cmVdKTtcbiAgICB0aGlzLnByb2plY3Rpb24uZml0U2l6ZShbK3RoaXMud2lkdGgsICt0aGlzLmhlaWdodF0sIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcblxuICAgIGlmICh0aGlzLnNjYWxlKSB7XG4gICAgICB0aGlzLnByb2plY3Rpb24uc2NhbGUoK3RoaXMuc2NhbGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNlbnRlcikge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLmNlbnRlcih0aGlzLmNlbnRlcik7XG4gICAgfVxuXG4gICAgdGhpcy5nZW9QYXRoID0gZDNfZ2VvUGF0aCgpLnByb2plY3Rpb24odGhpcy5wcm9qZWN0aW9uKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTjogJywgdGhpcy50b3BvanNvbik7XG4gICAgLy8gY29uc29sZS5sb2coJ1RPUE9KU09OIEZFQVRVUkU6ICcsIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcbiAgICAvLyBjb25zb2xlLmxvZygnTUVTSDogJywgdG9wb2pzb24ubWVzaCh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKTtcbiAgICAvLyBjb25zb2xlLmxvZygnREFUQTogJywgdGhpcy5kYXRhKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXInKTtcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdmFsdWUnKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGh9ICR7K3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tfWBcbiAgICAgICk7XG5cbiAgICAvLyBtYXBcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy50b3BvanNvbkZlYXR1cmUuZmVhdHVyZXMpXG4gICAgICAuam9pbigoZW50ZXIpID0+IGVudGVyLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2ZlYXR1cmUnKS5hdHRyKCdkJywgdGhpcy5nZW9QYXRoKSk7XG5cbiAgICAvLyBib3JkZXJzXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21lc2gnKVxuICAgICAgLmRhdHVtKHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMubWVzaCB8fCB0aGlzLmZlYXR1cmVdLCAoYSwgYikgPT4gYSAhPT0gYikpXG4gICAgICAuYXR0cignZCcsIHRoaXMuZ2VvUGF0aCk7XG5cbiAgICAvLyBsZWdlbmRcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7K3RoaXMubGVnZW5kTGVmdH0sICR7K3RoaXMubGVnZW5kVG9wfSlgKVxuICAgICAgICAuY2FsbCh0aGlzLmxlZ2VuZCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0KCcubWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpID0+IHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLmRhdGEuZmluZCgob2JqKSA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkW3RoaXMuZGF0YUZpZWxkXSk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yUmFuZ2UobWF0Y2gudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2hhc0RhdGEnLCAoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNvbWUoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZFt0aGlzLmRhdGFGaWVsZF0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3QoJy5tYXAnKVxuICAgICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+XG4gICAgICAgICAgdGhpcy5mZWF0dXJlTW91c2VPdmVyKFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICB0aGlzLmRhdGEuZmluZCgob2JqKSA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkYXRhW3RoaXMuZGF0YUZpZWxkXSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsIChldmVudCwgZGF0YSkgPT4gdGhpcy5mZWF0dXJlTW91c2VPdXQoZXZlbnQsIHRoaXMuZGF0YSkpXG4gICAgICAgIC5vbignbW91c2Vtb3ZlJywgKGV2ZW50LCBkYXRhKSA9PiB0aGlzLnRvb2x0aXBNb3ZlKGV2ZW50KSlcbiAgICAgICAgLm9uKCdjbGljaycsIChldmVudCwgZGF0YSkgPT5cbiAgICAgICAgICB0aGlzLmZlYXR1cmVNb3VzZUNsaWNrKFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICB0aGlzLmRhdGEuZmluZCgob2JqKSA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkYXRhW3RoaXMuZGF0YUZpZWxkXSlcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIGZlYXR1cmVNb3VzZU92ZXIgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy50b29sdGlwU2hvdyhldmVudCwgZGF0YSk7XG4gICAgICB0aGlzLmhvdmVyZWQuZW1pdCh7IGV2ZW50LCBkYXRhIH0pO1xuICAgIH1cbiAgfTtcblxuICBmZWF0dXJlTW91c2VPdXQgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBIaWRlKCk7XG4gIH07XG5cbiAgZmVhdHVyZU1vdXNlQ2xpY2sgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChldmVudCwgZGF0YSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdUT09MVElQOiAnLCBkYXRhLCBub2RlKTtcblxuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKGV2ZW50KTtcblxuICAgIGlmIChkYXRhLmxhYmVsKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuc2VsZWN0KCcudG9vbHRpcC1oZWFkZXInKS5odG1sKChkKSA9PiBgJHtkYXRhLmxhYmVsfSR7dGhpcy50b29sdGlwSGVhZGVyU3VmZml4fWApO1xuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcFxuICAgICAgLnNlbGVjdCgnLnRvb2x0aXAtdmFsdWUnKVxuICAgICAgLmh0bWwoKGQpID0+ICh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdCA/IGAke3RoaXMudG9vbHRpcFZhbHVlRm9ybWF0KGRhdGEudmFsdWUpfWAgOiBgJHtkYXRhLnZhbHVlfWApKTtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcEhpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwTW92ZSA9IChldmVudCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKGV2ZW50KTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBTZXRQb3NpdGlvbiA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IG1vdXNlID0gZDNfcG9pbnRlcihldmVudCwgdGhpcy5jaGFydC5ub2RlKCkpO1xuICAgIGNvbnN0IG1vdXNlTGVmdCA9ICttb3VzZVswXTtcbiAgICBjb25zdCBtb3VzZVRvcCA9ICttb3VzZVsxXTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gdGhpcy5jaGFydC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZ2VvbWV0cnlMZWZ0ID0gK2dlb21ldHJ5LmxlZnQ7XG4gICAgY29uc3QgZ2VvbWV0cnlUb3AgPSArZ2VvbWV0cnkudG9wO1xuXG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgLy8gY29uc3Qgc2Nyb2xsTGVmdCA9ICtzY3JvbGxbMF07XG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gK3Njcm9sbFsxXTtcblxuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRXaWR0aCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldFdpZHRoIC8gMjtcbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0SGVpZ2h0ID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0SGVpZ2h0O1xuXG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCd0b3AnLCBgJHtzY3JvbGxUb3AgKyBtb3VzZVRvcCArIGdlb21ldHJ5VG9wIC0gdG9vbHRpcE9mZnNldEhlaWdodCAtIDE0fXB4YCk7XG4gICAgdGhpcy50b29sdGlwLnN0eWxlKCdsZWZ0JywgYCR7bW91c2VMZWZ0ICsgZ2VvbWV0cnlMZWZ0IC0gdG9vbHRpcE9mZnNldFdpZHRofXB4YCk7IC8vXG4gIH07XG5cbiAgbGVnZW5kID0gKGcpID0+IHtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmNvbG9yUmFuZ2UucmFuZ2UoKS5sZW5ndGg7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbG9yUmFuZ2UucmFuZ2UoKS5sZW5ndGgsIHRoaXMuY29sb3JEb21haW4pO1xuXG4gICAgY29uc3QgeCA9IGQzX3NjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oWzEsIGxlbmd0aCAtIDFdKVxuICAgICAgLnJhbmdlUm91bmQoWyt0aGlzLmxlZ2VuZFdpZHRoIC8gbGVuZ3RoLCAodGhpcy5sZWdlbmRXaWR0aCAqIChsZW5ndGggLSAxKSkgLyBsZW5ndGhdKTtcblxuICAgIGcuYXR0cignY2xhc3MnLCAnbGVnZW5kJylcbiAgICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEodGhpcy5jb2xvclJhbmdlLnJhbmdlKCkpXG4gICAgICAuam9pbigncmVjdCcpXG4gICAgICAuYXR0cignaGVpZ2h0JywgOClcbiAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHgoaSkpXG4gICAgICAuYXR0cignd2lkdGgnLCAoZCwgaSkgPT4geChpICsgMSkgLSB4KGkpKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCkgPT4gZCk7XG5cbiAgICBpZiAodGhpcy5sZWdlbmRMYWJlbCkge1xuICAgICAgZy5hcHBlbmQoJ3RleHQnKS5hdHRyKCd5JywgLTYpLmF0dHIoJ3RleHQtYW5jaG9yJywgJ3N0YXJ0JykuYXR0cignY2xhc3MnLCAnbGVnZW5kLWxhYmVsJykudGV4dCh0aGlzLmxlZ2VuZExhYmVsKTtcbiAgICB9XG5cbiAgICBnLmNhbGwoXG4gICAgICBkM19heGlzQm90dG9tKHgpXG4gICAgICAgIC50aWNrU2l6ZSgxMylcbiAgICAgICAgLnRpY2tWYWx1ZXMoZDNfcmFuZ2UoMSwgbGVuZ3RoKSlcbiAgICAgICAgLnRpY2tGb3JtYXQoKGk6IG51bWJlcikgPT5cbiAgICAgICAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID8gYCR7dGhpcy5sZWdlbmRWYWx1ZUZvcm1hdCh0aGlzLmNvbG9yRG9tYWluW2kgLSAxXSl9YCA6IGAke3RoaXMuY29sb3JEb21haW5baSAtIDFdfWBcbiAgICAgICAgKVxuICAgIClcbiAgICAgIC5zZWxlY3QoJy5kb21haW4nKVxuICAgICAgLnJlbW92ZSgpO1xuICB9O1xufVxuIl19
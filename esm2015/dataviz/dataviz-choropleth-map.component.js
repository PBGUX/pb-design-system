import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, pointer as d3_pointer } from 'd3-selection';
import { scaleLinear as d3_scaleLinear, scaleThreshold as d3_scaleThreshold, scaleQuantile as d3_scaleQuantile, scaleQuantize as d3_scaleQuantize } from 'd3-scale';
import { min as d3_min, max as d3_max, range as d3_range } from 'd3-array';
import { geoPath as d3_geoPath, geoAlbers as d3_geoAlbers, geoAlbersUsa as d3_geoAlbersUsa, geoMercator as d3_geoMercator } from 'd3-geo';
import { axisBottom as d3_axisBottom } from 'd3-axis';
import * as topojson from 'topojson-client';
import { PbdsDatavizService } from './dataviz.service';
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
PbdsDatavizChoroplethMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-dataviz-choropleth-map',
                template: ``,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
PbdsDatavizChoroplethMapComponent.ctorParameters = () => [
    { type: PbdsDatavizService },
    { type: ElementRef },
    { type: ViewportScroller }
];
PbdsDatavizChoroplethMapComponent.propDecorators = {
    chartClass: [{ type: HostBinding, args: ['class.pbds-chart',] }],
    choroplethMapClass: [{ type: HostBinding, args: ['class.pbds-chart-choropleth-map',] }],
    data: [{ type: Input }],
    topojson: [{ type: Input }],
    feature: [{ type: Input }],
    projectionType: [{ type: Input }],
    dataField: [{ type: Input }],
    mesh: [{ type: Input }],
    scale: [{ type: Input }],
    center: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    marginTop: [{ type: Input }],
    marginRight: [{ type: Input }],
    marginBottom: [{ type: Input }],
    marginLeft: [{ type: Input }],
    theme: [{ type: Input }],
    colorScale: [{ type: Input }],
    domain: [{ type: Input }],
    hideTooltip: [{ type: Input }],
    tooltipValueFormatType: [{ type: Input }],
    tooltipValueFormatString: [{ type: Input }],
    hideLegend: [{ type: Input }],
    legendWidth: [{ type: Input }],
    legendLabel: [{ type: Input }],
    legendValueFormatType: [{ type: Input }],
    legendValueFormatString: [{ type: Input }],
    legendLeft: [{ type: Input }],
    legendTop: [{ type: Input }],
    hovered: [{ type: Output }],
    clicked: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUdYLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVuRCxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxPQUFPLElBQUksVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFFLE9BQU8sRUFDTCxXQUFXLElBQUksY0FBYyxFQUM3QixjQUFjLElBQUksaUJBQWlCLEVBQ25DLGFBQWEsSUFBSSxnQkFBZ0IsRUFDakMsYUFBYSxJQUFJLGdCQUFnQixFQUNsQyxNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEtBQUssSUFBSSxRQUFRLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDM0UsT0FBTyxFQUNMLE9BQU8sSUFBSSxVQUFVLEVBQ3JCLFNBQVMsSUFBSSxZQUFZLEVBQ3pCLFlBQVksSUFBSSxlQUFlLEVBQy9CLFdBQVcsSUFBSSxjQUFjLEVBQzlCLE1BQU0sUUFBUSxDQUFDO0FBQ2hCLE9BQU8sRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXRELE9BQU8sS0FBSyxRQUFRLE1BQU0saUJBQWlCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFVdkQsTUFBTSxPQUFPLGlDQUFpQztJQTBH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QUdMLEtBQUs7c0NBR0wsS0FBSzt5QkFHTCxLQUFLO3dCQUdMLEtBQUs7c0JBR0wsTUFBTTtzQkFHTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QsIHBvaW50ZXIgYXMgZDNfcG9pbnRlciB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQge1xuICBzY2FsZUxpbmVhciBhcyBkM19zY2FsZUxpbmVhcixcbiAgc2NhbGVUaHJlc2hvbGQgYXMgZDNfc2NhbGVUaHJlc2hvbGQsXG4gIHNjYWxlUXVhbnRpbGUgYXMgZDNfc2NhbGVRdWFudGlsZSxcbiAgc2NhbGVRdWFudGl6ZSBhcyBkM19zY2FsZVF1YW50aXplXG59IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IG1pbiBhcyBkM19taW4sIG1heCBhcyBkM19tYXgsIHJhbmdlIGFzIGQzX3JhbmdlIH0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHtcbiAgZ2VvUGF0aCBhcyBkM19nZW9QYXRoLFxuICBnZW9BbGJlcnMgYXMgZDNfZ2VvQWxiZXJzLFxuICBnZW9BbGJlcnNVc2EgYXMgZDNfZ2VvQWxiZXJzVXNhLFxuICBnZW9NZXJjYXRvciBhcyBkM19nZW9NZXJjYXRvclxufSBmcm9tICdkMy1nZW8nO1xuaW1wb3J0IHsgYXhpc0JvdHRvbSBhcyBkM19heGlzQm90dG9tIH0gZnJvbSAnZDMtYXhpcyc7XG5cbmltcG9ydCAqIGFzIHRvcG9qc29uIGZyb20gJ3RvcG9qc29uLWNsaWVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpelNlcnZpY2UgfSBmcm9tICcuL2RhdGF2aXouc2VydmljZSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcERhdGEgfSBmcm9tICcuL2RhdGF2aXouaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1jaG9yb3BsZXRoLW1hcCcsXG4gIHRlbXBsYXRlOiBgYCxcbiAgc3R5bGVzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpDaG9yb3BsZXRoTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydCcpXG4gIGNoYXJ0Q2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1jaGFydC1jaG9yb3BsZXRoLW1hcCcpXG4gIGNob3JvcGxldGhNYXBDbGFzcyA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZGF0YTogQXJyYXk8UGJkc0RhdGF2aXpDaG9yb3BsZXRoTWFwRGF0YT47XG5cbiAgQElucHV0KClcbiAgdG9wb2pzb247XG5cbiAgQElucHV0KClcbiAgZmVhdHVyZSA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHByb2plY3Rpb25UeXBlO1xuXG4gIEBJbnB1dCgpXG4gIGRhdGFGaWVsZCA9ICdpZCc7XG5cbiAgQElucHV0KClcbiAgbWVzaDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgc2NhbGUgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGNlbnRlciA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgd2lkdGggPSA5NjA7XG5cbiAgQElucHV0KClcbiAgaGVpZ2h0ID0gNTAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpblRvcCA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luUmlnaHQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIG1hcmdpbkJvdHRvbSA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luTGVmdCA9IDA7XG5cbiAgQElucHV0KClcbiAgdGhlbWU6ICdjbGFzc2ljJyB8ICdvY2VhbicgfCAnc3Vuc2V0JyB8ICd0d2lsaWdodCcgPSAnY2xhc3NpYyc7XG5cbiAgQElucHV0KClcbiAgY29sb3JTY2FsZTogJ3RocmVzaG9sZCcgfCAncXVhbnRpbGUnIHwgJ3F1YW50aXplJyA9ICdxdWFudGlsZSc7XG5cbiAgQElucHV0KClcbiAgZG9tYWluOiBBcnJheTxudW1iZXI+O1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVUb29sdGlwID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0VHlwZTogJ251bWJlcicgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvb2x0aXBWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGhpZGVMZWdlbmQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsZWdlbmRXaWR0aCA9IDI2MDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRMYWJlbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVmFsdWVGb3JtYXRTdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBsZWdlbmRMZWZ0ID0gMjA7XG5cbiAgQElucHV0KClcbiAgbGVnZW5kVG9wID0gMjA7XG5cbiAgQE91dHB1dCgpXG4gIGhvdmVyZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJpdmF0ZSBwcm9qZWN0aW9uO1xuICBwcml2YXRlIGdlb1BhdGg7XG4gIHByaXZhdGUgdG9wb2pzb25GZWF0dXJlO1xuICBwcml2YXRlIGNoYXJ0O1xuICBwcml2YXRlIHN2ZztcbiAgcHJpdmF0ZSBtYXJnaW47XG4gIHByaXZhdGUgY29sb3JSYW5nZTtcbiAgcHJpdmF0ZSBjb2xvckRvbWFpbjtcbiAgcHJpdmF0ZSB0b29sdGlwO1xuICBwcml2YXRlIHRvb2x0aXBWYWx1ZUZvcm1hdDtcbiAgcHJpdmF0ZSBsZWdlbmRWYWx1ZUZvcm1hdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kYXRhdml6OiBQYmRzRGF0YXZpelNlcnZpY2UsIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcmdpbiA9IHtcbiAgICAgIHRvcDogK3RoaXMubWFyZ2luVG9wLFxuICAgICAgcmlnaHQ6ICt0aGlzLm1hcmdpblJpZ2h0LFxuICAgICAgYm90dG9tOiArdGhpcy5tYXJnaW5Cb3R0b20sXG4gICAgICBsZWZ0OiArdGhpcy5tYXJnaW5MZWZ0XG4gICAgfTtcblxuICAgIC8vIGNvbG9yIHJhbmdlXG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5fZGF0YXZpei5nZXRDb2xvcnModHJ1ZSwgdGhpcy50aGVtZSkuc2xpY2UoKS5yZXZlcnNlKCk7XG5cbiAgICBjb25zdCBjb2xvckRvbWFpbjogYW55ID0gWytkM19taW4odGhpcy5kYXRhLCAoZCkgPT4gZC52YWx1ZSksICtkM19tYXgodGhpcy5kYXRhLCAoZCkgPT4gZC52YWx1ZSldO1xuICAgIGNvbnN0IGNvbG9yVmFsdWVzID0gdGhpcy5kYXRhLm1hcCgoZCkgPT4gZC52YWx1ZSk7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29sb3JTY2FsZSkge1xuICAgICAgY2FzZSAndGhyZXNob2xkJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVUaHJlc2hvbGQoKS5kb21haW4odGhpcy5kb21haW4pLnJhbmdlKGNvbG9ycyk7XG5cbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IHRoaXMuY29sb3JSYW5nZS5kb21haW4oKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3F1YW50aWxlJzpcbiAgICAgICAgdGhpcy5jb2xvclJhbmdlID0gZDNfc2NhbGVRdWFudGlsZSgpLmRvbWFpbihjb2xvclZhbHVlcykucmFuZ2UoY29sb3JzKTtcblxuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gdGhpcy5jb2xvclJhbmdlLnF1YW50aWxlcygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncXVhbnRpemUnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVF1YW50aXplKCkuZG9tYWluKGNvbG9yRG9tYWluKS5yYW5nZShjb2xvcnMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLmNvbG9yUmFuZ2UudGhyZXNob2xkcygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgZm9ybWF0dGVyc1xuICAgIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdFR5cGUsIHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nKTtcbiAgICB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0ID0gdGhpcy5fZGF0YXZpei5kM0Zvcm1hdCh0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0VHlwZSwgdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdFN0cmluZyk7XG5cbiAgICBzd2l0Y2ggKHRoaXMucHJvamVjdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgJ2dlb0FsYmVycyc6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb0FsYmVycygpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZ2VvQWxiZXJzVXNhJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzVXNhKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9NZXJjYXRvcic6XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiA9IGQzX2dlb01lcmNhdG9yKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMudG9wb2pzb25GZWF0dXJlID0gdG9wb2pzb24uZmVhdHVyZSh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSk7XG4gICAgdGhpcy5wcm9qZWN0aW9uLmZpdFNpemUoWyt0aGlzLndpZHRoLCArdGhpcy5oZWlnaHRdLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG5cbiAgICBpZiAodGhpcy5zY2FsZSkge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLnNjYWxlKCt0aGlzLnNjYWxlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jZW50ZXIpIHtcbiAgICAgIHRoaXMucHJvamVjdGlvbi5jZW50ZXIodGhpcy5jZW50ZXIpO1xuICAgIH1cblxuICAgIHRoaXMuZ2VvUGF0aCA9IGQzX2dlb1BhdGgoKS5wcm9qZWN0aW9uKHRoaXMucHJvamVjdGlvbik7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnVE9QT0pTT046ICcsIHRoaXMudG9wb2pzb24pO1xuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTiBGRUFUVVJFOiAnLCB0aGlzLnRvcG9qc29uRmVhdHVyZSk7XG4gICAgLy8gY29uc29sZS5sb2coJ01FU0g6ICcsIHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMuZmVhdHVyZV0sIChhLCBiKSA9PiBhICE9PSBiKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ0RBVEE6ICcsIHRoaXMuZGF0YSk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gICAgdGhpcy5jaGFydCA9IGQzX3NlbGVjdCh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIFRPT0xUSVBcbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IGQzX3NlbGVjdCgnYm9keScpXG4gICAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwYmRzLXRvb2x0aXAgc291dGgnKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIHRvb2x0aXAgZm9yIGFjY2Vzc2liaWxpdHlcblxuICAgICAgLy8gdG9vbHRpcCBoZWFkZXJcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtaGVhZGVyJyk7XG4gICAgICB0aGlzLnRvb2x0aXAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd0b29sdGlwLXZhbHVlJyk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGNoYXJ0IHN2Z1xuICAgIHRoaXMuc3ZnID0gdGhpcy5jaGFydFxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICt0aGlzLndpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpbWctZmx1aWQnKVxuICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3ZpZXdCb3gnLFxuICAgICAgICBgLSR7dGhpcy5tYXJnaW4ubGVmdH0gLSR7dGhpcy5tYXJnaW4udG9wfSAkeyt0aGlzLndpZHRofSAkeyt0aGlzLmhlaWdodCArIHRoaXMubWFyZ2luLnRvcCArIHRoaXMubWFyZ2luLmJvdHRvbX1gXG4gICAgICApO1xuXG4gICAgLy8gbWFwXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcCcpXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5kYXRhKHRoaXMudG9wb2pzb25GZWF0dXJlLmZlYXR1cmVzKVxuICAgICAgLmpvaW4oKGVudGVyKSA9PiBlbnRlci5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICdmZWF0dXJlJykuYXR0cignZCcsIHRoaXMuZ2VvUGF0aCkpO1xuXG4gICAgLy8gYm9yZGVyc1xuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdtZXNoJylcbiAgICAgIC5kYXR1bSh0b3BvanNvbi5tZXNoKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLm1lc2ggfHwgdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKVxuICAgICAgLmF0dHIoJ2QnLCB0aGlzLmdlb1BhdGgpO1xuXG4gICAgLy8gbGVnZW5kXG4gICAgaWYgKCF0aGlzLmhpZGVMZWdlbmQpIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgkeyt0aGlzLmxlZ2VuZExlZnR9LCAkeyt0aGlzLmxlZ2VuZFRvcH0pYClcbiAgICAgICAgLmNhbGwodGhpcy5sZWdlbmQpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB0aGlzLnRvb2x0aXAucmVtb3ZlKCk7XG4gIH1cblxuICB1cGRhdGVDaGFydCA9ICgpID0+IHtcbiAgICB0aGlzLnN2Z1xuICAgICAgLnNlbGVjdCgnLm1hcCcpXG4gICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5kYXRhLmZpbmQoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZFt0aGlzLmRhdGFGaWVsZF0pO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb2xvclJhbmdlKG1hdGNoLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jbGFzc2VkKCdoYXNEYXRhJywgKGQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zb21lKChvYmopID0+IG9ialt0aGlzLmRhdGFGaWVsZF0gPT09IGRbdGhpcy5kYXRhRmllbGRdKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVUb29sdGlwKSB7XG4gICAgICB0aGlzLnN2Z1xuICAgICAgICAuc2VsZWN0KCcubWFwJylcbiAgICAgICAgLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50LCBkYXRhKSA9PlxuICAgICAgICAgIHRoaXMuZmVhdHVyZU1vdXNlT3ZlcihcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmZpbmQoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZGF0YVt0aGlzLmRhdGFGaWVsZF0pXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdXQnLCAoZXZlbnQsIGRhdGEpID0+IHRoaXMuZmVhdHVyZU1vdXNlT3V0KGV2ZW50LCB0aGlzLmRhdGEpKVxuICAgICAgICAub24oJ21vdXNlbW92ZScsIChldmVudCwgZGF0YSkgPT4gdGhpcy50b29sdGlwTW92ZShldmVudCkpXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+XG4gICAgICAgICAgdGhpcy5mZWF0dXJlTW91c2VDbGljayhcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmZpbmQoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZGF0YVt0aGlzLmRhdGFGaWVsZF0pXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbiAgfTtcblxuICBmZWF0dXJlTW91c2VPdmVyID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudG9vbHRpcFNob3coZXZlbnQsIGRhdGEpO1xuICAgICAgdGhpcy5ob3ZlcmVkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgICB9XG4gIH07XG5cbiAgZmVhdHVyZU1vdXNlT3V0ID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGZlYXR1cmVNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuY2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNob3cgPSAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygnVE9PTFRJUDogJywgZGF0YSwgbm9kZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBTZXRQb3NpdGlvbihldmVudCk7XG5cbiAgICBpZiAoZGF0YS5sYWJlbCkge1xuICAgICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbCgoZCkgPT4gYCR7ZGF0YS5sYWJlbH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXBcbiAgICAgIC5zZWxlY3QoJy50b29sdGlwLXZhbHVlJylcbiAgICAgIC5odG1sKChkKSA9PiAodGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPyBgJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX1gIDogYCR7ZGF0YS52YWx1ZX1gKSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcE1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLnRvb2x0aXBTZXRQb3NpdGlvbihldmVudCk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2V0UG9zaXRpb24gPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBtb3VzZSA9IGQzX3BvaW50ZXIoZXZlbnQsIHRoaXMuY2hhcnQubm9kZSgpKTtcbiAgICBjb25zdCBtb3VzZUxlZnQgPSArbW91c2VbMF07XG4gICAgY29uc3QgbW91c2VUb3AgPSArbW91c2VbMV07XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IHRoaXMuY2hhcnQubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGdlb21ldHJ5TGVmdCA9ICtnZW9tZXRyeS5sZWZ0O1xuICAgIGNvbnN0IGdlb21ldHJ5VG9wID0gK2dlb21ldHJ5LnRvcDtcblxuICAgIGNvbnN0IHNjcm9sbCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIC8vIGNvbnN0IHNjcm9sbExlZnQgPSArc2Nyb2xsWzBdO1xuICAgIGNvbnN0IHNjcm9sbFRvcCA9ICtzY3JvbGxbMV07XG5cbiAgICBjb25zdCB0b29sdGlwT2Zmc2V0V2lkdGggPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgY29uc3QgdG9vbHRpcE9mZnNldEhlaWdodCA9ICt0aGlzLnRvb2x0aXAubm9kZSgpLm9mZnNldEhlaWdodDtcblxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgndG9wJywgYCR7c2Nyb2xsVG9wICsgbW91c2VUb3AgKyBnZW9tZXRyeVRvcCAtIHRvb2x0aXBPZmZzZXRIZWlnaHQgLSAxNH1weGApO1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnbGVmdCcsIGAke21vdXNlTGVmdCArIGdlb21ldHJ5TGVmdCAtIHRvb2x0aXBPZmZzZXRXaWR0aH1weGApOyAvL1xuICB9O1xuXG4gIGxlZ2VuZCA9IChnKSA9PiB7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5jb2xvclJhbmdlLnJhbmdlKCkubGVuZ3RoO1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5jb2xvclJhbmdlLnJhbmdlKCkubGVuZ3RoLCB0aGlzLmNvbG9yRG9tYWluKTtcblxuICAgIGNvbnN0IHggPSBkM19zY2FsZUxpbmVhcigpXG4gICAgICAuZG9tYWluKFsxLCBsZW5ndGggLSAxXSlcbiAgICAgIC5yYW5nZVJvdW5kKFsrdGhpcy5sZWdlbmRXaWR0aCAvIGxlbmd0aCwgKHRoaXMubGVnZW5kV2lkdGggKiAobGVuZ3RoIC0gMSkpIC8gbGVuZ3RoXSk7XG5cbiAgICBnLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZCcpXG4gICAgICAuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIC5kYXRhKHRoaXMuY29sb3JSYW5nZS5yYW5nZSgpKVxuICAgICAgLmpvaW4oJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIDgpXG4gICAgICAuYXR0cigneCcsIChkLCBpKSA9PiB4KGkpKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKGQsIGkpID0+IHgoaSArIDEpIC0geChpKSlcbiAgICAgIC5hdHRyKCdmaWxsJywgKGQpID0+IGQpO1xuXG4gICAgaWYgKHRoaXMubGVnZW5kTGFiZWwpIHtcbiAgICAgIGcuYXBwZW5kKCd0ZXh0JykuYXR0cigneScsIC02KS5hdHRyKCd0ZXh0LWFuY2hvcicsICdzdGFydCcpLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC1sYWJlbCcpLnRleHQodGhpcy5sZWdlbmRMYWJlbCk7XG4gICAgfVxuXG4gICAgZy5jYWxsKFxuICAgICAgZDNfYXhpc0JvdHRvbSh4KVxuICAgICAgICAudGlja1NpemUoMTMpXG4gICAgICAgIC50aWNrVmFsdWVzKGQzX3JhbmdlKDEsIGxlbmd0aCkpXG4gICAgICAgIC50aWNrRm9ybWF0KChpOiBudW1iZXIpID0+XG4gICAgICAgICAgdGhpcy5sZWdlbmRWYWx1ZUZvcm1hdCA/IGAke3RoaXMubGVnZW5kVmFsdWVGb3JtYXQodGhpcy5jb2xvckRvbWFpbltpIC0gMV0pfWAgOiBgJHt0aGlzLmNvbG9yRG9tYWluW2kgLSAxXX1gXG4gICAgICAgIClcbiAgICApXG4gICAgICAuc2VsZWN0KCcuZG9tYWluJylcbiAgICAgIC5yZW1vdmUoKTtcbiAgfTtcbn1cbiJdfQ==
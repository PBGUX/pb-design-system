import { Component, Input, Output, EventEmitter, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select as d3_select, event as d3_event, mouse as d3_mouse } from 'd3-selection';
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
                    .on('mouseover', (data, index, nodes) => this.featureMouseOver(d3_event, this.data.find((obj) => obj[this.dataField] === data[this.dataField]), index, nodes))
                    .on('mouseout', (data, index, nodes) => this.featureMouseOut(d3_event, this.data, index, nodes))
                    .on('mousemove', (data, index, nodes) => this.tooltipMove(this.chart.node()))
                    .on('click', (data, index, nodes) => this.featureMouseClick(d3_event, this.data.find((obj) => obj[this.dataField] === data[this.dataField]), index, nodes));
            }
        };
        this.featureMouseOver = (event, data, index, nodes) => {
            if (data) {
                this.tooltipShow(data, nodes[index]);
                this.hovered.emit({ event, data });
            }
        };
        this.featureMouseOut = (event, data, index, nodes) => {
            this.tooltipHide();
        };
        this.featureMouseClick = (event, data, index, nodes) => {
            if (data) {
                this.clicked.emit({ event, data });
            }
        };
        this.tooltipShow = (data, node) => {
            // console.log('TOOLTIP: ', data, node);
            this.tooltipSetPosition(node);
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
        this.tooltipMove = (node) => {
            this.tooltipSetPosition(node);
        };
        this.tooltipSetPosition = (node) => {
            const mouse = d3_mouse(node);
            const mouseLeft = +mouse[0];
            const mouseTop = +mouse[1];
            const geometry = node.getBoundingClientRect();
            const geometryLeft = +geometry.left;
            const geometryTop = +geometry.top;
            const scroll = this._scroll.getScrollPosition();
            // const scrollLeft = +scroll[0];
            const scrollTop = +scroll[1];
            const tooltipOffsetWidth = +this.tooltip.node().offsetWidth / 2;
            const tooltipOffsetHeight = +this.tooltip.node().offsetHeight;
            this.tooltip.style('top', `${scrollTop + mouseTop + geometryTop - tooltipOffsetHeight - 14}px`);
            this.tooltip.style('left', `${mouseLeft + geometryLeft - tooltipOffsetWidth}px`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3N0MDE2bG8vZ2l0aHViL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9zcmMvIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6LWNob3JvcGxldGgtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBR1gsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLEtBQUssSUFBSSxRQUFRLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN6RixPQUFPLEVBQ0wsV0FBVyxJQUFJLGNBQWMsRUFDN0IsY0FBYyxJQUFJLGlCQUFpQixFQUNuQyxhQUFhLElBQUksZ0JBQWdCLEVBQ2pDLGFBQWEsSUFBSSxnQkFBZ0IsRUFDbEMsTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxLQUFLLElBQUksUUFBUSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzNFLE9BQU8sRUFDTCxPQUFPLElBQUksVUFBVSxFQUNyQixTQUFTLElBQUksWUFBWSxFQUN6QixZQUFZLElBQUksZUFBZSxFQUMvQixXQUFXLElBQUksY0FBYyxFQUM5QixNQUFNLFFBQVEsQ0FBQztBQUNoQixPQUFPLEVBQUUsVUFBVSxJQUFJLGFBQWEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUV0RCxPQUFPLEtBQUssUUFBUSxNQUFNLGlCQUFpQixDQUFDO0FBQzVDLE9BQU8s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SztvQkFHTCxLQUFLO3FCQUdMLEtBQUs7b0JBR0wsS0FBSztxQkFHTCxLQUFLO3dCQUdMLEtBQUs7MEJBR0wsS0FBSzsyQkFHTCxLQUFLO3lCQUdMLEtBQUs7b0JBR0wsS0FBSzt5QkFHTCxLQUFLO3FCQUdMLEtBQUs7MEJBR0wsS0FBSztxQ0FHTCxLQUFLO3VDQUdMLEtBQUs7eUJBR0wsS0FBSzswQkFHTCxLQUFLOzBCQUdMLEtBQUs7b0NBR0wsS0FBSztzQ0FHTCxLQUFLO3lCQUdMLEtBQUs7d0JBR0wsS0FBSztzQkFHTCxNQUFNO3NCQUdOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCwgZXZlbnQgYXMgZDNfZXZlbnQsIG1vdXNlIGFzIGQzX21vdXNlIH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7XG4gIHNjYWxlTGluZWFyIGFzIGQzX3NjYWxlTGluZWFyLFxuICBzY2FsZVRocmVzaG9sZCBhcyBkM19zY2FsZVRocmVzaG9sZCxcbiAgc2NhbGVRdWFudGlsZSBhcyBkM19zY2FsZVF1YW50aWxlLFxuICBzY2FsZVF1YW50aXplIGFzIGQzX3NjYWxlUXVhbnRpemVcbn0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgbWluIGFzIGQzX21pbiwgbWF4IGFzIGQzX21heCwgcmFuZ2UgYXMgZDNfcmFuZ2UgfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge1xuICBnZW9QYXRoIGFzIGQzX2dlb1BhdGgsXG4gIGdlb0FsYmVycyBhcyBkM19nZW9BbGJlcnMsXG4gIGdlb0FsYmVyc1VzYSBhcyBkM19nZW9BbGJlcnNVc2EsXG4gIGdlb01lcmNhdG9yIGFzIGQzX2dlb01lcmNhdG9yXG59IGZyb20gJ2QzLWdlbyc7XG5pbXBvcnQgeyBheGlzQm90dG9tIGFzIGQzX2F4aXNCb3R0b20gfSBmcm9tICdkMy1heGlzJztcblxuaW1wb3J0ICogYXMgdG9wb2pzb24gZnJvbSAndG9wb2pzb24tY2xpZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6U2VydmljZSB9IGZyb20gJy4vZGF0YXZpei5zZXJ2aWNlJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpDaG9yb3BsZXRoTWFwRGF0YSB9IGZyb20gJy4vZGF0YXZpei5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWNob3JvcGxldGgtbWFwJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0JylcbiAgY2hhcnRDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWNoYXJ0LWNob3JvcGxldGgtbWFwJylcbiAgY2hvcm9wbGV0aE1hcENsYXNzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBkYXRhOiBBcnJheTxQYmRzRGF0YXZpekNob3JvcGxldGhNYXBEYXRhPjtcblxuICBASW5wdXQoKVxuICB0b3BvanNvbjtcblxuICBASW5wdXQoKVxuICBmZWF0dXJlID0gJyc7XG5cbiAgQElucHV0KClcbiAgcHJvamVjdGlvblR5cGU7XG5cbiAgQElucHV0KClcbiAgZGF0YUZpZWxkID0gJ2lkJztcblxuICBASW5wdXQoKVxuICBtZXNoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBzY2FsZSA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgY2VudGVyID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB3aWR0aCA9IDk2MDtcblxuICBASW5wdXQoKVxuICBoZWlnaHQgPSA1MDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luVG9wID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5SaWdodCA9IDA7XG5cbiAgQElucHV0KClcbiAgbWFyZ2luQm90dG9tID0gMDtcblxuICBASW5wdXQoKVxuICBtYXJnaW5MZWZ0ID0gMDtcblxuICBASW5wdXQoKVxuICB0aGVtZTogJ2NsYXNzaWMnIHwgJ29jZWFuJyB8ICdzdW5zZXQnIHwgJ3R3aWxpZ2h0JyA9ICdjbGFzc2ljJztcblxuICBASW5wdXQoKVxuICBjb2xvclNjYWxlOiAndGhyZXNob2xkJyB8ICdxdWFudGlsZScgfCAncXVhbnRpemUnID0gJ3F1YW50aWxlJztcblxuICBASW5wdXQoKVxuICBkb21haW46IEFycmF5PG51bWJlcj47XG5cbiAgQElucHV0KClcbiAgaGlkZVRvb2x0aXAgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0b29sdGlwVmFsdWVGb3JtYXRUeXBlOiAnbnVtYmVyJyA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9vbHRpcFZhbHVlRm9ybWF0U3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgaGlkZUxlZ2VuZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZFdpZHRoID0gMjYwO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExhYmVsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRWYWx1ZUZvcm1hdFR5cGU6ICdudW1iZXInID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRWYWx1ZUZvcm1hdFN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIGxlZ2VuZExlZnQgPSAyMDtcblxuICBASW5wdXQoKVxuICBsZWdlbmRUb3AgPSAyMDtcblxuICBAT3V0cHV0KClcbiAgaG92ZXJlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBAT3V0cHV0KClcbiAgY2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcml2YXRlIHByb2plY3Rpb247XG4gIHByaXZhdGUgZ2VvUGF0aDtcbiAgcHJpdmF0ZSB0b3BvanNvbkZlYXR1cmU7XG4gIHByaXZhdGUgY2hhcnQ7XG4gIHByaXZhdGUgc3ZnO1xuICBwcml2YXRlIG1hcmdpbjtcbiAgcHJpdmF0ZSBjb2xvclJhbmdlO1xuICBwcml2YXRlIGNvbG9yRG9tYWluO1xuICBwcml2YXRlIHRvb2x0aXA7XG4gIHByaXZhdGUgdG9vbHRpcFZhbHVlRm9ybWF0O1xuICBwcml2YXRlIGxlZ2VuZFZhbHVlRm9ybWF0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGF2aXo6IFBiZHNEYXRhdml6U2VydmljZSwgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFyZ2luID0ge1xuICAgICAgdG9wOiArdGhpcy5tYXJnaW5Ub3AsXG4gICAgICByaWdodDogK3RoaXMubWFyZ2luUmlnaHQsXG4gICAgICBib3R0b206ICt0aGlzLm1hcmdpbkJvdHRvbSxcbiAgICAgIGxlZnQ6ICt0aGlzLm1hcmdpbkxlZnRcbiAgICB9O1xuXG4gICAgLy8gY29sb3IgcmFuZ2VcbiAgICBjb25zdCBjb2xvcnMgPSB0aGlzLl9kYXRhdml6LmdldENvbG9ycyh0cnVlLCB0aGlzLnRoZW1lKS5zbGljZSgpLnJldmVyc2UoKTtcblxuICAgIGNvbnN0IGNvbG9yRG9tYWluOiBhbnkgPSBbK2QzX21pbih0aGlzLmRhdGEsIChkKSA9PiBkLnZhbHVlKSwgK2QzX21heCh0aGlzLmRhdGEsIChkKSA9PiBkLnZhbHVlKV07XG4gICAgY29uc3QgY29sb3JWYWx1ZXMgPSB0aGlzLmRhdGEubWFwKChkKSA9PiBkLnZhbHVlKTtcblxuICAgIHN3aXRjaCAodGhpcy5jb2xvclNjYWxlKSB7XG4gICAgICBjYXNlICd0aHJlc2hvbGQnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVRocmVzaG9sZCgpLmRvbWFpbih0aGlzLmRvbWFpbikucmFuZ2UoY29sb3JzKTtcblxuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gdGhpcy5jb2xvclJhbmdlLmRvbWFpbigpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncXVhbnRpbGUnOlxuICAgICAgICB0aGlzLmNvbG9yUmFuZ2UgPSBkM19zY2FsZVF1YW50aWxlKCkuZG9tYWluKGNvbG9yVmFsdWVzKS5yYW5nZShjb2xvcnMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JEb21haW4gPSB0aGlzLmNvbG9yUmFuZ2UucXVhbnRpbGVzKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdxdWFudGl6ZSc6XG4gICAgICAgIHRoaXMuY29sb3JSYW5nZSA9IGQzX3NjYWxlUXVhbnRpemUoKS5kb21haW4oY29sb3JEb21haW4pLnJhbmdlKGNvbG9ycyk7XG5cbiAgICAgICAgdGhpcy5jb2xvckRvbWFpbiA9IHRoaXMuY29sb3JSYW5nZS50aHJlc2hvbGRzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBmb3JtYXR0ZXJzXG4gICAgdGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMudG9vbHRpcFZhbHVlRm9ybWF0VHlwZSwgdGhpcy50b29sdGlwVmFsdWVGb3JtYXRTdHJpbmcpO1xuICAgIHRoaXMubGVnZW5kVmFsdWVGb3JtYXQgPSB0aGlzLl9kYXRhdml6LmQzRm9ybWF0KHRoaXMubGVnZW5kVmFsdWVGb3JtYXRUeXBlLCB0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0U3RyaW5nKTtcblxuICAgIHN3aXRjaCAodGhpcy5wcm9qZWN0aW9uVHlwZSkge1xuICAgICAgY2FzZSAnZ2VvQWxiZXJzJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvQWxiZXJzKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdnZW9BbGJlcnNVc2EnOlxuICAgICAgICB0aGlzLnByb2plY3Rpb24gPSBkM19nZW9BbGJlcnNVc2EoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2dlb01lcmNhdG9yJzpcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gZDNfZ2VvTWVyY2F0b3IoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy50b3BvanNvbkZlYXR1cmUgPSB0b3BvanNvbi5mZWF0dXJlKHRoaXMudG9wb2pzb24sIHRoaXMudG9wb2pzb24ub2JqZWN0c1t0aGlzLmZlYXR1cmVdKTtcbiAgICB0aGlzLnByb2plY3Rpb24uZml0U2l6ZShbK3RoaXMud2lkdGgsICt0aGlzLmhlaWdodF0sIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcblxuICAgIGlmICh0aGlzLnNjYWxlKSB7XG4gICAgICB0aGlzLnByb2plY3Rpb24uc2NhbGUoK3RoaXMuc2NhbGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNlbnRlcikge1xuICAgICAgdGhpcy5wcm9qZWN0aW9uLmNlbnRlcih0aGlzLmNlbnRlcik7XG4gICAgfVxuXG4gICAgdGhpcy5nZW9QYXRoID0gZDNfZ2VvUGF0aCgpLnByb2plY3Rpb24odGhpcy5wcm9qZWN0aW9uKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdUT1BPSlNPTjogJywgdGhpcy50b3BvanNvbik7XG4gICAgLy8gY29uc29sZS5sb2coJ1RPUE9KU09OIEZFQVRVUkU6ICcsIHRoaXMudG9wb2pzb25GZWF0dXJlKTtcbiAgICAvLyBjb25zb2xlLmxvZygnTUVTSDogJywgdG9wb2pzb24ubWVzaCh0aGlzLnRvcG9qc29uLCB0aGlzLnRvcG9qc29uLm9iamVjdHNbdGhpcy5mZWF0dXJlXSwgKGEsIGIpID0+IGEgIT09IGIpKTtcbiAgICAvLyBjb25zb2xlLmxvZygnREFUQTogJywgdGhpcy5kYXRhKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgICB0aGlzLmNoYXJ0ID0gZDNfc2VsZWN0KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gVE9PTFRJUFxuICAgIGlmICghdGhpcy5oaWRlVG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwID0gZDNfc2VsZWN0KCdib2R5JylcbiAgICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BiZHMtdG9vbHRpcCBzb3V0aCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGhpZGUgdG9vbHRpcCBmb3IgYWNjZXNzaWJpbGl0eVxuXG4gICAgICAvLyB0b29sdGlwIGhlYWRlclxuICAgICAgdGhpcy50b29sdGlwLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAndG9vbHRpcC1oZWFkZXInKTtcbiAgICAgIHRoaXMudG9vbHRpcC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3Rvb2x0aXAtdmFsdWUnKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgY2hhcnQgc3ZnXG4gICAgdGhpcy5zdmcgPSB0aGlzLmNoYXJ0XG4gICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgK3RoaXMud2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgK3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ltZy1mbHVpZCcpXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbiBtZWV0JylcbiAgICAgIC5hdHRyKFxuICAgICAgICAndmlld0JveCcsXG4gICAgICAgIGAtJHt0aGlzLm1hcmdpbi5sZWZ0fSAtJHt0aGlzLm1hcmdpbi50b3B9ICR7K3RoaXMud2lkdGh9ICR7K3RoaXMuaGVpZ2h0ICsgdGhpcy5tYXJnaW4udG9wICsgdGhpcy5tYXJnaW4uYm90dG9tfWBcbiAgICAgICk7XG5cbiAgICAvLyBtYXBcbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLmRhdGEodGhpcy50b3BvanNvbkZlYXR1cmUuZmVhdHVyZXMpXG4gICAgICAuam9pbigoZW50ZXIpID0+IGVudGVyLmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2ZlYXR1cmUnKS5hdHRyKCdkJywgdGhpcy5nZW9QYXRoKSk7XG5cbiAgICAvLyBib3JkZXJzXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21lc2gnKVxuICAgICAgLmRhdHVtKHRvcG9qc29uLm1lc2godGhpcy50b3BvanNvbiwgdGhpcy50b3BvanNvbi5vYmplY3RzW3RoaXMubWVzaCB8fCB0aGlzLmZlYXR1cmVdLCAoYSwgYikgPT4gYSAhPT0gYikpXG4gICAgICAuYXR0cignZCcsIHRoaXMuZ2VvUGF0aCk7XG5cbiAgICAvLyBsZWdlbmRcbiAgICBpZiAoIXRoaXMuaGlkZUxlZ2VuZCkge1xuICAgICAgdGhpcy5zdmdcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7K3RoaXMubGVnZW5kTGVmdH0sICR7K3RoaXMubGVnZW5kVG9wfSlgKVxuICAgICAgICAuY2FsbCh0aGlzLmxlZ2VuZCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMuc3ZnXG4gICAgICAuc2VsZWN0KCcubWFwJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpID0+IHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLmRhdGEuZmluZCgob2JqKSA9PiBvYmpbdGhpcy5kYXRhRmllbGRdID09PSBkW3RoaXMuZGF0YUZpZWxkXSk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yUmFuZ2UobWF0Y2gudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNsYXNzZWQoJ2hhc0RhdGEnLCAoZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNvbWUoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZFt0aGlzLmRhdGFGaWVsZF0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZVRvb2x0aXApIHtcbiAgICAgIHRoaXMuc3ZnXG4gICAgICAgIC5zZWxlY3QoJy5tYXAnKVxuICAgICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PlxuICAgICAgICAgIHRoaXMuZmVhdHVyZU1vdXNlT3ZlcihcbiAgICAgICAgICAgIGQzX2V2ZW50LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmZpbmQoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZGF0YVt0aGlzLmRhdGFGaWVsZF0pLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBub2Rlc1xuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGRhdGEsIGluZGV4LCBub2RlcykgPT4gdGhpcy5mZWF0dXJlTW91c2VPdXQoZDNfZXZlbnQsIHRoaXMuZGF0YSwgaW5kZXgsIG5vZGVzKSlcbiAgICAgICAgLm9uKCdtb3VzZW1vdmUnLCAoZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB0aGlzLnRvb2x0aXBNb3ZlKHRoaXMuY2hhcnQubm9kZSgpKSlcbiAgICAgICAgLm9uKCdjbGljaycsIChkYXRhLCBpbmRleCwgbm9kZXMpID0+XG4gICAgICAgICAgdGhpcy5mZWF0dXJlTW91c2VDbGljayhcbiAgICAgICAgICAgIGQzX2V2ZW50LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmZpbmQoKG9iaikgPT4gb2JqW3RoaXMuZGF0YUZpZWxkXSA9PT0gZGF0YVt0aGlzLmRhdGFGaWVsZF0pLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBub2Rlc1xuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgZmVhdHVyZU1vdXNlT3ZlciA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudG9vbHRpcFNob3coZGF0YSwgbm9kZXNbaW5kZXhdKTtcbiAgICAgIHRoaXMuaG92ZXJlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZlYXR1cmVNb3VzZU91dCA9IChldmVudCwgZGF0YSwgaW5kZXgsIG5vZGVzKSA9PiB7XG4gICAgdGhpcy50b29sdGlwSGlkZSgpO1xuICB9O1xuXG4gIGZlYXR1cmVNb3VzZUNsaWNrID0gKGV2ZW50LCBkYXRhLCBpbmRleCwgbm9kZXMpID0+IHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5jbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSB9KTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB0b29sdGlwU2hvdyA9IChkYXRhLCBub2RlKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJ1RPT0xUSVA6ICcsIGRhdGEsIG5vZGUpO1xuXG4gICAgdGhpcy50b29sdGlwU2V0UG9zaXRpb24obm9kZSk7XG5cbiAgICBpZiAoZGF0YS5sYWJlbCkge1xuICAgICAgdGhpcy50b29sdGlwLnNlbGVjdCgnLnRvb2x0aXAtaGVhZGVyJykuaHRtbCgoZCkgPT4gYCR7ZGF0YS5sYWJlbH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvb2x0aXBcbiAgICAgIC5zZWxlY3QoJy50b29sdGlwLXZhbHVlJylcbiAgICAgIC5odG1sKChkKSA9PiAodGhpcy50b29sdGlwVmFsdWVGb3JtYXQgPyBgJHt0aGlzLnRvb2x0aXBWYWx1ZUZvcm1hdChkYXRhLnZhbHVlKX1gIDogYCR7ZGF0YS52YWx1ZX1gKSk7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICBwcml2YXRlIHRvb2x0aXBIaWRlID0gKCkgPT4ge1xuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcE1vdmUgPSAobm9kZSkgPT4ge1xuICAgIHRoaXMudG9vbHRpcFNldFBvc2l0aW9uKG5vZGUpO1xuICB9O1xuXG4gIHByaXZhdGUgdG9vbHRpcFNldFBvc2l0aW9uID0gKG5vZGUpID0+IHtcbiAgICBjb25zdCBtb3VzZSA9IGQzX21vdXNlKG5vZGUpO1xuICAgIGNvbnN0IG1vdXNlTGVmdCA9ICttb3VzZVswXTtcbiAgICBjb25zdCBtb3VzZVRvcCA9ICttb3VzZVsxXTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBnZW9tZXRyeUxlZnQgPSArZ2VvbWV0cnkubGVmdDtcbiAgICBjb25zdCBnZW9tZXRyeVRvcCA9ICtnZW9tZXRyeS50b3A7XG5cbiAgICBjb25zdCBzY3JvbGwgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICAvLyBjb25zdCBzY3JvbGxMZWZ0ID0gK3Njcm9sbFswXTtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSArc2Nyb2xsWzFdO1xuXG4gICAgY29uc3QgdG9vbHRpcE9mZnNldFdpZHRoID0gK3RoaXMudG9vbHRpcC5ub2RlKCkub2Zmc2V0V2lkdGggLyAyO1xuICAgIGNvbnN0IHRvb2x0aXBPZmZzZXRIZWlnaHQgPSArdGhpcy50b29sdGlwLm5vZGUoKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ3RvcCcsIGAke3Njcm9sbFRvcCArIG1vdXNlVG9wICsgZ2VvbWV0cnlUb3AgLSB0b29sdGlwT2Zmc2V0SGVpZ2h0IC0gMTR9cHhgKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2xlZnQnLCBgJHttb3VzZUxlZnQgKyBnZW9tZXRyeUxlZnQgLSB0b29sdGlwT2Zmc2V0V2lkdGh9cHhgKTtcbiAgfTtcblxuICBsZWdlbmQgPSAoZykgPT4ge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuY29sb3JSYW5nZS5yYW5nZSgpLmxlbmd0aDtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY29sb3JSYW5nZS5yYW5nZSgpLmxlbmd0aCwgdGhpcy5jb2xvckRvbWFpbik7XG5cbiAgICBjb25zdCB4ID0gZDNfc2NhbGVMaW5lYXIoKVxuICAgICAgLmRvbWFpbihbMSwgbGVuZ3RoIC0gMV0pXG4gICAgICAucmFuZ2VSb3VuZChbK3RoaXMubGVnZW5kV2lkdGggLyBsZW5ndGgsICh0aGlzLmxlZ2VuZFdpZHRoICogKGxlbmd0aCAtIDEpKSAvIGxlbmd0aF0pO1xuXG4gICAgZy5hdHRyKCdjbGFzcycsICdsZWdlbmQnKVxuICAgICAgLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICAuZGF0YSh0aGlzLmNvbG9yUmFuZ2UucmFuZ2UoKSlcbiAgICAgIC5qb2luKCdyZWN0JylcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCA4KVxuICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4geChpKSlcbiAgICAgIC5hdHRyKCd3aWR0aCcsIChkLCBpKSA9PiB4KGkgKyAxKSAtIHgoaSkpXG4gICAgICAuYXR0cignZmlsbCcsIChkKSA9PiBkKTtcblxuICAgIGlmICh0aGlzLmxlZ2VuZExhYmVsKSB7XG4gICAgICBnLmFwcGVuZCgndGV4dCcpLmF0dHIoJ3knLCAtNikuYXR0cigndGV4dC1hbmNob3InLCAnc3RhcnQnKS5hdHRyKCdjbGFzcycsICdsZWdlbmQtbGFiZWwnKS50ZXh0KHRoaXMubGVnZW5kTGFiZWwpO1xuICAgIH1cblxuICAgIGcuY2FsbChcbiAgICAgIGQzX2F4aXNCb3R0b20oeClcbiAgICAgICAgLnRpY2tTaXplKDEzKVxuICAgICAgICAudGlja1ZhbHVlcyhkM19yYW5nZSgxLCBsZW5ndGgpKVxuICAgICAgICAudGlja0Zvcm1hdCgoaTogbnVtYmVyKSA9PlxuICAgICAgICAgIHRoaXMubGVnZW5kVmFsdWVGb3JtYXQgPyBgJHt0aGlzLmxlZ2VuZFZhbHVlRm9ybWF0KHRoaXMuY29sb3JEb21haW5baSAtIDFdKX1gIDogYCR7dGhpcy5jb2xvckRvbWFpbltpIC0gMV19YFxuICAgICAgICApXG4gICAgKVxuICAgICAgLnNlbGVjdCgnLmRvbWFpbicpXG4gICAgICAucmVtb3ZlKCk7XG4gIH07XG59XG4iXX0=
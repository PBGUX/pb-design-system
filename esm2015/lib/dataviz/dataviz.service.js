/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class PbdsDatavizService {
    constructor() {
        this.colors = {
            mono: ['#00436e', '#005a93', '#0072b8', '#66aad4', '#cce3f1', '#e5f1f8'],
            theme: [
                '#3e53a4',
                '#cf0989',
                '#009bdf',
                '#ee6b0b',
                '#edb700',
                '#a03f9b',
                '#00b140',
                '#66c3ec',
                '#c0c0c0',
                '#f5a66d',
                '#8b98c8',
                '#aad88f'
            ]
        };
        this.getColors = mono => {
            return mono ? this.colors.mono : this.colors.theme;
        };
        this.createGradientDefs = (svg, mono) => {
            /** @type {?} */
            const colors = mono ? [this.colors.mono[2]] : this.colors.theme;
            for (let i = 0; i < colors.length; i++) {
                /** @type {?} */
                const color = mono ? this.colors.mono[2] : this.colors.theme[i];
                /** @type {?} */
                const gradient = svg
                    .append('defs')
                    .append('linearGradient')
                    .attr('id', `gradient-${color.replace('#', '')}`)
                    .attr('x1', '0')
                    .attr('y1', '0')
                    .attr('x2', '0')
                    .attr('y2', '1')
                    .attr('spreadMethod', 'pad');
                gradient
                    .append('stop')
                    .attr('offset', '0%')
                    .attr('stop-color', color)
                    .attr('stop-opacity', '1'); // top of bar will be full opacity
                gradient
                    .append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', color)
                    .attr('stop-opacity', '.3'); // bottom of bar will be .3 opacity
            }
            return colors;
        };
        this.createGlowFilter = svg => {
            // add a new definition
            /** @type {?} */
            const glow = svg
                .append('defs')
                .append('filter')
                .attr('id', 'glow')
                .attr('width', '200%')
                .attr('height', '200%');
            glow
                .append('feGaussianBlur')
                .attr('in', 'SourceGraphic')
                .attr('stdDeviation', 4);
            // build two dropshadows with different intensities
            /** @type {?} */
            const feOffsets = [
                {
                    dy: 2,
                    slope: 0.2
                },
                {
                    dy: 5,
                    slope: 0.05
                }
            ];
            for (let i = 0; i < feOffsets.length; i++) {
                glow
                    .append('feOffset')
                    .attr('result', 'offsetBlur' + i)
                    .attr('dx', 0)
                    .attr('dy', feOffsets[i].dy);
            }
            for (let y = 0; y < feOffsets.length; y++) {
                glow
                    .append('feComponentTransfer')
                    .attr('result', 'coloredBlur' + y)
                    .attr('in', 'offsetBlur' + y)
                    .append('feFuncA')
                    .attr('type', 'linear')
                    .attr('slope', feOffsets[y].slope);
            }
            /** @type {?} */
            let merge = glow.append('feMerge');
            merge.append('feMergeNode').attr('in', 'SourceGraphic');
            for (let x = 0; x < feOffsets.length; x++) {
                merge.append('feMergeNode').attr('in', 'coloredBlur' + x);
            }
        };
    }
}
PbdsDatavizService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
PbdsDatavizService.ctorParameters = () => [];
/** @nocollapse */ PbdsDatavizService.ngInjectableDef = i0.defineInjectable({ factory: function PbdsDatavizService_Factory() { return new PbdsDatavizService(); }, token: PbdsDatavizService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    PbdsDatavizService.prototype.colors;
    /** @type {?} */
    PbdsDatavizService.prototype.getColors;
    /** @type {?} */
    PbdsDatavizService.prototype.createGradientDefs;
    /** @type {?} */
    PbdsDatavizService.prototype.createGlowFilter;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXouc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLM0MsTUFBTSxPQUFPLGtCQUFrQjtJQW1CN0I7UUFsQlEsV0FBTSxHQUFHO1lBQ2YsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7WUFDeEUsS0FBSyxFQUFFO2dCQUNMLFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2FBQ1Y7U0FDRixDQUFDO1FBSUYsY0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDckQsQ0FBQyxDQUFDO1FBRUYsdUJBQWtCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7O2tCQUMzQixNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztZQUUvRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7c0JBQ2hDLEtBQUssR0FB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Q0FBQyxTQUFTLENBQUM7cUJBQ2pCLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO3FCQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0Qzs7Z0JBRUcsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBRWxDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztZQUV4RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUMzRDtRQUNILENBQUMsQ0FBQztJQXpGYSxDQUFDOzs7WUF0QmpCLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7Ozs7Ozs7OztJQUVDLG9DQWdCRTs7SUFJRix1Q0FFRTs7SUFFRixnREE4QkU7O0lBRUYsOENBbURFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelNlcnZpY2Uge1xuICBwcml2YXRlIGNvbG9ycyA9IHtcbiAgICBtb25vOiBbJyMwMDQzNmUnLCAnIzAwNWE5MycsICcjMDA3MmI4JywgJyM2NmFhZDQnLCAnI2NjZTNmMScsICcjZTVmMWY4J10sXG4gICAgdGhlbWU6IFtcbiAgICAgICcjM2U1M2E0JyxcbiAgICAgICcjY2YwOTg5JyxcbiAgICAgICcjMDA5YmRmJyxcbiAgICAgICcjZWU2YjBiJyxcbiAgICAgICcjZWRiNzAwJyxcbiAgICAgICcjYTAzZjliJyxcbiAgICAgICcjMDBiMTQwJyxcbiAgICAgICcjNjZjM2VjJyxcbiAgICAgICcjYzBjMGMwJyxcbiAgICAgICcjZjVhNjZkJyxcbiAgICAgICcjOGI5OGM4JyxcbiAgICAgICcjYWFkODhmJ1xuICAgIF1cbiAgfTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgZ2V0Q29sb3JzID0gbW9ubyA9PiB7XG4gICAgcmV0dXJuIG1vbm8gPyB0aGlzLmNvbG9ycy5tb25vIDogdGhpcy5jb2xvcnMudGhlbWU7XG4gIH07XG5cbiAgY3JlYXRlR3JhZGllbnREZWZzID0gKHN2ZywgbW9ubykgPT4ge1xuICAgIGNvbnN0IGNvbG9ycyA9IG1vbm8gPyBbdGhpcy5jb2xvcnMubW9ub1syXV0gOiB0aGlzLmNvbG9ycy50aGVtZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb2xvciA9IG1vbm8gPyB0aGlzLmNvbG9ycy5tb25vWzJdIDogdGhpcy5jb2xvcnMudGhlbWVbaV07XG5cbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2RlZnMnKVxuICAgICAgICAuYXBwZW5kKCdsaW5lYXJHcmFkaWVudCcpXG4gICAgICAgIC5hdHRyKCdpZCcsIGBncmFkaWVudC0ke2NvbG9yLnJlcGxhY2UoJyMnLCAnJyl9YClcbiAgICAgICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgICAgICAuYXR0cigneTEnLCAnMCcpXG4gICAgICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAgICAgLmF0dHIoJ3kyJywgJzEnKVxuICAgICAgICAuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpO1xuXG4gICAgICBncmFkaWVudFxuICAgICAgICAuYXBwZW5kKCdzdG9wJylcbiAgICAgICAgLmF0dHIoJ29mZnNldCcsICcwJScpXG4gICAgICAgIC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IpXG4gICAgICAgIC5hdHRyKCdzdG9wLW9wYWNpdHknLCAnMScpOyAvLyB0b3Agb2YgYmFyIHdpbGwgYmUgZnVsbCBvcGFjaXR5XG5cbiAgICAgIGdyYWRpZW50XG4gICAgICAgIC5hcHBlbmQoJ3N0b3AnKVxuICAgICAgICAuYXR0cignb2Zmc2V0JywgJzEwMCUnKVxuICAgICAgICAuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yKVxuICAgICAgICAuYXR0cignc3RvcC1vcGFjaXR5JywgJy4zJyk7IC8vIGJvdHRvbSBvZiBiYXIgd2lsbCBiZSAuMyBvcGFjaXR5XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbG9ycztcbiAgfTtcblxuICBjcmVhdGVHbG93RmlsdGVyID0gc3ZnID0+IHtcbiAgICAvLyBhZGQgYSBuZXcgZGVmaW5pdGlvblxuICAgIGNvbnN0IGdsb3cgPSBzdmdcbiAgICAgIC5hcHBlbmQoJ2RlZnMnKVxuICAgICAgLmFwcGVuZCgnZmlsdGVyJylcbiAgICAgIC5hdHRyKCdpZCcsICdnbG93JylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICcyMDAlJylcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAnMjAwJScpO1xuXG4gICAgZ2xvd1xuICAgICAgLmFwcGVuZCgnZmVHYXVzc2lhbkJsdXInKVxuICAgICAgLmF0dHIoJ2luJywgJ1NvdXJjZUdyYXBoaWMnKVxuICAgICAgLmF0dHIoJ3N0ZERldmlhdGlvbicsIDQpO1xuXG4gICAgLy8gYnVpbGQgdHdvIGRyb3BzaGFkb3dzIHdpdGggZGlmZmVyZW50IGludGVuc2l0aWVzXG4gICAgY29uc3QgZmVPZmZzZXRzID0gW1xuICAgICAge1xuICAgICAgICBkeTogMixcbiAgICAgICAgc2xvcGU6IDAuMlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZHk6IDUsXG4gICAgICAgIHNsb3BlOiAwLjA1XG4gICAgICB9XG4gICAgXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmVPZmZzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnbG93XG4gICAgICAgIC5hcHBlbmQoJ2ZlT2Zmc2V0JylcbiAgICAgICAgLmF0dHIoJ3Jlc3VsdCcsICdvZmZzZXRCbHVyJyArIGkpXG4gICAgICAgIC5hdHRyKCdkeCcsIDApXG4gICAgICAgIC5hdHRyKCdkeScsIGZlT2Zmc2V0c1tpXS5keSk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBmZU9mZnNldHMubGVuZ3RoOyB5KyspIHtcbiAgICAgIGdsb3dcbiAgICAgICAgLmFwcGVuZCgnZmVDb21wb25lbnRUcmFuc2ZlcicpXG4gICAgICAgIC5hdHRyKCdyZXN1bHQnLCAnY29sb3JlZEJsdXInICsgeSlcbiAgICAgICAgLmF0dHIoJ2luJywgJ29mZnNldEJsdXInICsgeSlcbiAgICAgICAgLmFwcGVuZCgnZmVGdW5jQScpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ2xpbmVhcicpXG4gICAgICAgIC5hdHRyKCdzbG9wZScsIGZlT2Zmc2V0c1t5XS5zbG9wZSk7XG4gICAgfVxuXG4gICAgbGV0IG1lcmdlID0gZ2xvdy5hcHBlbmQoJ2ZlTWVyZ2UnKTtcblxuICAgIG1lcmdlLmFwcGVuZCgnZmVNZXJnZU5vZGUnKS5hdHRyKCdpbicsICdTb3VyY2VHcmFwaGljJyk7XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGZlT2Zmc2V0cy5sZW5ndGg7IHgrKykge1xuICAgICAgbWVyZ2UuYXBwZW5kKCdmZU1lcmdlTm9kZScpLmF0dHIoJ2luJywgJ2NvbG9yZWRCbHVyJyArIHgpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
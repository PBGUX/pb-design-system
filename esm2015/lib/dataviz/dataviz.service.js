/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class PbdsDatavizService {
    // mono: ['#253162', '#314183', '#3e53a4', '#8b98c8', '#d8dded', '#eceef6'] // blue
    // mono: ['#00436e', '#005a93', '#0072b8', '#66aad4', '#cce3f1', '#e5f1f8'] // medium blue
    constructor() {
        this.colors = {
            classic: {
                full: [
                    '#E23DA8',
                    '#314183',
                    '#1BB9FF',
                    '#FF8B00',
                    '#0384D4',
                    '#00B140',
                    '#A319B1',
                    '#FFC500',
                    '#8B98C8',
                    '#CCB8CE',
                    '#E6C49C',
                    '#9B9B9B'
                ],
                // mono: ['#060810', '#253262', '#3E53A4', '#7887BF', '#B2BADB', '#D8DDED'] // for heatmap testing
                mono: ['#253162', '#314183', '#3e53a4', '#8b98c8', '#d8dded', '#eceef6'] // blue
            },
            twilight: {
                full: [
                    '#E23DA8',
                    '#314183',
                    '#1BB9FF',
                    '#FF8B00',
                    '#0384D4',
                    '#00B140',
                    '#A319B1',
                    '#FFC500',
                    '#8B98C8',
                    '#CCB8CE',
                    '#E6C49C',
                    '#9B9B9B'
                ],
                mono: ['#60255d', '#80327c', '#a03f9b', '#c68cc3', '#ecd9eb', '#f5ecf5'] // purple
            },
            ocean: {
                full: [
                    '#0384D4',
                    '#00B140',
                    '#314183',
                    '#1BB9FF',
                    '#E23DA8',
                    '#FFC500',
                    '#A319B1',
                    '#FF8B00',
                    '#8B98C8',
                    '#E6C49C',
                    '#CCB8CE',
                    '#9B9B9B'
                ],
                mono: ['#00436e', '#005a93', '#0072b8', '#66aad4', '#cce3f1', '#e5f1f8'] // medium blue
            },
            sunset: {
                full: [
                    '#FF8B00',
                    '#A319B1',
                    '#1BB9FF',
                    '#E23DA8',
                    '#FFC500',
                    '#314183',
                    '#00B140',
                    '#0384D4',
                    '#CCB8CE',
                    '#E6C49C',
                    '#8B98C8',
                    '#9B9B9B'
                ],
                // mono: ['#fff2e3', '#fee3cb', '#f6a76b', '#ee6b0b', '#be5408', '#8e3f06'] // orange
                mono: ['#8e3f06', '#be5408', '#ee6b0b', '#f6a76b', '#fee3cb', '#fff2e3'] // orange
            }
        };
        this.getColors = (/**
         * @param {?=} mono
         * @param {?=} theme
         * @return {?}
         */
        (mono = false, theme = 'classic') => {
            return mono ? this.colors[theme].mono : this.colors[theme].full;
        });
        this.createGradientDefs = (/**
         * @param {?} svg
         * @param {?=} mono
         * @param {?=} theme
         * @return {?}
         */
        (svg, mono = false, theme = 'classic') => {
            /** @type {?} */
            const colors = mono ? [this.colors[theme].mono[2]] : this.colors[theme].full;
            for (let i = 0; i < colors.length; i++) {
                /** @type {?} */
                const color = mono ? this.colors[theme].mono[2] : this.colors[theme].full[i];
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
        });
        this.createGlowFilter = (/**
         * @param {?} svg
         * @return {?}
         */
        svg => {
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
        });
    }
}
PbdsDatavizService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
PbdsDatavizService.ctorParameters = () => [];
/** @nocollapse */ PbdsDatavizService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function PbdsDatavizService_Factory() { return new PbdsDatavizService(); }, token: PbdsDatavizService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXouc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLM0MsTUFBTSxPQUFPLGtCQUFrQjs7O0lBNkU3QjtRQTVFUSxXQUFNLEdBQUc7WUFDZixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFO29CQUNKLFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO2lCQUNWOztnQkFFRCxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU87YUFDakY7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNKLFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO2lCQUNWO2dCQUNELElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsU0FBUzthQUNuRjtZQUNELEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUU7b0JBQ0osU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNB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N0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxhQUFhLEdBQUcsQ0FBQyxDQUFDO3FCQUNqQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksR0FBRyxDQUFDLENBQUM7cUJBQzVCLE1BQU0sQ0FBQyxTQUFTLENBQUM7cUJBQ2pCLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO3FCQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0Qzs7Z0JBRUcsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBRWxDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztZQUV4RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUMzRDtRQUNILENBQUMsRUFBQztJQXpGYSxDQUFDOzs7WUFoRmpCLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7Ozs7Ozs7OztJQUVDLG9DQXVFRTs7SUFPRix1Q0FFRTs7SUFFRixnREE4QkU7O0lBRUYsOENBbURFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelNlcnZpY2Uge1xuICBwcml2YXRlIGNvbG9ycyA9IHtcbiAgICBjbGFzc2ljOiB7XG4gICAgICBmdWxsOiBbXG4gICAgICAgICcjRTIzREE4JyxcbiAgICAgICAgJyMzMTQxODMnLFxuICAgICAgICAnIzFCQjlGRicsXG4gICAgICAgICcjRkY4QjAwJyxcbiAgICAgICAgJyMwMzg0RDQnLFxuICAgICAgICAnIzAwQjE0MCcsXG4gICAgICAgICcjQTMxOUIxJyxcbiAgICAgICAgJyNGRkM1MDAnLFxuICAgICAgICAnIzhCOThDOCcsXG4gICAgICAgICcjQ0NCOENFJyxcbiAgICAgICAgJyNFNkM0OUMnLFxuICAgICAgICAnIzlCOUI5QidcbiAgICAgIF0sXG4gICAgICAvLyBtb25vOiBbJyMwNjA4MTAnLCAnIzI1MzI2MicsICcjM0U1M0E0JywgJyM3ODg3QkYnLCAnI0IyQkFEQicsICcjRDhEREVEJ10gLy8gZm9yIGhlYXRtYXAgdGVzdGluZ1xuICAgICAgbW9ubzogWycjMjUzMTYyJywgJyMzMTQxODMnLCAnIzNlNTNhNCcsICcjOGI5OGM4JywgJyNkOGRkZWQnLCAnI2VjZWVmNiddIC8vIGJsdWVcbiAgICB9LFxuICAgIHR3aWxpZ2h0OiB7XG4gICAgICBmdWxsOiBbXG4gICAgICAgICcjRTIzREE4JyxcbiAgICAgICAgJyMzMTQxODMnLFxuICAgICAgICAnIzFCQjlGRicsXG4gICAgICAgICcjRkY4QjAwJyxcbiAgICAgICAgJyMwMzg0RDQnLFxuICAgICAgICAnIzAwQjE0MCcsXG4gICAgICAgICcjQTMxOUIxJyxcbiAgICAgICAgJyNGRkM1MDAnLFxuICAgICAgICAnIzhCOThDOCcsXG4gICAgICAgICcjQ0NCOENFJyxcbiAgICAgICAgJyNFNkM0OUMnLFxuICAgICAgICAnIzlCOUI5QidcbiAgICAgIF0sXG4gICAgICBtb25vOiBbJyM2MDI1NWQnLCAnIzgwMzI3YycsICcjYTAzZjliJywgJyNjNjhjYzMnLCAnI2VjZDllYicsICcjZjVlY2Y1J10gLy8gcHVycGxlXG4gICAgfSxcbiAgICBvY2Vhbjoge1xuICAgICAgZnVsbDogW1xuICAgICAgICAnIzAzODRENCcsXG4gICAgICAgICcjMDBCMTQwJyxcbiAgICAgICAgJyMzMTQxODMnLFxuICAgICAgICAnIzFCQjlGRicsXG4gICAgICAgICcjRTIzREE4JyxcbiAgICAgICAgJyNGRkM1MDAnLFxuICAgICAgICAnI0EzMTlCMScsXG4gICAgICAgICcjRkY4QjAwJyxcbiAgICAgICAgJyM4Qjk4QzgnLFxuICAgICAgICAnI0U2QzQ5QycsXG4gICAgICAgICcjQ0NCOENFJyxcbiAgICAgICAgJyM5QjlCOUInXG4gICAgICBdLFxuICAgICAgbW9ubzogWycjMDA0MzZlJywgJyMwMDVhOTMnLCAnIzAwNzJiOCcsICcjNjZhYWQ0JywgJyNjY2UzZjEnLCAnI2U1ZjFmOCddIC8vIG1lZGl1bSBibHVlXG4gICAgfSxcbiAgICBzdW5zZXQ6IHtcbiAgICAgIGZ1bGw6IFtcbiAgICAgICAgJyNGRjhCMDAnLFxuICAgICAgICAnI0EzMTlCMScsXG4gICAgICAgICcjMUJCOUZGJyxcbiAgICAgICAgJyNFMjNEQTgnLFxuICAgICAgICAnI0ZGQzUwMCcsXG4gICAgICAgICcjMzE0MTgzJyxcbiAgICAgICAgJyMwMEIxNDAnLFxuICAgICAgICAnIzAzODRENCcsXG4gICAgICAgICcjQ0NCOENFJyxcbiAgICAgICAgJyNFNkM0OUMnLFxuICAgICAgICAnIzhCOThDOCcsXG4gICAgICAgICcjOUI5QjlCJ1xuICAgICAgXSxcbiAgICAgIC8vIG1vbm86IFsnI2ZmZjJlMycsICcjZmVlM2NiJywgJyNmNmE3NmInLCAnI2VlNmIwYicsICcjYmU1NDA4JywgJyM4ZTNmMDYnXSAvLyBvcmFuZ2VcbiAgICAgIG1vbm86IFsnIzhlM2YwNicsICcjYmU1NDA4JywgJyNlZTZiMGInLCAnI2Y2YTc2YicsICcjZmVlM2NiJywgJyNmZmYyZTMnXSAvLyBvcmFuZ2VcbiAgICB9XG4gIH07XG5cbiAgLy8gbW9ubzogWycjMjUzMTYyJywgJyMzMTQxODMnLCAnIzNlNTNhNCcsICcjOGI5OGM4JywgJyNkOGRkZWQnLCAnI2VjZWVmNiddIC8vIGJsdWVcbiAgLy8gbW9ubzogWycjMDA0MzZlJywgJyMwMDVhOTMnLCAnIzAwNzJiOCcsICcjNjZhYWQ0JywgJyNjY2UzZjEnLCAnI2U1ZjFmOCddIC8vIG1lZGl1bSBibHVlXG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGdldENvbG9ycyA9IChtb25vID0gZmFsc2UsIHRoZW1lID0gJ2NsYXNzaWMnKSA9PiB7XG4gICAgcmV0dXJuIG1vbm8gPyB0aGlzLmNvbG9yc1t0aGVtZV0ubW9ubyA6IHRoaXMuY29sb3JzW3RoZW1lXS5mdWxsO1xuICB9O1xuXG4gIGNyZWF0ZUdyYWRpZW50RGVmcyA9IChzdmcsIG1vbm8gPSBmYWxzZSwgdGhlbWUgPSAnY2xhc3NpYycpID0+IHtcbiAgICBjb25zdCBjb2xvcnMgPSBtb25vID8gW3RoaXMuY29sb3JzW3RoZW1lXS5tb25vWzJdXSA6IHRoaXMuY29sb3JzW3RoZW1lXS5mdWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2xvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gbW9ubyA/IHRoaXMuY29sb3JzW3RoZW1lXS5tb25vWzJdIDogdGhpcy5jb2xvcnNbdGhlbWVdLmZ1bGxbaV07XG5cbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gc3ZnXG4gICAgICAgIC5hcHBlbmQoJ2RlZnMnKVxuICAgICAgICAuYXBwZW5kKCdsaW5lYXJHcmFkaWVudCcpXG4gICAgICAgIC5hdHRyKCdpZCcsIGBncmFkaWVudC0ke2NvbG9yLnJlcGxhY2UoJyMnLCAnJyl9YClcbiAgICAgICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgICAgICAuYXR0cigneTEnLCAnMCcpXG4gICAgICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAgICAgLmF0dHIoJ3kyJywgJzEnKVxuICAgICAgICAuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpO1xuXG4gICAgICBncmFkaWVudFxuICAgICAgICAuYXBwZW5kKCdzdG9wJylcbiAgICAgICAgLmF0dHIoJ29mZnNldCcsICcwJScpXG4gICAgICAgIC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IpXG4gICAgICAgIC5hdHRyKCdzdG9wLW9wYWNpdHknLCAnMScpOyAvLyB0b3Agb2YgYmFyIHdpbGwgYmUgZnVsbCBvcGFjaXR5XG5cbiAgICAgIGdyYWRpZW50XG4gICAgICAgIC5hcHBlbmQoJ3N0b3AnKVxuICAgICAgICAuYXR0cignb2Zmc2V0JywgJzEwMCUnKVxuICAgICAgICAuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yKVxuICAgICAgICAuYXR0cignc3RvcC1vcGFjaXR5JywgJy4zJyk7IC8vIGJvdHRvbSBvZiBiYXIgd2lsbCBiZSAuMyBvcGFjaXR5XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbG9ycztcbiAgfTtcblxuICBjcmVhdGVHbG93RmlsdGVyID0gc3ZnID0+IHtcbiAgICAvLyBhZGQgYSBuZXcgZGVmaW5pdGlvblxuICAgIGNvbnN0IGdsb3cgPSBzdmdcbiAgICAgIC5hcHBlbmQoJ2RlZnMnKVxuICAgICAgLmFwcGVuZCgnZmlsdGVyJylcbiAgICAgIC5hdHRyKCdpZCcsICdnbG93JylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICcyMDAlJylcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAnMjAwJScpO1xuXG4gICAgZ2xvd1xuICAgICAgLmFwcGVuZCgnZmVHYXVzc2lhbkJsdXInKVxuICAgICAgLmF0dHIoJ2luJywgJ1NvdXJjZUdyYXBoaWMnKVxuICAgICAgLmF0dHIoJ3N0ZERldmlhdGlvbicsIDQpO1xuXG4gICAgLy8gYnVpbGQgdHdvIGRyb3BzaGFkb3dzIHdpdGggZGlmZmVyZW50IGludGVuc2l0aWVzXG4gICAgY29uc3QgZmVPZmZzZXRzID0gW1xuICAgICAge1xuICAgICAgICBkeTogMixcbiAgICAgICAgc2xvcGU6IDAuMlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZHk6IDUsXG4gICAgICAgIHNsb3BlOiAwLjA1XG4gICAgICB9XG4gICAgXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmVPZmZzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnbG93XG4gICAgICAgIC5hcHBlbmQoJ2ZlT2Zmc2V0JylcbiAgICAgICAgLmF0dHIoJ3Jlc3VsdCcsICdvZmZzZXRCbHVyJyArIGkpXG4gICAgICAgIC5hdHRyKCdkeCcsIDApXG4gICAgICAgIC5hdHRyKCdkeScsIGZlT2Zmc2V0c1tpXS5keSk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBmZU9mZnNldHMubGVuZ3RoOyB5KyspIHtcbiAgICAgIGdsb3dcbiAgICAgICAgLmFwcGVuZCgnZmVDb21wb25lbnRUcmFuc2ZlcicpXG4gICAgICAgIC5hdHRyKCdyZXN1bHQnLCAnY29sb3JlZEJsdXInICsgeSlcbiAgICAgICAgLmF0dHIoJ2luJywgJ29mZnNldEJsdXInICsgeSlcbiAgICAgICAgLmFwcGVuZCgnZmVGdW5jQScpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ2xpbmVhcicpXG4gICAgICAgIC5hdHRyKCdzbG9wZScsIGZlT2Zmc2V0c1t5XS5zbG9wZSk7XG4gICAgfVxuXG4gICAgbGV0IG1lcmdlID0gZ2xvdy5hcHBlbmQoJ2ZlTWVyZ2UnKTtcblxuICAgIG1lcmdlLmFwcGVuZCgnZmVNZXJnZU5vZGUnKS5hdHRyKCdpbicsICdTb3VyY2VHcmFwaGljJyk7XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGZlT2Zmc2V0cy5sZW5ndGg7IHgrKykge1xuICAgICAgbWVyZ2UuYXBwZW5kKCdmZU1lcmdlTm9kZScpLmF0dHIoJ2luJywgJ2NvbG9yZWRCbHVyJyArIHgpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
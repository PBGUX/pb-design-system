/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class PbdsDatavizService {
    constructor() {
        this.colors = {
            classic: {
                full: [
                    '#E23DA8',
                    '#1BB9FF',
                    '#FF8B00',
                    '#A319B1',
                    '#00B140',
                    '#0384D4',
                    '#314183',
                    '#EDB700',
                    '#8b98c8',
                    '#ccb8ce',
                    '#e6c49c',
                    '#9b9b9b'
                ],
                mono: ['#001D56', '#003296', '#4B74C5', '#89A1D0', '#A3BCEE', '#C9D7F3'] // blue
            },
            twilight: {
                full: [
                    '#A319B1',
                    '#00B140',
                    '#FF8B00',
                    '#1BB9FF',
                    '#E23DA8',
                    '#0384D4',
                    '#314183',
                    '#EDB700',
                    '#8b98c8',
                    '#ccb8ce',
                    '#e6c49c',
                    '#9b9b9b'
                ],
                mono: ['#05395C', '#0A5B92', '#0072B8', '#5DA9DC', '#A5D4F3', '#D1EDFF'] // light blue
            },
            ocean: {
                full: [
                    '#0384D4',
                    '#E23DA8',
                    '#1BB9FF',
                    '#314183',
                    '#FFC500',
                    '#A319B1',
                    '#FF8B00',
                    '#14767D',
                    '#8b98c8',
                    '#e6c49c',
                    '#ccb8ce',
                    '#9b9b9b'
                ],
                mono: ['#394B4D', '#3A6B6E', '#14767D', '#99BFC2', '#C9E6E8', '#DEECED'] // blue-green
            },
            sunset: {
                full: [
                    '#CE2060',
                    '#FF8B00',
                    '#1BB9FF',
                    '#FFC500',
                    '#00B140',
                    '#50248F',
                    '#0384d4',
                    '#CCB8CE',
                    '#314183',
                    '#E6C49C',
                    '#8b98c8',
                    '#9b9b9b'
                ],
                mono: ['#31254A', '#50248F', '#7945C4', '#9A79E2', '#C4A8FF', '#D9C7FF'] // purple
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
         * @param {?=} vertical
         * @return {?}
         */
        (svg, mono = false, theme = 'classic', vertical = true) => {
            /** @type {?} */
            const colors = mono ? [this.colors[theme].mono[2]] : this.colors[theme].full;
            for (let i = 0; i < colors.length; i++) {
                /** @type {?} */
                const color = mono ? this.colors[theme].mono[2] : this.colors[theme].full[i];
                /** @type {?} */
                let gradient;
                if (vertical) {
                    gradient = svg
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
                else {
                    gradient = svg
                        .append('defs')
                        .append('linearGradient')
                        .attr('id', `gradient-horizontal-${color.replace('#', '')}`)
                        .attr('x1', '1')
                        .attr('y1', '0')
                        .attr('x2', '0')
                        .attr('y2', '0')
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
            const merge = glow.append('feMerge');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXouc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLM0MsTUFBTSxPQUFPLGtCQUFrQjtJQXdFN0I7UUF2RVEsV0FBTSxHQUFHO1lBQ2YsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRTtvQkFDSixTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztpQkFDVjtnQkFDRCxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU87YUFDakY7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNKLFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO2lCQUNWO2dCQUNELElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsYUFBYTthQUN2RjtZQUNELEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUU7b0JBQ0osU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7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O3FCQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0Qzs7a0JBRUssS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBRXBDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztZQUV4RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUMzRDtRQUNILENBQUMsRUFBQztJQWxIYSxDQUFDOzs7WUEzRWpCLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7Ozs7Ozs7OztJQUVDLG9DQXFFRTs7SUFJRix1Q0FFRTs7SUFFRixnREF1REU7O0lBRUYsOENBbURFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelNlcnZpY2Uge1xuICBwcml2YXRlIGNvbG9ycyA9IHtcbiAgICBjbGFzc2ljOiB7XG4gICAgICBmdWxsOiBbXG4gICAgICAgICcjRTIzREE4JyxcbiAgICAgICAgJyMxQkI5RkYnLFxuICAgICAgICAnI0ZGOEIwMCcsXG4gICAgICAgICcjQTMxOUIxJyxcbiAgICAgICAgJyMwMEIxNDAnLFxuICAgICAgICAnIzAzODRENCcsXG4gICAgICAgICcjMzE0MTgzJyxcbiAgICAgICAgJyNFREI3MDAnLFxuICAgICAgICAnIzhiOThjOCcsXG4gICAgICAgICcjY2NiOGNlJyxcbiAgICAgICAgJyNlNmM0OWMnLFxuICAgICAgICAnIzliOWI5YidcbiAgICAgIF0sXG4gICAgICBtb25vOiBbJyMwMDFENTYnLCAnIzAwMzI5NicsICcjNEI3NEM1JywgJyM4OUExRDAnLCAnI0EzQkNFRScsICcjQzlEN0YzJ10gLy8gYmx1ZVxuICAgIH0sXG4gICAgdHdpbGlnaHQ6IHtcbiAgICAgIGZ1bGw6IFtcbiAgICAgICAgJyNBMzE5QjEnLFxuICAgICAgICAnIzAwQjE0MCcsXG4gICAgICAgICcjRkY4QjAwJyxcbiAgICAgICAgJyMxQkI5RkYnLFxuICAgICAgICAnI0UyM0RBOCcsXG4gICAgICAgICcjMDM4NEQ0JyxcbiAgICAgICAgJyMzMTQxODMnLFxuICAgICAgICAnI0VEQjcwMCcsXG4gICAgICAgICcjOGI5OGM4JyxcbiAgICAgICAgJyNjY2I4Y2UnLFxuICAgICAgICAnI2U2YzQ5YycsXG4gICAgICAgICcjOWI5YjliJ1xuICAgICAgXSxcbiAgICAgIG1vbm86IFsnIzA1Mzk1QycsICcjMEE1QjkyJywgJyMwMDcyQjgnLCAnIzVEQTlEQycsICcjQTVENEYzJywgJyNEMUVERkYnXSAvLyBsaWdodCBibHVlXG4gICAgfSxcbiAgICBvY2Vhbjoge1xuICAgICAgZnVsbDogW1xuICAgICAgICAnIzAzODRENCcsXG4gICAgICAgICcjRTIzREE4JyxcbiAgICAgICAgJyMxQkI5RkYnLFxuICAgICAgICAnIzMxNDE4MycsXG4gICAgICAgICcjRkZDNTAwJyxcbiAgICAgICAgJyNBMzE5QjEnLFxuICAgICAgICAnI0ZGOEIwMCcsXG4gICAgICAgICcjMTQ3NjdEJyxcbiAgICAgICAgJyM4Yjk4YzgnLFxuICAgICAgICAnI2U2YzQ5YycsXG4gICAgICAgICcjY2NiOGNlJyxcbiAgICAgICAgJyM5YjliOWInXG4gICAgICBdLFxuICAgICAgbW9ubzogWycjMzk0QjREJywgJyMzQTZCNkUnLCAnIzE0NzY3RCcsICcjOTlCRkMyJywgJyNDOUU2RTgnLCAnI0RFRUNFRCddIC8vIGJsdWUtZ3JlZW5cbiAgICB9LFxuICAgIHN1bnNldDoge1xuICAgICAgZnVsbDogW1xuICAgICAgICAnI0NFMjA2MCcsXG4gICAgICAgICcjRkY4QjAwJyxcbiAgICAgICAgJyMxQkI5RkYnLFxuICAgICAgICAnI0ZGQzUwMCcsXG4gICAgICAgICcjMDBCMTQwJyxcbiAgICAgICAgJyM1MDI0OEYnLFxuICAgICAgICAnIzAzODRkNCcsXG4gICAgICAgICcjQ0NCOENFJyxcbiAgICAgICAgJyMzMTQxODMnLFxuICAgICAgICAnI0U2QzQ5QycsXG4gICAgICAgICcjOGI5OGM4JyxcbiAgICAgICAgJyM5YjliOWInXG4gICAgICBdLFxuICAgICAgbW9ubzogWycjMzEyNTRBJywgJyM1MDI0OEYnLCAnIzc5NDVDNCcsICcjOUE3OUUyJywgJyNDNEE4RkYnLCAnI0Q5QzdGRiddIC8vIHB1cnBsZVxuICAgIH1cbiAgfTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgZ2V0Q29sb3JzID0gKG1vbm8gPSBmYWxzZSwgdGhlbWUgPSAnY2xhc3NpYycpID0+IHtcbiAgICByZXR1cm4gbW9ubyA/IHRoaXMuY29sb3JzW3RoZW1lXS5tb25vIDogdGhpcy5jb2xvcnNbdGhlbWVdLmZ1bGw7XG4gIH07XG5cbiAgY3JlYXRlR3JhZGllbnREZWZzID0gKHN2ZywgbW9ubyA9IGZhbHNlLCB0aGVtZSA9ICdjbGFzc2ljJywgdmVydGljYWwgPSB0cnVlKSA9PiB7XG4gICAgY29uc3QgY29sb3JzID0gbW9ubyA/IFt0aGlzLmNvbG9yc1t0aGVtZV0ubW9ub1syXV0gOiB0aGlzLmNvbG9yc1t0aGVtZV0uZnVsbDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb2xvciA9IG1vbm8gPyB0aGlzLmNvbG9yc1t0aGVtZV0ubW9ub1syXSA6IHRoaXMuY29sb3JzW3RoZW1lXS5mdWxsW2ldO1xuICAgICAgbGV0IGdyYWRpZW50O1xuXG4gICAgICBpZiAodmVydGljYWwpIHtcbiAgICAgICAgZ3JhZGllbnQgPSBzdmdcbiAgICAgICAgICAuYXBwZW5kKCdkZWZzJylcbiAgICAgICAgICAuYXBwZW5kKCdsaW5lYXJHcmFkaWVudCcpXG4gICAgICAgICAgLmF0dHIoJ2lkJywgYGdyYWRpZW50LSR7Y29sb3IucmVwbGFjZSgnIycsICcnKX1gKVxuICAgICAgICAgIC5hdHRyKCd4MScsICcwJylcbiAgICAgICAgICAuYXR0cigneTEnLCAnMCcpXG4gICAgICAgICAgLmF0dHIoJ3gyJywgJzAnKVxuICAgICAgICAgIC5hdHRyKCd5MicsICcxJylcbiAgICAgICAgICAuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpO1xuXG4gICAgICAgIGdyYWRpZW50XG4gICAgICAgICAgLmFwcGVuZCgnc3RvcCcpXG4gICAgICAgICAgLmF0dHIoJ29mZnNldCcsICcwJScpXG4gICAgICAgICAgLmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvcilcbiAgICAgICAgICAuYXR0cignc3RvcC1vcGFjaXR5JywgJzEnKTsgLy8gdG9wIG9mIGJhciB3aWxsIGJlIGZ1bGwgb3BhY2l0eVxuXG4gICAgICAgIGdyYWRpZW50XG4gICAgICAgICAgLmFwcGVuZCgnc3RvcCcpXG4gICAgICAgICAgLmF0dHIoJ29mZnNldCcsICcxMDAlJylcbiAgICAgICAgICAuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLW9wYWNpdHknLCAnLjMnKTsgLy8gYm90dG9tIG9mIGJhciB3aWxsIGJlIC4zIG9wYWNpdHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdyYWRpZW50ID0gc3ZnXG4gICAgICAgICAgLmFwcGVuZCgnZGVmcycpXG4gICAgICAgICAgLmFwcGVuZCgnbGluZWFyR3JhZGllbnQnKVxuICAgICAgICAgIC5hdHRyKCdpZCcsIGBncmFkaWVudC1ob3Jpem9udGFsLSR7Y29sb3IucmVwbGFjZSgnIycsICcnKX1gKVxuICAgICAgICAgIC5hdHRyKCd4MScsICcxJylcbiAgICAgICAgICAuYXR0cigneTEnLCAnMCcpXG4gICAgICAgICAgLmF0dHIoJ3gyJywgJzAnKVxuICAgICAgICAgIC5hdHRyKCd5MicsICcwJylcbiAgICAgICAgICAuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpO1xuXG4gICAgICAgIGdyYWRpZW50XG4gICAgICAgICAgLmFwcGVuZCgnc3RvcCcpXG4gICAgICAgICAgLmF0dHIoJ29mZnNldCcsICcwJScpXG4gICAgICAgICAgLmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvcilcbiAgICAgICAgICAuYXR0cignc3RvcC1vcGFjaXR5JywgJzEnKTsgLy8gdG9wIG9mIGJhciB3aWxsIGJlIGZ1bGwgb3BhY2l0eVxuXG4gICAgICAgIGdyYWRpZW50XG4gICAgICAgICAgLmFwcGVuZCgnc3RvcCcpXG4gICAgICAgICAgLmF0dHIoJ29mZnNldCcsICcxMDAlJylcbiAgICAgICAgICAuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLW9wYWNpdHknLCAnLjMnKTsgLy8gYm90dG9tIG9mIGJhciB3aWxsIGJlIC4zIG9wYWNpdHlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29sb3JzO1xuICB9O1xuXG4gIGNyZWF0ZUdsb3dGaWx0ZXIgPSBzdmcgPT4ge1xuICAgIC8vIGFkZCBhIG5ldyBkZWZpbml0aW9uXG4gICAgY29uc3QgZ2xvdyA9IHN2Z1xuICAgICAgLmFwcGVuZCgnZGVmcycpXG4gICAgICAuYXBwZW5kKCdmaWx0ZXInKVxuICAgICAgLmF0dHIoJ2lkJywgJ2dsb3cnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgJzIwMCUnKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICcyMDAlJyk7XG5cbiAgICBnbG93XG4gICAgICAuYXBwZW5kKCdmZUdhdXNzaWFuQmx1cicpXG4gICAgICAuYXR0cignaW4nLCAnU291cmNlR3JhcGhpYycpXG4gICAgICAuYXR0cignc3RkRGV2aWF0aW9uJywgNCk7XG5cbiAgICAvLyBidWlsZCB0d28gZHJvcHNoYWRvd3Mgd2l0aCBkaWZmZXJlbnQgaW50ZW5zaXRpZXNcbiAgICBjb25zdCBmZU9mZnNldHMgPSBbXG4gICAgICB7XG4gICAgICAgIGR5OiAyLFxuICAgICAgICBzbG9wZTogMC4yXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBkeTogNSxcbiAgICAgICAgc2xvcGU6IDAuMDVcbiAgICAgIH1cbiAgICBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZU9mZnNldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGdsb3dcbiAgICAgICAgLmFwcGVuZCgnZmVPZmZzZXQnKVxuICAgICAgICAuYXR0cigncmVzdWx0JywgJ29mZnNldEJsdXInICsgaSlcbiAgICAgICAgLmF0dHIoJ2R4JywgMClcbiAgICAgICAgLmF0dHIoJ2R5JywgZmVPZmZzZXRzW2ldLmR5KTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGZlT2Zmc2V0cy5sZW5ndGg7IHkrKykge1xuICAgICAgZ2xvd1xuICAgICAgICAuYXBwZW5kKCdmZUNvbXBvbmVudFRyYW5zZmVyJylcbiAgICAgICAgLmF0dHIoJ3Jlc3VsdCcsICdjb2xvcmVkQmx1cicgKyB5KVxuICAgICAgICAuYXR0cignaW4nLCAnb2Zmc2V0Qmx1cicgKyB5KVxuICAgICAgICAuYXBwZW5kKCdmZUZ1bmNBJylcbiAgICAgICAgLmF0dHIoJ3R5cGUnLCAnbGluZWFyJylcbiAgICAgICAgLmF0dHIoJ3Nsb3BlJywgZmVPZmZzZXRzW3ldLnNsb3BlKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXJnZSA9IGdsb3cuYXBwZW5kKCdmZU1lcmdlJyk7XG5cbiAgICBtZXJnZS5hcHBlbmQoJ2ZlTWVyZ2VOb2RlJykuYXR0cignaW4nLCAnU291cmNlR3JhcGhpYycpO1xuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBmZU9mZnNldHMubGVuZ3RoOyB4KyspIHtcbiAgICAgIG1lcmdlLmFwcGVuZCgnZmVNZXJnZU5vZGUnKS5hdHRyKCdpbicsICdjb2xvcmVkQmx1cicgKyB4KTtcbiAgICB9XG4gIH07XG59XG4iXX0=
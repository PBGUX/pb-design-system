/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
var PbdsDatavizService = /** @class */ (function () {
    function PbdsDatavizService() {
        var _this = this;
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
        function (mono, theme) {
            if (mono === void 0) { mono = false; }
            if (theme === void 0) { theme = 'classic'; }
            return mono ? _this.colors[theme].mono : _this.colors[theme].full;
        });
        this.createGradientDefs = (/**
         * @param {?} svg
         * @param {?=} mono
         * @param {?=} theme
         * @param {?=} vertical
         * @return {?}
         */
        function (svg, mono, theme, vertical) {
            if (mono === void 0) { mono = false; }
            if (theme === void 0) { theme = 'classic'; }
            if (vertical === void 0) { vertical = true; }
            /** @type {?} */
            var colors = mono ? [_this.colors[theme].mono[2]] : _this.colors[theme].full;
            for (var i = 0; i < colors.length; i++) {
                /** @type {?} */
                var color = mono ? _this.colors[theme].mono[2] : _this.colors[theme].full[i];
                /** @type {?} */
                var gradient = void 0;
                if (vertical) {
                    gradient = svg
                        .append('defs')
                        .append('linearGradient')
                        .attr('id', "gradient-" + color.replace('#', ''))
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
                        .attr('id', "gradient-horizontal-" + color.replace('#', ''))
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
        function (svg) {
            // add a new definition
            /** @type {?} */
            var glow = svg
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
            var feOffsets = [
                {
                    dy: 2,
                    slope: 0.2
                },
                {
                    dy: 5,
                    slope: 0.05
                }
            ];
            for (var i = 0; i < feOffsets.length; i++) {
                glow
                    .append('feOffset')
                    .attr('result', 'offsetBlur' + i)
                    .attr('dx', 0)
                    .attr('dy', feOffsets[i].dy);
            }
            for (var y = 0; y < feOffsets.length; y++) {
                glow
                    .append('feComponentTransfer')
                    .attr('result', 'coloredBlur' + y)
                    .attr('in', 'offsetBlur' + y)
                    .append('feFuncA')
                    .attr('type', 'linear')
                    .attr('slope', feOffsets[y].slope);
            }
            /** @type {?} */
            var merge = glow.append('feMerge');
            merge.append('feMergeNode').attr('in', 'SourceGraphic');
            for (var x = 0; x < feOffsets.length; x++) {
                merge.append('feMergeNode').attr('in', 'coloredBlur' + x);
            }
        });
    }
    PbdsDatavizService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    PbdsDatavizService.ctorParameters = function () { return []; };
    /** @nocollapse */ PbdsDatavizService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function PbdsDatavizService_Factory() { return new PbdsDatavizService(); }, token: PbdsDatavizService, providedIn: "root" });
    return PbdsDatavizService;
}());
export { PbdsDatavizService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXouc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFM0M7SUEyRUU7UUFBQSxpQkFBZ0I7UUF2RVIsV0FBTSxHQUFHO1lBQ2YsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRTtvQkFDSixTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztpQkFDVjtnQkFDRCxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU87YUFDakY7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNKLFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO2lCQUNWO2dCQUNELElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsYUFBYTthQUN2RjtZQUNELEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUU7b0JBQ0osU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1Qs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SSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7cUJBQ3RCLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3RDOztnQkFFSyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFFcEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBRXhELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN6QyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzNEO1FBQ0gsQ0FBQyxFQUFDO0lBbEhhLENBQUM7O2dCQTNFakIsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7Ozs7NkJBSkQ7Q0FnTUMsQUE5TEQsSUE4TEM7U0EzTFksa0JBQWtCOzs7Ozs7SUFDN0Isb0NBcUVFOztJQUlGLHVDQUVFOztJQUVGLGdEQXVERTs7SUFFRiw4Q0FtREUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6U2VydmljZSB7XG4gIHByaXZhdGUgY29sb3JzID0ge1xuICAgIGNsYXNzaWM6IHtcbiAgICAgIGZ1bGw6IFtcbiAgICAgICAgJyNFMjNEQTgnLFxuICAgICAgICAnIzFCQjlGRicsXG4gICAgICAgICcjRkY4QjAwJyxcbiAgICAgICAgJyNBMzE5QjEnLFxuICAgICAgICAnIzAwQjE0MCcsXG4gICAgICAgICcjMDM4NEQ0JyxcbiAgICAgICAgJyMzMTQxODMnLFxuICAgICAgICAnI0VEQjcwMCcsXG4gICAgICAgICcjOGI5OGM4JyxcbiAgICAgICAgJyNjY2I4Y2UnLFxuICAgICAgICAnI2U2YzQ5YycsXG4gICAgICAgICcjOWI5YjliJ1xuICAgICAgXSxcbiAgICAgIG1vbm86IFsnIzAwMUQ1NicsICcjMDAzMjk2JywgJyM0Qjc0QzUnLCAnIzg5QTFEMCcsICcjQTNCQ0VFJywgJyNDOUQ3RjMnXSAvLyBibHVlXG4gICAgfSxcbiAgICB0d2lsaWdodDoge1xuICAgICAgZnVsbDogW1xuICAgICAgICAnI0EzMTlCMScsXG4gICAgICAgICcjMDBCMTQwJyxcbiAgICAgICAgJyNGRjhCMDAnLFxuICAgICAgICAnIzFCQjlGRicsXG4gICAgICAgICcjRTIzREE4JyxcbiAgICAgICAgJyMwMzg0RDQnLFxuICAgICAgICAnIzMxNDE4MycsXG4gICAgICAgICcjRURCNzAwJyxcbiAgICAgICAgJyM4Yjk4YzgnLFxuICAgICAgICAnI2NjYjhjZScsXG4gICAgICAgICcjZTZjNDljJyxcbiAgICAgICAgJyM5YjliOWInXG4gICAgICBdLFxuICAgICAgbW9ubzogWycjMDUzOTVDJywgJyMwQTVCOTInLCAnIzAwNzJCOCcsICcjNURBOURDJywgJyNBNUQ0RjMnLCAnI0QxRURGRiddIC8vIGxpZ2h0IGJsdWVcbiAgICB9LFxuICAgIG9jZWFuOiB7XG4gICAgICBmdWxsOiBbXG4gICAgICAgICcjMDM4NEQ0JyxcbiAgICAgICAgJyNFMjNEQTgnLFxuICAgICAgICAnIzFCQjlGRicsXG4gICAgICAgICcjMzE0MTgzJyxcbiAgICAgICAgJyNGRkM1MDAnLFxuICAgICAgICAnI0EzMTlCMScsXG4gICAgICAgICcjRkY4QjAwJyxcbiAgICAgICAgJyMxNDc2N0QnLFxuICAgICAgICAnIzhiOThjOCcsXG4gICAgICAgICcjZTZjNDljJyxcbiAgICAgICAgJyNjY2I4Y2UnLFxuICAgICAgICAnIzliOWI5YidcbiAgICAgIF0sXG4gICAgICBtb25vOiBbJyMzOTRCNEQnLCAnIzNBNkI2RScsICcjMTQ3NjdEJywgJyM5OUJGQzInLCAnI0M5RTZFOCcsICcjREVFQ0VEJ10gLy8gYmx1ZS1ncmVlblxuICAgIH0sXG4gICAgc3Vuc2V0OiB7XG4gICAgICBmdWxsOiBbXG4gICAgICAgICcjQ0UyMDYwJyxcbiAgICAgICAgJyNGRjhCMDAnLFxuICAgICAgICAnIzFCQjlGRicsXG4gICAgICAgICcjRkZDNTAwJyxcbiAgICAgICAgJyMwMEIxNDAnLFxuICAgICAgICAnIzUwMjQ4RicsXG4gICAgICAgICcjMDM4NGQ0JyxcbiAgICAgICAgJyNDQ0I4Q0UnLFxuICAgICAgICAnIzMxNDE4MycsXG4gICAgICAgICcjRTZDNDlDJyxcbiAgICAgICAgJyM4Yjk4YzgnLFxuICAgICAgICAnIzliOWI5YidcbiAgICAgIF0sXG4gICAgICBtb25vOiBbJyMzMTI1NEEnLCAnIzUwMjQ4RicsICcjNzk0NUM0JywgJyM5QTc5RTInLCAnI0M0QThGRicsICcjRDlDN0ZGJ10gLy8gcHVycGxlXG4gICAgfVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBnZXRDb2xvcnMgPSAobW9ubyA9IGZhbHNlLCB0aGVtZSA9ICdjbGFzc2ljJykgPT4ge1xuICAgIHJldHVybiBtb25vID8gdGhpcy5jb2xvcnNbdGhlbWVdLm1vbm8gOiB0aGlzLmNvbG9yc1t0aGVtZV0uZnVsbDtcbiAgfTtcblxuICBjcmVhdGVHcmFkaWVudERlZnMgPSAoc3ZnLCBtb25vID0gZmFsc2UsIHRoZW1lID0gJ2NsYXNzaWMnLCB2ZXJ0aWNhbCA9IHRydWUpID0+IHtcbiAgICBjb25zdCBjb2xvcnMgPSBtb25vID8gW3RoaXMuY29sb3JzW3RoZW1lXS5tb25vWzJdXSA6IHRoaXMuY29sb3JzW3RoZW1lXS5mdWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2xvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gbW9ubyA/IHRoaXMuY29sb3JzW3RoZW1lXS5tb25vWzJdIDogdGhpcy5jb2xvcnNbdGhlbWVdLmZ1bGxbaV07XG4gICAgICBsZXQgZ3JhZGllbnQ7XG5cbiAgICAgIGlmICh2ZXJ0aWNhbCkge1xuICAgICAgICBncmFkaWVudCA9IHN2Z1xuICAgICAgICAgIC5hcHBlbmQoJ2RlZnMnKVxuICAgICAgICAgIC5hcHBlbmQoJ2xpbmVhckdyYWRpZW50JylcbiAgICAgICAgICAuYXR0cignaWQnLCBgZ3JhZGllbnQtJHtjb2xvci5yZXBsYWNlKCcjJywgJycpfWApXG4gICAgICAgICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgICAgICAgIC5hdHRyKCd5MScsICcwJylcbiAgICAgICAgICAuYXR0cigneDInLCAnMCcpXG4gICAgICAgICAgLmF0dHIoJ3kyJywgJzEnKVxuICAgICAgICAgIC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJyk7XG5cbiAgICAgICAgZ3JhZGllbnRcbiAgICAgICAgICAuYXBwZW5kKCdzdG9wJylcbiAgICAgICAgICAuYXR0cignb2Zmc2V0JywgJzAlJylcbiAgICAgICAgICAuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLW9wYWNpdHknLCAnMScpOyAvLyB0b3Agb2YgYmFyIHdpbGwgYmUgZnVsbCBvcGFjaXR5XG5cbiAgICAgICAgZ3JhZGllbnRcbiAgICAgICAgICAuYXBwZW5kKCdzdG9wJylcbiAgICAgICAgICAuYXR0cignb2Zmc2V0JywgJzEwMCUnKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IpXG4gICAgICAgICAgLmF0dHIoJ3N0b3Atb3BhY2l0eScsICcuMycpOyAvLyBib3R0b20gb2YgYmFyIHdpbGwgYmUgLjMgb3BhY2l0eVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ3JhZGllbnQgPSBzdmdcbiAgICAgICAgICAuYXBwZW5kKCdkZWZzJylcbiAgICAgICAgICAuYXBwZW5kKCdsaW5lYXJHcmFkaWVudCcpXG4gICAgICAgICAgLmF0dHIoJ2lkJywgYGdyYWRpZW50LWhvcml6b250YWwtJHtjb2xvci5yZXBsYWNlKCcjJywgJycpfWApXG4gICAgICAgICAgLmF0dHIoJ3gxJywgJzEnKVxuICAgICAgICAgIC5hdHRyKCd5MScsICcwJylcbiAgICAgICAgICAuYXR0cigneDInLCAnMCcpXG4gICAgICAgICAgLmF0dHIoJ3kyJywgJzAnKVxuICAgICAgICAgIC5hdHRyKCdzcHJlYWRNZXRob2QnLCAncGFkJyk7XG5cbiAgICAgICAgZ3JhZGllbnRcbiAgICAgICAgICAuYXBwZW5kKCdzdG9wJylcbiAgICAgICAgICAuYXR0cignb2Zmc2V0JywgJzAlJylcbiAgICAgICAgICAuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLW9wYWNpdHknLCAnMScpOyAvLyB0b3Agb2YgYmFyIHdpbGwgYmUgZnVsbCBvcGFjaXR5XG5cbiAgICAgICAgZ3JhZGllbnRcbiAgICAgICAgICAuYXBwZW5kKCdzdG9wJylcbiAgICAgICAgICAuYXR0cignb2Zmc2V0JywgJzEwMCUnKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IpXG4gICAgICAgICAgLmF0dHIoJ3N0b3Atb3BhY2l0eScsICcuMycpOyAvLyBib3R0b20gb2YgYmFyIHdpbGwgYmUgLjMgb3BhY2l0eVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb2xvcnM7XG4gIH07XG5cbiAgY3JlYXRlR2xvd0ZpbHRlciA9IHN2ZyA9PiB7XG4gICAgLy8gYWRkIGEgbmV3IGRlZmluaXRpb25cbiAgICBjb25zdCBnbG93ID0gc3ZnXG4gICAgICAuYXBwZW5kKCdkZWZzJylcbiAgICAgIC5hcHBlbmQoJ2ZpbHRlcicpXG4gICAgICAuYXR0cignaWQnLCAnZ2xvdycpXG4gICAgICAuYXR0cignd2lkdGgnLCAnMjAwJScpXG4gICAgICAuYXR0cignaGVpZ2h0JywgJzIwMCUnKTtcblxuICAgIGdsb3dcbiAgICAgIC5hcHBlbmQoJ2ZlR2F1c3NpYW5CbHVyJylcbiAgICAgIC5hdHRyKCdpbicsICdTb3VyY2VHcmFwaGljJylcbiAgICAgIC5hdHRyKCdzdGREZXZpYXRpb24nLCA0KTtcblxuICAgIC8vIGJ1aWxkIHR3byBkcm9wc2hhZG93cyB3aXRoIGRpZmZlcmVudCBpbnRlbnNpdGllc1xuICAgIGNvbnN0IGZlT2Zmc2V0cyA9IFtcbiAgICAgIHtcbiAgICAgICAgZHk6IDIsXG4gICAgICAgIHNsb3BlOiAwLjJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGR5OiA1LFxuICAgICAgICBzbG9wZTogMC4wNVxuICAgICAgfVxuICAgIF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZlT2Zmc2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgZ2xvd1xuICAgICAgICAuYXBwZW5kKCdmZU9mZnNldCcpXG4gICAgICAgIC5hdHRyKCdyZXN1bHQnLCAnb2Zmc2V0Qmx1cicgKyBpKVxuICAgICAgICAuYXR0cignZHgnLCAwKVxuICAgICAgICAuYXR0cignZHknLCBmZU9mZnNldHNbaV0uZHkpO1xuICAgIH1cblxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgZmVPZmZzZXRzLmxlbmd0aDsgeSsrKSB7XG4gICAgICBnbG93XG4gICAgICAgIC5hcHBlbmQoJ2ZlQ29tcG9uZW50VHJhbnNmZXInKVxuICAgICAgICAuYXR0cigncmVzdWx0JywgJ2NvbG9yZWRCbHVyJyArIHkpXG4gICAgICAgIC5hdHRyKCdpbicsICdvZmZzZXRCbHVyJyArIHkpXG4gICAgICAgIC5hcHBlbmQoJ2ZlRnVuY0EnKVxuICAgICAgICAuYXR0cigndHlwZScsICdsaW5lYXInKVxuICAgICAgICAuYXR0cignc2xvcGUnLCBmZU9mZnNldHNbeV0uc2xvcGUpO1xuICAgIH1cblxuICAgIGNvbnN0IG1lcmdlID0gZ2xvdy5hcHBlbmQoJ2ZlTWVyZ2UnKTtcblxuICAgIG1lcmdlLmFwcGVuZCgnZmVNZXJnZU5vZGUnKS5hdHRyKCdpbicsICdTb3VyY2VHcmFwaGljJyk7XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGZlT2Zmc2V0cy5sZW5ndGg7IHgrKykge1xuICAgICAgbWVyZ2UuYXBwZW5kKCdmZU1lcmdlTm9kZScpLmF0dHIoJ2luJywgJ2NvbG9yZWRCbHVyJyArIHgpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
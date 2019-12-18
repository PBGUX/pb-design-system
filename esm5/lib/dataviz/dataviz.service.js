/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { format as d3_format, timeFormat as d3_timeFormat } from 'd3';
import * as i0 from "@angular/core";
var PbdsDatavizService = /** @class */ (function () {
    function PbdsDatavizService() {
        var _this = this;
        this.colors = {
            classic: {
                full: [
                    '#B70077',
                    '#0384D4',
                    '#EE6B0B',
                    '#A319B1',
                    '#11A611',
                    '#1BB9FF',
                    '#495A9C',
                    '#EDB700',
                    '#8B98C8',
                    '#E6C49C',
                    '#CCB8CE',
                    '#9B9B9B'
                ],
                mono: ['#001D56', '#003296', '#4B74C5', '#89A1D0', '#A3BCEE', '#C9D7F3'] // blue
            },
            twilight: {
                full: [
                    '#A319B1',
                    '#11A611',
                    '#1BB9FF',
                    '#EE6B0B',
                    '#B70077',
                    '#0384D4',
                    '#495A9C',
                    '#EDB700',
                    '#8B98C8',
                    '#E6C49C',
                    '#CCB8CE',
                    '#9B9B9B'
                ],
                mono: ['#05395C', '#0A5B92', '#0072B8', '#5DA9DC', '#A5D4F3', '#D1EDFF'] // light blue
            },
            ocean: {
                full: [
                    '#0384D4',
                    '#B70077',
                    '#1BB9FF',
                    '#495A9C',
                    '#EDB700',
                    '#A319B1',
                    '#EE6B0B',
                    '#11A611',
                    '#8B98C8',
                    '#E6C49C',
                    '#CCB8CE',
                    '#9B9B9B'
                ],
                mono: ['#394B4D', '#3A6B6E', '#14767D', '#99BFC2', '#C9E6E8', '#DEECED'] // blue-green
            },
            sunset: {
                full: [
                    '#B70077',
                    '#EE6B0B',
                    '#1BB9FF',
                    '#EDB700',
                    '#11A611',
                    '#A319B1',
                    '#0384D4',
                    '#CCB8CE',
                    '#495A9C',
                    '#E6C49C',
                    '#8B98C8',
                    '#9B9B9B'
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
    /**
     * @param {?} type
     * @param {?} string
     * @return {?}
     */
    PbdsDatavizService.prototype.d3Format = /**
     * @param {?} type
     * @param {?} string
     * @return {?}
     */
    function (type, string) {
        /** @type {?} */
        var format;
        switch (type) {
            case 'number':
                format = d3_format(string);
                break;
            case 'time':
                format = d3_timeFormat(string);
                break;
            default:
                format = null;
                break;
        }
        return format;
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhdml6L2RhdGF2aXouc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxVQUFVLElBQUksYUFBYSxFQUFFLE1BQU0sSUFBSSxDQUFDOztBQUV0RTtJQTJFRTtRQUFBLGlCQUFnQjtRQXZFUixXQUFNLEdBQUc7WUFDZixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFO29CQUNKLFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO2lCQUNWO2dCQUNELElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsT0FBTzthQUNqRjtZQUNELFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUU7b0JBQ0osU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7aUJBQ1Y7Z0JBQ0QsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxhQUFhO2FBQ3ZGO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRTtvQkFDSixTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztv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QUVFOztJQUVGLGdEQXVERTs7SUFFRiw4Q0FtREUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGZvcm1hdCBhcyBkM19mb3JtYXQsIHRpbWVGb3JtYXQgYXMgZDNfdGltZUZvcm1hdCB9IGZyb20gJ2QzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjb2xvcnMgPSB7XG4gICAgY2xhc3NpYzoge1xuICAgICAgZnVsbDogW1xuICAgICAgICAnI0I3MDA3NycsXG4gICAgICAgICcjMDM4NEQ0JyxcbiAgICAgICAgJyNFRTZCMEInLFxuICAgICAgICAnI0EzMTlCMScsXG4gICAgICAgICcjMTFBNjExJyxcbiAgICAgICAgJyMxQkI5RkYnLFxuICAgICAgICAnIzQ5NUE5QycsXG4gICAgICAgICcjRURCNzAwJyxcbiAgICAgICAgJyM4Qjk4QzgnLFxuICAgICAgICAnI0U2QzQ5QycsXG4gICAgICAgICcjQ0NCOENFJyxcbiAgICAgICAgJyM5QjlCOUInXG4gICAgICBdLFxuICAgICAgbW9ubzogWycjMDAxRDU2JywgJyMwMDMyOTYnLCAnIzRCNzRDNScsICcjODlBMUQwJywgJyNBM0JDRUUnLCAnI0M5RDdGMyddIC8vIGJsdWVcbiAgICB9LFxuICAgIHR3aWxpZ2h0OiB7XG4gICAgICBmdWxsOiBbXG4gICAgICAgICcjQTMxOUIxJyxcbiAgICAgICAgJyMxMUE2MTEnLFxuICAgICAgICAnIzFCQjlGRicsXG4gICAgICAgICcjRUU2QjBCJyxcbiAgICAgICAgJyNCNzAwNzcnLFxuICAgICAgICAnIzAzODRENCcsXG4gICAgICAgICcjNDk1QTlDJyxcbiAgICAgICAgJyNFREI3MDAnLFxuICAgICAgICAnIzhCOThDOCcsXG4gICAgICAgICcjRTZDNDlDJyxcbiAgICAgICAgJyNDQ0I4Q0UnLFxuICAgICAgICAnIzlCOUI5QidcbiAgICAgIF0sXG4gICAgICBtb25vOiBbJyMwNTM5NUMnLCAnIzBBNUI5MicsICcjMDA3MkI4JywgJyM1REE5REMnLCAnI0E1RDRGMycsICcjRDFFREZGJ10gLy8gbGlnaHQgYmx1ZVxuICAgIH0sXG4gICAgb2NlYW46IHtcbiAgICAgIGZ1bGw6IFtcbiAgICAgICAgJyMwMzg0RDQnLFxuICAgICAgICAnI0I3MDA3NycsXG4gICAgICAgICcjMUJCOUZGJyxcbiAgICAgICAgJyM0OTVBOUMnLFxuICAgICAgICAnI0VEQjcwMCcsXG4gICAgICAgICcjQTMxOUIxJyxcbiAgICAgICAgJyNFRTZCMEInLFxuICAgICAgICAnIzExQTYxMScsXG4gICAgICAgICcjOEI5OEM4JyxcbiAgICAgICAgJyNFNkM0OUMnLFxuICAgICAgICAnI0NDQjhDRScsXG4gICAgICAgICcjOUI5QjlCJ1xuICAgICAgXSxcbiAgICAgIG1vbm86IFsnIzM5NEI0RCcsICcjM0E2QjZFJywgJyMxNDc2N0QnLCAnIzk5QkZDMicsICcjQzlFNkU4JywgJyNERUVDRUQnXSAvLyBibHVlLWdyZWVuXG4gICAgfSxcbiAgICBzdW5zZXQ6IHtcbiAgICAgIGZ1bGw6IFtcbiAgICAgICAgJyNCNzAwNzcnLFxuICAgICAgICAnI0VFNkIwQicsXG4gICAgICAgICcjMUJCOUZGJyxcbiAgICAgICAgJyNFREI3MDAnLFxuICAgICAgICAnIzExQTYxMScsXG4gICAgICAgICcjQTMxOUIxJyxcbiAgICAgICAgJyMwMzg0RDQnLFxuICAgICAgICAnI0NDQjhDRScsXG4gICAgICAgICcjNDk1QTlDJyxcbiAgICAgICAgJyNFNkM0OUMnLFxuICAgICAgICAnIzhCOThDOCcsXG4gICAgICAgICcjOUI5QjlCJ1xuICAgICAgXSxcbiAgICAgIG1vbm86IFsnIzMxMjU0QScsICcjNTAyNDhGJywgJyM3OTQ1QzQnLCAnIzlBNzlFMicsICcjQzRBOEZGJywgJyNEOUM3RkYnXSAvLyBwdXJwbGVcbiAgICB9XG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGdldENvbG9ycyA9IChtb25vID0gZmFsc2UsIHRoZW1lID0gJ2NsYXNzaWMnKSA9PiB7XG4gICAgcmV0dXJuIG1vbm8gPyB0aGlzLmNvbG9yc1t0aGVtZV0ubW9ubyA6IHRoaXMuY29sb3JzW3RoZW1lXS5mdWxsO1xuICB9O1xuXG4gIGNyZWF0ZUdyYWRpZW50RGVmcyA9IChzdmcsIG1vbm8gPSBmYWxzZSwgdGhlbWUgPSAnY2xhc3NpYycsIHZlcnRpY2FsID0gdHJ1ZSkgPT4ge1xuICAgIGNvbnN0IGNvbG9ycyA9IG1vbm8gPyBbdGhpcy5jb2xvcnNbdGhlbWVdLm1vbm9bMl1dIDogdGhpcy5jb2xvcnNbdGhlbWVdLmZ1bGw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY29sb3IgPSBtb25vID8gdGhpcy5jb2xvcnNbdGhlbWVdLm1vbm9bMl0gOiB0aGlzLmNvbG9yc1t0aGVtZV0uZnVsbFtpXTtcbiAgICAgIGxldCBncmFkaWVudDtcblxuICAgICAgaWYgKHZlcnRpY2FsKSB7XG4gICAgICAgIGdyYWRpZW50ID0gc3ZnXG4gICAgICAgICAgLmFwcGVuZCgnZGVmcycpXG4gICAgICAgICAgLmFwcGVuZCgnbGluZWFyR3JhZGllbnQnKVxuICAgICAgICAgIC5hdHRyKCdpZCcsIGBncmFkaWVudC0ke2NvbG9yLnJlcGxhY2UoJyMnLCAnJyl9YClcbiAgICAgICAgICAuYXR0cigneDEnLCAnMCcpXG4gICAgICAgICAgLmF0dHIoJ3kxJywgJzAnKVxuICAgICAgICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAgICAgICAuYXR0cigneTInLCAnMScpXG4gICAgICAgICAgLmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKTtcblxuICAgICAgICBncmFkaWVudFxuICAgICAgICAgIC5hcHBlbmQoJ3N0b3AnKVxuICAgICAgICAgIC5hdHRyKCdvZmZzZXQnLCAnMCUnKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IpXG4gICAgICAgICAgLmF0dHIoJ3N0b3Atb3BhY2l0eScsICcxJyk7IC8vIHRvcCBvZiBiYXIgd2lsbCBiZSBmdWxsIG9wYWNpdHlcblxuICAgICAgICBncmFkaWVudFxuICAgICAgICAgIC5hcHBlbmQoJ3N0b3AnKVxuICAgICAgICAgIC5hdHRyKCdvZmZzZXQnLCAnMTAwJScpXG4gICAgICAgICAgLmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvcilcbiAgICAgICAgICAuYXR0cignc3RvcC1vcGFjaXR5JywgJy4zJyk7IC8vIGJvdHRvbSBvZiBiYXIgd2lsbCBiZSAuMyBvcGFjaXR5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBncmFkaWVudCA9IHN2Z1xuICAgICAgICAgIC5hcHBlbmQoJ2RlZnMnKVxuICAgICAgICAgIC5hcHBlbmQoJ2xpbmVhckdyYWRpZW50JylcbiAgICAgICAgICAuYXR0cignaWQnLCBgZ3JhZGllbnQtaG9yaXpvbnRhbC0ke2NvbG9yLnJlcGxhY2UoJyMnLCAnJyl9YClcbiAgICAgICAgICAuYXR0cigneDEnLCAnMScpXG4gICAgICAgICAgLmF0dHIoJ3kxJywgJzAnKVxuICAgICAgICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAgICAgICAuYXR0cigneTInLCAnMCcpXG4gICAgICAgICAgLmF0dHIoJ3NwcmVhZE1ldGhvZCcsICdwYWQnKTtcblxuICAgICAgICBncmFkaWVudFxuICAgICAgICAgIC5hcHBlbmQoJ3N0b3AnKVxuICAgICAgICAgIC5hdHRyKCdvZmZzZXQnLCAnMCUnKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLWNvbG9yJywgY29sb3IpXG4gICAgICAgICAgLmF0dHIoJ3N0b3Atb3BhY2l0eScsICcxJyk7IC8vIHRvcCBvZiBiYXIgd2lsbCBiZSBmdWxsIG9wYWNpdHlcblxuICAgICAgICBncmFkaWVudFxuICAgICAgICAgIC5hcHBlbmQoJ3N0b3AnKVxuICAgICAgICAgIC5hdHRyKCdvZmZzZXQnLCAnMTAwJScpXG4gICAgICAgICAgLmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvcilcbiAgICAgICAgICAuYXR0cignc3RvcC1vcGFjaXR5JywgJy4zJyk7IC8vIGJvdHRvbSBvZiBiYXIgd2lsbCBiZSAuMyBvcGFjaXR5XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbG9ycztcbiAgfTtcblxuICBjcmVhdGVHbG93RmlsdGVyID0gc3ZnID0+IHtcbiAgICAvLyBhZGQgYSBuZXcgZGVmaW5pdGlvblxuICAgIGNvbnN0IGdsb3cgPSBzdmdcbiAgICAgIC5hcHBlbmQoJ2RlZnMnKVxuICAgICAgLmFwcGVuZCgnZmlsdGVyJylcbiAgICAgIC5hdHRyKCdpZCcsICdnbG93JylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICcyMDAlJylcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAnMjAwJScpO1xuXG4gICAgZ2xvd1xuICAgICAgLmFwcGVuZCgnZmVHYXVzc2lhbkJsdXInKVxuICAgICAgLmF0dHIoJ2luJywgJ1NvdXJjZUdyYXBoaWMnKVxuICAgICAgLmF0dHIoJ3N0ZERldmlhdGlvbicsIDQpO1xuXG4gICAgLy8gYnVpbGQgdHdvIGRyb3BzaGFkb3dzIHdpdGggZGlmZmVyZW50IGludGVuc2l0aWVzXG4gICAgY29uc3QgZmVPZmZzZXRzID0gW1xuICAgICAge1xuICAgICAgICBkeTogMixcbiAgICAgICAgc2xvcGU6IDAuMlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZHk6IDUsXG4gICAgICAgIHNsb3BlOiAwLjA1XG4gICAgICB9XG4gICAgXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmVPZmZzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnbG93XG4gICAgICAgIC5hcHBlbmQoJ2ZlT2Zmc2V0JylcbiAgICAgICAgLmF0dHIoJ3Jlc3VsdCcsICdvZmZzZXRCbHVyJyArIGkpXG4gICAgICAgIC5hdHRyKCdkeCcsIDApXG4gICAgICAgIC5hdHRyKCdkeScsIGZlT2Zmc2V0c1tpXS5keSk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBmZU9mZnNldHMubGVuZ3RoOyB5KyspIHtcbiAgICAgIGdsb3dcbiAgICAgICAgLmFwcGVuZCgnZmVDb21wb25lbnRUcmFuc2ZlcicpXG4gICAgICAgIC5hdHRyKCdyZXN1bHQnLCAnY29sb3JlZEJsdXInICsgeSlcbiAgICAgICAgLmF0dHIoJ2luJywgJ29mZnNldEJsdXInICsgeSlcbiAgICAgICAgLmFwcGVuZCgnZmVGdW5jQScpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ2xpbmVhcicpXG4gICAgICAgIC5hdHRyKCdzbG9wZScsIGZlT2Zmc2V0c1t5XS5zbG9wZSk7XG4gICAgfVxuXG4gICAgY29uc3QgbWVyZ2UgPSBnbG93LmFwcGVuZCgnZmVNZXJnZScpO1xuXG4gICAgbWVyZ2UuYXBwZW5kKCdmZU1lcmdlTm9kZScpLmF0dHIoJ2luJywgJ1NvdXJjZUdyYXBoaWMnKTtcblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgZmVPZmZzZXRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICBtZXJnZS5hcHBlbmQoJ2ZlTWVyZ2VOb2RlJykuYXR0cignaW4nLCAnY29sb3JlZEJsdXInICsgeCk7XG4gICAgfVxuICB9O1xuXG4gIGQzRm9ybWF0KHR5cGU6IHN0cmluZywgc3RyaW5nOiBzdHJpbmcpIHtcbiAgICBsZXQgZm9ybWF0O1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBmb3JtYXQgPSBkM19mb3JtYXQoc3RyaW5nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgZm9ybWF0ID0gZDNfdGltZUZvcm1hdChzdHJpbmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGZvcm1hdCA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXQ7XG4gIH1cbn1cbiJdfQ==
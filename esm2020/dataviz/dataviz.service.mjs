import { Injectable } from '@angular/core';
import { format as d3_format, timeFormat as d3_timeFormat } from 'd3';
import * as i0 from "@angular/core";
export class PbdsDatavizService {
    constructor() {
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
        this.getColors = (mono = false, theme = 'classic') => {
            return mono ? this.colors[theme].mono : this.colors[theme].full;
        };
        this.createGradientDefs = (svg, mono = false, theme = 'classic', vertical = true) => {
            const colors = mono ? [this.colors[theme].mono[2]] : this.colors[theme].full;
            for (let i = 0; i < colors.length; i++) {
                const color = mono ? this.colors[theme].mono[2] : this.colors[theme].full[i];
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
        };
        this.createGlowFilter = svg => {
            // add a new definition
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
            const merge = glow.append('feMerge');
            merge.append('feMergeNode').attr('in', 'SourceGraphic');
            for (let x = 0; x < feOffsets.length; x++) {
                merge.append('feMergeNode').attr('in', 'coloredBlur' + x);
            }
        };
    }
    d3Format(type, string) {
        let format;
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
    }
}
PbdsDatavizService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsDatavizService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PbdsDatavizService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsDatavizService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsDatavizService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRhdml6L2RhdGF2aXouc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLFVBQVUsSUFBSSxhQUFhLEVBQUUsTUFBTSxJQUFJLENBQUM7O0FBS3RFLE1BQU0sT0FBTyxrQkFBa0I7SUF3RTdCO1FBdkVRLFdBQU0sR0FBRztZQUNmLE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUU7b0JBQ0osU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7aUJBQ1Y7Z0JBQ0QsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxPQUFPO2FBQ2pGO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRTtvQkFDSixTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztpQkFDVjtnQkFDRCxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWE7YUFDdkY7WUFDRCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFO29CQUNKLFNBQVM7b0JBQ1QsU0FB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LFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgZm9ybWF0IGFzIGQzX2Zvcm1hdCwgdGltZUZvcm1hdCBhcyBkM190aW1lRm9ybWF0IH0gZnJvbSAnZDMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0YXZpelNlcnZpY2Uge1xuICBwcml2YXRlIGNvbG9ycyA9IHtcbiAgICBjbGFzc2ljOiB7XG4gICAgICBmdWxsOiBbXG4gICAgICAgICcjQjcwMDc3JyxcbiAgICAgICAgJyMwMzg0RDQnLFxuICAgICAgICAnI0VFNkIwQicsXG4gICAgICAgICcjQTMxOUIxJyxcbiAgICAgICAgJyMxMUE2MTEnLFxuICAgICAgICAnIzFCQjlGRicsXG4gICAgICAgICcjNDk1QTlDJyxcbiAgICAgICAgJyNFREI3MDAnLFxuICAgICAgICAnIzhCOThDOCcsXG4gICAgICAgICcjRTZDNDlDJyxcbiAgICAgICAgJyNDQ0I4Q0UnLFxuICAgICAgICAnIzlCOUI5QidcbiAgICAgIF0sXG4gICAgICBtb25vOiBbJyMwMDFENTYnLCAnIzAwMzI5NicsICcjNEI3NEM1JywgJyM4OUExRDAnLCAnI0EzQkNFRScsICcjQzlEN0YzJ10gLy8gYmx1ZVxuICAgIH0sXG4gICAgdHdpbGlnaHQ6IHtcbiAgICAgIGZ1bGw6IFtcbiAgICAgICAgJyNBMzE5QjEnLFxuICAgICAgICAnIzExQTYxMScsXG4gICAgICAgICcjMUJCOUZGJyxcbiAgICAgICAgJyNFRTZCMEInLFxuICAgICAgICAnI0I3MDA3NycsXG4gICAgICAgICcjMDM4NEQ0JyxcbiAgICAgICAgJyM0OTVBOUMnLFxuICAgICAgICAnI0VEQjcwMCcsXG4gICAgICAgICcjOEI5OEM4JyxcbiAgICAgICAgJyNFNkM0OUMnLFxuICAgICAgICAnI0NDQjhDRScsXG4gICAgICAgICcjOUI5QjlCJ1xuICAgICAgXSxcbiAgICAgIG1vbm86IFsnIzA1Mzk1QycsICcjMEE1QjkyJywgJyMwMDcyQjgnLCAnIzVEQTlEQycsICcjQTVENEYzJywgJyNEMUVERkYnXSAvLyBsaWdodCBibHVlXG4gICAgfSxcbiAgICBvY2Vhbjoge1xuICAgICAgZnVsbDogW1xuICAgICAgICAnIzAzODRENCcsXG4gICAgICAgICcjQjcwMDc3JyxcbiAgICAgICAgJyMxQkI5RkYnLFxuICAgICAgICAnIzQ5NUE5QycsXG4gICAgICAgICcjRURCNzAwJyxcbiAgICAgICAgJyNBMzE5QjEnLFxuICAgICAgICAnI0VFNkIwQicsXG4gICAgICAgICcjMTFBNjExJyxcbiAgICAgICAgJyM4Qjk4QzgnLFxuICAgICAgICAnI0U2QzQ5QycsXG4gICAgICAgICcjQ0NCOENFJyxcbiAgICAgICAgJyM5QjlCOUInXG4gICAgICBdLFxuICAgICAgbW9ubzogWycjMzk0QjREJywgJyMzQTZCNkUnLCAnIzE0NzY3RCcsICcjOTlCRkMyJywgJyNDOUU2RTgnLCAnI0RFRUNFRCddIC8vIGJsdWUtZ3JlZW5cbiAgICB9LFxuICAgIHN1bnNldDoge1xuICAgICAgZnVsbDogW1xuICAgICAgICAnI0I3MDA3NycsXG4gICAgICAgICcjRUU2QjBCJyxcbiAgICAgICAgJyMxQkI5RkYnLFxuICAgICAgICAnI0VEQjcwMCcsXG4gICAgICAgICcjMTFBNjExJyxcbiAgICAgICAgJyNBMzE5QjEnLFxuICAgICAgICAnIzAzODRENCcsXG4gICAgICAgICcjQ0NCOENFJyxcbiAgICAgICAgJyM0OTVBOUMnLFxuICAgICAgICAnI0U2QzQ5QycsXG4gICAgICAgICcjOEI5OEM4JyxcbiAgICAgICAgJyM5QjlCOUInXG4gICAgICBdLFxuICAgICAgbW9ubzogWycjMzEyNTRBJywgJyM1MDI0OEYnLCAnIzc5NDVDNCcsICcjOUE3OUUyJywgJyNDNEE4RkYnLCAnI0Q5QzdGRiddIC8vIHB1cnBsZVxuICAgIH1cbiAgfTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgZ2V0Q29sb3JzID0gKG1vbm8gPSBmYWxzZSwgdGhlbWUgPSAnY2xhc3NpYycpID0+IHtcbiAgICByZXR1cm4gbW9ubyA/IHRoaXMuY29sb3JzW3RoZW1lXS5tb25vIDogdGhpcy5jb2xvcnNbdGhlbWVdLmZ1bGw7XG4gIH07XG5cbiAgY3JlYXRlR3JhZGllbnREZWZzID0gKHN2ZywgbW9ubyA9IGZhbHNlLCB0aGVtZSA9ICdjbGFzc2ljJywgdmVydGljYWwgPSB0cnVlKSA9PiB7XG4gICAgY29uc3QgY29sb3JzID0gbW9ubyA/IFt0aGlzLmNvbG9yc1t0aGVtZV0ubW9ub1syXV0gOiB0aGlzLmNvbG9yc1t0aGVtZV0uZnVsbDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb2xvciA9IG1vbm8gPyB0aGlzLmNvbG9yc1t0aGVtZV0ubW9ub1syXSA6IHRoaXMuY29sb3JzW3RoZW1lXS5mdWxsW2ldO1xuICAgICAgbGV0IGdyYWRpZW50O1xuXG4gICAgICBpZiAodmVydGljYWwpIHtcbiAgICAgICAgZ3JhZGllbnQgPSBzdmdcbiAgICAgICAgICAuYXBwZW5kKCdkZWZzJylcbiAgICAgICAgICAuYXBwZW5kKCdsaW5lYXJHcmFkaWVudCcpXG4gICAgICAgICAgLmF0dHIoJ2lkJywgYGdyYWRpZW50LSR7Y29sb3IucmVwbGFjZSgnIycsICcnKX1gKVxuICAgICAgICAgIC5hdHRyKCd4MScsICcwJylcbiAgICAgICAgICAuYXR0cigneTEnLCAnMCcpXG4gICAgICAgICAgLmF0dHIoJ3gyJywgJzAnKVxuICAgICAgICAgIC5hdHRyKCd5MicsICcxJylcbiAgICAgICAgICAuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpO1xuXG4gICAgICAgIGdyYWRpZW50XG4gICAgICAgICAgLmFwcGVuZCgnc3RvcCcpXG4gICAgICAgICAgLmF0dHIoJ29mZnNldCcsICcwJScpXG4gICAgICAgICAgLmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvcilcbiAgICAgICAgICAuYXR0cignc3RvcC1vcGFjaXR5JywgJzEnKTsgLy8gdG9wIG9mIGJhciB3aWxsIGJlIGZ1bGwgb3BhY2l0eVxuXG4gICAgICAgIGdyYWRpZW50XG4gICAgICAgICAgLmFwcGVuZCgnc3RvcCcpXG4gICAgICAgICAgLmF0dHIoJ29mZnNldCcsICcxMDAlJylcbiAgICAgICAgICAuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLW9wYWNpdHknLCAnLjMnKTsgLy8gYm90dG9tIG9mIGJhciB3aWxsIGJlIC4zIG9wYWNpdHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdyYWRpZW50ID0gc3ZnXG4gICAgICAgICAgLmFwcGVuZCgnZGVmcycpXG4gICAgICAgICAgLmFwcGVuZCgnbGluZWFyR3JhZGllbnQnKVxuICAgICAgICAgIC5hdHRyKCdpZCcsIGBncmFkaWVudC1ob3Jpem9udGFsLSR7Y29sb3IucmVwbGFjZSgnIycsICcnKX1gKVxuICAgICAgICAgIC5hdHRyKCd4MScsICcxJylcbiAgICAgICAgICAuYXR0cigneTEnLCAnMCcpXG4gICAgICAgICAgLmF0dHIoJ3gyJywgJzAnKVxuICAgICAgICAgIC5hdHRyKCd5MicsICcwJylcbiAgICAgICAgICAuYXR0cignc3ByZWFkTWV0aG9kJywgJ3BhZCcpO1xuXG4gICAgICAgIGdyYWRpZW50XG4gICAgICAgICAgLmFwcGVuZCgnc3RvcCcpXG4gICAgICAgICAgLmF0dHIoJ29mZnNldCcsICcwJScpXG4gICAgICAgICAgLmF0dHIoJ3N0b3AtY29sb3InLCBjb2xvcilcbiAgICAgICAgICAuYXR0cignc3RvcC1vcGFjaXR5JywgJzEnKTsgLy8gdG9wIG9mIGJhciB3aWxsIGJlIGZ1bGwgb3BhY2l0eVxuXG4gICAgICAgIGdyYWRpZW50XG4gICAgICAgICAgLmFwcGVuZCgnc3RvcCcpXG4gICAgICAgICAgLmF0dHIoJ29mZnNldCcsICcxMDAlJylcbiAgICAgICAgICAuYXR0cignc3RvcC1jb2xvcicsIGNvbG9yKVxuICAgICAgICAgIC5hdHRyKCdzdG9wLW9wYWNpdHknLCAnLjMnKTsgLy8gYm90dG9tIG9mIGJhciB3aWxsIGJlIC4zIG9wYWNpdHlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29sb3JzO1xuICB9O1xuXG4gIGNyZWF0ZUdsb3dGaWx0ZXIgPSBzdmcgPT4ge1xuICAgIC8vIGFkZCBhIG5ldyBkZWZpbml0aW9uXG4gICAgY29uc3QgZ2xvdyA9IHN2Z1xuICAgICAgLmFwcGVuZCgnZGVmcycpXG4gICAgICAuYXBwZW5kKCdmaWx0ZXInKVxuICAgICAgLmF0dHIoJ2lkJywgJ2dsb3cnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgJzIwMCUnKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICcyMDAlJyk7XG5cbiAgICBnbG93XG4gICAgICAuYXBwZW5kKCdmZUdhdXNzaWFuQmx1cicpXG4gICAgICAuYXR0cignaW4nLCAnU291cmNlR3JhcGhpYycpXG4gICAgICAuYXR0cignc3RkRGV2aWF0aW9uJywgNCk7XG5cbiAgICAvLyBidWlsZCB0d28gZHJvcHNoYWRvd3Mgd2l0aCBkaWZmZXJlbnQgaW50ZW5zaXRpZXNcbiAgICBjb25zdCBmZU9mZnNldHMgPSBbXG4gICAgICB7XG4gICAgICAgIGR5OiAyLFxuICAgICAgICBzbG9wZTogMC4yXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBkeTogNSxcbiAgICAgICAgc2xvcGU6IDAuMDVcbiAgICAgIH1cbiAgICBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZU9mZnNldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGdsb3dcbiAgICAgICAgLmFwcGVuZCgnZmVPZmZzZXQnKVxuICAgICAgICAuYXR0cigncmVzdWx0JywgJ29mZnNldEJsdXInICsgaSlcbiAgICAgICAgLmF0dHIoJ2R4JywgMClcbiAgICAgICAgLmF0dHIoJ2R5JywgZmVPZmZzZXRzW2ldLmR5KTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGZlT2Zmc2V0cy5sZW5ndGg7IHkrKykge1xuICAgICAgZ2xvd1xuICAgICAgICAuYXBwZW5kKCdmZUNvbXBvbmVudFRyYW5zZmVyJylcbiAgICAgICAgLmF0dHIoJ3Jlc3VsdCcsICdjb2xvcmVkQmx1cicgKyB5KVxuICAgICAgICAuYXR0cignaW4nLCAnb2Zmc2V0Qmx1cicgKyB5KVxuICAgICAgICAuYXBwZW5kKCdmZUZ1bmNBJylcbiAgICAgICAgLmF0dHIoJ3R5cGUnLCAnbGluZWFyJylcbiAgICAgICAgLmF0dHIoJ3Nsb3BlJywgZmVPZmZzZXRzW3ldLnNsb3BlKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXJnZSA9IGdsb3cuYXBwZW5kKCdmZU1lcmdlJyk7XG5cbiAgICBtZXJnZS5hcHBlbmQoJ2ZlTWVyZ2VOb2RlJykuYXR0cignaW4nLCAnU291cmNlR3JhcGhpYycpO1xuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBmZU9mZnNldHMubGVuZ3RoOyB4KyspIHtcbiAgICAgIG1lcmdlLmFwcGVuZCgnZmVNZXJnZU5vZGUnKS5hdHRyKCdpbicsICdjb2xvcmVkQmx1cicgKyB4KTtcbiAgICB9XG4gIH07XG5cbiAgZDNGb3JtYXQodHlwZTogc3RyaW5nLCBzdHJpbmc6IHN0cmluZykge1xuICAgIGxldCBmb3JtYXQ7XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGZvcm1hdCA9IGQzX2Zvcm1hdChzdHJpbmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBmb3JtYXQgPSBkM190aW1lRm9ybWF0KHN0cmluZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZm9ybWF0ID0gbnVsbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdDtcbiAgfVxufVxuIl19
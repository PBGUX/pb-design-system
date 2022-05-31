import { Directive, EventEmitter, forwardRef, Inject, Input, Output } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { easeQuadInOut as d3_easeQuadInOut } from 'd3-ease';
import { PbdsDatavizBarStackedComponent } from './dataviz-bar-stacked.component';
import { PbdsDatavizBarComponent } from './dataviz-bar.component';
import * as i0 from "@angular/core";
function getComment(d) {
    return d.comment;
}
/*
BAR CHART
*/
export class PbdsBarAnnotationsDirective {
    constructor(component) {
        this.component = component;
        this.onAnnotationClick = new EventEmitter();
        component.marginTop = 45;
    }
    ngOnInit() {
        this.annotationsGroup = this.component.svg.append('g').attr('class', 'annotations');
        this.update();
    }
    update() {
        const isAnotations = this.annotations;
        const isIncidents = this.annotations?.incidents.length > 0;
        const isComments = this.annotations?.comments.length > 0;
        let incidentOffset = 8;
        if (isAnotations && isIncidents) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.incident')
                .data(this.annotations.incidents)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'incident');
                const circle = g
                    .append('circle')
                    .attr('r', 0)
                    .attr('cy', -25)
                    .attr('cx', (d) => {
                    const isComments = this.annotations?.comments.some((comment) => comment.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 - offset;
                })
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', (d) => {
                    const isComments = this.annotations?.comments.some((comment) => comment.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 - offset;
                })
                    .attr('y', '-22')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '.3em')
                    .text('')
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .select('circle')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('cx', (d) => {
                    const isComments = this.annotations?.comments.some((comment) => comment.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 - offset;
                });
                update
                    .select('text')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('x', (d) => {
                    const isComments = this.annotations?.comments.some((comment) => comment.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 - offset;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(1000).attr('r', 0);
                exit.select('text').transition().duration(1000).attr('style', 'font-size: 0');
                return exit.transition().delay(500).remove();
            })
                .on('mouseover', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                console.log('ANNOTATIONS CLICK', event, data);
                this.onAnnotationClick.emit({ event, data });
            });
        }
        if (isAnotations && isComments) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.comment')
                .data(this.annotations.comments)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'comment');
                const circle = g
                    .append('circle')
                    .attr('r', 0)
                    .attr('cy', -25)
                    .attr('cx', (d) => {
                    const isComments = this.annotations?.incidents.some((incident) => incident.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 + offset;
                })
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', (d) => {
                    const isComments = this.annotations?.incidents.some((incident) => incident.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 + offset;
                })
                    .attr('y', '-22')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '.3em')
                    .text('')
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .select('circle')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('cx', (d) => {
                    const isComments = this.annotations?.incidents.some((incident) => incident.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 + offset;
                });
                update
                    .select('text')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('x', (d) => {
                    const isComments = this.annotations?.incidents.some((incident) => incident.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 + offset;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(1000).attr('r', 0);
                exit.select('text').transition().duration(1000).attr('style', 'font-size: 0');
                return exit.transition().delay(500).remove();
            })
                .on('mouseover', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                console.log('ANNOTATIONS CLICK', event, data);
                this.onAnnotationClick.emit({ event, data });
            });
        }
        // TODO: add check for edit mode
        this.component.svg.selectAll('.bar').classed('pbds-add-annotation', true);
    }
}
PbdsBarAnnotationsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsBarAnnotationsDirective, deps: [{ token: forwardRef(() => PbdsDatavizBarComponent) }], target: i0.ɵɵFactoryTarget.Directive });
PbdsBarAnnotationsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.6", type: PbdsBarAnnotationsDirective, selector: "pbds-dataviz-bar[annotations]", inputs: { annotations: "annotations" }, outputs: { onAnnotationClick: "on-annotation-click" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsBarAnnotationsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'pbds-dataviz-bar[annotations]'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => PbdsDatavizBarComponent)]
                }] }]; }, propDecorators: { annotations: [{
                type: Input,
                args: ['annotations']
            }], onAnnotationClick: [{
                type: Output,
                args: ['on-annotation-click']
            }] } });
/*
STACKED BAR CHART
*/
export class PbdsBarStackedAnnotationsDirective {
    constructor(component) {
        this.component = component;
        this.annotationClicked = new EventEmitter();
        component.marginTop = 45;
    }
    ngOnInit() {
        this.annotationsGroup = this.component.svg.append('g').attr('class', 'annotations');
        this.update();
    }
    ngOnChanges(changes) {
        if (changes.annotations && !changes.annotations.firstChange) {
            this.update();
        }
    }
    update() {
        const isAnotations = this.annotations;
        const isIncidents = this.annotations?.incidents.length > 0;
        const isComments = this.annotations?.comments.length > 0;
        let incidentOffset = 8;
        if (isAnotations && isIncidents) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.incident')
                .data(this.annotations.incidents)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'incident');
                const circle = g
                    .append('circle')
                    .attr('r', 0)
                    .attr('cy', -25)
                    .attr('cx', (d) => {
                    const isComments = this.annotations?.comments.some((comment) => comment.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 - offset;
                })
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', (d) => {
                    const isComments = this.annotations?.comments.some((comment) => comment.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 - offset;
                })
                    .attr('y', '-22')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '.3em')
                    .text((d) => {
                    console.log('ICON: ', d);
                    return d.icon;
                })
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .select('circle')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('cx', (d) => {
                    const isComments = this.annotations?.comments.some((comment) => comment.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 - offset;
                });
                update
                    .select('text')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('x', (d) => {
                    const isComments = this.annotations?.comments.some((comment) => comment.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 - offset;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(1000).attr('r', 0);
                exit.select('text').transition().duration(1000).attr('style', 'font-size: 0');
                return exit.transition().delay(500).remove();
            })
                .on('mouseover', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                console.log('ANNOTATIONS CLICK', event, data);
                this.annotationClicked.emit({ event, data });
            });
        }
        if (isAnotations && isComments) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.comment')
                .data(this.annotations.comments)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'comment');
                const circle = g
                    .append('circle')
                    .attr('r', 0)
                    .attr('cy', -25)
                    .attr('cx', (d) => {
                    const isComments = this.annotations?.incidents.some((incident) => incident.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 + offset;
                })
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', (d) => {
                    const isComments = this.annotations?.incidents.some((incident) => incident.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 + offset;
                })
                    .attr('y', '-22')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '.3em')
                    .text('')
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .select('circle')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('cx', (d) => {
                    const isComments = this.annotations?.incidents.some((incident) => incident.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 + offset;
                });
                update
                    .select('text')
                    .transition()
                    .duration(1000)
                    .ease(d3_easeQuadInOut)
                    .attr('x', (d) => {
                    const isComments = this.annotations?.incidents.some((incident) => incident.label === d.label);
                    const offset = isComments ? incidentOffset : 0;
                    return this.component.xAxisScale(d.label) + bandwidth / 2 + offset;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(1000).attr('r', 0);
                exit.select('text').transition().duration(1000).attr('style', 'font-size: 0');
                return exit.transition().delay(500).remove();
            })
                .on('mouseover', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                console.log('ANNOTATIONS CLICK', event, data);
                this.annotationClicked.emit({ event, data });
            });
        }
        // TODO: add check for edit mode
        this.component.svg.selectAll('.mouseover-bar').classed('pbds-annotation-add', true);
    }
}
PbdsBarStackedAnnotationsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsBarStackedAnnotationsDirective, deps: [{ token: forwardRef(() => PbdsDatavizBarStackedComponent) }], target: i0.ɵɵFactoryTarget.Directive });
PbdsBarStackedAnnotationsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.6", type: PbdsBarStackedAnnotationsDirective, selector: "pbds-dataviz-bar-stacked[annotations]", inputs: { annotations: "annotations" }, outputs: { annotationClicked: "annotationClicked" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsBarStackedAnnotationsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'pbds-dataviz-bar-stacked[annotations]'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => PbdsDatavizBarStackedComponent)]
                }] }]; }, propDecorators: { annotations: [{
                type: Input,
                args: ['annotations']
            }], annotationClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1hbm5vdGF0aW9ucy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1hbm5vdGF0aW9ucy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLElBQUksZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFNUQsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7O0FBRWxFLFNBQVMsVUFBVSxDQUFDLENBQU07SUFDeEIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ25CLENBQUM7QUFFRDs7RUFFRTtBQUlGLE1BQU0sT0FBTywyQkFBMkI7SUFPdEMsWUFBdUUsU0FBUztRQUFULGNBQVMsR0FBVCxTQUFTLENBQUE7UUFKakQsc0JBQWlCLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFLdkYsU0FBUyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFcEYsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxNQUFNO1FBQ1osTUFBTSxZQUFZLEdBQUcs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LEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztTQUNOO1FBRUQsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0RixDQUFDOzsrSEExTlUsa0NBQWtDLGtCQU96QixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsOEJBQThCLENBQUM7bUhBUHpELGtDQUFrQzsyRkFBbEMsa0NBQWtDO2tCQUg5QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx1Q0FBdUM7aUJBQ2xEOzswQkFRYyxNQUFNOzJCQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQzs0Q0FOOUMsV0FBVztzQkFBaEMsS0FBSzt1QkFBQyxhQUFhO2dCQUVWLGlCQUFpQjtzQkFBMUIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgc2VsZWN0IGFzIGQzX3NlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBlYXNlUXVhZEluT3V0IGFzIGQzX2Vhc2VRdWFkSW5PdXQgfSBmcm9tICdkMy1lYXNlJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJTdGFja2VkQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJhci1zdGFja2VkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhckNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXIuY29tcG9uZW50JztcblxuZnVuY3Rpb24gZ2V0Q29tbWVudChkOiBhbnkpIHtcbiAgcmV0dXJuIGQuY29tbWVudDtcbn1cblxuLypcbkJBUiBDSEFSVFxuKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1iYXJbYW5ub3RhdGlvbnNdJ1xufSlcbmV4cG9ydCBjbGFzcyBQYmRzQmFyQW5ub3RhdGlvbnNEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoJ2Fubm90YXRpb25zJykgYW5ub3RhdGlvbnM7XG5cbiAgQE91dHB1dCgnb24tYW5ub3RhdGlvbi1jbGljaycpIG9uQW5ub3RhdGlvbkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIGFubm90YXRpb25zR3JvdXA7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IFBiZHNEYXRhdml6QmFyQ29tcG9uZW50KSkgcHJpdmF0ZSBjb21wb25lbnQpIHtcbiAgICBjb21wb25lbnQubWFyZ2luVG9wID0gNDU7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmFubm90YXRpb25zR3JvdXAgPSB0aGlzLmNvbXBvbmVudC5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnYW5ub3RhdGlvbnMnKTtcblxuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZSgpIHtcbiAgICBjb25zdCBpc0Fub3RhdGlvbnMgPSB0aGlzLmFubm90YXRpb25zO1xuICAgIGNvbnN0IGlzSW5jaWRlbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uaW5jaWRlbnRzLmxlbmd0aCA+IDA7XG4gICAgY29uc3QgaXNDb21tZW50cyA9IHRoaXMuYW5ub3RhdGlvbnM/LmNvbW1lbnRzLmxlbmd0aCA+IDA7XG4gICAgbGV0IGluY2lkZW50T2Zmc2V0ID0gODtcblxuICAgIGlmIChpc0Fub3RhdGlvbnMgJiYgaXNJbmNpZGVudHMpIHtcbiAgICAgIGNvbnN0IGJhbmR3aWR0aCA9IHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUuYmFuZHdpZHRoKCk7XG5cbiAgICAgIHRoaXMuYW5ub3RhdGlvbnNHcm91cFxuICAgICAgICAuc2VsZWN0QWxsKCdnLmluY2lkZW50JylcbiAgICAgICAgLmRhdGEodGhpcy5hbm5vdGF0aW9ucy5pbmNpZGVudHMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZyA9IGVudGVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2luY2lkZW50Jyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNpcmNsZSA9IGdcbiAgICAgICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3InLCAwKVxuICAgICAgICAgICAgICAuYXR0cignY3knLCAtMjUpXG4gICAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb21tZW50cyA9IHRoaXMuYW5ub3RhdGlvbnM/LmNvbW1lbnRzLnNvbWUoKGNvbW1lbnQpID0+IGNvbW1lbnQubGFiZWwgPT09IGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gaXNDb21tZW50cyA/IGluY2lkZW50T2Zmc2V0IDogMDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQubGFiZWwpICsgYmFuZHdpZHRoIC8gMiAtIG9mZnNldDtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ3InLCAxNSk7XG5cbiAgICAgICAgICAgIGcuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29tbWVudHMgPSB0aGlzLmFubm90YXRpb25zPy5jb21tZW50cy5zb21lKChjb21tZW50KSA9PiBjb21tZW50LmxhYmVsID09PSBkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc0NvbW1lbnRzID8gaW5jaWRlbnRPZmZzZXQgOiAwO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUoZC5sYWJlbCkgKyBiYW5kd2lkdGggLyAyIC0gb2Zmc2V0O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cigneScsICctMjInKVxuICAgICAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2R5JywgJy4zZW0nKVxuICAgICAgICAgICAgICAudGV4dCgn7qmBJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMCcpXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCdzdHlsZScsICdmb250LXNpemU6IDE3cHgnKTtcblxuICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgLnNlbGVjdCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvbW1lbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uY29tbWVudHMuc29tZSgoY29tbWVudCkgPT4gY29tbWVudC5sYWJlbCA9PT0gZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gaXNDb21tZW50cyA/IGluY2lkZW50T2Zmc2V0IDogMDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQubGFiZWwpICsgYmFuZHdpZHRoIC8gMiAtIG9mZnNldDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAuc2VsZWN0KCd0ZXh0JylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29tbWVudHMgPSB0aGlzLmFubm90YXRpb25zPy5jb21tZW50cy5zb21lKChjb21tZW50KSA9PiBjb21tZW50LmxhYmVsID09PSBkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc0NvbW1lbnRzID8gaW5jaWRlbnRPZmZzZXQgOiAwO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUoZC5sYWJlbCkgKyBiYW5kd2lkdGggLyAyIC0gb2Zmc2V0O1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4ge1xuICAgICAgICAgICAgZXhpdC5zZWxlY3QoJ2NpcmNsZScpLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5hdHRyKCdyJywgMCk7XG5cbiAgICAgICAgICAgIGV4aXQuc2VsZWN0KCd0ZXh0JykudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZXhpdC50cmFuc2l0aW9uKCkuZGVsYXkoNTAwKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBkM19zZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCkuY2xhc3NlZCgnaG92ZXJlZCcsIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgICAgZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsYXNzZWQoJ2hvdmVyZWQnLCBmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQU5OT1RBVElPTlMgQ0xJQ0snLCBldmVudCwgZGF0YSk7XG4gICAgICAgICAgdGhpcy5vbkFubm90YXRpb25DbGljay5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChpc0Fub3RhdGlvbnMgJiYgaXNDb21tZW50cykge1xuICAgICAgY29uc3QgYmFuZHdpZHRoID0gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZS5iYW5kd2lkdGgoKTtcblxuICAgICAgdGhpcy5hbm5vdGF0aW9uc0dyb3VwXG4gICAgICAgIC5zZWxlY3RBbGwoJ2cuY29tbWVudCcpXG4gICAgICAgIC5kYXRhKHRoaXMuYW5ub3RhdGlvbnMuY29tbWVudHMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZyA9IGVudGVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2NvbW1lbnQnKTtcblxuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gZ1xuICAgICAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgICAuYXR0cigncicsIDApXG4gICAgICAgICAgICAgIC5hdHRyKCdjeScsIC0yNSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvbW1lbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uaW5jaWRlbnRzLnNvbWUoKGluY2lkZW50KSA9PiBpbmNpZGVudC5sYWJlbCA9PT0gZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc0NvbW1lbnRzID8gaW5jaWRlbnRPZmZzZXQgOiAwO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUoZC5sYWJlbCkgKyBiYW5kd2lkdGggLyAyICsgb2Zmc2V0O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cigncicsIDE1KTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb21tZW50cyA9IHRoaXMuYW5ub3RhdGlvbnM/LmluY2lkZW50cy5zb21lKChpbmNpZGVudCkgPT4gaW5jaWRlbnQubGFiZWwgPT09IGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gaXNDb21tZW50cyA/IGluY2lkZW50T2Zmc2V0IDogMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkLmxhYmVsKSArIGJhbmR3aWR0aCAvIDIgKyBvZmZzZXQ7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgJy0yMicpXG4gICAgICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAgICAgICAuYXR0cignZHknLCAnLjNlbScpXG4gICAgICAgICAgICAgIC50ZXh0KCfuqrwnKVxuICAgICAgICAgICAgICAuYXR0cignc3R5bGUnLCAnZm9udC1zaXplOiAwJylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMTdweCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZztcbiAgICAgICAgICB9LFxuICAgICAgICAgICh1cGRhdGUpID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAuc2VsZWN0KCdjaXJjbGUnKVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29tbWVudHMgPSB0aGlzLmFubm90YXRpb25zPy5pbmNpZGVudHMuc29tZSgoaW5jaWRlbnQpID0+IGluY2lkZW50LmxhYmVsID09PSBkLmxhYmVsKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGlzQ29tbWVudHMgPyBpbmNpZGVudE9mZnNldCA6IDA7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkLmxhYmVsKSArIGJhbmR3aWR0aCAvIDIgKyBvZmZzZXQ7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgLnNlbGVjdCgndGV4dCcpXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvbW1lbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uaW5jaWRlbnRzLnNvbWUoKGluY2lkZW50KSA9PiBpbmNpZGVudC5sYWJlbCA9PT0gZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc0NvbW1lbnRzID8gaW5jaWRlbnRPZmZzZXQgOiAwO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQubGFiZWwpICsgYmFuZHdpZHRoIC8gMiArIG9mZnNldDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4ge1xuICAgICAgICAgICAgZXhpdC5zZWxlY3QoJ2NpcmNsZScpLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5hdHRyKCdyJywgMCk7XG5cbiAgICAgICAgICAgIGV4aXQuc2VsZWN0KCd0ZXh0JykudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZXhpdC50cmFuc2l0aW9uKCkuZGVsYXkoNTAwKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBkM19zZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCkuY2xhc3NlZCgnaG92ZXJlZCcsIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgICAgZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsYXNzZWQoJ2hvdmVyZWQnLCBmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQU5OT1RBVElPTlMgQ0xJQ0snLCBldmVudCwgZGF0YSk7XG4gICAgICAgICAgdGhpcy5vbkFubm90YXRpb25DbGljay5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGFkZCBjaGVjayBmb3IgZWRpdCBtb2RlXG4gICAgdGhpcy5jb21wb25lbnQuc3ZnLnNlbGVjdEFsbCgnLmJhcicpLmNsYXNzZWQoJ3BiZHMtYWRkLWFubm90YXRpb24nLCB0cnVlKTtcbiAgfVxufVxuXG4vKlxuU1RBQ0tFRCBCQVIgQ0hBUlRcbiovXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0YXZpei1iYXItc3RhY2tlZFthbm5vdGF0aW9uc10nXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNCYXJTdGFja2VkQW5ub3RhdGlvbnNEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgnYW5ub3RhdGlvbnMnKSBhbm5vdGF0aW9ucztcblxuICBAT3V0cHV0KCkgYW5ub3RhdGlvbkNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgYW5ub3RhdGlvbnNHcm91cDtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gUGJkc0RhdGF2aXpCYXJTdGFja2VkQ29tcG9uZW50KSkgcHJpdmF0ZSBjb21wb25lbnQpIHtcbiAgICBjb21wb25lbnQubWFyZ2luVG9wID0gNDU7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmFubm90YXRpb25zR3JvdXAgPSB0aGlzLmNvbXBvbmVudC5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnYW5ub3RhdGlvbnMnKTtcblxuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuYW5ub3RhdGlvbnMgJiYgIWNoYW5nZXMuYW5ub3RhdGlvbnMuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGUoKSB7XG4gICAgY29uc3QgaXNBbm90YXRpb25zID0gdGhpcy5hbm5vdGF0aW9ucztcbiAgICBjb25zdCBpc0luY2lkZW50cyA9IHRoaXMuYW5ub3RhdGlvbnM/LmluY2lkZW50cy5sZW5ndGggPiAwO1xuICAgIGNvbnN0IGlzQ29tbWVudHMgPSB0aGlzLmFubm90YXRpb25zPy5jb21tZW50cy5sZW5ndGggPiAwO1xuICAgIGxldCBpbmNpZGVudE9mZnNldCA9IDg7XG5cbiAgICBpZiAoaXNBbm90YXRpb25zICYmIGlzSW5jaWRlbnRzKSB7XG4gICAgICBjb25zdCBiYW5kd2lkdGggPSB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlLmJhbmR3aWR0aCgpO1xuXG4gICAgICB0aGlzLmFubm90YXRpb25zR3JvdXBcbiAgICAgICAgLnNlbGVjdEFsbCgnZy5pbmNpZGVudCcpXG4gICAgICAgIC5kYXRhKHRoaXMuYW5ub3RhdGlvbnMuaW5jaWRlbnRzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGcgPSBlbnRlci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdpbmNpZGVudCcpO1xuXG4gICAgICAgICAgICBjb25zdCBjaXJjbGUgPSBnXG4gICAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAgIC5hdHRyKCdyJywgMClcbiAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgLTI1KVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29tbWVudHMgPSB0aGlzLmFubm90YXRpb25zPy5jb21tZW50cy5zb21lKChjb21tZW50KSA9PiBjb21tZW50LmxhYmVsID09PSBkLmxhYmVsKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGlzQ29tbWVudHMgPyBpbmNpZGVudE9mZnNldCA6IDA7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkLmxhYmVsKSArIGJhbmR3aWR0aCAvIDIgLSBvZmZzZXQ7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCdyJywgMTUpO1xuXG4gICAgICAgICAgICBnLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvbW1lbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uY29tbWVudHMuc29tZSgoY29tbWVudCkgPT4gY29tbWVudC5sYWJlbCA9PT0gZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gaXNDb21tZW50cyA/IGluY2lkZW50T2Zmc2V0IDogMDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQubGFiZWwpICsgYmFuZHdpZHRoIC8gMiAtIG9mZnNldDtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCAnLTIyJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgICAgIC5hdHRyKCdkeScsICcuM2VtJylcbiAgICAgICAgICAgICAgLnRleHQoKGQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSUNPTjogJywgZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQuaWNvbjtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMCcpXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCdzdHlsZScsICdmb250LXNpemU6IDE3cHgnKTtcblxuICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgLnNlbGVjdCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvbW1lbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uY29tbWVudHMuc29tZSgoY29tbWVudCkgPT4gY29tbWVudC5sYWJlbCA9PT0gZC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gaXNDb21tZW50cyA/IGluY2lkZW50T2Zmc2V0IDogMDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQubGFiZWwpICsgYmFuZHdpZHRoIC8gMiAtIG9mZnNldDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAuc2VsZWN0KCd0ZXh0JylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29tbWVudHMgPSB0aGlzLmFubm90YXRpb25zPy5jb21tZW50cy5zb21lKChjb21tZW50KSA9PiBjb21tZW50LmxhYmVsID09PSBkLmxhYmVsKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc0NvbW1lbnRzID8gaW5jaWRlbnRPZmZzZXQgOiAwO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUoZC5sYWJlbCkgKyBiYW5kd2lkdGggLyAyIC0gb2Zmc2V0O1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4ge1xuICAgICAgICAgICAgZXhpdC5zZWxlY3QoJ2NpcmNsZScpLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5hdHRyKCdyJywgMCk7XG5cbiAgICAgICAgICAgIGV4aXQuc2VsZWN0KCd0ZXh0JykudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZXhpdC50cmFuc2l0aW9uKCkuZGVsYXkoNTAwKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBkM19zZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCkuY2xhc3NlZCgnaG92ZXJlZCcsIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgICAgZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsYXNzZWQoJ2hvdmVyZWQnLCBmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQU5OT1RBVElPTlMgQ0xJQ0snLCBldmVudCwgZGF0YSk7XG4gICAgICAgICAgdGhpcy5hbm5vdGF0aW9uQ2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChpc0Fub3RhdGlvbnMgJiYgaXNDb21tZW50cykge1xuICAgICAgY29uc3QgYmFuZHdpZHRoID0gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZS5iYW5kd2lkdGgoKTtcblxuICAgICAgdGhpcy5hbm5vdGF0aW9uc0dyb3VwXG4gICAgICAgIC5zZWxlY3RBbGwoJ2cuY29tbWVudCcpXG4gICAgICAgIC5kYXRhKHRoaXMuYW5ub3RhdGlvbnMuY29tbWVudHMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZyA9IGVudGVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2NvbW1lbnQnKTtcblxuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gZ1xuICAgICAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgICAuYXR0cigncicsIDApXG4gICAgICAgICAgICAgIC5hdHRyKCdjeScsIC0yNSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvbW1lbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uaW5jaWRlbnRzLnNvbWUoKGluY2lkZW50KSA9PiBpbmNpZGVudC5sYWJlbCA9PT0gZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc0NvbW1lbnRzID8gaW5jaWRlbnRPZmZzZXQgOiAwO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUoZC5sYWJlbCkgKyBiYW5kd2lkdGggLyAyICsgb2Zmc2V0O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cigncicsIDE1KTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb21tZW50cyA9IHRoaXMuYW5ub3RhdGlvbnM/LmluY2lkZW50cy5zb21lKChpbmNpZGVudCkgPT4gaW5jaWRlbnQubGFiZWwgPT09IGQubGFiZWwpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gaXNDb21tZW50cyA/IGluY2lkZW50T2Zmc2V0IDogMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkLmxhYmVsKSArIGJhbmR3aWR0aCAvIDIgKyBvZmZzZXQ7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgJy0yMicpXG4gICAgICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAgICAgICAuYXR0cignZHknLCAnLjNlbScpXG4gICAgICAgICAgICAgIC50ZXh0KCfuqrwnKVxuICAgICAgICAgICAgICAuYXR0cignc3R5bGUnLCAnZm9udC1zaXplOiAwJylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMTdweCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZztcbiAgICAgICAgICB9LFxuICAgICAgICAgICh1cGRhdGUpID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAuc2VsZWN0KCdjaXJjbGUnKVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29tbWVudHMgPSB0aGlzLmFubm90YXRpb25zPy5pbmNpZGVudHMuc29tZSgoaW5jaWRlbnQpID0+IGluY2lkZW50LmxhYmVsID09PSBkLmxhYmVsKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGlzQ29tbWVudHMgPyBpbmNpZGVudE9mZnNldCA6IDA7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkLmxhYmVsKSArIGJhbmR3aWR0aCAvIDIgKyBvZmZzZXQ7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgLnNlbGVjdCgndGV4dCcpXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvbW1lbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uaW5jaWRlbnRzLnNvbWUoKGluY2lkZW50KSA9PiBpbmNpZGVudC5sYWJlbCA9PT0gZC5sYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc0NvbW1lbnRzID8gaW5jaWRlbnRPZmZzZXQgOiAwO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQubGFiZWwpICsgYmFuZHdpZHRoIC8gMiArIG9mZnNldDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4ge1xuICAgICAgICAgICAgZXhpdC5zZWxlY3QoJ2NpcmNsZScpLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5hdHRyKCdyJywgMCk7XG5cbiAgICAgICAgICAgIGV4aXQuc2VsZWN0KCd0ZXh0JykudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZXhpdC50cmFuc2l0aW9uKCkuZGVsYXkoNTAwKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBkM19zZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCkuY2xhc3NlZCgnaG92ZXJlZCcsIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgICAgZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsYXNzZWQoJ2hvdmVyZWQnLCBmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQU5OT1RBVElPTlMgQ0xJQ0snLCBldmVudCwgZGF0YSk7XG4gICAgICAgICAgdGhpcy5hbm5vdGF0aW9uQ2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGFkZCBjaGVjayBmb3IgZWRpdCBtb2RlXG4gICAgdGhpcy5jb21wb25lbnQuc3ZnLnNlbGVjdEFsbCgnLm1vdXNlb3Zlci1iYXInKS5jbGFzc2VkKCdwYmRzLWFubm90YXRpb24tYWRkJywgdHJ1ZSk7XG4gIH1cbn1cbiJdfQ==
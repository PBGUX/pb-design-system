import { Directive, EventEmitter, forwardRef, Inject, Input, Output } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { easeQuadInOut as d3_easeQuadInOut } from 'd3-ease';
import { PbdsDatavizBarStackedComponent } from './dataviz-bar-stacked.component';
import * as i0 from "@angular/core";
const ANNOTATION_MARGIN_TOP = 62;
const ANNOTATION_OFFSET = -22;
const ANNOTATION_COMMENT_OFFSET = -47;
const TRANSITION_DURATION = 1000;
const TRANSITION_DELAY = 500;
export class PbdsBarStackedAnnotationsDirective {
    constructor(component) {
        this.component = component;
        this.annotationsHilight = null;
        this.annotationClicked = new EventEmitter();
        component.marginTop = ANNOTATION_MARGIN_TOP;
    }
    ngOnInit() {
        this.annotationsGroup = this.component.svg.append('g').attr('class', 'annotations');
        this.hilightBox = this.annotationsGroup
            .append('rect')
            .classed('annotations-hilight', true)
            .attr('opacity', 0)
            .attr('width', this.component.xAxisScale.bandwidth())
            .attr('height', this.component.height)
            .attr('transform', `translate(${0}, ${0})`);
        this.update();
    }
    ngOnChanges(changes) {
        if (changes && changes.annotationsHilight && !changes.annotationsHilight.firstChange) {
            if (changes.annotationsHilight.currentValue) {
                this.updateHilight();
            }
            else {
                this.hilightBox.transition().duration(200).attr('opacity', 0);
            }
        }
        if (changes.annotations && !changes.annotations.firstChange) {
            this.update();
        }
    }
    update() {
        const isAnotations = this.annotations;
        const isIncidents = this.annotations?.incidents?.length > 0;
        const isComments = this.annotations?.comments?.length > 0;
        if (isAnotations && isIncidents) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.incident')
                .data(this.annotations.incidents)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'incident');
                g.attr('transform', (d, i) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    const y = ANNOTATION_OFFSET;
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(d3_easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('dx', 1)
                    .attr('dy', 9)
                    .attr('text-anchor', 'middle')
                    .text((d) => {
                    return d.icon || '';
                })
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(d3_easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(d3_easeQuadInOut)
                    .attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    const y = ANNOTATION_OFFSET;
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY).remove();
            })
                .on('mouseover', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event, data) => {
                d3_select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                // console.log('incident clicked', this.index.get(event.currentTarget.node));
                this.annotationClicked.emit({ event, data, index: +d3_select(event.currentTarget).attr('index') });
            });
        }
        if (isAnotations && isComments) {
            const bandwidth = this.component.xAxisScale.bandwidth();
            this.annotationsGroup
                .selectAll('g.comment')
                .data(this.annotations.comments)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'comment');
                g.attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    let y = ANNOTATION_OFFSET;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET;
                    }
                    return `translate(${x}, ${y})`;
                }).attr('index', (d, i) => i);
                g.append('circle')
                    .attr('r', 0)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(d3_easeQuadInOut)
                    .attr('r', 15);
                g.append('text')
                    .attr('x', 0)
                    .attr('y', 3)
                    .attr('dx', 0)
                    .attr('dy', 5)
                    .attr('text-anchor', 'middle')
                    .text('')
                    .attr('style', 'font-size: 0')
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(d3_easeQuadInOut)
                    .attr('style', 'font-size: 17px');
                return g;
            }, (update) => {
                update
                    .transition()
                    .duration(TRANSITION_DURATION)
                    .ease(d3_easeQuadInOut)
                    .attr('transform', (d) => {
                    const x = this.component.xAxisScale(d.key) + bandwidth / 2;
                    let y = ANNOTATION_OFFSET;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (isIncidents) {
                        y = ANNOTATION_COMMENT_OFFSET;
                    }
                    return `translate(${x}, ${y})`;
                });
                return update;
            }, (exit) => {
                exit.select('circle').transition().duration(TRANSITION_DURATION).attr('r', 0);
                exit.select('text').transition().duration(TRANSITION_DURATION).attr('style', 'font-size: 0');
                return exit.transition().delay(TRANSITION_DELAY).remove();
            })
                .on('mouseover', (event) => {
                d3_select(event.currentTarget).classed('hovered', true);
            })
                .on('mouseout', (event) => {
                d3_select(event.currentTarget).classed('hovered', false);
            })
                .on('click', (event, data) => {
                this.annotationClicked.emit({ event, data, index: +d3_select(event.currentTarget).attr('index') });
            });
        }
        // hilight
        if (this.annotationsHilight) {
            this.updateHilight();
        }
        this.component.svg.selectAll('.mouseover-bar').classed('pbds-annotation-add', true);
    }
    updateHilight() {
        const opacity = this.hilightBox.attr('opacity');
        const duration = opacity === 0 ? 0 : 300;
        this.hilightBox
            .transition()
            .duration(duration)
            .ease(d3_easeQuadInOut)
            .attr('transform', () => {
            const x = this.component.xAxisScale(this.annotationsHilight);
            const y = 0;
            return `translate(${x}, ${y})`;
        })
            .transition()
            .duration(200)
            .attr('opacity', 1);
    }
}
PbdsBarStackedAnnotationsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsBarStackedAnnotationsDirective, deps: [{ token: forwardRef(() => PbdsDatavizBarStackedComponent) }], target: i0.ɵɵFactoryTarget.Directive });
PbdsBarStackedAnnotationsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.4", type: PbdsBarStackedAnnotationsDirective, selector: "pbds-dataviz-bar-stacked[annotations]", inputs: { annotations: "annotations", annotationsHilight: "annotationsHilight" }, outputs: { annotationClicked: "annotationClicked" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsBarStackedAnnotationsDirective, decorators: [{
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
            }], annotationsHilight: [{
                type: Input,
                args: ['annotationsHilight']
            }], annotationClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1iYXItc3RhY2tlZC1hbm5vdGF0aW9ucy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei1iYXItc3RhY2tlZC1hbm5vdGF0aW9ucy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLElBQUksZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFNUQsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7O0FBRWpGLE1BQU0scUJBQXFCLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDOUIsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUN0QyxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQztBQUNqQyxNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUs3QixNQUFNLE9BQU8sa0NBQWtDO0lBVTdDLFlBQThFLFNBQVM7UUFBVCxjQUFTLEdBQVQsU0FBUyxDQUFBO1FBUDFELHVCQUFrQixHQUFHLElBQUksQ0FBQztRQUU3QyxzQkFBaUIsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQU1sRSxTQUFTLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDO0lBQzlDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJ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LENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFWixPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ2pDLENBQUMsQ0FBQzthQUNELFVBQVUsRUFBRTthQUNaLFFBQVEsQ0FBQyxHQUFHLENBQUM7YUFDYixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7OytIQTFPVSxrQ0FBa0Msa0JBVXpCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQzttSEFWekQsa0NBQWtDOzJGQUFsQyxrQ0FBa0M7a0JBSDlDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHVDQUF1QztpQkFDbEQ7OzBCQVdjLE1BQU07MkJBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLDhCQUE4QixDQUFDOzRDQVQ5QyxXQUFXO3NCQUFoQyxLQUFLO3VCQUFDLGFBQWE7Z0JBRVMsa0JBQWtCO3NCQUE5QyxLQUFLO3VCQUFDLG9CQUFvQjtnQkFFakIsaUJBQWlCO3NCQUExQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgZWFzZVF1YWRJbk91dCBhcyBkM19lYXNlUXVhZEluT3V0IH0gZnJvbSAnZDMtZWFzZSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQnO1xuXG5jb25zdCBBTk5PVEFUSU9OX01BUkdJTl9UT1AgPSA2MjtcbmNvbnN0IEFOTk9UQVRJT05fT0ZGU0VUID0gLTIyO1xuY29uc3QgQU5OT1RBVElPTl9DT01NRU5UX09GRlNFVCA9IC00NztcbmNvbnN0IFRSQU5TSVRJT05fRFVSQVRJT04gPSAxMDAwO1xuY29uc3QgVFJBTlNJVElPTl9ERUxBWSA9IDUwMDtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRhdml6LWJhci1zdGFja2VkW2Fubm90YXRpb25zXSdcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0JhclN0YWNrZWRBbm5vdGF0aW9uc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCdhbm5vdGF0aW9ucycpIGFubm90YXRpb25zO1xuXG4gIEBJbnB1dCgnYW5ub3RhdGlvbnNIaWxpZ2h0JykgYW5ub3RhdGlvbnNIaWxpZ2h0ID0gbnVsbDtcblxuICBAT3V0cHV0KCkgYW5ub3RhdGlvbkNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgYW5ub3RhdGlvbnNHcm91cDtcbiAgcHJpdmF0ZSBoaWxpZ2h0Qm94O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBQYmRzRGF0YXZpekJhclN0YWNrZWRDb21wb25lbnQpKSBwcml2YXRlIGNvbXBvbmVudCkge1xuICAgIGNvbXBvbmVudC5tYXJnaW5Ub3AgPSBBTk5PVEFUSU9OX01BUkdJTl9UT1A7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmFubm90YXRpb25zR3JvdXAgPSB0aGlzLmNvbXBvbmVudC5zdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnYW5ub3RhdGlvbnMnKTtcblxuICAgIHRoaXMuaGlsaWdodEJveCA9IHRoaXMuYW5ub3RhdGlvbnNHcm91cFxuICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAuY2xhc3NlZCgnYW5ub3RhdGlvbnMtaGlsaWdodCcsIHRydWUpXG4gICAgICAuYXR0cignb3BhY2l0eScsIDApXG4gICAgICAuYXR0cignd2lkdGgnLCB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuY29tcG9uZW50LmhlaWdodClcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7MH0sICR7MH0pYCk7XG5cbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzICYmIGNoYW5nZXMuYW5ub3RhdGlvbnNIaWxpZ2h0ICYmICFjaGFuZ2VzLmFubm90YXRpb25zSGlsaWdodC5maXJzdENoYW5nZSkge1xuICAgICAgaWYgKGNoYW5nZXMuYW5ub3RhdGlvbnNIaWxpZ2h0LmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUhpbGlnaHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlsaWdodEJveC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKS5hdHRyKCdvcGFjaXR5JywgMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuYW5ub3RhdGlvbnMgJiYgIWNoYW5nZXMuYW5ub3RhdGlvbnMuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGUoKSB7XG4gICAgY29uc3QgaXNBbm90YXRpb25zID0gdGhpcy5hbm5vdGF0aW9ucztcbiAgICBjb25zdCBpc0luY2lkZW50cyA9IHRoaXMuYW5ub3RhdGlvbnM/LmluY2lkZW50cz8ubGVuZ3RoID4gMDtcbiAgICBjb25zdCBpc0NvbW1lbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uY29tbWVudHM/Lmxlbmd0aCA+IDA7XG5cbiAgICBpZiAoaXNBbm90YXRpb25zICYmIGlzSW5jaWRlbnRzKSB7XG4gICAgICBjb25zdCBiYW5kd2lkdGggPSB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlLmJhbmR3aWR0aCgpO1xuXG4gICAgICB0aGlzLmFubm90YXRpb25zR3JvdXBcbiAgICAgICAgLnNlbGVjdEFsbCgnZy5pbmNpZGVudCcpXG4gICAgICAgIC5kYXRhKHRoaXMuYW5ub3RhdGlvbnMuaW5jaWRlbnRzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGcgPSBlbnRlci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdpbmNpZGVudCcpO1xuXG4gICAgICAgICAgICBnLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQua2V5KSArIGJhbmR3aWR0aCAvIDI7XG4gICAgICAgICAgICAgIGNvbnN0IHkgPSBBTk5PVEFUSU9OX09GRlNFVDtcblxuICAgICAgICAgICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3h9LCAke3l9KWA7XG4gICAgICAgICAgICB9KS5hdHRyKCdpbmRleCcsIChkLCBpKSA9PiBpKTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAgIC5hdHRyKCdyJywgMClcbiAgICAgICAgICAgICAgLmF0dHIoJ2N4JywgMClcbiAgICAgICAgICAgICAgLmF0dHIoJ2N5JywgMClcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oVFJBTlNJVElPTl9EVVJBVElPTilcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ3InLCAxNSk7XG5cbiAgICAgICAgICAgIGcuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKVxuICAgICAgICAgICAgICAuYXR0cigneScsIDApXG4gICAgICAgICAgICAgIC5hdHRyKCdkeCcsIDEpXG4gICAgICAgICAgICAgIC5hdHRyKCdkeScsIDkpXG4gICAgICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAgICAgICAudGV4dCgoZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkLmljb24gfHwgJ+6pgSc7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKCdzdHlsZScsICdmb250LXNpemU6IDAnKVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbihUUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cignc3R5bGUnLCAnZm9udC1zaXplOiAxN3B4Jyk7XG5cbiAgICAgICAgICAgIHJldHVybiBnO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgdXBkYXRlXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKFRSQU5TSVRJT05fRFVSQVRJT04pXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQua2V5KSArIGJhbmR3aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IEFOTk9UQVRJT05fT0ZGU0VUO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt4fSwgJHt5fSlgO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIChleGl0KSA9PiB7XG4gICAgICAgICAgICBleGl0LnNlbGVjdCgnY2lyY2xlJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKFRSQU5TSVRJT05fRFVSQVRJT04pLmF0dHIoJ3InLCAwKTtcblxuICAgICAgICAgICAgZXhpdC5zZWxlY3QoJ3RleHQnKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oVFJBTlNJVElPTl9EVVJBVElPTikuYXR0cignc3R5bGUnLCAnZm9udC1zaXplOiAwJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBleGl0LnRyYW5zaXRpb24oKS5kZWxheShUUkFOU0lUSU9OX0RFTEFZKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBkM19zZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCkuY2xhc3NlZCgnaG92ZXJlZCcsIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgICAgZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsYXNzZWQoJ2hvdmVyZWQnLCBmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5jaWRlbnQgY2xpY2tlZCcsIHRoaXMuaW5kZXguZ2V0KGV2ZW50LmN1cnJlbnRUYXJnZXQubm9kZSkpO1xuICAgICAgICAgIHRoaXMuYW5ub3RhdGlvbkNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhLCBpbmRleDogK2QzX3NlbGVjdChldmVudC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdpbmRleCcpIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoaXNBbm90YXRpb25zICYmIGlzQ29tbWVudHMpIHtcbiAgICAgIGNvbnN0IGJhbmR3aWR0aCA9IHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUuYmFuZHdpZHRoKCk7XG5cbiAgICAgIHRoaXMuYW5ub3RhdGlvbnNHcm91cFxuICAgICAgICAuc2VsZWN0QWxsKCdnLmNvbW1lbnQnKVxuICAgICAgICAuZGF0YSh0aGlzLmFubm90YXRpb25zLmNvbW1lbnRzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGcgPSBlbnRlci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdjb21tZW50Jyk7XG5cbiAgICAgICAgICAgIGcuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUoZC5rZXkpICsgYmFuZHdpZHRoIC8gMjtcbiAgICAgICAgICAgICAgbGV0IHkgPSBBTk5PVEFUSU9OX09GRlNFVDtcbiAgICAgICAgICAgICAgY29uc3QgaXNJbmNpZGVudHMgPSB0aGlzLmFubm90YXRpb25zPy5pbmNpZGVudHM/LnNvbWUoKGluY2lkZW50KSA9PiBpbmNpZGVudC5rZXkgPT09IGQua2V5KTtcblxuICAgICAgICAgICAgICBpZiAoaXNJbmNpZGVudHMpIHtcbiAgICAgICAgICAgICAgICB5ID0gQU5OT1RBVElPTl9DT01NRU5UX09GRlNFVDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7eH0sICR7eX0pYDtcbiAgICAgICAgICAgIH0pLmF0dHIoJ2luZGV4JywgKGQsIGkpID0+IGkpO1xuXG4gICAgICAgICAgICBnLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3InLCAwKVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAwKVxuICAgICAgICAgICAgICAuYXR0cignY3knLCAwKVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbihUUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cigncicsIDE1KTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIDApXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgMylcbiAgICAgICAgICAgICAgLmF0dHIoJ2R4JywgMClcbiAgICAgICAgICAgICAgLmF0dHIoJ2R5JywgNSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgICAgIC50ZXh0KCfuqrwnKVxuICAgICAgICAgICAgICAuYXR0cignc3R5bGUnLCAnZm9udC1zaXplOiAwJylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oVFJBTlNJVElPTl9EVVJBVElPTilcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMTdweCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZztcbiAgICAgICAgICB9LFxuICAgICAgICAgICh1cGRhdGUpID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbihUUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkLmtleSkgKyBiYW5kd2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIGxldCB5ID0gQU5OT1RBVElPTl9PRkZTRVQ7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNJbmNpZGVudHMgPSB0aGlzLmFubm90YXRpb25zPy5pbmNpZGVudHM/LnNvbWUoKGluY2lkZW50KSA9PiBpbmNpZGVudC5rZXkgPT09IGQua2V5KTtcblxuICAgICAgICAgICAgICAgIGlmIChpc0luY2lkZW50cykge1xuICAgICAgICAgICAgICAgICAgeSA9IEFOTk9UQVRJT05fQ09NTUVOVF9PRkZTRVQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt4fSwgJHt5fSlgO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIChleGl0KSA9PiB7XG4gICAgICAgICAgICBleGl0LnNlbGVjdCgnY2lyY2xlJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKFRSQU5TSVRJT05fRFVSQVRJT04pLmF0dHIoJ3InLCAwKTtcblxuICAgICAgICAgICAgZXhpdC5zZWxlY3QoJ3RleHQnKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oVFJBTlNJVElPTl9EVVJBVElPTikuYXR0cignc3R5bGUnLCAnZm9udC1zaXplOiAwJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBleGl0LnRyYW5zaXRpb24oKS5kZWxheShUUkFOU0lUSU9OX0RFTEFZKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICBkM19zZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCkuY2xhc3NlZCgnaG92ZXJlZCcsIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsYXNzZWQoJ2hvdmVyZWQnLCBmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLmFubm90YXRpb25DbGlja2VkLmVtaXQoeyBldmVudCwgZGF0YSwgaW5kZXg6ICtkM19zZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCkuYXR0cignaW5kZXgnKSB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gaGlsaWdodFxuICAgIGlmICh0aGlzLmFubm90YXRpb25zSGlsaWdodCkge1xuICAgICAgdGhpcy51cGRhdGVIaWxpZ2h0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb21wb25lbnQuc3ZnLnNlbGVjdEFsbCgnLm1vdXNlb3Zlci1iYXInKS5jbGFzc2VkKCdwYmRzLWFubm90YXRpb24tYWRkJywgdHJ1ZSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUhpbGlnaHQoKSB7XG4gICAgY29uc3Qgb3BhY2l0eSA9IHRoaXMuaGlsaWdodEJveC5hdHRyKCdvcGFjaXR5Jyk7XG5cbiAgICBjb25zdCBkdXJhdGlvbiA9IG9wYWNpdHkgPT09IDAgPyAwIDogMzAwO1xuXG4gICAgdGhpcy5oaWxpZ2h0Qm94XG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICgpID0+IHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUodGhpcy5hbm5vdGF0aW9uc0hpbGlnaHQpO1xuICAgICAgICBjb25zdCB5ID0gMDtcblxuICAgICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3h9LCAke3l9KWA7XG4gICAgICB9KVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKDIwMClcbiAgICAgIC5hdHRyKCdvcGFjaXR5JywgMSk7XG4gIH1cbn1cbiJdfQ==
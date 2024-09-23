import { Directive, EventEmitter, forwardRef, Inject, Input, Output } from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { isoParse as d3_isoParse } from 'd3-time-format';
import { easeQuadInOut as d3_easeQuadInOut } from 'd3-ease';
import { PbdsDatavizLineComponent } from './dataviz-line.component';
import * as i0 from "@angular/core";
const ANNOTATION_MARGIN_TOP = 62;
const ANNOTATION_OFFSET = -22;
const ANNOTATION_COMMENT_OFFSET = -47;
const ANNOTATION_WIDTH = 26;
const TRANSITION_DURATION = 1000;
const TRANSITION_DELAY = 500;
export class PbdsLineAnnotationsDirective {
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
            .attr('width', ANNOTATION_WIDTH)
            .attr('height', this.component.height)
            .attr('transform', `translate(${ANNOTATION_WIDTH / 2}, ${0})`);
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
            this.annotationsGroup
                .selectAll('g.incident')
                .data(this.annotations.incidents)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'incident');
                g.attr('transform', (d, i) => {
                    let x;
                    const y = ANNOTATION_OFFSET;
                    if (this.component.xAxisType === 'date') {
                        x = this.component.xAxisScale(d3_isoParse(d.key));
                    }
                    else {
                        x = this.component.xAxisScale(d.key);
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
                    let x;
                    const y = ANNOTATION_OFFSET;
                    if (this.component.xAxisType === 'date') {
                        x = this.component.xAxisScale(d3_isoParse(d.key));
                    }
                    else {
                        x = this.component.xAxisScale(d.key);
                    }
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
            this.annotationsGroup
                .selectAll('g.comment')
                .data(this.annotations.comments)
                .join((enter) => {
                const g = enter.append('g').attr('class', 'comment');
                g.attr('transform', (d) => {
                    let x;
                    let y = ANNOTATION_OFFSET;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (this.component.xAxisType === 'date') {
                        x = this.component.xAxisScale(d3_isoParse(d.key));
                    }
                    else {
                        x = this.component.xAxisScale(d.key);
                    }
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
                    let x;
                    let y = ANNOTATION_OFFSET;
                    const isIncidents = this.annotations?.incidents?.some((incident) => incident.key === d.key);
                    if (this.component.xAxisType === 'date') {
                        x = this.component.xAxisScale(d3_isoParse(d.key));
                    }
                    else {
                        x = this.component.xAxisScale(d.key);
                    }
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
        this.component.svg.selectAll('.mouserect').classed('pbds-annotation-add', true);
    }
    updateHilight() {
        const opacity = this.hilightBox.attr('opacity');
        const duration = opacity === 0 ? 0 : 300;
        const xAxisType = this.component.xAxisType;
        this.hilightBox
            .transition()
            .duration(duration)
            .ease(d3_easeQuadInOut)
            .attr('transform', () => {
            let x = 0;
            const y = 0;
            if (xAxisType === 'date') {
                x = this.component.xAxisScale(d3_isoParse(this.annotationsHilight));
            }
            else {
                x = this.component.xAxisScale(this.annotationsHilight);
            }
            return `translate(${x - ANNOTATION_WIDTH / 2}, ${y})`;
        })
            .transition()
            .duration(200)
            .attr('opacity', 1);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsLineAnnotationsDirective, deps: [{ token: forwardRef(() => PbdsDatavizLineComponent) }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: PbdsLineAnnotationsDirective, selector: "pbds-dataviz-line[annotations]", inputs: { annotations: "annotations", annotationsHilight: "annotationsHilight" }, outputs: { annotationClicked: "annotationClicked" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsLineAnnotationsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'pbds-dataviz-line[annotations]'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => PbdsDatavizLineComponent)]
                }] }]; }, propDecorators: { annotations: [{
                type: Input,
                args: ['annotations']
            }], annotationsHilight: [{
                type: Input,
                args: ['annotationsHilight']
            }], annotationClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei1saW5lLWFubm90YXRpb25zLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0YXZpei9kYXRhdml6LWxpbmUtYW5ub3RhdGlvbnMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUdMLE1BQU0sRUFFUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsTUFBTSxJQUFJLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsUUFBUSxJQUFJLFdBQVcsRUFBMEQsTUFBTSxnQkFBZ0IsQ0FBQztBQUVqSCxPQUFPLEVBQUUsYUFBYSxJQUFJLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRTVELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOztBQUVwRSxNQUFNLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztBQUNqQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDO0FBQzlCLE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDdEMsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDNUIsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFDakMsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7QUFLN0IsTUFBTSxPQUFPLDRCQUE0QjtJQVV2QyxZQUF3RSxTQUFTO1FBQVQsY0FBUyxHQUFULFNBQVMsQ0FBQTtRQVBwRCx1QkFBa0IsR0FBRyxJQUFJLENBQUM7UUFFN0Msc0JBQWlCLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFNbEUsU0FBUyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztJQUM5QyxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUks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QUM7YUFDYixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7K0dBblFVLDRCQUE0QixrQkFVbkIsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixDQUFDO21HQVZuRCw0QkFBNEI7OzRGQUE1Qiw0QkFBNEI7a0JBSHhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdDQUFnQztpQkFDM0M7OzBCQVdjLE1BQU07MkJBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixDQUFDOzRDQVR4QyxXQUFXO3NCQUFoQyxLQUFLO3VCQUFDLGFBQWE7Z0JBRVMsa0JBQWtCO3NCQUE5QyxLQUFLO3VCQUFDLG9CQUFvQjtnQkFFakIsaUJBQWlCO3NCQUExQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHNlbGVjdCBhcyBkM19zZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgaXNvUGFyc2UgYXMgZDNfaXNvUGFyc2UsIGlzb0Zvcm1hdCBhcyBkM19pc29Gb3JtYXQsIHRpbWVGb3JtYXQgYXMgZDNfdGltZUZvcm1hdCB9IGZyb20gJ2QzLXRpbWUtZm9ybWF0JztcblxuaW1wb3J0IHsgZWFzZVF1YWRJbk91dCBhcyBkM19lYXNlUXVhZEluT3V0IH0gZnJvbSAnZDMtZWFzZSc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1saW5lLmNvbXBvbmVudCc7XG5cbmNvbnN0IEFOTk9UQVRJT05fTUFSR0lOX1RPUCA9IDYyO1xuY29uc3QgQU5OT1RBVElPTl9PRkZTRVQgPSAtMjI7XG5jb25zdCBBTk5PVEFUSU9OX0NPTU1FTlRfT0ZGU0VUID0gLTQ3O1xuY29uc3QgQU5OT1RBVElPTl9XSURUSCA9IDI2O1xuY29uc3QgVFJBTlNJVElPTl9EVVJBVElPTiA9IDEwMDA7XG5jb25zdCBUUkFOU0lUSU9OX0RFTEFZID0gNTAwO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGF2aXotbGluZVthbm5vdGF0aW9uc10nXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNMaW5lQW5ub3RhdGlvbnNEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgnYW5ub3RhdGlvbnMnKSBhbm5vdGF0aW9ucztcblxuICBASW5wdXQoJ2Fubm90YXRpb25zSGlsaWdodCcpIGFubm90YXRpb25zSGlsaWdodCA9IG51bGw7XG5cbiAgQE91dHB1dCgpIGFubm90YXRpb25DbGlja2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIGFubm90YXRpb25zR3JvdXA7XG4gIHByaXZhdGUgaGlsaWdodEJveDtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gUGJkc0RhdGF2aXpMaW5lQ29tcG9uZW50KSkgcHJpdmF0ZSBjb21wb25lbnQpIHtcbiAgICBjb21wb25lbnQubWFyZ2luVG9wID0gQU5OT1RBVElPTl9NQVJHSU5fVE9QO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5hbm5vdGF0aW9uc0dyb3VwID0gdGhpcy5jb21wb25lbnQuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2Fubm90YXRpb25zJyk7XG5cbiAgICB0aGlzLmhpbGlnaHRCb3ggPSB0aGlzLmFubm90YXRpb25zR3JvdXBcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmNsYXNzZWQoJ2Fubm90YXRpb25zLWhpbGlnaHQnLCB0cnVlKVxuICAgICAgLmF0dHIoJ29wYWNpdHknLCAwKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgQU5OT1RBVElPTl9XSURUSClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmNvbXBvbmVudC5oZWlnaHQpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke0FOTk9UQVRJT05fV0lEVEggLyAyfSwgJHswfSlgKTtcblxuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMgJiYgY2hhbmdlcy5hbm5vdGF0aW9uc0hpbGlnaHQgJiYgIWNoYW5nZXMuYW5ub3RhdGlvbnNIaWxpZ2h0LmZpcnN0Q2hhbmdlKSB7XG4gICAgICBpZiAoY2hhbmdlcy5hbm5vdGF0aW9uc0hpbGlnaHQuY3VycmVudFZhbHVlKSB7XG4gICAgICAgIHRoaXMudXBkYXRlSGlsaWdodCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWxpZ2h0Qm94LnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDApLmF0dHIoJ29wYWNpdHknLCAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5hbm5vdGF0aW9ucyAmJiAhY2hhbmdlcy5hbm5vdGF0aW9ucy5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZSgpIHtcbiAgICBjb25zdCBpc0Fub3RhdGlvbnMgPSB0aGlzLmFubm90YXRpb25zO1xuICAgIGNvbnN0IGlzSW5jaWRlbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uaW5jaWRlbnRzPy5sZW5ndGggPiAwO1xuICAgIGNvbnN0IGlzQ29tbWVudHMgPSB0aGlzLmFubm90YXRpb25zPy5jb21tZW50cz8ubGVuZ3RoID4gMDtcblxuICAgIGlmIChpc0Fub3RhdGlvbnMgJiYgaXNJbmNpZGVudHMpIHtcbiAgICAgIHRoaXMuYW5ub3RhdGlvbnNHcm91cFxuICAgICAgICAuc2VsZWN0QWxsKCdnLmluY2lkZW50JylcbiAgICAgICAgLmRhdGEodGhpcy5hbm5vdGF0aW9ucy5pbmNpZGVudHMpXG4gICAgICAgIC5qb2luKFxuICAgICAgICAgIChlbnRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZyA9IGVudGVyLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2luY2lkZW50Jyk7XG5cbiAgICAgICAgICAgIGcuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgbGV0IHg7XG4gICAgICAgICAgICAgIGNvbnN0IHkgPSBBTk5PVEFUSU9OX09GRlNFVDtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnQueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkM19pc29QYXJzZShkLmtleSkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHggPSB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQua2V5KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7eH0sICR7eX0pYDtcbiAgICAgICAgICAgIH0pLmF0dHIoJ2luZGV4JywgKGQsIGkpID0+IGkpO1xuXG4gICAgICAgICAgICBnLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3InLCAwKVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAwKVxuICAgICAgICAgICAgICAuYXR0cignY3knLCAwKVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbihUUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cigncicsIDE1KTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIDApXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgMClcbiAgICAgICAgICAgICAgLmF0dHIoJ2R4JywgMSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2R5JywgOSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgICAgIC50ZXh0KChkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQuaWNvbiB8fCAn7qmBJztcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMCcpXG4gICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgLmR1cmF0aW9uKFRSQU5TSVRJT05fRFVSQVRJT04pXG4gICAgICAgICAgICAgIC5lYXNlKGQzX2Vhc2VRdWFkSW5PdXQpXG4gICAgICAgICAgICAgIC5hdHRyKCdzdHlsZScsICdmb250LXNpemU6IDE3cHgnKTtcblxuICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oVFJBTlNJVElPTl9EVVJBVElPTilcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHg7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IEFOTk9UQVRJT05fT0ZGU0VUO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50LnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICAgICAgICAgICAgICB4ID0gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkM19pc29QYXJzZShkLmtleSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB4ID0gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkLmtleSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt4fSwgJHt5fSlgO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4ge1xuICAgICAgICAgICAgZXhpdC5zZWxlY3QoJ2NpcmNsZScpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihUUkFOU0lUSU9OX0RVUkFUSU9OKS5hdHRyKCdyJywgMCk7XG4gICAgICAgICAgICBleGl0LnNlbGVjdCgndGV4dCcpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihUUkFOU0lUSU9OX0RVUkFUSU9OKS5hdHRyKCdzdHlsZScsICdmb250LXNpemU6IDAnKTtcbiAgICAgICAgICAgIHJldHVybiBleGl0LnRyYW5zaXRpb24oKS5kZWxheShUUkFOU0lUSU9OX0RFTEFZKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICBkM19zZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCkuY2xhc3NlZCgnaG92ZXJlZCcsIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlb3V0JywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgICAgZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsYXNzZWQoJ2hvdmVyZWQnLCBmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5jaWRlbnQgY2xpY2tlZCcsIHRoaXMuaW5kZXguZ2V0KGV2ZW50LmN1cnJlbnRUYXJnZXQubm9kZSkpO1xuICAgICAgICAgIHRoaXMuYW5ub3RhdGlvbkNsaWNrZWQuZW1pdCh7IGV2ZW50LCBkYXRhLCBpbmRleDogK2QzX3NlbGVjdChldmVudC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdpbmRleCcpIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoaXNBbm90YXRpb25zICYmIGlzQ29tbWVudHMpIHtcbiAgICAgIHRoaXMuYW5ub3RhdGlvbnNHcm91cFxuICAgICAgICAuc2VsZWN0QWxsKCdnLmNvbW1lbnQnKVxuICAgICAgICAuZGF0YSh0aGlzLmFubm90YXRpb25zLmNvbW1lbnRzKVxuICAgICAgICAuam9pbihcbiAgICAgICAgICAoZW50ZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGcgPSBlbnRlci5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdjb21tZW50Jyk7XG5cbiAgICAgICAgICAgIGcuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IHtcbiAgICAgICAgICAgICAgbGV0IHg7XG4gICAgICAgICAgICAgIGxldCB5ID0gQU5OT1RBVElPTl9PRkZTRVQ7XG4gICAgICAgICAgICAgIGNvbnN0IGlzSW5jaWRlbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uaW5jaWRlbnRzPy5zb21lKChpbmNpZGVudCkgPT4gaW5jaWRlbnQua2V5ID09PSBkLmtleSk7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50LnhBeGlzVHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICAgICAgICAgICAgeCA9IHRoaXMuY29tcG9uZW50LnhBeGlzU2NhbGUoZDNfaXNvUGFyc2UoZC5rZXkpKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkLmtleSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoaXNJbmNpZGVudHMpIHtcbiAgICAgICAgICAgICAgICB5ID0gQU5OT1RBVElPTl9DT01NRU5UX09GRlNFVDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7eH0sICR7eX0pYDtcbiAgICAgICAgICAgIH0pLmF0dHIoJ2luZGV4JywgKGQsIGkpID0+IGkpO1xuXG4gICAgICAgICAgICBnLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3InLCAwKVxuICAgICAgICAgICAgICAuYXR0cignY3gnLCAwKVxuICAgICAgICAgICAgICAuYXR0cignY3knLCAwKVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbihUUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cigncicsIDE1KTtcblxuICAgICAgICAgICAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIDApXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgMylcbiAgICAgICAgICAgICAgLmF0dHIoJ2R4JywgMClcbiAgICAgICAgICAgICAgLmF0dHIoJ2R5JywgNSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgICAgIC50ZXh0KCfuqrwnKVxuICAgICAgICAgICAgICAuYXR0cignc3R5bGUnLCAnZm9udC1zaXplOiAwJylcbiAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZHVyYXRpb24oVFJBTlNJVElPTl9EVVJBVElPTilcbiAgICAgICAgICAgICAgLmVhc2UoZDNfZWFzZVF1YWRJbk91dClcbiAgICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMTdweCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZztcbiAgICAgICAgICB9LFxuICAgICAgICAgICh1cGRhdGUpID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgIC5kdXJhdGlvbihUUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgICAgICAgICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgeDtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IEFOTk9UQVRJT05fT0ZGU0VUO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzSW5jaWRlbnRzID0gdGhpcy5hbm5vdGF0aW9ucz8uaW5jaWRlbnRzPy5zb21lKChpbmNpZGVudCkgPT4gaW5jaWRlbnQua2V5ID09PSBkLmtleSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnQueEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICAgICAgICAgIHggPSB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQzX2lzb1BhcnNlKGQua2V5KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHggPSB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKGQua2V5KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNJbmNpZGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHkgPSBBTk5PVEFUSU9OX0NPTU1FTlRfT0ZGU0VUO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7eH0sICR7eX0pYDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXhpdCkgPT4ge1xuICAgICAgICAgICAgZXhpdC5zZWxlY3QoJ2NpcmNsZScpLnRyYW5zaXRpb24oKS5kdXJhdGlvbihUUkFOU0lUSU9OX0RVUkFUSU9OKS5hdHRyKCdyJywgMCk7XG5cbiAgICAgICAgICAgIGV4aXQuc2VsZWN0KCd0ZXh0JykudHJhbnNpdGlvbigpLmR1cmF0aW9uKFRSQU5TSVRJT05fRFVSQVRJT04pLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtc2l6ZTogMCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gZXhpdC50cmFuc2l0aW9uKCkuZGVsYXkoVFJBTlNJVElPTl9ERUxBWSkucmVtb3ZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsYXNzZWQoJ2hvdmVyZWQnLCB0cnVlKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsIChldmVudCkgPT4ge1xuICAgICAgICAgIGQzX3NlbGVjdChldmVudC5jdXJyZW50VGFyZ2V0KS5jbGFzc2VkKCdob3ZlcmVkJywgZmFsc2UpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrJywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5hbm5vdGF0aW9uQ2xpY2tlZC5lbWl0KHsgZXZlbnQsIGRhdGEsIGluZGV4OiArZDNfc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2luZGV4JykgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGhpbGlnaHRcbiAgICBpZiAodGhpcy5hbm5vdGF0aW9uc0hpbGlnaHQpIHtcbiAgICAgIHRoaXMudXBkYXRlSGlsaWdodCgpO1xuICAgIH1cblxuICAgIHRoaXMuY29tcG9uZW50LnN2Zy5zZWxlY3RBbGwoJy5tb3VzZXJlY3QnKS5jbGFzc2VkKCdwYmRzLWFubm90YXRpb24tYWRkJywgdHJ1ZSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUhpbGlnaHQoKSB7XG4gICAgY29uc3Qgb3BhY2l0eSA9IHRoaXMuaGlsaWdodEJveC5hdHRyKCdvcGFjaXR5Jyk7XG5cbiAgICBjb25zdCBkdXJhdGlvbiA9IG9wYWNpdHkgPT09IDAgPyAwIDogMzAwO1xuXG4gICAgY29uc3QgeEF4aXNUeXBlID0gdGhpcy5jb21wb25lbnQueEF4aXNUeXBlO1xuXG4gICAgdGhpcy5oaWxpZ2h0Qm94XG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAuZWFzZShkM19lYXNlUXVhZEluT3V0KVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICgpID0+IHtcbiAgICAgICAgbGV0IHggPSAwO1xuICAgICAgICBjb25zdCB5ID0gMDtcblxuICAgICAgICBpZiAoeEF4aXNUeXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICB4ID0gdGhpcy5jb21wb25lbnQueEF4aXNTY2FsZShkM19pc29QYXJzZSh0aGlzLmFubm90YXRpb25zSGlsaWdodCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHggPSB0aGlzLmNvbXBvbmVudC54QXhpc1NjYWxlKHRoaXMuYW5ub3RhdGlvbnNIaWxpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7eCAtIEFOTk9UQVRJT05fV0lEVEggLyAyfSwgJHt5fSlgO1xuICAgICAgfSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbigyMDApXG4gICAgICAuYXR0cignb3BhY2l0eScsIDEpO1xuICB9XG59XG4iXX0=
import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PbdsBarGroupedAnnotationsDirective implements OnInit, OnChanges {
    private component;
    annotations: any;
    annotationClicked: EventEmitter<any>;
    private annotationsGroup;
    constructor(component: any);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private update;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsBarGroupedAnnotationsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PbdsBarGroupedAnnotationsDirective, "pbds-dataviz-bar-grouped[annotations]", never, { "annotations": "annotations"; }, { "annotationClicked": "annotationClicked"; }, never>;
}

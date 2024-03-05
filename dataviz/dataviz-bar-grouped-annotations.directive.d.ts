import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PbdsBarGroupedAnnotationsDirective implements OnInit, OnChanges {
    private component;
    annotations: any;
    annotationsHilight: any;
    annotationClicked: EventEmitter<any>;
    private annotationsGroup;
    private hilightBox;
    constructor(component: any);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private update;
    private updateHilight;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsBarGroupedAnnotationsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PbdsBarGroupedAnnotationsDirective, "pbds-dataviz-bar-grouped[annotations]", never, { "annotations": "annotations"; "annotationsHilight": "annotationsHilight"; }, { "annotationClicked": "annotationClicked"; }, never, never, false, never>;
}

import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PbdsBarStackedAnnotationsDirective implements OnInit, OnChanges {
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
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsBarStackedAnnotationsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PbdsBarStackedAnnotationsDirective, "pbds-dataviz-bar-stacked[annotations]", never, { "annotations": { "alias": "annotations"; "required": false; }; "annotationsHilight": { "alias": "annotationsHilight"; "required": false; }; }, { "annotationClicked": "annotationClicked"; }, never, never, false, never>;
}

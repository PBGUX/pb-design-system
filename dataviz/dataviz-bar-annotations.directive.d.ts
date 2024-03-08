import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PbdsBarAnnotationsDirective implements OnInit, OnChanges {
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
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsBarAnnotationsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PbdsBarAnnotationsDirective, "pbds-dataviz-bar[annotations]", never, { "annotations": "annotations"; "annotationsHilight": "annotationsHilight"; }, { "annotationClicked": "annotationClicked"; }, never, never, false, never>;
}

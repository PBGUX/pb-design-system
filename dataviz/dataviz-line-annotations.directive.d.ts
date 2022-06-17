import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PbdsLineAnnotationsDirective implements OnInit, OnChanges {
    private component;
    annotations: any;
    annotationClicked: EventEmitter<any>;
    private annotationsGroup;
    constructor(component: any);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private update;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsLineAnnotationsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PbdsLineAnnotationsDirective, "pbds-dataviz-line[annotations]", never, { "annotations": "annotations"; }, { "annotationClicked": "annotationClicked"; }, never>;
}

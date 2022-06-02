import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PbdsBarAnnotationsDirective implements OnInit {
    private component;
    annotations: any;
    onAnnotationClick: EventEmitter<any>;
    private annotationsGroup;
    constructor(component: any);
    ngOnInit(): void;
    private update;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsBarAnnotationsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PbdsBarAnnotationsDirective, "pbds-dataviz-bar[annotations]", never, { "annotations": "annotations"; }, { "onAnnotationClick": "on-annotation-click"; }, never>;
}

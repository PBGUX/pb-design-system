import { AfterContentInit, OnInit, Renderer2 } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as i0 from "@angular/core";
export declare class PbdsA11yWidgetComponent implements OnInit, AfterContentInit {
    private modalService;
    private fb;
    private document;
    private renderer;
    constructor(modalService: NgbModal, fb: UntypedFormBuilder, document: Document, renderer: Renderer2);
    form: import("@angular/forms").UntypedFormGroup;
    fontBrandRegular: string;
    fontBrandBold: string;
    fontBrandLight: string;
    fontSans: string;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    resetFonts(): void;
    reduceSaturation(): void;
    increaseSaturation(): void;
    toggleVisionOptions(event: MatSlideToggleChange): void;
    toggleCognitiveOptions(event: MatSlideToggleChange): void;
    toggleLimitDistrations(event: MatSlideToggleChange): void;
    openA11yWidget(event: MouseEvent, a11yWidget: NgbModal): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsA11yWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsA11yWidgetComponent, "pbds-a11y-widget", never, {}, {}, never, never, false, never>;
}

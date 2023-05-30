import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Component, Inject, NgModule } from '@angular/core';
import * as i1 from '@ng-bootstrap/ng-bootstrap';
import * as i2 from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i3 from '@angular/material/slide-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

class PbdsA11yWidgetComponent {
    constructor(modalService, fb, document, renderer) {
        this.modalService = modalService;
        this.fb = fb;
        this.document = document;
        this.renderer = renderer;
        this.form = this.fb.group({
            animation: [false],
            darkMode: [false],
            dyslexia: [false],
            fontSize: [14],
            highSaturation: [false],
            legibleFont: [false],
            lineHeight: [1.5],
            lowContrast: [false],
            showHeadings: [false],
            showLinks: [false],
            textContrast: [false],
            zoom: [1],
            vision: [false],
        });
        this.fontBrandRegular = '"PrecisionSans_W_Rg", "Helvetica Neue", Arial, sans-serif';
        this.fontBrandBold = '"PrecisionSans_W_Bd", "Helvetica Neue", Arial, sans-serif';
        this.fontBrandLight = '"PrecisionSans_W_Lt", "Helvetica Neue", Arial, sans-serif';
        this.fontSans = '"Helvetica Neue", Helvetica, Arial, sans-serif';
    }
    ngOnInit() { }
    ngAfterContentInit() {
        this.form.valueChanges.subscribe((value) => {
            if (value.fontSize) {
                this.document.documentElement.style.setProperty('--font_size_base', `${value.fontSize}px`);
            }
            if (value.lineHeight) {
                this.document.documentElement.style.setProperty('--line_height', value.lineHeight);
            }
            if (value.zoom) {
                this.document.documentElement.style.setProperty('--zoom', value.zoom);
            }
            if (value.textContrast) {
                this.document.documentElement.style.setProperty('--text', 'black');
                this.renderer.addClass(this.document.body, 'bgwhite');
            }
            else {
                this.document.documentElement.style.setProperty('--text', 'var(--rich500)');
                this.renderer.removeClass(this.document.body, 'bgwhite');
            }
            if (value.showHeadings) {
                this.renderer.addClass(this.document.body, 'show-headings');
            }
            else {
                this.renderer.removeClass(this.document.body, 'show-headings');
            }
            if (value.showLinks) {
                this.renderer.addClass(this.document.body, 'show-links');
            }
            else {
                this.renderer.removeClass(this.document.body, 'show-links');
            }
            if (value.darkMode) {
                this.renderer.removeClass(this.document.body, 'bgwhite');
                this.renderer.addClass(this.document.body, 'bgdark');
            }
            else {
                this.renderer.removeClass(this.document.body, 'bgdark');
            }
            if (value.legibleFont) {
                this.document.documentElement.style.setProperty('--font-family-sans-serif', 'AH');
                this.document.documentElement.style.setProperty('--font_family_brand_regular', 'AH');
                this.document.documentElement.style.setProperty('--font_family_brand_bold', 'AHB');
                this.document.documentElement.style.setProperty('--font_family_brand_light', 'AH');
            }
            else {
                this.resetFonts();
            }
            if (value.dyslexia) {
                this.document.documentElement.style.setProperty('--font-family-sans-serif', 'Dyslexic');
                this.document.documentElement.style.setProperty('--font_family_brand_regular', 'Dyslexic');
                this.document.documentElement.style.setProperty('--font_family_brand_bold', 'DyslexicBold');
                this.document.documentElement.style.setProperty('--font_family_brand_light', 'Dyslexic');
            }
            else {
                this.resetFonts();
            }
            // if (value.legibleFont) {
            //   this.renderer.addClass(this.document.body, 'hyperlegible');
            // } else {
            //   this.renderer.removeClass(this.document.body, 'hyperlegible');
            // }
            if (value.highSaturation) {
                this.renderer.addClass(this.document.body, 'high-saturation');
            }
            else {
                this.renderer.removeClass(this.document.body, 'high-saturation');
            }
        });
    }
    resetFonts() {
        this.document.documentElement.style.setProperty('--font-family-sans-serif', this.fontSans);
        this.document.documentElement.style.setProperty('--font_family_brand_regular', this.fontBrandRegular);
        this.document.documentElement.style.setProperty('--font_family_brand_bold', this.fontBrandBold);
        this.document.documentElement.style.setProperty('--font_family_brand_light', this.fontBrandLight);
    }
    reduceSaturation() { }
    increaseSaturation() { }
    toggleVisionOptions(event) {
        if (event.checked) {
            this.form.patchValue({
                textContrast: true,
                fontSize: 16,
                lineHeight: 2.0,
                legibleFont: true,
                darkMode: true,
            });
        }
        else {
            this.form.patchValue({
                textContrast: false,
                fontSize: 14,
                lineHeight: 1.5,
                legibleFont: false,
                darkMode: false,
            });
        }
    }
    toggleCognitiveOptions(event) {
        if (event.checked) {
            this.form.patchValue({
                showHeadings: true,
                showLinks: true,
                dyslexia: true,
            });
        }
        else {
            this.form.patchValue({
                showHeadings: false,
                showLinks: false,
                dyslexia: false,
            });
        }
    }
    toggleLimitDistrations(event) {
        if (event.checked) {
            this.form.patchValue({
                lowContrast: true,
                animation: true,
            });
        }
        else {
            this.form.patchValue({
                lowContrast: false,
                animation: false,
            });
        }
    }
    // checkboxVisual(event: MatCheckboxChange) {
    //   if (event.checked) {
    //     this.form.patchValue({
    //       textContrast: true,
    //       // darkMode: true,
    //       fontSize: 16,
    //       lineHeight: 2.0,
    //       legibleFont: true,
    //     });
    //   } else {
    //     this.form.patchValue({
    //       textContrast: false,
    //       darkMode: false,
    //       fontSize: 14,
    //       lineHeight: 1.5,
    //       legibleFont: false,
    //     });
    //   }
    // }
    // checkboxCognitive(event: MatCheckboxChange) {
    //   if (event.checked) {
    //     this.form.patchValue({
    //       showHeadings: true,
    //       showLinks: true,
    //     });
    //   } else {
    //     this.form.patchValue({
    //       showHeadings: false,
    //       showLinks: false,
    //     });
    //   }
    // }
    // checkboxLimitDistrations(event: MatCheckboxChange) {
    //   if (event.checked) {
    //     this.form.patchValue({
    //       lowContrast: true,
    //     });
    //   } else {
    //     this.form.patchValue({
    //       lowContrast: false,
    //     });
    //   }
    // }
    openA11yWidget(event, a11yWidget) {
        event.preventDefault();
        this.modalService.open(a11yWidget, {
            ariaLabelledBy: 'modal-basic-title',
            // backdrop: false,
            backdropClass: 'a11y-modal-backdrop',
            centered: false,
            modalDialogClass: 'a11y-widget-dialog',
            size: 'lg',
        });
    }
}
PbdsA11yWidgetComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsA11yWidgetComponent, deps: [{ token: i1.NgbModal }, { token: i2.UntypedFormBuilder }, { token: DOCUMENT }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
PbdsA11yWidgetComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsA11yWidgetComponent, selector: "pbds-a11y-widget", ngImport: i0, template: "<a class=\"nav-link\" (click)=\"openA11yWidget($event, a11yWidget)\" href=\"\" role=\"button\" aria-labelledby=\"a11y-offscreen\">\n  <i class=\"pbi-icon-outline pbi-a11y-solid d-none d-lg-inline\" aria-hidden=\"true\"></i>\n\n  <span class=\"d-lg-none\" id=\"a11y-offscreen\">\n    <i class=\"pbi-icon-mini pbi-a11y-solid\" aria-hidden=\"true\"></i>&nbsp;Accessibility Options\n  </span>\n</a>\n\n<ng-template #a11yWidget let-modal>\n  <div class=\"modal-header\">\n    <h2 class=\"modal-title visually-hidden\" id=\"a11y-modal-title\">Accessibility Options Panel</h2>\n    <button class=\"btn-close\" (click)=\"modal.dismiss()\" type=\"button\" aria-label=\"Close\"></button>\n  </div>\n  <div class=\"modal-header\"></div>\n\n  <div class=\"modal-body\">\n    <form [formGroup]=\"form\">\n      <section>\n        <!-- <mat-checkbox (change)=\"checkboxVisual($event)\">Vision</mat-checkbox> -->\n        <div class=\"section-title\">\n          <h2>Vision</h2>\n          <mat-slide-toggle\n            [color]=\"'primary'\"\n            (change)=\"toggleVisionOptions($event)\"\n            formControlName=\"vision\"\n            aria-label=\"Activate all vision options\"\n            labelPosition=\"before\"\n            >Activate all</mat-slide-toggle\n          >\n        </div>\n\n        <p>\n          Some people may find items on the page difficult to read. Here you can increase the font size, line spacing,\n          and other visual settings.\n        </p>\n\n        <div class=\"options\">\n          <div class=\"option\">\n            <p id=\"text-contrast\">Increase Text Contrast</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"textContrast\"\n              aria-labelledby=\"text-contrast\"\n            ></mat-slide-toggle>\n            <div>\n              <div class=\"sr-only\" id=\"textContrastHelp\">Change the text color to black to improve readability.</div>\n            </div>\n          </div>\n\n          <div class=\"option\">\n            <label class=\"d-block\" for=\"a11y-font-size\">Font Size ({{ form.controls.fontSize.value }} pixels)</label>\n            <input id=\"a11y-font-size\" type=\"range\" formControlName=\"fontSize\" min=\"14\" max=\"24\" step=\"1\" />\n          </div>\n          <div class=\"option\">\n            <label class=\"d-block\" for=\"line-height\">Line Spacing ({{ form.controls.lineHeight.value }}x)</label>\n            <input id=\"line-height\" type=\"range\" formControlName=\"lineHeight\" min=\"1.5\" max=\"3\" step=\"0.1\" />\n          </div>\n\n          <!-- <div class=\"option \">\n            <p id=\"legible-font\">Hyperlegible Font</p>\n            <mat-slide-toggle formControlName=\"legibleFont\" aria-labelledby=\"legible-font\" [color]=\"'primary'\"></mat-slide-toggle>\n          </div> -->\n\n          <div class=\"option\">\n            <label class=\"d-block\" for=\"zoom\">Zoom ({{ form.controls.zoom.value }}x)</label>\n            <input id=\"zoom\" type=\"range\" formControlName=\"zoom\" min=\"1\" max=\"2\" step=\"0.1\" />\n          </div>\n\n          <!-- <div class=\"option \">\n            <p id=\"high-saturation\">High Saturation</p>\n            <mat-slide-toggle formControlName=\"highSaturation\"\n                              aria-labelledby=\"high-saturation\"\n                              [color]=\"'primary'\"></mat-slide-toggle>\n          </div> -->\n\n          <div class=\"option\">\n            <p id=\"dark-mode\">Dark Mode</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"darkMode\"\n              aria-labelledby=\"dark-mode\"\n            ></mat-slide-toggle>\n          </div>\n        </div>\n      </section>\n\n      <section>\n        <!-- <mat-checkbox (change)=\"checkboxCognitive($event)\">Cognitive</mat-checkbox> -->\n        <div class=\"section-title\">\n          <h2>Cognitive</h2>\n          <mat-slide-toggle\n            [color]=\"'primary'\"\n            (change)=\"toggleCognitiveOptions($event)\"\n            formControlName=\"vision\"\n            aria-label=\"Activate all cognitive options\"\n            labelPosition=\"before\"\n            >Activate all</mat-slide-toggle\n          >\n        </div>\n\n        <p>\n          If the content on the page is hard to sort out for you, you can highlight headers, links, and even use a font\n          designed to aid people with dyslexia.\n        </p>\n\n        <div class=\"options\">\n          <div class=\"option\">\n            <p id=\"show-headings\">Show Headings</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"showHeadings\"\n              aria-label=\"show-headings\"\n            ></mat-slide-toggle>\n          </div>\n\n          <div class=\"option\">\n            <p id=\"show-links\">Show Links</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"showLinks\"\n              aria-labelledby=\"show-links\"\n            ></mat-slide-toggle>\n          </div>\n\n          <div class=\"option\">\n            <p id=\"dyslexia\">Dyslexia-friendly font</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"dyslexia\"\n              aria-labelledby=\"dyslexia\"\n            ></mat-slide-toggle>\n          </div>\n        </div>\n      </section>\n\n      <!-- <section>\n\n        <div class=\"section-title\">\n          <h2>Seizures</h2>\n          <mat-slide-toggle formControlName=\"vision\"\n                            aria-label=\"Activate all limit distractions options\"\n                            [color]=\"'primary'\"\n                            (change)=\"toggleLimitDistrations($event)\"\n                            labelPosition=\"before\">Activate all </mat-slide-toggle>\n        </div>\n\n        <p>Some people might find animations or bright color contrast distracting or annoying.</p>\n\n        <div class=\"options\">\n          <div class=\"option\">\n            <p id=\"low-contrast\">Reduce Saturation</p>\n            <mat-slide-toggle formControlName=\"lowContrast\"\n                              aria-labelledby=\"low-contrast\"\n                              [color]=\"'primary'\"></mat-slide-toggle>\n          </div>\n          <div class=\"option\">\n            <p id=\"animation\">Stop Animations</p>\n            <mat-slide-toggle formControlName=\"animation\"\n                              aria-labelledby=\"animation\"\n                              [color]=\"'primary'\"></mat-slide-toggle>\n          </div>\n        </div>\n      </section> -->\n    </form>\n  </div>\n  <!-- <div class=\"modal-footer\">\n    <button\n      type=\"button\"\n      class=\"btn btn-outline-dark\"\n      (click)=\"modal.close()\"\n    >Done</button>\n  </div> -->\n</ng-template>\n", dependencies: [{ kind: "component", type: i3.MatSlideToggle, selector: "mat-slide-toggle", inputs: ["disabled", "disableRipple", "color", "tabIndex"], exportAs: ["matSlideToggle"] }, { kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.RangeValueAccessor, selector: "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsA11yWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-a11y-widget', template: "<a class=\"nav-link\" (click)=\"openA11yWidget($event, a11yWidget)\" href=\"\" role=\"button\" aria-labelledby=\"a11y-offscreen\">\n  <i class=\"pbi-icon-outline pbi-a11y-solid d-none d-lg-inline\" aria-hidden=\"true\"></i>\n\n  <span class=\"d-lg-none\" id=\"a11y-offscreen\">\n    <i class=\"pbi-icon-mini pbi-a11y-solid\" aria-hidden=\"true\"></i>&nbsp;Accessibility Options\n  </span>\n</a>\n\n<ng-template #a11yWidget let-modal>\n  <div class=\"modal-header\">\n    <h2 class=\"modal-title visually-hidden\" id=\"a11y-modal-title\">Accessibility Options Panel</h2>\n    <button class=\"btn-close\" (click)=\"modal.dismiss()\" type=\"button\" aria-label=\"Close\"></button>\n  </div>\n  <div class=\"modal-header\"></div>\n\n  <div class=\"modal-body\">\n    <form [formGroup]=\"form\">\n      <section>\n        <!-- <mat-checkbox (change)=\"checkboxVisual($event)\">Vision</mat-checkbox> -->\n        <div class=\"section-title\">\n          <h2>Vision</h2>\n          <mat-slide-toggle\n            [color]=\"'primary'\"\n            (change)=\"toggleVisionOptions($event)\"\n            formControlName=\"vision\"\n            aria-label=\"Activate all vision options\"\n            labelPosition=\"before\"\n            >Activate all</mat-slide-toggle\n          >\n        </div>\n\n        <p>\n          Some people may find items on the page difficult to read. Here you can increase the font size, line spacing,\n          and other visual settings.\n        </p>\n\n        <div class=\"options\">\n          <div class=\"option\">\n            <p id=\"text-contrast\">Increase Text Contrast</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"textContrast\"\n              aria-labelledby=\"text-contrast\"\n            ></mat-slide-toggle>\n            <div>\n              <div class=\"sr-only\" id=\"textContrastHelp\">Change the text color to black to improve readability.</div>\n            </div>\n          </div>\n\n          <div class=\"option\">\n            <label class=\"d-block\" for=\"a11y-font-size\">Font Size ({{ form.controls.fontSize.value }} pixels)</label>\n            <input id=\"a11y-font-size\" type=\"range\" formControlName=\"fontSize\" min=\"14\" max=\"24\" step=\"1\" />\n          </div>\n          <div class=\"option\">\n            <label class=\"d-block\" for=\"line-height\">Line Spacing ({{ form.controls.lineHeight.value }}x)</label>\n            <input id=\"line-height\" type=\"range\" formControlName=\"lineHeight\" min=\"1.5\" max=\"3\" step=\"0.1\" />\n          </div>\n\n          <!-- <div class=\"option \">\n            <p id=\"legible-font\">Hyperlegible Font</p>\n            <mat-slide-toggle formControlName=\"legibleFont\" aria-labelledby=\"legible-font\" [color]=\"'primary'\"></mat-slide-toggle>\n          </div> -->\n\n          <div class=\"option\">\n            <label class=\"d-block\" for=\"zoom\">Zoom ({{ form.controls.zoom.value }}x)</label>\n            <input id=\"zoom\" type=\"range\" formControlName=\"zoom\" min=\"1\" max=\"2\" step=\"0.1\" />\n          </div>\n\n          <!-- <div class=\"option \">\n            <p id=\"high-saturation\">High Saturation</p>\n            <mat-slide-toggle formControlName=\"highSaturation\"\n                              aria-labelledby=\"high-saturation\"\n                              [color]=\"'primary'\"></mat-slide-toggle>\n          </div> -->\n\n          <div class=\"option\">\n            <p id=\"dark-mode\">Dark Mode</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"darkMode\"\n              aria-labelledby=\"dark-mode\"\n            ></mat-slide-toggle>\n          </div>\n        </div>\n      </section>\n\n      <section>\n        <!-- <mat-checkbox (change)=\"checkboxCognitive($event)\">Cognitive</mat-checkbox> -->\n        <div class=\"section-title\">\n          <h2>Cognitive</h2>\n          <mat-slide-toggle\n            [color]=\"'primary'\"\n            (change)=\"toggleCognitiveOptions($event)\"\n            formControlName=\"vision\"\n            aria-label=\"Activate all cognitive options\"\n            labelPosition=\"before\"\n            >Activate all</mat-slide-toggle\n          >\n        </div>\n\n        <p>\n          If the content on the page is hard to sort out for you, you can highlight headers, links, and even use a font\n          designed to aid people with dyslexia.\n        </p>\n\n        <div class=\"options\">\n          <div class=\"option\">\n            <p id=\"show-headings\">Show Headings</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"showHeadings\"\n              aria-label=\"show-headings\"\n            ></mat-slide-toggle>\n          </div>\n\n          <div class=\"option\">\n            <p id=\"show-links\">Show Links</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"showLinks\"\n              aria-labelledby=\"show-links\"\n            ></mat-slide-toggle>\n          </div>\n\n          <div class=\"option\">\n            <p id=\"dyslexia\">Dyslexia-friendly font</p>\n            <mat-slide-toggle\n              [color]=\"'primary'\"\n              formControlName=\"dyslexia\"\n              aria-labelledby=\"dyslexia\"\n            ></mat-slide-toggle>\n          </div>\n        </div>\n      </section>\n\n      <!-- <section>\n\n        <div class=\"section-title\">\n          <h2>Seizures</h2>\n          <mat-slide-toggle formControlName=\"vision\"\n                            aria-label=\"Activate all limit distractions options\"\n                            [color]=\"'primary'\"\n                            (change)=\"toggleLimitDistrations($event)\"\n                            labelPosition=\"before\">Activate all </mat-slide-toggle>\n        </div>\n\n        <p>Some people might find animations or bright color contrast distracting or annoying.</p>\n\n        <div class=\"options\">\n          <div class=\"option\">\n            <p id=\"low-contrast\">Reduce Saturation</p>\n            <mat-slide-toggle formControlName=\"lowContrast\"\n                              aria-labelledby=\"low-contrast\"\n                              [color]=\"'primary'\"></mat-slide-toggle>\n          </div>\n          <div class=\"option\">\n            <p id=\"animation\">Stop Animations</p>\n            <mat-slide-toggle formControlName=\"animation\"\n                              aria-labelledby=\"animation\"\n                              [color]=\"'primary'\"></mat-slide-toggle>\n          </div>\n        </div>\n      </section> -->\n    </form>\n  </div>\n  <!-- <div class=\"modal-footer\">\n    <button\n      type=\"button\"\n      class=\"btn btn-outline-dark\"\n      (click)=\"modal.close()\"\n    >Done</button>\n  </div> -->\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i1.NgbModal }, { type: i2.UntypedFormBuilder }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }]; } });

class PbdsA11yWidgetModule {
}
PbdsA11yWidgetModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsA11yWidgetModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsA11yWidgetModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.7", ngImport: i0, type: PbdsA11yWidgetModule, declarations: [PbdsA11yWidgetComponent], imports: [CommonModule, MatSlideToggleModule, FormsModule, ReactiveFormsModule], exports: [PbdsA11yWidgetComponent] });
PbdsA11yWidgetModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsA11yWidgetModule, imports: [CommonModule, MatSlideToggleModule, FormsModule, ReactiveFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsA11yWidgetModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsA11yWidgetComponent,],
                    imports: [CommonModule, MatSlideToggleModule, FormsModule, ReactiveFormsModule],
                    exports: [PbdsA11yWidgetComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsA11yWidgetComponent, PbdsA11yWidgetModule };
//# sourceMappingURL=pb-design-system-a11y-widget.mjs.map

import * as i0 from '@angular/core';
import { Component, Input, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

let COUNT = 0;
class PbdsFeedbackRatingComponent {
    constructor() {
        this.ariaLabels = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];
        this.color = false;
        this.onChange = (value) => { };
        this.onTouched = () => { };
        this.touched = false;
        this.disabled = false;
    }
    ngOnInit() {
        this.count = COUNT++;
    }
    writeValue(value) {
        this.value = value;
    }
    registerOnChange(onChange) {
        this.onChange = onChange;
    }
    registerOnTouched(onTouched) {
        this.onTouched = onTouched;
    }
    setDisabledState(disabled) {
        this.disabled = disabled;
    }
    onNewText($event) {
        this.onChange($event.target.value);
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }
}
PbdsFeedbackRatingComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsFeedbackRatingComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsFeedbackRatingComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsFeedbackRatingComponent, selector: "pbds-feedback-rating", inputs: { ariaLabels: "ariaLabels", color: "color" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: PbdsFeedbackRatingComponent
        }
    ], ngImport: i0, template: "<div class=\"smiley-ratings\">\n  <div\n    class=\"smileys\"\n    [ngClass]=\"color ? 'smileys-color' : 'smileys-mono'\"\n    role=\"group\"\n    aria-labelledby=\"smileyRatingLabel\"\n  >\n    <input\n      id=\"strongly-disagree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"strongly-disagree\"\n    />\n    <label class=\"smiley smiley1\" for=\"strongly-disagree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M16.667 21.93a1.754 1.754 0 1 0 0-3.509 1.754 1.754 0 0 0 0 3.509ZM32.456 21.93a1.754 1.754 0 1 0 0-3.509 1.754 1.754 0 0 0 0 3.509Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M32.635 35.508c-1.62-3.141-4.613-5.077-7.854-5.077-3.241 0-6.235 1.936-7.854 5.077M14.735 11.05l3.863 4.318M33.825 11.05l-3.181 4.546\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[0] }}</span>\n    </label>\n\n    <input\n      id=\"disagree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"disagree\"\n    />\n    <label class=\"smiley smiley2\" for=\"disagree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M14.286 21.428a2.04 2.04 0 1 0 0-4.081 2.04 2.04 0 0 0 0 4.081ZM34.91 21.428a2.04 2.04 0 1 0 0-4.081 2.04 2.04 0 0 0 0 4.081Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M34.09 36.364c-1.873-1.818-5.34-2.938-9.09-2.938-3.751 0-7.217 1.12-9.091 2.938\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[1] }}</span>\n    </label>\n\n    <input\n      id=\"neutral-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"neutral\"\n    />\n    <label class=\"smiley smiley3\" for=\"neutral-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM35.21 21a2 2 0 1 0 .001-4 2 2 0 0 0 0 4Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path d=\"M14.69 35.2h20.565\" stroke=\"#595959\" stroke-width=\"2\" stroke-linecap=\"round\" />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[2] }}</span>\n    </label>\n\n    <input id=\"agree-{{ count }}\" (change)=\"onNewText($event)\" name=\"feedback-{{ count }}\" type=\"radio\" value=\"agree\" />\n    <label class=\"smiley smiley4\" for=\"agree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM35.21 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M34.09 34.316c-1.873 1.818-5.34 2.938-9.09 2.938-3.751 0-7.217-1.12-9.091-2.938\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[3] }}</span>\n    </label>\n\n    <input\n      id=\"strongly-agree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"strongly-agree\"\n    />\n    <label class=\"smiley smiley5\" for=\"strongly-agree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M35.302 32.782c-2.114 4.884-6.026 7.892-10.259 7.892-4.233 0-8.144-3.008-10.26-7.892M17.94 20.682c-.705-1.628-2.008-2.63-3.42-2.63-1.41 0-2.714 1.002-3.42 2.63M37.407 20.682c-.705-1.628-2.009-2.63-3.42-2.63s-2.715 1.002-3.42 2.63\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[4] }}</span>\n    </label>\n  </div>\n</div>\n", styles: [""], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsFeedbackRatingComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-feedback-rating', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            multi: true,
                            useExisting: PbdsFeedbackRatingComponent
                        }
                    ], template: "<div class=\"smiley-ratings\">\n  <div\n    class=\"smileys\"\n    [ngClass]=\"color ? 'smileys-color' : 'smileys-mono'\"\n    role=\"group\"\n    aria-labelledby=\"smileyRatingLabel\"\n  >\n    <input\n      id=\"strongly-disagree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"strongly-disagree\"\n    />\n    <label class=\"smiley smiley1\" for=\"strongly-disagree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M16.667 21.93a1.754 1.754 0 1 0 0-3.509 1.754 1.754 0 0 0 0 3.509ZM32.456 21.93a1.754 1.754 0 1 0 0-3.509 1.754 1.754 0 0 0 0 3.509Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M32.635 35.508c-1.62-3.141-4.613-5.077-7.854-5.077-3.241 0-6.235 1.936-7.854 5.077M14.735 11.05l3.863 4.318M33.825 11.05l-3.181 4.546\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[0] }}</span>\n    </label>\n\n    <input\n      id=\"disagree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"disagree\"\n    />\n    <label class=\"smiley smiley2\" for=\"disagree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M14.286 21.428a2.04 2.04 0 1 0 0-4.081 2.04 2.04 0 0 0 0 4.081ZM34.91 21.428a2.04 2.04 0 1 0 0-4.081 2.04 2.04 0 0 0 0 4.081Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M34.09 36.364c-1.873-1.818-5.34-2.938-9.09-2.938-3.751 0-7.217 1.12-9.091 2.938\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[1] }}</span>\n    </label>\n\n    <input\n      id=\"neutral-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"neutral\"\n    />\n    <label class=\"smiley smiley3\" for=\"neutral-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM35.21 21a2 2 0 1 0 .001-4 2 2 0 0 0 0 4Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path d=\"M14.69 35.2h20.565\" stroke=\"#595959\" stroke-width=\"2\" stroke-linecap=\"round\" />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[2] }}</span>\n    </label>\n\n    <input id=\"agree-{{ count }}\" (change)=\"onNewText($event)\" name=\"feedback-{{ count }}\" type=\"radio\" value=\"agree\" />\n    <label class=\"smiley smiley4\" for=\"agree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM35.21 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M34.09 34.316c-1.873 1.818-5.34 2.938-9.09 2.938-3.751 0-7.217-1.12-9.091-2.938\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[3] }}</span>\n    </label>\n\n    <input\n      id=\"strongly-agree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"strongly-agree\"\n    />\n    <label class=\"smiley smiley5\" for=\"strongly-agree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M35.302 32.782c-2.114 4.884-6.026 7.892-10.259 7.892-4.233 0-8.144-3.008-10.26-7.892M17.94 20.682c-.705-1.628-2.008-2.63-3.42-2.63-1.41 0-2.714 1.002-3.42 2.63M37.407 20.682c-.705-1.628-2.009-2.63-3.42-2.63s-2.715 1.002-3.42 2.63\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"sr-only\">{{ ariaLabels[4] }}</span>\n    </label>\n  </div>\n</div>\n" }]
        }], ctorParameters: function () { return []; }, propDecorators: { ariaLabels: [{
                type: Input
            }], color: [{
                type: Input
            }] } });

class PbdsFeedbackRatingModule {
}
PbdsFeedbackRatingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsFeedbackRatingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsFeedbackRatingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.7", ngImport: i0, type: PbdsFeedbackRatingModule, declarations: [PbdsFeedbackRatingComponent], imports: [CommonModule], exports: [PbdsFeedbackRatingComponent] });
PbdsFeedbackRatingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsFeedbackRatingModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsFeedbackRatingModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsFeedbackRatingComponent],
                    imports: [CommonModule],
                    exports: [PbdsFeedbackRatingComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsFeedbackRatingComponent, PbdsFeedbackRatingModule };
//# sourceMappingURL=pb-design-system-feedback-rating.mjs.map

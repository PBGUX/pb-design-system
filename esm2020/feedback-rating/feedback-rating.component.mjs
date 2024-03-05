import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
let COUNT = 0;
export class PbdsFeedbackRatingComponent {
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
    ], ngImport: i0, template: "<div class=\"smiley-ratings\">\n  <div\n    class=\"smileys\"\n    [ngClass]=\"color ? 'smileys-color' : 'smileys-mono'\"\n    role=\"group\"\n    aria-labelledby=\"smileyRatingLabel\"\n  >\n    <input\n      id=\"strongly-disagree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"strongly-disagree\"\n    />\n    <label class=\"smiley smiley1\" for=\"strongly-disagree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M16.667 21.93a1.754 1.754 0 1 0 0-3.509 1.754 1.754 0 0 0 0 3.509ZM32.456 21.93a1.754 1.754 0 1 0 0-3.509 1.754 1.754 0 0 0 0 3.509Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M32.635 35.508c-1.62-3.141-4.613-5.077-7.854-5.077-3.241 0-6.235 1.936-7.854 5.077M14.735 11.05l3.863 4.318M33.825 11.05l-3.181 4.546\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[0] }}</span>\n    </label>\n\n    <input\n      id=\"disagree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"disagree\"\n    />\n    <label class=\"smiley smiley2\" for=\"disagree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M14.286 21.428a2.04 2.04 0 1 0 0-4.081 2.04 2.04 0 0 0 0 4.081ZM34.91 21.428a2.04 2.04 0 1 0 0-4.081 2.04 2.04 0 0 0 0 4.081Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M34.09 36.364c-1.873-1.818-5.34-2.938-9.09-2.938-3.751 0-7.217 1.12-9.091 2.938\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[1] }}</span>\n    </label>\n\n    <input\n      id=\"neutral-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"neutral\"\n    />\n    <label class=\"smiley smiley3\" for=\"neutral-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM35.21 21a2 2 0 1 0 .001-4 2 2 0 0 0 0 4Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path d=\"M14.69 35.2h20.565\" stroke=\"#595959\" stroke-width=\"2\" stroke-linecap=\"round\" />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[2] }}</span>\n    </label>\n\n    <input id=\"agree-{{ count }}\" (change)=\"onNewText($event)\" name=\"feedback-{{ count }}\" type=\"radio\" value=\"agree\" />\n    <label class=\"smiley smiley4\" for=\"agree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM35.21 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M34.09 34.316c-1.873 1.818-5.34 2.938-9.09 2.938-3.751 0-7.217-1.12-9.091-2.938\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[3] }}</span>\n    </label>\n\n    <input\n      id=\"strongly-agree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"strongly-agree\"\n    />\n    <label class=\"smiley smiley5\" for=\"strongly-agree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M35.302 32.782c-2.114 4.884-6.026 7.892-10.259 7.892-4.233 0-8.144-3.008-10.26-7.892M17.94 20.682c-.705-1.628-2.008-2.63-3.42-2.63-1.41 0-2.714 1.002-3.42 2.63M37.407 20.682c-.705-1.628-2.009-2.63-3.42-2.63s-2.715 1.002-3.42 2.63\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[4] }}</span>\n    </label>\n  </div>\n</div>\n", styles: [""], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsFeedbackRatingComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-feedback-rating', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            multi: true,
                            useExisting: PbdsFeedbackRatingComponent
                        }
                    ], template: "<div class=\"smiley-ratings\">\n  <div\n    class=\"smileys\"\n    [ngClass]=\"color ? 'smileys-color' : 'smileys-mono'\"\n    role=\"group\"\n    aria-labelledby=\"smileyRatingLabel\"\n  >\n    <input\n      id=\"strongly-disagree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"strongly-disagree\"\n    />\n    <label class=\"smiley smiley1\" for=\"strongly-disagree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M16.667 21.93a1.754 1.754 0 1 0 0-3.509 1.754 1.754 0 0 0 0 3.509ZM32.456 21.93a1.754 1.754 0 1 0 0-3.509 1.754 1.754 0 0 0 0 3.509Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M32.635 35.508c-1.62-3.141-4.613-5.077-7.854-5.077-3.241 0-6.235 1.936-7.854 5.077M14.735 11.05l3.863 4.318M33.825 11.05l-3.181 4.546\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[0] }}</span>\n    </label>\n\n    <input\n      id=\"disagree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"disagree\"\n    />\n    <label class=\"smiley smiley2\" for=\"disagree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M14.286 21.428a2.04 2.04 0 1 0 0-4.081 2.04 2.04 0 0 0 0 4.081ZM34.91 21.428a2.04 2.04 0 1 0 0-4.081 2.04 2.04 0 0 0 0 4.081Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M34.09 36.364c-1.873-1.818-5.34-2.938-9.09-2.938-3.751 0-7.217 1.12-9.091 2.938\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[1] }}</span>\n    </label>\n\n    <input\n      id=\"neutral-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"neutral\"\n    />\n    <label class=\"smiley smiley3\" for=\"neutral-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM35.21 21a2 2 0 1 0 .001-4 2 2 0 0 0 0 4Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path d=\"M14.69 35.2h20.565\" stroke=\"#595959\" stroke-width=\"2\" stroke-linecap=\"round\" />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[2] }}</span>\n    </label>\n\n    <input id=\"agree-{{ count }}\" (change)=\"onNewText($event)\" name=\"feedback-{{ count }}\" type=\"radio\" value=\"agree\" />\n    <label class=\"smiley smiley4\" for=\"agree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM35.21 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z\"\n          fill=\"#595959\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n        <path\n          d=\"M34.09 34.316c-1.873 1.818-5.34 2.938-9.09 2.938-3.751 0-7.217-1.12-9.091-2.938\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[3] }}</span>\n    </label>\n\n    <input\n      id=\"strongly-agree-{{ count }}\"\n      (change)=\"onNewText($event)\"\n      name=\"feedback-{{ count }}\"\n      type=\"radio\"\n      value=\"strongly-agree\"\n    />\n    <label class=\"smiley smiley5\" for=\"strongly-agree-{{ count }}\">\n      <svg width=\"50\" height=\"50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle class=\"smiley-circle\" cx=\"25\" cy=\"25\" r=\"22\" />\n        <path\n          d=\"M35.302 32.782c-2.114 4.884-6.026 7.892-10.259 7.892-4.233 0-8.144-3.008-10.26-7.892M17.94 20.682c-.705-1.628-2.008-2.63-3.42-2.63-1.41 0-2.714 1.002-3.42 2.63M37.407 20.682c-.705-1.628-2.009-2.63-3.42-2.63s-2.715 1.002-3.42 2.63\"\n          stroke=\"#595959\"\n          stroke-width=\"2\"\n          stroke-linecap=\"round\"\n          stroke-linejoin=\"round\"\n        />\n      </svg>\n      <span class=\"visually-hidden\">{{ ariaLabels[4] }}</span>\n    </label>\n  </div>\n</div>\n" }]
        }], ctorParameters: function () { return []; }, propDecorators: { ariaLabels: [{
                type: Input
            }], color: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlZGJhY2stcmF0aW5nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZmVlZGJhY2stcmF0aW5nL2ZlZWRiYWNrLXJhdGluZy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2ZlZWRiYWNrLXJhdGluZy9mZWVkYmFjay1yYXRpbmcuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFhLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDcEUsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFFekUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBY2QsTUFBTSxPQUFPLDJCQUEyQjtJQWlCdEM7UUFoQlMsZUFBVSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUVyRixVQUFLLEdBQUcsS0FBSyxDQUFDO1FBRXZCLGFBQVEsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBRXpCLGNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFFckIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUloQixhQUFRLEdBQUcsS0FBSyxDQUFDO0lBSUYsQ0FBQztJQUVoQixRQUFRO1FBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQWE7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVELGdCQUFnQixDQUFDLFFBQWE7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELGlCQUFpQixDQUFDLFNBQWM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVELGdCQUFnQixDQUFDLFFBQWlCO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBTTtRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckI7SUFDSCxDQUFDOzt3SEE5Q1UsMkJBQTJCOzRHQUEzQiwyQkFBMkIscUdBUjNCO1FBQ1Q7WUFDRSxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLEtBQUssRUFBRSxJQUFJO1lBQ1gsV0FBVyxFQUFFLDJCQUEyQjtTQUN6QztLQUNGLDBCQ2ZILCtxS0FxSUE7MkZEcEhhLDJCQUEyQjtrQkFadkMsU0FBUzsrQkFDRSxzQkFBc0IsYUFHckI7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLGlCQUFpQjs0QkFDMUIsS0FBSyxFQUFFLElBQUk7NEJBQ1gsV0FBVyw2QkFBNkI7eUJBQ3pDO3FCQUNGOzBFQUdRLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXR0cmlidXRlLCBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxubGV0IENPVU5UID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1mZWVkYmFjay1yYXRpbmcnLFxuICB0ZW1wbGF0ZVVybDogJy4vZmVlZGJhY2stcmF0aW5nLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZmVlZGJhY2stcmF0aW5nLmNvbXBvbmVudC5jc3MnXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHVzZUV4aXN0aW5nOiBQYmRzRmVlZGJhY2tSYXRpbmdDb21wb25lbnRcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0ZlZWRiYWNrUmF0aW5nQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpIGFyaWFMYWJlbHMgPSBbJ1N0cm9uZ2x5IGRpc2FncmVlJywgJ0Rpc2FncmVlJywgJ05ldXRyYWwnLCAnQWdyZWUnLCAnU3Ryb25nbHkgYWdyZWUnXTtcblxuICBASW5wdXQoKSBjb2xvciA9IGZhbHNlO1xuXG4gIG9uQ2hhbmdlID0gKHZhbHVlKSA9PiB7fTtcblxuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICB0b3VjaGVkID0gZmFsc2U7XG5cbiAgdmFsdWU6IGFueTtcblxuICBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHB1YmxpYyBjb3VudDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvdW50ID0gQ09VTlQrKztcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2U6IGFueSkge1xuICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKG9uVG91Y2hlZDogYW55KSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBvblRvdWNoZWQ7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGRpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICB9XG5cbiAgb25OZXdUZXh0KCRldmVudCkge1xuICAgIHRoaXMub25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSk7XG5cbiAgICBpZiAoIXRoaXMudG91Y2hlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICAgIHRoaXMudG91Y2hlZCA9IHRydWU7XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwic21pbGV5LXJhdGluZ3NcIj5cbiAgPGRpdlxuICAgIGNsYXNzPVwic21pbGV5c1wiXG4gICAgW25nQ2xhc3NdPVwiY29sb3IgPyAnc21pbGV5cy1jb2xvcicgOiAnc21pbGV5cy1tb25vJ1wiXG4gICAgcm9sZT1cImdyb3VwXCJcbiAgICBhcmlhLWxhYmVsbGVkYnk9XCJzbWlsZXlSYXRpbmdMYWJlbFwiXG4gID5cbiAgICA8aW5wdXRcbiAgICAgIGlkPVwic3Ryb25nbHktZGlzYWdyZWUte3sgY291bnQgfX1cIlxuICAgICAgKGNoYW5nZSk9XCJvbk5ld1RleHQoJGV2ZW50KVwiXG4gICAgICBuYW1lPVwiZmVlZGJhY2ste3sgY291bnQgfX1cIlxuICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgIHZhbHVlPVwic3Ryb25nbHktZGlzYWdyZWVcIlxuICAgIC8+XG4gICAgPGxhYmVsIGNsYXNzPVwic21pbGV5IHNtaWxleTFcIiBmb3I9XCJzdHJvbmdseS1kaXNhZ3JlZS17eyBjb3VudCB9fVwiPlxuICAgICAgPHN2ZyB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGNpcmNsZSBjbGFzcz1cInNtaWxleS1jaXJjbGVcIiBjeD1cIjI1XCIgY3k9XCIyNVwiIHI9XCIyMlwiIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk0xNi42NjcgMjEuOTNhMS43NTQgMS43NTQgMCAxIDAgMC0zLjUwOSAxLjc1NCAxLjc1NCAwIDAgMCAwIDMuNTA5Wk0zMi40NTYgMjEuOTNhMS43NTQgMS43NTQgMCAxIDAgMC0zLjUwOSAxLjc1NCAxLjc1NCAwIDAgMCAwIDMuNTA5WlwiXG4gICAgICAgICAgZmlsbD1cIiM1OTU5NTlcIlxuICAgICAgICAgIHN0cm9rZT1cIiM1OTU5NTlcIlxuICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjJcIlxuICAgICAgICAgIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTMyLjYzNSAzNS41MDhjLTEuNjItMy4xNDEtNC42MTMtNS4wNzctNy44NTQtNS4wNzctMy4yNDEgMC02LjIzNSAxLjkzNi03Ljg1NCA1LjA3N00xNC43MzUgMTEuMDVsMy44NjMgNC4zMThNMzMuODI1IDExLjA1bC0zLjE4MSA0LjU0NlwiXG4gICAgICAgICAgc3Ryb2tlPVwiIzU5NTk1OVwiXG4gICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMlwiXG4gICAgICAgICAgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAvPlxuICAgICAgPC9zdmc+XG4gICAgICA8c3BhbiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiPnt7IGFyaWFMYWJlbHNbMF0gfX08L3NwYW4+XG4gICAgPC9sYWJlbD5cblxuICAgIDxpbnB1dFxuICAgICAgaWQ9XCJkaXNhZ3JlZS17eyBjb3VudCB9fVwiXG4gICAgICAoY2hhbmdlKT1cIm9uTmV3VGV4dCgkZXZlbnQpXCJcbiAgICAgIG5hbWU9XCJmZWVkYmFjay17eyBjb3VudCB9fVwiXG4gICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgdmFsdWU9XCJkaXNhZ3JlZVwiXG4gICAgLz5cbiAgICA8bGFiZWwgY2xhc3M9XCJzbWlsZXkgc21pbGV5MlwiIGZvcj1cImRpc2FncmVlLXt7IGNvdW50IH19XCI+XG4gICAgICA8c3ZnIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8Y2lyY2xlIGNsYXNzPVwic21pbGV5LWNpcmNsZVwiIGN4PVwiMjVcIiBjeT1cIjI1XCIgcj1cIjIyXCIgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTE0LjI4NiAyMS40MjhhMi4wNCAyLjA0IDAgMSAwIDAtNC4wODEgMi4wNCAyLjA0IDAgMCAwIDAgNC4wODFaTTM0LjkxIDIxLjQyOGEyLjA0IDIuMDQgMCAxIDAgMC00LjA4MSAyLjA0IDIuMDQgMCAwIDAgMCA0LjA4MVpcIlxuICAgICAgICAgIGZpbGw9XCIjNTk1OTU5XCJcbiAgICAgICAgICBzdHJva2U9XCIjNTk1OTU5XCJcbiAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCJcbiAgICAgICAgICBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk0zNC4wOSAzNi4zNjRjLTEuODczLTEuODE4LTUuMzQtMi45MzgtOS4wOS0yLjkzOC0zLjc1MSAwLTcuMjE3IDEuMTItOS4wOTEgMi45MzhcIlxuICAgICAgICAgIHN0cm9rZT1cIiM1OTU5NTlcIlxuICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjJcIlxuICAgICAgICAgIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgLz5cbiAgICAgIDwvc3ZnPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIj57eyBhcmlhTGFiZWxzWzFdIH19PC9zcGFuPlxuICAgIDwvbGFiZWw+XG5cbiAgICA8aW5wdXRcbiAgICAgIGlkPVwibmV1dHJhbC17eyBjb3VudCB9fVwiXG4gICAgICAoY2hhbmdlKT1cIm9uTmV3VGV4dCgkZXZlbnQpXCJcbiAgICAgIG5hbWU9XCJmZWVkYmFjay17eyBjb3VudCB9fVwiXG4gICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgdmFsdWU9XCJuZXV0cmFsXCJcbiAgICAvPlxuICAgIDxsYWJlbCBjbGFzcz1cInNtaWxleSBzbWlsZXkzXCIgZm9yPVwibmV1dHJhbC17eyBjb3VudCB9fVwiPlxuICAgICAgPHN2ZyB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGNpcmNsZSBjbGFzcz1cInNtaWxleS1jaXJjbGVcIiBjeD1cIjI1XCIgY3k9XCIyNVwiIHI9XCIyMlwiIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk0xNSAyMWEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDRaTTM1LjIxIDIxYTIgMiAwIDEgMCAuMDAxLTQgMiAyIDAgMCAwIDAgNFpcIlxuICAgICAgICAgIGZpbGw9XCIjNTk1OTU5XCJcbiAgICAgICAgICBzdHJva2U9XCIjNTk1OTU5XCJcbiAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCJcbiAgICAgICAgICBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTQuNjkgMzUuMmgyMC41NjVcIiBzdHJva2U9XCIjNTk1OTU5XCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgICA8c3BhbiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiPnt7IGFyaWFMYWJlbHNbMl0gfX08L3NwYW4+XG4gICAgPC9sYWJlbD5cblxuICAgIDxpbnB1dCBpZD1cImFncmVlLXt7IGNvdW50IH19XCIgKGNoYW5nZSk9XCJvbk5ld1RleHQoJGV2ZW50KVwiIG5hbWU9XCJmZWVkYmFjay17eyBjb3VudCB9fVwiIHR5cGU9XCJyYWRpb1wiIHZhbHVlPVwiYWdyZWVcIiAvPlxuICAgIDxsYWJlbCBjbGFzcz1cInNtaWxleSBzbWlsZXk0XCIgZm9yPVwiYWdyZWUte3sgY291bnQgfX1cIj5cbiAgICAgIDxzdmcgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgIDxjaXJjbGUgY2xhc3M9XCJzbWlsZXktY2lyY2xlXCIgY3g9XCIyNVwiIGN5PVwiMjVcIiByPVwiMjJcIiAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMTUgMjFhMiAyIDAgMSAwIDAtNCAyIDIgMCAwIDAgMCA0Wk0zNS4yMSAyMWEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDRaXCJcbiAgICAgICAgICBmaWxsPVwiIzU5NTk1OVwiXG4gICAgICAgICAgc3Ryb2tlPVwiIzU5NTk1OVwiXG4gICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMlwiXG4gICAgICAgICAgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMzQuMDkgMzQuMzE2Yy0xLjg3MyAxLjgxOC01LjM0IDIuOTM4LTkuMDkgMi45MzgtMy43NTEgMC03LjIxNy0xLjEyLTkuMDkxLTIuOTM4XCJcbiAgICAgICAgICBzdHJva2U9XCIjNTk1OTU5XCJcbiAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCJcbiAgICAgICAgICBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgIC8+XG4gICAgICA8L3N2Zz5cbiAgICAgIDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+e3sgYXJpYUxhYmVsc1szXSB9fTwvc3Bhbj5cbiAgICA8L2xhYmVsPlxuXG4gICAgPGlucHV0XG4gICAgICBpZD1cInN0cm9uZ2x5LWFncmVlLXt7IGNvdW50IH19XCJcbiAgICAgIChjaGFuZ2UpPVwib25OZXdUZXh0KCRldmVudClcIlxuICAgICAgbmFtZT1cImZlZWRiYWNrLXt7IGNvdW50IH19XCJcbiAgICAgIHR5cGU9XCJyYWRpb1wiXG4gICAgICB2YWx1ZT1cInN0cm9uZ2x5LWFncmVlXCJcbiAgICAvPlxuICAgIDxsYWJlbCBjbGFzcz1cInNtaWxleSBzbWlsZXk1XCIgZm9yPVwic3Ryb25nbHktYWdyZWUte3sgY291bnQgfX1cIj5cbiAgICAgIDxzdmcgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgIDxjaXJjbGUgY2xhc3M9XCJzbWlsZXktY2lyY2xlXCIgY3g9XCIyNVwiIGN5PVwiMjVcIiByPVwiMjJcIiAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMzUuMzAyIDMyLjc4MmMtMi4xMTQgNC44ODQtNi4wMjYgNy44OTItMTAuMjU5IDcuODkyLTQuMjMzIDAtOC4xNDQtMy4wMDgtMTAuMjYtNy44OTJNMTcuOTQgMjAuNjgyYy0uNzA1LTEuNjI4LTIuMDA4LTIuNjMtMy40Mi0yLjYzLTEuNDEgMC0yLjcxNCAxLjAwMi0zLjQyIDIuNjNNMzcuNDA3IDIwLjY4MmMtLjcwNS0xLjYyOC0yLjAwOS0yLjYzLTMuNDItMi42M3MtMi43MTUgMS4wMDItMy40MiAyLjYzXCJcbiAgICAgICAgICBzdHJva2U9XCIjNTk1OTU5XCJcbiAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCJcbiAgICAgICAgICBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgIC8+XG4gICAgICA8L3N2Zz5cbiAgICAgIDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+e3sgYXJpYUxhYmVsc1s0XSB9fTwvc3Bhbj5cbiAgICA8L2xhYmVsPlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19
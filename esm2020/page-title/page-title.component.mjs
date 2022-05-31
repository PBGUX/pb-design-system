import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class PbdsPageTitleComponent {
    constructor() {
        this.layout = 'container';
    }
}
PbdsPageTitleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsPageTitleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsPageTitleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.6", type: PbdsPageTitleComponent, selector: "pbds-page-title", inputs: { ttl: "ttl", sub: "sub", layout: "layout" }, ngImport: i0, template: "<div class=\"page-header\">\n  <div class=\"page-title\" [ngClass]=\"layout\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <h1 [ngClass]=\"{ 'mb-0': sub, 'has-sub': sub }\">{{ ttl }}</h1>\n        <h2 *ngIf=\"sub\">{{ sub }}</h2>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [".page-header h1.has-sub{margin-top:85px;margin-bottom:0}.page-title h1.mb-0+h2{font-size:16px;margin-bottom:25px;line-height:1.4}\n"], directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsPageTitleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-page-title', template: "<div class=\"page-header\">\n  <div class=\"page-title\" [ngClass]=\"layout\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <h1 [ngClass]=\"{ 'mb-0': sub, 'has-sub': sub }\">{{ ttl }}</h1>\n        <h2 *ngIf=\"sub\">{{ sub }}</h2>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [".page-header h1.has-sub{margin-top:85px;margin-bottom:0}.page-title h1.mb-0+h2{font-size:16px;margin-bottom:25px;line-height:1.4}\n"] }]
        }], propDecorators: { ttl: [{
                type: Input
            }], sub: [{
                type: Input
            }], layout: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS10aXRsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL3BhZ2UtdGl0bGUvcGFnZS10aXRsZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL3BhZ2UtdGl0bGUvcGFnZS10aXRsZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBT2pELE1BQU0sT0FBTyxzQkFBc0I7SUFMbkM7UUFVVyxXQUFNLEdBQUcsV0FBVyxDQUFDO0tBQy9COzttSEFOWSxzQkFBc0I7dUdBQXRCLHNCQUFzQiw2R0NQbkMsc1NBVUE7MkZESGEsc0JBQXNCO2tCQUxsQyxTQUFTOytCQUNFLGlCQUFpQjs4QkFNM0IsR0FBRztzQkFERixLQUFLO2dCQUdOLEdBQUc7c0JBREYsS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtcGFnZS10aXRsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9wYWdlLXRpdGxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGFnZS10aXRsZS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNQYWdlVGl0bGVDb21wb25lbnQge1xuICBASW5wdXQoKVxuICB0dGw6IHN0cmluZztcbiAgQElucHV0KClcbiAgc3ViPzogc3RyaW5nO1xuICBASW5wdXQoKSBsYXlvdXQgPSAnY29udGFpbmVyJztcbn1cbiIsIjxkaXYgY2xhc3M9XCJwYWdlLWhlYWRlclwiPlxuICA8ZGl2IGNsYXNzPVwicGFnZS10aXRsZVwiIFtuZ0NsYXNzXT1cImxheW91dFwiPlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2xcIj5cbiAgICAgICAgPGgxIFtuZ0NsYXNzXT1cInsgJ21iLTAnOiBzdWIsICdoYXMtc3ViJzogc3ViIH1cIj57eyB0dGwgfX08L2gxPlxuICAgICAgICA8aDIgKm5nSWY9XCJzdWJcIj57eyBzdWIgfX08L2gyPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=
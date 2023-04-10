import * as i0 from '@angular/core';
import { Component, Input, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

class PbdsPageTitleComponent {
    constructor() {
        this.layout = 'container';
    }
}
PbdsPageTitleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsPageTitleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsPageTitleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: PbdsPageTitleComponent, selector: "pbds-page-title", inputs: { ttl: "ttl", sub: "sub", layout: "layout" }, ngImport: i0, template: "<div class=\"page-header\">\n  <div class=\"page-title\" [ngClass]=\"layout\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <h1 [ngClass]=\"{ 'mb-0': sub, 'has-sub': sub }\">{{ ttl }}</h1>\n        <h2 *ngIf=\"sub\">{{ sub }}</h2>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [".page-header h1.has-sub{margin-top:85px;margin-bottom:0}.bgdark .page-header{background-color:#2a3037}.page-title h1.mb-0+h2{font-size:16px;margin-bottom:25px;line-height:1.4}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsPageTitleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-page-title', template: "<div class=\"page-header\">\n  <div class=\"page-title\" [ngClass]=\"layout\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <h1 [ngClass]=\"{ 'mb-0': sub, 'has-sub': sub }\">{{ ttl }}</h1>\n        <h2 *ngIf=\"sub\">{{ sub }}</h2>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [".page-header h1.has-sub{margin-top:85px;margin-bottom:0}.bgdark .page-header{background-color:#2a3037}.page-title h1.mb-0+h2{font-size:16px;margin-bottom:25px;line-height:1.4}\n"] }]
        }], propDecorators: { ttl: [{
                type: Input
            }], sub: [{
                type: Input
            }], layout: [{
                type: Input
            }] } });

class PbdsPageTitleModule {
}
PbdsPageTitleModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsPageTitleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsPageTitleModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.4", ngImport: i0, type: PbdsPageTitleModule, declarations: [PbdsPageTitleComponent], imports: [CommonModule], exports: [PbdsPageTitleComponent] });
PbdsPageTitleModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsPageTitleModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsPageTitleModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsPageTitleComponent],
                    imports: [CommonModule],
                    exports: [PbdsPageTitleComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsPageTitleComponent, PbdsPageTitleModule };
//# sourceMappingURL=pb-design-system-page-title.mjs.map

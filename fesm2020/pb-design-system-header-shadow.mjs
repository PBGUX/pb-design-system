import * as i0 from '@angular/core';
import { Directive, HostBinding, HostListener, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

class PbdsHeaderShadowDirective {
    constructor(_scroll) {
        this._scroll = _scroll;
    }
    onWindowScroll() {
        const offset = this._scroll.getScrollPosition();
        this.shadow = offset[1] > 20;
    }
}
PbdsHeaderShadowDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsHeaderShadowDirective, deps: [{ token: i1.ViewportScroller }], target: i0.ɵɵFactoryTarget.Directive });
PbdsHeaderShadowDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.7", type: PbdsHeaderShadowDirective, selector: "header.bg-brand-header", host: { listeners: { "window:scroll": "onWindowScroll()" }, properties: { "class.pbds-header-shadow": "this.shadow" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsHeaderShadowDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'header.bg-brand-header'
                }]
        }], ctorParameters: function () { return [{ type: i1.ViewportScroller }]; }, propDecorators: { shadow: [{
                type: HostBinding,
                args: ['class.pbds-header-shadow']
            }], onWindowScroll: [{
                type: HostListener,
                args: ['window:scroll', []]
            }] } });

class PbdsHeaderShadowModule {
}
PbdsHeaderShadowModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsHeaderShadowModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsHeaderShadowModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.7", ngImport: i0, type: PbdsHeaderShadowModule, declarations: [PbdsHeaderShadowDirective], imports: [CommonModule], exports: [PbdsHeaderShadowDirective] });
PbdsHeaderShadowModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsHeaderShadowModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsHeaderShadowModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsHeaderShadowDirective],
                    imports: [CommonModule],
                    exports: [PbdsHeaderShadowDirective]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsHeaderShadowDirective, PbdsHeaderShadowModule };
//# sourceMappingURL=pb-design-system-header-shadow.mjs.map

import * as i0 from '@angular/core';
import { Directive, HostBinding, HostListener, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

class PbdsHeaderShadowDirective {
    onWindowScroll() {
        const offset = this._scroll.getScrollPosition();
        this.shadow = offset[1] > 20;
    }
    constructor(_scroll) {
        this._scroll = _scroll;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsHeaderShadowDirective, deps: [{ token: i1.ViewportScroller }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: PbdsHeaderShadowDirective, selector: "header.bg-brand-header", host: { listeners: { "window:scroll": "onWindowScroll()" }, properties: { "class.pbds-header-shadow": "this.shadow" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsHeaderShadowDirective, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsHeaderShadowModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: PbdsHeaderShadowModule, declarations: [PbdsHeaderShadowDirective], imports: [CommonModule], exports: [PbdsHeaderShadowDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsHeaderShadowModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsHeaderShadowModule, decorators: [{
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

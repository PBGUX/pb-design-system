import { Directive, HostBinding, HostListener, NgModule } from '@angular/core';
import { ViewportScroller, CommonModule } from '@angular/common';

class PbdsHeaderShadowDirective {
    constructor(_scroll) {
        this._scroll = _scroll;
    }
    onWindowScroll() {
        const offset = this._scroll.getScrollPosition();
        this.shadow = offset[1] > 20;
    }
}
PbdsHeaderShadowDirective.decorators = [
    { type: Directive, args: [{
                selector: 'header.bg-brand-header'
            },] }
];
PbdsHeaderShadowDirective.ctorParameters = () => [
    { type: ViewportScroller }
];
PbdsHeaderShadowDirective.propDecorators = {
    shadow: [{ type: HostBinding, args: ['class.pbds-header-shadow',] }],
    onWindowScroll: [{ type: HostListener, args: ['window:scroll', [],] }]
};

class PbdsHeaderShadowModule {
}
PbdsHeaderShadowModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PbdsHeaderShadowDirective],
                imports: [CommonModule],
                exports: [PbdsHeaderShadowDirective]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsHeaderShadowDirective, PbdsHeaderShadowModule };
//# sourceMappingURL=pb-design-system-header-shadow.js.map

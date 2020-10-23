(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('pb-design-system/header-shadow', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['pb-design-system'] = global['pb-design-system'] || {}, global['pb-design-system']['header-shadow'] = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var PbdsHeaderShadowDirective = /** @class */ (function () {
        function PbdsHeaderShadowDirective(_scroll) {
            this._scroll = _scroll;
        }
        PbdsHeaderShadowDirective.prototype.onWindowScroll = function () {
            var offset = this._scroll.getScrollPosition();
            this.shadow = offset[1] > 20;
        };
        return PbdsHeaderShadowDirective;
    }());
    PbdsHeaderShadowDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: 'header.bg-brand-header'
                },] }
    ];
    PbdsHeaderShadowDirective.ctorParameters = function () { return [
        { type: common.ViewportScroller }
    ]; };
    PbdsHeaderShadowDirective.propDecorators = {
        shadow: [{ type: core.HostBinding, args: ['class.pbds-header-shadow',] }],
        onWindowScroll: [{ type: core.HostListener, args: ['window:scroll', [],] }]
    };

    var PbdsHeaderShadowModule = /** @class */ (function () {
        function PbdsHeaderShadowModule() {
        }
        return PbdsHeaderShadowModule;
    }());
    PbdsHeaderShadowModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [PbdsHeaderShadowDirective],
                    imports: [common.CommonModule],
                    exports: [PbdsHeaderShadowDirective]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.PbdsHeaderShadowDirective = PbdsHeaderShadowDirective;
    exports.PbdsHeaderShadowModule = PbdsHeaderShadowModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pb-design-system-header-shadow.umd.js.map

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('pb-design-system/page-title', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['pb-design-system'] = global['pb-design-system'] || {}, global['pb-design-system']['page-title'] = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var PbdsPageTitleComponent = /** @class */ (function () {
        function PbdsPageTitleComponent() {
            this.layout = 'container';
        }
        return PbdsPageTitleComponent;
    }());
    PbdsPageTitleComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'pbds-page-title',
                    template: "<div class=\"page-header\">\n  <div class=\"page-title\" [ngClass]=\"layout\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <h1 [ngClass]=\"{ 'mb-0': sub, 'has-sub': sub }\">{{ ttl }}</h1>\n        <h2>{{ sub }}</h2>\n      </div>\n    </div>\n  </div>\n</div>\n",
                    styles: [".page-header h1.has-sub{margin-bottom:0;margin-top:85px}.page-title h1.mb-0+h2{font-size:16px;line-height:1.4;margin-bottom:25px}"]
                },] }
    ];
    PbdsPageTitleComponent.propDecorators = {
        ttl: [{ type: core.Input }],
        sub: [{ type: core.Input }],
        layout: [{ type: core.Input }]
    };

    var PbdsPageTitleModule = /** @class */ (function () {
        function PbdsPageTitleModule() {
        }
        return PbdsPageTitleModule;
    }());
    PbdsPageTitleModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [PbdsPageTitleComponent],
                    imports: [common.CommonModule],
                    exports: [PbdsPageTitleComponent]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.PbdsPageTitleComponent = PbdsPageTitleComponent;
    exports.PbdsPageTitleModule = PbdsPageTitleModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pb-design-system-page-title.umd.js.map

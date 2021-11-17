(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('pb-design-system/empty-state', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['pb-design-system'] = global['pb-design-system'] || {}, global['pb-design-system']['empty-state'] = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var PbdsEmptyStateComponent = /** @class */ (function () {
        function PbdsEmptyStateComponent() {
            this.icon = 'none';
        }
        return PbdsEmptyStateComponent;
    }());
    PbdsEmptyStateComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'pbds-empty-state',
                    template: "<div class=\"empty-state\">\n  <div class=\"empty-state-icon\" aria-hidden=\"true\" *ngIf=\"icon !== 'none'\">\n    <ng-container *ngIf=\"icon === 'list'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M28.5714286 19L48 19M28.5714286 32L48 32M28.5714286 44L48 44M19.4285714 16C21.3222857 16 22.8571429 17.5348571 22.8571429 19.4285714 22.8571429 21.3222857 21.3222857 22.8571429 19.4285714 22.8571429 17.5348571 22.8571429 16 21.3222857 16 19.4285714 16 17.5348571 17.5348571 16 19.4285714 16L19.4285714 16zM19.4285714 28.5714286C21.3222857 28.5714286 22.8571429 30.1062857 22.8571429 32 22.8571429 33.8937143 21.3222857 35.4285714 19.4285714 35.4285714 17.5348571 35.4285714 16 33.8937143 16 32 16 30.1062857 17.5348571 28.5714286 19.4285714 28.5714286L19.4285714 28.5714286zM19.4285714 41.1428571C21.3222857 41.1428571 22.8571429 42.6777143 22.8571429 44.5714286 22.8571429 46.4651429 21.3222857 48 19.4285714 48 17.5348571 48 16 46.4651429 16 44.5714286 16 42.6777143 17.5348571 41.1428571 19.4285714 41.1428571L19.4285714 41.1428571z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n    <ng-container *ngIf=\"icon === 'search'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M49 48L39.6206897 38.6206897M30.2413793 16C37.5544828 16 43.4827586 21.9282759 43.4827586 29.2413793 43.4827586 36.5544828 37.5544828 42.4827586 30.2413793 42.4827586 22.9282759 42.4827586 17 36.5544828 17 29.2413793 17 21.9282759 22.9282759 16 30.2413793 16L30.2413793 16z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n  </div>\n  <div class=\"empty-state-head\">{{ head }}</div>\n  <div class=\"empty-state-caption\">{{ caption }}</div>\n</div>\n",
                    styles: [".empty-state{margin:30px auto;text-align:center}.empty-state .empty-state-head{color:var(--text);font-family:\"PrecisionSans_W_Bd\",\"Helvetica Neue\",Arial,sans-serif;font-size:16px;line-height:26px}.empty-state .empty-state-caption{color:var(--text);font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:12px;line-height:18px}.empty-state .empty-state-icon{width:64px;height:64px;margin:10px auto}\n"]
                },] }
    ];
    PbdsEmptyStateComponent.propDecorators = {
        head: [{ type: core.Input }],
        caption: [{ type: core.Input }],
        icon: [{ type: core.Input }]
    };

    var PbdsEmptyStateModule = /** @class */ (function () {
        function PbdsEmptyStateModule() {
        }
        return PbdsEmptyStateModule;
    }());
    PbdsEmptyStateModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [PbdsEmptyStateComponent],
                    imports: [common.CommonModule],
                    exports: [PbdsEmptyStateComponent]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.PbdsEmptyStateComponent = PbdsEmptyStateComponent;
    exports.PbdsEmptyStateModule = PbdsEmptyStateModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pb-design-system-empty-state.umd.js.map

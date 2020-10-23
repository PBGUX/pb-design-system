(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
  typeof define === 'function' && define.amd ? define('pb-design-system/progress-spinner', ['exports', '@angular/core', '@angular/common'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['pb-design-system'] = global['pb-design-system'] || {}, global['pb-design-system']['progress-spinner'] = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

  var PbdsProgressSpinnerComponent = /** @class */ (function () {
      function PbdsProgressSpinnerComponent() {
      }
      return PbdsProgressSpinnerComponent;
  }());
  PbdsProgressSpinnerComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'pbds-progress-spinner',
                  template: "\n    <span role=\"alert\" aria-live=\"assertive\">\n      <span\n        class=\"sbl-circ\"\n        [style.width.px]=\"size\"\n        [style.height.px]=\"size\"\n        [style.border-width.px]=\"size / 8\"\n        aria-hidden=\"true\"\n      ></span>\n      <span class=\"sr-only\">Loading</span>\n    </span>\n  ",
                  styles: [".sbl-circ{animation:rotate 1.5s linear infinite;border-radius:50%;border-style:solid;border-top:solid rgba(0,0,0,0);border-width:6px;color:var(--primary);display:inline-block;height:48px;position:relative;width:48px}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}"]
              },] }
  ];
  PbdsProgressSpinnerComponent.propDecorators = {
      size: [{ type: core.Input }]
  };

  var PbdsProgressSpinnerModule = /** @class */ (function () {
      function PbdsProgressSpinnerModule() {
      }
      return PbdsProgressSpinnerModule;
  }());
  PbdsProgressSpinnerModule.decorators = [
      { type: core.NgModule, args: [{
                  declarations: [PbdsProgressSpinnerComponent],
                  imports: [common.CommonModule],
                  exports: [PbdsProgressSpinnerComponent]
              },] }
  ];

  /**
   * Generated bundle index. Do not edit.
   */

  exports.PbdsProgressSpinnerComponent = PbdsProgressSpinnerComponent;
  exports.PbdsProgressSpinnerModule = PbdsProgressSpinnerModule;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pb-design-system-progress-spinner.umd.js.map

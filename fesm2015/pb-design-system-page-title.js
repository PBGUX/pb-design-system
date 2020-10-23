import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

class PbdsPageTitleComponent {
    constructor() {
        this.layout = 'container';
    }
}
PbdsPageTitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-page-title',
                template: "<div class=\"page-header\">\n  <div class=\"page-title\" [ngClass]=\"layout\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <h1 [ngClass]=\"{ 'mb-0': sub, 'has-sub': sub }\">{{ ttl }}</h1>\n        <h2>{{ sub }}</h2>\n      </div>\n    </div>\n  </div>\n</div>\n",
                styles: [".page-header h1.has-sub{margin-bottom:0;margin-top:85px}.page-title h1.mb-0+h2{font-size:16px;line-height:1.4;margin-bottom:25px}"]
            },] }
];
PbdsPageTitleComponent.propDecorators = {
    ttl: [{ type: Input }],
    sub: [{ type: Input }],
    layout: [{ type: Input }]
};

class PbdsPageTitleModule {
}
PbdsPageTitleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PbdsPageTitleComponent],
                imports: [CommonModule],
                exports: [PbdsPageTitleComponent]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsPageTitleComponent, PbdsPageTitleModule };
//# sourceMappingURL=pb-design-system-page-title.js.map

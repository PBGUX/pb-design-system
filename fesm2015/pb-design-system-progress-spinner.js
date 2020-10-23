import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

class PbdsProgressSpinnerComponent {
}
PbdsProgressSpinnerComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-progress-spinner',
                template: `
    <span role="alert" aria-live="assertive">
      <span
        class="sbl-circ"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.border-width.px]="size / 8"
        aria-hidden="true"
      ></span>
      <span class="sr-only">Loading</span>
    </span>
  `,
                styles: [".sbl-circ{animation:rotate 1.5s linear infinite;border-radius:50%;border-style:solid;border-top:solid rgba(0,0,0,0);border-width:6px;color:var(--primary);display:inline-block;height:48px;position:relative;width:48px}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}"]
            },] }
];
PbdsProgressSpinnerComponent.propDecorators = {
    size: [{ type: Input }]
};

class PbdsProgressSpinnerModule {
}
PbdsProgressSpinnerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PbdsProgressSpinnerComponent],
                imports: [CommonModule],
                exports: [PbdsProgressSpinnerComponent]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsProgressSpinnerComponent, PbdsProgressSpinnerModule };
//# sourceMappingURL=pb-design-system-progress-spinner.js.map

import * as i0 from '@angular/core';
import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

class PbdsProgressSpinnerComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsProgressSpinnerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: PbdsProgressSpinnerComponent, selector: "pbds-progress-spinner", inputs: { size: "size" }, ngImport: i0, template: `
    <span role="alert" aria-live="assertive">
      <span
        class="sbl-circ"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.border-width.px]="size / 8"
        aria-hidden="true"
      ></span>
      <span class="visually-hidden">Loading</span>
    </span>
  `, isInline: true, styles: [".sbl-circ{height:48px;width:48px;color:var(--primary);position:relative;display:inline-block;border-width:6px;border-style:solid;border-radius:50%;border-top-color:transparent;animation:rotate 1.5s linear infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsProgressSpinnerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-progress-spinner', template: `
    <span role="alert" aria-live="assertive">
      <span
        class="sbl-circ"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.border-width.px]="size / 8"
        aria-hidden="true"
      ></span>
      <span class="visually-hidden">Loading</span>
    </span>
  `, styles: [".sbl-circ{height:48px;width:48px;color:var(--primary);position:relative;display:inline-block;border-width:6px;border-style:solid;border-radius:50%;border-top-color:transparent;animation:rotate 1.5s linear infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"] }]
        }], propDecorators: { size: [{
                type: Input
            }] } });

class PbdsProgressSpinnerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsProgressSpinnerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: PbdsProgressSpinnerModule, declarations: [PbdsProgressSpinnerComponent], imports: [CommonModule], exports: [PbdsProgressSpinnerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsProgressSpinnerModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsProgressSpinnerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsProgressSpinnerComponent],
                    imports: [CommonModule],
                    exports: [PbdsProgressSpinnerComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsProgressSpinnerComponent, PbdsProgressSpinnerModule };
//# sourceMappingURL=pb-design-system-progress-spinner.mjs.map

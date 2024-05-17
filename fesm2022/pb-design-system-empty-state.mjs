import * as i0 from '@angular/core';
import { Component, Input, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

class PbdsEmptyStateComponent {
    constructor() {
        this.icon = 'none';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsEmptyStateComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: PbdsEmptyStateComponent, selector: "pbds-empty-state", inputs: { head: "head", caption: "caption", icon: "icon" }, ngImport: i0, template: "<div class=\"empty-state\">\n  <div class=\"empty-state-icon\" *ngIf=\"icon !== 'none'\" aria-hidden=\"true\">\n    <ng-container *ngIf=\"icon === 'list'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M28.5714286 19L48 19M28.5714286 32L48 32M28.5714286 44L48 44M19.4285714 16C21.3222857 16 22.8571429 17.5348571 22.8571429 19.4285714 22.8571429 21.3222857 21.3222857 22.8571429 19.4285714 22.8571429 17.5348571 22.8571429 16 21.3222857 16 19.4285714 16 17.5348571 17.5348571 16 19.4285714 16L19.4285714 16zM19.4285714 28.5714286C21.3222857 28.5714286 22.8571429 30.1062857 22.8571429 32 22.8571429 33.8937143 21.3222857 35.4285714 19.4285714 35.4285714 17.5348571 35.4285714 16 33.8937143 16 32 16 30.1062857 17.5348571 28.5714286 19.4285714 28.5714286L19.4285714 28.5714286zM19.4285714 41.1428571C21.3222857 41.1428571 22.8571429 42.6777143 22.8571429 44.5714286 22.8571429 46.4651429 21.3222857 48 19.4285714 48 17.5348571 48 16 46.4651429 16 44.5714286 16 42.6777143 17.5348571 41.1428571 19.4285714 41.1428571L19.4285714 41.1428571z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n    <ng-container *ngIf=\"icon === 'search'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M49 48L39.6206897 38.6206897M30.2413793 16C37.5544828 16 43.4827586 21.9282759 43.4827586 29.2413793 43.4827586 36.5544828 37.5544828 42.4827586 30.2413793 42.4827586 22.9282759 42.4827586 17 36.5544828 17 29.2413793 17 21.9282759 22.9282759 16 30.2413793 16L30.2413793 16z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n    <ng-container *ngIf=\"icon === 'chart'\">\n      <svg width=\"65\" height=\"64\" viewBox=\"0 0 65 64\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle cx=\"32.9797\" cy=\"32\" r=\"32\" fill=\"#D8DAE4\" />\n        <path\n          fill-rule=\"evenodd\"\n          clip-rule=\"evenodd\"\n          d=\"M15.5252 45.0757H51.8888V47.3485H15.5252V45.0757ZM25.7524 42.803H16.6615V25.7575H25.7524V42.803ZM18.9343 40.5303H23.4797V28.0303H18.9343V40.5303ZM38.2524 42.803H29.1615V13.2576H38.2524V42.803ZM31.4343 40.5303H35.9797V15.5303H31.4343V40.5303ZM50.7524 42.803H41.6615V31.4394H50.7524V42.803ZM43.9343 40.5303H48.4797V33.7121H43.9343V40.5303Z\"\n          fill=\"white\"\n        />\n        <mask\n          id=\"mask0_403_685\"\n          style=\"mask-type: luminance\"\n          maskUnits=\"userSpaceOnUse\"\n          x=\"15\"\n          y=\"13\"\n          width=\"37\"\n          height=\"35\"\n        >\n          <path\n            fill-rule=\"evenodd\"\n            clip-rule=\"evenodd\"\n            d=\"M15.5252 45.0757H51.8888V47.3485H15.5252V45.0757ZM25.7524 42.803H16.6615V25.7575H25.7524V42.803ZM18.9343 40.5303H23.4797V28.0303H18.9343V40.5303ZM38.2524 42.803H29.1615V13.2576H38.2524V42.803ZM31.4343 40.5303H35.9797V15.5303H31.4343V40.5303ZM50.7524 42.803H41.6615V31.4394H50.7524V42.803ZM43.9343 40.5303H48.4797V33.7121H43.9343V40.5303Z\"\n            fill=\"white\"\n          />\n        </mask>\n        <g mask=\"url(#mask0_403_685)\"></g>\n      </svg>\n    </ng-container>\n  </div>\n  <div class=\"empty-state-head\">{{ head }}</div>\n  <div class=\"empty-state-caption\">{{ caption }}</div>\n</div>\n", styles: [".empty-state{margin:30px auto;text-align:center}.empty-state .empty-state-head{color:var(--text);font-family:PrecisionSans_W_Bd,Helvetica Neue,Arial,sans-serif;font-size:16px;line-height:26px}.empty-state .empty-state-caption{color:var(--text);font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px}.empty-state .empty-state-icon{width:64px;height:64px;margin:10px auto}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsEmptyStateComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-empty-state', template: "<div class=\"empty-state\">\n  <div class=\"empty-state-icon\" *ngIf=\"icon !== 'none'\" aria-hidden=\"true\">\n    <ng-container *ngIf=\"icon === 'list'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M28.5714286 19L48 19M28.5714286 32L48 32M28.5714286 44L48 44M19.4285714 16C21.3222857 16 22.8571429 17.5348571 22.8571429 19.4285714 22.8571429 21.3222857 21.3222857 22.8571429 19.4285714 22.8571429 17.5348571 22.8571429 16 21.3222857 16 19.4285714 16 17.5348571 17.5348571 16 19.4285714 16L19.4285714 16zM19.4285714 28.5714286C21.3222857 28.5714286 22.8571429 30.1062857 22.8571429 32 22.8571429 33.8937143 21.3222857 35.4285714 19.4285714 35.4285714 17.5348571 35.4285714 16 33.8937143 16 32 16 30.1062857 17.5348571 28.5714286 19.4285714 28.5714286L19.4285714 28.5714286zM19.4285714 41.1428571C21.3222857 41.1428571 22.8571429 42.6777143 22.8571429 44.5714286 22.8571429 46.4651429 21.3222857 48 19.4285714 48 17.5348571 48 16 46.4651429 16 44.5714286 16 42.6777143 17.5348571 41.1428571 19.4285714 41.1428571L19.4285714 41.1428571z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n    <ng-container *ngIf=\"icon === 'search'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M49 48L39.6206897 38.6206897M30.2413793 16C37.5544828 16 43.4827586 21.9282759 43.4827586 29.2413793 43.4827586 36.5544828 37.5544828 42.4827586 30.2413793 42.4827586 22.9282759 42.4827586 17 36.5544828 17 29.2413793 17 21.9282759 22.9282759 16 30.2413793 16L30.2413793 16z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n    <ng-container *ngIf=\"icon === 'chart'\">\n      <svg width=\"65\" height=\"64\" viewBox=\"0 0 65 64\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle cx=\"32.9797\" cy=\"32\" r=\"32\" fill=\"#D8DAE4\" />\n        <path\n          fill-rule=\"evenodd\"\n          clip-rule=\"evenodd\"\n          d=\"M15.5252 45.0757H51.8888V47.3485H15.5252V45.0757ZM25.7524 42.803H16.6615V25.7575H25.7524V42.803ZM18.9343 40.5303H23.4797V28.0303H18.9343V40.5303ZM38.2524 42.803H29.1615V13.2576H38.2524V42.803ZM31.4343 40.5303H35.9797V15.5303H31.4343V40.5303ZM50.7524 42.803H41.6615V31.4394H50.7524V42.803ZM43.9343 40.5303H48.4797V33.7121H43.9343V40.5303Z\"\n          fill=\"white\"\n        />\n        <mask\n          id=\"mask0_403_685\"\n          style=\"mask-type: luminance\"\n          maskUnits=\"userSpaceOnUse\"\n          x=\"15\"\n          y=\"13\"\n          width=\"37\"\n          height=\"35\"\n        >\n          <path\n            fill-rule=\"evenodd\"\n            clip-rule=\"evenodd\"\n            d=\"M15.5252 45.0757H51.8888V47.3485H15.5252V45.0757ZM25.7524 42.803H16.6615V25.7575H25.7524V42.803ZM18.9343 40.5303H23.4797V28.0303H18.9343V40.5303ZM38.2524 42.803H29.1615V13.2576H38.2524V42.803ZM31.4343 40.5303H35.9797V15.5303H31.4343V40.5303ZM50.7524 42.803H41.6615V31.4394H50.7524V42.803ZM43.9343 40.5303H48.4797V33.7121H43.9343V40.5303Z\"\n            fill=\"white\"\n          />\n        </mask>\n        <g mask=\"url(#mask0_403_685)\"></g>\n      </svg>\n    </ng-container>\n  </div>\n  <div class=\"empty-state-head\">{{ head }}</div>\n  <div class=\"empty-state-caption\">{{ caption }}</div>\n</div>\n", styles: [".empty-state{margin:30px auto;text-align:center}.empty-state .empty-state-head{color:var(--text);font-family:PrecisionSans_W_Bd,Helvetica Neue,Arial,sans-serif;font-size:16px;line-height:26px}.empty-state .empty-state-caption{color:var(--text);font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px}.empty-state .empty-state-icon{width:64px;height:64px;margin:10px auto}\n"] }]
        }], propDecorators: { head: [{
                type: Input
            }], caption: [{
                type: Input
            }], icon: [{
                type: Input
            }] } });

class PbdsEmptyStateModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsEmptyStateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: PbdsEmptyStateModule, declarations: [PbdsEmptyStateComponent], imports: [CommonModule], exports: [PbdsEmptyStateComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsEmptyStateModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsEmptyStateModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsEmptyStateComponent],
                    imports: [CommonModule],
                    exports: [PbdsEmptyStateComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsEmptyStateComponent, PbdsEmptyStateModule };
//# sourceMappingURL=pb-design-system-empty-state.mjs.map

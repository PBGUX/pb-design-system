import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Component, HostBinding, Input, NgModule } from '@angular/core';

class PbdsProgressButtonComponent {
    constructor() {
        this.classPbdsProgressButton = true;
        this.isLoading = false;
        this.isCompleted = false;
    }
    ngOnChanges(changes) {
        if (changes.isLoading.currentValue === false && !changes.isLoading.firstChange) {
            this.isCompleted = true;
            setTimeout(() => {
                this.isCompleted = false;
            }, 1000);
        }
    }
}
PbdsProgressButtonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsProgressButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsProgressButtonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: PbdsProgressButtonComponent, selector: "pbds-progress-button", inputs: { initLabel: "initLabel", btnClasses: "btnClasses", loadingLabel: "loadingLabel", isLoading: "isLoading" }, host: { properties: { "class.pbdsProgressButton": "this.classPbdsProgressButton" } }, usesOnChanges: true, ngImport: i0, template: `
    <button class="{{ btnClasses }}" matRipple type="button">
      <ng-container *ngIf="this.isLoading" aria-live="assertive">
        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 16 16">
          <title>circle anim 3</title>
          <g class="nc-icon-wrapper" fill="currentColor">
            <g class="nc-loop-circle-3-16-icon-f">
              <path
                d="M8 16a8 8 0 1 1 8-8 1 1 0 0 1-2 0 6 6 0 1 0-1.8 4.286 1 1 0 1 1 1.4 1.428A7.956 7.956 0 0 1 8 16z"
                fill="currentColor"
              ></path>
            </g>
            <style>
              .nc-loop-circle-3-16-icon-f {
                --animation-duration: 0.7s;
                transform-origin: 8px 8px;
                animation: nc-loop-circle-3-anim var(--animation-duration) infinite linear;
              }
              @keyframes nc-loop-circle-3-anim {
                0% {
                  transform: rotate(0);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            </style>
          </g>
        </svg>
        {{ loadingLabel }} <span class="visually-hidden">in progress...</span>
      </ng-container>

      <ng-container *ngIf="!this.isLoading">
        {{ this.initLabel }}
      </ng-container>
    </button>
    <div class="visually-hidden" *ngIf="this.isCompleted" aria-live="assertive">{{ this.loadingLabel }} complete,</div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsProgressButtonComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pbds-progress-button',
                    template: `
    <button class="{{ btnClasses }}" matRipple type="button">
      <ng-container *ngIf="this.isLoading" aria-live="assertive">
        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 16 16">
          <title>circle anim 3</title>
          <g class="nc-icon-wrapper" fill="currentColor">
            <g class="nc-loop-circle-3-16-icon-f">
              <path
                d="M8 16a8 8 0 1 1 8-8 1 1 0 0 1-2 0 6 6 0 1 0-1.8 4.286 1 1 0 1 1 1.4 1.428A7.956 7.956 0 0 1 8 16z"
                fill="currentColor"
              ></path>
            </g>
            <style>
              .nc-loop-circle-3-16-icon-f {
                --animation-duration: 0.7s;
                transform-origin: 8px 8px;
                animation: nc-loop-circle-3-anim var(--animation-duration) infinite linear;
              }
              @keyframes nc-loop-circle-3-anim {
                0% {
                  transform: rotate(0);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            </style>
          </g>
        </svg>
        {{ loadingLabel }} <span class="visually-hidden">in progress...</span>
      </ng-container>

      <ng-container *ngIf="!this.isLoading">
        {{ this.initLabel }}
      </ng-container>
    </button>
    <div class="visually-hidden" *ngIf="this.isCompleted" aria-live="assertive">{{ this.loadingLabel }} complete,</div>
  `
                }]
        }], propDecorators: { classPbdsProgressButton: [{
                type: HostBinding,
                args: ['class.pbdsProgressButton']
            }], initLabel: [{
                type: Input
            }], btnClasses: [{
                type: Input
            }], loadingLabel: [{
                type: Input
            }], isLoading: [{
                type: Input
            }] } });

class PbdsProgressButtonModule {
}
PbdsProgressButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsProgressButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsProgressButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: PbdsProgressButtonModule, declarations: [PbdsProgressButtonComponent], imports: [CommonModule], exports: [PbdsProgressButtonComponent] });
PbdsProgressButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsProgressButtonModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsProgressButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsProgressButtonComponent],
                    imports: [CommonModule],
                    exports: [PbdsProgressButtonComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsProgressButtonComponent, PbdsProgressButtonModule };
//# sourceMappingURL=pb-design-system-progress-button.mjs.map

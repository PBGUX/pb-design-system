import { Component, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class PbdsProgressButtonComponent {
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
PbdsProgressButtonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsProgressButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsProgressButtonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: PbdsProgressButtonComponent, selector: "pbds-progress-button", inputs: { initLabel: "initLabel", btnClasses: "btnClasses", loadingLabel: "loadingLabel", isLoading: "isLoading" }, host: { properties: { "class.pbdsProgressButton": "this.classPbdsProgressButton" } }, usesOnChanges: true, ngImport: i0, template: `
    <button class="{{ btnClasses }}" matRipple type="button">
      <ng-container *ngIf="this.isLoading" aria-live="assertive">
        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 16 16">
          <title>circle anim 3</title>
          <g fill="currentColor" class="nc-icon-wrapper">
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
        {{ loadingLabel }} <span class="sr-only">in progress...</span>
      </ng-container>

      <ng-container *ngIf="!this.isLoading">
        {{ this.initLabel }}
      </ng-container>
    </button>
    <div *ngIf="this.isCompleted" aria-live="assertive" class="sr-only">{{ this.loadingLabel }} complete,</div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsProgressButtonComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pbds-progress-button',
                    template: `
    <button class="{{ btnClasses }}" matRipple type="button">
      <ng-container *ngIf="this.isLoading" aria-live="assertive">
        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 16 16">
          <title>circle anim 3</title>
          <g fill="currentColor" class="nc-icon-wrapper">
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
        {{ loadingLabel }} <span class="sr-only">in progress...</span>
      </ng-container>

      <ng-container *ngIf="!this.isLoading">
        {{ this.initLabel }}
      </ng-container>
    </button>
    <div *ngIf="this.isCompleted" aria-live="assertive" class="sr-only">{{ this.loadingLabel }} complete,</div>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vcHJvZ3Jlc3MtYnV0dG9uL3Byb2dyZXNzLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUE0QixNQUFNLGVBQWUsQ0FBQzs7O0FBMkN4RixNQUFNLE9BQU8sMkJBQTJCO0lBekN4QztRQTBDMkMsNEJBQXVCLEdBQUcsSUFBSSxDQUFDO1FBUS9ELGNBQVMsR0FBWSxLQUFLLENBQUM7UUFFcEMsZ0JBQVcsR0FBWSxLQUFLLENBQUM7S0FVOUI7SUFSQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRTtZQUM5RSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQzNCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQzs7eUhBcEJVLDJCQUEyQjs2R0FBM0IsMkJBQTJCLDJSQXZDNUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQ1Q7NEZBRVUsMkJBQTJCO2tCQXpDdkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQ1Q7aUJBQ0Y7OEJBRTBDLHVCQUF1QjtzQkFBL0QsV0FBVzt1QkFBQywwQkFBMEI7Z0JBRTlCLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLFNBQVM7c0JBQWpCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtcHJvZ3Jlc3MtYnV0dG9uJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YnV0dG9uIGNsYXNzPVwie3sgYnRuQ2xhc3NlcyB9fVwiIG1hdFJpcHBsZSB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwidGhpcy5pc0xvYWRpbmdcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIj5cbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMTRcIiB3aWR0aD1cIjE0XCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPlxuICAgICAgICAgIDx0aXRsZT5jaXJjbGUgYW5pbSAzPC90aXRsZT5cbiAgICAgICAgICA8ZyBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJuYy1pY29uLXdyYXBwZXJcIj5cbiAgICAgICAgICAgIDxnIGNsYXNzPVwibmMtbG9vcC1jaXJjbGUtMy0xNi1pY29uLWZcIj5cbiAgICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICBkPVwiTTggMTZhOCA4IDAgMSAxIDgtOCAxIDEgMCAwIDEtMiAwIDYgNiAwIDEgMC0xLjggNC4yODYgMSAxIDAgMSAxIDEuNCAxLjQyOEE3Ljk1NiA3Ljk1NiAwIDAgMSA4IDE2elwiXG4gICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgID48L3BhdGg+XG4gICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgICAgIC5uYy1sb29wLWNpcmNsZS0zLTE2LWljb24tZiB7XG4gICAgICAgICAgICAgICAgLS1hbmltYXRpb24tZHVyYXRpb246IDAuN3M7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogOHB4IDhweDtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IG5jLWxvb3AtY2lyY2xlLTMtYW5pbSB2YXIoLS1hbmltYXRpb24tZHVyYXRpb24pIGluZmluaXRlIGxpbmVhcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBAa2V5ZnJhbWVzIG5jLWxvb3AtY2lyY2xlLTMtYW5pbSB7XG4gICAgICAgICAgICAgICAgMCUge1xuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDEwMCUge1xuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPC9nPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAge3sgbG9hZGluZ0xhYmVsIH19IDxzcGFuIGNsYXNzPVwic3Itb25seVwiPmluIHByb2dyZXNzLi4uPC9zcGFuPlxuICAgICAgPC9uZy1jb250YWluZXI+XG5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhdGhpcy5pc0xvYWRpbmdcIj5cbiAgICAgICAge3sgdGhpcy5pbml0TGFiZWwgfX1cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvYnV0dG9uPlxuICAgIDxkaXYgKm5nSWY9XCJ0aGlzLmlzQ29tcGxldGVkXCIgYXJpYS1saXZlPVwiYXNzZXJ0aXZlXCIgY2xhc3M9XCJzci1vbmx5XCI+e3sgdGhpcy5sb2FkaW5nTGFiZWwgfX0gY29tcGxldGUsPC9kaXY+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgUGJkc1Byb2dyZXNzQnV0dG9uQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzUHJvZ3Jlc3NCdXR0b24nKSBjbGFzc1BiZHNQcm9ncmVzc0J1dHRvbiA9IHRydWU7XG5cbiAgQElucHV0KCkgaW5pdExhYmVsOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgYnRuQ2xhc3Nlczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGxvYWRpbmdMYWJlbDogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGlzQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmlzTG9hZGluZy5jdXJyZW50VmFsdWUgPT09IGZhbHNlICYmICFjaGFuZ2VzLmlzTG9hZGluZy5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICB9XG59XG4iXX0=
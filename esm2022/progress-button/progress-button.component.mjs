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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsProgressButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: PbdsProgressButtonComponent, selector: "pbds-progress-button", inputs: { initLabel: "initLabel", btnClasses: "btnClasses", loadingLabel: "loadingLabel", isLoading: "isLoading" }, host: { properties: { "class.pbdsProgressButton": "this.classPbdsProgressButton" } }, usesOnChanges: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsProgressButtonComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vcHJvZ3Jlc3MtYnV0dG9uL3Byb2dyZXNzLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUE0QixNQUFNLGVBQWUsQ0FBQzs7O0FBMkN4RixNQUFNLE9BQU8sMkJBQTJCO0lBekN4QztRQTBDMkMsNEJBQXVCLEdBQUcsSUFBSSxDQUFDO1FBUS9ELGNBQVMsR0FBWSxLQUFLLENBQUM7UUFFcEMsZ0JBQVcsR0FBWSxLQUFLLENBQUM7S0FVOUI7SUFSQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRTtZQUM5RSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQzNCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQzsrR0FwQlUsMkJBQTJCO21HQUEzQiwyQkFBMkIsMlJBdkM1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFDVDs7NEZBRVUsMkJBQTJCO2tCQXpDdkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQ1Q7aUJBQ0Y7OEJBRTBDLHVCQUF1QjtzQkFBL0QsV0FBVzt1QkFBQywwQkFBMEI7Z0JBRTlCLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLFNBQVM7c0JBQWpCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtcHJvZ3Jlc3MtYnV0dG9uJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YnV0dG9uIGNsYXNzPVwie3sgYnRuQ2xhc3NlcyB9fVwiIG1hdFJpcHBsZSB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwidGhpcy5pc0xvYWRpbmdcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIj5cbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMTRcIiB3aWR0aD1cIjE0XCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPlxuICAgICAgICAgIDx0aXRsZT5jaXJjbGUgYW5pbSAzPC90aXRsZT5cbiAgICAgICAgICA8ZyBjbGFzcz1cIm5jLWljb24td3JhcHBlclwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj5cbiAgICAgICAgICAgIDxnIGNsYXNzPVwibmMtbG9vcC1jaXJjbGUtMy0xNi1pY29uLWZcIj5cbiAgICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICBkPVwiTTggMTZhOCA4IDAgMSAxIDgtOCAxIDEgMCAwIDEtMiAwIDYgNiAwIDEgMC0xLjggNC4yODYgMSAxIDAgMSAxIDEuNCAxLjQyOEE3Ljk1NiA3Ljk1NiAwIDAgMSA4IDE2elwiXG4gICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgID48L3BhdGg+XG4gICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgICAgIC5uYy1sb29wLWNpcmNsZS0zLTE2LWljb24tZiB7XG4gICAgICAgICAgICAgICAgLS1hbmltYXRpb24tZHVyYXRpb246IDAuN3M7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogOHB4IDhweDtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IG5jLWxvb3AtY2lyY2xlLTMtYW5pbSB2YXIoLS1hbmltYXRpb24tZHVyYXRpb24pIGluZmluaXRlIGxpbmVhcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBAa2V5ZnJhbWVzIG5jLWxvb3AtY2lyY2xlLTMtYW5pbSB7XG4gICAgICAgICAgICAgICAgMCUge1xuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDEwMCUge1xuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPC9nPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAge3sgbG9hZGluZ0xhYmVsIH19IDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+aW4gcHJvZ3Jlc3MuLi48L3NwYW4+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiF0aGlzLmlzTG9hZGluZ1wiPlxuICAgICAgICB7eyB0aGlzLmluaXRMYWJlbCB9fVxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9idXR0b24+XG4gICAgPGRpdiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiICpuZ0lmPVwidGhpcy5pc0NvbXBsZXRlZFwiIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiPnt7IHRoaXMubG9hZGluZ0xhYmVsIH19IGNvbXBsZXRlLDwvZGl2PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNQcm9ncmVzc0J1dHRvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkc1Byb2dyZXNzQnV0dG9uJykgY2xhc3NQYmRzUHJvZ3Jlc3NCdXR0b24gPSB0cnVlO1xuXG4gIEBJbnB1dCgpIGluaXRMYWJlbDogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGJ0bkNsYXNzZXM6IHN0cmluZztcblxuICBASW5wdXQoKSBsb2FkaW5nTGFiZWw6IHN0cmluZztcblxuICBASW5wdXQoKSBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBpc0NvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5pc0xvYWRpbmcuY3VycmVudFZhbHVlID09PSBmYWxzZSAmJiAhY2hhbmdlcy5pc0xvYWRpbmcuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH1cbiAgfVxufVxuIl19
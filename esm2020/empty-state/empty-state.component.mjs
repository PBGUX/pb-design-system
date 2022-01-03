import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class PbdsEmptyStateComponent {
    constructor() {
        this.icon = 'none';
    }
}
PbdsEmptyStateComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PbdsEmptyStateComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsEmptyStateComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.2", type: PbdsEmptyStateComponent, selector: "pbds-empty-state", inputs: { head: "head", caption: "caption", icon: "icon" }, ngImport: i0, template: "<div class=\"empty-state\">\n  <div class=\"empty-state-icon\" aria-hidden=\"true\" *ngIf=\"icon !== 'none'\">\n    <ng-container *ngIf=\"icon === 'list'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M28.5714286 19L48 19M28.5714286 32L48 32M28.5714286 44L48 44M19.4285714 16C21.3222857 16 22.8571429 17.5348571 22.8571429 19.4285714 22.8571429 21.3222857 21.3222857 22.8571429 19.4285714 22.8571429 17.5348571 22.8571429 16 21.3222857 16 19.4285714 16 17.5348571 17.5348571 16 19.4285714 16L19.4285714 16zM19.4285714 28.5714286C21.3222857 28.5714286 22.8571429 30.1062857 22.8571429 32 22.8571429 33.8937143 21.3222857 35.4285714 19.4285714 35.4285714 17.5348571 35.4285714 16 33.8937143 16 32 16 30.1062857 17.5348571 28.5714286 19.4285714 28.5714286L19.4285714 28.5714286zM19.4285714 41.1428571C21.3222857 41.1428571 22.8571429 42.6777143 22.8571429 44.5714286 22.8571429 46.4651429 21.3222857 48 19.4285714 48 17.5348571 48 16 46.4651429 16 44.5714286 16 42.6777143 17.5348571 41.1428571 19.4285714 41.1428571L19.4285714 41.1428571z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n    <ng-container *ngIf=\"icon === 'search'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M49 48L39.6206897 38.6206897M30.2413793 16C37.5544828 16 43.4827586 21.9282759 43.4827586 29.2413793 43.4827586 36.5544828 37.5544828 42.4827586 30.2413793 42.4827586 22.9282759 42.4827586 17 36.5544828 17 29.2413793 17 21.9282759 22.9282759 16 30.2413793 16L30.2413793 16z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n  </div>\n  <div class=\"empty-state-head\">{{ head }}</div>\n  <div class=\"empty-state-caption\">{{ caption }}</div>\n</div>\n", styles: [".empty-state{margin:30px auto;text-align:center}.empty-state .empty-state-head{color:var(--text);font-family:PrecisionSans_W_Bd,Helvetica Neue,Arial,sans-serif;font-size:16px;line-height:26px}.empty-state .empty-state-caption{color:var(--text);font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px}.empty-state .empty-state-icon{width:64px;height:64px;margin:10px auto}\n"], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PbdsEmptyStateComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-empty-state', template: "<div class=\"empty-state\">\n  <div class=\"empty-state-icon\" aria-hidden=\"true\" *ngIf=\"icon !== 'none'\">\n    <ng-container *ngIf=\"icon === 'list'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M28.5714286 19L48 19M28.5714286 32L48 32M28.5714286 44L48 44M19.4285714 16C21.3222857 16 22.8571429 17.5348571 22.8571429 19.4285714 22.8571429 21.3222857 21.3222857 22.8571429 19.4285714 22.8571429 17.5348571 22.8571429 16 21.3222857 16 19.4285714 16 17.5348571 17.5348571 16 19.4285714 16L19.4285714 16zM19.4285714 28.5714286C21.3222857 28.5714286 22.8571429 30.1062857 22.8571429 32 22.8571429 33.8937143 21.3222857 35.4285714 19.4285714 35.4285714 17.5348571 35.4285714 16 33.8937143 16 32 16 30.1062857 17.5348571 28.5714286 19.4285714 28.5714286L19.4285714 28.5714286zM19.4285714 41.1428571C21.3222857 41.1428571 22.8571429 42.6777143 22.8571429 44.5714286 22.8571429 46.4651429 21.3222857 48 19.4285714 48 17.5348571 48 16 46.4651429 16 44.5714286 16 42.6777143 17.5348571 41.1428571 19.4285714 41.1428571L19.4285714 41.1428571z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n    <ng-container *ngIf=\"icon === 'search'\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\">\n        <g fill=\"none\" fill-rule=\"evenodd\">\n          <circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"var(--rich300)\" />\n          <path\n            stroke=\"#FFFFFF\"\n            stroke-width=\"3\"\n            d=\"M49 48L39.6206897 38.6206897M30.2413793 16C37.5544828 16 43.4827586 21.9282759 43.4827586 29.2413793 43.4827586 36.5544828 37.5544828 42.4827586 30.2413793 42.4827586 22.9282759 42.4827586 17 36.5544828 17 29.2413793 17 21.9282759 22.9282759 16 30.2413793 16L30.2413793 16z\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n          />\n        </g>\n      </svg>\n    </ng-container>\n  </div>\n  <div class=\"empty-state-head\">{{ head }}</div>\n  <div class=\"empty-state-caption\">{{ caption }}</div>\n</div>\n", styles: [".empty-state{margin:30px auto;text-align:center}.empty-state .empty-state-head{color:var(--text);font-family:PrecisionSans_W_Bd,Helvetica Neue,Arial,sans-serif;font-size:16px;line-height:26px}.empty-state .empty-state-caption{color:var(--text);font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px}.empty-state .empty-state-icon{width:64px;height:64px;margin:10px auto}\n"] }]
        }], propDecorators: { head: [{
                type: Input
            }], caption: [{
                type: Input
            }], icon: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHktc3RhdGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9lbXB0eS1zdGF0ZS9lbXB0eS1zdGF0ZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2VtcHR5LXN0YXRlL2VtcHR5LXN0YXRlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFPakQsTUFBTSxPQUFPLHVCQUF1QjtJQUxwQztRQVFXLFNBQUksR0FBRyxNQUFNLENBQUM7S0FDeEI7O29IQUpZLHVCQUF1Qjt3R0FBdkIsdUJBQXVCLG9IQ1BwQyxvMEVBa0NBOzJGRDNCYSx1QkFBdUI7a0JBTG5DLFNBQVM7K0JBQ0Usa0JBQWtCOzhCQUtuQixJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1lbXB0eS1zdGF0ZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9lbXB0eS1zdGF0ZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2VtcHR5LXN0YXRlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0VtcHR5U3RhdGVDb21wb25lbnQge1xuICBASW5wdXQoKSBoZWFkOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGNhcHRpb24/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGljb24gPSAnbm9uZSc7XG59XG4iLCI8ZGl2IGNsYXNzPVwiZW1wdHktc3RhdGVcIj5cbiAgPGRpdiBjbGFzcz1cImVtcHR5LXN0YXRlLWljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIiAqbmdJZj1cImljb24gIT09ICdub25lJ1wiPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpY29uID09PSAnbGlzdCdcIj5cbiAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiNjRcIiBoZWlnaHQ9XCI2NFwiIHZpZXdCb3g9XCIwIDAgNjQgNjRcIj5cbiAgICAgICAgPGcgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+XG4gICAgICAgICAgPGNpcmNsZSBjeD1cIjMyXCIgY3k9XCIzMlwiIHI9XCIzMlwiIGZpbGw9XCJ2YXIoLS1yaWNoMzAwKVwiIC8+XG4gICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgIHN0cm9rZT1cIiNGRkZGRkZcIlxuICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiM1wiXG4gICAgICAgICAgICBkPVwiTTI4LjU3MTQyODYgMTlMNDggMTlNMjguNTcxNDI4NiAzMkw0OCAzMk0yOC41NzE0Mjg2IDQ0TDQ4IDQ0TTE5LjQyODU3MTQgMTZDMjEuMzIyMjg1NyAxNiAyMi44NTcxNDI5IDE3LjUzNDg1NzEgMjIuODU3MTQyOSAxOS40Mjg1NzE0IDIyLjg1NzE0MjkgMjEuMzIyMjg1NyAyMS4zMjIyODU3IDIyLjg1NzE0MjkgMTkuNDI4NTcxNCAyMi44NTcxNDI5IDE3LjUzNDg1NzEgMjIuODU3MTQyOSAxNiAyMS4zMjIyODU3IDE2IDE5LjQyODU3MTQgMTYgMTcuNTM0ODU3MSAxNy41MzQ4NTcxIDE2IDE5LjQyODU3MTQgMTZMMTkuNDI4NTcxNCAxNnpNMTkuNDI4NTcxNCAyOC41NzE0Mjg2QzIxLjMyMjI4NTcgMjguNTcxNDI4NiAyMi44NTcxNDI5IDMwLjEwNjI4NTcgMjIuODU3MTQyOSAzMiAyMi44NTcxNDI5IDMzLjg5MzcxNDMgMjEuMzIyMjg1NyAzNS40Mjg1NzE0IDE5LjQyODU3MTQgMzUuNDI4NTcxNCAxNy41MzQ4NTcxIDM1LjQyODU3MTQgMTYgMzMuODkzNzE0MyAxNiAzMiAxNiAzMC4xMDYyODU3IDE3LjUzNDg1NzEgMjguNTcxNDI4NiAxOS40Mjg1NzE0IDI4LjU3MTQyODZMMTkuNDI4NTcxNCAyOC41NzE0Mjg2ek0xOS40Mjg1NzE0IDQxLjE0Mjg1NzFDMjEuMzIyMjg1NyA0MS4xNDI4NTcxIDIyLjg1NzE0MjkgNDIuNjc3NzE0MyAyMi44NTcxNDI5IDQ0LjU3MTQyODYgMjIuODU3MTQyOSA0Ni40NjUxNDI5IDIxLjMyMjI4NTcgNDggMTkuNDI4NTcxNCA0OCAxNy41MzQ4NTcxIDQ4IDE2IDQ2LjQ2NTE0MjkgMTYgNDQuNTcxNDI4NiAxNiA0Mi42Nzc3MTQzIDE3LjUzNDg1NzEgNDEuMTQyODU3MSAxOS40Mjg1NzE0IDQxLjE0Mjg1NzFMMTkuNDI4NTcxNCA0MS4xNDI4NTcxelwiXG4gICAgICAgICAgICBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaWNvbiA9PT0gJ3NlYXJjaCdcIj5cbiAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiNjRcIiBoZWlnaHQ9XCI2NFwiIHZpZXdCb3g9XCIwIDAgNjQgNjRcIj5cbiAgICAgICAgPGcgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+XG4gICAgICAgICAgPGNpcmNsZSBjeD1cIjMyXCIgY3k9XCIzMlwiIHI9XCIzMlwiIGZpbGw9XCJ2YXIoLS1yaWNoMzAwKVwiIC8+XG4gICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgIHN0cm9rZT1cIiNGRkZGRkZcIlxuICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiM1wiXG4gICAgICAgICAgICBkPVwiTTQ5IDQ4TDM5LjYyMDY4OTcgMzguNjIwNjg5N00zMC4yNDEzNzkzIDE2QzM3LjU1NDQ4MjggMTYgNDMuNDgyNzU4NiAyMS45MjgyNzU5IDQzLjQ4Mjc1ODYgMjkuMjQxMzc5MyA0My40ODI3NTg2IDM2LjU1NDQ4MjggMzcuNTU0NDgyOCA0Mi40ODI3NTg2IDMwLjI0MTM3OTMgNDIuNDgyNzU4NiAyMi45MjgyNzU5IDQyLjQ4Mjc1ODYgMTcgMzYuNTU0NDgyOCAxNyAyOS4yNDEzNzkzIDE3IDIxLjkyODI3NTkgMjIuOTI4Mjc1OSAxNiAzMC4yNDEzNzkzIDE2TDMwLjI0MTM3OTMgMTZ6XCJcbiAgICAgICAgICAgIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvbmctY29udGFpbmVyPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImVtcHR5LXN0YXRlLWhlYWRcIj57eyBoZWFkIH19PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJlbXB0eS1zdGF0ZS1jYXB0aW9uXCI+e3sgY2FwdGlvbiB9fTwvZGl2PlxuPC9kaXY+XG4iXX0=
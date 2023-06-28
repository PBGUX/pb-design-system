import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ErrorIconClockComponent {
}
ErrorIconClockComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: ErrorIconClockComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ErrorIconClockComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: ErrorIconClockComponent, selector: "pbds-error-icon-clock", inputs: { static: "static" }, ngImport: i0, template: "<svg\n  [ngClass]=\"{ static: static }\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  xml:space=\"preserve\"\n  style=\"enable-background: new 0 0 155.4 149.1\"\n  viewBox=\"0 0 155.4 149.1\"\n>\n  <defs>\n    <linearGradient id=\"a\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop stop-color=\"var(--primary)\" offset=\"0%\" />\n      <stop stop-color=\"var(--secondary)\" offset=\"100%\" />\n    </linearGradient>\n  </defs>\n\n  <style>\n    #outer_circle {\n      transform-origin: center;\n      animation: spinner_StKS 6s 1 linear;\n      animation-direction: reverse;\n    }\n    #inner_circle {\n      transform-origin: center;\n      animation: spinner_StKS 6s 1 linear;\n    }\n    .static #inner_circle,\n    .static #outer_circle {\n      animation: none;\n    }\n\n    @keyframes spinner_StKS {\n      100% {\n        transform: rotate(360deg);\n      }\n    }\n  </style>\n  <rect width=\"160\" height=\"160\" fill=\"url(#a)\" mask=\"url(#icon)\"></rect>\n  <mask id=\"icon\">\n    <g id=\"clock\" fill=\"#fff\">\n      <path\n        class=\"st0\"\n        d=\"M77.5 45.4c.8 0 1.4.6 1.5 1.4v3.7c0 .8-.7 1.5-1.5 1.5s-1.4-.6-1.5-1.4v-3.7c0-.8.7-1.5 1.5-1.5zM105.9 74.6c.8 0 1.5.7 1.5 1.5s-.6 1.4-1.4 1.5h-3.7c-.8 0-1.5-.7-1.5-1.5s.6-1.4 1.4-1.5h3.7zM77.5 99c.8 0 1.4.6 1.5 1.4v3.7c0 .8-.7 1.5-1.5 1.5s-1.4-.6-1.5-1.4v-3.7c0-.8.7-1.5 1.5-1.5zM52.6 74.6c.8 0 1.5.7 1.5 1.5s-.6 1.4-1.4 1.5H49c-.8 0-1.5-.7-1.5-1.5s.6-1.4 1.4-1.5h3.7z\"\n      />\n      <path\n        class=\"st0\"\n        d=\"M77.5 112.8c-20.4 0-37-16.6-37-37s16.6-37.1 37-37.1 37.1 16.6 37.1 37.1-16.7 37-37.1 37zm0-71.1c-18.8 0-34 15.3-34 34.1s15.3 34 34 34c18.8 0 34.1-15.3 34.1-34S96.3 41.7 77.5 41.7z\"\n      />\n      <path\n        d=\"M91.5 62c-.5-.6-1.3-.5-1.8 0l-8.3 9c-1.1-.8-2.4-1.4-3.9-1.4-1.1 0-2.1.3-2.9.7 0-.1-.1-.1-.1-.2L59.3 56l-.1-.1c-.6-.4-1.4-.4-1.9.1-.6.5-.6 1.4 0 1.9l15.1 14.3.1.1c-.8 1-1.2 2.3-1.2 3.7 0 3.5 2.8 6.3 6.2 6.3 3.4 0 6.2-2.8 6.2-6.3 0-1-.2-1.9-.7-2.8l8.4-9.2.1-.1c.5-.6.4-1.4 0-1.9zm-14 17.2c-1.8 0-3.2-1.5-3.2-3.3s1.5-3.3 3.2-3.3 3.2 1.5 3.2 3.3-1.4 3.3-3.2 3.3z\"\n        style=\"fill-rule: evenodd; clip-rule: evenodd\"\n      />\n    </g>\n    <g id=\"outer_circle\" fill=\"#fff\">\n      <path\n        d=\"M55.3 145c-.2 0-.3 0-.5-.1-17.2-5.7-31.7-17.5-40.6-33.4-.4-.7-.2-1.6.6-2 .7-.4 1.6-.2 2 .6 8.6 15.2 22.4 26.6 38.9 32 .8.3 1.2 1.1 1 1.9-.2.6-.8 1-1.4 1zM99.6 145c-.6 0-1.2-.4-1.4-1-.3-.8.2-1.6 1-1.9 28.7-9.4 47.9-36 47.9-66.2 0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5c0 31.5-20.1 59.2-50 69-.2.1-.3.1-.5.1zM6.5 81.8c-.8 0-1.4-.6-1.5-1.4-.1-1.5-.1-3-.1-4.5 0-40 32.6-72.6 72.6-72.6 12.8 0 25.4 3.4 36.4 9.8.7.4 1 1.3.5 2.1-.4.7-1.3 1-2.1.5-10.6-6.1-22.6-9.4-34.9-9.4-38.3 0-69.5 31.2-69.5 69.6 0 1.4 0 2.9.1 4.3.1.9-.5 1.6-1.5 1.6.1 0 .1 0 0 0z\"\n      />\n    </g>\n    <g id=\"inner_circle\" fill=\"#fff\">\n      <path\n        d=\"M131.8 54.4c-.6 0-1.1-.3-1.4-.9-9-21.3-29.8-35-52.9-35-10.6 0-21 2.9-30 8.4-.7.4-1.6.2-2.1-.5-.4-.7-.2-1.6.5-2.1 9.5-5.8 20.4-8.9 31.6-8.9 24.3 0 46.2 14.5 55.7 36.9.3.8 0 1.6-.8 2-.2 0-.4.1-.6.1zM77.5 136.4c-33.4 0-60.5-27.1-60.5-60.5 0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5c0 31.7 25.8 57.5 57.5 57.5 25.7 0 48.5-17.3 55.4-42.1.2-.8 1-1.3 1.8-1 .8.2 1.3 1 1 1.8-7.1 26.1-31.1 44.3-58.2 44.3z\"\n      />\n    </g>\n  </mask>\n</svg>\n", styles: [":host{display:block;width:150px;height:150px;margin:0 auto}svg{overflow:visible}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: ErrorIconClockComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-error-icon-clock', template: "<svg\n  [ngClass]=\"{ static: static }\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  xml:space=\"preserve\"\n  style=\"enable-background: new 0 0 155.4 149.1\"\n  viewBox=\"0 0 155.4 149.1\"\n>\n  <defs>\n    <linearGradient id=\"a\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop stop-color=\"var(--primary)\" offset=\"0%\" />\n      <stop stop-color=\"var(--secondary)\" offset=\"100%\" />\n    </linearGradient>\n  </defs>\n\n  <style>\n    #outer_circle {\n      transform-origin: center;\n      animation: spinner_StKS 6s 1 linear;\n      animation-direction: reverse;\n    }\n    #inner_circle {\n      transform-origin: center;\n      animation: spinner_StKS 6s 1 linear;\n    }\n    .static #inner_circle,\n    .static #outer_circle {\n      animation: none;\n    }\n\n    @keyframes spinner_StKS {\n      100% {\n        transform: rotate(360deg);\n      }\n    }\n  </style>\n  <rect width=\"160\" height=\"160\" fill=\"url(#a)\" mask=\"url(#icon)\"></rect>\n  <mask id=\"icon\">\n    <g id=\"clock\" fill=\"#fff\">\n      <path\n        class=\"st0\"\n        d=\"M77.5 45.4c.8 0 1.4.6 1.5 1.4v3.7c0 .8-.7 1.5-1.5 1.5s-1.4-.6-1.5-1.4v-3.7c0-.8.7-1.5 1.5-1.5zM105.9 74.6c.8 0 1.5.7 1.5 1.5s-.6 1.4-1.4 1.5h-3.7c-.8 0-1.5-.7-1.5-1.5s.6-1.4 1.4-1.5h3.7zM77.5 99c.8 0 1.4.6 1.5 1.4v3.7c0 .8-.7 1.5-1.5 1.5s-1.4-.6-1.5-1.4v-3.7c0-.8.7-1.5 1.5-1.5zM52.6 74.6c.8 0 1.5.7 1.5 1.5s-.6 1.4-1.4 1.5H49c-.8 0-1.5-.7-1.5-1.5s.6-1.4 1.4-1.5h3.7z\"\n      />\n      <path\n        class=\"st0\"\n        d=\"M77.5 112.8c-20.4 0-37-16.6-37-37s16.6-37.1 37-37.1 37.1 16.6 37.1 37.1-16.7 37-37.1 37zm0-71.1c-18.8 0-34 15.3-34 34.1s15.3 34 34 34c18.8 0 34.1-15.3 34.1-34S96.3 41.7 77.5 41.7z\"\n      />\n      <path\n        d=\"M91.5 62c-.5-.6-1.3-.5-1.8 0l-8.3 9c-1.1-.8-2.4-1.4-3.9-1.4-1.1 0-2.1.3-2.9.7 0-.1-.1-.1-.1-.2L59.3 56l-.1-.1c-.6-.4-1.4-.4-1.9.1-.6.5-.6 1.4 0 1.9l15.1 14.3.1.1c-.8 1-1.2 2.3-1.2 3.7 0 3.5 2.8 6.3 6.2 6.3 3.4 0 6.2-2.8 6.2-6.3 0-1-.2-1.9-.7-2.8l8.4-9.2.1-.1c.5-.6.4-1.4 0-1.9zm-14 17.2c-1.8 0-3.2-1.5-3.2-3.3s1.5-3.3 3.2-3.3 3.2 1.5 3.2 3.3-1.4 3.3-3.2 3.3z\"\n        style=\"fill-rule: evenodd; clip-rule: evenodd\"\n      />\n    </g>\n    <g id=\"outer_circle\" fill=\"#fff\">\n      <path\n        d=\"M55.3 145c-.2 0-.3 0-.5-.1-17.2-5.7-31.7-17.5-40.6-33.4-.4-.7-.2-1.6.6-2 .7-.4 1.6-.2 2 .6 8.6 15.2 22.4 26.6 38.9 32 .8.3 1.2 1.1 1 1.9-.2.6-.8 1-1.4 1zM99.6 145c-.6 0-1.2-.4-1.4-1-.3-.8.2-1.6 1-1.9 28.7-9.4 47.9-36 47.9-66.2 0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5c0 31.5-20.1 59.2-50 69-.2.1-.3.1-.5.1zM6.5 81.8c-.8 0-1.4-.6-1.5-1.4-.1-1.5-.1-3-.1-4.5 0-40 32.6-72.6 72.6-72.6 12.8 0 25.4 3.4 36.4 9.8.7.4 1 1.3.5 2.1-.4.7-1.3 1-2.1.5-10.6-6.1-22.6-9.4-34.9-9.4-38.3 0-69.5 31.2-69.5 69.6 0 1.4 0 2.9.1 4.3.1.9-.5 1.6-1.5 1.6.1 0 .1 0 0 0z\"\n      />\n    </g>\n    <g id=\"inner_circle\" fill=\"#fff\">\n      <path\n        d=\"M131.8 54.4c-.6 0-1.1-.3-1.4-.9-9-21.3-29.8-35-52.9-35-10.6 0-21 2.9-30 8.4-.7.4-1.6.2-2.1-.5-.4-.7-.2-1.6.5-2.1 9.5-5.8 20.4-8.9 31.6-8.9 24.3 0 46.2 14.5 55.7 36.9.3.8 0 1.6-.8 2-.2 0-.4.1-.6.1zM77.5 136.4c-33.4 0-60.5-27.1-60.5-60.5 0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5c0 31.7 25.8 57.5 57.5 57.5 25.7 0 48.5-17.3 55.4-42.1.2-.8 1-1.3 1.8-1 .8.2 1.3 1 1 1.8-7.1 26.1-31.1 44.3-58.2 44.3z\"\n      />\n    </g>\n  </mask>\n</svg>\n", styles: [":host{display:block;width:150px;height:150px;margin:0 auto}svg{overflow:visible}\n"] }]
        }], propDecorators: { static: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItaWNvbi1jbG9jay5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2Vycm9yLWljb25zL2Vycm9yLWljb24tY2xvY2suY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9lcnJvci1pY29ucy9lcnJvci1pY29uLWNsb2NrLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFtQmpELE1BQU0sT0FBTyx1QkFBdUI7O29IQUF2Qix1QkFBdUI7d0dBQXZCLHVCQUF1QiwyRkNuQnBDLGt1R0ErREE7MkZENUNhLHVCQUF1QjtrQkFqQm5DLFNBQVM7K0JBQ0UsdUJBQXVCOzhCQWlCeEIsTUFBTTtzQkFBZCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWVycm9yLWljb24tY2xvY2snLFxuICB0ZW1wbGF0ZVVybDogJy4vZXJyb3ItaWNvbi1jbG9jay5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIHdpZHRoOiAxNTBweDtcbiAgICAgICAgaGVpZ2h0OiAxNTBweDtcbiAgICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgICB9XG4gICAgICBzdmcge1xuICAgICAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICAgIH1cbiAgICBgXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRXJyb3JJY29uQ2xvY2tDb21wb25lbnQge1xuICBASW5wdXQoKSBzdGF0aWM6IGJvb2xlYW47XG59XG4iLCI8c3ZnXG4gIFtuZ0NsYXNzXT1cInsgc3RhdGljOiBzdGF0aWMgfVwiXG4gIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiXG4gIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6IG5ldyAwIDAgMTU1LjQgMTQ5LjFcIlxuICB2aWV3Qm94PVwiMCAwIDE1NS40IDE0OS4xXCJcbj5cbiAgPGRlZnM+XG4gICAgPGxpbmVhckdyYWRpZW50IGlkPVwiYVwiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIxMDAlXCIgeTI9XCIxMDAlXCI+XG4gICAgICA8c3RvcCBzdG9wLWNvbG9yPVwidmFyKC0tcHJpbWFyeSlcIiBvZmZzZXQ9XCIwJVwiIC8+XG4gICAgICA8c3RvcCBzdG9wLWNvbG9yPVwidmFyKC0tc2Vjb25kYXJ5KVwiIG9mZnNldD1cIjEwMCVcIiAvPlxuICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gIDwvZGVmcz5cblxuICA8c3R5bGU+XG4gICAgI291dGVyX2NpcmNsZSB7XG4gICAgICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG4gICAgICBhbmltYXRpb246IHNwaW5uZXJfU3RLUyA2cyAxIGxpbmVhcjtcbiAgICAgIGFuaW1hdGlvbi1kaXJlY3Rpb246IHJldmVyc2U7XG4gICAgfVxuICAgICNpbm5lcl9jaXJjbGUge1xuICAgICAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xuICAgICAgYW5pbWF0aW9uOiBzcGlubmVyX1N0S1MgNnMgMSBsaW5lYXI7XG4gICAgfVxuICAgIC5zdGF0aWMgI2lubmVyX2NpcmNsZSxcbiAgICAuc3RhdGljICNvdXRlcl9jaXJjbGUge1xuICAgICAgYW5pbWF0aW9uOiBub25lO1xuICAgIH1cblxuICAgIEBrZXlmcmFtZXMgc3Bpbm5lcl9TdEtTIHtcbiAgICAgIDEwMCUge1xuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICAgICAgfVxuICAgIH1cbiAgPC9zdHlsZT5cbiAgPHJlY3Qgd2lkdGg9XCIxNjBcIiBoZWlnaHQ9XCIxNjBcIiBmaWxsPVwidXJsKCNhKVwiIG1hc2s9XCJ1cmwoI2ljb24pXCI+PC9yZWN0PlxuICA8bWFzayBpZD1cImljb25cIj5cbiAgICA8ZyBpZD1cImNsb2NrXCIgZmlsbD1cIiNmZmZcIj5cbiAgICAgIDxwYXRoXG4gICAgICAgIGNsYXNzPVwic3QwXCJcbiAgICAgICAgZD1cIk03Ny41IDQ1LjRjLjggMCAxLjQuNiAxLjUgMS40djMuN2MwIC44LS43IDEuNS0xLjUgMS41cy0xLjQtLjYtMS41LTEuNHYtMy43YzAtLjguNy0xLjUgMS41LTEuNXpNMTA1LjkgNzQuNmMuOCAwIDEuNS43IDEuNSAxLjVzLS42IDEuNC0xLjQgMS41aC0zLjdjLS44IDAtMS41LS43LTEuNS0xLjVzLjYtMS40IDEuNC0xLjVoMy43ek03Ny41IDk5Yy44IDAgMS40LjYgMS41IDEuNHYzLjdjMCAuOC0uNyAxLjUtMS41IDEuNXMtMS40LS42LTEuNS0xLjR2LTMuN2MwLS44LjctMS41IDEuNS0xLjV6TTUyLjYgNzQuNmMuOCAwIDEuNS43IDEuNSAxLjVzLS42IDEuNC0xLjQgMS41SDQ5Yy0uOCAwLTEuNS0uNy0xLjUtMS41cy42LTEuNCAxLjQtMS41aDMuN3pcIlxuICAgICAgLz5cbiAgICAgIDxwYXRoXG4gICAgICAgIGNsYXNzPVwic3QwXCJcbiAgICAgICAgZD1cIk03Ny41IDExMi44Yy0yMC40IDAtMzctMTYuNi0zNy0zN3MxNi42LTM3LjEgMzctMzcuMSAzNy4xIDE2LjYgMzcuMSAzNy4xLTE2LjcgMzctMzcuMSAzN3ptMC03MS4xYy0xOC44IDAtMzQgMTUuMy0zNCAzNC4xczE1LjMgMzQgMzQgMzRjMTguOCAwIDM0LjEtMTUuMyAzNC4xLTM0Uzk2LjMgNDEuNyA3Ny41IDQxLjd6XCJcbiAgICAgIC8+XG4gICAgICA8cGF0aFxuICAgICAgICBkPVwiTTkxLjUgNjJjLS41LS42LTEuMy0uNS0xLjggMGwtOC4zIDljLTEuMS0uOC0yLjQtMS40LTMuOS0xLjQtMS4xIDAtMi4xLjMtMi45LjcgMC0uMS0uMS0uMS0uMS0uMkw1OS4zIDU2bC0uMS0uMWMtLjYtLjQtMS40LS40LTEuOS4xLS42LjUtLjYgMS40IDAgMS45bDE1LjEgMTQuMy4xLjFjLS44IDEtMS4yIDIuMy0xLjIgMy43IDAgMy41IDIuOCA2LjMgNi4yIDYuMyAzLjQgMCA2LjItMi44IDYuMi02LjMgMC0xLS4yLTEuOS0uNy0yLjhsOC40LTkuMi4xLS4xYy41LS42LjQtMS40IDAtMS45em0tMTQgMTcuMmMtMS44IDAtMy4yLTEuNS0zLjItMy4zczEuNS0zLjMgMy4yLTMuMyAzLjIgMS41IDMuMiAzLjMtMS40IDMuMy0zLjIgMy4zelwiXG4gICAgICAgIHN0eWxlPVwiZmlsbC1ydWxlOiBldmVub2RkOyBjbGlwLXJ1bGU6IGV2ZW5vZGRcIlxuICAgICAgLz5cbiAgICA8L2c+XG4gICAgPGcgaWQ9XCJvdXRlcl9jaXJjbGVcIiBmaWxsPVwiI2ZmZlwiPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk01NS4zIDE0NWMtLjIgMC0uMyAwLS41LS4xLTE3LjItNS43LTMxLjctMTcuNS00MC42LTMzLjQtLjQtLjctLjItMS42LjYtMiAuNy0uNCAxLjYtLjIgMiAuNiA4LjYgMTUuMiAyMi40IDI2LjYgMzguOSAzMiAuOC4zIDEuMiAxLjEgMSAxLjktLjIuNi0uOCAxLTEuNCAxek05OS42IDE0NWMtLjYgMC0xLjItLjQtMS40LTEtLjMtLjguMi0xLjYgMS0xLjkgMjguNy05LjQgNDcuOS0zNiA0Ny45LTY2LjIgMC0uOC43LTEuNSAxLjUtMS41czEuNS43IDEuNSAxLjVjMCAzMS41LTIwLjEgNTkuMi01MCA2OS0uMi4xLS4zLjEtLjUuMXpNNi41IDgxLjhjLS44IDAtMS40LS42LTEuNS0xLjQtLjEtMS41LS4xLTMtLjEtNC41IDAtNDAgMzIuNi03Mi42IDcyLjYtNzIuNiAxMi44IDAgMjUuNCAzLjQgMzYuNCA5LjguNy40IDEgMS4zLjUgMi4xLS40LjctMS4zIDEtMi4xLjUtMTAuNi02LjEtMjIuNi05LjQtMzQuOS05LjQtMzguMyAwLTY5LjUgMzEuMi02OS41IDY5LjYgMCAxLjQgMCAyLjkuMSA0LjMuMS45LS41IDEuNi0xLjUgMS42LjEgMCAuMSAwIDAgMHpcIlxuICAgICAgLz5cbiAgICA8L2c+XG4gICAgPGcgaWQ9XCJpbm5lcl9jaXJjbGVcIiBmaWxsPVwiI2ZmZlwiPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk0xMzEuOCA1NC40Yy0uNiAwLTEuMS0uMy0xLjQtLjktOS0yMS4zLTI5LjgtMzUtNTIuOS0zNS0xMC42IDAtMjEgMi45LTMwIDguNC0uNy40LTEuNi4yLTIuMS0uNS0uNC0uNy0uMi0xLjYuNS0yLjEgOS41LTUuOCAyMC40LTguOSAzMS42LTguOSAyNC4zIDAgNDYuMiAxNC41IDU1LjcgMzYuOS4zLjggMCAxLjYtLjggMi0uMiAwLS40LjEtLjYuMXpNNzcuNSAxMzYuNGMtMzMuNCAwLTYwLjUtMjcuMS02MC41LTYwLjUgMC0uOC43LTEuNSAxLjUtMS41czEuNS43IDEuNSAxLjVjMCAzMS43IDI1LjggNTcuNSA1Ny41IDU3LjUgMjUuNyAwIDQ4LjUtMTcuMyA1NS40LTQyLjEuMi0uOCAxLTEuMyAxLjgtMSAuOC4yIDEuMyAxIDEgMS44LTcuMSAyNi4xLTMxLjEgNDQuMy01OC4yIDQ0LjN6XCJcbiAgICAgIC8+XG4gICAgPC9nPlxuICA8L21hc2s+XG48L3N2Zz5cbiJdfQ==
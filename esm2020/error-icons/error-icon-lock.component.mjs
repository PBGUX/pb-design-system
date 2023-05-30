import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ErrorIconLockComponent {
}
ErrorIconLockComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: ErrorIconLockComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ErrorIconLockComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: ErrorIconLockComponent, selector: "pbds-error-icon-lock", inputs: { static: "static" }, ngImport: i0, template: "<svg\n  version=\"1.1\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n  x=\"0px\"\n  y=\"0px\"\n  viewBox=\"-2 -2 142 142\"\n  xml:space=\"preserve\"\n  [ngClass]=\"{ static: static }\"\n>\n  <defs>\n    <linearGradient x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" id=\"a\">\n      <stop stop-color=\"var(--primary)\" offset=\"0%\" />\n      <stop stop-color=\"var(--secondary)\" offset=\"100%\" />\n    </linearGradient>\n  </defs>\n\n  <style>\n    #outer_circle {\n      transform-origin: center;\n      animation: spinner_StKS 3s 2 linear;\n      animation-direction: reverse;\n    }\n    #inner_circle {\n      transform-origin: center;\n      animation: spinner_StKS 3s 2 linear;\n    }\n\n    .static #inner_circle,\n    .static #outer_circle {\n      animation: none;\n    }\n\n    @keyframes spinner_StKS {\n      100% {\n        transform: rotate(360deg);\n      }\n    }\n  </style>\n  <rect width=\"160\" height=\"160\" fill=\"url(#a)\" mask=\"url(#icon)\"></rect>\n  <mask id=\"icon\">\n    <g id=\"clock\" fill=\"#fff\">\n      <path\n        d=\"M86,67V53.4l0-0.3c-0.2-8.5-7.1-15.5-15.7-15.5c-8.6,0-15.7,7.1-15.7,15.8V67c-5.8,4.6-9.4,11.8-9.4,19.8\n\t\tc0,14,11.2,25.3,25.1,25.3c13.9,0,25.1-11.3,25.1-25.3C95.5,78.7,91.8,71.6,86,67z M57.7,53.4l0-0.3c0.2-6.9,5.8-12.5,12.7-12.5\n\t\tc7,0,12.7,5.8,12.7,12.8v11.5c-3.7-2.2-8-3.5-12.7-3.5c-4.6,0-8.9,1.3-12.7,3.5V53.4z M70.4,109c-12.2,0-22.1-10-22.1-22.3\n\t\tc0-12.3,9.9-22.3,22.1-22.3c12.2,0,22.1,10,22.1,22.3C92.5,99,82.6,109,70.4,109z\"\n      />\n      <path\n        d=\"M79,82c0-4.8-3.8-8.6-8.6-8.6s-8.6,3.9-8.6,8.6c0,4.3,3.1,7.8,7.1,8.5v5.8l0,0.1c0.1,0.8,0.7,1.4,1.5,1.4\n\t\tc0.8,0,1.5-0.7,1.5-1.5v-5.8C75.9,89.7,79,86.2,79,82z M70.4,87.6C70.4,87.6,70.4,87.6,70.4,87.6C70.4,87.6,70.4,87.6,70.4,87.6\n\t\tc-3.1,0-5.6-2.5-5.6-5.6c0-3.1,2.5-5.6,5.6-5.6S76,78.8,76,82C76,85.1,73.5,87.6,70.4,87.6z\"\n      />\n    </g>\n    <g id=\"inner_circle\" fill=\"#fff\">\n      <path\n        d=\"M70.6,15.4c22.1,0,41.9,13,51,32.9c0.3,0.8,0,1.6-0.7,2c-0.8,0.3-1.6,0-2-0.7c-8.6-18.8-27.4-31.2-48.3-31.2\n\t\tc-9,0-17.7,2.3-25.4,6.5c-0.7,0.4-1.6,0.1-2-0.6c-0.4-0.7-0.1-1.6,0.6-2C51.9,17.8,61.1,15.4,70.6,15.4z M17.5,72\n\t\tc0-0.8-0.7-1.5-1.5-1.5c-0.8,0-1.5,0.7-1.5,1.5c0,31.3,25.1,56.6,56.2,56.6c25.8,0,48.1-17.7,54.4-42.5c0.2-0.8-0.3-1.6-1.1-1.8\n\t\tc-0.8-0.2-1.6,0.3-1.8,1.1c-6,23.5-27.1,40.3-51.5,40.3C41.3,125.6,17.5,101.6,17.5,72z\"\n      />\n    </g>\n    <g id=\"outer_circle\" fill=\"#fff\">\n      <g>\n        <path\n          d=\"M70.4,2c12.2,0,23.9,3.2,34.2,9.1c0.7,0.4,1,1.3,0.6,2c-0.4,0.7-1.3,1-2,0.6C93.2,8,82,5,70.4,5C33.7,5,4,35,4,71.9\n\t\t\tc0,0.8-0.7,1.5-1.5,1.5S1,72.7,1,71.9C1,33.3,32.1,2,70.4,2z\"\n        />\n        <path\n          d=\"M10.4,104.1c0.7-0.4,1.6-0.1,2,0.6c7.4,13.3,19.3,23.8,33.4,29.5c0.8,0.3,1.1,1.2,0.8,1.9c-0.3,0.8-1.2,1.1-2,0.8\n\t\t\tC30,131,17.6,120.1,9.9,106.1C9.5,105.4,9.7,104.5,10.4,104.1z\"\n        />\n        <path\n          d=\"M139.8,71.9c0-0.8-0.7-1.5-1.5-1.5c-0.8,0-1.5,0.7-1.5,1.5C136.8,99.5,120,124,95,134c-0.8,0.3-1.1,1.2-0.8,2\n\t\t\tc0.3,0.8,1.2,1.1,2,0.8C122.3,126.3,139.8,100.7,139.8,71.9z\"\n        />\n      </g>\n    </g>\n  </mask>\n</svg>\n", styles: [":host{display:block;width:150px;height:150px;margin:0 auto}svg{overflow:visible}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: ErrorIconLockComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-error-icon-lock', template: "<svg\n  version=\"1.1\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n  x=\"0px\"\n  y=\"0px\"\n  viewBox=\"-2 -2 142 142\"\n  xml:space=\"preserve\"\n  [ngClass]=\"{ static: static }\"\n>\n  <defs>\n    <linearGradient x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" id=\"a\">\n      <stop stop-color=\"var(--primary)\" offset=\"0%\" />\n      <stop stop-color=\"var(--secondary)\" offset=\"100%\" />\n    </linearGradient>\n  </defs>\n\n  <style>\n    #outer_circle {\n      transform-origin: center;\n      animation: spinner_StKS 3s 2 linear;\n      animation-direction: reverse;\n    }\n    #inner_circle {\n      transform-origin: center;\n      animation: spinner_StKS 3s 2 linear;\n    }\n\n    .static #inner_circle,\n    .static #outer_circle {\n      animation: none;\n    }\n\n    @keyframes spinner_StKS {\n      100% {\n        transform: rotate(360deg);\n      }\n    }\n  </style>\n  <rect width=\"160\" height=\"160\" fill=\"url(#a)\" mask=\"url(#icon)\"></rect>\n  <mask id=\"icon\">\n    <g id=\"clock\" fill=\"#fff\">\n      <path\n        d=\"M86,67V53.4l0-0.3c-0.2-8.5-7.1-15.5-15.7-15.5c-8.6,0-15.7,7.1-15.7,15.8V67c-5.8,4.6-9.4,11.8-9.4,19.8\n\t\tc0,14,11.2,25.3,25.1,25.3c13.9,0,25.1-11.3,25.1-25.3C95.5,78.7,91.8,71.6,86,67z M57.7,53.4l0-0.3c0.2-6.9,5.8-12.5,12.7-12.5\n\t\tc7,0,12.7,5.8,12.7,12.8v11.5c-3.7-2.2-8-3.5-12.7-3.5c-4.6,0-8.9,1.3-12.7,3.5V53.4z M70.4,109c-12.2,0-22.1-10-22.1-22.3\n\t\tc0-12.3,9.9-22.3,22.1-22.3c12.2,0,22.1,10,22.1,22.3C92.5,99,82.6,109,70.4,109z\"\n      />\n      <path\n        d=\"M79,82c0-4.8-3.8-8.6-8.6-8.6s-8.6,3.9-8.6,8.6c0,4.3,3.1,7.8,7.1,8.5v5.8l0,0.1c0.1,0.8,0.7,1.4,1.5,1.4\n\t\tc0.8,0,1.5-0.7,1.5-1.5v-5.8C75.9,89.7,79,86.2,79,82z M70.4,87.6C70.4,87.6,70.4,87.6,70.4,87.6C70.4,87.6,70.4,87.6,70.4,87.6\n\t\tc-3.1,0-5.6-2.5-5.6-5.6c0-3.1,2.5-5.6,5.6-5.6S76,78.8,76,82C76,85.1,73.5,87.6,70.4,87.6z\"\n      />\n    </g>\n    <g id=\"inner_circle\" fill=\"#fff\">\n      <path\n        d=\"M70.6,15.4c22.1,0,41.9,13,51,32.9c0.3,0.8,0,1.6-0.7,2c-0.8,0.3-1.6,0-2-0.7c-8.6-18.8-27.4-31.2-48.3-31.2\n\t\tc-9,0-17.7,2.3-25.4,6.5c-0.7,0.4-1.6,0.1-2-0.6c-0.4-0.7-0.1-1.6,0.6-2C51.9,17.8,61.1,15.4,70.6,15.4z M17.5,72\n\t\tc0-0.8-0.7-1.5-1.5-1.5c-0.8,0-1.5,0.7-1.5,1.5c0,31.3,25.1,56.6,56.2,56.6c25.8,0,48.1-17.7,54.4-42.5c0.2-0.8-0.3-1.6-1.1-1.8\n\t\tc-0.8-0.2-1.6,0.3-1.8,1.1c-6,23.5-27.1,40.3-51.5,40.3C41.3,125.6,17.5,101.6,17.5,72z\"\n      />\n    </g>\n    <g id=\"outer_circle\" fill=\"#fff\">\n      <g>\n        <path\n          d=\"M70.4,2c12.2,0,23.9,3.2,34.2,9.1c0.7,0.4,1,1.3,0.6,2c-0.4,0.7-1.3,1-2,0.6C93.2,8,82,5,70.4,5C33.7,5,4,35,4,71.9\n\t\t\tc0,0.8-0.7,1.5-1.5,1.5S1,72.7,1,71.9C1,33.3,32.1,2,70.4,2z\"\n        />\n        <path\n          d=\"M10.4,104.1c0.7-0.4,1.6-0.1,2,0.6c7.4,13.3,19.3,23.8,33.4,29.5c0.8,0.3,1.1,1.2,0.8,1.9c-0.3,0.8-1.2,1.1-2,0.8\n\t\t\tC30,131,17.6,120.1,9.9,106.1C9.5,105.4,9.7,104.5,10.4,104.1z\"\n        />\n        <path\n          d=\"M139.8,71.9c0-0.8-0.7-1.5-1.5-1.5c-0.8,0-1.5,0.7-1.5,1.5C136.8,99.5,120,124,95,134c-0.8,0.3-1.1,1.2-0.8,2\n\t\t\tc0.3,0.8,1.2,1.1,2,0.8C122.3,126.3,139.8,100.7,139.8,71.9z\"\n        />\n      </g>\n    </g>\n  </mask>\n</svg>\n", styles: [":host{display:block;width:150px;height:150px;margin:0 auto}svg{overflow:visible}\n"] }]
        }], propDecorators: { static: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItaWNvbi1sb2NrLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZXJyb3ItaWNvbnMvZXJyb3ItaWNvbi1sb2NrLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZXJyb3ItaWNvbnMvZXJyb3ItaWNvbi1sb2NrLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFtQmpELE1BQU0sT0FBTyxzQkFBc0I7O21IQUF0QixzQkFBc0I7dUdBQXRCLHNCQUFzQiwwRkNuQm5DLCtvR0FnRkE7MkZEN0RhLHNCQUFzQjtrQkFqQmxDLFNBQVM7K0JBQ0Usc0JBQXNCOzhCQWlCdkIsTUFBTTtzQkFBZCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWVycm9yLWljb24tbG9jaycsXG4gIHRlbXBsYXRlVXJsOiAnLi9lcnJvci1pY29uLWxvY2suY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICB3aWR0aDogMTUwcHg7XG4gICAgICAgIGhlaWdodDogMTUwcHg7XG4gICAgICAgIG1hcmdpbjogMCBhdXRvO1xuICAgICAgfVxuICAgICAgc3ZnIHtcbiAgICAgICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gICAgICB9XG4gICAgYFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEVycm9ySWNvbkxvY2tDb21wb25lbnQge1xuICBASW5wdXQoKSBzdGF0aWM6IGJvb2xlYW47XG59XG4iLCI8c3ZnXG4gIHZlcnNpb249XCIxLjFcIlxuICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgeD1cIjBweFwiXG4gIHk9XCIwcHhcIlxuICB2aWV3Qm94PVwiLTIgLTIgMTQyIDE0MlwiXG4gIHhtbDpzcGFjZT1cInByZXNlcnZlXCJcbiAgW25nQ2xhc3NdPVwieyBzdGF0aWM6IHN0YXRpYyB9XCJcbj5cbiAgPGRlZnM+XG4gICAgPGxpbmVhckdyYWRpZW50IHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIxMDAlXCIgeTI9XCIxMDAlXCIgaWQ9XCJhXCI+XG4gICAgICA8c3RvcCBzdG9wLWNvbG9yPVwidmFyKC0tcHJpbWFyeSlcIiBvZmZzZXQ9XCIwJVwiIC8+XG4gICAgICA8c3RvcCBzdG9wLWNvbG9yPVwidmFyKC0tc2Vjb25kYXJ5KVwiIG9mZnNldD1cIjEwMCVcIiAvPlxuICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gIDwvZGVmcz5cblxuICA8c3R5bGU+XG4gICAgI291dGVyX2NpcmNsZSB7XG4gICAgICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG4gICAgICBhbmltYXRpb246IHNwaW5uZXJfU3RLUyAzcyAyIGxpbmVhcjtcbiAgICAgIGFuaW1hdGlvbi1kaXJlY3Rpb246IHJldmVyc2U7XG4gICAgfVxuICAgICNpbm5lcl9jaXJjbGUge1xuICAgICAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xuICAgICAgYW5pbWF0aW9uOiBzcGlubmVyX1N0S1MgM3MgMiBsaW5lYXI7XG4gICAgfVxuXG4gICAgLnN0YXRpYyAjaW5uZXJfY2lyY2xlLFxuICAgIC5zdGF0aWMgI291dGVyX2NpcmNsZSB7XG4gICAgICBhbmltYXRpb246IG5vbmU7XG4gICAgfVxuXG4gICAgQGtleWZyYW1lcyBzcGlubmVyX1N0S1Mge1xuICAgICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gICAgICB9XG4gICAgfVxuICA8L3N0eWxlPlxuICA8cmVjdCB3aWR0aD1cIjE2MFwiIGhlaWdodD1cIjE2MFwiIGZpbGw9XCJ1cmwoI2EpXCIgbWFzaz1cInVybCgjaWNvbilcIj48L3JlY3Q+XG4gIDxtYXNrIGlkPVwiaWNvblwiPlxuICAgIDxnIGlkPVwiY2xvY2tcIiBmaWxsPVwiI2ZmZlwiPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk04Niw2N1Y1My40bDAtMC4zYy0wLjItOC41LTcuMS0xNS41LTE1LjctMTUuNWMtOC42LDAtMTUuNyw3LjEtMTUuNywxNS44VjY3Yy01LjgsNC42LTkuNCwxMS44LTkuNCwxOS44XG5cdFx0YzAsMTQsMTEuMiwyNS4zLDI1LjEsMjUuM2MxMy45LDAsMjUuMS0xMS4zLDI1LjEtMjUuM0M5NS41LDc4LjcsOTEuOCw3MS42LDg2LDY3eiBNNTcuNyw1My40bDAtMC4zYzAuMi02LjksNS44LTEyLjUsMTIuNy0xMi41XG5cdFx0YzcsMCwxMi43LDUuOCwxMi43LDEyLjh2MTEuNWMtMy43LTIuMi04LTMuNS0xMi43LTMuNWMtNC42LDAtOC45LDEuMy0xMi43LDMuNVY1My40eiBNNzAuNCwxMDljLTEyLjIsMC0yMi4xLTEwLTIyLjEtMjIuM1xuXHRcdGMwLTEyLjMsOS45LTIyLjMsMjIuMS0yMi4zYzEyLjIsMCwyMi4xLDEwLDIyLjEsMjIuM0M5Mi41LDk5LDgyLjYsMTA5LDcwLjQsMTA5elwiXG4gICAgICAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk03OSw4MmMwLTQuOC0zLjgtOC42LTguNi04LjZzLTguNiwzLjktOC42LDguNmMwLDQuMywzLjEsNy44LDcuMSw4LjV2NS44bDAsMC4xYzAuMSwwLjgsMC43LDEuNCwxLjUsMS40XG5cdFx0YzAuOCwwLDEuNS0wLjcsMS41LTEuNXYtNS44Qzc1LjksODkuNyw3OSw4Ni4yLDc5LDgyeiBNNzAuNCw4Ny42QzcwLjQsODcuNiw3MC40LDg3LjYsNzAuNCw4Ny42QzcwLjQsODcuNiw3MC40LDg3LjYsNzAuNCw4Ny42XG5cdFx0Yy0zLjEsMC01LjYtMi41LTUuNi01LjZjMC0zLjEsMi41LTUuNiw1LjYtNS42Uzc2LDc4LjgsNzYsODJDNzYsODUuMSw3My41LDg3LjYsNzAuNCw4Ny42elwiXG4gICAgICAvPlxuICAgIDwvZz5cbiAgICA8ZyBpZD1cImlubmVyX2NpcmNsZVwiIGZpbGw9XCIjZmZmXCI+XG4gICAgICA8cGF0aFxuICAgICAgICBkPVwiTTcwLjYsMTUuNGMyMi4xLDAsNDEuOSwxMyw1MSwzMi45YzAuMywwLjgsMCwxLjYtMC43LDJjLTAuOCwwLjMtMS42LDAtMi0wLjdjLTguNi0xOC44LTI3LjQtMzEuMi00OC4zLTMxLjJcblx0XHRjLTksMC0xNy43LDIuMy0yNS40LDYuNWMtMC43LDAuNC0xLjYsMC4xLTItMC42Yy0wLjQtMC43LTAuMS0xLjYsMC42LTJDNTEuOSwxNy44LDYxLjEsMTUuNCw3MC42LDE1LjR6IE0xNy41LDcyXG5cdFx0YzAtMC44LTAuNy0xLjUtMS41LTEuNWMtMC44LDAtMS41LDAuNy0xLjUsMS41YzAsMzEuMywyNS4xLDU2LjYsNTYuMiw1Ni42YzI1LjgsMCw0OC4xLTE3LjcsNTQuNC00Mi41YzAuMi0wLjgtMC4zLTEuNi0xLjEtMS44XG5cdFx0Yy0wLjgtMC4yLTEuNiwwLjMtMS44LDEuMWMtNiwyMy41LTI3LjEsNDAuMy01MS41LDQwLjNDNDEuMywxMjUuNiwxNy41LDEwMS42LDE3LjUsNzJ6XCJcbiAgICAgIC8+XG4gICAgPC9nPlxuICAgIDxnIGlkPVwib3V0ZXJfY2lyY2xlXCIgZmlsbD1cIiNmZmZcIj5cbiAgICAgIDxnPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNNzAuNCwyYzEyLjIsMCwyMy45LDMuMiwzNC4yLDkuMWMwLjcsMC40LDEsMS4zLDAuNiwyYy0wLjQsMC43LTEuMywxLTIsMC42QzkzLjIsOCw4Miw1LDcwLjQsNUMzMy43LDUsNCwzNSw0LDcxLjlcblx0XHRcdGMwLDAuOC0wLjcsMS41LTEuNSwxLjVTMSw3Mi43LDEsNzEuOUMxLDMzLjMsMzIuMSwyLDcwLjQsMnpcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMTAuNCwxMDQuMWMwLjctMC40LDEuNi0wLjEsMiwwLjZjNy40LDEzLjMsMTkuMywyMy44LDMzLjQsMjkuNWMwLjgsMC4zLDEuMSwxLjIsMC44LDEuOWMtMC4zLDAuOC0xLjIsMS4xLTIsMC44XG5cdFx0XHRDMzAsMTMxLDE3LjYsMTIwLjEsOS45LDEwNi4xQzkuNSwxMDUuNCw5LjcsMTA0LjUsMTAuNCwxMDQuMXpcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMTM5LjgsNzEuOWMwLTAuOC0wLjctMS41LTEuNS0xLjVjLTAuOCwwLTEuNSwwLjctMS41LDEuNUMxMzYuOCw5OS41LDEyMCwxMjQsOTUsMTM0Yy0wLjgsMC4zLTEuMSwxLjItMC44LDJcblx0XHRcdGMwLjMsMC44LDEuMiwxLjEsMiwwLjhDMTIyLjMsMTI2LjMsMTM5LjgsMTAwLjcsMTM5LjgsNzEuOXpcIlxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgIDwvZz5cbiAgPC9tYXNrPlxuPC9zdmc+XG4iXX0=
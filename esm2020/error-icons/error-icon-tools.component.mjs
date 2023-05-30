import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ErrorIconToolsComponent {
}
ErrorIconToolsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: ErrorIconToolsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ErrorIconToolsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: ErrorIconToolsComponent, selector: "pbds-error-icon-tools", inputs: { static: "static" }, ngImport: i0, template: "<svg\n  version=\"1.1\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n  x=\"0px\"\n  y=\"0px\"\n  viewBox=\"-2 -2 142 142\"\n  xml:space=\"preserve\"\n  [ngClass]=\"{ static: static }\"\n>\n  <defs>\n    <linearGradient x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" id=\"a\">\n      <stop stop-color=\"var(--primary)\" offset=\"0%\" />\n      <stop stop-color=\"var(--secondary)\" offset=\"100%\" />\n    </linearGradient>\n  </defs>\n\n  <style>\n    #outer_circle {\n      transform-origin: center;\n      animation: spinner_StKS 3s 2 linear;\n      animation-direction: reverse;\n    }\n    #inner_circle {\n      transform-origin: center;\n      animation: spinner_StKS 3s 2 linear;\n    }\n\n    .static #inner_circle,\n    .static #outer_circle {\n      animation: none;\n    }\n\n    @keyframes spinner_StKS {\n      100% {\n        transform: rotate(360deg);\n      }\n    }\n  </style>\n  <rect width=\"160\" height=\"160\" fill=\"url(#a)\" mask=\"url(#icon)\"></rect>\n  <mask id=\"icon\">\n    <g id=\"clock\" fill=\"#fff\">\n      <g>\n        <g>\n          <path\n            class=\"st0\"\n            d=\"M46.8,97.1c-1.5,1-3.5,0.7-4.3-0.5c-0.6-0.9-0.6-2.2,0.1-3.3l0.1-0.1c0.3-0.7,0.1-1.5-0.6-1.9\n\t\t\t\tc-0.7-0.4-1.6-0.2-2.1,0.5c-1.2,2.1-1.2,4.7,0.1,6.5c1.8,2.6,5.6,3.2,8.4,1.3c0.7-0.4,0.9-1.4,0.5-2.1\n\t\t\t\tC48.4,96.8,47.5,96.6,46.8,97.1z\"\n          />\n          <path\n            class=\"st0\"\n            d=\"M83.9,81.7c-0.6-0.5-1.5-0.4-2,0.1c-0.6,0.6-0.6,1.5,0,2.1l9.8,9.8l0.1,0.1c0.6,0.5,1.5,0.4,2-0.1\n\t\t\t\tc0.6-0.6,0.6-1.5,0-2.1L84,81.8L83.9,81.7z\"\n          />\n\n          <path class=\"st0\" d=\"M94,50.9C94,50.9,94,50.9,94,50.9L94,50.9L94,50.9z\" />\n\n          <path\n            d=\"M91,69c0.1,0,0.2,0,0.2,0c2.7-0.2,5.5-1,8.3-2.6c1.4-0.8,2.7-1.9,4.1-3.4c2-2.2,3.5-4.8,4.3-7.9c0.8-3.1,0.6-6.1-0.1-9\n\t\t\t\tc-0.5-1.9-1.2-3.3-1.9-4.6c-0.5-0.8-1.7-1-2.4-0.3L94,50.9c0,0,0,0,0,0l0,0l0,0c-1.4,1.1-3.3,0.9-4.3-0.2l-0.1-0.1\n\t\t\t\tc-0.6-0.8-0.6-2.1-0.1-3.2l0-0.1l9.8-10c0.7-0.7,0.5-1.8-0.3-2.3c-0.5-0.3-1-0.5-1.6-0.8c-1-0.4-2-0.8-3.1-1.1\n\t\t\t\tc-3-0.8-6.2-0.8-9.5,0.1c-5.3,1.6-8.7,5-10.8,8.9c-1.3,2.4-1.9,4.8-2.2,7.2l0,0.1c0,0.5,0,1.1-0.1,1.7l0,0.5\n\t\t\t\tc-0.1,0.9-0.1,1.3-0.2,1.8l-0.1,0.2c-0.2,0.7-0.5,1.5-1.1,2.3l-0.1,0.2L67,59.3l-0.3,0.3l-7.8-7.8l0-4.9l0-0.1\n\t\t\t\tc0-0.3-0.2-0.7-0.4-0.9L48,35.4l-0.1-0.1c-0.6-0.5-1.5-0.4-2,0.1L35.5,45.8l-0.1,0.1c-0.5,0.6-0.4,1.5,0.1,2l10.4,10.4l0.1,0.1\n\t\t\t\tc0.3,0.2,0.6,0.3,0.9,0.3l4.9,0l7.6,7.6L43.6,81.8c-3.5,3.4-5.5,5.3-7.1,6.9c-3.9,4.1-3.9,10.5-0.2,14.4\n\t\t\t\tc3.9,4.1,10.5,4.2,14.7,0.3l1.8-1.7L69.2,86l16.7,16.7l0.2,0.2c4.7,4.4,12.1,4.4,16.7-0.2c4.7-4.7,4.7-12.2,0-16.9L86.8,69.8\n\t\t\t\tc0.4-0.2,0.7-0.3,1.1-0.4C89,69,90,69,91,69z M53.6,56.3l-0.1-0.1c-0.3-0.2-0.6-0.3-0.9-0.3l-4.9,0l-8.9-8.9l8.3-8.3l8.9,8.9\n\t\t\t\tl0,4.9l0,0.1c0,0.3,0.2,0.7,0.4,0.9l8.2,8.2c-0.8,0.8-1.8,1.7-2.9,2.8L53.6,56.3z M100.7,88l0.2,0.2c3.3,3.5,3.2,9-0.2,12.4\n\t\t\t\tc-3.5,3.5-9.2,3.5-12.7,0L71.4,84l1-1c1.4-1.3,2.3-2.2,2.7-2.6l4.2-4.2l2.9-2.9c0.7-0.7,1.2-1.2,1.7-1.6c0.1-0.1,0.2-0.2,0.4-0.3\n\t\t\t\tL100.7,88z M83.7,68.1c-0.2,0.1-0.4,0.3-0.6,0.4c-0.4,0.3-0.8,0.6-1.2,1l-0.4,0.3c-0.3,0.3-0.6,0.6-1,0.9l-0.7,0.7L76,75.3\n\t\t\t\tl-3.4,3.4C71.2,80,67.5,83.6,62,88.8l-12.6,12.1c-3,3.1-8,3.1-10.8,0.2c-2.6-2.8-2.6-7.3,0.1-10.2l2.2-2.2c0.8-0.8,1.8-1.8,3-2.9\n\t\t\t\tl24.9-24c1.5-1.5,2.7-2.6,3.6-3.6l0.1-0.1c1.1-1.4,1.7-2.7,2-4c0.1-0.5,0.2-1,0.2-1.8l0.1-0.8c0-0.5,0.1-1,0.1-1.4l0-0.4l0,0l0,0\n\t\t\t\tl0,0c0.2-2,0.7-4,1.8-6c1.8-3.3,4.6-6.2,9-7.5c2.7-0.8,5.3-0.7,7.9-0.1l0.5,0.1c0.5,0.1,0.9,0.3,1.3,0.4l0.4,0.2l-8.5,8.7\n\t\t\t\tc-0.1,0.1-0.1,0.2-0.2,0.3c-1.4,2.2-1.3,5.1,0.3,7c2,2.4,5.9,2.7,8.5,0.6l0.1-0.1l8.1-8.1l0,0.1c0.2,0.6,0.5,1.2,0.7,1.9\n\t\t\t\tc0.6,2.4,0.7,4.9,0.1,7.5c-0.6,2.6-1.9,4.7-3.6,6.5c-1.2,1.2-2.3,2.1-3.4,2.8L91.4,66l-0.3,0c0,0,0.1,0,0.1,0l-0.1,0l0,0\n\t\t\t\tc-1.3-0.1-2.6,0-4.1,0.4C85.8,66.8,84.8,67.3,83.7,68.1z\"\n          />\n        </g>\n      </g>\n    </g>\n    <g id=\"inner_circle\" fill=\"#fff\">\n      <path\n        class=\"st1\"\n        d=\"M121.6,48.3c-9.2-19.9-29.1-32.9-51.4-32.9c-9.6,0-18.8,2.4-27.1,6.9c-0.7,0.4-1,1.3-0.6,2\n\t\tc0.4,0.7,1.3,1,2,0.6c7.8-4.3,16.6-6.5,25.6-6.5c21.1,0,40,12.3,48.7,31.2c0.3,0.8,1.2,1.1,2,0.7C121.6,50,121.9,49.1,121.6,48.3z\"\n      />\n      <path\n        class=\"st1\"\n        d=\"M15.1,70.5c0.8,0,1.5,0.7,1.5,1.5c0,29.6,24,53.6,53.6,53.6c24.6,0,45.9-16.8,51.9-40.3c0.2-0.8,1-1.3,1.8-1.1\n\t\tc0.8,0.2,1.3,1,1.1,1.8c-6.3,24.9-28.8,42.5-54.8,42.5c-31.3,0-56.6-25.3-56.6-56.6C13.6,71.2,14.2,70.5,15.1,70.5z\"\n      />\n    </g>\n    <g id=\"outer_circle\" fill=\"#fff\">\n      <path\n        class=\"st1\"\n        d=\"M104.4,11.1C94,5.2,82.2,2,69.9,2C31.3,2,0,33.3,0,71.9c0,0.8,0.7,1.5,1.5,1.5c0.8,0,1.5-0.7,1.5-1.5\n\t\tC3,35,33,5,69.9,5c11.7,0,23,3,33,8.7c0.7,0.4,1.6,0.2,2-0.6C105.4,12.4,105.1,11.5,104.4,11.1z\"\n      />\n      <path\n        class=\"st1\"\n        d=\"M11.5,104.6c-0.4-0.7-1.3-1-2-0.6c-0.7,0.4-1,1.3-0.6,2c7.8,13.9,20.3,24.9,35.2,30.8c0.8,0.3,1.6-0.1,1.9-0.8\n\t\ts-0.1-1.6-0.8-1.9C31,128.4,19.1,118,11.5,104.6z\"\n      />\n      <path\n        class=\"st1\"\n        d=\"M138.3,70.4c0.8,0,1.5,0.7,1.5,1.5c0,28.8-17.6,54.4-43.9,64.9c-0.8,0.3-1.6-0.1-2-0.8\n\t\tc-0.3-0.8,0.1-1.6,0.8-1.9c25.2-10.1,42.1-34.5,42.1-62.1C136.8,71.1,137.5,70.4,138.3,70.4z\"\n      />\n    </g>\n  </mask>\n</svg>\n", styles: [":host{display:block;width:150px;height:150px;margin:0 auto}svg{overflow:visible}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: ErrorIconToolsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-error-icon-tools', template: "<svg\n  version=\"1.1\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n  x=\"0px\"\n  y=\"0px\"\n  viewBox=\"-2 -2 142 142\"\n  xml:space=\"preserve\"\n  [ngClass]=\"{ static: static }\"\n>\n  <defs>\n    <linearGradient x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" id=\"a\">\n      <stop stop-color=\"var(--primary)\" offset=\"0%\" />\n      <stop stop-color=\"var(--secondary)\" offset=\"100%\" />\n    </linearGradient>\n  </defs>\n\n  <style>\n    #outer_circle {\n      transform-origin: center;\n      animation: spinner_StKS 3s 2 linear;\n      animation-direction: reverse;\n    }\n    #inner_circle {\n      transform-origin: center;\n      animation: spinner_StKS 3s 2 linear;\n    }\n\n    .static #inner_circle,\n    .static #outer_circle {\n      animation: none;\n    }\n\n    @keyframes spinner_StKS {\n      100% {\n        transform: rotate(360deg);\n      }\n    }\n  </style>\n  <rect width=\"160\" height=\"160\" fill=\"url(#a)\" mask=\"url(#icon)\"></rect>\n  <mask id=\"icon\">\n    <g id=\"clock\" fill=\"#fff\">\n      <g>\n        <g>\n          <path\n            class=\"st0\"\n            d=\"M46.8,97.1c-1.5,1-3.5,0.7-4.3-0.5c-0.6-0.9-0.6-2.2,0.1-3.3l0.1-0.1c0.3-0.7,0.1-1.5-0.6-1.9\n\t\t\t\tc-0.7-0.4-1.6-0.2-2.1,0.5c-1.2,2.1-1.2,4.7,0.1,6.5c1.8,2.6,5.6,3.2,8.4,1.3c0.7-0.4,0.9-1.4,0.5-2.1\n\t\t\t\tC48.4,96.8,47.5,96.6,46.8,97.1z\"\n          />\n          <path\n            class=\"st0\"\n            d=\"M83.9,81.7c-0.6-0.5-1.5-0.4-2,0.1c-0.6,0.6-0.6,1.5,0,2.1l9.8,9.8l0.1,0.1c0.6,0.5,1.5,0.4,2-0.1\n\t\t\t\tc0.6-0.6,0.6-1.5,0-2.1L84,81.8L83.9,81.7z\"\n          />\n\n          <path class=\"st0\" d=\"M94,50.9C94,50.9,94,50.9,94,50.9L94,50.9L94,50.9z\" />\n\n          <path\n            d=\"M91,69c0.1,0,0.2,0,0.2,0c2.7-0.2,5.5-1,8.3-2.6c1.4-0.8,2.7-1.9,4.1-3.4c2-2.2,3.5-4.8,4.3-7.9c0.8-3.1,0.6-6.1-0.1-9\n\t\t\t\tc-0.5-1.9-1.2-3.3-1.9-4.6c-0.5-0.8-1.7-1-2.4-0.3L94,50.9c0,0,0,0,0,0l0,0l0,0c-1.4,1.1-3.3,0.9-4.3-0.2l-0.1-0.1\n\t\t\t\tc-0.6-0.8-0.6-2.1-0.1-3.2l0-0.1l9.8-10c0.7-0.7,0.5-1.8-0.3-2.3c-0.5-0.3-1-0.5-1.6-0.8c-1-0.4-2-0.8-3.1-1.1\n\t\t\t\tc-3-0.8-6.2-0.8-9.5,0.1c-5.3,1.6-8.7,5-10.8,8.9c-1.3,2.4-1.9,4.8-2.2,7.2l0,0.1c0,0.5,0,1.1-0.1,1.7l0,0.5\n\t\t\t\tc-0.1,0.9-0.1,1.3-0.2,1.8l-0.1,0.2c-0.2,0.7-0.5,1.5-1.1,2.3l-0.1,0.2L67,59.3l-0.3,0.3l-7.8-7.8l0-4.9l0-0.1\n\t\t\t\tc0-0.3-0.2-0.7-0.4-0.9L48,35.4l-0.1-0.1c-0.6-0.5-1.5-0.4-2,0.1L35.5,45.8l-0.1,0.1c-0.5,0.6-0.4,1.5,0.1,2l10.4,10.4l0.1,0.1\n\t\t\t\tc0.3,0.2,0.6,0.3,0.9,0.3l4.9,0l7.6,7.6L43.6,81.8c-3.5,3.4-5.5,5.3-7.1,6.9c-3.9,4.1-3.9,10.5-0.2,14.4\n\t\t\t\tc3.9,4.1,10.5,4.2,14.7,0.3l1.8-1.7L69.2,86l16.7,16.7l0.2,0.2c4.7,4.4,12.1,4.4,16.7-0.2c4.7-4.7,4.7-12.2,0-16.9L86.8,69.8\n\t\t\t\tc0.4-0.2,0.7-0.3,1.1-0.4C89,69,90,69,91,69z M53.6,56.3l-0.1-0.1c-0.3-0.2-0.6-0.3-0.9-0.3l-4.9,0l-8.9-8.9l8.3-8.3l8.9,8.9\n\t\t\t\tl0,4.9l0,0.1c0,0.3,0.2,0.7,0.4,0.9l8.2,8.2c-0.8,0.8-1.8,1.7-2.9,2.8L53.6,56.3z M100.7,88l0.2,0.2c3.3,3.5,3.2,9-0.2,12.4\n\t\t\t\tc-3.5,3.5-9.2,3.5-12.7,0L71.4,84l1-1c1.4-1.3,2.3-2.2,2.7-2.6l4.2-4.2l2.9-2.9c0.7-0.7,1.2-1.2,1.7-1.6c0.1-0.1,0.2-0.2,0.4-0.3\n\t\t\t\tL100.7,88z M83.7,68.1c-0.2,0.1-0.4,0.3-0.6,0.4c-0.4,0.3-0.8,0.6-1.2,1l-0.4,0.3c-0.3,0.3-0.6,0.6-1,0.9l-0.7,0.7L76,75.3\n\t\t\t\tl-3.4,3.4C71.2,80,67.5,83.6,62,88.8l-12.6,12.1c-3,3.1-8,3.1-10.8,0.2c-2.6-2.8-2.6-7.3,0.1-10.2l2.2-2.2c0.8-0.8,1.8-1.8,3-2.9\n\t\t\t\tl24.9-24c1.5-1.5,2.7-2.6,3.6-3.6l0.1-0.1c1.1-1.4,1.7-2.7,2-4c0.1-0.5,0.2-1,0.2-1.8l0.1-0.8c0-0.5,0.1-1,0.1-1.4l0-0.4l0,0l0,0\n\t\t\t\tl0,0c0.2-2,0.7-4,1.8-6c1.8-3.3,4.6-6.2,9-7.5c2.7-0.8,5.3-0.7,7.9-0.1l0.5,0.1c0.5,0.1,0.9,0.3,1.3,0.4l0.4,0.2l-8.5,8.7\n\t\t\t\tc-0.1,0.1-0.1,0.2-0.2,0.3c-1.4,2.2-1.3,5.1,0.3,7c2,2.4,5.9,2.7,8.5,0.6l0.1-0.1l8.1-8.1l0,0.1c0.2,0.6,0.5,1.2,0.7,1.9\n\t\t\t\tc0.6,2.4,0.7,4.9,0.1,7.5c-0.6,2.6-1.9,4.7-3.6,6.5c-1.2,1.2-2.3,2.1-3.4,2.8L91.4,66l-0.3,0c0,0,0.1,0,0.1,0l-0.1,0l0,0\n\t\t\t\tc-1.3-0.1-2.6,0-4.1,0.4C85.8,66.8,84.8,67.3,83.7,68.1z\"\n          />\n        </g>\n      </g>\n    </g>\n    <g id=\"inner_circle\" fill=\"#fff\">\n      <path\n        class=\"st1\"\n        d=\"M121.6,48.3c-9.2-19.9-29.1-32.9-51.4-32.9c-9.6,0-18.8,2.4-27.1,6.9c-0.7,0.4-1,1.3-0.6,2\n\t\tc0.4,0.7,1.3,1,2,0.6c7.8-4.3,16.6-6.5,25.6-6.5c21.1,0,40,12.3,48.7,31.2c0.3,0.8,1.2,1.1,2,0.7C121.6,50,121.9,49.1,121.6,48.3z\"\n      />\n      <path\n        class=\"st1\"\n        d=\"M15.1,70.5c0.8,0,1.5,0.7,1.5,1.5c0,29.6,24,53.6,53.6,53.6c24.6,0,45.9-16.8,51.9-40.3c0.2-0.8,1-1.3,1.8-1.1\n\t\tc0.8,0.2,1.3,1,1.1,1.8c-6.3,24.9-28.8,42.5-54.8,42.5c-31.3,0-56.6-25.3-56.6-56.6C13.6,71.2,14.2,70.5,15.1,70.5z\"\n      />\n    </g>\n    <g id=\"outer_circle\" fill=\"#fff\">\n      <path\n        class=\"st1\"\n        d=\"M104.4,11.1C94,5.2,82.2,2,69.9,2C31.3,2,0,33.3,0,71.9c0,0.8,0.7,1.5,1.5,1.5c0.8,0,1.5-0.7,1.5-1.5\n\t\tC3,35,33,5,69.9,5c11.7,0,23,3,33,8.7c0.7,0.4,1.6,0.2,2-0.6C105.4,12.4,105.1,11.5,104.4,11.1z\"\n      />\n      <path\n        class=\"st1\"\n        d=\"M11.5,104.6c-0.4-0.7-1.3-1-2-0.6c-0.7,0.4-1,1.3-0.6,2c7.8,13.9,20.3,24.9,35.2,30.8c0.8,0.3,1.6-0.1,1.9-0.8\n\t\ts-0.1-1.6-0.8-1.9C31,128.4,19.1,118,11.5,104.6z\"\n      />\n      <path\n        class=\"st1\"\n        d=\"M138.3,70.4c0.8,0,1.5,0.7,1.5,1.5c0,28.8-17.6,54.4-43.9,64.9c-0.8,0.3-1.6-0.1-2-0.8\n\t\tc-0.3-0.8,0.1-1.6,0.8-1.9c25.2-10.1,42.1-34.5,42.1-62.1C136.8,71.1,137.5,70.4,138.3,70.4z\"\n      />\n    </g>\n  </mask>\n</svg>\n", styles: [":host{display:block;width:150px;height:150px;margin:0 auto}svg{overflow:visible}\n"] }]
        }], propDecorators: { static: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItaWNvbi10b29scy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2Vycm9yLWljb25zL2Vycm9yLWljb24tdG9vbHMuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9lcnJvci1pY29ucy9lcnJvci1pY29uLXRvb2xzLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFtQmpELE1BQU0sT0FBTyx1QkFBdUI7O29IQUF2Qix1QkFBdUI7d0dBQXZCLHVCQUF1QiwyRkNuQnBDLHl5S0FnSEE7MkZEN0ZhLHVCQUF1QjtrQkFqQm5DLFNBQVM7K0JBQ0UsdUJBQXVCOzhCQWlCeEIsTUFBTTtzQkFBZCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWVycm9yLWljb24tdG9vbHMnLFxuICB0ZW1wbGF0ZVVybDogJy4vZXJyb3ItaWNvbi10b29scy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIHdpZHRoOiAxNTBweDtcbiAgICAgICAgaGVpZ2h0OiAxNTBweDtcbiAgICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgICB9XG4gICAgICBzdmcge1xuICAgICAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICAgIH1cbiAgICBgXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRXJyb3JJY29uVG9vbHNDb21wb25lbnQge1xuICBASW5wdXQoKSBzdGF0aWM6IGJvb2xlYW47XG59XG4iLCI8c3ZnXG4gIHZlcnNpb249XCIxLjFcIlxuICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgeD1cIjBweFwiXG4gIHk9XCIwcHhcIlxuICB2aWV3Qm94PVwiLTIgLTIgMTQyIDE0MlwiXG4gIHhtbDpzcGFjZT1cInByZXNlcnZlXCJcbiAgW25nQ2xhc3NdPVwieyBzdGF0aWM6IHN0YXRpYyB9XCJcbj5cbiAgPGRlZnM+XG4gICAgPGxpbmVhckdyYWRpZW50IHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIxMDAlXCIgeTI9XCIxMDAlXCIgaWQ9XCJhXCI+XG4gICAgICA8c3RvcCBzdG9wLWNvbG9yPVwidmFyKC0tcHJpbWFyeSlcIiBvZmZzZXQ9XCIwJVwiIC8+XG4gICAgICA8c3RvcCBzdG9wLWNvbG9yPVwidmFyKC0tc2Vjb25kYXJ5KVwiIG9mZnNldD1cIjEwMCVcIiAvPlxuICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gIDwvZGVmcz5cblxuICA8c3R5bGU+XG4gICAgI291dGVyX2NpcmNsZSB7XG4gICAgICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG4gICAgICBhbmltYXRpb246IHNwaW5uZXJfU3RLUyAzcyAyIGxpbmVhcjtcbiAgICAgIGFuaW1hdGlvbi1kaXJlY3Rpb246IHJldmVyc2U7XG4gICAgfVxuICAgICNpbm5lcl9jaXJjbGUge1xuICAgICAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xuICAgICAgYW5pbWF0aW9uOiBzcGlubmVyX1N0S1MgM3MgMiBsaW5lYXI7XG4gICAgfVxuXG4gICAgLnN0YXRpYyAjaW5uZXJfY2lyY2xlLFxuICAgIC5zdGF0aWMgI291dGVyX2NpcmNsZSB7XG4gICAgICBhbmltYXRpb246IG5vbmU7XG4gICAgfVxuXG4gICAgQGtleWZyYW1lcyBzcGlubmVyX1N0S1Mge1xuICAgICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gICAgICB9XG4gICAgfVxuICA8L3N0eWxlPlxuICA8cmVjdCB3aWR0aD1cIjE2MFwiIGhlaWdodD1cIjE2MFwiIGZpbGw9XCJ1cmwoI2EpXCIgbWFzaz1cInVybCgjaWNvbilcIj48L3JlY3Q+XG4gIDxtYXNrIGlkPVwiaWNvblwiPlxuICAgIDxnIGlkPVwiY2xvY2tcIiBmaWxsPVwiI2ZmZlwiPlxuICAgICAgPGc+XG4gICAgICAgIDxnPlxuICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICBjbGFzcz1cInN0MFwiXG4gICAgICAgICAgICBkPVwiTTQ2LjgsOTcuMWMtMS41LDEtMy41LDAuNy00LjMtMC41Yy0wLjYtMC45LTAuNi0yLjIsMC4xLTMuM2wwLjEtMC4xYzAuMy0wLjcsMC4xLTEuNS0wLjYtMS45XG5cdFx0XHRcdGMtMC43LTAuNC0xLjYtMC4yLTIuMSwwLjVjLTEuMiwyLjEtMS4yLDQuNywwLjEsNi41YzEuOCwyLjYsNS42LDMuMiw4LjQsMS4zYzAuNy0wLjQsMC45LTEuNCwwLjUtMi4xXG5cdFx0XHRcdEM0OC40LDk2LjgsNDcuNSw5Ni42LDQ2LjgsOTcuMXpcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgIGNsYXNzPVwic3QwXCJcbiAgICAgICAgICAgIGQ9XCJNODMuOSw4MS43Yy0wLjYtMC41LTEuNS0wLjQtMiwwLjFjLTAuNiwwLjYtMC42LDEuNSwwLDIuMWw5LjgsOS44bDAuMSwwLjFjMC42LDAuNSwxLjUsMC40LDItMC4xXG5cdFx0XHRcdGMwLjYtMC42LDAuNi0xLjUsMC0yLjFMODQsODEuOEw4My45LDgxLjd6XCJcbiAgICAgICAgICAvPlxuXG4gICAgICAgICAgPHBhdGggY2xhc3M9XCJzdDBcIiBkPVwiTTk0LDUwLjlDOTQsNTAuOSw5NCw1MC45LDk0LDUwLjlMOTQsNTAuOUw5NCw1MC45elwiIC8+XG5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk05MSw2OWMwLjEsMCwwLjIsMCwwLjIsMGMyLjctMC4yLDUuNS0xLDguMy0yLjZjMS40LTAuOCwyLjctMS45LDQuMS0zLjRjMi0yLjIsMy41LTQuOCw0LjMtNy45YzAuOC0zLjEsMC42LTYuMS0wLjEtOVxuXHRcdFx0XHRjLTAuNS0xLjktMS4yLTMuMy0xLjktNC42Yy0wLjUtMC44LTEuNy0xLTIuNC0wLjNMOTQsNTAuOWMwLDAsMCwwLDAsMGwwLDBsMCwwYy0xLjQsMS4xLTMuMywwLjktNC4zLTAuMmwtMC4xLTAuMVxuXHRcdFx0XHRjLTAuNi0wLjgtMC42LTIuMS0wLjEtMy4ybDAtMC4xbDkuOC0xMGMwLjctMC43LDAuNS0xLjgtMC4zLTIuM2MtMC41LTAuMy0xLTAuNS0xLjYtMC44Yy0xLTAuNC0yLTAuOC0zLjEtMS4xXG5cdFx0XHRcdGMtMy0wLjgtNi4yLTAuOC05LjUsMC4xYy01LjMsMS42LTguNyw1LTEwLjgsOC45Yy0xLjMsMi40LTEuOSw0LjgtMi4yLDcuMmwwLDAuMWMwLDAuNSwwLDEuMS0wLjEsMS43bDAsMC41XG5cdFx0XHRcdGMtMC4xLDAuOS0wLjEsMS4zLTAuMiwxLjhsLTAuMSwwLjJjLTAuMiwwLjctMC41LDEuNS0xLjEsMi4zbC0wLjEsMC4yTDY3LDU5LjNsLTAuMywwLjNsLTcuOC03LjhsMC00LjlsMC0wLjFcblx0XHRcdFx0YzAtMC4zLTAuMi0wLjctMC40LTAuOUw0OCwzNS40bC0wLjEtMC4xYy0wLjYtMC41LTEuNS0wLjQtMiwwLjFMMzUuNSw0NS44bC0wLjEsMC4xYy0wLjUsMC42LTAuNCwxLjUsMC4xLDJsMTAuNCwxMC40bDAuMSwwLjFcblx0XHRcdFx0YzAuMywwLjIsMC42LDAuMywwLjksMC4zbDQuOSwwbDcuNiw3LjZMNDMuNiw4MS44Yy0zLjUsMy40LTUuNSw1LjMtNy4xLDYuOWMtMy45LDQuMS0zLjksMTAuNS0wLjIsMTQuNFxuXHRcdFx0XHRjMy45LDQuMSwxMC41LDQuMiwxNC43LDAuM2wxLjgtMS43TDY5LjIsODZsMTYuNywxNi43bDAuMiwwLjJjNC43LDQuNCwxMi4xLDQuNCwxNi43LTAuMmM0LjctNC43LDQuNy0xMi4yLDAtMTYuOUw4Ni44LDY5Ljhcblx0XHRcdFx0YzAuNC0wLjIsMC43LTAuMywxLjEtMC40Qzg5LDY5LDkwLDY5LDkxLDY5eiBNNTMuNiw1Ni4zbC0wLjEtMC4xYy0wLjMtMC4yLTAuNi0wLjMtMC45LTAuM2wtNC45LDBsLTguOS04LjlsOC4zLTguM2w4LjksOC45XG5cdFx0XHRcdGwwLDQuOWwwLDAuMWMwLDAuMywwLjIsMC43LDAuNCwwLjlsOC4yLDguMmMtMC44LDAuOC0xLjgsMS43LTIuOSwyLjhMNTMuNiw1Ni4zeiBNMTAwLjcsODhsMC4yLDAuMmMzLjMsMy41LDMuMiw5LTAuMiwxMi40XG5cdFx0XHRcdGMtMy41LDMuNS05LjIsMy41LTEyLjcsMEw3MS40LDg0bDEtMWMxLjQtMS4zLDIuMy0yLjIsMi43LTIuNmw0LjItNC4ybDIuOS0yLjljMC43LTAuNywxLjItMS4yLDEuNy0xLjZjMC4xLTAuMSwwLjItMC4yLDAuNC0wLjNcblx0XHRcdFx0TDEwMC43LDg4eiBNODMuNyw2OC4xYy0wLjIsMC4xLTAuNCwwLjMtMC42LDAuNGMtMC40LDAuMy0wLjgsMC42LTEuMiwxbC0wLjQsMC4zYy0wLjMsMC4zLTAuNiwwLjYtMSwwLjlsLTAuNywwLjdMNzYsNzUuM1xuXHRcdFx0XHRsLTMuNCwzLjRDNzEuMiw4MCw2Ny41LDgzLjYsNjIsODguOGwtMTIuNiwxMi4xYy0zLDMuMS04LDMuMS0xMC44LDAuMmMtMi42LTIuOC0yLjYtNy4zLDAuMS0xMC4ybDIuMi0yLjJjMC44LTAuOCwxLjgtMS44LDMtMi45XG5cdFx0XHRcdGwyNC45LTI0YzEuNS0xLjUsMi43LTIuNiwzLjYtMy42bDAuMS0wLjFjMS4xLTEuNCwxLjctMi43LDItNGMwLjEtMC41LDAuMi0xLDAuMi0xLjhsMC4xLTAuOGMwLTAuNSwwLjEtMSwwLjEtMS40bDAtMC40bDAsMGwwLDBcblx0XHRcdFx0bDAsMGMwLjItMiwwLjctNCwxLjgtNmMxLjgtMy4zLDQuNi02LjIsOS03LjVjMi43LTAuOCw1LjMtMC43LDcuOS0wLjFsMC41LDAuMWMwLjUsMC4xLDAuOSwwLjMsMS4zLDAuNGwwLjQsMC4ybC04LjUsOC43XG5cdFx0XHRcdGMtMC4xLDAuMS0wLjEsMC4yLTAuMiwwLjNjLTEuNCwyLjItMS4zLDUuMSwwLjMsN2MyLDIuNCw1LjksMi43LDguNSwwLjZsMC4xLTAuMWw4LjEtOC4xbDAsMC4xYzAuMiwwLjYsMC41LDEuMiwwLjcsMS45XG5cdFx0XHRcdGMwLjYsMi40LDAuNyw0LjksMC4xLDcuNWMtMC42LDIuNi0xLjksNC43LTMuNiw2LjVjLTEuMiwxLjItMi4zLDIuMS0zLjQsMi44TDkxLjQsNjZsLTAuMywwYzAsMCwwLjEsMCwwLjEsMGwtMC4xLDBsMCwwXG5cdFx0XHRcdGMtMS4zLTAuMS0yLjYsMC00LjEsMC40Qzg1LjgsNjYuOCw4NC44LDY3LjMsODMuNyw2OC4xelwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9nPlxuICAgIDwvZz5cbiAgICA8ZyBpZD1cImlubmVyX2NpcmNsZVwiIGZpbGw9XCIjZmZmXCI+XG4gICAgICA8cGF0aFxuICAgICAgICBjbGFzcz1cInN0MVwiXG4gICAgICAgIGQ9XCJNMTIxLjYsNDguM2MtOS4yLTE5LjktMjkuMS0zMi45LTUxLjQtMzIuOWMtOS42LDAtMTguOCwyLjQtMjcuMSw2LjljLTAuNywwLjQtMSwxLjMtMC42LDJcblx0XHRjMC40LDAuNywxLjMsMSwyLDAuNmM3LjgtNC4zLDE2LjYtNi41LDI1LjYtNi41YzIxLjEsMCw0MCwxMi4zLDQ4LjcsMzEuMmMwLjMsMC44LDEuMiwxLjEsMiwwLjdDMTIxLjYsNTAsMTIxLjksNDkuMSwxMjEuNiw0OC4zelwiXG4gICAgICAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgY2xhc3M9XCJzdDFcIlxuICAgICAgICBkPVwiTTE1LjEsNzAuNWMwLjgsMCwxLjUsMC43LDEuNSwxLjVjMCwyOS42LDI0LDUzLjYsNTMuNiw1My42YzI0LjYsMCw0NS45LTE2LjgsNTEuOS00MC4zYzAuMi0wLjgsMS0xLjMsMS44LTEuMVxuXHRcdGMwLjgsMC4yLDEuMywxLDEuMSwxLjhjLTYuMywyNC45LTI4LjgsNDIuNS01NC44LDQyLjVjLTMxLjMsMC01Ni42LTI1LjMtNTYuNi01Ni42QzEzLjYsNzEuMiwxNC4yLDcwLjUsMTUuMSw3MC41elwiXG4gICAgICAvPlxuICAgIDwvZz5cbiAgICA8ZyBpZD1cIm91dGVyX2NpcmNsZVwiIGZpbGw9XCIjZmZmXCI+XG4gICAgICA8cGF0aFxuICAgICAgICBjbGFzcz1cInN0MVwiXG4gICAgICAgIGQ9XCJNMTA0LjQsMTEuMUM5NCw1LjIsODIuMiwyLDY5LjksMkMzMS4zLDIsMCwzMy4zLDAsNzEuOWMwLDAuOCwwLjcsMS41LDEuNSwxLjVjMC44LDAsMS41LTAuNywxLjUtMS41XG5cdFx0QzMsMzUsMzMsNSw2OS45LDVjMTEuNywwLDIzLDMsMzMsOC43YzAuNywwLjQsMS42LDAuMiwyLTAuNkMxMDUuNCwxMi40LDEwNS4xLDExLjUsMTA0LjQsMTEuMXpcIlxuICAgICAgLz5cbiAgICAgIDxwYXRoXG4gICAgICAgIGNsYXNzPVwic3QxXCJcbiAgICAgICAgZD1cIk0xMS41LDEwNC42Yy0wLjQtMC43LTEuMy0xLTItMC42Yy0wLjcsMC40LTEsMS4zLTAuNiwyYzcuOCwxMy45LDIwLjMsMjQuOSwzNS4yLDMwLjhjMC44LDAuMywxLjYtMC4xLDEuOS0wLjhcblx0XHRzLTAuMS0xLjYtMC44LTEuOUMzMSwxMjguNCwxOS4xLDExOCwxMS41LDEwNC42elwiXG4gICAgICAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgY2xhc3M9XCJzdDFcIlxuICAgICAgICBkPVwiTTEzOC4zLDcwLjRjMC44LDAsMS41LDAuNywxLjUsMS41YzAsMjguOC0xNy42LDU0LjQtNDMuOSw2NC45Yy0wLjgsMC4zLTEuNi0wLjEtMi0wLjhcblx0XHRjLTAuMy0wLjgsMC4xLTEuNiwwLjgtMS45YzI1LjItMTAuMSw0Mi4xLTM0LjUsNDIuMS02Mi4xQzEzNi44LDcxLjEsMTM3LjUsNzAuNCwxMzguMyw3MC40elwiXG4gICAgICAvPlxuICAgIDwvZz5cbiAgPC9tYXNrPlxuPC9zdmc+XG4iXX0=
import { Component, Input } from '@angular/core';
export class PbdsPageTitleComponent {
    constructor() {
        this.layout = 'container';
    }
}
PbdsPageTitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-page-title',
                template: "<div class=\"page-header\">\n  <div class=\"page-title\" [ngClass]=\"layout\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <h1 [ngClass]=\"{ 'mb-0': sub, 'has-sub': sub }\">{{ ttl }}</h1>\n        <h2>{{ sub }}</h2>\n      </div>\n    </div>\n  </div>\n</div>\n",
                styles: [".page-header h1.has-sub{margin-bottom:0;margin-top:85px}.page-title h1.mb-0+h2{font-size:16px;line-height:1.4;margin-bottom:25px}"]
            },] }
];
PbdsPageTitleComponent.propDecorators = {
    ttl: [{ type: Input }],
    sub: [{ type: Input }],
    layout: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS10aXRsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3N0MDE2bG8vZ2l0aHViL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9zcmMvIiwic291cmNlcyI6WyJsaWIvcGFnZS10aXRsZS9wYWdlLXRpdGxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU9qRCxNQUFNLE9BQU8sc0JBQXNCO0lBTG5DO1FBVVcsV0FBTSxHQUFHLFdBQVcsQ0FBQztJQUNoQyxDQUFDOzs7WUFYQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0Isa1NBQTBDOzthQUUzQzs7O2tCQUVFLEtBQUs7a0JBRUwsS0FBSztxQkFFTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLXBhZ2UtdGl0bGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGFnZS10aXRsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BhZ2UtdGl0bGUuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzUGFnZVRpdGxlQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgdHRsOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHN1Yj86IHN0cmluZztcbiAgQElucHV0KCkgbGF5b3V0ID0gJ2NvbnRhaW5lcic7XG59XG4iXX0=
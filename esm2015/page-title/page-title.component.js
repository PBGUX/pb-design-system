import { Component, Input } from '@angular/core';
export class PbdsPageTitleComponent {
    constructor() {
        this.layout = 'container';
    }
}
PbdsPageTitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-page-title',
                template: "<div class=\"page-header\">\n  <div class=\"page-title\" [ngClass]=\"layout\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <h1 [ngClass]=\"{ 'mb-0': sub, 'has-sub': sub }\">{{ ttl }}</h1>\n        <h2 *ngIf=\"sub\">{{ sub }}</h2>\n      </div>\n    </div>\n  </div>\n</div>\n",
                styles: [".page-header h1.has-sub{margin-top:85px;margin-bottom:0}.page-title h1.mb-0+h2{font-size:16px;margin-bottom:25px;line-height:1.4}\n"]
            },] }
];
PbdsPageTitleComponent.propDecorators = {
    ttl: [{ type: Input }],
    sub: [{ type: Input }],
    layout: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS10aXRsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL3BhZ2UtdGl0bGUvcGFnZS10aXRsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPakQsTUFBTSxPQUFPLHNCQUFzQjtJQUxuQztRQVVXLFdBQU0sR0FBRyxXQUFXLENBQUM7SUFDaEMsQ0FBQzs7O1lBWEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLGdUQUEwQzs7YUFFM0M7OztrQkFFRSxLQUFLO2tCQUVMLEtBQUs7cUJBRUwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1wYWdlLXRpdGxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BhZ2UtdGl0bGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wYWdlLXRpdGxlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc1BhZ2VUaXRsZUNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHR0bDogc3RyaW5nO1xuICBASW5wdXQoKVxuICBzdWI/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGxheW91dCA9ICdjb250YWluZXInO1xufVxuIl19
import { Directive, HostListener, HostBinding } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class PbdsHeaderShadowDirective {
    constructor(_scroll) {
        this._scroll = _scroll;
    }
    onWindowScroll() {
        const offset = this._scroll.getScrollPosition();
        this.shadow = offset[1] > 20;
    }
}
PbdsHeaderShadowDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsHeaderShadowDirective, deps: [{ token: i1.ViewportScroller }], target: i0.ɵɵFactoryTarget.Directive });
PbdsHeaderShadowDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.12", type: PbdsHeaderShadowDirective, selector: "header.bg-brand-header", host: { listeners: { "window:scroll": "onWindowScroll()" }, properties: { "class.pbds-header-shadow": "this.shadow" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsHeaderShadowDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'header.bg-brand-header'
                }]
        }], ctorParameters: function () { return [{ type: i1.ViewportScroller }]; }, propDecorators: { shadow: [{
                type: HostBinding,
                args: ['class.pbds-header-shadow']
            }], onWindowScroll: [{
                type: HostListener,
                args: ['window:scroll', []]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLXNoYWRvdy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2hlYWRlci1zaGFkb3cvaGVhZGVyLXNoYWRvdy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFNckUsTUFBTSxPQUFPLHlCQUF5QjtJQVNwQyxZQUFvQixPQUF5QjtRQUF6QixZQUFPLEdBQVAsT0FBTyxDQUFrQjtJQUFHLENBQUM7SUFMZCxjQUFjO1FBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDL0IsQ0FBQzs7dUhBUFUseUJBQXlCOzJHQUF6Qix5QkFBeUI7NEZBQXpCLHlCQUF5QjtrQkFIckMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2lCQUNuQzt1R0FHQyxNQUFNO3NCQURMLFdBQVc7dUJBQUMsMEJBQTBCO2dCQUdKLGNBQWM7c0JBQWhELFlBQVk7dUJBQUMsZUFBZSxFQUFFLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEhvc3RMaXN0ZW5lciwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdoZWFkZXIuYmctYnJhbmQtaGVhZGVyJ1xufSlcbmV4cG9ydCBjbGFzcyBQYmRzSGVhZGVyU2hhZG93RGlyZWN0aXZlIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWhlYWRlci1zaGFkb3cnKVxuICBzaGFkb3c6IGJvb2xlYW47XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnNjcm9sbCcsIFtdKSBvbldpbmRvd1Njcm9sbCgpIHtcbiAgICBjb25zdCBvZmZzZXQgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICB0aGlzLnNoYWRvdyA9IG9mZnNldFsxXSA+IDIwO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxufVxuIl19
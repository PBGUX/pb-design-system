import { Directive, HostListener, HostBinding } from '@angular/core';
import { ViewportScroller } from '@angular/common';
export class PbdsHeaderShadowDirective {
    constructor(_scroll) {
        this._scroll = _scroll;
    }
    onWindowScroll() {
        const offset = this._scroll.getScrollPosition();
        this.shadow = offset[1] > 20;
    }
}
PbdsHeaderShadowDirective.decorators = [
    { type: Directive, args: [{
                selector: 'header.bg-brand-header'
            },] }
];
PbdsHeaderShadowDirective.ctorParameters = () => [
    { type: ViewportScroller }
];
PbdsHeaderShadowDirective.propDecorators = {
    shadow: [{ type: HostBinding, args: ['class.pbds-header-shadow',] }],
    onWindowScroll: [{ type: HostListener, args: ['window:scroll', [],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLXNoYWRvdy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3N0MDE2bG8vZ2l0aHViL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9zcmMvIiwic291cmNlcyI6WyJsaWIvaGVhZGVyLXNoYWRvdy9oZWFkZXItc2hhZG93LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFLbkQsTUFBTSxPQUFPLHlCQUF5QjtJQVNwQyxZQUFvQixPQUF5QjtRQUF6QixZQUFPLEdBQVAsT0FBTyxDQUFrQjtJQUFHLENBQUM7SUFMZCxjQUFjO1FBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDL0IsQ0FBQzs7O1lBVkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx3QkFBd0I7YUFDbkM7OztZQUpRLGdCQUFnQjs7O3FCQU10QixXQUFXLFNBQUMsMEJBQTBCOzZCQUd0QyxZQUFZLFNBQUMsZUFBZSxFQUFFLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEhvc3RMaXN0ZW5lciwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZpZXdwb3J0U2Nyb2xsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdoZWFkZXIuYmctYnJhbmQtaGVhZGVyJ1xufSlcbmV4cG9ydCBjbGFzcyBQYmRzSGVhZGVyU2hhZG93RGlyZWN0aXZlIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLWhlYWRlci1zaGFkb3cnKVxuICBzaGFkb3c6IGJvb2xlYW47XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnNjcm9sbCcsIFtdKSBvbldpbmRvd1Njcm9sbCgpIHtcbiAgICBjb25zdCBvZmZzZXQgPSB0aGlzLl9zY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICB0aGlzLnNoYWRvdyA9IG9mZnNldFsxXSA+IDIwO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfc2Nyb2xsOiBWaWV3cG9ydFNjcm9sbGVyKSB7fVxufVxuIl19
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLXNoYWRvdy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2RhMDU3Y28vRGVza3RvcC9Db2RlL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9oZWFkZXItc2hhZG93LyIsInNvdXJjZXMiOlsiaGVhZGVyLXNoYWRvdy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBS25ELE1BQU0sT0FBTyx5QkFBeUI7SUFTcEMsWUFBb0IsT0FBeUI7UUFBekIsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7SUFBRyxDQUFDO0lBTGQsY0FBYztRQUMvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQy9CLENBQUM7OztZQVZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2FBQ25DOzs7WUFKUSxnQkFBZ0I7OztxQkFNdEIsV0FBVyxTQUFDLDBCQUEwQjs2QkFHdEMsWUFBWSxTQUFDLGVBQWUsRUFBRSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0TGlzdGVuZXIsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaGVhZGVyLmJnLWJyYW5kLWhlYWRlcidcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0hlYWRlclNoYWRvd0RpcmVjdGl2ZSB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1oZWFkZXItc2hhZG93JylcbiAgc2hhZG93OiBib29sZWFuO1xuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpzY3JvbGwnLCBbXSkgb25XaW5kb3dTY3JvbGwoKSB7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgdGhpcy5zaGFkb3cgPSBvZmZzZXRbMV0gPiAyMDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcikge31cbn1cbiJdfQ==